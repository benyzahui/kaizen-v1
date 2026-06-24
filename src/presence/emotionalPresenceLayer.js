/**
 * Lightweight emotional presence — hope, strength, return to path.
 * No therapy tone. No shame. No overwhelm.
 */

const { lines } = require("../personality/kaizenVoice");
const { stageGifForContext } = require("../media/gifSelector");

const TIRED_RE =
  /\b(tired|exhausted|kimerült|kimerult|epuizat|burned out|overwhelm|túl sok|tul sok|nem bírom|nem birom|fáradt|faradt|low energy|no energy|drained)\b/i;

const MOTIVATED_RE =
  /\b(motivated|ready|strong|focused|kész vagyok|kesz vagyok|erős|eros|pumped|locked in|let's go|let's do|indulhat|start now|gata)\b/i;

const ASHAMED_RE =
  /\b(failed|skipped|ashamed|guilty|kihagytam|elrontottam|rusine|rușinat|rusinat|didn't do|did not|missed|lazy|weak|gyenge vagyok|lipsă de)\b/i;

const RESPONSES = {
  tired: {
    en: lines(
      "🐉 I'm here.",
      "",
      "No forcing today.",
      "We return to basics.",
      "",
      "💧 Water.",
      "🧘 5 slow breaths.",
      "🌿 A short walk.",
      "",
      "This is still progress."
    ),
    hu: lines(
      "🐉 Itt vagyok.",
      "",
      "Ma nem kell erőltetni.",
      "Ma visszatérünk az alapokhoz.",
      "",
      "💧 Víz.",
      "🧘 5 lassú légzés.",
      "🌿 Egy rövid séta.",
      "",
      "Ez is haladás."
    ),
    ro: lines(
      "🐉 Sunt aici.",
      "",
      "Azi nu forțăm.",
      "Revenim la bază.",
      "",
      "💧 Apă.",
      "🧘 5 respirații lente.",
      "🌿 O scurtă plimbare.",
      "",
      "Și asta e progres."
    ),
    suggestedAction: "/breath",
    gifContext: "recovery_encouragement"
  },
  motivated: {
    en: lines(
      "🐉 Good.",
      "",
      "Channel it — one lane.",
      "One block. One finish.",
      "",
      "🔥 Execute with calm.",
      "🎯 Return to the path."
    ),
    hu: lines(
      "🐉 Jó.",
      "",
      "Irányítsd — egy sáv.",
      "Egy blokk. Egy lezárás.",
      "",
      "🔥 Nyugodt végrehajtás.",
      "🎯 Vissza az útra."
    ),
    ro: lines(
      "🐉 Bine.",
      "",
      "Canalizează — o bandă.",
      "Un bloc. O închidere.",
      "",
      "🔥 Execuție calmă.",
      "🎯 Înapoi pe drum."
    ),
    suggestedAction: "/challenge",
    gifContext: "discipline"
  },
  ashamed: {
    en: lines(
      "🐉 Okay.",
      "",
      "The skip doesn't decide.",
      "The return does.",
      "",
      "One small step is enough today."
    ),
    hu: lines(
      "🐉 Rendben.",
      "",
      "Nem a kihagyás dönt.",
      "A visszatérés dönt.",
      "",
      "Ma egy kis lépés elég."
    ),
    ro: lines(
      "🐉 Bine.",
      "",
      "Nu omisiunea decide.",
      "Revenirea decide.",
      "",
      "Un pas mic e suficient azi."
    ),
    suggestedAction: "/program",
    gifContext: "recovery_encouragement"
  }
};

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
  const body = pack[locked] || pack.en;

  if (pack.gifContext) {
    stageGifForContext(userId, session, pack.gifContext, { chance: 0.2 });
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
