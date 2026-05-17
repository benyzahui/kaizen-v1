/**
 * WOW experience layer — micro atmosphere, timed openings, rare surprises (phases 212–217).
 */

const { pickSeeded } = require("../personality/tone");
const { getTimeSlot } = require("../core/timeContext");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { COHERENT_FLOW } = require("./soulCoherence");
const { maybeMicroWow, trackMicroWow } = require("./microWow");
const { silenceHours } = require("./dynamicOpenings");
const { updateSession } = require("../session/sessionStore");

const WOW_SKIP = new Set([
  "onboarding",
  "help_intent",
  "immediate_recovery",
  "pattern_blocked",
  "cooldown",
  "crisis"
]);

const EMOJI_ANCHOR_RE =
  /^[\u{1F300}-\u{1FAFF}\u2600-\u27BF⚔🌘🌱🫀🔥🧠☕]/u;

const EMOJI_COUNT_RE =
  /[\u{1F300}-\u{1FAFF}\u2600-\u27BF⚔🌘🌱🫀🔥🧠☕]/gu;

/**
 * @param {string} text
 */
function countEmojiAnchors(text) {
  const m = String(text || "").match(EMOJI_COUNT_RE);
  return m ? m.length : 0;
}

/**
 * @param {string} line
 * @param {string} anchor
 */
function prefixAnchor(line, anchor) {
  const t = String(line || "").trim();
  if (!t || !anchor) return t;
  if (EMOJI_ANCHOR_RE.test(t)) return t;
  return `${anchor} ${t}`;
}

/**
 * @param {object} ctx
 * @param {string} category
 * @returns {string|null}
 */
function resolveAtmosphereAnchor(ctx, category) {
  if (WOW_SKIP.has(category)) return null;

  const slot = getTimeSlot(ctx.session || {});
  const state = ctx.state || {};
  const t = String(ctx.lastUserText || "");
  const pm = ctx.session?.presenceMemory || {};

  if (/(megcsináltam|sikerült|kicsit jobb|small win|finally did)/i.test(t)) return "🌱";
  if (pm.overloadActive || (state.scatter || 0) >= 6 || /(túl sok|overwhelm|szétes)/i.test(t)) {
    return "🔥";
  }
  if ((state.energyLevel ?? 5) <= 3 || /(kimerült|exhausted|nem aludtam)/i.test(t)) return "🫀";
  if (state.mentorMode === "sharp_focus" || /(trade|keresked|pre-market)/i.test(t)) return "🧠";
  if (slot === "morning") return "⚔";
  if (slot === "evening" || slot === "late_night") return "🌘";
  if (/^(na\.?|ok\.?|hm\.?)$/i.test(t.trim())) return "☕";
  return null;
}

/**
 * @param {object} ctx
 * @param {string} category
 */
function pickWowTimedOpening(ctx, category) {
  if (WOW_SKIP.has(category)) return null;
  if (!ctx.session?.onboardingCompleted) return null;

  const msgs = ctx.session?.messages || [];
  const hours = silenceHours(ctx.session || {});
  const isStart = msgs.length <= 2 || hours >= 4;
  if (!isStart && category !== "casual_greeting") return null;
  if (Math.random() > (isStart ? 0.22 : 0.1)) return null;

  const slot = getTimeSlot(ctx.session || {});
  const state = ctx.state || {};
  const t = String(ctx.lastUserText || "");
  const r = getResponses(ctx.lang);
  const pool = [];

  if (slot === "morning") pool.push(...(r.wowDynamicOpenings?.morning || []));
  if (slot === "evening" || slot === "late_night") {
    pool.push(...(r.wowDynamicOpenings?.lateNight || []));
  }
  if ((state.emotionalIntensity || 0) >= 5 || /(stress|félek|düh)/i.test(t)) {
    pool.push(...(r.wowDynamicOpenings?.afterStress || []));
  }
  if (/(megcsináltam|jobb|sikerült|win)/i.test(t)) {
    pool.push(...(r.wowDynamicOpenings?.afterProgress || []));
  }
  if (!pool.length) return null;

  return pickSeeded(pool, `wowopen_${slot}_${category}_${msgs.length}`);
}

/**
 * @param {object} ctx
 * @param {string} category
 */
