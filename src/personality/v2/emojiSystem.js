/**
 * V2 emoji system — allowed set, max 3–5 per message.
 */

const ALLOWED_EMOJI = new Set([
  "🐉",
  "🔥",
  "⚡",
  "🌙",
  "☀️",
  "🌿",
  "💧",
  "🎯",
  "🧘",
  "🪞",
  "⭐",
  "⚔",
  "🌘",
  "🫀",
  "🌱",
  "🌊"
]);

const MAX_EMOJI_PER_MESSAGE = 5;
const EMOJI_CHAR_RE = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu;

/**
 * @param {string} text
 */
function countEmojis(text) {
  const m = String(text || "").match(EMOJI_CHAR_RE);
  return m ? m.length : 0;
}

/**
 * Remove disallowed emoji; cap total count.
 * @param {string} body
 */
function sanitizeEmoji(body) {
  let text = String(body || "");
  text = text.replace(EMOJI_CHAR_RE, (m) => (ALLOWED_EMOJI.has(m) ? m : ""));
  let total = 0;
  return text
    .replace(EMOJI_CHAR_RE, (m) => {
      if (total >= MAX_EMOJI_PER_MESSAGE) return "";
      total += 1;
      return m;
    })
    .trim();
}

module.exports = {
  ALLOWED_EMOJI,
  MAX_EMOJI_PER_MESSAGE,
  countEmojis,
  sanitizeEmoji
};
