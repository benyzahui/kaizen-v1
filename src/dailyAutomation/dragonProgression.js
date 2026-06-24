/**
 * Dragon Blueprint progression — Green / Iron / Golden Dragon tiers.
 */

const { resolveProtocolLevel } = require("../blueprint/protocolLevels");
const { updateSession } = require("../session/sessionStore");

const DRAGON_TIERS = {
  beginner: {
    id: "green",
    protocolLevel: "beginner",
    names: { en: "Green Dragon", hu: "Zöld Sárkány", ro: "Dragon Verde" },
    minDragonLevel: 1,
    focus: {
      en: ["Awareness", "Hydration", "Movement"],
      hu: ["Tudatosság", "Hidratálás", "Mozgás"],
      ro: ["Conștiență", "Hidratare", "Mișcare"]
    }
  },
  intermediate: {
    id: "iron",
    protocolLevel: "intermediate",
    names: { en: "Iron Dragon", hu: "Vas Sárkány", ro: "Dragon de Fier" },
    minDragonLevel: 3,
    focus: {
      en: ["Consistency", "Discipline", "Structure"],
      hu: ["Következetesség", "Fegyelem", "Struktúra"],
      ro: ["Consecvență", "Disciplină", "Structură"]
    }
  },
  advanced: {
    id: "golden",
    protocolLevel: "advanced",
    names: { en: "Golden Dragon", hu: "Arany Sárkány", ro: "Dragon Auriu" },
    minDragonLevel: 6,
    focus: {
      en: ["Mastery", "Leadership", "Self-control"],
      hu: ["Mesterség", "Vezetés", "Önuralom"],
      ro: ["Măiestrie", "Conducere", "Autocontrol"]
    }
  }
};

/**
 * @param {object} session
 */
function resolveDragonTier(session) {
  const level = resolveProtocolLevel(session);
  return DRAGON_TIERS[level] || DRAGON_TIERS.beginner;
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function dragonTierName(session, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return resolveDragonTier(session).names[locked];
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function levelFocusPool(session, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const tier = resolveDragonTier(session);
  return tier.focus[locked] || tier.focus.en;
}

/**
 * Evaluate promotion eligibility from streak + ritual completion.
 * @param {object} session
 */
function evaluateDragonProgression(session) {
  const streak = Number(session?.dailyStreak) || 0;
  const dragonLevel = Number(session?.dragonLevel) || 1;
  const tier = resolveDragonTier(session);
  let nextTier = null;
  let promote = false;

  if (tier.id === "green" && streak >= 7 && dragonLevel < 3) {
    nextTier = DRAGON_TIERS.intermediate;
    promote = true;
  } else if (tier.id === "iron" && streak >= 21 && dragonLevel < 6) {
    nextTier = DRAGON_TIERS.advanced;
    promote = true;
  }

  return { tier, nextTier, promote, streak, dragonLevel };
}

/**
 * @param {string|number} userId
 * @param {object} session
 */
function maybePromoteDragon(userId, session) {
  const { promote, nextTier, dragonLevel } = evaluateDragonProgression(session);
  if (!promote || !nextTier) return null;
  const newLevel = Math.max(dragonLevel, nextTier.minDragonLevel);
  updateSession(userId, { dragonLevel: newLevel, dragonTier: nextTier.id });
  return nextTier;
}

module.exports = {
  DRAGON_TIERS,
  resolveDragonTier,
  dragonTierName,
  levelFocusPool,
  evaluateDragonProgression,
  maybePromoteDragon
};
