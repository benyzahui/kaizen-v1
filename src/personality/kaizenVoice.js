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

module.exports = { lines, pickSeeded, disclaimer };
