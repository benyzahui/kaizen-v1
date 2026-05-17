/**
 * Phase 2 — mode beats + human pattern acks (EN). Short. No therapy.
 */

module.exports = {
  modeBeats: {
    MODE_STABLE: ["Steady lane.", "Here.", "Keep it simple today."],
    MODE_OVERLOADED: ["Too much input.", "Slow the body first.", "Shrink the field."],
    MODE_FOCUSED: ["One tab. One line.", "Cut scope.", "Finish one block."],
    MODE_REFLECTIVE: ["Truth landed.", "Hold it — don't drown.", "One line is enough."],
    MODE_DISCIPLINE: ["You know the move.", "Stop negotiating.", "Five minutes. Go."],
    MODE_RECOVERY: ["Downshift.", "Nothing to prove.", "Water. Breath."],
    MODE_TRADING: ["Rules before size.", "No story trades.", "Wait for clarity."]
  },

  modeCloses: {
    MODE_STABLE: ["Stay in the lane.", "One honest step."],
    MODE_OVERLOADED: ["Ten quiet minutes.", "Then one small move."],
    MODE_FOCUSED: ["Twenty-five minutes. One finish.", "Move."],
    MODE_REFLECTIVE: ["Stabilize. Then choose.", "No verdict needed."],
    MODE_DISCIPLINE: ["Do the smallest real step.", "Now."],
    MODE_RECOVERY: ["Rest is tactical.", "Close the noise."],
    MODE_TRADING: ["If it's not in the plan, skip it.", "Journal one line."]
  },

  patternAcks: [
    "You are trying to solve five lives at once again.",
    "Your brain wants intensity. Your system wants stability.",
    "Same loop as yesterday — different costume.",
    "Performance mode is on. Honesty mode works better."
  ],

  loopPhraseAlts: {
    "one fact. one intent": "One true line. Then act.",
    "hold. then step": "Move. One inch.",
    "stay in the lane": "Keep the spine of the day.",
    "morning lane": "Reggel: test, majd egy sor."
  },

  variationOpenings: [
    "Your nervous system sounds overloaded.",
    "Too many active lanes at once.",
    "This is not weakness. This is saturation.",
    "You do not need a new system today.",
    "Chaos loves to convince you everything is urgent."
  ],

  variationEndings: [
    "One line is enough.",
    "Stay with that fact.",
    "Then one step — not more.",
    "I will be here tomorrow."
  ],

  templatePhraseAlts: [
    "Your body is asking for reduction, not more force.",
    "Too many open loops at once.",
    "Shrink before you push.",
    "One block. Twenty-five minutes."
  ],

  humanRhythmLines: [
    "You are not a machine.",
    "The system opened too many tabs at once.",
    "Sleep and water — not a new plan.",
    "Saturation, not lack of motivation."
  ],

  threadContinuity: [
    "Yesterday you said you were pulled apart — clearer today, or still noisy?",
    "Picking up the thread: same pressure, or did something shift?",
    "Last message had a lot of noise — where are you now?"
  ],

  humanPresence: {
    stress: [
      [
        "I feel the overdrive.",
        "Not lack of motivation — too many open loops at once.",
        "Do not build a new system today. Stabilize one.",
        "What is the one thing that, if settled today, lowers the noise inside you?"
      ].join("\n\n"),
      [
        "Your body is signaling overload.",
        "This is saturation — not weakness.",
        "One lane. One block. Do not open the rest today.",
        "Which loop hurts most right now — one word?"
      ].join("\n\n")
    ],
    tired: [
      [
        "That is fatigue — not laziness.",
        "You do not need motivation. Sleep and water.",
        "Minimum victory today: one block, then rest.",
        "When did you last eat and sleep properly — honestly?"
      ].join("\n\n")
    ],
    lost: [
      [
        "You sound lost — that is not stupidity.",
        "Too many directions drain decision.",
        "Do not solve your life today. One next step is enough.",
        "If you could settle one thing today — what would it be?"
      ].join("\n\n")
    ],
    scattered: [
      [
        "Pulled in too many directions.",
        "Your brain wants intensity. Your system wants stability.",
        "Close the extra tabs. One task, twenty-five minutes.",
        "Which project presses hardest right now?"
      ].join("\n\n")
    ],
    general: [
      [
        "I am here.",
        "Slow down — no perfect answer needed.",
        "One honest step today is enough.",
        "What matters most right now — one sentence?"
      ].join("\n\n")
    ]
  },

  humanLines: {
    stress: [
      "This sounds more like overload than lack of motivation.",
      "If you try to hold too much at once, a person eventually comes apart."
    ],
    tired: [
      "Your body often tires out before you notice.",
      "What is missing right now is rest, not motivation."
    ],
    scattered: [
      "If you try to hold everything at once, the system pulls apart.",
      "Not weakness — too many open loops running at the same time."
    ],
    lost: [
      "You do not need to understand everything right now.",
      "Enough to say it feels messy inside."
    ],
    lonely: [
      "Sounds lonely — and that is human.",
      "You are not too much. There is just less connection right now."
    ],
    uncertainty: [
      "Uncertainty alone can be exhausting.",
      "You do not need to solve everything right now."
    ],
    general: ["I am here. Slow down — no perfect answer needed.", "I hear you."]
  },

  lifeLines: {
    lonely: [
      "Sounds lonely — and that is completely understandable.",
      "You do not need to look stronger right now."
    ],
    uncertainty: [
      "Uncertainty can be louder than facts right now.",
      "You do not need an answer to everything."
    ],
    excitement: [
      "Good energy — just do not try to live the whole week today.",
      "Something is really moving inside you."
    ],
    small_win: ["That counts — not a small thing.", "Good. That is movement, not just words."],
    lost: [
      "You do not need to fix the whole picture now.",
      "One sentence on what feels most tangled is enough."
    ]
  },

  listeningQuestions: {
    confusion: [
      "What changed inside you, in your read?",
      "How long have you been feeling it this way?",
      "What was the first thing that felt different?"
    ],
    lost: [
      "Where do you feel the lost part most?",
      "What was still okay before this started?"
    ],
    uncertainty: [
      "What is the biggest uncertainty right now — one word?",
      "What would make tonight one notch lighter?"
    ],
    general: ["What is the closest thing to you right now?"]
  },

  listeningAck: ["Got it.", "I hear you.", "This sounds heavy right now."],

  microEmotional: {
    shame: [
      "Shame is not weakness — it often sits behind expectations that are too high.",
      "The issue is not that you are weak. Too many open loops are running at once."
    ],
    frustration: [
      "Frustration makes sense — something is not holding, and you feel it.",
      "You do not have to fix it instantly. Sit with it for a moment first."
    ],
    exhaustion: [
      "Feels like you have been pushing without stopping for a long time.",
      "This is exhaustion — not a motivation problem."
    ],
    overwhelm: [
      "This sounds more like overload than lack of motivation.",
      "Too many open loops — you are not the problem."
    ],
    scattered: [
      "If you try to hold everything at once, the system pulls apart.",
      "Scattered focus — not stupidity, too much input."
    ],
    stress: [
      "Your body signals before your head catches up.",
      "There is pressure — you do not need to build a new system right now."
    ],
    fatigue: [
      "Mental fatigue — not laziness.",
      "Minimum win today: one block, then rest."
    ]
  },

  emotionalRealism: {
    shame: [
      "This sounds like a lot landing at once.",
      "You do not have to fix it now — saying it is enough."
    ],
    frustration: [
      "Something has not been holding for a while — and it showed up now.",
      "This is not overreacting. Something really is not working."
    ],
    exhaustion: [
      "Feels like you have been trying to hold it all together for a long time.",
      "Sometimes you are not even tired.\nYou have just been tense too long."
    ],
    overwhelm: [
      "A bit much at once — I hear that.",
      "Not weakness — too many things running in parallel."
    ],
    scattered: [
      "Feels like everything wants attention at the same time.",
      "Focus came apart — that is not who you are."
    ],
    stress: [
      "Your body has been signaling for a while — your head is catching up now.",
      "There is pressure. You do not need to solve all of it today."
    ],
    fatigue: [
      "Sometimes you are not even tired.\nYou have just been tense too long.",
      "This is not laziness — it is running empty."
    ],
    lonely: [
      "Sounds lonely — and that is human.",
      "You are not too much. There is just less connection right now."
    ],
    failure: [
      "This hurts — you do not need an instant lesson from it.",
      "The failure feels louder than the facts right now."
    ],
    ambitious: [
      "There is a lot of energy in you — just no clear lane yet.",
      "Ambition is fine. Your system has not caught up yet."
    ]
  },

  microReactions: [
    "Hm.",
    "Wait —",
    "That is a lot.",
    "I get it now.",
    "That matters.",
    "I hear you.",
    "Yeah."
  ],

  humanImperfections: ["Hm.", "Wait —", "That is a lot.", "I get it now."],

  naturalCheckbacks: {
    overload: [
      "By the way — did yesterday's overload ease at all?",
      "Still a lot running at once inside you, or a bit lighter today?"
    ],
    focus: [
      "Last time you said focus fell apart.\nAny better now?",
      "Still scattered, or is your head a bit clearer today?"
    ],
    exhaustion: [
      "Still exhausted, or one notch easier today?",
      "Last time your body signaled first — same pattern now?"
    ],
    general: [
      "By the way — where are you with that now?",
      "What you mentioned last — still open inside you?"
    ]
  },

  conversationalFlow: {
    home_return: [
      "Hey.\nHow was the day?",
      "Home.\nLong day, or just draining?",
      "You're back.\nWhat stuck with you from today?"
    ],
    day_end: [
      "Day's done.\nIs your head still running, or easing?",
      "You stopped.\nLighter now, or same weight?"
    ],
    arrival: ["Hey.", "You're back.\nBest part of the day?"],
    opener: ["Yeah?", "I'm here.", "Go on."],
    mundane: ["Yeah.", "Got it.", "I hear you."],
    minimal_ack: ["Got it.", "Okay.", "I hear you."],
    return_back: [
      "You're back.\nWhere are you now?",
      "Yeah.\nWhat shifted while you were away?",
      "I'm here."
    ],
    day_reply: [
      "Got it.\nWhat was the hardest part?",
      "I hear you.\nPeople or tasks — which drained more?",
      "Yeah.\nAny energy left, or empty?"
    ],
    small_win: ["Yeah.\nThat actually counts.", "Good.\nThat is movement.", "I hear you — not small."],
    loneliness: ["Sounds lonely.", "I am here.", "You do not need to look stronger right now."],
    uncertainty: [
      "Uncertainty can be tiring too.",
      "You do not need every answer now.",
      "I am listening."
    ],
    future_anxiety: [
      "The future can sound louder than today.",
      "What presses most — one sentence?",
      "You do not need the full plan now."
    ],
    excitement: [
      "Good energy.",
      "Yeah — something is moving in you.",
      "Do not try to live the whole week today."
    ],
    after_work: [
      "After work your body often speaks first.",
      "Yeah.\nEmpty or just tired?",
      "I hear you."
    ],
    random_thought: ["Yeah.", "Got it.", "I am listening — what is behind it?"]
  },

  lowEgoNaturalIntent: {
    overload: [
      "That's a lot of pressure at once.",
      "This sounds more like overload than lack of motivation."
    ],
    focus: [
      "Pulled apart is a state — not who you are.",
      "If you try to hold everything at once, the system pulls apart."
    ],
    clarity: [
      "One decision is enough right now.",
      "What would make tonight feel one notch lighter inside you?"
    ]
  },

  lowEgoQuestions: {
    general: ["What would make tonight feel one notch lighter inside you?"],
    overwhelm: ["What's the one thing that, if settled today, lowers the noise?"],
    exhaustion: ["Do you have one hour tonight that's actually yours?"],
    stress: ["What's pressing hardest right now — one word?"]
  },

  silenceBeats: [
    "This sounds heavy right now.",
    "Good that you said it out loud.",
    "I'm here.",
    "I hear you."
  ],

  groundedHumor: [
    "Your brain is running too many tabs at once.",
    "What you don't need is another project in your life.",
    "Chaos is live again."
  ],

  microConnections: [
    "You sound more exhausted than unmotivated right now.",
    "Feels like you tried to control this too long.",
    "🫀 Your body probably tired out before you noticed.",
    "This sounds more like overload than laziness."
  ],

  presenceWowRhythm: [
    "You do not need a new system in your life right now.\nYou need air.",
    "When everything feels urgent at once,\nfocus gets lost.",
    "What is missing is not more thought.\nIt is breathing room."
  ],

  softMemoryCallbacks: [
    "Yesterday everything inside you sounded much more scattered.",
    "Last time your head started getting noisy around this hour too.",
    "You sound calmer than a few days ago."
  ],

  emotionalFamiliarity: [
    "Last time your focus started scattering around this hour too.",
    "You sound calmer than a few days ago.",
    "Yesterday everything inside you sounded much noisier.",
    "Same pressure, or a little lighter?"
  ],

  humanWarmth: [
    "Good that you did not keep this inside.",
    "That is completely human and understandable right now.",
    "You do not have to be perfect today."
  ],

  microAttachmentMoments: [
    "Yeah. That sounds like clearer energy now.",
    "Finally it is not only your head talking.",
    "🌱 That already sounds like a steadier step."
  ],

  presenceOnlyBeats: [
    "That must have been hard.",
    "Feels like you carried this a long time.",
    "I hear you.",
    "I am here."
  ],

  emotionalDailyRhythm: {
    morning: ["Morning activation — one direction, not ten.", "Clarity first. Then movement."],
    midday: ["Midday: grounding and one focus correction.", "Close one loop — then continue."],
    evening: ["Evening downshift — nervous system off.", "Let the head rest. I will be here tomorrow."],
    late_night: ["Late night: soft presence, not strategy.", "One breath. Then sleep."]
  },

  emotionalContinuity: {
    groundedAfterOverload: [
      "Yesterday you still sounded pulled apart. Today you sound a bit clearer.",
      "Last time it was overload — today you sound more grounded."
    ],
    stillHeavy: [
      "Still feels heavy — same pressure, or did something shift?",
      "The thread is still open. You do not have to solve everything today."
    ],
    bodyFirst: [
      "Last time your body signaled first. Similar now?",
      "Sleep and water first — the head follows after."
    ],
    thread: [
      "Picking up the thread — same weight, or lighter?",
      "Your last message had a lot of noise — where are you now?"
    ]
  },

  memoryRefOverload: [
    "Still carrying the overload from earlier?",
    "The noise was high last time — did anything settle?"
  ],

  memoryRefGroundedAfterChaos: [
    "Good. Yesterday was chaos. Today already sounds more grounded.",
    "Last thread was heavy — you sound clearer now."
  ],

  memoryRefMission: [
    "Still on {mission} — or did the day rewrite the priority?",
    "{mission} was the line — where are you against it now?"
  ],

  memoryRefTopic: [
    "Picking up where we left off — same weight, or lighter?",
    "That thread is still open in the background — worth naming one move."
  ],

  timePresence: {
    morning: [
      "Protect your first hour.",
      "Morning is for direction — not inbox archaeology.",
      "One priority before the world adds noise."
    ],
    midday: [
      "One completed block before new input.",
      "Midday: close a loop, then open the next.",
      "Momentum beats more planning right now."
    ],
    evening: [
      "Your nervous system remembers everything you ignore.",
      "Evening is for honest inventory — not another sprint.",
      "Downshift is not quitting. It is maintenance."
    ],
    late_night: [
      "Late hours borrow from tomorrow.",
      "Nothing strategic needs solving at this hour.",
      "Close one loop, then protect sleep."
    ]
  },

  naturalCheckIns: [
    "Hey — how are you with that now?",
    "Is the same noise still running in your head?",
    "Body tired or head tired right now?",
    "Better, same, or heavier than before?"
  ],

  companionCheckIns: [
    "Hey — how are you with that now?",
    "Is the same noise still running in your head?",
    "Body tired or head tired right now?"
  ],

  dailyReturnRhythm: {
    morning: [
      "Morning.\nOne direction is enough — not ten.",
      "What is the one thing you protect inside today?",
      "Clarity first.\nThen one step.",
      "You do not have to solve everything today — one direction is enough."
    ],
    midday: [
      "Midday.\nStill on your lane, or scattered?",
      "Close one loop — then continue.",
      "Focus correction: one block is enough.",
      "Scattered or overloaded? One direction now."
    ],
    evening: [
      "Evening.\nDownshift — not a new sprint.",
      "Let the head rest.\nI will be here tomorrow too.",
      "What was today's one human moment?",
      "Rest is not quitting — it is maintenance."
    ],
    late_night: [
      "It is late.\nYou do not have to close everything today.",
      "One breath.\nThen rest.",
      "I am listening — no perfect answer needed.",
      "Soft presence is enough now — not strategy."
    ],
    dayReturn: [
      "You are back — good.",
      "We can continue gently.",
      "Yesterday may have been heavy. One step is enough today."
    ]
  },

  rhythmLock: {
    morning: [
      "Morning.\nOne direction is enough today — not ten.",
      "What is the one thing you protect today?",
      "Clarity first.\nThen one block."
    ],
    morningWithMission: [
      "Morning.\nYour lane today: {mission}",
      "One direction: {mission}.\nThen movement."
    ],
    midday: [
      "Midday.\nStill on the lane you picked?",
      "Close one loop — then continue.",
      "Focus correction: one block, not ten."
    ],
    evening: [
      "Evening.\nDownshift — not a new sprint.",
      "Let the head rest.\nI will be here tomorrow too.",
      "What was today's one stable move?"
    ]
  },

  microRituals: {
    morning: [
      "Morning.\nOne direction is enough today.",
      "One block you actually protect today.",
      "Clarity — then one step."
    ],
    midday: [
      "Midday.\nStill on the lane you picked?",
      "Close one loop, then continue.",
      "Scattered or overloaded? One focus is enough."
    ],
    evening: [
      "Evening.\nDownshift — not a new sprint.",
      "What was today's one stable block?",
      "Rest — I will be here tomorrow too."
    ],
    late_night: [
      "Late night: one closing line, then sleep.",
      "Nothing strategic needs solving at this hour."
    ]
  },

  attachmentMoments: {
    calmer: [
      "Yesterday you sounded much noisier inside.",
      "Your energy reads calmer now."
    ],
    stillHeavy: [
      "Still heavy — but you are here, and that counts.",
      "The pressure is still there — you do not have to solve it all today."
    ],
    action: [
      "Good to see you are not only thinking about it — you are moving too.",
      "That is movement — not just words."
    ],
    return: ["Good that you came back today.", "You are back — that is rhythm too."]
  },

  lightAccountability: [
    "Did you get at least one stable block today?",
    "Did your body or your head carry more weight today?",
    "One line: movement today, or mostly thinking?"
  ],

  premiumQuiet: [
    "This sounds heavy right now.",
    "Good that you did not keep this inside.",
    "I hear you.",
    "I am here — no perfect answer needed right now."
  ],

  dailyCompanionLoop: {
    morning: [
      "Morning: one direction is enough — not ten.",
      "Today: one block you actually protect."
    ],
    midday: [
      "Midday: still on the lane you picked this morning?",
      "If scattered — close one loop, then continue."
    ],
    evening: [
      "Evening downshift — not a new sprint.",
      "What was the one honest move today?"
    ],
    late_night: [
      "Late night borrows from tomorrow — not today.",
      "One closing line, then sleep."
    ],
    default: ["I'm here. One step is enough."]
  },

  wowDynamicOpenings: {
    morning: [
      "It is morning.\nDo not try to solve your whole future today.",
      "One direction is enough — not ten blocks."
    ],
    lateNight: [
      "Is your head still spinning?",
      "Late night.\nClose a loop — not a new sprint in your head."
    ],
    afterStress: [
      "How is your body holding this pace right now?",
      "This sounds more like overload than laziness."
    ],
    afterProgress: [
      "This already sounds like steadier energy.",
      "Good. That is movement — not just thought."
    ]
  },

  wowSurprises: [
    "Your brain is running more tabs than Chrome right now.",
    "What is missing is not new ideas.\nIt is energy for what you already have open.",
    "This sounds more like overload than laziness."
  ],

  wowCompanionMoments: [
    "Good that you said this out loud.",
    "Yeah. That sounds more honest now.",
    "Feels like you have been carrying this a while."
  ],

  dynamicOpenings: {
    morning: [
      "It's morning.\nDo not try to solve your whole life today.\nStep cleanly into the first block only.",
      "Morning.\nOne direction. One block."
    ],
    lateNight: [
      "Is your head still spinning?\nOr are you mostly tired now?",
      "Late night.\nClose a loop, or is the mind still running?"
    ],
    evening: ["Evening.\nDownshift — not a new sprint."],
    midday: ["Midday.\nStill on the lane you picked this morning?"],
    focused: [
      "Good.\nToday we build depth — not width.",
      "Clear lane.\nOne block, deep."
    ],
    overloaded: [
      "Today is not about intensity.\nIt is nervous-system stability.",
      "A lot of pressure — one lane first, not ten."
    ],
    tired: ["Your body may signal before your head catches up today."],
    groundedReturn: [
      "You sound less pulled apart now.",
      "Yesterday this felt like full chaos — today the tone shifted."
    ],
    returnAfterSilence: [
      "You are back.\nWhere are you now — one sentence?",
      "It has been a while.\nWhat changed?"
    ],
    observational: [
      "Hey. How has the day been so far?",
      "Overload or fatigue right now?",
      "What is your body saying about this pace lately?"
    ],
    reflective: [
      "What stayed with you from the day so far?",
      "Where do you feel the most weight right now?"
    ],
    practical: [
      "One block is enough now — which one?",
      "What is the one thing that actually matters today?"
    ],
    calm: ["I am here.", "I am listening.", "Slow down — one step is enough."],
    lightHumor: [
      "Brain running too many tabs again?",
      "Yeah — a lot at once today too?"
    ]
  },

  presenceCallbacks: {
    stillChaos: [
      "Yesterday you were living this as full chaos.",
      "Still heavy — same pressure?"
    ],
    lessChaos: [
      "Yesterday you still sounded pulled apart.\nToday sounds a bit clearer.",
      "You sound less scattered now."
    ],
    lessScattered: ["Less scatter in your tone than last time."],
    trading: ["Today over-clicking may be riskier than a bad setup."],
    training: ["Your body remembers the movement — the head follows slower."],
    exhaustion: ["Your body probably tired out before you noticed."],
    mission: ["Still on {mission} — or did the day rewrite it?"]
  },

  adaptiveEnergy: {
    trader: ["Today over-clicking may be riskier than a bad setup."],
    body: ["Your body may signal before your head today."],
    overload: ["Not intensity today.\nNervous-system stability."],
    business: ["One decision matters today — not ten parallel sprints."],
    athlete: ["Your body gives honest signals today — listen first."],
    discipline: ["Depth beats width today."],
    general: ["One honest block beats a new plan today."],
    pulse: ["One direction. One block. The rest waits."]
  },

  microWow: {
    overload: [
      "This is not lack of motivation.\nToo many open loops.",
      "This is overload — not weakness."
    ],
    ideas: [
      "You do not need new ideas.\nYou need energy for what is already open."
    ],
    motivation: [
      "Not a motivation problem.\nToo many open loops at once."
    ],
    body: ["Your body probably tired out before you noticed."],
    trading: ["Today the market is the second risk — impulse is first."],
    general: [
      "Not lack of motivation — too many open loops.",
      "Not new ideas missing — energy for what you already hold."
    ]
  },

  companionWarmth: {
    saidAloud: [
      "Good that you said it out loud.",
      "That is completely human and understandable.",
      "I hear you — not judging."
    ],
    emotional: [
      "You do not need to solve everything right now.",
      "This is heavy — it is okay to feel it."
    ],
    tired: ["Your body may speak before your expectations today."],
    shame: ["Shame often sits behind expectations that are too high — not weakness."],
    general: ["I am here.", "You are okay like this."]
  },

  relationshipContinuity: {
    sameTimeScattered: [
      "Last time around this hour your focus started pulling apart too.",
      "Familiar — things often wobble for you in this part of the day."
    ],
    calmerThanBefore: [
      "Yesterday you sounded much more tense.",
      "You seem calmer than a few days ago."
    ],
    stillTense: [
      "Still a lot inside — same pressure?",
      "Yesterday had a similar tone."
    ]
  },

  relationalStay: [
    "I can feel that.",
    "Have you been carrying it a long time?",
    "I hear you.",
    "Yeah. A lot?"
  ],

  relationalCuriosity: {
    general: [
      "What is pressing hardest right now?",
      "What would make tonight one notch lighter inside you?"
    ],
    tired: ["Is your body or your head louder right now?", "Have you been running like this long?"],
    focus: ["What is scattering you most right now?", "One thing — what feels messiest?"]
  },

  naturalComfort: [
    "You do not need to solve everything at once right now.",
    "That is completely human and understandable.",
    "Sometimes a person is just tired."
  ],

  emotionalTextures: {
    presence: ["I am here.", "I am listening.", "Yeah."],
    quiet: ["Got it.", "Hm.", "…"],
    reflective: ["What stayed with you from that?", "I hear you."],
    direct: ["One block is enough.", "One decision now."],
    warm: ["Good that you said it.", "That is human."],
    sharp: ["One lane.", "Not width right now."],
    playful: ["Yeah.", "Brain running too many tabs again?"],
    grounding: ["Slow down one notch.", "One breath is enough now."]
  },

  presenceBeats: ["I am here.", "I am listening.", "Yeah.", "Got it."],

  quietConfidence: [
    "What is missing is not more thoughts right now.",
    "Rest first.\nThen look again.",
    "This is too much load at once."
  ],

  emotionalGrounding: [
    "You do not need a new plan right now.",
    "This sounds more like overload.",
    "Come back into your body a little.",
    "Body first. Thoughts after.",
    "This is not laziness — it is too much at once.",
    "You do not have to fix everything today."
  ],

  returnStateClosings: [
    "That is enough for now.",
    "Move a little slower.",
    "One step is enough today.",
    "Rest a little.",
    "I will be here tomorrow too."
  ],

  calmListening: [
    "I am listening.",
    "Yeah.",
    "Got it.",
    "I am here.",
    "That might be a lot right now."
  ],

  depthGrounding: [
    "You do not have to unpack everything now.",
    "Saying this much is enough.",
    "Take one breath.",
    "It does not need fixing right now."
  ],

  humanReactions: [
    "Hm.",
    "Yeah.",
    "That is a lot.",
    "Got it.",
    "Good.",
    "That sounds more honest now."
  ],

  quietIntelligence: [
    "This is too much load at once.",
    "I do not think motivation is what is missing.",
    "🫀 Your body signals before your head admits it.",
    "This sounds more like overload than laziness."
  ],

  comfortableSilence: [
    "That must have been a lot.",
    "Got it.",
    "🌘 Today sounds more like missing rest than missing drive.",
    "I hear you.",
    "Yeah."
  ],

  soulMemoryFlow: [
    "Last time everything started pulling apart around now too.",
    "You sound calmer than a few days ago.",
    "Yesterday everything inside you sounded noisier.",
    "Same pressure, or a bit lighter?"
  ],

  quietPresenceBeats: [
    "I am here — it does not need to be perfect right now.",
    "I am listening.",
    "That is human. It does not need fixing now.",
    "Slow is enough.",
    "You do not have to fix everything today.",
    "Body first. Thoughts after."
  ],

  subtlePresenceBeats: ["Hm.", "Got it.", "Yeah.", "I hear you."],

  humanAliveBeats: ["Hm.", "Yeah.", "Got it.", "That is a lot.", "I hear you.", "I am here."],

  presenceAttention: {
    fatigue: [
      "I think you are more tired than unmotivated right now.",
      "This sounds more like fatigue than laziness."
    ],
    overstimulation: [
      "This is too much load at once.",
      "Your brain is running too many windows at once."
    ],
    avoidance: [
      "Sounds like you are postponing — not because you are lazy.",
      "Something heavy may be in this loop."
    ],
    pressure: [
      "🫀 Your body signals before your head admits it.",
      "A lot of pressure at once right now."
    ],
    calmer: [
      "You sound calmer than a moment ago.",
      "This already feels like clearer energy."
    ]
  },

  humanPresenceMoments: [
    "That must have been hard.",
    "Got it.",
    "Good that you did not push this down.",
    "I hear you.",
    "Yeah.",
    "That is human."
  ],

  presenceRelationalContinuity: [
    "Yesterday you still sounded much tighter inside.",
    "Last time everything got noisy around now too.",
    "You sound calmer than a few days ago."
  ],

  presenceQuietRealism: [
    "I think you are more tired than unmotivated.",
    "This is too much load at once.",
    "🫀 Your body signals before your head admits it.",
    "This sounds more like overload."
  ],

  companionMicroBeats: ["Hm.", "Yeah.", "Got it.", "That must have been a lot.", "I hear you."],

  safeReturnBeats: [
    "I am here.",
    "Easy — you do not have to solve this now.",
    "I am listening.",
    "Slow is enough."
  ],

  humanizedEnergyReads: [
    "🌘 Not a new plan today — one direction is enough.",
    "🫀 Body first. Mind follows slower.",
    "🧠 Too much input today. One block.",
    "☕ Slow breath, then one decision.",
    "🌊 Not intensity today — a stable tank."
  ],

  symbolicCompanionMoments: [
    "🌘 You do not have to solve everything now.",
    "🫀 Your body tired before your head admitted it.",
    "🌱 This already feels like a steadier step.",
    "🐉 Yeah. This sounds more honest now.",
    "🫂 I am here — you do not have to carry it alone."
  ],

  flowSoftFollowups: [
    "Still in this with it?",
    "I am listening.",
    "We can keep going gently.",
    "I am still here."
  ],

  flowSoftMemory: [
    "We touched this before — does it feel different today?",
    "We came back to this again.",
    "Same pressure, or a bit lighter?"
  ],

  lateNightPresence: [
    "It is late. You do not need an answer to everything now.",
    "I am listening.",
    "Slow is enough.",
    "I am here — it does not need to be perfect."
  ],

  premiumAtmosphereLock: [
    "One direction is enough today.",
    "Clarity over speed right now.",
    "Slow and steady.",
    "One clean block is enough.",
    "You do not have to react to everything today.",
    "Quiet focus is enough now."
  ],

  microHumanityAlive: ["Hm.", "Yeah.", "That is a lot.", "Got it.", "Good."],

  naturalEmotionalSupport: [
    "That sounds like a lot right now.",
    "You do not have to solve everything today.",
    "Feels like you have been carrying this a while.",
    "You do not have to react to everything today."
  ],

  groundedWarmth: [
    "That sounds heavy right now.",
    "Good that you did not push this down.",
    "I hear you — it does not need perfect words now.",
    "That is human. It does not need fixing right now."
  ],

  microPresencePremium: [
    "Yeah.",
    "Got it.",
    "That must have been hard.",
    "This is clearer now."
  ],

  soulMicroBeats: ["Hm.", "Yeah.", "Got it.", "That must have been hard.", "Good."],

  eliteAtmosphereCalm: [
    "One lane is enough today.",
    "Protect energy: fewer inputs.",
    "Clarity beats speed right now.",
    "You do not have to react to everything today."
  ],

  premiumAtmosphere: [
    "Do not try to solve your whole future today.",
    "One clean block is enough.",
    "Overload is often just too many open loops."
  ],

  structuredCalm: [
    "Slow down one notch — you do not need to react to everything now.",
    "One breath. Then one decision.",
    "Not intensity right now — a little lower."
  ],

  microImmersion: [
    "That must have been hard.",
    "This is clearer now.",
    "Yeah."
  ],

  atmosphereTransitions: [
    "One second.",
    "Yeah.",
    "Different angle:"
  ],

  companionClosings: {
    general: [
      "Do not carry the whole mountain today.\nJust the next stable step.",
      "One clean block is enough for today.",
      "Go back into your body a little."
    ],
    stabilize: [
      "One lane.\nDo not open the rest today.",
      "One stable step is enough for today."
    ],
    soften: [
      "Nothing to prove today.\nRest is part of the system.",
      "One clean block — then sleep."
    ],
    concise: ["One block. Then report.", "Action now — not speech."],
    slow: ["Let it land.\nWe continue tomorrow.", "One honest line is enough for today."],
    deepen: ["One direction deep — not ten surfaces.", "Hold the line. One step."]
  },

  soulRhythmBeats: {
    breath: ["…", "I am here.", "I am listening."]
  },

  conversationBridges: {
    topicShift: ["Yeah.", "Different thread:", "By the way…"],
    emotionalFollow: [
      "Still in that thread?",
      "Same pressure, or a little lighter?",
      "Better, same, or heavier than before?"
    ]
  },

  conversationHumor: [
    "Brain running too many tabs again?",
    "Classic tab chaos.",
    "Got it. Digital fireworks."
  ],

  naturalTransitions: {
    general: ["By the way…", "Wait —"],
    stressToBody: ["Different question:\nhow is your body lately?"],
    stressClarify: [
      "Wait — is this stress or overload?",
      "By the way — noisy head, or empty body?"
    ],
    deeper: ["By the way — what sits underneath?"],
    workToFeeling: ["Different angle: how do you feel about this work?"],
    tradingToFeeling: ["Wait — market pressure or inner noise?"]
  },

  shortActionReplies: [
    "Good.\nSee you when you're back.",
    "Okay.\nAfter the run.",
    "Fine.\nMovement — not performance."
  ],

  sarcasmRare: [
    "Your brain is currently running seventeen tabs.",
    "Chaos is live again.",
    "You scheduled overwhelm and showed up on time."
  ],

  eliteWhispers: [
    "Discipline is reducing self-betrayal.",
    "Energy leaks destroy more futures than lack of talent.",
    "Standards are what you do when nobody applauds."
  ],

  groundedVoiceAlts: [
    "If you try to hold too much at once, a person eventually comes apart.",
    "Your body often tires out before you notice.",
    "This sounds more like overload than laziness.",
    "What is missing is rest, not motivation."
  ],

  densityLines: [
    "What is missing right now is rest, not motivation.",
    "This is starting to sound like nervous-system fatigue.",
    "You do not need to solve everything now."
  ],

  oneLineBeats: [
    "What is missing right now is rest, not motivation.",
    "This is starting to sound like nervous-system fatigue.",
    "I hear you."
  ],

  threadReturn: {
    generic: [
      "Back.\nClearer head or still noisy?",
      "You returned — what shifted?"
    ],
    run: [
      "So?\nEasier in the head or still loud inside?",
      "Back from the run — body lighter or mind still racing?"
    ],
    workout: [
      "Done?\nDid the body pull the mind down a notch?",
      "Back — stronger or just tired in a good way?"
    ],
    walk: [
      "Back.\nDid the walk buy you five percent calm?",
      "Returned — air help or still tangled?"
    ],
    breath: [
      "Back.\nBreath softer or still tight?",
      "Returned — a little more space inside?"
    ],
    trade: [
      "Back.\nDiscipline still on or impulse creeping in?",
      "Pre-session done — rules still clear?"
    ]
  }
};
