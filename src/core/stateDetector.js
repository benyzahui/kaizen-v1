/**
 * Coach-facing state under the user's words (trigger points).
 * Works with classify.js category as a weak prior, then overrides with phrase rules.
 */

/**
 * @typedef {string} CoachState
 */

/**
 * @param {string} text
 * @param {object} _session
 * @param {string} classifyCategory
 * @returns {CoachState}
 */
function detectCoachState(text, _session, classifyCategory) {
  const t = String(text || "").trim();
  const low = t.toLowerCase();

  if (
    /(today'?s energy|energy (today|right now)|tell me about.{0,40}energy|what('s| is) the energy|mai energia|energia zilei|energia de azi|mi\s+(a\s+)?mai\s+energi|napi\s+energi|a\s+mai\s+nap\s+energi)/i.test(
      t
    )
  ) {
    return "energy_curiosity";
  }

  if (
    t.length <= 18 &&
    /^(persze|persze\s*!|oké|oke|ok|aha|hm|hmm|yeah|yep|sure|fine|k|da\b|yup|igen\s*van|da\s*da)\.?$/i.test(
      low
    )
  ) {
    return "agreement_surface";
  }

  if (
    /\b(ny|new york)\s+open\b/i.test(low) ||
    /\b(ny|new york)\s+openre\b/i.test(low) ||
    /\b(waiting|wait for|várok|aștept).{0,40}\b(open|ny|session|market|bell)\b/i.test(
      low
    )
  ) {
    return "trading_session_anchor";
  }

  if (
    /(don'?t know where to start|don'?t know how to start|nem tudom mivel kezdj|nu știu cu ce să încep|nu stiu cu ce sa incep|where do i even start)/i.test(
      t
    )
  ) {
    return "start_paralysis";
  }

  if (
    /(procrastinat|halogat|halogatok|amân|aman|întârz|intarz|avoiding the work|putting it off)/i.test(
      t
    )
  ) {
    return "procrastinating";
  }

  if (
    /(csak beszélgetni|just want to chat|vreau doar să vorb|vreau doar sa vorb|only want to talk|small talk)/i.test(
      t
    )
  ) {
    return "casual_talk";
  }

  if (
    /(fáradt|obosit|tired|exhausted).{0,60}(dolgoz|work|must work|trebuie să lucrez|kell dolgoz)/i.test(
      t
    )
  ) {
    return "tired_push";
  }

  if (
    /\b(scattered|szétesett|fragmentat|dispers|all over the place|mind racing)\b/i.test(t) ||
    classifyCategory === "focus_drift"
  ) {
    return "scattered_state";
  }

  if (classifyCategory === "chaos_loop") return "overload_recovery";
  if (classifyCategory === "trading_impulse") return "trading_impulse_lane";
  if (classifyCategory === "plan_tracking") return "mission_drift";

  if (
    classifyCategory === "reflective_open" &&
    /\b(permission|allowed to|merit|worth it|should i)\b/i.test(low)
  ) {
    return "seeking_permission";
  }

  if (classifyCategory === "reflective_open" && t.length > 120) return "seeking_clarity";

  if (/\b(overthink|gândesc prea mult|túlgondol|ruminat)\b/i.test(low)) {
    return "overthinking";
  }

  if (classifyCategory === "emotional_reflection") return "emotional_open";

  if (classifyCategory === "body_energy") return "body_neglect";

  return "default_coach";
}

module.exports = { detectCoachState };
