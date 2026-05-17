/**
 * Seriousness Engine — V2.1.
 *
 * Tracks how committed the user is to real change vs. loop-talking.
 * score: 0–100.  Default 50.
 *  > 70: user is engaged, give depth.
 *  40–70: neutral, standard response.
 *  < 40: user is looping/avoiding. Call it out, don't feed the loop.
 *  < 20: firm boundary: "I won't feed the loop."
 *
 * NOTE: rule-based for V2.1. Future LLM: pass seriousnessScore + last 5
 * messages to classifier and let LLM decide delta.
 */

const { updateSession } = require("../session/sessionStore");

const AVOIDANCE_STATES = new Set([
  "procrastinating",
  "casual_talk",
  "agreement_surface",
  "start_paralysis",
  "seeking_permission"
]);

const ENGAGED_STATES = new Set([
  "mission_drift",
  "seeking_clarity",
  "emotional_open",
  "overthinking",
  "tired_push",
  "body_neglect",
  "energy_curiosity"
]);

const BENIGN_SHORT_RE =
  /^(ok|okay|k|na|igen|nem|yes|no|da|nu|kösz|thanks|thx|vissza|back|hm+|hmm+|\.{1,3})$/i;

const TRUST_OPEN_RE =
  /(kimerült|exhausted|fáradt|tired|szégyen|shame|alone|magány|lost|elvesz|félek|afraid|failed|kudarc|szomorú|sad)/i;

/**
 * Skip avoidance mirror on short benign or emotionally open messages.
 * @param {string} text
 * @param {string} coachState
 */
function shouldSkipAvoidanceMirror(text, coachState) {
  const t = String(text || "").trim();
  if (!t) return true;
  if (t.length <= 14 && BENIGN_SHORT_RE.test(t)) return true;
  if (t.length <= 6) return true;
  if (coachState === "emotional_open") return true;
  if (TRUST_OPEN_RE.test(t)) return true;
  return false;
}

/**
 * Adjust score based on coach state detected from user message.
 * @returns {number} new score
 */
function adjustSeriousness(userId, session, coachState, text = "") {
  let score = Number(session.seriousnessScore) ?? 50;

  if (shouldSkipAvoidanceMirror(text, coachState) && AVOIDANCE_STATES.has(coachState)) {
    return score;
  }

  if (AVOIDANCE_STATES.has(coachState)) {
    score = Math.max(0, score - 6);
  } else if (ENGAGED_STATES.has(coachState)) {
    score = Math.min(100, score + 5);
  }
  updateSession(userId, { seriousnessScore: score });
  return score;
}

/**
 * Bump score up when user completes a ritual command.
 */
function recordCompletedRitual(userId, session) {
  const score = Math.min(100, (Number(session.seriousnessScore) ?? 50) + 10);
  updateSession(userId, { seriousnessScore: score });
  return score;
}

/**
 * Returns the mirror copy appropriate to current avoidance level.
 * @param {number} score
 * @param {string} lang
 * @returns {string|null} — null means no mirror needed at this level
 */
function getAvoidanceMirror(score, lang, r) {
  if (score >= 40) return null;

  if (score < 20) {
    return r.tSeriousnessWall || _fallback("wall", lang);
  }
  if (score < 30) {
    return r.tSeriousnessCallout || _fallback("callout", lang);
  }
  return r.tSeriousnessNudge || _fallback("nudge", lang);
}

function _fallback(level, lang) {
  const copy = {
    wall: {
      en: "I will not feed the loop right now.\nWhen you are ready for one honest step, I am here.",
      hu: "Most nem a köröket táplálom.\nHa készen állsz egy őszinte lépésre — itt vagyok.",
      ro: "Acum nu hrănesc bucla.\nCând ești gata pentru un pas onest — sunt aici."
    },
    callout: {
      en: "A lot of words, little movement.\nWhere did the energy start leaking?",
      hu: "Sok szöveg, kevés mozdulat.\nHol kezdett kifolyni az energia?",
      ro: "Mult text, puțină mișcare.\nUnde a început să se scurgă energia?"
    },
    nudge: {
      en: "Feels like you are on the same point again.\nWhat slipped, in your read?",
      hu: "Úgy tűnik, ugyanazon a ponton vagy.\nMi csúszott szét szerinted?",
      ro: "Parcă ești din nou în același punct.\nCe a alunecat, după tine?"
    }
  };
  return copy[level]?.[lang] ?? copy[level]?.en ?? "";
}

module.exports = {
  adjustSeriousness,
  recordCompletedRitual,
  getAvoidanceMirror,
  shouldSkipAvoidanceMirror,
  AVOIDANCE_STATES
};
