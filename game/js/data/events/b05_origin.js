// 배치 b05 — 메인 플롯: 별의 아이의 출생 비밀 (13~17세)
// 2막 균열(13~15): 왕실·마법탑·교단이 다가오고, 아이는 정체성에 흔들리고, 보호자를 의심한다.
// 3막 선택(16~17): 별의 운명이냐 평범한 삶이냐 — 아이의 성격(destinyLean)이 정하고, 보호자는 받아들이거나 개입한다.
//   17세 8월 '세 달이 겹치는 밤'(고정, 자장가 마지막 소절·별의 여신 에필로그와 같은 밤):
//   성격이 운명 쪽이면 b05_star_gate_destiny(→ star_ascent "다녀왔어", 별의 여신 감정선), 아니면 b05_star_gate_home.
//   붙잡거나 등을 떠미는 개입은 판정이며 실패하면 신뢰가 깎인다.
//
// 설정(이 배치가 확정): 어머니 = 왕실 마법사 세라핀(엘다의 제자). 탑에서 도망치던 밤 아기(본명 '아스텔')를 하늘에 숨기며
//   자장가 마지막 소절 "세 달이 겹치는 밤, 내가 너를 찾으러 갈게"와 함께 자기 기억을 대가로 내주었다.
//   지금은 흰눈 고개 너머 '서리마을'의 이름 없는 등불지기. 탑을 떠난 이듬해부터 해마다 이유도 모른 채 엘다에게 눈별꽃을 보낸다.
//   (아이는 열 살에 들판으로 내려왔으므로, 어머니가 사라진 지는 '열몇 해'. 엘다의 꽃도 열몇 송이.)
// 말투: 엘다는 아이에게도 존댓말(이름으로 부름, '너/네' 쓰지 않음) · 대주교는 하게체(b04b와 같음) · 사자·근위대장은 격식체.
//   마법탑의 사자는 그날 밤 뒷문 빗장을 풀어 둔 후배다. b01의 꿈(탑 창가에서 노래하는 사람, 별 여섯 개)이 그 기억이다.
//
// 공용 플래그 세팅
//   magic_awake      대안 경로 b05_burst (magic_spark를 못 본 아이도 탑 이야기에 들어올 수 있게) — 의도된 세팅
//   elda_secret_1    b05_burst · b05_elda_lullaby  → core elda_truth로 이어짐
//   knows_origin     b05_portrait · b05_elda_lullaby · b05_doubt_hidden · b05_tower_archive · b05_envoy_return
//                    + 안전망 b05_sixteen_dawn (16세 1월 고정: secret_letter의 '열여섯 전' 기한, 세 기관이 한꺼번에 찾아온다)
//   tower_choice_hers b05_tower_archive · b05_envoy_return · b05_three_offers (tower_summons 이후의 '그녀의 결정')
//   tower_lessons    b05_tower_archive 에서 수업 중단 시 false
//   mother_alive     발견 4경로: tower_archive(탑) · envoy_return(사자) · northern_hymn(교단) · elda_flowers(엘다)
//   mother_found     연쇄 끝: [발견] → north_trail → north_road → north_village → north_lullaby (5단계)
//                    미룸: north_again → north_road → … / 실패·침묵: b05_mother_letter
// 연쇄(chainOnly + next): ① envoy_window → star_glass ② crown_seal → crown_court
//   ③ 북쪽 연쇄(위) ④ star_gate_destiny → star_ascent
// 코어 콜백: read_letter·open_talk(secret_letter) · tower_refused·tower_lessons(tower_summons) · origin_hidden(elda_truth)
//   · magic_hidden·elda_secret_1(magic_spark) · guardian_confront(inn_stranger) · respected_privacy · met_leon
// b01 콜백: seen.b01_dream_drawing (꿈속 노래)
// 비공개 플래그(모두 이 파일 안에서 다시 읽힘): b05_glass b05_crown_ward b05_royal_token b05_north_hint b05_song_learned
//   b05_portrait_seen b05_doubt b05_north_wait b05_mother_met
// 어머니는 '어머니'로만 부른다(모험가 보호자의 {call}이 '엄마'이므로 겹치지 않게).

// 3막의 갈림길: 양수면 별의 운명 쪽, 음수면 평범한 삶 쪽. 야심·낭만이 평균보다 높을수록, 마력이 클수록 하늘로 끌린다.
// 기준점(야심 25·낭만 15·마력 220)은 시뮬레이션 17세 8월 분포의 중앙 근처 — 일반 정책 기준 운명 쪽 40~55%.
function destinyLean(s) {
  const p = s.personality;
  return (p.ambit - 25) * 0.4 + (p.roman - 15) * 0.4 + ((s.stats.mag ?? 0) - 220) / 8 - p.agree * 0.1;
}
const leansDestiny = (s) => destinyLean(s) >= 0;
const leansHome = (s) => destinyLean(s) < 0;
const priestOrFaithful = (s) => s.guardian === 'priest' || (s.stats.faith ?? 0) >= 140;

