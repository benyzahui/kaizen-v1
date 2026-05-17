/**
 * WOW immersion test — phases 218: memorable moments without emoji spam.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildMorningReply } = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");
const { countEmojiAnchors } = require("../src/companion/wowExperience");

const SCENARIOS = [
  { tag: "morning", text: "Szia", slot: "morning" },
  { tag: "stress", text: "Túl sok minden szétesik" },
  { tag: "loneliness", text: "Magányos este" },
  { tag: "training", text: "Edzés után üres vagyok" },
  { tag: "night", text: "Túlgondolom miért vagyok ilyen" },
  { tag: "trading", text: "trade előtt remeg a kezem" },
  { tag: "humor", text: "lol 9000 tab" },
  { tag: "recovery", text: "Megcsináltam, kicsit jobb" },
  { tag: "silence", text: "Na" }
];

const WOW_RE =
  /(Chrome|tabbal|kimondtad|őszintébb|stabilabb energi|jövődet|pörög az agyad|túlterhelésnek hangzik)/i;
const AI_RE = /\b(as an AI|chatbot|let me suggest)\b/i;

async function run() {
  const uid = "wow_immersion";
  clearSession(uid);
  clearPatternState(uid);

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    lastAt: Date.now() - 2 * 60 * 60 * 1000
  });

  let session = getSession(uid);
  session.onboardingCompleted = true;
  const msg = { from: { id: uid }, chat: { id: uid } };

  const morningRitual = buildMorningReply(msg, session, "hu");
  const log = [{ tag: "morning_ritual", reply: morningRitual, len: morningRitual.length }];

  for (const s of SCENARIOS) {
    if (s.slot === "morning") {
      updateSession(uid, { lastAt: Date.now() - 10 * 60 * 60 * 1000 });
    }
    session = getSession(uid);
    session.onboardingCompleted = true;

    const out = await handleOpenConversation({ text: s.text, ...msg }, "hu", session);
    recordInteraction(uid, {
      text: s.text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);

    if (AI_RE.test(out.reply)) throw new Error(`AI leak [${s.tag}]`);
    const emojis = countEmojiAnchors(out.reply);
    if (emojis > 2) throw new Error(`emoji spam [${s.tag}]: ${emojis} — ${out.reply}`);
    if (out.reply.length > 220) throw new Error(`too long [${s.tag}]: ${out.reply.length}`);

    log.push({
      tag: s.tag,
      reply: out.reply,
      len: out.reply.length,
      emojis,
      wow: WOW_RE.test(out.reply) || emojis === 1,
      lines: out.reply.split(/\n/).filter(Boolean).length
    });
  }

  const wowPct = Math.round((log.filter((x) => x.wow).length / log.length) * 100);
  const avgLen = Math.round(log.reduce((s, x) => s + x.len, 0) / log.length);
  const emojiSpam = log.filter((x) => (x.emojis || 0) > 1).length;

  if (emojiSpam > 0) throw new Error(`emoji spam count: ${emojiSpam}`);
  if (avgLen > 120) throw new Error(`avg too long: ${avgLen}`);

  const analysis = {
    messages: log.length,
    avgLen,
    wowMomentPct: wowPct,
    emojiSpam,
    memorable: wowPct >= 25 && wowPct <= 85,
    verdict:
      wowPct >= 20 && emojiSpam === 0
        ? "Subtle wow layer active — not every line, anchors rare"
        : "Wow layer too weak or too loud"
  };

  console.log("✓ wow-immersion-test passed");
  console.log(JSON.stringify({ log, analysis }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
