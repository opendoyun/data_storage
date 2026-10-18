// 이벤트 집계. 실제 데이터는 js/data/events/*.js (파일당 default export 배열)
import ALL, { EVENT_SOURCES } from './events/index.js';
export const EVENTS = ALL;
export const EVENT_MAP = Object.fromEntries(EVENTS.map(e => [e.id, e]));
export { EVENT_SOURCES };
