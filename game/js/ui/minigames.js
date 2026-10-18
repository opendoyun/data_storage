// 미니게임 (GDD 4.7) — 시험(집중력 게이지) · 무도회(리듬) · 요리(타이밍) · 모험(턴제 간이 전투)
//
//   const score = await playMinigame('exam', { childName, title, stat, statName, value, dc, reducedMotion });
//   score ∈ [0,1] → 엔진이 판정 주사위(±60)를 (score - 0.5) × 120 으로 대체한다. 0.5 = 평균 굴림.
//   null          → 플레이어가 '건너뛰기(자동 판정)'를 골랐다.
//
// 외부 라이브러리 없음. 자체 전체화면 오버레이(z-index 70, 모달 50 위)를 띄우고, 끝나면 스스로 치우고 포커스를 돌려준다.
// 난이도: advantage = clamp((value - dc) / 150, -1, 1). 잘 키운 아이일수록 판정 창이 넓고 템포가 느리다.
// 모듈 최상위에서는 DOM을 건드리지 않는다(노드에서 모델만 불러 점수 보정 시뮬레이션 가능).
import { josa } from '../engine/josa.js';

// ──────────────────────────────────────────────────────────────────────
// 공개 정보
// ──────────────────────────────────────────────────────────────────────
export const MINIGAME_INFO = {
  exam: { name: '시험', genre: '집중력 게이지', stats: '지식·교양', secs: '약 18초',
    desc: '집중력 게이지 — 흔들리는 별을 금색 「집중의 띠」 안에 붙잡아 두세요.' },
  ball: { name: '무도회', genre: '리듬', stats: '예절·매력·민첩', secs: '약 20초',
    desc: '리듬 — 세 줄로 내려오는 별을 박자에 맞춰 밟으세요.' },
  cooking: { name: '요리', genre: '타이밍', stats: '감수성·체력', secs: '약 15초',
    desc: '타이밍 — 좌우로 움직이는 불 조절 바늘을 초록 구간에서 세 번 멈추세요.' },
  adventure: { name: '모험', genre: '턴제 간이 전투', stats: '근력·민첩·마력', secs: '10~30초',
    desc: '턴제 간이 전투 — 몬스터의 다음 행동을 보고 공격·방어·마법·도망을 고르세요.' },
};

// ──────────────────────────────────────────────────────────────────────
// 공용 도구
// ──────────────────────────────────────────────────────────────────────
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r1 = (x) => Math.round(x * 10) / 10;
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function advantageOf(ctx) {
  const v = Number(ctx?.value), d = Number(ctx?.dc);
  if (ctx?.value == null || ctx?.dc == null || !Number.isFinite(v) || !Number.isFinite(d)) return 0;
  return clamp((v - d) / 150, -1, 1);
}
export const starsOf = (score) => clamp(1 + Math.floor(clamp(score, 0, 1) * 5), 1, 5);
export const swingOf = (score) => Math.round((clamp(score, 0, 1) - 0.5) * 120);

// 4각 별 (별의 아이 상징). f: 허리 굵기
const star4d = (x, y, r, f = 0.16) => { const k = r * f; return `M${r1(x)} ${r1(y - r)}Q${r1(x + k)} ${r1(y - k)} ${r1(x + r)} ${r1(y)}Q${r1(x + k)} ${r1(y + k)} ${r1(x)} ${r1(y + r)}Q${r1(x - k)} ${r1(y + k)} ${r1(x - r)} ${r1(y)}Q${r1(x - k)} ${r1(y - k)} ${r1(x)} ${r1(y - r)}Z`; };
// 5각 별 (결과 별점)
const STAR5 = (() => { const p = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 7.6 : 17, a = -Math.PI / 2 + i * Math.PI / 5; p.push(`${r1(20 + r * Math.cos(a))} ${r1(21 + r * Math.sin(a))}`); } return `M${p.join('L')}Z`; })();

