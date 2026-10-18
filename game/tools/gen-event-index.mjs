#!/usr/bin/env node
// js/data/events/*.js 를 스캔해 index.js 를 생성한다. (브라우저는 디렉터리 glob 불가 → 정적 import 목록 필요)
// 각 파일을 실제로 import 해 보고, 실패한 파일은 index에서 제외하고 오류를 출력한다(다른 작성자의 검증이 깨지지 않도록).
// 새 이벤트 파일을 추가하면: node tools/gen-event-index.mjs
import { readdirSync, writeFileSync, renameSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
const dir = join(dirname(fileURLToPath(import.meta.url)), '../js/data/events');
const all = readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'index.js').sort((a, b) => (a === 'core.js' ? -1 : b === 'core.js' ? 1 : a.localeCompare(b)));
const ok = [], bad = [];
for (const f of all) {
  try {
    const m = await import(pathToFileURL(join(dir, f)).href + '?v=' + process.hrtime.bigint());
    if (!Array.isArray(m.default)) throw new Error('default export가 배열이 아님');
    ok.push([f, m.default.length]);
  } catch (e) { bad.push([f, e.message.split('\n')[0]]); }
}
const ident = (f) => 'ev_' + f.replace(/\.js$/, '').replace(/[^a-zA-Z0-9_]/g, '_');
const files = ok.map(([f]) => f);
const src = `// 자동 생성 파일 — 직접 수정하지 말고 \`node tools/gen-event-index.mjs\` 를 실행하세요.
${files.map(f => `import ${ident(f)} from './${f}';`).join('\n')}

export const EVENT_SOURCES = { ${files.map(f => `'${f}': ${ident(f)}`).join(', ')} };
export default [${files.map(ident).map(i => `...${i}`).join(', ')}];
`;
const tmp = join(dir, `.index.${process.pid}.tmp`);
writeFileSync(tmp, src); renameSync(tmp, join(dir, 'index.js'));
console.log(`index.js: ${ok.length}개 파일, 이벤트 ${ok.reduce((a, [, n]) => a + n, 0)}개 — ${ok.map(([f, n]) => `${f}(${n})`).join(', ')}`);
for (const [f, m] of bad) console.log(`  ✗ 제외됨 ${f}: ${m}`);
process.exitCode = bad.length ? 1 : 0;
