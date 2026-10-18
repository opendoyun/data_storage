// 별의 공주 — 메타 진행 (GDD 4.9): 별 조각 · 보호자 출신 해금 · 시작 보너스 · 엔딩 앨범 · 후일담 편지(4.8) · 유산
//
// 규칙
// - 순수·결정적: 입력 meta를 절대 변경하지 않고 새 meta를 돌려준다. 시간은 호출자가 ISO 문자열로 넘긴다(Date 사용 금지).
// - DOM 의존 없음: 브라우저·Node 공용. 저장소는 getItem/setItem을 가진 객체(localStorage 등)를 주입한다.
// - 데이터(편지·엔딩)가 비어 있거나 나중에 채워져도 깨지지 않는다.
//
// 앱 연동 요약
//   const meta = loadMeta(localStorage);                                   // 타이틀
//   const extras = renderNewGameExtras(el, meta);                          // ui/album.js
//   const S = newGame({ name, seed, hair, eyes, ...newGameOptions(meta, extras.getSelection()) });
//   …엔딩 도달 시…
//   const r = recordRun(meta, S, new Date().toISOString()); saveMeta(localStorage, r.meta);
//   // r.shardsGained · r.newEndings · r.newUnlocks · r.letterUnlocks 를 엔딩 화면에 표시
import { GUARDIANS } from '../data/guardians.js';
import { ENDINGS } from '../data/endings.js';
import { LETTERS, CATEGORY_LETTERS } from '../data/letters.js';
import { STATS, STAT_CATS, PERSONALITY } from '../data/stats.js';
import { ITEM_MAP } from '../data/items.js';
import { fillName, josa } from './josa.js';

export const META_KEY = 'starborn_meta';
export const META_BACKUP_KEY = 'starborn_meta_backup';
export const META_VERSION = 2;
export const MAX_RUNS = 30;               // 보관하는 지난 회차 요약 수
export const MAX_LEGACY = 5;              // 다음 회차에 넘기는 유산(이전 딸) 수 — engine.newGame과 동일
export const MAX_ACTIVE_BONUSES = 3;      // 한 회차에 적용할 수 있는 시작 보너스 수
export const LETTERS_PER_ENDING = 3;      // 편지 데이터가 아직 없을 때의 기본 상한 (콘텐츠 계약 §9: 엔딩마다 3통)
// 후일담은 저빈도 콘텐츠(GDD 4.8): 한 회차가 끝날 때 여는 '이어지는 편지'(이전에 달성한 엔딩의 다음 편지) 수의 상한.
// 처음 본 엔딩의 첫 편지는 이 상한과 별개. 평소 플레이(매 회차 새 엔딩)에서도 회차당 최대 1 + 2 = 3통이고,
// 구버전 기록을 옮겨 온 직후처럼 밀린 편지가 많아도 한꺼번에 쏟아지지 않는다(오래된 엔딩부터 차례로).
export const MAX_FOLLOWUP_LETTERS_PER_RUN = 2;
// 별 조각: 완주 +1, 처음 본 엔딩 +2, 처음 본 히든 엔딩은 +2 대신 +3
export const SHARD_RULES = Object.freeze({ run: 1, newEnding: 2, newHidden: 3 });

