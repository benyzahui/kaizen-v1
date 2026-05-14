/** English copy for V1.3 onboarding (merged into responses bundle). */

module.exports = {
  obIntro:
    "KaiZen — structure without noise. A few quick answers so I match your lane.\nOne step at a time. Anytime: use commands as usual, or send skip to finish later.",

  obQ1: [
    "1) What should I lean into with you?",
    "",
    "1 — Trading discipline",
    "2 — Business / work focus",
    "3 — Physical discipline",
    "4 — Emotional balance",
    "5 — Self-development",
    "6 — Energy / spiritual alignment (grounded, not predictions)",
    "7 — Other (say it in one line)",
    "",
    "Reply with a number or the label."
  ].join("\n"),

  obQ2: "2) Your main aim for the next 30 days — one or two sentences:",

  obQ3: [
    "3) What usually pulls you off track?",
    "",
    "1 — Overthinking",
    "2 — Impulse",
    "3 — Laziness / avoidance",
    "4 — Emotional chaos",
    "5 — Lack of structure",
    "6 — Burnout",
    "7 — Bad habits",
    "8 — Trading emotions",
    "9 — Other (one line)",
    "",
    "Number or short label."
  ].join("\n"),

  obQ4: [
    "4) How direct should I be?",
    "",
    "1 — Gentle",
    "2 — Balanced",
    "3 — Direct",
    "",
    "Reply 1–3."
  ].join("\n"),

  obQ5: [
    "5) Preferred language for coaching copy:",
    "",
    "1 — English",
    "2 — Hungarian",
    "3 — Romanian",
    "4 — Auto (follow your messages)",
    "",
    "Reply 1–4."
  ].join("\n"),

  obInvalidPath: "Pick 1–7, or name the lane in one short line.",
  obInvalidObstacle: "Pick 1–9, or one short label.",
  obInvalidIntensity: "Reply 1 (gentle), 2 (balanced), or 3 (direct).",
  obInvalidLanguage: "Reply 1–4 for language preference.",

  obSkip:
    "Understood — setup paused. Your profile stays light until you run /setup or /start again.",

  obNoted:
    "Noted.",

  obContinueSetup: "Back to setup:",

  obSummaryHead: "Good. Here is how I will show up:",
  obSummaryPath: "Focus",
  obSummaryGoal: "30-day aim",
  obSummaryObstacle: "Main drift",
  obSummaryTone: "Tone",
  obSummaryLang: "Language",
  obSummaryFooter: "Start with /pulse when you want a daily check-in.",

  obPathLabels: {
    trading: "trading discipline & emotional control around risk",
    business: "work focus, execution, and decision clarity",
    physical: "body, routine, training, recovery",
    emotional: "grounding, reflection, nervous-system steadiness",
    spiritual: "energy, cycles, identity — grounded, no fortune-telling",
    selfdev: "self-development and disciplined growth",
    other: "your stated lane"
  },

  obObstacleLabels: {
    overthinking: "overthinking",
    impulse: "impulse",
    avoidance: "avoidance",
    emotional_chaos: "emotional chaos",
    structure: "lack of structure",
    burnout: "burnout",
    habits: "bad habits",
    trading_emotions: "trading emotions",
    other: "your stated pattern"
  },

  obIntensityLabels: {
    gentle: "gentle",
    balanced: "balanced",
    direct: "direct"
  },

  obLangLabels: {
    en: "English",
    hu: "Hungarian",
    ro: "Romanian",
    auto: "auto-detect from your messages"
  },

  profileTitle: "KaiZen profile",
  profileEmpty:
    "No completed setup yet. Send /start to personalize, or /setup to restart.",
  profilePath: "Path",
  profileGoal: "30-day aim",
  profileObstacle: "Drift pattern",
  profileTone: "Tone",
  profileLangPref: "Language preference",
  profileOnboarding: "Setup",
  profileOnboardingDone: "complete",
  profileOnboardingPending: "in progress",
  profileOnboardingSkipped: "skipped / minimal",
  profileNotSet: "—",

  adaptTiredTrading:
    "Low energy is not a license to force trades. Protect the account first. If you still trade today: /check before anything else.",

  adaptTiredPhysical:
    "Low energy means lower friction first: water, food, ten minutes of movement. /body is a fast scan.",

  adaptTiredBusiness:
    "Then shrink the day to one useful block — momentum beats volume. /focus one line.",

  adaptTiredEmotional:
    "Honor the dip without narrating a crisis. Small stabilization, then words. /reset is optional structure.",

  adaptTiredSpiritual:
    "Cycles include quiet phases — stay grounded, skip predictions. /energy when you want a light read.",

  adaptTiredDefault:
    "Small physical downgrade first (water, food, short walk), then one honest sentence about what matters today.",

  statusNextPathTrading: "Suggested next (your path): /check or /trade",
  statusNextPathBusiness: "Suggested next (your path): /focus or /plan",
  statusNextPathPhysical: "Suggested next (your path): /body or /walk",
  statusNextPathEmotional: "Suggested next (your path): /reset or /mirror",
  statusNextPathSpiritual: "Suggested next (your path): /energy or /path",
  statusNextPathSelfdev: "Suggested next (your path): /plan or /discipline",
  statusNextPathOther: "Suggested next: /pulse or /help",

  helpTipOnboarding:
    "Setup in progress — reply to the last question, send skip to pause, or use any command anytime."
};
