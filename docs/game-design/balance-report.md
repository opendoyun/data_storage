# 「별의 공주」 밸런스 보고서 — 엔딩 도달 가능성 · 이벤트 커버리지

> 자동 생성: `node tools/reach.mjs 24` (2026-10-18). 콘텐츠가 들어올 때마다 다시 돌린다. 직접 수정하지 말 것.

- 데이터: 이벤트 **450**개 (core.js 36, b01_childhood.js 28, b02_school_friends.js 28, b03_adolescence.js 30, b04a_careers_body_art.js 28, b04b_careers_mind_faith.js 27, b05_origin.js 29, b06_guardian.js 27, b07_adventure.js 28, b08_work.js 31, b09_education.js 28, b10_seasons.js 27, b11_relationships.js 30, b12_shadows.js 27, b13_mysteries.js 27, b14_legacy.js 19) · 엔딩 **49**종 (히든 8) · 연간 결정 7개 나이 · 아이템 36종
- 실행: seek 24판 × 엔딩 49종 + 일반 정책 2000판 (+ 커버리지용 2회차 이상 200판) · 시드 1 · 보호자 knight/scholar · 미니게임 점수 0.7 · 상점 사용 · 워커 4 · 142.1초

## 요약

| 지표 | 값 | 기준 |
|---|---|---|
| 목표 추구(seek)로 도달한 엔딩 | **49 / 49** (평균 성공률 85.0%) | 전 엔딩 도달 |
| 어떤 방법으로도 도달 못 한 엔딩 | 없음 | 없음 |
| 일반 정책 분포에 나온 엔딩 종류 | 37 / 49 | — |
| 최다 엔딩 점유율 (일반) | 재상 17.2%  | ≤ 20% |
| 월평균 이벤트 (일반 / seek) | 1.54 / 1.58 | ≈ 1.5 |
| 무이벤트 달 비율 · 2달 연속 무이벤트 겪은 판 | 17.1% · 0.0% (최장 1달) | 연속 2달 금지 |
| 이벤트 커버리지 | 450 / 450 (미등장 0) | 전부 등장 |
| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (일반) | 9.4 · 6.2 · 3.04 · 16.3 | — |
| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (seek) | 4.8 · 0.9 · 0.04 · 13.9 | — |

판정: ✅ seek 성공률 ≥ 50% · 🟡 1~49% · 🟠 seek 0%지만 일반 플레이에서 나옴 · ❌ 도달 못 함. seek 성공률은 "목표를 알고 노리는 플레이어"의 하한 추정이다 (휴리스틱 정책이므로 0%가 곧 불가능은 아니지만, 원인 칸이 막힌 지점을 가리킨다).

## 1. 엔딩 도달 가능성