// ──────────────────────────────────────────────────────────────────────
// 공주 (character-design.md v2): 은백색 긴 생머리·일자 앞머리, 붉은 눈(나른한 눈매), 흑백 의상 + 범주 포인트색, 금색 4각 별
// ──────────────────────────────────────────────────────────────────────
const HAIR = { white: '#f1f2f8', silver: '#dfe3ee', gold: '#f2d16b', black: '#2b2b35', brown: '#7a4b2a', rose: '#e8a1b4' };
const EYES = { crimson: '#c4303a', violet: '#8e6bd6', blue: '#4f8fd6', green: '#5cb27a', amber: '#d6953f', gray: '#8a8f9e' };
const pickColor = (map, v, d) => map[v] || (/^#[0-9a-f]{3,8}$/i.test(String(v ?? '')) ? v : d);
// 셀 채색용: 머리색에서 그림자색을 만든다(밝은 머리는 라벤더 회색 쪽, 어두운 머리는 더 어둡게)
const rgbOf = (hex) => { let x = String(hex).slice(1); if (x.length <= 4) x = [...x.slice(0, 3)].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16) || 0); };
const mixHex = (a, b, t) => { const A = rgbOf(a), B = rgbOf(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const lightOf = (hex) => { const [r, g, b] = rgbOf(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
const SKIN = '#f8e7dc', LINE = '#3b2633', LIP = '#b0585e';

function eyesSVG(mood, ec) {
  const one = (x, y, right) => {
    if (mood === 'happy') return `<path d="M${x - 4.6} ${y + 1.4}Q${x} ${y - 4.2} ${x + 4.6} ${y + 1.4}" stroke="${LINE}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`;
    if (mood === 'hurt') { const s = right ? -1 : 1; return `<path d="M${x - 3 * s} ${y - 3.4}L${x + 3 * s} ${y + 0.2}L${x - 3 * s} ${y + 3.6}" stroke="${LINE}" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
    if (mood === 'daze') return `<ellipse cx="${x}" cy="${y + 1.8}" rx="4.2" ry="2.5" fill="${ec}"/><circle cx="${x - 1.3}" cy="${y + 1.1}" r="1" fill="#fff"/><path d="M${x - 5.2} ${y - 0.2}Q${x} ${y - 1.4} ${x + 5.2} ${y - 0.2}" stroke="${LINE}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    // calm / focus / sad — 큰 눈동자 + 밝은 하이라이트, 윗눈꺼풀이 살짝 덮는 나른한 눈매
    const lid = mood === 'focus' ? 6.4 : mood === 'sad' ? 4.2 : 5.6;
    return `<ellipse cx="${x}" cy="${y + 0.8}" rx="4.3" ry="5" fill="${ec}"/><ellipse cx="${x}" cy="${y + 1.5}" rx="2.3" ry="3" fill="#6d121b"/>`
      + `<path d="M${x - 5.6} ${y - 2.4}Q${x} ${y - lid} ${x + 5.6} ${y - 2.4}L${x + 5.6} ${y - 7.5}L${x - 5.6} ${y - 7.5}Z" fill="${SKIN}"/>`
      + `<circle cx="${x - 1.5}" cy="${y - 0.6}" r="1.6" fill="#fff"/><circle cx="${x + 1.5}" cy="${y + 2.8}" r=".8" fill="#fff" opacity=".85"/>`
      + `<path d="M${x - 5.4} ${y - 2.4}Q${x} ${y - lid} ${x + 5.4} ${y - 2.4}" stroke="${LINE}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  };
  return one(50, 56, false) + one(70, 56, true);
}
const MOUTH = {
  calm: `<path d="M57 67.2Q60 68.8 63 67.2" stroke="${LIP}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
  focus: `<path d="M57.6 67.6H62.4" stroke="${LIP}" stroke-width="1.4" stroke-linecap="round"/>`,
  happy: '<path d="M56.6 66.2Q60 72 63.4 66.2Z" fill="#c4545c"/>',
  daze: `<ellipse cx="60" cy="68" rx="1.5" ry="1.8" fill="${LIP}"/>`,
  hurt: `<path d="M56 68.4q2 -2 4 0t4 0" stroke="${LIP}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
  sad: `<path d="M57 68.8Q60 66.6 63 68.8" stroke="${LIP}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
};
function outfitSVG(o) {
  if (o === 'body') return '<path d="M33 140L35 98Q38 84 60 81Q82 84 85 98L87 140Z" fill="#1f1d24"/>'
    + '<path d="M35 98Q29 112 31 126L39 126Q37 112 41 101Z" fill="#f2f0f4"/><path d="M85 98Q91 112 89 126L81 126Q83 112 79 101Z" fill="#f2f0f4"/>'
    + '<rect x="30" y="116" width="10" height="9" rx="2" fill="#7a5232"/><rect x="80" y="116" width="10" height="9" rx="2" fill="#7a5232"/>'
    + '<path d="M51 82L60 93L69 82" stroke="#a3242f" stroke-width="2.6" fill="none" stroke-linejoin="round"/><path d="M36 128H84" stroke="#a3242f" stroke-width="3"/>';
  if (o === 'mind') return '<path d="M31 140L34 98Q38 84 60 81Q82 84 86 98L89 140Z" fill="#1d1b26"/>'
    + '<path d="M52 79H68V86L67 140H53L52 86Z" fill="#f2f0f4"/><path d="M52 86L49 140H53Z M68 86L71 140H67Z" fill="#4b3c8f"/>';
  if (o === 'inner') return '<path d="M32 140L35 98Q38 84 60 81Q82 84 85 98L88 140Z" fill="#f3f1ea" stroke="#d6d0bf" stroke-width=".8"/>'
    + '<path d="M35 93Q60 110 85 93L87 106Q60 122 33 106Z" fill="#1b1a1f"/>'
    + '<path d="M60 106V111" stroke="#d9c27a" stroke-width="1.2"/><circle cx="60" cy="114" r="3.2" fill="#e7c36a" stroke="#b8923a" stroke-width=".8"/><path d="M34 133H86" stroke="#2f6b45" stroke-width="3"/>';
  // social: 흰 골지 하이넥 니트 + 발목까지 오는 검정 롱스커트(트임 없음), 금색 포인트
  return '<path d="M34 120L36 98Q39 84 60 81Q81 84 84 98L86 120Z" fill="#f3f1f4" stroke="#d4d0da" stroke-width=".8"/>'
    + '<path d="M52.5 79H67.5V86Q60 89 52.5 86Z" fill="#f3f1f4" stroke="#d4d0da" stroke-width=".8"/>'
    + '<path d="M44 92V119M50 89V119M56 88V119M64 88V119M70 89V119M76 92V119" stroke="#dcd8e2" stroke-width=".9"/>'
    + `<path d="M33 119H87L95 140H25Z" fill="#1b1a1f"/><path d="${star4d(60, 95, 3.2)}" fill="#e7c36a"/>`;
}
const HAND = (x, y) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#f3d9c9"/>`;
const PROPS = {
  sword: `<path d="M97 62L88 124" stroke="#c49058" stroke-width="5" stroke-linecap="round"/><path d="M83 116L95 118" stroke="#6b4a2a" stroke-width="4" stroke-linecap="round"/>${HAND(88, 124)}`,
  book: `<rect x="42" y="108" width="36" height="24" rx="2.5" fill="#4b3c8f"/><rect x="45" y="110" width="30" height="20" rx="1" fill="#f1e8d2"/><path d="M60 110V130" stroke="#c9b98f"/><path d="M48 115H57M48 119H57M63 115H72M63 119H70" stroke="#b8a985" stroke-width=".8"/>${HAND(44, 125)}${HAND(76, 125)}<path d="${star4d(82, 102, 3.6)}" fill="#cdb8ff"/>`,
  ladle: `<path d="M95 84L87 125" stroke="#a7adb9" stroke-width="3.4" stroke-linecap="round"/><ellipse cx="96" cy="81" rx="6" ry="4" fill="#a7adb9"/>${HAND(87, 125)}`,
  wave: `<path d="M84 102Q93 94 93 83" stroke="#f3f1f4" stroke-width="7" stroke-linecap="round" fill="none"/>${HAND(93, 80)}<path d="${star4d(99, 71, 4.4)}" fill="#f4d27a"/>`,
};
const OUTFIT_OF = { exam: 'mind', ball: 'social', cooking: 'inner', adventure: 'body' };
const PROP_OF = { exam: 'book', ball: 'wave', cooking: 'ladle', adventure: 'sword' };

export function princessSVG({ outfit = 'social', mood = 'calm', prop = null, hair, eyes, crop = false, sparkle = true } = {}) {
  const hc = pickColor(HAIR, hair, HAIR.white), ec = pickColor(EYES, eyes, EYES.crimson), hs = 'rgba(70,72,110,.42)';
  const light = lightOf(hc) > 0.55;
  const shade = light ? mixHex(hc, '#6f73a0', 0.24) : mixHex(hc, '#000000', 0.32);   // 뒷머리·안쪽 그림자
  const shine = light ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.32)';
  const sp = sparkle ? `<g class="mg-tw" fill="#f4d27a">${[[15, 36, 5.5], [106, 30, 4.5], [108, 88, 3.6], [12, 96, 3.6]].map(([x, y, r], i) => `<path style="--d:${i * 0.55}s" d="${star4d(x, y, r)}"/>`).join('')}</g>` : '';
  const extra = mood === 'daze' ? '<path d="M84 39q3.2 4.2 0 6.4q-3.2 -2.2 0 -6.4z" fill="#9ec3ff"/>' : mood === 'sad' ? '<path d="M45 61q2 3 0 4.4q-2 -1.4 0 -4.4z" fill="#9ec3ff"/>' : '';
  // 옆머리(앞으로 늘어져 가슴께에서 끝이 갈라진다) — 왼쪽을 그리고 오른쪽은 거울
  const lock = (k) => { const X = (x) => r1(k < 0 ? x : 120 - x); return `<path d="M${X(35.5)} 41Q${X(29.5)} 70 ${X(33)} 99Q${X(34.5)} 111 ${X(37.5)} 121L${X(38.6)} 112.5L${X(41.6)} 118Q${X(40.6)} 101 ${X(43.2)} 88Q${X(40.2)} 66 ${X(43)} 45Z" fill="${hc}" stroke="${hs}" stroke-width=".7" stroke-linejoin="round"/>`
    + `<path d="M${X(37.6)} 52Q${X(35.2)} 76 ${X(37.4)} 104" stroke="${hs}" stroke-width=".6" fill="none"/>`; };
  return `<svg class="mg-princess" viewBox="${crop ? '28 18 64 64' : '0 0 120 140'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">`
    // 뒷머리: 허리까지 곧게, 끝은 가볍게 갈라져 흩날린다
    + `<path d="M31 52Q29 17 60 15Q91 17 89 52Q92 90 99 133L95 129.5L93.5 137L88.5 131.5L86.5 140H33.5L31.5 131.5L26.5 137L25 129.5L21 133Q28 90 31 52Z" fill="${shade}" stroke="${hs}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<path d="M27 96Q25 116 23.5 128M93 96Q95 116 96.5 128" stroke="${hs}" stroke-width=".6" fill="none"/>`
    + outfitSVG(outfit)
    + '<path d="M54 70H66V82Q60 85 54 82Z" fill="#f3d9c9"/><path d="M54 74Q60 78 66 74V70H54Z" fill="#e8c4b3"/>'
    + `<path d="M36 50Q36 74 60 76Q84 74 84 50Q84 28 60 28Q36 28 36 50Z" fill="${SKIN}"/>`
    + '<path d="M36.4 46.5Q60 53.5 83.6 46.5L83.8 50.5Q60 57 36.2 50.5Z" fill="#c98f8f" opacity=".2"/>'   // 앞머리 그림자
    + lock(-1) + lock(1)
    // 앞머리: 눈썹을 살짝 덮는 일자 앞머리, 끝이 몇 가닥 갈라진다
    + `<path d="M35 47.5Q34 25 60 24Q86 25 85 47.5L81.2 46.4L78 49.2L74.6 46.2L71 48.8L67 46.4L63.4 49.4L59.6 46.4L55.6 48.9L52 46.2L48.4 49.1L44.8 46.4L41.6 48.6L38.6 46.2Z" fill="${hc}" stroke="${hs}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<path d="M49 28.5q-4 8 -5 16.5M66.5 27.5q3 9 4 18.5M57.5 26.5q-1 9 -1.4 19.5M75 31q2.4 6 2.6 13" stroke="${hs}" stroke-width=".7" fill="none" stroke-linecap="round"/>`
    + `<path d="M41.5 36.2Q49.5 30.6 57.4 29.8M62.6 29.8Q70.5 30.6 78.5 36.2" stroke="${shine}" stroke-width="2.1" fill="none" stroke-linecap="round"/>`   // 천사 고리 하이라이트
    + `<path d="${star4d(79, 33, 4.6, 0.2)}" fill="#eef1f8" stroke="#9aa3bd" stroke-width=".6"/>`
    + eyesSVG(mood, ec)
    + '<ellipse cx="45" cy="62.5" rx="4.2" ry="2.2" fill="#f3a7a7" opacity=".55"/><ellipse cx="75" cy="62.5" rx="4.2" ry="2.2" fill="#f3a7a7" opacity=".55"/>'
    + (MOUTH[mood] || MOUTH.calm) + extra
    + (prop && PROPS[prop] ? PROPS[prop] : '')
    + sp + '</svg>';
}

// 몬스터 (12세 이용가: 귀엽고, 지면 달아난다)
const MONSTERS = [
  { id: 'slime', name: '이끼 슬라임', v: { claw: '몸통 박치기', smash: '점프 내려찍기', charge: '몸을 잔뜩 부풀린다', guard: '납작 엎드렸다' } },
  { id: 'mushroom', name: '심술 버섯', v: { claw: '포자 뿌리기', smash: '머리 박치기', charge: '갓을 부르르 떤다', guard: '갓 속에 쏙 숨었다' } },
  { id: 'bat', name: '꼬마 박쥐', v: { claw: '날개 치기', smash: '급강하 박치기', charge: '높이 날아올랐다', guard: '날개로 몸을 감쌌다' } },
];
function monsterSVG(id) {
  const shadow = '<ellipse cx="60" cy="104" rx="36" ry="5" fill="#000" opacity=".28"/>';
  let body;
  if (id === 'mushroom') body = '<path d="M44 64Q41 98 50 101H70Q79 98 76 64Z" fill="#f1e2c6" stroke="#9c845a" stroke-width="2"/>'
    + '<path d="M13 68Q15 22 60 18Q105 22 107 68Q60 80 13 68Z" fill="#d9534f" stroke="#8c2f2f" stroke-width="2"/>'
    + '<circle cx="36" cy="44" r="6.5" fill="#fbeee6"/><circle cx="60" cy="32" r="7.5" fill="#fbeee6"/><circle cx="85" cy="45" r="6.5" fill="#fbeee6"/><circle cx="48" cy="60" r="4" fill="#fbeee6"/><circle cx="74" cy="61" r="4" fill="#fbeee6"/>'
    + '<ellipse cx="52.5" cy="82" rx="2.6" ry="3.4" fill="#2a1d14"/><ellipse cx="67.5" cy="82" rx="2.6" ry="3.4" fill="#2a1d14"/><path d="M46.5 75.5l9 3M73.5 75.5l-9 3" stroke="#2a1d14" stroke-width="2" stroke-linecap="round"/><path d="M55 92q5 -3.5 10 0" stroke="#2a1d14" stroke-width="2" fill="none" stroke-linecap="round"/>';
  else if (id === 'bat') body = '<path d="M60 62L12 40Q22 58 16 76Q30 66 36 80Q44 68 52 78Z" fill="#5b3f8c" stroke="#2e1f4d" stroke-width="2" stroke-linejoin="round"/><path d="M60 62L108 40Q98 58 104 76Q90 66 84 80Q76 68 68 78Z" fill="#5b3f8c" stroke="#2e1f4d" stroke-width="2" stroke-linejoin="round"/>'
    + '<path d="M45 50L42 28L55 44ZM75 50L78 28L65 44Z" fill="#6e4ea8" stroke="#2e1f4d" stroke-width="2" stroke-linejoin="round"/><ellipse cx="60" cy="66" rx="21" ry="23" fill="#6e4ea8" stroke="#2e1f4d" stroke-width="2"/>'
    + '<ellipse cx="51.5" cy="62" rx="5" ry="6" fill="#ffd36a"/><ellipse cx="68.5" cy="62" rx="5" ry="6" fill="#ffd36a"/><circle cx="52.5" cy="63.5" r="2.6" fill="#2e1f4d"/><circle cx="67.5" cy="63.5" r="2.6" fill="#2e1f4d"/>'
    + '<path d="M52 75q8 5 16 0" stroke="#2e1f4d" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M55 76.5l2 4 2-3.4M61 77l2 3.4 2-4" fill="#fff"/><ellipse cx="60" cy="92" rx="6" ry="2.4" fill="#5b3f8c"/>';
  else body = '<path d="M16 98Q10 58 40 42Q60 30 80 42Q110 58 104 98Q60 106 16 98Z" fill="#7cc27a" stroke="#3f7d4a" stroke-width="2"/>'
    + '<ellipse cx="38" cy="84" rx="8" ry="5" fill="#5aa25e"/><ellipse cx="84" cy="78" rx="6" ry="4" fill="#5aa25e"/><ellipse cx="62" cy="96" rx="7" ry="3" fill="#5aa25e"/><ellipse cx="42" cy="54" rx="9" ry="5" fill="#fff" opacity=".3"/>'
    + '<path d="M60 36q-11 -14 2 -24q9 12 -2 24z" fill="#9bd16c" stroke="#3f7d4a" stroke-width="1.6"/>'
    + '<ellipse cx="47" cy="68" rx="6.5" ry="8" fill="#fff"/><ellipse cx="73" cy="68" rx="6.5" ry="8" fill="#fff"/><circle cx="48.5" cy="70" r="3.6" fill="#1d2a1f"/><circle cx="71.5" cy="70" r="3.6" fill="#1d2a1f"/>'
    + '<path d="M52 84q8 6 16 0" stroke="#1d2a1f" stroke-width="2" fill="none" stroke-linecap="round"/>';
  return `<svg class="mg-monster" viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${shadow}${body}</svg>`;
}

// 아이콘 (선 아이콘, 금색)
const ICON = {
  exam: '<path d="M4 6.5Q8 5 12 7Q16 5 20 6.5V18Q16 16.6 12 18.6Q8 16.6 4 18Z M12 7V18.6" />',
  ball: '<path d="M9 17.5V6l10-2v11.5"/><circle cx="7" cy="17.5" r="2.2"/><circle cx="17" cy="15.5" r="2.2"/>',
  cooking: '<path d="M4 11h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z M2 11h2M20 11h2 M9 4q-1.5 2 0 4M13 3.5q-1.5 2 0 4M17 4q-1.5 2 0 4"/>',
  adventure: '<path d="M14.5 4H20v5.5L10 19.5 4.5 14z M7 12l5 5 M4 20l3-3"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  soundOn: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z M15.5 9q1.6 3 0 6 M18 7q3.2 5 0 10"/>',
  soundOff: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z M16 9.5l5 5M21 9.5l-5 5"/>',
};
const icon = (k, cls = '') => `<svg class="mg-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</g></svg>`;

// ──────────────────────────────────────────────────────────────────────
// 소리 (Web Audio, 작게. 끌 수 있음)
// ──────────────────────────────────────────────────────────────────────
const SOUND_KEY = 'starborn_mg_sound';
let soundOn = true;
try { soundOn = globalThis.localStorage?.getItem(SOUND_KEY) !== '0'; } catch { /* 저장소 막힘 */ }
let AC = null;
function audioCtx() {
  if (!soundOn) return null;
  try {
    if (!AC) { const A = globalThis.AudioContext || globalThis.webkitAudioContext; if (!A) return null; AC = new A(); }
    if (AC.state === 'suspended') AC.resume().catch(() => {});
    return AC;
  } catch { return null; }
}
function tone(freq, dur = 0.08, type = 'triangle', vol = 0.05, delay = 0) {
  const ac = audioCtx(); if (!ac) return;
  try {
    const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.03);
  } catch { /* 소리는 선택 사항 */ }
}
const SFX = {
  tick: () => tone(660, 0.05, 'sine', 0.035),
  go: () => { tone(784, 0.08); tone(1175, 0.14, 'triangle', 0.05, 0.07); },
  beat: () => tone(330, 0.04, 'sine', 0.022),
  beatHi: () => tone(440, 0.05, 'sine', 0.032),
  perfect: () => { tone(1047, 0.08, 'triangle', 0.05); tone(1568, 0.1, 'triangle', 0.032, 0.04); },
  good: () => tone(880, 0.08, 'triangle', 0.045),
  bad: () => tone(523, 0.08, 'triangle', 0.035),
  miss: () => tone(196, 0.12, 'sine', 0.04),
  whoosh: () => tone(290, 0.2, 'sine', 0.022),
  hit: () => tone(220, 0.1, 'square', 0.025),
  hurt: () => tone(150, 0.14, 'sawtooth', 0.02),
  magic: () => [880, 1109, 1319].forEach((f, i) => tone(f, 0.12, 'triangle', 0.04, i * 0.05)),
  guard: () => tone(392, 0.1, 'square', 0.022),
  fanfare: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.045, i * 0.09)),
  soft: () => [392, 330].forEach((f, i) => tone(f, 0.18, 'sine', 0.035, i * 0.12)),
};

// ──────────────────────────────────────────────────────────────────────
// 게임 모델 (순수 로직: DOM 없음, dt 단위 초). 점수 보정은 tools 실험실·봇 시뮬레이션으로 맞췄다.
// ──────────────────────────────────────────────────────────────────────

// 시험: 누르면 별이 오르고 놓으면 내려간다. 움직이며 좁아지는 「집중의 띠」 안에 머문 시간 비율이 점수.
export function examModel({ adv = 0, rm = false, rand = Math.random, dur = 18 } = {}) {
  const ease = 1 + 0.25 * adv;                       // 띠 너비 배율
  const tempo = (1 - 0.15 * adv) * (rm ? 0.8 : 1);   // 띠·잡념 속도
  const W0 = 0.36 * ease, W1 = 0.21 * ease;          // 띠 높이(게이지 비율): 시간이 갈수록 좁아짐
  const UP = 3.4, DOWN = 2.8, DAMP = 3.2;
  const GUST = 1.5 * (1 - 0.25 * adv) * (rm ? 0.8 : 1);
  const ph0 = rand() * 6.283, ph1 = rand() * 6.283;
  const m = { kind: 'exam', dur, t: 0, p: 0.5, v: 0, hold: false, c: 0.5, w: W0, phase: 0, inside: 0, inBand: true, outFor: 0,
    gust: 0, gustDir: 1, gustT: (2.2 + rand()) / tempo, gusts: 0, done: false, events: [] };
  m.step = (dt) => {
    if (m.done || dt <= 0) return;
    m.t = Math.min(dur, m.t + dt);
    const prog = m.t / dur;
    m.w = lerp(W0, W1, prog);
    m.phase += dt * tempo * (0.6 + 0.55 * prog);
    const amp = Math.max(0, 0.5 - m.w / 2 - 0.02);
    m.c = 0.5 + amp * (0.62 * Math.sin(0.9 * m.phase + ph0) + 0.38 * Math.sin(2.0 * m.phase + ph1));
    m.gustT -= dt;
    if (m.gustT <= 0) { m.gust = 0.55; m.gustDir = rand() < 0.5 ? -1 : 1; m.gustT = (2.3 + rand() * 1.6) / tempo; m.gusts++; m.events.push('gust'); }
    let f = m.hold ? UP : -DOWN;
    if (m.gust > 0) { f += m.gustDir * GUST; m.gust = Math.max(0, m.gust - dt); }
    m.v = (m.v + f * dt) * Math.exp(-DAMP * dt);
    m.p += m.v * dt;
    if (m.p < 0) { m.p = 0; m.v = 0; } else if (m.p > 1) { m.p = 1; m.v = 0; }
    m.inBand = Math.abs(m.p - m.c) <= m.w / 2;
    if (m.inBand) { m.inside += dt; m.outFor = 0; } else m.outFor += dt;
    if (m.t >= dur) m.done = true;
  };
  m.frac = () => (m.t > 0 ? m.inside / m.t : 1);
  // 띠 안 비율 → 점수. 보통 플레이(≈56%) ≈ 0.5, 능숙한 플레이(≈81%+) ≈ 1
  m.score = () => clamp((m.inside / dur - 0.31) / 0.5, 0, 1);
  return m;
}

// 무도회: 3줄 리듬. 2마디(8박) 악구를 이어 붙여 만든 채보.
const PHRASES = [
  [0, 1, 2, 1, 0, 1, 2, -1], [0, 0, 2, 2, 1, -1, 1, -1], [1, 0, 1, 2, 1, 0, 1, -1],
  [0, 2, 1, -1, 2, 0, 1, -1], [2, 1, 0, 1, 2, 1, 0, -1], [1, 1, 0, 2, 0, 2, 1, -1],
];
export const JUDGE_VALUE = { perfect: 1, good: 0.6, bad: 0.2, miss: 0 };
export function ballModel({ adv = 0, rm = false, rand = Math.random, dur = 20 } = {}) {
  const ease = 1 + 0.3 * adv;
  const bpm = Math.round(100 * (1 - 0.12 * adv) * (rm ? 0.85 : 1));
  const beat = 60 / bpm;
  const travel = 1.6 * (1 + 0.2 * adv) * (rm ? 1.15 : 1);   // 별이 위에서 선까지 내려오는 시간
  const win = { perfect: 0.06 * ease, good: 0.13 * ease };
  win.bad = win.good + 0.05;
  const LATENCY = 0.025;   // 화면·입력 지연 보정: 판정 중심을 살짝 뒤로
  const first = Math.max(1.6, travel + 0.3);
  const notes = [];
  const mirror = rand() < 0.5;
  let phrase = PHRASES[0];
  for (let i = 0, t = first; t <= dur - 0.8; i++, t = first + i * beat) {
    if (i % 8 === 0) phrase = PHRASES[Math.floor(rand() * PHRASES.length)];
    let lane = phrase[i % 8];
    if (lane < 0) continue;
    if (mirror) lane = 2 - lane;
    notes.push({ t, lane, j: null, at: 0 });
    const prog = t / dur, nextRest = phrase[(i + 1) % 8] < 0;
    if (!rm && !nextRest && prog > 0.35 && prog < 0.85 && rand() < 0.2 * (1 - 0.5 * adv)) notes.push({ t: t + beat / 2, lane: (lane + 1 + Math.floor(rand() * 2)) % 3, j: null, at: 0 });
  }
  notes.sort((a, b) => a.t - b.t);
  const lastT = notes.length ? notes[notes.length - 1].t : first;
  const m = { kind: 'ball', bpm, beat, travel, win, notes, first, lastT, t: 0, dur: lastT + 0.9, done: false, events: [],
    hits: { perfect: 0, good: 0, bad: 0, miss: 0 }, stray: 0, combo: 0, maxCombo: 0 };
  const judge = (n, j, off = 0) => {
    n.j = j; n.at = m.t; m.hits[j]++;
    if (j === 'miss' || j === 'bad') m.combo = 0; else m.maxCombo = Math.max(m.maxCombo, ++m.combo);
    m.events.push({ type: 'judge', j, lane: n.lane, off });
  };
  m.step = (dt) => {
    if (m.done) return;
    m.t += dt;
    for (const n of notes) { if (n.t > m.t) break; if (!n.j && m.t > n.t + win.bad + LATENCY) judge(n, 'miss'); }
    if (m.t >= m.dur) m.done = true;
  };
  m.press = (lane, at0 = m.t) => {
    const at = at0 - LATENCY;
    let best = null, bd = Infinity;
    for (const n of notes) {
      if (n.t > at + 1) break;
      if (n.j || n.lane !== lane) continue;
      const d = Math.abs(n.t - at); if (d < bd) { bd = d; best = n; }
    }
    if (!best || bd > win.bad) { m.stray++; m.events.push({ type: 'stray', lane }); return null; }
    const j = bd <= win.perfect ? 'perfect' : bd <= win.good ? 'good' : 'bad';
    judge(best, j, at - best.t); return j;
  };
  m.raw = () => {
    if (!notes.length) return 0;
    const sum = notes.reduce((s, n) => s + (n.j ? JUDGE_VALUE[n.j] : 0), 0);
    // 헛누름 감점: 몇 번은 봐주고, 박자마다 세 줄을 다 누르는 식의 연타는 크게 깎는다
    return sum / notes.length - Math.min(0.6, 0.012 * Math.max(0, m.stray - 5));
  };
  // 정확도 → 점수. 보통(≈73%) ≈ 0.5, 거의 완벽(≈97%) ≈ 1
  m.score = () => clamp((m.raw() - 0.5) / 0.47, 0, 1);
  return m;
}

// 요리: 3라운드. 핑퐁으로 움직이는 바늘을 초록 구간(가운데 금선 = 완벽)에서 멈춘다.
export const COOK_ROUNDS = [
  { label: '수프 끓이기', zone: 0.22, speed: 0.9 },
  { label: '생선 굽기', zone: 0.18, speed: 1.15 },
  { label: '소스 졸이기', zone: 0.15, speed: 1.4 },
];
export function cookingModel({ adv = 0, rm = false, rand = Math.random } = {}) {
  const ease = 1 + 0.3 * adv, tempo = (1 - 0.22 * adv) * (rm ? 0.8 : 1);
  const LIMIT = 4.5, FEED = 1.4, READY = 0.9;   // 라운드 제한, 결과 보여주기, 라운드 시작 전 준비
  const m = { kind: 'cooking', round: 0, total: COOK_ROUNDS.length, t: 0, rt: 0, ft: 0, state: 'run', x: 0, ph: 0, c: 0.5, w: 0.2, speed: 1,
    limit: LIMIT, results: [], events: [], done: false };
  const setup = (i) => {
    const R = COOK_ROUNDS[i];
    m.round = i; m.w = R.zone * ease; m.speed = R.speed * tempo; m.label = R.label;
    m.c = m.w / 2 + 0.07 + rand() * (1 - m.w - 0.14);
    // 바늘은 구간에서 먼 쪽 끝 근처에서 출발
    m.ph = m.c > 0.5 ? rand() * 0.15 : 0.85 + rand() * 0.15;
    m.x = m.ph; m.rt = 0; m.ft = READY; m.state = 'ready';
  };
  const judge = (x) => {
    if (x == null) return { s: 0, j: 'late', side: 0 };
    const h = m.w / 2, d = Math.abs(x - m.c), side = x < m.c ? -1 : 1;
    if (d <= h * 0.3) return { s: 1, j: 'perfect', side };
    if (d <= h) return { s: 1 - 0.3 * (d - 0.3 * h) / (0.7 * h), j: 'good', side };
    if (d <= 2 * h) return { s: 0.4 * (1 - (d - h) / h), j: 'near', side };
    return { s: 0, j: 'miss', side };
  };
  const settle = (x) => {
    const r = { ...judge(x), x, c: m.c, w: m.w, label: m.label };
    m.results.push(r); m.state = 'feed'; m.ft = FEED; m.events.push({ type: 'round', r });
  };
  m.step = (dt) => {
    if (m.done) return;
    m.t += dt;
    if (m.state === 'ready') { m.ft -= dt; if (m.ft <= 0) { m.state = 'run'; m.events.push({ type: 'go', round: m.round }); } } else if (m.state === 'run') {
      m.rt += dt; m.ph = (m.ph + dt * m.speed) % 2; m.x = m.ph <= 1 ? m.ph : 2 - m.ph;
      if (m.rt >= LIMIT) settle(null);
    } else if (m.state === 'feed') {
      m.ft -= dt;
      if (m.ft <= 0) { if (m.round + 1 < m.total) { setup(m.round + 1); m.events.push({ type: 'next', round: m.round }); } else { m.state = 'done'; m.done = true; } }
    }
  };
  m.stop = () => { if (m.state === 'run') { settle(m.x); return true; } return false; };
  m.raw = () => m.results.reduce((s, r) => s + r.s, 0) / m.total;
  // 평균 라운드 점수 → 점수. 보통(초록 2번 + 근처 1번 ≈ 0.58) ≈ 0.5
  m.score = () => clamp((m.raw() - 0.2) / 0.75, 0, 1);
  setup(0);
  return m;
}

// 모험: 3~5턴 간이 전투. 몬스터는 다음 행동을 미리 보여 준다(할퀴기/힘 모으기→강공/웅크리기).
// 마법은 빈틈(웅크리기·힘 모으기)에만 온전히 통하고, 몬스터가 공격해 오는 턴엔 흐트러져 절반만 들어간다.
// → 무작정 공격·마법만 누르면 중간, 예고를 읽고 고르면 1에 가깝다(tools/minigame-lab.html 참고).
export const MAG_BUSY = 0.5;
export function adventureModel({ adv = 0, rand = Math.random, monster = null } = {}) {
  const mon = monster || MONSTERS[Math.floor(rand() * MONSTERS.length)];
  const pow = 1 + 0.15 * adv, harm = 1 - 0.25 * adv;   // 2턴 안에는 절대 못 이긴다(마법 2회 최대 88)
  const R = (a, b) => a + rand() * (b - a);
  const m = { kind: 'adventure', mon, hp: 100, mhp: 100, mp: 2, turn: 1, maxTurns: 5, intent: rand() < 0.7 ? 'claw' : 'guard', prev: null, charged: false, over: null };
  const nextIntent = () => {
    if (m.prev === 'charge') return 'smash';
    if (!m.charged && m.turn >= 3 && m.turn <= 4) { m.charged = true; return 'charge'; }   // 강공 예고는 꼭 한 번
    const w = [['claw', 0.45], ['guard', m.prev === 'guard' ? 0 : 0.3], ['charge', m.turn <= 4 ? (m.charged ? 0.1 : 0.3) : 0]];
    let x = rand() * w.reduce((s, [, p]) => s + p, 0);
    for (const [k, p] of w) { x -= p; if (x <= 0) { if (k === 'charge') m.charged = true; return k; } }
    return 'claw';
  };
  // a: 'atk' | 'def' | 'mag' | 'run'
  m.act = (a) => {
    if (m.over) return null;
    if (a === 'mag' && m.mp <= 0) a = 'atk';
    const it = m.intent, res = { a, it, dealt: 0, taken: 0, counter: 0, turn: m.turn, fizzle: false };
    if (a === 'run') { m.over = 'flee'; return res; }
    if (a === 'atk') res.dealt = Math.round(R(23, 26.5) * pow * (it === 'guard' ? 0.25 : 1));
    if (a === 'mag') { m.mp--; res.fizzle = it === 'claw' || it === 'smash'; res.dealt = Math.round(R(35, 38) * pow * (res.fizzle ? MAG_BUSY : 1)); }
    m.mhp = Math.max(0, m.mhp - res.dealt);
    if (m.mhp <= 0) { m.over = 'win'; return res; }
    res.mAct = true;   // 몬스터 차례가 왔다
    if (it === 'claw') res.taken = Math.round(R(17, 21) * harm * (a === 'def' ? 0.25 : 1));
    if (it === 'smash') res.taken = Math.round(R(34, 40) * harm * (a === 'def' ? 0.15 : 1));
    m.hp = Math.max(0, m.hp - res.taken);
    if (m.hp <= 0) { m.over = 'ko'; return res; }
    if (it === 'smash' && a === 'def') { res.counter = Math.round(13 * pow); m.mhp = Math.max(0, m.mhp - res.counter); }
    if (m.mhp <= 0) m.over = 'win';
    else if (m.turn >= m.maxTurns) m.over = 'time';
    else { m.turn++; m.prev = it; m.intent = nextIntent(); }
    return res;
  };
  // 이기면 남은 체력이 점수의 대부분(85% 이상 남기면 만점 구간), 4턴 안에 이기면 덤.
  // 가만히(자동 방어) ≈ 0.18, 도망 0.15, 공격만 ≈ 0.35, 예고를 읽는 플레이 ≈ 0.8~1
  m.score = () => {
    const hp = m.hp / 100, dmg = 1 - m.mhp / 100;
    if (m.over === 'win') return clamp(0.15 + 0.85 * clamp((hp - 0.25) / 0.6, 0, 1) + (m.turn <= 4 ? 0.1 : 0), 0, 1);
    if (m.over === 'time') return clamp(0.05 + 0.3 * dmg + 0.1 * hp, 0, 1);
    if (m.over === 'flee') return clamp(0.05 + 0.2 * dmg + 0.1 * hp, 0, 1);
    if (m.over === 'ko') return clamp(0.03 + 0.2 * dmg, 0, 1);
    return 0;
  };
  return m;
}

// ──────────────────────────────────────────────────────────────────────
// 캔버스 도구 (HiDPI)
// ──────────────────────────────────────────────────────────────────────
const FONT = '"Pretendard","Noto Sans KR","Apple SD Gothic Neo",system-ui,sans-serif';
function makeCanvas(cv) {
  const g = cv.getContext('2d');
  const s = { cv, g, w: 0, h: 0, dpr: 0 };
  s.fit = () => {
    const dpr = Math.min(3, Math.max(1, globalThis.devicePixelRatio || 1));
    const w = Math.max(1, cv.clientWidth), h = Math.max(1, cv.clientHeight);
    if (w !== s.w || h !== s.h || dpr !== s.dpr) { s.w = w; s.h = h; s.dpr = dpr; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return s;
  };
  return s;
}
function star4(g, x, y, r, f = 0.16) {
  const k = r * f;
  g.beginPath(); g.moveTo(x, y - r);
  g.quadraticCurveTo(x + k, y - k, x + r, y); g.quadraticCurveTo(x + k, y + k, x, y + r);
  g.quadraticCurveTo(x - k, y + k, x - r, y); g.quadraticCurveTo(x - k, y - k, x, y - r);
  g.closePath();
}
function rrect(g, x, y, w, h, r) {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  else { g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
}
function text(g, s, x, y, { size = 14, color = '#efe8ff', weight = 700, align = 'center', alpha = 1 } = {}) {
  g.save(); g.globalAlpha = alpha; g.font = `${weight} ${size}px ${FONT}`; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); g.restore();
}
function skyBg(g, W, H, top = '#1c1436', bot = '#0d0919') {
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, top); bg.addColorStop(1, bot); g.fillStyle = bg; g.fillRect(0, 0, W, H);
}
const DOTS = Array.from({ length: 26 }, (_, i) => { const r = mulberry32(i * 7919 + 13); return [r(), r(), 0.6 + r() * 1.1, r()]; });
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// ──────────────────────────────────────────────────────────────────────
// 시험 — 집중력 게이지
// ──────────────────────────────────────────────────────────────────────
const HOLD_KEYS = new Set(['Space', 'ArrowUp', 'KeyW', 'Enter', 'NumpadEnter']);
const THOUGHTS = ['창밖에 나비가…', '간식 생각…', '졸려…', '어제 본 별똥별…', '큐브가 불렀나?', '저 구름, 토끼 같아…', '세 달이 다 떴을까?'];

function createExam(env) {
  const m = examModel({ adv: env.adv, rm: env.rm, rand: env.rand });
  const el = h(`<div class="mg-game mg-exam">
    <div class="mg-hud"><span class="mg-hud-k">집중도</span><div class="mg-meter"><i></i></div><b class="mg-hud-v">100%</b><span class="mg-status in">집중 중</span></div>
    <div class="mg-stage" tabindex="-1" role="application" aria-label="집중력 게이지. 누르고 있으면 별이 올라가고 놓으면 내려가요.">
      <canvas class="mg-cv"></canvas>
      <div class="mg-exam-side"><div class="mg-bubble" hidden></div><div class="mg-who"></div></div>
    </div>
    <button type="button" class="mg-bigbtn" tabindex="-1" data-hold>집중! <small>누르고 있기 · Space</small></button>
  </div>`);
  const cv = makeCanvas(el.querySelector('canvas')), stage = el.querySelector('.mg-stage'), btn = el.querySelector('[data-hold]');
  const who = el.querySelector('.mg-who'), bubble = el.querySelector('.mg-bubble');
  const meter = el.querySelector('.mg-meter i'), meterV = el.querySelector('.mg-hud-v'), status = el.querySelector('.mg-status');
  const keys = new Set(), ptrs = new Set(), trail = [];
  let mood = '', inState = true, bubbleT = 0, lastThought = -1;
  const setMood = (md) => { if (md === mood) return; mood = md; who.innerHTML = princessSVG({ outfit: 'mind', mood: md, prop: 'book', ...env.look }); env.mood(md); };
  // 카운트다운 중에 미리 누르고 있어도 시작과 동시에 반영된다
  const sync = () => { const on = keys.size > 0 || ptrs.size > 0; m.hold = env.playing() && on; btn.classList.toggle('is-down', env.active() && on); };
  const down = (e) => { if (!env.active() || e.button > 0) return; e.preventDefault(); ptrs.add(e.pointerId); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* */ } sync(); };
  const up = (e) => { ptrs.delete(e.pointerId); sync(); };
  for (const t of [stage, btn]) { t.addEventListener('pointerdown', down); t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up); t.addEventListener('lostpointercapture', up); }
  setMood('calm');
  return {
    el, model: m,
    update(dt) {
      sync();
      m.step(dt);
      for (const ev of m.events.splice(0)) if (ev === 'gust') {
        let i = Math.floor(env.rand() * THOUGHTS.length); if (i === lastThought) i = (i + 1) % THOUGHTS.length; lastThought = i;
        bubble.textContent = THOUGHTS[i]; bubble.hidden = false; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
        bubbleT = 1.6; env.sfx('whoosh'); env.announce('잡념이 밀려와요!');
      }
      if (bubbleT > 0 && (bubbleT -= dt) <= 0) bubble.hidden = true;
      const nowIn = m.inBand || m.outFor < 0.25;
      if (nowIn !== inState) { inState = nowIn; status.textContent = nowIn ? '집중 중' : '딴생각 중…'; status.className = `mg-status ${nowIn ? 'in' : 'out'}`; env.announce(status.textContent); }
      setMood(nowIn ? 'focus' : 'daze');
      const f = m.frac();
      meter.style.width = `${f * 100}%`; meterV.textContent = `${Math.round(f * 100)}%`;
      env.progress(m.t / m.dur);
      if (m.done) env.finish(m.score(), { summary: `집중 유지 ${Math.round((m.inside / m.dur) * 100)}% · 잡념 ${m.gusts}번` });
    },
    draw() {
      const { g, w: W, h: H } = cv.fit();
      skyBg(g, W, H);
      // 창문과 세 개의 달
      const wx = W * 0.5, wy = 12, ww = W * 0.46, wh = H * 0.44;
      rrect(g, wx, wy, ww, wh, 10); g.fillStyle = '#131b38'; g.fill();
      g.save(); g.clip();
      for (const [x, y, r] of DOTS) { g.fillStyle = 'rgba(239,232,255,.55)'; g.fillRect(wx + x * ww, wy + y * wh, r, r); }
      [[0.24, 0.36, 8, '#f6e7b0'], [0.55, 0.24, 5.5, '#d9ccff'], [0.8, 0.5, 4, '#bfe1ff']].forEach(([x, y, r, c]) => { g.beginPath(); g.arc(wx + x * ww, wy + y * wh, r, 0, 7); g.fillStyle = c; g.fill(); });
      g.restore();
      g.strokeStyle = '#4a3a6e'; g.lineWidth = 3; rrect(g, wx, wy, ww, wh, 10); g.stroke();
      g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.lineWidth = 2; g.stroke();
      // 책상
      g.fillStyle = '#3b2a1e'; g.fillRect(W * 0.42, H - 20, W * 0.58, 20); g.fillStyle = '#5a3d24'; g.fillRect(W * 0.42, H - 20, W * 0.58, 3);
      // 게이지
      const gw = 50, gx = Math.max(58, W * 0.22), top = 16, bot = H - 16, gh = bot - top, Y = (p) => bot - p * gh;
      rrect(g, gx - gw / 2, top, gw, gh, 16); g.fillStyle = '#0a0714'; g.fill(); g.strokeStyle = '#3a2d5c'; g.lineWidth = 2; g.stroke();
      g.strokeStyle = 'rgba(167,159,196,.2)'; g.lineWidth = 1;
      for (let i = 1; i < 10; i++) { const y = Math.round(top + (gh * i) / 10) + 0.5; g.beginPath(); g.moveTo(gx - gw / 2 + 6, y); g.lineTo(gx - gw / 2 + 13, y); g.stroke(); }
      const y0 = Y(clamp(m.c + m.w / 2, 0, 1)), y1 = Y(clamp(m.c - m.w / 2, 0, 1));
      const gr = g.createLinearGradient(0, y0, 0, y1);
      gr.addColorStop(0, 'rgba(231,195,106,.12)'); gr.addColorStop(0.5, m.inBand ? 'rgba(231,195,106,.46)' : 'rgba(231,195,106,.26)'); gr.addColorStop(1, 'rgba(231,195,106,.12)');
      rrect(g, gx - gw / 2 + 4, y0, gw - 8, y1 - y0, 10); g.fillStyle = gr; g.fill(); g.lineWidth = 2; g.strokeStyle = '#e7c36a'; g.stroke();
      const cy = Y(m.p);
      if (!env.rm) {
        trail.push(cy); if (trail.length > 7) trail.shift();
        trail.forEach((ty, i) => { g.globalAlpha = ((i + 1) / trail.length) * 0.22; star4(g, gx, ty, 9); g.fillStyle = '#cdb8ff'; g.fill(); });
        g.globalAlpha = 1;
      }
      g.save(); if (m.inBand) { g.shadowColor = 'rgba(255,225,140,.95)'; g.shadowBlur = 16; }
      star4(g, gx, cy, 15, 0.2); g.fillStyle = m.inBand ? '#ffe7a3' : '#b8a6e8'; g.fill(); g.restore();
      text(g, '▲', gx - gw / 2 - 16, top + 10, { size: 11, color: '#a79fc4' }); text(g, '누름', gx - gw / 2 - 16, top + 26, { size: 11, color: '#a79fc4', weight: 500 });
      text(g, '놓음', gx - gw / 2 - 16, bot - 26, { size: 11, color: '#a79fc4', weight: 500 }); text(g, '▼', gx - gw / 2 - 16, bot - 10, { size: 11, color: '#a79fc4' });
    },
    key(e, isDown) {
      if (!HOLD_KEYS.has(e.code)) return false;
      if (isDown) keys.add(e.code); else keys.delete(e.code);
      sync(); return true;
    },
    onPause() { keys.clear(); ptrs.clear(); m.hold = false; btn.classList.remove('is-down'); },
    destroy() {},
  };
}

