/**
 * Life balance reminders — pressure off, body not machine.
 */

/** @type {Array<{ id: string, language: string, text: string, scenes?: string[] }>} */
const LIFE_BALANCE_REMINDERS = [
  {
    id: "lbr_hu_1",
    language: "hu",
    text: "🌘 Kapcsolódj ki a zajból kicsit.",
    scenes: ["overloaded_evening", "stressed_worker"]
  },
  {
    id: "lbr_hu_2",
    language: "hu",
    text: "🫀 A tested nem gép.",
    scenes: ["exhausted", "recovery_day", "overloaded_evening"]
  },
  {
    id: "lbr_hu_3",
    language: "hu",
    text: "🌊 Nem kell egész nap pusholni.",
    scenes: ["busy_entrepreneur", "stressed_worker"]
  },
  {
    id: "lbr_hu_4",
    language: "hu",
    text: "🌘 Este elég a lezárás — nem a teljesítmény.",
    scenes: ["overloaded_evening"]
  },
  {
    id: "lbr_hu_5",
    language: "hu",
    text: "🫀 A kapcsolatok és a munka is terhel — ez normális.",
    scenes: ["stressed_worker", "busy"]
  },
  {
    id: "lbr_en_1",
    language: "en",
    text: "🌘 Disconnect from the noise a little.",
    scenes: ["overloaded_evening", "stressed_worker"]
  },
  {
    id: "lbr_en_2",
    language: "en",
    text: "🫀 Your body is not a machine.",
    scenes: ["exhausted", "recovery_day", "overloaded_evening"]
  },
  {
    id: "lbr_en_3",
    language: "en",
    text: "🌊 You do not need to push all day.",
    scenes: ["busy_entrepreneur", "stressed_worker"]
  },
  {
    id: "lbr_en_4",
    language: "en",
    text: "🌘 Evening is for closing — not performing.",
    scenes: ["overloaded_evening"]
  },
  {
    id: "lbr_en_5",
    language: "en",
    text: "🫀 Relationships and work both load you — that is normal.",
    scenes: ["stressed_worker", "busy"]
  },
  {
    id: "lbr_ro_1",
    language: "ro",
    text: "🌘 Deconectează-te puțin de zgomot.",
    scenes: ["overloaded_evening", "stressed_worker"]
  },
  {
    id: "lbr_ro_2",
    language: "ro",
    text: "🫀 Corpul tău nu e mașină.",
    scenes: ["exhausted", "recovery_day", "overloaded_evening"]
  },
  {
    id: "lbr_ro_3",
    language: "ro",
    text: "🌊 Nu trebuie să împingi toată ziua.",
    scenes: ["busy_entrepreneur", "stressed_worker"]
  },
  {
    id: "lbr_ro_4",
    language: "ro",
    text: "🌘 Seara e pentru închidere — nu performanță.",
    scenes: ["overloaded_evening"]
  },
  {
    id: "lbr_ro_5",
    language: "ro",
    text: "🫀 Relațiile și munca te încarcă — e normal.",
    scenes: ["stressed_worker", "busy"]
  }
];

module.exports = { LIFE_BALANCE_REMINDERS };
