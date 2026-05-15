/**
 * /energy command + natural-language energy routing (V1.7).
 * @typedef {'en'|'hu'|'ro'} Lang
 * @typedef {'general'|'trading'|'body'|'emotion'|'work'} EnergyLens
 */

const { buildEnergyRead } = require("../companion/energyEngine");
const { loadMemoryHierarchy } = require("../companion/memoryHierarchy");
const { getSession } = require("../session/sessionStore");

/**
 * @param {string} [arg]
 * @returns {EnergyLens}
 */
function mapArgToLens(arg) {
  const a = String(arg || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  if (!a) return "general";
  if (/^(trading|trade|trades)$/.test(a)) return "trading";
  if (/^(body|test|somatic|nervous)$/.test(a)) return "body";
  if (/^(emotion|emotional|feelings|erzelm|erzelem|erzelmi)$/.test(a)) return "emotion";
  if (/^(work|business|focus|munca|munka)$/.test(a)) return "work";
  return "general";
}

/**
 * @param {string} text
 * @returns {EnergyLens}
 */
function parseSlashEnergyLens(text) {
  const raw = String(text || "").trim();
  const parts = raw.split(/\s+/).filter(Boolean);
  if (!parts.length) return "general";
  const cmd = parts[0].split("@")[0].toLowerCase();
  if (cmd !== "/energy") return "general";
  return mapArgToLens(parts[1]);
}

/**
 * Lens from open-text energy prompts (Hungarian + English patterns).
 * @param {string} text
 * @returns {EnergyLens}
 */
function parseNaturalEnergyLens(text) {
  const t = String(text || "").trim();
  const low = t.toLowerCase();

  const huTail = t.match(
    /(?:mai\s+energia|energia\s+ma|a\s+mai\s+nap\s+energi[aá]ja)\s+(trading|trade|test|munka|érzelem|erzelem|érzelmi|erzelmi)\b/i
  );
  if (huTail) {
    const w = huTail[1].toLowerCase();
    if (/^trading|^trade/.test(w)) return "trading";
    if (w === "test") return "body";
    if (/erzelem|érzelem|erzelmi|érzelmi/.test(w)) return "emotion";
    if (w === "munka") return "work";
  }

  if (/\b(today'?s energy|energy today)\b[\s\S]{0,40}\btrading\b/i.test(low))
    return "trading";
  if (/\b(today'?s energy|energy today)\b[\s\S]{0,40}\b(body|nervous|somatic)\b/i.test(low))
    return "body";
  if (/\b(today'?s energy|energy today)\b[\s\S]{0,40}\b(emotion|feeling)\b/i.test(low))
    return "emotion";
  if (/\b(today'?s energy|energy today)\b[\s\S]{0,40}\b(work|business|focus)\b/i.test(low))
    return "work";

  if (/\benergy\b[\s\S]{0,30}\btrading\b/i.test(low)) return "trading";
  if (/\benergy\b[\s\S]{0,30}\b(body|nervous)\b/i.test(low)) return "body";

  return "general";
}

/**
 * @param {object} message
 * @param {Lang} lang
 */
async function handleEnergy(message, lang = "en") {
  const lens = parseSlashEnergyLens(message.text || "");
  const uid = message.from?.id ?? message.chat?.id;
  const memory = loadMemoryHierarchy(getSession(uid));
  return buildEnergyRead(new Date(), lang, lens, { memory });
}

/**
 * @param {Date} [date]
 * @param {Lang} [lang]
 * @param {EnergyLens} [lens]
 */
function buildDailyEnergyReply(date = new Date(), lang = "en", lens = "general") {
  return buildEnergyRead(date, lang, lens, null);
}

/**
 * Full structured read for natural-language energy detection.
 * @param {string} text
 * @param {Lang} lang
 */
function buildEnergyFromOpenText(text, lang = "en", userId = null) {
  const lens = parseNaturalEnergyLens(text);
  const memory =
    userId != null ? loadMemoryHierarchy(getSession(userId)) : null;
  return buildEnergyRead(new Date(), lang, lens, memory ? { memory } : null);
}

module.exports = {
  handleEnergy,
  buildDailyEnergyReply,
  buildEnergyFromOpenText,
  parseSlashEnergyLens,
  parseNaturalEnergyLens,
  mapArgToLens
};
