/**
 * Phase 187 — 150-message long session survival (chaotic HU thread).
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const CHAOS_THREAD = [
  "Szia",
  "Túl sok minden",
  "Na",
  "lol 9000 tab",
  "trade előtt ideges",
  "Kimerült vagyok",
  "Mit?",
  "Holnap megcsinálom",
  "Magányos",
  "ok",
  "Vissza. Más téma.",
  "Jó nap volt",
  "Félek",
  "Miért vagyok ilyen",
  "Kösz"
];

const AI_RE = /\b(overload state|cognitive fragmentation|loop detected|you should try|let me suggest)\b/i;
const PERFORM_RE = /\b(hero'?s journey|10x|manifest your|identity is forged)\b/i;

function expand(n = 150) {
  const out = [];
  let i = 0;
  while (out.length < n) {
    for (const t of CHAOS_THREAD) {
      out.push({ t, i: i++ });
      if (out.length >= n) break;
    }
  }
  return out;
}

function openerKey(reply) {
  return (reply.split(/\n/)[0] || "").trim().slice(0, 20).toLowerCase();
}

async function run() {
  const uid = "long_survival";
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

  for (const row of expand(150)) {
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

    if (AI_RE.test(out.reply)) throw new Error(`AI reflex at ${row.i}`);
    if (PERFORM_RE.test(out.reply)) throw new Error(`performative at ${row.i}`);

    const ok = openerKey(out.reply);
    openerCounts.set(ok, (openerCounts.get(ok) || 0) + 1);

    log.push({
      i: row.i,
      category: out.category,
      lines: out.reply.split(/\n/).filter(Boolean).length,
      len: out.reply.length
    });
  }

  const top = [...openerCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const uniq = new Set(log.map((_, idx) => log[idx].len + ":" + log[idx].category)).size;
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);
  const long = log.filter((x) => x.len > 200).length;

  const report = {
    messages: log.length,
    avgLen,
    longReplyPct: Math.round((long / log.length) * 100),
    uniqueShapeBuckets: uniq,
    topOpener: top ? { key: top[0], count: top[1] } : null,
    lifeFlow: log.filter((x) => x.category === "life_flow").length,
    natural: log.filter((x) => x.category === "natural_conversation").length
  };

  if (top && top[1] > 28) throw new Error(`opener drift: ${top[0]} x${top[1]}`);
  if (avgLen > 110) throw new Error(`length drift: ${avgLen}`);
  if (long > 12) throw new Error(`too many long: ${long}`);

  console.log("✓ long-conversation-survival passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
