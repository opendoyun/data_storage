// 한국어 조사 자동 선택. 이름이 '루나'(받침 없음)든 '하린'(받침 있음)든 자연스럽게.
// 텍스트 토큰: {name} {name이} {name가} {name은} {name는} {name을} {name를} {name과} {name와} {name아} {name야} {name으로} {name로} {name이랑} {name랑} {name이에요} {name이야} {name이었}
export function hasBatchim(word) {
  const ch = String(word).trim().slice(-1);
  const code = ch.charCodeAt(0) - 0xAC00;
  // 비한글: 대략 처리. 숫자는 한자어 읽기 기준 — 0 영·1 일·3 삼·6 육·7 칠·8 팔은 받침, 2 이·4 사·5 오·9 구는 받침 없음
  if (code < 0 || code > 11171) return /[013678LMNRlmnr]$/.test(ch);
  return code % 28 !== 0;
}
// ㄹ 받침: '으로' 대신 '로'. 비한글은 1 일·7 칠·8 팔, 영문 l
function rieulFinal(word) {
  const ch = String(word).trim().slice(-1);
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return /[178lL]$/.test(ch);
  return code % 28 === 8;
}
const PAIRS = {
  '이': ['이', '가'], '가': ['이', '가'], '은': ['은', '는'], '는': ['은', '는'], '을': ['을', '를'], '를': ['을', '를'],
  '과': ['과', '와'], '와': ['과', '와'], '아': ['아', '야'], '야': ['아', '야'], '이랑': ['이랑', '랑'], '랑': ['이랑', '랑'],
  '이에요': ['이에요', '예요'], '이야': ['이야', '야'], '이었': ['이었', '였'], '이여': ['이여', '여'],
};
export function josa(word, particle) {
  if (particle === '으로' || particle === '로') return word + (hasBatchim(word) && !rieulFinal(word) ? '으로' : '로');
  const pair = PAIRS[particle];
  if (!pair) return word + particle;
  return word + (hasBatchim(word) ? pair[0] : pair[1]);
}
// '{name}' 계열 토큰 치환. 받침 있는 이름에 조사 없이 '{name}'만 쓰면 그대로.
// {call} 계열: 아이가 보호자를 부르는 호칭(출신별: 아빠/선생님/엄마/신부님). 조사 토큰 동일.
const TOKEN = /\{(name|call)(이랑|이에요|이었|으로|이야|이여|이|가|은|는|을|를|과|와|아|야|로|랑)?\}/g;
export function fillName(text, name, call = '아빠') {
  return String(text ?? '').replace(TOKEN, (_, who, p) => { const w = who === 'name' ? name : call; return p ? josa(w, p) : w; });
}
