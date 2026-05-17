/**
 * Dragon identity — symbolic, calm, protective. No fantasy roleplay.
 */

const CRINGE_RE =
  /\b(warrior|flames?|fire within|rise up|conquer|battle cry|mighty dragon|sárkány út|dragon path|ignite your|unleash|alpha|beast|forge your destiny|manifest|cosmic|ancient one)\b/i;

const CALM_OK =
  /\b(kapu|gate|depth|mélység|figyelem|attention|discipline|fegyelem|protect|véd|calm|nyugalom|focus|fókusz)\b/i;

/**
 * @param {string} line
 */
function isDragonCringe(line) {
  return CRINGE_RE.test(String(line || ""));
}

/**
 * @param {string} line
 */
function isDragonCalm(line) {
  const l = String(line || "");
  if (isDragonCringe(l)) return false;
  return l.length < 120 && (CALM_OK.test(l) || l.length < 70);
}

/**
 * Filter whisper pool to mature lines only.
 * @param {string[]} pool
 */
function filterDragonPool(pool) {
  const arr = (pool || []).filter((p) => !isDragonCringe(p));
  return arr.length ? arr : pool || [];
}

module.exports = { isDragonCringe, isDragonCalm, filterDragonPool, CRINGE_RE };
