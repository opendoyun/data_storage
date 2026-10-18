import { josa } from '../../engine/josa.js';
import { STATS } from '../stats.js';
// 배치 b06 — 보호자 서사 (GDD P5: 부모도 성장한다)
// 보호자의 과거·건강·옛 동료·돈 걱정·실수와 사과·아이에게서 배우는 것. 모든 이벤트는 guardian: true (엔진이 전체의 15%로 상한).
// 보호자의 감정은 독백이 아니라 손·물건·침묵 같은 장면으로 보여 준다. 아이는 {call}에게 반말.
//
// 공용 플래그 세팅: guardian_past_revealed (b06_name_story · b06_name_box · b06_name_whisper)
//                  guardian_name_cleared  (b06_name_restored — 히든 엔딩 「보호자의 뒤를 잇다」 조건)
// 오명 회복 연쇄 (출신별 과거는 PAST 표, 장면 문구는 함수로 출신마다 바뀐다):
//   ① 장터의 별명 b06_name_whisper ─(얼버무리면 → 다락의 상자 b06_name_box)─▶ ② 옛이야기 b06_name_story* [guardian_past_revealed]
//   ③ 실마리 b06_name_witness ─▶ ④ 증거를 찾아서 b06_name_evidence* [b06_evidence(_weak)] ─(반쪽이면)─ 나머지 반쪽 b06_name_missing_half
//   ⑤ 청문 전날 밤 b06_name_hearing (최대 2회) ─▶ ⑥ 되찾은 이름 b06_name_restored* [guardian_name_cleared]
//   가렛 인연은 knight에서 가장 강하다: 대련 중 고백(b06_knight_bout) 또는 술자리 고백(b06_name_witness) → b06_garrett_witness → 청문에서 가렛이 증언.
// 그 밖의 연쇄: 고향의 편지 b06_hometown_letter → b06_hometown_porch* → b06_hometown_farewell* (→ b06_guardian_birthday 콜백)
// 출신 전용(각 2, 조건 "guardian == '<출신>'"): knight muster·bout / scholar margin·lamp / merchant loan·haggle / priest firewood·rites / adventurer map·reunion
// 코어 플래그 콜백: guardian_sick · debt_garrett · seen.secret_letter_confront(편지를 몰래 읽음) · knows_origin · has_cat · ran_away · met_elda

const P = (s) => PAST[s.guardian] || PAST.knight;

// ── 출신별 과거 ─────────────────────────────────────────────────────
// slur 장터의 별명 · token 다락 상자 속 물건 · story 그날 이야기 · witness 첫 실마리 장면 · where 증거가 잠든 곳
// evidence 증거 · venue 청문 자리 · coat 청문 전날 손질하는 옷 · restored 이름을 되찾는 장면(옛 자리 제안 포함) · badge 그 증표
// keepsake/spot/keepMark 돈이 궁할 때 파는 아끼던 물건
const PAST = {
  knight: {
    slur: '금고 버린 기사',
    token: '반으로 쪼개진 기사단 휘장',
    story: `흑교에서 왕실 금고 마차를 호송하던 밤, 다리가 무너지며 축제에서 돌아가던 마을 아이들이 강물에 휩쓸렸다. 당신은 명령을 어기고 물에 뛰어들었다. 셋을 건져 올렸을 때 금고는 사라져 있었다. 부대장은 그 책임을 전부 당신 이름 위에 얹었다.`,
    witness: `{name이} 항구에서 젊은 뱃사공 하나를 데려왔다. 사공은 모자를 벗었다. "흑교 아래서 기사님이 건져 올린 꼬마가 저였습니다." 아이 눈이 반짝였다. "증인이야. 다른 애들도 찾을 수 있어."`,
    where: `흑교 사건 뒤 문을 닫은 강변 초소에 그날 밤의 진짜 출동 기록부가 남아 있을지 모른다. 금고 마차가 다리에 오르기 전부터 비어 있었다는 걸 보여 줄 기록이다.`,
    evidence: '출동 기록부',
    venue: '근위대 재심 청문회',
    coat: '기사 망토',
    restored: `사흘 뒤 왕실 전령이 왔다. 쪼개진 휘장 대신 새 휘장, 그리고 근위대장의 짧은 편지. "기사 명부에 귀하의 이름을 다시 올립니다. 원하신다면 근위대 교관 자리도 비워 두겠습니다." {name이} 휘장을 당신 가슴에 대 보고 고개를 끄덕였다. "어울려."`,
    badge: '새 휘장',
    keepsake: '기사의 검', spot: '벽에 걸려 있던', keepMark: '칼자루의 흠집까지 그대로였다.',
  },
  scholar: {
    slur: '위서 쓴 학자',
    token: '「제적」 도장이 찍힌 학술원 통지서',
    story: `학술원 시절, 폐허에서 「첫 번째 달의 연대기」 원본을 찾아낸 건 당신이었다. 스승은 그것을 제 발견으로 발표하려 했고, 당신이 반대하자 연대기가 위조품이라고 공표했다. 위조범은 당신이 되었다.`,
    witness: `{name이} 학술원 옛 별관의 장서 목록을 구해 와 펼쳤다. "「첫 번째 달의 연대기」. 분류 번호가 엉뚱한 칸에 있어. 누가 일부러 숨긴 것처럼." 아이의 손끝에서 별빛 하나가 목록 위를 짚었다.`,
    where: `원본 연대기는 문 닫은 학술원 옛 별관 서고, 엉뚱한 분류 번호 아래 잠들어 있다. 당신의 발굴 일지와 원본의 잉크를 나란히 놓으면 누가 거짓말을 했는지 드러난다.`,
    evidence: '원본 연대기',
    venue: '학술원 평의회',
    coat: '학자 로브',
    restored: `학술원에서 상자가 왔다. 「첫 번째 달의 연대기」 개정판, 발견자 칸에 당신의 이름. 강의 초빙장도 한 장 들어 있었다. {name이} 책을 펼쳐 그 이름을 손가락으로 짚었다. "여기. {call} 이름, 맨 앞에."`,
    badge: '개정판 연대기',
    keepsake: '놋쇠 천구의', spot: '책상 위에 놓여 있던', keepMark: '셋째 고리의 찌그러진 자국까지 그대로였다.',
  },
  merchant: {
    slur: '배 가라앉힌 장사꾼',
    token: '빨간 줄이 그어진 파산 판결문',
    story: `은빛 갈매기호는 폭풍에 가라앉았다. 투자자들은 당신이 짐을 빼돌리고 배를 버렸다고 믿었다. 장부를 고친 건 동업자 오스릭이었지만 서명은 당신 것이었다. 당신은 가진 것을 전부 팔아 선원 가족들에게 나눠 주고 항구를 떠났다.`,
    witness: `{name이} 항구에서 늙은 선원 하나를 데려왔다. "은빛 갈매기호 갑판원이었습니다. 그날 폭풍은 진짜였어요." 선원은 원본 장부가 길드 지하 어딘가에 있을 거라 했다. 아이가 당신 소매를 당겼다. "찾자."`,
    where: `오스릭이 고치기 전의 원본 장부가 상인 길드의 묵은 지하 창고 어딘가에 있다. 숫자 한 줄, 날짜 한 칸이 어긋난 곳만 찾으면 된다.`,
    evidence: '원본 장부',
    venue: '상인 길드 중재 회의',
    coat: '비단 조끼',
    restored: `상인 길드 회관 벽의 파산자 명단에서 당신 이름이 지워졌다. 길드장이 새 인장을 건넸다. "항구에서 다시 장사하시겠다면 길드가 보증하지요." {name이} 인장을 햇빛에 비춰 보았다. "{call} 이름, 반짝인다."`,
    badge: '길드 인장',
    keepsake: '금 저울', spot: '선반 위에 놓여 있던', keepMark: '저울판에 새긴 머리글자까지 그대로였다.',
  },
  priest: {
    slur: '성물 판 사제',
    token: '사제 자격을 거둔다는 교구 서한',
    story: `잿빛 겨울, 역병이 돌자 교구장은 성당 문을 걸어 잠그라 했다. 당신은 문을 열어 병자들을 들였고, 제단의 금 촛대를 팔아 약을 샀다. 봄이 왔을 때 병자 대부분이 살아 있었다. 당신에게 남은 건 '성물 판 사제'라는 이름뿐이었다.`,
    witness: `{name이} 아랫마을 노인 셋을 데려왔다. "잿빛 겨울에 성당에서 살아 나온 분들이야." 노인 하나가 당신 손을 잡았다. "그때 명부를 쓰셨지요. 우리 이름 하나하나." 그 명부는 성당 지하 서고 어딘가에 있다.`,
    where: `잿빛 겨울에 당신이 직접 쓴 병자 명부가 성당 지하 서고 어딘가에 있다. 촛대 판 돈이 어디로 갔는지, 몇 사람이 살아 나갔는지 전부 적힌 명부다.`,
    evidence: '병자 명부',
    venue: '대주교 앞 교회 심문',
    coat: '사제복',
    restored: `대주교가 직접 평원까지 왔다. 낡은 영대를 당신 어깨에 다시 걸어 주며 말했다. "그 겨울 성당 문을 연 것은 당신이었소. 교회가 늦었소. 원한다면 교구도 다시 맡기겠소." {name이} 영대 끝을 만져 보았다. 금실이 조금 닳아 있었다.`,
    badge: '영대',
    keepsake: '은 묵주', spot: '침대 머리맡에 걸려 있던', keepMark: '빠진 구슬 한 알 자리까지 그대로였다.',
  },
  adventurer: {
    slur: '동료 버린 모험가',
    token: '이름이 긁혀 지워진 작은 동판',
    story: `일곱 번째 계단이라 불리던 폐허. 천장이 무너졌을 때 동료 세린이 다리를 다쳤다. "애들 데리고 나가." 당신은 가렛과 나머지를 끌고 나온 뒤 혼자 되돌아갔지만 길은 막혀 있었다. 사람들은 당신이 보물을 챙기느라 동료를 버렸다고 했다.`,
    witness: `{name이} 가렛을 끌고 왔다. 가렛이 머리를 긁었다. "애가 하도 졸라서. ……세린은 늘 일지를 썼지. 일곱 번째 계단 아래, 그게 아직 있을지도 몰라." {name이} 벌써 배낭을 꾸리고 있었다.`,
    where: `세린의 일지는 무너진 일곱 번째 계단 아래 어딘가에 있다. 마지막 장에 그날의 진실이 적혀 있다면, 긁힌 이름을 되돌릴 수 있다.`,
    evidence: '세린의 일지',
    venue: '항구 모험가 조합의 명판 회의',
    coat: '가죽 조끼',
    restored: `항구 여관 벽, 긁혀 있던 동판에 이름이 다시 새겨졌다. 당신의 이름, 그리고 그 옆에 세린의 이름. 조합장은 은패와 함께 원정대장 자리를 내밀었다. 가렛이 잔을 들었다. "일곱 번째 계단의 생환자에게!" {name이} 당신 손을 꼭 쥐었다.`,
    badge: '조합 은패',
    keepsake: '용비늘 부적', spot: '문고리에 걸려 있던', keepMark: '끈에 묶은 매듭까지 그대로였다.',
  },
};

