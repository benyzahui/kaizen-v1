/**
 * Best-effort in-function memory (no DB).
 * Resets on cold start; good enough to catch rapid spirals in one session.
 */

const RESET_WINDOW_MS = 20 * 60 * 1000; // 20 min
const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 h
const TRIGGER_COUNT = 3;

/** @type {Map<string, { kind: string, count: number, firstAt: number, cooldownUntil: number }>} */
const state = new Map();

function keyFor(userId) {
  return String(userId ?? "unknown");
}

/**
 * @returns {{ blocked: boolean, kind?: string }}
 */
function recordPattern(userId, kind) {
  if (!kind) return { blocked: false };

  const k = keyFor(userId);
  const now = Date.now();
  let s = state.get(k);

  if (s?.cooldownUntil && now < s.cooldownUntil) {
    return { blocked: true, kind: s.kind };
  }

  if (s?.cooldownUntil && now >= s.cooldownUntil) {
    state.delete(k);
    s = undefined;
  }

  if (!s || s.kind !== kind || now - s.firstAt > RESET_WINDOW_MS) {
    state.set(k, { kind, count: 1, firstAt: now, cooldownUntil: 0 });
    return { blocked: false };
  }

  s.count += 1;
  s.firstAt = now;

  if (s.count >= TRIGGER_COUNT) {
    s.cooldownUntil = now + COOLDOWN_MS;
    s.count = 0;
    state.set(k, s);
    return { blocked: true, kind };
  }

  state.set(k, s);
  return { blocked: false };
}

function isInCooldown(userId) {
  const s = state.get(keyFor(userId));
  const now = Date.now();
  return Boolean(s?.cooldownUntil && now < s.cooldownUntil);
}

module.exports = {
  recordPattern,
  isInCooldown,
  RESET_WINDOW_MS,
  COOLDOWN_MS,
  TRIGGER_COUNT
};
