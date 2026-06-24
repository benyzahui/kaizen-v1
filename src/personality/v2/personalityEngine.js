/**
 * KaiZen V2 personality engine — Return to the Path.
 */

const { getResponses } = require("../../i18n/getResponses");
const { lines } = require("../kaizenVoice");
const {
  CORE_PRINCIPLE,
  SHAME_RE,
  JUDGE_RE,
  ARGUE_RE,
  LECTURE_RE,
  THERAPY_RE,
  AI_ASSISTANT_RE,
  VOICE
} = require("./dragonIdentity");
const { sanitizeEmoji } = require("./emojiSystem");
const { energyToneHint } = require("./energyTone");
const { maybeDailyPresenceOpener } = require("./dailyPresenceV2");
const { maybeStageGif } = require("./gifIntegration");
const { updateSession } = require("../../session/sessionStore");

const RETURN_LINES = {
  en: ["🐉 Return to the Path.", "One step back on the path."],
  hu: ["🐉 Vissza az útra.", "Egy lépés vissza az útra."],
  ro: ["🐉 Înapoi pe drum.", "Un pas înapoi pe drum."]
};

/**
 * @param {string} line
 */
function isBlockedPersonalityLine(line) {
  const t = String(line || "").trim();
  if (!t) return true;
  return (
    SHAME_RE.test(t) ||
    JUDGE_RE.test(t) ||
    ARGUE_RE.test(t) ||
    LECTURE_RE.test(t) ||
    THERAPY_RE.test(t) ||
    AI_ASSISTANT_RE.test(t)
  );
}

/**
 * @param {string} body
 */
function stripBlockedLines(body) {
  const kept = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l && !isBlockedPersonalityLine(l));
  return kept.join("\n").trim();
}

/**
 * @param {string} body
 */
function capVerbosity(body) {
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (parts.length <= VOICE.maxParagraphLines) return parts.join("\n");
  return parts.slice(0, VOICE.maxParagraphLines).join("\n");
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string|number} userId
 * @param {string} dateKey
 */
function maybeReturnWhisper(lang, userId, dateKey) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pool = RETURN_LINES[locked] || RETURN_LINES.en;
  const seed = `${userId}|rtw|${dateKey}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h % 17 !== 0) return null;
  return pool[h % pool.length];
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {object} [meta]
 */
function applyPersonalityV2Finalize(body, lang, session, userId, meta = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  let out = stripBlockedLines(body);
  if (!meta.automation && !String(meta.openingId || "").startsWith("auto_")) {
    out = capVerbosity(out);
  }
  out = sanitizeEmoji(out);

  const dateKey = meta.dateKey || new Date().toISOString().slice(0, 10);
  const phase =
    meta.phase ||
    (meta.openingId === "cmd_/morning"
      ? "morning"
      : meta.openingId === "cmd_/midday"
        ? "midday"
        : meta.openingId === "cmd_/evening"
          ? "evening"
          : session?.protocolState?.phase);

  if (meta.dailyPresenceV2 && phase) {
    const opener = maybeDailyPresenceOpener(locked, phase, userId, dateKey, session);
    if (opener && !out.includes(opener.slice(0, 12))) {
      out = lines(opener, out);
    }
  }

  const whisper = maybeReturnWhisper(locked, userId, dateKey);
  if (whisper && out.length < 280 && !out.includes("Path") && !out.includes("útra") && !out.includes("drum")) {
    out = lines(out, whisper);
  }

  if (!out || !out.trim()) {
    const r = getResponses(locked);
    out =
      r.safeReturnBeats?.[0] ||
      (locked === "hu"
        ? "Itt vagyok. Vissza az útra."
        : locked === "ro"
          ? "Sunt aici. Înapoi pe drum."
          : "Here. Return to the Path.");
  }

  maybeStageGif(
    userId,
    session,
    { ...meta, phase: phase || meta.phase, dateKey },
    phase ? 0.16 : 0.08
  );

  if (session && !session.personalityV2) {
    updateSession(userId, { personalityV2: true });
  }

  return out.trim();
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function companionEnergyPrefix(session, lang) {
  const hint = energyToneHint(session, lang);
  return hint ? `⚡ ${hint}` : "";
}

/**
 * Language lock validation — preferredLanguage is supreme when languageLocked.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} attemptedLang
 */
function validateLanguageLock(session, attemptedLang) {
  if (!session?.languageLocked) {
    return { ok: true, locked: false, lang: attemptedLang };
  }
  const pref = session.preferredLanguage;
  if (pref === "en" || pref === "hu" || pref === "ro") {
    return {
      ok: attemptedLang === pref,
      locked: true,
      lang: pref,
      reason: attemptedLang !== pref ? "language_locked_settings_only" : null
    };
  }
  return { ok: true, locked: true, lang: attemptedLang };
}

module.exports = {
  CORE_PRINCIPLE,
  isBlockedPersonalityLine,
  stripBlockedLines,
  applyPersonalityV2Finalize,
  companionEnergyPrefix,
  validateLanguageLock
};
