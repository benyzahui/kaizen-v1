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

/**
 * Adjust score based on coach state detected from user message.
 * @returns {number} new score
 */
function adjustSeriousness(userId, session, coachState) {
  let score = Number(session.seriousnessScore) ?? 50;

  if (AVOIDANCE_STATES.has(coachState)) {
    score = Math.max(0, score - 8);
  } else if (ENGAGED_STATES.has(coachState)) {
    score = Math.min(100, score + 5);
  }
  // neutral states: no change
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
  if (score >= 40) return null; // no mirror needed

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
      en: "I will not feed the loop.\nWhen you are ready to move, I am here.",
      hu: "Nem táplálom a köröket.\nHa készen állsz a mozgásra, itt vagyok.",
      ro: "Nu voi alimenta bucla.\nCând ești gata să te miști, sunt aici."
    },
    callout: {
      en: "You keep showing up but not moving.\nThat is a signal, not a schedule.\nWhat is the real block?",
      hu: "Jelensz meg de nem mozogsz.\nEz jel, nem menetrend.\nMi a valódi blokk?",
      ro: "Apari dar nu te miști.\nAcesta e un semnal, nu un program.\nCare e blocajul real?"
    },
    nudge: {
      en: "Noticed: you have been circling the same territory.\nShrink the step. Five minutes. Go.",
      hu: "Észreveszem: ugyanazon a területen körözsz.\nCsökkentsd a lépést. Öt perc. Hajrá.",
      ro: "Am observat: circulezi în același teritoriu.\nMicșorează pasul. Cinci minute. Du-te."
    }
  };
  return copy[level]?.[lang] ?? copy[level]?.en ?? "";
}

module.exports = {
  adjustSeriousness,
  recordCompletedRitual,
  getAvoidanceMirror,
  AVOIDANCE_STATES
};
