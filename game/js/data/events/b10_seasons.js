// 배치 b10 — 계절과 일상 (첫눈 · 장마 · 여름 강가 · 가을 수확 · 겨울 추위 · 감기 · 이웃의 경조사 · 장날 · 별똥별 비 · 달무리 · 가족의 작은 의식)
// 4개 고정 축제(3·6·9·12월)와 겹치지 않도록 모든 이벤트는 그 달을 피한다(month 지정 또는 'month != n' 조건).
// 계절 구분은 엔진 SEASONS 기준: 겨울 11·12·1 / 봄 2·3·4 / 여름 5·6·7 / 가을 8·9·10.
//
// 공용 플래그 세팅: has_cat — core lost_kitten(10~12세)을 놓친 판의 두 번째 계기. 고양이가 두 마리 생기지 않도록
//   lost_kitten을 이미 지나간 판에서만 열린다.
//   ① 달무리 뜬 밤 b10_halo_cat ─(창가에 먹이만)─▶ 창틀의 손님 b10_halo_cat_stay*   (겨울, seen.lost_kitten 필요)
//   ② 마그다 할머니의 고양이 b10_widow_cat (봄, 13세~ — lost_kitten 창이 닫힌 뒤, 이웃의 조사)
// has_cat 고양이 이벤트: b10_cat_gift(여름) · b10_cat_sick(겨울) · b10_cat_farewell(16~17, 가을) + b10_swallow_nest의 선택지
// 연쇄: 장마 b10_monsoon_week → b10_monsoon_dyke* → b10_monsoon_mill*  /  첫 좌판 b10_market_stall → b10_market_thief*
// 계절을 넘는 흔적(비공개 플래그):
//   b10_snow_letter(첫눈 편지 → 이듬해 첫눈의 개봉 b10_snow_letter_open → 해마다 b10_snow_letter_again) · b10_rain_gauge(장마 → 둑) · b10_dyke_held(둑 → 이듬해 여름 뗏목)
//   b10_apples(큰바람 전 수확 → 사과잼) · b10_jam_jars(사과잼 → 이월 장날 좌판)
// 반복 일상(낮은 weight): b10_snow_letter_again · b10_door_marks · b10_market_day
// 코어 플래그 콜백: has_cat · met_elda · knows_origin · magic_awake · allowance · seen.lost_kitten
// 동네 사람들(b01과 공유): 한스 아저씨(밭·과수원) · 오토 할아버지(풍차 방앗간) · 마르타 할머니(빵집)
//   b02와 공유: 브람(오토 할아버지 손자) · 토비(대장간 집 막내, 네리의 동생). b10 고유: 페터 아저씨(물레방앗간) · 브루노(양치기) · 마그다 할머니 · 베티

const KNUM = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟'];
const ORD = ['', '첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟'];
const MARKET_GOODS = {
  spring: '봄나물 바구니와 꽃 모종',
  summer: '참외 더미와 대나무 부채',
  autumn: '햇사과 바구니와 색색의 털실',
  winter: '군밤 화로와 장작 수레',
};

