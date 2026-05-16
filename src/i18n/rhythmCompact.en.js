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

  rhythmMidday: "Midday.\nDrift check: are you still on the one block?\nIf not — cut back. Five minutes on the real task.",

  rhythmEvening:
    "Evening mirror.\nWhat actually landed today?\nDownshift: dim screen, slower breath.\nOne honest line for tomorrow — not a speech."
};
