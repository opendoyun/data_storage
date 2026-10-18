#!/usr/bin/env node
// 이미지 매니페스트 생성기: 게임 데이터 모듈(images.js, endings.js)을 직접 읽어
// assets/manifest.json 에 "그려야 할 모든 이미지"를 한 줄씩 적는다. 몇 번을 다시 돌려도 같은 결과(결정적).
//
//   node tools/gemini/build-manifest.mjs            # assets/manifest.json 갱신
//   node tools/gemini/build-manifest.mjs --check    # 디스크의 매니페스트가 최신인지만 검사 (다르면 exit 1)
//   node tools/gemini/build-manifest.mjs --out=/tmp/m.json | --stdout
//
// 새 엔딩(endings_ext.js)·새 배경/NPC(images.js)를 추가하면 다시 돌리기만 하면 된다.
// 프롬프트를 손보려면 tools/gemini/style.mjs(공통) 또는 tools/gemini/prompt-overrides.json(개별)을 고친다.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { BG, NPC, UI, STAGES, STAGE_AGE, CATS, CHAR_KEYS, SIZES, sizeOf } from '../../js/data/images.js';
import { ENDINGS } from '../../js/data/endings.js';
import { fillName } from '../../js/engine/josa.js';
import * as K from './style.mjs';
import { MANIFEST_PATH, TOOLS_DIR, parseArgs, userPath, isMain } from './lib.mjs';

export const REF_SHEET = 'ref/luna_sheet';
const REF_SIZE = [1600, 900];
const OVERRIDES_PATH = join(TOOLS_DIR, 'prompt-overrides.json');

// 목표 비율 표기 / 제미나이 API가 받는 비율(imageConfig.aspectRatio) 중 가장 가까운 것
const NAMED = { '16:7': 16 / 7, '21:9': 21 / 9, '16:9': 16 / 9, '3:2': 1.5, '4:3': 4 / 3, '1:1': 1, '3:4': 0.75, '2:3': 2 / 3, '9:16': 9 / 16 };
export const API_ASPECTS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
const ratioOf = (s) => { const [a, b] = s.split(':').map(Number); return a / b; };
const nearest = (r, list) => list.reduce((best, s) => Math.abs(Math.log(ratioOf(s) / r)) < Math.abs(Math.log(ratioOf(best) / r)) ? s : best, list[0]);
export const aspectLabel = (w, h) => nearest(w / h, Object.keys(NAMED));
export const apiAspectOf = (w, h) => nearest(w / h, API_ASPECTS);

const fmt = (w, h) => {
  const label = aspectLabel(w, h), api = apiAspectOf(w, h);
  const shape = w > h ? 'landscape (가로)' : w < h ? 'portrait (세로)' : 'square';
  return `[FORMAT] ${shape} ${label} — final file ${w}×${h} px${api !== label ? ` (generate at ${api}; it is center-cropped to ${label} afterwards, so keep important content away from the edges)` : ''}.`;
};
const join2 = (...xs) => xs.filter(Boolean).join('\n');
const neg = (...xs) => xs.filter(Boolean).join(', ');
const NAME = '루나', CALL = '보호자';

function entry(key, group, title, prompt, negative, refs = [], refNotes = {}, extra = {}) {
  const [width, height] = group === 'ref' ? REF_SIZE : sizeOf(key);
  return { key, path: `assets/${key}.png`, width, height, aspect: aspectLabel(width, height), apiAspect: apiAspectOf(width, height), group, title, ...extra, prompt, negative, refs, refNotes };
}

const SHEET_NOTE_TEEN = 'Luna\'s character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.';
const SHEET_NOTE_ADULT = 'Luna\'s character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.';

