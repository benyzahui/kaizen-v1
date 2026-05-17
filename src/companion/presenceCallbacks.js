/**
 * Light presence memory callbacks — attachment without database dumps.
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");

/**
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 * @param {string} seed
 */
function maybePresenceCallback(session, lang, category, seed = "") {
  if (!session?.onboardingCompleted) return null;
  const pm = session.presenceMemory;
  if (!pm || (session.messages || []).length < 2) return null;
  if (Math.random() > 0.18) return null;

  const prev = pm.previousEmotionalState;
  const r = getResponses(lang);
  const pool = [];

  if (
    prev === "overloaded" &&
    (pm.emotionalState === "grounded" || pm.emotionalState === "stable")
  ) {
    pool.push(...(r.presenceCallbacks?.lessChaos || r.emotionalContinuity?.groundedAfterOverload || []));
  }
  if (prev === "overloaded" && pm.emotionalState === "overloaded") {
    pool.push(...(r.presenceCallbacks?.stillChaos || r.emotionalContinuity?.stillHeavy || []));
  }
  if (prev === "scattered" && pm.emotionalState !== "scattered") {
    pool.push(...(r.presenceCallbacks?.lessScattered || []));
  }
  if (pm.focus === "trading" || session.userPrimaryPath === "trading") {
    pool.push(...(r.presenceCallbacks?.trading || []));
  }
  if (session.lastThreadActivity?.type === "run" || session.lastThreadActivity?.type === "workout") {
    pool.push(...(r.presenceCallbacks?.training || []));
  }
  if (pm.mission) {
    pool.push(
      ...(r.presenceCallbacks?.mission || r.memoryRefMission || []).map((line) =>
        String(line).replace("{mission}", String(pm.mission).slice(0, 72))
      )
    );
  }
  if (pm.emotionalState === "tired" || pm.energyPattern === "mental fatigue") {
    pool.push(...(r.presenceCallbacks?.exhaustion || r.emotionalContinuity?.bodyFirst || []));
  }

  const checkbacks = r.naturalCheckbacks || {};
  if (pm.overloadActive || prev === "overloaded") {
    pool.push(...(checkbacks.overload || []));
  }
  if (pm.emotionalState === "scattered" || prev === "scattered") {
    pool.push(...(checkbacks.focus || []));
  }
  if (pm.emotionalState === "tired" || pm.energyPattern === "mental fatigue") {
    pool.push(...(checkbacks.exhaustion || []));
  }
  if (
    pm.lastImportantTopic &&
    (session.messages || []).length >= 6 &&
    Math.random() < 0.4
  ) {
    pool.push(...(checkbacks.general || []));
  }

  if (!pool.length) return null;
  return pickSeeded(pool, seed || `pcb_${prev}_${pm.emotionalState}_${category}`);
}

/**
 * Emotional attachment — attentive, not performative.
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} category
 */
function maybeAttachmentMoment(session, lang, category) {
  if (!session?.onboardingCompleted) return null;
  const pm = session.presenceMemory;
  if (!pm || (session.messages || []).length < 3) return null;
  if (Math.random() > 0.17) return null;

  const prev = pm.previousEmotionalState;
  const r = getResponses(lang);
  const pool = [];
  const att = r.attachmentMoments || {};

  if (
    prev === "overloaded" &&
    (pm.emotionalState === "grounded" || pm.emotionalState === "stable")
  ) {
    pool.push(...(att.calmer || []));
  }
  if (prev === "overloaded" && pm.emotionalState === "overloaded") {
    pool.push(...(att.stillHeavy || []));
  }
  const lastUser =
    session.lastUserText ||
    session.messages?.[session.messages.length - 1]?.text ||
    "";
  if (/(megcsinált|did it|done|kész|finished|lefutottam|went for|trade|edzés|run)/i.test(lastUser)) {
    pool.push(...(att.action || []));
  }
  const gap = Date.now() - (session.lastAt || Date.now());
  if (gap >= 6 * 60 * 60 * 1000 && (session.messages || []).length >= 2) {
    pool.push(...(att.return || []));
  }

  if (!pool.length) return null;
  return pickSeeded(pool, `att_${prev}_${pm.emotionalState}_${category}`);
}

module.exports = { maybePresenceCallback, maybeAttachmentMoment };
