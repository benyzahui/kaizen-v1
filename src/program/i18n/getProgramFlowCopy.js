const en = require("./programFlowCopy.en");
const hu = require("./programFlowCopy.hu");
const ro = require("./programFlowCopy.ro");

function getProgramFlowCopy(lang) {
  const key = String(lang || "en").toLowerCase();
  return { en, hu, ro }[key] || en;
}

module.exports = { getProgramFlowCopy };
