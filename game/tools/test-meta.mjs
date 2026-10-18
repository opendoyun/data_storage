// 메타 진행(GDD 4.9) 테스트: 별 조각 계산 · 해금 · 편지 진행 · 유산 순서 · 저장 스키마 이전/손상 복구 · 보너스 구매 · 앨범 HTML 이스케이프
// 사용: node tools/test-meta.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as M from '../js/engine/meta.js';
import { GUARDIANS } from '../js/data/guardians.js';
import { ENDINGS } from '../js/data/endings.js';
import { renderPersonalityMap, personalityTableHTML, albumGridHTML, runsHTML, lettersHTML, detailHTML, shopHTML } from '../js/ui/album.js';

let passed = 0, skipped = 0;
const tests = [];
const t = (name, fn) => tests.push([name, fn]);

// ── 도구
const memStorage = (init = {}) => { const m = new Map(Object.entries(init)); return { map: m, getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) }; };
const PERS = (age, v = 0) => ({ age, extro: v, agree: -v, ambit: v / 2, roman: 0, good: 10 });
let seedN = 0;
function fin(endingId, { name = '루나', guardian = 'knight', hidden, str = 300, score = 900, cat } = {}) {
  const def = ENDINGS.find(e => e.id === endingId) ?? { id: endingId, name: endingId, cat: cat ?? '무예', hidden: !!hidden };
  seedN++;
  return {
    seed: seedN, name, guardian, trust: 60, playthrough: seedN,
    stats: { hp: 100, str, agi: 50, int: 40, cult: 30, mag: 20, chm: 210, eti: 10, elo: 10, sens: 10, faith: 10, moral: 10 },
    counters: { refusals: 2, forced: 1, persuaded: 1, autonomy: 9, events: 50 + seedN, months: 96, collapses: 0, adventures: 3 },
    persHistory: [10, 11, 12, 13, 14, 15, 16, 17, 18].map(a => PERS(a, (a - 10) * 5)),
    ending: { id: def.id, name: def.name, cat: cat ?? def.cat, hidden: hidden ?? !!def.hidden, runnerUp: { id: 'chef', name: '요리사' }, top: [{ id: def.id, name: def.name, score }, { id: 'chef', name: '요리사', score: score - 50 }] },
  };
}
const day = (n) => `2026-10-${String(n).padStart(2, '0')}T09:00:00.000Z`;
// 편지 주입: 엔딩별 3통 (queen은 2통만 — 데이터 길이를 상한으로 쓰는지 확인)
const LET = {
  letters: {
    herb_doctor: [{ title: '{name}의 첫 진료', text: '{call}에게. 오늘 첫 환자를 봤어. {call이} 가르쳐 준 대로.' }, { title: '두 번째', text: '둘' }, { title: '세 번째', text: '셋' }],
    queen: [{ title: '왕관', text: '{call}, 무거워.' }, { title: '대관식 뒤', text: '…' }],
    painter: [{ title: '첫 그림', text: '…' }, { title: '전시', text: '…' }, { title: '마지막', text: '…' }],
  },
  categoryLetters: { '히든': [{ title: '별에서', text: '{call}, 나 여기 있어.' }] },
};

// ──────────────────────────────────────────────────────────────────────
t('빈 메타: 첫 플레이 기본값', () => {
  const m = M.emptyMeta();
  assert.equal(m.v, M.META_VERSION);
  const so = M.startOptions(m);
  assert.deepEqual(so.guardians.filter(g => g.unlocked).map(g => g.id), Object.keys(GUARDIANS).filter(id => !GUARDIANS[id].unlock));
  assert.equal(so.shards, 0);
  assert.ok(so.bonuses.length >= 6 && so.bonuses.length <= 8, '시작 보너스 6~8종');
  assert.ok(so.bonuses.every(b => !b.owned && b.cost > 0 && b.name && b.desc));
  const opts = M.newGameOptions(m, {});
  assert.equal(opts.guardian, 'knight'); assert.equal(opts.playthrough, 1); assert.deepEqual(opts.legacy, []);
  assert.equal(M.endingAlbum(m).length, ENDINGS.length);
  assert.equal(M.unreadLetterCount(m), 0);
});

