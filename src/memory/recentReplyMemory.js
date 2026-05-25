/**
 * Anti-loop memory — last replies, mantra IDs, opening IDs.
 */

const { snippetKey } = require("../conversation/responseVariation");
const { updateSession } = require("../session/sessionStore");

const MAX_REPLIES = 20;
const MAX_MANTRA_IDS = 30;
const MAX_OPENING_IDS = 20;

/**
 * @param {string} a
 * @param {string} b
 */
function similarityScore(a, b) {
  const x = snippetKey(a);
  const y = snippetKey(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const short = x.length < y.length ? x : y;
  const long = x.length < y.length ? y : x;
  if (long.includes(short) && short.length > 24) return 0.85;
  const aw = new Set(x.split(/\s+/).filter((w) => w.length > 3));
  const bw = new Set(y.split(/\s+/).filter((w) => w.length > 3));
  if (!aw.size || !bw.size) return 0;
  let inter = 0;
  for (const w of aw) if (bw.has(w)) inter += 1;
  return inter / Math.max(aw.size, bw.size);
}

/**
 * @param {string} body
 * @param {object} session
 */
function isTooSimilarToRecent(body, session) {
  const recent = session?.recentReplyBodies || [];
  const key = snippetKey(body);
  if (recent.includes(key)) return true;
  for (const prev of recent) {
    if (similarityScore(body, prev) >= 0.72) return true;
  }
  return false;
}

/**
 * @param {string[]} variants
 * @param {object} session
 */
function pickNonRepeatingVariant(variants, session) {
  const arr = variants.filter(Boolean);
  if (!arr.length) return "";
  const unseen = arr.filter((v) => !isTooSimilarToRecent(v, session));
  const pool = unseen.length ? unseen : arr;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

/**
 * @param {string|number} userId
 * @param {object} session
 * @param {object} meta
 */
function recordOutboundReply(userId, session, meta = {}) {
  const body = String(meta.body || "").trim();
  if (!body) return;

  const replies = [...(session?.recentReplyBodies || []), snippetKey(body)].slice(
    -MAX_REPLIES
  );

  const patch = {
    recentReplyBodies: replies,
    lastReplyAt: Date.now()
  };

  if (meta.mantraId) {
    const ids = [...(session?.recentMantraIds || []), meta.mantraId].slice(-MAX_MANTRA_IDS);
    patch.recentMantraIds = ids;
  }
  if (meta.openingId) {
    const ids = [...(session?.recentOpeningIds || []), meta.openingId].slice(
      -MAX_OPENING_IDS
    );
    patch.recentOpeningIds = ids;
  }

  updateSession(userId, patch);
}

/**
 * @param {object} session
 */
function repetitionScore(session) {
  const bodies = session?.recentReplyBodies || [];
  if (bodies.length < 4) return 100;
  let dupes = 0;
  const seen = new Set();
  for (const b of bodies) {
    if (seen.has(b)) dupes += 1;
    seen.add(b);
  }
  const ratio = dupes / bodies.length;
  return Math.round(Math.max(0, 100 - ratio * 200));
}

module.exports = {
  recordOutboundReply,
  isTooSimilarToRecent,
  pickNonRepeatingVariant,
  similarityScore,
  repetitionScore,
  MAX_REPLIES
};
