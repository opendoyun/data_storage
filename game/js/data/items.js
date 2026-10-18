// 상점 아이템 (GDD 4.5 의상·소품). id 목록은 콘텐츠 계약서 §5에 고정되어 이벤트가 참조할 수 있다.
// 아래는 v1 기본 정의 — 빌드 단계(E3)에서 설명·가격·효과를 다듬고 아이템을 추가한다. id는 바꾸지 않는다.
export const ITEMS = [
  { id: 'ball_gown',      name: '무도회 드레스',   kind: 'outfit',     price: 320, minAge: 12, unique: true, desc: '왕도 재단사가 지은 푸른 드레스.', onBuy: { 'stat.chm': +8 } },
  { id: 'travel_cloak',   name: '여행용 망토',     kind: 'outfit',     price: 140, minAge: 12, unique: true, desc: '비바람을 막아 주는 두꺼운 망토.', onBuy: { 'stat.hp': +3 } },
  { id: 'practice_sword', name: '연습용 검',       kind: 'tool',       price: 120, unique: true, desc: '날을 세우지 않은 연습용 검.', onBuy: { 'stat.str': +4 } },
  { id: 'star_atlas',     name: '별자리 도감',     kind: 'book',       price: 90,  unique: true, desc: '세 개의 달과 별자리가 그려진 도감.', onBuy: { 'stat.int': +4 } },
  { id: 'telescope',      name: '놋쇠 망원경',     kind: 'tool',       price: 400, minAge: 13, unique: true, desc: '항구에서 들여온 귀한 망원경.', onBuy: { 'stat.int': +6, 'stat.sens': +3 } },
  { id: 'herb_kit',       name: '약초 상자',       kind: 'tool',       price: 80,  unique: true, desc: '말린 약초와 작은 절구.', onBuy: { 'stat.int': +2, 'stat.mag': +2 } },
  { id: 'lute',           name: '류트',           kind: 'tool',       price: 180, unique: true, desc: '여섯 줄 류트.', onBuy: { 'stat.sens': +5 } },
  { id: 'sewing_kit',     name: '재봉 상자',       kind: 'tool',       price: 60,  unique: true, desc: '바늘, 실, 골무.', onBuy: { 'stat.sens': +2, 'stat.cult': +1 } },
  { id: 'dancing_shoes',  name: '무용화',         kind: 'outfit',     price: 150, minAge: 12, unique: true, desc: '발끝이 단단한 무용화.', onBuy: { 'stat.agi': +3, 'stat.chm': +2 } },
  { id: 'silver_hairpin', name: '별 모양 은 머리핀', kind: 'accessory', price: 200, unique: true, desc: '작은 별이 박힌 은 머리핀.', onBuy: { 'stat.chm': +5 } },
  { id: 'holy_pendant',   name: '성당의 펜던트',   kind: 'accessory',  price: 100, unique: true, desc: '작은 금빛 펜던트.', onBuy: { 'stat.faith': +4 } },
  { id: 'ledger_book',    name: '가죽 장부',       kind: 'book',       price: 70,  unique: true, desc: '거래를 적는 가죽 장부.', onBuy: { 'stat.elo': +2, 'stat.int': +2 } },
  { id: 'warm_coat',      name: '털 외투',         kind: 'outfit',     price: 110, unique: true, desc: '겨울을 견디게 해 주는 외투.', onBuy: { 'stat.hp': +2 } },
  { id: 'cat_toy',        name: '깃털 장난감',     kind: 'gift',       price: 15,  desc: '달무리가 좋아하는 깃털.', onBuy: { stress: -3 } },
  { id: 'tonic',          name: '기운 나는 약',     kind: 'consumable', price: 60,  desc: '엘다의 처방. 피로가 풀린다.', onBuy: { stress: -12 } },
  { id: 'diary',          name: '자물쇠 일기장',   kind: 'gift',       price: 40,  minAge: 12, unique: true, desc: '작은 자물쇠가 달린 일기장.', onBuy: { 'stat.sens': +2, stress: -4 } },
];
export const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]));
