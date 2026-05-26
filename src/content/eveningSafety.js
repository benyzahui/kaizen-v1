/**
 * Evening safety — calming release tone, not productive push.
 */

const PRODUCTIVE_EVENING_RE =
  /\b(crush|hustle|grind|10x|beast|manifest|push harder|még egy blokk|one more block|încă un bloc)\b/i;

const EVENING_SAFE_TONES = new Set(["release", "safety", "calm", "reflective", "grounded"]);

const EVENING_BLOCK_CATEGORIES = new Set(["activation", "warrior", "focus"]);

/**
 * @param {object} entry
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 */
function isEveningSafeContent(entry, phase) {
  const slot = phase === "late_night" ? "evening" : phase;
  if (slot !== "evening" && slot !== "late_night") return true;

  const text = [entry.text, entry.title, ...(entry.actions || [])].filter(Boolean).join(" ");
  if (PRODUCTIVE_EVENING_RE.test(text)) return false;

  if (entry.intensity === "high" && EVENING_BLOCK_CATEGORIES.has(entry.category)) {
    return false;
  }

  if (entry.emotionalTone && !EVENING_SAFE_TONES.has(entry.emotionalTone)) {
    if (entry.category === "discipline" && entry.intensity !== "low") return false;
  }

  return true;
}

/**
 * Prefer release/safety entries in evening pool.
 * @param {object[]} pool
 */
function sortEveningPool(pool) {
  const score = (e) => {
    let s = 0;
    if (EVENING_SAFE_TONES.has(e.emotionalTone)) s += 3;
    if (e.category === "recovery" || e.category === "letting_go" || e.category === "overload") s += 2;
    if (e.intensity === "low") s += 1;
    if (e.category === "warrior" || e.category === "activation") s -= 3;
    return s;
  };
  return [...pool].sort((a, b) => score(b) - score(a));
}

module.exports = {
  PRODUCTIVE_EVENING_RE,
  EVENING_SAFE_TONES,
  isEveningSafeContent,
  sortEveningPool
};
