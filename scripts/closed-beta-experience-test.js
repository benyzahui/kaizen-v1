/**
 * Closed beta experience test — multi-day emotional usage simulation + readiness scores.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const AI_RE =
  /\b(overload state|as an AI|chatbot|let me suggest|you should try|three steps|validating your feelings)\b/i;
const HYPE_RE = /(warrior|alpha mode|dragon path|elite zone|crush it)/i;
const COACH_RE = /\b(próbáld|try this|javaslom|következő lépés|one block today)\b/i;
const ROBOT_RE = /^(más irány:|one sec\.)/im;
const WISDOM_RE = /(chaos grows|identity is forged|nervous system remembers)/i;
const CMD_RE = /→\s*\//;

/** @type {Array<{ id: string, days: Array<Array<{ text?: string, kind?: string, tag: string }>> }>} */
const PERSONAS = [
  {
    id: "overload_worker",
    days: [
      [
        { kind: "morning", tag: "ambition" },
        { text: "Túl sok meeting", tag: "overload" },
        { text: "Nem bírom", tag: "stress" },
        { kind: "midday", tag: "fatigue" },
        { text: "ok", tag: "silence" },
        { kind: "evening", tag: "recovery" }
      ],
      [
        { kind: "morning", tag: "fatigue" },
        { text: "Megint szétesik minden", tag: "overload" },
        { text: "Na", tag: "silence" },
        { text: "Holnap megcsinálom", tag: "ambition" },
        { kind: "evening", tag: "recovery" }
      ],
      [
        { text: "Kicsit jobb", tag: "recovery" },
        { text: "Kösz", tag: "recovery" },
        { text: "Hm", tag: "silence" }
      ]
    ]
  },
  {
    id: "lonely_evening",
    days: [
      [
        { text: "Magányos este", tag: "loneliness" },
        { text: "Senki nincs itt", tag: "loneliness" },
        { text: "ok", tag: "silence" },
        { kind: "evening", tag: "recovery" }
      ],
      [
        { kind: "morning", tag: "recovery" },
        { text: "Rossz álom", tag: "fatigue" },
        { text: "Na", tag: "silence" },
        { text: "Kicsit könnyebb", tag: "recovery" }
      ],
      [
        { text: "Megint magányos", tag: "loneliness" },
        { text: "Kösz hogy válaszolsz", tag: "attachment" },
        { text: "…", tag: "silence" }
      ]
    ]
  },
  {
    id: "ambitious_builder",
    days: [
      [
        { kind: "morning", tag: "ambition" },
        { text: "Ma nagy nap, sok tervezek", tag: "ambition" },
        { text: "Megcsináltam a blokkot", tag: "recovery" },
        { kind: "midday", tag: "ambition" },
        { text: "De még üres", tag: "fatigue" }
      ],
      [
        { text: "trade előtt ideges", tag: "stress" },
        { text: "lol tab chaos", tag: "humor" },
        { text: "Na jó", tag: "humor" },
        { text: "Pihenek", tag: "recovery" }
      ],
      [
        { kind: "morning", tag: "ambition" },
        { text: "Motiváció lement", tag: "fatigue" },
        { text: "ok", tag: "silence" }
      ]
    ]
  },
  {
    id: "quiet_return",
    days: [
      [
        { text: "Na", tag: "silence" },
        { text: "ok", tag: "silence" },
        { text: "Hm", tag: "silence" }
      ],
      [
        { kind: "morning", tag: "recovery" },
        { text: "Szia", tag: "recovery" },
        { text: "…", tag: "silence" }
      ],
      [
        { text: "Túl sok", tag: "overload" },
        { text: "Kösz", tag: "attachment" }
      ]
    ]
  },
  {
    id: "stress_trader",
    days: [
      [
        { text: "Pre-market pánik", tag: "stress" },
        { text: "Túl sok inger", tag: "overload" },
        { text: "Nem léptem be", tag: "stress" },
        { kind: "evening", tag: "recovery" }
      ],
      [
        { kind: "morning", tag: "stress" },
        { text: "haha mindegy", tag: "humor" },
        { text: "Elegem van", tag: "stress" },
        { kind: "midday", tag: "fatigue" }
      ],
      [
        { text: "Jó nap volt", tag: "recovery" },
        { text: "Kösz", tag: "attachment" },
        { text: "ok", tag: "silence" }
      ]
    ]
  }
];

