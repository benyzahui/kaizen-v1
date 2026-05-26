/**
 * Program atmosphere finalization — premium daily feel, quiet presence, less AI tone.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { maybePresenceLine } = require("./emotionalPresencePool");
const { stripHypeLines, softenRepeatedOpeners } = require("../companion/atmospherePresence");

const MAX_DAILY_LINES = 18;
const MAX_DAILY_CHARS = 780;
const MAX_EMOJI_LINES = 5;

const AI_TRACE_RE = [
  /\b(how can i help|how may i assist|feel free to ask|let me know if you need)\b/i,
  /\b(i understand how you feel|that must be (really )?hard for you|validating your feelings)\b/i,
  /\b(believe in yourself|you'?ve got this|remember that you)\b/i,
  /\b(as an ai|as a language model|open chat)\b/i,
  /\b(értem hogyan érzed|mesélj még|hogyan segíthetek|bármiben segítek)\b/i,
  /\b(înțeleg cum te simți|sunt aici pentru tine)\b/i,
  /\b(important to remember|first step toward|journey of)\b/i,
  /\b(következő lépés:|three things you can|here are some ways)\b/i
];

const GENERIC_OPENER_RE =
  /^(Értem\.|Got it\.|I hear you\.|Understood\.|Na\.|Oké\.|Okay\.)\s*$/im;

const PROGRAM_WHISPERS = {
  hu: [
    "⚔ A rendszer kis lépésekből épül.",
    "🌘 A regeneráció is a program része.",
    "🐉 Dragon Blueprint — napi ritmus.",
    "Egy kis lépés is a program része."
  ],
  en: [
    "⚔ The system builds from small steps.",
    "🌘 Recovery is part of the program.",
    "🐉 Dragon Blueprint — daily rhythm.",
    "One small step still counts."
  ],
  ro: [
    "⚔ Sistemul se construiește din pași mici.",
    "🌘 Recuperarea e parte din program.",
    "🐉 Dragon Blueprint — ritm zilnic.",
    "Un pas mic contează în program."
  ]
};

/**
 * @param {string} text
 */
function countEmoji(text) {
  const m = String(text || "").match(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu);
  return m ? m.length : 0;
}

/**
 * @param {string} body
 */
function stripAssistantTone(body) {
  let lines = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return true;
      for (const re of AI_TRACE_RE) {
        if (re.test(line)) return false;
      }
      if (GENERIC_OPENER_RE.test(line)) return false;
      return true;
    });

  lines = lines.filter((line, i) => {
    if (i === 0 || !line) return true;
    const prev = lines[i - 1];
    if (line === prev) return false;
    if (/^→\s*\/\w+/.test(line) && /^→\s*\/\w+/.test(prev)) return false;
    return true;
  });

  return lines.join("\n").trim();
}

/**
 * Calm Telegram spacing — intentional, not walls.
 * @param {string} text
 * @param {{ maxLines?: number, maxChars?: number }} [opts]
 */
function formatPremiumDailyMessage(text, opts = {}) {
  const maxLines = opts.maxLines ?? MAX_DAILY_LINES;
  const maxChars = opts.maxChars ?? MAX_DAILY_CHARS;

  let t = stripHypeLines(String(text || ""));
  t = softenRepeatedOpeners(t);
  t = stripAssistantTone(t);
  t = t.replace(/\n{3,}/g, "\n\n");

  let parts = t.split(/\n/).map((l) => l.trimEnd());
  const out = [];
  let emojiLines = 0;

  for (const line of parts) {
    if (!line.trim()) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }
    const em = countEmoji(line);
    if (em > 2 && emojiLines >= MAX_EMOJI_LINES) continue;
    if (em > 0) emojiLines += 1;
    out.push(line.trim());
  }

  t = out.join("\n").trim();

  const seenTags = new Set();
  t = t
    .split(/\n/)
    .filter((line) => {
      if (/Dragon Blueprint/i.test(line) && seenTags.has("db")) return false;
      if (/Dragon Blueprint/i.test(line)) seenTags.add("db");
      return true;
    })
    .join("\n")
    .trim();

  let lines = t.split(/\n/).filter(Boolean);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    t = lines.join("\n");
  }
  if (t.length > maxChars) {
    t = lines.slice(0, Math.max(4, Math.floor(maxLines * 0.7))).join("\n");
  }

  return t.trim();
}

/**
 * Rare program whisper — not every message.
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {number} [chance]
 */