// ──────────────────────────────────────────────────────────────────────
// 무도회 — 리듬
// ──────────────────────────────────────────────────────────────────────
const LANE_KEYS = { KeyA: 0, ArrowLeft: 0, KeyJ: 0, KeyS: 1, ArrowDown: 1, KeyK: 1, KeyD: 2, ArrowRight: 2, KeyL: 2 };
const LANE_COL = ['#b48cff', '#e7c36a', '#ff9cc2'];
const LANE_LABEL = ['A · ←', 'S · ↓', 'D · →'];
const LANE_NAME = ['왼쪽 줄', '가운데 줄', '오른쪽 줄'];
const JUDGE_TXT = { perfect: '완벽!', good: '좋아요', bad: '아슬아슬', miss: '놓침' };
const JUDGE_COL = { perfect: '#ffe7a3', good: '#7fd1a0', bad: '#c9bde8', miss: '#ff7a7a' };

function createBall(env) {
  const m = ballModel({ adv: env.adv, rm: env.rm, rand: env.rand });
  const el = h(`<div class="mg-game mg-ball">
    <div class="mg-hud"><span class="mg-hud-k">연속</span><b class="mg-combo">0</b><span class="mg-hud-sp"></span><span class="mg-hud-k">정확도</span><b class="mg-acc">—</b></div>
    <div class="mg-stage" tabindex="-1" role="application" aria-label="리듬. 별이 아래 동그라미에 닿을 때 그 줄을 누르세요. 키보드 A S D 또는 화살표."><canvas class="mg-cv"></canvas></div>
    <div class="mg-lanebtns">${LANE_LABEL.map((l, i) => `<button type="button" tabindex="-1" data-lane="${i}" style="--c:${LANE_COL[i]}" aria-label="${LANE_NAME[i]}">${l}</button>`).join('')}</div>
  </div>`);
  const cv = makeCanvas(el.querySelector('canvas')), stage = el.querySelector('.mg-stage');
  const comboEl = el.querySelector('.mg-combo'), accEl = el.querySelector('.mg-acc');
  const laneBtns = [...el.querySelectorAll('[data-lane]')];
  const flash = [0, 0, 0], pops = [], bursts = [];
  let lastBeat = -99, judged = 0, valueSum = 0, geom = { pad: 10, lw: 100, hitY: 200 };
  const press = (lane) => {
    if (!env.playing()) return;
    flash[lane] = 0.14; laneBtns[lane].classList.add('is-down'); env.later(() => laneBtns[lane].classList.remove('is-down'), 110);
    m.press(lane, m.t + env.lag());
    drain();
  };
  const drain = () => {
    for (const ev of m.events.splice(0)) {
      if (ev.type === 'stray') { env.sfx('bad'); continue; }
      pops.push({ lane: ev.lane, j: ev.j, t: m.t });
      if (ev.j !== 'miss') bursts.push({ lane: ev.lane, t: m.t, j: ev.j });
      judged++; valueSum += JUDGE_VALUE[ev.j];
      env.sfx(ev.j);
      if (ev.j === 'miss') env.mood('sad'); else if (m.combo >= 5) env.mood('happy'); else env.mood('calm');
    }
    comboEl.textContent = String(m.combo);
    comboEl.classList.toggle('hot', m.combo >= 10);
    accEl.textContent = judged ? `${Math.round((valueSum / judged) * 100)}%` : '—';
  };
  stage.addEventListener('pointerdown', (e) => {
    if (!env.playing() || e.button > 0) return; e.preventDefault();
    const x = e.clientX - stage.getBoundingClientRect().left;
    press(clamp(Math.floor((x - geom.pad) / geom.lw), 0, 2));
  });
  laneBtns.forEach((b, i) => b.addEventListener('pointerdown', (e) => { if (e.button > 0) return; e.preventDefault(); press(i); }));
  env.mood('calm');
  return {
    el, model: m,
    update(dt) {
      m.step(dt);
      for (let i = 0; i < 3; i++) flash[i] = Math.max(0, flash[i] - dt);
      const bi = Math.floor((m.t - m.first) / m.beat + 1e-6);
      if (bi !== lastBeat && bi >= -3 && m.t <= m.lastT + 0.05) { lastBeat = bi; env.sfx(bi % 4 === 0 ? 'beatHi' : 'beat'); env.bob(); }
      drain();
      env.progress(m.t / m.dur);
      if (m.done) {
        const H = m.hits;
        env.finish(m.score(), { summary: `완벽 ${H.perfect} · 좋아요 ${H.good} · 아슬아슬 ${H.bad} · 놓침 ${H.miss} · 최대 연속 ${m.maxCombo}` });
      }
    },
    draw() {
      const { g, w: W, h: H } = cv.fit();
      skyBg(g, W, H, '#21163d', '#0e0a1b');
      const pad = 10, lw = (W - pad * 2) / 3, hitY = H - 58, span = hitY + 30;
      geom = { pad, lw, hitY };
      // 샹들리에 빛
      for (const [x, y, r, tw] of DOTS) {
        const a = env.rm ? 0.35 : 0.2 + 0.25 * (0.5 + 0.5 * Math.sin(m.t * 2 + tw * 6));
        g.fillStyle = `rgba(231,195,106,${a.toFixed(3)})`; g.fillRect(x * W, y * H * 0.7, r, r);
      }
      for (let i = 0; i < 3; i++) {
        const x = pad + i * lw;
        g.fillStyle = i % 2 ? 'rgba(255,255,255,.025)' : 'rgba(255,255,255,.045)'; g.fillRect(x + 2, 0, lw - 4, H);
        if (flash[i] > 0) { const gr = g.createLinearGradient(0, hitY - 120, 0, hitY + 20); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, LANE_COL[i] + '55'); g.fillStyle = gr; g.fillRect(x + 2, hitY - 120, lw - 4, 140); }
      }
      // 판정선
      g.strokeStyle = 'rgba(231,195,106,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(pad, hitY + 0.5); g.lineTo(W - pad, hitY + 0.5); g.stroke();
      for (let i = 0; i < 3; i++) {
        const x = pad + lw * (i + 0.5);
        g.beginPath(); g.arc(x, hitY, 21, 0, 7); g.lineWidth = 3; g.strokeStyle = LANE_COL[i]; g.globalAlpha = flash[i] > 0 ? 1 : 0.6; g.stroke();
        if (flash[i] > 0) { g.fillStyle = LANE_COL[i] + '66'; g.fill(); }
        g.globalAlpha = 1;
        text(g, LANE_LABEL[i], x, H - 18, { size: 12, color: '#a79fc4', weight: 600 });
      }
      // 별(노트)
      for (const n of m.notes) {
        const dtn = n.t - m.t;
        if (dtn > m.travel * 1.15) break;
        if (n.j && n.j !== 'miss') continue;
        const y = hitY - (dtn / m.travel) * span;
        if (y < -30 || y > H + 30) continue;
        const x = pad + lw * (n.lane + 0.5);
        g.save(); g.globalAlpha = n.j === 'miss' ? 0.28 : 1;
        if (!n.j && !env.rm) { g.shadowColor = LANE_COL[n.lane]; g.shadowBlur = 12; }
        star4(g, x, y, 17, 0.3); g.fillStyle = LANE_COL[n.lane]; g.fill();
        g.shadowBlur = 0; g.lineWidth = 1.5; g.strokeStyle = '#fff3c4'; g.stroke();
        g.restore();
      }
      // 터지는 별빛
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i], age = m.t - b.t; if (age > 0.4) { bursts.splice(i, 1); continue; }
        const x = pad + lw * (b.lane + 0.5), k = age / 0.4;
        g.globalAlpha = 1 - k; g.strokeStyle = b.j === 'perfect' ? '#ffe7a3' : LANE_COL[b.lane]; g.lineWidth = 3;
        g.beginPath(); g.arc(x, hitY, env.rm ? 24 : 22 + k * 26, 0, 7); g.stroke();
        if (b.j === 'perfect' && !env.rm) for (let s = 0; s < 4; s++) { const a = s * Math.PI / 2 + 0.6, d = 18 + k * 34; star4(g, x + Math.cos(a) * d, hitY + Math.sin(a) * d, 5); g.fillStyle = '#ffe7a3'; g.fill(); }
        g.globalAlpha = 1;
      }
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i], age = m.t - p.t; if (age > 0.6) { pops.splice(i, 1); continue; }
        text(g, JUDGE_TXT[p.j], pad + lw * (p.lane + 0.5), hitY - 40 - (env.rm ? 0 : age * 30), { size: 15, color: JUDGE_COL[p.j], alpha: 1 - age / 0.6, weight: 800 });
      }
      if (m.t < m.first - m.travel + 0.2) text(g, '별이 동그라미에 닿을 때 눌러요!', W / 2, H * 0.36, { size: 14, color: '#efe8ff', weight: 600, alpha: 0.85 });
    },
    key(e, isDown) {
      if (!(e.code in LANE_KEYS)) return false;
      if (isDown && !e.repeat) press(LANE_KEYS[e.code]);
      return true;
    },
    onPause() {},
    destroy() {},
  };
}

