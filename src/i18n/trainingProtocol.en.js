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
    "/profile /status /language /help /guide /commands /map",
    "",
    "ACTIVE (companion)",
    "/mode /off /pause /resume /whereami"
  ].join("\n"),

  tMapFooter: "Save this message. This is your training map.",

  helpV19Simple: [
    "KaiZen is used in two ways:",
    "",
    "1) Speak naturally — reflection and clarity.",
    "2) Use commands — structure and training.",
    "",
    "Active guidance (one step at a time):",
    "/mode — then /off /pause /resume /whereami",
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

  tStatusCompanionOff: "Companion mode: off",
  tStatusCompanionLive: "Companion mode: on (guidance live)",
  tStatusCompanionPaused: "Companion mode: on (guidance paused)",

  tEnergyLensFooter: [
    "",
    "Lens options:",
    "/energy trading · /energy body · /energy emotion · /energy work"
  ].join("\n"),

  tProfileMissionLine: "Mission (training):",
  tProfileTrainingStyle: "Training style:",

  brainLangSwitchConfirm: [
    "Locked to English.",
    "Not a corporate menu bot — still a training companion.",
    "",
    "What needs sorting today: mind, body, energy, or one task?"
  ].join("\n"),

  brainHumorPool: [
    "That is not strategy — that is mental tab overload.",
    "Your body filed a complaint minutes ago — you are still scheduling meetings with chaos.",
    "You do not rebuild a life in fourteen minutes. One step is enough.",
    "If this were a trade, this would be a no-trade zone — not an entry."
  ],

  brainThreePaths: [
    "Three doors — pick one:",
    "• Clear mind — breathe, cut noise, one true line (/morning · /focus)",
    "• Body reset — water, slow movement, nervous system first (/body · /breath)",
    "• Energy read — align with today before you force (/energy)"
  ].join("\n"),

  brainLostShort: "You sound lost without shame.\nThat is fine.",

  brainWhyHeard: "Heard.\nLet's give today a spine — not a speech.",

  brainWhyEnergyAnchor: "Energy first — alignment before hustle.",

  brainWhyConfused: "Confusion is allowed.\nPick a door anyway.",

  brainWhyChaos: "Overload mode.\nShrink input before we optimize anything.",

  brainWhyTrading: "Trading lane — discipline beats storyline.",

  brainWhyBody: "Body lane — boring fixes beat heroic denial.",

  brainWhyWork: "Execution lane — one block shipped beats ten debates.",

  brainWhyProcrastinate: "Avoidance spotted.\nShrink the step until it fits five minutes.",

  brainEnergyPrimaryLead:
    "Today's energy — root layer before trading or inbox theater.",

  brainCommandHelpLite: [
    "Two modes:",
    "Speak naturally — I route you.",
    "Or use one ritual command when you want structure.",
    "",
    "Full map only when you ask: /commands",
    "Active guided flow: /mode"
  ].join("\n"),

  tGateMorningLine:
    "Morning Gate.\nAnchor the day before you negotiate with chaos.",

  tGateCleanMindPrompt:
    "Clean Mind Gate.\nFirst question: what is noisy in your head — one phrase?",

  tGateEnergyLine:
    "Energy Gate.\nRead the day before you borrow conviction from adrenaline.",

  tGateBodyLine:
    "Body Gate.\nNervous system before heroic narratives.",

  tGateMissionLine:
    "Mission Gate.\nOne line that earns the rest of your attention.",

  tGateLettingGoLine:
    "Letting Go Gate.\nName one weight you refuse to drag past sunset.",

  tGateEveningLine:
    "Evening Gate.\nReview without trial — close the loop with honesty.",

  compSlotMorning: [
    "Morning mode.",
    "First: stabilize.",
    "Second: choose the lane.",
    "Third: one clean action."
  ].join("\n"),
  compSlotMidday: [
    "Midday mode.",
    "Focus check.",
    "One correction.",
    "One visible move."
  ].join("\n"),
  compSlotEvening: [
    "Evening mode.",
    "No more proving.",
    "Review, release, recover."
  ].join("\n"),
  compSlotLate: [
    "Late night mode.",
    "Reduce stimulation.",
    "No deep decisions.",
    "Rest protocol only."
  ].join("\n"),

  compModeOn: "⚔️ Active Companion Mode — on.",
  compModeOff:
    "Active Mode off.\n\nCommands stay available whenever you want structure.\nReturn to guidance: /mode",
  compPausedMsg: "Guidance paused.\n\nNext: /resume",
  compResumeMsg: "Guidance resumed.\n\nOne step at a time.",
  compNotActiveWhere: "Active Mode is off.\n\nTurn it on: /mode",
  compNotActivePause: "Active Mode is not on.\n\nStart it: /mode",
  compNotActiveResume: "Active Mode is not on.\n\nStart it: /mode",

  compFlowWeStart: "We start simple.",
  compFlowAskBody: "1. Body state — 1 to 10?",
  compFlowBadBody: "One number only. 1–10.",
  compFlowAfterBody: "Good enough.",
  compFlowAskMind: "2. Mind state — calm, scattered, heavy, or sharp? (one word)",
  compFlowBadMind: "Pick one: calm, scattered, heavy, sharp.",
  compFlowAfterMind: "Noted.\nOne lane only.",
  compFlowAskMission: "3. Today’s mission — one line?",
  compMissionTooShort: "Too thin.\nOne honest mission line.",
  compFlowMissionClose: "Mission received.\nNo wide plan until this ships.",
  compNextPrefix: "Next:",
  compAgreement: [
    "That reads as agreement without commitment.",
    "Pick one lane:",
    "• /pulse — continue",
    "• /trade — trading lane",
    "• /reset — stop the spiral"
  ].join("\n"),
  compNyOpen: [
    "Session time is not a trade thesis.",
    "Setup first: bias, liquidity, risk, entry trigger.",
    "If any one is unclear: no trade."
  ].join("\n"),
  compTradingImpulse: [
    "Impulse is expensive.",
    "Cool the story. Check risk before size.",
    "No hero trades."
  ].join("\n"),
  compStartParalysis: [
    "Start paralysis is real.",
    "Shrink the day to one visible move — ten minutes.",
    "Name the mission in one line when you are ready."
  ].join("\n"),
  compProcrastinate: [
    "Procrastination is resistance with a mask.",
    "Make the first step ugly and small — five minutes.",
    "Then report with /done."
  ].join("\n"),
  compCasualTalk: [
    "Chat is allowed.",
    "Training still asks for one honest lane.",
    "Pick what you are actually avoiding."
  ].join("\n"),
  compTiredPush: [
    "Tired body, hard demands.",
    "No deep decisions tonight unless unavoidable.",
    "Stabilize first: water, slow breath, one small block only."
  ].join("\n"),
  compScattered: [
    "Scattered mind, scattered outcomes.",
    "No wide plan.",
    "One lane. One next block."
  ].join("\n"),
  compOverload: [
    "Overload wins when you add more input.",
    "Cut channels. One breath. One task.",
    "Shrink until it fits."
  ].join("\n"),
  compMissionDrift: [
    "Mission drift.",
    "Re-lock today’s line — not the whole future.",
    "One sentence mission."
  ].join("\n"),
  compSeekingPermission: [
    "You are asking permission to exist at full size.",
    "Permission is not out there.",
    "Choose one constraint you will keep today — then act inside it."
  ].join("\n"),
  compSeekingClarity: [
    "Clarity comes from motion, not more thinking.",
    "One experiment. One observable result.",
    "Keep the question small."
  ].join("\n"),
  compOverthink: [
    "Overthinking is a second job with no pay.",
    "Cap the analysis. Move for ten minutes.",
    "Let reality vote."
  ].join("\n"),
  compEmotional: [
    "Emotion is data, not a command.",
    "Name it once. Then choose one stabilizing action.",
    "No spiral auditions."
  ].join("\n"),
  compBodyNeglect: [
    "The body is the base layer.",
    "Fuel, water, movement — boring wins.",
    "One physical reset before more mind."
  ].join("\n"),

  compDefaultMorning: [
    "Morning alignment.",
    "Mantra → energy → one mission → body anchor.",
    "Keep the first hour quiet if you can."
  ].join("\n"),
  compDefaultMidday: [
    "Midday correction.",
    "One focus check. One resistance name. One fix.",
    "No new lanes."
  ].join("\n"),
  compDefaultEvening: [
    "Evening mirror.",
    "Review without trial. Release one weight.",
    "Close the loop."
  ].join("\n"),
  compDefaultLate: [
    "Late window.",
    "Lower stimulation. No big commitments.",
    "Rest is part of training."
  ].join("\n"),

  compWhereTitle: "Where you are",
  compWherePausedYes: "Paused: yes",
  compWherePausedNo: "Paused: no",
  compWhereTimeBand: "Time band",
  compWhereBandMorning: "morning",
  compWhereBandMidday: "midday",
  compWhereBandEvening: "evening",
  compWhereBandLate: "late night",
  compWhereAwaiting: "Awaiting",
  compWhereWaitingInput: "Flow: idle (coach routing)",
  compWhereBody: "Body score",
  compWhereMind: "Mind tag",
  compWhereLastProtocol: "Last protocol",
  compWhereHint: "/pause · /resume · /off",

  /* ── Daily Rhythm ── */
  tMorningGateTitle: "⚔️ Morning Gate",
  tMorningEnergyHint: "Check today's energy layer before pushing into work — /energy",
  tMorningBodyInstruction: "Before reading your phone: 3 slow breaths. Stand up. Water.",
  tMorningCurrentMission: "Today's mission",
  tMorningSetMission: "No mission stored. Set one: /mission your one-liner",
  tMorningNextPrompt: "When ready: /energy → /mission → /midday",
  tStreakLine: (n) =>
    n <= 1 ? "First check-in. Good start." :
    n < 7  ? `${n} days in a row. Don't break the chain.` :
    `${n}-day streak. This is becoming identity.`,

  tMiddayGateTitle: "🔁 Midday Check",
  tMiddayDriftCheck: "Where did the morning actually go?",
  tMiddayMissionCheck: "Mission",
  tMiddayNoMission: "No mission set. One line before you continue: /mission",
  tMiddayAvoidancePrompt: "If you have been avoiding — name the block. Then do 5 minutes of it only.",
  tMiddayNextPrompt: "Continue: /focus or open chat if you need to think it out.",

  tEveningGateTitle: "🌙 Evening Mirror",
  tEveningMissionReview: "Mission today",
  tEveningNoMission: "No mission was set today.",
  tEveningReleasePrompt: "Release what you could not finish. It does not follow you.",
  tEveningLessonPrompt: "What do you want tomorrow's version of you to remember?",
  tEveningRecoveryHint: "Recovery is part of the protocol. Sleep is not laziness.",
  tEveningNextPrompt: "Close the day. Nothing else needs solving tonight.",

  tDailyTitle: "📋 Full Day Frame",
  tDailySlotMorning: "It is morning — start with body, then mantra, then energy read.",
  tDailySlotMidday: "Mid-session — check your mission line, cut the tab overload.",
  tDailySlotEvening: "Evening — review what landed, release what did not.",
  tDailyNextPrompt: "One clear next command: /morning · /midday · /evening",

  /* ── Dragon Path ── */
  tPathTitle: "🐉 Dragon Path",
  tPathLevel: "Level",
  tPathTier: "Tier",
  tPathStreak: "Streak",
  tPathMission: "Mission",
  tPathNoMission: "No mission set — /mission your one-liner",
  tPathNextHint: "Deepen: /level · /streak · /morning",

  tLevelTitle: "Dragon Level",
  tLevelCurrent: "Current",
  tLevelNext: "Next",
  tLevelMaxReached: "Highest level reached. Teach it now.",
  tLevelRequirement: (n) => {
    const reqs = [
      "",
      "Complete 7 morning check-ins to reach Level 2.",
      "Define a 30-day mission and hold 14-day streak for Level 3.",
      "One month of daily rhythm without skipping for Level 4.",
      "Document 3 emotional patterns you have broken for Level 5.",
      "Build and run one real protocol for 21 days for Level 6.",
      "Share the path with one other person for Level 7.",
      ""
    ];
    return reqs[n] || "";
  },

  tStreakTitle: "🔥 Streak",
  tStreakCount: (n) => `${n} days of consecutive check-ins.`,
  tStreakZero: "No streak yet. Start today with /morning.",
  tStreakLastCheckin: "Last morning gate",
  tStreakBuildHint: "Show up three mornings in a row. Then it starts to stick.",
  tStreakKeepHint: "Momentum is your asset. Guard it.",

  /* ── Training Zones ── */
  tZoneMindTitle: "🧠 Mind Zone",
  tZoneMindPurpose: "Clear mental noise. Not optimize — clear.",
  tZoneMindQuestion: "What thought is repeating the most right now?",
  tZoneMindAction: "Write it down, then cross it out if it is not today's problem.",
  tZoneMindNext: "Next: /focus or open chat if it needs unpacking.",

  tZoneBodyTitle: "🏋️ Body Zone",
  tZoneBodyPurpose: "The body carries everything the mind ignores.",
  tZoneBodyQuestion: "Where do you hold tension right now — shoulders, chest, jaw?",
  tZoneBodyAction: "Scan and release. Stretch for 90 seconds. Then water.",
  tZoneBodyNext: "Next: /breath or /morning if you have not opened the day yet.",

  tZoneBreathTitle: "🌬️ Breath Protocol",
  tZoneBreathInstruction: "Sit. Spine straight. Close the browser tabs — mentally too.",
  tZoneBreathRound:
    "Inhale 4 counts — hold 4 — exhale 6.\nRepeat 5 rounds.\nNo timer. No app. Just air.",
  tZoneBreathClose: "Notice what shifted. You do not need to explain it.",
  tZoneBreathNext: "Next: /focus if mind is still loud. /midday if it is check-in time.",

  tZoneBalanceTitle: "⚖️ Balance Zone",
  tZoneBalancePurpose: "You are not either productive or resting. Balance is a skill.",
  tZoneBalanceMorning: "Morning balance: set one thing you will not start today.",
  tZoneBalanceMidday: "Midday balance: remove one task from today's list that you added out of anxiety.",
  tZoneBalanceEvening: "Evening balance: what did you protect — yourself or the performance?",
  tZoneBalanceAction: "Name the area where you are overextended this week.",
  tZoneBalanceNext: "Next: /lettinggo or /evening.",

  tZoneLettingGoTitle: "🌊 Letting Go",
  tZoneLettingGoPurpose: "Holding on costs more than finishing.",
  tZoneLettingGoQuestion: "What are you still carrying that is not yours anymore?",
  tZoneLettingGoAction: "Write it. Read it once. Then decide: act on it or release it. Not both.",
  tZoneLettingGoNext: "Next: /evening to close the day, or /balance if the load is structural.",

  /* ── Seriousness Mirror ── */
  tSeriousnessNudge:
    "Feels like you are on the same point again.\nWhat slipped, in your read?",
  tSeriousnessCallout:
    "A lot of words, little movement.\nWhere did the energy start leaking?",
  tSeriousnessWall:
    "I will not feed the loop right now.\nWhen you are ready for one honest step — I am here."
};
