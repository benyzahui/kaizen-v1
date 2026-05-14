/**
 * Adaptive one-liners after onboarding — keeps coaching personal without branching whole trees.
 */

const { getResponses } = require("../i18n/getResponses");

function isTiredSignal(text) {
  return /\b(tired|exhausted|fatigue|fatigued|no energy|low energy|sleepy|drained|burnt out|burned out|worn out|obosit|obosită|fáradt|kimerült|epuizat|somnoros)\b/i.test(
    String(text || "")
  );
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} userText
 * @param {string} category openConversation category
 * @returns {string} suffix only (may be empty)
 */
function appendAdaptiveLine(session, lang, userText, category) {
  if (!session?.onboardingCompleted || session?.onboardingSkipped) return "";
  if (!isTiredSignal(userText)) return "";
  const relevant =
    category === "body_energy" ||
    category === "emotional_reflection" ||
    category === "chaos_loop" ||
    category === "focus_drift" ||
    category === "trading_impulse" ||
    category === "reflective_open" ||
    category === "unknown";
  if (!relevant) return "";

  const r = getResponses(lang);
  const p = session.userPrimaryPath;
  if (p === "trading") return `\n\n${r.adaptTiredTrading}`;
  if (p === "physical") return `\n\n${r.adaptTiredPhysical}`;
  if (p === "business") return `\n\n${r.adaptTiredBusiness}`;
  if (p === "emotional") return `\n\n${r.adaptTiredEmotional}`;
  if (p === "spiritual") return `\n\n${r.adaptTiredSpiritual}`;
  if (p === "selfdev") return `\n\n${r.adaptTiredDefault}`;
  if (p === "mixed") return `\n\n${r.adaptTiredMixed}`;
  return `\n\n${r.adaptTiredDefault}`;
}

module.exports = { appendAdaptiveLine, isTiredSignal };