| | 엔딩 | id | 분류 | seek 성공 | 일반 N판 등장 | 실패 주원인 (seek 실패 판 기준) |
|---|---|---|---|---|---|---|
| ✅ | 여왕 | `queen` | 왕실/정치 | 24/24 (100%) | 226 (11.3%) |  |
| ✅ | 공작부인 | `duchess` | 왕실/정치 | 24/24 (100%) | 8 (0.4%) |  |
| ✅ | 외교관 | `diplomat` | 왕실/정치 | 23/24 (96%) | 165 (8.3%) | 점수 역전 chancellor 1/1 → 대신 chancellor 1 |
| ✅ | 재상 | `chancellor` | 왕실/정치 | 24/24 (100%) | 343 (17.2%) |  |
| ✅ | 근위기사단장 | `guard_captain` | 무예 | 24/24 (100%) | 18 (0.9%) |  |
| ✅ | 용병왕 | `mercenary_king` | 무예 | 24/24 (100%) | 290 (14.5%) |  |
| ✅ | 모험가 | `adventurer` | 무예 | 24/24 (100%) | 6 (0.3%) |  |
| 🟡 | 현상금 사냥꾼 | `bounty_hunter` | 무예 | 11/24 (46%) | 1 (0.1%) | 점수 역전 mercenary_king 7/13; 점수 역전 bandit_boss 3/13 → 대신 mercenary_king 7, bandit_boss 3 |
| ✅ | 대마법사 | `archmage` | 학문/마법 | 21/24 (88%) | 0 (0.0%) | 게이트 flag.magic_awake 3/3 → 대신 royal_scholar 1, astronomer 1 |
| ✅ | 왕실학자 | `royal_scholar` | 학문/마법 | 24/24 (100%) | 7 (0.4%) |  |
| ✅ | 연금술사 | `alchemist` | 학문/마법 | 17/24 (71%) | 0 (0.0%) | 점수 역전 archmage 2/7; 점수 역전 chancellor 2/7 → 대신 chancellor 2, archmage 2 |
| ✅ | 약초의사 | `herb_doctor` | 학문/마법 | 24/24 (100%) | 2 (0.1%) |  |
| ✅ | 궁정악사 | `court_musician` | 예술/문화 | 24/24 (100%) | 174 (8.7%) |  |
| ✅ | 극단 스타 | `stage_star` | 예술/문화 | 24/24 (100%) | 8 (0.4%) |  |
| ✅ | 화가 | `painter` | 예술/문화 | 20/24 (83%) | 1 (0.1%) | 점수 역전 court_musician 4/4 → 대신 court_musician 4 |
| ✅ | 작가 | `writer` | 예술/문화 | 24/24 (100%) | 0 (0.0%) |  |
| ✅ | 대상인 | `merchant_lord` | 생활/상업 | 24/24 (100%) | 6 (0.3%) |  |
| ✅ | 농장주 | `farm_owner` | 생활/상업 | 24/24 (100%) | 18 (0.9%) |  |
| ✅ | 요리사 | `chef` | 생활/상업 | 23/24 (96%) | 10 (0.5%) | 점수 역전 court_musician 1/1 → 대신 court_musician 1 |
| ✅ | 여관 주인 | `innkeeper` | 생활/상업 | 24/24 (100%) | 0 (0.0%) |  |
| ✅ | 대주교 | `archbishop` | 신앙 | 24/24 (100%) | 0 (0.0%) |  |
| ✅ | 성녀 | `saint` | 신앙 | 24/24 (100%) | 169 (8.5%) |  |
| ✅ | 순례자 | `pilgrim` | 신앙 | 19/24 (79%) | 0 (0.0%) | 점수 역전 farm_owner 2/5; 점수 역전 archbishop 1/5 → 대신 farm_owner 2, painter 1 |
| ✅ | 암살자 | `assassin` | 어둠 | 19/24 (79%) | 0 (0.0%) | 점수 역전 adventurer 3/5; 점수 역전 bandit_boss 1/5 → 대신 adventurer 3, bounty_hunter 1 |
| ✅ | 도적단 두목 | `bandit_boss` | 어둠 | 24/24 (100%) | 165 (8.3%) |  |
| ✅ | 사기꾼 | `swindler` | 어둠 | 24/24 (100%) | 0 (0.0%) |  |
| ✅ | 왕자와의 결혼 | `royal_wedding` | 관계 | 19/24 (79%) | 7 (0.4%) | 게이트 flag.leon_love 3/5; 점수 역전 court_musician 2/5 → 대신 court_musician 3, chef 1 |
| ✅ | 가족 | `family_home` | 관계 | 18/24 (75%) | 0 (0.0%) | 점수 역전 court_musician 4/6; 점수 역전 farm_owner 1/6 → 대신 court_musician 4, farm_owner 1 |
| ✅ | 떠도는 사람 | `drifter` | 관계 | 16/24 (67%) | 0 (0.0%) | 점수 역전 court_musician 4/8; 점수 역전 adventurer 3/8 → 대신 court_musician 4, adventurer 3 |
| ✅ | 별의 여신 (히든) | `star_goddess` | 히든 | 19/24 (79%) | 10 (0.5%) | 게이트 flag.tower_choice_hers 5/5 → 대신 medium 2, archmage 1 |
| ✅ | 세계 여행자 (히든) | `world_traveler` | 히든 | 24/24 (100%) | 69 (3.5%) |  |
| ✅ | 시간 역행 (히든) | `time_reverse` | 히든 | 24/24 (100%) | 1 (0.1%) |  |
| ✅ | 선장 | `ship_captain` | 무예 | 18/24 (75%) | 20 (1.0%) | 게이트 flag.sea_path 6/6 → 대신 adventurer 6 |
| ✅ | 편력 기사 | `knight_errant` | 무예 | 15/24 (63%) | 14 (0.7%) | 게이트 flag.knight_oath_wander 9/9 → 대신 mercenary_king 7, guard_captain 1 |
| ✅ | 무희 | `prima_dancer` | 예술/문화 | 18/24 (75%) | 11 (0.5%) | 게이트 flag.prima_debut 6/6 → 대신 stage_star 3, adventurer 2 |
| ✅ | 의상 명인 | `tailor_master` | 예술/문화 | 16/24 (67%) | 23 (1.1%) | 게이트 flag.fashion_show 8/8 → 대신 court_musician 8 |
| ✅ | 명장 대장장이 | `master_smith` | 생활/상업 | 16/24 (67%) | 7 (0.4%) | 게이트 flag.masterwork 8/8 → 대신 mercenary_king 4, guard_captain 3 |
| ✅ | 마을 선생님 | `village_teacher` | 생활/상업 | 19/24 (79%) | 32 (1.6%) | 게이트 flag.teacher_offer 5/5 → 대신 court_musician 4, chancellor 1 |
| ✅ | 천문학자 | `astronomer` | 학문/마법 | 18/24 (75%) | 19 (0.9%) | 게이트 flag.star_charts 6/6 → 대신 writer 3, royal_scholar 1 |
| ✅ | 고아원 원장 | `orphanage_head` | 신앙 | 21/24 (88%) | 44 (2.2%) | 게이트 flag.orphanage_vow 3/3 → 대신 court_musician 2, chef 1 |
| ✅ | 왕실 첩보원 | `royal_spy` | 어둠 | 17/24 (71%) | 12 (0.6%) | 게이트 flag.spy_recruited 7/7 → 대신 diplomat 2, chancellor 2 |
| ✅ | 영매 | `medium` | 어둠 | 24/24 (100%) | 10 (0.5%) |  |
| ✅ | 평생의 라이벌 | `rival_partner` | 관계 | 18/24 (75%) | 47 (2.4%) | 게이트 flag.theodora_pact 6/6 → 대신 duchess 2, chancellor 2 |
| ✅ | 어머니와의 재회 (히든) | `mother_reunion` | 히든 | 19/24 (79%) | 8 (0.4%) | 게이트 flag.mother_alive 5/5; 게이트 flag.mother_found 5/5 → 대신 queen 2, court_musician 1 |
| ✅ | 용의 친구 (히든) | `dragon_friend` | 히든 | 17/24 (71%) | 15 (0.8%) | 게이트 flag.dragon_hatched 7/7; 게이트 flag.dragon_egg 2/7 → 대신 adventurer 3, guard_captain 2 |
| ✅ | 큐브의 정체 (히든) | `cube_true_form` | 히든 | 21/24 (88%) | 19 (0.9%) | 게이트 flag.cube_secret_2 3/3; 게이트 flag.cube_secret_1 1/3 → 대신 saint 2, orphanage_head 1 |
| ✅ | 보호자의 뒤를 잇다 (히든) | `guardian_successor` | 히든 | 14/24 (58%) | 15 (0.8%) | 게이트 flag.guardian_name_cleared 10/10; 게이트 flag.guardian_past_revealed 3/10 → 대신 archbishop 8, saint 2 |
| ✅ | 자매들 (히든) | `legacy_sisters` | 히든 | 22/24 (92%) | 0 (0.0%) | 게이트 flag.star_watching 2/2 → 대신 diplomat 1, court_musician 1 |
| 🟡 | 평범한 나날 | `ordinary_days` | 생활/상업 | 2/24 (8%) | 0 (0.0%) | 점수 역전 innkeeper 5/22; 점수 역전 herb_doctor 3/22 → 대신 innkeeper 5, herb_doctor 3 |

