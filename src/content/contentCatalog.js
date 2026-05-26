/**
 * Unified content catalog — single import point for daily pools.
 */

const { normalizeContentEntry } = require("./contentSchema");
const { buildPromptRows, buildProtocolTemplates } = require("./catalog/expansionHelpers");
const {
  STABILIZATION_ROWS,
  DISCIPLINE_ROWS,
  RECOVERY_ROWS,
  TRADING_ROWS,
  AWARENESS_EXTRA_ROWS,
  PROTOCOL_TEMPLATES
} = require("./catalog/expansionData");
const { EXPANDED_MANTRAS, totalExpandedCount } = require("../mantras/expandedPools");

const PATH_ALL = ["discipline", "energy", "stabilization", "warrior", "recovery", "trading"];

const PATH_BY_CATEGORY = {
  stabilization: ["stabilization", "recovery", "energy"],
  discipline: ["discipline", "warrior", "trading"],
  focus: ["discipline", "warrior", "trading"],
  recovery: ["recovery", "stabilization"],
  warrior: ["warrior", "discipline"],
  trading: ["trading"],
  overload: ["stabilization", "recovery"],
  letting_go: ["recovery", "stabilization"],
  movement: ["energy", "warrior", "discipline"],
  emotional_reset: ["recovery", "stabilization"],
  activation: ["discipline", "warrior", "energy"]
};

const TONE_BY_CATEGORY = {
  stabilization: "grounded",
  discipline: "focus",
  recovery: "release",
  trading: "calm",
  warrior: "warrior",
  overload: "safety",
  letting_go: "release",
  focus: "focus",
  movement: "grounded",
  emotional_reset: "calm",
  activation: "calm"
};

function enrichMantras() {
  return EXPANDED_MANTRAS.map((m) => {
    const energy =
      m.intensity === "low" ? ["exhausted", "low", "stable"] : ["stable", "high", "low"];
    return normalizeContentEntry({
      ...m,
      kind: "mantra",
      timeOfDay: m.phases,
      energy,
      energyState: energy,
      activePath: PATH_BY_CATEGORY[m.category] || PATH_ALL,
      modes: PATH_BY_CATEGORY[m.category] || PATH_ALL,
      emotionalTone: TONE_BY_CATEGORY[m.category] || "calm"
    });
  });
}

const CATEGORY_PROMPTS = {
  stabilization: buildPromptRows(STABILIZATION_ROWS, {
    category: "stabilization",
    emotionalTone: "grounded",
    intensity: "low",
    activePath: ["stabilization", "recovery", "energy"]
  }),
  discipline: buildPromptRows(DISCIPLINE_ROWS, {
    category: "discipline",
    emotionalTone: "focus",
    intensity: "medium",
    activePath: ["discipline", "warrior", "trading"]
  }),
  recovery: buildPromptRows(RECOVERY_ROWS, {
    category: "recovery",
    emotionalTone: "release",
    intensity: "low",
    timeOfDay: ["evening", "midday", "morning"],
    activePath: ["recovery", "stabilization"]
  }),
  trading: buildPromptRows(TRADING_ROWS, {
    category: "trading",
    emotionalTone: "calm",
    intensity: "medium",
    activePath: ["trading"]
  })
};

const EXPANDED_AWARENESS_RAW = buildPromptRows(AWARENESS_EXTRA_ROWS, {
  category: "awareness",
  emotionalTone: "awareness",
  intensity: "low",
  contexts: ["default", "drifting", "overloaded"]
});

const EXPANDED_AWARENESS = EXPANDED_AWARENESS_RAW.map((p) =>
  normalizeContentEntry({
    ...p,
    kind: "awareness",
    modes: p.activePath
  })
);

const EXPANDED_MICRO_PROTOCOLS = buildProtocolTemplates(PROTOCOL_TEMPLATES).map((p) =>
  normalizeContentEntry({
    ...p,
    kind: "micro_protocol",
    timeOfDay: p.phases,
    energyState: p.energy,
    activePath: p.modes,
    emotionalTone: p.emotionalTone || TONE_BY_CATEGORY[p.category] || "calm"
  })
);

const ALL_MANTRAS = enrichMantras();

/** Merged at module boundary in microProtocols / awarenessPrompts to avoid circular imports */
function mergeWithLegacy(legacy, expanded) {
  const map = new Map();
  for (const item of legacy) map.set(item.id, item);
  for (const item of expanded) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return [...map.values()];
}

function getCatalogStats(legacyMicro = [], legacyAwareness = []) {
  const micro = mergeWithLegacy(legacyMicro, EXPANDED_MICRO_PROTOCOLS);
  const awareness = mergeWithLegacy(legacyAwareness, EXPANDED_AWARENESS);
  return {
    mantras: ALL_MANTRAS.length,
    microProtocols: micro.length,
    awarenessPrompts: awareness.length,
    stabilizationPrompts: CATEGORY_PROMPTS.stabilization.length,
    disciplinePrompts: CATEGORY_PROMPTS.discipline.length,
    recoveryPrompts: CATEGORY_PROMPTS.recovery.length,
    tradingPrompts: CATEGORY_PROMPTS.trading.length,
    expandedMicroOnly: EXPANDED_MICRO_PROTOCOLS.length,
    expandedAwarenessOnly: EXPANDED_AWARENESS.length
  };
}

function getMantras(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return ALL_MANTRAS.filter((m) => m.language === locked);
}

function getMicroProtocols(lang, legacyMicro = []) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return mergeWithLegacy(legacyMicro, EXPANDED_MICRO_PROTOCOLS).filter(
    (p) => p.language === locked
  );
}

function getAwarenessPrompts(lang, legacyAwareness = []) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return mergeWithLegacy(legacyAwareness, EXPANDED_AWARENESS).filter(
    (p) => p.language === locked
  );
}

function getCategoryPrompts(category, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pool = CATEGORY_PROMPTS[category] || [];
  return pool.filter((p) => p.language === locked);
}

module.exports = {
  ALL_MANTRAS,
  EXPANDED_MICRO_PROTOCOLS,
  EXPANDED_AWARENESS,
  CATEGORY_PROMPTS,
  mergeWithLegacy,
  getCatalogStats,
  getMantras,
  getMicroProtocols,
  getAwarenessPrompts,
  getCategoryPrompts,
  totalExpandedCount
};
