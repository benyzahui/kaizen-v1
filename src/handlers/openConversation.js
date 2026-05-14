/**
 * Open conversation: classification → guardrails → concise coaching.
 *
 * Routing flow: Netlify handler sends only non-slash text here. Commands always win first.
 * Memory: sessionStore keeps lastCategory / lastSuggestedAction; this layer nudges continuity
 * when the same category repeats without being a hard loop yet.
 */

const { classifyMessage } = require("../conversation/classify");
const { getResponses } = require("../i18n/getResponses");
const { conversation: logConversation } = require("../logging/log");
const { lines, pickSeeded, disclaimerLight } = require("../personality/kaizenVoice");
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

function maybeVaryReply(session, category, body, r) {
  const prev = session?.lastReplyByCategory?.[category];
  if (prev && prev === body && r.variationNudge) {
    return lines(body, "", r.variationNudge);
  }
  return body;
}

function withContinuity(session, category, body, r) {
  if (session?.lastCategory === category && r.continuityLine) {
    return lines(r.continuityLine, "", body);
  }
  return body;
}

/**
 * @param {object} message
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @returns {{ reply: string, category: string, suggestedAction?: string|null }}
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
        disclaimerLight(lang)
      ),
      category: "immediate_recovery",
      suggestedAction: "/reset"
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
          disclaimerLight(lang)
        ),
        category: "pattern_blocked",
        suggestedAction: "/reset"
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
      reply: lines(r.emotionalTripleGrounding, "", disclaimerLight(lang)),
      category: "emotional_repeat_triple",
      suggestedAction: "/reset"
    };
  }

  if (isSessionCategoryLoop(session, category)) {
    logOpen({
      lang,
      category: "session_loop",
      handler: "sessionStore.loop",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: r.sessionLoopBoundary,
      category: "session_loop",
      suggestedAction: "/mirror"
    };
  }

  if (category === "chaos_loop") {
    logOpen({
      lang,
      category,
      handler: "responses.chaosSoftReply",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: withContinuity(session, category, r.chaosSoftReply, r),
      category: "chaos_loop",
      suggestedAction: "/reset"
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
      reply: withContinuity(session, category, r.tradingGuardrail, r),
      category: "trading_impulse",
      suggestedAction: "/trade"
    };
  }

  if (category === "focus_drift") {
    logOpen({
      lang,
      category,
      handler: "responses.categories.focus_drift",
      textPreview: text.slice(0, 80)
    });
    const body = maybeVaryReply(
      session,
      category,
      withContinuity(session, category, r.categories.focus_drift, r),
      r
    );
    return {
      reply: body,
      category: "focus_drift",
      suggestedAction: "/focus"
    };
  }

  if (category === "body_energy") {
    logOpen({
      lang,
      category,
      handler: "responses.categories.body_energy",
      textPreview: text.slice(0, 80)
    });
    const body = maybeVaryReply(
      session,
      category,
      withContinuity(session, category, r.categories.body_energy, r),
      r
    );
    return {
      reply: body,
      category: "body_energy",
      suggestedAction: "/body"
    };
  }

  if (category === "reflective_open") {
    logOpen({
      lang,
      category,
      handler: "responses.reflectivePrompts",
      textPreview: text.slice(0, 80)
    });
    const body = pickSeeded(r.reflectivePrompts, String(userId));
    return {
      reply: body,
      category: "reflective_open",
      suggestedAction: "/clarity"
    };
  }

  let body =
    r.categories[category] ||
    r.categories.reflective_open ||
    r.categories.unknown;
  body = maybeVaryReply(session, category, withContinuity(session, category, body, r), r);
  if (category === "emotional_reflection" && r.openHintEmotional) {
    body = body + r.openHintEmotional;
  }

  logOpen({
    lang,
    category,
    handler: `responses.categories.${category}`,
    textPreview: text.slice(0, 80)
  });

  const suggestedByCat = {
    emotional_reflection: "/reset",
    work_focus: "/focus",
    plan_tracking: "/plan",
    self_development: "/plan",
    unknown: "/help"
  };

  return {
    reply: body,
    category,
    suggestedAction: suggestedByCat[category] || "/help"
  };
}

module.exports = { classifyMessage, handleOpenConversation };
