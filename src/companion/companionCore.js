/**
 * COMPANION_CORE — center of all KaiZen responses.
 *
 * Every open reply should pass through:
 *   prepareCompanionContext → (handlers compose body) → finalizeCompanionReply
 *
 * Future LLM: replace body composition; keep prepare/finalize contract.
 */

const { loadMemoryHierarchy, patchSessionMemory } = require("./memoryHierarchy");
const {
  analyzeUserState,
  engineSessionPatch,
  selectResponsePlan
} = require("../core/responseEngine");
const { getActiveRhythmContext, rhythmTailIfNeeded } = require("./activeRhythm");
const { applyPresence } = require("./presenceSystem");
const { applyAntiLoop } = require("./antiLoopEngine");
const { lines } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { variateIfSameShape } = require("../conversation/antiTemplate");
const { applyBannedPhraseRotation } = require("../conversation/bannedPhrases");
const { detectLaneWandering } = require("../conversation/focusLane");
const { applyEmotionalPacing } = require("./emotionalPacing");
const {
  resolveConversationMode,
  conversationModePatch
} = require("./conversationModes");
const {
  buildPresenceSnapshot,
  presenceMemoryPatch,
  maybePresenceMemoryLine
} = require("./presenceMemory");
const { applyTimePresence } = require("./timePresenceEngine");
const { formatPremiumMessage } = require("./messageFormat");
const { applyDepthScale } = require("./responseDepth");
const { maybeDragonWhisper } = require("./dragonPresence");
const { applyHumanVoiceGuard } = require("./humanVoiceGuard");
const { isFreshUserExperience } = require("./freshUserExperience");
const { applyHumanCadence } = require("./humanCadence");
const { maybeEmotionalContinuity } = require("./emotionalContinuity");
const { shouldUseOneLinePacing, applyOneLinePacing } = require("./oneLinePacing");
const { maybeThreadLead } = require("./threadContinuityEngine");
const { applyLowEgoPass } = require("./lowEgoStyle");
const { maybeGroundedHumor } = require("./groundedHumor");
const { sanitizeBetaCopy } = require("./betaCopySanitize");
const { applyPersonalityGuard } = require("./personalityGuard");
const { maybeDailyLoopWhisper } = require("./dailyCompanionLoop");
const { pickDynamicOpening } = require("./dynamicOpenings");
const { maybePresenceCallback, maybeAttachmentMoment } = require("./presenceCallbacks");
const { maybeMicroWow, trackMicroWow } = require("./microWow");
const { maybeNaturalTransition } = require("./naturalTransitions");
const { resolveRhythmMode, applyInternalRhythm, rhythmSessionPatch } = require("./internalRhythm");
const { maybeCompanionWarmth, maybePremiumQuiet } = require("./companionWarmth");
const { maybeMicroReaction } = require("./emotionalMicro");
const { maybePremiumClosing } = require("./premiumClosing");
const { applyAtmosphereLayers, formatAtmosphereMessage } = require("./atmospherePresence");
const { maybeRelationshipContinuity, filterSelfHelpProduct } = require("./relationshipPresence");
const {
  resolveAliveContext,
  maxPrepLayers,
  finalizeAlivePass,
  textureSessionPatch
} = require("./alivePresence");
const { finalizePremiumPass } = require("./premiumCompanion");
const { finalizeHumanFirstPass } = require("./humanFirstCompanion");
const { finalizePremiumFeelingPass } = require("./premiumFeeling");
const { finalizeBetaShipLock } = require("./betaShipLock");
const { finalizeSoulCoherence, COHERENT_FLOW } = require("./soulCoherence");
const { finalizeBetaSurvival } = require("./betaSurvival");
const { finalizePresenceLock, resolveEmotionalTiming } = require("./presenceLock");
const { finalizeBetaImmersionHarden } = require("./betaImmersionHarden");
const { finalizeFinalBetaFeeling } = require("./finalBetaFeeling");
const { finalizeHumanDepthRefinement } = require("./humanDepthRefinement");
const { finalizeNaturalConversationMaster } = require("./naturalConversationMaster");
const { finalizePremiumAtmosphere } = require("./premiumAtmosphereFinal");
const { finalizeWowExperience } = require("./wowExperience");
const { finalizeEmotionalAttachment } = require("./emotionalAttachment");
const {
  finalizePresenceEvolution,
  resolvePresenceTiming
} = require("./presenceEvolution");
const { finalizeHumanReturnPass } = require("./humanReturnPass");
const { finalizeSoulStability } = require("./soulStability");
const { finalizeRealEmotionalPresence } = require("./realEmotionalPresence");
const { finalizeCompanionFlowStabilization } = require("./companionFlowStabilization");
const { finalizePremiumAtmosphereLock } = require("./premiumAtmosphereLock");
const { getTimeSlot } = require("../core/timeContext");

