/**
 * /energy adapts to user state — not a static template every time.
 */

/**
 * @param {object} session
 * @param {object} [state] analyzeUserState snapshot
 * @param {'general'|'trading'|'body'|'emotion'|'work'} explicitLens
 */
function resolveContextualEnergyLens(session, state, explicitLens = "general") {
  if (explicitLens && explicitLens !== "general") return explicitLens;

  const pm = session?.presenceMemory || {};
  const energy = state?.energyLevel ?? 5;
  const intensity = state?.emotionalIntensity ?? 0;
  const path = session?.userPrimaryPath;

  if (energy <= 3 || pm.emotionalState === "tired" || pm.emotionalState === "overloaded") {
    return "body";
  }
  if (intensity >= 6 || pm.emotionalState === "overloaded" || pm.emotionalState === "scattered") {
    return "emotion";
  }
  if (path === "trading" || state?.mentorMode === "warrior_mode") {
    return "trading";
  }
  if (energy >= 7 && intensity <= 4 && (path === "business" || path === "selfdev")) {
    return "work";
  }
  return "general";
}

/**
 * Compact energy read when user is depleted.
 * @param {'en'|'hu'|'ro'} lang
 */
function depletedEnergyOverlay(lang) {
  if (lang === "hu") {
    return [
      "🌘 Mai energia (visszafogva)",
      "",
      "Alacsony tartály — nem új terv kell.",
      "Víz, lassú légzés, egy rövid séta.",
      "Ma ne bizonyíts. Csak stabilizálj."
    ].join("\n");
  }
  if (lang === "ro") {
    return [
      "🌘 Energie (redusă)",
      "",
      "Rezervă joasă — nu plan nou.",
      "Apă, respirație lentă, scurtă plimbare.",
      "Azi nu demonstra. Stabilizează."
    ].join("\n");
  }
  return [
    "🌘 Today's energy (pulled back)",
    "",
    "Low tank — not a new plan.",
    "Water, slow breath, a short walk.",
    "Do not prove anything today. Stabilize."
  ].join("\n");
}

module.exports = { resolveContextualEnergyLens, depletedEnergyOverlay };
