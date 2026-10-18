#!/usr/bin/env node
// 제미나이 API로 매니페스트의 이미지를 생성해 assets/<key>.png 에 저장한다 (Node 22, 의존성 없음).
// 키가 없으면 안내를 출력하고 exit 2. 자세한 절차: docs/game-design/gemini-chrome-runbook.md
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import * as L from './lib.mjs';

const DEFAULT_BASE = 'https://generativelanguage.googleapis.com';
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);
// 요청 형태 사다리: 앞의 것이 400(지원 안 함)이면 다음 것으로 내려간다. 한 번 내려가면 그 실행 동안 유지.
const VARIANTS = [
  { name: 'IMAGE+aspect', modalities: ['IMAGE'], aspect: true },
  { name: 'TEXT,IMAGE+aspect', modalities: ['TEXT', 'IMAGE'], aspect: true },
  { name: 'IMAGE', modalities: ['IMAGE'], aspect: false },
  { name: 'TEXT,IMAGE', modalities: ['TEXT', 'IMAGE'], aspect: false },
];
// 장당 참고 단가(USD, 1K~2K 해상도 출력 기준, 작성 시점 공개 요금). 실제 요금은 ai.google.dev/pricing 확인.
const PRICE_HINT = [[/pro/i, 0.134], [/flash/i, 0.039]];

const HELP = `사용법: node tools/gemini/generate.mjs [옵션]
  --dry-run             API를 부르지 않고 계획만 출력 (키 없어도 됨)
  --only=<접두사>       예: --only=char/  --only=ending/,ui/
  --keys=a,b            특정 키만 (예: --keys=ref/luna_sheet,char/child_body)
  --limit=N             이번 실행에서 최대 N장만 생성
  --force               이미 있는 파일도 다시 생성 (기본: 건너뜀)
  --concurrency=2       동시 요청 수 (기본 2)
  --rpm=10              분당 요청 상한 (기본 10, 환경변수 GEMINI_RPM, 0 = 제한 없음)
  --retries=5           429/5xx 재시도 횟수 (지수 백오프)
  --model=<id>          모델 지정 (환경변수 GEMINI_IMAGE_MODEL과 같음; 없으면 ListModels로 자동 선택)
  --list-models         사용 가능한 이미지 모델 목록만 출력
  --out=<dir>           출력 폴더 (기본 game/assets). 테스트는 반드시 임시 폴더를 쓴다
  --refs-from=<dir>     참조 이미지를 읽을 폴더 (기본: --out 과 같음)
  --allow-missing-refs  참조 이미지가 아직 없어도 참조 없이 생성 (기본: 해당 항목 보류)
  --sheet-ref=<file>    캐릭터 시트 생성 시 사용자 레퍼런스 그림을 함께 첨부 (머리·눈·색 체계 참고용)
  --keep-raw=<dir>      API 원본 이미지를 이 폴더에도 보관 (다시 자르기용)
  --manifest=<file>     매니페스트 경로 (기본 game/assets/manifest.json)
  --log=<file>          로그 경로 (기본 <out>/generation-log.json)
  --show-prompt         dry-run 때 각 항목의 전송 텍스트 전문 출력
환경변수: GEMINI_API_KEY (필수), GEMINI_API_BASE (기본 ${DEFAULT_BASE}), GEMINI_IMAGE_MODEL, GEMINI_RPM`;

