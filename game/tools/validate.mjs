#!/usr/bin/env node
// 콘텐츠 검증기 — 이벤트·엔딩·연간결정·아이템·편지의 구조/참조/안전 규칙 검사.
// 사용: node tools/validate.mjs [--file=events/b03_teen.js] [--strict] [--json]
//  - 오류(error): 반드시 고쳐야 함 (exit 1)
//  - 경고(warn): 검토 필요 (--strict 이면 exit 1)
import { STATS, PERSONALITY, NPCS } from '../js/data/stats.js';
import { ACTIVITIES } from '../js/data/activities.js';
import { EVENTS, EVENT_SOURCES } from '../js/data/events.js';
import { ENDINGS } from '../js/data/endings.js';
import { ANNUAL } from '../js/data/annual.js';
import { ITEMS } from '../js/data/items.js';
import { LETTERS, CATEGORY_LETTERS } from '../js/data/letters.js';
import { GUARDIANS } from '../js/data/guardians.js';
import { EVENT_IMAGE_KEYS } from '../js/data/images.js';
import { newGame } from '../js/engine/engine.js';
import { evalCondition } from '../js/engine/conditions.js';

const args = process.argv.slice(2);
const onlyFile = (args.find(a => a.startsWith('--file=')) || '').slice(7).replace(/^events\//, '');
const STRICT = args.includes('--strict'), JSON_OUT = args.includes('--json');

const STAT_IDS = new Set(STATS.map(s => s.id));
const PERS_IDS = new Set(PERSONALITY.map(p => p.id));
const NPC_IDS = new Set(NPCS.map(n => n.id));
const ACT_IDS = new Set(ACTIVITIES.map(a => a.id));
const ITEM_IDS = new Set(ITEMS.map(i => i.id));
const IMG = new Set(EVENT_IMAGE_KEYS);
const SCALARS = new Set(['trust', 'gold', 'stress', 'infamy', 'reputation', 'gHealth']);
const COND_ROOTS = new Set(['stat', 'pers', 'rel', 'flag', 'mastery', 'count', 'age', 'month', 'season', 'stage', 'stress', 'trust', 'gold', 'infamy', 'reputation', 'guardian', 'gHealth', 'item', 'legacyCount', 'playthrough', 'seen']);
const MINIGAMES = new Set(['adventure', 'cooking', 'ball', 'exam']);
const ENGINE_FLAGS = new Set(['secret_adventure', 'secret_night_work', '_collapsed']); // 엔진이 직접 세팅
const ENGINE_COUNTERS = new Set(['refusals', 'forced', 'persuaded', 'autonomy', 'events', 'months', 'collapses', 'quietMonths', 'adventures']);
const ROMANCE_WORDS = /고백|데이트|키스|입맞|연인|사귀|좋아한다고|청혼|약혼|결혼/;

const errors = [], warns = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

// 이벤트 → 소스 파일 매핑
const srcOf = new Map();
for (const [file, list] of Object.entries(EVENT_SOURCES)) for (const e of list) srcOf.set(e, file);
const inScope = (e) => !onlyFile || srcOf.get(e) === onlyFile;

const flagsSet = new Map(), flagsRead = new Map(), countersSet = new Set();
const note = (map, flag, where) => { if (!map.has(flag)) map.set(flag, []); map.get(flag).push(where); };

const probe = newGame({ seed: 1 });
function checkCond(where, c) {
  if (typeof c === 'function') return;
  if (typeof c !== 'string') return err(where, `조건은 문자열이어야 함: ${JSON.stringify(c)}`);
  try { evalCondition(probe, c); } catch (e) { return err(where, `조건 파싱 실패 "${c}": ${e.message}`); }
  const m = /^\s*!?([\w.]+)/.exec(c); const path = m[1].split('.');
  const root = path[0];
  if (!COND_ROOTS.has(root)) return err(where, `알 수 없는 조건 경로 "${m[1]}"`);
  if (root === 'stat' && !STAT_IDS.has(path[1])) err(where, `없는 능력치 "${path[1]}"`);
  if (root === 'pers' && !PERS_IDS.has(path[1])) err(where, `없는 성격 축 "${path[1]}"`);
  if (root === 'rel' && !NPC_IDS.has(path[1])) err(where, `없는 NPC "${path[1]}"`);
  if (root === 'mastery' && !ACT_IDS.has(path[1])) err(where, `없는 활동 "${path[1]}"`);
  if (root === 'item' && !ITEM_IDS.has(path[1])) err(where, `없는 아이템 "${path[1]}"`);
  if (root === 'seen' && path[1] && !EVENTS.some(e => e.id === path[1])) err(where, `없는 이벤트 "${path[1]}"`);
  if (root === 'flag') note(flagsRead, path[1], where);
  if (root === 'count' && !ENGINE_COUNTERS.has(path[1])) note(flagsRead, 'count:' + path[1], where);
  if (root === 'guardian') { const v = /==\s*'?(\w+)'?/.exec(c)?.[1]; if (v && !GUARDIANS[v]) err(where, `없는 보호자 출신 "${v}"`); }
}
function checkEffects(where, eff, ctx = {}) {
  if (!eff) return;
  for (const [k, v] of Object.entries(eff)) {
    const [ns, id] = k.includes('.') ? k.split('.') : [k, null];
    if (SCALARS.has(k)) {
      if (typeof v !== 'number') err(where, `${k} 값은 숫자여야 함`);
      const lim = { trust: 25, stress: 30, gold: 1200, infamy: 20, reputation: 20, gHealth: 25 }[k];
      if (Math.abs(v) > lim) warn(where, `${k} ${v} — 큰 변동 (권장 ±${lim})`);
      continue;
    }
    if (ns === 'stat') { if (!STAT_IDS.has(id)) err(where, `없는 능력치 효과 "${k}"`); else if (typeof v !== 'number') err(where, `${k} 숫자 아님`); else if (Math.abs(v) > 30) warn(where, `${k} ${v} — 큰 능력치 변동(권장 ±30)`); continue; }
    if (ns === 'pers') { if (!PERS_IDS.has(id)) err(where, `없는 성격 축 효과 "${k}"`); else if (Math.abs(v) > 10) warn(where, `${k} ${v} — 성격은 ±10 이내 권장`); continue; }
    if (ns === 'rel') { if (!NPC_IDS.has(id)) err(where, `없는 NPC 효과 "${k}"`); else if (Math.abs(v) > 25) warn(where, `${k} ${v} — 큰 관계 변동`); continue; }
    if (ns === 'flag') { note(flagsSet, id, where); if (ctx.age && /love|romance|date|kiss|propos/i.test(id) && v === true && ctx.age[0] < 16) err(where, `연애 플래그 ${id}는 16세 이상 이벤트에서만`); continue; }
    if (ns === 'item') { if (!ITEM_IDS.has(id)) err(where, `없는 아이템 효과 "${k}"`); continue; }
    if (ns === 'count') { countersSet.add(id); continue; }
    err(where, `알 수 없는 효과 키 "${k}"`);
  }
}
function textOf(t) { return typeof t === 'function' ? '' : String(t ?? ''); }

// ── 이벤트 ─────────────────────────────────────────────────────────
const ids = new Map();
for (const e of EVENTS) {
  const file = srcOf.get(e) || '?';
  const W = `[${file}] ${e.id}`;
  if (ids.has(e.id)) err(W, `중복 id (다른 파일: ${ids.get(e.id)})`); ids.set(e.id, file);
  if (!inScope(e)) { // 범위 밖이라도 플래그 수집은 해야 교차 참조가 정확함
    (e.conditions || []).forEach(c => { const m = typeof c === 'string' && /^\s*!?flag\.(\w+)/.exec(c); if (m) note(flagsRead, m[1], W); });
    for (const c of e.choices || []) for (const o of [c, c.success, c.fail]) if (o?.effects) for (const k of Object.keys(o.effects)) if (k.startsWith('flag.')) note(flagsSet, k.slice(5), W); else if (k.startsWith('count.')) countersSet.add(k.slice(6));
    for (const c of e.choices || []) (c.conditions || []).forEach(cc => { const m = typeof cc === 'string' && /^\s*!?flag\.(\w+)/.exec(cc); if (m) note(flagsRead, m[1], W); });
    continue;
  }
  if (!/^[a-z0-9_]+$/.test(e.id)) err(W, 'id는 소문자·숫자·밑줄만');
  if (!e.title) err(W, 'title 없음');
  if (!e.text) err(W, 'text 없음');
  if (typeof e.text === 'string' && e.text.length < 15) warn(W, 'text가 너무 짧음');
  if (typeof e.text === 'string' && e.text.length > 400) warn(W, 'text가 너무 김(400자 초과)');
  if (!e.chainOnly && !e.age && !e.fixed) warn(W, 'age 범위 없음 — 모든 나이에 등장');
  if (e.age && (e.age[0] < 10 || e.age[1] > 17 || e.age[0] > e.age[1])) err(W, `age 범위 ${e.age} (10~17)`);
  if (e.month && (e.month < 1 || e.month > 12)) err(W, 'month 1~12');
  if (e.season && !['spring', 'summer', 'autumn', 'winter'].includes(e.season)) err(W, 'season 값');
  if (e.image && !IMG.has(e.image)) err(W, `이미지 키 "${e.image}"가 images.js 레지스트리에 없음`);
  if (e.npc && !NPC_IDS.has(e.npc) && !IMG.has('npc/' + e.npc)) err(W, `npc "${e.npc}"가 NPC 목록/이미지 레지스트리에 없음`);
  const reqs = e.requiresActivity ? [].concat(e.requiresActivity) : [];
  for (const a of reqs) if (!ACT_IDS.has(a)) err(W, `requiresActivity "${a}" 없는 활동`);
  if (e.fixed && !e.month) err(W, 'fixed 이벤트는 month 필요');
  if (e.weight !== undefined && (e.weight <= 0 || e.weight > 6)) warn(W, `weight ${e.weight} (권장 0.3~4)`);
  (e.conditions || []).forEach(c => checkCond(W, c));
  if (!Array.isArray(e.choices) || e.choices.length < 1 || e.choices.length > 4) err(W, '선택지 1~4개');
  const always = (e.choices || []).filter(c => !c.conditions || c.conditions.length === 0);
  if (always.length === 0) err(W, '조건 없는 선택지가 최소 1개 있어야 함(막힘 방지)');
  const romantic = ROMANCE_WORDS.test(textOf(e.text) + (e.choices || []).map(c => textOf(c.label) + textOf(c.result) + textOf(c.success?.result) + textOf(c.fail?.result)).join(' '));
  if (romantic && !e.romance) warn(W, '연애 관련 표현 — romance:true 태그와 age 16+ 확인 필요');
  if (e.romance && (!e.age || e.age[0] < 16)) err(W, 'romance 이벤트는 age[0] >= 16');
  for (const [i, c] of (e.choices || []).entries()) {
    const CW = `${W}#${i}`;
    if (!c.label) err(CW, 'label 없음');
    (c.conditions || []).forEach(x => checkCond(CW, x));
    if (c.minigame && !MINIGAMES.has(c.minigame)) err(CW, `minigame "${c.minigame}" (adventure|cooking|ball|exam)`);
    if (c.minigame && !c.check) err(CW, 'minigame은 check와 함께');
    if (c.check) {
      if (!STAT_IDS.has(c.check.stat)) err(CW, `check.stat "${c.check.stat}"`);
      if (typeof c.check.dc !== 'number') err(CW, 'check.dc 숫자');
      if (!c.success || !c.fail) err(CW, 'check에는 success/fail 필요');
      if (c.effects) err(CW, 'check 선택지는 effects 대신 success/fail.effects 사용');
      for (const [o, lbl] of [[c.success, 'success'], [c.fail, 'fail']]) if (o) {
        checkEffects(CW + '.' + lbl, o.effects, e);
        if (!o.result) warn(CW + '.' + lbl, 'result 텍스트 없음');
        if (o.next && !ids.has(o.next) && !EVENTS.some(x => x.id === o.next)) err(CW, `next "${o.next}" 없음`);
      }
      // DC 적정성: 해당 나이의 기대 능력치 대비
      const lo = e.age?.[0] ?? 10, expect = 40 + (lo - 10) * 45; // 대략적 평균 성장 곡선
      if (c.check.dc > expect * 2.2 + 150) warn(CW, `DC ${c.check.dc} — ${lo}세 기대치(${expect}) 대비 매우 어려움`);
    } else {
      if (!c.effects && !c.result) err(CW, 'effects 또는 result 필요');
      checkEffects(CW, c.effects, e);
      if (!c.result) warn(CW, 'result 텍스트 없음');
      if (c.next && !EVENTS.some(x => x.id === c.next)) err(CW, `next "${c.next}" 없음`);
    }
  }
  // 이름 조사 실수: {name}이 / {name}은 등
  const allText = [textOf(e.text), ...(e.choices || []).flatMap(c => [textOf(c.label), textOf(c.result), textOf(c.success?.result), textOf(c.fail?.result)])].join('\n');
  const bad = allText.match(/\{(name|call)\}(이|가|은|는|을|를|과|와|아|야|으로|로)(?![가-힣])/);
  if (bad) err(W, `조사 직접 표기 "${bad[0]}" → {${bad[1]}${bad[2]}} 토큰 사용`);
  if (/[^{]아빠|"아빠/.test(allText) && !e.guardian) warn(W, "'아빠' 직접 표기 — 보호자 출신별 호칭은 {call} 토큰 사용");
  const unknownTok = allText.match(/\{(?!name|call)[^}]*\}/);
  if (unknownTok && !/\$\{/.test(unknownTok[0])) err(W, `알 수 없는 토큰 ${unknownTok[0]}`);
  if (/\$\{N\}/.test(allText)) err(W, '${N} 대신 {name} 토큰');
}
// chainOnly 이벤트가 어디서도 next로 연결되지 않으면 경고
const nextTargets = new Set(EVENTS.flatMap(e => (e.choices || []).flatMap(c => [c.next, c.success?.next, c.fail?.next]).filter(Boolean)));
for (const e of EVENTS) if (e.chainOnly && !nextTargets.has(e.id) && inScope(e)) err(`[${srcOf.get(e)}] ${e.id}`, 'chainOnly인데 어떤 선택지도 next로 연결하지 않음(도달 불가)');

// ── 엔딩 ─────────────────────────────────────────────────────────
if (!onlyFile) {
  const eids = new Set();
  for (const e of ENDINGS) {
    const W = `[ending] ${e.id}`;
    if (eids.has(e.id)) err(W, '중복 엔딩 id'); eids.add(e.id);
    if (!e.name || !e.cat || !e.epilogue) err(W, 'name/cat/epilogue 필요');
    for (const st of Object.keys(e.weights || {})) if (!STAT_IDS.has(st)) err(W, `weights 능력치 "${st}"`);
    for (const ax of Object.keys(e.pers || {})) if (!PERS_IDS.has(ax)) err(W, `pers 축 "${ax}"`);
    (e.gates || []).forEach(c => checkCond(W, c));
    (e.bonus || []).forEach(b => (b.when || []).forEach(c => checkCond(W, c)));
    if (typeof e.epilogue === 'string' && /\{name\}(이|가|은|는|을|를|과|와)(?![가-힣])/.test(e.epilogue)) err(W, '에필로그 조사 토큰');
    if (!LETTERS[e.id] && !CATEGORY_LETTERS[e.cat]) warn(W, '후일담 편지 없음(엔딩별 또는 카테고리별)');
  }
  const hidden = ENDINGS.filter(e => e.hidden).length;
  if (ENDINGS.length < 48) warn('[ending]', `엔딩 ${ENDINGS.length}종 (GDD 목표 40+히든8=48)`);
  if (hidden < 8) warn('[ending]', `히든 엔딩 ${hidden}종 (GDD 목표 8)`);

  // ── 연간 결정 ───────────────────────────────────────────────────
  for (const [age, a] of Object.entries(ANNUAL)) {
    const W = `[annual] ${age}세`;
    if (+age < 11 || +age > 17) err(W, '나이 11~17');
    if (!a.title || !a.text || !Array.isArray(a.options) || a.options.length < 2 || a.options.length > 4) err(W, 'title/text/options(2~4)');
    if (a.image && !IMG.has(a.image)) err(W, `이미지 키 ${a.image}`);
    if (!(a.options || []).some(o => !o.conditions?.length)) err(W, '조건 없는 선택지 필요');
    (a.options || []).forEach((o, i) => { (o.conditions || []).forEach(c => checkCond(`${W}#${i}`, c)); checkEffects(`${W}#${i}`, o.effects, {}); if (!o.label) err(`${W}#${i}`, 'label'); });
  }
  if (Object.keys(ANNUAL).length && Object.keys(ANNUAL).length < 7) warn('[annual]', `연간 결정 ${Object.keys(ANNUAL).length}개 (11~17세 7개 권장)`);

  // ── 아이템 ──────────────────────────────────────────────────────
  const iids = new Set();
  for (const it of ITEMS) {
    const W = `[item] ${it.id}`;
    if (iids.has(it.id)) err(W, '중복'); iids.add(it.id);
    if (!it.name || typeof it.price !== 'number' || it.price <= 0) err(W, 'name/price');
    if (!['outfit', 'accessory', 'book', 'tool', 'gift', 'consumable'].includes(it.kind)) err(W, `kind "${it.kind}"`);
    checkEffects(W + '.onBuy', it.onBuy, {}); checkEffects(W + '.monthly', it.monthly, {});
    (it.conditions || []).forEach(c => checkCond(W, c));
    if (it.monthly) for (const [k, v] of Object.entries(it.monthly)) if (k.startsWith('stat.') && Math.abs(v) > 3) warn(W, `monthly ${k} ${v} — 매달 누적되므로 ±3 이내 권장`);
  }
  // ── 편지 ────────────────────────────────────────────────────────
  for (const [id, list] of Object.entries(LETTERS)) {
    if (!ENDINGS.some(e => e.id === id)) err(`[letter] ${id}`, '없는 엔딩 id');
    if (!Array.isArray(list) || !list.length) err(`[letter] ${id}`, '편지 배열 필요');
  }
  // 엔딩·연간·아이템의 플래그 사용 수집
  for (const e of ENDINGS) [...(e.gates || []), ...(e.bonus || []).flatMap(b => b.when || [])].forEach(c => { const m = /^\s*!?flag\.(\w+)/.exec(c); if (m) note(flagsRead, m[1], `[ending] ${e.id}`); });
  for (const [age, a] of Object.entries(ANNUAL)) (a.options || []).forEach(o => { for (const k of Object.keys(o.effects || {})) if (k.startsWith('flag.')) note(flagsSet, k.slice(5), `[annual] ${age}`); });
  for (const it of ITEMS) for (const k of Object.keys({ ...(it.onBuy || {}) })) if (k.startsWith('flag.')) note(flagsSet, k.slice(5), `[item] ${it.id}`);
}

// ── 플래그 교차 참조 ───────────────────────────────────────────────
for (const [flag, wheres] of flagsRead) {
  if (flag.startsWith('count:')) { const c = flag.slice(6); if (!countersSet.has(c)) err(wheres[0], `count.${c}를 읽지만 어디서도 증가시키지 않음`); continue; }
  if (!flagsSet.has(flag) && !ENGINE_FLAGS.has(flag)) err(wheres[0], `flag.${flag}를 읽지만 어디서도 세팅하지 않음 (${wheres.length}곳)`);
}
if (!onlyFile) for (const [flag, wheres] of flagsSet) if (!flagsRead.has(flag)) warn(wheres[0], `flag.${flag}를 세팅하지만 아무도 읽지 않음`);

// ── 출력 ──────────────────────────────────────────────────────────
const scoped = onlyFile ? EVENTS.filter(inScope).length : EVENTS.length;
if (JSON_OUT) console.log(JSON.stringify({ events: scoped, errors, warns }, null, 1));
else {
  console.log(`검증 대상: 이벤트 ${scoped}개${onlyFile ? ` (${onlyFile})` : ` · 엔딩 ${ENDINGS.length} · 연간 ${Object.keys(ANNUAL).length} · 아이템 ${ITEMS.length}`}`);
  for (const e of errors) console.log('  ✗', e);
  for (const w of warns) console.log('  △', w);
  console.log(`오류 ${errors.length} · 경고 ${warns.length}`);
}
process.exitCode = errors.length || (STRICT && warns.length) ? 1 : 0;
