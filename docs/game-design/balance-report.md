# 「별의 공주」 밸런스 보고서 — 엔딩 도달 가능성 · 이벤트 커버리지

> 자동 생성: `node tools/reach.mjs 20` (2026-10-18). 콘텐츠가 들어올 때마다 다시 돌린다. 직접 수정하지 말 것.

- 데이터: 이벤트 **448**개 (core.js 36, b01_childhood.js 28, b02_school_friends.js 28, b03_adolescence.js 30, b04a_careers_body_art.js 27, b04b_careers_mind_faith.js 27, b05_origin.js 29, b06_guardian.js 27, b07_adventure.js 28, b08_work.js 31, b09_education.js 28, b10_seasons.js 27, b11_relationships.js 29, b12_shadows.js 27, b13_mysteries.js 27, b14_legacy.js 19) · 엔딩 **48**종 (히든 8) · 연간 결정 7개 나이 · 아이템 36종
- 실행: seek 20판 × 엔딩 48종 + 일반 정책 2000판 (+ 커버리지용 2회차 이상 200판) · 시드 1 · 보호자 knight/scholar · 미니게임 점수 0.7 · 상점 사용 · 워커 4 · 127.9초

## 요약

| 지표 | 값 | 기준 |
|---|---|---|
| 목표 추구(seek)로 도달한 엔딩 | **48 / 48** (평균 성공률 90.5%) | 전 엔딩 도달 |
| 어떤 방법으로도 도달 못 한 엔딩 | 없음 | 없음 |
| 일반 정책 분포에 나온 엔딩 종류 | 35 / 48 | — |
| 최다 엔딩 점유율 (일반) | 재상 19.4%  | ≤ 20% |
| 월평균 이벤트 (일반 / seek) | 1.89 / 1.93 | ≈ 1.5 |
| 무이벤트 달 비율 · 2달 연속 무이벤트 겪은 판 | 11.5% · 0.0% (최장 1달) | 연속 2달 금지 |
| 이벤트 커버리지 | 448 / 448 (미등장 0) | 전부 등장 |
| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (일반) | 9.2 · 6.1 · 2.90 · 16.9 | — |
| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (seek) | 4.5 · 0.8 · 0.04 · 13.0 | — |

판정: ✅ seek 성공률 ≥ 50% · 🟡 1~49% · 🟠 seek 0%지만 일반 플레이에서 나옴 · ❌ 도달 못 함. seek 성공률은 "목표를 알고 노리는 플레이어"의 하한 추정이다 (휴리스틱 정책이므로 0%가 곧 불가능은 아니지만, 원인 칸이 막힌 지점을 가리킨다).

## 1. 엔딩 도달 가능성

