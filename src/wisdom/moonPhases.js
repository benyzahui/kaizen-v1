/**
 * Moon phases — static archetypal notes.
 * No live calculation in V1; the phase is passed in (e.g. "full", "waning crescent").
 */

const PHASES = Object.freeze({
  new: {
    theme: "beginning",
    note: "Plant a small intention. Privately."
  },
  "waxing crescent": {
    theme: "build",
    note: "Take one small action toward the seed."
  },
  "first quarter": {
    theme: "decision",
    note: "Push through resistance with calm pressure."
  },
  "waxing gibbous": {
    theme: "refine",
    note: "Adjust the plan. Stay with it."
  },
  full: {
    theme: "clarity",
    note: "Things surface. Hold steady. Do not react."
  },
  "waning gibbous": {
    theme: "share",
    note: "Teach what you've learned. Then rest."
  },
  "last quarter": {
    theme: "release",
    note: "Let go of what no longer fits."
  },
  "waning crescent": {
    theme: "rest",
    note: "Slow body, quiet mind. Restore."
  }
});

const ALIASES = Object.freeze({
  "new moon": "new",
  "full moon": "full",
  "first": "first quarter",
  "last": "last quarter",
  "third quarter": "last quarter",
  "balsamic": "waning crescent",
  "disseminating": "waning gibbous"
});

function normalizePhase(name) {
  if (!name) return null;
  const k = String(name).toLowerCase().trim();
  if (PHASES[k]) return k;
  return ALIASES[k] || null;
}

function phaseMeaning(name) {
  const key = normalizePhase(name);
  if (!key) return null;
  return { phase: key, ...PHASES[key] };
}

module.exports = { PHASES, ALIASES, normalizePhase, phaseMeaning };
