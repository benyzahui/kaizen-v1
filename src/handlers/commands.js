/**
 * Command-only routing. Open conversation is in telegram-webhook.js.
 *
 * Architecture: one switch per release keeps command surface explicit and testable.
 * Add new slash flows here; keep long prose in i18n responses, not in routing.
 */

const { resolveLang, fromTelegramCode } = require("../i18n/languageDetect");
const { command: logCommand } = require("../logging/log");
const { getResponses } = require("../i18n/getResponses");
const { handleEnergy } = require("./energyHandler");
const {
  handlePlanCommand,
  handleFocusCommand,
  handleResetCommand
} = require("./planTracking");
const { buildStatusReply } = require("./status");
const { buildHelpReply } = require("./help");
const { buildGuideReply } = require("./guide");
const {
  startOnboarding,
  getStartReply,
  skipOnboarding,
  buildProfileReply
} = require("./onboarding");
const { updateSession } = require("../session/sessionStore");
const { clearRemoteSession } = require("../db/syncState");
const { handleTrainingCommand } = require("./dragonTraining");

function uid(message) {
  return String(message.from?.id ?? message.chat?.id ?? "");
}

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
  const text = message.text || "";
  const lang = resolveLang(message, text, session);
  const r = getResponses(lang);
  const command = extractCommand(text);

  let handler = command;
  let reply;

  switch (command) {
    case "/start":
      startOnboarding(uid(message));
      reply = getStartReply(lang);
      break;
    case "/setup":
      startOnboarding(uid(message));
      reply = getStartReply(lang);
      break;
    case "/skip":
      reply = skipOnboarding(uid(message), lang);
      break;
    case "/profile":
      reply = buildProfileReply(session, lang);
      break;
    case "/help":
      reply = buildHelpReply(lang, session);
      break;
    case "/guide":
      reply = buildGuideReply(lang);
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
      reply = handleResetCommand(message, lang);
      break;
    case "/status":
      reply = buildStatusReply(message, session, lang);
      break;
    case "/clear":
      await clearRemoteSession(uid(message));
      reply = r.cmdClearReply;
      break;
    case "/language": {
      const parts = String(text).trim().split(/\s+/);
      const arg = parts[1];
      if (!arg) {
        reply = r.cmdLanguageMenu;
        break;
      }
      const n = parseInt(arg, 10);
      const map = { 1: "en", 2: "hu", 3: "ro", 4: "auto" };
      const sel = map[n];
      if (!sel) {
        reply = r.cmdLanguageInvalid;
        break;
      }
      const patch = { preferredLanguage: sel };
      if (sel !== "auto") {
        patch.lang = sel;
      } else {
        patch.lang = fromTelegramCode(message.from?.language_code) || "en";
      }
      updateSession(uid(message), patch);
      const r2 = getResponses(sel === "auto" ? "en" : sel);
      reply = r2.cmdLanguageConfirm(sel);
      break;
    }
    default: {
      const trainReply = handleTrainingCommand(command, message, session, lang);
      if (trainReply !== null) {
        handler = `training:${command}`;
        reply = trainReply;
        break;
      }
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
