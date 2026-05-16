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
const { buildEnergyFromOpenText } = require("./energyHandler");
const { pickUnseenVariant } = require("../conversation/responseVariation");
const { processCompanionOpenText } = require("../core/modeEngine");
const { composeBrainPriority } = require("../brain/coachBrain");
const {
  adjustSeriousness,
  getAvoidanceMirror
} = require("../core/seriousnessEngine");
const { prepareCompanionContext } = require("../companion/companionCore");
const { packOpenReply } = require("./openReply");
const { resolveNaturalLanguageRequest } = require("../i18n/languageLock");
const { buildNaturalConversation } = require("../conversation/naturalConversation");
const { tryCompanionCheckIn } = require("../companion/companionInitiation");
const { tryShortActionReply } = require("../companion/responseDepth");
const { routeNaturalIntent } = require("../companion/naturalIntentRouter");
const { tryMicroReward } = require("../companion/microRewards");
const {
  detectAccountabilityToggle,
  applyAccountabilityToggle,
  tryAccountabilityFollowUp
} = require("../companion/accountabilityMode");
const { tryThreadReturnReply } = require("../companion/threadContinuityEngine");

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

/**
 * @param {object|null} companionCtx
 * @param {string|null} suggestedCommand
 */
function emitOpen(companionCtx, category, body, r, suggestedCommand = null) {
  return packOpenReply({
    category,
    body,
    r,
    companionCtx,
    suggestedCommand
  });
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
 * @returns {Promise<{ reply: string, category: string, suggestedAction?: string|null }>}
 */
async function handleOpenConversation(message, lang, session) {
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

  const threadReturn = tryThreadReturnReply(session, text, lang);
  if (threadReturn) {
    const companionCtx = prepareCompanionContext(
      userId,
      text,
      session,
      lang,
      threadReturn.category
    );
    return emitOpen(companionCtx, threadReturn.category, threadReturn.body, r, null);
  }

  const accToggle = detectAccountabilityToggle(text);
  if (accToggle) {
    const reply = applyAccountabilityToggle(userId, accToggle, lang);
    const companionCtx = prepareCompanionContext(userId, text, session, lang, "accountability_setup");
    return emitOpen(companionCtx, "accountability_setup", reply, r, null);
  }

  const accFollow = tryAccountabilityFollowUp(session, text, lang, userId);
  if (accFollow) {
    const companionCtx = prepareCompanionContext(
      userId,
      text,
      session,
      lang,
      accFollow.category
    );
    return emitOpen(companionCtx, accFollow.category, accFollow.body, r, null);
  }

  const micro = tryMicroReward(text, lang, userId);
  if (micro) {
    const companionCtx = prepareCompanionContext(userId, text, session, lang, micro.category);
    return emitOpen(companionCtx, micro.category, micro.body, r, null);
  }

  const naturalIntent = routeNaturalIntent(text, lang, session, userId);
  if (naturalIntent) {
    const companionCtx = prepareCompanionContext(
      userId,
      text,
      session,
      lang,
      naturalIntent.category
    );
    return emitOpen(
      companionCtx,
      naturalIntent.category,
      naturalIntent.body,
      r,
      naturalIntent.suggestedCommand ?? null
    );
  }

  const shortAction = tryShortActionReply(text, lang, userId);
  if (shortAction) {
    const cat = "light_conversation";
    const companionCtx = prepareCompanionContext(userId, text, session, lang, cat);
    return emitOpen(companionCtx, cat, shortAction, r, null);
  }

  const checkIn = tryCompanionCheckIn(session, lang, userId, text);
  if (checkIn) {
    updateSession(userId, { lastCompanionCheckin: Date.now() });
    const companionCtx = prepareCompanionContext(
      userId,
      text,
      session,
      lang,
      checkIn.category
    );
    return emitOpen(companionCtx, checkIn.category, checkIn.body, r, null);
  }

  const category = classifyMessage(text);
  const companionCtx = prepareCompanionContext(userId, text, session, lang, category);

  const natural = buildNaturalConversation(text, category, session, lang, userId);
  if (natural) {
    logOpen({
      lang,
      category: "natural_conversation",
      handler: "naturalConversation.build",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(companionCtx, "natural_conversation", natural.body, r, null);
  }

  const langReq = resolveNaturalLanguageRequest(userId, text, session, lang);
  if (langReq) {
    logOpen({
      lang,
      category: "language_switch",
      handler: "languageLock.resolveNaturalLanguageRequest",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(
      companionCtx,
      langReq.category,
      langReq.reply,
      r,
      langReq.suggestedAction
    );
  }

  // Seriousness tracking — adjust score before brain routing so mirror can fire.
  const coachState = companionCtx.state.coachState;
  const seriousnessScore = adjustSeriousness(userId, session, coachState);
  const mirror = getAvoidanceMirror(seriousnessScore, lang, r);
  if (mirror) {
    logOpen({
      lang,
      category: "avoidance_mirror",
      seriousnessScore,
      handler: "seriousnessEngine.mirror",
      textPreview: text.slice(0, 80)
    });
    return {
      reply: mirror,
      category: "avoidance_mirror",
      suggestedAction: seriousnessScore < 20 ? null : "/morning"
    };
  }

  const brainEarly = await composeBrainPriority(userId, text, lang, session, category);
  if (brainEarly) {
    logOpen({
      lang,
      category: brainEarly.category,
      handler: "brain.composeBrainPriority",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(
      companionCtx,
      brainEarly.category,
      brainEarly.reply,
      r,
      brainEarly.suggestedAction ?? null
    );
  }

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

  const companion = processCompanionOpenText(userId, text, lang, session);
  if (companion && companion.handled) {
    logOpen({
      lang,
      category: companion.category,
      handler: "modeEngine.processCompanionOpenText",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(
      companionCtx,
      companion.category,
      companion.reply,
      r,
      companion.suggestedAction ?? null
    );
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
    return emitOpen(companionCtx, category, body, r, null);
  }

  if (category === "light_conversation") {
    logOpen({
      lang,
      category,
      handler: "responses.lightConversationLines",
      textPreview: text.slice(0, 80)
    });
    const body = pickUnseenVariant(session, userId, r.lightConversationLines);
    return emitOpen(companionCtx, category, body, r, null);
  }

  if (category === "easter_creator") {
    logOpen({
      lang,
      category,
      handler: "responses.creatorEasterReply",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(companionCtx, category, r.creatorEasterReply, r, "/guide");
  }

  if (category === "help_intent") {
    logOpen({
      lang,
      category,
      handler: "brain.brainCommandHelpLite",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(companionCtx, category, r.brainCommandHelpLite, r, "/guide");
  }

  if (category === "energy_question") {
    logOpen({
      lang,
      category,
      handler: "energyHandler.buildEnergyFromOpenText",
      textPreview: text.slice(0, 80)
    });
    const body = buildEnergyFromOpenText(text, lang, userId);
    return emitOpen(companionCtx, category, body, r, "/energy");
  }

  if (category === "clarity_protocol") {
    logOpen({
      lang,
      category,
      handler: "responses.clarityIntentReply",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(companionCtx, category, r.clarityIntentReply, r, "/focus");
  }

  if (category === "chaos_loop") {
    logOpen({
      lang,
      category,
      handler: "responses.chaosSoftReply",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(
      companionCtx,
      "chaos_loop",
      withContinuity(session, category, r.chaosSoftReply, r),
      r,
      null
    );
  }

  if (category === "trading_impulse") {
    logOpen({
      lang,
      category,
      handler: "responses.tradingGuardrail",
      textPreview: text.slice(0, 80)
    });
    return emitOpen(
      companionCtx,
      "trading_impulse",
      withContinuity(session, category, r.tradingGuardrail, r),
      r,
      "/trade"
    );
  }

  if (category === "trading_context") {
    logOpen({
      lang,
      category,
      handler: "responses.tradingContextBodies",
      textPreview: text.slice(0, 80)
    });
    const body = pickUnseenVariant(session, userId, r.tradingContextBodies);
    return emitOpen(companionCtx, category, body, r, null);
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
    return emitOpen(companionCtx, category, body, r, "/focus");
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
    return emitOpen(companionCtx, category, body, r, "/body");
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
      return emitOpen(companionCtx, category, body, r, null);
    }
    body = pickUnseenVariant(session, userId, r.reflectivePrompts);
    return emitOpen(companionCtx, category, body, r, null);
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
    const nat = buildNaturalConversation(text, category, session, lang, userId);
    if (nat) {
      return emitOpen(companionCtx, "natural_conversation", nat.body, r, null);
    }
    body = pickUnseenVariant(
      session,
      userId,
      r.emotionalReflectionVariants || [r.categories.emotional_reflection]
    );
    body = maybeVaryReply(session, category, withContinuity(session, category, body, r), r);
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
    emotional_reflection: null,
    natural_conversation: null,
    work_focus: null,
    plan_tracking: null,
    self_development: null,
    chaos_loop: null,
    focus_drift: null,
    body_energy: "/body",
    energy_question: "/energy",
    trading_impulse: "/trade",
    trading_context: null,
    unknown: null,
    help_intent: null,
    clarity_protocol: "/focus",
    casual_greeting: null,
    light_conversation: null
  };

  const cmd = suggestedByCat[category] ?? null;

  return emitOpen(companionCtx, category, body, r, cmd);
}

module.exports = { classifyMessage, handleOpenConversation };
