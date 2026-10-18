#!/usr/bin/env node
// 수동 / Claude in Chrome 용 배치 목록 생성기: assets/manifest.json → assets/gemini-prompts.md
// 이미지마다 번호, 정확한 프롬프트, 저장 파일명, 크기, 첨부할 참조 이미지를 적는다.
//
//   node tools/gemini/chrome-batch.mjs                    # assets/gemini-prompts.md 재생성
//   node tools/gemini/chrome-batch.mjs --print=char/child_body   # 한 장의 전송 텍스트만 출력 (복사용)
//   옵션: --manifest=<file> --out=<md 경로> --only=<접두사> --keys=a,b
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import * as L from './lib.mjs';

const GROUP_KO = { ref: '캐릭터 시트', char: '공주 초상', npc: 'NPC 초상', bg: '배경', ending: '엔딩 일러스트', ui: 'UI' };
const fence = (s) => '```text\n' + s + '\n```';
const save = (e) => `game/${e.path}`;
const attachList = (e) => (e.refs ?? []).map(r => `\`game/assets/${r}.png\``).join(', ');

export function renderBatch(manifest, entries) {
  const total = manifest.entries.length;
  const counts = Object.entries(manifest.counts ?? {}).filter(([k]) => k !== 'total').map(([k, v]) => `${GROUP_KO[k] ?? k} ${v}`).join(' · ');
  const L1 = [];
  L1.push('# 제미나이 이미지 배치 목록 — 「별의 공주」', '');
  L1.push('> **자동 생성 파일** — `node tools/gemini/chrome-batch.mjs` (원본 `assets/manifest.json` ← `tools/gemini/build-manifest.mjs`). 직접 고치지 마세요.');
  L1.push('> 공주 외형 기준: `docs/game-design/character-design.md` · 전체 절차와 QA: `docs/game-design/gemini-chrome-runbook.md`', '');
  L1.push(`전체 ${total}장 (${counts})${entries.length !== total ? ` · 이 파일에는 ${entries.length}장` : ''}. API 키가 있으면 이 목록 대신 \`node tools/gemini/generate.mjs\` 한 줄로 같은 프롬프트가 자동 실행됩니다.`, '');
  L1.push('## 사용법 (사람 · Claude in Chrome 공통)', '');
  L1.push('1. Chrome에서 **gemini.google.com** → 새 채팅. 이미지 생성이 되는 모델(이미지 만들기 도구)을 고른다.');
  L1.push('2. **§0 스타일 앵커**를 첫 메시지로 보낸다.');
  L1.push('3. **#1 캐릭터 시트**를 만든다. 공주 외형 기준(은백색 긴 생머리·붉은 눈·흑백 의상·금색 4각 별)과 맞을 때까지 다듬는다. 이후 모든 공주 그림의 기준이므로 사람이 한 번 확인한다.');
  L1.push('4. #2부터 **번호 순서대로**: ① 「첨부」의 파일을 업로드 → ② 「프롬프트」 블록 전체를 붙여넣기 → ③ 생성 → ④ 다운로드 → ⑤ 저장 명령 실행:');
  L1.push('   `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=<키>` (가운데 기준으로 비율을 맞춰 자르고 정확한 크기로 `game/assets/<키>.png`에 저장)');
  L1.push('5. 마음에 안 들면 같은 채팅에서 **차이만** 말해 재생성 ("같은 구도로, 머리를 더 길게"). 2번 해도 안 되면 건너뛰고 기록.');
  L1.push('6. 15장쯤마다 새 채팅 → §0 앵커 다시 보내기 → 캐릭터 시트를 첨부해 이어서 진행 (스타일 표류 방지).');
  L1.push('7. 진행 확인: `node tools/gemini/fit.mjs --check` (빠진 것·크기 틀린 것·다음에 그릴 번호).', '');
  L1.push('## §0 스타일 앵커 (새 채팅 첫 메시지)', '');
  L1.push(fence(`${manifest.styleAnchor}\n\n이 대화에서 내가 보내는 이미지 요청은 모두 위 스타일을 따라줘. 이번 메시지에는 그림을 그리지 말고 "준비됨"이라고만 답해줘.`), '');
  L1.push('## 진행 표', '');
  L1.push('| # | 키 | 저장 경로 | 크기 (비율) | 첨부 |', '|---:|---|---|---|---|');
  for (const e of entries) L1.push(`| ${e.order} | \`${e.key}\` | \`${save(e)}\` | ${e.width}×${e.height} (${e.aspect}) | ${(e.refs ?? []).map(r => `\`${r}\``).join(', ') || '—'} |`);
  L1.push('');
  let group = null;
  for (const e of entries) {
    if (e.group !== group) { group = e.group; L1.push('---', '', `## ${GROUP_KO[group] ?? group}`, ''); }
    L1.push(`### #${e.order} · \`${e.key}\` — ${e.title}`, '');
    L1.push(`- **저장**: \`${save(e)}\` · ${e.width}×${e.height} px · 목표 비율 ${e.aspect}${e.apiAspect !== e.aspect ? ` (제미나이에서 비율을 고를 수 있으면 ${e.apiAspect})` : ''}`);
    if (e.refs?.length) L1.push(`- **첨부** (먼저 업로드, 이 순서로): ${attachList(e)}`);
    else if (e.group === 'ref') L1.push('- **첨부**: 없음. 사용자가 준 공주 레퍼런스 그림이 있으면 함께 첨부하되, 머리색·눈색·색 체계 참고용으로만 쓰라고 덧붙인다 (화풍·구도 복제 금지).');
    else L1.push('- **첨부**: 없음');
    L1.push(`- **저장 명령**: \`node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=${e.key}\``, '');
    L1.push(fence(L.composeText(e)), '');
  }
  return L1.join('\n');
}

function main() {
  const args = L.parseArgs();
  let manifest, entries;
  try {
    manifest = L.loadManifest(args.manifest ? L.userPath(args.manifest) : L.MANIFEST_PATH);
    const printKey = typeof args.print === 'string' ? args.print : null;
    entries = L.selectEntries(manifest.entries, { keys: printKey ? [printKey] : L.listArg(args.keys), only: L.listArg(args.only) });
    if (printKey) { process.stdout.write(L.composeText(entries[0]) + '\n'); return 0; }
  } catch (e) { console.error(e.message); return 1; }
  const out = args.out ? L.userPath(args.out) : L.PROMPTS_MD_PATH;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderBatch(manifest, entries) + '\n');
  console.log(`배치 목록 작성: ${out} (${entries.length}장)`);
  return 0;
}

if (L.isMain(import.meta.url)) process.exit(main());
