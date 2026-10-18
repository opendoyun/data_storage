#!/usr/bin/env node
// 엔딩 도달 가능성 · 이벤트 커버리지 보고서 (GDD 7.3)
//
//   node tools/reach.mjs [K=40] [N=2000] [--seed=1] [--workers=4] [--only=queen,painter] [--out=<md>] [--no-write]
//                        [--json=<path>] [--guardians=knight,scholar] [--mg=0.7|none] [--no-shop] [--legacy=<판 수, 기본 N/10>] [--quiet]
//   node tools/reach.mjs --help
//
//   1) 엔딩마다 seek:<id> 정책으로 K판 → 목표 달성률 (목표 추구형 플레이어가 그 엔딩에 닿을 수 있는가)
//   2) 일반 정책 10종으로 N판 → 엔딩 분포 (점유율 20% 초과 경고)
//   3) 2회차 이상 표본(N/10판, 회차 2~4+ · 보호자 출신 5종)을 더해 모든 판의 이벤트 등장 집계
//      → 한 번도 안 나온 이벤트와 막힌 조건 진단(나이 창 안의 최고/최저 상태로 조건 평가)
//   결과: 콘솔 요약 + docs/game-design/balance-report.md
//
// 실행은 worker_threads로 나눠 돌린다. 결과는 시드로 결정되며 워커 수와 무관하다.
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import { ENDINGS, EVENTS, ITEMS, ANNUAL, ACTIVITY_MAP, GUARDIANS } from '../js/engine/engine.js';
import { EVENT_SOURCES } from '../js/data/events.js';
import { SEASONS } from '../js/data/stats.js';
import {
  playGame, seekDiagnosis, GENERAL_POLICIES, SEEK_PREFIX, MONTHS_PER_GAME, DEFAULT_SEEK_MG,
  compileCondition, compileAll, eventEligible, guardianCapped, eventParents, makeLegacy, flagProviders,
} from './sim-core.mjs';

const USAGE = `사용: node tools/reach.mjs [K=40] [N=2000] [옵션]
  K                 엔딩마다 seek 판 수            N   일반 정책 판 수 (10종 순환)
  --seed=1          시드 시작값                    --workers=<n>   워커 수 (기본 min(4, CPU))
  --only=a,b        이 엔딩들만 seek               --guardians=knight,scholar   seek가 고를 수 있는 보호자
  --mg=0.7|none     seek 미니게임 점수 (none=주사위) --legacy=<n>   2회차 이상 커버리지 표본 (기본 N/10)
  --no-shop         상점 사용 안 함                --quiet         진행 표시 끄기
  --out=<md>        보고서 경로 (기본 docs/game-design/balance-report.md)   --no-write  보고서 저장 안 함
  --json=<path>     전체 결과 JSON 저장
  예) node tools/reach.mjs 20            빠른 점검 (seek 20판×엔딩 + 일반 2000판)
      node tools/reach.mjs 40 0 --only=pilgrim,drifter --no-write    특정 엔딩 seek만`;
const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_OUT = resolve(HERE, '../../docs/game-design/balance-report.md');
const AGES = [10, 11, 12, 13, 14, 15, 16, 17];
const TOP_SHARE_WARN = 0.20;
const EVENT_TARGET = 1.5;

// ══════════════════════════════════════════════════════════════════════
// 집계 (워커별로 쌓고 메인에서 합친다 — 합/최소/최대/합집합만 쓰므로 순서 무관)
// ══════════════════════════════════════════════════════════════════════
// 진단용으로 매달 기록할 조건 경로 (+ 불투명 함수 조건은 조건별로 참/거짓 관측)
function trackedPaths() {
  const exprs = new Set();
  const addAll = (arr) => { for (const c of arr || []) if (typeof c === 'string' || typeof c === 'function') exprs.add(c); };
  for (const ev of EVENTS) { addAll(ev.conditions); for (const c of ev.choices || []) addAll(c.conditions); }
  for (const e of ENDINGS) { addAll(e.gates); for (const b of e.bonus || []) addAll(b.when); }
  for (const a of Object.values(ANNUAL)) for (const o of a.options || []) addAll(o.conditions);
  for (const it of ITEMS) addAll(it.conditions);
  const byPath = new Map(), fns = [];
  for (const x of exprs) {
    const c = compileCondition(x);
    if (c.opaque) fns.push(c);
    else if (!byPath.has(c.path)) byPath.set(c.path, c);
  }
  return [...byPath.values()].map(c => ({ path: c.path, get: c.get, kind: c.kind }))
    .concat(fns.map((c, i) => ({ path: fnKey(c, i), get: c.test, kind: 'fn' })));
}
// 불투명 함수 조건의 관측 키 — 데이터 순서로 매기므로 워커마다 같다
let FN_KEYS = null;
function fnKey(c, i) { (FN_KEYS ??= new Map()).set(c, `fn#${i}`); return `fn#${i}`; }

function newAgg() {
  return {
    games: { general: 0, seek: 0, legacy: 0 }, errors: {}, ms: 0,
    gen: {}, seek: {},
    seen: {}, seenFresh: {}, seenTimes: {},
    elig: {}, near: {}, choice: {},
    peaks: {}, obs: {}, acts: {},
    ageEv: { general: {}, seek: {} },
    quiet: { general: { months: 0, streak2: 0, maxStreak: 0 }, seek: { months: 0, streak2: 0, maxStreak: 0 } },
  };
}
const inc = (o, k, v = 1) => { o[k] = (o[k] || 0) + v; };

function policyBucket() { return { n: 0, endings: {}, refusals: 0, forced: 0, persuaded: 0, collapses: 0, autonomy: 0, events: 0, trust: 0, annual: 0, bought: 0, overflow: 0, hidden: 0, mg: 0 }; }

// 워커 상태 (배치 사이에 유지): 아직 이 워커에서 못 본 이벤트만 적격성 추적
let TRACK = null;
function workerState() {
  if (!TRACK) TRACK = { paths: trackedPaths(), unseen: new Set(EVENTS.filter(e => !e.chainOnly).map(e => e.id)), evById: Object.fromEntries(EVENTS.map(e => [e.id, e])) };
  return TRACK;
}

