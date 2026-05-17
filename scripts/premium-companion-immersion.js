/**
 * Phases 145–152 — premium companion immersion (open chat, HU).
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");

const SCRIPT = [
  { t: "Kimerült vagyok, túl sok minden.", tag: "overload" },
  { t: "Magányos este.", tag: "lonely" },
  { t: "trade előtt vagyok, remeg a kezem.", tag: "trading" },
  { t: "Edzés után jobb, de még üres.", tag: "post_workout" },
  { t: "Jó nap volt.", tag: "productive" },
  { t: "Motiváció lement.", tag: "drop" },
  { t: "Félek a jövő héttől.", tag: "anxiety" },
  { t: "Nehéz nap, sok érzelem.", tag: "heavy" },
  { t: "Na.", tag: "silence" },
  { t: "ok", tag: "minimal" },
  { t: "lol sok tab", tag: "humor" },
  { t: "Most csak kifáradtam.", tag: "relational" }
];

const HYPE_RE = /\b(warrior|alpha|beast mode|10x|grind set|harcos)\b/i;
const ESSAY_RE = /\b(akaraterő hamar ég|willpower alone|identity first)\b/i;
const THERAPY_INTAKE_RE = /(van már benned tartalék|any reserve left inside)/i;
const NATURAL_SUPPORT_RE =
  /(soknak hangzik|nem kell ma mindent|regóta húzod|sounds like a lot right now|nu trebuie să rezolvi tot)/i;
const MICRO_PREMIUM_RE = /^(na\.|értem\.|az kemény lehetett|ez már tisztább)/im;

function expand(n = 84) {
  const out = [];
  let i = 0;
  while (out.length < n) {
    for (const row of SCRIPT) {
      out.push({ ...row, id: i++ });
      if (out.length >= n) break;
    }
  }
  return out;
}

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const uid = "premium_companion";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  for (const row of expand(84)) {
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

    log.push({
      tag: row.tag,
      category: out.category,
      lines: out.reply.split(/\n/).filter(Boolean).length,
      len: out.reply.length,
      reply: out.reply
    });

    assert(!HYPE_RE.test(out.reply), `${row.tag}: hype`);
    assert(!ESSAY_RE.test(out.reply), `${row.tag}: essay coach`);
    assert(!THERAPY_INTAKE_RE.test(out.reply), `${row.tag}: therapy intake`);
    assert(!/→\s*\//.test(out.reply), `${row.tag}: cmd hint`);
  }

  const naturalSupport = log.filter((x) => NATURAL_SUPPORT_RE.test(x.reply)).length;
  const microPremium = log.filter((x) => MICRO_PREMIUM_RE.test(x.reply)).length;
  const oneTwo = log.filter((x) => x.lines <= 2).length;
  const long = log.filter((x) => x.len > 350).length;
  const uniq = new Set(log.map((x) => x.reply.slice(0, 42))).size;
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);

  const report = {
    messages: log.length,
    avgLen,
    oneTwoLinePct: Math.round((oneTwo / log.length) * 100),
    longReplyPct: Math.round((long / log.length) * 100),
    uniquePrefixes: uniq,
    naturalSupportHits: naturalSupport,
    microPresenceHits: microPremium,
    relationalFlow: log.filter((x) => x.category === "relational_flow").length
  };

  assert(uniq >= 20, `repetitive: ${uniq}`);
  assert(long <= 8, `too long: ${long}`);
  assert(oneTwo >= 35, `not simple enough: ${oneTwo}`);
  assert(naturalSupport >= 2, `natural support rare: ${naturalSupport}`);

  console.log("✓ premium-companion-immersion passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
