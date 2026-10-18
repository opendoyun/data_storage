// 헤드리스 시뮬레이션 공용 코어 — simulate.mjs · reach.mjs · test.mjs가 함께 쓴다.
//
//   playGame(policy, seed, opts) → 최종 상태 s (s.ending 포함)
//     policy: 일반 정책 10종(GENERAL_POLICIES) 또는 'seek:<endingId>' (목표 엔딩 추구)
//     opts.guardian     보호자 고정 (기본: 일반=시드 난수 knight/scholar, seek=목표에 맞는 쪽)
//     opts.guardians    seek가 고를 수 있는 보호자 목록 (기본 ['knight','scholar'] — 해금 없이 고를 수 있는 것).
//                       게이트 플래그가 출신 전용 경로로만 세워지면 목록 밖이라도 그 출신을 고른다 (reach 보고서에 표시)
//     opts.newGame      newGame 옵션 덮어쓰기 (예: { playthrough: 3, legacy: makeLegacy(2) })
//     opts.mgScore      미니게임 점수(0~1). seek 기본 0.7(괜찮은 플레이어), 일반 기본 없음(자동 판정)
//     opts.shop         false면 상점 이용 안 함
//     opts.hooks        { afterRun(s, report), event(s, ev, choiceIndex, out), monthEnd(s, nEvents, report), annual(s, a, idx) }
//
// 데이터 주도: 엔딩 gates/bonus/weights, 이벤트 conditions/effects/next, ANNUAL, ITEMS를 실행 시점에 읽는다.
// 콘텐츠 파일이 바뀌어도 코드 수정 없이 동작해야 한다. 엔진 내부 규칙(활동 1슬롯 효과·월말 정산)은
// seek 정책의 '예상치' 계산에만 근사로 복제한다 — 실제 진행은 항상 엔진 함수로 한다.
import {
  newGame, checkRefusals, resolveRefusal, runMonth, currentEvent, chooseEvent, endMonth, applyAnnual, shopList, buyItem,
  applyEffects, masteryLevel, GUARDIAN_EVENT_CAP, GUARDIANS,
  ACTIVITIES, ACTIVITY_MAP, STATS, ENDINGS, EVENTS, EVENT_MAP, ITEMS, ANNUAL,
} from '../js/engine/engine.js';
import { resolvePath } from '../js/engine/conditions.js';
import { makeRng } from '../js/engine/rng.js';
import { STAT_MAX, STAT_TENSION, stageOf } from '../js/data/stats.js';
import { autonomyPreferences } from '../js/data/activities.js';

export const GENERAL_POLICIES = ['random', 'focus_body', 'focus_mind', 'focus_social', 'focus_inner', 'balanced', 'hands_off', 'tyrant', 'shadow', 'nurture'];
export const SEEK_PREFIX = 'seek:';
export const DEFAULT_SEEK_MG = 0.7;
export const MONTHS_PER_GAME = 96;
const FOOD_COST = 30;            // engine.js의 FOOD_COST와 동일 (내보내지 않으므로 근사용 상수)
const CATS = { body: ['sword', 'farm', 'smith', 'adventure'], mind: ['school', 'magic', 'commerce', 'shop'], social: ['etiquette', 'inn', 'castle', 'theater', 'outing'], inner: ['art', 'theology', 'church', 'sewing'] };
const STAT_CAT = Object.fromEntries(STATS.map(x => [x.id, x.cat]));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const EMPTY = Object.freeze({});

// ══════════════════════════════════════════════════════════════════════
// 조건식 컴파일러 — conditions.js evalCondition과 동일한 의미, 빠른 경로 + 계획용 메타데이터
// ══════════════════════════════════════════════════════════════════════
const COND_RE = /^\s*(!?)([\w.]+)\s*(?:(>=|<=|==|!=|>|<)\s*(.+?))?\s*$/;
const OPS = { '>=': (a, b) => a >= b, '<=': (a, b) => a <= b, '>': (a, b) => a > b, '<': (a, b) => a < b, '==': (a, b) => a == b, '!=': (a, b) => a != b };
const NEG_OP = { '>=': '<', '<=': '>', '>': '<=', '<': '>=', '==': '!=', '!=': '==' };
const ROOTS = { stat: s => s.stats, pers: s => s.personality, rel: s => s.relations, flag: s => s.flags, mastery: s => s.mastery, count: s => s.counters, item: s => s.items || EMPTY, seen: s => s.seen || EMPTY };
const SCALARS = {
  age: s => s.age, month: s => s.month, season: s => s.season, stage: s => s.stage, stress: s => s.stress, trust: s => s.trust, gold: s => s.gold,
  infamy: s => s.infamy, reputation: s => s.reputation, guardian: s => s.guardian, gHealth: s => s.guardianHealth,
  legacyCount: s => (s.legacy || []).length, playthrough: s => s.playthrough || 1,
};
// 계획 시 '움직일 수 있는' 값들과 정규화 척도 (값 1단위 부족 = 척도분의 1)
const SCALE = { stat: 100, pers: 20, rel: 12, mastery: 4, item: 1, seen: 1, flag: 1, trust: 12, stress: 20, gold: 300, infamy: 8, reputation: 8, gHealth: 12 };
const COUNT_SCALE = { autonomy: 8, adventures: 3, collapses: 1, forced: 2, refusals: 3, persuaded: 2, events: 10, months: 12 };
const STRING_PATHS = new Set(['season', 'stage', 'guardian']);

