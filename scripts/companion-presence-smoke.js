/**
 * Phase 8–15 smoke: presence memory, time arc, depth, companion flow.
 * Run: node scripts/companion-presence-smoke.js
 */

const { handleOpenConversation } = require("../src/handlers/openConversation");
const {
  prepareCompanionContext,
  finalizeCompanionReply
} = require("../src/companion/companionCore");
const { resolveResponseDepth, tryShortActionReply } = require("../src/companion/responseDepth");
const { buildPresenceSnapshot } = require("../src/companion/presenceMemory");
const { tryCompanionCheckIn } = require("../src/companion/companionInitiation");
const { getResponses } = require("../src/i18n/getResponses");
const { clearSession, getSession } = require("../src/session/sessionStore");

const scenarios = [
  { name: "stressed user", lang: "en", text: "I am overwhelmed, too many tabs, cannot focus" },
  { name: "funny user", lang: "en", text: "lol my brain has 47 tabs open again" },
  { name: "silent user", lang: "en", text: "hi" },
  {
    name: "overloaded entrepreneur",
    lang: "en",
    text: "platform launch chaos, everything breaking at once",
    session: { onboardingCompleted: true, currentMission: "finish platform" }
  },
  { name: "trader after loss", lang: "en", text: "took a bad loss, want to revenge trade" },
  { name: "discipline user", lang: "en", text: "I keep procrastinating on the hard task" },
  { name: "HU only", lang: "hu", text: "túl sok minden egyszerre, kimerült vagyok" },
  { name: "RO only", lang: "ro", text: "sunt epuizat, prea multe proiecte" },
  {
    name: "EN philosophical",
    lang: "en",
    text: "What does discipline mean when nobody is watching?"
  },
  { name: "natural chat", lang: "en", text: "just checking in, long day" }
];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function run() {
  let ok = 0;

  assert(resolveResponseDepth("kimegyek futni", "light_conversation", {}) === "short", "HU run → short depth");
  const shortReply = tryShortActionReply("kimegyek futni", "hu", "smoke1");
  assert(shortReply && shortReply.length < 200, "short action reply for run");
  ok += 2;

  const snap = buildPresenceSnapshot(
    { presenceMemory: {}, currentMission: "ship v1" },
    { emotionalIntensity: 8, scatter: 2, energyLevel: 4, mentorMode: "recovery_mode" },
    "overwhelmed",
    "chaos_loop"
  );
  assert(snap.emotionalState === "overloaded", "overload snapshot");
  ok += 1;

  const checkSession = {
    onboardingCompleted: true,
    lastAt: Date.now() - 9 * 60 * 60 * 1000,
    presenceMemory: { overloadActive: true, emotionalState: "overloaded" },
    messages: [{ text: "x", category: "chaos_loop", ts: 1 }]
  };
  const forced = tryCompanionCheckIn(checkSession, "en", "check1", "hey");
  assert(forced?.body, "companion check-in after long gap");
  ok += 1;

  for (const sc of scenarios) {
    const userId = `smoke_${sc.name.replace(/\s+/g, "_")}`;
    clearSession(userId);
    const base = {
      onboardingCompleted: true,
      preferredLanguage: sc.lang,
      lang: sc.lang,
      userName: "Test",
      messages: [],
      ...(sc.session || {})
    };
    const session = { ...getSession(userId), ...base };

    const msg = { text: sc.text, from: { id: userId }, chat: { id: userId } };
    const out = await handleOpenConversation(msg, sc.lang, session);
    assert(out.reply && out.reply.length > 10, `${sc.name}: empty reply`);
    assert(out.reply.length < 1200, `${sc.name}: reply too long (${out.reply.length})`);
    assert(!/→\s*\/\w+.*→\s*\//.test(out.reply), `${sc.name}: multiple command hints`);
    ok += 1;
    console.log(`✓ ${sc.name} [${out.category}] ${out.reply.slice(0, 72).replace(/\n/g, " ")}…`);
  }

  const ctx = prepareCompanionContext(
    "fmt",
    "test",
    { onboardingCompleted: true, messages: [], presenceMemory: { emotionalState: "stable" } },
    "en",
    "work_focus"
  );
  const r = getResponses("en");
  const formatted = finalizeCompanionReply(
    ctx,
    "work_focus",
    "🧠 Focus\nLine one.\n\n⚔ Next\nLine two.",
    r,
    { skipCommandHint: true }
  );
  assert(formatted.includes("🧠"), "premium format keeps anchors");
  ok += 1;

  console.log(`\n${ok} checks passed.`);
}

run().catch((e) => {
  console.error("SMOKE FAILED:", e.message);
  process.exit(1);
});
