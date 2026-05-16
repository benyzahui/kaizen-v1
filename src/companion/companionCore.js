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

const SKIP_MEMORY_CATEGORIES = new Set([
  "onboarding",
  "language_switch",
  "companion_checkin",
  "cooldown"
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
    session
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
  const s = ctx.session || {
    messages: ctx.memory.short.turns,
    lastCategory: ctx.memory.short.lastCategory,
    responseStructures: ctx.memory.short.responseStructures
  };

  const depth = ctx.plan?.depth || ctx.state?.responseDepth || "medium";
  b = applyDepthScale(b, depth);
  b = applyEmotionalPacing(b, ctx.lang, s, ctx.plan, ctx.conversationMode, category);

  const memLine = maybePresenceMemoryLine(
    ctx.session || s,
    ctx.lang,
    `${category}_${s.messages?.length || 0}`
  );
  if (memLine && !SKIP_MEMORY_CATEGORIES.has(category)) {
    b = lines(memLine, "", b);
  }

  if (!opts.skipPresence) {
    b = applyTimePresence(b, ctx, category);
    b = applyPresence(b, ctx, category);
  }

  b = applyAntiLoop(ctx, b, category, r);
  b = formatPremiumMessage(b);

  if (detectLaneWandering(s, category)) {
    updateSession(ctx.userId, { focusLocked: true });
    b = lines(r.tFocusLaneNudge, "", b);
  }

  if (opts.suggestedCommand && !opts.skipCommandHint) {
    b = lines(b, "", `→ ${opts.suggestedCommand}`);
  }

  if (ctx.plan.appendRhythm && !opts.skipRhythm) {
    const tail = rhythmTailIfNeeded(ctx.rhythm, ctx.lang);
    if (tail) b = lines(b, "", tail);
  }

  b = variateIfSameShape(
    { lastAssistantPrints: [], messages: ctx.memory.short.turns },
    b,
    r
  );
  b = applyBannedPhraseRotation(s, b, r);

  if (opts.withAdaptive) {
    b = opts.withAdaptive(b);
  }

  return b;
}

module.exports = {
  prepareCompanionContext,
  finalizeCompanionReply,
  enforceSingleNextStep,
  patchSessionMemory
};
