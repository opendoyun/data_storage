// 별의 공주 — 브라우저 UI (바닐라 JS, 빌드 불필요)
import * as E from '../engine/engine.js';
import { STATS, STAT_CATS, PERSONALITY, NPCS, SEASON_NAME, stageOf } from '../data/stats.js';
import { ACTIVITIES, ACTIVITY_MAP } from '../data/activities.js';
import { portraitSVG, portraitKey } from './portrait.js';

const $ = (sel, el = document) => el.querySelector(sel);
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const AUTOSAVE = 'starborn_autosave', SLOT = (n) => `starborn_slot_${n}`;
const ASSET_BASE = 'assets/';
const assetCache = new Map(); // 존재 여부 캐시

let S = null;                 // 게임 상태
let slots = ['school', 'farm', 'rest'];
let activeSlot = 0;
let lastReport = null;
const app = $('#app');

// ──────────────────────────────────────────────────────────────────────
// 자산: 있으면 이미지, 없으면 SVG/CSS 플레이스홀더
// ──────────────────────────────────────────────────────────────────────
function assetUrl(path) { return ASSET_BASE + path + '.png'; }
function assetExists(path) {
  if (assetCache.has(path)) return Promise.resolve(assetCache.get(path));
  return new Promise(res => { const im = new Image(); im.onload = () => { assetCache.set(path, true); res(true); }; im.onerror = () => { assetCache.set(path, false); res(false); }; im.src = assetUrl(path); });
}
async function mountImage(container, path, fallbackHtml) {
  container.innerHTML = fallbackHtml || '';
  if (await assetExists(path)) { const im = h(`<img alt="" src="${assetUrl(path)}">`); container.appendChild(im); }
}

// ──────────────────────────────────────────────────────────────────────
// 타이틀 화면
// ──────────────────────────────────────────────────────────────────────
function renderTitle() {
  const auto = localStorage.getItem(AUTOSAVE);
  let hair = 'white', eyes = 'crimson';
  const HAIRS = { white: '#f3f3f7', silver: '#dfe3ee', gold: '#f2d16b', black: '#2b2b35', brown: '#7a4b2a', rose: '#e8a1b4' };
  const EYESC = { crimson: '#c4303a', violet: '#8e6bd6', blue: '#4f8fd6', green: '#5cb27a', amber: '#d6953f', gray: '#8a8f9e' };
  app.innerHTML = '';
  const el = h(`<div class="title">
    <h1>별의 공주</h1><div class="sub">Starborn Princess · 8년, 한 아이를 키운다</div>
    <div class="form">
      <label>아이 이름</label><input id="f-name" value="루나" maxlength="8">
      <label>보호자</label><select id="f-guardian"><option value="knight">전직 왕실 기사 (자금 800G · 신체 교육 +15%)</option><option value="scholar">떠돌이 학자 (자금 550G · 지성 교육 +15% · 설득 유리)</option></select>
      <label>머리색</label><div class="swatches" id="f-hair">${Object.entries(HAIRS).map(([k, c]) => `<div class="swatch ${k === hair ? 'on' : ''}" data-k="${k}" style="background:${c}" title="${k}"></div>`).join('')}</div>
      <label>눈색</label><div class="swatches" id="f-eyes">${Object.entries(EYESC).map(([k, c]) => `<div class="swatch ${k === eyes ? 'on' : ''}" data-k="${k}" style="background:${c}" title="${k}"></div>`).join('')}</div>
      <label>시드 (선택)</label><input id="f-seed" placeholder="비우면 무작위">
      <div class="full">
        ${auto ? '<button id="b-continue">이어하기 (자동저장)</button>' : ''}
        <button id="b-load">불러오기</button>
        <button class="primary" id="b-new">새로 시작</button>
      </div>
    </div>
    <div class="hint">능력치 12종 · 성격 5축 · 엔딩 32종 · 아이는 가끔 당신의 계획을 거부합니다.</div>
  </div>`);
  app.appendChild(el);
  for (const grp of ['f-hair', 'f-eyes']) $('#' + grp, el).addEventListener('click', ev => {
    const sw = ev.target.closest('.swatch'); if (!sw) return;
    $$('.swatch', $('#' + grp, el)).forEach(x => x.classList.remove('on')); sw.classList.add('on');
    if (grp === 'f-hair') hair = sw.dataset.k; else eyes = sw.dataset.k;
  });
  $('#b-new', el).onclick = () => {
    const seedRaw = $('#f-seed', el).value.trim();
    S = E.newGame({ name: $('#f-name', el).value.trim() || '루나', guardian: $('#f-guardian', el).value, hair, eyes, seed: seedRaw ? hashSeed(seedRaw) : undefined });
    slots = ['school', 'farm', 'rest'];
    renderMain();
    showModal(`<h3>별이 떨어진 밤</h3><p>세 개의 달이 겹친 밤, 들판에 빛이 떨어졌다. 빛 속에는 열 살쯤 된 아이가 잠들어 있었다.\n\n당신은 아이를 안고 집으로 돌아왔다. 이름은 <b>${esc(S.name)}</b>이라고 짓기로 했다.\n\n이제부터 8년. 매달 열흘 단위로 세 가지 활동을 정해 주세요. 아이는 자라고, 때로는 거부하고, 때로는 스스로 선택할 것입니다.</p>
      <div class="choices"><button class="primary" data-close>시작한다</button></div>`);
  };
  if (auto) $('#b-continue', el).onclick = () => { S = E.deserialize(auto); renderMain(); toast('자동저장을 불러왔습니다.'); };
  $('#b-load', el).onclick = () => openSaveMenu('load');
}
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
function hashSeed(str) { if (/^\d+$/.test(str)) return Number(str) % 2147483647; let x = 2166136261; for (const ch of str) { x ^= ch.charCodeAt(0); x = Math.imul(x, 16777619) >>> 0; } return x % 2147483647; }

