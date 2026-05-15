/**
 * Natural intent detection — keyword + classifier fusion (rule-based).
 *
 * Future LLM stack: replace detectNaturalIntent() with `intentEngine.classifyFromModel(text, session)`
 * returning the same shape `{ intent, lang?, subtype? }` so routing stays stable.
 */

/**
 * @typedef {{ intent: string, lang?: 'en'|'hu'|'ro', subtype?: string }} NaturalIntent
 */

/**
 * Broad energy / cosmology triggers — conversation-first energy module.
 * @param {string} text
 */
function matchesEnergyPrimary(text) {
  const t = String(text || "").trim();
  if (t.length > 180) return false;
  return (
    /\b(mai\s+energia|today'?s\s+energy|energy\s+today|tell me.{0,30}energy)\b/i.test(t) ||
    /\b(mi\s+(a\s+)?mai\s+energi|napi\s+energi|energia(\s+ma)?|^energia[\s!.?]*$)/i.test(t) ||
    /\b(hold(f[aá]zis)?|moon\s+phase|\bmoon\b)\b/i.test(t) ||
    /\b(asztrol[oó]g|astrology|astro\b)/i.test(t) ||
    /\b(sz[aá]mmisztik|numerolog)/i.test(t) ||
    /^(energy|energia)[\s!.?]*$/i.test(t)
  );
}

/**
 * Explicit spoken language switch (immediate lock).
 * @param {string} text
 */
function detectLanguageSwitchIntent(text) {
  const t = String(text || "").trim();
  if (
    /\b(magyarul|magyar\s+nyelven|beszél(junk|ünk)?\s+magyar|hungarian\s+please|szeretnék.{0,24}magyar)\b/i.test(
      t
    )
  ) {
    return { intent: "language_switch", lang: "hu" };
  }
  if (
    /\b(in english|english\s+please|speak english|englisch\s+bitte)\b/i.test(t)
  ) {
    return { intent: "language_switch", lang: "en" };
  }
  if (/\b(rom[aâ]n[aă]|în\s+rom[aâ]n[aă]|romanian\s+please)\b/i.test(t)) {
    return { intent: "language_switch", lang: "ro" };
  }
  return null;
}

/**
 * @param {string} text
 * @param {string} classifyCategory from classifyMessage()
 * @param {object} _session
 * @returns {NaturalIntent}
 */
function detectNaturalIntent(text, classifyCategory, _session) {
  const sw = detectLanguageSwitchIntent(text);
  if (sw) return sw;

  if (matchesEnergyPrimary(text)) return { intent: "energy_read" };

  const low = String(text || "").toLowerCase();

  if (
    /\b(procrastinat|halogat|halogatok|am[aâ]n|amân|avoiding\s+the\s+work|keep\s+putting\s+off)\b/i.test(
      low
    )
  ) {
    return { intent: "procrastination_break" };
  }

  if (
    /\b(nem értem|nem\s+tudom\s+mit|mit\s+csin[aá]ljak|teljesen\s+elvesztett|lost\b|confused\b|what\s+do\s+i\s+do|nu\s+în[eț]eleg|nu\s+știu\s+ce)\b/i.test(
      low
    )
  ) {
    return { intent: "user_confusion" };
  }

  if (
    /\b(milyen\s+parancs|parancsok|ce\s+comenzi|cum\s+folosesc|what\s+commands|how\s+do\s+i\s+use\s+kai)/i.test(
      low
    )
  ) {
    return { intent: "command_help_light" };
  }

  switch (classifyCategory) {
    case "chaos_loop":
      return { intent: "emotional_chaos" };
    case "energy_question":
      return { intent: "energy_read" };
    case "help_intent":
      return { intent: "command_help_light" };
    case "trading_impulse":
    case "trading_context":
      return { intent: "trading_gate" };
    case "plan_tracking":
    case "work_focus":
      return { intent: "business_focus" };
    case "body_energy":
      return { intent: "body_reset" };
    case "casual_greeting":
    case "light_conversation":
      return { intent: "casual_companion" };
    default:
      return { intent: "follow_classify", subtype: classifyCategory };
  }
}

module.exports = {
  detectNaturalIntent,
  detectLanguageSwitchIntent,
  matchesEnergyPrimary
};