function runTask(task, agg) {
  const st = workerState();
  const kind = task.kind ?? (task.policy.startsWith(SEEK_PREFIX) ? 'seek' : 'general');
  let quietStreak = 0, maxStreak = 0, had2 = false;
  const monthEv = {};
  const eligThisGame = new Set();
  const hooks = {
    afterRun(s, rep) {
      const age = s.age;
      const pk = (agg.peaks[age] ??= {}), ob = (agg.obs[age] ??= {});
      for (const p of st.paths) {
        const v = p.get(s);
        if (p.kind === 'flag' || p.kind === 'fn') { (ob[p.path] ??= {})[v ? 'T' : 'F'] = 1; }
        else if (p.kind === 'string') { (ob[p.path] ??= {})[String(v)] = 1; }
        else {
          const x = Number(v ?? 0);
          const cur = pk[p.path];
          if (!cur) pk[p.path] = [x, x]; else { if (x < cur[0]) cur[0] = x; if (x > cur[1]) cur[1] = x; }
        }
      }
      const slotIds = rep.executed.map(e => e.id);
      const ac = (agg.acts[age] ??= {});
      for (const id of slotIds) inc(ac, id);
      // 미등장 이벤트: 적격 개월 수 + '조건 하나만 모자랐던' 근접 실패
      const capped = guardianCapped(s);
      for (const id of st.unseen) {
        const ev = st.evById[id];
        if (!ev) continue;
        if (ev.age && (age < ev.age[0] || age > ev.age[1])) continue;
        if (ev.month && ev.month !== s.month) continue;
        if (ev.season && ev.season !== s.season) continue;
        if (s.seen[id] && !ev.repeatable) continue;
        if (eventEligible(ev, s, slotIds, capped)) { const e = (agg.elig[id] ??= { months: 0, games: 0 }); e.months++; if (!eligThisGame.has(id)) { eligThisGame.add(id); e.games++; } continue; }
        const fails = [];
        if (ev.guardian && capped) fails.push('보호자 이벤트 15% 상한');
        if (ev.requiresActivity) {
          const ra = Array.isArray(ev.requiresActivity) ? ev.requiresActivity : [ev.requiresActivity];
          if (!ra.some(a => slotIds.includes(a))) fails.push('requiresActivity: ' + ra.join('|'));
        }
        for (const c of compileAll(ev.conditions)) { if (!c.test(s)) { fails.push(c.label); if (fails.length > 1) break; } }
        if (fails.length === 1) inc((agg.near[id] ??= {}), fails[0]);
      }
    },
    event(s, ev, idx, out) {
      inc(agg.choice, ev.id + '#' + idx);
      if (out.success === true) inc(agg.choice, ev.id + '#' + idx + '#S');
      else if (out.success === false) inc(agg.choice, ev.id + '#' + idx + '#F');
    },
    monthEnd(s, n) {
      if (kind === 'legacy') return;
      const a = (agg.ageEv[kind][s.age] ??= [0, 0]); a[0] += n; a[1]++;
      if (n === 0) { quietStreak++; agg.quiet[kind].months++; if (quietStreak >= 2) had2 = true; if (quietStreak > maxStreak) maxStreak = quietStreak; }
      else quietStreak = 0;
    },
  };
  let s;
  try {
    s = playGame(task.policy, task.seed, { ...task.opts, hooks });
  } catch (e) {
    const k = String(e?.message ?? e).split('\n')[0];
    const er = (agg.errors[k] ??= { n: 0, example: `${task.policy} seed ${task.seed}` }); er.n++;
    return;
  }
  agg.games[kind]++;
  for (const [id, n] of Object.entries(s.seen)) { inc(agg.seen, id); inc(agg.seenTimes, id, n); if (kind !== 'legacy') inc(agg.seenFresh, id); st.unseen.delete(id); }
  if (kind === 'legacy') return;
  if (had2) agg.quiet[kind].streak2++;
  if (maxStreak > agg.quiet[kind].maxStreak) agg.quiet[kind].maxStreak = maxStreak;
  const B = kind === 'general' ? (agg.gen[task.policy] ??= policyBucket()) : (agg.gen.__seek ??= policyBucket());
  const c = s.counters;
  B.n++; inc(B.endings, s.ending.id);
  B.refusals += c.refusals; B.forced += c.forced; B.persuaded += c.persuaded; B.collapses += c.collapses; B.autonomy += c.autonomy; B.events += c.events;
  B.trust += s.trust; B.annual += s._sim.annual; B.bought += s._sim.bought; B.overflow += s._sim.overflow; B.mg += s._sim.mg;
  if (s.ending.hidden) B.hidden++;
  if (kind === 'seek') {
    const target = task.policy.slice(SEEK_PREFIX.length);
    const d = seekDiagnosis(target, s);
    const R = (agg.seek[target] ??= { n: 0, ok: 0, got: {}, why: {}, guard: {} });
    R.n++; inc(R.guard, s.guardian);
    if (d.success) R.ok++;
    else {
      inc(R.got, d.got);
      if (d.reason === 'gate') for (const f of d.failed) inc(R.why, '게이트 ' + f);
      else if (d.reason === 'hidden') inc(R.why, '히든 선점 ' + d.by);
      else inc(R.why, '점수 역전 ' + d.by);
    }
  }
}

function mergeAgg(a, b) {
  for (const k of Object.keys(a.games)) a.games[k] += b.games[k] || 0;
  a.ms += b.ms;
  for (const [k, v] of Object.entries(b.errors)) { const e = (a.errors[k] ??= { n: 0, example: v.example }); e.n += v.n; }
  for (const [p, B] of Object.entries(b.gen)) {
    const A = (a.gen[p] ??= policyBucket());
    for (const [k, v] of Object.entries(B)) if (k === 'endings') for (const [e, n] of Object.entries(v)) inc(A.endings, e, n); else A[k] += v;
  }
  for (const [t, R] of Object.entries(b.seek)) {
    const A = (a.seek[t] ??= { n: 0, ok: 0, got: {}, why: {}, guard: {} });
    A.n += R.n; A.ok += R.ok;
    for (const [k, v] of Object.entries(R.guard)) inc(A.guard, k, v);
    for (const [k, v] of Object.entries(R.got)) inc(A.got, k, v);
    for (const [k, v] of Object.entries(R.why)) inc(A.why, k, v);
  }
  for (const k of ['seen', 'seenFresh', 'seenTimes', 'choice']) for (const [id, n] of Object.entries(b[k])) inc(a[k], id, n);
  for (const [id, e] of Object.entries(b.elig)) { const x = (a.elig[id] ??= { months: 0, games: 0 }); x.months += e.months; x.games += e.games; }
  for (const [id, m] of Object.entries(b.near)) { const x = (a.near[id] ??= {}); for (const [k, n] of Object.entries(m)) inc(x, k, n); }
  for (const [age, m] of Object.entries(b.peaks)) { const x = (a.peaks[age] ??= {}); for (const [p, [lo, hi]] of Object.entries(m)) { const c = x[p]; if (!c) x[p] = [lo, hi]; else { c[0] = Math.min(c[0], lo); c[1] = Math.max(c[1], hi); } } }
  for (const [age, m] of Object.entries(b.obs)) { const x = (a.obs[age] ??= {}); for (const [p, vals] of Object.entries(m)) Object.assign((x[p] ??= {}), vals); }
  for (const [age, m] of Object.entries(b.acts)) { const x = (a.acts[age] ??= {}); for (const [id, n] of Object.entries(m)) inc(x, id, n); }
  for (const kind of ['general', 'seek']) {
    for (const [age, [e, m]] of Object.entries(b.ageEv[kind])) { const x = (a.ageEv[kind][age] ??= [0, 0]); x[0] += e; x[1] += m; }
    const q = a.quiet[kind], r = b.quiet[kind];
    q.months += r.months; q.streak2 += r.streak2; q.maxStreak = Math.max(q.maxStreak, r.maxStreak);
  }
  return a;
}

function runBatch(tasks) {
  const agg = newAgg();
  const t0 = Date.now();
  for (const t of tasks) runTask(t, agg);
  agg.ms = Date.now() - t0;
  return agg;
}

