/**
 * Phases 106–107 — 3-day companion retention simulation.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");

const UID = "retention_3day";

const SCHEDULE = [
  {
    day: 1,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Reggel van. Kicsit szétszórt vagyok." },
      { phase: "midday", kind: "midday" },
      { phase: "midday", text: "Dél van, még mindig sok minden fut." },
      { phase: "evening", kind: "evening" },
      { phase: "evening", text: "Hosszú nap volt. Kimerült vagyok." },
      { phase: "night", text: "Na." }
    ]
  },
  {
    day: 2,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Ma jobb reggel. Egy blokkot választottam." },
      { phase: "midday", text: "Megcsináltam a reggeli blokkot." },
      { phase: "afternoon", text: "Jó hogy ezt kimondtam — nehéz volt." },
      { phase: "evening", kind: "evening" },
      { phase: "evening", text: "Ma végre rendezettebb volt." }
    ]
  },
  {
    day: 3,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Most jöttem haza." },
      { phase: "midday", text: "Túl sok minden egyszerre." },
      { phase: "evening", text: "Stresszes volt a nap." },
      { phase: "night", text: "ok" }
    ]
  }
];

function stats(replies) {
  const lengths = replies.map((r) => r.len);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const uniq = new Set(replies.map((r) => r.reply.slice(0, 50))).size;
  const cmd = replies.filter((r) => /→\s*\//.test(r.reply)).length;
  const attach = replies.filter((r) =>
    /zajosabb|nyugodtabb|lépsz is|revenit|calmer|quieter/i.test(r.reply)
  ).length;
  const quiet = replies.filter((r) =>
    /nehéznek hangzik|nem tartottad|no perfect|nu trebuie răspuns perfect/i.test(r.reply)
  ).length;
  const lightAcc = replies.filter((r) => r.category === "light_accountability").length;
  const ritual = replies.filter((r) => /blokk|sáv|downshift|leereszt/i.test(r.reply)).length;
  return {
    count: replies.length,
    avgLen: Math.round(avg),
    uniquePrefixes: uniq,
    cmdHints: cmd,
    attachmentHits: attach,
    quietHits: quiet,
    lightAccountability: lightAcc,
    ritualTone: ritual
  };
}

async function run() {
  clearSession(UID);
  let session = {
    ...getSession(UID),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    userPrimaryPath: "trading",
    accountabilityMode: false
  };

  const log = [];
  const msg = { from: { id: UID }, chat: { id: UID } };

  for (const dayPlan of SCHEDULE) {
    for (const block of dayPlan.blocks) {
      const gapMs = block.phase === "morning" ? 10 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
      updateSession(UID, {
        lastAt: Date.now() - gapMs,
        onboardingCompleted: true,
        preferredLanguage: "hu",
        lang: "hu"
      });
      session = getSession(UID);
      session.onboardingCompleted = true;

      let reply;
      let category = "ritual";

      if (block.kind === "morning") {
        reply = buildMorningReply(msg, session, "hu");
      } else if (block.kind === "midday") {
        reply = buildMiddayReply(session, "hu");
      } else if (block.kind === "evening") {
        reply = buildEveningReply(msg, session, "hu");
      } else {
        const out = await handleOpenConversation(
          { ...msg, text: block.text },
          "hu",
          session
        );
        reply = out.reply;
        category = out.category;
      }

      recordInteraction(UID, {
        text: block.text || block.kind || "",
        reply,
        lang: "hu",
        category
      });

      log.push({
        day: dayPlan.day,
        phase: block.phase,
        category,
        len: reply.length,
        reply
      });
      session = getSession(UID);
      session.onboardingCompleted = true;
    }
  }

  const s = stats(log);
  console.log("✓ daily-companion-retention (3 days)");
  console.log(JSON.stringify(s, null, 2));

  if (s.cmdHints > 2) throw new Error(`too many command hints: ${s.cmdHints}`);
  if (s.uniquePrefixes < 12) throw new Error(`too repetitive: ${s.uniquePrefixes}`);
  if (s.count < 18) throw new Error(`too few interactions: ${s.count}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
