#!/usr/bin/env node
// 제미나이 파이프라인 종단 시험 (오프라인). 실제 키·네트워크 없이 mock-server.mjs 로 검증한다.
// 모든 출력은 OS 임시 폴더에만 쓰고 끝나면 지운다. game/assets 는 건드리지 않는다(마지막에 확인).
//
//   node tools/gemini/test-pipeline.mjs          # 통과하면 exit 0
//   node tools/gemini/test-pipeline.mjs --keep   # 임시 폴더를 지우지 않고 경로 출력 (디버깅)
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync, statSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { tmpdir } from 'node:os';
import * as L from './lib.mjs';
import { makePng, TINY_JPEG_16x9 } from './mock-server.mjs';
import { endingEntry } from './build-manifest.mjs';
import { extractImage } from './generate.mjs';
import { BG, NPC, UI, CHAR_KEYS, SIZES } from '../../js/data/images.js';
import { ENDINGS } from '../../js/data/endings.js';

const args = L.parseArgs();
const NODE = process.execPath;
const tool = (f) => join(L.TOOLS_DIR, f);
const results = [];
const ok = (name, cond, detail = '') => { results.push({ name, pass: !!cond, detail }); console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail && !cond ? `\n        ${String(detail).split('\n').slice(0, 12).join('\n        ')}` : ''}`); return !!cond; };
const section = (t) => console.log(`\n[${t}]`);

const baseEnv = { ...process.env, GEMINI_BACKOFF_MS: '20', GEMINI_NO_REEXEC: '1', NODE_NO_WARNINGS: '1' };
for (const k of ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_IMAGE_MODEL', 'GEMINI_API_BASE', 'GEMINI_RPM', 'NODE_USE_ENV_PROXY']) delete baseEnv[k];
const allOutputs = []; // 모든 실행의 출력 (키 유출 검사용)
function run(script, argv, env = {}) {
  const r = spawnSync(NODE, [tool(script), ...argv], { env: { ...baseEnv, ...env }, encoding: 'utf8', timeout: 180000 });
  const out = (r.stdout || '') + (r.stderr || '');
  allOutputs.push(out);
  return { code: r.status, out };
}
const sizeOk = (file, e) => { if (!existsSync(file)) return false; const s = L.imageSize(file); return s && s.format === 'PNG' && s.width === e.width && s.height === e.height; };
const readLog = (f) => existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : [];

// game/assets 폴더 전체(하위 폴더 포함)의 상태 스냅숏: 파일 목록 + 크기 + 수정 시각. 시험 전후가 같아야 한다.
function assetSnapshot() {
  const out = {};
  const walk = (d) => { if (!existsSync(d)) return; for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) walk(p); else { const st = statSync(p); out[relative(L.ASSETS_DIR, p)] = `${st.size}:${st.mtimeMs}`; } } };
  walk(L.ASSETS_DIR);
  return out;
}
// 출력·로그·폴더 안의 모든 텍스트에서 비밀 문자열 찾기 (키 유출 검사)
function leaks(secret, ...texts) { return texts.some(t => t && t.includes(secret)); }
function filesContaining(dir, secret) {
  const hits = [];
  const walk = (d) => { if (!existsSync(d)) return; for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) walk(p); else if (readFileSync(p).includes(secret)) hits.push(p); } };
  walk(dir);
  return hits;
}

async function startMock(flags) {
  const child = spawn(NODE, [tool('mock-server.mjs'), '--port=0', ...flags], { stdio: ['ignore', 'pipe', 'inherit'] });
  const port = await new Promise((res, rej) => {
    let buf = '';
    const t = setTimeout(() => rej(new Error('mock did not start')), 10000);
    child.stdout.on('data', d => { buf += d; const m = /MOCK_LISTENING (\d+)/.exec(buf); if (m) { clearTimeout(t); res(Number(m[1])); } });
    child.on('exit', c => rej(new Error(`mock exited ${c}`)));
  });
  return { child, port, base: `http://127.0.0.1:${port}`, requests: async () => (await fetch(`http://127.0.0.1:${port}/__mock/requests`)).json() };
}

