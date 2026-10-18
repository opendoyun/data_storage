# 「별의 공주」 밸런스 보고서 — 엔딩 도달 가능성 · 이벤트 커버리지

> 자동 생성: `node tools/reach.mjs 24 --only=knight_errant` (2026-10-18). 콘텐츠가 들어올 때마다 다시 돌린다. 직접 수정하지 말 것.

- 데이터: 이벤트 **450**개 (core.js 36, b01_childhood.js 28, b02_school_friends.js 28, b03_adolescence.js 30, b04a_careers_body_art.js 28, b04b_careers_mind_faith.js 27, b05_origin.js 29, b06_guardian.js 27, b07_adventure.js 28, b08_work.js 31, b09_education.js 28, b10_seasons.js 27, b11_relationships.js 30, b12_shadows.js 27, b13_mysteries.js 27, b14_legacy.js 19) · 엔딩 **48**종 (히든 8) · 연간 결정 7개 나이 · 아이템 36종
- 실행: seek 24판 × 엔딩 1종 + 일반 정책 2000판 (+ 커버리지용 2회차 이상 200판) · 시드 1 · 보호자 knight/scholar · 미니게임 점수 0.7 · 상점 사용 · 워커 4 · 22.5초

## 요약

| 지표 | 값 | 기준 |
|---|---|---|
| 목표 추구(seek)로 도달한 엔딩 | **1 / 1** (평균 성공률 79.2%) | 전 엔딩 도달 |
| 어떤 방법으로도 도달 못 한 엔딩 | 없음 | 없음 |
| 일반 정책 분포에 나온 엔딩 종류 | 37 / 48 | — |
| 최다 엔딩 점유율 (일반) | 재상 19.5%  | ≤ 20% |
| 월평균 이벤트 (일반 / seek) | 1.53 / 1.56 | ≈ 1.5 |
| 무이벤트 달 비율 · 2달 연속 무이벤트 겪은 판 | 17.3% · 0.0% (최장 1달) | 연속 2달 금지 |
| 이벤트 커버리지 | 450 / 450 (미등장 0) | 전부 등장 |
| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (일반) | 9.5 · 6.4 · 3.04 · 16.4 | — |
| 게임당 거부 · 강행 · 탈진 · 자율 슬롯 (seek) | 10.4 · 0.1 · 0.00 · 4.3 | — |

판정: ✅ seek 성공률 ≥ 50% · 🟡 1~49% · 🟠 seek 0%지만 일반 플레이에서 나옴 · ❌ 도달 못 함. seek 성공률은 "목표를 알고 노리는 플레이어"의 하한 추정이다 (휴리스틱 정책이므로 0%가 곧 불가능은 아니지만, 원인 칸이 막힌 지점을 가리킨다).

## 1. 엔딩 도달 가능성