// ──────────────────────────────────────────────────────────────────────
// 메인 화면
// ──────────────────────────────────────────────────────────────────────
function renderMain() {
  if (S.finished) return renderEnding();
  app.innerHTML = '';
  const stage = stageOf(S.age);
  const g = E.GUARDIANS[S.guardian];
  app.appendChild(h(`<header class="top">
    <h1>⭐ <span>별의 공주</span> <small style="color:var(--muted);font-weight:400;font-size:13px">v0.1 프로토타입</small></h1>
    <div class="topbar-right">
      <span class="chip">${S.age}세 · ${S.month}월 · ${SEASON_NAME[S.season]} · <b>${stage.name}</b></span>
      <span class="chip">💰 <b id="t-gold">${S.gold}</b>G <small>(월 연금 +${g.pension} / 식비 -30)</small></span>
      <button class="ghost" id="b-save">저장</button><button class="ghost" id="b-loadm">불러오기</button><button class="ghost" id="b-title">타이틀</button>
    </div></header>`));
  const main = h(`<div class="main">
    <div class="col-left">
      <div class="panel">
        <div class="portrait" id="portrait"></div>
        <div class="meter"><label><span>스트레스</span><span id="m-stress">${S.stress}</span></label><div class="bar stress"><i style="width:${S.stress}%"></i></div></div>
        <div class="meter"><label><span>신뢰 (아이 ↔ 보호자)</span><span>${S.trust}</span></label><div class="bar trust"><i style="width:${S.trust}%"></i></div></div>
        <div class="meter"><label><span>보호자 건강</span><span>${S.guardianHealth}</span></label><div class="bar ghealth"><i style="width:${S.guardianHealth}%"></i></div></div>
        <div class="hint" style="margin-top:8px">평판 ${S.reputation} · 악평 ${S.infamy}${S.flags.has_cat ? ' · 🐈 달무리' : ''}</div>
      </div>
      <div class="panel" style="margin-top:12px"><h2>관계</h2><div class="rels">${NPCS.map(n => `<span>${n.name}</span><span>${bar(S.relations[n.id], '#b48cff')}</span>`).join('')}</div></div>
    </div>
    <div class="col-mid">
      <div class="panel">
        <h2>${S.month}월 스케줄 — 열흘씩 세 번</h2>
        <div class="calendar" id="calendar"></div>
        <div class="actlist" id="actlist"></div>
        <div class="actions">
          <button class="primary" id="b-run">이달을 보낸다 ▶</button>
          <button id="b-same">지난달과 같게</button>
          <span class="hint" id="costhint"></span>
        </div>
      </div>
    </div>
    <div class="col-right">
      <div class="panel"><h2>능력치</h2><div class="stats" id="stats"></div>
        <div class="pers"><h2>성격 (직접 조작 불가)</h2>${PERSONALITY.map(p => `<div class="axis"><span>${p.neg}</span><div class="track"><div class="dot" style="left:${(S.personality[p.id] + 100) / 2}%"></div></div><span style="text-align:right">${p.pos}</span></div>`).join('')}</div>
      </div>
      <div class="panel" style="margin-top:12px"><h2>기록</h2><div class="log" id="log"></div></div>
    </div>
  </div>`);
  app.appendChild(main);
  renderPortrait(); renderStats(); renderCalendar(); renderActList(); renderLog();
  $('#b-run').onclick = onRunMonth;
  $('#b-same').onclick = () => { const last = S.history[S.history.length - 1]; if (last) { slots = [...last.slots]; renderCalendar(); } };
  $('#b-save').onclick = () => openSaveMenu('save');
  $('#b-loadm').onclick = () => openSaveMenu('load');
  $('#b-title').onclick = () => { if (confirm('타이틀로 돌아갈까요? (자동저장은 유지됩니다)')) renderTitle(); };
}
function bar(v, color) { return `<span class="bar" style="display:inline-block;width:100%;vertical-align:middle"><i style="width:${v}%;background:${color}"></i></span>`; }

