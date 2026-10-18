#!/usr/bin/env node
// 이미지 규격 맞추기 / 진행 현황 — 수동(Chrome) 경로와 API 경로 공용.
//
//   node tools/gemini/fit.mjs --from=~/Downloads/Gemini_Generated_Image_x.png --key=char/child_body
//        → 다운로드한 그림을 가운데 기준으로 목표 비율로 자르고 정확한 크기로 줄여 assets/char/child_body.png 로 저장
//   node tools/gemini/fit.mjs            → assets 안의 모든 매니페스트 이미지 중 크기가 틀린 것을 제자리에서 맞춤
//                                         (<key>.jpg/.jpeg/.webp 로 저장된 것도 <key>.png 로 변환)
//   node tools/gemini/fit.mjs --check    → 바꾸지 않고 현황만 (빠진 것 / 크기 틀린 것). 틀린 크기가 있으면 exit 1
//   공통 옵션: --dir=<assets 폴더> (기본 game/assets) --manifest=<file> --only=<접두사> --missing (빠진 목록 전체 출력)
import { existsSync, rmSync } from 'node:fs';
import * as L from './lib.mjs';

function main() {
  const args = L.parseArgs();
  const dir = args.dir ? L.userPath(args.dir) : L.ASSETS_DIR;
  let manifest;
  try { manifest = L.loadManifest(args.manifest ? L.userPath(args.manifest) : L.MANIFEST_PATH); } catch (e) { console.error(e.message); return 1; }
  const byKey = new Map(manifest.entries.map(e => [e.key, e]));

  // 1) 단일 가져오기
  if (args.from || args.key) {
    if (!args.from || !args.key) { console.error('--from=<파일> 과 --key=<매니페스트 키> 를 함께 주세요.'); return 1; }
    const src = L.userPath(args.from), key = L.normKey(args.key), e = byKey.get(key);
    if (!e) { console.error(`매니페스트에 없는 키: ${key}`); return 1; }
    if (!existsSync(src)) { console.error(`파일이 없습니다: ${src}`); return 1; }
    const out = L.targetPath(dir, key);
    try {
      const r = L.fitImage(src, out, e.width, e.height);
      console.log(`✓ ${key}: ${r.srcWidth}×${r.srcHeight} → ${r.width}×${r.height} 저장 ${out}`);
      return 0;
    } catch (err) { console.error(`✗ ${key}: ${err.message}`); return 1; }
  }

  // 2) 전체 점검 / 제자리 맞춤
  const check = !!args.check;
  const only = L.listArg(args.only);
  const entries = manifest.entries.filter(e => !only.length || only.some(p => e.key.startsWith(p)));
  const missing = [], wrong = [], fixed = [], ok = [], failed = [];
  for (const e of entries) {
    const png = L.targetPath(dir, e.key);
    const alt = ['.jpg', '.jpeg', '.webp'].map(x => png.replace(/\.png$/, x)).find(existsSync);
    if (!existsSync(png) && !alt) { missing.push(e); continue; }
    const src = existsSync(png) ? png : alt;
    const size = L.imageSize(src);
    const right = src === png && size && size.width === e.width && size.height === e.height && size.format === 'PNG';
    if (right) { ok.push(e); continue; }
    const desc = `${e.key}: ${size ? `${size.width}×${size.height} ${size.format}` : '읽을 수 없음'} → ${e.width}×${e.height} PNG`;
    if (check) { wrong.push(desc); continue; }
    try {
      L.fitImage(src, png, e.width, e.height);
      if (src !== png) rmSync(src, { force: true });
      fixed.push(desc);
    } catch (err) { failed.push(`${desc} — ${err.message}`); }
  }
  const groups = {};
  for (const e of entries) { const g = (groups[e.group] ??= { total: 0, have: 0 }); g.total++; if (!missing.includes(e)) g.have++; }
  console.log(`자산 현황 (${dir})`);
  for (const [g, v] of Object.entries(groups)) console.log(`  ${g.padEnd(7)} ${String(v.have).padStart(3)}/${v.total}`);
  console.log(`  합계    ${entries.length - missing.length}/${entries.length} · 규격 맞음 ${ok.length}${fixed.length ? ` · 이번에 맞춤 ${fixed.length}` : ''}${wrong.length ? ` · 크기 틀림 ${wrong.length}` : ''}`);
  for (const f of fixed) console.log(`  맞춤: ${f}`);
  for (const w of wrong) console.log(`  틀림: ${w}`);
  for (const f of failed) console.log(`  실패: ${f}`);
  if (missing.length) {
    const show = args.missing ? missing : missing.slice(0, 12);
    console.log(`  다음에 그릴 것 (매니페스트 순서): ${show.map(e => `#${e.order} ${e.key}`).join(', ')}${show.length < missing.length ? ` … 외 ${missing.length - show.length}개 (--missing 으로 전체)` : ''}`);
  }
  return wrong.length || failed.length ? 1 : 0;
}

process.exit(main());
