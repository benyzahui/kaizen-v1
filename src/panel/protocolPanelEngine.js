/**
 * Manual protocol library — /panel and folder commands.
 */

const { lines } = require("../personality/kaizenVoice");
const { getPanelCopy } = require("./i18n/getPanelCopy");
const { guardFolderSurf } = require("./folderSurfGuard");

/** @type {Record<string, string>} */
const COMMAND_TO_FOLDER = {
  "/discipline": "discipline",
  "/stabilization": "stabilization",
  "/training": "training",
  "/lettinggo": "lettinggo",
  "/recovery": "recovery",
  "/energy": "energy",
  "/trading": "trading",
  "/trade": "trading",
  "/fasting": "fasting",
  "/breath": "breath"
};

const PANEL_COMMANDS = new Set(["/panel", ...Object.keys(COMMAND_TO_FOLDER)]);

/**
 * @param {string} command
 */
function isPanelCommand(command) {
  return PANEL_COMMANDS.has(String(command || "").toLowerCase());
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function buildPanelList(lang) {
  const copy = getPanelCopy(lang);
  const rows = copy.folderCommands.map((f) => `${f.label}\n${f.cmd}`);
  return lines(copy.panelTitle, "", copy.panelIntro, "", ...rows, "", copy.panelFooter);
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} folderId
 */
function formatFolderReply(lang, folderId) {
  const copy = getPanelCopy(lang);
  const folder = copy.folders[folderId];
  if (!folder) return "";

  const L = copy.labels;
  return lines(
    folder.title,
    "",
    `${L.purpose}:`,
    folder.purpose,
    "",
    `${L.beginner}:`,
    folder.beginner,
    "",
    `${L.intermediate}:`,
    folder.intermediate,
    "",
    `${L.advanced}:`,
    folder.advanced,
    "",
    `${L.today}:`,
    folder.today
  );
}

/**
 * @param {string} command
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 */
function handlePanelCommand(command, lang, session, userId) {
  const cmd = String(command || "").toLowerCase();
  const locked = lang === "hu" || lang === "ro" ? lang : "en";

  const surf = guardFolderSurf(userId, cmd, session);
  if (surf.blocked) return surf.message;

  if (cmd === "/panel") {
    return buildPanelList(locked);
  }

  const folderId = COMMAND_TO_FOLDER[cmd];
  if (!folderId) {
    return buildPanelList(locked);
  }

  return formatFolderReply(locked, folderId);
}

module.exports = {
  COMMAND_TO_FOLDER,
  PANEL_COMMANDS,
  isPanelCommand,
  buildPanelList,
  formatFolderReply,
  handlePanelCommand
};
