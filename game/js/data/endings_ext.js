// 확장 엔딩 16종 (GDD 4.8 목표 40종 + 히든 8종 중 v0.1에 없던 것) — 일반 11 + 히든 5
// 점수 규칙은 endings.js와 같다: score = Σ(stat×w) × (1+Σ pers×coef) × gate + bonus. 히든은 게이트만 맞으면 점수와 무관하게 선택된다.
// 게이트의 진로 플래그는 콘텐츠 계약 §6의 공용 플래그만 쓴다 (b04a·b04b·b05·b06·b07·b08·b11·b12·b13·b14가 세팅).
// 에필로그는 "10년 후" 장면 2~4문장. 이 회차의 연쇄에서만 나오는 사람·물건(마렌 선장, 별철, 이네스 선생님의 분필 상자, 에피,
//   반달 단추, 세라핀, 백 번의 깜박임 등)을 한 가지씩 돌려준다. 함수형 에필로그는 출신·이전 회차처럼 문자열로 담을 수 없는 경우에만.
// 아이 묘사는 character-design.md v2: 은백색 생머리 · 졸린 듯 차분한 붉은 눈 · 감정이 일렁이면 금빛 별 · 흑백 옷.
// 밸런스(일반 정책 10종 3,000판 재측정): 일반 11종은 각 0.2~3.1%. 게이트를 통과한 판에서의 승률은 무희·고아원 원장 ~30%,
//   선장·의상 명인·명장·라이벌·영매 10~15%, 편력 기사·마을 선생님 ~8%, 천문학자·첩보원 2~3%(star_charts가 흔하고, 첩보원 후보는
//   재상·도적단 두목형 아이와 겹친다 — 노리고 키우면 seek 85~95% 도달). '플래그만 서면 이기는' 엔딩이 없게 한다: 고르게 키운 판에서
//   선장이 게이트 통과 시 93% 이기던 것을 ~50%로 낮췄다. 진로 활동 숙련(mastery) 보너스가 같은 범주의 기존 엔딩(성녀·용병왕 등)과
//   겨루는 몫이다. 히든 5종은 각 1.1~2.0%(자매들은 3회차 이상에서만).
//   어머니와의 재회·큐브의 정체·자매들은 17세 마지막 대화의 "뭘 해도 넌 내 딸이야"(final_home)를 요구한다 — 별로 떠나는
//   별의 여신(final_hers)과 갈라지는 '집에 남은 아이'의 히든 엔딩들이다.

// ── 보호자의 뒤를 잇다: 출신마다 되찾은 이름이 다르다 (b06 PAST 표와 같은 사건) ─────────────
const SUCCESSOR = {
  knight: '근위대 기사 명부에서 당신 이름 바로 아랫줄은 {name}의 것이다. 새 흑교가 놓이던 날, {name은} 다리 위에서 기사의 맹세 끝에 한 줄을 덧붙였다. "명령보다 물속의 아이가 먼저." 10년이 지난 지금, 그 한 줄은 근위대 수칙 맨 앞에 적혀 있다.',
  scholar: '「첫 번째 달의 연대기」 개정판의 발견자 칸에는 이제 이름이 둘이다. 당신, 그리고 폐허에서 둘째 권을 찾아낸 {name}. 학술원 첫 강의 날이면 {name은} 칠판에 같은 문장을 쓴다. "발견은 찾은 사람의 것이 아니라 진실의 것이다." 강의실 맨 뒷자리 하나는 10년째 당신 자리다.',
  merchant: '항구에 「은빛 갈매기 2호」가 떴다. 선주는 {name}, 장부는 두 권이다. 한 권은 길드에, 한 권은 선원 가족 누구나 펼쳐 볼 수 있게 항구 게시판 옆에 걸려 있다. 당신이 이름을 잃었던 그 일을, 딸은 10년 만에 항구의 규칙으로 바꿔 놓았다.',
  priest: '돌림감기가 다시 돈 겨울, 성당 문을 활짝 연 사람은 젊은 사제 {name이었}다. 이번에는 아무도 그 문을 막지 않았다. 제단 옆에는 금 촛대 대신, 당신이 돌려받아 딸에게 물려준 낡은 영대가 걸려 있다. 잿빛 겨울의 병자 명부는 이제 {name}의 글씨로 이어진다.',
  adventurer: '무너진 일곱 번째 계단의 맨 아래까지 내려간 첫 사람은 {name이었}다. 그녀는 그곳에서 세린의 일지 나머지 장을 찾아 조합 명판 옆에 걸었다. 지금 항구 모험가 조합 규칙의 첫 줄은 {name이} 썼다. "돌아올 때는 다 같이." 가렛은 그 줄 앞을 지날 때마다 잔을 든다.',
};

