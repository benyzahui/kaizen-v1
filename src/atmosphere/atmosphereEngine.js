/**
 * Adaptive atmosphere — tone, pacing, mantra style from energy + time + nervous load.
 */

const { resolveRhythmContext } = require("../rhythm/rhythmPicker");
const { resolveTimeAwareTone } = require("./timeAwareTone");
const { pickSymbolicLine } = require("./energyAtmosphereMap");
const { maybePresenceLine } = require("./emotionalPresencePool");
const { pickNativeMantra } = require("./nativeMantraPicker");
const { pickMantraForSlot } = require("../mantra/mantraEngine");
const { pickExpandedMantra } = require("../mantras/expandedMantraEngine");

/** @typedef {'calm'|'warrior'|'recovery'|'emotional'|'overloaded'|'grounded'|'reflective'} AtmosphereState */

/**
 * @param {object} session
 * @param {Date} [now]
 * @returns {AtmosphereState}
 */
function resolveAtmosphereState(session, now = new Date()) {
  const ctx = resolveRhythmContext(session, session?.preferredLanguage || "en");
  const tone = resolveTimeAwareTone(session, now);

  if (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") {
    return "overloaded";
  }
  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    return tone.timeSlot === "evening" || tone.timeSlot === "late_night"
      ? "recovery"
      : "emotional";
  }
  if (ctx.activeMode === "warrior" && ctx.energyState === "high") {
    return "warrior";
  }
  if (ctx.activeMode === "recovery" || tone.timeSlot === "late_night") {
    return "recovery";
  }
  if (ctx.disciplineState === "drifting" || ctx.disciplineState === "inconsistent") {
    return "reflective";
  }
  if (ctx.nervousSystemState === "grounded") {
    return "grounded";
  }
  if (tone.timeSlot === "evening") {
    return "reflective";
  }
  return "calm";
}

/**
 * Full atmosphere context for engines.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {Date} [now]
 */
function resolveAtmosphereContext(session, lang, now = new Date()) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const rhythmCtx = resolveRhythmContext(session, locked);
  const tone = resolveTimeAwareTone(session, now);
  const { resolveRhythmProfile } = require("../rhythm/rhythmIntelligenceEngine");
  const rhythmProfile = resolveRhythmProfile(session, "", now);
  const atmosphere = resolveAtmosphereState(session, now);

  const mantraTags = [...(rhythmCtx.pathMantraTags || [])];
  if (atmosphere === "warrior") mantraTags.push("warrior", "focus", "discipline");
  if (atmosphere === "recovery" || atmosphere === "emotional") {
    mantraTags.push("recovery", "let_go", "hope");
  }
  if (atmosphere === "overloaded") mantraTags.push("stabilization", "let_go");
  if (atmosphere === "reflective") mantraTags.push("recovery", "focus");
  if (atmosphere === "grounded") mantraTags.push("discipline", "focus");

  return {
    lang: locked,
    atmosphere,
    tone,
    rhythmCtx: {
      ...rhythmCtx,
      atmosphere,
      timeSlot: tone.timeSlot
    },
    mantraTags,
    maxLines: rhythmProfile.maxLines ?? tone.maxLines,
    pacing: tone.pacing,
    softness: tone.softness,
    rhythmMode: rhythmProfile.rhythmMode,
    protocolIntensity: rhythmProfile.protocolIntensity,
    behaviorSignals: rhythmProfile.signals
  };
}

/**
 * Adaptive mantra — native pools + registry.
 */
function pickAdaptiveMantra(slot, lang, session, userId, dateKey, now = new Date()) {
  const ctx = resolveAtmosphereContext(session, lang, now);
  const phase = slot === "late_night" ? "evening" : slot;

  const { pickKnowledgeMantra } = require("../knowledgeCore/knowledgeSelector");
  const knowledge = pickKnowledgeMantra(
    phase,
    ctx.lang,
    session,
    userId,
    dateKey,
    ctx.rhythmCtx
  );
  if (knowledge?.id?.startsWith("morning_") || knowledge?.id?.startsWith("midday_") || knowledge?.id?.startsWith("evening_")) {
    return knowledge;
  }

  const expanded = pickExpandedMantra(
    phase,
    ctx.lang,
    session,
    userId,
    dateKey,
    ctx.rhythmCtx
  );
  if (expanded?.id?.startsWith("exp_")) return expanded;

  const native = pickNativeMantra(lang, phase, ctx.atmosphere, ctx.tone.timeSlot);
  if (native) return native;

  return pickMantraForSlot(phase, ctx.lang, session, userId, dateKey, ctx.rhythmCtx);
}

/**
 * Symbolic energy read with atmosphere map.
 */
function buildAtmosphericEnergyRead(session, lang, dateKey, userId = "0", now = new Date()) {
  const ctx = resolveAtmosphereContext(session, lang, now);
  const nervous = pickSymbolicLine(
    ctx.lang,
    ctx.atmosphere === "overloaded" ? "overloaded" : "calm",
    "nervous",
    userId,
    dateKey
  );
  const main = pickSymbolicLine(ctx.lang, ctx.atmosphere, "atmosphere", userId, dateKey);
  const recovery =
    ctx.tone.timeSlot === "evening" || ctx.tone.timeSlot === "late_night"
      ? pickSymbolicLine(ctx.lang, "recovery", "recovery", userId, dateKey)
      : "";

  const lines = [main, nervous, recovery].filter(Boolean);
  const presence = maybePresenceLine(
    ctx.lang,
    ctx.tone,
    ctx.atmosphere,
    userId
  );
  if (presence) lines.push(presence);
  return lines.join("\n").trim();
}

/**
 * Optional closing line for evening flows.
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} atmosphere
 */
function eveningEnding(lang, atmosphere) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  if (locked === "ro") {
    return "🌘 Mâine reconstruim.\nAcum odihnește-te.";
  }
  if (locked === "hu") {
    return "🌘 Holnap újra építünk.\nMost pihenj.";
  }
  if (atmosphere === "recovery") {
    return "🌘 Tomorrow we rebuild.\nRest now.";
  }
  return "";
}

module.exports = {
  resolveAtmosphereState,
  resolveAtmosphereContext,
  pickAdaptiveMantra,
  buildAtmosphericEnergyRead,
  eveningEnding,
  maybePresenceLine
};
