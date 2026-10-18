// 배치 b09 — 교육: 여덟 학교의 스승 · 슬럼프 · 재능의 발견 · 경쟁 (10~17세)
// 규칙: docs/game-design/content-contract.md  (id·비공개 플래그 접두사 b09_)
//
// 학교별 구성 (← 랜덤 등장 · requiresActivity, ⇒ chainOnly 연쇄)
//   일반학교  school_questions(10~12) [b09_ines_after] ← school_skip(11~13, 시험 미니게임) ← school_blank(14~16, 슬럼프)
//   예절학교  loren_teacup(10~12) · dance_class_loren(12~15) [dance_lessons] · loren_tea_helper(13~16) [tea_party]
//            loren_ball_notice(14~16) ⇒ loren_ball_prep [b09_ball_dressed] ⇒ loren_ball_night [ball_won] (무도회 미니게임)
//   검술도장  garrett_first_bout(11~13, 모험 미니게임) · garrett_footwork(13~15, 슬럼프) [b09_footwork]
//            sword_tourney(14~16) ⇒ sword_shoulder [b09_shoulder_hidden] ⇒ sword_final [b09_tourney_won] (모험 미니게임)
//            garrett_last(16~17, 가렛의 마지막 수업)
//   마법탑    tower_candles(11~13) [b09_adel_mentor] · tower_exam(13~15, 시험 미니게임) · tower_slump(14~17, 슬럼프)
//   예술원    art_portrait(10~12) · art_dance(12~15) [dance_lessons] · art_ugly(14~16, 슬럼프)
//   신학교    theo_question(11~13) · theo_bread(13~16)
//   상업학원  mock_market(12~13) ⇒ mock_market_close [b09_guild_visit] (시험 미니게임) · commerce_ledger(15~16)
//   농업학교  farm_seedling(10~12) · farm_bees(12~15)
// 연쇄(chainOnly + next) 3개: ① 견습 무도회 3단계 ② 도장 대항전 3단계 ③ 모의 장터 2단계
//
// 공용 플래그 세팅: dance_lessons (dance_class_loren 3경로 · art_dance 3경로 — 돈 없이도 닿는 길 포함)
//                  ball_won (loren_ball_night 2경로) · tea_party (loren_tea_helper 2경로, core loren_invite와 별개 경로)
// 코어 콜백: met_elda · magic_hidden · knows_origin · tea_party · dance_lessons · tutor_started(b02) · rel.loren/garrett/theodora
// 보호자 출신 선택지: knight 4 · scholar 1 · merchant 1 · priest 1 · adventurer 1
// 반복 등장 보조 인물(관계 수치 없음): 이네스 선생님·사샤(읍내 학교, b02와 같은 사람) · 아델 학사(마법탑 견습반 강사)
//   · 펠릭스 선생(예술원 그림) · 올가 선생(예술원 무용, 은퇴한 무희) · 오틸리아 수녀(신학교 교리)
//   · 코벤 원장(상업학원) · 핍(상업학원 동기, 생선 장수 아들) · 헤드윅 선생님(농업학교) · 울릭(검술도장 선배) · 에드릭(왕도 도장)
// 테오도라: 첫 만남은 코어 theodora_rival(12~13세). 그 전에 나올 수 있는 장면(10~13세)은 그녀를 아는 사이로 전제하지 않고,
//   이름은 rel.theodora 조건 선택지나 14세 이상 장면에서만 쓴다.
// 효과 키는 stat/pers/rel/flag/스칼라만 쓴다. 아이템은 조건(item.x >= 1)으로만 읽고 주거나 빼앗지 않는다.
// 판정 DC는 시뮬레이션 실측(그 학교에 다니는 아이들의 나이별 능력치 분포)으로 맞췄다.

