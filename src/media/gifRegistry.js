/**
 * Safe GIF registry — brand-safe Dragon Blueprint animations only.
 * URLs via env or Telegram file_id. Skip silently when unset.
 */

const GIF_CATEGORIES = {
  welcome: ["dragon_awakening", "sunrise", "calm_fire"],
  morning: ["sunrise", "warrior_training", "dragon_energy"],
  discipline: ["samurai_focus", "training", "fire_discipline"],
  recovery: ["nature_calm", "water", "breathing", "meditation"],
  celebration: ["dragon", "victory", "progress", "achievement"],
  mirror: ["mirror", "irony", "reflection", "wake_up", "comeback"]
};

const BLOCKED_TAGS = ["meme", "politic", "sexual", "cringe", "violent", "cartoon"];

/** @type {Array<{ id: string, category: string, tags: string[], urlEnv: string }>} */
const GIF_REGISTRY = [
  { id: "welcome_dragon", category: "welcome", tags: ["dragon_awakening", "calm_fire"], urlEnv: "KAIZEN_GIF_WELCOME_DRAGON" },
  { id: "welcome_sunrise", category: "welcome", tags: ["sunrise"], urlEnv: "KAIZEN_GIF_WELCOME_SUNRISE" },
  { id: "morning_sunrise", category: "morning", tags: ["sunrise"], urlEnv: "KAIZEN_GIF_MORNING_SUNRISE" },
  { id: "morning_warrior", category: "morning", tags: ["warrior_training"], urlEnv: "KAIZEN_GIF_MORNING_WARRIOR" },
  { id: "morning_dragon", category: "morning", tags: ["dragon_energy", "dragon_awakening"], urlEnv: "KAIZEN_GIF_MORNING_DRAGON" },
  { id: "discipline_samurai", category: "discipline", tags: ["samurai_focus"], urlEnv: "KAIZEN_GIF_DISCIPLINE_SAMURAI" },
  { id: "discipline_train", category: "discipline", tags: ["training", "fire_discipline"], urlEnv: "KAIZEN_GIF_DISCIPLINE_TRAIN" },
  { id: "recovery_nature", category: "recovery", tags: ["nature_calm", "water"], urlEnv: "KAIZEN_GIF_RECOVERY_NATURE" },
  { id: "recovery_breath", category: "recovery", tags: ["breathing", "meditation"], urlEnv: "KAIZEN_GIF_RECOVERY_BREATH" },
  { id: "celebration_dragon", category: "celebration", tags: ["dragon", "victory"], urlEnv: "KAIZEN_GIF_CELEBRATION_DRAGON" },
  { id: "celebration_growth", category: "celebration", tags: ["progress", "achievement"], urlEnv: "KAIZEN_GIF_CELEBRATION_GROWTH" },
  { id: "mirror_wake", category: "mirror", tags: ["mirror", "wake_up", "irony"], urlEnv: "KAIZEN_GIF_MIRROR_WAKE" },
  { id: "mirror_lazy", category: "mirror", tags: ["mirror", "lazy_irony", "discipline"], urlEnv: "KAIZEN_GIF_MIRROR_LAZY" },
  { id: "mirror_phone", category: "mirror", tags: ["mirror", "phone_irony", "discipline"], urlEnv: "KAIZEN_GIF_MIRROR_PHONE" },
  { id: "mirror_comeback", category: "mirror", tags: ["mirror", "comeback", "warrior_training"], urlEnv: "KAIZEN_GIF_MIRROR_COMEBACK" },
  { id: "mirror_irony_humor", category: "mirror", tags: ["mirror", "irony_humor", "celebration"], urlEnv: "KAIZEN_GIF_MIRROR_HUMOR" },
  { id: "mirror_reflection", category: "mirror", tags: ["mirror", "reflection", "meditation"], urlEnv: "KAIZEN_GIF_MIRROR_REFLECTION" }
];

/**
 * @param {object} entry
 */
function resolveGifUrl(entry) {
  if (!entry?.urlEnv) return null;
  const specific = process.env[entry.urlEnv];
  if (specific) return specific;
  return process.env.KAIZEN_GIF_FALLBACK_URL || null;
}

/**
 * @param {string} category
 */
function getGifsByCategory(category) {
  return GIF_REGISTRY.filter((g) => g.category === category);
}

module.exports = {
  GIF_CATEGORIES,
  BLOCKED_TAGS,
  GIF_REGISTRY,
  resolveGifUrl,
  getGifsByCategory
};