// ── 자매들: 이전 회차의 딸들 (s.legacy: 최근 아이부터 최대 5명). 차림은 b14 들판 장면(CAT.lookShort)과 같은 그림 ──
const LEGACY_LOOK = {
  '왕실/정치': '남색 망토를 두른', '무예': '닳은 검을 멘', '학문/마법': '손끝에 빛 알갱이를 띄운', '예술/문화': '악기 가방을 멘',
  '생활/상업': '열쇠 꾸러미를 찬', '신앙': '흰 순례자 옷을 입은', '어둠': '두건을 반쯤 내린', '관계': '털실 목도리를 두른', '히든': '머리칼 끝에 별빛을 매단',
};
const COUNT_WORD = ['', '한', '두', '세', '네', '다섯'];
// 밤 이름은 b14 연쇄와 같은 「세 달이 나란히 뜨는 밤」(b05의 '세 달이 겹치는 밤'과 다른 밤). 막내와 이름이 같은 언니는 '또 한 사람의 ○○', 둘째부터 '또 다른 ○○'.
function sistersEpilogue(s) {
  const all = (s.legacy || []).filter(l => l && l.name);
  let same = 0;
  const shown = all.slice(0, 3).map(l => `${LEGACY_LOOK[l.cat] || '여행 망토를 두른'} ${l.name !== s.name ? l.name : same++ ? `또 다른 ${l.name}` : `또 한 사람의 ${l.name}`}`);
  const extra = all.length - shown.length;
  const more = extra > 0 ? `, 그 뒤로 ${COUNT_WORD[extra]} 사람 더` : '';
  const chairs = COUNT_WORD[Math.min(5, Math.max(2, all.length))];
  const list = shown.length ? shown.join(', ') + more : '먼 길을 온 언니들';
  return `10년째, 세 달이 나란히 뜨는 밤이면 평원의 작은 집 식탁에 의자가 ${chairs} 개 더 놓인다. ${list}, 그리고 막내 {name}. `
    + '언니들은 해 뜨기 전에 가야 한다며 어디로 가는지 끝내 말하지 않지만, 그 밤에만 큰달 곁의 작은 별들이 보이지 않는다는 걸 {name이} 먼저 알아챘다. '
    + '다들 처음엔 당신에게 존댓말을 쓰다가, 찻잔이 두 번째로 빌 즈음이면 똑같이 말끝을 푼다.';
}