const NO_KEY_GUIDE = `
[제미나이 생성 중단] GEMINI_API_KEY 환경변수가 없습니다. (exit 2)

키를 채팅에 붙여넣지 마세요. 환경변수로만 넣습니다.
  1) Google AI Studio(aistudio.google.com) → Get API key 에서 키 발급 (이미지 모델은 결제 연결이 필요할 수 있음)
  2-a) Claude Code 클라우드 세션: 세션 제목 표시줄의 클라우드 환경 메뉴 → Edit →
       환경 변수에 GEMINI_API_KEY=<키> 추가 → 새 세션을 시작하면 적용됩니다.
  2-b) 내 컴퓨터: export GEMINI_API_KEY=<키>   (Windows PowerShell: $env:GEMINI_API_KEY="<키>")
  3) cd game && node tools/gemini/generate.mjs --dry-run      # 계획 확인
     node tools/gemini/generate.mjs --keys=ref/luna_sheet     # 캐릭터 시트 먼저 → 눈으로 확인
     node tools/gemini/generate.mjs                           # 나머지 전부 (이미 있는 파일은 건너뜀)

API 키 없이 Chrome의 제미나이 웹으로 그리는 방법: docs/game-design/gemini-chrome-runbook.md (B. Chrome 경로)
계획만 보려면: node tools/gemini/generate.mjs --dry-run
`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const fmtMs = (ms) => ms >= 60000 ? `${Math.floor(ms / 60000)}분 ${Math.round((ms % 60000) / 1000)}초` : `${(ms / 1000).toFixed(1)}초`;

