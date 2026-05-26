/**
 * Program belonging — user inside a real system, not fake attachment.
 */

/** @type {Array<{ id: string, language: string, text: string, phases?: string[] }>} */
const BELONGING_MESSAGES = [
  {
    id: "bel_hu_1",
    language: "hu",
    text: "🐉 A program kis ismétlésekből épül.",
    phases: ["morning", "midday"]
  },
  {
    id: "bel_hu_2",
    language: "hu",
    text: "⚔ A ritmus tart meg.",
    phases: ["morning", "midday", "evening"]
  },
  {
    id: "bel_hu_3",
    language: "hu",
    text: "🌘 A regeneráció is része az útnak.",
    phases: ["evening"]
  },
  {
    id: "bel_hu_4",
    language: "hu",
    text: "🐉 Dragon Blueprint — napi rendszer.",
    phases: ["morning", "midday"]
  },
  {
    id: "bel_hu_5",
    language: "hu",
    text: "⚔ Egy kör a programban — nem teljes reset.",
    phases: ["evening", "midday"]
  },
  {
    id: "bel_hu_6",
    language: "hu",
    text: "🌱 A rendszer kis lépésekből épül vissza.",
    phases: ["evening"]
  },
  {
    id: "bel_en_1",
    language: "en",
    text: "🐉 The program builds from small repetitions.",
    phases: ["morning", "midday"]
  },
  {
    id: "bel_en_2",
    language: "en",
    text: "⚔ Rhythm is what holds you.",
    phases: ["morning", "midday", "evening"]
  },
  {
    id: "bel_en_3",
    language: "en",
    text: "🌘 Recovery is part of the path.",
    phases: ["evening"]
  },
  {
    id: "bel_en_4",
    language: "en",
    text: "🐉 Dragon Blueprint — daily system.",
    phases: ["morning", "midday"]
  },
  {
    id: "bel_en_5",
    language: "en",
    text: "⚔ One loop in the program — not a full reset.",
    phases: ["evening", "midday"]
  },
  {
    id: "bel_en_6",
    language: "en",
    text: "🌱 The system rebuilds from small steps.",
    phases: ["evening"]
  },
  {
    id: "bel_ro_1",
    language: "ro",
    text: "🐉 Programul se construiește din repetiții mici.",
    phases: ["morning", "midday"]
  },
  {
    id: "bel_ro_2",
    language: "ro",
    text: "⚔ Ritmul te ține.",
    phases: ["morning", "midday", "evening"]
  },
  {
    id: "bel_ro_3",
    language: "ro",
    text: "🌘 Regenerarea e parte din drum.",
    phases: ["evening"]
  },
  {
    id: "bel_ro_4",
    language: "ro",
    text: "🐉 Dragon Blueprint — sistem zilnic.",
    phases: ["morning", "midday"]
  },
  {
    id: "bel_ro_5",
    language: "ro",
    text: "⚔ Un ciclu în program — nu reset complet.",
    phases: ["evening", "midday"]
  },
  {
    id: "bel_ro_6",
    language: "ro",
    text: "🌱 Sistemul se reconstruiește din pași mici.",
    phases: ["evening"]
  }
];

module.exports = { BELONGING_MESSAGES };
