# 별의 공주 (Starborn Princess) — 프로토타입 v0.1

프린세스메이커 계보의 육성 시뮬레이션. 기획서: [`../docs/game-design/princess-raising-game-gdd.md`](../docs/game-design/princess-raising-game-gdd.md)

## 실행
```bash
cd game
python3 -m http.server 8080     # 또는 npm run serve
# 브라우저에서 http://localhost:8080
```
빌드 도구 없이 바닐라 ES 모듈로 동작합니다. (file:// 로 직접 열면 모듈 로딩이 막히므로 로컬 서버 필요)

## 구조
```
index.html            진입점
css/style.css         UI 스타일 (다크 테마)
js/engine/engine.js   코어 루프: 거부 판정 → 월 실행 → 이벤트 → 결산 → 생일 → 엔딩 (DOM 의존 없음)
js/engine/conditions.js  이벤트 DSL 조건식 평가기 ("stat.int >= 300", "flag.met_elda", "!flag.x")
js/engine/rng.js      시드 기반 결정적 난수
js/data/stats.js      능력치 12종·성격 5축·NPC·성장 단계
js/data/activities.js 교육 8 · 아르바이트 10 · 자유행동 5 (+자율행동 선호 함수)
js/data/events.js     이벤트 36개 (고정 분기 4, 연쇄, 진로, 히든 플래그)
js/data/endings.js    엔딩 32종 (29 + 히든 3) 가중치·게이트·에필로그
js/ui/app.js          화면: 타이틀 / 메인(스케줄·스탯·성격·관계·기록) / 모달 / 엔딩 / 세이브 10슬롯
js/ui/portrait.js     레이어드 SVG 초상 (능력치·성격·스트레스 반영), 이미지 자산 있으면 자동 교체
tools/simulate.mjs    헤드리스 밸런스 시뮬레이터 (정책 10종 × N회 → 엔딩 분포)
tools/test.mjs        엔진 스모크 테스트
assets/               이미지 자산 규격 + 제미나이 프롬프트 팩
```

## 밸런스 검증
```bash
npm test                      # 엔진 테스트 8개
npm run sim -- 3000           # 3000회 자동 플레이, 엔딩 분포 출력 (약 8초)
node tools/simulate.mjs 5000 1 --csv=out.csv   # CSV 내보내기
```
현재 결과(3000회): 엔딩 25/32종 도달, 최다 엔딩 점유율 18.1%(용병왕), 히든 3.8%, 게임당 거부 9.7회·탈진 2.7회·이벤트 67회.

## 이벤트 추가 방법
`js/data/events.js`에 객체 하나를 추가하면 끝. 조건은 문자열 DSL, 효과는 `{ 'stat.int': +5, trust: -3, 'flag.x': true }` 형식. `node tools/test.mjs`가 키 오타와 끊어진 `next` 연결을 잡아줍니다.
