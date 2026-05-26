/**
 * Build catalog entries from compact multilingual rows.
 */

const PATH_ALL = ["discipline", "energy", "stabilization", "warrior", "recovery", "trading"];

/**
 * @param {Array<{ hu: string, en: string, ro: string }>} rows
 * @param {object} opts
 */
function buildPromptRows(rows, opts) {
  const {
    category,
    emotionalTone = "calm",
    intensity = "low",
    timeOfDay = ["morning", "midday", "evening"],
    energyState = ["exhausted", "low", "stable", "high"],
    activePath = [],
    contexts = ["default"]
  } = opts;

  const out = [];
  rows.forEach((row, i) => {
    for (const language of ["hu", "en", "ro"]) {
      out.push({
        id: `pr_${category}_${language}_${String(i + 1).padStart(2, "0")}`,
        kind: "prompt",
        language,
        category,
        text: row[language],
        phases: timeOfDay,
        timeOfDay,
        energy: energyState,
        energyState,
        activePath: activePath.length ? activePath : PATH_ALL,
        modes: activePath.length ? activePath : PATH_ALL,
        emotionalTone,
        intensity,
        contexts
      });
    }
  });
  return out;
}

/**
 * @param {Array<object>} templates
 */
function buildProtocolTemplates(templates) {
  const out = [];
  templates.forEach((t, ti) => {
    for (const language of ["hu", "en", "ro"]) {
      out.push({
        id: `mp_${t.key}_${language}`,
        kind: "micro_protocol",
        language,
        category: t.category,
        intensity: t.intensity,
        phases: t.phases,
        timeOfDay: t.phases,
        energy: t.energy,
        energyState: t.energy,
        modes: t.modes,
        activePath: t.modes,
        emotionalTone: t.emotionalTone,
        title: t.title[language],
        actions: t.actions[language],
        contexts: ["default"]
      });
    }
  });
  return out;
}

module.exports = { buildPromptRows, buildProtocolTemplates, PATH_ALL };
