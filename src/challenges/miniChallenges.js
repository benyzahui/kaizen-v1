/**
 * Mini challenges — tiny actions, low intensity, no productivity theater.
 */

const CATEGORIES = [
  "discipline",
  "focus",
  "nervous_system",
  "body",
  "digital_detox",
  "awareness",
  "recovery",
  "trading_discipline"
];

const MINI_CHALLENGES = [
  {
    id: "ch_disc_phone_hu",
    language: "hu",
    category: "discipline",
    intensity: "medium",
    energy: ["stable", "high"],
    phases: ["morning", "midday"],
    text: "⚔ 25 perc telefon nélkül."
  },
  {
    id: "ch_disc_phone_en",
    language: "en",
    category: "discipline",
    intensity: "medium",
    energy: ["stable", "high"],
    phases: ["morning", "midday"],
    text: "⚔ 25 minutes without your phone."
  },
  {
    id: "ch_disc_phone_ro",
    language: "ro",
    category: "discipline",
    intensity: "medium",
    energy: ["stable", "high"],
    phases: ["morning", "midday"],
    text: "⚔ 25 minute fără telefon."
  },
  {
    id: "ch_focus_lane_hu",
    language: "hu",
    category: "focus",
    intensity: "medium",
    energy: ["stable", "high"],
    phases: ["morning", "midday"],
    text: "⚔ Egy sáv — 25 perc, egy feladat."
  },
  {
    id: "ch_focus_lane_en",
    language: "en",
    category: "focus",
    intensity: "medium",
    energy: ["stable", "high"],
    phases: ["morning", "midday"],
    text: "⚔ One lane — 25 minutes, one task."
  },
  {
    id: "ch_focus_lane_ro",
    language: "ro",
    category: "focus",
    intensity: "medium",
    energy: ["stable", "high"],
    phases: ["morning", "midday"],
    text: "⚔ O bandă — 25 minute, un task."
  },
  {
    id: "ch_ns_silence_hu",
    language: "hu",
    category: "nervous_system",
    intensity: "low",
    energy: ["low", "exhausted", "stable"],
    phases: ["midday", "evening"],
    text: "🌊 10 perc csend háttérzaj nélkül."
  },
  {
    id: "ch_ns_silence_en",
    language: "en",
    category: "nervous_system",
    intensity: "low",
    energy: ["low", "exhausted", "stable"],
    phases: ["midday", "evening"],
    text: "🌊 10 minutes quiet — no background noise."
  },
  {
    id: "ch_ns_silence_ro",
    language: "ro",
    category: "nervous_system",
    intensity: "low",
    energy: ["low", "exhausted", "stable"],
    phases: ["midday", "evening"],
    text: "🌊 10 minute liniște — fără zgomot de fundal."
  },
  {
    id: "ch_body_water_hu",
    language: "hu",
    category: "body",
    intensity: "low",
    energy: ["low", "exhausted", "stable", "high"],
    phases: ["morning", "midday", "evening"],
    text: "🫀 Igyál még 1 liter vizet ma."
  },
  {
    id: "ch_body_water_en",
    language: "en",
    category: "body",
    intensity: "low",
    energy: ["low", "exhausted", "stable", "high"],
    phases: ["morning", "midday", "evening"],
    text: "🫀 Drink another liter of water today."
  },
  {
    id: "ch_body_water_ro",
    language: "ro",
    category: "body",
    intensity: "low",
    energy: ["low", "exhausted", "stable", "high"],
    phases: ["morning", "midday", "evening"],
    text: "🫀 Mai bea 1 litru de apă azi."
  },
  {
    id: "ch_body_walk_hu",
    language: "hu",
    category: "body",
    intensity: "low",
    energy: ["low", "stable"],
    phases: ["midday"],
    text: "🫀 5 perc séta — most."
  },
  {
    id: "ch_body_walk_en",
    language: "en",
    category: "body",
    intensity: "low",
    energy: ["low", "stable"],
    phases: ["midday"],
    text: "🫀 5 minute walk — now."
  },
  {
    id: "ch_body_walk_ro",
    language: "ro",
    category: "body",
    intensity: "low",
    energy: ["low", "stable"],
    phases: ["midday"],
    text: "🫀 5 minute de mers — acum."
  },
  {
    id: "ch_detox_screen_hu",
    language: "hu",
    category: "digital_detox",
    intensity: "low",
    energy: ["low", "exhausted", "stable"],
    phases: ["evening"],
    text: "🌘 30 perc képernyő nélkül alvás előtt."
  },
  {
    id: "ch_detox_screen_en",
    language: "en",
    category: "digital_detox",
    intensity: "low",
    energy: ["low", "exhausted", "stable"],
    phases: ["evening"],
    text: "🌘 30 minutes without screen before sleep."
  },
  {
    id: "ch_detox_screen_ro",
    language: "ro",
    category: "digital_detox",
    intensity: "low",
    energy: ["low", "exhausted", "stable"],
    phases: ["evening"],
    text: "🌘 30 minute fără ecran înainte de somn."
  },
  {
    id: "ch_aware_breath_hu",
    language: "hu",
    category: "awareness",
    intensity: "low",
    energy: ["low", "exhausted", "stable", "high"],
    phases: ["morning", "midday", "evening"],
    text: "🌱 5 lassú kilélegzés — csak figyeld."
  },
  {
    id: "ch_aware_breath_en",
    language: "en",
    category: "awareness",
    intensity: "low",
    energy: ["low", "exhausted", "stable", "high"],
    phases: ["morning", "midday", "evening"],
    text: "🌱 5 slow exhales — just notice."
  },
  {
    id: "ch_aware_breath_ro",
    language: "ro",
    category: "awareness",
    intensity: "low",
    energy: ["low", "exhausted", "stable", "high"],
    phases: ["morning", "midday", "evening"],
    text: "🌱 5 expirații lente — doar observă."
  },
  {
    id: "ch_rec_rest_hu",
    language: "hu",
    category: "recovery",
    intensity: "low",
    energy: ["exhausted", "low"],
    phases: ["evening"],
    text: "🌘 20 perc pihenő — nincs új feladat."
  },
  {
    id: "ch_rec_rest_en",
    language: "en",
    category: "recovery",
    intensity: "low",
    energy: ["exhausted", "low"],
    phases: ["evening"],
    text: "🌘 20 minutes rest — no new tasks."
  },
  {
    id: "ch_rec_rest_ro",
    language: "ro",
    category: "recovery",
    intensity: "low",
    energy: ["exhausted", "low"],
    phases: ["evening"],
    text: "🌘 20 minute odihnă — fără taskuri noi."
  },
  {
    id: "ch_trade_rules_hu",
    language: "hu",
    category: "trading_discipline",
    intensity: "medium",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    text: "📉 Írd le a szabályt, mielőtt belépsz."
  },
  {
    id: "ch_trade_rules_en",
    language: "en",
    category: "trading_discipline",
    intensity: "medium",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    text: "📉 Write the rule before you enter."
  },
  {
    id: "ch_trade_rules_ro",
    language: "ro",
    category: "trading_discipline",
    intensity: "medium",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    text: "📉 Scrie regula înainte să intri."
  },
  {
    id: "ch_rec_hydrate_hu",
    language: "hu",
    category: "recovery",
    intensity: "low",
    energy: ["exhausted", "low"],
    phases: ["morning", "midday"],
    text: "🫀 Egy pohár víz — lassan."
  },
  {
    id: "ch_rec_hydrate_en",
    language: "en",
    category: "recovery",
    intensity: "low",
    energy: ["exhausted", "low"],
    phases: ["morning", "midday"],
    text: "🫀 One glass of water — slowly."
  },
  {
    id: "ch_rec_hydrate_ro",
    language: "ro",
    category: "recovery",
    intensity: "low",
    energy: ["exhausted", "low"],
    phases: ["morning", "midday"],
    text: "🫀 Un pahar de apă — încet."
  }
];

module.exports = { CATEGORIES, MINI_CHALLENGES };
