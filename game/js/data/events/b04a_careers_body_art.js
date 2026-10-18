// 배치 b04a — 진로 A: 몸과 예술의 길 (15~17세, 준비 단계는 15세부터)
// 선장 · 편력 기사 · 무희 · 의상 명인 · 명장 대장장이 + 근위기사단장/극단 스타/궁정악사/요리사/여관 주인/농장주 엔딩 지원
// 규칙: docs/game-design/content-contract.md  (id·비공개 플래그 접두사 b04a_)
//
// 진로별 단계 (← 랜덤 등장, ⇒ chainOnly 연쇄)
//   선장       sea_offer ⇒ sea_deck [sea_path] ← sea_storm [b04a_sea_trusted] ← sea_letter(17)
//   편력 기사   errant_guest [b04a_errant_friend] ← errant_escort ⇒ errant_oath [knight_oath_wander]
//   근위기사    guard_trial [knight_path] ← guard_night_gate (core career_knight 수락 경로도 이어받음)
//              (편력 기사 루트와 갈림길: errant_oath의 '성벽 안의 길' · guard_trial의 '성 밖의 길')
//   무희       dance_invite(dance_lessons) | dance_festival(매력·민첩) [b04a_dance_company]
//              ← dance_rehearsal [b04a_dance_ready] ⇒ dance_debut [prima_debut]  (무도회 미니게임)
//              (대역을 사양하면 dance_debut이 다음 시즌에 랜덤으로 온다: seen.b04a_dance_rehearsal 조건)
//   의상 명인   tailor_order [b04a_tailor_name] ← tailor_contest ⇒ tailor_atelier ⇒ tailor_show [fashion_show]
//   명장       smith_blade [b04a_smith_blade] ← smith_star_iron ⇒ smith_forge [masterwork]
//              (담금질 실패 시 b04a_smith_cracked ← smith_second_fire [masterwork])
//   궁정악사    art_recital [art_path]
//   지원       stage_lead(극단 스타) · cook_banquet(요리사) · inn_keys(여관 주인) · farm_field(농장주)
//   공통       career_dream(15) [b04a_dream_told] ← dream_revisit(17)
// 연쇄(⇒ next) 5개: ① sea_offer ⇒ sea_deck ② errant_escort ⇒ errant_oath ③ tailor_contest ⇒ tailor_atelier ⇒ tailor_show
//                  ④ smith_star_iron ⇒ smith_forge ⑤ dance_rehearsal ⇒ dance_debut (dance_debut은 랜덤 재진입도 가능)
// 미니게임(판정 23개 중 5개): 모험 errant_escort·guard_trial(대련) · 무도회 dance_festival·dance_debut · 요리 cook_banquet
// 보호자 knight 출신의 과거(b06: 흑교의 오명)와 어긋나지 않게, 그 이름을 내세우는 장면은 guardian_name_cleared로 갈린다.
// 반복 등장 보조 인물(관계 수치 없음): 마렌 선장(상선 샛별호, 가렛의 옛 동료) · 갑판장 베인 · 로데릭(회색 망토의 편력
//   기사. b04b의 등대 관측사 오스윈과 다른 사람) · 셀린(극단의 주역 무희) · 베라 할머니(재봉소) · 도르완 영감(대장장이,
//   네리의 할아버지) · 고든 아저씨(식당) · 한스 아저씨(이웃 농부, b01·b08과 같은 사람) · 「세 개의 달」 노부부(여관, b08과 공유)
// 공주의 결(character-design.md v2): 은백색 생머리, 차분하고 살짝 나른한 붉은 눈. 호들갑 대신 담담하게 말하고,
//   감정이 일렁이면 말보다 먼저 손끝에서 금빛 별이 새어 나온다.
export default [
  // ── 공통: 장래 희망 ──────────────────────────────────────────────────
  {
    id: 'b04a_career_dream', title: '열다섯의 장래 희망', age: [15, 15], weight: 2.5, npc: 'cube',
    text: `저녁상을 치우던 큐브가 불쑥 물었다. "아가씨는 커서 뭐가 되실 거예요? 저는 케이크 가게요!" {name이} 포크를 내려놓고 당신을 보았다. 웃어넘기기엔 눈빛이 진지했다. "{call}, 나 이제 열다섯이야. 슬슬 정해야 하는 거지?"`,
    choices: [
      { label: '하고 싶은 걸 말해 봐', effects: { trust: +4, stress: -4, 'rel.cube': +2, 'flag.b04a_dream_told': true },
        result: (s) => dreamLine(s) },
      { label: '안정적인 길을 권한다', effects: { 'stat.int': +3, 'pers.ambit': -1, 'pers.agree': +1, trust: -2 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 고개를 끄덕였다. "그래, {call} 말이 맞겠지." 그런데 그날 밤, 아이 방에서 한숨 소리가 오래 들렸다.`
          : s.personality.agree <= -10
            ? `"그건 {call}의 꿈이잖아." {name이} 의자를 밀고 일어났다. 문 닫히는 소리가 평소보다 조금 컸다.`
            : `{name은} 대답 대신 접시를 마저 닦았다. "생각해 볼게." 생각해 보겠다는 얼굴은 아니었다.` },
      { label: '일단 다 해 보자', effects: { 'pers.extro': +2, 'stat.sens': +2, 'stat.agi': +2, 'stat.str': +2, gold: -40, stress: +3, 'flag.b04a_dream_told': true },
        result: `한 달 동안 {name은} 항구의 배, 대장간, 재봉소, 극단 연습실을 차례로 기웃거렸다. 돌아올 때마다 신발은 더러웠고 얼굴은 밝았다.` },
      { label: '갈래길을 표로 그려 준다', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +4, 'stat.cult': +2, trust: +2, 'pers.roman': -2, 'flag.b04a_dream_told': true },
        result: `당신은 종이에 길을 그렸다. 갈래마다 필요한 것, 걸리는 해, 드는 돈. {name이} 한참 보다 웃었다. "{call}, 이건 지도가 아니라 시험지 같아." 그래도 벽에 붙여 두었다.` },
    ],
  },

  // ── 선장 (연쇄 ①) ───────────────────────────────────────────────────
  {
    id: 'b04a_sea_offer', title: '샛별호', age: [15, 17], weight: 2.5, image: 'bg/harbor',
    conditions: ['stat.hp >= 180', 'stat.agi >= 130', '!flag.sea_path'],
    text: `항구에서 돌아온 {name}의 손바닥에 밧줄 자국이 나 있었다. 가렛의 옛 동료라는 마렌 선장의 배, 샛별호에 짐 싣는 일을 거들었단다. "다음 달 연안 항해에 견습 선원으로 타 보래. 열흘이면 돌아와." 말은 담담한데 손끝에서 금빛 별이 자꾸 새어 나왔다.`,
    choices: [
      { label: '열흘만 다녀와 봐', effects: { 'stat.agi': +3, trust: +4, stress: +4, 'pers.extro': +1 },
        result: `"응. 열흘." {name은} 짧게 대답하고 방으로 들어갔다. 그날 밤 문틈으로 밧줄 매듭 묶는 소리와 금빛 별이 늦도록 새어 나왔다.`, next: 'b04a_sea_deck' },
      { label: '바다는 위험하다', effects: { trust: -4, stress: +6, 'pers.agree': -1, 'stat.sens': +2 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 입술을 깨물고 고개를 끄덕였다. 그 뒤로 항구 쪽 길로는 다니지 않았다. 일부러 돌아서 가는 것 같았다.`
          : `"{call}도 젊을 땐 위험한 거 했잖아." 그 뒤로 {name은} 며칠씩 항구에서 늦게 돌아왔다. 배를 보고만 왔다고 했다.` },
      { label: '나도 함께 탄다', conditions: ["guardian == 'adventurer'"], effects: { 'flag.sea_path': true, 'stat.agi': +5, 'stat.hp': +3, trust: +6, gHealth: -5, 'rel.garrett': +3 },
        result: `"마렌? 그 고집쟁이가 아직 배를 몬다고?" 당신도 짐을 꾸렸다. 열흘 동안 옛 매듭을 가르쳤더니 {name은} 당신보다 빨리 묶었다. 둘 다 볕에 그을려 돌아왔다.` },
      { label: '집 나갔던 날을 묻는다', conditions: ['flag.ran_away'], effects: { trust: +6, 'pers.roman': +2, stress: -3, 'stat.sens': +2 },
        result: `"……그날도 항구부터 갔었어. 저 배가 있었고." {name이} 작게 웃었다. "도망치려던 게 아니라, 어디로든 갈 수 있다는 걸 보고 싶었어." 이번엔 인사를 하고 떠나기로 했다.`, next: 'b04a_sea_deck' },
    ],
  },
  {
    id: 'b04a_sea_deck', title: '갑판의 열흘', chainOnly: true, age: [15, 17], image: 'bg/harbor',
    text: `출항 전날 밤, {name이} 짐을 쌌다 풀었다 했다. "마렌 선장님이 쓸모 있는 애만 다시 태운대. 가서 뭐부터 배워야 할까?" 창밖으로 항구 등대가 깜빡였다. 열흘. 짧고도 긴 시간이다.`,
    choices: [
      { label: '돛대에 먼저 올라 봐', check: { stat: 'agi', dc: 200 },
        success: { effects: { 'stat.agi': +8, 'stat.hp': +3, 'flag.sea_path': true, reputation: +3, 'pers.extro': +2 },
          result: `열흘 뒤 {name은} 볕에 새까맣게 그을려 돌아왔다. "{call}, 꼭대기에서 보면 바다가 둥글어." 나른한 목소리였지만 눈은 아직 바다에 있었다. 마렌 선장이 말했다. "다음에도 태우지."` },
        fail: { effects: { 'stat.agi': +4, stress: +6, 'flag.sea_path': true, 'pers.ambit': +1 },
          result: `돛대 중간에서 얼어붙어 갑판장이 끌어내렸단다. 그래도 마지막 날엔 꼭대기까지 갔다고. {name은} 손바닥 물집을 훈장처럼 내밀었다.` } },
      { label: '궂은일부터 해라', effects: { 'stat.hp': +6, 'stat.moral': +3, 'pers.agree': +1, 'flag.sea_path': true, 'rel.garrett': +2 },
        result: `{name은} 열흘 내내 갑판을 닦고 밧줄을 감았다. 늙은 갑판장 베인이 매듭 일곱 가지를 가르쳐 주었다. "말없이 손 놀리는 녀석이 오래 버티지."` },
      { label: '별자리 도감을 챙겨 가', conditions: ['item.star_atlas >= 1'], effects: { 'stat.int': +6, 'stat.sens': +3, 'flag.sea_path': true, trust: +3 },
        result: `항해사 어깨 너머로 {name은} 밤마다 도감을 펼쳤다. 돌아와서는 천장에 별 지도를 그렸다. "북쪽 끝 별, 저게 집으로 오는 길이래."` },
      { label: '항해 일지를 써 오렴', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +4, 'stat.elo': +3, 'flag.sea_path': true, trust: +4 },
        result: `{name}의 항해 일지는 바람, 물빛, 갑판장의 잔소리까지 빼곡했다. 당신은 그 일지를 서재 맨 좋은 칸에 꽂았다. 마렌 선장도 한 부 베껴 갔다.` },
    ],
  },
  {
    id: 'b04a_sea_storm', title: '폭풍철의 항해', age: [16, 17], weight: 3.5, image: 'bg/harbor',
    conditions: ['flag.sea_path'],
    text: `마렌 선장이 다시 찾아왔다. 남쪽 섬까지 한 달짜리 항해, 폭풍철 끝물이다. "저 녀석, 손이 빠르고 겁이 적당히 있어. 선원으로 그만한 게 없지." {name은} 이미 짐을 반쯤 싸 두었다. "{call}, 이번엔 한 달이야. 다녀와도 되지?"`,
    choices: [
      { label: '돛을 맡겠다고 해라', check: { stat: 'agi', dc: 290, bonus: (s) => s.stats.hp * 0.1 },
        success: { effects: { 'stat.agi': +12, 'stat.hp': +6, reputation: +6, 'pers.ambit': +2, 'flag.b04a_sea_trusted': true },
          result: `폭풍이 돛을 찢으려던 밤, {name이} 돛대에 올라 줄을 풀어 돛을 살렸단다. 돌아온 아이의 별명은 '은빛 갈매기'. 마렌 선장이 우유로 건배했다.` },
        fail: { effects: { 'stat.agi': +6, 'stat.hp': -4, stress: +10, trust: +2, 'pers.roman': -1 },
          result: `미끄러져 팔을 삐었다. 배는 무사히 돌아왔고, {name은} 붕대 감은 팔로 웃었다. "바다가 이번엔 나를 시험했어. 다음엔 내가 이길 거야."` } },
      { label: '사람들을 챙기라고 해라', effects: { 'stat.moral': +5, 'stat.elo': +4, 'stat.hp': +3, stress: +5, 'flag.b04a_sea_trusted': true },
        result: `폭풍 속에서 {name은} 겁에 질린 막내 선원 둘을 붙들고 노래를 불렀다. 마렌 선장이 말했다. "배는 돛으로 가지만, 사람은 저런 녀석이 붙든다."` },
      { label: '이번 항해는 안 된다', effects: { trust: -5, stress: +8, 'pers.agree': -1, 'stat.sens': +2 },
        result: (s) => s.personality.agree >= 0
          ? `{name은} 말없이 짐을 풀었다. 샛별호가 떠나는 날, 언덕 위에서 돛이 수평선 너머로 사라질 때까지 서 있었다.`
          : `"한 번 보내 줬으면서 왜 이제 와서?" 문이 쾅 닫혔다. 그달 내내 {name은} 항구 쪽으로만 산책을 나갔다.` },
      { label: '가렛에게 동행을 부탁한다', conditions: ['rel.garrett >= 50'], effects: { 'rel.garrett': +5, 'stat.str': +4, 'stat.agi': +5, trust: +3, 'flag.b04a_sea_trusted': true },
        result: `"애 보러 가는 거지, 바다 보러 가는 거 아니다." 투덜대던 가렛이 갑판에서 제일 신나 보였다. 둘은 폭풍을 함께 버텼고, {name이} 가렛에게 새 매듭을 가르쳤다.` },
    ],
  },
  {
    id: 'b04a_sea_letter', title: '갈매기 봉랍', age: [17, 17], weight: 3.5, image: 'bg/harbor',
    conditions: ['flag.b04a_sea_trusted'],
    text: `갈매기 문장이 찍힌 편지가 왔다. 마렌 선장의 투박한 글씨. "내년 봄, 샛별호 이등항해사 자리를 비워 두겠다. 열여덟 먹은 항해사는 처음이지만, 저 녀석이라면 처음이어도 된다." {name이} 편지를 두 번, 세 번 읽었다.`,
    choices: [
      { label: '축하해, 항해사님', effects: { 'stat.elo': +4, 'stat.agi': +5, reputation: +5, trust: +4, 'pers.ambit': +2 },
        result: `{name은} 편지를 액자에 넣어 벽에 걸었다. 그 밑에 작은 글씨를 덧붙였다. '첫 배는 {call이} 태워 줬다.'` },
      { label: '조건을 따져 답장해', check: { stat: 'elo', dc: 210 },
        success: { effects: { gold: +150, 'stat.elo': +8, 'pers.roman': -2 },
          result: `{name은} 답장에 몫과 휴가 조건을 또박또박 적었다. 선장의 답은 한 줄이었다. "좋아. 이제 진짜 항해사 같군." 계약금이 먼저 도착했다.` },
        fail: { effects: { stress: +5, 'stat.elo': +3, 'pers.ambit': +1 },
          result: `흥정하는 답장을 보냈다가 "배는 장터가 아니다"라는 꾸중만 들었다. 자리는 그대로였다. {name은} 얼굴이 빨개져서 편지를 접었다.` } },
      { label: '가까운 바다를 권한다', effects: { trust: -3, 'pers.roman': -2, 'stat.hp': +3, stress: +4 },
        result: (s) => s.personality.roman >= 20
          ? `"가까운 바다는 바다가 아니야." {name은} 편지를 품에 넣고 방으로 들어갔다. 답장은 당신 몰래 썼다.`
          : `{name은} 한참 생각하더니 고개를 끄덕였다. "연안 배도 배니까." 그래도 샛별호의 편지는 버리지 않았다.` },
      { label: '배 고양이를 데려가렴', conditions: ['flag.has_cat'], effects: { 'stat.sens': +4, stress: -8, trust: +3 },
        result: `"배에는 쥐잡이 고양이가 꼭 있어야 한대." 난롯가의 달무리는 하품만 했다. {name은} 결국 달무리를 꼭 닮은 새끼 고양이를 얻어 오기로 했다.` },
    ],
  },

  // ── 편력 기사 (연쇄 ②) ───────────────────────────────────────────────
  {
    id: 'b04a_errant_guest', title: '회색 망토의 손님', age: [14, 17], weight: 3.5,
    conditions: ['stat.str >= 220'],
    text: `비 오는 밤, 문을 두드린 건 회색 망토의 늙은 기사였다. 문장 없는 방패는 찌그러져 있었다. "로데릭이라 하오. 처마 끝만 빌려주시오." {name이} 그 방패를 오래 보았다. 칼자국마다 사연이 하나씩 있을 것 같았다.`,
    choices: [
      { label: '안으로 모신다', effects: { 'flag.b04a_errant_friend': true, 'stat.moral': +4, 'pers.roman': +2, gold: -10 },
        result: `로데릭은 밤새 길 위의 이야기를 했다. 다리를 지킨 이야기, 우물을 되찾은 이야기. {name은} 졸린 눈을 비비며 물었다. "기사가 꼭 왕을 섬겨야 하는 건 아니네요?"` },
      { label: '대련을 청하게 한다', check: { stat: 'str', dc: 290 },
        success: { effects: { 'stat.str': +6, 'stat.agi': +4, 'flag.b04a_errant_friend': true, 'pers.extro': +1 },
          result: `마당에서 목검이 세 번 부딪쳤다. 세 번째에 로데릭이 웃으며 물러섰다. "칼이 정직하구려. 정직한 칼은 길 위에서 오래가오."` },
        fail: { effects: { 'stat.str': +3, stress: +4, 'flag.b04a_errant_friend': true, 'pers.ambit': +1 },
          result: `한 합 만에 목검이 날아갔다. 로데릭이 그것을 주워 건넸다. "지는 법부터 아는 기사가 오래 사오." {name은} 분해서 밤새 뒤척였다.` } },
      { label: '헛간만 내준다', effects: { 'stat.int': +2, 'pers.roman': -1, stress: -2 },
        result: `로데릭은 고개 숙여 인사하고 헛간에서 잤다. 새벽에 보니 장작이 한 더미 패여 있었고 사람은 없었다. {name이} 빈 헛간을 오래 들여다보았다.` },
      { label: '옛 동료를 알아본다', conditions: ["guardian == 'knight'"], effects: { 'flag.b04a_errant_friend': true, trust: +5, 'stat.cult': +3, 'pers.roman': +1 },
        result: `"……자네였군." 로데릭이 당신 손을 맞잡았다. 기사단을 떠난 이유는 둘 다 묻지 않았다. {name이} 두 사람을 번갈아 보며 눈을 반짝였다.` },
    ],
  },
  {
    id: 'b04a_errant_escort', title: '다리목의 통행세', age: [16, 17], weight: 3.5, image: 'bg/road',
    conditions: ['flag.b04a_errant_friend'],
    text: `로데릭의 편지가 왔다. 동쪽 다리목에 건달패가 자리 잡고 장 보러 가는 사람들에게 통행세를 뜯는다고. "보름간 곡식 수레를 호위하려 하오. 따님이 원한다면 함께하고 싶소." 편지를 읽는 동안 {name은} 벌써 칼을 닦고 있었다.`,
    choices: [
      { label: '함께 가게 한다', check: { stat: 'str', dc: 400, bonus: (s) => s.stats.agi * 0.2 }, minigame: 'adventure',
        success: { effects: { 'stat.str': +10, 'stat.agi': +5, reputation: +6, 'pers.good': +3 },
          result: `다리목의 건달 다섯이 {name} 앞에서 칼을 내려놓았다. 다친 사람 하나 없이. 마을 사람들이 수레에서 사과를 꺼내 던져 주었다. 로데릭이 말없이 고개를 끄덕였다.`, next: 'b04a_errant_oath' },
        fail: { effects: { 'stat.str': +5, 'stat.hp': -4, stress: +8, 'pers.good': +1 },
          result: `건달패는 물러갔지만 {name은} 팔에 시퍼런 멍이 들었다. 로데릭이 직접 업어 데려왔다. "다친 건 팔이고, 지킨 건 수레요. 장사로 치면 남는 장사지."`, next: 'b04a_errant_oath' } },
      { label: '말로 길을 열게 한다', check: { stat: 'elo', dc: 220 },
        success: { effects: { 'stat.elo': +8, 'stat.moral': +4, reputation: +4, 'pers.good': +2 },
          result: `{name은} 칼 대신 빵 바구니를 들고 건달패 앞에 앉았다. 알고 보니 일감을 잃은 뱃사공들이었다. 다리 보수 일을 주선하자 통행세는 사라졌다.`, next: 'b04a_errant_oath' },
        fail: { effects: { 'stat.elo': +3, stress: +6, 'pers.extro': -1 },
          result: `말은 통하지 않았다. 결국 로데릭이 칼을 반쯤 뽑았고, 건달패는 그 칼날만 보고 흩어졌다. {name은} 돌아오는 내내 할 말을 곱씹었다.`, next: 'b04a_errant_oath' } },
      { label: '위험하다며 말린다', effects: { trust: -4, 'pers.agree': -2, stress: +6, 'stat.str': +2 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 칼을 다시 벽에 걸었다. 보름 뒤 다리목이 조용해졌다는 소식이 들렸다. 기뻐하면서도 {name은} 한참 창밖만 보았다.`
          : `"로데릭 님은 혼자 가셨어. 혼자." {name이} 당신을 똑바로 보았다. 그 뒤로 며칠 동안 아이는 말을 아꼈다.` },
      { label: '가렛의 용병을 보낸다', conditions: ['rel.garrett >= 40', 'gold >= 100'], effects: { gold: -100, 'rel.garrett': +5, 'pers.good': -1, reputation: +2 },
        result: `가렛의 용병 넷이 다리목을 깔끔하게 정리했다. {name은} 고맙다고 하면서도 어딘가 시무룩했다. "기사는 돈으로 부르는 게 아닌데."` },
    ],
  },
  {
    id: 'b04a_errant_oath', title: '길 위의 맹세', chainOnly: true, age: [16, 17], image: 'bg/road',
    text: `호위를 마친 다음 날 새벽, 로데릭이 {name과} 당신을 길가의 낡은 사당으로 불렀다. "편력 기사의 맹세는 셋이오. 약한 이의 편에 서고, 받은 것보다 많이 돌려주고, 길이 끝날 때까지 걷는 것." 그가 당신을 보았다. 보호자에게 먼저 묻는 것이 예법이라 했다.`,
    choices: [
      { label: '맹세하게 둔다', effects: { 'flag.knight_oath_wander': true, 'stat.moral': +8, 'stat.faith': +4, trust: +5, 'pers.good': +3 },
        result: (s) => s.personality.ambit >= 25
          ? `{name은} 방패를 받아 들고 말했다. "언젠가 이 방패에 제 문장을 새길 거예요. 길 위의 모두가 알아보게." 로데릭이 크게 웃었다.`
          : s.personality.roman >= 25
            ? `맹세를 마친 {name은} 사당 너머로 뻗은 길을 보았다. "끝이 안 보여서 좋다." 해가 바로 그 길 끝에서 떠오르고 있었다.`
            : `{name은} 맹세의 말을 또박또박 따라 했다. 목소리가 떨리지 않았다. 로데릭이 문장 없는 방패를 아이 등에 매 주었다.` },
      { label: '맹세를 스스로 짓게 한다', conditions: ['stat.moral >= 150'], effects: { 'flag.knight_oath_wander': true, 'stat.moral': +6, 'stat.elo': +5, 'pers.agree': -2, 'pers.roman': +2, trust: +3 },
        result: `{name은} 셋째 맹세를 바꾸었다. "길이 끝나면, 집으로 돌아온다." 로데릭이 한참 말이 없다가 고개를 끄덕였다. "그게 더 어려운 맹세요."` },
      { label: '성벽 안의 길을 택한다', conditions: ['flag.knight_path'], effects: { 'stat.eti': +5, 'stat.moral': +3, 'pers.ambit': +2 },
        result: `"저는 성벽 안을 지키기로 했어요." 로데릭은 서운한 기색 없이 방패를 거두었다. "성벽 안에도 약한 이는 있소. 잊지 마시오."` },
      { label: '아직 이르다', effects: { trust: -4, 'pers.agree': -2, stress: +5, 'stat.moral': +2 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 방패에서 손을 뗐다. "……{call이} 그렇다면." 로데릭은 방패를 다시 등에 졌다. "길은 기다려 주오. 서두르지 마시오."`
          : `"내 맹세야. {call} 것이 아니라." {name은} 결국 맹세하지 않았지만, 그 뒤로 로데릭의 편지는 혼자 읽었다.` },
    ],
  },

  // ── 근위기사 (근위기사단장 엔딩) ───────────────────────────────────────
  {
    id: 'b04a_guard_trial', title: '견습 기사 선발', age: [16, 17], weight: 2.5, npc: 'knight_cpt',
    conditions: ['stat.str >= 300', 'mastery.sword >= 6', '!flag.knight_path'],
    text: `왕도 근위대장이 검술도장을 찾아왔다. 흰 갑옷, 짧은 흑발, 한 번도 웃지 않는 얼굴. "올해 견습 기사 선발에 평민 자리가 하나 납니다. 출신은 묻지 않습니다. 검만 봅니다." 그녀의 시선이 {name}에게서 멈췄다.`,
    choices: [
      { label: '선발 시험에 나가 봐', check: { stat: 'str', dc: 430, bonus: (s) => s.stats.eti * 0.2 }, minigame: 'adventure',
        success: { effects: { 'flag.knight_path': true, 'stat.str': +10, 'stat.eti': +4, reputation: +8, 'pers.ambit': +3 },
          result: (s) => '마지막 대련 상대는 근위대장 본인이었다. {name은} 지고, 합격했다. "진 이유를 아는 사람만 뽑습니다."' + (
            s.personality.ambit >= 25 ? ' 흰 띠를 매며 아이가 속삭였다. "언젠가 저 자리까지 갈 거야."'
              : s.personality.agree >= 25 ? ' {name은} 흰 띠를 당신 손에 먼저 쥐여 주었다.'
                : ' 견습 기사의 흰 띠가 집으로 왔다.') },
        fail: { effects: { 'stat.str': +5, 'stat.agi': +3, stress: +10, 'pers.ambit': -1 },
          result: `세 번째 대련에서 무릎을 꿇었다. "검이 성급합니다. 기다리는 법을 배우면 다시 오십시오." 그날 밤 {name은} 마당에서 늦도록 목검을 휘둘렀다.` } },
      { label: '당신의 이름으로 추천한다', conditions: ["guardian == 'knight'"], effects: { 'flag.knight_path': true, 'stat.eti': +3, trust: -2, 'pers.ambit': +2 },
        result: (s) => !s.flags.guardian_name_cleared
          ? `근위대장이 추천서의 서명을 오래 보았다. "흑교의 그분이군요." 한참 뒤 흰 띠가 나왔다. "이름 말고 검을 보겠습니다. 다만 다들 지켜볼 겁니다." {name은} 그날부터 누구보다 일찍 훈련장에 나갔다.`
          : s.personality.agree < 0
            ? `"내 힘으로 붙고 싶었어." {name은} 흰 띠를 받고도 웃지 않았다. 그날부터 누구보다 일찍 훈련장에 나갔다. 증명하려는 듯이.`
            : `근위대장이 추천서를 보고 고개를 끄덕였다. "명부에 이름을 되찾으신 그분이군요." {name은} 어깨를 폈다. 되찾은 이름이라 더 무겁고, 더 자랑스러웠다.` },
      { label: '들러리일 거라며 말린다', effects: { trust: -3, stress: +4, 'pers.agree': -1, 'stat.str': +2 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 근위대장에게 고개를 숙이고 물러났다. 그날 저녁 아이는 아무렇지 않은 척 밥을 먹었다. 숟가락이 자꾸 멈췄다.`
          : `"들러리인지 아닌지는 내가 확인할래." 다음 날 지원서를 들고 갔던 {name은} 마감이 지났다는 말만 듣고 돌아왔다. 문 닫는 소리가 컸다.` },
      { label: '성 밖의 길을 떠올린다', conditions: ['flag.b04a_errant_friend'], effects: { 'stat.moral': +4, 'pers.roman': +2, trust: +3 },
        result: `{name이} 근위대장에게 고개를 숙였다. "성 밖에도 지킬 게 많아서요." 근위대장의 입꼬리가 아주 조금 올라갔다. "그 대답도 기억해 두죠."` },
    ],
  },
  {
    // 근위기사 2단계. knight_path는 core·b04a만 세팅한다 → career_knight를 안 봤다면 guard_trial 합격·추천으로 얻은 것.
    // career_knight를 봤다면 그 '아이가 정하게 한다'가 거절일 수 있으므로 야심 > 0일 때만(core 결과 분기와 같은 기준).
    id: 'b04a_guard_night_gate', title: '북문의 밤', age: [16, 17], weight: 3, npc: 'knight_cpt',
    conditions: ['flag.knight_path', 'stat.str >= 250', (s) => !s.seen.career_knight || s.personality.ambit > 0],
    text: `견습 기사가 된 지 반년. 첫 휴가를 나온 {name이} 저녁상 앞에서 숟가락을 내려놓았다. "{call}, 다음 달부터 북문 야간 당직이야. 통금이 지나면 해 뜰 때까지 문은 안 열어. 근데 선임들이 그래. 아픈 애를 업고 문을 두드리는 사람이 꼭 온대." 답을 바라는 얼굴이 아니었다. 같이 고민해 줄 사람이 필요한 얼굴이었다.`,
    choices: [
      { label: '규칙이 모두를 지킨다', effects: { 'stat.eti': +6, 'stat.str': +3, 'pers.agree': +2, reputation: +3, stress: +5 },
        result: `그 밤 {name은} 문을 열지 않았다. 대신 성벽 위에서 담요와 약초 바구니를 내려보내고, 해 뜰 때까지 문밖을 내려다보며 서 있었다. 근위대장은 보고서에 '규정 준수'라고만 적었다. {name은} 그 네 글자를 오래 보았다.` },
      { label: '사람이 먼저다', effects: { 'stat.moral': +8, 'stat.eti': -3, 'pers.good': +3, 'pers.agree': -2, stress: +6 },
        result: `{name은} 쪽문을 열어 아이를 업은 어머니를 들였다. 아이는 살았고 {name은} 사흘 근신을 받았다. 근위대장이 물었다. "다음에도 열겠습니까?" "네." "……그럼 열기 전에 저를 깨우십시오."` },
      { label: '근위대장을 깨우렴', check: { stat: 'elo', dc: 240, bonus: (s) => s.stats.eti * 0.2 },
        success: { effects: { 'stat.elo': +6, 'stat.eti': +4, reputation: +6, 'pers.ambit': +2 },
          result: `자정에 {name은} 근위대장의 방문을 두드렸다. 근위대장은 말없이 갑옷을 걸치고 내려와 직접 쪽문을 열었다. 이튿날 당직표 맨 위에 {name}의 이름이 있었다. "판단은 빨랐고, 순서는 옳았습니다."` },
        fail: { effects: { 'stat.elo': +3, stress: +8, 'pers.extro': -1 },
          result: `근위대장을 깨우러 간 사이 아이를 업은 어머니는 남문으로 돌아가 버렸다. 아이는 무사했다고 들었다. 그래도 {name은} 한동안 당직 때마다 잠긴 문을 몇 번씩 다시 확인했다.` } },
      { label: '흑교의 밤을 다시 꺼낸다', conditions: ["guardian == 'knight'", 'flag.guardian_past_revealed'], effects: { trust: +6, 'stat.moral': +4, 'stat.sens': +3, 'pers.good': +2 },
        result: `당신은 흑교의 밤을 다시 이야기했다. 이번엔 기사가 된 딸에게. 명령을 어긴 건 후회하지 않지만, 혼자 정한 건 후회한다고. {name이} 고개를 끄덕였다. "그럼 난 혼자 정하지 않을게."` },
    ],
  },

  // ── 무희 ─────────────────────────────────────────────────────────────
  {
    id: 'b04a_dance_invite', title: '무용극의 빈자리', age: [15, 17], weight: 3, image: 'bg/theater_stage',
    conditions: ['flag.dance_lessons', '!flag.b04a_dance_company'],
    text: `춤 수업 발표회가 끝나자 깃털 모자의 사내가 객석에서 뛰어 내려왔다. 극단 단장이었다. "오오, 저 발끝! 왕도 대극장 무용극에 무희 한 자리가 비었소. 다음 달 선발 무대에 서 주겠소?" {name이} 숨을 고르며 당신을 돌아보았다.`,
    choices: [
      { label: '선발 무대에 세운다', check: { stat: 'agi', dc: 240, bonus: (s) => s.stats.chm * 0.3 },
        success: { effects: { 'flag.b04a_dance_company': true, 'stat.agi': +8, 'stat.chm': +6, reputation: +4, 'pers.extro': +2 },
          result: `음악이 멎자 심사석이 조용했다. 단장이 모자를 벗어 흔들었다. "합격! 아니, 대합격이오!" 무대 뒤의 {name은} 아무렇지 않은 얼굴로 당신을 찾았다. 어깨 위로 금빛 별이 숨길 새도 없이 쏟아졌다.` },
        fail: { effects: { 'flag.b04a_dance_company': true, 'stat.agi': +4, stress: +8, 'pers.ambit': +1 },
          result: `회전 하나에서 휘청였다. 단장은 잠시 고민하더니 말했다. "군무 맨 끝자리부터. 끝자리에서 빛나는 녀석이 결국 가운데로 오는 법이지."` } },
      { label: '춤은 취미로 두자', effects: { trust: -4, 'pers.roman': -2, 'stat.int': +3, stress: +5 },
        result: (s) => s.personality.roman >= 15
          ? `{name은} 대답 없이 무용화 끈을 풀었다. 그날 밤 방에서 발 구르는 소리가 아주 작게, 오래 들렸다.`
          : `"그래, 춤으로 먹고살긴 힘들지." {name은} 담담하게 말했다. 너무 담담해서 당신 쪽이 오히려 마음이 쓰였다.` },
      { label: '테오도라와 연습하게 한다', conditions: ['rel.theodora >= 30'], effects: { 'flag.b04a_dance_company': true, 'rel.theodora': +6, 'stat.eti': +4, 'stat.agi': +4, stress: +4 },
        result: `"그 회전, 무게중심이 틀렸어." 테오도라가 부채로 {name}의 어깨를 톡 쳤다. 보름 동안 둘은 예절학교 홀에서 연습했다. 선발 무대는 무사히 통과했다.` },
    ],
  },
  {
    id: 'b04a_dance_festival', title: '장터의 원무', age: [15, 17], weight: 2.5, image: 'bg/market',
    conditions: ['stat.chm >= 200', 'stat.agi >= 160', '!flag.dance_lessons', '!flag.b04a_dance_company'],
    text: `장터 광장, 거리 악사의 피리에 맞춰 {name이} 친구들과 원무를 추고 있었다. 배운 적 없는 춤인데 발이 먼저 박자를 알았다. 구경꾼 사이에서 깃털 모자의 사내가 손뼉을 쳤다. "배운 적이 없다고? 그럼 더 좋소! 대극장 선발 무대에 와 보시오!"`,
    choices: [
      { label: '선발 무대에 세운다', check: { stat: 'agi', dc: 250, bonus: (s) => s.stats.chm * 0.3 }, minigame: 'ball',
        success: { effects: { 'flag.b04a_dance_company': true, 'stat.agi': +8, 'stat.chm': +5, reputation: +3, 'pers.extro': +2 },
          result: (s) => s.personality.ambit >= 25
            ? `"가운데 자리는 언제 줘요?" 합격 소식을 듣자마자 {name이} 물었다. 단장이 배를 잡고 웃었다. "이 녀석, 마음에 드는군!"`
            : s.personality.roman >= 25
              ? `{name은} 배운 적 없는 춤을 췄다. 음악이 끝나고도 한 박자 더 움직였다. 단장이 중얼거렸다. "음악이 저 아이를 데려가는군." 합격이었다.`
              : `낯선 발놀림에 몇 번 엉켰지만 박자만은 한 번도 놓치지 않았다. 단장이 손가락을 튕겼다. "타고난 박자는 못 가르치오. 합격!"` },
        fail: { effects: { 'flag.b04a_dance_company': true, 'stat.agi': +3, stress: +8, 'pers.ambit': -1 },
          result: `기본 발동작을 몰라 두 번이나 엉켰다. 단장이 모자를 고쳐 쓰며 말했다. "연습생부터 하시오. 기초가 없으면 무대가 발목을 잡지." {name은} 그날 밤 마당에서 혼자 발동작을 되풀이했다.` } },
      { label: '기본기부터 (-80G)', conditions: ['gold >= 80'], effects: { gold: -80, 'stat.eti': +5, 'stat.agi': +3, stress: +3, 'flag.b04a_dance_company': true },
        result: `{name은} 석 달 동안 극단 연습실 구석에서 기본기만 다졌다. 지나가던 단장이 중얼거렸다. "느린 녀석이 넘어지지 않지." 다음 시즌 군무 명단에 이름이 올랐다.` },
      { label: '춤은 축제에서만 추렴', effects: { trust: -3, 'pers.roman': -2, stress: +4, 'stat.elo': +2 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 단장에게 정중히 고개를 숙였다. 그 뒤로도 장터에서 춤은 췄다. 다만 깃털 모자가 보이면 슬쩍 멈췄다.`
          : `"축제는 일 년에 네 번뿐이잖아." {name은} 단장이 남긴 쪽지를 버리지 않았다. 당신은 그 쪽지가 거울 틈에 꽂힌 걸 보았다.` },
    ],
  },
  {
    id: 'b04a_dance_rehearsal', title: '대역', age: [16, 17], weight: 3.5, image: 'bg/theater_stage',
    conditions: ['flag.b04a_dance_company', '!flag.prima_debut'],
    text: `무용극 연습 석 달째. {name}의 무용화 끝이 해졌고 발가락엔 물집이 잡혔다. 그날 밤, 주역 무희 셀린이 발목을 접질렸다는 소식이 왔다. 셀린의 안무를 어깨너머로 다 외운 건 {name}뿐이었다. 단장이 물었다. "대역을 맡겠소? 셀린의 춤은 셀린만 춘다고들 하지만."`,
    choices: [
      { label: '대역을 맡아 봐', effects: { 'flag.b04a_dance_ready': true, 'stat.agi': +8, 'stat.chm': +4, stress: +10, 'pers.ambit': +3 },
        result: `{name은} 셀린의 안무를 밤새 되짚었다. 다음 날 셀린이 목발을 짚고 연습실에 나타났다. "둘째 마디는 내 버릇이야. 넌 네 식대로 해." 둘은 초연 전날까지 함께 남았다.`, next: 'b04a_dance_debut' },
      { label: '셀린부터 찾아가 봐', effects: { 'flag.b04a_dance_ready': true, 'stat.moral': +5, 'stat.sens': +4, stress: +4, 'pers.good': +2 },
        result: `{name은} 꽃 대신 찜질약을 들고 셀린을 찾아갔다. "언니 자리를 뺏는 게 아니라 지키는 거예요." 셀린이 웃으며 자기 무용화를 내밀었다. "그럼 이것도 지켜 줘."`, next: 'b04a_dance_debut' },
      { label: '물집부터 낫자', effects: { stress: -12, 'stat.hp': +3, 'pers.ambit': -2, trust: +3 },
        result: `당신이 붕대를 감아 주자 {name은} 처음엔 툴툴거렸다. 대역은 다른 아이에게 갔다. 그래도 {name은} 그날 오랜만에 깊이 잤다. 다음 시즌 명단은 아직 비어 있다.` },
      { label: '무도회의 밤을 떠올린다', conditions: ['flag.ball_won'], effects: { 'flag.b04a_dance_ready': true, 'stat.chm': +5, 'stat.eti': +4, 'pers.extro': +2 },
        result: `"무도회 그 밤도 무서웠어. 근데 음악이 시작되니까 괜찮았어." {name은} 대역을 맡았다. 셀린의 안무에 무도회 발동작 하나를 몰래 섞었다.`, next: 'b04a_dance_debut' },
    ],
  },
  {
    id: 'b04a_dance_debut', title: '「달의 세 자매」 초연', age: [16, 17], weight: 4, image: 'bg/theater_stage',
    // 대역을 맡으면 dance_rehearsal에서 바로 이어지고, 사양했으면 다음 시즌에 랜덤으로 온다.
    conditions: ['flag.b04a_dance_company', 'seen.b04a_dance_rehearsal >= 1', '!flag.prima_debut'],
    text: `왕도 대극장, 무용극 「달의 세 자매」 초연의 밤. 오늘 주역 자리에 {name이} 선다. 분장실 거울 앞에서 아이가 손을 비볐다. 손끝에서 금빛 별이 자꾸 새어 나왔다. "{call}, 별이 멈추질 않아. 관객들이 이상하게 보면 어떡해?" 막이 오르기까지 십 분.`,
    choices: [
      { label: '별빛도 춤의 일부야', check: { stat: 'chm', dc: 320, bonus: (s) => s.stats.agi * 0.3 }, minigame: 'ball',
        success: { effects: { 'flag.prima_debut': true, 'stat.chm': +12, 'stat.agi': +6, reputation: +10, 'pers.extro': +3 },
          result: `마지막 회전에서 금빛 별이 객석까지 흩날렸다. 관객들은 그것이 무대 장치인 줄 알았다. 커튼콜에서 {name은} 객석 뒤편의 당신에게만 손을 흔들었다.` },
        fail: { effects: { 'flag.prima_debut': true, 'stat.chm': +5, stress: +10, reputation: +3, 'pers.extro': -1 },
          result: `중간에 박자를 한 번 놓쳤다. 그래도 끝까지 웃었다. 비평가는 "덜 익었으나 잊히지 않을 무희"라고 썼다. {name은} 그 평이 실린 소식지를 오려 두었다.` } },
      { label: '네 춤을 춰', conditions: ['flag.b04a_dance_ready'], check: { stat: 'sens', dc: 300, bonus: (s) => s.stats.chm * 0.3 },
        success: { effects: { 'flag.prima_debut': true, 'stat.sens': +10, 'stat.chm': +8, reputation: +12, 'pers.roman': +3 },
          result: `둘째 막에서 {name은} 안무를 내려놓고 자기 춤을 췄다. 별이 떨어진 밤의 춤이었다. 단장이 무대 옆에서 모자를 꽉 쥐었다. 그리고 객석이 일어섰다.` },
        fail: { effects: { 'flag.prima_debut': true, 'stat.sens': +4, stress: +12, reputation: +1, 'pers.roman': +1 },
          result: `즉흥은 아름다웠지만 군무와 어긋났다. 단장에게 크게 혼났다. 그런데 다음 날 극장 문에 "그 춤을 다시 보고 싶다"는 쪽지가 여럿 붙었다.` } },
      { label: '별빛을 다스려 띄워 봐', conditions: ['flag.magic_awake'], effects: { 'flag.prima_debut': true, 'stat.mag': +5, 'stat.chm': +6, reputation: +6, stress: +5, 'pers.extro': +1 },
        result: `{name은} 손끝의 별을 하나씩 불러 모아 무대 위에 띄웠다. 세 번째 달이 뜨는 장면에서 별들이 진짜 달처럼 빛났다. 탑에서 온 관객 하나가 오래 박수를 쳤다.` },
      { label: '무대를 다음으로 미루자', effects: { trust: +5, stress: -8, 'stat.agi': +3, 'pers.ambit': -2 },
        result: (s) => s.personality.ambit >= 20
          ? `"……응. 오늘은 선배 무대로 하자." 말은 그렇게 했지만, 군무 맨 끝에서 {name}의 별빛은 내내 반짝였다. 막이 내린 뒤에도 아이는 빈 무대 가운데를 오래 보았다.`
          : `{name은} 주역 자리를 선배에게 돌려주고 군무 맨 끝에 섰다. 거기서도 별빛은 새어 나왔다. 공연 뒤 아이가 말했다. "편했어. 근데 조금 아까웠어."` },
    ],
  },

  // ── 의상 명인 (연쇄 ③) ───────────────────────────────────────────────
  {
    id: 'b04a_tailor_order', title: '진홍 드레스의 소매', age: [15, 17], weight: 3, npc: 'theodora',
    conditions: ['mastery.sewing >= 6'], requiresActivity: 'sewing',
    text: `재봉소 문이 벌컥 열렸다. 테오도라였다. 진홍 드레스의 소매가 뜯어져 있었다. "어머니가 물려주신 거야. 내일이 무도회인데 왕도 재봉사들은 다 바쁘대." 테오도라가 턱을 들었다. "……네 바느질이 제일 낫다는 소문이 있던데."`,
    choices: [
      { label: '정성껏 고쳐 준다', check: { stat: 'sens', dc: 230 },
        success: { effects: { 'flag.b04a_tailor_name': true, 'stat.sens': +6, 'rel.theodora': +8, reputation: +4 },
          result: `{name은} 뜯어진 자리에 금실로 작은 별을 수놓아 흉터를 감췄다. 무도회에서 귀부인들이 물었다. "그 소매, 어느 집 솜씨지?" 테오도라가 답했다. "내 라이벌."` },
        fail: { effects: { 'stat.sens': +3, 'rel.theodora': +3, stress: +5, 'pers.ambit': +1 },
          result: `실이 엉켜 바늘땀이 삐뚤어졌다. 테오도라는 입을 삐죽였지만 그 드레스를 입고 갔다. "티 안 나. 아마도." 다음 주문은 오지 않았다.` } },
      { label: '소매를 새로 지어 단다', effects: { 'flag.b04a_tailor_name': true, 'stat.sens': +4, 'stat.cult': +3, 'rel.theodora': -3, stress: +6, 'pers.roman': +2 },
        result: `{name은} 소매를 떼고 망토처럼 흐르는 새 소매를 달았다. 테오도라는 비명을 질렀다가 거울을 보고 조용해졌다. 무도회의 화제는 그 소매였다. 화는 사흘 만에 풀렸다.` },
      { label: '값은 제대로 받는다', effects: { 'flag.b04a_tailor_name': true, gold: +120, 'stat.elo': +4, 'rel.theodora': -4, 'pers.roman': -2 },
        result: `"급한 주문은 세 배야." 테오도라가 기가 막힌 얼굴로 금화를 셌다. 수선은 완벽했다. 왕도에 소문이 돌았다. 평원에 비싸고 확실한 재봉사가 있다고.` },
      { label: '옛 거래처의 비단을 구한다', conditions: ["guardian == 'merchant'", 'gold >= 60'], effects: { 'flag.b04a_tailor_name': true, gold: -60, 'rel.theodora': +6, 'stat.cult': +4, trust: +3 },
        result: `당신이 항구의 옛 거래처에서 같은 빛깔 비단을 구해 왔다. {name은} 감쪽같이 소매를 이었다. 테오도라가 작게 말했다. "……너희 집, 이상하게 든든하네."` },
    ],
  },
  {
    id: 'b04a_tailor_contest', title: '봄 품평회 공모', age: [16, 17], weight: 3.5, image: 'bg/guild_hall',
    conditions: ['flag.b04a_tailor_name', 'mastery.sewing >= 12'],
    text: `왕도 의상 길드가 봄 품평회 공모를 냈다. 신인 재봉사 셋을 뽑아 대극장 무대에 옷을 세운다. 공모 서류의 추천인 칸에는 누군가 이미 이름을 적어 두었다. 테오도라였다. {name이} 그림첩을 펼쳤다. "{call}, 어떤 옷이 좋을까?"`,
    choices: [
      { label: '흑백에 금빛 별을', check: { stat: 'sens', dc: 330 },
        success: { effects: { 'stat.sens': +8, 'stat.cult': +2, 'pers.roman': +2, reputation: +2 },
          result: `흰 비단, 검은 벨벳, 손끝에서 새어 나오는 금빛을 닮은 실. 밑그림 첫 장부터 심사관들이 술렁였다는 소식이 왔다. 당당한 본선 진출이다.`, next: 'b04a_tailor_atelier' },
        fail: { effects: { 'stat.sens': +3, stress: +6, 'pers.ambit': +1 },
          result: `별 자수가 자꾸 엉켰다. 겨우 마감에 맞춰 냈고, 턱걸이로 본선에 올랐다. {name은} 밤마다 실을 풀었다 다시 꿰었다.`, next: 'b04a_tailor_atelier' } },
      { label: '밀밭 빛깔로 짓자', check: { stat: 'cult', dc: 270 },
        success: { effects: { 'stat.cult': +8, 'stat.sens': +3, reputation: +2, 'pers.roman': +1 },
          result: `여름 끝 밀밭의 금빛과 저녁 그림자의 갈색. 심사관이 밑그림을 보다 창밖을 내다봤다고 한다. "평원 바람이 부는 옷이군." 본선이다.`, next: 'b04a_tailor_atelier' },
        fail: { effects: { 'stat.cult': +3, stress: +6, 'pers.ambit': +1 },
          result: `색을 고르는 데만 열흘이 걸렸다. 마감 직전에 낸 밑그림은 턱걸이로 본선에 올랐다. {name은} 염색 통 앞에서 밤을 새우기 시작했다.`, next: 'b04a_tailor_atelier' } },
      { label: '헌 돛천으로 짓자', effects: { 'stat.int': +4, 'stat.moral': +4, 'pers.good': +1, 'pers.roman': -1 },
        result: `{name은} 항구에서 버려진 돛천을 얻어 왔다. 바닷바람에 바랜 천이 의외로 부드러웠다. "옷도 항해를 해 봐야지." 심사관 하나가 그 말을 받아 적었다.`, next: 'b04a_tailor_atelier' },
      { label: '올해는 건너뛰자', effects: { stress: -6, 'pers.ambit': -2, 'rel.theodora': -4, trust: +2 },
        result: `{name은} 공모 서류를 접어 서랍에 넣었다. 며칠 뒤 테오도라의 편지가 왔다. "추천인 체면은 생각 안 해?" 글씨가 유난히 꾹꾹 눌려 있었다.` },
    ],
  },
  {
    id: 'b04a_tailor_atelier', title: '사흘 밤의 작업대', chainOnly: true, age: [16, 17],
    text: `품평회까지 사흘. 재봉소 작업대 위에 천이 산처럼 쌓였다. 베라 할머니는 허리를 짚고 먼저 들어갔고, 바늘을 쥔 {name}의 손가락엔 골무 자국이 깊었다. 큐브가 실타래를 안고 빙글 돌았다. "주인님, 아가씨가 오늘도 안 주무신대요!"`,
    choices: [
      { label: '혼자 끝까지 해내라', effects: { 'stat.sens': +6, 'stat.cult': +3, stress: +12, 'stat.hp': -4, 'pers.ambit': +2 },
        result: `사흘째 새벽, 마지막 단추를 달고 {name은} 작업대에 엎드려 잠들었다. 옷은 한 땀도 남의 손을 타지 않았다. 당신은 그 등에 담요를 덮어 주었다.`, next: 'b04a_tailor_show' },
      { label: '동료들과 나눠 해라', effects: { 'stat.elo': +5, 'stat.moral': +3, stress: +4, reputation: +2, 'pers.extro': +2 },
        result: `{name은} 재봉소 견습생 넷을 불러 일을 나눴다. 밑단은 누가, 단추는 누가. 노래를 부르며 바느질했다. 안감에 다섯 사람의 머리글자가 작게 수놓였다.`, next: 'b04a_tailor_show' },
      { label: '큐브에게 도움을 청한다', effects: { 'rel.cube': +6, 'stat.mag': +3, stress: -4, 'stat.sens': +2 },
        result: `큐브가 날개를 파닥이자 실들이 스스로 바늘귀를 찾아 들어갔다. 반은 엉뚱한 데로 들어갔지만. 둘은 밤새 웃으며 엉킨 실을 풀었고, 옷은 완성됐다.`, next: 'b04a_tailor_show' },
      { label: '첫 재봉 상자를 꺼낸다', conditions: ['item.sewing_kit >= 1'], effects: { trust: +5, 'stat.sens': +5, stress: +2 },
        result: `낡은 재봉 상자 속 골무가 이제 손가락에 꼭 맞았다. "처음 받았을 땐 손가락이 다 들어갔었는데." {name이} 웃었다. 그 골무로 마지막 땀을 떴다.`, next: 'b04a_tailor_show' },
    ],
  },
  {
    id: 'b04a_tailor_show', title: '무대 위의 옷', chainOnly: true, age: [16, 17], image: 'bg/theater_stage',
    text: `품평회 당일, 대극장 무대 뒤. {name}의 옷을 입고 걷기로 한 견습생이 열이 나서 오지 못했다. 길드 서기가 이름을 부르기까지 열다섯 순서. {name이} 옷걸이를 붙든 채 당신을 보았다. 저쪽에서 테오도라가 부채를 접으며 다가오고 있었다.`,
    choices: [
      { label: '네가 입고 걸어라', check: { stat: 'chm', dc: 270, bonus: (s) => s.stats.sens * 0.15 },
        success: { effects: { 'flag.fashion_show': true, 'stat.chm': +8, 'stat.sens': +4, reputation: +10, 'pers.extro': +3 },
          result: `{name은} 자기가 지은 옷을 입고 무대 끝까지 걸어가 한 바퀴 돌았다. 소매 끝 금실이 조명에 반짝였다. 길드장이 그 자리에서 이름을 물었다.` },
        fail: { effects: { 'flag.fashion_show': true, 'stat.chm': +3, stress: +8, reputation: +4 },
          result: `무대 중간에서 옷자락을 밟아 휘청였다. {name은} 자세를 고치고 끝까지 걸었다. 심사평은 한 줄. "옷은 완벽했다. 지은 이도 곧 그럴 것이다."` } },
      { label: '테오도라에게 부탁한다', conditions: ['rel.theodora >= 30'], effects: { 'flag.fashion_show': true, 'rel.theodora': +10, 'stat.elo': +4, reputation: +8, 'pers.agree': +1 },
        result: `"부탁하는 표정이 그게 뭐야." 테오도라가 옷을 낚아채 갈아입었다. 무대 위의 그녀는 {name}의 옷을 제 옷처럼 입었다. 내려와서 한마디. "이제 빚진 거다."` },
      { label: '옷만 무대에 세운다', effects: { 'flag.fashion_show': true, 'stat.sens': +6, 'stat.cult': +4, reputation: +4, 'pers.extro': -2 },
        result: `{name은} 옷을 나무 옷걸이 인형에 입혀 무대 가운데 세웠다. 아무도 걷지 않는 무대에서 옷만이 조명을 받았다. 객석의 누군가가 중얼거렸다. "옷이 말을 하네."` },
    ],
  },

  // ── 명장 대장장이 (연쇄 ④) ───────────────────────────────────────────
  {
    id: 'b04a_smith_blade', title: '처음부터 끝까지', age: [15, 17], weight: 3, image: 'bg/smithy',
    conditions: ['mastery.smith >= 6'], requiresActivity: 'smith',
    text: `도르완 영감이 모루를 두드리다 말고 {name}에게 망치를 건넸다. 네리의 할아버지, 말수 적은 노인이다. "흠. 이번 주문은 네가 처음부터 끝까지 해라." 주문서는 두 장. 경비대의 장검 한 자루, 그리고 한스네 밭에 쓸 낫 열 자루.`,
    choices: [
      { label: '장검을 벼려 봐', check: { stat: 'str', dc: 290, bonus: (s) => (s.mastery.smith || 0) * 4 },
        success: { effects: { 'flag.b04a_smith_blade': true, 'stat.str': +8, 'stat.hp': +3, reputation: +3, 'pers.ambit': +2 },
          result: `사흘 뒤, 경비대장이 장검을 휘둘러 보더니 말없이 값을 두 배로 쳐 주었다. 도르완 영감이 처음으로 {name}의 어깨를 두드렸다. "흠. 쓸 만하군."` },
        fail: { effects: { 'flag.b04a_smith_blade': true, 'stat.str': +4, stress: +8, 'pers.ambit': -1 },
          result: `담금질에서 칼날이 휘었다. 영감은 그 칼을 화덕에 도로 넣었다. "쇠는 거짓말을 안 해. 네가 서둘렀다는 거지. 다시 해라." {name은} 이를 악물었다.` } },
      { label: '낫 열 자루부터', effects: { 'flag.b04a_smith_blade': true, 'stat.hp': +5, 'stat.moral': +4, gold: +60, 'pers.ambit': -1 },
        result: `{name은} 낫 열 자루를 벼려 한스 아저씨네 밭으로 지고 갔다. 가을 내내 평원에서 그 낫 소리가 났다. 영감이 말했다. "칼보다 낫이 어렵다. 매일 쓰니까."` },
      { label: '아직은 지켜보기만', effects: { 'flag.b04a_smith_blade': true, 'stat.int': +4, 'stat.sens': +3, stress: -3, 'pers.agree': +1, gold: -20 },
        result: `{name은} 주문서를 돌려드리고 한 달 더 품삯 반만 받으며 영감의 손목을 지켜봤다. 영감은 아무 말도 하지 않았다. 다만 마지막 날, 망치 자루를 아이 손에 맞게 깎아 두었다.` },
    ],
  },
  {
    id: 'b04a_smith_star_iron', title: '별에서 온 쇠', age: [16, 17], weight: 3.5, image: 'bg/smithy',
    conditions: ['flag.b04a_smith_blade', 'mastery.smith >= 12'],
    text: `{name이} 밭에서 주먹만 한 검은 돌을 들고 왔다. 아이가 별똥별과 함께 떨어졌던 바로 그 자리에서 나왔다. 돌이 손바닥 위에서 낮게 웅웅 울리고 금빛 불티가 튀었다. 도르완 영감이 숨을 삼켰다. "별철이다. 평생 한 번 볼까 말까 한."`,
    choices: [
      { label: '걸작을 벼려 보자', effects: { 'stat.str': +4, 'pers.ambit': +3, stress: +5 },
        result: `{name은} 그날부터 대장간에서 먹고 잤다. 화덕 불빛 속에서 별철이 서서히 붉어졌다. 도르완 영감이 풀무 앞에 섰다. "불은 내가 본다. 쇠는 네가 봐라."`, next: 'b04a_smith_forge' },
      { label: '엘다에게 먼저 보인다', conditions: ['flag.met_elda'], effects: { 'rel.elda': +8, 'stat.mag': +5, 'flag.b04a_star_blessed': true },
        result: `엘다가 별철을 두 손으로 감쌌다. "이건 네 거예요. 너와 함께 떨어진 별의 조각." 엘다는 쇠 위에 작은 축복의 문양을 그렸다. "이제 벼려요. 두려워 말고."`, next: 'b04a_smith_forge' },
      { label: '상인 길드에 판다', effects: { gold: +300, 'stat.elo': +4, 'pers.roman': -3 },
        result: (s) => s.personality.roman >= 15
          ? `{name은} 금화 자루를 받고도 한참 길드 문 앞에 서 있었다. "……잘한 거지?" 대답 대신 당신은 아이 어깨를 감쌌다.`
          : `"겨울 장작도 사고, 새 망치도 사자." {name은} 금화 자루를 탁자에 내려놓았다. 미련 없는 얼굴이었다. 정말로.` },
      { label: '어머니 이야기를 꺼낸다', conditions: ['flag.knows_origin'], effects: { trust: +6, 'stat.sens': +5, 'flag.b04a_star_blessed': true },
        result: `"어머니가 나를 하늘에 숨겼을 때, 이것도 같이 왔을까." {name이} 별철을 가슴에 대었다. 따뜻했다. "이걸로 무언가를 지키는 걸 만들 거야."`, next: 'b04a_smith_forge' },
    ],
  },
  {
    id: 'b04a_smith_forge', title: '단 한 번의 담금질', chainOnly: true, age: [16, 17], image: 'bg/smithy',
    text: `사흘 밤낮 별철을 두드렸다. 남은 건 단 한 번의 담금질. 이르면 무르고, 늦으면 깨진다. 도르완 영감이 물통 옆으로 비켜섰다. "때는 쇠가 알려 준다. 들을 줄 알면." {name}의 손끝에서 금빛 불티가 쇠의 빛깔과 함께 떨렸다.`,
    choices: [
      { label: '혼자서 때를 잡아라', check: { stat: 'str', dc: 470, bonus: (s) => (s.mastery.smith || 0) * 4 + (s.flags.b04a_star_blessed ? 50 : 0) },
        success: { effects: { 'flag.masterwork': true, 'stat.str': +12, 'stat.sens': +6, reputation: +10, 'pers.ambit': +3 },
          result: `치익, 하얀 김이 대장간을 채웠다. 김이 걷히자 별빛 무늬가 흐르는 칼날이 나타났다. 영감이 칼을 빛에 비춰 보더니 처음으로 크게 웃었다. "네 이름을 새겨라."` },
        fail: { effects: { 'flag.b04a_smith_cracked': true, 'stat.str': +5, stress: +12, 'pers.ambit': -1 },
          result: `쨍. 칼날에 머리카락만 한 금이 갔다. {name은} 한참 그 금을 손가락으로 쓸었다. 영감이 말했다. "별철은 아직 남았다. 첫 걸작은 원래 두 번째에 나오는 법이지."` } },
      { label: '영감과 함께 담가라', effects: { 'flag.masterwork': true, 'stat.str': +6, 'stat.moral': +4, 'pers.agree': +2, reputation: +4 },
        result: `둘이 함께 칼자루를 잡고 물통에 담갔다. 칼날에는 두 이름이 새겨졌다. 도르완, 그리고 {name}. "명장의 첫걸음은 남의 손을 빌릴 줄 아는 거다."` },
      { label: '옛 검의 자루를 내준다', conditions: ["guardian == 'knight'"], effects: { 'flag.masterwork': true, trust: +8, 'stat.str': +6, 'stat.cult': +3 },
        result: `당신은 기사단 시절의 검에서 자루를 풀어 건넸다. {name은} 별철 칼날을 그 자루에 맞췄다. "날은 내 거, 손잡이는 {call} 거. 그럼 이 칼은 우리 거야."` },
      { label: '쟁기날로 벼린다', effects: { 'stat.hp': +6, 'stat.moral': +6, reputation: +5, 'pers.good': +2, 'pers.ambit': -2 },
        result: `{name은} 마지막 순간 망치를 바꿔 쥐었다. 별철은 칼이 아니라 쟁기날이 되었다. 그 쟁기가 지나간 밭은 이듬해 유난히 잘 여물었다. 영감은 "흠" 하고 웃었다.` },
    ],
  },
  {
    id: 'b04a_smith_second_fire', title: '두 번째 불', age: [16, 17], weight: 4, image: 'bg/smithy',
    conditions: ['flag.b04a_smith_cracked', '!flag.masterwork'],
    text: `금 간 칼은 대장간 벽에 걸려 있다. {name은} 매일 그 앞을 지나며 눈을 피했다. 남은 별철은 손바닥 반만 한 조각. 도르완 영감이 화덕에 불을 지폈다. "한 번 더 할 테냐. 이번엔 작은 걸로."`,
    choices: [
      { label: '작은 단검을 벼린다', check: { stat: 'str', dc: 380, bonus: (s) => (s.mastery.smith || 0) * 4 },
        success: { effects: { 'flag.masterwork': true, 'stat.str': +8, 'stat.sens': +6, reputation: +6 },
          result: `손바닥만 한 단검이었다. 그러나 칼끝에서 별빛이 물결쳤다. 영감이 두 칼을 나란히 걸며 말했다. "금 간 놈이 있어서 이놈이 나왔다. 둘 다 네 거다."` },
        fail: { effects: { 'stat.str': +3, 'stat.sens': +4, stress: +10, 'pers.ambit': -2 },
          result: `이번에도 금이 갔다. {name은} 두 칼을 나란히 벽에 걸었다. "언젠가 저 둘을 보고 웃을 날이 올 거야." 별철은 이제 남지 않았다.` } },
      { label: '금 위에 금실을 입힌다 (-80G)', conditions: ['gold >= 80'], effects: { 'flag.masterwork': true, gold: -80, 'stat.sens': +8, 'pers.roman': +3, stress: -5 },
        result: `{name은} 금을 메우지 않고 그 위에 금실을 상감했다. 갈라진 자리가 별자리처럼 빛났다. 영감이 오래 들여다보다 말했다. "흠. 이건 내가 못 만드는 칼이다."` },
      { label: '이제 그만 쉬자', effects: { stress: -10, trust: +4, 'pers.ambit': -2, 'stat.moral': +2 },
        result: `{name은} 화덕 앞에서 고개를 저었다. "걸작은 나중에. 지금은 낫이 더 필요한 철이야." 영감은 고개를 끄덕이고 불을 줄였다.` },
      { label: '처음 별철을 안던 날처럼', conditions: ['flag.b04a_star_blessed'], effects: { 'flag.masterwork': true, 'stat.mag': +4, 'stat.sens': +5, trust: +3 },
        result: `{name은} 남은 별철을 처음 그날처럼 가슴에 대었다. 따뜻했다. 이번엔 쇠가 먼저 때를 알려 주었다. 손바닥만 한 단검이 맑은 소리로 울렸다.` },
    ],
  },

  // ── 궁정악사 ─────────────────────────────────────────────────────────
  {
    id: 'b04a_art_recital', title: '연말 연주회', age: [16, 17], weight: 2.5, image: 'bg/theater_stage',
    conditions: ['stat.sens >= 250', '!flag.art_path'], requiresActivity: 'art',
    text: `예술원 연말 연주회. 순서표 맨 끝에 {name}의 이름이 있다. 객석 셋째 줄에 궁정 악단의 부악장이 앉았다는 소문에 대기실이 술렁였다. {name이} 악보 두 장을 들고 왔다. 하나는 모두가 아는 곡, 하나는 아무도 모르는 자작곡이다.`,
    choices: [
      { label: '네 곡을 연주해', check: { stat: 'sens', dc: 380, bonus: (s) => s.stats.cult * 0.2 },
        success: { effects: { 'flag.art_path': true, 'stat.sens': +10, 'stat.chm': +4, reputation: +8, 'pers.roman': +2 },
          result: `마지막 음이 사라지고도 박수는 한참 늦게 왔다. 부악장이 대기실로 찾아왔다. "제목이 뭡니까?" {name이} 객석의 당신을 보며 답했다. "「집으로 오는 길」이요."` },
        fail: { effects: { 'stat.sens': +5, stress: +8, 'pers.roman': +1 },
          result: `둘째 악장에서 손이 떨렸다. 부악장은 중간에 자리를 떴다. 연주회가 끝나고 예술원 선생님이 말했다. "저 곡, 끝까지 다듬어 보렴. 언젠가 다시 들려줘."` } },
      { label: '익숙한 곡으로 가자', effects: { 'stat.sens': +5, 'stat.eti': +3, reputation: +3, stress: -3, 'pers.ambit': -1 },
        result: `흠잡을 데 없는 연주였다. 부악장은 고개를 끄덕이고 다음 연주자로 넘어갔다. {name은} 자작곡 악보를 가방 깊숙이 넣었다. 조금 아쉬운 얼굴이었다.` },
      { label: '류트 하나로 단출하게', conditions: ['item.lute >= 1'], effects: { 'flag.art_path': true, 'stat.sens': +6, 'pers.roman': +2, reputation: +4 },
        result: `{name은} 반주 없이 류트 하나만 들고 무대에 앉았다. 객석이 조용해질수록 소리가 멀리 갔다. 부악장이 쪽지를 남기고 갔다. "궁정 악단 선발에 오십시오."` },
    ],
  },

  // ── 극단 스타 지원 ───────────────────────────────────────────────────
  {
    id: 'b04a_stage_lead', title: '별을 주운 사람', age: [16, 17], weight: 3, npc: 'troupe',
    conditions: ['flag.stage_star'], requiresActivity: 'theater',
    text: `극단 단장이 대본을 탁자에 내려놓았다. "「별을 주운 사람」. 주연이오! 첫 무대에서 객석을 숨죽이게 했던 그 아이가 이제 주연이라니!" 그런데 대본을 넘기던 {name}의 손이 멈췄다. 주인공은 하늘에서 떨어진 소녀였다.`,
    choices: [
      { label: '주연을 맡아 봐', effects: { 'stat.chm': +10, 'stat.sens': +5, reputation: +8, stress: +8, 'pers.extro': +3 },
        result: `막이 내리고 {name은} 분장도 지우지 않은 채 객석으로 뛰어 내려왔다. "{call}, 소녀를 주운 사람 역 봤어? 대사가 {call이랑} 똑같았어."` },
      { label: '내 이야기는 싫어', effects: { 'stat.elo': +4, 'stat.sens': +3, trust: +4, 'pers.extro': -2 },
        result: `{name은} 대본을 돌려주었다. "제 이야기는 아직 제가 쓰고 있어서요." 단장은 아쉬워하면서도 웃었다. 그 역은 다른 배우에게 갔고, 공연은 둘이 함께 보러 갔다.` },
      { label: '대본을 함께 고쳐 봐', check: { stat: 'elo', dc: 250 },
        success: { effects: { 'stat.elo': +8, 'stat.cult': +4, 'stat.chm': +4, reputation: +6, 'pers.roman': +2 },
          result: `{name은} 마지막 장면을 고쳐 썼다. 소녀가 하늘로 돌아가는 대신, 자기를 주운 사람의 집으로 돌아오는 결말. 단장이 손수건을 꺼냈다. "이게 맞소. 이게."` },
        fail: { effects: { 'stat.elo': +3, stress: +6, 'pers.ambit': +1 },
          result: `고친 결말은 단장의 마음에 들지 않았다. 공연은 원래 대본대로 올랐다. 그래도 {name은} 마지막 대사를 아주 조금, 몰래 바꿔 말했다.` } },
      { label: '춤 장면을 넣자고 한다', conditions: ['flag.b04a_dance_company'], effects: { 'stat.agi': +5, 'stat.chm': +6, reputation: +6, stress: +5, 'pers.extro': +2 },
        result: `연극 한가운데 별이 떨어지는 장면을 {name}의 춤으로 바꿨다. 무용단과 극단이 한 무대에 선 건 처음이었다. 단장은 자기 생각이었다고 우겼다.` },
    ],
  },

  // ── 요리사 · 여관 주인 · 농장주 지원 ─────────────────────────────────
  {
    id: 'b04a_cook_banquet', title: '마흔 명의 만찬', age: [16, 17], weight: 2.5, npc: 'guildmaster',
    conditions: ['mastery.diner >= 8'], requiresActivity: 'diner',
    text: `식당 주인 고든 아저씨가 허리를 붙잡고 주저앉았다. 내일 저녁은 상인 길드장의 손님 마흔 명 만찬이다. "얘야, 네가 주방을 맡아라. 차림도 네 마음대로." {name이} 앞치마 끈을 쥔 채 당신을 보았다. "{call}, 마흔 명이래. 마흔."`,
    choices: [
      { label: '평원 요리로 승부해', check: { stat: 'sens', dc: 230, bonus: (s) => s.stats.hp * 0.15 }, minigame: 'cooking',
        success: { effects: { 'stat.sens': +8, 'stat.hp': +4, gold: +120, reputation: +8, 'pers.ambit': +2 },
          result: `호박 수프, 들꿀 바른 빵, 한스네 사과 파이. 길드장이 접시를 비우고 물었다. "이건 어느 왕도 요리사 솜씨요?" 고든 아저씨가 의자에서 소리쳤다. "우리 애요!"` },
        fail: { effects: { 'stat.sens': +4, stress: +10, gold: +40, 'pers.ambit': -1 },
          result: `주요리가 늦었다. 손님들이 술잔만 돌렸다. 그래도 마지막 파이에서 웃음이 돌아왔다. {name은} 설거지를 하며 요리 순서를 다시 적었다.` } },
      { label: '아저씨 차림대로 해라', effects: { 'stat.eti': +3, 'stat.hp': +3, gold: +80, 'pers.agree': +2, stress: +4 },
        result: `{name은} 고든 아저씨가 불러 주는 대로 한 치의 어긋남 없이 해냈다. 만찬은 무사히 끝났다. 아저씨가 말했다. "다음엔 네 차림으로 하자." 진심 같았다.` },
      { label: '당신도 앞치마를 두른다', effects: { trust: +6, gHealth: -6, 'stat.sens': +4, gold: +80 },
        result: `당신은 감자를 깎고 {name은} 불 앞을 지켰다. 마흔 접시가 나가는 동안 둘은 한마디도 하지 않았다. 다 끝나고 나서야 동시에 웃음이 터졌다.` },
      { label: '성당 배식 솜씨를 보탠다', conditions: ["guardian == 'priest'"], effects: { trust: +5, 'stat.moral': +4, 'stat.sens': +3, gHealth: -4, gold: +80 },
        result: `당신은 성당에서 수백 명 배식을 하던 시절처럼 국자를 잡았다. 마흔 명쯤이야. {name이} 눈을 동그랗게 떴다. "{call}, 이런 건 어디서 배웠어?"` },
    ],
  },
  {
    id: 'b04a_inn_keys', title: '열세 개의 열쇠', age: [16, 17], weight: 2.5, image: 'bg/tavern_inn',
    conditions: ['mastery.inn >= 8'], requiresActivity: 'inn',
    text: `여관 「세 개의 달」의 노부부가 {name}에게 열쇠 꾸러미를 내밀었다. "우리 둘 다 이제 계단이 힘들어. 겨울 동안 밤 장부를 맡아 주련? 손님 받는 건 네가 우리보다 낫더라." 열쇠는 열세 개, 그중 하나는 아무도 쓰지 않는 다락방 열쇠였다.`,
    choices: [
      { label: '맡아 보게 한다', effects: { 'stat.elo': +6, 'stat.chm': +4, gold: +100, stress: +8, 'pers.ambit': +2 },
        result: `겨울 내내 {name은} 밤 장부를 적고 술 취한 뱃사람을 달래고 빈방을 데웠다. 봄이 오자 노부부가 말했다. "이 여관, 네가 물려받으면 좋겠구나."` },
      { label: '다락방을 열어 본다', conditions: ['flag.stranger_asked'], effects: { 'stat.int': +3, 'stat.sens': +4, 'pers.extro': +2, trust: +3 },
        result: `다락방 궤짝 안에 오래전 후드 손님이 두고 간 망토가 있었다. 안주머니엔 은발 아이의 그림 한 장. {name은} 그림을 접어 넣었다. "이제 누가 날 찾아오면, 내가 먼저 문을 열어 줄 거야."` },
      { label: '공부가 먼저다', effects: { 'stat.int': +4, trust: -2, 'pers.ambit': -1, stress: -4 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 열쇠 꾸러미를 정중히 돌려드렸다. 노부부는 서운한 얼굴로 웃었다. 그날 밤 {name은} 책상 앞에서 오래 펜만 굴렸다.`
          : `"밤 장부도 공부야." {name은} 열쇠를 돌려주면서도 투덜거렸다. 그 뒤로도 여관 일을 마치면 노부부의 장부 정리를 몰래 거들었다.` },
      { label: '계단 손잡이부터 고친다', effects: { 'stat.str': +3, 'stat.moral': +5, reputation: +3, 'pers.good': +2 },
        result: `{name은} 열쇠 대신 망치를 들었다. 삐걱이는 계단에 손잡이를 달고 문턱을 깎았다. 노부부는 결국 열쇠 꾸러미를 {name}의 허리에 매 주었다. "이런 애한테 줘야지."` },
    ],
  },
  {
    id: 'b04a_farm_field', title: '동쪽 밭 세 마지기', age: [16, 17], weight: 2.5, image: 'bg/wheat_field',
    conditions: ['mastery.farm >= 8'], requiresActivity: 'farm',
    text: `한스 아저씨가 밭두렁에 앉아 무릎을 문질렀다. "이젠 허리가 말을 안 들어. 동쪽 밭 세 마지기, 네가 부쳐 볼 테냐? 소작료는 첫해엔 안 받으마." 바람이 밀 이삭을 쓸고 지나갔다. {name은} 대답 대신 밭두렁을 끝까지 걸어 보았다. 세 마지기는 생각보다 넓었다.`,
    choices: [
      { label: '맡아서 부쳐 봐 (-50G)', conditions: ['gold >= 50'], effects: { 'stat.hp': +6, 'stat.str': +4, 'stat.int': +3, gold: -50, 'pers.ambit': +1 },
        result: `{name은} 첫해 밀 대신 보리를 심었다. 땅도 쉬어야 한다고 했다. 한스 아저씨가 콧방귀를 뀌었다가, 가을에 말없이 사과 한 바구니를 들고 찾아왔다.` },
      { label: '배운 대로 돌려짓기', conditions: ['mastery.farmschool >= 4'], check: { stat: 'int', dc: 200, bonus: (s) => (s.mastery.farmschool || 0) * 3 },
        success: { effects: { 'stat.int': +8, 'stat.hp': +4, gold: +150, reputation: +4 },
          result: `{name은} 농업학교에서 배운 대로 콩과 밀을 돌려 심었다. 가을에 동쪽 밭 수확이 마을에서 제일 많았다. 이웃들이 씨앗을 얻으러 줄을 섰다.` },
        fail: { effects: { 'stat.int': +3, gold: -80, stress: +6 },
          result: `책에서 본 대로 했는데 가뭄이 왔다. 콩이 절반이나 말랐다. {name은} 장부에 손해를 적고 그 옆에 이유를 적었다. 내년엔 다를 것이다.` } },
      { label: '새 허수아비를 세운다', conditions: ['seen.b01_autumn_scarecrow >= 1'], effects: { trust: +6, 'stat.sens': +4, stress: -6 },
        result: `{name은} 어릴 적 세운 낡은 허수아비 옆에 새것을 세웠다. 팔짱 대신 손을 흔드는 허수아비. "옛날 건 {call} 닮았잖아. 이건 나야." 둘이 나란히 섰다.` },
      { label: '품삯부터 받고 일한다', effects: { 'stat.str': +3, gold: +60, 'pers.ambit': +1, trust: +2 },
        result: `"내 밭은 내가 번 돈으로 살래." {name은} 한스 아저씨에게 품삯을 받고 일하겠다고 했다. 한스가 껄껄 웃었다. "고집은 누굴 닮았나."` },
    ],
  },

  // ── 공통: 열일곱의 쪽지 ──────────────────────────────────────────────
  {
    id: 'b04a_dream_revisit', title: '열다섯 살의 쪽지', age: [17, 17], weight: 2.5,
    conditions: ['flag.b04a_dream_told'],
    text: `밤늦게 {name이} 낡은 쪽지 한 장을 들고 왔다. 열다섯 살 저녁, 큐브가 장래 희망을 묻던 날 몰래 적어 둔 것이란다. 삐뚤빼뚤한 글씨 몇 줄. "{call}, 이거 읽어 봐. 창피하니까 소리 내지는 말고."`,
    choices: [
      { label: '지금의 너를 말해 줘', effects: { trust: +5, 'stat.sens': +4, stress: -6 },
        result: (s) => dreamNow(s) },
      { label: '꿈은 바뀌어도 돼', effects: { 'pers.roman': +2, 'stat.sens': +3, trust: +3, stress: -4 },
        result: `"바뀌어도 돼?" {name은} 쪽지를 다시 접었다. "그럼 이건 첫 번째 꿈이라고 해 둘래." 아이는 쪽지 귀퉁이에 작게 '1'이라고 적었다.` },
      { label: '아직 갈 길이 멀다', effects: { 'pers.ambit': +3, 'stat.int': +3, trust: -2, stress: +4 },
        result: (s) => s.personality.agree >= 10
          ? `{name은} 고개를 끄덕이고 쪽지를 일기장 사이에 끼웠다. "알아. 그래서 좋은 거야." 대답이 생각보다 단단했다.`
          : `"칭찬 한 번이 그렇게 어려워?" {name은} 쪽지를 낚아채 갔다. 다음 날 아침, 쪽지는 식탁 위에 펴진 채 놓여 있었다.` },
    ],
  },
];

// 열다섯의 장래 희망 — 숙련·능력치·성격으로 아이가 꺼내는 꿈이 달라진다
function dreamLine(s) {
  const st = s.stats, m = s.mastery || {}, p = s.personality;
  let dream;
  if ((m.smith || 0) >= 6) dream = '대장간 불 앞에 있으면 시간이 금방 가. 쇠가 내 말을 듣는 순간이 좋아.';
  else if ((m.sewing || 0) >= 6) dream = '바늘 끝에서 옷이 생겨나는 게 좋아. 언젠가 왕도 사람들이 내 옷을 입었으면 해.';
  else if (st.chm >= 180 && st.agi >= 140) dream = '음악이 들리면 몸이 먼저 움직여. 큰 무대에서 춤춰 보고 싶어.';
  else if (st.agi >= st.str && st.agi >= 150) dream = '항구에 가면 가슴이 뛰어. 저 배들이 어디까지 가는지 보고 싶어.';
  else if (st.str >= 200) dream = '검을 쥐면 마음이 조용해져. 누군가를 지키는 사람이 되고 싶어.';
  else if (st.sens >= 200) dream = '노래든 그림이든, 내 안에 있는 걸 밖으로 꺼내는 일을 하고 싶어.';
  else dream = '아직 잘 모르겠어. 근데 모른다고 말할 수 있어서 좋아.';
  const tail = p.ambit >= 25 ? ' 기왕이면 왕국에서 제일 잘하고 싶어.'
    : p.agree >= 25 ? ' ……{call}도 괜찮다고 해 줄 거지?'
      : p.roman >= 25 ? ' 말도 안 되는 꿈이어도.' : '';
  return `{name은} 한참 생각하다 말했다. "${dream}${tail}" 큐브가 날개로 박수를 쳤다.`;
}

// 열일곱의 쪽지 — 실제로 이룬 진로 플래그를 아이가 손가락으로 센다
function dreamNow(s) {
  const f = s.flags, done = [];
  if (f.sea_path) done.push('배를 탔고');
  if (f.knight_path) done.push('흰 띠를 맸고');
  if (f.knight_oath_wander) done.push('길 위에서 맹세했고');
  if (f.prima_debut) done.push('대극장에서 춤췄고');
  if (f.fashion_show) done.push('내 옷을 무대에 세웠고');
  if (f.masterwork) done.push('내 이름을 새긴 칼을 벼렸고');
  if (f.art_path) done.push('궁정 악단이 날 불렀고');
  if (f.stage_star) done.push('무대에서 박수를 받았고');
  if (f.scholar_path) done.push('학술원이 날 불렀고');
  if (f.merchant_path) done.push('길드 장부를 맡았고');
  if (f.church_path) done.push('성당이 날 불렀고');
  if (f.ball_won) done.push('무도회에서 이겼고');
  if (!done.length) return `"아직 아무것도 못 이뤘어." {name은} 그렇게 말하면서도 웃었다. "근데 이걸 쓸 때보다는 내가 뭘 좋아하는지 알아." 쪽지는 다시 서랍으로 들어갔다.`;
  const list = done.slice(0, 3).join(', ').replace(/고$/, '어');
  return `"${list}." {name이} 손가락을 접으며 셌다. "열다섯 살의 내가 들으면 기절하겠다." 쪽지 위로 금빛 별 몇 개가 내려앉았다.`;
}
