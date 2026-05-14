/**
 * Command-only routing (slash commands). Open conversation is handled in telegram-webhook.js.
 */

const { resolveLang } = require("../i18n/languageDetect");
const { getResponses } = require("../i18n/getResponses");
const { handleEnergy } = require("./energy");
const {
  handlePlanCommand,
  handleFocusCommand,
  handleResetCommand,
  clearAllPendingForUser
} = require("./planTracking");

function extractCommand(text = "") {
  const first = String(text).trim().split(/\s+/)[0];
  const cmd = first.includes("@") ? first.split("@")[0] : first;
  return cmd.toLowerCase();
}

/**
 * Telegram commands are /word — not any string that happens to start with "/".
 */
function isCommandText(text = "") {
  const s = String(text || "").trimStart();
  return /^\/[A-Za-z0-9_]/.test(s);
}

function logRoute(payload) {
  console.log("[kaizen:route]", JSON.stringify(payload));
}

/**
 * Slash commands only. Caller must ensure isCommandText(message.text) first.
 */
async function routeCommandMessage(message) {
  clearAllPendingForUser(message);
  const text = message.text || "";
  const lang = resolveLang(message, text);
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
    default:
      handler = "fallback:unknown_command";
      reply = r.unknown;
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

/** @deprecated Use routeCommandMessage; kept for any legacy requires. */
const routeMessage = routeCommandMessage;

module.exports = {
  routeCommandMessage,
  routeMessage,
  isCommandText
};
