/**
 * Relationship energy — rhythm memory, relational stay, curiosity, comfort.
 */

const { pickSeeded } = require("../personality/tone");
const { getTimeSlot } = require("../core/timeContext");
const { getResponses } = require("../i18n/getResponses");

const SELF_HELP_RE =
  /\b(optimize|optimization|level up|productivity hack|unlock your potential|10x|hustle culture|be your best self|high performance mindset|maximize output|grind set|alpha mindset|sigma)\b/i;

const RELATIONAL_STAY_RE =
  /(csak kifáradt|csak fáradt|kifáradtam|most csak kifáradt|just tired|only tired|only exhausted|csak kimerült|üres vagyok|just empty|nem bírom már)/i;

/**
 * Session rhythm for light continuity (not timestamps).
 * @param {object} prevPm
 * @param {object} state
 * @param {object} session
 */
function buildRelationshipRhythm(prevPm, state, session) {
  const prev = prevPm?.relationshipRhythm || {};
  const slot = getTimeSlot(session);
  const rhythm = { ...prev, turns: (prev.turns || 0) + 1 };

  if (state.scatter >= 6 || prevPm?.emotionalState === "scattered") {
    rhythm.lastScatteredSlot = slot;
    rhythm.hadScattered = true;
  }
  if (state.emotionalIntensity >= 6) {
    rhythm.hadTense = true;
    rhythm.lastTenseSlot = slot;
  }
  if (state.emotionalIntensity <= 3 && state.scatter <= 3 && prev.hadTense) {
    rhythm.sawCalmAfterTense = true;
  }
  return rhythm;
}

/**
 * Human continuity — no timestamps, no dumps.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function maybeRelationshipContinuity(session, lang, category) {
  if (!session?.onboardingCompleted) return null;
  const pm = session.presenceMemory;
  if (!pm || (session.messages || []).length < 4) return null;
  if (Math.random() > 0.2) return null;

  const r = getResponses(lang);
  const rc = r.relationshipContinuity || {};
  const pool = [];
  const rhythm = pm.relationshipRhythm || {};
  const slot = getTimeSlot(session);
  const prev = pm.previousEmotionalState;

  if (rhythm.lastScatteredSlot === slot && rhythm.hadScattered) {
    pool.push(...(rc.sameTimeScattered || []));
  }
  if (prev === "overloaded" && (pm.emotionalState === "grounded" || pm.emotionalState === "stable")) {
    pool.push(...(rc.calmerThanBefore || r.attachmentMoments?.calmer || []));
  }
  if (rhythm.sawCalmAfterTense && pm.emotionalState !== "overloaded") {
    pool.push(...(rc.calmerThanBefore || []));
  }
  if (prev === "overloaded" && pm.emotionalState === "overloaded") {
    pool.push(...(rc.stillTense || r.attachmentMoments?.stillHeavy || []));
  }

  if (!pool.length) return null;
  return pickSeeded(pool, `relcont_${prev}_${pm.emotionalState}_${category}`);
}

/**
 * Stay in conversation — no coach redirect.
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 */
function tryRelationalStay(text, lang, session, userId) {
  if (!session?.onboardingCompleted) return null;
  const t = String(text || "").trim();
  if (t.length > 90 || t.length < 6) return null;
  if (!RELATIONAL_STAY_RE.test(t)) return null;
  if (/(mit csináljak|help me|segíts|what should)/i.test(t)) return null;

  const r = getResponses(lang);
  const pool = r.relationalStay || r.silenceBeats || [];
  if (!pool.length) return null;

  let body = pickSeeded(pool, `relstay_${userId}_${t.slice(0, 20)}`);
  if (Math.random() < 0.35) {
    const q = r.relationalCuriosity?.tired || r.relationalCuriosity?.general;
    if (q?.length) {
      const line = pickSeeded(q, `relq_${userId}`);
      if (line && !body.includes(line)) body = `${body}\n${line}`;
    }
  }
  return { body, category: "relational_flow" };
}

/**
 * Genuine curiosity — connection, not extraction.
 * @param {object} session
 * @param {object} state
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} text
 */
function maybeRelationalCuriosity(session, state, lang, category, text) {
  if (!session?.onboardingCompleted) return null;
  if (category === "relational_flow" || category === "onboarding") return null;
  const t = String(text || "");
  if (t.length < 12) return null;
  if (Math.random() > 0.14) return null;

  const r = getResponses(lang);
  let pool = r.relationalCuriosity?.general || [];
  if (state?.energyLevel <= 4 || /(fáradt|tired|kimerült)/i.test(t)) {
    pool = [...(r.relationalCuriosity?.tired || []), ...pool];
  }
  if (state?.scatter >= 5 || /(szétszórt|scattered|fókusz)/i.test(t)) {
    pool = [...(r.relationalCuriosity?.focus || []), ...pool];
  }
  if (!pool.length) return null;
  return pickSeeded(pool, `relcur_${category}_${session.messages?.length || 0}`);
}

/**
 * Natural comfort — not therapy voice.
 * @param {object} session
 * @param {string} category
 * @param {'en'|'hu'|'ro'} lang
 */
function maybeNaturalComfort(session, category, lang) {
  if (!session?.onboardingCompleted) return null;
  if (category === "onboarding" || category === "relational_flow") return null;
  if (Math.random() > 0.11) return null;

  const r = getResponses(lang);
  const pool = r.naturalComfort || r.companionWarmth?.emotional || [];
  if (!pool.length) return null;
  return pickSeeded(pool, `ncomfort_${category}_${session.messages?.length || 0}`);
}

/**
 * Strip self-help product phrasing.
 * @param {string} body
 */
function filterSelfHelpProduct(body) {
  return String(body || "")
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      return !SELF_HELP_RE.test(t);
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

module.exports = {
  buildRelationshipRhythm,
  maybeRelationshipContinuity,
  tryRelationalStay,
  maybeRelationalCuriosity,
  maybeNaturalComfort,
  filterSelfHelpProduct,
  RELATIONAL_STAY_RE,
  SELF_HELP_RE
};
