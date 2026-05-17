/**
 * Phase 92 — 100+ message companion soul immersion simulation.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");

const SCRIPT = [
  { t: "Most jöttem haza.", e: "home" },
  { t: "Hosszú nap.", e: "tired" },
  { t: "Kimerült vagyok.", e: "exhausted" },
  { t: "Na.", e: "silence" },
  { t: "Túl sok minden.", e: "overload" },
  { t: "Jó hogy ezt kimondtam.", e: "warmth" },
  { t: "lol 9000 tab", e: "humor" },
  { t: "Megyek futni.", e: "action" },
  { t: "Vissza.", e: "return" },
  { t: "Kicsit jobb.", e: "recovery" },
  { t: "Mit ígértem tegnap?", e: "account" },
  { t: "Nem csináltam meg.", e: "avoid" },
  { t: "Holnap megcsinálom.", e: "promise" },
  { t: "Most jöttem haza.", e: "home2" },
  { t: "Stresszes.", e: "stress" },
  { t: "ok", e: "minimal" },
  { t: "Mi a mai energia?", e: "energy" },
  { t: "trade előtt vagyok", e: "trader" },
  { t: "Félek elrontani.", e: "fear" },
  { t: "Na szóval.", e: "opener" }
];

function expandScript() {
  const out = [];
  let i = 0;
  while (out.length < 110) {
    for (const row of SCRIPT) {
      out.push({ ...row, id: i++, lang: i % 5 === 0 ? "en" : "hu" });
      if (out.length >= 110) break;
    }
  }
  return out;
}

function stats(replies) {
  const lengths = replies.map((r) => r.length);
  const lines = replies.map((r) => r.split(/\n/).filter(Boolean).length);
  const uniq = new Set(replies.map((r) => r.slice(0, 40))).size;
  const cmd = replies.filter((r) => /→\s*\//.test(r)).length;
  const cringe = replies.filter((r) => /warrior|flames|forge|alpha|dragon path/i.test(r)).length;
  const warm = replies.filter((r) => /kimondt|érthető|tökéletes|heard you/i.test(r)).length;
  const close = replies.filter((r) => /hegyet|blokk mára|testedbe|mountain today/i.test(r)).length;
  const oneLine = lines.filter((l) => l === 1).length;
  const long = lengths.filter((l) => l > 450).length;
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const lenStd =
    Math.sqrt(lengths.reduce((s, l) => s + (l - avg) ** 2, 0) / lengths.length) / avg;
  return {
    count: replies.length,
    avgLen: Math.round(avg),
    lenVariance: lenStd.toFixed(2),
    oneLinePct: Math.round((oneLine / replies.length) * 100),
    longPct: Math.round((long / replies.length) * 100),
    uniquePrefixes: uniq,
    cmdHints: cmd,
    cringe,
    warmthHits: warm,
    closingHits: close
  };
}

async function run() {
  const uid = "soul_immersion";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    userPrimaryPath: "trading",
    accountabilityMode: true
  };

  const replies = [];
  const msgs = expandScript();

  for (const m of msgs) {
    session.preferredLanguage = m.lang;
    session.lang = m.lang;
    const out = await handleOpenConversation(
      { text: m.t, from: { id: uid }, chat: { id: uid } },
      m.lang,
      session
    );
    replies.push(out.reply);
    recordInteraction(uid, {
      text: m.t,
      reply: out.reply,
      lang: m.lang,
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;
    session.accountabilityMode = true;
  }

  const s = stats(replies);
  console.log("✓ companion-soul-immersion (110 msgs)");
  console.log(JSON.stringify(s, null, 2));

  if (s.cmdHints > 3) throw new Error(`too many command hints: ${s.cmdHints}`);
  if (s.cringe > 0) throw new Error(`cringe dragon lines: ${s.cringe}`);
  if (s.lenVariance < 0.12) throw new Error(`pacing too flat: variance ${s.lenVariance}`);
  if (s.uniquePrefixes < 35) throw new Error(`too repetitive: ${s.uniquePrefixes} unique`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
