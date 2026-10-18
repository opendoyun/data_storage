// 연간 보호자 결정 (GDD 2: 연말 생일마다 1번 큰 방향 결정)
// ANNUAL[age] — 생일로 age가 '된' 직후(1월) 제시. 11~17세.
// 규칙: 선택지 3~4개, 조건 없는 선택지 2개 이상, 해마다 아이에게 맡기는 선택지 1개(신뢰↑·순응↑).
//       돈이 드는 선택지는 conditions: ['gold >= 비용'] (결정 직후 소지금이 음수가 되지 않게).
//       능력치를 크게(합 15 이상) 주는 선택지에는 대가(금전·스트레스·신뢰·보호자 건강·성격)를 하나 이상 붙인다.
//       아이에게 맡기는 선택지는 능력치를 작게 두는 대신 신뢰·스트레스로 보상한다. 공짜로 다 좋은 선택지는 두지 않는다.
// 공개 플래그 (다른 콘텐츠가 읽어도 된다. 지금은 items.js의 해금 조건이 읽는다):
//   annual_11_work    11세에 일을 배우게 함          → 가죽 작업 앞치마
//   annual_12_elda    12세 스승 = 엘다               → 물푸레 지팡이
//   annual_12_garrett 12세 스승 = 가렛               → 가죽 팔 보호대
//   annual_12_loren   12세 스승 = 마담 로렌(여름반)   → 검정 레이스 부채
//   annual_13_capital 13세 왕도 유학                 → 왕립 도서관 열람패
//   annual_13_harbor  13세 항구 상단 견습            → 놋쇠 나침반
//   annual_16_debut   16세 왕도 사교계 데뷔          → 무도회용 흰 장갑
// label에는 이름 토큰을 쓰지 않는다(annualLog에 원문 그대로 남기 때문). text/desc/result는 토큰 사용.

// 14세 '당신이 일을 더 맡는다' — 보호자 출신마다 일감이 다르다
const OVERTIME_JOB = {
  knight: '옛 기사단 동료가 넘겨준 상단 호위',
  scholar: '왕도 서기관실의 밤샘 필사',
  merchant: '옛 거래처 세 곳의 묵은 장부 정리',
  priest: '이웃 마을들의 혼례와 장례 축복',
  adventurer: '모험가 길드의 신참 안내',
};

// 16세 '어떤 어른이 되고 싶은지 묻는다' — 대답은 아이의 성격을 따른다
function grownUpAnswer(s) {
  const p = s.personality || {};
  if (p.ambit >= 30) return '"사람들이 내 이름을 듣고 고개를 끄덕이는 어른."';
  if (p.good >= 30) return '"누가 울고 있으면 그냥 지나치지 않는 어른."';
  if (p.roman >= 30) return '"밤하늘을 올려다봐도 하나도 안 무서운 어른."';
  if (p.extro >= 30) return '"어디를 가든 친구가 한 명은 꼭 생기는 어른."';
  if (p.agree <= -30) return '"누가 정해 준 길 말고, 내가 고른 길을 걷는 어른."';
  return '"{call} 같은 어른. …이건 비밀로 해 줘."';
}