| | 엔딩 | id | 분류 | seek 성공 | 일반 N판 등장 | 실패 주원인 (seek 실패 판 기준) |
|---|---|---|---|---|---|---|
| ✅ | 여왕 | `queen` | 왕실/정치 | 20/20 (100%) | 247 (12.3%) |  |
| ✅ | 공작부인 | `duchess` | 왕실/정치 | 20/20 (100%) | 6 (0.3%) |  |
| ✅ | 외교관 | `diplomat` | 왕실/정치 | 20/20 (100%) | 37 (1.8%) |  |
| ✅ | 재상 | `chancellor` | 왕실/정치 | 20/20 (100%) | 388 (19.4%) |  |
| ✅ | 근위기사단장 | `guard_captain` | 무예 | 20/20 (100%) | 22 (1.1%) |  |
| ✅ | 용병왕 | `mercenary_king` | 무예 | 20/20 (100%) | 236 (11.8%) |  |
| ✅ | 모험가 | `adventurer` | 무예 | 20/20 (100%) | 11 (0.5%) |  |
| ✅ | 현상금 사냥꾼 | `bounty_hunter` | 무예 | 11/20 (55%) | 0 (0.0%) | 점수 역전 bandit_boss 4/9; 점수 역전 mercenary_king 3/9 → 대신 bandit_boss 4, mercenary_king 3 |
| ✅ | 대마법사 | `archmage` | 학문/마법 | 20/20 (100%) | 0 (0.0%) |  |
| ✅ | 왕실학자 | `royal_scholar` | 학문/마법 | 17/20 (85%) | 1 (0.1%) | 점수 역전 chancellor 3/3 → 대신 chancellor 3 |
| ✅ | 연금술사 | `alchemist` | 학문/마법 | 15/20 (75%) | 0 (0.0%) | 점수 역전 chancellor 4/5; 점수 역전 adventurer 1/5 → 대신 chancellor 4, adventurer 1 |
| ✅ | 약초의사 | `herb_doctor` | 학문/마법 | 20/20 (100%) | 2 (0.1%) |  |
| ✅ | 궁정악사 | `court_musician` | 예술/문화 | 19/20 (95%) | 176 (8.8%) | 게이트 flag.art_path 1/1 → 대신 stage_star 1 |
| ✅ | 극단 스타 | `stage_star` | 예술/문화 | 20/20 (100%) | 34 (1.7%) |  |
| ✅ | 화가 | `painter` | 예술/문화 | 15/20 (75%) | 2 (0.1%) | 점수 역전 court_musician 4/5; 점수 역전 astronomer 1/5 → 대신 court_musician 4, astronomer 1 |
| ✅ | 작가 | `writer` | 예술/문화 | 19/20 (95%) | 0 (0.0%) | 점수 역전 royal_scholar 1/1 → 대신 royal_scholar 1 |
| ✅ | 대상인 | `merchant_lord` | 생활/상업 | 20/20 (100%) | 5 (0.3%) |  |
| ✅ | 농장주 | `farm_owner` | 생활/상업 | 20/20 (100%) | 8 (0.4%) |  |
| ✅ | 요리사 | `chef` | 생활/상업 | 20/20 (100%) | 3 (0.1%) |  |
| ✅ | 여관 주인 | `innkeeper` | 생활/상업 | 20/20 (100%) | 0 (0.0%) |  |
| ✅ | 대주교 | `archbishop` | 신앙 | 20/20 (100%) | 0 (0.0%) |  |
| ✅ | 성녀 | `saint` | 신앙 | 20/20 (100%) | 177 (8.8%) |  |
| 🟡 | 순례자 | `pilgrim` | 신앙 | 9/20 (45%) | 0 (0.0%) | 점수 역전 farm_owner 6/11; 점수 역전 writer 2/11 → 대신 farm_owner 6, writer 2 |
| ✅ | 암살자 | `assassin` | 어둠 | 20/20 (100%) | 0 (0.0%) |  |
| ✅ | 도적단 두목 | `bandit_boss` | 어둠 | 20/20 (100%) | 174 (8.7%) |  |
| ✅ | 사기꾼 | `swindler` | 어둠 | 20/20 (100%) | 0 (0.0%) |  |
| ✅ | 왕자와의 결혼 | `royal_wedding` | 관계 | 19/20 (95%) | 6 (0.3%) | 점수 역전 court_musician 1/1 → 대신 court_musician 1 |
| ✅ | 가족 | `family_home` | 관계 | 17/20 (85%) | 0 (0.0%) | 점수 역전 court_musician 1/3; 점수 역전 farm_owner 1/3 → 대신 court_musician 1, farm_owner 1 |
| ✅ | 떠도는 사람 | `drifter` | 관계 | 12/20 (60%) | 0 (0.0%) | 점수 역전 court_musician 7/8; 점수 역전 adventurer 1/8 → 대신 court_musician 7, adventurer 1 |
| ✅ | 별의 여신 (히든) | `star_goddess` | 히든 | 20/20 (100%) | 43 (2.1%) |  |
| ✅ | 세계 여행자 (히든) | `world_traveler` | 히든 | 20/20 (100%) | 59 (2.9%) |  |
| ✅ | 시간 역행 (히든) | `time_reverse` | 히든 | 20/20 (100%) | 5 (0.3%) |  |
| ✅ | 선장 | `ship_captain` | 무예 | 18/20 (90%) | 76 (3.8%) | 게이트 flag.sea_path 2/2 → 대신 diplomat 1, chancellor 1 |
| ✅ | 편력 기사 | `knight_errant` | 무예 | 16/20 (80%) | 8 (0.4%) | 게이트 flag.knight_oath_wander 4/4 → 대신 mercenary_king 4 |
| ✅ | 무희 | `prima_dancer` | 예술/문화 | 11/20 (55%) | 34 (1.7%) | 게이트 flag.prima_debut 9/9 → 대신 stage_star 4, mercenary_king 2 |
| ✅ | 의상 명인 | `tailor_master` | 예술/문화 | 19/20 (95%) | 8 (0.4%) | 게이트 flag.fashion_show 1/1 → 대신 court_musician 1 |
| ✅ | 명장 대장장이 | `master_smith` | 생활/상업 | 19/20 (95%) | 2 (0.1%) | 게이트 flag.masterwork 1/1 → 대신 mercenary_king 1 |
| ✅ | 마을 선생님 | `village_teacher` | 생활/상업 | 18/20 (90%) | 18 (0.9%) | 게이트 flag.teacher_offer 2/2 → 대신 diplomat 2 |
| ✅ | 천문학자 | `astronomer` | 학문/마법 | 17/20 (85%) | 2 (0.1%) | 게이트 flag.star_charts 3/3 → 대신 royal_scholar 3 |
| ✅ | 고아원 원장 | `orphanage_head` | 신앙 | 20/20 (100%) | 57 (2.9%) |  |
| ✅ | 왕실 첩보원 | `royal_spy` | 어둠 | 11/20 (55%) | 0 (0.0%) | 게이트 flag.spy_recruited 8/9; 점수 역전 queen 1/9 → 대신 queen 3, herb_doctor 3 |
| ✅ | 영매 | `medium` | 어둠 | 20/20 (100%) | 2 (0.1%) |  |
| ✅ | 평생의 라이벌 | `rival_partner` | 관계 | 19/20 (95%) | 53 (2.6%) | 게이트 flag.theodora_pact 1/1 → 대신 chancellor 1 |
| ✅ | 어머니와의 재회 (히든) | `mother_reunion` | 히든 | 18/20 (90%) | 34 (1.7%) | 게이트 flag.mother_alive 2/2; 게이트 flag.mother_found 2/2 → 대신 queen 1, court_musician 1 |
| ✅ | 용의 친구 (히든) | `dragon_friend` | 히든 | 15/20 (75%) | 11 (0.5%) | 게이트 flag.dragon_hatched 5/5; 게이트 flag.dragon_egg 3/5 → 대신 adventurer 5 |
| ✅ | 큐브의 정체 (히든) | `cube_true_form` | 히든 | 18/20 (90%) | 24 (1.2%) | 게이트 flag.cube_secret_2 2/2; 게이트 flag.cube_secret_1 1/2 → 대신 archbishop 1, saint 1 |
| ✅ | 보호자의 뒤를 잇다 (히든) | `guardian_successor` | 히든 | 17/20 (85%) | 29 (1.5%) | 게이트 flag.guardian_name_cleared 3/3; 게이트 flag.guardian_past_revealed 2/3 → 대신 archbishop 2, saint 1 |
| ✅ | 자매들 (히든) | `legacy_sisters` | 히든 | 20/20 (100%) | 0 (0.0%) |  |

