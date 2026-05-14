/**
 * Numerology — grounded archetypes for day numbers.
 * Reduces digits to 1–9, preserves master numbers 11 / 22 / 33.
 *
 * Themes are context, not prophecy.
 */

const MEANINGS = Object.freeze({
  1: { theme: "initiation", note: "New direction. Start small, start clean." },
  2: { theme: "cooperation", note: "Slow down. Listen before deciding." },
  3: { theme: "expression", note: "Communicate honestly. Avoid performance." },
  4: { theme: "structure", note: "Build foundations. Boring work matters today." },
  5: { theme: "movement", note: "Change is in the air. Stay grounded inside it." },
  6: { theme: "responsibility", note: "Care without overextending. Boundaries are love." },
  7: { theme: "reflection", note: "Quiet day. Think before acting." },
  8: { theme: "execution", note: "Cause meets effect. Discipline is leverage." },
  9: { theme: "integration", note: "Close loops. Release what is finished." },
  11: { theme: "vision", note: "Insight is available. Anchor it with structure." },
  22: { theme: "builder", note: "Big work begins quietly. Show up, don't announce." },
  33: { theme: "service", note: "Calm leadership. Help without losing yourself." }
});

function digitSum(n) {
  return String(Math.abs(n))
    .split("")
    .reduce((s, c) => s + Number(c), 0);
}

function reduceNumber(n, keepMasters = true) {
  let x = Math.abs(Number(n) || 0);
  while (x > 9) {
    if (keepMasters && (x === 11 || x === 22 || x === 33)) return x;
    x = digitSum(x);
  }
  return x;
}

/** Universal day number from a Date (UTC). */
function dayNumber(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return reduceNumber(digitSum(y) + m + day);
}

/** Personal day, if a birth date is provided; otherwise universal day. */
function personalDayNumber(date = new Date(), birthDate) {
  if (!birthDate) return dayNumber(date);
  const b = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const d = date instanceof Date ? date : new Date(date);
  const universalYear = reduceNumber(digitSum(d.getUTCFullYear()));
  return reduceNumber(b.getUTCMonth() + 1 + b.getUTCDate() + universalYear);
}

function dayMeaning(n) {
  const m = MEANINGS[n];
  if (m) return { number: n, ...m };
  const reduced = reduceNumber(n, false);
  return MEANINGS[reduced]
    ? { number: reduced, ...MEANINGS[reduced] }
    : null;
}

module.exports = {
  MEANINGS,
  reduceNumber,
  dayNumber,
  personalDayNumber,
  dayMeaning
};
