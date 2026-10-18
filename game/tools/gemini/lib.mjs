// 제미나이 파이프라인 공용 함수: 경로, 인자, 매니페스트, 프롬프트 합성, 이미지 후처리.
import { readFileSync, existsSync, statSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

export const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
export const GAME_DIR = resolve(TOOLS_DIR, '../..');
export const ASSETS_DIR = join(GAME_DIR, 'assets');
export const MANIFEST_PATH = join(ASSETS_DIR, 'manifest.json');
export const PROMPTS_MD_PATH = join(ASSETS_DIR, 'gemini-prompts.md');
export const POSTPROCESS_PY = join(TOOLS_DIR, 'postprocess.py');

// ── 인자 ────────────────────────────────────────────────────────────────────
// --key=value, --flag (true), --no-flag (false). 나머지는 _ 배열.
export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (const a of argv) {
    const m = /^--([^=]+)(?:=(.*))?$/s.exec(a);
    if (!m) { out._.push(a); continue; }
    const [, k, v] = m;
    if (v !== undefined) out[k] = v;
    else if (k.startsWith('no-')) out[k.slice(3)] = false;
    else out[k] = true;
  }
  return out;
}
export function userPath(p) {
  if (!p) return p;
  const s = String(p).replace(/^~(?=$|\/)/, homedir());
  return resolve(process.cwd(), s);
}
export const listArg = (v) => (v === undefined || v === true || v === false) ? [] : String(v).split(',').map(s => s.trim()).filter(Boolean);
export function intArg(v, def) { if (v === undefined || v === true) return def; const n = Number(v); return Number.isFinite(n) ? n : def; }

