# 제미나이 이미지 배치 목록 — 「별의 공주」

> **자동 생성 파일** — `node tools/gemini/chrome-batch.mjs` (원본 `assets/manifest.json` ← `tools/gemini/build-manifest.mjs`). 직접 고치지 마세요.
> 공주 외형 기준: `docs/game-design/character-design.md` · 전체 절차와 QA: `docs/game-design/gemini-chrome-runbook.md`

전체 116장 (캐릭터 시트 1 · 공주 초상 20 · NPC 초상 12 · 배경 32 · 엔딩 일러스트 49 · UI 2). API 키가 있으면 이 목록 대신 `node tools/gemini/generate.mjs` 한 줄로 같은 프롬프트가 자동 실행됩니다.

## 사용법 (사람 · Claude in Chrome 공통)

1. Chrome에서 **gemini.google.com** → 새 채팅. 이미지 생성이 되는 모델(이미지 만들기 도구)을 고른다.
2. **§0 스타일 앵커**를 첫 메시지로 보낸다.
3. **#1 캐릭터 시트**를 만든다. 공주 외형 기준(은백색 긴 생머리·붉은 눈·흑백 의상·금색 4각 별)과 맞을 때까지 다듬는다. 이후 모든 공주 그림의 기준이므로 사람이 한 번 확인한다.
4. #2부터 **번호 순서대로**: ① 「첨부」의 파일을 업로드 → ② 「프롬프트」 블록 전체를 붙여넣기 → ③ 생성 → ④ 다운로드 → ⑤ 저장 명령 실행:
   `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=<키>` (가운데 기준으로 비율을 맞춰 자르고 정확한 크기로 `game/assets/<키>.png`에 저장)
5. 마음에 안 들면 같은 채팅에서 **차이만** 말해 재생성 ("같은 구도로, 머리를 더 길게"). 2번 해도 안 되면 건너뛰고 기록.
6. 15장쯤마다 새 채팅 → §0 앵커 다시 보내기 → 캐릭터 시트를 첨부해 이어서 진행 (스타일 표류 방지).
7. 진행 확인: `node tools/gemini/fit.mjs --check` (빠진 것·크기 틀린 것·다음에 그릴 번호).

## §0 스타일 앵커 (새 채팅 첫 메시지)

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.

이 대화에서 내가 보내는 이미지 요청은 모두 위 스타일을 따라줘. 이번 메시지에는 그림을 그리지 말고 "준비됨"이라고만 답해줘.
```

## 진행 표

| # | 키 | 저장 경로 | 크기 (비율) | 첨부 |
|---:|---|---|---|---|
| 1 | `ref/luna_sheet` | `game/assets/ref/luna_sheet.png` | 1600×900 (16:9) | — |
| 2 | `char/child_body` | `game/assets/char/child_body.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 3 | `char/child_mind` | `game/assets/char/child_mind.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 4 | `char/child_social` | `game/assets/char/child_social.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 5 | `char/child_inner` | `game/assets/char/child_inner.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 6 | `char/girl_body` | `game/assets/char/girl_body.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 7 | `char/girl_mind` | `game/assets/char/girl_mind.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 8 | `char/girl_social` | `game/assets/char/girl_social.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 9 | `char/girl_inner` | `game/assets/char/girl_inner.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 10 | `char/teen_body` | `game/assets/char/teen_body.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 11 | `char/teen_mind` | `game/assets/char/teen_mind.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 12 | `char/teen_social` | `game/assets/char/teen_social.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 13 | `char/teen_inner` | `game/assets/char/teen_inner.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 14 | `char/youth_body` | `game/assets/char/youth_body.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 15 | `char/youth_mind` | `game/assets/char/youth_mind.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 16 | `char/youth_social` | `game/assets/char/youth_social.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 17 | `char/youth_inner` | `game/assets/char/youth_inner.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 18 | `char/adult_body` | `game/assets/char/adult_body.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 19 | `char/adult_mind` | `game/assets/char/adult_mind.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 20 | `char/adult_social` | `game/assets/char/adult_social.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 21 | `char/adult_inner` | `game/assets/char/adult_inner.png` | 768×1040 (3:4) | `ref/luna_sheet` |
| 22 | `npc/cube` | `game/assets/npc/cube.png` | 1280×560 (16:7) | — |
| 23 | `npc/loren` | `game/assets/npc/loren.png` | 1280×560 (16:7) | — |
| 24 | `npc/garrett` | `game/assets/npc/garrett.png` | 1280×560 (16:7) | — |
| 25 | `npc/elda` | `game/assets/npc/elda.png` | 1280×560 (16:7) | — |
| 26 | `npc/leon` | `game/assets/npc/leon.png` | 1280×560 (16:7) | — |
| 27 | `npc/theodora` | `game/assets/npc/theodora.png` | 1280×560 (16:7) | — |
| 28 | `npc/envoy` | `game/assets/npc/envoy.png` | 1280×560 (16:7) | — |
| 29 | `npc/archbishop` | `game/assets/npc/archbishop.png` | 1280×560 (16:7) | — |
| 30 | `npc/guildmaster` | `game/assets/npc/guildmaster.png` | 1280×560 (16:7) | — |
| 31 | `npc/shadow` | `game/assets/npc/shadow.png` | 1280×560 (16:7) | — |
| 32 | `npc/troupe` | `game/assets/npc/troupe.png` | 1280×560 (16:7) | — |
| 33 | `npc/knight_cpt` | `game/assets/npc/knight_cpt.png` | 1280×560 (16:7) | — |
| 34 | `bg/room_spring` | `game/assets/bg/room_spring.png` | 1280×560 (16:7) | — |
| 35 | `bg/room_summer` | `game/assets/bg/room_summer.png` | 1280×560 (16:7) | `bg/room_spring` |
| 36 | `bg/room_autumn` | `game/assets/bg/room_autumn.png` | 1280×560 (16:7) | `bg/room_spring` |
| 37 | `bg/room_winter` | `game/assets/bg/room_winter.png` | 1280×560 (16:7) | `bg/room_spring` |
| 38 | `bg/festival_spring` | `game/assets/bg/festival_spring.png` | 1280×560 (16:7) | — |
| 39 | `bg/school` | `game/assets/bg/school.png` | 1280×560 (16:7) | — |
| 40 | `bg/festival_harvest` | `game/assets/bg/festival_harvest.png` | 1280×560 (16:7) | — |
| 41 | `bg/starnight` | `game/assets/bg/starnight.png` | 1280×560 (16:7) | — |
| 42 | `bg/market` | `game/assets/bg/market.png` | 1280×560 (16:7) | — |
| 43 | `bg/harbor` | `game/assets/bg/harbor.png` | 1280×560 (16:7) | — |
| 44 | `bg/tower` | `game/assets/bg/tower.png` | 1280×560 (16:7) | — |
| 45 | `bg/church` | `game/assets/bg/church.png` | 1280×560 (16:7) | — |
| 46 | `bg/forest` | `game/assets/bg/forest.png` | 1280×560 (16:7) | — |
| 47 | `bg/ruins` | `game/assets/bg/ruins.png` | 1280×560 (16:7) | — |
| 48 | `bg/castle_hall` | `game/assets/bg/castle_hall.png` | 1280×560 (16:7) | — |
| 49 | `bg/ballroom` | `game/assets/bg/ballroom.png` | 1280×560 (16:7) | — |
| 50 | `bg/tavern_inn` | `game/assets/bg/tavern_inn.png` | 1280×560 (16:7) | — |
| 51 | `bg/graveyard_night` | `game/assets/bg/graveyard_night.png` | 1280×560 (16:7) | — |
| 52 | `bg/wheat_field` | `game/assets/bg/wheat_field.png` | 1280×560 (16:7) | — |
| 53 | `bg/theater_stage` | `game/assets/bg/theater_stage.png` | 1280×560 (16:7) | — |
| 54 | `bg/library` | `game/assets/bg/library.png` | 1280×560 (16:7) | — |
| 55 | `bg/smithy` | `game/assets/bg/smithy.png` | 1280×560 (16:7) | — |
| 56 | `bg/etiquette_school` | `game/assets/bg/etiquette_school.png` | 1280×560 (16:7) | — |
| 57 | `bg/elda_hut` | `game/assets/bg/elda_hut.png` | 1280×560 (16:7) | — |
| 58 | `bg/training_yard` | `game/assets/bg/training_yard.png` | 1280×560 (16:7) | — |
| 59 | `bg/river` | `game/assets/bg/river.png` | 1280×560 (16:7) | — |
| 60 | `bg/night_market` | `game/assets/bg/night_market.png` | 1280×560 (16:7) | — |
| 61 | `bg/road` | `game/assets/bg/road.png` | 1280×560 (16:7) | — |
| 62 | `bg/snow_village` | `game/assets/bg/snow_village.png` | 1280×560 (16:7) | — |
| 63 | `bg/sickroom` | `game/assets/bg/sickroom.png` | 1280×560 (16:7) | — |
| 64 | `bg/guild_hall` | `game/assets/bg/guild_hall.png` | 1280×560 (16:7) | — |
| 65 | `bg/throne_room` | `game/assets/bg/throne_room.png` | 1280×560 (16:7) | — |
| 66 | `ending/queen` | `game/assets/ending/queen.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 67 | `ending/duchess` | `game/assets/ending/duchess.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 68 | `ending/diplomat` | `game/assets/ending/diplomat.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 69 | `ending/chancellor` | `game/assets/ending/chancellor.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 70 | `ending/guard_captain` | `game/assets/ending/guard_captain.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 71 | `ending/mercenary_king` | `game/assets/ending/mercenary_king.png` | 1280×720 (16:9) | `ref/luna_sheet`, `npc/garrett` |
| 72 | `ending/adventurer` | `game/assets/ending/adventurer.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 73 | `ending/bounty_hunter` | `game/assets/ending/bounty_hunter.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 74 | `ending/archmage` | `game/assets/ending/archmage.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 75 | `ending/royal_scholar` | `game/assets/ending/royal_scholar.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 76 | `ending/alchemist` | `game/assets/ending/alchemist.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 77 | `ending/herb_doctor` | `game/assets/ending/herb_doctor.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 78 | `ending/court_musician` | `game/assets/ending/court_musician.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 79 | `ending/stage_star` | `game/assets/ending/stage_star.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 80 | `ending/painter` | `game/assets/ending/painter.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 81 | `ending/writer` | `game/assets/ending/writer.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 82 | `ending/merchant_lord` | `game/assets/ending/merchant_lord.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 83 | `ending/farm_owner` | `game/assets/ending/farm_owner.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 84 | `ending/chef` | `game/assets/ending/chef.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 85 | `ending/innkeeper` | `game/assets/ending/innkeeper.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 86 | `ending/archbishop` | `game/assets/ending/archbishop.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 87 | `ending/saint` | `game/assets/ending/saint.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 88 | `ending/pilgrim` | `game/assets/ending/pilgrim.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 89 | `ending/assassin` | `game/assets/ending/assassin.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 90 | `ending/bandit_boss` | `game/assets/ending/bandit_boss.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 91 | `ending/swindler` | `game/assets/ending/swindler.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 92 | `ending/royal_wedding` | `game/assets/ending/royal_wedding.png` | 1280×720 (16:9) | `ref/luna_sheet`, `npc/leon` |
| 93 | `ending/family_home` | `game/assets/ending/family_home.png` | 1280×720 (16:9) | `ref/luna_sheet`, `npc/cube` |
| 94 | `ending/drifter` | `game/assets/ending/drifter.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 95 | `ending/star_goddess` | `game/assets/ending/star_goddess.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 96 | `ending/world_traveler` | `game/assets/ending/world_traveler.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 97 | `ending/time_reverse` | `game/assets/ending/time_reverse.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 98 | `ending/ship_captain` | `game/assets/ending/ship_captain.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 99 | `ending/knight_errant` | `game/assets/ending/knight_errant.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 100 | `ending/prima_dancer` | `game/assets/ending/prima_dancer.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 101 | `ending/tailor_master` | `game/assets/ending/tailor_master.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 102 | `ending/master_smith` | `game/assets/ending/master_smith.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 103 | `ending/village_teacher` | `game/assets/ending/village_teacher.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 104 | `ending/astronomer` | `game/assets/ending/astronomer.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 105 | `ending/orphanage_head` | `game/assets/ending/orphanage_head.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 106 | `ending/royal_spy` | `game/assets/ending/royal_spy.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 107 | `ending/medium` | `game/assets/ending/medium.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 108 | `ending/rival_partner` | `game/assets/ending/rival_partner.png` | 1280×720 (16:9) | `ref/luna_sheet`, `npc/theodora` |
| 109 | `ending/mother_reunion` | `game/assets/ending/mother_reunion.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 110 | `ending/dragon_friend` | `game/assets/ending/dragon_friend.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 111 | `ending/cube_true_form` | `game/assets/ending/cube_true_form.png` | 1280×720 (16:9) | `ref/luna_sheet`, `npc/cube` |
| 112 | `ending/guardian_successor` | `game/assets/ending/guardian_successor.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 113 | `ending/legacy_sisters` | `game/assets/ending/legacy_sisters.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 114 | `ending/ordinary_days` | `game/assets/ending/ordinary_days.png` | 1280×720 (16:9) | `ref/luna_sheet` |
| 115 | `ui/title_key` | `game/assets/ui/title_key.png` | 1600×900 (16:9) | `ref/luna_sheet` |
| 116 | `ui/album_cover` | `game/assets/ui/album_cover.png` | 1600×900 (16:9) | — |

---

## 캐릭터 시트

### #1 · `ref/luna_sheet` — 루나 캐릭터 시트 (10·12·14·16·18세)

- **저장**: `game/assets/ref/luna_sheet.png` · 1600×900 px · 목표 비율 16:9
- **첨부**: 없음. 사용자가 준 공주 레퍼런스 그림이 있으면 함께 첨부하되, 머리색·눈색·색 체계 참고용으로만 쓰라고 덧붙인다 (화풍·구도 복제 금지).
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ref/luna_sheet`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ref/luna_sheet · 루나 캐릭터 시트 (일관성 기준, 가장 먼저 생성)]
Character reference sheet: the same girl Luna at 5 ages standing side by side in one row, left to right from youngest to oldest, each a little taller:
  - age 10: a 10-year-old child: round soft face, big head relative to body, short limbs, small child stature, innocent look
  - age 12: a 12-year-old girl: still a child's face, slightly longer limbs than at 10, slim child build
  - age 14: a 14-year-old young teen girl: youthful face, slender youthful build, no adult curves
  - age 16: a 16-year-old teenage girl: youthful teen proportions, graceful but modest
  - age 18: an 18-year-old young woman on the verge of adulthood: youthful face, elegant yet plain and modest
