/**
 * Phase 114 — long emotionally realistic trust immersion.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { buildListeningReply } = require("../src/conversation/deepListening");

const SCRIPT = [
  { text: "Szégyenlem hogy így érzem.", tag: "shame" },
  { text: "Kimerült vagyok, nem bírom.", tag: "exhausted" },
  { text: "Magányosnak érzem magam.", tag: "lonely" },
  { text: "Nagy célom van de szétesik minden.", tag: "ambition" },
  { text: "Nem tudom mi van velem mostanában.", tag: "confusion" },
  { text: "Na.", tag: "silence" },
  { text: "lol 9000 tab", tag: "humor" },
  { text: "Dühös vagyok.", tag: "frustration" },
  { text: "Most jöttem haza.", tag: "home" },
  { text: "Megcsináltam végre a blokkot.", tag: "win" },
  { text: "Munka után teljesen üres vagyok.", tag: "after_work" },
  { text: "Félek mi lesz holnap.", tag: "future" },
  { text: "ok", tag: "minimal" }
];

const WISDOM_RE =
  /(chaos grows|discipline disappear|nervous system remembers|energy leaks destroy|elite zone|identity is forged|kovácsolódik identitás)/i;
const THERAPY_RE = /(healing journey|inner child|validate your feelings)/i;

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const uid = "trust_immersion";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  for (let i = 0; i < 52; i++) {
    const row = SCRIPT[i % SCRIPT.length];
    const out = await handleOpenConversation(
      { text: row.text, from: { id: uid }, chat: { id: uid } },
      "hu",
      session
    );
    recordInteraction(uid, {
      text: row.text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    log.push({ ...row, category: out.category, len: out.reply.length, reply: out.reply });
    session = getSession(uid);
    session.onboardingCompleted = true;

    assert(!WISDOM_RE.test(out.reply), `${row.tag}: wisdom quote`);
    assert(!THERAPY_RE.test(out.reply), `${row.tag}: therapy voice`);
    assert(!/→\s*\//.test(out.reply), `${row.tag}: command hint`);
  }

  const listen = buildListeningReply(
    "Nem tudom mi van velem mostanában.",
    "hu",
    { messages: [{}, {}, {}] },
    uid
  );
  assert(listen && /\?/.test(listen), "listening question");

  const uniq = new Set(log.map((x) => x.reply.slice(0, 45))).size;
  const oneLine = log.filter((x) => x.reply.split(/\n/).filter(Boolean).length <= 2).length;
  const mirrors = log.filter((x) => x.category === "avoidance_mirror").length;
  const life = log.filter((x) => x.category === "life_flow").length;

  console.log("✓ trust-immersion-smoke passed");
  console.log(
    JSON.stringify(
      {
        messages: log.length,
        uniquePrefixes: uniq,
        oneLinePct: Math.round((oneLine / log.length) * 100),
        avoidanceMirrors: mirrors,
        lifeFlow: life
      },
      null,
      2
    )
  );

  assert(uniq >= 18, `too repetitive: ${uniq}`);
  assert(mirrors <= 2, `too many mirrors: ${mirrors}`);
  assert(oneLine >= 12, `not enough density: ${oneLine}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
