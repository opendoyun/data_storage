// 상점 아이템 (GDD 4.5 의상·소품). 빌드 단계에서 채워진다.
export const ITEMS = [];
export const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]));
