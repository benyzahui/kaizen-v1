/**
 * Presence lock — consistent calm energy, emotional timing, presence-only beats (phases 192–196).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { COHERENT_FLOW } = require("./soulCoherence");

const COACH_PUSH_RE =
  /\b(próbáld|try this|javaslom|you should|következő lépés|one block today|egy blokk mára)\b/i;

const CHAOTIC_ENERGY_RE = /!{2,}|🔥|💪|⚔|LET'S GO|GYERÜNK/i;

/**
 * @param {object} ctx
 * @param {string} category
 * @returns {'quiet'|'presence'|'soften'|'challenge'|'simplify'|'steady'}
 */
function resolveEmotionalTiming(ctx, category) {
  const t = String(ctx.lastUserText || "").trim();
  const state = ctx.state || {};

  if (/^(na\.?|ok\.?|hm\.?|…|\.\.\.)$/i.test(t)) return "quiet";
  if (t.length < 12 && !/\?/.test(t)) return "presence";
  if ((state.emotionalIntensity || 0) >= 6 || category === "relational_flow") return "soften";
  if ((state.scatter || 0) >= 6 || /(szétszórt|chaos|túl sok)/i.test(t)) return "simplify";
  if (
    state.mentorMode === "disciplined_push" &&
    /(holnap|later|majd|skipped|halog)/i.test(t) &&
    (state.seriousness || 50) < 45
  ) {
    return "challenge";
  }
  if ((state.emotionalIntensity || 0) <= 3 && t.length < 50) return "presence";
  return "steady";
}

/**
 * @param {string} body
 */
function calmConsistentEnergy(body) {
  return String(body || "")
    .replace(/!{2,}/g, ".")
    .replace(/!(\s|$)/g, ".$1")
    .replace(CHAOTIC_ENERGY_RE, "")
    .replace(/\?\s*\n/g, "\n")
    .trim();
}

/**
 * Presence is enough — drop coach push when user did not ask for help.
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function presenceWhenEnough(body, ctx, timing) {
  const t = String(ctx.lastUserText || "");
  const askedHelp = /(help|segít|mit csináljak|what should|how do i)\b/i.test(t);

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (timing === "quiet" || timing === "presence") {
    parts = parts.filter((line) => !COACH_PUSH_RE.test(line));
    if (parts.length > 2) parts = parts.slice(0, 2);
    if (parts.length === 0 || (timing === "quiet" && parts.length > 1)) {
      const r = getResponses(ctx.lang);
      const pool = r.presenceBeats || r.soulMicroBeats || r.listeningAck || [];
      if (pool.length) return pickSeeded(pool, `plen_${timing}_${ctx.userId}`);
    }
    return parts.join("\n");
  }

  if (timing === "soften") {
    parts = parts.filter((line) => !( /\?$/.test(line) && line.length > 45));
    if (parts.length > 2) parts = parts.slice(0, 2);
    return parts.join("\n");
  }

  if (timing === "simplify") {
    return parts.slice(0, 2).join("\n");
  }

  if (timing === "challenge" && !askedHelp) {
    parts = parts.slice(0, 2);
  }

  if (!askedHelp && timing !== "challenge") {
    parts = parts.filter((line) => !COACH_PUSH_RE.test(line));
  }

  if (parts.length > 3) parts = parts.slice(0, 3);
  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function finalizePresenceLock(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  let b = calmConsistentEnergy(body);
  b = presenceWhenEnough(b, ctx, timing);

  if (COHERENT_FLOW.has(category)) {
    const lines = b.split(/\n/).filter((l) => l.trim());
    const max = timing === "quiet" || timing === "presence" ? 2 : 3;
    if (lines.length > max) {
      b = lines.slice(0, max).join("\n");
    }
  }

  return b.trim();
}

module.exports = {
  finalizePresenceLock,
  resolveEmotionalTiming,
  calmConsistentEnergy,
  presenceWhenEnough
};