// ══════════════════════════════════════════════════════════════════════
// 실행 (워커 풀 · 동적 배치)
// ══════════════════════════════════════════════════════════════════════
// 엔딩 id → seek 시드 오프셋. 엔딩 목록 순서가 아니라 id로 정하므로 엔딩이 추가·재배열돼도 기존 엔딩의 판은 그대로다.
export function seekSeedBase(id) {
  let h = 0x811c9dc5;                                   // FNV-1a 32bit
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return 1_000_000 + (h % 1_000_000) * 100;
}
// 커버리지 표본에 필요한 회차 범위: 데이터의 playthrough/legacyCount 조건에서 읽는다 (최소 2~4회차)
function legacyRange() {
  let maxP = 4;
  const scan = (arr) => { for (const x of arr || []) { if (typeof x !== 'string' && typeof x !== 'function') continue; const c = compileCondition(x);
    if (c.opaque || typeof c.value !== 'number' || (c.effOp !== '>=' && c.effOp !== '>' && c.effOp !== '==')) continue;
    const v = c.value + (c.effOp === '>' ? 1 : 0);
    if (c.path === 'playthrough') maxP = Math.max(maxP, v); else if (c.path === 'legacyCount') maxP = Math.max(maxP, v + 1); } };
  for (const ev of EVENTS) { scan(ev.conditions); for (const c of ev.choices || []) scan(c.conditions); }
  for (const e of ENDINGS) { scan(e.gates); for (const b of e.bonus || []) scan(b.when); }
  for (const a of Object.values(ANNUAL)) for (const o of a.options || []) scan(o.conditions);
  for (const it of ITEMS) scan(it.conditions);
  return Math.min(6, maxP);                             // 이전 회차 딸은 최대 5명
}

export function buildTasks({ K = 40, N = 2000, seed = 1, only = null, guardians = null, mg, shop = true, legacy } = {}) {
  const tasks = [];
  const seekOpts = { shop, ...(guardians ? { guardians } : {}), ...(mg !== undefined ? { mgScore: mg } : {}) };
  for (const e of ENDINGS) {
    if (only && !only.includes(e.id)) continue;
    const base = seekSeedBase(e.id);
    for (let k = 0; k < K; k++) tasks.push({ policy: SEEK_PREFIX + e.id, seed: seed + base + k, opts: seekOpts });
  }
  for (let i = 0; i < N; i++) tasks.push({ policy: GENERAL_POLICIES[i % GENERAL_POLICIES.length], seed: seed + i, opts: { shop } });
  // 2회차 이상 표본 (커버리지 집계에만 쓰고 분포에는 넣지 않음): 회차 2~maxP(이전 회차 딸 = 회차-1명),
  // 보호자는 해금 출신까지 5종을 돌린다 — 출신 전용 이벤트(b06 등)가 '미등장'으로 잘못 잡히지 않게.
  const nl = legacy ?? Math.round(N / 10);
  const maxP = legacyRange(), gList = Object.keys(GUARDIANS), P = GENERAL_POLICIES.length;
  for (let i = 0; i < nl; i++) {
    const pt = 2 + (i % (maxP - 1));
    tasks.push({ kind: 'legacy', policy: GENERAL_POLICIES[i % P], seed: seed + 500_000 + i,
      opts: { shop, guardian: gList[(i + Math.floor(i / P)) % gList.length], newGame: { playthrough: pt, legacy: makeLegacy(pt - 1, seed + i) } } });
  }
  return tasks;
}

