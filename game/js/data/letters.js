// 후일담 편지 집계 (GDD 4.8 후일담 모드). 엔딩 id → [{ title, text }] 3통. 텍스트는 {name}/{call} 토큰 사용.
import { LETTERS_CORE, CATEGORY_LETTERS } from './letters_core.js';
import { LETTERS_EXT } from './letters_ext.js';
export const LETTERS = { ...LETTERS_CORE, ...LETTERS_EXT };
export { CATEGORY_LETTERS };
