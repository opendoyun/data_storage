// 별의 공주 — 엔딩 앨범 · 편지함 · 지난 아이들 · 별 조각 상점 · 성격 지도 (GDD 4.8, 4.9, P1)
// 바닐라 DOM. 모듈 최상위에서는 DOM을 건드리지 않는다(Node에서 import해 HTML 생성 함수를 테스트할 수 있다).
// 사용자 입력(아이 이름 등)과 데이터 텍스트는 모두 esc()를 거쳐 HTML에 들어간다.
import { PERSONALITY, STATS } from '../data/stats.js';
import { GUARDIANS } from '../data/guardians.js';
import { ENDINGS } from '../data/endings.js';
import { josa } from '../engine/josa.js';
import * as M from '../engine/meta.js';

// 범주 색: 참조 팔레트(어두운 면) 8색을 범주 순서에 배치해 인접 쌍 CVD·정상 시각 검사를 통과한 조합.
// 색은 항상 범주 이름 텍스트와 함께 쓰인다(색만으로 구분하지 않음). 히든은 브랜드 금색.
export const CAT_ORDER = ['왕실/정치', '무예', '학문/마법', '예술/문화', '생활/상업', '신앙', '어둠', '관계', '히든'];
export const CAT_COLORS = {
  '왕실/정치': '#9085e9', '무예': '#d95926', '학문/마법': '#3987e5', '예술/문화': '#d55181',
  '생활/상업': '#c98500', '신앙': '#199e70', '어둠': '#e66767', '관계': '#008300', '히든': '#e7c36a',
};
const catColor = (cat) => (typeof cat === 'string' && Object.prototype.hasOwnProperty.call(CAT_COLORS, cat) ? CAT_COLORS[cat] : '#a79fc4');

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const fmtDate = (iso) => (typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10).replace(/-/g, '.') : '');
const gName = (id) => (typeof id === 'string' && Object.prototype.hasOwnProperty.call(GUARDIANS, id) ? GUARDIANS[id].name : '보호자');
const withGuardian = (id) => `${josa(gName(id), '과')} 함께`;   // '은퇴한 상인과 함께' / '전직 왕실 기사와 함께'
const nowrap = (html) => `<span class="alb-nw">${html}</span>`;
const NATIVE = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
export const ordinal = (n) => (n >= 1 && n <= 10 ? `${NATIVE[n - 1]} 번째` : `${n}번째`);
const statName = (id) => STATS.find(s => s.id === id)?.name ?? id;
const COUNTER_NAMES = [['refusals', '거부'], ['forced', '강행'], ['persuaded', '설득'], ['autonomy', '자율'], ['events', '이벤트'], ['collapses', '탈진'], ['adventures', '모험']];
const STAR_PATH = (x, y, r) => `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}z`;
const starIcon = (size = 14) => `<svg class="alb-star" viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="${STAR_PATH(10, 10, 9)}"/></svg>`;

// ──────────────────────────────────────────────────────────────────────
// 성격 지도 (GDD 4.9): 5축 × 10→18세. 축마다 한 줄(소배수 차트), 같은 ±100 척도, 0선 기준.
// ──────────────────────────────────────────────────────────────────────
const AGE0 = 10, AGE1 = 18;
const STAGES = [[10, 11, '유년기'], [12, 13, '소녀기'], [14, 15, '사춘기'], [16, 17, '청년기'], [18, 18, '성인']];
function normHistory(list) {
  const byAge = new Map();
  for (const p of Array.isArray(list) ? list : []) {
    const age = Math.round(Number(p?.age));
    if (!Number.isFinite(age) || age < AGE0 || age > AGE1) continue;
    byAge.set(age, { age, ...Object.fromEntries(PERSONALITY.map(ax => [ax.id, (Math.max(-100, Math.min(100, Math.round(Number(p[ax.id]) || 0))) || 0)])) });
  }
  return [...byAge.values()].sort((a, b) => a.age - b.age);
}
const signed = (v) => (v > 0 ? '+' : '') + v;
const poleOf = (ax, v) => (v > 0 ? ax.pos : v < 0 ? ax.neg : '중간');
// 해마다의 결정 [{ age, label }] (meta 기록 또는 engine annualLog) → 나이별 한 줄
function normChoices(list) {
  const byAge = new Map();
  for (const c of Array.isArray(list) ? list : []) {
    const age = Math.round(Number(c?.age)), label = typeof c?.label === 'string' ? c.label.trim().slice(0, 40) : '';
    if (Number.isFinite(age) && age >= AGE0 && age <= AGE1 && label) byAge.set(age, label);
  }
  return byAge;
}
// 이 엔딩이 반기는 성격 [{ id, sign, pole }] → { axisId: sign }
const favorMap = (list) => Object.fromEntries((Array.isArray(list) ? list : []).filter(f => f && PERSONALITY.some(ax => ax.id === f.id) && (f.sign === 1 || f.sign === -1)).map(f => [f.id, f.sign]));
const DIAMOND = (cx, cy, r) => `M${cx.toFixed(1)} ${(cy - r).toFixed(1)}L${(cx + r).toFixed(1)} ${cy.toFixed(1)}L${cx.toFixed(1)} ${(cy + r).toFixed(1)}L${(cx - r).toFixed(1)} ${cy.toFixed(1)}Z`;

