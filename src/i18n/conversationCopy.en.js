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
      "Your body is not signaling laziness — too much pressure at once."
    ],
    tired: [
      "That is fatigue. You do not need a new goal right now — rest.",
      "Feels like you have been pushing without a real pause for a while."
    ],
    scattered: [
      "If you try to hold everything at once, the system pulls apart.",
      "Not weakness — too many open loops running at the same time."
    ],
    general: [
      "I am here. Slow down — no perfect answer needed.",
      "One honest step today is enough."
    ]
  },

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
    day_reply: [
      "Got it.\nWhat was the hardest part?",
      "I hear you.\nPeople or tasks — which drained more?",
      "Yeah.\nAny energy left, or empty?"
    ]
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

  companionCheckIns: [
    "Hey — did you get focus back at all today?",
    "Right now: is your body tired or your head?",
    "One line: better, same, or heavier than this morning?",
    "Water in? Breath a bit slower?"
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
    "This sounds more like overload than laziness.",
    "Too many things running at once inside you.",
    "You do not look weak — you look like you pushed without pauses.",
    "Not a new plan. Nervous system reset first.",
    "Your body signaled before your ego admitted it."
  ],

  oneLineBeats: [
    "Do not prove anything today. Stabilize.",
    "The simplest step right now is the strongest.",
    "One honest block. Then stop."
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
