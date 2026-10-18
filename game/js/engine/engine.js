// 별의 공주 — 코어 엔진 (DOM 의존 없음: 브라우저·Node 공용)
import { makeRng } from './rng.js';
import { STATS, STAT_MAX, STAT_TENSION, PERSONALITY, NPCS, SEASONS, stageOf } from '../data/stats.js';
import { ACTIVITIES, ACTIVITY_MAP, autonomyPreferences } from '../data/activities.js';
import { EVENTS, EVENT_MAP } from '../data/events.js';
import { ENDINGS } from '../data/endings.js';
import { GUARDIANS } from '../data/guardians.js';
import { ITEMS, ITEM_MAP } from '../data/items.js';
import { ANNUAL } from '../data/annual.js';
import { evalAll } from './conditions.js';
import { fillName, josa } from './josa.js';

export const START_AGE = 10;
export const END_AGE = 18;
export const SLOTS_PER_MONTH = 3;
const FOOD_COST = 30;
// 이벤트 밀도 (GDD 2: 월 평균 1.5회 목표). 시뮬레이터로 조정.
export const EVENT_DENSITY = { base: 0.8, second: 0.45, third: 0.12, max: 3 };
// 보호자 서사 상한 (GDD 10: 보호자 이벤트는 전체의 15% 이하)
export const GUARDIAN_EVENT_CAP = 0.15;
export { GUARDIANS };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ──────────────────────────────────────────────────────────────────────
// 새 게임
// ──────────────────────────────────────────────────────────────────────
// bonuses: 메타 진행 시작 보너스 { gold, stats:{}, relations:{}, flags:{}, items:{} }
// legacy: 이전 회차 딸들 [{ name, endingId, endingName, cat }] (GDD 4.9 유산 시스템)
export function newGame({ name = '루나', guardian = 'knight', seed = Date.now() % 2147483647, hair = 'silver', eyes = 'violet', bonuses = null, legacy = [], playthrough = 1 } = {}) {
  const rng = makeRng(seed);
  const g = GUARDIANS[guardian];
  if (!g) throw new Error('알 수 없는 보호자: ' + guardian);
  const s = {
    version: 1, seed, rngState: rng.getState(),
    name, guardian, hair, eyes,
    age: START_AGE, month: 1, season: SEASONS[0], stage: stageOf(START_AGE).id,
    stats: Object.fromEntries(STATS.map(st => [st.id, 20 + Math.floor(rng.next() * 25)])),
    personality: Object.fromEntries(PERSONALITY.map(p => [p.id, Math.round((rng.next() - 0.5) * 60)])),
    relations: Object.fromEntries(NPCS.map(n => [n.id, 10])),
    flags: {}, mastery: {}, counters: { refusals: 0, forced: 0, persuaded: 0, autonomy: 0, events: 0, months: 0, collapses: 0, quietMonths: 0 },
    stress: 20, trust: 50, gold: g.gold, reputation: 10, infamy: 0, guardianHealth: 80,
    seen: {}, pendingEvents: [], history: [], milestones: [],
    items: {}, annualLog: [], persHistory: [], legacy: legacy.slice(0, 5), playthrough,
    guardianEvents: 0,
    finished: false, ending: null,
  };
  for (const [k, v] of Object.entries(g.rel)) s.relations[k] += v;
  s.relations.cube = 40;
  if (bonuses) {
    if (bonuses.gold) s.gold += bonuses.gold;
    for (const [k, v] of Object.entries(bonuses.stats || {})) s.stats[k] = clamp(s.stats[k] + v, 0, STAT_MAX);
    for (const [k, v] of Object.entries(bonuses.relations || {})) s.relations[k] = clamp((s.relations[k] ?? 0) + v, 0, 100);
    Object.assign(s.flags, bonuses.flags || {});
    for (const [k, v] of Object.entries(bonuses.items || {})) s.items[k] = (s.items[k] || 0) + v;
  }
  s.persHistory.push({ age: START_AGE, ...s.personality });
  s.rngState = rng.getState();
  return s;
}

