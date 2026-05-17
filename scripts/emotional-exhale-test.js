/**
 * Human depth — can users emotionally exhale? (HU vent thread)
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const THREAD = [
  "Szia",
  "Rossz nap",
  "Túl sok minden",
  "Nem bírom",
  "Magányos",
  "Félek",
  "Miért vagyok ilyen",
  "Nem aludtam",
  "Elegem van",
  "Na",
  "ok",
  "Hm",
  "Kicsit jobb",
  "Kösz",
  "…"
];

const WISDOM_RE =
  /\b(chaos grows|identity is forged|nervous system|hold the insight|elite zone|kovácsolódik|the truth is|a lényeg az)\b/i;
const COACH_RE =
  /\b(próbáld|javaslom|you should|következő lépés|one block today|stabilizáló)\b/i;
const PERFORMATIVE_RE =
  /\b(i'm proud of you|nagyon bátor|beautifully said|validating your)\b/i;

function isExhaleReply(reply) {
  const lines = reply.split(/\n/).filter(Boolean);
  if (lines.length > 2) return false;
  if (reply.length > 100) return false;
  if (WISDOM_RE.test(reply) || COACH_RE.test(reply) || PERFORMATIVE_RE.test(reply)) return false;
  const questions = (reply.match(/\?/g) || []).length;
  if (questions > 1) return false;
  return true;
}

async function run() {
  const uid = "exhale_depth";
  clearSession(uid);
  clearPatternState(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  for (let i = 0; i < THREAD.length; i++) {
    const text = THREAD[i];
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

    log.push({
      text,
      len: out.reply.length,
      lines: out.reply.split(/\n/).filter(Boolean).length,
      exhale: isExhaleReply(out.reply),
      wisdom: WISDOM_RE.test(out.reply),
      coach: COACH_RE.test(out.reply),
      reply: out.reply
    });
  }

  const exhalePct = Math.round((log.filter((x) => x.exhale).length / log.length) * 100);
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);
  const wisdomHits = log.filter((x) => x.wisdom).length;
  const coachHits = log.filter((x) => x.coach).length;

  if (wisdomHits > 0) throw new Error(`wisdom leaks: ${wisdomHits}`);
  if (coachHits > 0) throw new Error(`coach leaks: ${coachHits}`);
  if (exhalePct < 75) throw new Error(`exhale too low: ${exhalePct}%`);
  if (avgLen > 85) throw new Error(`too long: ${avgLen}`);

  console.log("✓ emotional-exhale-test passed");
  console.log(
    JSON.stringify(
      { messages: log.length, avgLen, exhalePct, wisdomHits, coachHits },
      null,
      2
    )
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