## 2. 엔딩 분포 (일반 정책 10종)

| 순위 | 엔딩 | id | 판 수 | 점유율 | |
|---|---|---|---|---|---|
| 1 | 재상 | `chancellor` | 343 | 17.2% | █████████ |
| 2 | 용병왕 | `mercenary_king` | 290 | 14.5% | ███████ |
| 3 | 여왕 | `queen` | 226 | 11.3% | ██████ |
| 4 | 궁정악사 | `court_musician` | 174 | 8.7% | ████ |
| 5 | 성녀 | `saint` | 169 | 8.5% | ████ |
| 6 | 외교관 | `diplomat` | 165 | 8.3% | ████ |
| 7 | 도적단 두목 | `bandit_boss` | 165 | 8.3% | ████ |
| 8 | 세계 여행자 | `world_traveler` | 69 | 3.5% | ██ |
| 9 | 평생의 라이벌 | `rival_partner` | 47 | 2.4% | █ |
| 10 | 고아원 원장 | `orphanage_head` | 44 | 2.2% | █ |
| 11 | 마을 선생님 | `village_teacher` | 32 | 1.6% | █ |
| 12 | 의상 명인 | `tailor_master` | 23 | 1.1% | █ |
| 13 | 선장 | `ship_captain` | 20 | 1.0% | █ |
| 14 | 천문학자 | `astronomer` | 19 | 0.9% |  |
| 15 | 큐브의 정체 | `cube_true_form` | 19 | 0.9% |  |
| 16 | 근위기사단장 | `guard_captain` | 18 | 0.9% |  |
| 17 | 농장주 | `farm_owner` | 18 | 0.9% |  |
| 18 | 용의 친구 | `dragon_friend` | 15 | 0.8% |  |
| 19 | 보호자의 뒤를 잇다 | `guardian_successor` | 15 | 0.8% |  |
| 20 | 편력 기사 | `knight_errant` | 14 | 0.7% |  |
| 21 | 왕실 첩보원 | `royal_spy` | 12 | 0.6% |  |
| 22 | 무희 | `prima_dancer` | 11 | 0.5% |  |
| 23 | 요리사 | `chef` | 10 | 0.5% |  |
| 24 | 별의 여신 | `star_goddess` | 10 | 0.5% |  |
| 25 | 영매 | `medium` | 10 | 0.5% |  |
| 26 | 공작부인 | `duchess` | 8 | 0.4% |  |
| 27 | 극단 스타 | `stage_star` | 8 | 0.4% |  |
| 28 | 어머니와의 재회 | `mother_reunion` | 8 | 0.4% |  |
| 29 | 왕실학자 | `royal_scholar` | 7 | 0.4% |  |
| 30 | 왕자와의 결혼 | `royal_wedding` | 7 | 0.4% |  |
| 31 | 명장 대장장이 | `master_smith` | 7 | 0.4% |  |
| 32 | 모험가 | `adventurer` | 6 | 0.3% |  |
| 33 | 대상인 | `merchant_lord` | 6 | 0.3% |  |
| 34 | 약초의사 | `herb_doctor` | 2 | 0.1% |  |
| 35 | 현상금 사냥꾼 | `bounty_hunter` | 1 | 0.1% |  |
| 36 | 화가 | `painter` | 1 | 0.1% |  |
| 37 | 시간 역행 | `time_reverse` | 1 | 0.1% |  |

