import { josa } from '../../engine/josa.js';
import { ACTIVITY_MAP } from '../activities.js';
// 배치 b03 — 사춘기와 신뢰 (14~15세 중심, 일부 13~16세)
// 거울 앞 고민, 비밀 일기, 늦은 귀가, 말다툼과 화해, 외모와 정체성, 친구 문제, 보호자에게 실망, 작은 반항과 큰 반항.
// 공주의 외형은 character-design.md v2를 따른다: 허리까지 오는 은백색 생머리·일자 앞머리·붉은 눈·금색 별 반짝임·흑백 의상 + 포인트 색 하나.
//
// 공용 플래그 세팅: ran_away (b03_window_empty · b03_packed_bag — core의 '빈 방'과 다른 외박/가출 변주)
//                  respected_privacy (b03_diary_open)
// 신뢰 분기: b03_cold_table(신뢰 ≤35) · b03_packed_bag(신뢰 ≤45 또는 '내 시간표'에서 짐을 쌌을 때) · b03_kitchen_night(신뢰 ≥65)
//           → 16세 b03_open_door(가족 쪽: 사생활 존중 + 신뢰 ≥60) / b03_far_letter(떠도는 사람 쪽: 신뢰 ≤35)
// GDD 5.2 필수 장면: b03_birthday_talk — 열다섯 번째 생일 밤, 그동안의 스케줄 패턴(history·counters·mastery)으로 속마음을 말한다.
// 연쇄: ① 일기 (diary_open → diary_noticed → diary_page) ② 늦은 귀가 (late_bell → late_return → window_empty)
//       ③ 말다툼 (quarrel_spark → quarrel_door → quarrel_soup) ④ 등대 패거리 (kaya_crowd → kaya_dare → kaya_caught)
// 보조 인물(관계 수치 없음): 카야(항구 등대지기 딸, 16세), 니나(재봉소 집 딸, 동갑)
// 코어 플래그 콜백: seen.secret_letter_confront(편지를 몰래 읽음) · open_talk · magic_hidden · has_cat · debt_garrett · origin_hidden · ran_away

// ── GDD 5.2: 스케줄 패턴 분석 ───────────────────────────────────────────
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
// 아이 말투의 횟수: 99까지는 고유어(한 번 · 스무 번 · 서른네 번), 그 위는 숫자(120번)
const KN_ONE = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
const KN_TEN = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
function cnt(n, unit = '번') {
  if (!(n > 0) || n > 99) return `${n}${unit}`;
  const t = Math.floor(n / 10), o = n % 10;
  return `${t === 2 && o === 0 ? '스무' : KN_TEN[t]}${KN_ONE[o]} ${unit}`;
}
const FREE_ACTS = new Set(['rest', 'outing', 'shopping', 'autonomy']);
function patternOf(s) {
  const H = Array.isArray(s.history) ? s.history : [];
  const counts = {};
  let total = 0;
  for (const h of H) for (const id of h.slots || []) { counts[id] = (counts[id] || 0) + 1; total++; }
  if (!total) for (const [id, n] of Object.entries(s.mastery || {})) if (ACTIVITY_MAP[id] && n > 0) { counts[id] = n; total += n; }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topId, topN] = ranked[0] || [null, 0];
  let work = 0;
  for (const [id, n] of ranked) if (ACTIVITY_MAP[id]?.type === 'work') work += n;
  const c = s.counters || {};
  const st = H.map(h => h.stress).filter(Number.isFinite);
  const mastered = Object.entries(s.mastery || {}).filter(([id, n]) => ACTIVITY_MAP[id] && !FREE_ACTS.has(id) && n >= 16).sort((a, b) => b[1] - a[1])[0];
  return {
    topId, topN, total, distinct: ranked.length,
    restRatio: total ? (counts.rest || 0) / total : 0,
    workRatio: total ? work / total : 0,
    forced: c.forced || 0, refusals: c.refusals || 0, autonomy: c.autonomy || 0, collapses: c.collapses || 0, persuaded: c.persuaded || 0,
    avgStress: mean(st), recent: mean(st.slice(-12)), earlier: st.length > 12 ? mean(st.slice(-24, -12)) : mean(st),
    mastered: mastered ? mastered[0] : null,
    trust: s.trust ?? 50,
  };
}
// 지금까지의 시간표를 한 단어로: 몰아붙임 / 맡김 / 일 / 느긋함 / 섞임 (결과 대사가 본문과 어긋나지 않도록 본문도 이 값을 따른다)
function moodOf(p) {
  if (p.forced >= 6 || p.collapses >= 2 || (p.avgStress >= 60 && p.restRatio < 0.1)) return 'pushed';
  if (p.autonomy >= 12 && p.forced <= 2) return 'free';
  if (p.workRatio >= 0.4) return 'worker';
  if (p.restRatio >= 0.25 || p.avgStress < 30) return 'gentle';
  return 'mixed';
}
// 가장 많이 한 활동 (22종) — c는 "서른네 번" 같은 횟수 표현
const TOP_LINE = {
  school: (c) => `"학교에 간 게 ${c}이래. 큐브가 세어 줬어. 칠판 냄새만 맡아도 아직 졸려."`,
  etiquette: (c) => `"예절학교만 ${c} 갔어. 찻잔 드는 법은 이제 잠결에도 해. 근데 집에서는 그냥 컵으로 마셔도 되지?"`,
  sword: (c) => `"검술도장에 ${c} 나갔어. 이 손바닥 굳은살, 다 그때 거야. 만져 볼래?"`,
  magic: (c) => `"마법탑에 ${c} 갔어. 거기선 내가 별이 된 것 같고, 집에 오면 다시 사람이 돼. 둘 다 나쁘진 않아."`,
  art: (c) => `"예술원에 ${c} 다녔어. 그림 그릴 땐 아무도 나를 안 쳐다봐서 좋았어. 다들 그림만 보니까."`,
  theology: (c) => `"신학교에 ${c} 갔어. 기도가 늘 대답해 주진 않더라. 그래도 마음이 조용해지는 건 좋아."`,
  commerce: (c) => `"상업학원에 ${c} 갔어. 이제 장터에서 안 속아. 흥정은 {call}보다 내가 나을걸."`,
  farmschool: (c) => `"농업학교에 ${c} 갔어. 흙은 거짓말을 안 해서 좋아. 사람보다 쉬워."`,
  farm: (c) => `"밭일이 ${c}이래. 손톱 밑 흙이 안 빠져. 근데 밀 냄새는 좋아."`,
  diner: (c) => `"식당 일을 ${c} 했어. 이제 접시 열 개는 한 번에 날라. 거의."`,
  inn: (c) => `"여관에서 ${c} 일했어. 낯선 사람 얼굴 읽는 거, 좀 잘하게 됐어. {call} 얼굴도."`,
  church: (c) => `"교회 봉사를 ${c} 갔어. 거기 할머니들이 나더러 별 아가씨래. 싫진 않았어."`,
  sewing: (c) => `"재봉소에서 ${c} 바느질했어. 이 치맛단도 내가 고친 거야. 몰랐지?"`,
  smith: (c) => `"대장간 망치질이 ${c}이야. 팔 봐. 테오도라가 보면 기절할걸."`,
  castle: (c) => `"성 청소만 ${c} 했어. 이제 복도 발소리만 들어도 어느 귀족인지 알아."`,
  graveyard: (c) => `"묘지기 일을 ${c} 했어. 밤이 안 무서워진 건 좋은데, 가끔은 다른 애들처럼 무서워하고 싶어."`,
  shop: (c) => `"상점 일을 ${c} 했어. 거스름돈 세는 소리가 꿈에서도 들려."`,
  theater: (c) => `"극단에 ${c} 나갔어. 무대에선 다른 사람이 될 수 있어서 좋았어. 근데 오늘은 그냥 나로 말할게."`,
  rest: (c) => `"제일 많이 한 게 휴식이래. ${c}. 웃기지? 쉬어도 되는 애라고 해 준 거, 사실 좋았어."`,
  adventure: (c) => `"모험을 ${c} 나갔어. 숲에 가면 숨이 쉬어져. 다쳐서 올 때마다 {call} 얼굴이 하얘지는 것도 알아."`,
  shopping: (c) => `"쇼핑이 ${c}이래. 사치 부린 거 아니야. ……조금은 맞나."`,
  outing: (c) => `"친구들이랑 논 게 ${c}. 노는 걸 시간표에 넣어 주는 집은 우리 집뿐일걸. 좋은 뜻이야."`,
};
function topLine(p) {
  if (!p.topId) return `"……뭘 제일 많이 했는지도 잘 기억이 안 나. 그냥 계속 바빴어."`;
  const f = TOP_LINE[p.topId];
  return f ? f(cnt(p.topN)) : `"제일 많이 한 건 ${ACTIVITY_MAP[p.topId]?.name ?? '그거'}였어. ${cnt(p.topN)}."`;
}
// 거부·강행·설득·자율 (통제와 신뢰). 자율은 시간표 '칸' 단위로 센다.
const PERSUADE = (p) => `"말로 넘어간 것도 ${cnt(p.persuaded)}. {call} 말솜씨, 그거 반칙이야."`;
function controlLines(p) {
  const L = [];
  let skipAuto = false;
  if (p.forced >= 8) L.push(`"싫다고 했는데 그냥 하라고 한 게 ${cnt(p.forced)}이야. 세다가 그만둘까 했는데 끝까지 셌어."`);
  else if (p.forced >= 4) L.push(`"싫다고 했는데 그냥 하라고 한 게 ${cnt(p.forced)}이었어. 그런 날 밤엔 천장만 봤어."`);
  else if (p.refusals === 0 && p.autonomy === 0) { L.push(`"한 번도 싫다고 안 했고, 한 번도 내 마음대로 해 본 적도 없어. 그게 착한 건지 그냥 비어 있는 건지 모르겠어."`); skipAuto = true; }
  else if (p.refusals === 0) L.push(`"나 한 번도 싫다고 안 했지. 근데 그게 다 좋아서였는지는 나도 잘 모르겠어."`);
  else if (p.forced === 0) L.push(`"내가 싫다고 한 게 ${cnt(p.refusals)}인데, {call은} 한 번도 억지로 안 시켰어. 나 그거 친구들한테 자랑해."`);
  else L.push(`"억지로 시킨 건 ${cnt(p.forced)}뿐이었어. 그 정도면…… 봐줄게. 생일이니까."`);
  if (p.persuaded >= 3 && p.forced < 4) L.push(PERSUADE(p));
  if (!skipAuto) {
    if (p.autonomy >= 20) L.push(`"시간표에서 나한테 맡겨 준 칸이 ${cnt(p.autonomy, '칸')}. 그 칸에서는 내가 나를 고를 수 있었어."`);
    else if (p.autonomy >= 8) L.push(`"내 마음대로 고른 칸이 ${cnt(p.autonomy, '칸')}. 생각보다 많더라."`);
    else if (p.autonomy >= 1) L.push(`"내가 고른 칸은 ${cnt(p.autonomy, '칸')}뿐이야. 손가락으로 다 셀 수 있어."`);
    else L.push(`"한 번도 나한테 맡겨 본 적 없지? 나도 내가 뭘 고를지 궁금한데."`);
  }
  return L;
}
// 몸과 마음 (탈진·스트레스·휴식 비율·일 비율·다양성·숙련) — 시간표 성향(mood)을 먼저 말해 결과 대사와 맞춘다
function bodyLines(p, mood) {
  const L = [];
  if (p.collapses >= 2) L.push(`"쓰러진 게 ${cnt(p.collapses)}이야. 그때 기억은 천장이랑 물수건밖에 없어."`);
  else if (p.collapses === 1) L.push(`"나 한 번 쓰러졌을 때, {call} 손 떨리던 거 다 봤어."`);
  if (mood === 'pushed') {
    if (!p.collapses) L.push(p.avgStress >= 60
      ? `"솔직히 요 몇 년은 거의 매일 지쳐 있었어. 웃는 건 연습하면 되더라."`
      : `"숨 돌릴 틈이 별로 없었어. 쉬는 칸이 있어도 다음 칸 생각만 났어."`);
  } else if (mood === 'worker') L.push(`"일해서 돈 번 칸이 ${p.workRatio >= 0.5 ? '반이 넘어' : '거의 반이야'}. 우리 집 사정, 나도 알아. 그래서 더 열심히 했어."`);
  else if (mood === 'gentle') L.push(p.restRatio >= 0.25
    ? `"쉬게 해 준 칸도 많았지. 덕분에 숨 쉬는 법은 안 잊어버렸어."`
    : `"요 몇 년, 대체로 숨 쉴 만했어. 진짜야."`);
  else if (!p.collapses) {
    if (p.recent - p.earlier >= 12) L.push(`"요즘이 제일 힘들어. 작년보다 더."`);
    else if (p.total >= 30 && p.restRatio < 0.05) L.push(`"쉰 칸은 거의 없었어. 스무 칸에 한 칸도 안 되더라."`);
    else if (p.distinct >= 15) L.push(`"이것저것 다 해 봤어. ${cnt(p.distinct, '가지')}. 뭘 좋아하는지는 아직 몰라도, 뭘 싫어하는지는 알게 됐어."`);
    else if (p.distinct > 0 && p.distinct <= 5) L.push(`"근데 늘 하던 것만 했어. ${cnt(p.distinct, '가지')}뿐. 다른 걸 해 봤으면 어땠을까, 가끔 생각해."`);
    else if (p.earlier - p.recent >= 12) L.push(`"그래도 요즘은 좀 나아. 작년보다 숨이 덜 차."`);
    else if (p.mastered) L.push(`"${josa(ACTIVITY_MAP[p.mastered].name, '은')} 이제 눈 감고도 해. 그게 내 건지 {call} 건지는 아직 모르겠지만."`);
    else L.push(`"그래도 나쁘지 않았어. 좋았던 날이 더 많았어."`);
  }
  return L;
}
function closingLine(p) {
  if (p.trust >= 70) return `"아무튼 그렇다고. 오늘은 생일이니까 특별히 한 번만 말할게. 고마워."`;
  if (p.trust <= 35) return `"……이런 얘기를 왜 하나 몰라. 듣고는 있어?"`;
  return `"화내려는 거 아니야. 그냥, 한 번은 말해 두고 싶었어."`;
}
// 한 화면에 읽히도록 길이 예산(약 340자)을 넘으면 덜 중요한 문장부터 뺀다: 설득 대사 → 손가락 접는 지문
const BEAT = `{name이} 손가락을 하나씩 접었다.`;
function birthdayText(s) {
  const p = patternOf(s);
  const mood = moodOf(p);
  let parts = [`케이크 접시를 치운 뒤에도 {name은} 식탁을 떠나지 않았다. 촛농을 손톱으로 긁다가 입을 열었다. "{call}, 열다섯 되기 전에 할 말이 있어."`,
    topLine(p), BEAT, ...controlLines(p), ...bodyLines(p, mood), closingLine(p)];
  const persuade = PERSUADE(p);
  for (const drop of [persuade, BEAT]) if (parts.join(' ').length > 340) parts = parts.filter(x => x !== drop);
  return parts.join(' ');
}
const BIRTHDAY_RESULT = {
  thanks: {
    pushed: `"고맙다고? 내가 고마워해야 하는 거 아니야?" {name이} 웃다가 눈가를 문질렀다. "……아니, 오늘은 {call이} 고마워해. 나 진짜 힘들었으니까."`,
    free: `"뭐가 고마워." {name이} 촛농 덩어리를 당신 손바닥에 올려놓았다. "나한테 맡겨 준 사람이 누군데." 별빛이 촛불처럼 흔들렸다.`,
    worker: `"우리 집 형편, 나도 다 알아." {name이} 굳은살 박인 손을 비볐다. "근데 고맙다는 말 들으니까, 좀 억울했던 게 풀린다."`,
    gentle: `"나 쉬게 해 준 거, 다른 애들은 다 부러워해." {name이} 기지개를 켰다. "열여섯에도 그렇게 해 줘. 가끔은."`,
    mixed: `{name은} 고개를 끄덕이고 남은 케이크 한 조각을 반으로 갈라 내밀었다. "반반. 열다섯 살 기념." 둘은 촛농 냄새 속에서 케이크를 먹었다.`,
  },
  promise: {
    pushed: `"……진짜? 취소 없기야." {name이} 새끼손가락을 내밀었다. 손가락이 조금 떨렸다. 너무 오래 기다린 약속이라서.`,
    free: `"이미 그러고 있잖아." {name이} 웃었다. "그래도 말로 들으니까 좋다. 도장 찍어." 둘은 엄지를 맞댔다.`,
    worker: `"그럼 다음 달엔 일 한 칸 빼고 하고 싶은 거 넣어도 돼?" 조심스러운 목소리였다. 당신이 고개를 끄덕이자 {name이} 처음으로 욕심을 말했다.`,
    gentle: `"정하는 거 귀찮은데." {name이} 투덜대더니 금세 종이와 펜을 가져왔다. 하고 싶은 게 이미 잔뜩 적혀 있었다.`,
    mixed: `{name은} 잠깐 생각하더니 고개를 저었다. "다는 말고, 반만. 나머지 반은 {call이} 정해 줘. 아직은."`,
  },
  excuse: {
    pushed: `"알아. 그래서 더 말 못 했던 거야." {name이} 일어섰다. "잘되라고 한 거면, 나 지금 잘된 거야?" 대답할 수 없었다.`,
    free: `"응, 알아." {name은} 의외로 순순히 말했다. "근데 나 따지지도 않았는데 왜 변명해?" 당신은 할 말을 잃었다.`,
    worker: `"잘되라고 일 시킨 거야?" {name이} 손바닥 굳은살을 내려다보았다. "……아니잖아. 우리 집 때문이었지. 차라리 그렇게 말해."`,
    gentle: `"나 지금도 잘돼 있는데?" {name이} 고개를 갸웃했다. "{call은} 가끔 쓸데없이 비장해." 웃었지만, 아주 조금 서운한 얼굴이었다.`,
    mixed: `{name은} 잠시 당신을 보다가 접시를 들고 일어섰다. "그래. 생일이니까 그렇다고 해 둘게." 생일이 아니었다면 뭐라고 했을까.`,
  },
};
const birthdayResult = (key) => (s) => BIRTHDAY_RESULT[key][moodOf(patternOf(s))];

