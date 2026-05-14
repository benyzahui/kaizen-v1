/**
 * Dragon Training OS — protocol copy (EN). Grounded, firm, non-cringe.
 */

module.exports = {
  tMorningHeader: "Morning mantra:",
  tMorningFooter: "Then: /energy → one mission step → /evening",

  tProgramTitle: "Dragon Training — Daily Structure",
  tProgramBody: [
    "Dragon Training — Daily Structure",
    "",
    "1. Morning mantra — /morning",
    "2. Energy check — /energy",
    "3. One mission task — /mission",
    "4. Body discipline — /body or /breath",
    "5. Evening mirror — /evening",
    "",
    "Today is not about doing everything.",
    "Today is about staying with the process.",
    "",
    "Start: /morning"
  ].join("\n"),

  tTodayBody: [
    "Today (training frame):",
    "",
    "• Mantra: /morning",
    "• Energy read: /energy",
    "• Mission line: /mission",
    "• One body anchor: /breath or /walk",
    "• Close the loop: /evening",
    "",
    "One lane. One day. No negotiation with drift."
  ].join("\n"),

  tMissionEmpty: [
    "Mission (training):",
    "No mission line stored yet.",
    "",
    "Set one in plain language:",
    "/mission your one-line mission",
    "",
    "Or anchor the 30-day goal from /setup first."
  ].join("\n"),

  tMissionStored: (line) =>
    [
      "Mission locked in:",
      line,
      "",
      "Execution rule: one visible step toward this before you open new threads.",
      "Track completion: /done"
    ].join("\n"),

  tMissionUpdateHint: "Update with: /mission your new one-line mission",

  tDoneBody: [
    "Done (training):",
    "Name what you closed — even small.",
    "Credit without performance.",
    "",
    "If resistance won today: /procrastination",
    "If something must die before tomorrow: /lettinggo",
    "",
    "Next: /evening or /mirror"
  ].join("\n"),

  tEveningMirror: [
    "Evening mirror:",
    "",
    "1) What did you complete — one line?",
    "2) Where did resistance appear — one word?",
    "3) What did you learn — one sentence?",
    "4) What must be released before tomorrow — one breath, one name?",
    "",
    "No trial. No verdict. Just honest closure.",
    "Tomorrow: /morning"
  ].join("\n"),

  tProcrastinationProtocol: [
    "Procrastination protocol:",
    "",
    "Procrastination is not laziness.",
    "It is resistance, fear, or energy without direction.",
    "",
    "1. Name the avoided task.",
    "2. Make it smaller.",
    "3. Start for 5 minutes.",
    "4. Report back with /done."
  ].join("\n"),

  tLettingGoProtocol: [
    "Letting go protocol:",
    "",
    "1. Breathe — exhale longer than inhale, three rounds.",
    "2. Name what must be released — one phrase only.",
    "3. Feel where it sits in the body — five seconds, no story.",
    "4. No overthinking — one symbolic action (close a tab, delete a draft, put the phone in another room).",
    "5. Return to present — feet, breath, next one physical step.",
    "",
    "Then: /mission or /focus"
  ].join("\n"),

  tFocusLaneNudge: [
    "You are switching lanes.",
    "That is not clarity. That is escape.",
    "",
    "Return to the chosen mission.",
    "Use /focus or /clear."
  ].join("\n"),

  tResistanceProtocol: [
    "Resistance (training read):",
    "Resistance is information — not a character verdict.",
    "",
    "Name the avoided move in one line.",
    "Shrink it until it fits in five minutes.",
    "Start ugly. Finish visible.",
    "",
    "If the body is noisy: /breath",
    "If the story is loud: /mirror"
  ].join("\n"),

  tBusinessMenu: [
    "Business arena — which lane today?",
    "",
    "1. Administration",
    "2. Sales",
    "3. Analytics",
    "4. Trading (business discipline, not hype)",
    "",
    "Reply with: /business admin | /business sales | /business analytics | /business trading",
    "Or shorthand: /admin /sales /analytics — trading execution stays under /trade /check /risk"
  ].join("\n"),

  tBusinessAdmin: [
    "Administration lane:",
    "Organize. Clean inboxes. Document what future-you will not remember.",
    "One closed loop: file, label, archive.",
    "",
    "Next: /done when one admin loop ships."
  ].join("\n"),

  tBusinessSales: [
    "Sales lane:",
    "Outreach, offer clarity, follow-up without apology if value is real.",
    "One conversation or one message — shipped.",
    "",
    "Next: /done"
  ].join("\n"),

  tBusinessAnalytics: [
    "Analytics lane:",
    "Review data and behavior — patterns, not vibes.",
    "One chart, one hypothesis, one decision.",
    "",
    "Next: /focus on the single metric that matters today."
  ].join("\n"),

  tBusinessTrading: [
    "Trading (business discipline) lane:",
    "Risk first. No hero trades. Process beats story.",
    "",
    "Execution stack: /check → /risk → /trade (only if both pass)",
    "If tired: /notrade"
  ].join("\n"),

  tMoonPortal: [
    "Moon (training):",
    "We do not invent exact lunar precision without a live ephemeris.",
    "For an honest daily read that still grounds action: /energy",
    "",
    "Short anchor: slow the inputs; let the body lead before decisions."
  ].join("\n"),

  tNumerologyPortal: [
    "Numerology (training):",
    "Day vibration is context — not fate.",
    "Full structured read with season + body + trading discipline: /energy",
    "",
    "One action: finish one open loop before opening a new one."
  ].join("\n"),

  tAstroPortal: [
    "Astrology (training):",
    "Seasonal quality only — no chart theatre, no prophecy.",
    "Grounded daily frame: /energy",
    "",
    "One action: align workload with the season’s ask (structure vs vision vs closure)."
  ].join("\n"),

  tMantraSameAsMorning:
    "Mantra lives inside /morning — short, spoken, repeatable. Run /morning now.",

  tMorningMantras: {
    trading: [
      "Today I do not negotiate with impulse.\nI risk first.\nI take zero trades that need a story to justify them.",
      "Today the market does not owe me clarity.\nI wait for my setup — or I stand down.",
      "Today I protect capital like oxygen.\nPatience is execution."
    ],
    business: [
      "Today I do not negotiate with chaos.\nI choose one path.\nI complete one clean action.",
      "Today depth beats visibility.\nOne shipped piece beats ten drafts.",
      "Today I lead with structure — calendar is law for two hours."
    ],
    physical: [
      "Today the body leads.\nSleep, fuel, movement — in that order.\nNo heroics on empty.",
      "Today strength is boring repetition.\nI show up for one honest set.",
      "Today recovery is part of training.\nI stop before I lie to myself."
    ],
    emotional: [
      "Today I name feelings without obeying them.\nCalm is not numb — it is directed.",
      "Today I do not spiral for entertainment.\nOne truth, one boundary, one breath.",
      "Today compassion includes firmness — toward myself first."
    ],
    spiritual: [
      "Today energy meets direction.\nInsight without action is drift — I take one grounded step.",
      "Today I read cycles without fatalism.\nI simplify inputs and listen to the body.",
      "Today spirit means discipline in small things.\nSacred is consistent."
    ],
    selfdev: [
      "Today growth is one repetition.\nNo debate after the rule is set.",
      "Today I trade drama for reps.\nTen minutes, one skill, one proof.",
      "Today identity follows action — not the other way around."
    ],
    mixed: [
      "Today I do not negotiate with chaos.\nI choose one path.\nI complete one clean action.",
      "Today one lane at a time.\nDepth is the weapon.",
      "Today discipline is love with teeth — I keep my word to myself."
    ],
    default: [
      "Today I do not negotiate with chaos.\nI choose one path.\nI complete one clean action.",
      "Today I return to process — not mood.",
      "Today one clean step beats a perfect plan."
    ]
  },

  tHelpTrainingMap: [
    "KaiZen Training Map",
    "",
    "Daily:",
    "/program /morning /pulse /focus /mirror /evening /today",
    "",
    "Transformation:",
    "/discipline /resistance /procrastination /shadow /lettinggo /identity /lockin",
    "",
    "Body:",
    "/body /breath /walk /train /sleep /recovery",
    "",
    "Energy:",
    "/energy /moon /numerology /astro /ground /recenter",
    "",
    "Business:",
    "/business /admin /sales /analytics",
    "",
    "Trading:",
    "/trade /check /risk /cooldown /notrade",
    "",
    "Profile:",
    "/setup /profile /mission /clear /status /language"
  ].join("\n"),

  tProgramActivated: [
    "⚔️ Dragon Training — active.",
    "",
    "Your daily lane is live: mantra → energy → mission → body → mirror.",
    "",
    "Step 1: /morning",
    "",
    "Full map (save it): /map"
  ].join("\n"),

  tProgramStep2Energy: "Next step: /energy",
  tProgramStep3Mission: "Next step: /mission",
  tProgramStep4Body: "Next step: /body or /breath",
  tProgramStep5Evening: "Next step: /evening or /mirror",
  tProgramCycleClosed: "Cycle closed for today.\n\nReturn tonight with /mirror — or restart tomorrow: /program",

  tProgramWanderOpenChat: [
    "Open chat is allowed.",
    "But your current lane is still active in the program.",
    "",
    "Continue: next command from /program",
    "Refocus: /focus",
    "Reset session memory (profile stays): /clear"
  ].join("\n"),

  tCommandsCategorized: [
    "KaiZen — command map",
    "",
    "START",
    "/start /setup /program /mission /today /focus /done /clear",
    "",
    "DAILY",
    "/morning /mantra /pulse /evening /mirror /review",
    "",
    "TRANSFORMATION",
    "/discipline /resistance /procrastination /shadow /lettinggo /identity /lockin",
    "",
    "BODY",
    "/body /breath /walk /train /sleep /recovery",
    "",
    "ENERGY",
    "/energy /moon /numerology /astro /ground /recenter",
    "",
    "BUSINESS",
    "/business /admin /sales /analytics",
    "",
    "TRADING",
    "/trade /check /risk /cooldown /notrade",
    "",
    "PROFILE",
    "/profile /status /language /help /guide /commands /map"
  ].join("\n"),

  tMapFooter: "Save this message. This is your training map.",

  helpV19Simple: [
    "KaiZen is used in two ways:",
    "",
    "1) Speak naturally — reflection and clarity.",
    "2) Use commands — structure and training.",
    "",
    "Start the day frame:",
    "/program",
    "",
    "Daily rhythm:",
    "/morning /energy /mission /body /mirror",
    "",
    "Full map:",
    "/commands or /map"
  ].join("\n"),

  tStatusProgram: "Program",
  tStatusProgramStep: "Next step",
  tStatusProgramIdle: "idle (no active step)",
  tStatusNextProgram: "Suggested (program)",

  tEnergyLensFooter: [
    "",
    "Lens options:",
    "/energy trading · /energy body · /energy emotion · /energy work"
  ].join("\n"),

  tProfileMissionLine: "Mission (training):",
  tProfileTrainingStyle: "Training style:"
};