| | 엔딩 | id | 분류 | seek 성공 | 일반 N판 등장 | 실패 주원인 (seek 실패 판 기준) |
|---|---|---|---|---|---|---|
| — | 여왕 | `queen` | 왕실/정치 | — | 227 (11.3%) |  |
| — | 공작부인 | `duchess` | 왕실/정치 | — | 6 (0.3%) |  |
| — | 외교관 | `diplomat` | 왕실/정치 | — | 114 (5.7%) |  |
| — | 재상 | `chancellor` | 왕실/정치 | — | 390 (19.5%) |  |
| — | 근위기사단장 | `guard_captain` | 무예 | — | 27 (1.4%) |  |
| — | 용병왕 | `mercenary_king` | 무예 | — | 268 (13.4%) |  |
| — | 모험가 | `adventurer` | 무예 | — | 11 (0.5%) |  |
| — | 현상금 사냥꾼 | `bounty_hunter` | 무예 | — | 0 (0.0%) |  |
| — | 대마법사 | `archmage` | 학문/마법 | — | 0 (0.0%) |  |
| — | 왕실학자 | `royal_scholar` | 학문/마법 | — | 1 (0.1%) |  |
| — | 연금술사 | `alchemist` | 학문/마법 | — | 0 (0.0%) |  |
| — | 약초의사 | `herb_doctor` | 학문/마법 | — | 0 (0.0%) |  |
| — | 궁정악사 | `court_musician` | 예술/문화 | — | 165 (8.3%) |  |
| — | 극단 스타 | `stage_star` | 예술/문화 | — | 10 (0.5%) |  |
| — | 화가 | `painter` | 예술/문화 | — | 5 (0.3%) |  |
| — | 작가 | `writer` | 예술/문화 | — | 1 (0.1%) |  |
| — | 대상인 | `merchant_lord` | 생활/상업 | — | 10 (0.5%) |  |
| — | 농장주 | `farm_owner` | 생활/상업 | — | 18 (0.9%) |  |
| — | 요리사 | `chef` | 생활/상업 | — | 12 (0.6%) |  |
| — | 여관 주인 | `innkeeper` | 생활/상업 | — | 2 (0.1%) |  |
| — | 대주교 | `archbishop` | 신앙 | — | 0 (0.0%) |  |
| — | 성녀 | `saint` | 신앙 | — | 174 (8.7%) |  |
| — | 순례자 | `pilgrim` | 신앙 | — | 0 (0.0%) |  |
| — | 암살자 | `assassin` | 어둠 | — | 0 (0.0%) |  |
| — | 도적단 두목 | `bandit_boss` | 어둠 | — | 165 (8.3%) |  |
| — | 사기꾼 | `swindler` | 어둠 | — | 0 (0.0%) |  |
| — | 왕자와의 결혼 | `royal_wedding` | 관계 | — | 7 (0.4%) |  |
| — | 가족 | `family_home` | 관계 | — | 0 (0.0%) |  |
| — | 떠도는 사람 | `drifter` | 관계 | — | 0 (0.0%) |  |
| — | 별의 여신 (히든) | `star_goddess` | 히든 | — | 23 (1.1%) |  |
| — | 세계 여행자 (히든) | `world_traveler` | 히든 | — | 56 (2.8%) |  |
| — | 시간 역행 (히든) | `time_reverse` | 히든 | — | 1 (0.1%) |  |
| — | 선장 | `ship_captain` | 무예 | — | 22 (1.1%) |  |
| ✅ | 편력 기사 | `knight_errant` | 무예 | 19/24 (79%) | 4 (0.2%) | 게이트 flag.knight_oath_wander 5/5 → 대신 mercenary_king 4, astronomer 1 |
| — | 무희 | `prima_dancer` | 예술/문화 | — | 15 (0.8%) |  |
| — | 의상 명인 | `tailor_master` | 예술/문화 | — | 21 (1.1%) |  |
| — | 명장 대장장이 | `master_smith` | 생활/상업 | — | 7 (0.4%) |  |
| — | 마을 선생님 | `village_teacher` | 생활/상업 | — | 30 (1.5%) |  |
| — | 천문학자 | `astronomer` | 학문/마법 | — | 16 (0.8%) |  |
| — | 고아원 원장 | `orphanage_head` | 신앙 | — | 56 (2.8%) |  |
| — | 왕실 첩보원 | `royal_spy` | 어둠 | — | 2 (0.1%) |  |
| — | 영매 | `medium` | 어둠 | — | 14 (0.7%) |  |
| — | 평생의 라이벌 | `rival_partner` | 관계 | — | 40 (2.0%) |  |
| — | 어머니와의 재회 (히든) | `mother_reunion` | 히든 | — | 12 (0.6%) |  |
| — | 용의 친구 (히든) | `dragon_friend` | 히든 | — | 30 (1.5%) |  |
| — | 큐브의 정체 (히든) | `cube_true_form` | 히든 | — | 24 (1.2%) |  |
| — | 보호자의 뒤를 잇다 (히든) | `guardian_successor` | 히든 | — | 14 (0.7%) |  |
| — | 자매들 (히든) | `legacy_sisters` | 히든 | — | 0 (0.0%) |  |

## 2. 엔딩 분포 (일반 정책 10종)

