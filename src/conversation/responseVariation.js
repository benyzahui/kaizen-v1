/**
 * Session-scoped opening/body variety: avoid repeating the same first line
 * inside one 24h session (cheap snippet key, not full NLP).
 */

const { pickSeeded } = require("../personality/kaizenVoice");

/**
 * @param {string} text
 */
function snippetKey(text) {
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const first = lines[0] || "";
  return first.toLowerCase().slice(0, 96);
}

/**
 * @param {object} session
 * @param {string|number} userId
 * @param {string[]} variants
 */
function pickUnseenVariant(session, userId, variants) {
  const arr = Array.isArray(variants) ? variants.filter(Boolean) : [];
  if (!arr.length) return "";
  const used = new Set(session.recentCoachSnippets || []);
  const unseen = arr.filter((v) => v && !used.has(snippetKey(v)));
  const pool = unseen.length ? unseen : arr;
  return pickSeeded(pool, `${userId}:${arr.length}`);
}

module.exports = { snippetKey, pickUnseenVariant };
