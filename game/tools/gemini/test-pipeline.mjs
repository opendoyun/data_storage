#!/usr/bin/env node
// 제미나이 파이프라인 종단 시험 (오프라인). 실제 키·네트워크 없이 mock-server.mjs 로 검증한다.
// 모든 출력은 OS 임시 폴더에만 쓰고 끝나면 지운다. game/assets 는 건드리지 않는다(마지막에 확인).
//
//   node tools/gemini/test-pipeline.mjs          # 통과하면 exit 0
//   node tools/gemini/test-pipeline.mjs --keep   # 임시 폴더를 지우지 않고 경로 출력 (디버깅)
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync, statSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import * as L from './lib.mjs';
import { makePng, TINY_JPEG_16x9 } from './mock-server.mjs';
import { endingEntry } from './build-manifest.mjs';
import { BG, NPC, UI, CHAR_KEYS } from '../../js/data/images.js';
import { ENDINGS } from '../../js/data/endings.js';

const args = L.parseArgs();
const NODE = process.execPath;
const tool = (f) => join(L.TOOLS_DIR, f);
const results = [];
const ok = (name, cond, detail = '') => { results.push({ name, pass: !!cond, detail }); console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail && !cond ? `\n        ${String(detail).split('\n').slice(0, 12).join('\n        ')}` : ''}`); return !!cond; };
const section = (t) => console.log(`\n[${t}]`);

const baseEnv = { ...process.env, GEMINI_BACKOFF_MS: '20', GEMINI_NO_REEXEC: '1', NODE_NO_WARNINGS: '1' };
for (const k of ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_IMAGE_MODEL', 'GEMINI_API_BASE', 'GEMINI_RPM', 'NODE_USE_ENV_PROXY']) delete baseEnv[k];
function run(script, argv, env = {}) {
  const r = spawnSync(NODE, [tool(script), ...argv], { env: { ...baseEnv, ...env }, encoding: 'utf8', timeout: 180000 });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}
const sizeOk = (file, e) => { if (!existsSync(file)) return false; const s = L.imageSize(file); return s && s.format === 'PNG' && s.width === e.width && s.height === e.height; };
const readLog = (f) => existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : [];

// game/assets 에서 이 시험이 실수로 건드릴 수 있는 파일들의 상태 스냅숏
function assetSnapshot(keys) {
  const files = ['generation-log.json', 'gemini-prompts.md', 'manifest.json', ...keys.map(k => `${k}.png`)];
  return Object.fromEntries(files.map(f => { const p = join(L.ASSETS_DIR, f); return [f, existsSync(p) ? `${statSync(p).size}:${statSync(p).mtimeMs}` : 'absent']; }));
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
  let snapBefore = null;
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
    r = run('build-manifest.mjs', ['--check']);
    if (r.code !== 0) console.log('  (참고) game/assets/manifest.json 이 최신이 아님 → node tools/gemini/build-manifest.mjs 실행 필요');

    const endingWithNpc = manifest.entries.find(e => e.group === 'ending' && e.refs.length >= 2);
    const npcRef = endingWithNpc.refs.find(k => k.startsWith('npc/'));
    const mainKeys = ['ref/luna_sheet', 'char/child_body', 'char/adult_social', npcRef, 'bg/room_spring', 'bg/room_winter', endingWithNpc.key, 'ui/title_key'];
    snapBefore = assetSnapshot([...mainKeys, 'char/child_mind', 'bg/road', 'ending/queen', 'npc/cube']);

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
    const mock = await startMock(['--reject-image-only', '--flaky=4', '--require-key=mock-key']);
    mocks.push(mock);
    const env = { GEMINI_API_KEY: 'mock-key', GEMINI_API_BASE: mock.base };
    r = run('generate.mjs', [`--manifest=${mPath}`, `--out=${o1}`, `--keys=${mainKeys.join(',')}`, '--concurrency=2', '--rpm=0', '--no-pause'], env);
    ok('생성 exit 0', r.code === 0, r.out);
    ok('모델 자동 선택 = gemini-3-pro-image-preview (페이지 넘김 포함)', /모델 자동 선택: gemini-3-pro-image-preview/.test(r.out), r.out.slice(0, 400));
    for (const k of mainKeys) ok(`${k} → ${byKey.get(k).width}×${byKey.get(k).height} PNG`, sizeOk(L.targetPath(o1, k), byKey.get(k)));
    let reqs = await mock.requests();
    const firstOf = (k) => reqs.find(q => q.key === k);
    const okOf = (k) => reqs.filter(q => q.key === k && q.status === 200);
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
    writeFileSync(fPath, JSON.stringify({ ...manifest, entries: [...manifest.entries, bad('test/no_image', '[[mock:no-image]]'), bad('test/err500', '[[mock:500]]')] }));
    const o3 = join(tmp, 'out3');
    n0 = (await mock.requests()).length;
    r = run('generate.mjs', [`--manifest=${fPath}`, `--out=${o3}`, '--keys=test/no_image,test/err500', '--retries=2', '--rpm=0', '--concurrency=1'], env);
    reqs = (await mock.requests()).slice(n0);
    ok('실패하면 exit 1', r.code === 1, r.out);
    ok('실패한 항목은 파일을 만들지 않음 (임시 파일도 없음)', !existsSync(L.targetPath(o3, 'test/no_image')) && !existsSync(L.targetPath(o3, 'test/err500')) && !existsSync(join(o3, 'test')));
    ok('500은 재시도 2회 후 포기 (3회 요청)', reqs.filter(q => q.key === 'bg/road' && q.status === 500).length === 3, JSON.stringify(reqs.map(q => q.status)));
    log = readLog(join(o3, 'generation-log.json'));
    ok('로그에 error 기록 (이미지 없음 사유 포함)', log.some(x => x.key === 'test/no_image' && x.status === 'error' && /IMAGE_SAFETY/.test(x.error)) && log.some(x => x.key === 'test/err500' && x.status === 'error' && /500/.test(x.error)), JSON.stringify(log));

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
    const after = assetSnapshot(Object.keys(snapBefore).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)));
    const changed = Object.keys(snapBefore).filter(f => snapBefore[f] !== after[f]);
    ok('game/assets 는 그대로 (시험이 쓰지 않음)', !changed.length, changed.join(', '));
  }
  const failed = results.filter(x => !x.pass);
  console.log(`\n${failed.length ? 'FAILED' : 'ALL PASSED'}: ${results.length - failed.length}/${results.length}`);
  return failed.length ? 1 : 0;
}

main().then(c => process.exit(c), e => { console.error(e.stack || e.message); process.exit(1); });
