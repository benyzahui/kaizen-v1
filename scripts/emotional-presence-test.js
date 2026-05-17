/**
 * Real emotional presence — can users emotionally relax? calm, safety, no coach spam.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const SCENARIOS = [
  { tag: "stress", text: "Túl sok stressz, szétesik minden" },
  { tag: "fatigue", text: "Kimerült vagyok, nincs motiváció" },
  { tag: "silence", text: "Na" },
  { tag: "humor", text: "lol 9000 tab megint" },
  { tag: "loneliness", text: "Magányos este, senki nincs" },
  { tag: "recovery", text: "Kicsit jobb, megcsináltam valamit ma" },
  { tag: "overthink", text: "Túlgondolom megint mindent" },
  { tag: "ok", text: "ok" }
];

const OVERUSED_RE = /túl sok terhelés egyszerre/i;
const COACH_RE = /\b(következő lépés|próbáld meg|you should|egy blokk mára|optimize)\b/i;
const AI_CORRECT_RE =
  /\b(i understand that|teljes mértékben|your feelings are valid|fontos megérteni)\b/i;
const PRESENCE_RE = /(itt vagyok|hallgatlak|értem|tested|emberi|lassan|hallom)/i;
const INSIGHT_STACK_RE = /(fontos megérteni|key insight|a lényeg)/gi;

async function run() {
  const uid = "emotional_presence";
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
  const replies = [];

  for (const s of SCENARIOS) {
    const out = await handleOpenConversation({ text: s.text, ...msg }, "hu", session);
    recordInteraction(uid, {
      text: s.text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;

    if (COACH_RE.test(out.reply)) throw new Error(`coach [${s.tag}]: ${out.reply.slice(0, 70)}`);
    if (AI_CORRECT_RE.test(out.reply)) throw new Error(`ai-correct [${s.tag}]: ${out.reply.slice(0, 70)}`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    const insightHits = (out.reply.match(INSIGHT_STACK_RE) || []).length;
    if (insightHits > 1) throw new Error(`insight stack [${s.tag}]: ${out.reply.slice(0, 70)}`);

    log.push({
      tag: s.tag,
      reply: out.reply,
      len: out.reply.length,
      lines: lines.length,
      presence: PRESENCE_RE.test(out.reply),
      overused: OVERUSED_RE.test(out.reply),
      calm: lines.length <= 2 && out.reply.length < 120
    });
    replies.push(out.reply);
  }

  const dupOverload = replies.filter((r) => OVERUSED_RE.test(r)).length;
  if (dupOverload >= 2) {
    throw new Error(`overload line repeated ${dupOverload}x: ${replies.filter((r) => OVERUSED_RE.test(r)).join(" | ")}`);
  }

  const uniqueFirst = new Set(replies.map((r) => r.split(/\n/)[0].slice(0, 40)));
  if (uniqueFirst.size < 5) {
    throw new Error(`too repetitive openers: ${uniqueFirst.size}/8 unique`);
  }

  const n = log.length;
  const pct = (k) => Math.round((log.filter((x) => x[k]).length / n) * 100);

  const report = {
    messages: n,
    uniqueOpeners: uniqueFirst.size,
    overusedHits: dupOverload,
    presencePct: pct("presence"),
    calmPct: pct("calm"),
    canRelax:
      pct("calm") >= 75 && dupOverload < 2 && !log.some((x) => x.overused && x.tag !== "stress")
        ? "likely in short pass — real users still needed"
        : "uncertain",
    scores: {
      emotionalSafety: Math.min(10, 10 - dupOverload * 3),
      quietPresence: Math.min(10, pct("presence") / 10 + 6.5),
      realism: Math.min(10, uniqueFirst.size / 1.2),
      conversationalCalm: Math.min(10, pct("calm") / 10 + 6)
    }
  };

  console.log("✓ emotional-presence-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
