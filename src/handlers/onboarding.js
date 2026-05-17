/**
 * V1.4 onboarding: one question per message, 24h session only.
 * Commands always bypass this module (handled in telegram-webhook first).
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession, getSession } = require("../session/sessionStore");
const { profileDefaults } = require("../session/userProfile");
const { detectLanguage } = require("../i18n/languageDetect");
const {
  getFirstContactStart,
  processFirstContact,
  FC_STRUCTURE_START,
  FC_FOCUS,
  FC_NATURAL,
  FC_NAME
} = require("../companion/firstContactEngine");
const {
  resolveOnboardingLang,
  ensureOnboardingActive,
  onboardingContinuePrompt
} = require("../companion/onboardingGate");
const { enterActivationMode } = require("../companion/freshUserExperience");

const STRUCTURE = FC_STRUCTURE_START;

function resetProfileFields(userId) {
  updateSession(userId, profileDefaults());
}

function startOnboarding(userId) {
  const cur = getSession(userId);
  const prevLane = cur.programLane || "free";
  resetProfileFields(userId);
  updateSession(userId, {
    programLane: prevLane,
    onboardingActive: true,
    onboardingCompleted: false,
    onboardingSkipped: false,
    onboardingStep: FC_NATURAL,
    meetKaiZenCompleted: false,
    lastAssistantPrints: [],
    comfortOpenerUses: 0,
    smallStepAskUses: 0,
    recentCoachSnippets: [],
    recentCommands: [],
    conversationState: null
  });
  enterActivationMode(userId);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 */
function getStartReply(lang, session) {
  const step = Number(session.onboardingStep) || 0;
  if (step < FC_STRUCTURE_START) {
    return getFirstContactStart(lang);
  }
  const r = getResponses(lang);
  return r.obQ1;
}

function parsePathToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /\b(work|business|biz|office|munka)\b/.test(t))
    return { id: "business", note: null };
  if (n === 2 || /\btrad(e|ing)\b/.test(t)) return { id: "trading", note: null };
  if (n === 3 || /\b(physical|body|train|gym)\b/.test(t))
    return { id: "physical", note: null };
  if (n === 4 || /\b(emotional|balance|stabilit)\b/.test(t))
    return { id: "emotional", note: null };
  if (n === 5 || /\b(self|growth|develop|fejlőd|dezvoltare)\b/.test(t))
    return { id: "selfdev", note: null };
  if (n === 6 || /\b(energy|alignment|spirit|energie)\b/.test(t))
    return { id: "spiritual", note: null };
  if (n === 7 || /\bmixed\b/.test(t)) return { id: "mixed", note: null };
  if (t.length > 2 && t.length < 120 && !/^\d$/.test(t))
    return { id: "other", note: t };
  return null;
}

function parseObstacleToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  const map = {
    1: "overthinking",
    2: "impulse",
    3: "structure",
    4: "burnout",
    5: "emotional_chaos",
    6: "habits",
    7: "trading_emotions",
    8: "other"
  };
  if (map[n]) {
    const note =
      n === 8 ? t.replace(/^\d+\s*/, "").trim().slice(0, 200) || null : null;
    return { id: map[n], note };
  }
  if (/overthink|túlgond/.test(t)) return { id: "overthinking", note: null };
  if (/impuls/.test(t)) return { id: "impulse", note: null };
  if (/structur|lack of struct/.test(t)) return { id: "structure", note: null };
  if (/burnout|kiég|epuiz/.test(t)) return { id: "burnout", note: null };
  if (/chaos|emoțional/.test(t)) return { id: "emotional_chaos", note: null };
  if (/habit|szokás|obicei/.test(t)) return { id: "habits", note: null };
  if (/trading.*emo|emotion.*trad/.test(t)) return { id: "trading_emotions", note: null };
  if (/avoid|procrast|lazy|halog/.test(t)) return { id: "structure", note: null };
  if (t.length > 1 && t.length < 120) return { id: "other", note: t };
  return null;
}

function parseIntensityToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /^gentle|finom|blând/.test(t)) return "gentle";
  if (n === 2 || /balanced|kiegy|echilibrat/.test(t)) return "balanced";
  if (n === 3 || /^direct|közvetlen/.test(t)) return "direct";
  return null;
}

function parseLanguageToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /^en(glish)?\b/.test(t)) return "en";
  if (n === 2 || /\b(hu|magyar|hungarian)\b/.test(t)) return "hu";
  if (n === 3 || /\b(ro|romanian|român)\b/.test(t)) return "ro";
  if (n === 4 || /\bauto\b/.test(t)) return "auto";
  return null;
}

function pathLabel(session, r) {
  const id = session.userPrimaryPath;
  if (!id) return r.profileNotSet;
  if (id === "other" && session.userPrimaryPathNote)
    return session.userPrimaryPathNote;
  return r.obPathLabels[id] || id;
}

function obstacleLabel(session, r) {
  const id = session.userMainObstacle;
  if (!id) return r.profileNotSet;
  if (id === "other" && session.userMainObstacleNote)
    return session.userMainObstacleNote;
  return r.obObstacleLabels[id] || id;
}

function formatSummary(session, lang) {
  const r = getResponses(lang);
  const p = pathLabel(session, r);
  const o = obstacleLabel(session, r);
  const tone =
    r.obIntensityLabels[session.userIntensityPreference] ||
    session.userIntensityPreference ||
    r.profileNotSet;
  const langLine =
    session.preferredLanguage === "auto"
      ? r.obLangLabels.auto
      : r.obLangLabels[session.preferredLanguage] || r.profileNotSet;
  const goal =
    session.userGoal30Days && String(session.userGoal30Days).trim()
      ? String(session.userGoal30Days).trim()
      : r.profileNotSet;
  return lines(
    r.obProfileCreated,
    "",
    `${r.obSummaryPath}: ${p}`,
    `${r.obSummaryGoal}: ${goal}`,
    `${r.obSummaryObstacle}: ${o}`,
    `${r.obSummaryTone}: ${tone}`,
    `${r.obSummaryLang}: ${langLine}`,
    "",
    r.obSummaryFooter
  );
}

function skipOnboarding(userId, lang) {
  const r = getResponses(lang);
  updateSession(userId, {
    onboardingActive: false,
    onboardingSkipped: true,
    onboardingCompleted: false
  });
  return r.obSkip;
}

function buildProfileReply(session, lang) {
  const r = getResponses(lang);
  const hasAny =
    session.onboardingActive ||
    session.onboardingCompleted ||
    session.onboardingSkipped ||
    session.userPrimaryPath ||
    (session.userGoal30Days && String(session.userGoal30Days).trim()) ||
    session.userMainObstacle ||
    session.userIntensityPreference ||
    session.preferredLanguage ||
    session.currentMission;
  if (!hasAny) return r.profileEmpty;
  const setup =
    session.onboardingCompleted
      ? r.profileOnboardingDone
      : session.onboardingSkipped
        ? r.profileOnboardingSkipped
        : session.onboardingActive
          ? r.profileOnboardingPending
          : r.profileOnboardingSkipped;
  return lines(
    r.profileTitle,
    "",
    `${r.profilePath}: ${pathLabel(session, r)}`,
    `${r.profileGoal}: ${
      session.userGoal30Days?.trim() || r.profileNotSet
    }`,
    `${r.profileObstacle}: ${obstacleLabel(session, r)}`,
    `${r.profileTone}: ${
      r.obIntensityLabels[session.userIntensityPreference] ||
      session.userIntensityPreference ||
      r.profileNotSet
    }`,
    `${r.profileLangPref}: ${
      session.preferredLanguage === "auto"
        ? r.obLangLabels.auto
        : r.obLangLabels[session.preferredLanguage] || r.profileNotSet
    }`,
    `${r.profileOnboarding}: ${setup}`,
    ...(session.currentMission?.trim()
      ? ["", `${r.tProfileMissionLine} ${session.currentMission.trim()}`]
      : [])
  );
}