function rngOf(s) { const r = makeRng(0); r.setState(s.rngState); return r; }
function saveRng(s, r) { s.rngState = r.getState(); }

// ──────────────────────────────────────────────────────────────────────
// 효과 적용 (이벤트·활동 공용)  키 예: 'stat.int', 'pers.agree', 'rel.leon', 'flag.x', 'trust', 'gold', 'stress', 'infamy', 'reputation', 'gHealth'
// ──────────────────────────────────────────────────────────────────────
export function applyEffects(s, effects, mult = 1) {
  if (!effects) return [];
  const lines = [];
  for (const [key, raw] of Object.entries(effects)) {
    const [ns, id] = key.includes('.') ? key.split('.') : [key, null];
    const v = typeof raw === 'number' ? raw * mult : raw;
    switch (ns) {
      case 'stat': addStat(s, id, v); break;
      case 'pers': s.personality[id] = clamp(s.personality[id] + v, -100, 100); break;
      case 'rel':  s.relations[id] = clamp((s.relations[id] ?? 0) + v, 0, 100); break;
      case 'flag': s.flags[id] = v; break;
      case 'trust': s.trust = clamp(s.trust + v, 0, 100); break;
      case 'gold': s.gold = Math.round(s.gold + v); break;
      case 'stress': s.stress = clamp(s.stress + v, 0, 100); break;
      case 'infamy': s.infamy = clamp(s.infamy + v, 0, 100); break;
      case 'reputation': s.reputation = clamp(s.reputation + v, 0, 100); break;
      case 'gHealth': s.guardianHealth = clamp(s.guardianHealth + v, 0, 100); break;
      case 'item': s.items[id] = Math.max(0, (s.items[id] || 0) + v); break;
      case 'count': s.counters[id] = (s.counters[id] || 0) + v; break;
      default: throw new Error('알 수 없는 효과 키: ' + key);
    }
  }
  return lines;
}

function addStat(s, id, delta) {
  if (!(id in s.stats)) throw new Error('알 수 없는 능력치: ' + id);
  const before = s.stats[id];
  s.stats[id] = clamp(Math.round(s.stats[id] + delta), 0, STAT_MAX);
  if (delta > 0 && STAT_TENSION[id]) {
    for (const [other, coef] of Object.entries(STAT_TENSION[id])) {
      s.stats[other] = clamp(Math.round(s.stats[other] + delta * coef), 0, STAT_MAX);
    }
  }
  // 마일스톤 기록 (에필로그 대사용)
  for (const th of [100, 300, 600]) {
    if (before < th && s.stats[id] >= th) s.milestones.push({ age: s.age, month: s.month, stat: id, th });
  }
}

// ──────────────────────────────────────────────────────────────────────
// 1) 스케줄 제출 → 거부 판정 (GDD 4.3)
// ──────────────────────────────────────────────────────────────────────
export function checkRefusals(s, slots) {
  const r = rngOf(s);
  const proposals = [];
  const p = s.personality;
  slots.forEach((id, i) => {
    const act = ACTIVITY_MAP[id];
    if (!act || act.type === 'free') return;
    // 거부 확률: 반항 성향 + 스트레스 + 유년기엔 낮음
    let prob = 0;
    if (p.agree < -20) prob += (-p.agree - 20) / 200;         // 최대 0.4
    if (s.stress >= 70) prob += (s.stress - 70) / 100;        // 최대 0.3
    if (s.stress >= 90) prob += 0.2;
    if (s.age <= 11) prob *= 0.4;
    if (s.trust >= 80) prob *= 0.6;
    if (prob > 0 && r.chance(prob)) {
      const prefs = autonomyPreferences(p);
      const altId = weightedPick(r, prefs, [id]);
      proposals.push({
        slot: i, activityId: id, alternative: altId,
        reason: s.stress >= 70 ? 'tired' : 'defiant',
        line: refusalLine(s, act, ACTIVITY_MAP[altId]),
      });
    }
  });
  saveRng(s, r);
  return proposals;
}

