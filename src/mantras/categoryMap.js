/**
 * Mantra category → context mapping for adaptive delivery.
 */

const CATEGORIES = [
  "activation",
  "discipline",
  "stabilization",
  "overload",
  "recovery",
  "focus",
  "warrior",
  "emotional_reset",
  "fasting",
  "movement",
  "silence",
  "trading",
  "letting_go"
];

/** @type {Record<string, { phases: string[], tags: string[], energy: string[], modes: string[] }>} */
const CATEGORY_META = {
  activation: {
    phases: ["morning"],
    tags: ["activation", "discipline", "focus"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "energy"]
  },
  discipline: {
    phases: ["morning", "midday"],
    tags: ["discipline", "focus"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"]
  },
  stabilization: {
    phases: ["midday", "morning"],
    tags: ["stabilization", "let_go"],
    energy: ["stable", "low", "exhausted"],
    modes: ["stabilization", "recovery"]
  },
  overload: {
    phases: ["midday", "evening"],
    tags: ["stabilization", "let_go"],
    energy: ["low", "exhausted"],
    modes: ["stabilization", "recovery"]
  },
  recovery: {
    phases: ["evening", "late_night"],
    tags: ["recovery", "hope"],
    energy: ["exhausted", "low"],
    modes: ["recovery"]
  },
  focus: {
    phases: ["morning", "midday"],
    tags: ["focus", "discipline"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "trading"]
  },
  warrior: {
    phases: ["morning", "midday"],
    tags: ["warrior", "discipline", "focus"],
    energy: ["high"],
    modes: ["warrior"]
  },
  emotional_reset: {
    phases: ["evening", "midday"],
    tags: ["recovery", "hope"],
    energy: ["low", "exhausted"],
    modes: ["recovery", "stabilization"]
  },
  fasting: {
    phases: ["morning", "midday"],
    tags: ["discipline", "recovery"],
    energy: ["stable", "low"],
    modes: ["stabilization", "recovery"]
  },
  movement: {
    phases: ["morning", "midday"],
    tags: ["discipline", "focus"],
    energy: ["stable", "high"],
    modes: ["discipline", "warrior", "energy"]
  },
  silence: {
    phases: ["evening", "late_night"],
    tags: ["let_go", "recovery"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery", "stabilization"]
  },
  trading: {
    phases: ["morning", "midday"],
    tags: ["discipline", "focus"],
    energy: ["stable", "high"],
    modes: ["trading", "warrior"]
  },
  letting_go: {
    phases: ["evening", "late_night"],
    tags: ["let_go", "recovery"],
    energy: ["low", "exhausted", "stable"],
    modes: ["recovery"]
  }
};

const PATH_TO_CATEGORIES = {
  discipline: ["discipline", "focus", "activation"],
  energy: ["movement", "activation", "stabilization"],
  stabilization: ["stabilization", "overload", "emotional_reset"],
  warrior: ["warrior", "discipline", "focus"],
  recovery: ["recovery", "letting_go", "silence"],
  trading: ["trading", "focus", "discipline"]
};

const ATMOSPHERE_TO_CATEGORIES = {
  calm: ["activation", "discipline", "focus"],
  warrior: ["warrior", "discipline", "focus"],
  recovery: ["recovery", "letting_go", "silence"],
  emotional: ["emotional_reset", "stabilization", "recovery"],
  overloaded: ["overload", "stabilization"],
  grounded: ["stabilization", "discipline", "focus"],
  reflective: ["letting_go", "silence", "recovery"]
};

/**
 * @param {object} ctx
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function resolvePreferredCategories(ctx, slot) {
  const phase = slot === "late_night" ? "evening" : slot;
  const fromAtm = ATMOSPHERE_TO_CATEGORIES[ctx.atmosphere] || [];
  const fromEnergy =
    ctx.energyState === "exhausted" || ctx.energyState === "low"
      ? ["recovery", "stabilization", "overload"]
      : ctx.energyState === "high"
        ? ["warrior", "activation", "focus"]
        : ["discipline", "focus", "activation"];

  if (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") {
    return ["overload", "stabilization", ...fromAtm];
  }
  if (ctx.primaryPath && PATH_TO_CATEGORIES[ctx.primaryPath]) {
    return [...new Set([...PATH_TO_CATEGORIES[ctx.primaryPath], ...fromAtm])];
  }
  if (ctx.activeMode === "warrior") {
    return ["warrior", "discipline", ...fromAtm];
  }
  if (ctx.activeMode === "trading") {
    return ["trading", "focus", ...fromAtm];
  }
  if (ctx.activeMode === "recovery") {
    return ["recovery", "letting_go", ...fromAtm];
  }

  const phaseCats = CATEGORIES.filter((c) => CATEGORY_META[c].phases.includes(phase));
  const merged = [...new Set([...fromAtm, ...fromEnergy, ...phaseCats])];
  return merged.filter((c) => CATEGORIES.includes(c));
}

/**
 * @param {object} entry
 * @param {string[]} preferredCategories
 * @param {object} ctx
 */
function entryMatchesCategory(entry, preferredCategories, ctx) {
  if (preferredCategories.includes(entry.category)) return true;
  const tags = entry.tags || [entry.category];
  if (ctx.mantraTags) {
    for (const t of ctx.mantraTags) {
      if (tags.includes(t) || t === entry.category) return true;
    }
  }
  return false;
}

module.exports = {
  CATEGORIES,
  CATEGORY_META,
  ATMOSPHERE_TO_CATEGORIES,
  resolvePreferredCategories,
  entryMatchesCategory
};
