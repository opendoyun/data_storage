// 엔진 스모크 테스트: 결정성·불변식·DSL
import assert from 'node:assert/strict';
import { newGame, checkRefusals, resolveRefusal, runMonth, currentEvent, chooseEvent, endMonth, serialize, deserialize, scoreEndings, EVENTS, ENDINGS, ACTIVITY_MAP } from '../js/engine/engine.js';
import { evalCondition } from '../js/engine/conditions.js';

let passed = 0;
const t = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };
const ta = async (name, fn) => { try { await fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };

t('DSL 조건식', () => {
  const s = newGame({ seed: 1 }); s.stats.int = 300; s.flags.met_elda = true; s.personality.agree = -30;
  assert.equal(evalCondition(s, 'stat.int >= 300'), true);
  assert.equal(evalCondition(s, 'stat.int > 300'), false);
  assert.equal(evalCondition(s, 'flag.met_elda'), true);
  assert.equal(evalCondition(s, '!flag.nothing'), true);
  assert.equal(evalCondition(s, 'pers.agree <= -20'), true);
  assert.equal(evalCondition(s, "season == 'winter'"), true);
});
t('이벤트 데이터 무결성', () => {
  const ids = new Set(EVENTS.map(e => e.id));
  for (const e of EVENTS) {
    assert.ok(e.choices.length >= 1 && e.choices.length <= 4, e.id + ' 선택지 수');
    for (const c of e.choices) {
      for (const n of [c.next, c.success?.next, c.fail?.next]) if (n) assert.ok(ids.has(n), `${e.id} → 없는 next ${n}`);
      // 콘텐츠 계약 §7 효과 키: stat. pers. rel. flag. item. count. + 스칼라
      for (const eff of [c.effects, c.success?.effects, c.fail?.effects]) if (eff) for (const k of Object.keys(eff)) assert.ok(/^(stat|pers|rel|flag|item|count)\.\w+$|^(trust|gold|stress|infamy|reputation|gHealth)$/.test(k), `${e.id} 효과 키 ${k}`);
    }
  }
});
t('엔딩 데이터 무결성', () => {
  const s = newGame({ seed: 2 });
  for (const e of ENDINGS) { scoreEndings(s); assert.ok(e.epilogue, e.id); }
});
t('결정성: 같은 시드·같은 입력 → 같은 결과', () => {
  const play = () => { const s = newGame({ seed: 42 }); runMonth(s, ['school', 'farm', 'rest']); return serialize(s); };
  assert.equal(play(), play());
});
t('풀 플레이 8년 → 엔딩', () => {
  const s = newGame({ seed: 7 });
  let months = 0;
  while (!s.finished) {
    let slots = ['school', 'farm', months % 3 === 0 ? 'rest' : 'autonomy'];
    for (const p of checkRefusals(s, slots)) slots[p.slot] = resolveRefusal(s, p, 'persuade').finalActivity;
    runMonth(s, slots);
    while (s.pendingEvents.length) { const ev = currentEvent(s); chooseEvent(s, ev.id, ev.choices[0].index); }
    endMonth(s); months++;
  }
  assert.equal(months, 96);
  assert.equal(s.age, 18);
  assert.ok(s.ending && s.ending.name && s.ending.lastWords.length >= 2);
  for (const v of Object.values(s.stats)) assert.ok(v >= 0 && v <= 999);
  for (const v of Object.values(s.personality)) assert.ok(v >= -100 && v <= 100);
  assert.ok(s.stress >= 0 && s.stress <= 100);
});
t('직렬화 왕복', () => {
  const s = newGame({ seed: 3 }); runMonth(s, ['sword', 'inn', 'rest']);
  const s2 = deserialize(serialize(s)); assert.deepEqual(s2.stats, s.stats);
});
t('강행은 신뢰를 깎고 수용은 올린다', () => {
  const s = newGame({ seed: 5 }); const p = { slot: 0, activityId: 'school', alternative: 'rest', reason: 'defiant' };
  const t0 = s.trust; resolveRefusal(s, p, 'force'); assert.ok(s.trust < t0);
  const t1 = s.trust; resolveRefusal(s, p, 'accept'); assert.ok(s.trust > t1);
});
t('자율행동 슬롯은 실제 활동으로 치환', () => {
  const s = newGame({ seed: 9 }); const r = runMonth(s, ['autonomy', 'autonomy', 'autonomy']);
  assert.ok(r.executed.every(e => e.id !== 'autonomy' && ACTIVITY_MAP[e.id])); assert.equal(s.counters.autonomy, 3);
});

// ── 헤드리스 시뮬레이션 코어 (tools/sim-core.mjs · tools/reach.mjs) ─────────────────
const SC = await import('./sim-core.mjs');
const { eligibleEvents, renderEvent, EVENT_MAP, ANNUAL, ITEMS, STATS: STAT_DEFS } = await import('../js/engine/engine.js');
const { makeRng } = await import('../js/engine/rng.js');
const allConditionStrings = () => {
  const out = new Set();
  const add = (a) => { for (const c of a || []) if (typeof c === 'string') out.add(c); };
  for (const e of EVENTS) { add(e.conditions); for (const c of e.choices) add(c.conditions); }
  for (const e of ENDINGS) { add(e.gates); for (const b of e.bonus || []) add(b.when); }
  for (const a of Object.values(ANNUAL)) for (const o of a.options || []) add(o.conditions);
  for (const it of ITEMS) add(it.conditions);
  ['stat.int >= 300', '!flag.nothing', "season == 'winter'", 'flag.debt_garrett == false', 'count.adventures >= 1', 'item.diary >= 1', 'gHealth <= 50', 'legacyCount >= 1', 'playthrough >= 2', 'seen.fest_spring >= 1', '!stat.int >= 50'].forEach(x => out.add(x));
  return [...out];
};
t('sim-core: 컴파일 조건식 = evalCondition (전 데이터 조건 · 여러 상태)', () => {
  const states = [];
  SC.playGame('random', 11, { hooks: { afterRun: (s) => { if (s.month % 4 === 0) states.push(JSON.parse(JSON.stringify(s))); } } });
  states.push(newGame({ seed: 4, legacy: SC.makeLegacy(2), playthrough: 3 }));
  const conds = allConditionStrings();
  for (const s of states) for (const x of conds) assert.equal(SC.compileCondition(x).test(s), evalCondition(s, x), `${x} @ ${s.age}.${s.month}`);
});
t('sim-core: eventEligible = engine.eligibleEvents (한 판 전체)', () => {
  SC.playGame('hands_off', 21, { hooks: { afterRun: (s, rep) => {
    const ids = rep.executed.map(e => e.id), capped = SC.guardianCapped(s);
    const mine = EVENTS.filter(ev => SC.eventEligible(ev, s, ids, capped)).map(e => e.id).sort();
    assert.deepEqual(mine, eligibleEvents(s, ids).map(e => e.id).sort(), `${s.age}.${s.month}`);
  } } });
});
t('sim-core: 판정 성공 확률 = 주사위 전수 계산', () => {
  for (const val of [0, 100, 159.5, 200, 260, 400]) for (const dc of [150, 200, 220, 320]) {
    let ok = 0; for (let k = -60; k <= 60; k++) if (val + k >= dc) ok++;
    assert.ok(Math.abs(SC.checkProb({ stats: { int: val } }, { stat: 'int', dc }, null, undefined) - ok / 121) < 1e-9, `${val} vs ${dc}`);
    assert.equal(SC.checkProb({ stats: { int: val } }, { stat: 'int', dc }, 'exam', 0.7), val + 24 >= dc ? 1 : 0);
  }
});
t('sim-core: playGame 결정성 + 일반 정책 10종 완주', () => {
  for (const p of SC.GENERAL_POLICIES) {
    const a = SC.playGame(p, 77), b = SC.playGame(p, 77);
    assert.equal(a.ending.id, b.ending.id, p); assert.deepEqual(a.stats, b.stats, p); assert.equal(a.counters.months, 96, p);
  }
  const c = SC.playGame('seek:' + ENDINGS[0].id, 5), d = SC.playGame('seek:' + ENDINGS[0].id, 5);
  assert.deepEqual([c.ending.id, c.stats, c.counters], [d.ending.id, d.stats, d.counters]);
  const noShop = SC.playGame('random', 3, { shop: false });
  assert.equal(Object.values(noShop.items).reduce((a, b) => a + b, 0), 0);
});
t('sim-core: seek 정책이 실제로 목표를 노린다 (전 엔딩 1판씩, 성공 ≥ 60%)', () => {
  let ok = 0;
  for (const e of ENDINGS) {
    const s = SC.playGame('seek:' + e.id, 1);
    const d = SC.seekDiagnosis(e.id, s);
    assert.equal(d.success, s.ending.id === e.id, e.id);
    if (!d.success) assert.ok(['gate', 'hidden', 'outscored'].includes(d.reason), e.id);
    if (d.success) ok++;
  }
  assert.ok(ok / ENDINGS.length >= 0.6, `seek 성공 ${ok}/${ENDINGS.length}`);
});
t('sim-core: 연간 결정 처리 + seek가 필요한 플래그를 주는 선택지를 고름 (임시 데이터)', () => {
  // 실제 ANNUAL 내용과 무관하게: 11세 결정만 시험용으로 바꿔 끼우고, 나머지 나이는 있는 그대로 둔다
  const had = ANNUAL[11];
  ANNUAL[11] = { title: '시험', text: '시험용 연간 결정', options: [
    { id: 'plain', label: '평범', effects: { 'stat.hp': 1 } },
    { id: 'key', label: '열쇠', effects: { 'flag.__annual_key': true } },
  ] };
  ENDINGS.push({ id: '__annual_test', name: '시험', cat: '관계', weights: { hp: 5 }, pers: {}, gates: ['flag.__annual_key'], bonus: [], epilogue: '시험' });
  SC.resetCaches();
  try {
    const ages = Object.keys(ANNUAL).map(Number).filter(a => a >= 11 && a <= 17);
    const g = SC.playGame('random', 2);
    assert.equal(g._sim.annual, g.annualLog.length);
    assert.ok(g.annualLog.length >= 1 && g.annualLog.length <= ages.length, `연간 결정 ${g.annualLog.length}회 (나이 ${ages.length}개)`);
    assert.ok(g.annualLog.some(x => x.age === 11), '11세 결정이 기록됨');
    assert.deepEqual(g.annualLog.map(x => x.age), [...g.annualLog.map(x => x.age)].sort((a, b) => a - b), '나이 순서');
    const s = SC.playGame('seek:__annual_test', 2);
    assert.equal(s.annualLog.find(x => x.age === 11)?.id, 'key'); assert.equal(s.ending.id, '__annual_test');
  } finally {
    ENDINGS.pop(); if (had) ANNUAL[11] = had; else delete ANNUAL[11]; SC.resetCaches();
  }
});
t('sim-core: seek는 미니게임 판정에 mgScore를 넘긴다 (임시 이벤트)', () => {
  const ev = { id: '__mg_test', title: '시험', text: '시험', age: [10, 17], choices: [
    { label: '미니게임', check: { stat: 'int', dc: 40 }, minigame: 'exam', success: { effects: { 'stat.int': 30 } }, fail: { effects: {} } },
    { label: '그냥', effects: { stress: 5 } },
  ] };
  EVENT_MAP[ev.id] = ev;
  try {
    const s = newGame({ seed: 8 });
    const P = SC.makePolicy('seek:' + ENDINGS.find(e => e.weights.int).id);
    P.beforeMonth(s);
    const d = P.event(s, renderEvent(s, ev), makeRng(1));
    assert.equal(d.index, 0); assert.equal(d.mgScore, SC.DEFAULT_SEEK_MG);
    const g = SC.makePolicy('random').event(s, renderEvent(s, ev), makeRng(1));
    assert.equal(g.mgScore, undefined);
  } finally { delete EVENT_MAP[ev.id]; }
});
t('sim-core: 회차 조건이 필요한 목표는 그 회차로 시작한다', () => {
  ENDINGS.push({ id: '__legacy_test', name: '시험', cat: '히든', hidden: true, weights: { hp: 1 }, pers: {}, gates: ['legacyCount >= 2'], bonus: [], epilogue: '시험' });
  SC.resetCaches();
  try {
    const s = SC.playGame('seek:__legacy_test', 3);
    assert.ok(s.legacy.length >= 2 && s.playthrough >= 3); assert.equal(s.ending.id, '__legacy_test');
  } finally { ENDINGS.pop(); SC.resetCaches(); }
});
t('sim-core: 함수 조건 — toString이 DSL이면 그 문자열로 계획·진단, 판정은 언제나 함수', () => {
  const origin = (g) => Object.assign((s) => s.guardian === g, { toString: () => `guardian == '${g}'` });
  const c = SC.compileCondition(origin('merchant'));
  assert.equal(c.opaque, false); assert.equal(c.label, "guardian == 'merchant'"); assert.equal(c.path, 'guardian');
  assert.equal(c.test({ guardian: 'merchant' }), true); assert.equal(c.test({ guardian: 'knight' }), false);
  const lie = SC.compileCondition(Object.assign(() => false, { toString: () => 'flag.always' }));   // 라벨이 거짓이어도 판정은 함수
  assert.equal(lie.test({ flags: { always: true } }), false);
  const plain = SC.compileCondition((s) => s.age > 12);
  assert.equal(plain.opaque, true); assert.equal(plain.label, '(함수 조건)'); assert.equal(plain.test({ age: 13 }), true);
  const arr = ['stat.int >= 1', origin('knight')];
  assert.equal(SC.compileAll(arr), SC.compileAll(arr), '같은 배열은 한 번만 컴파일'); assert.equal(SC.compileAll(undefined).length, 0);
});
t('sim-core: 판정 목표치는 check.bonus를 뺀다 (주사위 dc+40 · 미니게임 고정 swing+5)', () => {
  const s = { stats: { str: 0, agi: 100 } };
  const ch = { stat: 'str', dc: 290, bonus: (x) => x.stats.agi * 0.2 };
  assert.equal(SC.checkNeed(ch, false, s, 0.7), 290 + 40 - 20);
  assert.equal(SC.checkNeed(ch, true, s, 0.7), 290 - 24 + 5 - 20);
  assert.equal(SC.checkNeed({ stat: 'int', dc: 200 }, true, s, null), 240);   // 미니게임 점수 없음 = 주사위
});
t('sim-core: 회차 요구는 게이트만, 플래그는 공급자 중 가장 쉬운 길로 본다 (임시 데이터)', () => {
  const evs = [
    { id: '__meta_hard', title: '시험', text: '시험', age: [10, 17], conditions: ['playthrough >= 3'], choices: [{ label: '가', effects: { 'flag.__meta_f': true } }] },
    { id: '__meta_easy', title: '시험', text: '시험', age: [10, 17], conditions: ['stat.int >= 50'], choices: [{ label: '가', effects: { 'flag.__meta_f': true } }] },
    { id: '__meta_only', title: '시험', text: '시험', age: [10, 17], conditions: ['legacyCount >= 1'], choices: [{ label: '가', effects: { 'flag.__meta_g': true } }] },
  ];
  const ends = [
    { id: '__meta_a', name: '시험', cat: '관계', weights: { hp: 1 }, pers: {}, gates: ['flag.__meta_f'], bonus: [{ when: ['legacyCount >= 2'], add: 999 }], epilogue: '시험' },
    { id: '__meta_b', name: '시험', cat: '관계', weights: { hp: 1 }, pers: {}, gates: ['flag.__meta_g'], bonus: [], epilogue: '시험' },
  ];
  EVENTS.push(...evs); for (const e of evs) EVENT_MAP[e.id] = e; ENDINGS.push(...ends); SC.resetCaches();
  try {
    assert.deepEqual(SC.makePolicy('seek:__meta_a').newGame(1), {}, '쉬운 공급자가 있으면 1회차, 보너스의 회차 조건은 무시');
    const g = SC.makePolicy('seek:__meta_b').newGame(1);
    assert.equal(g.playthrough, 2); assert.equal(g.legacy.length, 1);
  } finally {
    EVENTS.splice(EVENTS.length - evs.length, evs.length); for (const e of evs) delete EVENT_MAP[e.id];
    ENDINGS.splice(ENDINGS.length - ends.length, ends.length); SC.resetCaches();
  }
});
t('sim-core: 출신 전용 경로뿐인 게이트는 그 출신으로 시작한다 (임시 데이터)', () => {
  const origin = (g) => Object.assign((s) => s.guardian === g, { toString: () => `guardian == '${g}'` });
  const evs = [
    { id: '__g_root', title: '시험', text: '시험', age: [10, 17], conditions: [origin('priest')], choices: [{ label: '가', effects: { 'flag.__g_mid': true } }] },
    { id: '__g_next', title: '시험', text: '시험', age: [10, 17], conditions: ['flag.__g_mid'], choices: [{ label: '가', conditions: ["guardian != 'knight'"], effects: { 'flag.__g_f': true } }] },
  ];
  const ends = [
    { id: '__g_end', name: '시험', cat: '관계', weights: { hp: 1 }, pers: {}, gates: ['flag.__g_f'], bonus: [], epilogue: '시험' },
    { id: '__g_free', name: '시험', cat: '관계', weights: { hp: 1 }, pers: {}, gates: ['flag.__g_nowhere'], bonus: [], epilogue: '시험' },
  ];
  EVENTS.push(...evs); for (const e of evs) EVENT_MAP[e.id] = e; ENDINGS.push(...ends); SC.resetCaches();
  try {
    const r = makeRng(1);
    assert.equal(SC.makePolicy('seek:__g_end').guardian(r, 1), 'priest');
    assert.equal(SC.makePolicy('seek:__g_end', { guardians: ['knight', 'priest'] }).guardian(r, 1), 'priest');
    assert.ok(['knight', 'scholar'].includes(SC.makePolicy('seek:__g_free').guardian(r, 1)), '세우는 곳 없는 플래그는 출신 탓이 아님');
  } finally {
    EVENTS.splice(EVENTS.length - evs.length, evs.length); for (const e of evs) delete EVENT_MAP[e.id];
    ENDINGS.splice(ENDINGS.length - ends.length, ends.length); SC.resetCaches();
  }
});
await ta('reach: 커버리지 표본은 보호자 5종·회차 2~4를 돌고, seek 시드는 엔딩 id로 정해진다', async () => {
  const R = await import('./reach.mjs');
  const { GUARDIANS } = await import('../js/engine/engine.js');
  const tasks = R.buildTasks({ K: 2, N: 10, legacy: 30, seed: 5 });
  const L = tasks.filter(x => x.kind === 'legacy');
  assert.deepEqual([...new Set(L.map(x => x.opts.guardian))].sort(), Object.keys(GUARDIANS).sort());
  for (const g of Object.keys(GUARDIANS)) assert.ok(new Set(L.filter(x => x.opts.guardian === g).map(x => x.policy)).size >= 3, `${g}: 정책이 한쪽으로 쏠림`);
  const pts = [...new Set(L.map(x => x.opts.newGame.playthrough))].sort();
  assert.ok(pts.includes(2) && pts.includes(4), `회차 ${pts}`);
  for (const x of L) assert.equal(x.opts.newGame.legacy.length, Math.min(5, x.opts.newGame.playthrough - 1));
  const seek = tasks.filter(x => x.policy.startsWith(SC.SEEK_PREFIX));
  for (const x of seek) { const id = x.policy.slice(SC.SEEK_PREFIX.length); assert.ok(x.seed - 5 - R.seekSeedBase(id) >= 0 && x.seed - 5 - R.seekSeedBase(id) < 2, id); }
  const only = R.buildTasks({ K: 2, N: 0, legacy: 0, seed: 5, only: [ENDINGS[3].id] });
  assert.deepEqual(only.map(x => x.seed), seek.filter(x => x.policy === SC.SEEK_PREFIX + ENDINGS[3].id).map(x => x.seed), '--only여도 같은 시드');
});
await ta('reach: 집계는 워커 수와 무관 + 보고서 렌더링', async () => {
  const R = await import('./reach.mjs');
  const only = [ENDINGS[0].id, ENDINGS[ENDINGS.length - 1].id];
  const base = { K: 2, N: 20, legacy: 4, only, quiet: true };
  const a = await R.runReach({ ...base, workers: 1 }), b = await R.runReach({ ...base, workers: 2 });
  const strip = (r) => JSON.stringify({ ...r, summary: { ...r.summary, params: { ...r.summary.params, wallMs: 0, cpuMs: 0, workers: 0 } } });
  assert.equal(strip(a), strip(b));
  assert.equal(a.summary.games.seek, 4); assert.equal(a.summary.games.general, 20); assert.equal(a.summary.games.legacy, 4);
  assert.equal(a.reach.length, ENDINGS.length);
  const md = R.renderMarkdown(a);
  for (const h of ['## 1. 엔딩 도달 가능성', '## 2. 엔딩 분포', '## 3. 이벤트 밀도', '## 4. 이벤트 커버리지']) assert.ok(md.includes(h), h);
});

console.log(`\n${passed} 테스트 통과${process.exitCode ? ' (실패 있음)' : ''}`);