t('저장소: 없음 / 접근 불가 / 손상 / 구버전 / 왕복', () => {
  assert.equal(M.loadMetaReport(memStorage()).status, 'empty');
  assert.equal(M.loadMetaReport(null).status, 'unavailable');
  const throwing = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceeded'); } };
  assert.equal(M.loadMetaReport(throwing).status, 'unavailable');
  assert.deepEqual(M.loadMeta(throwing), M.emptyMeta());
  assert.equal(M.saveMeta(throwing, M.emptyMeta()), false, '저장 실패는 false');
  // 손상: JSON 깨짐 → 빈 메타 + 원본 백업
  const bad = memStorage({ [M.META_KEY]: '{"v":2,"shards":5,"endings":{"queen":' });
  const rep = M.loadMetaReport(bad);
  assert.equal(rep.status, 'corrupt'); assert.deepEqual(rep.meta, M.emptyMeta());
  assert.equal(bad.map.get(M.META_BACKUP_KEY), '{"v":2,"shards":5,"endings":{"queen":');
  for (const raw of ['null', '42', '"str"', '[1,2]', 'undefined']) assert.equal(M.loadMetaReport(memStorage({ [M.META_KEY]: raw })).status, 'corrupt', raw);
  // 구버전(v 없음): endings가 id 배열, owned에 모르는 id
  const old = memStorage({ [M.META_KEY]: JSON.stringify({ shards: 4, endings: ['queen', 'saint', 'queen', 7], owned: ['purse', 'bogus', 'purse'], lettersRead: { 'queen:0': 1 } }) });
  const r2 = M.loadMetaReport(old);
  assert.equal(r2.status, 'migrated');
  const m = r2.meta;
  assert.equal(m.v, M.META_VERSION);
  assert.deepEqual(Object.keys(m.endings), ['queen', 'saint']);
  assert.equal(m.endings.queen.count, 1);
  assert.deepEqual(m.owned, ['purse']);
  assert.equal(m.shardsEarned, 4 + M.BONUS_MAP.purse.cost, '누적 조각 = 잔액 + 쓴 조각');
  assert.equal(m.totalRuns, 2);
  assert.deepEqual(m.lettersRead, { 'queen:0': true });
  // 다른 형태: endings가 {id: 횟수}, 잘못된 값 섞임, 회차 요약만 있음
  const m3 = M.migrateMeta({ endings: { queen: 3, nope: 'x', zero: 0 }, runs: [{ endingId: 'painter', name: '하린', at: day(1) }, { bad: true }], shards: -5, totalRuns: 'abc' });
  assert.equal(m3.endings.queen.count, 3); assert.ok(!m3.endings.nope && !m3.endings.zero);
  assert.equal(m3.endings.painter.count, 1, '회차 요약으로 앨범 복원');
  assert.equal(m3.shards, 0); assert.equal(m3.runs.length, 1); assert.equal(m3.totalRuns, 4);
  // 왕복
  const st = memStorage();
  let mm = M.recordRun(M.emptyMeta(), fin('queen'), day(1)).meta;
  assert.equal(M.saveMeta(st, mm), true);
  const back = M.loadMetaReport(st);
  assert.equal(back.status, 'ok'); assert.deepEqual(back.meta, mm);
});

