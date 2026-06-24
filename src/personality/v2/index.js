/**
 * KaiZen V2 personality — public exports.
 */

const dragonIdentity = require("./dragonIdentity");
const welcomeScreen = require("./welcomeScreen");
const energyTone = require("./energyTone");
const emojiSystem = require("./emojiSystem");
const gifCatalog = require("./gifCatalog");
const gifIntegration = require("./gifIntegration");
const dailyPresenceV2 = require("./dailyPresenceV2");
const personalityEngine = require("./personalityEngine");

module.exports = {
  ...dragonIdentity,
  ...welcomeScreen,
  ...energyTone,
  ...emojiSystem,
  ...gifCatalog,
  ...gifIntegration,
  ...dailyPresenceV2,
  ...personalityEngine
};
