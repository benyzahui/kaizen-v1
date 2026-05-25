/**
 * Allowed protocol command surface.
 */

const ALLOWED_COMMANDS = new Set([
  "/start",
  "/morning",
  "/midday",
  "/evening",
  "/energy",
  "/reset",
  "/focus",
  "/fasting",
  "/training",
  "/trade",
  "/status",
  "/language",
  "/skip"
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