일반 정책에서 한 번도 안 나온 엔딩 (12): `archmage`, `alchemist`, `writer`, `innkeeper`, `archbishop`, `pilgrim`, `assassin`, `swindler`, `family_home`, `drifter`, `legacy_sisters`, `ordinary_days`

### 정책별 지표

| 정책 | 판 | 상위 엔딩 | 거부 | 강행 | 설득 성공 | 탈진 | 자율 슬롯 | 이벤트/월 | 최종 신뢰 | 연간 결정 | 구매 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| random | 200 | 외교관 81, 재상 30, 평생의 라이벌 21 | 0.5 | 0.2 | 0.1 | 0.07 | 11.5 | 1.54 | 99.1 | 7.0 | 8.8 |
| focus_body | 200 | 용병왕 175, 용의 친구 14, 명장 대장장이 6 | 26.9 | 8.9 | 3.6 | 0.58 | 2.7 | 1.52 | 92.5 | 7.0 | 15.9 |
| focus_mind | 200 | 재상 169, 큐브의 정체 19, 별의 여신 10 | 0.9 | 0.3 | 0.2 | 0.14 | 2.4 | 1.52 | 99.4 | 7.0 | 5.4 |
| focus_social | 200 | 여왕 195, 공작부인 5 | 0.1 | 0.0 | 0.0 | 0.04 | 2.6 | 1.52 | 99.3 | 7.0 | 12.1 |
| focus_inner | 200 | 성녀 166, 의상 명인 20, 보호자의 뒤를 잇다 14 | 0.1 | 0.0 | 0.0 | 0.00 | 3.1 | 1.55 | 99.2 | 7.0 | 10.6 |
| balanced | 200 | 용병왕 83, 여왕 30, 궁정악사 16 | 1.7 | 0.6 | 0.4 | 0.01 | 0.0 | 1.51 | 99.1 | 7.0 | 3.8 |
| hands_off | 200 | 세계 여행자 68, 궁정악사 41, 외교관 17 | 0.0 | 0.0 | 0.0 | 0.00 | 100.3 | 1.53 | 99.4 | 7.0 | 6.8 |
| tyrant | 200 | 재상 133, 외교관 61, 왕실 첩보원 4 | 47.1 | 47.1 | 0.0 | 28.48 | 0.0 | 1.51 | 11.9 | 7.0 | 0.3 |
| shadow | 200 | 도적단 두목 165, 용병왕 30, 대상인 4 | 16.4 | 5.4 | 3.8 | 1.11 | 0.0 | 1.59 | 98.7 | 7.0 | 16.8 |
| nurture | 200 | 궁정악사 99, 고아원 원장 44, 마을 선생님 31 | 0.0 | 0.0 | 0.0 | 0.00 | 40.5 | 1.60 | 100.0 | 7.0 | 7.3 |

