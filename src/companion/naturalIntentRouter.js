/**
 * Natural speech → companion response without slash-first routing.
 */

const { getResponses } = require("../i18n/getResponses");
const { pickSeeded } = require("../personality/tone");
const { lines } = require("../personality/kaizenVoice");

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @returns {null | { body: string, category: string, suggestedCommand?: string|null }}
 */
function routeNaturalIntent(text, lang, session, userId) {
  const t = String(text || "").trim();
  const low = t.toLowerCase();
  if (t.length < 4 || /^\//.test(t)) return null;

  const r = getResponses(lang);
  const seed = `nint_${userId}_${t.slice(0, 30)}`;

  if (
    /(nagyon stressz|very stressed|stressed out|túl stressz|prea stresat|idegrendszer)/i.test(
      t
    )
  ) {
    const pool = r.naturalIntentOverload || r.humanPresence?.stress || [];
    if (!pool.length) return null;
    const body = Array.isArray(pool[0])
      ? pickSeeded(pool, seed)
      : pickSeeded(pool, seed);
    return {
      body,
      category: "natural_conversation",
      suggestedCommand: null
    };
  }

  if (/(szét vagyok csúszva|szétesett|elvesztettem a fókuszt|lost focus|can't focus|nem tudok fókusz)/i.test(t)) {
    const pool = r.naturalIntentFocus || r.humanPresence?.scattered || [];
    if (!pool.length) return null;
    return {
      body: pickSeeded(pool, seed),
      category: "natural_conversation",
      suggestedCommand: null
    };
  }

  if (/(trade előtt|before (the )?trade|pre.?market|going to trade|kereskedés előtt)/i.test(t)) {
    const pool = r.naturalIntentTrading || [];
    if (!pool.length) return null;
    return {
      body: pickSeeded(pool, seed),
      category: "trading_context",
      suggestedCommand: null
    };
  }

  if (
    t.length < 90 &&
    /(kimegyek futni|megyek futni|going for a run|going to the gym|megyek edzeni)/i.test(low)
  ) {
    const pool = r.shortActionReplies || [];
    if (!pool.length) return null;
    return { body: pickSeeded(pool, seed), category: "light_conversation", suggestedCommand: null };
  }

  if (/(clarity|tisztánlátás|need direction|nem tudom merre)/i.test(t) && t.length < 120) {
    const pool = r.naturalIntentClarity || [];
    if (!pool.length) return null;
    return {
      body: pickSeeded(pool, seed),
      category: "reflective_open",
      suggestedCommand: null
    };
  }

  return null;
}

module.exports = { routeNaturalIntent };
