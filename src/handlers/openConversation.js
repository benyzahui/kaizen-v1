/**
 * Open conversation: classification → guardrails → concise coaching.
 *
 * Routing flow: Netlify handler sends only non-slash text here. Commands always win first.
 * Memory: sessionStore keeps lastCategory / lastSuggestedAction; this layer nudges continuity
 * when the same category repeats without being a hard loop yet.
 */

const { classifyMessage } = require("../conversation/classify");
const { variateIfSameShape } = require("../conversation/antiTemplate");
const { applyBannedPhraseRotation } = require("../conversation/bannedPhrases");
const { getResponses } = require("../i18n/getResponses");
const { conversation: logConversation } = require("../logging/log");
const { lines, disclaimerLight } = require("../personality/kaizenVoice");
const { detectPatternKind } = require("../conversation/boundaries");
const { recordPattern, isInCooldown } = require("../conversation/patternMemory");
const {
  needsImmediateRecovery,
  formatFullRecovery
} = require("./balanceProtocol");
const {
  isSessionCategoryLoop,
  isTripleSameEmotionalText,
  updateSession
} = require("../session/sessionStore");
const { appendAdaptiveLine } = require("../companion/adaptive");
const { buildEnergyFromOpenText } = require("./energyHandler");
const { pickUnseenVariant } = require("../conversation/responseVariation");
const { detectLaneWandering } = require("../conversation/focusLane");

const COACH_HEAVY = new Set([
  "emotional_reflection",
  "reflective_open",
  "chaos_loop",
  "plan_tracking",
  "self_development",
  "work_focus"
]);

function lastTwoCoachHeavy(session) {
  const m = session.messages || [];
  if (m.length < 2) return false;
  return (
    COACH_HEAVY.has(m[m.length - 1].category) &&
    COACH_HEAVY.has(m[m.length - 2].category)
  );
}

function wrapAdaptive(session, lang, text, category, replyBody) {
  return replyBody + appendAdaptiveLine(session, lang, text, category);
}

/**
 * @param {string|number} userId
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} text
 * @param {string} category
 * @param {string} body
 * @param {object} r
 */
function finalizeCoaching(userId, session, lang, text, category, body, r) {
  let b = body;
  if (detectLaneWandering(session, category)) {
    updateSession(userId, { focusLocked: true });
    b = lines(r.tFocusLaneNudge, "", b);
  }
  b = variateIfSameShape(session, b, r);
  b = applyBannedPhraseRotation(session, b, r);
  return wrapAdaptive(session, lang, text, category, b);
}