async function renderPortrait() {
  const box = $('#portrait'); if (!box) return;
  await mountImage(box, 'char/' + portraitKey(S), portraitSVG(S));
  box.appendChild(h(`<div class="nameplate">${esc(S.name)} · ${S.age}세</div>`));
}
function renderStats(deltas = null) {
  const box = $('#stats'); if (!box) return;
  box.innerHTML = STATS.map(st => {
    const d = deltas ? deltas[st.id] : 0;
    return `<div class="stat" style="--c:${STAT_CATS[st.cat].color}"><div class="row"><span>${st.name}<span class="tag" style="padding:0 5px">${STAT_CATS[st.cat].name}</span></span><b>${S.stats[st.id]}${d ? `<span class="delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${d}</span>` : ''}</b></div><div class="bar"><i style="width:${S.stats[st.id] / 9.99}%"></i></div></div>`;
  }).join('');
}
function renderCalendar() {
  const cal = $('#calendar'); if (!cal) return;
  const ords = ['상순', '중순', '하순'];
  cal.innerHTML = slots.map((id, i) => { const a = ACTIVITY_MAP[id]; return `<div class="slot ${i === activeSlot ? 'active' : ''}" data-i="${i}"><div class="ord">${ords[i]}</div><div class="act">${a.name}</div><div class="meta">${fxText(a)}</div><span class="type ${a.type}">${{ edu: '교육', work: '일', free: '자유' }[a.type]}</span></div>`; }).join('');
  $$('.slot', cal).forEach(el => el.onclick = () => { activeSlot = Number(el.dataset.i); renderCalendar(); });
  const cost = slots.reduce((a, id) => a + ACTIVITY_MAP[id].gold, 0) + E.GUARDIANS[S.guardian].pension - 30;
  $('#costhint').textContent = `이달 예상 수지 ${cost >= 0 ? '+' : ''}${cost}G → 잔액 ${S.gold + cost}G`;
}
function fxText(a) {
  const parts = Object.entries(a.stat).filter(([, v]) => v).map(([k, v]) => `${STATS.find(s => s.id === k).name}${v > 0 ? '+' : ''}${v}`);
  if (a.stress) parts.push(`스트레스${a.stress > 0 ? '+' : ''}${a.stress}`);
  return parts.join(' · ') || (a.id === 'autonomy' ? '성격에 따라 아이가 선택' : '');
}
function renderActList() {
  const box = $('#actlist'); if (!box) return;
  const groups = [['edu', '교육'], ['work', '아르바이트'], ['free', '자유행동']];
  box.innerHTML = groups.map(([type, label]) => `<div style="grid-column:1/-1;font-size:12px;color:var(--muted);margin-top:4px">${label}</div>` +
    ACTIVITIES.filter(a => a.type === type).map(a => {
      const locked = a.minAge && S.age < a.minAge;
      const lv = E.masteryLevel(S.mastery[a.id]);
      return `<div class="actcard ${locked ? 'locked' : ''}" data-id="${a.id}" title="${esc(a.desc)}"><div class="n"><span>${a.name}</span>${S.mastery[a.id] ? `<span class="lv">Lv.${lv}</span>` : ''}</div><div class="fx">${fxText(a)}</div><div class="fx ${a.gold >= 0 ? 'gold' : 'cost'}">${a.gold >= 0 ? '+' : ''}${a.gold}G${locked ? ` · ${a.minAge}세부터` : ''}</div></div>`;
    }).join('')).join('');
  $$('.actcard', box).forEach(el => el.onclick = () => { if (el.classList.contains('locked')) return; slots[activeSlot] = el.dataset.id; activeSlot = (activeSlot + 1) % 3; renderCalendar(); });
}
function renderLog() {
  const box = $('#log'); if (!box) return;
  box.innerHTML = (S.uiLog || []).slice(-30).reverse().map(l => `<div>${esc(l)}</div>`).join('') || '<div>아직 기록이 없습니다.</div>';
}
function log(line) { (S.uiLog ??= []).push(`[${S.age}세 ${S.month}월] ${line}`); if (S.uiLog.length > 400) S.uiLog.shift(); }

