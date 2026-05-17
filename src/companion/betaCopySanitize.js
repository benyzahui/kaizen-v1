/**
 * Closed beta — strip debug/AI/technical residue from outgoing Telegram copy.
 */

const { humanizeTechLanguage } = require("./betaShipLock");

const TECH_LINE_RE =
  /\b(debugging in production|production environment|staging|language model|as an AI|chatbot|neural|algorithm)\b/i;

const AI_DISCLAIMER_RE =
  /\b(this is not random AI|not random AI chat|I am an AI|I'm an AI)\b/i;

/**
 * @param {string} text
 */
function sanitizeBetaCopy(text) {
  let t = String(text || "");
  if (!t) return t;

  t = t
    .replace(/\bdebugging in production\b/gi, "running hot")
    .replace(/\bproduction environment\b/gi, "overdrive")
    .replace(/\n{3,}/g, "\n\n");

  t = humanizeTechLanguage(t, "hu");
  t = humanizeTechLanguage(t, "en");
  t = humanizeTechLanguage(t, "ro");

  const lines = t
    .split(/\n/)
    .map((l) => l.trimEnd())
    .filter((line) => {
      const trim = line.trim();
      if (!trim) return true;
      if (/^→\s*\/\w+/.test(trim)) return false;
      if (TECH_LINE_RE.test(trim) && trim.length < 120) return false;
      if (AI_DISCLAIMER_RE.test(trim)) return false;
      return true;
    });

  return lines.join("\n").trim();
}

module.exports = { sanitizeBetaCopy, TECH_LINE_RE };