function refusalLine(s, act, alt) {
  const tired = [
    `"……${act.name}은 다음에 하면 안 돼? 요즘 계속 피곤해."`,
    `"미안, 오늘은 정말 못 하겠어. ${alt.name} 정도면 괜찮을 것 같은데."`,
  ];
  const defiant = [
    `"${act.name}? 내가 왜 그걸 해야 하는데. 난 ${alt.name} 할래."`,
    `"매번 시키는 대로만 하라는 거야? 이번엔 내가 정할 거야. ${alt.name}."`,
  ];
  const pool = s.stress >= 70 ? tired : defiant;
  return pool[(s.age + s.month) % pool.length];
}

// 2) 거부에 대한 보호자 결정: 'accept' | 'persuade' | 'force'
export function resolveRefusal(s, proposal, decision) {
  const r = rngOf(s);
  let final = proposal.activityId, text = '';
  s.counters.refusals++;
  if (decision === 'accept') {
    final = proposal.alternative;
    applyEffects(s, { trust: +4, stress: -3, 'pers.agree': +1 });
    text = `${s.name}의 뜻을 받아들였다. (신뢰 +4)`;
  } else if (decision === 'persuade') {
    const power = s.stats.elo * 0.5 + s.trust * 2 + (GUARDIANS[s.guardian]?.persuade ?? 0);
    const dc = 150 + Math.max(0, -s.personality.agree) * 1.5 + s.stress;
    if (r.next() * (power + 1) > r.next() * dc) {
      s.counters.persuaded++;
      applyEffects(s, { trust: +2, 'pers.agree': +2 });
      text = `차분히 이야기했다. ${josa(s.name,'이')} 고개를 끄덕였다. (설득 성공, 신뢰 +2)`;
    } else {
      final = proposal.alternative;
      applyEffects(s, { trust: -2, stress: +4 });
      text = `설득은 통하지 않았다. 결국 ${josa(s.name,'이')} 원하는 대로 ${ACTIVITY_MAP[final].name}을(를) 하기로. (신뢰 -2)`;
    }
  } else if (decision === 'force') {
    s.counters.forced++;
    applyEffects(s, { trust: -8, stress: +12, 'pers.agree': -3 });
    text = `"그냥 하라는 대로 해." ${josa(s.name,'은')} 말없이 방으로 들어갔다. (신뢰 -8, 스트레스 +12)`;
  }
  saveRng(s, r);
  return { finalActivity: final, text };
}

