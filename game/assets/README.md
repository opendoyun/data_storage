# 자산 규격 (이미지는 제미나이로 생성)

게임은 아래 경로에 PNG가 **있으면 자동으로 사용**하고, 없으면 내장 SVG/CSS 플레이스홀더를 보여줍니다.
파일을 넣고 새로고침만 하면 됩니다. 코드 수정 불필요.

| 경로 | 수량 | 용도 | 권장 크기 |
|------|------|------|-----------|
| `char/{stage}_{cat}.png` | 20 | 아이 초상. stage = `child`(10~11) `girl`(12~13) `teen`(14~15) `youth`(16~17) `adult`(18, 엔딩) / cat = 우세 능력 범주 `body` `mind` `social` `inner` | 768×1040 (세로 3:4), 배경 투명 또는 단색 |
| `bg/room_{season}.png` | 4 | 이벤트 기본 배경(거실). season = `spring` `summer` `autumn` `winter` | 1280×560 (16:7) |
| `bg/festival_spring.png` `bg/school.png` `bg/festival_harvest.png` `bg/starnight.png` | 4 | 분기 고정 이벤트 배경 | 1280×560 |
| `npc/{id}.png` | 6 | NPC 초상 (이벤트 상단). id = `cube` `loren` `garrett` `elda` `leon` `theodora` | 1280×560 (상반신, 좌측 배치) |

프롬프트 전문은 `gemini-prompts.md` 참조. 생성한 파일을 위 이름으로 저장하세요.
