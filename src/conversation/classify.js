/**
 * Open-text classification (no slash commands — those never reach here).
 *
 * Priority (highest first):
 * 0 creator / bare help / energy question / clarity keyword
 * 1 chaos / overload
 * 2 casual greeting (short, non-crisis)
 * 3 focus drift / mental scatter
 * 4 trading impulse
 * 5 trading context (session / wait / charts — not therapy)
 * 6 planning language
 * 7 work context
 * 8 growth / habits
 * 9 body / sleep / fuel
 * 10 light curiosity (discipline / identity questions without crisis)
 * 11 emotional / personal state (narrowed cues)
 * 12 reflective questions & open coaching
 * 13 unknown — short low-signal noise only; natural language defaults to reflective_open
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
    /(today'?s energy|energy (today|of the day|right now)|tell me about.{0,40}energy|what('s| is) the energy|mi\s+(a\s+)?mai\s+energi|napi energia|energia zilei|energia de azi|energie\s+azi|mai spune.{0,20}energi|a\s+mai\s+nap\s+energi[aá]ja|energia\s+ma|mai\s+energia|moon\s+phase|holdf[aá]zis|astrology\s+today|astrologie\s+ast[aă]zi|numerology\s+today|numerologie\s+azi|\bnumerologia\b)/i.test(
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
    t.length <= 120 &&
    !/(panic|overwhelmed|hopeless|can't cope|cant cope|dying|spiral|meltdown|hurt myself|self harm)/i.test(
      t
    ) &&
    (/^(gm\b|good morning|good afternoon|good evening|good night|hey\b|hi\b|hello\b|yo\b|jó reggelt|szia\b|szi\b|bună|salut|servus)\b/i.test(
      t
    ) ||
      /^(thanks|thank you|thx|köszönöm|mulțumesc)\b/i.test(low))
  ) {
    return "casual_greeting";
  }

  if (
    /\b(scattered|distracted|can't focus|cant focus|brain fog|foggy|jumping between|switching tabs|tab hoard|unfocused|attention split|mind racing|szétszórt|nem tudok koncentrálni|dispers|fragmentat|nu mă pot concentra|szét vagyok csúszva|elvesztettem a fókuszt|lost focus|am pierdut focus)\b/i.test(
      t
    )
  ) {
    return "focus_drift";
  }

  if (/(trade előtt|before (the )?trade|înainte de trade|pre.?market|kereskedés előtt)/i.test(t)) {
    return "trading_context";
  }

  if (/(nagyon stressz|very stressed|prea stresat|túl stressz)/i.test(t) && t.length < 200) {
    return "emotional_reflection";
  }

  if (
    /(fomo|yolo|revenge trade|all in|all-in|margin call|chase the loss|overtrad|100x|leveraged|impulsive trade|buying out of|revenge trading)/i.test(
      t
    )
  ) {
    return "trading_impulse";
  }

  if (
    /\b(ny|new york)\s+open\b/i.test(low) ||
    /\b(london|asia)\s+(open|session)\b/i.test(low) ||
    /\b(waiting|wait for|waiting for)\b[\s\S]{0,48}\b(market|open|session|bell|candles?|premarket)\b/i.test(
      low
    ) ||
    (/\b(chart|candles?|orderflow|liquidity|btc|eth|nq|es|spx)\b/i.test(low) &&
      t.length < 160 &&
      !/\b(i feel|i'm feeling|feeling (so|really)|anxious|panic|hopeless)\b/i.test(low))
  ) {
    return "trading_context";
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
    (/\b(what do you think (about|of)|what's your take on|what is your take on)\b/i.test(
      low
    ) &&
      !/\b(anxiety|panic|depression|trauma|suicid|self harm)\b/i.test(low)) ||
    /\b(why|how)\s+(does|is|do)\s+\w+\s+(discipline|habit|focus|routine|identity)\b/i.test(
      low
    )
  ) {
    return "light_conversation";
  }

  if (
    /\b(i feel|i'm feeling|i am feeling|feeling (really|so|quite)|honestly i|i'm drained|i am drained|i'm anxious|i am anxious|i'm stressed|i am stressed|i'm lonely|i am lonely|i'm lost|i am lost|i'm empty|i am empty|burned out|burnt out|overthinking|mentally tired)\b/i.test(
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
