/**
 * Natural conversation masterpass — fluid, unforced, no command spam.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const THREAD = [
  "Szia",
  "Túl sok meeting",
  "lol 9000 tab",
  "Na",
  "Magányos este",
  "ok",
  "trade előtt ideges",
  "Hm",
  "Kicsit jobb",
  "Vissza. Más téma.",
  "Kösz",
  "…"
];

const CMD_RE = /→\s*\//;
const ROBOT_RE = /^(más irány:|one sec\.)/im;
const WISDOM_RE = /(chaos grows|identity is forged|nervous system remembers)/i;

async function run() {
  const uid = "nat_master";
  clearSession(uid);
  clearPatternState(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
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

    if (CMD_RE.test(out.reply)) throw new Error(`cmd interrupt: ${text}`);
    if (ROBOT_RE.test(out.reply)) throw new Error(`robot transition: ${text}`);
    if (WISDOM_RE.test(out.reply)) throw new Error(`wisdom: ${text}`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    log.push({
      text,
      category: out.category,
      len: out.reply.length,
      lines: lines.length,
      natural: lines.length <= 2 && out.reply.length < 100
    });
  }

  const naturalPct = Math.round((log.filter((x) => x.natural).length / log.length) * 100);
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);
  const categories = [...new Set(log.map((x) => x.category))];

  if (naturalPct < 80) throw new Error(`not natural enough: ${naturalPct}%`);
  if (avgLen > 90) throw new Error(`too long: ${avgLen}`);

  console.log("✓ natural-conversation-masterpass passed");
  console.log(
    JSON.stringify({ messages: log.length, avgLen, naturalPct, categories }, null, 2)
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