| 순위 | 엔딩 | id | 판 수 | 점유율 | |
|---|---|---|---|---|---|
| 1 | 재상 | `chancellor` | 390 | 19.5% | ██████████ |
| 2 | 용병왕 | `mercenary_king` | 268 | 13.4% | ███████ |
| 3 | 여왕 | `queen` | 227 | 11.3% | ██████ |
| 4 | 성녀 | `saint` | 174 | 8.7% | ████ |
| 5 | 궁정악사 | `court_musician` | 165 | 8.3% | ████ |
| 6 | 도적단 두목 | `bandit_boss` | 165 | 8.3% | ████ |
| 7 | 외교관 | `diplomat` | 114 | 5.7% | ███ |
| 8 | 세계 여행자 | `world_traveler` | 56 | 2.8% | █ |
| 9 | 고아원 원장 | `orphanage_head` | 56 | 2.8% | █ |
| 10 | 평생의 라이벌 | `rival_partner` | 40 | 2.0% | █ |
| 11 | 마을 선생님 | `village_teacher` | 30 | 1.5% | █ |
| 12 | 용의 친구 | `dragon_friend` | 30 | 1.5% | █ |
| 13 | 근위기사단장 | `guard_captain` | 27 | 1.4% | █ |
| 14 | 큐브의 정체 | `cube_true_form` | 24 | 1.2% | █ |
| 15 | 별의 여신 | `star_goddess` | 23 | 1.1% | █ |
| 16 | 선장 | `ship_captain` | 22 | 1.1% | █ |
| 17 | 의상 명인 | `tailor_master` | 21 | 1.1% | █ |
| 18 | 농장주 | `farm_owner` | 18 | 0.9% |  |
| 19 | 천문학자 | `astronomer` | 16 | 0.8% |  |
| 20 | 무희 | `prima_dancer` | 15 | 0.8% |  |
| 21 | 영매 | `medium` | 14 | 0.7% |  |
| 22 | 보호자의 뒤를 잇다 | `guardian_successor` | 14 | 0.7% |  |
| 23 | 요리사 | `chef` | 12 | 0.6% |  |
| 24 | 어머니와의 재회 | `mother_reunion` | 12 | 0.6% |  |
| 25 | 모험가 | `adventurer` | 11 | 0.5% |  |
| 26 | 극단 스타 | `stage_star` | 10 | 0.5% |  |
| 27 | 대상인 | `merchant_lord` | 10 | 0.5% |  |
| 28 | 왕자와의 결혼 | `royal_wedding` | 7 | 0.4% |  |
| 29 | 명장 대장장이 | `master_smith` | 7 | 0.4% |  |
| 30 | 공작부인 | `duchess` | 6 | 0.3% |  |
| 31 | 화가 | `painter` | 5 | 0.3% |  |
| 32 | 편력 기사 | `knight_errant` | 4 | 0.2% |  |
| 33 | 여관 주인 | `innkeeper` | 2 | 0.1% |  |
| 34 | 왕실 첩보원 | `royal_spy` | 2 | 0.1% |  |
| 35 | 왕실학자 | `royal_scholar` | 1 | 0.1% |  |
| 36 | 작가 | `writer` | 1 | 0.1% |  |
| 37 | 시간 역행 | `time_reverse` | 1 | 0.1% |  |

일반 정책에서 한 번도 안 나온 엔딩 (11): `bounty_hunter`, `archmage`, `alchemist`, `herb_doctor`, `archbishop`, `pilgrim`, `assassin`, `swindler`, `family_home`, `drifter`, `legacy_sisters`

### 정책별 지표

