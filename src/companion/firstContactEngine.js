/**
 * First contact — Elite Zone / Dragon Path onboarding (short path).
 * Language → name → focus → /today. No command dump.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");

const FC_INTRO = 0;
const FC_LANG = 1;
const FC_NAME = 2;
const FC_FOCUS = 3;
/** Legacy structure steps never used for new users. */
const FC_STRUCTURE_START = 99;

const FOCUS_PATH = {
  mind: "emotional",
  body: "physical",
  energy: "spiritual",
  trading: "trading",
  business: "business",
  mixed: "mixed"
};

function parseLanguageToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /^en(glish)?\b/.test(t)) return "en";
  if (n === 2 || /\b(hu|magyar|hungarian)\b/.test(t)) return "hu";
  if (n === 3 || /\b(ro|romanian|român|romana)\b/.test(t)) return "ro";
  return null;
}

/**
 * @param {string} raw
 * @returns {{ id: keyof FOCUS_PATH, path: string }|null}
 */
function parseFocusToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /\b(mind|stress|mental|fej|gondolat|stressz|minte|stres)\b/.test(t)) {
    return { id: "mind", path: FOCUS_PATH.mind };
  }
  if (n === 2 || /\b(body|discipline|test|fizikai|fegyelem|corp|disciplin)\b/.test(t)) {
    return { id: "body", path: FOCUS_PATH.body };
  }
  if (n === 3 || /\b(energy|awareness|energia|energie|tudat)\b/.test(t)) {
    return { id: "energy", path: FOCUS_PATH.energy };
  }
  if (n === 4 || /\b(trad(e|ing)|tőzsde|piac|burs)\b/.test(t)) {
    return { id: "trading", path: FOCUS_PATH.trading };
  }
  if (n === 5 || /\b(business|execution|work|munka|üzlet|uzlet|execu)\b/.test(t)) {
    return { id: "business", path: FOCUS_PATH.business };
  }
  if (n === 6 || /\b(mixed|vegyes|kevert|amestec)\b/.test(t)) {
    return { id: "mixed", path: FOCUS_PATH.mixed };
  }
  return null;
}

function lockedLang(session, fallback) {
  const p = session?.preferredLanguage;
  if (p === "hu" || p === "ro" || p === "en") return p;
  return session?.lang || fallback;
}

function completeFirstContact(userId, name, focusId, path, lang) {
  const r = getResponses(lang);
  const label = r.fcFocusLabels?.[focusId] || focusId;
  updateSession(userId, {
    userPrimaryPath: path,
    userPurpose: label,
    sessionTodayFocus: label,
    meetKaiZenCompleted: true,
    onboardingCompleted: true,
    onboardingActive: false,
    onboardingSkipped: false,
    onboardingStep: FC_STRUCTURE_START
  });
  const n = name || "";
  return lines(
    (r.fcComplete || "").replace("{name}", n).replace("{focus}", label),
    "",
    r.fcCompleteNext
  );
}

function getFirstContactStart(lang) {
  return getResponses(lang).fcIntro;
}

function processFirstContact(userId, text, session, lang) {
  const step = Number(session.onboardingStep) || 0;
  if (step >= FC_STRUCTURE_START) return null;
  if (!session.onboardingActive || session.onboardingCompleted) return null;

  const r = getResponses(lockedLang(session, lang));
  const raw = String(text || "").trim();

  if (/^(skip|later|később|kesobb|mai târziu|not now)\b/i.test(raw)) {
    updateSession(userId, { onboardingSkipped: true, onboardingActive: false });
    return { reply: r.obSkip };
  }

  if (step === FC_INTRO) {
    if (raw.length < 1) {
      return { reply: lines(r.fcIntro, "", r.fcWelcomePrompt) };
    }
    updateSession(userId, { onboardingStep: FC_LANG });
    return { reply: r.fcLangPick };
  }

  if (step === FC_LANG) {
    const picked = parseLanguageToken(raw);
    if (!picked) {
      return { reply: lines(r.fcLangInvalid, "", r.fcLangPick) };
    }
    updateSession(userId, {
      preferredLanguage: picked,
      lang: picked,
      onboardingStep: FC_NAME
    });
    return { reply: getResponses(picked).fcAskName };
  }

  if (step === FC_NAME) {
    const langLocked = lockedLang(session, lang);
    const rName = getResponses(langLocked);
    if (raw.length < 2) return { reply: rName.fcAskName };
    const name = raw.slice(0, 80).replace(/\s+/g, " ").trim();
    updateSession(userId, { userName: name, onboardingStep: FC_FOCUS });
    return {
      reply: lines(
        (rName.fcNameAck || "").replace("{name}", name),
        "",
        rName.fcAskFocus
      )
    };
  }

  if (step === FC_FOCUS) {
    const langLocked = lockedLang(session, lang);
    const rFocus = getResponses(langLocked);
    const focus = parseFocusToken(raw);
    if (!focus) {
      return { reply: lines(rFocus.fcFocusInvalid, "", rFocus.fcAskFocus) };
    }
    return {
      reply: completeFirstContact(
        userId,
        session.userName,
        focus.id,
        focus.path,
        langLocked
      )
    };
  }

  return null;
}

module.exports = {
  FC_INTRO,
  FC_LANG,
  FC_NAME,
  FC_FOCUS,
  FC_STRUCTURE_START,
  FOCUS_PATH,
  getFirstContactStart,
  processFirstContact,
  parseFocusToken,
  parseLanguageToken
};
