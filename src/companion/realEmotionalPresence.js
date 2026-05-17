/**
 * Real emotional presence — timing, calm, safety; less coach/AI correctness.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { COHERENT_FLOW } = require("./soulCoherence");
const { snippetKey, pickUnseenVariant } = require("../conversation/responseVariation");

const OVERUSED_LINE_RE =
  /túl sok terhelés egyszerre|too much load at once|prea multă încărcare deodată/i;

const AI_CORRECT_RE =
  /\b(i understand that|i hear what you'?re saying|that'?s completely valid|teljes mértékben|absolutely understandable|makes perfect sense|it'?s natural to feel|ez teljesen érthető|természetes hogy így érzed|your feelings are valid)\b/i;

const OPTIMIZE_RE =
  /\b(optimize|optimization|level up|maximize output|hatékonyság növel|productivity hack|10x|unlock your potential)\b/i;

const COACH_PUSH_RE =
  /\b(próbáld meg|try this|javaslom hogy|you should|következő lépés|one block today|egy blokk mára|stabilizáló lépés|do this now)\b/i;

const INSIGHT_SHAPE_RE =
  /\b(a lényeg|the real issue|what matters is|fontos hogy észrevedd|the pattern here|key insight|sometimes the truth)\b/i;

const OVER_EXPLAIN_RE =
  /\b(let me explain|allow me to|worth noting|fontos megérteni|in other words|más szóval)\b/i;

/**
 * @param {object} ctx
 * @param {string} line
 */
function lineRecentlyUsed(ctx, line) {
  const used = new Set(ctx.session?.recentCoachSnippets || []);
  return used.has(snippetKey(line));
}

/**
 * @param {object} ctx
 * @param {string} text
 */
function groundedPoolForUser(ctx, text) {
  const r = getResponses(ctx.lang);
  let pool = [
    ...(r.quietPresenceBeats || []),
    ...(r.emotionalGrounding || []),
    ...(r.calmListening || []),
    ...(r.presenceOnlyBeats || [])
  ].filter(Boolean);

  if (/(magány|lonely|senki nincs|singur)/i.test(text)) {
    const f = pool.filter((p) => /(itt|hallg|magány|alone|singur|vagyok)/i.test(p));
    if (f.length) pool = f;
  } else if (/(lol|tab|humor|9000)/i.test(text)) {
    const f = pool.filter((p) => /(na|ablak|tab|agyar)/i.test(p));
    if (f.length) pool = f;
  } else if (/(jobb|recovery|megcsináltam|better)/i.test(text)) {
    const f = pool.filter((p) => /(elég|lépés|jó|enough|step)/i.test(p));
    if (f.length) pool = f;
  } else if (/^(na|ok|hm|…|\.\.\.)$/i.test(text.trim())) {
    const f = pool.filter((p) => /^(értem|hallom|itt|hm|na)/i.test(p) && p.length < 40);
    if (f.length) pool = f;
  }

  return pool;
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function rotateOverusedLines(body, ctx) {
  const t = String(ctx.lastUserText || "");
  const pool = groundedPoolForUser(ctx, t);
  if (!pool.length) return body;

  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const next = parts.map((line) => {
    if (!OVERUSED_LINE_RE.test(line) && !lineRecentlyUsed(ctx, line)) return line;
    const alt = pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
    return alt || line;
  });

  return next.join("\n");
}

/**
 * @param {string} body
 */
function stripAiCorrectness(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (AI_CORRECT_RE.test(line)) return false;
      if (OVER_EXPLAIN_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 */
function stripOverCoaching(body, ctx) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  if (askedHelp) return body;

  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (OPTIMIZE_RE.test(line)) return false;
      if (COACH_PUSH_RE.test(line) && line.length > 32) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function capInsightLines(body, ctx, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  if (askedHelp) return body;

  let kept = 0;
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (!INSIGHT_SHAPE_RE.test(line) && !/(fontos megérteni|worth noting)/i.test(line)) {
        return true;
      }
      kept += 1;
      return kept <= 1 && timing !== "pause" && timing !== "presence";
    });

  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function applyEmotionalTiming(body, ctx, category, timing) {
  const t = String(ctx.lastUserText || "").trim();
  let parts = body.split(/\n/).filter(Boolean);
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(t);

  if (timing === "pause" || timing === "presence") {
    if (!askedHelp && parts.length > 1) parts = [parts[0]];
  }

  if (timing === "ground" || timing === "soften") {
    if (!askedHelp && parts.length > 2) parts = parts.slice(0, 2);
    parts = parts.filter((line) => !( /\?$/.test(line) && line.length > 48));
  }

  if (t.length < 22 && parts.length > 1) {
    parts = [parts[0]];
  }

  if (COHERENT_FLOW.has(category) && parts.length > 2) {
    parts = parts.slice(0, 2);
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function ensureEmotionalSafety(body, ctx, timing) {
  if (body.length >= 10) return body;

  const pool = groundedPoolForUser(ctx, ctx.lastUserText || "");
  if (!pool.length) return body;

  const alt = pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
  if (!alt) return body;

  if (timing === "pause" || timing === "presence") {
    return alt.split(/\n/)[0] || alt;
  }
  return alt;
}

/**
 * @param {object} ctx
 * @param {string} body
 */
function maybeSubtleRealism(ctx, body) {
  if (Math.random() > 0.09) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (parts.length > 2 || (parts[0] || "").length > 70) return body;
  if (/^(hm\.|értem\.|hallom\.|na\.)/i.test(parts[0] || "")) return body;

  const r = getResponses(ctx.lang);
  const pool = (r.subtlePresenceBeats || r.humanReactions || []).filter((p) => p.length < 24);
  if (!pool.length) return body;

  const beat = pickSeeded(pool, `subtle_${ctx.userId}_${ctx.session?.messages?.length || 0}`);
  if (body.includes(beat)) return body;

  if (parts.length === 0) return beat;
  if (parts.length === 1) return lines(beat, parts[0]);
  return body;
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} [timing]
 */
function finalizeRealEmotionalPresence(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  let b = stripAiCorrectness(body);
  b = stripOverCoaching(b, ctx);
  b = capInsightLines(b, ctx, timing);
  b = applyEmotionalTiming(b, ctx, category, timing);
  b = rotateOverusedLines(b, ctx);
  b = ensureEmotionalSafety(b, ctx, timing);
  b = maybeSubtleRealism(ctx, b);

  if (OVERUSED_LINE_RE.test(b) || lineRecentlyUsed(ctx, b)) {
    b = rotateOverusedLines(b, ctx);
  }

  const parts = b.split(/\n/).filter(Boolean);
  if (parts.length > 2) {
    b = parts.slice(0, 2).join("\n");
  }

  return dedupeLines(b).trim();
}

module.exports = {
  finalizeRealEmotionalPresence,
  rotateOverusedLines,
  stripAiCorrectness,
  groundedPoolForUser
};
