/**
 * Real conversational flow — life updates before coaching.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { isNaturalEmotional } = require("../conversation/naturalConversation");

const FLOW_MAX_LEN = 140;

/**
 * @param {string} text
 */
function detectLifeFlowSlot(text) {
  const t = String(text || "").trim();
  if (!t || t.length > FLOW_MAX_LEN) return null;
  if (/(want to die|kill myself|self harm|öngyilk|pánik roham)/i.test(t)) return null;
  if (/(help me|segíts|how do i|mit csináljak|what should i)/i.test(t)) return null;

  if (
    /(most jöttem haza|jöttem haza|hazaértem|hazaértünk|got home|just got home|i'm home|im home|ajung acasă|tocmai am ajuns acasă)/i.test(
      t
    )
  ) {
    return "home_return";
  }

  if (
    /(vége a napnak|nap vége|kész a nap|day is done|done for today|finished (for )?today|gata cu ziua)/i.test(
      t
    )
  ) {
    return "day_end";
  }

  if (
    /(most jöttem|just got back|épp jöttem|megérkeztem|arrived home|am ajuns)/i.test(t) &&
    t.length < 90 &&
    !isNaturalEmotional(t)
  ) {
    return "arrival";
  }

  if (/^(vissza|back|i'?m back)$/i.test(t)) {
    return "return_back";
  }

  if (/^(ok|okay|k|igen|da|nu|nem)$/i.test(t) && t.length < 12) {
    return "minimal_ack";
  }

  if (
    /^(na|hát|szóval|well|so|hm+|hmm+)\b/i.test(t) &&
    t.length < 45 &&
    !/\?/.test(t)
  ) {
    return "opener";
  }

  const lowStart = t.toLowerCase().slice(0, 24);
  if (
    /^(hosszú|hosszu|rövid|scurt|long|short|rough|grea|fárasztó|obosit|draining|tiring)/i.test(
      lowStart
    ) &&
    t.length < 50 &&
    !isNaturalEmotional(t)
  ) {
    return "day_reply";
  }

  if (
    t.length < 70 &&
    !isNaturalEmotional(t) &&
    !/\?/.test(t) &&
    /(most|épp|just now|tocmai|ma este|this evening)/i.test(t) &&
    !/(trade|munka|deadline|stressz|stress)/i.test(t)
  ) {
    return "mundane";
  }

  return null;
}

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @returns {null | { body: string, category: string }}
 */
function tryConversationalFlow(text, lang, session, userId) {
  const slot = detectLifeFlowSlot(text);
  if (!slot) return null;

  const r = getResponses(lang);
  const pool = r.conversationalFlow?.[slot];
  if (!pool?.length) return null;

  return {
    body: pickSeeded(pool, `flow_${slot}_${userId}_${text.slice(0, 24)}`),
    category: "life_flow"
  };
}

module.exports = { detectLifeFlowSlot, tryConversationalFlow };
