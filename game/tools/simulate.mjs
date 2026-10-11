#!/usr/bin/env node
// 헤드리스 밸런스 시뮬레이터 (GDD 7.3): N회 자동 플레이 → 엔딩 분포·지표 출력
// 사용: node tools/simulate.mjs [games=2000] [seed=1] [--csv=out.csv]
import { newGame, checkRefusals, resolveRefusal, runMonth, currentEvent, chooseEvent, endMonth, ACTIVITIES, STATS, EVENTS } from '../js/engine/engine.js';
const EVENT_MAP = Object.fromEntries(EVENTS.map(e => [e.id, e]));
import { makeRng } from '../js/engine/rng.js';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const N = Number(args.find(a => /^\d+$/.test(a)) ?? 2000);
const seed0 = Number(args.filter(a => /^\d+$/.test(a))[1] ?? 1);
const csvPath = (args.find(a => a.startsWith('--csv=')) || '').slice(6);

const CATS = { body: ['sword', 'farm', 'smith', 'adventure'], mind: ['school', 'magic', 'commerce', 'shop'], social: ['etiquette', 'inn', 'castle', 'theater', 'outing'], inner: ['art', 'theology', 'church', 'sewing'] };
const POLICIES = ['random', 'focus_body', 'focus_mind', 'focus_social', 'focus_inner', 'balanced', 'hands_off', 'tyrant', 'shadow', 'nurture'];

function pickSlots(policy, s, r) {
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
}

function playGame(seed, policy) {
  const r = makeRng(seed * 7919 + 13);
  const s = newGame({ seed, guardian: r.chance(0.5) ? 'knight' : 'scholar' });
  while (!s.finished) {
    let slots = pickSlots(policy, s, r);
    const props = checkRefusals(s, slots);
    for (const p of props) {
      const d = policy === 'tyrant' ? 'force' : (policy === 'hands_off' || policy === 'nurture') ? 'accept' : r.pick(['accept', 'persuade', 'force']);
      slots[p.slot] = resolveRefusal(s, p, d).finalActivity;
    }
    runMonth(s, slots);
    let guard = 0;
    while (s.pendingEvents.length && guard++ < 20) {
      const ev = currentEvent(s);
      if (!ev.choices.length) { s.pendingEvents.shift(); continue; }
      let pick = r.pick(ev.choices).index;
      if (policy === 'shadow' || policy === 'nurture') {
        const raw = EVENT_MAP[ev.id].choices;
        const score = (c) => { const e = { ...(c.effects || {}), ...(c.success?.effects || {}) }; return policy === 'shadow' ? (e.infamy || 0) * 2 - (e['pers.good'] || 0) + (e.gold || 0) / 50 : (e.trust || 0) + (e['pers.agree'] || 0); };
        const best = ev.choices.map(c => ({ i: c.index, v: score(raw[c.index]) })).sort((a, b) => b.v - a.v)[0];
        if (best && r.chance(0.8)) pick = best.i;
      }
      chooseEvent(s, ev.id, pick);
    }
    endMonth(s);
  }
  return s;
}

const dist = {}, byPolicy = {}, rows = [];
let totRefusal = 0, totCollapse = 0, totEvents = 0, totAuto = 0, hidden = 0, sumStats = Object.fromEntries(STATS.map(x => [x.id, 0]));
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const policy = POLICIES[i % POLICIES.length];
  const s = playGame(seed0 + i, policy);
  const e = s.ending;
  dist[e.name] = (dist[e.name] || 0) + 1;
  byPolicy[policy] ??= {}; byPolicy[policy][e.name] = (byPolicy[policy][e.name] || 0) + 1;
  totRefusal += s.counters.refusals; totCollapse += s.counters.collapses; totEvents += s.counters.events; totAuto += s.counters.autonomy;
  if (e.hidden) hidden++;
  for (const k in sumStats) sumStats[k] += s.stats[k];
  rows.push([seed0 + i, policy, e.id, e.cat, s.trust, s.stress, s.gold, s.counters.refusals, s.counters.events, ...STATS.map(x => s.stats[x.id])].join(','));
}
const ms = Date.now() - t0;
console.log(`\n=== 별의 공주 밸런스 시뮬레이션: ${N}회, ${ms}ms (${(ms / N).toFixed(2)}ms/게임) ===\n`);
console.log('엔딩 분포 (점유율 20% 초과 시 ⚠):');
const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
for (const [name, n] of sorted) {
  const pct = n / N * 100;
  console.log(`  ${(pct > 20 ? '⚠ ' : '  ')}${name.padEnd(10, '　')} ${String(n).padStart(5)}  ${pct.toFixed(1)}%  ${'█'.repeat(Math.round(pct))}`);
}
console.log(`\n엔딩 종류 수: ${sorted.length} / 32   히든 도달: ${hidden} (${(hidden / N * 100).toFixed(2)}%)`);
console.log(`게임당 평균: 거부 ${(totRefusal / N).toFixed(1)}회, 탈진 ${(totCollapse / N).toFixed(2)}회, 이벤트 ${(totEvents / N).toFixed(1)}회, 자율 ${(totAuto / N).toFixed(1)}슬롯`);
console.log('18세 평균 능력치:', STATS.map(x => `${x.name} ${Math.round(sumStats[x.id] / N)}`).join(' · '));
console.log('\n정책별 상위 엔딩:');
for (const [p, d] of Object.entries(byPolicy)) {
  const top = Object.entries(d).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v}`).join(', ');
  console.log(`  ${p.padEnd(13)} ${top}`);
}
if (csvPath) {
  writeFileSync(csvPath, ['seed,policy,ending,cat,trust,stress,gold,refusals,events,' + STATS.map(x => x.id).join(','), ...rows].join('\n'));
  console.log('\nCSV 저장:', csvPath);
}