export default [
  // ── 첫눈 · 가족의 의식 ─────────────────────────────────────────────
  { id: 'b10_snow_letter', title: '첫눈 편지', age: [11, 15], month: 11, weight: 2, image: 'bg/snow_village',
    text: '첫눈이 내린 저녁, {name이} 종이 두 장과 촛불을 들고 왔다. "우리 이거 하자. 첫눈 오는 날 편지를 써서 봉해 두고, 내년 첫눈에 같이 뜯어보는 거야. {call}도 써." 창밖에서 눈송이가 처마 등불 빛을 받으며 천천히 내려앉았다.',
    choices: [
      { label: '함께 편지를 쓴다', effects: { 'flag.b10_snow_letter': true, trust: +4, 'stat.sens': +3, 'pers.roman': +2, stress: -5 },
        result: '둘은 서로 훔쳐보지 못하게 등을 맞대고 앉아 썼다. {name이} 봉투를 접다 말고 물었다. "뭐라고 썼어?" "내년에 알려 줄게." 봉투 두 장이 찬장 맨 위 칸에 나란히 올라갔다.' },
      { label: '글씨부터 또박또박 쓰게 한다', effects: { 'flag.b10_snow_letter': true, 'stat.cult': +3, 'stat.int': +2, 'pers.agree': +1, trust: -1 },
        result: '"내용보다 글씨가 먼저야." 아이는 입을 삐죽이면서도 한 자 한 자 눌러썼다. 봉투에는 반듯한 글씨로 「내년의 나에게」. 당신 봉투 글씨가 더 삐뚤었다.' },
      { label: '편지 대신 눈싸움을 한다', effects: { stress: -10, 'stat.hp': +2, 'pers.extro': +2 },
        result: '"편지는 내일 써도 돼!" 둘은 마당으로 뛰어나갔다. 눈 뭉치가 오가는 사이 종이 두 장은 탁자 위에서 잊혔고, 끝내 쓰이지 않았다. 아이는 그날 밤 내내 웃었다.' },
      { label: '자물쇠 일기장에 쓰게 한다', conditions: ['item.diary >= 1'], effects: { 'flag.b10_snow_letter': true, trust: +5, 'stat.sens': +4, stress: -4 },
        result: '아이는 편지 두 통을 일기장 맨 뒷장에 끼우고 자물쇠를 채웠다. 일기장은 찬장 맨 위 칸에, 열쇠는 당신 손바닥에. "내년 첫눈까지 {call이} 맡아. 먼저 열면 안 돼." 열쇠가 따뜻했다.' },
    ] },
  { id: 'b10_snow_letter_open', title: '작년 첫눈의 편지', age: [12, 17], month: 11, weight: 2.5, conditions: ['flag.b10_snow_letter'], image: 'bg/room_winter',
    text: '올해도 첫눈이 왔다. {name이} 찬장 맨 위 칸에서 일 년 묵은 편지 두 통을 꺼내 왔다. 작년의 자기가 쓴 편지를 소리 내어 읽다가 중간에 멈췄다. "……이건 왜 썼지. 창피해." 그러고는 당신 봉투를 내밀었다. "{call} 차례."',
    choices: [
      { label: '당신 편지를 읽어 준다', effects: { trust: +5, stress: -6, 'pers.roman': +1 },
        result: '당신 편지에는 한 줄뿐이었다. "내년 이맘때도 같이 이걸 읽고 있기를." 아이는 봉투를 오래 만지작거렸다. "지켜졌네." 새 편지 두 장이 다시 찬장 위로 올라갔다.' },
      { label: '작년의 다짐을 지켰는지 묻는다', effects: { 'stat.moral': +3, 'pers.ambit': +2, stress: +2 },
        result: '"하루에 한 가지씩 새로 배우기." 아이는 손가락을 꼽아 보다가 고개를 저었다. "반쯤 지켰어." 올해 편지에는 다짐을 하나만 적었다. 대신 밑줄을 두 번 그었다.' },
      { label: '이제 그만할 때도 됐다고 한다', effects: { 'flag.b10_snow_letter': false, trust: -4, 'pers.roman': -2, stress: +3 },
        result: '"……그래, 애들 같긴 하지." 아이가 봉투를 서랍에 넣었다. 그날 밤 아이 방 불이 늦게까지 켜져 있었다. 혼자 무언가를 쓰는 소리가 났다.' },
      { label: '열여덟의 첫눈을 이야기한다', conditions: ['age >= 16'], effects: { trust: +4, 'stat.sens': +3, 'pers.ambit': +2 },
        result: '"열여덟 첫눈엔 내가 어디 있을지 모르잖아." "그럼 편지를 부쳐. 어디서든." 아이는 대답 대신 올해 봉투 겉면에 주소 칸을 그려 넣었다. 칸은 비워 두었다.' },
    ] },
  { id: 'b10_snow_letter_again', title: '해마다 첫눈', age: [13, 17], month: 11, repeatable: true, weight: 1.4, conditions: ['flag.b10_snow_letter', 'seen.b10_snow_letter_open >= 1'], image: 'bg/room_winter',
    text: (s) => {
      const n = (s.seen?.b10_snow_letter_open || 0) + (s.seen?.b10_snow_letter_again || 0) + 1;
      return `첫눈 오는 날 찬장 위 편지를 뜯는 건 이제 이 집의 풍습이다. 올해로 ${ORD[n] || n} 번째다. {name이} 봉투 두 장을 부채처럼 펼쳐 들었다. "작년의 나는 뭐라고 했을까. 이번엔 {call} 것부터 열자."`;
    },
    choices: [
      { label: '당신 편지부터 읽는다', effects: { trust: +4, stress: -6, 'stat.sens': +2 },
        result: '당신 편지는 해마다 조금씩 길어진다. 올해는 아이가 끝까지 듣더니 코를 훌쩍였다. "……감기 기운이야." 새 편지 두 장이 다시 찬장 위로 올라갔다.' },
      { label: '아이 편지를 같이 읽는다', effects: { 'stat.sens': +3, 'pers.extro': +1, stress: -5 },
        result: '작년의 아이는 친구와 다툰 일로 속상해했다. 올해의 아이는 그 이름을 보고 웃었다. "이거 화해했어. 까먹고 있었네." 편지는 어느새, 지나간 걱정을 세어 보는 일이 되었다.' },
      { label: '올해만 건너뛰자고 한다', effects: { trust: -3, stress: +2, 'pers.roman': -1 },
        result: '"올해는 바빠서……" 아이는 봉투를 도로 찬장에 올렸다. 한 해 묵은 편지는 한 해를 더 묵었다. 아이가 혼잣말을 했다. "내년엔 두 장씩 읽어야겠네."' },
      { label: '어디서든 부쳐 달라고 한다', conditions: ['age >= 16'], effects: { trust: +5, 'stat.sens': +2, 'pers.ambit': +2 },
        result: '"내년 첫눈에 네가 어디 있든, 이 집 주소로 한 통 부쳐 줘." 아이가 웃었다. "{call}도. 내 주소 생기면 제일 먼저 알려 줄게." 둘은 새끼손가락을 걸었다.' },
    ] },
  { id: 'b10_door_marks', title: '새해의 키 재기', age: [11, 17], month: 1, repeatable: true, weight: 0.6, image: 'bg/room_winter',
    text: (s) => {
      const n = s.seen?.b10_door_marks || 0;
      return n === 0
        ? '새해 첫날 아침, {name이} 부엌 문설주에 등을 딱 붙이고 섰다. "{call}, 여기 금 그어 줘. 내년에 얼마나 컸는지 보게." 발뒤꿈치가 슬쩍 들려 있었다.'
        : `새해 아침이면 부엌 문설주에 키를 잰다. ${n === 1 ? '작년에 그은 금 하나가 아직 선명하다.' : `칼로 그은 금이 어느새 ${KNUM[n] || n} 줄이다.`} {name이} 등을 붙이고 서서 눈만 굴려 지난 금을 올려다봤다. 발뒤꿈치가 슬쩍 들려 있었다. "올해는 많이 컸지?"`;
    },
    choices: [
      { label: '정직하게 금을 긋는다', effects: { trust: +3, 'stat.moral': +2, 'pers.agree': +1 },
        result: (s) => (s.seen?.b10_door_marks || 0) <= 1
          ? '"발뒤꿈치." 아이가 머쓱하게 발을 내렸다. 당신은 정수리 높이에 금을 긋고 옆에 날짜를 새겼다. 아이가 금을 손끝으로 쓸어 보았다. "내년엔 이거보다 위야. 두고 봐."'
          : s.age >= 15
            ? '금과 금 사이가 해마다 좁아진다. "이제 거의 다 컸나 봐." 아이가 조금 서운한 얼굴로 말했다. 당신은 대답 대신 금 옆에 날짜를 또박또박 새겼다.'
            : '"발뒤꿈치." 아이가 머쓱하게 발을 내렸다. 그래도 지난 금보다 손가락 두 마디가 높았다. 아이가 펄쩍 뛰었다. "봐! 컸지! 내년엔 {call} 어깨까지 갈 거야."' },
      { label: '발뒤꿈치를 못 본 척한다', effects: { stress: -5, 'pers.roman': +2, trust: +2 },
        result: '금은 실제보다 손톱만큼 높게 그어졌다. 아이는 만족스럽게 고개를 끄덕였다. 내년엔 그 금을 넘어야 한다는 걸 아직 모른다. 당신은 안다.' },
      { label: '당신 키도 재 달라고 한다', effects: { trust: +4, 'stat.sens': +3, 'pers.extro': +1 },
        result: (s) => s.age >= 15
          ? '"이번엔 {call} 차례." 아이가 발끝을 세우고 당신 정수리에 금을 그었다. 당신의 굵은 금과 아이의 가는 금 사이가 손가락 두 마디뿐이었다. "봐. 거의 다 따라잡았어."'
          : '"이번엔 {call} 차례." 아이가 의자를 밟고 올라가 당신 머리 위에 금을 그었다. 맨 위에 당신의 굵은 금, 그 아래 아이의 가는 금. 아이가 두 금 사이를 뼘으로 재 보았다. "아직 한 뼘 반. 금방이야."' },
      { label: '이제 직접 긋게 한다', conditions: ['age >= 15'], effects: { 'pers.ambit': +2, 'pers.agree': -1, trust: +3, 'stat.sens': +2 },
        result: '아이는 칼을 받아 들고 제 정수리에 손바닥을 얹은 채 금을 그었다. 조금 비뚤었다. "이건 내가 그은 첫 번째 금이야." 아이가 그 옆에 제 이름을 새겼다.' },
    ] },

  // ── 겨울 추위 ───────────────────────────────────────────────────────
  { id: 'b10_thin_ice', title: '살얼음', age: [12, 16], month: 1, weight: 1.8, image: 'bg/snow_village',
    text: '마을 연못이 얼자 아이들이 몰려나가 얼음을 지쳤다. 그런데 한가운데서 쩍, 소리가 났다. 대장간 집 막내 토비가 깨진 얼음 가장자리에 매달려 있다. {name이} 당신보다 먼저 뛰어나가려다 멈칫, 당신을 돌아봤다. 아이 몸이 당신보다 훨씬 가볍다.',
    choices: [
      { label: '엎드려 기어가게 한다', check: { stat: 'agi', dc: 100 }, minigame: 'adventure',
        success: { effects: { 'stat.agi': +6, 'stat.moral': +3, reputation: +5, trust: +3 },
          result: '아이는 얼음 위에 납작 엎드려 목도리를 던졌다. 토비가 목도리를 붙잡았다. 둘이 기어 나오자 연못가에서 함성이 터졌다. 당신 손은 그제야 떨리기 시작했다.' },
        fail: { effects: { 'stat.agi': +2, 'stat.hp': -4, 'pers.good': +1, stress: +10, reputation: +2 },
          result: '목도리가 한 뼘 모자랐다. 아이가 더 다가가자 얼음이 갈라졌다. 어른들이 사다리를 걸쳐 둘 다 끌어냈다. 토비는 무사했고, 아이는 사흘을 앓았다.' } },
      { label: '아이를 붙잡고 당신이 간다', effects: { gHealth: -8, trust: +5, reputation: +4, 'stat.moral': +2 },
        result: '당신이 사다리를 끌고 얼음 위로 나섰다. 토비를 건져 올리는 순간 발밑이 꺼져 허리까지 젖었다. 아이는 당신 젖은 외투를 꼭 쥐고 집에 올 때까지 놓지 않았다.' },
      { label: '어른들을 부르러 보낸다', effects: { 'stat.hp': +3, 'stat.elo': +3, 'pers.agree': +1, reputation: +2 },
        result: '"뛰면서 크게 소리쳐!" 아이가 마을로 내달리며 고함을 질렀다. 금세 어른들이 밧줄을 들고 몰려왔다. 토비는 무사했다. 아이는 숨이 턱까지 차서 눈밭에 주저앉았다.' },
      { label: '얼음 구조법을 외쳐 준다', conditions: ["guardian == 'knight'"], effects: { 'stat.agi': +4, 'stat.int': +3, trust: +4, reputation: +3 },
        result: '"서지 마! 엎드려서 무게를 넓게!" 기사단 겨울 훈련에서 배운 그대로였다. 아이는 당신 목소리에 맞춰 한 뼘씩 나아가 토비를 끌어냈다. "{call} 목소리, 얼음 위에서도 다 들렸어."' },
    ] },
  { id: 'b10_cold_snap', title: '한파의 손님들', age: [11, 16], month: 1, weight: 1.5, image: 'bg/room_winter',
    text: '사흘째 한파가 이어지던 밤, 누가 문을 두드렸다. 양치기 브루노가 아이 넷을 데리고 서 있었다. 굴뚝이 무너져 집이 얼음장이라고 했다. 막내는 울다 지쳐 잠들어 있다. {name이} 당신 얼굴과 장작더미를 번갈아 봤다. 장작은 이번 겨울을 겨우 날 만큼이다.',
    choices: [
      { label: '모두 들여 함께 지낸다', effects: { gold: -40, 'stat.moral': +5, 'pers.good': +3, stress: +6, reputation: +4 },
        result: '열흘 동안 작은 집에 일곱이 북적였다. {name은} 제 침대를 막내에게 내주고 난로 앞에서 잤다. 브루노네가 떠나던 날, 막내가 아이 손을 놓지 않았다.' },
      { label: '장작을 나눠 보낸다', effects: { 'stat.moral': +3, 'stat.hp': -3, trust: +3, reputation: +2 },
        result: '장작 반 짐을 수레에 실어 보냈다. 그 겨울 끝 무렵 당신 집 장작이 먼저 떨어졌다. 아이와 둘이 담요를 둘둘 말고 난로 앞에 붙어 앉아 버텼다. 아이는 그게 재미있다고 했다.' },
      { label: '굴뚝을 같이 고치러 간다', check: { stat: 'str', dc: 90 },
        success: { effects: { 'stat.str': +5, reputation: +5, trust: +3, gHealth: -4 },
          result: '눈보라 속에서 돌을 쌓았다. {name이} 진흙을 이겨 올려 보냈다. 밤이 깊어서야 브루노네 굴뚝에서 연기가 올랐다. 둘은 손이 꽁꽁 언 채 마주 보고 웃었다.' },
        fail: { effects: { 'stat.str': +2, 'stat.hp': -4, 'pers.good': +1, gHealth: -6, stress: +6 },
          result: '쌓은 돌이 얼어 자꾸 미끄러졌다. 결국 브루노네는 그 밤을 당신 집에서 보냈다. 이튿날 아이는 콧물을 훌쩍이며 무너진 굴뚝 그림을 그렸다. 다음엔 안 무너지게.' } },
      { label: '형편이 안 된다고 한다', effects: { trust: -4, 'pers.good': -2, 'stat.moral': -2, 'stat.hp': +3, stress: +3 },
        result: '브루노는 고개를 끄덕이고 성당 쪽으로 걸어갔다. {name은} 멀어지는 등불을 끝까지 지켜봤다. 장작은 겨울 끝까지 넉넉했고, 집은 내내 따뜻했다. 아이는 그 온기가 편하지 않은 얼굴이었다.' },
    ] },

  // ── 감기 ───────────────────────────────────────────────────────────
  { id: 'b10_guardian_cold', title: '죽 한 그릇', age: [12, 17], season: 'winter', conditions: ['month != 12'], weight: 1, image: 'bg/room_winter',
    text: '이번엔 당신이 감기에 걸렸다. 오한에 이불을 끌어올리는데 부엌에서 냄비 부딪치는 소리가 났다. {name이} 앞치마를 두르고 문틈으로 얼굴을 내밀었다. "귀리죽 끓일 거야. 누워 있어. 일어나면 화낼 거야."',
    choices: [
      { label: '아이에게 맡긴다', check: { stat: 'sens', dc: 95 }, minigame: 'cooking',
        success: { effects: { gHealth: +8, trust: +5, 'stat.sens': +4, 'pers.agree': +1 },
          result: '알맞게 퍼진 죽에 다진 파가 동동 떠 있었다. 간이 조금 셌지만 당신은 한 그릇을 다 비웠다. 아이는 빈 그릇을 들고 의기양양하게 나갔다.' },
        fail: { effects: { gHealth: +4, trust: +3, 'stat.sens': +2, stress: +3 },
          result: '죽 밑바닥이 눌어 탄내가 났다. 아이가 울상이 되자 당신은 일부러 크게 떠먹었다. "구수하네." 아이는 거짓말인 걸 알면서 웃었다.' } },
      { label: '누운 채로 훈수를 둔다', effects: { gHealth: +4, 'stat.sens': +2, 'pers.agree': -1, trust: -1 },
        result: '"소금은 반 숟갈만! 불은 약하게!" 당신 목소리가 문틈을 넘을 때마다 부엌에서 "알아!"가 돌아왔다. 죽은 무난했다. 아이가 그릇을 내려놓으며 말했다. "다음엔 목소리 안 나오는 감기로 걸려."' },
      { label: '큐브에게 도와 달라고 한다', effects: { 'rel.cube': +5, gHealth: +6, 'stat.eti': +2, stress: -4 },
        result: '"주인님! 큐브 요리 교실 2교시입니다!" 큐브가 소금 그릇을 껴안고 날아갔다. 부엌이 한참 소란하더니 먹을 만한 죽이 나왔다. 둘이 서로 자기가 끓였다고 우겼다.' },
      { label: '엘다의 약초를 구해 오게 한다', conditions: ['flag.met_elda'], effects: { 'rel.elda': +5, gHealth: +10, 'stat.int': +2, stress: +3 },
        result: '아이는 눈길을 걸어 엘다의 오두막에 다녀왔다. 엘다가 싸 준 약초를 달여 마시자 열이 내렸다. "엘다가 {call}한테 무리하지 말래." 아이가 엄하게 전했다.' },
    ] },

  // ── 이웃의 경조사 ───────────────────────────────────────────────────
  { id: 'b10_new_baby', title: '이웃집 아기', age: [13, 16], month: 2, weight: 2, image: 'bg/room_spring',
    text: '눈이 녹기 시작한 이월, 한스 아저씨네 며느리가 아기를 낳았다. 대문에 흰 리본과 말린 꽃다발이 걸렸다. 아기를 보고 온 {name이} 밤늦게 당신 방문을 두드렸다. "나도… 저렇게 작았을까? 나 처음 봤을 때, 어땠어?"',
    choices: [
      { label: '그날 밤을 그대로 말해 준다', effects: { trust: +6, 'stat.sens': +4, 'pers.roman': +2 },
        result: '들판의 빛, 품 안의 무게, 처음 잡았던 작은 손. 아이는 끝까지 듣고 물었다. "우리 집 문에도 리본 걸었어?" "그럴 정신이 없었지." "……늦었지만 걸어 줘."' },
      { label: '아기 선물을 만들자고 한다', check: { stat: 'sens', dc: 110, bonus: (s) => (s.items?.sewing_kit ? 30 : 0) },
        success: { effects: { 'stat.sens': +5, 'stat.cult': +2, reputation: +3, 'pers.good': +1 },
          result: '아이는 사흘 밤을 들여 작은 모자를 지었다. 귀 덮개에 별을 하나 수놓았다. 아기 엄마가 웃었다. "이 별, 아기가 자꾸 손으로 만져요."' },
        fail: { effects: { 'stat.sens': +2, 'pers.extro': -1, stress: +4, reputation: +1 },
          result: '모자는 아기 머리에 비해 두 배는 컸다. 아기 엄마는 웃으며 받았다. "돌 지나면 딱 맞겠네요." 아이는 귀까지 빨개졌다.' } },
      { label: '늦었으니 그만 자라고 한다', effects: { trust: -4, stress: +4, 'pers.extro': -2 },
        result: '"내일 일찍 일어나야지." 아이는 순순히 방으로 돌아갔다. 문이 닫히기 전 작은 목소리가 들렸다. "……아무도 모르는구나." 다음 날 아침 아이 눈이 조금 부어 있었다.' },
      { label: '어머니 이야기를 꺼낸다', conditions: ['flag.knows_origin'], effects: { trust: +5, 'stat.sens': +5, 'pers.roman': +2, stress: -5 },
        result: '"너를 하늘에 숨긴 사람은, 그만큼 너를 살리고 싶었던 거야." 아이는 대답 없이 당신 손을 잡았다. 다음 날 아기 집 문에 꽃 한 송이가 몰래 꽂혀 있었다.' },
    ] },
  { id: 'b10_neighbor_wedding', title: '오월의 혼례', age: [12, 17], month: 5, weight: 1.5, image: 'bg/festival_spring',
    text: '풍차 방앗간 오토 할아버지의 손녀 베티가 읍내 통장이네 맏아들과 혼례를 올린다. 공터에 긴 식탁이 놓이고, 해 질 녘엔 둥글게 손을 잡고 추는 원무가 열린다. 베티가 {name을} 찾아와 꽃바구니를 내밀었다. "신부 앞에서 꽃잎 뿌려 줄 사람, 너밖에 없어."',
    choices: [
      { label: '꽃잎도 원무도 맡긴다', check: { stat: 'eti', dc: 100, bonus: (s) => s.stats.agi * 0.2 }, minigame: 'ball',
        success: { effects: { 'stat.eti': +5, 'stat.chm': +3, 'pers.extro': +1, reputation: +4, stress: -6 },
          result: '아이는 박자에 맞춰 꽃잎을 뿌렸고, 원무에서는 한 번도 발을 틀리지 않았다. 베티가 화관에서 꽃 한 송이를 뽑아 아이 머리에 꽂아 주었다.' },
        fail: { effects: { 'stat.eti': +2, 'pers.extro': -1, stress: +4, reputation: +1 },
          result: '원무 세 바퀴째에 옆 사람 발을 밟았다. 아이는 식탁 밑으로 숨을 뻔했다. 오토 할아버지가 껄껄 웃으며 손을 잡아 다시 원 안으로 끌어들였다.' } },
      { label: '잔치 부엌을 거들게 한다', effects: { 'stat.hp': +3, 'stat.sens': +2, gold: +20, stress: +4 },
        result: '아이는 하루 종일 부엌에서 감자를 깎고 접시를 날랐다. 잔치가 끝나자 오토 할아버지가 은화 두 닢과 꿀과자를 싸 주었다. 아이는 꿀과자를 당신 몫까지 챙겼다.' },
      { label: '함께 선물을 고른다 (-50G)', conditions: ['gold >= 50'], effects: { gold: -50, reputation: +3, 'stat.cult': +3, 'pers.roman': +2 },
        result: '아이는 장터를 두 바퀴 돈 끝에 놋쇠 촛대 한 쌍을 골랐다. "둘이 하나씩. 그래야 안 싸우지." 베티가 촛대를 받아 들고 아이를 꼭 안았다.' },
      { label: '혼례 축가를 부르게 한다', conditions: ['stat.sens >= 150'], effects: { 'stat.sens': +5, 'stat.chm': +3, reputation: +5, 'pers.extro': +2 },
        result: '아이가 식탁 끝에 서서 첫 소절을 불렀다. 떠들썩하던 공터가 조용해졌다. 노래가 끝나자 신랑이 먼저 울었다. 베티는 그걸 평생 놀려 먹겠다고 했다.' },
    ] },

  // ── 봄 ─────────────────────────────────────────────────────────────
  { id: 'b10_swallow_nest', title: '처마 밑 제비', age: [10, 14], month: 4, weight: 1.5, image: 'bg/room_spring',
    text: '제비 한 쌍이 현관 처마 밑에 진흙 둥지를 지었다. 문간은 매일 아침 지저분해졌지만, 새끼 울음이 들린 날부터 {name은} 집을 나설 때마다 세 번씩 처마를 올려다본다. 그런데 이웃들 말이, 둥지를 노리는 들고양이가 근처를 돈다고 한다.',
    choices: [
      { label: '둥지 밑에 받침대를 단다', check: { stat: 'int', dc: 75 },
        success: { effects: { 'stat.int': +4, 'stat.sens': +2, 'pers.good': +2, trust: +2 },
          result: '아이가 받침대 모양을 그리고 당신이 못을 박았다. 새끼 제비 다섯이 여름 내내 그 위로 고개를 내밀었다. 떠나던 날, 아이는 처마 밑에서 오래 손을 흔들었다.' },
        fail: { effects: { 'stat.int': +2, 'pers.good': +1, stress: +3 },
          result: '받침대가 비뚤게 달려 둥지가 한쪽으로 기울었다. 다시 다는 데 사흘이 걸렸다. 제비 부부는 그동안 내내 시끄럽게 따졌다.' } },
      { label: '밤마다 둥지를 지키게 한다', effects: { 'stat.moral': +3, 'pers.good': +2, 'stat.hp': -2, stress: +4 },
        result: '아이는 이불을 뒤집어쓰고 현관에 앉아 밤을 새웠다. 사흘째 밤 들고양이가 담 위에 나타났다가 아이와 눈이 마주치자 달아났다. 대신 아이는 낮 내내 꾸벅꾸벅 졸았다.' },
      { label: '자연에 맡기자고 한다', effects: { 'pers.roman': -2, 'stat.int': +2, 'pers.agree': +1 },
        result: '"제비도 고양이도 제 할 일을 하는 거야." 아이는 고개를 끄덕였지만 아침마다 새끼 수를 셌다. 다행히 다섯 마리 모두 무사히 날아갔다.' },
      { label: '달무리를 집 안에 들인다', conditions: ['flag.has_cat'], effects: { 'stat.sens': +3, trust: +2, stress: +3 },
        result: '"미안, 달무리. 새끼들 날 때까지만." 달무리는 창가에 앉아 처마를 노려보며 한 달 내내 투덜거렸다. 아이는 그 옆에 턱을 괴고 같이 처마를 올려다봤다.' },
    ] },

  // ── 달무리: 고양이를 들이는 두 번째 계기 ────────────────────────────
  // lost_kitten을 이미 지나쳤고(키우지 않았고) 아직 고양이가 없는 판에서만 — 고양이가 두 마리 생기는 일을 막는다.
  { id: 'b10_halo_cat', title: '달무리 뜬 밤', age: [11, 15], season: 'winter', conditions: ['!flag.has_cat', 'seen.lost_kitten >= 1', 'month != 12'], weight: 2, image: 'bg/room_winter',
    text: '세 달 중 막내 달에 희뿌연 달무리가 진 밤이었다. 창틀에 잿빛 고양이 한 마리가 웅크린 채 김 서린 유리 너머 난롯불을 보고 있었다. 목에 끈도 방울도 없다. {name이} 숨을 죽였다. "{call}, 봐. 쟤 눈에도 달무리가 있어." 빗속의 고양이를 보내던 날처럼, 아이 손이 창틀을 꼭 쥐었다.',
    choices: [
      { label: '창문을 열어 들인다', effects: { 'flag.has_cat': true, trust: +4, 'stat.sens': +4, gold: -20 },
        result: '고양이는 한참 망설이다 난로 앞까지 걸어 들어왔다. 아이 무릎에 올라 몸을 마는 순간, 은빛 머리칼 끝에서 금빛 별이 반짝였다. "이름은 달무리야. 오늘 밤 달이 데려왔으니까."' },
      { label: '먹이만 창틀에 놓아 준다', effects: { 'stat.sens': +2, 'pers.roman': +1, 'stat.moral': +1 }, next: 'b10_halo_cat_stay',
        result: '아이가 작은 접시에 우유와 생선 부스러기를 담아 창틀에 올렸다. 고양이는 다 먹고도 한참 앉아 있다가 눈 속으로 사라졌다. 이튿날 밤에도, 그다음 밤에도 왔다.' },
      { label: '들고양이는 안 된다고 한다', effects: { trust: -3, 'pers.agree': +1, stress: +3 },
        result: '아이는 유리에 손바닥을 댔다가 거두었다. 고양이는 아이를 한 번 보더니 지붕으로 뛰어올랐다. 그 밤 아이는 창 쪽으로 돌아누워 잤다.' },
      { label: '고양이와 눈인사를 가르친다', conditions: ["guardian == 'adventurer'"], effects: { 'flag.has_cat': true, 'stat.sens': +3, trust: +4, 'pers.extro': +1 },
        result: '"눈을 천천히 감았다 떠. 고양이한텐 그게 \'안녕\'이야." 아이가 따라 하자 고양이도 느리게 눈을 깜박였다. 창문을 열자 제 발로 들어왔다. 이름은 그 밤의 달을 따서, 달무리.' },
    ] },
  { id: 'b10_halo_cat_stay', title: '창틀의 손님', chainOnly: true, age: [11, 15], image: 'bg/snow_village',
    text: '고양이는 이레 밤을 내리 찾아왔다. 여드레째 밤, 눈보라가 몰아쳤는데 창틀이 비어 있었다. {name이} 외투를 걸치다 말고 당신을 돌아봤다. "찾으러 가도 돼? 장작 창고 쪽에서 우는 소리 났어."',
    choices: [
      { label: '등불을 들고 같이 나간다', effects: { 'flag.has_cat': true, trust: +5, stress: -4, 'stat.moral': +2 },
        result: '장작 창고 틈에 고양이가 눈을 뒤집어쓰고 떨고 있었다. 아이가 외투 속에 품어 들어왔다. 그 밤부터 난로 앞은 녀석 자리가 되었다. 이름은 달무리. 처음 온 밤의 달 이름이다.' },
      { label: '혼자 찾아오게 해 본다', check: { stat: 'hp', dc: 85 },
        success: { effects: { 'flag.has_cat': true, 'stat.hp': +4, 'pers.ambit': +1, trust: +3 },
          result: '아이는 무릎까지 빠지는 눈을 헤치고 장작 창고에 닿았다. 돌아왔을 때 외투 앞섶이 불룩했다. "내가 찾았으니까 이름도 내가 지을래. 달무리."' },
        fail: { effects: { 'flag.has_cat': true, 'stat.hp': -3, stress: +6, trust: -1 },
          result: '아이는 눈 속에서 한참 헤맸다. 결국 당신이 나가 둘을 함께 데려왔다. 고양이도 아이도 밤새 콧물을 훌쩍였다. 이름은 그날 밤 정해졌다. 달무리.' } },
      { label: '고양이도 제 길이 있다고 한다', effects: { trust: -5, 'pers.roman': -2, stress: +5 },
        result: '"원래 떠돌던 애야. 걱정 마." 아이는 외투를 도로 걸었다. 다음 날 아침, 장작 창고 앞 눈 위에 작은 발자국이 동그랗게 맴돌다 사라져 있었다.' },
    ] },
  // 13세부터: lost_kitten(10~12세) 창이 닫힌 뒤라 그 이벤트를 아예 못 본 판도 여기서 고양이를 만날 수 있다.
  { id: 'b10_widow_cat', title: '마그다 할머니의 고양이', age: [13, 16], season: 'spring', conditions: ['!flag.has_cat', 'month != 3'], weight: 1.6, image: 'bg/church',
    text: '혼자 살던 마그다 할머니가 봄비 오는 밤에 조용히 세상을 떠났다. 장례가 끝난 뒤에도 할머니 집 문간에는 잿빛 고양이 한 마리가 비를 맞으며 앉아 있었다. "할머니는 쟤를 달무리라고 불렀대." {name이} 우산을 받쳐 든 채 움직이지 않았다.',
    choices: [
      { label: '집으로 데려온다', effects: { 'flag.has_cat': true, trust: +4, 'stat.moral': +3, gold: -20 },
        result: '달무리는 사흘 동안 침대 밑에서 나오지 않았다. 나흘째 아침, 아이 베개 옆에서 자고 있었다. 아이는 숨도 크게 쉬지 못하고 그대로 누워 있었다.' },
      { label: '할머니 집 정리를 돕는다', effects: { 'flag.has_cat': true, 'stat.moral': +4, reputation: +3, stress: +4 },
        result: '찬장에서 쪽지 한 장이 나왔다. "달무리 밥은 하루 두 번. 은발 아가씨가 잘 놀아 줍디다." 아이는 쪽지를 주머니에 넣고 고양이를 안아 들었다.' },
      { label: '친척에게 보내자고 한다', effects: { 'stat.elo': +3, 'stat.moral': +2, 'pers.roman': -1, trust: -1 },
        result: '항구에 사는 할머니의 조카에게 편지를 썼다. 보름 뒤 조카가 와서 고양이를 바구니에 담아 갔다. {name은} 바구니가 모퉁이를 돌 때까지 손을 흔들었다.' },
      { label: '엘다에게 맡기자고 한다', conditions: ['flag.met_elda'], effects: { 'rel.elda': +6, 'stat.mag': +2, 'pers.extro': -1 },
        result: '엘다의 오두막에는 고양이 자리가 늘 하나 비어 있었다. "놀러 오면 언제든 볼 수 있어요." 그 뒤로 아이가 오두막에 가는 날이 부쩍 늘었다.' },
    ] },

  // ── 달무리와 사는 일 (has_cat) ──────────────────────────────────────
  { id: 'b10_cat_gift', title: '달무리의 선물', age: [11, 16], season: 'summer', conditions: ['flag.has_cat', 'month != 6'], weight: 1.8, image: 'bg/room_summer',
    text: '여름 들어 아침마다 현관 앞에 "선물"이 놓인다. 첫날은 솔방울, 둘째 날은 깃털, 오늘은 빨간 리본이 달린 아기 양말 한 짝. 달무리가 꼬리를 꼿꼿이 세우고 있다. {name이} 양말을 집어 들었다. "이거… 이웃집 빨랫줄에서 가져온 거지?"',
    choices: [
      { label: '직접 돌려주고 사과하게 한다', effects: { 'stat.moral': +4, 'stat.eti': +2, 'pers.good': +1, stress: +3, reputation: +1 },
        result: '아이는 양말을 들고 집집마다 문을 두드렸다. 세 번째 집 아주머니가 웃음을 터뜨렸다. "그 고양이가 범인이었구나!" 그날 오후, 아이는 헛간 구석에서 달무리가 모아 둔 양말 다섯 짝을 더 찾아냈다.' },
      { label: '깃털 장난감을 사 준다 (-20G)', conditions: ['gold >= 20'], effects: { gold: -20, 'item.cat_toy': +1, stress: -5, 'stat.sens': +2 },
        result: '깃털 장난감이 생기자 달무리의 사냥감은 그것 하나로 줄었다. 대신 매일 아침 아이 머리맡에 깃털 장난감이 "선물"로 놓였다. 아이는 매번 고맙다고 인사했다.' },
      { label: '몰래 빨랫줄에 도로 건다', effects: { 'stat.agi': +3, 'pers.good': -2, 'stat.moral': -2, stress: -3 },
        result: '해 질 녘, 아이가 담을 넘어 양말을 빨랫줄에 도로 걸었다. 아무도 몰랐다. 달무리만 담장 위에서 지켜봤다. 다음 날 아침, 현관 앞에 그 양말이 다시 놓여 있었다.' },
      { label: '고양이가 왜 그러는지 알려 준다', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +4, 'stat.sens': +2, trust: +2 },
        result: '"고양이는 식구라고 여기는 이한테만 사냥감을 가져온대. 사냥 서툰 식구 굶을까 봐." 아이가 양말을 내려다보다 웃음을 터뜨렸다. "나 지금 고양이한테 걱정받는 거야?"' },
    ] },
  { id: 'b10_cat_sick', title: '밥그릇이 그대로', age: [12, 17], season: 'winter', conditions: ['flag.has_cat', 'month != 12'], weight: 2, image: 'bg/room_winter',
    text: '사흘째 달무리의 밥그릇이 그대로다. 늘 난로 앞을 차지하던 녀석이 침대 밑 구석에 몸을 말고 나오지 않는다. {name이} 바닥에 엎드려 그 구석만 들여다보고 있다. "숨소리가 이상해. {call}, 어떡해?" 읍내 짐승 의원은 비싸기로 유명하다.',
    choices: [
      { label: '짐승 의원을 부른다 (-120G)', conditions: ['gold >= 120'], effects: { gold: -120, trust: +5, stress: -8 },
        result: '의원은 달무리 목에서 생선 가시를 빼냈다. 그날 저녁 달무리는 밥그릇을 싹 비우고 아이 무릎에서 그르렁거렸다. 아이는 의원에게 몇 번이고 고개를 숙였다.' },
      { label: '엘다를 찾아간다', conditions: ['flag.met_elda'], effects: { 'rel.elda': +5, 'stat.int': +3, stress: -5, trust: +2 },
        result: '엘다는 달무리 배를 가만히 쓸어 보더니 쓴 풀 한 줌을 달여 줬다. "털을 너무 많이 삼켰네요. 겨울엔 자주 빗겨 주세요." 이튿날 아침, 달무리가 아이 이마를 앞발로 꾹꾹 눌러 깨웠다.' },
      { label: '약초 상자로 직접 달인다', conditions: ['item.herb_kit >= 1'], check: { stat: 'int', dc: 100 },
        success: { effects: { 'stat.int': +5, 'stat.mag': +2, trust: +3, stress: -6 },
          result: '아이는 약초 상자를 뒤져 속을 달래는 풀을 골랐다. 손이 떨려 두 번 쏟았다. 세 번째로 달인 물을 달무리가 핥았고, 밤이 되자 침대 밑에서 걸어 나왔다.' },
        fail: { effects: { 'stat.int': +2, stress: +8, trust: -2 },
          result: '달인 물에 달무리는 입도 대지 않았다. 다행히 사흘 뒤 녀석은 털 뭉치를 토해 내고 스스로 일어났다. 아이는 그동안 한숨도 못 잤다. 약초 상자를 오래 노려봤다.' } },
      { label: '밤새 곁을 지키게 한다', effects: { 'stat.sens': +4, 'stat.hp': -3, stress: +6, trust: +3 },
        result: '아이는 침대 밑에 담요를 깔고 사흘 밤을 달무리 곁에서 잤다. 나흘째 새벽, 달무리가 털 뭉치를 토해 내고 아이 품으로 기어들었다. 둘은 해가 뜰 때까지 그대로 잤다.' },
    ] },
  { id: 'b10_cat_farewell', title: '누가 달무리 밥을 줘', age: [16, 17], season: 'autumn', conditions: ['flag.has_cat', 'month != 9'], weight: 3, image: 'bg/room_autumn',
    text: '달무리가 난로 앞 제 자리에서 배를 드러내고 잔다. 처음 이 집에 온 날보다 두 배는 둥글어졌다. 가을 저녁 내내 그 배를 쓰다듬던 {name이} 불쑥 물었다. "{call}, 내가 열여덟이 돼서 멀리 가게 되면… 달무리는 누가 밥 줘? 데려가고 싶은데, 얘는 이 집 난로를 제일 좋아하잖아."',
    choices: [
      { label: '"여기서 널 기다릴 거야"', effects: { trust: +6, 'stat.sens': +3, 'pers.ambit': +2 },
        result: '"그럼 나 올 때마다 살쪄 있으면 {call} 탓이다." 아이가 웃었다. 달무리가 둘 사이에서 하품을 했다. 그 밤, 셋은 난로 앞에서 오래 앉아 있었다.' },
      { label: '"데려가. 네 식구잖아"', effects: { trust: +3, 'stat.moral': +2, 'pers.ambit': +3, stress: -3 },
        result: '"새 집에도 난로가 있어야겠네." 아이는 달무리 앞발을 쥐고 흔들었다. 달무리는 귀찮다는 듯 발을 빼고 아이 무릎에 다시 누웠다. 대답은 그거면 충분했다.' },
      { label: '"그러니 멀리 가지 마"', effects: { trust: -4, 'pers.agree': +2, 'pers.ambit': -3, stress: +5 },
        result: '아이는 웃으려다 말았다. "……농담이지?" 당신은 대답하지 않았다. 아이는 달무리를 안고 방으로 들어갔다. 그날 밤 아이 방에서 고양이 그르렁 소리만 오래 났다.' },
      { label: '큐브에게 맡기자고 한다', conditions: ['rel.cube >= 50'], effects: { 'rel.cube': +6, trust: +3, 'pers.ambit': +2, stress: -6 },
        result: '"주인님, 아가씨! 달무리 담당은 이 큐브에게!" 큐브가 나비넥타이를 고쳐 맸다. 달무리가 큐브를 앞발로 툭 쳤다. 아이가 배를 잡았다. "봐, 서열은 처음부터 정해져 있었어."' },
    ] },

  // ── 장마 (연쇄 3단계) ───────────────────────────────────────────────
  { id: 'b10_monsoon_week', title: '장마 열흘째', age: [11, 16], month: 7, weight: 1.5,
    text: '장마가 열흘째 그치지 않았다. 빨래는 마르지 않고 벽에서는 곰팡이 냄새가 난다. 집 안에 갇힌 {name은} 창에 이마를 대고 한숨만 쉰다. "냇물 소리가 점점 커져. 둑 보러 가면 안 돼? 페터 아저씨네 물레방앗간이 냇가 바로 옆이잖아."',
    choices: [
      { label: '빗소리 놀이를 하자고 한다', effects: { stress: -10, trust: +3, 'stat.sens': +3 },
        result: '처마에서 떨어지는 소리마다 이름을 붙였다. 양동이는 북, 창틀은 방울, 홈통은 콧노래. 저녁 무렵 아이는 빗소리로 노래 한 곡을 지어 불렀다. 큐브가 박자를 맞췄다.' },
      { label: '함께 둑을 보러 간다', effects: { 'stat.hp': +2, 'pers.good': +1, stress: -2 }, next: 'b10_monsoon_dyke',
        result: '도롱이를 걸치고 냇가로 나갔다. 흙탕물이 둑 턱밑까지 차올라 있었고, 마을 어른들이 모래 자루를 나르며 서로 소리를 지르고 있었다.' },
      { label: '곰팡이 청소를 시킨다', effects: { 'stat.hp': +3, 'pers.agree': +1, stress: +4 },
        result: '"곰팡이랑 싸우는 거야." 아이는 투덜대며 식초 물로 벽을 닦았다. 사흘 뒤 집에서 곰팡이 냄새가 사라졌다. 아이 성질은 조금 남았다.' },
      { label: '빗물 양을 재 보자고 한다', conditions: ['stat.int >= 100'], effects: { 'stat.int': +4, 'pers.roman': -1, 'flag.b10_rain_gauge': true }, next: 'b10_monsoon_dyke',
        result: '양동이 안쪽에 눈금을 새겨 마당에 내놓았다. 반나절 만에 손가락 두 마디가 찼다. 아이 얼굴이 굳었다. "이 속도면 오늘 밤 둑 넘쳐. 가서 말해야 돼."' },
    ] },
  { id: 'b10_monsoon_dyke', title: '넘치는 둑', chainOnly: true, age: [11, 16], image: 'bg/river',
    text: '냇물이 둑을 핥고 있었다. 페터 아저씨는 물레방앗간 문을 막느라 진흙투성이였고, 어른들은 모래 자루가 모자란다고 외쳤다. 빗줄기 속에서 {name이} 당신 소매를 잡아당겼다. "나도 할 수 있어. 자루 나르는 거."',
    choices: [
      { label: '자루 나르기에 끼게 한다', check: { stat: 'str', dc: 90 },
        success: { effects: { 'stat.str': +5, 'stat.hp': +3, reputation: +5, 'flag.b10_dyke_held': true }, next: 'b10_monsoon_mill',
          result: '아이는 제 몸통만 한 자루를 끌어안고 둑을 오르내렸다. 새벽녘, 물은 둑 끝에서 멈췄다. 어른들이 진흙투성이 아이 머리를 번갈아 헝클었다.' },
        fail: { effects: { 'stat.str': +2, 'stat.hp': -3, 'pers.good': +1, stress: +6 }, next: 'b10_monsoon_mill',
          result: '세 번째 자루를 들다 미끄러져 흙탕물에 주저앉았다. 당신이 아이를 둑 아래로 데려왔다. 물은 끝내 물레방앗간 마당을 넘었다.' } },
      { label: '일꾼들 새참을 끓이게 한다', effects: { 'stat.sens': +3, 'stat.hp': +2, 'pers.good': +1, reputation: +3 }, next: 'b10_monsoon_mill',
        result: '아이는 페터 아저씨네 부엌에서 큰 솥에 보리죽을 끓였다. 밤새 일한 어른들이 김 나는 그릇을 받아 들고 고개를 끄덕였다. "이 집 꼬마가 끓였대."' },
      { label: '아이는 집으로 돌려보낸다', effects: { trust: -3, gHealth: -6, 'pers.agree': +1 },
        result: '"집에 가 있어." 아이는 입술을 깨물고 돌아섰다. 당신은 새벽까지 자루를 날랐다. 돌아오니 아이가 마른 수건과 더운물을 들고 현관에 앉아 졸고 있었다.' },
      { label: '넘칠 자리를 짚게 한다', conditions: ['flag.b10_rain_gauge'], effects: { 'stat.int': +5, reputation: +6, 'pers.ambit': +2, 'flag.b10_dyke_held': true }, next: 'b10_monsoon_mill',
        result: '"저기 버드나무 쪽이 제일 낮아. 거기로 먼저 넘어." 아이 말대로 자루를 버드나무 쪽에 몰아 쌓았다. 새벽녘, 물은 딱 그 앞에서 멈췄다. 페터 아저씨가 아이 손을 오래 흔들었다.' },
    ] },
  { id: 'b10_monsoon_mill', title: '물 빠진 물레방앗간', chainOnly: true, age: [11, 16], image: 'bg/river',
    text: (s) => (s.flags.b10_dyke_held
      ? '장마가 걷혔다. 둑은 버텼지만 물레방앗간 아래 창고로 물이 스며 밀가루 자루 절반이 젖었다.'
      : '장마가 걷히자 물레방앗간 마당에 진흙이 무릎까지 쌓여 있었다. 물레는 멈췄고, 창고의 밀가루 자루는 거의 다 젖었다.')
      + ' 페터 아저씨는 젖은 자루 앞에 쪼그려 앉아 말이 없다. {name이} 당신을 돌아봤다. "아저씨네, 가을까지 어떡해?"',
    choices: [
      { label: '아이 동전 단지를 보태게 한다', effects: { gold: -40, 'stat.moral': +5, 'pers.good': +3, reputation: +3 },
        result: '아이는 동전 단지를 통째로 들고 갔다. 페터 아저씨는 세 번 손을 저었고, 아이는 네 번 내밀었다. 가을에 물레가 다시 돌던 날, 첫 밀가루 한 자루가 집 앞에 놓여 있었다.' },
      { label: '진흙 치우기를 돕는다', effects: { 'stat.str': +4, 'stat.hp': +2, trust: +2, stress: +5, reputation: +3 },
        result: '사흘 동안 삽으로 진흙을 퍼냈다. 아이는 진흙 속에서 물레 굴대에 끼우는 놋쇠 고리를 찾아내 씻어 드렸다. 잃어버린 줄 알았던 거라며 아저씨가 처음으로 웃었다.' },
      { label: '젖은 밀가루를 살려 본다', check: { stat: 'int', dc: 100 },
        success: { effects: { 'stat.int': +5, reputation: +4, 'pers.ambit': +1 },
          result: '"겉에 엉긴 층만 걷어 내면 속은 살릴 수 있어. 볕에 얇게 펴 말리자." 아이 말대로 하자 자루 셋 중 하나가 살아났다. 그 밀가루로 구운 빵 한 바구니가 집으로 왔다.' },
        fail: { effects: { 'stat.int': +2, stress: +4, 'pers.roman': -1 },
          result: '밀가루를 볕에 펴 말리는데 비가 다시 쏟아졌다. 반죽처럼 엉긴 밀가루를 보며 아이는 한참 말이 없었다. 아저씨가 아이 어깨를 두드렸다. "그래도 해 본 게 어디냐."' } },
      { label: '가렛에게 일손을 청한다', conditions: ['rel.garrett >= 40'], effects: { 'rel.garrett': +4, reputation: +4, 'pers.extro': +1 },
        result: '가렛이 용병 다섯을 끌고 왔다. "꼬마가 부르면 와야지." 사흘 걸릴 진흙을 반나절에 치웠다. 아이는 용병들 틈에 끼어 삽질을 하며 내내 신이 나 있었다.' },
    ] },

  // ── 여름 ───────────────────────────────────────────────────────────
  { id: 'b10_raft_race', title: '뗏목 내리기', age: [12, 16], season: 'summer', conditions: ['month != 6'], weight: 1.3, image: 'bg/river',
    text: '여름이면 마을 아이들은 손수 엮은 뗏목을 타고 냇물을 따라 물레방아 다리까지 내려가는 시합을 한다. {name이} 헛간에서 통나무 넷과 밧줄을 끌어냈다. "올해는 나도 나갈래. 근데 방앗간 브람네 뗏목은 돛까지 달았대."',
    choices: [
      { label: '함께 튼튼하게 엮는다', check: { stat: 'agi', dc: 95 },
        success: { effects: { 'stat.agi': +5, reputation: +3, trust: +3, stress: -6 },
          result: '당신이 엮은 뗏목은 무거웠지만 뒤집히지 않았다. 아이는 장대로 바위를 밀어내며 물살을 타 세 번째로 다리 밑을 지났다. "꼴찌 아니면 됐지!" 아이 목소리가 물소리보다 컸다.' },
        fail: { effects: { 'stat.agi': +2, 'stat.hp': +2, trust: +2, stress: -2 },
          result: '첫 굽이에서 뗏목이 바위에 걸려 빙글 돌았다. 아이는 무릎까지 오는 물에 내려서 깔깔 웃으며 뗏목을 끌고 걸어 내려왔다. 꼴찌였다. 제일 즐거워 보이는 꼴찌였다.' } },
      { label: '혼자 만들게 둔다', check: { stat: 'int', dc: 95 },
        success: { effects: { 'stat.int': +4, 'pers.ambit': +2, 'pers.agree': -1, reputation: +3 },
          result: '아이는 사흘 동안 헛간에서 나오지 않았다. 뗏목은 삐뚤었지만 바닥에 빈 통을 묶어 잘 떴다. 아이가 결승선에서 외쳤다. "내가 만든 거야! 전부!"' },
        fail: { effects: { 'stat.int': +2, 'pers.ambit': +1, stress: +5 },
          result: '밧줄 매듭이 물에 불어 풀렸다. 통나무 넷이 제각각 떠내려갔다. 아이는 한 개를 끝까지 붙잡고 결승선에 닿았다. 박수는 제일 크게 받았다.' } },
      { label: '둑에서 응원만 하자고 한다', effects: { stress: -6, 'stat.sens': +2, 'pers.extro': -1, trust: -1 },
        result: '둑에 앉아 참외를 깎아 먹으며 뗏목들을 구경했다. 브람네 돛이 바람에 날아가자 아이가 배꼽을 잡았다. 그래도 돌아오는 길에 헛간 쪽을 한 번 돌아봤다.' },
      { label: '페터 아저씨께 판자를 빌린다', conditions: ['flag.b10_dyke_held'], effects: { 'stat.agi': +4, reputation: +4, 'pers.extro': +2, stress: -4 },
        result: '"둑 지킨 꼬마한테 빌려주는 거다." 페터 아저씨가 물레방앗간의 넓은 판자를 내줬다. 판자 뗏목은 물살 위를 미끄러져 다리 밑을 맨 먼저 지났다. 아저씨가 다리 위에서 모자를 흔들었다.' },
    ] },
  { id: 'b10_summer_porch', title: '평상 위의 밤', age: [13, 17], season: 'summer', conditions: ['month != 6'], weight: 1.3,
    text: '찌는 듯한 밤이면 마당 평상에 모깃불을 피우고 앉아 바람을 쐬는 게 이 집의 여름 버릇이다. 큐브는 평상 모서리에서 부채질을 맡는다. 세 개의 달이 차례로 지붕을 넘어간다. 한참 별을 세던 {name이} 무릎을 끌어안은 채 말했다. "{call}, 어른이 되면 무서운 게 없어져?"',
    choices: [
      { label: '"아니, 무서운 게 바뀔 뿐이야"', effects: { trust: +5, 'stat.sens': +3, 'pers.roman': -1 },
        result: '"그럼 {call은} 지금 뭐가 무서운데?" 당신은 한참 생각하다 대답했다. 아이는 웃지 않고 고개를 끄덕였다. 그러고는 제 얇은 담요를 당신 무릎에 덮어 주었다.' },
      { label: '"응. 그러니 걱정 마"', effects: { stress: -8, 'pers.roman': +2, trust: +1 },
        result: '"거짓말." 아이가 킥킥 웃었다. "근데 듣기는 좋다." 아이는 금세 잠들었다. 당신은 모깃불이 다 사그라질 때까지 깨어 있었다.' },
      { label: '무엇이 무서운지 묻는다', check: { stat: 'sens', dc: 110 },
        success: { effects: { trust: +6, 'stat.sens': +4, stress: -8 },
          result: '아이는 한참 만에 털어놓았다. 어디서 왔는지 모르는 게, 언젠가 또 어디론가 떨어질 것만 같은 게 무섭다고. 당신이 손을 잡자 아이 손끝에서 작은 금빛 별 하나가 피었다 졌다. 그걸로 충분했다.' },
        fail: { effects: { trust: +1, stress: +3, 'pers.extro': -2 },
          result: '"……아냐, 별거 아냐." 아이는 무릎에 얼굴을 묻었다. 모깃불 타는 소리만 났다. 말할 준비가 될 때까지는 시간이 조금 더 필요해 보였다.' } },
      { label: '짧은 밤 기도를 가르친다', conditions: ["guardian == 'priest'"], effects: { 'stat.faith': +5, trust: +3, stress: -6 },
        result: '"무서운 밤에 외는 짧은 기도야." 아이가 따라 외다가 중간에 하품을 했다. 기도는 끝나지 않았지만 아이는 웃는 얼굴로 잠들었다. 나머지는 당신이 마저 외웠다.' },
    ] },

  // ── 별똥별 비 ───────────────────────────────────────────────────────
  // 별의 아이를 놀리는 장면(b02_star_rumor·b05_burst)과 겹치지 않게, 진심으로 소원을 비는 꼬마 앞의 정직과 다정 사이 딜레마.
  // 17세 8월은 b05 '세 달이 겹치는 밤'(고정)이 맡으므로 16세까지.
  { id: 'b10_meteor_shower', title: '별비 내리는 밤', age: [12, 16], month: 8, weight: 1.8, image: 'bg/starnight',
    text: '늦여름, 해마다 별똥별이 비처럼 쏟아지는 밤이 왔다. 마을 사람들은 언덕에 돗자리를 펴고 소원을 빈다. 그때 대여섯 살 된 꼬마가 {name}의 소매를 잡아당겼다. "언니, 별에서 왔다며? 우리 할머니 다리 낫게 해 줘. 별끼리는 말이 통하잖아." 꼬마의 눈은 진지했다. {name이} 난처한 얼굴로 당신을 돌아봤다.',
    choices: [
      { label: '솔직하게 말해 주라고 한다', check: { stat: 'elo', dc: 100 },
        success: { effects: { 'stat.elo': +5, 'stat.moral': +3, 'pers.good': +1, reputation: +3 },
          result: '"나는 소원 들어주는 별이 아니야. 대신 내일 할머니 다리 주물러 드리러 갈게." 꼬마는 입을 삐죽이다 새끼손가락을 내밀었다. 이튿날 아이는 정말 갔고, 할머니가 사과 한 알을 쥐여 주었다.' },
        fail: { effects: { 'stat.elo': +2, 'pers.extro': -2, stress: +6 },
          result: '"나, 나는 그런 거 못 해……." 말끝이 흐려지자 꼬마 눈에 눈물이 고였다. 아이는 꼬마가 엄마 품으로 달려갈 때까지 아무 말도 못 했다. 돌아오는 길, 아이가 당신 손을 꽉 잡았다.' } },
      { label: '같이 빌어 주라고 한다', effects: { 'stat.sens': +4, 'pers.roman': +2, reputation: +2, stress: +4 },
        result: '아이는 꼬마 손을 잡고 별똥별이 떨어질 때마다 같이 빌었다. 꼬마는 활짝 웃으며 돌아갔다. 집에 오는 길에 아이가 중얼거렸다. "할머니가 안 나으면, 걔는 내 탓이라고 생각할까."' },
      { label: '둘러대고 지붕으로 데려간다', effects: { trust: +4, 'stat.sens': +3, 'pers.extro': -2, stress: -6 },
        result: '"언니는 오늘 별 세는 숙제가 있대." 당신이 둘러대고 아이를 데리고 나왔다. 둘만 지붕에 올라 별비를 봤다. 아이는 별똥별을 세다 마흔 개째에서 그만뒀다. "저 중에 나 같은 애가 또 있을까."' },
      { label: '손끝의 별빛을 나눠 주게 한다', conditions: ['flag.magic_awake'], effects: { 'stat.mag': +5, 'stat.sens': +2, 'pers.extro': +2, reputation: +2 },
        result: '아이가 오므린 손을 펴자 작은 별빛 하나가 꼬마 손바닥에 내려앉았다 사르르 꺼졌다. "할머니한테 가져다드려. 나는 이것밖에 못 해." 꼬마는 빈손을 꼭 쥐고 집으로 달려갔다.' },
    ] },

  // ── 가을 수확 ───────────────────────────────────────────────────────
  { id: 'b10_orchard_gale', title: '큰바람 오기 전에', age: [11, 16], month: 8, weight: 1.5, image: 'bg/wheat_field',
    text: '늦여름 해 질 녘, 한스 아저씨가 숨을 몰아쉬며 대문을 두드렸다. "오늘 밤 큰바람이 온다네. 사과가 다 떨어지기 전에 따야 해. 손 하나라도 아쉬워." 내일은 {name}도 새벽같이 나가야 하는 날이다. 그런데 아이는 벌써 바구니를 찾고 있었다.',
    choices: [
      { label: '등불을 들고 밤새 딴다', effects: { 'stat.hp': +4, 'stat.str': +3, stress: +8, reputation: +4, 'flag.b10_apples': true },
        result: '등불 수십 개가 과수원에 걸렸다. 아이는 사다리 꼭대기에서 새벽까지 사과를 땄다. 마지막 바구니를 내려놓자마자 바람이 몰아쳤다. 한스 아저씨가 사과 한 자루를 수레에 실어 줬다.' },
      { label: '자정까지만 돕게 한다', check: { stat: 'agi', dc: 85 },
        success: { effects: { 'stat.agi': +5, reputation: +3, stress: +2, 'flag.b10_apples': true },
          result: '아이는 다람쥐처럼 가지 사이를 옮겨 다녔다. 자정까지 딴 바구니가 어른 둘 몫이었다. "약속은 약속." 아이는 집에 와 곯아떨어졌다. 아침, 문 앞에 사과 한 자루가 놓여 있었다.' },
        fail: { effects: { 'stat.agi': +2, 'pers.agree': +1, stress: +3, reputation: +1 },
          result: '아이는 손이 느려 바구니 반도 못 채웠다. 자정에 돌아오는 길에 자꾸 과수원 쪽을 돌아봤다. 아침엔 바람에 멍든 사과 몇 알이 문 앞에 놓여 있었다.' } },
      { label: '아이는 재우고 당신만 간다', effects: { gHealth: -8, reputation: +3, trust: -2, 'flag.b10_apples': true },
        result: '당신은 새벽까지 사다리를 오르내렸다. 돌아와 보니 아이가 깨어 있었다. "나도 할 수 있었는데." 사과 한 자루를 보고도 아이는 끝내 웃지 않았다.' },
      { label: '아이에게 지휘를 맡긴다', conditions: ['mastery.farm >= 6'], effects: { 'stat.elo': +4, 'stat.int': +3, reputation: +6, 'pers.ambit': +2, 'flag.b10_apples': true },
        result: '"사다리는 두 줄로, 바구니는 아래서 받아요!" 농장에서 일해 본 아이의 외침에 어수선하던 과수원이 금세 정리됐다. 동트기 전에 일이 끝났다. 한스 아저씨가 아이를 "꼬마 감독"이라 불렀다.' },
    ] },
  { id: 'b10_jam_day', title: '사과잼 끓이는 날', age: [10, 16], month: 10, weight: 1.5,
    text: '시월이면 큰 솥에 사과잼을 끓인다. 부엌 가득 단내가 퍼지고, 큐브는 설탕 단지 곁을 떠나지 않는다. {name이} 나무 주걱을 두 손으로 쥐었다. "올해는 내가 저을래. 끝까지. 눌어붙으면 내 탓 해도 돼."',
    choices: [
      { label: '주걱을 맡긴다', check: { stat: 'sens', dc: 80 }, minigame: 'cooking',
        success: { effects: { 'stat.sens': +4, 'stat.hp': +2, trust: +3, 'flag.b10_jam_jars': true },
          result: '아이는 한 시간 넘게 쉬지 않고 저었다. 잼이 주걱에서 천천히 떨어질 때 불을 껐다. 김 서린 부엌에 금빛 별이 몇 개 떠다녔다. 병 여덟 개에 라벨이 붙었다. 「올해의 잼 · 내가 저음」.' },
        fail: { effects: { 'stat.sens': +2, stress: +4, trust: +1, 'flag.b10_jam_jars': true },
          result: '팔이 아파 잠깐 쉰 사이 바닥이 눌어붙었다. 병 여덟 개 중 셋에서 탄내가 났다. 아이는 그 세 병에 「내 거」라고 써 붙였다. 나머지 다섯 병은 멀쩡했다.' } },
      { label: '셋이서 번갈아 젓는다', effects: { 'rel.cube': +5, stress: -6, 'stat.sens': +2, 'flag.b10_jam_jars': true },
        result: '"하나, 둘, 셋, 교대!" 큐브의 구령에 맞춰 주걱이 손에서 손으로 넘어갔다. 잼은 고르게 졸았고, 큐브 날개에는 설탕 결정이 반짝반짝 붙었다. 셋 다 손가락이 끈적였다.' },
      { label: '한스네 사과로 두 솥 끓인다', conditions: ['flag.b10_apples'], effects: { 'flag.b10_jam_jars': true, 'stat.hp': +3, stress: +4, reputation: +3 },
        result: '큰바람 불던 밤 뒤로 한스 아저씨는 가을마다 사과 한 자루를 보내온다. 덕분에 솥을 두 번 걸었다. 병이 찬장에 다 들어가지 않아 이웃에 돌렸다. 마르타 할머니는 잼 세 병을 빵 한 바구니와 바꿔 갔다.' },
      { label: '설탕값이 비싸 올해는 거른다', effects: { gold: +30, trust: -3, 'pers.roman': -2, stress: +3 },
        result: '"설탕이 금값이야. 올해는 쉬자." 아이는 고개를 끄덕였다. 겨울 내내 찬장 맨 위 칸이 비어 있었다. 아이는 빵에 아무것도 바르지 않고 먹었다.' },
    ] },

  // ── 장날 ───────────────────────────────────────────────────────────
  { id: 'b10_market_day', title: '닷새장', age: [10, 17], repeatable: true, weight: 0.4, image: 'bg/market',
    conditions: ['month != 3', 'month != 6', 'month != 9', 'month != 12'],
    text: (s) => `닷새마다 서는 장날이다. ${MARKET_GOODS[s.season] || MARKET_GOODS.spring} 사이로 사람들이 북적인다. `
      + (s.age >= 14
        ? '{name이} 어느 좌판 앞에서 걸음을 멈추더니 슬쩍 당신 팔짱을 꼈다. "{call}, 오늘 기분 좋아 보이는데. 하나만, 응?"'
        : '{name이} 당신 소매를 끌었다. "딱 하나만 사도 돼? 진짜 하나만."'),
    choices: [
      { label: '"하나만이다" (-20G)', conditions: ['gold >= 20'], effects: { gold: -20, stress: -6, 'pers.roman': +1 },
        result: '아이는 장터를 세 바퀴 돈 끝에 고른 것을 품에 안고 돌아왔다. 무엇을 골랐는지는 집에 와서야 보여 줬다. 늘 그렇듯, 당신 몫도 하나 있었다.' },
      { label: '구경하며 흥정을 가르친다', effects: { 'stat.elo': +3, 'stat.int': +1, 'pers.roman': -1 },
        result: '"사지 않아도 값은 물어볼 수 있어." 아이는 생선 장수, 그릇 장수와 차례로 흥정하는 시늉을 했다. 마지막 가게 할머니가 웃으며 사탕 한 알을 쥐여 줬다.' },
      { label: '"네 용돈으로 사"', conditions: ['flag.allowance'], effects: { 'stat.int': +2, 'pers.ambit': +2, 'pers.roman': -1 },
        result: '아이는 주머니 속 동전을 세어 보더니 고른 걸 내려놓았다. "다음 장날까지 참을래. 그럼 더 좋은 거 살 수 있어." 당신이 놀란 얼굴을 하자 아이가 어깨를 으쓱했다.' },
      { label: '오늘은 그냥 돌아가자', effects: { trust: -2, 'pers.agree': +1 },
        result: '"다음 장날에." 아이는 순순히 따라왔지만 사탕 장수의 방울 소리가 들릴 때마다 뒤를 돌아봤다.' },
    ] },
  { id: 'b10_market_stall', title: '첫 좌판', age: [13, 16], month: 2, weight: 2, image: 'bg/market',
    text: '이월 장날, {name이} 좌판을 펴 보겠다고 했다. 겨우내 만든 꿀절임 병과 털실 장갑을 늘어놓을 작은 자리 하나. 장터 관리인이 자릿세로 은화 세 닢을 부른다. 아이는 보자기를 꽉 쥐고 당신을 올려다봤다. "팔 수 있을까? 아무도 안 사면 어떡하지?"',
    choices: [
      { label: '자릿세를 내 주고 지켜본다', conditions: ['gold >= 30'], check: { stat: 'elo', dc: 105 },
        success: { effects: { gold: +50, 'stat.elo': +5, 'pers.ambit': +2 }, next: 'b10_market_thief',
          result: '처음엔 목소리가 기어들어 갔다. 마르타 할머니가 지나가다 하나를 사 준 뒤로 손님이 이어졌다. 해 질 녘 보자기 위엔 동전이 수북했다. 자릿세를 빼고도 남았다.' },
        fail: { effects: { gold: -20, 'stat.elo': +2, stress: +6 }, next: 'b10_market_thief',
          result: '손님들은 힐끗 보고 지나쳤다. 오후 내내 판 건 셋. 자릿세도 다 못 건졌다. 보자기를 개던 아이는, 좌판 옆 꼬마 하나가 아까부터 물건을 보고 있다는 걸 알아챘다.' } },
      { label: '빵집에 넘기자고 한다', effects: { gold: +30, 'stat.elo': +2, 'pers.ambit': -2 },
        result: '마르타 할머니네 빵집에 몽땅 넘겼다. 값은 헐했지만 하루 만에 끝났다. 아이는 동전을 세다가 말했다. "내 이름 붙여서 팔아 준대." 그걸로 조금 위로가 되는 모양이었다.' },
      { label: '가을에 끓인 잼을 내놓는다', conditions: ['flag.b10_jam_jars', 'gold >= 30'], effects: { gold: +45, 'stat.elo': +3, reputation: +3 }, next: 'b10_market_thief',
        result: '가을에 끓여 둔 사과잼 병마다 아이가 손글씨 라벨을 붙였다. 「우리 집 잼 · 직접 저음」. 사람들이 웃으며 하나씩 집어 갔다. 점심때가 되자 남은 건 두 병뿐이었다.' },
      { label: '첫 손님 끄는 법을 일러 준다', conditions: ["guardian == 'merchant'", 'gold >= 30'], effects: { gold: +40, 'stat.elo': +6, 'stat.chm': +2, trust: +2 }, next: 'b10_market_thief',
        result: '"첫 손님한텐 덤을 얹어. 소문은 그 사람이 내 준다." 정말로 첫 손님이 친구 셋을 데려왔다. 아이가 장사꾼 눈빛으로 당신을 봤다. "{call}, 옛날에 좀 했구나?"' },
    ] },
  { id: 'b10_market_thief', title: '좌판의 작은 손', chainOnly: true, age: [13, 16], image: 'bg/market',
    text: '파장 무렵, 대여섯 살쯤 된 꼬마가 좌판 앞을 맴돌다 병 하나를 품에 넣고 달아났다. {name이} 벌떡 일어났다가 멈췄다. 꼬마의 맨발이 이월 장터 진창에 시커멓게 젖어 있었다. "{call}, 어떡해?"',
    choices: [
      { label: '쫓아가 돌려받게 한다', check: { stat: 'agi', dc: 100 },
        success: { effects: { 'stat.agi': +4, 'stat.moral': +2, 'pers.good': +1 },
          result: '아이는 골목 끝에서 꼬마를 붙잡았다. 병을 돌려받고서야 꼬마 손이 얼어 터진 걸 봤다. 아이는 병을 도로 쥐여 주고 돌아왔다. "돌려받았다가, 준 거야. 그건 다른 거지?"' },
        fail: { effects: { 'stat.agi': +2, stress: +4, 'pers.good': -1 },
          result: '꼬마는 골목 사이로 사라졌다. 아이는 숨을 몰아쉬며 돌아와 빈자리를 내려다봤다. "……배고팠겠지." 화난 건지 슬픈 건지 모를 목소리였다.' } },
      { label: '다음 장날에 오라고 외친다', effects: { 'stat.moral': +4, 'pers.good': +3, gold: -20, reputation: +2 },
        result: '"다음 장날에 와! 일 도와주면 한 병 더 줄게!" 꼬마가 골목 끝에서 멈칫했다. 닷새 뒤, 꼬마는 정말 왔다. 이름은 핍. 핍은 그날 좌판을 기가 막히게 잘 지켰다.' },
      { label: '장터 순찰에게 알린다', effects: { 'pers.agree': +2, 'pers.good': -2, reputation: +2, stress: +5, trust: -2 },
        result: '순찰이 꼬마를 붙잡아 왔다. 상인들은 잘했다고 고개를 끄덕였지만, 꼬마는 울면서 끌려갔다. 아이는 돌려받은 병을 끝내 팔지 못했다. 찬장 구석에 두고 다시는 꺼내지 않았다.' },
      { label: '성당 급식소를 알려 준다', conditions: ["guardian == 'priest'"], effects: { 'stat.faith': +3, 'stat.moral': +3, 'pers.good': +2, reputation: +2 },
        result: '"성당 뒷문에서 저녁마다 수프를 나눠 줘." 아이가 꼬마를 따라가 그 말을 전했다. 꼬마는 병을 내밀었다가, 아이가 고개를 젓자 품에 도로 넣었다. 그날 저녁, 성당 뒷문 줄에 꼬마가 서 있었다.' },
    ] },
];