t('별 조각: 완주 +1, 처음 엔딩 +2, 처음 히든 +3(대체)', () => {
  let m = M.emptyMeta();
  let r = M.recordRun(m, fin('queen'), day(1));
  assert.equal(r.shardsGained, 3); assert.deepEqual(r.shardBreakdown.map(b => b.reason), ['run', 'newEnding']);
  assert.deepEqual(r.newEndings.map(e => e.id), ['queen']);
  r = M.recordRun(r.meta, fin('queen'), day(2));
  assert.equal(r.shardsGained, 1); assert.deepEqual(r.newEndings, []);
  r = M.recordRun(r.meta, fin('star_goddess'), day(3));
  assert.equal(r.shardsGained, 4); assert.deepEqual(r.shardBreakdown.map(b => b.reason), ['run', 'newHidden']);
  assert.equal(r.newEndings[0].hidden, true);
  r = M.recordRun(r.meta, fin('star_goddess'), day(4));
  assert.equal(r.shardsGained, 1);
  assert.equal(r.meta.shards, 9); assert.equal(r.meta.shardsEarned, 9); assert.equal(r.meta.totalRuns, 4);
  assert.equal(r.meta.endings.queen.count, 2); assert.equal(r.meta.endings.star_goddess.count, 2);
  assert.equal(r.meta.endings.queen.firstAt, day(1)); assert.equal(r.meta.endings.queen.lastAt, day(2));
});

t('보호자 출신 해금: 누적 조각 기준, 써도 닫히지 않음', () => {
  const need = Object.fromEntries(Object.entries(GUARDIANS).map(([id, g]) => [id, g.unlock?.shards ?? 0]));
  let m = M.emptyMeta(), unlocked = [];
  const ends = ['queen', 'painter', 'chef', 'saint', 'writer'];
  for (let i = 0; i < ends.length; i++) {
    const before = m.shardsEarned;
    const r = M.recordRun(m, fin(ends[i]), day(i + 1));
    m = r.meta;
    const expect = Object.keys(need).filter(id => need[id] > 0 && before < need[id] && m.shardsEarned >= need[id]);
    assert.deepEqual(r.newUnlocks.filter(u => u.type === 'guardian').map(u => u.id), expect, `run ${i + 1}`);
    unlocked.push(...expect);
    // 조각을 다 써도 해금 유지
    for (const b of M.START_BONUSES) { const x = M.buyBonus(m, b.id); if (x.ok) m = x.meta; }
  }
  assert.equal(m.shardsEarned, 15);
  assert.deepEqual(unlocked.sort(), ['adventurer', 'merchant', 'priest'].filter(id => GUARDIANS[id]).sort());
  const so = M.startOptions(m);
  assert.ok(so.guardians.every(g => g.unlocked), '15조각이면 모두 열림');
  assert.ok(m.shards < m.shardsEarned);
  // 첫 완주 후 '지난 아이의 선물' 보너스가 열린다
  const r1 = M.recordRun(M.emptyMeta(), fin('queen'), day(1));
  assert.ok(r1.newUnlocks.some(u => u.type === 'bonus' && u.id === 'keepsake'));
});

t('후일담 편지: 첫 달성 → 1번, 이후 매 회차 달성한 모든 엔딩의 다음 편지', () => {
  let m = M.emptyMeta();
  const keys = (r) => r.letterUnlocks.map(l => l.key).sort();
  let r = M.recordRun(m, fin('herb_doctor', { name: '하린', guardian: 'scholar' }), day(1), LET);
  assert.deepEqual(keys(r), ['herb_doctor:0']);
  assert.equal(r.letterUnlocks[0].title, '하린의 첫 진료');
  r = M.recordRun(r.meta, fin('queen', { name: '루나' }), day(2), LET);
  assert.deepEqual(keys(r), ['herb_doctor:1', 'queen:0']);
  r = M.recordRun(r.meta, fin('herb_doctor', { name: '세라', guardian: 'adventurer' }), day(3), LET);
  assert.deepEqual(keys(r), ['herb_doctor:2', 'queen:1'], '같은 엔딩 재달성은 다음 편지 1통만');
  assert.deepEqual(r.letterUnlocks.find(l => l.key === 'herb_doctor:2').from.name, '세라', '보낸이는 그 엔딩에 가장 최근 도달한 아이');
  r = M.recordRun(r.meta, fin('painter'), day(4), LET);
  assert.deepEqual(keys(r), ['painter:0'], 'herb_doctor 3통·queen 2통은 상한');
  r = M.recordRun(r.meta, fin('star_goddess', { name: '미르', guardian: 'priest' }), day(5), LET);
  assert.deepEqual(keys(r), ['painter:1', 'star_goddess:0'], '히든은 범주 공통 편지로');
  r = M.recordRun(r.meta, fin('chef'), day(6), LET);
  assert.deepEqual(keys(r), ['painter:2'], '편지 데이터가 1통뿐인 범주는 1통에서 멈춤, chef는 편지 없음');
  // 편지함: 이름·호칭 채움, 최근 도착 순, 읽음 처리
  const inbox = M.letterInbox(r.meta, LET);
  assert.equal(inbox.length, 3 + 2 + 3 + 1);
  assert.equal(inbox[0].at, day(6));
  const hd0 = inbox.find(l => l.key === 'herb_doctor:0');
  assert.equal(hd0.text, '선생님에게. 오늘 첫 환자를 봤어. 선생님이 가르쳐 준 대로.');
  const sg = inbox.find(l => l.key === 'star_goddess:0');
  assert.equal(sg.text, '신부님, 나 여기 있어.');
  assert.equal(M.unreadLetterCount(r.meta, LET), 9);
  const m2 = M.markLetterRead(r.meta, 'queen:1');
  assert.equal(M.unreadLetterCount(m2, LET), 8);
  assert.equal(M.unreadLetterCount(r.meta, LET), 9, 'markLetterRead는 원본을 바꾸지 않는다');
});

