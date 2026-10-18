# 별의 공주 (Starborn Princess) — v0.2

프린세스메이커 계보의 육성 시뮬레이션. 별똥별과 함께 떨어진 아이를 10세부터 18세까지 8년 동안 키운다.

- 기획서: [`../docs/game-design/princess-raising-game-gdd.md`](../docs/game-design/princess-raising-game-gdd.md) (13장에 구현 현황)
- 콘텐츠 규칙: [`../docs/game-design/content-contract.md`](../docs/game-design/content-contract.md)
- 캐릭터 디자인: [`../docs/game-design/character-design.md`](../docs/game-design/character-design.md)
- 밸런스 보고서: [`../docs/game-design/balance-report.md`](../docs/game-design/balance-report.md)

## 실행

```bash
cd game
python3 -m http.server 8080     # 또는 npm run serve
# 브라우저에서 http://localhost:8080
```

빌드 도구 없이 ES 모듈로 동작한다. `file://`로 열면 모듈 로딩이 막히므로 로컬 서버가 필요하다.

## 들어 있는 것

| 항목 | 수량 |
|---|---|
| 이벤트 | 450 (판정 299, 미니게임 63, 연쇄 93) |
| 엔딩 | 49 (히든 8) · 후일담 편지 147통 |
| 활동 | 24 (교육 9 · 아르바이트 10 · 자유 5) |
| 연간 보호자 결정 | 7 (11~17세 생일) |
| 상점 아이템 | 36 |
| 보호자 출신 | 5 (3종은 별 조각으로 해금) |
| 미니게임 | 4 (시험 · 무도회 · 요리 · 모험) |

## 구조

```
index.html               진입점
css/                     style.css(거실 UI) · minigames.css · album.css
js/engine/engine.js      코어 루프·경제·이벤트 선정·엔딩 (DOM 의존 없음)
js/engine/conditions.js  이벤트 조건식 평가기
js/engine/josa.js        한국어 조사 자동 선택 ({name이}, {call은} …)
js/engine/meta.js        메타 진행: 별 조각·해금·편지·유산 (순수 함수)
js/engine/rng.js         시드 기반 난수
js/data/events/*.js      이벤트 (core + 배치 b01~b14, 파일당 default export 배열)
js/data/*.js             능력치·활동·엔딩·편지·연간 결정·아이템·보호자·이미지 목록·공용 플래그
js/ui/app.js             화면 흐름 (타이틀·메인·모달·엔딩·세이브)
js/ui/minigames.js       미니게임 4종
js/ui/album.js           엔딩 앨범·편지함·지난 아이들·별 조각 상점·성격 지도
js/ui/portrait.js        SVG 초상 (PNG 그림이 있으면 자동 교체)
tools/                   검증·테스트·시뮬레이터·제미나이 파이프라인
assets/                  그림 자리 (manifest.json, gemini-prompts.md)
```

## 검증

```bash
node tools/gen-event-index.mjs   # 이벤트 파일을 추가했으면 먼저
node tools/validate.mjs          # 콘텐츠 규칙·참조·안전 검사 (오류 0이어야 함)
node tools/test.mjs              # 엔진·시뮬레이터 테스트
node tools/test-meta.mjs         # 메타 진행 테스트
node tools/simulate.mjs 2000     # 일반 플레이 분포
node tools/reach.mjs 24          # 엔딩 도달성·이벤트 커버리지 보고서 (약 2.5분)
```

## 그림 (제미나이)

게임은 `assets/<key>.png`가 있으면 자동으로 쓰고, 없으면 내장 SVG를 보여 준다. 116장 목록은 `assets/manifest.json`.

- **API**: 클라우드 환경 설정에 `GEMINI_API_KEY`를 환경 변수로 추가한 뒤 `node tools/gemini/generate.mjs` (먼저 `--dry-run`으로 계획과 비용 확인). 키는 채팅에 붙여 넣지 않는다.
- **Chrome**: 내 컴퓨터의 Claude 세션에서 Control Chrome으로 gemini.google.com을 조작한다. 절차는 [`../docs/game-design/control-chrome-guide.md`](../docs/game-design/control-chrome-guide.md)와 [`../docs/game-design/gemini-chrome-runbook.md`](../docs/game-design/gemini-chrome-runbook.md).
- 받은 그림 크기 맞추기: `node tools/gemini/fit.mjs --from <다운로드 파일> --key <key>`

## 이벤트 추가

`js/data/events/`에 파일을 하나 만들고 `export default [ ... ]`로 이벤트를 쓴 뒤 `node tools/gen-event-index.mjs && node tools/validate.mjs --file=<파일명>`. 규칙은 콘텐츠 계약서 참조.
