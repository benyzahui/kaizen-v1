/**
 * Phases 120–121 — 7-day atmosphere presence simulation.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { HYPE_RE } = require("../src/companion/atmospherePresence");

const DAYS = [
  {
    day: 1,
    blocks: [
      { kind: "morning" },
      { text: "Reggel szétszórt vagyok." },
      { text: "Túl sok minden fut." },
      { kind: "midday" },
      { text: "Dél van, még mindig kaotikus." },
      { kind: "evening" },
      { text: "Kimerült vagyok." }
    ]
  },
  {
    day: 2,
    blocks: [
      { kind: "morning" },
      { text: "Ma egy blokkot választottam." },
      { text: "Megyek edzeni." },
      { text: "Vissza. Jobb lett." },
      { kind: "evening" },
      { text: "Ma rendezettebb volt." }
    ]
  },
  {
    day: 3,
    blocks: [
      { text: "Stresszes munka." },
      { text: "Túl sok meeting." },
      { kind: "evening" },
      { text: "Hosszú nap." }
    ]
  },
  {
    day: 4,
    blocks: [
      { kind: "morning" },
      { text: "Nem tudom mi van velem mostanában." },
      { text: "ok" },
      { kind: "evening" },
      { text: "Na." }
    ]
  },
  {
    day: 5,
    blocks: [
      { text: "Trade előtt vagyok, ideges." },
      { text: "Megálltam. Lélegzet." },
      { kind: "midday" }
    ]
  },
  {
    day: 6,
    blocks: [
      { text: "Most jöttem haza." },
      { text: "Magányos este." },
      { kind: "evening" },
      { text: "Jó hogy ezt kimondtam." }
    ]
  },
  {
    day: 7,
    blocks: [
      { kind: "morning" },
      { text: "Kicsit jobb reggel." },
      { text: "Recovery nap." },
      { kind: "evening" },
      { text: "Kösz, ma segített." }
    ]
  }
];

function stats(log) {
  const lengths = log.map((x) => x.len);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const uniq = new Set(log.map((x) => x.reply.slice(0, 50))).size;
  const calm = log.filter((x) =>
    /lassíts|tiszta blokk|nyitott kör|lélegzet|tested|feszesebb|pihenés/i.test(x.reply)
  ).length;
  const hype = log.filter((x) => HYPE_RE.test(x.reply)).length;
  const cmd = log.filter((x) => /→\s*\//.test(x.reply)).length;
  const short = log.filter((x) => x.reply.split(/\n/).filter(Boolean).length <= 2).length;
  return {
    count: log.length,
    avgLen: Math.round(avg),
    uniquePrefixes: uniq,
    calmHits: calm,
    hypeHits: hype,
    cmdHints: cmd,
    shortPct: Math.round((short / log.length) * 100)
  };
}

async function run() {
  const uid = "atmosphere_7day";
  clearSession(uid);
  const msg = { from: { id: uid }, chat: { id: uid } };
  const log = [];

  for (const dayPlan of DAYS) {
    for (const block of dayPlan.blocks) {
      updateSession(uid, {
        lastAt: Date.now() - 8 * 60 * 60 * 1000,
        onboardingCompleted: true,
        lang: "hu",
        preferredLanguage: "hu"
      });
      let session = getSession(uid);
      session.onboardingCompleted = true;

      let reply;
      let category = "open";
      if (block.kind === "morning") {
        reply = buildMorningReply(msg, session, "hu");
        category = "morning";
      } else if (block.kind === "midday") {
        reply = buildMiddayReply(session, "hu");
        category = "midday";
      } else if (block.kind === "evening") {
        reply = buildEveningReply(msg, session, "hu");
        category = "evening";
      } else {
        const out = await handleOpenConversation(
          { ...msg, text: block.text },
          "hu",
          session
        );
        reply = out.reply;
        category = out.category;
      }

      recordInteraction(uid, {
        text: block.text || block.kind || "",
        reply,
        lang: "hu",
        category
      });
      log.push({
        day: dayPlan.day,
        category,
        len: reply.length,
        reply
      });
    }
  }

  const s = stats(log);
  console.log("✓ atmosphere-presence-7day");
  console.log(JSON.stringify(s, null, 2));

  if (s.hypeHits > 0) throw new Error(`hype in replies: ${s.hypeHits}`);
  if (s.cmdHints > 3) throw new Error(`too many commands: ${s.cmdHints}`);
  if (s.uniquePrefixes < 20) throw new Error(`too repetitive: ${s.uniquePrefixes}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