export default [
  // ══ 2막: 균열 ══════════════════════════════════════════════════════

  // ── 마법탑의 접근 (연쇄 ①) ──────────────────────────────────────────
  { id: 'b05_envoy_window', title: '밀밭 끝의 남색 로브', age: [13, 14], weight: 2, npc: 'envoy',
    text: '사흘째 같은 사람이 밀밭 끝에 서서 집을 보고 있었다. 별 문양을 수놓은 남색 로브. 오늘은 문을 두드렸다. "마법탑의 사자입니다. 해치러 온 것이 아닙니다. 따님의 별빛을 한 번만 재어 보게 해 주십시오." 그의 손바닥 위에서 작은 유리알이 빛을 머금고 있었다.',
    choices: [
      { label: '재어 보게 한다', effects: { 'stat.mag': +4, 'pers.agree': +1, stress: +3 }, next: 'b05_star_glass',
        result: '{name이} 조심스레 유리알을 받아 들었다. 사자는 숨을 죽인 채 아이의 손끝만 바라봤다.' },
      { label: '문을 닫는다', effects: { trust: +3, 'pers.agree': -1, reputation: -2 },
        result: '"우리 아이는 재는 물건이 아닙니다." 문을 닫자 사자는 한참 서 있다 돌아갔다. {name이} 창틈으로 그 뒷모습을 오래 지켜봤다.' },
      { label: '아이에게 정하게 한다', effects: { trust: +4, 'stat.elo': +2 },
        result: (s) => s.personality.extro >= 0
          ? '"재 보세요. 대신 결과는 저한테도 말해 줘요." 유리알이 하얗게 빛났다. 사자는 결과 대신 깊은 인사만 남기고 떠났다.'
          : '"싫어요. 저는 재는 물건이 아니에요." {name이} 문을 닫았다. 사자는 문 너머에서 정중히 인사하고 떠났다.' },
      { label: '탑의 측정법을 따져 묻는다', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +4, trust: +3 }, next: 'b05_star_glass',
        result: '탑의 측정 공식과 옛 별유리 기록을 조목조목 묻자 사자의 눈썹이 올라갔다. "학자시군요." 그는 유리알을 아이 손에 직접 쥐여 주었다.' },
    ] },
  { id: 'b05_star_glass', title: '같은 빛', chainOnly: true, age: [13, 14], npc: 'envoy',
    text: '유리알이 {name}의 손바닥 위에서 흰 금빛으로 차올랐다. 빛 속에 작은 점 여섯 개가 떠올랐다. 사자의 정중한 얼굴이 처음으로 흔들렸다. "……같은 빛이군요." 그는 말을 삼키듯 입을 다물었다가, 유리알을 가리켰다. "빛이 넘칠 때 이걸 쥐게 하십시오. 탑에는 보고하지 않겠습니다."',
    choices: [
      { label: '별유리를 받아 둔다', effects: { 'flag.b05_glass': true, 'stat.mag': +4, 'pers.roman': +1 },
        result: '유리알은 아이 책상 서랍 깊숙이 들어갔다. 밤마다 서랍 틈으로 점 여섯 개가 희미하게 깜빡였다.' },
      { label: '정중히 돌려준다', effects: { trust: +3, stress: -3, 'pers.agree': -1 },
        result: '"탑의 물건은 받지 않겠습니다." 사자는 유리알을 거두며 작게 말했다. "현명하십니다. 아마도." 아이는 빈손을 한참 쥐었다 폈다.' },
      { label: '누구와 같은 빛인지 캐묻는다', effects: { 'stat.int': +2, 'pers.roman': +2, stress: +4 },
        result: '한참을 버티던 사자가 끝내 입을 열었다. "탑을 떠난 분입니다. 오래전에." 그 이상은 말하지 않았다. 그날 밤 {name이} 물었다. "그 사람, 나랑 무슨 사이일까?"' },
    ] },

  // ── 마력의 대안 각성 ───────────────────────────────────────────────
  { id: 'b05_burst', title: '깨진 진열장', age: [13, 15], weight: 1.8, image: 'bg/market', conditions: ['!flag.magic_awake', 'stress >= 40'],
    text: '장터에서 아이들이 {name을} 둘러쌌다. "별똥별! 소원 들어줘 봐!" 웃음소리가 커질수록 아이 주위의 금색 별빛이 사납게 일렁였다. 쨍— 등잔 가게의 유리 진열장이 한꺼번에 금이 가더니 무너져 내렸다. 다친 사람은 없었다. 모두가 숨을 멈추고 아이를 보고 있었다.',
    choices: [
      { label: '함께 사과하고 값을 문다 (-60G)', conditions: ['gold >= 60'], effects: { gold: -60, 'flag.magic_awake': true, trust: +4, 'stat.moral': +3, reputation: +2 },
        result: '당신은 아이와 나란히 고개를 숙였다. 가게 주인은 투덜대다 돈을 받았다. 돌아오는 길, {name이} 당신 소매를 꼭 쥐었다. "내 안에 뭐가 있는 거야?"' },
      { label: '엘다에게 데려간다', conditions: ['flag.met_elda'], effects: { 'flag.magic_awake': true, 'flag.elda_secret_1': true, 'rel.elda': +6, 'stat.mag': +6 },
        result: '엘다는 떨리는 아이 손을 감싸 쥐었다. "괜찮아요. {name}의 어머니도 열세 살에 유리를 깼는걸요." 말해 놓고, 엘다는 입술을 깨물었다.' },
      { label: '아이를 데리고 자리를 뜬다', effects: { 'flag.magic_awake': true, 'stat.mag': +3, infamy: +3, stress: +5 },
        result: '당신은 아이를 안다시피 하고 장터를 빠져나왔다. 등 뒤로 수군거림이 따라왔다. 그날 밤 아이 방의 불빛은 새벽까지 꺼지지 않았다.' },
      { label: '사자의 별유리를 쥐여 준다', conditions: ['flag.b05_glass'], effects: { 'flag.magic_awake': true, 'stat.mag': +8, stress: -6 },
        result: '유리알이 넘치는 빛을 빨아들이듯 삼켰다. 아이의 숨이 가라앉았다. 유리알 속 점 여섯 개가 전보다 또렷해져 있었다.' },
    ] },

  // ── 왕실의 접근 (연쇄 ②) ────────────────────────────────────────────
  { id: 'b05_crown_seal', title: '왕실 문장의 마차', age: [13, 15], weight: 1.8, npc: 'knight_cpt',
    text: '세 개의 달 문장을 단 마차가 집 앞에 섰다. 흰 갑옷의 근위대장이 두루마리를 펼쳤다. "별의 아이는 왕실이 보호한다. 백 년 된 왕국법입니다. 따님을 왕실 피후견인으로 올리시지요. 해마다 지원금이 나오고, 탑도 함부로 손대지 못합니다. 대신 계절마다 왕궁에 들러야 합니다."',
    choices: [
      { label: '서명한다', effects: { gold: +200, reputation: +6, 'flag.b05_crown_ward': true, trust: -4, 'pers.ambit': +2 }, next: 'b05_crown_court',
        result: '서명이 끝나자 근위대장이 아이에게 한쪽 무릎을 굽혔다. {name은} 당신을 돌아봤다. 묻지도 않고 정한 거냐는 눈이었다.' },
      { label: '아이와 먼저 의논한다', effects: { trust: +5, 'stat.elo': +3, 'pers.ambit': +1 }, next: 'b05_crown_court',
        result: '"왕궁을 먼저 보고 정할래." {name이} 말하자 근위대장이 마차 문을 열었다. "그러시다면 오늘 모시겠습니다."' },
      { label: '정중히 거절한다', effects: { reputation: -3, trust: +3, 'pers.agree': -1 },
        result: '"이 아이는 이 집에서 자랍니다." 근위대장은 두루마리를 말았다. "탑이 먼저 오면 그때는 늦습니다." 마차 바퀴 자국이 오래 남았다.' },
      { label: '옛 동료로서 진의를 묻는다', conditions: ["guardian == 'knight'"], effects: { 'flag.b05_royal_token': true, 'stat.cult': +3, trust: +3 },
        result: '근위대장이 투구를 벗었다. "솔직히, 왕실은 탑이 두렵습니다." 그녀는 문장 하나를 건넸다. "서명은 안 하셔도 됩니다. 급할 땐 이걸 보이십시오. 근위대가 돕겠습니다."' },
    ] },
  { id: 'b05_crown_court', title: '첫 알현', chainOnly: true, age: [13, 15], image: 'bg/throne_room',
    text: '왕좌의 방은 천장이 아득하게 높았다. 왕은 자리에 없었고, 대신 귀족들이 {name을} 구경거리처럼 둘러섰다. "저게 별의 아이래." "눈이 정말 붉네." 근위대장이 낮게 속삭였다. "인사 한 번이면 됩니다. 저들은 그걸로 판단합니다."',
    choices: [
      { label: '배운 대로 인사하게 한다', check: { stat: 'eti', dc: 120, bonus: (s) => s.stats.chm * 0.2 }, minigame: 'ball',
        success: { effects: { 'stat.eti': +6, reputation: +6, 'rel.loren': +3, 'pers.ambit': +2 }, result: '{name은} 치맛자락을 쥐고 흔들림 없이 무릎을 굽혔다. 수군거림이 멎었다. 누군가 "본데가 있군" 하고 중얼거렸다.' },
        fail: { effects: { 'stat.eti': +3, stress: +8, 'pers.extro': -2 }, result: '인사 도중 발이 꼬였다. 웃음소리가 번졌다. 돌아오는 마차에서 아이는 창밖만 봤다. "다시는 안 와."' } },
      { label: '리온이 곁에 서 준다', conditions: ['flag.met_leon', 'rel.leon >= 30'], effects: { 'rel.leon': +6, 'stat.eti': +3, stress: -4 },
        result: '귀족들 틈에서 리온이 걸어 나와 아이 옆에 섰다. 귀족들이 말없이 길을 비켰다. 리온이 속삭였다. "턱만 들어. 나머진 저 사람들이 알아서 해."' },
      { label: '일찍 자리를 뜬다', effects: { trust: +3, reputation: -3, stress: -5, 'pers.ambit': -1 },
        result: '"오늘은 여기까지 하겠습니다." 당신은 아이 손을 잡고 돌아섰다. 등 뒤의 시선이 따가웠지만, 아이의 손은 따뜻했다.' },
    ] },

  // ── 교단의 접근 ────────────────────────────────────────────────────
  { id: 'b05_church_omen', title: '징조와 축복', age: [13, 15], weight: 1.8, npc: 'archbishop',
    text: '가뭄이 든 해였다. 대주교가 사제 둘을 데리고 찾아왔다. "옛 경전에는 별의 아이가 축복이라고도, 징조라고도 적혀 있다네. 마을 사람들이 불안해하고 있어. 별의 미사 때 이 아이를 제단 앞에 세워 보세. 제 눈으로 직접 보면 소문도 가라앉을 걸세."',
    choices: [
      { label: '미사에 세운다', check: { stat: 'faith', dc: 100, bonus: (s) => s.stats.moral * 0.3 },
        success: { effects: { 'stat.faith': +6, reputation: +8, infamy: -3, 'pers.good': +2 }, result: '제단 앞에서 {name이} 눈을 감자 스테인드글라스 빛과 별빛이 섞여 내려앉았다. 누군가 먼저 무릎을 꿇었다. 그날 이후 수군거림이 줄었다.' },
        fail: { effects: { 'stat.faith': +2, infamy: +4, stress: +10, 'pers.extro': -2 }, result: '별빛이 촛불을 하나씩 꺼뜨렸다. 성당이 술렁였다. "역시 징조야." 아이는 미사가 끝날 때까지 고개를 들지 못했다.' } },
      { label: '아이가 직접 말하게 한다', check: { stat: 'elo', dc: 125 },
        success: { effects: { 'stat.elo': +5, reputation: +6, 'pers.extro': +2 }, result: '"저도 비를 기다려요. 우리 밭도 말랐거든요." 광장에 웃음이 번졌다. 그 순간 아이는 별의 아이가 아니라 이웃집 아이였다.' },
        fail: { effects: { 'pers.extro': -3, 'stat.elo': +2, stress: +8, infamy: +2 }, result: '말문이 막혔다. 아이 주위에서 별빛만 떨렸다. 사람들은 한 걸음씩 물러섰다.' } },
      { label: '거절한다', effects: { trust: +4, reputation: -4, 'pers.agree': -1 },
        result: '"이 아이를 시험대에 세우지 않겠습니다." 대주교는 노여워하지 않았다. "그 마음도 기도일세." 다만 마을의 눈길은 한동안 차가웠다.' },
      { label: '옛 순례 일지를 청한다', conditions: [priestOrFaithful], effects: { 'flag.b05_north_hint': true, 'stat.cult': +4, 'stat.faith': +2 },
        result: '대주교가 낡은 순례 일지를 펼쳤다. "열몇 해 전 겨울, 은발의 여인이 하룻밤 묵고 북쪽으로 떠났다. 이름은 남기지 않았다." 그는 일지를 덮고 아이를 오래 바라봤다.' },
    ] },

  // ── 엘다와 자장가 (elda_secret_1 대안 경로) ─────────────────────────
  { id: 'b05_elda_lullaby', title: '끊기지 않은 소절', age: [13, 16], weight: 2.5, npc: 'elda',
    conditions: ['flag.met_elda', 'rel.elda >= 35', '!flag.elda_secret_1'],
    text: '엘다가 약초를 빻으며 옛말로 된 자장가를 흥얼거렸다. {name이} 무심코 다음 소절을 이어 불렀다. 엘다가 한 번도 부른 적 없는 소절이었다. 절굿공이가 멈췄다. "그 소절은… 제가 단 한 사람에게만 가르쳤어요."',
    choices: [
      { label: '누구에게 가르쳤는지 묻는다', effects: { 'flag.elda_secret_1': true, 'rel.elda': +5, 'stat.sens': +3, stress: +4 },
        result: '엘다는 한참 만에 입을 열었다. "제 제자요. {name}의 어머니." 그 이상은 고개를 저었다. "오늘은 여기까지만요. 미안해요."' },
      { label: '노래를 끝까지 배운다', check: { stat: 'sens', dc: 115 },
        success: { effects: { 'flag.elda_secret_1': true, 'flag.b05_song_learned': true, 'stat.mag': +4, 'stat.sens': +3 },
          result: '엘다는 마지막 소절까지 가르쳐 주었다. "세 달이 겹치는 밤, 내가 너를 찾으러 갈게." 다 부르고 나서 엘다가 말했다. "{name}의 어머니가 제일 좋아하던 노래예요."' },
        fail: { effects: { 'flag.elda_secret_1': true, 'stat.sens': +2, stress: +3 },
          result: '옛말 발음이 자꾸 혀에 걸렸다. 마지막 소절에서 아이가 번번이 막히자 엘다가 쓸쓸하게 웃었다. "어머니도 처음엔 꼭 거기서 막혔어요."' } },
      { label: '꿈속 그림 이야기를 한다', conditions: ['seen.b01_dream_drawing'], effects: { 'flag.elda_secret_1': true, 'flag.b05_song_learned': true, 'rel.elda': +8, 'stat.sens': +4 },
        result: '"탑 창가에서 노래하던 사람, 머리 위에 별 여섯 개." 엘다의 손에서 약초가 떨어졌다. "그건 꿈이 아니에요. 기억이에요." 그녀는 마지막 소절까지 불러 주었다.' },
      { label: '왕궁 초상화 이야기를 한다', conditions: ['flag.b05_portrait_seen'], effects: { 'flag.elda_secret_1': true, 'flag.knows_origin': true, 'rel.elda': +6, stress: +6 },
        result: '"왕궁 회랑에서 은발 마법사 초상화를 봤어요." 엘다가 눈을 감았다. "세라핀. 제 제자이자 {name}의 어머니예요. 갓난 {name을} 안고 탑에서 도망쳤죠." 아이는 엘다의 손을 놓지 않았다.' },
    ] },

  // ── 초상화 회랑 (knows_origin 대안 경로) ─────────────────────────────
  { id: 'b05_portrait', title: '초상화 회랑', age: [14, 16], weight: 2, image: 'bg/castle_hall', requiresActivity: ['castle', 'etiquette'],
    conditions: ['!flag.knows_origin'],
    text: '왕궁에 볼일이 있던 날, {name을} 데리러 갔더니 아이가 긴 회랑 끝 초상화 앞에 못 박힌 듯 서 있었다. 덮개 천이 반쯤 흘러내린 액자. 은백색 머리, 붉은 눈, 가슴에는 별 여섯 개를 새긴 펜던트. 이름표에는 \'왕실 마법사\'라고만 남아 있었다. 아이 주위의 별빛이 액자 쪽으로 기울었다.',
    choices: [
      { label: '시종장에게 물어보게 한다', check: { stat: 'elo', dc: 140 },
        success: { effects: { 'flag.knows_origin': true, 'stat.cult': +4, stress: +6 }, result: '늙은 시종장이 한숨을 쉬었다. "세라핀 님이오. 열몇 해 전, 갓난 딸을 안고 탑에서 사라지셨지." 그는 아이 얼굴을 보고 말을 잃었다.' },
        fail: { effects: { 'flag.b05_portrait_seen': true, stress: +4, reputation: -2, 'pers.roman': +2 }, result: '"함부로 볼 그림이 아니오." 시종장이 천을 덮고 사람을 불렀다. 둘은 쫓기듯 회랑을 나왔다. 아이는 끝까지 뒤를 돌아봤다.' } },
      { label: '액자에 손을 대 보게 한다', conditions: ['flag.magic_awake'], effects: { 'flag.knows_origin': true, 'stat.mag': +5, stress: +8 },
        result: '손끝이 닿자 그림 속 여인이 움직였다. 아기를 안고 창가에서 노래하는 모습. 금세 멈췄지만 충분했다. "……저 아기, 나야." 아이 목소리가 떨렸다.' },
      { label: '천을 덮고 데리고 나온다', effects: { 'flag.b05_portrait_seen': true, trust: -3, 'pers.agree': +1 },
        result: '당신은 천을 다시 덮었다. "가자." 아이는 따라 나왔지만, 마차에 오를 때까지 한 번도 당신을 보지 않았다.' },
      { label: '실컷 보게 기다려 준다', effects: { 'flag.b05_portrait_seen': true, trust: +4, 'stat.sens': +4 },
        result: '당신은 기둥에 기대 기다렸다. 해가 기울 무렵 아이가 돌아섰다. "닮았지?" 대답 대신 당신은 아이 어깨에 외투를 걸쳐 주었다.' },
    ] },

  // ── 보호자를 의심하다 ──────────────────────────────────────────────
  { id: 'b05_doubt_field', title: '그날 밤 왜 거기 있었어', age: [14, 15], weight: 2,
    text: '저녁 식탁에서 {name이} 숟가락을 내려놓았다. "장터 사람들이 그러더라. 별이 떨어진 밤에 {call이} 하필 그 들판에 있었던 게 이상하대. 요즘 낯선 어른들이 자꾸 내 얘기를 하고 다니잖아. {call}도 처음부터 알고 날 데려온 거야?"',
    choices: [
      { label: '그날 밤을 처음부터 말한다', effects: { trust: +5, 'stat.sens': +4, 'pers.roman': +2, stress: +3 },
        result: '당신은 그 밤을 처음부터 이야기했다. 잠이 안 와 들판을 걷는데 하늘이 갈라지듯 빛났고, 따뜻하게 패인 땅 한가운데 네가 있었다고. 아이가 물었다. "그럼 그냥… 우연이야?" "응. 제일 운 좋은 우연."' },
      { label: '"쓸데없는 소리"라며 자른다', effects: { trust: -7, 'pers.agree': -3, stress: +5, 'flag.b05_doubt': true },
        result: '"밥이나 먹어." 아이는 숟가락을 다시 들지 않았다. 그날부터 {name은} 당신이 편지를 받을 때마다 누구에게서 왔는지 살폈다.' },
      { label: '여관 손님 일까지 털어놓는다', conditions: ['flag.guardian_confront'], effects: { trust: +8, 'stat.elo': +2, stress: +3 },
        result: '"그 후드 쓴 사람이 날 알아본 건, 옛날 왕도에서 스친 얼굴이라서야. 너를 찾는 줄 알면서도 너한테는 말 못 했어. 미안해." 아이는 당신 눈을 오래 보다가 고개를 끄덕였다.' },
      { label: '편지를 몰래 읽은 일부터 사과한다', conditions: ['flag.read_letter', '!flag.open_talk'], effects: { trust: +8, 'pers.agree': +2, 'stat.moral': +2 },
        result: '"탑 편지를 몰래 읽은 거, 그것부터 미안해. 네가 의심하는 게 당연해." 아이 눈이 커졌다. "……먼저 말할 줄은 몰랐어."' },
    ] },

  // ── 정체성 ─────────────────────────────────────────────────────────
  { id: 'b05_not_a_star', title: '별이 아니라면', age: [14, 17], weight: 3, conditions: ['flag.knows_origin'],
    text: '{name이} 창틀에 걸터앉아 손바닥을 내려다보고 있었다. 별빛이 손가락 사이로 새어 나왔다. "다들 별의 아이라고 불렀잖아. 근데 난 그냥 도망친 마법사의 딸이래. 그럼 이 반짝이는 건 뭐야? 상처야, 선물이야?"',
    choices: [
      { label: '별빛을 함께 다뤄 본다', conditions: ['flag.magic_awake'], check: { stat: 'mag', dc: 140 },
        success: { effects: { 'stat.mag': +8, 'pers.ambit': +2, stress: -6 }, result: '아이가 숨을 고르자 흩어지던 빛이 손바닥 위에 작은 별 하나로 모였다. "……내 말 듣네." 처음으로 아이가 자기 빛을 보고 웃었다.' },
        fail: { effects: { 'stat.mag': +3, stress: +5, 'pers.roman': -1 }, result: '빛은 모였다 흩어지기를 되풀이했다. 아이가 주먹을 쥐었다. "아직은 내 거 같지 않아." 그래도 손을 펴는 걸 멈추지 않았다.' } },
      { label: '어머니가 남긴 것이라고 한다', effects: { trust: +5, 'stat.sens': +5, 'pers.roman': +3 },
        result: '"네 어머니가 너를 하늘에 맡기면서 같이 보낸 거야. 길 잃지 말라고." 아이는 손바닥을 볼에 대 보았다. "……따뜻하다."' },
      { label: '별이든 아니든 상관없다고 한다', effects: { trust: +4, stress: -5, 'pers.ambit': -2, 'pers.roman': -2 },
        result: '"넌 저녁마다 수프를 두 그릇 먹는 애야. 그거면 충분해." 아이가 웃음을 터뜨렸다. "그게 중요해?" "그게 제일 중요해."' },
      { label: '이제 숨기지 않아도 된다고 한다', conditions: ['flag.magic_hidden'], effects: { 'stat.mag': +6, 'pers.extro': +4, trust: +6 },
        result: '"그때 숨기라고 한 거, 내가 무서워서였어. 이제 안 숨겨도 돼." 그날 밤 아이 방 창문에서 별빛이 쏟아졌다. 마을 끝에서도 보일 만큼.' },
    ] },
  { id: 'b05_birth_name', title: '두 개의 이름', age: [14, 17], weight: 3, conditions: ['flag.knows_origin'],
    text: '"나한테 이름이 하나 더 있었대." {name이} 손바닥에 손가락으로 글자를 썼다. 아스텔. 어머니가 지어 준 이름, 옛말로 \'여섯 번째 별\'. "처음 듣는데 귀에 익어. 근데 {call이} 불러 준 이름도 나잖아. 난 누구로 살아야 해?"',
    choices: [
      { label: '그 이름으로 한 번 불러 본다', effects: { trust: +4, 'stat.sens': +4, 'pers.roman': +2 },
        result: '"아스텔." 아이가 눈을 깜빡였다. "……어색해. 근데 싫지는 않아." 그날 저녁 큐브가 실수로 그렇게 불렀다가 아이한테 쫓겨 다녔다.' },
      { label: '"넌 {name이야}" 하고 못 박는다', effects: { trust: -4, stress: +5, 'pers.agree': -2 },
        result: '"알아. 근데 그 이름도 나야. 하나를 지우면 난 반쪽이 돼." 아이는 손바닥의 글자를 끝내 지우지 않았다.' },
      { label: '별자리 도감에서 뜻을 찾는다', conditions: ['item.star_atlas >= 1'], effects: { 'stat.int': +5, 'stat.cult': +3, 'pers.roman': +2 },
        result: '도감 구석에 백 년에 한 번 밝아진다는 이름 없는 별이 있었다. 옛 별지기들은 그 별을 \'여섯 번째\'라 불렀다. 아이가 그 페이지 모서리를 접었다. "어머니는 저 별을 보고 지었나 봐."' },
      { label: '아이가 정하게 둔다', effects: { trust: +6, 'stat.elo': +2, 'pers.agree': +1 },
        result: (s) => s.personality.roman > 20
          ? '"둘 다 쓸래. {name} 아스텔. 길지만 둘 다 내 거니까." 아이가 공책 첫 장에 두 이름을 나란히 적었다.'
          : s.personality.ambit > 20
            ? '"아스텔은 큰일 할 때 쓰는 이름으로 아껴 둘래. 평소엔 {name}." 아이가 자못 진지하게 말했다.'
            : '"{name으로} 할래. {call이} 처음 불러 준 이름이니까. 아스텔은… 마음속에 둘게." 아이가 당신 소매를 살짝 잡았다.' },
    ] },
  { id: 'b05_doubt_receipt', title: '탑의 영수증', age: [15, 16], weight: 3, conditions: ['flag.tower_lessons'],
    text: '{name이} 탁자에 종이 한 장을 내리쳤다. 마법탑 재무국의 영수증이었다. 장학금이라던 그 200G 옆에 \'별의 아이 위탁 장려금, 수령 확인\'이라고 적혀 있었다. "{call}, 나 팔았어? 탑에서 돈 받고 나를 조금씩 넘기는 거야? 그래서 수업 보내는 거야?" 아이 주위의 별빛이 날카롭게 튀었다.',
    choices: [
      { label: '장부를 전부 펼쳐 보인다', effects: { trust: +6, 'stat.int': +3, 'pers.roman': -2 },
        result: '책값, 털 외투, 약값. 그 돈이 어디에 쓰였는지 한 줄 한 줄 적혀 있었다. {name이} 마지막 줄을 짚었다. "……남은 건 내 이름으로 모아 뒀네."' },
      { label: '장려금을 돌려보낸다 (-200G)', conditions: ['gold >= 200'], effects: { gold: -200, trust: +10, 'pers.good': +2 },
        result: '당신은 그 자리에서 200G를 탑에 돌려보냈다. 수업은 계속하되 돈은 받지 않겠다고. 아이는 아무 말 없이 당신 옆에 앉았다.' },
      { label: '차근차근 설명한다', check: { stat: 'elo', dc: 140 },
        success: { effects: { trust: +8, 'stat.elo': +3, stress: -4 }, result: '"그 돈은 탑이 너를 붙잡아 두려고 준 거지, 내가 너를 판 값이 아니야." 아이가 한참 듣다 말했다. "그럼 나도 탑을 이용하면 되겠네." 둘이 동시에 웃었다.' },
        fail: { effects: { trust: -6, stress: +8, 'flag.b05_doubt': true }, result: '설명할수록 변명처럼 들렸다. "됐어." 문이 닫혔다. 영수증은 아이 서랍 속으로 들어갔다.' } },
      { label: '계약서 조항을 함께 따진다', conditions: ["guardian == 'merchant'"], effects: { 'stat.int': +4, 'stat.elo': +3, trust: +5 },
        result: '상인의 눈으로 계약서를 훑자 맨 아래 작은 글씨가 나왔다. \'수령자는 소환에 응할 의무가 있다.\' 당신은 그 줄에 선을 긋고 탑에 되돌려 보냈다. 아이가 휘파람을 불었다.' },
    ] },
  { id: 'b05_doubt_hidden', title: '숨기는 거 있지', age: [15, 17], weight: 4, conditions: ['flag.origin_hidden', '!flag.knows_origin'],
    text: '당신이 엘다를 만나고 온 날부터 {name이} 당신을 자꾸 살폈다. 오늘은 문간을 막고 섰다. "엘다는 나 볼 때마다 울 것 같은 얼굴을 해. {call}도 그래. 둘이 나한테 뭘 숨기고 있잖아. 내 일인데 나만 몰라."',
    choices: [
      { label: '지금 전부 말한다', effects: { 'flag.knows_origin': true, trust: +6, 'stat.sens': +5, stress: +6 },
        result: '어머니, 탑, 하늘에 숨겨진 밤. 당신은 들은 대로 전부 말했다. 아이는 끝까지 울지 않았다. 다 듣고 나서야 물었다. "왜 이제야 말해?"' },
      { label: '아직은 때가 아니라고 한다', effects: { trust: -10, stress: +8, 'pers.agree': -3, 'flag.b05_doubt': true },
        result: '"내 때는 내가 정해." 아이가 문을 닫았다. 그날 밤 언덕에 오른 작은 등불이 새벽까지 내려오지 않았다.' },
      { label: '이번엔 내 비밀을 연다', conditions: ['flag.respected_privacy'], effects: { 'flag.knows_origin': true, trust: +10, 'stat.sens': +4 },
        result: '"네 비밀을 들추지 않았던 것처럼, 이번엔 내 비밀을 너한테 열게." 이야기를 다 듣고 아이가 당신 손을 꼭 잡았다. "숨긴 것도, 말해 준 것도 다 {call}답다."' },
      { label: '이번엔 얼버무리지 않겠다고 한다', conditions: ['flag.b05_doubt'], effects: { 'flag.knows_origin': true, trust: +9, 'pers.agree': +2, stress: +3 },
        result: '"지난번엔 얼버무렸지. 이번엔 안 그럴게." 아이가 팔짱을 풀었다. 이야기가 끝났을 때 창밖이 하얗게 밝아 있었다.' },
    ] },

  // ── 2막의 끝: 열여섯의 기한 (고정 · 아직 모르는 아이에게 진실이 온다) ──────────
  // core secret_letter의 "별의 아이는 열여섯이 되기 전 탑으로 와야 한다" — 그 기한이 지난 아침.
  { id: 'b05_sixteen_dawn', title: '열여섯 번째 아침', age: [16, 16], month: 1, fixed: true, conditions: ['!flag.knows_origin'],
    text: '열여섯 번째 생일 다음 날 아침, 문을 여니 세 사람이 서 있었다. 남색 로브의 사자, 흰 갑옷의 근위대장, 금실 사제복의 대주교. 셋 다 서로를 보고 놀란 얼굴이었다. 계단에서 {name이} 내려왔다. "다들 나 때문에 온 거지. 이제 말해 줘. 나 누구야?"',
    choices: [
      { label: '세 사람 앞에서 전부 듣게 한다', effects: { 'flag.knows_origin': true, trust: +6, stress: +8, 'stat.cult': +3 },
        result: '왕실 마법사 세라핀, 탑에서의 탈출, 하늘에 숨겨진 아기. 세 사람이 조각을 하나씩 내놓았다. 당신이 보탠 건 들판의 밤뿐이었다. 아이는 끝까지 당신 옆에 서 있었다.' },
      { label: '셋을 돌려보내고 둘이 이야기한다', effects: { 'flag.knows_origin': true, trust: +8, 'stat.sens': +4, reputation: -3 },
        result: '당신은 문간에서 세 사람의 이야기를 먼저 듣고 정중히 돌려보냈다. 그리고 식탁에 마주 앉아 들판의 밤까지 전부 전했다. 다 듣고 아이가 말했다. "손님들한테 차는 내줄걸."' },
      { label: '사자에게 말하게 한다', effects: { 'flag.knows_origin': true, 'stat.mag': +5, 'stat.int': +3, trust: -2 },
        result: '사자는 기록을 읽듯 담담하게 말했다. 이름, 날짜, 그리고 그 밤의 별자리. 아이는 한 마디도 놓치지 않았다. 다만 이야기 내내 당신 소매를 놓지 않았다.' },
      { label: '아직은 아니라며 모두 돌려보낸다', effects: { trust: -10, stress: +8, 'pers.agree': -3, 'flag.b05_doubt': true },
        result: '"오늘은 돌아가 주십시오." 세 사람이 떠나자 아이가 계단에 주저앉았다. "다들 아는데 나만 몰라. {call}까지 막으면, 난 누구한테 물어?"' },
    ] },

  // ══ 3막: 선택 — 어머니를 찾아서 ═════════════════════════════════════

  // ── 발견 ① 탑 (tower_lessons) ──────────────────────────────────────
  { id: 'b05_tower_archive', title: '꺼지지 않은 별', age: [15, 17], weight: 3.5, image: 'bg/tower', conditions: ['flag.tower_lessons', '!flag.mother_alive'],
    text: '탑 수업에서 돌아온 {name이} 숨을 몰아쉬었다. "서고 맨 위층에 봉인된 방이 있어. 문패엔 \'세라핀\', 문틈으로 요람이 보였어. 그리고 천구의에서 그 사람 별을 찾았는데, 기록엔 \'실종, 사망 추정\'이래. 근데… 아직 빛나. 아주 희미하게. 나랑 같은 빛으로."',
    choices: [
      { label: '천구의 기록을 베껴 오게 한다', check: { stat: 'int', dc: 170 }, minigame: 'exam',
        success: { effects: { 'flag.knows_origin': true, 'flag.mother_alive': true, 'stat.int': +8, 'stat.mag': +4 }, next: 'b05_north_trail',
          result: '아이는 사흘 밤을 들여 별의 자리와 빛의 세기를 베껴 왔다. 별은 북쪽 하늘 낮은 곳에 걸려 있었다. "살아 있어. 북쪽 어딘가에."' },
        fail: { effects: { 'flag.knows_origin': true, 'stat.int': +3, stress: +8, reputation: -3 },
          result: '베끼던 중 사서에게 들켰다. 기록은 압수당했고 탑의 눈길이 따가워졌다. 그래도 아이는 하나만은 확신했다. "그 사람, 내 어머니야."' } },
      { label: '사자에게 정면으로 묻게 한다', effects: { 'flag.knows_origin': true, 'flag.mother_alive': true, 'pers.agree': -2, stress: +5 }, next: 'b05_north_trail',
        result: '사자는 오래 침묵하다 말했다. "천구의는 거짓말을 하지 않습니다. 살아 있는 마법사의 별만 빛나지요." 그리고 덧붙였다. "북쪽입니다. 저는 아무 말도 하지 않았습니다."' },
      { label: '탑 수업을 그만두게 한다', effects: { 'flag.tower_lessons': false, 'flag.knows_origin': true, trust: -3, stress: -6 },
        result: '"그런 곳에 더는 안 보내." 아이는 반박하지 않았다. 반박하지 않아서 더 마음에 걸렸다. 마지막 수업 날, 아이는 천구의의 그 별을 오래 올려다보고 왔다.' },
      { label: '탑에 남을지 아이가 정하게 한다', effects: { 'flag.tower_choice_hers': true, 'flag.knows_origin': true, trust: +6, 'stat.mag': +3 },
        result: (s) => s.personality.ambit > 0
          ? '"남을래. 그 방 문을 내 손으로 열 때까지." {name이} 이를 악물었다. 탑의 별 하나가 조금 밝아진 것 같았다.'
          : '"다닐게. 근데 이제 탑 말은 반만 믿을 거야." {name은} 출입증을 주머니 깊이 넣었다. 그 방 열쇠를 찾을 때까지.' },
    ] },

  // ── 발견 ② 사자 (tower_refused) ────────────────────────────────────
  { id: 'b05_envoy_return', title: '돌아온 사자', age: [16, 17], weight: 4, npc: 'envoy', conditions: ['flag.tower_refused', '!flag.mother_alive'],
    // 열여섯 아침(b05_sixteen_dawn) 등으로 이미 진실을 아는 아이가 많다 — 그때는 '남은 하나'(살아 있는 별)를 전하러 온다.
    // 선택지 결과는 효과(knows_origin 세팅)가 적용된 뒤 그려지므로, 아는지 여부는 등장 시점의 text에서만 가른다.
    text: (s) => '"다시 오겠다"던 사자가 정말 왔다. 이번엔 탑의 문장도 두루마리도 없이, 비에 젖은 평복 차림이었다. "탑의 사자로 온 게 아닙니다. 열몇 해 전 그분이 탑을 떠나던 밤, 뒷문 빗장을 풀어 둔 사람이 저였습니다. '
      + (s.flags.knows_origin ? '따님이 아직 모르시는 게 하나 남았습니다."' : '이제는 따님께 진실을 말씀드려야 할 때인 것 같아서요."'),
    choices: [
      { label: '아이를 불러 함께 듣는다', effects: { 'flag.knows_origin': true, 'flag.mother_alive': true, trust: +6, stress: +6 }, next: 'b05_north_trail',
        result: '사자는 그 밤 뒷문에서 본 것을 남김없이 털어놓았다. 왕실 마법사 세라핀이 아기를 하늘에 숨기러 가던 뒷모습까지. 그리고 하나를 덧붙였다. 아직 꺼지지 않은 그녀의 별. "북쪽 하늘에 떠 있습니다." {name이} 당신 손을 꽉 쥐었다.' },
      { label: '탑에 갈지 아이가 정하게 한다', effects: { 'flag.tower_choice_hers': true, 'flag.knows_origin': true, trust: +8, 'pers.ambit': +1 },
        result: (s) => s.personality.ambit > 10
          ? '사자가 그분의 이야기를 짧게 전하고 물었다. "탑으로 오시겠습니까?" {name이} 답했다. "갈게요. 대신 제 발로, 제 이름으로." 사자가 깊이 허리를 숙였다. "그분과 똑같은 말씀을 하시는군요."'
          : '사자가 그분의 이야기를 짧게 전하고 물었다. "탑으로 오시겠습니까?" "안 가요. 어머니가 도망친 곳에 제 발로 들어가진 않을래요." 사자는 고개를 끄덕이고 떠났다. 문간에 젖은 발자국만 남았다.' },
      { label: '사자의 속내를 떠보게 한다', check: { stat: 'elo', dc: 150 },
        success: { effects: { 'flag.knows_origin': true, 'flag.mother_alive': true, 'stat.elo': +4, 'pers.good': +1 }, next: 'b05_north_trail',
          result: '"왜 이제 와서요?" 아이가 묻자 사자는 젖은 소매를 쥐었다. "탑이 다시 움직이기 전에, 그분이 살아 계시다는 걸 아셔야 했습니다. 북쪽입니다."' },
        fail: { effects: { stress: +5, trust: -2, 'pers.agree': -1 },
          result: '아이의 날 선 질문에 사자는 입을 닫았다. "제가 너무 늦게 왔나 봅니다." 그는 빗속으로 돌아섰다.' } },
      { label: '문을 닫는다', effects: { trust: +2, stress: -4, 'pers.roman': -1 },
        result: '"이 집은 탑의 일에 다시 엮이지 않습니다." 문 너머에서 사자가 한참 서 있다 떠났다. {name은} 그날 밤 문간의 젖은 발자국을 오래 내려다봤다.' },
    ] },

  // ── 발견 ③ 교단 (성당·신학교) ──────────────────────────────────────
  { id: 'b05_northern_hymn', title: '순례자의 노래', age: [15, 17], weight: 3.5, image: 'bg/church', requiresActivity: ['church', 'theology'],
    conditions: ['flag.knows_origin', '!flag.mother_alive'],
    text: '성당에서 하루를 마칠 무렵, 북쪽에서 온 늙은 순례자가 낯선 노래를 흥얼거렸다. {name이} 그 자리에 얼어붙었다. 꿈속에서 듣던 그 자장가였다. "이 노래요? 흰눈 고개 너머 서리마을 등불지기가 밤마다 부르지요. 은발에 붉은 눈인데, 자기 이름도 모르는 여인이라오."',
    choices: [
      { label: '순례자에게 자세히 묻게 한다', effects: { 'flag.mother_alive': true, 'stat.elo': +3, 'stat.faith': +3 }, next: 'b05_north_trail',
        result: '"열몇 해 전 겨울, 눈 속에 쓰러져 있던 걸 마을 사람들이 데려왔다오. 노래 말고는 아무것도 기억 못 했지." 아이는 순례자의 손을 놓지 않았다.' },
      { label: '그 노래를 끝까지 청한다', effects: { 'flag.mother_alive': true, 'flag.b05_song_learned': true, 'stat.sens': +5, stress: +3 }, next: 'b05_north_trail',
        result: '노래는 늘 같은 자리에서 끊긴다고 했다. "세 달이 겹치는 밤, 내가 너를……." 순례자가 멈춘 자리에서 {name이} 다음 소절을 작게 이어 불렀다. 저도 모르게.' },
      { label: '대주교의 일지와 맞춰 본다', conditions: ['flag.b05_north_hint'], effects: { 'flag.mother_alive': true, 'stat.int': +4, 'stat.faith': +4, trust: +3 }, next: 'b05_north_trail',
        result: '순례 일지 속 \'북쪽으로 떠난 은발의 여인\'과 서리마을의 등불지기. 날짜가 꼭 맞았다. 대주교가 성호를 그었다. "별이 길을 잃지 않았구려."' },
      { label: '헛된 희망일 수 있다고 말린다', effects: { trust: -5, 'pers.roman': -3, stress: +4 },
        result: '"은발 여인은 왕국에 많아." 아이는 대꾸하지 않았다. 다만 순례자가 떠날 때까지 성당 문 앞에 서 있었다.' },
    ] },

  // ── 발견 ④ 엘다 ────────────────────────────────────────────────────
  { id: 'b05_elda_flowers', title: '해마다 오는 꽃', age: [15, 17], season: 'winter', weight: 4, npc: 'elda', conditions: ['flag.knows_origin', 'rel.elda >= 60', '!flag.mother_alive'],
    text: '엘다가 찬장 깊은 곳에서 상자를 꺼냈다. 눌러 말린 흰 꽃이 열몇 송이. "눈별꽃이에요. 북쪽 고개 너머에만 피죠. 그 애가 탑을 떠난 이듬해부터 겨울마다 한 송이씩, 보낸 사람 이름도 없이 왔어요. 올겨울에도요. 희망을 품는 게 무서워서… 아무한테도 말 못 했어요."',
    choices: [
      { label: '꽃이 온 길을 따라가 보자고 한다', effects: { 'flag.mother_alive': true, 'rel.elda': +6, trust: +3 }, next: 'b05_north_trail',
        result: '꽃을 싼 종이를 한 장씩 펴 보았다. 번진 우편소 도장 가운데 딱 한 장에서 글자가 읽혔다. 서리마을. 엘다가 아이를 끌어안았다. "가 봐요. 저 대신."' },
      { label: '엘다부터 위로한다', effects: { 'flag.mother_alive': true, 'rel.elda': +10, 'stat.sens': +4 }, next: 'b05_north_trail',
        result: '당신이 엘다의 어깨를 감싸자 그녀가 처음으로 소리 내어 울었다. 아이가 꽃 한 송이를 엘다 머리에 꽂았다. "찾으면 엘다한테 제일 먼저 올게."' },
      { label: '아이가 꽃을 만져 보게 한다', conditions: ['flag.magic_awake'], effects: { 'flag.mother_alive': true, 'flag.b05_song_learned': true, 'stat.mag': +6 }, next: 'b05_north_trail',
        result: '{name}의 손끝이 닿자 마른 꽃잎에서 희미한 노랫소리가 흘러나왔다. 자장가의 마지막 소절. 꽃을 꺾던 손이 부르던 노래였다.' },
      { label: '섣불리 믿지 말자고 한다', effects: { trust: -3, 'rel.elda': -4, 'pers.roman': -3 },
        result: '"누가 장난으로 보냈을 수도 있어요." 엘다는 조용히 상자를 닫았다. 아이는 상자가 다시 찬장 속으로 들어가는 걸 끝까지 지켜봤다.' },
    ] },

  // ── 북쪽 연쇄 ③ ────────────────────────────────────────────────────
  { id: 'b05_north_trail', title: '북쪽으로', chainOnly: true, age: [15, 17], image: 'bg/road',
    text: '그날 밤 {name}의 방에서 짐 꾸리는 소리가 났다. 털양말, 등잔, 지도 한 장. 흰눈 고개 너머 \'서리마을\'에 동그라미가 쳐져 있었다. "가 볼래. 아니라도 괜찮아. 맞으면… 그때 생각할래." 아이가 당신을 올려다봤다. "같이 가 줄 거야?"',
    choices: [
      { label: '함께 떠날 채비를 한다 (-120G)', conditions: ['gold >= 120'], effects: { gold: -120, trust: +6, gHealth: -3 }, next: 'b05_north_road',
        result: '당신은 다음 날 아침 역마차 두 자리를 샀다. 큐브가 도시락 바구니를 들고 따라 나섰다가 집 지키라는 말에 시무룩해졌다. "주인님, 꼭 데려오세요!"' },
      { label: '가렛에게 호위를 부탁한다', conditions: ['rel.garrett >= 35'], effects: { gold: -40, 'rel.garrett': +5, 'stat.str': +3, trust: +3 }, next: 'b05_north_road',
        result: '"흰눈 고개? 거긴 산적보다 눈이 무섭지." 가렛이 짐을 짊어졌다. "꼬마 아가씨 어머니 찾는 길이면 공짜다." 그래도 당신은 여비를 쥐여 줬다.' },
      { label: '{name이} 앞장서게 한다', conditions: ['trust >= 60'], effects: { trust: +5, 'pers.extro': +2, 'stat.agi': +3 }, next: 'b05_north_road',
        result: '"네가 길을 정해. 나는 뒤에서 짐을 질게." 아이가 지도를 접어 품에 넣었다. 새벽, 둘은 해보다 먼저 집을 나섰다.' },
      { label: '아직 이르다며 미룬다', effects: { 'flag.b05_north_wait': true, trust: -5, stress: +6, 'pers.agree': -2 },
        result: '"흰눈 고개는 위험해. 조금만 기다리자." 아이는 짐을 풀지 않았다. 꾸린 가방은 그 뒤로도 문 옆에 그대로 놓여 있었다.' },
    ] },
  { id: 'b05_north_again', title: '문 옆의 가방', age: [15, 17], weight: 4, conditions: ['flag.b05_north_wait', '!flag.mother_found'],
    text: '문 옆에 세워 둔 가방에 먼지가 앉기 시작했다. 오늘 아침 {name이} 그 가방을 들고 섰다. "기다리라고 해서 기다렸어. 근데 그 사람 별은 기다려 주지 않을지도 몰라. 이번엔 내가 정할래. 같이 가든, 나 혼자 가든."',
    choices: [
      { label: '이번엔 함께 떠난다 (-80G)', conditions: ['gold >= 80'], effects: { gold: -80, trust: +6, stress: -5 }, next: 'b05_north_road',
        result: '당신은 말없이 외투를 꺼내 입었다. 아이가 가방을 고쳐 멨다. "……진작 그럴 것이지." 목소리가 젖어 있었다.' },
      { label: '근위대 문장으로 역마차를 얻는다', conditions: ['flag.b05_royal_token'], effects: { reputation: +3, trust: +5, 'stat.cult': +2 }, next: 'b05_north_road',
        result: '근위대장의 문장을 보이자 역참지기가 허리를 굽혔다. 왕실 역마차는 사흘 만에 흰눈 고개 아래에 닿았다. 아이가 문장을 신기한 듯 만져 봤다.' },
      { label: '아이에게 맡긴다', effects: { trust: +8, 'pers.agree': +2, gHealth: -4 }, next: 'b05_north_road',
        result: '"네가 정해." 아이가 잠깐 놀라더니, 당신 외투를 내밀었다. "그럼 정했어. 같이 가." 당신은 웃음을 참으며 외투를 받아 입었다.' },
      { label: '그래도 안 된다고 한다', effects: { trust: -12, stress: +12, 'pers.agree': -4 },
        result: '"안 돼." 아이가 가방을 내려놓았다. 화내지도 울지도 않았다. 그날 저녁 아이는 가방을 풀어 하나씩 제자리에 넣었다. 그게 더 무서웠다.' },
    ] },
  { id: 'b05_north_road', title: '흰눈 고개', chainOnly: true, age: [15, 17], image: 'bg/road',
    text: '흰눈 고개 중턱에서 눈보라가 길을 지웠다. 앞사람 등도 보이지 않는다. 바람 소리 사이로 {name이} 외쳤다. "저 아래 불빛! 마을이야!" 발밑은 얼어붙은 비탈. 해는 금방이라도 넘어갈 것 같았다.',
    choices: [
      { label: '눈보라를 뚫고 넘는다', check: { stat: 'hp', dc: 140, bonus: (s) => s.stats.agi * 0.2 }, minigame: 'adventure',
        success: { effects: { 'stat.hp': +6, 'stat.agi': +4, trust: +3 }, next: 'b05_north_village',
          result: '서로 허리에 밧줄을 묶고 한 걸음씩 내려갔다. 마을 첫 집 처마 밑에 닿았을 때 둘 다 눈사람 같았다. 아이가 웃다가 재채기를 했다.' },
        fail: { effects: { 'stat.hp': -4, stress: +8, gHealth: -5, trust: +2 }, next: 'b05_north_village',
          result: '비탈에서 두 번 미끄러졌다. 마을에 닿았을 땐 밤이 깊었고 발가락 감각이 없었다. 그래도 아이는 불빛만 보고 걸었다.' } },
      { label: '여행용 망토를 둘러 준다', conditions: ['item.travel_cloak >= 1'], effects: { 'stat.hp': +3, trust: +4, stress: -3 }, next: 'b05_north_village',
        result: '두꺼운 망토가 눈보라를 막았다. 아이가 망토 자락 아래서 당신 팔짱을 꼈다. "이거 사 준 거, 오늘 처음으로 고마워."' },
      { label: '옛 모험가의 샛길로 간다', conditions: ["guardian == 'adventurer'"], effects: { 'stat.agi': +5, trust: +5, 'pers.extro': +2 }, next: 'b05_north_village',
        result: '"이 고개, 젊을 때 세 번 넘었어." 바위틈 샛길로 들어서자 바람이 거짓말처럼 잦아들었다. 아이 눈이 반짝였다. "{call}, 진짜 모험가였구나."' },
      { label: '고개 아래 주막에서 하루 묵는다', effects: { gold: -40, stress: -4, 'stat.sens': +3 }, next: 'b05_north_village',
        result: '눈보라는 밤새 울었다. 주막 난로 앞에서 아이는 한숨도 자지 않고 창밖만 봤다. 아침, 눈이 그친 고개는 거짓말처럼 고요했다.' },
    ] },
  { id: 'b05_north_village', title: '등불지기', chainOnly: true, age: [15, 17], image: 'bg/snow_village',
    text: '서리마을은 눈 속에 웅크린 작은 마을이었다. 해 질 녘, 누군가 집집마다 등불을 켜며 걸어왔다. 은백색 머리에 서리가 섞인 여인, 빛바랜 붉은 눈. 여인이 지나가자 {name}의 별빛이 끌려가듯 기울었다. 여인이 공손히 고개를 숙였다. "길손이시네요. 등불이 필요하세요?"',
    choices: [
      { label: '아이가 먼저 말을 걸게 둔다', effects: { 'stat.elo': +3, 'pers.extro': +2, trust: +3 }, next: 'b05_north_lullaby',
        result: '"저… 밤마다 노래를 부르신다고 들었어요." 여인이 수줍게 웃었다. "왜 부르는지도 모르면서요." 그녀는 저녁에 우물가로 오라고 했다.' },
      { label: '당신이 사정을 설명한다', effects: { 'stat.cult': +2, trust: -2, stress: +4 }, next: 'b05_north_lullaby',
        result: '당신이 조심스레 지난 일을 이야기하자 여인은 미안한 얼굴로 고개를 저었다. "기억이… 나지 않아요." 아이는 당신 등 뒤에서 입술만 깨물었다.' },
      { label: '오늘은 멀리서 지켜본다', effects: { 'stat.sens': +4, stress: +5, 'pers.roman': +2 }, next: 'b05_north_lullaby',
        result: '둘은 여관 창가에서 등불이 하나씩 켜지는 걸 지켜봤다. 마지막 등불을 켠 여인이 우물가에 앉았다. 그리고 노래를 시작했다.' },
    ] },
  { id: 'b05_north_lullaby', title: '끊긴 소절', chainOnly: true, age: [15, 17], image: 'bg/snow_village',
    text: '밤, 우물가. 여인이 등불을 무릎에 놓고 자장가를 불렀다. 꿈속에서 수없이 들은 그 노래. 그런데 늘 같은 자리에서 멈춘다. "세 달이 겹치는 밤, 내가 너를……." 여인이 이마를 짚었다. "언제나 여기서 막혀요." {name}의 별빛이 떨렸다.',
    choices: [
      { label: '끊긴 소절을 이어 부르게 한다', conditions: ['flag.b05_song_learned'], effects: { 'flag.mother_found': true, trust: +6, 'stat.sens': +6, stress: -10 },
        result: '"…찾으러 갈게." 아이가 소절을 맺자 등불이 눈 위로 굴렀다. 여인이 떨리는 손으로 아이 얼굴을 감쌌다. "……아스텔?" 아이가 고개를 끄덕였다. "어머니가 못 와서, 내가 왔어."' },
      { label: '노래를 따라 불러 보게 한다', check: { stat: 'sens', dc: 200, bonus: (s) => s.stats.mag * 0.1 },
        success: { effects: { 'flag.mother_found': true, 'stat.sens': +6, trust: +4, stress: -6 },
          result: '더듬더듬 따라 부르던 아이 입에서 모르던 소절이 저절로 흘러나왔다. 여인이 숨을 들이켰다. 오래 잠긴 문이 열리는 얼굴이었다. "……내 별." 둘은 눈 속에서 오래 서로를 붙들었다.' },
        fail: { effects: { 'flag.b05_mother_met': true, 'stat.sens': +3, stress: +10 },
          result: '노래는 같은 자리에서 또 끊겼다. 여인이 미안하게 웃었다. "고마워요. 덕분에 오늘은 덜 외롭네요." 아이는 우리 집 주소를 적어 여인 손에 쥐여 주었다.' } },
      { label: '별 머리핀을 보여 준다', conditions: ['item.silver_hairpin >= 1'], effects: { 'flag.mother_found': true, 'stat.chm': +3, trust: +4, stress: -6 },
        result: '아이가 별 머리핀을 빼 내밀자 여인이 제 머리칼을 더듬었다. 거기 있던 무언가를 찾듯이. "별 핀… 나도 이런 걸 아기 강보에 꽂아 줬는데." 말해 놓고 여인이 얼어붙었다. 그리고 아이를 끌어안았다.' },
      { label: '말없이 곁에 앉아 있는다', effects: { 'flag.b05_mother_met': true, trust: +4, 'stat.sens': +4 },
        result: '셋은 말없이 등불 곁에 앉아 있었다. 여인이 말했다. "이상하죠. 처음 뵙는데 집에 온 것 같아요." 떠나는 날, 아이는 우리 집 주소를 여인 손에 쥐여 주었다.' },
    ] },
  { id: 'b05_mother_letter', title: '눈별꽃 편지', age: [16, 17], season: 'winter', weight: 4, conditions: ['flag.b05_mother_met', '!flag.mother_found'],
    text: '눈 내리는 아침, 서리마을 우편소 도장이 찍힌 편지가 왔다. 봉투 안에 눌러 말린 눈별꽃 한 송이. "그 노래의 끝을 꿈에서 들었어요. 제가 부르고 있었어요. 아기를 하늘로 올려 보내면서. 그 아기 이름이 아스텔이었다는 것도요. 혹시… 혹시 그 아이가." 마지막 글씨가 번져 있었다.',
    choices: [
      { label: '아이가 답장을 쓰게 한다', effects: { 'flag.mother_found': true, trust: +5, 'stat.elo': +3 },
        result: '아이는 밤새 답장을 썼다 지웠다. 아침에 봉한 편지는 딱 한 줄이었다. "네, 저예요. 봄에 갈게요."' },
      { label: '봄이 오면 함께 찾아가자고 한다', effects: { 'flag.mother_found': true, gold: -60, stress: -8, trust: +3 },
        result: '눈이 녹자마자 둘은 다시 고개를 넘었다. 이번엔 세라핀이 마을 어귀까지 마중 나와 있었다. 손을 흔들다 말고, 먼저 달려왔다.' },
      { label: '어머니를 우리 집에 초대한다', effects: { 'flag.mother_found': true, 'rel.cube': +3, 'stat.sens': +4, gold: -50 },
        result: '한 달 뒤, 세라핀이 우리 집 문 앞에 섰다. 큐브가 케이크를 떨어뜨렸다. "어, 어서 오세요, 손님! 아니, 어머님! 아니……." 아이가 웃음을 터뜨렸고, 세라핀도 따라 웃었다.' },
      { label: '답장은 당신이 대신 쓴다', effects: { 'flag.mother_found': true, trust: -6, 'pers.agree': -2 },
        result: '당신은 정중하게, 조심스럽게 답장을 썼다. 며칠 뒤 그걸 안 아이가 말했다. "내 어머니한테 가는 편지야. 다음부턴 내가 쓸게." 맞는 말이었다.' },
    ] },
  { id: 'b05_two_homes', title: '문간의 두 사람', age: [15, 17], weight: 4, conditions: ['flag.mother_found'],
    text: '세라핀이 평원의 집을 찾아왔다. 문간에서 그녀는 당신에게 깊이 허리를 숙였다. "기억도 없던 제가 무슨 염치로 이런 말을 드리는지……. 이 아이를 키워 주셔서 고맙습니다." {name이} 두 사람 사이에서 어쩔 줄 몰라 했다. 저녁 식탁에 의자가 하나 더 놓였다. 어색하고, 이상하게 따뜻했다.',
    choices: [
      { label: '한동안 머물라고 권한다', effects: { gold: -80, trust: +5, 'stat.sens': +4, stress: -6 },
        result: '세라핀은 한 계절을 꼬박 머물렀다. 기억은 부엌 냄새나 노래 한 소절에 실려 조금씩 돌아왔다. 아이는 매일 밤 두 사람에게 번갈아 잘 자라고 인사했다.' },
      { label: '어디서 지낼지 아이가 정하게 한다', effects: { trust: +8, 'pers.agree': +2 },
        result: (s) => s.personality.extro > 10
          ? '"봄엔 서리마을, 가을엔 여기! 둘 다 내 집이야." {name이} 달력에 줄을 그었다. 세라핀과 당신은 동시에 웃었다.'
          : '"나는 여기 살래. 대신 어머니가 자주 와." {name이} 세라핀의 손을 잡았다. "고개 넘는 길은 내가 마중 나갈게."' },
      { label: '둘만의 시간을 내어 준다', effects: { trust: +5, 'stat.sens': +6, 'pers.extro': +1 },
        result: '당신은 장을 보러 간다며 집을 나섰다. 해 질 녘 돌아오니 두 사람이 같은 노래를 부르며 감자를 깎고 있었다. 당신 몫의 칼도 놓여 있었다.' },
      { label: '"이 아이 집은 여기"라고 한다', effects: { trust: -8, stress: +6, 'pers.agree': -3 },
        result: '세라핀은 조용히 고개를 끄덕였다. "물론이에요." 그날 밤 {name이} 당신 방 앞에서 말했다. "나 빼앗길까 봐 그런 거 알아. 근데 나 물건 아니야."' },
    ] },

  // ══ 3막: 선택 — 별이냐, 집이냐 ═════════════════════════════════════
  { id: 'b05_three_offers', title: '세 통의 편지', age: [16, 17], weight: 2.5, conditions: ['flag.magic_awake', 'flag.knows_origin'],
    text: '같은 날 아침, 봉랍 세 개가 식탁에 놓였다. 왕실의 세 달 문장, 마법탑의 별 문양, 성당의 금빛 인장. 궁정 마법사 자리, 탑의 \'별의 자리\', 별의 성녀 후보. {name이} 세 통을 나란히 펼쳐 놓고 턱을 괴었다. "다 \'별의 아이\'한테 온 거야. {name}한테 온 건 하나도 없어."',
    choices: [
      { label: '탑 편지 때처럼 마주 앉는다', conditions: ['flag.open_talk'], effects: { trust: +6, 'stat.cult': +4, 'stat.int': +3 },
        result: '"탑 편지 때 생각난다." 아이가 웃었다. 둘은 세 통을 소리 내어 읽고 좋은 점과 싫은 점을 적었다. 목록 맨 아래에 아이가 덧붙였다. \'다 집에서 멀다.\'' },
      { label: '답장은 아이가 쓰게 한다', effects: { 'flag.tower_choice_hers': true, trust: +7, 'stat.elo': +3 },
        result: (s) => s.personality.ambit > 20
          ? '아이는 탑에만 답장을 썼다. "자리는 받겠습니다. 단, 집에서 다니겠습니다." 왕실과 성당에는 정중한 거절. 당신은 봉랍 녹이는 걸 도왔다.'
          : '아이는 세 통 모두에 같은 답장을 썼다. "저는 아직 제가 뭔지 정하는 중입니다. 다 정하면 먼저 연락드리겠습니다." 당신은 웃음을 참았다.' },
      { label: '세 통 다 난롯불에 넣는다', effects: { trust: -8, stress: -4, 'pers.agree': -3 },
        result: '봉랍이 녹아내렸다. {name이} 불 속에서 한 통을 건져 냈다. 탑의 편지였다. 그을린 종이를 털며 아이가 말했다. "내 편지는 내가 태울게."' },
      { label: '왕실에 먼저 답해야 한다고 한다', conditions: ['flag.b05_crown_ward'], effects: { reputation: +4, 'pers.ambit': +2, trust: -3 },
        result: '"피후견인 서약을 했으니까." 아이가 왕실 편지를 맨 위에 올렸다. "그때 서명한 건 {call이었}잖아." 틀린 말은 아니었다.' },
    ] },
  { id: 'b05_star_gate_destiny', title: '세 달이 겹치는 밤', age: [17, 17], month: 8, fixed: true, image: 'bg/starnight',
    conditions: [leansDestiny],
    text: '세 개의 달이 하나로 겹친 밤, 그 한가운데 백 년에 한 번 밝아진다는 별이 떴다. {name}의 별빛이 실처럼 풀려 그 별을 향해 올라갔다. 아이가 신발 끈을 묶으며 말했다. "저 별이 불러. 내가 떨어져 온 곳이야. 거기서 내가 뭔지 보고 올게." 그리고 당신을 똑바로 봤다. "돌아올 거야. 약속해."',
    choices: [
      { label: '받아들이고 배웅한다', effects: { trust: +10, 'stat.mag': +8, 'pers.ambit': +2 }, next: 'b05_star_ascent',
        result: '당신은 아이 외투 단추를 끝까지 채워 주었다. "다녀와." 아이가 웃었다. "응. 다녀올게."' },
      // 아이 마음이 흔들리는지(감수성·신뢰) 대 별에 끌리는 마음(destinyLean) — 결정은 아이의 성격이 내린다.
      // 시뮬 기준 전체 약 60%, 마력 400+로 별에 크게 끌리는 아이는 5% 남짓만 붙잡힌다.
      { label: '가지 말라고 붙잡는다', check: { stat: 'sens', dc: 300, bonus: (s) => s.trust * 0.6 - destinyLean(s) * 3 },
        success: { effects: { trust: -3, 'pers.agree': +3, stress: +6 },
          result: '"가지 마." 그 한마디에 아이 걸음이 멈췄다. 별은 새벽이 되자 흐려졌다. 아이는 끝내 울지 않았다. "……{call이} 그렇게 말하면 못 가지."' },
        fail: { effects: { trust: -8, stress: +8, 'pers.agree': -3 }, next: 'b05_star_ascent',
          result: '"미안. 이건 내가 정할게." 아이가 당신 손을 살며시 떼어 냈다. 별빛의 실이 아이를 감싸 들어 올렸다.' } },
      { label: '언덕까지 함께 걷는다', effects: { trust: +8, 'stat.sens': +5, gHealth: -4 }, next: 'b05_star_ascent',
        result: '언덕 꼭대기까지 둘은 손을 놓지 않았다. 처음 아이를 만난 들판이 발아래 보였다. "여기서부터는 혼자 갈게." 아이가 손을 놓았다.' },
      { label: '어머니와 함께 배웅한다', conditions: ['flag.mother_found'], effects: { trust: +8, 'stat.mag': +6, 'stat.sens': +4 }, next: 'b05_star_ascent',
        result: '자장가의 약속처럼, 세라핀이 언덕에 와 있었다. 그녀가 아이 이마에 손을 얹고 그 자장가를 끝까지 불렀다. 아이가 두 사람 손을 한 번씩 꼭 쥐었다 놓았다.' },
    ] },
  { id: 'b05_star_ascent', title: '다녀왔어', chainOnly: true, age: [17, 17], image: 'bg/starnight',
    text: '별빛의 실이 {name을} 천천히 하늘로 들어 올렸다. 작아지고, 작아지다가, 백 년의 별 곁에서 하나의 빛이 되었다. 들판에는 당신만 남았다. 밤바람이 찼다. 아이가 떨어지던 그 밤처럼, 하늘이 고요했다.',
    choices: [
      { label: '언덕에서 밤새 기다린다', check: { stat: 'mag', dc: 260, bonus: (s) => s.stats.sens * 0.2 },
        success: { effects: { 'stat.mag': +15, 'stat.sens': +6, trust: +6, gHealth: -4 },
          result: '새벽녘, 빛 하나가 깃털처럼 내려왔다. 아이가 당신 앞에 사뿐히 섰다. 붉은 눈 속에 별이 하나 더 들어 있었다. "다녀왔어." 그 한마디면 됐다.' },
        fail: { effects: { 'stat.mag': +6, stress: +10, trust: +4, gHealth: -4 },
          result: '한밤중, 빛이 비틀거리며 떨어졌다. 당신은 달려가 아이를 받아 안았다. "너무 높았어. 근데… 다 봤어." 아이는 당신 품에서 잠들었다.' } },
      { label: '큐브와 지붕에 등불을 켠다', effects: { 'rel.cube': +6, trust: +6, 'stat.mag': +8 },
        result: '큐브가 지붕 위에 등불을 하나 켰다. "길 잃지 마시라고요, 주인님." 새벽, 별빛 하나가 그 등불을 향해 곧장 내려왔다. "다녀왔어. 등불 보고 왔어."' },
      { label: '그 자장가를 불러 준다', conditions: ['flag.b05_song_learned'], effects: { 'stat.mag': +10, trust: +8, 'stat.sens': +4 },
        result: '당신은 서툰 목소리로 그 자장가를 불렀다. 마지막 소절에서 하늘이 대답하듯 반짝였다. 아이가 노래를 따라 내려왔다. "음정 다 틀렸어." 아이는 울면서 웃었다.' },
    ] },
  { id: 'b05_star_gate_home', title: '커튼을 치는 밤', age: [17, 17], month: 8, fixed: true,
    conditions: [leansHome],
    text: '세 개의 달이 하나로 겹친 밤, 백 년에 한 번 밝아진다는 별이 평원 위에 떴다. 온 마을이 지붕에 올라갔다. {name은} 창가에서 그 별을 한참 보다가 커튼을 쳤다. "난 여기 있을래. 별보다 밀밭이 좋고, 탑보다 우리 부엌이 좋아." 아이가 당신을 돌아봤다. "이상한 거 아니지?"',
    choices: [
      { label: '그 선택을 받아들인다', effects: { trust: +10, stress: -10, 'pers.ambit': -2 },
        result: '"하나도 안 이상해." 아이가 의자에 털썩 앉았다. "그럼 오늘은 감자 파이 해 줘." 창밖이 환한 밤, 둘은 부엌에서 밀가루를 뒤집어썼다.' },
      // 아이의 별빛이 별에 응답하는지(마력·신뢰) 대 집에 머물려는 마음(destinyLean이 음수로 클수록 어렵다).
      { label: '한 번만 올려다보라고 권한다', check: { stat: 'mag', dc: 130, bonus: (s) => s.trust * 0.5 + destinyLean(s) * 3 },
        success: { effects: { 'stat.mag': +8, 'pers.roman': +3, trust: +2 },
          result: '"보기만 하는 거야." 아이가 커튼을 살짝 열었다. 별빛이 손등에 내려앉았다. "……예쁘긴 하네. 그래도 안 가." 커튼은 반쯤 열린 채로 남았다.' },
        fail: { effects: { trust: -8, stress: +8, 'pers.agree': -3 },
          result: '"왜 다들 나한테 별이 되라고 해? {call}까지." 아이 목소리가 갈라졌다. 당신은 더 말하지 못했다. 커튼은 아침까지 닫혀 있었다.' } },
      { label: '커튼 틈으로 함께 별을 본다', effects: { trust: +6, 'stat.sens': +5, 'pers.roman': +2 },
        result: '당신은 커튼을 손가락 한 마디만큼 열었다. "여기서 보면 딱 우리 집만 한 별이야." 아이가 피식 웃으며 당신 어깨에 머리를 기댔다.' },
      { label: '어머니의 편지를 함께 읽는다', conditions: ['flag.mother_found'], effects: { trust: +6, 'stat.sens': +4, stress: -6 },
        result: '이 밤에 맞춰 세라핀의 편지가 와 있었다. "별이 되지 않아도 너는 내 별이야. 그분 곁에서 행복하렴." 아이가 편지를 가슴에 대고 당신을 봤다. "들었지? 허락받았어."' },
    ] },
];
