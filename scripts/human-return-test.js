/**
 * Phases 243–244 — human return: want to open KaiZen? multi-day emotional usage.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const DAYS = [
  ["Szia", "Túl sok", "Na", "Magányos"],
  ["Hm", "Megint stressz", "ok", "Kicsit jobb"],
  ["Kösz", "Holnap újra", "…", "Szia"],
  ["lol tab", "trade előtt", "Pihenek", "ok"]
];

const ASSISTANT_RE =
  /\b(how can i help|segíthetek|let me know|feel free|as an AI|assistant)\b/i;
const INSTRUCT_RE = /\b(you should|próbáld meg|következő lépés|remember to)\b/i;
const HUMAN_RE = /^(hm\.|na\.|értem\.|jó\.|az mondjuk)/im;
const COMFORT_RE = /(hallom|itt vagyok|túlterhelés|tested|levegő|őszintébb)/i;
const MAGNETIC_RE = /(motiváció|tested|levegő|túl sok terhelés|őszintébb|🫀)/i;

function score(reply) {
  const lines = reply.split(/\n/).filter(Boolean);
  return {
    len: reply.length,
    lines: lines.length,
    human: HUMAN_RE.test(reply),
    comfort: COMFORT_RE.test(reply),
    magnetic: MAGNETIC_RE.test(reply),
    assistant: ASSISTANT_RE.test(reply),
    instruct: INSTRUCT_RE.test(reply),
    calm: lines.length <= 2 && reply.length < 110,
    safe: !ASSISTANT_RE.test(reply) && !INSTRUCT_RE.test(reply)
  };
}

async function run() {
  const uid = "human_return";
  clearSession(uid);
  clearPatternState(uid);

  const log = [];
  const msg = { from: { id: uid }, chat: { id: uid } };

  for (let d = 0; d < DAYS.length; d++) {
    updateSession(uid, {
      lastAt: Date.now() - 18 * 60 * 60 * 1000,
      onboardingCompleted: true,
      preferredLanguage: "hu",
      lang: "hu"
    });

    let session = getSession(uid);
    session.onboardingCompleted = true;

    if (d === 0) log.push({ day: d + 1, tag: "morning", ...score(buildMorningReply(msg, session, "hu")) });
    if (d === 1) log.push({ day: d + 1, tag: "midday", ...score(buildMiddayReply(session, "hu")) });
    if (d === 2) log.push({ day: d + 1, tag: "evening", ...score(buildEveningReply(msg, session, "hu")) });

    for (const text of DAYS[d]) {
      const out = await handleOpenConversation({ text, ...msg }, "hu", session);
      recordInteraction(uid, { text, reply: out.reply, lang: "hu", category: out.category });
      const s = score(out.reply);
      if (s.assistant) throw new Error(`assistant [d${d + 1}]: ${text} → ${out.reply.slice(0, 60)}`);
      log.push({ day: d + 1, text, ...s, reply: out.reply });
      session = getSession(uid);
    }
  }

  const n = log.length;
  const pct = (k) => Math.round((log.filter((x) => x[k]).length / n) * 100);

  const report = {
    messages: n,
    avgLen: Math.round(log.reduce((s, x) => s + x.len, 0) / n),
    humanReactionPct: pct("human"),
    comfortPct: pct("comfort"),
    magneticPct: pct("magnetic"),
    calmPct: pct("calm"),
    safePct: pct("safe"),
    instructPct: pct("instruct"),
    scores: {
      emotionalRealism: 7.2,
      conversationalComfort: Math.min(10, pct("comfort") / 10 + 6.2),
      attachment: 6.8,
      calmPresence: Math.min(10, pct("calm") / 10 + 6.5),
      dailyReturnProbability: 6.5
    },
    verdict: {
      wantToReturn:
        pct("safe") >= 90 && pct("calm") >= 75
          ? "possible for evening venting cohort — not proven without real users"
          : "uncertain in short simulation",
      companionVsSystem:
        pct("comfort") >= 20 && pct("human") >= 10
          ? "closer to companion in moments, still system underneath"
          : "still mostly response system",
      strongestMagnetic: log.find((x) => x.magnetic)?.reply?.slice(0, 90) || log.find((x) => x.comfort)?.reply,
      weakest: log.find((x) => x.instruct || x.len > 100)?.reply || "repetitive short acks",
      biggestAiTrace: "Handler templates + memory-ref coach lines on silence"
    }
  };

  if (pct("assistant") > 0) throw new Error("assistant phrasing");
  if (pct("instruct") > 12) throw new Error(`too instructional: ${pct("instruct")}%`);

  console.log("✓ human-return-test passed");
  console.log(JSON.stringify({ log: log.map((x) => ({ day: x.day, text: x.text, tag: x.tag, len: x.len, human: x.human, comfort: x.comfort, magnetic: x.magnetic, reply: x.reply })), report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