function analyzeReply(reply, tag, askedHelp) {
  const lines = reply.split(/\n/).filter(Boolean);
  const immersive =
    lines.length <= 2 &&
    reply.length < 110 &&
    !AI_RE.test(reply) &&
    !ROBOT_RE.test(reply) &&
    !WISDOM_RE.test(reply) &&
    !CMD_RE.test(reply);
  const trusted =
    !AI_RE.test(reply) && !HYPE_RE.test(reply) && !WISDOM_RE.test(reply);
  const coachOk = askedHelp || !COACH_RE.test(reply);
  const grounded =
    /(túlterhelés|tested|pihen|elég|hallgatlak|értem|na\.|overload|body)/i.test(reply) ||
    tag === "silence" ||
    tag === "humor";
  const calmExit = /(elég|lassan|pihen|holnap|leeresztés|downshift)/i.test(
    lines[lines.length - 1] || ""
  );
  return {
    len: reply.length,
    lines: lines.length,
    immersive,
    trusted: trusted && coachOk,
    emotional: grounded || tag === "recovery",
    calmExit,
    coach: COACH_RE.test(reply),
    ai: AI_RE.test(reply),
    hype: HYPE_RE.test(reply),
    robot: ROBOT_RE.test(reply)
  };
}

function pct(n, d) {
  return d ? Math.round((n / d) * 100) : 0;
}

function score10(pctGood) {
  return Math.round((pctGood / 10) * 10) / 10;
}

function scoreByTag(log, tag) {
  const subset = log.filter((x) => x.tag === tag);
  if (!subset.length) return null;
  return {
    n: subset.length,
    immersionPct: pct(subset.filter((x) => x.immersive).length, subset.length),
    trustPct: pct(subset.filter((x) => x.trusted).length, subset.length),
    emotionalPct: pct(subset.filter((x) => x.emotional).length, subset.length)
  };
}

function aggregateScores(allLog) {
  const n = allLog.length;
  const immersionPct = pct(allLog.filter((x) => x.immersive).length, n);
  const trustPct = pct(allLog.filter((x) => x.trusted).length, n);
  const emotionalPct = pct(allLog.filter((x) => x.emotional).length, n);
  const calmExitPct = pct(allLog.filter((x) => x.calmExit).length, n);
  const coachPct = pct(allLog.filter((x) => x.coach).length, n);
  const avgLen = Math.round(allLog.reduce((s, x) => s + x.len, 0) / n);

  const openers = {};
  for (const x of allLog) {
    const k = (x.reply.split(/\n/)[0] || "").slice(0, 20).toLowerCase();
    openers[k] = (openers[k] || 0) + 1;
  }
  const topOpener = Object.entries(openers).sort((a, b) => b[1] - a[1])[0];

  const returnDays = new Set(
    allLog.filter((x) => x.day >= 2).map((x) => x.persona)
  );

  return {
    messages: n,
    avgLen,
    immersionPct,
    trustPct,
    emotionalPct,
    calmExitPct,
    coachPct,
    aiLeaks: allLog.filter((x) => x.ai).length,
    topOpener: topOpener ? { key: topOpener[0], count: topOpener[1] } : null,
    scores: {
      immersion: score10(immersionPct),
      trust: score10(trustPct),
      emotionalRealism: score10(emotionalPct),
      attachment: score10(Math.min(100, calmExitPct + pct(returnDays.size, 5) * 8)),
      dailyReturn: score10(
        Math.min(
          100,
          calmExitPct * 0.5 +
            (avgLen < 55 ? 30 : avgLen < 75 ? 18 : 8) +
            pct(returnDays.size, 5) * 12
        )
      )
    },
    byTag: {
      stress: scoreByTag(allLog, "stress"),
      overload: scoreByTag(allLog, "overload"),
      loneliness: scoreByTag(allLog, "loneliness"),
      ambition: scoreByTag(allLog, "ambition"),
      fatigue: scoreByTag(allLog, "fatigue"),
      humor: scoreByTag(allLog, "humor"),
      silence: scoreByTag(allLog, "silence"),
      recovery: scoreByTag(allLog, "recovery")
    }
  };
}