Full body, front view, relaxed neutral standing pose with arms at the sides, gentle neutral expression, feet visible.
All ages wear the same everyday outfit: white ribbed high-neck long-sleeved knit, ankle-length black skirt with no slit, black flat shoes, silver star hairpin. A few small gold four-point star sparkles around them.
Plain flat light-grey background, even soft lighting. Draw the face, bangs, side locks and crimson eyes very clearly — this sheet is attached to every later image as the identity reference.
No text, no name labels, no age numbers, no measurement lines.
[FORMAT] landscape (가로) 16:9 — final file 1600×900 px.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, the 10-, 12- and 14-year-olds drawn with teenage or adult proportions, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, different outfits per age, different faces per age, height chart, model sheet annotations
```

---

## 공주 초상

### #2 · `char/child_body` — 루나 10세 유년기 · 신체

- **저장**: `game/assets/char/child_body.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/child_body`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/child_body · 루나 10세 유년기 초상 · 신체(body) 계열]
Luna as a 10-year-old child: round soft face, big head relative to body, short limbs, small child stature, innocent look. (나이 10세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (신체): loose black training tunic (not tight) over white shirt sleeves, leather bracers on the forearms, black trousers and boots. Accent colour: crimson red (진홍) only, on the black-and-white base.
Props & pose: a wooden practice sword (목검); standing tall and confident, proud smile. Detail: the wooden sword is a bit too big for her; small tunic; plaster on one cheek, cheerful grin
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 10.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #3 · `char/child_mind` — 루나 10세 유년기 · 지성

- **저장**: `game/assets/char/child_mind.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/child_mind`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/child_mind · 루나 10세 유년기 초상 · 지성(mind) 계열]
Luna as a 10-year-old child: round soft face, big head relative to body, short limbs, small child stature, innocent look. (나이 10세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (지성): black scholar's robe over a white high-neck knit sweater. Accent colour: indigo-violet (남보라) only, on the black-and-white base.
Props & pose: a thick book held in one arm, a tiny star-light spell glowing at her fingertip; calm, intelligent expression. Detail: the book is almost as big as her torso; curious wide eyes
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 10.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #4 · `char/child_social` — 루나 10세 유년기 · 사교

- **저장**: `game/assets/char/child_social.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/child_social`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/child_social · 루나 10세 유년기 초상 · 사교(social) 계열]
Luna as a 10-year-old child: round soft face, big head relative to body, short limbs, small child stature, innocent look. (나이 10세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (사교): white ribbed high-neck knit sweater with long sleeves + ankle-length black long skirt with NO slit, black flat shoes. Accent colour: gold (금색) only, on the black-and-white base.
Props & pose: one hand lightly raised as gold sparkles land on her fingers; graceful, elegant, soft smile. Detail: small black ribbon in the hair; tiny curtsy-like pose, a little shy
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 10.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #5 · `char/child_inner` — 루나 10세 유년기 · 내면

- **저장**: `game/assets/char/child_inner.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/child_inner`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/child_inner · 루나 10세 유년기 초상 · 내면(inner) 계열]
Luna as a 10-year-old child: round soft face, big head relative to body, short limbs, small child stature, innocent look. (나이 10세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (내면): long white robe with a black shawl over the shoulders, a small gold pendant. Accent colour: green (녹색) only, on the black-and-white base.
Props & pose: a bundle of herbs (or a small lute); serene, peaceful expression, soft glow behind her. Detail: a small basket of herbs held with both hands
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 10.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #6 · `char/girl_body` — 루나 12세 소녀기 · 신체

- **저장**: `game/assets/char/girl_body.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/girl_body`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/girl_body · 루나 12세 소녀기 초상 · 신체(body) 계열]
Luna as a 12-year-old girl: still a child's face, slightly longer limbs than at 10, slim child build. (나이 12세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (신체): loose black training tunic (not tight) over white shirt sleeves, leather bracers on the forearms, black trousers and boots. Accent colour: crimson red (진홍) only, on the black-and-white base.
Props & pose: a wooden practice sword (목검); standing tall and confident, proud smile. Detail: wooden sword resting on the shoulder, determined look
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 12.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #7 · `char/girl_mind` — 루나 12세 소녀기 · 지성

- **저장**: `game/assets/char/girl_mind.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/girl_mind`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/girl_mind · 루나 12세 소녀기 초상 · 지성(mind) 계열]
Luna as a 12-year-old girl: still a child's face, slightly longer limbs than at 10, slim child build. (나이 12세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (지성): black scholar's robe over a white high-neck knit sweater. Accent colour: indigo-violet (남보라) only, on the black-and-white base.
Props & pose: a thick book held in one arm, a tiny star-light spell glowing at her fingertip; calm, intelligent expression. Detail: reading while walking, a quill tucked behind the ear
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 12.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #8 · `char/girl_social` — 루나 12세 소녀기 · 사교

- **저장**: `game/assets/char/girl_social.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/girl_social`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/girl_social · 루나 12세 소녀기 초상 · 사교(social) 계열]
Luna as a 12-year-old girl: still a child's face, slightly longer limbs than at 10, slim child build. (나이 12세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (사교): white ribbed high-neck knit sweater with long sleeves + ankle-length black long skirt with NO slit, black flat shoes. Accent colour: gold (금색) only, on the black-and-white base.
Props & pose: one hand lightly raised as gold sparkles land on her fingers; graceful, elegant, soft smile. Detail: practising a polite greeting, hands neatly folded
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 12.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #9 · `char/girl_inner` — 루나 12세 소녀기 · 내면

- **저장**: `game/assets/char/girl_inner.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/girl_inner`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/girl_inner · 루나 12세 소녀기 초상 · 내면(inner) 계열]
Luna as a 12-year-old girl: still a child's face, slightly longer limbs than at 10, slim child build. (나이 12세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (내면): long white robe with a black shawl over the shoulders, a small gold pendant. Accent colour: green (녹색) only, on the black-and-white base.
Props & pose: a bundle of herbs (or a small lute); serene, peaceful expression, soft glow behind her. Detail: holding a sprig of chamomile, gentle smile
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 12.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #10 · `char/teen_body` — 루나 14세 사춘기 · 신체

- **저장**: `game/assets/char/teen_body.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/teen_body`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/teen_body · 루나 14세 사춘기 초상 · 신체(body) 계열]
Luna as a 14-year-old young teen girl: youthful face, slender youthful build, no adult curves. (나이 14세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (신체): loose black training tunic (not tight) over white shirt sleeves, leather bracers on the forearms, black trousers and boots. Accent colour: crimson red (진홍) only, on the black-and-white base.
Props & pose: a wooden practice sword (목검); standing tall and confident, proud smile. Detail: gripping the wooden sword in a ready stance (not pointed at viewer), focused eyes
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 14.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #11 · `char/teen_mind` — 루나 14세 사춘기 · 지성

- **저장**: `game/assets/char/teen_mind.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/teen_mind`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/teen_mind · 루나 14세 사춘기 초상 · 지성(mind) 계열]
Luna as a 14-year-old young teen girl: youthful face, slender youthful build, no adult curves. (나이 14세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (지성): black scholar's robe over a white high-neck knit sweater. Accent colour: indigo-violet (남보라) only, on the black-and-white base.
Props & pose: a thick book held in one arm, a tiny star-light spell glowing at her fingertip; calm, intelligent expression. Detail: a faint violet magic circle under her fingertip, book open
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 14.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #12 · `char/teen_social` — 루나 14세 사춘기 · 사교

- **저장**: `game/assets/char/teen_social.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/teen_social`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/teen_social · 루나 14세 사춘기 초상 · 사교(social) 계열]
Luna as a 14-year-old young teen girl: youthful face, slender youthful build, no adult curves. (나이 14세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (사교): white ribbed high-neck knit sweater with long sleeves + ankle-length black long skirt with NO slit, black flat shoes. Accent colour: gold (금색) only, on the black-and-white base.
Props & pose: one hand lightly raised as gold sparkles land on her fingers; graceful, elegant, soft smile. Detail: turning slightly as if about to greet someone, hair swaying
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 14.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #13 · `char/teen_inner` — 루나 14세 사춘기 · 내면

- **저장**: `game/assets/char/teen_inner.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/teen_inner`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/teen_inner · 루나 14세 사춘기 초상 · 내면(inner) 계열]
Luna as a 14-year-old young teen girl: youthful face, slender youthful build, no adult curves. (나이 14세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (내면): long white robe with a black shawl over the shoulders, a small gold pendant. Accent colour: green (녹색) only, on the black-and-white base.
Props & pose: a bundle of herbs (or a small lute); serene, peaceful expression, soft glow behind her. Detail: eyes half closed as if listening to the wind, herbs in hand
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 14.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #14 · `char/youth_body` — 루나 16세 청년기 · 신체

- **저장**: `game/assets/char/youth_body.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/youth_body`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/youth_body · 루나 16세 청년기 초상 · 신체(body) 계열]
Luna as a 16-year-old teenage girl: youthful teen proportions, graceful but modest. (나이 16세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (신체): loose black training tunic (not tight) over white shirt sleeves, leather bracers on the forearms, black trousers and boots. Accent colour: crimson red (진홍) only, on the black-and-white base.
Props & pose: a wooden practice sword (목검); standing tall and confident, proud smile. Detail: wooden sword lowered at her side, calm confidence, light dust in the air
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 16.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #15 · `char/youth_mind` — 루나 16세 청년기 · 지성

- **저장**: `game/assets/char/youth_mind.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/youth_mind`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/youth_mind · 루나 16세 청년기 초상 · 지성(mind) 계열]
Luna as a 16-year-old teenage girl: youthful teen proportions, graceful but modest. (나이 16세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (지성): black scholar's robe over a white high-neck knit sweater. Accent colour: indigo-violet (남보라) only, on the black-and-white base.
Props & pose: a thick book held in one arm, a tiny star-light spell glowing at her fingertip; calm, intelligent expression. Detail: several small books floating around her, star-light spell brighter
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 16.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #16 · `char/youth_social` — 루나 16세 청년기 · 사교

- **저장**: `game/assets/char/youth_social.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/youth_social`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/youth_social · 루나 16세 청년기 초상 · 사교(social) 계열]
Luna as a 16-year-old teenage girl: youthful teen proportions, graceful but modest. (나이 16세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (사교): white ribbed high-neck knit sweater with long sleeves + ankle-length black long skirt with NO slit, black flat shoes. Accent colour: gold (금색) only, on the black-and-white base.
Props & pose: one hand lightly raised as gold sparkles land on her fingers; graceful, elegant, soft smile. Detail: poised posture, gold sparkles gathering on her raised hand
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 16.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #17 · `char/youth_inner` — 루나 16세 청년기 · 내면

- **저장**: `game/assets/char/youth_inner.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/youth_inner`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/youth_inner · 루나 16세 청년기 초상 · 내면(inner) 계열]
Luna as a 16-year-old teenage girl: youthful teen proportions, graceful but modest. (나이 16세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (내면): long white robe with a black shawl over the shoulders, a small gold pendant. Accent colour: green (녹색) only, on the black-and-white base.
Props & pose: a bundle of herbs (or a small lute); serene, peaceful expression, soft glow behind her. Detail: holding a small lute, peaceful smile
Magic motif: a few small gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 16.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #18 · `char/adult_body` — 루나 18세 성인 직전 · 신체

- **저장**: `game/assets/char/adult_body.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/adult_body`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/adult_body · 루나 18세 성인 직전 초상 · 신체(body) 계열]
Luna as an 18-year-old young woman on the verge of adulthood: youthful face, elegant yet plain and modest. (나이 18세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (신체): loose black training tunic (not tight) over white shirt sleeves, leather bracers on the forearms, black trousers and boots. Accent colour: crimson red (진홍) only, on the black-and-white base.
Props & pose: a real sword sheathed in its scabbard (진검), held at her side; standing tall and confident, proud smile. Detail: a real sword in a scabbard instead of a wooden one, short black cape with crimson lining; dignified
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 18.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #19 · `char/adult_mind` — 루나 18세 성인 직전 · 지성

- **저장**: `game/assets/char/adult_mind.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/adult_mind`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/adult_mind · 루나 18세 성인 직전 초상 · 지성(mind) 계열]
Luna as an 18-year-old young woman on the verge of adulthood: youthful face, elegant yet plain and modest. (나이 18세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (지성): black scholar's robe over a white high-neck knit sweater. Accent colour: indigo-violet (남보라) only, on the black-and-white base.
Props & pose: a thick book held in one arm, a tiny star-light spell glowing at her fingertip; calm, intelligent expression. Detail: magic-tower robe with indigo-violet trim, star-light blooming at her fingertip
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 18.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #20 · `char/adult_social` — 루나 18세 성인 직전 · 사교

- **저장**: `game/assets/char/adult_social.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/adult_social`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/adult_social · 루나 18세 성인 직전 초상 · 사교(social) 계열]
Luna as an 18-year-old young woman on the verge of adulthood: youthful face, elegant yet plain and modest. (나이 18세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (사교): white ribbed high-neck knit sweater with long sleeves + ankle-length black long skirt with NO slit, black flat shoes. Accent colour: gold (금색) only, on the black-and-white base.
Props & pose: one hand lightly raised as gold sparkles land on her fingers; graceful, elegant, soft smile. Detail: small simple silver tiara; same modest high-neck knit and long skirt, now elegant
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 18.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

### #21 · `char/adult_inner` — 루나 18세 성인 직전 · 내면

- **저장**: `game/assets/char/adult_inner.png` · 768×1040 px · 목표 비율 3:4
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=char/adult_inner`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — char/adult_inner · 루나 18세 성인 직전 초상 · 내면(inner) 계열]
Luna as an 18-year-old young woman on the verge of adulthood: youthful face, elegant yet plain and modest. (나이 18세 — 체형·얼굴을 이 나이에 맞게, 단정한 옷차림.)
Outfit (내면): long white robe with a black shawl over the shoulders, a small gold pendant. Accent colour: green (녹색) only, on the black-and-white base.
Props & pose: a bundle of herbs (or a small lute); serene, peaceful expression, soft glow behind her. Detail: pure white robe with black shawl, gold pendant glowing softly
Magic motif: several gold four-point star sparkles around her.
Same person as the attached character sheet (identical face, hair and eyes), shown at age 18.
Composition: one single character, knee-up shot (head to knees), centered, slight three-quarter angle toward the viewer, whole head visible with a little headroom. Plain flat light-grey to white background, no scenery.
[FORMAT] portrait (세로) 3:4 — final file 768×1040 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, duplicate characters, two copies of the same girl, blood, gore, wounds, weapons pointed at the viewer, fighting, busy background, scenery
```

---

## NPC 초상

### #22 · `npc/cube` — 큐브

- **저장**: `game/assets/npc/cube.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/cube`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/cube · NPC 초상 (이벤트 배너)]
큐브: 손바닥만 한 집사 요정. 정육면체 몸통, 작은 나비넥타이, 반투명 날개, 둥실 떠서 케이크를 든 장난스러운 눈. 배경 거실.
Notes: Cube is a palm-sized butler fairy: a WHITE cube-shaped body with a small BLACK bow tie (black-and-white like the princess), translucent wings with a faint gold glow, small dot eyes. Not a human.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #23 · `npc/loren` — 마담 로렌

- **저장**: `game/assets/npc/loren.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/loren`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/loren · NPC 초상 (이벤트 배너)]
마담 로렌: 50대 귀부인, 예절학교 교장. 은발 올림머리, 검은 벨벳 드레스, 외알 안경, 엄격하지만 품위 있는 표정. 배경 대리석 복도.
Notes: woman in her 50s, dignified, modest high-collared long-sleeved dress.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #24 · `npc/garrett` — 가렛

- **저장**: `game/assets/npc/garrett.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/garrett`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/garrett · NPC 초상 (이벤트 배너)]
가렛: 40대 용병단장. 짧은 적갈색 머리, 뺨의 흉터, 가죽 갑옷, 어깨의 큰 검, 호쾌한 미소. 배경 항구 선착장.
Notes: man in his 40s, broad-shouldered, friendly; sword stays sheathed on his back.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #25 · `npc/elda` — 엘다

- **저장**: `game/assets/npc/elda.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/elda`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/elda · NPC 초상 (이벤트 배너)]
엘다: 나이를 알 수 없는 약초 마법사. 긴 백발, 녹색 숄, 약초 다발, 신비롭고 다정한 눈. 배경 약초가 매달린 오두막.
Notes: ageless woman, kind; long white hair (pure white, wavy — clearly different from the princess's straight silver-white hair).
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #26 · `npc/leon` — 리온

- **저장**: `game/assets/npc/leon.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/leon`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/leon · NPC 초상 (이벤트 배너)]
리온: 루나와 동갑 소년(13세 기준). 금발, 푸른 눈, 평민 옷이지만 유난히 고급스러운 단추(왕자 복선), 수줍은 미소. 배경 우물가.
Notes: a 13-year-old boy with child proportions: golden blond hair, blue eyes, navy-blue commoner clothes with suspiciously fine buttons.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #27 · `npc/theodora` — 테오도라

- **저장**: `game/assets/npc/theodora.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/theodora`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/theodora · NPC 초상 (이벤트 배너)]
테오도라: 루나와 동갑 라이벌 소녀. 금발 세로 롤, 붉은 리본, 고급 드레스, 팔짱 낀 도도한 표정. 배경 예절학교 정문.
Notes: a 13-year-old girl with child proportions: golden blond hair in vertical ringlet curls, red ribbon, modest long-sleeved CRIMSON dress (her crimson contrasts the princess's black-and-white).
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #28 · `npc/envoy` — 마법탑의 사자

- **저장**: `game/assets/npc/envoy.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/envoy`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/envoy · NPC 초상 (이벤트 배너)]
마법탑의 사자: 30대, 별 문양이 수놓인 남색 로브, 두건, 차갑고 정중한 표정, 손에 봉인된 두루마리. 배경 집 앞 문간.
Notes: man in his 30s, cold and polite; hood down so the face is visible.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #29 · `npc/archbishop` — 대주교

- **저장**: `game/assets/npc/archbishop.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/archbishop`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/archbishop · NPC 초상 (이벤트 배너)]
대주교: 70대, 흰 수염, 금실 장식 사제복, 지팡이, 온화하지만 꿰뚫어보는 눈. 배경 성당 제단.
Notes: man in his 70s, gentle but piercing eyes.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #30 · `npc/guildmaster` — 상인 길드장

- **저장**: `game/assets/npc/guildmaster.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/guildmaster`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/guildmaster · NPC 초상 (이벤트 배너)]
상인 길드장: 50대 통통한 여성, 금테 안경, 화려한 반지, 장부, 영리한 미소. 배경 길드 회관.
Notes: plump woman in her 50s, clever smile; the ledger shows no readable writing.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #31 · `npc/shadow` — 그림자 길드의 남자

- **저장**: `game/assets/npc/shadow.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/shadow`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/shadow · NPC 초상 (이벤트 배너)]
그림자 길드의 남자: 얼굴 반이 그림자에 가린 검은 옷의 청년, 은 귀걸이, 카드 한 장을 내미는 손. 배경 밤 골목.
Notes: young man in black; half of his face in shadow; mysterious but not threatening; no weapons.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #32 · `npc/troupe` — 극단 단장

- **저장**: `game/assets/npc/troupe.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/troupe`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/troupe · NPC 초상 (이벤트 배너)]
극단 단장: 40대 화려한 남자, 깃털 모자, 콧수염, 과장된 몸짓. 배경 극장 무대 뒤.
Notes: flamboyant man in his 40s, feathered hat, curled moustache.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

### #33 · `npc/knight_cpt` — 근위대장

- **저장**: `game/assets/npc/knight_cpt.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=npc/knight_cpt`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — npc/knight_cpt · NPC 초상 (이벤트 배너)]
근위대장: 30대 여기사, 짧은 흑발, 흰 갑옷, 왕실 망토, 엄격하고 공정한 눈. 배경 왕궁 복도.
Notes: woman knight in her 30s, short black hair, white armour, royal cape; stern but fair.
Composition: wide event banner. The character (waist-up; a small creature is shown whole) is placed in the LEFT third of the frame looking toward the center; the other two-thirds show the described background, softly blurred with depth of field. Only this one character in focus.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, silver-white haired girl with crimson eyes (the princess must not appear)
```

