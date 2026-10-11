// 엔진 스모크 테스트: 결정성·불변식·DSL
import assert from 'node:assert/strict';
import { newGame, checkRefusals, resolveRefusal, runMonth, currentEvent, chooseEvent, endMonth, serialize, deserialize, scoreEndings, EVENTS, ENDINGS, ACTIVITY_MAP } from '../js/engine/engine.js';
import { evalCondition } from '../js/engine/conditions.js';

let passed = 0;
const t = (name, fn) => { try { fn(); passed++; console.log('✓', name); } catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; } };

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
      for (const eff of [c.effects, c.success?.effects, c.fail?.effects]) if (eff) for (const k of Object.keys(eff)) assert.ok(/^(stat|pers|rel|flag)\.|^(trust|gold|stress|infamy|reputation|gHealth)$/.test(k), `${e.id} 효과 키 ${k}`);
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
console.log(`\n${passed} 테스트 통과${process.exitCode ? ' (실패 있음)' : ''}`);
