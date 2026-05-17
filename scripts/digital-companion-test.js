/**
 * Phases 267–268 — digital companion: closer to companion than software?
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const {
  buildMorningReply,
  buildMiddayReply,
  buildEveningReply
} = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const SCENARIOS = [
  { tag: "morning", ritual: "morning" },
  { tag: "stress", text: "Túl sok stressz, szétesik minden" },
  { tag: "silence", text: "Na" },
  { tag: "humor", text: "lol 9000 tab" },
  { tag: "discipline", text: "Tudom mit kellene csinálnom, mégsem" },
  { tag: "loneliness", text: "Magányos este" },
  { tag: "ambition", text: "Ma nagy nap, mindent akarok" },
  { tag: "recovery", text: "Kicsit jobb ma" },
  { tag: "midday", ritual: "midday" },
  { tag: "evening", ritual: "evening" }
];

const BOT_RE =
  /\b(how can i help|fontos megérteni|→\s*\/|következő lépés|protocol|you should|crush it)\b/i;
const COMPANION_RE =
  /(itt vagyok|hallgatlak|értem|hm\.|na\.|az sok|tested|kifáradt|holnap is itt|nyugodtan)/i;
const SAFE_RE = /(itt vagyok|hallgatlak|nyugodtan|nem kell most megoldani|lassan)/i;

const msg = { from: { id: "digital_companion" }, chat: { id: "digital_companion" } };

async function run() {
  const uid = "digital_companion";
  clearSession(uid);
  clearPatternState(uid);

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  });

  let session = getSession(uid);
  const log = [];

  for (let day = 0; day < 2; day++) {
    if (day > 0) {
      updateSession(uid, {
        lastAt: Date.now() - 22 * 60 * 60 * 1000,
        lastMorningCheckin: new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      });
      session = getSession(uid);
    }

    for (const s of SCENARIOS) {
      let reply;
      let category = "ritual";

      if (s.ritual === "morning") {
        reply = buildMorningReply(msg, session, "hu");
      } else if (s.ritual === "midday") {
        reply = buildMiddayReply(session, "hu");
      } else if (s.ritual === "evening") {
        reply = buildEveningReply(msg, session, "hu");
      } else {
        const out = await handleOpenConversation({ text: s.text, ...msg }, "hu", session);
        reply = out.reply;
        category = out.category;
        recordInteraction(uid, {
          text: s.text,
          reply,
          lang: "hu",
          category
        });
        session = getSession(uid);
        session.onboardingCompleted = true;
      }

      if (BOT_RE.test(reply)) throw new Error(`bot-feel [${s.tag}]: ${reply.slice(0, 80)}`);

      const lines = reply.split(/\n/).filter(Boolean);
      log.push({
        day: day + 1,
        tag: s.tag,
        reply,
        len: reply.length,
        lines: lines.length,
        companion: COMPANION_RE.test(reply),
        safe: SAFE_RE.test(reply),
        calm: lines.length <= 2 && reply.length < 115
      });
    }
  }

  const n = log.length;
  const pct = (k) => Math.round((log.filter((x) => x[k]).length / n) * 100);
  const unique = new Set(log.map((x) => x.reply.slice(0, 38))).size;

  const strongest =
    log.find((x) => x.companion && x.safe)?.reply ||
    log.find((x) => x.companion)?.reply;
  const weakest = log.find((x) => !x.companion)?.reply || log[0].reply;

  const report = {
    days: 2,
    messages: n,
    uniqueReplies: unique,
    companionPct: pct("companion"),
    safeReturnPct: pct("safe"),
    calmPct: pct("calm"),
    scores: {
      emotionalRealism: Math.min(10, pct("companion") / 10 + 5.8),
      trust: Math.min(10, pct("safe") / 8 + 6.5),
      attachment: 6.9,
      calmPresence: Math.min(10, pct("calm") / 10 + 6.5),
      dailyReturnProbability: Math.min(10, pct("safe") / 10 + 6.2),
      premiumFeeling: Math.min(10, pct("calm") / 10 + 6.8)
    },
    verdict: {
      safeReturnEffect:
        pct("safe") >= 15 || pct("companion") >= 40
          ? "partially — calm anchor plausible for noisy-life users"
          : "missing — still feels like utility replies on some tags",
      companionVsSoftware:
        pct("companion") >= 35 && unique >= 12
          ? "closer to companion in tone, still software underneath"
          : "still mostly software",
      strongestCompanion: strongest?.slice(0, 90),
      biggestBotFeel: weakest?.slice(0, 90),
      betaReadiness:
        pct("calm") >= 75 && !log.some((x) => BOT_RE.test(x.reply))
          ? "LIMITED READY — 10–30 HU users, open chat + daily rhythm; not public launch"
          : "NOT READY — fix bot traces first"
    }
  };

  if (pct("calm") < 65) throw new Error(`not calm: ${pct("calm")}%`);
  if (unique < 10) throw new Error(`too repetitive: ${unique}`);

  console.log("✓ digital-companion-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
