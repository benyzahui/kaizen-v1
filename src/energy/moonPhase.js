/**
 * Moon quality for Energy module.
 * ENERGY_MODE=static → honest placeholder (no fake precision).
 * ENERGY_MODE=api  → reserved for live ephemeris later.
 */

function getEnergyMode() {
  const m = String(process.env.ENERGY_MODE || "static").toLowerCase();
  return m === "api" ? "api" : "static";
}

/**
 * @param {Date} [_date] reserved for future astronomical calc/API
 * @returns {{ mode: 'static'|'api', displayKey: 'static_honest'|'api_pending', cycleHint: string|null }}
 */
function getMoonPhaseContext(_date = new Date()) {
  const mode = getEnergyMode();
  if (mode === "api") {
    return {
      mode: "api",
      displayKey: "api_pending",
      cycleHint: null
    };
  }
  return {
    mode: "static",
    displayKey: "static_honest",
    cycleHint: null
  };
}

module.exports = { getMoonPhaseContext, getEnergyMode };
