// 레이어드 SVG 초상 (GDD 4.4). assets/char/{stage}_{outfit}.png 가 있으면 그 이미지를 우선 사용.
import { STATS } from '../data/stats.js';

const HAIR = { white: '#f3f3f7', silver: '#dfe3ee', gold: '#f2d16b', black: '#2b2b35', brown: '#7a4b2a', rose: '#e8a1b4' };
const EYES = { crimson: '#c4303a', violet: '#8e6bd6', blue: '#4f8fd6', green: '#5cb27a', amber: '#d6953f', gray: '#8a8f9e' };

export function dominantCat(s) {
  const sum = { body: 0, mind: 0, social: 0, inner: 0 };
  for (const st of STATS) sum[st.cat] += s.stats[st.id];
  return Object.entries(sum).sort((a, b) => b[1] - a[1])[0][0];
}

export function portraitKey(s) { return `${s.stage}_${dominantCat(s)}`; }

// 별의 아이 상징: 금색 4각 별 반짝임 (마력이 높을수록 많아짐)
function sparkles(s) {
  const n = 2 + Math.min(6, Math.floor((s.stats?.mag ?? 0) / 90));
  const pts = [[40, 70], [150, 60], [160, 150], [30, 170], [140, 30], [52, 30], [170, 100], [20, 120]];
  return pts.slice(0, n).map(([x, y], i) => { const r = 4 + (i % 3) * 2; return `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}z" fill="#f4d27a" opacity=".9"><animate attributeName="opacity" values=".35;1;.35" dur="${2 + i * 0.4}s" repeatCount="indefinite"/></path>`; }).join('');
}

export function portraitSVG(s) {
  const stage = s.stage;
  const scale = { child: 0.78, girl: 0.86, teen: 0.94, youth: 1.0, adult: 1.0 }[stage] ?? 1;
  const hair = HAIR[s.hair] ?? HAIR.white, eyes = EYES[s.eyes] ?? EYES.crimson;
  const cat = dominantCat(s);
  const outfit = { body: '#1f1d24', mind: '#1f1d2a', social: '#f1eef0', inner: '#f3f1ea' }[cat];
  const outfit2 = { body: '#a3242f', mind: '#4b3c8f', social: '#1b1a1f', inner: '#2f6b45' }[cat];
  const shoulders = 26 + Math.min(10, s.stats.str / 80);           // 근력 → 어깨
  const posture = Math.min(6, s.stats.cult / 100);                 // 교양 → 자세(곧게)
  const tired = s.stress >= 70, happy = s.trust >= 70 && s.stress < 50, sad = s.trust < 35;
  const mouth = tired ? 'M86 118 q10 -4 20 0' : happy ? 'M84 116 q12 10 24 0' : sad ? 'M86 120 q10 -6 20 0' : 'M86 117 q10 4 20 0';
  const eyeH = tired ? 3 : 6;
  const accessory = {
    body: `<path d="M60 150 l-14 70 l6 2 l16 -66z" fill="#a9a9b3" stroke="#555" stroke-width="1.5"/><rect x="42" y="214" width="14" height="8" rx="2" fill="#6b4a2a"/>`,
    mind: `<rect x="124" y="160" width="34" height="42" rx="3" fill="#6b4a2a"/><rect x="128" y="164" width="26" height="34" fill="#efe6cf"/><path d="M98 ${150} q0 -8 6 -8" stroke="#8e6bd6" fill="none"/>`,
    social: `<ellipse cx="96" cy="${152}" rx="4" ry="4" fill="#fff3b0" stroke="#c99a3a"/><path d="M80 ${150} q16 12 32 0" stroke="#c99a3a" fill="none" stroke-width="1.5"/>`,
    inner: `<path d="M96 150 v14 M90 158 h12" stroke="#d9c27a" stroke-width="3" stroke-linecap="round"/>`,
  }[cat];
  const hairBack = stage === 'child' ? 'M56 70 q-10 40 -4 90 q22 -10 44 -2 q22 -8 44 2 q6 -50 -4 -90z' : 'M54 70 q-14 60 -2 120 q22 -12 44 -2 q22 -10 44 2 q12 -60 -2 -120z';
  const glow = s.flags?.magic_awake ? `<circle cx="150" cy="130" r="6" fill="#bfa6ff" opacity=".8"><animate attributeName="opacity" values=".4;1;.4" dur="2.4s" repeatCount="indefinite"/></circle>` : '';
  return `<svg viewBox="0 0 192 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${s.name} 초상">
  <defs><radialGradient id="bgG" cx="50%" cy="35%"><stop offset="0" stop-color="#2a2140"/><stop offset="1" stop-color="#140f22"/></radialGradient></defs>
  <rect width="192" height="260" rx="14" fill="url(#bgG)"/>
  <g transform="translate(96 250) scale(${scale}) translate(-96 -250)">
    <path d="${hairBack}" fill="${hair}" opacity=".9"/>
    <!-- 몸 -->
    <path d="M${96 - shoulders} 150 q${shoulders} -${10 + posture} ${shoulders * 2} 0 l10 100 h-${shoulders * 2 + 20}z" fill="${outfit}" stroke="${outfit2}" stroke-width="2"/>
    <path d="M${96 - shoulders + 6} 160 q${shoulders - 6} -8 ${(shoulders - 6) * 2} 0 l4 30 h-${(shoulders - 6) * 2 + 8}z" fill="${outfit2}" opacity=".35"/>
    <rect x="86" y="128" width="20" height="26" rx="6" fill="#f3d9c6"/>
    <!-- 얼굴 -->
    <ellipse cx="96" cy="100" rx="30" ry="34" fill="#f6dfcf"/>
    <path d="M66 92 q4 -40 30 -40 q26 0 30 40 q-10 -14 -30 -12 q-20 -2 -30 12z" fill="${hair}"/>
    <path d="M70 80 q-8 30 -2 60 q6 -8 12 -2 q-6 -30 -2 -56z" fill="${hair}"/><path d="M122 80 q8 30 2 60 q-6 -8 -12 -2 q6 -30 2 -56z" fill="${hair}"/>
    <ellipse cx="84" cy="102" rx="5" ry="${eyeH}" fill="${eyes}"/><ellipse cx="108" cy="102" rx="5" ry="${eyeH}" fill="${eyes}"/>
    <circle cx="86" cy="100" r="1.6" fill="#fff"/><circle cx="110" cy="100" r="1.6" fill="#fff"/>
    ${tired ? '<path d="M78 94 l12 3 M114 94 l-12 3" stroke="#6b4a4a" stroke-width="1.5"/>' : ''}
    <path d="${mouth}" stroke="#b05a5a" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${sad ? '<circle cx="80" cy="111" r="1.5" fill="#9ec3ff"/>' : ''}
    ${happy ? '<ellipse cx="76" cy="110" rx="5" ry="3" fill="#f3a7a7" opacity=".6"/><ellipse cx="116" cy="110" rx="5" ry="3" fill="#f3a7a7" opacity=".6"/>' : ''}
    ${accessory}
    ${glow}
    ${sparkles(s)}
  </g>
</svg>`;
}
