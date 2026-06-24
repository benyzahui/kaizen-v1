/**
 * Build Knowledge Core registry to target pool capacities.
 */

const {
  normalizeKnowledgeEntry,
  KNOWLEDGE_CATEGORIES,
  ENERGY_STATES
} = require("./knowledgeSchema");
const {
  MORNING_MANTRA_SEEDS,
  MIDDAY_MANTRA_SEEDS,
  EVENING_MANTRA_SEEDS,
  DRAGON_QUOTE_SEEDS,
  LOW_ENERGY_PROTOCOL_SEEDS,
  HIGH_ENERGY_PROTOCOL_SEEDS,
  REFLECTION_SEEDS,
  MICRO_CHALLENGE_SEEDS
} = require("./dragonBlueprintSeeds");

const TARGET_COUNTS = {
  morning_mantra: 100,
  midday_mantra: 100,
  evening_mantra: 100,
  dragon_quote: 100,
  low_energy_protocol: 50,
  high_energy_protocol: 50,
  reflection: 50,
  micro_challenge: 50
};

/**
 * @param {Array<object>} seeds
 * @param {number} targetCount
 * @param {string} idPrefix
 * @param {object} defaults
 */
function expandKnowledgePool(seeds, targetCount, idPrefix, defaults = {}) {
  if (!seeds?.length) return [];
  const out = [];
  for (let i = 0; i < targetCount; i++) {
    const seed = seeds[i % seeds.length];
    const entry = normalizeKnowledgeEntry({
      id: `${idPrefix}_${String(i + 1).padStart(3, "0")}`,
      category: defaults.category,
      phase: defaults.phase,
      timeOfDay: defaults.timeOfDay,
      level: seed.level || defaults.level || ["beginner", "intermediate", "advanced"],
      energy_state: seed.energy_state || defaults.energy_state || ENERGY_STATES,
      tags: [...(defaults.tags || []), ...(seed.tags || [])],
      pillar: seed.pillar || defaults.pillar || null,
      intensity: seed.intensity || defaults.intensity || "medium",
      en: seed.en,
      hu: seed.hu,
      ro: seed.ro,
      actions: seed.actions || null
    });
    out.push(entry);
  }
  return out;
}

function buildKnowledgeRegistry() {
  const morning = expandKnowledgePool(
    MORNING_MANTRA_SEEDS,
    TARGET_COUNTS.morning_mantra,
    "morning",
    {
      category: KNOWLEDGE_CATEGORIES.MORNING_MANTRA,
      phase: "morning_activation",
      timeOfDay: ["morning"]
    }
  );

  const midday = expandKnowledgePool(
    MIDDAY_MANTRA_SEEDS,
    TARGET_COUNTS.midday_mantra,
    "midday",
    {
      category: KNOWLEDGE_CATEGORIES.MIDDAY_MANTRA,
      phase: "midday_stabilization",
      timeOfDay: ["midday"]
    }
  );

  const evening = expandKnowledgePool(
    EVENING_MANTRA_SEEDS,
    TARGET_COUNTS.evening_mantra,
    "evening",
    {
      category: KNOWLEDGE_CATEGORIES.EVENING_MANTRA,
      phase: "evening_reset",
      timeOfDay: ["evening", "late_night"]
    }
  );

  const quotes = expandKnowledgePool(
    DRAGON_QUOTE_SEEDS,
    TARGET_COUNTS.dragon_quote,
    "dragon",
    {
      category: KNOWLEDGE_CATEGORIES.DRAGON_QUOTE,
      phase: "midday_stabilization",
      timeOfDay: ["morning", "midday", "evening"]
    }
  );

  const lowProtocols = expandKnowledgePool(
    LOW_ENERGY_PROTOCOL_SEEDS,
    TARGET_COUNTS.low_energy_protocol,
    "low_proto",
    {
      category: KNOWLEDGE_CATEGORIES.LOW_ENERGY_PROTOCOL,
      phase: "midday_stabilization",
      timeOfDay: ["morning", "midday", "evening"],
      energy_state: ["low", "exhausted"],
      intensity: "low"
    }
  );

  const highProtocols = expandKnowledgePool(
    HIGH_ENERGY_PROTOCOL_SEEDS,
    TARGET_COUNTS.high_energy_protocol,
    "high_proto",
    {
      category: KNOWLEDGE_CATEGORIES.HIGH_ENERGY_PROTOCOL,
      phase: "morning_activation",
      timeOfDay: ["morning", "midday"],
      energy_state: ["high", "stable"],
      intensity: "high"
    }
  );

  const reflections = expandKnowledgePool(
    REFLECTION_SEEDS,
    TARGET_COUNTS.reflection,
    "reflection",
    {
      category: KNOWLEDGE_CATEGORIES.REFLECTION,
      phase: "evening_reset",
      timeOfDay: ["evening", "midday"]
    }
  );

  const challenges = expandKnowledgePool(
    MICRO_CHALLENGE_SEEDS,
    TARGET_COUNTS.micro_challenge,
    "challenge",
    {
      category: KNOWLEDGE_CATEGORIES.MICRO_CHALLENGE,
      phase: "midday_stabilization",
      timeOfDay: ["morning", "midday", "evening"]
    }
  );

  return [
    ...morning,
    ...midday,
    ...evening,
    ...quotes,
    ...lowProtocols,
    ...highProtocols,
    ...reflections,
    ...challenges
  ];
}

module.exports = {
  TARGET_COUNTS,
  expandKnowledgePool,
  buildKnowledgeRegistry
};