/** Shorter open replies — no adaptive coaching suffix. */
function finalizeLite(userId, session, lang, text, category, body, r) {
  let b = body;
  if (detectLaneWandering(session, category)) {
    updateSession(userId, { focusLocked: true });
    b = lines(r.tFocusLaneNudge, "", b);
  }
  b = variateIfSameShape(session, b, r);
  b = applyBannedPhraseRotation(session, b, r);
  return b;
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

function logOpen(payload) {
  logConversation(JSON.stringify({ path: "open", ...payload }), null);
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

  if (category === "casual_greeting") {
    logOpen({
      lang,
      category,
      handler: "responses.casualGreetingLines",
      textPreview: text.slice(0, 80)
    });
    const pool =
      /thanks|thank you|thx|köszön|mulțumesc/i.test(text) && text.length < 80
        ? r.casualThanksLines
        : r.casualGreetingLines;
    const body = pickUnseenVariant(session, userId, pool);
    return {
      reply: finalizeLite(userId, session, lang, text, category, body, r),
      category: "casual_greeting",
      suggestedAction: "/pulse"
    };
  }

  if (category === "light_conversation") {
    logOpen({
      lang,
      category,
      handler: "responses.lightConversationLines",
      textPreview: text.slice(0, 80)
    });
    const body = pickUnseenVariant(session, userId, r.lightConversationLines);
    return {
      reply: finalizeLite(userId, session, lang, text, category, body, r),
      category: "light_conversation",
      suggestedAction: "/guide"
    };
  }

  if (category === "easter_creator") {
    logOpen({
      lang,
      category,
      handler: "responses.creatorEasterReply",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: finalizeCoaching(userId, session, lang, text, category, r.creatorEasterReply, r),
      category: "easter_creator",
      suggestedAction: "/guide"
    };
  }

  if (category === "help_intent") {
    logOpen({
      lang,
      category,
      handler: "responses.helpIntentReply",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: finalizeCoaching(userId, session, lang, text, category, r.helpIntentReply, r),
      category: "help_intent",
      suggestedAction: "/guide"
    };
  }

  if (category === "energy_question") {
    logOpen({
      lang,
      category,
      handler: "energyHandler.buildEnergyFromOpenText",
      textPreview: text.slice(0, 80)
    });
    const body = buildEnergyFromOpenText(text, lang);
    return {
      reply: finalizeLite(userId, session, lang, text, category, body, r),
      category: "energy_question",
      suggestedAction: "/energy"
    };
  }

  if (category === "clarity_protocol") {
    logOpen({
      lang,
      category,
      handler: "responses.clarityIntentReply",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: finalizeCoaching(userId, session, lang, text, category, r.clarityIntentReply, r),
      category: "clarity_protocol",
      suggestedAction: "/clarity"
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
      reply: finalizeCoaching(
        userId,
        session,
        lang,
        text,
        "chaos_loop",
        withContinuity(session, category, r.chaosSoftReply, r),
        r
      ),
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
      reply: finalizeCoaching(
        userId,
        session,
        lang,
        text,
        "trading_impulse",
        withContinuity(session, category, r.tradingGuardrail, r),
        r
      ),
      category: "trading_impulse",
      suggestedAction: "/trade"
    };
  }

  if (category === "trading_context") {
    logOpen({
      lang,
      category,
      handler: "responses.tradingContextBodies",
      textPreview: text.slice(0, 80)
    });
    const body = pickUnseenVariant(session, userId, r.tradingContextBodies);
    return {
      reply: finalizeCoaching(userId, session, lang, text, category, body, r),
      category: "trading_context",
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
    const base = pickUnseenVariant(
      session,
      userId,
      r.focusDriftVariants || [r.categories.focus_drift]
    );
    const body = maybeVaryReply(
      session,
      category,
      withContinuity(session, category, base, r),
      r
    );
    return {
      reply: finalizeCoaching(userId, session, lang, text, category, body, r),
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
      reply: finalizeCoaching(userId, session, lang, text, category, body, r),
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
    let body;
    if (lastTwoCoachHeavy(session) && r.pacingReflectiveShortlines?.length) {
      body = pickUnseenVariant(session, userId, r.pacingReflectiveShortlines);
      return {
        reply: finalizeLite(userId, session, lang, text, category, body, r),
        category: "reflective_open",
        suggestedAction: "/focus"
      };
    }
    body = pickUnseenVariant(session, userId, r.reflectivePrompts);
    return {
      reply: finalizeCoaching(userId, session, lang, text, category, body, r),
      category: "reflective_open",
      suggestedAction: "/clarity"
    };
  }

  let body =
    r.categories[category] ||
    r.categories.reflective_open ||
    r.categories.unknown;
  if (
    category === "unknown" &&
    session?.lastCategory === "unknown" &&
    r.categories.unknown_alt
  ) {
    body = r.categories.unknown_alt;
  }
  if (category === "emotional_reflection") {
    body = pickUnseenVariant(
      session,
      userId,
      r.emotionalReflectionVariants || [r.categories.emotional_reflection]
    );
    body = maybeVaryReply(session, category, withContinuity(session, category, body, r), r);
    if (r.openHintEmotional) body = body + r.openHintEmotional;
  } else {
    body = maybeVaryReply(session, category, withContinuity(session, category, body, r), r);
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
    unknown: "/help",
    help_intent: "/guide",
    energy_question: "/energy",
    clarity_protocol: "/clarity",
    easter_creator: "/guide",
    casual_greeting: "/pulse",
    light_conversation: "/guide",
    trading_context: "/trade"
  };

  return {
    reply: finalizeCoaching(userId, session, lang, text, category, body, r),
    category,
    suggestedAction: suggestedByCat[category] || "/help"
  };
}

module.exports = { classifyMessage, handleOpenConversation };
