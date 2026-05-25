/**
 * Discipline companion onboarding — language → name → path (6 modes).
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession, getSession } = require("../session/sessionStore");
const { mapPathToMode } = require("../core/protocolStateEngine");

const OB_LANG = 0;
const OB_NAME = 1;
const OB_PATH = 2;
const OB_DONE = 99;

const PATH_MAP = {
  1: { id: "stabilization", legacy: "emotional", labelKey: "stabilization" },
  2: { id: "discipline", legacy: "selfdev", labelKey: "discipline" },
  3: { id: "energy", legacy: "spiritual", labelKey: "energy" },
  4: { id: "warrior", legacy: "physical", labelKey: "warrior" },
  5: { id: "recovery", legacy: "emotional", labelKey: "recovery" },
  6: { id: "trading", legacy: "trading", labelKey: "trading" }
};

function parseLanguageChoice(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /^en(glish)?\b/.test(t)) return "en";
  if (n === 2 || /\b(hu|magyar|hungarian)\b/.test(t)) return "hu";
  if (n === 3 || /\b(ro|român|romana|romanian)\b/.test(t)) return "ro";
  return null;
}

function parsePathChoice(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (PATH_MAP[n]) return PATH_MAP[n];
  if (/\b(stabil|stabiliz)/.test(t)) return PATH_MAP[1];
  if (/\b(disciplin|fegyelem)/.test(t)) return PATH_MAP[2];
  if (/\b(energy|energia|energie)/.test(t)) return PATH_MAP[3];
  if (/\b(warrior|harcos|fighter)/.test(t)) return PATH_MAP[4];
  if (/\b(recover|recovery|felépül|recuper)/.test(t)) return PATH_MAP[5];
  if (/\b(trad|trade|keresked)/.test(t)) return PATH_MAP[6];
  return null;
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function getDisciplineStartReply(lang) {
  const r = getResponses(lang);
  return r.protocolOnboarding?.start || r.fcActivation || "KaiZen.\nDigital discipline companion.";
}

/**
 * @param {string|number} userId
 */
function startDisciplineOnboarding(userId) {
  updateSession(userId, {
    onboardingActive: true,
    onboardingCompleted: false,
    onboardingSkipped: false,
    onboardingStep: OB_LANG,
    meetKaiZenCompleted: false
  });
}

/**
 * @param {string|number} userId
 * @param {string} text
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @returns {{ reply: string }|null}
 */
function processDisciplineOnboarding(userId, text, session, lang) {
  const step = Number(session.onboardingStep) ?? OB_LANG;
  const raw = String(text || "").trim();
  const r = getResponses(lang);

  if (step >= OB_DONE || session.onboardingCompleted) return null;

  if (step === OB_LANG) {
    const picked = parseLanguageChoice(raw);
    if (!picked) {
      return { reply: r.protocolOnboarding?.askLanguage || r.fcAskLanguage };
    }
    updateSession(userId, {
      preferredLanguage: picked,
      lang: picked,
      onboardingStep: OB_NAME
    });
    const r2 = getResponses(picked);
    return { reply: r2.protocolOnboarding?.askName || r2.fcAskName };
  }

  if (step === OB_NAME) {
    if (raw.length < 2) {
      return { reply: r.protocolOnboarding?.askName || r.fcAskName };
    }
    const name = raw.slice(0, 64).replace(/\s+/g, " ").trim();
    updateSession(userId, { userName: name, onboardingStep: OB_PATH });
    const rName = getResponses(session.preferredLanguage || lang);
    const ack = (rName.protocolOnboarding?.nameAck || rName.fcNameAck || "").replace(
      "{name}",
      name
    );
    return {
      reply: lines(ack, "", rName.protocolOnboarding?.askPath || rName.fcAskFocus)
    };
  }

  if (step === OB_PATH) {
    const path = parsePathChoice(raw);
    if (!path) {
      return { reply: r.protocolOnboarding?.pathInvalid || r.fcFocusInvalid };
    }
    const locked = session.preferredLanguage || lang;
    const rPath = getResponses(locked);
    const label =
      rPath.protocolOnboarding?.pathLabels?.[path.labelKey] || path.id;
    const mode = mapPathToMode(path.legacy);

    updateSession(userId, {
      userPrimaryPath: path.legacy,
      activeMode: mode,
      userPurpose: label,
      sessionTodayFocus: label,
      meetKaiZenCompleted: true,
      onboardingCompleted: true,
      onboardingActive: false,
      onboardingSkipped: false,
      onboardingStep: OB_DONE,
      protocolState: {
        energyState: "stable",
        disciplineState: "focused",
        nervousSystemState: "calm",
        activeMode: mode
      },
      activationMode: false
    });

    const complete = (rPath.protocolOnboarding?.complete || rPath.fcCompleteCalm || "")
      .replace("{name}", session.userName || getSession(userId).userName || "")
      .replace("{path}", label)
      .replace("{mode}", mode);

    return { reply: complete };
  }

  return null;
}

module.exports = {
  OB_LANG,
  OB_NAME,
  OB_PATH,
  OB_DONE,
  PATH_MAP,
  startDisciplineOnboarding,
  getDisciplineStartReply,
  processDisciplineOnboarding,
  parseLanguageChoice,
  parsePathChoice
};
