/**
 * First contact — activation, natural intro, auto language, focus, /today.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");
const {
  detectLanguage,
  hasStrongNonEnglishSignal,
  scoreHungarian,
  scoreRomanian
} = require("../i18n/languageDetect");

const FC_WAKE = 0;
const FC_NATURAL = 1;
const FC_NAME = 2;
const FC_FOCUS = 3;
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

function detectAndLockLanguage(userId, text, session) {
  const detected = detectLanguage(text);
  const hu = scoreHungarian(text);
  const ro = scoreRomanian(text);
  let lang = detected;
  if (parseLanguageToken(text)) {
    lang = parseLanguageToken(text);
  } else if (hasStrongNonEnglishSignal(text)) {
    lang = hu >= ro ? (hu >= 2 ? "hu" : detected) : ro >= 2 ? "ro" : detected;
  }
  updateSession(userId, { preferredLanguage: lang, lang });
  return lang;
}

function extractNameFromIntro(text) {
  const m = String(text || "").match(
    /(?:vagyok|vagy|I'm|I am|sunt|numele\s+meu|nekem)\s+([A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüűĂÂÎȘȚăâîșț]{2,24})/i
  );
  if (m) return m[1];
  const first = String(text || "").trim().split(/\s+/)[0];
  if (first && first.length >= 2 && first.length <= 16 && !/^\d+$/.test(first)) {
    if (!/^(én|en|eu|hi|hello|szia|bună)$/i.test(first)) return first;
  }
  return null;
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
  return getResponses(lang).fcActivation;
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

  if (step === FC_WAKE) {
    if (raw.length < 1) {
      return { reply: lines(r.fcActivation, "", r.fcWelcomePrompt) };
    }
    updateSession(userId, { onboardingStep: FC_NATURAL });
    return { reply: getResponses(lockedLang(session, lang)).fcAskNaturalIntro };
  }

  if (step === FC_NATURAL) {
    if (raw.length < 8) {
      return { reply: r.fcNaturalTooShort || r.fcAskNaturalIntro };
    }
    const langLocked = detectAndLockLanguage(userId, raw, session);
    const r2 = getResponses(langLocked);
    const name = extractNameFromIntro(raw);
    const purposeNote = raw.slice(0, 400);
    updateSession(userId, {
      userPurpose: purposeNote,
      ...(name ? { userName: name } : {})
    });
    if (name) {
      updateSession(userId, { onboardingStep: FC_FOCUS });
      return {
        reply: lines(
          (r2.fcNameAck || "").replace("{name}", name),
          "",
          r2.fcHeardIntro || "",
          "",
          r2.fcAskFocus
        )
      };
    }
    updateSession(userId, { onboardingStep: FC_NAME });
    return {
      reply: lines(r2.fcHeardIntro || "", "", r2.fcAskName)
    };
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
  FC_WAKE,
  FC_NATURAL,
  FC_NAME,
  FC_FOCUS,
  FC_STRUCTURE_START,
  FOCUS_PATH,
  getFirstContactStart,
  processFirstContact,
  parseFocusToken,
  parseLanguageToken,
  detectAndLockLanguage
};
