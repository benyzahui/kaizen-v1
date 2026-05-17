/**
 * Premium closings — land the message, no generic motivation.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { resolveMirrorMode } = require("./stateMirroring");

const CLOSE_SKIP = new Set([
  "onboarding",
  "cooldown",
  "help_intent",
  "casual_greeting",
  "micro_reward"
]);

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 */
function maybePremiumClosing(ctx, category, body) {
  if (CLOSE_SKIP.has(category)) return null;
  if (!ctx.session?.onboardingCompleted) return null;

  const b = String(body || "").trim();
  if (!b || b.length < 20) return null;
  if (/\?$/.test(b.split(/\n/).pop() || "")) return null;
  if (Math.random() > 0.2) return null;

  const mirror = resolveMirrorMode(
    ctx.state,
    ctx.session,
    ctx.lastUserText,
    category
  );
  const r = getResponses(ctx.lang);
  const base =
    r.companionClosings?.[mirror] ||
    r.companionClosings?.general ||
    [];
  const atmosphere = r.premiumAtmosphere || [];
  const pool =
    atmosphere.length && Math.random() < 0.35
      ? [...base, ...atmosphere]
      : base;
  if (!pool.length) return null;

  const lastLine = b.split(/\n/).pop() || "";
  const pick = pickSeeded(
    pool,
    `close_${mirror}_${category}_${ctx.session.messages?.length || 0}`
  );
  if (lastLine.includes(pick.slice(0, 24))) return null;
  return pick;
}

module.exports = { maybePremiumClosing, CLOSE_SKIP };
