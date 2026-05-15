/**
 * Tracks last N response structures to prevent robotic repetition.
 * Opening / ending / question-pattern fingerprints.
 */

const MAX_STRUCTURES = 10;

function firstLine(text) {
  return String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .find(Boolean) || "";
}

function lastLine(text) {
  const lines = String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines[lines.length - 1] : "";
}

function normalizeChunk(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** Detect common weak template openers we want to rotate away from. */
function openingClass(line) {
  const n = normalizeChunk(line);
  if (!n) return "empty";
  if (/^(what is|mi az|ce este|what are|one grounded)/i.test(n)) return "question_opener";
  if (/^(that sounds|acknowledged|noted|heard|értem|am înțeles)/i.test(n)) return "ack_opener";
  if (/^(good morning|reggel|bună|hey|hello)/i.test(n)) return "greet_opener";
  if (n.length < 28) return "short_opener";
  return "statement_opener";
}

function endingClass(line) {
  const n = normalizeChunk(line);
  if (!n) return "empty";
  if (/\?$/.test(line.trim())) return "question_close";
  if (/\/\w+/.test(line)) return "command_close";
  if (/^(next|következő|următor)/i.test(n)) return "next_close";
  return "statement_close";
}

function hasWeakQuestionPattern(text) {
  const t = String(text || "");
  return (
    /\b(what is one grounded|what do you feel|how do you feel|what would you|what matters most|stabilizing action|grounded sentence|smallest step|legkisebb lépés|mi érzel|hogy érzed|ce simți)\b/i.test(
      t
    ) || (t.match(/\?/g) || []).length >= 2
  );
}

/**
 * @param {string} body
 * @returns {{ opening: string, ending: string, questionWeak: boolean }}
 */
function extractStructure(body) {
  const open = firstLine(body);
  const close = lastLine(body);
  return {
    opening: `${openingClass(open)}:${normalizeChunk(open).slice(0, 40)}`,
    ending: `${endingClass(close)}:${normalizeChunk(close).slice(0, 40)}`,
    questionWeak: hasWeakQuestionPattern(body)
  };
}

/**
 * @param {object} session
 * @param {{ opening: string, ending: string, questionWeak: boolean }} struct
 */
function isStructureRepeat(session, struct) {
  const hist = session.responseStructures || [];
  if (!hist.length) return false;
  const openHits = hist.filter((h) => h.opening === struct.opening).length;
  const endHits = hist.filter((h) => h.ending === struct.ending).length;
  const weakQ = struct.questionWeak && hist.filter((h) => h.questionWeak).length >= 2;
  return openHits >= 2 || endHits >= 2 || weakQ;
}

/**
 * @param {object} session
 * @param {string} body
 */
function recordStructure(session, body) {
  const struct = extractStructure(body);
  const hist = [...(session.responseStructures || []), struct].slice(-MAX_STRUCTURES);
  return { responseStructures: hist };
}

module.exports = {
  extractStructure,
  isStructureRepeat,
  recordStructure,
  openingClass,
  hasWeakQuestionPattern
};
