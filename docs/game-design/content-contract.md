# 「별의 공주」 콘텐츠 계약서 (Content Contract v1)

> 이 문서는 이벤트·엔딩·연간 결정·아이템·편지를 쓰는 모든 작성자(사람·에이전트)의 공통 규칙이다.
> 기획 의도는 `princess-raising-game-gdd.md`, 데이터 정의는 `game/js/data/*.js`가 정본이다.
> **자기 검사**: 파일을 쓴 뒤 반드시 `cd game && node tools/gen-event-index.mjs && node tools/validate.mjs --file=<파일명>` → 오류 0.

---

## 1. 파일 소유 규칙

- 이벤트는 `game/js/data/events/<배치코드>_<주제>.js` 한 파일에 `export default [ ... ]`로 쓴다. **남의 파일은 수정하지 않는다.**
- 이벤트 id는 `<배치코드>_` 접두사로 시작한다 (예: `b07_ruins_gate`). 코어 이벤트(`core.js`)는 접두사 없음.
- 그 배치만 쓰는 **비공개 플래그**도 `<배치코드>_` 접두사 (예: `flag.b07_map_found`).
- 여러 파일이 함께 쓰는 **공용 플래그**는 §6 표에 있는 것만 쓴다. 새 공용 플래그가 필요하면 만들지 말고 비공개 플래그로 해결한다.
- 엔진·UI 코드(`js/engine`, `js/ui`)는 콘텐츠 작성자가 수정하지 않는다.

## 2. 세계관 요약

- **셀레스티아 왕국**: 세 개의 달이 뜨는 중세 판타지. ① 왕도(정치·귀족·왕궁·예절학교) ② 항구도시(상업·여관·용병단·밤 시장) ③ 농촌 평원(밭·엘다의 오두막·우리 집).
- **아이**: 10세에 별똥별과 함께 들판에 떨어진 아이. 은백색 긴 생머리·붉은 눈, 감정이 일렁이면 주위에 금색 별빛이 반짝인다(외형은 `character-design.md`). 출생의 비밀이 메인 서사. 진실: 왕실 마법사였던 어머니가 마법탑에서 도망치며 아이를 하늘에 숨겼다(엘다는 어머니의 스승). 어머니의 생사는 미확정 → 배치 b05가 다룬다.
- **보호자(플레이어 = "당신")**: 출신 5종 `knight`(전직 왕실 기사) `scholar`(떠돌이 학자) `merchant`(은퇴한 상인) `priest`(은퇴한 사제) `adventurer`(은퇴한 모험가, 여성). 아이가 부르는 호칭은 출신마다 다르므로 **반드시 `{call}` 토큰**을 쓴다.
- **주요 NPC (관계 수치 있음)**: `cube` 큐브(집사 요정, 마스코트, 정체불명) · `loren` 마담 로렌(왕도 예절학교 교장) · `garrett` 가렛(항구 용병단장, 보호자의 옛 동료) · `elda` 엘다(평원 약초 마법사) · `leon` 리온(동년배 소년, 사실 왕자) · `theodora` 테오도라(동년배 라이벌 귀족 소녀).
- **보조 NPC (관계 수치 없음, `npc` 필드로 초상만)**: `envoy` 마법탑의 사자 · `archbishop` 대주교 · `guildmaster` 상인 길드장 · `shadow` 그림자 길드의 남자 · `troupe` 극단 단장 · `knight_cpt` 근위대장.

## 3. 톤·안전 규칙 (위반 시 반려)

