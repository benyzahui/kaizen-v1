/**
 * Adaptive micro protocol + touch selection — time, energy, mode, anti-repeat.
 */

const { lines } = require("../personality/kaizenVoice");
const { MICRO_PROTOCOLS } = require("./microProtocols");
const {
  selectMicroProtocol: pickMicroFromCatalog,
  recordContentUse
} = require("../content/dailyContentEngine");
const { maybeMicroTouchpoint } = require("../retention/retentionRhythmEngine");
const { resolveTimeAwareTone } = require("../atmosphere/timeAwareTone");
const { resolveAtmosphereState } = require("../atmosphere/atmosphereEngine");
const { resolveRhythmContext } = require("../rhythm/rhythmPicker");
const { updateSession, getSession } = require("../session/sessionStore");

const HYPE_RE =
  /\b(you got this|crush it|beast mode|manifest|10x|unlock your|hajrá|sigma|limitless|motivációs guru)\b/i;

/**
 * @param {object} proto
 * @param {object} ctx
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function protocolMatches(proto, ctx, slot) {
  const phase = slot === "late_night" ? "evening" : slot;
  if (!proto.phases.includes(phase) && !proto.phases.includes(slot)) return false;

  if (ctx.nervousSystemState === "overloaded" || ctx.nervousSystemState === "anxious") {
    if (proto.category === "overload" || proto.category === "stabilization") return true;
    if (proto.intensity === "high") return false;
  }

  if (ctx.energyState === "exhausted" || ctx.energyState === "low") {
    if (proto.intensity === "high") return false;
    if (proto.category === "recovery" || proto.category === "overload") return true;
  }

  if (ctx.activeMode === "warrior" && ctx.energyState === "high") {
    if (proto.category === "warrior" || proto.intensity === "high") return true;
  }

  if (proto.modes.includes(ctx.activeMode)) return true;
  if (proto.energy.includes(ctx.energyState)) return true;

  return proto.intensity === "medium";
}

/**
 * @param {'en'|'hu'|'ro'} lang
 */
function protocolsForLang(lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return MICRO_PROTOCOLS.filter((p) => p.language === locked);
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {Date} [now]
 */
function selectMicroProtocol(slot, lang, session, userId, dateKey, now = new Date()) {
  const { syncRebuildingMode } = require("../rebuilding/rebuildingMode");
  const {
    selectRebuildingMicroProtocol
  } = require("../rebuilding/rebuildingEngine");

  syncRebuildingMode(session, "", now, userId, dateKey);
  const recoveryProto = selectRebuildingMicroProtocol(
    slot,
    lang,
    session,
    userId,
    dateKey,
    now
  );
  if (recoveryProto) return recoveryProto;

  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const rhythm = resolveRhythmContext(session, locked);
  const atmosphere = resolveAtmosphereState(session, now);
  const ctx = {
    ...rhythm,
    atmosphere,
    timeSlot: resolveTimeAwareTone(session, now).timeSlot
  };

  const picked = pickMicroFromCatalog(locked, ctx, session, userId, dateKey, slot);
  if (picked?.id) recordContentUse(userId, "micro_protocol", picked.id);

  if (picked) return picked;

  const used = new Set(session?.recentMicroProtocolIds || []);
  let pool = protocolsForLang(locked).filter((p) => protocolMatches(p, ctx, slot));
  if (!pool.length) pool = protocolsForLang(locked);
  let candidates = pool.filter((p) => !used.has(p.id));
  if (!candidates.length) candidates = pool;
  const seed = `${userId}|micro|${dateKey}|${slot}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return candidates[h % candidates.length] || null;
}

/**
 * @param {object} proto
 */
function formatMicroProtocol(proto) {
  if (!proto) return "";
  const actionLines = proto.actions.map((a) => `- ${a}`);
  return lines(proto.title, ...actionLines).trim();
}

/**
 * @param {object} proto
 * @param {string|number} userId
 */
function recordMicroProtocolUse(proto, userId) {
  if (!proto?.id) return;
  const recent = [...(getSession(userId)?.recentMicroProtocolIds || [])];
  if (!recent.includes(proto.id)) recent.push(proto.id);
  updateSession(userId, { recentMicroProtocolIds: recent.slice(-24) });
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {number} [chance] 0–1
 */
function maybeMicroTouch(lang, session, userId, dateKey, chance = 0.22, now = new Date()) {
  const tone = resolveTimeAwareTone(session, now);
  const slot = tone.timeSlot || "midday";
  return maybeMicroTouchpoint(lang, session, userId, dateKey, slot, chance, now);
}

/**
 * Full micro block for daily phase (protocol + optional touch).
 */
function buildAdaptiveMicroBlock(slot, lang, session, userId, dateKey, now = new Date()) {
  const proto = selectMicroProtocol(slot, lang, session, userId, dateKey, now);
  if (!proto) return "";

  recordMicroProtocolUse(proto, userId);
  let block = formatMicroProtocol(proto);

  const touch = maybeMicroTouch(lang, session, userId, dateKey, 0.18);
  if (touch && !block.includes(touch.slice(0, 12))) {
    block = lines(block, "", touch);
  }

  return block;
}

module.exports = {
  HYPE_RE,
  selectMicroProtocol,
  formatMicroProtocol,
  recordMicroProtocolUse,
  maybeMicroTouch,
  buildAdaptiveMicroBlock,
  protocolMatches
};
