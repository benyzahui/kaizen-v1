/**
 * Symbolic emotion system — sparse anchors, emotional timing (270–271).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { getTimeSlot } = require("../core/timeContext");
const { pickUnseenVariant } = require("../conversation/responseVariation");

const SYMBOL_RE =
  /⚔|🌘|🔥|🫀|🌱|🧠|☕|🫂|🐉|📉|🌊/gu;

const SYMBOL_MEANINGS = {
  "⚔": "activation",
  "🌘": "evening_calm",
  "🔥": "overload",
  "🫀": "body",
  "🌱": "progress",
  "🧠": "mental_overload",
  "☕": "grounding",
  "🫂": "support",
  "🐉": "presence",
  "📉": "chaos_warning",
  "🌊": "calm"
};

/**
 * @param {string} text
 */
function countSymbols(text) {
  return (String(text || "").match(SYMBOL_RE) || []).length;
}

/**
 * @param {object} ctx
 * @param {string} [timing]
 */
function resolveSymbolicAnchor(ctx, timing) {
  const state = ctx.state || {};
  const pm = ctx.session?.presenceMemory || {};
  const slot = getTimeSlot(ctx.session || {});
  const t = String(ctx.lastUserText || "");

  if ((state.emotionalIntensity || 0) >= 6 || pm.emotionalState === "overloaded") {
    return "🔥";
  }
  if ((state.scatter || 0) >= 6 || /(tab|szétszórt|overwhelm|túl sok)/i.test(t)) {
    return "🧠";
  }
  if ((state.energyLevel ?? 5) <= 3 || /(kimerült|exhausted|fáradt)/i.test(t)) {
    return "🫀";
  }
  if (slot === "late_night" || slot === "evening") {
    return "🌘";
  }
  if (timing === "challenge" || state.mentorMode === "disciplined_push") {
    return "⚔";
  }
  if (timing === "pause" || timing === "presence") {
    return "☕";
  }
  if (/(magány|lonely|senki)/i.test(t)) {
    return "🫂";
  }
  if (pm.emotionalState === "grounded" && (state.emotionalIntensity || 0) <= 3) {
    return "🌱";
  }
  if (Math.random() < 0.06) {
    return "🐉";
  }
  return null;
}

/**
 * @param {string} line
 * @param {string} symbol
 */
function prefixSymbol(line, symbol) {
  const trimmed = String(line || "").trim();
  if (!trimmed || !symbol) return trimmed;
  if (SYMBOL_RE.test(trimmed.slice(0, 4))) return trimmed;
  return `${symbol} ${trimmed}`;
}

/**
 * Max one symbolic anchor per message; remove duplicates.
 * @param {string} body
 */
function normalizeSymbolicDensity(body) {
  let symUsed = false;
  const lines = String(body || "")
    .split(/\n/)
    .map((line) => {
      let l = line.trim();
      if (!l) return "";
      const n = countSymbols(l);
      if (n === 0) return l;
      if (symUsed) {
        return l.replace(SYMBOL_RE, "").replace(/\s{2,}/g, " ").trim();
      }
      symUsed = true;
      return l;
    })
    .filter(Boolean);

  return lines.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} [timing]
 */
function applySymbolicTiming(body, ctx, timing) {
  if (countSymbols(body) >= 1) {
    return normalizeSymbolicDensity(body);
  }
  if (Math.random() > 0.28) return body;

  const symbol = resolveSymbolicAnchor(ctx, timing);
  if (!symbol) return body;

  const parts = body.split(/\n/).filter(Boolean);
  if (!parts.length) return body;
  if (parts[0].length > 90) return body;

  parts[0] = prefixSymbol(parts[0], symbol);
  return normalizeSymbolicDensity(parts.join("\n"));
}

/**
 * @param {object} ctx
 * @param {string} [timing]
 */
function maybeSymbolicCompanionMoment(ctx, timing) {
  if (Math.random() > 0.11) return null;
  if (timing === "challenge") return null;

  const r = getResponses(ctx.lang);
  const pool = r.symbolicCompanionMoments || [];
  if (!pool.length) return null;

  return pickUnseenVariant(ctx.session || {}, ctx.userId, pool);
}

/**
 * Energy read: one symbol + compact lines.
 * @param {string} body
 * @param {object} ctx
 */
function applySymbolicEnergyRead(body, ctx) {
  const lang = ctx.lang || "en";
  let b = body;
  const lines = b.split(/\n/).filter(Boolean);
  if (lines.length > 6) {
    b = lines.slice(0, 4).join("\n");
  }
  const symbol = resolveSymbolicAnchor(ctx, "steady") || "🌘";
  const first = lines[0] || "";
  if (!SYMBOL_RE.test(first.slice(0, 3))) {
    const rest = lines.slice(1).join("\n");
    b = rest ? `${prefixSymbol(first, symbol)}\n${rest}` : prefixSymbol(first, symbol);
  }
  return normalizeSymbolicDensity(b);
}

module.exports = {
  resolveSymbolicAnchor,
  applySymbolicTiming,
  applySymbolicEnergyRead,
  maybeSymbolicCompanionMoment,
  normalizeSymbolicDensity,
  countSymbols,
  SYMBOL_MEANINGS
};
