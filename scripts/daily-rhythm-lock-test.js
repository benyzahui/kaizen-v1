/**
 * Daily rhythm lock — short calm rituals, no spam energy.
 */
const {
  buildMorningReply,
  buildMiddayReply,
  buildEveningReply
} = require("../src/handlers/dailyRhythm");
const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");

const HYPE_RE = /(crush it|warrior|elite zone|!!!|🔥)/i;
const WISDOM_RE = /(chaos grows|identity is forged|nervous system remembers)/i;
const SPAM_RE = /(don't forget|ne felejtsd|!!!)/i;

const msg = { from: { id: "rhythm_lock" }, chat: { id: "rhythm_lock" } };

function assertRhythm(label, reply, maxLines, maxLen) {
  if (HYPE_RE.test(reply) || WISDOM_RE.test(reply) || SPAM_RE.test(reply)) {
    throw new Error(`${label}: spam/hype/wisdom — ${reply.slice(0, 80)}`);
  }
  const lines = reply.split(/\n/).filter(Boolean);
  if (lines.length > maxLines) {
    throw new Error(`${label}: too many lines (${lines.length}): ${reply}`);
  }
  if (reply.length > maxLen) {
    throw new Error(`${label}: too long (${reply.length}): ${reply}`);
  }
}

function run() {
  clearSession("rhythm_lock");
  let session = {
    ...getSession("rhythm_lock"),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    currentMission: "egy tiszta blokk"
  };
  updateSession("rhythm_lock", session);
  session = getSession("rhythm_lock");

  const morning = buildMorningReply(msg, session, "hu");
  const midday = buildMiddayReply(session, "hu");
  const evening = buildEveningReply(msg, session, "hu");

  assertRhythm("morning", morning, 3, 160);
  assertRhythm("midday", midday, 2, 120);
  assertRhythm("evening", evening, 2, 120);

  const report = {
    morning: { len: morning.length, lines: morning.split(/\n/).filter(Boolean).length },
    midday: { len: midday.length, lines: midday.split(/\n/).filter(Boolean).length },
    evening: { len: evening.length, lines: evening.split(/\n/).filter(Boolean).length }
  };

  console.log("✓ daily-rhythm-lock-test passed");
  console.log(JSON.stringify(report, null, 2));
  console.log("--- morning ---\n" + morning);
  console.log("--- midday ---\n" + midday);
  console.log("--- evening ---\n" + evening);
}

run();
