/**
 * Dragon Blueprint protocol copy — EN.
 */

const labels = {
  step: "Step",
  next: "Next",
  safety: "Note: this is awareness, not punishment. Start slowly; observe your body."
};

const stateLines = {
  energy_low: "State: low energy.",
  energy_high: "State: clear, focused energy.",
  energy_stable: "State: stable, watchful energy.",
  energy_exhausted: "State: depleted system.",
  energy_overstimulated: "State: too many open loops.",
  ns_overloaded: "State: nervous system overloaded.",
  ns_anxious: "State: restless, scattered.",
  ns_calm: "State: calm baseline.",
  ns_grounded: "State: grounded.",
  disc_drifting: "State: focus drifting.",
  disc_locked: "State: one task locked.",
  disc_inconsistent: "State: uneven rhythm."
};

const pillars = {
  energy_awareness: {
    title: "Energy awareness",
    icon: "⚡",
    purpose: "Not motivation — observation: where energy leaks.",
    explain: {
      default: "Dragon Blueprint does not rush here. Only see where it flows.",
      low: "This is not laziness. The system is empty — refill first.",
      high: "Capacity is here — do not scatter; one direction.",
      overloaded: "Too many open loops. Close one channel first."
    },
    actions: {
      beginner: ["Drink a glass of water.", "Stand up for 60 seconds.", "5 slow breaths."],
      intermediate: ["10-minute walk without phone.", "One meal eaten slowly, aware.", "Energy log: one line."],
      advanced: ["20 minutes silence — observe only.", "One decision: what you will not open today.", "Body scan: feet, belly, shoulders."]
    },
    warnings: "Dizziness or heavy fatigue: rest, not force.",
    reset: "Water + breath + 15 min screen off."
  },
  fasting_reset: {
    title: "Fasting & reset",
    icon: "🌙",
    purpose: "Space for digestion — if comfortable and familiar.",
    explain: {
      default: "Not extreme fasting. Reset when your body already knows the rhythm.",
      low: "On low energy: shorter eating window, not long fasts.",
      high: "If stable: clean window, water, attention."
    },
    actions: {
      beginner: ["3 hours before last meal: water only.", "Next meal: simple, slow.", "Notice: hunger or habit?"],
      intermediate: ["12–14 h window — if already habitual.", "Electrolytes / water.", "No punitive thinking."],
      advanced: ["14–16 h only if adapted.", "Cold shower optional — if comfortable.", "Morning: light activation, not war."]
    },
    warnings: "Dizziness, weakness, headache: eat; do not push.",
    reset: "Normal meal + walk + sleep priority."
  },
  movement_training: {
    title: "Movement & training",
    icon: "🏃",
    purpose: "Body = carrier. Movement stabilizes, does not punish.",
    explain: {
      default: "Not a performance contest — system maintenance.",
      low: "No warrior push. Light movement, return.",
      high: "Fuel is here — one focused block is enough."
    },
    actions: {
      beginner: ["10 min walk or mobility.", "20 slow squats if comfortable.", "Shoulder + hip stretch."],
      intermediate: ["20–30 min run or strong walk.", "10 min mobility before session.", "One session — done."],
      advanced: ["Intervals or strength block — if recovered.", "Cold exposure only if adapted.", "Rest matters equally."]
    },
    warnings: "Pain, dizziness: stop, hydrate.",
    reset: "Walk + breath; training tomorrow."
  },
  nervous_stabilization: {
    title: "Stabilization",
    icon: "🫀",
    purpose: "Nervous system back in the body — not thought spiral.",
    explain: {
      default: "This is not laziness. Too many open loops.",
      overloaded: "System too loud. Silence before decisions.",
      anxious: "Body faster than mind. Slow the breath."
    },
    actions: {
      beginner: ["Drink water.", "Stand up.", "5 slow breaths — 4 out, 6 in."],
      intermediate: ["10 min walk without window.", "One room, one task.", "Shoulders down, jaw soft."],
      advanced: ["15 min silence or body-scan.", "30 min screen off.", "One sentence: what you release now."]
    },
    warnings: "Panic or severe anxiety: human support is an option.",
    reset: "Repeat: water, breath, walk."
  },
  discipline_focus: {
    title: "Discipline & focus",
    icon: "🎯",
    purpose: "Lock one task — not another list.",
    explain: {
      default: "Scatter is not weakness — too many gates.",
      drifting: "Focus drifting. We place one lock.",
      locked: "Locked. Do not open a new gate."
    },
    actions: {
      beginner: ["Write: one task for 60 minutes.", "Phone in another room.", "Start timer."],
      intermediate: ["45 min deep work — notifications off.", "Next: /focus <task>", "After: 5 min walk."],
      advanced: ["90 min one direction.", "2 min environment reset.", "Tonight: prep digital detox."],
      locked: ["Stay on the locked task.", "No new tabs.", "Close with /evening."]
    },
    warnings: "If depleted: /reset first.",
    reset: "/reset then one short task."
  },
  digital_detox: {
    title: "Digital detox",
    icon: "📵",
    purpose: "Screen = nervous load. Reduce with intent.",
    explain: {
      default: "Not ban — boundary.",
      drifting: "Scrolling = drift. One boundary now."
    },
    actions: {
      beginner: ["15 min without phone.", "Notifications off 1 hour.", "Close one app — done."],
      intermediate: ["60 min deep work mode.", "Evening: screen rhythm after 21:00.", "Book or walk instead."],
      advanced: ["2 h evening detox.", "Morning: first 30 min no feed.", "Charger in another room."]
    },
    warnings: "Work/trade needs screen: short blocks, breaks.",
    reset: "/reset + 10 min walk."
  },
  morning_activation: {
    title: "Morning activation",
    icon: "🌅",
    purpose: "Not rush — direction and body wake-up.",
    explain: {
      default: "First protocol: water, breath, one direction.",
      low: "Soft activation — no warrior morning."
    },
    actions: {
      beginner: ["Water.", "5 breaths.", "One line: today's single direction?"],
      intermediate: ["10 min movement.", "Breakfast aware.", "Lock one task."],
      advanced: ["Cold face/water — if comfortable.", "20 min movement or mobility.", "Before trade: /trade check."]
    },
    warnings: "Sleep debt: short protocol, not extreme.",
    reset: "/energy if unsure."
  },
  midday_stabilization: {
    title: "Midday stabilization",
    icon: "☀️",
    purpose: "Midpoint — do not let the day scatter.",
    explain: {
      default: "Halfway: breath, water, one lock.",
      overloaded: "Noon noise too — short reset."
    },
    actions: {
      beginner: ["Water.", "5 min walk.", "Continue one task — no new one."],
      intermediate: ["10 min silence.", "Light meal if needed.", "Refresh /focus."],
      advanced: ["20 min walk phone-free.", "Energy check: high/low?", "Prep evening recovery."]
    },
    warnings: "Afternoon crash: light movement, not caffeine overload.",
    reset: "/reset"
  },
  evening_recovery: {
    title: "Evening recovery",
    icon: "🌙",
    purpose: "Release — not another fight.",
    explain: {
      default: "Close the day: body, not more lists.",
      low: "Early rest protocol — build tomorrow."
    },
    actions: {
      beginner: ["Reduce screens.", "3 slow breaths.", "One line: what you release."],
      intermediate: ["10 min walk or stretch.", "Tomorrow one direction — one sentence.", "No revenge trade tonight."],
      advanced: ["10–20 min meditation — if habitual.", "3-line journal.", "5 min full silence."]
    },
    warnings: "Do not spin the nervous system before sleep.",
    reset: "Water + breath + dark room direction."
  },
  trading_psychology: {
    title: "Trading psychology",
    icon: "📊",
    purpose: "Trading = nervous system mastery. Not setup racing.",
    explain: {
      default: "If the body is not calm, the chart lies.",
      overloaded: "No trade. Reset first.",
      anxious: "Panic trade = loss. Stop."
    },
    actions: {
      beginner: ["5 checks: calm? plan? no revenge? tired? risk fixed?", "If any no: no trade.", "/reset"],
      intermediate: ["Setup on paper, not in head.", "Risk % written.", "Stop before entry — not after."],
      advanced: ["A+ setup only when calm.", "Session limit honored.", "After: walk, not scroll."]
    },
    warnings: "Not financial advice — self-awareness protocol.",
    reset: "/reset — no trade."
  },
  daily_state: {
    title: "Daily state",
    icon: "📋",
    purpose: "Mirror — energy, nervous system, discipline.",
    explain: {
      default: "Not judgment — data for today's protocol."
    },
    actions: {
      beginner: ["Read the state lines.", "Pick one command for today.", "Water now."],
      intermediate: ["From state: morning or reset?", "Lock one command.", "Plan /evening."],
      advanced: ["One advanced step — if comfortable.", "No parallel protocols.", "Tomorrow /morning."]
    },
    warnings: "Bad day ≠ bad person. Reset protocol.",
    reset: "/reset"
  }
};

const tradeBlock = {
  stateNoTrade: "State: no trade — reset first.",
  stateReady: "State: calm baseline — run checks.",
  stateCheck: "State: pre-trade check.",
  noTrade: "No trade now. Chart is not first — body is first."
};

module.exports = { labels, stateLines, pillars, tradeBlock };