1. **12세 이용가.** 선정성 없음. 폭력·범죄·비행은 결과(관계 악화, 악평, 신뢰 하락)로 묘사하고 잔혹 묘사 금지.
2. **연애는 16세 이상, 동년배 NPC에 한정.** 연애 이벤트는 `romance: true` 태그 + `age[0] >= 16`. **보호자와 아이 사이의 연애·연애를 암시하는 표현은 절대 금지.** 보호자는 부모다.
3. 아이를 학대하는 선택지를 "정답"으로 만들지 않는다. 강압적 선택은 반드시 신뢰 하락 등 대가가 있다.
4. 실존 인물·브랜드·현대 고유명사 금지. 세계관 밖 어휘(스마트폰, 학원 시험 '수능' 등) 금지.
5. 따뜻하되 가볍지 않게. 웃음·슬픔·성장이 섞인 짧은 장면. 설교조 금지.

## 4. 문체

- 서술은 평서문 `~했다/~한다`. 보호자는 **"당신"**, 아이는 이름 토큰 또는 "아이".
- 아이 대사는 보호자에게 **반말**, 큰따옴표. NPC 말투는 캐릭터대로(로렌=격식체, 가렛=호쾌한 반말, 엘다=다정한 존댓말, 큐브=명랑한 존댓말 "주인님!", 테오도라=도도한 반말, 리온=예의 바른 반말).
- **이름·호칭은 토큰으로**: `{name}` `{name이}` `{name은}` `{name을}` `{name과}` `{name아}` `{name으로}` / `{call}` `{call이}` `{call은}` … (조사는 엔진이 받침에 맞춰 고른다). `{name}이`처럼 조사를 직접 붙이면 검증기 오류.
- 결과 문장을 함수로 써야 할 때만 `result: (s) => ...` 사용. 이때 조사는 `import { josa } from '../../engine/josa.js'` 후 `josa(s.name,'이')`.
- 분량: `text` 60~250자, `result` 30~150자, 선택지 `label` 4~25자.

## 5. 데이터 사전

### 능력치 12종 (`stat.*`, 0~999)
`hp`체력 `str`근력 `agi`민첩 · `int`지식 `cult`교양 `mag`마력 · `chm`매력 `eti`예절 `elo`화술 · `sens`감수성 `faith`신앙 `moral`도덕

### 성격 5축 (`pers.*`, -100~+100)
`extro` 외향(+활발/-내성) · `agree` 순응(+온순/-반항) · `ambit` 야심(+야망/-소박) · `roman` 감성(+낭만/-현실) · `good` 선악(+정의/-교활)

### 스칼라
`trust` 신뢰 0~100 · `stress` 0~100 · `gold` · `infamy` 악평 0~100 · `reputation` 평판 0~100 · `gHealth` 보호자 건강 0~100

### 활동 id (`requiresActivity`, `mastery.*`)
교육 `school` `etiquette` `sword` `magic`(11세~) `art` `theology` `commerce` `farmschool` · 일 `farm` `diner` `inn` `church` `sewing` `smith` `castle` `graveyard`(13세~) `shop` `theater`(12세~) · 자유 `rest` `adventure`(12세~) `shopping` `outing` (`autonomy`는 실제 활동으로 치환되므로 requiresActivity에 쓰지 않는다)
- `requiresActivity: 'smith'` 또는 `['smith','farm']`(둘 중 하나) → 이번 달에 그 활동을 했을 때만 후보.
- `mastery.smith >= 8` → 그 활동 누적 슬롯 수. 대략 1년 매달 1슬롯 = 12.

### 엔진 카운터 (`count.*`, 읽기 전용)
`refusals` 거부 · `forced` 강행 · `persuaded` 설득 성공 · `autonomy` 자율 슬롯 · `events` 이벤트 수 · `collapses` 탈진 · `adventures` 모험 횟수. 이벤트가 `count.<배치코드>_x: +1` 로 자기 카운터를 늘리는 것도 가능.

### 기타 조건 경로
`age` `month` `season`('spring'|'summer'|'autumn'|'winter') `stage`('child'|'girl'|'teen'|'youth') `guardian`('knight'…) `item.<id>` `legacyCount`(이전 회차 딸 수) `playthrough`(몇 회차) `seen.<eventId>`(본 횟수)

