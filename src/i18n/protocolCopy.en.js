/** Protocol engine + discipline onboarding (EN). */

module.exports = {
  protocolStabilizeLead: "Stabilize first.",
  protocolCommandsList: [
    "Commands:",
    "/panel /guide /status",
    "/morning /midday /evening",
    "/discipline /stabilization /training",
    "/recovery /energy /breath",
    "/reset /focus /language"
  ].join("\n"),
  guideCompactBody: [
    "KaiZen — light presence + manual protocols",
    "",
    "/panel — folders",
    "/morning /midday /evening",
    "/status /language",
    "",
    "Open text stays short. One protocol is enough."
  ].join("\n"),
  rhythmStabilization: {
    variants: [
      "Understood. Stabilize first.\nWater. Breath. One small move.",
      "Heard. Ground before push.\nWater. Slow exhale. One step.",
      "Stabilization now.\nStand. Breathe. One clean action."
    ],
    commandHint: "→ /reset"
  },
  protocolCommandBlocked:
    "That command is offline. Use:\n/panel /morning /midday /evening /stabilization /status",
  protocolOnboarding: {
    startReturning: [
      "KaiZen.",
      "Rhythm is live.",
      "",
      "/morning /midday /evening",
      "/energy /reset /status"
    ].join("\n"),
    start: [
      "KaiZen.",
      "Digital discipline companion.",
      "",
      "Language:",
      "1 — English",
      "2 — Magyar",
      "3 — Română"
    ].join("\n"),
    askLanguage: [
      "Language:",
      "1 — English",
      "2 — Magyar",
      "3 — Română"
    ].join("\n"),
    askName: "Your name — one word or short line.",
    nameAck: "{name}.",
    askPath: [
      "Primary path:",
      "1 — Stabilization",
      "2 — Discipline",
      "3 — Energy",
      "4 — Warrior",
      "5 — Recovery",
      "6 — Trading Focus"
    ].join("\n"),
    pathInvalid: "Pick 1–6 or name the path in one line.",
    pathLabels: {
      stabilization: "Stabilization",
      discipline: "Discipline",
      energy: "Energy",
      warrior: "Warrior",
      recovery: "Recovery",
      trading: "Trading Focus"
    },
    complete: [
      "{name} — {path}.",
      "Mode: {mode}.",
      "",
      "Protect your attention today.",
      "/morning when you are ready."
    ].join("\n")
  },
  protocolGuidance: {
    general: [
      "Protect your attention today.",
      "One clean action.",
      "Momentum returns through movement.",
      "Stabilize first. Push later."
    ],
    stabilization: [
      "Ground the body before the plan.",
      "Lower input. One anchor task.",
      "Stability before intensity."
    ],
    discipline: [
      "One commitment. No negotiation.",
      "Close the smallest open loop.",
      "Discipline is a single visible action."
    ],
    energy: [
      "Match output to real fuel.",
      "Move first — then decide scale.",
      "Energy follows honest recovery."
    ],
    warrior: [
      "Train the edge — not the story.",
      "One hard rep or one hard minute.",
      "Strength without drama."
    ],
    recovery: [
      "Recovery is active, not passive.",
      "Sleep, food, silence — in that order.",
      "Downshift is part of the path."
    ],
    trading: [
      "Risk before reward.",
      "No trade without a written rule.",
      "Step away when impulse speaks."
    ],
    modes: {
      stabilization: ["Stabilize first. Push later.", "One anchor. Lower noise."],
      discipline: ["One clean action.", "Close one loop before opening another."],
      warrior: ["One hard minute.", "Train the body — quiet mind."],
      recovery: ["Rest is structure.", "Fuel and sleep before output."],
      energy: ["Move once. Then scale.", "Match pace to real fuel."],
      trading: ["Rules before entries.", "Cooldown beats revenge."]
    },
    energy_low: [
      "Fuel and rest before push.",
      "One small physical reset.",
      "Lower demand on the nervous system."
    ],
    energy_overstimulated: [
      "Cut input. Breathe slow.",
      "No new commitments today.",
      "Ground before any decision."
    ],
    discipline_drift: [
      "Pick one task. Start ugly.",
      "Discipline is one visible finish.",
      "Stop browsing the plan — execute one line."
    ],
    discipline_locked: [
      "Hold the lane. No extra targets.",
      "Execute what is already open.",
      "Depth beats new ideas."
    ],
    nervous_overload: [
      "Overload — reduce scope now.",
      "Silence and breath before talk.",
      "/reset if you need a hard stop."
    ],
    emergency_short: ["Breathe. One step.", "Stabilize. Then speak."],
    grounded: ["Good base. Protect it with one action.", "Stay in the lane."],
    recovery: ["Recovery mode — no heroics.", "Rest is the work."],
    asked_help: [
      "Use a protocol command when ready.",
      "/morning /energy /reset /status"
    ],
    silence: ["Noted.", "Here when you move.", "One line is enough."],
    fallback: ["Stabilize first. Push later.", "One clean action."]
  },
  rituals: {
    fasting: [
      "Fasting protocol:",
      "Hydrate. No heroic deficit.",
      "If dizzy — eat. Discipline includes honesty."
    ].join("\n"),
    training: [
      "Training protocol:",
      "Warm up. One primary block.",
      "Stop before form breaks — momentum tomorrow."
    ].join("\n")
  }
};
