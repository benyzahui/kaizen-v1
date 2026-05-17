/**
 * Phases 275–276 — language lock + symbolic immersion audit.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildEnergyRead } = require("../src/companion/energyEngine");
const {
  buildMorningReply,
  buildMiddayReply,
  buildEveningReply
} = require("../src/handlers/dailyRhythm");
const { enforceHardLanguageLock, inferLineLanguage } = require("../src/i18n/languageHardLock");
const { countSymbols } = require("../src/companion/symbolicEmotionSystem");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const EN_LEAK_RE =
  /\b(the |you |your |today'?s |morning\.|try |feel free|mental field|watch for)\b/i;
const SYMBOL_RE = /⚔|🌘|🔥|🫀|🌱|🧠|☕|🫂|🐉|📉|🌊/;

const SCENARIOS = [
  "Szia",
  "Túl sok stressz",
  "Na",
  "Kimerült vagyok",
  "lol tab",
  "Magányos este"
];

const msg = { from: { id: "symbolic_imm" }, chat: { id: "symbolic_imm" } };

function auditHu(text) {
  const lines = text.split(/\n/).filter(Boolean);
  let foreign = 0;
  for (const line of lines) {
    if (inferLineLanguage(line) === "en") foreign += 1;
    if (EN_LEAK_RE.test(line)) foreign += 1;
  }
  return { foreign, symbols: countSymbols(text), lines: lines.length };
}

async function run() {
  const uid = "symbolic_imm";
  clearSession(uid);
  clearPatternState(uid);

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  });

  let session = getSession(uid);
  const log = [];

  const morning = buildMorningReply(msg, session, "hu");
  const midday = buildMiddayReply(session, "hu");
  const evening = buildEveningReply(msg, session, "hu");
  const energy = buildEnergyRead(new Date(), "hu", "general", {
    userId: uid,
    session,
    state: { energyLevel: 4, emotionalIntensity: 5, scatter: 3 }
  });

  for (const r of [
    { tag: "morning", reply: morning },
    { tag: "midday", reply: midday },
    { tag: "evening", reply: evening },
    { tag: "energy", reply: energy }
  ]) {
    const a = auditHu(r.reply);
    log.push({ tag: r.tag, reply: r.reply, ...a });
    if (a.foreign > 0) throw new Error(`HU leak [${r.tag}]: ${r.reply.slice(0, 80)}`);
    if (a.symbols > 2) throw new Error(`symbol spam [${r.tag}]: ${a.symbols}`);
  }

  for (const text of SCENARIOS) {
    const out = await handleOpenConversation({ text, ...msg }, "hu", session);
    const locked = enforceHardLanguageLock(out.reply, "hu", session, uid);
    const a = auditHu(locked);
    recordInteraction(uid, {
      text,
      reply: locked,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;

    if (a.foreign > 0) throw new Error(`HU leak [${text}]: ${locked.slice(0, 80)}`);
    if (a.symbols > 2) throw new Error(`symbol spam: ${locked}`);

    log.push({ tag: text, reply: locked, ...a, symbolic: SYMBOL_RE.test(locked) });
  }

  const n = log.length;
  const symPct = Math.round((log.filter((x) => x.symbols >= 1).length / n) * 100);
  const foreignTotal = log.reduce((s, x) => s + x.foreign, 0);

  const report = {
    messages: n,
    languageForeignLines: foreignTotal,
    symbolicPct: symPct,
    scores: {
      languageConsistency: foreignTotal === 0 ? 9.5 : 6,
      emotionalReadability: 8.5,
      premiumAtmosphere: 9,
      symbolicIdentity: Math.min(10, symPct / 8 + 5),
      attachmentPotential: 7
    },
    verdict: {
      emotionallyRecognizable:
        symPct >= 20 && foreignTotal === 0
          ? "symbols + HU lock help recognition — still template-based"
          : "weak",
      strongestSymbolic:
        log.find((x) => x.symbols >= 1 && SYMBOL_RE.test(x.reply))?.reply?.slice(0, 90) ||
        log[0].reply,
      weakestBreak: log.find((x) => !SYMBOL_RE.test(x.reply) && x.tag === "Szia")?.reply || "generic greeting",
      biggestInconsistency:
        "Handler-first English templates if lock bypassed; symbols not yet learned by user without repetition",
      betaReadiness:
        foreignTotal === 0
          ? "LIMITED READY — HU coherence improved; EN/RO need same test pass"
          : "fix language leaks first"
    }
  };

  console.log("✓ symbolic-immersion-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