function parseValue(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw.replace(/^['"]|['"]$/g, '');
}
function makeGetter(path) {
  const parts = path.split('.');
  if (parts.length === 2 && ROOTS[parts[0]]) { const root = ROOTS[parts[0]], k = parts[1]; return s => { const o = root(s); return o == null ? undefined : o[k]; }; }
  if (parts.length === 1 && SCALARS[parts[0]]) return SCALARS[parts[0]];
  return s => resolvePath(s, path);
}
const COND_CACHE = new Map();
function parseDsl(expr) {
  const m = COND_RE.exec(expr);
  if (!m) throw new Error('잘못된 조건식: ' + expr);
  const [, neg, path, op, rawVal] = m;
  const get = makeGetter(path);
  const value = op ? parseValue(rawVal) : undefined;
  const root = path.split('.')[0], key = path.split('.')[1] ?? null;
  const f = op ? OPS[op] : null;
  const test = !op ? (neg ? s => !get(s) : s => !!get(s)) : (neg ? s => !f(get(s) ?? 0, value) : s => f(get(s) ?? 0, value));
  // 실효 연산자 (부정 반영)와 '원하는 방향'
  const effOp = op ? (neg ? NEG_OP[op] : op) : null;
  const controllable = ['stat', 'pers', 'rel', 'flag', 'mastery', 'count', 'item'].includes(root) || ['trust', 'stress', 'gold', 'infamy', 'reputation', 'gHealth'].includes(path);
  const scale = root === 'count' ? (COUNT_SCALE[key] ?? 3) : (SCALE[root] ?? SCALE[path] ?? 1);
  const kind = root === 'flag' ? 'flag' : STRING_PATHS.has(path) ? 'string' : 'number';
  return { opaque: false, path, root, key, op, effOp, value, neg: !!neg, get, test, controllable, scale, kind };
}
// c.label: 보고서·진단에 쓰는 사람이 읽는 문자열 (문자열 조건은 그대로, 함수는 아래 규칙)
export function compileCondition(expr) {
  let c = COND_CACHE.get(expr);
  if (c) return c;
  if (typeof expr === 'function') {
    // 함수 조건: 판정은 언제나 함수로 한다. 데이터가 toString을 DSL 문자열로 덮어쓴 경우(예: b06의 origin('merchant')
    // → "guardian == 'merchant'")에는 그 문자열로 계획·진단 메타데이터를 만든다. 아니면 불투명(opaque) 조건.
    const label = expr.toString !== Function.prototype.toString ? String(expr) : '';
    let meta = null;
    if (label && COND_RE.test(label)) { try { meta = parseDsl(label); } catch { meta = null; } }
    c = meta ? { ...meta, expr, label, test: s => !!expr(s) } : { expr, label: label || '(함수 조건)', opaque: true, path: null, test: s => !!expr(s) };
  } else {
    c = { ...parseDsl(expr), expr, label: expr };
  }
  COND_CACHE.set(expr, c);
  return c;
}
// 조건 배열 → 컴파일 배열. 데이터 배열 객체마다 한 번만 만든다 (반환값은 읽기 전용으로 쓸 것).
let ARR_CACHE = new WeakMap();
const NO_CONDS = Object.freeze([]);
export function compileAll(conds) {
  if (!conds || !conds.length) return NO_CONDS;
  let c = ARR_CACHE.get(conds);
  if (!c) { c = Object.freeze(conds.map(compileCondition)); ARR_CACHE.set(conds, c); }
  return c;
}
export function testAll(s, compiled) { for (const c of compiled) if (!c.test(s)) return false; return true; }

// 미충족 정도 (0 = 충족, 1 ≈ 척도 하나만큼 부족; 플래그·문자열 미충족 = 1)
// off: 이 경로에 앞으로 '피할 수 없이' 더해질 값 (남은 고정 이벤트의 최소 효과 합)
const isNumericCmp = (c) => !c.opaque && c.op && c.kind === 'number' && typeof c.value === 'number';
export function deficit(c, s, off = 0) {
  if (off && isNumericCmp(c)) {
    const x = Number(c.get(s) ?? 0) + off;
    if (OPS[c.effOp](x, c.value)) return 0;
    return numericDeficit(c, x);
  }
  if (c.test(s)) return 0;
  if (!isNumericCmp(c)) {
    if (c.kind === 'flag' && !c.neg && !c.op && s.fp && s.fp[c.key]) return 1 - s.fp[c.key];   // 확률적으로 세워질 플래그
    return 1;
  }
  return numericDeficit(c, Number(c.get(s) ?? 0));
}
function numericDeficit(c, x) {
  const v = c.value, sc = c.scale;
  switch (c.effOp) {
    case '>=': return (v - x) / sc;
    case '>': return (v - x) / sc + 0.01;
    case '<=': return (x - v) / sc;
    case '<': return (x - v) / sc + 0.01;
    default: return 1;
  }
}
// 게이트 벌점: 미충족 부족분 + 충족 직후의 작은 여유 압박 (능력치 견제·이벤트로 다시 떨어지는 것 방지).
// 임계값 양쪽에서 연속이어야 한다 — 불연속이면 '1 모자란 채로 멈추는' 국소 최적에 빠진다.
const SLACK_BUF = 0.15, SLACK_K = 0.5, SLACK_MAX = SLACK_BUF * SLACK_K;
function gatePenalty(c, s, off = 0) {
  const d = deficit(c, s, off);
  const numeric = !c.opaque && c.kind === 'number' && typeof c.value === 'number' && c.controllable && c.effOp && c.effOp !== '==' && c.effOp !== '!=';
  if (d > 0) return numeric ? d + SLACK_MAX : d;
  if (!numeric) return 0;
  const x = Number(c.get(s) ?? 0) + off, buf = c.scale * SLACK_BUF;
  const m = (c.effOp === '>=' || c.effOp === '>') ? x - c.value : c.value - x;
  return m < buf ? (buf - m) / c.scale * SLACK_K : 0;
}

// ══════════════════════════════════════════════════════════════════════
// 엔딩 점수 (engine.scoreEndings와 동일 수식) — 컴파일 캐시
// ══════════════════════════════════════════════════════════════════════
let ENDING_CACHE = null;
function endingsCompiled() {
  if (ENDING_CACHE && ENDING_CACHE.src === ENDINGS && ENDING_CACHE.n === ENDINGS.length) return ENDING_CACHE.list;
  const list = ENDINGS.map((e, order) => ({
    e, id: e.id, hidden: !!e.hidden, order,
    weights: Object.entries(e.weights || {}), pers: Object.entries(e.pers || {}),
    gates: compileAll(e.gates), bonus: (e.bonus || []).map(b => ({ add: b.add, when: compileAll(b.when) })),
  }));
  ENDING_CACHE = { src: ENDINGS, n: ENDINGS.length, list };
  return list;
}
export function endingScoreRaw(E, s) {
  let base = 0;
  for (const [st, w] of E.weights) base += (s.stats[st] ?? 0) * w;
  let pm = 1;
  for (const [axis, coef] of E.pers) pm += ((s.personality[axis] ?? 0) / 100) * coef;
  pm = clamp(pm, 0.4, 1.8);
  let bonus = 0;
  for (const b of E.bonus) if (testAll(s, b.when)) bonus += b.add;
  return base * pm + bonus;
}
// 게이트 근접도 0~1 (충족=1, 수치는 부족분에 따라 지수 감쇠, 미충족 플래그는 공급 이벤트로 본 '세워질 가능성' fl)
function closeness(E, s, fl) {
  let p = 1;
  for (const c of E.gates) {
    if (c.test(s)) continue;
    if (c.kind === 'number' && c.op && typeof c.value === 'number' && c.controllable) p *= Math.exp(-2 * deficit(c, s));
    else if (c.kind === 'flag') p *= (c.neg || c.op) ? 0.1 : (fl && c.key in fl ? fl[c.key] : 0.25);
    else p *= 0.05;
    if (p < 0.01) return 0;
  }
  return p;
}

// ══════════════════════════════════════════════════════════════════════
// 경량 상태 (계획용 복제본) + 엔진 규칙 근사
// ══════════════════════════════════════════════════════════════════════
// 나머지 필드(history·legacy·seen 등)는 읽기 전용 참조로 그대로 둔다 — 판정 bonus(s) 함수가 무엇을 읽어도 되게.
// (Object.create(s)로 얕게 만드는 쪽은 프로토타입 조회가 느려져 오히려 30% 느렸다)
function lite(s) {
  return {
    ...s,
    stats: { ...s.stats }, personality: { ...s.personality }, relations: { ...s.relations }, flags: { ...s.flags }, mastery: { ...s.mastery },
    counters: { ...s.counters }, items: { ...(s.items || {}) }, fp: s.fp ? { ...s.fp } : {}, milestones: [],
  };
}
const TENSION = Object.fromEntries(Object.entries(STAT_TENSION).map(([k, v]) => [k, Object.entries(v)]));
function addStatLite(L, id, d) {
  const cur = L.stats[id];
  if (cur === undefined) return;
  L.stats[id] = clamp(cur + d, 0, STAT_MAX);
  const t = d > 0 && TENSION[id];
  if (t) for (const [o, coef] of t) L.stats[o] = clamp(L.stats[o] + d * coef, 0, STAT_MAX);
}
// 활동 정의를 루프용 배열로 미리 펼쳐 둔다 (ACTIVITIES가 바뀌면 다시 만든다)
let ACT_CACHE = null;
function actInfo(id) {
  if (!ACT_CACHE || ACT_CACHE.src !== ACTIVITIES || ACT_CACHE.n !== ACTIVITIES.length) ACT_CACHE = { src: ACTIVITIES, n: ACTIVITIES.length, map: {} };
  let a = ACT_CACHE.map[id];
  if (!a) {
    const act = ACTIVITY_MAP[id];
    if (!act) return null;
    a = ACT_CACHE.map[id] = { act, stat: Object.entries(act.stat || {}), pers: Object.entries(act.pers || {}), rel: Object.entries(act.rel || {}), cat: STAT_CAT[Object.keys(act.stat || {})[0]] };
  }
  return a;
}
// 활동 1슬롯의 기대 효과 (engine.runMonth 슬롯 처리의 평균치 근사). p = 확률 가중(자율행동 혼합용)
function applyActivityLite(L, id, g, effMult, p = 1) {
  const info = actInfo(id);
  if (!info) return;
  const act = info.act;
  if (id === 'autonomy') {
    L.counters.autonomy = (L.counters.autonomy || 0) + p;
    L.trust = clamp(L.trust + 3 * p, 0, 100); L.personality.agree = clamp(L.personality.agree + 1 * p, -100, 100); L.stress = clamp(L.stress - 4 * p, 0, 100);
    const prefs = Object.entries(autonomyPreferences(L.personality)).filter(([, w]) => w > 0);
    const tot = prefs.reduce((a, [, w]) => a + w, 0) || 1;
    for (const [aid, w] of prefs) {
      let a2 = aid; const A = ACTIVITY_MAP[aid];
      if (!A) continue;
      if (A.minAge && L.age < A.minAge) a2 = 'outing';
      const q = p * w / tot;
      applyActivityLite(L, a2, g, effMult, q);
      // 엔진의 숨은 플래그 (runMonth: 자율 모험 50% → secret_adventure, 자율 묘지기 → secret_night_work)
      if (a2 === 'adventure') L.fp.secret_adventure = 1 - (1 - (L.fp.secret_adventure || 0)) * (1 - q * 0.5);
      if (a2 === 'graveyard') L.fp.secret_night_work = 1 - (1 - (L.fp.secret_night_work || 0)) * (1 - q);
    }
    return;
  }
  if (act.minAge && L.age < act.minAge) { applyActivityLite(L, 'rest', g, effMult, p); return; }
  const cnt = (L.mastery[id] || 0) + p;
  L.mastery[id] = cnt;
  const level = masteryLevel(Math.floor(cnt));
  let mult = stageOf(L.age).eff * effMult * (1 + 0.1 * (level - 1));
  if (act.type === 'edu' && info.cat === g.bonusCat) mult *= 1.15;
  for (const [st, v] of info.stat) addStatLite(L, st, v * mult * p);
  for (const [k, v] of info.pers) L.personality[k] = clamp((L.personality[k] ?? 0) + v * p, -100, 100);
  for (const [k, v] of info.rel) L.relations[k] = clamp((L.relations[k] ?? 0) + v * p, 0, 100);
  L.stress = clamp(L.stress + act.stress * (L.stress >= 60 ? 1.1 : 1) * p, 0, 100);
  if (act.rep) L.reputation = clamp(L.reputation + act.rep * 0.5 * p, 0, 100);
  L.gold += act.gold * p;
  if (act.gold > 0 && act.type === 'work') L.gold += (level * 5 + (g.workBonus ? act.gold * g.workBonus : 0)) * p;
  if (id === 'adventure') {
    L.counters.adventures = (L.counters.adventures || 0) + p;
    L.gold += 0.25 * 75 * (g.adventureBonus ? 1.5 : 1) * p;
    const inj = (g.adventureBonus ? 0.075 : 0.15) * p;
    L.stress = clamp(L.stress + 10 * inj, 0, 100); addStatLite(L, 'hp', -5 * inj);
  }
  if (id === 'graveyard') L.infamy = clamp(L.infamy + 0.6 * p, 0, 100);
}
// 월말 정산 근사 (소지품 월간 효과 · 연금/식비 · 보호자 건강 · 탈진 · 자연 회복)
function projectMonthEnd(L, g, workCount) {
  for (const [itemId, n] of Object.entries(L.items)) {
    const it = ITEM_BY_ID()[itemId];
    if (n > 0 && it?.monthly) applyEffects(L, it.monthly);
  }
  if (g.stressRelief) L.stress = clamp(L.stress - g.stressRelief, 0, 100);
  L.gold += g.pension - FOOD_COST;
  if (L.gold < 0) { addStatLite(L, 'hp', -4); L.stress = clamp(L.stress + 6, 0, 100); }
  L.guardianHealth = clamp(L.guardianHealth + (workCount === 0 ? -2 : 1), 0, 100);
  if (L.stress >= 100) { L.counters.collapses = (L.counters.collapses || 0) + 1; L.trust = clamp(L.trust - 6, 0, 100); addStatLite(L, 'hp', -8); L.stress = 70; }
  L.stress = clamp(L.stress - 6, 0, 100);
}
let ITEM_IDX = null;
function ITEM_BY_ID() { if (!ITEM_IDX || ITEM_IDX.src !== ITEMS || ITEM_IDX.n !== ITEMS.length) ITEM_IDX = { src: ITEMS, n: ITEMS.length, map: Object.fromEntries(ITEMS.map(i => [i.id, i])) }; return ITEM_IDX.map; }
const isWork = (id) => ACTIVITY_MAP[id]?.type === 'work';
function availableActivities(age) { return ACTIVITIES.filter(a => !a.minAge || age >= a.minAge).map(a => a.id); }

// ══════════════════════════════════════════════════════════════════════
// 플래그 공급자 색인 (목표 역추적용): 어떤 이벤트·선택지·연간결정·아이템이 flag를 세우는가
// ══════════════════════════════════════════════════════════════════════
let PROV_CACHE = null;
export function resetCaches() { PROV_CACHE = null; ENDING_CACHE = null; ITEM_IDX = null; ACT_CACHE = null; PLAN_CACHE.clear(); COND_CACHE.clear(); ARR_CACHE = new WeakMap(); PATH_CACHE = new WeakMap(); }
function providerIndex() {
  const sig = EVENTS.length + ':' + Object.keys(ANNUAL).length + ':' + ITEMS.length;
  if (PROV_CACHE && PROV_CACHE.sig === sig && PROV_CACHE.src === EVENTS) return PROV_CACHE;
  const prov = {}, parents = {};
  const add = (flag, p) => (prov[flag] ??= []).push(p);
  for (const ev of EVENTS) (ev.choices || []).forEach((c, idx) => {
    const outs = c.check ? [['success', c.success], ['fail', c.fail]] : [['direct', c]];
    for (const [branch, o] of outs) {
      if (!o) continue;
      if (o.next) (parents[o.next] ??= []).push({ ev, idx, choice: c, branch });
      for (const [k, v] of Object.entries(o.effects || {})) if (k.startsWith('flag.') && v) add(k.slice(5), { kind: 'event', ev, idx, choice: c, branch });
    }
  });
  for (const [age, a] of Object.entries(ANNUAL)) (a.options || []).forEach((o, idx) => {
    for (const [k, v] of Object.entries(o.effects || {})) if (k.startsWith('flag.') && v) add(k.slice(5), { kind: 'annual', age: Number(age), idx, opt: o });
  });
  for (const it of ITEMS) for (const [k, v] of Object.entries({ ...(it.onBuy || {}), ...(it.monthly || {}) })) if (k.startsWith('flag.') && v) add(k.slice(5), { kind: 'item', item: it });
  // 엔진이 직접 세우는 플래그
  add('secret_adventure', { kind: 'engine', act: 'autonomy', minAge: ACTIVITY_MAP.adventure?.minAge ?? 0 });
  add('secret_night_work', { kind: 'engine', act: 'autonomy', minAge: ACTIVITY_MAP.graveyard?.minAge ?? 0 });
  PROV_CACHE = { sig, src: EVENTS, prov, parents };
  return PROV_CACHE;
}
export function eventParents(id) { return providerIndex().parents[id] || []; }
export function flagProviders(flag) { return providerIndex().prov[flag] || []; }

// 이벤트 공급 경로: chainOnly면 부모를 거슬러 올라간 단계 목록들 (깊이 4)
function stepPaths(step, depth = 0) {
  const ev = step.ev;
  if (!ev.chainOnly) return [[step]];
  if (depth >= 4) return [];
  const out = [];
  for (const par of eventParents(ev.id)) for (const path of stepPaths({ kind: 'event', ...par }, depth + 1)) out.push([...path, step]);
  return out;
}
// 이벤트 공급자의 경로를 미리 컴파일해 둔다 (데이터에서 한 번만: 경로별 뿌리 이벤트 창 + 단계별 조건·요구 활동·판정)
let PATH_CACHE = new WeakMap();
function providerPaths(p) {
  let paths = PATH_CACHE.get(p);
  if (paths) return paths;
  paths = stepPaths(p).map(path => {
    const root = path[0].ev;
    return {
      root, lo: root.age ? root.age[0] : null, hi: root.age ? root.age[1] : 99, month: root.month || 0,
      steps: path.map(st => ({
        conds: [...compileAll(st.ev.conditions), ...compileAll(st.choice.conditions)],
        acts: st.ev.requiresActivity ? [].concat(st.ev.requiresActivity) : null,
        check: st.branch === 'success' && st.choice.check ? st.choice.check : null,
        minigame: !!st.choice.minigame, fail: st.branch === 'fail',
      })),
    };
  });
  PATH_CACHE.set(p, paths);
  return paths;
}

// ══════════════════════════════════════════════════════════════════════
// seek:<endingId> — 목표 엔딩 추구 정책
// ══════════════════════════════════════════════════════════════════════
const W = {
  gate: 10,            // 게이트 조건 1척도 부족당
  bonusPer100: 2,      // 보너스 +100점당 조건 가중
  subDecay: 0.6,       // 역추적 하위 목표 가중 감쇠
  marginNeg: 5,        // 경쟁 엔딩에 100점 뒤질 때
  marginPos: 1, marginCap: 2, marginTail: 0.3,   // 앞설 때: 100점당 +1, 200점부터는 로그 꼬리
  hidden: 15,          // 원치 않는 히든 엔딩 게이트 근접 벌점
  trust: 1.5, gold: 0.4, goldLow: 1.2,
};
const PLAN_CACHE = new Map();
function seekPlan(targetId) {
  const key = targetId + ':' + ENDINGS.length;
  let P = PLAN_CACHE.get(key);
  if (P) return P;
  const list = endingsCompiled();
  const T = list.find(x => x.id === targetId);
  if (!T) throw new Error('없는 엔딩: ' + targetId);
  const needs = [];
  for (const c of T.gates) needs.push({ c, w: W.gate, src: 'gate' });
  for (const b of T.bonus) for (const c of b.when) needs.push({ c, w: clamp(b.add / 100 * W.bonusPer100, 0.3, 4) / Math.max(1, b.when.length), src: 'bonus' });
  const others = list.filter(x => x.id !== T.id && !x.hidden);
  const hiddenRivals = list.filter(x => x.hidden && x.id !== T.id && (!T.hidden || x.order < T.order));
  const wantsLowTrust = needs.some(n => n.c.path === 'trust' && (n.c.effOp === '<=' || n.c.effOp === '<'));
  const needsCollapse = T.gates.some(c => c.path === 'count.collapses' && (c.effOp === '>=' || c.effOp === '>'));
  // 게이트(와 게이트 플래그의 공급 경로)가 허락하는 보호자 출신 — 출신 전용 선택지로만 세워지는 플래그를 위해
  const guardianOk = Object.keys(GUARDIANS).filter(g => guardianFeasible(T.gates, g));
  const rivalFlags = [...new Set([...others, ...hiddenRivals].flatMap(E => E.gates.filter(c => c.kind === 'flag' && !c.neg && !c.op).map(c => c.key)))];
  P = { T, needs, others, hiddenRivals, wantsLowTrust, needsCollapse, guardianOk, rivalFlags, meta: metaNeeds(T.gates) };
  PLAN_CACHE.set(key, P);
  return P;
}

// 상태 가치 U: 목표 게이트·보너스 충족도 + 하위 목표 + 경쟁 엔딩 대비 점수 여유 + 유지 비용
function utility(L, P, ctx, full) {
  let u = 0;
  const drift = ctx.drift;
  for (const n of P.needs) { const off = drift[n.c.path] || 0; u -= n.w * (n.src === 'gate' ? gatePenalty(n.c, L, off) : deficit(n.c, L, off)); }
  for (const n of ctx.sub) u -= n.w * deficit(n.c, L);
  // 문턱 이벤트: 이 조건 하나만 넘으면 열리는 이벤트의 기대 가치(손해면 음수) — 넘는 순간 반영, 직전엔 절반을 미리
  for (const h of ctx.hazards) {
    if (h.c.test(L)) u += h.v;
    else { const d = deficit(h.c, L); if (d < 0.05) u += h.v * 0.5 * (1 - d / 0.05); }
  }
  const fl = ctx.fl;
  if (!P.T.hidden) {
    const mine = endingScoreRaw(P.T, L);
    let threat = 0;
    for (const E of (full ? P.others : ctx.rivals)) { const cl = closeness(E, L, fl); if (cl > 0) { const v = cl * endingScoreRaw(E, L); if (v > threat) threat = v; } }
    const m = (mine - threat) / 100;
    // 앞선 만큼 가치: marginCap까지 선형, 그 뒤로는 로그로 완만히. 예전엔 여기서 평평했다 → 게이트를 일찍 채운 엔딩이
    // 몇 년 동안 목표 없이 돌다가(가게 일·쇼핑) 막판에 경쟁 엔딩에 역전당했다. 시드 7·60판 실측: 순례자 27%→68%,
    // 떠도는 사람 30%→78%, 가족 53%→88%, 외교관 63%→92% (12종 합계 472→563, 나머지는 오차 안).
    const x = m * W.marginPos;
    u += m < 0 ? m * W.marginNeg : x < W.marginCap ? x : W.marginCap + W.marginTail * W.marginCap * Math.log1p((x - W.marginCap) / W.marginCap);
  }
  for (const H of (full ? P.hiddenRivals : ctx.hiddenRivals)) { const cl = closeness(H, L, fl); if (cl > 0) u -= W.hidden * cl * cl; }
  // 유지 비용
  if (P.needsCollapse && (L.counters.collapses || 0) < ctx.collapseTarget) u += L.stress / 100 * 3;
  else if (L.stress > 50) u -= ((L.stress - 50) / 25) ** 2 * 1.5;
  if (!P.wantsLowTrust) u += L.trust / 100 * W.trust;
  if (L.gold < 0) u -= W.goldLow * 2 + (-L.gold / 100) * W.goldLow;
  else if (L.gold < 150) u -= (150 - L.gold) / 150 * W.goldLow;
  u += Math.min(L.gold, 2000) / 2000 * W.gold;
  return u;
}

// 목표의 게이트(와 게이트 플래그를 세우는 공급자들)가 회차 정보를 요구하면 그에 맞는 newGame 옵션을 만든다.
// legacyCount·playthrough는 한 판 안에서 바꿀 수 없으므로 '그 회차로 시작한다'가 유일한 방법이다.
// 플래그는 공급자 중 회차 요구가 가장 낮은 쪽으로 본다 (한 공급자만 3회차를 요구해도 다른 길이 있으면 1회차로 충분).
// 보너스 조건은 보지 않는다 — 보너스 하나 때문에 다른 회차로 시작하면 '그 엔딩에 닿을 수 있는가'가 부풀려진다.
const META_ZERO = Object.freeze({ playthrough: 1, legacyCount: 0 });
function metaNeeds(conds) {
  const memo = new Map(), onStack = new Set();
  const merge = (a, b) => (b === META_ZERO ? a : { playthrough: Math.max(a.playthrough, b.playthrough), legacyCount: Math.max(a.legacyCount, b.legacyCount) });
  const rank = (n) => Math.max(n.playthrough, n.legacyCount + 1) * 10 + n.legacyCount;
  const ofConds = (cs, depth) => { let n = META_ZERO; for (const c of cs) n = merge(n, ofCond(c, depth)); return n; };
  const ofCond = (c, depth) => {
    if (c.opaque) return META_ZERO;
    if ((c.path === 'playthrough' || c.path === 'legacyCount') && isNumericCmp(c)) {
      const v = c.effOp === '>' ? c.value + 1 : (c.effOp === '>=' || c.effOp === '==') ? c.value : null;
      return v == null ? META_ZERO : { ...META_ZERO, [c.path]: v };
    }
    if (c.kind !== 'flag' || c.neg || c.op || depth >= 4) return META_ZERO;
    if (memo.has(c.key)) return memo.get(c.key);
    if (onStack.has(c.key)) return META_ZERO;          // 플래그 순환
    onStack.add(c.key);
    let best = null;
    for (const p of providerIndex().prov[c.key] || []) {
      const opts = p.kind === 'event' ? providerPaths(p).map(path => ofConds(path.steps.flatMap(st => st.conds), depth + 1))
        : p.kind === 'annual' ? [ofConds(compileAll(p.opt.conditions), depth + 1)]
        : p.kind === 'item' ? [ofConds(compileAll(p.item.conditions), depth + 1)] : [META_ZERO];
      for (const n of opts) if (!best || rank(n) < rank(best)) best = n;
    }
    onStack.delete(c.key);
    const r = best || META_ZERO;
    memo.set(c.key, r);
    return r;
  };
  const need = { ...ofConds(conds, 0) };
  need.legacyCount = Math.min(5, need.legacyCount);
  if (need.legacyCount > 0) need.playthrough = Math.max(need.playthrough, need.legacyCount + 1);
  return need.playthrough > 1 || need.legacyCount > 0 ? need : null;
}
// 이 보호자 출신으로 조건들을 채울 길이 있는가 — 출신 조건(guardian == / !=)만 보고 나머지는 달성 가능하다고 본다.
// 플래그는 공급자 중 하나라도 길이 있으면 된다. 순환·깊이 초과·공급자 없는 플래그는 낙관적으로 true (출신 탓이 아님).
function guardianFeasible(conds, g) {
  const memo = new Map(), onStack = new Set();
  const okConds = (cs, depth) => cs.every(c => okCond(c, depth));
  const okCond = (c, depth) => {
    if (c.opaque) return true;
    if (c.path === 'guardian' && (c.effOp === '==' || c.effOp === '!=')) return OPS[c.effOp](g, c.value);
    if (c.kind !== 'flag' || c.neg || c.op || depth >= 4) return true;
    if (memo.has(c.key)) return memo.get(c.key);
    if (onStack.has(c.key)) return true;
    const provs = providerIndex().prov[c.key] || [];
    onStack.add(c.key);
    const ok = !provs.length || provs.some(p => p.kind === 'event' ? providerPaths(p).some(path => okConds(path.steps.flatMap(st => st.conds), depth + 1))
      : p.kind === 'annual' ? okConds(compileAll(p.opt.conditions), depth + 1)
      : p.kind === 'item' ? okConds(compileAll(p.item.conditions), depth + 1) : true);
    onStack.delete(c.key);
    memo.set(c.key, ok);
    return ok;
  };
  return okConds(conds, 0);
}
const LEGACY_NAMES = ['아리', '미르', '소라', '하늘', '다온'];
// 이전 회차 딸 목록 (meta.legacyOf와 같은 모양). 엔딩 데이터에서 결정적으로 고른다.
export function makeLegacy(n, seed = 1) {
  const pool = ENDINGS.filter(e => !e.hidden);
  return Array.from({ length: Math.min(5, n) }, (_, i) => { const e = pool[(seed * 7 + i * 3) % pool.length]; return { name: LEGACY_NAMES[i], endingId: e.id, endingName: e.name, cat: e.cat }; });
}

// 이번 달 하위 목표: 미충족 플래그·아이템 요구를 공급자 역추적으로 풀어 낸다
// memo: 이달 계획 동안 같은 플래그의 최선 공급자를 다시 계산하지 않도록 (상태는 계획 중에 바뀌지 않는다)
function regress(P, s, mg, memo) {
  const sub = [], actBonus = {};
  const seenFlag = new Set();
  const visit = (c, w, depth) => {
    if (depth > 3 || w < 0.3 || c.opaque) return;
    if (c.root === 'item' && !c.test(s)) {
      const it = ITEM_BY_ID()[c.key];
      if (it) sub.push({ c: compileCondition(`gold >= ${it.price + 50}`), w: w * 0.5 });
      return;
    }
    if (c.kind !== 'flag' || c.neg || c.op || c.test(s)) return;
    if (seenFlag.has(c.key)) return;
    seenFlag.add(c.key);
    const best = bestProvider(c.key, s, mg, memo);
    if (!best) return;
    const w2 = w * W.subDecay;
    for (const cc of best.conds) {
      if (!cc.controllable) continue;
      sub.push({ c: cc, w: w2 });                  // 중간 플래그 자체도 가치가 있어야 이벤트 선택에서 고른다
      if (cc.kind === 'flag' && !cc.neg && !cc.op) visit(cc, w2, depth + 1);
    }
    // 판정 능력치는 이벤트 창이 열리기 전에 갖춰야 한다 (이벤트는 조건이 맞는 즉시 뽑힐 수 있음)
    const urgent = best.lo == null || s.age >= best.lo - 1;
    for (const cc of best.checks) sub.push({ c: cc, w: w2 * 1.5 * (urgent ? 2 : 1) });
    for (const a of best.acts) actBonus[a] = (actBonus[a] || 0) + w2 * (best.condsMet ? 0.35 : 0.08);
  };
  for (const n of P.needs) visit(n.c, n.w, 0);
  return { sub, actBonus };
}
function bestProvider(flag, s, mg, memo) {
  if (memo && memo.has(flag)) return memo.get(flag);
  let best = null;
  for (const p of providerIndex().prov[flag] || []) {
    const cand = providerCost(p, s, mg);
    if (cand && (!best || cand.cost < best.cost)) best = cand;
  }
  memo?.set(flag, best);
  return best;
}
// 플래그가 앞으로 세워질 가능성 (경쟁 엔딩 위협 추정용)
function flagLikelihood(flag, s, mg, memo) {
  const b = bestProvider(flag, s, mg, memo);
  if (!b) return 0;
  if (b.engine) return 0.3;
  return b.condsMet ? 0.8 : 0.6 * Math.exp(-b.cost);
}
// 판정 성공 경로의 목표 능력치: 주사위면 dc+40 (성공률 ≈ 83%), 미니게임이면 고정 swing + 여유 5.
// check.bonus(s)(예: 다른 능력치 × 0.2)는 지금 값만큼 빼 준다 — 보정이 큰 판정에 능력치를 과하게 쌓지 않게.
export function checkNeed(check, minigame, s, mg) {
  const mgOn = minigame && typeof mg === 'number';
  const bonus = check.bonus ? Number(check.bonus(s)) || 0 : 0;
  return Math.ceil((mgOn ? check.dc - Math.round((clamp(mg, 0, 1) - 0.5) * 120) + 5 : check.dc + 40) - bonus);
}
// 공급자 한 개의 비용과 요구 조건 (불가능하면 null)
function providerCost(p, s, mg) {
  if (p.kind === 'engine') return { cost: 0.8, conds: [], checks: [], acts: s.age >= (p.minAge || 0) - 1 ? [p.act] : [], condsMet: s.age >= (p.minAge || 0), lo: p.minAge || 0, engine: true };
  if (p.kind === 'annual') {
    if (s.age >= p.age) return null;
    const conds = compileAll(p.opt.conditions);
    return { cost: 0.3 + conds.reduce((a, c) => a + deficit(c, s), 0), conds, checks: [], acts: [], condsMet: true, lo: p.age };
  }
  if (p.kind === 'item') {
    if (p.item.unique && (s.items?.[p.item.id] || 0) > 0) return null;
    const conds = [...compileAll(p.item.conditions), compileCondition(`gold >= ${p.item.price}`)];
    return { cost: 0.2 + conds.reduce((a, c) => a + deficit(c, s), 0), conds, checks: [], acts: [], condsMet: true, lo: p.item.minAge || 0 };
  }
  // 1차: 경로별 비용만 계산 → 2차: 최선 경로에 대해서만 하위 목표 목록을 만든다
  let best = null, bestCost = Infinity, bestMet = true;
  for (const path of providerPaths(p)) {
    const root = path.root;
    if (s.age > path.hi) continue;
    if (s.age === path.hi && path.month && s.month > path.month) continue;
    if (s.seen?.[root.id] && !root.repeatable) continue;
    let cost = 0, condsMet = true;
    for (const st of path.steps) {
      for (const c of st.conds) { const d = deficit(c, s); if (d > 0) { condsMet = false; cost += c.controllable ? (c.kind === 'flag' && (c.neg || c.effOp === '!=') ? 3 : d) : 5; } }
      if (st.acts) cost += 0.3;
      if (st.check) {
        const need = checkNeed(st.check, st.minigame, s, mg), val = s.stats[st.check.stat] ?? 0;
        if (val < need) cost += (need - val) / 100;
      } else if (st.fail) cost += 1;
      if (cost >= bestCost) break;                        // 이미 더 싼 경로가 있다 (비용은 단계마다 늘기만 한다)
    }
    if (cost < bestCost) { best = path; bestCost = cost; bestMet = condsMet; }
  }
  if (!best) return null;
  const conds = [], checks = [], acts = [];
  for (const st of best.steps) {
    conds.push(...st.conds);
    if (st.acts) acts.push(...st.acts);
    if (st.check) checks.push(compileCondition(`stat.${st.check.stat} >= ${checkNeed(st.check, st.minigame, s, mg)}`));
  }
  if (best.lo != null && s.age < best.lo - 1) acts.length = 0;   // 아직 창 밖이면 활동 보너스는 보류
  return { cost: bestCost, conds, checks, acts, condsMet: bestMet, lo: best.lo };
}

// 남은 고정 이벤트(매년 그 달에 반드시 뜨는 이벤트)가 피할 수 없이 더할 값: 경로별 Σ(조건 없는 선택지 중 최소 효과)
function fixedDrift(s) {
  const drift = {};
  for (const ev of EVENTS) {
    if (!ev.fixed || !ev.month || ev.chainOnly) continue;
    const free = (ev.choices || []).filter(c => !c.conditions || !c.conditions.length);
    if (!free.length || !testAll(s, compileAll(ev.conditions))) continue;
    let times = 0;
    for (let age = s.age; age <= 17; age++) {
      if (ev.age && (age < ev.age[0] || age > ev.age[1])) continue;
      if (age === s.age && ev.month < s.month) continue;
      times++;
      if (!ev.repeatable) break;
    }
    if (!times || (!ev.repeatable && s.seen?.[ev.id])) continue;
    const keys = new Set();
    const outs = (c) => c.check ? [c.success?.effects || {}, c.fail?.effects || {}] : [c.effects || {}];
    for (const c of free) for (const e of outs(c)) for (const [k, v] of Object.entries(e)) if (typeof v === 'number') keys.add(k);
    for (const k of keys) {
      const path = k === 'gHealth' ? 'gHealth' : k;
      const m = Math.min(...free.flatMap(c => outs(c).map(e => typeof e[k] === 'number' ? e[k] : 0)));
      if (m) drift[path] = (drift[path] || 0) + m * times;
    }
  }
  return drift;
}
// 조건 하나(조절 가능한 수치)만 모자란 이벤트, 또는 요구 활동만 남은 이벤트의 기대 가치 → 문턱 벌점/보상, 활동 보너스
function thresholdEvents(s, L, U, evBest, actBonus) {
  const out = [];
  const u0 = U(L);
  const cand = [];
  let poolW = 0;
  for (const ev of EVENTS) {
    if (ev.chainOnly || (s.seen?.[ev.id] && !ev.repeatable)) continue;
    if (ev.age && (s.age < ev.age[0] - 1 || s.age > ev.age[1])) continue;   // 내년에 창이 열리는 이벤트도 미리 본다
    const conds = compileAll(ev.conditions);
    const failing = [];
    for (const c of conds) if (!c.test(s)) { failing.push(c); if (failing.length > 1) break; }
    const timeOk = (!ev.month || ev.month === s.month) && (!ev.season || ev.season === s.season) && (!ev.age || s.age >= ev.age[0]);
    if (!failing.length && timeOk && !ev.fixed && !ev.requiresActivity) poolW += ev.weight ?? 1;
    if (ev.repeatable && !ev.fixed) continue;          // 반복 일상 이벤트는 문턱 판단에서 제외 (자주 오가므로)
    cand.push({ ev, failing });
  }
  for (const { ev, failing } of cand) {
    const w = ev.weight ?? 1;
    const hi = ev.age ? ev.age[1] : 17;
    const monthsLeft = Math.max(1, (hi - s.age) * 12 + (12 - s.month) + 1);
    const pMonth = ev.fixed ? 1 : Math.min(1, 1.25 * w / (w + poolW));
    const pTotal = ev.fixed ? 1 : 1 - Math.pow(1 - pMonth, ev.month || ev.season ? Math.ceil(monthsLeft / 12) : monthsLeft);
    if (failing.length === 1) {
      const c = failing[0];
      if (!isNumericCmp(c) || !c.controllable || deficit(c, s) > 0.35) continue;   // 한두 달 안에 넘을 수 있는 문턱만
      const v = (evBest(L, ev) - u0) * pTotal;
      if (Math.abs(v) > 0.3) out.push({ c, v, id: ev.id });
    } else if (!failing.length && ev.requiresActivity && (!ev.month || ev.month === s.month) && (!ev.age || s.age >= ev.age[0])) {
      const v = (evBest(L, ev) - u0) * pMonth;
      if (Math.abs(v) > 0.1) for (const a of [].concat(ev.requiresActivity)) actBonus[a] = (actBonus[a] || 0) + v;
    }
  }
  return out;
}

// 판정 성공 확률 (engine.chooseEvent: 값 + 주사위[-60,60] ≥ dc, 미니게임이면 고정 swing)
export function checkProb(s, check, minigame, mg) {
  const val = (s.stats[check.stat] ?? 0) + (check.bonus ? check.bonus(s) : 0);
  if (minigame && typeof mg === 'number') return val + Math.round((clamp(mg, 0, 1) - 0.5) * 120) >= check.dc ? 1 : 0;
  const need = Math.ceil(check.dc - val);
  return clamp((60 - need + 1) / 121, 0, 1);
}

function makeSeekPolicy(targetId, opts) {
  const P = seekPlan(targetId);
  const mg = opts.mgScore === undefined ? DEFAULT_SEEK_MG : opts.mgScore;
  const collapseGate = P.T.gates.find(c => c.path === 'count.collapses');
  let ctx = { sub: [], actBonus: {}, fl: {}, drift: {}, hazards: [], rivals: P.others, hiddenRivals: P.hiddenRivals, collapseTarget: collapseGate ? Number(collapseGate.value) + (collapseGate.effOp === '>' ? 1 : 0) : 0 };
  const U = (L) => utility(L, P, ctx, true);        // 이벤트·연간·상점: 플래그가 바뀔 수 있으니 전체 경쟁 엔딩
  const Uslot = (L) => utility(L, P, ctx, false);   // 스케줄: 이달 초 기준으로 추린 경쟁 엔딩

  // Uf: 평가 함수 (실제 선택은 전체 경쟁 엔딩 U, 문턱 이벤트 예측은 이달 추린 경쟁 엔딩 Uslot)
  const outcomeValue = (L, o, depth, Uf) => {
    const L2 = lite(L);
    applyEffects(L2, o.effects || {});
    if (o.next && depth < 4) {
      const nev = EVENT_MAP[o.next];
      if (nev) {
        let best = -Infinity;
        for (const c of nev.choices) if (testAll(L2, compileAll(c.conditions))) best = Math.max(best, choiceValue(L2, c, depth + 1, Uf));
        if (best > -Infinity) return best;
      }
    }
    return Uf(L2);
  };
  const choiceValue = (L, c, depth, Uf = U) => {
    if (c.check) {
      const p = checkProb(L, c.check, c.minigame, mg);
      return (p > 0 ? p * outcomeValue(L, c.success || {}, depth, Uf) : 0) + (p < 1 ? (1 - p) * outcomeValue(L, c.fail || {}, depth, Uf) : 0);
    }
    return outcomeValue(L, c, depth, Uf);
  };

  // 이벤트가 지금 뜬다면 고를 최선 선택의 기대 가치 (예측용: 추린 경쟁 엔딩, 연쇄 2단까지)
  const evBest = (L, ev) => {
    let best = -Infinity;
    for (const c of ev.choices || []) if (testAll(L, compileAll(c.conditions))) best = Math.max(best, choiceValue(L, c, 2, Uslot));
    return best;
  };

  return {
    name: SEEK_PREFIX + targetId,
    newGame(seed) { return P.meta ? { playthrough: P.meta.playthrough, legacy: makeLegacy(Math.max(P.meta.legacyCount, P.meta.playthrough - 1), seed) } : {}; },
    // 보호자: 허용 목록(기본: 해금 없이 고를 수 있는 기사·학자) 중 목표에 맞는 쪽. 허용 목록으로는 게이트를 채울 길이
    // 아예 없으면(출신 조건) 그 길이 있는 출신을 고른다 — '해금하면 닿는 엔딩'을 '도달 불가'로 잘못 보고하지 않게.
    guardian(r, seed) {
      const base = (opts.guardians || ['knight', 'scholar']).filter(g => GUARDIANS[g]);
      let allowed = base.filter(g => P.guardianOk.includes(g));
      if (!allowed.length) allowed = P.guardianOk.length ? P.guardianOk : base;
      const fit = (gid) => {
        const g = GUARDIANS[gid]; let f = 0;
        for (const [st, w] of P.T.weights) if (STAT_CAT[st] === g.bonusCat) f += w;
        for (const c of P.T.gates) if (c.root === 'stat' && STAT_CAT[c.key] === g.bonusCat) f += 0.5;
        if (g.adventureBonus && P.T.gates.some(c => c.path === 'count.adventures')) f += 0.5;
        if (g.persuade && P.wantsLowTrust === false) f += 0.1;
        return f;
      };
      const ranked = allowed.map(g => [g, fit(g)]).sort((a, b) => b[1] - a[1]);
      if (ranked.length > 1 && Math.abs(ranked[0][1] - ranked[1][1]) < 0.15) return ranked[seed % 2][0];
      return ranked[0][0];
    },
    beforeMonth(s) {
      const memo = new Map();
      const g = regress(P, s, mg, memo);
      const fl = {};
      for (const f of P.rivalFlags) if (!s.flags[f]) fl[f] = flagLikelihood(f, s, mg, memo);
      ctx = { ...ctx, sub: g.sub, actBonus: g.actBonus, fl };
      // 이달 스케줄 계획용 경쟁 엔딩 추리기 (한 달 안에 크게 변하지 않음)
      const L = lite(s);
      const scored = P.others.map(E => { const cl = closeness(E, L, fl); return [E, cl > 0 ? cl * endingScoreRaw(E, L) : 0]; }).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
      const top = scored.length ? scored[0][1] : 0;
      ctx.rivals = scored.filter((x, i) => i < 4 || x[1] >= top * 0.4).map(x => x[0]);
      ctx.hiddenRivals = P.hiddenRivals.filter(H => closeness(H, L, fl) > 0.001 || H.gates.some(c => c.kind === 'flag' && !c.test(L) && (fl[c.key] ?? 0) > 0.2));
      ctx.drift = fixedDrift(s);
      ctx.hazards = [];
      ctx.hazards = thresholdEvents(s, L, Uslot, evBest, ctx.actBonus);
    },
    shop(s) {
      if (opts.shop === false) return;
      for (let k = 0; k < 2; k++) {
        const L = lite(s); const base = U(L);
        const remain = Math.max(0, (18 - s.age) * 12 - (s.month - 1));
        let best = null, bestV = 0.05;
        for (const it of shopList(s)) {
          if (!it.affordable || it.soldOut) continue;
          const L2 = lite(s);
          L2.gold -= it.price; L2.items[it.id] = (L2.items[it.id] || 0) + 1;
          if (it.onBuy) applyEffects(L2, it.onBuy);
          if (it.monthly) applyEffects(L2, it.monthly, Math.min(remain, 24) * 0.5);
          const v = U(L2) - base;
          if (v > bestV) { bestV = v; best = it; }
        }
        if (!best) break;
        buyItem(s, best.id);
      }
    },
    slots(s, r) {
      const g = GUARDIANS[s.guardian];
      const collapsed = !!s.flags._collapsed;
      const effMult = collapsed ? 1 : (s.stress >= 80 ? 0.6 : 1);
      const ids = [...availableActivities(s.age)];
      const plan = [];
      let L = lite(s), work = 0;
      if (collapsed) { plan.push('rest'); applyActivityLite(L, 'rest', g, effMult); }
      while (plan.length < 3) {
        let best = null, bestV = -Infinity;
        for (const id of ids) {
          const L2 = lite(L);
          applyActivityLite(L2, id, g, effMult);
          projectMonthEnd(L2, g, work + (isWork(id) ? 1 : 0));
          let v = Uslot(L2) + r.next() * 1e-6;
          if (!plan.includes(id)) v += ctx.actBonus[id] || 0;
          if (v > bestV) { bestV = v; best = id; }
        }
        plan.push(best); applyActivityLite(L, best, g, effMult); if (isWork(best)) work++;
      }
      return plan;
    },
    refusal(s, p, r) {
      const g = GUARDIANS[s.guardian];
      const effMult = s.stress >= 80 ? 0.6 : 1;
      const after = (mods, actId) => {
        const L = lite(s);
        if (mods.trust) L.trust = clamp(L.trust + mods.trust, 0, 100);
        if (mods.stress) L.stress = clamp(L.stress + mods.stress, 0, 100);
        if (mods.agree) L.personality.agree = clamp(L.personality.agree + mods.agree, -100, 100);
        if (mods.forced) L.counters.forced = (L.counters.forced || 0) + 1;
        L.counters.refusals = (L.counters.refusals || 0) + 1;
        applyActivityLite(L, actId, g, effMult);
        return Uslot(L);
      };
      const power = s.stats.elo * 0.5 + s.trust * 2 + (g.persuade ?? 0) + 1;
      const dc = 150 + Math.max(0, -s.personality.agree) * 1.5 + s.stress;
      const pp = power >= dc ? 1 - dc / (2 * power) : power / (2 * dc);
      const vals = {
        accept: after({ trust: 4, stress: -3, agree: 1 }, p.alternative),
        persuade: pp * after({ trust: 2, agree: 2 }, p.activityId) + (1 - pp) * after({ trust: -2, stress: 4 }, p.alternative),
        force: after({ trust: -8, stress: 12, agree: -3, forced: 1 }, p.activityId),
      };
      return Object.entries(vals).sort((a, b) => b[1] - a[1])[0][0];
    },
    event(s, ev, r) {
      const raw = EVENT_MAP[ev.id];
      const L = lite(s);
      let best = ev.choices[0], bestV = -Infinity;
      for (const c of ev.choices) {
        const v = choiceValue(L, raw.choices[c.index], 0) + r.next() * 1e-6;
        if (v > bestV) { bestV = v; best = c; }
      }
      const rc = raw.choices[best.index];
      return { index: best.index, mgScore: rc.minigame && rc.check && typeof mg === 'number' ? mg : undefined };
    },
    annual(s, a, r) {
      const raw = ANNUAL[a.age];
      let best = a.options[0].index, bestV = -Infinity;
      for (const o of a.options) {
        const L = lite(s); applyEffects(L, raw.options[o.index].effects || {});
        const v = U(L) + r.next() * 1e-6;
        if (v > bestV) { bestV = v; best = o.index; }
      }
      return best;
    },
  };
}

// ══════════════════════════════════════════════════════════════════════
// 일반 정책 10종 (v0.1 simulate.mjs와 동일한 스케줄·거부·이벤트 규칙 + 연간 결정·상점)
// ══════════════════════════════════════════════════════════════════════
function generalScore(policy, effects) {
  const e = effects || {};
  const stat = (ids) => ids.reduce((a, id) => a + (e['stat.' + id] || 0), 0);
  switch (policy) {
    case 'shadow': return (e.infamy || 0) * 2 - (e['pers.good'] || 0) + (e.gold || 0) / 50;
    case 'nurture': return (e.trust || 0) + (e['pers.agree'] || 0);
    case 'focus_body': return stat(['hp', 'str', 'agi']);
    case 'focus_mind': return stat(['int', 'cult', 'mag']);
    case 'focus_social': return stat(['chm', 'eti', 'elo']);
    case 'focus_inner': return stat(['sens', 'faith', 'moral']);
    case 'tyrant': return stat(['eti', 'mag', 'int', 'str', 'elo']) - (e.trust || 0) * 0;
    case 'hands_off': return (e.trust || 0) - (e.stress || 0) / 4;
    case 'balanced': return Object.keys(e).filter(k => k.startsWith('stat.')).reduce((a, k) => a + e[k], 0) - Math.max(0, e.stress || 0) / 3;
    default: return 0;
  }
}
function itemStatGain(it, ids) { const eff = { ...(it.onBuy || {}) }; for (const [k, v] of Object.entries(it.monthly || {})) eff[k] = (eff[k] || 0) + v * 12; return ids.reduce((a, id) => a + (eff['stat.' + id] || 0), 0); }
const POLICY_STATS = { focus_body: ['hp', 'str', 'agi'], focus_mind: ['int', 'cult', 'mag'], focus_social: ['chm', 'eti', 'elo'], focus_inner: ['sens', 'faith', 'moral'],
  tyrant: ['eti', 'mag', 'int', 'str', 'elo'], shadow: ['agi', 'elo', 'str'], nurture: ['sens', 'hp', 'moral'], balanced: STATS.map(x => x.id), hands_off: STATS.map(x => x.id), random: STATS.map(x => x.id) };

function makeGeneralPolicy(policy, opts) {
  if (!GENERAL_POLICIES.includes(policy)) throw new Error('알 수 없는 정책: ' + policy);
  return {
    name: policy,
    guardian(r) { return r.chance(0.5) ? 'knight' : 'scholar'; },
    beforeMonth() {},
    shop(s, r, r2) {
      if (opts.shop === false) return;
      const list = shopList(s).filter(it => it.affordable && !it.soldOut);
      if (!list.length) return;
      if (policy !== 'tyrant' && s.stress >= 75 && r2.chance(0.4)) {
        const relief = list.filter(it => (it.onBuy?.stress || 0) < 0 && it.price <= s.gold - 150).sort((a, b) => a.onBuy.stress - b.onBuy.stress)[0];
        if (relief) { buyItem(s, relief.id); return; }
      }
      if (s.gold < 450 || !r2.chance(0.12)) return;
      const cands = list.filter(it => it.price <= s.gold - 300 && it.kind !== 'consumable');
      if (!cands.length) return;
      const ids = POLICY_STATS[policy];
      const scored = cands.map(it => [it, itemStatGain(it, ids)]).sort((a, b) => b[1] - a[1]);
      const pick = scored[0][1] > 0 && r2.chance(0.7) ? scored[0][0] : r2.pick(cands);
      buyItem(s, pick.id);
    },
    slots(s, r) {
      const ids = ACTIVITIES.filter(a => !a.minAge || s.age >= a.minAge).map(a => a.id);
      const slots = [];
      for (let i = 0; i < 3; i++) {
        if (s.stress >= 65 && r.chance(0.8) && policy !== 'tyrant') { slots.push('rest'); continue; }
        if (s.gold < 100 && r.chance(0.6)) { slots.push(r.pick(['farm', 'diner', 'inn', 'shop', 'smith'])); continue; }
        if (policy === 'random') slots.push(r.pick(ids));
        else if (policy.startsWith('focus_')) { const pool = CATS[policy.slice(6)].filter(id => ids.includes(id)); slots.push(r.chance(0.75) ? r.pick(pool) : r.pick(ids)); }
        else if (policy === 'balanced') slots.push(r.pick(['school', 'etiquette', 'sword', 'art', 'farm', 'diner', 'rest', 'outing']));
        else if (policy === 'hands_off') slots.push(i === 0 ? 'autonomy' : r.pick(ids));
        else if (policy === 'tyrant') slots.push(r.pick(['etiquette', 'magic', 'school', 'sword', 'commerce']));
        else if (policy === 'shadow') slots.push(r.pick(ids.filter(id => ['graveyard', 'inn', 'adventure', 'sword', 'commerce', 'shop'].includes(id))));
        else if (policy === 'nurture') slots.push(r.pick(['outing', 'rest', 'art', 'autonomy', 'school', 'farm', 'church']));
      }
      return slots;
    },
    refusal(s, p, r) {
      return policy === 'tyrant' ? 'force' : (policy === 'hands_off' || policy === 'nurture') ? 'accept' : r.pick(['accept', 'persuade', 'force']);
    },
    event(s, ev, r) {
      let pick = r.pick(ev.choices).index;
      if (policy === 'shadow' || policy === 'nurture') {
        const raw = EVENT_MAP[ev.id].choices;
        const best = ev.choices.map(c => ({ i: c.index, v: generalScore(policy, { ...(raw[c.index].effects || {}), ...(raw[c.index].success?.effects || {}) }) })).sort((a, b) => b.v - a.v)[0];
        if (best && r.chance(0.8)) pick = best.i;
      }
      return { index: pick };
    },
    annual(s, a, r, r2) {
      const raw = ANNUAL[a.age];
      if (policy === 'random' || !r2.chance(0.75)) return r2.pick(a.options).index;
      const best = a.options.map(o => ({ i: o.index, v: generalScore(policy, raw.options[o.index].effects) + r2.next() * 1e-3 })).sort((x, y) => y.v - x.v)[0];
      return best.i;
    },
  };
}

export function makePolicy(policy, opts = {}) {
  if (typeof policy === 'string' && policy.startsWith(SEEK_PREFIX)) return makeSeekPolicy(policy.slice(SEEK_PREFIX.length), opts);
  return makeGeneralPolicy(policy, opts);
}
export function listPolicies() { return [...GENERAL_POLICIES, ...ENDINGS.map(e => SEEK_PREFIX + e.id)]; }

// ══════════════════════════════════════════════════════════════════════
// 한 판 플레이
// ══════════════════════════════════════════════════════════════════════
export function playGame(policy, seed, opts = {}) {
  const P = makePolicy(policy, opts);
  const r = makeRng(seed * 7919 + 13);           // 정책 결정 난수 (v0.1과 같은 스트림)
  const r2 = makeRng(seed * 7919 + 17);          // 상점·연간 결정 전용 (기존 스트림을 흔들지 않게)
  const autoGuardian = P.guardian(r, seed);
  const s = newGame({ seed, guardian: opts.guardian ?? autoGuardian, ...(P.newGame ? P.newGame(seed) : {}), ...(opts.newGame || {}) });
  const hooks = opts.hooks || {};
  s._sim = { policy: P.name, overflow: 0, annual: 0, bought: 0, mg: 0 };
  while (!s.finished) {
    P.beforeMonth(s);
    const goldBefore = s.gold, itemsBefore = Object.values(s.items).reduce((a, b) => a + b, 0);
    P.shop?.(s, r, r2);
    if (s.gold !== goldBefore) s._sim.bought += Object.values(s.items).reduce((a, b) => a + b, 0) - itemsBefore;
    const slots = P.slots(s, r);
    for (const p of checkRefusals(s, slots)) slots[p.slot] = resolveRefusal(s, p, P.refusal(s, p, r, slots)).finalActivity;
    const rep = runMonth(s, slots);
    hooks.afterRun?.(s, rep);
    let guard = 0, n = 0;
    while (s.pendingEvents.length && guard++ < 20) {
      const ev = currentEvent(s);
      if (!ev || !ev.choices.length) { s.pendingEvents.shift(); continue; }
      const d = P.event(s, ev, r);
      const o = typeof d.mgScore === 'number' ? { mgScore: d.mgScore } : {};
      if (o.mgScore !== undefined) s._sim.mg++;
      const out = chooseEvent(s, ev.id, d.index, o);
      n++;
      hooks.event?.(s, ev, d.index, out);
    }
    if (s.pendingEvents.length) { s._sim.overflow++; s.pendingEvents = []; }   // 연쇄 순환 방지
    hooks.monthEnd?.(s, n, rep);
    const end = endMonth(s);
    if (end.annual && end.annual.options?.length) {
      P.beforeMonth(s);                              // 생일로 나이가 바뀌었으니 계획 맥락을 새로 잡고 결정
      const idx = P.annual(s, end.annual, r, r2);
      applyAnnual(s, idx);
      s._sim.annual++;
      hooks.annual?.(s, end.annual, idx);
    }
  }
  return s;
}

// seek 결과 진단: 성공 여부와 실패 원인 (미충족 게이트 / 히든 선점 / 점수 역전)
export function seekDiagnosis(targetId, s) {
  const list = endingsCompiled();
  const T = list.find(x => x.id === targetId);
  const got = s.ending?.id;
  if (got === targetId) return { success: true, got };
  const failed = T.gates.filter(c => !c.test(s)).map(c => c.label);
  if (failed.length) return { success: false, got, reason: 'gate', failed };
  const hid = list.find(x => x.hidden && testAll(s, x.gates));
  if (hid && hid.id !== targetId) return { success: false, got, reason: 'hidden', by: hid.id };
  return { success: false, got, reason: 'outscored', by: got };
}

// 엔진 eligibleEvents와 같은 판정 (컴파일 조건 사용 — 커버리지 집계용)
export function eventEligible(ev, s, slotIds, guardianCapped) {
  if (ev.chainOnly) return false;
  if (ev.guardian && guardianCapped) return false;
  if (s.seen[ev.id] && !ev.repeatable) return false;
  if (ev.age && (s.age < ev.age[0] || s.age > ev.age[1])) return false;
  if (ev.season && ev.season !== s.season) return false;
  if (ev.month && ev.month !== s.month) return false;
  if (ev.requiresActivity && !(Array.isArray(ev.requiresActivity) ? ev.requiresActivity.some(a => slotIds.includes(a)) : slotIds.includes(ev.requiresActivity))) return false;
  return testAll(s, compileAll(ev.conditions));
}
export function guardianCapped(s) { return s.counters.events >= 10 && (s.guardianEvents || 0) / s.counters.events >= GUARDIAN_EVENT_CAP; }
