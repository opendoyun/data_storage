// 「별의 공주」 제미나이 프롬프트 키트 — 모든 이미지 프롬프트의 공통 재료.
// 정본: docs/game-design/character-design.md (공주 외형·나이 원칙은 반드시 그 문서를 따른다).
// 이 파일을 고치면 `node tools/gemini/build-manifest.mjs` 로 매니페스트를 다시 만든다.
// 특정 작가·작품의 화풍을 지명하거나 흉내 내는 문구를 넣지 않는다.

// ── 공통 스타일 앵커 (모든 프롬프트 맨 앞에 들어간다) ─────────────────────────
export const STYLE_ANCHOR = [
  '[STYLE ANCHOR — 별의 공주 / Starborn Princess]',
  '- Clean-line 2D anime illustration: crisp thin lineart, cel shading with soft gradient shadows, gentle luminous lighting, polished game-art finish. 깨끗한 선의 애니메이션 셀 채색, 부드러운 그라데이션 그림자.',
  '- World: medieval-fantasy kingdom "Celestia" (셀레스티아) under THREE moons (세 개의 달). Royal capital (palace, nobles), harbor city (trade, inns), rural plains (fields, herb witch, a small family house).',
  '- Palette: black-and-white costume base, ivory skin, silver-white hair, warm gold accents (#e7c36a), deep indigo night sky (#1d1631). Gold four-point star sparkles (금색 4각 별 반짝임) are the visual motif of the "star child".',
  '- Mood: warm, wholesome, gentle; for a 12+ rated family life-sim game. Everyone is dressed modestly and drawn in a non-sexualised way; natural poses, eye-level camera.',
  '- Absolutely no text of any kind in the image: no letters, captions, signs with writing, labels, logos, watermarks or signatures.',
].join('\n');

// ── 공주(루나) 캐릭터 바이블 (character-design.md v2 요약) ────────────────────
export const LUNA_BIBLE = [
  '[CHARACTER — 루나 Luna, the princess / 별의 아이]',
  '- Hair: silver-white (almost pure white) long STRAIGHT hair reaching the waist; straight-cut bangs lightly covering the eyebrows; long side locks framing the face; hair tips lightly fluttering. 은백색 긴 생머리, 일자 앞머리, 긴 옆머리.',
  '- Eyes: crimson red eyes, large irises with bright highlights; calm, slightly sleepy/drowsy gaze; faint blush on the cheeks. 붉은(크림슨) 눈, 차분하고 살짝 나른한 눈매.',
  '- Skin: fair ivory. Small silver star-shaped hairpin (별 모양 은 머리핀).',
  '- Signature: a few small GOLD four-point star sparkles floating around her (more when her magic is strong).',
  '- Costume rule: black-and-white base outfit + exactly ONE accent colour + gold sparkles.',
  '- Modesty rule (every age, 10 to 28): wholesome and age-appropriate. High or modest neckline, sleeves that cover the shoulders, skirt or trousers well below the knee (ankle-length preferred), nothing tight, sheer or cut out. Relaxed natural pose, eye-level camera. 나이에 맞는 체형, 단정한 옷차림.',
].join('\n');

// 성장 단계(초상 char/{stage}_{cat}) — 나이별 체형 원칙. 모든 단계에서 나이에 맞는 체형·단정한 옷.
export const STAGE_INFO = {
  child: { age: 10, ko: '10세 유년기', en: 'a 10-year-old child: round soft face, big head relative to body, short limbs, small child stature, innocent look' },
  girl:  { age: 12, ko: '12세 소녀기', en: 'a 12-year-old girl: still a child\'s face, slightly longer limbs than at 10, slim child build' },
  teen:  { age: 14, ko: '14세 사춘기', en: 'a 14-year-old young teen girl: youthful face, slender youthful build, no adult curves' },
  youth: { age: 16, ko: '16세 청년기', en: 'a 16-year-old teenage girl: youthful teen proportions, graceful but modest' },
  adult: { age: 18, ko: '18세 성인 직전', en: 'an 18-year-old young woman on the verge of adulthood: youthful face, elegant yet plain and modest' },
};