t('편지 데이터가 비어 있어도 진행은 저장되고, 나중에 채워지면 보인다', () => {
  const EMPTY = { letters: {}, categoryLetters: {} };
  let r = M.recordRun(M.emptyMeta(), fin('queen'), day(1), EMPTY);
  assert.deepEqual(r.letterUnlocks, []);
  r = M.recordRun(r.meta, fin('painter'), day(2), EMPTY);
  assert.deepEqual(r.letterUnlocks, []);
  assert.equal(M.unreadLetterCount(r.meta, EMPTY), 0);
  assert.equal(r.meta.endings.queen.letters.length, 2);
  assert.equal(M.letterInbox(r.meta, LET).filter(l => l.endingId === 'queen').length, 2);
  // 기본 데이터(data/letters.js)로도 예외 없이 동작
  assert.doesNotThrow(() => M.letterInbox(r.meta)); assert.doesNotThrow(() => M.endingAlbum(r.meta));
});

t('유산: 최근 아이부터 최대 5명, 회차 번호', () => {
  let m = M.emptyMeta();
  const names = ['가', '나', '다', '라', '마', '바', '사'];
  names.forEach((n, i) => { m = M.recordRun(m, fin(i % 2 ? 'queen' : 'painter', { name: n }), day(i + 1)).meta; });
  const opts = M.newGameOptions(m, {});
  assert.deepEqual(opts.legacy.map(l => l.name), ['사', '바', '마', '라', '다']);
  assert.deepEqual(Object.keys(opts.legacy[0]).sort(), ['cat', 'endingId', 'endingName', 'name']);
  assert.equal(opts.legacy[0].endingId, 'painter'); assert.equal(opts.legacy[1].endingName, '여왕');
  assert.equal(opts.playthrough, 8);
});

t('회차 요약은 30개까지, 누적 회차 수는 계속', () => {
  let m = M.emptyMeta();
  for (let i = 0; i < 34; i++) m = M.recordRun(m, fin('chef', { name: `아이${i}` }), day((i % 28) + 1)).meta;
  assert.equal(m.runs.length, M.MAX_RUNS); assert.equal(m.totalRuns, 34);
  assert.equal(m.runs[0].name, '아이4'); assert.equal(m.runs[29].no, 34);
  assert.equal(m.endings.chef.count, 34);
  const run = m.runs[29];
  for (const k of ['name', 'endingId', 'endingName', 'cat', 'hidden', 'guardian', 'topStats', 'counters', 'persHistory']) assert.ok(k in run, k);
  assert.deepEqual(run.topStats.map(s => s.id), ['str', 'chm', 'hp']);
  assert.equal(run.persHistory.length, 9);
  assert.ok(JSON.stringify(m).length < 120000, '저장 크기 적당');
});