async function main() {
  const tmp = mkdtempSync(join(tmpdir(), 'starborn-gemini-test-'));
  const mocks = [];
  const snapBefore = assetSnapshot(); // 맨 처음에 찍는다: 이후 모든 단계가 game/assets 를 건드리지 않아야 한다
  try {
    // ── 1. 매니페스트 ─────────────────────────────────────────────
    section('build-manifest');
    const mPath = join(tmp, 'manifest.json');
    let r = run('build-manifest.mjs', [`--out=${mPath}`]);
    ok('build-manifest exit 0', r.code === 0, r.out);
    const first = readFileSync(mPath, 'utf8');
    run('build-manifest.mjs', [`--out=${mPath}`]);
    ok('재실행해도 같은 결과 (결정적)', readFileSync(mPath, 'utf8') === first);
    const manifest = JSON.parse(first);
    const keys = new Set(manifest.entries.map(e => e.key));
    const required = ['ref/luna_sheet', ...CHAR_KEYS, ...Object.keys(BG), ...Object.keys(NPC), ...Object.keys(UI), ...ENDINGS.map(e => `ending/${e.id}`)];
    const missing = required.filter(k => !keys.has(k));
    ok(`필수 키 ${required.length}개 모두 포함 (매니페스트 ${manifest.entries.length}개)`, !missing.length, missing.join(', '));
    ok('캐릭터 초상 20장', manifest.entries.filter(e => e.group === 'char').length === 20);
    ok('캐릭터 시트가 1번', manifest.entries[0].key === 'ref/luna_sheet');
    const byKey = new Map(manifest.entries.map(e => [e.key, e]));
    ok('모든 char/* 가 캐릭터 시트를 참조', manifest.entries.filter(e => e.group === 'char').every(e => e.refs[0] === 'ref/luna_sheet'));
    ok('모든 프롬프트에 스타일 앵커 포함', manifest.entries.every(e => e.prompt.startsWith('[STYLE ANCHOR')));
    ok('엔딩 프롬프트에 에필로그·성인(28세) 지시 포함', manifest.entries.filter(e => e.group === 'ending').every(e => e.prompt.includes('Epilogue') && e.prompt.includes('around 28')));
    ok('필드 형식 (path/aspect/negative)', manifest.entries.every(e => e.path === `assets/${e.key}.png` && ['16:7', '3:4', '16:9'].includes(e.aspect) && /watermark/.test(e.negative)));
    ok('참조는 항상 앞 번호', manifest.entries.every(e => e.refs.every(rk => byKey.get(rk)?.order < e.order)));
    const ext = endingEntry({ id: 'zz_rival', name: '평생의 라이벌', cat: '관계', epilogue: '{name과} 테오도라는 매년 무도회에서 겨룬다. 승부는 아직이다.' });
    ok('확장 엔딩: 에필로그의 NPC 이름 자동 감지 → npc 참조', ext.refs.includes('npc/theodora') && ext.prompt.includes('루나와 테오도라는'), JSON.stringify(ext.refs));
    const fnEnd = endingEntry({ id: 'zz_fn', name: '함수형', cat: '히든', hidden: true, epilogue: (st) => `{name은} ${st.legacy?.length ?? 0}명의 언니와 별을 본다.` });
    ok('함수형 에필로그: 소스 코드가 아니라 예시 문장이 들어감', !/=>|\$\{/.test(fnEnd.prompt) && fnEnd.prompt.includes('루나는 0명의 언니와') && fnEnd.ending.epilogueVaries === true, fnEnd.prompt.split('\n').find(l => l.startsWith('Epilogue')));
    ok('함수형 에필로그가 있는 실제 엔딩도 코드 조각 없음 (guardian_successor·legacy_sisters 등)', manifest.entries.every(e => !/=>|\bfunction\s*\w*\s*\(|\$\{/.test(e.prompt)), manifest.entries.filter(e => /=>|\$\{/.test(e.prompt)).map(e => e.key).join(', '));
    ok('치환 안 된 {name}/{call} 토큰 없음', manifest.entries.every(e => !/\{(name|call)/.test(e.prompt)));
    ok('엔딩 제목 표기에 "히든, 히든" 중복 없음', manifest.entries.every(e => !e.prompt.includes('히든, 히든')));
    ok('모든 항목 크기 = images.js SIZES (ref 1600×900)', manifest.entries.every(e => { const w = e.group === 'ref' ? [1600, 900] : SIZES[e.group]; return w && e.width === w[0] && e.height === w[1]; }),
      manifest.entries.filter(e => e.group !== 'ref' && (e.width !== SIZES[e.group]?.[0] || e.height !== SIZES[e.group]?.[1])).map(e => e.key).join(', '));
    ok(`엔딩 ${ENDINGS.length}종 전부(확장 포함) 매니페스트에 있음`, ENDINGS.every(e => keys.has(`ending/${e.id}`)) && manifest.entries.filter(e => e.group === 'ending').length === ENDINGS.length);
    ok('모든 항목에 단정함 금지 목록, 공주 그림엔 나이 원칙', manifest.entries.every(e => /revealing/.test(e.negative)) &&
      manifest.entries.filter(e => e.group === 'char' && e.age <= 14).every(e => /adult body proportions/.test(e.negative)) &&
      manifest.entries.filter(e => e.prompt.includes('[CHARACTER — 루나')).every(e => /Modesty rule/.test(e.prompt)));
    ok('특정 작가·스튜디오 화풍 지명 없음', manifest.entries.every(e => !/in the style of|ghibli|makoto|shinkai|kyoto animation|mucha|artstation|pixiv|trending on/i.test(e.prompt) && !/\b(style of|by|artist) [A-Z][a-z]+ [A-Z][a-z]+/.test(e.prompt)));
    r = spawnSync(NODE, [tool('build-manifest.mjs'), '--stdout'], { env: baseEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    let parsed = null; try { parsed = JSON.parse(r.stdout); } catch { /* 잘림 */ }
    ok('--stdout 출력이 파이프에서 잘리지 않음 (완전한 JSON)', r.status === 0 && parsed?.entries?.length === manifest.entries.length, `${r.stdout.length} chars`);
    // 저장소의 manifest.json / gemini-prompts.md 가 지금 게임 데이터와 맞는지 (읽기만 함). 다르면 새 엔딩·배경이 그릴 목록에서 빠진다.
    r = run('build-manifest.mjs', ['--check']);
    ok('game/assets/manifest.json 이 최신 (아니면: node tools/gemini/build-manifest.mjs && node tools/gemini/chrome-batch.mjs)', r.code === 0, r.out);
    const mdNow = join(tmp, 'prompts-now.md');
    run('chrome-batch.mjs', [`--out=${mdNow}`]);
    ok('game/assets/gemini-prompts.md 가 manifest.json 과 일치 (아니면: node tools/gemini/chrome-batch.mjs)', existsSync(L.PROMPTS_MD_PATH) && existsSync(mdNow) && readFileSync(mdNow, 'utf8') === readFileSync(L.PROMPTS_MD_PATH, 'utf8'));

    const endingWithNpc = manifest.entries.find(e => e.group === 'ending' && e.refs.length >= 2);
    const npcRef = endingWithNpc.refs.find(k => k.startsWith('npc/'));
    const mainKeys = ['ref/luna_sheet', 'char/child_body', 'char/adult_social', npcRef, 'bg/room_spring', 'bg/room_winter', endingWithNpc.key, 'ui/title_key'];

    // ── 2. 키 없음 / dry-run ─────────────────────────────────────
    section('키 없음 · dry-run');
    const o1 = join(tmp, 'out1');
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o1}`]);
    ok('키 없으면 exit 2', r.code === 2, r.out);
    ok('키 없음 안내에 GEMINI_API_KEY·환경변수 설명', /GEMINI_API_KEY/.test(r.out) && /Edit/.test(r.out) && /채팅에 붙여넣지/.test(r.out));
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o1}`, '--dry-run']);
    ok('dry-run exit 0 (키 없이)', r.code === 0, r.out);
    ok(`dry-run이 ${manifest.entries.length}장 계획을 출력`, r.out.includes(`생성 예정 ${manifest.entries.length}장`), r.out.slice(0, 600));
    ok('dry-run은 파일을 만들지 않음', !existsSync(o1));

    // ── 3. 목업으로 실제 생성 ───────────────────────────────────
    section('목업 API로 생성 (TEXT,IMAGE 폴백 · 429/503 재시도 · 참조 첨부)');
    const SECRET = 'mock-key-7f3a9cSECRET';
    const mock = await startMock(['--reject-image-only', '--flaky=4', `--require-key=${SECRET}`]);
    mocks.push(mock);
    const env = { GEMINI_API_KEY: SECRET, GEMINI_API_BASE: mock.base };
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o1}`, `--keys=${mainKeys.join(',')}`, '--concurrency=2', '--rpm=0', '--no-pause'], env);
    ok('생성 exit 0', r.code === 0, r.out);
    ok('모델 자동 선택 = gemini-3-pro-image-preview (페이지 넘김 포함)', /모델 자동 선택: gemini-3-pro-image-preview/.test(r.out), r.out.slice(0, 400));
    for (const k of mainKeys) ok(`${k} → ${byKey.get(k).width}×${byKey.get(k).height} PNG`, sizeOk(L.targetPath(o1, k), byKey.get(k)));
    let reqs = await mock.requests();
    const firstOf = (k) => reqs.find(q => q.key === k);
    const okOf = (k) => reqs.filter(q => q.key === k && q.status === 200);
    ok('요청 본문이 실제 API 형식 검사 통과 (contents/parts/inlineData{mimeType,data}/generationConfig.imageConfig.aspectRatio)', reqs.length > 0 && reqs.every(q => !q.invalid), JSON.stringify(reqs.filter(q => q.invalid)));
    ok('키는 x-goog-api-key 헤더로만 전송 (URL 쿼리 아님)', reqs.every(q => q.keyVia === 'header'));
    ok('IMAGE 단독 400 → TEXT,IMAGE 로 폴백', reqs.some(q => q.status === 400 && q.modalities.join() === 'IMAGE') && reqs.some(q => q.status === 200 && q.modalities.join() === 'TEXT,IMAGE'));
    ok('429·503 재시도 후 성공', reqs.some(q => q.status === 429) && reqs.some(q => q.status === 503));
    ok('캐릭터 시트 요청: 첨부 0장, 16:9', okOf('ref/luna_sheet')[0]?.inline === 0 && okOf('ref/luna_sheet')[0]?.aspect === '16:9');
    ok('char/*: 시트 1장 첨부(JPEG 축소), 3:4', ['char/child_body', 'char/adult_social'].every(k => okOf(k)[0]?.inline === 1 && okOf(k)[0]?.inlineMimes[0] === 'image/jpeg' && okOf(k)[0]?.aspect === '3:4'));
    ok(`${endingWithNpc.key}: 시트+${npcRef} 첨부 ${endingWithNpc.refs.length}장, 16:9`, okOf(endingWithNpc.key)[0]?.inline === endingWithNpc.refs.length && okOf(endingWithNpc.key)[0]?.aspect === '16:9');
    ok('bg(16:7): API 비율 21:9로 요청, room_winter는 room_spring 첨부', okOf('bg/room_spring')[0]?.aspect === '21:9' && okOf('bg/room_winter')[0]?.inline === 1);
    ok('의존 순서: 시트 완성 뒤에 char 요청 시작', firstOf('char/child_body')?.n > okOf('ref/luna_sheet')[0]?.n);
    let log = readLog(join(o1, 'generation-log.json'));
    ok('generation-log.json: 키별 ok 기록 (model·bytes·time)', mainKeys.every(k => log.some(x => x.key === k && x.status === 'ok' && x.model && x.bytes > 0 && x.time)));

    section('건너뛰기 · --force · --limit');
    const before = reqs.length;
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o1}`, `--keys=${mainKeys.join(',')}`, '--rpm=0'], env);
    reqs = await mock.requests();
    ok('이미 있는 파일은 건너뜀 (요청 0)', r.code === 0 && reqs.length === before && /건너뜀|생성할 것이 없습니다/.test(r.out), r.out);
    const mt = statSync(L.targetPath(o1, 'char/child_body')).mtimeMs;
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o1}`, '--keys=char/child_body', '--force', '--rpm=0'], env);
    ok('--force 로 다시 생성', r.code === 0 && statSync(L.targetPath(o1, 'char/child_body')).mtimeMs !== mt && sizeOk(L.targetPath(o1, 'char/child_body'), byKey.get('char/child_body')), r.out);
    const npcBefore = manifest.entries.filter(e => e.group === 'npc' && existsSync(L.targetPath(o1, e.key))).length;
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o1}`, '--only=npc/', '--limit=2', '--rpm=0'], env);
    const npcAfter = manifest.entries.filter(e => e.group === 'npc' && existsSync(L.targetPath(o1, e.key))).length;
    ok('--only=npc/ --limit=2 → 정확히 2장 추가', r.code === 0 && npcAfter - npcBefore === 2, r.out);

    section('잘못된 키');
    const o7 = join(tmp, 'out7');
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o7}`, '--keys=bg/river', '--rpm=0'], { ...env, GEMINI_API_KEY: 'wrong-key' });
    ok('ListModels 단계에서 키 오류 → exit 3, 파일 없음', r.code === 3 && /API key not valid/.test(r.out) && !existsSync(L.targetPath(o7, 'bg/river')), r.out);
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o7}`, '--keys=bg/river,bg/forest', '--rpm=0', '--concurrency=1'], { ...env, GEMINI_API_KEY: 'wrong-key', GEMINI_IMAGE_MODEL: 'gemini-2.5-flash-image' });
    ok('모델 고정 시 생성 단계 키 오류 → 즉시 중단 exit 3 (나머지 미실행)', r.code === 3 && /미실행 1/.test(r.out) && !existsSync(L.targetPath(o7, 'bg/forest')), r.out);

    section('캐릭터 시트 확인 단계 (시트만 먼저 → 같은 명령 재실행으로 이어서)');
    const o6 = join(tmp, 'out6');
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o6}`, '--keys=ref/luna_sheet,char/girl_body', '--rpm=0'], env);
    ok('1단계: 시트만 생성하고 멈춤 (exit 0)', r.code === 0 && existsSync(L.targetPath(o6, 'ref/luna_sheet')) && !existsSync(L.targetPath(o6, 'char/girl_body')) && /1단계 완료/.test(r.out), r.out);
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o6}`, '--keys=ref/luna_sheet,char/girl_body', '--rpm=0'], env);
    ok('2단계: 같은 명령 재실행 → 시트는 건너뛰고 나머지 생성', r.code === 0 && sizeOk(L.targetPath(o6, 'char/girl_body'), byKey.get('char/girl_body')) && (await mock.requests()).at(-1).inline === 1, r.out);

    section('참조 없음 보류 · 실패 시 파일 없음');
    const o2 = join(tmp, 'out2');
    let n0 = (await mock.requests()).length;
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o2}`, '--keys=char/child_mind', '--rpm=0'], env);
    ok('시트가 없으면 char 보류 (exit 1, 파일·요청 없음)', r.code === 1 && !existsSync(L.targetPath(o2, 'char/child_mind')) && (await mock.requests()).length === n0, r.out);
    ok('보류가 로그에 blocked 로 남음', readLog(join(o2, 'generation-log.json')).some(x => x.key === 'char/child_mind' && x.status === 'blocked'));
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o2}`, '--keys=char/child_mind', '--allow-missing-refs', '--rpm=0'], env);
    reqs = await mock.requests();
    ok('--allow-missing-refs 면 참조 없이 생성', r.code === 0 && sizeOk(L.targetPath(o2, 'char/child_mind'), byKey.get('char/child_mind')) && reqs.at(-1).inline === 0, r.out);

    const fPath = join(tmp, 'manifest-fail.json');
    const bad = (key, marker) => ({ ...byKey.get('bg/road'), key, path: `assets/${key}.png`, prompt: `${byKey.get('bg/road').prompt}\n${marker}`, refs: [], order: 900 });
    writeFileSync(fPath, JSON.stringify({ ...manifest, entries: [...manifest.entries, bad('test/no_image', '[[mock:no-image]]'), bad('test/err500', '[[mock:500]]'),
      bad('test/blocked', '[[mock:blocked]]'), bad('test/thought', '[[mock:thought]]'), bad('test/quota0', '[[mock:quota0]]'), bad('test/after_quota', '')] }));
    const o3 = join(tmp, 'out3');
    n0 = (await mock.requests()).length;
    r = run('generate.mjs', [`--manifest=${fPath}`, `--out=${o3}`, '--keys=test/no_image,test/err500', '--retries=2', '--rpm=0', '--concurrency=1'], env);
    reqs = (await mock.requests()).slice(n0);
    ok('실패하면 exit 1', r.code === 1, r.out);
    ok('실패한 항목은 파일을 만들지 않음 (임시 파일도 없음)', !existsSync(L.targetPath(o3, 'test/no_image')) && !existsSync(L.targetPath(o3, 'test/err500')) && !existsSync(join(o3, 'test')));
    ok('500은 재시도 2회 후 포기 (3회 요청)', reqs.filter(q => q.key === 'bg/road' && q.status === 500).length === 3, JSON.stringify(reqs.map(q => q.status)));
    log = readLog(join(o3, 'generation-log.json'));
    ok('로그에 error 기록 (이미지 없음 사유 포함)', log.some(x => x.key === 'test/no_image' && x.status === 'error' && /IMAGE_SAFETY/.test(x.error)) && log.some(x => x.key === 'test/err500' && x.status === 'error' && /500/.test(x.error)), JSON.stringify(log));

    section('응답 파싱 · 차단 · 한도 0');
    n0 = (await mock.requests()).length;
    r = run('generate.mjs', [`--manifest=${fPath}`, `--out=${o3}`, '--keys=test/thought,test/blocked', '--rpm=0', '--concurrency=1'], env);
    reqs = (await mock.requests()).slice(n0);
    log = readLog(join(o3, 'generation-log.json'));
    const th = log.find(x => x.key === 'test/thought' && x.status === 'ok');
    ok('thought(중간) 이미지는 건너뛰고 최종 이미지 사용 (147×63 → 1280×560)', th?.src === '147x63' && !th.fromThought && sizeOk(L.targetPath(o3, 'test/thought'), byKey.get('bg/road')), JSON.stringify(th));
    ok('promptFeedback.blockReason 은 재시도하지 않음 (요청 1회, 파일 없음)', reqs.filter(q => q.status === 'blocked').length === 1 && !existsSync(L.targetPath(o3, 'test/blocked')) && log.some(x => x.key === 'test/blocked' && /blockReason=SAFETY/.test(x.error)), JSON.stringify(reqs.map(q => q.status)));
    n0 = (await mock.requests()).length;
    r = run('generate.mjs', [`--manifest=${fPath}`, `--out=${o3}`, '--keys=test/quota0,test/after_quota', '--rpm=0', '--concurrency=1'], env);
    reqs = (await mock.requests()).slice(n0);
    ok('429 "limit: 0"(무료 등급 한도 0) → 재시도 없이 즉시 중단 exit 3, 결제 안내', r.code === 3 && reqs.length === 1 && /결제/.test(r.out) && !existsSync(L.targetPath(o3, 'test/after_quota')), r.out);
    const fake = (parts, extra = {}) => ({ candidates: [{ content: { parts }, finishReason: 'STOP' }], ...extra });
    const png = (w, h) => makePng(w, h).toString('base64');
    const pick = extractImage(fake([{ text: 'hi' }, { inline_data: { mime_type: 'image/png', data: png(3, 2) } }]));
    ok('extractImage: snake_case inline_data 도 읽음', !pick.none && L.imageSizeFromBuffer(pick.buf)?.width === 3);
    const onlyThought = extractImage(fake([{ inlineData: { mimeType: 'image/png', data: png(5, 5) }, thought: true }, { inlineData: { mimeType: 'image/png', data: png(7, 7) }, thought: true }]));
    ok('extractImage: thought 이미지뿐이면 마지막 것', L.imageSizeFromBuffer(onlyThought.buf)?.width === 7 && onlyThought.fromThought === true);
    ok('extractImage: 이미지 없으면 사유(finishReason) 반환', /finishReason=IMAGE_SAFETY/.test(extractImage({ candidates: [{ content: { parts: [{ text: 'no' }] }, finishReason: 'IMAGE_SAFETY' }] }).why));

    section('키 유출 검사');
    ok(`표준출력·오류출력(실행 ${allOutputs.length}회)에 API 키가 찍히지 않음`, !leaks(SECRET, ...allOutputs));
    ok('생성 로그·출력 폴더 어디에도 API 키가 없음', !filesContaining(tmp, SECRET).length, filesContaining(tmp, SECRET).join(', '));

    section('imageConfig 미지원 모델 → 비율 없이 요청 후 가운데 자르기');
    const mock2 = await startMock(['--reject-image-only', '--reject-aspect']);
    mocks.push(mock2);
    const o5 = join(tmp, 'out5');
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o5}`, '--keys=bg/road,char/child_inner', '--allow-missing-refs', '--rpm=0'], { GEMINI_API_KEY: 'k', GEMINI_API_BASE: mock2.base, GEMINI_IMAGE_MODEL: 'gemini-2.5-flash-image' });
    const r2 = await mock2.requests();
    ok('사다리 끝(TEXT,IMAGE·비율 없음)까지 내려가 성공', r.code === 0 && r2.some(q => q.status === 200 && q.aspect === null && q.modalities.join() === 'TEXT,IMAGE'), r.out);
    ok('GEMINI_IMAGE_MODEL 지정이 자동 선택보다 우선', r2.every(q => q.model === 'gemini-2.5-flash-image'));
    ok('정사각 64×64 → 1280×560 / 768×1040 으로 정확히 맞춤', sizeOk(L.targetPath(o5, 'bg/road'), byKey.get('bg/road')) && sizeOk(L.targetPath(o5, 'char/child_inner'), byKey.get('char/child_inner')));

    // ── 4. fit.mjs (수동 다운로드 정리) ───────────────────────────
    section('fit.mjs');
    const o4 = join(tmp, 'out4');
    mkdirSync(join(o4, 'bg'), { recursive: true }); mkdirSync(join(o4, 'npc'), { recursive: true });
    writeFileSync(join(o4, 'bg/road.png'), makePng(100, 100));
    const jpg = join(tmp, 'download.jpg'); writeFileSync(jpg, Buffer.from(TINY_JPEG_16x9, 'base64'));
    copyFileSync(jpg, join(o4, 'npc/cube.jpg'));
    r = run('fit.mjs', [`--manifest=${mPath}`, `--dir=${o4}`, '--check']);
    ok('--check 는 틀린 크기를 보고하고 exit 1', r.code === 1 && /틀림/.test(r.out), r.out);
    r = run('fit.mjs', [`--manifest=${mPath}`, `--dir=${o4}`]);
    ok('제자리 맞춤: 100×100 → 1280×560', r.code === 0 && sizeOk(join(o4, 'bg/road.png'), byKey.get('bg/road')), r.out);
    ok('jpg → png 변환 후 원본 jpg 정리', sizeOk(join(o4, 'npc/cube.png'), byKey.get('npc/cube')) && !existsSync(join(o4, 'npc/cube.jpg')));
    r = run('fit.mjs', [`--manifest=${mPath}`, `--dir=${o4}`, `--from=${jpg}`, '--key=ending/queen']);
    ok('--from/--key 가져오기: JPEG 64×36 → ending 1280×720 PNG', r.code === 0 && sizeOk(join(o4, 'ending/queen.png'), byKey.get('ending/queen')), r.out);
    r = run('fit.mjs', [`--manifest=${mPath}`, `--dir=${o4}`, '--check']);
    ok('정리 후 --check exit 0 + 다음 그릴 번호 안내', r.code === 0 && /다음에 그릴 것/.test(r.out), r.out);
    if (spawnSync('convert', ['-version']).status === 0) {
      r = run('fit.mjs', [`--manifest=${mPath}`, `--dir=${o4}`, `--from=${jpg}`, '--key=char/teen_body'], { GEMINI_IMAGE_BACKEND: 'imagemagick' });
      ok('ImageMagick 대체 경로도 정확한 크기 (JPEG 64×36 → 768×1040)', r.code === 0 && sizeOk(join(o4, 'char/teen_body.png'), byKey.get('char/teen_body')), r.out);
    } else console.log('  (참고) ImageMagick 없음 → 대체 경로 시험 생략');

    // ── 5. chrome-batch.mjs ─────────────────────────────────────
    section('chrome-batch.mjs');
    const md = join(tmp, 'prompts.md');
    r = run('chrome-batch.mjs', [`--manifest=${mPath}`, `--out=${md}`]);
    const text = existsSync(md) ? readFileSync(md, 'utf8') : '';
    ok('배치 목록 생성', r.code === 0 && text.length > 0, r.out);
    ok('모든 키가 번호와 함께 들어 있음', manifest.entries.every(e => text.includes(`### #${e.order} · \`${e.key}\``)));
    ok('#1 = 캐릭터 시트, 스타일 앵커 §0 포함', /### #1 · `ref\/luna_sheet`/.test(text) && text.includes('## §0 스타일 앵커'));
    ok('char 항목은 시트 첨부 지시', text.includes('**첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`'));
    r = run('chrome-batch.mjs', [`--manifest=${mPath}`, '--print=char/teen_mind']);
    ok('--print 는 generate 와 같은 전송 텍스트', r.code === 0 && r.out.trim() === L.composeText(byKey.get('char/teen_mind')).trim());
  } finally {
    for (const m of mocks) m.child.kill('SIGTERM');
    if (args.keep) console.log(`\n임시 폴더 유지: ${tmp}`);
    else rmSync(tmp, { recursive: true, force: true });
  }
  section('정리');
  ok('임시 출력 폴더 삭제', args.keep || !existsSync(tmp));
  if (snapBefore) {
    const after = assetSnapshot();
    const changed = [...new Set([...Object.keys(snapBefore), ...Object.keys(after)])].filter(f => snapBefore[f] !== after[f]);
    ok(`game/assets 전체(${Object.keys(after).length}개 파일) 그대로 — 시험이 쓰지 않음`, !changed.length, changed.join(', '));
  }
  const failed = results.filter(x => !x.pass);
  console.log(`\n${failed.length ? 'FAILED' : 'ALL PASSED'}: ${results.length - failed.length}/${results.length}`);
  return failed.length ? 1 : 0;
}

main().then(c => process.exit(c), e => { console.error(e.stack || e.message); process.exit(1); });