---

## 배경

### #34 · `bg/room_spring` — 평원의 작은 집 거실, 봄 오후

- **저장**: `game/assets/bg/room_spring.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/room_spring`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/room_spring · 배경]
평원의 작은 집 거실, 봄 오후. 창밖 꽃 핀 들판, 낮달. 벽걸이 달력, 책장 위 액자, 난로, 바느질 바구니. 인물 없음.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
No characters at all (인물 없음).
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, people, characters, animals in focus, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #35 · `bg/room_summer` — 같은 거실, 여름

- **저장**: `game/assets/bg/room_summer.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부** (먼저 업로드, 이 순서로): `game/assets/bg/room_spring.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/room_summer`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/room_summer · 배경]
같은 거실, 여름. 창문 활짝, 초록 들판, 강한 햇빛, 탁자 위 수박. 인물 없음.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
No characters at all (인물 없음).
This is the SAME living room as the attached image: keep the room layout, furniture, window and fireplace positions identical; change only the season, light and small seasonal props.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = bg/room_spring: the same living room in spring — keep the layout and furniture identical

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, people, characters, animals in focus, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #36 · `bg/room_autumn` — 같은 거실, 가을

- **저장**: `game/assets/bg/room_autumn.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부** (먼저 업로드, 이 순서로): `game/assets/bg/room_spring.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/room_autumn`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/room_autumn · 배경]
같은 거실, 가을. 창밖 황금빛 밀밭, 낙엽 몇 장, 난로의 작은 불, 호박. 인물 없음.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
No characters at all (인물 없음).
This is the SAME living room as the attached image: keep the room layout, furniture, window and fireplace positions identical; change only the season, light and small seasonal props.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = bg/room_spring: the same living room in spring — keep the layout and furniture identical

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, people, characters, animals in focus, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #37 · `bg/room_winter` — 같은 거실, 겨울 밤