// ──────────────────────────────────────────────────────────────────────
// 월 진행 플로우: 거부 → 실행 → 이벤트들 → 결산 → (생일) → 다음 달
// ──────────────────────────────────────────────────────────────────────
async function onRunMonth() {
  $('#b-run').disabled = true;
  let plan = [...slots];
  const proposals = E.checkRefusals(S, plan);
  for (const p of proposals) {
    const decision = await askRefusal(p);
    const r = E.resolveRefusal(S, p, decision);
    plan[p.slot] = r.finalActivity; log(r.text);
    await showModal(`<h3>${esc(S.name)}의 반응</h3><p>${esc(r.text)}</p><div class="choices"><button class="primary" data-close>계속</button></div>`);
  }
  const report = E.runMonth(S, plan);
  report.lines.forEach(l => log(l));
  // 이벤트 처리
  while (S.pendingEvents.length) {
    const ev = E.currentEvent(S);
    if (!ev.choices.length) { S.pendingEvents.shift(); continue; }
    const idx = await showEvent(ev);
    const out = E.chooseEvent(S, ev.id, idx);
    log(`${ev.title}: ${out.text}`);
    await showModal(`<h3>${esc(ev.title)}</h3>${out.success === true ? '<span class="tag" style="color:var(--ok)">판정 성공</span>' : out.success === false ? '<span class="tag" style="color:var(--danger)">판정 실패</span>' : ''}<div class="result">${esc(out.text)}</div><div class="fxline">${fxSummary(out.effects)}</div><div class="choices"><button class="primary" data-close>계속</button></div>`);
  }
  // 월말 결산
  await showSummary(report);
  const end = E.endMonth(S);
  if (end.birthday) { await showBirthday(end.report); }
  localStorage.setItem(AUTOSAVE, E.serialize(S));
  lastReport = report;
  renderMain();
}
function askRefusal(p) {
  const act = ACTIVITY_MAP[p.activityId], alt = ACTIVITY_MAP[p.alternative];
  return new Promise(res => showModal(`<h3>${esc(S.name)}이(가) 「${act.name}」을(를) 거부합니다</h3>
    <p>${esc(p.line)}</p><div class="fxline">이유: ${p.reason === 'tired' ? '스트레스가 높다' : '반항 성향'} · 대안: ${alt.name}</div>
    <div class="choices">
      <button data-v="accept"><b>받아들인다</b><small>아이 뜻대로 ${alt.name}. 신뢰 +4, 순응 +1</small></button>
      <button data-v="persuade"><b>설득한다</b><small>화술·신뢰 판정. 성공 시 원래대로 (신뢰 +2), 실패 시 아이 뜻대로 (신뢰 -2)</small></button>
      <button data-v="force"><b>강행한다</b><small>원래대로 하되 신뢰 -8, 스트레스 +12, 순응 -3</small></button>
    </div>`, (v) => res(v)));
}
function showEvent(ev) {
  return new Promise(async res => {
    const m = showModal(`<h3>${esc(ev.title)}</h3><div class="evimg" id="evimg"></div><p>${esc(ev.text)}</p>
      <div class="choices">${ev.choices.map(c => `<button data-v="${c.index}"><b>${esc(c.label)}</b>${c.hint ? `<small>${esc(c.hint)}</small>` : ''}</button>`).join('')}</div>`, (v) => res(Number(v)));
    const img = $('#evimg', m.el);
    const path = ev.image || (ev.npc ? 'npc/' + ev.npc : 'bg/room_' + S.season);
    if (await assetExists(path)) img.style.background = `url(${assetUrl(path)}) center/cover`; else img.innerHTML = `<div style="padding:14px;color:var(--muted);font-size:12px">🖼 ${path}.png (제미나이 프롬프트 팩 참조)</div>`;
  });
}
function fxSummary(effects) {
  if (!effects) return '';
  const name = (k) => { const [ns, id] = k.split('.'); if (ns === 'stat') return STATS.find(s => s.id === id).name; if (ns === 'pers') return PERSONALITY.find(p => p.id === id).name; if (ns === 'rel') return NPCS.find(n => n.id === id).name; if (ns === 'flag') return null; return { trust: '신뢰', gold: '금전', stress: '스트레스', infamy: '악평', reputation: '평판', gHealth: '보호자 건강' }[k]; };
  return Object.entries(effects).map(([k, v]) => { const n = name(k); return n && typeof v === 'number' ? `${n} ${v > 0 ? '+' : ''}${v}` : null; }).filter(Boolean).join(' · ');
}
function showSummary(report) {
  const d = Object.fromEntries(STATS.map(s => [s.id, report.after.stats[s.id] - report.before.stats[s.id]]));
  const rows = STATS.filter(s => d[s.id]).map(s => `<span class="k">${s.name}</span><span>${report.before.stats[s.id]} → <b>${report.after.stats[s.id]}</b> <span class="delta ${d[s.id] > 0 ? 'up' : 'down'}">(${d[s.id] > 0 ? '+' : ''}${d[s.id]})</span></span>`).join('');
  const goldD = report.after.gold - report.before.gold;
  const persD = PERSONALITY.filter(p => report.after.pers[p.id] !== report.before.pers[p.id]).map(p => `${p.name} ${report.after.pers[p.id] > report.before.pers[p.id] ? '→ ' + p.pos : '→ ' + p.neg}`).join(' · ');
  return showModal(`<h3>${S.age}세 ${S.month}월 결산</h3>
    <div class="hint">${report.executed.map(e => `${ACTIVITY_MAP[e.id].name}${e.autonomous ? '(자율)' : ''} Lv.${e.level}`).join(' · ')}</div>
    <div class="summary" style="margin-top:10px">${rows || '<span class="k">능력치 변화 없음</span><span></span>'}
      <span class="k">금전</span><span>${report.before.gold} → <b>${report.after.gold}</b> (${goldD >= 0 ? '+' : ''}${goldD})</span>
      <span class="k">스트레스</span><span>${report.before.stress} → <b>${report.after.stress}</b></span>
      <span class="k">신뢰</span><span>${report.before.trust} → <b>${report.after.trust}</b></span></div>
    ${persD ? `<div class="fxline">성격 변화: ${persD}</div>` : ''}
    ${report.lines.length ? `<div class="result">${report.lines.map(esc).join('<br>')}</div>` : ''}
    <div class="choices"><button class="primary" data-close>다음 달로</button></div>`);
}
function showBirthday(r) {
  return showModal(`<h3>🎂 ${esc(S.name)}, ${S.age}세가 되었다</h3>
    <p>${stageOf(S.age).name}에 들어섰다. ${stageNote(S.age)}</p>
    <div class="summary"><span class="k">작년에 가장 많이 한 일</span><span>${r.top.map(t => `${t.name} ${t.n}회`).join(', ') || '-'}</span>
      <span class="k">아이에게 맡긴 횟수</span><span>${r.autonomy}회</span>
      <span class="k">능력치 총합 증가</span><span>+${r.sumGain}</span>
      <span class="k">현재 신뢰 / 스트레스</span><span>${r.trust} / ${r.stress}</span></div>
    <div class="choices"><button class="primary" data-close>새해를 시작한다</button></div>`);
}
function stageNote(age) {
  return { 12: '학교에 친구와 라이벌이 생길 시기다. 외모가 조금 변했다.', 14: '사춘기. 거부가 늘어나고, 아이에게 맡기는 선택이 중요해진다.', 16: '진로 제안이 들어오기 시작한다. 연애 서브플롯이 열린다.', 17: '마지막 해. 열한 번째 달에 중요한 대화가 있다.' }[age] || '';
}

