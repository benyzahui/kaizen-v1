/**
 * Phases 153–161 — first real user open-chat immersion (HU).
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");

const SCENARIOS = [
  { t: "Random gondolat: miért vagyok ilyen fáradt.", tag: "random" },
  { t: "Túl sok minden.", tag: "stress" },
  { t: "Nem tudom mit érzek.", tag: "confusion" },
  { t: "Megcsináltam végre!", tag: "win" },
  { t: "Rossz nap.", tag: "bad_day" },
  { t: "Na.", tag: "silence" },
  { t: "lol sok tab", tag: "humor" },
  { t: "trade előtt remeg a kezem", tag: "trading" },
  { t: "Most csak kifáradtam.", tag: "tired" },
  { t: "Szia", tag: "greeting" },
  { t: "ok", tag: "minimal" },
  { t: "Félek holnap.", tag: "anxiety" }
];

const CMD_RE = /→\s*\//;
const ASSISTANT_RE = /(how can i help|feel free to|adj egy új részletet|add one new fact)/i;
const ESSAY_RE = /(akaraterő hamar ég|willpower alone)/i;
const MICRO_RE = /^(na\.|értem\.|hm\.|jó\.|az sok\.)/im;
const NATURAL_RE = /(soknak hangzik|nem kell ma mindent|regóta húzod)/i;

function expand(n = 72) {
  const out = [];
  let i = 0;
  while (out.length < n) {
    for (const row of SCENARIOS) {
      out.push({ ...row, id: i++ });
      if (out.length >= n) break;
    }
  }
  return out;
}

async function run() {
  const uid = "first_real_user";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  for (const row of expand(72)) {
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

    if (CMD_RE.test(out.reply)) throw new Error(`${row.tag}: command in body`);
    if (ASSISTANT_RE.test(out.reply)) throw new Error(`${row.tag}: assistant energy`);
    if (ESSAY_RE.test(out.reply)) throw new Error(`${row.tag}: essay coach`);

    log.push({
      tag: row.tag,
      category: out.category,
      lines: out.reply.split(/\n/).filter(Boolean).length,
      len: out.reply.length,
      reply: out.reply
    });
  }

  updateSession(uid, { lastAt: Date.now() - 9 * 60 * 60 * 1000 });
  session = getSession(uid);
  session.onboardingCompleted = true;
  const reentry = await handleOpenConversation(
    { text: "Szia", from: { id: uid }, chat: { id: uid } },
    "hu",
    session
  );

  const report = {
    messages: log.length,
    avgLen: Math.round(log.reduce((s, x) => s + x.len, 0) / log.length),
    oneTwoLinePct: Math.round(
      (log.filter((x) => x.lines <= 2).length / log.length) * 100
    ),
    uniquePrefixes: new Set(log.map((x) => x.reply.slice(0, 40))).size,
    microHits: log.filter((x) => MICRO_RE.test(x.reply)).length,
    naturalSupportHits: log.filter((x) => NATURAL_RE.test(x.reply)).length,
    relationalFlow: log.filter((x) => x.category === "relational_flow").length,
    lifeFlow: log.filter((x) => x.category === "life_flow").length,
    reentryCategory: reentry.category,
    cmdHintsOnReentry: CMD_RE.test(reentry.reply)
  };

  if (report.uniquePrefixes < 18) throw new Error(`repetitive: ${report.uniquePrefixes}`);
  if (report.oneTwoLinePct < 70) throw new Error(`not human-paced: ${report.oneTwoLinePct}%`);

  console.log("✓ first-real-user-immersion passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
