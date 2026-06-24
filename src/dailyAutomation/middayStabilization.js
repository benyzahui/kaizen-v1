/**
 * Midday stabilization — 12:00 check-in + energy routing.
 */

const { lines } = require("../personality/kaizenVoice");
const { updateSession } = require("../session/sessionStore");
const { pickDailyPresenceLine } = require("../personality/v2/dailyPresenceV2");
const { pickPhaseMantra, pickEnergyProtocol } = require("./contentRouter");

const LABELS = {
  en: {
    checkin: "🐉 Midday check-in.",
    energy: "How is your energy?",
    low: "⚡ 1 — Low",
    stable: "⚡ 2 — Stable",
    high: "⚡ 3 — High",
    protocol: "Protocol:"
  },
  hu: {
    checkin: "🐉 Dél — check-in.",
    energy: "Milyen az energiád?",
    low: "⚡ 1 — Alacsony",
    stable: "⚡ 2 — Stabil",
    high: "⚡ 3 — Magas",
    protocol: "Protokoll:"
  },
  ro: {
    checkin: "🐉 Amiază — check-in.",
    energy: "Cum e energia ta?",
    low: "⚡ 1 — Scăzută",
    stable: "⚡ 2 — Stabilă",
    high: "⚡ 3 — Ridicată",
    protocol: "Protocol:"
  }
};

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 */
function buildMiddayEnergyPrompt(lang, session, userId, dateKey) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const L = LABELS[locked] || LABELS.en;
  const opener = pickDailyPresenceLine(locked, "midday", userId, dateKey, session).split("\n")[0];

  return lines(
    opener || L.checkin,
    "",
    L.energy,
    "",
    L.low,
    L.stable,
    L.high
  );
}

/**
 * @param {string|number} userId
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} dateKey
 */
function armMiddayEnergyCheck(userId, lang, dateKey) {
  updateSession(userId, {
    middayEnergyPending: true,
    middayEnergyDateKey: dateKey,
    middayEnergyLang: lang
  });
}

/**
 * @param {'low'|'stable'|'high'} energy
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 */
function buildMiddayProtocolForEnergy(energy, lang, session, userId, dateKey) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const L = LABELS[locked] || LABELS.en;
  const sessionWithEnergy = { ...session, energyState: energy };

  const mantra = pickPhaseMantra("midday", locked, sessionWithEnergy, userId, dateKey);
  const proto = pickEnergyProtocol("midday", locked, sessionWithEnergy, userId, dateKey, {
    energyState: energy === "stable" ? "stable" : energy
  });

  const actions = proto?.actions?.length
    ? proto.actions.slice(0, 3).map((a) => `• ${a}`).join("\n")
    : energy === "low"
      ? locked === "hu"
        ? "• Víz\n• 5 lépés\n• 3 lassú lélegzet"
        : locked === "ro"
          ? "• Apă\n• 5 pași\n• 3 respirații lente"
          : "• Water\n• 5 steps\n• 3 slow breaths"
      : energy === "high"
        ? locked === "hu"
          ? "• Egy mély blokk\n• Egy döntés\n• Egy lezárás"
          : locked === "ro"
            ? "• Un bloc profund\n• O decizie\n• O închidere"
            : "• One deep block\n• One decision\n• One close"
        : locked === "hu"
          ? "• Egy stabil blokk\n• Víz\n• Egy irány"
          : locked === "ro"
            ? "• Un bloc stabil\n• Apă\n• O direcție"
            : "• One stable block\n• Water\n• One direction";

  return lines(
    L.protocol,
    "",
    mantra?.text ? `"${mantra.text}"` : "",
    "",
    actions
  );
}

/**
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} [opts]
 */
function buildMiddayStabilization(lang, session, userId, dateKey, opts = {}) {
  const body = buildMiddayEnergyPrompt(lang, session, userId, dateKey);
  if (opts.armPending !== false) {
    armMiddayEnergyCheck(userId, lang, dateKey);
  }
  return body;
}

module.exports = {
  LABELS,
  buildMiddayEnergyPrompt,
  buildMiddayProtocolForEnergy,
  buildMiddayStabilization,
  armMiddayEnergyCheck
};
