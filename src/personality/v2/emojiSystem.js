/**
 * V2 emoji system — premium Dragon Blueprint signaling only.
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
  "⭐"
]);

const BLOCKED_EMOJI = new Set(["🤣", "😂", "🤪", "💀", "🤡", "😭", "🥵", "😈"]);

const EMOJI_LIMITS = {
  normal: 3,
  scheduled: 5,
  celebration: 6
};

const EMOJI_CHAR_RE = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu;

/**
 * @param {object} [meta]
 */
function resolveEmojiCap(meta = {}) {
  if (meta.celebration) return EMOJI_LIMITS.celebration;
  if (meta.automation || meta.scheduled || String(meta.openingId || "").startsWith("auto_")) {
    return EMOJI_LIMITS.scheduled;
  }
  return EMOJI_LIMITS.normal;
}

/**
 * @param {string} text
 */
function countEmojis(text) {
  const m = String(text || "").match(EMOJI_CHAR_RE);
  return m ? m.length : 0;
}

/**
 * @param {string} body
 * @param {number} [max]
 */
function sanitizeEmoji(body, max = EMOJI_LIMITS.normal) {
  let text = String(body || "");
  text = text.replace(EMOJI_CHAR_RE, (m) => {
    if (BLOCKED_EMOJI.has(m)) return "";
    return ALLOWED_EMOJI.has(m) ? m : "";
  });
  let total = 0;
  return text
    .replace(EMOJI_CHAR_RE, (m) => {
      if (total >= max) return "";
      total += 1;
      return m;
    })
    .trim();
}

module.exports = {
  ALLOWED_EMOJI,
  BLOCKED_EMOJI,
  EMOJI_LIMITS,
  EMOJI_CHAR_RE,
  resolveEmojiCap,
  countEmojis,
  sanitizeEmoji
};
