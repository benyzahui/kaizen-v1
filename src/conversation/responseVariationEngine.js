/**
 * Strict anti-loop — openings, endings, template phrases (last 8 replies).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { firstLine, lastLine, normalizeChunk } = require("./structureMemory");

const HISTORY = 8;

const TEMPLATE_PHRASE_RES = [
  /\bone truth\b/i,
  /\bone move\b/i,
  /\bone fact\b/i,
  /\bone intent\b/i,
  /\bstabiliz(e|ing)\b/i,
  /\bhold\.?\s*then step\b/i,
  /\bgrounded sentence\b/i,
  /\bsmallest (step|finish)\b/i,
  /\begy igaz\b/i,
  /\bstabil\b.*\blépés\b/i,
  /\bone grounded\b/i
];

/**
 * @param {object} session
 * @returns {{ openings: string[], endings: string[], phrases: string[] }}
 */
function getRecentTrack(session) {
  return {
    openings: [...(session.recentAssistantOpenings || [])].slice(-HISTORY),
    endings: [...(session.recentAssistantEndings || [])].slice(-HISTORY),
    phrases: [...(session.recentPhraseHits || [])].slice(-HISTORY)
  };
}

/**
 * @param {string} body
 */
function phraseFingerprints(body) {
  const hits = [];
  for (const re of TEMPLATE_PHRASE_RES) {
    if (re.test(body)) hits.push(re.source.slice(0, 40));
  }
  return hits;
}

/**
 * @param {string[]} hist
 * @param {string} candidate
 */
function isRepeat(hist, candidate) {
  if (!candidate) return false;
  return hist.includes(candidate);
}

/**
 * @param {object} session
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} seed
 */
function applyResponseVariation(session, body, lang, seed = "") {
  let b = String(body || "").trim();
  if (!b) return b;

  const r = getResponses(lang);
  const track = getRecentTrack(session);
  const openKey = normalizeChunk(firstLine(b));
  const endKey = normalizeChunk(lastLine(b));

  if (isRepeat(track.openings, openKey) && track.openings[track.openings.length - 1] === openKey) {
    const alts = r.variationOpenings || r.humanRhythmLines || [];
    if (alts.length) {
      const lead = pickSeeded(alts, `${seed}_open_${openKey}`);
      const rest = b.split(/\n/).slice(1).join("\n").trim();
      b = rest ? `${lead}\n\n${rest}` : lead;
    }
  } else if (isRepeat(track.openings, openKey)) {
    const alts = r.variationOpenings || [];
    if (alts.length) {
      b = linesReplaceOpening(b, pickSeeded(alts, `${seed}_open2`));
    }
  }

  const endKey2 = normalizeChunk(lastLine(b));
  if (isRepeat(track.endings, endKey2)) {
    const alts = r.variationEndings || [];
    if (alts.length) {
      b = linesReplaceEnding(b, pickSeeded(alts, `${seed}_end`));
    }
  }

  for (const re of TEMPLATE_PHRASE_RES) {
    if (re.test(b) && track.phrases.some((p) => re.source.includes(p.slice(0, 12)))) {
      const alt = pickSeeded(
        r.templatePhraseAlts || r.structureRewrites || ["Keep it concrete."],
        `${seed}_tpl_${re.source}`
      );
      b = b.replace(re, alt);
    }
  }

  return b;
}

function linesReplaceOpening(body, newOpening) {
  const parts = String(body).split(/\n/);
  const idx = parts.findIndex((l) => l.trim());
  if (idx < 0) return newOpening;
  parts[idx] = newOpening;
  return parts.join("\n").trim();
}

function linesReplaceEnding(body, newEnding) {
  const parts = String(body)
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!parts.length) return newEnding;
  parts[parts.length - 1] = newEnding;
  return parts.join("\n");
}

/**
 * Patch session fields after a reply is sent (call from recordInteraction).
 * @param {object} session
 * @param {string} reply
 */
function trackAssistantReply(session, reply) {
  const openKey = normalizeChunk(firstLine(reply));
  const endKey = normalizeChunk(lastLine(reply));
  const phrases = phraseFingerprints(reply);
  return {
    recentAssistantOpenings: [...(session.recentAssistantOpenings || []), openKey]
      .slice(-HISTORY),
    recentAssistantEndings: [...(session.recentAssistantEndings || []), endKey].slice(
      -HISTORY
    ),
    recentPhraseHits: [...(session.recentPhraseHits || []), ...phrases].slice(-HISTORY)
  };
}

module.exports = {
  applyResponseVariation,
  trackAssistantReply,
  getRecentTrack,
  TEMPLATE_PHRASE_RES,
  HISTORY
};
