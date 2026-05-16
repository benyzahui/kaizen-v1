/**
 * Lightweight thread continuity — activity → return follow-up.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");

const ACTIVITY_PATTERNS = [
  { type: "run", re: /(megyek futni|futni megyek|kimegyek futni|going for a run|went for a run|futottam)/i },
  { type: "workout", re: /(megyek edzeni|edzésre megyek|going to the gym|went to the gym|edzettem)/i },
  { type: "walk", re: /(sétálni megyek|megyek sétálni|going for a walk|took a walk)/i },
  { type: "breath", re: /(lélegzet|breathing|meditálok|meditating)/i },
  { type: "trade", re: /(trade előtt|before (the )?trade|kereskedés előtt|pre.?market)/i }
];

const RETURN_RE =
  /^(visszajöttem|vissza vagyok|visszaértem|itt vagyok újra|i'?m back|im back|back now|am revenit|m-am întors|i am revenit)[\s!.?]*$/i;

/**
 * @param {string} text
 * @returns {null | { type: string, at: number, snippet: string }}
 */
function extractThreadActivity(text) {
  const t = String(text || "").trim();
  if (t.length < 4) return null;
  for (const p of ACTIVITY_PATTERNS) {
    if (p.re.test(t)) {
      return { type: p.type, at: Date.now(), snippet: t.slice(0, 120) };
    }
  }
  return null;
}

/**
 * @param {object} session
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 */
function tryThreadReturnReply(session, text, lang) {
  const raw = String(text || "").trim();
  if (!RETURN_RE.test(raw) && !/^(na\??|és\??|and\??|szóval\??)$/i.test(raw)) {
    return null;
  }

  const thread = session?.lastThreadActivity;
  if (!thread || Date.now() - thread.at > 10 * 60 * 60 * 1000) return null;

  const r = getResponses(lang);
  const pool =
    r.threadReturn?.[thread.type] ||
    r.threadReturn?.generic ||
    [];
  if (!pool.length) return null;

  const line = pickSeeded(pool, `ret_${thread.type}_${thread.at}`);
  return { body: line, category: "thread_continuity" };
}

/**
 * Contextual lead when recent activity without explicit "back".
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 */
function maybeThreadLead(session, lang) {
  const thread = session?.lastThreadActivity;
  if (!thread || Date.now() - thread.at > 3 * 60 * 60 * 1000) return null;
  if (Date.now() - thread.at < 8 * 60 * 1000) return null;
  const r = getResponses(lang);
  const pool = r.threadReturn?.[thread.type];
  if (!pool?.length || Math.random() > 0.25) return null;
  return pickSeeded(pool, `lead_${thread.type}`);
}

module.exports = {
  extractThreadActivity,
  tryThreadReturnReply,
  maybeThreadLead,
  RETURN_RE
};