// ── 오늘은 내가 선생님: 아이의 가장 높은 능력치 범주별 수업 ───────────────
const CAT_OF = Object.fromEntries(STATS.map(x => [x.id, x.cat]));
function topCat(s) {
  let best = 'hp';
  for (const id of Object.keys(s.stats || {})) if ((s.stats[id] ?? 0) > (s.stats[best] ?? 0)) best = id;
  return CAT_OF[best] || 'inner';
}
const TEACH = {
  body: {
    diligent: `{name이} 마당에서 발 디딤부터 가르쳤다. "무릎! 아까 말했잖아." 언젠가 당신이 했던 잔소리가 토씨 하나 안 틀리고 돌아왔다. 당신은 얌전히 무릎을 굽혔다.`,
    silly: `당신은 목검을 거꾸로 쥐고 진지하게 물었다. "이쪽이 앞이냐?" {name이} 바닥에 주저앉아 웃었다. 수업은 엉망이 됐고, 그날 저녁은 오래 즐거웠다.`,
  },
  mind: {
    diligent: `{name이} 숯으로 세 달의 궤도를 그려 가며 설명했다. 당신이 손을 들고 질문하자 아이가 눈을 반짝였다. "좋은 질문이야." 그 말투가 누구를 닮았는지, 당신은 알았다.`,
    silly: `"세 번째 달은 치즈로 만들었냐?" 당신의 질문에 {name이} 숯을 떨어뜨렸다. "{call}!" 그날 수업은 달이 무슨 맛일지에 대한 토론으로 끝났다.`,
  },
  social: {
    diligent: `{name이} 당신 손을 잡고 무도회 첫 스텝을 가르쳤다. 당신은 세 번 아이 발을 밟았다. "박자! 하나, 둘, 셋." 큐브가 날갯짓으로 박자를 맞췄다. 네 번째엔 밟지 않았다.`,
    silly: `당신은 무도회 인사를 큐브에게 했다. 아주 정중하게, 세 번이나. 큐브가 날개를 파닥이며 답례했다. {name이} 웃다가 딸꾹질을 시작했다.`,
  },
  inner: {
    diligent: `{name이} 류트를 안고 짧은 노래를 가르쳤다. 당신 목소리는 음을 두 칸쯤 비껴갔다. 아이는 웃음을 참다가 끝내 같이 따라 불렀다. 일부러 틀린 음으로.`,
    silly: `당신은 류트를 북처럼 두드렸다. "이게 아니냐?" {name이} 웃음을 참다 콧소리를 냈다. 그날 집 안에는 노래 대신 웃음소리가 오래 울렸다.`,
  },
};

// 청문 판정 보정: 보조 능력치 20% + 온전한 증거 +30 + 신뢰 20% (신뢰는 아이의 확신이 된다)
const hearingBonus = (s, stat) => (s.stats[stat] ?? 0) * 0.2 + (s.flags.b06_evidence_weak ? 0 : 30) + (s.trust ?? 0) * 0.2;
// 결과 문구는 효과 적용(= seen 증가) 뒤에 채워지므로, 두 번째 청문의 실패는 seen >= 2
const hearingFail = (s) => ((s.seen?.b06_name_hearing ?? 0) >= 2
  ? `두 번째 청문도 결론을 내지 못했다. "이 이상은 어렵겠소." {name이} 문을 나서며 주먹을 쥐었다가 천천히 폈다. "{call} 이름, 내가 알아. 그거면 됐어." 아이가 먼저 당신 손을 잡았다.`
  : `"증거가 부족하다"는 말과 함께 결론이 미뤄졌다. 돌아오는 길에 {name이} 주먹을 쥐었다. "한 번 더 해. 다음엔 더 잘할게." 아이가 당신보다 먼저 다음 날짜를 물었다.`);