### 아이템 id (`item.*` 조건·효과) — `game/js/data/items.js`
`ball_gown` 무도회 드레스 · `travel_cloak` 여행용 망토 · `practice_sword` 연습용 검 · `star_atlas` 별자리 도감 · `telescope` 놋쇠 망원경(13세~) · `herb_kit` 약초 상자 · `lute` 류트 · `sewing_kit` 재봉 상자 · `dancing_shoes` 무용화 · `silver_hairpin` 별 모양 은 머리핀 · `holy_pendant` 성당의 펜던트 · `ledger_book` 가죽 장부 · `warm_coat` 털 외투 · `cat_toy` 깃털 장난감 · `tonic` 기운 나는 약 · `diary` 자물쇠 일기장
- 조건 `item.ball_gown >= 1`(가지고 있음) / 효과 `'item.diary': +1`(선물로 줌) · `-1`(잃어버림).

### 이미지 키 (`image` 필드) — `game/js/data/images.js`에 있는 것만
`bg/room_spring|summer|autumn|winter` `bg/festival_spring` `bg/school` `bg/festival_harvest` `bg/starnight` `bg/market` `bg/harbor` `bg/tower` `bg/church` `bg/forest` `bg/ruins` `bg/castle_hall` `bg/ballroom` `bg/tavern_inn` `bg/graveyard_night` `bg/wheat_field` `bg/theater_stage` `bg/library` `bg/smithy` `bg/etiquette_school` `bg/elda_hut` `bg/training_yard` `bg/river` `bg/night_market` `bg/road` `bg/snow_village` `bg/sickroom` `bg/guild_hall` `bg/throne_room`
`npc` 필드: `cube` `loren` `garrett` `elda` `leon` `theodora` `envoy` `archbishop` `guildmaster` `shadow` `troupe` `knight_cpt` (image가 없으면 npc 초상, 둘 다 없으면 계절 거실)

## 6. 공용 플래그 표

| 플래그 | 의미 | 세팅 | 읽음 |
|---|---|---|---|
| `met_elda` `met_leon` | 만남 | core, b01 | 다수 |
| `magic_awake` | 마력 각성 | core, b13 | core, b05, 엔딩 |
| `knows_origin` | 출생의 진실을 앎 | core, b05 | 엔딩 |
| `elda_secret_1` | 엘다가 어머니를 언급 | core, b05 | core |
| `tower_choice_hers` `tower_lessons` | 탑 관련 결정 | core | 엔딩 |
| `leon_promise` | 리온이 돌아오겠다 약속 | core, b11 | core |
| `leon_love` | 리온과 연인(16+) | core, b11 | 엔딩 |
| `ball_won` `tea_party` | 무도회 승리·티파티 | core, b09, b11 | 엔딩 |
| `stage_star` | 무대 스타의 자질 | core, b08 | 엔딩 |
| `art_path` `scholar_path` `knight_path` `merchant_path` `church_path` | 진로 제안 수락 | core, b04a/b | 엔딩 |
| `shadow_path` | 그림자 세계 발 들임 | core, b12 | 엔딩 |
| `final_hers` `final_home` | 17세 마지막 대화 | core | 엔딩 |
| `ran_away` | 가출 경험 | core, b03 | 엔딩 |
| `has_cat` | 고양이 달무리 | core | 엔딩 |
| `respected_privacy` | 사생활 존중 | core, b03 | 엔딩 |
| `sea_path` | 배를 타고 항해를 경험 | b04a | 엔딩 선장 |
| `knight_oath_wander` | 편력 기사의 맹세 | b04a | 엔딩 편력 기사 |
| `prima_debut` | 무희로 첫 무대 | b04a | 엔딩 무희 |
| `dance_lessons` | 춤 수업 시작 | b09 | b04a |
| `fashion_show` | 재봉 작품 쇼 | b04a | 엔딩 의상 명인 |
| `masterwork` | 명검(걸작) 완성 | b04a | 엔딩 명장 |
| `star_watching` | 별 관측 취미 | b13 | b04b |
| `star_charts` | 별 지도 완성 | b04b | 엔딩 천문학자 |
| `tutor_started` | 동네 아이들 공부 봐줌 | b02 | b04b |
| `teacher_offer` | 마을 학교 교사 제안 수락 | b04b | 엔딩 마을 선생님 |
| `orphanage_vow` | 고아원 돕겠다는 맹세 | b04b | 엔딩 고아원 원장 |
| `ghost_friend` | 묘지의 유령 친구 | b08 | b04b, 엔딩 영매 |
| `spy_recruited` | 왕실 첩보부 포섭 | b12 | 엔딩 첩보원 |
| `theodora_pact` | 테오도라와 평생 라이벌 약속 | b11 | 엔딩 평생의 라이벌 |
| `mother_alive` `mother_found` | 어머니 생존 단서 / 재회 | b05 | 엔딩(히든) |
| `dragon_egg` `dragon_hatched` | 폐허의 알 / 부화 | b07 | 엔딩(히든) |
| `cube_secret_1` `cube_secret_2` | 큐브 정체의 단서 | b01 / b13 | 엔딩(히든) |
| `guardian_past_revealed` `guardian_name_cleared` | 보호자 과거 공개 / 오명 회복 | b06 | 엔딩(히든) |
| `legacy_met` | 이전 회차 딸과 만남 | b14 | 엔딩(히든) |