// ──────────────────────────────────────────────────────────────────────
// 요리 — 타이밍
// ──────────────────────────────────────────────────────────────────────
const STOP_KEYS = new Set(['Space', 'Enter', 'NumpadEnter', 'ArrowUp', 'ArrowDown', 'KeyS']);
const COOK_TXT = {
  perfect: ['완벽해요!', 'good'], good: ['좋아요!', 'ok'], late: ['앗, 불을 놓쳤어요', 'bad'],
  near: { '-1': ['조금 약불이에요', 'warn'], 1: ['조금 센불이에요', 'warn'] },
  miss: { '-1': ['덜 익었어요…', 'bad'], 1: ['앗, 탔어요!', 'bad'] },
};
const cookTxt = (r) => (r.j === 'near' || r.j === 'miss' ? COOK_TXT[r.j][r.side] : COOK_TXT[r.j]);

function createCooking(env) {
  const m = cookingModel({ adv: env.adv, rm: env.rm, rand: env.rand });
  const el = h(`<div class="mg-game mg-cook">
    <div class="mg-hud"><span class="mg-round"></span><span class="mg-hud-sp"></span><span class="mg-dots">${'<i></i>'.repeat(m.total)}</span></div>
    <div class="mg-stage" tabindex="-1" role="application" aria-label="불 조절 바늘. 바늘이 초록 구간에 오면 누르세요."><canvas class="mg-cv"></canvas></div>
    <button type="button" class="mg-bigbtn" tabindex="-1" data-stop>지금! <small>Space · Enter · 탭</small></button>
  </div>`);
  const cv = makeCanvas(el.querySelector('canvas')), stage = el.querySelector('.mg-stage'), btn = el.querySelector('[data-stop]');
  const roundEl = el.querySelector('.mg-round'), dots = [...el.querySelectorAll('.mg-dots i')];
  let bubbles = [], btime = 0;
  const showRound = () => { roundEl.innerHTML = `<b>${m.round + 1}/${m.total}</b> ${esc(m.label)}`; };
  const stop = () => {
    if (!env.playing()) return;
    btn.classList.add('is-down'); env.later(() => btn.classList.remove('is-down'), 120);
    m.stop(); drain();
  };
  const drain = () => {
    for (const ev of m.events.splice(0)) {
      if (ev.type === 'round') {
        const [msg, tone] = cookTxt(ev.r);
        env.say(msg, tone);
        dots[m.results.length - 1]?.classList.add(ev.r.j === 'perfect' ? 'p' : ev.r.j === 'good' ? 'g' : ev.r.j === 'near' ? 'n' : 'x');
        env.sfx(ev.r.j === 'perfect' ? 'perfect' : ev.r.j === 'good' ? 'good' : ev.r.j === 'near' ? 'bad' : 'miss');
        env.mood(ev.r.j === 'perfect' ? 'happy' : ev.r.j === 'good' ? 'calm' : 'hurt');
      } else if (ev.type === 'next') { showRound(); env.mood('focus'); }
    }
  };
  stage.addEventListener('pointerdown', (e) => { if (e.button > 0) return; e.preventDefault(); stop(); });
  btn.addEventListener('pointerdown', (e) => { if (e.button > 0) return; e.preventDefault(); stop(); });
  showRound(); env.mood('focus');
  return {
    el, model: m,
    update(dt) {
      m.step(dt); drain();
      btime += dt;
      env.progress((m.results.length + (m.state === 'run' ? Math.min(1, m.rt / m.limit) * 0.5 : 0)) / m.total);
      if (m.done) {
        const names = { perfect: '완벽', good: '좋아요', near: '아쉬움', miss: '실패', late: '놓침' };
        env.finish(m.score(), { summary: m.results.map(r => `${r.label} ${names[r.j]}`).join(' · ') });
      }
    },
    draw() {
      const { g, w: W, h: H } = cv.fit();
      skyBg(g, W, H, '#241a33', '#120c1c');
      const R = Math.min(W * 0.4, H * 0.5), cx = W / 2, cy = Math.min(H * 0.58, 22 + R);
      const A = (x) => Math.PI + x * Math.PI;
      // 열 눈금 (약불 파랑 → 센불 빨강)
      const N = 48;
      for (let i = 0; i < N; i++) {
        const t0 = i / N, t1 = (i + 1) / N;
        const c = t0 < 0.5 ? [108 + (231 - 108) * t0 * 2, 156 + (195 - 156) * t0 * 2, 224 + (106 - 224) * t0 * 2] : [231 + (255 - 231) * (t0 - 0.5) * 2, 195 + (122 - 195) * (t0 - 0.5) * 2, 106 + (122 - 106) * (t0 - 0.5) * 2];
        g.beginPath(); g.arc(cx, cy, R - 10, A(t0), A(t1) + 0.01); g.lineWidth = 12; g.strokeStyle = `rgb(${c.map(Math.round).join(',')})`; g.globalAlpha = 0.55; g.stroke();
      }
      g.globalAlpha = 1;
      // 초록 구간 + 완벽 금선
      const z0 = clamp(m.c - m.w / 2, 0, 1), z1 = clamp(m.c + m.w / 2, 0, 1);
      g.save(); if (!env.rm) { g.shadowColor = 'rgba(127,209,160,.8)'; g.shadowBlur = 12; }
      g.beginPath(); g.arc(cx, cy, R - 10, A(z0), A(z1)); g.lineWidth = 22; g.strokeStyle = '#7fd1a0'; g.stroke(); g.restore();
      const pz0 = m.c - m.w * 0.15, pz1 = m.c + m.w * 0.15;
      g.beginPath(); g.arc(cx, cy, R - 10, A(pz0), A(pz1)); g.lineWidth = 22; g.strokeStyle = '#e7c36a'; g.stroke();
      g.beginPath(); g.arc(cx, cy, R + 2, Math.PI, 2 * Math.PI); g.lineWidth = 2; g.strokeStyle = '#3a2d5c'; g.stroke();
      text(g, '약불', cx - R + 8, cy + 16, { size: 12, color: '#9ec3ff' }); text(g, '센불', cx + R - 8, cy + 16, { size: 12, color: '#ff9c9c' });
      // 냄비와 불꽃 (불 세기 = 바늘)
      const pw = Math.min(R * 0.9, 120), py = cy + 18;
      const flame = 4 + m.x * 22;
      for (let i = -2; i <= 2; i++) {
        const fx = cx + i * pw * 0.16, wob = env.rm ? 0 : Math.sin(btime * 14 + i * 1.7) * 2.2, fh = flame * (1 - Math.abs(i) * 0.12) + wob;
        g.beginPath(); g.moveTo(fx - 6, H - 8); g.quadraticCurveTo(fx - 7, H - 8 - fh * 0.6, fx, H - 8 - fh); g.quadraticCurveTo(fx + 7, H - 8 - fh * 0.6, fx + 6, H - 8); g.closePath();
        g.fillStyle = m.x > 0.7 ? '#ff7a5a' : m.x < 0.3 ? '#7fb4ff' : '#ffb84a'; g.globalAlpha = 0.9; g.fill(); g.globalAlpha = 1;
      }
      const potTop = Math.min(H - 52, Math.max(py + 6, H - 70)), potH = H - 14 - potTop - flame * 0.2;
      rrect(g, cx - pw / 2, potTop, pw, Math.max(24, potH - 8), 10); g.fillStyle = '#2b2b38'; g.fill(); g.strokeStyle = '#555672'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#555672'; g.fillRect(cx - pw / 2 - 10, potTop + 6, 10, 5); g.fillRect(cx + pw / 2, potTop + 6, 10, 5);
      g.beginPath(); g.ellipse(cx, potTop, pw / 2, 6, 0, 0, 7); g.fillStyle = m.x > 0.75 ? '#7a4a2a' : '#e8c27a'; g.fill();
      if (!env.rm) {
        if (Math.random() < 0.06 + m.x * 0.2) bubbles.push({ x: cx + (Math.random() - 0.5) * pw * 0.7, y: potTop - 2, t: 0 });
        bubbles = bubbles.filter(b => (b.t += 1 / 60) < 0.8);
        for (const b of bubbles) { g.globalAlpha = 0.5 * (1 - b.t / 0.8); g.beginPath(); g.arc(b.x, b.y - b.t * 22, 2 + b.t * 3, 0, 7); g.fillStyle = '#efe8ff'; g.fill(); }
        g.globalAlpha = 1;
      }
      // 바늘
      const ang = A(m.x), nx = cx + Math.cos(ang) * (R - 4), ny = cy + Math.sin(ang) * (R - 4);
      g.save(); g.lineCap = 'round'; g.lineWidth = 4; g.strokeStyle = m.state === 'feed' ? '#ffffff' : '#ffe7a3';
      if (!env.rm) { g.shadowColor = 'rgba(255,231,163,.8)'; g.shadowBlur = 8; }
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(nx, ny); g.stroke(); g.restore();
      g.beginPath(); g.arc(cx, cy, 7, 0, 7); g.fillStyle = '#e7c36a'; g.fill();
      if (m.state === 'feed') { const last = m.results[m.results.length - 1]; if (last?.x != null) { star4(g, nx, ny, 10, 0.25); g.fillStyle = last.j === 'perfect' ? '#ffe7a3' : last.j === 'good' ? '#7fd1a0' : '#ff9c9c'; g.fill(); } }
      if (m.state === 'run' && m.rt > m.limit - 1.5) text(g, `${Math.ceil(m.limit - m.rt)}`, cx, cy - R * 0.45, { size: 22, color: '#ff9c9c', weight: 800 });
    },
    key(e, isDown) {
      if (!STOP_KEYS.has(e.code)) return false;
      if (isDown && !e.repeat) stop();
      return true;
    },
    onPause() {},
    destroy() {},
  };
}