t('같은 최종 상태를 두 번 기록하지 않는다', () => {
  const f = fin('queen');
  const r1 = M.recordRun(M.emptyMeta(), f, day(1));
  const r2 = M.recordRun(r1.meta, f, day(1));
  assert.equal(r2.duplicate, true); assert.equal(r2.shardsGained, 0); assert.deepEqual(r2.meta, r1.meta);
  assert.throws(() => M.recordRun(M.emptyMeta(), { name: '루나' }, day(1)), /엔딩/);
});

t('순수성: 입력 meta를 바꾸지 않는다 · 결정적', () => {
  const m0 = M.recordRun(M.emptyMeta(), fin('queen'), day(1)).meta;
  const snap = JSON.stringify(m0);
  const f = fin('painter');
  const a = M.recordRun(m0, f, day(2), LET); M.buyBonus(m0, 'purse'); M.markLetterRead(m0, 'queen:0'); M.newGameOptions(m0, { bonusIds: ['purse'] }); M.endingAlbum(m0);
  assert.equal(JSON.stringify(m0), snap);
  const b = M.recordRun(JSON.parse(snap), f, day(2), LET);
  assert.deepEqual(a, b);
  const src = readFileSync(new URL('../js/engine/meta.js', import.meta.url), 'utf8').replace(/\/\/.*$/gm, '');
  assert.ok(!/Date\.now|new Date|Math\.random|localStorage|document\./.test(src), 'meta.js에 시간·난수·DOM 의존 없음');
});

t('보너스 구매', () => {
  let m = M.emptyMeta();
  let r = M.buyBonus(m, 'purse');
  assert.equal(r.ok, false); assert.match(r.reason, /모자랍니다/);
  m = M.recordRun(m, fin('queen'), day(1)).meta;              // 3조각
  r = M.buyBonus(m, 'nope'); assert.equal(r.ok, false);
  r = M.buyBonus(m, 'purse'); assert.equal(r.ok, true);
  assert.equal(r.meta.shards, 3 - M.BONUS_MAP.purse.cost); assert.deepEqual(r.meta.owned, ['purse']);
  assert.equal(r.meta.shardsEarned, 3, '구매는 누적 조각을 줄이지 않음');
  const again = M.buyBonus(r.meta, 'purse'); assert.equal(again.ok, false); assert.match(again.reason, /이미/);
  const so = M.startOptions(r.meta);
  assert.equal(so.bonuses.find(b => b.id === 'purse').owned, true);
  // 조건이 있는 보너스(지난 아이의 선물)는 완주 전엔 못 산다
  const rich = M.migrateMeta({ shards: 10 });
  assert.equal(M.buyBonus(rich, 'keepsake').ok, false);
  assert.equal(M.startOptions(rich).bonuses.find(b => b.id === 'keepsake').available, false);
});

t('newGameOptions: 잠긴 출신·안 산 보너스 무시, 최대 3개, 합산', () => {
  let m = M.migrateMeta({ shards: 30 });
  m = M.recordRun(m, fin('queen', { name: '하린', str: 500 }), day(1)).meta;
  for (const id of ['purse', 'seed_body', 'seed_mind', 'cube_cake', 'star_hairpin', 'keepsake']) m = M.buyBonus(m, id).meta;
  const o1 = M.newGameOptions(m, { guardian: 'adventurer', bonusIds: ['seed_inner', 'keepsake', 'seed_body', 'keepsake', 'purse', 'cube_cake'] });
  assert.equal(o1.guardian, GUARDIANS.adventurer && m.shardsEarned >= GUARDIANS.adventurer.unlock.shards ? 'adventurer' : 'knight');
  assert.deepEqual(o1.bonusIds, ['keepsake', 'seed_body', 'purse'], '안 산 seed_inner 무시, 중복 제거, 3개까지');
  assert.equal(o1.bonuses.gold, 200);
  assert.equal(o1.bonuses.stats.str, 20 + M.KEEPSAKE_STAT_BONUS, 'keepsake(하린의 1위 근력) + 신체 씨앗');
  assert.equal(o1.bonuses.stats.chm, M.KEEPSAKE_STAT_BONUS, 'keepsake 2위 매력');
  assert.equal(o1.bonuses.flags.meta_keepsake, true);
  const o2 = M.newGameOptions(M.emptyMeta(), { guardian: 'adventurer' });
  assert.equal(o2.guardian, 'knight', '잠긴 출신은 기사로');
  assert.equal(M.newGameOptions(m, { guardian: 'no_such' }).guardian, 'knight');
  const o3 = M.newGameOptions(m, { bonusIds: ['star_hairpin', 'cube_cake'] });
  assert.equal(o3.bonuses.items.silver_hairpin, 1); assert.equal(o3.bonuses.relations.cube, 20);
});

