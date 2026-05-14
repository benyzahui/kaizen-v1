/**

 * /energy — short daily energy reflection.

 *

 * Composes a strict 4-section message:

 *   1. Energy of the day

 *   2. Watch

 *   3. Aligned action

 *   4. Reminder

 *

 * No fortune-telling, no absolutes, no fear-based predictions.

 * Energy is always paired with a concrete, practical action.

 */



const { lines } = require("../personality/tone");
const { dayNumber, reduceNumber } = require("../wisdom/numerology");
const { seasonForDate, seasonMeaning } = require("../wisdom/astrologyBasics");
const { getResponses } = require("../i18n/getResponses");



function pickByDay(map, n) {

  if (map[n]) return map[n];

  const reduced = reduceNumber(n, false);

  return map[reduced] || "";

}



function capitalize(s) {

  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

}



function seasonAddendum(date) {

  const sign = seasonForDate(date);

  if (!sign) return "";

  const info = seasonMeaning(sign);

  if (!info) return "";

  return `${capitalize(info.sign)} season favors ${info.theme}.`;

}



function buildEnergyReply(date = new Date(), lang = "en") {

  const maps = getEnergyMaps(lang);

  const c = getResponses(lang);

  const num = dayNumber(date);



  const energy = pickByDay(maps.energy, num);

  const watch = pickByDay(maps.watch, num);

  const action = pickByDay(maps.action, num);

  const reminder = pickByDay(maps.reminder, num);



  const season = seasonAddendum(date);

  const energyLine = season ? `${energy} ${season}` : energy;



  return lines(

    c.energyHeader,

    energyLine,

    "",

    c.watchHeader,

    watch,

    "",

    c.actionHeader,

    action,

    "",

    c.reminderHeader,

    reminder

  );

}



async function handleEnergy(message, lang = "en") {

  return buildEnergyReply(new Date(), lang);

}



module.exports = {

  handleEnergy,

  buildEnergyReply

};