export default [
  // ════════════════════════════════════════════════════════════════════
  // 일반학교 — 이네스 선생님
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b09_school_questions', title: '멈춰 버린 산수 시간', age: [10, 12], weight: 2, requiresActivity: 'school', image: 'bg/school',
    text: `이네스 선생님이 쪽지를 보내왔다. "따님 질문 때문에 오늘도 산수 시간이 별 이야기 시간이 되었습니다. 달은 왜 셋인지, 별은 왜 떨어지는지……. 저는 그 질문들이 좋아요. 다만 다른 아이들이 기다리다 지칩니다." {name이} 쪽지를 같이 읽다 고개를 푹 숙였다. "나 또 혼나는 거야?"`,
    choices: [
      { label: '질문은 쉬는 시간에 하자', effects: { 'stat.eti': +4, 'stat.int': +2, 'pers.agree': +2, 'pers.extro': -1 },
        result: `{name은} 다음 날부터 질문을 공책 귀퉁이에 적었다. 쉬는 시간마다 선생님 책상 앞에 줄을 섰다. 줄은 늘 {name} 혼자였다.` },
      { label: '질문 하나를 발표로 바꿔 봐', check: { stat: 'int', dc: 75 },
        success: { effects: { 'stat.int': +5, 'stat.elo': +3, reputation: +2, 'pers.extro': +2 },
          result: `"달이 셋인 이유에 대한 세 가지 가설." 발표가 끝나자 반 아이들이 세 편으로 갈려 쉬는 시간 내내 다퉜다. 이네스 선생님은 웃음을 참느라 혼났다.` },
        fail: { effects: { stress: +5, 'stat.int': +2, 'pers.extro': -2 },
          result: `칠판 앞에 서자 머릿속이 하얘졌다. {name은} "그러니까…… 달이……"만 되풀이하다 자리로 돌아왔다. 그날 밤엔 질문 공책을 펴 보지도 않았다.` } },
      { label: '방과 후 시간을 부탁한다', effects: { 'flag.b09_ines_after': true, 'stat.int': +4, 'stat.cult': +2, gold: -20 },
        result: `햇사과 한 바구니를 안고 학교를 찾았다. 이네스 선생님이 손뼉을 쳤다. "질문 상자를 만들죠. 화요일 방과 후, 하루 세 개씩." {name이} 상자에 별을 그려 넣었다.` },
      { label: '밤마다 답을 같이 찾자', conditions: ["guardian == 'scholar'"], effects: { 'stat.int': +6, 'stat.cult': +2, trust: +4, stress: +2 },
        result: `그날부터 저녁상 위에 책이 쌓였다. "{call}, 이것도 몰라?" "모르니까 찾는 거지." 둘은 별이 떨어지는 이유를 끝내 못 찾았다. 그래서 내일 또 찾기로 했다.` },
    ],
  },
  {
    id: 'b09_school_skip', title: '위 학년 교실', age: [11, 13], weight: 2, requiresActivity: 'school', image: 'bg/school',
    conditions: ['stat.int >= 110'],
    text: `이네스 선생님이 시험 공고문을 들고 집까지 왔다. "위 학년 공부도 충분히 따라오겠어요. 다음 주에 월반 시험이 있습니다." 기뻐하던 {name}의 얼굴이 금세 흐려졌다. "그럼 사샤랑 다른 반이 되는 거야? 거기 애들은 다 나보다 키도 크고……."`,
    choices: [
      { label: '시험을 쳐 보자', check: { stat: 'int', dc: 160 }, minigame: 'exam',
        success: { effects: { 'stat.int': +10, reputation: +3, stress: +6, 'pers.ambit': +3 },
          result: `합격이었다. 위 학년 첫날, {name은} 맨 앞자리에 앉았다. 발이 바닥에 겨우 닿았다. 그래도 손은 제일 먼저 들었다.` },
        fail: { effects: { 'stat.int': +4, stress: +5, 'pers.ambit': -1 },
          result: `두 문제 차이였다. {name은} 시험지를 한참 내려다보다 말했다. "괜찮아. 사샤랑 같은 반이잖아." 목소리는 괜찮지 않았다.` } },
      { label: '친구들이랑 같이 올라가자', effects: { 'stat.elo': +3, 'pers.extro': +2, 'pers.ambit': -2, trust: +3 },
        result: `{name은} 참았던 숨을 내쉬었다. 그 주에 사샤와 둘이 운동장 끝 나무에 이름을 새겼다. 나란히, 같은 높이에.` },
      { label: '자리는 그대로, 책만 위 학년', conditions: ['flag.b09_ines_after'], effects: { 'stat.int': +6, 'stat.cult': +4, 'pers.ambit': +1, trust: +2 },
        result: `이네스 선생님이 고개를 끄덕였다. "좋아요. 화요일 질문 상자에 위 학년 교과서를 넣어 두죠." {name은} 친구들 옆자리에 앉은 채 남몰래 한 학년 앞을 걸었다.` },
    ],
  },
  {
    id: 'b09_school_blank', title: '세 번의 백지', age: [14, 16], weight: 2.5, requiresActivity: 'school', image: 'bg/school',
    conditions: ['stat.int >= 220'],
    text: `이네스 선생님의 편지는 짧았다. "세 번 연속 백지 답안입니다. 아는 문제인데도요." 저녁 내내 {name은} 숟가락만 저었다. 한참 만에 입을 열었다. "다들 내가 일등 할 줄 알잖아. 틀리면 어떡해. 그럴 바엔 안 쓰는 게 나아."`,
    choices: [
      { label: '가정교사를 붙인다 (-150G)', conditions: ['gold >= 150'], effects: { gold: -150, 'stat.int': +8, stress: +8, trust: -3, 'pers.ambit': +2 },
        result: `가정교사는 유능했다. 점수는 돌아왔다. 다만 {name은} 시험지를 낼 때마다 손바닥을 옷자락에 닦았다. 그걸 알아본 건 당신뿐이었다.` },
      { label: '한 번쯤 틀려도 돼', effects: { stress: -10, trust: +5, 'pers.ambit': -2, 'stat.int': +2 },
        result: `"{call}도 틀려 봤어?" "많이. 오늘 아침에도." 다음 시험에서 {name은} 한 문제를 틀렸다. 그리고 집에 와서 오랜만에 소리 내어 웃었다.` },
      { label: '꼬마들 가르치던 때를 떠올려 봐', conditions: ['flag.tutor_started'], effects: { 'stat.int': +5, 'stat.elo': +3, stress: -6, 'pers.good': +1 },
        result: `{name이} 꼬마들에게 글자를 가르치던 날을 떠올리더니 연필을 집었다. "틀리면 고치면 돼. 내가 걔들한테 맨날 하던 말이네."` },
      { label: '화요일 질문 상자로 가 보자', conditions: ['flag.b09_ines_after'], effects: { trust: +4, 'stat.int': +4, stress: -8, 'stat.sens': +2 },
        result: `오랜만에 셋이 질문 상자 앞에 앉았다. 이네스 선생님이 서랍에서 누렇게 바랜 종이를 꺼냈다. 열네 살의 선생님이 낸 백지 답안. 귀퉁이에 "모르겠다"가 적혀 있었다.` },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 예절학교 — 마담 로렌
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b09_loren_teacup', title: '한 시간의 찻잔', age: [10, 12], weight: 2.5, requiresActivity: 'etiquette', npc: 'loren',
    text: `예절학교에서 돌아온 {name이} 팔을 주물렀다. 마담 로렌이 찻잔을 받쳐 든 채 한 시간을 서 있게 했단다. 찻물이 한 번만 흔들려도 처음부터. "그 선생님 미워. 옆자리 귀족 애는 한 번에 했단 말이야." 눈가가 빨갰다.`,
    choices: [
      { label: '로렌에게 따지러 간다', effects: { 'rel.loren': -6, trust: +4, stress: -4, 'pers.agree': -1 },
        result: `로렌은 외알 안경 너머로 당신을 보았다. "부모가 대신 싸워 주는 아이는 끝내 찻잔을 들지 못합니다." 다음 날, {name은} 혼자 수업에 갔다.` },
      { label: '내일 한 번만 더 해 봐', check: { stat: 'eti', dc: 75 },
        success: { effects: { 'stat.eti': +6, 'rel.loren': +6, 'pers.ambit': +2 },
          result: `사흘째에 찻물이 멎었다. 로렌은 칭찬 대신 찻잔을 하나 더 얹었다. "내일은 두 개." {name은} 집에 와서 자랑했다. "두 개래! 옆자리 애는 아직 하나야!"` },
        fail: { effects: { 'stat.eti': +3, 'rel.loren': +3, stress: +6 },
          result: `또 찻물이 흔들렸다. 그런데 수업이 끝나고 로렌이 아이 손목을 잡아 각도를 고쳐 주었다. "손목이 아니라 등으로 드는 겁니다." 처음 듣는 말이었다.` } },
      { label: '집에서 같이 연습하자', effects: { 'stat.eti': +4, trust: +5, 'rel.cube': +3, stress: +2 },
        result: `찻잔 대신 큐브가 {name}의 손바닥 위에 올라앉았다. "흔들리면 저 떨어져요, 아가씨!" 둘은 웃다가 몇 번이나 처음부터 다시 했다.` },
      { label: '보초 서던 자세를 알려 준다', conditions: ["guardian == 'knight'"], effects: { 'stat.eti': +5, 'stat.hp': +2, trust: +3, 'rel.loren': +2 },
        result: `"발바닥 세 군데로 무게를 나눠." 당신이 왕궁 보초를 서던 시절처럼 서 보이자 {name이} 따라 했다. 다음 날 로렌이 처음으로 물었다. "누가 가르쳤죠?"` },
    ],
  },
  {
    id: 'b09_dance_class_loren', title: '왈츠 수업 명단', age: [12, 15], weight: 3, requiresActivity: 'etiquette', image: 'bg/etiquette_school',
    conditions: ['!flag.dance_lessons'],
    text: `예절학교 게시판에 새 공고가 붙었다. "왈츠 반 모집 — 수강료 별도, 무용화 대여 가능." {name은} 그 앞을 세 번 지나쳤다가 네 번째에 멈춰 섰다. 집에 와서는 아무렇지 않은 척 말했다. "반 애들은 벌써 거의 다 신청했대. 나는 뭐, 별로."`,
    choices: [
      { label: '수강료를 낸다 (-120G)', conditions: ['gold >= 120'], effects: { gold: -120, 'flag.dance_lessons': true, 'stat.agi': +4, 'stat.chm': +3, trust: +3 },
        result: `첫 수업 날 {name은} 짝의 발등을 열한 번 밟았다. 로렌은 "열 번 아래로 내려오면 그때 대화합시다"라고 했다. 아이는 집에서도 거실을 빙빙 돌았다.` },
      { label: '무용화를 꺼내 준다 (-60G)', conditions: ['item.dancing_shoes >= 1', 'gold >= 60'], effects: { gold: -60, 'flag.dance_lessons': true, 'stat.agi': +5, 'stat.chm': +2, 'pers.extro': +2 },
        result: `상자에서 나온 무용화를 보고 {name이} 소리를 질렀다. "이거 신으라고 산 거였어?" 신발이 있으니 대여료를 뺀 반값이면 됐다. 로렌은 끈 매는 법부터 다시 가르쳤다.` },
      { label: '장학생으로 받아 달라고 청한다', check: { stat: 'eti', dc: 120 },
        success: { effects: { 'flag.dance_lessons': true, 'rel.loren': +6, 'stat.eti': +3, 'stat.agi': +3, stress: +4 },
          result: `로렌은 {name}의 인사를 끝까지 지켜보고 명단에 이름을 적었다. "수강료는 됐습니다. 대신 한 번이라도 빠지면 그날로 끝입니다." 아이는 한 번도 빠지지 않았다.` },
        fail: { effects: { 'flag.dance_lessons': true, 'rel.loren': +3, stress: +8, 'stat.hp': +3 },
          result: `로렌은 잠시 생각하더니 걸레를 내밀었다. "무도장 마루는 춤추는 사람이 닦는 겁니다. 어디가 미끄러운지 알아야 하니까요." {name은} 한 달 내내 무릎으로 홀을 닦았다.` } },
      { label: '별로라면 됐다', effects: { 'stat.sens': +2, 'pers.ambit': -2, trust: -2 },
        result: `"응, 별로야." {name은} 웃으며 방으로 들어갔다. 그날 밤 문틈으로 발소리가 들렸다. 하나, 둘, 셋. 하나, 둘, 셋. 아주 오래.` },
    ],
  },
  {
    id: 'b09_loren_tea_helper', title: '찻잔을 나르는 손', age: [13, 16], weight: 2.5, requiresActivity: 'etiquette', image: 'bg/etiquette_school',
    conditions: ['rel.loren >= 30', '!flag.tea_party'],
    text: `마담 로렌이 귀부인들의 티파티에 시중들 학생으로 {name을} 골랐다. 그런데 찻잔을 내려놓는 순간, 깃털 모자를 쓴 부인이 소리 내어 웃었다. "어머, 이 아이가 들판에서 주웠다는 그 애니?" 홀이 조용해졌다. 로렌의 시선이 {name}에게 머물렀다.`,
    choices: [
      { label: '미소로 받아넘긴다', check: { stat: 'eti', dc: 200, bonus: (s) => s.stats.elo * 0.2 },
        success: { effects: { 'flag.tea_party': true, 'stat.eti': +6, 'rel.loren': +8, reputation: +4 },
          result: `"네, 부인. 별이 떨어진 자리에서요. 차가 식기 전에 드세요." 부인이 입을 다물었다. 파티가 끝나고 로렌이 말했다. "다음 티파티엔 손님으로 오세요."` },
        fail: { effects: { 'stat.eti': +3, 'rel.loren': +2, stress: +8 },
          result: `웃으려 했는데 찻잔이 달그락거렸다. 로렌이 조용히 다가와 쟁반을 받아 들었다. "잠시 쉬었다 오세요." 그날 밤 {name은} 쟁반 드는 연습을 늦게까지 했다.` } },
      { label: '똑같이 되받아친다', effects: { 'stat.elo': +5, 'rel.loren': -5, reputation: -2, 'pers.agree': -2 },
        result: `"주운 게 아니라 찾은 거예요. 부인 모자의 깃털은 어디서 주우셨어요?" 시중들던 학생들이 쟁반 뒤로 웃음을 삼켰다. 로렌은 그날 끝까지 {name}에게 눈길을 주지 않았다.` },
      { label: '테오도라에게 눈짓한다', conditions: ['rel.theodora >= 35'], effects: { 'flag.tea_party': true, 'rel.theodora': +8, 'stat.eti': +3, 'pers.extro': +1 },
        result: `옆 테이블에서 시중들던 테오도라가 다가와 섰다. "부인, 이 아이는 제 라이벌이에요. 제가 주운 애한테 지겠어요?" 부인은 웃음을 거뒀고, 로렌은 두 학생을 다음 티파티 손님 명단에 올렸다.` },
      { label: '쟁반을 내려놓고 나온다', effects: { 'stat.sens': +3, 'rel.loren': -3, trust: +4, stress: +4 },
        result: `{name은} 쟁반을 내려놓고 고개 숙여 인사한 뒤 홀을 나왔다. 집에 와서 한참 말이 없다가 물었다. "{call}, 나 주운 거 맞아?" 당신은 아이를 오래 안아 주었다.` },
    ],
  },

  // ── 견습 무도회 (연쇄 ①: notice ⇒ prep ⇒ night) ─────────────────────
  {
    id: 'b09_loren_ball_notice', title: '견습 무도회의 봉투', age: [14, 16], weight: 3.5, requiresActivity: 'etiquette', npc: 'loren',
    conditions: ['stat.eti >= 150', '!flag.ball_won'],
    text: `마담 로렌이 학생들에게 봉투를 하나씩 나눠 주었다. 해마다 열리는 견습 무도회. 가장 빛난 한 명은 왕궁 봄 무도회에 로렌의 제자로 선다. {name}의 봉투에만 쪽지가 하나 더 들어 있었다. "춤은 발이 아니라 상대를 보는 일입니다. — L"`,
    choices: [
      { label: '나가 보자', effects: { 'pers.ambit': +2, stress: +4, 'rel.loren': +3 },
        result: `{name이} 봉투를 가슴에 안았다. "나 진짜 나가도 돼?" 그날부터 거실은 무도장이 되었다. 큐브가 냄비 뚜껑으로 악단을 맡았다.`, next: 'b09_loren_ball_prep' },
      { label: '아직은 이르다', effects: { 'rel.loren': -4, 'pers.ambit': -2, stress: -4 },
        result: `{name은} 봉투를 책상 서랍 깊숙이 넣었다. 다음 수업에서 로렌은 {name}의 자세를 한 번도 고쳐 주지 않았다. 집에 온 아이가 중얼거렸다. "혼나는 것보다 그게 더 싫어."` },
      { label: '춤 수업에서 배운 걸 보여 줘', conditions: ['flag.dance_lessons'], effects: { 'stat.agi': +3, 'rel.loren': +4, 'pers.extro': +2 },
        result: `{name은} 거실에서 춤 수업 때 배운 스텝을 밟아 보였다. 첫 수업 날 비틀대던 발이 이제 박자를 한 번도 놓치지 않았다. "봤지? 나 나갈래."`, next: 'b09_loren_ball_prep' },
      { label: '테오도라와 함께 연습한다', conditions: ['rel.theodora >= 25'], check: { stat: 'eti', dc: 200 },
        success: { effects: { 'stat.eti': +5, 'rel.theodora': +6, 'pers.extro': +1 },
          result: `"회전할 때 고개가 늦어. 시선부터 돌려." 테오도라는 가르쳐 주면서도 끝까지 생색을 냈다. 그 주 내내 둘은 서로의 발끝을 노려보며 연습했다. 무도회에선 다시 적이다.`, next: 'b09_loren_ball_prep' },
        fail: { effects: { 'stat.eti': +2, 'rel.theodora': +3, stress: +6 },
          result: `연습은 사흘 만에 말다툼으로 끝났다. "네 박자가 틀렸어!" "네가 빠른 거야!" 그래도 둘 다 무도회 날짜를 손가락으로 세고 있었다.`, next: 'b09_loren_ball_prep' } },
    ],
  },
  {
    id: 'b09_loren_ball_prep', title: '거울 앞의 보름', chainOnly: true, age: [14, 16],
    text: `무도회까지 보름. {name이} 옷장 앞에서 한숨을 쉬었다. 다른 학생들은 왕도 재단사를 부른다는데. 흰 하이넥 니트 소매를 만지작거리던 아이가 당신을 돌아봤다. "있는 옷으로 가면…… 이상할까?"`,
    choices: [
      { label: '아껴 둔 드레스를 꺼낸다', conditions: ['item.ball_gown >= 1'], effects: { 'flag.b09_ball_dressed': true, 'stat.chm': +4, stress: -6, trust: +2 },
        result: `상자에서 푸른 드레스가 나오자 {name이} 두 손으로 입을 막았다. "이거 계속 아껴 둔 거야?" 리본을 묶던 큐브가 자기 날개까지 묶어 버렸다.`, next: 'b09_loren_ball_night' },
      { label: '재봉 상자로 같이 고친다', conditions: ['item.sewing_kit >= 1'], effects: { 'flag.b09_ball_dressed': true, 'stat.sens': +4, 'stat.cult': +2, trust: +4 },
        result: `둘이 사흘 밤을 새워 검정 롱스커트 단에 금실로 별을 수놓았다. 화려하진 않았다. 하지만 세상에 한 벌뿐이었다.`, next: 'b09_loren_ball_night' },
      { label: '드레스를 빌린다 (-80G)', conditions: ['gold >= 80'], effects: { gold: -80, 'flag.b09_ball_dressed': true, 'stat.chm': +2, stress: -2 },
        result: `왕도 대여점에서 진청색 드레스를 빌렸다. 소매가 조금 길었다. {name은} "손 떨리는 건 소매로 숨기면 되겠다"며 웃었다.`, next: 'b09_loren_ball_night' },
      { label: '있는 옷으로 당당하게', effects: { 'stat.eti': +3, 'stat.sens': +2, 'pers.ambit': -1, stress: +4 },
        result: `{name은} 흰 니트와 검정 롱스커트를 반듯하게 다렸다. 은백색 머리를 단정히 묶자 거울 속 아이가 고개를 들었다. "로렌 선생님은 옷 말고 자세를 본댔어."`, next: 'b09_loren_ball_night' },
    ],
  },
  {
    id: 'b09_loren_ball_night', title: '샹들리에 아래', chainOnly: true, age: [14, 16], image: 'bg/ballroom',
    text: `견습 무도회 날 밤. 샹들리에 아래 열두 쌍이 차례로 홀 가운데로 나섰다. 맞은편에서 진홍 드레스의 테오도라가 부채 끝으로 {name을} 가리켰다. 로렌은 단상에서 외알 안경 너머로 홀을 내려다보았다. 음악이 시작되기 직전, {name이} 객석의 당신을 찾았다.`,
    choices: [
      { label: '고개를 끄덕여 준다', check: { stat: 'eti', dc: 280, bonus: (s) => s.stats.chm * 0.3 }, minigame: 'ball',
        success: { effects: { 'flag.ball_won': true, 'stat.eti': +8, 'stat.chm': +6, reputation: +6, 'rel.loren': +8 },
          result: `마지막 회전에서 은백색 머리가 별빛처럼 퍼졌다. 음악이 멎자 로렌이 단상에서 내려와 {name}의 손을 들어 올렸다. "봄 무도회에 데려갈 제자는 이 학생입니다."` },
        fail: { effects: { 'stat.eti': +4, 'rel.loren': +3, 'rel.theodora': +4, stress: +8 },
          result: `셋째 박자에서 발이 엇갈려 그만 무릎을 짚었다. 우승은 테오도라였다. 홀을 나서는 {name}에게 로렌이 말했다. "넘어지고도 웃으며 일어난 학생은 오늘 하나뿐이었습니다. 내년에 봅시다."` } },
      { label: '옷자락을 믿으라고 눈짓한다', conditions: ['flag.b09_ball_dressed'], check: { stat: 'chm', dc: 250, bonus: (s) => s.stats.eti * 0.3 },
        success: { effects: { 'flag.ball_won': true, 'stat.chm': +8, 'stat.eti': +4, reputation: +6, 'pers.extro': +2 },
          result: `{name이} 홀 가운데로 나서자 웅성거림이 멎었다. 금빛 반짝임이 옷자락을 따라 돌았다. 로렌이 짧게 말했다. "옷이 아니라 옷을 입은 사람이 빛났군요. 우승입니다."` },
        fail: { effects: { 'stat.chm': +3, 'rel.loren': +2, stress: +8, 'pers.ambit': -1 },
          result: `옷자락에 신경 쓰느라 박자를 놓쳤다. 로렌이 지나가며 낮게 말했다. "옷이 사람을 입으면 안 됩니다." {name은} 그 말을 오래 곱씹었다.` } },
      { label: '테오도라에게 먼저 인사하게 한다', effects: { 'rel.theodora': +8, 'stat.eti': +3, 'pers.good': +2, stress: -4 },
        result: `음악 전에 {name이} 테오도라에게 무릎을 굽혀 인사했다. 테오도라가 당황해 부채를 떨어뜨렸다. 둘 다 우승은 못 했다. 대신 처음으로 같은 마차를 타고 돌아왔다.` },
      { label: '떨리면 그만둬도 돼', conditions: ['stress >= 50'], effects: { stress: -12, trust: +4, 'rel.loren': -5, 'pers.ambit': -2 },
        result: `{name은} 한참 숨을 고르다 고개를 저었다. 로렌에게 인사하고 홀을 나왔다. 흔들리는 마차 안, 아이는 창밖 불빛을 세다 잠들었다. 무릎 위의 손은 아직 떨리고 있었다.` },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 검술도장 — 가렛
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b09_garrett_first_bout', title: '첫 대련', age: [11, 13], weight: 2.5, requiresActivity: 'sword', image: 'bg/training_yard',
    text: `가렛이 모래 마당에 선을 긋고 목검 한 자루를 {name} 발치에 던져 주었다. "오늘은 대련이다. 상대는 울릭." 도장에서 제일 덩치 큰 열다섯 살 견습생이 씩 웃었다. {name이} 목검을 주워 들고 당신 쪽을 힐끗 보았다. 가렛이 껄껄 웃었다. "겁먹어도 된다. 도망만 치지 마라."`,
    choices: [
      { label: '정면으로 붙는다', check: { stat: 'str', dc: 145, bonus: (s) => s.stats.agi * 0.3 }, minigame: 'adventure',
        success: { effects: { 'stat.str': +6, 'stat.agi': +4, 'rel.garrett': +6, 'pers.extro': +2 },
          result: `몇 번이고 모래에 구른 끝에 울릭의 목검을 쳐냈다. 가렛이 휘파람을 불었다. "운이다. 근데 운도 일어선 놈한테만 온다." 울릭이 얼얼한 손목을 털며 씩 웃었다.` },
        fail: { effects: { 'stat.str': +3, 'stat.hp': +3, 'rel.garrett': +4, stress: +6 },
          result: `모래를 몇 번이나 먹었다. 가렛이 쭈그려 앉았다. "잘 졌다. 지는 법부터 배우는 게 검술이야. 어디서 졌는지 말해 봐." {name은} 집에 와서 멍든 자리를 짚으며 복기했다.` } },
      { label: '피하면서 틈을 노린다', check: { stat: 'agi', dc: 85 },
        success: { effects: { 'stat.agi': +6, 'stat.int': +2, 'rel.garrett': +5, 'pers.good': -1 },
          result: `울릭이 휘두를 때마다 {name은} 반 발짝 옆에 있었다. 결국 울릭이 제 발에 걸려 넘어졌다. 가렛이 배를 잡고 웃었다. "여우 같은 녀석! 마음에 든다."` },
        fail: { effects: { 'stat.agi': +3, 'rel.garrett': +2, stress: +5, 'pers.extro': -1 },
          result: `피하는 데만 정신이 팔려 담벼락까지 밀렸다. "등 뒤에 벽 있는 거 알고 도망쳤냐?" 가렛의 핀잔에 {name은} 입술을 깨물었다. 다음엔 도망치지 않겠다고 했다.` } },
      { label: '칼 쥐는 법을 고쳐 준다', conditions: ["guardian == 'knight'"], effects: { 'stat.str': +3, 'stat.eti': +2, 'rel.garrett': +3, trust: +5 },
        result: `당신은 {name}의 손을 감싸 목검 쥐는 법을 고쳐 주었다. "엄지는 칼등 쪽. 숨을 내쉬면서 쳐." 가렛이 혀를 찼다. "기사 양반, 남의 도장에서 과외냐?" 말리지는 않았다. {name은} 첫 합을 버텼다.` },
      { label: '오늘은 구경만 하자', effects: { 'stat.int': +2, stress: -4, 'rel.garrett': -4, 'pers.agree': +1 },
        result: `{name은} 목검을 내려놓고 마루 끝에 앉았다. 가렛이 콧방귀를 뀌었다. "구경도 공부지. 근데 다음 주엔 안 봐준다." 울릭이 혀를 쏙 내밀었다.` },
    ],
  },
  {
    id: 'b09_garrett_footwork', title: '발만 움직여', age: [13, 15], weight: 2, requiresActivity: 'sword', npc: 'garrett',
    conditions: ['mastery.sword >= 8'],
    text: `요즘 {name은} 도장에서 돌아오면 목검을 마당에 내던진다. 한 달째 울릭에게 한 번도 못 이겼단다. 오늘은 더했다. "가렛 아저씨가 한 달 동안 검을 잡지 말래. 발만 움직이래. 나 쫓겨나는 거야?" 목소리가 갈라졌다.`,
    choices: [
      { label: '가렛을 믿고 한 달 버텨 봐', check: { stat: 'agi', dc: 140 },
        success: { effects: { 'flag.b09_footwork': true, 'stat.agi': +8, 'rel.garrett': +6, 'pers.agree': +1 },
          result: `한 달 내내 모래 위에 그은 선만 밟았다. 다음 달 첫 대련, 울릭의 목검이 닿기 전에 {name은} 이미 거기 없었다. 가렛이 턱을 쓰다듬었다. "그래. 검은 발이 휘두르는 거다."` },
        fail: { effects: { 'stat.agi': +4, 'rel.garrett': +3, stress: +6 },
          result: `보름째에 몰래 목검을 잡았다가 들켰다. 가렛은 화내지 않았다. "그래, 아직이다. 처음부터 다시." {name은} 고개를 숙이고 모래 위 선 앞에 다시 섰다.` } },
      { label: '가렛에게 이유를 묻는다', effects: { 'stat.agi': +5, 'stat.int': +2, 'rel.garrett': +4, trust: +2 },
        result: `가렛이 술잔을 비우고 한참 만에 입을 뗐다. "애가 칼끝만 봐. 칼끝 보는 놈은 칼끝에 진다. 말로 하면 머리만 알아듣지." 그날 밤 당신은 말없이 마당에 선 몇 개를 그어 주었다.` },
      { label: '산길을 같이 걷자', conditions: ["guardian == 'adventurer'"], effects: { 'stat.agi': +6, 'stat.hp': +4, trust: +4, gHealth: -2 },
        result: `당신은 아이를 데리고 바위투성이 산길을 걸었다. 발이 먼저 길을 읽었다. "{call}, 이거 아저씨가 시킨 거랑 똑같아." 가렛의 옛 동료답게, 당신은 웃기만 했다.` },
      { label: '다른 도장으로 옮기자', effects: { 'rel.garrett': -5, 'pers.agree': -2, 'pers.ambit': +2, stress: -3 },
        result: `{name은} 잠깐 솔깃한 얼굴이더니 고개를 저었다. "아니. 옮기면 진 거잖아." 다음 날 아이는 도장에 갔다. 당신이 도장을 옮기자고 했다는 말을 전해 들은 가렛은 한동안 당신을 못 본 척했다.` },
    ],
  },

  // ── 도장 대항전 (연쇄 ②: tourney ⇒ shoulder ⇒ final) ────────────────
  {
    id: 'b09_sword_tourney', title: '도장 대항전', age: [14, 16], weight: 2.5, requiresActivity: 'sword', npc: 'garrett',
    conditions: ['stat.str >= 200'],
    text: `왕도 견습 도장과 항구 도장의 대항전이 열린다. 가렛이 출전자 명단 맨 끝에 {name}의 이름을 적었다. "나가서 져 봐라. 지는 것도 무대에서 져 봐야 안다." 그런데 그날 밤, {name이} 왼쪽 어깨를 자꾸 주무르는 게 보였다.`,
    choices: [
      { label: '출전을 허락한다', effects: { 'pers.ambit': +2, 'rel.garrett': +3, stress: +4 },
        result: `"진짜? 진짜지?" {name이} 목검을 끌어안고 마당을 한 바퀴 돌았다. 어깨 이야기는 꺼내지도 않았다.`, next: 'b09_sword_shoulder' },
      { label: '왕도 도장의 버릇을 알려 준다', conditions: ["guardian == 'knight'"], effects: { 'stat.int': +3, 'stat.agi': +2, trust: +3 },
        result: `"왕도 녀석들은 셋째 합에 꼭 오른발이 나온다. 내가 거기서 배웠거든." {name이} 눈을 반짝이며 받아 적었다. 그러다 어깨를 움찔했다.`, next: 'b09_sword_shoulder' },
      { label: '이번엔 건너뛰자', effects: { 'rel.garrett': -3, 'pers.ambit': -2, stress: -5, 'stat.hp': +2 },
        result: `{name은} 한참 말이 없더니 고개를 끄덕였다. 대항전 날 도장 담장 너머에서 함성이 들렸다. 아이는 마당에서 혼자 목검을 휘둘렀다.` },
    ],
  },
  {
    id: 'b09_sword_shoulder', title: '감춘 어깨', chainOnly: true, age: [14, 16],
    text: `대항전 사흘 전. 빨래를 개다 {name}의 셔츠 소매에서 약초 붕대가 떨어졌다. 아이가 황급히 주워 숨겼다. "별거 아냐. 울릭이랑 연습하다 좀 삐끗했어. 가렛 아저씨가 알면 명단에서 뺄 거야. 제발, 비밀로 해 줘."`,
    choices: [
      { label: '가렛에게 말한다', effects: { 'stat.hp': +4, 'rel.garrett': +4, trust: -4, stress: +6 },
        result: `가렛은 붕대를 보고 한숨을 쉬었다. "바보. 오른손으로만 싸워라. 한 팔 기사도 기사다." {name은} 당신을 노려봤지만 그날 밤 찜질은 순순히 받았다.`, next: 'b09_sword_final' },
      { label: '비밀로 해 준다', effects: { 'flag.b09_shoulder_hidden': true, trust: +5, 'stat.hp': -4, stress: +4 },
        result: `"고마워." 그날부터 {name은} 밤마다 몰래 어깨에 찬 수건을 댔다. 당신은 모른 척 빨랫줄에 수건 한 장을 더 걸어 두었다.`, next: 'b09_sword_final' },
      { label: '엘다에게 데려간다', conditions: ['flag.met_elda'], effects: { 'stat.hp': +3, 'stat.mag': +2, 'rel.elda': +4, trust: +3 },
        result: `엘다가 어깨를 짚어 보고 쓴 약초를 덧발랐다. "사흘이면 붓기는 빠져요. 대신 대항전 다음 날은 꼭 쉬기예요." {name이} 엘다와 새끼손가락을 걸었다.`, next: 'b09_sword_final' },
      { label: '기권시킨다', effects: { 'stat.hp': +5, trust: -6, stress: +8, 'pers.agree': -2 },
        result: `"{call} 미워!" 대항전 날 아이는 방에서 나오지 않았다. 저녁에 가렛이 찾아와 문 너머로 말했다. "몸 아끼는 것도 실력이다. 내년에 나와." 문이 아주 조금 열렸다.` },
    ],
  },
  {
    id: 'b09_sword_final', title: '모래 위의 결승', chainOnly: true, age: [14, 16], image: 'bg/training_yard',
    text: `대항전 날, 이변이 이어졌다. 명단 맨 끝의 이름이 결승까지 올라온 것이다. 상대는 왕도 도장의 에드릭, 근위대장이 눈여겨본다는 소년이다. 가렛이 {name}의 목검 손잡이에 천을 감아 주며 낮게 말했다. "끝날 때까지 끝난 게 아니다. 그거 하나만 기억해."`,
    choices: [
      { label: '끝까지 맞서라', check: { stat: 'str', dc: 340, bonus: (s) => s.stats.agi * 0.3 - (s.flags?.b09_shoulder_hidden ? 30 : 0) }, minigame: 'adventure',
        success: { effects: { 'flag.b09_tourney_won': true, 'stat.str': +8, 'stat.agi': +5, reputation: +6, 'rel.garrett': +8 },
          result: `마지막 합에서 에드릭의 목검이 모래 위로 날아갔다. 객석의 근위대장이 일어섰다. 가렛은 말없이 {name을} 번쩍 들어 어깨에 태웠다. 아이는 웃다가 끝내 울음을 터뜨렸다.` },
        fail: { effects: { 'stat.str': +4, 'rel.garrett': +4, reputation: +2, stress: +8 },
          result: `마지막 합에서 무릎이 꺾였다. 에드릭이 손을 내밀어 일으켜 주었다. "내년엔 내가 질지도 몰라." 가렛이 {name}의 머리를 거칠게 쓰다듬었다. "준우승이다, 꼬맹이. 오늘은 내가 산다."` } },
      { label: '발로 싸워라', conditions: ['flag.b09_footwork'], check: { stat: 'agi', dc: 200, bonus: (s) => s.stats.str * 0.2 },
        success: { effects: { 'flag.b09_tourney_won': true, 'stat.agi': +8, 'stat.str': +4, reputation: +6, 'rel.garrett': +8 },
          result: `에드릭의 검은 번번이 허공을 갈랐다. 한 달 동안 밟은 모래 위의 선이 {name}의 발밑에 있었다. 마지막에 목검 끝이 에드릭의 가슴 앞에서 멈췄다. 가렛이 크게 웃었다.` },
        fail: { effects: { 'stat.agi': +4, 'rel.garrett': +4, stress: +6, 'pers.ambit': +1 },
          result: `발은 빨랐지만 에드릭도 빨랐다. 아깝게 졌다. 가렛이 모래 위 발자국을 내려다보며 말했다. "발은 됐다. 이제 검이 발을 따라오면 된다." 아이가 고개를 끄덕였다.` } },
      { label: '한 판을 즐기고 와', effects: { 'stat.agi': +3, trust: +3, stress: -6, 'pers.ambit': -1, 'rel.garrett': +2 },
        result: `{name은} 이기려 하지 않았다. 대신 에드릭의 검을 끝까지 보았다. 졌지만 웃으며 내려왔다. "다음엔 저 녀석 버릇 다 알 것 같아." 가렛이 혀를 차면서 웃었다.` },
      { label: '아프면 멈추자고 신호를 정한다', conditions: ['flag.b09_shoulder_hidden'], effects: { 'stat.hp': +3, 'stat.moral': +2, trust: +6, stress: -2, 'rel.garrett': +2 },
        result: `셋째 합에서 {name이} 당신을 보았다. 당신은 손바닥을 펴 보였다. 아이가 목검을 내려놓고 고개를 숙였다. 에드릭은 의아해했지만, 가렛은 알았다는 듯 고개를 끄덕였다.` },
    ],
  },
  {
    id: 'b09_garrett_last', title: '마지막 수업', age: [16, 17], weight: 3, requiresActivity: 'sword', npc: 'garrett',
    conditions: ['rel.garrett >= 50', 'mastery.sword >= 15'],
    text: `가렛이 당신과 {name을} 텅 빈 도장으로 불렀다. 목검 대신 날을 죽인 검 두 자루가 놓여 있었다. "더 가르칠 게 없다. 그러니 오늘은 내가 배울 차례다. 진심으로 와라. 봐주면 파문이다." 늘 웃던 얼굴이 웃지 않았다. {name이} 검을 쥐고 숨을 골랐다.`,
    choices: [
      { label: '전력으로 맞선다', check: { stat: 'str', dc: 500, bonus: (s) => s.stats.agi * 0.3 },
        success: { effects: { 'stat.str': +10, 'stat.agi': +6, 'rel.garrett': +10, 'pers.ambit': +2 },
          result: `서른 합째에 가렛의 검이 멈췄다. {name}의 검 끝이 그의 목 앞 한 뼘에 있었다. 가렛이 검을 내리고 고개를 숙였다. "……스승 노릇은 이걸로 끝이다. 이제 동료다."` },
        fail: { effects: { 'stat.str': +5, 'stat.hp': +4, 'rel.garrett': +6, stress: +6 },
          result: `스무 합을 버티고 모래 위에 누웠다. 가렛이 손을 내밀었다. "작년보다 열 합 더 버텼다. 그거면 됐다." 그날 처음으로 가렛은 자기 검의 이름을 {name}에게 알려 주었다.` } },
      { label: '검 대신 이야기를 청한다', effects: { 'rel.garrett': +6, 'stat.moral': +4, 'stat.cult': +2, 'pers.roman': +1 },
        result: `{name이} 검을 내려놓았다. "아저씨는 왜 검을 잡았어?" 가렛은 한참 하늘을 보았다. "지키고 싶은 게 있었는데 못 지켰다. 그래서 너한텐 지키는 법만 가르쳤지."` },
      { label: '도장 문을 열어 모두 보게 한다', conditions: ['flag.b09_tourney_won'], effects: { reputation: +5, 'rel.garrett': +5, 'stat.str': +5, 'pers.extro': +2 },
        result: `대항전 우승자와 용병단장의 대련 소식에 항구 사람들이 담장에 매달렸다. 승부는 비겼다. "내가 봐준 거다. 알지?" 아이도 웃었다. "알아. 나도 봐준 거야."` },
      { label: '당신이 심판을 본다', conditions: ["guardian == 'knight'"], effects: { trust: +5, 'rel.garrett': +4, 'stat.eti': +3, 'stat.str': +3 },
        result: `당신이 심판을 맡았다. 옛날 왕궁 연무장에서처럼. 대련이 끝나자 가렛이 당신에게 말했다. "기사 양반, 네 딸 검 끝이 꼭 네 검 끝을 닮았다." {name이} 머쓱하게 웃었다.` },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 마법탑 — 아델 학사
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b09_tower_candles', title: '백 개의 촛불', age: [11, 13], weight: 2.5, requiresActivity: 'magic', image: 'bg/tower',
    text: `마법탑 견습반 촛불 실습. 촛불 하나를 켜는 게 과제였다. {name이} 손을 내밀자 강의실 촛불 백 개가 한꺼번에 피어올랐다. 금빛 별 부스러기가 천장까지 떠올랐다. 잉크투성이 손의 아델 학사가 안경을 벗었다. "……보호자분, 잠깐 이야기 좀 하시죠."`,
    choices: [
      { label: '아델 학사에게 맡긴다', effects: { 'flag.b09_adel_mentor': true, 'stat.mag': +6, 'stat.int': +3, stress: +3 },
        result: `아델 학사는 탑 위층에 보고하지 않았다. 대신 매주 한 시간씩 촛불 하나만 켜는 연습을 따로 시켰다. "백 개는 누구나 놀랍니다. 하나만 켜는 게 진짜 어려운 거예요."` },
      { label: '어른들 앞에서 다시 해 보인다', check: { stat: 'mag', dc: 85 },
        success: { effects: { 'stat.mag': +6, reputation: +4, 'pers.ambit': +3, trust: -2, stress: +6 },
          result: `탑의 어른들이 줄지어 {name을} 구경하러 왔다. 촛불은 이번에도 백 개 모두 켜졌다. 박수가 쏟아졌다. 돌아오는 길, 아이는 이상하게 말이 없었다.` },
        fail: { effects: { 'stat.mag': +3, trust: -3, stress: +10, 'pers.extro': -2 },
          result: `어른들이 지켜보자 손끝이 떨렸다. 촛불 대신 커튼 끝이 그을렸다. 누군가 혀를 찼다. {name은} 집에 오는 내내 당신 소매만 붙잡고 걸었다.` } },
      { label: '엘다에게 먼저 보여 준다', conditions: ['flag.met_elda'], effects: { 'stat.mag': +5, 'stat.sens': +3, 'rel.elda': +6, 'pers.roman': +1 },
        result: `엘다가 아이 손바닥에 자기 손을 겹쳤다. "불을 켜는 게 아니라, 불에게 부탁하는 거예요." 다음 실습에서 {name은} 촛불 하나만 켰다. 아델 학사가 또 안경을 벗었다.` },
      { label: '아델에게 입단속을 부탁한다', conditions: ['flag.magic_hidden'], effects: { 'flag.b09_adel_mentor': true, 'stat.mag': +4, 'stat.int': +2, 'pers.extro': -2, stress: +4 },
        result: `사정을 듣던 아델 학사가 강의실 문을 닫았다. "숨기는 법도 가르쳐 드리죠. 다만 덮어 둔 불은 안에서 탑니다." 그날부터 {name은} 촛불 앞에서 늘 한 박자 늦게 손을 내밀었다.` },
    ],
  },
  {
    id: 'b09_tower_exam', title: '견습 진급 시험', age: [13, 15], weight: 3, requiresActivity: 'magic', image: 'bg/tower',
    conditions: ['stat.mag >= 90'],
    text: `마법탑 견습생 진급 시험. 필기는 별자리 마법진 서른 개를 외워 그리기, 실기는 물 한 컵을 얼음꽃으로 바꾸기. {name은} 사흘째 마법진 종이를 깔고 엎드려 잠들었다. 아델 학사가 귀띔했다. "둘 중 하나만 잘해도 붙어요. 둘 다 잘하면 이름이 남고요."`,
    choices: [
      { label: '필기에 걸어 보자', check: { stat: 'int', dc: 260 }, minigame: 'exam',
        success: { effects: { 'stat.int': +8, 'stat.mag': +4, reputation: +3, 'pers.ambit': +1 },
          result: `서른 개의 마법진 중 틀린 별이 하나도 없었다. 학사들이 답안지를 돌려 보았다. 진급 명단 첫 줄에 {name}의 이름이 올라갔다.` },
        fail: { effects: { 'stat.int': +4, stress: +8, 'pers.ambit': -1 },
          result: `스물아홉째 마법진에서 별 하나를 빠뜨렸다. 아슬아슬하게 떨어졌다. 아델 학사가 답안지 뒤에 적어 주었다. "별 하나 차이. 다음엔 붙습니다."` } },
      { label: '실기에 걸어 보자', check: { stat: 'mag', dc: 170 },
        success: { effects: { 'stat.mag': +8, 'stat.sens': +3, reputation: +2, 'pers.roman': +1 },
          result: `컵 속 물이 소리 없이 얼어 꽃잎 여섯 장이 되었다. 시험관이 얼음꽃을 오래 들여다보았다. "이 모양은 가르친 적이 없는데……." 합격이었다.` },
        fail: { effects: { 'stat.mag': +4, 'stat.hp': -2, stress: +6, 'pers.ambit': -1 },
          result: `물은 얼지 않고 끓어 넘쳤다. 시험관 소매가 흠뻑 젖었다. {name은} 집에 와서 물컵을 앞에 두고 밤새 노려보았다.` } },
      { label: '시험은 내년에 보자', effects: { stress: -10, trust: +3, 'pers.ambit': -2, 'stat.mag': +2 },
        result: `{name은} 책을 덮고 사흘 내리 잤다. 나흘째 아침, 스스로 책을 다시 폈다. "내년엔 둘 다 붙을 거야. 이름 남길 거야."` },
      { label: '아델 학사의 오답 노트', conditions: ['flag.b09_adel_mentor'], effects: { 'stat.int': +4, 'stat.mag': +4, reputation: +2, stress: +5, 'pers.agree': +1 },
        result: `아델 학사가 자기 견습 시절 오답 노트를 빌려주었다. 틀린 별마다 빨간 동그라미. 시험장에서 {name은} 그 동그라미들을 떠올렸다. 필기도 실기도 붙었다.` },
    ],
  },
  {
    id: 'b09_tower_slump', title: '꺼진 별빛', age: [14, 17], weight: 2.5, requiresActivity: 'magic', image: 'bg/tower',
    conditions: ['stat.mag >= 150'],
    text: `어느 날부터 {name}의 손끝에서 별빛이 나오지 않았다. 촛불 하나도 켜지지 않는다. 탑에서 돌아오면 방문을 잠근다. 문 너머로 작은 목소리가 들렸다. "{call}, 나 이제 별의 아이가 아닌가 봐. 그럼 나는 뭐야?"`,
    choices: [
      { label: '한 달만 마법을 잊고 지내자', effects: { stress: -12, trust: +4, 'stat.mag': -3, 'pers.roman': +1 },
        result: `한 달 동안 둘은 강가를 걷고 빵을 구웠다. 어느 저녁 오븐 불을 보며 웃는 {name}의 손끝에서 작은 별 하나가 반짝 떠올랐다. 아이는 못 보았다. 당신만 보았다.` },
      { label: '더 오래 연습하면 돌아올 거야', check: { stat: 'mag', dc: 210 },
        success: { effects: { 'stat.mag': +8, stress: +8, trust: -2, 'pers.ambit': +2 },
          result: `{name은} 밤마다 촛불 앞에 앉았다. 보름째, 불꽃 하나가 겨우 켜졌다. 아이는 기뻐하지 않았다. "켜졌어." 그 한마디뿐이었다.` },
        fail: { effects: { 'stat.mag': +2, stress: +12, trust: -5, 'pers.agree': -2 },
          result: `한 달을 매달려도 불은 켜지지 않았다. 어느 밤 {name이} 촛대를 벽에 던졌다. "연습하면 된다며!" 당신은 깨진 촛대를 말없이 주웠다.` } },
      { label: '엘다를 찾아간다', conditions: ['flag.met_elda'], effects: { 'stat.mag': +5, 'stat.sens': +4, 'rel.elda': +6, stress: -6 },
        result: `엘다가 차를 끓이며 말했다. "제 제자 하나도 열다섯에 별빛을 잃은 적이 있어요. 마음이 자라느라 잠깐 자리를 비운 거예요." 찻잔을 쥔 {name}의 손끝이 희미하게 빛났다.` },
      { label: '넌 별이기 전에 내 아이야', conditions: ['flag.knows_origin'], effects: { trust: +6, stress: -10, 'stat.sens': +3, 'stat.mag': +3 },
        result: `문이 열렸다. {name이} 당신 품에 이마를 묻었다. "알아. 그냥 한 번 더 듣고 싶었어." 이튿날 아침, 식탁 위 촛불이 저절로 켜졌다. 둘 다 모른 척했다.` },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 예술원 — 펠릭스 선생(그림) · 올가 선생(무용)
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b09_art_portrait', title: '난롯가의 그림', age: [10, 12], weight: 2, requiresActivity: 'art',
    text: `예술원 펠릭스 선생이 그림 한 장을 들고 찾아왔다. 당신이 난롯가에서 졸고 있는 그림이었다. 삐뚤빼뚤한 선인데 이상하게 따뜻했다. "왕도 어린이 미술전에 내고 싶습니다." 뒤에서 {name이} 그림을 낚아챘다. "안 돼! 이건 {call} 거야!"`,
    choices: [
      { label: '아이 뜻대로 집에 건다', effects: { trust: +6, 'stat.sens': +3, 'pers.roman': +2 },
        result: `그림은 당신 침대 머리맡에 걸렸다. 펠릭스 선생은 아쉬운 듯 수염을 쓸었다. "그럼 미술전엔 다른 걸 그려 오너라. 잘 그린 것 말고, 이만큼 좋아하는 것."` },
      { label: '설득해서 출품한다', check: { stat: 'sens', dc: 85 },
        success: { effects: { 'stat.sens': +6, reputation: +4, gold: +50, 'pers.ambit': +2, trust: -1 },
          result: `그림은 은상을 받았다. {name은} 상금을 쪼개 당신에게 털모자를 사 왔다. "그림 속 {call}, 모자가 없어서 추워 보였어."` },
        fail: { effects: { 'stat.sens': +3, trust: -3, stress: +4 },
          result: `입상하지 못했다. 돌아온 그림 귀퉁이가 접혀 있었다. {name은} 그걸 펴며 말했다. "그러니까 내 거라고 했잖아." 당신은 사과하고 액자를 사 왔다.` } },
      { label: '똑같이 하나 더 그려 보자', effects: { 'stat.sens': +4, 'stat.cult': +2, stress: +3, 'pers.roman': -1 },
        result: `{name은} 사흘 동안 같은 그림을 다시 그렸다. 두 번째 그림은 더 반듯했다. 펠릭스 선생은 첫 번째가 낫다고 했다. "왜 처음 게 나아?" 아이는 그 질문을 오래 붙들었다.` },
    ],
  },
  {
    id: 'b09_art_dance', title: '창문 너머의 무용실', age: [12, 15], weight: 2.5, requiresActivity: 'art',
    conditions: ['!flag.dance_lessons'],
    text: `예술원 복도 끝 무용실. 그림 수업이 끝나면 {name은} 늘 그 창문 앞에 서 있었다. 오늘은 지팡이를 짚은 올가 선생이 문을 열었다. 한때 왕도 무대를 누빈 무희다. "구경은 공짜지만, 따라 하는 발은 수강료를 내야 한단다." 그러고는 윙크했다.`,
    choices: [
      { label: '정식으로 등록한다 (-100G)', conditions: ['gold >= 100'], effects: { gold: -100, 'flag.dance_lessons': true, 'stat.agi': +4, 'stat.sens': +3, 'pers.roman': +1 },
        result: `올가 선생은 첫날 음악 없이 춤추게 했다. "음악은 네 안에 있는 걸 먼저 찾고 나서." {name은} 집에 와서도 숟가락으로 식탁에 박자를 쳤다.` },
      { label: '그림 시간을 쪼개 보자', effects: { 'flag.dance_lessons': true, 'stat.agi': +4, 'stat.chm': +2, 'stat.sens': -3, 'pers.extro': +2 },
        result: `두 선생이 의논 끝에 수업을 반씩 나눠 주었다. 이젤 앞의 시간 절반이 무용실 거울 앞으로 옮겨 갔다. 펠릭스 선생은 서운한 눈치였다. 그래도 {name}의 스케치북엔 이제 춤추는 사람이 가득했다.` },
      { label: '한 번 따라 해 보라고 한다', check: { stat: 'agi', dc: 90, bonus: (s) => s.stats.sens * 0.15 },
        success: { effects: { 'flag.dance_lessons': true, 'stat.agi': +6, reputation: +2, 'pers.extro': +2 },
          result: `올가 선생이 지팡이로 바닥을 두 번 쳤다. "수강료는 됐다. 대신 내 다리가 되어 주렴. 이 지팡이로는 시범을 못 보이거든." {name은} 대답 대신 한 바퀴를 더 돌았다.` },
        fail: { effects: { 'stat.agi': +2, 'stat.sens': +2, stress: +4, 'pers.extro': -1 },
          result: `따라 하던 발이 꼬여 엉덩방아를 찧었다. 올가 선생이 손을 내밀었다. "넘어지는 것도 춤이야. 또 오렴." {name은} 얼굴이 빨개져 도망쳤다. 다음 날 또 창문 앞에 서 있었지만.` } },
      { label: '구경만 해도 충분하잖아', effects: { 'stat.sens': +3, 'pers.roman': +2, 'pers.ambit': -1, stress: -3 },
        result: `{name은} 창문 앞에 서는 걸 그만두지 않았다. 다만 이제 스케치북을 들고 섰다. 그림 속 무희들은 모두 지팡이를 든 할머니를 닮았다.` },
    ],
  },
  {
    id: 'b09_art_ugly', title: '못난 그림 열 장', age: [14, 16], weight: 2.5, requiresActivity: 'art',
    conditions: ['stat.sens >= 220'],
    text: `{name}의 방바닥이 구겨진 종이로 덮였다. 자로 잰 듯 반듯한 그림만 그려 온 아이에게 펠릭스 선생이 숙제를 냈단다. 일부러 못난 그림 열 장. "못나게 그려지질 않아. 자꾸 예뻐져. 선생님은 내 그림이 죽었대." 붓을 쥔 손등이 하얗게 질려 있었다.`,
    choices: [
      { label: '같이 왼손으로 그려 보자', effects: { 'stat.sens': +6, trust: +4, stress: -6, 'pers.roman': +2 },
        result: `둘이 왼손으로 서로의 얼굴을 그렸다. 눈이 셋, 코는 옆으로 갔다. {name이} 배를 잡고 바닥을 굴렀다. 그 그림이 열 장 중 첫 장이 되었다.` },
      { label: '숙제를 바꿔 달라고 한다', effects: { 'stat.sens': +2, 'pers.agree': -1, trust: +2, stress: +4 },
        result: `펠릭스 선생은 고개를 저었다. "바꿔 주면 이 아이는 평생 예쁜 그림만 그릴 겁니다. 그건 재능을 버리는 일이에요." 그날 밤 {name은} 종이를 한 장 더 구겼다.` },
      { label: '류트를 아무렇게나 쳐 봐', conditions: ['item.lute >= 1'], effects: { 'stat.sens': +5, 'stat.chm': +2, stress: -8, 'pers.roman': +2 },
        result: `붓을 내려놓고 류트를 잡자 손이 먼저 틀린 음을 냈다. 틀린 음이 재밌어서 또 틀렸다. 다음 날 {name은} 틀린 음 같은 그림 열 장을 들고 예술원에 갔다.` },
      { label: '장터에 가서 그려 봐', check: { stat: 'sens', dc: 340 },
        success: { effects: { 'stat.sens': +10, 'stat.cult': +3, reputation: +2, 'pers.extro': +1 },
          result: `생선 장수, 졸고 있는 개, 이 빠진 항아리. 펠릭스 선생은 열 장을 넘기다 마지막 장에서 멈췄다. "살아 있네." {name}의 얼굴이 별빛처럼 환해졌다.` },
        fail: { effects: { 'stat.sens': +4, stress: +6, 'pers.ambit': -1 },
          result: `장터 그림도 자꾸 반듯해졌다. 펠릭스 선생은 "아직"이라고만 했다. {name은} 처음으로 선생님 얼굴을 그렸다. 일부러, 아주 못나게.` } },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 신학교 — 오틸리아 수녀
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b09_theo_question', title: '누가 나를 빚었어요', age: [11, 13], weight: 2.5, requiresActivity: 'theology', image: 'bg/church',
    text: `신학교 교리 시간. "모든 사람은 신의 손으로 빚어졌습니다." 오틸리아 수녀의 말에 {name이} 손을 들었다. "저는 하늘에서 떨어졌는데요. 그럼 저는 누가 빚었어요?" 교실이 술렁였다. 저녁에 온 수녀의 쪽지엔 한 줄뿐이었다. "이 질문엔 보호자께서 함께 답해 주세요."`,
    choices: [
      { label: '어디서 왔든 우리 집 아이야', effects: { trust: +5, 'stat.sens': +3, 'stat.faith': -1, 'pers.roman': +1 },
        result: `{name은} 한참 생각하더니 고개를 끄덕였다. "그럼 됐어." 다음 교리 시간에 아이는 질문 대신 그림을 그렸다. 굴뚝에서 연기가 나는 집, 창가에 사람 둘과 네모난 무언가 하나.` },
      { label: '수녀님과 같이 답을 찾아보자', effects: { 'stat.faith': +5, 'stat.moral': +3, trust: +2, stress: +2 },
        result: `오틸리아 수녀가 당신과 아이를 성당 뒤뜰로 데려갔다. "저도 답을 몰라요. 그래서 기도하죠. 답이 없을 때 하는 게 기도랍니다." {name이} 처음으로 두 손을 모았다.` },
      { label: '사제였던 당신이 답한다', conditions: ["guardian == 'priest'"], effects: { 'stat.faith': +6, 'stat.cult': +2, trust: +5 },
        result: `"별도 신이 빚으셨지. 그러니 별에서 온 너는 두 번 빚어진 셈이야." {name이} 눈을 동그랗게 떴다. "두 번? 그럼 나 엄청 귀한 거네?" 그날부터 아이의 기도엔 별 이야기가 붙었다.` },
      { label: '스스로 답을 찾아보게 한다', check: { stat: 'int', dc: 95, bonus: (s) => s.stats.faith * 0.2 },
        success: { effects: { 'stat.int': +4, 'stat.faith': +4, reputation: +1, 'pers.extro': +1 },
          result: `다음 수업에서 {name이} 다시 손을 들었다. "하늘도 신이 빚었으면, 하늘이 저를 빚은 것도 결국 신이 한 거죠?" 오틸리아 수녀가 웃음을 참으며 출석부에 별을 그렸다.` },
        fail: { effects: { 'stat.faith': +2, stress: +5, 'pers.agree': -1 },
          result: `사흘을 생각해도 답이 안 나왔다. "모르는 걸 왜 물어보게 해." {name은} 교리책을 베개 밑에 넣고 잤다. 그래도 버리지는 않았다.` } },
    ],
  },
  {
    id: 'b09_theo_bread', title: '명단에 없는 집', age: [13, 16], weight: 2.5, requiresActivity: 'theology', image: 'bg/church',
    text: `신학교 학생들이 성당 빵을 나눠 주는 날, 명단에서 지워진 집이 하나 있었다. 그 집 가장이 헌금함에 손을 댔다고 했다. 그날 밤 {name은} 오틸리아 수녀가 그 집 문 앞에 몰래 빵을 두고 가는 걸 보았다. 수녀가 손가락을 입술에 댔다. "못 본 걸로 해 줄래요?"`,
    choices: [
      { label: '함께 빵을 나르게 한다', effects: { 'stat.moral': +6, 'stat.faith': +3, 'pers.good': +3, stress: +4 },
        result: `그 뒤로 밤마다 두 사람의 그림자가 골목을 지났다. 어느 날 그 집 아이가 문틈으로 {name}에게 손을 흔들었다. 문고리에 마른 꽃 한 송이가 걸려 있었다.` },
      { label: '규칙은 규칙이라고 말하게 한다', effects: { 'stat.faith': +4, 'stat.moral': -2, 'pers.agree': +2, reputation: +2 },
        result: `{name은} 명단은 명단이라고 말했다. 수녀는 고개를 끄덕였을 뿐 따지지 않았다. 다음 주부터 그 집 문 앞엔 빵이 없었다. {name은} 그 골목을 돌아서 다녔다.` },
      { label: '대주교께 다시 보자고 청한다', check: { stat: 'elo', dc: 150, bonus: (s) => s.stats.faith * 0.2 },
        success: { effects: { 'stat.elo': +5, 'stat.moral': +4, reputation: +4, 'pers.good': +2 },
          result: `대주교는 어린 학생의 청원을 끝까지 들었다. "허물은 아비에게 있고, 배고픔은 아이에게 있구나." 그 집 이름이 명단에 다시 올랐다. 오틸리아 수녀가 {name을} 꼭 안았다.` },
        fail: { effects: { 'stat.elo': +2, 'stat.moral': +3, stress: +6, 'pers.good': +1 },
          result: `대주교의 서기가 청원서를 받아 들고 "검토하겠다"고만 했다. 소식은 오지 않았다. {name은} 그날 밤 오틸리아 수녀와 함께 빵 바구니를 들었다.` } },
      { label: '그 집 몫을 대신 낸다 (-60G)', conditions: ['gold >= 60'], effects: { gold: -60, 'stat.moral': +3, 'pers.good': +2, trust: +3 },
        result: `당신은 헌금함에 그 집 이름으로 60G를 넣었다. 다음 날 명단 맨 끝에 이름이 다시 적혔다. {name이} 그걸 보고 당신 소매를 꼭 잡았다.` },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 상업학원 — 코벤 원장
  // ════════════════════════════════════════════════════════════════════
  // ── 모의 장터 (연쇄 ③: mock_market ⇒ mock_market_close) ─────────────
  {
    id: 'b09_mock_market', title: '닷새짜리 가게', age: [12, 13], weight: 2.5, requiresActivity: 'commerce', image: 'bg/market',
    text: `상업학원 코벤 원장이 학생마다 50G씩 나눠 주었다. "닷새 동안 장터에서 굴려 보거라. 가장 잘 굴린 학생은 상인 길드 견학을 보내 주마." 생선 장수 아들 핍은 벌써 셈 구슬을 튕기고 있다. {name이} 동전 주머니를 쥐고 물었다. "{call}, 뭘 팔지?"`,
    choices: [
      { label: '흠집 난 사과를 떼어 와', effects: { 'stat.elo': +4, 'stat.hp': +2, 'pers.roman': -1 },
        result: `새벽 과수원에서 흠집 난 사과를 싸게 떼어 왔다. 닦고 광을 내니 그럴듯했다. 닷새 뒤 손에 남은 건 동전 한 줌과 굳은살 박인 손바닥이었다.`, next: 'b09_mock_market_close' },
      { label: '아무도 안 파는 걸 팔아 봐', check: { stat: 'sens', dc: 80, bonus: (s) => s.stats.chm * 0.2 },
        success: { effects: { 'stat.sens': +4, gold: +30, 'pers.ambit': +2 },
          result: `{name은} 별 그림 엽서 노점을 차렸다. 첫날은 하나도 안 팔렸다. 둘째 날 아이들이 몰려왔다. 셋째 날엔 핍이 따라 했다.`, next: 'b09_mock_market_close' },
        fail: { effects: { 'stat.sens': +2, gold: -20, stress: +4 },
          result: `별 그림 엽서는 닷새 동안 다섯 장 팔렸다. 그중 두 장은 큐브가 샀다. {name은} 남은 엽서를 방 벽에 빼곡히 붙였다.`, next: 'b09_mock_market_close' } },
      { label: '핍과 동업하면 어때', effects: { 'stat.elo': +3, 'stat.int': +2, 'pers.extro': +2 },
        result: `핍은 셈이 빠르고 {name은} 말이 빨랐다. 생선 장수 아들과 은발 소녀의 노점은 장터에서 제일 시끄러웠다. 손님도 제일 많았다.`, next: 'b09_mock_market_close' },
      { label: '옛 거래처를 귀띔해 준다', conditions: ["guardian == 'merchant'"], effects: { 'stat.elo': +3, gold: +20, trust: +2 },
        result: `"가서 '은퇴한 영감이 보냈다'고 해라." 항구 건어물상은 웃으며 반값에 물건을 넘겨주었다. {name이} 당신을 새삼스럽게 올려다보았다.`, next: 'b09_mock_market_close' },
    ],
  },
  {
    id: 'b09_mock_market_close', title: '닷새째 저녁의 장부', chainOnly: true, age: [12, 13], image: 'bg/guild_hall',
    text: `닷새째 저녁. 학생들이 장부를 들고 강당에 줄을 섰다. 코벤 원장은 돈보다 장부를 먼저 본다. 한 줄이라도 안 맞으면 실격. 그런데 {name}의 장부는 지운 자국투성이에, 어딘가에서 3G가 비었다. 줄 맨 앞에서 핍이 엄지를 들어 보였다.`,
    choices: [
      { label: '처음부터 다시 맞춰 봐', check: { stat: 'int', dc: 180, bonus: (s) => s.stats.elo * 0.2 }, minigame: 'exam',
        success: { effects: { 'flag.b09_guild_visit': true, 'stat.int': +6, 'stat.elo': +3, gold: +60, reputation: +3 },
          result: `거스름돈 3G가 둘째 날 칸에 숨어 있었다. 마지막 줄까지 맞았다. 코벤 원장이 안경을 밀어 올렸다. "번 돈은 셋째지만 장부는 첫째다. 견학은 이 학생이 간다."` },
        fail: { effects: { 'stat.int': +3, gold: +10, stress: +6 },
          result: `3G가 어디서 샜는지 끝내 못 찾았다. 코벤 원장은 장부를 돌려주며 말했다. "장사꾼은 잃은 돈보다 모르는 돈을 무서워해야 한다." {name은} 그 말을 장부 첫 장에 적었다.` } },
      { label: '3G를 슬쩍 맞춰 적는다', effects: { gold: +40, 'stat.elo': +4, 'stat.moral': -3, 'pers.good': -3 },
        result: `3G를 슬쩍 맞춘 장부는 깔끔하게 통과했다. 그런데 장부를 덮던 코벤 원장이 한마디 했다. "깨끗한 장부가 늘 정직한 장부는 아니지." {name은} 그 말이 오래 마음에 걸렸다.` },
      { label: '모자란 3G를 솔직히 적는다', effects: { 'stat.moral': +4, 'stat.int': +2, 'pers.good': +2, reputation: +2 },
        result: `{name은} 장부 끝에 적었다. "3G 행방 모름. 제 잘못." 코벤 원장이 처음으로 웃었다. "이걸 적는 학생은 십 년에 한 명이다." 견학은 못 갔지만 그 장부는 교실 벽에 걸렸다.` },
      { label: '가죽 장부를 펼쳐 봐', conditions: ['item.ledger_book >= 1'], effects: { 'flag.b09_guild_visit': true, 'stat.int': +5, 'stat.elo': +3, gold: +60 },
        result: `밤마다 가죽 장부에 따로 적어 둔 기록이 있었다. 둘째 날 거스름돈 3G를 덜 받은 게 거기 있었다. 코벤 원장이 가죽 장부를 오래 넘겨 보았다. "이런 버릇이 장사꾼을 만든다."` },
    ],
  },
  {
    id: 'b09_commerce_ledger', title: '두 권의 장부', age: [15, 16], weight: 3, requiresActivity: 'commerce',
    conditions: ['stat.elo >= 250'],
    text: `코벤 원장의 추천으로 {name이} 비단 상회의 장부 일을 맡은 지 한 달. 오늘 저녁 아이가 굳은 얼굴로 돌아왔다. "장부가 두 권이야. 세금 낼 때 보여 주는 거랑 진짜. 주인이 품삯을 두 배로 올려 주겠대. 아무 말 안 하면."`,
    choices: [
      { label: '그 일은 그만둬', effects: { 'stat.moral': +4, 'stat.elo': +2, 'pers.good': +2, trust: +3 },
        result: `{name은} 다음 날 열쇠를 반납했다. 이야기를 들은 코벤 원장은 한참 말이 없더니 다른 상회 장부 일을 소개해 주었다. 품삯은 절반이었다.` },
      { label: '모른 척하고 두 배를 받는다', effects: { gold: +200, 'stat.elo': +4, 'stat.moral': -4, 'pers.good': -4, infamy: +5 },
        result: `품삯 봉투가 두꺼워졌다. {name은} 그 돈으로 당신에게 새 목도리를 사 왔다. 따뜻했다. 그런데 그 뒤로 아이는 장부 이야기를 한 번도 꺼내지 않았다.` },
      { label: '원장님께 털어놓게 한다', check: { stat: 'elo', dc: 400 },
        success: { effects: { 'stat.elo': +8, 'stat.int': +3, reputation: +5, 'pers.good': +2 },
          result: `코벤 원장은 두 장부를 나란히 펴 놓고 길드에 알렸다. 상회는 벌금을 물었다. 원장이 {name}의 어깨를 두드렸다. "장부를 읽는 눈보다 귀한 게 장부를 덮지 않는 손이다."` },
        fail: { effects: { 'stat.elo': +3, 'stat.moral': +3, reputation: -2, stress: +8 },
          result: `원장은 믿었지만 증거가 모자랐다. 상회 주인은 장부 한 권을 태워 버렸다. {name은} 일자리를 잃었고 장터에서 한동안 수군거림을 들었다. 그래도 고개를 숙이지 않았다.` } },
      { label: '길드장에게 직접 가져간다', conditions: ['flag.b09_guild_visit'], effects: { 'stat.elo': +4, reputation: +5, 'pers.good': +2, 'pers.ambit': +2, stress: +4 },
        result: `견학 날 받은 명함을 들고 {name이} 길드 회관을 찾았다. 길드장은 두 장부를 받아 들고 금테 안경을 고쳐 썼다. "이 나이에 이걸 들고 올 배짱이라. 기억해 두지."` },
    ],
  },

  // ════════════════════════════════════════════════════════════════════
  // 농업학교 — 헤드윅 선생님
  // ════════════════════════════════════════════════════════════════════
  {
    id: 'b09_farm_seedling', title: '시든 토마토 모종', age: [10, 12], weight: 3, requiresActivity: 'farmschool', image: 'bg/wheat_field',
    text: `농업학교에서 학생마다 토마토 모종을 하나씩 맡겼다. 다른 아이들 모종은 무릎까지 자랐는데 {name}의 것만 누렇게 시들었다. 물 주는 걸 사흘 잊었단다. 헤드윅 선생님은 혼내지 않았다. "죽었는지 살았는지는 뿌리가 말해 준단다." 아이가 흙 묻은 손으로 울먹였다.`,
    choices: [
      { label: '뿌리를 같이 살펴보자', check: { stat: 'int', dc: 60 },
        success: { effects: { 'stat.int': +4, 'stat.sens': +3, 'stat.moral': +2, trust: +2 },
          result: `조심스레 흙을 헤치자 하얀 뿌리 몇 가닥이 아직 촉촉했다. "살아 있어!" 그날부터 {name은} 아침마다 모종 앞에 쪼그려 앉았다. 늦게 열린 토마토 세 알은 반에서 제일 달았다.` },
        fail: { effects: { 'stat.sens': +4, 'stat.moral': +3, 'stat.int': +2, stress: +4, trust: +2 },
          result: `뿌리는 바스러졌다. {name은} 모종을 화단 구석에 묻고 작은 돌을 얹었다. 헤드윅 선생님이 새 모종을 건넸다. "이번 건 네가 끝까지 키우는 거다." {name은} 두 손으로 모종을 받아 들었다.` } },
      { label: '새 모종을 사 준다 (-15G)', effects: { gold: -15, stress: -4, 'stat.sens': +2, 'pers.roman': -1 },
        result: `새 모종은 쑥쑥 자랐다. 그런데 헤드윅 선생님은 시든 모종을 버리지 않고 교실 창가에 두었다. {name은} 그 화분 앞을 지날 때마다 걸음이 느려졌다.` },
      { label: '잊은 건 네 책임이야', effects: { 'stat.moral': +4, 'pers.agree': +1, trust: -2, stress: +5 },
        result: `{name은} 고개를 숙였다. 그 뒤로 달력에 물 주는 날마다 빨간 동그라미를 그렸다. 동그라미는 하나도 빠지지 않았다. 다만 한동안 모종 이야기를 꺼내지 않았다.` },
      { label: '엘다에게 물어보자', conditions: ['flag.met_elda'], effects: { 'stat.int': +2, 'stat.mag': +2, 'rel.elda': +4, 'pers.roman': +1 },
        result: `엘다가 모종에 손바닥을 대고 콧노래를 불렀다. "풀은 노래보다 물을 좋아하지만, 노래도 싫어하진 않아요." 모종이 고개를 들었다. 비결을 묻자 {name은} "노래요"라고 했다.` },
    ],
  },
  {
    id: 'b09_farm_bees', title: '벌들이 앉는 아이', age: [12, 15], weight: 3, requiresActivity: 'farmschool', image: 'bg/wheat_field',
    text: `농업학교 벌통 수업 날, 벌 떼가 갑자기 쏟아져 나왔다. 아이들이 비명을 지르며 흩어졌는데 {name}만 가만히 서 있었다. 벌들이 은백색 머리카락에 앉았다가 금빛 반짝임 사이로 하나둘 날아갔다. 헤드윅 선생님이 밀짚모자를 벗었다. "얘야, 벌통 하나 맡아 볼래?"`,
    choices: [
      { label: '벌통을 들여놓자 (-40G)', conditions: ['gold >= 40'], effects: { gold: -40, 'stat.sens': +5, 'stat.hp': +3, 'pers.ambit': -1 },
        result: `마당 끝에 벌통이 생겼다. {name은} 벌마다 이름을 붙이려다 포기했다. 가을에 첫 꿀을 떴다. 큐브가 꿀단지에 빠져 하루 종일 반짝였다.` },
      { label: '벌은 위험해', effects: { 'stat.int': +2, 'pers.roman': -1, trust: -2, stress: +2 },
        result: `{name은} 아쉬워하며 고개를 끄덕였다. 그래도 수업 시간마다 벌통 옆에 섰다. 헤드윅 선생님은 그 자리를 늘 비워 두었다.` },
      { label: '왜 너한테 앉았는지 알아보자', check: { stat: 'int', dc: 130 },
        success: { effects: { 'stat.int': +6, 'stat.sens': +3, reputation: +2, 'pers.roman': -1 },
          result: `오래된 양봉서에 답이 있었다. 벌은 겁먹은 사람의 냄새를 싫어한다. "나 하나도 안 무서웠어. 그게 재능이래." 헤드윅 선생님이 그 책을 {name}에게 선물했다.` },
        fail: { effects: { 'stat.int': +3, 'pers.roman': +2, stress: +3 },
          result: `어느 책에도 답이 없었다. {name은} 결국 결론을 내렸다. "벌들이 나를 좋아하는 거야." 헤드윅 선생님은 그것도 틀린 답은 아니라고 했다.` } },
      { label: '약초 씨앗으로 꽃밭을 만든다', conditions: ['item.herb_kit >= 1'], effects: { gold: -20, 'stat.sens': +3, 'stat.int': +3, 'stat.mag': +2 },
        result: `약초 상자의 씨앗으로 벌통 둘레에 꽃을 심었다. 라벤더, 백리향, 이름 모를 풀. 이듬해 꿀에서 약초 향이 났다. 헤드윅 선생님이 한 숟갈 떠먹고 눈을 감았다.` },
    ],
  },
];
