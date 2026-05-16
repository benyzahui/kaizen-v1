/**
 * Command-only routing — see src/core/kaizenPipeline.js for inbound order.
 *
 * Stabilized surface (tested): /start /guide /map /today /morning /energy
 * /reset /mirror /language /status
 */

const { resolveLang, fromTelegramCode } = require("../i18n/languageDetect");
const { command: logCommand } = require("../logging/log");
const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { handleEnergy } = require("./energyHandler");
const {
  handlePlanCommand,
  handleFocusCommand,
  handleResetCommand
} = require("./planTracking");
const { buildStatusReply } = require("./status");
const { buildGuideReply, buildMapReply } = require("./guide");
const {
  startOnboarding,
  getStartReply,
  skipOnboarding,
  buildProfileReply
} = require("./onboarding");
const { updateSession, getSession } = require("../session/sessionStore");
const { clearRemoteSession } = require("../db/syncState");
const { handleTrainingCommand } = require("./dragonTraining");
const { appendProgramProgress } = require("./programFlow");
const {
  activateMode,
  deactivateMode,
  pauseMode,
  resumeMode,
  buildWhereAmiReply
} = require("../core/modeEngine");
const {
  buildMorningReply,
  buildMiddayReply,
  buildEveningReply,
  buildDailyReply,
  buildPathReply,
  buildLevelReply,
  buildStreakReply
} = require("./dailyRhythm");
const { buildZoneReply } = require("./trainingZones");
const { recordCompletedRitual } = require("../core/seriousnessEngine");

const PROGRAM_WRAP = new Set([
  "/program",
  "/morning",
  "/energy",
  "/mission",
  "/body",
  "/breath",
  "/walk",
  "/train",
  "/evening",
  "/mirror"
]);

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
    case "/start": {
      const id = uid(message);
      const s0 = getSession(id);
      if (s0.onboardingCompleted) {
        updateSession(id, { awaitingWhyHere: true });
        reply = r.obStartReturning;
        break;
      }
      startOnboarding(id);
      reply = getStartReply(lang, getSession(id));
      break;
    }
    case "/setup":
      startOnboarding(uid(message));
      reply = getStartReply(lang, getSession(uid(message)));
      break;
    case "/skip":
      reply = skipOnboarding(uid(message), lang);
      break;
    case "/profile":
      reply = buildProfileReply(session, lang);
      break;
    case "/help":
      reply = buildGuideReply(lang);
      break;
    case "/commands":
      reply = r.tCommandsCategorized;
      break;
    case "/map":
      reply = buildMapReply(lang);
      break;
    case "/mode":
      reply = activateMode(uid(message), lang);
      break;
    case "/off":
      reply = deactivateMode(uid(message), lang);
      break;
    case "/pause":
      reply = pauseMode(uid(message), lang);
      break;
    case "/resume":
      reply = resumeMode(uid(message), lang);
      break;
    case "/whereami":
      reply = buildWhereAmiReply(getSession(uid(message)), lang);
      break;

    /* ── Daily Rhythm (rich handlers) ── */
    case "/morning":
      reply = buildMorningReply(message, session, lang);
      recordCompletedRitual(uid(message), getSession(uid(message)));
      break;
    case "/midday":
      reply = buildMiddayReply(session, lang);
      break;
    case "/daily":
      reply = buildDailyReply(message, session, lang);
      break;
    case "/today": {
      const { handleTrainingCommand } = require("./dragonTraining");
      reply = handleTrainingCommand("/today", message, session, lang);
      break;
    }

    /* ── Dragon Path ── */
    case "/path":
      reply = buildPathReply(session, lang);
      break;
    case "/level":
      reply = buildLevelReply(session, lang);
      break;
    case "/streak":
      reply = buildStreakReply(session, lang);
      break;

    /* ── Training Zones ── */
    case "/mind":
    case "/body":
    case "/breath":
    case "/balance":
    case "/lettinggo":
      reply = buildZoneReply(command, session, lang);
      break;

    /* ── Evening (rich override from dailyRhythm) ── */
    case "/evening":
      reply = buildEveningReply(message, session, lang);
      recordCompletedRitual(uid(message), getSession(uid(message)));
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
    case "/mirror": {
      const { buildMirrorProtocolReply } = require("./dailyProtocol");
      reply = buildMirrorProtocolReply(message, session, lang);
      break;
    }
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
  if (reply && PROGRAM_WRAP.has(command)) {
    reply = appendProgramProgress(uid(message), command, reply, lang);
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
