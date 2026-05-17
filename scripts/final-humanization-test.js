/**
 * Final humanization — forget-it's-software? no assistant, empathy theater, robot structure.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const THREAD = [
  "Szia",
  "Túl sok minden",
  "Na",
  "Magányos vagyok",
  "lol tab",
  "Kösz",
  "…",
  "Holnap újra"
];

const ASSISTANT_RE =
  /\b(how can i help|segíthetek|feel free|as an AI|fontos megérteni|let me explain|your feelings are valid|teljes mértékben)\b/i;
const FAKE_DEPTH_RE = /\b(chaos grows|identity is forged|key insight|a lényeg az|deep down|healing journey)\b/i;
const ROBOT_RE = /^(egyébként|más irány|different thread)/im;
const OVER_EMPATHY_RE = /\b(érződik hogy.*érződik|that sounds like.*that sounds)/i;
const HUMAN_RE = /^(hm\.|na\.|értem\.|hallom\.|itt vagyok)/i;

async function run() {
  const uid = "final_human";
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
  const openers = [];

  for (const text of THREAD) {
    const out = await handleOpenConversation({ text, ...msg }, "hu", session);
    recordInteraction(uid, {
      text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;

    if (ASSISTANT_RE.test(out.reply)) throw new Error(`assistant [${text}]: ${out.reply.slice(0, 70)}`);
    if (FAKE_DEPTH_RE.test(out.reply)) throw new Error(`fake depth [${text}]: ${out.reply.slice(0, 70)}`);
    if (ROBOT_RE.test(out.reply)) throw new Error(`robot transition [${text}]: ${out.reply.slice(0, 70)}`);
    if (OVER_EMPATHY_RE.test(out.reply)) throw new Error(`empathy stack [${text}]: ${out.reply.slice(0, 70)}`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    if (lines.length > 3) throw new Error(`too structured [${text}]: ${lines.length} lines`);

    const opener = lines[0]?.slice(0, 36) || out.reply.slice(0, 36);
    openers.push(opener);

    log.push({
      text,
      reply: out.reply,
      len: out.reply.length,
      lines: lines.length,
      humanOpener: HUMAN_RE.test(lines[0] || ""),
      calm: lines.length <= 2 && out.reply.length < 115
    });
  }

  const uniqueOpeners = new Set(openers).size;
  const dupOverload = log.filter((x) => /túl sok terhelés egyszerre/i.test(x.reply)).length;

  if (uniqueOpeners < 5) {
    throw new Error(`repetitive openers: ${uniqueOpeners}/${THREAD.length}`);
  }
  if (dupOverload >= 3) {
    throw new Error(`overload line x${dupOverload}`);
  }

  const n = log.length;
  const pct = (k) => Math.round((log.filter((x) => x[k]).length / n) * 100);

  const report = {
    messages: n,
    uniqueOpeners,
    overloadRepeats: dupOverload,
    calmPct: pct("calm"),
    forgetSoftware:
      pct("calm") >= 75 && uniqueOpeners >= 6 && dupOverload < 2
        ? "closer in short thread — still know it is rules under the hood"
        : "not yet — repetition or structure still signals bot",
    scores: {
      humanFeel: Math.min(10, uniqueOpeners / 1.1),
      emotionalBelievability: Math.min(10, pct("calm") / 10 + 6.5),
      aiTraceRemaining: Math.max(1, 10 - uniqueOpeners / 1.5)
    },
    verdict:
      "LIMITED READY — assistant tone mostly gone; true forget-software needs LLM + memory, not more strips"
  };

  console.log("✓ final-humanization-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
