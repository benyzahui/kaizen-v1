/**
 * Internal rhythm — responses breathe: short, slow, sharp, almost silent.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { resolveMirrorMode, getMirrorCaps } = require("./stateMirroring");

const RHYTHM_VARIANTS = ["short", "breath", "slow", "sharp", "silent"];

/**
 * @param {object} state
 * @param {object} session
 * @param {string} text
 * @param {string} category
 */
function resolveRhythmMode(state, session, text, category) {
  const mirror = resolveMirrorMode(state, session, text, category);
  const msgs = session?.messages?.length || 0;
  const last = session?.lastSoulRhythm;

  let mode = "breath";
  const overloaded =
    session?.presenceMemory?.overloadActive ||
    session?.presenceMemory?.emotionalState === "overloaded" ||
    state?.emotionalIntensity >= 6;
  if (mirror === "stabilize" || mirror === "soften") {
    if (overloaded) mode = Math.random() < 0.55 ? "silent" : "slow";
    else mode = Math.random() < 0.45 ? "silent" : "short";
  }
  else if (mirror === "concise" || mirror === "sharp") mode = "sharp";
  else if (mirror === "slow") mode = "slow";
  else if (mirror === "deepen") mode = "breath";

  if (msgs > 0 && msgs % 7 === 0 && last !== "silent") mode = "silent";
  if (msgs > 0 && msgs % 5 === 0 && mode === "breath") mode = "slow";

  if (last === mode && msgs > 2) {
    const alt = RHYTHM_VARIANTS.filter((r) => r !== last);
    mode = pickSeeded(alt, `rhythm_alt_${msgs}`);
  }

  return { mode, mirror, caps: getMirrorCaps(mirror) };
}

/**
 * Shape outgoing body to rhythm.
 * @param {string} body
 * @param {{ mode: string, mirror: string, caps: object }} rhythm
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} seed
 */
function applyInternalRhythm(body, rhythm, lang, seed = "") {
  const { mode, caps } = rhythm;
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!parts.length) return body;

  if (mode === "silent") {
    return parts[0];
  }

  if (mode === "sharp") {
    parts = parts.slice(0, Math.min(2, caps.maxLines));
    return parts.join("\n");
  }

  if (mode === "short") {
    parts = parts.slice(0, Math.min(3, caps.maxLines));
  } else if (mode === "slow") {
    parts = parts.slice(0, caps.maxLines);
    if (parts.length >= 2) {
      return parts.join("\n\n");
    }
  } else {
    parts = parts.slice(0, caps.maxLines);
  }

  let out = parts.join("\n");
  if (out.length > caps.maxChars) {
    out = out.slice(0, caps.maxChars).replace(/\s+\S*$/, "") + "…";
  }

  const r = getResponses(lang);
  if (mode === "breath" && parts.length === 1 && Math.random() < 0.08) {
    const beat = r.soulRhythmBeats?.breath;
    if (beat?.length) {
      return pickSeeded(beat, seed);
    }
  }

  return out;
}

/**
 * @param {string} mode
 */
function rhythmSessionPatch(mode) {
  return { lastSoulRhythm: mode };
}

module.exports = {
  resolveRhythmMode,
  applyInternalRhythm,
  rhythmSessionPatch,
  RHYTHM_VARIANTS
};