// ──────────────────────────────────────────────────────────────────────
// 3) 한 달 실행: 슬롯 효과 적용 + 이벤트 선정
// ──────────────────────────────────────────────────────────────────────
export function runMonth(s, slots) {
  if (s.finished) throw new Error('게임이 끝났습니다.');
  const r = rngOf(s);
  const before = { stats: { ...s.stats }, gold: s.gold, stress: s.stress, trust: s.trust, pers: { ...s.personality } };
  const stage = stageOf(s.age);
  const lines = [];
  const g = GUARDIANS[s.guardian];
  const executed = [];

  // 탈진 상태(전월 스트레스 100)면 강제 휴식 1슬롯
  let effMult = 1;
  if (s.flags._collapsed) {
    lines.push(`${josa(s.name,'은')} 한동안 자리에서 일어나지 못했다. 상순은 쉬어야 했다.`);
    slots = ['rest', slots[1], slots[2]];
    s.flags._collapsed = false;
  } else if (s.stress >= 80) {
    effMult = 0.6;
    lines.push('스트레스가 심해 집중이 안 된다. 이달 성과가 떨어진다.');
  }

  for (let i = 0; i < SLOTS_PER_MONTH; i++) {
    let id = slots[i] ?? 'rest';
    let act = ACTIVITY_MAP[id];
    if (!act) throw new Error('알 수 없는 활동: ' + id);
    let autonomous = false;
    if (id === 'autonomy') {
      autonomous = true;
      s.counters.autonomy++;
      applyEffects(s, { trust: +3, 'pers.agree': +1, stress: -4 });
      const prefs = autonomyPreferences(s.personality);
      id = weightedPick(r, prefs, []);
      act = ACTIVITY_MAP[id];
      if (act.minAge && s.age < act.minAge) { id = 'outing'; act = ACTIVITY_MAP[id]; }
      lines.push(`[자율] ${josa(s.name,'은')} 스스로 「${act.name}」을(를) 택했다.`);
      // 숨은 이벤트 플래그: 몰래 모험 등
      if (id === 'adventure' && r.chance(0.5)) s.flags.secret_adventure = true;
      if (id === 'graveyard') s.flags.secret_night_work = true;
    }
    if (act.minAge && s.age < act.minAge) { lines.push(`${act.name}은(는) 아직 나이가 어려 받아주지 않았다. 대신 쉬었다.`); id = 'rest'; act = ACTIVITY_MAP.rest; }

    // 숙련도
    s.mastery[id] = (s.mastery[id] || 0) + 1;
    const level = masteryLevel(s.mastery[id]);
    let mult = stage.eff * effMult * (1 + 0.1 * (level - 1));
    if (act.type === 'edu') {
      const cat = STATS.find(st => st.id === Object.keys(act.stat)[0])?.cat;
      if (cat === g.bonusCat) mult *= 1.15;
    }
    // 랜덤 요동 ±15%
    mult *= 0.85 + r.next() * 0.3;

    for (const [st, v] of Object.entries(act.stat)) addStat(s, st, v * mult);
    if (act.pers) for (const [k, v] of Object.entries(act.pers)) s.personality[k] = clamp(s.personality[k] + v, -100, 100);
    if (act.rel) for (const [k, v] of Object.entries(act.rel)) s.relations[k] = clamp(s.relations[k] + v, 0, 100);
    s.stress = clamp(s.stress + act.stress * (s.stress >= 60 ? 1.1 : 1), 0, 100);
    if (act.rep && r.chance(0.5)) s.reputation = clamp(s.reputation + act.rep, 0, 100);
    s.gold += act.gold;
    if (act.gold > 0 && act.type === 'work') s.gold += Math.round(level * 5 + (g.workBonus ? act.gold * g.workBonus : 0)); // 숙련·출신 보너스
    if (act.id === 'adventure') {
      s.counters.adventures = (s.counters.adventures || 0) + 1;
      if (r.chance(0.25)) { const loot = Math.round(r.int(30, 120) * (g.adventureBonus ? 1.5 : 1)); s.gold += loot; lines.push(`모험에서 보물을 찾았다! (+${loot}G)`); }
      if (r.chance(g.adventureBonus ? 0.075 : 0.15)) { applyEffects(s, { stress: +10, 'stat.hp': -5 }); lines.push('모험 중 다쳤다. (체력 -5)'); }
    }
    if (act.id === 'graveyard' && r.chance(0.2)) { applyEffects(s, { infamy: +3 }); lines.push('밤에 수상한 사람들과 마주쳤다. 소문이 돈다. (악평 +3)'); }
    executed.push({ slot: i, id, autonomous, level });
  }

  // 소지품의 매달 효과 (GDD 4.5 의상·소품)
  for (const [itemId, n] of Object.entries(s.items)) {
    const it = ITEM_MAP[itemId];
    if (n > 0 && it?.monthly) applyEffects(s, it.monthly);
  }
  if (g.stressRelief) s.stress = clamp(s.stress - g.stressRelief, 0, 100);
  // 고정비·연금
  s.gold += g.pension - FOOD_COST;
  if (s.gold < 0) {
    lines.push('돈이 모자라 끼니를 줄였다. (체력 -4, 스트레스 +6)');
    applyEffects(s, { 'stat.hp': -4, stress: +6 });
    s.gold = Math.max(s.gold, -200);
  }
  // 보호자 건강: 아이가 아르바이트 없이 지출만 크면 과로
  const workCount = executed.filter(e => ACTIVITY_MAP[e.id].type === 'work').length;
  s.guardianHealth = clamp(s.guardianHealth + (workCount === 0 ? -2 : +1), 0, 100);

  // 스트레스 100 → 탈진
  if (s.stress >= 100) {
    s.flags._collapsed = true; s.counters.collapses++;
    applyEffects(s, { trust: -6, 'stat.hp': -8 });
    lines.push(`${josa(s.name,'이')} 쓰러졌다. 열이 나고 며칠을 앓았다. (신뢰 -6, 체력 -8)`);
    s.stress = 70;
  }

  // 이벤트 선정
  const events = pickEvents(s, r, executed);
  s.pendingEvents = events.map(e => e.id);
  if (events.length === 0) s.counters.quietMonths++; else s.counters.quietMonths = 0;

  s.counters.months++;
  s.history.push({ age: s.age, month: s.month, slots: executed.map(e => e.id), auto: executed.filter(e => e.autonomous).length, stress: s.stress, trust: s.trust, sum: statSum(s) });
  saveRng(s, r);
  return { lines, executed, before, after: { stats: { ...s.stats }, gold: s.gold, stress: s.stress, trust: s.trust, pers: { ...s.personality } }, events: events.map(e => e.id) };
}

