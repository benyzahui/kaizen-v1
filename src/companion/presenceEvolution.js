/**
 * Digital presence evolution — timing, calm nervous system, micro connections (227–233).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { dedupeLines } = require("./humanVoiceGuard");
const { resolveEmotionalTiming } = require("./presenceLock");
const { COHERENT_FLOW } = require("./soulCoherence");
const { getTimeSlot } = require("../core/timeContext");

const SYNTHETIC_RE =
  /\b(fontos megérteni|let me explain|worth noting|identity is forged|chaos grows|validate your feelings|healing journey|you got this|crush it|manifest|10x|hero'?s journey)\b/i;

const ROBOT_EMPATHY_RE =
  /\b(i understand how you feel|that must be really hard for you|your feelings are valid|teljes mértékben értem)\b/i;

const STRUCTURE_OVERLOAD_RE =
  /\b(következő lépés|three steps|first,.*second|először.*másodszor|framework|protocol|minimum victory)\b/i;

const COACH_PUSH_RE =
  /\b(próbáld|try this|javaslom|you should|one block today|egy blokk mára)\b/i;

/**
 * Extended emotional timing — when to speak, soften, pause, ground, challenge.
 * @param {object} ctx
 * @param {string} category
 * @returns {'pause'|'presence'|'soften'|'ground'|'simplify'|'challenge'|'steady'}
 */
function resolvePresenceTiming(ctx, category) {
  const t = String(ctx.lastUserText || "").trim();
  const state = ctx.state || {};
  const base = resolveEmotionalTiming(ctx, category);

  if (/^(na\.?|ok\.?|hm\.?|…|\.\.\.)$/i.test(t)) return "pause";
  if (base === "quiet") return "pause";
  if (/(bizonytalan|uncertain|nem tudom mi|don't know what)/i.test(t)) return "soften";
  if (
    (state.emotionalIntensity || 0) >= 5 ||
    (state.scatter || 0) >= 6 ||
    /(túl sok|overwhelm|szétes|panic|pánik)/i.test(t)
  ) {
    return "ground";
  }
  if (/(kimerült|exhausted|fáradt|nem bírom)/i.test(t) && (state.energyLevel ?? 5) <= 4) {
    return "ground";
  }
  if (/(motiváció|lazy|lustas)/i.test(t) && (state.emotionalIntensity || 0) >= 4) {
    return "ground";
  }
  if (base === "simplify") return "simplify";
  if (base === "challenge") return "challenge";
  if (base === "presence") return "presence";
  if (base === "soften") return "soften";
  return "steady";
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 */
function applyCalmNervousSystem(body, ctx, timing) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");

  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (SYNTHETIC_RE.test(line) || ROBOT_EMPATHY_RE.test(line)) return false;
      if (!askedHelp && STRUCTURE_OVERLOAD_RE.test(line)) return false;
      if (!askedHelp && COACH_PUSH_RE.test(line) && line.length > 40) return false;
      if (line.length > 120) return false;
      return true;
    });

  const heavy = new Set(["ground", "soften", "simplify", "pause", "presence"]);
  if (heavy.has(timing) && parts.length > 2) {
    parts = parts.slice(0, 2);
  }
  if ((timing === "pause" || timing === "presence") && parts.length > 1) {
    parts = parts.slice(0, 1);
  }

  return parts.join("\n");
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} timing
 * @param {string} category
 */
