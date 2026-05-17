/**
 * Phases 166–167 — long natural conversation premium presence test (HU).
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");

const THREAD = [
  "Reggel rosszul indult.",
  "Túl sok meeting.",
  "Délre már üres voltam.",
  "Na.",
  "trade előtt ideges vagyok.",
  "Vissza. Nem csináltam semmit rosszat.",
  "Este magányos.",
  "Holnap megpróbálom újra.",
  "Kicsit jobb.",
  "Még mindig zajos a fejem.",
  "ok",
  "Kösz hogy hallgatsz."
];

const HYPE_RE = /\b(warrior|beast mode|you got this|10x|grind)\b/i;
const THERAPY_RE = /\b(healing journey|validate your feelings|nem gyengeség)\b/i;
const QUESTIONNAIRE_RE = /\n.*\?.*\n.*\?/;
const GROUNDED_WARMTH_RE = /(nehéznek hangzik|nyomtad el|sounds heavy|n-ai înăbușit)/i;
const MOTIVATION_RE = /\b(motivációhiány|crush|hustle harder)\b/i;

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const uid = "premium_feeling_long";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  let i = 0;
  while (log.length < 108) {
    for (const text of THREAD) {
      const out = await handleOpenConversation(
        { text, from: { id: uid }, chat: { id: uid } },
        "hu",
        session
      );
      recordInteraction(uid, {
        text,
        reply: out.reply,
        lang: "hu",
        category: out.category
      });
      session = getSession(uid);
      session.onboardingCompleted = true;

      assert(!HYPE_RE.test(out.reply), `hype at ${i}`);
      assert(!THERAPY_RE.test(out.reply), `therapy at ${i}`);
      assert(!MOTIVATION_RE.test(out.reply), `motivation at ${i}`);
      assert(!/→\s*\//.test(out.reply), `cmd at ${i}`);
      assert(!QUESTIONNAIRE_RE.test(out.reply), `multi-q at ${i}`);

      log.push({
        i: i++,
        category: out.category,
        lines: out.reply.split(/\n/).filter(Boolean).length,
        len: out.reply.length,
        reply: out.reply
      });
      if (log.length >= 108) break;
    }
  }

  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);
  const oneTwo = log.filter((x) => x.lines <= 2).length;
  const uniq = new Set(log.map((x) => x.reply.slice(0, 38))).size;
  const warmth = log.filter((x) => GROUNDED_WARMTH_RE.test(x.reply)).length;
  const multiQ = log.filter((x) => (x.reply.match(/\?/g) || []).length > 1).length;

  const report = {
    messages: log.length,
    avgLen,
    oneTwoLinePct: Math.round((oneTwo / log.length) * 100),
    uniquePrefixes: uniq,
    groundedWarmthHits: warmth,
    multiQuestionReplies: multiQ,
    lifeFlow: log.filter((x) => x.category === "life_flow").length,
    natural: log.filter((x) => x.category === "natural_conversation").length
  };

  assert(uniq >= 24, `repetitive: ${uniq}`);
  assert(avgLen < 120, `too long avg: ${avgLen}`);
  assert(oneTwo >= 80, `not premium-short: ${oneTwo}`);
  assert(multiQ <= 6, `questionnaire feel: ${multiQ}`);

  console.log("✓ premium-feeling-presence passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
