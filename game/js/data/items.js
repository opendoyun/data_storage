// 상점 아이템 (GDD 4.5 의상·소품). 앞의 16개 id는 콘텐츠 계약서 §5에 고정되어 이벤트·엔딩이 참조한다 — id를 바꾸지 않는다.
// 설계 원칙
//  - 의상: 산 날 효과(onBuy) + 매달 조금씩(monthly, 능력치 +1). 일찍 살수록 값을 한다.
//  - 장신구·도구: 대개 산 날 효과만. 망원경과 연간 결정 해금품만 매달 +1 (또는 금전·스트레스).
//    (능력치 monthly를 늘리면 18세 능력치가 부풀어 히든 엔딩 문턱이 쉬워진다 — 시뮬레이터로 확인할 것)
//  - 책: 산 날 한 번에 크게(onBuy). 매달 효과 없음.
//  - 선물: 관계·신뢰. 소모품(unique:false): 스트레스 해소. 소모품에는 monthly를 두지 않는다(보유 수만큼 누적되므로).
//  - 반복 구매(unique:false) 물건은 스트레스만 움직인다. 능력치·관계·성격을 주면 돈으로 무한히 사 모을 수 있다
//    (상점에 구매 횟수 제한이 없고, 13세 이후 소지금 중앙값이 1000G를 넘는다). 관계를 주는 선물은 unique로.
//  - 의상은 캐릭터 디자인 바이블(흑백 기조 + 범주 포인트 색 + 금빛 별)을 따른다:
//      신체=검정 훈련복·진홍 / 지성=검정 학자 로브·남보라 / 사교=흰 골지 니트+검정 롱스커트·금색 / 내면=흰 로브+검정 숄·녹색
//  - 일부 물건은 연간 결정(annual.js)의 선택으로 상점에 들어온다: flag.annual_<나이>_<선택>.
//  - 가격 감각: 한 달 순수지 -150 ~ +200G. 소모품 20~70G · 책 80~110G · 도구/장신구 100~220G · 의상 90~520G · 망원경 450G.
//    시뮬 실측(일반 정책 400판, 생일 직전 소지금 하위25%/중앙): 11세 380/820 · 13세 355/1055 · 15세 530/1690 · 17세 550/2270G.
//    매달 +1 물건의 값어치 ≈ 남은 달 수만큼의 능력치. 일찍 살 수 있는 것일수록 비싸게(대략 남은 달당 2.2G 이상).
export const ITEMS = [
  // ── 고정 id 16종 (계약서 §5) ─────────────────────────────────────
  { id: 'ball_gown', name: '무도회 드레스', kind: 'outfit', price: 380, minAge: 12, unique: true,
    desc: '흰 비단에 검정 벨벳 허리띠, 치맛단엔 금실로 작은 별을 수놓았다. 목까지 단정히 여민 왕도 재단사의 솜씨.',
    onBuy: { 'stat.chm': +8, 'stat.eti': +4 }, monthly: { 'stat.chm': +1 } },
  { id: 'travel_cloak', name: '여행용 망토', kind: 'outfit', price: 160, minAge: 12, unique: true,
    desc: '진홍 안감을 댄 검정 양모 망토. 후드를 쓰면 은빛 머리도 비바람도 감쪽같이 가려진다.',
    onBuy: { 'stat.hp': +4, 'stat.agi': +2 }, monthly: { 'stat.hp': +1 } },
  { id: 'practice_sword', name: '연습용 검', kind: 'tool', price: 130, unique: true,
    desc: '가렛이 항구 목수에게 깎아 달라고 한 참나무 목검. 손잡이에 진홍 끈을 감았다. 진검은 열여덟이 되면.',
    onBuy: { 'stat.str': +5, 'stat.agi': +3 } },
  { id: 'star_atlas', name: '별자리 도감', kind: 'book', price: 110, unique: true,
    desc: '세 개의 달이 차고 기우는 날과 사계절 별자리를 손으로 그려 넣은 도감. 맨 끝 장은 비어 있다.',
    onBuy: { 'stat.int': +5, 'stat.sens': +3, 'pers.roman': +2 } },
  { id: 'telescope', name: '놋쇠 망원경', kind: 'tool', price: 450, minAge: 13, unique: true,
    desc: '바다 건너에서 들여온 놋쇠 망원경. 세 번째 달의 흉터까지 보인다. 오래 들여다보면 손끝에 별빛이 고인다.',
    onBuy: { 'stat.int': +6, 'stat.sens': +3, 'stat.mag': +2 }, monthly: { 'stat.int': +1 } },
  { id: 'herb_kit', name: '약초 상자', kind: 'tool', price: 100, unique: true,
    desc: '말린 약초 서른 가지와 작은 돌절구, 이름표 붙은 유리병들. 엘다의 것과 꼭 닮았다.',
    onBuy: { 'stat.int': +3, 'stat.mag': +3 } },
  { id: 'lute', name: '류트', kind: 'tool', price: 200, unique: true,
    desc: '여섯 줄 류트. 서툰 화음에도 방 안에 금빛 먼지가 인다.',
    onBuy: { 'stat.sens': +6, 'stat.chm': +2 }, monthly: { stress: -1 } },
  { id: 'sewing_kit', name: '재봉 상자', kind: 'tool', price: 70, unique: true,
    desc: '흰 실, 검정 실, 금실 한 타래와 은 골무. 흑백 옷 안감에 별 하나 숨기기 딱 좋다.',
    onBuy: { 'stat.sens': +3, 'stat.cult': +2 } },
  { id: 'dancing_shoes', name: '무용화', kind: 'outfit', price: 170, minAge: 12, unique: true,
    desc: '발끝을 단단히 받쳐 주는 검정 무용화. 발목 리본만 금색이다.',
    onBuy: { 'stat.agi': +3, 'stat.chm': +3 }, monthly: { 'stat.agi': +1 } },
  { id: 'silver_hairpin', name: '별 모양 은 머리핀', kind: 'accessory', price: 220, unique: true,
    desc: '작은 별이 박힌 은 머리핀. 은백색 옆머리에 꽂으면 반짝임이 어디서 시작되는지 알 수 없게 된다.',
    onBuy: { 'stat.chm': +6, 'stat.sens': +2, stress: -3 } },
  { id: 'holy_pendant', name: '성당의 펜던트', kind: 'accessory', price: 110, unique: true,
    desc: '녹색 끈에 꿴 작은 금빛 펜던트. 저녁 종소리 아래에서 축복을 받았다.',
    onBuy: { 'stat.faith': +5, 'stat.moral': +2 } },
  { id: 'ledger_book', name: '가죽 장부', kind: 'book', price: 120, unique: true,
    desc: '칸이 반듯하게 그어진 가죽 장부와 깃펜. 적어 두기 시작하면 새는 돈이 보인다.',
    onBuy: { 'stat.elo': +3, 'stat.int': +3 }, monthly: { gold: +4 } },
  { id: 'warm_coat', name: '털 외투', kind: 'outfit', price: 120, unique: true,
    desc: '검정 모직에 흰 털 깃을 단 겨울 외투. 단추는 별 모양 나무 단추.',
    onBuy: { 'stat.hp': +3, stress: -4 }, monthly: { stress: -1 } },
  { id: 'cat_toy', name: '깃털 장난감', kind: 'gift', price: 20, unique: false, conditions: ['flag.has_cat'],
    desc: '달무리가 사족을 못 쓰는 깃털 낚싯대. 사흘이면 너덜너덜해지니 또 사야 한다.',
    onBuy: { stress: -5 } },
  { id: 'tonic', name: '기운 나는 약', kind: 'consumable', price: 70, unique: false,
    desc: '엘다가 달여 준 쌉싸름한 약. 한 병이면 사나흘은 푹 잔다.',
    onBuy: { stress: -15 } },
  { id: 'diary', name: '자물쇠 일기장', kind: 'gift', price: 80, minAge: 12, unique: true,
    desc: '검정 가죽 표지에 금빛 자물쇠. 열쇠는 하나뿐이고, 그건 아이 몫이다.',
    onBuy: { 'stat.sens': +2, trust: +3, stress: -4 }, monthly: { stress: -1 } },

  // ── 의상: 단계·범주별 (캐릭터 디자인 바이블) ──────────────────────
  { id: 'collar_dress', name: '흰 깃 검정 원피스', kind: 'outfit', price: 90, unique: true, conditions: ['age <= 12'],
    desc: '동그란 흰 깃에 무릎 아래까지 오는 검정 원피스. 금방 작아질 테지만 지금은 꼭 맞는다.',
    onBuy: { 'stat.chm': +3, 'stat.eti': +3, stress: -3 } },
  { id: 'training_wear', name: '검정 훈련복', kind: 'outfit', price: 240, unique: true,
    desc: '몸에 붙지 않는 검정 튜닉과 흰 셔츠 소매, 검정 바지와 부츠. 소매 끝에 진홍 실이 한 줄.',
    onBuy: { 'stat.hp': +3, 'stat.str': +3 }, monthly: { 'stat.str': +1 } },
  { id: 'scholar_robe', name: '검정 학자 로브', kind: 'outfit', price: 260, minAge: 12, unique: true,
    desc: '흰 하이넥 니트 위에 걸치는 검정 로브. 안감과 소매 끝은 남보라, 주머니는 꼭 책 한 권 크기.',
    onBuy: { 'stat.int': +4, 'stat.cult': +3 }, monthly: { 'stat.cult': +1 } },
  { id: 'ribbed_knit_set', name: '흰 골지 니트와 검정 롱스커트', kind: 'outfit', price: 240, minAge: 12, unique: true,
    desc: '흰 골지 하이넥 니트에 발목까지 내려오는 트임 없는 검정 롱스커트, 검정 단화. 소맷부리의 작은 단추만 금빛이다.',
    onBuy: { 'stat.chm': +5, 'stat.eti': +3 }, monthly: { 'stat.eti': +1 } },
  { id: 'white_robe_shawl', name: '흰 로브와 검정 숄', kind: 'outfit', price: 200, minAge: 12, unique: true,
    desc: '흰 로브 위에 두르는 검정 숄. 가장자리를 녹색 실로 감쳤고, 품에서 마른 풀 냄새가 난다.',
    onBuy: { 'stat.sens': +3, 'stat.moral': +3, stress: -5 }, monthly: { 'stat.faith': +1 } },
  { id: 'riding_coat', name: '검정 승마 외투', kind: 'outfit', price: 340, minAge: 15, unique: true,
    desc: '허리선이 곧은 검정 승마 외투와 무릎까지 오는 부츠. 걸음마다 진홍 안감이 언뜻 비친다.',
    onBuy: { 'stat.agi': +4, 'stat.hp': +3, 'stat.chm': +2 }, monthly: { 'stat.agi': +1 } },
  { id: 'ceremony_dress', name: '성년식 예복', kind: 'outfit', price: 520, minAge: 16, unique: true,
    desc: '흰 비단 하이넥 예복에 짧은 검정 망토, 옷깃엔 금실 별 하나. 열여덟 살 봄을 위해 미리 맞춘다.',
    onBuy: { 'stat.chm': +6, 'stat.eti': +6, trust: +4 }, monthly: { 'stat.chm': +1, 'stat.eti': +1 } },

  // ── 장신구 (연간 결정으로 해금) ───────────────────────────────────
  { id: 'leather_bracers', name: '가죽 팔 보호대', kind: 'accessory', price: 160, unique: true, conditions: ['flag.annual_12_garrett'],
    desc: '가렛이 단골 가죽장이에게 부탁해 둔 팔 보호대. 안쪽에 작은 진홍 별이 찍혀 있다.',
    onBuy: { 'stat.str': +3, 'stat.hp': +2 }, monthly: { 'stat.hp': +1 } },
  { id: 'lace_fan', name: '검정 레이스 부채', kind: 'accessory', price: 160, unique: true, conditions: ['flag.annual_12_loren'],
    desc: '마담 로렌이 "이제 쓸 때가 되었군요" 하며 가게를 알려 준 부채. 펼치면 금색 테두리가 드러난다.',
    onBuy: { 'stat.eti': +4, 'stat.chm': +2 }, monthly: { 'stat.elo': +1 } },
  { id: 'white_gloves', name: '무도회용 흰 장갑', kind: 'accessory', price: 140, unique: true, conditions: ['flag.annual_16_debut'],
    desc: '손목에 진주 단추가 하나. 데뷔 무도회를 치른 아가씨만 맞출 수 있는 왕도 장갑집의 물건.',
    onBuy: { 'stat.eti': +4, 'stat.chm': +3, reputation: +2 } },

  // ── 책 ───────────────────────────────────────────────────────────
  { id: 'hero_tales', name: '기사 이야기 전집', kind: 'book', price: 100, unique: true,
    desc: '약한 이의 편에 섰던 기사들의 이야기 열두 권. 책장 모서리마다 누군가 접어 둔 자국이 있다.',
    onBuy: { 'stat.moral': +5, 'stat.cult': +2, 'pers.good': +2 } },
  { id: 'poetry_book', name: '세 달의 시집', kind: 'book', price: 80, unique: true,
    desc: '세 개의 달에 바친 옛 시인의 노래. 여백마다 마른 꽃잎이 끼워져 있다.',
    onBuy: { 'stat.sens': +4, 'stat.cult': +3, 'pers.roman': +2 } },

  // ── 도구 (연간 결정으로 해금) ─────────────────────────────────────
  { id: 'work_apron', name: '가죽 작업 앞치마', kind: 'tool', price: 80, unique: true, conditions: ['flag.annual_11_work'],
    desc: '방앗간 할머니가 손수 치수를 재 준 가죽 앞치마. 주머니가 여섯 개라 일감이 술술 들어온다.',
    onBuy: { 'stat.hp': +2, 'stat.str': +2 }, monthly: { gold: +3 } },
  { id: 'ash_staff', name: '물푸레 지팡이', kind: 'tool', price: 160, unique: true, conditions: ['flag.annual_12_elda'],
    desc: '엘다의 오두막 뒤 물푸레나무 가지로 깎은 지팡이. 짚을 때마다 끝에서 작은 별빛이 튄다.',
    onBuy: { 'stat.mag': +4, 'stat.hp': +2 }, monthly: { 'stat.mag': +1 } },
  { id: 'library_pass', name: '왕립 도서관 열람패', kind: 'tool', price: 160, unique: true, conditions: ['flag.annual_13_capital'],
    desc: '왕도 학당의 추천으로 발급받는 놋쇠 열람패. 마음껏 빌리되, 늦지 않게 돌려줄 것.',
    onBuy: { 'stat.int': +3, 'stat.cult': +3 }, monthly: { 'stat.cult': +1 } },
  { id: 'brass_compass', name: '놋쇠 나침반', kind: 'tool', price: 140, unique: true, conditions: ['flag.annual_13_harbor'],
    desc: '상단 견습을 마친 날 선장이 귀띔해 준 가게의 나침반. 바늘이 가끔 북쪽 대신 하늘을 가리킨다.',
    onBuy: { 'stat.int': +3, 'stat.agi': +2 }, monthly: { 'stat.agi': +1 } },

  // ── 선물 ──────────────────────────────────────────────────────────
  { id: 'sweets_box', name: '왕도 과자 상자', kind: 'gift', price: 60, unique: true,
    desc: '설탕 별을 얹은 왕도 과자가 가득 든 양철 상자. 리온과 테오도라에게 나눠 주고 나면, 빈 상자는 셋의 보물함이 된다.',
    onBuy: { stress: -4, 'rel.leon': +4, 'rel.theodora': +4 } },
  { id: 'cube_cloth', name: '큐브 전용 광택 천', kind: 'gift', price: 30, unique: true,
    desc: '큐브가 몇 해째 노래를 부르던 비단 광택 천. 닦아 주면 나비넥타이까지 반짝인다.',
    onBuy: { 'rel.cube': +4, stress: -3 } },

  // ── 소모품 ────────────────────────────────────────────────────────
  { id: 'honey_cake', name: '꿀 케이크', kind: 'consumable', price: 25, unique: false,
    desc: '장터 빵집의 꿀 케이크. 한 조각이면 울적한 오후가 조금 짧아진다.',
    onBuy: { stress: -6 } },
  { id: 'theater_ticket', name: '극단 공연 관람권', kind: 'consumable', price: 45, minAge: 12, unique: false,
    desc: '항구 극단 저녁 공연의 객석 한 자리. 막이 내리고도 한참을 손뼉 치게 된다.',
    onBuy: { stress: -10 } },
];
export const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]));