## 2. 엔딩 분포 (일반 정책 10종)

| 순위 | 엔딩 | id | 판 수 | 점유율 | |
|---|---|---|---|---|---|
| 1 | 재상 | `chancellor` | 388 | 19.4% | ██████████ |
| 2 | 여왕 | `queen` | 247 | 12.3% | ██████ |
| 3 | 용병왕 | `mercenary_king` | 236 | 11.8% | ██████ |
| 4 | 성녀 | `saint` | 177 | 8.8% | ████ |
| 5 | 궁정악사 | `court_musician` | 176 | 8.8% | ████ |
| 6 | 도적단 두목 | `bandit_boss` | 174 | 8.7% | ████ |
| 7 | 선장 | `ship_captain` | 76 | 3.8% | ██ |
| 8 | 세계 여행자 | `world_traveler` | 59 | 2.9% | █ |
| 9 | 고아원 원장 | `orphanage_head` | 57 | 2.9% | █ |
| 10 | 평생의 라이벌 | `rival_partner` | 53 | 2.6% | █ |
| 11 | 별의 여신 | `star_goddess` | 43 | 2.1% | █ |
| 12 | 외교관 | `diplomat` | 37 | 1.8% | █ |
| 13 | 극단 스타 | `stage_star` | 34 | 1.7% | █ |
| 14 | 무희 | `prima_dancer` | 34 | 1.7% | █ |
| 15 | 어머니와의 재회 | `mother_reunion` | 34 | 1.7% | █ |
| 16 | 보호자의 뒤를 잇다 | `guardian_successor` | 29 | 1.5% | █ |
| 17 | 큐브의 정체 | `cube_true_form` | 24 | 1.2% | █ |
| 18 | 근위기사단장 | `guard_captain` | 22 | 1.1% | █ |
| 19 | 마을 선생님 | `village_teacher` | 18 | 0.9% |  |
| 20 | 모험가 | `adventurer` | 11 | 0.5% |  |
| 21 | 용의 친구 | `dragon_friend` | 11 | 0.5% |  |
| 22 | 농장주 | `farm_owner` | 8 | 0.4% |  |
| 23 | 편력 기사 | `knight_errant` | 8 | 0.4% |  |
| 24 | 의상 명인 | `tailor_master` | 8 | 0.4% |  |
| 25 | 공작부인 | `duchess` | 6 | 0.3% |  |
| 26 | 왕자와의 결혼 | `royal_wedding` | 6 | 0.3% |  |
| 27 | 대상인 | `merchant_lord` | 5 | 0.3% |  |
| 28 | 시간 역행 | `time_reverse` | 5 | 0.3% |  |
| 29 | 요리사 | `chef` | 3 | 0.1% |  |
| 30 | 약초의사 | `herb_doctor` | 2 | 0.1% |  |
| 31 | 화가 | `painter` | 2 | 0.1% |  |
| 32 | 명장 대장장이 | `master_smith` | 2 | 0.1% |  |
| 33 | 천문학자 | `astronomer` | 2 | 0.1% |  |
| 34 | 영매 | `medium` | 2 | 0.1% |  |
| 35 | 왕실학자 | `royal_scholar` | 1 | 0.1% |  |

