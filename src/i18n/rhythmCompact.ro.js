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

  rhythmMidday:
    "Prânz.\nAi rămas pe blocul unic?\nDacă nu — taie înapoi. Cinci minute pe task-ul real.",

  rhythmEvening:
    "Oglinda serii.\nCe a mers cu adevărat azi?\nCoborâre: ecran mai slab, respirație lentă.\nO linie onestă pentru mâine — nu discurs."
};
