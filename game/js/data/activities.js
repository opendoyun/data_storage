// 스케줄 활동 정의 (GDD 4.2). 한 슬롯(열흘) 단위 기본 효과.
// stat: 능력치 증감, pers: 성격 드리프트, rel: NPC 관계, gold: 비용(-)/수입(+)
// stress: 스트레스 증감, minAge: 가능 연령
export const ACTIVITIES = [
  // ── 교육 (8) ───────────────────────────────────────────────────────
  { id: 'school',   type: 'edu', name: '일반학교',  desc: '읍내 학교. 기초 지식과 교양.',
    gold: -40, stress: 6,  stat: { int: 7, cult: 3 },               pers: { extro: 1 } },
  { id: 'etiquette',type: 'edu', name: '예절학교',  desc: '마담 로렌의 학교. 예절·교양·매력.',
    gold: -90, stress: 9,  stat: { eti: 7, cult: 3, chm: 2 },       pers: { agree: 1, ambit: 1 }, rel: { loren: 2 }, rep: 1 },
  { id: 'sword',    type: 'edu', name: '검술도장',  desc: '가렛이 봐주는 도장. 근력·민첩·체력.',
    gold: -70, stress: 10, stat: { str: 6, agi: 4, hp: 3 },         pers: { extro: 1, agree: -1 }, rel: { garrett: 2 } },
  { id: 'magic',    type: 'edu', name: '마법탑',    desc: '마력과 지식. 비용이 크고 피곤하다.',
    gold: -120, stress: 11, stat: { mag: 7, int: 3 },               pers: { roman: 1, extro: -1 }, rel: { elda: 1 }, minAge: 11 },
  { id: 'art',      type: 'edu', name: '예술원',    desc: '음악·그림·시. 감수성과 매력.',
    gold: -80, stress: 5,  stat: { sens: 7, chm: 3, cult: 1 },      pers: { roman: 2 } },
  { id: 'theology', type: 'edu', name: '신학교',    desc: '성당의 가르침. 신앙·도덕·교양.',
    gold: -30, stress: 5,  stat: { faith: 6, moral: 4, cult: 1 },   pers: { good: 2, agree: 1 } },
  { id: 'commerce', type: 'edu', name: '상업학원',  desc: '장부와 흥정. 화술·지식.',
    gold: -60, stress: 7,  stat: { elo: 6, int: 3 },                pers: { roman: -2, ambit: 1 } },
  { id: 'tutor',    type: 'edu', name: '가정교사',  desc: '왕도에서 모셔 온 가정교사. 비싸지만 여러 과목을 한꺼번에 끌어올린다.',
    gold: -220, stress: 8, stat: { int: 5, cult: 5, eti: 3, elo: 3, sens: 2 }, pers: { ambit: 1, agree: 1 }, rel: { loren: 1 }, minAge: 11 },
  { id: 'farmschool',type:'edu', name: '농업학교',  desc: '땅과 계절을 배운다. 체력·지식·감수성.',
    gold: -25, stress: 4,  stat: { hp: 4, int: 2, sens: 2 },        pers: { ambit: -1, roman: 1 } },

  // ── 아르바이트 (10) ────────────────────────────────────────────────
  { id: 'farm',     type: 'work', name: '농장일',    desc: '수확과 밭일. 체력·근력. 평원 사람들과 친해진다.',
    gold: 45,  stress: 7,  stat: { hp: 4, str: 3 },                  pers: { ambit: -1 }, rel: { elda: 1 } },
  { id: 'diner',    type: 'work', name: '식당',      desc: '서빙과 설거지. 화술·체력.',
    gold: 50,  stress: 8,  stat: { elo: 3, hp: 2, chm: 1 },          pers: { extro: 1 } },
  { id: 'inn',      type: 'work', name: '여관',      desc: '손님 응대. 매력·화술. 가끔 수상한 손님.',
    gold: 60,  stress: 9,  stat: { chm: 3, elo: 2, eti: 1 },         pers: { extro: 1, good: -1 } },
  { id: 'church',   type: 'work', name: '교회 봉사', desc: '보수는 적지만 마음이 맑아진다.',
    gold: 15,  stress: -2, stat: { faith: 3, moral: 3 },             pers: { good: 2 }, rep: 1 },
  { id: 'sewing',   type: 'work', name: '재봉소',    desc: '바느질. 감수성·교양. 조용한 일.',
    gold: 40,  stress: 5,  stat: { sens: 3, cult: 2 },               pers: { extro: -1 } },
  { id: 'smith',    type: 'work', name: '대장간',    desc: '망치질. 근력·체력. 매력이 조금 깎인다.',
    gold: 70,  stress: 11, stat: { str: 4, hp: 3, chm: -1 },         pers: { agree: -1 } },
  { id: 'castle',   type: 'work', name: '성 청소',   desc: '귀족을 가까이서 본다. 예절·교양.',
    gold: 55,  stress: 8,  stat: { eti: 3, cult: 2 },                pers: { ambit: 1 }, rel: { loren: 1 }, rep: 1 },
  { id: 'graveyard',type: 'work', name: '묘지기',    desc: '야간 근무. 보수가 좋지만 위험하고 무섭다.',
    gold: 110, stress: 15, stat: { hp: 2, mag: 2, faith: -1 },       pers: { good: -1, extro: -1 }, minAge: 13 },
  { id: 'shop',     type: 'work', name: '상점 점원', desc: '계산과 흥정. 화술·지식.',
    gold: 55,  stress: 7,  stat: { elo: 3, int: 2 },                 pers: { roman: -1 } },
  { id: 'theater',  type: 'work', name: '극단 단역', desc: '무대 위에서. 매력·감수성·화술.',
    gold: 35,  stress: 6,  stat: { chm: 3, sens: 2, elo: 1 },        pers: { extro: 2, roman: 1 }, minAge: 12, rep: 1 },

  // ── 자유행동 ───────────────────────────────────────────────────────
  { id: 'rest',     type: 'free', name: '휴식',      desc: '집에서 쉰다. 스트레스가 크게 내려간다.',
    gold: -10, stress: -22, stat: { hp: 1 },                         pers: { }, rel: { cube: 1 } },
  { id: 'adventure',type: 'free', name: '모험',      desc: '근교 숲과 폐허 탐험. 위험하지만 보상이 있다.',
    gold: 0,   stress: 8,  stat: { agi: 4, str: 2, hp: 2, mag: 1 },  pers: { extro: 1, agree: -1, good: 0 }, rel: { garrett: 1 }, minAge: 12 },
  { id: 'shopping', type: 'free', name: '쇼핑',      desc: '옷과 소품. 매력이 오르고 기분이 풀린다.',
    gold: -80, stress: -8, stat: { chm: 3, cult: 1 },                pers: { roman: 1, ambit: 1 } },
  { id: 'outing',   type: 'free', name: '친구와 외출', desc: '리온·테오도라와 어울린다.',
    gold: -20, stress: -10, stat: { elo: 1, sens: 1 },               pers: { extro: 2 }, rel: { leon: 3, theodora: 2 } },
  { id: 'autonomy', type: 'free', name: '아이에게 맡기기', desc: '이 열흘은 아이가 스스로 정한다. 무엇을 할지는 성격에 달렸다.',
    gold: 0,   stress: -5, stat: { }, pers: { agree: 2 }, trust: 3 },
];

export const ACTIVITY_MAP = Object.fromEntries(ACTIVITIES.map(a => [a.id, a]));

// 아이가 자율행동 시 성격 벡터에 따라 고르는 활동 (GDD 4.3)
export function autonomyPreferences(p) {
  const w = {};
  const add = (id, v) => { w[id] = (w[id] || 0) + Math.max(0, v); };
  add('outing',    30 + p.extro * 0.4);
  add('rest',      25 - p.extro * 0.2);
  add('adventure', 15 + Math.max(0, -p.agree) * 0.4 + p.extro * 0.2);
  add('art',       10 + p.roman * 0.3);
  add('school',    10 + p.ambit * 0.3 - p.roman * 0.1);
  add('church',    8 + p.good * 0.3);
  add('shopping',  8 + p.roman * 0.1 + p.ambit * 0.1);
  add('graveyard', 2 + Math.max(0, -p.good) * 0.3);
  add('theater',   6 + p.extro * 0.2 + p.roman * 0.2);
  return w;
}
