/**
 * Phase 2 FIRST_CONTACT — cinematic activation, language lock early, no command dump.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");
const { detectLanguage } = require("../i18n/languageDetect");

const FC_ACTIVATION = 0;
const FC_WHO = 1;
const FC_LANG = 2;
const FC_NAME = 3;
const FC_PURPOSE = 4;
const FC_GROUND = 5;
const FC_STRUCTURE_START = 6;

function parseLanguageToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /^en(glish)?\b/.test(t)) return "en";
  if (n === 2 || /\b(hu|magyar|hungarian)\b/.test(t)) return "hu";
  if (n === 3 || /\b(ro|romanian|român)\b/.test(t)) return "ro";
  return null;
}

function getFirstContactStart(lang) {
  return getResponses(lang).fcActivation;
}

function processFirstContact(userId, text, session, lang) {
  const step = Number(session.onboardingStep) || 0;
  if (step >= FC_STRUCTURE_START) return null;
  if (!session.onboardingActive || session.onboardingCompleted) return null;

  const r = getResponses(lang);
  const raw = String(text || "").trim();

  if (/^(skip|later|később|mai târziu|not now)\b/i.test(raw)) {
    updateSession(userId, { onboardingSkipped: true, onboardingActive: false });
    return { reply: r.obSkip };
  }

  if (step === FC_ACTIVATION) {
    if (raw.length < 1) return { reply: lines(r.fcActivation, "", r.fcWelcomePrompt) };
    updateSession(userId, { onboardingStep: FC_WHO });
    return { reply: r.fcWho };
  }

  if (step === FC_WHO) {
    updateSession(userId, { onboardingStep: FC_LANG });
    return { reply: r.fcLangPick };
  }

  if (step === FC_LANG) {
    const picked = parseLanguageToken(raw);
    if (!picked) return { reply: lines(r.fcLangInvalid || r.obInvalidLanguage, "", r.fcLangPick) };
    updateSession(userId, {
      preferredLanguage: picked,
      lang: picked,
      onboardingStep: FC_NAME
    });
    const r2 = getResponses(picked);
    return { reply: r2.fcAskName };
  }

  if (step === FC_NAME) {
    if (raw.length < 2) return { reply: r.fcAskName };
    const name = raw.slice(0, 80).replace(/\s+/g, " ").trim();
    updateSession(userId, { userName: name, onboardingStep: FC_PURPOSE });
    const r2 = getResponses(session.lang || lang);
    return {
      reply: lines((r2.fcNameAck || "").replace("{name}", name), "", r2.fcAskPurpose)
    };
  }

  if (step === FC_PURPOSE) {
    if (raw.length < 4) return { reply: r.fcAskPurpose };
    updateSession(userId, {
      userPurpose: raw.slice(0, 400),
      onboardingStep: FC_GROUND
    });
    return { reply: getResponses(session.lang || lang).fcFirstGround };
  }

  if (step === FC_GROUND) {
    updateSession(userId, {
      meetKaiZenCompleted: true,
      onboardingStep: FC_STRUCTURE_START
    });
    const r2 = getResponses(session.lang || lang);
    return { reply: lines(r2.fcGroundClose, "", r2.obQ1) };
  }

  return null;
}

module.exports = {
  FC_ACTIVATION,
  FC_WHO,
  FC_LANG,
  FC_NAME,
  FC_PURPOSE,
  FC_GROUND,
  FC_STRUCTURE_START,
  getFirstContactStart,
  processFirstContact
};
