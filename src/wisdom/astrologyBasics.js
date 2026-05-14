/**
 * Astrology basics — zodiac seasons as archetypal context.
 * No charts, no transits, no fate. Just seasonal flavor.
 */

const SEASONS = Object.freeze([
  { sign: "aries",       from: [3, 21],  to: [4, 19],  element: "fire",  theme: "initiation" },
  { sign: "taurus",      from: [4, 20],  to: [5, 20],  element: "earth", theme: "stability" },
  { sign: "gemini",      from: [5, 21],  to: [6, 20],  element: "air",   theme: "communication" },
  { sign: "cancer",      from: [6, 21],  to: [7, 22],  element: "water", theme: "care" },
  { sign: "leo",         from: [7, 23],  to: [8, 22],  element: "fire",  theme: "expression" },
  { sign: "virgo",       from: [8, 23],  to: [9, 22],  element: "earth", theme: "refinement" },
  { sign: "libra",       from: [9, 23],  to: [10, 22], element: "air",   theme: "balance" },
  { sign: "scorpio",     from: [10, 23], to: [11, 21], element: "water", theme: "transformation" },
  { sign: "sagittarius", from: [11, 22], to: [12, 21], element: "fire",  theme: "vision" },
  { sign: "capricorn",   from: [12, 22], to: [1, 19],  element: "earth", theme: "discipline" },
  { sign: "aquarius",    from: [1, 20],  to: [2, 18],  element: "air",   theme: "originality" },
  { sign: "pisces",      from: [2, 19],  to: [3, 20],  element: "water", theme: "integration" }
]);

const NOTES = Object.freeze({
  aries: "Start lines are crisp; pacing matters.",
  taurus: "Slow body, steady hands. Boring is the work.",
  gemini: "Conversation moves things. Listen twice, speak once.",
  cancer: "Care for the inner ground first.",
  leo: "Show up without performing.",
  virgo: "Refine one thing. Don't perfect everything.",
  libra: "Balance is a choice you keep making.",
  scorpio: "Honest depth. No dramatics.",
  sagittarius: "Vision is fuel, not a finish line.",
  capricorn: "Discipline is care, repeated.",
  aquarius: "Different paths are allowed. Stay kind.",
  pisces: "Integrate quietly. Don't dissolve."
});

function inRange(month, day, from, to) {
  const [fm, fd] = from;
  const [tm, td] = to;
  if (fm <= tm) {
    if (month === fm && day >= fd) return true;
    if (month === tm && day <= td) return true;
    return month > fm && month < tm;
  }
  // Wraps year (Capricorn).
  if (month === fm && day >= fd) return true;
  if (month === tm && day <= td) return true;
  return month > fm || month < tm;
}

function seasonForDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  for (const s of SEASONS) {
    if (inRange(m, day, s.from, s.to)) return s.sign;
  }
  return null;
}

function seasonMeaning(sign) {
  const k = String(sign || "").toLowerCase();
  const s = SEASONS.find((x) => x.sign === k);
  if (!s) return null;
  return { sign: s.sign, element: s.element, theme: s.theme, note: NOTES[s.sign] };
}

module.exports = { SEASONS, NOTES, seasonForDate, seasonMeaning };
