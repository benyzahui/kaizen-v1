const rituals = require("./rituals.en");

module.exports = {
  start:
    "KaiZen online. Small daily alignment creates massive long-term transformation.",

  help: [
    "KaiZen paths:",
    "",
    "Daily:",
    "/pulse /focus /reset /mirror",
    "",
    "Energy:",
    "/energy /ground /breathe /recenter /recovery /detach",
    "",
    "Trading:",
    "/trade /check /risk /notrade /cooldown",
    "",
    "Growth:",
    "/discipline /habit /identity /pattern /shadow",
    "",
    "Body:",
    "/body /walk /train /sleep",
    "",
    "Path:",
    "/clarity /question /vision /path",
    "",
    "Plan:",
    "/plan /today /next /done",
    "",
    "Snapshot:",
    "/status"
  ].join("\n"),

  unknown:
    "I did not catch that command. Use /help and continue calmly.",

  recoveryTimeoutReply:
    "KaiZen hit a time limit processing this message. You are not ignored — try a shorter line, /status, or /help.",

  recoveryGenericReply:
    "Something went wrong on our side. Try /help or a short message again in a moment.",

  pulse: [
    "Morning Pulse:",
    "- How steady do you feel right now? (1-10)",
    "- What matters most today?",
    "- One grounded action you will complete"
  ].join("\n"),

  trade: [
    "Trading Discipline Check:",
    "1) Is this setup in your plan?",
    "2) Is risk defined and acceptable?",
    "3) Is your state calm, clear, and patient?",
    "If not, stand down. Capital follows clarity."
  ].join("\n"),

  mirror: [
    "Evening Mirror:",
    "- What kept you grounded today?",
    "- Where did chaos or impulse take over?",
    "- One calm adjustment for tomorrow"
  ].join("\n"),

  energyHeader: "Energy of the day:",
  watchHeader: "Watch:",
  actionHeader: "Aligned action:",
  reminderHeader: "Reminder:",

  boundaryCooldown: [
    "Still in your reset window. Honor it.",
    "Come back when the edge has softened — even a little."
  ].join("\n\n"),

  recoveryPause:
    "Pause.\n\nThis is no longer clarity-seeking. This is nervous-system noise.",

  recoveryProtocolTitle: "Recovery Balance Protocol:",

  recoveryProtocolBody: [
    "1. Water.",
    "2. Step away from the screen.",
    "3. 5–10 minutes of slow breathing.",
    "4. Short walk or light movement.",
    "5. No trade, no major decision for 2 hours.",
    "6. Reduce screen stimulation.",
    "7. Return with /mirror when you are calm."
  ].join("\n"),

  recoveryLoopIntro: [
    "I hear the same loop getting loud. I will not keep feeding the spin in chat.",
    "Use the protocol below. Nothing here needs an instant verdict."
  ].join("\n\n"),

  tradingGuardrail: [
    "Slow down. This sounds like impulse, not a plan.",
    "",
    "Ask plainly:",
    "- Is the setup valid?",
    "- Is risk fixed?",
    "- Are you calm?",
    "- Would you take this trade if you were not emotional?",
    "",
    "If any answer is weak: no trade. Protect the account. Protect the mind."
  ].join("\n"),

  disclaimerHeavy:
    "Not therapy or financial advice — grounding and structure only.",

  planIntro:
    "Simple plan map (in-session only — not stored long-term yet):",

  planEmpty: "—",

  focusPrompt:
    "One priority for the next 60 minutes.\n\nReply with a single line, or send /focus your line here.",

  focusSaved: (line) =>
    `Locked for 60 minutes (intent, not a timer):\n${line}\n\nOne block. No tabs.`,

  planFieldWork: "Work",
  planFieldSelf: "Self-development",
  planFieldBody: "Body / Energy",
  planFieldTrading: "Trading",
  planFieldFocus: "Current 60-minute focus",

  chaosSoftReply: [
    "This sounds like overload, not weakness.",
    "",
    "Water. Five slow breaths. No major decisions for the next hour.",
    "",
    "What is one tiny action that would ground you right now?"
  ].join("\n"),

  openHintEmotional: "\n\nIf it is heavy: /reset or /ground",

  curiosity: [
    "Say it in one honest sentence. What is the weight right now?",
    "What would a steady friend tell you — without drama?",
    "What is the next small move that would not make things worse?"
  ],

  emotionalTripleGrounding: [
    "You sent the same emotional message several times.",
    "I hear you — repeating will not add safety right now.",
    "",
    "Grounding mode:",
    "Water. Slow breaths. Step away from the screen for ten minutes.",
    "No big decisions until the edge softens.",
    "",
    "When you are ready: /reset or /mirror. Or take a real break — that counts."
  ].join("\n\n"),

  statusTitle: "KaiZen status",
  statusLanguage: "Language",
  statusMode: "Mode",
  statusModeStructured: "Structured (commands)",
  statusModeOpen: "Open conversation (guided)",
  statusLastCommand: "Last command",
  statusLastCategory: "Last topic",
  statusSessionTurns: "Recent turns (in memory)",
  statusIntensity: "Intensity (estimate)",
  statusIntensityLow: "low / steady",
  statusIntensityMedium: "elevated",
  statusIntensityHigh: "high — use protocols",
  statusNext: "Suggested next",
  statusNextRecovery: "Run recovery steps, then /mirror when calm.",
  statusNextTrade: "Review /trade and stand down if state is shaky.",
  statusNextEmotional: "/reset or /ground, then one small physical action.",
  statusNextPlan: "/plan — one concrete next line only.",
  statusNextLastCommand: "Continue your last ritual, or /help for structure.",
  statusNextDefault: "/pulse or /focus — pick one small block.",
  statusCommandsHint:
    "Open chat guides you; commands keep structure. Use both.",

  sessionLoopBoundary: [
    "You are looping now.",
    "More input will not create clarity.",
    "",
    "Recovery protocol:",
    "Water.",
    "Step away.",
    "Walk 10 minutes.",
    "No decision for 2 hours.",
    "",
    "Return with /mirror later."
  ].join("\n\n"),

  rituals,

  categories: {
    emotional_reflection: [
      "You do not need more pressure right now.",
      "You need one clean point of focus.",
      "",
      "Choose one task that would make the next hour useful.",
      "",
      "What is the feeling under the story — one word?"
    ].join("\n"),

    work_focus: [
      "Work asks for clarity, not heroics.",
      "",
      "Name the next 25-minute block. Start it. One tab, one outcome.",
      "",
      "What is the smallest finishable piece?"
    ].join("\n"),

    self_development: [
      "Growth is quiet repetition, not a performance.",
      "",
      "Pick one habit-sized action you can do today without debating it.",
      "",
      "What would your calmer self do for ten minutes?"
    ].join("\n"),

    plan_tracking: [
      "Plans work when they are small enough to touch.",
      "",
      "Use /plan to see your map. Write one line for the area that matters most right now.",
      "",
      "What is the next concrete step — not the whole roadmap?"
    ].join("\n"),

    general_curiosity: [
      "I am here for discipline, balance, and honest reflection.",
      "",
      "If something is heavy, say it plainly in one sentence.",
      "",
      "What would make the next hour slightly more grounded?"
    ].join("\n"),

    unknown: [
      "I am listening.",
      "",
      "Say the truest line you can about what is happening.",
      "",
      "What is one small next step that would not make things worse?"
    ].join("\n")
  }
};