// 보호자 출신별 젊은 날 이야기 (b03_guardian_youth)
const YOUTH_STORY = {
  knight: `열네 살 견습 기사 시절, 새벽 훈련이 싫어 성벽을 넘다 근위대장에게 붙잡힌 이야기를 했다. {name이} 빨래집게를 떨어뜨리고 웃었다. "{call이} 성벽을? 진짜?"`,
  scholar: `열다섯에 책 한 권만 들고 집을 나와 떠돌았다고 말했다. "부모님께 편지는 썼어. 삼 년 뒤에." {name이} 눈을 가늘게 떴다. "그거 나한테 해도 되는 얘기야?"`,
  merchant: `열네 살에 부모님 몰래 가게 물건을 팔다가 반값에 넘긴 이야기를 했다. "그날 저녁 아무도 아무 말 안 했어. 그게 제일 무서웠지." {name이} 피식 웃었다. "{call}도 무서운 게 있었구나."`,
  priest: `신학교 시절 새벽 기도를 빼먹고 종탑에 올라 별을 보다 들킨 이야기를 했다. "벌로 한 달 동안 종을 닦았지." "그래서 별을 좋아하게 된 거야?" "그래서 너를 알아봤나 보지."`,
  adventurer: `열다섯에 마을을 뛰쳐나가 처음 들어간 동굴에서 사흘 만에 울면서 돌아온 이야기를 했다. "그리고 일주일 뒤에 또 나갔어." {name이} 눈을 반짝였다. "나도 곧 열다섯인데." "……괜히 말했다."`,
};

