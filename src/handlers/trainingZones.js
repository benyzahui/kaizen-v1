/**
 * Training Zones — V2.1.
 *
 * /mind, /body, /balance, /breath, /lettinggo
 *
 * Each zone: purpose statement → diagnostic question → grounded action → next step.
 * No menus. No lists of 8 things. One zone, one focus.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { getTimeSlot } = require("../core/timeContext");

function buildZoneReply(zone, session, lang) {
  const r = getResponses(lang);
  const slot = getTimeSlot(session);

  switch (zone) {
    case "/mind":
      return lines(
        r.tZoneMindTitle,
        "",
        r.tZoneMindPurpose,
        "",
        r.tZoneMindQuestion,
        "",
        r.tZoneMindAction,
        "",
        r.tZoneMindNext
      );

    case "/body":
      return lines(
        r.tZoneBodyTitle,
        "",
        r.tZoneBodyPurpose,
        "",
        r.tZoneBodyQuestion,
        "",
        r.tZoneBodyAction,
        "",
        r.tZoneBodyNext
      );

    case "/breath":
      return lines(
        r.tZoneBreathTitle,
        "",
        r.tZoneBreathInstruction,
        "",
        r.tZoneBreathRound,
        "",
        r.tZoneBreathClose,
        "",
        r.tZoneBreathNext
      );

    case "/balance":
      return lines(
        r.tZoneBalanceTitle,
        "",
        r.tZoneBalancePurpose,
        "",
        slot === "morning" ? r.tZoneBalanceMorning
          : slot === "evening" ? r.tZoneBalanceEvening
          : r.tZoneBalanceMidday,
        "",
        r.tZoneBalanceAction,
        "",
        r.tZoneBalanceNext
      );

    case "/lettinggo":
      return lines(
        r.tZoneLettingGoTitle,
        "",
        r.tZoneLettingGoPurpose,
        "",
        r.tZoneLettingGoQuestion,
        "",
        r.tZoneLettingGoAction,
        "",
        r.tZoneLettingGoNext
      );

    default:
      return null;
  }
}

module.exports = { buildZoneReply };
