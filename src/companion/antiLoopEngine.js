/**
 * ANTI_LOOP_ENGINE — unified repetition guard.
 * Tracks openings, endings, questions, framing across recent replies.
 */

const {
  extractStructure,
  isStructureRepeat,
  hasWeakQuestionPattern
} = require("../conversation/structureMemory");
const { variateIfSameShape } = require("../conversation/antiTemplate");
const { pickSeeded } = require("../personality/tone");

/**
 * @param {object} ctx companion context (memory.short + state)
 * @param {string} body
 * @param {string} category
 * @param {object} r responses bundle
 */
function applyAntiLoop(ctx, body, category, r) {
  let b = body;
  const sessionLike = {
    responseStructures: ctx.memory?.short?.responseStructures || [],
    messages: ctx.memory?.short?.turns || []
  };

  const struct = extractStructure(b);
  if (isStructureRepeat(sessionLike, struct) || hasWeakQuestionPattern(b)) {
    const rewrites = r.structureRewrites || [];
    if (rewrites.length) {
      b = pickSeeded(rewrites, `${category}_${sessionLike.messages.length}_loop`);
    }
  }

  const fpSession = {
    lastAssistantPrints: (ctx.memory?.short?.responseStructures || [])
      .slice(-2)
      .map((s) => s.opening)
  };
  b = variateIfSameShape(
    { ...sessionLike, lastAssistantPrints: fpSession.lastAssistantPrints },
    b,
    r
  );

  return b;
}

module.exports = { applyAntiLoop };