// ──────────────────────────────────────────────────────────────────────
// 모험 — 턴제 간이 전투 (DOM)
// ──────────────────────────────────────────────────────────────────────
const ACT_KEYS = { Digit1: 'atk', Numpad1: 'atk', Digit2: 'def', Numpad2: 'def', Digit3: 'mag', Numpad3: 'mag', Digit4: 'run', Numpad4: 'run' };
const TURN_LIMIT = 4.8;   // 아무것도 안 해도 5턴 × (4.8 + 연출 ≤0.95) + 1.2 ≤ 30초
function intentInfo(mon, it) {
  const v = mon.v;
  if (it === 'charge') return { label: `${v.charge} — 힘을 모으는 중`, hint: '빈틈이에요! 마법이 잘 통해요. 다음 턴엔 강한 공격이 와요', tone: 'charge' };
  if (it === 'smash') return { label: `${josa(v.smash, '이')} 온다!`, hint: '방어하면 막아 내고 반격해요', tone: 'smash' };
  if (it === 'guard') return { label: v.guard, hint: '공격은 잘 안 통해요. 마법은 잘 통해요', tone: 'guard' };
  return { label: `${v.claw} 준비`, hint: '방어하면 피해가 크게 줄어요. 마법은 흐트러져요', tone: 'claw' };
}