export async function runReach(opts = {}) {
  const t0 = Date.now();
  const tasks = buildTasks(opts);
  const W = Math.max(1, Math.min(opts.workers ?? Math.min(4, os.availableParallelism?.() ?? os.cpus().length), Math.ceil(tasks.length / 10)));
  const batch = opts.batch ?? 16;
  const total = newAgg();
  let doneTasks = 0, nextMark = 0.2;
  const progress = (n) => {
    doneTasks += n;
    if (opts.quiet) return;
    if (process.stderr.isTTY) process.stderr.write(`\r  진행 ${doneTasks}/${tasks.length} (${((Date.now() - t0) / 1000).toFixed(0)}s)   `);
    else if (doneTasks >= tasks.length * nextMark && nextMark < 1) {   // 파이프·로그 파일: 20%마다 한 줄
      process.stderr.write(`  진행 ${Math.round(doneTasks / tasks.length * 100)}% (${doneTasks}/${tasks.length}, ${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
      while (nextMark <= doneTasks / tasks.length) nextMark += 0.2;
    }
  };
  if (W === 1) {
    for (let i = 0; i < tasks.length; i += batch) { mergeAgg(total, runBatch(tasks.slice(i, i + batch))); progress(Math.min(batch, tasks.length - i)); }
  } else {
    // 무거운 seek 판을 먼저 나눠 주고 일반 판으로 꼬리를 채운다
    let next = 0;
    await new Promise((resolveAll, rejectAll) => {
      let alive = W;
      for (let w = 0; w < W; w++) {
        const worker = new Worker(new URL(import.meta.url), { workerData: { role: 'reach-worker' } });
        const feed = () => {
          if (next >= tasks.length) { worker.postMessage({ type: 'done' }); return; }
          const chunk = tasks.slice(next, next + batch); next += chunk.length;
          worker.postMessage({ type: 'batch', tasks: chunk });
        };
        worker.on('message', (m) => { if (m.type === 'result') { mergeAgg(total, m.agg); progress(m.n); feed(); } });
        worker.on('error', (e) => rejectAll(e));
        worker.on('exit', () => { if (--alive === 0) resolveAll(); });
        feed();
      }
    });
  }
  if (!opts.quiet && process.stderr.isTTY) process.stderr.write('\r' + ' '.repeat(60) + '\r');
  const wallMs = Date.now() - t0;
  const result = analyze(total, { ...opts, workers: W, wallMs, tasks: tasks.length });
  return result;
}

// ══════════════════════════════════════════════════════════════════════
// 분석 · 진단
// ══════════════════════════════════════════════════════════════════════
function sourceOf(id) {
  for (const [f, list] of Object.entries(EVENT_SOURCES || {})) if (list.some(e => e.id === id)) return f;
  return '?';
}
function peakEval(c, lo, hi, agg) {
  const ages = AGES.filter(a => a >= lo && a <= hi);
  if (c.opaque) {
    if (!FN_KEYS) trackedPaths();                    // 메인 스레드(워커 집계만 받은 경우)에서도 같은 키를 만든다
    const key = FN_KEYS.get(c);
    let everT = false, everF = false;
    if (key) for (const a of ages) { const o = agg.obs[a]?.[key]; if (o?.T) everT = true; if (o?.F) everF = true; }
    if (!everT && !everF) return { ok: null, peak: '관측 없음' };
    return { ok: everT, peak: everT ? '참인 달 있음' : '나이 창에서 한 번도 참이 아님' };
  }
  if (c.kind === 'number') {
    let mn = Infinity, mx = -Infinity;
    for (const a of ages) { const p = agg.peaks[a]?.[c.path]; if (p) { mn = Math.min(mn, p[0]); mx = Math.max(mx, p[1]); } }
    if (mn === Infinity) return { ok: null, peak: '관측 없음' };
    const fmt = (x) => Number.isInteger(x) ? x : x.toFixed(1);
    if (!c.op) return c.neg ? { ok: mn === 0, peak: `최저 ${fmt(mn)}` } : { ok: mx > 0, peak: `최고 ${fmt(mx)}` };
    const v = c.value;
    switch (c.effOp) {
      case '>=': return { ok: mx >= v, peak: `최고 ${fmt(mx)}` };
      case '>': return { ok: mx > v, peak: `최고 ${fmt(mx)}` };
      case '<=': return { ok: mn <= v, peak: `최저 ${fmt(mn)}` };
      case '<': return { ok: mn < v, peak: `최저 ${fmt(mn)}` };
      case '==': return { ok: mn <= v && v <= mx, peak: `범위 ${fmt(mn)}~${fmt(mx)}` };
      case '!=': return { ok: !(mn === v && mx === v), peak: `범위 ${fmt(mn)}~${fmt(mx)}` };
    }
  }
  const seenVals = {};
  for (const a of ages) Object.assign(seenVals, agg.obs[a]?.[c.path] || {});
  if (c.kind === 'flag') {
    const everT = !!seenVals.T, everF = !!seenVals.F;
    let wantTrue;
    if (!c.op) wantTrue = !c.neg;
    else if (typeof c.value === 'boolean') wantTrue = (c.effOp === '==') === c.value;
    else wantTrue = c.effOp === '==';
    return { ok: wantTrue ? everT : everF, peak: everT ? (everF ? '켜짐/꺼짐 모두 관측' : '항상 켜짐') : '한 번도 안 켜짐' };
  }
  const vals = Object.keys(seenVals).sort();          // 집계 순서(워커 분배)와 무관하게
  const ok = c.effOp === '==' ? vals.includes(String(c.value)) : c.effOp === '!=' ? vals.some(v => v !== String(c.value)) : (c.neg ? vals.some(v => !v || v === 'undefined') : vals.some(v => v && v !== 'undefined'));
  return { ok, peak: '관측값 ' + (vals.join('/') || '없음') };
}

function diagnoseEvent(ev, agg) {
  if (ev.chainOnly) {
    const pars = eventParents(ev.id);
    if (!pars.length) return { kind: 'orphan', text: '연쇄 전용인데 이 이벤트로 이어지는 next가 없음 (고아 이벤트)' };
    const parts = pars.map(p => {
      const taken = agg.choice[`${p.ev.id}#${p.idx}`] || 0;
      const br = p.branch === 'direct' ? taken : (agg.choice[`${p.ev.id}#${p.idx}#${p.branch === 'success' ? 'S' : 'F'}`] || 0);
      const bl = p.branch === 'success' ? ' 성공' : p.branch === 'fail' ? ' 실패' : '';
      return `${p.ev.id}[${p.idx + 1}번 선택${bl}] — 부모 등장 ${agg.seen[p.ev.id] || 0}게임, 해당 분기 ${br}회`;
    });
    return { kind: 'chain', text: '연쇄 전용. 부모: ' + parts.join(' · ') };
  }
  const reasons = [];
  let structural = false;
  const lo = ev.age?.[0] ?? 10, hi = ev.age?.[1] ?? 17;
  if (!ev.age) reasons.push('age 필드 없음');
  if (lo > 17 || hi < 10 || lo > hi) { structural = true; reasons.push(`나이 창 [${lo},${hi}]이 10~17 범위 밖`); }
  if (ev.month && ev.season && SEASONS[ev.month - 1] !== ev.season) { structural = true; reasons.push(`month ${ev.month}와 season ${ev.season} 불일치`); }
  const el = agg.elig[ev.id];
  if (el && el.months > 0) return { kind: 'unlucky', text: `조건 충족 ${el.months}개월(${el.games}게임)이었지만 추첨되지 않음 — weight ${ev.weight ?? 1} 상향 또는 경쟁 이벤트 확인` };
  if (ev.requiresActivity) {
    const ra = Array.isArray(ev.requiresActivity) ? ev.requiresActivity : [ev.requiresActivity];
    let n = 0;
    for (const a of AGES) if (a >= lo && a <= hi) for (const id of ra) n += agg.acts[a]?.[id] || 0;
    const tooYoung = ra.every(id => (ACTIVITY_MAP[id]?.minAge ?? 0) > hi);
    if (ra.some(id => !ACTIVITY_MAP[id])) { structural = true; reasons.push(`없는 활동 id: ${ra.filter(id => !ACTIVITY_MAP[id]).join(',')}`); }
    else if (tooYoung) { structural = true; reasons.push(`requiresActivity ${ra.join('|')}의 최소 나이가 창보다 늦음`); }
    else if (n === 0) reasons.push(`나이 창에서 ${ra.join('|')} 활동이 한 번도 실행되지 않음`);
  }
  const blocked = [];
  for (const c of compileAll(ev.conditions)) {
    const r = peakEval(c, lo, hi, agg);
    if (r.ok === false) blocked.push(`\`${c.label}\` (${r.peak})`);
  }
  if (blocked.length) reasons.push('최고 상태에서도 불충족: ' + blocked.join(', '));
  if (ev.guardian) reasons.push('보호자 이벤트(15% 상한 적용)');
  const near = Object.entries(agg.near[ev.id] || {}).sort(byCount);
  if (near.length) reasons.push(`조건 하나만 모자랐던 달: ${near.slice(0, 2).map(([k, n]) => `\`${k}\` ${n}회`).join(', ')}`);
  if (!blocked.length && !near.length && !reasons.length) reasons.push('개별 조건은 충족된 적 있으나 동시에 맞은 적 없음');
  return { kind: structural ? 'structural' : blocked.length ? 'blocked' : 'joint', text: reasons.join(' · ') };
}

function analyze(agg, meta) {
  const endIdx = Object.fromEntries(ENDINGS.map(e => [e.id, e]));
  const endSort = byCountEnding(END_ORDER());
  const gen = Object.entries(agg.gen).filter(([p]) => p !== '__seek');
  const genN = gen.reduce((a, [, B]) => a + B.n, 0);
  const genEnd = {};
  for (const [, B] of gen) for (const [e, n] of Object.entries(B.endings)) inc(genEnd, e, n);
  const sum = (key, list = gen) => list.reduce((a, [, B]) => a + B[key], 0);
  const seekB = agg.gen.__seek ?? policyBucket();
  const reach = ENDINGS.map(e => {
    const R = agg.seek[e.id];
    // 실패한 플래그 게이트가 데이터 어디에서도 세워지지 않으면 표시 (가장 직접적인 원인)
    const why = R ? Object.entries(R.why).sort(byCount).map(([k, n]) => { const m = /^게이트 flag\.(\w+)$/.exec(k); return [m && !flagProviders(m[1]).length ? k + ' (세우는 곳 없음)' : k, n]; }) : [];
    // seek가 허용 목록 밖의 (해금) 보호자를 골라야 했던 엔딩 — 출신 전용 경로
    const unlockG = R ? Object.keys(R.guard).filter(g => !(meta.guardians ?? ['knight', 'scholar']).includes(g)).sort() : [];
    return { id: e.id, name: e.name, cat: e.cat, hidden: !!e.hidden, seekN: R?.n ?? 0, seekOk: R?.ok ?? 0, rate: R && R.n ? R.ok / R.n : null, general: genEnd[e.id] || 0, why, got: R ? Object.entries(R.got).sort(endSort) : [], unlockG };
  });
  const dist = Object.entries(genEnd).sort(endSort).map(([id, n]) => ({ id, name: endIdx[id]?.name ?? id, n, share: n / (genN || 1) }));
  const coverageEvents = EVENTS;
  const unseen = coverageEvents.filter(e => !agg.seen[e.id]).map(e => ({ id: e.id, src: sourceOf(e.id), age: e.age, chainOnly: !!e.chainOnly, weight: e.weight ?? 1, ...diagnoseEvent(e, agg) }));
  const totalGames = agg.games.general + agg.games.seek + agg.games.legacy;
  const legacyOnly = coverageEvents.filter(e => agg.seen[e.id] && !agg.seenFresh[e.id]).map(e => ({ id: e.id, src: sourceOf(e.id), games: agg.seen[e.id] }));
  const rare = coverageEvents.filter(e => agg.seen[e.id] && !e.repeatable).map(e => ({ id: e.id, src: sourceOf(e.id), share: agg.seen[e.id] / totalGames })).sort((a, b) => (a.share - b.share) || a.id.localeCompare(b.id)).slice(0, 12);
  // 선택지 커버리지 (본 이벤트 중 한 번도 안 고른 선택지 / 한쪽 판정 결과가 안 나온 선택지)
  const choiceGaps = [];
  for (const e of coverageEvents) {
    if (!agg.seen[e.id]) continue;
    (e.choices || []).forEach((c, i) => {
      const n = agg.choice[`${e.id}#${i}`] || 0;
      if (!n) choiceGaps.push({ id: e.id, idx: i, label: typeof c.label === 'string' ? c.label : '(함수)', what: c.conditions?.length ? `선택된 적 없음 (조건 ${c.conditions.filter(x => typeof x === 'string').join(', ')})` : '선택된 적 없음' });
      else if (c.check) {
        const S = agg.choice[`${e.id}#${i}#S`] || 0, F = agg.choice[`${e.id}#${i}#F`] || 0;
        if (n >= 20 && (S === 0 || F === 0)) choiceGaps.push({ id: e.id, idx: i, label: typeof c.label === 'string' ? c.label : '(함수)', what: S === 0 ? `판정 성공 0/${n} (dc ${c.check.dc})` : `판정 실패 0/${n} (dc ${c.check.dc})` });
      }
    });
  }
  const ageEv = (kind) => AGES.map(a => { const x = agg.ageEv[kind][a]; return { age: a, perMonth: x && x[1] ? x[0] / x[1] : 0 }; });
  const perPolicy = gen.map(([p, B]) => ({ policy: p, n: B.n, top: Object.entries(B.endings).sort(endSort).slice(0, 3).map(([id, n]) => ({ id, name: endIdx[id]?.name ?? id, n })),
    refusals: B.refusals / B.n, forced: B.forced / B.n, persuaded: B.persuaded / B.n, collapses: B.collapses / B.n, autonomy: B.autonomy / B.n, evPerMonth: B.events / B.n / MONTHS_PER_GAME, trust: B.trust / B.n, annual: B.annual / B.n, bought: B.bought / B.n }))
    .sort((a, b) => GENERAL_POLICIES.indexOf(a.policy) - GENERAL_POLICIES.indexOf(b.policy));
  const summary = {
    data: { events: EVENTS.length, eventFiles: Object.fromEntries(Object.entries(EVENT_SOURCES || {}).map(([f, l]) => [f, l.length])), endings: ENDINGS.length, hiddenEndings: ENDINGS.filter(e => e.hidden).length, annualAges: Object.keys(ANNUAL).length, items: ITEMS.length },
    params: { cmd: meta.cmd, K: meta.K ?? 40, N: meta.N ?? 2000, legacy: agg.games.legacy, seed: meta.seed ?? 1, workers: meta.workers, guardians: meta.guardians ?? ['knight', 'scholar'], mg: meta.mg === undefined ? DEFAULT_SEEK_MG : meta.mg, shop: meta.shop !== false, wallMs: meta.wallMs, cpuMs: agg.ms, tasks: meta.tasks },
    games: agg.games,
    reachableBySeek: reach.filter(r => r.seekOk > 0).length,
    seekTested: reach.filter(r => r.seekN > 0).length,
    reachableAny: reach.filter(r => r.seekOk > 0 || r.general > 0).length,
    seekRate: reach.filter(r => r.seekN).reduce((a, r) => a + r.seekOk, 0) / (reach.filter(r => r.seekN).reduce((a, r) => a + r.seekN, 0) || 1),
    neverReached: reach.filter(r => r.seekN > 0 && r.seekOk === 0 && r.general === 0).map(r => r.id),   // seek를 돌린 엔딩만 판정
    seekZero: reach.filter(r => r.seekN > 0 && r.seekOk === 0).map(r => r.id),
    generalKinds: dist.length,
    topShare: dist[0] ? { id: dist[0].id, name: dist[0].name, share: dist[0].share } : null,
    overShare: dist.filter(d => d.share > TOP_SHARE_WARN).map(d => d.id),
    general: { evPerMonth: sum('events') / (genN || 1) / MONTHS_PER_GAME, refusals: sum('refusals') / (genN || 1), forced: sum('forced') / (genN || 1), collapses: sum('collapses') / (genN || 1), autonomy: sum('autonomy') / (genN || 1), hidden: sum('hidden') / (genN || 1), annual: sum('annual') / (genN || 1), bought: sum('bought') / (genN || 1), overflow: sum('overflow') },
    seek: { evPerMonth: seekB.n ? seekB.events / seekB.n / MONTHS_PER_GAME : 0, refusals: seekB.n ? seekB.refusals / seekB.n : 0, forced: seekB.n ? seekB.forced / seekB.n : 0, collapses: seekB.n ? seekB.collapses / seekB.n : 0, autonomy: seekB.n ? seekB.autonomy / seekB.n : 0, mg: seekB.n ? seekB.mg / seekB.n : 0, overflow: seekB.overflow },
    quiet: { general: { share: agg.quiet.general.months / ((agg.games.general || 1) * MONTHS_PER_GAME), streak2Games: agg.quiet.general.streak2 / (agg.games.general || 1), maxStreak: agg.quiet.general.maxStreak },
      seek: { share: agg.quiet.seek.months / ((agg.games.seek || 1) * MONTHS_PER_GAME), streak2Games: agg.quiet.seek.streak2 / (agg.games.seek || 1), maxStreak: agg.quiet.seek.maxStreak } },
    coverage: { total: coverageEvents.length, seen: coverageEvents.filter(e => agg.seen[e.id]).length, unseen: unseen.length },
    errors: Object.entries(agg.errors).map(([msg, v]) => ({ msg, n: v.n, example: v.example })),
  };
  return { summary, reach, dist, perPolicy, unseen, rare, legacyOnly, choiceGaps, ageEv: { general: ageEv('general'), seek: ageEv('seek') } };
}

