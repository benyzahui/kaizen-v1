/**
 * Phases 182–183 — last soul polish 3-day presence simulation (HU open chat).
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const UID = "soul_polish_3day";

const SCHEDULE = [
  {
    day: 1,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Rosszul aludtam, stresszes reggel." },
      { phase: "midday", kind: "midday" },
      { phase: "midday", text: "Túl sok minden fut egyszerre." },
      { phase: "afternoon", text: "Random: miért vagyok ilyen szétszórt?" },
      { phase: "evening", kind: "evening" },
      { phase: "evening", text: "Magányos este." },
      { phase: "night", text: "Na." }
    ]
  },
  {
    day: 2,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Edzés után kicsit jobb." },
      { phase: "midday", text: "Megcsináltam a blokkot." },
      { phase: "afternoon", text: "lol sok tab megint" },
      { phase: "evening", text: "Motiváció lement." },
      { phase: "night", text: "ok" }
    ]
  },
  {
    day: 3,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Félek a héttől." },
      { phase: "midday", text: "Nehéz nap, sok érzelem." },
      { phase: "afternoon", text: "Most csak kifáradtam." },
      { phase: "evening", kind: "evening" },
      { phase: "evening", text: "Kicsit rendezettebb. Holnap újra." },
      { phase: "night", text: "Kösz, ma segített." }
    ]
  }
];

const AI_RE =
  /\b(overload state|cognitive fragmentation|loop detected|identity is forged)\b/i;
const PERFORM_RE = /\b(hero'?s journey|10x grind|manifest your)\b/i;
const MICRO_RE = /^(hm\.|na\.|értem\.|jó\.|az sok\.|az kemény)/im;

async function run() {
  clearSession(UID);
  clearPatternState(UID);
  let session = {
    ...getSession(UID),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const log = [];
  const msg = { from: { id: UID }, chat: { id: UID } };

  for (const dayPlan of SCHEDULE) {
    for (const block of dayPlan.blocks) {
      updateSession(UID, {
        lastAt: Date.now() - (block.phase === "morning" ? 9 * 3600000 : 3 * 3600000),
        onboardingCompleted: true,
        preferredLanguage: "hu",
        lang: "hu"
      });
      session = getSession(UID);
      session.onboardingCompleted = true;

      let reply;
      let category = "ritual";

      if (block.kind === "morning") reply = buildMorningReply(msg, session, "hu");
      else if (block.kind === "midday") reply = buildMiddayReply(session, "hu");
      else if (block.kind === "evening") reply = buildEveningReply(msg, session, "hu");
      else {
        const out = await handleOpenConversation(
          { ...msg, text: block.text },
          "hu",
          session
        );
        reply = out.reply;
        category = out.category;
      }

      recordInteraction(UID, {
        text: block.text || block.kind || "",
        reply,
        lang: "hu",
        category
      });

      if (AI_RE.test(reply)) throw new Error(`day${dayPlan.day} ${block.phase}: AI voice`);
      if (PERFORM_RE.test(reply)) throw new Error(`day${dayPlan.day} ${block.phase}: performative`);

      log.push({
        day: dayPlan.day,
        phase: block.phase,
        category,
        lines: reply.split(/\n/).filter(Boolean).length,
        len: reply.length,
        reply
      });
      session = getSession(UID);
      session.onboardingCompleted = true;
    }
  }

  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);
  const oneTwo = log.filter((x) => x.lines <= 2).length;
  const uniq = new Set(log.map((x) => x.reply.slice(0, 38))).size;
  const micro = log.filter((x) => MICRO_RE.test(x.reply)).length;
  const openOnly = log.filter((x) =>
    ["natural_conversation", "life_flow", "relational_flow"].includes(x.category)
  );

  const report = {
    turns: log.length,
    openChatTurns: openOnly.length,
    avgLen,
    oneTwoLinePct: Math.round((oneTwo / log.length) * 100),
    uniquePrefixes: uniq,
    microBeatHits: micro,
    texturesUsed: [...new Set((session.lastEmotionalTexture ? [session.lastEmotionalTexture] : []))]
  };

  if (uniq < 14) throw new Error(`repetitive: ${uniq}`);
  if (avgLen > 130) throw new Error(`too long: ${avgLen}`);

  console.log("✓ soul-polish-3day passed");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