function maybeSurpriseObservation(ctx, category) {
  if (WOW_SKIP.has(category)) return null;
  if ((ctx.session?.messages || []).length < 3) return null;
  if (Math.random() > 0.09) return null;

  const wow =
    maybeMicroWow(
      ctx.session || {},
      ctx.lang,
      ctx.state || {},
      ctx.lastUserText || "",
      category
    ) || null;

  if (wow) return wow;

  const r = getResponses(ctx.lang);
  const pool = r.wowSurprises || r.microWow?.general || [];
  if (!pool.length) return null;
  return pickSeeded(pool, `wowsur_${category}_${ctx.userId}`);
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} body
 */
function maybeCompanionMoment(ctx, category, body) {
  if (WOW_SKIP.has(category)) return body;
  const t = String(ctx.lastUserText || "");
  const emotional =
    (ctx.state?.emotionalIntensity || 0) >= 4 ||
    /(nehéz|kimond|bevall|őszint|magány|félek|stress)/i.test(t);

  if (!emotional || Math.random() > 0.12) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length >= 3) return body;

  const r = getResponses(ctx.lang);
  const pool = r.wowCompanionMoments || r.groundedWarmth || [];
  if (!pool.length) return body;

  const line = pickSeeded(pool, `wowcomp_${category}_${ctx.userId}`);
  if (body.includes(line.slice(0, 14))) return body;
  return lines(body, line);
}

/**
 * Premium spacing — short blocks, one breath between sections.
 * @param {string} body
 */
function applyWowPremiumDesign(body) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (parts.length <= 1) return body.trim();
  if (parts.length > 3) parts = parts.slice(0, 3);

  if (parts.join(" ").length < 140) {
    return parts.join("\n");
  }
  return parts.join("\n\n").trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 * @param {{ texture?: string }} [alive]
 */
function finalizeWowExperience(body, ctx, category, timing, alive) {
  if (category === "onboarding" || WOW_SKIP.has(category)) return body;

  let b = String(body || "").trim();
  if (!b) return b;

  const msgs = ctx.session?.messages || [];
  const usedAnchors = ctx.session?.wowAnchorsUsed || [];

  const opening = pickWowTimedOpening(ctx, category);
  if (opening && !b.includes(opening.slice(0, 12))) {
    const openLines = opening.split(/\n/).filter(Boolean);
    const anchor = resolveAtmosphereAnchor(ctx, category);
    if (anchor && openLines[0] && countEmojiAnchors(opening) === 0) {
      openLines[0] = prefixAnchor(openLines[0], anchor);
    }
    b = lines(openLines.join("\n"), b);
  }

  if (countEmojiAnchors(b) === 0 && Math.random() < 0.11) {
    const anchor = resolveAtmosphereAnchor(ctx, category);
    if (anchor && !usedAnchors.slice(-3).includes(anchor)) {
      const parts = b.split(/\n/).filter(Boolean);
      if (parts[0]) {
        parts[0] = prefixAnchor(parts[0], anchor);
        b = parts.join("\n");
        if (ctx.userId) {
          updateSession(ctx.userId, {
            wowAnchorsUsed: [...usedAnchors, anchor].slice(-8)
          });
        }
      }
    }
  }

  if (b.split(/\n/).filter(Boolean).length <= 2) {
    const surprise = maybeSurpriseObservation(ctx, category);
    if (surprise && !b.includes(surprise.slice(0, 16))) {
      if (Math.random() < 0.5 && b.length < 50) {
        b = surprise;
      } else if (b.split(/\n/).length < 2) {
        b = lines(b, surprise);
      }
      if (ctx.userId && surprise) {
        updateSession(ctx.userId, trackMicroWow(ctx.session || {}, surprise));
      }
    }
  }

  b = maybeCompanionMoment(ctx, category, b);

  if (alive?.texture !== "quiet" && timing !== "quiet") {
    b = applyWowPremiumDesign(b);
  }

  if (countEmojiAnchors(b) > 2) {
    const parts = b.split(/\n/).filter(Boolean);
    b = parts
      .map((line, i) => (i === 0 ? line : line.replace(EMOJI_COUNT_RE, "").trim()))
      .filter(Boolean)
      .join("\n");
  }

  if (COHERENT_FLOW.has(category) && b.split(/\n/).filter(Boolean).length > 3) {
    b = b.split(/\n/).slice(0, 3).join("\n");
  }

  return b.trim();
}

module.exports = {
  finalizeWowExperience,
  resolveAtmosphereAnchor,
  pickWowTimedOpening,
  maybeSurpriseObservation,
  maybeCompanionMoment,
  applyWowPremiumDesign,
  prefixAnchor,
  countEmojiAnchors
};
