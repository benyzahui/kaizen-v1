/**
 * Overload + chaotic conversation detection.
 */

const FRAGMENT_RE = /(?:^|\n)\s*[^.!?]{1,40}[.!?]?\s*(?:\n|$)/g;
const STRESS_RE =
  /(stress|stressz|pánik|panic|túl sok|too much|overwhelm|szétes|szét|anxiet|félek|haos|chaos)/i;
const TOPIC_SWITCH_RE =
  /\b(de|and|és|also|meg|apoi|then|but|de asemenea)\b/gi;

/**
 * @param {string} text
 */
function detectTextOverload(text) {
  const t = String(text || "").trim();
  if (!t) return false;
  if (STRESS_RE.test(t)) return true;
  const parts = t.split(/[.!?\n]+/).filter((s) => s.trim().length > 0);
  if (parts.length >= 4 && t.length < 280) return true;
  const switches = (t.match(TOPIC_SWITCH_RE) || []).length;
  if (switches >= 3 && t.length < 400) return true;
  return false;
}

/**
 * Rapid fragmented bursts across recent messages.
 * @param {object} session
 */
function detectConversationOverload(session) {
  const msgs = (session.messages || []).slice(-4).map((m) => String(m.text || ""));
  if (msgs.length < 2) return false;
  const shortBurst = msgs.filter((m) => m.length > 0 && m.length < 60).length;
  if (shortBurst >= 3) return true;
  const cats = (session.messages || []).slice(-3).map((m) => m.category);
  const unique = new Set(cats.filter(Boolean));
  if (unique.size >= 3 && msgs.join(" ").length < 500) return true;
  return false;
}

/**
 * @param {string} text
 * @param {object} session
 */
function isOverloaded(text, session) {
  const daily = session.dailyState || {};
  if (daily.screenDiscipline === "high") return true;
  if (session.nervousSystemState === "overloaded" || session.nervousSystemState === "anxious") {
    return true;
  }
  if (session.lastCategory === "trading_impulse" || session.lastCategory === "chaos_loop") {
    return true;
  }
  return detectTextOverload(text) || detectConversationOverload(session);
}

/**
 * Chaotic deep conversation — many topics, analysis-heavy.
 * @param {string} text
 * @param {object} session
 */
function isChaoticConversation(text, session) {
  const t = String(text || "");
  if (t.length < 120) return false;
  const qCount = (t.match(/\?/g) || []).length;
  const lineCount = t.split(/\n/).filter(Boolean).length;
  if (qCount >= 3 || lineCount >= 5) return true;
  const COACH_HEAVY = [
    "emotional_reflection",
    "reflective_open",
    "chaos_loop",
    "work_focus",
    "self_development"
  ];
  const recent = (session.messages || []).slice(-2);
  const heavy = recent.filter((m) => COACH_HEAVY.includes(m.category)).length;
  return heavy >= 2 && t.length > 180;
}

module.exports = {
  detectTextOverload,
  detectConversationOverload,
  isOverloaded,
  isChaoticConversation
};
