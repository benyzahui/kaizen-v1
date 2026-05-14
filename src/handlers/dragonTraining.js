/**
 * Dragon Training OS — command handlers (V1.8).
 * Keeps copy in i18n trainingProtocol.*; updates session/profile fields where needed.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession, getSession } = require("../session/sessionStore");

function uid(message) {
  return String(message.from?.id ?? message.chat?.id ?? "");
}

function argsFrom(message) {
  return String(message.text || "")
    .trim()
    .split(/\s+/)
    .slice(1)
    .filter(Boolean);
}

function mantraPool(r, session) {
  const p = session.userPrimaryPath || "default";
  const pools = r.tMorningMantras || {};
  const pool = pools[p]?.length ? pools[p] : pools.default || [];
  return pool.length ? pool : ["Today: one path. One clean action."];
}

function pickMantra(r, session, userId) {
  const pool = mantraPool(r, session);
  const dk = new Date().toISOString().slice(0, 10);
  const seed = `${userId}|${dk}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

/**
 * @param {string} arena
 * @param {object} r responses bundle
 */
function businessArenaReply(arena, r) {
  const a = String(arena || "").toLowerCase();
  if (a === "1" || a === "admin" || a === "administration")
    return r.tBusinessAdmin;
  if (a === "2" || a === "sales" || a === "sale") return r.tBusinessSales;
  if (a === "3" || a === "analytics" || a === "analytic")
    return r.tBusinessAnalytics;
  if (a === "4" || a === "trading" || a === "trade")
    return r.tBusinessTrading;
  return r.tBusinessMenu;
}

/**
 * @returns {string|null} null = not handled here (fall through to rituals / unknown)
 */
function handleTrainingCommand(command, message, session, lang) {
  const r = getResponses(lang);
  const id = uid(message);
  const parts = argsFrom(message);
  const dk = new Date().toISOString().slice(0, 10);

  switch (command) {
    case "/program":
      return r.tProgramActivated;
    case "/today": {
      const base = r.tTodayBody;
      const m = session.currentMission?.trim();
      if (m) return lines(base, "", `${r.tProfileMissionLine} ${m}`);
      return base;
    }
    case "/mission": {
      if (parts.length) {
        const line = parts.join(" ").trim().slice(0, 500);
        updateSession(id, { currentMission: line });
        return r.tMissionStored(line);
      }
      if (session.currentMission?.trim()) {
        return lines(
          r.tProfileMissionLine,
          session.currentMission.trim(),
          "",
          r.tMissionUpdateHint
        );
      }
      return r.tMissionEmpty;
    }
    case "/done":
      return r.tDoneBody;
    case "/morning": {
      const mantra = pickMantra(r, session, id);
      updateSession(id, {
        lastMantraDate: dk,
        programMode: session.programMode || "dragon_training"
      });
      return lines(
        r.tMorningHeader,
        "",
        mantra,
        "",
        r.tMorningFooter
      );
    }
    case "/mantra":
      return r.tMantraSameAsMorning;
    case "/evening":
      updateSession(id, { lastMirrorDate: dk });
      return r.tEveningMirror;
    case "/procrastination":
      return r.tProcrastinationProtocol;
    case "/lettinggo":
      return r.tLettingGoProtocol;
    case "/resistance":
      return r.tResistanceProtocol;
    case "/business":
      if (parts.length) return businessArenaReply(parts[0], r);
      return r.tBusinessMenu;
    case "/admin":
      return r.tBusinessAdmin;
    case "/sales":
      return r.tBusinessSales;
    case "/analytics":
      return r.tBusinessAnalytics;
    case "/moon":
      return r.tMoonPortal;
    case "/numerology":
      return r.tNumerologyPortal;
    case "/astro":
      return r.tAstroPortal;
    default:
      return null;
  }
}

module.exports = {
  handleTrainingCommand,
  pickMantra,
  mantraPool,
  businessArenaReply
};
