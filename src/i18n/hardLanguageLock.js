/**
 * Hard language lock — preferredLanguage is supreme; no mixed-language outbound.
 */

const { enforceHardLanguageLock, inferLineLanguage } = require("./languageHardLock");
const { getResponses } = require("./getResponses");
const {
  isTooSimilarToRecent,
  pickNonRepeatingVariant
} = require("../memory/recentReplyMemory");

/**
 * Language selection when preferredLanguage missing (post-onboarding).
 * @param {'en'|'hu'|'ro'} [hint]
 */
function languageSelectionPrompt(hint = "en") {
  const r = getResponses(hint === "hu" || hint === "ro" ? hint : "en");
  return (
    r.protocolOnboarding?.askLanguage ||
    [
      "KaiZen.",
      "Language / Nyelv / Limbă:",
      "1 — English",
      "2 — Magyar",
      "3 — Română"
    ].join("\n")
  );
}

/**
 * @param {object} session
 * @returns {{ ok: boolean, lang: 'en'|'hu'|'ro'|null, prompt?: string, provisional?: boolean }}
 */
function requireLockedLanguage(session) {
  const pref = session?.preferredLanguage;
  if (pref === "hu" || pref === "ro" || pref === "en") {
    return { ok: true, lang: pref };
  }
  if (!session?.onboardingCompleted || session?.onboardingActive) {
    const l = session?.lang;
    if (l === "hu" || l === "ro" || l === "en") {
      return { ok: true, lang: l, provisional: true };
    }
    return { ok: true, lang: "en", provisional: true };
  }
  return {
    ok: false,
    lang: null,
    prompt: languageSelectionPrompt(session?.lang || "en")
  };
}

/**
 * Strip lines that do not match locked language — no bilingual output.
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 */
function stripForeignLines(body, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const kept = parts.filter((line) => {
    const inferred = inferLineLanguage(line);
    return !inferred || inferred === locked;
  });

  return kept.length ? kept.join("\n") : "";
}

/**
 * Final outbound pass — lock language, anti-loop, no EN fallback when HU/RO locked.
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {object} [meta]
 */
function finalizeOutboundReply(body, lang, session, userId, meta = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  let out = stripForeignLines(body, locked);

  if (meta.alternatives?.length && isTooSimilarToRecent(out, session)) {
    out = pickNonRepeatingVariant(meta.alternatives, session) || out;
  }

  out = enforceHardLanguageLock(out, locked, session, userId);

  if (!out || !out.trim()) {
    const r = getResponses(locked);
    const pool =
      locked === "hu"
        ? r.safeReturnBeats || ["Itt vagyok.", "Egy sor elég."]
        : locked === "ro"
          ? r.safeReturnBeats || ["Sunt aici.", "O linie e suficient."]
          : r.safeReturnBeats || ["Here.", "One line is enough."];
    out = enforceHardLanguageLock(pool[0], locked, session, userId);
  }

  const { applyProgramAtmosphereFinalize } = require("../atmosphere/programAtmosphere");
  out = applyProgramAtmosphereFinalize(out, locked, session, userId, {
    dateKey: meta.dateKey,
    quietPresence: meta.quietPresence,
    programWhisper: meta.programWhisper,
    formatOpts: meta.formatOpts
  });

  const { recordOutboundReply } = require("../memory/recentReplyMemory");
  recordOutboundReply(userId, session, {
    body: out,
    mantraId: meta.mantraId || null,
    openingId: meta.openingId || null
  });

  return out.trim();
}

/**
 * Score 0–100 for language purity on a reply.
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 */
function languageLockScore(body, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const parts = String(body || "")
    .split(/\n/)
    .filter((l) => l.trim());
  if (!parts.length) return 0;
  let ok = 0;
  for (const line of parts) {
    const inf = inferLineLanguage(line);
    if (!inf || inf === locked) ok += 1;
  }
  return Math.round((ok / parts.length) * 100);
}

module.exports = {
  requireLockedLanguage,
  languageSelectionPrompt,
  finalizeOutboundReply,
  stripForeignLines,
  languageLockScore
};