function createAdventure(env) {
  const m = adventureModel({ adv: env.adv, rand: env.rand });
  const N = env.name, M = m.mon.name;
  const el = h(`<div class="mg-game mg-advg">
    <div class="mg-stage mg-arena" tabindex="-1" role="group" aria-label="전투 화면">
      <div class="mg-fighter hero">
        <div class="mg-plate"><b>${esc(N)}</b><span class="mg-hpn">100</span></div>
        <div class="mg-hp" role="progressbar" aria-label="${esc(N)} 체력" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><i></i></div>
        <div class="mg-sprite"></div>
      </div>
      <div class="mg-vs" aria-hidden="true">VS</div>
      <div class="mg-fighter foe">
        <div class="mg-plate"><b>${esc(M)}</b><span class="mg-hpn">100</span></div>
        <div class="mg-hp foe" role="progressbar" aria-label="${esc(M)} 체력" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><i></i></div>
        <div class="mg-sprite">${monsterSVG(m.mon.id)}</div>
      </div>
    </div>
    <div class="mg-intent" aria-live="polite"><span class="mg-intent-k">다음 행동</span><b></b><small></small></div>
    <div class="mg-turn"><span class="mg-turn-n"></span><div class="mg-tbar"><i></i></div></div>
    <div class="mg-log" aria-live="polite" aria-atomic="true">${esc(josa(M, '이'))} 나타났다!</div>
    <div class="mg-acts" role="group" aria-label="행동 선택">
      <button type="button" data-a="atk"><b>공격</b><small>1 · 기본 피해</small></button>
      <button type="button" data-a="def"><b>방어</b><small>2 · 피해 크게 줄임</small></button>
      <button type="button" data-a="mag"><b>마법</b><small>3 · 남은 ${m.mp}회</small></button>
      <button type="button" data-a="run"><b>도망</b><small>4 · 바로 끝내기</small></button>
    </div>
  </div>`);
  const $ = (s) => el.querySelector(s);
  const hero = $('.hero'), foe = $('.foe'), heroSprite = hero.querySelector('.mg-sprite'), logEl = $('.mg-log');
  const intentEl = $('.mg-intent'), turnN = $('.mg-turn-n'), tbar = $('.mg-tbar i'), acts = $('.mg-acts');
  const btns = Object.fromEntries([...acts.querySelectorAll('[data-a]')].map(b => [b.dataset.a, b]));
  let state = 'wait', tleft = TURN_LIMIT, clock = 0, q = [], heroMood = '';
  const after = (s, fn) => q.push({ at: clock + s, fn });
  const setHero = (md) => { if (md === heroMood) return; heroMood = md; heroSprite.innerHTML = princessSVG({ outfit: 'body', mood: md, prop: 'sword', ...env.look }); env.mood(md); };
  const cls = (node, c, ms = 420) => { node.classList.remove(c); void node.offsetWidth; node.classList.add(c); if (ms) env.later(() => node.classList.remove(c), ms); };
  const floatNum = (node, txt, kind = '') => { const s = document.createElement('span'); s.className = `mg-dmg ${kind}`; s.setAttribute('aria-hidden', 'true'); s.textContent = txt; node.appendChild(s); env.later(() => s.remove(), 900); };
  const setHP = () => {
    for (const [node, v] of [[hero, m.hp], [foe, m.mhp]]) {
      node.querySelector('.mg-hp i').style.width = `${v}%`;
      node.querySelector('.mg-hp').setAttribute('aria-valuenow', String(v));
      node.querySelector('.mg-hp').classList.toggle('low', v <= 30);
      node.querySelector('.mg-hpn').textContent = String(v);
    }
  };
  const setButtons = (on) => {
    acts.classList.toggle('is-busy', !on);
    for (const [k, b] of Object.entries(btns)) b.setAttribute('aria-disabled', String(!on || (k === 'mag' && m.mp <= 0)));
    btns.mag.querySelector('small').textContent = m.mp > 0 ? `3 · 남은 ${m.mp}회` : '3 · 마력 소진';
  };
  const showIntent = () => {
    const I = intentInfo(m.mon, m.intent);
    intentEl.className = `mg-intent ${I.tone}`;
    intentEl.querySelector('b').textContent = I.label; intentEl.querySelector('small').textContent = I.hint;
    foe.classList.toggle('is-charge', m.intent === 'charge' || m.intent === 'smash');
    foe.classList.toggle('is-guard', m.intent === 'guard');
  };
  const newTurn = () => {
    state = 'choose'; tleft = TURN_LIMIT;
    turnN.textContent = `턴 ${m.turn} / ${m.maxTurns}`;
    showIntent(); setButtons(true);
    hero.classList.remove('is-guard', 'is-cast');
    if (!acts.contains(document.activeElement) || document.activeElement?.getAttribute('aria-disabled') === 'true') btns.atk.focus({ preventScroll: true });
  };
  const end = () => {
    const out = { win: `${josa(M, '이')} 꽁지 빠지게 숲으로 달아났다!`, ko: `${josa(N, '이')} 넘어졌다. 오늘은 여기까지!`, flee: `${josa(N, '은')} 무사히 몸을 피했다.`, time: `해가 기울자 ${josa(M, '이')} 숲으로 돌아갔다.` }[m.over];
    const tag = { win: '승리', ko: '패배', flee: '도망', time: '무승부' }[m.over];
    logEl.textContent = out;
    if (m.over === 'win') { foe.classList.add('is-gone'); setHero('happy'); env.sfx('fanfare'); }
    else if (m.over === 'ko') { hero.classList.add('is-down'); setHero('hurt'); env.sfx('soft'); }
    else if (m.over === 'flee') { hero.classList.add('is-run'); setHero('calm'); }
    else { foe.classList.add('is-gone'); setHero('calm'); }
    intentEl.className = 'mg-intent done'; intentEl.querySelector('b').textContent = tag; intentEl.querySelector('small').textContent = '';
    after(1.2, () => env.finish(m.score(), { summary: `${tag} · ${m.turn}턴 · 남은 체력 ${m.hp}`, outcome: m.over }));
  };
  const choose = (a, auto = false) => {
    if (state !== 'choose' || !env.playing()) return;
    if (a === 'mag' && m.mp <= 0) { env.say('마력이 다 떨어졌어요', 'warn'); btns.atk.focus({ preventScroll: true }); return; }
    state = 'anim'; setButtons(false);
    const r = m.act(a);
    const lines = [];
    if (auto) lines.push('망설이는 사이 몸을 웅크렸다.');
    if (a === 'run') { lines.push(`${josa(N, '은')} 재빨리 뒤로 물러났다.`); logEl.textContent = lines.join(' '); after(0.5, end); return; }
    if (a === 'atk') { cls(hero, 'is-lunge'); env.sfx('hit'); after(0.18, () => { cls(foe, 'is-hit'); floatNum(foe, `-${r.dealt}`); setHP(); }); lines.push(`${josa(N, '의')} 공격! ${r.dealt}\u00a0피해${r.it === 'guard' ? '(웅크려서 덜 통했다)' : ''}.`); }
    if (a === 'mag') { hero.classList.add('is-cast'); env.sfx('magic'); after(0.2, () => { cls(foe, 'is-hit'); floatNum(foe, `-${r.dealt}`, 'magic'); setHP(); }); lines.push(r.fizzle ? `별빛 마법! 주문이 흐트러져 ${r.dealt}\u00a0피해.` : `별빛 마법! ${r.dealt}\u00a0피해.`); }
    if (a === 'def') { hero.classList.add('is-guard'); env.sfx('guard'); if (!auto) lines.push(`${josa(N, '은')} 자세를 낮추고 막을 준비를 했다.`); }
    if (r.mAct) {   // 몬스터 차례
      const v = m.mon.v;
      if (r.it === 'claw') lines.push(`${v.claw}! ${r.taken}\u00a0피해${a === 'def' ? ' — 막았다!' : '.'}`);
      if (r.it === 'smash') lines.push(a === 'def' ? `${josa(v.smash, '을')} 막아 내고 반격! ${r.counter}\u00a0피해.` : `${v.smash}! ${r.taken}\u00a0피해.`);
      if (r.it === 'charge') lines.push(`${josa(M, '은')} 힘을 모으고 있다…`);
      if (r.it === 'guard' && a !== 'atk') lines.push(`${josa(M, '은')} 웅크린 채 버텼다.`);
      if (r.taken > 0) after(0.45, () => { cls(foe, 'is-strike'); cls(hero, 'is-hit'); floatNum(hero, `-${r.taken}`, 'hurt'); setHP(); env.sfx('hurt'); if (m.hp > 0) setHero(r.taken >= 15 ? 'hurt' : 'focus'); });
      if (r.counter > 0) after(0.6, () => { cls(foe, 'is-hit'); floatNum(foe, `-${r.counter}`, 'counter'); setHP(); env.sfx('hit'); });
    }
    logEl.textContent = lines.join(' ');
    after(r.counter > 0 ? 0.95 : 0.85, () => { setHP(); if (m.over) end(); else newTurn(); });
  };
  // aria-disabled 버튼도 눌리면 choose가 걸러 준다(마력 소진이면 안내)
  acts.addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) choose(b.dataset.a); });
  setHero('focus'); setHP(); setButtons(false); showIntent();
  turnN.textContent = `턴 1 / ${m.maxTurns}`;
  return {
    el, model: m,
    begin() { newTurn(); },
    update(dt) {
      clock += dt;
      for (let i = 0; i < q.length;) { if (q[i].at <= clock) q.splice(i, 1)[0].fn(); else i++; }
      if (state === 'choose') {
        tleft -= dt;
        tbar.style.width = `${clamp(tleft / TURN_LIMIT, 0, 1) * 100}%`;
        tbar.parentElement.classList.toggle('low', tleft < 1.6);
        if (tleft <= 0) choose('def', true);
      }
      env.progress((m.turn - 1 + (state === 'choose' ? 1 - clamp(tleft / TURN_LIMIT, 0, 1) : 1)) / m.maxTurns);
    },
    key(e, isDown) {
      const a = ACT_KEYS[e.code];
      if (!a) return false;
      if (isDown && !e.repeat && state === 'choose') { btns[a].focus({ preventScroll: true }); choose(a); }
      return true;
    },
    onPause() {},
    destroy() { q = []; state = 'over'; },
  };
}