function maybeProgramWhisper(lang, userId, dateKey, chance = 0.07) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const seed = `${userId}|whisper|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 20 >= Math.floor(chance * 20)) return "";

  const pool = PROGRAM_WHISPERS[locked] || PROGRAM_WHISPERS.en;
  return pickSeeded(pool, seed);
}

/**
 * Final outbound polish for commands + daily rhythm.
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {object} [meta]
 */
function applyProgramAtmosphereFinalize(body, lang, session, userId, meta = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const { applyRhythmIntelligenceFinalize } = require("../rhythm/rhythmIntelligenceEngine");
  let pre = body;
  if (session?.onboardingCompleted && meta.rhythmIntelligence !== false) {
    pre = applyRhythmIntelligenceFinalize(pre, locked, session, userId, meta);
    if (meta._rhythmFormatOpts) {
      meta.formatOpts = { ...(meta.formatOpts || {}), ...meta._rhythmFormatOpts };
    }
  }
  let out = formatPremiumDailyMessage(pre, meta.formatOpts);

  if (meta.quietPresence !== false && session?.onboardingCompleted) {
    const { resolveAtmosphereContext } = require("./atmosphereEngine");
    const atm = resolveAtmosphereContext(session, locked);
    const presence = maybePresenceLine(locked, atm.tone, atm.atmosphere, userId, 0.06);
    if (presence && !out.includes(presence)) {
      const lineCount = out.split(/\n/).filter(Boolean).length;
      if (lineCount < 14) {
        out = [out, "", presence].filter(Boolean).join("\n");
      }
    }
  }

  if (meta.programWhisper !== false) {
    const whisper = maybeProgramWhisper(locked, userId, meta.dateKey || "today", 0.05);
    if (whisper && !out.includes(whisper.slice(0, 12))) {
      const lc = out.split(/\n/).filter(Boolean).length;
      if (lc < 12 && !/Dragon Blueprint/i.test(out)) {
        out = [whisper, "", out].join("\n").trim();
      }
    }
  }

  if (meta.hopePresence !== false) {
    const { applyHopePresenceFinalize } = require("../presence/hopePresenceEngine");
    const { getTimeSlot } = require("../core/timeContext");
    out = applyHopePresenceFinalize(out, locked, session, userId, {
      dateKey: meta.dateKey,
      phase: meta.phase || getTimeSlot(session, meta.now || new Date()),
      now: meta.now,
      hopeChance: meta.hopeChance,
      hopePresence: meta.hopePresence,
      maxLinesBeforeHope: meta.maxLinesBeforeHope
    });
  }

  if (meta.communityPresence !== false) {
    const { applyCommunityPresenceFinalize } = require("../community/originStoryAtmosphere");
    const { getTimeSlot } = require("../core/timeContext");
    out = applyCommunityPresenceFinalize(out, locked, session, userId, {
      dateKey: meta.dateKey,
      phase: meta.phase || getTimeSlot(session, meta.now || new Date()),
      now: meta.now,
      communityChance: meta.communityChance,
      communityPresence: meta.communityPresence,
      maxLinesBeforeCommunity: meta.maxLinesBeforeCommunity
    });
  }

  if (meta.rebuilding !== false) {
    const { applyRebuildingFinalize } = require("../rebuilding/rebuildingEngine");
    const { getTimeSlot } = require("../core/timeContext");
    out = applyRebuildingFinalize(out, locked, session, userId, {
      dateKey: meta.dateKey,
      phase: meta.phase || getTimeSlot(session, meta.now || new Date()),
      now: meta.now,
      inboundText: meta.inboundText,
      rebuildingChance: meta.rebuildingChance,
      rebuilding: meta.rebuilding,
      maxLinesBeforeRebuild: meta.maxLinesBeforeRebuild
    });
  }

  if (meta.lifeBalance !== false) {
    const { applyLifeBalanceFinalize } = require("../lifeBalance/lifeBalanceEngine");
    const { getTimeSlot } = require("../core/timeContext");
    out = applyLifeBalanceFinalize(out, locked, session, userId, {
      dateKey: meta.dateKey,
      phase: meta.phase || getTimeSlot(session, meta.now || new Date()),
      now: meta.now,
      inboundText: meta.inboundText,
      lifeBalanceChance: meta.lifeBalanceChance,
      lifeBalance: meta.lifeBalance,
      maxLinesBeforeLifeBalance: meta.maxLinesBeforeLifeBalance
    });
  }

  return formatPremiumDailyMessage(out, meta.formatOpts);
}

/**
 * Score AI traces in body (0 = clean, 100 = spam).
 * @param {string} body
 */
function aiTraceScore(body) {
  const lines = String(body || "").split(/\n/).filter(Boolean);
  if (!lines.length) return 0;
  let hits = 0;
  for (const line of lines) {
    for (const re of AI_TRACE_RE) {
      if (re.test(line)) hits += 1;
    }
  }
  return Math.min(100, Math.round((hits / lines.length) * 100));
}

/**
 * Premium feel heuristic 0–100.
 * @param {string} body
 */
function premiumFeelScore(body) {
  const t = String(body || "");
  if (!t) return 0;
  let score = 70;
  const lines = t.split(/\n/).filter(Boolean);
  if (lines.length >= 3 && lines.length <= 16) score += 10;
  if (t.length > 900) score -= 25;
  if (t.length < 40) score -= 10;
  if (/Dragon Blueprint|napi ritmus|ritm zilnic/i.test(t)) score += 8;
  if (countEmoji(t) > 8) score -= 15;
  if (/\n{3,}/.test(t)) score -= 10;
  score -= aiTraceScore(t) * 0.4;
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = {
  AI_TRACE_RE,
  PROGRAM_WHISPERS,
  formatPremiumDailyMessage,
  stripAssistantTone,
  maybeProgramWhisper,
  applyProgramAtmosphereFinalize,
  aiTraceScore,
  premiumFeelScore
};
