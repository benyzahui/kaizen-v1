/**
 * Open conversation: light classification, grounded replies, guardrails.
 * Returns { reply, category } for session recording.
 *
 * Architecture: slash commands never enter here — webhook routes commands first.
 * This layer adds coaching tone; structured rituals stay in commands + responses.
 */

const { getResponses } = require("../i18n/getResponses");
const { conversation: logConversation } = require("../logging/log");
const { lines, pickSeeded, disclaimer } = require("../personality/kaizenVoice");
const { detectPatternKind } = require("../conversation/boundaries");
const { recordPattern, isInCooldown } = require("../conversation/patternMemory");
const {
  needsImmediateRecovery,
  formatFullRecovery
} = require("./balanceProtocol");
const {
  isSessionCategoryLoop,
  isTripleSameEmotionalText
} = require("../session/sessionStore");

function logOpen(payload) {
  logConversation(JSON.stringify(payload), null);
}

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
    /(érz|szorong|szétszórt|szétesett|kimerült|nem bírom|magány|tristețe|trist|obosit|obosită|epuizat|stresat|nu am chef|fără chef|fară chef|szét vagyok|szétesett)/i.test(
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

function maybeVaryReply(session, category, body) {
  const prev = session?.lastReplyByCategory?.[category];
  if (prev && prev === body) {
    return `${body}\n\n(Say one new detail you have not repeated yet.)`;
  }
  return body;
}

/**
 * @param {object} message
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @returns {{ reply: string, category: string }}
 */
function handleOpenConversation(message, lang, session) {
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
    return { reply: r.boundaryCooldown, category: "cooldown" };
  }

  if (needsImmediateRecovery(text)) {
    logOpen({
      lang,
      category: "immediate_recovery",
      handler: "balanceProtocol.immediate",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: lines(
        formatFullRecovery(lang, { includeLoopIntro: false }),
        "",
        disclaimer(lang)
      ),
      category: "immediate_recovery"
    };
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
      return {
        reply: lines(
          formatFullRecovery(lang, { includeLoopIntro: true }),
          "",
          disclaimer(lang)
        ),
        category: "pattern_blocked"
      };
    }
  }

  const category = classifyMessage(text);

  if (isTripleSameEmotionalText(session, text, category)) {
    logOpen({
      lang,
      category: "emotional_repeat_triple",
      handler: "sessionStore.triple_same_text",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: lines(r.emotionalTripleGrounding, "", disclaimer(lang)),
      category: "emotional_repeat_triple"
    };
  }

  if (isSessionCategoryLoop(session, category)) {
    logOpen({
      lang,
      category: "session_loop",
      handler: "sessionStore.loop",
      textPreview: text.slice(0, 80)
    });
    return { reply: r.sessionLoopBoundary, category: "session_loop" };
  }

  if (category === "chaos_loop") {
    logOpen({
      lang,
      category,
      handler: "responses.chaosSoftReply",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: lines(r.chaosSoftReply, "", disclaimer(lang)),
      category: "chaos_loop"
    };
  }

  if (category === "trading_impulse") {
    logOpen({
      lang,
      category,
      handler: "responses.tradingGuardrail",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: lines(r.tradingGuardrail, "", disclaimer(lang)),
      category: "trading_impulse"
    };
  }

  if (category === "general_curiosity") {
    logOpen({
      lang,
      category,
      handler: "responses.curiosity",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: pickSeeded(r.curiosity, String(userId)),
      category: "general_curiosity"
    };
  }

  let body = r.categories[category] || r.categories.unknown;
  body = maybeVaryReply(session, category, body);
  if (category === "emotional_reflection" && r.openHintEmotional) {
    body = body + r.openHintEmotional;
  }

  logOpen({
    lang,
    category,
    handler: `responses.categories.${category}`,
    textPreview: text.slice(0, 80)
  });
  return { reply: body, category };
}

module.exports = { classifyMessage, handleOpenConversation };
