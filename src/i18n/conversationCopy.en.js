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
    "⚔ Small check-in.\nDid today become clearer or noisier?",
    "Hydration. Breath. One honest status line.",
    "Did you move your body today or only your thoughts?",
    "One line: better, same, or heavier than this morning?"
  ],

  shortActionReplies: [
    "Good.\nEasier to reorder the head from the body.\nDo not bring performance — bring rhythm.",
    "Run/walk — not a lecture.\nTwenty minutes. Phone stays dark.",
    "Movement first. Meaning can wait."
  ],

  sarcasmRare: [
    "Your brain is currently running seventeen tabs.",
    "Chaos is testing in production again.",
    "You scheduled overwhelm and showed up on time."
  ],

  eliteWhispers: [
    "Discipline is reducing self-betrayal.",
    "Energy leaks destroy more futures than lack of talent.",
    "Standards are what you do when nobody applauds."
  ]
};