t('엔딩 앨범: 달성 기록·최고 회차·히든 ??? 숨김', () => {
  let m = M.emptyMeta();
  m = M.recordRun(m, fin('queen', { name: '루나', score: 800 }), day(1), LET).meta;
  m = M.recordRun(m, fin('queen', { name: '하린', guardian: 'scholar', score: 1200 }), day(2), LET).meta;
  m = M.recordRun(m, fin('queen', { name: '세라', score: 1000 }), day(3), LET).meta;
  const al = M.endingAlbum(m, ENDINGS, LET);
  const q = al.find(e => e.id === 'queen');
  assert.equal(q.achieved, true); assert.equal(q.count, 3); assert.equal(q.firstAt, day(1));
  assert.equal(q.best.name, '하린'); assert.equal(q.best.score, 1200); assert.equal(q.best.persHistory.length, 9);
  assert.ok(q.epilogue.includes('하린은'), '에필로그에 최고 회차 아이 이름');
  assert.equal(q.letters.length, 2);
  for (const e of al.filter(x => x.hidden)) {
    assert.equal(e.name, '???'); assert.ok(e.hint && e.hint.length > 5); assert.equal(e.epilogue, null);
    const real = ENDINGS.find(d => d.id === e.id).name;
    assert.ok(!JSON.stringify(e).includes(real), `${e.id} 이름 노출 금지`);
  }
  const notYet = al.find(e => e.id === 'chef');
  assert.equal(notYet.achieved, false); assert.equal(notYet.name, '요리사'); assert.ok(notYet.hint.includes('이 빛나는 아이'));
  // 데이터에서 사라진 엔딩 기록도 유지
  const al2 = M.endingAlbum(M.migrateMeta({ endings: { ghost_end: { count: 1, name: '사라진 길', cat: '무예' } } }));
  assert.ok(al2.find(e => e.id === 'ghost_end' && e.orphan));
  const sum = M.metaSummary(m);
  assert.equal(sum.endingsSeen, 1); assert.equal(sum.totalRuns, 3); assert.equal(sum.playthrough, 4);
});

t('성격 지도 SVG: 5축·한국어 양극·빈/불완전 기록', () => {
  const svg = renderPersonalityMap([10, 12, 14, 16, 18].map(a => PERS(a, (a - 10) * 9)));
  for (const w of ['외향', '활발', '내성', '순응', '온순', '반항', '야심', '야망', '소박', '감성', '낭만', '현실', '선악', '정의', '교활', '10', '18세', '사춘기']) assert.ok(svg.includes(w), w);
  assert.equal((svg.match(/class="pm-line"/g) || []).length, 5);
  assert.equal((svg.match(/class="pm-hit"/g) || []).length, 5);
  assert.ok(svg.includes('+72'), '끝값 라벨');
  assert.ok(renderPersonalityMap([]).includes('기록이 없다'));
  assert.ok(renderPersonalityMap(null).includes('pm-empty'));
  const one = renderPersonalityMap([{ age: 10, extro: 500, agree: 'x' }, { age: 99 }]);
  assert.ok(!one.includes('NaN') && one.includes('+100'));
  assert.ok(personalityTableHTML([PERS(10), PERS(11)]).includes('<table'));
  assert.ok(!renderPersonalityMap([PERS(10), PERS(18, 40)], { width: 300 }).includes('NaN'));
});

