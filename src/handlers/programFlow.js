/**
 * Active daily program hints (V1.9) — no scheduled sends; appends next-step lines to command replies.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession, getSession } = require("../session/sessionStore");

function isDragonProgram(session) {
  return session?.programMode === "dragon_training";
}

/**
 * @param {string|number} userId
 * @param {string} command normalized /cmd
 * @param {string} reply
 * @param {'en'|'hu'|'ro'} lang
 */
function appendProgramProgress(userId, command, reply, lang) {
  const id = String(userId);
  const s0 = getSession(id);
  if (!isDragonProgram(s0) && command !== "/program") return reply;

  const r = getResponses(lang);
  let extra = "";
  let patch = {};

  switch (command) {
    case "/program":
      patch = { programMode: "dragon_training", currentProgramStep: "morning" };
      extra = "";
      break;
    case "/morning":
      patch = { currentProgramStep: "energy" };
      extra = r.tProgramStep2Energy;
      break;
    case "/energy":
      patch = { currentProgramStep: "mission" };
      extra = r.tProgramStep3Mission;
      break;
    case "/mission":
      patch = { currentProgramStep: "body" };
      extra = r.tProgramStep4Body;
      break;
    case "/body":
    case "/breath":
    case "/walk":
    case "/train":
      patch = { currentProgramStep: "evening" };
      extra = r.tProgramStep5Evening;
      break;
    case "/evening":
    case "/mirror":
      patch = { currentProgramStep: "idle" };
      extra = r.tProgramCycleClosed;
      break;
    default:
      return reply;
  }

  if (Object.keys(patch).length) updateSession(id, patch);
  if (!extra) return reply;
  return lines(reply, "", extra);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function programWanderLine(session, lang) {
  const s = session || {};
  if (!isDragonProgram(s)) return null;
  if (!s.currentProgramStep || s.currentProgramStep === "idle") return null;
  const r = getResponses(lang);
  return r.tProgramWanderOpenChat;
}

function suggestedProgramCommand(session) {
  const st = session?.currentProgramStep;
  if (!st || st === "idle") return "/program";
  const map = {
    morning: "/morning",
    energy: "/energy",
    mission: "/mission",
    body: "/body",
    evening: "/evening"
  };
  return map[st] || "/program";
}

module.exports = {
  isDragonProgram,
  appendProgramProgress,
  programWanderLine,
  suggestedProgramCommand
};
