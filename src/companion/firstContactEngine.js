/**
 * FIRST_CONTACT_ENGINE — relationship beginning, not command dump.
 *
 * Flow: welcome → atmosphere → name → purpose → identity → structure questions
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession, getSession } = require("../session/sessionStore");
const { detectLanguage } = require("../i18n/languageDetect");

/** First-contact steps 0–3; structure setup continues from step 4 in onboarding.js */
const FC_WELCOME = 0;
const FC_NAME = 1;
const FC_PURPOSE = 2;
const FC_IDENTITY = 3;
const FC_STRUCTURE_START = 4;

function isFirstContactStep(step) {
  return step >= FC_WELCOME && step < FC_STRUCTURE_START;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function getFirstContactStart(lang) {
  const r = getResponses(lang);
  return r.fcWelcomeAtmosphere || r.obMeetKaiZenIntro;
}

/**
 * @param {string|number} userId
 * @param {string} text
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @returns {{ reply: string }|null}
 */
function processFirstContact(userId, text, session, lang) {
  const step = Number(session.onboardingStep) || 0;
  if (step >= FC_STRUCTURE_START) return null;
  if (!session.onboardingActive || session.onboardingCompleted) return null;

  const r = getResponses(lang);
  const raw = String(text || "").trim();

  if (/^(skip|later|később|mai târziu|not now)\b/i.test(raw)) {
    updateSession(userId, {
      onboardingSkipped: true,
      onboardingActive: false
    });
    return { reply: r.obSkip };
  }

  if (step === FC_WELCOME) {
    if (raw.length < 2) {
      return { reply: lines(r.fcWelcomeAtmosphere, "", r.fcWelcomePrompt) };
    }
    updateSession(userId, { onboardingStep: FC_NAME });
    return { reply: r.fcAskName };
  }

  if (step === FC_NAME) {
    if (raw.length < 2) return { reply: r.fcAskName };
    const name = raw.slice(0, 80).replace(/\s+/g, " ").trim();
    updateSession(userId, { userName: name, onboardingStep: FC_PURPOSE });
    const r2 = getResponses(lang);
    return {
      reply: lines(
        (r2.fcNameAck || "Good.").replace("{name}", name),
        "",
        r2.fcAskPurpose
      )
    };
  }

  if (step === FC_PURPOSE) {
    if (raw.length < 4) return { reply: r.fcAskPurpose };
    updateSession(userId, {
      userPurpose: raw.slice(0, 400),
      onboardingStep: FC_IDENTITY
    });
    return { reply: r.fcAskIdentity };
  }

  if (step === FC_IDENTITY) {
    if (raw.length < 3) {
      return { reply: lines(r.fcAskIdentity, "", r.fcIdentityHint) };
    }
    const detected = detectLanguage(raw);
    updateSession(userId, {
      meetKaiZenCompleted: true,
      preferredLanguage: detected,
      lang: detected,
      onboardingStep: FC_STRUCTURE_START
    });
    const r2 = getResponses(detected);
    const snippet = raw.slice(0, 200).replace(/\s+/g, " ").trim();
    const heard = (r2.fcIdentityHeard || r2.obMeetHeardYou).replace(
      "{snippet}",
      snippet
    );
    return {
      reply: lines(
        heard,
        "",
        r2.fcStructureIntro || r2.obMeetContinue,
        "",
        r2.obQ1
      )
    };
  }

  return null;
}

module.exports = {
  FC_WELCOME,
  FC_NAME,
  FC_PURPOSE,
  FC_IDENTITY,
  FC_STRUCTURE_START,
  isFirstContactStep,
  getFirstContactStart,
  processFirstContact
};