## 3. 이벤트 밀도

목표: 월평균 1.5회, 무이벤트 달 연속 2회 이상 금지 (GDD 2).

| 나이 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 전체 |
|---|---|---|---|---|---|---|---|---|---|
| 일반 이벤트/월 | 1.54 | 1.46 | 1.56 | 1.46 | 1.53 | 1.52 | 1.56 | 1.67 | **1.54** |
| seek 이벤트/월 | 1.61 | 1.49 | 1.55 | 1.49 | 1.57 | 1.57 | 1.61 | 1.75 | **1.58** |

- 무이벤트 달: 일반 17.1% (2달 연속을 겪은 판 0.0%, 최장 1달) · seek 17.0% (최장 1달)
- 연쇄 순환 보호(한 달 20건 초과) 발동: 일반 0회 · seek 0회
- seek가 미니게임 점수(0.7)를 쓴 판정: 판당 3.5회

## 4. 이벤트 커버리지 — 미등장 0개 / 전체 450개

모든 판(seek + 일반 + 2회차 이상 표본)을 합쳐 한 번도 나오지 않은 이벤트. 진단은 이벤트 나이 창 안에서 관측된 최고·최저 상태로 각 조건을 따로 평가한 결과다 (개별로는 통과해도 동시에 맞지 않을 수 있음).

모든 이벤트가 최소 한 번 등장했다. ✅

