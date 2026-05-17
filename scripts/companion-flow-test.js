/**
 * Companion flow — late-night conversation: fluid, continuous, no command interrupts.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction, updateSession } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const LATE_NIGHT = [
  "Szia",
  "Túl fáradt vagyok ma",
  "Na",
  "Magányos este",
  "lol tab megint",
  "Kösz",
  "…"
];

const CMD_RE = /→\s*\/|^\s*(tipp|tip):/im;
const ROBOT_RE = /^\d+[\.\)]\s|^(first,|először|más irány:)/im;
const ABRUPT_RE = /a szál még nyitva van.*megoldani|érdemes egy mozdulatot/i;
const FLOW_RE = /(hallgatlak|itt vagyok|folytatjuk|múltkor|ugyanaz a nyomás|késő van|lassan)/i;

function lateNightOffsetMinutes() {
  const now = new Date();
  const target = 23;
  let off = (target - now.getUTCHours()) * 60 - now.getUTCMinutes();
  if (off < -720) off += 1440;
  if (off > 720) off -= 1440;
  return off;
}

async function run() {
  const uid = "companion_flow";
  clearSession(uid);
  clearPatternState(uid);

  updateSession(uid, {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    companionHourOffset: lateNightOffsetMinutes()
  });

  let session = getSession(uid);
  const msg = { from: { id: uid }, chat: { id: uid } };
  const log = [];

  for (const text of LATE_NIGHT) {
    const out = await handleOpenConversation({ text, ...msg }, "hu", session);
    recordInteraction(uid, {
      text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;

    if (CMD_RE.test(out.reply)) throw new Error(`command interrupt: ${text} → ${out.reply}`);
    if (ROBOT_RE.test(out.reply)) throw new Error(`robot structure: ${text} → ${out.reply}`);
    if (ABRUPT_RE.test(out.reply)) throw new Error(`abrupt coach: ${text} → ${out.reply}`);

    const lines = out.reply.split(/\n/).filter(Boolean);
    log.push({
      text,
      reply: out.reply,
      len: out.reply.length,
      lines: lines.length,
      flow: FLOW_RE.test(out.reply),
      calm: lines.length <= 2 && out.reply.length < 115
    });
  }

  const n = log.length;
  const pct = (k) => Math.round((log.filter((x) => x[k]).length / n) * 100);
  const unique = new Set(log.map((x) => x.reply.slice(0, 35))).size;

  if (unique < 4) throw new Error(`too repetitive late-night: ${unique} unique`);
  if (pct("calm") < 70) throw new Error(`not calm enough: ${pct("calm")}%`);

  const report = {
    slot: "late_night (simulated)",
    messages: n,
    uniqueReplies: unique,
    flowPct: pct("flow"),
    calmPct: pct("calm"),
    feelsNaturalLateNight:
      pct("calm") >= 75 && unique >= 5 && !log.some((x) => CMD_RE.test(x.reply))
        ? "plausible in script — real 2am thread still unproven"
        : "uneven — needs live user",
    scores: {
      continuity: Math.min(10, unique / 1.2),
      transitionSmoothness: Math.min(10, pct("calm") / 10 + 6.5),
      emotionalPacing: Math.min(10, pct("calm") / 10 + 6),
      memorySoftness: Math.min(10, pct("flow") / 8 + 6)
    }
  };

  console.log("✓ companion-flow-test passed");
  console.log(JSON.stringify({ log, report }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
