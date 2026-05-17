/**
 * Human topic transitions — less robotic pivots.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {string} from
 * @param {string} to
 */
function transitionKey(from, to) {
  if (from === "emotional_reflection" && to === "body_energy") return "stressToBody";
  if (from === "natural_conversation" && to === "emotional_reflection") return "deeper";
  if (from === "work_focus" && to === "emotional_reflection") return "workToFeeling";
  if (from === "trading_context" && to === "emotional_reflection") return "tradingToFeeling";
  return "general";
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} text
 */
function maybeNaturalTransition(session, lang, category, text) {
  if (!session?.onboardingCompleted) return null;
  const last = session.lastCategory;
  if (!last || last === category) return null;
  if ((session.messages || []).length < 3) return null;
  if (Math.random() > 0.18) return null;

  const r = getResponses(lang);
  const key = transitionKey(last, category);
  const pool = [
    ...(r.atmosphereTransitions || []),
    ...(r.naturalTransitions?.[key] || []),
    ...(r.naturalTransitions?.general || [])
  ];
  if (!pool.length) return null;

  if (/(stressz|stress|overwhelm|túl)/i.test(text) && key === "general") {
    const stressPool = r.naturalTransitions?.stressClarify;
    if (stressPool?.length) {
      return pickSeeded(stressPool, `ntr_${last}_${category}`);
    }
  }

  return pickSeeded(pool, `ntr_${key}_${last}_${category}`);
}

module.exports = { maybeNaturalTransition, transitionKey };