function applyTimingBehavior(body, ctx, timing, category) {
  const askedHelp = /(help|segít|mit csináljak|what should)/i.test(ctx.lastUserText || "");
  let parts = body.split(/\n/).filter(Boolean);

  switch (timing) {
    case "pause":
    case "presence":
      if (parts.length > 1) parts = [parts[0]];
      break;
    case "ground":
      if (!askedHelp && parts.length > 2) parts = parts.slice(0, 2);
      if (!askedHelp) {
        parts = parts.filter((l) => !(/\?$/.test(l) && l.length > 50));
      }
      break;
    case "soften":
      parts = parts.filter((l) => !( /\?$/.test(l) && l.length > 55));
      if (parts.length > 2) parts = parts.slice(0, 2);
      break;
    case "simplify":
      parts = parts.slice(0, 2);
      break;
    case "challenge":
      if (!askedHelp && parts.length > 2) parts = parts.slice(0, 2);
      break;
    default:
      if (COHERENT_FLOW.has(category) && parts.length > 2) {
        parts = parts.slice(0, 2);
      }
  }

  return parts.join("\n");
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function maybeMicroConnection(ctx, category, timing) {
  if ((ctx.session?.messages || []).length < 3) return null;
  if (Math.random() > 0.1) return null;

  const t = String(ctx.lastUserText || "");
  const state = ctx.state || {};
  const r = getResponses(ctx.lang);
  const pool = r.microConnections || [];

  let filtered = pool;
  if (/(motiváció|lazy|lustas)/i.test(t)) {
    filtered = pool.filter((p) => /(kifáradt|motiválatlan|tired|exhausted)/i.test(p));
  }
  if (/(kontroll|control|túl sokáig)/i.test(t) || (state.emotionalIntensity || 0) >= 5) {
    filtered = pool.filter((p) => /(kontroll|control|tested|body|🫀)/i.test(p));
  }
  if (!filtered.length) filtered = pool;
  if (!filtered.length) return null;

  if (timing === "ground" || timing === "soften") {
    return pickSeeded(filtered, `microc_${timing}_${category}_${ctx.userId}`);
  }
  if (Math.random() > 0.5) return null;
  return pickSeeded(filtered, `microc_${category}_${ctx.userId}`);
}

/**
 * @param {object} ctx
 * @param {string} category
 */
function maybeSoftMemoryCallback(ctx, category) {
  if ((ctx.session?.messages || []).length < 8) return null;
  if (Math.random() > 0.11) return null;

  const r = getResponses(ctx.lang);
  const pool = r.softMemoryCallbacks || r.emotionalFamiliarity || [];
  if (!pool.length) return null;

  const pm = ctx.session?.presenceMemory || {};
  const rhythm = pm.relationshipRhythm || {};
  const slot = getTimeSlot(ctx.session || {});

  let filtered = pool;
  if (rhythm.lastScatteredSlot === slot) {
    filtered = pool.filter((p) => /(múltkor|ilyenkor|zajos)/i.test(p));
  }
  if (pm.previousEmotionalState === "overloaded" && pm.emotionalState === "grounded") {
    filtered = pool.filter((p) => /(tegnap|széthúz|calmer|nyugodtabb)/i.test(p));
  }
  if (!filtered.length) filtered = pool;

  return pickSeeded(filtered, `softmem_${category}_${ctx.session?.messages?.length || 0}`);
}

/**
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function maybePresenceWowRhythm(ctx, category, timing) {
  if (Math.random() > 0.08) return null;
  if (timing === "pause" || timing === "presence") return null;

  const r = getResponses(ctx.lang);
  const pool = r.presenceWowRhythm || r.wowSurprises || [];
  if (!pool.length) return null;

  return pickSeeded(pool, `pwr_${timing}_${category}_${ctx.userId}`);
}

/**
 * @param {string} body
 */
function stripSyntheticPresence(body) {
  return String(body || "")
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (SYNTHETIC_RE.test(t) || ROBOT_EMPATHY_RE.test(t)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 * @param {string} timing
 */
function finalizePresenceEvolution(body, ctx, category, timing) {
  if (category === "onboarding") return body;

  const mode = timing || resolvePresenceTiming(ctx, category);

  let b = stripSyntheticPresence(body);
  b = applyCalmNervousSystem(b, ctx, mode);
  b = applyTimingBehavior(b, ctx, mode, category);

  const parts = b.split(/\n/).filter(Boolean);
  if (parts.length <= 2) {
    const micro = maybeMicroConnection(ctx, category, mode);
    if (micro && !b.includes(micro.slice(0, 18))) {
      if (parts.length === 0 || (mode === "ground" && Math.random() < 0.45)) {
        b = micro;
      } else if (parts.length < 2) {
        b = lines(b, micro);
      }
    }

    const wow = maybePresenceWowRhythm(ctx, category, mode);
    if (wow && !b.includes(wow.slice(0, 16)) && parts.length <= 1 && Math.random() < 0.4) {
      b = wow;
    }

    const mem = maybeSoftMemoryCallback(ctx, category);
    if (mem && !b.includes(mem.slice(0, 14)) && parts.length <= 1 && Math.random() < 0.35) {
      b = lines(mem, b);
    }
  }

  if (mode === "pause" || mode === "presence") {
    const linesArr = b.split(/\n/).filter(Boolean);
    if (linesArr.length > 1) b = linesArr[0];
  }

  return dedupeLines(b).trim();
}

module.exports = {
  finalizePresenceEvolution,
  resolvePresenceTiming,
  applyCalmNervousSystem,
  maybeMicroConnection,
  maybeSoftMemoryCallback,
  maybePresenceWowRhythm,
  stripSyntheticPresence
};