export function masteryLevel(count) { return Math.min(5, 1 + Math.floor((count || 0) / 4)); }
export function statSum(s) { return Object.values(s.stats).reduce((a, b) => a + b, 0); }

function weightedPick(r, weights, exclude) {
  const entries = Object.entries(weights).filter(([k, v]) => v > 0 && !exclude.includes(k));
  const total = entries.reduce((a, [, v]) => a + v, 0);
  let x = r.next() * total;
  for (const [k, v] of entries) { x -= v; if (x <= 0) return k; }
  return entries[entries.length - 1][0];
}

export function eligibleEvents(s, slotIds = []) {
  const guardianCapped = s.counters.events >= 10 && (s.guardianEvents || 0) / s.counters.events >= GUARDIAN_EVENT_CAP;
  return EVENTS.filter(ev => {
    if (ev.chainOnly) return false;
    if (ev.guardian && guardianCapped) return false;
    if (s.seen[ev.id] && !ev.repeatable) return false;
    if (ev.age && (s.age < ev.age[0] || s.age > ev.age[1])) return false;
    if (ev.season && ev.season !== s.season) return false;
    if (ev.month && ev.month !== s.month) return false;
    if (ev.requiresActivity && !(Array.isArray(ev.requiresActivity) ? ev.requiresActivity.some(a => slotIds.includes(a)) : slotIds.includes(ev.requiresActivity))) return false;
    return evalAll(s, ev.conditions);
  });
}

function pickEvents(s, r, executed) {
  const eligible = eligibleEvents(s, executed.map(e => e.id));
  const fixed = eligible.filter(e => e.fixed);
  const pool = eligible.filter(e => !e.fixed);
  const out = [...fixed];
  // 월 1.5회 밀도 목표: 조용한 달 다음 달은 100%
  const D = EVENT_DENSITY;
  const w = Object.fromEntries(pool.map(e => [e.id, e.weight ?? 1]));
  const draw = () => { const keys = Object.keys(w); if (!keys.length) return; const id = weightedPick(r, w, []); delete w[id]; out.push(EVENT_MAP[id]); };
  if (pool.length && r.chance(s.counters.quietMonths >= 1 ? 1.0 : D.base)) {
    draw();
    if (r.chance(D.second)) draw();
    if (r.chance(D.third)) draw();
  }
  return out.slice(0, D.max);
}

// ──────────────────────────────────────────────────────────────────────
// 4) 이벤트 진행
// ──────────────────────────────────────────────────────────────────────
export function currentEvent(s) {
  const id = s.pendingEvents[0];
  return id ? renderEvent(s, EVENT_MAP[id]) : null;
}