// ── 1. 캐릭터 시트 (가장 먼저 생성 → 이후 모든 루나 그림에 참조로 첨부) ───────────────
function refSheet() {
  const ages = STAGES.map(st => `  - age ${K.STAGE_INFO[st]?.age ?? STAGE_AGE[st]}: ${K.STAGE_INFO[st]?.en ?? `${STAGE_AGE[st]} years old`}`).join('\n');
  const prompt = join2(K.STYLE_ANCHOR, '', K.LUNA_BIBLE, '',
    `[THIS IMAGE — ${REF_SHEET} · 루나 캐릭터 시트 (일관성 기준, 가장 먼저 생성)]`,
    `Character reference sheet: the same girl Luna at ${STAGES.length} ages standing side by side in one row, left to right from youngest to oldest, each a little taller:`,
    ages,
    'Full body, front view, relaxed neutral standing pose with arms at the sides, gentle neutral expression, feet visible.',
    'All ages wear the same everyday outfit: white ribbed high-neck long-sleeved knit, ankle-length black skirt with no slit, black flat shoes, silver star hairpin. A few small gold four-point star sparkles around them.',
    'Plain flat light-grey background, even soft lighting. Draw the face, bangs, side locks and crimson eyes very clearly — this sheet is attached to every later image as the identity reference.',
    'No text, no name labels, no age numbers, no measurement lines.',
    fmt(...REF_SIZE));
  return entry(REF_SHEET, 'ref', '루나 캐릭터 시트 (10·12·14·16·18세)', prompt,
    neg(K.NEG_BASE, K.NEG_MODEST, K.NEG_TEEN_OLDER, 'the 10-, 12- and 14-year-olds drawn with teenage or adult proportions', K.NEG_LUNA, 'different outfits per age, different faces per age, height chart, model sheet annotations'));
}

// ── 2. 공주 초상 char/{stage}_{cat} (20장) ─────────────────────────────────
function charEntry(key) {
  const [st, cat] = key.slice('char/'.length).split('_');
  const info = K.STAGE_INFO[st] ?? { age: STAGE_AGE[st], ko: `${STAGE_AGE[st]}세`, en: `${STAGE_AGE[st]} years old` };
  const c = K.CAT_OUTFIT[cat];
  const props = st === 'adult' && cat === 'body' ? 'a real sword sheathed in its scabbard (진검), held at her side' : c.props;
  const sparkle = cat === 'mind' || st === 'adult' ? 'several gold four-point star sparkles around her' : 'a few small gold four-point star sparkles around her';
  const prompt = join2(K.STYLE_ANCHOR, '', K.LUNA_BIBLE, '',
    `[THIS IMAGE — ${key} · 루나 ${info.ko} 초상 · ${c.ko}(${cat}) 계열]`,
    `Luna as ${info.en}. (나이 ${info.age}세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)`,
    `Outfit (${c.ko}): ${c.outfit}. Accent colour: ${c.accent} only, on the black-and-white base.`,
    `Props & pose: ${props}; ${c.pose}. Detail: ${K.STAGE_CAT_NOTES[`${st}_${cat}`] ?? ''}`.trim(),
    `Magic motif: ${sparkle}.`,
    `Same person as the attached character sheet (identical face, hair and eyes), shown at age ${info.age}.`,
    'Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.',
    fmt(...sizeOf(key)));
  return entry(key, 'char', `루나 ${info.ko} · ${c.ko}`, prompt,
    neg(K.NEG_BASE, K.NEG_MODEST, K.negForAge(info.age), K.NEG_LUNA, K.NEG_DUPLICATE, K.NEG_VIOLENCE, 'busy background, scenery'),
    [REF_SHEET], { [REF_SHEET]: SHEET_NOTE_TEEN }, { stage: st, age: info.age, cat });
}

// ── 3. NPC 초상 npc/{id} (이벤트 배너 16:7) ─────────────────────────────────
const KID_NPCS = new Set(['leon', 'theodora']);
function npcEntry(key, desc) {
  const id = key.slice('npc/'.length);
  const prompt = join2(K.STYLE_ANCHOR, '',
    `[THIS IMAGE — ${key} · NPC 초상 (이벤트 배너)]`,
    desc,
    K.NPC_NOTES[id] ? `Notes: ${K.NPC_NOTES[id]}` : '',
    'Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.',
    fmt(...sizeOf(key)));
  return entry(key, 'npc', desc.split(':')[0].trim(), prompt,
    neg(K.NEG_BASE, K.NEG_MODEST, KID_NPCS.has(id) ? K.NEG_MINOR : '', K.NEG_VIOLENCE, 'silver-white haired girl with crimson eyes (the princess must not appear)'));
}

