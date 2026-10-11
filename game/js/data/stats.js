// 12종 능력치 정의 (GDD 4.1)
export const STATS = [
  { id: 'hp',    name: '체력',   cat: 'body' },
  { id: 'str',   name: '근력',   cat: 'body' },
  { id: 'agi',   name: '민첩',   cat: 'body' },
  { id: 'int',   name: '지식',   cat: 'mind' },
  { id: 'cult',  name: '교양',   cat: 'mind' },
  { id: 'mag',   name: '마력',   cat: 'mind' },
  { id: 'chm',   name: '매력',   cat: 'social' },
  { id: 'eti',   name: '예절',   cat: 'social' },
  { id: 'elo',   name: '화술',   cat: 'social' },
  { id: 'sens',  name: '감수성', cat: 'inner' },
  { id: 'faith', name: '신앙',   cat: 'inner' },
  { id: 'moral', name: '도덕',   cat: 'inner' },
];
export const STAT_CATS = {
  body:   { name: '신체', color: '#c0504d' },
  mind:   { name: '지성', color: '#4f81bd' },
  social: { name: '사교', color: '#d9a441' },
  inner:  { name: '내면', color: '#9bbb59' },
};
export const STAT_MAX = 999;

// 능력치 상호 견제 (GDD 4.1): 한 능력치가 오를 때 다른 능력치가 소폭 깎임
export const STAT_TENSION = {
  str: { chm: -0.15 },
  mag: { faith: -0.15 },
  elo: { moral: -0.08 },
  faith: { mag: -0.10 },
  agi: { eti: -0.05 },
};

// 5축 성격 (GDD 4.3) -100 ~ +100
export const PERSONALITY = [
  { id: 'extro', name: '외향',  pos: '활발', neg: '내성' },
  { id: 'agree', name: '순응',  pos: '온순', neg: '반항' },
  { id: 'ambit', name: '야심',  pos: '야망', neg: '소박' },
  { id: 'roman', name: '감성',  pos: '낭만', neg: '현실' },
  { id: 'good',  name: '선악',  pos: '정의', neg: '교활' },
];

export const NPCS = [
  { id: 'cube',     name: '큐브',       role: '집사 요정' },
  { id: 'loren',    name: '마담 로렌',  role: '예절학교 교장' },
  { id: 'garrett',  name: '가렛',       role: '용병단장' },
  { id: 'elda',     name: '엘다',       role: '약초 마법사' },
  { id: 'leon',     name: '리온',       role: '동년배 소년' },
  { id: 'theodora', name: '테오도라',   role: '라이벌 소녀' },
];

export const SEASONS = ['winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter', 'winter'];
export const SEASON_NAME = { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' };

export function stageOf(age) {
  if (age <= 11) return { id: 'child', name: '유년기', eff: 0.75 };
  if (age <= 13) return { id: 'girl',  name: '소녀기', eff: 0.9 };
  if (age <= 15) return { id: 'teen',  name: '사춘기', eff: 1.0 };
  if (age <= 17) return { id: 'youth', name: '청년기', eff: 1.1 };
  return { id: 'adult', name: '성인', eff: 1.0 };
}
