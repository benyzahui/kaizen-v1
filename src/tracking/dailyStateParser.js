/**
 * Parse natural check-in replies (HU / EN / RO).
 */

/**
 * @param {string} text
 * @returns {number|null}
 */
function parseScale1to10(text) {
  const t = String(text || "").trim();
  const labeled = t.match(
    /(?:energia|energy|energie|alv[aá]s|sleep|somn|alváás)\s*[:\-]?\s*(\d{1,2})/i
  );
  if (labeled) {
    const n = parseInt(labeled[1], 10);
    if (n >= 1 && n <= 10) return n;
  }
  const nums = [...t.matchAll(/\b(\d{1,2})\b/g)].map((m) => parseInt(m[1], 10));
  const valid = nums.filter((n) => n >= 1 && n <= 10);
  return valid.length ? valid[0] : null;
}

/**
 * @param {string} text
 * @param {number} [index] 0-based which scale in message
 */
function parseScaleAt(text, index = 0) {
  const nums = [...String(text || "").matchAll(/\b(\d{1,2})\b/g)]
    .map((m) => parseInt(m[1], 10))
    .filter((n) => n >= 1 && n <= 10);
  return nums[index] ?? null;
}

/**
 * @param {string} text
 */
function parseYesNo(text) {
  const t = String(text || "").trim().toLowerCase();
  if (/(^|\s)(igen|da|yes|yep|true|1)(\s|$|[,.])/i.test(t)) return true;
  if (/(^|\s)(nem|nu|no|nope|false|0)(\s|$|[,.])/i.test(t)) return false;
  if (/\bsodr[oó]d|drift|szétszórt|scattered\b/i.test(t)) return true;
  if (/\bz[aá]r|locked|fókusz ok|focus ok\b/i.test(t)) return false;
  return null;
}

/**
 * @param {string} text
 * @returns {'low'|'medium'|'high'|null}
 */
function parseScreenDiscipline(text) {
  const t = String(text || "").toLowerCase();
  if (/\b(magas|high|zajos|noise|túl sok|prea mult)\b/.test(t)) return "high";
  if (/\b(közepes|mediu|medium|mid)\b/.test(t)) return "medium";
  if (/\b(alacsony|low|csönd|quiet|liniște)\b/.test(t)) return "low";
  if (/\b(1|2|3)\s*\/\s*3\b/.test(t) && /3/.test(t)) return "high";
  return null;
}

/**
 * @param {string} text
 */
function parseBodyAnchors(text) {
  const t = String(text || "").toLowerCase();
  const hydrationDone = /\b(víz|viz|water|hidrat|hydrat|ap[aă])\b/.test(t);
  const movementDone = /\b(mozg[aá]s|movement|mișcare|sét[aá]|walk|edzés|training)\b/.test(
    t
  );
  const breathworkDone = /\b(légz[eé]s|breath|respira|breathing)\b/.test(t);
  return { hydrationDone, movementDone, breathworkDone };
}

/**
 * @param {string} text
 */
function parseFastingActive(text) {
  return /\b(böjt|fast|post|fasting)\b/i.test(String(text || ""));
}

/**
 * Morning bundle: "7 8 mission text víz mozgás"
 * @param {string} text
 */
function parseMorningBundle(text) {
  const energyLevel = parseScaleAt(text, 0);
  const sleepQuality = parseScaleAt(text, 1);
  const anchors = parseBodyAnchors(text);
  let todayMission = null;
  const stripped = String(text || "")
    .replace(/\b\d{1,2}\b/g, " ")
    .replace(
      /\b(víz|viz|water|mozg[aá]s|movement|légz[eé]s|breath|hidrat|hydrat)\b/gi,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
  const missionMatch = text.match(
    /(?:küldetés|mission|misiune|ma[ií] f[oő]|today)\s*[:\-]?\s*(.+)/i
  );
  if (missionMatch) todayMission = missionMatch[1].trim().slice(0, 200);
  else if (stripped.length >= 3) todayMission = stripped.slice(0, 200);

  return {
    energyLevel,
    sleepQuality,
    todayMission,
    ...anchors
  };
}

/**
 * @param {string} text
 */
function parseMiddayBundle(text) {
  const focusDrift = parseYesNo(text);
  const hydrationDone = /\b(víz|viz|water|igen.*víz|done.*hydrat)/i.test(text)
    ? true
    : parseYesNo(text.replace(/víz|water/gi, "")) === false
      ? false
      : /\b(víz|viz|water|hidrat)/i.test(text);
  const movementDone = /\b(mozg[aá]s|movement|mișcare|sét[aá])/i.test(text);
  const screenDiscipline = parseScreenDiscipline(text);
  let middayCorrection = String(text || "").trim().slice(0, 200);
  if (/^\d+$/.test(middayCorrection)) middayCorrection = null;
  return {
    focusDrift,
    hydrationDone: hydrationDone || undefined,
    movementDone: movementDone || undefined,
    screenDiscipline,
    middayCorrection
  };
}

/**
 * @param {string} text
 */
function parseEveningBundle(text) {
  const parts = String(text || "")
    .split(/[|;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const eveningReflection = parts[0]?.slice(0, 300) || String(text || "").slice(0, 300);
  const energyLeak = parts[1]?.slice(0, 200) || null;
  const eveningRelease = parts[2]?.slice(0, 200) || null;
  const recoveryAction = parts[3]?.slice(0, 200) || null;
  return { eveningReflection, energyLeak, eveningRelease, recoveryAction };
}

module.exports = {
  parseScale1to10,
  parseScaleAt,
  parseYesNo,
  parseScreenDiscipline,
  parseBodyAnchors,
  parseFastingActive,
  parseMorningBundle,
  parseMiddayBundle,
  parseEveningBundle
};