// ── 4. 배경 bg/* ────────────────────────────────────────────────────────────
function bgEntry(key, desc) {
  const room = /^bg\/room_/.test(key) && key !== 'bg/room_spring' && BG['bg/room_spring'];
  const noPeople = /인물 없음/.test(desc);
  const prompt = join2(K.STYLE_ANCHOR, '',
    `[THIS IMAGE — ${key} · 배경]`,
    desc,
    'Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.',
    noPeople ? 'No characters at all (인물 없음).' : 'Any people are small and in the distance, without detailed faces.',
    room ? 'This is the SAME living room as the attached image: keep the room layout, furniture, window and fireplace positions identical; change only the season, light and small seasonal props.' : '',
    fmt(...sizeOf(key)));
  return entry(key, 'bg', desc.split('.')[0].trim(), prompt,
    neg(K.NEG_BASE, K.NEG_BG, noPeople ? 'people, characters, animals in focus' : '', K.NEG_MODEST, K.NEG_VIOLENCE),
    room ? ['bg/room_spring'] : [], room ? { 'bg/room_spring': 'the same living room in spring — keep the layout and furniture identical' } : {});
}

// ── 5. 엔딩 일러스트 ending/{id} (10년 뒤, 루나 약 28세) ───────────────────────
function endingNpcs(e, epi) {
  const fixed = K.ENDING_SCENES[e.id]?.npcs;
  const ids = fixed ?? Object.entries(K.NPC_NAME_PATTERNS).filter(([, re]) => re.test(epi)).map(([id]) => id);
  return ids.filter(id => NPC[`npc/${id}`]);
}
// 에필로그 텍스트. 함수형 에필로그(출신·이전 회차에 따라 달라짐)는 소스 코드가 프롬프트에 새지 않도록
// style.mjs 의 summary 를 쓰고, 없으면 중립 상태로 한 번 불러 본 예시 문장을 쓴다.
const NEUTRAL_STATE = { name: '{name}', guardian: null, legacy: [], stats: {}, flags: {}, rel: {} };
export function endingEpilogue(e) {
  if (typeof e.epilogue === 'string') return { text: fillName(e.epilogue, NAME, CALL), varies: false };
  const summary = K.ENDING_SCENES[e.id]?.summary;
  if (summary) return { text: summary, varies: true, summary: true };
  if (typeof e.epilogue === 'function') {
    try { const t = e.epilogue(NEUTRAL_STATE); if (typeof t === 'string' && t.trim()) return { text: fillName(t, NAME, CALL), varies: true }; } catch { /* fall through */ }
  }
  return { text: '', varies: true };
}
export function endingEntry(e) {
  const key = `ending/${e.id}`;
  const ep = endingEpilogue(e);
  const epi = ep.text;
  const cs = K.ENDING_CAT_STYLE[e.cat] ?? { accent: 'gold', setting: 'the kingdom of Celestia' };
  const scene = K.ENDING_SCENES[e.id]?.scene
    ?? `Illustrate the single most memorable moment of the epilogue above for the ending «${e.name}», ten years after the story. Setting: ${cs.setting}`;
  const npcs = endingNpcs(e, epi);
  const npcLook = (id) => K.ENDING_SCENES[e.id]?.npcNotes?.[id] ?? K.NPC_IN_ENDING[id] ?? id;
  const epiLine = !epi ? ''
    : ep.summary ? `Epilogue summary (에필로그 요약 — 플레이마다 문장이 달라짐): ${epi}`
    : ep.varies ? `Epilogue (에필로그 예시 — 플레이마다 일부가 달라짐): «${epi}»`
    : `Epilogue (에필로그 원문 — 이 장면의 바탕): «${epi}»`;
  const tag = e.cat === '히든' || !e.hidden ? e.cat : `${e.cat}, 히든`;
  const prompt = join2(K.STYLE_ANCHOR, '', K.LUNA_BIBLE, '',
    `[THIS IMAGE — ${key} · 엔딩 일러스트 «${e.name}» (${tag})]`,
    epiLine,
    `Scene: ${scene}.`,
    K.LUNA_ADULT,
    `Costume accent for this ending: ${cs.accent}, on a black-and-white base.`,
    npcs.length ? `Also in the scene: ${npcs.map(npcLook).join('; ')} — match the attached reference portrait(s), aged as described.` : '',
    K.GUARDIAN_RULE,
    'Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.',
    fmt(...sizeOf(key)));
  const refs = [REF_SHEET, ...npcs.map(id => `npc/${id}`)];
  const refNotes = { [REF_SHEET]: SHEET_NOTE_ADULT };
  for (const id of npcs) {
    const who = (K.NPC_IN_ENDING[id] ?? id).split(',')[0];
    refNotes[`npc/${id}`] = K.ENDING_SCENES[e.id]?.npcNotes?.[id]
      ? `reference portrait of ${who} — keep its design cues, but draw it as described for this scene`
      : `reference portrait of ${who} — keep the character design; age as described`;
  }
  return entry(key, 'ending', `엔딩 «${e.name}»`, prompt,
    neg(K.NEG_BASE, K.NEG_MODEST, K.NEG_VIOLENCE, K.NEG_LUNA, 'Luna drawn as a child or young teenager (she is an adult here), the guardian\'s face, romantic contact between Luna and the guardian'),
    refs, refNotes, { ending: { id: e.id, name: e.name, cat: e.cat, hidden: !!e.hidden, ...(ep.varies ? { epilogueVaries: true } : {}) }, age: K.ENDING_AGE, npcs });
}

