/**
 * Energy principles — static reference.
 * Cycles, polarity, grounding tactics, shadow + purpose prompts.
 *
 * Context only. Action still creates reality.
 */

const CYCLES = Object.freeze({
  ignition: "High initiative window. Begin, but don't sprint into burnout.",
  build: "Stack small wins. Visible progress, invisible foundation.",
  peak: "Output and clarity. Decide carefully — everything amplifies.",
  integration: "Slower energy. Synthesize and adjust before pushing again.",
  release: "Let things end clean. Composting is part of growth.",
  rest: "Pull back. Stillness is data, not laziness."
});

const POLARITY = Object.freeze({
  masculine: "Direction, structure, action. Holds the line.",
  feminine: "Receptivity, intuition, flow. Reads the field.",
  balanced: "Action with sensitivity. Structure with breath."
});

const GROUNDING_PRACTICES = Object.freeze([
  "Feet flat. Three slow breaths. Name what you can see.",
  "Cold water on hands and face for ten seconds.",
  "Walk five minutes without your phone.",
  "Exhale longer than the inhale. Six rounds.",
  "Hum on the out-breath. The vagus nerve listens.",
  "Place a hand on your chest. Slow down before deciding."
]);

const SHADOW_PROMPTS = Object.freeze([
  "What part of yourself were you trying to silence today?",
  "What feeling did you outrun instead of feel?",
  "Where did self-judgment dress up as discipline?",
  "Who in your life are you projecting onto right now?",
  "What truth are you almost ready to say out loud?"
]);

const PURPOSE_PROMPTS = Object.freeze([
  "If no one would ever know, what would you still build?",
  "What would your most regulated self do this week?",
  "Where does your effort feel like remembering, not forcing?",
  "What costs you peace but isn't earning anything?"
]);

const MASTERY_NOTES = Object.freeze({
  selfMastery: "Self-mastery is the slow return to your own center under load.",
  regulation: "You cannot think your way calm. Slow the body, then re-enter.",
  shadow: "Shadow work is not self-attack. It is meeting the parts you exiled.",
  purpose: "Purpose is alignment, not performance. Quiet work counts."
});

function cycleNote(key) {
  const k = String(key || "").toLowerCase();
  return CYCLES[k] ? { phase: k, note: CYCLES[k] } : null;
}

function polarityNote(key) {
  const k = String(key || "").toLowerCase();
  return POLARITY[k] || null;
}

module.exports = {
  CYCLES,
  POLARITY,
  GROUNDING_PRACTICES,
  SHADOW_PROMPTS,
  PURPOSE_PROMPTS,
  MASTERY_NOTES,
  cycleNote,
  polarityNote
};
