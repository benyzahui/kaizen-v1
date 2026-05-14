/**
 * Detects high-intensity stuck themes (static keywords, multilingual).
 * Does not diagnose; only flags when messaging looks like a spiral loop.
 */

const PATTERNS = [
  {
    kind: "spiral",
    re: /(hopeless|spiraling|can't cope|cant cope|panic|dying inside|want to die|end it all|reménytelen|összeoml|képtelen vagyok|pánik|disperat|nu mai pot|panică)/i
  },
  {
    kind: "trading",
    re: /(revenge trade|all in|yolo|fomo|margin call|impuls|chase the loss|mind be|totul in|totul pe|leveraged|100x)/i
  },
  {
    kind: "burnout",
    re: /(burnout|exhausted|can't sleep|cant sleep|no energy|dead inside|kiégett|fáradt vagyok|epuizat|nu mai am energie)/i
  },
  {
    kind: "sabotage",
    re: /(always mess up|self.?sabotage|ruin everything|mindig elront|stric tot|nu merit)/i
  }
];

function detectPatternKind(text) {
  const t = String(text || "");
  for (const p of PATTERNS) {
    if (p.re.test(t)) return p.kind;
  }
  return null;
}

module.exports = { detectPatternKind, PATTERNS };
