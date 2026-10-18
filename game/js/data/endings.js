// 엔딩 테이블 (GDD 4.8). score = Σ(stat×w) × (1+Σ pers×coef) × gate + bonus
// weights: 능력치 가중, pers: 성격 축 계수(-1~1), gates: 필수 조건, bonus: 조건부 가산
import { ENDINGS_EXT } from './endings_ext.js';
const ENDINGS_CORE = [
  // ── 왕실/정치 ─────────────────────────────────────────────────────
  { id: 'queen', name: '여왕', cat: '왕실/정치', weights: { eti: 0.9, cult: 0.7, elo: 0.6, chm: 0.5, moral: 0.3 }, pers: { ambit: 0.5, good: 0.1 },
    gates: ['stat.eti >= 420', 'stat.cult >= 320', 'reputation >= 30'], bonus: [{ when: ['flag.ball_won'], add: 120 }, { when: ['flag.leon_love'], add: 200 }, { when: ['flag.knows_origin'], add: 80 }],
    epilogue: '대관식 날, {name은} 왕관보다 먼저 객석 뒤편의 당신을 찾았다. 10년 뒤, 그녀의 치세는 "세 개의 달이 가장 밝았던 시대"로 기록된다.' },
  { id: 'duchess', name: '공작부인', cat: '왕실/정치', weights: { eti: 0.8, chm: 0.7, cult: 0.5 }, pers: { ambit: 0.3, roman: 0.2 },
    gates: ['stat.eti >= 350', 'rel.loren >= 40'], bonus: [{ when: ['flag.tea_party'], add: 80 }],
    epilogue: '마담 로렌의 소개로 공작가와 맺어졌다. {name은} 화려한 저택에서도 매년 겨울 평원의 작은 집으로 돌아온다.' },
  { id: 'diplomat', name: '외교관', cat: '왕실/정치', weights: { elo: 0.9, cult: 0.6, eti: 0.5, int: 0.4 }, pers: { extro: 0.3, ambit: 0.2 },
    gates: ['stat.elo >= 350', 'stat.cult >= 250'], bonus: [],
    epilogue: '{name은} 세 나라의 말을 하고 네 나라의 마음을 읽는다. 전쟁 전조는 그녀의 테이블에서 두 번 멈췄다.' },
  { id: 'chancellor', name: '재상', cat: '왕실/정치', weights: { int: 0.9, elo: 0.6, cult: 0.5, moral: 0.3 }, pers: { ambit: 0.5, roman: -0.2 },
    gates: ['stat.int >= 450', 'stat.elo >= 250', 'reputation >= 30'], bonus: [{ when: ['flag.scholar_path'], add: 100 }],
    epilogue: '왕국 최연소 재상. {name}의 서명이 들어간 법령은 늘 마지막 줄에 "평원의 아이들에게"라는 조항이 있다.' },

  // ── 무예 ──────────────────────────────────────────────────────────
  { id: 'guard_captain', name: '근위기사단장', cat: '무예', weights: { str: 0.8, agi: 0.6, hp: 0.5, moral: 0.4, eti: 0.2 }, pers: { ambit: 0.3, good: 0.3 },
    gates: ['stat.str >= 400', 'flag.knight_path'], bonus: [{ when: ['rel.garrett >= 60'], add: 100 }],
    epilogue: '흰 갑옷의 {name이} 왕의 곁에 선다. 그러나 매달 첫째 날은 휴가를 낸다. 평원의 집에 지붕을 손봐야 한다고.' },
  { id: 'mercenary_king', name: '용병왕', cat: '무예', weights: { str: 0.8, hp: 0.6, agi: 0.5, elo: 0.2 }, pers: { agree: -0.4, extro: 0.2 },
    gates: ['stat.str >= 430', 'rel.garrett >= 55', 'pers.agree <= 10'], bonus: [{ when: ['flag.debt_garrett == false', 'flag.ran_away'], add: 60 }],
    epilogue: '가렛의 용병단을 이어받은 {name}. 항구의 아이들은 "은발의 단장"이 나타나면 길을 비킨다. 그리고 사탕을 받는다.' },
  { id: 'adventurer', name: '모험가', cat: '무예', weights: { agi: 0.8, hp: 0.6, str: 0.4, mag: 0.3 }, pers: { extro: 0.3, agree: -0.3, roman: 0.2 },
    gates: ['stat.agi >= 300', 'count.adventures >= 6'], bonus: [{ when: ['flag.secret_adventure'], add: 120 }],
    epilogue: '{name은} 지도에 없는 곳을 찾아다닌다. 1년에 한 번, 어디서 왔는지 모를 편지가 도착한다. 늘 마른 꽃이 들어 있다.' },
  { id: 'bounty_hunter', name: '현상금 사냥꾼', cat: '무예', weights: { agi: 0.8, str: 0.5, elo: 0.4, int: 0.3 }, pers: { good: -0.2, agree: -0.3 },
    gates: ['stat.agi >= 280', 'infamy >= 10'], bonus: [],
    epilogue: '법과 법 바깥의 경계에서 {name은} 일한다. 한 번도 무고한 사람을 잡은 적은 없다. 그 점을 그녀는 자랑스러워한다.' },

  // ── 학문/마법 ─────────────────────────────────────────────────────
  { id: 'archmage', name: '대마법사', cat: '학문/마법', weights: { mag: 1.0, int: 0.6, sens: 0.3 }, pers: { ambit: 0.3, roman: 0.2 },
    gates: ['stat.mag >= 450', 'flag.magic_awake'], bonus: [{ when: ['flag.tower_lessons'], add: 150 }, { when: ['flag.tower_choice_hers'], add: 80 }],
    epilogue: '탑의 가장 높은 방. {name은} 창문을 늘 평원 쪽으로 열어 둔다. 어머니가 도망쳤던 그 탑을, 딸은 집으로 만들었다.' },
  { id: 'royal_scholar', name: '왕실학자', cat: '학문/마법', weights: { int: 1.0, cult: 0.5, sens: 0.2 }, pers: { extro: -0.2, ambit: 0.2 },
    gates: ['stat.int >= 400'], bonus: [{ when: ['flag.scholar_path'], add: 120 }],
    epilogue: '{name}의 첫 저서 제목은 「별이 떨어지는 조건에 대하여」. 서문은 단 한 줄. "나를 주워 준 사람에게."' },
  { id: 'alchemist', name: '연금술사', cat: '학문/마법', weights: { mag: 0.7, int: 0.7, agi: 0.2 }, pers: { roman: -0.2, good: -0.1 },
    gates: ['stat.mag >= 250', 'stat.int >= 250'], bonus: [],
    epilogue: '항구의 뒷골목 연구실. {name이} 만든 약은 비싸고, 효과는 확실하고, 가난한 이에겐 공짜다.' },
  { id: 'herb_doctor', name: '약초의사', cat: '학문/마법', weights: { int: 0.6, mag: 0.4, moral: 0.5, sens: 0.3 }, pers: { good: 0.3, ambit: -0.3 },
    gates: ['rel.elda >= 40', 'stat.int >= 200'], bonus: [{ when: ['flag.knows_origin'], add: 100 }],
    epilogue: '엘다의 집을 이어받았다. 평원 사람들은 아플 때 {name을} 찾고, 외로울 때도 찾는다.' },

  // ── 예술/문화 ─────────────────────────────────────────────────────
  { id: 'court_musician', name: '궁정악사', cat: '예술/문화', weights: { sens: 1.0, chm: 0.5, cult: 0.4 }, pers: { roman: 0.4 },
    gates: ['stat.sens >= 380', 'flag.art_path'], bonus: [],
    epilogue: '{name}의 곡 「열흘」은 왕국 사람 누구나 흥얼거린다. 스케줄 표의 열흘 단위에서 제목을 따왔다는 건 당신만 안다.' },
  { id: 'stage_star', name: '극단 스타', cat: '예술/문화', weights: { chm: 0.9, sens: 0.6, elo: 0.4 }, pers: { extro: 0.5, roman: 0.2 },
    gates: ['stat.chm >= 350', 'flag.stage_star'], bonus: [],
    epilogue: '무대 위의 {name은} 천 명의 사람이 된다. 커튼콜에서는 늘 한 사람만 찾는다.' },
  { id: 'painter', name: '화가', cat: '예술/문화', weights: { sens: 0.9, int: 0.3, cult: 0.3 }, pers: { extro: -0.3, roman: 0.4 },
    gates: ['stat.sens >= 300'], bonus: [{ when: ['flag.has_cat'], add: 60 }],
    epilogue: '{name}의 그림에는 늘 세 개의 달과, 지붕이 삐딱한 집이 있다. 평론가들은 그 집을 "상징"이라 부른다. 상징이 아니다.' },
  { id: 'writer', name: '작가', cat: '예술/문화', weights: { int: 0.6, sens: 0.7, cult: 0.4 }, pers: { extro: -0.3, roman: 0.2 },
    gates: ['stat.int >= 250', 'stat.sens >= 250'], bonus: [{ when: ['flag.respected_privacy'], add: 100 }],
    epilogue: '{name}의 첫 소설은 한 아이와 보호자의 8년 이야기였다. 결말은 당신이 아는 것과 조금 다르다. 더 다정하다.' },

  // ── 생활/상업 ─────────────────────────────────────────────────────
  { id: 'merchant_lord', name: '대상인', cat: '생활/상업', weights: { elo: 0.9, int: 0.5, chm: 0.3 }, pers: { roman: -0.4, ambit: 0.4 },
    gates: ['stat.elo >= 300', 'flag.merchant_path'], bonus: [],
    epilogue: '항구의 절반이 {name}의 창고다. 장부 첫 줄에는 아직도 열한 살 때 받은 용돈 20G가 적혀 있다.' },
  { id: 'farm_owner', name: '농장주', cat: '생활/상업', weights: { hp: 0.8, str: 0.5, int: 0.3, sens: 0.3 }, pers: { ambit: -0.4, roman: 0.1 },
    gates: ['stat.hp >= 280', 'mastery.farm >= 10'], bonus: [{ when: ['rel.elda >= 30'], add: 60 }],
    epilogue: '평원 가장 넓은 밭. {name은} 수확제마다 통나무 들기에 나가고, 매년 이긴다. 당신 자리는 늘 맨 앞줄이다.' },
  { id: 'chef', name: '요리사', cat: '생활/상업', weights: { sens: 0.6, hp: 0.5, elo: 0.3, chm: 0.3 }, pers: { extro: 0.2 },
    gates: ['mastery.diner >= 10', 'stat.sens >= 150'], bonus: [],
    epilogue: '{name}의 식당 메뉴에는 "{call}의 탄 파이"가 있다. 제일 안 팔리고, 제일 안 내린다.' },
  { id: 'innkeeper', name: '여관 주인', cat: '생활/상업', weights: { chm: 0.6, elo: 0.5, hp: 0.4, eti: 0.2 }, pers: { extro: 0.3, ambit: -0.2 },
    gates: ['mastery.inn >= 10'], bonus: [{ when: ['flag.stranger_asked'], add: 50 }],
    epilogue: '항구의 여관 「세 개의 달」. 후드 쓴 손님이 오면 {name은} 웃으며 묻는다. "은발 아이 찾으세요? 저예요."' },

  // ── 신앙 ──────────────────────────────────────────────────────────
  { id: 'archbishop', name: '대주교', cat: '신앙', weights: { faith: 1.0, moral: 0.6, cult: 0.4, elo: 0.3 }, pers: { good: 0.4, ambit: 0.3 },
    gates: ['stat.faith >= 400', 'flag.church_path'], bonus: [],
    epilogue: '왕국 최초의 여성 대주교. {name}의 첫 설교 제목은 "주워진 자의 은혜". 당신은 맨 뒷자리에서 들었다.' },
  { id: 'saint', name: '성녀', cat: '신앙', weights: { faith: 0.9, moral: 0.8, sens: 0.4 }, pers: { good: 0.5, ambit: -0.2 },
    gates: ['stat.faith >= 320', 'stat.moral >= 300'], bonus: [{ when: ['count.forced <= 2'], add: 80 }],
    epilogue: '{name이} 지나간 곳에 병이 멎었다고들 한다. 그녀는 그런 말을 들으면 웃으며 고개를 젓고, 약초를 건넨다.' },
  { id: 'pilgrim', name: '순례자', cat: '신앙', weights: { faith: 0.7, hp: 0.5, sens: 0.4 }, pers: { ambit: -0.5, extro: -0.2 },
    gates: ['stat.faith >= 200'], bonus: [{ when: ['seen.b04b_pilgrim_return >= 1'], add: 220 }],
    epilogue: '{name은} 걷는다. 왕국 끝에서 끝까지. 돌아올 때마다 신발이 바뀌어 있고, 이야기가 늘어 있다.' },

  // ── 어둠 ──────────────────────────────────────────────────────────
  { id: 'assassin', name: '암살자', cat: '어둠', weights: { agi: 0.9, str: 0.4, mag: 0.3, elo: 0.2 }, pers: { good: -0.6, extro: -0.2 },
    gates: ['infamy >= 35', 'flag.shadow_path', 'stat.agi >= 250'], bonus: [],
    epilogue: '{name}의 이름을 아는 사람은 없다. 그러나 평원의 작은 집 우편함에는 매달 익명의 금화가 들어 있다.' },
  { id: 'bandit_boss', name: '도적단 두목', cat: '어둠', weights: { str: 0.7, elo: 0.6, agi: 0.4 }, pers: { good: -0.5, agree: -0.4, extro: 0.2 },
    gates: ['infamy >= 30', 'stat.str >= 200'], bonus: [{ when: ['flag.ran_away'], add: 80 }],
    epilogue: '산길의 도적단은 이상하게도 가난한 마차는 건드리지 않는다. 두목이 "집이 생각나서"라고 했다는 소문이다.' },
  { id: 'swindler', name: '사기꾼', cat: '어둠', weights: { elo: 0.9, chm: 0.6, int: 0.3 }, pers: { good: -0.5, roman: -0.2 },
    gates: ['infamy >= 20', 'stat.elo >= 250'], bonus: [],
    epilogue: '{name은} 왕국 절반을 속였다. 당신만은 한 번도. 그게 그녀의 유일한 규칙이다.' },

  // ── 관계 ──────────────────────────────────────────────────────────
  { id: 'royal_wedding', name: '왕자와의 결혼', cat: '관계', weights: { chm: 0.6, eti: 0.5, sens: 0.4, cult: 0.3 }, pers: { roman: 0.5 },
    gates: ['flag.leon_love', 'rel.leon >= 65'], bonus: [{ when: ['stat.eti >= 300'], add: 150 }],
    epilogue: '왕실은 반대했고, 리온은 왕위를 걸었고, {name은} "그럼 둘 다 시골에서 살자"고 했다. 결국 왕실이 졌다.' },
  { id: 'family_home', name: '가족', cat: '관계', weights: { hp: 0.3, sens: 0.4, moral: 0.4, cult: 0.2 }, pers: { ambit: -0.5, agree: 0.2 },
    gates: ['trust >= 75', 'flag.final_home'], bonus: [{ when: ['count.autonomy >= 10'], add: 150 }, { when: ['gHealth <= 50'], add: 100 }],
    epilogue: '{name은} 떠나지 않았다. 평원의 집에 방을 하나 더 냈다. 큐브는 여전히 케이크를 들고 떠다닌다. 당신은 매일 아침 아이의 목소리에 눈을 뜬다.' },
  { id: 'drifter', name: '떠도는 사람', cat: '관계', weights: { hp: 0.4, agi: 0.3, sens: 0.3 }, pers: { agree: -0.3 },
    gates: ['trust <= 30'], bonus: [{ when: ['count.forced >= 8'], add: 200 }],
    epilogue: '열여덟 생일 다음 날, {name은} 짐을 꾸렸다. 편지는 3년 뒤에 왔다. "잘 지내. 미워하진 않아. 그냥 멀리서 보고 싶었어."' },

  // ── 히든 ──────────────────────────────────────────────────────────
  { id: 'star_goddess', name: '별의 여신', cat: '히든', hidden: true, weights: { mag: 1, sens: 1, faith: 1 }, pers: {},
    gates: ['flag.knows_origin', 'flag.tower_choice_hers', 'flag.final_hers', 'stat.mag >= 400', 'trust >= 70'], bonus: [],
    epilogue: '세 개의 달이 겹친 밤, {name은} 하늘로 올라갔다. 그리고 내려왔다. "다녀왔어." 그 뒤로 왕국에는 네 번째 달이 뜬다. 평원의 집 바로 위에.' },
  { id: 'world_traveler', name: '세계 여행자', cat: '히든', hidden: true, weights: { agi: 1, elo: 1, sens: 1 }, pers: {},
    gates: ['count.autonomy >= 40', 'count.adventures >= 12', 'flag.secret_adventure', 'flag.final_hers', 'trust >= 70'], bonus: [],
    epilogue: '{name은} "다 보고 올게"라고 했다. 세계는 넓었고, 편지는 매달 왔다. 당신은 벽에 지도를 걸고 핀을 꽂는다. 핀이 모자란다.' },
  { id: 'time_reverse', name: '시간 역행', cat: '히든', hidden: true, weights: { mag: 1, int: 1 }, pers: {},
    gates: ['stat.mag >= 500', 'stat.int >= 500', 'count.collapses >= 2'], bonus: [],
    epilogue: '{name은} 시간을 되돌리는 마법을 완성했다. 그리고 쓰지 않았다. "쓰러졌던 날들도 내 거야." 그녀는 그 마법을 봉인하고, 봉인의 열쇠를 당신에게 줬다.' },
];

export const ENDINGS = [...ENDINGS_CORE, ...ENDINGS_EXT];
