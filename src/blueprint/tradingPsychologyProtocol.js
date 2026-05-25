/**
 * /trade — Dragon Blueprint trading psychology (nervous system first).
 */

const { getBlueprintCopy } = require("./i18n/getBlueprintCopy");
const { formatBlueprintReply } = require("./blueprintReplyFormat");

const CHECK_KEYS = ["calm", "plan", "revenge", "tired", "risk"];

/**
 * @param {object} protocolState from buildProtocolState
 * @param {object} session
 * @param {string} lang
 */
function buildTradingPsychologyReply(protocolState, session, lang) {
  const copy = getBlueprintCopy(lang);
  const pillar = copy.pillars.trading_psychology;
  const ctx = { ...protocolState, session };

  const failReasons = [];
  if (
    protocolState.nervousSystemState === "overloaded" ||
    protocolState.nervousSystemState === "anxious"
  ) {
    failReasons.push("ns");
  }
  if (
    protocolState.energyState === "exhausted" ||
    protocolState.energyState === "low"
  ) {
    failReasons.push("energy");
  }
  if (protocolState.disciplineState === "drifting") {
    failReasons.push("discipline");
  }

  const noTrade = failReasons.length > 0;
  const explainKey = noTrade
    ? protocolState.nervousSystemState === "overloaded"
      ? "overloaded"
      : protocolState.nervousSystemState === "anxious"
        ? "anxious"
        : "default"
    : "default";

  let explanation =
    pillar.explain[explainKey] || pillar.explain.default;
  if (noTrade) {
    const block = copy.tradeBlock || {};
    explanation = block.noTrade || explanation;
  }

  const actionLines = noTrade
    ? [pillar.actions.beginner[1], pillar.actions.beginner[2]].filter(Boolean)
    : [pillar.actions.beginner[0]];

  const nextCommand = noTrade ? "/reset" : "/status";

  return formatBlueprintReply({
    lang,
    title: pillar.title,
    icon: pillar.icon,
    stateLine: buildTradeStateLine(copy, protocolState, noTrade),
    explanation,
    actionLines,
    nextCommand,
    includeSafety: true,
    safetyOverride: pillar.warnings
  });
}

/**
 * @param {object} copy
 * @param {object} protocolState
 * @param {boolean} noTrade
 */
function buildTradeStateLine(copy, protocolState, noTrade) {
  const t = copy.tradeBlock || {};
  if (noTrade) {
    return t.stateNoTrade || copy.stateLines.ns_overloaded;
  }
  if (protocolState.energyState === "high" && protocolState.nervousSystemState === "calm") {
    return t.stateReady || copy.stateLines.energy_high;
  }
  return t.stateCheck || copy.stateLines.energy_stable;
}

module.exports = {
  buildTradingPsychologyReply,
  CHECK_KEYS
};
