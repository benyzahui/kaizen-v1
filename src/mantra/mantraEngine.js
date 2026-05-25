/**
 * Mantra engine — slot pools, adaptive tone, anti-repetition.
 */

const morningPool = require("./mantraPools/morning");
const middayPool = require("./mantraPools/midday");
const eveningPool = require("./mantraPools/evening");
const { pickSeeded } = require("../personality/kaizenVoice");
const { pickUnseenVariant, snippetKey } = require("../conversation/responseVariation");
const { updateSession } = require("../session/sessionStore");

const SLOT_POOLS = {
  morning: morningPool,
  midday: middayPool,
  evening: eveningPool,
  late_night: eveningPool
};

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} ctx rhythm context
 */
function filterPoolByContext(pool, ctx) {
  if (!pool?.length) return [];
  const { energyState, activeMode, nervousSystemState, disciplineState } = ctx;

  if (energyState === "exhausted") {
    return pool.filter((line) =>
      /rest|recovery|gentle|soft|pihen|odihn|lass|fuel|üzemanyag|combustibil|enough|elég|suficient|slow|lassú|lent/i.test(
        line
      )
    );
  }
  if (nervousSystemState === "overloaded" || nervousSystemState === "anxious") {
    return pool.filter((line) =>
      /calm|quiet|breath|léleg|respir|stimul|noise|zaj|csökkent|reduce|lower|liniște|nyugod/i.test(
        line
      )
    );
  }
  if (activeMode === "warrior") {
    return pool.filter((line) =>
      /disciplin|edge|train|execute|sharp|kemény|rep|harcos|warrior|band|sáv|lane|mission|standard/i.test(
        line
      )
    );
  }
  if (disciplineState === "drifting" || disciplineState === "inconsistent") {
    return pool.filter((line) =>
      /one|focus|lane|task|return|refocus|egy|sáv|band|continu|folytasd|reiau/i.test(line)
    );
  }
  return pool;
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 * @param {'en'|'hu'|'ro'} lang
 * @param {object} session
 * @param {string|number} userId
 * @param {string} dateKey
 * @param {object} [ctx]
 */
function pickMantraForSlot(slot, lang, session, userId, dateKey, ctx = {}) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const base = SLOT_POOLS[slot]?.[locked] || SLOT_POOLS[slot]?.en || [];
  let pool = filterPoolByContext(base, ctx);
  if (pool.length < 8) pool = base;

  const seed = `${userId}|${dateKey}|mantra|${slot}`;
  const picked =
    pickUnseenVariant(session || {}, seed, pool) || pickSeeded(pool, seed);
  return String(picked || "").trim();
}

/**
 * @param {string|number} userId
 * @param {string} mantra
 * @param {object} session
 */
function recordMantraUse(userId, mantra, session) {
  if (!mantra) return;
  const key = snippetKey(mantra);
  const recent = [...(session?.recentMantras || [])];
  if (!recent.includes(key)) recent.push(key);
  const snippets = new Set(session?.recentCoachSnippets || []);
  snippets.add(key);
  updateSession(userId, {
    recentMantras: recent.slice(-40),
    recentCoachSnippets: [...snippets].slice(-48)
  });
}

/**
 * @param {'morning'|'midday'|'evening'|'late_night'} slot
 */
function poolSize(slot, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  return (SLOT_POOLS[slot]?.[locked] || []).length;
}

module.exports = {
  pickMantraForSlot,
  recordMantraUse,
  filterPoolByContext,
  poolSize,
  SLOT_POOLS
};
