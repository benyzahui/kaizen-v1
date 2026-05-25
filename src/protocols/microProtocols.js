/**
 * Micro protocols — 1–4 short actions, instantly practical.
 */

const MICRO_PROTOCOLS = [
  {
    id: "mini_reset_hu",
    language: "hu",
    category: "stabilization",
    intensity: "low",
    phases: ["morning", "midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["stabilization", "recovery"],
    title: "🌊 Mini Reset",
    actions: ["víz", "5 lassú légzés", "állj fel", "egy feladat"]
  },
  {
    id: "mini_reset_en",
    language: "en",
    category: "stabilization",
    intensity: "low",
    phases: ["morning", "midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["stabilization", "recovery"],
    title: "🌊 Mini Reset",
    actions: ["water", "5 slow exhales", "stand up", "one task"]
  },
  {
    id: "mini_reset_ro",
    language: "ro",
    category: "stabilization",
    intensity: "low",
    phases: ["morning", "midday", "evening"],
    energy: ["low", "exhausted", "stable"],
    modes: ["stabilization", "recovery"],
    title: "🌊 Mini Reset",
    actions: ["apă", "5 expirații lente", "ridică-te", "un task"]
  },
  {
    id: "focus_lock_hu",
    language: "hu",
    category: "focus",
    intensity: "high",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"],
    title: "⚔ Focus Lock",
    actions: ["telefon lefelé", "25 perc", "egy sáv"]
  },
  {
    id: "focus_lock_en",
    language: "en",
    category: "focus",
    intensity: "high",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"],
    title: "⚔ Focus Lock",
    actions: ["phone face down", "25 minutes", "one lane"]
  },
  {
    id: "focus_lock_ro",
    language: "ro",
    category: "focus",
    intensity: "high",
    phases: ["morning", "midday"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"],
    title: "⚔ Focus Lock",
    actions: ["telefon cu fața în jos", "25 minute", "o bandă"]
  },
  {
    id: "evening_down_hu",
    language: "hu",
    category: "letting_go",
    intensity: "low",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization"],
    title: "🌘 Esti lecsengés",
    actions: ["kisebb fény", "lassabb légzés", "képernyő csökkentés"]
  },
  {
    id: "evening_down_en",
    language: "en",
    category: "letting_go",
    intensity: "low",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization"],
    title: "🌘 Evening Downshift",
    actions: ["dim the light", "slower breath", "less screen"]
  },
  {
    id: "evening_down_ro",
    language: "ro",
    category: "letting_go",
    intensity: "low",
    phases: ["evening", "late_night"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization"],
    title: "🌘 Coborâre seară",
    actions: ["lumină mai jos", "respirație mai lentă", "mai puțin ecran"]
  },
  {
    id: "overload_simple_hu",
    language: "hu",
    category: "overload",
    intensity: "low",
    phases: ["midday", "evening"],
    energy: ["low", "exhausted"],
    modes: ["stabilization", "recovery"],
    title: "🫀 Túlterhelés",
    actions: ["víz", "3 lassú kilélegzés", "egy nyitott kör zárása"]
  },
  {
    id: "overload_simple_en",
    language: "en",
    category: "overload",
    intensity: "low",
    phases: ["midday", "evening"],
    energy: ["low", "exhausted"],
    modes: ["stabilization", "recovery"],
    title: "🫀 Overload",
    actions: ["water", "3 slow exhales", "close one open loop"]
  },
  {
    id: "overload_simple_ro",
    language: "ro",
    category: "overload",
    intensity: "low",
    phases: ["midday", "evening"],
    energy: ["low", "exhausted"],
    modes: ["stabilization", "recovery"],
    title: "🫀 Suprasolicitare",
    actions: ["apă", "3 expirații lente", "închide o buclă deschisă"]
  },
  {
    id: "warrior_push_hu",
    language: "hu",
    category: "warrior",
    intensity: "high",
    phases: ["morning", "midday"],
    energy: ["high", "stable"],
    modes: ["warrior"],
    title: "⚔ Warrior blokk",
    actions: ["telefon távol", "45 perc", "egy cél — kész"]
  },
  {
    id: "warrior_push_en",
    language: "en",
    category: "warrior",
    intensity: "high",
    phases: ["morning", "midday"],
    energy: ["high", "stable"],
    modes: ["warrior"],
    title: "⚔ Warrior block",
    actions: ["phone away", "45 minutes", "one target — done"]
  },
  {
    id: "warrior_push_ro",
    language: "ro",
    category: "warrior",
    intensity: "high",
    phases: ["morning", "midday"],
    energy: ["high", "stable"],
    modes: ["warrior"],
    title: "⚔ Bloc warrior",
    actions: ["telefon departe", "45 minute", "un țintă — gata"]
  },
  {
    id: "movement_spark_hu",
    language: "hu",
    category: "movement",
    intensity: "medium",
    phases: ["morning", "midday"],
    energy: ["stable", "high", "low"],
    modes: ["discipline", "energy", "warrior"],
    title: "🔥 Mozgás szikra",
    actions: ["5 perc séta", "váll lazítás", "egy pohár víz"]
  },
  {
    id: "movement_spark_en",
    language: "en",
    category: "movement",
    intensity: "medium",
    phases: ["morning", "midday"],
    energy: ["stable", "high", "low"],
    modes: ["discipline", "energy", "warrior"],
    title: "🔥 Movement spark",
    actions: ["5 min walk", "shoulders down", "one glass of water"]
  },
  {
    id: "movement_spark_ro",
    language: "ro",
    category: "movement",
    intensity: "medium",
    phases: ["morning", "midday"],
    energy: ["stable", "high", "low"],
    modes: ["discipline", "energy", "warrior"],
    title: "🔥 Scânteie mișcare",
    actions: ["5 min mers", "umerii jos", "un pahar de apă"]
  }
];

/** Light micro touchpoints — not commands, just human nudges */
const MICRO_TOUCHES = [
  { id: "touch_water_hu", language: "hu", text: "🫀 Mikor ittál utoljára vizet?" },
  { id: "touch_water_en", language: "en", text: "🫀 When did you last drink water?" },
  { id: "touch_water_ro", language: "ro", text: "🫀 Când ai băut apă ultima dată?" },
  { id: "touch_loops_hu", language: "hu", text: "📉 Túl sok nyitott kör." },
  { id: "touch_loops_en", language: "en", text: "📉 Too many open loops." },
  { id: "touch_loops_ro", language: "ro", text: "📉 Prea multe bucle deschise." },
  { id: "touch_step_hu", language: "hu", text: "🌱 Egy stabil lépés is haladás." },
  { id: "touch_step_en", language: "en", text: "🌱 One stable step is still progress." },
  { id: "touch_step_ro", language: "ro", text: "🌱 Un pas stabil e tot progres." },
  { id: "touch_evening_hu", language: "hu", text: "🌘 Ma már nem kell tovább húzni." },
  { id: "touch_evening_en", language: "en", text: "🌘 You do not need to push further today." },
  { id: "touch_evening_ro", language: "ro", text: "🌘 Azi nu mai trebuie să împingi." },
  { id: "touch_breath_hu", language: "hu", text: "🌊 Öt lassú kilélegzés most." },
  { id: "touch_breath_en", language: "en", text: "🌊 Five slow exhales now." },
  { id: "touch_breath_ro", language: "ro", text: "🌊 Cinci expirații lente acum." }
];

module.exports = { MICRO_PROTOCOLS, MICRO_TOUCHES };
