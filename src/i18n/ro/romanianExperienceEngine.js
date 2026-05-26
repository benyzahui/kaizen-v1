/**
 * Romanian experience engine — pick, validate, anti calque / EN leak.
 */

const { pickSeeded } = require("../../personality/kaizenVoice");
const { languageLockScore } = require("../hardLanguageLock");
const { scoreHungarian, scoreRomanian } = require("../languageDetect");
const {
  getPool,
  POOL_KEYS,
  greetings,
  morningActivation,
  eveningRecovery,
  warriorMode,
  stabilization,
  overload,
  discipline,
  tradingPsychology,
  emotionalReset
} = require("./romanianExperiencePools");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|manifest|sigma|limitless|hajrá|motivațional)\b/i;

const EN_LEAK_STRICT =
  /\b(the |your |you need to|feel free|how can i help|let me know|one block|watch for|morning\.|evening\.|try to |i am here|i'm here)\b/i;

/** Hungarian calques / leaked HU structures in RO output */
const HU_CALQUE_RE =
  /\b(egy |kettő |hogy |fókusz|szétesek|köszönöm|nyugi|nem kell|elég hogy|majd |sáv\b|védd a |lassíts|túl sok nyitott|hajrá)\b|[őű]/i;

const POETIC_RE =
  /\b(sufletul dansează|universul îți|destinul tău cosmic|energia cosmică)\b/i;

/**
 * @param {string} text
 */
function isNativeRomanianTone(text) {
  const t = String(text || "").trim();
  if (t.length < 4) return false;
  if (HYPE_RE.test(t) || POETIC_RE.test(t)) return false;
  if (HU_CALQUE_RE.test(t)) return false;
  if (EN_LEAK_STRICT.test(t) && scoreRomanian(t) < scoreHungarian(t) + 2) return false;
  return true;
}

/**
 * @param {string} text
 */
function hasHungarianCalque(text) {
  return HU_CALQUE_RE.test(String(text || ""));
}

/**
 * @param {string} text
 */
function hasEnglishLeak(text) {
  return EN_LEAK_STRICT.test(String(text || ""));
}

/**
 * @param {string} body
 * @param {number} [minScore]
 */
function validateRomanianOutput(body, minScore = 80) {
  const t = String(body || "").trim();
  if (!t) return { ok: false, reason: "empty" };
  if (hasHungarianCalque(t)) return { ok: false, reason: "hu_calque" };
  if (hasEnglishLeak(t) && languageLockScore(t, "ro") < minScore) {
    return { ok: false, reason: "en_leak" };
  }
  if (!isNativeRomanianTone(t)) return { ok: false, reason: "tone" };
  if (languageLockScore(t, "ro") < minScore) return { ok: false, reason: "lock_score" };
  return { ok: true, score: languageLockScore(t, "ro") };
}

/**
 * @param {string} category
 * @param {string} [seed]
 */
function pickRomanianLine(category, seed = "ro") {
  const pool = getPool(category);
  if (!pool.length) return null;
  const items = pool.map((e) => (typeof e === "string" ? e : e.text));
  const filtered = items.filter(isNativeRomanianTone);
  if (!filtered.length) return null;
  return pickSeeded(filtered, seed);
}

/**
 * @param {string} category
 * @param {string} atmosphere
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {string} seed
 */
function pickRomanianMantra(category, atmosphere, phase, seed) {
  const pool = getPool(category);
  if (!pool.length) return null;
  const entry = pickSeeded(pool, `${seed}|${category}|${atmosphere}|${phase}`);
  if (!entry) return null;
  const text = typeof entry === "string" ? entry : entry.text;
  const id = typeof entry === "string" ? null : entry.id;
  if (!isNativeRomanianTone(text)) return null;
  return { text, id };
}

/**
 * Map atmosphere + phase → native pool category.
 */
function resolveRomanianCategory(atmosphere, phase, timeSlot) {
  const isEvening =
    phase === "evening" || timeSlot === "evening" || timeSlot === "late_night";
  const isMorning = phase === "morning" || timeSlot === "morning";
  const isMidday = phase === "midday" || timeSlot === "midday";

  if (atmosphere === "overloaded") return "overload";
  if (atmosphere === "warrior" && isMorning) return "warriorMode";
  if (atmosphere === "warrior") return "warriorMode";
  if (isEvening && (atmosphere === "recovery" || atmosphere === "reflective" || atmosphere === "emotional")) {
    return "eveningRecovery";
  }
  if (isMorning && (atmosphere === "calm" || atmosphere === "grounded" || atmosphere === "warrior")) {
    return "morningActivation";
  }
  if (isMidday) return "middayCorrection";
  if (atmosphere === "emotional") return "emotionalReset";
  if (atmosphere === "recovery") return "eveningRecovery";
  return "stabilization";
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 * @param {string} atmosphere
 * @param {string} timeSlot
 * @param {string} seed
 */
function pickRomanianNativeMantra(phase, atmosphere, timeSlot, seed) {
  const category = resolveRomanianCategory(atmosphere, phase, timeSlot);
  return pickRomanianMantra(category, atmosphere, phase, seed);
}

function poolStats() {
  const stats = {};
  for (const key of POOL_KEYS) {
    stats[key] = getPool(key).length;
  }
  return stats;
}

module.exports = {
  HYPE_RE,
  HU_CALQUE_RE,
  EN_LEAK_STRICT,
  isNativeRomanianTone,
  hasHungarianCalque,
  hasEnglishLeak,
  validateRomanianOutput,
  pickRomanianLine,
  pickRomanianMantra,
  resolveRomanianCategory,
  pickRomanianNativeMantra,
  poolStats,
  greetings,
  morningActivation,
  eveningRecovery,
  warriorMode,
  stabilization,
  overload,
  discipline,
  tradingPsychology,
  emotionalReset
};
