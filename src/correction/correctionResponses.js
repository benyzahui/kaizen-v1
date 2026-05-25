/**
 * Micro correction + discipline tone — calm, no shame.
 */

const { lines } = require("../personality/kaizenVoice");
const { getCorrectionCopy } = require("./i18n/getCorrectionCopy");
const { pickNonRepeatingVariant } = require("../memory/recentReplyMemory");

const SHAME_RE = /(szégyen|guilt|failed you|loser|baszd|shame on)/i;

const MICRO_KEYS = ["drift", "scatter", "bodyTired", "returnPath", "momentum"];

/**
 * @param {string} lang
 * @param {object} session
 * @param {'low'|'medium'|'high'} risk
 * @param {object} ctx
 */
function pickMicroCorrection(lang, session, risk, ctx = {}) {
  const c = getCorrectionCopy(lang);
  let key = "returnPath";
  if (ctx.exhausted || ctx.lowEnergy) key = "bodyTired";
  else if (ctx.scatter || ctx.focusDrift) key = "scatter";
  else if (ctx.inactive || risk === "high") key = "drift";
  else if (risk === "medium") key = "momentum";

  const pool = MICRO_KEYS.map((k) => c.micro[k]).filter(Boolean);
  const body = pickNonRepeatingVariant(pool, session) || c.micro[key];
  if (SHAME_RE.test(body)) throw new Error("shame_leak");
  return body;
}

/**
 * @param {string} lang
 */
function buildOverloadCorrection(lang) {
  const c = getCorrectionCopy(lang);
  return lines(c.overload.title, "", ...c.overload.steps, "", c.overload.cmd);
}

/**
 * @param {string} lang
 */
function buildChaoticInterruption(lang) {
  const c = getCorrectionCopy(lang);
  return lines(c.chaotic.body, "", c.chaotic.action);
}

/**
 * @param {string} lang
 * @param {object} session
 */
function buildDisciplineNudge(lang, session) {
  const c = getCorrectionCopy(lang);
  const pool = [c.discipline.mission, c.discipline.execution, c.discipline.attention];
  return pickNonRepeatingVariant(pool, session) || c.discipline.execution;
}

module.exports = {
  pickMicroCorrection,
  buildOverloadCorrection,
  buildChaoticInterruption,
  buildDisciplineNudge,
  SHAME_RE
};
