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
    "/setup /profile /guide /status /language /clear",
    "",
    "You can also speak naturally.",
    "I will guide you back to structure when needed."
  ].join("\n"),

  helpGrouped: [
    "KaiZen — grouped commands",
    "",
    "Daily rhythm:",
    "/pulse /focus /mirror",
    "",
    "When overloaded:",
    "/reset /ground /breathe /recovery",
    "",
    "Trading:",
    "/trade /check /risk /cooldown /notrade",
    "",
    "Body & movement:",
    "/body /walk /train /sleep",
    "",
    "Direction & mind:",
    "/plan /clarity /path /question /lockin /review",
    "",
    "Energy (grounded, practical):",
    "/energy · /energy trading · /energy body · /energy emotion · /energy work",
    "",
    "Profile & map:",
    "/setup /profile /guide /status /skip /language /clear",
    "",
    "You can speak naturally. I keep the frame."
  ].join("\n"),

  helpSuggestedLabel: "Suggested next (from your last turn):",
  helpSuggestedOverload: "/reset or /ground — then reduce input for one hour.",
  helpSuggestedTrading: "/trade or /risk — wait for clarity before size.",
  helpSuggestedFocus: "/focus — one line, one 25-minute block.",
  helpSuggestedEnergy: "/energy for the full structured read.",
  helpSuggestedDefault: "/pulse or /guide — anchor before widening the lens.",

  casualGreetingLines: [
    "Good morning.\nProtect your focus early today.",
    "Morning.\nOne small win before noon is enough.",
    "Hey.\nKeep the first hour quiet if you can."
  ],

  casualThanksLines: [
    "Noted.\nStay with your structure when you return.",
    "Received.\nNo performance needed — just consistency.",
    "Thanks for the signal.\nBack to your lane when ready."
  ],

  lightConversationLines: [
    "Discipline gets lighter when identity is clear — willpower alone burns out.",
    "Habits stick when the environment removes friction, not when motivation spikes.",
    "Focus is mostly subtraction: fewer inputs, same standard.",
    "Identity first, intensity second — otherwise you negotiate forever."
  ],

  pacingReflectiveShortlines: [
    "Too many open loops at once.",
    "Not a decision moment — reduce inputs for one hour.",
    "Water. Movement. Then reassess.",
    "Shrink the field: one tab, one outcome."
  ],

  tradingContextBodies: [
    "Waiting is part of the job — boredom is not a signal to force a trade.\nIf you enter: /check first.",
    "Pre-open is rehearsal, not proof.\nRisk defined? If not, stand down.\nWhen the bell matters: /trade",
    "Session transitions reward patience.\nJournal one line: what would invalidate your idea?",
    "Charts before narratives.\nIf the story is louder than the plan, pause.\n/risk before size."
  ],

  focusDriftVariants: [
    [
      "Too many open loops at once.",
      "Close one loop before you open another.",
      "Next 25 minutes: one tab, one finish line."
    ].join("\n\n"),
    [
      "Scatter is load management, not a character flaw.",
      "Pick one visible output for the next block.",
      "/focus one line if you want it locked."
    ].join("\n\n"),
    [
      "Noise rises when the body is under-fueled or over-stimulated.",
      "Water, five minutes of movement, then one task.",
      "Smallest finish line you can cross next?"
    ].join("\n\n"),
    [
      "Not a depth problem — a scope problem.",
      "Cut scope by half for the next hour.",
      "What is the one block that would make the day honest?"
    ].join("\n\n")
  ],

  emotionalReflectionVariants: [
    [
      "That sounds like a heavy load.",
      "One grounded sentence is enough — no perfect explanation needed.",
      "What is the next stabilizing action (tiny is fine)?"
    ].join("\n\n"),
    [
      "Acknowledged.",
      "Keep language simple: name the situation, not the verdict.",
      "If you want structure later: /reset is optional."
    ].join("\n\n"),
    [
      "Intensity without a container turns into noise.",
      "Small container: ten minutes, one room, no scroll.",
      "Then one honest line about what you need."
    ].join("\n\n")
  ],

  energyFramedIntros: [
    "Today favors simplification over expansion.",
    "Today's read: tighten before you stretch."
  ],

  energyFramedGoodBad: [
    "Good for:",
    "• organizing",
    "• planning",
    "• refining existing systems",
    "",
    "Bad for:",
    "• emotional decisions",
    "• impulsive trades",
    "• overstimulation"
  ].join("\n"),

  energyFramedAngles:
    "Want a sharper angle? Reply with one word: trading · emotional · practical",

  cmdClearReply: [
    "Session cleared.",
    "Your profile stays active.",
    "We start clean from here."
  ].join("\n"),

  cmdLanguageMenu: [
    "/language — set reply language",
    "1 — English",
    "2 — Hungarian",
    "3 — Romanian",
    "4 — Auto (detect from your messages)",
    "",
    "Example: /language 2"
  ].join("\n"),

  cmdLanguageInvalid: "Send /language then 1–4 (example: /language 2).",

  cmdLanguageConfirm: (code) => {
    const label =
      code === "en"
        ? "English"
        : code === "hu"
          ? "Hungarian"
          : code === "ro"
            ? "Romanian"
            : "Auto-detect";
    return `Saved: ${label}. Replies follow this setting.`;
  },

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

  helpTipLight:
    "Tip: light chat is fine — use /guide when you want the full map.",

  continuityLine: "Same thread — next beat only:",

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
    "Overload is a bandwidth signal — not a verdict.",
    "Downgrade input: water, dimmer screen, ten quiet minutes.",
    "Next: one physical move you can do without thinking."
  ].join("\n\n"),

  openHintEmotional: "\n\nOptional: /reset",

  reflectivePrompts: [
    "Name the tension in one line — no fixing yet.",
    "What decision would make the next step obvious?",
    "If you stopped negotiating for sixty seconds, what would you choose?"
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
      "That sounds like a heavy load.",
      "One grounded sentence is enough.",
      "What is the next stabilizing action (tiny is fine)?"
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
      "What would a steady read of this situation be?",
      "One small move that would not make things worse?"
    ].join("\n\n"),

    unknown: [
      "Short signal received.",
      "One fact, one intent — or pick a ritual: /pulse",
      "If you want the map: /guide"
    ].join("\n\n"),

    unknown_alt: [
      "Short signal — I will match volume.",
      "One fact, one intent. Rhythm: /pulse.",
      "Or stay: one messy true line is enough."
    ].join("\n\n")
  },

  ...onboardingStrings
};
