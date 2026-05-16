/**
 * Build profile through conversation — no questionnaire energy.
 */

function parseFocusToken(raw) {
  const t = String(raw || "").trim().toLowerCase();
  const n = parseInt(t, 10);
  if (n === 1 || /\b(mind|stress|mental)\b/.test(t)) return { id: "mind" };
  if (n === 2 || /\b(body|discipline|test|fizikai)\b/.test(t)) return { id: "body" };
  if (n === 3 || /\b(energy|awareness|energia)\b/.test(t)) return { id: "energy" };
  if (n === 4 || /\b(trad(e|ing)|tőzsde)\b/.test(t)) return { id: "trading" };
  if (n === 5 || /\b(business|execution|munka|üzlet)\b/.test(t)) return { id: "business" };
  if (n === 6 || /\b(mixed|vegyes|all at once)\b/.test(t)) return { id: "mixed" };
  return null;
}

function inferPathFromText(text) {
  const low = String(text || "").toLowerCase();
  if (/\b(trad(e|ing)|tőzsde|piac|forex|crypto|btc)\b/.test(low)) return "trading";
  if (/\b(business|platform|startup|üzlet|munka|execution|launch)\b/.test(low)) {
    return "business";
  }
  if (/\b(body|test|fizikai|edzés|gym|futás|sleep|alvás)\b/.test(low)) {
    return "physical";
  }
  if (/\b(stress|anxiety|mind|elme|gondolat|burnout|overwhelm|chaos)\b/.test(low)) {
    return "emotional";
  }
  if (/\b(energy|spiritual|awareness|energia|tudat)\b/.test(low)) return "spiritual";
  if (/\b(discipline|fegyelem|habit|szokás)\b/.test(low)) return "selfdev";
  if (/\b(mind.?body|everything|all at once|vegyes|mixed)\b/.test(low)) return "mixed";
  return null;
}

function inferObstacle(text) {
  const low = String(text || "").toLowerCase();
  if (/(overthink|túlgond|ruminat)/.test(low)) return "overthinking";
  if (/(impuls|fomo|revenge)/.test(low)) return "impulse";
  if (/(procrast|halog|avoid)/.test(low)) return "structure";
  if (/(burnout|kiég|epuiz)/.test(low)) return "burnout";
  if (/(chaos|szétes|overwhelm|túl sok)/.test(low)) return "emotional_chaos";
  if (/(habit|szokás)/.test(low)) return "habits";
  return null;
}

function inferIntensity(text) {
  const low = String(text || "").toLowerCase();
  if (/(be gentle|finoman|blând|soft|slow down)/.test(low)) return "gentle";
  if (/(direct|sharp|kemény|push me|tarts)/.test(low)) return "direct";
  return "balanced";
}

function inferMission(text) {
  const m = String(text || "").match(
    /(?:working on|building|trying to|rebuild|ship|finish|launch|fókusz|dolgozom|lucrez la)\s+(.{8,120})/i
  );
  if (m) return m[1].trim().slice(0, 200);
  const lines = String(text || "")
    .split(/[.!?\n]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 12);
  if (lines.length) return lines[0].slice(0, 200);
  return null;
}

/**
 * @param {string} text
 * @returns {object} session patch fields
 */
function extractInvisibleProfile(text) {
  const raw = String(text || "").trim();
  const focus = parseFocusToken(raw);
  const FOCUS_PATH = {
    mind: "emotional",
    body: "physical",
    energy: "spiritual",
    trading: "trading",
    business: "business",
    mixed: "mixed"
  };
  const path = focus ? FOCUS_PATH[focus.id] : inferPathFromText(raw);

  const patch = {};
  if (path) {
    patch.userPrimaryPath = path;
    patch.sessionTodayFocus = focus?.id || path;
  }
  const goal = inferMission(raw);
  if (goal) patch.userGoal30Days = goal;
  const obstacle = inferObstacle(raw);
  if (obstacle) {
    patch.userMainObstacle = obstacle;
    patch.userMainObstacleNote = null;
  }
  const intensity = inferIntensity(raw);
  if (intensity) patch.userIntensityPreference = intensity;
  if (goal && goal.length < 120) patch.currentMission = goal.slice(0, 120);

  return {
    patch,
    focusId: focus?.id || null,
    path,
    confident: Boolean(focus || (path && raw.length > 40))
  };
}

module.exports = {
  extractInvisibleProfile,
  inferPathFromText,
  inferObstacle,
  inferIntensity,
  inferMission
};
