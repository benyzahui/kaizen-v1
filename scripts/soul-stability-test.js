/**
 * Phases 251–252 — soul stability immersion stress test + honest soul report.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const SCENARIOS = [
  { tag: "stress", text: "Túl sok stressz, szétesik minden" },
  { tag: "fatigue", text: "Kimerült vagyok, nincs motiváció" },
  { tag: "overthinking", text: "Túlgondolom megint mindent, nem tudok leállni" },
  { tag: "ambition", text: "Ma nagy nap, sok mindent akarok megcsinálni" },
  { tag: "silence", text: "Na" },
  { tag: "humor", text: "lol 9000 tab megint" },
  { tag: "loneliness", text: "Magányos este, senki nincs" },
  { tag: "discipline", text: "Tudom mit kellene csinálnom, mégsem csinálom" },
  { tag: "recovery", text: "Kicsit jobb, megcsináltam valamit ma" }
];

const HUMAN_RE =
  /(levegő|kifáradt|tested|túlterhelés|múltkor|nyugodtabb|értem|hallom|sok lehetett|🌘|🫀|kemény)/i;
const PERFORM_RE =
  /(fontos megérteni|key insight|healing journey|chaos grows|identity is forged|reframe|következő lépés|protocol)/i;
const DEEP_RE = /\b(profound|transformative|lélektani|tanulság|bölcsesség)\b/i;
const AI_COACH_RE = /\b(a szál még nyitva van.*megoldani|érdemes egy mozdulatot nevezni)\b/i;
const MEMORY_RE = /(múltkor|pár nap|tegnap még|ilyenkor)/i;
const SPACIOUS_RE = /^(értem\.|hallom\.|az sok|🌘)/im;

async function run() {
  const uid = "soul_stability";
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

    if (PERFORM_RE.test(out.reply) || DEEP_RE.test(out.reply)) {
      throw new Error(`performance [${s.tag}]: ${out.reply.slice(0, 80)}`);
    }
    if (AI_COACH_RE.test(out.reply)) {
      throw new Error(`coach thread [${s.tag}]: ${out.reply.slice(0, 80)}`);
    }

    const lines = out.reply.split(/\n/).filter(Boolean);
    log.push({
      tag: s.tag,
      reply: out.reply,
      len: out.reply.length,
      lines: lines.length,
      human: HUMAN_RE.test(out.reply),
      memory: MEMORY_RE.test(out.reply),
      spacious: SPACIOUS_RE.test(out.reply),
      calm: lines.length <= 2 && out.reply.length < 115
    });
  }

  const n = log.length;
  const pct = (k) => Math.round((log.filter((x) => x[k]).length / n) * 100);
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / n);

  const report = {
    messages: n,
    avgLen,
    humanPct: pct("human"),
    memoryPct: pct("memory"),
    spaciousPct: pct("spacious"),
    calmPct: pct("calm"),
    scores: {
      emotionalRealism: Math.min(10, pct("human") / 10 + 5.8),
      warmth: Math.min(10, pct("human") / 12 + 6.5),
      immersion: Math.min(10, pct("calm") / 10 + 6.2),
      conversationalComfort: Math.min(10, pct("spacious") / 8 + pct("calm") / 15 + 6),
      attachment: Math.min(10, pct("memory") / 5 + 6.2),
      premiumAtmosphere: Math.min(10, pct("calm") / 10 + 6.8)
    },
    verdict: {
      groundedPresence:
        pct("calm") >= 70 && pct("human") >= 40
          ? "mostly stable in short stress pass — not sustained companion yet"
          : "uneven — some tags still feel templated",
      openJustToTalk:
        pct("calm") >= 75 && pct("human") >= 35
          ? "plausible for calm evening check-ins"
          : "not yet — still reads as utility under stress",
      strongestHuman: log.find((x) => x.human && x.len < 90)?.reply || log[0].reply,
      strongestAiFeel:
        log.find((x) => x.len > 100)?.reply ||
        log.find((x) => !x.human)?.reply ||
        "handler one-liners on short acks",
      biggestWeakness: "No real episodic memory; ritual voice vs open chat"
    }
  };

  if (avgLen > 135) throw new Error(`too long avg: ${avgLen}`);
  if (pct("calm") < 55) throw new Error(`not calm enough: ${pct("calm")}%`);

  console.log("✓ soul-stability-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
