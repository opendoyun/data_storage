// 배치 b12 — 그림자의 길: 밤 시장 · 소매치기 참새단 · 그림자 길드 · 사기와 흥정 · 도박판 · 왕실 첩보부 · 의적 이야기 · 돌아오는 길 (13~17세)
// 규칙: docs/game-design/content-contract.md  (id·비공개 플래그 접두사 b12_)
//
// 반복 인물(관계 수치 없음)
//   로웬 — 그림자 길드의 남자(npc 'shadow'). 은 귀걸이, 검은 카드를 손가락 사이로 굴린다. b08 대장간의 '밀랍 열쇠' 청년과 같은 사람.
//   보리 — 참새단(소매치기 꼬마 패) 대장, 앞니 빠진 열세 살 여자아이.   노나 할멈 — 밤 시장 군밤 장수. 실은 왕실 첩보부 '셋째 달'의 연락책이자 옛 의적 '검은 참새'.
//   회색 장갑의 노인 — 수로 밑 길드의 우두머리.   근위대장(npc 'knight_cpt' 이미지는 쓰지 않고 이름만) — 첩보부 최종 시험관.
//
// 공용 플래그 세팅
//   shadow_path   ← black_card(카드를 받음). amends(돌려주는 계절)에서 false로 되돌린다 = 그림자 세계에서 돌아옴(암살자 엔딩 문이 닫힘).
//   spy_recruited ← masque(가면 무도회 시험 성공) · two_reports(이중 첩자 보고) · fifth_lock · way_back · name_envelope (모두 b12_spy_contact 필요)
//   악평 상승 경로(암살자·사기꾼·도적단 두목·현상금 사냥꾼 지원): bell_coat · star_shard · dice_cellar · midnight_parcel · guild_hall
//     · false_pedigree(+10, 화술) · fifth_lock(+10, 민첩) · rooftop(+6, 민첩) · name_envelope(+12, 민첩) · harbor_crew(+10, 근력·화술)
//
// 연쇄 (← 랜덤 등장 / ⇒ chainOnly)
//   ① 첫 심부름:   black_card ⇒ midnight_parcel ⇒(실패) watch_post        (rooftop 실패 ⇒ watch_post 도 합류)
//   ② 발각:        laundry_card ⇒ follow_night                            (보호자가 알게 되는 장면: watch_post · laundry_card · follow_night · rooftop · way_back · moon_table)
//   ③ 셋째 달:     sparrow_ballad ⇒ sparrow_old … moon_recruit ⇒(수락) masque  /  moon_recruit ⇒ moon_table ⇒(허락) masque  … two_reports(길드 겹침)
//   ④ 돌아오는 길: way_back ⇒ amends   (guild_hall에서 촛불 앞에서 돌아서도 ⇒ amends)
//
// 비공개 플래그 (모두 이 파일 안의 조건에서 읽힘)
//   b12_met_bori b12_bori_trust b12_bori_saved · b12_marked(길드 눈에 띔) · b12_bureau_eye(첩보부 눈에 띔) · b12_spy_contact b12_spy_refused
//   b12_told_guardian b12_guardian_knows b12_guardian_silent · b12_rowen_talk b12_rowen_gone · b12_guild_member b12_guild_locks b12_guild_tongue
//   b12_guild_grudge b12_guild_fallen b12_left_guild
// 코어·타 배치 콜백: magic_awake · respected_privacy · met_leon · rel.leon · rel.garrett · rel.theodora · seen.b08_smith_key(로웬 재등장)
// 보호자 출신 선택지: adventurer 2 · knight 3 · merchant 1 · priest 1(+amends 문장 분기) · scholar 1
// 효과 키는 tools/test.mjs 무결성 검사에 맞춰 stat/pers/rel/flag/스칼라만 쓴다 (item은 조건에만).
// b12_masque만 repeatable: 첫 시험은 포섭 수락 직후 연쇄로 오고, 떨어지면 "다음 기회는 근위대장이 정한다" — 랜덤으로 한 번 더(최대 2회), 합격·거절 시 닫힘.
// 공주 외형(character-design.md): 은백색 긴 생머리·붉은 눈, 감정이 일렁이면 금색 별빛. 시장 사람들이 부르는 별명 '은발'도 여기서 온다.

