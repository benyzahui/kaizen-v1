/**
 * Self-awareness prompts — contextual, light, not therapy.
 */

const PROMPT_CATEGORIES = [
  "body_mind",
  "focus",
  "rest",
  "control",
  "trading",
  "nervous_system"
];

const LEGACY_AWARENESS_PROMPTS = [
  {
    id: "aw_body_mind_hu",
    language: "hu",
    category: "body_mind",
    energy: ["low", "exhausted", "stable"],
    phases: ["midday", "evening"],
    contexts: ["default"],
    text: "Most a tested vagy az agyad fáradtabb?"
  },
  {
    id: "aw_body_mind_en",
    language: "en",
    category: "body_mind",
    energy: ["low", "exhausted", "stable"],
    phases: ["midday", "evening"],
    contexts: ["default"],
    text: "Is your body tired, or is your mind tired first?"
  },
  {
    id: "aw_body_mind_ro",
    language: "ro",
    category: "body_mind",
    energy: ["low", "exhausted", "stable"],
    phases: ["midday", "evening"],
    contexts: ["default"],
    text: "Corpul e obosit sau mintea obosește prima?"
  },
  {
    id: "aw_focus_hu",
    language: "hu",
    category: "focus",
    energy: ["stable", "high", "low"],
    phases: ["midday"],
    contexts: ["drifting", "default"],
    text: "Mi viszi el ma a fókuszod?"
  },
  {
    id: "aw_focus_en",
    language: "en",
    category: "focus",
    energy: ["stable", "high", "low"],
    phases: ["midday"],
    contexts: ["drifting", "default"],
    text: "What is pulling your focus away today?"
  },
  {
    id: "aw_focus_ro",
    language: "ro",
    category: "focus",
    energy: ["stable", "high", "low"],
    phases: ["midday"],
    contexts: ["drifting", "default"],
    text: "Ce îți fură focusul azi?"
  },
  {
    id: "aw_rest_hu",
    language: "hu",
    category: "rest",
    energy: ["exhausted", "low", "stable"],
    phases: ["evening"],
    contexts: ["default"],
    text: "Valóban pihentél ma?"
  },
  {
    id: "aw_rest_en",
    language: "en",
    category: "rest",
    energy: ["exhausted", "low", "stable"],
    phases: ["evening"],
    contexts: ["default"],
    text: "Did you actually rest today?"
  },
  {
    id: "aw_rest_ro",
    language: "ro",
    category: "rest",
    energy: ["exhausted", "low", "stable"],
    phases: ["evening"],
    contexts: ["default"],
    text: "Chiar te-ai odihnit azi?"
  },
  {
    id: "aw_control_hu",
    language: "hu",
    category: "control",
    energy: ["stable", "high"],
    phases: ["midday", "evening"],
    contexts: ["overloaded", "default"],
    text: "Mit próbálsz egyszerre túl sokáig kontrollálni?"
  },
  {
    id: "aw_control_en",
    language: "en",
    category: "control",
    energy: ["stable", "high"],
    phases: ["midday", "evening"],
    contexts: ["overloaded", "default"],
    text: "What are you trying to control for too long at once?"
  },
  {
    id: "aw_control_ro",
    language: "ro",
    category: "control",
    energy: ["stable", "high"],
    phases: ["midday", "evening"],
    contexts: ["overloaded", "default"],
    text: "Ce încerci să controlezi prea mult timp deodată?"
  },
  {
    id: "aw_trade_calm_hu",
    language: "hu",
    category: "trading",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    contexts: ["trading"],
    text: "📉 Nyugodt vagy vagy bizonyítani akarsz?"
  },
  {
    id: "aw_trade_calm_en",
    language: "en",
    category: "trading",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    contexts: ["trading"],
    text: "📉 Are you calm — or trying to prove something?"
  },
  {
    id: "aw_trade_calm_ro",
    language: "ro",
    category: "trading",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    contexts: ["trading"],
    text: "📉 Ești calm — sau vrei să demonstrezi ceva?"
  },
  {
    id: "aw_trade_setup_hu",
    language: "hu",
    category: "trading",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["midday"],
    contexts: ["trading"],
    text: "⚔ Van setup vagy csak impulse?"
  },
  {
    id: "aw_trade_setup_en",
    language: "en",
    category: "trading",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["midday"],
    contexts: ["trading"],
    text: "⚔ Is there a setup — or just impulse?"
  },
  {
    id: "aw_trade_setup_ro",
    language: "ro",
    category: "trading",
    energy: ["stable", "high"],
    modes: ["trading"],
    phases: ["midday"],
    contexts: ["trading"],
    text: "⚔ Există setup — sau doar impuls?"
  },
  {
    id: "aw_trade_body_hu",
    language: "hu",
    category: "trading",
    energy: ["stable", "high", "low"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    contexts: ["trading", "overloaded"],
    text: "🌊 A tested feszült trade előtt?"
  },
  {
    id: "aw_trade_body_en",
    language: "en",
    category: "trading",
    energy: ["stable", "high", "low"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    contexts: ["trading", "overloaded"],
    text: "🌊 Is your body tense before the trade?"
  },
  {
    id: "aw_trade_body_ro",
    language: "ro",
    category: "trading",
    energy: ["stable", "high", "low"],
    modes: ["trading"],
    phases: ["morning", "midday"],
    contexts: ["trading", "overloaded"],
    text: "🌊 Corpul e tensionat înainte de trade?"
  },
  {
    id: "aw_ns_hu",
    language: "hu",
    category: "nervous_system",
    energy: ["low", "exhausted"],
    phases: ["midday", "evening"],
    contexts: ["overloaded"],
    text: "🫀 A légzésed sekély most?"
  },
  {
    id: "aw_ns_en",
    language: "en",
    category: "nervous_system",
    energy: ["low", "exhausted"],
    phases: ["midday", "evening"],
    contexts: ["overloaded"],
    text: "🫀 Is your breath shallow right now?"
  },
  {
    id: "aw_ns_ro",
    language: "ro",
    category: "nervous_system",
    energy: ["low", "exhausted"],
    phases: ["midday", "evening"],
    contexts: ["overloaded"],
    text: "🫀 Respirația e superficială acum?"
  }
];

const {
  mergeWithLegacy,
  EXPANDED_AWARENESS
} = require("../content/contentCatalog");

const AWARENESS_PROMPTS = mergeWithLegacy(LEGACY_AWARENESS_PROMPTS, EXPANDED_AWARENESS);

module.exports = { PROMPT_CATEGORIES, AWARENESS_PROMPTS, LEGACY_AWARENESS_PROMPTS };