// 사내/클라우드 프록시 환경: Node fetch는 HTTPS_PROXY를 기본으로 쓰지 않으므로 NODE_USE_ENV_PROXY=1 로 재실행.
function reexecForProxy(base) {
  const env = process.env;
  if (!(env.HTTPS_PROXY || env.https_proxy) || env.NODE_USE_ENV_PROXY || env.GEMINI_NO_REEXEC) return;
  if (/\/\/(localhost|127\.|\[::1\])/.test(base)) return;
  const r = spawnSync(process.execPath, [...process.execArgv, process.argv[1], ...process.argv.slice(2)],
    { stdio: 'inherit', env: { ...env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1', GEMINI_NO_REEXEC: '1' } });
  process.exit(r.status ?? 1);
}

class Pacer { // 분당 요청 수 제한: 요청 시작 간격을 60000/rpm ms 이상으로
  constructor(rpm) { this.gap = rpm > 0 ? 60000 / rpm : 0; this.next = 0; }
  async wait() { if (!this.gap) return; const now = Date.now(); const at = Math.max(now, this.next); this.next = at + this.gap; if (at > now) await sleep(at - now); }
}

async function call(method, url, apiKey, body, timeoutMs = 240000) {
  try {
    const res = await fetch(url, {
      method, headers: { 'x-goog-api-key': apiKey, ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await res.text();
    let json = null; try { json = JSON.parse(text); } catch { /* not json */ }
    return { status: res.status, json, text, headers: res.headers };
  } catch (e) {
    return { status: 0, error: `${e.name}: ${e.cause?.code || e.message}` };
  }
}
const apiMessage = (r) => r.error || r.json?.error?.message || (r.text || '').slice(0, 300) || `HTTP ${r.status}`;
function retryDelayMs(r) {
  const ra = r.headers?.get?.('retry-after');
  if (ra && /^\d+(\.\d+)?$/.test(ra)) return Number(ra) * 1000;
  for (const d of r.json?.error?.details ?? []) {
    const m = /^(\d+(?:\.\d+)?)s$/.exec(d?.retryDelay ?? '');
    if (m) return Number(m[1]) * 1000;
  }
  return null;
}

export function rankImageModels(models) {
  const score = (id) => {
    const v = Number(/gemini-(\d+(?:\.\d+)?)/.exec(id)?.[1] ?? 0);
    return v * 100 + (/pro/.test(id) ? 20 : /flash/.test(id) ? 10 : 0) - (/preview|exp/.test(id) ? 3 : 0);
  };
  return models
    .filter(m => (m.supportedGenerationMethods ?? []).includes('generateContent') && /image/i.test(m.name) && !/imagen/i.test(m.name))
    .map(m => ({ id: m.name.replace(/^models\//, ''), displayName: m.displayName, score: score(m.name) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
async function listModels(api, apiKey) {
  const all = []; let token = '';
  for (let page = 0; page < 20; page++) {
    const r = await call('GET', `${api}/models?pageSize=1000${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`, apiKey);
    if (r.status !== 200) throw Object.assign(new Error(`ListModels 실패 (HTTP ${r.status}): ${apiMessage(r)}`), { status: r.status });
    all.push(...(r.json?.models ?? []));
    token = r.json?.nextPageToken; if (!token) break;
  }
  return all;
}
const priceOf = (model) => PRICE_HINT.find(([re]) => re.test(model ?? ''))?.[1] ?? 0.039;

function extractImage(json) {
  const cands = json?.candidates ?? [];
  let best = null;
  for (const c of cands) for (const p of c?.content?.parts ?? []) {
    const d = p.inlineData ?? p.inline_data;
    if (d?.data && /^image\//.test(d.mimeType ?? d.mime_type ?? 'image/')) { if (!best || d.data.length > best.data.length) best = { data: d.data, mime: d.mimeType ?? d.mime_type }; }
  }
  if (best) return { buf: Buffer.from(best.data, 'base64'), mime: best.mime };
  const why = [json?.promptFeedback?.blockReason && `blockReason=${json.promptFeedback.blockReason}`,
    cands[0]?.finishReason && `finishReason=${cands[0].finishReason}`,
    cands.flatMap(c => (c?.content?.parts ?? []).map(p => p.text).filter(Boolean)).join(' ').slice(0, 200)].filter(Boolean).join(' · ');
  return { none: true, why: why || '응답에 이미지가 없음' };
}

function readLog(path) {
  if (!existsSync(path)) return [];
  try { const j = JSON.parse(readFileSync(path, 'utf8')); return Array.isArray(j) ? j : (j.records ?? []); } catch { return []; }
}

async function main() {
  const args = L.parseArgs();
  if (args.help || args.h) { console.log(HELP); return 0; }
  const env = process.env;
  const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || '';
  const dry = !!args['dry-run'];
  const base = (env.GEMINI_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');
  const api = /\/v1(alpha|beta)?$/.test(base) ? base : `${base}/v1beta`;
  const manifestPath = args.manifest ? L.userPath(args.manifest) : L.MANIFEST_PATH;
  const outDir = args.out ? L.userPath(args.out) : L.ASSETS_DIR;
  const refsDir = args['refs-from'] ? L.userPath(args['refs-from']) : outDir;
  const logPath = args.log ? L.userPath(args.log) : join(outDir, 'generation-log.json');
  const concurrency = Math.max(1, L.intArg(args.concurrency, 2));
  const rpm = L.intArg(args.rpm, L.intArg(env.GEMINI_RPM, 10));
  const retries = Math.max(0, L.intArg(args.retries, 5));
  const backoffBase = L.intArg(env.GEMINI_BACKOFF_MS, 2000);
  const sheetRef = args['sheet-ref'] ? L.userPath(args['sheet-ref']) : null;
  const keepRaw = args['keep-raw'] ? L.userPath(args['keep-raw']) : null;
  let model = (args.model && args.model !== true ? args.model : env.GEMINI_IMAGE_MODEL || '').replace(/^models\//, '');

  if (!apiKey && !dry) { console.error(NO_KEY_GUIDE); return 2; }
  if (sheetRef && !existsSync(sheetRef)) { console.error(`--sheet-ref 파일이 없습니다: ${sheetRef}`); return 1; }
  if (!dry) reexecForProxy(base);

  if (args['list-models']) {
    const models = await listModels(api, apiKey);
    const ranked = rankImageModels(models);
    console.log(`이미지 생성 가능 모델 (선호 순):\n${ranked.map((m, i) => `  ${i + 1}. ${m.id}${m.displayName ? ` — ${m.displayName}` : ''}`).join('\n') || '  (없음)'}`);
    return 0;
  }

  let manifest, sel;
  try {
    manifest = L.loadManifest(manifestPath);
    sel = L.selectEntries(manifest.entries, { keys: L.listArg(args.keys), only: L.listArg(args.only) });
  } catch (e) { console.error(e.message); return 1; }
  if (!sel.length) { console.error('선택된 항목이 없습니다 (--only / --keys 확인).'); return 1; }

  const force = !!args.force;
  const plan = sel.map(e => ({ e, path: L.targetPath(outDir, e.key), exists: existsSync(L.targetPath(outDir, e.key)) }));
  const skipped = plan.filter(p => p.exists && !force);
  let todo = plan.filter(p => !p.exists || force);
  const limit = L.intArg(args.limit, Infinity);
  const overLimit = Math.max(0, todo.length - limit);
  todo = todo.slice(0, limit);
  const inRun = new Set();
  for (const p of todo) {
    p.missingRefs = (p.e.refs ?? []).filter(r => !inRun.has(r) && !existsSync(L.targetPath(refsDir, r)));
    inRun.add(p.e.key);
  }

  if (dry) {
    const price = priceOf(model || 'pro');
    console.log(`[dry-run] 제미나이 이미지 생성 계획 — API 호출 없음, 파일 쓰기 없음
  매니페스트 : ${manifestPath} (전체 ${manifest.entries.length}개 중 선택 ${sel.length}개)
  출력 폴더  : ${outDir}
  API 키     : ${apiKey ? '있음' : '없음 → 실제 실행하면 안내 후 exit 2'}
  API 주소   : ${api}
  모델       : ${model || '자동 선택 (ListModels에서 이름에 image가 있고 generateContent 지원; 실행 시 결정)'}
  속도       : 동시 ${concurrency} · 분당 ${rpm || '무제한'} · 재시도 ${retries}
  생성 예정 ${todo.length}장 · 이미 있어 건너뜀 ${skipped.length}장${overLimit ? ` · --limit 초과로 이번엔 제외 ${overLimit}장` : ''}`);
    console.log('\n   #  key                              크기       API비율  참조');
    for (const p of todo) {
      const refs = (p.e.refs ?? []).map(r => p.missingRefs.includes(r) ? `${r}(없음!)` : r).join(', ') || '-';
      console.log(`  ${String(p.e.order).padStart(3)}  ${p.e.key.padEnd(32)} ${`${p.e.width}×${p.e.height}`.padEnd(10)} ${p.e.apiAspect.padEnd(7)}  ${refs}${force && p.exists ? '  [덮어씀]' : ''}`);
      if (args['show-prompt']) console.log('\n' + L.composeText(p.e).replace(/^/gm, '      ') + '\n');
    }
    const blocked = todo.filter(p => p.missingRefs.length);
    if (blocked.length) console.log(`\n  주의: ${blocked.length}장은 참조 이미지가 아직 없어 보류됩니다 (먼저 참조를 생성하거나 --allow-missing-refs).`);
    const minutes = rpm ? Math.ceil(todo.length / rpm) : 0;
    console.log(`\n  예상 비용(참고): ${todo.length}장 × $${price} ≈ $${(todo.length * price).toFixed(2)} (재생성 여유 ×1.5 ≈ $${(todo.length * price * 1.5).toFixed(2)})` +
      ` · 예상 시간: 약 ${Math.max(minutes, Math.ceil(todo.length * 25 / concurrency / 60))}분 이상`);
    return 0;
  }

  if (!todo.length) { console.log(`생성할 것이 없습니다 (이미 있음 ${skipped.length}장 — 다시 만들려면 --force).`); return 0; }

  // 모델 결정
  if (!model) {
    try {
      const ranked = rankImageModels(await listModels(api, apiKey));
      if (!ranked.length) { console.error('이미지 생성 모델을 찾지 못했습니다. GEMINI_IMAGE_MODEL=<모델 id> 로 지정하세요 (예: gemini-2.5-flash-image). --list-models 로 확인.'); return 1; }
      model = ranked[0].id;
      console.log(`모델 자동 선택: ${model}${ranked.length > 1 ? ` (후보: ${ranked.slice(1, 4).map(m => m.id).join(', ')})` : ''}`);
    } catch (e) {
      console.error(e.message + ([401, 403].includes(e.status) ? '\nAPI 키가 잘못되었거나 이 키로 Generative Language API를 쓸 수 없습니다.' : ''));
      return e.status ? 3 : 1;
    }
  } else console.log(`모델: ${model}`);

  const work = mkdtempSync(join(tmpdir(), 'gemini-gen-'));
  const cleanup = () => rmSync(work, { recursive: true, force: true });
  process.on('SIGINT', () => { cleanup(); console.error('\n중단됨.'); process.exit(130); });
  const pacer = new Pacer(rpm);
  const log = readLog(logPath);
  const writeLog = (rec) => { log.push(rec); mkdirSync(dirname(logPath), { recursive: true }); writeFileSync(logPath, JSON.stringify(log.slice(-5000), null, 1) + '\n'); };
  const shared = { variant: 0, fatal: null };
  const done = new Map();
  const tally = { ok: 0, error: 0, blocked: 0 };
  const t0 = Date.now();

  async function loadRefs(p) {
    const refs = [];
    for (const r of p.e.refs ?? []) {
      if (done.has(r)) await done.get(r);
      const f = L.targetPath(refsDir, r);
      if (!existsSync(f)) continue;
      const small = L.makeRefJpeg(f, join(work, `${r.replace(/\//g, '__')}.ref.jpg`));
      const buf = readFileSync(small ?? f);
      refs.push({ key: r, mimeType: small ? 'image/jpeg' : (L.sniffMime(buf) ?? 'image/png'), data: buf.toString('base64') });
    }
    if (sheetRef && p.e.group === 'ref') {
      const buf = readFileSync(sheetRef);
      refs.push({ key: 'user-reference', mimeType: L.sniffMime(buf) ?? 'image/png', data: buf.toString('base64'),
        note: 'the user\'s reference picture of the princess — use it ONLY for hair colour, eye colour, colour scheme and overall vibe; do NOT copy its art style, linework, composition or any signature' });
    }
    return refs;
  }

  async function requestImage(p, text, refs) {
    let attempts = 0, noImage = 0;
    for (;;) {
      if (shared.fatal) throw new Error(`중단: ${shared.fatal}`);
      attempts++;
      const v = VARIANTS[shared.variant];
      const vi = shared.variant;
      const body = {
        contents: [{ role: 'user', parts: [{ text }, ...refs.map(r => ({ inlineData: { mimeType: r.mimeType, data: r.data } }))] }],
        generationConfig: { responseModalities: v.modalities, ...(v.aspect ? { imageConfig: { aspectRatio: p.e.apiAspect } } : {}) },
      };
      await pacer.wait();
      const r = await call('POST', `${api}/models/${encodeURIComponent(model)}:generateContent`, apiKey, body);
      if (r.status === 200) {
        const img = extractImage(r.json);
        if (!img.none) return { ...img, attempts, variant: v.name };
        if (++noImage >= 2 || attempts > retries) throw new Error(`이미지 없음 (${img.why})`);
        await sleep(backoffBase);
        continue;
      }
      const msg = apiMessage(r);
      if (r.status === 400 && /modalit|image_?config|aspect|responseMime|generation_?config/i.test(msg) && vi < VARIANTS.length - 1) {
        if (shared.variant === vi) { shared.variant = vi + 1; console.log(`  · 요청 형태 조정: ${v.name} 미지원 → ${VARIANTS[vi + 1].name} (${msg.slice(0, 80)})`); }
        attempts--; continue;
      }
      if ((r.status === 0 || RETRYABLE.has(r.status)) && attempts <= retries) {
        const wait = retryDelayMs(r) ?? Math.min(64000, backoffBase * 2 ** (attempts - 1)) + Math.floor(Math.random() * backoffBase / 4);
        console.log(`  · ${p.e.key}: ${r.status || 'network'} ${msg.slice(0, 80)} → ${fmtMs(wait)} 후 재시도 (${attempts}/${retries})`);
        await sleep(wait); continue;
      }
      if (r.status === 401 || r.status === 403) shared.fatal = `인증/권한 오류 HTTP ${r.status}: ${msg}`;
      if (r.status === 404) shared.fatal = `모델을 찾을 수 없음(${model}) HTTP 404: ${msg}`;
      throw new Error(`HTTP ${r.status || 'network'}: ${msg}${r.status === 0 ? ' (프록시 환경이면 NODE_USE_ENV_PROXY=1 확인)' : ''}`);
    }
  }

  async function runOne(p) {
    const start = Date.now();
    const rec = { key: p.e.key, model, time: new Date(start).toISOString(), status: 'error' };
    try {
      const refs = await loadRefs(p);
      const missing = (p.e.refs ?? []).filter(r => !refs.some(x => x.key === r));
      if (missing.length && !args['allow-missing-refs']) {
        Object.assign(rec, { status: 'blocked', error: `참조 이미지 없음: ${missing.join(', ')} (먼저 생성하거나 --allow-missing-refs)` });
        tally.blocked++; console.log(`  ⏸ ${p.e.key} 보류 — ${rec.error}`);
        return false;
      }
      const attached = refs.filter(r => r.key !== 'user-reference').map(r => r.key);
      let text = L.composeText(p.e, attached);
      const user = refs.find(r => r.key === 'user-reference');
      if (user) text += `\n\n[USER REFERENCE] Attached image ${refs.indexOf(user) + 1} = ${user.note}.`;
      const img = await requestImage(p, text, refs);
      const ext = { 'image/jpeg': 'jpg', 'image/webp': 'webp' }[L.sniffMime(img.buf) ?? img.mime] ?? 'png';
      const raw = join(work, `${p.e.key.replace(/\//g, '__')}.${ext}`);
      writeFileSync(raw, img.buf);
      const fit = L.fitImage(raw, p.path, p.e.width, p.e.height);
      if (keepRaw) { const kr = join(keepRaw, `${p.e.key}.${ext}`); mkdirSync(dirname(kr), { recursive: true }); copyFileSync(raw, kr); }
      rmSync(raw, { force: true });
      Object.assign(rec, { status: 'ok', bytes: img.buf.length, mime: img.mime, attempts: img.attempts, variant: img.variant,
        src: `${fit.srcWidth}x${fit.srcHeight}`, out: `${fit.width}x${fit.height}`, outBytes: fit.bytes, refs: attached, error: null });
      tally.ok++;
      console.log(`  ✓ ${p.e.key}  ${fit.srcWidth}×${fit.srcHeight} → ${fit.width}×${fit.height}  (${fmtMs(Date.now() - start)}, 시도 ${img.attempts})`);
      return true;
    } catch (e) {
      rec.error = e.message; tally.error++;
      console.log(`  ✗ ${p.e.key}  ${e.message}`);
      return false;
    } finally {
      rec.ms = Date.now() - start;
      writeLog(rec);
    }
  }

  console.log(`생성 시작: ${todo.length}장 (건너뜀 ${skipped.length}) → ${outDir}  · 동시 ${concurrency} · 분당 ${rpm || '무제한'}`);
  let next = 0;
  const worker = async () => {
    while (next < todo.length && !shared.fatal) {
      const p = todo[next++];
      const pr = runOne(p);
      done.set(p.e.key, pr);
      await pr;
    }
  };
  try { await Promise.all(Array.from({ length: Math.min(concurrency, todo.length) }, worker)); }
  finally { cleanup(); }

  const notRun = todo.length - tally.ok - tally.error - tally.blocked;
  console.log(`\n완료: 성공 ${tally.ok} · 실패 ${tally.error} · 보류 ${tally.blocked}${notRun ? ` · 미실행 ${notRun}` : ''} · 건너뜀 ${skipped.length} · ${fmtMs(Date.now() - t0)} · 로그 ${logPath}`);
  if (shared.fatal) { console.error(`치명적 오류로 중단: ${shared.fatal}`); return 3; }
  if (tally.ok) console.log('다음: node tools/gemini/fit.mjs --check  (크기 확인) → docs/game-design/gemini-chrome-runbook.md 의 QA 체크리스트로 눈 검수');
  return tally.error || tally.blocked ? 1 : 0;
}

if (L.isMain(import.meta.url)) {
  main().then(code => process.exit(code), (e) => { console.error(e.stack || e.message); process.exit(1); });
}
