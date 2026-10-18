# Control Chrome으로 제미나이 그림 생성하기 (내 컴퓨터에서)

Control Chrome 확장은 **내 컴퓨터의 Chrome을 조작**하는 확장이라 클라우드 세션에서는 쓸 수 없다.
아래 순서대로 **내 컴퓨터에서 도는 Claude 세션**을 열면 그 세션이 Control Chrome으로 gemini.google.com을 조작해 그림을 받아 저장한다.

## 0. 한 번만 준비

1. 저장소를 내 컴퓨터에 받는다.
   ```bash
   git clone https://github.com/opendoyun/data_storage.git
   cd data_storage
   git checkout claude/princess-raising-game-design-lyvjms
   git pull
   ```
2. Chrome에서 gemini.google.com 에 로그인해 둔다.
3. (Mac) Chrome 메뉴 **보기 → 개발자 → Apple 이벤트의 자바스크립트 허용**을 켠다. Control Chrome이 페이지에 입력·클릭하려면 필요하다.
4. Claude Desktop 앱 설정에서 **Control Chrome** 확장이 켜져 있는지 확인한다.

## 1. 내 컴퓨터에서 Claude 세션 열기 (둘 중 하나)

- **Claude Desktop 앱의 Code 탭**에서 위 `data_storage` 폴더를 열어 로컬 세션을 시작한다.
- 또는 터미널에서 `data_storage` 폴더로 가서 `claude remote-control` 을 실행한다. 이 세션은 Claude Code 앱에도 나타난다.

## 2. 그 세션에 아래 지시문을 그대로 붙여 넣기

```
이 저장소는 육성 시뮬레이션 「별의 공주」다. Control Chrome 도구로 gemini.google.com 을 조작해서 게임 그림을 생성하고 저장해 줘.

먼저 읽을 것:
- docs/game-design/character-design.md  (공주 외형 확정안. 은백색 긴 생머리, 붉은 눈, 흑백 의상, 금색 별 반짝임, 애니메이션 셀 채색. 모든 나이에서 나이에 맞는 단정한 체형·옷차림)
- game/assets/manifest.json  (생성할 그림 목록. entries[] 의 각 항목: key, path, width, height, aspect, group, prompt, negative, refs. prompt 에는 스타일 앵커와 캐릭터 설정이 이미 들어 있으니 prompt 전체를 그대로 보내고, 끝에 "피해야 할 것: " + negative 를 붙인다.)
- game/assets/gemini-prompts.md  (같은 목록의 사람이 읽기 쉬운 판)
- docs/game-design/gemini-chrome-runbook.md  (전체 절차와 품질 점검표)

작업 순서:
1. Control Chrome 의 open_url 로 https://gemini.google.com/app 을 새 채팅으로 연다.
2. 매니페스트의 스타일 앵커 문단을 첫 메시지로 보낸다.
3. 생성 순서: ref/luna_sheet → char/* 20장 → npc/* → bg/* → ending/* → ui/*. ref/luna_sheet(캐릭터 시트)를 가장 먼저 생성한다. 이후 모든 char/* 는 같은 채팅 안에서 "위 캐릭터 시트의 공주와 같은 인물로"를 붙여 생성한다 (웹 UI에서는 파일 첨부를 자동화하기 어려우므로 같은 대화 맥락으로 일관성을 유지한다).
4. 입력: execute_javascript 로 입력창(contenteditable 영역)에 프롬프트를 넣고 보내기 버튼을 누른다. 페이지 구조는 get_page_content 로 확인하면서 맞춘다.
5. 생성 완료를 기다린 뒤, 마지막 응답의 이미지에 있는 다운로드 버튼(aria-label 에 "다운로드" 또는 "Download")을 execute_javascript 로 누른다.
6. 셸에서 ~/Downloads 의 가장 최근 이미지 파일을 game/assets/<key>.png 로 옮긴다. 폴더가 없으면 만든다.
7. 크기 보정: node game/tools/gemini/generate.mjs 의 후처리와 같은 규격(매니페스트의 width×height, 가운데 잘라내기)으로 맞춘다. 보정 스크립트가 있으면 그것을 쓴다 (gemini-chrome-runbook.md 참조).
8. 20장마다 결과를 열어 character-design.md 와 대조한다. 머리색·눈색·의상·나이 인상이 어긋나거나, 글자·워터마크가 있거나, 노출이 있는 그림은 다시 생성한다.
9. 제미나이가 일일 생성 한도에 걸리면 멈추고 어디까지 했는지 알려 준다. 다음에 이어서 하면 이미 있는 파일은 건너뛴다.
10. 다 되면 game/ 에서 python3 -m http.server 8080 으로 게임을 띄워 그림이 들어갔는지 확인하고, git add game/assets && git commit && git push 한다.
```

## 3. 참고

- 그림 약 110장(공주 초상 20, 배경 32, NPC 12, 엔딩 48, 기타). 웹 UI는 하루 생성 한도가 있어 여러 날에 나눠야 할 수 있다.
- 한도가 걱정되면 Gemini API 키를 쓰는 방법이 더 빠르다. 클라우드 환경 설정에 `GEMINI_API_KEY` 를 환경 변수로 추가하면 클라우드 세션이 `node game/tools/gemini/generate.mjs` 로 한 번에 생성한다. 키는 채팅에 붙여 넣지 않는다.
- 그림 파일이 `game/assets/<key>.png` 에 생기면 게임은 코드 수정 없이 자동으로 그 그림을 쓴다.
