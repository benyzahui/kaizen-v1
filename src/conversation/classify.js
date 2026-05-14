/**
 * Open-text classification (no slash commands — those never reach here).
 *
 * Priority (highest first):
 * 0 creator easter / bare help / energy question / clarity keyword
 * 1 chaos / overload
 * 2 focus drift / mental scatter
 * 3 trading impulse
 * 4 planning language
 * 5 work context
 * 6 growth / habits
 * 7 body / sleep / fuel
 * 8 emotional / personal state
 * 9 reflective questions & open coaching
 * 10 unknown — short low-signal noise only; natural language defaults to reflective_open
 */

/**
 * @param {string} text
 * @returns {string} category key
 */
function classifyMessage(text) {
  const t = String(text || "").trim();
  if (!t) return "unknown";

  const low = t.toLowerCase();

  if (/(i\s*am|i'm)\s+your\s+creator\b/i.test(t)) {
    return "easter_creator";
  }

  if (
    low === "help" ||
    low === "help." ||
    low === "help!" ||
    low === "help?" ||
    low === "segíts" ||
    low === "segíts!" ||
    low === "ajutor" ||
    low === "ajutor!"
  ) {
    return "help_intent";
  }

  if (
    /(today'?s energy|energy (today|of the day|right now)|tell me about.{0,40}energy|what('s| is) the energy|napi energia|energia zilei|energia de azi|mai spune.{0,20}energi)/i.test(
      t
    )
  ) {
    return "energy_question";
  }

  if (/^clarity\s*[.!?…]*$/i.test(low) || (low === "clarity" && t.length < 20)) {
    return "clarity_protocol";
  }

  if (
    /(hopeless|spiral|can't stop|cant stop|meltdown|overstim|overwhelmed|overload|overloaded|mental overload|panic|dying inside|too much at once|shutting down|can't think straight|cant think straight|can't cope|cant cope|pánik|reménytelen|összeoml|panică|disperat|can't breathe|cant breathe)/i.test(
      t
    )
  ) {
    return "chaos_loop";
  }

  if (
    /\b(scattered|distracted|can't focus|cant focus|brain fog|foggy|jumping between|switching tabs|tab hoard|unfocused|attention split|mind racing|szétszórt|nem tudok koncentrálni|dispers|fragmentat|nu mă pot concentra)\b/i.test(
      t
    )
  ) {
    return "focus_drift";
  }

  if (
    /(fomo|yolo|revenge trade|all in|all-in|margin call|chase the loss|overtrad|100x|leveraged|impulsive trade|buying out of|revenge trading)/i.test(
      t
    )
  ) {
    return "trading_impulse";
  }

  if (
    /\b(plan|calendar|schedule|todo|roadmap|quarter|sprint)\b/i.test(t) ||
    /(menetrend|ütem|terv|napirend)/i.test(t)
  ) {
    return "plan_tracking";
  }

  if (
    /\b(work|deadline|boss|client|meeting|project|office|shift|shift work)\b/i.test(t) ||
    /(munka|határidő|projekt|főnök|ügyfél)/i.test(t)
  ) {
    return "work_focus";
  }

  if (
    /\b(habit|learn|journal|course|read|skills|discipline routine)\b/i.test(t) ||
    /(szokás|tanul|napló|fejlőd|curs)/i.test(t)
  ) {
    return "self_development";
  }

  if (
    /\b(sleep|slept|insomnia|hungry|thirst|hydrat|ate |food|meal|water|caffeine|body ache|dizzy|steps today|neck tight)\b/i.test(
      low
    ) ||
    /(alvás|aludtam|éhes|szomjas|víz|étel|somn|mâncat|sete|fome)/i.test(t)
  ) {
    return "body_energy";
  }

  if (
    /\b(i feel|i'm |i am |feeling |honestly |today |drained|anxious|sad |stressed|lonely|confused|don't know|dont know|unsure|lost|empty|afraid|worried|scared|burned out|burnt out|overthinking|mentally tired)\b/i.test(
      low
    ) ||
    /(érz|érzem|fáradt|bizonytalan|magány|nem bírom|tristețe|trist|obosit|obosită|epuizat|stresat|nu am chef|fără chef|fară chef|szétesett|remény)/i.test(
      t
    )
  ) {
    return "emotional_reflection";
  }

  if (
    /\?/.test(t) ||
    /^(what|why|how|who|when)\b/i.test(low) ||
    /^ce\s/i.test(t) ||
    /\b(should i|could i|what if|worth it|meaning|direction|stuck on)\b/i.test(low) ||
    /\b(ar trebui|merită|sensul|direcție)\b/i.test(low)
  ) {
    return "reflective_open";
  }

  if (t.length < 10 && !/\b(i|my|me|we|today|feel|mă|mi|én)\b/i.test(low)) {
    return "unknown";
  }

  return "reflective_open";
}

module.exports = { classifyMessage };