// 범주별 의상 (character-design.md 표). accent = 포인트 색 한 가지.
export const CAT_OUTFIT = {
  body: {
    ko: '신체', accent: 'crimson red (진홍)',
    outfit: 'loose black training tunic (not tight) over white shirt sleeves, leather bracers on the forearms, black trousers and boots',
    props: 'a wooden practice sword (목검)', pose: 'standing tall and confident, proud smile',
  },
  mind: {
    ko: '지성', accent: 'indigo-violet (남보라)',
    outfit: 'black scholar\'s robe over a white high-neck knit sweater',
    props: 'a thick book held in one arm, a tiny star-light spell glowing at her fingertip', pose: 'calm, intelligent expression',
  },
  social: {
    ko: '사교', accent: 'gold (금색)',
    outfit: 'white ribbed high-neck knit sweater with long sleeves + ankle-length black long skirt with NO slit, black flat shoes',
    props: 'one hand lightly raised as gold sparkles land on her fingers', pose: 'graceful, elegant, soft smile',
  },
  inner: {
    ko: '내면', accent: 'green (녹색)',
    outfit: 'long white robe with a black shawl over the shoulders, a small gold pendant',
    props: 'a bundle of herbs (or a small lute)', pose: 'serene, peaceful expression, soft glow behind her',
  },
};

// 단계×범주 세부 연출 (같은 의상이라도 나이에 따라 소품·분위기가 자란다)
export const STAGE_CAT_NOTES = {
  child_body: 'the wooden sword is a bit too big for her; small tunic; plaster on one cheek, cheerful grin',
  child_mind: 'the book is almost as big as her torso; curious wide eyes',
  child_social: 'small black ribbon in the hair; tiny curtsy-like pose, a little shy',
  child_inner: 'a small basket of herbs held with both hands',
  girl_body: 'wooden sword resting on the shoulder, determined look',
  girl_mind: 'reading while walking, a quill tucked behind the ear',
  girl_social: 'practising a polite greeting, hands neatly folded',
  girl_inner: 'holding a sprig of chamomile, gentle smile',
  teen_body: 'gripping the wooden sword in a ready stance (not pointed at viewer), focused eyes',
  teen_mind: 'a faint violet magic circle under her fingertip, book open',
  teen_social: 'turning slightly as if about to greet someone, hair swaying',
  teen_inner: 'eyes half closed as if listening to the wind, herbs in hand',
  youth_body: 'wooden sword lowered at her side, calm confidence, light dust in the air',
  youth_mind: 'several small books floating around her, star-light spell brighter',
  youth_social: 'poised posture, gold sparkles gathering on her raised hand',
  youth_inner: 'holding a small lute, peaceful smile',
  adult_body: 'a real sword in a scabbard instead of a wooden one, short black cape with crimson lining; dignified',
  adult_mind: 'magic-tower robe with indigo-violet trim, star-light blooming at her fingertip',
  adult_social: 'small simple silver tiara; same modest high-neck knit and long skirt, now elegant',
  adult_inner: 'pure white robe with black shawl, gold pendant glowing softly',
};

// ── NPC 보강 메모 (images.js 설명에 덧붙는다; character-design.md 색 메모 반영) ─────
export const NPC_NOTES = {
  cube: 'Cube is a palm-sized butler fairy: a WHITE cube-shaped body with a small BLACK bow tie (black-and-white like the princess), translucent wings with a faint gold glow, small dot eyes. Not a human.',
  loren: 'woman in her 50s, dignified, modest high-collared long-sleeved dress.',
  garrett: 'man in his 40s, broad-shouldered, friendly; sword stays sheathed on his back.',
  elda: 'ageless woman, kind; long white hair (pure white, wavy — clearly different from the princess\'s straight silver-white hair).',
  leon: 'a 13-year-old boy with child proportions: golden blond hair, blue eyes, navy-blue commoner clothes with suspiciously fine buttons.',
  theodora: 'a 13-year-old girl with child proportions: golden blond hair in vertical ringlet curls, red ribbon, modest long-sleeved CRIMSON dress (her crimson contrasts the princess\'s black-and-white).',
  envoy: 'man in his 30s, cold and polite; hood down so the face is visible.',
  archbishop: 'man in his 70s, gentle but piercing eyes.',
  guildmaster: 'plump woman in her 50s, clever smile; the ledger shows no readable writing.',
  shadow: 'young man in black; half of his face in shadow; mysterious but not threatening; no weapons.',
  troupe: 'flamboyant man in his 40s, feathered hat, curled moustache.',
  knight_cpt: 'woman knight in her 30s, short black hair, white armour, royal cape; stern but fair.',
};