| 정책 | 판 | 상위 엔딩 | 거부 | 강행 | 설득 성공 | 탈진 | 자율 슬롯 | 이벤트/월 | 최종 신뢰 | 연간 결정 | 구매 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| random | 200 | 외교관 76, 재상 40, 평생의 라이벌 17 | 0.3 | 0.1 | 0.1 | 0.03 | 11.6 | 1.53 | 99.2 | 7.0 | 8.8 |
| focus_body | 200 | 용병왕 157, 용의 친구 26, 모험가 11 | 27.1 | 9.2 | 3.4 | 0.54 | 2.9 | 1.52 | 91.4 | 7.0 | 15.7 |
| focus_mind | 200 | 재상 147, 큐브의 정체 24, 별의 여신 23 | 0.8 | 0.3 | 0.2 | 0.21 | 2.5 | 1.52 | 99.2 | 7.0 | 5.3 |
| focus_social | 200 | 여왕 193, 공작부인 4, 평생의 라이벌 3 | 0.1 | 0.0 | 0.0 | 0.03 | 2.7 | 1.51 | 99.4 | 7.0 | 12.3 |
| focus_inner | 200 | 성녀 174, 의상 명인 17, 보호자의 뒤를 잇다 9 | 0.1 | 0.0 | 0.0 | 0.00 | 3.0 | 1.54 | 99.3 | 7.0 | 10.4 |
| balanced | 200 | 용병왕 80, 여왕 34, 근위기사단장 20 | 2.1 | 0.6 | 0.4 | 0.01 | 0.0 | 1.51 | 98.9 | 7.0 | 3.5 |
| hands_off | 200 | 세계 여행자 55, 궁정악사 54, 재상 20 | 0.0 | 0.0 | 0.0 | 0.00 | 100.2 | 1.54 | 99.7 | 7.0 | 6.9 |
| tyrant | 200 | 재상 181, 외교관 17, 용병왕 2 | 48.1 | 48.1 | 0.0 | 28.50 | 0.0 | 1.49 | 12.8 | 7.0 | 0.3 |
| shadow | 200 | 도적단 두목 165, 용병왕 29, 대상인 5 | 16.2 | 5.5 | 3.7 | 1.10 | 0.0 | 1.58 | 98.6 | 7.0 | 16.8 |
| nurture | 200 | 궁정악사 92, 고아원 원장 56, 마을 선생님 30 | 0.0 | 0.0 | 0.0 | 0.00 | 40.7 | 1.58 | 99.9 | 7.0 | 7.3 |

## 3. 이벤트 밀도

목표: 월평균 1.5회, 무이벤트 달 연속 2회 이상 금지 (GDD 2).

| 나이 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 전체 |
|---|---|---|---|---|---|---|---|---|---|
| 일반 이벤트/월 | 1.54 | 1.46 | 1.49 | 1.46 | 1.53 | 1.52 | 1.57 | 1.69 | **1.53** |
| seek 이벤트/월 | 1.67 | 1.55 | 1.49 | 1.46 | 1.51 | 1.55 | 1.59 | 1.68 | **1.56** |

- 무이벤트 달: 일반 17.3% (2달 연속을 겪은 판 0.0%, 최장 1달) · seek 16.8% (최장 1달)
- 연쇄 순환 보호(한 달 20건 초과) 발동: 일반 0회 · seek 0회
- seek가 미니게임 점수(0.7)를 쓴 판정: 판당 3.3회

## 4. 이벤트 커버리지 — 미등장 0개 / 전체 450개

모든 판(seek + 일반 + 2회차 이상 표본)을 합쳐 한 번도 나오지 않은 이벤트. 진단은 이벤트 나이 창 안에서 관측된 최고·최저 상태로 각 조건을 따로 평가한 결과다 (개별로는 통과해도 동시에 맞지 않을 수 있음).

모든 이벤트가 최소 한 번 등장했다. ✅

### 2회차 이상 표본에서만 나온 이벤트 (회차 조건 · 해금 보호자 출신 전용)

`b06_merchant_loan` (b06_guardian.js, 29판) · `b06_merchant_haggle` (b06_guardian.js, 35판) · `b06_priest_firewood` (b06_guardian.js, 30판) · `b06_priest_rites` (b06_guardian.js, 30판) · `b06_adv_map` (b06_guardian.js, 34판) · `b06_adv_reunion` (b06_guardian.js, 31판) · `b14_doorframe` (b14_legacy.js, 156판) · `b14_lullaby` (b14_legacy.js, 122판) · `b14_recipe_card` (b14_legacy.js, 152판) · `b14_same_question` (b14_legacy.js, 125판) · `b14_elda_slip` (b14_legacy.js, 99판) · `b14_cube_counts` (b14_legacy.js, 126판) · `b14_known_trail` (b14_legacy.js, 37판) · `b14_trail_cache` (b14_legacy.js, 15판) · `b14_familiar_face` (b14_legacy.js, 172판) · `b14_her_tea` (b14_legacy.js, 124판) · `b14_her_keepsake` (b14_legacy.js, 124판) · `b14_dream_life` (b14_legacy.js, 79판) · `b14_floor_box` (b14_legacy.js, 49판) · `b14_borrowed_name` (b14_legacy.js, 104판) · `b14_guardian_dream` (b14_legacy.js, 108판) · `b14_sisters_letter` (b14_legacy.js, 108판) · `b14_sisters_field` (b14_legacy.js, 86판) · `b14_sisters_dawn` (b14_legacy.js, 86판) · `b14_extra_stars` (b14_legacy.js, 84판)