/**
 * @returns {{ reply: string }|null} null = not handled here
 */
function processOnboardingReply(userId, text, session, lang) {
  if (session.onboardingCompleted) return null;

  session = ensureOnboardingActive(userId);
  const locked = resolveOnboardingLang(session, null, text);

  if (session.onboardingSkipped) {
    const rSkip = getResponses(locked);
    return {
      reply: lines(
        rSkip.obGateSkippedResume || rSkip.helpTipOnboarding,
        "",
        rSkip.obGateContinueSetup || ""
      )
    };
  }

  const r = getResponses(locked);
  const raw = String(text || "").trim();
  if (/^(skip|later|később|mai târziu|not now)\b/i.test(raw)) {
    return { reply: skipOnboarding(userId, locked) };
  }

  const fc = processFirstContact(userId, raw, session, locked);
  if (fc) return fc;

  const step = Number(session.onboardingStep) || 0;

  if (step > FC_FOCUS && step < FC_STRUCTURE_START) {
    const r2 = getResponses(locked);
    updateSession(userId, { onboardingStep: FC_NATURAL });
    return { reply: r2.fcAskNaturalIntro };
  }
  if (step === 1 && session.preferredLanguage) {
    updateSession(userId, { onboardingStep: FC_NATURAL });
    return { reply: getResponses(locked).fcAskNaturalIntro };
  }

  const tangential =
    /\?/.test(raw) &&
    raw.length > 40 &&
    step < STRUCTURE + 2 &&
    !/^\d$/.test(raw) &&
    !/^([1-8])\s/.test(raw);

  if (tangential) {
    return {
      reply: lines(
        r.obNoted,
        "",
        r.obContinueSetup,
        "",
        step === STRUCTURE
          ? r.obQ1
          : step === STRUCTURE + 1
            ? r.obQ2
            : step === STRUCTURE + 2
              ? r.obQ3
              : step === STRUCTURE + 3
                ? r.obQ4
                : r.obQ5
      )
    };
  }

  if (step === STRUCTURE) {
    const p = parsePathToken(raw);
    if (!p) return { reply: lines(r.obInvalidPath, "", r.obQ1) };
    updateSession(userId, {
      userPrimaryPath: p.id,
      userPrimaryPathNote: p.note,
      onboardingStep: STRUCTURE + 1
    });
    return { reply: r.obQ2 };
  }

  if (step === STRUCTURE + 1) {
    if (raw.length < 3) return { reply: lines(r.obQ2) };
    updateSession(userId, {
      userGoal30Days: raw.slice(0, 500),
      onboardingStep: STRUCTURE + 2
    });
    return { reply: r.obQ3 };
  }

  if (step === STRUCTURE + 2) {
    const o = parseObstacleToken(raw);
    if (!o) return { reply: lines(r.obInvalidObstacle, "", r.obQ3) };
    updateSession(userId, {
      userMainObstacle: o.id,
      userMainObstacleNote: o.note,
      onboardingStep: STRUCTURE + 3
    });
    return { reply: r.obQ4 };
  }

  if (step === STRUCTURE + 3) {
    const i = parseIntensityToken(raw);
    if (!i) return { reply: lines(r.obInvalidIntensity, "", r.obQ4) };
    updateSession(userId, {
      userIntensityPreference: i,
      onboardingStep: STRUCTURE + 4
    });
    return { reply: r.obQ5 };
  }

  if (step === STRUCTURE + 4) {
    updateSession(userId, {
      onboardingCompleted: true,
      onboardingActive: false,
      onboardingSkipped: false,
      meetKaiZenCompleted: true
    });
    const s = getSession(userId);
    const lockedFin = s.preferredLanguage || s.lang || locked;
    return { reply: formatSummary(s, lockedFin) };
  }

  return { reply: onboardingContinuePrompt(locked) };
}

module.exports = {
  startOnboarding,
  resetProfileFields,
  getStartReply,
  processOnboardingReply,
  skipOnboarding,
  buildProfileReply,
  formatSummary,
  pathLabel,
  obstacleLabel
};
