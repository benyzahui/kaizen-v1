/**
 * Protocol command surface — discipline companion rituals only.
 */

const { fromTelegramCode } = require("../i18n/languageDetect");
const { command: logCommand } = require("../logging/log");
const { getResponses } = require("../i18n/getResponses");
const { handleFocusCommand } = require("./planTracking");
const { buildBlueprintCommandResponse } = require("../blueprint/adaptiveProtocolEngine");
const {
  startOnboarding,
  getStartReply,
  skipOnboarding
} = require("./onboarding");
const { updateSession, getSession } = require("../session/sessionStore");
const { recordCompletedRitual } = require("../core/seriousnessEngine");
const {
  buildMorningCheckInCommand,
  buildMiddayCheckInCommand,
  buildEveningCheckInCommand
} = require("../tracking/dailyCheckInFlow");
const { buildDailyStatusSnapshot } = require("../tracking/statusEngine");
const {
  activateProgram,
  buildWhereAmIReply,
  pauseProgram,
  resumeProgram,
  stopProgram,
  maybeResetProgramForNewDay
} = require("../program/dailyProgramEngine");
const { buildWeeklySummary } = require("../consistency/weeklySummary");
const {
  requiresOnboardingGate,
  isSafeOnboardingCommand,
  resolveOnboardingLang,
  onboardingCommandRedirect
} = require("../companion/onboardingGate");
const { getLockedLang } = require("../i18n/lockedLanguage");
const { isAllowedProtocolCommand } = require("./protocolCommands");
const { buildGuideReply } = require("./guide");
const { handlePanelCommand } = require("../panel/protocolPanelEngine");
const { finalizeOutboundReply } = require("../i18n/hardLanguageLock");
const { lines } = require("../personality/kaizenVoice");
const { buildPathCommandReply } = require("../path/dailyPathEngine");
const {
  buildTodayCommand,
  buildReflectionCommand,
  buildChallengeCommand
} = require("../knowledgeCore/dragonBlueprintCommands");

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
    case "/guide":
      reply = buildGuideReply(lang, getSession(uid(message)));
      break;
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
    case "/panel":
    case "/discipline":
    case "/stabilization":
    case "/training":
    case "/lettinggo":
    case "/recovery":
    case "/energy":
    case "/trading":
    case "/breath":
    case "/fasting": {
      const id = uid(message);
      reply = handlePanelCommand(command, lang, getSession(id), id);
      handler = `panel:${command}`;
      break;
    }
    case "/trade":
    case "/reset":
    case "/focus": {
      const focusArg = command === "/focus" ? handleFocusCommand(message, lang) : null;
      if (focusArg && String(message.text || "").match(/^\/focus\s+\S+/i)) {
        reply = focusArg;
        handler = "blueprint:focus_saved";
        break;
      }
      reply =
        buildBlueprintCommandResponse(command, getSession(uid(message)), lang, text) ||
        r.protocolCommandBlocked;
      handler = `blueprint:${command}`;
      if (command === "/focus" && !String(message.text || "").match(/^\/focus\s+\S+/i)) {
        const blueprint = reply;
        reply = lines(blueprint, "", focusArg || "");
        handler = "blueprint:focus_prompt";
      }
      break;
    }
    case "/program": {
      const id = uid(message);
      maybeResetProgramForNewDay(getSession(id), id);
      reply = activateProgram(id, lang);
      handler = "program:activate";
      break;
    }
    case "/whereami": {
      const id = uid(message);
      maybeResetProgramForNewDay(getSession(id), id);
      reply = buildWhereAmIReply(getSession(id), lang, id);
      handler = "program:whereami";
      break;
    }
    case "/pause": {
      reply = pauseProgram(uid(message), lang);
      handler = "program:pause";
      break;
    }
    case "/resume": {
      reply = resumeProgram(uid(message), lang);
      handler = "program:resume";
      break;
    }
    case "/stop": {
      reply = stopProgram(uid(message), lang);
      handler = "program:stop";
      break;
    }
    case "/morning": {
      const id = uid(message);
      reply = buildMorningCheckInCommand(id, getSession(id), lang);
      recordCompletedRitual(id, getSession(id));
      handler = "daily:morning_checkin";
      break;
    }
    case "/midday": {
      const id = uid(message);
      reply = buildMiddayCheckInCommand(id, getSession(id), lang);
      handler = "daily:midday_checkin";
      break;
    }
    case "/evening": {
      const id = uid(message);
      reply = buildEveningCheckInCommand(id, getSession(id), lang);
      recordCompletedRitual(id, getSession(id));
      handler = "daily:evening_checkin";
      break;
    }
    case "/status": {
      reply = buildDailyStatusSnapshot(getSession(uid(message)), lang, uid(message));
      handler = "daily:status";
      break;
    }
    case "/weekly": {
      reply = buildWeeklySummary(getSession(uid(message)), lang, uid(message));
      handler = "consistency:weekly";
      break;
    }
    case "/path": {
      const id = uid(message);
      const s = getSession(id);
      reply = buildPathCommandReply({ ...s, userId: id }, lang, text);
      handler = "path:menu";
      break;
    }
    case "/today": {
      const id = uid(message);
      reply = buildTodayCommand(id, getSession(id), lang);
      handler = "dragon:today";
      break;
    }
    case "/reflection": {
      const id = uid(message);
      reply = buildReflectionCommand(id, getSession(id), lang);
      handler = "dragon:reflection";
      break;
    }
    case "/challenge": {
      const id = uid(message);
      reply = buildChallengeCommand(id, getSession(id), lang);
      handler = "dragon:challenge";
      break;
    }
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

  if (reply) {
    reply = finalizeOutboundReply(
      reply,
      lang,
      getSession(uid(message)),
      uid(message),
      { openingId: `cmd_${command}` }
    );
  }
  return reply;
}

const routeMessage = routeCommandMessage;

module.exports = {
  routeCommandMessage,
  routeMessage,
  isCommandText,
  extractCommand
};