export const ANNUAL = {
  // ── 11세: 배움의 길 ───────────────────────────────────────────────
  11: {
    title: '열한 살, 배움의 길',
    image: 'bg/school',
    text: '생일 케이크의 촛불이 꺼지자 큐브가 접시를 치우며 속삭였다. "주인님, 읍내 학교 입학 원서 마감이 이번 달이에요!" 창가에서는 {name이} 김 서린 유리에 손가락으로 별을 그리고 있다. 이 아이에게 세상을 어떻게 가르칠지, 올해 정해야 한다.',
    options: [
      { id: 'school', label: '학교에 보낸다', desc: '읍내 학교에 입학시킨다. 또래와 부대끼며 지식과 교양을 쌓는다. (입학금 60G)', conditions: ['gold >= 60'],
        effects: { 'stat.int': +10, 'stat.cult': +6, 'stat.elo': +3, 'pers.extro': +3, stress: +4, gold: -60 },
        result: '입학식 날, {name은} 새 가방끈을 두 손으로 꼭 쥐고 교문을 지났다. 저녁에는 "짝꿍이 내 머리가 첫눈 같대!" 하며 하루 이야기를 쉬지 않고 쏟아냈다.' },
      { id: 'home', label: '집에서 직접 가르친다', desc: '당신이 아는 모든 것을 식탁에서 가르친다. 느리지만 깊다.',
        effects: { 'stat.int': +6, 'stat.moral': +5, 'stat.sens': +6, trust: +6, 'pers.extro': -3 },
        result: '식탁이 교실이 되었다. {name은} 당신이 그린 삐뚤빼뚤한 지도 위로 손가락 길을 내며 물었다. "{call}, 이 강 끝에는 뭐가 있어?" 모르는 건 함께 찾아보기로 했다.' },
      { id: 'work', label: '일을 배우게 한다', desc: '방앗간 심부름과 장터 짐 나르기부터. 손으로 세상을 익히고 품삯도 받는다.',
        effects: { 'stat.hp': +8, 'stat.str': +5, 'stat.elo': +5, 'pers.ambit': -2, stress: +5, gold: +80, 'flag.annual_11_work': true },
        result: '방앗간 할머니는 {name을} "꼬마 일꾼"이라 불렀다. 첫 품삯을 내밀며 {name이} 말했다. "반은 {call} 거. 나머지 반으로는 큐브 리본 사 줄래."' },
      { id: 'ask', label: '아이에게 묻는다', desc: '어떻게 배우고 싶은지, 아이의 대답을 그대로 따른다.',
        effects: { trust: +8, 'pers.agree': +3, 'stat.sens': +5, 'stat.int': +4, stress: -6 },
        result: '"{call}, 나 다 해 보고 싶어. 아침엔 학교, 오후엔 {call랑} 공부, 장날엔 심부름!" 욕심 많은 계획표는 한 달 만에 반으로 줄었지만, {name은} 스스로 정한 몫을 끝까지 지켰다.' },
    ],
  },

  // ── 12세: 올해의 스승 ─────────────────────────────────────────────
  12: {
    title: '열두 살, 스승을 찾아서',
    image: 'bg/snow_village',
    text: '{name은} 부쩍 자랐다. 팔다리가 길어지고, 질문은 당신이 대답할 수 있는 것보다 빨리 늘어난다. 올해는 바깥 스승에게 한 해를 맡겨 볼까. 평원의 엘다, 항구의 가렛, 왕도의 마담 로렌. 세 사람 모두 한번 데려와 보라는 편지를 보내왔다.',
    options: [
      { id: 'elda', label: '엘다의 오두막에 보낸다', desc: '약초와 별의 이야기. 마력과 감수성이 자란다.',
        effects: { 'stat.mag': +8, 'stat.sens': +6, 'stat.int': +4, 'rel.elda': +10, 'pers.roman': +3, 'pers.extro': -2, 'flag.annual_12_elda': true },
        result: '엘다는 첫날 {name}에게 지팡이가 아니라 물뿌리개를 쥐여 주었다. "마법은 기다리는 법부터예요." 봄이 끝날 무렵, {name이} 손댄 씨앗에서만 금빛 싹이 텄다.' },
      { id: 'garrett', label: '가렛의 훈련장에 보낸다', desc: '항구 용병단의 새벽 훈련. 몸이 단단해지고 배짱이 붙는다.',
        effects: { 'stat.str': +8, 'stat.agi': +6, 'stat.hp': +5, 'rel.garrett': +10, 'pers.extro': +2, 'pers.agree': -2, stress: +5, 'flag.annual_12_garrett': true },
        result: '"하하! 네 딸이 내 부하들보다 먼저 일어나더라!" 가렛의 편지는 늘 그렇게 시작했다. 가을에 돌아온 {name은} 손바닥의 굳은살을 훈장처럼 내밀었다.' },
      { id: 'loren', label: '로렌의 예절학교 여름반', desc: '왕도에서 한 계절. 예절과 교양을 익히지만 학비가 든다. (180G)', conditions: ['gold >= 180'],
        effects: { 'stat.eti': +10, 'stat.cult': +6, 'stat.chm': +4, 'rel.loren': +10, 'pers.ambit': +3, gold: -180, 'flag.annual_12_loren': true },
        result: '마담 로렌의 편지는 짧았다. "따님은 찻잔을 지나치게 조심스럽게 듭니다. 고칠 필요가 없는 버릇이지요." 돌아온 {name은} 인사할 때 치맛자락을 아주 조금 집었다.' },
      { id: 'free', label: '아이에게 스승을 고르게 한다', desc: '세 사람의 편지를 모두 보여 주고, 고르는 건 아이에게 맡긴다.',
        effects: { trust: +8, 'pers.agree': +3, 'stat.elo': +5, 'rel.elda': +3, 'rel.garrett': +3, 'rel.loren': +3 },
        result: '편지 세 통을 한참 들여다보던 {name이} 고개를 들었다. "셋 다 한 번씩 만나 보고 정하면 안 돼?" 한 해는 세 사람 사이를 오가는 여행이 되었고, 셋 모두 {name을} 기억했다.' },
    ],
  },

  // ── 13세: 집을 떠나 보는 해 ───────────────────────────────────────
  13: {
    title: '열세 살, 바깥 공기',
    image: 'bg/road',
    text: '큐브가 낡은 왕국 지도를 식탁에 펼쳤다. "주인님, 열세 살이면 한 해쯤 바깥 공기를 마셔 볼 나이예요!" 왕도의 기숙 학당, 바닷바람 부는 항구 상단, 엘다가 사는 평원 깊은 곳. {name이} 세 곳에 차례로 손가락을 얹었다가, 마지막엔 우리 집 지붕 그림 위에서 멈췄다.',
    options: [
      { id: 'capital', label: '왕도로 유학 보낸다', desc: '왕립 학당 기숙사에서 한 해. 지식과 예절이 크게 늘지만 비싸다. (250G)', conditions: ['gold >= 250'],
        effects: { 'stat.int': +10, 'stat.eti': +8, 'stat.cult': +6, 'pers.ambit': +4, 'rel.theodora': +6, stress: +6, gold: -250, 'flag.annual_13_capital': true },
        result: '왕도의 편지는 석 달 내내 "테오도라라는 애가 자꾸 시비를 걸어"였다가, 넉 달째부터 "테오도라랑 도서관 갔어"로 바뀌었다. 겨울에 돌아온 {name은} 포크를 바깥쪽부터 집었다.' },
      { id: 'harbor', label: '항구 상단에 보낸다', desc: '가렛이 소개한 상단에서 견습. 흥정과 바다를 배우고 품삯도 받는다.',
        effects: { 'stat.elo': +10, 'stat.agi': +6, 'stat.chm': +4, 'pers.extro': +3, 'pers.roman': -2, 'rel.garrett': +5, stress: +4, gold: +60, 'flag.annual_13_harbor': true },
        result: '{name은} 생선값 깎는 법보다 선원들의 노래를 먼저 배웠다. 돌아온 날 짐 속에서 조개껍데기 한 줌과 은화 몇 닢이 나왔다. "은화는 저금하고, 조개는 큐브 줄 거야."' },
      { id: 'plains', label: '평원의 엘다에게 맡긴다', desc: '밭일과 약초, 고요한 밤하늘. 몸과 마음이 단단해진다.',
        effects: { 'stat.hp': +8, 'stat.sens': +6, 'stat.mag': +5, 'rel.elda': +8, 'pers.ambit': -3, stress: -6 },
        result: '엘다는 편지 대신 말린 꽃 한 다발을 보내왔다. 꽃잎 사이에 {name}의 쪽지가 끼워져 있었다. "{call}, 여기선 별이 땅까지 내려와. 처음으로 아무것도 안 무서웠어."' },
      { id: 'stay', label: '아이의 뜻대로 한다', desc: '지도 위 어디에 손가락을 멈출지, 아이에게 맡긴다.',
        effects: { trust: +10, 'pers.agree': +4, 'stat.sens': +5, 'stat.cult': +4, stress: -8 },
        result: '{name은} 끝내 지붕 그림을 가리켰다. "아직은 여기 있고 싶어. 대신 내년엔 진짜 갈게." 그날 밤 큐브가 지도를 곱게 접어 {name}의 서랍에 넣어 두었다.' },
    ],
  },

  // ── 14세: 살림의 해 (GDD 4.5 중반 자금 압박) ──────────────────────
  14: {
    title: '열네 살, 빠듯한 겨울',
    image: 'bg/room_winter',
    text: '장부를 덮으며 내쉰 한숨을 {name이} 들은 모양이다. 학비, 장작값, 새로 맞춰야 할 신발. 올겨울은 유난히 길 것 같다. 큐브가 찻잔을 내려놓으며 눈치를 본다. "주인님, 제 나비넥타이라도 팔까요?" 올해 이 집 살림을 어떻게 꾸릴지 정해야 한다.',
    options: [
      { id: 'overtime', label: '당신이 일을 더 맡는다', desc: '옛 솜씨로 일감을 더 받아 온다. 돈은 모이지만 몸이 축나고 집을 비운다.',
        effects: { gold: +260, gHealth: -10, trust: -3, 'stat.sens': +5, 'stat.hp': +4 },
        result: (s) => `당신은 ${OVERTIME_JOB[s.guardian] ?? '밀린 일감'}까지 떠맡았다. 해 뜨기 전에 나가 별이 뜬 뒤에 돌아오면, 식탁엔 늘 {name이} 데워 둔 수프가 있었다. "{call}, 오늘도 늦어?" 그 말이 장부의 숫자보다 무거웠다.` },
      { id: 'stall', label: '장터에 좌판을 함께 연다', desc: '장날마다 둘이서 좌판을. 흥정과 사람 상대를 배운다.',
        effects: { gold: +140, 'stat.elo': +8, 'stat.chm': +5, 'pers.extro': +3, trust: +3, stress: +5 },
        result: '첫 장날, {name은} 손님 앞에서 얼어붙었다. 셋째 장날에는 "이 사과는 별이 떨어진 밭에서 났어요!" 하며 바구니를 비웠다. 거짓말은 아니었다. 정말 그 밭이었으니까.' },
      { id: 'thrift', label: '허리띠를 졸라맨다', desc: '외식도 새 옷도 없이 한 해를 버틴다. 소박함을 배우지만 고단하다.',
        effects: { gold: +180, 'stat.moral': +6, 'stat.hp': -4, 'pers.ambit': -3, stress: +6 },
        result: '겨울 내내 저녁은 감자 수프였다. {name은} 한 번도 투정하지 않았다. 봄이 오던 날, 장작더미 뒤에서 꺾어 온 들꽃을 식탁에 꽂으며 말했다. "이건 공짜야."' },
      { id: 'share', label: '아이와 장부를 함께 본다', desc: '사정을 숨기지 않고 털어놓은 뒤, 아이의 생각을 따른다.',
        effects: { trust: +9, 'pers.agree': +3, 'pers.ambit': +2, 'stat.int': +6, 'stat.moral': +4, gold: +60 },
        result: '{name은} 장부를 한참 들여다보더니 깃펜으로 동그라미 세 개를 쳤다. "이거, 이거, 이거. 안 사도 돼. 그리고 나도 뭐든 할래." 숫자보다 그 목소리가 든든했다.' },
    ],
  },

  // ── 15세: 닫힌 방문 (사생활 규칙) ─────────────────────────────────
  15: {
    title: '열다섯 살, 닫힌 방문',
    image: 'bg/starnight',
    text: '요즘 {name}의 방문은 닫혀 있는 날이 많다. 안에서 웃음소리가 들리다가도 노크하면 뚝 그친다. 어젯밤엔 문틈으로 금빛 별 부스러기가 새어 나왔다. 큐브가 당신의 소매를 잡아당긴다. "주인님, 올해 집 규칙을 다시 정할 때가 됐어요."',
    options: [
      { id: 'privacy', label: '방과 일기는 건드리지 않는다', desc: '노크하고 기다린다. 아이가 말하지 않은 것은 캐묻지 않는다.',
        effects: { trust: +10, 'pers.agree': +2, 'pers.extro': -2, 'stat.sens': +6, stress: -6 },
        result: '당신은 방문에 작은 종을 달았다. 들어가기 전에 울리는 종. 사흘 뒤, 종 옆에 {name}의 글씨로 쪽지가 붙었다. "고마워. 가끔은 그냥 열어도 돼."' },
      { id: 'curfew', label: '통금과 행선지 보고를 정한다', desc: '해 지기 전 귀가, 나갈 땐 어디 가는지 말하기. 단정해지지만 숨이 막힌다.',
        effects: { 'stat.eti': +8, 'stat.moral': +5, trust: -6, 'pers.agree': -3, stress: +8 },
        result: '규칙은 지켜졌다. 저녁 종이 울리기 전에 문이 열렸고, 행선지는 늘 정확했다. 다만 {name}의 대답이 조금씩 짧아졌다. "응." "알았어." "다녀왔어."' },
      { id: 'teatime', label: '저녁마다 차 한 잔을 청한다', desc: '캐묻지 않는다. 매일 저녁 차 한 잔 동안만 마주 앉는다.',
        effects: { trust: +5, 'stat.elo': +6, 'stat.cult': +4, 'pers.extro': +3, stress: -3 },
        result: '처음 열흘은 "몰라", "그냥"이 전부였다. 스무 날째 밤, {name이} 찻잔을 내려놓았다. "{call}, 오늘 친구가 이상한 말을 했는데…" 그날 차는 두 번 데웠다.' },
      { id: 'pact', label: '규칙을 아이가 직접 쓰게 한다', desc: '아이가 쓴 규칙에 당신도 서명한다. 지키는 건 둘 다다.',
        effects: { trust: +8, 'pers.agree': +4, 'stat.moral': +5, 'stat.elo': +4, stress: -4 },
        result: '{name이} 내민 종이에는 규칙이 다섯 줄 적혀 있었다. 넷째 줄은 "{call}도 밤늦게 혼자 걱정하지 말 것." 당신은 웃으며 맨 아래에 서명했다.' },
    ],
  },

  // ── 16세: 성년식을 향하여 ─────────────────────────────────────────
  16: {
    title: '열여섯 살, 성년식을 향하여',
    image: 'bg/castle_hall',
    text: '셀레스티아에서는 열여덟 살 봄에 성년식을 치른다. 이제 두 해. 왕도의 귀족 아이들은 사교계 데뷔를, 기사 지망생들은 견습 시험을, 성당은 성년 수련반을 준비한다. {name이} 어떤 어른으로 그날을 맞을지, 올해의 준비가 방향을 정한다.',
    options: [
      { id: 'debut', label: '왕도 사교계 데뷔를 준비한다', desc: '로렌의 소개로 데뷔 무도회에 선다. 드레스와 수업료가 든다. (220G)', conditions: ['gold >= 220'],
        effects: { 'stat.chm': +10, 'stat.eti': +8, 'stat.elo': +4, 'rel.loren': +6, 'rel.theodora': +4, 'pers.ambit': +3, reputation: +5, gold: -220, 'flag.annual_16_debut': true },
        result: '데뷔 무도회 날, 계단 위에 선 {name}의 주위로 금빛 별이 하나둘 떠올랐다. 웅성거림이 잦아들었다. 마담 로렌이 부채 뒤에서 아주 작게 고개를 끄덕였다.' },
      { id: 'squire', label: '기사 견습 시험에 도전시킨다', desc: '근위대 견습 시험을 목표로 한 해 내내 단련한다.',
        effects: { 'stat.str': +8, 'stat.agi': +8, 'stat.hp': +6, 'stat.moral': +4, 'rel.garrett': +4, 'pers.ambit': +3, stress: +8 },
        result: '시험장 모래밭에서 {name은} 세 번 넘어지고 네 번 일어났다. 근위대장이 명부에 무언가 적으며 중얼거렸다. "넘어지는 법을 아는군." 칭찬인지는 아직 모른다.' },
      { id: 'vow', label: '성당의 성년 수련반에 보낸다', desc: '대주교가 이끄는 수련반. 신앙과 도덕, 그리고 마음의 고요.',
        effects: { 'stat.faith': +10, 'stat.moral': +6, 'stat.sens': +5, 'pers.good': +4, 'pers.ambit': -2, reputation: +3, stress: -3 },
        result: '수련반의 마지막 밤, 촛불 서른 개 가운데 {name}의 촛불만 금빛으로 탔다. 대주교는 아무것도 묻지 않고 그 촛불을 제단 맨 앞으로 옮겨 놓았다.' },
      { id: 'her_way', label: '어떤 어른이 되고 싶은지 묻는다', desc: '정답이 있는 질문이 아니다. 아이의 대답대로 한 해를 쓴다.',
        effects: { trust: +10, 'pers.agree': +3, 'stat.sens': +6, 'stat.cult': +5, stress: -6 },
        result: (s) => `{name은} 한참 생각하다가 대답했다. ${grownUpAnswer(s)} 그 대답을 따라 정해진 수업 없이 한 해를 보냈다. 이상하게도 아깝지 않았다.` },
    ],
  },

  // ── 17세: 독립 준비 ───────────────────────────────────────────────
  17: {
    title: '열일곱 살, 마지막 한 해',
    image: 'bg/wheat_field',
    text: '내년 이맘때면 {name은} 열여덟이다. 별똥별이 떨어진 들판에서 데려온 아이가 이제 현관 앞에서 당신과 눈높이를 맞춘다. 어젯밤 {name이} 물었다. "{call}, 나 혼자서도 잘할 수 있을까?" 남은 한 해, 무엇을 준비하게 할지 정해야 한다.',
    options: [
      { id: 'lodging', label: '왕도에 하숙방을 얻어 준다', desc: '혼자 사는 연습. 집세가 들지만 세상을 배운다. (200G)', conditions: ['gold >= 200'],
        effects: { 'stat.elo': +8, 'stat.int': +6, 'stat.eti': +4, 'pers.ambit': +4, 'pers.extro': +2, trust: +3, stress: +5, gold: -200 },
        result: '하숙방 창문은 북쪽을 향했다. 첫 편지는 "빨래가 안 말라"로 시작해 "근데 여기서도 별이 집이랑 똑같이 보여"로 끝났다. 당신은 그 편지를 장부 사이에 끼워 두었다.' },
      { id: 'household', label: '집안 살림을 통째로 맡긴다', desc: '장부, 장보기, 지붕 수리까지. 집이 곧 연습장이다.',
        effects: { 'stat.int': +5, 'stat.hp': +5, 'stat.moral': +5, 'stat.elo': +4, 'pers.ambit': -2, gHealth: +6, stress: +4, gold: +80 },
        result: '석 달 만에 장부의 빨간 줄이 사라졌다. 새는 지붕은 {name이} 직접 올라가 막았다. 큐브가 감탄했다. "주인님, 이제 주인님이 하실 일이 없어요!" 당신은 처음으로 늦잠을 잤다.' },
      { id: 'journey', label: '홀로 짧은 여행을 보낸다', desc: '왕국 끝 등대까지 다녀오는 한 계절의 여행. 걱정은 당신 몫이다. (여비 100G)', conditions: ['gold >= 100'],
        effects: { 'stat.agi': +6, 'stat.hp': +5, 'stat.sens': +6, 'pers.extro': +3, 'pers.roman': +3, trust: +4, stress: -6, gold: -100 },
        result: '{name은} 계절 하나를 꼬박 채우고 돌아왔다. 햇볕에 그을린 콧등, 낯선 노래 세 곡, 길에서 주운 이야기들. "{call}, 세상은 생각보다 넓고, 집은 생각보다 가까웠어."' },
      { id: 'together', label: '남은 한 해를 아이에게 맡긴다', desc: '무엇을 준비할지, 혹은 준비하지 않을지 아이가 정한다.',
        effects: { trust: +10, 'pers.agree': +3, 'stat.sens': +5, 'stat.elo': +4, stress: -8 },
        result: '"그럼 올해는 {call랑} 하고 싶은 거 다 할래." {name이} 손가락을 접으며 목록을 읊었다. 첫 번째는 별똥별이 떨어졌던 그 들판에 다시 가 보는 것이었다.' },
    ],
  },
};
