/**
 * Mini recovery protocols — nervous system + body return.
 */

/** @type {Array<{ id: string, language: string, category: string, intensity: string, phases: string[], energy: string[], modes: string[], title: string, actions: string[] }>} */
const MINI_RECOVERY_PROTOCOLS = [
  {
    id: "rec_ns_hu",
    language: "hu",
    category: "recovery",
    intensity: "low",
    phases: ["morning", "midday", "evening", "late_night"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization", "rebuilding"],
    title: "🌊 Nervous System Reset",
    actions: ["lassabb légzés", "kisebb zaj", "víz", "5 perc séta"]
  },
  {
    id: "rec_ns_en",
    language: "en",
    category: "recovery",
    intensity: "low",
    phases: ["morning", "midday", "evening", "late_night"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization", "rebuilding"],
    title: "🌊 Nervous System Reset",
    actions: ["slower breathing", "less noise", "water", "5 minute walk"]
  },
  {
    id: "rec_ns_ro",
    language: "ro",
    category: "recovery",
    intensity: "low",
    phases: ["morning", "midday", "evening", "late_night"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization", "rebuilding"],
    title: "🌊 Nervous System Reset",
    actions: ["respirație mai lentă", "mai puțin zgomot", "apă", "5 min mers"]
  },
  {
    id: "rec_body_hu",
    language: "hu",
    category: "recovery",
    intensity: "low",
    phases: ["morning", "midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization", "rebuilding"],
    title: "🫀 Body Return",
    actions: ["könnyű mozgás", "váll mobilitás", "nyak lazítás", "test awareness"]
  },
  {
    id: "rec_body_en",
    language: "en",
    category: "recovery",
    intensity: "low",
    phases: ["morning", "midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization", "rebuilding"],
    title: "🫀 Body Return",
    actions: ["light movement", "shoulder mobility", "neck release", "body awareness"]
  },
  {
    id: "rec_body_ro",
    language: "ro",
    category: "recovery",
    intensity: "low",
    phases: ["morning", "midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization", "rebuilding"],
    title: "🫀 Body Return",
    actions: ["mișcare ușoară", "mobilitate umeri", "relaxare gât", "awareness corp"]
  },
  {
    id: "rec_breath_hu",
    language: "hu",
    category: "recovery",
    intensity: "low",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted"],
    modes: ["recovery", "rebuilding"],
    title: "🌊 Légzés + víz",
    actions: ["6 lassú kilélegzés", "egy pohár víz", "váll le", "nincs több feladat"]
  },
  {
    id: "rec_breath_en",
    language: "en",
    category: "recovery",
    intensity: "low",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted"],
    modes: ["recovery", "rebuilding"],
    title: "🌊 Breath + water",
    actions: ["6 slow exhales", "one glass of water", "shoulders down", "no more tasks"]
  },
  {
    id: "rec_breath_ro",
    language: "ro",
    category: "recovery",
    intensity: "low",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted"],
    modes: ["recovery", "rebuilding"],
    title: "🌊 Respirație + apă",
    actions: ["6 expirații lente", "un pahar de apă", "umeri jos", "fără taskuri noi"]
  }
];

module.exports = { MINI_RECOVERY_PROTOCOLS };
