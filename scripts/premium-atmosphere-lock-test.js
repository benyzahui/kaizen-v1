/**
 * Premium atmosphere lock — calm confidence, no hype/self-help/format noise.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const SCENARIOS = [
  "Túl sok minden egyszerre",
  "Kimerült vagyok",
  "Ma nagy nap, mindent akarok",
  "Na",
  "Mit csináljak most?",
  "ok"
];

const HYPE_RE =
  /\b(crush it|you got this|10x|unlock|manifest|hustle|no excuses|beast mode|hero'?s journey|self-help)\b/i;
const FORMAT_RE = /(\*\*|__|^\d+[\.\)]\s|^[•\-*]\s|→\s*\/)/m;
const POLISH_RE = /\b(remarkable|fascinating|fontos megérteni|life-changing)\b/i;
const PREMIUM_RE = /(tisztaság|egy irány|lassan|clean block|clarity|fókusz|elég)/i;

async function run() {
  const uid = "premium_lock";
  clearSession(uid);
  clearPatternState(uid);

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  });

  let session = getSession(uid);
  const msg = { from: { id: uid }, chat: { id: uid } };
  const log = [];

  for (const text of SCENARIOS) {
    const out = await handleOpenConversation({ text, ...msg }, "hu", session);
    recordInteraction(uid, {
      text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;

    if (HYPE_RE.test(out.reply)) throw new Error(`hype [${text}]: ${out.reply}`);
    if (FORMAT_RE.test(out.reply)) throw new Error(`format noise [${text}]: ${out.reply}`);
    if (POLISH_RE.test(out.reply)) throw new Error(`over-polish [${text}]: ${out.reply}`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    if (lines.length > 3) throw new Error(`too many lines [${text}]: ${lines.length}`);

    log.push({
      text,
      reply: out.reply,
      len: out.reply.length,
      lines: lines.length,
      premium: PREMIUM_RE.test(out.reply),
      calm: lines.length <= 2 && out.reply.length < 120
    });
  }

  const n = log.length;
  const pct = (k) => Math.round((log.filter((x) => x[k]).length / n) * 100);
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / n);

  if (avgLen > 130) throw new Error(`too long avg: ${avgLen}`);
  if (pct("calm") < 80) throw new Error(`not calm: ${pct("calm")}%`);

  console.log("✓ premium-atmosphere-lock-test passed");
  console.log(
    JSON.stringify(
      {
        log,
        report: {
          avgLen,
          calmPct: pct("calm"),
          premiumTonePct: pct("premium"),
          verdict: "restrained and readable in short pass — calm confidence target"
        }
      },
      null,
      2
    )
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