export default [
  // ══ 연쇄 ① 일기 ═════════════════════════════════════════════════════════
  {
    id: 'b03_diary_open', title: '펼쳐진 일기장', age: [13, 15], weight: 1.6,
    text: `빨래를 개어 {name}의 방에 들어갔다. 책상 위에 일기장이 펼쳐져 있다. 펼친 쪽 맨 아랫줄에 당신 이야기가 보였다. "{call은} 모른다. 내가 요즘—" 문장은 다음 장으로 넘어가 있었다.`,
    choices: [
      { label: '보지 않고 덮어 둔다', effects: { trust: +6, 'flag.respected_privacy': true, 'pers.agree': +1, stress: -2 },
        result: `일기장을 덮고 빨래만 내려놓았다. 궁금함이 목에 걸렸지만 삼켰다. 그 장의 주인은 당신이 아니다.`, next: 'b03_diary_page' },
      { label: '넘겨서 끝까지 읽는다', effects: { trust: -6, 'flag.b03_read_diary': true, gHealth: -2 },
        result: `"……요즘은 내가 사라져도 아무도 모를 것 같다는 걸." 손이 떨렸다. 일기장을 원래 각도로 돌려놓았다. 정확히 그 각도였는지는 자신이 없다.`, next: 'b03_diary_noticed' },
      { label: '서랍에 자물쇠를 달아 준다 (-30G)', conditions: ['gold >= 30'], effects: { gold: -30, trust: +8, 'flag.respected_privacy': true, 'flag.b03_drawer_lock': true, stress: -4 },
        result: `다음 날 서랍에 작은 놋쇠 자물쇠를 달아 주었다. 열쇠는 하나뿐이다. {name이} 열쇠를 끈에 꿰어 목에 걸고 한참 만지작거렸다.` },
      { label: '일기장을 잠가 열쇠를 숨겨 둔다', conditions: ['item.diary >= 1'], effects: { trust: +7, 'flag.respected_privacy': true, 'stat.sens': +3, 'pers.extro': +1 },
        result: `선물했던 자물쇠 일기장이었다. 읽지 않고 덮어 잠근 뒤, 열쇠는 베개 밑에 밀어 넣었다. 저녁에 {name이} 아무 말 없이 그 열쇠를 끈에 꿰어 목에 걸었다.`, next: 'b03_diary_page' },
    ],
  },
  {
    id: 'b03_diary_noticed', title: '책갈피의 방향', chainOnly: true, age: [13, 15],
    text: `사흘 뒤 저녁, {name이} 일기장을 식탁에 내려놓았다. "책갈피 끈. 나는 늘 왼쪽으로 빼 둬. 오른쪽에 있었어." 붉은 눈이 당신을 똑바로 보았다. "읽었지."`,
    choices: [
      { label: '인정하고 사과한다', effects: { trust: +5, 'pers.agree': +1, stress: -3 },
        result: `"……응. 다음엔 물어봐. 대답 안 할 수도 있지만." {name은} 일기장을 품에 안고 일어섰다. 방문은 조금 열어 둔 채였다.`, next: 'b03_diary_page' },
      { label: '걱정돼서 그랬다고 한다', check: { stat: 'elo', dc: 125 },
        success: { effects: { trust: +3, 'stat.elo': +3, 'stat.sens': +2 },
          result: `"사라져도 모를 것 같다고 써서." 목소리가 갈라졌다. {name은} 한참 말이 없다가 의자를 끌어 당신 옆에 앉았다.`, next: 'b03_diary_page' },
        fail: { effects: { trust: -8, stress: +8, 'pers.agree': -3 },
          result: `"걱정이면 다 돼? 그럼 나도 {call} 서랍 뒤져도 돼?" 그날 밤 {name}의 방문 손잡이 밑에 의자가 받쳐져 있었다.` } },
      { label: '안 읽었다고 잡아뗀다', effects: { trust: -10, 'pers.good': -2, 'pers.agree': -2 },
        result: `"……그래." {name은} 더 묻지 않았다. 그게 더 무서웠다. 그 뒤로 일기장은 집 어디에서도 보이지 않았다.` },
      { label: '편지 일까지 꺼내 사과한다', conditions: ['seen.secret_letter_confront >= 1'], // 몰래 읽은 경우만 (아이에게 직접 물은 경우도 read_letter가 켜진다)
        effects: { trust: +4, 'pers.agree': +2, 'stat.sens': +2 },
        result: `"탑 편지 때도 이랬지. 미안해. 이번이 두 번째야." {name이} 한참 당신을 보다가 새끼손가락을 내밀었다. "세 번째는 없어." 당신은 그 손가락을 걸었다.`, next: 'b03_diary_page' },
    ],
  },
  {
    id: 'b03_diary_page', title: '찢어 낸 한 장', chainOnly: true, age: [13, 15],
    text: `며칠 뒤 아침, 당신 베개 위에 일기장에서 찢어 낸 종이 한 장이 놓여 있었다. "이 장은 읽어도 돼." 그 아래 {name이} 요즘 무서워하는 것들이 적혀 있었다. 붉은 눈, 밤마다 새는 별빛, 언젠가 이 집을 떠나야 하는 날.`,
    choices: [
      { label: '뒷면에 답장을 적어 준다', effects: { trust: +6, 'stat.sens': +4, 'pers.roman': +1 },
        result: `종이 뒷면에 한 줄씩 답을 적었다. 눈은 노을 같고, 별빛은 등불 같고, 떠나는 날엔 문을 열어 두겠다고. 종이는 다시 일기장 속으로 돌아갔다.` },
      { label: '아무 말 없이 안아 준다', effects: { trust: +5, stress: -10, 'stat.sens': +2 },
        result: `부엌에서 마주친 {name을} 말없이 안았다. "……읽었구나." "읽어도 된다며." 둘 다 그 얘기는 더 하지 않았다. 충분했다.` },
      { label: '그때 읽은 문장을 꺼낸다', conditions: ['flag.b03_read_diary'], effects: { trust: +7, 'stat.moral': +2, stress: -6 },
        result: `"사라져도 아무도 모를 것 같다고 썼지. 지금도 그래?" {name이} 종이를 오래 접었다 폈다. "……오늘은 아니야. 누가 알아챌 것 같아서."` },
      { label: '엘다에게 별빛을 묻자고 한다', conditions: ['flag.met_elda', 'rel.elda >= 30'], effects: { 'rel.elda': +5, 'stat.mag': +3, trust: +3 },
        result: `엘다가 종이를 읽고 미소 지었다. "무서워해도 괜찮아요. 무서워할 줄 아는 별이 덜 다치거든요." 돌아오는 길, {name은} 별빛을 감추지 않았다.` },
    ],
  },

  // ══ 연쇄 ② 늦은 귀가 → 외박 ═════════════════════════════════════════════
  {
    id: 'b03_late_bell', title: '아홉 번째 종', age: [14, 16], weight: 1.5,
    text: `해 지기 전에 돌아오기로 한 약속. 마을 종탑이 아홉 번을 쳤다. {name}의 자리에 놓인 수프가 식어 간다. 큐브가 창가를 빙빙 돌았다. "주인님, 찾아볼까요? 아니, 기다릴까요? 아니, 찾아볼까요?"`,
    choices: [
      { label: '문 앞에 앉아 기다린다', effects: { gHealth: -3, trust: +3, 'flag.b03_waited': true },
        result: `자정이 넘어서야 발소리가 났다. {name은} 문 앞 계단에 앉은 당신을 보고 걸음을 멈췄다.`, next: 'b03_late_return' },
      { label: '등불을 들고 찾아 나선다', effects: { gHealth: -5, 'rel.cube': +3, trust: -2, 'pers.extro': -1 },
        result: `강가, 장터, 종탑 뒤. 마지막으로 찾아간 바닷가 등대 밑에서 {name이} 친구들과 모닥불을 쬐고 있었다. 당신의 등불을 보자 웃음소리가 뚝 끊겼다.`, next: 'b03_late_return' },
      { label: '등불을 켜 두고 먼저 잔다', effects: { trust: +4, 'pers.agree': -2, 'rel.cube': +1 },
        result: `현관에 등불 하나와 쪽지를 남겼다. "수프는 솥에." 새벽에 숟가락 소리가 났다. 아침에 솥은 비어 있었고, 쪽지 뒤에 "미안"이 적혀 있었다.` },
      { label: '가렛에게 항구 쪽을 부탁한다', conditions: ['rel.garrett >= 30'], effects: { 'rel.garrett': +3, trust: -3, gHealth: -1, 'pers.agree': -1 },
        result: `가렛이 투덜대며 항구를 돌았다. "애들끼리 등대 밑에 있더라. 별일은 없었어." 반쯤 끌려 들어온 {name이} 당신을 노려보았다.`, next: 'b03_late_return' },
    ],
  },
  {
    id: 'b03_late_return', title: '자정의 현관', chainOnly: true, age: [14, 16],
    text: `은빛 머리카락에 모닥불 냄새가 배어 있었다. "등대 밑에서 애들이랑 별똥별 기다렸어. 시간 가는 줄 몰랐어." {name이} 턱을 들었다. 미안한 얼굴과 따지려는 얼굴이 반씩 섞여 있다.`,
    choices: [
      { label: '한 달간 외출 금지다', effects: { trust: -7, 'pers.agree': -3, stress: +8 },
        result: `"한 달? 별똥별 하나에?" {name은} 대답 대신 계단을 쿵쿵 올라갔다. 그날 밤, 위층에서 창문 여는 소리가 났다.`, next: 'b03_window_empty' },
      { label: '걱정했다고만 말한다', effects: { trust: +5, 'pers.agree': +2, stress: -4 },
        result: `"걱정했어. 그게 다야." {name이} 입술을 깨물었다. "……다음엔 종 칠 때 한 번 들러서 말하고 갈게." 꽤 괜찮은 약속이었다.` },
      { label: '규칙을 같이 다시 정하자', check: { stat: 'moral', dc: 120 },
        success: { effects: { trust: +6, 'stat.moral': +3, 'pers.agree': +1 },
          result: `둘은 식탁에 앉아 규칙을 새로 썼다. 별똥별 뜨는 밤은 열한 번째 종까지. 대신 어디 있는지 큐브에게 알릴 것. {name이} 맨 아래 서명했다.` },
        fail: { effects: { trust: -3, stress: +6, 'pers.agree': -2 },
          result: `"규칙 얘기만 나오면 {call은} 재판관 같아." 이야기는 말다툼으로 끝났다. 그래도 {name은} 다음 날 해 지기 전에 돌아왔다.` } },
      { label: '말없이 담요를 둘러 준다', conditions: ['flag.b03_waited'], effects: { trust: +7, 'stat.sens': +3, gHealth: -2 },
        result: `밖에서 기다리느라 곱은 손으로 담요를 펼쳐 {name}의 어깨에 둘렀다. 아이가 울 것 같은 얼굴로 웃었다. "……바보같이 밖에서 기다렸어?"` },
    ],
  },
  {
    id: 'b03_window_empty', title: '열린 창문', chainOnly: true, age: [14, 16],
    text: `새벽, 찬바람에 잠이 깼다. {name}의 방 창문이 열려 있고 침대는 비었다. 홈통에 진흙 발자국. 베개 위에 쪽지. "외출 금지는 {call} 혼자 정한 거야. 나는 동의 안 했어. 이틀 뒤에 올게."`,
    choices: [
      { label: '이틀을 기다린다', effects: { 'flag.ran_away': true, trust: +4, gHealth: -6, 'pers.agree': +2 },
        result: `이틀이 이 년 같았다. 사흘째 아침, 강 건너 빈 양치기 오두막에서 {name이} 돌아왔다. "금지, 아직 유효해?" "아니." {name은} 고개만 끄덕였다.` },
      { label: '당장 찾아서 데려온다', effects: { 'flag.ran_away': true, trust: -8, 'pers.agree': -3, gHealth: -6 },
        result: `해 뜨기 전에 강 건너 양치기 오두막에서 {name을} 찾아냈다. 순순히 따라왔지만, 돌아오는 내내 당신보다 세 걸음 뒤에서 걸었다.` },
      { label: '금지를 거둔다고 써 둔다', effects: { 'flag.ran_away': true, trust: +6, 'pers.agree': -2, stress: -4 },
        result: `"금지 취소. 돌아와서 같이 이야기하자." 창틀에 쪽지를 끼워 두었다. 다음 날 밤 쪽지가 사라졌고, 그다음 아침 {name이} 부엌에 앉아 있었다.` },
      { label: '엘다에게 먼저 알린다', conditions: ['flag.met_elda', 'rel.elda >= 25'], effects: { 'flag.ran_away': true, 'rel.elda': +6, trust: +3, 'stat.mag': +3 },
        result: `엘다에게 사람을 보냈다. 저녁에 짧은 답이 왔다. "제 집에 와 있어요. 이틀 동안 약초를 말리게 할게요." 돌아온 {name}에게서 박하 냄새가 났다. "엘다가 {call} 얘기만 하더라."` },
    ],
  },

  // ══ 연쇄 ③ 말다툼과 화해 ═══════════════════════════════════════════════
  {
    id: 'b03_quarrel_spark', title: '설거지 당번', age: [14, 15], weight: 1.4,
    text: `설거지 당번 이야기로 시작된 말이 어디서부터 꼬였는지 모르겠다. "{call은} 내가 뭘 해도 마음에 안 들지!" {name}의 주위에서 금빛 별이 타닥타닥 튀었다. 화가 나면 늘 저렇다.`,
    choices: [
      { label: '목소리를 높여 맞선다', effects: { trust: -6, stress: +8, 'pers.agree': -2 },
        result: `"말버릇이 그게 뭐야!" "{call}도 지금 소리 지르잖아!" 방문이 쾅 닫혔다. 큐브가 찬장 뒤로 숨었다.`, next: 'b03_quarrel_door' },
      { label: '숨을 고르고 먼저 사과한다', effects: { trust: +3, 'pers.agree': +1, stress: -4 },
        result: `"……미안. 내가 말을 세게 했어." {name은} 입을 벌렸다가 다물었다. 별빛이 천천히 잦아들었다. "나도. 설거지 내가 할게."` },
      { label: '서로 좀 식히자고 한다', effects: { trust: -1, stress: +3, 'stat.sens': +2, gHealth: +1 },
        result: `"바람 좀 쐬고 올게. 너도 식혀." 산책에서 돌아왔을 때 {name}의 방문은 닫혀 있었다. 아직 잠겨 있지는 않았다.`, next: 'b03_quarrel_door' },
      { label: '큐브가 끼어든다', conditions: ['rel.cube >= 45'], effects: { 'rel.cube': +4, stress: -6, trust: +2, gold: -15 },
        result: `"자, 오늘의 설거지 당번은 저 큐브입니다!" 큐브가 접시 탑을 이고 날다가 와장창 떨어뜨렸다. 둘 다 웃음이 터졌다. 싸움은 접시 조각과 함께 쓸려 나갔다.` },
    ],
  },
  {
    id: 'b03_quarrel_door', title: '닫힌 문', chainOnly: true, age: [14, 15],
    text: `이튿날까지 {name}의 방문은 닫혀 있었다. 아침을 거르고 나갔다가, 돌아와서는 다시 방으로. 문 너머로 콧노래인지 울음인지 모를 소리가 아주 작게 났다.`,
    choices: [
      { label: '문 밑으로 쪽지를 넣는다', effects: { trust: +4, 'stat.sens': +3, stress: -3 },
        result: `"어제는 내가 어른답지 못했어." 한 시간 뒤 쪽지가 문 밑으로 되돌아왔다. 한 줄이 늘어 있었다. "나도. 근데 아직 배는 안 고파."`, next: 'b03_quarrel_soup' },
      { label: '좋아하는 수프를 끓인다', effects: { trust: +2, gold: -15, 'rel.cube': +2 },
        result: `장에서 버섯을 사 와 {name이} 좋아하는 크림 수프를 올렸다. 냄새가 복도를 타고 올라갔다. 위층 문이 삐걱 열렸다.`, next: 'b03_quarrel_soup' },
      { label: '먼저 나올 때까지 기다린다', effects: { trust: -3, stress: +6, 'pers.extro': -2 },
        result: `사흘 동안 집에 말이 없었다. 나흘째, 둘은 부엌에서 마주쳐 "소금 좀"이라고만 했다. 화해는 아니었다. 휴전이었다.` },
      { label: '문에 기대 옛날이야기를 한다', conditions: ['trust >= 60'], effects: { trust: +6, 'stat.sens': +2, gHealth: -2 },
        result: `문에 등을 기대고 앉아 {name이} 열 살 때 이야기를 했다. 처음 별을 보던 밤, 처음 넘어진 날. 어느새 문 너머에서도 등을 기대는 소리가 났다.`, next: 'b03_quarrel_soup' },
    ],
  },
  {
    id: 'b03_quarrel_soup', title: '둘이 끓인 수프', chainOnly: true, age: [14, 15],
    text: `{name이} 부엌 문가에 섰다. 눈가가 조금 부어 있다. "……같이 할래? 수프." 대답 대신 앞치마 하나를 건넸다. 냄비 앞에 나란히 서는 건 몇 달 만이다.`,
    choices: [
      { label: '간은 네가 맞춰 봐', check: { stat: 'sens', dc: 120 }, minigame: 'cooking',
        success: { effects: { trust: +6, 'stat.sens': +5, stress: -10 },
          result: `후추는 과하고 소금은 모자랐는데 이상하게 맛있었다. {name이} 두 그릇을 비웠다. "싸우고 먹으면 더 맛있나 봐." "그럼 자주 싸울까?" "아니."` },
        fail: { effects: { trust: +4, 'stat.sens': +2, stress: -6 },
          result: `수프가 냄비 바닥에 눌어붙었다. 둘은 탄내 속에서 빵만 뜯었다. {name이} 먼저 웃음을 터뜨렸다. 오늘은 그걸로 됐다.` } },
      { label: '그날 하려던 말을 묻는다', effects: { trust: +5, 'stat.elo': +3, 'pers.extro': +2 },
        result: `"그때 왜 그렇게 화났어?" {name이} 국자를 저으며 말했다. "그냥…… 요즘 잘하는 게 하나도 없는 것 같아서." 수프가 끓는 동안 둘은 오래 이야기했다.` },
      { label: '말없이 요리만 한다', effects: { trust: +3, stress: -8, 'stat.hp': +2 },
        result: `둘은 거의 말하지 않았다. 양파를 썰고, 냄비를 젓고, 그릇을 놓았다. 식탁에 마주 앉자 {name이} 당신 그릇에 고기 한 점을 더 얹었다.` },
    ],
  },

  // ══ 연쇄 ④ 등대 패거리 (친구 문제) ══════════════════════════════════════
  {
    id: 'b03_kaya_crowd', title: '등대 패거리', age: [14, 15], weight: 1.4, image: 'bg/harbor',
    text: `요즘 {name}의 입에서 '카야'라는 이름이 자주 나온다. 항구 등대지기의 딸, 열여섯, 바지를 입고 어른한테도 할 말 다 한다는 애. "카야네 무리가 나도 끼워 준대. 등대 밑에서 밤바다 보기로 했어."`,
    choices: [
      { label: '가 봐. 해 지기 전까지', effects: { 'pers.extro': +3, trust: +3, stress: -4 },
        result: `{name이} 거의 뛰어나갔다. 해 지기 직전에 돌아와서는 카야 얘기를 한 시간 동안 했다. 머리카락에서 바다 냄새가 났다.`, next: 'b03_kaya_dare' },
      { label: '그 애들은 안 된다', effects: { trust: -5, 'pers.agree': -3, stress: +5 },
        result: `"만나 보지도 않고?" {name은} 접시를 탁 내려놓았다. 그 주 내내 도서관에 간다며 나갔다. 도서관에서 바다 냄새가 날 리는 없다.`, next: 'b03_kaya_dare' },
      { label: '카야를 저녁에 초대하자', effects: { 'stat.eti': +2, 'pers.extro': +2, gold: -20, trust: +2 },
        result: `카야는 진흙 묻은 장화로 들어와 큐브를 보고 "우와, 이게 뭐야" 했다. 밥을 세 그릇 먹고 설거지를 자청했다. 생각보다 괜찮은 애였다. 생각보다는.`, next: 'b03_kaya_dare' },
      { label: '검술 실력을 보여 주라 한다', conditions: ['mastery.sword >= 8'], effects: { 'stat.str': +3, 'stat.agi': +2, 'pers.extro': +2, trust: +2 },
        result: `{name은} 등대 앞 모래밭에서 카야와 막대기로 겨뤘다. 세 판 중 세 판. 카야가 모래를 털고 일어나 웃었다. "너한텐 시험 같은 거 필요 없겠다." 그날부터 {name은} 무리의 일원이었다.` },
    ],
  },
  {
    id: 'b03_kaya_dare', title: '무리의 시험', chainOnly: true, age: [14, 15], image: 'bg/market',
    text: `{name이} 굳은 얼굴로 돌아왔다. 카야 무리에 정식으로 끼려면 시험이 있단다. 장터 사과 노점에서 아무도 모르게 사과 하나 가져오기. "다들 해 봤대. 별것 아니래. ……별것 아니지?"`,
    choices: [
      { label: '그건 도둑질이야. 하지 마', effects: { 'stat.moral': +4, 'pers.good': +2, trust: -1, 'pers.extro': -1 },
        result: `{name은} 입을 삐죽였지만 고개를 끄덕였다. 다음 날 무리에서 빠졌다고 했다. 카야만 "그래, 너 그런 애지" 하고 어깨를 툭 쳤다고.` },
      { label: '스스로 판단하게 둔다', check: { stat: 'moral', dc: 110 },
        success: { effects: { 'stat.moral': +5, 'pers.good': +3, trust: +4, 'pers.extro': +1 },
          result: `{name은} 값을 치르고 사과를 들고 갔다. "가져왔어. 돈 내고." 무리가 웃음을 터뜨렸다. 카야만 웃지 않고 사과를 베어 물었다. "너 좀 멋있다."`, next: 'b03_kaya_caught' },
        fail: { effects: { 'pers.good': -3, infamy: +3, 'stat.agi': +3, stress: +6, 'flag.b03_took_apple': true },
          result: `{name은} 사과를 소매에 넣었다. 심장이 너무 뛰어 사과가 떨어질 것 같았다. 무리는 환호했다. 집에 온 {name은} 그 사과를 끝내 먹지 못했다.`, next: 'b03_kaya_caught' } },
      { label: '무리를 말로 설득해 보라 한다', conditions: ['stat.elo >= 250'], effects: { 'stat.elo': +3, reputation: +2, 'pers.extro': +2, trust: +2 },
        result: `"사과 하나로 사람 재는 무리면 나도 안 낄래. 대신 다 같이 노점 일 돕고 사과를 받는 건 어때?" 카야가 배를 잡고 웃었다. 그 주말, 무리 전체가 사과 상자를 날랐다.` },
      { label: '카야를 직접 만나 본다', effects: { trust: -4, 'stat.moral': +2, reputation: +1 },
        result: `등대를 찾아가 카야를 만났다. 카야는 "시험은 없던 걸로 할게요" 하고 순순히 말했다. 그날 밤 {name이} 문을 닫으며 말했다. "창피해 죽는 줄 알았어."`, next: 'b03_kaya_caught' },
    ],
  },
  {
    id: 'b03_kaya_caught', title: '문 앞의 노점 주인', chainOnly: true, age: [14, 15],
    text: `열흘 뒤, 사과 노점 주인이 카야의 팔을 붙들고 집 앞에 나타났다. "이 녀석이 또 훔치다 걸렸소. 같이 다니는 은발 아가씨도 한통속이라던데?" 카야가 {name을} 보며 아주 작게 고개를 저었다.`,
    choices: [
      { label: '사실대로 털어놓게 한다', conditions: ['flag.b03_took_apple'], effects: { 'stat.moral': +6, 'pers.good': +3, gold: -10, trust: +3 },
        result: `"저도 하나 가져갔어요. 그날이요." {name이} 동전을 내밀었다. 주인은 혀를 차며 받았다. 카야가 이상한 얼굴로 {name을} 오래 보았다.` },
      { label: '억울함을 직접 말하게 한다', conditions: ['!flag.b03_took_apple'], effects: { 'stat.elo': +4, 'stat.moral': +3, 'pers.extro': +2, reputation: +2 },
        result: `"저는 안 훔쳤어요. 카야한테 물어보셔도 돼요." {name이} 노점 주인의 눈을 똑바로 보았다. 카야가 고개를 끄덕였다. 주인이 머쓱하게 수염을 쓸었다.` },
      { label: '우리 애는 모른다며 문을 닫는다', effects: { infamy: +4, 'pers.good': -3, 'pers.agree': -1, trust: +2 },
        result: `"우리 애는 그날 집에 있었소." 문을 닫자 주인의 욕설이 멀어졌다. {name은} 고맙다는 말 대신 오래 침묵했다. 거짓말을 함께한 사이가 되었다.` },
      { label: '{name}에게 수습을 맡긴다', check: { stat: 'elo', dc: 130 },
        success: { effects: { 'stat.elo': +5, 'stat.moral': +3, reputation: +2, trust: +3 },
          result: `"카야랑 제가 일주일 동안 노점 일을 도울게요. 그걸로 갚아요." 주인이 눈을 껌뻑였다. 일주일 뒤, 카야는 사과 쌓는 법을 {name}보다 잘하게 됐다.` },
        fail: { effects: { stress: +8, 'pers.extro': -2, 'stat.elo': +2, reputation: -2 },
          result: `{name은} 입을 열었지만 아무 말도 나오지 않았다. 주인은 카야를 끌고 갔다. 그날 밤 {name은} 늦게까지 창밖 항구 쪽을 보았다.` } },
    ],
  },

  // ══ 외모와 정체성 ═══════════════════════════════════════════════════════
  {
    id: 'b03_mirror_hair', title: '닮은 데 찾기', age: [13, 15], weight: 1.5,
    text: `{name이} 당신 손을 끌어 거울 앞에 세웠다. 거울 속 두 얼굴을 한참 번갈아 보더니 한숨을 쉬었다. "장터 아주머니가 그러더라. 하나도 안 닮았다고." 은백색 머리, 붉은 눈. "나는 누구를 닮은 걸까."`,
    choices: [
      { label: '닮은 데를 같이 찾아본다', effects: { trust: +6, 'stat.sens': +3, stress: -4 },
        result: `둘은 거울 앞에서 한참을 버텼다. 웃을 때 왼쪽 눈이 먼저 감기는 것, 생각할 때 입술을 무는 것. "이거 {call} 버릇이잖아." "네가 따라 한 거지." "……그럼 닮은 거네."` },
      { label: '그 머리는 달빛 같다고 한다', check: { stat: 'chm', dc: 130 },
        success: { effects: { 'stat.chm': +5, 'pers.extro': +2, trust: +3 },
          result: `"달빛? {call} 눈에만 그렇겠지." 그래도 다음 날 {name은} 머리를 묶지 않고 장터에 나갔다. 저녁엔 누가 머리가 예쁘다고 했다는 얘기를 아무렇지 않은 척 세 번이나 했다.` },
        fail: { effects: { stress: +5, trust: -2, 'pers.extro': -2 },
          result: `"부모는 다 그렇게 말해." {name은} 거울을 벽 쪽으로 돌려 놓았다. 그 주 내내 두건을 깊이 눌러쓰고 다녔다.` } },
      { label: '쓸데없는 소리라고 넘긴다', effects: { trust: -4, 'pers.extro': -2, 'pers.roman': -1, stress: +4 },
        result: `"남의 얼굴 품평하는 소리에 귀 기울이지 마." {name은} 고개를 끄덕였지만 거울에 천을 덮었다. 그 뒤로 한동안 장터에 갈 때마다 두건을 썼다.` },
      { label: '숨기라던 말을 사과한다', conditions: ['flag.magic_hidden'], effects: { trust: +7, 'stat.mag': +3, 'pers.extro': +2 },
        result: `"마법 숨기라고 했던 거, 너를 숨기라는 말로 들렸겠다. 미안해." {name이} 거울에서 눈을 떼고 당신을 보았다. "……응. 나만 이상한 애 같았어." 거울 속에서 금빛이 조용히 반짝였다.` },
    ],
  },
  {
    id: 'b03_monochrome', title: '흑백의 옷장', age: [13, 15], weight: 1.3, image: 'bg/market',
    text: `옷 가게에서 당신이 고른 분홍 원피스를 {name이} 슬쩍 내려놓았다. 요즘 {name은} 검은 하이넥, 흰 니트, 발목까지 오는 검은 치마만 입는다. "색 있는 옷을 입으면 별빛이 더 튀어. 검은 데선 그냥…… 별 같고."`,
    choices: [
      { label: '그래도 분홍을 사 준다 (-80G)', conditions: ['gold >= 80'], effects: { gold: -80, 'stat.chm': +3, trust: -3, 'pers.roman': +1 },
        result: `원피스는 옷장 맨 끝에 걸렸다. 딱 한 번, 별의 밤에 {name이} 그걸 입고 나왔다. "오늘만이야." 별빛이 분홍 위에서 정말로 튀었다.` },
      { label: '색 하나만 더하자 (-25G)', effects: { gold: -25, 'stat.chm': +4, 'stat.cult': +2, trust: +4 },
        result: `한참을 고른 끝에 {name은} 리본 하나를 집었다. "한 가지 색이면 별이랑 안 싸워." 검은 옷에 색 하나, 그리고 금빛. 그날부터 그게 {name}의 모습이 되었다.` },
      { label: '네가 좋은 걸 입으렴', effects: { trust: +3, 'pers.extro': -2, 'stat.sens': +2 },
        result: `"검은 걸 입으면 사람들이 나 말고 별만 봐. 그게 편해." {name은} 흰 니트 소매를 손등까지 끌어내렸다. 당신은 그 소매를 오래 보았다.` },
      { label: '테오도라에게 물어보라 한다', conditions: ['rel.theodora >= 30'], effects: { 'rel.theodora': +5, 'stat.eti': +3, 'stat.chm': +2 },
        result: `테오도라가 옷장을 훑었다. "흑백이라니, 수녀원 가니? ……근데 너한텐 맞네. 진홍은 내 색이니까 넘보지 마." 그러고는 금실 브로치를 던져 주었다.` },
    ],
  },
  {
    id: 'b03_bangs', title: '일자 앞머리', age: [13, 14], weight: 1.2,
    text: `저녁 식탁에 앉은 {name}의 앞머리가 눈썹을 덮을락 말락 일자로 잘려 있었다. 가위 자국이 조금 삐뚤다. "내가 잘랐어. 허락받아야 돼? 내 머리인데." 말은 당당한데 눈은 당신 표정을 살핀다.`,
    choices: [
      { label: '잘 어울린다고 웃는다', effects: { trust: +4, 'stat.chm': +2, 'pers.agree': -1 },
        result: `"……진짜?" {name은} 앞머리를 손끝으로 쓸어내렸다. 그 뒤로 앞머리는 늘 그 길이였다. 눈썹을 살짝 덮는, 딱 그만큼.` },
      { label: '삐뚠 데만 다듬어 준다', effects: { trust: +5, 'stat.sens': +2, stress: -3 },
        result: `가위를 들자 {name이} 눈을 꼭 감았다. 삐뚠 데를 세 번 다듬었다. 거울을 본 {name이} 말했다. "처음부터 {call}한테 해 달라고 할걸."` },
      { label: '말도 없이 잘랐다고 혼낸다', effects: { trust: -5, 'pers.agree': +1, stress: +5, 'stat.eti': +2 },
        result: `"머리 자르는 것까지 물어봐야 해?" {name은} 반쯤 먹은 접시를 두고 일어섰다. 다음 날 아침엔 앞머리를 핀으로 넘겨 이마를 다 드러내고 나갔다. 일부러.` },
      { label: '별 머리핀으로 옆머리를 꽂는다', conditions: ['item.silver_hairpin >= 1'], effects: { 'stat.chm': +4, trust: +3, 'pers.roman': +2 },
        result: `서랍에서 별 모양 은 머리핀을 꺼내 긴 옆머리 한쪽에 꽂아 주었다. 일자 앞머리, 긴 생머리, 작은 별. {name이} 거울 앞에서 고개를 갸웃했다. "……나 좀 괜찮은데?"` },
    ],
  },
  {
    id: 'b03_roof_stars', title: '지붕 위의 아이', age: [13, 16], weight: 1.3, image: 'bg/starnight',
    text: `밤중에 지붕 위에서 기와 밟는 소리가 났다. {name이} 지붕 꼭대기에 무릎을 안고 앉아 세 개의 달을 보고 있었다. "{call}, 나 원래 저기 살았을까? 저기서 누가 나를 기다리고 있을까?"`,
    choices: [
      { label: '사다리를 놓고 옆에 앉는다', effects: { trust: +5, gHealth: -2, 'stat.sens': +3 },
        result: `기와가 삐걱거렸다. 옆에 앉자 {name이} 어깨를 붙였다. "무서우면서 왜 올라왔어?" "네가 여기 있으니까." 둘은 달이 기울 때까지 내려가지 않았다.` },
      { label: '위험하니 내려오라고 한다', effects: { trust: +1, 'pers.agree': -1, gold: -20, 'stat.sens': +2 },
        result: `{name은} 투덜대며 내려왔다. 다음 날 밤에도 기와 소리가 났다. 그다음 날도. 당신은 결국 지붕에 작은 난간을 달았다.` },
      { label: '망원경을 들고 올라간다', conditions: ['item.telescope >= 1'], effects: { 'stat.int': +4, 'stat.sens': +3, trust: +4 },
        result: `놋쇠 망원경으로 본 달은 생각보다 울퉁불퉁했다. "저기엔 아무도 안 살겠다." {name이} 조금 안심한 듯 웃었다. "그럼 난 여기 사람이네."` },
      { label: '아직 말 못 할 게 있다고 한다', conditions: ['flag.origin_hidden', '!flag.knows_origin'], effects: { trust: +4, 'stat.sens': +2, stress: +4 },
        result: `"너에 대해 아는 게 조금 있어. 아직 말할 때는 아니야. 그래도 숨기는 게 있다는 것까진 숨기기 싫었어." {name은} 오래 달을 보다가 말했다. "……기다릴게. 너무 오래는 말고."` },
    ],
  },

  // ══ 신뢰의 갈림길 ═══════════════════════════════════════════════════════
  {
    id: 'b03_cold_table', title: '말 없는 식탁', age: [14, 16], weight: 2.5, conditions: ['trust <= 35'],
    text: `요즘 {name은} "응", "아니", "몰라" 세 마디로 산다. 저녁 식탁에선 숟가락 소리만 난다. 오늘은 그마저도 없이 일찍 일어나 방으로 들어갔다. 손도 안 댄 빵이 남았다.`,
    choices: [
      { label: '매일 하나씩 가볍게 묻는다', effects: { trust: +6, gHealth: -2, 'pers.extro': +1 },
        result: `"오늘 장터에 뭐 있었어?" "……몰라." 다음 날도, 그다음 날도 물었다. 열흘째, {name이} 말했다. "사과가 쌌어." 그게 시작이었다.` },
      { label: '태도를 고치라고 못 박는다', effects: { trust: -6, 'pers.agree': +2, stress: +8 },
        result: `"한집에 사는 이상 대답은 제대로 해." "네." {name은} 존댓말로 대답했다. 반말보다 훨씬 멀게 들렸다.` },
      { label: '억지로 다가가지 않는다', effects: { trust: -2, stress: -5, 'pers.extro': -2 },
        result: `아무것도 묻지 않았다. 집은 조용해졌고 {name은} 편해 보였다. 다만 그 조용함이 언제 끝날지는 아무도 몰랐다.` },
      { label: '달무리를 식탁에 올린다', conditions: ['flag.has_cat'], effects: { trust: +4, stress: -6, 'stat.sens': +2 },
        result: `달무리가 식탁 위를 어슬렁거리다 {name}의 빵을 툭 쳐서 떨어뜨렸다. "야!" {name이} 웃음을 참다 실패했다. 몇 주 만에 듣는 웃음소리였다.` },
    ],
  },
  {
    id: 'b03_kitchen_night', title: '새벽 두 시의 부엌', age: [14, 16], weight: 1.5, conditions: ['trust >= 65'],
    text: `잠이 안 와 부엌에 내려가니 {name이} 먼저 와 있었다. 데운 우유 두 잔. 하나를 당신 쪽으로 밀었다. "나 요즘 이상해. 친구들이랑 웃다가도 갑자기 여기가 내 자리가 아닌 것 같아. 하늘에서 떨어진 애라서 그런가."`,
    choices: [
      { label: '새벽까지 들어 준다', effects: { trust: +8, 'stat.sens': +4, gHealth: -3 },
        result: `창밖이 파래질 때까지 {name은} 이야기했다. 당신은 거의 말하지 않았다. 마지막 우유를 비우며 {name이} 말했다. "반은 가벼워졌어. 나머지 반은 {call이} 들고 있어 줘."` },
      { label: '네 자리는 여기라고 말한다', effects: { trust: +5, stress: -8, 'pers.roman': +2 },
        result: `"네 자리는 여기야. 네가 떠나도 여기야." {name은} 잔을 두 손으로 감쌌다. "떠나도?" "떠나도." 우유 잔 위로 별빛이 잠깐 반짝였다.` },
      { label: '차근차근 조언을 해 준다', effects: { trust: +2, 'stat.int': +3, 'pers.roman': -2 },
        result: `그 나이엔 누구나 그렇다고, 자리는 찾는 게 아니라 만드는 거라고 말했다. {name은} 고개를 끄덕였지만 눈은 조금 실망한 듯했다. 듣고 싶은 건 정답이 아니었다.` },
      { label: '편지 이야기를 했던 밤을 꺼낸다', conditions: ['flag.open_talk'], effects: { trust: +6, 'stat.mag': +2, 'pers.agree': +2 },
        result: `"탑에서 편지 왔을 때도 여기서 이야기했지." {name이} 고개를 끄덕였다. "그때 {call이} 다 들어 줘서, 이번에도 내려온 거야."` },
    ],
  },
  {
    id: 'b03_open_door', title: '열린 방문', age: [16, 16], weight: 3, conditions: ['flag.respected_privacy', 'trust >= 60'],
    text: `몇 년 동안 늘 닫혀 있던 {name}의 방문이 오늘은 활짝 열려 있다. "{call}, 잠깐 들어와 볼래?" 책상 위에 손으로 그린 왕국 지도가 펼쳐져 있었다. "앞으로 뭘 할지 생각 중이야. {call} 생각도 듣고 싶어서."`,
    choices: [
      { label: '지도를 같이 들여다본다', effects: { trust: +8, 'stat.int': +3, 'pers.ambit': +2 },
        result: `지도에는 별표가 여럿 찍혀 있었다. 왕도, 항구, 마법탑, 그리고 우리 집. 우리 집 별표가 제일 컸다. "여긴 출발점이라서." {name이} 얼른 덧붙였다.` },
      { label: '네가 정하면 응원하겠다', effects: { trust: +6, 'pers.agree': +2, stress: -6 },
        result: `"그 말 할 줄 알았어." {name이} 웃었다. "근데 오늘은 의견을 달라는 거야." 당신이 한참 생각하다 말하자, {name은} 그걸 일기장에 받아 적었다.` },
      { label: '서랍 열쇠 이야기를 꺼낸다', conditions: ['flag.b03_drawer_lock'], effects: { trust: +7, 'stat.sens': +3, 'pers.extro': +2 },
        result: `{name이} 목에 건 열쇠로 서랍을 열었다. 큐브 낙서, 말린 들꽃, 그리고 당신 얼굴을 그린 그림 열두 장. "열 수 있는 사람이 나뿐이라서 넣어 둔 거야."` },
      { label: '네 시간표는 늘 네 거였다', conditions: ['flag.b03_her_schedule'], effects: { trust: +6, 'pers.ambit': +3, 'stat.elo': +2 },
        result: `"처음 내가 시간표 짰을 때 엉망이었잖아." "그래도 네 거였지." {name은} 지도 위에 손가락으로 길을 그었다. "이것도 내가 짤게. 가끔 검사만 해 줘."` },
    ],
  },
  {
    id: 'b03_far_letter', title: '열여덟이 되면', age: [16, 16], weight: 3, conditions: ['trust <= 35'], image: 'bg/road',
    text: `{name}의 책상에 종이가 펼쳐져 있었다. "열여덟이 되면 갈 곳." 항구, 남쪽 섬들, 지도에 없는 산맥. 목록 어디에도 이 집은 없었다. {name이} 종이를 뒤집었다. "보라고 둔 거 아니야. 근데 봤으면 뭐."`,
    choices: [
      { label: '이 집도 넣어 달라고 한다', check: { stat: 'elo', dc: 145 },
        success: { effects: { trust: +12, 'pers.agree': +2, stress: -4 },
          result: `"……여기를?" {name은} 한참 펜을 굴리다 목록 맨 아래에 작게 적었다. '집 — 가끔.' 그걸 본 당신의 얼굴을, {name이} 못 본 척했다.` },
        fail: { effects: { trust: -3, stress: +6, 'pers.agree': -2 },
          result: `"이제 와서?" {name은} 종이를 접어 주머니에 넣었다. 그 뒤로 책상 위엔 아무것도 펼쳐져 있지 않았다.` } },
      { label: '떠나는 법을 가르쳐 준다', effects: { trust: +3, 'stat.agi': +3, 'stat.hp': +2, 'stat.int': +2, 'pers.extro': +2 },
        result: `지도 읽는 법, 별로 방향 잡는 법, 여관에서 바가지 안 쓰는 법을 가르쳤다. {name은} 의외라는 얼굴로 받아 적었다. "말릴 줄 알았는데." "말린다고 안 갈 애도 아니잖아."` },
      { label: '떠나는 건 허락 못 한다', effects: { trust: -8, 'pers.agree': -4, stress: +8 },
        result: `"허락?" {name이} 웃었다. 웃음이 아니었다. "열여덟이면 허락 같은 거 필요 없어." 목록에 한 줄이 늘었다. 더 먼 곳으로.` },
      { label: '나도 네 나이 땐 그랬다', conditions: ['flag.b03_shared_past'], effects: { trust: +7, 'pers.roman': +2, 'stat.sens': +2 },
        result: `"전에 얘기했지. 나도 네 나이 땐 어디로든 가고 싶었다고." {name이} 고개를 들었다. "……그래서, 어디까지 갔어?" "돌고 돌아 여기. 너 있는 데까지."` },
    ],
  },
  {
    id: 'b03_packed_bag', title: '침대 밑의 가방', age: [14, 16], weight: 2.5,
    conditions: ['!flag.ran_away', (s) => s.trust <= 45 || (s.counters.b03_bag_ready || 0) > 0],
    text: `{name}의 침대 밑에서 꾸려 둔 가방이 나왔다. 여벌 옷 두 벌, 빵 한 덩이, 동전 몇 닢, 그리고 열 살 때 입던 작은 망토. 돌아보니 {name이} 문가에 서 있었다. 숨길 생각도 없는 얼굴이었다.`,
    choices: [
      { label: '가방을 풀어 버린다', effects: { trust: -8, 'pers.agree': -3, stress: +8 },
        result: `옷을 하나하나 옷장에 다시 걸었다. {name은} 말리지 않았다. 다 걸고 나자 {name이} 말했다. "가방은 또 쌀 수 있어." 그 말이 맞았다.` },
      { label: '빵과 외투를 더 넣어 준다', effects: { 'flag.ran_away': true, trust: +6, gHealth: -6, 'stat.hp': +2 },
        result: `빵 한 덩이와 두꺼운 외투를 가방에 넣고 쪽지를 얹었다. "어디 있는지만 알려 줘." 그날 밤 {name은} 떠났다. 이튿날 양치기 편에 "강 건너. 잘 있어"라는 쪽지가 왔고, 나흘째 아침 {name이} 돌아왔다.` },
      { label: '어디 가려고 했는지 묻는다', check: { stat: 'sens', dc: 125, bonus: (s) => s.trust * 0.5 },
        success: { effects: { trust: +8, 'stat.elo': +3, 'pers.agree': +2 },
          result: `"모르겠어. 그냥 여기 말고." 둘은 바닥에 앉아 가방 속 물건을 하나씩 꺼내며 이야기했다. 마지막으로 꺼낸 작은 망토에서 {name이} 울음을 터뜨렸다.` },
        fail: { effects: { 'flag.ran_away': true, trust: -4, gHealth: -5, stress: +6 },
          result: `"말해 봤자 {call은} 몰라." 다음 날 아침, 가방과 {name이} 함께 사라졌다. 사흘 뒤 항구 여관에서 일하던 {name을} 찾았다. 돌아오는 길 내내 아무 말이 없었다.` } },
      { label: '가렛에게 데려가 일을 맡긴다', conditions: ['rel.garrett >= 30'], effects: { 'flag.ran_away': true, 'rel.garrett': +6, 'stat.str': +4, trust: +2 },
        result: `"떠나고 싶으면 제대로 떠나 봐." {name을} 가렛에게 맡겼다. 일주일 동안 용병단 숙소에서 짐을 나르고 돌아온 {name이} 말했다. "밖에서 사는 거, 생각보다 시끄럽더라."` },
    ],
  },

  // ══ 보호자에게 실망 ═════════════════════════════════════════════════════
  {
    id: 'b03_broken_promise', title: '비어 있던 객석', age: [14, 15], weight: 1.3, image: 'bg/school',
    text: `{name이} 몇 주를 연습한 학교 발표회 군무 날이었다. 일이 늦게 끝나 막이 내린 뒤에야 도착했다. 텅 빈 객석 끝에 {name이} 혼자 앉아 있었다. "괜찮아." 너무 빨리 나온 대답이었다.`,
    choices: [
      { label: '변명 없이 사과한다', effects: { trust: +3, 'pers.agree': +1, stress: -3 },
        result: `"미안해. 변명은 안 할게." {name은} 한참 신발 끝만 보다가 일어섰다. "……다음엔 맨 앞줄이야. 약속해." 당신은 새끼손가락을 내밀었다.` },
      { label: '여기서 다시 보여 달라고 한다', check: { stat: 'chm', dc: 120 }, minigame: 'ball',
        success: { effects: { trust: +7, 'stat.chm': +4, 'stat.agi': +3 },
          result: `"……지금? 여기서?" 투덜대며 {name이} 무대에 올랐다. 관객 한 명, 등불 하나. 마지막 인사를 할 때 {name은} 웃고 있었다. "관객이 좀 적네." "최고의 관객이지."` },
        fail: { effects: { trust: +2, stress: +5, 'stat.chm': +1 },
          result: `무대에 오른 {name은} 첫 동작에서 목이 메었다. "못 하겠어. 오늘은." 당신은 박수를 쳤다. 아무것도 안 했는데 왜 치냐고, {name이} 울면서 웃었다.` } },
      { label: '일이 중요했다고 설명한다', effects: { trust: -5, gold: +40, 'pers.ambit': +2, 'pers.roman': -2 },
        result: `"그 일 안 하면 이번 달 수업료를 못 내." 틀린 말은 아니었다. {name은} "알아"라고 했다. 알아서 더 서운하다는 얼굴로.` },
      { label: '가렛에게 진 빚 이야기를 한다', conditions: ['flag.debt_garrett'], effects: { trust: +5, 'stat.int': +2, stress: +3, 'pers.ambit': +2 },
        result: `지붕 고칠 때 진 빚 때문에 가렛 일을 돕고 있다는 걸 처음으로 털어놓았다. {name이} 눈을 크게 떴다. "왜 말 안 했어? 나도 같이 갚을 수 있었는데."` },
    ],
  },
  {
    id: 'b03_overheard', title: '담장 너머의 자랑', age: [14, 15], weight: 1.2,
    text: `이웃과 담장 너머로 이야기하던 당신은 {name이} 뒤에 서 있는 걸 몰랐다. "우리 애는 머리가 좋아서 언젠가 왕도에서 크게 될 거요." 이웃이 돌아간 뒤 {name이} 물었다. "……내가 크게 안 되면, 창피해?"`,
    choices: [
      { label: '그냥 자랑하고 싶었다고 한다', effects: { trust: +4, stress: -4, 'pers.ambit': -2 },
        result: `"네가 뭘 하든 자랑할 거야. 밭을 갈아도." {name이} 코웃음을 쳤다. "밭 가는 걸 무슨 자랑을 해." 그래도 어깨가 조금 내려갔다.` },
      { label: '기대하는 건 맞다고 말한다', effects: { trust: +1, 'pers.ambit': +3, stress: +6, 'stat.int': +2 },
        result: `"기대는 해. 네가 할 수 있는 걸 아니까." {name은} 고개를 끄덕였다. 그날 밤 방에서 늦게까지 촛불이 켜져 있었다. 기대에는 무게가 있다.` },
      { label: '네 꿈은 뭔지 되묻는다', check: { stat: 'sens', dc: 120 },
        success: { effects: { trust: +6, 'stat.sens': +3, 'pers.ambit': -1 },
          result: `"……아직 몰라. 근데 '크게'는 아닐 수도 있어. 작아도 내 거면 좋겠어." 처음 듣는 말이었다. 당신은 그 말을 오래 기억했다.` },
        fail: { effects: { trust: -2, stress: +4, 'pers.extro': -1 },
          result: `"몰라. 그런 거 묻지 마." {name은} 방으로 들어갔다. 답을 모르는 질문만큼 무거운 건 없다.` } },
      { label: '"크다"의 뜻부터 따져 보자', conditions: ['stat.int >= 330'], effects: { 'stat.int': +3, 'pers.roman': +2, trust: +4, stress: -3 },
        result: `{name이} 종이에 '크다'의 뜻을 열 가지 적었다. 키, 목소리, 재산, 이름, 마음. 한참 보다가 마지막 줄에 동그라미를 쳤다. "이걸로 할래. 마음 큰 사람."` },
    ],
  },
  {
    id: 'b03_guardian_youth', title: '{call}도 그랬어?', age: [14, 15], weight: 1.3, guardian: true,
    text: `빨래를 널다가 {name이} 불쑥 물었다. "{call}도 내 나이 때 반항했어? 아니면 태어날 때부터 어른이었어?" 장난처럼 물었지만, 빨래집게를 쥔 손이 멈춰 있었다.`,
    choices: [
      { label: '젊은 날 이야기를 들려준다', effects: { trust: +6, 'pers.extro': +1, 'flag.b03_shared_past': true },
        result: (s) => YOUTH_STORY[s.guardian] ?? YOUTH_STORY.knight },
      { label: '나는 착한 아이였다고 한다', effects: { trust: -2, 'pers.agree': +1, stress: +2 },
        result: `"난 말 잘 듣는 아이였어." {name이} 눈을 가늘게 떴다. "거짓말. 큐브가 다 말해 줬어." 큐브가 그런 걸 알 리가 없다. 아마도.` },
      { label: '담 넘는 시범을 보인다', conditions: ["guardian == 'knight'"], effects: { 'stat.agi': +4, trust: +4, gHealth: -3, 'flag.b03_shared_past': true },
        result: `마당 담장을 훌쩍 넘어 보이려다 바지가 걸렸다. {name이} 배를 잡고 웃었다. "옛날엔 됐다며!" "옛날엔 됐어." 성벽 넘던 견습 기사 이야기는 그 뒤에 이어졌다.` },
      { label: '떠돌던 시절 공책을 꺼낸다', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +3, 'stat.sens': +3, trust: +5, 'flag.b03_shared_past': true },
        result: `낡은 공책에는 열다섯 살의 글씨로 "집에는 안 돌아간다"고 적혀 있었다. {name이} 한 장 한 장 넘기다 웃었다. "글씨가 나보다 못하네."` },
    ],
  },

  // ══ 작은 반항과 큰 반항 ═════════════════════════════════════════════════
  {
    id: 'b03_skipped', title: '빈 책상', age: [14, 15], weight: 1.4, image: 'bg/river',
    requiresActivity: ['school', 'etiquette', 'magic', 'commerce', 'theology'],
    text: `선생님의 쪽지가 왔다. "따님이 이번 달 세 번 결석했습니다." 당신이 아는 한 {name은} 매일 아침 가방을 메고 나갔다. 저녁에 돌아온 {name}의 신발엔 강가 모래가 묻어 있었다.`,
    choices: [
      { label: '교문 앞까지 데려다준다', effects: { trust: -5, 'pers.agree': +2, stress: +6, 'stat.int': +3 },
        result: `다음 날부터 교문 앞까지 따라갔다. 아이들이 키득거렸다. {name은} 한 번도 뒤돌아보지 않았다. 결석은 멈췄다. 대화도 멈췄다.` },
      { label: '어디 갔었는지 보여 달라고 한다', effects: { trust: +5, 'stat.sens': +3, 'pers.roman': +2 },
        result: `{name은} 망설이다 강가 버드나무 아래로 당신을 데려갔다. 돌로 쌓은 작은 의자, 반쯤 그린 강 그림. "여기선 아무도 뭘 하라고 안 해." 당신은 그 의자에 같이 앉았다.` },
      { label: '보충 시험을 보게 한다', check: { stat: 'int', dc: 125 }, minigame: 'exam',
        success: { effects: { 'stat.int': +6, trust: +2, reputation: +2 },
          result: `{name은} 보충 시험에서 반 둘째 점수를 받았다. 선생님이 고개를 갸웃했다. "빠진 날 공부는 어디서 했니?" "강가에서요." 거짓말은 아니었다.` },
        fail: { effects: { 'stat.int': +2, stress: +8, trust: -2 },
          result: `시험지는 반쯤 비어 있었다. {name은} 시험지를 접어 주머니에 넣었다. "알아. 빠지면 이렇게 되는 거." 혼낼 말이 남지 않았다.` } },
      { label: '억지로 시킨 수업이었는지 묻는다', conditions: ['count.forced >= 4'], effects: { trust: +6, 'pers.agree': +1, stress: -5 },
        result: `"……응. 내가 고른 거 아니잖아." {name이} 처음으로 그렇게 말했다. 당신은 다음 달 시간표를 펼쳐 놓았다. "그럼 한 칸은 네가 골라."` },
    ],
  },
  {
    id: 'b03_declaration', title: '내 시간표', age: [14, 15], weight: 1.8, conditions: ['pers.agree <= -15'],
    text: `{name이} 시간표를 식탁에 내리쳤다. "이거 다 {call이} 짠 거잖아. 다음 달부터 내 시간표는 내가 짤 거야. 싫으면 나 집 나가." 늘 반짝이던 별빛이 오늘은 불티처럼 따갑다.`,
    choices: [
      { label: '좋아. 다음 달은 네가 짜 봐', effects: { trust: +8, 'pers.agree': +2, 'pers.ambit': +2, 'stat.int': -2, 'flag.b03_her_schedule': true },
        result: `{name은} 입을 벌린 채 굳었다. 이겨 놓고 어쩔 줄 모르는 얼굴이었다. 그날 밤 종이 구기는 소리가 열 번쯤 났다. 다음 달 시간표 맨 윗칸에는 '늦잠'이라고 적혀 있었다.` },
      { label: '이 집 규칙은 내가 정한다', effects: { trust: -10, 'pers.agree': -4, stress: +10, 'count.b03_bag_ready': +1 },
        result: `{name은} 한참 당신을 보다가 말없이 시간표를 주워 들었다. 그 침묵이 문 닫는 소리보다 컸다. 그날부터 {name}의 침대 밑에 가방 하나가 늘 꾸려져 있었다.` },
      { label: '한 칸씩 나눠 짜자고 한다', check: { stat: 'elo', dc: 135 },
        success: { effects: { trust: +5, 'stat.elo': +4, 'pers.agree': +2, 'flag.b03_her_schedule': true },
          result: `"세 칸 중 한 칸은 네 거. 나머지 두 칸은 이유를 설명할게." {name은} 팔짱을 낀 채 오래 생각했다. "이유가 마음에 안 들면?" "또 이야기하자." 합의였다.` },
        fail: { effects: { trust: -3, stress: +6, 'pers.agree': -2 },
          result: `"나눠 짜자는 것도 {call이} 정한 거잖아." 협상은 결렬됐다. {name은} 다음 달 시간표에 크게 X를 그려 놓았다.` } },
      { label: '생일에 한 약속을 지킨다', conditions: ['flag.b03_birthday_promise'], effects: { trust: +10, 'pers.agree': +2, stress: -6, 'flag.b03_her_schedule': true },
        result: `"생일날 약속했잖아. 네가 정하라고." {name이} 멈칫했다. "……기억하고 있었어?" "응. 내가 늦었어." 따갑던 별빛이 천천히 잦아들었다.` },
    ],
  },
  {
    id: 'b03_first_wage', title: '내가 번 돈', age: [14, 15], weight: 1.3,
    requiresActivity: ['farm', 'diner', 'inn', 'sewing', 'smith', 'castle', 'shop', 'theater', 'graveyard'],
    text: `품삯을 받은 날, {name이} 동전 주머니를 등 뒤로 감췄다. "이번 건 생활비에 안 보탤래. 내가 번 거니까 내가 쓸 거야." 당신이 무슨 말을 할지 이미 알고 있다는 얼굴이다.`,
    choices: [
      { label: '번 돈은 네 것이다', effects: { gold: -40, trust: +5, 'pers.ambit': +2 },
        result: `{name은} 주머니를 꼭 쥐었다. 일주일 뒤 그 돈으로 산 건 자기 물건이 아니라 당신의 겨울 장갑이었다. "남은 건 내 거야." 남은 건 동전 세 닢이었다.` },
      { label: '절반은 집에 보태자', effects: { gold: -20, 'stat.moral': +2, 'pers.agree': +1, trust: +1 },
        result: `"반은 네 거, 반은 우리 집 거." {name은} 동전을 두 무더기로 나눴다. 집 무더기가 조금 더 컸다. 일부러 그런 것 같았다.` },
      { label: '우리 형편에 무슨 소리냐', effects: { trust: -6, 'pers.agree': -2, stress: +6, 'pers.roman': -2 },
        result: `{name은} 주머니를 식탁에 던지듯 내려놓았다. "그럼 나는 왜 일해? 일하는 기계야?" 다음 달부터 {name}의 일하는 손이 눈에 띄게 느려졌다.` },
      { label: '가죽 장부에 적게 한다', conditions: ['item.ledger_book >= 1'], effects: { gold: -40, 'stat.int': +3, 'stat.elo': +3, 'pers.ambit': +2, trust: +2 },
        result: `가죽 장부를 건넸다. "네 돈이야. 대신 어디 썼는지는 네가 알 수 있게 적어 둬." {name은} 첫 줄에 이렇게 썼다. "품삯 — 내 것."` },
    ],
  },
  {
    id: 'b03_nina_secret', title: '친구의 비밀', age: [14, 15], weight: 1.3,
    text: `{name이} 방문을 닫고 작게 말했다. "비밀 지킬 수 있어? 니나가 다음 달에 떠돌이 극단 마차에 몰래 타고 왕도로 간대. 부모님은 몰라. 나한테만 말했어. 말리면 절교래."`,
    choices: [
      { label: '니나 부모님께 알린다', effects: { 'stat.moral': +3, trust: -6, reputation: +2 },
        result: `니나의 부모는 마차가 떠나기 전날 니나를 붙잡았다. 니나는 {name}에게 다시 말을 걸지 않았다. {name}도 한동안 당신에게 말을 걸지 않았다. "비밀이라고 했잖아."` },
      { label: '니나를 같이 설득해 보라 한다', check: { stat: 'chm', dc: 125 },
        success: { effects: { 'stat.chm': +4, trust: +5, 'stat.moral': +2 },
          result: `{name은} 니나와 밤새 이야기했다. 극단에 가고 싶으면 단장에게 정식으로 편지를 쓰자고. 둘이 함께 쓴 편지에 답장이 왔다. "열여섯이 되면 오너라."` },
        fail: { effects: { stress: +8, trust: +2, 'pers.extro': -2 },
          result: `"너도 어른들이랑 똑같아." 니나는 그렇게 말하고 떠났다. 사흘 뒤 왕도 근처에서 붙잡혀 돌아왔다. {name은} 니나에게 무슨 말을 해야 할지 몰랐다.` } },
      { label: '비밀을 지켜 준다', effects: { trust: +5, 'pers.good': -2, 'pers.agree': -1, stress: +5, reputation: -2 },
        result: `아무에게도 말하지 않았다. 니나는 떠났고 마을이 뒤집혔다. 열흘 뒤 왕도에서 잘 지낸다는 편지가 왔다. 니나 부모님은 {name이} 알고 있었다는 걸 알고 한동안 인사를 받지 않았다.` },
      { label: '집 나갔던 밤 이야기를 묻는다', conditions: ['flag.ran_away'], effects: { trust: +4, 'stat.elo': +3, 'stat.moral': +2 },
        result: `"너 그때 집 나갔을 때 어땠어?" {name이} 오래 생각했다. "……추웠어. 돌아올 데가 있어서 다행이었어." 그 말을 그대로 전해 들은 니나는 마차에 타지 않았다.` },
    ],
  },
  {
    id: 'b03_lantern_night', title: '올해는 친구들이랑', age: [14, 15], season: 'summer', conditions: ['month != 6'], weight: 2, image: 'bg/river',
    text: `강에 등불을 띄우는 여름밤. 해마다 당신 손을 잡고 가던 날이다. {name이} 신발 끈을 묶으며 말했다. "올해는 친구들이랑 갈게. {call은}…… 안 와도 돼. 아니, 오지 마."`,
    choices: [
      { label: '잘 다녀오라고 보낸다', effects: { trust: +4, 'pers.extro': +3, stress: -4 },
        result: `{name은} 뒤돌아보지 않고 뛰어갔다. 당신은 마당에서 띄울 데도 없는 등불을 들고 서 있었다. 밤늦게 돌아온 {name이} 그걸 보더니, 말없이 같이 강가로 다시 나가 주었다.` },
      { label: '멀찍이서 몰래 지켜본다', effects: { trust: -4, gHealth: -1, 'pers.agree': -1, 'rel.cube': +2 },
        result: `버드나무 뒤에 숨어 있다가 큐브의 날개 빛 때문에 들켰다. 친구들이 키득거렸다. {name은} 얼굴이 빨개져 당신을 노려보았다. 집에 와서 한마디만 했다. "창피해."` },
      { label: '등불을 같이 만들어 보낸다', check: { stat: 'sens', dc: 115 },
        success: { effects: { trust: +5, 'stat.sens': +4, 'pers.roman': +2 },
          result: `둘이 만든 등불은 그날 밤 강에서 제일 오래 떠 있었다. 누가 만들었냐는 친구들 물음에 {name이} 잠깐 망설이다 답했다. "우리 {call이랑}."` },
        fail: { effects: { trust: +2, 'stat.sens': +2, stress: +3 },
          result: `등불은 강에 닿자마자 기울어 꺼졌다. {name은} 친구들 앞에서 웃어넘겼지만, 집에 와서 그 등불 뼈대를 방 벽에 걸어 두었다.` } },
      { label: '용돈을 쥐여 보낸다 (-30G)', conditions: ['gold >= 30'], effects: { gold: -30, trust: +3, 'pers.extro': +2, 'stat.chm': +2 },
        result: `{name은} 동전을 받아 들고 잠깐 머뭇거리다 "고마워" 하고 뛰어갔다. 돌아올 때 손에 꿀과자 두 개가 들려 있었다. 하나는 당신 몫이었다.` },
    ],
  },

  // ══ GDD 5.2 필수 장면: 열다섯 번째 생일 밤 ═══════════════════════════════
  // 생일(14세 12월, 코어 '별의 밤' 직후) 고정 등장 · 1회성. 스케줄 기록(history)·카운터(counters)·숙련(mastery)으로
  // 가장 많이 한 활동 22종 × 통제 패턴 10여 종 × 몸과 마음 14종 × 신뢰 3종 대사를 조합한다.
  // 시간표 성향(몰아붙임·맡김·일·느긋함·섞임) 5종이 본문의 '몸과 마음' 대사와 결과 대사를 함께 정하므로 둘이 어긋나지 않는다.
  {
    id: 'b03_birthday_talk', title: '열다섯 번째 생일 밤', age: [14, 14], month: 12, fixed: true, weight: 5, image: 'bg/starnight',
    text: birthdayText,
    choices: [
      { label: '끝까지 듣고 고맙다고 한다', effects: { trust: +5, 'stat.sens': +4, stress: -8 }, result: birthdayResult('thanks') },
      { label: '이제부턴 네가 정하자', effects: { trust: +7, 'pers.ambit': +2, 'pers.agree': -1, 'flag.b03_birthday_promise': true }, result: birthdayResult('promise') },
      { label: '다 너 잘되라고 그랬다', effects: { trust: -5, 'pers.ambit': +3, stress: +6 }, result: birthdayResult('excuse') },
      { label: '억지로 시킨 날들을 사과한다', conditions: ['count.forced >= 3'], effects: { trust: +10, 'pers.agree': +2, stress: -6 },
        result: (s) => {
          const p = patternOf(s);
          return moodOf(p) === 'pushed'
            ? `"${cnt(p.forced)}이야. 알고 있었어?" "알고 있었어. 하나하나 미안해." {name은} 한참 말이 없다가 당신 어깨에 이마를 기댔다. "아직 다 괜찮진 않아. 근데 오늘부터 세는 건 그만할게."`
            : `"${cnt(p.forced)}. 나도 세고 있었는데." {name이} 웃었다. "먼저 말해 줘서 고마워. 그 정도면 생일 선물로 봐줄게."`;
        } },
    ],
  },
];
