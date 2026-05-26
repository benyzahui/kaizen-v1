/**
 * Hopeful stabilization after hard days — release, not productivity.
 */

/** @type {Array<{ id: string, language: string, text: string, trigger: string }>} */
const HARD_DAY_RESPONSES = [
  {
    id: "hd_hu_1",
    language: "hu",
    trigger: "hard_day",
    text: "🌘 Nehéz nap volt?\nMost pihenj.\nHolnap új kör."
  },
  {
    id: "hd_hu_2",
    language: "hu",
    trigger: "overload",
    text: "🫀 Nem kell most mindent megoldani."
  },
  {
    id: "hd_hu_3",
    language: "hu",
    trigger: "collapse",
    text: "🌱 Az irány fontosabb mint a tökéletesség."
  },
  {
    id: "hd_hu_4",
    language: "hu",
    trigger: "fatigue",
    text: "🌘 Ez most inkább fáradtság.\nPihenj. Holnap új kör."
  },
  {
    id: "hd_hu_5",
    language: "hu",
    trigger: "lonely_evening",
    text: "🌘 Elég volt mára.\nLassan stabilizálunk."
  },
  {
    id: "hd_hu_6",
    language: "hu",
    trigger: "stress",
    text: "🫀 Egy lépés elég ma.\nA többi holnap."
  },
  {
    id: "hd_en_1",
    language: "en",
    trigger: "hard_day",
    text: "🌘 Hard day?\nRest now.\nTomorrow is a new round."
  },
  {
    id: "hd_en_2",
    language: "en",
    trigger: "overload",
    text: "🫀 You do not need to solve everything now."
  },
  {
    id: "hd_en_3",
    language: "en",
    trigger: "collapse",
    text: "🌱 Direction matters more than perfection."
  },
  {
    id: "hd_en_4",
    language: "en",
    trigger: "fatigue",
    text: "🌘 This feels more like fatigue.\nRest. Tomorrow is a new round."
  },
  {
    id: "hd_en_5",
    language: "en",
    trigger: "lonely_evening",
    text: "🌘 Enough for today.\nWe stabilize slowly."
  },
  {
    id: "hd_en_6",
    language: "en",
    trigger: "stress",
    text: "🫀 One step is enough today.\nThe rest can wait."
  },
  {
    id: "hd_ro_1",
    language: "ro",
    trigger: "hard_day",
    text: "🌘 Zi grea?\nOdihnește acum.\nMâine e un nou ciclu."
  },
  {
    id: "hd_ro_2",
    language: "ro",
    trigger: "overload",
    text: "🫀 Nu trebuie să rezolvi totul acum."
  },
  {
    id: "hd_ro_3",
    language: "ro",
    trigger: "collapse",
    text: "🌱 Direcția contează mai mult decât perfecțiunea."
  },
  {
    id: "hd_ro_4",
    language: "ro",
    trigger: "fatigue",
    text: "🌘 Acum e mai mult oboseală.\nOdihnește. Mâine e un nou ciclu."
  },
  {
    id: "hd_ro_5",
    language: "ro",
    trigger: "lonely_evening",
    text: "🌘 Destul pentru azi.\nStabilizăm încet."
  },
  {
    id: "hd_ro_6",
    language: "ro",
    trigger: "stress",
    text: "🫀 Un pas e suficient azi.\nRestul poate aștepta."
  }
];

module.exports = { HARD_DAY_RESPONSES };