// ──────────────────────────────────────────────────────────────────────
// 시작 보너스 (별 조각으로 영구 구매 → 새 게임마다 최대 3개 골라 적용)
// grant는 engine.newGame의 bonuses 형식 { gold, stats, relations, flags, items }
// ──────────────────────────────────────────────────────────────────────
const catStats = (cat) => STATS.filter(s => s.cat === cat);
const catSeed = (cat, id, name, flavor) => {
  const ss = catStats(cat);
  return { id, name, cost: 3, grant: { stats: Object.fromEntries(ss.map(s => [s.id, 20])) },
    desc: `${flavor} ${ss.map(s => s.name).join('·')} +20` };
};
const itemStatGrant = (itemId) => {
  const it = ITEM_MAP[itemId];
  if (!it) return null;
  const stats = {};
  for (const [k, v] of Object.entries(it.onBuy || {})) if (k.startsWith('stat.') && typeof v === 'number') stats[k.slice(5)] = v;
  return { items: { [itemId]: 1 }, stats };
};
const statName = (id) => STATS.find(s => s.id === id)?.name ?? id;
// 저장 데이터의 id로 표를 찾을 때는 자기 속성만 본다('constructor'·'toString' 같은 값이 통과하지 않도록)
const own = (obj, k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(obj, k);
const guardianOk = (id) => own(GUARDIANS, id);
const describeStats = (stats) => Object.entries(stats || {}).map(([k, v]) => `${statName(k)} ${v > 0 ? '+' : ''}${v}`).join(', ');

export const KEEPSAKE_STAT_BONUS = 12;
export const START_BONUSES = [
  { id: 'purse', name: '비상금 주머니', cost: 2, grant: { gold: 200 }, desc: '난로 위 항아리에 모아 둔 돈. 시작 자금 +200G' },
  catSeed('body', 'seed_body', '들판의 아침 달리기', '해 뜨기 전 들판을 함께 달린 기억.'),
  catSeed('mind', 'seed_mind', '머리맡의 그림책', '잠들기 전 읽어 준 별자리 이야기.'),
  catSeed('social', 'seed_social', '이웃집 티타임', '옆집 할머니에게 배운 찻잔 드는 법.'),
  catSeed('inner', 'seed_inner', '자장가와 기도', '창가에서 함께 부른 낮은 노래.'),
  { id: 'cube_cake', name: '큐브의 비밀 케이크', cost: 2, grant: { relations: { cube: 20 } }, desc: '큐브가 첫날부터 아이 편이 된다. 큐브와의 관계 +20' },
  (() => {
    const g = itemStatGrant('silver_hairpin');
    const it = ITEM_MAP.silver_hairpin;
    return g && { id: 'star_hairpin', name: it.name, cost: 2, grant: g,
      desc: `별똥별과 함께 들판에 떨어져 있던 작은 머리핀. 아이가 처음부터 지니고 있다.${Object.keys(g.stats).length ? ` ${describeStats(g.stats)}` : ''}` };
  })(),
  { id: 'keepsake', name: '지난 아이의 선물', cost: 2, requires: { runs: 1 }, dynamic: 'keepsake',
    desc: `가장 최근에 떠나보낸 아이가 두고 간 물건. 그 아이가 가장 잘하던 능력 두 가지 +${KEEPSAKE_STAT_BONUS}` },
].filter(Boolean);
export const BONUS_MAP = Object.fromEntries(START_BONUSES.map(b => [b.id, b]));
const ENDING_DEF = new Map(ENDINGS.map(d => [d.id, d]));
const bonusOf = (id) => (own(BONUS_MAP, id) ? BONUS_MAP[id] : null);

// 히든 엔딩 미달성 시 보여 줄 흐릿한 힌트. 엔딩 정의에 hint 문자열이 있으면 그것을 우선한다.
export const HIDDEN_HINTS = {
  star_goddess: '아이가 자신이 어디서 왔는지 알고, 그 길을 스스로 고른다면… 하늘이 대답할지도 모른다.',
  world_traveler: '아이에게 맡긴 날들이 아주 많이 쌓이면, 아이의 발은 어디까지 갈까.',
  time_reverse: '쓰러졌던 날들까지 끌어안은 깊은 마력과 지식 끝에 무언가가 있다.',
};
const GENERIC_HIDDEN_HINT = '아직 아무도 본 적 없는 결말. 남들과는 다른 8년이 필요하다.';

// ──────────────────────────────────────────────────────────────────────
// 스키마
// ──────────────────────────────────────────────────────────────────────
export function emptyMeta() {
  return { v: META_VERSION, shards: 0, shardsEarned: 0, totalRuns: 0, endings: {}, runs: [], owned: [], lettersRead: {} };
}

const clone = (x) => JSON.parse(JSON.stringify(x));
const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const INT_CAP = 999999;   // 손상된 저장의 터무니없는 수(1e308 등)가 화면을 깨뜨리지 않도록
const int0 = (x) => { const n = Math.floor(Number(x)); return Number.isFinite(n) && n > 0 ? Math.min(n, INT_CAP) : 0; };
const num = (x, d = 0) => { const n = Number(x); return Number.isFinite(n) ? n : d; };
const str = (x, d = '') => (typeof x === 'string' ? x : d);
const clampP = (v) => Math.max(-100, Math.min(100, Math.round(num(v)))) || 0;   // -0 → 0
const PERS_IDS = PERSONALITY.map(p => p.id);
const STAT_IDS = STATS.map(s => s.id);
const BAD_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const okKey = (k) => typeof k === 'string' && k.length > 0 && k.length <= 64 && !BAD_KEYS.has(k);
const EPILOGUE_MAX = 1200;
// 해마다의 결정(engine annualLog: 11~17세 생일 직후 보호자의 1년 방향) → 성격 지도에 표시
function normChoices(list) {
  if (!Array.isArray(list)) return [];
  const byAge = new Map();
  for (const c of list) {
    if (!isObj(c)) continue;
    const age = Math.round(Number(c.age)), label = str(c.label).trim().slice(0, 40);
    if (!Number.isFinite(age) || age < 10 || age > 18 || !label) continue;
    byAge.set(age, { age, label });
  }
  return [...byAge.values()].sort((a, b) => a.age - b.age);
}

function normPers(list) {
  if (!Array.isArray(list)) return [];
  const byAge = new Map();
  for (const p of list) {
    if (!isObj(p) || !Number.isFinite(Number(p.age))) continue;
    byAge.set(Math.round(Number(p.age)), { age: Math.round(Number(p.age)), ...Object.fromEntries(PERS_IDS.map(k => [k, clampP(p[k])])) });
  }
  return [...byAge.values()].sort((a, b) => a.age - b.age);
}
function normFrom(f) {
  if (!isObj(f)) return null;
  return { name: str(f.name, '아이'), guardian: guardianOk(f.guardian) ? f.guardian : 'knight', runNo: int0(f.runNo) || null, at: str(f.at) };
}
function normRun(r, i) {
  if (!isObj(r) || typeof r.endingId !== 'string' || !r.endingId) return null;
  return {
    no: int0(r.no) || i + 1, key: str(r.key), at: str(r.at),
    name: str(r.name, '아이'), guardian: guardianOk(r.guardian) ? r.guardian : 'knight', playthrough: int0(r.playthrough) || null,
    endingId: r.endingId, endingName: str(r.endingName, r.endingId), cat: str(r.cat, '기타'), hidden: !!r.hidden,
    runnerUp: isObj(r.runnerUp) ? { id: str(r.runnerUp.id), name: str(r.runnerUp.name) } : null,
    topStats: Array.isArray(r.topStats) ? r.topStats.filter(t => isObj(t) && STAT_IDS.includes(t.id)).map(t => ({ id: t.id, v: int0(t.v) })).slice(0, 4) : [],
    statSum: int0(r.statSum), trust: Math.round(num(r.trust, 0)) || 0,
    counters: isObj(r.counters) ? Object.fromEntries(Object.entries(r.counters).filter(([, v]) => Number.isFinite(Number(v))).map(([k, v]) => [k, int0(v)])) : {},
    persHistory: normPers(r.persHistory), choices: normChoices(r.choices),
    near: Array.isArray(r.near) ? r.near.filter(isObj).map(x => ({ id: str(x.id), name: str(x.name), score: Math.round(num(x.score)) })).slice(0, 3) : [],
    shards: int0(r.shards),
  };
}
function normEndingRec(id, rec) {
  if (typeof rec === 'number' || rec === true) rec = { count: rec === true ? 1 : rec };
  if (!isObj(rec)) return null;
  const count = int0(rec.count);
  if (!count) return null;
  const def = ENDING_DEF.get(id);   // 구버전 기록(id만 있음)은 지금의 엔딩 데이터로 이름·범주를 채운다
  let best = null;
  if (isObj(rec.best)) {
    best = { ...normFrom(rec.best), score: Math.round(num(rec.best.score)), statSum: int0(rec.best.statSum), persHistory: normPers(rec.best.persHistory), choices: normChoices(rec.best.choices) };
    const epi = str(rec.best.epilogue).slice(0, EPILOGUE_MAX);
    if (epi) best.epilogue = epi;   // 그 아이가 실제로 받은 에필로그(함수형 에필로그는 기록 없이는 다시 만들 수 없다)
  }
  const letters = Array.isArray(rec.letters) ? rec.letters.filter(isObj).slice(0, 12).map((l, i) => ({ i, at: str(l.at), from: normFrom(l.from) })) : [];
  return { name: str(rec.name) || def?.name || id, cat: str(rec.cat) || def?.cat || '', hidden: rec.hidden == null ? !!def?.hidden : !!rec.hidden, count, firstAt: str(rec.firstAt), lastAt: str(rec.lastAt, str(rec.firstAt)),
    best, last: normFrom(rec.last) ?? (best ? { name: best.name, guardian: best.guardian, runNo: best.runNo, at: best.at } : null), letters };
}

// 어떤 모양의 데이터든 현재 스키마로 정규화한다 (구버전·손상·부분 데이터 모두).
// v1(초기 프로토타입 형식) 예: { shards: 4, endings: ['queen'] | { queen: 2 }, owned: [...] } — 버전 필드 없음.
export function migrateMeta(raw) {
  const m = emptyMeta();
  if (!isObj(raw)) return m;
  // 엔딩 기록
  if (Array.isArray(raw.endings)) {
    for (const id of raw.endings) if (okKey(id) && !own(m.endings, id)) m.endings[id] = normEndingRec(id, 1);
  } else if (isObj(raw.endings)) {
    for (const [id, rec] of Object.entries(raw.endings)) { if (!okKey(id)) continue; const r = normEndingRec(id, rec); if (r) m.endings[id] = r; }
  }
  const runs = Array.isArray(raw.runs) ? raw.runs.map(normRun).filter(r => r && okKey(r.endingId)) : [];
  m.runs = runs.slice(-MAX_RUNS);
  // 엔딩 기록이 없고 회차 요약만 있는 경우: 요약으로 앨범을 복원
  for (const r of runs) if (!own(m.endings, r.endingId)) m.endings[r.endingId] = normEndingRec(r.endingId, { count: 1, name: r.endingName, cat: r.cat, hidden: r.hidden, firstAt: r.at, lastAt: r.at, last: r });
  const endingCount = Object.values(m.endings).reduce((a, r) => a + r.count, 0);
  m.totalRuns = Math.max(int0(raw.totalRuns), runs.length, endingCount);
  m.owned = [...new Set((Array.isArray(raw.owned) ? raw.owned : []).filter(id => bonusOf(id)))];
  m.shards = int0(raw.shards);
  const spent = m.owned.reduce((a, id) => a + BONUS_MAP[id].cost, 0);
  m.shardsEarned = Math.max(int0(raw.shardsEarned), m.shards + spent);
  if (isObj(raw.lettersRead)) for (const [k, v] of Object.entries(raw.lettersRead)) if (v && typeof k === 'string' && k.length <= 80 && !BAD_KEYS.has(k)) m.lettersRead[k] = true;
  return m;
}

// ──────────────────────────────────────────────────────────────────────
// 저장소 (localStorage 등). 접근 불가·손상 시 빈 메타로 시작하고, 손상 원본은 백업 키에 보관한다.
// ──────────────────────────────────────────────────────────────────────
// status: 'empty'(처음) | 'ok' | 'migrated'(구버전 변환) | 'newer'(더 새 버전이 쓴 기록 — 원본을 백업 키에 남기고 읽을 수 있는 만큼 읽음)
//         | 'corrupt'(손상 → 새로 시작, 원본은 백업 키에) | 'unavailable'(저장소 접근 불가)
export function loadMetaReport(storage, key = META_KEY) {
  let raw;
  try { raw = storage?.getItem?.(key); } catch { return { meta: emptyMeta(), status: 'unavailable' }; }
  if (raw === undefined && !storage?.getItem) return { meta: emptyMeta(), status: 'unavailable' };
  if (raw == null || raw === '') return { meta: emptyMeta(), status: 'empty' };
  let parsed;
  try { parsed = JSON.parse(raw); } catch { parsed = undefined; }
  if (!isObj(parsed)) {
    try { storage.setItem(META_BACKUP_KEY, String(raw)); } catch { /* 백업 실패는 무시 */ }
    return { meta: emptyMeta(), status: 'corrupt' };
  }
  if (Number(parsed.v) > META_VERSION) {
    try { storage.setItem(META_BACKUP_KEY, String(raw)); } catch { /* 백업 실패는 무시 */ }
    return { meta: migrateMeta(parsed), status: 'newer' };
  }
  return { meta: migrateMeta(parsed), status: parsed.v === META_VERSION ? 'ok' : 'migrated' };
}
export function loadMeta(storage, key = META_KEY) { return loadMetaReport(storage, key).meta; }
export function saveMeta(storage, meta, key = META_KEY) {
  try { storage.setItem(key, JSON.stringify(migrateMeta(meta))); return true; } catch { return false; }
}

// ──────────────────────────────────────────────────────────────────────
// 회차 기록 (엔딩 도달 시 1회 호출)
// ──────────────────────────────────────────────────────────────────────
function statSumOf(s) { return STAT_IDS.reduce((a, id) => a + int0(s.stats?.[id]), 0); }
export function runKey(s) {
  return [s.seed ?? '', s.name ?? '', s.guardian ?? '', s.ending?.id ?? '', statSumOf(s), s.counters?.events ?? 0, s.counters?.months ?? 0, s.trust ?? ''].join('|');
}
function letterSource(endingId, cat, src) {
  const own = src.letters?.[endingId];
  if (Array.isArray(own) && own.length) return own;
  const shared = src.categoryLetters?.[cat];
  if (Array.isArray(shared) && shared.length) return shared;
  return [];
}
function letterCap(endingId, cat, src) { const n = letterSource(endingId, cat, src).length; return n > 0 ? n : LETTERS_PER_ENDING; }
const guardianNeed = (id) => (guardianOk(id) ? int0(GUARDIANS[id].unlock?.shards) : 0);
function bonusAvailable(b, meta) { return !b.requires?.runs || meta.totalRuns >= b.requires.runs; }

// opts.letters / opts.categoryLetters: 편지 데이터 주입(테스트·데모). 기본은 data/letters.js
export function recordRun(meta0, finalState, nowIso, opts = {}) {
  const e = finalState?.ending;
  if (!e || typeof e.id !== 'string') throw new Error('recordRun: 엔딩이 결정된 상태만 기록할 수 있습니다.');
  const src = { letters: opts.letters ?? LETTERS, categoryLetters: opts.categoryLetters ?? CATEGORY_LETTERS };
  const meta = migrateMeta(clone(meta0 ?? {}));
  const at = str(nowIso);
  const key = runKey(finalState);
  const none = { shardsGained: 0, shardBreakdown: [], newEndings: [], newUnlocks: [], letterUnlocks: [] };
  if (meta.runs.some(r => r.key === key)) return { meta, duplicate: true, ...none };

  const prevAchieved = Object.keys(meta.endings);
  const isNew = !own(meta.endings, e.id);
  const hidden = !!e.hidden;
  const earnedBefore = meta.shardsEarned;
  const availableBefore = new Set(START_BONUSES.filter(b => bonusAvailable(b, meta)).map(b => b.id));

  // 별 조각
  const shardBreakdown = [{ reason: 'run', label: '8년을 끝까지 함께했다', n: SHARD_RULES.run }];
  // 게이트를 아무것도 통과하지 못해 '가장 가까운 엔딩'으로 떨어진 경우(e.fallback)는 새 엔딩 보너스를 주지 않는다
  if (isNew && !e.fallback) shardBreakdown.push(hidden ? { reason: 'newHidden', label: '처음 본 히든 엔딩', n: SHARD_RULES.newHidden } : { reason: 'newEnding', label: '처음 본 엔딩', n: SHARD_RULES.newEnding });
  const shardsGained = shardBreakdown.reduce((a, b) => a + b.n, 0);
  meta.shards += shardsGained;
  meta.shardsEarned += shardsGained;
  meta.totalRuns += 1;
  const runNo = meta.totalRuns;

  // 회차 요약
  const s = finalState;
  const persHistory = normPers(s.persHistory ?? e.persHistory);
  const choices = normChoices(s.annualLog ?? e.annualLog);
  const topStats = STATS.map(st => ({ id: st.id, v: int0(s.stats?.[st.id]) })).sort((a, b) => b.v - a.v).slice(0, 3);
  const statSum = statSumOf(s);
  const score = Array.isArray(e.top) ? e.top.find(t => t.id === e.id)?.score : undefined;
  const run = normRun({
    no: runNo, key, at, name: s.name, guardian: s.guardian, playthrough: s.playthrough ?? runNo,
    endingId: e.id, endingName: e.name, cat: e.cat, hidden, runnerUp: e.runnerUp ?? null,
    topStats, statSum, trust: s.trust, counters: s.counters ?? {}, persHistory, choices,
    near: Array.isArray(e.top) ? e.top.slice(0, 3) : [], shards: shardsGained,
  }, runNo - 1);
  meta.runs.push(run);
  if (meta.runs.length > MAX_RUNS) meta.runs = meta.runs.slice(-MAX_RUNS);
  const from = { name: run.name, guardian: run.guardian, runNo, at };

  // 엔딩 기록
  const candBest = { ...from, score: Math.round(num(score, -1)), statSum, persHistory, choices };
  const epi = str(e.epilogue).slice(0, EPILOGUE_MAX);
  if (epi) candBest.epilogue = epi;
  const rec = meta.endings[e.id] ?? { name: run.endingName, cat: run.cat, hidden, count: 0, firstAt: at, lastAt: at, best: null, last: null, letters: [] };
  rec.name = run.endingName; rec.cat = run.cat; rec.hidden = hidden;
  rec.count += 1; rec.lastAt = at; rec.last = from;
  if (!rec.best || candBest.score > rec.best.score || (candBest.score === rec.best.score && candBest.statSum > rec.best.statSum)) rec.best = candBest;
  meta.endings[e.id] = rec;

  // 후일담 편지 (저빈도): 처음 달성한 엔딩은 1번 편지. 그리고 이전에 달성한 엔딩들 중 편지가 남은 것의 '다음 편지'를
  // 회차당 MAX_FOLLOWUP_LETTERS_PER_RUN통까지 — 이번에 다시 도달한 엔딩이 먼저, 나머지는 처음 달성한 순서대로.
  // 편지 데이터가 아직 없는 엔딩은 자리만 기록해 둔다(나중에 데이터가 채워지면 보인다). 이것은 상한에 세지 않는다.
  const letterUnlocks = [];
  const unlockNext = (id) => {
    const r = meta.endings[id];
    if (r.letters.length >= letterCap(id, r.cat, src)) return false;
    const index = r.letters.length;
    // 보낸 아이 = 그 길에 가장 최근에 도달한 아이. 구버전 기록처럼 누군지 모르면 이번 아이가 아니라 '그 아이'로
    const sender = r.last ?? (id === e.id ? from : { name: '그 아이', guardian: from.guardian, runNo: null, at: r.firstAt || '' });
    r.letters.push({ i: index, at, from: sender });
    const L = letterSource(id, r.cat, src)[index];
    if (!L) return false;
    const call = GUARDIANS[sender.guardian]?.call;
    letterUnlocks.push({ key: `${id}:${index}`, endingId: id, endingName: r.name, cat: r.cat, index, from: sender, title: fillName(resolveText(L.title, sender), sender.name, call) });
    return true;
  };
  let followups = 0;
  const order = isNew ? prevAchieved : [e.id, ...prevAchieved.filter(id => id !== e.id)];
  for (const id of order) {
    if (followups >= MAX_FOLLOWUP_LETTERS_PER_RUN) break;
    if (unlockNext(id)) followups++;
  }
  if (isNew) unlockNext(e.id);

  // 새로 열린 것들
  const newUnlocks = [];
  for (const [id, g] of Object.entries(GUARDIANS)) {
    const need = guardianNeed(id);
    if (need > 0 && earnedBefore < need && meta.shardsEarned >= need) newUnlocks.push({ type: 'guardian', id, name: g.name, need });
  }
  for (const b of START_BONUSES) if (!availableBefore.has(b.id) && bonusAvailable(b, meta)) newUnlocks.push({ type: 'bonus', id: b.id, name: b.name, cost: b.cost });

  return {
    meta, duplicate: false, run,
    shardsGained, shardBreakdown,
    newEndings: isNew ? [{ id: e.id, name: run.endingName, cat: run.cat, hidden }] : [],
    newUnlocks, letterUnlocks,
  };
}
function resolveText(t, sender) { return typeof t === 'function' ? t({ name: sender.name, guardian: sender.guardian }) : String(t ?? ''); }

// ──────────────────────────────────────────────────────────────────────
// 새 게임 준비
// ──────────────────────────────────────────────────────────────────────
function keepsakeGrant(meta) {
  const last = meta.runs[meta.runs.length - 1];
  if (!last) return null;
  const stats = {};
  for (const t of last.topStats.slice(0, 2)) if (t.v > 0) stats[t.id] = KEEPSAKE_STAT_BONUS;
  if (!Object.keys(stats).length) return null;
  return { grant: { stats, flags: { meta_keepsake: true } }, from: last };
}
function bonusDesc(b, meta) {
  if (b.dynamic === 'keepsake') {
    const k = keepsakeGrant(meta);
    if (k) {
      const nm = k.from.name;
      return `${nm}(${k.from.endingName})${josa(nm, '이').slice(nm.length)} 두고 간 물건. 그 아이가 가장 잘하던 ${Object.keys(k.grant.stats).map(statName).join('·')} +${KEEPSAKE_STAT_BONUS}`;
    }
  }
  return b.desc;
}
function grantOf(b, meta) { return b.dynamic === 'keepsake' ? keepsakeGrant(meta)?.grant ?? null : b.grant; }

export function startOptions(meta0) {
  const meta = migrateMeta(meta0);
  const guardians = Object.entries(GUARDIANS).map(([id, g]) => {
    const need = guardianNeed(id);
    return { id, name: g.name, desc: g.desc, call: g.call, need, unlocked: meta.shardsEarned >= need };
  });
  const bonuses = START_BONUSES.map(b => {
    const owned = meta.owned.includes(b.id), available = bonusAvailable(b, meta);
    return { id: b.id, name: b.name, desc: bonusDesc(b, meta), cost: b.cost, owned, available, affordable: meta.shards >= b.cost,
      requirement: b.requires?.runs ? (b.requires.runs === 1 ? '첫 아이를 떠나보낸 뒤에' : `아이 ${b.requires.runs}명을 떠나보낸 뒤에`) : null };
  });
  const next = guardians.filter(g => !g.unlocked).sort((a, b) => a.need - b.need)[0] ?? null;
  return { guardians, bonuses, shards: meta.shards, shardsEarned: meta.shardsEarned, maxActive: MAX_ACTIVE_BONUSES,
    nextUnlock: next ? { id: next.id, name: next.name, need: next.need, remaining: next.need - meta.shardsEarned } : null };
}

// → { meta, ok, reason? }
export function buyBonus(meta0, id) {
  const meta = migrateMeta(clone(meta0 ?? {}));
  const b = bonusOf(id);
  if (!b) return { meta, ok: false, reason: '없는 보너스다.' };
  if (meta.owned.includes(id)) return { meta, ok: false, reason: '이미 가지고 있다.' };
  if (!bonusAvailable(b, meta)) return { meta, ok: false, reason: '아직 열리지 않았다.' };
  if (meta.shards < b.cost) return { meta, ok: false, reason: `별 조각이 ${b.cost - meta.shards}개 모자란다.` };
  meta.shards -= b.cost;
  meta.owned.push(id);
  return { meta, ok: true };
}

export function legacyOf(meta0, max = MAX_LEGACY) {
  const meta = migrateMeta(meta0);
  return meta.runs.slice().reverse().slice(0, max).map(r => ({ name: r.name, endingId: r.endingId, endingName: r.endingName, cat: r.cat, guardian: r.guardian }));
}

// → engine.newGame에 그대로 펼쳐 넣을 수 있는 { guardian, bonuses, legacy, playthrough } (+ bonusIds: 실제 적용된 보너스)
export function newGameOptions(meta0, { guardian = 'knight', bonusIds = [] } = {}) {
  const meta = migrateMeta(meta0);
  const g = guardianOk(guardian) && meta.shardsEarned >= guardianNeed(guardian) ? guardian : 'knight';
  const applied = [];
  for (const id of Array.isArray(bonusIds) ? bonusIds : []) {
    const b = bonusOf(id);
    if (!b || applied.includes(id) || !meta.owned.includes(id) || !bonusAvailable(b, meta) || !grantOf(b, meta)) continue;
    if (applied.length >= MAX_ACTIVE_BONUSES) break;
    applied.push(id);
  }
  const bonuses = { gold: 0, stats: {}, relations: {}, flags: {}, items: {} };
  for (const id of applied) {
    const gr = grantOf(BONUS_MAP[id], meta);
    bonuses.gold += int0(gr.gold);
    for (const [k, v] of Object.entries(gr.stats || {})) bonuses.stats[k] = (bonuses.stats[k] || 0) + v;
    for (const [k, v] of Object.entries(gr.relations || {})) bonuses.relations[k] = (bonuses.relations[k] || 0) + v;
    Object.assign(bonuses.flags, gr.flags || {});
    for (const [k, v] of Object.entries(gr.items || {})) bonuses.items[k] = (bonuses.items[k] || 0) + v;
  }
  return { guardian: g, bonuses, legacy: legacyOf(meta), playthrough: meta.totalRuns + 1, bonusIds: applied };
}

// ──────────────────────────────────────────────────────────────────────
// 엔딩 앨범 · 편지함
// ──────────────────────────────────────────────────────────────────────
function statHint(def) {
  const top = Object.entries(def.weights || {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => statName(k));
  const pers = Object.entries(def.pers || {}).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  let pole = '';
  if (pers && Math.abs(pers[1]) >= 0.2) { const p = PERSONALITY.find(x => x.id === pers[0]); if (p) pole = pers[1] > 0 ? p.pos : p.neg; }
  const lead = top.length ? `${top.slice(0, -1).map(t => `${t}·`).join('')}${josa(top[top.length - 1], '이')} 빛나는 아이` : '어떤 아이';
  return `${lead}${pole ? ` · ${pole}` : ''}`;
}
// 이 엔딩이 반기는 성격 방향 (엔딩 정의의 pers 계수, |계수| ≥ 0.2인 축 중 큰 순서로 최대 2개) → [{ id, sign, pole }]
export function endingFavor(def) {
  return Object.entries(isObj(def?.pers) ? def.pers : {})
    .filter(([k, v]) => PERS_IDS.includes(k) && Math.abs(num(v)) >= 0.2)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 2)
    .map(([k, v]) => { const p = PERSONALITY.find(x => x.id === k); return { id: k, sign: v > 0 ? 1 : -1, pole: v > 0 ? p.pos : p.neg }; });
}
// 앨범에 보일 에필로그: 문자열 정의는 지금의 문장으로 다시 채우고(내용 수정 반영),
// 함수형 정의(그 회차의 상태가 필요한 것)는 기록해 둔 실제 문장을, 그것도 없으면 이름·출신만으로 만들어 본다.
function albumEpilogue(def, b) {
  if (!b) return null;
  const call = GUARDIANS[b.guardian]?.call;
  if (typeof def?.epilogue === 'string') return fillName(def.epilogue, b.name, call);
  if (b.epilogue) return b.epilogue;
  if (typeof def?.epilogue === 'function') {
    try {
      const t = def.epilogue({ name: b.name, guardian: b.guardian, legacy: [], flags: {}, stats: {}, personality: {}, relations: {}, counters: {} });
      return typeof t === 'string' && t ? fillName(t, b.name, call) : null;
    } catch { return null; }
  }
  return null;
}
function hiddenHint(def) { return typeof def.hint === 'string' && def.hint ? def.hint : HIDDEN_HINTS[def.id] ?? GENERIC_HIDDEN_HINT; }

function lettersOf(meta, id, rec, src) {
  const pool = letterSource(id, rec.cat, src);
  return rec.letters.filter(l => pool[l.i]).map(l => {
    const sender = l.from ?? rec.last ?? { name: '아이', guardian: 'knight' };
    const call = GUARDIANS[sender.guardian]?.call;
    const L = pool[l.i];
    const k = `${id}:${l.i}`;
    return { key: k, endingId: id, endingName: rec.name, cat: rec.cat, hidden: rec.hidden, index: l.i, at: l.at, from: sender,
      title: fillName(resolveText(L.title, sender), sender.name, call), text: fillName(resolveText(L.text, sender), sender.name, call), read: !!meta.lettersRead[k] };
  });
}

// 모든 엔딩의 앨범 항목. 미달성 히든 엔딩은 이름·에필로그를 숨기고 '???' + 흐릿한 힌트.
export function endingAlbum(meta0, endings = ENDINGS, opts = {}) {
  const meta = migrateMeta(meta0);
  const src = { letters: opts.letters ?? LETTERS, categoryLetters: opts.categoryLetters ?? CATEGORY_LETTERS };
  const known = new Set();
  const entries = (endings || []).map(def => {
    known.add(def.id);
    const rec = own(meta.endings, def.id) ? meta.endings[def.id] : null;
    const achieved = !!rec, hidden = !!def.hidden, secret = hidden && !achieved;
    const base = { id: def.id, cat: def.cat, hidden, achieved, secret, name: secret ? '???' : def.name };
    if (!achieved) return { ...base, count: 0, firstAt: null, lastAt: null, best: null, letters: [], lettersUnlocked: 0, lettersTotal: letterSource(def.id, def.cat, src).length, epilogue: null, favor: [], hint: secret ? hiddenHint(def) : statHint(def) };
    const b = rec.best ?? rec.last;
    return { ...base, count: rec.count, firstAt: rec.firstAt, lastAt: rec.lastAt, best: rec.best, last: rec.last,
      letters: lettersOf(meta, def.id, rec, src), lettersUnlocked: rec.letters.length, lettersTotal: letterSource(def.id, def.cat, src).length,
      epilogue: albumEpilogue(def, b), favor: endingFavor(def), hint: null };
  });
  // 데이터에서 사라진 엔딩의 기록도 버리지 않는다
  for (const [id, rec] of Object.entries(meta.endings)) {
    if (known.has(id)) continue;
    entries.push({ id, cat: rec.cat || '기타', hidden: rec.hidden, achieved: true, secret: false, name: rec.name, count: rec.count, firstAt: rec.firstAt, lastAt: rec.lastAt,
      best: rec.best, last: rec.last, letters: lettersOf(meta, id, rec, src), lettersUnlocked: rec.letters.length, lettersTotal: letterSource(id, rec.cat, src).length,
      epilogue: rec.best?.epilogue ?? null, favor: [], hint: null, orphan: true });
  }
  return entries;
}

// 편지함: 읽을 수 있는(내용이 있는) 편지 전부, 최근에 도착한 순
export function letterInbox(meta0, opts = {}) {
  const meta = migrateMeta(meta0);
  const src = { letters: opts.letters ?? LETTERS, categoryLetters: opts.categoryLetters ?? CATEGORY_LETTERS };
  const out = [];
  for (const [id, rec] of Object.entries(meta.endings)) out.push(...lettersOf(meta, id, rec, src));
  return out.sort((a, b) => (b.at > a.at ? 1 : b.at < a.at ? -1 : 0) || (b.from?.runNo ?? 0) - (a.from?.runNo ?? 0) || a.index - b.index);
}
export function unreadLetterCount(meta0, opts = {}) { return letterInbox(meta0, opts).filter(l => !l.read).length; }
export function markLetterRead(meta0, key) {
  const meta = migrateMeta(clone(meta0 ?? {}));
  if (typeof key === 'string' && key) meta.lettersRead[key] = true;
  return meta;
}

// 타이틀 화면 등에 쓰는 요약
export function metaSummary(meta0, endings = ENDINGS, opts = {}) {
  const meta = migrateMeta(meta0);
  const ids = new Set((endings || []).map(e => e.id));
  const hiddenIds = new Set((endings || []).filter(e => e.hidden).map(e => e.id));
  const seen = Object.keys(meta.endings).filter(id => ids.has(id));
  return { totalRuns: meta.totalRuns, shards: meta.shards, shardsEarned: meta.shardsEarned,
    endingsSeen: seen.length, endingsTotal: ids.size, hiddenSeen: seen.filter(id => hiddenIds.has(id)).length, hiddenTotal: hiddenIds.size,
    unreadLetters: unreadLetterCount(meta, opts), playthrough: meta.totalRuns + 1 };
}

// 범주 이름 (stats.js의 신체/지성/사교/내면) — UI 편의
export const STAT_CAT_NAMES = Object.fromEntries(Object.entries(STAT_CATS).map(([k, v]) => [k, v.name]));
