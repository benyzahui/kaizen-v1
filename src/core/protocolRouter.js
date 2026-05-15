/**
 * Maps coach state + clock band → protocol id, then materializes message + one next command.
 */

const { lines } = require("../personality/kaizenVoice");
const { buildEnergyFromOpenText } = require("../handlers/energyHandler");
const { mergePreamble, narrateTrigger, narrateDefault, slotPreamble } = require("./coachBrain");

/**
 * @param {string} coachState
 * @param {'morning'|'midday'|'evening'|'late_night'} timeSlot
 * @returns {string}
 */
function pickProtocol(coachState, timeSlot) {
  if (coachState === "energy_curiosity") return "energy_read";
  if (coachState === "agreement_surface") return "casual_answer";
  if (coachState === "trading_session_anchor" || coachState === "trading_impulse_lane")
    return "trading_gate";
  if (coachState === "start_paralysis") return "mission_lock";
  if (coachState === "procrastinating") return "procrastination_breaker";
  if (coachState === "casual_talk") return "casual_answer";
  if (coachState === "tired_push") return "body_reset";
  if (coachState === "scattered_state")
    return timeSlot === "morning" ? "morning_alignment" : "overload_recovery";
  if (coachState === "overload_recovery") return "overload_recovery";
  if (coachState === "mission_drift") return "mission_lock";
  if (coachState === "seeking_permission" || coachState === "seeking_clarity")
    return "midday_correction";
  if (coachState === "overthinking") return "midday_correction";
  if (coachState === "emotional_open")
    return timeSlot === "evening" ? "evening_mirror" : "midday_correction";
  if (coachState === "body_neglect") return "body_reset";
  if (timeSlot === "morning") return "morning_alignment";
  if (timeSlot === "midday") return "midday_correction";
  if (timeSlot === "evening") return "evening_mirror";
  return "overload_recovery";
}

/**
 * @param {string} protocolId
 * @param {{ text: string, lang: 'en'|'hu'|'ro', coachState: string, timeSlot: string }} ctx
 * @param {object} r
 * @returns {{ message: string, nextCommand: string, protocolId: string }}
 */
function runProtocol(protocolId, ctx, r) {
  const { text, lang, coachState, timeSlot } = ctx;
  const pre = slotPreamble(timeSlot, r);

  if (protocolId === "energy_read") {
    const core = buildEnergyFromOpenText(text, lang);
    return { message: core, nextCommand: "/energy", protocolId };
  }

  if (protocolId === "morning_alignment") {
    const { body, nextCommand } = narrateDefault("morning", r);
    const inner =
      coachState === "default_coach" ? body : narrateTrigger(coachState, r).body || body;
    const nc =
      coachState === "default_coach"
        ? nextCommand
        : narrateTrigger(coachState, r).nextCommand || nextCommand;
    return {
      message: mergePreamble(pre, inner),
      nextCommand: nc,
      protocolId
    };
  }

  if (protocolId === "midday_correction") {
    const tr = narrateTrigger(coachState, r);
    const base =
      tr.body && coachState !== "default_coach"
        ? tr.body
        : narrateDefault("midday", r).body;
    const nc =
      tr.body && coachState !== "default_coach"
        ? tr.nextCommand
        : narrateDefault("midday", r).nextCommand;
    return { message: mergePreamble(pre, base), nextCommand: nc, protocolId };
  }

  if (protocolId === "evening_mirror") {
    const tr = narrateTrigger(coachState, r);
    const base =
      coachState === "emotional_open" && tr.body
        ? tr.body
        : narrateDefault("evening", r).body;
    const nc =
      coachState === "emotional_open" && tr.body
        ? tr.nextCommand
        : narrateDefault("evening", r).nextCommand;
    return { message: mergePreamble(pre, base), nextCommand: nc, protocolId };
  }

  if (protocolId === "trading_gate") {
    const tr = narrateTrigger(coachState, r);
    return {
      message: mergePreamble(pre, tr.body),
      nextCommand: tr.nextCommand,
      protocolId
    };
  }

  if (protocolId === "overload_recovery") {
    const tr = narrateTrigger("overload_recovery", r);
    const scattered =
      coachState === "scattered_state" ? narrateTrigger("scattered_state", r) : null;
    const body = scattered?.body ? scattered.body : tr.body;
    const nc = scattered?.body ? scattered.nextCommand : tr.nextCommand;
    return { message: mergePreamble(pre, body), nextCommand: nc, protocolId };
  }

  if (protocolId === "procrastination_breaker") {
    const tr = narrateTrigger("procrastinating", r);
    return { message: mergePreamble(pre, tr.body), nextCommand: tr.nextCommand, protocolId };
  }

  if (protocolId === "mission_lock") {
    const tr = narrateTrigger("start_paralysis", r);
    const drift = narrateTrigger("mission_drift", r);
    const body =
      coachState === "mission_drift" && drift.body ? drift.body : tr.body;
    const nc =
      coachState === "mission_drift" && drift.body ? drift.nextCommand : tr.nextCommand;
    return { message: mergePreamble(pre, body), nextCommand: nc, protocolId };
  }

  if (protocolId === "body_reset") {
    const tr = narrateTrigger(coachState, r);
    return {
      message: mergePreamble(pre, tr.body),
      nextCommand: tr.nextCommand,
      protocolId
    };
  }

  /* casual_answer */
  const tr = narrateTrigger(coachState, r);
  const { body: defB, nextCommand: defN } = narrateDefault(timeSlot, r);
  const body = tr.body || defB;
  const nc = tr.nextCommand || defN;
  return { message: mergePreamble(pre, body), nextCommand: nc, protocolId };
}

module.exports = { pickProtocol, runProtocol };
