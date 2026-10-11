// 이벤트 DSL 조건 평가기 (GDD 7.2)
// 지원 형식: "<path> <op> <value>"  또는  "<path>" (truthy)  또는  "!<path>"
// path: stat.int, pers.agree, rel.elda, flag.met_elda, age, month, season, stress, trust, gold,
//       stage, infamy, guardian, year(=age), mastery.sword, count.refusals ...
// op: >= <= > < == !=   value: 숫자 | '문자열' | true/false
const OPS = {
  '>=': (a, b) => a >= b, '<=': (a, b) => a <= b, '>': (a, b) => a > b,
  '<': (a, b) => a < b, '==': (a, b) => a == b, '!=': (a, b) => a != b,
};
const RE = /^\s*(!?)([\w.]+)\s*(?:(>=|<=|==|!=|>|<)\s*(.+?))?\s*$/;

export function resolvePath(state, path) {
  const parts = path.split('.');
  let cur = viewOf(state);
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

// 상태를 DSL에서 보기 좋은 평면 뷰로 노출
export function viewOf(s) {
  return {
    stat: s.stats, pers: s.personality, rel: s.relations, flag: s.flags,
    mastery: s.mastery, count: s.counters,
    age: s.age, month: s.month, season: s.season, stage: s.stage,
    stress: s.stress, trust: s.trust, gold: s.gold, infamy: s.infamy,
    reputation: s.reputation, guardian: s.guardian, gHealth: s.guardianHealth,
  };
}

function parseValue(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw.replace(/^['"]|['"]$/g, '');
}

export function evalCondition(state, expr) {
  if (typeof expr === 'function') return !!expr(state);
  const m = RE.exec(expr);
  if (!m) throw new Error('잘못된 조건식: ' + expr);
  const [, neg, path, op, rawVal] = m;
  const left = resolvePath(state, path);
  if (!op) return neg ? !left : !!left;
  const r = OPS[op](left ?? 0, parseValue(rawVal));
  return neg ? !r : r;
}

export function evalAll(state, conds) {
  if (!conds || conds.length === 0) return true;
  return conds.every(c => evalCondition(state, c));
}
