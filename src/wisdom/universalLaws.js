/**
 * Universal laws — grounded interpretations.
 * Each law has a poetic summary and a non-mystical reframe.
 *
 * KaiZen uses these as context, not prophecy.
 */

const LAWS = Object.freeze({
  attraction: {
    key: "attraction",
    title: "Law of Attraction",
    summary: "What you embody, you invite. Inner state shapes outer pattern.",
    grounded:
      "Not magic — your nervous system shapes what you notice, tolerate, and pursue."
  },
  vibration: {
    key: "vibration",
    title: "Law of Vibration",
    summary: "Everything has a frequency. Yours moves what you can meet.",
    grounded:
      "Sleep, breath, body, words. Manage state before chasing outcomes."
  },
  correspondence: {
    key: "correspondence",
    title: "Law of Correspondence",
    summary: "As within, so without. Outer chaos often mirrors inner chaos.",
    grounded:
      "Clean one small inner pattern. Watch what loosens around you."
  },
  cause: {
    key: "cause",
    title: "Law of Cause and Effect",
    summary: "Action returns — in form and timing not always chosen.",
    grounded:
      "You don't escape cause. You design better causes."
  }
});

const PRACTICES = Object.freeze({
  discipline:
    "Discipline is devotion repeated until it becomes nervous system.",
  regulation:
    "You cannot think your way calm. Breathe, slow the body, re-enter.",
  shadow:
    "Shadow work is not self-attack — it is meeting the parts you exiled.",
  mastery:
    "Self-mastery is the slow return to your own center under load.",
  purpose:
    "Purpose is alignment, not performance. Quiet effort counts."
});

const CORE_PHILOSOPHY =
  "Energy gives context, but action creates reality.";

function lawSummary(key) {
  return LAWS[String(key || "").toLowerCase()] || null;
}

function allLaws() {
  return Object.values(LAWS);
}

function practice(key) {
  return PRACTICES[String(key || "").toLowerCase()] || null;
}

module.exports = {
  LAWS,
  PRACTICES,
  CORE_PHILOSOPHY,
  lawSummary,
  allLaws,
  practice
};
