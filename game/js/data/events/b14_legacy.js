// 배치 b14 — 유산과 다회차 (10~17세, 2회차 이상 전용)
// GDD 4.9 유산 시스템: 이전 회차의 딸들이 카메오로 스쳐 간다 · 기시감 · 회차가 쌓일수록 열리는 작은 비밀
// 규칙: docs/game-design/content-contract.md  (id·비공개 플래그 접두사 b14_)
//
// 모든 이벤트는 legacyCount >= 1 또는 playthrough >= 2 조건. s.legacy = [{ name, endingId, endingName, cat }] (최근 회차가 앞).
// 장면은 (s) => 함수로 쓰고, 이전 딸의 이름·엔딩 이름·엔딩 카테고리(CAT 표, 9종 + 기본값)에 따라 달라진다.
// s.legacy가 비었거나 cat을 모르면 L()/C()가 기본값을 돌려준다. 이전 딸과 지금 아이의 이름이 같으면(기본 이름 '루나') 따로 쓴다.
//
// 연쇄 3개
//   ① 숲의 표식:   b14_known_trail → b14_trail_cache                              (12~16세, 모험 중)
//   ② 낯익은 얼굴: b14_familiar_face → b14_her_tea → b14_her_keepsake            (12~15세, legacy_met 세팅)
//                  └ 놓쳤을 때 다시 찾아가기: b14_borrowed_name → b14_her_tea
//   ③ 자매들:      b14_sisters_letter → b14_sisters_field → b14_sisters_dawn     (16~17세, legacyCount >= 2, legacy_met 세팅)
// 회차가 쌓일수록 열리는 비밀: 아이 방 문설주 눈금(2회차~, 3회차부터 겹친 이름) · 큐브의 셈(3회차~) · 마루 밑 상자(4회차~) · 늘어난 별(딸 2명~)
// 다른 배치와의 경계: 부엌 문설주 새해 키 재기는 b10_door_marks(이번 아이의 눈금) — 여기 눈금은 아이 방 벽지 밑에 숨은 '앞의 아이들' 것.
//   '세 달이 겹치는 밤'은 b05(17세 8월, 어머니의 자장가)의 것이므로 자매들은 '세 달이 나란히 뜨는 밤'(b13_three_shadows와 같은 하늘)에 만난다.
//   자장가는 당신이 지은 노래(세 달이 차례로 잠드는 노래)로, b05 어머니의 자장가·b01/b13 큐브의 자장가와 다른 곡이다.
// 공용 플래그 세팅: legacy_met (b14_her_keepsake 전 선택지 · b14_sisters_field 전 선택지) — 히든 엔딩 「자매들」(legacyCount >= 2와 함께)
// 공용 플래그 읽기: met_elda · elda_secret_1 · magic_awake · star_watching(b13) · legacy_met
// 비공개 플래그(모두 이 파일 안에서 다시 읽힌다):
//   b14_marks → same_question · b14_cube_hint → cube_counts · b14_recipe → her_tea · b14_lullaby → sisters_field
//   b14_saw_her → borrowed_name · b14_left_gift → sisters_field · b14_forbade → sisters_dawn · b14_sisters → extra_stars
//   b14_cube_counted → floor_box(큐브를 부른다: rel.cube 50+ 또는 이 플래그)
// 아이템 조건: lute(lullaby) · silver_hairpin(her_keepsake)   보호자 출신: scholar(recipe_card) · adventurer(known_trail) · priest(sisters_dawn)
// 능력치·관계·신뢰 조건: stat.mag(trail_cache) · rel.cube 또는 b14_cube_counted(floor_box) · trust(familiar_face, sisters_letter)
// 미니게임: recipe_card(요리) · known_trail(모험) · extra_stars(시험) — 판정 12개 중 3개
// 안전: 이전 딸은 어른이지만 보호자에게는 '오래 떠나 있던 아이'로만 다가온다. 연애·연애 암시 없음.
import { josa, hasBatchim } from '../../engine/josa.js';
import { GUARDIANS } from '../guardians.js';
// 이전 회차의 딸이 '자기' 보호자를 부르던 호칭. 이번 회차 출신이 달라도 그 아이는 자기가 부르던 말로 부른다.
const herCall = (s, i = 0) => GUARDIANS[s?.legacy?.[i]?.guardian]?.call ?? GUARDIANS[s?.guardian]?.call ?? '아빠';
const HER_TOK = /\{call(이랑|이에요|이었|으로|이야|이여|이|가|은|는|을|를|과|와|아|야|로|랑)?\}/g;
const inHerVoice = (s, str, i = 0) => String(str ?? '').replace(HER_TOK, (_, p) => (p ? josa(herCall(s, i), p) : herCall(s, i)));

