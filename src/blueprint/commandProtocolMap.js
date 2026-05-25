/**
 * Command → Dragon Blueprint pillar mapping.
 */

const { getPillar } = require("./blueprintPillars");

const COMMAND_TO_PILLAR = {
  "/energy": "energy_awareness",
  "/fasting": "fasting_reset",
  "/training": "movement_training",
  "/reset": "nervous_stabilization",
  "/focus": "discipline_focus",
  "/morning": "morning_activation",
  "/midday": "midday_stabilization",
  "/evening": "evening_recovery",
  "/trade": "trading_psychology",
  "/status": "daily_state"
};

/** /focus also pulls digital detox framing */
const COMMAND_SECONDARY = {
  "/focus": "digital_detox"
};

/**
 * @param {string} command
 * @returns {string|null} pillar id
 */
function getPillarForCommand(command) {
  const c = String(command || "").toLowerCase();
  return COMMAND_TO_PILLAR[c] || null;
}

/**
 * @param {string} command
 */
function getNextCommandHint(command, pillarId) {
  const p = getPillar(pillarId);
  const related = p?.related || [];
  if (command === "/reset") return "/morning";
  if (command === "/trade" && related.includes("/reset")) return "/reset";
  if (command === "/energy") return "/morning";
  if (command === "/fasting") return "/reset";
  if (command === "/training") return "/midday";
  if (command === "/focus") return "/midday";
  if (command === "/morning") return "/midday";
  if (command === "/midday") return "/evening";
  if (command === "/evening") return null;
  if (command === "/status") return "/guide";
  return related[0] || null;
}

module.exports = {
  COMMAND_TO_PILLAR,
  COMMAND_SECONDARY,
  getPillarForCommand,
  getNextCommandHint
};