export function renderEvent(s, ev) {
  const fill = (t) => typeof t === 'function' ? t(s) : fillName(t, s.name, GUARDIANS[s.guardian]?.call);
  return {
    id: ev.id, title: fill(ev.title), text: fill(ev.text), image: ev.image || null, npc: ev.npc || null,
    choices: ev.choices.filter(c => evalAll(s, c.conditions)).map((c, i) => ({ index: ev.choices.indexOf(c), label: fill(c.label), minigame: c.minigame || null,
      check: c.check ? { stat: c.check.stat, dc: c.check.dc, value: (s.stats[c.check.stat] ?? 0) + (c.check.bonus ? c.check.bonus(s) : 0) } : null,
      hint: c.check ? `판정: ${STATS.find(x => x.id === c.check.stat)?.name ?? c.check.stat}${c.minigame ? ' · 미니게임' : ''}` : null })),
  };
}

// opts.mgScore: 미니게임 결과(0~1). 주어지면 판정 주사위(±60)를 대체한다. 없으면 자동 해결(무작위).
export function chooseEvent(s, eventId, choiceIndex, opts = {}) {
  const ev = EVENT_MAP[eventId];
  if (!ev) throw new Error('없는 이벤트: ' + eventId);
  const choice = ev.choices[choiceIndex];
  if (!choice) throw new Error('없는 선택지');
  const r = rngOf(s);
  s.seen[ev.id] = (s.seen[ev.id] || 0) + 1;
  s.counters.events++;
  if (ev.guardian) s.guardianEvents = (s.guardianEvents || 0) + 1;
  s.pendingEvents = s.pendingEvents.filter(id => id !== eventId);
  let outcome, effects;
  if (choice.check) {
    const val = (s.stats[choice.check.stat] ?? 0) + (choice.check.bonus ? choice.check.bonus(s) : 0);
    const swing = typeof opts.mgScore === 'number' ? Math.round((clamp(opts.mgScore, 0, 1) - 0.5) * 120) : r.int(-60, 60);
    const roll = val + swing;
    const ok = roll >= choice.check.dc;
    outcome = ok ? choice.success : choice.fail;
  } else outcome = choice;
  effects = outcome.effects || {};
  applyEffects(s, effects);
  if (outcome.next) s.pendingEvents.unshift(outcome.next);
  saveRng(s, r);
  const fill = (t) => typeof t === 'function' ? t(s) : fillName(t, s.name, GUARDIANS[s.guardian]?.call);
  return { text: fill(outcome.result || ''), effects, success: choice.check ? outcome === choice.success : null, next: outcome.next || null };
}

// ──────────────────────────────────────────────────────────────────────
// 5) 월 종료 → 다음 달 / 생일 / 엔딩
// ──────────────────────────────────────────────────────────────────────
export function endMonth(s) {
  if (s.pendingEvents.length) throw new Error('처리되지 않은 이벤트가 있습니다.');
  const res = { birthday: false, finished: false };
  // 자연 회복
  s.stress = clamp(s.stress - 6, 0, 100);
  s.month++;
  if (s.month > 12) {
    s.month = 1; s.age++;
    res.birthday = true;
    res.report = yearReport(s);
    s.stress = clamp(s.stress - 15, 0, 100);
    // 연간 성격 드리프트: 능력치 패턴이 성격을 조금 끌어당긴다
    const p = s.personality, st = s.stats;
    if (st.str + st.agi > st.cult + st.eti) p.agree = clamp(p.agree - 2, -100, 100);
    if (st.eti + st.cult > 400) p.ambit = clamp(p.ambit + 2, -100, 100);
    if (st.sens > st.int) p.roman = clamp(p.roman + 2, -100, 100); else p.roman = clamp(p.roman - 1, -100, 100);
    if (st.faith + st.moral > 300) p.good = clamp(p.good + 2, -100, 100);
    if (s.infamy > 30) p.good = clamp(p.good - 3, -100, 100);
    s.stage = stageOf(s.age).id;
    s.persHistory.push({ age: s.age, ...s.personality });
    if (s.age >= END_AGE) { s.finished = true; s.ending = computeEnding(s); res.finished = true; }
    else res.annual = annualDecision(s);
  }
  s.season = SEASONS[s.month - 1];
  return res;
}

