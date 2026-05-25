/**
 * Protocol engine — discipline companion responses (not open chat).
 */

const { pickSeeded } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { lines } = require("../personality/kaizenVoice");
const { buildProtocolState } = require("./protocolStateEngine");
const { enforceHardLanguageLock } = require("../i18n/languageHardLock");

const MAX_OPEN_LINES = 6;
const MAX_OPEN_CHARS = 380;

/**
 * @param {object} params
 */
function pickProtocolGuidance(params) {
  const { lang, protocolState, text, session } = params;
  const r = getResponses(lang);
  const g = r.protocolGuidance || {};
  const { energyState, disciplineState, nervousSystemState, activeMode } = protocolState;

  const pools = [];

  if (energyState === "exhausted" || energyState === "low") {
    pools.push(...(g.energy_low || []), ...(g.recovery || []));
  }
  if (energyState === "overstimulated") {
    pools.push(...(g.energy_overstimulated || []), ...(g.stabilization || []));
  }
  if (disciplineState === "drifting" || disciplineState === "inconsistent") {
    pools.push(...(g.discipline_drift || []));
  }
  if (disciplineState === "locked_in") {
    pools.push(...(g.discipline_locked || []));
  }
  if (nervousSystemState === "overloaded" || nervousSystemState === "anxious") {
    pools.push(...(g.nervous_overload || []), ...(g.emergency_short || []));
  }
  if (nervousSystemState === "grounded") {
    pools.push(...(g.grounded || []));
  }

  const modePool = g.modes?.[activeMode] || g.general || [];
  pools.push(...modePool);

  if (/(help|segít|mit csináljak|what should|how do i)/i.test(text)) {
    pools.push(...(g.asked_help || []));
  }
  if (/^(ok|na|hm|…|\.\.\.)$/i.test(String(text || "").trim())) {
    pools.push(...(g.silence || []));
  }

  const unique = [...new Set(pools.filter(Boolean))];
  if (!unique.length) {
    return pickSeeded(
      g.fallback || ["Stabilize first. Push later.", "One clean action."],
      `prot_fb_${session?.userId || "0"}`
    );
  }

  return pickSeeded(unique, `prot_${activeMode}_${energyState}_${disciplineState}_${session?.userId || "0"}`);
}

/**
 * @param {string} body
 */
function capProtocolBody(body) {
  let parts = String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (parts.length > MAX_OPEN_LINES) {
    parts = parts.slice(0, MAX_OPEN_LINES);
  }

  let out = parts.join("\n");
  if (out.length > MAX_OPEN_CHARS) {
    out = parts.slice(0, 3).join("\n");
  }
  return out.trim();
}

/**
 * Suggested command from state — not spam.
 * @param {object} protocolState
 */
function suggestProtocolCommand(protocolState) {
  const { energyState, nervousSystemState } = protocolState;
  if (energyState === "exhausted" || energyState === "low") return "/reset";
  if (nervousSystemState === "overloaded") return "/reset";
  if (energyState === "overstimulated") return "/focus";
  return null;
}

/**
 * @param {string|number} userId
 * @param {string} text
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @returns {string|null}
 */
function buildProtocolOpenReply(userId, text, session, lang) {
  if (!session?.onboardingCompleted) return null;

  const protocolState = buildProtocolState(session, text, "protocol_guidance");
  const line = pickProtocolGuidance({ lang, protocolState, text, session });
  const r = getResponses(lang);

  let body = line;
  if (protocolState.energyState === "exhausted" && r.protocolStabilizeLead) {
    body = lines(r.protocolStabilizeLead, line);
  }

  body = capProtocolBody(body);
  return enforceHardLanguageLock(body, lang, session, userId);
}

/**
 * @param {object} params
 */
function buildProtocolOpenResult(userId, text, session, lang) {
  const body = buildProtocolOpenReply(userId, text, session, lang);
  if (!body) return null;
  const protocolState = buildProtocolState(session, text, "protocol_guidance");
  return {
    body,
    category: "protocol_guidance",
    suggestedCommand: suggestProtocolCommand(protocolState),
    protocolState
  };
}

module.exports = {
  buildProtocolOpenReply,
  buildProtocolOpenResult,
  capProtocolBody,
  suggestProtocolCommand,
  MAX_OPEN_LINES
};
