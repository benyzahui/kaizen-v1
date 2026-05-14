/**
 * Cheap fingerprint for anti-loop: same coaching shape twice → third reply shifts.
 */

function replyFingerprint(text) {
  const s = String(text || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 120);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return String(h);
}

module.exports = { replyFingerprint };