t('앨범 HTML: 사용자 입력 이스케이프', () => {
  const evil = '<img src=x onerror=alert(1)>';
  let m = M.emptyMeta();
  m = M.recordRun(m, fin('queen', { name: evil }), day(1), LET).meta;
  m = M.recordRun(m, fin('painter', { name: '"><script>x</script>' }), day(2), LET).meta;
  const al = M.endingAlbum(m, ENDINGS, LET);
  const html = [albumGridHTML(al), runsHTML(m.runs), lettersHTML(M.letterInbox(m, LET), 'queen:0'), detailHTML(al.find(e => e.id === 'queen')), shopHTML(M.startOptions(m), { ok: false, text: evil })].join('');
  assert.ok(!html.includes('<img src=x'), 'img 태그 주입 차단');
  assert.ok(!html.includes('<script>'), 'script 태그 주입 차단');
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(lettersHTML([], null).includes('아직 도착한 편지가 없다'));
  assert.ok(runsHTML([]).includes('아직 떠나보낸 아이가 없다'));
});

t('엔진 연동: newGameOptions → newGame → 8년 → recordRun', async () => {
  let E;
  try { E = await import('../js/engine/engine.js'); }
  catch (e) { skipped++; console.warn('  (건너뜀: 엔진 import 실패 — ' + e.message + ')'); return 'skip'; }
  let m = M.migrateMeta({ shards: 20, shardsEarned: 20 });
  m = M.buyBonus(m, 'purse').meta; m = M.buyBonus(m, 'star_hairpin').meta; m = M.buyBonus(m, 'seed_mind').meta;
  const opts = M.newGameOptions(m, { guardian: 'merchant', bonusIds: ['purse', 'star_hairpin', 'seed_mind'] });
  const base = E.newGame({ seed: 77, guardian: 'merchant' });
  const s = E.newGame({ seed: 77, name: '하린', ...opts });
  assert.equal(s.guardian, 'merchant'); assert.equal(s.gold, base.gold + 200);
  assert.equal(s.items.silver_hairpin, 1); assert.equal(s.stats.int, base.stats.int + 20);
  assert.equal(s.playthrough, 1);
  let months = 0;
  while (!s.finished && months < 200) {
    let slots = ['school', 'farm', months % 3 === 0 ? 'rest' : 'autonomy'];
    for (const p of E.checkRefusals(s, slots)) slots[p.slot] = E.resolveRefusal(s, p, 'persuade').finalActivity;
    E.runMonth(s, slots);
    let guard = 0;
    while (s.pendingEvents.length && guard++ < 30) { const ev = E.currentEvent(s); if (!ev?.choices.length) { s.pendingEvents.shift(); continue; } E.chooseEvent(s, ev.id, ev.choices[0].index); }
    E.endMonth(s); months++;
  }
  assert.ok(s.finished && s.ending);
  const r = M.recordRun(m, s, day(1));
  assert.equal(r.run.persHistory.length, 9); assert.equal(r.run.endingId, s.ending.id);
  assert.ok(r.shardsGained >= 3);
  const next = M.newGameOptions(r.meta, {});
  assert.equal(next.legacy[0].name, '하린'); assert.equal(next.playthrough, 2);
  const s2 = E.newGame({ seed: 78, ...next });
  assert.equal(s2.legacy.length, 1); assert.equal(s2.playthrough, 2);
});

for (const [name, fn] of tests) {
  try { const res = await fn(); if (res !== 'skip') { passed++; console.log('✓', name); } else console.log('-', name); }
  catch (e) { console.error('✗', name, '\n ', e.message); process.exitCode = 1; }
}
console.log(`\n${passed} 테스트 통과${skipped ? `, ${skipped} 건너뜀` : ''}${process.exitCode ? ' (실패 있음)' : ''}`);
