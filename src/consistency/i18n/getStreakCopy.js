const en = require("./streakCopy.en");
const hu = require("./streakCopy.hu");
const ro = require("./streakCopy.ro");

function getStreakCopy(lang) {
  const key = String(lang || "en").toLowerCase();
  return { en, hu, ro }[key] || en;
}

module.exports = { getStreakCopy };