// 엔딩(10년 뒤)에 NPC가 등장할 때의 모습 — 참조 초상은 13세/현재 모습이므로 나이 보정
export const NPC_IN_ENDING = {
  cube: 'Cube, the white cube-shaped butler fairy with a black bow tie (unchanged, it does not age)',
  loren: 'Madame Loren, now in her 60s, silver hair, black velvet dress',
  garrett: 'Garrett, now in his 50s with grey streaks in his short red-brown hair, scar on cheek, leather armour',
  elda: 'Elda the herb witch, ageless, long white hair, green shawl',
  leon: 'Leon, now an adult man around 28, golden blond hair and blue eyes as in his reference, simple navy clothes',
  theodora: 'Theodora, now an adult woman around 28, golden blond ringlets, crimson dress with long sleeves',
};

// 프롬프트 본문에서 NPC 이름을 자동 감지할 때 쓰는 고유명 (보조 NPC는 직함이라 자동 감지하지 않음)
export const NPC_NAME_PATTERNS = {
  cube: /큐브/, loren: /로렌/, garrett: /가렛/, elda: /엘다/, leon: /리온/, theodora: /테오도라/,
};

// ── 엔딩 일러스트 ───────────────────────────────────────────────────────────
export const ENDING_AGE = 28; // 엔딩 화면 제목이 "10년 후" → 18세 + 10년

export const LUNA_ADULT = `Luna is shown as an ADULT WOMAN around ${ENDING_AGE} years old (ten years after she turned 18): same face and features as the character sheet but mature and calm, same waist-length silver-white straight hair, crimson eyes, gold star sparkles. Dressed modestly (covered shoulders and chest, long sleeves or a cape, long skirt or trousers).`;

export const GUARDIAN_RULE = 'If the guardian ("당신", the player — Luna\'s adoptive parent) appears, show them ONLY from behind, as a distant silhouette, or as hands, never their face (the guardian\'s origin and gender vary by player). The guardian is a PARENT figure; nothing romantic between them.';

// 엔딩 범주 → 포인트 색·대표 배경 (확장 엔딩도 자동으로 여기서 기본값을 얻는다)
export const ENDING_CAT_STYLE = {
  '왕실/정치': { accent: 'gold', setting: 'royal palace of the capital, marble, banners with a three-moon crest' },
  '무예':      { accent: 'crimson red', setting: 'training grounds, roads and harbor docks of the kingdom' },
  '학문/마법': { accent: 'indigo-violet', setting: 'the magic tower and the royal academy library, floating books, star-light' },
  '예술/문화': { accent: 'green', setting: 'theater, concert hall or a sunlit studio in the capital' },
  '생활/상업': { accent: 'gold', setting: 'harbor market, warehouses, a cozy shop or the golden plains' },
  '신앙':      { accent: 'green', setting: 'cathedral with stained-glass light, village roads' },
  '어둠':      { accent: 'deep crimson', setting: 'night alleys and rooftops of the harbor city, lanterns, mist (no violence)' },
  '관계':      { accent: 'green', setting: 'the small house on the plains, warm everyday light' },
  '히든':      { accent: 'gold starlight', setting: 'the plains under three moons, magical starry sky' },
};