// ──────────────────────────────────────────────────────────────────────
// 게임 표
// ──────────────────────────────────────────────────────────────────────
const GAMES = {
  exam: { create: createExam, realtime: true, keys: HOLD_KEYS,
    how: ['누르고 있으면 별이 올라가고, 놓으면 내려가요.', '별을 금색 「집중의 띠」 안에 붙잡아 두세요. 띠는 움직이면서 점점 좁아져요.', '가끔 잡념이 별을 밀어내요. 침착하게 되돌리세요!', '띠 안에 머문 시간이 길수록 좋은 결과가 나와요.'],
    controls: [['키보드', 'Space 또는 ↑ 누르고 있기'], ['마우스·터치', '화면이나 「집중!」 버튼 누르고 있기']] },
  ball: { create: createBall, realtime: true, keys: new Set(Object.keys(LANE_KEYS)),
    how: ['별이 세 줄로 내려와요. 아래 동그라미에 닿는 순간 그 줄을 눌러요.', '박자에 딱 맞으면 「완벽」, 조금 어긋나면 「좋아요」.', '아무 때나 마구 누르거나 세 줄을 한꺼번에 누르면 크게 감점이에요.', '똑딱 소리가 박자예요. 네 박마다 높은 소리가 나요.'],
    controls: [['키보드', 'A S D 또는 ← ↓ →'], ['마우스·터치', '그 줄이나 아래 버튼 누르기']] },
  cooking: { create: createCooking, realtime: true, keys: STOP_KEYS,
    how: ['불 조절 바늘이 좌우로 움직여요.', '바늘이 초록 구간에 오면 눌러서 멈추세요. 가운데 금색이면 「완벽」!', '수프 → 생선 → 소스, 모두 세 번. 갈수록 빨라져요.', '한참 안 누르면 불을 놓쳐요.'],
    controls: [['키보드', 'Space 또는 Enter'], ['마우스·터치', '화면이나 「지금!」 버튼 누르기']] },
  adventure: { create: createAdventure, realtime: false, keys: new Set(Object.keys(ACT_KEYS)),
    how: ['몬스터의 「다음 행동」이 미리 보여요. 보고 고르세요.', '공격: 기본 피해 · 방어: 받는 피해를 크게 줄이고, 강한 공격엔 반격 · 도망: 바로 끝내기', '마법(2회): 큰 피해. 몬스터가 웅크리거나 힘을 모을 때 쓰세요. 공격해 오는 턴엔 주문이 흐트러져 절반만 들어가요.', '최대 5턴. 다치지 않고 빨리 이길수록 좋아요. 5초 안에 고르지 않으면 자동으로 방어해요.'],
    controls: [['키보드', '1 공격 · 2 방어 · 3 마법 · 4 도망'], ['마우스·터치', '아래 버튼 누르기']] },
};

// ──────────────────────────────────────────────────────────────────────
// 결과 문장 (서술: 평서문, 아이 대사: 반말)
// ──────────────────────────────────────────────────────────────────────
const LINES = {
  exam: [
    (J) => `${J('은')} 창밖의 나비를 세다가 답안지를 반쯤 비워 두었다.`,
    (J) => `잡념에 몇 번 흔들렸지만 ${J('은')} 끝까지 펜을 놓지 않았다.`,
    (J) => `${J('은')} 흔들리는 마음을 다잡으며 차근차근 문제를 풀어 나갔다.`,
    (J, N) => `깊이 몰입하자 문제가 술술 풀렸다. ${N} 곁에서 작은 별빛이 반짝였다.`,
    (J, N) => `완벽한 집중이었다. 마지막 문제를 풀자 ${N} 주위로 금빛 별이 조용히 맴돌았다.`,
  ],
  ball: [
    (J) => `박자를 놓친 ${J('이')} 상대의 발을 두 번이나 밟았다. "…미안해!"`,
    (J) => `스텝이 조금 엉켰지만 ${J('은')} 끝까지 웃으며 춤을 마쳤다.`,
    (J) => `${J('이')} 음악에 맞춰 무난하게 스텝을 밟았다.`,
    () => '경쾌한 스텝에 홀 여기저기서 작은 감탄이 새어 나왔다.',
    (J) => `${J('이')} 돌 때마다 긴 머리칼과 별빛이 함께 흩날렸다. 홀이 숨을 죽였다.`,
  ],
  cooking: [
    (J) => `냄비에서 까만 연기가 피어올랐다. ${J('이')} 머쓱하게 웃었다. "다음엔 잘할 수 있어!"`,
    () => '간이 조금 어긋났지만 그럭저럭 먹을 만한 요리가 되었다.',
    (J) => `${J('이')} 만든 요리는 소박하고 따뜻한 맛이 났다.`,
    () => '불 조절이 딱 좋았다. 고소한 냄새가 부엌 가득 퍼졌다.',
    (J) => `한 숟갈 뜨자마자 모두가 말을 잊었다. ${J('이')} 뿌듯하게 국자를 내려놓았다.`,
  ],
  adventure: [
    (J) => `${J('은')} 넘어져 무릎이 까졌지만 씩씩하게 털고 일어났다.`,
    (J) => `아슬아슬했다. ${J('은')} 숨을 고르며 다음엔 더 잘하겠다고 다짐했다.`,
    (J) => `${J('은')} 침착하게 버티며 무사히 위기를 넘겼다.`,
    (J) => `${J('이')} 상대의 움직임을 읽고 날렵하게 받아쳤다.`,
    (J) => `빈틈이 없었다! ${J('이')} 검을 거두자 별빛이 반짝 흩어졌다.`,
  ],
};
export function resultLine(kind, stars, name = '아이') {
  const N = String(name || '아이'), J = (p) => josa(N, p);
  return (LINES[kind] || LINES.exam)[clamp(stars, 1, 5) - 1](J, N);
}

// ──────────────────────────────────────────────────────────────────────
// 진행 틀: 제목 카드 → 카운트다운 → 플레이(일시정지) → 결과 → resolve
// ──────────────────────────────────────────────────────────────────────
let running = false, seq = 0;

export async function playMinigame(kind, ctx = {}) {
  const G = GAMES[kind];
  if (!G) throw new Error(`알 수 없는 미니게임: ${kind}`);
  if (typeof document === 'undefined') throw new Error('미니게임은 브라우저에서만 실행됩니다');
  if (running) throw new Error('이미 진행 중인 미니게임이 있습니다');
  running = true;
  try { return await runShell(kind, G, ctx || {}); } finally { running = false; }
}

const RESULT_TITLE = ['아쉬워요', '조금 아쉬워요', '무난해요', '잘했어요!', '훌륭해요!'];

function advTag(a) {
  if (a >= 0.34) return ['good', '유리 · 한결 수월해요'];
  if (a > 0.08) return ['good', '조금 유리'];
  if (a <= -0.34) return ['bad', '불리 · 더 빠듯해요'];
  if (a < -0.08) return ['bad', '조금 불리'];
  return ['even', '보통'];
}

