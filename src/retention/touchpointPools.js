/**
 * Micro touchpoints — optional, low-pressure nudges (HU / EN / RO).
 */

const TOUCHPOINT_KINDS = [
  "hydration",
  "focus_block",
  "evening_slow",
  "stable_step",
  "breath",
  "loops",
  "grounding"
];

/** @type {Array<{ id: string, language: string, text: string, kind: string, phases: string[], energy?: string[], intensity?: string }>} */
const RETENTION_TOUCHPOINTS = [
  { id: "tp_water_hu", language: "hu", text: "🫀 Víz?", kind: "hydration", phases: ["morning", "midday"], energy: ["stable", "low", "high"] },
  { id: "tp_water_hu2", language: "hu", text: "🫀 Mikor ittál utoljára vizet?", kind: "hydration", phases: ["midday", "evening"], energy: ["stable", "low", "exhausted"] },
  { id: "tp_water_en", language: "en", text: "🫀 Water?", kind: "hydration", phases: ["morning", "midday"], energy: ["stable", "low", "high"] },
  { id: "tp_water_en2", language: "en", text: "🫀 When did you last drink water?", kind: "hydration", phases: ["midday", "evening"], energy: ["stable", "low", "exhausted"] },
  { id: "tp_water_ro", language: "ro", text: "🫀 Apă?", kind: "hydration", phases: ["morning", "midday"], energy: ["stable", "low", "high"] },
  { id: "tp_water_ro2", language: "ro", text: "🫀 Când ai băut apă ultima dată?", kind: "hydration", phases: ["midday", "evening"], energy: ["stable", "low", "exhausted"] },

  { id: "tp_block_hu", language: "hu", text: "⚔ Még egy tiszta blokk?", kind: "focus_block", phases: ["morning", "midday"], energy: ["stable", "high"] },
  { id: "tp_block_hu2", language: "hu", text: "⚔ Egy sáv — teljes jelenlét.", kind: "focus_block", phases: ["midday"], energy: ["stable", "high"] },
  { id: "tp_block_en", language: "en", text: "⚔ One more clean block?", kind: "focus_block", phases: ["morning", "midday"], energy: ["stable", "high"] },
  { id: "tp_block_en2", language: "en", text: "⚔ One lane — full presence.", kind: "focus_block", phases: ["midday"], energy: ["stable", "high"] },
  { id: "tp_block_ro", language: "ro", text: "⚔ Încă un bloc curat?", kind: "focus_block", phases: ["morning", "midday"], energy: ["stable", "high"] },
  { id: "tp_block_ro2", language: "ro", text: "⚔ O bandă — prezență totală.", kind: "focus_block", phases: ["midday"], energy: ["stable", "high"] },

  { id: "tp_evening_hu", language: "hu", text: "🌘 Lassulj le estére.", kind: "evening_slow", phases: ["evening", "late_night"], energy: ["stable", "low", "exhausted", "high"] },
  { id: "tp_evening_hu2", language: "hu", text: "🌘 Ma már nem kell tovább húzni.", kind: "evening_slow", phases: ["evening", "late_night"], energy: ["stable", "low", "exhausted"] },
  { id: "tp_evening_en", language: "en", text: "🌘 Slow down for tonight.", kind: "evening_slow", phases: ["evening", "late_night"], energy: ["stable", "low", "exhausted", "high"] },
  { id: "tp_evening_en2", language: "en", text: "🌘 You do not need to push further today.", kind: "evening_slow", phases: ["evening", "late_night"], energy: ["stable", "low", "exhausted"] },
  { id: "tp_evening_ro", language: "ro", text: "🌘 Încetinește spre seară.", kind: "evening_slow", phases: ["evening", "late_night"], energy: ["stable", "low", "exhausted", "high"] },
  { id: "tp_evening_ro2", language: "ro", text: "🌘 Azi nu mai trebuie să împingi.", kind: "evening_slow", phases: ["evening", "late_night"], energy: ["stable", "low", "exhausted"] },

  { id: "tp_step_hu", language: "hu", text: "🌱 Egy stabil lépés is haladás.", kind: "stable_step", phases: ["morning", "midday", "evening"], energy: ["low", "exhausted", "stable"] },
  { id: "tp_step_en", language: "en", text: "🌱 One stable step is still progress.", kind: "stable_step", phases: ["morning", "midday", "evening"], energy: ["low", "exhausted", "stable"] },
  { id: "tp_step_ro", language: "ro", text: "🌱 Un pas stabil e tot progres.", kind: "stable_step", phases: ["morning", "midday", "evening"], energy: ["low", "exhausted", "stable"] },

  { id: "tp_breath_hu", language: "hu", text: "🌊 Öt lassú kilélegzés most.", kind: "breath", phases: ["midday", "evening", "late_night"], energy: ["low", "exhausted", "stable"] },
  { id: "tp_breath_en", language: "en", text: "🌊 Five slow exhales now.", kind: "breath", phases: ["midday", "evening", "late_night"], energy: ["low", "exhausted", "stable"] },
  { id: "tp_breath_ro", language: "ro", text: "🌊 Cinci expirații lente acum.", kind: "breath", phases: ["midday", "evening", "late_night"], energy: ["low", "exhausted", "stable"] },

  { id: "tp_loops_hu", language: "hu", text: "📉 Túl sok nyitott kör.", kind: "loops", phases: ["midday"], energy: ["stable", "high"] },
  { id: "tp_loops_en", language: "en", text: "📉 Too many open loops.", kind: "loops", phases: ["midday"], energy: ["stable", "high"] },
  { id: "tp_loops_ro", language: "ro", text: "📉 Prea multe bucle deschise.", kind: "loops", phases: ["midday"], energy: ["stable", "high"] },

  { id: "tp_ground_hu", language: "hu", text: "🫀 Egy lassú belélegzés — aztán egy irány.", kind: "grounding", phases: ["morning", "midday"], energy: ["low", "exhausted", "stable"] },
  { id: "tp_ground_en", language: "en", text: "🫀 One slow inhale — then one direction.", kind: "grounding", phases: ["morning", "midday"], energy: ["low", "exhausted", "stable"] },
  { id: "tp_ground_ro", language: "ro", text: "🫀 O inspirație lentă — apoi o direcție.", kind: "grounding", phases: ["morning", "midday"], energy: ["low", "exhausted", "stable"] },

  { id: "tp_shoulder_hu", language: "hu", text: "🫀 Vállak le — egy perc csend.", kind: "grounding", phases: ["evening"], energy: ["stable", "low", "exhausted"] },
  { id: "tp_shoulder_en", language: "en", text: "🫀 Shoulders down — one minute quiet.", kind: "grounding", phases: ["evening"], energy: ["stable", "low", "exhausted"] },
  { id: "tp_shoulder_ro", language: "ro", text: "🫀 Umerii jos — un minut liniște.", kind: "grounding", phases: ["evening"], energy: ["stable", "low", "exhausted"] }
];

module.exports = {
  TOUCHPOINT_KINDS,
  RETENTION_TOUCHPOINTS
};
