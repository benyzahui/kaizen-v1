/**
 * Phases 137–144 — 3-day closed beta simulation (morning / midday / night).
 * Open chat + daily rhythm; no slash-command spam.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply, buildMiddayReply, buildEveningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");

const UID = "closed_beta_3day";

const WISDOM_RE =
  /(chaos grows|discipline disappear|elite zone|kovácsolódik identitás|identity is forged)/i;
const ROBOT_TRANSITION_RE = /^(más irány:|ugyanaz a szál|one sec\.)/im;
const COACH_ESSAY_RE =
  /(akaraterő hamar ég|willpower alone|voința pură|stabilizáló lépés|stabilizing action)/i;
const HYPE_RE = /(warrior|alpha mode|dragon path|elite zone)/i;

const SCHEDULE = [
  {
    day: 1,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Reggel stresszesen ébredtem." },
      { phase: "midday", kind: "midday" },
      { phase: "midday", text: "Túl sok meeting, üres vagyok." },
      { phase: "afternoon", text: "trade előtt vagyok, félek elrontani." },
      { phase: "evening", kind: "evening" },
      { phase: "evening", text: "Magányosnak érzem magam este." },
      { phase: "night", text: "Na." }
    ]
  },
  {
    day: 2,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Edzés után jobb, de még szétszórt." },
      { phase: "midday", text: "Megcsináltam a reggeli blokkot." },
      { phase: "afternoon", text: "Jó nap volt, kicsit büszke vagyok." },
      { phase: "evening", text: "Motiváció lement délutánra." },
      { phase: "night", text: "ok" }
    ]
  },
  {
    day: 3,
    blocks: [
      { phase: "morning", kind: "morning" },
      { phase: "morning", text: "Félek mi lesz a jövő héten." },
      { phase: "midday", text: "Nehéz nap, sok érzelem." },
      { phase: "afternoon", text: "Most csak kifáradtam, nem akarok tanácsot." },
      { phase: "evening", kind: "evening" },
      { phase: "evening", text: "Kicsit jobb. Holnap újra." },
      { phase: "night", text: "Kösz, ma segített." }
    ]
  }
];

function assert(c, m) {
  if (!c) throw new Error(m);
}

function stats(log) {
  const lengths = log.map((x) => x.len);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const lines = log.map((x) => x.lines);
  const oneTwo = lines.filter((n) => n <= 2).length;
  const long = lengths.filter((l) => l > 380).length;
  const uniq = new Set(log.map((x) => x.reply.slice(0, 45))).size;
  const cmd = log.filter((x) => /→\s*\//.test(x.reply)).length;
  const wisdom = log.filter((x) => WISDOM_RE.test(x.reply)).length;
  const robot = log.filter((x) => ROBOT_TRANSITION_RE.test(x.reply)).length;
  const essay = log.filter((x) => COACH_ESSAY_RE.test(x.reply)).length;
  const hype = log.filter((x) => HYPE_RE.test(x.reply)).length;
  const relational = log.filter((x) => x.category === "relational_flow").length;
  const life = log.filter((x) => x.category === "life_flow").length;
  const natural = log.filter((x) => x.category === "natural_conversation").length;

  return {
    count: log.length,
    avgLen: Math.round(avg),
    oneTwoLinePct: Math.round((oneTwo / log.length) * 100),
    longReplyPct: Math.round((long / log.length) * 100),
    uniquePrefixes: uniq,
    cmdHints: cmd,
    wisdomLeaks: wisdom,
    robotTransitions: robot,
    coachEssayHits: essay,
    hypeHits: hype,
    relationalFlow: relational,
    lifeFlow: life,
    naturalConversation: natural
  };
}

async function run() {
  clearSession(UID);
  let session = {
    ...getSession(UID),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    userPrimaryPath: "trading",
    accountabilityMode: false
  };

  const log = [];
  const msg = { from: { id: UID }, chat: { id: UID } };

  for (const dayPlan of SCHEDULE) {
    for (const block of dayPlan.blocks) {
      const gapMs =
        block.phase === "morning" ? 9 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000;
      updateSession(UID, {
        lastAt: Date.now() - gapMs,
        onboardingCompleted: true,
        preferredLanguage: "hu",
        lang: "hu"
      });
      session = getSession(UID);
      session.onboardingCompleted = true;

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

      const lineCount = reply.split(/\n/).filter(Boolean).length;
      log.push({
        day: dayPlan.day,
        phase: block.phase,
        category,
        len: reply.length,
        lines: lineCount,
        reply
      });

      assert(!WISDOM_RE.test(reply), `day${dayPlan.day} ${block.phase}: wisdom`);
      assert(!HYPE_RE.test(reply), `day${dayPlan.day} ${block.phase}: hype`);
      assert(!COACH_ESSAY_RE.test(reply), `day${dayPlan.day} ${block.phase}: essay coach`);

      session = getSession(UID);
      session.onboardingCompleted = true;
    }
  }

  const s = stats(log);
  console.log("✓ closed-beta-3day passed");
  console.log(JSON.stringify(s, null, 2));

  assert(s.cmdHints <= 3, `too many cmd hints: ${s.cmdHints}`);
  assert(s.uniquePrefixes >= 14, `too repetitive: ${s.uniquePrefixes}`);
  assert(s.wisdomLeaks === 0, `wisdom leaks: ${s.wisdomLeaks}`);
  assert(s.robotTransitions <= 2, `robot transitions: ${s.robotTransitions}`);
  assert(s.longReplyPct <= 25, `too many long replies: ${s.longReplyPct}%`);
  assert(s.oneTwoLinePct >= 40, `short pacing low: ${s.oneTwoLinePct}%`);
  assert(s.relationalFlow >= 1, "expected relational stay");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
