/**
 * Phases 210–211 — multi-day real beta user simulation + verdict metrics.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const AI_RE =
  /\b(overload state|as an AI|chatbot|let me suggest|you should try|three steps|validating your feelings|framework|protocol)\b/i;
const HYPE_RE = /(warrior|alpha mode|dragon path|elite zone|crush it|10x)/i;
const COACH_RE =
  /\b(próbáld|try this|javaslom|one block today|következő lépés|minimum victory)\b/i;
const ROBOT_RE = /^(más irány:|one sec\.|altă direcție:)/im;
const SELF_HELP_RE = /(motivációs guru|healing journey|manifest your|internet motiv)/i;

const PERSONAS = [
  {
    id: "evening_vent",
    days: [
      ["Szia", "Rossz nap", "Túl sok", "Magányos", "ok", "Kösz"],
      ["Hm", "Megint stressz", "Nem bírom", "Na", "Holnap"],
      ["Reggel félek", "Este jobb", "Köszönöm", "ok"]
    ]
  },
  {
    id: "trader_chaos",
    days: [
      ["trade előtt ideges", "Túl sok inger", "Nem léptem be", "ok"],
      ["Pre-market pánik", "lol tab chaos", "Na", "Pihenek"],
      ["Jó nap volt", "Megcsináltam", "Kösz", "Hm"]
    ]
  },
  {
    id: "quiet_return",
    days: [
      ["Na", "ok", "Hm", "Szia"],
      ["…", "ok", "Kicsit jobb", "Na"],
      ["Magányos este", "Kösz", "ok", "Hm"]
    ]
  }
];

function scoreLog(log) {
  const n = log.length;
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / n);
  const oneTwo = log.filter((x) => x.lines <= 2).length;
  const calmExit = log.filter((x) => x.calmExit).length;
  const trustHits = log.filter((x) => x.ai || x.hype || x.selfHelp).length;
  const coachHits = log.filter((x) => x.coach).length;
  const robotHits = log.filter((x) => x.robot).length;
  const questions = log.filter((x) => /\?/.test(x.reply)).length;

  const openers = {};
  for (const x of log) {
    const k = (x.reply.split(/\n/)[0] || "").slice(0, 22).toLowerCase();
    openers[k] = (openers[k] || 0) + 1;
  }
  const topOpener = Object.entries(openers).sort((a, b) => b[1] - a[1])[0];

  return {
    messages: n,
    avgLen,
    oneTwoLinePct: Math.round((oneTwo / n) * 100),
    calmExitPct: Math.round((calmExit / n) * 100),
    trustLeakPct: Math.round((trustHits / n) * 100),
    coachPct: Math.round((coachHits / n) * 100),
    robotPct: Math.round((robotHits / n) * 100),
    questionPct: Math.round((questions / n) * 100),
    topOpener: topOpener ? { key: topOpener[0], count: topOpener[1] } : null
  };
}

async function simulatePersona(persona) {
  const uid = `final_${persona.id}`;
  clearSession(uid);
  clearPatternState(uid);

  const log = [];
  const msg = { from: { id: uid }, chat: { id: uid } };

  for (let d = 0; d < persona.days.length; d++) {
    updateSession(uid, {
      lastAt: Date.now() - (d === 0 ? 2 : 20) * 60 * 60 * 1000,
      onboardingCompleted: true,
      preferredLanguage: "hu",
      lang: "hu"
    });

    let session = getSession(uid);
    session.onboardingCompleted = true;

    if (d === 0) {
      const morning = await buildMorningReply(msg, session, "hu");
      log.push(analyze("morning", morning, "ritual"));
    }

    for (const text of persona.days[d]) {
      const out = await handleOpenConversation({ text, ...msg }, "hu", session);
      recordInteraction(uid, {
        text,
        reply: out.reply,
        lang: "hu",
        category: out.category
      });
      log.push(analyze(text, out.reply, out.category));
      session = getSession(uid);
      session.onboardingCompleted = true;
    }

    if (d === 1) {
      const midday = await buildMiddayReply(session, "hu");
      log.push(analyze("midday", midday, "ritual"));
    }
    if (d === 2) {
      const evening = await buildEveningReply(msg, session, "hu");
      log.push(analyze("evening", evening, "ritual"));
    }
  }

  return { persona: persona.id, stats: scoreLog(log), log };
}

function analyze(text, reply, category) {
  if (AI_RE.test(reply)) throw new Error(`AI leak on "${text}": ${reply.slice(0, 70)}`);
  if (HYPE_RE.test(reply)) throw new Error(`hype on "${text}"`);
  if (SELF_HELP_RE.test(reply)) throw new Error(`self-help on "${text}"`);

  const lines = reply.split(/\n/).filter(Boolean);
  const last = lines[lines.length - 1] || "";
  return {
    text,
    category,
    reply,
    len: reply.length,
    lines: lines.length,
    ai: AI_RE.test(reply),
    hype: HYPE_RE.test(reply),
    coach: COACH_RE.test(reply),
    robot: ROBOT_RE.test(reply),
    selfHelp: SELF_HELP_RE.test(reply),
    calmExit: /(elég|lassan|pihen|holnap is|tested|nyugod)/i.test(last)
  };
}

async function run() {
  const results = [];
  for (const p of PERSONAS) {
    results.push(await simulatePersona(p));
  }

  const all = results.flatMap((r) => r.log);
  const aggregate = scoreLog(all);

  if (aggregate.trustLeakPct > 0) throw new Error("trust leaks");
  if (aggregate.coachPct > 10) throw new Error(`coach too high: ${aggregate.coachPct}%`);
  if (aggregate.avgLen > 110) throw new Error(`too long: ${aggregate.avgLen}`);
  if (aggregate.oneTwoLinePct < 55) throw new Error(`pacing: ${aggregate.oneTwoLinePct}%`);

  const verdict = {
    aggregate,
    personas: results.map((r) => ({ id: r.persona, stats: r.stats })),
    recommendation: "LIMITED READY"
  };

  console.log("✓ final-beta-real-user-test passed");
  console.log(JSON.stringify(verdict, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