// ──────────────────────────────────────────────────────────────────────
// 엔딩 화면
// ──────────────────────────────────────────────────────────────────────
function renderEnding() {
  const e = S.ending;
  app.innerHTML = '';
  app.appendChild(h(`<div class="ending">
    <div class="title" style="min-height:auto;padding:30px 0 10px"><div class="sub">8년의 끝 · ${esc(S.name)}, 18세</div><h1>${esc(e.name)}</h1><div class="sub">${esc(e.cat)}${e.hidden ? ' · ✨ 히든 엔딩' : ''}${e.runnerUp ? ` · 다른 길이었다면: ${esc(e.runnerUp.name)}` : ''}</div></div>
    <div class="panel" style="display:grid;grid-template-columns:200px 1fr;gap:16px;align-items:start">
      <div class="portrait" id="portrait"></div>
      <div><h2>10년 후</h2><div class="epi">${esc(e.epilogue)}</div></div>
    </div>
    <div class="panel" style="margin-top:12px"><h2>마지막 대화 — 8년의 기록으로</h2><div class="words">${e.lastWords.map(w => `<div>${esc(w)}</div>`).join('')}</div></div>
    <div class="panel" style="margin-top:12px"><h2>엔딩 점수 상위 5</h2><div class="summary">${e.top.map(t => `<span class="k">${esc(t.name)}</span><span>${t.score}</span>`).join('')}</div>
      <div class="hint" style="margin-top:8px">최종 능력치: ${STATS.map(s => `${s.name} ${S.stats[s.id]}`).join(' · ')}<br>거부 ${S.counters.refusals} · 강행 ${S.counters.forced} · 자율 ${S.counters.autonomy} · 탈진 ${S.counters.collapses} · 이벤트 ${S.counters.events}</div></div>
    <div class="actions" style="justify-content:center;margin:20px 0"><button class="primary" id="b-again">새로운 아이와 다시</button><button id="b-export">플레이 기록 내보내기(JSON)</button></div>
  </div>`));
  renderPortrait();
  $('#b-again').onclick = () => renderTitle();
  $('#b-export').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([E.serialize(S)], { type: 'application/json' })); a.download = `starborn_${S.name}_${e.id}.json`; a.click(); };
  localStorage.removeItem(AUTOSAVE);
}