// ──────────────────────────────────────────────────────────────────────
// 연간 보호자 결정 (GDD 2: 1년에 1번 큰 방향 결정)
// ──────────────────────────────────────────────────────────────────────
export function annualDecision(s) {
  const a = ANNUAL[s.age];
  if (!a) return null;
  const fill = (t) => typeof t === 'function' ? t(s) : fillName(t, s.name, GUARDIANS[s.guardian]?.call);
  return { age: s.age, title: fill(a.title), text: fill(a.text), image: a.image || null,
    options: a.options.map((o, i) => ({ index: i, label: fill(o.label), desc: fill(o.desc || ''), available: evalAll(s, o.conditions) })).filter(o => o.available) };
}
export function applyAnnual(s, optionIndex) {
  const a = ANNUAL[s.age];
  if (!a) throw new Error('이 나이에는 연간 결정이 없습니다.');
  const o = a.options[optionIndex];
  if (!o || !evalAll(s, o.conditions)) throw new Error('선택할 수 없는 연간 결정');
  applyEffects(s, o.effects);
  s.annualLog.push({ age: s.age, id: o.id ?? String(optionIndex), label: typeof o.label === 'string' ? o.label : String(optionIndex) });
  const fill = (t) => typeof t === 'function' ? t(s) : fillName(t, s.name, GUARDIANS[s.guardian]?.call);
  return { text: fill(o.result || ''), effects: o.effects || {} };
}

// ──────────────────────────────────────────────────────────────────────
// 상점 (GDD 4.5)
// ──────────────────────────────────────────────────────────────────────
export function shopList(s) {
  return ITEMS.filter(it => (!it.minAge || s.age >= it.minAge) && evalAll(s, it.conditions)).map(it => ({ ...it, owned: s.items[it.id] || 0, affordable: s.gold >= it.price, soldOut: it.unique && (s.items[it.id] || 0) > 0 }));
}
export function buyItem(s, itemId) {
  const it = ITEM_MAP[itemId];
  if (!it) throw new Error('없는 아이템: ' + itemId);
  if (it.minAge && s.age < it.minAge) throw new Error('아직 살 수 없는 나이');
  if (!evalAll(s, it.conditions)) throw new Error('구매 조건 불충족');
  if (it.unique && (s.items[itemId] || 0) > 0) throw new Error('이미 가지고 있음');
  if (s.gold < it.price) throw new Error('돈이 부족함');
  s.gold -= it.price;
  s.items[itemId] = (s.items[itemId] || 0) + 1;
  if (it.onBuy) applyEffects(s, it.onBuy);
  return { item: it };
}

function yearReport(s) {
  const yr = s.history.filter(h => h.age === s.age - 1);
  const counts = {};
  yr.forEach(h => h.slots.forEach(id => counts[id] = (counts[id] || 0) + 1));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, n]) => ({ id, name: ACTIVITY_MAP[id].name, n }));
  const first = yr[0], last = yr[yr.length - 1];
  return { age: s.age - 1, top, autonomy: yr.reduce((a, h) => a + h.auto, 0), sumGain: (last?.sum ?? 0) - (first?.sum ?? 0), trust: s.trust, stress: s.stress };
}

// ──────────────────────────────────────────────────────────────────────
// 6) 엔딩 (GDD 4.8 / 7.3)
// ──────────────────────────────────────────────────────────────────────
export function scoreEndings(s) {
  const out = [];
  for (const e of ENDINGS) {
    const base = Object.entries(e.weights).reduce((a, [st, w]) => a + (s.stats[st] ?? 0) * w, 0);
    let pm = 1;
    if (e.pers) for (const [axis, coef] of Object.entries(e.pers)) pm += (s.personality[axis] / 100) * coef;
    pm = clamp(pm, 0.4, 1.8);
    const gate = evalAll(s, e.gates) ? 1 : 0;
    let bonus = 0;
    if (e.bonus) for (const b of e.bonus) if (evalAll(s, b.when)) bonus += b.add;
    out.push({ id: e.id, name: e.name, cat: e.cat, hidden: !!e.hidden, score: gate ? base * pm + bonus : 0, gate });
  }
  return out.sort((a, b) => b.score - a.score);
}