### 2회차 이상 표본에서만 나온 이벤트 (회차 조건 · 해금 보호자 출신 전용)

`b06_merchant_loan` (b06_guardian.js, 30판) · `b06_merchant_haggle` (b06_guardian.js, 36판) · `b06_priest_firewood` (b06_guardian.js, 22판) · `b06_priest_rites` (b06_guardian.js, 35판) · `b06_adv_map` (b06_guardian.js, 30판) · `b06_adv_reunion` (b06_guardian.js, 34판) · `b14_trail_cache` (b14_legacy.js, 15판) · `b14_floor_box` (b14_legacy.js, 39판)

### 드물게 나온 이벤트 (반복 불가 이벤트 중 등장 판 비율 하위)

| 이벤트 | 파일 | 등장 판 비율 |
|---|---|---|
| `b04a_smith_second_fire` | b04a_careers_body_art.js | 0.27% |
| `b14_trail_cache` | b14_legacy.js | 0.44% |
| `b06_priest_firewood` | b06_guardian.js | 0.65% |
| `b12_two_reports` | b12_shadows.js | 0.77% |
| `b06_adv_map` | b06_guardian.js | 0.89% |
| `b06_merchant_loan` | b06_guardian.js | 0.89% |
| `b07_treasure_split` | b07_adventure.js | 0.95% |
| `b06_adv_reunion` | b06_guardian.js | 1.01% |
| `b06_priest_rites` | b06_guardian.js | 1.04% |
| `b06_merchant_haggle` | b06_guardian.js | 1.07% |
| `b07_dragon_sky` | b07_adventure.js | 1.13% |
| `b14_floor_box` | b14_legacy.js | 1.16% |

### 선택지 커버리지 공백 (24건)

등장한 이벤트 중 한 번도 고르지 않은 선택지, 또는 20회 이상 골랐는데 판정이 한쪽으로만 나온 선택지.

