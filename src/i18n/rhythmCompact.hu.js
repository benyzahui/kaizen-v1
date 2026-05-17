/** Phase 2 — compact daily rhythm (HU) */

module.exports = {
  rhythmMorning: (name, energySnippet, focus, danger, body) =>
    [
      name ? `Reggel, ${name}.` : "Reggeli kapu.",
      "",
      energySnippet ? `Energia: ${energySnippet}` : "",
      focus ? `Fókusz: ${focus}` : "Fókusz: egy blokk.",
      danger ? `Veszély: ${danger}` : "Veszély: tab túlterhelés.",
      body ? `Test: ${body}` : "Test: víz + felállás.",
      "",
      "Egy irány. Aztán mozgás."
    ]
      .filter(Boolean)
      .join("\n"),

  rhythmDangerDefault: "tab túlterhelés",
  rhythmBodyDefault: "víz + felállás",

  rhythmMidday:
    "Dél.\nMég azon a sávon vagy?\nHa szétszórt vagy — egy kör zárása, aztán folytatás.",

  rhythmEvening:
    "Este.\nMi volt ma az egy stabil blokk?\nLeeresztés — nem új sprint.\nEgy őszinte sor, aztán pihenés."
};
