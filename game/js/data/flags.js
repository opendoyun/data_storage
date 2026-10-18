// 공용 플래그 등록부 (콘텐츠 계약서 §6과 동일). 여러 파일이 공유하는 플래그만 여기 등록한다.
// setBy: 세팅 책임 배치. 검증기는 파일 단위 검사 때 이 플래그들을 '선언됨'으로 취급하고, 전체 검사 때 실제 세팅 여부를 확인한다.
export const PUBLIC_FLAGS = {
  met_elda: ['core', 'b01'], met_leon: ['core', 'b01'], magic_awake: ['core', 'b13', 'b05'], knows_origin: ['core', 'b05'],
  elda_secret_1: ['core', 'b05'], tower_choice_hers: ['core', 'b05'], tower_lessons: ['core', 'b05'],
  leon_promise: ['core', 'b11'], leon_love: ['core', 'b11'], ball_won: ['core', 'b09', 'b11'], tea_party: ['core', 'b09', 'b11'],
  stage_star: ['core', 'b08'], art_path: ['core', 'b04a'], scholar_path: ['core', 'b04b'], knight_path: ['core', 'b04a'],
  merchant_path: ['core', 'b04b'], church_path: ['core', 'b04b'], shadow_path: ['core', 'b12'],
  final_hers: ['core'], final_home: ['core'], ran_away: ['core', 'b03'], has_cat: ['core', 'b10'], respected_privacy: ['core', 'b03'],
  sea_path: ['b04a'], knight_oath_wander: ['b04a'], prima_debut: ['b04a'], dance_lessons: ['b09'], fashion_show: ['b04a'], masterwork: ['b04a'],
  star_watching: ['b13'], star_charts: ['b04b'], tutor_started: ['b02'], teacher_offer: ['b04b'], orphanage_vow: ['b04b'],
  ghost_friend: ['b08'], spy_recruited: ['b12'], theodora_pact: ['b11'], mother_alive: ['b05'], mother_found: ['b05'],
  dragon_egg: ['b07'], dragon_hatched: ['b07'], cube_secret_1: ['b01'], cube_secret_2: ['b13'],
  guardian_past_revealed: ['b06'], guardian_name_cleared: ['b06'], legacy_met: ['b14'],
  // 코어 이벤트 내부 플래그 (core 전용)
  roof_fixed: ['core'], debt_garrett: ['core'], stranger_asked: ['core'], guardian_confront: ['core'], read_letter: ['core'], open_talk: ['core'],
  allowance: ['core'], magic_hidden: ['core'], tower_refused: ['core'], origin_hidden: ['core'], guardian_sick: ['core'], final_guided: ['core'],
  secret_adventure: ['engine'], secret_night_work: ['engine'],
};