// ──────────────────────────────────────────────────────────────────────
// 세이브/로드
// ──────────────────────────────────────────────────────────────────────
function openSaveMenu(mode) {
  const rows = Array.from({ length: 10 }, (_, i) => {
    const raw = localStorage.getItem(SLOT(i + 1));
    let label = '— 비어 있음 —';
    if (raw) { try { const s = JSON.parse(raw); label = `${s.name} · ${s.age}세 ${s.month}월 · ${s.finished ? '완료' : '진행 중'} · ${new Date(s.savedAt || 0).toLocaleString('ko-KR')}`; } catch { label = '(손상된 데이터)'; } }
    return `<button data-v="${i + 1}" ${mode === 'load' && !raw ? 'disabled' : ''}><b>슬롯 ${i + 1}</b><small>${esc(label)}</small></button>`;
  }).join('');
  showModal(`<h3>${mode === 'save' ? '저장' : '불러오기'}</h3><div class="choices">${rows}</div><div class="choices"><button data-close>닫기</button></div>`, (v) => {
    const n = Number(v);
    if (mode === 'save') { S.savedAt = Date.now(); localStorage.setItem(SLOT(n), E.serialize(S)); toast(`슬롯 ${n}에 저장했습니다.`); }
    else { const raw = localStorage.getItem(SLOT(n)); if (raw) { S = E.deserialize(raw); slots = ['school', 'farm', 'rest']; renderMain(); toast(`슬롯 ${n}을 불러왔습니다.`); } }
  });
}

// ──────────────────────────────────────────────────────────────────────
// 모달·토스트
// ──────────────────────────────────────────────────────────────────────
function showModal(inner, onChoice) {
  const bg = h(`<div class="modal-bg"><div class="modal">${inner}</div></div>`);
  document.body.appendChild(bg);
  const p = new Promise(res => {
    bg.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b || b.disabled) return;
      if (b.hasAttribute('data-close')) { bg.remove(); res(null); return; }
      if (b.dataset.v !== undefined) { bg.remove(); onChoice?.(b.dataset.v); res(b.dataset.v); }
    });
  });
  p.el = bg;
  return p;
}
function toast(msg) { const t = h(`<div class="toast">${esc(msg)}</div>`); document.body.appendChild(t); setTimeout(() => t.remove(), 2500); }

renderTitle();