일반 정책에서 한 번도 안 나온 엔딩 (13): `bounty_hunter`, `archmage`, `alchemist`, `writer`, `innkeeper`, `archbishop`, `pilgrim`, `assassin`, `swindler`, `family_home`, `drifter`, `royal_spy`, `legacy_sisters`

### 정책별 지표

| 정책 | 판 | 상위 엔딩 | 거부 | 강행 | 설득 성공 | 탈진 | 자율 슬롯 | 이벤트/월 | 최종 신뢰 | 연간 결정 | 구매 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| random | 200 | 재상 44, 외교관 26, 평생의 라이벌 26 | 0.8 | 0.2 | 0.2 | 0.06 | 12.4 | 1.89 | 99.0 | 7.0 | 12.2 |
| focus_body | 200 | 용병왕 183, 모험가 11, 용의 친구 6 | 25.9 | 8.5 | 3.5 | 0.51 | 2.9 | 1.88 | 95.8 | 7.0 | 15.6 |
| focus_mind | 200 | 재상 132, 별의 여신 41, 큐브의 정체 23 | 0.9 | 0.3 | 0.2 | 0.14 | 2.9 | 1.88 | 99.0 | 7.0 | 8.2 |
| focus_social | 200 | 여왕 193, 공작부인 5, 평생의 라이벌 1 | 0.1 | 0.0 | 0.0 | 0.01 | 3.0 | 1.86 | 99.4 | 7.0 | 12.6 |
| focus_inner | 200 | 성녀 176, 보호자의 뒤를 잇다 15, 의상 명인 5 | 0.1 | 0.0 | 0.0 | 0.00 | 3.2 | 1.88 | 99.6 | 7.0 | 11.4 |
| balanced | 200 | 여왕 53, 선장 53, 용병왕 31 | 1.4 | 0.4 | 0.3 | 0.01 | 0.0 | 1.85 | 98.8 | 7.0 | 6.1 |
| hands_off | 200 | 세계 여행자 59, 궁정악사 36, 극단 스타 28 | 0.0 | 0.0 | 0.0 | 0.00 | 103.3 | 1.89 | 99.3 | 7.0 | 10.0 |
| tyrant | 200 | 재상 190, 외교관 7, 별의 여신 2 | 45.5 | 45.5 | 0.0 | 27.41 | 0.0 | 1.86 | 16.5 | 7.0 | 0.4 |
| shadow | 200 | 도적단 두목 174, 용병왕 22, 대상인 4 | 17.2 | 5.7 | 4.0 | 0.92 | 0.0 | 1.97 | 98.8 | 7.0 | 16.5 |
| nurture | 200 | 궁정악사 111, 고아원 원장 55, 마을 선생님 17 | 0.0 | 0.0 | 0.0 | 0.00 | 41.0 | 1.95 | 99.9 | 7.0 | 9.1 |

