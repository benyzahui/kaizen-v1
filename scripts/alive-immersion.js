/**
 * Phase 135 — 110+ message alive immersion (open chat only, no commands).
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { TEXTURES } = require("../src/companion/alivePresence");

const SCRIPT = [
  { t: "Szégyenlem hogy így érzem.", tag: "shame" },
  { t: "Kimerült vagyok, nem bírom.", tag: "exhausted" },
  { t: "Magányosnak érzem magam.", tag: "lonely" },
  { t: "Na.", tag: "silence" },
  { t: "lol 9000 tab", tag: "humor" },
  { t: "Túl sok minden egyszerre.", tag: "overload" },
  { t: "Most jöttem haza.", tag: "home" },
  { t: "ok", tag: "minimal" },
  { t: "Dühös vagyok.", tag: "anger" },
  { t: "Megcsináltam végre.", tag: "win" },
  { t: "Félek holnap.", tag: "fear" },
  { t: "Nem tudom mi van velem.", tag: "confusion" },
  { t: "Munka után üres vagyok.", tag: "after_work" },
  { t: "Jó hogy ezt kimondtam.", tag: "warmth_user" },
  { t: "Holnap megcsinálom.", tag: "promise" },
  { t: "Nem csináltam meg.", tag: "avoid" },
  { t: "Kicsit jobb.", tag: "recovery" },
  { t: "Stresszes nap.", tag: "stress" },
  { t: "Hosszú nap.", tag: "tired" },
  { t: "Mit éreztél most?", tag: "meta" }
];

const INSIGHT_RE =
  /\b(identity|protocol|discipline|nervous system|optimize|insight|container|ego|manifest|unlock|kovácsolódik)\b/i;
const WISDOM_RE =
  /(chaos grows|discipline disappear|nervous system remembers|energy leaks destroy|elite zone)/i;
const MICRO_RE = /^(hm\.|na\.|értem\.|jó\.|az mondjuk sok\.)/im;
const PRESENCE_RE = /(itt vagyok|hallgatlak|i am here|i am listening|sunt aici)/i;
const QUIET_CONF_RE = /(nem több gondolat|előbb pihenj|túl sok terhelés|not more thoughts|rest first|too much load)/i;

function expandScript(n = 112) {
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
  const uid = "alive_immersion";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  const textures = new Set();
  const msgs = expandScript(112);

  for (const row of msgs) {
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
    if (session.lastEmotionalTexture) {
      textures.add(session.lastEmotionalTexture);
    }

    log.push({
      tag: row.tag,
      category: out.category,
      texture: session.lastEmotionalTexture,
      lines: out.reply.split(/\n/).filter(Boolean).length,
      len: out.reply.length,
      reply: out.reply
    });

    assert(!WISDOM_RE.test(out.reply), `${row.tag}: wisdom quote leak`);
    assert(!/→\s*\//.test(out.reply), `${row.tag}: command hint`);
  }

  const microHits = log.filter((x) => MICRO_RE.test(x.reply)).length;
  const presenceHits = log.filter((x) => PRESENCE_RE.test(x.reply)).length;
  const quietConfHits = log.filter((x) => QUIET_CONF_RE.test(x.reply)).length;
  const insightHeavy = log.filter((x) =>
    x.reply.split(/\n/).some((l) => INSIGHT_RE.test(l))
  ).length;
  const oneTwoLine = log.filter((x) => x.lines <= 2).length;
  const longReplies = log.filter((x) => x.len > 420).length;
  const uniq = new Set(log.map((x) => x.reply.slice(0, 42))).size;
  const relational = log.filter((x) => x.category === "relational_flow").length;
  const avgLines =
    log.reduce((s, x) => s + x.lines, 0) / log.length;

  const report = {
    messages: log.length,
    textureKindsSeen: textures.size,
    texturesSeen: [...textures].sort(),
    expectedTextures: TEXTURES.length,
    uniquePrefixes: uniq,
    oneTwoLinePct: Math.round((oneTwoLine / log.length) * 100),
    avgLinesPerReply: Number(avgLines.toFixed(1)),
    longReplyPct: Math.round((longReplies / log.length) * 100),
    microHumanityHits: microHits,
    presenceBeatHits: presenceHits,
    quietConfidenceHits: quietConfHits,
    insightHeavyLines: insightHeavy,
    relationalFlow: relational
  };

  assert(textures.size >= 4, `texture variety low: ${textures.size}`);
  assert(uniq >= 22, `too repetitive: ${uniq}`);
  assert(longReplies <= 18, `too many long replies: ${longReplies}`);
  assert(oneTwoLine >= 28, `not enough short pacing: ${oneTwoLine}`);

  console.log("✓ alive-immersion passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
