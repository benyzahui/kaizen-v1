const en = require("./dailyTrackingCopy.en");
const hu = require("./dailyTrackingCopy.hu");
const ro = require("./dailyTrackingCopy.ro");

const BY_LANG = { en, hu, ro };

function getDailyTrackingCopy(lang) {
  const key = String(lang || "en").toLowerCase();
  return BY_LANG[key] || en;
}

module.exports = { getDailyTrackingCopy, BY_LANG };