export function computeEnding(s) {
  const scored = scoreEndings(s);
  const hidden = ENDINGS.filter(e => e.hidden && evalAll(s, e.gates));
  const chosen = hidden.length ? scored.find(x => x.id === hidden[0].id) : scored.find(x => !x.hidden) ?? scored[0];
  const runner = scored.find(x => x.id !== chosen.id && !x.hidden && x.score > 0);
  const def = ENDINGS.find(e => e.id === chosen.id);
  return { id: chosen.id, name: chosen.name, cat: chosen.cat, hidden: chosen.hidden, runnerUp: runner ? { id: runner.id, name: runner.name } : null,
    epilogue: typeof def.epilogue === 'function' ? def.epilogue(s) : fillName(def.epilogue, s.name, GUARDIANS[s.guardian]?.call),
    persHistory: s.persHistory, annualLog: s.annualLog,
    lastWords: lastDialogue(s), top: scored.slice(0, 5).map(x => ({ id: x.id, name: x.name, score: Math.round(x.score) })) };
}

// 8년의 기록으로 만드는 '마지막 대화' (GDD 5.2)
export function lastDialogue(s) {
  const L = [];
  const g = GUARDIANS[s.guardian]?.call ?? '아빠';
  const name = s.name;
  const first300 = s.milestones.find(m => m.th === 300);
  const statName = (id) => STATS.find(x => x.id === id).name;
  const seasonOf = (m) => ({ spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' })[SEASONS[m - 1]];
  if (first300) L.push(`"${g}, 기억나? 내가 ${first300.age}살 ${seasonOf(first300.month)}에 처음으로 ${statName(first300.stat)}이(가) 눈에 띄게 늘었던 거. 그때 ${g}가 웃어줬잖아."`);
  const counts = {};
  s.history.forEach(h => h.slots.forEach(id => counts[id] = (counts[id] || 0) + 1));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (top) L.push(`"8년 동안 제일 많이 한 건 ${ACTIVITY_MAP[top[0]].name}이었어. ${top[1]}번. 세어 봤어."`);
  const c = s.counters;
  if (c.forced >= 6) L.push(`"솔직히 말하면, 하고 싶지 않다고 했을 때 그냥 하라고 한 게 ${c.forced}번이야. 그땐 미웠어. 지금은… 조금 알 것 같아."`);
  else if (c.refusals > 0 && c.forced <= 1) L.push(`"내가 싫다고 했을 때 ${g}는 거의 항상 들어줬어. 그게 얼마나 큰 일인지 이제 알아."`);
  if (c.autonomy >= 12) L.push(`"나한테 맡겨 준 날들이 ${c.autonomy}번. 그 날들에 내가 누군지 알게 됐어."`);
  else if (c.autonomy === 0) L.push(`"한 번도 내 마음대로 해 본 적이 없었다는 거, ${g}는 알아?"`);
  if (c.collapses >= 2) L.push(`"쓰러진 적이 ${c.collapses}번. 그때마다 ${g}가 밤새 옆에 있었던 거, 큐브가 말해줬어."`);
  if (s.trust >= 80) L.push(`"그래도 난 ${g}를 믿어. 처음부터, 지금까지."`);
  else if (s.trust < 40) L.push(`"우리, 좀 더 이야기했어야 했어. 이제라도 하자."`);
  L.push(`"고마워. 별에서 떨어진 날, 나를 주워 준 사람이 ${g}여서."`);
  return L;
}

// 직렬화
export function serialize(s) { return JSON.stringify(s); }
export function deserialize(json) { return JSON.parse(json); }
export { ACTIVITIES, ACTIVITY_MAP, STATS, PERSONALITY, NPCS, ENDINGS, EVENTS, EVENT_MAP, ITEMS, ANNUAL };
