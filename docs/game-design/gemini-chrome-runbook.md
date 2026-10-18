# 제미나이 아트 런북 — API 경로 · Chrome 경로 · QA

「별의 공주」의 모든 그림(공주 초상, 배경, NPC, 엔딩 일러스트, UI)은 **Google Gemini**로 그린다.
그림을 대신 만들어 넣거나 임시 그림으로 채우지 않는다. 파일이 없으면 게임은 내장 SVG/CSS 플레이스홀더를 보여 준다.

- **외형 정본**: [`character-design.md`](character-design.md) — 은백색 긴 생머리, 붉은 눈, 깨끗한 선의 애니메이션 셀 채색, 흑백 의상 + 범주별 포인트 색 한 가지, 금색 4각 별 반짝임. 10~18세 모든 단계에서 나이에 맞는 체형과 단정한 옷. 특정 작가의 화풍을 지명하거나 흉내 내지 않는다.
- **안전 규칙**: [`content-contract.md`](content-contract.md) §3 (12세 이용가).
- **그릴 목록·프롬프트의 원본**: `game/assets/manifest.json` (자동 생성). API 경로와 Chrome 경로가 **같은 프롬프트**를 쓴다.

## 0. 한눈에

| 순서 | 그룹 | 장수 | 파일 | 크기 (비율) | 참조로 첨부 |
|---:|---|---:|---|---|---|
| 1 | 캐릭터 시트 | 1 | `ref/luna_sheet.png` | 1600×900 (16:9) | 없음 (사용자 레퍼런스 그림이 있으면 색·인상 참고용으로만) |
| 2 | 공주 초상 | 20 | `char/{child,girl,teen,youth,adult}_{body,mind,social,inner}.png` | 768×1040 (3:4) | 캐릭터 시트 |
| 3 | NPC 초상 | 12 | `npc/<id>.png` | 1280×560 (16:7) | 없음 |
| 4 | 배경 | 32 | `bg/<id>.png` | 1280×560 (16:7) | 거실 여름·가을·겨울은 `bg/room_spring` |
| 5 | 엔딩 일러스트 | 32+ | `ending/<엔딩 id>.png` | 1280×720 (16:9) | 캐릭터 시트 + 등장 NPC 초상 |
| 6 | UI | 2 | `ui/title_key.png` `ui/album_cover.png` | 1600×900 (16:9) | 타이틀은 캐릭터 시트 |

합계 **99장** (2026-10-18 기준). `endings_ext.js`에 엔딩이 추가되면 장수도 늘어난다. 정확한 수는 `node tools/gemini/build-manifest.mjs`가 출력한다.
엔딩 화면 제목이 "10년 후"이므로 엔딩 일러스트의 공주는 **약 28세 성인**으로 그린다. 성인이어도 단정한 옷차림은 그대로다. 보호자("당신")는 출신과 성별이 플레이마다 다르므로 **뒷모습·실루엣·손으로만** 보이게 한다.

도구 (모두 `game/` 폴더에서 실행, Node 22, 의존성 없음; 이미지 후처리는 Python3 + Pillow 또는 ImageMagick):

| 명령 | 하는 일 |
|---|---|
| `node tools/gemini/build-manifest.mjs` | 게임 데이터(`images.js`, `endings.js`)를 읽어 `assets/manifest.json` 갱신. `--check`는 최신 여부만 검사 |
| `node tools/gemini/generate.mjs` | 제미나이 API로 생성 → `assets/<key>.png`. `--dry-run`은 계획과 비용만 출력 |
| `node tools/gemini/chrome-batch.mjs` | 수동/브라우저용 번호 목록 `assets/gemini-prompts.md` 재생성. `--print=<key>`는 한 장의 프롬프트만 출력 |
| `node tools/gemini/fit.mjs` | 다운로드한 그림을 규격에 맞춰 저장(`--from --key`), 전체 규격 맞춤, 진행 현황(`--check`) |
| `node tools/gemini/test-pipeline.mjs` | 오프라인 목업 API로 파이프라인 전체 시험 (임시 폴더만 사용) |
| `tools/gemini/style.mjs` | 공통 스타일 앵커, 공주 캐릭터 바이블, 나이·의상표, 엔딩 장면 연출, 금지 목록 |
| `tools/gemini/prompt-overrides.json` | 개별 이미지 추가 지시 (`append`, `negativeAppend`). 고친 뒤 build-manifest를 다시 실행 |

