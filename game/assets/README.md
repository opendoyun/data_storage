# 이미지 자산 (모든 그림은 Google Gemini로 생성)

게임은 `assets/<key>.png`가 **있으면 자동으로 사용**하고, 없으면 내장 SVG/CSS 플레이스홀더를 보여 줍니다.
파일을 넣고 새로고침만 하면 됩니다. 코드는 고치지 않습니다.
그림을 임시로 대신 그려 넣지 않습니다. 비어 있는 칸은 플레이스홀더가 맡습니다.

- 공주 외형 정본: [`docs/game-design/character-design.md`](../../docs/game-design/character-design.md) (은백색 긴 생머리·붉은 눈·흑백 의상 + 범주별 포인트 색·금색 4각 별, 10~18세 모두 나이에 맞는 단정한 모습)
- 생성 절차·비용·QA: [`docs/game-design/gemini-chrome-runbook.md`](../../docs/game-design/gemini-chrome-runbook.md)

## 규격

| 키 (= 파일 경로 `assets/<key>.png`) | 수량 | 용도 | 크기 (비율) |
|---|---:|---|---|
| `ref/luna_sheet` | 1 | 공주 캐릭터 시트(10·12·14·16·18세). 게임에는 안 나오고 **모든 공주 그림의 참조로 먼저** 만든다 | 1600×900 (16:9) |
| `char/{stage}_{cat}` | 20 | 공주 초상. stage = `child`(10~11) `girl`(12~13) `teen`(14~15) `youth`(16~17) `adult`(18) / cat = 우세 능력 범주 `body` `mind` `social` `inner` | 768×1040 (세로 3:4) |
| `npc/<id>` | 12 | NPC 초상(이벤트 창 상단, 인물은 왼쪽 1/3). `cube` `loren` `garrett` `elda` `leon` `theodora` `envoy` `archbishop` `guildmaster` `shadow` `troupe` `knight_cpt` | 1280×560 (16:7) |
| `bg/<id>` | 32 | 이벤트 배경(사계절 거실 4 + 장소 28). 목록: `js/data/images.js`의 `BG` | 1280×560 (16:7) |
| `ending/<엔딩 id>` | 48 | 엔딩 일러스트("10년 후", 공주 약 28세). `js/data/endings.js` 32종 + `endings_ext.js` 16종(히든 5 포함) | 1280×720 (16:9) |
| `ui/title_key` `ui/album_cover` | 2 | 타이틀 키 비주얼, 엔딩 앨범 표지 | 1600×900 (16:9) |

현재 합계 **116장** (2026-10-18). 엔딩이나 배경이 추가되면 `node tools/gemini/build-manifest.mjs`가 자동으로 목록에 넣습니다.
크기는 `js/data/images.js`의 `SIZES`를 그대로 따릅니다(캐릭터 시트만 1600×900). 매니페스트 검사가 크기·경로가 다르면 실패시킵니다.
정확한 크기가 아니어도 `node tools/gemini/fit.mjs`가 가운데 기준으로 잘라 맞춥니다. 게임 화면은 `object-fit: cover`로 보여 주므로 중요한 것은 화면 가운데에 둡니다.

## 이 폴더의 파일

| 파일 | 설명 |
|---|---|
| `manifest.json` | **그릴 목록의 원본** (자동 생성). 항목마다 `key` `path` `width` `height` `aspect` `apiAspect` `group` `title` `prompt`(공통 스타일 앵커 + 공주 캐릭터 바이블 + 나이·의상 포함) `negative`(금지 목록) `refs`(첨부할 참조 이미지 키) `refNotes` `order`. 직접 고치지 않습니다 |
| `gemini-prompts.md` | 사람·Claude in Chrome용 **번호 순 배치 목록** (자동 생성): 번호, 정확한 프롬프트, 저장 파일명, 크기, 첨부할 참조 |
| `generation-log.json` | API 경로 생성 기록 (key, model, time, bytes, status, error). 첫 API 실행 때 생깁니다 |
| `ref/` `char/` `npc/` `bg/` `ending/` `ui/` | 생성된 PNG |

## 만드는 법 (`game/` 폴더에서)

```bash
node tools/gemini/build-manifest.mjs     # 데이터 → manifest.json (새 엔딩·배경 반영)
node tools/gemini/chrome-batch.mjs       # manifest.json → gemini-prompts.md
node tools/gemini/fit.mjs --check        # 진행 현황: 있는 것, 빠진 것, 크기가 틀린 것, 다음 번호
```

**A. API 경로** (`GEMINI_API_KEY` 환경 변수가 필요합니다. 키는 클라우드 환경 설정의 비밀 값/환경 변수로만 넣고, **채팅에 붙여넣지 마세요**. 절차: 런북 A-2)
```bash
node tools/gemini/generate.mjs --dry-run   # 계획·비용 확인
node tools/gemini/generate.mjs             # 1단계: 캐릭터 시트만 만들고 멈춤 → 눈으로 확인
node tools/gemini/generate.mjs             # 2단계: 나머지 전부 (있는 파일은 건너뜀)
node tools/gemini/generate.mjs --keys=char/teen_mind --force   # 한 장 다시
```
키가 없으면 안내를 출력하고 exit 2로 끝납니다. 사용자가 준 공주 레퍼런스 그림 파일이 있으면 시트 단계에 `--sheet-ref=<파일>`을 붙입니다(머리·눈·색 체계 참고용으로만 첨부되고 화풍은 따라 하지 않습니다).

**B. Chrome 경로** (키 없이 gemini.google.com 웹에서): 내 컴퓨터의 Claude 세션(Claude Desktop 앱 또는 저장소 폴더에서 `claude remote-control`)과 Claude in Chrome 확장을 씁니다. `gemini-prompts.md`의 번호 순서대로 생성해 다운로드한 뒤 다음 명령으로 저장합니다.
```bash
node tools/gemini/fit.mjs --from=~/Downloads/<파일> --key=char/child_body
```
로컬 Claude에게 붙여넣을 지시문은 런북 B-2에 있습니다.

## 프롬프트 고치기
- 모든 그림에 공통인 문구(스타일 앵커, 공주 캐릭터 바이블, 나이별 체형, 범주별 의상, 엔딩 장면 연출, 금지 목록): `tools/gemini/style.mjs`
- 한 장만 고칠 때: `tools/gemini/prompt-overrides.json`에 `{"<key>": {"append": "추가 지시", "negativeAppend": "추가 금지"}}`
- 엔딩 장면: `style.mjs`의 `ENDING_SCENES`. 새 엔딩에 장면이 없으면 `build-manifest`가 경고하고 에필로그 + 범주 기본 배경으로 만듭니다. 에필로그가 함수(출신·이전 회차마다 달라짐)인 엔딩은 `summary`(영어 요약)를 적어 둡니다.
- 고친 뒤 `build-manifest.mjs` → `chrome-batch.mjs`를 다시 실행합니다. 특정 작가의 이름이나 화풍은 넣지 않습니다.

## 파이프라인 점검
`node tools/gemini/test-pipeline.mjs`: 오프라인 목업 API(`tools/gemini/mock-server.mjs`)로 `generate.mjs`의 실제 코드 경로를 끝까지 돌려 요청 형식(실제 API처럼 엄격히 검사), 재시도, 폴백, 참조 첨부, 응답 파싱(thought 이미지 건너뛰기), 차단·한도 0 처리, 키 유출 여부, 크기 맞춤, 건너뛰기, 배치 목록을 시험합니다. 출력은 임시 폴더에만 쓰고 끝나면 지우며, `assets/` 폴더 전체가 그대로인지 확인합니다.
