/**
 * Open conversation: light classification, grounded replies, guardrails.
 * No AI, no database.
 */

const { getResponses } = require("../i18n/getResponses");
const { lines, pickSeeded, disclaimer } = require("../personality/kaizenVoice");
const { detectPatternKind } = require("../conversation/boundaries");
const { recordPattern, isInCooldown } = require("../conversation/patternMemory");
const {
  needsImmediateRecovery,
  formatFullRecovery
} = require("./balanceProtocol");

function logOpen(payload) {
  console.log("[kaizen:open]", JSON.stringify(payload));
}

/**
 * @returns {'emotional_reflection'|'work_focus'|'self_development'|'trading_impulse'|'plan_tracking'|'chaos_loop'|'general_curiosity'|'unknown'}
 */
function classifyMessage(text) {
  const t = String(text || "").trim();
  if (!t) return "unknown";

  if (
    /(hopeless|spiral|can't stop|cant stop|meltdown|overstim|overwhelmed|overload|overloaded|mental overload|panic|dying inside|pánik|reménytelen|összeoml|panică|disperat|can't breathe|cant breathe)/i.test(
      t
    )
  ) {
    return "chaos_loop";
  }

  if (
    /(fomo|yolo|revenge trade|all in|all-in|margin call|chase the loss|overtrad|100x|leveraged|impulsive trade|buying out of|revenge trading)/i.test(
      t
    )
  ) {
    return "trading_impulse";
  }

  if (
    /\b(plan|calendar|schedule|todo|roadmap|quarter|sprint)\b/i.test(t) ||
    /(menetrend|ütem|terv|napirend)/i.test(t)
  ) {
    return "plan_tracking";
  }

  if (
    /\b(work|deadline|boss|client|meeting|project|office)\b/i.test(t) ||
    /(munka|határidő|projekt|főnök|ügyfél)/i.test(t)
  ) {
    return "work_focus";
  }

  if (
    /\b(habit|learn|journal|course|read|skills)\b/i.test(t) ||
    /(szokás|tanul|napló|fejlőd|curs)/i.test(t)
  ) {
    return "self_development";
  }

  if (
    /\b(feel|feeling|sad|anxious|scattered|lost|empty|stressed|tired of)\b/i.test(
      t
    ) ||
    /(érz|szorong|szétszórt|szétesett|kimerült|nem bírom|magány|tristețe|trist|obosit|obosită|epuizat|stresat|nu am chef|fără chef|fară chef)/i.test(
      t
    )
  ) {
    return "emotional_reflection";
  }

  const low = t.toLowerCase();
  if (
    /\?/.test(t) ||
    /^(what|why|how|who)\b/i.test(low) ||
    /^ce\s/i.test(t)
  ) {
    return "general_curiosity";
  }

  return "unknown";
}

function handleOpenConversation(message, lang) {
  const userId = message.from?.id ?? message.chat?.id;
  const text = String(message.text || "").trim();
  const r = getResponses(lang);

  if (isInCooldown(userId)) {
    logOpen({
      lang,
      category: null,
      handler: "patternMemory.cooldown",
      textPreview: text.slice(0, 80)
    });
    return r.boundaryCooldown;
  }

  if (needsImmediateRecovery(text)) {
    logOpen({
      lang,
      category: "immediate_recovery",
      handler: "balanceProtocol.immediate",
      textPreview: text.slice(0, 80)
    });
    return lines(
      formatFullRecovery(lang, { includeLoopIntro: false }),
      "",
      disclaimer(lang)
    );
  }

  const kind = detectPatternKind(text);
  if (kind) {
    const { blocked } = recordPattern(userId, kind);
    if (blocked) {
      logOpen({
        lang,
        category: "pattern_blocked",
        patternKind: kind,
        handler: "balanceProtocol.loop_escalation",
        textPreview: text.slice(0, 80)
      });
      return lines(
        formatFullRecovery(lang, { includeLoopIntro: true }),
        "",
        disclaimer(lang)
      );
    }
  }

  const category = classifyMessage(text);

  if (category === "chaos_loop") {
    logOpen({
      lang,
      category,
      handler: "responses.chaosSoftReply",
      textPreview: text.slice(0, 80)
    });
    return lines(r.chaosSoftReply, "", disclaimer(lang));
  }

  if (category === "trading_impulse") {
    logOpen({
      lang,
      category,
      handler: "responses.tradingGuardrail",
      textPreview: text.slice(0, 80)
    });
    return lines(r.tradingGuardrail, "", disclaimer(lang));
  }

  if (category === "general_curiosity") {
    logOpen({
      lang,
      category,
      handler: "responses.curiosity",
      textPreview: text.slice(0, 80)
    });
    return pickSeeded(r.curiosity, String(userId));
  }

  const body = r.categories[category] || r.categories.unknown;
  logOpen({
    lang,
    category,
    handler: `responses.categories.${category}`,
    textPreview: text.slice(0, 80)
  });
  return body;
}

module.exports = { classifyMessage, handleOpenConversation };
