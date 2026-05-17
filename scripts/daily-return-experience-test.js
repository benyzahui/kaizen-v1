/**
 * Multi-day daily return — morning / midday / evening / late night emotional rhythm.
 */
const {
  buildMorningReply,
  buildMiddayReply,
  buildEveningReply,
  buildLateNightGrounding
} = require("../src/handlers/dailyRhythm");
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const HYPE_RE = /(crush it|warrior|!!!|ne felejtsd|don't forget)/i;
const WARM_RE = /(itt leszek|holnap|leeresztés|irány|hallgatlak|lélegzet|újra itt|folytatjuk)/i;

const msg = { from: { id: "daily_return" }, chat: { id: "daily_return" } };

function assertRitual(label, reply, maxLines, maxLen) {
  if (HYPE_RE.test(reply)) throw new Error(`${label}: hype/notification — ${reply}`);
  const lines = reply.split(/\n/).filter(Boolean);
  if (lines.length > maxLines) throw new Error(`${label}: ${lines.length} lines`);
  if (reply.length > maxLen) throw new Error(`${label}: len ${reply.length}`);
}

function lateNightOffset() {
  const now = new Date();
  const target = 23;
  let off = (target - now.getUTCHours()) * 60 - now.getUTCMinutes();
  if (off < -720) off += 1440;
  if (off > 720) off -= 1440;
  return off;
}

async function run() {
  const uid = "daily_return";
  clearSession(uid);
  clearPatternState(uid);

  const log = [];
  const rituals = new Set();

  for (let day = 0; day < 3; day++) {
    updateSession(uid, {
      onboardingCompleted: true,
      preferredLanguage: "hu",
      lang: "hu",
      lastMorningCheckin:
        day > 0 ? new Date(Date.now() - 86400000 * day).toISOString().slice(0, 10) : null
    });

    let session = getSession(uid);
    session.onboardingCompleted = true;

    const morning = buildMorningReply(msg, session, "hu");
    assertRitual(`d${day + 1}-morning`, morning, 3, 180);
    rituals.add(morning.slice(0, 40));

    const midday = buildMiddayReply(session, "hu");
    assertRitual(`d${day + 1}-midday`, midday, 2, 140);
    rituals.add(midday.slice(0, 40));

    const evening = buildEveningReply(msg, session, "hu");
    assertRitual(`d${day + 1}-evening`, evening, 3, 160);
    rituals.add(evening.slice(0, 40));

    log.push({
      day: day + 1,
      morning: { len: morning.length, warm: WARM_RE.test(morning), text: morning },
      midday: { len: midday.length, warm: WARM_RE.test(midday), text: midday },
      evening: { len: evening.length, warm: WARM_RE.test(evening), text: evening }
    });

    for (const text of ["Túl sok ma", "ok"]) {
      const out = await handleOpenConversation({ text, ...msg }, "hu", session);
      recordInteraction(uid, {
        text,
        reply: out.reply,
        lang: "hu",
        category: out.category
      });
      session = getSession(uid);
      session.onboardingCompleted = true;
    }
  }

  updateSession(uid, { companionHourOffset: lateNightOffset() });
  const sessionLn = getSession(uid);
  const late = buildLateNightGrounding(sessionLn, "hu");
  assertRitual("late-night", late, 2, 120);
  rituals.add(late.slice(0, 40));

  const warmPct = Math.round(
    (log.flatMap((d) => [d.morning, d.midday, d.evening]).filter((x) => x.warm).length /
      (log.length * 3)) *
      100
  );

  if (rituals.size < 5) {
    throw new Error(`too few unique rituals: ${rituals.size}`);
  }

  const report = {
    days: 3,
    uniqueRituals: rituals.size,
    warmPct,
    lateNight: late,
    dailyReturnPull:
      warmPct >= 50 && rituals.size >= 6
        ? "emotionally helpful cadence in script — not proven vs notifications"
        : "needs more warmth variety",
    verdict: "LIMITED READY — ritual voice closer to open-chat calm; live streak still unproven"
  };

  console.log("✓ daily-return-experience-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
