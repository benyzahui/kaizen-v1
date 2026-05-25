/**
 * Dragon Blueprint adaptive protocol engine — command responses.
 * Format: state → explanation → one practical action → optional next command.
 */

const { lines } = require("../personality/kaizenVoice");
const { buildProtocolState } = require("../core/protocolStateEngine");
const { getPillarForCommand, getNextCommandHint } = require("./commandProtocolMap");
const { resolveProtocolLevel, pickActionTier } = require("./protocolLevels");
const { getBlueprintCopy } = require("./i18n/getBlueprintCopy");
const { buildTradingPsychologyReply } = require("./tradingPsychologyProtocol");
const { formatBlueprintReply } = require("./blueprintReplyFormat");

/**
 * @param {object} copy
 * @param {object} ctx protocol state + optional session
 */
function resolveStateLine(copy, ctx) {
  const sl = copy.stateLines;
  if (ctx.energyState === "exhausted") return sl.energy_exhausted;
  if (ctx.energyState === "low") return sl.energy_low;
  if (ctx.energyState === "high") return sl.energy_high;
  if (ctx.energyState === "overstimulated") return sl.energy_overstimulated;
  if (ctx.nervousSystemState === "overloaded") return sl.ns_overloaded;
  if (ctx.nervousSystemState === "anxious") return sl.ns_anxious;
  if (ctx.nervousSystemState === "grounded") return sl.ns_grounded;
  if (ctx.disciplineState === "drifting") return sl.disc_drifting;
  if (ctx.disciplineState === "locked_in") return sl.disc_locked;
  if (ctx.disciplineState === "inconsistent") return sl.disc_inconsistent;
  return sl.energy_stable || sl.ns_calm;
}

/**
 * @param {object} pillar
 * @param {object} ctx
 */
function resolveExplanation(pillar, ctx) {
  const ex = pillar.explain || {};
  if (ctx.nervousSystemState === "overloaded" && ex.overloaded) return ex.overloaded;
  if (ctx.nervousSystemState === "anxious" && ex.anxious) return ex.anxious;
  if (
    (ctx.energyState === "low" || ctx.energyState === "exhausted") &&
    ex.low
  ) {
    return ex.low;
  }
  if (ctx.energyState === "high" && ex.high) return ex.high;
  if (ctx.disciplineState === "drifting" && ex.drifting) return ex.drifting;
  if (ctx.disciplineState === "locked_in" && ex.locked) return ex.locked;
  return ex.default || pillar.purpose || "";
}

/**
 * Adapt action lines from daily state rules.
 * @param {string[]} actionLines
 * @param {object} ctx
 */
function adaptActionsForState(actionLines, ctx) {
  if (!actionLines?.length) return [""];
  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    const lowSafe = actionLines.slice(0, 3);
    if (ctx.pillarId === "movement_training") {
      return lowSafe.filter((l) => !/intervall|interval|warrior|cold|hideg|rece|futás|run/i.test(l));
    }
    return lowSafe;
  }
  if (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") {
    if (ctx.pillarId === "movement_training") {
      return actionLines.slice(0, 2);
    }
    if (ctx.pillarId === "fasting_reset") {
      return actionLines.slice(0, 2);
    }
  }
  if (ctx.disciplineState === "drifting" && ctx.pillarId === "discipline_focus") {
    return actionLines.slice(0, 3);
  }
  return actionLines.slice(0, 3);
}

/**
 * @param {string} command e.g. /energy
 * @param {object} session
 * @param {string} lang
 * @param {string} [text] optional inbound text for state
 */
function buildBlueprintCommandResponse(command, session, lang, text = "") {
  const cmd = String(command || "").toLowerCase();
  if (cmd === "/trade") {
    const protocolState = buildProtocolState(session, text, "trading");
    return buildTradingPsychologyReply(protocolState, session, lang);
  }

  const pillarId = getPillarForCommand(cmd);
  if (!pillarId) return null;

  const copy = getBlueprintCopy(lang);
  const pillar = copy.pillars[pillarId];
  if (!pillar) return null;

  const protocolState = buildProtocolState(session, text, pillarId);
  const level = resolveProtocolLevel(session);
  const ctx = { ...protocolState, pillarId, session };

  const tierLine = pickActionTier(pillar.actions, level, protocolState);
  let actionLines = [];
  if (Array.isArray(tierLine)) {
    actionLines = tierLine;
  } else if (typeof tierLine === "string" && tierLine) {
    actionLines = [tierLine];
  } else {
    actionLines = pillar.actions?.beginner || [];
  }

  actionLines = adaptActionsForState(actionLines, ctx);

  if (cmd === "/focus" && copy.pillars.digital_detox) {
    const detox = copy.pillars.digital_detox;
    if (protocolState.disciplineState === "drifting" || protocolState.scatter >= 5) {
      const detoxLine = (detox.actions.beginner || [])[0];
      if (detoxLine && !actionLines.includes(detoxLine)) {
        actionLines = [...actionLines.slice(0, 2), detoxLine];
      }
    }
  }

  let nextCommand = getNextCommandHint(cmd, pillarId);
  if (protocolState.nervousSystemState === "overloaded" && cmd !== "/reset") {
    nextCommand = "/reset";
  } else if (
    (protocolState.energyState === "low" || protocolState.energyState === "exhausted") &&
    cmd === "/training"
  ) {
    nextCommand = "/energy";
  }

  return formatBlueprintReply({
    lang,
    title: pillar.title,
    icon: pillar.icon,
    stateLine: resolveStateLine(copy, ctx),
    explanation: resolveExplanation(pillar, ctx),
    actionLines,
    nextCommand,
    includeSafety: level === "advanced" || pillarId === "fasting_reset",
    safetyOverride:
      pillarId === "fasting_reset" || pillarId === "movement_training"
        ? pillar.warnings
        : undefined
  });
}

/**
 * /status blueprint section (can prepend to existing status).
 */
function buildBlueprintStatusSection(session, lang, text = "") {
  const copy = getBlueprintCopy(lang);
  const protocolState = buildProtocolState(session, text, "status");
  const ctx = { ...protocolState, pillarId: "daily_state" };
  const pillar = copy.pillars.daily_state;

  const summary = lines(
    resolveStateLine(copy, ctx),
    copy.stateLines.disc_drifting && protocolState.disciplineState === "drifting"
      ? copy.stateLines.disc_drifting
      : "",
    protocolState.nervousSystemState === "overloaded"
      ? copy.stateLines.ns_overloaded
      : ""
  )
    .split("\n")
    .filter(Boolean)
    .join("\n");

  const level = resolveProtocolLevel(session);
  const tier = pickActionTier(pillar.actions, level, protocolState);
  const actionLines = adaptActionsForState(
    Array.isArray(tier) ? tier : tier ? [tier] : pillar.actions.beginner,
    ctx
  );

  return formatBlueprintReply({
    lang,
    title: pillar.title,
    icon: pillar.icon,
    stateLine: summary,
    explanation: resolveExplanation(pillar, ctx),
    actionLines: actionLines.slice(0, 2),
    nextCommand: protocolState.nervousSystemState === "overloaded" ? "/reset" : "/morning",
    includeSafety: false
  });
}

module.exports = {
  formatBlueprintReply,
  buildBlueprintCommandResponse,
  buildBlueprintStatusSection,
  resolveStateLine,
  resolveExplanation,
  adaptActionsForState
};