// ── 매니페스트 ──────────────────────────────────────────────────────────────
export function loadManifest(path = MANIFEST_PATH) {
  if (!existsSync(path)) throw new Error(`매니페스트가 없습니다: ${path}\n먼저 실행: node tools/gemini/build-manifest.mjs`);
  const m = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(m.entries)) throw new Error(`매니페스트 형식 오류(entries 배열 없음): ${path}`);
  return m;
}
export function normKey(k) { return String(k).trim().replace(/^assets\//, '').replace(/\.(png|jpe?g|webp)$/i, ''); }

// keys / only(접두사) 필터. 결과는 매니페스트 순서(= 참조 의존 순서)를 유지한다.
export function selectEntries(entries, { keys = [], only = [] } = {}) {
  const byKey = new Map(entries.map(e => [e.key, e]));
  const want = keys.map(normKey);
  const unknown = want.filter(k => !byKey.has(k));
  if (unknown.length) {
    const hint = unknown.map(k => { const near = entries.filter(e => e.key.includes(k.split('/').pop())).slice(0, 3).map(e => e.key); return `${k}${near.length ? ` (혹시: ${near.join(', ')})` : ''}`; });
    throw new Error(`매니페스트에 없는 키: ${hint.join('; ')}`);
  }
  let sel = entries;
  if (want.length) { const set = new Set(want); sel = sel.filter(e => set.has(e.key)); }
  if (only.length) sel = sel.filter(e => only.some(p => e.key.startsWith(p)));
  return sel;
}
export const targetPath = (dir, key) => join(dir, `${key}.png`);

// 실제 전송 텍스트 = prompt + (첨부 참조 설명) + 금지 목록.
// generate.mjs(API)와 chrome-batch.mjs(수동/브라우저)가 똑같은 문장을 쓰도록 여기 한 곳에서 만든다.
export function composeText(entry, attached = entry.refs || []) {
  const parts = [entry.prompt.trim()];
  if (attached.length) {
    parts.push('[REFERENCE IMAGES / 첨부 이미지]\n' + attached.map((k, i) => `- Attached image ${i + 1} = ${k}: ${entry.refNotes?.[k] || 'reference for consistency'}`).join('\n'));
  }
  if (entry.negative) parts.push(`[AVOID / 금지]\n${entry.negative}`);
  return parts.join('\n\n');
}

// ── 이미지 크기 읽기 (PNG / JPEG / WEBP 헤더) ───────────────────────────────
export function imageSize(file) {
  const b = readFileSync(file);
  return imageSizeFromBuffer(b) || pySize(file);
}
export function imageSizeFromBuffer(b) {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), format: 'PNG' };
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if ((marker >= 0xc0 && marker <= 0xcf) && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5), format: 'JPEG' };
      i += 2 + len;
    }
  }
  return null;
}
function pySize(file) {
  const r = spawnSync('python3', ['-I', POSTPROCESS_PY, 'size', file], { encoding: 'utf8' });
  try { const j = JSON.parse(r.stdout.trim().split('\n').pop()); return j.error ? null : j; } catch { return null; }
}
export function sniffMime(buf) {
  if (buf.length > 8 && buf.readUInt32BE(0) === 0x89504e47) return 'image/png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

// ── 후처리: 가운데 기준으로 목표 비율로 자르고 정확한 크기로 리사이즈 → PNG ──────────
// Pillow(postprocess.py) 우선, 없으면 ImageMagick. 실패하면 out 파일을 만들지 않는다.
let _backend = null;
export function imageBackend() {
  if (_backend) return _backend;
  const py = spawnSync('python3', ['-I', '-c', 'import PIL'], { encoding: 'utf8' });
  if (py.status === 0) return (_backend = 'pillow');
  const im = spawnSync('convert', ['-version'], { encoding: 'utf8' });
  if (im.status === 0) return (_backend = 'imagemagick');
  return (_backend = 'none');
}
export function fitImage(src, out, width, height) {
  mkdirSync(dirname(out), { recursive: true });
  const backend = imageBackend();
  if (backend === 'pillow') {
    const r = spawnSync('python3', ['-I', POSTPROCESS_PY, 'fit', src, out, String(width), String(height)], { encoding: 'utf8' });
    let j = null; try { j = JSON.parse((r.stdout || '').trim().split('\n').pop()); } catch { /* ignore */ }
    if (r.status !== 0 || !j || j.error) throw new Error(`후처리 실패(Pillow): ${j?.error || r.stderr || 'unknown'}`);
    return { ...j, backend };
  }
  if (backend === 'imagemagick') {
    const id = spawnSync('identify', ['-format', '%w %h', src + '[0]'], { encoding: 'utf8' });
    const [sw, sh] = (id.stdout || '').trim().split(/\s+/).map(Number);
    const tmp = join(dirname(out), '.' + basename(out) + '.partial.png');
    const r = spawnSync('convert', [src + '[0]', '-auto-orient', '-resize', `${width}x${height}^`, '-gravity', 'center', '-extent', `${width}x${height}`, '+repage', 'PNG:' + tmp], { encoding: 'utf8' });
    if (r.status !== 0 || !existsSync(tmp)) { rmSync(tmp, { force: true }); throw new Error(`후처리 실패(ImageMagick): ${r.stderr}`); }
    renameSync(tmp, out);
    return { srcWidth: sw, srcHeight: sh, width, height, bytes: statSync(out).size, backend };
  }
  throw new Error('후처리 도구가 없습니다. python3 + Pillow(pip install pillow) 또는 ImageMagick(convert)을 설치하세요.');
}
// 참조 첨부용 축소 JPEG (요청 크기·비용 절약). 실패하면 null → 원본을 그대로 첨부.
export function makeRefJpeg(src, out, maxSide = 1024) {
  if (imageBackend() !== 'pillow') return null;
  const r = spawnSync('python3', ['-I', POSTPROCESS_PY, 'ref', src, out, String(maxSide)], { encoding: 'utf8' });
  return r.status === 0 && existsSync(out) ? out : null;
}
export const isImageFile = (p) => /\.(png|jpe?g|webp)$/i.test(extname(p));