| 이벤트 | 선택지 | 내용 |
|---|---|---|
| `b01_lie_amends` | 3. 장부에 빚을 적게 한다 | 선택된 적 없음 (조건 guardian == 'merchant') |
| `b03_diary_noticed` | 4. 편지 일까지 꺼내 사과한다 | 선택된 적 없음 (조건 seen.secret_letter_confront >= 1) |
| `b03_far_letter` | 1. 이 집도 넣어 달라고 한다 | 판정 실패 0/22 (dc 145) |
| `b04a_cook_banquet` | 4. 성당 배식 솜씨를 보탠다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b04b_pilgrim_blister` | 4. 산길 지름길을 그려 보낸다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b07_fog_lost` | 4. 옛 신호 휘파람을 분다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b07_ruins_deep` | 3. 미라를 불러 함께 간다 | 선택된 적 없음 (조건 flag.b07_mira) |
| `b07_secret_boots` | 4. 내 첫 장화 이야기를 한다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b07_guild_board` | 4. 닳은 은패를 내민다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b08_night_mud` | 4. 축복한 등불을 들려 보낸다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b09_tower_candles` | 4. 아델에게 입단속을 부탁한다 | 선택된 적 없음 (조건 flag.magic_hidden) |
| `b09_theo_question` | 3. 사제였던 당신이 답한다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b09_mock_market` | 4. 옛 거래처를 귀띔해 준다 | 선택된 적 없음 (조건 guardian == 'merchant') |
| `b10_snow_letter_again` | 2. 아이 편지를 같이 읽는다 | 선택된 적 없음 |
| `b10_snow_letter_again` | 4. 어디서든 부쳐 달라고 한다 | 선택된 적 없음 (조건 age >= 16) |
| `b10_halo_cat` | 4. 고양이와 눈인사를 가르친다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b10_market_stall` | 4. 첫 손님 끄는 법을 일러 준다 | 선택된 적 없음 (조건 guardian == 'merchant', gold >= 30) |
| `b10_market_thief` | 4. 성당 급식소를 알려 준다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b11_leon_friend_letter` | 4. 테오도라와 함께 간다 | 선택된 적 없음 (조건 flag.b11_trio) |
| `b12_bell_coat` | 4. 참새단을 성당 급식소로 부른다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b13_cube_book` | 4. 부엌에서 부른 그 노래를 청한다 | 선택된 적 없음 (조건 flag.b13_cube_sang) |
| `b14_known_trail` | 4. 옛 모험가식으로 표식을 읽는다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b14_trail_cache` | 4. 꾸러미에 남은 별빛을 읽는다 | 선택된 적 없음 (조건 stat.mag >= 150) |
| `b14_sisters_field` | 3. 숲속 꾸러미 이야기를 꺼낸다 | 선택된 적 없음 (조건 flag.b14_left_gift) |

## 방법

- **일반 정책 10종** (`random` `focus_body` `focus_mind` `focus_social` `focus_inner` `balanced` `hands_off` `tyrant` `shadow` `nurture`): v0.1 시뮬레이터와 같은 스케줄·거부·이벤트 규칙 + 연간 결정(정책 성향대로)·상점(가끔, 성향에 맞는 물건). 시드 `seed..seed+N-1`, 보호자는 기사/학자 무작위.
- **seek:<엔딩>**: 엔딩의 gates·bonus 조건을 파싱해 부족분을 정규화한 효용 함수로 매 결정을 1수 앞보기한다. 활동 3슬롯(엔진 효과 근사 + 월말 정산 예측), 거부 대응(수용/설득 확률/강행 기대값), 이벤트 선택(판정 성공·실패 기대값, `next` 연쇄까지 최대 4단 앞보기), 연간 결정, 상점 구매. 필요한 플래그는 그 플래그를 세우는 이벤트·선택지·연간 결정·아이템을 역추적해 선행 조건·판정 능력치(주사위면 dc+40, 미니게임이면 고정 swing+5, `check.bonus`는 현재 값만큼 뺌)·요구 활동을 하위 목표로 삼는다. 경쟁 엔딩(점수 역전)과 원치 않는 히든 엔딩(선점)은 게이트 근접도로 벌점을 주고, 앞선 점수는 200점까지 선형·그 뒤로 로그로 가치를 매겨 게이트를 일찍 채운 뒤에도 점수를 계속 키운다. 조건 하나만 남은 이벤트는 "그 문턱을 넘으면 열릴 이벤트의 기대 가치"로 미리 피하거나 노리고, 남은 고정 이벤트가 피할 수 없이 더할 값(예: 생일의 신뢰 +4)은 게이트 판정에 미리 더한다. 미니게임 판정에는 점수 0.7(괜찮은 플레이어)을 넣는다. 보호자는 해금 없이 고를 수 있는 기사/학자 중 목표에 맞는 쪽(게이트 플래그가 출신 전용 경로로만 세워지면 그 출신 — 표에 "해금 출신 필요"로 표시), 목표 게이트가 회차 조건(playthrough·legacyCount)을 요구하면 그 회차로 시작한다.
- **2회차 이상 표본** (기본 N/10판): 일반 정책 + 회차 2~(데이터의 회차 조건 최댓값, 최소 4)·이전 회차 딸 = 회차-1명 + 보호자 출신 5종(해금 출신 포함)을 돌아가며. 출신 전용·회차 전용 이벤트의 커버리지 집계에만 쓰고 분포에는 넣지 않는다.
- 커버리지 진단: 매달 실행 직후 상태에서 조건 경로별 나이별 최고·최저값과 플래그·함수 조건의 참/거짓 관측을 기록하고, 미등장 이벤트는 적격이었던 달 수와 "조건 하나만 모자랐던" 달 수(판×달 누적)를 센다.
- seek 판의 시드는 엔딩 id에서 정한다 (`seed + 1,000,000 + (FNV(id) mod 10⁶)×100 + k`). 엔딩이 추가·재배열돼도 기존 엔딩의 결과는 바뀌지 않는다.