export const ENDINGS_EXT = [
  // ── 무예 ──────────────────────────────────────────────────────────
  // 고르게 키운 아이에게 넓은 가중치가 다 더해져 게이트만 열리면 거의 이기던 것을 줄였다(외향은 pers 계수로만 반영).
  { id: 'ship_captain', name: '선장', cat: '무예', weights: { agi: 0.8, hp: 0.6, elo: 0.5, int: 0.3 }, pers: { extro: 0.3, roman: 0.2 },
    gates: ['flag.sea_path', 'stat.agi >= 250', 'stat.hp >= 240'], bonus: [{ when: ['rel.garrett >= 50'], add: 100 }, { when: ['item.star_atlas >= 1'], add: 80 }, { when: ['flag.ran_away'], add: 60 }],
    epilogue: '은갈매기호의 새 선장은 졸린 눈의 은발인데, 폭풍이 오면 누구보다 먼저 돛대에 오른다. 마렌 선장에게 키를 물려받던 날, {name은} 손에 익은 매듭 하나에 이름을 붙였다. "집으로 돌아오는 매듭." 그 뒤로 은갈매기호는 어느 바다에 다녀오든 이 항구에서 열흘을 쉰다. 선장이 평원에 다녀와야 해서.' },
  { id: 'knight_errant', name: '편력 기사', cat: '무예', weights: { moral: 1.0, str: 0.7, hp: 0.5, agi: 0.4 }, pers: { good: 0.5, agree: -0.2 },
    gates: ['flag.knight_oath_wander', 'stat.str >= 220', 'stat.moral >= 150'], bonus: [{ when: ['pers.good >= 30'], add: 150 }, { when: ['stat.faith >= 150'], add: 60 }],
    epilogue: '로데릭에게 받은 문장 없는 방패에는 이제 문장이 있다. 세 개의 달 아래 지붕 하나. 편력 기사 {name은} 약한 이의 편에 서고, 받은 것보다 많이 돌려주고, 길이 끝날 때까지 걷는다. 그리고 그 길은 해마다 한 번, 꼭 평원의 작은 집 문 앞에서 끝난다.' },

  // ── 예술/문화 ─────────────────────────────────────────────────────
  { id: 'prima_dancer', name: '무희', cat: '예술/문화', weights: { chm: 0.7, sens: 0.6, agi: 0.6, hp: 0.2 }, pers: { roman: 0.3, extro: 0.3 },
    gates: ['flag.prima_debut', 'stat.agi >= 150', 'stat.chm >= 250'], bonus: [{ when: ['flag.dance_lessons'], add: 60 }, { when: ['item.dancing_shoes >= 1'], add: 60 }],
    epilogue: '무용극 「달의 세 자매」는 10년째 같은 주역으로 막을 올린다. 마지막 회전에서 {name}의 손끝을 떠나 객석까지 흩날리는 금빛 별을, 관객들은 아직도 무대 장치라고 믿는다. 초연 날 분장실에서 "별이 멈추질 않아" 하고 떨던 아이는 이제 그 별로 안무를 짠다. 객석 뒤편 맨 끝자리는 늘 비워 두고, 그 표는 평원으로 부친다.' },
  { id: 'tailor_master', name: '의상 명인', cat: '예술/문화', weights: { sens: 1.0, cult: 0.5, chm: 0.5, agi: 0.2 }, pers: { roman: 0.2, ambit: 0.2 },
    gates: ['flag.fashion_show', 'mastery.sewing >= 12', 'stat.sens >= 240'], bonus: [{ when: ['mastery.sewing >= 24'], add: 150 }, { when: ['mastery.sewing >= 40'], add: 300 }, { when: ['item.sewing_kit >= 1'], add: 60 }, { when: ['rel.theodora >= 50'], add: 40 }],
    epilogue: '왕도 큰길의 의상실 간판에는 바늘 하나와 별 하나가 그려져 있다. {name}의 옷은 흑백뿐인데, 입으면 어딘가에서 금빛이 반짝인다고들 한다. 안감 깊숙이 금실로 작은 별을 하나씩 숨겨 두기 때문이다. 진열장 맨 위 칸에는 처음 품평회 무대에 세웠던 그 옷이 걸려 있고, 그 옷만은 값을 매기지 않는다.' },

  // ── 생활/상업 ─────────────────────────────────────────────────────
  { id: 'master_smith', name: '명장 대장장이', cat: '생활/상업', weights: { str: 1.2, hp: 0.7, sens: 0.5, moral: 0.3 }, pers: { ambit: 0.2, roman: -0.1 },
    gates: ['flag.masterwork', 'mastery.smith >= 12', 'stat.str >= 280'], bonus: [{ when: ['mastery.smith >= 20'], add: 300 }, { when: ['mastery.smith >= 36'], add: 450 }, { when: ['flag.knows_origin'], add: 40 }],
    epilogue: '도르완 영감의 대장간 간판에는 이제 {name}의 이름이 걸려 있다. 별철 걸작 소문을 듣고 먼 데서 손님들이 찾아오지만, 정작 가장 많이 나가는 건 평원의 낫이다. "때는 쇠가 알려 준다. 들을 줄 알면." 영감에게 들은 말을 {name은} 견습생들에게 그대로 해 준다. 끝에 "흠"까지 붙여서.' },
  { id: 'village_teacher', name: '마을 선생님', cat: '생활/상업', weights: { cult: 0.6, sens: 0.5, moral: 0.5, elo: 0.3, int: 0.2 }, pers: { ambit: -0.4, good: 0.2, extro: 0.1 },
    gates: ['flag.teacher_offer', 'stat.cult >= 200', 'stat.moral >= 180'], bonus: [{ when: ['trust >= 70'], add: 60 }, { when: ['mastery.school >= 20'], add: 60 }],
    epilogue: '읍내 학교 어린 반 선생님은 은발에 늘 반쯤 졸린 붉은 눈을 하고, 숙제 걷는 날을 자주 잊는다. 대신 아이들 이름은 한 번도 잊은 적이 없다. 이네스 선생님이 물려준 분필 상자는 바닥이 드러난 지 오래지만, {name은} 새 분필을 사 오면 꼭 그 상자에 담는다. 졸업식 날이면 맨 뒷자리 아이부터 이름을 부른다.' },

  // ── 학문/마법 ─────────────────────────────────────────────────────
  // star_charts는 별 관측 취미가 있는 아이 절반쯤이 얻는 흔한 플래그라, 지식형 아이 중에서도 야심이 덜한(소박) 쪽이 재상 대신 이 길로 간다.
  { id: 'astronomer', name: '천문학자', cat: '학문/마법', weights: { int: 1.0, mag: 0.4, sens: 0.4, cult: 0.3 }, pers: { roman: 0.2, extro: -0.1, ambit: -0.2 },
    gates: ['flag.star_charts', 'stat.int >= 300'], bonus: [{ when: ['item.telescope >= 1'], add: 80 }, { when: ['flag.magic_awake'], add: 50 }, { when: ['item.star_atlas >= 1'], add: 40 }],
    epilogue: '학술원 연감에는 세 달의 궤도표를 새로 쓴 사람으로 {name}의 이름이 실렸다. 그래도 그녀는 일주일에 두 번, 이백열두 칸 등대 계단을 오른다. 아흔 날째 밤에 처음 본 그 네 번째 빛이 다시 돌아올 날을, {name은} 시각까지 계산해 두었다. 당신 집 달력에도 같은 날에 동그라미가 쳐져 있다.' },

  // ── 신앙 ──────────────────────────────────────────────────────────
  { id: 'orphanage_head', name: '고아원 원장', cat: '신앙', weights: { moral: 0.8, faith: 0.5, sens: 0.5, hp: 0.3, elo: 0.2 }, pers: { good: 0.4, ambit: -0.2 },
    gates: ['flag.orphanage_vow', 'stat.moral >= 250'], bonus: [{ when: ['flag.church_path'], add: 80 }, { when: ['flag.ran_away'], add: 60 }, { when: ['pers.good >= 30'], add: 100 }],
    epilogue: '등불의 집 문간에는 10년째 밤새 등불이 켜져 있다. 원장 {name은} 새 아이가 오는 첫날 밤이면 지금도 문간에 이불을 깔고 함께 잔다. 문 닫는 날 {name}의 소매를 붙잡던 열한 살 리코는 열아홉에 그 집의 첫 선생님이 되었다. 요즘은 둘이 번갈아 문간에서 잔다. 누구 차례인지는 늘 다툰다.' },

  // ── 어둠 ──────────────────────────────────────────────────────────
  // 군밤 장수로 변장해 누구와도 말을 섞는 요원이라 내성 계수는 두지 않는다.
  { id: 'royal_spy', name: '왕실 첩보원', cat: '어둠', weights: { int: 0.8, agi: 0.7, elo: 0.6, eti: 0.4 }, pers: { roman: -0.2, good: 0.1 },
    gates: ['flag.spy_recruited', 'stat.int >= 250', 'stat.agi >= 150'], bonus: [{ when: ['infamy <= 20'], add: 100 }, { when: ['stat.eti >= 250'], add: 60 }, { when: ['stat.int >= 400'], add: 80 }],
    epilogue: '밤 시장 군밤 장수 자리는 이제 은발의 젊은 여자가 지킨다. 옷깃의 반달 단추가 몇 개인지는 왕국 기밀이고, 그녀가 셋째 달 최고의 요원이라는 건 다섯 사람만 안다. 은퇴한 노나 할멈은 평원으로 이사 왔다. 둘은 가끔 당신 집 마당에서 군밤을 구우며 서로의 거짓말을 맞히는 내기를 하고, 심판은 늘 당신이다.' },
  { id: 'medium', name: '영매', cat: '어둠', weights: { sens: 1.0, mag: 0.8, faith: 0.4, int: 0.2 }, pers: { roman: 0.3, extro: -0.1 },
    gates: ['flag.ghost_friend', 'mastery.graveyard >= 5', 'stat.sens >= 200'], bonus: [{ when: ['flag.secret_night_work'], add: 120 }, { when: ['mastery.graveyard >= 15'], add: 120 }, { when: ['pers.roman >= 20'], add: 60 }],
    epilogue: '항구 빵집 「에피와 언니」의 할머니 주인은 평생 동생의 이름을 간판에서 내리지 않았다. 그 빵집을 찾아내 묘지 북쪽 담장까지 갓 구운 빵 냄새를 데려간 사람이 {name이었}다. 에피가 웃으며 떠난 뒤로, {name}의 집 문간에 걸린 푸른 등불은 길 잃은 이들의 이정표가 되었다. 살아 있는 손님은 세 번, 그렇지 않은 손님은 두 번 그 문을 두드린다. {name은} 어느 쪽에도 똑같이 차를 낸다.' },

  // ── 관계 ──────────────────────────────────────────────────────────
  { id: 'rival_partner', name: '평생의 라이벌', cat: '관계', weights: { eti: 0.6, chm: 0.6, elo: 0.5, cult: 0.4, int: 0.3 }, pers: { ambit: 0.4, extro: 0.2 },
    gates: ['flag.theodora_pact', 'rel.theodora >= 60'], bonus: [{ when: ['flag.ball_won'], add: 80 }, { when: ['rel.theodora >= 85'], add: 80 }],
    epilogue: '"10년 뒤에도, 50년 뒤에도." 그 약속의 10년째에 {name과} 테오도라는 왕도에 학교를 하나 세웠다. 학생들은 그곳을 "진홍과 흑백"이라 부르고, 교장실에는 똑같은 책상 두 개가 나란히 붙어 있다. 둘의 승부는 지금 1287 대 1287. 기록은 당신이 맡고 있다.' },

  // ── 히든 ──────────────────────────────────────────────────────────
  { id: 'mother_reunion', name: '어머니와의 재회', cat: '히든', hidden: true, weights: { sens: 1, moral: 1, mag: 0.5 }, pers: {},
    gates: ['flag.knows_origin', 'flag.mother_alive', 'flag.mother_found', 'flag.final_home', 'trust >= 80', 'rel.elda >= 80', 'stat.sens >= 400', 'stat.mag >= 100'], bonus: [],
    hint: '끊긴 자장가는 누군가 끝까지 이어 불러 주기를 기다린다. 북쪽 눈길 끝, 등불이 켜지는 마을에서.',
    epilogue: '서리마을의 등불지기는 이제 둘이다. 겨울이면 {name이} 흰눈 고개를 넘어가 어머니와 함께 집집마다 등불을 켜고, 봄이면 세라핀이 평원으로 내려와 당신의 부엌에서 감자를 깎는다. 세라핀은 딸을 아스텔이라 부르고 당신은 늘 부르던 이름으로 부르는데, {name은} 두 이름에 똑같이 웃으며 돌아본다. 끊겼던 자장가는 이제 세 사람의 목소리로 끝까지 불린다.' },
  { id: 'dragon_friend', name: '용의 친구', cat: '히든', hidden: true, weights: { agi: 1, hp: 1, sens: 0.5 }, pers: {},
    gates: ['flag.dragon_egg', 'flag.dragon_hatched', 'count.adventures >= 15', 'trust >= 60', 'stat.agi >= 250'], bonus: [],
    hint: '폐허 깊은 곳에서 금빛이 맥박 친다. 아주 많은 모험 끝에, 그것이 깨어날지도 모른다.',
    epilogue: '은빛 비늘에 붉은 눈. 평원 사람들은 이제 하늘에 용이 지나가도 놀라지 않는다. "{name} 아가씨 장 보러 가나 보네." 송아지만 하던 용은 집채만큼 자랐지만, 보름마다 산꼭대기에 내려앉아 함께 별을 볼 때면 여전히 그녀 무릎에 꼬리를 얹는다. 그리고 당신 집 지붕 위를 지날 때면 꼭 날개를 한 번 흔든다.' },
  { id: 'cube_true_form', name: '큐브의 정체', cat: '히든', hidden: true, weights: { mag: 1, sens: 1 }, pers: {},
    gates: ['flag.cube_secret_1', 'flag.cube_secret_2', 'rel.cube >= 90', 'flag.final_home', 'trust >= 70', 'stat.mag >= 300'], bonus: [],
    hint: '집사 요정은 거짓말을 잘 못한다. 아주 오래, 아주 가까이 지내면 언젠가 먼저 물어 올지도 모른다.',
    // b01(공주님 실언·옛말 자장가) · b13(백 번의 깜박임·백 년 전 판화·"매듭 푸는 법은 아가씨한테만"·"아가씨가 저한테 알려 줄 거예요")의 답.
    // 아이는 아기 때 하늘에 숨겨졌고 열 살에 들판에 떨어졌다(계약 §2·b05) — 큐브는 그 열 해를 품고 있던 별이다.
    epilogue: '열여덟 생일 밤, 큐브는 약속대로 나비넥타이 매듭 푸는 법을 {name}에게만 알려 주었다. 매듭이 풀리자 하얀 몸통이 눈처럼 녹고 손바닥만 한 금빛 별 하나가 남았다. 하늘에 숨겨진 아기를 열 해 동안 품고 있다가 들판까지 데려다준 별똥별의 마지막 조각. 밤마다 백 번씩 깜박인 건 하늘에 보내는 "오늘도 무사함"이었고, 백 년 전 판화 속 아이 곁을 지킨 것도 이 별이었다. "이제 아가씨가 알려 주세요. 저는 뭐예요?" "우리 식구." {name이} 다시 매 준 나비넥타이는 판화 속 그것처럼 조금 삐뚤었다. 10년이 지난 지금도 큐브는 그 매듭 그대로 케이크를 들고 떠다닌다.' },
  { id: 'guardian_successor', name: '보호자의 뒤를 잇다', cat: '히든', hidden: true, weights: { moral: 1, elo: 0.5, str: 0.5, int: 0.5 }, pers: {},
    gates: ['flag.guardian_past_revealed', 'flag.guardian_name_cleared', 'trust >= 85', 'stat.moral >= 300', 'stat.elo >= 150'], bonus: [],
    hint: '당신이 잃어버린 이름이 돌아오는 날, 아이는 그 이름 곁에 서고 싶어 할지도 모른다.',
    epilogue: (s) => SUCCESSOR[s.guardian] || SUCCESSOR.knight },
  { id: 'legacy_sisters', name: '자매들', cat: '히든', hidden: true, weights: { chm: 1, sens: 1 }, pers: {},
    gates: ['flag.legacy_met', 'legacyCount >= 2', 'flag.final_home', 'flag.star_watching', 'trust >= 80', 'stat.sens >= 400'], bonus: [],
    hint: '지난 아이들은 이번 8년 어딘가를 스쳐 지나간다. 별을 올려다보는 집에 머문 아이라면, 그들의 손을 잡을지도 모른다.',
    epilogue: sistersEpilogue },
];
