#!/usr/bin/env node
// js/data/events/*.js 를 스캔해 index.js 를 생성한다. (브라우저는 디렉터리 glob 불가 → 정적 import 목록 필요)
// 새 이벤트 파일을 추가하면: node tools/gen-event-index.mjs
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const dir = join(dirname(fileURLToPath(import.meta.url)), '../js/data/events');
const files = readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'index.js').sort((a, b) => (a === 'core.js' ? -1 : b === 'core.js' ? 1 : a.localeCompare(b)));
const ident = (f) => 'ev_' + f.replace(/\.js$/, '').replace(/[^a-zA-Z0-9_]/g, '_');
const src = `// 자동 생성 파일 — 직접 수정하지 말고 \`node tools/gen-event-index.mjs\` 를 실행하세요.
${files.map(f => `import ${ident(f)} from './${f}';`).join('\n')}

export const EVENT_SOURCES = { ${files.map(f => `'${f}': ${ident(f)}`).join(', ')} };
export default [${files.map(ident).map(i => `...${i}`).join(', ')}];
`;
writeFileSync(join(dir, 'index.js'), src);
console.log(`index.js: ${files.length} files → ${files.join(', ')}`);