- **저장**: `game/assets/bg/room_winter.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부** (먼저 업로드, 이 순서로): `game/assets/bg/room_spring.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/room_winter`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/room_winter · 배경]
같은 거실, 겨울 밤. 창밖 눈, 세 개의 달, 활활 타는 난로, 담요, 촛불. 인물 없음.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
No characters at all (인물 없음).
This is the SAME living room as the attached image: keep the room layout, furniture, window and fireplace positions identical; change only the season, light and small seasonal props.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = bg/room_spring: the same living room in spring — keep the layout and furniture identical

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, people, characters, animals in focus, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #38 · `bg/festival_spring` — 마을 광장 봄 꽃 축제

- **저장**: `game/assets/bg/festival_spring.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/festival_spring`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/festival_spring · 배경]
마을 광장 봄 꽃 축제. 꽃수레, 색색 깃발, 멀리 작게 춤추는 사람들, 흩날리는 꽃잎.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #39 · `bg/school` — 읍내 학교 교실 아침

- **저장**: `game/assets/bg/school.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/school`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/school · 배경]
읍내 학교 교실 아침. 긴 나무 책상, 창으로 드는 빛, 칠판의 별자리 그림(글자 없음). 인물 없음.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
No characters at all (인물 없음).
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, people, characters, animals in focus, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #40 · `bg/festival_harvest` — 평원 수확제 저녁

- **저장**: `game/assets/bg/festival_harvest.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/festival_harvest`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/festival_harvest · 배경]
평원 수확제 저녁. 통나무 들기 대회장, 호박 파이 탁자, 모닥불, 등불, 멀리 춤추는 실루엣.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #41 · `bg/starnight` — 별의 밤

- **저장**: `game/assets/bg/starnight.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/starnight`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/starnight · 배경]
별의 밤. 언덕 위 작은 집 지붕, 일직선으로 겹친 세 개의 달, 별똥별, 창문의 따뜻한 불빛. 인물 없음.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
No characters at all (인물 없음).
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, people, characters, animals in focus, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #42 · `bg/market` — 읍내 장터 한낮

- **저장**: `game/assets/bg/market.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/market`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/market · 배경]
읍내 장터 한낮. 천막 노점, 과일·천·도자기, 북적이는 사람들(작게), 돌바닥.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #43 · `bg/harbor` — 항구도시 선착장

- **저장**: `game/assets/bg/harbor.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/harbor`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/harbor · 배경]
항구도시 선착장. 돛단배와 상선, 갈매기, 화물 상자, 바다 냄새 나는 오후 빛.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #44 · `bg/tower` — 마법탑 내부 원형 서재

- **저장**: `game/assets/bg/tower.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/tower`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/tower · 배경]
마법탑 내부 원형 서재. 떠다니는 책, 별자리 천구의, 보랏빛 마법 등불, 높은 창.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #45 · `bg/church` — 성당 내부

- **저장**: `game/assets/bg/church.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/church`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/church · 배경]
성당 내부. 스테인드글라스로 들어오는 색색의 빛, 긴 의자, 촛대, 고요함.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #46 · `bg/forest` — 근교 숲 오솔길

- **저장**: `game/assets/bg/forest.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/forest`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/forest · 배경]
근교 숲 오솔길. 높은 나무, 햇살 줄기, 이끼 낀 바위, 작은 버섯, 약간의 신비로움.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #47 · `bg/ruins` — 숲속 고대 폐허

- **저장**: `game/assets/bg/ruins.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/ruins`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/ruins · 배경]
숲속 고대 폐허. 무너진 석조 아치, 덩굴, 희미하게 빛나는 룬 문양, 어두운 입구.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #48 · `bg/castle_hall` — 왕궁 대리석 복도

- **저장**: `game/assets/bg/castle_hall.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/castle_hall`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/castle_hall · 배경]
왕궁 대리석 복도. 높은 기둥, 붉은 융단, 기사 갑옷 장식, 샹들리에.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #49 · `bg/ballroom` — 왕도 무도회장 밤

- **저장**: `game/assets/bg/ballroom.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/ballroom`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/ballroom · 배경]
왕도 무도회장 밤. 샹들리에, 반짝이는 바닥, 악단석, 드레스 입은 실루엣들.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #50 · `bg/tavern_inn` — 항구 여관 1층 주점

- **저장**: `game/assets/bg/tavern_inn.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/tavern_inn`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/tavern_inn · 배경]
항구 여관 1층 주점. 나무 카운터, 맥주잔, 벽난로, 후드 쓴 손님의 실루엣.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #51 · `bg/graveyard_night` — 밤의 묘지

- **저장**: `game/assets/bg/graveyard_night.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/graveyard_night`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/graveyard_night · 배경]
밤의 묘지. 안개, 오래된 비석, 랜턴 하나, 세 개의 달, 으스스하지만 무섭지 않게.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #52 · `bg/wheat_field` — 평원 밀밭 한낮

- **저장**: `game/assets/bg/wheat_field.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/wheat_field`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/wheat_field · 배경]
평원 밀밭 한낮. 끝없는 황금 이삭, 허수아비, 멀리 풍차와 작은 집.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #53 · `bg/theater_stage` — 극장 무대 뒤편

- **저장**: `game/assets/bg/theater_stage.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/theater_stage`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/theater_stage · 배경]
극장 무대 뒤편. 붉은 커튼, 조명, 소품 상자, 거울 달린 분장대.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #54 · `bg/library` — 왕실 학술원 도서관

- **저장**: `game/assets/bg/library.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/library`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/library · 배경]
왕실 학술원 도서관. 천장까지 닿은 책장, 사다리, 긴 열람 책상, 먼지 속 햇빛.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #55 · `bg/smithy` — 대장간

- **저장**: `game/assets/bg/smithy.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/smithy`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/smithy · 배경]
대장간. 붉게 달아오른 화덕, 모루, 망치, 매달린 검과 편자, 불꽃.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #56 · `bg/etiquette_school` — 마담 로렌의 예절학교 응접실

- **저장**: `game/assets/bg/etiquette_school.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/etiquette_school`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/etiquette_school · 배경]
마담 로렌의 예절학교 응접실. 찻잔 세트, 거울, 피아노, 우아한 커튼.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #57 · `bg/elda_hut` — 엘다의 오두막

- **저장**: `game/assets/bg/elda_hut.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/elda_hut`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/elda_hut · 배경]
엘다의 오두막. 천장에 매달린 약초, 끓는 솥, 유리병, 창밖 평원.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #58 · `bg/training_yard` — 검술도장 마당

- **저장**: `game/assets/bg/training_yard.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/training_yard`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/training_yard · 배경]
검술도장 마당. 목검 거치대, 허수아비 표적, 모래 바닥, 아침 햇살.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #59 · `bg/river` — 마을 강가

- **저장**: `game/assets/bg/river.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/river`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/river · 배경]
마을 강가. 버드나무, 징검다리, 반짝이는 물, 노을.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #60 · `bg/night_market` — 항구 밤 시장

- **저장**: `game/assets/bg/night_market.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/night_market`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/night_market · 배경]
항구 밤 시장. 등불, 수상한 노점, 그림자 진 골목, 보랏빛 연기.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #61 · `bg/road` — 왕국을 가로지르는 흙길

- **저장**: `game/assets/bg/road.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/road`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/road · 배경]
왕국을 가로지르는 흙길. 먼 산, 이정표, 마차 바퀴 자국, 넓은 하늘.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #62 · `bg/snow_village` — 눈 덮인 마을 밤

- **저장**: `game/assets/bg/snow_village.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/snow_village`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/snow_village · 배경]
눈 덮인 마을 밤. 지붕마다 쌓인 눈, 창마다 불빛, 눈사람.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #63 · `bg/sickroom` — 아이 방 침대 옆

- **저장**: `game/assets/bg/sickroom.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/sickroom`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/sickroom · 배경]
아이 방 침대 옆. 물수건, 약병, 촛불, 창밖 비, 걱정스러운 고요.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #64 · `bg/guild_hall` — 상인 길드 회관

- **저장**: `game/assets/bg/guild_hall.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/guild_hall`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/guild_hall · 배경]
상인 길드 회관. 커다란 장부, 금화 저울, 지도, 분주한 서기들(작게).
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

### #65 · `bg/throne_room` — 왕좌의 방

- **저장**: `game/assets/bg/throne_room.png` · 1280×560 px · 목표 비율 16:7 (제미나이에서 비율을 고를 수 있으면 21:9)
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=bg/throne_room`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — bg/throne_room · 배경]
왕좌의 방. 높은 왕좌, 세 개의 달 문장, 깃발, 엄숙한 빛.
Background art for the event window of a fantasy life-sim: wide establishing shot, clean anime background painting with rich detail and depth, coherent lighting.
Any people are small and in the distance, without detailed faces.
[FORMAT] landscape (가로) 16:7 — final file 1280×560 px (generate at 21:9; it is center-cropped to 16:7 afterwards, so keep important content away from the edges).

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, large foreground figures, close-up people, readable signs, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting
```

---

## 엔딩 일러스트

### #66 · `ending/queen` — 엔딩 «여왕»

- **저장**: `game/assets/ending/queen.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/queen`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/queen · 엔딩 일러스트 «여왕» (왕실/정치)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «대관식 날, 루나는 왕관보다 먼저 객석 뒤편의 당신을 찾았다. 10년 뒤, 그녀의 치세는 "세 개의 달이 가장 밝았던 시대"로 기록된다.»
Scene: Queen Luna on the palace balcony at dusk, a small simple crown, modest black-and-white royal gown with gold trim and a long cape; below her the capital glows with lanterns under three bright moons.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #67 · `ending/duchess` — 엔딩 «공작부인»

- **저장**: `game/assets/ending/duchess.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/duchess`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/duchess · 엔딩 일러스트 «공작부인» (왕실/정치)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «마담 로렌의 소개로 공작가와 맺어졌다. 루나는 화려한 저택에서도 매년 겨울 평원의 작은 집으로 돌아온다.»
Scene: Winter evening: Luna as a duchess in an elegant black coat with gold trim steps out of a noble carriage in front of the small snow-covered house on the plains, warm light in the window, she smiles like coming home.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #68 · `ending/diplomat` — 엔딩 «외교관»

- **저장**: `game/assets/ending/diplomat.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/diplomat`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/diplomat · 엔딩 일러스트 «외교관» (왕실/정치)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 세 나라의 말을 하고 네 나라의 마음을 읽는다. 전쟁 전조는 그녀의 테이블에서 두 번 멈췄다.»
Scene: Luna as a diplomat at a round negotiation table in a grand hall, envoys of several nations seen as backs/silhouettes, tea cups and a map without writing, she speaks calmly and everyone listens.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #69 · `ending/chancellor` — 엔딩 «재상»

- **저장**: `game/assets/ending/chancellor.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/chancellor`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/chancellor · 엔딩 일러스트 «재상» (왕실/정치)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «왕국 최연소 재상. 루나의 서명이 들어간 법령은 늘 마지막 줄에 "평원의 아이들에게"라는 조항이 있다.»
Scene: Luna as the youngest chancellor in black robes with a gold chain of office, signing a decree at a large desk in a high palace office, window overlooking the capital and the far plains; papers show no readable writing.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #70 · `ending/guard_captain` — 엔딩 «근위기사단장»

- **저장**: `game/assets/ending/guard_captain.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/guard_captain`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/guard_captain · 엔딩 일러스트 «근위기사단장» (무예)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «흰 갑옷의 루나가 왕의 곁에 선다. 그러나 매달 첫째 날은 휴가를 낸다. 평원의 집에 지붕을 손봐야 한다고.»
Scene: Luna, captain of the royal guard, on her day off: white armour breastplate and crimson cape, kneeling on the roof of the small plains house with a hammer fixing shingles, cape draped over the chimney, laughing in the sun.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: crimson red, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #71 · `ending/mercenary_king` — 엔딩 «용병왕»

- **저장**: `game/assets/ending/mercenary_king.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`, `game/assets/npc/garrett.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/mercenary_king`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/mercenary_king · 엔딩 일러스트 «용병왕» (무예)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «가렛의 용병단을 이어받은 루나. 항구의 아이들은 "은발의 단장"이 나타나면 길을 비킨다. 그리고 사탕을 받는다.»
Scene: Harbor docks: Luna, the silver-haired mercenary captain in leather armour with a crimson scarf, sword sheathed on her back, handing candy to delighted harbor children; Garrett grins proudly behind her.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: crimson red, on a black-and-white base.
Also in the scene: Garrett, now in his 50s with grey streaks in his short red-brown hair, scar on cheek, leather armour — match the attached reference portrait(s), aged as described.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.
- Attached image 2 = npc/garrett: reference portrait of Garrett — keep the character design; age as described

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #72 · `ending/adventurer` — 엔딩 «모험가»

- **저장**: `game/assets/ending/adventurer.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/adventurer`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/adventurer · 엔딩 일러스트 «모험가» (무예)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 지도에 없는 곳을 찾아다닌다. 1년에 한 번, 어디서 왔는지 모를 편지가 도착한다. 늘 마른 꽃이 들어 있다.»
Scene: Luna as an adventurer with a travel cloak and backpack standing on a cliff above an unexplored valley with ancient ruins, holding a pressed dried flower tucked into a letter.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: crimson red, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #73 · `ending/bounty_hunter` — 엔딩 «현상금 사냥꾼»

- **저장**: `game/assets/ending/bounty_hunter.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/bounty_hunter`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/bounty_hunter · 엔딩 일러스트 «현상금 사냥꾼» (무예)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «법과 법 바깥의 경계에서 루나는 일한다. 한 번도 무고한 사람을 잡은 적은 없다. 그 점을 그녀는 자랑스러워한다.»
Scene: Luna as a bounty hunter in a dark travel coat with crimson accents at a crossroads at dusk, a wanted poster with no readable writing pinned to a signpost, calm and resolute; no weapons drawn.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: crimson red, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #74 · `ending/archmage` — 엔딩 «대마법사»

- **저장**: `game/assets/ending/archmage.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/archmage`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/archmage · 엔딩 일러스트 «대마법사» (학문/마법)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «탑의 가장 높은 방. 루나는 창문을 늘 평원 쪽으로 열어 둔다. 어머니가 도망쳤던 그 탑을, 딸은 집으로 만들었다.»
Scene: The highest room of the magic tower: Luna as archmage in black-and-white robes with indigo-violet trim opens a round window toward the distant plains, floating books and constellations of star-light around her.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: indigo-violet, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #75 · `ending/royal_scholar` — 엔딩 «왕실학자»

- **저장**: `game/assets/ending/royal_scholar.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/royal_scholar`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/royal_scholar · 엔딩 일러스트 «왕실학자» (학문/마법)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나의 첫 저서 제목은 「별이 떨어지는 조건에 대하여」. 서문은 단 한 줄. "나를 주워 준 사람에게."»
Scene: Royal academy library: Luna as a royal scholar holding her first published book (cover without readable title), star diagrams on the desk, warm dusty sunbeams.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: indigo-violet, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #76 · `ending/alchemist` — 엔딩 «연금술사»

- **저장**: `game/assets/ending/alchemist.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/alchemist`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/alchemist · 엔딩 일러스트 «연금술사» (학문/마법)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «항구의 뒷골목 연구실. 루나가 만든 약은 비싸고, 효과는 확실하고, 가난한 이에겐 공짜다.»
Scene: A back-alley laboratory in the harbor city: Luna as an alchemist with an apron over her black-and-white outfit hands a glowing potion bottle to a poor mother and child, glass vials and a warm lamp.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: indigo-violet, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #77 · `ending/herb_doctor` — 엔딩 «약초의사»

- **저장**: `game/assets/ending/herb_doctor.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/herb_doctor`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/herb_doctor · 엔딩 일러스트 «약초의사» (학문/마법)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «엘다의 집을 이어받았다. 평원 사람들은 아플 때 루나를 찾고, 외로울 때도 찾는다.»
Scene: The herb hut she inherited from Elda: Luna as a herb doctor in a white robe with black shawl tends an old farmer, dried herbs hanging from the ceiling, a green shawl hanging by the door as a keepsake.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: indigo-violet, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #78 · `ending/court_musician` — 엔딩 «궁정악사»

- **저장**: `game/assets/ending/court_musician.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/court_musician`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/court_musician · 엔딩 일러스트 «궁정악사» (예술/문화)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나의 곡 「열흘」은 왕국 사람 누구나 흥얼거린다. 스케줄 표의 열흘 단위에서 제목을 따왔다는 건 당신만 안다.»
Scene: A royal concert hall: Luna as court musician playing a lute on stage in a black-and-white gown with green accent, audience as soft silhouettes humming along, ten small candles on the stage edge.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #79 · `ending/stage_star` — 엔딩 «극단 스타»

- **저장**: `game/assets/ending/stage_star.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/stage_star`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/stage_star · 엔딩 일러스트 «극단 스타» (예술/문화)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «무대 위의 루나는 천 명의 사람이 된다. 커튼콜에서는 늘 한 사람만 찾는다.»
Scene: Theater curtain call: Luna as a stage star in a modest long stage costume bowing under spotlights, flowers on the stage, her eyes searching for one seat in the audience.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #80 · `ending/painter` — 엔딩 «화가»

- **저장**: `game/assets/ending/painter.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/painter`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/painter · 엔딩 일러스트 «화가» (예술/문화)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나의 그림에는 늘 세 개의 달과, 지붕이 삐딱한 집이 있다. 평론가들은 그 집을 "상징"이라 부른다. 상징이 아니다.»
Scene: A sunlit painter's studio: Luna as a painter in a paint-stained apron paints a canvas showing three moons over a small house with a crooked roof, a small cat napping on the windowsill.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #81 · `ending/writer` — 엔딩 «작가»

- **저장**: `game/assets/ending/writer.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/writer`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/writer · 엔딩 일러스트 «작가» (예술/문화)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나의 첫 소설은 한 아이와 보호자의 8년 이야기였다. 결말은 당신이 아는 것과 조금 다르다. 더 다정하다.»
Scene: A writer's study at night: Luna writing with a quill beside a finished book and a candle, window showing three moons, cozy and tender.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #82 · `ending/merchant_lord` — 엔딩 «대상인»

- **저장**: `game/assets/ending/merchant_lord.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/merchant_lord`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/merchant_lord · 엔딩 일러스트 «대상인» (생활/상업)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «항구의 절반이 루나의 창고다. 장부 첫 줄에는 아직도 열한 살 때 받은 용돈 20G가 적혀 있다.»
Scene: Harbor warehouses: Luna as a great merchant in a fine black coat with gold accents holding an open leather ledger (no readable writing), ships being unloaded behind her, busy clerks small in the background.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #83 · `ending/farm_owner` — 엔딩 «농장주»

- **저장**: `game/assets/ending/farm_owner.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/farm_owner`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/farm_owner · 엔딩 일러스트 «농장주» (생활/상업)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «평원 가장 넓은 밭. 루나는 수확제마다 통나무 들기에 나가고, 매년 이긴다. 당신 자리는 늘 맨 앞줄이다.»
Scene: Harvest festival on the plains: Luna as a farm owner in work clothes with rolled sleeves lifting a huge log in the log-lifting contest, cheering crowd, golden wheat fields; the guardian seen from behind in the front row.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #84 · `ending/chef` — 엔딩 «요리사»

- **저장**: `game/assets/ending/chef.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/chef`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/chef · 엔딩 일러스트 «요리사» (생활/상업)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나의 식당 메뉴에는 "보호자의 탄 파이"가 있다. 제일 안 팔리고, 제일 안 내린다.»
Scene: A cozy restaurant: Luna as a chef in a white chef coat and black apron proudly presents a slightly burnt pie, warm kitchen light, patrons smiling in the background, menu board without readable writing.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #85 · `ending/innkeeper` — 엔딩 «여관 주인»

- **저장**: `game/assets/ending/innkeeper.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/innkeeper`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/innkeeper · 엔딩 일러스트 «여관 주인» (생활/상업)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «항구의 여관 「세 개의 달」. 후드 쓴 손님이 오면 루나는 웃으며 묻는다. "은발 아이 찾으세요? 저예요."»
Scene: The harbor inn "Three Moons" (sign shows only a three-moon emblem): Luna as innkeeper behind a wooden counter smiling at a hooded guest, fireplace and lanterns.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #86 · `ending/archbishop` — 엔딩 «대주교»

- **저장**: `game/assets/ending/archbishop.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/archbishop`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/archbishop · 엔딩 일러스트 «대주교» (신앙)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «왕국 최초의 여성 대주교. 루나의 첫 설교 제목은 "주워진 자의 은혜". 당신은 맨 뒷자리에서 들었다.»
Scene: Cathedral: Luna, the first woman archbishop, in white-and-gold vestments with a black stole gives her first sermon from the pulpit, stained-glass light; the guardian seen from behind in the last pew.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #87 · `ending/saint` — 엔딩 «성녀»

- **저장**: `game/assets/ending/saint.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/saint`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/saint · 엔딩 일러스트 «성녀» (신앙)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나가 지나간 곳에 병이 멎었다고들 한다. 그녀는 그런 말을 들으면 웃으며 고개를 젓고, 약초를 건넨다.»
Scene: A village road: Luna as a saint in a simple white robe with black shawl hands herbs to a recovering villager, people gathered with grateful faces, she modestly shakes her head with a gentle smile.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #88 · `ending/pilgrim` — 엔딩 «순례자»

- **저장**: `game/assets/ending/pilgrim.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/pilgrim`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/pilgrim · 엔딩 일러스트 «순례자» (신앙)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 걷는다. 왕국 끝에서 끝까지. 돌아올 때마다 신발이 바뀌어 있고, 이야기가 늘어 있다.»
Scene: A long road across the kingdom at sunrise: Luna as a pilgrim with a staff, travel cloak and worn boots walking toward distant mountains.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #89 · `ending/assassin` — 엔딩 «암살자»

- **저장**: `game/assets/ending/assassin.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/assassin`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/assassin · 엔딩 일러스트 «암살자» (어둠)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나의 이름을 아는 사람은 없다. 그러나 평원의 작은 집 우편함에는 매달 익명의 금화가 들어 있다.»
Scene: Night rooftops of the harbor city under three moons: Luna in a dark hooded cloak with crimson lining, half of her face in shadow, no weapon visible; far below, the mailbox of the small plains house glints with a gold coin.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: deep crimson, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #90 · `ending/bandit_boss` — 엔딩 «도적단 두목»

- **저장**: `game/assets/ending/bandit_boss.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/bandit_boss`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/bandit_boss · 엔딩 일러스트 «도적단 두목» (어둠)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «산길의 도적단은 이상하게도 가난한 마차는 건드리지 않는다. 두목이 "집이 생각나서"라고 했다는 소문이다.»
Scene: A mountain pass: Luna as the leader of an outlaw band in rugged black leather with a crimson scarf, on horseback, waving a poor farmer's cart through untouched; her band in the background; no violence.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: deep crimson, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #91 · `ending/swindler` — 엔딩 «사기꾼»

- **저장**: `game/assets/ending/swindler.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/swindler`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/swindler · 엔딩 일러스트 «사기꾼» (어둠)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 왕국 절반을 속였다. 당신만은 한 번도. 그게 그녀의 유일한 규칙이다.»
Scene: An elegant salon: Luna as a charming swindler in a black-and-white suit with gold accents, holding a playing card and a masquerade mask, a sly smile.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: deep crimson, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #92 · `ending/royal_wedding` — 엔딩 «왕자와의 결혼»

- **저장**: `game/assets/ending/royal_wedding.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`, `game/assets/npc/leon.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/royal_wedding`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/royal_wedding · 엔딩 일러스트 «왕자와의 결혼» (관계)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «왕실은 반대했고, 리온은 왕위를 걸었고, 루나는 "그럼 둘 다 시골에서 살자"고 했다. 결국 왕실이 졌다.»
Scene: Countryside: Luna and Prince Leon as a married adult couple in simple modest clothes laughing together hand in hand in front of a country cottage, a royal carriage giving up and turning back in the distance; warm and wholesome, affectionate but chaste (holding hands at most).
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
Also in the scene: Leon, now an adult man around 28, golden blond hair and blue eyes as in his reference, simple navy clothes — match the attached reference portrait(s), aged as described.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.
- Attached image 2 = npc/leon: reference portrait of Leon — keep the character design; age as described

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #93 · `ending/family_home` — 엔딩 «가족»

- **저장**: `game/assets/ending/family_home.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`, `game/assets/npc/cube.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/family_home`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/family_home · 엔딩 일러스트 «가족» (관계)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 떠나지 않았다. 평원의 집에 방을 하나 더 냈다. 큐브는 여전히 케이크를 들고 떠다닌다. 당신은 매일 아침 아이의 목소리에 눈을 뜬다.»
Scene: Morning in the small plains house, now with one more room: Luna opens the curtains to the sunrise, Cube floats beside her holding a cake, the guardian seen from behind at the breakfast table.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
Also in the scene: Cube, the white cube-shaped butler fairy with a black bow tie (unchanged, it does not age) — match the attached reference portrait(s), aged as described.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.
- Attached image 2 = npc/cube: reference portrait of Cube — keep the character design; age as described

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #94 · `ending/drifter` — 엔딩 «떠도는 사람»

- **저장**: `game/assets/ending/drifter.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/drifter`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/drifter · 엔딩 일러스트 «떠도는 사람» (관계)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «열여덟 생일 다음 날, 루나는 짐을 꾸렸다. 편지는 3년 뒤에 왔다. "잘 지내. 미워하진 않아. 그냥 멀리서 보고 싶었어."»
Scene: A faraway hilltop road: Luna as a lone traveller, cloak fluttering, looks back toward the distant plains with a letter in her hand, bittersweet golden hour.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #95 · `ending/star_goddess` — 엔딩 «별의 여신»

- **저장**: `game/assets/ending/star_goddess.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/star_goddess`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/star_goddess · 엔딩 일러스트 «별의 여신» (히든)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «세 개의 달이 겹친 밤, 루나는 하늘로 올라갔다. 그리고 내려왔다. "다녀왔어." 그 뒤로 왕국에는 네 번째 달이 뜬다. 평원의 집 바로 위에.»
Scene: Night with three moons aligned: Luna descends from a starry sky in a white-and-black gown wrapped in gold starlight and countless gold four-point sparkles, a fourth moon shining right above the small plains house.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #96 · `ending/world_traveler` — 엔딩 «세계 여행자»

- **저장**: `game/assets/ending/world_traveler.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/world_traveler`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/world_traveler · 엔딩 일러스트 «세계 여행자» (히든)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 "다 보고 올게"라고 했다. 세계는 넓었고, 편지는 매달 왔다. 당신은 벽에 지도를 걸고 핀을 꽂는다. 핀이 모자란다.»
Scene: Luna as a world traveller with a backpack and a map at a viewpoint over a foreign harbor city at sunrise; in the foreground, a wall map full of pins and a stack of letters (no readable writing).
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #97 · `ending/time_reverse` — 엔딩 «시간 역행»

- **저장**: `game/assets/ending/time_reverse.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/time_reverse`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/time_reverse · 엔딩 일러스트 «시간 역행» (히든)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 시간을 되돌리는 마법을 완성했다. 그리고 쓰지 않았다. "쓰러졌던 날들도 내 거야." 그녀는 그 마법을 봉인하고, 봉인의 열쇠를 당신에게 줬다.»
Scene: Luna as an archmage seals a glowing clock-like magic circle into a small silver key and places the key in the guardian's hands (only hands visible), indigo and gold star-light.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #98 · `ending/ship_captain` — 엔딩 «선장»

- **저장**: `game/assets/ending/ship_captain.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/ship_captain`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/ship_captain · 엔딩 일러스트 «선장» (무예)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «샛별호의 새 선장은 졸린 눈의 은발인데, 폭풍이 오면 누구보다 먼저 돛대에 오른다. 마렌 선장에게 키를 물려받던 날, 루나는 손에 익은 매듭 하나에 이름을 붙였다. "집으로 돌아오는 매듭." 그 뒤로 샛별호는 어느 바다에 다녀오든 이 항구에서 열흘을 쉰다. 선장이 평원에 다녀와야 해서.»
Scene: The deck of a merchant sailing ship on a bright windy sea (no readable name on the hull): Luna as the ship's captain in a long black captain's coat with crimson trim stands at the wheel, hair streaming in the wind, tying a sailor's knot; the home harbor and the far plains on the horizon.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: crimson red, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #99 · `ending/knight_errant` — 엔딩 «편력 기사»

- **저장**: `game/assets/ending/knight_errant.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/knight_errant`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/knight_errant · 엔딩 일러스트 «편력 기사» (무예)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «로데릭에게 받은 문장 없는 방패에는 이제 문장이 있다. 세 개의 달 아래 지붕 하나. 편력 기사 루나는 약한 이의 편에 서고, 받은 것보다 많이 돌려주고, 길이 끝날 때까지 걷는다. 그리고 그 길은 해마다 한 번, 꼭 평원의 작은 집 문 앞에서 끝난다.»
Scene: A country road at dawn: Luna as a wandering knight in plain steel-and-black armour with a crimson cloak, sword sheathed, carrying a round shield painted with a simple emblem of one small roof under three moons (no writing), helping an old villager carry a heavy basket.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: crimson red, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #100 · `ending/prima_dancer` — 엔딩 «무희»

- **저장**: `game/assets/ending/prima_dancer.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/prima_dancer`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/prima_dancer · 엔딩 일러스트 «무희» (예술/문화)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «무용극 「달의 세 자매」는 10년째 같은 주역으로 막을 올린다. 마지막 회전에서 루나의 손끝을 떠나 객석까지 흩날리는 금빛 별을, 관객들은 아직도 무대 장치라고 믿는다. 초연 날 분장실에서 "별이 멈추질 않아" 하고 떨던 아이는 이제 그 별로 안무를 짠다. 객석 뒤편 맨 끝자리는 늘 비워 두고, 그 표는 평원으로 부친다.»
Scene: A grand theater stage: Luna as the prima dancer in a modest long-sleeved high-neck black-and-white gown with an ankle-length flowing skirt, mid graceful turn, gold star sparkles streaming from her fingertips over the audience; the audience are soft silhouettes and one seat at the very back is empty.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #101 · `ending/tailor_master` — 엔딩 «의상 명인»

- **저장**: `game/assets/ending/tailor_master.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/tailor_master`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/tailor_master · 엔딩 일러스트 «의상 명인» (예술/문화)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «왕도 큰길의 의상실 간판에는 바늘 하나와 별 하나가 그려져 있다. 루나의 옷은 흑백뿐인데, 입으면 어딘가에서 금빛이 반짝인다고들 한다. 안감 깊숙이 금실로 작은 별을 하나씩 숨겨 두기 때문이다. 진열장 맨 위 칸에는 처음 품평회 무대에 세웠던 그 옷이 걸려 있고, 그 옷만은 값을 매기지 않는다.»
Scene: A tailor's boutique on an avenue of the capital: Luna as a master dressmaker in a black-and-white work dress with a measuring tape around her neck sews a tiny gold star into the lining of a black coat; mannequins wear elegant modest black-and-white garments; the shop sign shows only a needle and a star emblem (no writing).
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #102 · `ending/master_smith` — 엔딩 «명장 대장장이»

- **저장**: `game/assets/ending/master_smith.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/master_smith`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/master_smith · 엔딩 일러스트 «명장 대장장이» (생활/상업)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «도르완 영감의 대장간 간판에는 이제 루나의 이름이 걸려 있다. 별철 걸작 소문을 듣고 먼 데서 손님들이 찾아오지만, 정작 가장 많이 나가는 건 평원의 낫이다. "때는 쇠가 알려 준다. 들을 줄 알면." 영감에게 들은 말을 루나는 견습생들에게 그대로 해 준다. 끝에 "흠"까지 붙여서.»
Scene: A blacksmith's forge: Luna as a master smith in a heavy leather apron over a long-sleeved black work shirt, hair tied back, lifts a softly glowing star-metal blade with tongs; simple farm sickles hang on the wall, young apprentices watch from the background, warm sparks.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #103 · `ending/village_teacher` — 엔딩 «마을 선생님»

- **저장**: `game/assets/ending/village_teacher.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/village_teacher`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/village_teacher · 엔딩 일러스트 «마을 선생님» (생활/상업)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «읍내 학교 어린 반 선생님은 은발에 늘 반쯤 졸린 붉은 눈을 하고, 숙제 걷는 날을 자주 잊는다. 대신 아이들 이름은 한 번도 잊은 적이 없다. 이네스 선생님이 물려준 분필 상자는 바닥이 드러난 지 오래지만, 루나는 새 분필을 사 오면 꼭 그 상자에 담는다. 졸업식 날이면 맨 뒷자리 아이부터 이름을 부른다.»
Scene: A sunny village schoolroom: Luna as a gentle teacher with sleepy crimson eyes, in a modest black-and-white dress with a green shawl, holds a worn old chalk box while small children at wooden desks raise their hands; the chalkboard shows only star doodles (no writing).
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #104 · `ending/astronomer` — 엔딩 «천문학자»

- **저장**: `game/assets/ending/astronomer.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/astronomer`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/astronomer · 엔딩 일러스트 «천문학자» (학문/마법)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «학술원 연감에는 세 달의 궤도표를 새로 쓴 사람으로 루나의 이름이 실렸다. 그래도 그녀는 일주일에 두 번, 이백열두 칸 등대 계단을 오른다. 아흔 날째 밤에 처음 본 그 네 번째 빛이 다시 돌아올 날을, 루나는 시각까지 계산해 두었다. 당신 집 달력에도 같은 날에 동그라미가 쳐져 있다.»
Scene: The top of a lighthouse at night turned into an observatory: Luna as an astronomer beside a brass telescope with star charts (no writing) spread out, three moons in the sky and a faint fourth light near the horizon; indigo-violet accents.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: indigo-violet, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #105 · `ending/orphanage_head` — 엔딩 «고아원 원장»

- **저장**: `game/assets/ending/orphanage_head.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/orphanage_head`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/orphanage_head · 엔딩 일러스트 «고아원 원장» (신앙)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «등불의 집 문간에는 10년째 밤새 등불이 켜져 있다. 원장 루나는 새 아이가 오는 첫날 밤이면 지금도 문간에 이불을 깔고 함께 잔다. 문 닫는 날 루나의 소매를 붙잡던 열한 살 리코는 열아홉에 그 집의 첫 선생님이 되었다. 요즘은 둘이 번갈아 문간에서 잔다. 누구 차례인지는 늘 다툰다.»
Scene: The doorway of an orphanage called "House of Lanterns" (the sign shows only a lantern emblem) at night: Luna as its head kneels to tuck a blanket around a newly arrived small child in warm lantern light; a kind young man (the house's first teacher, about 19) smiles in the background.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #106 · `ending/royal_spy` — 엔딩 «왕실 첩보원»

- **저장**: `game/assets/ending/royal_spy.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/royal_spy`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/royal_spy · 엔딩 일러스트 «왕실 첩보원» (어둠)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «밤 시장 군밤 장수 자리는 이제 은발의 젊은 여자가 지킨다. 옷깃의 반달 단추가 몇 개인지는 왕국 기밀이고, 그녀가 셋째 달 최고의 요원이라는 건 다섯 사람만 안다. 은퇴한 노나 할멈은 평원으로 이사 왔다. 둘은 가끔 당신 집 마당에서 군밤을 구우며 서로의 거짓말을 맞히는 내기를 하고, 심판은 늘 당신이다.»
Scene: A lantern-lit night market in the harbor city: Luna as a royal spy disguised as a roasted-chestnut seller in a hooded dark coat with a few small half-moon buttons on the collar, glancing sideways with a knowing smile, light mist; no weapons.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: deep crimson, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #107 · `ending/medium` — 엔딩 «영매»

- **저장**: `game/assets/ending/medium.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/medium`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/medium · 엔딩 일러스트 «영매» (어둠)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «항구 빵집 「에피와 언니」의 할머니 주인은 평생 동생의 이름을 간판에서 내리지 않았다. 그 빵집을 찾아내 묘지 북쪽 담장까지 갓 구운 빵 냄새를 데려간 사람이 루나였다. 에피가 웃으며 떠난 뒤로, 루나의 집 문간에 걸린 푸른 등불은 길 잃은 이들의 이정표가 되었다. 살아 있는 손님은 세 번, 그렇지 않은 손님은 두 번 그 문을 두드린다. 루나는 어느 쪽에도 똑같이 차를 낸다.»
Scene: Dusk at Luna's doorway, where a blue lantern hangs: Luna as a medium in black-and-white with a gentle smile welcomes a translucent, peaceful, smiling ghost of a little girl in an old-fashioned modest dress (not scary at all) together with a living traveller; soft blue and gold light, a basket of fresh bread.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: deep crimson, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #108 · `ending/rival_partner` — 엔딩 «평생의 라이벌»

- **저장**: `game/assets/ending/rival_partner.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`, `game/assets/npc/theodora.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/rival_partner`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/rival_partner · 엔딩 일러스트 «평생의 라이벌» (관계)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «"10년 뒤에도, 50년 뒤에도." 그 약속의 10년째에 루나와 테오도라는 왕도에 학교를 하나 세웠다. 학생들은 그곳을 "진홍과 흑백"이라 부르고, 교장실에는 똑같은 책상 두 개가 나란히 붙어 있다. 둘의 승부는 지금 1287 대 1287. 기록은 당신이 맡고 있다.»
Scene: The headmistresses' office of a school in the capital: Luna and Theodora, both adults, sit at two identical desks pushed side by side, playfully competing over a board game while students peek in through the door; Luna in black-and-white with a green accent, Theodora in crimson; friendly rivalry.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: green, on a black-and-white base.
Also in the scene: Theodora, now an adult woman around 28, golden blond ringlets, crimson dress with long sleeves — match the attached reference portrait(s), aged as described.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.
- Attached image 2 = npc/theodora: reference portrait of Theodora — keep the character design; age as described

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #109 · `ending/mother_reunion` — 엔딩 «어머니와의 재회»

- **저장**: `game/assets/ending/mother_reunion.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/mother_reunion`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/mother_reunion · 엔딩 일러스트 «어머니와의 재회» (히든)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «서리마을의 등불지기는 이제 둘이다. 겨울이면 루나가 흰눈 고개를 넘어가 어머니와 함께 집집마다 등불을 켜고, 봄이면 세라핀이 평원으로 내려와 당신의 부엌에서 감자를 깎는다. 세라핀은 딸을 아스텔이라 부르고 당신은 늘 부르던 이름으로 부르는데, 루나는 두 이름에 똑같이 웃으며 돌아본다. 끊겼던 자장가는 이제 세 사람의 목소리로 끝까지 불린다.»
Scene: A snowy northern village at night: adult Luna and her birth mother Serafine, a gentle woman in her late forties with long silver hair and a warm winter cloak, light the street lanterns house by house together, singing softly; warm lantern glow on the snow, gold sparkles drifting.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #110 · `ending/dragon_friend` — 엔딩 «용의 친구»

- **저장**: `game/assets/ending/dragon_friend.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/dragon_friend`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/dragon_friend · 엔딩 일러스트 «용의 친구» (히든)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «은빛 비늘에 붉은 눈. 평원 사람들은 이제 하늘에 용이 지나가도 놀라지 않는다. "루나 아가씨 장 보러 가나 보네." 송아지만 하던 용은 집채만큼 자랐지만, 보름마다 산꼭대기에 내려앉아 함께 별을 볼 때면 여전히 그녀 무릎에 꼬리를 얹는다. 그리고 당신 집 지붕 위를 지날 때면 꼭 날개를 한 번 흔든다.»
Scene: A mountaintop under a starry sky with three moons: adult Luna sits on the grass watching the stars beside a huge, friendly silver-scaled dragon with red eyes that gently rests the tip of its tail by her side; the small plains house far below with a lit window.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #111 · `ending/cube_true_form` — 엔딩 «큐브의 정체»

- **저장**: `game/assets/ending/cube_true_form.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`, `game/assets/npc/cube.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/cube_true_form`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/cube_true_form · 엔딩 일러스트 «큐브의 정체» (히든)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «열여덟 생일 밤, 큐브는 나비넥타이 매듭 푸는 법을 루나에게만 알려 주었다. 매듭이 풀리자 하얀 몸통이 눈처럼 녹고 손바닥만 한 금빛 별 하나가 남았다. 하늘에 숨겨진 아기를 열 해 동안 품고 있다가 들판까지 데려다준 별똥별의 마지막 조각. 밤마다 백 번씩 깜박인 건 하늘에 보내는 "오늘도 무사함"이었고, 백 년 전 판화 속 아이 곁을 지킨 것도 이 별이었다. "이제 아가씨가 알려 주세요. 저는 뭐예요?" "우리 식구." 루나가 다시 매 준 나비넥타이는 판화 속 그것처럼 조금 삐뚤었다. 10년이 지난 지금도 큐브는 그 매듭 그대로 케이크를 들고 떠다닌다.»
Scene: The plains under three moons at night: adult Luna holds in her cupped hands a palm-sized glowing gold star wearing a tiny black bow tie (the true form of Cube, the butler fairy), both smiling; a small birthday cake on a blanket beside her, gold sparkles everywhere.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
Also in the scene: Cube in its true form: a palm-sized glowing gold star wearing the same tiny black bow tie as in the attached portrait (its white cube body is gone) — match the attached reference portrait(s), aged as described.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.
- Attached image 2 = npc/cube: reference portrait of Cube — keep its design cues, but draw it as described for this scene

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #112 · `ending/guardian_successor` — 엔딩 «보호자의 뒤를 잇다»

- **저장**: `game/assets/ending/guardian_successor.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/guardian_successor`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/guardian_successor · 엔딩 일러스트 «보호자의 뒤를 잇다» (히든)]
Epilogue summary (에필로그 요약 — 플레이마다 문장이 달라짐): Ten years later Luna has taken up the guardian's old calling (it differs by playthrough: royal knight, scholar, merchant, priest or adventurer) and has cleared the guardian's lost good name.
Scene: Golden hour on a hill overlooking the kingdom: adult Luna in a simple black-and-white coat with gold trim stands beside the guardian (seen only from behind), proudly wearing a small old emblem without writing that once belonged to the guardian; a sense of passing the torch, warm and tender.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #113 · `ending/legacy_sisters` — 엔딩 «자매들»

- **저장**: `game/assets/ending/legacy_sisters.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/legacy_sisters`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/legacy_sisters · 엔딩 일러스트 «자매들» (히든)]
Epilogue summary (에필로그 요약 — 플레이마다 문장이 달라짐): Ten years later, on nights when the three moons overlap, extra chairs are set at the table of the small plains house: Luna's "sisters" (star children from other lives, who share her silver hair and crimson eyes) visit, and leave before sunrise.
Scene: Night with three overlapping moons, the warm dining table of the small plains house: adult Luna sits with three or four young women who look like her sisters (the same silver-white hair and crimson eyes, each in a different modest travel outfit: a navy cape, a worn sword on the back, a lute case, a white pilgrim robe, a wool scarf), cups of tea, laughter; the guardian seen from behind at the head of the table.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold starlight, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

### #114 · `ending/ordinary_days` — 엔딩 «평범한 나날»

- **저장**: `game/assets/ending/ordinary_days.png` · 1280×720 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ending/ordinary_days`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.
[THIS IMAGE — ending/ordinary_days · 엔딩 일러스트 «평범한 나날» (생활/상업)]
Epilogue (에필로그 원문 — 이 장면의 바탕): «루나는 평원의 작은 집에서 멀지 않은 곳에 산다. 아침엔 빵집 일을 돕고, 오후엔 이웃 아이들 숙제를 봐 주고, 저녁이면 들러서 같이 밥을 먹는다. 대단한 이름은 없다. 다만 마을 사람 누구에게 물어도 "아, 그 은발 아가씨? 좋은 사람이지"라고 한다. 세 개의 달이 겹치는 밤이면 둘이 지붕에 올라가 그 이야기를 한다. 그거면 충분했냐고. 충분했다고.»
Scene: A quiet evening ten years later: Luna (about 28, simple white blouse and long dark skirt, apron folded on her arm) and the guardian, seen from behind, sitting side by side on the crooked roof of the small plains house under three overlapping moons; warm window light below, a basket of bread beside her, a few faint gold star sparkles.
Luna is shown as an ADULT WOMAN around 28 years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).
Costume accent for this ending: gold, on a black-and-white base.
If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Composition: cinematic key illustration for the ending screen; Luna is the clear main subject (not tiny), emotional moment, detailed background.
[FORMAT] landscape (가로) 16:9 — final file 1280×720 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18): keep the same face, hair and eye design, but draw her as the adult (~28) described above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, blood, gore, wounds, weapons pointed at the viewer, fighting, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes, Luna drawn as a child or young teenager (she is an adult here), the guardian's face, romantic contact between Luna and the guardian
```

---

## UI

### #115 · `ui/title_key` — 타이틀 키 비주얼

- **저장**: `game/assets/ui/title_key.png` · 1600×900 px · 목표 비율 16:9
- **첨부** (먼저 업로드, 이 순서로): `game/assets/ref/luna_sheet.png`
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ui/title_key`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[CHARACTER — 루나 Luna, the princess / 별의 아이]
- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.
- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.
- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).
- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).
- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.
- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.

