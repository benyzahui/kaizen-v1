/**
 * Phases 169–176 — beta ship quality lock: repetition, human language, daily use.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");
const { SHAME_PRESSURE_RE } = require("../src/companion/betaShipLock");

const DAILY = [
  { t: "Reggel stressz.", tag: "stress" },
  { t: "Túl sok minden.", tag: "overload" },
  { t: "Unalom.", tag: "boredom" },
  { t: "Na.", tag: "silence" },
  { t: "lol tab chaos", tag: "humor" },
  { t: "Megcsináltam!", tag: "win" },
  { t: "Nincs motiváció.", tag: "motivation" },
  { t: "trade előtt ideges vagyok.", tag: "trading" },
  { t: "Kimerült vagyok.", tag: "fatigue" },
  { t: "Nehéz nap.", tag: "heavy" },
  { t: "ok", tag: "minimal" },
  { t: "Most jöttem haza.", tag: "home" }
];

const AI_TECH_RE =
  /\b(overload state detected|cognitive fragmentation|loop detected|emotional overload detected|state detected)\b/i;
const CLINICAL_RE = /\b(idegrendszeri fáradás|nervous system fatigue)\b/i;
const CMD_RE = /→\s*\//;

function expand(n = 96) {
  const out = [];
  let i = 0;
  while (out.length < n) {
    for (const row of DAILY) {
      out.push({ ...row, id: i++ });
      if (out.length >= n) break;
    }
  }
  return out;
}

function openerKey(reply) {
  return (reply.split(/\n/)[0] || "").trim().slice(0, 24).toLowerCase();
}

async function run() {
  const uid = "beta_ship_lock";
  clearSession(uid);
  clearPatternState(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  const openerCounts = new Map();

  for (const row of expand(96)) {
    const out = await handleOpenConversation(
      { text: row.t, from: { id: uid }, chat: { id: uid } },
      "hu",
      session
    );
    recordInteraction(uid, {
      text: row.t,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;

    if (AI_TECH_RE.test(out.reply)) throw new Error(`${row.tag}: AI tech language`);
    if (CLINICAL_RE.test(out.reply)) throw new Error(`${row.tag}: clinical line`);
    if (SHAME_PRESSURE_RE.test(out.reply)) throw new Error(`${row.tag}: shame pressure`);
    if (CMD_RE.test(out.reply)) throw new Error(`${row.tag}: cmd hint`);

    const ok = openerKey(out.reply);
    openerCounts.set(ok, (openerCounts.get(ok) || 0) + 1);

    log.push({
      tag: row.tag,
      category: out.category,
      lines: out.reply.split(/\n/).filter(Boolean).length,
      len: out.reply.length,
      opener: ok,
      reply: out.reply
    });
  }

  const topOpener = [...openerCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const uniq = new Set(log.map((x) => x.reply.slice(0, 40))).size;
  const oneTwo = log.filter((x) => x.lines <= 2).length;
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);

  const report = {
    messages: log.length,
    avgLen,
    oneTwoLinePct: Math.round((oneTwo / log.length) * 100),
    uniquePrefixes: uniq,
    topOpener: topOpener ? { key: topOpener[0], count: topOpener[1] } : null,
    lifeFlow: log.filter((x) => x.category === "life_flow").length,
    natural: log.filter((x) => x.category === "natural_conversation").length
  };

  if (uniq < 22) throw new Error(`too repetitive: ${uniq}`);
  if (topOpener && topOpener[1] > 16) {
    throw new Error(`opener spam: ${topOpener[0]} x${topOpener[1]}`);
  }
  if (oneTwo < 75) throw new Error(`not daily-usable pacing: ${oneTwo}`);

  console.log("✓ beta-ship-lock passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
