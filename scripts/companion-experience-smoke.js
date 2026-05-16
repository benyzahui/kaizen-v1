/**
 * Phases 16–25 experience smoke test.
 * Run: node scripts/companion-experience-smoke.js
 */

const { getFirstContactStart } = require("../src/companion/firstContactEngine");
const { extractInvisibleProfile } = require("../src/companion/invisibleProfile");
const { buildGuideReply } = require("../src/handlers/guide");
const { routeNaturalIntent } = require("../src/companion/naturalIntentRouter");
const {
  detectAccountabilityToggle,
  applyAccountabilityToggle
} = require("../src/companion/accountabilityMode");
const { tryMicroReward } = require("../src/companion/microRewards");
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession } = require("../src/session/sessionStore");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function run() {
  const start = getFirstContactStart("hu");
  assert(start.includes("KaiZen aktiválva"), "cinematic HU start");
  assert(start.includes("zaj alatt"), "natural intro ask");
  assert(!start.includes("/pulse"), "start has no command dump");

  const guide = buildGuideReply("en");
  assert(guide.includes("Daily rhythm"), "premium guide EN");
  assert(guide.includes("speak naturally"), "guide natural footer");

  const prof = extractInvisibleProfile(
    "Dragon vagyok, platformot építek, túl stresszes vagyok, trading is van, push me direct"
  );
  assert(prof.path, "invisible profile path");
  assert(prof.patch.userIntensityPreference === "direct", "invisible intensity");

  const overload = routeNaturalIntent("nagyon stresszes vagyok", "hu", { onboardingCompleted: true }, "x1");
  assert(overload?.body && !overload.body.startsWith("/"), "overload natural not slash-first");

  const scatter = routeNaturalIntent("szét vagyok csúszva", "hu", { onboardingCompleted: true }, "x2");
  assert(scatter?.body, "scatter natural HU");

  assert(detectAccountabilityToggle("keep me accountable") === "on", "accountability on");
  clearSession("acc1");
  const accReply = applyAccountabilityToggle("acc1", "on", "en");
  assert(/accountability/i.test(accReply), "accountability ack");

  let micro = null;
  for (let i = 0; i < 8 && !micro; i++) {
    micro = tryMicroReward("ma futottam 5 km", "hu", `m1_${i}`);
  }
  assert(micro?.body, "micro reward HU");

  const scenarios = [
    { lang: "hu", text: "szét vagyok csúszva", mustNot: /^\/reset/m },
    { lang: "hu", text: "nagyon stresszes vagyok", mustNot: /^\/reset/m },
    { lang: "en", text: "before trade, nervous", mustNot: /^\/trade/m },
    { lang: "hu", text: "kimegyek futni", mustNot: /spiritual monologue/i }
  ];

  for (const sc of scenarios) {
    const id = `exp_${sc.lang}_${sc.text.slice(0, 12)}`;
    clearSession(id);
    const session = {
      ...getSession(id),
      onboardingCompleted: true,
      lang: sc.lang,
      preferredLanguage: sc.lang
    };
    const out = await handleOpenConversation(
      { text: sc.text, from: { id }, chat: { id } },
      sc.lang,
      session
    );
    assert(out.reply?.length > 20, `reply for: ${sc.text}`);
    if (sc.mustNot) assert(!sc.mustNot.test(out.reply.trim()), `bad pattern: ${sc.text}`);
    console.log(`✓ [${sc.lang}] ${sc.text.slice(0, 40)} → ${out.category}`);
  }

  console.log("\nExperience smoke: all passed.");
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
