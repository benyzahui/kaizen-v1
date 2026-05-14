const rituals = require("./rituals.en");
const onboardingStrings = require("./onboardingCopy.en");

module.exports = {
  start:
    "KaiZen online. Small daily alignment creates massive long-term transformation.",

  help: [
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
    "/setup /profile /guide /status",
    "",
    "You can also speak naturally.",
    "I will guide you back to structure when needed."
  ].join("\n"),

  unknown:
    "I did not catch that command. Use /help and continue calmly.",

  recoveryTimeoutReply:
    "That message took too long to shape. Send one short line, or /status when you have a moment.",

  recoveryGenericReply:
    "I lost the thread on that one. Send one line — or /help — and we continue.",

  recoverySendFailed:
    "Reply could not reach Telegram. Check connection and send again in a few seconds.",

  helpTipDefault:
    "Tip: open chat for reflection; use commands when you want structure (/focus, /plan).",

  helpTipOverload:
    "Tip: overload → /reset or /body first, then words.",

  helpTipEmotional:
    "Tip: heavy feelings → /reset or /mirror — optional, not a demand.",

  helpTipTrade:
    "Tip: impulse edge → /trade, then pause before acting.",

  helpTipFocus:
    "Tip: scattered mind → /focus one line, one block.",

  helpTipPlan:
    "Tip: fog on priorities → /plan one field only.",

  helpTipBody:
    "Tip: body off → /body or /walk before big decisions.",

  continuityLine: "Same thread — going a little deeper:",

  variationNudge: "Add one new fact you have not said yet (even tiny).",

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
    "Pause. This is noise speed, not decision speed.",

  recoveryProtocolTitle: "Steady sequence:",

  recoveryProtocolBody: [
    "Water.",
    "Step back from the screen — even one room away.",
    "Five slow breaths or ten minutes outside if you can.",
    "No trades, no big life calls for two hours.",
    "When the edge drops: /mirror in one honest paragraph."
  ].join("\n"),

  recoveryLoopIntro: [
    "Same spiral, louder volume. I will not argue you into calm here.",
    "Run the sequence below — no performance, just sequence."
  ].join("\n\n"),

  tradingGuardrail: [
    "This reads like impulse wearing a plan costume.",
    "Valid setup? Fixed risk? Calm body?",
    "If any is shaky: stand down. Capital likes patience."
  ].join("\n\n"),

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
    "Overload, not failure — your system is asking for less input, not more judgment.",
    "One small downgrade: water, dimmer screen, or ten quiet minutes.",
    "What is the next gentle physical action you can take in the next two minutes?"
  ].join("\n\n"),

  openHintEmotional: "\n\nOptional structure if you want it: /reset",

  reflectivePrompts: [
    "Name the tension in one line — no fixing yet.\nWhat would clarity cost you honestly?",
    "What decision are you circling because it would make the next step obvious?",
    "If you trusted yourself for sixty seconds, what would you stop negotiating?"
  ],

  emotionalTripleGrounding: [
    "Same line, three times — I believe the feeling is real.",
    "Typing more here will not lower the volume.",
    "Water, screen away, ten minutes of quiet or slow walk.",
    "When you return: /reset or /mirror — or rest without a label. That still counts."
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
  statusNextDrift: "/focus — one line, one 25-minute block.",
  statusNextBody: "/body quick check, then the smallest physical move.",
  statusNextReflect: "/clarity or stay here with one true sentence.",
  statusNextLastCommand: "Continue your last ritual, or /help for structure.",
  statusNextDefault: "/pulse or /focus — pick one small block.",
  statusCommandsHint:
    "Open chat guides you; commands keep structure. Use both.",

  statusLastSuggested: "Last nudge",

  sessionLoopBoundary: [
    "Loop detected — more words will not buy safety here.",
    "Water, distance from the screen, ten minutes outside if you can.",
    "No big calls for two hours.",
    "/mirror later with one honest paragraph — not a verdict."
  ].join("\n\n"),

  rituals,

  categories: {
    focus_drift: [
      "Scatter is normal when the load is high.",
      "Shrink the field: one tab, one task, twenty-five minutes.",
      "What is the smallest finish line you can cross next?"
    ].join("\n\n"),

    body_energy: [
      "State check: fuel, hydration, sleep debt, and movement often move mood before mindset does.",
      "Pick one — water, food, five minutes of movement, or a screen step-back.",
      "Which of those is most honest for you right now?"
    ].join("\n\n"),

    emotional_reflection: [
      "That sounds heavy, and it matters.",
      "No need to explain perfectly — one true sentence is enough.",
      "What is the feeling under the words (one word)?"
    ].join("\n\n"),

    work_focus: [
      "Work pressure loves vague heroics.",
      "Name one block (≤25 minutes) with one visible output.",
      "What is the smallest piece you could ship first?"
    ].join("\n\n"),

    self_development: [
      "Growth is repetition without the debate loop.",
      "Choose one habit-sized move you can do today without negotiating.",
      "What would your calmer self do for ten minutes only?"
    ].join("\n\n"),

    plan_tracking: [
      "Big roadmaps create paralysis.",
      "Open /plan and write one line for the lane that matters today.",
      "What is the next concrete step — not the whole map?"
    ].join("\n\n"),

    general_curiosity: [
      "Say the weight in one honest line.",
      "What would a steady friend name without drama?",
      "What is one small move that would not make things worse?"
    ].join("\n\n"),

    unknown: [
      "I am with you — say it plainly, even messy.",
      "One stabilizing move you can do in two minutes?",
      "What would help most: clarity, rest, or a single task lock?"
    ].join("\n\n"),

    unknown_alt: [
      "Short signal — I will match volume.",
      "One fact, one intent. Rhythm: /pulse.",
      "Or stay: one messy true line is enough."
    ].join("\n\n")
  },

  ...onboardingStrings
};