// ── 6. UI ───────────────────────────────────────────────────────────────────
function uiEntry(key, desc) {
  const hasLuna = /루나|공주/.test(desc);
  const prompt = join2(K.STYLE_ANCHOR, '', hasLuna ? K.LUNA_BIBLE + '\n' : '',
    `[THIS IMAGE — ${key} · UI 일러스트]`,
    desc,
    hasLuna ? '10-year-old Luna has child proportions; the overlapping 18-year-old Luna is a soft translucent silhouette with the same hair and eyes. ' + K.GUARDIAN_RULE : '',
    key === 'ui/title_key' ? 'Leave calm empty space in the upper third for the game logo, but do NOT draw any text or logo.' : '',
    fmt(...sizeOf(key)));
  return entry(key, 'ui', desc.split(':')[0].trim(), prompt,
    neg(K.NEG_BASE, K.NEG_MODEST, hasLuna ? K.NEG_MINOR : '', hasLuna ? K.NEG_LUNA : ''),
    hasLuna ? [REF_SHEET] : [], hasLuna ? { [REF_SHEET]: SHEET_NOTE_TEEN } : {});
}

// ── 조립 ────────────────────────────────────────────────────────────────────
function applyOverrides(entries, warn) {
  if (!existsSync(OVERRIDES_PATH)) return;
  const ov = JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
  const byKey = new Map(entries.map(e => [e.key, e]));
  for (const [k, o] of Object.entries(ov)) {
    if (k.startsWith('_')) continue;
    const e = byKey.get(k);
    if (!e) { warn(`prompt-overrides.json: 매니페스트에 없는 키 "${k}" (무시)`); continue; }
    if (o.prompt) e.prompt = o.prompt;
    if (o.append) e.prompt = `${e.prompt}\n[EXTRA DIRECTION / 추가 지시] ${o.append}`;
    if (o.negativeAppend) e.negative = `${e.negative}, ${o.negativeAppend}`;
    if (Array.isArray(o.refs)) e.refs = o.refs;
    e.overridden = true;
  }
}

export function buildManifest({ warn = (m) => console.warn('경고:', m) } = {}) {
  const entries = [refSheet()];
  for (const k of CHAR_KEYS) entries.push(charEntry(k));
  for (const [k, d] of Object.entries(NPC)) entries.push(npcEntry(k, d));
  for (const [k, d] of Object.entries(BG)) entries.push(bgEntry(k, d));
  for (const e of ENDINGS) {
    if (!K.ENDING_SCENES[e.id]) warn(`엔딩 "${e.id}"(${e.name})에 style.mjs ENDING_SCENES 연출이 없어 에필로그 + 범주 기본 배경으로 프롬프트를 만듭니다. 장면을 직접 적으면 더 좋습니다.`);
    entries.push(endingEntry(e));
  }
  for (const [k, d] of Object.entries(UI)) entries.push(uiEntry(k, d));
  applyOverrides(entries, warn);
  entries.forEach((e, i) => { e.order = i + 1; });
  const counts = { total: entries.length };
  for (const e of entries) counts[e.group] = (counts[e.group] ?? 0) + 1;
  return {
    name: 'starborn-princess-art',
    version: 1,
    note: '자동 생성 파일 — node tools/gemini/build-manifest.mjs. 직접 고치지 말 것(다시 만들면 덮어씀). 공통 문구는 tools/gemini/style.mjs, 개별 조정은 tools/gemini/prompt-overrides.json.',
    rules: 'docs/game-design/character-design.md (공주 외형·나이 원칙), docs/game-design/content-contract.md §3 (12세 이용가)',
    styleAnchor: K.STYLE_ANCHOR,
    counts,
    entries,
  };
}

