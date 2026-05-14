/**
 * Command-only routing. Open conversation is in telegram-webhook.js.
 *
 * Architecture: one switch per release keeps command surface explicit and testable.
 * Add new slash flows here; keep long prose in i18n responses, not in routing.
 */

const { resolveLang } = require("../i18n/languageDetect");
const { command: logCommand } = require("../logging/log");
const { getResponses } = require("../i18n/getResponses");
const { handleEnergy } = require("./energy");
const {
  handlePlanCommand,
  handleFocusCommand,
  handleResetCommand,
  clearAllPendingForUser
} = require("./planTracking");
const { buildStatusReply } = require("./status");

function extractCommand(text = "") {
  const first = String(text).trim().split(/\s+/)[0];
  const cmd = first.includes("@") ? first.split("@")[0] : first;
  return cmd.toLowerCase();
}

function isCommandText(text = "") {
  const s = String(text || "").trimStart();
  return /^\/[A-Za-z0-9_]/.test(s);
}

function logRoute(payload) {
  logCommand(JSON.stringify(payload), null);
}

function ritualFromResponses(r, command) {
  const key = command.replace(/^\//, "");
  return r.rituals && r.rituals[key] ? r.rituals[key] : null;
}

/**
 * @param {object} message
 * @param {object} [session]
 */
async function routeCommandMessage(message, session) {
  clearAllPendingForUser(message);
  const text = message.text || "";
  const lang = resolveLang(message, text, session);
  const r = getResponses(lang);
  const command = extractCommand(text);

  let handler = command;
  let reply;

  switch (command) {
    case "/start":
      reply = r.start;
      break;
    case "/help":
      reply = r.help;
      break;
    case "/energy":
      reply = await handleEnergy(message, lang);
      break;
    case "/pulse":
      reply = r.pulse;
      break;
    case "/mirror":
      reply = r.mirror;
      break;
    case "/trade":
      reply = r.trade;
      break;
    case "/plan":
      reply = handlePlanCommand(message, lang);
      break;
    case "/focus":
      reply = handleFocusCommand(message, lang);
      break;
    case "/reset":
      reply = handleResetCommand(lang);
      break;
    case "/status":
      reply = buildStatusReply(message, session, lang);
      break;
    default: {
      const ritual = ritualFromResponses(r, command);
      if (ritual) {
        handler = `ritual:${command}`;
        reply = ritual;
      } else {
        handler = "fallback:unknown_command";
        reply = r.unknown;
      }
    }
  }

  logRoute({
    path: "command",
    lang,
    command,
    handler,
    textPreview: String(text).slice(0, 80)
  });
  return reply;
}

const routeMessage = routeCommandMessage;

module.exports = {
  routeCommandMessage,
  routeMessage,
  isCommandText,
  extractCommand
};