## 3. 이벤트 밀도

목표: 월평균 1.5회, 무이벤트 달 연속 2회 이상 금지 (GDD 2).

| 나이 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 전체 |
|---|---|---|---|---|---|---|---|---|---|
| 일반 이벤트/월 | 1.91 | 1.79 | 1.88 | 1.82 | 1.88 | 1.92 | 1.92 | 2.02 | **1.89** |
| seek 이벤트/월 | 2.01 | 1.80 | 1.84 | 1.87 | 1.92 | 1.97 | 1.97 | 2.06 | **1.93** |

- 무이벤트 달: 일반 11.5% (2달 연속을 겪은 판 0.0%, 최장 1달) · seek 11.6% (최장 1달)
- 연쇄 순환 보호(한 달 20건 초과) 발동: 일반 0회 · seek 0회
- seek가 미니게임 점수(0.7)를 쓴 판정: 판당 5.0회

## 4. 이벤트 커버리지 — 미등장 0개 / 전체 448개

모든 판(seek + 일반 + 2회차 이상 표본)을 합쳐 한 번도 나오지 않은 이벤트. 진단은 이벤트 나이 창 안에서 관측된 최고·최저 상태로 각 조건을 따로 평가한 결과다 (개별로는 통과해도 동시에 맞지 않을 수 있음).

모든 이벤트가 최소 한 번 등장했다. ✅

### 2회차 이상 표본에서만 나온 이벤트 (회차 조건 · 해금 보호자 출신 전용)

`b06_merchant_loan` (b06_guardian.js, 33판) · `b06_merchant_haggle` (b06_guardian.js, 39판) · `b06_priest_firewood` (b06_guardian.js, 25판) · `b06_priest_rites` (b06_guardian.js, 36판) · `b06_adv_map` (b06_guardian.js, 32판) · `b06_adv_reunion` (b06_guardian.js, 33판) · `b14_trail_cache` (b14_legacy.js, 14판) · `b14_floor_box` (b14_legacy.js, 60판)

### 드물게 나온 이벤트 (반복 불가 이벤트 중 등장 판 비율 하위)

| 이벤트 | 파일 | 등장 판 비율 |
|---|---|---|
| `b04a_smith_second_fire` | b04a_careers_body_art.js | 0.44% |
| `b14_trail_cache` | b14_legacy.js | 0.44% |
| `b06_priest_firewood` | b06_guardian.js | 0.79% |
| `b06_adv_map` | b06_guardian.js | 1.01% |
| `b06_adv_reunion` | b06_guardian.js | 1.04% |
| `b06_merchant_loan` | b06_guardian.js | 1.04% |
| `b06_priest_rites` | b06_guardian.js | 1.14% |
| `b06_merchant_haggle` | b06_guardian.js | 1.23% |
| `b07_dragon_sky` | b07_adventure.js | 1.42% |
| `b14_known_trail` | b14_legacy.js | 1.46% |
| `b07_bounty_fox` | b07_adventure.js | 1.68% |
| `b12_two_reports` | b12_shadows.js | 1.80% |

### 선택지 커버리지 공백 (15건)

등장한 이벤트 중 한 번도 고르지 않은 선택지, 또는 20회 이상 골랐는데 판정이 한쪽으로만 나온 선택지.

