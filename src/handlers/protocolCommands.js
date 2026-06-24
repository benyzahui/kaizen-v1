/**
 * Allowed protocol command surface.
 */

const ALLOWED_COMMANDS = new Set([
  "/start",
  "/guide",
  "/panel",
  "/morning",
  "/midday",
  "/evening",
  "/discipline",
  "/stabilization",
  "/training",
  "/lettinggo",
  "/recovery",
  "/energy",
  "/trading",
  "/breath",
  "/reset",
  "/focus",
  "/fasting",
  "/trade",
  "/status",
  "/language",
  "/skip",
  "/program",
  "/whereami",
  "/pause",
  "/resume",
  "/stop",
  "/weekly",
  "/path",
  "/today",
  "/reflection",
  "/challenge"
]);

const ONBOARDING_SAFE = new Set(["/start", "/language", "/skip"]);

/**
 * @param {string} command
 */
function isAllowedProtocolCommand(command) {
  return ALLOWED_COMMANDS.has(String(command || "").toLowerCase());
}

/**
 * @param {string} command
 */
function isOnboardingSafeCommand(command) {
  return ONBOARDING_SAFE.has(String(command || "").toLowerCase());
}

module.exports = {
  ALLOWED_COMMANDS,
  ONBOARDING_SAFE,
  isAllowedProtocolCommand,
  isOnboardingSafeCommand
};