엔진이 직접 세팅: `secret_adventure`(자율행동으로 몰래 모험) `secret_night_work`(자율 묘지 일)

## 7. 이벤트 스키마

```js
import { josa } from '../../engine/josa.js';   // result 함수에서 조사가 필요할 때만
export default [
  {
    id: 'b07_ruins_gate',            // 필수. <배치코드>_ 접두사, 소문자·숫자·밑줄
    title: '폐허의 문',               // 필수
    text: '숲 깊은 곳, {name이} 이끼 낀 돌문 앞에 멈췄다. "{call}, 이거 봐. 글자가 빛나."',  // 필수
    age: [12, 16],                   // 필수(chainOnly 제외). 10~17
    season: 'autumn',                // 선택
    month: 9,                        // 선택 (fixed와 함께면 매년 그 달 고정 이벤트)
    weight: 1.5,                     // 선택, 기본 1. 0.3(희귀)~3(자주)
    conditions: ['stat.agi >= 120', 'flag.b07_map_found', '!flag.dragon_egg'],
    requiresActivity: 'adventure',   // 선택
    repeatable: false,               // 선택. true면 여러 번 등장 (일상 이벤트에만)
    chainOnly: false,                // true면 랜덤 등장 안 함. 다른 선택지의 next로만 진입
    guardian: false,                 // 보호자 서사 이벤트면 true (전체의 15% 상한 자동 적용)
    romance: false,                  // 연애 이벤트면 true (age[0] >= 16 필수)
    image: 'bg/ruins',               // 선택, §5 키만
    npc: 'garrett',                  // 선택
    choices: [                       // 1~4개. 조건 없는 선택지 최소 1개
      { label: '함께 들어간다', effects: { 'stat.agi': +6, stress: +5, 'flag.b07_inside': true }, result: '…', next: 'b07_ruins_hall' },
      { label: '문양을 베껴 온다', check: { stat: 'int', dc: 220 }, minigame: 'exam',
        success: { effects: { 'stat.int': +8, 'flag.dragon_egg': true }, result: '…' },
        fail:    { effects: { stress: +6 }, result: '…' } },
      { label: '돌아간다', conditions: ['trust >= 60'], effects: { trust: +3 }, result: '…' },
    ],
  },
];
```