---

## A. API 경로 (권장: 자동·재현 가능)

### A-1. 키 발급
1. [Google AI Studio](https://aistudio.google.com) → **Get API key** → 키 만들기.
2. 이미지 생성 모델은 무료 등급에서 막혀 있거나 한도가 매우 낮을 수 있다. 429 `RESOURCE_EXHAUSTED`가 계속되면 해당 프로젝트에 결제를 연결한다.

### A-2. 키 넣기 (채팅에 붙여넣지 말 것)
키, 토큰, 비밀번호는 **절대 채팅에 붙여넣지 않는다.** 환경 변수로만 넣는다.

- **Claude Code 클라우드 세션**: 세션 제목 표시줄의 **클라우드 환경 메뉴 → Edit**.
  **Network secrets**(업데이트 전 앱에서는 **API credentials**) 섹션이 있으면 거기에, 없으면 **환경 변수**로 `GEMINI_API_KEY=<키>`를 추가한다. 다음에 시작하는 **새 세션**부터 적용된다.
  - 네트워크: 2026-10-18 이 클라우드 환경에서 `generativelanguage.googleapis.com`에 접속되는 것을 확인했다(키 없이 호출하면 Google이 403 "API Key 필요"로 응답). 나중에 정책 때문에 막히면 같은 Edit 화면의 **Network access**에서 더 넓은 수준을 고르거나, **Allowed domains**에 `generativelanguage.googleapis.com`을 추가한다(Allow package managers 체크는 유지). 안내: https://code.claude.com/docs/en/cloud-environments#network-access
  - 프록시 환경에서는 `generate.mjs`가 `NODE_USE_ENV_PROXY=1`로 자동 재실행해 `HTTPS_PROXY`를 사용한다.
- **내 컴퓨터**: `export GEMINI_API_KEY=<키>` (PowerShell: `$env:GEMINI_API_KEY="<키>"`). 셸 기록에 남기 싫으면 `.env` 같은 비공개 파일에서 읽어 오고, 그 파일은 커밋하지 않는다.
- 선택 환경 변수: `GEMINI_IMAGE_MODEL` (모델 고정), `GEMINI_API_BASE` (기본 `https://generativelanguage.googleapis.com`), `GEMINI_RPM` (분당 요청 수, 기본 10).

### A-3. 실행
```bash
cd game
node tools/gemini/build-manifest.mjs           # 최신 데이터 반영 (새 엔딩·배경 포함)
node tools/gemini/generate.mjs --dry-run       # 계획·참조·비용 확인 (API 호출 없음)
node tools/gemini/generate.mjs --list-models   # (선택) 쓸 수 있는 이미지 모델 확인

node tools/gemini/generate.mjs                 # 1단계: 캐릭터 시트만 만들고 멈춤
#   → assets/ref/luna_sheet.png 를 열어 C절 QA로 확인. 다시 뽑기:
#     node tools/gemini/generate.mjs --keys=ref/luna_sheet --force
#     (사용자 레퍼런스 그림 파일이 있으면 --sheet-ref=<파일> 추가: 머리·눈·색 참고용으로만 첨부됨)
node tools/gemini/generate.mjs                 # 2단계: 나머지 전부 (이미 있는 파일은 건너뜀)

node tools/gemini/fit.mjs --check              # 규격·누락 확인 (exit 0 이면 크기 모두 정상)
python3 -m http.server 8080                    # 게임에서 눈으로 확인 (새로고침만 하면 자동 적용)
```
- 그룹별로 나눠 실행: `--only=char/`, `--only=npc/,bg/`, `--only=ending/`.
- 한 장 다시 뽑기: `--keys=char/teen_mind --force`. 계속 같은 문제가 나오면 `tools/gemini/prompt-overrides.json`에 `{"char/teen_mind": {"append": "책을 두 손으로 안고"}}`처럼 추가 지시를 적고 `build-manifest` → `generate --keys=... --force`.
- 생성 순서는 매니페스트 순서를 따른다(참조 이미지가 먼저). 참조가 아직 없는 항목은 **보류**(blocked)되고 로그에 남는다. `--allow-missing-refs`를 주면 참조 없이 그린다(일관성은 떨어짐).
- 실패한 항목은 **파일을 만들지 않는다.** 모든 시도는 `assets/generation-log.json`에 key·model·time·bytes·status·error로 기록된다.
- 모델 자동 선택: ListModels에서 이름에 `image`가 있고 `generateContent`를 지원하는 모델 중 버전이 높은 것, 같은 버전이면 pro 우선. 비용을 줄이려면 `GEMINI_IMAGE_MODEL=gemini-2.5-flash-image`처럼 고정한다.
- 요청: `responseModalities: ['IMAGE']` + `imageConfig.aspectRatio`(16:7은 21:9로 요청 후 잘라냄). 모델이 거부하면 `['TEXT','IMAGE']`, 비율 없이 순서로 자동으로 바꿔 다시 요청한다. 429·5xx는 지수 백오프로 재시도한다(`Retry-After`·`RetryInfo` 존중).
- 후처리: 받은 PNG/JPEG를 **가운데 기준으로 목표 비율에 맞게 자르고** 정확한 크기로 줄여 PNG로 저장한다(Pillow, 없으면 ImageMagick). 원본도 보관하려면 `--keep-raw=<폴더>`(저장소 밖 경로 권장).

### A-4. 비용·시간 (참고치)
장당 단가는 작성 시점의 공개 요금 기준 참고치다(1K~2K 출력 1장: flash-image 약 $0.039, pro-image 약 $0.134). 첨부하는 참조 이미지 입력 비용은 장당 $0.001 안팎이다. **실제 요금은 [ai.google.dev 가격표](https://ai.google.dev/gemini-api/docs/pricing)에서 확인한다.**

| 범위 | 장수 | flash-image | pro-image | 시간 (분당 10, 동시 2) |
|---|---:|---:|---:|---|
| 캐릭터 시트 | 1 | $0.04 | $0.13 | 1분 미만 |
| 공주 초상 | 20 | $0.78 | $2.68 | 약 4~5분 |
| NPC 초상 | 12 | $0.47 | $1.61 | 약 2~3분 |
| 배경 | 32 | $1.25 | $4.29 | 약 6~7분 |
| 엔딩 일러스트 | 32 | $1.25 | $4.29 | 약 6~7분 |
| UI | 2 | $0.08 | $0.27 | 1분 미만 |
| **합계** | **99** | **약 $3.9** | **약 $13.3** | **약 20분** |
| 재생성 여유 포함 (×1.5) | 약 150 | 약 $6 | 약 $20 | 약 30분 |

- 공식: 장수 × 장당 단가. 엔딩이 추가되면 장당 $0.04~$0.13씩 늘어난다. `generate.mjs --dry-run`이 현재 선택 범위의 추정치를 출력한다.
- 시간은 `--rpm`(분당 상한)과 모델 응답 시간(장당 10~40초)으로 정해진다. 한도가 넉넉하면 `--rpm=20 --concurrency=3`으로 줄일 수 있고, 429가 잦으면 `--rpm=5`로 낮춘다.

### A-5. 오류 대처
| 증상 | 원인 / 조치 |
|---|---|
| exit 2 "GEMINI_API_KEY 환경변수가 없습니다" | A-2대로 키를 환경 변수로 넣고 새 세션에서 다시 실행 |
| exit 3, HTTP 400 "API key not valid" / 403 | 키가 틀렸거나 Generative Language API를 쓸 수 없는 프로젝트. AI Studio에서 키 확인 |
| HTTP 404 model not found | `GEMINI_IMAGE_MODEL` 오타 또는 지역 미지원. `--list-models`로 확인 |
| 429가 계속됨 | 무료 등급 한도 또는 분당 한도. `--rpm` 낮추기, 결제 연결, 다음 날 재실행 (이미 만든 파일은 건너뜀) |
| `✗ … 이미지 없음 (finishReason=IMAGE_SAFETY …)` | 안전 필터. 표현을 더 단정하게 바꾸는 추가 지시를 `prompt-overrides.json`에 넣고 재생성 |
| `⏸ … 보류 — 참조 이미지 없음` | 참조(시트나 NPC, 봄 거실)를 먼저 만든다. 같은 명령을 다시 실행하면 이어서 진행 |
| `HTTP network …` | 네트워크 정책(A-2 네트워크 항목) 또는 프록시 확인 |

---

## B. Chrome 경로 (API 키 없이, 내 컴퓨터의 Claude + Claude in Chrome)

클라우드 세션은 사용자의 브라우저에 닿을 수 없으므로 이 경로는 **사용자의 컴퓨터에서 도는 Claude 세션**이 필요하다. 그 세션이 Claude in Chrome 확장으로 사용자의 Chrome에서 gemini.google.com을 직접 조작한다.

### B-1. 준비 (사람이 한 번)
1. Chrome에 **Claude in Chrome** 확장을 설치하고 로그인한다. Chrome에서 **gemini.google.com**에 본인 Google 계정으로 로그인해 둔다.
2. 저장소를 내 컴퓨터에 받아 최신 상태로 둔다. Node 22, Python3 + Pillow(`pip install pillow`) 또는 ImageMagick을 준비한다.
3. 내 컴퓨터에서 Claude 세션을 연다. 다음 둘 중 하나를 쓴다.
   - **Claude Desktop 앱**에서 이 저장소 폴더로 Claude Code 세션을 연다.
   - 터미널에서 저장소 폴더로 이동해 **`claude remote-control`**을 실행한다. 그 세션이 Claude Code 앱에 나타나므로, 휴대폰이나 웹에서도 이어서 지켜보고 지시할 수 있다.
4. 세션에서 Chrome 확장이 연결되었는지 확인한다(Claude Code CLI라면 `/chrome`).
5. (선택) 공주 레퍼런스 그림 파일이 있으면 경로를 알려 준다. 캐릭터 시트를 만들 때 **머리색·눈색·색 체계 참고용으로만** 첨부한다.

### B-2. 로컬 Claude에게 붙여넣을 지시문
아래 블록을 통째로 복사해 로컬 Claude 세션에 붙여넣는다.

````text
너는 내 컴퓨터에서 실행 중인 Claude이고, Claude in Chrome 확장으로 내 Chrome을 쓸 수 있어.
「별의 공주」 게임 그림을 제미나이 웹(gemini.google.com)으로 그려서 이 저장소에 넣어줘.

[지켜야 할 것]
- 공주 외형·나이 원칙의 정본은 docs/game-design/character-design.md 야. 12세 이용가이고, 10~18세 모든 단계에서 나이에 맞는 체형과 단정한 옷. 특정 작가의 화풍을 지명하거나 흉내 내지 마.
- 프롬프트는 game/assets/gemini-prompts.md 의 블록을 글자 그대로 써. 고칠 때는 같은 채팅에서 "같은 구도로, <문제만> 고쳐줘"처럼 차이만 말해.
- 내가 열어 둔 다른 탭은 건드리지 말고 새 탭에서 작업해.
- 결제·구독·계정 설정·약관 동의는 하지 마. 로그인, 캡차, 사용 한도 안내가 뜨면 거기서 멈추고 나에게 알려줘.
- 제미나이 앱이 그림에 넣는 공식 표시(워터마크)는 지우거나 가리지 마.
- 그림을 직접 그리거나 다른 도구로 만들어 채우지 마. 제미나이가 만든 그림만 저장해.

[준비]
1. 저장소 루트에서 git status 로 깨끗한지 확인하고 (내가 허락하면 git pull), cd game 한 뒤 실행:
   node tools/gemini/build-manifest.mjs && node tools/gemini/chrome-batch.mjs
2. node tools/gemini/fit.mjs --check 로 이미 있는 그림과 "다음에 그릴 것" 번호를 확인해. 이미 있는 번호는 건너뛰어.
3. Chrome 새 탭에서 https://gemini.google.com/app 을 열고 새 채팅을 시작해. 이미지 생성이 되는 모델(이미지 만들기)을 골라.

[1단계: 스타일 앵커와 캐릭터 시트]
4. gemini-prompts.md 의 "§0 스타일 앵커" 블록을 보내고 "준비됨" 답을 받아.
5. "#1 ref/luna_sheet" 프롬프트 블록을 보내. 내가 레퍼런스 그림 파일을 알려 줬다면 함께 첨부하고,
   "첨부 그림은 머리색·눈색·색 체계 참고용으로만 쓰고 화풍·구도는 따라 하지 말 것"이라고 덧붙여.
6. 결과를 다운로드하고, 다운로드 폴더에서 가장 최근 이미지 파일을 찾아(예: ls -t ~/Downloads | head -3) 저장해:
   node tools/gemini/fit.mjs --from="<그 파일>" --key=ref/luna_sheet
7. game/assets/ref/luna_sheet.png 를 열어 character-design.md 와 비교하고, 나에게 보여 주고 승인을 받은 뒤에 다음으로 넘어가.

[2단계: #2부터 끝까지 번호 순서대로]
8. 항목마다 다음을 해:
   ① 「첨부」에 적힌 파일(game/assets/... 의 PNG)을 제미나이 입력창에 업로드
   ② 그 항목의 프롬프트 블록 전체를 붙여넣고 전송
   ③ 생성이 끝나면 다운로드
   ④ node tools/gemini/fit.mjs --from="<다운로드한 파일>" --key=<그 항목의 키>
   ⑤ 저장된 PNG를 열어 아래 [검수]로 확인
   ⑥ 실패면 같은 채팅에서 차이만 말해 최대 2번 다시 생성. 그래도 안 되면 그 키를 "건너뜀" 목록에 적고 다음으로.
   파일 업로드가 안 되면 같은 채팅 안에서 이어서 요청하고 프롬프트 맨 앞에 "이 채팅 위쪽의 캐릭터 시트와 같은 인물로"를 붙여.
   새 채팅이 필요하면 첨부를 나에게 부탁해.
9. 15장마다, 또는 그림체가 흔들리면 새 채팅을 열고 §0 앵커를 다시 보낸 뒤 캐릭터 시트를 첨부해서 이어 가.
10. 그룹(char, npc, bg, ending, ui)이 하나 끝날 때마다:
    node tools/gemini/fit.mjs --check
    git add game/assets/<그룹>
    git commit -m "Add Gemini art: <그룹> (<장수> images)"
    push는 내가 허락할 때만 해.

[검수: 그림마다]
- 글자, 가짜 서명, 로고가 없다. 머리나 손이 잘리거나 손가락이 이상하지 않다.
- 공주: 은백색 허리까지 오는 생머리와 일자 앞머리, 붉은 눈, 금색 4각 별 반짝임, 흑백 의상에 포인트 색 하나
  (신체=진홍, 지성=남보라, 사교=금색, 내면=녹색). 캐릭터 시트와 같은 얼굴.
- 나이에 맞는 체형(10세는 아이 비율). 어깨와 가슴이 가려지고 치마는 길며 트임이 없다. 몸을 강조하는 자세나 구도가 없다.
  엔딩의 공주는 약 28세 성인이지만 역시 단정하다.
- 보호자는 얼굴이 보이지 않는다(뒷모습, 실루엣, 손만). 보호자와 공주 사이에 연애 분위기가 없다.
- 배경: "인물 없음"인 곳에 사람이 없다. 사계절 거실은 같은 방이다. 읽을 수 있는 간판 글자가 없다.

[끝나면]
완료한 키, 건너뛴 키와 이유, fit.mjs --check 결과를 나에게 보고해.
````

### B-3. 사람이 해 줄 일
- **캐릭터 시트 승인.** 이후 모든 공주 그림의 기준이므로 가장 중요하다.
- 로그인, 캡차, 사용 한도 같은 안내가 뜨면 직접 처리한다. 제미나이 앱은 하루 이미지 수에 한도가 있을 수 있다. 한도에 걸리면 다음 날 `fit.mjs --check`의 "다음에 그릴 것"부터 이어 간다.
- 제미나이 앱에서 만든 이미지에는 오른쪽 아래에 작은 공식 표시가 들어갈 수 있다. **지우거나 가리지 않는다.** 표시 없는 파일이 필요하면 A. API 경로를 쓴다.
- 브라우저 경로는 사람의 손이 많이 간다(99장 × 업로드·다운로드). 키를 만들 수 있다면 A 경로가 빠르고 결과도 재현할 수 있다.

---

## C. QA 체크리스트

새 그림을 커밋하기 전에 확인한다. 공주가 나오는 그림은 `character-design.md`를 옆에 띄워 놓고 본다.

### C-1. 일관성
- [ ] 공주: 은백색(거의 흰색) **허리까지 오는 생머리**, 눈썹을 살짝 덮는 일자 앞머리, 얼굴 옆 긴 옆머리
- [ ] **붉은(크림슨) 눈**, 큰 눈동자와 밝은 하이라이트, 차분하고 살짝 나른한 눈매
- [ ] **금색 4각 별 반짝임**이 있다 (지성·성인 단계는 조금 더 많이)
- [ ] 의상은 **흑백 기조 + 포인트 색 하나**: 신체=진홍, 지성=남보라, 사교=금색, 내면=녹색
- [ ] 같은 나이대 4장(신체·지성·사교·내면)이 같은 얼굴이고 같은 키다. 단계가 오를수록 자연스럽게 자란다
- [ ] 캐릭터 시트와 나란히 놓았을 때 같은 인물로 보인다
- [ ] 화풍: 깨끗한 선의 셀 채색, 부드러운 그라데이션. 그룹 안에서 그림체가 튀지 않는다
- [ ] NPC: `images.js` 설명과 `character-design.md` 색 메모를 따른다(큐브는 흰 정육면체 + 검정 나비넥타이, 테오도라는 금발 세로 롤 + 진홍 드레스, 리온은 금발·푸른 눈·남색 옷)
- [ ] 배경: 사계절 거실은 같은 방(가구·창·난로 위치 동일). 세 개의 달 설정을 지킨다

### C-2. 나이·단정함 (반려 기준)
- [ ] 10세는 아이 비율(동글한 얼굴, 큰 머리, 짧은 팔다리), 12·14·16세는 그 나이의 청소년 체형, 18세는 성인 직전의 수수한 모습
- [ ] 미성년 단계에서 성인 체형, 굴곡 강조, 짙은 화장이 **없다**
- [ ] 어깨와 가슴이 가려지고, 치마는 길고 트임이 없으며, 몸에 달라붙는 옷이 없다
- [ ] 몸을 강조하는 자세, 구도, 앵글이 **없다**
- [ ] 엔딩(약 28세)도 단정하다. 보호자의 얼굴은 보이지 않고, 보호자와 공주 사이에 연애 분위기가 없다
- [ ] 리온·테오도라 초상은 13세 아이 비율이다. 연애 묘사는 엔딩의 성인 장면에서만, 건전하게
- [ ] 피, 상처, 겨눈 무기 같은 폭력 묘사가 없다(어둠 계열 엔딩도 마찬가지)

### C-3. 글자·표시
- [ ] 그림 속 **글자, 숫자, 가짜 서명, 로고, 간판 글씨, 말풍선**이 없다
- [ ] 가짜 워터마크처럼 보이는 잡티가 없다(제미나이 앱의 공식 표시는 예외: 지우지 않는다)

### C-4. 규격
- [ ] `node tools/gemini/fit.mjs --check` → exit 0 (모든 파일이 PNG이고 정확한 크기)
  - char 768×1040 · bg/npc 1280×560 · ending 1280×720 · ui/ref 1600×900
- [ ] 파일 이름이 매니페스트 키와 정확히 같다 (`game/assets/<key>.png`)
- [ ] 가운데 자르기 때문에 머리나 중요한 소품이 잘리지 않았다(잘렸으면 재생성하거나 구도 지시를 `prompt-overrides.json`에 추가)
- [ ] 게임에서 확인: `cd game && python3 -m http.server 8080` → 초상 칸(세로), 이벤트 창(16:7), 엔딩 화면에서 잘림이나 어색함이 없다

### C-5. 기록
- [ ] API 경로: `assets/generation-log.json`에 실패나 보류가 남아 있지 않다(있으면 해당 키 재실행)
- [ ] 커밋 메시지에 그룹과 장수를 적는다. 건너뛴 키는 다음 작업자를 위해 남긴다

---

## D. 파이프라인 점검 (키 없이)
```bash
cd game
node tools/gemini/build-manifest.mjs --check   # 매니페스트가 최신인지
node tools/gemini/generate.mjs --dry-run       # 계획 출력 (exit 0)
node tools/gemini/generate.mjs                 # 키가 없으면 안내 후 exit 2
node tools/gemini/test-pipeline.mjs            # 목업 API로 생성·재시도·폴백·참조·후처리·건너뛰기 전부 시험 (임시 폴더만 사용)
```
`test-pipeline.mjs`는 `mock-server.mjs`(ListModels + generateContent 흉내, 진짜 작은 PNG/JPEG 응답)를 띄워 `GEMINI_API_BASE=http://127.0.0.1:<port>`로 실제 코드 경로를 끝까지 돌린다. 출력은 OS 임시 폴더에만 쓰고 끝나면 지우며, `game/assets`가 바뀌지 않았는지도 확인한다.