// ══════════════════════════════════════════════════════════════════════
// 출력
// ══════════════════════════════════════════════════════════════════════
// 집계 순서(워커 분배)에 따라 결과가 달라지지 않도록 동률은 항상 같은 기준으로 정렬한다
const END_ORDER = () => Object.fromEntries(ENDINGS.map((e, i) => [e.id, i]));
const byCount = (a, b) => (b[1] - a[1]) || String(a[0]).localeCompare(String(b[0]));
function byCountEnding(order) { return (a, b) => (b[1] - a[1]) || ((order[a[0]] ?? 1e9) - (order[b[0]] ?? 1e9)) || String(a[0]).localeCompare(String(b[0])); }
const pct = (x, d = 1) => (x * 100).toFixed(d) + '%';
const f2 = (x) => x.toFixed(2);
const f1 = (x) => x.toFixed(1);
const mark = (r) => r.seekN === 0 ? '—' : r.rate >= 0.5 ? '✅' : r.rate > 0 ? '🟡' : (r.general > 0 ? '🟠' : '❌');
const esc = (t) => String(t).replace(/\|/g, '\\|');

export function renderMarkdown(res, date = new Date()) {
  const { summary: S, reach, dist, perPolicy, unseen, rare, legacyOnly, choiceGaps, ageEv } = res;
  const L = [];
  const day = date.toISOString().slice(0, 10);
  L.push('# 「별의 공주」 밸런스 보고서 — 엔딩 도달 가능성 · 이벤트 커버리지', '');
  L.push(`> 자동 생성: \`node tools/reach.mjs${S.params.cmd != null ? (S.params.cmd ? ' ' + S.params.cmd : '') : ` ${S.params.K} ${S.params.N}`}\` (${day}). 콘텐츠가 들어올 때마다 다시 돌린다. 직접 수정하지 말 것.`, '');
  L.push(`- 데이터: 이벤트 **${S.data.events}**개 (${Object.entries(S.data.eventFiles).map(([f, n]) => `${f} ${n}`).join(', ')}) · 엔딩 **${S.data.endings}**종 (히든 ${S.data.hiddenEndings}) · 연간 결정 ${S.data.annualAges}개 나이 · 아이템 ${S.data.items}종`);
  L.push(`- 실행: seek ${S.params.K}판 × 엔딩 ${S.seekTested}종 + 일반 정책 ${S.params.N}판 (+ 커버리지용 2회차 이상 ${S.params.legacy}판) · 시드 ${S.params.seed} · 보호자 ${S.params.guardians.join('/')} · 미니게임 점수 ${S.params.mg ?? '자동 판정'} · 상점 ${S.params.shop ? '사용' : '미사용'} · 워커 ${S.params.workers} · ${f1(S.params.wallMs / 1000)}초`);
  L.push('');
  L.push('## 요약', '');
  L.push(`| 지표 | 값 | 기준 |`, `|---|---|---|`);
  L.push(`| 목표 추구(seek)로 도달한 엔딩 | **${S.reachableBySeek} / ${S.seekTested}** (평균 성공률 ${pct(S.seekRate)}) | 전 엔딩 도달 |`);
  L.push(`| 어떤 방법으로도 도달 못 한 엔딩 | ${S.neverReached.length ? S.neverReached.map(x => '`' + x + '`').join(', ') : '없음'} | 없음 |`);
  L.push(`| 일반 정책 분포에 나온 엔딩 종류 | ${S.generalKinds} / ${S.data.endings} | — |`);
  L.push(`| 최다 엔딩 점유율 (일반) | ${S.topShare ? `${S.topShare.name} ${pct(S.topShare.share)}` : '—'} ${S.overShare.length ? '⚠' : ''} | ≤ 20% |`);
  L.push(`| 월평균 이벤트 (일반 / seek) | ${f2(S.general.evPerMonth)} / ${f2(S.seek.evPerMonth)} | ≈ ${EVENT_TARGET} |`);
  L.push(`| 무이벤트 달 비율 · 2달 연속 무이벤트 겪은 판 | ${pct(S.quiet.general.share)} · ${pct(S.quiet.general.streak2Games)} (최장 ${S.quiet.general.maxStreak}달) | 연속 2달 금지 |`);
  L.push(`| 이벤트 커버리지 | ${S.coverage.seen} / ${S.coverage.total} (미등장 ${S.coverage.unseen}) | 전부 등장 |`);
  L.push(`| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (일반) | ${f1(S.general.refusals)} · ${f1(S.general.forced)} · ${f2(S.general.collapses)} · ${f1(S.general.autonomy)} | — |`);
  L.push(`| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (seek) | ${f1(S.seek.refusals)} · ${f1(S.seek.forced)} · ${f2(S.seek.collapses)} · ${f1(S.seek.autonomy)} | — |`);
  if (S.errors.length) L.push(`| ⚠ 오류로 중단된 판 | ${S.errors.reduce((a, e) => a + e.n, 0)} | 0 |`);
  L.push('');
  L.push('판정: ✅ seek 성공률 ≥ 50% · 🟡 1~49% · 🟠 seek 0%지만 일반 플레이에서 나옴 · ❌ 도달 못 함. seek 성공률은 "목표를 알고 노리는 플레이어"의 하한 추정이다 (휴리스틱 정책이므로 0%가 곧 불가능은 아니지만, 원인 칸이 막힌 지점을 가리킨다).', '');

  L.push('## 1. 엔딩 도달 가능성', '');
  L.push('| | 엔딩 | id | 분류 | seek 성공 | 일반 N판 등장 | 실패 주원인 (seek 실패 판 기준) |', '|---|---|---|---|---|---|---|');
  for (const r of reach) {
    const fails = r.seekN - r.seekOk;
    const why = r.why.slice(0, 2).map(([k, n]) => `${esc(k)} ${n}/${fails}`).join('; ');
    const got = r.got.slice(0, 2).map(([k, n]) => `${k} ${n}`).join(', ');
    L.push(`| ${mark(r)} | ${r.name}${r.hidden ? ' (히든)' : ''}${r.unlockG.length ? ` (해금 출신 ${r.unlockG.join('/')} 필요)` : ''} | \`${r.id}\` | ${r.cat} | ${r.seekN ? `${r.seekOk}/${r.seekN} (${pct(r.rate, 0)})` : '—'} | ${r.general} (${pct(r.general / (S.games.general || 1))}) | ${fails ? why + (got ? ` → 대신 ${got}` : '') : ''} |`);
  }
  L.push('');

  L.push('## 2. 엔딩 분포 (일반 정책 10종)', '');
  if (S.overShare.length) L.push(`> ⚠ **점유율 20% 초과**: ${S.overShare.map(id => dist.find(d => d.id === id)).map(d => `${d.name} ${pct(d.share)}`).join(', ')} — 가중치·게이트 조정 필요 (GDD 7.3).`, '');
  L.push('| 순위 | 엔딩 | id | 판 수 | 점유율 | |', '|---|---|---|---|---|---|');
  dist.forEach((d, i) => L.push(`| ${i + 1} | ${d.name} | \`${d.id}\` | ${d.n} | ${pct(d.share)} | ${d.share > TOP_SHARE_WARN ? '⚠ 20% 초과' : '█'.repeat(Math.max(0, Math.round(d.share * 50)))} |`));
  const missing = reach.filter(r => !r.general).map(r => `\`${r.id}\``);
  if (missing.length) L.push('', `일반 정책에서 한 번도 안 나온 엔딩 (${missing.length}): ${missing.join(', ')}`);
  L.push('');
  L.push('### 정책별 지표', '');
  L.push('| 정책 | 판 | 상위 엔딩 | 거부 | 강행 | 설득 성공 | 탈진 | 자율 슬롯 | 이벤트/월 | 최종 신뢰 | 연간 결정 | 구매 |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const p of perPolicy) L.push(`| ${p.policy} | ${p.n} | ${p.top.map(t => `${t.name} ${t.n}`).join(', ')} | ${f1(p.refusals)} | ${f1(p.forced)} | ${f1(p.persuaded)} | ${f2(p.collapses)} | ${f1(p.autonomy)} | ${f2(p.evPerMonth)} | ${f1(p.trust)} | ${f1(p.annual)} | ${f1(p.bought)} |`);
  L.push('');

  L.push('## 3. 이벤트 밀도', '');
  L.push(`목표: 월평균 ${EVENT_TARGET}회, 무이벤트 달 연속 2회 이상 금지 (GDD 2).`, '');
  L.push('| 나이 | ' + AGES.join(' | ') + ' | 전체 |', '|---|' + AGES.map(() => '---').join('|') + '|---|');
  L.push('| 일반 이벤트/월 | ' + ageEv.general.map(a => f2(a.perMonth)).join(' | ') + ` | **${f2(S.general.evPerMonth)}** |`);
  L.push('| seek 이벤트/월 | ' + ageEv.seek.map(a => f2(a.perMonth)).join(' | ') + ` | **${f2(S.seek.evPerMonth)}** |`);
  L.push('');
  L.push(`- 무이벤트 달: 일반 ${pct(S.quiet.general.share)} (2달 연속을 겪은 판 ${pct(S.quiet.general.streak2Games)}, 최장 ${S.quiet.general.maxStreak}달) · seek ${pct(S.quiet.seek.share)} (최장 ${S.quiet.seek.maxStreak}달)`);
  L.push(`- 연쇄 순환 보호(한 달 20건 초과) 발동: 일반 ${S.general.overflow}회 · seek ${S.seek.overflow}회`);
  L.push(`- seek가 미니게임 점수(${S.params.mg ?? '—'})를 쓴 판정: 판당 ${f1(S.seek.mg)}회`);
  L.push('');

  L.push(`## 4. 이벤트 커버리지 — 미등장 ${unseen.length}개 / 전체 ${S.coverage.total}개`, '');
  L.push('모든 판(seek + 일반 + 2회차 이상 표본)을 합쳐 한 번도 나오지 않은 이벤트. 진단은 이벤트 나이 창 안에서 관측된 최고·최저 상태로 각 조건을 따로 평가한 결과다 (개별로는 통과해도 동시에 맞지 않을 수 있음).', '');
  if (unseen.length) {
    L.push('| 이벤트 | 파일 | 나이 | weight | 진단 |', '|---|---|---|---|---|');
    for (const u of unseen) L.push(`| \`${u.id}\` | ${u.src} | ${u.chainOnly ? '연쇄' : u.age ? u.age.join('~') : '—'} | ${u.weight} | ${esc(u.text)} |`);
  } else L.push('모든 이벤트가 최소 한 번 등장했다. ✅');
  L.push('');
  if (legacyOnly.length) {
    L.push('### 2회차 이상 표본에서만 나온 이벤트 (회차 조건 · 해금 보호자 출신 전용)', '');
    L.push(legacyOnly.map(x => `\`${x.id}\` (${x.src}, ${x.games}판)`).join(' · '), '');
  }
  if (rare.length) {
    L.push('### 드물게 나온 이벤트 (반복 불가 이벤트 중 등장 판 비율 하위)', '');
    L.push('| 이벤트 | 파일 | 등장 판 비율 |', '|---|---|---|');
    for (const r of rare) L.push(`| \`${r.id}\` | ${r.src} | ${pct(r.share, 2)} |`);
    L.push('');
  }
  if (choiceGaps.length) {
    L.push(`### 선택지 커버리지 공백 (${choiceGaps.length}건)`, '');
    L.push('등장한 이벤트 중 한 번도 고르지 않은 선택지, 또는 20회 이상 골랐는데 판정이 한쪽으로만 나온 선택지.', '');
    L.push('| 이벤트 | 선택지 | 내용 |', '|---|---|---|');
    for (const g of choiceGaps.slice(0, 60)) L.push(`| \`${g.id}\` | ${g.idx + 1}. ${esc(g.label)} | ${esc(g.what)} |`);
    if (choiceGaps.length > 60) L.push(`| … | | ${choiceGaps.length - 60}건 더 |`);
    L.push('');
  }
  if (S.errors.length) {
    L.push('## ⚠ 오류', '');
    L.push('| 횟수 | 메시지 | 예시 |', '|---|---|---|');
    for (const e of S.errors) L.push(`| ${e.n} | ${esc(e.msg)} | ${e.example} |`);
    L.push('');
  }
  L.push('## 방법', '');
  L.push('- **일반 정책 10종** (`random` `focus_body` `focus_mind` `focus_social` `focus_inner` `balanced` `hands_off` `tyrant` `shadow` `nurture`): v0.1 시뮬레이터와 같은 스케줄·거부·이벤트 규칙 + 연간 결정(정책 성향대로)·상점(가끔, 성향에 맞는 물건). 시드 `seed..seed+N-1`, 보호자는 기사/학자 무작위.');
  L.push('- **seek:<엔딩>**: 엔딩의 gates·bonus 조건을 파싱해 부족분을 정규화한 효용 함수로 매 결정을 1수 앞보기한다. 활동 3슬롯(엔진 효과 근사 + 월말 정산 예측), 거부 대응(수용/설득 확률/강행 기대값), 이벤트 선택(판정 성공·실패 기대값, `next` 연쇄까지 최대 4단 앞보기), 연간 결정, 상점 구매. 필요한 플래그는 그 플래그를 세우는 이벤트·선택지·연간 결정·아이템을 역추적해 선행 조건·판정 능력치(주사위면 dc+40, 미니게임이면 고정 swing+5, `check.bonus`는 현재 값만큼 뺌)·요구 활동을 하위 목표로 삼는다. 경쟁 엔딩(점수 역전)과 원치 않는 히든 엔딩(선점)은 게이트 근접도로 벌점을 주고, 앞선 점수는 200점까지 선형·그 뒤로 로그로 가치를 매겨 게이트를 일찍 채운 뒤에도 점수를 계속 키운다. 조건 하나만 남은 이벤트는 "그 문턱을 넘으면 열릴 이벤트의 기대 가치"로 미리 피하거나 노리고, 남은 고정 이벤트가 피할 수 없이 더할 값(예: 생일의 신뢰 +4)은 게이트 판정에 미리 더한다. 미니게임 판정에는 점수 0.7(괜찮은 플레이어)을 넣는다. 보호자는 해금 없이 고를 수 있는 기사/학자 중 목표에 맞는 쪽(게이트 플래그가 출신 전용 경로로만 세워지면 그 출신 — 표에 "해금 출신 필요"로 표시), 목표 게이트가 회차 조건(playthrough·legacyCount)을 요구하면 그 회차로 시작한다.');
  L.push('- **2회차 이상 표본** (기본 N/10판): 일반 정책 + 회차 2~(데이터의 회차 조건 최댓값, 최소 4)·이전 회차 딸 = 회차-1명 + 보호자 출신 5종(해금 출신 포함)을 돌아가며. 출신 전용·회차 전용 이벤트의 커버리지 집계에만 쓰고 분포에는 넣지 않는다.');
  L.push('- 커버리지 진단: 매달 실행 직후 상태에서 조건 경로별 나이별 최고·최저값과 플래그·함수 조건의 참/거짓 관측을 기록하고, 미등장 이벤트는 적격이었던 달 수와 "조건 하나만 모자랐던" 달 수(판×달 누적)를 센다.');
  L.push('- seek 판의 시드는 엔딩 id에서 정한다 (`seed + 1,000,000 + (FNV(id) mod 10⁶)×100 + k`). 엔딩이 추가·재배열돼도 기존 엔딩의 결과는 바뀌지 않는다.');
  L.push('');
  return L.join('\n');
}

export function renderConsole(res) {
  const { summary: S, reach, dist, unseen } = res;
  const out = [];
  out.push(`\n=== 별의 공주 도달 가능성 보고서: seek ${S.params.K}×${S.seekTested} + 일반 ${S.params.N} + 2회차 ${S.params.legacy} = ${S.games.general + S.games.seek + S.games.legacy}판, ${f1(S.params.wallMs / 1000)}s (워커 ${S.params.workers}, CPU ${f1(S.params.cpuMs / 1000)}s) ===`);
  out.push(`데이터: 이벤트 ${S.data.events} · 엔딩 ${S.data.endings}(히든 ${S.data.hiddenEndings}) · 연간 ${S.data.annualAges} · 아이템 ${S.data.items}`);
  out.push(`\n엔딩 도달 (seek 성공률 · 일반 등장):`);
  const cells = reach.map(r => `${mark(r)} ${r.id} ${r.seekN ? pct(r.rate, 0) : '—'}·${r.general}`);
  for (let i = 0; i < cells.length; i += 4) out.push('  ' + cells.slice(i, i + 4).map(c => c.padEnd(30)).join(''));
  out.push(`  → seek 도달 ${S.reachableBySeek}/${S.seekTested} (평균 ${pct(S.seekRate)}), 미도달: ${S.neverReached.join(', ') || '없음'}`);
  for (const r of reach.filter(r => r.seekN && r.rate < 0.5)) out.push(`     ${r.id}: ${r.why.slice(0, 2).map(([k, n]) => `${k} ×${n}`).join('; ')}`);
  out.push(`\n일반 분포 상위: ${dist.slice(0, 6).map(d => `${d.share > TOP_SHARE_WARN ? '⚠' : ''}${d.name} ${pct(d.share)}`).join(', ')}  (종류 ${S.generalKinds}/${S.data.endings})`);
  out.push(`이벤트/월: 일반 ${f2(S.general.evPerMonth)} · seek ${f2(S.seek.evPerMonth)} (목표 ${EVENT_TARGET}) · 무이벤트 달 ${pct(S.quiet.general.share)}, 2달 연속 겪은 판 ${pct(S.quiet.general.streak2Games)}`);
  out.push(`게임당(일반): 거부 ${f1(S.general.refusals)} · 강행 ${f1(S.general.forced)} · 탈진 ${f2(S.general.collapses)} · 자율 ${f1(S.general.autonomy)} · 히든 ${pct(S.general.hidden)}`);
  out.push(`커버리지: ${S.coverage.seen}/${S.coverage.total} 등장, 미등장 ${unseen.length}`);
  for (const u of unseen.slice(0, 15)) out.push(`  - ${u.id} [${u.src}] ${u.text}`);
  if (unseen.length > 15) out.push(`  … ${unseen.length - 15}개 더 (보고서 참조)`);
  if (S.errors.length) { out.push(`⚠ 오류 ${S.errors.reduce((a, e) => a + e.n, 0)}판:`); for (const e of S.errors.slice(0, 5)) out.push(`  ${e.n}× ${e.msg} (${e.example})`); }
  return out.join('\n');
}

// ══════════════════════════════════════════════════════════════════════
// 진입점
// ══════════════════════════════════════════════════════════════════════
if (!isMainThread && workerData?.role === 'reach-worker') {
  parentPort.on('message', (m) => {
    if (m.type === 'batch') parentPort.postMessage({ type: 'result', n: m.tasks.length, agg: runBatch(m.tasks) });
    else if (m.type === 'done') process.exit(0);
  });
} else if (isMainThread && process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE);
    process.exit(0);
  }
  const nums = args.filter(a => /^\d+$/.test(a));
  const opt = (k) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : undefined; };
  const KNOWN = ['seed', 'workers', 'only', 'out', 'json', 'guardians', 'mg', 'legacy'], FLAGS = ['--no-shop', '--no-write', '--quiet'];
  const bad = args.filter(a => !/^\d+$/.test(a) && !FLAGS.includes(a) && !KNOWN.some(k => a.startsWith(`--${k}=`)));
  if (bad.length) { console.error(`알 수 없는 인자: ${bad.join(' ')}\n\n${USAGE}`); process.exit(2); }
  const unknownEnd = (opt('only') || '').split(',').filter(x => x && !ENDINGS.some(e => e.id === x));
  if (unknownEnd.length) { console.error(`--only: 없는 엔딩 id ${unknownEnd.join(', ')}\n가능: ${ENDINGS.map(e => e.id).join(' ')}`); process.exit(2); }
  const unknownG = (opt('guardians') || '').split(',').filter(x => x && !GUARDIANS[x]);
  if (unknownG.length) { console.error(`--guardians: 없는 보호자 ${unknownG.join(', ')} (가능: ${Object.keys(GUARDIANS).join(', ')})`); process.exit(2); }
  const mgRaw = opt('mg');
  if (mgRaw !== undefined && mgRaw !== 'none' && !(Number(mgRaw) >= 0 && Number(mgRaw) <= 1)) { console.error('--mg는 0~1 사이 숫자 또는 none'); process.exit(2); }
  const opts = {
    K: Number(nums[0] ?? 40), N: Number(nums[1] ?? 2000), seed: Number(opt('seed') ?? 1),
    workers: opt('workers') ? Number(opt('workers')) : undefined,
    only: opt('only') ? opt('only').split(',') : null,
    guardians: opt('guardians') ? opt('guardians').split(',') : null,
    mg: mgRaw === undefined ? undefined : mgRaw === 'none' ? null : Number(mgRaw),
    shop: !args.includes('--no-shop'), quiet: args.includes('--quiet'),
    legacy: opt('legacy') !== undefined ? Number(opt('legacy')) : undefined,
    cmd: args.filter(a => !/^--(out|json)=/.test(a)).join(' '),
  };
  let res;
  try { res = await runReach(opts); }
  catch (e) { console.error('reach 실행 실패 (콘텐츠 파일 import 오류일 수 있음 — node tools/validate.mjs 확인):\n', e?.stack ?? e); process.exit(1); }
  console.log(renderConsole(res));
  if (!args.includes('--no-write')) {
    const out = opt('out') ? resolve(opt('out')) : DEFAULT_OUT;
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, renderMarkdown(res) + '\n');
    console.log(`\n보고서 저장: ${out}`);
  }
  if (opt('json')) { writeFileSync(resolve(opt('json')), JSON.stringify(res, null, 1)); console.log('JSON 저장:', resolve(opt('json'))); }
  if (res.summary.errors.length) process.exitCode = 1;
}
