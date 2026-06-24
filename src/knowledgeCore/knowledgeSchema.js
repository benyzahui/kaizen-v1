/**
 * KaiZen Knowledge Core — unified trilingual entry schema (Dragon Blueprint).
 */

const KNOWLEDGE_CATEGORIES = {
  MORNING_MANTRA: "morning_mantra",
  MIDDAY_MANTRA: "midday_mantra",
  EVENING_MANTRA: "evening_mantra",
  DRAGON_QUOTE: "dragon_quote",
  LOW_ENERGY_PROTOCOL: "low_energy_protocol",
  HIGH_ENERGY_PROTOCOL: "high_energy_protocol",
  REFLECTION: "reflection",
  MICRO_CHALLENGE: "micro_challenge"
};

const KNOWLEDGE_PHASES = {
  morning_activation: "morning",
  midday_stabilization: "midday",
  evening_reset: "evening"
};

const USER_LEVELS = ["beginner", "intermediate", "advanced"];
const ENERGY_STATES = ["low", "stable", "high", "overstimulated", "exhausted"];

const DRAGON_PILLARS = [
  "energy_awareness",
  "hydration",
  "movement",
  "breathwork",
  "discipline",
  "recovery",
  "fasting_awareness",
  "digital_control",
  "emotional_stability",
  "evening_release"
];

/**
 * @param {object} raw
 */
function normalizeKnowledgeEntry(raw) {
  const phaseKey = raw.phase || "morning_activation";
  const timeOfDay =
    raw.timeOfDay ||
    (KNOWLEDGE_PHASES[phaseKey] ? [KNOWLEDGE_PHASES[phaseKey]] : ["morning", "midday", "evening"]);

  return {
    id: raw.id,
    category: raw.category,
    phase: phaseKey,
    level: raw.level || USER_LEVELS,
    energy_state: raw.energy_state || ENERGY_STATES,
    tags: raw.tags || [],
    pillar: raw.pillar || null,
    en: raw.en || "",
    hu: raw.hu || "",
    ro: raw.ro || "",
    actions: raw.actions || null,
    intensity: raw.intensity || "medium",
    timeOfDay
  };
}

/**
 * @param {object} entry
 * @param {object} ctx
 * @param {'morning'|'midday'|'evening'|'late_night'} phase
 */
function knowledgeMatches(entry, ctx, phase) {
  const slot = phase === "late_night" ? "evening" : phase;
  if (!entry.timeOfDay?.includes(slot)) return false;

  const energy = ctx.energyState || "stable";
  if (entry.energy_state?.length && !entry.energy_state.includes(energy)) {
    if (
      energy === "overstimulated" &&
      (entry.energy_state.includes("high") || entry.energy_state.includes("stable"))
    ) {
      // overstimulated may use calm-high stabilization entries
    } else if (!entry.energy_state.includes("stable")) {
      return false;
    }
  }

  if (energy === "overstimulated" && entry.tags?.includes("warrior_push")) return false;
  if (energy === "exhausted" && entry.intensity === "high") return false;

  const level = ctx.protocolLevel || "beginner";
  if (entry.level?.length && !entry.level.includes(level)) {
    if (level === "advanced" && entry.level.includes("intermediate")) return true;
    if (level === "intermediate" && entry.level.includes("beginner")) return true;
    if (!entry.level.includes(level)) return false;
  }

  return true;
}

/**
 * @param {object} entry
 * @param {'en'|'hu'|'ro'} lang
 */
function knowledgeText(entry, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return entry[locked] || entry.en || "";
}

module.exports = {
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_PHASES,
  USER_LEVELS,
  ENERGY_STATES,
  DRAGON_PILLARS,
  normalizeKnowledgeEntry,
  knowledgeMatches,
  knowledgeText
};
