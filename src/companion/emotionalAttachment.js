/**
 * Emotional attachment layer — familiarity, safe presence, warmth, presence-over-solutions (219–224).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { getTimeSlot } = require("../core/timeContext");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { maybeRelationshipContinuity } = require("./relationshipPresence");
const { maybeEmotionalContinuity } = require("./emotionalContinuity");

const PRESSURE_RE =
  /\b(no excuses|nincs kifogás|prove yourself|failed your|te vagy gyenge|discipline now|fegyelem most|must push|kell erősebb)\b/i;

const SOLVE_PUSH_RE =
  /\b(próbáld|try this|javaslom|you should|következő lépés|one block today|egy blokk mára|stabilizáló lépés)\b/i;

const MANIPULATIVE_RE =
  /\b(you need me|nélkülem|without me you|don't leave|ne hagyj el|guilt|szégyenkezz)\b/i;

/**
 * @param {object} ctx
 * @param {string} category
 * @returns {string|null}
 */
function maybeEmotionalFamiliarity(ctx, category) {
  if (!ctx.session?.onboardingCompleted) return null;
  if ((ctx.session.messages || []).length < 6) return null;
  if (Math.random() > 0.13) return null;

  const rel =
    maybeRelationshipContinuity(ctx.session || {}, ctx.lang, category) ||
    maybeEmotionalContinuity(ctx.session || {}, ctx.lang, ctx.lastUserText || "");

  if (rel) return rel;

  const r = getResponses(ctx.lang);
  const pool = r.emotionalFamiliarity || [];
  if (!pool.length) return null;

  const pm = ctx.session?.presenceMemory || {};
  const rhythm = pm.relationshipRhythm || {};
  const slot = getTimeSlot(ctx.session || {});

  let filtered = pool;
  if (rhythm.lastScatteredSlot === slot) {
    filtered = pool.filter((p) => /(múltkor|ilyenkor|szétszórt)/i.test(p));
  }
  if (pm.previousEmotionalState === "overloaded" && pm.emotionalState === "grounded") {
    filtered = pool.filter((p) => /(nyugodtabb|pár nap|tegnap)/i.test(p));
  }
  if (!filtered.length) filtered = pool;

  return pickSeeded(filtered, `fam_${slot}_${pm.emotionalState}_${category}`);
}

/**
 * @param {string} body
 */
function ensureSafePresenceFeel(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (PRESSURE_RE.test(line)) return false;
      if (MANIPULATIVE_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
function presenceOverSolutions(body, ctx, category) {
  const askedHelp = /(help|segít|mit csináljak|what should|how do i)\b/i.test(
    String(ctx.lastUserText || "")
  );
  if (askedHelp) return body;

  const emotional =
    (ctx.state?.emotionalIntensity || 0) >= 4 ||
    /(nehéz|félek|magány|stress|kimerült|szégyen|overwhelm)/i.test(ctx.lastUserText || "");

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (emotional || COHERENT_FLOW.has(category)) {
    parts = parts.filter((line) => !SOLVE_PUSH_RE.test(line) || line.length < 32);
  }

  const questions = parts.filter((l) => /\?$/.test(l) && l.length > 50);
  if (questions.length && emotional) {
    parts = parts.filter((l) => !questions.includes(l));
  }

  if (!parts.length && emotional) {
    const r = getResponses(ctx.lang);
    const pool = r.presenceOnlyBeats || r.naturalEmotionalSupport || [];
    if (pool.length) {
      return pickSeeded(pool, `pres_${category}_${ctx.userId}`);
    }
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} category
 */
function maybeHumanWarmth(ctx, body, category) {
  const t = String(ctx.lastUserText || "");
  const emotional =
    (ctx.state?.emotionalIntensity || 0) >= 4 ||
    /(nehéz|kimond|bevall|őszint|magány|félek)/i.test(t);

  if (!emotional || Math.random() > 0.11) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 3) return body;

  const r = getResponses(ctx.lang);
  const pool = r.humanWarmth || r.groundedWarmth || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, `warm_${category}_${ctx.userId}`);
  if (body.includes(line.slice(0, 14))) return body;
  return lines(body, line);
}

/**
 * @param {object} ctx
 * @param {string} body
 * @param {string} category
 */
function maybeMicroAttachment(ctx, body, category) {
  if ((ctx.session?.messages || []).length < 4) return body;
  if (Math.random() > 0.1) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 3) return body;

  const r = getResponses(ctx.lang);
  const pool = r.microAttachmentMoments || r.attachmentMoments?.return || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, `attach_${category}_${ctx.session?.messages?.length || 0}`);
  if (body.includes(line.slice(0, 12))) return body;

  if (/(jobb|megcsináltam|sikerült|win)/i.test(ctx.lastUserText || "") && !line.startsWith("🌱")) {
    const withSeed = pool.find((p) => p.startsWith("🌱")) || line;
    return lines(body, withSeed);
  }

  return lines(body, line);
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeEmotionalAttachment(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  let b = ensureSafePresenceFeel(body);
  b = presenceOverSolutions(b, ctx, category);

  const familiar = maybeEmotionalFamiliarity(ctx, category);
  if (familiar && !b.includes(familiar.slice(0, 16))) {
    const parts = b.split(/\n/).filter(Boolean);
    if (parts.length <= 1 && Math.random() < 0.55) {
      b = lines(familiar, b);
    }
  }

  if (b.split(/\n/).filter(Boolean).length <= 2) {
    b = maybeHumanWarmth(ctx, b, category);
    b = maybeMicroAttachment(ctx, b, category);
  }

  if (timing === "quiet" || timing === "presence") {
    const parts = b.split(/\n/).filter(Boolean);
    if (parts.length > 1) b = parts[0];
  }

  return dedupeLines(b).trim();
}

/**
 * Blend emotional daily rhythm into ritual copy.
 * @param {string} body
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 */
function blendEmotionalDailyRhythm(body, slot, lang, session) {
  if (Math.random() > 0.38) return body;

  const r = getResponses(lang);
  const pool =
    r.dailyReturnRhythm?.[slot] ||
    r.emotionalDailyRhythm?.[slot] ||
    r.timePresence?.[slot === "late_night" ? "late_night" : slot] ||
    [];
  if (!pool.length) return body;

  const touch = pickSeeded(pool, `edr_${slot}_${session?.userId || "0"}`);
  if (body.includes(touch.slice(0, 14))) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 2) return body;
  return lines(body, touch);
}

module.exports = {
  finalizeEmotionalAttachment,
  maybeEmotionalFamiliarity,
  ensureSafePresenceFeel,
  presenceOverSolutions,
  maybeHumanWarmth,
  maybeMicroAttachment,
  blendEmotionalDailyRhythm
};
