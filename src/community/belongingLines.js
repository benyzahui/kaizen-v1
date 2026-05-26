/**
 * Community presence — MindsetAlchemy belonging, no cult energy.
 */

/** @type {Array<{ id: string, language: string, text: string, scenes?: string[] }>} */
const BELONGING_LINES = [
  {
    id: "bel_com_hu_1",
    language: "hu",
    text: "🐉 A közösségben mások is épülnek.",
    scenes: ["beginner", "stabilization"]
  },
  {
    id: "bel_com_hu_2",
    language: "hu",
    text: "⚔ Mindenki valahonnan indul.",
    scenes: ["beginner", "comeback"]
  },
  {
    id: "bel_com_hu_3",
    language: "hu",
    text: "🌱 A stabilitás ismétlésből születik.",
    scenes: ["stabilization", "beginner"]
  },
  {
    id: "bel_com_hu_4",
    language: "hu",
    text: "🐉 Nem egyedül építed — a rendszer közös.",
    scenes: ["beginner", "lonely_evening"]
  },
  {
    id: "bel_com_hu_5",
    language: "hu",
    text: "⚔ A MindsetAlchemy közösség lassan épít.",
    scenes: ["stabilization"]
  },
  {
    id: "bel_com_hu_6",
    language: "hu",
    text: "🌱 Üdvözöl a közös út — nyugodt tempóban.",
    scenes: ["beginner", "comeback"]
  },
  {
    id: "bel_com_en_1",
    language: "en",
    text: "🐉 Others are rebuilding in the community too.",
    scenes: ["beginner", "stabilization"]
  },
  {
    id: "bel_com_en_2",
    language: "en",
    text: "⚔ Everyone starts somewhere.",
    scenes: ["beginner", "comeback"]
  },
  {
    id: "bel_com_en_3",
    language: "en",
    text: "🌱 Stability is born from repetition.",
    scenes: ["stabilization", "beginner"]
  },
  {
    id: "bel_com_en_4",
    language: "en",
    text: "🐉 You are not building alone — the system is shared.",
    scenes: ["beginner", "lonely_evening"]
  },
  {
    id: "bel_com_en_5",
    language: "en",
    text: "⚔ The MindsetAlchemy community builds slowly.",
    scenes: ["stabilization"]
  },
  {
    id: "bel_com_en_6",
    language: "en",
    text: "🌱 Welcome to the shared path — calm pace.",
    scenes: ["beginner", "comeback"]
  },
  {
    id: "bel_com_ro_1",
    language: "ro",
    text: "🐉 Și alții construiesc în comunitate.",
    scenes: ["beginner", "stabilization"]
  },
  {
    id: "bel_com_ro_2",
    language: "ro",
    text: "⚔ Toți pornesc de undeva.",
    scenes: ["beginner", "comeback"]
  },
  {
    id: "bel_com_ro_3",
    language: "ro",
    text: "🌱 Stabilitatea vine din repetiție.",
    scenes: ["stabilization", "beginner"]
  },
  {
    id: "bel_com_ro_4",
    language: "ro",
    text: "🐉 Nu construiești singur — sistemul e comun.",
    scenes: ["beginner", "lonely_evening"]
  },
  {
    id: "bel_com_ro_5",
    language: "ro",
    text: "⚔ Comunitatea MindsetAlchemy construiește încet.",
    scenes: ["stabilization"]
  },
  {
    id: "bel_com_ro_6",
    language: "ro",
    text: "🌱 Bine ai venit pe drumul comun — ritm calm.",
    scenes: ["beginner", "comeback"]
  }
];

module.exports = { BELONGING_LINES };