export default [
  // ══ 밤 시장 (13~16) ════════════════════════════════════════════════════
  {
    id: 'b12_lantern_hands', title: '등불 아래의 손', age: [13, 15], weight: 1.2, image: 'bg/night_market',
    text: `항구 밤 시장. 줄줄이 흔들리는 등불, 보랏빛 연기, 호객 소리. 군밤 봉지를 든 {name이} 당신 소매를 잡아당겼다. "{call}, 저 애 봐." 모자를 눌러쓴 꼬마의 손이 비단 장수 허리춤 돈주머니로 미끄러져 들어가고 있었다.`,
    choices: [
      { label: '"도둑이야!" 소리친다', effects: { 'stat.moral': +4, reputation: +2, 'pers.good': +2, stress: +4 },
        result: `비단 장수가 꼬마의 옷깃을 낚아챘다. 모자가 벗겨지자 앞니 빠진 여자아이 얼굴이 드러났다. 꼬마는 {name을} 똑바로 노려보더니 몸을 비틀어 빠져나갔다. "기억할게, 은발."` },
      { label: '모른 척 지나간다', effects: { 'stat.sens': +3, 'pers.good': -1, 'pers.agree': +1, stress: +3 },
        result: `당신은 {name}의 어깨를 감싸고 돌아섰다. 아이는 몇 걸음마다 뒤를 돌아봤다. "우리가 본 거, 없던 일이 되는 거야?" 군밤이 다 식도록 아무도 대답하지 않았다.` },
      { label: '꼬마를 뒤쫓게 둔다', effects: { 'stat.agi': +4, 'pers.extro': +2, trust: -3, 'flag.b12_met_bori': true, 'flag.b12_marked': true },
        result: `{name이} 손을 놓고 인파 속으로 사라졌다. 반 시간 뒤 숨을 몰아쉬며 돌아와서는 웃었다. "보리래. 열세 살, 참새단 대장." 아이 어깨 너머 골목 담 위에서 은 귀걸이 하나가 반짝하고 사라졌다.` },
      { label: '꼬마의 손목을 살며시 잡는다', conditions: ["guardian == 'adventurer'"], effects: { trust: +4, 'stat.moral': +3, gold: -5, 'flag.b12_met_bori': true },
        result: `당신은 지나가는 척 꼬마의 손목을 잡아 돈주머니를 제자리에 돌려놓고, 그 손에 군밤 봉지를 쥐여 줬다. "아줌마, 뭐야?" {name이} 대신 으쓱했다. "우리 {call}. 옛날에 모험가였어."` },
    ],
  },
  {
    id: 'b12_bell_coat', title: '방울 열두 개 달린 외투', age: [13, 15], weight: 2.6, conditions: ['flag.b12_met_bori'], image: 'bg/night_market',
    text: `보리가 {name을} 참새단 은신처인 그물 창고에 데려갔다고 한다. 기둥엔 방울 열두 개를 꿰단 낡은 외투. "방울 하나 안 울리고 주머니 속 동전을 꺼내면 진짜 참새야." 저녁상 앞에서 그 얘기를 하는 {name}의 손가락이 저도 모르게 허공을 집었다.`,
    choices: [
      { label: '연습만 해 보라고 한다', check: { stat: 'agi', dc: 100 },
        success: { effects: { 'stat.agi': +7, 'pers.extro': +2, 'flag.b12_marked': true },
          result: `방울 열두 개가 끝까지 조용했다. 참새단 꼬마들이 휘파람을 불었다. 그물 더미 위에서 구경하던 은 귀걸이의 청년이 손뼉을 두 번 쳤다. "손 좋네."` },
        fail: { effects: { 'stat.agi': +3, stress: +4, 'pers.ambit': +1 },
          result: `방울이 요란하게 울렸다. 보리가 배를 잡고 굴렀다. 얼굴이 빨개져 돌아온 {name은} 그날 밤 자기 외투에 방울을 꿰매 달았다. 밤새 짤랑 소리가 났다.` } },
      { label: '말리지 않고 듣기만 한다', effects: { gold: +30, infamy: +5, 'stat.agi': +4, 'pers.good': -3, 'flag.b12_marked': true },
        result: `당신이 아무 말도 하지 않자 {name은} 그걸 허락으로 들었다. 이튿날 생선 장수 앞치마에서 동전 세 닢. 아이는 그 돈으로 꿀과자를 샀지만 끝내 먹지 못하고 서랍에 넣었다. 아들 신발값이 모자란다는 생선 장수의 푸념이 시장 끝까지 들렸다.` },
      { label: '다른 벌이를 같이 찾자고 한다', effects: { 'stat.elo': +4, 'stat.moral': +3, 'pers.good': +2, stress: +4, 'flag.b12_bori_trust': true },
        result: `"다른 벌이? 누가 우릴 써 주는데?" 보리가 코웃음 쳤다. {name은} 사흘 동안 장터를 돌아 생선 배 따는 자리 둘을 구해 왔다. 보리는 고맙단 말 대신 빠진 앞니 사이로 휘파람을 불었다.` },
      { label: '참새단을 성당 급식소로 부른다', conditions: ["guardian == 'priest'"], effects: { 'stat.faith': +3, 'stat.moral': +3, gold: -20, 'flag.b12_bori_trust': true },
        result: `다음 날 저녁 성당 뒷문에 모자 쓴 꼬마 일곱이 줄을 섰다. 보리는 수프를 세 그릇 비우고 그릇까지 핥았다. "신부 아저씨, 내일도 해?" {name이} 당신보다 먼저 고개를 끄덕였다.` },
    ],
  },
  {
    id: 'b12_star_shard', title: '별똥별 조각, 한 개 30G', age: [13, 16], weight: 1, image: 'bg/night_market',
    text: `"별의 아이가 떨어지던 밤, 함께 떨어진 진짜 별 조각! 지니면 병이 낫고 소원이 이뤄진다오!" 좌판 위 유리 조각들이 등불에 반짝인다. 한 개에 30G. {name이} 당신을 보더니 입술을 꾹 깨물었다. 웃음을 참는 건지 화를 참는 건지 알 수 없었다.`,
    choices: [
      { label: '가짜라고 밝힌다', check: { stat: 'elo', dc: 115 },
        success: { effects: { 'stat.elo': +6, reputation: +4, 'pers.good': +2, 'flag.b12_bureau_eye': true },
          result: `"별똥별은 떨어지면 돌이 돼요. 유리처럼 깨지지 않고요." {name이} 조각 하나를 떨어뜨렸다. 쨍그랑. 사람들이 돈을 돌려 달라 아우성쳤다. 군밤 장수 할머니가 그 꼴을 보고 낄낄 웃었다.` },
        fail: { effects: { stress: +6, 'stat.elo': +2, 'pers.extro': -2 },
          result: `"꼬마가 뭘 안다고!" 장수의 큰 목소리에 구경꾼들이 오히려 장수 편을 들었다. 할머니 한 분이 아픈 손자 주겠다며 조각을 사 갔다. {name은} 집에 오는 내내 말이 없었다.` } },
      { label: '바람잡이를 서 주고 몫을 받는다', effects: { gold: +80, infamy: +6, 'stat.elo': +4, 'pers.good': -3, 'flag.b12_marked': true },
        result: `장수가 {name}의 은발을 보고 눈을 빛냈다. "이 아가씨 머리 좀 보시오! 별 조각 지닌 지 석 달 만에 이리 됐소!" 조각은 금세 동났다. 몫으로 받은 80G는 묵직했고, 그날부터 거울 보기가 조금 싫어졌다.` },
      { label: '하나 사서 같이 웃는다', effects: { gold: -30, 'stat.sens': +3, trust: +3, stress: -5 },
        result: `당신은 30G를 내고 제일 못생긴 조각을 골랐다. 그걸 등불에 비춰 보던 {name이} 웃음을 터뜨렸다. "진짜 별의 아이가 인정한 가짜네." 그 유리 조각은 지금도 창틀에서 아침마다 작은 무지개를 만든다.` },
      { label: '손끝에 진짜 별빛을 띄운다', conditions: ['flag.magic_awake'], effects: { 'stat.mag': +4, reputation: +3, stress: +5, 'flag.b12_bureau_eye': true },
        result: `{name}의 손끝에서 금빛 별 하나가 피어올랐다. 좌판의 유리 조각들이 한순간에 초라해졌다. 장수는 슬금슬금 짐을 쌌다. 군밤 장수 할머니만이 사라지는 별빛을 끝까지 눈으로 좇았다.` },
    ],
  },
  {
    id: 'b12_dice_cellar', title: '세 달 주사위', age: [14, 16], weight: 2.2, requiresActivity: ['inn', 'diner'], image: 'bg/tavern_inn',
    text: `일을 마친 {name을} 데리러 항구에 간 밤, 여관 지하에서 주사위 구르는 소리가 올라왔다. 짐꾼 하나가 한 달 품삯을 판에 다 밀어 넣는 중이다. 물주는 굴릴 때마다 손목을 똑같은 각도로 튕긴다. {name이} 당신 귀에 속삭였다. "저거, 속임수야."`,
    choices: [
      { label: '속임수를 밝혀내게 한다', check: { stat: 'elo', dc: 160 },
        success: { effects: { 'stat.elo': +6, 'stat.moral': +3, reputation: +3, 'flag.b12_bureau_eye': true },
          result: `"그 주사위, 물잔에 넣어 봐요." 물주가 굳었다. 물속 주사위는 번번이 같은 면을 위로 하고 멈췄다. 짐꾼은 품삯을 되찾았다. 구석에서 군밤을 까던 할머니가 혀를 찼다. "눈이 좋은 아이로구먼."` },
        fail: { effects: { stress: +8, infamy: +3, 'stat.elo': +2, 'pers.extro': -2 },
          result: `물주는 웃으며 주사위를 바꿔치기했다. "아가씨가 판을 깨려나 보네?" 사람들 눈총에 쫓겨 나왔다. 다음 날 항구엔 은발 아가씨가 도박판에 드나든다는 말이 돌았다.` } },
      { label: '판에 끼어 물주를 이긴다', conditions: ['gold >= 50'], check: { stat: 'int', dc: 190 }, minigame: 'exam',
        success: { effects: { gold: +120, infamy: +5, 'stat.int': +5, 'pers.good': -2, 'flag.b12_marked': true },
          result: `{name은} 물주가 손목을 튕기는 판에만 반대로 걸었다. 다섯 판 만에 120G. 물주의 얼굴이 하얘졌다. 그사이 짐꾼은 빈손으로 계단을 올라갔다. 그 굽은 등이 오래 눈에 밟혔다.` },
        fail: { effects: { gold: -50, stress: +8, infamy: +3, 'stat.int': +2 },
          result: `세 판 만에 50G가 사라졌다. 물주가 친절하게 웃었다. "또 와, 아가씨." {name은} 계단을 오르며 주먹을 쥐었다 폈다 했다. 그 손이 한동안 근질거렸다.` } },
      { label: '조용히 데리고 나온다', effects: { 'stat.moral': +2, 'pers.agree': +2, trust: +2, stress: +4 },
        result: `당신은 {name}의 손을 잡고 계단을 올랐다. "그냥 가?" "그냥 가." 등 뒤로 짐꾼의 한숨이 길게 따라왔다. 잠들기 전 아이가 한 번 더 물었다. "정말 그냥 가도 되는 거였어?"` },
      { label: '물주 귀에 공방 이름을 속삭인다', conditions: ["guardian == 'merchant'"], effects: { 'stat.elo': +4, 'pers.good': +2, trust: +4, reputation: +2 },
        result: `당신은 물주 귀에 가짜 주사위를 만드는 공방 이름을 속삭였다. 물주가 짐꾼의 돈을 슬그머니 밀어 주었다. 나오는 길에 {name이} 물었다. "{call}, 저런 건 어떻게 알아?" "장사 삼십 년이면 별걸 다 알게 돼."` },
    ],
  },
  {
    id: 'b12_sparrow_ballad', title: '검은 참새의 노래', age: [13, 16], weight: 1, image: 'bg/night_market',
    text: `밤 시장 분수대에서 떠돌이 가수가 류트를 뜯는다. "검은 참새 날아든 밤, 부잣집 곳간이 비고, 골목마다 빵이 쌓였네—" 넋을 놓고 듣던 {name이} 당신 소매를 당겼다. "{call}, 의적은 나쁜 사람이야, 좋은 사람이야?"`,
    choices: [
      { label: '"훔친 건 훔친 거야."', effects: { 'stat.moral': +4, 'pers.good': +2, 'pers.roman': -2, stress: +2 },
        result: `"그럼 빵 받은 사람들은?" "고마웠겠지. 그래도 훔친 건 훔친 거야." {name은} 입을 삐죽였지만, 집에 오는 내내 그 말을 곱씹는 얼굴이었다.` },
      { label: '"누구 걸 누구한테 줬는지 봐야지."', effects: { 'stat.sens': +4, 'pers.roman': +2, 'pers.agree': -1, 'pers.good': -1 },
        result: `"참새가 잘못 고르면?" "그땐 그냥 도둑이지." {name은} 노래가 끝날 때까지 분수대를 떠나지 않았다. 마지막 소절을 따라 흥얼거리면서.` },
      { label: '"진짜 이야기를 찾아보자."', effects: { 'stat.int': +4, 'stat.cult': +3, 'pers.roman': -1, trust: +2 }, next: 'b12_sparrow_old',
        result: `"노래는 늘 반만 맞거든." 둘은 시장 사람들에게 검은 참새를 아느냐고 묻고 다녔다. 다들 고개를 저었다. 군밤 장수 할머니만 빼고.` },
      { label: '류트로 화음을 넣는다', conditions: ['item.lute >= 1'], effects: { 'stat.sens': +4, 'stat.chm': +3, gold: +20 },
        result: `{name이} 등에 멘 류트를 내려 가수의 곡에 화음을 얹었다. 구경꾼이 두 겹으로 늘었다. 가수가 동전 그릇을 반으로 갈라 줬다. "참새 노래는 둘이 불러야 제맛이지."` },
    ],
  },
  {
    id: 'b12_sparrow_old', title: '노래가 빠뜨린 소절', chainOnly: true, age: [13, 16], image: 'bg/night_market',
    text: `군밤 장수 노나 할멈이 숯불을 뒤적이며 웃었다. "노래가 빠뜨린 게 있지. 참새는 곳간만 턴 게 아니야. 장부도 털었단다. 누가 누구 빵을 훔쳤는지 적힌 장부. 그걸 들고 제 발로 왕궁에 걸어 들어갔지." 할멈이 {name}의 눈을 들여다봤다. "뒷이야기도 듣고 싶으냐?"`,
    choices: [
      { label: '"듣고 싶어요."', effects: { 'stat.int': +4, 'pers.ambit': +2, 'flag.b12_bureau_eye': true },
        result: `"왕궁은 참새를 감옥 대신 일터에 넣었단다. 도둑 잡는 일." 할멈이 군밤 봉지를 건넸다. 봉지 안쪽에 작은 반달이 그려져 있었다. "또 오너라. 눈 밝은 아이는 언제든 환영이다."` },
      { label: '"노래로 충분해요."', effects: { 'stat.sens': +3, 'pers.roman': +3, stress: -4 },
        result: `할멈이 껄껄 웃었다. "그것도 지혜지." 셋은 군밤을 나눠 먹으며 노래를 한 번 더 들었다. 그날 밤 {name은} 검은 참새를 그리다 잠들었다.` },
      { label: '옛 재판 기록을 함께 찾아본다', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +6, 'stat.cult': +3, trust: +4, 'flag.b12_bureau_eye': true },
        result: `왕도 문서고의 오십 년 전 기록. '검은 참새, 사면. 이후 기록 봉인.' {name이} 봉인 도장을 손끝으로 쓸었다. "{call}, 봉인됐다는 건 아직 비밀이란 거지?" 다음 날 할멈이 먼저 아는 척을 했다.` },
    ],
  },

  // ══ 그림자 길드의 문 (14~16) ═══════════════════════════════════════════
  {
    id: 'b12_black_card', title: '은빛 초승달', age: [14, 16], weight: 3, conditions: ['flag.b12_marked'], npc: 'shadow',
    text: (s) => `밤 시장 골목 끝, 은 귀걸이를 한 청년이 카드를 손가락 사이로 굴리며 {name}의 앞을 막았다. ${s.seen?.b08_smith_key ? '대장간에 밀랍을 내밀던 바로 그 얼굴이다. ' : ''}검은 바탕에 은빛 초승달. "로웬이야. 너 손 좋더라. 내일 자정, 꾸러미 하나만 수로 다리까지. 묻지 말고, 열지 말고. 100G."`,
    choices: [
      { label: '꾸러미를 맡기로 한다', effects: { 'flag.shadow_path': true, 'pers.good': -2, trust: -2, stress: +4 }, next: 'b12_midnight_parcel',
        result: `{name은} 카드를 주머니 깊숙이 넣었다. 그날 저녁 식탁에서 아이는 평소보다 말이 많았다. 당신과는 한 번도 눈을 마주치지 않았다.` },
      { label: '값을 올려 부른다', check: { stat: 'elo', dc: 140 },
        success: { effects: { 'flag.shadow_path': true, gold: +50, 'stat.elo': +5, 'pers.ambit': +2 }, next: 'b12_midnight_parcel',
          result: `"묻지도 열지도 않는 값이 겨우 100G예요?" 로웬이 휘파람을 불었다. "150. 선금 50." 금화 한 줌이 {name}의 손바닥에 떨어졌다. 생각보다 가벼웠다.` },
        fail: { effects: { 'flag.shadow_path': true, 'stat.elo': +2, 'pers.good': -2 }, next: 'b12_midnight_parcel',
          result: `로웬이 웃음을 터뜨렸다. "흥정은 일을 해 본 다음에 하는 거야, 꼬마." {name은} 얼굴이 달아오른 채 카드를 받았다. 지고 싶지 않은 마음이 겁보다 컸다.` } },
      { label: '카드를 돌려준다', effects: { 'stat.moral': +4, 'pers.good': +2, stress: -2 },
        result: `"안 할래요." 로웬은 카드를 받아 들고 어깨를 으쓱했다. "그래. 그림자는 기다리는 게 일이거든." 그는 골목 어둠에 녹아들 듯 사라졌다. {name은} 그 자리에 한참 서 있었다.` },
      { label: '{call}에게 카드를 보여 준다', conditions: ['trust >= 55'], effects: { trust: +6, 'pers.agree': +2, 'flag.b12_told_guardian': true },
        result: `그날 밤 식탁 위에 검은 카드가 놓였다. "{call}, 이거 받았어. 근데…… 좀 해 보고 싶기도 했어." 둘이 오래 의논한 끝에 내린 결론은, 카드를 서랍 맨 아래 칸에 넣어 두는 것이었다.` },
    ],
  },
  {
    id: 'b12_midnight_parcel', title: '자정의 꾸러미', chainOnly: true, age: [14, 16], image: 'bg/night_market',
    text: `자정. 기름 먹인 천에 싼 꾸러미는 생각보다 가벼웠다. 수로 다리까지 남은 골목은 셋. 그때 모퉁이 너머로 경비대 등불이 흔들리며 다가왔다. {name}의 심장이 꾸러미보다 무겁게 뛰었다.`,
    choices: [
      { label: '골목으로 내달린다', check: { stat: 'agi', dc: 140 }, minigame: 'adventure',
        success: { effects: { gold: +100, 'stat.agi': +6, infamy: +4, 'pers.extro': +1 },
          result: `빨랫줄 밑으로, 생선 상자 위로. 등불은 두 골목 뒤에서 길을 잃었다. 다리 밑에서 꾸러미를 받은 로웬이 금화 주머니를 던졌다. "합격." {name은} 새벽녘에 창문으로 들어왔다.` },
        fail: { effects: { infamy: +8, reputation: -4, stress: +10, 'stat.agi': +2, 'pers.extro': -2 }, next: 'b12_watch_post',
          result: `생선 상자가 와르르 무너졌다. 경비병의 손이 {name}의 옷깃을 잡았다. 꾸러미는 어둠 속 누군가가 이미 채 간 뒤였다. 남은 건 이름을 묻는 경비병의 목소리뿐이었다.` } },
      { label: '경비병에게 먼저 말을 건다', check: { stat: 'elo', dc: 150 },
        success: { effects: { gold: +100, 'stat.elo': +6, infamy: +3, 'pers.good': -2 },
          result: `"아저씨, 밤에 여는 약방 어디예요? 우리 {call이} 열이 나서요." 경비병은 길까지 친절히 일러 줬다. 다리 밑에서 로웬이 휘파람을 불었다. "거짓말에 {call}까지 팔았어? 독하네."` },
        fail: { effects: { infamy: +8, reputation: -4, stress: +10, 'stat.elo': +2, 'pers.extro': -2 }, next: 'b12_watch_post',
          result: `"이 시간에 약방? 그 꾸러미는 뭐냐." 말이 꼬였다. 경비병이 손을 뻗는 순간 어둠 속에서 누가 꾸러미를 채 갔다. 등불 아래 남은 건 {name} 혼자였다.` } },
      { label: '숨어서 꾸러미를 풀어 본다', effects: { 'stat.sens': +4, 'stat.moral': +2, infamy: +2, gold: +70, stress: +4 },
        result: `처마 밑에 웅크려 매듭을 풀었다. 통행증 열 장, 왕도 저택에서 도망친 하인들 이름이었다. {name은} 꾸러미를 다시 묶어 다리까지 갔다. 로웬이 매듭을 보고 웃었다. "늦었네. 열어 봤구나. 괜찮아, 열어 보는 애가 오래 살아."` },
      { label: '경비병에게 꾸러미를 넘긴다', effects: { reputation: +3, 'stat.moral': +2, stress: +8, 'flag.b12_guild_grudge': true, 'flag.b12_bureau_eye': true },
        result: `{name은} 등불 앞으로 걸어 나가 꾸러미를 내밀었다. 안에는 도망친 하인들의 통행증. "잘했다, 꼬마." 칭찬을 듣는 손끝이 차가워졌다. 이튿날 로웬은 {name을} 처음 보는 사람처럼 지나쳤다.` },
    ],
  },
  {
    id: 'b12_watch_post', title: '경비대 초소의 새벽', chainOnly: true, age: [14, 17], image: 'bg/harbor',
    text: `새벽, 경비대 초소에서 전갈이 왔다. 당신이 들어서자 의자에 웅크린 {name이} 고개를 들었다가 도로 숙였다. 초소장이 장부를 두드렸다. "물건은 못 찾았소. 어리니까 벌금 80G에 이름 한 줄로 끝내지. 다음엔 장담 못 하오."`,
    choices: [
      { label: '벌금을 내고 아무것도 묻지 않는다', conditions: ['gold >= 80'], effects: { gold: -80, trust: +5, stress: -4, 'flag.b12_guardian_knows': true },
        result: `돌아오는 길, 둘 다 말이 없었다. 집 앞에서 {name이} 먼저 멈춰 섰다. "왜 안 물어봐?" "말하고 싶을 때 말해." 아이 눈가에서 금빛 별빛이 잘게 부서지더니, 그제야 울음이 터졌다.` },
      { label: '모두 앞에서 엄하게 꾸짖는다', conditions: ['gold >= 80'], effects: { gold: -80, infamy: -3, trust: -8, 'pers.agree': +3, 'flag.b12_guardian_knows': true },
        result: `당신의 목소리가 초소 벽을 울렸다. 경비병들이 고개를 끄덕였고, 초소장은 장부의 이름 옆에 '보호자 엄함'이라 적었다. {name은} 집에 오는 내내 당신보다 세 걸음 앞에서 걸었다.` },
      { label: '벌금 대신 일로 갚게 해 달라 한다', effects: { 'stat.hp': +4, 'stat.moral': +3, infamy: -2, stress: +8, 'flag.b12_guardian_knows': true },
        result: `{name은} 열흘 동안 새벽마다 초소 바닥을 닦고 말 여물을 날랐다. 마지막 날 초소장이 장부에서 이름 한 줄을 그어 줬다. "다신 보지 말자, 꼬마." 아이가 그제야 웃었다.` },
      { label: '옛 동료인 초소장에게 부탁한다', conditions: ["guardian == 'knight'"], effects: { infamy: -5, reputation: -3, trust: +3, 'pers.good': -1, 'flag.b12_guardian_knows': true },
        result: `초소장은 당신을 알아보고 한숨을 쉬었다. "기사님 부탁이니." 장부의 한 줄이 지워졌다. 돌아오는 길에 {name이} 중얼거렸다. "높은 사람을 알면 이렇게 되는구나." 칭찬인지 아닌지 모를 말투였다.` },
    ],
  },
  {
    id: 'b12_laundry_card', title: '빨랫감 속의 검은 카드', age: [14, 17], weight: 3.2, npc: 'cube',
    conditions: ['flag.shadow_path', '!flag.b12_guardian_knows', '!flag.b12_told_guardian'],
    text: `빨래를 하는데 {name}의 외투 주머니에서 무언가 툭 떨어졌다. 은빛 초승달이 찍힌 검은 카드, 그리고 용돈으로는 설명되지 않는 금화 몇 닢. 큐브가 빨래 바구니 위에서 날개를 접었다. "주인님…… 그거, 밤 시장 그림자 길드 표식이에요."`,
    choices: [
      { label: '식탁 위에 올려 두고 기다린다', effects: { trust: +3, 'stat.moral': +3, 'pers.agree': +1, 'flag.b12_guardian_knows': true },
        result: (s) => s.flags.respected_privacy
          ? `식탁 위 카드를 본 {name이} 문간에서 얼어붙었다가 천천히 앉았다. "……그때처럼, 내가 먼저 말할 때까지 기다려 준 거지?" 수프가 다 식을 때까지 아이는 밤 시장과 로웬과 심부름 이야기를 했다.`
          : `식탁 위 카드를 본 {name이} 문간에서 얼어붙었다. 당신은 수프를 떠 주기만 했다. 반쯤 먹었을 때 아이가 입을 열었다. 밤 시장, 로웬, 자정의 심부름. 이야기는 초 한 자루가 다 탈 때까지 이어졌다.` },
      { label: '카드를 난롯불에 던진다', effects: { trust: -8, stress: +8, 'pers.agree': -3, infamy: -2, 'flag.b12_guardian_knows': true },
        result: `카드는 금세 오그라들었다. 빈 주머니를 뒤지던 {name이} 난로를 보고 모든 걸 알았다. "그거 내 거였어." 문이 닫혔다. 사흘 뒤, 아이 베개 밑에서 새 카드가 나왔다.` },
      { label: '모른 척 주머니에 되돌려 둔다', effects: { gHealth: -5, 'pers.agree': -1, 'flag.b12_guardian_silent': true },
        result: `카드를 제자리에 넣고 외투를 털어 널었다. 그날 밤 당신은 잠들지 못했다. 자정 무렵 창문 걸쇠가 조용히 풀리는 소리를 들었고, 새벽에 다시 잠기는 소리도 들었다.` },
      { label: '밤에 몰래 뒤를 밟는다', effects: { gHealth: -4, 'flag.b12_guardian_knows': true }, next: 'b12_follow_night',
        result: `자정 무렵 창문 걸쇠가 풀리는 소리가 났다. 당신은 모자를 눌러쓰고 신발 끈을 맸다. 은발은 어둠 속에서도 잘 보였다.` },
    ],
  },
  {
    id: 'b12_follow_night', title: '골목 끝의 등불', chainOnly: true, age: [14, 17], image: 'bg/night_market',
    text: `자정의 밤 시장. 등불 아래 참새단 꼬마들 한가운데에 {name이} 있었다. 은 귀걸이 청년이 동전을 튕기면 허공에서 낚아채고, 꼬마들이 환호한다. 집에서는 본 적 없는, 날이 선 듯 살아 있는 얼굴. 청년이 고개도 돌리지 않고 말했다. "손님이 따라왔네."`,
    choices: [
      { label: '걸어 나가 아이 손을 잡는다', effects: { trust: -6, stress: +8, infamy: -2, 'stat.moral': +2, 'pers.agree': -2 },
        result: `등불 아래로 나서자 {name}의 얼굴에서 핏기가 가셨다. 로웬은 모자를 살짝 들어 인사했다. "따님 손이 좋아요." 집까지 오는 동안 아이는 한마디도 하지 않았다. 손을 빼지도 않았다.` },
      { label: '먼저 돌아와 기다린다', effects: { trust: +4, gHealth: -4, 'stat.sens': +3, 'pers.extro': +1 },
        result: `새벽, 창문으로 들어온 {name이} 의자에 앉은 당신을 보고 멈춰 섰다. 당신 신발이 아직 젖어 있었다. "……봤어?" "봤어." 아이는 창틀에 걸터앉아 동이 틀 때까지 이야기를 했다.` },
      { label: '다음 날 로웬을 따로 만난다', effects: { gHealth: -3, infamy: -2, 'flag.b12_rowen_talk': true },
        result: `당신은 혼자 로웬을 찾아갔다. 그는 카드를 굴리며 한참 듣다가 말했다. "나도 열넷에 시작했어. 누가 저렇게 뒤를 밟아 줬으면 좋았을 텐데." 그 뒤로 로웬은 {name}에게 자정 넘은 심부름을 주지 않았다.` },
      { label: '청년보다 먼저 아이 뒤에 선다', conditions: ["guardian == 'adventurer'"], effects: { trust: +3, 'stat.agi': +3, 'flag.b12_rowen_talk': true },
        result: `당신은 처마 그림자를 타고 돌아 들어갔다. 로웬이 뒤를 돌아봤을 땐 그의 카드가 이미 당신 손에 있었다. "……은퇴한 사람 손이 아닌데." {name이} 입을 벌렸다. "{call}, 방금 그거 어떻게 했어?"` },
    ],
  },

  // ══ 수로 밑의 길드 (15~17) ═════════════════════════════════════════════
  {
    id: 'b12_guild_hall', title: '수로 밑의 촛불 서른 개', age: [15, 17], weight: 3, npc: 'shadow',
    conditions: ['flag.shadow_path', '!flag.b12_left_guild', '!flag.b12_guild_member', '!flag.b12_guild_fallen'],
    text: `로웬이 {name을} 옛 수로 밑으로 데려갔다. 촛불 서른 개, 낡은 지도, 회색 장갑을 낀 노인. "규칙은 셋. 가난한 집은 털지 않는다. 피는 보지 않는다. 길드는 팔지 않는다." 노인이 탁자 위 세 물건을 차례로 짚었다. 자물쇠, 가면, 등불.`,
    choices: [
      { label: '자물쇠를 고른다', effects: { 'stat.agi': +10, infamy: +5, 'pers.good': -2, 'flag.b12_guild_member': true, 'flag.b12_guild_locks': true },
        result: `{name은} 그날 밤 자물쇠 다섯 개를 열었다. 노인은 말없이 여섯 번째를 내밀었다. 집에 온 아이 손톱 밑에 녹이 끼어 있었다. 물었더니 "대장간 놀이"라고 했다.` },
      { label: '가면을 고른다', effects: { 'stat.elo': +10, 'stat.chm': +3, infamy: +5, 'pers.good': -2, 'flag.b12_guild_member': true, 'flag.b12_guild_tongue': true },
        result: `가면은 얼굴이 아니라 목소리에 쓰는 거라고 했다. {name은} 하룻밤 새 말투 세 가지를 익혔다. 아침 식탁에서 아이가 "고마워" 하고 웃었는데, 당신은 그게 몇 번째 말투인지 잠깐 헷갈렸다.` },
      { label: '등불을 고른다', effects: { 'stat.int': +6, 'stat.agi': +4, infamy: +3, 'pers.good': -1, 'flag.b12_guild_member': true, 'flag.b12_bureau_eye': true },
        result: `등불은 보는 일이다. 누가 어느 집에 몇 시에 드나드는지. {name은} 항구 상인 열두 명의 하루를 외워 왔다. 노인이 처음으로 고개를 끄덕였다. 수로 입구의 군밤 장수 할머니도 아무도 모르게 고개를 끄덕였다.` },
      { label: '촛불 앞에서 돌아선다', effects: { 'pers.good': +3, 'stat.moral': +4, stress: +5, 'flag.b12_left_guild': true }, next: 'b12_amends',
        result: `{name은} 세 물건을 오래 보다가 고개를 저었다. 노인은 화내지 않았다. "그림자는 붙잡지 않는다. 대신 다시 받아 주지도 않지." 로웬이 수로 입구까지 배웅했다. 아이는 한 번도 뒤돌아보지 않았다.` },
    ],
  },
  {
    id: 'b12_false_pedigree', title: '삼백 년짜리 족보', age: [15, 17], weight: 3, image: 'bg/guild_hall',
    conditions: ['flag.b12_guild_tongue', '!flag.b12_left_guild', '!flag.b12_guild_fallen'],
    text: `포목상 바르톨은 하인 품삯을 석 달째 미루면서 귀족 족보 살 돈은 아끼지 않는다. 길드는 {name}에게 몰락한 귀족 가문의 막내딸 역을 맡겼다. 낡은 족보 한 권, 연기 한 번에 500G. 상인 회관 뒷방, 바르톨이 땀을 닦으며 물었다. "아가씨, 이 문장이 정말 삼백 년 됐소?"`,
    choices: [
      { label: '귀족 아가씨를 연기한다', check: { stat: 'elo', dc: 330, bonus: (s) => s.stats.eti * 0.3 },
        success: { effects: { gold: +250, infamy: +10, 'stat.elo': +8, 'pers.good': -3 },
          result: `{name}의 인사는 마담 로렌이 봤어도 흠잡지 못했을 것이다. 바르톨은 족보를 품에 안고 울먹였다. 길드 몫을 떼고도 250G. 그날 밤 아이가 금화를 세다 말고 물었다. "그 하인들 품삯, 이제 받았을까?"` },
        fail: { effects: { infamy: +8, reputation: -6, stress: +10, 'stat.elo': +3 },
          result: `"이 문장, 작년에 우리 가게에서 판 손수건 무늬인데요?" 차를 내오던 하녀가 중얼거렸다. {name은} 창문으로 빠져나왔다. 이튿날부터 포목점 앞에 '은발 사기꾼 주의' 벽보가 붙었다.` } },
      { label: '몫을 하인들 품삯으로 돌린다', effects: { infamy: +6, 'stat.elo': +4, 'stat.moral': +3, 'pers.good': +1, 'flag.b12_guild_grudge': true },
        result: `연기를 마친 {name은} 금화 주머니를 통째로 하인 숙소 창틀에 올려 두었다. 석 달 치 품삯과 꼭 같은 액수였다. 길드 노인은 몫이 모자란다며 장갑을 벗었다 꼈다. "참새 흉내는 비싸다, 꼬마."` },
      { label: '하녀에게 몰래 쪽지를 건넨다', effects: { 'stat.moral': +5, 'pers.good': +3, stress: +8, 'flag.b12_guild_grudge': true, 'flag.b12_bureau_eye': true },
        result: `{name은} 연기 대신 차를 내오는 하녀 손에 쪽지를 쥐여 줬다. '족보는 가짜. 품삯부터 받으세요.' 일은 틀어졌고 길드는 누가 샜는지 찾기 시작했다. 그날따라 군밤 장수 할머니가 군밤을 두 봉지 줬다.` },
      { label: '족보 대신 예절을 판다', conditions: ['stat.eti >= 200'], effects: { gold: +80, 'stat.eti': +5, 'stat.elo': +3, 'pers.good': +1, 'flag.b12_guild_grudge': true },
        result: `"족보보다 인사법이 먼저예요." {name은} 연기 대신 열흘 동안 바르톨에게 귀족식 예절을 가르쳤다. 수업료 80G, 거짓말은 한 마디도 없었다. 길드 노인이 장부를 덮었다. "우리가 언제부터 가정교사 협회였나."` },
    ],
  },
  {
    id: 'b12_fifth_lock', title: '다섯 번째 자물쇠', age: [15, 17], weight: 3, npc: 'shadow',
    conditions: ['flag.b12_guild_locks', '!flag.b12_left_guild', '!flag.b12_guild_fallen'],
    text: `고리대금업자 모르도의 서재. 길드가 원하는 건 금고가 아니라 장부다. "모르도의 장부를 쥐면 항구를 쥔다." 네 번째 자물쇠가 풀리자 장부가 나왔다. 장마다 낯익은 이름. 생선 장수, 짐꾼, 빵집 막내. 빚 30G에 이자 270G. 남은 다섯 번째 자물쇠는 이 장부를 누구 손에 넘기느냐였다.`,
    choices: [
      { label: '장부를 길드에 넘긴다', effects: { gold: +200, infamy: +10, 'stat.agi': +6, 'pers.good': -4 },
        result: `노인은 장부를 받아 들고 처음으로 장갑을 벗었다. 200G. 다음 달부터 모르도는 이자를 반으로 내렸다. 대신 항구 사람들은 이제 길드에 이자를 낸다. 그걸 안 날 밤, {name은} 늦도록 자물쇠만 만지작거렸다.` },
      { label: '장부를 수로에 던진다', effects: { infamy: +8, reputation: +3, 'stat.moral': +4, 'pers.good': +2, 'flag.b12_guild_grudge': true },
        result: `장부는 검은 물 위에 잠깐 떠 있다가 가라앉았다. 이튿날 선술집마다 모르도의 장부 이야기로 떠들썩했고, 누군가는 노래까지 지었다. 길드 노인만 웃지 않았다. "시킨 일만 하는 게 길드다, 꼬마."` },
      { label: '자물쇠를 다시 잠그고 나온다', effects: { 'stat.agi': +4, 'pers.good': +1, stress: +8, 'flag.b12_guild_grudge': true },
        result: `{name은} 자물쇠 넷을 하나하나 도로 잠갔다. 들어올 때보다 오래 걸렸다. 빈손으로 돌아온 아이에게 로웬이 낮게 말했다. "실패라고 보고할게. 다음엔 나도 못 덮어 줘."` },
      { label: '장부를 셋째 달에 넘긴다', conditions: ['flag.b12_spy_contact'], effects: { 'flag.spy_recruited': true, 'stat.int': +6, infamy: +3, stress: +6, 'flag.b12_guild_grudge': true },
        result: `장부는 군밤 봉지에 담겨 노나 할멈 손으로 넘어갔다. 한 달 뒤 모르도는 왕실 감찰에 걸려 문을 닫았다. 할멈이 {name}의 옷깃 은 단추 옆에 반달을 하나 더 달았다. "이제 정식이다, 얘야."` },
    ],
  },
  {
    id: 'b12_rooftop', title: '지붕 위의 은빛 그림자', age: [15, 17], weight: 2.6, image: 'bg/night_market',
    conditions: ['flag.shadow_path', 'stat.agi >= 150', '!flag.b12_left_guild', '!flag.b12_guild_fallen'],
    text: `경비대 호루라기가 항구의 밤을 찢었다. 길드 일이 틀어졌고, {name은} 지붕 위에 있었다. 기와 열두 장 너머가 수로, 그 사이에 어른 키 두 배 되는 틈. 뒤쪽 사다리로 경비병이 올라온다. 아래 골목에서 누가 외쳤다. "은빛 그림자다!"`,
    choices: [
      { label: '틈을 뛰어넘는다', check: { stat: 'agi', dc: 300 }, minigame: 'adventure',
        success: { effects: { 'stat.agi': +10, infamy: +6, 'pers.ambit': +2, 'pers.good': -1 },
          result: `{name은} 달을 등지고 날았다. 미끄러진 기와 한 장이 수로에 떨어졌을 뿐이다. 이튿날 항구 선술집에 새 노래가 생겼다. 「은빛 그림자」. 아이는 그 노래가 나오면 자리를 떴다.` },
        fail: { effects: { 'stat.hp': -6, 'stat.agi': +3, infamy: +5, stress: +12, 'pers.extro': -2 },
          result: `발끝이 기와 끝을 놓쳤다. 차양에 걸려 떨어진 {name은} 발목을 붙들고 생선 상자 뒤에 숨었다. 새벽에야 절뚝이며 돌아와 "넘어졌어"라고 했다. 당신은 붕대를 감으며 아무것도 묻지 않았다.` } },
      { label: '빨랫줄을 타고 인파에 섞인다', check: { stat: 'elo', dc: 230 },
        success: { effects: { 'stat.elo': +6, 'stat.agi': +3, infamy: +3, 'flag.b12_bureau_eye': true },
          result: `{name은} 빨랫줄을 타고 내려가 밤 시장 인파 속으로 걸어 들어갔다. 군밤을 까먹으며 경비병 셋을 스쳐 지나갔다. 봉지를 건네던 할멈이 속삭였다. "침착하구나, 얘야."` },
        fail: { effects: { infamy: +6, reputation: -4, stress: +10, 'stat.elo': +2, 'pers.extro': -1 }, next: 'b12_watch_post',
          result: `인파 속에서도 은발은 너무 눈에 띄었다. 경비병의 손이 어깨를 잡았다. "이 머리색은 놓칠 수가 없지."` } },
      { label: '돌아서서 두 손을 든다', effects: { infamy: +3, reputation: -4, 'stat.moral': +4, 'pers.good': +2, trust: +4, 'flag.b12_guardian_knows': true },
        result: `{name은} 기와 위에 무릎을 꿇고 두 손을 들었다. 경비병이 오히려 당황했다. "애잖아." 그날 새벽 초소에서 아이를 데려오는 길에, {name이} 처음으로 길드 이야기를 전부 했다.` },
      { label: '망토를 뒤집어 굴뚝 그림자에 숨는다', conditions: ['item.travel_cloak >= 1'], effects: { 'stat.agi': +5, 'stat.int': +3, infamy: +2, 'pers.ambit': +1 },
        result: `여행용 망토를 뒤집어쓰자 잿빛 안감이 굴뚝 그을음과 똑같았다. 경비병의 등불이 세 번 스치고 지나갔다. 새벽에 돌아온 {name이} 망토를 털며 중얼거렸다. "{call이} 사 준 거, 오늘 제값 했어."` },
    ],
  },
  {
    id: 'b12_name_envelope', title: '이름 하나, 주소 하나', age: [16, 17], weight: 2.8, npc: 'shadow',
    conditions: ['flag.shadow_path', 'flag.b12_guild_member', 'infamy >= 18', '!flag.b12_left_guild', '!flag.b12_guild_fallen'],
    text: `회색 장갑의 노인이 봉투를 밀었다. 이름 하나, 주소 하나. "이 증인이 다음 달 재판에 서면 길드 사람 넷이 광산에 간다. 피는 보지 않는다, 규칙이지. 대신 이 도시를 떠나고 싶게 만들어라." 촛불이 흔들렸다. {name}의 손끝이 봉투 모서리에서 멈췄다.`,
    choices: [
      { label: '단검 한 자루를 머리맡에 두고 온다', effects: { infamy: +12, 'stat.agi': +8, 'pers.good': -6, stress: +12 },
        result: `증인은 다음 날 아침 짐을 쌌다. 아무도 다치지 않았다. 그날부터 {name은} 잠을 설쳤다. 창문 걸쇠를 세 번씩 확인했다. 누군가 똑같은 일을 자기한테 할 수 있다는 걸, 이제는 아니까.` },
      { label: '증인에게 먼저 귀띔한다', effects: { 'stat.moral': +5, 'pers.good': +3, stress: +8, 'flag.b12_guild_grudge': true },
        result: `{name은} 증인의 문틈에 쪽지를 넣었다. '재판 날까지 성당에 머무세요.' 증인은 재판에 섰고, 길드 사람 넷이 광산으로 갔다. 그날 밤 수로의 촛불은 하나도 켜지지 않았다. 다들 누가 샜는지 아는 눈치였다.` },
      { label: '봉투를 돌려준다', effects: { 'pers.good': +2, infamy: -2, stress: +6, 'flag.b12_guild_grudge': true },
        result: `"이건 못 해요." 노인은 봉투를 촛불에 태웠다. "그럼 다른 손이 하겠지." {name은} 그 말이 무서워 그날 밤 증인의 집 앞을 새벽까지 서성였다. 아무 일도 없었다. 아직은.` },
      { label: '셋째 달에 봉투를 보인다', conditions: ['flag.b12_spy_contact'], effects: { 'flag.spy_recruited': true, 'stat.int': +5, infamy: -4, stress: +8 },
        result: `봉투는 군밤 봉지에 담겨 등대로 갔다. 재판 날 증인 곁엔 낯선 호위 둘이 서 있었다. 할멈이 {name}의 옷깃에 반달을 하나 더 달았다. "길드 안에 눈이 있다는 건, 이럴 때 쓰라고 있는 거다."` },
    ],
  },
  {
    id: 'b12_torn_card', title: '반으로 찢긴 초승달', age: [15, 17], weight: 3.2, npc: 'cube',
    conditions: ['flag.b12_guild_grudge', '!flag.b12_guild_fallen'],
    text: `아침에 문을 여니 문틈에 검은 카드가 꽂혀 있었다. 은빛 초승달이 정확히 반으로 찢겨 있다. 마당 장작더미는 무너져 있고, 큐브가 창가에서 떨었다. "주인님, 밤새 누가 지붕 위를 걸어 다녔어요." 카드를 본 {name}의 얼굴이 하얗게 질렸다.`,
    choices: [
      { label: '가렛에게 도움을 청한다', conditions: ['rel.garrett >= 30'], effects: { 'rel.garrett': +6, trust: +4, stress: -6, gold: -40 },
        result: `가렛은 이야기를 다 듣기도 전에 칼을 챙겼다. 그날 밤 수로 입구에 용병 열 명이 횃불을 들고 섰다. "그 집 지붕에 한 번만 더 올라가 봐라." 그 뒤로 지붕은 조용했다. 용병들 술값은 당신이 냈다.` },
      { label: '{name이} 직접 수로로 내려간다', check: { stat: 'elo', dc: 250 },
        success: { effects: { 'stat.elo': +8, 'pers.ambit': +2, trust: +2, stress: -4 },
          result: `{name은} 혼자 촛불 서른 개 앞에 섰다. "저는 누굴 판 적 없어요. 마음을 바꿨을 뿐이에요." 회색 장갑의 노인이 오래 웃었다. "말재주는 쓸 만하군." 그 뒤로 문틈은 비어 있었다.` },
        fail: { effects: { stress: +12, 'stat.elo': +2, 'pers.extro': -3 },
          result: `노인은 끝까지 듣지도 않았다. "규칙은 우리가 읽는다." 돌아오는 길에 {name은} 세 번이나 뒤를 돌아봤다. 그 뒤 한 달 동안 아이는 해만 지면 창문을 닫고 커튼까지 쳤다.` } },
      { label: '경비대에 신고한다', effects: { reputation: +2, 'stat.moral': +3, infamy: -2, stress: +8, 'pers.extro': -2 },
        result: `경비대는 장부에 적고 고개를 끄덕였다. 그게 다였다. 사흘 뒤 같은 카드가 또 꽂혔다. 이번엔 네 조각으로. 그날 밤부터 {name은} 당신 방 앞에서 잤다. "{call} 지키는 거야." 농담 같지 않았다.` },
      { label: '셋째 달에 알린다', conditions: ['flag.b12_spy_contact'], effects: { 'stat.int': +4, stress: -6, 'pers.ambit': +1 },
        result: `군밤 봉지에 쪽지 한 장을 넣어 보냈다. 이튿날 아침, 집 앞 길모퉁이에 처음 보는 군밤 장수가 좌판을 폈다. 그 뒤로 지붕은 조용했다. 할멈의 답장은 한 줄이었다. '우리 쪽 사람은 우리가 지킨다.'` },
    ],
  },

  // ══ 셋째 달 — 왕실 첩보부 (15~17) ══════════════════════════════════════
  {
    id: 'b12_moon_recruit', title: '봉지 안쪽의 반달', age: [15, 17], weight: 3.4, image: 'bg/harbor',
    conditions: ['flag.b12_bureau_eye', '!flag.b12_spy_contact', '!flag.b12_spy_refused'],
    text: `군밤 봉지 안쪽, 반달 아래 작은 글씨. '내일 해 질 녘, 등대 아래.' 등대 아래에서 노나 할멈은 군밤 대신 은 단추 하나를 내밀었다. "왕실 첩보부. 우리끼린 셋째 달이라 부른다. 늘 반쯤 가려져 있는 달이지. 네 눈이 필요하다, 얘야."`,
    choices: [
      { label: '은 단추를 받는다', effects: { 'flag.b12_spy_contact': true, 'stat.int': +5, 'pers.ambit': +2, stress: +5 }, next: 'b12_masque',
        result: `"보는 것, 기억하는 것, 말하지 않는 것. 셋이면 된다." {name은} 단추를 안쪽 옷깃에 달았다. 그날 저녁 아이는 당신 얼굴을 유난히 오래 봤다. 말하지 않는 것, 그게 제일 어려웠다. 첫 시험은 그달 말에 왔다.` },
      { label: '{call}에게 먼저 묻겠다고 한다', effects: { trust: +5, 'pers.agree': +2 }, next: 'b12_moon_table',
        result: `할멈이 눈을 가늘게 떴다가 웃었다. "첩보원 후보가 집에 허락을 받으러 간다라. 처음 보는 일이다만, 나쁘진 않구나."` },
      { label: '거절한다', effects: { 'stat.moral': +2, 'pers.ambit': -2, stress: -4, 'flag.b12_spy_refused': true },
        result: `"저는 그냥 군밤이 좋아요." 할멈은 단추를 거두며 군밤 한 봉지를 더 얹어 줬다. "그것도 현명한 대답이지." 그 뒤로도 군밤 맛은 똑같았다.` },
      { label: '길드와 겹쳐도 되냐고 묻는다', conditions: ['flag.b12_guild_member', '!flag.b12_left_guild'], effects: { 'flag.b12_spy_contact': true, 'stat.elo': +4, infamy: -3, stress: +8 },
        result: `"길드에 있는 걸 알고 부른 거다." 할멈이 숯불을 뒤적였다. "거기 남아라. 다만 이제 네가 보는 건 우리도 본다." {name은} 그림자 속에 그림자 하나를 더 들였다.` },
    ],
  },
  {
    id: 'b12_moon_table', title: '식탁 위의 은 단추', chainOnly: true, age: [15, 17],
    text: `{name이} 식탁 위에 은 단추를 내려놓았다. 반달 문양이 촛불에 반짝였다. "왕실 첩보부래. 군밤 할머니가. {call}, 나 해도 돼?" 목소리는 담담했지만, 단추를 내려놓은 손가락은 좀처럼 단추에서 떨어지지 않았다.`,
    choices: [
      { label: '"네가 정해."', effects: { trust: +6, 'pers.ambit': +2, 'flag.b12_spy_contact': true }, next: 'b12_masque',
        result: `{name은} 단추를 손바닥에 올려 한참 봤다. "할래. 대신 {call}한테 거짓말은 안 할게. 말 못 하는 건 말 못 한다고 할게." 그게 둘의 새 규칙이 됐다. 첫 시험은 그달 말이었다.` },
      { label: '"위험한 일이야. 안 돼."', effects: { trust: -5, 'pers.agree': -2, stress: +6, 'flag.b12_spy_refused': true },
        result: `{name은} 단추를 도로 집어 들었다. "알았어." 너무 쉽게 대답해서 오히려 마음이 쓰였다. 다음 날 아이가 등대에 단추를 돌려주러 갔는지, 당신은 끝내 묻지 못했다.` },
      { label: '"밤에는 꼭 집에 와."', effects: { trust: +3, gHealth: -3, 'pers.agree': +1, 'flag.b12_spy_contact': true }, next: 'b12_masque',
        result: `"첩보원한테 통금이 있어?" "있어." {name이} 웃음을 터뜨렸다. 이튿날 할멈의 전갈이 왔다. '보호자 조건 수락.' 하필 첫 시험은 자정까지 열리는 무도회였다.` },
      { label: '"그 반달, 나도 본 적 있어."', conditions: ["guardian == 'knight'"], effects: { trust: +5, 'stat.int': +3, 'flag.b12_spy_contact': true }, next: 'b12_masque',
        result: `근위대 시절, 반달 단추를 단 사람들이 이름 없이 왔다가 이름 없이 갔다. "하나만 기억해. 그 사람들은 너를 지켜 주지 않아. 네가 너를 지켜." {name이} 진지하게 고개를 끄덕였다.` },
    ],
  },
  {
    id: 'b12_two_reports', title: '반 장짜리 보고서', age: [15, 17], weight: 3.6, npc: 'shadow',
    conditions: ['flag.b12_spy_contact', 'flag.b12_guild_member', '!flag.b12_left_guild', '!flag.b12_guild_fallen', '!flag.spy_recruited'],
    text: `셋째 달이 원하는 건 이름 하나. 길드의 통행증을 위조하는 손. {name은} 그게 누군지 안다. 로웬이다. 그날 밤 수로 끝에서 로웬이 군고구마를 반 갈라 내밀었다. "요즘 얼굴이 왜 그래. 누가 괴롭혀?"`,
    choices: [
      { label: '로웬의 이름을 적어 낸다', effects: { 'flag.spy_recruited': true, 'stat.int': +6, stress: +12, 'pers.good': -1, 'flag.b12_rowen_gone': true },
        result: `이름 하나, 장소 하나. 사흘 뒤 수로 입구에 경비대가 몰려왔다. 로웬은 끌려가면서도 {name} 쪽을 보지 않았다. 할멈이 은 단추 옆에 반달을 하나 더 달아 줬다. 정식 요원의 표시였다.` },
      { label: '로웬에게 떠나라고 귀띔한다', effects: { 'stat.sens': +5, 'pers.roman': +2, stress: +8, 'flag.b12_rowen_gone': true },
        result: `"오늘 밤 항구를 떠나." 로웬은 군고구마를 씹다 멈췄다. 아무것도 묻지 않았다. 새벽, 수로 끝은 비어 있었다. 할멈이 빈 보고서를 받아 들었다. "말하지 않는 것. 그걸 누구 편에 쓴 거냐."` },
      { label: '위조를 시킨 사람을 캐낸다', check: { stat: 'int', dc: 320 },
        success: { effects: { 'flag.spy_recruited': true, 'flag.b12_guild_fallen': true, 'stat.int': +6, infamy: -4 },
          result: `{name은} 위조범 대신 위조를 시킨 사람을 적었다. 회색 장갑의 노인, 증거는 장부 세 권. 할멈이 웃었다. "더 큰 물고기로구나." 길드는 흩어졌고, 로웬은 아무것도 모른 채 군고구마를 하나 더 구웠다.` },
        fail: { effects: { stress: +10, 'stat.int': +2, 'pers.ambit': -2 },
          result: `증거는 끝내 모이지 않았다. 할멈은 보고서를 끝까지 읽지도 않았다. "우리가 원한 이름이 아니구나. 숙제를 바꿔 내는 아이는 오래 기다려 주지 않는다." 옷깃의 은 단추가 조금 무거워졌다.` } },
      { label: '로웬에게 셋째 달로 오라고 한다', conditions: ['flag.b12_rowen_talk'], effects: { 'flag.spy_recruited': true, 'stat.elo': +5, 'pers.good': +3, stress: +4 },
        result: `로웬은 한참 군고구마만 내려다봤다. "그 집 사람이 나 보러 왔던 날부터 생각은 했어." 이튿날 등대 아래에 은 귀걸이가 하나 더 섰다. 할멈이 {name}의 옷깃에 반달을 하나 더 달아 줬다.` },
    ],
  },
  {
    id: 'b12_masque', title: '가면 무도회의 백 번째 손님', age: [15, 17], weight: 3.5, repeatable: true, image: 'bg/ballroom',
    conditions: ['flag.b12_spy_contact', '!flag.spy_recruited', '!flag.b12_spy_refused', 'seen.b12_masque < 2'],
    text: `셋째 달의 시험. 왕도 가면 무도회의 손님 백 명 가운데 하나가 이웃 나라 밀정이다. 근위대장이 {name}에게 가면을 건넸다. "자정 종이 치기 전에 찾아라. 소란은 금지." {name은} 눈에 띄는 은발을 검은 망사 두건 속에 감췄다. 샹들리에 아래 가면들이 일제히 돌아섰다.`,
    choices: [
      { label: '춤추며 손님들 발을 본다', check: { stat: 'agi', dc: 260, bonus: (s) => s.stats.eti * 0.3 }, minigame: 'ball',
        success: { effects: { 'flag.spy_recruited': true, 'stat.agi': +6, 'stat.eti': +5, reputation: +3 },
          result: `세 번째 왈츠, 파트너가 박자를 반 박씩 늦게 밟았다. 이 나라 춤을 책으로만 배운 발이었다. 자정 종이 울리기 전, 근위대장이 그 손님의 팔을 조용히 잡았다. "합격이다, 반달."` },
        fail: { effects: { stress: +10, 'stat.agi': +3, 'pers.ambit': -2 },
          result: `춤은 아름다웠지만 눈은 놓쳤다. 자정 종과 함께 손님 하나가 발코니로 사라졌다. 근위대장이 가면을 벗었다. "다음 기회는 내가 정한다." {name은} 돌아오는 마차에서 가면을 꼭 쥐고 있었다.` } },
      { label: '마차 문장과 명단을 맞춘다', check: { stat: 'int', dc: 240 },
        success: { effects: { 'flag.spy_recruited': true, 'stat.int': +8, reputation: +2, 'pers.extro': -1 },
          result: `{name은} 마부 대기실에서 손님 명단과 마차 문장을 맞춰 봤다. 문장 없는 마차 하나, 명단엔 공작의 조카. 공작에겐 조카가 없다. 근위대장이 짧게 웃었다. "춤 한 번 안 추고 찾았군."` },
        fail: { effects: { stress: +10, 'stat.int': +3, 'pers.ambit': -2 },
          result: `명단은 너무 길고 밤은 너무 짧았다. 자정 종이 울릴 때 {name은} 아직 마흔 번째 이름을 읽고 있었다. 근위대장이 명단을 거둬 갔다. "눈은 좋은데 손이 느려."` } },
      { label: '가면을 돌려주고 집에 간다', effects: { trust: +5, stress: -6, 'pers.ambit': -2, 'flag.b12_spy_refused': true },
        result: `{name은} 가면을 근위대장에게 돌려주었다. "남의 얼굴을 매일 의심하면서 살고 싶진 않아요." 대장은 고개를 끄덕였다. 집에 온 아이는 당신 얼굴을 오래, 아무 의심 없이 봤다.` },
      { label: '{call}의 근위대 요령을 쓴다', conditions: ["guardian == 'knight'"], check: { stat: 'int', dc: 220, bonus: (s) => s.stats.agi * 0.2 },
        success: { effects: { 'flag.spy_recruited': true, 'stat.int': +5, trust: +4 },
          result: `"경비가 제일 많은 문 말고, 제일 적은 문을 봐." 출발 전 당신이 해 준 말이었다. 경비 없는 하인 통로로 손님 하나가 자꾸 드나들었다. 근위대장이 웃었다. "누구한테 배웠는지 알겠군."` },
        fail: { effects: { stress: +8, 'stat.int': +2, trust: +2, 'pers.agree': -1 },
          result: `하인 통로를 지켰지만 밀정은 정문으로 당당히 나갔다. 근위대장이 어깨를 으쓱했다. "요령도 상대를 가린다." 집에 온 {name이} 투덜댔다. "{call} 말대로 했는데!" 당신은 웃음을 참았다.` } },
    ],
  },

  // ══ 돌아오는 길 (15~17) ════════════════════════════════════════════════
  {
    id: 'b12_way_back', title: '새벽 부엌의 검은 카드', age: [15, 17], weight: 3,
    conditions: ['flag.shadow_path', 'infamy >= 12', 'pers.good >= -50', '!flag.b12_left_guild', '!flag.b12_guild_fallen'],
    text: `새벽, {name이} 부엌 의자에 웅크려 있었다. 손에는 검은 카드. "{call}, 나 그만하고 싶어." 목소리가 갈라졌다. "근데 길드는 그냥 안 놔줘. 빚이 있대. 300G. 아니면 마지막 일 하나."`,
    choices: [
      { label: '빚을 대신 갚는다 (-300G)', conditions: ['gold >= 300'], effects: { gold: -300, trust: +8, infamy: -5, 'flag.b12_left_guild': true }, next: 'b12_amends',
        result: `당신은 금화 주머니를 들고 직접 수로로 내려갔다. 회색 장갑의 노인이 무게를 달아 보더니 카드 한 장을 찢었다. "보호자가 오는 건 처음이군." 돌아오는 길, {name이} 당신 소매를 놓지 않았다.` },
      { label: '마지막 일을 하고 나온다', effects: { infamy: +6, gold: +50, stress: +10, 'pers.good': -2, 'flag.b12_left_guild': true }, next: 'b12_amends',
        result: `마지막 일은 쉬웠다. 쉬워서 더 싫었다. {name은} 받은 50G를 식탁에 올려 두고 한동안 손대지 않았다. "끝났어." 아이는 그 말을 세 번 했다. 자기한테 하는 말처럼.` },
      { label: '로웬에게 부탁해 본다', conditions: ['flag.b12_rowen_talk', '!flag.b12_rowen_gone'], effects: { trust: +4, 'stat.sens': +4, 'flag.b12_left_guild': true }, next: 'b12_amends',
        result: `로웬은 카드를 받아 들고 한참 웃었다. "네 {call이} 날 찾아왔을 때부터 알았어. 넌 오래 못 있을 거라고." 그는 빚 장부의 한 줄을 자기 이름 밑으로 옮겨 적었다. "대신 가끔 군밤이나 사 와."` },
      { label: '셋째 달에 길드를 넘긴다', conditions: ['flag.b12_spy_contact'], effects: { 'flag.spy_recruited': true, 'flag.b12_guild_fallen': true, 'flag.b12_left_guild': true, 'stat.int': +4, infamy: -8, stress: +12 }, next: 'b12_amends',
        result: `{name은} 빚 대신 지도를 그렸다. 수로 입구, 촛불 서른 개, 회색 장갑. 사흘 뒤 길드는 흩어졌고 빚 장부도 함께 불탔다. 반달 단추가 하나 늘었지만, 아이는 한동안 수로 쪽으로는 걷지 않았다.` },
    ],
  },
  {
    id: 'b12_amends', title: '돌려주는 계절', chainOnly: true, age: [15, 17], image: 'bg/market',
    text: `길드를 등진 첫 주. {name이} 낡은 수첩을 펼쳤다. 그림자 속에서 받은 돈과, 그 돈 뒤에 있던 얼굴들의 목록이다. 떠오르는 이름보다 떠오르지 않는 이름이 더 많았다. "다 돌려줄 순 없겠지. 그래도 뭐라도 하고 싶어."`,
    choices: [
      { label: '하나씩 찾아가 돌려준다', conditions: ['gold >= 100'], effects: { gold: -100, infamy: -8, 'stat.moral': +6, stress: +6, 'flag.shadow_path': false },
        result: `생선 장수는 동전을 받고 한참 말이 없었다. 빵집 주인은 문을 쾅 닫았다. 사흘째, 짐꾼 하나가 {name}의 손에 사과를 쥐여 줬다. "돌려주러 오는 녀석은 처음 봤다."` },
      { label: '시장 일을 거들며 갚는다', effects: { 'stat.hp': +5, 'stat.elo': +3, infamy: -5, stress: +8, 'flag.shadow_path': false },
        result: `한 달 동안 {name은} 새벽 어시장에서 품삯 없이 상자를 날랐다. 처음엔 다들 수군거렸다. 마지막 날, 생선 장수 아주머니가 자기 앞치마를 벗어 아이 목에 걸어 줬다. "내일부턴 품삯 받고 와."` },
      { label: '성당에서 고해한다', effects: { 'stat.faith': +6, 'pers.good': +3, infamy: -3, stress: -4, 'flag.shadow_path': false },
        result: (s) => s.guardian === 'priest'
          ? `"{call} 앞에서는 못 하겠어." {name은} 이웃 마을 성당까지 걸어가 고해했다. 돌아와서는 당신 앞에 앉았다. "거기 신부님도 {call이랑} 똑같은 말 하더라. 용서는 받는 게 아니라 갚아 나가는 거래."`
          : `고해소 창살 너머로 {name은} 한 시간을 말했다. 눈이 퉁퉁 부어 나왔다. "신부님이 그랬어. 용서는 받는 게 아니라 갚아 나가는 거래." 다음 날부터 아이는 성당 급식소에서 수프를 펐다.` },
      { label: '"사실 알고 있었어."', conditions: ['flag.b12_guardian_silent'], effects: { trust: +6, gHealth: +5, 'stat.sens': +4, 'flag.shadow_path': false },
        result: `"카드, 빨래하다 봤어." {name이} 고개를 번쩍 들었다. "왜 말 안 했어?" "돌아올 길을 막고 싶지 않았어. 근데 매일 밤 무서웠어." 아이가 당신 어깨에 이마를 댔다. 금빛 별빛 두어 개가 소리 없이 떠올랐다. "……나도."` },
    ],
  },

  // ══ 그림자 곁의 사람들 (14~17) ════════════════════════════════════════
  {
    id: 'b12_bori_winter', title: '참새단의 첫눈', age: [14, 17], season: 'winter', weight: 3, image: 'bg/snow_village',
    conditions: ['flag.b12_met_bori'],
    text: `첫눈 온 밤, 보리가 경비대에 붙잡혔다. 빵 한 덩이였다. 세 번째라 노역장으로 보낸단다. 참새단 꼬마들이 {name}의 집 앞에 쪼르르 서 있었다. 맨발인 아이도 있었다. "언니, 보리 언니 좀……."`,
    choices: [
      { label: '초소에 가서 보리 편을 든다', check: { stat: 'elo', dc: 160 },
        success: { effects: { 'stat.elo': +6, reputation: +3, 'pers.good': +2, gold: -10, 'flag.b12_bori_saved': true },
          result: `{name은} 초소장 앞에서 보리가 훔친 빵값과 보리가 굶은 날수를 나란히 읊었다. 초소장은 이마를 짚더니 보리를 풀어 줬다. "빵값은 네가 내라." 보리는 고맙단 말 대신 코를 훌쩍였다.` },
        fail: { effects: { stress: +10, 'stat.elo': +2, 'pers.agree': -2 },
          result: `초소장은 끝까지 듣고도 고개를 저었다. "규칙은 규칙이다." 보리는 노역장 마차에 실려 갔다. 떠나기 전 창살 사이로 손을 흔들었다. 빠진 앞니를 드러내고 웃으면서.` } },
      { label: '벌금을 대신 낸다 (-120G)', conditions: ['gold >= 120'], effects: { gold: -120, 'stat.moral': +4, trust: +3, 'flag.b12_bori_saved': true },
        result: `당신이 금화를 세는 동안 보리는 초소 구석에서 고개를 돌리고 있었다. 나오는 길에 중얼거렸다. "갚을게. 진짜로. 훔친 돈 말고." {name이} 보리의 맨발에 자기 털양말을 신겨 줬다.` },
      { label: '꼬마들만이라도 거둔다', effects: { gold: -40, 'stat.sens': +5, 'pers.good': +2, stress: +6, 'rel.cube': +3 },
        result: `꼬마 일곱이 난로 앞에서 수프를 먹었다. 큐브가 담요를 물어 날랐다. 보리는 끝내 노역장으로 갔다. 그 겨울 내내 {name은} 장이 서는 날마다 노역장 담 너머로 빵을 던졌다.` },
      { label: '보리를 아는 어른들을 모은다', conditions: ['flag.b12_bori_trust'], effects: { 'stat.elo': +4, reputation: +4, 'pers.good': +2, 'flag.b12_bori_saved': true },
        result: `생선 가게 주인, 성당 급식소 수녀님, 빵집 막내가 하나둘 초소로 왔다. "이 녀석, 요새는 비늘 한 장 안 훔쳤소." 보리가 풀려났다. 돌아오는 길에 보리가 {name}의 옆구리를 쿡 찔렀다. "은발 덕이야. 말은 안 할 거지만."` },
    ],
  },
  {
    id: 'b12_leon_ring', title: '변장한 소년의 반지', age: [14, 17], weight: 0.6, image: 'bg/night_market',
    conditions: ['flag.met_leon', 'rel.leon >= 20'],
    text: `밤 시장 인파 속에 낯익은 금발이 보였다. 허름한 망토로 변장한 리온이다. 그런데 그 뒤로 참새단 꼬마 셋이 바짝 따라붙는다. 노리는 건 리온 손가락의 묵직한 문장 반지. {name이} 군밤 봉지를 당신에게 떠넘겼다. "{call}, 잠깐만."`,
    choices: [
      { label: '꼬마들보다 먼저 반지를 빼낸다', check: { stat: 'agi', dc: 160 },
        success: { effects: { 'stat.agi': +6, 'rel.leon': +6, 'pers.extro': +1, 'flag.b12_bureau_eye': true },
          result: `{name은} 리온과 어깨를 부딪치는 척 반지를 빼 소매에 넣었다. 골목을 벗어나 반지를 내밀자 리온이 멍하니 봤다. "……방금 그거 어떻게 했어?" 군밤 장수 할머니가 그 장면을 끝까지 보고 있었다.` },
        fail: { effects: { 'rel.leon': -4, stress: +6, infamy: +3, 'stat.agi': +2 },
          result: `손끝이 반지에 걸렸다. 리온이 깜짝 놀라 {name}의 손목을 잡았다. "너…… 지금 뭐 한 거야?" 설명하는 사이 꼬마들은 흩어졌고 반지는 무사했다. 리온의 눈빛만 조금 달라졌다.` } },
      { label: '리온 곁으로 가서 말을 건다', effects: { 'rel.leon': +4, 'stat.elo': +3, 'pers.extro': +2 },
        result: `"이런 데서 뭐 해?" {name이} 리온 옆에 서서 꼬마들을 노려봤다. 꼬마들이 슬금슬금 물러났다. 리온은 끝까지 몰랐다. 밤 시장이 생각보다 안전한 곳이라며 웃었다.` },
      { label: '모른 척한다', effects: { 'rel.leon': -3, 'pers.good': -2, stress: +5 },
        result: `반지는 사라졌다. 사흘 뒤 왕실 근위대가 밤 시장을 뒤집었고, 참새단 꼬마 하나가 붙잡혔다는 말이 돌았다. 리온이 찾아왔을 때 {name은} 끝내 아무것도 봤다고 말하지 않았다.` },
      { label: '휘파람으로 꼬마들을 물린다', conditions: ['flag.b12_guild_member', '!flag.b12_left_guild'], effects: { 'rel.leon': +3, 'stat.elo': +4, infamy: +2, 'flag.b12_guild_grudge': true },
        result: `{name이} 손가락 두 개로 짧게 휘파람을 불었다. 길드 신호를 들은 꼬마들이 얼어붙었다가 흩어졌다. 리온은 아무것도 몰랐다. 수로의 노인은 알았다. "왕실 반지를 놓쳤다지? 누구 휘파람이었을까."` },
    ],
  },
  {
    id: 'b12_theodora_brooch', title: '테오도라의 거래', age: [15, 17], weight: 1.8, npc: 'theodora',
    conditions: ['rel.theodora >= 25', 'infamy >= 10'],
    text: `해 질 녘, 테오도라가 하녀도 없이 혼자 찾아왔다. "오빠가 도박판에서 어머니 브로치를 걸었다가 잃었어. 상대가 밤 시장 사람들이래. 너…… 그쪽에 아는 사람 있다며." 도도한 목소리가 끝에서 갈라졌다. "이건 부탁이 아니야. 거래야. 알았어?"`,
    choices: [
      { label: '브로치를 몰래 되찾아 온다', check: { stat: 'agi', dc: 220 },
        success: { effects: { 'stat.agi': +6, 'rel.theodora': +10, infamy: +4, 'pers.good': -1 },
          result: `이틀 뒤 {name이} 테오도라의 손바닥에 브로치를 올려놓았다. 어떻게 찾았는지는 말하지 않았고, 테오도라도 묻지 않았다. "……거래니까 고맙단 말은 안 해." 그러고는 {name}의 손을 한 번 꽉 잡았다.` },
        fail: { effects: { 'rel.theodora': +3, infamy: +5, stress: +10, 'stat.agi': +2 },
          result: `브로치 상자에 손을 대는 순간 방울이 울렸다. {name은} 빈손으로 창문을 넘었다. 이튿날 항구엔 귀족 심부름하는 은발 도둑 이야기가 돌았다. 테오도라는 말없이 그 소문을 지우러 다녔다.` } },
      { label: '도박판에서 다시 따 온다', conditions: ['gold >= 100'], check: { stat: 'int', dc: 210 },
        success: { effects: { 'rel.theodora': +8, 'stat.int': +6, infamy: +3, gold: +40 },
          result: `{name은} 같은 물주에게서 브로치를 도로 땄다. 덤으로 40G까지. 테오도라가 코웃음 쳤다. "도박꾼 친구라니, 최악이야." 입꼬리는 올라가 있었다.` },
        fail: { effects: { gold: -100, 'rel.theodora': +4, infamy: +2, stress: +8 },
          result: `100G가 브로치 뒤를 따라 물주 앞으로 넘어갔다. {name이} 빈 주머니를 뒤집어 보이며 웃었다. 테오도라는 웃지 않았다. "너까지 잃으면 어떡해, 바보야." 그날 테오도라는 처음으로 당신네 식탁에서 저녁을 먹고 갔다.` } },
      { label: '아버지께 털어놓으라고 한다', effects: { 'rel.theodora': -4, 'stat.moral': +4, 'stat.elo': +3, 'pers.good': +2 },
        result: `"네 오빠가 잃은 걸 네가 갚을 순 없어." 테오도라의 얼굴이 굳었다. "……너한테 부탁한 내가 바보지." 문이 쾅 닫혔다. 한 달 뒤, 브로치를 단 테오도라가 {name을} 흘겨보며 지나갔다. 조금 덜 차가운 눈으로.` },
      { label: '로웬에게 거래를 청한다', conditions: ['flag.b12_guild_member', '!flag.b12_rowen_gone'], effects: { 'rel.theodora': +8, 'stat.elo': +4, infamy: +3, 'pers.good': -1 },
        result: `로웬은 브로치를 손가락에 걸고 빙빙 돌렸다. "귀족 아가씨 부탁이라. 값은 나중에 받지." 브로치는 하루 만에 돌아왔다. '나중'이 언제인지 {name은} 묻지 않았다. 묻는 순간 값이 오를 것 같았다.` },
    ],
  },
  {
    id: 'b12_harbor_crew', title: '부두의 말뚝', age: [16, 17], weight: 2.4, image: 'bg/harbor',
    conditions: ['infamy >= 15', 'stat.str >= 150'],
    text: `부두에서 짐꾼 패와 뱃사람 패가 또 붙었다. 이번엔 양쪽 다 {name을} 찾아왔다. "은발이 우리 편에 서면 항구가 조용해진다." 소문이 아이보다 먼저 커 버렸다. {name은} 부두 끝 말뚝에 걸터앉아, 몽둥이를 든 열댓 명을 내려다봤다.`,
    choices: [
      { label: '두 패를 하나로 묶는다', check: { stat: 'str', dc: 450, bonus: (s) => s.stats.elo * 0.3 },
        success: { effects: { 'stat.str': +8, 'stat.elo': +6, infamy: +10, gold: +100, 'pers.agree': -3 },
          result: `{name은} 두 우두머리의 몽둥이를 한꺼번에 빼앗아 바다에 던졌다. "오늘부터 부두 통행세는 내가 정해. 가난한 배는 안 받아." 열댓 명이 고개를 숙였다. 그날 밤 아이가 가져온 금화에서 생선 비린내가 났다.` },
        fail: { effects: { 'stat.hp': -6, 'stat.str': +3, infamy: +6, stress: +12, 'pers.extro': -1 },
          result: `몽둥이 하나가 {name}의 어깨를 스쳤다. 싸움은 경비대 호루라기에 흩어졌다. 아이는 멍든 어깨를 숨기려 소매를 내렸다. 당신은 그 소매를 다시 걷고 약을 발랐다. 둘 다 아무 말도 하지 않았다.` } },
      { label: '짐꾼 조합을 만들자고 한다', effects: { 'stat.elo': +6, 'stat.int': +4, reputation: +5, infamy: -4, 'pers.good': +2, stress: +6 },
        result: `"싸울 힘으로 짐을 나르고, 통행세 대신 품삯을 받자." 다들 비웃었다. 석 달 뒤 항구에 「부두 짐꾼 조합」 간판이 걸렸다. 우두머리 자리는 끝내 사양했다. 간판 글씨만 {name이} 썼다.` },
      { label: '어느 편도 들지 않는다', effects: { 'stat.moral': +2, 'pers.extro': -2, infamy: -2, stress: +4 },
        result: `{name은} 말뚝에서 내려와 집으로 걸어왔다. 등 뒤에서 겁쟁이라는 소리가 들렸다. 그날 밤 부두에서 다친 사람이 일곱 나왔다. 아이는 이불 속에서 그 숫자를 오래 셌다.` },
      { label: '보리와 참새단이 먼저 나선다', conditions: ['flag.b12_bori_saved'], effects: { 'stat.elo': +5, infamy: +5, reputation: +2, 'pers.extro': +2 },
        result: `"은발 편!" 키가 훌쩍 자란 보리가 참새단 열둘을 데리고 말뚝 앞에 섰다. 짐꾼도 뱃사람도 아이들 앞에서 몽둥이를 내렸다. 그날부터 부두 사람들은 {name을} '두목'이라 불렀다. 반은 농담, 반은 진담으로.` },
    ],
  },
];
