/**
 * Energy-state tone routing — Dragon Blueprint companion voice.
 */

const ENERGY_TONE = {
  low: {
    id: "low",
    tone: "gentle",
    style: "supportive",
    hint: { en: "Gentle. No pressure.", hu: "Finoman. Nincs nyomás.", ro: "Blând. Fără presiune." }
  },
  stable: {
    id: "stable",
    tone: "focused",
    style: "structured",
    hint: { en: "Focused. One lane.", hu: "Fókusz. Egy sáv.", ro: "Focus. O bandă." }
  },
  high: {
    id: "high",
    tone: "challenging",
    style: "motivating",
    hint: { en: "Strong execution window.", hu: "Erős végrehajtási ablak.", ro: "Fereastră de execuție puternică." }
  },
  overstimulated: {
    id: "overstimulated",
    tone: "calming",
    style: "grounding",
    hint: { en: "Calm the input. Breathe.", hu: "Csökkentsd az inputot. Lélegezz.", ro: "Calmează inputul. Respiră." }
  },
  exhausted: {
    id: "exhausted",
    tone: "recovery",
    style: "recovery_first",
    hint: { en: "Recovery first.", hu: "Először regeneráció.", ro: "Recuperare întâi." }
  }
};

/**
 * @param {object} session
 */
function resolveEnergyTone(session) {
  const energy =
    session?.energyState || session?.protocolState?.energyState || "stable";
  return ENERGY_TONE[energy] || ENERGY_TONE.stable;
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function energyToneHint(session, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const tone = resolveEnergyTone(session);
  return tone.hint[locked] || tone.hint.en;
}

module.exports = { ENERGY_TONE, resolveEnergyTone, energyToneHint };
