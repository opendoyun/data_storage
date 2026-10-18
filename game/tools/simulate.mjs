#!/usr/bin/env node
// 헤드리스 밸런스 시뮬레이터 (GDD 7.3): N회 자동 플레이 → 엔딩 분포·지표 출력
// 사용: node tools/simulate.mjs [games=2000] [seed=1] [--csv=out.csv] [--policy=<정책|seek:엔딩id>[,…]] [--no-shop]   (--help)
//   기본은 일반 정책 10종을 번갈아 플레이한다. 공용 플레이 로직은 tools/sim-core.mjs (reach.mjs와 공유).
//   엔딩 도달 가능성·이벤트 커버리지 보고서는 node tools/reach.mjs
import { STATS, ENDINGS } from '../js/engine/engine.js';
import { playGame, GENERAL_POLICIES, MONTHS_PER_GAME, SEEK_PREFIX } from './sim-core.mjs';
import { writeFileSync } from 'node:fs';

const USAGE = `사용: node tools/simulate.mjs [games=2000] [seed=1] [--policy=a,b|seek:<엔딩id>] [--csv=out.csv] [--no-shop]
  정책: ${GENERAL_POLICIES.join(' ')}  (또는 seek:<엔딩id>, 예: seek:pilgrim)`;
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) { console.log(USAGE); process.exit(0); }
const bad = args.filter(a => !/^\d+$/.test(a) && a !== '--no-shop' && !a.startsWith('--csv=') && !a.startsWith('--policy='));
if (bad.length) { console.error(`알 수 없는 인자: ${bad.join(' ')}\n${USAGE}`); process.exit(2); }
const nums = args.filter(a => /^\d+$/.test(a));
const N = Number(nums[0] ?? 2000);
const seed0 = Number(nums[1] ?? 1);
const csvPath = (args.find(a => a.startsWith('--csv=')) || '').slice(6);
const onlyPolicy = (args.find(a => a.startsWith('--policy=')) || '').slice(9);
const shop = !args.includes('--no-shop');
const POLICIES = onlyPolicy ? onlyPolicy.split(',').filter(Boolean) : GENERAL_POLICIES;
const badPol = POLICIES.filter(p => p.startsWith(SEEK_PREFIX) ? !ENDINGS.some(e => SEEK_PREFIX + e.id === p) : !GENERAL_POLICIES.includes(p));
if (badPol.length || !POLICIES.length) { console.error(`알 수 없는 정책: ${badPol.join(', ') || '(빈 목록)'}\n${USAGE}`); process.exit(2); }

// 터미널 표시 폭 기준 오른쪽 채움 (한글 2칸, ASCII 1칸)
const cols = (str) => [...str].reduce((a, ch) => a + (/[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/.test(ch) ? 2 : 1), 0);
const padCols = (str, w) => str + ' '.repeat(Math.max(0, w - cols(str)));
const dist = {}, byPolicy = {}, rows = [], errors = {};
let done = 0, totRefusal = 0, totCollapse = 0, totEvents = 0, totAuto = 0, hidden = 0, totAnnual = 0, totBought = 0;
const sumStats = Object.fromEntries(STATS.map(x => [x.id, 0]));
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const policy = POLICIES[i % POLICIES.length];
  let s;
  try { s = playGame(policy, seed0 + i, { shop }); }
  catch (e) { const k = String(e.message).split('\n')[0]; errors[k] = (errors[k] || 0) + 1; continue; }
  done++;
  const e = s.ending;
  dist[e.name] = (dist[e.name] || 0) + 1;
  byPolicy[policy] ??= {}; byPolicy[policy][e.name] = (byPolicy[policy][e.name] || 0) + 1;
  totRefusal += s.counters.refusals; totCollapse += s.counters.collapses; totEvents += s.counters.events; totAuto += s.counters.autonomy;
  totAnnual += s._sim.annual; totBought += s._sim.bought;
  if (e.hidden) hidden++;
  for (const k in sumStats) sumStats[k] += s.stats[k];
  rows.push([seed0 + i, policy, e.id, e.cat, s.trust, s.stress, s.gold, s.counters.refusals, s.counters.events, ...STATS.map(x => s.stats[x.id])].join(','));
}
const ms = Date.now() - t0;
const D = done || 1;
console.log(`\n=== 별의 공주 밸런스 시뮬레이션: ${N}회, ${ms}ms (${(ms / N).toFixed(2)}ms/게임) ===\n`);
console.log('엔딩 분포 (점유율 20% 초과 시 ⚠):');
const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
for (const [name, n] of sorted) {
  const pct = n / D * 100;
  console.log(`  ${(pct > 20 ? '⚠ ' : '  ')}${padCols(name, 20)} ${String(n).padStart(5)}  ${pct.toFixed(1).padStart(5)}%  ${'█'.repeat(Math.round(pct))}`);
}
console.log(`\n엔딩 종류 수: ${sorted.length} / ${ENDINGS.length}   히든 도달: ${hidden} (${(hidden / D * 100).toFixed(2)}%)`);
console.log(`게임당 평균: 거부 ${(totRefusal / D).toFixed(1)}회, 탈진 ${(totCollapse / D).toFixed(2)}회, 이벤트 ${(totEvents / D).toFixed(1)}회(월 ${(totEvents / D / MONTHS_PER_GAME).toFixed(2)}), 자율 ${(totAuto / D).toFixed(1)}슬롯, 연간결정 ${(totAnnual / D).toFixed(1)}회, 구매 ${(totBought / D).toFixed(1)}개`);
console.log('18세 평균 능력치:', STATS.map(x => `${x.name} ${Math.round(sumStats[x.id] / D)}`).join(' · '));
console.log('\n정책별 상위 엔딩:');
for (const [p, d] of Object.entries(byPolicy)) {
  const top = Object.entries(d).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v}`).join(', ');
  console.log(`  ${p.padEnd(13)} ${top}`);
}
const errList = Object.entries(errors);
if (errList.length) {
  console.log(`\n⚠ 오류로 중단된 게임 ${N - done}회:`);
  for (const [m, n] of errList.sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log(`  ${n}× ${m}`);
  process.exitCode = 1;
}
if (csvPath) {
  writeFileSync(csvPath, ['seed,policy,ending,cat,trust,stress,gold,refusals,events,' + STATS.map(x => x.id).join(','), ...rows].join('\n'));
  console.log('\nCSV 저장:', csvPath);
}