// 핵심 엔딩 장면 연출 (id별). 없는 id(확장 엔딩)는 에필로그 + 범주 기본값으로 만든다.
// npcs: 장면에 실제로 그릴 NPC (지정하면 에필로그 자동 감지를 덮어쓴다) · npcNotes: 이 장면에서만 쓰는 NPC 모습(NPC_IN_ENDING 대신)
// summary: 함수형 에필로그(출신·이전 회차마다 달라짐)의 영어 요약. 함수 소스가 프롬프트로 새지 않게 이것을 쓴다.
export const ENDING_SCENES = {
  queen: { scene: 'Queen Luna on the palace balcony at dusk, a small simple crown, modest black-and-white royal gown with gold trim and a long cape; below her the capital glows with lanterns under three bright moons', npcs: [] },
  duchess: { scene: 'Winter evening: Luna as a duchess in an elegant black coat with gold trim steps out of a noble carriage in front of the small snow-covered house on the plains, warm light in the window, she smiles like coming home', npcs: [] },
  diplomat: { scene: 'Luna as a diplomat at a round negotiation table in a grand hall, envoys of several nations seen as backs/silhouettes, tea cups and a map without writing, she speaks calmly and everyone listens', npcs: [] },
  chancellor: { scene: 'Luna as the youngest chancellor in black robes with a gold chain of office, signing a decree at a large desk in a high palace office, window overlooking the capital and the far plains; papers show no readable writing', npcs: [] },
  guard_captain: { scene: 'Luna, captain of the royal guard, on her day off: white armour breastplate and crimson cape, kneeling on the roof of the small plains house with a hammer fixing shingles, cape draped over the chimney, laughing in the sun', npcs: [] },
  mercenary_king: { scene: 'Harbor docks: Luna, the silver-haired mercenary captain in leather armour with a crimson scarf, sword sheathed on her back, handing candy to delighted harbor children; Garrett grins proudly behind her', npcs: ['garrett'] },
  adventurer: { scene: 'Luna as an adventurer with a travel cloak and backpack standing on a cliff above an unexplored valley with ancient ruins, holding a pressed dried flower tucked into a letter', npcs: [] },
  bounty_hunter: { scene: 'Luna as a bounty hunter in a dark travel coat with crimson accents at a crossroads at dusk, a wanted poster with no readable writing pinned to a signpost, calm and resolute; no weapons drawn', npcs: [] },
  archmage: { scene: 'The highest room of the magic tower: Luna as archmage in black-and-white robes with indigo-violet trim opens a round window toward the distant plains, floating books and constellations of star-light around her', npcs: [] },
  royal_scholar: { scene: 'Royal academy library: Luna as a royal scholar holding her first published book (cover without readable title), star diagrams on the desk, warm dusty sunbeams', npcs: [] },
  alchemist: { scene: 'A back-alley laboratory in the harbor city: Luna as an alchemist with an apron over her black-and-white outfit hands a glowing potion bottle to a poor mother and child, glass vials and a warm lamp', npcs: [] },
  herb_doctor: { scene: 'The herb hut she inherited from Elda: Luna as a herb doctor in a white robe with black shawl tends an old farmer, dried herbs hanging from the ceiling, a green shawl hanging by the door as a keepsake', npcs: [] },
  court_musician: { scene: 'A royal concert hall: Luna as court musician playing a lute on stage in a black-and-white gown with green accent, audience as soft silhouettes humming along, ten small candles on the stage edge', npcs: [] },
  stage_star: { scene: 'Theater curtain call: Luna as a stage star in a modest long stage costume bowing under spotlights, flowers on the stage, her eyes searching for one seat in the audience', npcs: [] },
  painter: { scene: 'A sunlit painter\'s studio: Luna as a painter in a paint-stained apron paints a canvas showing three moons over a small house with a crooked roof, a small cat napping on the windowsill', npcs: [] },
  writer: { scene: 'A writer\'s study at night: Luna writing with a quill beside a finished book and a candle, window showing three moons, cozy and tender', npcs: [] },
  merchant_lord: { scene: 'Harbor warehouses: Luna as a great merchant in a fine black coat with gold accents holding an open leather ledger (no readable writing), ships being unloaded behind her, busy clerks small in the background', npcs: [] },
  farm_owner: { scene: 'Harvest festival on the plains: Luna as a farm owner in work clothes with rolled sleeves lifting a huge log in the log-lifting contest, cheering crowd, golden wheat fields; the guardian seen from behind in the front row', npcs: [] },
  chef: { scene: 'A cozy restaurant: Luna as a chef in a white chef coat and black apron proudly presents a slightly burnt pie, warm kitchen light, patrons smiling in the background, menu board without readable writing', npcs: [] },
  innkeeper: { scene: 'The harbor inn "Three Moons" (sign shows only a three-moon emblem): Luna as innkeeper behind a wooden counter smiling at a hooded guest, fireplace and lanterns', npcs: [] },
  archbishop: { scene: 'Cathedral: Luna, the first woman archbishop, in white-and-gold vestments with a black stole gives her first sermon from the pulpit, stained-glass light; the guardian seen from behind in the last pew', npcs: [] },
  saint: { scene: 'A village road: Luna as a saint in a simple white robe with black shawl hands herbs to a recovering villager, people gathered with grateful faces, she modestly shakes her head with a gentle smile', npcs: [] },
  pilgrim: { scene: 'A long road across the kingdom at sunrise: Luna as a pilgrim with a staff, travel cloak and worn boots walking toward distant mountains', npcs: [] },
  assassin: { scene: 'Night rooftops of the harbor city under three moons: Luna in a dark hooded cloak with crimson lining, half of her face in shadow, no weapon visible; far below, the mailbox of the small plains house glints with a gold coin', npcs: [] },
  bandit_boss: { scene: 'A mountain pass: Luna as the leader of an outlaw band in rugged black leather with a crimson scarf, on horseback, waving a poor farmer\'s cart through untouched; her band in the background; no violence', npcs: [] },
  swindler: { scene: 'An elegant salon: Luna as a charming swindler in a black-and-white suit with gold accents, holding a playing card and a masquerade mask, a sly smile', npcs: [] },
  royal_wedding: { scene: 'Countryside: Luna and Prince Leon as a married adult couple in simple modest clothes laughing together hand in hand in front of a country cottage, a royal carriage giving up and turning back in the distance; warm and wholesome, affectionate but chaste (holding hands at most)', npcs: ['leon'] },
  family_home: { scene: 'Morning in the small plains house, now with one more room: Luna opens the curtains to the sunrise, Cube floats beside her holding a cake, the guardian seen from behind at the breakfast table', npcs: ['cube'] },
  drifter: { scene: 'A faraway hilltop road: Luna as a lone traveller, cloak fluttering, looks back toward the distant plains with a letter in her hand, bittersweet golden hour', npcs: [] },
  star_goddess: { scene: 'Night with three moons aligned: Luna descends from a starry sky in a white-and-black gown wrapped in gold starlight and countless gold four-point sparkles, a fourth moon shining right above the small plains house', npcs: [] },
  world_traveler: { scene: 'Luna as a world traveller with a backpack and a map at a viewpoint over a foreign harbor city at sunrise; in the foreground, a wall map full of pins and a stack of letters (no readable writing)', npcs: [] },
  time_reverse: { scene: 'Luna as an archmage seals a glowing clock-like magic circle into a small silver key and places the key in the guardian\'s hands (only hands visible), indigo and gold star-light', npcs: [] },
  // ── 확장 엔딩 (endings_ext.js) ──
  ship_captain: { scene: 'The deck of a merchant sailing ship on a bright windy sea (no readable name on the hull): Luna as the ship\'s captain in a long black captain\'s coat with crimson trim stands at the wheel, hair streaming in the wind, tying a sailor\'s knot; the home harbor and the far plains on the horizon', npcs: [] },
  knight_errant: { scene: 'A country road at dawn: Luna as a wandering knight in plain steel-and-black armour with a crimson cloak, sword sheathed, carrying a round shield painted with a simple emblem of one small roof under three moons (no writing), helping an old villager carry a heavy basket', npcs: [] },
  prima_dancer: { scene: 'A grand theater stage: Luna as the prima dancer in a modest long-sleeved high-neck black-and-white gown with an ankle-length flowing skirt, mid graceful turn, gold star sparkles streaming from her fingertips over the audience; the audience are soft silhouettes and one seat at the very back is empty', npcs: [] },
  tailor_master: { scene: 'A tailor\'s boutique on an avenue of the capital: Luna as a master dressmaker in a black-and-white work dress with a measuring tape around her neck sews a tiny gold star into the lining of a black coat; mannequins wear elegant modest black-and-white garments; the shop sign shows only a needle and a star emblem (no writing)', npcs: [] },
  master_smith: { scene: 'A blacksmith\'s forge: Luna as a master smith in a heavy leather apron over a long-sleeved black work shirt, hair tied back, lifts a softly glowing star-metal blade with tongs; simple farm sickles hang on the wall, young apprentices watch from the background, warm sparks', npcs: [] },
  village_teacher: { scene: 'A sunny village schoolroom: Luna as a gentle teacher with sleepy crimson eyes, in a modest black-and-white dress with a green shawl, holds a worn old chalk box while small children at wooden desks raise their hands; the chalkboard shows only star doodles (no writing)', npcs: [] },
  astronomer: { scene: 'The top of a lighthouse at night turned into an observatory: Luna as an astronomer beside a brass telescope with star charts (no writing) spread out, three moons in the sky and a faint fourth light near the horizon; indigo-violet accents', npcs: [] },
  orphanage_head: { scene: 'The doorway of an orphanage called "House of Lanterns" (the sign shows only a lantern emblem) at night: Luna as its head kneels to tuck a blanket around a newly arrived small child in warm lantern light; a kind young man (the house\'s first teacher, about 19) smiles in the background', npcs: [] },
  royal_spy: { scene: 'A lantern-lit night market in the harbor city: Luna as a royal spy disguised as a roasted-chestnut seller in a hooded dark coat with a few small half-moon buttons on the collar, glancing sideways with a knowing smile, light mist; no weapons', npcs: [] },
  medium: { scene: 'Dusk at Luna\'s doorway, where a blue lantern hangs: Luna as a medium in black-and-white with a gentle smile welcomes a translucent, peaceful, smiling ghost of a little girl in an old-fashioned modest dress (not scary at all) together with a living traveller; soft blue and gold light, a basket of fresh bread', npcs: [] },
  rival_partner: { scene: 'The headmistresses\' office of a school in the capital: Luna and Theodora, both adults, sit at two identical desks pushed side by side, playfully competing over a board game while students peek in through the door; Luna in black-and-white with a green accent, Theodora in crimson; friendly rivalry', npcs: ['theodora'] },
  mother_reunion: { scene: 'A snowy northern village at night: adult Luna and her birth mother Serafine, a gentle woman in her late forties with long silver hair and a warm winter cloak, light the street lanterns house by house together, singing softly; warm lantern glow on the snow, gold sparkles drifting', npcs: [] },
  dragon_friend: { scene: 'A mountaintop under a starry sky with three moons: adult Luna sits on the grass watching the stars beside a huge, friendly silver-scaled dragon with red eyes that gently rests the tip of its tail by her side; the small plains house far below with a lit window', npcs: [] },
  cube_true_form: { scene: 'The plains under three moons at night: adult Luna holds in her cupped hands a palm-sized glowing gold star wearing a tiny black bow tie (the true form of Cube, the butler fairy), both smiling; a small birthday cake on a blanket beside her, gold sparkles everywhere', npcs: ['cube'],
    npcNotes: { cube: 'Cube in its true form: a palm-sized glowing gold star wearing the same tiny black bow tie as in the attached portrait (its white cube body is gone)' } },
  guardian_successor: {
    summary: 'Ten years later Luna has taken up the guardian\'s old calling (it differs by playthrough: royal knight, scholar, merchant, priest or adventurer) and has cleared the guardian\'s lost good name.',
    scene: 'Golden hour on a hill overlooking the kingdom: adult Luna in a simple black-and-white coat with gold trim stands beside the guardian (seen only from behind), proudly wearing a small old emblem without writing that once belonged to the guardian; a sense of passing the torch, warm and tender', npcs: [] },
  legacy_sisters: {
    summary: 'Ten years later, on nights when the three moons overlap, extra chairs are set at the table of the small plains house: Luna\'s "sisters" (star children from other lives, who share her silver hair and crimson eyes) visit, and leave before sunrise.',
    scene: 'Night with three overlapping moons, the warm dining table of the small plains house: adult Luna sits with three or four young women who look like her sisters (the same silver-white hair and crimson eyes, each in a different modest travel outfit: a navy cape, a worn sword on the back, a lute case, a white pilgrim robe, a wool scarf), cups of tea, laughter; the guardian seen from behind at the head of the table', npcs: [] },
};

