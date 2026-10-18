// 보호자(플레이어) 출신. unlock: 메타 진행(별 조각)으로 해금되는 출신 (GDD 3.2, 4.9)
export const GUARDIANS = {
  knight:     { name: '전직 왕실 기사', gold: 800,  pension: 110, bonusCat: 'body',   rel: { garrett: 25 },             call: '아빠',   desc: '자금 800G · 신체 교육 +15%' },
  scholar:    { name: '떠돌이 학자',   gold: 550,  pension: 85,  bonusCat: 'mind',   rel: { elda: 20, loren: 10 },     call: '선생님', desc: '자금 550G · 지성 교육 +15% · 설득 유리', persuade: 40 },
  merchant:   { name: '은퇴한 상인',   gold: 1100, pension: 70,  bonusCat: 'social', rel: { theodora: 10 },            call: '아빠',   desc: '자금 1100G · 사교 교육 +15% · 아르바이트 수입 +10%', workBonus: 0.1, unlock: { shards: 3 } },
  priest:     { name: '은퇴한 사제',   gold: 450,  pension: 95,  bonusCat: 'inner',  rel: { elda: 10 },                call: '신부님', desc: '자금 450G · 내면 교육 +15% · 매달 스트레스 -2', stressRelief: 2, unlock: { shards: 6 } },
  adventurer: { name: '은퇴한 모험가', gold: 650,  pension: 80,  bonusCat: 'body',   rel: { garrett: 35 },             call: '엄마',   desc: '자금 650G · 모험 부상 확률 절반 · 모험 보물 +50%', adventureBonus: true, unlock: { shards: 10 } },
};
