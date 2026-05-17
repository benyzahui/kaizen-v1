/** Phase 2 — compact daily rhythm (RO) */

module.exports = {
  rhythmMorning: (name, energySnippet, focus, danger, body) =>
    [
      name ? `Dimineață, ${name}.` : "Poarta dimineții.",
      "",
      energySnippet ? `Energie: ${energySnippet}` : "",
      focus ? `Focus: ${focus}` : "Focus: un bloc.",
      danger ? `Atenție: ${danger}` : "Atenție: prea multe tab-uri.",
      body ? `Corp: ${body}` : "Corp: apă + ridică-te.",
      "",
      "O direcție. Apoi mișcare."
    ]
      .filter(Boolean)
      .join("\n"),

  rhythmMidday: "Amiază.\nÎncă pe banda aleasă?",

  rhythmEvening: "Seară.\nCoborâre — nu sprint nou."
};
