/**
 * Protocol command surface — discipline companion rituals only.
 */

const { fromTelegramCode } = require("../i18n/languageDetect");
const { command: logCommand } = require("../logging/log");
const { getResponses } = require("../i18n/getResponses");
const { handleEnergy } = require("./energyHandler");
const {
  handleFocusCommand,
  handleResetCommand
} = require("./planTracking");
const { buildStatusReply } = require("./status");
const {
  startOnboarding,
  getStartReply,
  skipOnboarding
} = require("./onboarding");
const { updateSession, getSession } = require("../session/sessionStore");
const {
  buildMorningReply,
  buildMiddayReply,
  buildEveningReply
} = require("./dailyRhythm");
const { recordCompletedRitual } = require("../core/seriousnessEngine");
const {
  requiresOnboardingGate,
  isSafeOnboardingCommand,
  resolveOnboardingLang,
  onboardingCommandRedirect
} = require("../companion/onboardingGate");
const { getLockedLang } = require("../i18n/lockedLanguage");
const { isAllowedProtocolCommand } = require("./protocolCommands");

const PROGRAM_WRAP = new Set(["/morning", "/energy", "/evening"]);

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
  const command = extractCommand(text);
  const lang = session?.onboardingCompleted
    ? getLockedLang(session, message, text)
    : resolveOnboardingLang(session, message, text);
  const r = getResponses(lang);

  if (requiresOnboardingGate(session) && !isSafeOnboardingCommand(command)) {
    logRoute({
      path: "command",
      lang,
      command,
      handler: "onboarding_gate",
      textPreview: String(text).slice(0, 80)
    });
    return onboardingCommandRedirect(lang, command);
  }

  if (!isAllowedProtocolCommand(command)) {
    logRoute({
      path: "command",
      lang,
      command,
      handler: "protocol:blocked",
      textPreview: String(text).slice(0, 80)
    });
    return r.protocolCommandBlocked || r.unknown;
  }

  let handler = command;
  let reply;

  switch (command) {
    case "/start": {
      const id = uid(message);
      const s0 = getSession(id);
      if (s0.onboardingCompleted) {
        reply = r.protocolOnboarding?.startReturning || r.protocolCommandsList;
        break;
      }
      startOnboarding(id);
      reply = getStartReply(lang, getSession(id));
      break;
    }
    case "/skip":
      reply = skipOnboarding(uid(message), lang);
      break;
    case "/morning":
      reply = buildMorningReply(message, session, lang);
      recordCompletedRitual(uid(message), getSession(uid(message)));
      break;
    case "/midday":
      reply = buildMiddayReply(session, lang);
      break;
    case "/evening":
      reply = buildEveningReply(message, session, lang);
      recordCompletedRitual(uid(message), getSession(uid(message)));
      break;
    case "/energy":
      reply = await handleEnergy(message, lang);
      break;
    case "/trade":
      reply = r.trade;
      break;
    case "/focus":
      reply = handleFocusCommand(message, lang);
      break;
    case "/reset":
      reply = handleResetCommand(message, lang);
      break;
    case "/fasting":
    case "/training": {
      const ritual = ritualFromResponses(r, command);
      reply = ritual || r.protocolCommandBlocked;
      handler = `ritual:${command}`;
      break;
    }
    case "/status":
      reply = buildStatusReply(message, session, lang);
      break;
    case "/language": {
      const parts = String(text).trim().split(/\s+/);
      const arg = parts[1];
      if (!arg) {
        reply = r.cmdLanguageMenu;
        break;
      }
      const n = parseInt(arg, 10);
      const map = { 1: "en", 2: "hu", 3: "ro" };
      const sel = map[n];
      if (!sel) {
        reply = r.cmdLanguageInvalid;
        break;
      }
      updateSession(uid(message), { preferredLanguage: sel, lang: sel });
      const r2 = getResponses(sel);
      reply = r2.cmdLanguageConfirm(sel);
      break;
    }
    default:
      handler = "fallback:unknown_command";
      reply = r.protocolCommandBlocked || r.unknown;
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