- **효과 키**: `stat.<id>` `pers.<axis>` `rel.<npc>` `flag.<name>` `item.<itemId>` `count.<name>` `trust` `gold` `stress` `infamy` `reputation` `gHealth`
- **판정**: `check: { stat, dc, bonus? }` → 값 + 주사위(±60) ≥ dc 이면 success. `bonus: (s) => s.stats.chm * 0.3` 같은 보정 가능.
- **미니게임**: 판정 선택지에 `minigame: 'exam'|'ball'|'cooking'|'adventure'`를 붙이면 플레이어가 미니게임으로 주사위를 대신할 수 있다(건너뛰면 자동 판정). 시험=지식/교양, 무도회=예절/매력/민첩, 요리=감수성/체력, 모험=근력/민첩/마력. 판정의 15~25%에만.
- **연쇄**: `next: '<id>'` (같은 파일의 `chainOnly: true` 이벤트 권장). 연쇄는 3~5단계까지.
- **P1 원칙**: 모든 선택지는 능력치·성격·관계·플래그·금전 중 **두 곳 이상**에 흔적을 남긴다.

## 8. 수치 가이드 (시뮬레이션 실측 기반)

| 나이 | 전체 능력치 중앙값 | 집중 육성한 능력치(하위25%/중앙/상위10%) |
|---|---|---|
| 10 | 32 | 43 |
| 12 | 53 | 170 / 210 / 256 |
| 14 | 78 | 354 / 423 / 496 |
| 16 | 104 | 572 / 655 / 777 |
| 17 | 120 | 684 / 791 / 926 |

- **판정 DC**: "이 길을 키운 아이면 통과" = 그 나이 집중치 하위25% 근처 (14세 ≈ 330). "누구나 해볼 만" = 전체 중앙값 + 40 (14세 ≈ 120). 주사위가 ±60이므로 DC를 값보다 60 높이면 거의 실패.
- **효과 크기**: 능력치 일상 +2~+6, 중요 +8~+15, 결정적 +20~+30(드물게). 성격 ±1~±4(결정적 ±6). 신뢰 ±2~±8(결정적 ±15). 스트레스 -15~+15. 금전 ±20~±300. 관계 ±3~±12.
- 활동 한 슬롯이 주 능력치 +5~+8이므로, 이벤트 한 번이 활동 서너 번보다 크지 않게.
- `weight`: 일상 1, 특별 1.5~2.5, 희귀 0.3~0.6. 조건이 까다로운 이벤트는 weight를 높여 실제로 보이게.

## 9. 엔딩·편지·연간 결정·아이템 스키마

```js
// endings_ext.js
export const ENDINGS_EXT = [
  { id: 'ship_captain', name: '선장', cat: '무예', weights: { agi: 0.7, hp: 0.6, elo: 0.4 }, pers: { extro: 0.3, roman: 0.2 },
    gates: ['flag.sea_path', 'stat.agi >= 300'], bonus: [{ when: ['rel.garrett >= 50'], add: 80 }],
    epilogue: '…{name은}…', hidden: false },
];
// cat: '왕실/정치' '무예' '학문/마법' '예술/문화' '생활/상업' '신앙' '어둠' '관계' '히든'

// letters.js — 후일담 편지: 엔딩 후 다음 회차들에서 한 통씩 열린다
export const LETTERS = { ship_captain: [ { title: '첫 항해에서', text: '{call}에게. …' }, … ] };   // 엔딩마다 3통
export const CATEGORY_LETTERS = { '무예': [ … ] };  // 카테고리 공통 예비 편지

// annual.js — 생일 직후(11~17세) 보호자의 1년 방향 결정
export const ANNUAL = { 11: { title, text, image?, options: [ { id, label, desc, effects, conditions?, result } ] } };

// items.js
export const ITEMS = [ { id: 'silk_dress', name: '비단 드레스', kind: 'outfit', price: 300, minAge: 12, unique: true,
  desc: '…', onBuy: { 'stat.chm': +10 }, monthly: { 'stat.chm': +1 }, conditions: [] } ];
// kind: outfit accessory book tool gift consumable · monthly 능력치 효과는 ±3 이내
```
