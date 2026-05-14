/**
 * Phase 1 router — no database, no sessions.
 * Each command returns a static, tone-shaped reply.
 */

const tone = require("../personality/tone");
const { handleEnergy } = require("./energy");

function extractCommand(text = "") {
  return text.trim().split(/\s+/)[0].toLowerCase();
}

async function routeMessage(message) {
  const command = extractCommand(message.text || "");

  switch (command) {
    case "/start":
      return tone.startLine();
    case "/help":
      return tone.helpMenu();
    case "/energy":
      return handleEnergy(message);
    case "/pulse":
      return tone.pulsePrompt();
    case "/mirror":
      return tone.mirrorPrompt();
    case "/trade":
      return tone.tradePrompt();
    default:
      return tone.unknownCommand();
  }
}

module.exports = { routeMessage };
