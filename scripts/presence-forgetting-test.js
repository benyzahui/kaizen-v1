/**
 * Phases 197–198 — long chat: does presence hold? (HU open chat)
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const THREAD = [
  "Szia",
  "Rossz nap",
  "Na",
  "Túl sok",
  "ok",
  "Magányos",
  "lol",
  "Kicsit jobb",
  "Félek",
  "Mit?",
  "Kösz",
  "Holnap",
  "Hm"
];

const COACH_RE = /\b(próbáld|javaslom|egy blokk mára|you should|következő lépés)\b/i;
const AI_RE = /\b(as an AI|chatbot|let me suggest|overload state)\b/i;

function expand(n = 132) {
  const out = [];
  let i = 0;
  while (out.length < n) {
    for (const t of THREAD) {
      out.push({ t, i: i++ });
      if (out.length >= n) break;
    }
  }
  return out;
}

async function run() {
  const uid = "presence_forget";
  clearSession(uid);
  clearPatternState(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  for (const row of expand(132)) {
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

    if (AI_RE.test(out.reply)) throw new Error(`AI visible at ${row.i}`);
    if (COACH_RE.test(out.reply)) throw new Error(`coach push at ${row.i}: ${row.t}`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    log.push({
      i: row.i,
      lines: lines.length,
      len: out.reply.length,
      hasQuestion: /\?/.test(out.reply),
      coach: COACH_RE.test(out.reply)
    });
  }

  const presenceOnly = log.filter((x) => x.lines <= 2 && !x.coach && x.len < 90).length;
  const questions = log.filter((x) => x.hasQuestion).length;
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);

  const report = {
    messages: log.length,
    avgLen,
    presenceOnlyPct: Math.round((presenceOnly / log.length) * 100),
    questionPct: Math.round((questions / log.length) * 100),
    coachPushPct: Math.round((log.filter((x) => x.coach).length / log.length) * 100)
  };

  if (avgLen > 95) throw new Error(`too long: ${avgLen}`);
  if (report.coachPushPct > 8) throw new Error(`coach push: ${report.coachPushPct}%`);
  if (report.questionPct > 35) throw new Error(`too many questions: ${report.questionPct}%`);

  console.log("✓ presence-forgetting-test passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
