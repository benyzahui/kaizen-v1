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
  t = dedupeEmojiHeaders(t);
  return t.trim();
}

function dedupeEmojiHeaders(text) {
  const seen = new Set();
  const out = [];
  for (const line of String(text).split(/\n/)) {
    const m = line.match(/^([\u{1F300}-\u{1FAFF}\u2600-\u27BF🧠⚔🌱💪🔥📉🌘🌙⚡🫀💼]+)\s/u);
    if (m) {
      const key = m[1];
      if (seen.has(key)) continue;
      seen.add(key);
    }
    out.push(line);
  }
  return out.join("\n");
}

module.exports = { formatPremiumMessage, dedupeEmojiHeaders };
