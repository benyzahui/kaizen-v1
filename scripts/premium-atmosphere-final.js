/**
 * Premium atmosphere final — restraint, readability, no guidance spam.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const THREAD = [
  "Szia",
  "Túl sok minden",
  "Mit csináljak",
  "Na",
  "Magányos",
  "ok",
  "Kösz"
];

const FORMAT_RE = /(\*\*|→\s*\/|^[•\-*]\s)/m;
const EXPLAIN_RE = /(let me explain|fontos megérteni|the reason is)/i;
const GUIDE_RE = /(próbáld|you should|következő lépés)/i;

async function run() {
  const uid = "prem_atmo";
  clearSession(uid);
  clearPatternState(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const msg = { from: { id: uid }, chat: { id: uid } };
  const log = [];

  const morning = buildMorningReply(msg, session, "hu");
  log.push({ slot: "morning", reply: morning });

  for (const text of THREAD) {
    const out = await handleOpenConversation({ text, ...msg }, "hu", session);
    recordInteraction(uid, { text, reply: out.reply, lang: "hu", category: out.category });
    session = getSession(uid);
    session.onboardingCompleted = true;
    log.push({ slot: "open", text, reply: out.reply });
  }

  const midday = buildMiddayReply(session, "hu");
  const evening = buildEveningReply(msg, session, "hu");
  log.push({ slot: "midday", reply: midday });
  log.push({ slot: "evening", reply: evening });

  for (const row of log) {
    const r = row.reply;
    if (FORMAT_RE.test(r)) throw new Error(`format noise [${row.slot}]: ${r.slice(0, 60)}`);
    if (EXPLAIN_RE.test(r)) throw new Error(`over explain [${row.slot}]`);
    if (row.slot !== "open" || row.text !== "Mit csináljak") {
      if (GUIDE_RE.test(r) && row.text !== "Mit csináljak") {
        throw new Error(`guidance [${row.slot}]: ${r}`);
      }
    }
    if (r.split(/\n/).filter(Boolean).length > 3) {
      throw new Error(`too many lines [${row.slot}]`);
    }
    if (r.length > 200) throw new Error(`too long [${row.slot}]: ${r.length}`);
  }

  const avgLen = Math.round(log.reduce((s, x) => s + x.reply.length, 0) / log.length);
  console.log("✓ premium-atmosphere-final passed");
  console.log(JSON.stringify({ messages: log.length, avgLen }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