// ── 카테고리별 장면 조각 ─────────────────────────────────────────────────
// mark: 문설주 눈금 옆 표시 · look: 카메오 차림 · lookShort: 들판 장면용 짧은 차림 · token/tokenShort/tokenLine: 남긴 물건
// advice: 동생에게 하는 말 · life: 지금 사는 이야기 · rumor/borrow: 아이를 그녀로 착각하는 사람들 · dream/dreamStep: 아이가 꾸는 꿈
// habit: 그 나이 때 했던 질문 · trail/cache: 숲의 표식과 꾸러미 · recipe: 요리 카드 메모 · elda: 엘다의 흐릿한 기억
// farewell: 보호자의 꿈속 작별 인사 · color: 하늘에 늘어난 별의 빛깔
const CAT = {
  '왕실/정치': {
    mark: '작은 왕관이 새겨져 있다',
    look: '짙은 남색 망토 자락에 은실 문장이 수놓여 있고, 몇 걸음 뒤에서 호위 둘이 조용히 기다린다.',
    lookShort: '남색 망토를 두른 채',
    token: '봉랍이 찍힌 작은 쪽지', tokenShort: '봉랍 찍힌 쪽지',
    tokenLine: '쪽지에는 서툰 글씨로 「우리 집 법 제1조: 저녁은 같이 먹는다」라고 적혀 있었다.',
    advice: '"높은 데 올라가 보면 말이야, 생각보다 추워. 그러니까 내려올 집이 있어야 해."',
    life: '왕도에서 법을 만드는 사람들 틈에 있다고 했다. "회의가 길어지면 이 집 저녁 식탁을 생각해요."',
    rumor: '왕도에서 온 상인들이 {name}에게 공손히 길을 비켜 주었다. "어느 댁 아가씨신지……."',
    borrow: '아이는 아니라고 하지 않았다. 턱을 살짝 들고 걷자 상인들이 알아서 값을 깎아 주었다. 집에 오는 길에 아이가 어깨를 주물렀다. "높은 사람 흉내, 생각보다 어깨 아프다."',
    dream: '높은 단 위에 섰는데 아래 사람들이 모두 고개를 숙이는 꿈',
    dreamStep: '예절 책을 꺼내 와 첫 장부터 소리 내어 읽었다.',
    habit: '"{call}, 왕국에서 제일 높은 데는 어디야? 거기 올라가면 우리 집도 보여?"',
    trail: '나무껍질에 작은 왕관이 새겨져 있다',
    cache: '접힌 지도 한 장과 「길을 잃으면 높은 데로 올라가라」라는 쪽지',
    recipe: '「손님 대접용. 절대 태우지 말 것.」',
    elda: '……왕관 그리는 걸 좋아하던 아이가 있었던 것 같은데. 제 오두막 문에도 그려 놓고 갔어요.',
    farewell: '그 아이가 말했다. "왕도에 가면 자주 못 와. 그래도 내 첫 번째 백성은 {call이야}."',
    color: '은빛',
  },
  '무예': {
    mark: '작은 칼이 새겨져 있다',
    look: '햇볕에 그을린 손등에 오래된 흉터가 있고, 등에는 손잡이가 닳은 검을 메었다.',
    lookShort: '닳은 검을 등에 멘 채',
    token: '날을 세우다 닳아 버린 숫돌 조각', tokenShort: '닳은 숫돌',
    tokenLine: '숫돌 한쪽에 칼끝으로 새긴 글씨가 있었다. 「하루도 거르지 말 것. 그래도 아프면 쉴 것.」',
    advice: '"넘어지는 건 괜찮아. 넘어진 채로 오래 있지만 마."',
    life: '검 한 자루로 누군가를 지키며 산다고 했다. "추운 데서 밤을 새울 때가 많아요. 그럴 때마다 이 집 난롯가가 생각나요."',
    rumor: '도장 앞을 지나는데 늙은 검사가 {name을} 불러 세웠다. "그 걸음걸이, 어디서 배웠냐? 십 년 전 여기 드나들던 은발 꼬마랑 똑같은데."',
    borrow: '아이는 그 꼬마인 척 고개를 끄덕였다. 늙은 검사는 신이 나서 그 꼬마가 쓰던 목검을 꺼내 오고, 수련비도 받지 않겠다고 했다. 목검은 손에 착 감겼다. 그게 조금 무서웠다.',
    dream: '눈 덮인 고개에서 검을 쥐고 등 뒤의 마을을 지키는 꿈',
    dreamStep: '마당에 나가 빗자루를 검처럼 쥐고 해가 질 때까지 휘둘렀다.',
    habit: '"{call}, 나무 막대기 하나만 깎아 줘. 아니, 두 개. 대련하게."',
    trail: '바위에 칼끝으로 그은 화살표가 있다',
    cache: '날을 세우지 않은 연습용 단검과 「길보다 발밑을 봐라」라는 쪽지',
    recipe: '「훈련 끝나고 먹는 것. 양은 두 배.」',
    elda: '……무릎이 성할 날이 없던 아이가 있었던 것 같아요. 약초를 얼마나 발라 줬는지.',
    farewell: '그 아이가 말했다. "다녀올게. 검은 매일 닦을게. {call}도 무릎 조심하고."',
    color: '붉은빛',
  },
  '학문/마법': {
    mark: '작은 별이 새겨져 있다',
    look: '손가락마다 잉크 얼룩이 배어 있고, 소매 끝에서 작은 빛 알갱이들이 맴돈다.',
    lookShort: '손끝에 빛 알갱이를 띄운 채',
    token: '깨알 같은 글씨로 빼곡한 수첩 한 장', tokenShort: '깨알 글씨 수첩',
    tokenLine: '맨 위에 「모르는 것 목록」이라고 적혀 있었다. 마지막 줄은 「별은 왜 우리 집에 떨어졌을까」.',
    advice: '"모르는 걸 모른다고 적어 둬. 그게 제일 좋은 공책이야."',
    life: '책과 별과 숫자 사이에서 산다고 했다. "밤새 들여다보다 보면 이 집 부엌 냄새가 나요. 이상하죠."',
    rumor: '왕도 서점 주인이 {name}에게 낡은 책을 내밀었다. "이거 찾으러 왔지? 십 년 전에 너랑 똑같이 생긴 꼬마가 맨날 이것만 봤거든."',
    borrow: '아이는 아니라고 하지 않았다. 서점 주인은 그 꼬마 이야기를 하며 책을 반값에 주었다. 집에서 책장을 넘기던 아이가 멈췄다. 여백에 적힌 풀이가 자기 글씨랑 똑같았다.',
    dream: '끝없는 서가 사이를 걷는데 책장이 저절로 넘어가 길을 알려 주는 꿈',
    dreamStep: '책장 맨 위 칸의 두꺼운 책을 꺼내 첫 장을 폈다.',
    habit: '"{call}, 별은 왜 떨어져? 떨어지면 어디로 가?"',
    trail: '나무에 분필로 작은 수식이 적혀 있다',
    cache: '반쯤 쓴 공책 한 권과 「답은 맨 뒷장에. 하지만 먼저 풀어 볼 것」이라는 쪽지',
    recipe: '「계량은 정확히. 소금 세 꼬집. 세 꼬집이라니까.」',
    elda: '……제 책을 몽땅 빌려 가서 하나도 안 돌려준 아이가 있었던 것 같아요. 손끝에 별을 띄우고 다녔죠.',
    farewell: '그 아이가 말했다. "탑에 가면 편지 자주 쓸게. {call} 답장에 틀린 글자 있으면 고쳐서 돌려보낼 거야."',
    color: '푸른빛',
  },
  '예술/문화': {
    mark: '작은 음표가 새겨져 있다',
    look: '소매 끝에 물감이 묻어 있고, 등에는 낡은 악기 가방을 메었다.',
    lookShort: '악기 가방을 멘 채',
    token: '끝이 뭉툭해진 몽당연필과 접힌 악보', tokenShort: '몽당연필',
    tokenLine: '접힌 악보에는 첫 마디만 적혀 있었다. 나머지는 비어 있었다. "네가 채워."',
    advice: '"잘하려고 하지 마. 오래 하려고 해. 그럼 잘하게 돼."',
    life: '여러 도시를 돌며 제 작품을 사람들 앞에 내놓는다고 했다. "박수가 커질수록 이 집의 조용한 저녁이 그리워요."',
    rumor: '극단 마차 앞에서 단장이 {name을} 붙잡았다. "목소리 한번 내 봐라. ……역시. 십 년 전 우리 무대에서 노래하던 아가씨랑 똑같아."',
    borrow: '아이는 그 아가씨의 동생이라고 둘러댔다. 단장은 반색하며 합창 품삯을 미리 쥐여 주고, 그 아가씨가 입던 무대 옷까지 대 보았다. 꼭 맞았다. 아이는 옷을 곱게 개켜 돌려주었다.',
    dream: '불 꺼진 무대 한가운데서 노래하는데 객석 맨 뒤에서 누군가 혼자 박수를 치는 꿈',
    dreamStep: '종이를 꺼내 꿈에서 들은 노래를 기억나는 데까지 적었다.',
    habit: '"{call}, 이 노래 끝부분은 내가 지어도 돼?"',
    trail: '나무 둥치에 작은 새 그림이 그려져 있다',
    cache: '빛바랜 그림 한 장과 「이 숲에서 제일 예쁜 데는 여기야」라는 쪽지',
    recipe: '「당근은 마지막에. 색이 예뻐야 맛있다.」',
    elda: '……제 오두막 벽에 몰래 꽃을 그려 놓고 간 아이가 있었던 것 같아요. 지금도 거기 남아 있어요.',
    farewell: '그 아이가 말했다. "첫 공연 땐 맨 앞자리 비워 둘게. {call} 자리야."',
    color: '보랏빛',
  },
  '생활/상업': {
    mark: '작은 동전이 새겨져 있다',
    look: '앞치마에 밀가루가 묻어 있고, 허리춤에서 열쇠 꾸러미가 짤랑인다.',
    lookShort: '열쇠 꾸러미를 허리에 찬 채',
    token: '귀퉁이가 닳은 장부 한 쪽', tokenShort: '장부 한 장',
    tokenLine: '장부 첫 줄에는 「빚 없음」, 둘째 줄에는 「첫 단골: {call}」이라고 적혀 있었다.',
    advice: '"좋은 가게는 단골이 만들어. 사람한테 친절해. 그게 제일 남는 장사야."',
    life: '제 손으로 꾸린 일터가 있다고 했다. "아침마다 문을 열 때 이 집 부엌을 떠올려요. 아직 거기만큼 따뜻하진 않아요."',
    rumor: '시장 상인들이 {name}에게 자꾸 덤을 얹어 주었다. "외상? 그 얼굴이면 해 줘야지. 십 년 전 그 은발 꼬마는 한 번도 안 떼먹었거든."',
    borrow: '아이는 그 꼬마 이야기에 맞장구를 쳤다. 상인들은 덤을 얹고 값도 깎아 주었다. 집에 와서 아이가 장부에 한 줄을 적었다. 「덤: 남의 얼굴 덕. 다음엔 내 얼굴로 받을 것.」',
    dream: '작은 가게 문을 여는 아침, 빵 냄새 속에서 손님들이 이름을 불러 주는 꿈',
    dreamStep: '동전 단지를 꺼내 와 하나하나 세어 장부에 적었다.',
    habit: '"{call}, 이거 시장에 내다 팔면 얼마 받을 수 있을까?"',
    trail: '길가 돌무더기 위에 동전 하나가 얹혀 있다',
    cache: '작은 돈주머니와 「급할 때 써. 갚을 필요 없음. 대신 다음 아이에게 한 닢」이라는 쪽지',
    recipe: '「손님 많은 날엔 두 배. 남으면 이웃집에.」',
    elda: '……약초값을 깎으려고 반나절을 버티던 아이가 있었던 것 같아요. 결국 제가 졌죠.',
    farewell: '그 아이가 말했다. "첫 장사 하면 제일 먼저 {call}한테 팔 거야. 제값 받고."',
    color: '금빛',
  },
  '신앙': {
    mark: '작은 촛불이 새겨져 있다',
    look: '흰 순례자 옷자락에 먼지가 앉았고, 목에는 작은 금빛 펜던트가 걸려 있다.',
    lookShort: '흰 순례자 옷을 입은 채',
    token: '오래 쥐어서 반질반질해진 묵주 알', tokenShort: '묵주 알',
    tokenLine: '묵주 알에는 작은 글씨가 새겨져 있었다. 「무서울 때 세 번 굴릴 것.」',
    advice: '"기도는 부탁이 아니야. 잘 들으려고 조용해지는 거야."',
    life: '아픈 사람들 곁을 지키며 산다고 했다. "어디서든 이 집 창가 불빛을 생각해요. 그게 제 기도예요."',
    rumor: '성당 앞 계단에서 할머니들이 {name}의 손을 잡았다. "아이고, 그 아가씨를 꼭 닮았네. 우리 손을 이렇게 잡아 주던 은발 아가씨."',
    borrow: '아이는 그 아가씨가 아니라고 말하지 못했다. 할머니들은 기도를 부탁하며 사탕과 동전을 쥐여 주었다. 아이는 진심으로 기도했지만 돌아오는 내내 말이 없었다. "남의 기도를 대신 받은 것 같아."',
    dream: '종소리가 울리는 하얀 길을 맨발로 걷는데 발이 하나도 아프지 않은 꿈',
    dreamStep: '성당에 가서 아무도 없는 의자에 오래 앉아 있다 왔다.',
    habit: '"{call}, 아픈 사람들은 밤에 누가 돌봐 줘?"',
    trail: '갈림길에 작은 흰 돌탑이 쌓여 있다',
    cache: '마른 약초 한 묶음과 「다친 사람을 만나면 나눠 줄 것」이라는 쪽지',
    recipe: '「아픈 사람용. 싱겁게. 따뜻하게.」',
    elda: '……아픈 짐승만 보면 안고 오던 아이가 있었던 것 같아요. 제 오두막이 한때 짐승 병원이었다니까요.',
    farewell: '그 아이가 말했다. "먼 데 가도 매일 밤 {call} 이름 불러 줄게. 기도할 때."',
    color: '흰빛',
  },
  '어둠': {
    mark: '무언가 그렸다가 칼끝으로 북북 긁어 지운 자국이 있다',
    look: '두건을 눈썹까지 눌러썼고, 손가락 마디 사이로 은화 한 닢이 소리 없이 굴러다닌다.',
    lookShort: '두건을 반쯤 내린 채',
    token: '어느 문에 맞는지 모를 작은 열쇠', tokenShort: '이름 없는 열쇠',
    tokenLine: '"아무 문도 안 열려. 그래서 좋은 거야. 누구 것도 훔칠 수 없는 열쇠거든."',
    advice: '"지름길처럼 보이는 길이 제일 멀어. 내가 다 걸어 봐서 알아."',
    life: '무슨 일을 하는지는 말하지 않았다. "밤에 일해요. 그래서 낮에 이 집 창가에 앉아 있는 꿈을 자주 꿔요."',
    rumor: '경비병 하나가 {name을} 오래 쳐다보았다. "……아니지. 그 여자일 리가. 지금쯤 서른이 다 됐을 텐데." 경비병은 그래도 한참 뒤를 따라왔다.',
    borrow: '아이가 경비병을 향해 씩 웃자 경비병이 움찔하며 길을 비켰다. 그날 장터 상인들은 묻지도 않고 값을 깎아 주었다. 다만 아무도 아이에게 말을 걸지 않았다.',
    dream: '지붕 위를 소리 없이 달리는데 아무도 내 이름을 불러 주지 않는 꿈',
    dreamStep: '소리 없이 걷는 연습을 했다. 그러다 큐브를 세 번 놀라게 해서 혼이 났다.',
    habit: '"{call}, 안 들키면 거짓말이 아닌 거야?"',
    trail: '바위에 아는 사람만 알아볼 표식이 그어져 있다',
    cache: '은화 몇 닢과 「이 돈은 깨끗해. 처음으로 정직하게 번 돈이야」라는 쪽지',
    recipe: '「몰래 먹는 야식. 냄새 안 나게. 그래도 {call은} 늘 알았음.」',
    elda: '……제 약초밭에서 몰래 딸기를 따 먹던 아이가 있었던 것 같아요. 한 번도 못 잡았죠. 발소리가 없었거든요.',
    farewell: '그 아이가 말했다. "찾지 마. 나쁜 데 가는 거 아니야. ……아마도." 그리고 문을 소리 없이 닫았다.',
    color: '검푸른빛',
  },
  '관계': {
    mark: '두 손바닥을 겹친 그림이 새겨져 있다',
    look: '한 손으로는 어린아이 손을 잡았고, 다른 손의 장바구니에서는 대파가 삐죽 나와 있다.',
    lookShort: '털실 목도리를 두 번 감은 채',
    token: '실로 엮은 팔찌 한 짝', tokenShort: '짝 잃은 팔찌',
    tokenLine: '"원래 두 개야. 하나는 내가 차고 있어. 나머지는 네가 정해서 줘."',
    advice: '"누군가를 아끼는 건 용기 있는 일이야. 티 나는 걸 겁내지 마."',
    life: '바닷가 마을에서 식구들과 산다고 했다. "저녁마다 식탁을 넉넉히 차려요. 이 집이 그랬던 것처럼요."',
    rumor: '이웃 마을 아주머니가 {name을} 보고 반색했다. "어머, 그 집 딸 많이 컸네! ……아니, 그 딸이 아닌가? 그 애는 벌써 애가 둘이라던데."',
    borrow: '아이는 그 집 딸인 척 웃어 보였다. 아주머니는 사과 한 바구니에 용돈까지 쥐여 주었다. 아이는 사과를 동네에 나눠 주며 다녔다. 저녁 무렵엔 모르는 집 아이들까지 아이를 불렀다. 그 딸 이름으로.',
    dream: '커다란 식탁에 사람들이 둘러앉아 웃는데, 비어 있는 의자 하나에 내가 앉는 꿈',
    dreamStep: '이웃집 아이들을 불러 모아 마당에서 해가 질 때까지 놀았다.',
    habit: '"{call}, 나중에 내가 멀리 가도 이 집에 와도 되지?"',
    trail: '나뭇가지에 색 바랜 리본이 묶여 있다',
    cache: '손때 묻은 털실 뭉치와 「추우면 목도리를 떠. 누구 거든 상관없어」라는 쪽지',
    recipe: '「다 같이 먹는 것. 그릇은 하나 더.」',
    elda: '……올 때마다 친구를 하나씩 더 데려오던 아이가 있었던 것 같아요. 의자가 늘 모자랐죠.',
    farewell: '그 아이가 말했다. "자주 올게. 진짜야. 식구들 다 데리고."',
    color: '분홍빛',
  },
  '히든': {
    mark: '손톱으로 꾹 찍은 듯한 점이 하나 있다. 밤에 보면 희미하게 빛난다',
    look: '머리칼 끝에 별빛이 머물러 있고, 발밑의 그림자가 조금 옅다.',
    lookShort: '머리칼 끝에 별빛을 매단 채',
    token: '아무 글자도 없는 엽서 한 장', tokenShort: '빈 엽서',
    tokenLine: '"불빛에 비춰 봐." 촛불에 대자 엽서 위로 별자리가 떠올랐다. 처음 보는 별자리였다.',
    advice: '"이상한 일이 생기면 무서워하지 말고, 먼저 재미있어해 봐."',
    life: '어디 사느냐고 묻자 그녀는 웃으며 하늘을, 그다음엔 먼 길을 가리켰다. "설명하기 어려운 데요. 그래도 길은 늘 이 집으로 이어져요."',
    rumor: '떠돌이 이야기꾼이 {name을} 보고 이야기를 멈췄다. "은발에 붉은 눈이라…… 세상 끝까지 갔다 온 아가씨 얘기 알아? 아니, 하늘에 갔다던가."',
    borrow: '이야기꾼은 아이를 무대에 세우고 "바로 그 아가씨의 동생"이라고 소개했다. 아이는 고개를 끄덕여 주었다. 사람들이 동전을 던졌다. 아이가 동전을 주우며 물었다. "그 언니, 진짜 있는 사람이야?"',
    dream: '세 개의 달 사이를 징검다리처럼 건너는데 발밑으로 우리 집 지붕이 보이는 꿈',
    dreamStep: '지붕에 올라가 세 달이 뜨는 자리를 하나하나 짚어 보았다.',
    habit: '"{call}, 저 달 너머엔 뭐가 있어? 언젠가 가 봐도 돼?"',
    trail: '나무에 별 모양이 새겨져 있다. 만지면 따뜻하다',
    cache: '빛을 머금은 작은 유리구슬과 「길을 잃으면 이걸 하늘에 비춰 봐」라는 쪽지',
    recipe: '「먼 데서 먹을 것. 오래 두어도 상하지 않게.」',
    elda: '……하늘을 오래 올려다보던 아이가 있었던 것 같아요. 정말 날아가 버릴 것처럼요.',
    farewell: '그 아이가 말했다. "다녀올게. 아주 멀리. 그래도 {call이} 올려다보면 보이는 데로."',
    color: '무지갯빛',
  },
};
const CAT_DEFAULT = {
  mark: '작은 동그라미가 새겨져 있다',
  look: '여행 먼지를 뒤집어쓴 망토 차림이다.',
  lookShort: '여행 망토를 두른 채',
  token: '작게 접힌 쪽지 한 장', tokenShort: '접힌 쪽지',
  tokenLine: '쪽지에는 한 줄만 적혀 있었다. 「잘 자라.」',
  advice: '"네 걸음으로 걸어. 그럼 돼."',
  life: '먼 데서 왔다고만 했다. "그래도 이 집은 알아요. 이상하죠."',
  rumor: '장터 사람들이 {name을} 보고 고개를 갸웃했다. "어디서 본 얼굴인데……."',
  borrow: '아이는 아는 얼굴인 척 웃어 보였다. 사람들이 반갑게 덤을 얹어 주었다. 아이는 집에 와서 거울을 오래 들여다보았다.',
  dream: '처음 보는 집인데 모든 문이 어디로 열리는지 다 아는 꿈',
  dreamStep: '공책에 꿈속 집의 방들을 그렸다. 우리 집과 똑같았다.',
  habit: '"{call}, 나 크면 뭐가 될까?"',
  trail: '나무에 작은 화살표가 새겨져 있다',
  cache: '작은 조약돌 하나와 「여기까지 온 걸 축하해」라는 쪽지',
  recipe: '「맛있게. 그게 다.」',
  elda: '……누군가 있었던 것 같은데. 이름이 혀끝에서 맴돌아요.',
  farewell: '그 아이가 말했다. "다녀올게." 다정한 목소리였다.',
  color: '희미한 빛',
};
// 엔딩 id별 예외 (같은 '관계' 카테고리라도 결이 다른 삶)
const BY_ENDING = {
  drifter: {
    look: '해진 여행 망토에 짐 보따리 하나뿐이다. 신발 밑창이 다 닳아 있다.', lookShort: '해진 여행 망토를 두른 채',
    life: '한곳에 오래 머문 적이 없다고 했다. "그래도 이 근처를 지날 때면 꼭 길을 돌아가요. 이상하죠."',
    farewell: '그 아이가 말했다. "편지할게. 언젠가는." 그리고 한 번도 뒤돌아보지 않았다.',
  },
  family_home: { life: '"저는 집을 떠나지 않는 쪽을 골랐어요. 그런데 이상하게, 여기가 그 집 같아요."' },
  royal_wedding: {
    look: '수수한 외출복인데 소매 단추가 하나같이 금이다. 몇 걸음 뒤에서 호위 하나가 장바구니를 대신 들고 있다.', lookShort: '금단추 달린 외출복을 입은 채',
    life: '왕궁에서 산다고 했다. "방이 백 개쯤 되는데, 제일 좋아하는 데는 부엌이에요. 이 집 부엌을 닮아서요."',
  },
  rival_partner: { life: '왕도에서 오랜 맞수와 해마다 내기를 한다고 했다. "올해도 제가 이겼어요. 아마도요. 이기고 나면 이 집 저녁이 제일 먹고 싶어요."' },
  ship_captain: { life: '배를 몬다고 했다. "폭풍 치는 밤이면 이 집 난롯가가 제일 먼저 생각나요."' },
  herb_doctor: { life: '아픈 사람들에게 약초를 달여 준다고 했다. "약초를 말릴 때마다 이 집 처마 밑이 생각나요."' },
  village_teacher: { life: '마을 학교에서 아이들을 가르친다고 했다. "아이들이 질문을 쏟아 내면 이 집 부엌 식탁이 생각나요."' },
};

