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

  updateSession(userId, {
    ...engineSessionPatch(state),
    ...conversationModePatch(conversationMode),
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
  let b = rawBody;
  const s = ctx.session || {
    messages: ctx.memory.short.turns,
    lastCategory: ctx.memory.short.lastCategory,
    responseStructures: ctx.memory.short.responseStructures
  };

  b = applyEmotionalPacing(b, ctx.lang, s, ctx.plan);

  if (!opts.skipPresence) {
    b = applyPresence(b, ctx, category);
  }

  b = applyAntiLoop(ctx, b, category, r);

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
  patchSessionMemory
};