### 드물게 나온 이벤트 (반복 불가 이벤트 중 등장 판 비율 하위)

| 이벤트 | 파일 | 등장 판 비율 |
|---|---|---|
| `b04a_smith_second_fire` | b04a_careers_body_art.js | 0.04% |
| `b12_two_reports` | b12_shadows.js | 0.49% |
| `b14_trail_cache` | b14_legacy.js | 0.67% |
| `b07_bounty_fox` | b07_adventure.js | 0.99% |
| `b12_false_pedigree` | b12_shadows.js | 1.08% |
| `b13_cube_book` | b13_mysteries.js | 1.21% |
| `b06_merchant_loan` | b06_guardian.js | 1.30% |
| `b06_priest_firewood` | b06_guardian.js | 1.35% |
| `b06_priest_rites` | b06_guardian.js | 1.35% |
| `b07_dragon_sky` | b07_adventure.js | 1.35% |
| `b06_adv_reunion` | b06_guardian.js | 1.39% |
| `b07_ruins_deep` | b07_adventure.js | 1.48% |

### 선택지 커버리지 공백 (27건)

등장한 이벤트 중 한 번도 고르지 않은 선택지, 또는 20회 이상 골랐는데 판정이 한쪽으로만 나온 선택지.

| 이벤트 | 선택지 | 내용 |
|---|---|---|
| `b01_lie_amends` | 3. 장부에 빚을 적게 한다 | 선택된 적 없음 (조건 guardian == 'merchant') |
| `b02_star_rumor` | 4. 숨기라던 말을 거둔다 | 선택된 적 없음 (조건 flag.magic_hidden) |
| `b04a_smith_second_fire` | 1. 작은 단검을 벼린다 | 선택된 적 없음 |
| `b04a_smith_second_fire` | 3. 이제 그만 쉬자 | 선택된 적 없음 |
| `b04a_smith_second_fire` | 4. 처음 별철을 안던 날처럼 | 선택된 적 없음 (조건 flag.b04a_star_blessed) |
| `b04b_pilgrim_blister` | 4. 산길 지름길을 그려 보낸다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b05_doubt_receipt` | 4. 계약서 조항을 함께 따진다 | 선택된 적 없음 (조건 guardian == 'merchant') |
| `b05_north_again` | 2. 근위대 문장으로 역마차를 얻는다 | 선택된 적 없음 (조건 flag.b05_royal_token) |
| `b06_name_evidence` | 4. 물려받은 지도를 펼친다 | 선택된 적 없음 (조건 flag.b06_map_given) |
| `b07_ruins_deep` | 1. 횃불을 들고 내려간다 | 판정 실패 0/22 (dc 210) |
| `b07_ruins_deep` | 3. 미라를 불러 함께 간다 | 선택된 적 없음 (조건 flag.b07_mira) |
| `b07_guild_board` | 4. 닳은 은패를 내민다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b07_cairn_journal` | 4. 모험가의 작별 인사를 한다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b07_blizzard_pass` | 3. 다 함께 밤을 버틴다 | 판정 실패 0/24 (dc 150) |
| `b07_adventurer_road` | 4. 낡은 나침반을 물려준다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b08_diner_market` | 4. 옛 거래처 어부를 찾아가렴 | 선택된 적 없음 (조건 guardian == 'merchant') |
| `b09_garrett_footwork` | 3. 산길을 같이 걷자 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b09_theo_question` | 3. 사제였던 당신이 답한다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b09_commerce_ledger` | 4. 길드장에게 직접 가져간다 | 선택된 적 없음 (조건 flag.b09_guild_visit) |
| `b10_snow_letter_again` | 4. 어디서든 부쳐 달라고 한다 | 선택된 적 없음 (조건 age >= 16) |
| `b10_summer_porch` | 4. 짧은 밤 기도를 가르친다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b11_leon_court_dinner` | 4. 상인의 눈으로 귀띔한다 | 선택된 적 없음 (조건 guardian == 'merchant') |
| `b12_bell_coat` | 4. 참새단을 성당 급식소로 부른다 | 선택된 적 없음 (조건 guardian == 'priest') |
| `b12_two_reports` | 4. 로웬에게 셋째 달로 오라고 한다 | 선택된 적 없음 (조건 flag.b12_rowen_talk) |
| `b13_cube_book` | 4. 부엌에서 부른 그 노래를 청한다 | 선택된 적 없음 (조건 flag.b13_cube_sang) |
| `b14_known_trail` | 4. 옛 모험가식으로 표식을 읽는다 | 선택된 적 없음 (조건 guardian == 'adventurer') |
| `b14_trail_cache` | 4. 꾸러미에 남은 별빛을 읽는다 | 선택된 적 없음 (조건 stat.mag >= 150) |

## 방법

- **일반 정책 10종** (`random` `focus_body` `focus_mind` `focus_social` `focus_inner` `balanced` `hands_off` `tyrant` `shadow` `nurture`): v0.1 시뮬레이터와 같은 스케줄·거부·이벤트 규칙 + 연간 결정(정책 성향대로)·상점(가끔, 성향에 맞는 물건). 시드 `seed..seed+N-1`, 보호자는 기사/학자 무작위.
- **seek:<엔딩>**: 엔딩의 gates·bonus 조건을 파싱해 부족분을 정규화한 효용 함수로 매 결정을 1수 앞보기한다. 활동 3슬롯(엔진 효과 근사 + 월말 정산 예측), 거부 대응(수용/설득 확률/강행 기대값), 이벤트 선택(판정 성공·실패 기대값, `next` 연쇄까지 최대 4단 앞보기), 연간 결정, 상점 구매. 필요한 플래그는 그 플래그를 세우는 이벤트·선택지·연간 결정·아이템을 역추적해 선행 조건·판정 능력치(주사위면 dc+40, 미니게임이면 고정 swing+5, `check.bonus`는 현재 값만큼 뺌)·요구 활동을 하위 목표로 삼는다. 경쟁 엔딩(점수 역전)과 원치 않는 히든 엔딩(선점)은 게이트 근접도로 벌점을 주고, 앞선 점수는 200점까지 선형·그 뒤로 로그로 가치를 매겨 게이트를 일찍 채운 뒤에도 점수를 계속 키운다. 조건 하나만 남은 이벤트는 "그 문턱을 넘으면 열릴 이벤트의 기대 가치"로 미리 피하거나 노리고, 남은 고정 이벤트가 피할 수 없이 더할 값(예: 생일의 신뢰 +4)은 게이트 판정에 미리 더한다. 미니게임 판정에는 점수 0.7(괜찮은 플레이어)을 넣는다. 보호자는 해금 없이 고를 수 있는 기사/학자 중 목표에 맞는 쪽(게이트 플래그가 출신 전용 경로로만 세워지면 그 출신 — 표에 "해금 출신 필요"로 표시), 목표 게이트가 회차 조건(playthrough·legacyCount)을 요구하면 그 회차로 시작한다.
- **2회차 이상 표본** (기본 N/10판): 일반 정책 + 회차 2~(데이터의 회차 조건 최댓값, 최소 4)·이전 회차 딸 = 회차-1명 + 보호자 출신 5종(해금 출신 포함)을 돌아가며. 출신 전용·회차 전용 이벤트의 커버리지 집계에만 쓰고 분포에는 넣지 않는다.
- 커버리지 진단: 매달 실행 직후 상태에서 조건 경로별 나이별 최고·최저값과 플래그·함수 조건의 참/거짓 관측을 기록하고, 미등장 이벤트는 적격이었던 달 수와 "조건 하나만 모자랐던" 달 수(판×달 누적)를 센다.
- seek 판의 시드는 엔딩 id에서 정한다 (`seed + 1,000,000 + (FNV(id) mod 10⁶)×100 + k`). 엔딩이 추가·재배열돼도 기존 엔딩의 결과는 바뀌지 않는다.

