/**
 * Elite companion atmosphere — felt calm, premium tone, micro immersion.
 * No new routing; shapes outgoing copy only.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const {
  maybePresenceLine,
  resolveAtmosphereContext
} = require("../atmosphere/atmosphereEngine");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|10x|unlock your|hustle harder|no excuses|győzd le|hajrá|go hard|grind set|sigma|alpha energy|limitless|warrior|harcos út|motivációs guru|internet motiv)\b/i;

const COACHY_RE =
  /\b(prove yourself|level up your life|manifest|hero's journey|become unstoppable|your best self)\b/i;

const ROBOT_EMPATHY_RE =
  /\b(i understand how you feel|that must be really hard for you|validating your feelings)\b/i;

/**
 * @param {string} body
 */
function stripHypeLines(body) {
  return String(body || "")
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (HYPE_RE.test(t)) return false;
      if (COACHY_RE.test(t)) return false;
      if (ROBOT_EMPATHY_RE.test(t)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Reduce same-opener rhythm (Értem / Na / Got it chains).
 * @param {string} body
 */
function softenRepeatedOpeners(body) {
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (parts.length < 2) return body;

  const seen = new Set();
  const out = [];
  for (const line of parts) {
    const opener = line.split(/[\s,.:—-]/)[0]?.toLowerCase() || "";
    if (opener.length >= 3 && seen.has(opener)) continue;
    if (opener.length >= 3) seen.add(opener);
    out.push(line);
  }
  return out.join("\n");
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function applyAtmosphereTone(body, lang, category) {
  if (category === "onboarding") return body;
  let b = stripHypeLines(body);
  b = softenRepeatedOpeners(b);
  return b;
}

/**
 * Nervous-system downshift line for overloaded state.
 * @param {object} ctx
 * @param {string} category
 */
function maybeStructuredCalm(ctx, category) {
  if (!ctx.session?.onboardingCompleted) return null;
  const pm = ctx.session?.presenceMemory;
  const overloaded =
    pm?.overloadActive ||
    pm?.emotionalState === "overloaded" ||
    ctx.state?.emotionalIntensity >= 6;
  if (!overloaded) return null;
  if (Math.random() > 0.09) return null;

  const r = getResponses(ctx.lang);
  const pool = r.structuredCalm || r.eliteAtmosphereCalm || r.premiumAtmosphere || [];
  if (!pool.length) return null;
  return pickSeeded(pool, `calm_${category}_${ctx.session.messages?.length || 0}`);
}

/**
 * Grounded micro-detail — body memory, small followups.
 * @param {object} ctx
 * @param {string} category
 */
function maybeMicroImmersion(ctx, category) {
  if (!ctx.session?.onboardingCompleted) return null;
  if ((ctx.session.messages || []).length < 2) return null;
  if (Math.random() > 0.07) return null;

  const r = getResponses(ctx.lang);
  const pool = r.microImmersion || [];
  if (!pool.length) return null;

  const pm = ctx.session.presenceMemory || {};
  const filtered = pool.filter((line) => {
    if (pm.emotionalState === "tired" && /feszesebb/i.test(line)) return false;
    return true;
  });
  const use = filtered.length ? filtered : pool;
  return pickSeeded(use, `micro_${category}_${pm.emotionalState}_${ctx.session.messages?.length || 0}`);
}

/**
 * Less “template clean” Telegram spacing.
 * @param {string} text
 */
function formatAtmosphereMessage(text) {
  let t = String(text || "").trim();
  if (!t) return t;

  t = t.replace(/\n{3,}/g, "\n\n");
  const parts = t.split(/\n/).map((l) => l.trimEnd());
  const out = [];
  let blankRun = 0;

  for (const line of parts) {
    if (!line.trim()) {
      blankRun += 1;
      if (blankRun <= 1) out.push("");
      continue;
    }
    blankRun = 0;
    out.push(line.trim());
  }

  t = out.join("\n").trim();
  if (Math.random() < 0.12 && t.includes("\n\n")) {
    t = t.replace(/\n\n/, "\n");
  }
  return t;
}

/**
 * Apply atmosphere layers before final format.
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
const ATMOSPHERE_APPEND_SKIP = new Set([
  "natural_conversation",
  "life_flow",
  "relational_flow",
  "light_conversation",
  "emotional_reflection",
  "immediate_recovery",
  "pattern_blocked",
  "emotional_repeat_triple",
  "session_loop",
  "avoidance_mirror",
  "cooldown"
]);

function applyAtmosphereLayers(body, ctx, category) {
  let b = applyAtmosphereTone(body, ctx.lang, category);
  if (ATMOSPHERE_APPEND_SKIP.has(category)) return b;

  const calm = maybeStructuredCalm(ctx, category);
  if (calm && b.split(/\n/).length < 5) {
    b = lines(calm, "", b);
  }

  const micro = maybeMicroImmersion(ctx, category);
  if (micro && b.split(/\n/).length < 6 && !b.includes(micro.slice(0, 20))) {
    b = lines(b, "", micro);
  }

  if (ctx.session?.onboardingCompleted && b.split(/\n/).length < 7) {
    const atm = resolveAtmosphereContext(ctx.session, ctx.lang);
    const uid = ctx.session.telegramUserId || ctx.session.userId || "0";
    const presence = maybePresenceLine(ctx.lang, atm.tone, atm.atmosphere, uid, 0.14);
    if (presence && !b.includes(presence)) {
      b = lines(b, "", presence);
    }
  }

  return b;
}

module.exports = {
  applyAtmosphereTone,
  stripHypeLines,
  softenRepeatedOpeners,
  maybeStructuredCalm,
  maybeMicroImmersion,
  formatAtmosphereMessage,
  applyAtmosphereLayers,
  HYPE_RE
};
