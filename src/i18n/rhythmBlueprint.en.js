/** Dragon Blueprint — daily rhythm variation pools (EN). */

const mantras = {
  default: [
    "One lane.",
    "Discipline creates clarity.",
    "Protect the first hour.",
    "Momentum follows movement.",
    "Stabilize, then push.",
    "One clean action.",
    "Structure beats mood."
  ],
  stabilization: ["Ground first. Then move.", "Stability before intensity.", "One anchor today."],
  discipline: ["Close one loop.", "No negotiation with the plan.", "Execute one line."],
  warrior: ["Train the edge.", "Hard rep, quiet mind.", "Strength without noise."],
  recovery: ["Rest is structure.", "Recovery protects tomorrow.", "Downshift on purpose."],
  energy: ["Match pace to fuel.", "Move once, then scale.", "Energy follows honesty."],
  trading: ["Rules before entries.", "Risk before reward.", "Cooldown beats impulse."],
  exhausted: ["Less scope, more rest.", "Fuel before output.", "Stop before you lie to yourself."]
};

module.exports = {
  rhythmBlueprint: {
    mantras,
    morning: {
      opener: {
        default: [
          "Morning activation.",
          "First hour is sacred.",
          "Quiet start. Clear lane.",
          "Day opens — protect it.",
          "Before noise: anchor.",
          "Morning gate.",
          "Start slow. Start true."
        ],
        exhausted: [
          "Soft morning.",
          "Low fuel — low demand.",
          "Gentle start only.",
          "No heroics at dawn.",
          "Recovery morning.",
          "Start with rest in mind.",
          "Light entry today."
        ],
        overloaded: [
          "Calm the system first.",
          "Morning without rush.",
          "Lower input at dawn.",
          "Breathe before the list.",
          "Still morning.",
          "Quiet nervous system first.",
          "No stimulation spike."
        ],
        warrior: [
          "Morning edge.",
          "Train starts now.",
          "Sharp entry.",
          "Discipline at dawn.",
          "First rep: attention.",
          "Warrior morning — no drift.",
          "Hard start, clean mind."
        ]
      },
      energy: {
        default: [
          "Hydrate before stimulation.",
          "Calibrate fuel — not hype.",
          "Energy: honest baseline.",
          "No caffeine before water.",
          "Check fuel, then decide pace.",
          "Match output to real energy.",
          "Steady fuel, steady pace."
        ],
        exhausted: [
          "Fuel and rest before push.",
          "Minimum demand this morning.",
          "Eat or rest — then one step.",
          "Low energy — low scope.",
          "Recovery fuel first.",
          "No deficit heroics.",
          "Gentle calibration only."
        ],
        overloaded: [
          "Slow breath before screens.",
          "No spike at wake.",
          "Calm fuel: water, silence.",
          "Reduce input first.",
          "Ground before caffeine.",
          "Nervous system before tasks.",
          "Stillness before stimulation."
        ],
        warrior: [
          "Fuel for work, not drama.",
          "Hydrate. Then train.",
          "Energy for execution.",
          "Strong fuel, sharp mind.",
          "Prepare the body — then push.",
          "Calibration: ready, not hyped.",
          "Power without overstimulation."
        ]
      },
      focus: {
        default: [
          "One direction today.",
          "One primary target.",
          "Single lane until noon.",
          "One block before scatter.",
          "Direction before noise.",
          "One commitment visible.",
          "Focus: one open loop."
        ],
        exhausted: [
          "One small win only.",
          "Smallest viable task.",
          "One gentle direction.",
          "Micro-focus today.",
          "One line, then stop.",
          "Tiny target — enough.",
          "One anchor task."
        ],
        warrior: [
          "One hard target.",
          "Dominate one lane.",
          "Primary mission only.",
          "No side quests.",
          "One execution focus.",
          "Sharp target — full presence.",
          "One battle today."
        ]
      },
      body: {
        default: [
          "Movement before scrolling.",
          "Stand, breathe, move once.",
          "Body on — mind follows.",
          "Two minutes of motion.",
          "Posture reset before desk.",
          "Walk before feed.",
          "Physical wake-up first."
        ],
        exhausted: [
          "Gentle motion only.",
          "Stretch, don't sprint.",
          "Slow walk or breath.",
          "Body soft-start.",
          "Mobility, not intensity.",
          "Light movement — enough.",
          "Restore before load."
        ],
        warrior: [
          "Warm the body early.",
          "Move with intent.",
          "Physical prep before work.",
          "Train the body — brief and hard.",
          "Activation through movement.",
          "Strong posture, strong day.",
          "Body ready — mind next."
        ]
      },
      discipline: {
        default: [
          "Discipline creates clarity.",
          "Structure before mood.",
          "One rule: start ugly.",
          "Execute before you debate.",
          "Discipline is one visible action.",
          "Close one loop early.",
          "Accountability starts now."
        ],
        exhausted: [
          "Gentle discipline — still one action.",
          "Small promise, kept.",
          "Honest start beats perfect plan.",
          "One honest step.",
          "Discipline without force.",
          "Keep it small and real.",
          "One true commitment."
        ],
        warrior: [
          "No negotiation at dawn.",
          "Discipline is non-optional.",
          "Hard standard, quiet tone.",
          "Execute — no story.",
          "Edge through consistency.",
          "One rep on character.",
          "Standards before comfort."
        ]
      }
    },
    midday: {
      attention: {
        default: [
          "Do not leak energy into noise.",
          "Where is your attention now?",
          "Midday check: still on lane?",
          "Attention audit.",
          "Noise is expensive.",
          "Protect the middle of the day.",
          "Are you drifting?"
        ],
        exhausted: [
          "Pause before pushing again.",
          "Low fuel — guard attention.",
          "Rest beat before next block.",
          "Gentle midpoint.",
          "Do not force the afternoon.",
          "Conserve focus.",
          "Soft attention check."
        ],
        overloaded: [
          "Step away from screens.",
          "Midday calm, not chase.",
          "Lower stimulation now.",
          "Attention needs quiet.",
          "Breathe before next task.",
          "Do not add input.",
          "Calm the middle."
        ],
        warrior: [
          "Midday edge check.",
          "Still executing?",
          "No drift at noon.",
          "Hold the standard.",
          "Focus or reset.",
          "Sharp midpoint.",
          "Discipline at midday."
        ]
      },
      nervous: {
        default: [
          "Relax the jaw.",
          "Slow the breath.",
          "Unclench shoulders.",
          "Nervous system: downshift.",
          "Exhale longer than inhale.",
          "Soften the face.",
          "Calm the body mid-day."
        ],
        overloaded: [
          "Long exhale. Now.",
          "Ground feet. Slow breath.",
          "Overload — reduce scope.",
          "Silence for one minute.",
          "Calm before continue.",
          "No new pressure.",
          "Breathe slower than you want."
        ],
        exhausted: [
          "Rest the system briefly.",
          "No push through fog.",
          "Gentle breath only.",
          "Pause is allowed.",
          "Soft nervous reset.",
          "Recovery beat at noon.",
          "Stop before you snap."
        ]
      },
      bodyCue: {
        default: [
          "Water. Posture. Breath.",
          "Hydrate. Stand. Exhale.",
          "Posture reset + water.",
          "Drink. Align spine. Breathe.",
          "Body cue: water and breath.",
          "Stand, sip, breathe.",
          "Physical reset — 60 seconds."
        ]
      },
      focusFix: {
        default: [
          "Return to the task.",
          "One lane.",
          "Back to primary work.",
          "Close the distraction tab.",
          "Resume the open loop.",
          "Midday correction: one task.",
          "Execute the next line."
        ],
        warrior: [
          "Back to mission.",
          "No side lanes.",
          "Execute — now.",
          "Hold the line.",
          "Midday: sharp return.",
          "One target — full presence.",
          "Discipline reset."
        ]
      }
    },
    evening: {
      release: {
        default: [
          "You do not need to solve everything tonight.",
          "Release what you cannot finish today.",
          "Pressure off.",
          "Day closes — not your worth.",
          "Let the unfinished wait.",
          "Evening: permission to stop.",
          "Not everything is for tonight."
        ],
        overloaded: [
          "Stop solving. Start settling.",
          "Overload ends with less input.",
          "Quiet now.",
          "No more mental load tonight.",
          "Gentle close.",
          "Release the tension.",
          "Calm close."
        ],
        exhausted: [
          "Rest is the work now.",
          "You did enough.",
          "Soft landing.",
          "No evening heroics.",
          "Close gentle.",
          "Recovery tonight.",
          "Stop before empty."
        ]
      },
      screen: {
        default: [
          "Lower the noise.",
          "Screens down — mind down.",
          "Reduce stimulation.",
          "Dim input after dark.",
          "Less scroll, more stillness.",
          "Digital sunset.",
          "Quiet the feed."
        ]
      },
      reflection: {
        default: [
          "What strengthened you today?",
          "One true win from today.",
          "What held steady?",
          "What would you repeat tomorrow?",
          "One line of honesty about today.",
          "What mattered today?",
          "Name one solid moment."
        ]
      },
      recovery: {
        default: [
          "Recovery protects tomorrow.",
          "Sleep is structure.",
          "Tomorrow needs a rested system.",
          "Protect the night.",
          "Rest before push returns.",
          "Downshift for dawn.",
          "Recovery is discipline."
        ],
        exhausted: [
          "Prioritize sleep tonight.",
          "Full recovery mode.",
          "Tomorrow starts with rest.",
          "No late push.",
          "Sleep is non-negotiable.",
          "Heal tonight.",
          "Gentle night protocol."
        ]
      }
    },
    late_night: {
      release: {
        default: [
          "Late — not a second sprint.",
          "Close the day without guilt.",
          "Enough for tonight.",
          "Stop. Breathe. Sleep soon.",
          "Nothing more required now.",
          "Late night: minimum.",
          "Quiet close."
        ]
      },
      screen: {
        default: [
          "Screens off path.",
          "No new input.",
          "Dark mode for the mind.",
          "Put the phone down.",
          "Silence devices.",
          "Stop the scroll.",
          "Lower light, lower noise."
        ]
      },
      reflection: {
        default: [
          "One honest line — then sleep.",
          "What can wait until morning?",
          "No full review now.",
          "Brief note, then rest.",
          "Keep reflection small.",
          "Tomorrow holds the plan.",
          "One sentence, not a journal."
        ]
      },
      recovery: {
        default: [
          "Sleep now beats planning.",
          "Rest over rumination.",
          "Tomorrow needs you rested.",
          "Close eyes soon.",
          "Recovery starts with sleep.",
          "Night protocol: rest.",
          "Protect dawn with sleep."
        ]
      }
    }
  }
};
