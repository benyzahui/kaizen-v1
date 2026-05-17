/**
 * Phases 199–204 — stress immersion + full closed-beta day simulation.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");
const { detectStressProfile } = require("../src/companion/betaImmersionHarden");

const STRESS_UID = "beta_stress_immersion";
const DAY_UID = "beta_closed_beta_harden";

const AI_RE =
  /\b(overload state detected|as an AI|chatbot|let me suggest|you should try|three steps|következő lépések|validating your feelings)\b/i;
const EGO_RE =
  /\b(fontos megérteni|the key insight|framework|protocol|hero'?s journey)\b/i;
const HYPE_RE = /(warrior|alpha mode|dragon path|elite zone)/i;

const STRESS_THREAD = [
  { tag: "overload", text: "Túl sok minden szétesik." },
  { tag: "overload", text: "Nem bírom tovább." },
  { tag: "stress_repeat", text: "Megint ugyanaz a stressz." },
  { tag: "sleep", text: "Nem aludtam semmit, kimerült vagyok." },
  { tag: "frustration", text: "Elegem van mindenből." },
  { tag: "anger", text: "Dühös vagyok, ideges." },
  { tag: "loneliness", text: "Magányos este, senki nincs." },
  { tag: "overthink", text: "Túlgondolom miért vagyok ilyen." },
  { tag: "silence", text: "Na." },
  { tag: "silence", text: "ok" },
  { tag: "humor", text: "lol 9000 tab megint" },
  { tag: "humor", text: "haha mindegy" },
  { tag: "silence", text: "Hm." },
  { tag: "recovery", text: "Kicsit jobb most." },
  { tag: "silence", text: "…" }
];

const FULL_DAY = [
  { phase: "morning", kind: "morning" },
  { phase: "morning", text: "Reggel ideges, alig aludtam." },
  { phase: "chaos", text: "Túl sok meeting, szétesik a nap." },
  { phase: "work", text: "trade előtt vagyok, remeg a kezem." },
  { phase: "training", text: "Edzés után üres, de legalább mozogtam." },
  { phase: "trading", text: "Nem léptem be, túl sok inger." },
  { phase: "midday", kind: "midday" },
  { phase: "afternoon", text: "Elegem van, dühös vagyok." },
  { phase: "loneliness", text: "Magányos vagyok este." },
  { phase: "evening", kind: "evening" },
  { phase: "recovery", text: "Kösz, ma segített egy kicsit." },
  { phase: "night", text: "ok" }
];

function openerKey(reply) {
  const line = String(reply || "")
    .split(/\n/)[0]
    ?.trim()
    .toLowerCase();
  return line?.slice(0, 24) || "";
}

function metrics(log) {
  const lengths = log.map((x) => x.len);
  const avgLen = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const oneTwo = log.filter((x) => x.lines <= 2).length;
  const questions = log.filter((x) => /\?/.test(x.reply)).length;
  const grounding = log.filter((x) => x.grounding).length;
  const microBeat = log.filter((x) => /^(hm\.|na\.|na várj|értem\.)/i.test(x.reply.split(/\n/)[0])).length;

  const openers = {};
  for (const x of log) {
    const k = openerKey(x.reply);
    openers[k] = (openers[k] || 0) + 1;
  }
  const topOpener = Object.entries(openers).sort((a, b) => b[1] - a[1])[0];

  return {
    count: log.length,
    avgLen,
    oneTwoLinePct: Math.round((oneTwo / log.length) * 100),
    questionPct: Math.round((questions / log.length) * 100),
    groundingPct: Math.round((grounding / log.length) * 100),
    microBeatPct: Math.round((microBeat / log.length) * 100),
    uniqueOpeners: Object.keys(openers).length,
    topOpener: topOpener ? { key: topOpener[0], count: topOpener[1] } : null,
    aiLeaks: log.filter((x) => x.ai).length,
    egoLeaks: log.filter((x) => x.ego).length
  };
}

async function runStress() {
  clearSession(STRESS_UID);
  clearPatternState(STRESS_UID);
  let session = {
    ...getSession(STRESS_UID),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  for (const row of STRESS_THREAD) {
    const out = await handleOpenConversation(
      { text: row.text, from: { id: STRESS_UID }, chat: { id: STRESS_UID } },
      "hu",
      session
    );
    recordInteraction(STRESS_UID, {
      text: row.text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(STRESS_UID);
    session.onboardingCompleted = true;

    const mockCtx = {
      lastUserText: row.text,
      state: out.state || {},
      lang: "hu",
      userId: STRESS_UID,
      session
    };
    const stress = detectStressProfile(mockCtx, out.category);

    if (AI_RE.test(out.reply)) throw new Error(`AI leak [${row.tag}]: ${out.reply.slice(0, 80)}`);
    if (EGO_RE.test(out.reply)) throw new Error(`ego leak [${row.tag}]: ${out.reply.slice(0, 80)}`);
    if (HYPE_RE.test(out.reply)) throw new Error(`hype [${row.tag}]`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    log.push({
      tag: row.tag,
      stress,
      category: out.category,
      len: out.reply.length,
      lines: lines.length,
      reply: out.reply,
      ai: AI_RE.test(out.reply),
      ego: EGO_RE.test(out.reply),
      grounding: /(túlterhelés|testedbe|nem új terv|pihenj)/i.test(out.reply)
    });
  }

  const m = metrics(log);
  if (m.avgLen > 120) throw new Error(`stress avg too long: ${m.avgLen}`);
  if (m.aiLeaks > 0) throw new Error("AI leaks in stress");
  if (m.egoLeaks > 0) throw new Error("ego leaks in stress");

  return { stress: m, stressByTag: log };
}

async function runFullDay() {
  clearSession(DAY_UID);
  clearPatternState(DAY_UID);
  let session = {
    ...getSession(DAY_UID),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    userPrimaryPath: "trading"
  };

  const log = [];
  const msg = { from: { id: DAY_UID }, chat: { id: DAY_UID } };

  for (const block of FULL_DAY) {
    updateSession(DAY_UID, {
      lastAt: Date.now() - 4 * 60 * 60 * 1000,
      onboardingCompleted: true,
      preferredLanguage: "hu",
      lang: "hu"
    });
    session = getSession(DAY_UID);
    session.onboardingCompleted = true;

    let reply;
    let category = "ritual";

    if (block.kind === "morning") {
      reply = await buildMorningReply(msg, "hu", session);
    } else if (block.kind === "midday") {
      reply = await buildMiddayReply(msg, "hu", session);
    } else if (block.kind === "evening") {
      reply = await buildEveningReply(msg, "hu", session);
    } else {
      const out = await handleOpenConversation(
        { text: block.text, ...msg },
        "hu",
        session
      );
      reply = out.reply;
      category = out.category;
      recordInteraction(DAY_UID, {
        text: block.text,
        reply,
        lang: "hu",
        category
      });
    }

    if (AI_RE.test(reply)) throw new Error(`AI leak [${block.phase}]: ${reply.slice(0, 80)}`);
    if (EGO_RE.test(reply)) throw new Error(`ego [${block.phase}]`);

    const lines = reply.split(/\n/).filter(Boolean);
    log.push({
      phase: block.phase,
      category,
      len: reply.length,
      lines: lines.length,
      reply,
      ai: AI_RE.test(reply),
      ego: EGO_RE.test(reply),
      grounding: /(túlterhelés|testedbe|nem új terv)/i.test(reply)
    });
    session = getSession(DAY_UID);
    session.onboardingCompleted = true;
  }

  const m = metrics(log);
  if (m.avgLen > 200) throw new Error(`day avg too long: ${m.avgLen}`);
  if ((m.topOpener?.count || 0) > Math.ceil(log.length * 0.45)) {
    throw new Error(`opener cluster: ${JSON.stringify(m.topOpener)}`);
  }

  return { fullDay: m, dayLog: log };
}

async function run() {
  const stressResult = await runStress();
  const dayResult = await runFullDay();

  const report = {
    stressImmersion: stressResult.stress,
    closedBetaDay: dayResult.fullDay,
    passed: true
  };

  console.log("✓ beta-immersion-hardening passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