// ── 도우미 ──────────────────────────────────────────────────────────────
const FALLBACK = { name: '그 아이', endingId: '', endingName: '', cat: '' };
const legacyOf = (s) => (Array.isArray(s?.legacy) ? s.legacy.filter(l => l && typeof l.name === 'string' && l.name.trim()) : []);
const has = (s, i = 0) => legacyOf(s).length > i;
const L = (s, i = 0) => legacyOf(s)[i] || FALLBACK;
const C = (s, i = 0) => { const l = L(s, i); return { ...(CAT[l.cat] || CAT_DEFAULT), ...(BY_ENDING[l.endingId] || {}) }; };
const same = (s, i = 0) => has(s, i) && L(s, i).name === s.name;
const allSame = (s) => has(s) && legacyOf(s).every(l => l.name === s.name);
const J = (w, p) => josa(w, p);
const sfx = (w, a, b) => (hasBatchim(w) ? a : b);                // 서술격 조사만: 「여왕」+sfx('여왕','이라고','라고')
const cop = (w, a, b) => w + sfx(w, a, b);                       // 낱말+서술격 조사: cop('하린','이에요','예요')
// 이름이 지금 아이와 같으면(또는 언니들끼리 같으면) 주어로 쓸 때 헷갈리므로 호칭으로 바꾼다
const her = (s) => (same(s) ? '그녀' : L(s).name);
const SIS = ['작은언니', '큰언니', '맏언니'];
const pairClash = (s) => { const a = L(s, 0).name, b = L(s, 1).name; return a === b || a === s.name || b === s.name; };
const sis = (s, i = 0) => (pairClash(s) ? (SIS[i] || '언니') : L(s, i).name);
const isCat = (...cats) => (s) => cats.includes(L(s).cat);
// 16세 미만 아이 자신의 꿈·미래로 연애·결혼 결의 엔딩 제목을 비추지 않는다 (계약서 §3-2)
const romantic = (l) => l.endingId === 'royal_wedding' || /결혼|연인|약혼|청혼/.test(l.endingName || '');
const notCat = (...cats) => (s) => !cats.includes(L(s).cat);
// 큐브가 마루 밑 상자 이야기를 털어놓는 조건: 아주 가깝거나(관계 50+), 큐브의 셈을 이미 들었거나
const cubeConfides = (s) => (s.relations?.cube ?? 0) >= 50 || !!s.flags?.b14_cube_counted;
// 고유어 수사 1~99 (회차가 열을 넘어도 「열두 번째」처럼 읽히게)
const N1 = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
const C1 = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
const T10 = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
const inRange = (n) => Number.isInteger(n) && n >= 1 && n < 100;
const native = (n) => (inRange(n) ? T10[Math.floor(n / 10)] + N1[n % 10] : String(n));                       // 셋, 열둘
const counter = (n) => (n === 20 ? '스무' : inRange(n) ? T10[Math.floor(n / 10)] + C1[n % 10] : String(n));   // 세 개, 열두 개
const ordinal = (n) => (n === 1 ? '첫' : counter(n)) + ' 번째';
const quoted = (names) => names.map(n => `「${n}」`).join(', ');
const namesOf = (s, from = 0) => legacyOf(s).slice(from).map(l => l.name);

