/**
 * GIF catalog — integration points (URLs or Telegram file_id via env).
 * Categories: morning, discipline, recovery, celebration.
 * Never: memes, cringe, politics, sexual.
 */

/** @type {Array<{ id: string, category: string, tags: string[], urlEnv: string, description: string }>} */
const GIF_CATALOG = [
  { id: "morning_sunrise", category: "morning", tags: ["sunrise", "morning"], urlEnv: "KAIZEN_GIF_MORNING_SUNRISE", description: "sunrise" },
  { id: "morning_warrior", category: "morning", tags: ["warrior", "training"], urlEnv: "KAIZEN_GIF_MORNING_WARRIOR", description: "warrior training" },
  { id: "morning_dragon", category: "morning", tags: ["dragon", "awakening"], urlEnv: "KAIZEN_GIF_MORNING_DRAGON", description: "dragon awakening" },
  { id: "discipline_samurai", category: "discipline", tags: ["samurai", "focus"], urlEnv: "KAIZEN_GIF_DISCIPLINE_SAMURAI", description: "samurai focus" },
  { id: "discipline_training", category: "discipline", tags: ["training", "work"], urlEnv: "KAIZEN_GIF_DISCIPLINE_TRAIN", description: "training" },
  { id: "recovery_nature", category: "recovery", tags: ["nature", "water"], urlEnv: "KAIZEN_GIF_RECOVERY_NATURE", description: "nature water" },
  { id: "recovery_breath", category: "recovery", tags: ["breathing", "meditation"], urlEnv: "KAIZEN_GIF_RECOVERY_BREATH", description: "breathing meditation" },
  { id: "celebration_dragon", category: "celebration", tags: ["dragon", "victory"], urlEnv: "KAIZEN_GIF_CELEBRATION_DRAGON", description: "dragon victory" },
  { id: "celebration_growth", category: "celebration", tags: ["growth", "achievement"], urlEnv: "KAIZEN_GIF_CELEBRATION_GROWTH", description: "growth achievement" }
];

const BLOCKED_GIF_TAGS = ["meme", "politic", "sexual", "cringe"];

/**
 * @param {object} entry
 */
function resolveGifUrl(entry) {
  if (!entry?.urlEnv) return null;
  return process.env[entry.urlEnv] || null;
}

/**
 * @param {string} category
 * @param {string} [energyState]
 */
function pickGifForCategory(category, energyState) {
  let pool = GIF_CATALOG.filter((g) => g.category === category);
  if (energyState === "exhausted" || energyState === "low") {
    pool = GIF_CATALOG.filter((g) => g.category === "recovery");
  }
  if (energyState === "high") {
    pool = GIF_CATALOG.filter((g) => g.category === "discipline" || g.category === "celebration");
  }
  if (!pool.length) return null;
  for (const entry of pool) {
    const url = resolveGifUrl(entry);
    if (url) return { ...entry, url };
  }
  return null;
}

module.exports = {
  GIF_CATALOG,
  BLOCKED_GIF_TAGS,
  resolveGifUrl,
  pickGifForCategory
};