// opts: { width, label, interactive, nativeTitles, choices: [{age,label}], favor: [{id,sign}] }
export function renderPersonalityMap(persHistory, opts = {}) {
  const pts = normHistory(persHistory);
  const w0 = Number(opts.width);
  // 그려질 실제 폭으로 만든다(늘이거나 줄이면 글자가 같이 작아진다). 휴대폰(240~320)은 끝값 라벨에서 극 이름을 뺀 압축 배치
  const W = Math.max(240, Math.round(Number.isFinite(w0) ? w0 : 560));
  const narrow = W < 420, compact = W < 320;
  const choices = normChoices(opts.choices), favor = favorMap(opts.favor);
  const lane = choices.size ? 16 : 0;     // 결정 표시 줄
  // 오른쪽 여백은 끝값 라벨('+100 야망', 압축 배치는 '+100')이 잘리지 않을 만큼
  const L = compact ? 60 : narrow ? 64 : 78, R = compact ? 38 : narrow ? 70 : 80, T = 6, rowH = 64, gap = 8, B = 34 + lane;
  const plotW = W - L - R;
  const H = T + PERSONALITY.length * rowH + (PERSONALITY.length - 1) * gap + B;
  const x = (age) => L + (age - AGE0) / (AGE1 - AGE0) * plotW;
  const label = opts.label ?? '성격 지도';
  if (!pts.length) {
    return `<svg class="pm pm-empty" viewBox="0 0 ${W} 80" width="${W}" height="80" role="img" aria-label="${esc(label)}: 기록 없음"><rect class="pm-bg" x="0" y="0" width="${W}" height="80" rx="8" fill="#15102a"/><text class="pm-tick" x="${W / 2}" y="44" text-anchor="middle" fill="#a79fc4" font-size="12">성격 기록이 없다</text></svg>`;
  }
  const summary = PERSONALITY.map(ax => { const a = pts[0][ax.id], b = pts[pts.length - 1][ax.id]; return `${ax.name} ${pts[0].age}세 ${signed(a)} → ${pts[pts.length - 1].age}세 ${signed(b)}(${poleOf(ax, b)})`; }).join(', ');
  const out = [`<svg class="pm" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}: ${esc(summary)}" font-family="inherit">`];
  PERSONALITY.forEach((ax, i) => {
    const y0 = T + i * (rowH + gap), mid = y0 + rowH / 2, amp = rowH / 2 - 5;
    const y = (v) => mid - v / 100 * amp;
    out.push(`<g class="pm-row" data-axis="${ax.id}">`);
    out.push(`<rect class="pm-bg" x="${L}" y="${y0}" width="${plotW}" height="${rowH}" rx="6" fill="#15102a"/>`);
    for (const a of [12, 14, 16]) out.push(`<line class="pm-grid" x1="${x(a) - 0.5}" x2="${x(a) - 0.5}" y1="${y0 + 3}" y2="${y0 + rowH - 3}" stroke="#2a2144" stroke-width="1"/>`);
    out.push(`<line class="pm-zero" x1="${L}" x2="${L + plotW}" y1="${mid}" y2="${mid}" stroke="#4a3d70" stroke-width="1"/>`);
    out.push(`<text class="pm-axis" x="0" y="${mid + 4.5}" fill="#efe8ff" font-size="13" font-weight="700">${esc(ax.name)}</text>`);
    const fav = favor[ax.id];
    const pole = (txt, yy, on) => `<text class="pm-pole${on ? ' pm-pole-fav' : ''}" x="${L - 7}" y="${yy}" text-anchor="end" fill="${on ? '#e7c36a' : '#a79fc4'}" font-size="10.5"${on ? ' font-weight="700"' : ''}>${esc(txt)}</text>`;
    out.push(pole(`${fav === 1 ? '★ ' : ''}${ax.pos} ▲`, y0 + 12, fav === 1));
    out.push(pole(`${fav === -1 ? '★ ' : ''}${ax.neg} ▼`, y0 + rowH - 4, fav === -1));
    const coords = pts.map(p => [x(p.age), y(p[ax.id])]);
    if (coords.length > 1) {
      out.push(`<path class="pm-area" d="M${coords[0][0]} ${mid} ${coords.map(([cx, cy]) => `L${cx.toFixed(1)} ${cy.toFixed(1)}`).join(' ')} L${coords[coords.length - 1][0]} ${mid}Z" fill="#e7c36a" fill-opacity=".12"/>`);
      out.push(`<polyline class="pm-line" points="${coords.map(([cx, cy]) => `${cx.toFixed(1)},${cy.toFixed(1)}`).join(' ')}" fill="none" stroke="#e7c36a" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
    }
    coords.forEach(([cx, cy], k) => {
      const last = k === coords.length - 1;
      out.push(`<circle class="pm-dot${last ? ' pm-dot-end' : ''}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${last ? 4.5 : 3.5}" fill="#e7c36a" stroke="#1d1631" stroke-width="2"/>`);
    });
    const end = pts[pts.length - 1][ax.id];
    const [ex, ey] = coords[coords.length - 1];
    const ly = Math.max(y0 + 11, Math.min(y0 + rowH - 3, ey + 4));
    out.push(`<text class="pm-end" x="${(ex + 8).toFixed(1)}" y="${ly.toFixed(1)}" fill="#efe8ff" font-size="11.5" font-weight="600">${esc(signed(end))}${compact ? '' : ` <tspan class="pm-end-pole" fill="#a79fc4" font-weight="400">${esc(poleOf(ax, end))}</tspan>`}</text>`);
    out.push(`</g>`);
  });
  // 해마다의 결정(생일 직후 보호자가 고른 1년 방향): 그 나이에 작은 마름모. 내용은 호버·표에서
  const by = T + PERSONALITY.length * rowH + (PERSONALITY.length - 1) * gap;
  if (lane) {
    const ly = by + 9;
    out.push(`<text class="pm-lane" x="0" y="${ly + 4}" fill="#a79fc4" font-size="10.5">결정</text>`);
    out.push(`<line class="pm-grid" x1="${L}" x2="${L + plotW}" y1="${ly}" y2="${ly}" stroke="#2a2144" stroke-width="1"/>`);
    for (const [age] of choices) out.push(`<path class="pm-choice" d="${DIAMOND(x(age), ly, 4.5)}" fill="#e7c36a" stroke="#1b1532" stroke-width="1.5"/>`);
  }
  // 나이 눈금 + 성장 단계
  const ty = by + lane;
  for (let a = AGE0; a <= AGE1; a += plotW < 260 ? 2 : 1) out.push(`<text class="pm-tick" x="${x(a).toFixed(1)}" y="${ty + 13}" text-anchor="middle" fill="#a79fc4" font-size="10.5">${a}${a === AGE1 ? '세' : ''}</text>`);
  if (plotW >= 220) for (const [a0, a1, nm] of STAGES) out.push(`<text class="pm-stage" x="${((x(a0) + x(a1)) / 2).toFixed(1)}" y="${ty + 28}" text-anchor="middle" fill="#8f87ab" font-size="10">${nm}</text>`);
  // 나이별 읽기(호버) 영역: 다섯 축 값을 한 번에
  if (opts.interactive !== false) {
    const colW = plotW / (AGE1 - AGE0);
    out.push(`<line class="pm-cross" x1="0" x2="0" y1="${T}" y2="${by + lane}" stroke="#efe8ff" stroke-opacity=".45" stroke-width="1" visibility="hidden"/>`);
    for (const p of pts) {
      const vals = PERSONALITY.map(ax => `${ax.id}:${p[ax.id]}`).join(',');
      const ch = choices.get(p.age);
      const tip = opts.nativeTitles === false ? '' : `<title>${esc(`${p.age}세 — ` + PERSONALITY.map(ax => `${ax.name} ${signed(p[ax.id])}(${poleOf(ax, p[ax.id])})`).join(' · ') + (ch ? ` · 그해의 결정: ${ch}` : ''))}</title>`;
      out.push(`<rect class="pm-hit" x="${(x(p.age) - colW / 2).toFixed(1)}" y="${T}" width="${colW.toFixed(1)}" height="${by + lane - T}" fill="transparent" data-age="${p.age}" data-x="${x(p.age).toFixed(1)}" data-vals="${vals}"${ch ? ` data-choice="${esc(ch)}"` : ''}>${tip}</rect>`);
    }
  }
  out.push('</svg>');
  return out.join('');
}

// 표 보기 (호버 없이도 모든 값에 닿을 수 있게)
export function personalityTableHTML(persHistory, choicesList) {
  const pts = normHistory(persHistory);
  if (!pts.length) return '';
  const choices = normChoices(choicesList);
  const table = `<table class="alb-ptable"><thead><tr><th scope="col">축</th>${pts.map(p => `<th scope="col">${p.age}세</th>`).join('')}</tr></thead><tbody>${PERSONALITY.map(ax => `<tr><th scope="row">${esc(ax.name)} <small>${esc(ax.pos)}/${esc(ax.neg)}</small></th>${pts.map(p => `<td>${signed(p[ax.id])}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const list = choices.size ? `<ol class="alb-choices" aria-label="해마다의 결정">${[...choices].map(([age, lb]) => `<li><b>${age}세</b> ${esc(lb)}</li>`).join('')}</ol>` : '';
  return `<div class="alb-ptable-wrap">${table}</div>${list}`;
}

// opts: { choices, favor }
function pmBlock(persHistory, width, label, opts = {}) {
  const fav = (opts.favor || []).filter(f => f?.pole);
  const legend = [
    normChoices(opts.choices).size ? `<span><svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true"><path d="M5 0L10 5L5 10L0 5Z" fill="#e7c36a"/></svg> 그해의 결정</span>` : '',
    fav.length ? `<span class="alb-pm-fav">★ 이 길이 반기는 성격: ${fav.map(f => esc(f.pole)).join(' · ')}</span>` : '',
  ].filter(Boolean).join('');
  return `<div class="alb-pm">${renderPersonalityMap(persHistory, { width, nativeTitles: false, label, choices: opts.choices, favor: opts.favor })}${legend ? `<div class="alb-pm-legend">${legend}</div>` : ''}<details class="alb-pm-table"><summary>표로 보기</summary>${personalityTableHTML(persHistory, opts.choices)}</details></div>`;
}

// 컨테이너 폭에 맞춰 그리고, 폭이 바뀌면 다시 그린다(엔딩 화면 등 앨범 밖에서 쓸 때). → 해제 함수
// opts: renderPersonalityMap과 같음(width 제외). 예: mountPersonalityMap(el, S.persHistory, { choices: S.annualLog, favor: endingFavor(def) })
export function mountPersonalityMap(container, persHistory, opts = {}) {
  let lastW = 0;
  const draw = () => {
    const w = Math.floor(container.clientWidth || 0) || 560;
    if (w === lastW) return;
    lastW = w;
    container.innerHTML = renderPersonalityMap(persHistory, { ...opts, width: w });
  };
  draw();
  const unwire = wirePersonalityHover(container);
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(draw) : null;
  ro?.observe(container);
  return () => { ro?.disconnect(); unwire(); };
}
export const endingFavor = (idOrDef) => M.endingFavor(typeof idOrDef === 'string' ? ENDINGS.find(d => d.id === idOrDef) : idOrDef);

// ──────────────────────────────────────────────────────────────────────
// HTML 조각 (순수 함수 — 테스트 가능)
// ──────────────────────────────────────────────────────────────────────
function artHTML(e, big = false) {
  const n = e.secret ? '?' : '';
  const sparkles = e.hidden && e.achieved ? [[24, 26, 5], [76, 20, 4], [82, 70, 6], [18, 74, 3]].map(([sx, sy, r]) => `<path d="${STAR_PATH(sx, sy, r)}"/>`).join('') : '';
  return `<div class="alb-art${big ? ' big' : ''}${e.achieved ? '' : ' locked'}" style="--cat:${catColor(e.secret ? '히든' : e.cat)}"${e.achieved && !e.orphan ? ` data-img="${esc(e.id)}"` : ''}>
    <svg class="alb-emblem" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="30" class="ring"/><path d="${STAR_PATH(50, 50, 20)}" class="core"/>${sparkles}</svg>
    ${n ? `<span class="alb-q">${n}</span>` : ''}
  </div>`;
}
const catChip = (cat) => `<span class="alb-cat"><i style="background:${catColor(cat)}"></i>${esc(cat)}</span>`;

export function albumGridHTML(entries) {
  const groups = new Map();
  for (const c of CAT_ORDER) groups.set(c, []);
  for (const e of entries) { const c = e.secret ? '히든' : e.cat; if (!groups.has(c)) groups.set(c, []); groups.get(c).push(e); }
  return [...groups.entries()].filter(([, list]) => list.length).map(([cat, list]) => `
    <section class="alb-group">
      <h3>${catChip(cat)}<span class="alb-count">${list.filter(e => e.achieved).length} / ${list.length}</span></h3>
      <div class="alb-grid">${list.map(e => `
        <button type="button" class="alb-card${e.achieved ? ' got' : ''}${e.secret ? ' secret' : ''}${e.hidden && e.achieved ? ' shine' : ''}" data-act="card" data-id="${esc(e.id)}" aria-label="${esc(e.secret ? '알 수 없는 히든 엔딩' : e.name)}${e.achieved ? `, ${e.count}회 달성${e.letters.some(l => !l.read) ? ', 안 읽은 편지 있음' : ''}` : ', 미달성'}">
          ${artHTML(e)}
          <span class="alb-card-body">
            <b class="alb-card-name">${esc(e.name)}</b>
            ${e.achieved
              ? `<span class="alb-card-meta">${e.count}회 · 처음 ${esc(fmtDate(e.firstAt))}${e.letters.some(l => !l.read) ? '<i class="alb-dot" aria-hidden="true"></i>' : ''}</span>`
              : `<span class="alb-card-hint">${esc(e.hint)}</span>`}
          </span>
        </button>`).join('')}
      </div>
    </section>`).join('');
}

export function albumSummaryHTML(meta, entries) {
  const real = entries.filter(e => !e.orphan);
  const got = real.filter(e => e.achieved).length, hid = real.filter(e => e.hidden), hidGot = hid.filter(e => e.achieved).length;
  const tile = (label, value, sub = '') => `<div class="alb-tile"><span class="alb-tile-l">${esc(label)}</span><b>${value}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  return `<div class="alb-tiles">
    ${tile('엔딩', `${got}<small> / ${real.length}</small>`)}
    ${tile('히든 엔딩', `${hidGot}<small> / ${hid.length}</small>`)}
    ${tile('떠나보낸 아이', `${meta.totalRuns}<small>명</small>`)}
    ${tile('별 조각', `${starIcon(16)} ${meta.shards}`, `누적 ${meta.shardsEarned}`)}
  </div>`;
}

export function detailHTML(e, width = 520) {
  if (!e) return '';
  const best = e.best;
  return `<div class="alb-sheet-bg" data-act="close-detail" data-self="1"><div class="alb-sheet" role="dialog" aria-modal="true" aria-label="${esc(e.name)}">
    <button type="button" class="alb-x" data-act="close-detail" aria-label="닫기">닫기</button>
    ${artHTML(e, true)}
    <div class="alb-sheet-body">
      ${catChip(e.secret ? '히든' : e.cat)}${e.hidden && e.achieved ? '<span class="alb-badge">히든 엔딩</span>' : ''}
      <h3>${esc(e.name)}</h3>
      ${e.achieved ? `
        <div class="alb-kv"><span>달성 <b>${e.count}</b>회</span><span>처음 ${esc(fmtDate(e.firstAt))}</span>${e.lastAt && e.lastAt !== e.firstAt ? `<span>최근 ${esc(fmtDate(e.lastAt))}</span>` : ''}</div>
        ${e.epilogue ? `<div class="alb-epi"><h4>10년 후</h4><p>${esc(e.epilogue)}</p></div>` : ''}
        ${best ? `<div class="alb-best"><h4>가장 빛났던 아이</h4><p><b>${esc(best.name)}</b> · ${esc(withGuardian(best.guardian))} · ${best.runNo ? `${ordinal(best.runNo)} 아이 · ` : ''}${esc(fmtDate(best.at))}</p>
          ${best.persHistory?.length ? `<h4>그 아이의 성격 지도</h4>${pmBlock(best.persHistory, width, `${best.name}의 성격 지도`, { choices: best.choices, favor: e.favor })}` : ''}</div>` : ''}
        <div class="alb-eletters"><h4>이 길에서 온 편지 <small>${e.letters.length}${e.lettersTotal ? ` / ${e.lettersTotal}` : ''}</small></h4>
          ${e.letters.length ? `<ul>${e.letters.map(l => `<li><button type="button" class="alb-link" data-act="goto-letter" data-key="${esc(l.key)}">${l.read ? '' : '<i class="alb-dot" aria-hidden="true"></i><span class="alb-sr">안 읽음: </span>'}${esc(l.title)}</button></li>`).join('')}</ul>` : ''}
          ${e.lettersTotal && e.letters.length < e.lettersTotal ? `<p class="alb-muted">${e.letters.length ? '남은 편지는' : '이 길의 편지는'} 다음 아이와의 8년이 끝날 때마다 한 통씩 도착한다.</p>`
            : !e.letters.length ? '<p class="alb-muted">아직 이 길의 편지는 없다.</p>' : ''}
        </div>`
      : `<p class="alb-hint">${esc(e.hint)}</p><p class="alb-muted">${e.secret ? '조건을 만족하면 이 자리에 이름이 새겨진다.' : '아직 이 길을 걸은 아이가 없다.'}</p>`}
    </div>
  </div></div>`;
}

export function lettersHTML(inbox, selectedKey) {
  if (!inbox.length) return `<div class="alb-empty">${starIcon(22)}<p>아직 도착한 편지가 없다.</p><p class="alb-muted">아이가 처음 보는 길로 떠나면 그 아이에게서 첫 편지가 온다.<br>남은 편지는 다음 아이와의 8년이 끝날 때마다 한 통씩 도착한다.</p></div>`;
  const sel = inbox.find(l => l.key === selectedKey) ?? null;
  return `<div class="alb-letters${sel ? ' reading' : ''}">
    <ul class="alb-llist" aria-label="받은 편지">${inbox.map(l => `<li><button type="button" class="alb-litem${l.key === selectedKey ? ' on' : ''}${l.read ? '' : ' unread'}" data-act="letter" data-key="${esc(l.key)}">
      <span class="alb-ltitle">${l.read ? '' : '<i class="alb-dot" aria-hidden="true"></i><span class="alb-sr">안 읽음: </span>'}${esc(l.title)}</span>
      <span class="alb-lmeta">${esc(l.from?.name)} · ${l.hidden ? '히든 · ' : ''}${esc(l.endingName)} · ${esc(fmtDate(l.at))}</span></button></li>`).join('')}</ul>
    <div class="alb-lview">${sel ? `<article class="alb-paper" aria-label="${esc(sel.title)}">
        <button type="button" class="alb-back" data-act="letter-back">← 목록</button>
        <h3>${esc(sel.title)}</h3>
        <div class="alb-ptext">${esc(sel.text)}</div>
        <div class="alb-psign">${esc(sel.from?.name)} · ${esc(sel.endingName)}의 길에서 · ${esc(fmtDate(sel.at))} 도착</div>
      </article>` : `<div class="alb-empty slim"><p class="alb-muted">읽을 편지를 고르세요.</p></div>`}</div>
  </div>`;
}

export function runsHTML(runs, width = 520) {
  if (!runs.length) return `<div class="alb-empty">${starIcon(22)}<p>아직 떠나보낸 아이가 없다.</p><p class="alb-muted">8년을 끝까지 함께하면 이곳에 그 아이의 기록이 남는다.</p></div>`;
  return `<div class="alb-runs">${runs.slice().reverse().map(r => `
    <article class="alb-run" style="--cat:${catColor(r.cat)}">
      <header>
        <span class="alb-run-no">${ordinal(r.no)} 아이</span>
        <b class="alb-run-name">${esc(r.name)}</b>
        <span class="alb-run-end">${catChip(r.cat)} <b>${esc(r.endingName)}</b>${r.hidden ? '<span class="alb-badge">히든</span>' : ''}</span>
      </header>
      <div class="alb-run-meta">${[esc(withGuardian(r.guardian)), esc(fmtDate(r.at)), r.shards ? nowrap(`${starIcon(11)} +${r.shards}`) : '', r.runnerUp?.name ? nowrap(`다른 길이었다면: ${esc(r.runnerUp.name)}`) : ''].filter(Boolean).join(' · ')}</div>
      <div class="alb-run-stats">${r.topStats.map(t => `<span class="alb-pill">${esc(statName(t.id))} <b>${t.v}</b></span>`).join('')}<span class="alb-pill dim">신뢰 <b>${r.trust}</b></span></div>
      <div class="alb-run-counts">${COUNTER_NAMES.filter(([k]) => Object.prototype.hasOwnProperty.call(r.counters, k)).map(([k, nm]) => nowrap(`${nm} ${r.counters[k]}`)).join(' · ')}</div>
      ${r.persHistory.length ? `<details class="alb-run-pm"><summary>성격 지도 보기</summary>${pmBlock(r.persHistory, width, `${r.name}의 성격 지도`, { choices: r.choices, favor: endingFavor(r.endingId) })}</details>` : ''}
    </article>`).join('')}</div>`;
}

export function shopHTML(opts, flash) {
  const g = opts.guardians, b = opts.bonuses;
  return `<div class="alb-shop">
    <div class="alb-shop-head">
      <div class="alb-shard-big">${starIcon(28)}<b>${opts.shards}</b><span>가진 별 조각</span></div>
      <p class="alb-muted">8년을 끝까지 함께하면 +1, 처음 보는 엔딩이면 +2를 더(히든 엔딩이면 +3). 보호자 출신은 <b>지금까지 모은 조각(${opts.shardsEarned})</b>으로 열리고, 조각을 써도 닫히지 않는다.</p>
    </div>
    ${flash ? `<div class="alb-flash ${flash.ok ? 'ok' : 'no'}" role="status">${esc(flash.text)}</div>` : '<div class="alb-flash-slot" role="status"></div>'}
    <h3 class="alb-h">보호자 출신</h3>
    <div class="alb-guards">${g.map(x => `<div class="alb-guard${x.unlocked ? ' open' : ''}">
      <div class="alb-guard-top"><b>${esc(x.name)}</b><span>${x.unlocked ? '열림' : '잠김'}</span></div>
      <small>${esc(x.desc)}</small>
      ${x.need ? `<div class="alb-meter" role="meter" aria-valuemin="0" aria-valuemax="${x.need}" aria-valuenow="${Math.min(opts.shardsEarned, x.need)}" aria-label="${esc(x.name)} 해금 진행"><i style="width:${Math.min(100, opts.shardsEarned / x.need * 100).toFixed(0)}%"></i></div><small class="alb-guard-need">${x.unlocked ? `누적 ${x.need}개로 열림` : `${Math.min(opts.shardsEarned, x.need)} / ${x.need}`}</small>` : '<small class="alb-guard-need">처음부터 열려 있음</small>'}
    </div>`).join('')}</div>
    <h3 class="alb-h">시작 보너스 <small>한 번 얻으면 계속 쓸 수 있다 · 새 게임마다 최대 ${opts.maxActive}개 적용</small></h3>
    <div class="alb-bonuses">${b.map(x => {
      const state = x.owned ? 'owned' : !x.available ? 'locked' : x.affordable ? 'buy' : 'poor';
      const btn = { owned: '가지고 있음', locked: '잠김', buy: '조각으로 얻기', poor: `조각 ${x.cost - opts.shards}개 부족` }[state];
      return `<div class="alb-bonus ${state}">
        <div class="alb-bonus-top"><b>${esc(x.name)}</b><span class="alb-cost">${starIcon(12)} ${x.cost}</span></div>
        <p>${esc(x.desc)}</p>
        ${state === 'locked' && x.requirement ? `<small class="alb-muted">${esc(x.requirement)} 열린다.</small>` : ''}
        <button type="button" data-act="buy" data-id="${esc(x.id)}" ${state === 'buy' ? 'class="primary"' : 'disabled'}>${esc(btn)}</button>
      </div>`; }).join('')}</div>
  </div>`;
}

// ──────────────────────────────────────────────────────────────────────
// 자산: assets/ending/<id>.png 가 있으면 카드에 깐다
// ──────────────────────────────────────────────────────────────────────
const probeCache = new Map();
function probe(url) {
  if (!probeCache.has(url)) probeCache.set(url, new Promise(res => { const im = new Image(); im.onload = () => res(true); im.onerror = () => res(false); im.src = url; }));
  return probeCache.get(url);
}
function mountEndingImages(root, assetBase) {
  root.querySelectorAll('.alb-art[data-img]').forEach(async (box) => {
    const url = `${assetBase}ending/${encodeURIComponent(box.dataset.img)}.png`;
    if (await probe(url)) { const im = document.createElement('img'); im.alt = ''; im.src = url; im.loading = 'lazy'; box.appendChild(im); box.classList.add('has-img'); }
  });
}

// 성격 지도 호버: 나이 열에 십자선 + 다섯 축 값을 한 번에 (textContent로만 채운다)
function wirePersonalityHover(root) {
  let tip = null;
  const hide = () => { tip?.remove(); tip = null; root.querySelectorAll('.pm-cross').forEach(c => c.setAttribute('visibility', 'hidden')); };
  const over = (ev) => {
    const hit = ev.target.closest?.('.pm-hit');
    if (!hit) return;
    const svg = hit.ownerSVGElement;
    const cross = svg.querySelector('.pm-cross');
    cross.setAttribute('x1', hit.dataset.x); cross.setAttribute('x2', hit.dataset.x); cross.setAttribute('visibility', 'visible');
    const vals = Object.fromEntries(hit.dataset.vals.split(',').map(kv => { const [k, v] = kv.split(':'); return [k, Number(v)]; }));
    tip?.remove();
    tip = document.createElement('div'); tip.className = 'alb-tip';
    const h = document.createElement('div'); h.className = 'alb-tip-h'; h.textContent = `${hit.dataset.age}세`; tip.appendChild(h);
    for (const ax of PERSONALITY) {
      const row = document.createElement('div'); row.className = 'alb-tip-r';
      const v = document.createElement('b'); v.textContent = signed(vals[ax.id]);
      const n = document.createElement('span'); n.textContent = `${ax.name} · ${poleOf(ax, vals[ax.id])}`;
      row.append(v, n); tip.appendChild(row);
    }
    if (hit.dataset.choice) { const c = document.createElement('div'); c.className = 'alb-tip-c'; c.textContent = `그해의 결정 · ${hit.dataset.choice}`; tip.appendChild(c); }
    document.body.appendChild(tip);
    const r = hit.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = r.left + r.width / 2 + 12; if (left + tw > window.innerWidth - 8) left = r.left + r.width / 2 - tw - 12;
    tip.style.left = `${Math.max(8, left)}px`; tip.style.top = `${Math.max(8, Math.min(window.innerHeight - th - 8, r.top + 8))}px`;
  };
  const out = (ev) => { if (!ev.relatedTarget?.closest?.('.pm-hit')) hide(); };
  root.addEventListener('pointerover', over);
  root.addEventListener('pointerout', out);
  return () => { root.removeEventListener('pointerover', over); root.removeEventListener('pointerout', out); hide(); };
}

// ──────────────────────────────────────────────────────────────────────
// 앨범 화면
// opts: { onClose, onChange(meta) — 구매·편지 읽음으로 meta가 바뀌면 호출(저장은 호출자 몫),
//         tab: 'album'|'letters'|'runs'|'shop', endings, letters, categoryLetters, assetBase }
// ──────────────────────────────────────────────────────────────────────
const TABS = [['album', '엔딩 앨범', '앨범'], ['letters', '편지함', '편지'], ['runs', '지난 아이들', '아이들'], ['shop', '별 조각 상점', '상점']];

export function renderAlbum(container, meta, opts = {}) {
  const st = { meta: M.migrateMeta(meta), tab: TABS.some(t => t[0] === opts.tab) ? opts.tab : 'album', detail: null, letter: null, flash: null };
  const endings = opts.endings ?? ENDINGS;
  const src = { letters: opts.letters, categoryLetters: opts.categoryLetters };
  const assetBase = opts.assetBase ?? new URL('../../assets/', import.meta.url).href;
  let unwire = null, lastFocus = null;

  const changed = (m) => { st.meta = m; opts.onChange?.(m); };
  // 성격 지도가 실제로 받을 폭: 지난 아이들 카드(테두리·여백 ≈ 34) + 지도 상자(≈ 26) / 상세 시트는 화면 기준(최대 620, 여백 ≈ 68)
  const innerWidth = () => {
    const cs = typeof getComputedStyle === 'function' ? getComputedStyle(container) : null;
    return (container.clientWidth || 600) - (cs ? (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0) : 0);
  };
  const runsWidth = () => Math.max(240, Math.min(720, Math.floor(innerWidth() - 60)));
  const sheetWidth = () => Math.max(240, Math.min((document.documentElement?.clientWidth || 800) - 32, 620) - 68);

  function draw() {
    unwire?.();
    const entries = M.endingAlbum(st.meta, endings, src);
    const inbox = M.letterInbox(st.meta, src);
    const unread = inbox.filter(l => !l.read).length;
    let body = '';
    if (st.tab === 'album') body = `${albumSummaryHTML(st.meta, entries)}${st.meta.totalRuns ? '' : '<p class="alb-intro">아직 끝까지 함께한 아이가 없다. 첫 8년이 끝나면 이곳에 첫 장이 붙는다.</p>'}${albumGridHTML(entries)}`;
    else if (st.tab === 'letters') body = lettersHTML(inbox, st.letter);
    else if (st.tab === 'runs') body = runsHTML(st.meta.runs, runsWidth());
    else body = shopHTML(M.startOptions(st.meta), st.flash);
    const detail = st.tab === 'album' && st.detail ? detailHTML(entries.find(e => e.id === st.detail), sheetWidth()) : '';
    container.innerHTML = `<div class="alb">
      <header class="alb-head">
        <h2>${starIcon(18)} 별의 앨범</h2>
        <span class="alb-head-shards" title="가진 별 조각">${starIcon(13)} ${st.meta.shards}</span>
        ${opts.onClose ? '<button type="button" class="ghost alb-close" data-act="close">닫기</button>' : ''}
      </header>
      <nav class="alb-tabs" role="tablist">${TABS.map(([id, nm, short]) => `<button type="button" role="tab" aria-selected="${st.tab === id}" class="alb-tab${st.tab === id ? ' on' : ''}" data-act="tab" data-tab="${id}" aria-label="${nm}${id === 'letters' && unread ? `, 안 읽은 편지 ${unread}통` : ''}"><span class="alb-tl">${nm}</span><span class="alb-ts" aria-hidden="true">${short}</span>${id === 'letters' && unread ? `<span class="alb-badge-n" aria-hidden="true">${unread}</span>` : ''}</button>`).join('')}</nav>
      <div class="alb-body" role="tabpanel">${body}</div>
      ${detail}
    </div>`;
    mountEndingImages(container, assetBase);
    unwire = wirePersonalityHover(container);
    if (detail) container.querySelector('.alb-sheet .alb-x')?.focus();
  }

  function onClick(ev) {
    const t = ev.target.closest('[data-act]');
    if (!t || !container.contains(t)) return;
    const act = t.dataset.act;
    if (act === 'close-detail' && t.dataset.self && ev.target !== t) return; // 시트 안쪽 클릭은 닫지 않음
    switch (act) {
      case 'close': opts.onClose?.(); return;
      case 'tab': st.tab = t.dataset.tab; st.detail = null; st.flash = null; break;
      case 'card': lastFocus = t.dataset.id; st.detail = t.dataset.id; break;
      case 'close-detail': st.detail = null; break;
      case 'goto-letter': st.tab = 'letters'; st.detail = null; openLetter(t.dataset.key); break;
      case 'letter': openLetter(t.dataset.key); break;
      case 'letter-back': st.letter = null; break;
      case 'buy': {
        const r = M.buyBonus(st.meta, t.dataset.id);
        const b = M.BONUS_MAP[t.dataset.id];
        if (r.ok) { changed(r.meta); st.flash = { ok: true, text: `「${b.name}」${josa(b.name, '을').slice(b.name.length)} 얻었다. 새 게임에서 고를 수 있다.` }; }
        else st.flash = { ok: false, text: r.reason };
        break;
      }
      default: return;
    }
    draw();
    if (act === 'close-detail' && lastFocus) container.querySelector(`.alb-card[data-id="${CSS.escape(lastFocus)}"]`)?.focus();
  }
  function openLetter(key) {
    st.letter = key;
    if (!st.meta.lettersRead[key]) changed(M.markLetterRead(st.meta, key));
  }
  function onKey(ev) { if (ev.key === 'Escape' && st.detail) { st.detail = null; draw(); } }

  container.addEventListener('click', onClick);
  container.addEventListener('keydown', onKey);
  draw();
  return {
    setTab(tab) { if (TABS.some(t => t[0] === tab)) { st.tab = tab; st.detail = null; draw(); } },
    update(m) { st.meta = M.migrateMeta(m); draw(); },
    getMeta: () => st.meta,
    destroy() { unwire?.(); container.removeEventListener('click', onClick); container.removeEventListener('keydown', onKey); container.innerHTML = ''; },
  };
}

// ──────────────────────────────────────────────────────────────────────
// 새 게임 추가 선택: 보호자 출신(잠긴 것은 조건 표시) + 가진 시작 보너스 + 유산 미리보기
// → { getSelection(): { guardian, bonusIds }, getOptions(): newGameOptions 결과, destroy() }
// ──────────────────────────────────────────────────────────────────────
let ngSeq = 0;
export function renderNewGameExtras(container, meta, opts = {}) {
  const m = M.migrateMeta(meta);
  const so = M.startOptions(m);
  const uid = `alb-ng-${++ngSeq}`;
  const usable = so.bonuses.filter(b => b.owned && b.available);
  let guardian = so.guardians.find(g => g.id === opts.guardian && g.unlocked)?.id ?? 'knight';
  const sel = new Set((opts.bonusIds ?? []).filter(id => usable.some(b => b.id === id)).slice(0, so.maxActive));
  const legacy = M.legacyOf(m);
  const getSelection = () => ({ guardian, bonusIds: usable.map(b => b.id).filter(id => sel.has(id)) });

  function draw() {
    container.innerHTML = `<div class="alb-ng">
      <section class="alb-ng-sec"><h4>보호자 출신</h4>
        <div class="alb-ng-guards" role="radiogroup" aria-label="보호자 출신">${so.guardians.map(g => `
          <label class="alb-ng-g${g.unlocked ? '' : ' locked'}${g.id === guardian ? ' on' : ''}">
            <input type="radio" name="${uid}-g" value="${esc(g.id)}"${g.id === guardian ? ' checked' : ''}${g.unlocked ? '' : ' disabled'}>
            <b>${esc(g.name)}</b><small>${esc(g.desc)}</small>
            ${g.unlocked ? `<small class="alb-ng-call">아이가 부르는 말: ${esc(g.call)}</small>` : `<small class="alb-ng-lock">${starIcon(11)} 별 조각 누적 ${g.need}개에 열림 (지금 ${so.shardsEarned})</small>`}
          </label>`).join('')}</div>
      </section>
      <section class="alb-ng-sec"><h4>시작 보너스 <span class="alb-ng-n">${sel.size} / ${so.maxActive}</span></h4>
        ${usable.length ? `<div class="alb-ng-bonuses">${usable.map(b => {
          const on = sel.has(b.id), dis = !on && sel.size >= so.maxActive;
          return `<label class="alb-ng-b${on ? ' on' : ''}${dis ? ' dis' : ''}"><input type="checkbox" value="${esc(b.id)}"${on ? ' checked' : ''}${dis ? ' disabled' : ''}><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></label>`;
        }).join('')}</div>` : `<p class="alb-muted">${so.shards > 0 ? `별 조각 ${so.shards}개가 있다. 앨범의 별 조각 상점에서 시작 보너스를 얻을 수 있다.` : '아이를 끝까지 키우면 별 조각이 생기고, 그것으로 시작 보너스를 얻을 수 있다.'}</p>`}
      </section>
      <section class="alb-ng-sec alb-ng-legacy"><h4>${ordinal(m.totalRuns + 1)} 아이</h4>
        ${legacy.length ? `<p>지난 아이들이 이번 8년 어딘가에 스쳐 지나갈지도 모른다.</p><div class="alb-ng-leg">${legacy.map(l => `<span class="alb-pill">${esc(l.name)} <small>${esc(l.endingName)}</small></span>`).join('')}</div>` : '<p class="alb-muted">처음 만나는 아이다.</p>'}
      </section>
    </div>`;
  }
  function onChange(ev) {
    const inp = ev.target;
    if (inp.type === 'radio' && inp.name === `${uid}-g`) guardian = inp.value;
    else if (inp.type === 'checkbox') { if (inp.checked && sel.size < so.maxActive) sel.add(inp.value); else sel.delete(inp.value); }
    else return;
    draw();
    container.querySelector(`input[value="${CSS.escape(inp.value)}"]`)?.focus();
    opts.onChange?.(getSelection());
  }
  container.addEventListener('change', onChange);
  draw();
  return {
    getSelection,
    getOptions: () => M.newGameOptions(m, getSelection()),
    destroy() { container.removeEventListener('change', onChange); container.innerHTML = ''; },
  };
}
