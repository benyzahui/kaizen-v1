/**
 * Strip AI-poetic / quote-machine patterns — keep voice grounded and human.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

const THERAPY_COACH_RES = [
  /\byou should\b/i,
  /\byou must\b/i,
  /\byou need to\b/i,
  /\bself[- ]?care\b/i,
  /\bvalidate your feelings\b/i,
  /\bhealing journey\b/i,
  /\binner child\b/i,
  /\bmanifest\b/i,
  /\bne legyen szégyen\b/i,
  /\bgyógyulási út\b/i,
  /\belső lépés a változáshoz\b/i,
  /\bfailed your discipline\b/i,
  /\bte vagy a probléma\b/i,
  /\byou failed\b/i
];

const WISDOM_QUOTE_RES = [
  /\bchaos grows\b/i,
  /\bdiscipline disappear/i,
  /\bnervous system remembers\b/i,
  /\bneglected truth\b/i,
  /\bidentity is forged\b/i,
  /\belite zone\b/i,
  /\benergy leaks destroy\b/i,
  /\bstandards are what you do when nobody\b/i,
  /\bfigyelem ritkább erőforrás\b/i,
  /\bidentitás kovácsolódik\b/i,
  /\bdiszciplína.*önbetörés\b/i,
  /\bdevotion repeated until\b/i
];

const AI_POETIC_RES = [
  /\btruth has arrived\b/i,
  /\bintensity without container\b/i,
  /\bcontainer becomes noise\b/i,
  /\bthe move is already obvious\b/i,
  /\byou are stalling because it costs ego\b/i,
  /\bnegotiating with the obvious\b/i,
  /\bwearing productivity clothes\b/i,
  /\bwearing a smart mask\b/i,
  /\bless narrative\.?\s*more contact\b/i,
  /\bstop asking what to do\b/i,
  /\byour future self is watching\b/i,
  /\bsignal in what you just said\b/i,
  /\bhold the insight\b/i,
  /\bdrown in it\b/i,
  /\bheroics\b/i,
  /\boverload state detected\b/i,
  /\bone task\.?\s*one focus\b/i,
  /\bdetected\b.*\bstate\b/i,
  /\bone honest movement\b/i
];

/**
 * Remove duplicate non-empty lines (exact match).
 * @param {string} text
 */
function dedupeLines(text) {
  const seen = new Set();
  const out = [];
  for (const line of String(text || "").split(/\n/)) {
    const t = line.trim();
    if (!t) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line.trimEnd());
  }
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} [seed]
 */
function stripAIPoetic(body, lang, seed = "") {
  let b = String(body || "");
  const r = getResponses(lang);
  const alts = r.groundedVoiceAlts || [
    "This sounds more like overload than laziness.",
    "Too many things running at once inside you.",
    "Your body signaled before your ego admitted it."
  ];

  for (const re of [...THERAPY_COACH_RES, ...WISDOM_QUOTE_RES, ...AI_POETIC_RES]) {
    if (re.test(b)) {
      const alt = pickSeeded(alts, `${seed}_${re.source.slice(0, 12)}`);
      b = b.replace(re, alt);
      b = b
        .split(/\n/)
        .filter((line) => !re.test(line))
        .join("\n");
    }
  }

  return b.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Full human-voice pass on outgoing text.
 */
function applyHumanVoiceGuard(body, lang, seed = "") {
  let b = stripAIPoetic(body, lang, seed);
  b = dedupeLines(b);
  return b;
}

module.exports = {
  AI_POETIC_RES,
  dedupeLines,
  stripAIPoetic,
  applyHumanVoiceGuard
};
