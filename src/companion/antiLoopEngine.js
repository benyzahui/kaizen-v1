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
const { applyResponseVariation } = require("../conversation/responseVariationEngine");
const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const HARD_BANNED = [
  /one fact\.?\s*one intent/i,
  /hold\.?\s*then step/i,
  /smallest finish line you can cross/i,
  /what is the next stabilizing action/i,
  /one grounded sentence is enough/i
];

function stripHardBannedPhrases(body, lang) {
  let b = String(body || "");
  const r = getResponses(lang);
  const alts = r.loopPhraseAlts || {};
  for (const re of HARD_BANNED) {
    if (re.test(b)) {
      const key = Object.keys(alts).find((k) => re.source.includes(k.split(".")[0]));
      const alt = key ? alts[key] : pickSeeded(r.structureRewrites || ["Move one inch."], re.source);
      b = b.replace(re, alt);
    }
  }
  return b;
}

/**
 * @param {object} ctx companion context (memory.short + state)
 * @param {string} body
 * @param {string} category
 * @param {object} r responses bundle
 */
function applyAntiLoop(ctx, body, category, r) {
  let b = stripHardBannedPhrases(body, ctx.lang);
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

  const sess = ctx.session || {};
  b = applyResponseVariation(
    {
      ...sessionLike,
      recentAssistantOpenings: sess.recentAssistantOpenings,
      recentAssistantEndings: sess.recentAssistantEndings,
      recentPhraseHits: sess.recentPhraseHits
    },
    b,
    ctx.lang,
    `${category}_${sessionLike.messages?.length || 0}`
  );

  return b;
}

module.exports = { applyAntiLoop };
