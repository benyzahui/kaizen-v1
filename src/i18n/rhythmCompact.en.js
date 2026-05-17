/** Phase 2 — compact daily rhythm copy (EN) */

module.exports = {
  rhythmMorning: (name, energySnippet, focus, danger, body) =>
    [
      name ? `Morning, ${name}.` : "Morning gate.",
      "",
      energySnippet ? `Energy: ${energySnippet}` : "",
      focus ? `Focus: ${focus}` : "Focus: one block only.",
      danger ? `Watch: ${danger}` : "Watch: tab overload.",
      body ? `Body: ${body}` : "Body: water + stand up.",
      "",
      "One direction. Then move."
    ]
      .filter(Boolean)
      .join("\n"),

  rhythmDangerDefault: "tab overload",
  rhythmBodyDefault: "water + stand up",

  rhythmMidday: "Midday.\nStill on the lane you picked?",

  rhythmEvening: "Evening.\nDownshift — not a new sprint."
};
