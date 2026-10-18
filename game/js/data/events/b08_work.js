// 배치 b08 — 아르바이트: 농장·식당·여관·교회·재봉소·대장간·성 청소·묘지기·상점·극단 (10~17세)
// 규칙: docs/game-design/content-contract.md  (id·비공개 플래그 접두사 b08_)
// 랜덤 이벤트는 모두 requiresActivity로 그 일을 한 달에만 등장한다. 예외 하나: night_mud(엔진의 secret_night_work 회수).
//
// 공용 플래그 세팅: ghost_friend(묘지의 유령 친구 → b04b 영매 연쇄 · 엔딩 영매) · stage_star(극단 스타 추가 경로 3곳)
// 공용 플래그 읽기: met_elda · met_leon · has_cat · magic_awake · stranger_asked · secret_night_work(엔진)  + seen.leon_truth
// 비공개 플래그: b08_burnt_pie(탄 파이 → farm_plot) · b08_miel_friend(아역 미엘과 우정 → theater_tour)
//               · b08_ghost_forbidden(보호자가 묘지 일을 막음 → 유령 길이 닫힘)
// 연쇄(chainOnly, ⇒):
//   ① 유령 친구  grave_lantern ⇒ grave_girl ⇒ grave_promise [ghost_friend]
//                 (재기회: grave_diggers '푸른 등불'[에피를 만났거나 친구인 아이] · 자율 묘지기 경로: night_mud)
//   farm_plot(13~16)은 b04a_farm_field(16~17, 밭 세 마지기)보다 먼저 오도록 !seen 조건을 둔다.
//   ② 대역      theater_understudy ⇒ theater_curtain [stage_star]   (+ theater_tour)
//   ③ 깨진 꽃병  castle_vase ⇒ castle_hearing   (아이에게 누명을 씌운 집사장 응징)
//   ④ 밤의 장부  shop_trial ⇒ shop_ledger       (무급 견습·도둑 누명 → 증명)
// 일하는 아이를 착취하는 어른 — 모두 응징 경로 + 보호자 개입 선택지가 있다:
//   감독관 퀸트(farm_scale) · 부제 세드릭(church_coins) · 집사장 모르텐(castle_vase/hearing) · 저택 집사(inn_attic)
//   · 잡화점 구스타(shop_coin/shop_trial/shop_ledger) · 회계 바르톨(theater_wages)
// 미니게임(판정 24개 중 6개): 요리 diner_soup·diner_pie·inn_storm · 모험 grave_diggers · 시험 shop_ledger · 무도회 theater_curtain
// 엔딩 지원: 요리사(식당 — 감수성·체력) · 여관 주인(여관 — 매력·화술) · 농장주(농장 — 체력·근력·엘다) · 의상 명인(재봉 — 감수성·교양)
//           · 명장(대장간 — 근력) · 영매(ghost_friend) · 극단 스타(stage_star·매력)
// 보조 인물(관계 수치 없음): b04a와 공유 — 한스 아저씨(농장) · 고든 아저씨(식당) · 「세 개의 달」 노부부(여관) · 베라 할머니(재봉소)
//   · 도르완 영감(대장간, 네리의 할아버지). b02 — 네리 · 방앗간 오토 할아버지.
//   b08 신규 — 홉 영감(묘지기) · 에피(밀가루 앞치마의 유령, 항구 빵집 언니를 둔 소녀 → b04b ghost_message와 이어짐)
//   · 미엘(극단 아역) · 키라(견습 하녀) · 로이(일곱 살) · 아르노 할아버지(식당 단골 노병)
// 공주의 결: character-design.md v2 — 은백색 생머리, 차분하고 조금 나른한 붉은 눈, 감정이 일렁이면 금빛 별이 새어 나온다.
//   일터에서도 호들갑 대신 담담하게, 그러나 끝까지 지켜보는 아이로 그린다.
export default [
  // ══ 농장 (한스 아저씨) ═════════════════════════════════════════════════════
  {
    id: 'b08_farm_eggs', title: '모자란 달걀', age: [10, 12], weight: 1.8, requiresActivity: 'farm', image: 'bg/wheat_field',
    text: `한스 아저씨네 닭장에서 달걀이 자꾸 모자란다. 새벽에 모이를 주러 간 {name이} 범인을 봤다. 방앗간 뒤 오두막에 사는 일곱 살 로이였다. 저녁에 {name이} 졸린 눈을 비비며 말했다. "{call}, 로이 동생이 아프대. 아저씨한테 말해야 해?"`,
    choices: [
      { label: '아저씨께 사실대로 말하렴', effects: { 'stat.moral': +4, 'pers.good': +2, stress: +3 },
        result: `한스 아저씨는 로이를 불러 크게 혼냈다. 그러고는 달걀 한 꾸러미를 들려 보냈다. 로이는 그 뒤로 {name을} 보면 길을 돌아갔다. {name은} 그게 오래 마음에 걸렸다.` },
      { label: '네 품삯으로 달걀값을 치르자', effects: { gold: -30, 'stat.sens': +3, 'stat.moral': +3, 'pers.roman': +2 },
        result: `{name은} 품삯 주머니에서 동전을 세어 작은 자루에 담아 닭장 문고리에 걸어 두었다. 한스 아저씨는 다 알면서 모르는 척했다. 다음 날 {name}의 바구니에 달걀 두 알이 더 들어 있었다.` },
      { label: '로이를 일꾼으로 소개해 봐', check: { stat: 'elo', dc: 60 },
        success: { effects: { 'stat.elo': +5, reputation: +3, 'pers.extro': +2 },
          result: `"닭 모이는 로이가 저보다 잘 줘요." 한스 아저씨가 껄껄 웃었다. 로이는 이제 아침마다 달걀을 줍고, 그중 두 알을 품삯으로 받아 간다.` },
        fail: { effects: { 'stat.elo': +2, stress: +5, 'pers.extro': -1 },
          result: `"일곱 살한테 무슨 일을 시켜." 한스 아저씨는 고개를 저었다. 엿듣던 로이는 달아나 버렸다. 닭장 달걀은 그 뒤로도 가끔 모자랐다.` } },
      { label: '엘다에게 해열 약초를 얻자', conditions: ['flag.met_elda'], effects: { 'rel.elda': +5, 'stat.int': +3, 'stat.moral': +2 },
        result: `엘다가 말린 버드나무 껍질을 싸 주었다. "물에 달여서 먹이면 돼요." 사흘 뒤 로이 동생의 열이 내렸다. 그 주부터 닭장 달걀은 모자라지 않았다.` },
    ],
  },
  {
    id: 'b08_farm_scale', title: '감독관의 저울', age: [12, 15], weight: 2, requiresActivity: 'farm', image: 'bg/wheat_field',
    text: `한스 아저씨가 허리를 다쳐 누운 사이, 읍내에서 온 감독관 퀸트가 밭일을 맡았다. 품삯은 바구니 무게로 쳐 준다. 그런데 {name이} 같은 바구니를 두 번 달아 보니 무게가 달랐다. "{call}, 그 아저씨 저울에 달 때마다 새끼손가락을 접시 밑에 넣어."`,
    choices: [
      { label: '방앗간 저울로 다시 달아 봐', check: { stat: 'int', dc: 150 },
        success: { effects: { gold: +50, 'stat.int': +5, reputation: +4, 'pers.extro': +2 },
          result: `{name은} 방앗간 저울을 빌려 와 일꾼들 앞에서 바구니를 하나씩 다시 달았다. 모자란 무게가 쌓일수록 퀸트의 얼굴이 하얘졌다. 한스 아저씨는 그날로 퀸트를 내보냈다.` },
        fail: { effects: { gold: -20, 'stat.int': +2, stress: +8, 'pers.agree': -2 },
          result: `퀸트가 먼저 소리쳤다. "꼬마가 일은 안 하고 저울 장난이냐!" {name}의 그날 품삯은 반으로 깎였다. 다른 일꾼들은 눈을 피했다.` } },
      { label: '한스 아저씨께 조용히 알려', effects: { gold: +30, 'stat.moral': +3, 'stat.eti': +2, stress: -2 },
        result: `한스 아저씨는 아픈 허리를 짚고 밭으로 나왔다. 저울을 들여다보고는 아무 말 없이 퀸트의 짐을 문밖에 내놓았다. 밀린 품삯은 그 주에 다 돌아왔다.` },
      { label: '당신이 저울을 들고 찾아간다', effects: { trust: +5, gold: +40, reputation: +2, 'pers.agree': +1 },
        result: `당신이 저울을 들고 밭에 서자 일꾼들이 하나둘 모여들었다. 퀸트는 핑계를 대다 말고 밀린 품삯을 셈했다. {name은} 당신 등 뒤에서 그 장면을 끝까지 지켜봤다.` },
      { label: '저울추 바닥을 뒤집어 봐', conditions: ["guardian == 'merchant'"], effects: { 'stat.int': +4, gold: +50, trust: +3, reputation: +2 },
        result: `{name이} 놋쇠 추를 뒤집자 바닥에 납이 덧대어 있었다. 새끼손가락은 눈속임이었다. 당신은 항구에서 이런 수법을 백 번은 봤다. 그 추는 다음 날 한스 아저씨 손에 들려 읍내 관청으로 갔다.` },
    ],
  },
  {
    id: 'b08_farm_plot', title: '내 몫의 이랑', age: [13, 16], weight: 2, requiresActivity: 'farm', image: 'bg/wheat_field',
    conditions: ['!seen.b04a_farm_field'],   // 이랑 셋(b08) → 밭 세 마지기(b04a, 16~17) 순서를 지킨다
    text: `한스 아저씨가 밭 귀퉁이 이랑 셋을 {name}에게 내주었다. "품삯 대신이다. 뭘 심든 네 맘대로. 거둔 것도 네 몫, 망친 것도 네 몫." {name이} 흙을 한 줌 쥐었다. 별똥별과 함께 떨어졌던 그 들판과 같은 냄새가 났다.`,
    choices: [
      { label: '밀을 심어 정직하게 키워', effects: { 'stat.hp': +5, 'stat.str': +3, gold: +60, 'pers.ambit': -1 },
        result: `{name은} 봄부터 가을까지 이랑 셋을 혼자 돌봤다. 거둔 밀은 한 자루 반. 방앗간 오토 할아버지가 그 밀로 빵을 구워 주었다. "네 손으로 키운 맛이다."` },
      { label: '꽃을 길러 장에 내다 팔아', check: { stat: 'chm', dc: 160, bonus: (s) => s.stats.sens * 0.1 },
        success: { effects: { gold: +120, 'stat.chm': +4, 'stat.elo': +3, 'pers.ambit': +2 },
          result: `장날마다 {name}의 꽃 바구니가 제일 먼저 비었다. 손님들은 꽃보다 파는 아이 얼굴을 보러 온다고 했다. {name은} 나른하게 하품하며 동전을 셌다.` },
        fail: { effects: { gold: -20, 'stat.sens': +3, stress: +5 },
          result: `여름 가뭄에 꽃이 다 고개를 숙였다. 장에 내놓은 건 시든 꽃 몇 단. {name은} 남은 꽃을 말려 방에 걸었다. "망친 것도 내 몫이랬잖아."` } },
      { label: '약초를 심고 엘다께 배워', conditions: ['flag.met_elda'], effects: { 'rel.elda': +6, 'stat.int': +4, 'stat.mag': +2, 'pers.roman': +1 },
        result: `엘다가 씨앗 봉투를 한 아름 들고 왔다. 박하, 쑥, 이름 모를 은빛 풀. 이랑은 여름 내내 좋은 냄새가 났다. 엘다가 웃었다. "흙이 {name을} 좋아하네요."` },
      { label: '파이용 사과나무를 심자', conditions: ['flag.b08_burnt_pie'], effects: { trust: +5, 'stat.sens': +4, 'pers.roman': +2, stress: -4 },
        result: `{name은} 이랑 하나에 사과 묘목을 심었다. "몇 년 뒤엔 이걸로 구울 거야. 이번엔 안 태우게 {call은} 감자만 깎아." 당신은 그 약속을 달력에 적어 두었다.` },
    ],
  },

  // ══ 식당 (고든 아저씨) — 요리 미니게임 ════════════════════════════════════
  {
    id: 'b08_diner_soup', title: '그 맛이 아니야', age: [10, 12], weight: 2, requiresActivity: 'diner',
    text: `고든 아저씨네 식당 창가 자리엔 날마다 아르노 할아버지가 앉는다. 은퇴한 늙은 병사다. 수프를 한 숟갈 뜨고는 늘 같은 말을 한다. "아니야. 이 맛이 아니야." {name은} 빈 그릇을 오래 들여다보았다. "{call}, 할아버지가 찾는 맛이 뭘까?"`,
    choices: [
      { label: '그 맛을 찾아 끓여 봐', check: { stat: 'sens', dc: 80, bonus: (s) => Math.min(24, (s.mastery.diner || 0) * 3) }, minigame: 'cooking',
        success: { effects: { 'stat.sens': +6, 'stat.hp': +2, reputation: +3, gold: +20 },
          result: `{name은} 할아버지에게 돌아가신 할머니 이야기를 물었다. 말린 사과 한 조각, 후추 세 알. 할아버지는 수프를 말없이 비우고 동전 한 닢을 더 놓았다. "내일도 오마."` },
        fail: { effects: { 'stat.sens': +2, stress: +4, 'pers.roman': +1 },
          result: `"……아니야." 할아버지가 숟가락을 내려놓았다. 그런데 그날은 평소보다 오래 앉아 있었다. 나가면서 한마디 했다. "그래도 고맙다, 꼬마야."` } },
      { label: '손님 투정은 웃어넘기렴', effects: { 'stat.eti': +3, 'stat.chm': +3, 'pers.agree': +1, stress: -2 },
        result: `{name은} 손님 앞에서 웃는 법을 배웠다. 고든 아저씨가 칭찬했다. 다음 주부터 창가 자리는 비어 있었다. {name은} 가끔 그 자리를 닦다가 손을 멈췄다.` },
      { label: '직접 끓여 보시라고 해', effects: { 'stat.elo': +4, 'stat.moral': +2, 'pers.extro': +2 },
        result: `고든 아저씨가 투덜대며 주방 문을 열어 주었다. 할아버지가 끓인 수프도 그 맛은 아니었다. 그런데 할아버지가 처음으로 소리 내어 웃었다. 이제 아침마다 감자를 깎으러 온다.` },
    ],
  },
  {
    id: 'b08_diner_pie', title: '탄 파이', age: [12, 16], weight: 2, requiresActivity: 'diner',
    text: `내일은 고든 아저씨네 식당 '가족의 날'. 일꾼마다 집 음식을 하나씩 낸다. "{call이랑} 같이 만든 거 내고 싶어." 그런데 당신이 화덕 앞에서 깜빡 조는 사이 사과 파이 가장자리가 새까맣게 탔다. {name이} 파이를 내려다보았다. 눈썹 하나 까딱하지 않았다.`,
    choices: [
      { label: '밤새 다시 굽자', check: { stat: 'sens', dc: 150, bonus: (s) => Math.min(24, (s.mastery.diner || 0) * 2) }, minigame: 'cooking',
        success: { effects: { 'stat.sens': +6, trust: +3, reputation: +2, stress: +3 },
          result: `이번엔 {name이} 화덕을 지켰다. 첫닭이 울 무렵 격자무늬가 반듯한 파이가 나왔다. 가족의 날, 파이는 제일 먼저 동났다. 탄 파이는 {name이} 몰래 혼자 먹었다.` },
        fail: { effects: { 'stat.sens': +2, trust: +5, stress: -4 },
          result: `새벽에 구운 두 번째 파이도 탔다. 둘은 식탁 위 검은 파이 두 개를 보다가 동시에 웃음을 터뜨렸다. {name이} 배를 잡고 웃는 걸 오랜만에 봤다.` } },
      { label: '탄 파이를 그대로 낸다', effects: { trust: +6, 'stat.sens': +3, 'stat.chm': +2, 'flag.b08_burnt_pie': true },
        result: `{name은} 파이 옆에 쪽지를 세웠다. '우리 {call}의 탄 파이 — 가장자리는 남기세요.' 가족의 날, 그 접시가 제일 먼저 비었다. 고든 아저씨가 말했다. "이거 메뉴에 올리자."` },
      { label: '빵집 파이를 사 간다 (-30G)', effects: { gold: -30, 'stat.eti': +2, trust: -3, 'pers.roman': -2 },
        result: `빵집 파이는 반듯하고 예뻤다. {name은} 고맙다고 했다. 그날 밤 찬장에서 탄 파이가 사라졌다. 아침에 보니 접시만 깨끗이 씻겨 있었다.` },
      { label: '야영 솥으로 다시 굽자', conditions: ["guardian == 'adventurer'"], effects: { trust: +4, 'stat.hp': +3, 'stat.sens': +3, 'pers.extro': +1 },
        result: `당신은 모험가 시절처럼 마당에 돌을 쌓고 무쇠 솥을 걸었다. 뚜껑 위에 숯을 얹어 구운 파이는 투박했지만 타지 않았다. "{call}, 이거 어디서 배웠어?" "동굴에서."` },
    ],
  },
  {
    id: 'b08_diner_market', title: '새벽 어시장', age: [14, 17], weight: 2, requiresActivity: 'diner', image: 'bg/harbor',
    text: `고든 아저씨가 처음으로 장보기를 {name}에게 맡겼다. 새벽 항구 어시장, 은화 다섯 닢, 오늘 저녁 서른 그릇. 생선 장수가 반들반들한 은빛 생선을 내밀며 눈을 찡긋했다. "아가씨한텐 특별히." 옆 좌판엔 못생긴 잡어가 반값에 쌓여 있다.`,
    choices: [
      { label: '아가미부터 들춰 봐', check: { stat: 'sens', dc: 260, bonus: (s) => Math.min(45, (s.mastery.diner || 0) * 3) },
        success: { effects: { 'stat.sens': +5, 'stat.int': +3, gold: +30, reputation: +2 },
          result: `아가미가 거무스름했다. 비늘엔 기름을 발라 놓았다. 생선 장수가 헛기침을 했다. {name은} 옆 좌판에서 싱싱한 생선을 제값에 사고, 남은 은화를 고든 아저씨께 돌려드렸다. 아저씨는 그 은화를 {name}의 품삯에 얹어 주었다.` },
        fail: { effects: { gold: -30, 'stat.int': +2, stress: +5 },
          result: `반들반들한 생선은 저녁 솥에서 비린내를 풍겼다. 손님 몇이 숟가락을 내려놓았다. 고든 아저씨는 화내지 않고 아가미 보는 법을 가르쳐 주었다. {name은} 그걸 공책에 적었다.` } },
      { label: '못난이 잡어로 새 요리를', effects: { 'stat.sens': +6, 'pers.roman': +2, stress: +4, gold: +20 },
        result: `{name은} 잡어를 뼈째 고아 붉은 고추와 감자를 넣었다. 이름은 '못난이 스튜'. 항구 일꾼들이 두 그릇씩 비웠다. 고든 아저씨가 칠판 메뉴 맨 위에 그 이름을 적었다.` },
      { label: '값을 깎아 은빛 생선을', conditions: ['stat.elo >= 150'], effects: { 'stat.elo': +5, gold: +40, 'pers.roman': -2, 'stat.moral': -1 },
        result: `{name은} 은빛 생선을 반값에 사들였다. 흥정은 완벽했다. 생선이 조금 묵은 건 솥 앞에서야 알았다. 향신료를 두 배로 넣었다. 손님들은 몰랐다. {name은} 알았다.` },
      { label: '옛 거래처 어부를 찾아가렴', conditions: ["guardian == 'merchant'"], effects: { trust: +3, gold: +30, 'stat.elo': +3, reputation: +2 },
        result: `당신이 일러 준 부둣가 끝 배로 가자 늙은 어부가 반색했다. "그 양반 딸이라고?" 그날부터 고든 아저씨네 식당엔 새벽 첫 배의 생선이 들어왔다.` },
    ],
  },

  // ══ 여관 「세 개의 달」 (노부부) — 요리 미니게임 ═══════════════════════════
  {
    id: 'b08_inn_storm', title: '폭풍 밤의 큰 솥', age: [10, 13], weight: 2, requiresActivity: 'inn', image: 'bg/tavern_inn',
    text: `사흘째 폭풍이다. 여관 「세 개의 달」에 배를 못 탄 손님 서른 명이 갇혔다. 부엌을 맡던 여관 할머니는 손목을 삐었고, 할아버지는 젖은 짐을 나르느라 정신이 없다. 할머니가 {name}에게 국자를 쥐여 주었다. "큰 솥 하나면 된다. 해 볼래?"`,
    choices: [
      { label: '큰 솥 스튜를 끓여 봐', check: { stat: 'sens', dc: 75, bonus: (s) => Math.min(30, (s.mastery.inn || 0) * 2) }, minigame: 'cooking',
        success: { effects: { 'stat.sens': +5, 'stat.hp': +3, gold: +40, reputation: +3 },
          result: `뱃사람들이 그릇을 비우고 탁자를 두드리며 노래했다. 폭풍이 그친 아침, 늙은 선원 하나가 나무 숟가락을 깎아 {name}에게 주었다. 손잡이에 별이 새겨져 있었다.` },
        fail: { effects: { 'stat.sens': +2, stress: +5, gold: +10 },
          result: `스튜는 바다보다 짰다. 손님들은 빵을 세 배로 찢어 넣어 먹었다. "짠 건 뱃사람한테 익숙하지!" 누군가 외쳤고 다들 웃었다. {name}만 웃지 못했다.` } },
      { label: '손님마다 재료 하나씩 내 달래', effects: { 'stat.elo': +4, 'stat.chm': +3, 'pers.extro': +2 },
        result: `{name이} 의자 위에 올라가 외쳤다. "하나씩 내 주시면 다 같이 먹어요!" 선원은 말린 생선을, 순례자는 보리를, 행상은 후추를 내놓았다. 그날 스튜 이름은 '서른 사람의 솥'.` },
      { label: '할머니 손목부터 돌봐 드려', effects: { 'stat.moral': +4, 'stat.sens': +2, 'pers.good': +1, reputation: -2, stress: +3 },
        result: `{name은} 할머니 손목에 찬 수건을 감고 베개를 받쳤다. 저녁은 한참 늦었고 손님들이 투덜댔다. 할머니는 그날 밤 숨겨 둔 훈제 고기가 어디 있는지 {name}에게만 알려 주었다.` },
      { label: '약초 상자를 열어 봐', conditions: ['item.herb_kit >= 1'], effects: { 'stat.int': +3, 'stat.sens': +3, gold: +30, 'pers.roman': +1 },
        result: `{name은} 약초 상자에서 월계수 잎과 마른 백리향을 꺼냈다. 솥에서 숲 냄새가 났다. 할머니가 국물을 맛보더니 손목 아픈 것도 잊고 웃었다. "이건 내 솥보다 낫구나."` },
    ],
  },
  {
    id: 'b08_inn_attic', title: '다락방의 손님', age: [13, 16], weight: 2, requiresActivity: 'inn', image: 'bg/tavern_inn',
    text: `여관 다락방에 열여섯쯤 된 소녀가 숨어 있었다. 왕도 어느 저택의 견습 하녀였는데, 이 년 동안 품삯 한 푼 못 받고 밤낮으로 일하다 도망쳤단다. 저녁 무렵 저택 집사가 들이닥쳤다. "도망친 하녀를 보면 알려라. 사례는 50G." 집사의 눈이 {name}에게서 멈췄다.`,
    choices: [
      { label: '못 봤다고 시치미 떼', effects: { 'stat.elo': +3, 'stat.moral': +2, 'pers.good': +2, stress: +5 },
        result: `{name은} 행주를 접으며 고개를 저었다. 집사는 한참 서 있다 떠났다. 새벽, 소녀는 빵 한 덩이를 품고 사라졌다. 다락방 창틀에 '고마워' 세 글자가 남아 있었다.` },
      { label: '사실대로 말해', effects: { gold: +50, 'stat.eti': +3, 'pers.good': -3, stress: +6 },
        result: `집사가 소녀를 데려갔다. 소녀는 끝까지 {name} 쪽을 보지 않았다. 사례금 은화가 이상하게 무거웠다. {name은} 그 돈을 한동안 꺼내 쓰지 못했다.` },
      { label: '소녀를 집으로 데려오렴', effects: { trust: +5, 'stat.moral': +4, gold: -20, gHealth: -3 },
        result: `당신은 소녀를 집에 재우고, 이튿날 함께 성당 중재소에 진정서를 냈다. 저택은 이 년 치 품삯을 물어야 했다. 소녀는 베라 할머니 재봉소에 새 일자리를 얻었다. {name이} 당신 소매를 오래 붙잡고 있었다.` },
      { label: '후드 손님 때처럼 태연히', conditions: ['flag.stranger_asked'], effects: { 'stat.elo': +5, 'stat.chm': +2, 'pers.extro': +1, trust: +2 },
        result: `{name은} 나른한 눈으로 집사를 올려다보았다. "도망친 아이요? 못 봤어요. 은발 아이라면 하나 봤는데. 저요." 집사가 혀를 차고 나갔다. 다락에서 웃음 참는 소리가 났다.` },
    ],
  },

  // ══ 교회 봉사 ═════════════════════════════════════════════════════════════
  {
    id: 'b08_church_bread', title: '마지막 두 덩이', age: [10, 12], weight: 1.8, requiresActivity: 'church', image: 'bg/church',
    text: `성당 빵 나눔 날. 줄은 길고 바구니는 금세 가벼워졌다. 남은 빵은 두 덩이. 줄 끝엔 다리를 저는 할머니와 아이 셋 딸린 아주머니가 아직 서 있다. 방금 빵을 받은 소년이 그걸 품에 넣고 다시 줄 끝에 섰다. {name이} 바구니를 끌어안고 당신을 돌아보았다.`,
    choices: [
      { label: '소년에게 하나 돌려 달라 해', effects: { 'stat.eti': +3, 'stat.moral': +2, stress: +3, 'pers.agree': +1 },
        result: `소년은 빵을 내밀며 고개를 숙였다. 집에 누운 동생 몫이었다고 했다. {name은} 빵을 받아 들고 한참 서 있었다. 돌아오는 길 내내 말이 없었다.` },
      { label: '네 점심을 내놓으렴', effects: { 'stat.moral': +5, 'stat.hp': -3, 'stat.sens': +2, 'pers.good': +2 },
        result: `{name은} 보자기에 싸 온 자기 점심을 반으로 갈랐다. 할머니에게 하나, 아주머니에게 하나. 그날 저녁 {name은} 수프를 세 그릇 먹었다. 당신은 아무것도 묻지 않았다.` },
      { label: '조금씩 나누자고 외쳐 봐', check: { stat: 'elo', dc: 60, bonus: (s) => s.stats.faith * 0.2 },
        success: { effects: { 'stat.elo': +5, reputation: +3, 'pers.extro': +2 },
          result: `"한 덩이 말고 반 덩이씩 받아 주세요!" 줄이 잠깐 조용해졌다. 그러더니 앞사람들이 하나둘 빵을 잘랐다. 바구니가 줄 끝까지 닿았다.` },
        fail: { effects: { 'stat.elo': +2, stress: +6, 'pers.extro': -1 },
          result: `"왜 우리 걸 잘라?" 줄 앞쪽에서 언성이 높아졌다. 사제가 나와 겨우 사람들을 달랬다. {name은} 성당 계단에 앉아 무릎에 얼굴을 묻었다.` } },
      { label: '제의실 바닥을 두드려 본다', conditions: ["guardian == 'priest'"], effects: { 'stat.faith': +4, trust: +4, reputation: +2 },
        result: `당신은 사제 시절 버릇대로 제의실 뒤 마룻바닥을 두드렸다. 비상용 밀가루 자루가 그대로 있었다. "{call}, 이거 어떻게 알았어?" "성당은 어디나 비슷하게 생겼거든."` },
    ],
  },
  {
    id: 'b08_church_coins', title: '헌금함의 그림자', age: [12, 15], weight: 2, requiresActivity: 'church', npc: 'archbishop',
    text: `성당 봉사 아이들이 헌금함을 세는 날마다 액수가 모자란다. 부제 세드릭은 아이들 주머니를 뒤지고, 모자란 만큼 봉사 수당에서 떼겠다고 했다. 그날 밤 {name이} 조용히 말했다. "{call}, 세드릭 부제님 장화에서 동전 소리가 났어. 두 번이나."`,
    choices: [
      { label: '표시한 동전으로 증거를 잡자', check: { stat: 'int', dc: 120 },
        success: { effects: { 'stat.int': +6, reputation: +5, gold: +30, 'pers.good': +2 },
          result: `{name은} 아이들과 헌금 동전 스무 닢에 밀랍으로 작은 별을 찍었다. 이튿날 대주교 앞에서 세드릭의 장화를 털자 별 찍힌 동전이 굴러 나왔다. 수당은 전부 돌아왔다.` },
        fail: { effects: { 'stat.int': +2, stress: +8, 'pers.agree': -2 },
          result: `세드릭이 밀랍 자국을 먼저 찾아냈다. "헌금에 장난을 쳐?" 봉사 아이들은 한 달 동안 마룻바닥을 닦았다. {name은} 걸레를 쥐고 이를 악물었다.` } },
      { label: '당신이 대주교를 찾아간다', effects: { trust: +4, reputation: +2, 'stat.faith': +2, gHealth: -2 },
        result: `대주교는 당신 말을 끝까지 들었다. 일주일 뒤 세드릭 부제는 먼 산골 수도원으로 '양을 세러' 떠났다. 수당은 돌아왔다. {name이} 말했다. "다음엔 나도 데려가."` },
      { label: '봉사를 그만두게 한다', effects: { trust: +2, stress: -4, 'stat.faith': -2, 'pers.good': -1 },
        result: `{name은} 성당에 가지 않았다. 마음은 편했다. 그런데 장날마다 봉사 아이들이 수당 없이 일한다는 이야기를 들을 때면 {name}의 붉은 눈이 가늘어졌다.` },
      { label: '옛 사제로서 세드릭을 만난다', conditions: ["guardian == 'priest'"], effects: { 'stat.moral': +3, 'stat.faith': +3, trust: +5, 'pers.good': +1 },
        result: `당신은 세드릭과 제의실에 단둘이 마주 앉았다. 오래 아무 말도 하지 않았다. 세드릭이 먼저 무너졌다. 노름빚이었다. 그는 동전 주머니를 내놓고 스스로 부제 자리를 내려놓았다.` },
    ],
  },

  // ══ 재봉소 (베라 할머니) ═══════════════════════════════════════════════════
  {
    id: 'b08_sew_scorch', title: '그을린 면사포', age: [10, 12], weight: 1.8, requiresActivity: 'sewing',
    text: `베라 할머니 재봉소. 다리미를 데우던 {name이} 창밖 고양이를 보는 사이, 내일 혼례에 쓸 면사포 끝자락이 누렇게 그을렸다. 할머니는 장 보러 나갔고 신부는 저녁에 옷을 찾으러 온다. {name}의 손끝에서 금빛 별이 불안하게 튀었다.`,
    choices: [
      { label: '할머니께 솔직히 말씀드려', effects: { 'stat.moral': +5, 'stat.eti': +2, gold: -40, stress: +3 },
        result: `베라 할머니는 그을린 자리를 한참 보더니 한숨을 쉬었다. "레이스값은 네 품삯에서 떼마." 그리고 밤새 나란히 앉아 새 레이스 다는 법을 가르쳐 주었다.` },
      { label: '그을린 자리에 별을 수놓아', check: { stat: 'sens', dc: 85 },
        success: { effects: { 'stat.sens': +6, reputation: +3, 'pers.roman': +2, gold: +20 },
          result: `{name은} 그을린 자리를 따라 흰 실로 작은 별 일곱 개를 수놓았다. 신부가 면사포를 펼치더니 탄성을 질렀다. 베라 할머니는 다 알면서 품삯을 조금 올려 주었다.` },
        fail: { effects: { 'stat.sens': +2, 'stat.moral': +2, 'pers.good': +1, stress: +8 },
          result: `별은 삐뚤었고 그을린 자국은 더 도드라졌다. 결국 {name은} 할머니께 털어놓았다. 둘이서 밤을 새워 레이스를 갈았다. 할머니는 꾸중 대신 하품만 했다.` } },
      { label: '달무리가 그랬다고 해', conditions: ['flag.has_cat'], effects: { stress: -3, 'stat.elo': +2, 'stat.moral': -4, 'pers.good': -3 },
        result: `"고양이가 다리미를 건드렸어요." 할머니는 그 말을 믿었다. 대신 재봉소에 달무리를 데려오지 말라고 했다. 그날 밤 {name은} 달무리 눈을 똑바로 보지 못했다.` },
      { label: '재봉 상자의 레이스를 꺼내', conditions: ['item.sewing_kit >= 1'], effects: { 'stat.sens': +4, 'stat.cult': +3, 'stat.moral': +2, trust: +2 },
        result: `{name은} 당신이 사 준 재봉 상자 밑바닥에서 아껴 둔 레이스를 꺼냈다. 그을린 끝을 잘라 내고 새 레이스를 덧댔다. 그리고 할머니가 돌아오자마자 전부 털어놓았다.` },
    ],
  },
  {
    id: 'b08_sew_scraps', title: '자투리 외투', age: [13, 16], weight: 2, requiresActivity: 'sewing',
    text: `재봉소 바닥 바구니엔 자투리 천이 수북하다. 베라 할머니는 그걸 모아 넝마장수에게 판다. 요즘 {name이} 자꾸 그 바구니를 본다. 대장간 집 네리가 한겨울에도 얇은 여름 웃옷 한 벌로 다니기 때문이다. "{call}, 자투리면 외투 하나는 나올 것 같은데."`,
    choices: [
      { label: '품삯으로 자투리를 사렴', effects: { gold: -40, 'stat.sens': +4, 'stat.moral': +4 },
        result: `{name은} 넝마장수보다 은화 한 닢 더 쳐서 자투리를 샀다. 베라 할머니가 혀를 찼다. "장사는 영 못하겠구나." 그러고는 안감으로 쓰라며 헌 담요 한 장을 얹어 주었다.` },
      { label: '조금씩 몰래 챙긴다', effects: { 'stat.sens': +4, 'stat.moral': -3, 'pers.good': -2, infamy: +2 },
        result: `{name은} 퇴근길마다 자투리 몇 조각을 소매에 넣었다. 외투는 완성됐고 네리는 펄쩍 뛰었다. 며칠 뒤 베라 할머니가 바구니를 보며 말했다. "요즘 쥐가 고운 천만 먹네."` },
      { label: '조각보 외투를 지어 봐', check: { stat: 'sens', dc: 270 },
        success: { effects: { 'stat.sens': +7, 'stat.cult': +3, gold: +60, reputation: +3 },
          result: `마흔일곱 가지 색 조각이 이어진 외투였다. 네리가 입고 장터를 걷자 사람들이 돌아봤다. 베라 할머니는 그 외투를 본떠 진열장에 걸었고, 주문이 밀려들었다.` },
        fail: { effects: { 'stat.sens': +3, stress: +4, 'pers.ambit': -1 },
          result: `조각들이 제멋대로 울었다. 소매 한쪽이 길었다. 그래도 네리는 그 외투를 벗지 않았다. "누나가 만든 거야." 장터에서 그 말을 백 번쯤 했다고 한다.` } },
      { label: '네 털 외투로 본을 떠', conditions: ['item.warm_coat >= 1'], effects: { 'stat.cult': +4, 'stat.sens': +3, trust: +3, 'pers.good': +1 },
        result: `{name은} 당신이 사 준 털 외투를 펼쳐 놓고 본을 떴다. 소매만 줄이고 모양은 그대로. 네리는 {name과} 똑같은 외투를 입고 겨울 내내 쫓아다녔다. "누나랑 쌍둥이야."` },
    ],
  },
  {
    id: 'b08_sew_patterns', title: '오십 년의 옷본', age: [15, 17], weight: 2.2, requiresActivity: 'sewing', conditions: ['mastery.sewing >= 4'],
    text: `베라 할머니가 다락에서 납작한 나무 상자를 꺼냈다. 오십 년 동안 그린 옷본이 차곡차곡 접혀 있다. "눈이 침침해 이젠 못 그린다. 너 가질래?" 그런데 왕도 큰 의상실에서도 이 상자를 사겠다는 편지가 왔다. 할머니 약값이 모자란다는 걸 {name은} 안다.`,
    choices: [
      { label: '물려받고 약값은 같이 벌자', effects: { 'stat.sens': +6, 'stat.cult': +4, gold: -60, stress: +8 },
        result: `{name은} 상자를 끌어안고 그해 겨울 주문을 두 배로 받았다. 손가락에 골무 자국이 가실 날이 없었다. 봄이 오자 할머니 약값 장부의 빚 칸이 비었다.` },
      { label: '왕도에 파시라고 권해', effects: { 'stat.moral': +4, 'stat.sens': +2, 'pers.roman': -2, stress: -3 },
        result: `할머니는 상자를 팔아 약값을 치렀다. 이듬해 왕도 의상실 진열장에 할머니의 옷본으로 지은 드레스가 걸렸다. {name은} 유리창 앞에 오래 서 있다 돌아왔다.` },
      { label: '팔기 전에 한 장씩 베껴 둬', check: { stat: 'cult', dc: 225 },
        success: { effects: { 'stat.cult': +7, 'stat.sens': +4, stress: +6, 'pers.ambit': +2 },
          result: `한 달 동안 {name은} 밤마다 등잔 밑에서 옷본 이백 장을 베꼈다. 상자는 왕도로 갔지만 오십 년은 {name}의 공책에 남았다. 할머니가 첫 장에 서명해 주었다.` },
        fail: { effects: { 'stat.cult': +3, stress: +8, 'pers.ambit': +1 },
          result: `절반쯤 베꼈을 때 상자를 가지러 사람이 왔다. 남은 옷본은 기억에 맡겨야 했다. {name은} 빈 공책 뒷장에 할머니가 했던 말들을 대신 적어 두었다.` } },
      { label: '옷본을 책으로 엮어 남기자', conditions: ["guardian == 'scholar'"], effects: { trust: +4, 'stat.cult': +4, 'stat.int': +2, reputation: +2 },
        result: `당신은 옷본마다 할머니의 설명을 받아 적어 한 권의 책으로 엮었다. 원본은 왕도로 갔고 책은 재봉소 선반에 남았다. 표지엔 두 이름이 나란히 적혔다. 베라, 그리고 {name}.` },
    ],
  },

  // ══ 대장간 (도르완 영감) ═══════════════════════════════════════════════════
  {
    id: 'b08_smith_horseshoe', title: '금 간 편자', age: [10, 12], weight: 1.8, requiresActivity: 'smith', image: 'bg/smithy',
    text: `대장간 아침. 왕도로 가는 파발꾼이 말을 끌고 들어와 소리쳤다. "편자 넷, 당장!" 도르완 영감이 박아 넣은 편자 하나에 머리카락만 한 금이 보였다. {name}만 본 것 같다. 파발꾼은 벌써 고삐를 쥐었고, 영감은 땀을 훔치며 다음 손님을 부른다.`,
    choices: [
      { label: '손님 앞이라도 말씀드려', effects: { 'stat.moral': +4, 'stat.elo': +3, stress: +4, 'pers.extro': +1 },
        result: `"할아버지, 그거 금 갔어요." 영감이 눈썹을 찌푸리고 편자를 들여다봤다. "흠." 편자는 새것으로 바뀌었다. 그날 저녁 영감이 말없이 {name} 몫의 빵을 하나 더 샀다.` },
      { label: '직접 갈아 끼워 봐', check: { stat: 'agi', dc: 55 },
        success: { effects: { 'stat.agi': +5, 'stat.str': +3, reputation: +3, 'pers.ambit': +1 },
          result: `{name은} 말 다리를 무릎에 끼고 편자를 비틀어 뽑았다. 새 편자를 대고 못 넷. 파발꾼이 휘파람을 불었다. 영감은 아무 말 없이 {name}의 망치 자루를 손에 맞게 깎아 주었다.` },
        fail: { effects: { 'stat.agi': +2, stress: +5, 'pers.ambit': -1 },
          result: `말이 발을 굴렀다. {name은} 물통째 엎어져 진흙투성이가 됐다. 영감이 나와 편자를 갈았다. "다음엔 나를 불러라. 그리고 말한테 먼저 인사해라."` } },
      { label: '어른 일이니 가만있어', effects: { 'stat.eti': +2, 'stat.moral': -3, 'pers.agree': +1, stress: +4 },
        result: `열흘 뒤, 그 파발마가 왕도 길에서 다리를 절었다는 소식이 왔다. 영감이 {name을} 보았다. "봤으면 말을 했어야지." 꾸중은 그게 전부였다. 그래서 더 오래 남았다.` },
    ],
  },
  {
    id: 'b08_smith_key', title: '밀랍 속 열쇠', age: [13, 16], weight: 2, requiresActivity: 'smith', npc: 'shadow',
    text: `영감이 장에 간 오후, 은 귀걸이를 한 검은 옷의 청년이 대장간에 와 밀랍 덩어리를 내밀었다. 열쇠 자국이 선명했다. "이대로 하나만. 영감한텐 비밀. 150G." {name은} 일단 밀랍을 받아 왔다. 저녁상 앞에 그걸 꺼내 놓았다. "{call}, 내일까지 해 주기로 했어."`,
    choices: [
      { label: '돌려주고 거절하렴', effects: { 'stat.moral': +4, 'pers.good': +2, stress: +4 },
        result: `{name은} 밀랍을 청년 손에 도로 쥐여 주었다. "안 해요." 청년은 어깨를 으쓱했다. "아깝네. 손이 좋던데." 그 뒤로 밤 시장 골목에서 그 은 귀걸이가 가끔 보였다.` },
      { label: '열쇠를 깎아 준다', effects: { gold: +150, infamy: +8, 'stat.moral': -5, 'pers.good': -3 },
        result: `열쇠는 완벽했다. 열흘 뒤 항구 곡물 창고가 털렸다는 소문이 돌았다. {name은} 금화 주머니를 침대 밑 깊숙이 넣었다. 그날부터 대장간 문 여는 소리에 흠칫 놀랐다.` },
      { label: '헛열쇠를 깎고 경비대에 알려', check: { stat: 'int', dc: 140 },
        success: { effects: { 'stat.int': +5, reputation: +6, gold: +50, 'pers.good': +2 },
          result: `겉은 똑같고 마지막 홈만 어긋난 열쇠였다. 경비대는 곡물 창고 문 앞에서 열쇠를 헛돌리던 사내들을 붙잡았다. 포상금이 나왔다. 영감은 "흠" 하고 {name}의 머리를 흐트러뜨렸다.` },
        fail: { effects: { 'stat.int': +2, stress: +10, 'pers.extro': -2 },
          result: `청년은 열쇠를 받자마자 손끝으로 홈을 쓸었다. "재밌는 장난이네." 그는 웃으며 열쇠를 화덕에 던졌다. 다음 날 대장간 문틈에 카드 한 장. '다음엔 진짜로.'` } },
      { label: '가렛 아저씨께 뒤를 부탁해', conditions: ['rel.garrett >= 30'], effects: { 'rel.garrett': +6, reputation: +3, 'stat.agi': +2 },
        result: `가렛은 이야기를 듣자마자 씩 웃었다. "미끼를 던지겠다고? 좋지." 열쇠를 넘기는 밤, 골목마다 용병들이 숨어 있었다. 청년만 담을 넘어 달아났다. 은 귀걸이 한 짝을 남기고.` },
    ],
  },
  {
    id: 'b08_smith_broken', title: '부러진 검', age: [15, 17], weight: 2.2, requiresActivity: 'smith', npc: 'garrett',
    text: `가렛이 모루 위에 부러진 검을 내려놓았다. 이십 년 전 국경에서 함께 싸우다 먼저 간 동료의 검이란다. "그 녀석 딸이 다음 달 항구에 대장간을 연다. 아비 칼을 보내고 싶은데, 부러진 걸 줄 순 없잖냐." 도르완 영감은 팔짱만 낀 채 {name을} 보았다. "네가 해라."`,
    choices: [
      { label: '다시 검으로 벼려 내', check: { stat: 'str', dc: 300, bonus: (s) => (s.mastery.smith || 0) * 3 },
        success: { effects: { 'stat.str': +8, 'rel.garrett': +8, reputation: +4, 'pers.ambit': +2 },
          result: `부러진 두 토막이 한 자루로 이어졌다. 이음매에 물결무늬가 남았다. 가렛이 칼을 빛에 비춰 보다 목이 잠겼다. "……그 녀석 손버릇까지 살렸구나."` },
        fail: { effects: { 'stat.str': +3, 'rel.garrett': +3, stress: +8 },
          result: `이음매가 버티지 못해 칼이 한 뼘 짧아졌다. {name은} 고개를 들지 못했다. 가렛이 짧아진 칼을 휘둘러 보고 웃었다. "그 녀석도 키가 작았다. 딱 맞네."` } },
      { label: '대장장이의 망치로 고쳐', effects: { 'stat.str': +4, 'stat.sens': +4, 'rel.garrett': +5, 'pers.good': +1 },
        result: `{name은} 부러진 칼날을 녹여 작은 망치 머리로 벼렸다. 자루엔 원래 칼자루 가죽을 감았다. 가렛이 한참 들여다봤다. "칼보다 이게 맞다. 그 녀석도 그렇게 말했을 거다."` },
      { label: '부러진 그대로 칼집을 지어', effects: { 'stat.cult': +5, 'stat.sens': +4, 'rel.garrett': +4, 'pers.roman': +2 },
        result: `{name은} 두 토막을 나란히 눕힐 칼집을 지었다. 겉엔 국경의 강줄기를 새겼다. "고치지 않는 것도 기억하는 방법이래." 가렛이 칼집을 가슴에 안았다.` },
      { label: '칼자루의 문장을 알아본다', conditions: ["guardian == 'knight'"], effects: { trust: +6, 'rel.garrett': +6, 'stat.sens': +3 },
        result: `칼자루 문장을 본 당신이 이름 하나를 불렀다. 가렛이 놀라 돌아보았다. 그날 밤 셋은 화덕 앞에서 늦도록 이야기했다. {name은} 모루에 기대 졸면서도 끝까지 들었다.` },
    ],
  },

  // ══ 성 청소 ═══════════════════════════════════════════════════════════════
  {
    id: 'b08_castle_vase', title: '깨진 꽃병', age: [10, 13], weight: 2, requiresActivity: 'castle', image: 'bg/castle_hall',
    text: `왕궁 복도 청소 날. 집사장 모르텐이 견습 하녀들에게 삿대질을 하며 꾸짖다가 소매로 꽃병을 쳤다. 쨍그랑. 모르텐은 잠깐 굳더니 제일 어린 키라를 가리켰다. "네가 그랬지!" 키라가 울음을 터뜨렸다. 복도 끝에서 걸레를 쥔 {name}만 그 장면을 똑똑히 봤다.`,
    choices: [
      { label: '본 대로 말해야지', effects: { 'stat.moral': +3, 'pers.good': +1, stress: +4 }, next: 'b08_castle_hearing',
        result: `{name이} 걸레를 내려놓고 나섰다. "제가 봤어요." 모르텐의 얼굴이 굳었다. 내일 근위대장 앞에서 다시 이야기하자고 했다. 키라가 {name}의 앞치마 끈을 꼭 쥐었다.` },
      { label: '키라 대신 깼다고 나서', effects: { gold: -60, 'stat.moral': +3, 'pers.agree': +2, stress: +6 },
        result: `"제가 그랬어요." 모르텐이 입꼬리를 올렸다. {name}의 품삯 두 달 치가 꽃병값으로 사라졌다. 키라는 일자리를 지켰다. 그 뒤로 {name} 곁을 졸졸 따라다녔다.` },
      { label: '집에 와서 털어놓는다', effects: { trust: +4, 'stat.moral': +2, stress: -2 }, next: 'b08_castle_hearing',
        result: `저녁상 앞에서 {name이} 다 털어놓았다. "어른이 거짓말하면 어떡해?" 당신은 다음 날 아이와 함께 성에 가기로 했다. {name이} 숟가락을 다시 들었다.` },
      { label: '못 본 척한다', effects: { 'stat.eti': +2, 'stat.moral': -3, 'pers.good': -2, stress: +6 },
        result: `키라는 그날로 성에서 쫓겨났다. {name은} 그 뒤로 동쪽 복도 청소를 피했다. 꽃병 자리엔 새 꽃병이 놓였다. 모르텐은 아무 일 없다는 듯 그 앞을 지나다녔다.` },
    ],
  },
  {
    id: 'b08_castle_hearing', title: '근위대장의 질문', chainOnly: true, age: [10, 13], npc: 'knight_cpt',
    text: `이튿날, 흰 갑옷의 근위대장이 꽃병 일로 하인들을 복도에 세웠다. 모르텐은 팔짱을 끼고 서 있고, 키라는 앞치마만 쥐어뜯는다. 근위대장이 {name} 앞에 멈췄다. "본 것이 있다고 들었다. 말해 보아라. 거짓이면 너도 책임을 진다."`,
    choices: [
      { label: '본 그대로 또박또박', check: { stat: 'elo', dc: 72 },
        success: { effects: { 'stat.elo': +5, 'stat.moral': +3, reputation: +4, 'pers.extro': +2 },
          result: `{name은} 모르텐의 소매가 어느 쪽으로 스쳤는지까지 말했다. 근위대장이 고개를 끄덕였다. 모르텐은 지하 창고 촛대 세는 일로 쫓겨났고, 키라는 제자리로 돌아왔다.` },
        fail: { effects: { 'stat.moral': +2, stress: +8, 'pers.extro': -2 },
          result: `목소리가 떨려 말이 엉켰다. 모르텐이 코웃음을 쳤다. "아이들 거짓말이지요." 근위대장은 판단을 미뤘다. 이튿날 {name은} 빨래터로 옮겨졌다. 근위대장이 지나가며 한마디 했다. "네 용기는 기억해 두마."` } },
      { label: '조각이 흩어진 쪽을 짚어', effects: { 'stat.int': +4, 'stat.eti': +2, 'pers.agree': +1, stress: -2 },
        result: `{name은} 꽃병 조각이 모르텐 쪽으로 흩어졌던 자리를 짚었다. 근위대장은 '사고'로 결론 내렸다. 키라는 일자리를 지켰다. 모르텐도 자리를 지켰다. {name은} 그게 조금 분했다.` },
      { label: '당신이 아이 곁에 선다', conditions: ["guardian == 'knight'"], effects: { trust: +4, reputation: +3, 'stat.eti': +2, 'pers.ambit': +1 },
        result: `당신이 기사식으로 짧게 예를 갖추자 근위대장은 잠깐 당신을 보더니, 아이 앞에 한쪽 무릎을 꿇었다. "천천히 말해라." 모르텐은 지하 창고로 갔다. {name이} 작게 말했다. "{call} 덕분이야. 근데 말은 내가 했어."` },
      { label: '본 것을 글로 정리해 내자', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +4, 'stat.elo': +2, reputation: +3, trust: +3 },
        result: `당신은 {name이} 본 것을 시간 순서대로 적게 했다. 근위대장은 진술서를 두 번 읽고 모르텐에게 같은 질문을 세 번 했다. 답이 세 번 다 달랐다. 모르텐은 지하 창고로 갔다.` },
    ],
  },
  {
    id: 'b08_castle_prince', title: '동쪽 회랑의 소년', age: [12, 14], weight: 2.5, requiresActivity: 'castle', npc: 'leon',
    conditions: ['flag.met_leon', '!seen.leon_truth'],
    text: `동쪽 회랑을 닦던 {name이} 걸레를 떨어뜨렸다. 금실 망토를 두른 소년이 가정교사들에게 둘러싸여 지나갔다. 리온이었다. 리온도 {name을} 봤다. 소년은 아주 작게 고개를 저었다. 그날 밤 {name이} 물었다. "{call}, 친구가 거짓말을 했는데 사정이 있어 보이면, 모른 척해 줘야 해?"`,
    choices: [
      { label: '친구가 말할 때까지 기다려 줘', effects: { 'rel.leon': +8, 'stat.sens': +3, 'pers.agree': +1 },
        result: `다음 장날 우물가에 리온이 사과 두 알을 들고 나타났다. 둘은 망토 이야기는 하나도 하지 않았다. 헤어질 때 리온이 말했다. "고마워." 무엇이 고마운지는 둘 다 알았다.` },
      { label: '직접 물어보렴', check: { stat: 'elo', dc: 150, bonus: (s) => s.relations.leon * 0.5 },
        success: { effects: { 'rel.leon': +10, 'stat.elo': +4, 'pers.extro': +1 },
          result: `"그 망토, 안 어울리던데." {name}의 첫마디에 리온이 웃음을 터뜨렸다. "……나중에 다 말할게. 정말이야." 리온은 처음으로 {name}의 눈을 똑바로 보며 말했다.` },
        fail: { effects: { 'rel.leon': -4, stress: +5, 'pers.roman': -1 },
          result: `리온은 대답 대신 화제를 돌렸다. 한 달 동안 우물가에 오지 않았다. {name은} 동쪽 회랑을 닦을 때마다 걸레질이 거칠어졌다.` } },
      { label: '왕궁 일엔 끼지 마라', effects: { 'stat.eti': +3, 'rel.leon': -5, 'pers.ambit': -2, trust: -2 },
        result: `{name은} 고개를 끄덕였다. 그 뒤로 동쪽 회랑엔 가지 않았다. 리온도 우물가에 뜸해졌다. 가끔 {name이} 우물 쪽을 보다 말고 하품을 했다. 나른한 척이었다.` },
      { label: '몰래 쪽지를 전하렴', conditions: ['rel.leon >= 30'], effects: { 'rel.leon': +6, 'stat.elo': +3, 'stat.sens': +2, 'pers.roman': +2 },
        result: `{name은} 은촛대 받침 밑에 쪽지를 끼워 두었다. '망토 안 어울림. 우물가에서 봐.' 다음 날 같은 자리에 답장이 있었다. 삐뚤빼뚤한 사과 그림 하나.` },
    ],
  },

  // ══ 묘지기 (홉 영감) — 연쇄 ① 유령 친구 ═══════════════════════════════════
  {
    id: 'b08_grave_lantern', title: '푸른 등불', age: [13, 17], weight: 3.5, requiresActivity: 'graveyard', image: 'bg/graveyard_night',
    text: `묘지기 홉 영감이 {name}에게 등불을 건넸다. "북쪽 담장 밑 작은 비석에선 불이 자꾸 꺼진다. 겁먹지 말고 다시 켜라." 새벽에 돌아온 {name}의 은백색 머리에 서리가 앉아 있었다. "{call}, 그 비석 앞에서 불이 파래졌어. 누가 콧노래를 불렀어. 반죽할 때 부르는 노래 같았어."`,
    choices: [
      { label: '다시 가서 말을 걸어 봐', effects: { 'stat.sens': +3, 'stat.mag': +2, stress: +4, 'pers.roman': +1 }, next: 'b08_grave_girl',
        result: `다음 밤 {name은} 비석 앞에 쪼그려 앉아 같은 노래를 흥얼거렸다. 한 소절이 끝나자 누군가 다음 소절을 받았다. 등불이 다시 파랗게 흔들렸다.` },
      { label: '기도문을 외워 주렴', effects: { 'stat.faith': +4, 'stat.moral': +2, 'pers.good': +1, stress: -2 }, next: 'b08_grave_girl',
        result: `{name은} 비석 앞에서 성당에서 배운 짧은 기도를 외웠다. 기도가 끝나자 콧노래가 멎었다. 대신 아주 작은 목소리가 물었다. "……방금 그거, 나 들으라고 한 거야?"` },
      { label: '그 비석은 피해서 돌아', effects: { stress: -4, trust: +2, 'pers.extro': -1 },
        result: `{name은} 그 뒤로 북쪽 담장을 멀찍이 돌아 순찰했다. 콧노래는 가끔 바람에 실려 왔다. 들릴 때마다 {name은} 등불을 조금 높이 들었다. 그게 인사인 것처럼.` },
      { label: '별빛으로 비춰 봐', conditions: ['flag.magic_awake'], effects: { 'stat.mag': +5, 'stat.sens': +2, 'pers.roman': +1, stress: +3 }, next: 'b08_grave_girl',
        result: `{name이} 손바닥을 펴자 금빛 별 하나가 떠올라 비석 위를 비췄다. 푸른빛과 금빛이 섞였다. 그 사이로 밀가루 묻은 앞치마 자락이 보였다.` },
    ],
  },
  {
    id: 'b08_grave_girl', title: '밀가루 앞치마', chainOnly: true, age: [13, 17], image: 'bg/graveyard_night',
    text: `작은 비석 위에 소녀가 앉아 있었다. 달빛이 몸을 그대로 통과했다. 밀가루 묻은 앞치마, {name과} 비슷한 또래. "너, 내가 보이지? 다들 그냥 지나가." 이름은 에피. 오십 년 전 겨울, 열병으로 잠들었단다. "항구에서 언니랑 빵집 하기로 했는데." 에피가 무릎을 끌어안았다. "나랑 얘기 좀 해 줄래?"`,
    choices: [
      { label: '친구가 되어 주렴', effects: { 'stat.sens': +4, 'pers.roman': +2, stress: -3 }, next: 'b08_grave_promise',
        result: `{name은} 비석 옆에 앉았다. 에피는 오십 년 치 수다를 한꺼번에 쏟아 냈다. {name은} 나른한 얼굴로 끝까지 들었다. 동이 틀 무렵 에피가 물었다. "내일도 와?"` },
      { label: '무엇이 필요한지 들어 봐', check: { stat: 'sens', dc: 165, bonus: (s) => s.stats.mag * 0.3 },
        success: { effects: { 'stat.sens': +5, 'stat.mag': +2, 'stat.moral': +2, trust: +2 }, next: 'b08_grave_promise',
          result: `{name은} 묻지 않고 기다렸다. 한참 뒤 에피가 말했다. "언니가 아직 빵을 굽는지 알고 싶어. 그거면 돼." {name은} 약속하지 않았다. 대신 다음 밤에도 왔다.` },
        fail: { effects: { 'stat.mag': +2, stress: +5, 'pers.extro': -1 }, next: 'b08_grave_promise',
          result: `"너 왜 아직 여기 있어?" 너무 곧장 물었다. 에피의 몸이 안개처럼 흩어졌다. 사흘 동안 비석 앞은 조용했다. 나흘째 밤, 푸른 불이 다시 켜졌다.` } },
      { label: '산 사람과의 선을 지키렴', effects: { 'stat.faith': +4, 'pers.roman': -2, stress: +2 },
        result: `{name은} 에피에게 정중히 고개를 숙였다. "편히 쉬어." 에피는 손을 흔들었다. 그 뒤로 푸른 불은 희미해졌다. {name은} 가끔 북쪽 담장에 대고 짧게 기도했다.` },
    ],
  },
  {
    id: 'b08_grave_promise', title: '이름 하나', chainOnly: true, age: [13, 17],
    text: `그 뒤로 {name}의 밤 근무는 짧게 느껴졌다. 에피는 수수께끼를 좋아했고, {name은} 오십 년 동안 바뀐 마을 이야기를 들려줬다. 어느 새벽, {name이} 신발 끈을 풀다 말고 물었다. "{call}, 에피가 내 이름을 맡아 두고 싶대. 친구끼리는 그런대. 근데 홉 할아버지는 죽은 사람한테 이름을 주면 못 돌려받는댔어. 줘도 돼?"`,
    choices: [
      { label: '네 친구니까 네가 정하렴', effects: { 'flag.ghost_friend': true, trust: +6, 'stat.mag': +3, 'stat.sens': +3 },
        result: `{name은} 그날 밤 에피에게 이름을 알려 주었다. 에피는 그 이름을 세 번 불러 보더니 소중히 접어 넣는 시늉을 했다. 그 뒤로 북쪽 담장의 등불은 꺼지지 않았다.` },
      { label: '이름 대신 별명을 주렴', effects: { 'flag.ghost_friend': true, 'stat.int': +3, 'pers.roman': -1, trust: +2 },
        result: `{name은} '별똥'이라는 별명을 주었다. 에피는 깔깔 웃더니 자기는 '밀가루'라고 했다. 둘은 서로를 그렇게 불렀다. 진짜 이름보다 그쪽이 더 친구 같았다.` },
      { label: '엘다에게 먼저 물어보자', conditions: ['flag.met_elda'], effects: { 'flag.ghost_friend': true, 'rel.elda': +6, 'stat.mag': +4 },
        result: `엘다는 차를 따르며 웃었다. "이름을 주는 건 괜찮아요. 다만 돌려받을 날도 함께 정해 두세요. 좋은 친구는 그날을 지켜요." {name은} 그 말을 그대로 에피에게 전했다.` },
      { label: '이제 묘지 일은 그만두자', effects: { 'flag.b08_ghost_forbidden': true, trust: -8, 'pers.agree': -3, stress: +8 },
        result: `{name은} 대답하지 않았다. 다음 날 홉 영감에게 등불을 돌려주었다. 바람 부는 밤이면 {name}의 방 창문이 북쪽으로 열려 있었다. 당신은 그 창을 닫지 못했다.` },
    ],
  },
  {
    id: 'b08_grave_diggers', title: '자정의 삽 소리', age: [14, 17], weight: 2.2, requiresActivity: 'graveyard', image: 'bg/graveyard_night',
    text: `자정 무렵, 동쪽 언덕에서 삽 소리가 났다. 지난달 묻힌 부잣집 상인의 무덤이다. 등불 셋, 사내 셋. 홉 영감은 감기로 오두막에 누워 있다. {name이} 등불을 낮추고 비석 뒤에 숨었다. 사내 하나가 이쪽을 보더니 동전 주머니를 흔들었다. "꼬마, 못 본 걸로 하면 반 나눠 주마."`,
    choices: [
      { label: '종을 쳐서 마을을 깨워', effects: { reputation: +4, 'stat.moral': +3, stress: +6, 'pers.extro': +1 },
        result: `{name이} 묘지 종을 힘껏 당겼다. 마을 개들이 짖고 창마다 불이 켜졌다. 사내들은 삽을 버리고 달아났다. 무덤은 무사했다. {name은} 며칠 밤 그 얼굴들을 떠올렸다.` },
      { label: '몰래 뒤를 밟아 은신처를 찾아', check: { stat: 'agi', dc: 160, bonus: (s) => Math.min(40, (s.mastery.graveyard || 0) * 4) }, minigame: 'adventure',
        success: { effects: { 'stat.agi': +6, gold: +80, reputation: +5, 'pers.ambit': +1 },
          result: `{name은} 등불을 끄고 그림자를 따라 방앗간 폐창고까지 갔다. 새벽에 경비대가 그곳을 덮쳤다. 상인의 미망인이 포상금과 손편지를 보냈다. '밤을 지켜 줘서 고마워요.'` },
        fail: { effects: { 'stat.agi': +2, 'stat.hp': -4, 'pers.ambit': -1, stress: +8 },
          result: `도랑을 건너다 발목을 접질렸다. 사내들은 어둠 속으로 사라졌다. {name은} 절뚝이며 홉 영감 오두막 문을 두드렸다. 영감이 발목을 감아 주며 혀를 찼다. "목숨값은 품삯에 없다."` } },
      { label: '주머니를 받고 입을 다문다', effects: { gold: +60, infamy: +6, 'stat.moral': -5, 'pers.good': -3 },
        result: `동전 주머니는 묵직했다. 다음 날 상인의 미망인이 파헤쳐진 무덤 앞에서 울었다. {name은} 멀리서 그걸 보았다. 주머니는 그 뒤로 한 번도 열리지 않았다.` },
      // 에피를 만난 아이(연쇄 ①에서 선을 그었어도) 또는 자율 묘지기 경로(night_mud)로 친구가 된 아이
      { label: '푸른 등불에게 도움을 청해', conditions: ['!flag.b08_ghost_forbidden', (s) => !!(s.flags.ghost_friend || s.seen.b08_grave_girl)],
        effects: { 'flag.ghost_friend': true, 'stat.mag': +5, 'stat.sens': +3, reputation: +3 },
        result: `"에피, 도와줘." 묘지 곳곳에서 푸른 불이 하나둘 떠올랐다. 사내들은 비명을 지르며 달아났다. 이튿날 마을엔 '은발 묘지기와 푸른 불' 이야기가 퍼졌다. 에피는 신이 났다.` },
    ],
  },
  {
    id: 'b08_night_mud', title: '붉은 흙발자국', age: [13, 17], weight: 3,
    conditions: ['flag.secret_night_work', '!flag.ghost_friend', '!flag.b08_ghost_forbidden'],
    text: `새벽, 현관에 붉은 흙 자국이 찍혀 있었다. 묘지 언덕에만 나는 흙이다. 요즘 {name은} 낮잠이 길고 손끝이 차다. 아침 식탁에서 {name이} 하품을 하다 말고 중얼거렸다. "……에피는 수수께끼를 너무 어렵게 내." 그러고는 숟가락을 문 채 굳었다.`,
    choices: [
      { label: '다그치지 않고 기다린다', effects: { 'flag.ghost_friend': true, trust: +6, 'stat.sens': +3 },
        result: `당신은 아무것도 묻지 않고 국을 더 떠 주었다. 그날 밤 {name이} 먼저 말했다. 묘지에 빵 냄새 나는 친구가 있다고. "무섭지 않아. 외로운 애야. 나처럼."` },
      { label: '몰래 뒤를 따라가 본다', effects: { 'flag.ghost_friend': true, trust: -4, stress: +4, 'stat.mag': +2 },
        result: `자정, 비석 사이에서 {name을} 찾았다. 아이는 빈 허공에 대고 웃고 있었다. 푸른 불 하나가 곁에서 흔들렸다. {name이} 돌아보았다. "……따라왔어?" 목소리가 차가웠다.` },
      { label: '밤 외출은 금지다', effects: { 'flag.b08_ghost_forbidden': true, trust: -6, 'pers.agree': -3, stress: +6 },
        result: `{name은} 대꾸 없이 방문을 닫았다. 그 뒤로 붉은 흙은 보이지 않았다. 대신 {name}의 창문은 밤마다 북쪽을 향해 조금 열려 있었다.` },
      { label: '축복한 등불을 들려 보낸다', conditions: ["guardian == 'priest'"], effects: { 'flag.ghost_friend': true, 'stat.faith': +5, trust: +4 },
        result: `당신은 성유 한 방울로 등불 심지를 축복해 건넸다. "길 잃은 이에게 불은 나쁜 게 아니란다." {name이} 등불을 받아 들고 오래 당신을 보았다. "{call}, 안 말려?"` },
    ],
  },

  // ══ 상점 (잡화점 구스타) — 연쇄 ④ 밤의 장부 ═══════════════════════════════
  {
    id: 'b08_shop_coin', title: '금화 한 닢', age: [10, 12], weight: 1.8, requiresActivity: 'shop', image: 'bg/market',
    text: `잡화점 계산대. 눈이 어두운 노부인이 실 한 타래 값으로 은화 한 닢 대신 금화를 내밀었다. 거스름돈만 은화 아홉 닢이다. {name이} 머뭇거리는 사이 주인 구스타가 금화를 낚아채며 눈을 찡긋했다. "손님이 주신 거다. 너도 한 닢 줄게." 노부인은 벌써 문을 나서고 있다.`,
    choices: [
      { label: '쫓아가 거스름돈을 드려', effects: { gold: -20, 'stat.moral': +5, 'pers.good': +2, reputation: +2 },
        result: `{name은} 자기 품삯 주머니를 털어 노부인을 쫓아갔다. 구스타는 혀를 찼다. 사흘 뒤 노부인이 사과 파이를 들고 가게에 왔다. 구스타 몫은 없었다.` },
      { label: '주인에게 돌려드리자고 해', check: { stat: 'elo', dc: 85 },
        success: { effects: { 'stat.elo': +5, 'stat.moral': +3, 'pers.extro': +1 },
          result: `"아저씨, 저분 다시 오시면 우리 가게 소문 다 나요." 구스타가 움찔하더니 투덜대며 거스름돈을 셌다. {name은} 노부인 손에 은화를 꼭 쥐여 드렸다.` },
        fail: { effects: { 'stat.moral': +1, stress: +6, 'pers.agree': -1 },
          result: `"한 번만 더 말대꾸하면 품삯에서 깐다." {name은} 입을 다물었다. 그날 밤 이불 속에서 {name이} 말했다. "{call}, 나 아무 말도 못 했어." 목소리가 젖어 있었다.` } },
      { label: '받은 한 닢을 챙긴다', effects: { gold: +15, 'stat.moral': -4, 'stat.elo': +2, 'pers.good': -3 },
        result: `{name은} 구스타가 준 동전을 받았다. 그 돈으로 꿀사탕을 샀지만 먹지 않았다. 사탕은 일주일 동안 주머니 안에서 녹았다.` },
      { label: '기사의 맹세를 떠올려', conditions: ["guardian == 'knight'"], effects: { 'stat.moral': +3, 'stat.eti': +3, trust: +3 },
        result: `"약한 사람 몫에는 손대지 않는다." 당신이 기사 시절 이야기를 할 때마다 붙이던 말이었다. {name은} 그 말을 구스타 앞에서 똑같이 했다. 구스타가 기가 막혀 웃으며 거스름돈을 내주었다.` },
    ],
  },
  {
    id: 'b08_shop_trial', title: '견습이라는 이름', age: [13, 16], weight: 2.2, requiresActivity: 'shop', image: 'bg/market',
    text: `구스타의 잡화점은 '견습 석 달'이라며 품삯을 반만 준다. 그런데 이번 주에만 세 번, 저녁 정산 때 은화가 모자랐다. 구스타는 모자란 만큼을 {name}의 품삯에서 떼고, 한 번만 더 그러면 경비대를 부르겠다고 했다. {name이} 숟가락을 내려놓았다. "{call}, 나 아니야."`,
    choices: [
      { label: '장부를 직접 맞춰 보자', effects: { 'stat.int': +3, trust: +4 }, next: 'b08_shop_ledger',
        result: `{name은} 구스타에게 장부를 보여 달라고 했다. 구스타가 코웃음을 쳤다. "문 닫고 실컷 봐라." 당신은 등잔 기름을 채웠다. "같이 가 줄게." {name은} 고개를 저으려다 말고 끄덕였다.` },
      { label: '당장 그만두게 한다', effects: { trust: +3, stress: -6, gold: -30, 'pers.agree': -1 },
        result: `{name은} 앞치마를 계산대에 내려놓고 나왔다. 떼인 품삯은 돌려받지 못했다. 다음 주, 잡화점 창에 '견습 구함' 쪽지가 다시 붙었다. {name은} 그 앞을 빠르게 지나갔다.` },
      { label: '당신이 가게에 찾아간다', effects: { trust: +4, gold: +40, 'pers.ambit': -1, stress: -3 },
        result: (s) => s.personality.agree >= 10
          ? `당신이 계산대 앞에 서자 구스타는 말을 더듬었다. 떼인 품삯은 그 자리에서 돌아왔다. 돌아오는 길에 {name이} 당신 팔에 슬쩍 매달렸다. "{call}, 아까 좀 멋있었어."`
          : `당신이 계산대 앞에 서자 구스타는 말을 더듬었다. 품삯은 그 자리에서 돌아왔다. 돌아오는 길에 {name이} 중얼거렸다. "고마워. 근데 다음엔 나 혼자서도 할 수 있어."` },
      { label: '길드장에게 편지를 쓴다', conditions: ["guardian == 'merchant'"], effects: { reputation: +4, gold: +60, 'stat.elo': +3, trust: +3 },
        result: `편지를 받은 상인 길드장이 직접 잡화점에 들렀다. 장부를 넘기는 길드장의 금테 안경이 번뜩였다. 구스타는 벌금을 물었고, 견습 품삯은 그날부터 온값이 되었다.` },
    ],
  },
  {
    id: 'b08_shop_ledger', title: '등잔 밑의 장부', chainOnly: true, age: [13, 16], image: 'bg/market',
    text: `가게 문을 닫은 뒤 {name이} 계산대 밑에서 장부와 동전 상자를 꺼냈다. 당신은 등잔을 들어 주었다. 숫자는 맞지 않았다. 그런데 돈이 모자란 날마다 장부 귀퉁이에 같은 표시가 있었다. 구스타의 조카 오도가 '물건 떼러' 들른 날이었다.`,
    choices: [
      { label: '숫자로 증명해 봐', check: { stat: 'int', dc: 240 }, minigame: 'exam',
        success: { effects: { 'stat.int': +6, gold: +80, reputation: +4, 'pers.ambit': +1 },
          result: `{name은} 모자란 액수와 오도가 들른 날을 나란히 적어 구스타 앞에 펼쳤다. 구스타의 얼굴이 붉어졌다. 떼인 품삯에 이자까지 돌아왔다. 오도는 다시 가게에 오지 않았다.` },
        fail: { effects: { 'stat.int': +2, stress: +8, 'pers.agree': -1 },
          result: `숫자가 자꾸 엉켰다. 구스타는 장부를 덮었다. "조카를 모함해?" {name은} 그날로 일을 그만뒀다. 한 달 뒤 오도가 다른 가게에서 쫓겨났다는 소문이 들려왔다.` } },
      { label: '오도가 오는 날 지켜봐', effects: { 'stat.agi': +3, 'stat.elo': +3, gold: +50, stress: +6 },
        result: `오도가 '물건 떼러' 오는 날, {name은} 창고 정리를 자청했다. 문틈으로 오도가 은화를 소매에 쓸어 넣는 게 보였다. {name은} 구스타를 조용히 불러 그 소매를 가리켰다. 구스타는 할 말을 잃었다.` },
      { label: '가죽 장부와 맞춰 봐', conditions: ['item.ledger_book >= 1'], effects: { 'stat.int': +5, 'stat.elo': +2, gold: +80, trust: +3 },
        result: `{name은} 첫날부터 가죽 장부에 자기 손으로 받은 돈을 따로 적어 두었다. 두 장부를 나란히 펴자 빈 곳이 한눈에 보였다. 구스타는 아무 말 못 하고 품삯을 셈했다.` },
      { label: '구스타에게 조용히 먼저 말해', effects: { 'stat.eti': +3, 'stat.moral': +3, gold: +30, stress: -2 },
        result: `{name은} 장부를 들고 구스타를 따로 불렀다. 구스타는 한참 숫자를 보다 한숨을 쉬었다. 조카 일은 집안에서 해결하겠다고 했다. 품삯은 돌아왔다. 사과는 없었다.` },
    ],
  },

  // ══ 극단 — 연쇄 ② 대역 ════════════════════════════════════════════════════
  {
    id: 'b08_theater_understudy', title: '마흔 장의 대사', age: [12, 15], weight: 2, requiresActivity: 'theater', npc: 'troupe',
    text: `극단 단장이 깃털 모자를 쥐어뜯었다. "미엘이 목이 부었소! 공연은 모레! 대사는 마흔 장!" 이번 극에서 {name}의 역은 '등불 든 마을 사람 셋째'였다. 단장의 눈이 {name}에게서 멈췄다. "자네, 연습 때 미엘 대사를 따라 중얼거리던데?" {name이} 눈을 느리게 깜박였다.`,
    choices: [
      { label: '밤새 대사를 외워 봐', effects: { 'stat.int': +3, stress: +8, 'pers.ambit': +2 }, next: 'b08_theater_curtain',
        result: `{name은} 대본을 베개 밑에 넣고 물을 길으면서도 대사를 중얼거렸다. 큐브가 악당 역을 맡아 주었다. 너무 신이 나서 대본에 없는 대사까지 했다.` },
      { label: '미엘이 나을 때까지 미루자 해', effects: { 'stat.moral': +4, 'pers.ambit': -2, gold: -20, 'flag.b08_miel_friend': true },
        result: `"미엘 역은 미엘이 해야죠." 단장은 털썩 주저앉았지만 공연을 일주일 미뤘다. 미엘이 쉰 목소리로 편지를 보냈다. '다음 무대엔 너랑 같이 서고 싶어.'` },
      { label: '모자란 건 즉흥으로 채워', effects: { 'stat.elo': +4, 'pers.extro': +2, stress: +4 }, next: 'b08_theater_curtain',
        result: `"줄거리만 알면 돼요. 말은 그때그때." 단장이 비명을 질렀다가 연습 장면을 보고 입을 다물었다. 대본과 달랐지만, 대본보다 웃겼다.` },
      { label: '노래 장면은 류트로 바꿔', conditions: ['item.lute >= 1'], effects: { 'stat.sens': +4, 'stat.chm': +2, 'pers.roman': +1, stress: +3 }, next: 'b08_theater_curtain',
        result: `미엘의 긴 노래 장면을 {name}의 류트 연주로 바꿨다. 외울 대사가 열 장 줄었다. 단장이 손뼉을 쳤다. "이거요! 왜 진작 이 생각을 못 했지!"` },
    ],
  },
  {
    id: 'b08_theater_curtain', title: '막이 오른다', chainOnly: true, age: [12, 15], image: 'bg/theater_stage',
    text: `공연 날 저녁. 분장대 거울 앞에서 {name이} 은백색 머리를 땋아 올렸다. 거울 속에 낯선 소녀가 있었다. 객석은 꽉 찼다. 목에 수건을 감은 미엘이 무대 옆에서 쉰 목소리로 속삭였다. "첫 줄만 넘기면 돼. 그다음은 무대가 데려가."`,
    choices: [
      { label: '무대 한가운데로 걸어 나가', check: { stat: 'chm', dc: 130 }, minigame: 'ball',
        success: { effects: { 'flag.stage_star': true, 'stat.chm': +8, 'stat.sens': +4, reputation: +5, 'pers.extro': +3 },
          result: `첫 줄이 객석 끝까지 닿았다. 그다음은 정말 무대가 데려갔다. 막이 내리자 미엘이 쉰 목소리로 외쳤다. "봤지? 데려가지?" 분장을 지우는 내내 {name}의 머리칼 사이에서 금빛 별이 가라앉지 않았다.` },
        fail: { effects: { 'stat.chm': +3, 'stat.sens': +2, 'pers.extro': -1, stress: +8 },
          result: `둘째 막에서 대사 한 줄이 통째로 사라졌다. 침묵이 길었다. 맨 앞줄 꼬마가 그 대사를 대신 외쳤다. 다들 웃었고 박수가 나왔다. {name은} 분장을 지우며 한숨만 쉬었다.` } },
      { label: '미엘과 한 무대를 나눠', effects: { 'flag.b08_miel_friend': true, 'stat.chm': +3, 'stat.sens': +4, 'stat.moral': +2 },
        result: `미엘이 무대에서 몸짓을 하면 {name이} 막 뒤에서 대사를 했다. 둘이 한 사람이었다. 막이 내리자 미엘이 {name을} 끌어안고 쉰 목소리로 속삭였다. "다음엔 진짜로 같이 서자."` },
      { label: '대사 대신 춤으로 말해', conditions: ['item.dancing_shoes >= 1'], effects: { 'flag.stage_star': true, 'stat.agi': +4, 'stat.chm': +5, stress: +4 },
        result: `긴 독백 장면에서 {name은} 무용화 끈을 조이고 대사 대신 춤을 췄다. 단장이 무대 옆에서 얼어붙었다. 객석은 숨을 죽였다. 극단 장부에 새 배역이 생겼다. '별의 춤'.` },
    ],
  },
  {
    id: 'b08_theater_wages', title: '박수도 품삯이다', age: [13, 16], weight: 2, requiresActivity: 'theater', image: 'bg/theater_stage',
    text: `극단 회계 바르톨은 어린 단역들 품삯을 "배우는 중이니 반값"이라며 깎는다. 나머지 반이 어디로 가는지는 아무도 모른다. 오늘 {name이} 품삯 대신 쪽지 한 장을 들고 왔다. '박수도 품삯이다. — 바르톨.' 함께 일하는 꼬마 단역 셋은 집에 약값이 급하다.`,
    choices: [
      { label: '단장님께 장부를 보여 드려', check: { stat: 'int', dc: 120 },
        success: { effects: { 'stat.int': +4, gold: +70, reputation: +3, 'pers.good': +2 },
          result: `단장은 장부를 넘기다 깃털 모자를 바닥에 내던졌다. "내 극단에서!" 바르톨은 그날로 짐을 쌌다. 밀린 품삯이 돌아왔다. 꼬마 단역들이 {name}의 이름을 연호했다.` },
        fail: { effects: { 'stat.int': +2, stress: +8, 'pers.agree': -2 },
          result: `"바르톨은 이십 년 지기요." 단장은 장부를 덮었다. 바르톨이 {name} 쪽을 보며 웃었다. 그 웃음이 한 달 내내 무대 뒤를 따라다녔다.` } },
      { label: '단역들과 막을 멈춘다', effects: { 'stat.elo': +5, 'pers.extro': +3, 'pers.agree': -3, gold: +50, infamy: +2, stress: +6 },
        result: `그날 막은 십 분 늦게 올랐다. 무대 뒤에서 단역 열 명이 팔짱을 끼고 섰고, 한가운데 {name이} 있었다. 단장은 바르톨을 내보냈다. 고집 센 꼬마라는 소문도 함께 돌았다.` },
      { label: '당신이 극단을 찾아간다', effects: { trust: +5, gold: +50, reputation: +2, gHealth: -2 },
        result: `당신은 단장과 바르톨을 한자리에 앉혔다. 어른 셋의 대화는 길지 않았다. 바르톨은 떠났고 품삯은 돌아왔다. {name은} 무대 뒤에서 당신을 보며 조그맣게 엄지를 세웠다.` },
      { label: '이번엔 참고 넘어가', effects: { 'stat.eti': +2, 'pers.agree': +2, stress: +6 },
        result: `{name은} 쪽지를 접어 주머니에 넣었다. 아무것도 바뀌지 않았다. 다음 달, 꼬마 단역 하나가 극단을 그만뒀다. {name은} 그 아이가 들던 등불 소품을 한참 바라보았다.` },
    ],
  },
  {
    id: 'b08_theater_tour', title: '두 달의 마차', age: [15, 17], weight: 2, requiresActivity: 'theater', npc: 'troupe',
    text: `단장이 마차 세 대를 빌렸다. 항구에서 왕도까지 두 달 순회공연. "자네 자리도 있소!" {name이} 대본 묶음을 끌어안고 당신을 보았다. 얼굴은 무표정한데 별빛이 자꾸 새어 나왔다. 두 달이면 밭일도 집안일도, 당신 저녁상도 남이 챙겨야 한다.`,
    choices: [
      { label: '가서 부딪쳐 보렴', check: { stat: 'chm', dc: 250, bonus: (s) => s.stats.elo * 0.15 },
        success: { effects: { 'flag.stage_star': true, 'stat.chm': +8, 'stat.elo': +4, gold: +120, stress: +6 },
          result: `두 달 뒤 {name}의 짐 속엔 도시마다의 공연 전단이 있었다. 이름이 점점 커졌다. 마지막 전단엔 맨 위였다. "{call}, 왕도 사람들은 박수를 발로 쳐."` },
        fail: { effects: { 'stat.chm': +4, gold: +60, stress: +8 },
          result: `두 달 내내 합창단 맨 끝줄이었다. 대사는 세 줄. {name은} 그 세 줄을 도시마다 조금씩 다르게 말해 봤다. 돌아와서 말했다. "다음엔 맨 앞줄이야."` } },
      { label: '가까운 무대만 서렴', effects: { trust: -2, 'stat.chm': +3, 'pers.ambit': -2, stress: -4 },
        result: `{name은} 마차가 떠나는 걸 언덕에서 오래 보았다. 그해 여름 장날 무대에서 일인극을 했다. 관객은 서른 명. "서른 명이면 한 명 한 명 얼굴이 다 보여." 나쁘지 않은 얼굴이었다.` },
      { label: '주연 자리를 걸고 가렴', conditions: ['flag.stage_star'], effects: { 'stat.chm': +10, reputation: +8, stress: +10, 'pers.ambit': +3, gold: +150 },
        result: `순회공연의 간판은 {name이었}다. 도시마다 객석이 넘쳤다. 돌아오는 마차에서 {name은} 내내 잤다. 집 문을 열자마자 한마디 했다. "{call}, 밥."` },
      { label: '미엘과 짝을 이뤄 떠나렴', conditions: ['flag.b08_miel_friend'], effects: { 'flag.stage_star': true, 'stat.chm': +6, 'stat.sens': +4, stress: +3 },
        result: `미엘과 {name은} 두 달 내내 한 마차, 한 무대를 썼다. 한 사람이 대사를 잊으면 다른 사람이 받았다. 왕도 평론가가 썼다. '두 소녀는 서로의 그림자처럼 빛났다.'` },
    ],
  },
];
