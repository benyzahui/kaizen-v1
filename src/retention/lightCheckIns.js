/**
 * Light reflective check-ins — remembered, not marketed.
 */

/** @type {Array<{ id: string, language: string, text: string, contexts: string[], phases: string[] }>} */
const LIGHT_CHECK_INS = [
  {
    id: "lci_focus_day_hu",
    language: "hu",
    text: "Ma szétesett vagy inkább fókuszált voltál?",
    contexts: ["daily", "midday", "evening"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_energy_noise_hu",
    language: "hu",
    text: "Energia vagy zaj dominált ma?",
    contexts: ["daily", "midday"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_attention_hu",
    language: "hu",
    text: "Mi húzta szét ma a figyelmed?",
    contexts: ["daily", "evening", "open"],
    phases: ["evening", "midday"]
  },
  {
    id: "lci_body_head_hu",
    language: "hu",
    text: "Tested vagy fejed fáradtabb most?",
    contexts: ["open", "daily"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_compare_hu",
    language: "hu",
    text: "Na — jobb, ugyanaz, vagy nehezebb?",
    contexts: ["open"],
    phases: ["morning", "midday"]
  },
  {
    id: "lci_noise_hu",
    language: "hu",
    text: "Még mindig ugyanaz a zaj fut benned?",
    contexts: ["open", "overloaded"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_one_lane_hu",
    language: "hu",
    text: "Még azon a sávon vagy, vagy szétszórt?",
    contexts: ["daily", "midday"],
    phases: ["midday"]
  },
  {
    id: "lci_focus_day_en",
    language: "en",
    text: "Today — scattered or more focused?",
    contexts: ["daily", "midday", "evening"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_energy_noise_en",
    language: "en",
    text: "Did energy or noise dominate today?",
    contexts: ["daily", "midday"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_attention_en",
    language: "en",
    text: "What pulled your attention apart today?",
    contexts: ["daily", "evening", "open"],
    phases: ["evening", "midday"]
  },
  {
    id: "lci_body_head_en",
    language: "en",
    text: "Is your body or your head more tired right now?",
    contexts: ["open", "daily"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_compare_en",
    language: "en",
    text: "Better, same, or heavier than before?",
    contexts: ["open"],
    phases: ["morning", "midday"]
  },
  {
    id: "lci_noise_en",
    language: "en",
    text: "Is the same noise still running in your head?",
    contexts: ["open", "overloaded"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_one_lane_en",
    language: "en",
    text: "Still on one lane, or scattered?",
    contexts: ["daily", "midday"],
    phases: ["midday"]
  },
  {
    id: "lci_focus_day_ro",
    language: "ro",
    text: "Azi — împrăștiere sau mai mult focus?",
    contexts: ["daily", "midday", "evening"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_energy_noise_ro",
    language: "ro",
    text: "Energia sau zgomotul a dominat azi?",
    contexts: ["daily", "midday"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_attention_ro",
    language: "ro",
    text: "Ce ți-a împrăștiat atenția azi?",
    contexts: ["daily", "evening", "open"],
    phases: ["evening", "midday"]
  },
  {
    id: "lci_body_head_ro",
    language: "ro",
    text: "Corpul sau capul e mai obosit acum?",
    contexts: ["open", "daily"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_compare_ro",
    language: "ro",
    text: "Mai bine, la fel, sau mai greu?",
    contexts: ["open"],
    phases: ["morning", "midday"]
  },
  {
    id: "lci_noise_ro",
    language: "ro",
    text: "Încă același zgomot în cap?",
    contexts: ["open", "overloaded"],
    phases: ["midday", "evening"]
  },
  {
    id: "lci_one_lane_ro",
    language: "ro",
    text: "Încă pe o bandă, sau împrăștiat?",
    contexts: ["daily", "midday"],
    phases: ["midday"]
  }
];

module.exports = { LIGHT_CHECK_INS };