const LATE_LAYER_SKIP = new Set([
  "natural_conversation",
  "life_flow",
  "relational_flow",
  "light_conversation",
  "emotional_reflection",
  "casual_greeting",
  "light_accountability"
]);

const CRISIS_TAIL_SKIP = new Set([
  "immediate_recovery",
  "pattern_blocked",
  "emotional_repeat_triple",
  "session_loop",
  "avoidance_mirror",
  "cooldown"
]);

const SKIP_MEMORY_CATEGORIES = new Set([
  "onboarding",
  "language_switch",
  "companion_checkin",
  "cooldown",
  "micro_reward",
  "accountability_setup",
  "accountability_followup",
  "thread_continuity",
  "life_flow",
  "companion_checkin",
  "relational_flow"
]);

const EMBEDDED_CMD_RE = /\n→\s*\/\w+(@\w+)?\s*$/gim;
const COMP_NEXT_CMD_RE = /\n[^\n]*\/(energy|mode|focus|reset|guide|commands)\s*$/gim;

/**
 * One next step: strip duplicate command lines before adding a single hint.
 * @param {string} body
 * @param {{ suggestedCommand?: string|null }} opts
 */
function enforceSingleNextStep(body, opts = {}) {
  let b = String(body || "").trim();
  b = b.replace(EMBEDDED_CMD_RE, "").trim();
  if (opts.suggestedCommand) {
    b = b.replace(COMP_NEXT_CMD_RE, "").trim();
  }
  return b;
}

/**
 * @param {string|number} userId
 * @param {string} text
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} [classifyCategory]
 */
function prepareCompanionContext(userId, text, session, lang, classifyCategory) {
  const memory = loadMemoryHierarchy(session);
  const state = analyzeUserState(text, session, classifyCategory);
  const rhythm = getActiveRhythmContext(session, lang);
  memory.session.timeSlot = rhythm.timeSlot;
  memory.session.rhythmPhase = rhythm.phase;

  const plan = selectResponsePlan(state, memory, rhythm);
  const conversationMode = resolveConversationMode(state, classifyCategory);

  const presenceSnap = buildPresenceSnapshot(session, state, text, classifyCategory);
  updateSession(userId, {
    ...engineSessionPatch(state),
    ...conversationModePatch(conversationMode),
    ...presenceMemoryPatch(presenceSnap),
    sessionEmotionalTrend: memory.session.emotionalTrend,
    rhythmPhase: rhythm.phase
  });

  return {
    userId,
    lang,
    memory,
    state,
    rhythm,
    plan,
    conversationMode,
    session,
    lastUserText: text
  };
}

/**
 * Final polish: presence → anti-loop → lane → wander → banned phrases.
 * @param {object} ctx from prepareCompanionContext
 * @param {string} category
 * @param {string} rawBody
 * @param {object} r getResponses bundle
 * @param {{ skipPresence?: boolean, skipRhythm?: boolean, withAdaptive?: Function }} [opts]
 */