export default [
  // ══ 2회차부터: 집이 기억하는 것들 ═══════════════════════════════════════
  { id: 'b14_doorframe', title: '문설주의 눈금', age: [10, 12], weight: 1.5, conditions: ['legacyCount >= 1'],
    text: (s) => {
      const l = L(s), c = C(s);
      return `아이 방 벽지를 새로 바르려고 낡은 종이를 뜯어내자, 문설주 안쪽에 칼로 그은 눈금 여덟 줄이 드러났다. 맨 위 눈금 옆에 서툰 글씨로 「${l.name}, 열여덟」, 그 곁에 ${c.mark}. 그은 기억은 없는데, 칼자국 끝을 살짝 꺾는 버릇이 당신 것과 똑같다.`
        + (s.flags?.has_cat ? ' 달무리가 문설주에 코를 대고 오래 킁킁거렸다.' : '')
        + (same(s) ? ' {name이} 눈을 동그랗게 떴다. "{call}, 이거 내 이름이잖아. 나 아직 열여덟 아닌데?"' : ' {name이} 그 눈금에 등을 대 보았다. "{call}, 이 집에 나 말고 누가 살았어?"');
    },
    choices: [
      { label: '옆에 새 눈금을 그어 준다', effects: { trust: +4, 'stat.sens': +3, stress: -3, 'flag.b14_marks': true },
        result: (s) => `당신은 칼을 들어 아이 정수리에 맞춰 줄을 그었다. 「{name}, ${native(s.age)}」. 손이 먼저 알고 움직였다. 두 줄 사이를 손바닥으로 재 보던 아이가 웃었다. "따라잡으려면 한참 멀었네."` },
      { label: '새 벽지로 덮어 버린다', effects: { stress: -4, 'pers.roman': -2, trust: -2 },
        result: '풀칠한 벽지로 문설주까지 꼼꼼히 덮었다. 아이는 말없이 지켜보았다. 다음 날 아침, 새 벽지 위로 맨 위 눈금 한 줄이 희미하게 비쳐 보였다.' },
      { label: '큐브에게 물어본다', effects: { 'rel.cube': +4, 'stat.int': +2, 'flag.b14_cube_hint': true },
        result: '큐브가 눈금 앞에서 빙글 돌다 멈췄다. "주인님, 그건…… 저 그 눈금 좋아해요. 지우지 말아 주세요." 무엇을 아느냐고 묻자, 큐브는 저녁 내내 천장 구석에 붙어 내려오지 않았다.' },
      { label: '눈금 밑을 더 긁어 본다', conditions: ['playthrough >= 3'], effects: { 'stat.sens': +4, 'pers.roman': +3, 'flag.b14_marks': true },
        result: (s) => {
          const others = namesOf(s, 1);
          const sameAll = others.length && others.every(n => n === s.name);
          const found = !others.length ? '이름은 닳아서 읽을 수 없었다.'
            : `${quoted(others)}.${sameAll ? (others.length > 1 ? ' 모두 {name}, 지금 아이와 같은 이름이었다.' : ' 지금 아이와 같은 이름이었다.') : ''}`;
          const touch = !others.length ? '눈금을 손끝으로 하나씩' : others.length > 1 ? '이름들을 손끝으로 하나씩' : '그 이름을 손끝으로 가만히';
          return `칼끝으로 칠을 살살 긁어내자 그 밑에서 눈금이 겹겹이 나왔다. ${found} {name이} ${touch} 짚었다. "다들 여기서 컸구나."`;
        } },
    ] },

  { id: 'b14_lullaby', title: '아무도 가르쳐 주지 않은 노래', age: [10, 11], weight: 1.5, conditions: ['playthrough >= 2'],
    text: '한밤중 물을 마시러 나왔다가 {name}의 방에서 흘러나오는 콧노래를 들었다. 세 개의 달이 차례로 잠드는 자장가. 당신이 지은 노래다. 이 아이에게는 한 번도 불러 준 적 없는 노래. 문틈으로 보니 아이는 눈을 감은 채 이불 위에서 손가락으로 박자를 세고 있었다.',
    choices: [
      { label: '문을 열고 이어 부른다', effects: { trust: +5, 'stat.sens': +3, stress: -5, 'flag.b14_lullaby': true },
        result: (s) => `둘째 소절부터 두 목소리가 겹쳤다. 아이가 졸린 눈으로 웃었다. "역시 {call}도 아는구나. 꿈에서 어떤 언니가 불러 줬어.${!has(s) ? '' : same(s) ? ' 이름이 나랑 똑같대.' : ` 이름이 ${cop(L(s).name, '이래', '래')}.`}"` },
      { label: '끝 소절을 불러 달라고 한다', check: { stat: 'sens', dc: 75 },
        success: { effects: { 'stat.sens': +5, 'pers.roman': +2, 'flag.b14_lullaby': true }, result: '아이는 당신이 지은 적 없는 마지막 소절을 불렀다. 「그리고 다음 아이가 오면, 이 노래를 대신 불러 줘.」 아이는 금세 잠들었다. 당신은 그 소절을 받아 적었다.' },
        fail: { effects: { 'stat.sens': +2, stress: -3, trust: +1 }, result: '아이는 끝 소절을 부르다 말고 잠들어 버렸다. 입술이 마지막 낱말을 오물거렸다. 당신은 그 낱말을 끝내 알아듣지 못했다.' } },
      { label: '모른 척 문을 닫아 준다', effects: { 'stat.sens': +2, 'pers.roman': +2, 'pers.extro': -2 },
        result: '노래는 아이 혼자만의 것으로 남았다. 그 뒤로도 아이는 잠들기 전 그 노래를 불렀다. 당신이 듣고 있다는 걸 모르는 채로. 어쩌면 알면서.' },
      { label: '류트로 반주를 넣어 준다', conditions: ['item.lute >= 1'], effects: { 'stat.sens': +5, 'stat.chm': +2, stress: -4, 'flag.b14_lullaby': true },
        result: '류트 소리에 노래가 멈칫했다가 더 크게 이어졌다. 아이가 이불 밖으로 손을 내밀어 박자를 맞췄다. "{call}, 이 노래 원래 반주가 있었지? 그런 것 같았어."' },
    ] },

  { id: 'b14_recipe_card', title: '남의 글씨로 쓴 요리법', age: [10, 13], weight: 1, conditions: ['legacyCount >= 1'],
    text: (s) => {
      const l = L(s), c = C(s);
      return `찬장 맨 안쪽, 이 빠진 찻잔 밑에서 기름 얼룩이 진 카드가 나왔다. 「${l.name}의 호박 수프」. 재료 목록 아래 작은 메모. ${inHerVoice(s, c.recipe)} 그리고 맨 아래 한 줄. 「${inHerVoice(s, '{call이}')} 제일 좋아함」. 당신은 숨을 멈췄다. 정말로 당신이 세상에서 제일 좋아하는 수프다.`
        + (same(s) ? ' {name이} 카드를 낚아챘다. "내 수프래! 나 이런 거 쓴 적 없는데!"' : ' {name이} 벌써 앞치마를 두르고 있었다.');
    },
    choices: [
      { label: '카드대로 함께 끓여 본다', check: { stat: 'sens', dc: 80 }, minigame: 'cooking',
        success: { effects: { 'stat.sens': +5, 'stat.hp': +2, trust: +4, 'flag.b14_recipe': true }, result: '한 숟가락 뜨자마자 아이가 고개를 갸웃했다. "처음 먹는 건데 왜 그리운 맛이지?" 당신은 대답 대신 한 그릇을 더 펐다.' },
        fail: { effects: { 'stat.sens': +2, trust: +2, stress: +3, 'flag.b14_recipe': true }, result: '수프는 조금 짰다. 아이가 연필을 가져와 카드에 한 줄을 보탰다. 「소금은 반만. — {name}」 카드의 글씨가 두 사람 몫이 되었다.' } },
      { label: '자기만의 요리법을 만들게 한다', effects: { 'stat.int': +2, 'stat.sens': +3, 'pers.ambit': +2, gold: -15 },
        result: '"남의 카드 말고 내 카드." 아이는 사흘 동안 냄비를 태웠다. 나흘째 완성된 카드에는 「{name}의 감자 수프 — {call이} 두 번째로 좋아함」이라고 적혔다.' },
      { label: '엘다에게 맛을 보인다', conditions: ['flag.met_elda'], effects: { 'rel.elda': +5, 'stat.mag': +2, 'stat.sens': +2 },
        result: '엘다가 한 숟가락을 오래 머금었다. "별 냄새가 나네요." 엘다가 카드를 뒤집었다. 뒷면에 엘다의 글씨로 「간은 아이가 보게 할 것」. 엘다는 그걸 쓴 기억이 없다고 했다.' },
      { label: '필체를 꼼꼼히 살핀다', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +4, 'stat.cult': +2, 'pers.roman': -1 },
        result: '획의 기울기, ㄹ을 한 번에 잇는 버릇. 당신이 학생들에게 가르치는 바로 그 필체였다. 당신은 이 카드의 주인을 가르친 적이 있다. 기억이 없을 뿐. 옆에서 보던 아이가 자기 ㄹ을 고쳐 쓰기 시작했다.' },
    ] },

  { id: 'b14_same_question', title: '들어 본 질문', age: [11, 14], weight: 0.9, conditions: ['legacyCount >= 1'],
    text: (s) => {
      const l = L(s), c = C(s), en = l.endingName;
      return `빨래를 개던 {name이} 수건을 반쯤 접은 채 물었다. ${c.habit} 당신의 손이 멈췄다. 똑같은 질문을, 똑같은 말투로, 똑같이 수건을 반쯤 접은 채 듣던 저녁이 있었다. 그때 뭐라고 대답했는지도 기억난다. `
        + (en ? `그 대답 끝에 펼쳐진 한 아이의 이야기, 그 제목이 「${en}」${sfx(en, '이었다는', '였다는')} 것도.` : '그 대답이 한 아이를 어디까지 데려갔는지도.');
    },
    choices: [
      { label: '그때와 같은 대답을 한다', effects: { 'pers.ambit': +3, 'pers.agree': +2, trust: +2 },
        result: '그때 했던 말을 한 글자도 틀리지 않고 했다. 아이 눈이 반짝 빛났다. 그 반짝임까지 그때와 똑같아서, 당신은 조금 무서워졌다.' },
      { label: '처음 하는 대답을 찾는다', effects: { 'pers.roman': +2, 'stat.sens': +3, trust: +3, 'pers.agree': -2 },
        result: '"모르겠어. 그러니까 같이 찾아보자." 아이가 수건을 마저 접으며 고개를 갸웃했다. "그런 대답은 처음 들어 봐." 당신에게도 처음이었다.' },
      { label: '"넌 어떻게 생각하는데?"', check: { stat: 'elo', dc: 90 },
        success: { effects: { 'stat.elo': +4, 'pers.ambit': +2, trust: +4 }, result: '아이는 한참 생각하더니 한 번도 들어 본 적 없는 대답을 했다. 길고, 엉뚱하고, 아이다운 대답. 당신은 그날 밤 그 대답을 수첩 맨 앞장에 적어 두었다.' },
        fail: { effects: { stress: +3, 'pers.extro': -2, trust: +1 }, result: '아이는 입술을 우물거리다 "몰라" 하고 수건 더미에 얼굴을 묻었다. 그것도 처음 듣는 대답이었다. 나쁘지 않았다.' } },
      { label: '문설주 눈금 앞에 세워 본다', conditions: ['flag.b14_marks'], effects: { 'stat.sens': +3, 'pers.agree': -2, 'pers.ambit': +2 },
        result: (s) => `"그 사람도 이 키일 때 똑같이 물었어?" 아이가 「${L(s).name}」 눈금 아래 자기 눈금을 손가락으로 톡톡 쳤다. "그럼 난 다른 거 할래. 똑같은 건 재미없잖아."` },
    ] },

  { id: 'b14_elda_slip', title: '엘다의 말실수', age: [11, 15], weight: 1.2, npc: 'elda', image: 'bg/elda_hut', conditions: ['legacyCount >= 1', 'flag.met_elda'],
    text: (s) => {
      const l = L(s), c = C(s);
      if (same(s)) return `엘다의 오두막. 약초를 다듬던 엘다가 {name을} 올려다보다 손을 멈췄다. "……어머, {name}. 지난번엔 저보다 키가 컸던 것 같은데요." 엘다는 스스로도 놀란 얼굴로 웃었다. "제가 무슨 소리를 하는 걸까요. ${c.elda}"`;
      return `엘다의 오두막. 말린 약초 묶음을 내밀던 엘다가 다정하게 불렀다. "${l.name}, 이것 좀 들어 줄래요?" {name이} 고개를 갸웃하자 엘다가 입을 가렸다. "어머, 미안해요. 왜 그 이름이 나왔을까. ${c.elda}"`;
    },
    choices: [
      { label: '그 아이 이야기를 더 청한다', effects: { 'rel.elda': +5, 'pers.roman': +2, 'stat.mag': +2 },
        result: '엘다는 차를 우리며 기억을 더듬었다. 기억은 자꾸 손가락 사이로 빠져나갔다. "얼굴은 생각 안 나는데, 그 아이가 웃을 때 별빛이 어느 쪽으로 튀었는지는 알아요. 꼭 {name}처럼요."' },
      { label: '못 들은 척 넘어간다', effects: { 'rel.elda': +3, stress: -3, 'pers.agree': +1 },
        result: '엘다는 고마운 듯 눈을 접어 웃었다. 그 뒤로 엘다는 아이 이름을 부르기 전에 꼭 한 번 숨을 고른다. 틀리지 않으려고.' },
      { label: '{name이} 대답하게 둔다', check: { stat: 'elo', dc: 95 },
        success: { effects: { 'stat.elo': +4, 'rel.elda': +6, trust: +2 },
          result: (s) => (same(s)
            ? '"그럼 저 앞으로 엄청 클 건가 봐요. 틀린 말은 아닐 거예요." 아이가 까치발을 들어 보였다. 엘다가 웃음을 터뜨리고는 아이를 꼭 안았다.'
            : '"그 이름 예뻐요. 헷갈려도 괜찮아요. 저도 가끔 제가 누군지 헷갈리거든요." 엘다가 웃음을 터뜨리고는 아이를 꼭 안았다.') },
        fail: { effects: { 'rel.elda': +1, stress: +4, 'pers.extro': -2 }, result: '아이는 뭐라 말할지 몰라 약초만 만지작거렸다. 오두막이 조용해졌다. 돌아오는 길에 아이가 물었다. "{call}, 나 누구랑 닮았어?"' } },
      { label: '아이 어머니와 관계있는지 묻는다', conditions: ['flag.elda_secret_1'], effects: { 'rel.elda': +3, 'stat.mag': +3, trust: +3 },
        result: '엘다가 고개를 저었다. "아니에요. 그 아이는 어머니를 닮지 않았어요." 엘다가 당신을 보며 웃었다. "이 집 사람을 닮았죠. 웃는 모양이 꼭 지금 그 얼굴이에요."' },
    ] },

  // ══ 회차가 쌓일수록: 큐브가 세는 것 ══════════════════════════════════════
  { id: 'b14_cube_counts', title: '큐브의 셈', age: [11, 16], weight: 2.2, npc: 'cube', conditions: ['playthrough >= 3'],
    text: (s) => `한밤중, 큐브가 식탁 위에 앉아 날개 빛을 깜박이고 있었다. 하나, 둘, 셋…… 깜박임이 ${native(s.playthrough || 3)}에서 멈췄다. 당신을 보자 큐브가 화들짝 떠올랐다. "주, 주인님! 안 주무세요? 저는 그냥…… 세고 있었어요. 이 집에 별이 몇 번 떨어졌는지요."`,
    choices: [
      { label: '몇 번이었냐고 묻는다', effects: { 'rel.cube': +6, gHealth: -2, 'flag.b14_cube_counted': true },
        result: (s) => {
          const names = namesOf(s);
          const line = !names.length ? '앞의 아가씨들 이름은 별빛에 다 적어 두었어요.'
            : allSame(s) ? '앞의 아가씨들도 다 {name이었}어요. 그래도 다 다른 아가씨였어요.'
            : `앞의 아가씨들 이름도 다 알아요. ${names.join(', ')}.${(s.playthrough || 3) - 1 > names.length ? ' 그보다 앞의 아가씨들도요.' : ''}`; // 기록은 다섯 명까지(MAX_LEGACY)
          return `"${ordinal(s.playthrough || 3)}예요. 이번 아가씨까지." 큐브가 날개를 접었다. "${line} 저는 잊어버리면 안 되거든요. 그게 제 일이에요."`;
        } },
      { label: '그만 세고 자라고 한다', effects: { 'rel.cube': -3, gHealth: +3, 'stat.sens': +2 },
        result: (s) => `"네, 주인님." 큐브는 순순히 불을 껐다. 아침에 보니 식탁 위에 숟가락 ${counter(s.playthrough || 3)} 개가 나란히 놓여 있었다. 하나만 반짝반짝 새것이었다. {name이} 그 숟가락을 집었다. "이거 내 거지?"` },
      { label: '{name을} 깨워 함께 본다', check: { stat: 'mag', dc: 70 },
        success: { effects: { 'stat.mag': +5, 'rel.cube': +3, trust: +3, stress: +3 },
          result: (s) => {
            const names = namesOf(s);
            return `잠이 덜 깬 아이가 손끝에 별빛을 켜자, 큐브의 날개 빛이 허공에 글씨를 남겼다. ${names.length ? `${quoted(names)}.` : '읽을 수 없는 이름들.'} 아이가 하품하며 말했다. "그럼 내가 막내네. 다음 아이가 오면 언니고."`;
          } },
        fail: { effects: { 'stat.mag': +2, 'rel.cube': +2, stress: +4 }, result: '아이는 식탁에 엎드려 도로 잠들었다. 큐브가 아이 머리맡에서 깜박임을 처음부터 다시 셌다. 이번엔 아주 천천히, 소리 없이.' } },
      { label: '문설주 이야기를 꺼낸다', conditions: ['flag.b14_cube_hint'], effects: { 'rel.cube': +6, gHealth: +2, 'flag.b14_cube_counted': true },
        result: '"그 칼자국, 제가 매번 벽지로 덮어 둬요. 새 아가씨가 놀라지 않게요." 큐브가 작게 웃었다. "그런데 이번엔 주인님이 먼저 뜯으셨네요. 그래서 조금, 아주 조금 기뻤어요."' },
    ] },

  // ══ 연쇄 ① 숲의 표식 ════════════════════════════════════════════════════
  { id: 'b14_known_trail', title: '아는 표식', age: [12, 16], weight: 2.5, image: 'bg/forest', requiresActivity: 'adventure', conditions: ['legacyCount >= 1'],
    text: (s) => `숲 깊은 곳, 길이 세 갈래로 갈라지는 자리에서 {name이} 우뚝 멈췄다. 가운데 길 어귀, ${C(s).trail}. "{call}, 나 저 표시 알아. 처음 보는데, 알아." 아이 목소리가 조금 떨렸다. 왼쪽 길에서는 물소리가, 오른쪽 길에서는 짐승 냄새가 났다. 가운데 길은 덤불에 반쯤 묻혀 있었다.`,
    choices: [
      { label: '표시를 따라 가운데 길로', check: { stat: 'agi', dc: 105 }, minigame: 'adventure',
        success: { effects: { 'stat.agi': +5, 'stat.hp': +2, 'pers.extro': +2 }, next: 'b14_trail_cache', result: '표시는 늪을 돌고 무너진 다리를 피해 정확히 이어졌다. 꼭 누군가 이 아이 보폭에 맞춰 길을 내 둔 것 같았다.' },
        fail: { effects: { 'stat.hp': -3, 'stat.agi': +2, stress: +6, 'pers.roman': +1 }, result: '덤불 속에서 표시를 놓쳤다. 긁힌 팔로 돌아 나온 아이는 갈림길을 몇 번이고 돌아보았다. 그 갈림길은 그 뒤로 아이 꿈에 자주 나왔다.' } },
      { label: '물소리 나는 왼쪽 길로', effects: { 'stat.hp': +3, 'stat.sens': +3, stress: -5, 'pers.agree': +1 },
        result: '남이 낸 길 말고 우리가 고른 길. 개울에 발을 담그고 가재를 쫓다 돌아왔다. 아이는 돌아오는 길에 딱 한 번 갈림길 쪽을 돌아보았다.' },
      { label: '오늘은 여기까지 하자고 한다', effects: { 'pers.agree': +2, 'pers.roman': -2, stress: +3, 'stat.sens': +2 },
        result: '아이는 순순히 따라왔다. 다만 그날 밤 공책 귀퉁이에 그 표시를 몇 번이고 그렸다. 지우지는 않았다.' },
      { label: '옛 모험가식으로 표식을 읽는다', conditions: ["guardian == 'adventurer'"], effects: { 'stat.int': +3, 'stat.agi': +3, trust: +3 }, next: 'b14_trail_cache',
        result: '"세 걸음마다 하나, 위험하면 두 개." 당신이 쓰던 표식 규칙 그대로였다. 당신이 가르친 적 없는 누군가가 당신 방식대로 길을 남겨 두었다. 아이가 당신 손을 꼭 잡았다.' },
    ] },
  { id: 'b14_trail_cache', title: '다음에 올 아이에게', chainOnly: true, age: [12, 16], image: 'bg/forest',
    text: (s) => {
      const l = L(s), c = C(s);
      return `표시가 끝난 곳은 바위틈의 작은 공터였다. 평평한 돌 밑에서 기름 먹인 천 꾸러미가 나왔다. 겉에 적힌 글씨. 「다음에 올 아이에게 — ${l.name}」. 풀어 보니 ${J(c.cache, '이')} 들어 있었다. {name이} 쪽지를 오래 들여다보았다. "이 사람, 내가 올 줄 알았나 봐."`;
    },
    choices: [
      { label: '꾸러미를 가져간다', effects: { gold: +60, 'pers.ambit': +2, 'stat.int': +2 },
        result: '꾸러미 바닥에서 은화 몇 닢이 더 나왔다. 집에 와서 물건을 하나씩 꺼내 보던 아이는 쪽지만 따로 일기장에 끼웠다. "물건은 쓰라고 준 거고, 이건 간직하라고 준 거야."' },
      { label: '도로 싸서 묻어 둔다', effects: { 'stat.moral': +4, 'pers.good': +2, 'pers.agree': +1 },
        result: '"이건 내 거 아니야. 다음 아이 거야." 아이는 꾸러미를 다시 싸서 돌 밑에 넣었다. 흙을 덮는 손길이 조심스러웠다.' },
      { label: '{name}의 물건도 넣어 묻는다', effects: { 'stat.sens': +4, 'pers.roman': +2, trust: +2, 'flag.b14_left_gift': true },
        result: '아이는 머리끈 하나를 풀어 꾸러미에 넣고, 쪽지 아래 한 줄을 보탰다. 「다다음에 올 아이에게 — {name}」. 묻은 자리를 두 번 두드리고서야 아이는 일어섰다.' },
      { label: '꾸러미에 남은 별빛을 읽는다', conditions: ['stat.mag >= 150'], effects: { 'stat.mag': +5, 'stat.sens': +2, 'pers.roman': +2 },
        result: '아이가 꾸러미에 손을 얹자 손끝 금빛이 일렁였다. 잠깐, 같은 공터에 쪼그려 앉은 다른 소녀가 보였다. 소녀가 고개를 들어 이쪽을 보고 웃더니, 사라졌다.' },
    ] },

  // ══ 연쇄 ② 낯익은 얼굴 (legacy_met) ════════════════════════════════════
  { id: 'b14_familiar_face', title: '낯익은 얼굴', age: [12, 15], weight: 3, image: 'bg/market', conditions: ['legacyCount >= 1', '!flag.legacy_met'],
    text: (s) => `장날 광장. 사람들 사이로 걸어오던 한 여자가 {name} 앞에서 우뚝 멈췄다. ${C(s).look} 은백색 머리에 붉은 눈, 스물여덟쯤 되었을까. 여자는 아이를 한참 내려다보다 고개를 들어 당신을 보았다. "……${inHerVoice(s, '{call}')}?" 그러고는 제 입을 가렸다. "죄송해요. 아는 분이랑 너무 닮으셔서."`,
    choices: [
      { label: '차라도 한잔하자고 청한다', effects: { trust: +2, 'stat.eti': +2, 'flag.b14_saw_her': true }, next: 'b14_her_tea',
        result: (s) => `여자는 잠깐 망설이다 고개를 끄덕였다. "${cop(L(s).name, '이에요', '예요')}. 제 이름." ` + (same(s) ? '{name이} 당신 소매를 꽉 쥐었다. 이름이 같았다.' : '{name이} 그 이름을 입속으로 따라 불렀다. 처음 듣는데 혀에 익은 이름이었다.') },
      { label: '{name이} 먼저 인사하게 한다', check: { stat: 'chm', dc: 100 },
        success: { effects: { 'stat.chm': +3, 'stat.elo': +3, 'pers.extro': +2, 'flag.b14_saw_her': true }, next: 'b14_her_tea',
          result: (s) => `"안녕하세요! 우리 {call} 아세요?" 여자가 웃음을 터뜨렸다. 웃는 모양이 아이와 똑같았다. "아는 것 같아. 아니, 알았던 것 같아. 나는 ${cop(L(s).name, '이야', '야')}."` },
        fail: { effects: { stress: +4, 'pers.extro': -2, 'flag.b14_saw_her': true },
          result: '아이는 당신 등 뒤로 숨어 버렸다. 여자는 허리를 숙여 눈을 맞추려다 그만두었다. "괜찮아. 나도 그 나이엔 그랬어." 여자는 인파 속으로 사라졌다.' } },
      { label: '모르는 척 지나간다', effects: { 'stat.sens': +2, 'pers.extro': -2, stress: +2, 'flag.b14_saw_her': true },
        result: '여자는 붙잡지 않았다. 다만 멀어지는 {name}의 뒷모습을, 당신이 아이를 볼 때와 똑같은 눈으로 오래 바라보았다.' },
      { label: '{name}에게 맡긴다', conditions: ['trust >= 55'], effects: { trust: +3, 'pers.extro': +2, 'pers.agree': -1, 'flag.b14_saw_her': true }, next: 'b14_her_tea',
        result: '아이는 당신을 한 번 올려다보더니 여자에게 다가가 손을 내밀었다. "언니, 우리 집 알아? 같이 갈래?" 여자가 그 손을 잡았다. 손이 조금 떨렸다. "응. 알 것 같아."' },
    ] },
  { id: 'b14_her_tea', title: '처음 와 본 집', chainOnly: true, age: [12, 17],
    text: (s) => {
      return `${J(her(s), '은')} 문턱을 넘다 말고 문설주를 손바닥으로 쓸어 보았다. 삐걱대는 셋째 계단, 창가 의자, 찬장 맨 안쪽. 처음 온 집을 그녀는 눈으로 하나씩 짚어 갔다. 찻주전자를 들고 오던 큐브가 공중에서 딱 굳었다.`;
    },
    choices: [
      { label: '{name이} 마음껏 묻게 둔다', effects: { 'stat.elo': +3, 'pers.extro': +2, 'stat.sens': +2 }, next: 'b14_her_keepsake',
        result: (s) => `질문이 쏟아졌다. 그녀는 하나도 귀찮아하지 않았다. 마지막 질문은 "언니처럼 되려면 어떻게 해?"였다. 그녀는 거기서만 잠깐 생각했다. ${C(s).advice}` },
      { label: '그녀의 이야기를 청한다', effects: { 'stat.cult': +3, 'pers.ambit': +2, 'pers.roman': +1 }, next: 'b14_her_keepsake',
        result: (s) => {
          const en = L(s).endingName;
          const title = L(s).cat === '어둠' ? ' "제 이야기에 제목을 붙인다면……." 그녀는 말끝을 흐리며 웃었다.'
            : en ? ` "제 이야기에 제목을 붙인다면 「${en}」${sfx(en, '이에요', '예요')}."` : '';
          return `그녀는 찻잔을 두 손으로 감쌌다.${title} ${C(s).life}`;
        } },
      { label: '그 호박 수프를 내놓는다', conditions: ['flag.b14_recipe'], effects: { trust: +4, 'stat.sens': +3, stress: -5 }, next: 'b14_her_keepsake',
        result: '수프를 한 숟가락 뜬 그녀가 숟가락을 내려놓았다. 한참 뒤에야 말했다. "……내가 끓이던 거랑 똑같아. 아니, 조금 더 맛있다." 그녀는 한 그릇을 다 비웠다.' },
      { label: '{name이} 손끝 별빛을 보여 준다', conditions: ['flag.magic_awake'], effects: { 'stat.mag': +4, 'pers.roman': +2, 'rel.cube': +2 }, next: 'b14_her_keepsake',
        result: (s) => (isCat('학문/마법', '히든')(s)
          ? '그녀도 손끝에 별을 띄웠다. 두 별빛이 같은 박자로 깜박이다가 하나로 겹쳤다. 큐브가 찻잔을 떨어뜨렸다. 이번엔 정말로.'
          : '그녀도 손끝을 내밀어 보았다. 빛은 나오지 않았다. "나도 예전엔 됐는데. 다른 걸 하느라 잊어버렸어." 그녀는 하나도 아쉽지 않은 얼굴로 웃었다.') },
    ] },
  { id: 'b14_her_keepsake', title: '언니의 선물', chainOnly: true, age: [12, 17],
    text: (s) => {
      const l = L(s), c = C(s);
      const closing = l.endingId === 'drifter' ? '"이 아이는 천천히 보내 주세요. 저는 너무 일찍 떠났거든요."'
        : l.endingId === 'family_home' ? '"잘 키워 주세요. 저는 집을 떠나지 않는 쪽을 골랐는데, 그것도 좋은 길이었어요."'
        : l.cat === '어둠' ? '"잘 키워 주세요. 저는 길을 좀 돌아왔거든요. 그래도 나쁘진 않았어요."'
        : l.cat === '히든' ? '"잘 키워 주세요. 저는 아주 멀리까지 잘 갔거든요."'
        : '"잘 키워 주세요. 저는…… 잘 자랐거든요."';
      return `해가 기울자 ${J(her(s), '이')} 일어섰다. 문간에서 그녀는 {name}의 손바닥을 펴게 하고 ${J(c.token, '을')} 올려 주었다. "내가 너만 할 때 가지고 있던 거야. 아니, 가지고 있었던 것 같아." 그러고는 당신을 돌아보았다. ${closing}`;
    },
    choices: [
      { label: '고맙게 받는다', effects: { 'flag.legacy_met': true, 'stat.sens': +3, 'stat.eti': +2, trust: +2 },
        result: (s) => `${inHerVoice(s, C(s).tokenLine)} {name이} 그것을 두 손으로 꼭 쥐었다. 그날 밤 아이는 그것을 베개 밑에 넣고 잤다.` },
      { label: '{name이} 답례 인사를 하게 한다', check: { stat: 'eti', dc: 100 },
        success: { effects: { 'flag.legacy_met': true, 'stat.eti': +4, 'stat.chm': +2, 'pers.ambit': +1 }, result: '아이는 치맛자락을 살짝 잡고 허리를 숙였다. 흠잡을 데 없는 인사였다. 그녀가 눈을 동그랗게 떴다. "어디서 배웠어? 나는 그거 열여섯에야 겨우 했는데."' },
        fail: { effects: { 'flag.legacy_met': true, 'stat.sens': +3, stress: -4 }, result: '인사를 하려던 아이가 와락 그녀 품에 안겨 버렸다. 자기도 왜 그러는지 모르는 얼굴이었다. 그녀는 아이 등을 오래 토닥였다. 인사보다 나았다.' } },
      { label: '또 오라고 한다', effects: { 'flag.legacy_met': true, 'pers.roman': +2, stress: -4, 'stat.elo': +2 },
        result: '"올 수 있으면요. 길이 자꾸 바뀌어서." 문을 나서던 그녀가 돌아보았다. "그래도 이 집으로 오는 길은 안 바뀌더라고요." 따라 나가 보니 길에는 아무도 없었다.' },
      { label: '별 머리핀을 답례로 건넨다', conditions: ['item.silver_hairpin >= 1'], effects: { 'flag.legacy_met': true, trust: +4, 'stat.moral': +4, 'pers.good': +2 },
        result: '아이가 별 머리핀을 빼 그녀의 은백색 머리에 꽂아 주었다. 그녀는 창유리에 비춰 보고 웃더니, 핀을 도로 아이 머리에 꽂았다. "이건 네 거야. 나는 한 번 해 본 걸로 충분해."' },
    ] },

  // ══ 기시감 ══════════════════════════════════════════════════════════════
  { id: 'b14_dream_life', title: '나보다 큰 나', age: [13, 16], weight: 0.9, conditions: ['legacyCount >= 1'],
    text: (s) => {
      const l = L(s), c = C(s), en = romantic(l) && s.age < 16 ? '' : l.endingName;
      return `아침 식탁에서 {name이} 빵을 든 채 멍하니 있었다. "꿈을 꿨어. ${c.dream}. 근데 그게 나였어. 나보다 훨씬 큰 나.${en ? ` 꿈 끝에 누가 책을 덮으면서 그랬어. 이 이야기 제목은 「${en}」${sfx(en, '이라고', '라고')}.` : ''}" 아이가 빵을 내려놓았다. "{call}, 꿈에서 본 사람이 되고 싶어지는 거, 이상한 거야?"`;
    },
    choices: [
      { label: '되고 싶으면 되어 보라고 한다', effects: { 'pers.ambit': +3, trust: +3, stress: -3 },
        result: (s) => `아이 눈빛이 단단해졌다. 그날 아이는 ${C(s).dreamStep}` },
      { label: '꿈은 꿈일 뿐이라고 한다', effects: { 'pers.roman': -3, 'stat.int': +3, trust: -1 },
        result: (s) => `아이는 고개를 끄덕였다. 그런데 빵을 다 먹고 일어서며 작게 말했다. "그래도 그 사람, ${L(s).cat === '어둠' || L(s).endingId === 'drifter' ? '조금 외로워 보였어. 그래서 자꾸 생각나.' : '행복해 보였어.'}"` },
      { label: '꿈을 글로 남겨 보게 한다', check: { stat: 'sens', dc: 140 },
        success: { effects: { 'stat.sens': +5, 'stat.cult': +3, 'pers.roman': +2 }, result: '아이는 꿈을 세 장에 걸쳐 적었다. 다 쓰고 읽어 보더니 고개를 저었다. "이건 그 사람 이야기네. 내 건 아직 안 썼어." 아이는 네 번째 장을 비워 두었다.' },
        fail: { effects: { 'stat.sens': +2, stress: +3, 'pers.roman': +1 }, result: '쓰려고 할 때마다 꿈이 흩어졌다. 아이는 첫 줄만 몇 번이고 고쳐 썼다. 「나보다 큰 내가」. 거기서 더 나아가지 못했다.' } },
      { label: '그 언니 이야기를 꺼낸다', conditions: ['flag.legacy_met'], effects: { 'stat.sens': +3, trust: +4, 'pers.agree': -2, 'pers.ambit': +1 },
        result: (s) => `"꿈속 그 사람, ${L(s).name} 언니였을까?" 아이가 빵을 다시 집었다. "그럼 나는 다른 꿈 꿔도 되겠다. 그건 언니가 벌써 해 봤으니까." 아이가 빵을 크게 베어 물었다.` },
    ] },

  { id: 'b14_floor_box', title: '마루 밑 상자', age: [13, 16], weight: 2.5, conditions: ['playthrough >= 4'],
    text: (s) => {
      const ls = legacyOf(s).slice(0, 5);
      const list = ls.length ? `안에는 이름표가 붙은 물건이 ${counter(ls.length)} 개. ${ls.map((l, i) => `${l.name}의 ${C(s, i).tokenShort}`).join(', ')}.` : '안에는 낡은 물건 몇 개와, 글씨가 다 바랜 이름표들.';
      return `셋째 계단 밑 마룻장 하나가 들떠 있었다. 못을 뽑자 먼지 앉은 나무 상자가 나왔다. 뚜껑 안쪽에 칼로 새긴 글씨. 「이 집 아이들의 것」. ${list} {name이} 상자 앞에 무릎을 꿇었다. "다 다른 사람 건데, 다 우리 집 냄새가 나."`;
    },
    choices: [
      { label: '{name}의 물건도 하나 넣게 한다', effects: { trust: +4, 'stat.sens': +4, 'pers.roman': +2 },
        result: '아이는 한참 고민하다 손때 묻은 공책 한 권을 골랐다. 이름표에 또박또박 썼다. 「{name}」. 뚜껑을 닫으며 아이가 속삭였다. "다음 사람, 안녕."' },
      { label: '물건마다 이야기를 지어 보게 한다', check: { stat: 'cult', dc: 115 },
        success: { effects: { 'stat.cult': +5, 'stat.int': +3, stress: -4, 'pers.roman': +2 },
          result: (s) => {
            const l = L(s), en = l.endingName;
            return `아이는 물건을 하나씩 들고 주인 이야기를 지었다. ${l.name}의 ${C(s).tokenShort} 차례에서 아이가 말했다. "이 사람 이야기는 제목이 ${en ? `「${en}」일` : '아주 멀리 간 사람일'} 거야." 당신은 아무 말도 하지 못했다. 맞았으니까.`;
          } },
        fail: { effects: { 'stat.cult': +2, stress: +3, 'pers.roman': +1 }, result: '이야기는 자꾸 엉뚱한 데로 흘렀다. 물건들이 용이 되고 공주가 되었다. 깔깔 웃던 아이가 문득 조용해졌다. "근데 진짜 이야기는 우리가 모르는 거지?"' } },
      { label: '그대로 덮어 둔다', effects: { 'stat.moral': +3, 'pers.agree': +2, 'pers.roman': -1 },
        result: '"남의 상자잖아." 아이가 먼저 뚜껑을 닫았다. 마룻장을 다시 박은 뒤로, 아이는 셋째 계단을 지날 때마다 발소리를 죽였다. 누가 깰까 봐.' },
      { label: '큐브를 부른다', conditions: [cubeConfides], effects: { 'rel.cube': +5, 'stat.mag': +3, 'stat.int': +2 },
        result: '큐브가 상자를 보더니 날개를 축 늘어뜨렸다. "들켰네요. 제가 만든 상자예요. 처음엔 하나도 안 들어 있었는데……." 큐브가 상자 모서리를 쓸었다. "이제 조금 무거워요. 좋은 쪽으로요."' },
    ] },

  { id: 'b14_borrowed_name', title: '남의 이름표', age: [14, 17], weight: 1, conditions: ['legacyCount >= 1'],
    text: (s) => {
      const l = L(s);
      return `요즘 이상한 일이 이어진다. ${C(s).rumor} 오늘만 벌써 세 번째다. {name이} 당신 소매를 당겼다. "{call}, 다들 나를 누구랑 헷갈려.${same(s) ? ' 이름까지 같대.' : ` ${cop(l.name, '이래', '래')}.`}"`;
    },
    choices: [
      { label: '그 평판을 빌려 써 본다', conditions: [notCat('어둠')], effects: { reputation: +4, gold: +40, 'pers.good': -2, 'pers.ambit': +2 },
        result: (s) => C(s).borrow },
      { label: '그 소문을 이용해 본다', conditions: [isCat('어둠')], effects: { infamy: +5, gold: +60, 'pers.good': -3, 'stat.elo': +2 },
        result: (s) => C(s).borrow },
      { label: '"저는 {name이에요}."', check: { stat: 'elo', dc: 150 },
        success: { effects: { 'stat.elo': +4, 'pers.ambit': +2, reputation: +2, trust: +2 }, result: '아이가 또박또박 제 이름을 댔다. 사람들은 머쓱해하다 이내 그 이름으로 아이를 불렀다. 돌아오는 길, 아이는 자기 이름을 몇 번이고 소리 내어 불렀다. 맛있는 걸 먹듯이.' },
        fail: { effects: { stress: +5, 'stat.elo': +2, 'pers.extro': -2 },
          result: (s) => `아무리 말해도 사람들은 고개만 끄덕이고 ${L(s).name} 이야기를 계속했다. 집에 오자마자 아이는 거울 앞에 섰다. "나는 {name이야}. 알지?" 거울 속 아이가 고개를 끄덕였다.` } },
      { label: '그날 장터의 여자를 찾아 나선다', conditions: ['flag.b14_saw_her', '!flag.legacy_met'], effects: { 'pers.extro': +2, 'stat.elo': +2, gHealth: -2 }, next: 'b14_her_tea',
        result: (s) => `수소문 끝에 항구 여관 이 층에서 그녀를 찾았다. 문을 연 ${J(her(s), '이')} {name을} 보고 웃었다. "올 줄 알았어. 아니, 오길 바랐어." 그녀가 외투를 챙겨 들었다.` },
    ] },

  { id: 'b14_guardian_dream', title: '다른 아이의 꿈', age: [12, 16], weight: 0.8, guardian: true, conditions: ['playthrough >= 2'],
    text: (s) => `꿈에서 당신은 이 집 부엌에 서 있었다. 식탁 맞은편에서 다 자란 아이가 짐을 꾸리고 있었다. ${!has(s) ? '이름이 떠오르지 않는 아이.' : same(s) ? '이름은 {name이었}다. 지금 이 아이와 같은.' : `이름은 ${cop(L(s).name, '이었다', '였다')}.`} ${inHerVoice(s, C(s).farewell)} 눈을 뜨니 새벽이었다. 젖은 베개를 뒤집는데 문틈으로 {name이} 들여다보았다. "{call}, 울었어?"`,
    choices: [
      { label: '꿈 이야기를 들려준다', effects: { trust: +5, 'stat.sens': +3, 'pers.roman': +2 },
        result: '아이는 이불을 끌고 와 옆에 앉아 끝까지 들었다. "그 언니, 좋겠다. {call이} 울 만큼 보고 싶어 하잖아." 아이가 당신 어깨에 머리를 기댔다. "나 갈 때도 울어 줘. 조금만."' },
      { label: '아무것도 아니라고 둘러댄다', effects: { gHealth: -3, 'stat.moral': +2, 'pers.extro': -1 },
        result: '아이는 더 묻지 않았다. 대신 부엌에 가서 따뜻한 우유를 데워 왔다. 당신이 다 마실 때까지 아이는 옆에서 꾸벅꾸벅 졸았다.' },
      { label: '말없이 꼭 안아 준다', effects: { trust: +3, stress: -6, gHealth: +2, 'stat.sens': +2 },
        result: '아이는 영문도 모른 채 안겼다. "왜 이래, 숨 막혀." 그래도 놓아 달라고는 하지 않았다. 창밖이 밝아 올 때까지.' },
      { label: '"그 언니가 꿈에 나왔어."', conditions: ['flag.legacy_met'], effects: { trust: +4, 'stat.sens': +4, 'pers.roman': +2 },
        result: (s) => `"${L(s).name} 언니?" 아이 눈이 커졌다. "좋겠다. 나도 꿈에서 만나고 싶다." 아이는 그날 밤 일부러 일찍 잤다. 아침에 물으니 만났다고 했다. 무슨 이야기를 했는지는 비밀이라고 했다.` },
    ] },

  // ══ 연쇄 ③ 자매들 (legacyCount >= 2, legacy_met) ════════════════════════
  { id: 'b14_sisters_letter', title: '막내에게', age: [16, 17], weight: 3.5, conditions: ['legacyCount >= 2'],
    text: (s) => {
      const a = L(s, 0), b = L(s, 1);
      const from = a.name === b.name ? `보낸 이는 둘 다 ${cop(a.name, '이었다', '였다')}.` : `보낸 이는 ${a.name}, 그리고 ${b.name}.`;
      return `우편 마차가 편지 두 통을 두고 갔다. 받는 이는 똑같이 「평원 끝 집의 막내에게」. ${from} 필체도 종이도 다른 두 편지에 같은 말이 적혀 있었다. 「세 달이 나란히 뜨는 밤, 별이 떨어졌던 들판에서 기다릴게.」`
        + (s.flags?.legacy_met ? ' 첫 번째 편지의 글씨는 낯이 익었다.' : '')
        + ' {name이} 편지 두 장을 나란히 펼쳤다. "{call}, 나 막내래."';
    },
    choices: [
      { label: '함께 들판에 나간다', effects: { trust: +4, gHealth: -2, 'pers.extro': +1 }, next: 'b14_sisters_field',
        result: '등불 두 개를 챙겼다. 아이는 가는 내내 편지를 품에 넣고 한 번도 꺼내 보지 않았다. 외울 만큼 읽었으니까.' },
      { label: '{name} 혼자 보내 준다', conditions: ['trust >= 50'], effects: { trust: +5, 'pers.extro': +2, 'pers.ambit': +1 }, next: 'b14_sisters_field',
        result: '아이는 등불을 들고 혼자 나섰다. 창가에서 지켜보니 등불이 들판 한가운데서 멈췄고, 곁으로 다른 불빛 둘이 다가왔다. 당신은 외투를 걸치고 천천히 뒤따랐다.' },
      { label: '위험하다며 못 가게 한다', effects: { trust: -6, stress: +6, 'pers.agree': -3, 'flag.b14_forbade': true }, next: 'b14_sisters_field',
        result: '"모르는 사람들이잖아." 아이는 대답 대신 편지를 접었다. 그날 밤 아이 방 창문이 한 뼘 열려 있었다. 당신은 외투를 걸치고 들판으로 뛰었다.' },
      { label: '답장만 써서 보낸다', effects: { 'stat.cult': +3, 'stat.elo': +2, 'pers.extro': -2 },
        result: '아이는 밤새 답장 두 통을 썼다. 보낼 주소가 없다는 건 아침에야 알았다. 아이는 편지를 들판 한가운데 돌 밑에 두고 왔다. 다음 날 가 보니 편지는 없었다.' },
    ] },
  { id: 'b14_sisters_field', title: '별이 떨어졌던 들판', chainOnly: true, age: [16, 17], image: 'bg/starnight',
    text: (s) => {
      const ca = C(s, 0), cb = C(s, 1);
      const extra = legacyOf(s).slice(2).map(l => l.name);
      const third = !extra.length ? '' : extra.length === 1 ? ` 가장자리엔 주인 없는 등불이 하나 더 타고 있었다. 이름표는 「${extra[0]}」.`
        : ` 가장자리엔 주인 없는 등불이 ${counter(extra.length)} 개 더 타고 있었다. 이름표는 ${extra.every(n => n === extra[0]) ? `모두 「${extra[0]}」` : quoted(extra)}.`;
      // 이름이 겹치면 '작은언니·큰언니'로 부른다 — 별명을 소개하기 전에는 차림으로만 가리킨다
      const clash = pairClash(s);
      const [p0, p1] = clash ? ['한 사람은', '다른 한 사람은'] : [J(sis(s, 0), '은'), J(sis(s, 1), '은')];
      const looks = ca.lookShort === cb.lookShort ? `둘 다 ${ca.lookShort}였다.` : `${p0} ${ca.lookShort}였고, ${p1} ${cb.lookShort}였다.`;
      const names = !clash ? '' : (legacyOf(s).slice(0, 2).every(l => l.name === s.name) ? ' 셋 다 이름이 같았다. 아무도 놀라지 않았다.' : ' 이름이 겹쳐서')
        + ' {name은} 둘을 작은언니, 큰언니라 부르기로 했다.';
      return (s.flags?.b14_forbade ? '숨을 몰아쉬며 들판에 닿았을 때, {name은} 이미 거기 있었다.' : '들판 한가운데.')
        + ` 나란히 뜬 세 달 아래 두 여자가 서 있었다. ${looks} 처음 보는 사이인 둘이 {name을} 보고 똑같이 웃으며 말했다. "……셋째 계단, 아직도 삐걱거려?"${names}${third}`;
    },
    choices: [
      { label: '셋이 이야기하게 비켜 준다', effects: { 'flag.legacy_met': true, 'pers.extro': +3, 'stat.elo': +3, trust: +3 }, next: 'b14_sisters_dawn',
        result: '당신은 조금 떨어진 둔덕에 앉았다. 바람결에 웃음소리가 실려 왔다. 셋째 계단, 이 빠진 찻잔, 큐브의 잔소리. 같은 집 이야기를 세 사람이 서로 다른 순서로 기억하고 있었다.' },
      { label: '넷이 둘러앉는다', effects: { 'flag.legacy_met': true, trust: +4, 'stat.sens': +3, gHealth: -2 }, next: 'b14_sisters_dawn',
        result: (s) => `넷이 등불을 가운데 두고 둘러앉았다. 두 사람은 당신에게 존댓말을 쓰다가 자꾸 말끝이 풀렸다. 결국 ${J(sis(s, 1), '이')} 웃음을 터뜨렸다. "안 되겠다. 그냥 편하게 할게요. 아니, 할게."` },
      { label: '숲속 꾸러미 이야기를 꺼낸다', conditions: ['flag.b14_left_gift'], effects: { 'flag.legacy_met': true, 'stat.sens': +4, 'pers.roman': +3 }, next: 'b14_sisters_dawn',
        result: (s) => `${J(sis(s, 0), '이')} 주머니에서 머리끈 하나를 꺼냈다. "이거, 네 거지? 내 꾸러미에 언제부턴가 들어 있더라." {name이} 입을 막았다. 숲에 묻어 둔 바로 그 머리끈이었다.` },
      { label: '당신의 자장가를 흥얼거린다', conditions: ['flag.b14_lullaby'], effects: { 'flag.legacy_met': true, 'stat.sens': +4, stress: -8 }, next: 'b14_sisters_dawn',
        result: '당신이 첫 소절을 흥얼거리자 두 사람이 동시에 둘째 소절을 이었다. {name이} 셋째 소절을 불렀다. 마지막 소절은 넷이 함께였다. 나란히 뜬 세 달이 조금 더 가까워진 것 같았다.' },
    ] },
  { id: 'b14_sisters_dawn', title: '해 뜨기 전에', chainOnly: true, age: [16, 17], image: 'bg/wheat_field',
    text: (s) => {
      return `밤이 하얗게 샜다. 두 사람은 해가 뜨기 전에 가야 한다고 했다. 어디로 가는지는 둘 다 설명하지 못했다. ${J(sis(s, 0), '이')} {name}의 머리칼을 귀 뒤로 넘겨 주었다. "우린 각자 다른 길로 갔어. 너도 그래도 돼. 아니, 그래야 해." ${J(sis(s, 1), '이')} 덧붙였다. ${C(s, 1).advice}`;
    },
    choices: [
      { label: '별의 밤마다 같은 하늘을 보자', effects: { 'flag.b14_sisters': true, trust: +3, 'pers.roman': +3, stress: -4 },
        result: '"약속." 새끼손가락 넷이 걸렸다. 해가 떠오르자 두 사람은 빛 속으로 옅어졌다. 이슬 젖은 풀 위에 발자국이 넷 남았다. 둘은 들판 바깥으로, 둘은 집 쪽으로.' },
      { label: '집에 같이 가자고 붙잡는다', effects: { 'flag.b14_sisters': true, stress: +5, 'pers.roman': +2, gHealth: -2 },
        result: (s) => `${J(sis(s, 0), '이')} 당신 손을 가만히 내려놓았다. "그 집은 이제 {name} 거예요." 그 말에 {name이} 울음을 터뜨렸다. 기뻐서인지 슬퍼서인지 아이도 몰랐다.` },
      { label: '{name}에게 먼저 사과한다', conditions: ['flag.b14_forbade'], effects: { 'flag.b14_sisters': true, trust: +6, 'pers.agree': +2 },
        result: '"어젯밤엔 미안했어. 무서웠어." 아이가 당신을 한참 보다가 손을 잡았다. "나도 무서웠어. 그래도 와 줬잖아." 두 언니가 서로를 보며 웃었다.' },
      { label: '세 아이를 축복해 준다', conditions: ["guardian == 'priest'"], effects: { 'flag.b14_sisters': true, 'stat.faith': +5, 'stat.moral': +3, trust: +3 },
        result: '당신은 세 사람의 이마에 차례로 손을 얹었다. 기도는 짧았다. "어디로 가든, 돌아올 데가 있기를." 두 언니가 기도의 끝말 대신 "다녀올게"라고 대답했다.' },
    ] },

  { id: 'b14_extra_stars', title: '늘어난 별', age: [14, 17], weight: 1.2, image: 'bg/starnight', conditions: ['legacyCount >= 2'],
    text: (s) => {
      const ls = legacyOf(s).slice(0, 5);
      const colors = ls.map((l, i) => `하나는 ${C(s, i).color}`).join(', ');
      return `맑은 밤, 지붕 위에서 {name이} 손가락으로 하늘을 짚었다. "{call}, 큰달 옆에 작은 별들 말이야. 작년엔 없었어." 정말이었다. 큰달 곁에 별 ${J(native(ls.length || 2), '이')} 나란히 떠 있었다.${colors ? ` ${colors}.` : ''} 지붕 끝에 앉은 큐브가 아무 말도 하지 않았다. 큐브가 말이 없는 건 드문 일이다.`;
    },
    choices: [
      { label: '별마다 이름을 붙여 보게 한다', effects: { 'stat.sens': +4, 'pers.roman': +3, trust: +2 },
        result: (s) => (allSame(s)
          ? '아이는 별들에게 모두 자기 이름을 붙였다. "다 나 같아서." 당신은 아무 말도 하지 못했다. 큐브가 아주 작게 깜박였다.'
          : `아이는 별을 하나씩 짚으며 이름을 붙였다. ${quoted(namesOf(s).slice(0, 5))}. 당신은 숨을 삼켰다. 한 번도 가르쳐 준 적 없는 이름들이었다. "왜? 그냥 떠올랐어."`) },
      { label: '별의 자리를 기록해 두게 한다', check: { stat: 'int', dc: 150 }, minigame: 'exam',
        success: { effects: { 'stat.int': +6, 'stat.mag': +3, 'pers.ambit': +2 }, result: '아이는 석 달 동안 밤마다 별자리를 적었다. 결론은 이상했다. 별들은 움직이지 않았다. 세 달이 별들 쪽으로 다가가고 있었다. 인사하러 가는 것처럼.' },
        fail: { effects: { 'stat.int': +2, stress: +4, 'pers.roman': +1 }, result: '기록은 매일 달랐다. 아이는 공책을 덮고 투덜거렸다. "가만히 있질 않아. 꼭 누가 장난치는 것 같아." 별 하나가 대답하듯 깜박였다.' } },
      { label: '옛 관측 공책을 펼쳐 본다', conditions: ['flag.star_watching'], effects: { 'stat.int': +4, 'stat.mag': +2, 'pers.roman': -1 },
        result: '몇 년 전 아이가 그린 별 지도에 이유 없이 비워 둔 자리들이 있었다. 지금 별들이 떠 있는 바로 그 자리였다. 아이가 공책을 끌어안았다. "비어 있던 게 아니었구나. 기다린 거구나."' },
      { label: '들판의 그 밤을 떠올린다', conditions: ['flag.b14_sisters'], effects: { trust: +4, stress: -6, 'stat.sens': +3 },
        result: '"저기, 그 언니들이지?" 아이가 별 옆의 빈자리를 가리켰다. "그럼 저 옆자리는 내 거네. 아직은 비워 둘래." 아이가 당신 어깨에 기대 하품을 했다. "아직은 여기 있을 거니까."' },
    ] },
];
