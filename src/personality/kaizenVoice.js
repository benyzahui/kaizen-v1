/**
 * KaiZen voice helpers — calm, clear, structured. No guru tone.
 */

const tone = require("./tone");

function lines(...parts) {
  return tone.lines(...parts);
}

function pickSeeded(pool, seed) {
  return tone.pickSeeded(pool, seed);
}

const DISCLAIMER =
  "Not therapy, medical, or financial advice — grounding and discipline support only.";

const DISCLAIMER_HU =
  "Nem terápia, orvosi vagy pénzügyi tanács — földelés és fegyelem-támogatás.";

const DISCLAIMER_RO =
  "Nu e terapie, medical sau financiar — doar ancorare și suport pentru disciplină.";

function disclaimer(lang) {
  if (lang === "hu") return DISCLAIMER_HU;
  if (lang === "ro") return DISCLAIMER_RO;
  return DISCLAIMER;
}

/** One-line legal / scope boundary — use sparingly on heavy paths only. */
function disclaimerLight(lang) {
  if (lang === "hu")
    return "Nem terápia vagy pénzügyi tanács — strukturált támasz.";
  if (lang === "ro")
    return "Nu e terapie sau sfat financiar — doar structură și disciplină.";
  return "Not therapy or financial advice — structure and discipline support only.";
}

module.exports = { lines, pickSeeded, disclaimer, disclaimerLight };