| 이벤트 | 선택지 | 내용 |
|---|---|---|
| `b03_far_letter` | 1. 이 집도 넣어 달라고 한다 | 판정 실패 0/28 (dc 145) |
| `b04a_cook_banquet` | 4. 성당 배식 솜씨를 보탠다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b04b_pilgrim_blister` | 4. 산길 지름길을 그려 보낸다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b06_name_evidence` | 4. 물려받은 지도를 펼친다 | 선택된 적 없음 (조건 flag.b06_map_given) |
| `b06_night_coins` | 4. 가렛에게 빚 기한을 늦춰 달라 한다 | 선택된 적 없음 (조건 flag.debt_garrett) |
| `b07_guild_board` | 4. 닳은 은패를 내민다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b07_blizzard_pass` | 4. 눈벽 쌓는 법을 가르친다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b08_night_mud` | 4. 축복한 등불을 들려 보낸다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b09_theo_question` | 3. 사제였던 당신이 답한다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b10_halo_cat` | 4. 고양이와 눈인사를 가르친다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b11_leon_court_dinner` | 4. 상인의 눈으로 귀띔한다 | 선택된 적 없음 (조건 guardian == 'merchant') |
| `b12_bell_coat` | 4. 성당 급식소로 데려오라 한다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b12_fifth_lock` | 4. 장부를 셋째 달에 넘긴다 | 선택된 적 없음 (조건 flag.b12_spy_contact) |
| `b14_trail_cache` | 4. 꾸러미에 남은 별빛을 읽는다 | 선택된 적 없음 (조건 stat.mag >= 150) |
| `b14_sisters_field` | 3. 숲속 꾸러미 이야기를 꺼낸다 | 선택된 적 없음 (조건 flag.b14_left_gift) |

## 방법

- **일반 정책 10종** (`random` `focus_body` `focus_mind` `focus_social` `focus_inner` `balanced` `hands_off` `tyrant` `shadow` `nurture`): v0.1 시뮬레이터와 같은 스케줄·거부·이벤트 규칙 + 연간 결정(정책 성향대로)·상점(가끔, 성향에 맞는 물건). 시드 `seed..seed+N-1`, 보호자는 기사/학자 무작위.
- **seek:<엔딩>**: 엔딩의 gates·bonus 조건을 파싱해 부족분을 정규화한 효용 함수로 매 결정을 1수 앞보기한다. 활동 3슬롯(엔진 효과 근사 + 월말 정산 예측), 거부 대응(수용/설득 확률/강행 기대값), 이벤트 선택(판정 성공·실패 기대값, `next` 연쇄까지 최대 4단 앞보기), 연간 결정, 상점 구매. 필요한 플래그는 그 플래그를 세우는 이벤트·선택지·연간 결정·아이템을 역추적해 선행 조건·판정 능력치(주사위면 dc+40, 미니게임이면 고정 swing+5, `check.bonus`는 현재 값만큼 뺌)·요구 활동을 하위 목표로 삼는다. 경쟁 엔딩(점수 역전)과 원치 않는 히든 엔딩(선점)은 게이트 근접도로 벌점을 주고, 앞선 점수는 200점까지 선형·그 뒤로 로그로 가치를 매겨 게이트를 일찍 채운 뒤에도 점수를 계속 키운다. 조건 하나만 남은 이벤트는 "그 문턱을 넘으면 열릴 이벤트의 기대 가치"로 미리 피하거나 노리고, 남은 고정 이벤트가 피할 수 없이 더할 값(예: 생일의 신뢰 +4)은 게이트 판정에 미리 더한다. 미니게임 판정에는 점수 0.7(괜찮은 플레이어)을 넣는다. 보호자는 해금 없이 고를 수 있는 기사/학자 중 목표에 맞는 쪽(게이트 플래그가 출신 전용 경로로만 세워지면 그 출신 — 표에 "해금 출신 필요"로 표시), 목표 게이트가 회차 조건(playthrough·legacyCount)을 요구하면 그 회차로 시작한다.
- **2회차 이상 표본** (기본 N/10판): 일반 정책 + 회차 2~(데이터의 회차 조건 최댓값, 최소 4)·이전 회차 딸 = 회차-1명 + 보호자 출신 5종(해금 출신 포함)을 돌아가며. 출신 전용·회차 전용 이벤트의 커버리지 집계에만 쓰고 분포에는 넣지 않는다.
- 커버리지 진단: 매달 실행 직후 상태에서 조건 경로별 나이별 최고·최저값과 플래그·함수 조건의 참/거짓 관측을 기록하고, 미등장 이벤트는 적격이었던 달 수와 "조건 하나만 모자랐던" 달 수(판×달 누적)를 센다.
- seek 판의 시드는 엔딩 id에서 정한다 (`seed + 1,000,000 + (FNV(id) mod 10⁶)×100 + k`). 엔딩이 추가·재배열돼도 기존 엔딩의 결과는 바뀌지 않는다.