export default [
  // ══ 오명 회복 연쇄 ═════════════════════════════════════════════════════
  {
    id: 'b06_name_whisper', title: '장터의 별명', age: [12, 16], weight: 2.2, guardian: true, image: 'bg/market',
    conditions: ['!flag.guardian_past_revealed'],
    text: (s) => `장에서 돌아온 {name이} 바구니를 내려놓지도 않고 섰다. "어떤 아저씨가 그랬어. 네가 그 '${P(s).slur}' 집 애냐고." 바구니 속 달걀 하나가 깨져 있었다. 아이 어깨에서 별빛 하나가 튀었다가 꺼졌다.`,
    choices: [
      { label: '그날 밤 전부 이야기한다', effects: { trust: +3, 'stat.sens': +2 }, next: 'b06_name_story',
        result: `당신은 아이를 식탁에 앉히고 등불을 하나 더 켰다. 심지를 돋우는 손이 몇 번 헛돌았다. "길어질 거다."` },
      { label: '"옛날 일이다" 하고 덮는다', effects: { trust: -4, stress: +4, 'flag.b06_past_dodged': true },
        result: `"옛날 일이다. 신경 쓰지 마라." {name은} 깨진 달걀을 치웠다. 저녁 내내 그 별명이 식탁 한가운데 앉아 있었다. 아무도 그걸 입에 올리지 않았다.` },
      { label: '그 남자를 찾아가 따진다', effects: { reputation: -3, trust: +2, 'pers.agree': -1, 'flag.b06_past_dodged': true },
        result: `당신은 그 길로 장터에 갔다. 남자는 사과했지만 구경꾼들은 오래 수군거렸다. 돌아온 당신에게 {name이} 물었다. "그래서, 진짜야?" 당신은 달걀을 새로 사 왔다고만 했다.` },
      { label: '가렛에게 들어 보라고 한다', conditions: ['rel.garrett >= 30'], effects: { 'flag.guardian_past_revealed': true, 'rel.garrett': +4, trust: -2, 'stat.elo': +2 },
        result: `가렛은 항구에서 아이에게 아는 만큼 이야기해 줬다. 저녁에 돌아온 {name이} 한참 당신을 보다가 말했다. "가렛 아저씨가 그러는데, {call이} 바보같이 착해서 그렇게 된 거래."` },
    ],
  },
  {
    id: 'b06_name_box', title: '다락의 상자', age: [13, 17], weight: 2.5, guardian: true,
    conditions: ['flag.b06_past_dodged', '!flag.guardian_past_revealed'],
    text: (s) => `{name이} 다락에서 작은 상자를 안고 내려왔다. 안에는 ${josa(P(s).token, '이')} 들어 있었다. "이거, 그 별명이랑 상관있지?" 목소리가 낮았다. "이번에도 얼버무리면, 나도 앞으로 {call}한테 아무 얘기 안 할 거야."`,
    choices: [
      { label: '처음부터 이야기한다', effects: { trust: +3, stress: -2, 'stat.sens': +2 }, next: 'b06_name_story',
        result: `당신은 상자 속 물건을 하나씩 꺼내 식탁에 늘어놓았다. 마지막 것을 꺼낼 때 손이 잠깐 멈췄다. "처음부터 말하마."` },
      { label: '말없이 상자를 닫는다', effects: { trust: -8, 'pers.agree': -3, stress: +5 },
        result: `당신은 상자를 받아 들고 닫았다. {name은} 그 뒤로 정말 말이 줄었다. 묻는 말에만 대답했다. 상자는 다락으로 돌아가지 않고 당신 침대 밑으로 갔다.` },
      { label: '상자째 아이에게 맡긴다', effects: { 'flag.guardian_past_revealed': true, 'stat.int': +4, trust: +4, 'pers.agree': -1 },
        result: `"읽고 네가 판단해라." {name은} 상자를 안고 방으로 들어갔다. 새벽까지 불이 켜져 있었다. 아침에 아이가 상자를 돌려주며 말했다. "다 읽었어. 이제 내 일이기도 해."` },
    ],
  },
  {
    id: 'b06_name_story', title: '등불 아래의 옛이야기', chainOnly: true, age: [12, 17], guardian: true,
    text: (s) => `등불 아래서 당신은 처음으로 그 일을 이야기했다. ${P(s).story} {name은} 끝까지 듣고 물었다. "그래서, 후회해?"`,
    choices: [
      { label: '"후회는 없다"', effects: { 'flag.guardian_past_revealed': true, 'pers.good': +2, 'stat.moral': +4, trust: +3 },
        result: `"그날로 다시 가도 똑같이 할 거다." {name이} 고개를 끄덕이고 아주 작게 말했다. "그럼 그 사람들이 틀린 거네." 아이 주위의 별빛이 등불보다 밝았다.` },
      { label: '"나도 다 옳지는 않았다"', effects: { 'flag.guardian_past_revealed': true, 'stat.sens': +4, trust: +5 },
        result: `"내가 고른 것 때문에 누군가는 대가를 치렀다." 당신은 식탁 모서리만 문질렀다. {name이} 그 손 위에 손을 얹었다. "말해 줘서 고마워." 위로받는 쪽이 바뀐 건 처음이었다.` },
      { label: '"이제 서로 비밀은 없구나"', conditions: ['flag.knows_origin'], effects: { 'flag.guardian_past_revealed': true, trust: +8, stress: -6 },
        result: `"너도 네 이야기를 들었을 때 이랬겠지." {name이} 웃었다. "응. 근데 듣고 나니까 오히려 가벼워." 그날 밤 둘은 늦게까지 비밀 아닌 비밀을 주고받았다.` },
      { label: '"다 지난 일이다. 파헤치지 마라"', effects: { 'flag.guardian_past_revealed': true, 'flag.b06_name_let_go': true, trust: -2, 'pers.agree': +1, stress: -3 },
        result: `"알았어." {name은} 그 일을 다시 묻지 않았다. 대신 장터에서 그 별명이 들릴 때마다, 당신보다 먼저 그 사람을 똑바로 쳐다봤다.` },
    ],
  },
  {
    id: 'b06_name_witness', title: '실마리', age: [13, 17], weight: 2.5, guardian: true,
    conditions: ['flag.guardian_past_revealed', '!flag.b06_evidence', '!flag.b06_name_let_go'],
    text: (s) => P(s).witness,
    choices: [
      { label: '아이와 함께 찾아 나선다', effects: { trust: +4, 'pers.ambit': +2 }, next: 'b06_name_evidence',
        result: `당신은 오래 닫아 둔 궤짝을 열어 옛 기록을 꺼냈다. {name이} 옆에서 종이를 받아 들었다. 먼지가 별빛 속에서 반짝였다.` },
      { label: '혼자 찾겠다며 돌려보낸다', effects: { 'flag.b06_evidence': true, 'flag.b06_evidence_weak': true, trust: -5, gHealth: -6, 'pers.agree': -1 },
        result: `당신은 혼자 길을 나섰다. 찾아낸 건 반쪽짜리 증거였다. 돌아왔을 때 {name은} 문간에 앉아 있었다. "왜 나는 빼?" 대답할 말이 없었다.` },
      { label: '여기서 그만두자고 한다', effects: { 'flag.b06_name_let_go': true, stress: -4, 'pers.ambit': -2, trust: -2 },
        result: `"진실이 어딘가 남아 있다는 것만으로 됐다." {name은} 한참 당신을 보다가 고개를 끄덕였다. 그날 밤 아이 방에서 종이 접는 소리가 오래 났다. 아이가 모아 온 쪽지들이었다.` },
      // knight 전용 지름길: 대련 중에 이미 고백했다면(b06_garrett_witness) 이 선택지는 숨는다 — 그때는 아이와 증거를 찾고, 가렛은 청문에서 증언한다.
      { label: '가렛을 찾아간다', conditions: ["guardian == 'knight'", 'rel.garrett >= 30', '!flag.b06_garrett_witness'], effects: { 'flag.b06_garrett_witness': true, 'flag.b06_evidence': true, 'rel.garrett': +6, trust: +3 },
        result: `가렛이 술잔을 내려놓았다. "그날 다리 위에 나도 있었다. 견습 말은 아무도 안 들을 거라 여기고 입을 다물었지." 그는 궤짝 바닥에서 출동 기록부 사본을 꺼내고, 그 자리에서 증언서를 썼다.` },
    ],
  },
  {
    id: 'b06_name_evidence', title: '증거를 찾아서', chainOnly: true, age: [13, 17], guardian: true,
    text: (s) => `${P(s).where} 식탁 위에 {name이} 지도와 쪽지를 펼쳤다. "어디부터 찾을까?"`,
    choices: [
      { label: '단서를 하나하나 대조한다', check: { stat: 'int', dc: 160 }, minigame: 'exam',
        success: { effects: { 'flag.b06_evidence': true, 'stat.int': +6, trust: +3 },
          result: (s) => `{name이} 며칠 밤을 쪽지와 씨름하다가 한 곳을 짚었다. 거기에 ${josa(P(s).evidence, '이')} 있었다. 당신은 그 첫 장을 등불에 비춰 보고, 또 비춰 보았다.` },
        fail: { effects: { 'flag.b06_evidence': true, 'flag.b06_evidence_weak': true, 'stat.int': +2, stress: +5 },
          result: (s) => `단서가 서로 엇갈렸다. 겨우 찾아낸 ${josa(P(s).evidence, '은')} 절반이 얼룩져 있었다. {name이} 입술을 깨물었다. "반이라도 있으면 돼." 당신은 그 반쪽을 조심스럽게 쌌다.` } },
      { label: '먼지 쌓인 구석까지 뒤진다', check: { stat: 'agi', dc: 110 },
        success: { effects: { 'flag.b06_evidence': true, 'stat.agi': +5, 'stat.hp': +2, trust: +3 },
          result: (s) => `{name이} 먼저 좁은 틈으로 들어갔다. 한참 뒤 아이가 ${josa(P(s).evidence, '을')} 끌어안고 나왔다. 머리카락에 거미줄이 잔뜩 붙어 있었다. 그걸 떼어 주느라 당신 손이 한참 바빴다.` },
        fail: { effects: { 'flag.b06_evidence': true, 'flag.b06_evidence_weak': true, gHealth: -5, stress: +4, trust: +2 },
          result: (s) => `발밑이 무너졌다. 당신이 {name}의 손목을 낚아채 끌어올렸다. 아이가 쥐고 나온 건 ${P(s).evidence}의 찢어진 반쪽뿐이었다. 한동안 무릎이 떨렸다. 당신 무릎이었다.` } },
      { label: '그날을 아는 사람들을 찾는다', check: { stat: 'elo', dc: 150 },
        success: { effects: { 'flag.b06_evidence': true, 'stat.elo': +5, reputation: +3 },
          result: (s) => `{name이} 집집마다 문을 두드렸다. 셋째 날부터 문이 열렸다. 그날을 기억하는 사람들이 하나둘 입을 열었고, 그 끝에 ${josa(P(s).evidence, '이')} 있었다.` },
        fail: { effects: { 'flag.b06_evidence': true, 'flag.b06_evidence_weak': true, 'stat.elo': +2, reputation: -2, stress: +4 },
          result: (s) => `대부분의 문은 끝내 열리지 않았고 소문만 더 퍼졌다. 겨우 손에 넣은 ${josa(P(s).evidence, '은')} 귀퉁이가 떨어져 나가 있었다. {name은} 그래도 그것을 품에 안고 왔다.` } },
      { label: '물려받은 지도를 펼친다', conditions: ['flag.b06_map_given'], effects: { 'flag.b06_evidence': true, 'stat.agi': +3, 'pers.roman': +2, trust: +4 },
        result: `{name이} 벽에서 지도를 떼어 왔다. 빈칸 옆에 아이 글씨로 적힌 '언젠가'. 지도에는 일곱 번째 계단의 옆길까지 그려져 있었다. 이틀 뒤, 세린의 일지가 당신 손에 들려 있었다.` },
    ],
  },
  {
    id: 'b06_name_missing_half', title: '나머지 반쪽', age: [14, 17], weight: 2.2, guardian: true, image: 'bg/harbor',
    conditions: ['flag.b06_evidence_weak', '!flag.guardian_name_cleared', '!flag.b06_name_let_go', 'seen.b06_name_hearing < 2'],
    text: (s) => `서명 없는 편지가 왔다. "${P(s).evidence}의 나머지 반쪽은 내가 가지고 있소. 200G. 다음 장날, 항구 세 번째 창고." {name이} 편지를 두 번 읽고 당신을 봤다. "이거, 사도 되는 거야?"`,
    choices: [
      { label: '200G를 치른다', conditions: ['gold >= 200'], effects: { gold: -200, 'flag.b06_evidence_weak': false, 'pers.good': -1, 'stat.elo': +2 },
        result: `창고 그늘에서 남자는 돈을 세고 반쪽을 내밀었다. 찢긴 자리가 꼭 맞았다. 돌아오는 길에 {name이} 중얼거렸다. "진실도 돈 주고 사는 거구나." 당신은 대답하지 못했다.` },
      { label: '사지 않는다', effects: { 'stat.moral': +4, trust: +3, 'pers.good': +2 },
        result: `"산 진실은 내일 또 팔린다." 당신은 편지를 등잔불에 태웠다. {name이} 타들어 가는 종이를 보다가 고개를 끄덕였다. "그럼 반쪽으로 이기면 되지."` },
      { label: '편지의 출처를 캐게 한다', check: { stat: 'int', dc: 170 },
        success: { effects: { 'flag.b06_evidence_weak': false, 'stat.int': +5, reputation: +3 },
          result: `{name이} 편지의 소인과 잉크를 따라 항구 여관까지 갔다. 보낸 사람은 그날 일에 엮인 이의 늙은 하인이었다. 사정을 다 들은 노인은 돈 대신 반쪽을 그냥 내밀었다. "아가씨 눈을 보니 못 팔겠소."` },
        fail: { effects: { 'stat.int': +2, stress: +5, trust: +1 },
          result: `창고는 비어 있었다. 낌새를 챈 모양이었다. {name이} 빈 바닥을 걷어찼다. "반쪽이라도 이길 거야." 아이 주위로 별빛이 따갑게 튀었다.` } },
      { label: '가렛에게 창고를 맡긴다', conditions: ['rel.garrett >= 40'], effects: { 'flag.b06_evidence_weak': false, 'rel.garrett': +3, infamy: +4, reputation: -2 },
        result: `가렛과 용병 둘이 창고 문을 막아섰다. 남자는 돈 얘기를 꺼내지도 못했다. 반쪽은 돌아왔지만 항구에는 "평원 집이 용병을 풀었다"는 말이 돌았다. {name은} 그 말을 듣고 한동안 조용했다.` },
    ],
  },
  {
    id: 'b06_name_hearing', title: '청문 전날 밤', age: [15, 17], weight: 3, repeatable: true, guardian: true,
    conditions: ['flag.b06_evidence', '!flag.guardian_name_cleared', '!flag.b06_name_let_go', 'seen.b06_name_hearing < 2'],
    text: (s) => `${s.seen?.b06_name_hearing ? `미뤄졌던 ${josa(P(s).venue, '이')} 내일 다시 열린다.` : `내일은 ${josa(P(s).venue, '이')} 열린다.`} {name이} 식탁에 ${josa(P(s).evidence, '을')} 펼쳐 놓고 할 말을 몇 번이고 고쳐 썼다. 당신은 옆에서 낡은 ${P(s).coat}의 단추를 달았다. 바늘이 자꾸 엇나갔다. 아이가 고개를 들었다. "내일, 내가 말해도 돼?"`,
    choices: [
      { label: '아이가 증거로 변론한다', check: { stat: 'elo', dc: 320, bonus: (s) => hearingBonus(s, 'int') },
        success: { effects: { 'stat.elo': +8, reputation: +6, trust: +5 }, next: 'b06_name_restored',
          result: `{name이} 일어섰다. 목소리는 처음엔 떨렸고 셋째 문장부터 떨리지 않았다. 증거마다 날짜와 이름을 붙여 나가자 방 안이 조용해졌다. "제가 아는 {call은} 그런 사람이 아닙니다." 판결은 그다음이었다.` },
        fail: { effects: { 'stat.elo': +3, stress: +10, trust: +2 }, result: hearingFail } },
      { label: '아이가 진심을 말한다', check: { stat: 'moral', dc: 210, bonus: (s) => hearingBonus(s, 'sens') },
        success: { effects: { 'stat.moral': +8, 'stat.sens': +3, trust: +5 }, next: 'b06_name_restored',
          result: `{name은} 증거보다 이야기를 먼저 했다. 평원의 작은 집, 탄 빵, 밤새 곁을 지키던 사람. "그런 사람이 그날만 다른 사람이었을 리 없어요." 윗자리에 앉은 이가 헛기침을 하고 증거를 다시 펼쳤다.` },
        fail: { effects: { 'stat.moral': +3, stress: +10, trust: +2 }, result: hearingFail } },
      // 확실하지만 아이가 자라는 몫(능력치·신뢰)은 작다 — 아이 스스로의 변론과 맞바꾸는 선택
      { label: '가렛이 증언대에 선다', conditions: ['flag.b06_garrett_witness'], effects: { 'rel.garrett': +8, reputation: +3, trust: +2, 'stat.moral': +2 }, next: 'b06_name_restored',
        result: `가렛이 증언대에 섰다. "그날 다리 위에 나도 있었습니다. 입을 다문 건 나였습니다." 청문회장이 술렁였다. 가렛은 그 뒤로 석 달 동안 왕실 일감을 받지 못했다. "싸게 먹혔지." 그가 {name}에게 윙크했다.` },
      { label: '"이름은 이제 됐다"', effects: { 'flag.b06_name_let_go': true, stress: -10, trust: -2, 'pers.ambit': -2 },
        result: `"이름 없이도 잘 살았다. 너랑." {name이} 써 둔 종이를 한참 보다가 접었다. "……{call이} 그렇다면." 아이는 그 종이를 버리지 않고 서랍 맨 아래 칸에 넣었다.` },
    ],
  },
  {
    id: 'b06_name_restored', title: '되찾은 이름', chainOnly: true, age: [15, 17], guardian: true,
    text: (s) => P(s).restored,
    choices: [
      { label: '옛 자리 제안은 사양한다', effects: { 'flag.guardian_name_cleared': true, trust: +6, stress: -5, 'pers.ambit': -1 },
        result: `"고맙지만, 제 자리는 평원의 작은 집입니다." 당신은 제안을 정중히 돌려보냈다. {name이} 당신 옆에서 고개를 빳빳이 들었다. 자기가 그 '자리'라는 걸 아는 얼굴이었다.` },
      { label: '증표를 아이에게 건넨다', effects: { 'flag.guardian_name_cleared': true, 'stat.moral': +5, 'pers.ambit': +3, reputation: +5 },
        result: (s) => `당신은 ${josa(P(s).badge, '을')} {name}에게 건넸다. "이름은 되찾았으니, 이건 다음 사람 몫이다." 아이가 그것을 두 손으로 받아 품에 안았다. 별빛이 손가락 틈으로 새어 나왔다.` },
      { label: '마을 잔치를 연다 (-80G)', conditions: ['gold >= 80'], effects: { 'flag.guardian_name_cleared': true, gold: -80, reputation: +6, stress: -10, 'rel.cube': +4 },
        result: `그날 밤 평원의 작은 집은 늦게까지 불이 켜져 있었다. 큐브가 케이크를 들고 날아다녔고, {name이} 사람들 앞에서 당신 이야기를 세 번이나 했다. 세 번째엔 당신도 웃었다.` },
    ],
  },

  // ══ 출신 전용: 전직 왕실 기사 ═══════════════════════════════════════════
  {
    id: 'b06_knight_muster', title: '재소집령', age: [14, 17], weight: 1.8, guardian: true, npc: 'knight_cpt',
    conditions: ["guardian == 'knight'"],
    text: (s) => `${s.flags.guardian_name_cleared ? '명부에 이름이 돌아오자마자 왕실 인장이 찍힌 편지가 왔다.' : '왕실 인장이 찍힌 편지가 왔다. 명부에서 지운 이름까지 부를 만큼 국경이 급한 모양이었다.'} "북부 국경 요새, 전직 기사 소집. 한 계절. 수당 지급." 당신은 편지를 접고 ${s.flags.b06_keepsake_sold ? '검이 걸려 있던 빈 벽을' : '벽에 걸린 검을'} 한참 올려다봤다. 접시를 닦던 {name이} 손을 멈췄다. 물소리만 계속 났다.`,
    choices: [
      { label: '소집에 응한다', effects: { gold: +240, gHealth: -10, trust: -3, 'stat.hp': +4, stress: +6 },
        result: `한 계절 뒤 당신은 수당 주머니를 들고 돌아왔다. 장작은 쌓여 있었고 지붕도 멀쩡했다. {name이} 문간까지 달려오다 멈췄다. "늦었잖아." 목소리가 갈라져 있었다.` },
      { label: '무릎을 이유로 면제를 청한다', effects: { reputation: -4, trust: +4, gHealth: +2, 'pers.ambit': -1 },
        result: `청원서에 "무릎 부상"이라고 쓰는 손이 느렸다. 답장은 한 줄이었다. "면제를 허가함." 그날 저녁 {name이} 당신 무릎에 뜨거운 수건을 얹었다. 아무것도 묻지 않았다.` },
      { label: '가렛의 용병단을 대신 보낸다', conditions: ['rel.garrett >= 30', 'gold >= 150'], effects: { gold: -150, 'rel.garrett': +6, reputation: +2, trust: +2 },
        result: `가렛이 수당 장부를 넘겨 보더니 웃었다. "네 대신 우리가 북쪽 바람을 맞고, 너는 애 옆에 있겠다? 옛정으로 싸게 해 주지." 용병들이 떠난 날, 당신은 {name}의 수업을 처음부터 끝까지 구경했다.` },
    ],
  },
  {
    id: 'b06_knight_bout', title: '해 질 녘의 대련', age: [12, 16], weight: 1.8, guardian: true, npc: 'garrett',
    conditions: ["guardian == 'knight'", 'rel.garrett >= 25'],
    text: `해 질 녘, 가렛이 목검 두 자루를 어깨에 메고 마당에 들어섰다. "녹슬었나 보자, 기사 양반." 당신은 대답 대신 소매를 걷었다. 왼쪽 무릎이 먼저 삐걱거렸다. 담장 위에 {name이} 턱을 괴고 앉았다.`,
    choices: [
      { label: '끝까지 겨룬다', effects: { gHealth: -6, 'rel.garrett': +8, 'pers.ambit': +2, trust: +2 },
        result: `열두 합째, 가렛의 목검이 마당 끝으로 날아갔다. 당신은 그대로 주저앉았다. 무릎이 말을 듣지 않았다. {name이} 달려왔다. "방금 그거 다시 해 봐!" 일어나는 데 한참 걸렸다.` },
      { label: '목검을 아이에게 넘긴다', check: { stat: 'agi', dc: 90 },
        success: { effects: { 'stat.agi': +6, 'rel.garrett': +6, trust: +3, 'pers.extro': +1 },
          result: `{name이} 가렛의 첫 공격을 흘리고 둘째 공격 밑으로 파고들었다. 가렛이 목검을 내렸다. "누구한테 배웠냐." 아이가 턱으로 당신을 가리켰다. 당신은 괜히 헛기침을 했다.` },
        fail: { effects: { 'stat.str': +2, 'rel.garrett': +3, stress: +5 },
          result: `세 번 넘어지고 네 번째에 일어났다. 가렛이 아이 머리를 헝클었다. "넘어지는 법은 {call}보다 낫다." 당신은 그 말에 반박하지 못했다.` } },
      { label: '무릎 핑계로 차를 끓인다', effects: { gHealth: +2, 'rel.garrett': +3, trust: +3, 'stat.cult': +2 },
        result: `가렛은 찻잔을 들고 견습 시절 이야기를 늘어놓았다. 당신이 말 대신 당나귀를 타고 출정식에 나간 이야기. {name이} 웃다가 의자에서 떨어졌다. 당신은 차를 너무 오래 저었다.` },
      { label: '흑교 이야기를 꺼낸다', conditions: ['flag.guardian_past_revealed', '!flag.b06_garrett_witness'], effects: { 'flag.b06_garrett_witness': true, 'rel.garrett': +6, 'stat.moral': +3, trust: +2 },
        result: `목검이 멈췄다. "……그날 다리 위에 나도 있었지." 가렛이 땅을 봤다. "견습 말은 안 들을 거라고 입을 다물었다. 이번엔 안 다물지." {name이} 둘 사이에서 숨을 죽였다.` },
    ],
  },

  // ══ 출신 전용: 떠돌이 학자 ══════════════════════════════════════════════
  {
    id: 'b06_scholar_margin', title: '여백의 붉은 글씨', age: [12, 16], weight: 1.8, guardian: true,
    conditions: ["guardian == 'scholar'"],
    text: `당신이 스무 해째 붙들고 있는 원고 「세 달의 역법」. 아침에 보니 여백에 붉은 글씨가 적혀 있었다. "여기 겹치는 주기, 7이 아니라 9 아니야?" 글씨의 주인은 식탁에서 빵을 씹으며 당신 눈치를 보고 있다.`,
    choices: [
      { label: '아이와 함께 검산한다', check: { stat: 'int', dc: 160 }, minigame: 'exam',
        success: { effects: { 'stat.int': +8, trust: +5, 'pers.ambit': +2, 'flag.b06_coauthor': true },
          result: `밤새 둘이 계산했다. 아이가 맞았다. 당신은 원고 첫 장, 저자 이름 옆에 한 줄을 더 적었다. {name이} 그 줄을 오래 내려다봤다.` },
        fail: { effects: { 'stat.int': +3, trust: +2, stress: +3 },
          result: `9도 틀렸다. 둘이 새벽까지 매달렸지만 답은 나오지 않았다. {name이} 여백에 새 질문을 적었다. "그럼 11?" 당신은 그 글씨를 지우지 않았다.` } },
      { label: '"내 원고에 손대지 마라"', effects: { trust: -6, 'pers.agree': -2, 'stat.int': +2, 'flag.b06_scholar_pride': true },
        result: `목소리가 생각보다 컸다. {name이} 빵을 내려놓았다. 그날 밤 당신은 혼자 검산했다. 아이가 맞았다. 당신은 붉은 글씨를 지우지 못한 채 등불을 껐다.` },
      { label: '원고 한 장을 아이 몫으로 준다', effects: { 'stat.cult': +4, 'pers.roman': +2, trust: +3, stress: -3 },
        result: `"이 장은 이제 네 거다. 마음대로 고쳐라." {name이} 원고를 두 팔로 안았다. 그 주 내내 집 안에 붉은 잉크 냄새가 났다.` },
    ],
  },
  {
    id: 'b06_scholar_lamp', title: '팔 길이만큼', age: [13, 17], weight: 1.8, guardian: true,
    conditions: ["guardian == 'scholar'"],
    text: `요즘 당신은 책을 팔 길이만큼 떼어 놓고 읽는다. 촛불도 두 개로 늘었다. 오늘 밤 {name이} 당신 손에서 책을 빼 가더니 자기 앞에 펼쳤다. "몇 쪽이야? 내가 읽을게."`,
    choices: [
      { label: '아이가 읽어 주게 둔다', effects: { 'stat.elo': +4, 'stat.cult': +3, trust: +5, gHealth: +2 },
        result: `{name이} 어려운 낱말에서 더듬을 때마다 당신이 뜻을 일러 줬다. 한 권을 다 읽는 데 석 달이 걸렸다. 마지막 장을 덮고도 둘 다 한동안 일어나지 않았다.` },
      { label: '항구에서 안경을 맞춘다 (-150G)', conditions: ['gold >= 150'], effects: { gold: -150, gHealth: +6, trust: +2, 'stat.int': +2 },
        result: `동그란 안경을 쓰자 세상이 선명해졌다. 제일 먼저 보인 건 {name}의 얼굴이었다. 언제 이렇게 컸는지. 당신은 안경을 몇 번이나 벗어 닦았다.` },
      { label: '"아직 읽을 만하다"', effects: { gHealth: -5, trust: -3, 'pers.agree': -1 },
        result: `당신은 책을 돌려받았다. {name이} 말없이 방으로 들어갔다. 다음 날 아침, 당신 책상 위 촛대가 세 개로 늘어 있었다.` },
      { label: '마지막 장을 받아 적게 한다', conditions: ['flag.b06_coauthor'], effects: { 'stat.int': +6, 'pers.ambit': +2, trust: +4, gHealth: +3 },
        result: `"「세 달의 역법」 마지막 장은 네가 써라. 나는 불러만 주마." {name이} 펜을 쥐었다. 문장마다 아이가 물었다. "이렇게 쓰는 거 맞아?" 대개 당신 문장보다 나았다.` },
    ],
  },

  // ══ 출신 전용: 은퇴한 상인 ══════════════════════════════════════════════
  {
    id: 'b06_merchant_loan', title: '해진 외투의 손님', age: [12, 16], weight: 1.8, guardian: true,
    conditions: ["guardian == 'merchant'"],
    text: `해진 외투를 입은 남자가 문 앞에 섰다. 항구 시절 거래처 사람 바르톨로였다. "배 한 척만 다시 띄우면 일어설 수 있어. 200G만." 그 외투가 한때 당신 것보다 비쌌던 걸 당신은 기억한다. {name이} 문틈으로 둘을 지켜보고 있다.`,
    choices: [
      { label: '200G를 빌려준다', conditions: ['gold >= 200'], effects: { gold: -100, 'stat.moral': +4, 'pers.good': +2, reputation: +2 },
        result: `바르톨로는 몇 번이나 고개를 숙이고 떠났다. 이듬해 봄, 무화과 한 상자와 100G가 돌아왔다. 절반이었다. {name이} 무화과를 집어 들었다. "나머지 반은 이걸로 받은 걸로 하자."` },
      { label: '정중히 거절한다', effects: { 'pers.roman': -2, 'stat.int': +2, trust: -2 },
        result: `"미안하네." 바르톨로는 고개를 끄덕이고 떠났다. {name이} 물었다. "친구였잖아." 당신은 이번 달 장부를 펼쳐 보였다. 아이는 숫자를 한참 보다가 고개를 끄덕였다. 납득한 얼굴은 아니었다.` },
      { label: '아이에게 차용증을 쓰게 한다', conditions: ['gold >= 200'], check: { stat: 'int', dc: 140 },
        success: { effects: { gold: +20, 'stat.int': +5, 'stat.elo': +3, reputation: +2 },
          result: `{name이} 차용증에 갚는 날짜와 이자, 못 갚으면 대신 일할 날수까지 적었다. 바르톨로가 웃었다. "이 집 장부는 딸이 쥐었구먼." 그는 반년 만에 이자까지 얹어 갚았다.` },
        fail: { effects: { 'stat.int': +2, stress: +4, 'pers.good': -1 },
          result: `{name이} 내민 조건은 너무 깐깐했다. 바르톨로는 차용증을 내려놓았다. "친구한테 이런 걸 받을 줄은." 문이 닫히고 아이가 종이를 구겼다. "내가 망쳤어?"` } },
    ],
  },
  {
    id: 'b06_merchant_haggle', title: '장터의 저울', age: [11, 16], weight: 1.8, guardian: true, image: 'bg/market',
    conditions: ["guardian == 'merchant'"],
    text: `장터에서 당신은 습관처럼 흥정을 했다. 상대는 허리 굽은 사과 장수 할머니. 반값까지 깎았을 때 {name이} 당신 소매를 잡아당겼다. "{call}, 그만해. 저 할머니 손 봐." 할머니의 손등이 갈라져 있었다.`,
    choices: [
      { label: '처음 부른 값을 다 치른다', effects: { gold: -30, 'stat.moral': +4, trust: +4, 'pers.good': +1 },
        result: `당신은 동전을 더 얹었다. 할머니가 사과 두 알을 더 넣어 줬다. 돌아오는 길에 {name이} 한 입 베어 물고 말했다. "이게 더 맛있어." 당신도 한 입 베었다. 정말 그랬다.` },
      { label: '"흥정도 예의다"라고 가르친다', effects: { gold: +10, 'stat.elo': +4, 'pers.roman': -2, trust: -3 },
        result: `"깎는 것도 대화다. 할머니도 알고 부른 값이야." {name은} 대꾸하지 않았다. 다음 장날, 아이는 혼자 그 할머니에게 가서 제값을 내고 사과를 샀다.` },
      { label: '흥정을 아이에게 맡긴다', check: { stat: 'elo', dc: 80, bonus: (s) => (s.stats.moral ?? 0) * 0.2 },
        success: { effects: { gold: -15, 'stat.elo': +5, 'stat.moral': +2, trust: +3 },
          result: `{name이} 사과를 하나하나 들어 보더니 말했다. "흠집 난 건 잼 만드시게 두시고, 성한 걸로 제값에 주세요." 할머니가 웃었다. 당신이 평생 못 해 본 흥정이었다.` },
        fail: { effects: { gold: -40, 'stat.elo': +2, stress: +3 },
          result: `아이는 값을 깎기는커녕 올려 버렸다. 할머니도 당신도 웃음을 터뜨렸다. 사과는 비쌌고, 집에 오는 길은 가벼웠다.` } },
    ],
  },

  // ══ 출신 전용: 은퇴한 사제 ══════════════════════════════════════════════
  {
    id: 'b06_priest_firewood', title: '반쯤 빈 장작 창고', age: [11, 16], season: 'winter', weight: 2.4, guardian: true, image: 'bg/snow_village',
    conditions: ["guardian == 'priest'"],
    text: `{name이} 장작 창고 문을 열고 굳었다. 반이 비어 있었다. "{call}, 또 줬어? 우리 겨울은?" 당신은 어제 저녁 아랫마을 과부댁에 수레를 끌고 다녀왔다. 손등에 박힌 나무 가시가 아직 빠지지 않았다.`,
    choices: [
      { label: '사과하고 나눌 몫을 함께 정한다', effects: { trust: +5, 'stat.int': +2, 'stat.moral': +2, 'pers.good': +1 },
        result: `둘이 식탁에 앉아 정했다. 나눌 몫은 열에 하나, 그 이상은 {name과} 의논하기. 아이가 종이에 적어 벽에 붙였다. 맨 아래 작은 글씨. "어기면 설거지 한 달."` },
      { label: '"우리에겐 이불이 있다"', effects: { 'stat.faith': +5, 'stat.moral': +3, trust: -3, stress: +4 },
        result: `"우리에겐 이불이 있고, 그 집엔 없다." {name은} 대답하지 않았다. 그 겨울 아이는 이불을 두 겹 덮고도 자주 깼다. 봄에 그 집 아이가 꽃을 들고 왔을 때, 받으러 나간 건 {name이었}다.` },
      { label: '아이와 숲에서 장작을 팬다', check: { stat: 'str', dc: 85, bonus: (s) => (s.stats.hp ?? 0) * 0.2 },
        success: { effects: { 'stat.str': +4, 'stat.hp': +2, trust: +4, gHealth: -3 },
          result: `일주일 동안 둘이 숲에서 장작을 팼다. 창고가 다시 찼다. 남은 한 수레는 {name이} 직접 끌고 아랫마을로 갔다. "이번엔 내가 준 거야."` },
        fail: { effects: { 'stat.str': +2, stress: +5, gHealth: -6, trust: +2 },
          result: `{name은} 도끼를 세 번 휘두르고 손바닥에 물집이 잡혔다. 나머지는 당신이 팼다. 그날 밤 둘 다 끙끙 앓았다. 창고는 겨우 찼다.` } },
      { label: '장작을 사 들인다 (-80G)', conditions: ['gold >= 80'], effects: { gold: -80, stress: -5, trust: +2 },
        result: `장작 장수가 수레를 부려 놓고 갔다. 창고를 채우는 당신을 지켜보던 {name이} 말했다. "다음엔 줄 때 말해 줘. 같이 주게."` },
    ],
  },
  {
    id: 'b06_priest_rites', title: '빗속의 등불', age: [13, 17], weight: 1.8, guardian: true,
    conditions: ["guardian == 'priest'"],
    text: `비 오는 밤, 문 두드리는 소리. 아랫마을 노파가 마지막 기도를 청한다고 했다. 당신은 서랍 깊은 곳에서 영대를 꺼냈다가 도로 넣었다. 사제복을 벗은 지 오래다. {name이} 벌써 등불을 들고 신발을 신고 있었다.`,
    choices: [
      { label: '아이와 함께 간다', effects: { 'stat.faith': +5, 'stat.sens': +4, gHealth: -4, reputation: +3, trust: +3 },
        result: `노파의 손은 가벼웠다. 당신이 기도문을 외는 동안 {name이} 등불을 들고 서 있었다. 돌아오는 빗길에 아이가 물었다. "무섭지 않았을까?" 당신은 대답 대신 아이 손을 잡았다.` },
      { label: '기도문을 아이에게 맡긴다', check: { stat: 'faith', dc: 100 },
        success: { effects: { 'stat.faith': +8, 'stat.moral': +3, reputation: +4, trust: +3 },
          result: `{name}의 목소리는 떨렸지만 끊기지 않았다. 노파가 눈을 감은 채 웃었다. "천사가 왔네." 문간에 선 당신은 영대를 쥔 손을 한참 펴지 못했다.` },
        fail: { effects: { 'stat.faith': +3, 'stat.sens': +4, stress: +5, trust: +2 },
          result: `{name이} 기도문 중간에서 막혔다. 노파가 다음 구절을 대신 이었다. 둘은 함께 끝까지 갔다. 기도는 서툴렀고, 방은 따뜻했다.` } },
      { label: '성당 사제를 부르라고 한다', effects: { trust: -3, 'pers.good': -1, gHealth: +2 },
        result: `"나는 이제 사제가 아니오." 문이 닫혔다. {name이} 등불을 내려놓았다. 그날 밤 당신 방에서는 새벽까지 묵주 굴리는 소리가 났다.` },
    ],
  },

  // ══ 출신 전용: 은퇴한 모험가 ════════════════════════════════════════════
  {
    id: 'b06_adv_map', title: '마지막 빈칸', age: [12, 16], weight: 1.8, guardian: true,
    conditions: ["guardian == 'adventurer'"],
    text: `다락을 치우다 낡은 지도가 나왔다. 왕국 구석구석에 당신 글씨로 가위표가 쳐져 있고, 딱 한 곳만 비어 있다. '세 번째 달의 샘'. 당신이 그 빈칸을 손가락으로 쓸어 보는 걸 {name이} 봤다. "{call}, 거기 왜 안 갔어?"`,
    choices: [
      { label: '"같이 가 볼래?"', check: { stat: 'agi', dc: 100 }, minigame: 'adventure',
        success: { effects: { 'stat.agi': +6, 'stat.hp': +4, trust: +6, gHealth: -5, 'pers.roman': +2 },
          result: `사흘째 새벽, 바위틈에서 물이 솟았다. 세 개의 달이 물 위에 겹쳐 떴다. 당신은 지도의 빈칸에 가위표를 쳤다. 펜 쥔 손을 {name이} 위에서 함께 잡고 있었다.` },
        fail: { effects: { 'stat.hp': +3, gHealth: -8, trust: +3, stress: +4 },
          result: `절벽 앞에서 돌아섰다. 무릎이 먼저 포기했다. {name이} 지도를 접으며 말했다. "다음엔 내가 업고 갈게." 당신은 웃었다. 지도는 버리지 않았다.` } },
      { label: '지도를 아이에게 물려준다', effects: { 'flag.b06_map_given': true, 'pers.roman': +3, 'pers.extro': +2, trust: +3 },
        result: `"빈칸은 네가 채워." {name이} 지도를 받아 들었다. 그날부터 아이 방 벽에 지도가 붙었다. 빈칸 옆에 아이 글씨로 작게 적혀 있다. "언젠가."` },
      { label: '지도를 다시 다락에 넣는다', effects: { gHealth: +3, 'pers.ambit': -2, 'stat.sens': +2 },
        result: `"이제 여기가 내 마지막 빈칸이야." 당신은 거실을 가리켰다. {name이} 고개를 갸웃했다. 그날 밤 다락에서 삐걱 소리가 났다. 아침엔 지도가 조금 다른 자리에 놓여 있었다.` },
    ],
  },
  {
    id: 'b06_adv_reunion', title: '여관의 옛 이름들', age: [13, 17], weight: 1.8, guardian: true, image: 'bg/tavern_inn', npc: 'garrett',
    conditions: ["guardian == 'adventurer'"],
    text: `항구 여관에 옛 동료들이 모였다. 가렛이 탁자를 두드리며 당신 무용담을 떠들었고, 당신은 {name이} 처음 듣는 크기로 웃었다. 동굴의 용은 잠자리에서 듣던 것보다 세 배쯤 컸다. 아이는 구석 자리에서 당신을 낯선 사람 보듯 보고 있다.`,
    choices: [
      { label: '"내 딸이야" 하고 부른다', effects: { 'pers.extro': +3, 'rel.garrett': +5, 'stat.elo': +3, stress: -6 },
        result: `옛 동료들이 차례로 아이 손을 흔들었다. {name이} 용의 진짜 크기를 폭로하자 탁자가 뒤집힐 듯 웃음이 터졌다. 돌아오는 길에 아이가 말했다. "거기선 다른 사람 같았어. 좋은 쪽으로."` },
      { label: '한 달짜리 원정 제안에 응한다', effects: { gold: +180, gHealth: -8, trust: -4, 'stat.hp': +3 },
        result: `한 달 뒤 돌아오니 {name이} 문 앞에서 팔짱을 끼고 서 있었다. "다음엔 나도 데려가." 큐브 말로는 아이가 매일 밤 지도 위에 당신이 있을 곳을 짚어 봤다고 했다.` },
      { label: '일찍 자리에서 일어난다', effects: { trust: +3, 'rel.garrett': -2, gHealth: +2, 'pers.extro': -1 },
        result: `"애가 졸려서." 아무도 믿지 않았다. {name은} 전혀 졸려 보이지 않았다. 돌아오는 길에 아이가 물었다. "더 있어도 됐는데. 나 때문이야?" 당신은 아니라고 했다. 반쯤은 거짓말이었다.` },
      { label: '세린의 잔을 채운다', conditions: ['flag.guardian_past_revealed'], effects: { 'rel.garrett': +6, 'stat.sens': +4, trust: +4 },
        result: `빈자리에 잔이 하나 놓였다. 세린의 자리였다. 가렛이 말없이 잔을 채웠고, {name이} 그 옆에 들꽃 한 송이를 놓았다. 그날 밤 탁자는 처음으로 조용했다.` },
    ],
  },

  // ══ 공통: 건강 ══════════════════════════════════════════════════════════
  {
    id: 'b06_hidden_cough', title: '장화 속 약병', age: [12, 17], weight: 2, guardian: true,
    conditions: ['gHealth <= 55'],
    text: `{name이} 당신 장화 속에서 약병을 찾아냈다. 기침을 멎게 하는 쓴 시럽, 반쯤 비어 있다. "언제부터야?" 당신이 대답을 고르는 사이 기침이 먼저 나왔다. 아이 주위로 별빛이 날카롭게 튀었다.`,
    choices: [
      { label: '의사에게 간다 (-100G)', conditions: ['gold >= 100'], effects: { gold: -100, gHealth: +15, trust: +3 },
        result: `의사는 "쉬셔야 합니다"를 다섯 번 말했다. {name이} 그걸 손가락으로 셌다. 그날부터 집안일 당번표에서 당신 이름이 절반으로 줄었다.` },
      { label: '엘다에게 약초를 청한다', conditions: ['flag.met_elda'], effects: { 'rel.elda': +5, gHealth: +10, 'stat.int': +2 },
        result: `{name이} 엘다의 오두막에서 약초 달이는 법을 배워 왔다. 매일 밤 김 나는 잔이 당신 앞에 놓였다. 맛은 끔찍했다. 아이는 다 마실 때까지 옆을 지켰다.` },
      { label: '"감기 끝물이다"', effects: { gHealth: -4, trust: -5, stress: +5, 'stat.str': +2 },
        result: (s) => (s.flags.guardian_sick
          ? `"한 번 쓰러져 놓고 또 그래?" {name이} 약병을 내려놓고 나갔다. 다음 날부터 당신 몫의 장작이 몰래 패여 있었다. 큐브 말로는 아이가 밤마다 당신 기침 소리를 센다고 했다.`
          : `{name은} 약병을 내려놓고 나갔다. 다음 날부터 당신 몫의 장작이 몰래 패여 있었다. 아무 말도 없이.`) },
      { label: '집안일을 아이에게 맡긴다', effects: { gHealth: +8, 'stat.hp': +3, stress: +6, trust: +3 },
        result: `{name이} 앞치마를 둘렀다. 빵은 탔고 빨래는 덜 말랐다. 대신 당신은 열흘 동안 낮잠을 잤다. 기침이 잦아들었다. 탄 빵 맛에도 익숙해졌다.` },
    ],
  },

  // ══ 공통: 돈 걱정 ════════════════════════════════════════════════════════
  {
    id: 'b06_night_coins', title: '새벽의 동전 소리', age: [11, 16], weight: 2.2, guardian: true,
    conditions: ['gold <= 400'],
    text: `새벽, 부엌에서 동전 소리가 났다. 물 마시러 나온 {name이} 문간에 섰다. 당신은 식탁에 동전을 탑처럼 쌓아 놓고 세 번째로 세는 중이었다. 탑은 다섯 개, 그중 둘은 아주 낮았다.`,
    choices: [
      { label: '아이를 앉혀 장부를 함께 본다', effects: { 'stat.int': +4, 'pers.roman': -2, trust: +5, stress: +3 },
        result: `{name이} 장부를 짚었다. "수업료, 식비, 지붕. 내 거 너무 많은데." "네 거라서 많은 거다." 아이는 대답 대신 다음 달 줄 하나를 지웠다. 새 옷 칸이었다.` },
      { label: '새벽 부두 일을 구한다', effects: { gold: +150, gHealth: -10, stress: +4, 'stat.sens': +2 },
        result: `다음 주부터 당신은 새벽 부두에서 짐을 날랐다. {name은} 모르는 척했다. 대신 매일 아침 식탁에 따뜻한 수프가 놓여 있었다.` },
      { label: '아끼던 물건을 판다', effects: { gold: +220, 'flag.b06_keepsake_sold': true, 'pers.ambit': +2, stress: +3 },
        result: (s) => `다음 날, ${P(s).spot} ${josa(P(s).keepsake, '이')} 보이지 않았다. {name이} 빈자리를 손끝으로 쓸어 보았다. 아무것도 묻지 않았다. 묻지 않는 쪽이 더 오래 남았다.` },
      { label: '가렛에게 빚 기한을 늦춰 달라 한다', conditions: ['flag.debt_garrett'], effects: { 'rel.garrett': -3, stress: -5, 'stat.elo': +2 },
        result: `가렛은 차용증을 구겨 주머니에 넣었다. "네가 고개 숙이는 건 처음 본다." {name이} 당신 뒤에서 가렛을 노려봤다. 가렛이 먼저 웃었다. "알았다, 알았어. 천천히 갚아."` },
    ],
  },
  {
    id: 'b06_keepsake_return', title: '돌아온 빈자리', age: [15, 17], weight: 3, guardian: true,
    conditions: ['flag.b06_keepsake_sold'],
    text: (s) => `{name이} 천으로 싼 무언가를 안고 들어왔다. 천을 벗기자 ${josa(P(s).keepsake, '이')} 나왔다. ${P(s).keepMark} "일해서 모은 돈으로 샀어. 가게 주인이 기억하더라. {call이} 팔러 왔던 날 얼굴."`,
    choices: [
      { label: '말없이 받아 든다', effects: { 'flag.b06_keepsake_sold': false, trust: +8, 'stat.sens': +3, stress: -8 },
        result: `당신은 그것을 받아 들고 한참 서 있었다. 그리고 원래 자리에 두었다. 그날 저녁 당신은 평소보다 말이 많았다. {name은} 그게 무슨 뜻인지 알았다.` },
      { label: '"이건 이제 네 거다"', effects: { 'flag.b06_keepsake_sold': false, 'pers.ambit': +2, 'stat.moral': +3, trust: +5 },
        result: `"그럼 내가 지킬게." {name이} 그것을 자기 방에 두었다. 문을 열면 당신 방에서도 보이는 자리였다.` },
      { label: '값을 치르겠다고 한다', effects: { 'flag.b06_keepsake_sold': false, gold: -60, trust: -2, 'pers.roman': -2 },
        result: `당신이 동전 주머니를 내밀자 {name이} 뒤로 물러섰다. "선물이야. 값 매기지 마." 주머니는 식탁 위에 남았다. 다음 날 그 돈으로 둘이 장에 가서 고기를 샀다.` },
    ],
  },

  // ══ 공통: 실수와 사과 ═════════════════════════════════════════════════════
  {
    id: 'b06_wrong_blame', title: '사라진 동전 단지', age: [10, 15], weight: 1.6, guardian: true,
    text: `찬장 단지의 동전 50G가 사라졌다. 당신은 저녁 내내 {name을} 몰아세웠고, 아이는 끝까지 "안 가져갔어"라고만 했다. 다음 날 아침, 큐브가 구석에서 단지를 들고 나왔다. "쥐가 탐내길래 숨겨 뒀어요, 주인님!"`,
    choices: [
      { label: '아이 방 문을 두드려 사과한다', effects: { trust: +8, 'stat.sens': +2, 'pers.agree': +1 },
        result: `"어제 일, 내가 틀렸다. 미안하다." 문은 한참 뒤에 열렸다. 눈이 부은 {name이} 말했다. "다음엔 먼저 물어봐." 그 말을 하고 나서야 아이가 당신 소매를 잡았다.` },
      { label: '과자점에 데려가 넘어간다', effects: { gold: -30, stress: -5, trust: +2, 'pers.roman': -1 },
        result: `{name은} 과자를 받고 고맙다고 했다. 그리고 물었다. "근데 이걸로 미안한 거 끝난 거야?" 당신은 대답하지 못했다.` },
      { label: '"오해받을 일을 하지 마라"', effects: { trust: -8, 'pers.agree': -3, stress: +6 },
        result: (s) => `"애초에 오해받을 행동을—" 말이 끝나기 전에 문이 닫혔다. 그 뒤로 {name은} 찬장 근처에 가지 않았다.${s.seen?.secret_letter_confront ? ' 문 너머로 작은 목소리가 들렸다. "내 편지도 몰래 읽었으면서."' : ' 당신이 시키지 않는 한.'}` },
      { label: '원고 일까지 함께 사과한다', conditions: ['flag.b06_scholar_pride'], effects: { trust: +12, 'pers.agree': +2, 'stat.int': +2 },
        result: `"그때 원고 일도 미안했다. 네가 맞았다." {name이} 눈을 동그랗게 떴다. "그걸 아직 기억해?" "매일 봤다. 붉은 글씨." 아이가 웃다가 울었다.` },
    ],
  },

  // ══ 공통: 아이에게서 배우는 것 ══════════════════════════════════════════
  {
    id: 'b06_teach_me', title: '오늘은 내가 선생님', age: [12, 17], weight: 1.5, guardian: true,
    text: `{name이} 당신을 식탁에 앉히고 숯 한 토막을 쥐었다. "오늘은 내가 선생님이야. {call은} 학생. 질문은 손 들고." 큐브가 맨 앞자리에 내려앉았다. 아이는 헛기침부터 했다. 누구 버릇인지 뻔했다.`,
    choices: [
      { label: '성실한 학생이 된다', effects: { trust: +6, 'stat.elo': +3, 'pers.ambit': +1 }, result: (s) => TEACH[topCat(s)].diligent },
      { label: '일부러 엉뚱한 답을 한다', effects: { stress: -8, trust: +3, 'pers.extro': +2 }, result: (s) => TEACH[topCat(s)].silly },
      { label: '피곤하니 다음에 하자고 한다', effects: { gHealth: +3, trust: -4, 'pers.extro': -1 },
        result: `"다음에 하자." {name이} 숯을 내려놓았다. "응. 다음에." 다음은 오지 않았다. 몇 달 뒤 당신이 수업을 청했을 때, 아이는 이미 다른 걸 배우고 있었다.` },
    ],
  },

  // ══ 공통: 보호자의 부모 (3단계 연쇄) ═══════════════════════════════════════
  {
    id: 'b06_hometown_letter', title: '고향에서 온 편지', age: [10, 15], weight: 1.8, guardian: true,
    text: `역마차 마부가 편지 한 통을 건넸다. 겉봉의 글씨가 떨렸다. 보낸 이는 고향 마을의 당신 어머니였다. "요즘 자꾸 네 어릴 적 꿈을 꾼다. 한 번 다녀가렴." 당신은 편지를 세 번 읽고 세 번 접었다. {name이} 물었다. "{call}도 엄마가 있어?"`,
    choices: [
      { label: '아이와 함께 간다 (-100G)', conditions: ['gold >= 100'], effects: { gold: -100, stress: -6, trust: +3 }, next: 'b06_hometown_porch',
        result: `마차로 사흘. {name은} 창에 이마를 대고 지나가는 마을을 하나하나 세었다. 당신은 고개 하나를 넘을 때마다 옷깃을 다시 여몄다.` },
      { label: '혼자 다녀온다', effects: { gold: -50, gHealth: -4, 'stat.sens': +3, 'stat.hp': +2 },
        result: `열흘 뒤 당신은 말린 사과 한 봉지를 내밀었다. "네 할머니가 보냈다." {name은} 봉지를 오래 들고 있었다. '할머니'라는 말을 입속으로 굴려 보는 것 같았다.` },
      { label: '돈만 부친다', effects: { gold: -60, stress: +3, trust: -2, 'pers.roman': -1 },
        result: `당신은 은화 몇 닢을 편지에 싸 부쳤다. 답장은 오지 않았다. 그 뒤로 역마차가 지나갈 때마다 {name이} 창밖을 내다봤다. 당신보다 먼저.` },
    ],
  },
  {
    id: 'b06_hometown_porch', title: '할머니의 문간', chainOnly: true, age: [10, 15], guardian: true, image: 'bg/wheat_field',
    text: `고향 집 문간 의자에 작은 노인이 앉아 있었다. 노인은 당신을 보자마자 "밥은 먹고 다니냐"고 했고, {name을} 보고는 한참 말이 없다가 손을 내밀었다. "네가 그 별 같은 아이구나." 아이의 별빛이 노인 손등 위로 내려앉았다.`,
    choices: [
      { label: '어릴 적 얘기를 졸라 듣는다', effects: { 'stat.sens': +3, trust: +4, stress: -5 }, next: 'b06_hometown_farewell',
        result: (s) => `노인은 신이 나서 털어놓았다. 일곱 살에 지붕에서 떨어진 일, 아홉 살에 집을 나갔다가 저녁밥 냄새에 돌아온 일. {name이} 배를 잡고 웃었다. 당신은 처마 끝만 봤다. 귀가 빨갰다.${s.flags.ran_away ? ' 아이가 당신 옆구리를 찔렀다. "나랑 똑같네."' : ''}` },
      { label: '할머니의 밭일을 돕는다', effects: { 'stat.hp': +3, 'stat.moral': +3, 'pers.good': +1 }, next: 'b06_hometown_farewell',
        result: `{name이} 소매를 걷고 감자를 캤다. 노인은 아이 손의 흙을 털어 주며, 당신 쪽은 보지도 않고 말했다. "너보다 낫다." 당신은 말없이 감자 바구니를 들었다. 이 집에서 그 말투는 칭찬이었다.` },
      { label: '하룻밤 더 묵어 간다', effects: { trust: +2, gHealth: +3, 'stat.cult': +2 }, next: 'b06_hometown_farewell',
        result: `"하루만 더 있다 가자." {name이} 먼저 말했다. 그날 밤 셋은 좁은 방에 나란히 누웠다. 노인의 코 고는 소리 사이로 아이가 속삭였다. "{call}, 여기서 컸구나."` },
    ],
  },
  {
    id: 'b06_hometown_farewell', title: '새벽의 보따리', chainOnly: true, age: [10, 15], guardian: true, image: 'bg/road',
    text: `떠나는 새벽, 노인이 {name}에게만 보따리를 쥐여 주며 귓속말을 했다. 아이는 고개를 끄덕이며 당신을 힐끔 봤다. 마차가 마을을 벗어날 때까지 당신은 앞만 봤다. 언덕을 넘고 나서야 뒤를 돌아봤다. 집은 이미 보이지 않았다.`,
    choices: [
      { label: '무슨 얘기를 들었는지 묻는다', effects: { 'flag.b06_birthday_known': true, 'stat.elo': +2, trust: +2 },
        result: `"비밀이야." {name이} 입을 꾹 다물었다. 그리고 집에 오자마자 달력 한 칸에 몰래 동그라미를 쳤다. 당신 눈에 띄지 않게, 뒷장에.` },
      { label: '보따리를 풀어 본다', effects: { 'flag.b06_birthday_known': true, gHealth: +8, 'stat.sens': +2 },
        result: `말린 약초와 약병 하나, 그리고 쪽지. "이 녀석은 일만 한다. 네가 챙겨 먹여라." {name이} 쪽지를 접어 주머니에 넣었다. 그 뒤로 당신 약 먹는 시간은 아이가 챙겼다.` },
      { label: '다음엔 오래 있자고 약속한다', effects: { 'flag.b06_birthday_known': true, 'pers.roman': +2, trust: +4, stress: -4 },
        result: `"다음엔 일주일 있자." {name이} 새끼손가락을 내밀었다. 당신은 손가락을 걸고 마차 창밖으로 손을 한 번 더 흔들었다. 언덕 너머라 보일 리 없었다.` },
    ],
  },
  {
    id: 'b06_guardian_birthday', title: '몰랐던 생일', age: [13, 17], weight: 1.5, guardian: true,
    text: `"{call} 생일은 언제야?" 달력을 들고 온 {name이} 물었다. 당신은 대답하지 못했다. 마지막으로 누가 생일을 챙겨 준 게 언제였는지도 떠오르지 않았다. 아이가 달력 모서리를 만지작거렸다.`,
    choices: [
      { label: '"네가 아무 날이나 정해라"', effects: { trust: +4, 'pers.roman': +2, 'stat.sens': +2 },
        result: (s) => `"그럼 오늘로 해." 그날 저녁 {name이} 밀가루 범벅인 케이크를 내밀었다. 초는 하나. "몇 살인지 모르니까."${s.flags.has_cat ? ' 달무리가 케이크 모서리를 몰래 핥았다.' : ''} 당신은 초를 끄고도 한참 숟가락을 들지 못했다.` },
      { label: '"생일 같은 건 필요 없다"', effects: { trust: -3, stress: +3, 'pers.roman': -1 },
        result: `{name은} 달력을 내려놓았다. 그해 겨울, 식탁에 꾹꾹 눌러 쓴 카드가 놓여 있었다. "생일 없는 사람 축하하는 날. 축하해." 당신은 그 카드를 품에 넣고 다녔다.` },
      { label: '"네 생일과 같은 날로 하자"', effects: { trust: +5, 'stat.sens': +3, 'rel.cube': +3 },
        result: `"별의 밤으로 하자. 네가 온 날." {name이} 고개를 저었다. "그럼 내 날이 반으로 줄잖아." 실랑이 끝에 그해 별의 밤엔 케이크가 두 개 놓였다. 큐브가 제일 기뻐했다.` },
      { label: '"할머니한테 들었잖아?"', conditions: ['flag.b06_birthday_known'], effects: { trust: +8, stress: -8, 'stat.cult': +2 },
        result: `{name이} 씩 웃었다. "들켰네. 확인해 본 거야." 그날 저녁 식탁에 고향 사과로 구운 파이가 놓였다. 할머니의 방식 그대로였다. 당신은 포크를 내려놓고 한동안 창밖만 봤다.` },
    ],
  },
];