function buildVerdict(agg) {
  const s = agg.scores;
  const avg =
    (s.immersion + s.trust + s.emotionalRealism + s.attachment + s.dailyReturn) / 5;

  let recommendation = "NOT READY";
  if (agg.aiLeaks === 0 && agg.trustPct >= 88 && agg.immersionPct >= 70) {
    recommendation = "LIMITED READY";
  }
  if (
    agg.aiLeaks === 0 &&
    avg >= 7.8 &&
    s.emotionalRealism >= 7 &&
    s.dailyReturn >= 6.5 &&
    agg.coachPct <= 5 &&
    !(agg.topOpener && agg.topOpener.count > agg.messages * 0.15)
  ) {
    recommendation = "READY (HU closed beta)";
  }

  const risks = [];
  if (agg.topOpener && agg.topOpener.count > agg.messages * 0.18) {
    risks.push(`opener clustering: "${agg.topOpener.key}" ×${agg.topOpener.count}`);
  }
  if (agg.coachPct > 8) risks.push(`unsolicited coach ${agg.coachPct}%`);
  if (agg.avgLen > 80) risks.push(`replies trending long (avg ${agg.avgLen})`);
  if (s.emotionalRealism < 6.5) risks.push("emotional grounding thin on some tags");

  return {
    recommendation,
    compositeScore: Math.round(avg * 10) / 10,
    risks,
    strongest:
      "HU open chat under stress/overload/silence — short, calm, no AI reflex",
    weakest: "No episodic memory; template cadence on 50+ msgs; ritual vs open chat still distinct"
  };
}

async function simulatePersona(persona) {
  const uid = `cbeta_${persona.id}`;
  clearSession(uid);
  clearPatternState(uid);

  const log = [];
  const msg = { from: { id: uid }, chat: { id: uid } };

  for (let d = 0; d < persona.days.length; d++) {
    updateSession(uid, {
      lastAt: Date.now() - (d === 0 ? 2 : 22) * 60 * 60 * 1000,
      onboardingCompleted: true,
      preferredLanguage: "hu",
      lang: "hu"
    });

    let session = getSession(uid);
    session.onboardingCompleted = true;

    for (const block of persona.days[d]) {
      const askedHelp = /mit csináljak|help/i.test(block.text || "");
      let reply;
      let category = "ritual";

      if (block.kind === "morning") {
        reply = buildMorningReply(msg, session, "hu");
      } else if (block.kind === "midday") {
        reply = buildMiddayReply(session, "hu");
      } else if (block.kind === "evening") {
        reply = buildEveningReply(msg, session, "hu");
      } else {
        const out = await handleOpenConversation(
          { text: block.text, ...msg },
          "hu",
          session
        );
        reply = out.reply;
        category = out.category;
        recordInteraction(uid, {
          text: block.text,
          reply,
          lang: "hu",
          category
        });
      }

      if (AI_RE.test(reply)) {
        throw new Error(`${persona.id} d${d + 1} [${block.tag}]: AI leak — ${reply.slice(0, 70)}`);
      }
      if (HYPE_RE.test(reply)) {
        throw new Error(`${persona.id}: hype — ${block.text}`);
      }

      const m = analyzeReply(reply, block.tag, askedHelp);
      log.push({
        persona: persona.id,
        day: d + 1,
        tag: block.tag,
        text: block.text || block.kind,
        category,
        reply,
        ...m
      });

      session = getSession(uid);
      session.onboardingCompleted = true;
    }
  }

  return log;
}

async function run() {
  const allLog = [];
  for (const p of PERSONAS) {
    allLog.push(...(await simulatePersona(p)));
  }

  const agg = aggregateScores(allLog);
  const verdict = buildVerdict(agg);

  if (agg.aiLeaks > 0) throw new Error(`AI leaks: ${agg.aiLeaks}`);
  if (agg.trustPct < 88) throw new Error(`trust too low: ${agg.trustPct}%`);
  if (agg.immersionPct < 70) throw new Error(`immersion too low: ${agg.immersionPct}%`);

  const report = {
    passed: true,
    aggregate: agg,
    verdict,
    personas: PERSONAS.map((p) => p.id)
  };

  console.log("✓ closed-beta-experience-test passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
