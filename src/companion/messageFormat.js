/**
 * Premium block spacing for readable Telegram replies.
 */

/**
 * Double-space before emoji section headers; trim wall paragraphs.
 * @param {string} text
 */
function formatPremiumMessage(text) {
  let t = String(text || "").trim();
  if (!t) return t;

  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.replace(
    /\n([\u{1F300}-\u{1FAFF}\u2600-\u27BF]|[🧠⚔🌱💪🔥📉🌘🌙⚡🫀💼])/gu,
    "\n\n$1"
  );
  t = t.replace(/\n\n\n+/g, "\n\n");
  return t.trim();
}

module.exports = { formatPremiumMessage };