// 매니페스트 자체 검사: 누락·중복·참조 순서
export function checkManifest(m) {
  const errors = [];
  const keys = m.entries.map(e => e.key);
  const seen = new Set();
  for (const k of keys) { if (seen.has(k)) errors.push(`중복 키: ${k}`); seen.add(k); }
  const required = [REF_SHEET, ...CHAR_KEYS, ...Object.keys(BG), ...Object.keys(NPC), ...Object.keys(UI), ...ENDINGS.map(e => `ending/${e.id}`)];
  for (const k of required) if (!seen.has(k)) errors.push(`누락: ${k}`);
  if (CHAR_KEYS.length !== STAGES.length * CATS.length) errors.push('CHAR_KEYS 수가 STAGES×CATS와 다름');
  const pos = new Map(keys.map((k, i) => [k, i]));
  for (const e of m.entries) {
    if (!e.width || !e.height) errors.push(`크기 없음: ${e.key}`);
    const want = e.group === 'ref' ? REF_SIZE : SIZES[e.group];
    if (want && (e.width !== want[0] || e.height !== want[1])) errors.push(`크기 불일치: ${e.key} ${e.width}×${e.height} ≠ images.js SIZES ${want[0]}×${want[1]}`);
    if (e.path !== `assets/${e.key}.png`) errors.push(`경로 불일치: ${e.key} → ${e.path}`);
    // 함수형 에필로그 등 JS 소스가 프롬프트로 새면 안 된다
    if (/=>|\bfunction\s*\w*\s*\(|\$\{/.test(e.prompt)) errors.push(`프롬프트에 코드 조각: ${e.key}`);
    if (/\{(name|call)[^}]*\}/.test(e.prompt)) errors.push(`프롬프트에 치환 안 된 토큰: ${e.key}`);
    if (!/revealing/.test(e.negative)) errors.push(`단정함 금지 목록 없음: ${e.key}`);
    if (!e.prompt?.includes('[STYLE ANCHOR')) errors.push(`스타일 앵커 없음: ${e.key}`);
    if ((e.group === 'char' || e.group === 'ending') && !e.prompt.includes('[CHARACTER — 루나')) errors.push(`캐릭터 바이블 없음: ${e.key}`);
    if (e.group === 'char' && !e.refs.includes(REF_SHEET)) errors.push(`캐릭터 시트 참조 없음: ${e.key}`);
    for (const r of e.refs) {
      if (!pos.has(r)) errors.push(`${e.key}: 없는 참조 ${r}`);
      else if (pos.get(r) >= pos.get(e.key)) errors.push(`${e.key}: 참조 ${r}가 뒤에 있음(순서 오류)`);
    }
  }
  return { errors, required: required.length };
}

const stable = (m) => JSON.stringify(m, null, 2) + '\n';

function main() {
  const args = parseArgs();
  const m = buildManifest();
  const { errors } = checkManifest(m);
  if (errors.length) { console.error('매니페스트 검사 실패:\n- ' + errors.join('\n- ')); return 1; }
  const text = stable(m);
  const summary = Object.entries(m.counts).map(([k, v]) => `${k} ${v}`).join(' · ');
  // 파이프로 보낼 때 process.exit() 를 바로 부르면 출력이 잘리므로 exitCode 만 정한다.
  if (args.stdout) { process.stdout.write(text); return 0; }
  const out = args.out ? userPath(args.out) : MANIFEST_PATH;
  if (args.check) {
    const cur = existsSync(out) ? readFileSync(out, 'utf8') : '';
    if (cur !== text) { console.error(`매니페스트가 최신이 아닙니다: ${out}\n다시 생성: node tools/gemini/build-manifest.mjs`); return 1; }
    console.log(`매니페스트 최신 (${summary})`);
    return 0;
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, text);
  console.log(`매니페스트 작성: ${out}\n  ${summary}\n  엔딩 ${m.entries.filter(e => e.group === 'ending').length}종 (NPC 참조 포함 ${m.entries.filter(e => e.group === 'ending' && e.refs.length > 1).length}종) · 검사 통과`);
  return 0;
}

if (isMain(import.meta.url)) process.exitCode = main();