function runShell(kind, G, ctx) {
  return new Promise((resolve) => {
    const info = MINIGAME_INFO[kind], uid = `mg${++seq}`;
    const rm = typeof ctx.reducedMotion === 'boolean' ? ctx.reducedMotion : !!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const adv = advantageOf(ctx);
    const seed = Number.isInteger(ctx.seed) ? ctx.seed >>> 0 : (Math.random() * 4294967296) >>> 0;
    const rand = mulberry32(seed);
    const name = String(ctx.childName || '아이').slice(0, 24);
    const look = { hair: ctx.hair, eyes: ctx.eyes };
    const outfit = OUTFIT_OF[kind];
    const prevFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const docEl = document.documentElement, prevOverflow = docEl.style.overflow;
    docEl.style.overflow = 'hidden';

    const root = h(`<div class="mg-root${rm ? ' mg-rm' : ''}" data-kind="${kind}" data-phase="intro" role="dialog" aria-modal="true" aria-labelledby="${uid}-t">
      <div class="mg-panel"><div class="mg-view"></div><div class="mg-sr" aria-live="polite" aria-atomic="true"></div></div></div>`);
    const view = root.querySelector('.mg-view'), sr = root.querySelector('.mg-sr');
    document.body.appendChild(root);

    let phase = 'intro', game = null, raf = 0, last = 0, frameAt = 0, countT = 0, countShown = null, pausedFrom = null, pauseEl = null;
    let finalScore = null, closed = false, finishing = false, curMood = '', srAt = 0, sayTimer = 0;
    const timers = new Set();   // 오버레이가 띄운 setTimeout 전부. 닫을 때 한꺼번에 치운다
    const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (!closed) fn(); }, ms); timers.add(id); return id; };
    // 이 화면이 뜨기 전부터 눌려 있던 키(예: 시험에서 Space를 누른 채 끝남)가 새 화면의 버튼을 눌러 버리지 않게 한다
    let freshKeys = new Set();
    const armKeys = () => { freshKeys = new Set(); };
    let stage = null, countEl = null, sayEl = null, timeBar = null, ava = null;
    const setPhase = (p) => { phase = p; root.dataset.phase = p; };
    const announce = (t, force = false) => { const now = performance.now(); if (!force && now - srAt < 900) return; srAt = now; sr.textContent = t; };
    const soundBtn = () => `<button type="button" class="mg-ib" data-act="sound" aria-pressed="${soundOn}" aria-label="소리 ${soundOn ? '끄기' : '켜기'}" title="소리">${icon(soundOn ? 'soundOn' : 'soundOff')}</button>`;

    const env = {
      kind, ctx, adv, rm, rand, name, look,
      playing: () => phase === 'play' && !closed,
      active: () => (phase === 'play' || phase === 'count') && !closed,
      later,
      lag: () => (phase === 'play' ? Math.min(0.05, Math.max(0, (performance.now() - frameAt) / 1000)) : 0),
      finish,
      announce,
      sfx: (n) => SFX[n]?.(),
      progress(f) { if (timeBar) { const v = Math.round(clamp(f, 0, 1) * 100); timeBar.firstElementChild.style.width = `${v}%`; timeBar.setAttribute('aria-valuenow', String(v)); } },
      mood(md) { if (!ava || md === curMood) return; curMood = md; ava.innerHTML = princessSVG({ outfit, mood: md, crop: true, sparkle: false, ...look }); },
      bob() { if (!ava || rm) return; ava.classList.remove('bob'); void ava.offsetWidth; ava.classList.add('bob'); },
      say(t, tone = '') {
        if (!sayEl) return;
        sayEl.textContent = t; sayEl.className = `mg-say ${tone}`; void sayEl.offsetWidth; sayEl.classList.add('show');
        clearTimeout(sayTimer); timers.delete(sayTimer); sayTimer = later(() => sayEl?.classList.remove('show'), 950);
        announce(t, true);
      },
    };

    // ── 제목 카드 ──
    function renderIntro() {
      const [tone, tag] = advTag(adv);
      const hasCheck = ctx.value != null && ctx.dc != null;
      const statName = ctx.statName || ctx.stat || '능력치';
      view.innerHTML = `<div class="mg-intro">
        <div class="mg-intro-hero">
          <div class="mg-ava-xl">${princessSVG({ outfit, mood: 'calm', prop: PROP_OF[kind], ...look })}</div>
          <div class="mg-intro-txt">
            <div class="mg-kicker">${icon(kind)} 미니게임 · ${esc(info.genre)}</div>
            <h2 id="${uid}-t">${esc(info.name)}</h2>
            ${ctx.title ? `<div class="mg-ev">「${esc(ctx.title)}」</div>` : ''}
            ${hasCheck ? `<div class="mg-check"><span class="mg-check-v">판정 <b>${esc(statName)}</b> <span class="mg-num">${esc(Math.round(Number(ctx.value)))}</span> <span class="mg-dim">/ 목표 ${esc(Math.round(Number(ctx.dc)))}</span></span> <em class="mg-adv ${tone}">${tag}</em></div>` : ''}
          </div>
          ${soundBtn()}
        </div>
        <p class="mg-desc">${esc(info.desc)}</p>
        <ul class="mg-how">${G.how.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="mg-controls">${G.controls.map(([k, v]) => `<div><span>${esc(k)}</span>${esc(v)}</div>`).join('')}</div>
        <div class="mg-btns"><button type="button" class="primary mg-go" data-act="start">시작하기</button><button type="button" class="ghost" data-act="skip">건너뛰기 (자동 판정)</button></div>
        <div class="mg-foot"><span>${esc(info.secs)}</span><span> · 결과가 판정 주사위(±60)를 대신해요</span><span class="mg-keyhint"> · Esc 일시정지</span></div>
      </div>`;
      root.querySelector('[data-act=start]').focus({ preventScroll: true });
      armKeys();
    }

    // ── 플레이 ──
    function startGame() {
      audioCtx();
      view.innerHTML = `<div class="mg-play">
        <div class="mg-head">
          <div class="mg-ava"></div>
          <div class="mg-head-mid">
            <div class="mg-head-t"><b id="${uid}-t">${esc(info.name)}</b><span>${esc(ctx.title || info.genre)}</span></div>
            <div class="mg-time" role="progressbar" aria-label="진행" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
          </div>
          ${soundBtn()}
          <button type="button" class="mg-ib" data-act="pause" aria-label="일시정지 (Esc)" title="일시정지 (Esc)">${icon('pause')}</button>
        </div>
        <div class="mg-body"></div>
      </div>`;
      ava = view.querySelector('.mg-ava'); timeBar = view.querySelector('.mg-time');
      env.mood('calm');
      game = G.create(env);
      view.querySelector('.mg-body').appendChild(game.el);
      stage = game.el.querySelector('.mg-stage');
      countEl = h('<div class="mg-count" aria-hidden="true"></div>'); sayEl = h('<div class="mg-say" aria-hidden="true"></div>');
      stage.append(countEl, sayEl);
      root.__mg = { kind, seed, adv, rm, model: game.model, get phase() { return phase; } };   // 실험실·자동 테스트용 관찰 창
      if (G.realtime) { stage.focus({ preventScroll: true }); beginCount(3); }
      else { setPhase('play'); game.begin?.(); }
      last = 0; raf = requestAnimationFrame(loop);
    }
    const STEP = 0.6;
    function beginCount(n) { setPhase('count'); countT = n * STEP + 0.4; countShown = null; }
    function loop(now) {
      if (closed) return;
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, Math.max(0, (now - last) / 1000)) : 0;
      last = now; frameAt = performance.now();
      if (phase === 'count') {
        countT -= dt;
        const n = Math.ceil((countT - 0.4) / STEP), label = n > 0 ? String(n) : '시작!';
        if (label !== countShown) { countShown = label; countEl.textContent = label; countEl.classList.remove('pop'); void countEl.offsetWidth; countEl.classList.add('pop'); SFX[n > 0 ? 'tick' : 'go'](); if (n > 0) announce(`${n}`, true); else announce('시작!', true); }
        if (countT <= 0) { setPhase('play'); game.begin?.(); }
      } else if (phase === 'play') {
        try { game.update(dt); } catch (e) { console.error('[minigame]', e); finish(0.5, { summary: '문제가 생겨 보통 결과로 처리했어요.' }); }
      }
      if (game && phase !== 'result') game.draw?.();
    }

    // ── 일시정지 ──
    function pause() {
      if (phase !== 'play' && phase !== 'count') return;
      pausedFrom = phase; setPhase('pause'); game?.onPause?.();
      pauseEl = h(`<div class="mg-pause" role="alertdialog" aria-modal="true" aria-labelledby="${uid}-p"><div class="mg-pause-card">
        <div class="mg-pause-star">${icon('pause')}</div><h3 id="${uid}-p">잠깐 쉬는 중</h3><p>준비되면 이어서 해요.</p>
        <div class="mg-btns"><button type="button" class="primary" data-act="resume">계속하기</button><button type="button" class="ghost" data-act="quit">그만두고 자동 판정</button></div></div></div>`);
      root.appendChild(pauseEl);
      pauseEl.querySelector('[data-act=resume]').focus({ preventScroll: true });
      armKeys();
      announce('일시정지', true);
    }
    function resume() {
      if (phase !== 'pause') return;
      pauseEl?.remove(); pauseEl = null;
      if (G.realtime) { stage?.focus({ preventScroll: true }); beginCount(pausedFrom === 'count' ? 3 : 2); }
      else { setPhase('play'); const f = game?.el.querySelector('.mg-acts [aria-disabled=false]') || game?.el.querySelector('.mg-acts button'); f?.focus({ preventScroll: true }); }
    }

    // ── 결과 ──
    function finish(score, detail = {}) {
      if (finishing || closed) return;
      finishing = true;
      finalScore = Math.round(clamp(Number(score) || 0, 0, 1) * 1000) / 1000;
      game?.onPause?.();
      setPhase('end');
      later(() => showResult(detail), rm ? 250 : 600);
    }
    function showResult(detail) {
      if (closed) return;
      cancelAnimationFrame(raf); raf = 0;
      try { game?.destroy?.(); } catch { /* */ }
      game = null; stage = countEl = sayEl = timeBar = ava = null;
      const stars = starsOf(finalScore), swing = swingOf(finalScore);
      const mood = stars >= 4 ? 'happy' : stars <= 1 ? 'sad' : stars === 2 ? 'daze' : 'calm';
      setPhase('result');
      view.innerHTML = `<div class="mg-result">
        <div class="mg-ava-xl sm">${princessSVG({ outfit, mood, prop: PROP_OF[kind], ...look })}</div>
        <div class="mg-kicker">${icon(kind)} ${esc(info.name)} 결과</div>
        <h2 id="${uid}-t" class="mg-rtitle">${RESULT_TITLE[stars - 1]}</h2>
        <div class="mg-stars" role="img" aria-label="별 5개 중 ${stars}개">${Array.from({ length: 5 }, (_, i) => `<svg class="mg-star${i < stars ? ' on' : ''}" style="--i:${i}" viewBox="0 0 40 40" aria-hidden="true"><path d="${STAR5}"/></svg>`).join('')}</div>
        <p class="mg-line">${esc(resultLine(kind, stars, name))}</p>
        ${detail.summary ? `<div class="mg-sum">${esc(detail.summary)}</div>` : ''}
        <div class="mg-swing">판정 보정 <b class="${swing > 0 ? 'up' : swing < 0 ? 'down' : ''}">${swing > 0 ? '+' : ''}${swing}</b><span>주사위 ±60 대신</span></div>
        <div class="mg-btns one"><button type="button" class="primary" data-act="ok">확인</button></div>
      </div>`;
      root.querySelector('[data-act=ok]').focus({ preventScroll: true });
      armKeys();
      const rt = RESULT_TITLE[stars - 1];
      announce(`${info.name} 결과: ${/[!.]$/.test(rt) ? rt : rt + '.'} 별 5개 중 ${stars}개. ${resultLine(kind, stars, name)} 판정 보정 ${swing > 0 ? '+' : ''}${swing}.`, true);
      (stars >= 4 ? SFX.fanfare : stars <= 2 ? SFX.soft : SFX.good)();
    }

    // ── 닫기 ──
    function close(value) {
      if (closed) return;
      closed = true;
      cancelAnimationFrame(raf); raf = 0;
      for (const id of timers) clearTimeout(id);
      timers.clear();
      try { game?.destroy?.(); } catch { /* */ }
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', onBlur);
      root.removeEventListener('contextmenu', onMenu);
      root.remove();
      docEl.style.overflow = prevOverflow;
      if (prevFocus?.isConnected) { try { prevFocus.focus({ preventScroll: true }); } catch { /* */ } }
      resolve(value);
    }

    // ── 입력 ──
    function trapTab(e) {
      const scope = pauseEl || root;
      const f = [...scope.querySelectorAll('button:not([tabindex="-1"]),[tabindex="0"]')].filter(x => x.offsetParent !== null);
      if (!f.length) { e.preventDefault(); return; }
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey ? i <= 0 : i === -1 || i === f.length - 1) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
    }
    const buttonScreen = () => phase === 'intro' || phase === 'pause' || phase === 'result';
    function onKeyDown(e) {
      if (closed) return;
      if (e.key === 'Tab') { trapTab(e); return; }
      const esc_ = e.key === 'Escape' || e.code === 'KeyP';
      if (buttonScreen()) {
        // 화면이 바뀌기 전부터 누르고 있던 키의 자동 반복은 버튼을 누르지 않는다
        if (e.repeat) { e.preventDefault(); return; }
        freshKeys.add(e.code);
      }
      if (phase === 'intro') { if (e.key === 'Escape') { e.preventDefault(); close(null); } return; }
      if (phase === 'result') { if (e.key === 'Escape') { e.preventDefault(); close(finalScore); } return; }
      if (phase === 'pause') { if (esc_) { e.preventDefault(); resume(); } return; }
      if (phase === 'end') { if (G.keys.has(e.code)) e.preventDefault(); return; }
      if (esc_) { e.preventDefault(); e.stopPropagation(); pause(); return; }
      // 카운트다운 중 입력도 게임에 넘긴다(누르고 있기는 시작과 함께 반영, 탭·멈춤은 게임 쪽에서 무시)
      if ((phase === 'play' || phase === 'count') && game?.key?.(e, true)) { e.stopPropagation(); if (G.realtime) e.preventDefault(); return; }
      if (G.realtime && G.keys.has(e.code)) e.preventDefault();
    }
    function onKeyUp(e) {
      if (closed) return;
      if (buttonScreen()) { if (!freshKeys.has(e.code)) e.preventDefault(); else freshKeys.delete(e.code); return; }
      if ((phase === 'play' || phase === 'count') && game?.key?.(e, false)) { if (G.realtime) e.preventDefault(); return; }
      if (G.realtime && (phase === 'count' || phase === 'end') && G.keys.has(e.code)) e.preventDefault();
    }
    function onVis() { if (document.hidden && (phase === 'play' || phase === 'count')) pause(); }
    function onBlur() { game?.onPause?.(); }   // 창 밖으로 나가면 누르고 있던 입력만 푼다
    function onMenu(e) { if (phase === 'play' || phase === 'count' || phase === 'end') e.preventDefault(); }   // 길게 누르기 메뉴 방지
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onBlur);
    root.addEventListener('contextmenu', onMenu);

    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const act = b.dataset.act;
      if (act === 'start' && phase === 'intro') {
        try { startGame(); } catch (err) { console.warn('[minigame] 시작 실패, 자동 판정으로', err); close(null); }
      }
      else if (act === 'skip' && phase === 'intro') close(null);
      else if (act === 'pause') pause();
      else if (act === 'resume') resume();
      else if (act === 'quit' && phase === 'pause') close(null);
      else if (act === 'ok' && phase === 'result') close(finalScore);
      else if (act === 'sound') {
        soundOn = !soundOn;
        try { globalThis.localStorage?.setItem(SOUND_KEY, soundOn ? '1' : '0'); } catch { /* */ }
        b.setAttribute('aria-pressed', String(soundOn)); b.setAttribute('aria-label', `소리 ${soundOn ? '끄기' : '켜기'}`); b.innerHTML = icon(soundOn ? 'soundOn' : 'soundOff');
        if (soundOn) SFX.tick();
      }
    });

    renderIntro();
  });
}

// 노드 보정 스크립트·실험실용
export const _internal = { examModel, ballModel, cookingModel, adventureModel, MONSTERS, GAMES, mulberry32 };
