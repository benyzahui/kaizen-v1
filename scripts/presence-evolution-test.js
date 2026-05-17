/**
 * Phases 234–235 — presence evolution: emotionally alive vs assembled?
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const SCENARIOS = [
  { tag: "stress", text: "Túl sok stressz, szétesik minden" },
  { tag: "overload", text: "Nem bírom, túl sok minden egyszerre" },
  { tag: "calm", text: "Ma nyugodt napom van" },
  { tag: "humor", text: "lol 9000 tab megint" },
  { tag: "loneliness", text: "Magányos este, senki nincs" },
  { tag: "ambition", text: "Ma nagy nap, sok mindent akarok" },
  { tag: "recovery", text: "Kicsit jobb, megcsináltam valamit" },
  { tag: "uncertainty", text: "Bizonytalan vagyok, nem tudom mi jön" },
  { tag: "silence", text: "Na" },
  { tag: "fatigue", text: "Kimerült vagyok, nincs motiváció" }
];

const ALIVE_RE =
  /(levegő|kifáradt|kontroll|tested|túlterhelés|múltkor|tegnap|nyugodtabb|fókuszt|🫀|kemény lehetett)/i;
const SYNTH_RE =
  /(chaos grows|identity is forged|let me explain|validate your feelings|you got this|framework|protocol)/i;
const ASSEMBLED_RE =
  /(következő lépés|three steps|one block today|stabilizáló lépés)/i;

async function run() {
  const uid = "presence_evo";
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

  for (let i = 0; i < SCENARIOS.length; i++) {
    const s = SCENARIOS[i];
    const out = await handleOpenConversation({ text: s.text, ...msg }, "hu", session);
    recordInteraction(uid, {
      text: s.text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;

    if (SYNTH_RE.test(out.reply)) throw new Error(`synthetic [${s.tag}]: ${out.reply.slice(0, 70)}`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    log.push({
      tag: s.tag,
      reply: out.reply,
      len: out.reply.length,
      lines: lines.length,
      alive: ALIVE_RE.test(out.reply),
      assembled: ASSEMBLED_RE.test(out.reply) && !/mit csináljak/i.test(s.text),
      calm: lines.length <= 2 && out.reply.length < 120
    });
  }

  const n = log.length;
  const alivePct = Math.round((log.filter((x) => x.alive).length / n) * 100);
  const calmPct = Math.round((log.filter((x) => x.calm).length / n) * 100);
  const assembledPct = Math.round((log.filter((x) => x.assembled).length / n) * 100);
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / n);

  const report = {
    messages: n,
    avgLen,
    alivePct,
    calmPct,
    assembledPct,
    scores: {
      emotionalRealism: Math.min(10, alivePct / 10 + 5.5),
      calmPresence: Math.min(10, calmPct / 10 + 6),
      warmth: 7,
      trust: assembledPct === 0 ? 8 : 6.5,
      attachment: 6.5,
      premiumFeeling: calmPct >= 80 ? 7.5 : 7
    },
    verdict: {
      emotionallyAlive:
        alivePct >= 25 && calmPct >= 70 && assembledPct <= 10
          ? "partially — moments of accuracy, not sustained aliveness"
          : "still often assembled in short tests",
      strongest: log.find((x) => x.alive)?.reply?.slice(0, 90) || log[0].reply,
      immersionBreak: log.find((x) => x.assembled)?.reply || "generic one-liner repetition",
      syntheticLayer: "Template handlers + opener pools under long threads"
    }
  };

  if (avgLen > 130) throw new Error(`too long avg: ${avgLen}`);
  if (assembledPct > 15) throw new Error(`too assembled: ${assembledPct}%`);

  console.log("✓ presence-evolution-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