function finalizeCompanionReply(ctx, category, rawBody, r, opts = {}) {
  let b = enforceSingleNextStep(rawBody, opts);
  const fresh = isFreshUserExperience(ctx.session || {});
  let presenceLayers = 0;

  const soulRhythm = resolveRhythmMode(
    ctx.state,
    ctx.session || {},
    ctx.lastUserText || "",
    category
  );
  const alive = resolveAliveContext(ctx, soulRhythm, category);
  const prepCap = maxPrepLayers(alive.texture);

  if (!fresh && category !== "onboarding" && !COHERENT_FLOW.has(category)) {
    if (soulRhythm.mode === "silent") {
      presenceLayers = 0;
    } else if (soulRhythm.mirror === "soften" || soulRhythm.mirror === "stabilize") {
      presenceLayers = Math.min(presenceLayers, prepCap);
    }

    const opening = pickDynamicOpening(ctx, category);
    if (opening && presenceLayers < prepCap) {
      b = lines(opening, "", b);
      presenceLayers += 1;
    }
    const trans = maybeNaturalTransition(
      ctx.session || {},
      ctx.lang,
      category,
      ctx.lastUserText || ""
    );
    if (trans && presenceLayers < prepCap) {
      b = lines(trans, "", b);
      presenceLayers += 1;
    }
    const skipWow =
      alive.texture === "presence" ||
      alive.texture === "quiet" ||
      category === "relational_flow";
    const wow = skipWow
      ? null
      : maybeMicroWow(
          ctx.session || {},
          ctx.lang,
          ctx.state,
          ctx.lastUserText || "",
          category
        );
    if (wow && presenceLayers < prepCap) {
      b = lines(wow, "", b);
      presenceLayers += 1;
      if (ctx.userId) {
        updateSession(ctx.userId, trackMicroWow(ctx.session || {}, wow));
      }
    }
  }

  const s = ctx.session || {
    messages: ctx.memory.short.turns,
    lastCategory: ctx.memory.short.lastCategory,
    responseStructures: ctx.memory.short.responseStructures
  };

  const lowEgoCats = new Set([
    "natural_conversation",
    "emotional_reflection",
    "life_flow",
    "relational_flow",
    "light_conversation",
    "casual_greeting"
  ]);
  if (lowEgoCats.has(category) && ctx.plan) {
    ctx.plan = {
      ...ctx.plan,
      action: "observe",
      depth: category === "life_flow" ? "short" : ctx.plan.depth,
      appendRhythm: false
    };
  }

  if (ctx.plan && !fresh) {
    ctx.plan = {
      ...ctx.plan,
      depth: soulRhythm.caps.depth || ctx.plan.depth
    };
  }

  const depth = soulRhythm.caps.depth || ctx.plan?.depth || ctx.state?.responseDepth || "medium";
  b = applyDepthScale(b, depth);
  if (!COHERENT_FLOW.has(category)) {
    b = applyEmotionalPacing(
      b,
      ctx.lang,
      s,
      ctx.plan,
      ctx.conversationMode,
      category,
      ctx.state
    );
  }
  b = applyLowEgoPass(b, ctx.lang, category, ctx.lastUserText || "", ctx.state);

  if (!fresh && category !== "onboarding" && !COHERENT_FLOW.has(category)) {
    const react = maybeMicroReaction(
      ctx.session || s,
      ctx.lang,
      ctx.lastUserText || "",
      category
    );
    if (react && b.split(/\n/).length < 5 && !b.startsWith(react)) {
      b = lines(react, "", b);
    }
  }

  const memLine = maybePresenceMemoryLine(
    ctx.session || s,
    ctx.lang,
    `${category}_${s.messages?.length || 0}`
  );

  const relCont = maybeRelationshipContinuity(
    ctx.session || s,
    ctx.lang,
    category
  );
  const thinAlive =
    alive.texture === "presence" || alive.texture === "quiet";
  if (relCont && !SKIP_MEMORY_CATEGORIES.has(category) && !fresh && !thinAlive) {
    b = lines(relCont, "", b);
  }

  const presenceCb = maybePresenceCallback(
    ctx.session || s,
    ctx.lang,
    category,
    `${category}_${s.messages?.length || 0}`
  );

  const skipCoherentMemory =
    COHERENT_FLOW.has(category) || thinAlive;

  const emoCont = maybeEmotionalContinuity(ctx.session || s, ctx.lang, ctx.lastUserText || "");
  if (emoCont && !SKIP_MEMORY_CATEGORIES.has(category) && !fresh && !skipCoherentMemory) {
    b = lines(emoCont, "", b);
  }

  if (presenceCb && !SKIP_MEMORY_CATEGORIES.has(category) && !fresh && !skipCoherentMemory) {
    b = lines(presenceCb, "", b);
  } else if (memLine && !SKIP_MEMORY_CATEGORIES.has(category) && !fresh && !skipCoherentMemory) {
    b = lines(memLine, "", b);
  }

  const attach = maybeAttachmentMoment(ctx.session || s, ctx.lang, category);
  if (
    attach &&
    !SKIP_MEMORY_CATEGORIES.has(category) &&
    !fresh &&
    !thinAlive &&
    b.split(/\n/).length < 6
  ) {
    b = lines(attach, "", b);
  }

  const threadLead = maybeThreadLead(ctx.session || s, ctx.lang);
  if (
    threadLead &&
    !SKIP_MEMORY_CATEGORIES.has(category) &&
    category !== "thread_continuity" &&
    !fresh
  ) {
    b = lines(threadLead, "", b);
  }

  if (!opts.skipPresence && !fresh) {
    b = applyTimePresence(b, ctx, category);
    b = applyPresence(b, ctx, category);
  }

  if (!fresh) {
    b = applyAntiLoop(ctx, b, category, r);
  } else {
    b = applyHumanVoiceGuard(b, ctx.lang, `${category}_fresh`);
  }

  if (
    !fresh &&
    category !== "onboarding" &&
    shouldUseOneLinePacing(ctx.lastUserText, ctx.state, category)
  ) {
    b = applyOneLinePacing(b, ctx.lang, `${category}_${ctx.userId}`);
  }

  if (!fresh) {
    b = applyHumanVoiceGuard(b, ctx.lang, `${category}_${ctx.userId}`);
    const humor = maybeGroundedHumor(
      ctx.state,
      ctx.lang,
      category,
      ctx.lastUserText || ""
    );
    if (
      humor &&
      b.split(/\n/).length < 4 &&
      alive.texture === "playful"
    ) {
      b = lines(b, "", humor);
    }
    const dragon = maybeDragonWhisper(ctx.lang, category, `${category}_${ctx.userId}`);
    if (
      dragon &&
      b.split(/\n/).length < 6 &&
      category !== "life_flow" &&
      category !== "natural_conversation" &&
      alive.texture !== "presence" &&
      alive.texture !== "quiet"
    ) {
      b = lines(b, "", dragon);
    }
  }

  if (!fresh && category !== "onboarding") {
    b = applyHumanCadence(b, ctx.lang, category, `${category}_${ctx.userId}`);
    b = applyInternalRhythm(
      b,
      soulRhythm,
      ctx.lang,
      `soul_${category}_${ctx.userId}`
    );
    if (ctx.userId) {
      updateSession(ctx.userId, {
        ...rhythmSessionPatch(soulRhythm.mode),
        ...textureSessionPatch(alive.texture)
      });
    }
    b = finalizeAlivePass(b, ctx, category, alive);
    b = finalizePremiumPass(b, ctx, category, alive, soulRhythm);
    b = finalizeHumanFirstPass(b, ctx, category, alive, soulRhythm);
    b = finalizePremiumFeelingPass(b, ctx, category, alive);
    b = finalizeBetaShipLock(b, ctx, category);
  }

  const skipPremiumTail = LATE_LAYER_SKIP.has(category) || CRISIS_TAIL_SKIP.has(category);

  if (!fresh && category !== "onboarding" && !skipPremiumTail) {
    const quiet = maybePremiumQuiet(
      ctx.state,
      ctx.session || s,
      ctx.lang,
      category,
      ctx.lastUserText || ""
    );
    if (quiet && b.split(/\n/).length < 6) {
      b = lines(b, "", quiet);
    } else {
      const warmth = maybeCompanionWarmth(
        ctx.state,
        ctx.session || s,
        ctx.lang,
        category,
        ctx.lastUserText || ""
      );
      if (warmth && b.split(/\n/).length < 6) {
        b = lines(b, "", warmth);
      }
      const closing = maybePremiumClosing(ctx, category, b);
      if (closing) {
        b = lines(b, "", closing);
      }
    }

    const dloop = maybeDailyLoopWhisper(ctx.session || s, ctx.lang, category);
    if (dloop && b.split(/\n/).length < 7) {
      b = lines(b, "", dloop);
    }
  }

  b = filterSelfHelpProduct(b);
  b = applyAtmosphereLayers(b, ctx, category);
  b = applyPersonalityGuard(b, ctx.lang, category);
  b = sanitizeBetaCopy(b);
  b = formatPremiumMessage(b);
  b = formatAtmosphereMessage(b);

  if (detectLaneWandering(s, category)) {
    updateSession(ctx.userId, { focusLocked: true });
    b = lines(r.tFocusLaneNudge, "", b);
  }

  if (opts.suggestedCommand && !opts.skipCommandHint) {
    const slot = getTimeSlot(ctx.session || {});
    const flowChat =
      COHERENT_FLOW.has(category) ||
      slot === "late_night" ||
      category === "life_flow" ||
      category === "relational_flow";
    if (!flowChat) {
      b = lines(b, "", `→ ${opts.suggestedCommand}`);
    }
  }

  if (
    ctx.plan.appendRhythm &&
    !opts.skipRhythm &&
    !COHERENT_FLOW.has(category) &&
    getTimeSlot(ctx.session || {}) !== "late_night"
  ) {
    const tail = rhythmTailIfNeeded(ctx.rhythm, ctx.lang);
    if (tail) b = lines(b, "", tail);
  }

  b = applyBannedPhraseRotation(s, b, r);

  if (opts.withAdaptive) {
    b = opts.withAdaptive(b);
  }

  if (!fresh && category !== "onboarding") {
    const timing = resolvePresenceTiming(ctx, category);
    b = finalizeSoulCoherence(b, ctx, category, alive, soulRhythm);
    b = finalizeBetaSurvival(b, ctx, category, alive, soulRhythm);
    b = finalizePresenceLock(b, ctx, category, timing);
    b = finalizeBetaImmersionHarden(b, ctx, category, timing);
    b = finalizeFinalBetaFeeling(b, ctx, category, timing, alive);
    b = finalizeHumanDepthRefinement(b, ctx, category, timing);
    b = finalizeNaturalConversationMaster(b, ctx, category, timing);
    b = finalizeWowExperience(b, ctx, category, timing, alive);
    b = finalizeEmotionalAttachment(b, ctx, category, timing);
    b = finalizePresenceEvolution(b, ctx, category, timing);
    b = finalizeHumanReturnPass(b, ctx, category, timing);
    b = finalizeSoulStability(b, ctx, category, timing);
    b = finalizePremiumAtmosphere(b, ctx, category, timing);
    b = finalizeRealEmotionalPresence(b, ctx, category, timing);
    b = finalizeCompanionFlowStabilization(b, ctx, category, timing);
    b = finalizePremiumAtmosphereLock(b, ctx, category, timing);
  }

  return b;
}

module.exports = {
  prepareCompanionContext,
  finalizeCompanionReply,
  enforceSingleNextStep,
  patchSessionMemory
};
