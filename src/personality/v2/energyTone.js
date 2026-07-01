/**
 * Energy-state tone routing — Dragon Blueprint companion voice.
 */

const { sergeantEnergyHint } = require("./sergeantVoice");

const ENERGY_TONE = {
  low: {
    id: "low",
    tone: "sergeant_gentle",
    style: "tough_recovery",
    hint: { en: sergeantEnergyHint("low", "en"), hu: sergeantEnergyHint("low", "hu"), ro: sergeantEnergyHint("low", "ro") }
  },
  stable: {
    id: "stable",
    tone: "sergeant_focus",
    style: "structured",
    hint: { en: sergeantEnergyHint("stable", "en"), hu: sergeantEnergyHint("stable", "hu"), ro: sergeantEnergyHint("stable", "ro") }
  },
  high: {
    id: "high",
    tone: "sergeant_push",
    style: "execute",
    hint: { en: sergeantEnergyHint("high", "en"), hu: sergeantEnergyHint("high", "hu"), ro: sergeantEnergyHint("high", "ro") }
  },
  overstimulated: {
    id: "overstimulated",
    tone: "sergeant_calm",
    style: "grounding",
    hint: {
      en: sergeantEnergyHint("overstimulated", "en"),
      hu: sergeantEnergyHint("overstimulated", "hu"),
      ro: sergeantEnergyHint("overstimulated", "ro")
    }
  },
  exhausted: {
    id: "exhausted",
    tone: "sergeant_recovery",
    style: "recovery_first",
    hint: { en: sergeantEnergyHint("exhausted", "en"), hu: sergeantEnergyHint("exhausted", "hu"), ro: sergeantEnergyHint("exhausted", "ro") }
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
