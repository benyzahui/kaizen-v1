/** English copy — onboarding, guide, anti-loop (merged into responses bundle). */

module.exports = {
  fcWelcomeAtmosphere: [
    "You found the gate.",
    "",
    "This is KaiZen — Dragon Path training companion.",
    "Not a chatbot. Not motivation noise.",
    "",
    "A calm system for discipline, nervous system stability, and honest execution.",
    "",
    "No commands yet. No menu.",
    "Just presence.",
    "",
    "When you are here, send one line — any word — and we begin."
  ].join("\n"),

  fcWelcomePrompt: "One line is enough to open the gate.",

  fcAskName: "First — what should I call you?\n(First name is fine.)",

  fcNameAck: "Good, {name}.",

  fcAskPurpose: [
    "Why did you come to KaiZen today?",
    "",
    "Not the polished answer — the real one.",
    "One or two sentences."
  ].join("\n"),

  fcAskIdentity: [
    "Who are you becoming in the next 30 days?",
    "",
    "Say it in your own language — who you are, and what you want to strengthen."
  ].join("\n"),

  fcIdentityHint: "A short honest paragraph. No performance.",

  fcIdentityHeard: "Heard: {snippet}",

  fcStructureIntro: [
    "Good. You are in the system now.",
    "",
    "A few structure questions — one at a time.",
    "Then we train."
  ].join("\n"),

  rhythmHints: {
    morning: "Morning lane: body first, then one mission line.",
    midday: "Midday check: one honest block — cut the tab noise.",
    evening: "Evening: release what did not ship. Close clean.",
    late_night: "Late window: downshift. Nothing heroic tonight.",
    neutral: null
  },

  presenceNameAck: "{name} — stay with what you said.",

  presenceQuips: [
    "You are negotiating with yourself again.",
    "That answer sounded honest.",
    "Too many tabs open. Close the noise.",
    "Good. Less story. More contact."
  ],

  energyPersonalLead: "{name} — today's energy read (grounded, symbolic):",

  obMeetKaiZenIntro: [
    "⚔️ KaiZen V1 online.",
    "",
    "I am your training companion.",
    "Not entertainment. Not noise.",
    "",
    "I help you with:",
    "• discipline",
    "• energy alignment",
    "• emotional balance",
    "• body rhythm",
    "• trading discipline",
    "• business execution",
    "• long-term transformation",
    "",
    "First, introduce yourself in your own language.",
    "Who are you, and what do you want to strengthen?"
  ].join("\n"),

  obMeetHeardYou: "Understood — I read you here: {snippet}",
  obMeetContinue: "Now the structured pass — one question at a time.",
  obMeetTooShort: "A little more than that — one honest paragraph is enough.",

  obStartReturning: [
    "⚔️ KaiZen — Dragon Training Companion.",
    "",
    "Root: clear mind, body discipline, breath, energy awareness.",
    "Business and trading are side arenas — state comes first.",
    "",
    "Why did you come to KaiZen today?",
    "",
    "Daily structure: /program · Guided steps: /mode",
    "Full map only when you want it: /map"
  ].join("\n"),

  obIntro: [
    "KaiZen V1 online.",
    "",
    "I am not here to entertain you.",
    "I am here to help you stay aligned when life gets noisy.",
    "",
    "I can lean in with you on:",
    "",
    "1 — Work / business focus",
    "2 — Trading discipline",
    "3 — Physical discipline",
    "4 — Emotional balance",
    "5 — Self-development",
    "6 — Energy alignment (grounded — no fortune-telling)",
    "7 — Mixed / more than one lane",
    "",
    "First, let me understand you.",
    "What do you want KaiZen to support most right now?",
    "Reply with a number or one short sentence.",
    "",
    "Commands still work anytime. Send skip to pause setup."
  ].join("\n"),

  obQ1: [
    "1) Main path — pick one:",
    "",
    "1 — Work / business focus",
    "2 — Trading discipline",
    "3 — Physical discipline",
    "4 — Emotional balance",
    "5 — Self-development",
    "6 — Energy alignment",
    "7 — Mixed",
    "",
    "Number or short label."
  ].join("\n"),

  obQ2: "2) Your main goal for the next 30 days — one or two sentences:",

  obQ3: [
    "3) What usually pulls you off track?",
    "",
    "1 — Overthinking",
    "2 — Impulse",
    "3 — Lack of structure",
    "4 — Burnout",
    "5 — Emotional chaos",
    "6 — Bad habits",
    "7 — Trading emotions",
    "8 — Other (one line)",
    "",
    "Number or short label."
  ].join("\n"),

  obQ4: [
    "4) Preferred tone:",
    "",
    "1 — Gentle",
    "2 — Balanced",
    "3 — Direct",
    "",
    "Reply 1–3."
  ].join("\n"),

  obQ5: [
    "5) Preferred language:",
    "",
    "1 — English",
    "2 — Hungarian",
    "3 — Romanian",
    "4 — Auto (follow your messages)",
    "",
    "Reply 1–4."
  ].join("\n"),

  obInvalidPath: "Pick 1–7, or one short line for your lane.",
  obInvalidObstacle: "Pick 1–8, or one short label.",
  obInvalidIntensity: "Reply 1 (gentle), 2 (balanced), or 3 (direct).",
  obInvalidLanguage: "Reply 1–4 for language preference.",

  obSkip:
    "Understood — setup paused. Your profile stays light until you run /setup or /start again.",

  obNoted: "Noted.",

  obContinueSetup: "Back to setup:",

  obProfileCreated: "Profile created.",
  obSummaryPath: "Path",
  obSummaryGoal: "Goal",
  obSummaryObstacle: "Obstacle",
  obSummaryTone: "Tone",
  obSummaryLang: "Language",
  obSummaryFooter:
    "Start with /pulse for daily alignment or /help to see the full system.",

  obPathLabels: {
    trading: "trading discipline",
    business: "work / business focus",
    physical: "physical discipline",
    emotional: "emotional balance",
    spiritual: "energy alignment",
    selfdev: "self-development",
    mixed: "mixed priorities",
    other: "your stated lane"
  },

  obObstacleLabels: {
    overthinking: "overthinking",
    impulse: "impulse",
    structure: "lack of structure",
    burnout: "burnout",
    emotional_chaos: "emotional chaos",
    habits: "bad habits",
    trading_emotions: "trading emotions",
    other: "your stated pattern",
    avoidance: "avoidance / procrastination drift"
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

  guideBody: [
    "KaiZen system map:",
    "",
    "Daily rhythm:",
    "/pulse /focus /mirror",
    "",
    "When overloaded:",
    "/reset /ground /breathe",
    "",
    "Trading:",
    "/trade /check /risk /cooldown",
    "",
    "Body:",
    "/body /walk /train /sleep",
    "",
    "Direction:",
    "/plan /clarity /path /question",
    "",
    "Profile:",
    "/setup /profile /guide /status /language /clear /program /mission /today /commands /map",
    "",
    "You can also speak naturally.",
    "I will steer you back to structure when the chat drifts."
  ].join("\n"),

  helpIntentReply: [
    "You typed help without a slash — here is the fast map.",
    "Daily: /pulse · Scatter: /focus · Heavy load: /reset · Trading: /trade",
    "Full layout: /guide"
  ].join("\n"),

  energyIntentReply:
    "That reads like an energy check, not a feelings spiral.\nUse /energy for today’s structured read — I keep it practical, not mystical.",

  clarityIntentReply: [
    "Clarity pass:",
    "One decision that would simplify everything else — write one line.",
    "Then one physical next step in the next 25 minutes.",
    "Deeper ritual: /clarity"
  ].join("\n"),

  creatorEasterReply:
    "Then test me honestly. Push the system. I will show you where I am still weak.",

  antiLoopRewrite:
    "Same shape again — I will not repeat the same script.\nName one concrete fact that changed since your last message, or pick one command: /focus /reset /guide",

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

  adaptTiredMixed:
    "Mixed lane days need a single anchor: /pulse one line, then pick one lane for the next hour only.",

  bannedPhraseAltComfort:
    "Same comfort line twice would waste your time — say it plain, even rough. One fact I should not miss?",

  bannedPhraseAltSmallStep:
    "Skip the repeated prompt — name one move you can finish in ten minutes, no performance.",

  statusNextPathTrading: "Suggested next (your path): /check or /trade",
  statusNextPathBusiness: "Suggested next (your path): /focus or /plan",
  statusNextPathPhysical: "Suggested next (your path): /body or /walk",
  statusNextPathEmotional: "Suggested next (your path): /reset or /mirror",
  statusNextPathSpiritual: "Suggested next (your path): /energy or /path",
  statusNextPathSelfdev: "Suggested next (your path): /plan or /discipline",
  statusNextPathMixed: "Suggested next (mixed path): /pulse then /plan one line",
  statusNextPathOther: "Suggested next: /pulse or /help",

  statusNextGuide: "/guide for the map, or /pulse to anchor the day.",
  statusNextEnergyAsk: "/energy for the full structured read.",
  statusNextClarity: "/clarity for the ritual pass.",
  statusNextCreator: "/guide — stress the weak points if you are shaping me.",

  helpTipOnboarding:
    "Setup in progress — reply to the last question, send skip to pause, or use any command anytime."
};