[THIS IMAGE — ui/title_key · UI 일러스트]
타이틀 키 비주얼: 세 개의 달 아래 언덕, 기사 망토 보호자의 뒷모습과 손잡은 10세 루나, 옆에 반투명하게 겹친 18세 루나의 실루엣. 8년을 한 장에.
10-year-old Luna has child proportions; the overlapping 18-year-old Luna is a soft translucent silhouette with the same hair and eyes. If the guardian ("당신", the player — Luna's adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian's origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.
Leave calm empty space in the upper third for the game logo, but do NOT draw any text or logo.
[FORMAT] landscape (가로) 16:9 — final file 1600×900 px.

[REFERENCE IMAGES / 첨부 이미지]
- Attached image 1 = ref/luna_sheet: Luna's character sheet (ages 10–18 from left to right): keep EXACTLY the same face, hair, eye colour and design; draw her at the age stated above.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up, adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels, Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes
```

### #116 · `ui/album_cover` — 엔딩 앨범 표지

- **저장**: `game/assets/ui/album_cover.png` · 1600×900 px · 목표 비율 16:9
- **첨부**: 없음
- **저장 명령**: `node tools/gemini/fit.mjs --from=<다운로드한 파일> --key=ui/album_cover`

```text
[STYLE ANCHOR — 별의 공주 / Starborn Princess]
- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.
- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).
- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".
- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.
- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.
[THIS IMAGE — ui/album_cover · UI 일러스트]
엔딩 앨범 표지: 가죽 장정 앨범, 별 조각 장식, 책상 위, 촛불.
[FORMAT] landscape (가로) 16:9 — final file 1600×900 px.

[AVOID / 금지]
text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render, revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up
```

