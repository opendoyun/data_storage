import { josa } from '../../engine/josa.js';
// 코어 이벤트 (v0.1에서 작성한 36개). 이벤트 규칙은 docs/game-design/content-contract.md 참조.
// 이벤트 데이터 (GDD 4.6 / 7.2 DSL)
// 필드: id, title, text, age:[lo,hi], season, month, fixed(고정), weight, conditions[], requiresActivity,
//       repeatable, chainOnly(연쇄 전용), npc, choices[{label, conditions?, effects, result, next?, check:{stat,dc}, success, fail}]
const N = '{name}';
const EVENTS = [
  // ── 고정 분기 이벤트 ─────────────────────────────────────────────────
  { id: 'fest_spring', title: '봄의 꽃 축제', month: 3, fixed: true, repeatable: true, image: 'bg/festival_spring',
    text: `마을 광장에 꽃수레가 들어왔다. {name이} 소매를 잡아당긴다. "같이 가자!"`,
    choices: [
      { label: '함께 축제를 즐긴다', effects: { stress: -12, trust: +4, 'rel.leon': +3, 'pers.extro': +2, gold: -30 }, result: '꽃잎 사이로 하루가 지나갔다. 아이가 오랫동안 웃었다.' },
      { label: '구경만 하고 일찍 돌아온다', effects: { stress: -4, gold: -5 }, result: '사람 많은 곳은 피곤하다. 그래도 아이는 꽃 한 송이를 챙겨 왔다.' },
      { label: '축제에서 꽃을 팔게 한다', effects: { gold: +70, 'stat.elo': +6, stress: +5, 'pers.roman': -2 }, result: '하루 종일 목이 쉬도록 팔았다. 돈은 벌었지만 아이는 수레를 오래 바라봤다.' },
    ] },
  { id: 'fest_summer_exam', title: '여름 학력 시험', month: 6, fixed: true, repeatable: true, image: 'bg/school',
    text: `왕국 공통 학력 시험 날. {name은} 긴장한 얼굴로 연필을 깎는다.`,
    choices: [
      { label: '시험을 치게 한다', check: { stat: 'int', dc: 180 },
        success: { effects: { 'stat.int': +8, reputation: +4, trust: +2, 'pers.ambit': +2 }, result: '상위 성적! 교장이 직접 칭찬 편지를 보냈다.' },
        fail: { effects: { stress: +8, 'pers.ambit': -1, 'stat.int': +3 }, result: '결과는 그저 그랬다. "다음엔 더 잘할게……." 아이가 작게 말했다.' } },
      { label: '시험은 건너뛴다', effects: { stress: -5 }, result: '그냥 쉬기로 했다. 시험지 대신 강가에서 발을 담갔다.' },
    ] },
  { id: 'fest_harvest', title: '수확제', month: 9, fixed: true, repeatable: true, image: 'bg/festival_harvest',
    text: `평원에서 수확제가 열린다. 힘겨루기, 요리 대회, 밤의 춤.`,
    choices: [
      { label: '힘겨루기에 나간다', check: { stat: 'str', dc: 200 },
        success: { effects: { 'stat.str': +6, reputation: +5, gold: +100, 'rel.garrett': +5 }, result: `{name이} 통나무 들기에서 우승했다! 가렛이 휘파람을 불었다.` },
        fail: { effects: { 'stat.str': +3, stress: +5 }, result: '아쉽게 떨어졌다. 하지만 박수는 받았다.' } },
      { label: '요리 대회에 나간다', check: { stat: 'sens', dc: 180 },
        success: { effects: { 'stat.sens': +6, 'stat.chm': +3, reputation: +4, gold: +60 }, result: '호박 파이가 심사위원을 울렸다. 1등.' },
        fail: { effects: { 'stat.sens': +2, stress: +4 }, result: '파이가 조금 탔다. 그래도 집에 와서 둘이 다 먹었다.' } },
      { label: '밤의 춤을 구경한다', effects: { 'stat.sens': +3, 'rel.leon': +4, 'pers.roman': +2, stress: -8 }, result: '불꽃 아래서 리온이 손을 내밀었다. 아이는 잠깐 망설이다 잡았다.' },
    ] },
  { id: 'fest_starnight', title: '별의 밤 · 생일', month: 12, fixed: true, repeatable: true, image: 'bg/starnight',
    text: `{name}의 생일. 세 개의 달이 가장 밝은 밤. 큐브가 케이크를 들고 둥실 떠 있다.`,
    choices: [
      { label: '소원을 묻는다', effects: { trust: +5, stress: -10, 'rel.cube': +3 }, result: (s) => `${josa(s.name,'은')} 잠시 하늘을 보더니 말했다. "${wish(s)}"` },
      { label: '큰 선물을 준다 (-150G)', conditions: ['gold >= 150'], effects: { gold: -150, trust: +6, 'stat.chm': +3, 'pers.ambit': +1, stress: -8 }, result: '값비싼 선물. 아이는 상자보다 당신 얼굴을 더 오래 봤다.' },
      { label: '조용히 함께 별을 본다', effects: { trust: +4, 'stat.sens': +4, 'pers.roman': +2, stress: -12 }, result: '아무 말 없이도 충분한 밤이었다.' },
    ] },

  // ── 유년기 (10~11) ──────────────────────────────────────────────────
  { id: 'cube_intro', title: '큐브의 조언', age: [10, 10], weight: 3, npc: 'cube',
    text: `"주인님! 아이를 키울 땐 말이죠—" 큐브가 빙글빙글 돌며 말한다. "스트레스가 70을 넘으면 아이가 말을 안 들어요. 가끔은 쉬게 해주세요."`,
    choices: [ { label: '알겠다', effects: { 'rel.cube': +5 }, result: '큐브가 만족스럽게 반짝였다.' } ] },
  { id: 'lost_kitten', title: '길 잃은 고양이', age: [10, 12], weight: 2,
    text: `{name이} 비에 젖은 고양이를 안고 들어왔다. "키워도 돼……?"`,
    choices: [
      { label: '키우게 한다', effects: { trust: +5, 'stat.sens': +5, 'stat.moral': +3, gold: -20, 'flag.has_cat': true }, result: '이름은 "달무리". 아이가 매일 밥을 챙긴다.' },
      { label: '주인을 찾아준다', effects: { 'stat.moral': +5, 'stat.elo': +3, 'pers.good': +2 }, result: '사흘 만에 주인을 찾았다. 아이는 울었지만 손을 흔들어 보냈다.' },
      { label: '안 된다고 한다', effects: { trust: -4, stress: +5, 'pers.agree': -2 }, result: '아이는 말없이 고양이를 다시 내려놓았다.' },
    ] },
  { id: 'first_friend_leon', title: '우물가의 소년', age: [10, 12], weight: 2, npc: 'leon',
    text: `우물가에서 {name이} 또래 소년과 이야기하고 있다. 리온이라고 했다. 옷차림이 묘하게 좋다.`,
    choices: [
      { label: '집에 초대하라고 한다', effects: { 'rel.leon': +10, 'pers.extro': +3, 'flag.met_leon': true }, result: '리온은 예의 바르게 인사했다. 어딘가 귀족 같은 말투.' },
      { label: '지켜보기만 한다', effects: { 'rel.leon': +4, 'flag.met_leon': true }, result: '둘은 해가 질 때까지 돌을 던지며 놀았다.' },
    ] },
  { id: 'elda_meet', title: '약초 바구니', age: [10, 13], weight: 2, npc: 'elda', requiresActivity: 'farm',
    text: `밭일을 마치고 돌아오는 길, 흰 머리의 여인이 {name을} 오래 바라봤다. "그 아이… 별의 냄새가 나네요." 엘다라고 했다.`,
    choices: [
      { label: '무슨 뜻이냐고 묻는다', effects: { 'rel.elda': +8, 'flag.met_elda': true, 'stat.mag': +3 }, result: '"때가 되면 알게 돼요." 그녀는 약초 한 묶음을 아이에게 쥐여 줬다.' },
      { label: '경계하며 지나간다', effects: { 'flag.met_elda': true, 'rel.elda': +2 }, result: '그녀는 미소만 지었다. 아이는 자꾸 뒤를 돌아봤다.' },
    ] },
  { id: 'garrett_sword', title: '목검', age: [10, 12], weight: 2, npc: 'garrett', conditions: ['rel.garrett >= 15'],
    text: `가렛이 아이 키에 맞는 목검을 깎아 왔다. "기사 양반 딸이면 이 정도는 쥘 줄 알아야지."`,
    choices: [
      { label: '받는다', effects: { 'stat.str': +4, 'stat.agi': +3, 'rel.garrett': +6, 'pers.extro': +1 }, result: '아이가 마당에서 밤늦게까지 휘둘렀다.' },
      { label: '아직 이르다고 거절한다', effects: { 'rel.garrett': -3, 'stat.eti': +2 }, result: '가렛은 어깨를 으쓱했다. "언젠가는."' },
    ] },
  { id: 'sick_cold', title: '감기', age: [10, 17], weight: 1.5, repeatable: true, conditions: ['stress >= 55'],
    text: `{name이} 밤새 기침을 했다. 열이 있다.`,
    choices: [
      { label: '의사를 부른다 (-80G)', conditions: ['gold >= 80'], effects: { gold: -80, 'stat.hp': +2, trust: +3, stress: -10 }, result: '약을 먹고 이틀 만에 일어났다.' },
      { label: '엘다의 약초를 쓴다', conditions: ['flag.met_elda'], effects: { 'rel.elda': +4, stress: -8, 'stat.mag': +2 }, result: '쓴 약초차. 효과는 확실했다.' },
      { label: '집에서 간호한다', effects: { stress: -6, 'stat.hp': -3, gHealth: -5, trust: +2 }, result: '사흘 밤을 곁에서 지켰다. 당신도 피곤하다.' },
    ] },
  { id: 'allowance', title: '용돈 이야기', age: [11, 14], weight: 1.5,
    text: `"다른 애들은 용돈을 받는다던데." {name이} 조심스럽게 말한다.`,
    choices: [
      { label: '매달 넉넉히 준다 (-60G)', conditions: ['gold >= 60'], effects: { gold: -60, trust: +4, 'pers.ambit': +2, 'pers.roman': +1, 'flag.allowance': true }, result: '아이가 첫 용돈으로 당신에게 사탕을 사 왔다.' },
      { label: '조금만 준다 (-20G)', effects: { gold: -20, trust: +1, 'stat.int': +2 }, result: '"아껴 써." "응." 장부를 적는 법을 가르쳤다.' },
      { label: '일해서 벌라고 한다', effects: { 'pers.ambit': +3, 'pers.roman': -2, trust: -2 }, result: '아이는 입을 다물었다. 다음 날 혼자 식당에 일자리를 물어보고 왔다.' },
    ] },

  // ── 소녀기 (12~13) ──────────────────────────────────────────────────
  { id: 'theodora_rival', title: '라이벌의 등장', age: [12, 13], weight: 3, npc: 'theodora',
    text: `예절학교 앞에서 금발 소녀가 {name을} 위아래로 훑었다. "시골 출신이구나? 나는 테오도라. 기억해 둬."`,
    choices: [
      { label: '맞받아치라고 한다', effects: { 'stat.elo': +4, 'pers.extro': +2, 'rel.theodora': +5, 'pers.agree': -1 }, result: '"기억할 만한 이름인지는 보고 결정할게." 테오도라가 눈을 크게 떴다.' },
      { label: '무시하라고 한다', effects: { 'stat.eti': +3, 'rel.theodora': +2 }, result: '아이는 조용히 고개를 숙이고 지나쳤다. 테오도라는 그게 더 거슬리는 듯했다.' },
    ] },
  { id: 'school_bully', title: '교실의 그림자', age: [12, 14], weight: 2, requiresActivity: 'school',
    text: `{name}의 책가방이 찢어져 있었다. 누가 그랬는지는 말하지 않는다.`,
    choices: [
      { label: '학교에 찾아간다', effects: { reputation: +2, trust: +3, 'stat.moral': +3 }, result: '교사가 조치를 약속했다. 아이는 부끄러워했지만, 그날 밤 당신 옆에 앉았다.' },
      { label: '스스로 해결하게 한다', check: { stat: 'elo', dc: 150 },
        success: { effects: { 'stat.elo': +8, 'pers.extro': +3, trust: +2 }, result: '아이는 다음 날 당당하게 말로 맞섰다. 가방은 돌려받았다.' },
        fail: { effects: { stress: +12, 'pers.extro': -3, trust: -3 }, result: '아이는 며칠 동안 말이 없었다.' } },
      { label: '검으로 겁을 주라고 한다', conditions: ['stat.str >= 120'], effects: { 'stat.str': +3, infamy: +6, 'pers.good': -4, 'pers.agree': -2 }, result: '다음 날 아무도 아이를 건드리지 않았다. 교사도 당신을 피했다.' },
    ] },
  { id: 'loren_invite', title: '마담 로렌의 초대', age: [12, 14], weight: 2, npc: 'loren', conditions: ['stat.eti >= 120'],
    text: `마담 로렌이 직접 편지를 보냈다. "따님의 자세가 눈에 띕니다. 왕도의 티파티에 초대합니다. 드레스는 필수."`,
    choices: [
      { label: '드레스를 사서 보낸다 (-200G)', conditions: ['gold >= 200'], effects: { gold: -200, 'stat.eti': +8, 'stat.chm': +6, 'rel.loren': +10, 'pers.ambit': +3, 'flag.tea_party': true }, result: '아이는 완벽한 인사를 해냈다. 로렌이 처음으로 미소를 지었다.' },
      { label: '있는 옷으로 보낸다', check: { stat: 'chm', dc: 160 },
        success: { effects: { 'stat.chm': +6, 'rel.loren': +6, 'flag.tea_party': true }, result: '소박한 옷이 오히려 돋보였다. "본질이 있군요."' },
        fail: { effects: { stress: +10, 'rel.loren': -2, 'pers.ambit': -2 }, result: '귀족 아이들의 시선. 아이는 일찍 돌아왔다.' } },
      { label: '거절한다', effects: { 'rel.loren': -5, 'pers.ambit': -2, stress: -3 }, result: '"우리 집에는 어울리지 않아." 아이는 편지를 서랍에 넣어 두었다.' },
    ] },
  { id: 'magic_spark', title: '손끝의 불꽃', age: [12, 14], weight: 2, conditions: ['stat.mag >= 100', '!flag.magic_awake'],
    text: `밤중에 {name}의 방에서 빛이 새어 나왔다. 손바닥 위에 작은 별이 떠 있다. 아이도 놀라 있다.`,
    choices: [
      { label: '마법탑에 데려간다', effects: { 'flag.magic_awake': true, 'stat.mag': +10, 'rel.elda': +3, gold: -50 }, result: '탑의 학자들이 수선을 떨었다. "이 아이는……" 그들은 말을 끝내지 않았다.' },
      { label: '엘다에게 묻는다', conditions: ['flag.met_elda'], effects: { 'flag.magic_awake': true, 'stat.mag': +8, 'rel.elda': +10, 'flag.elda_secret_1': true }, result: '"드디어." 엘다는 아이의 손을 잡고 오래 말이 없었다. "네 어머니도 그랬어."' },
      { label: '아무에게도 말하지 말라고 한다', effects: { 'flag.magic_awake': true, 'flag.magic_hidden': true, trust: -2, 'pers.extro': -3 }, result: '아이는 고개를 끄덕였다. 그러나 밤마다 불빛은 조금씩 더 밝아졌다.' },
    ] },
  { id: 'inn_stranger', title: '여관의 손님', age: [12, 16], weight: 2, requiresActivity: 'inn',
    text: `여관에 후드를 쓴 손님이 {name}에게 금화 한 닢을 쥐여 주며 물었다. "이 마을에 은발 아이가 산다던데."`,
    choices: [
      { label: '모른다고 하게 한다', effects: { 'stat.elo': +4, 'pers.good': -1, 'flag.stranger_asked': true }, result: '아이는 태연하게 거짓말을 했다. 손님은 금화를 두고 떠났다.' },
      { label: '당신이 직접 나선다', effects: { reputation: +2, trust: +3, 'flag.stranger_asked': true, 'flag.guardian_confront': true }, result: '손님은 당신을 보고 눈을 가늘게 떴다. "……기사였군." 그리고 사라졌다.' },
    ] },
  { id: 'theater_debut', title: '첫 무대', age: [12, 15], weight: 2, requiresActivity: 'theater',
    text: `극단 단장이 {name}에게 대사 있는 역을 맡겼다. 첫 공연 날.`,
    choices: [
      { label: '응원하러 간다', check: { stat: 'chm', dc: 170 },
        success: { effects: { 'stat.chm': +8, 'stat.sens': +5, reputation: +5, 'pers.extro': +4, 'flag.stage_star': true }, result: '객석이 숨을 죽였다. 커튼콜에서 아이가 당신을 찾았다.' },
        fail: { effects: { 'stat.chm': +3, stress: +8, 'pers.extro': -1 }, result: '대사를 한 줄 잊었다. 그래도 끝까지 해냈다.' } },
    ] },

  // ── 사춘기 (14~15) ──────────────────────────────────────────────────
  { id: 'secret_letter', title: '봉인된 편지', age: [14, 15], weight: 3, conditions: ['stat.int >= 200', 'flag.met_elda'],
    text: `방 청소를 하다 침대 밑에서 봉인된 편지를 발견했다. 보낸 이는… 마법탑.`,
    choices: [
      { label: '조용히 다시 넣어둔다', effects: { trust: +12, 'flag.respected_privacy': true }, result: '아이의 비밀은 아이의 것이다. 며칠 뒤 아이가 먼저 편지 이야기를 꺼냈다.' },
      { label: '읽어본다', effects: { trust: -15, 'stat.int': +8, 'flag.read_letter': true }, next: 'secret_letter_confront', result: '"……별의 아이는 열여섯이 되기 전 탑으로 와야 한다." 손이 떨렸다.' },
      { label: '아이에게 직접 묻는다', check: { stat: 'elo', dc: 200 },
        success: { effects: { trust: +18, 'flag.open_talk': true, 'flag.read_letter': true }, result: '아이는 울면서 전부 말했다. 탑이 자기를 데려가려 한다는 것을.' },
        fail: { effects: { trust: -8, stress: +10 }, result: '"내 거야! 왜 뒤져!" 문이 닫혔다.' } },
    ] },
  { id: 'secret_letter_confront', title: '들켰다', chainOnly: true, age: [14, 16],
    text: `{name이} 편지가 옮겨진 걸 알아챘다. "읽었지." 목소리가 떨린다.`,
    choices: [
      { label: '사과한다', effects: { trust: +6, 'pers.agree': +2 }, result: '"……다음부턴 물어봐." 아이가 작게 말했다.' },
      { label: '걱정돼서 그랬다고 한다', check: { stat: 'elo', dc: 220 },
        success: { effects: { trust: +4, 'flag.open_talk': true }, result: '한참 뒤 아이는 당신 옆에 앉았다. 함께 편지를 다시 읽었다.' },
        fail: { effects: { trust: -10, stress: +10, 'pers.agree': -4 }, result: '"걱정이 아니라 통제잖아." 그날 밤 아이는 집에 늦게 들어왔다.' } },
    ] },
  { id: 'runaway', title: '빈 방', age: [14, 16], weight: 2, conditions: ['trust <= 35', 'pers.agree <= -30'],
    text: `아침, {name}의 방이 비어 있다. 쪽지 하나. "며칠만."`,
    choices: [
      { label: '가렛에게 찾아달라고 부탁한다', conditions: ['rel.garrett >= 30'], effects: { 'rel.garrett': +5, trust: +3, stress: -5, 'flag.ran_away': true }, result: '이틀 뒤 가렛이 아이를 데려왔다. 아이는 항구에서 배를 보고 있었다고 했다.' },
      { label: '기다린다', effects: { trust: +8, 'pers.agree': +4, 'flag.ran_away': true, stress: -3, gHealth: -8 }, result: '닷새 뒤 아이가 돌아왔다. "……기다렸어?" "응." 그게 전부였다. 그게 다였다.' },
      { label: '직접 찾아 나선다', effects: { trust: -3, gHealth: -10, 'flag.ran_away': true }, result: '사흘 만에 평원 끝 엘다의 집에서 찾았다. 아이는 당신을 보고 뒤돌아섰다.' },
    ] },
  { id: 'theodora_duel', title: '무도회 전야', age: [14, 16], weight: 2, npc: 'theodora', conditions: ['rel.theodora >= 10'],
    text: `테오도라가 왕도 무도회에 {name을} "초대"했다. 분명히 망신을 줄 작정이다.`,
    choices: [
      { label: '춤으로 승부한다', check: { stat: 'eti', dc: 230, bonus: (s) => s.stats.chm * 0.3 },
        success: { effects: { 'stat.eti': +8, 'stat.chm': +6, reputation: +8, 'rel.theodora': +10, 'rel.loren': +5, 'flag.ball_won': true }, result: '홀이 멈췄다. 테오도라가 처음으로 진심으로 박수를 쳤다. "……인정."' },
        fail: { effects: { stress: +12, 'rel.theodora': +3, 'stat.eti': +3 }, result: '발을 헛디뎠다. 그런데 테오도라가 손을 잡아 일으켜 줬다. "넘어지는 것도 못 봐 주겠네."' } },
      { label: '검술 시범으로 압도한다', conditions: ['stat.str >= 250'], effects: { 'stat.str': +5, reputation: +5, 'rel.garrett': +4, 'rel.loren': -5, 'pers.agree': -2 }, result: '귀족들은 경악했고, 테오도라는 웃음을 참지 못했다.' },
      { label: '가지 않는다', effects: { stress: -4, 'rel.theodora': -5, 'pers.ambit': -3 }, result: '"비겁하다고 하겠지." "하라고 해." 둘은 집에서 카드를 했다.' },
    ] },
  { id: 'leon_truth', title: '리온의 정체', age: [14, 16], weight: 2, npc: 'leon', conditions: ['rel.leon >= 35', 'flag.met_leon'],
    text: `왕실 마차가 마을에 들어왔다. 리온이 거기서 내렸다. 왕자였다. {name은} 입술을 깨물고 있다.`,
    choices: [
      { label: '아이 곁에 있어 준다', effects: { trust: +6, 'rel.leon': -5, 'stat.sens': +4 }, result: '"왜 말 안 했을까." "말할 수 없었겠지." 아이는 당신 어깨에 기댔다.' },
      { label: '리온에게 직접 묻게 한다', check: { stat: 'elo', dc: 220 },
        success: { effects: { 'rel.leon': +12, 'flag.leon_promise': true, 'pers.roman': +3 }, result: '"넌 내가 왕자라서 친구가 된 게 아니잖아." 리온은 다시 돌아오겠다고 약속했다.' },
        fail: { effects: { 'rel.leon': -10, stress: +10, 'pers.roman': -3 }, result: '아이는 소리를 질렀고, 마차는 떠났다.' } },
    ] },
  { id: 'big_expense', title: '지붕이 무너졌다', age: [13, 15], weight: 2.5, conditions: ['!flag.roof_fixed'],
    text: `폭풍이 지붕을 뜯어갔다. 수리비 300G. 겨울이 오기 전에 고쳐야 한다.`,
    choices: [
      { label: '수리한다 (-300G)', conditions: ['gold >= 300'], effects: { gold: -300, 'flag.roof_fixed': true, stress: -3 }, result: '빚 없이 넘겼다. 아이가 "우리 집 부자네" 하고 웃었다.' },
      { label: '가렛에게 빌린다', conditions: ['rel.garrett >= 25'], effects: { gold: +300, 'flag.roof_fixed': true, 'flag.debt_garrett': true, 'rel.garrett': -5 }, result: '"이자는 네 딸 검술 실력으로 받지." 가렛이 돈을 던져 줬다. 2년 내 300G를 갚아야 한다.' },
      { label: '직접 고친다', effects: { 'flag.roof_fixed': true, gHealth: -15, 'stat.str': +4, trust: +3, stress: +5 }, result: '아이와 둘이 보름을 매달렸다. 삐딱하지만, 비는 안 샌다.' },
      { label: '그냥 버틴다', effects: { 'stat.hp': -8, stress: +15, gHealth: -10 }, result: '겨울 내내 추웠다. 아이가 기침을 달고 살았다.' },
    ] },
  { id: 'debt_due', title: '빚 갚는 날', age: [15, 17], weight: 4, conditions: ['flag.debt_garrett'], npc: 'garrett',
    text: `가렛이 찾아왔다. "약속한 300G."`,
    choices: [
      { label: '갚는다 (-300G)', conditions: ['gold >= 300'], effects: { gold: -300, 'flag.debt_garrett': false, 'rel.garrett': +10, reputation: +3 }, result: '"기사는 기사군." 가렛이 손을 내밀었다.' },
      { label: '아이가 용병단 일을 돕는 것으로 대신한다', effects: { 'flag.debt_garrett': false, 'stat.str': +10, 'stat.agi': +8, 'rel.garrett': +8, stress: +12, 'pers.agree': -2 }, result: '석 달 동안 아이는 용병단 심부름을 했다. 돌아왔을 때 눈빛이 달라져 있었다.' },
      { label: '못 갚는다고 한다', effects: { 'flag.debt_garrett': false, 'rel.garrett': -25, reputation: -10, infamy: +8 }, result: '가렛은 아무 말 없이 떠났다. 그 뒤로 도장 문은 열리지 않았다.' },
    ] },
  { id: 'night_market', title: '밤 시장의 유혹', age: [14, 17], weight: 1.5, conditions: ['pers.good <= -10'],
    text: `{name이} 밤 시장에서 수상한 물건을 팔아 돈을 벌어 왔다. 가방에 금화가 가득하다.`,
    choices: [
      { label: '돈을 돌려주게 한다', effects: { 'stat.moral': +8, trust: -3, 'pers.good': +4 }, result: '아이는 투덜거렸지만 돌려줬다. 밤 시장 사람들은 아이를 기억했다.' },
      { label: '못 본 척한다', effects: { gold: +250, infamy: +10, 'pers.good': -5, 'stat.elo': +5, 'flag.shadow_path': true }, result: '돈은 요긴했다. 아이는 그걸 알아차렸다.' },
      { label: '왜 그랬는지 묻는다', check: { stat: 'elo', dc: 200 },
        success: { effects: { trust: +8, 'stat.moral': +4, 'pers.good': +3 }, result: '"우리 집 돈 없잖아." 아이는 울었다. 당신도 조금 울었다.' },
        fail: { effects: { trust: -5, infamy: +4, 'pers.good': -2 }, result: '"상관없잖아." 아이는 나가 버렸다.' } },
    ] },
  { id: 'tower_summons', title: '탑의 사자', age: [15, 16], weight: 4, conditions: ['flag.magic_awake'],
    text: `마법탑의 사자가 집 앞에 섰다. "별의 아이를 탑에 맡기십시오. 왕국의 안위가 걸린 일입니다." {name은} 문 뒤에서 듣고 있다.`,
    choices: [
      { label: '아이에게 결정을 맡긴다', effects: { trust: +10, 'pers.agree': +3, 'flag.tower_choice_hers': true }, result: (s) => s.personality.ambit > 10 ? `${josa(s.name,'이')} 나섰다. "제가 갈게요. 하지만 제 발로." 사자는 고개를 숙였다.` : `${josa(s.name,'이')} 나섰다. "안 가요. 여기가 제 집이에요." 사자는 말없이 돌아갔다.` },
      { label: '단호히 거절한다', effects: { trust: +4, reputation: -5, 'flag.tower_refused': true, 'pers.agree': -2 }, result: '"이 아이는 내 딸이다." 사자는 "다시 오겠다"고 했다.' },
      { label: '조건부로 응한다 (주 1회 수업)', effects: { 'stat.mag': +25, 'stat.int': +10, 'flag.tower_lessons': true, trust: -2, gold: +200 }, result: '탑은 수업료 대신 장학금을 보냈다. 아이는 매주 탑에 다닌다. 돌아올 때마다 조금 멀어진 느낌.' },
    ] },
  { id: 'elda_truth', title: '엘다의 고백', age: [15, 17], weight: 3, npc: 'elda', conditions: ['rel.elda >= 45', 'flag.elda_secret_1'],
    text: `엘다가 당신을 따로 불렀다. "말할 때가 됐어요. 그 아이는 별에서 온 게 아니에요. 왕실 마법사였던 어머니가… 탑에서 도망치며 하늘에 숨겼죠. 저는 그 어머니의 스승이었어요."`,
    choices: [
      { label: '아이에게 전부 말한다', effects: { trust: +10, 'stat.sens': +6, 'flag.knows_origin': true, 'rel.elda': +10 }, result: '아이는 오래 울었다. 그리고 물었다. "그래도 아빠는 아빠지?" "응."' },
      { label: '때가 되면 말하기로 한다', effects: { 'flag.origin_hidden': true, trust: -3, 'rel.elda': +3 }, result: '당신은 비밀을 안고 돌아왔다. 아이는 당신 얼굴을 유심히 봤다.' },
    ] },

  // ── 청년기 (16~17) ──────────────────────────────────────────────────
  { id: 'leon_confession', title: '달빛 아래', age: [16, 17], weight: 3, npc: 'leon', conditions: ['rel.leon >= 55', 'flag.leon_promise'],
    text: `리온이 돌아왔다. 왕자 신분을 숨기지 않고. 정원에서 {name}에게 무언가 말했고, 아이가 얼굴을 붉히며 들어왔다.`,
    choices: [
      { label: '아이의 마음을 묻는다', effects: { trust: +6, 'rel.leon': +10, 'pers.roman': +4, 'flag.leon_love': true }, result: '"……좋아." 아이가 베개에 얼굴을 묻고 말했다.' },
      { label: '아직 이르다고 한다', effects: { trust: -5, 'rel.leon': -5, 'pers.roman': -2, 'pers.agree': -2 }, result: '아이는 반박하지 않았다. 그게 더 아팠다.' },
    ] },
  { id: 'career_knight', title: '근위대 입단 제안', age: [16, 17], weight: 3, conditions: ['stat.str >= 350', 'rel.garrett >= 40'], npc: 'garrett',
    text: `가렛이 왕실 근위대 추천서를 들고 왔다. "이 정도 실력이면 근위대도 노려볼 수 있다."`,
    choices: [
      { label: '지원하게 한다', effects: { 'stat.str': +10, 'stat.agi': +8, reputation: +8, 'flag.knight_path': true, 'pers.ambit': +4 }, result: '시험장에서 아이는 성인 병사 셋을 쓰러뜨렸다.' },
      { label: '아이가 정하게 한다', effects: { trust: +5, 'flag.knight_path': true }, result: (s) => s.personality.ambit > 0 ? '아이는 추천서를 받았다. "해볼게."' : '아이는 추천서를 접었다. "검은 좋지만, 명령받는 건 싫어."' },
    ] },
  { id: 'career_scholar', title: '왕실 학술원 초빙', age: [16, 17], weight: 3, conditions: ['stat.int >= 350'],
    text: `왕실 학술원에서 {name}의 논문(여름 시험 답안이었다)을 보고 연구생 자리를 제안했다.`,
    choices: [
      { label: '받아들인다', effects: { 'stat.int': +12, 'stat.cult': +6, reputation: +6, 'flag.scholar_path': true, gold: +150 }, result: '아이는 왕도에서 일주일을 보내고 책 한 상자와 함께 돌아왔다.' },
      { label: '거절하고 집에서 공부한다', effects: { 'stat.int': +6, trust: +3, 'pers.ambit': -2 }, result: '"여기서도 충분히 배울 수 있어." 아이가 책장을 쳐다봤다.' },
    ] },
  { id: 'career_merchant', title: '상인 길드의 눈', age: [16, 17], weight: 3, conditions: ['stat.elo >= 300'],
    text: `상인 길드장이 {name}의 흥정 실력을 보고 수습 자리를 제안했다. "항구에서 가장 입이 빠른 아이."`,
    choices: [
      { label: '수습을 시작한다', effects: { 'stat.elo': +10, 'stat.int': +5, gold: +300, 'flag.merchant_path': true, 'pers.roman': -3 }, result: '첫 달에 아이는 당신 월 수입의 두 배를 벌어 왔다.' },
      { label: '거절한다', effects: { 'pers.ambit': -2, trust: +2 }, result: '"돈보다 중요한 게 있어." 아이는 그렇게 말했지만, 장부는 계속 적었다.' },
    ] },
  { id: 'career_church', title: '성당의 부름', age: [16, 17], weight: 3, conditions: ['stat.faith >= 300'],
    text: `대주교가 {name을} 성녀 후보로 지명하겠다고 했다. 왕국 전체가 주목하는 자리.`,
    choices: [
      { label: '받아들이게 한다', effects: { 'stat.faith': +15, 'stat.moral': +8, reputation: +12, 'flag.church_path': true }, result: '흰 옷을 입은 아이가 낯설었다. 그러나 눈은 그대로였다.' },
      { label: '아이가 정하게 한다', effects: { trust: +5, 'flag.church_path': true, 'stat.faith': +5 }, result: '아이는 사흘을 기도하고 답했다. 그 답은 아이의 것이다.' },
    ] },
  { id: 'career_art', title: '궁정 음악회', age: [16, 17], weight: 3, conditions: ['stat.sens >= 300'],
    text: `궁정 악단장이 {name}의 연주를 듣고 궁정 음악회 독주 자리를 내줬다.`,
    choices: [
      { label: '무대에 오른다', check: { stat: 'sens', dc: 320, bonus: (s) => s.stats.chm * 0.2 },
        success: { effects: { 'stat.sens': +12, 'stat.chm': +8, reputation: +12, 'flag.art_path': true }, result: '마지막 음이 끝나고 3초의 침묵. 그리고 기립 박수.' },
        fail: { effects: { 'stat.sens': +6, stress: +10, 'flag.art_path': true }, result: '중간에 현이 끊어졌다. 아이는 끊긴 현으로 끝까지 연주했다. 어떤 이들은 그게 더 좋았다고 했다.' } },
    ] },
  { id: 'career_shadow', title: '그림자 길드', age: [16, 17], weight: 3, conditions: ['infamy >= 25'],
    text: `밤, 검은 옷의 남자가 {name}에게 명함 아닌 명함을 건넸다. "재능이 있어. 밤의 일에."`,
    choices: [
      { label: '막는다', effects: { trust: -3, infamy: -5, 'stat.moral': +5, 'pers.good': +3 }, result: '아이는 명함을 불에 던졌다. 당신 눈을 보면서.' },
      { label: '아이가 정하게 한다', effects: { 'flag.shadow_path': true, 'pers.good': -3, 'stat.agi': +10, 'stat.elo': +6 }, result: (s) => s.personality.good < -20 ? '아이는 명함을 주머니에 넣었다. 다음 날부터 밤에 가끔 집을 비운다.' : '아이는 명함을 돌려줬다. "저는 낮이 좋아요."' },
    ] },
  { id: 'guardian_collapse', title: '보호자의 병', age: [15, 17], weight: 3, conditions: ['gHealth <= 35', '!flag.guardian_sick'],
    text: `아침에 일어나지 못했다. {name이} 당신 이마에 손을 얹었다. "……내가 할게. 전부."`,
    choices: [
      { label: '아이에게 맡긴다', effects: { 'flag.guardian_sick': true, gHealth: +20, trust: +10, 'stat.hp': +5, 'stat.moral': +5, 'pers.agree': +3, stress: +10 }, result: '한 달 동안 아이가 집을 꾸렸다. 서툴지만 따뜻했다.' },
      { label: '괜찮다고 억지로 일어난다', effects: { 'flag.guardian_sick': true, gHealth: -10, trust: -4 }, result: '아이는 아무 말도 하지 않았다. 대신 몰래 돈을 벌어 왔다.' },
    ] },
  { id: 'final_talk', title: '열일곱의 밤', age: [17, 17], month: 11, fixed: true,
    text: `성인이 되기 한 달 전. {name이} 당신 옆에 앉았다. "나, 뭘 하면 좋을까."`,
    choices: [
      { label: '"네가 정해."', effects: { trust: +8, 'pers.agree': +2, 'flag.final_hers': true }, result: '아이는 오래 침묵했다. 그리고 웃었다. "그럴 줄 알았어."' },
      { label: '"내 생각엔……" (가장 높은 능력을 권한다)', effects: { trust: +2, 'pers.ambit': +3, 'flag.final_guided': true }, result: '아이는 고개를 끄덕였다. 당신의 말이 무게를 가졌다.' },
      { label: '"뭘 해도 넌 내 딸이야."', effects: { trust: +10, 'stat.sens': +5, 'flag.final_home': true }, result: '아이가 당신을 안았다. 처음으로, 아이 쪽에서.' },
    ] },
];

function wish(s) {
  const p = s.personality;
  if (p.ambit > 30) return '언젠가 이 왕국에서 제일 높은 곳에 서 보고 싶어.';
  if (p.roman > 30) return '세상 끝의 바다를 보고 싶어. 노래로 남길 수 있게.';
  if (p.good < -20) return '……말하면 들어줄 거야? 아니, 비밀.';
  if (p.extro < -30) return '그냥, 지금처럼. 이 집에서. 오래.';
  return '{call이} 아프지 않는 거. 그거면 돼.';
}

export default EVENTS;