// ── 금지 목록 (negative) ─────────────────────────────────────────────────────
export const NEG_BASE = 'text, letters, words, numbers, captions, speech bubbles, labels, signs with writing, watermark, signature, logo, UI elements, frame, border, low quality, blurry, jpeg artifacts, extra fingers, malformed hands, extra limbs, distorted face, photorealistic, 3D render';
// 안전 필터 오작동을 피하려고 노골적인 단어 대신 "피할 옷차림·구도"로만 적는다.
export const NEG_MODEST = 'revealing or skimpy clothing, low or plunging neckline, off-shoulder or bare shoulders, bare midriff, sleeveless top, short skirt, shorts, bare thighs, skirt slit, see-through or sheer fabric, cut-outs, swimwear, tight or body-hugging clothing, provocative or flirtatious pose, pose or camera angle that emphasizes the body, low camera angle looking up';
// 미성년 단계(10~14세)와 16·18세를 나눈다: 18세 그림에 "성인 비율 금지"를 넣으면 지시가 서로 부딪힌다.
export const NEG_MINOR = 'adult body proportions, older-looking face, curvy or developed figure, emphasized chest or hips, heavy makeup, lipstick, high heels';
export const NEG_TEEN_OLDER = 'curvy or voluptuous figure, emphasized chest or hips, heavy makeup, lipstick, high heels, looking older than 18';
export const negForAge = (age) => (age != null && age >= 16 ? NEG_TEEN_OLDER : NEG_MINOR);
export const NEG_LUNA = 'Luna drawn off-model: Luna with blonde, black or brown hair, Luna with short, wavy or curly hair or twin tails, Luna with blue, purple or green eyes';
export const NEG_DUPLICATE = 'duplicate characters, two copies of the same girl';
export const NEG_VIOLENCE = 'blood, gore, wounds, weapons pointed at the viewer, fighting';
export const NEG_BG = 'large foreground figures, close-up people, readable signs';
