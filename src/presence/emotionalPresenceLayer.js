/**
 * Lightweight emotional presence — hadnagy hang: durva, vicces, motiváló.
 * GIF: kulcsszó-tükör, ironia — nem símogat.
 */

const {
  stageGifForContext,
  stageKeywordMirrorGif,
  appendMirrorLine
} = require("../media/gifSelector");
const { updateSession } = require("../session/sessionStore");
const { EMOTIONAL } = require("../personality/v2/sergeantVoice");

const TIRED_RE =
  /\b(tired|exhausted|kimerült|kimerult|epuizat|burned out|overwhelm|túl sok|tul sok|nem bírom|nem birom|fáradt|faradt|low energy|no energy|drained)\b/i;

const MOTIVATED_RE =
  /\b(motivated|ready|strong|focused|kész vagyok|kesz vagyok|erős|eros|pumped|locked in|let's go|let's do|indulhat|start now|gata)\b/i;

const ASHAMED_RE =
  /\b(failed|skipped|ashamed|guilty|kihagytam|elrontottam|rusine|rușinat|rusinat|didn't do|did not|missed|lazy|lipsă de)\b/i;

const RESPONSES = EMOTIONAL;

/**
 * @param {string} text
 * @returns {'tired'|'motivated'|'ashamed'|null}
 */
function detectEmotionalState(text) {
  const t = String(text || "").trim();
  if (t.length < 4) return null;
  if (ASHAMED_RE.test(t)) return "ashamed";
  if (TIRED_RE.test(t)) return "tired";
  if (MOTIVATED_RE.test(t)) return "motivated";
  return null;
}

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 */
function tryEmotionalPresenceReply(text, lang, session, userId) {
  const state = detectEmotionalState(text);
  if (!state) return null;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const pack = RESPONSES[state];
  let body = pack[locked] || pack.en;

  const mirror = stageKeywordMirrorGif(userId, session, text, locked);
  if (mirror?.mirrorLine) {
    body = appendMirrorLine(body, mirror.mirrorLine);
    updateSession(userId, { pendingMirrorLine: null });
  } else if (pack.gifContext) {
    stageGifForContext(userId, session, pack.gifContext, { chance: 0.45 });
  }

  return {
    body,
    category: `emotional_presence_${state}`,
    suggestedAction: pack.suggestedAction || null
  };
}

module.exports = {
  TIRED_RE,
  MOTIVATED_RE,
  ASHAMED_RE,
  RESPONSES,
  detectEmotionalState,
  tryEmotionalPresenceReply
};
