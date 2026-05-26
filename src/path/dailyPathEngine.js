/**
 * Daily path engine — personalize rhythm, mantra, challenges from primary path + state.
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { getSession, updateSession } = require("../session/sessionStore");
const {
  PATHS,
  PATH_IDS,
  LEGACY_TO_PATH,
  PATH_COPY,
  PATH_MENU
} = require("./primaryPaths");
const { mapPathToMode } = require("../core/protocolStateEngine");

/**
 * @param {object} session
 * @returns {string}
 */
function resolvePrimaryPathId(session) {
  const raw = session?.activePrimaryPath || session?.userPrimaryPath || "discipline";
  if (PATHS[raw]) return raw;
  return LEGACY_TO_PATH[raw] || "stabilization";
}

/**
 * @param {string} pathId
 */
function getPathDef(pathId) {
  return PATHS[pathId] || PATHS.stabilization;
}

/**
 * Merge path influence into rhythm/atmosphere context.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function enrichRhythmContext(session, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pathId = resolvePrimaryPathId(session);
  const def = getPathDef(pathId);

  const energyState =
    session?.energyState || session?.protocolState?.energyState || "stable";
  const disciplineState =
    session?.disciplineState || session?.protocolState?.disciplineState || "focused";
  const nervousSystemState =
    session?.nervousSystemState || session?.protocolState?.nervousSystemState || "calm";

  let activeMode = def.activeMode;
  if (energyState === "exhausted" || energyState === "low") {
    if (pathId === "warrior") activeMode = "recovery";
  }
  if (nervousSystemState === "overloaded" || nervousSystemState === "anxious") {
    if (pathId !== "trading") activeMode = "stabilization";
  }

  return {
    lang: locked,
    primaryPath: pathId,
    energyState,
    disciplineState,
    nervousSystemState,
    activeMode,
    pathMantraTags: def.mantraTags,
    pathChallengeCategories: def.challengeCategories,
    atmosphere: def.atmosphere,
    userName: session?.userName || null,
    mission: session?.currentMission?.trim() || session?.sessionTodayFocus || null
  };
}

/**
 * Short path cue for daily phase messages.
 */
function pickPathCue(pathId, phase, lang, userId, dateKey) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const copy = PATH_COPY[locked]?.[pathId] || PATH_COPY.en[pathId];
  const pool = copy?.cues?.[phase] || copy?.cues?.morning || [];
  if (!pool.length) return "";
  return pickSeeded(pool, `${userId}|pathCue|${pathId}|${phase}|${dateKey}`);
}

/**
 * @param {string|number} userId
 * @param {string} pathId
 * @param {'en'|'hu'|'ro'} lang
 */
function setPrimaryPath(userId, pathId, lang = "en") {
  let id = PATHS[pathId] ? pathId : LEGACY_TO_PATH[pathId] || pathId;
  if (!PATHS[id]) id = "stabilization";
  const def = getPathDef(id);
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const label = PATH_COPY[locked]?.[id]?.label || id;
  const session = getSession(userId);

  updateSession(userId, {
    activePrimaryPath: id,
    userPrimaryPath: id,
    activeMode: def.activeMode,
    userPurpose: label,
    protocolState: {
      ...(session?.protocolState || {}),
      activeMode: def.activeMode
    }
  });

  return { pathId: id, label, def };
}

/**
 * Parse /path argument.
 * @param {string} text full message
 */
function parsePathArg(text) {
  const parts = String(text || "").trim().split(/\s+/);
  const arg = (parts[1] || "").toLowerCase();
  if (!arg) return null;
  const aliases = {
    1: "discipline",
    2: "energy",
    3: "stabilization",
    4: "warrior",
    5: "recovery",
    6: "trading",
    fegyelem: "discipline",
    disciplina: "discipline",
    energia: "energy",
    stabil: "stabilization",
    stabilizare: "stabilization",
    harcos: "warrior",
    warrior: "warrior",
    recovery: "recovery",
    recuperare: "recovery",
    trading: "trading",
    trade: "trading"
  };
  if (aliases[arg]) return aliases[arg];
  if (PATHS[arg]) return arg;
  return null;
}

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} [text] full command message
 */
function buildPathCommandReply(session, lang, text = "/path") {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const menu = PATH_MENU[locked] || PATH_MENU.en;
  const pathId = resolvePrimaryPathId(session);
  const label = PATH_COPY[locked]?.[pathId]?.label || pathId;
  const def = getPathDef(pathId);

  const switchTo = parsePathArg(text);
  if (switchTo && switchTo !== pathId) {
    const uid = session.userId || session.telegramUserId || "0";
    setPrimaryPath(uid, switchTo, locked);
    const newDef = getPathDef(switchTo);
    const cue = pickPathCue(switchTo, "morning", locked, uid, "path_switch");
    return (menu.switched || "")
      .replace("{path}", PATH_COPY[locked]?.[switchTo]?.label || switchTo)
      .replace("{emoji}", newDef.emoji)
      .replace("{cue}", cue);
  }
  if (switchTo === null && String(text).trim().split(/\s+/).length > 1) {
    return menu.invalid;
  }

  const cue = pickPathCue(pathId, "midday", locked, "path_cmd", "menu");
  return [
    menu.title,
    "",
    (menu.current || "").replace("{path}", label),
    def.emoji + " " + cue,
    "",
    menu.hint
  ].join("\n");
}

/**
 * Suggested panel command for path.
 */
function suggestedPanelForPath(session) {
  return getPathDef(resolvePrimaryPathId(session)).panelFolder;
}

module.exports = {
  PATH_IDS,
  resolvePrimaryPathId,
  getPathDef,
  enrichRhythmContext,
  pickPathCue,
  setPrimaryPath,
  parsePathArg,
  buildPathCommandReply,
  suggestedPanelForPath,
  mapPathToMode
};
