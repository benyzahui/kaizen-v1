/**
 * Fresh-user onboarding gate smoke test.
 * Run: node scripts/onboarding-gate-smoke.js
 */

const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { clearSession, getSession } = require("../src/session/sessionStore");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function msg(text, id = "fresh_gate_user") {
  return { text, from: { id, language_code: "hu" }, chat: { id } };
}

async function run() {
  const id = "fresh_gate_user";
  clearSession(id);

  let r = await processIncomingMessage(msg("/start", id));
  assert(r.branch === "command", "/start is command");
  assert(r.reply.includes("KaiZen") || r.reply.includes("activated"), "cinematic start");
  assert(!r.reply.includes("/energy"), "no energy in start");

  let s = getSession(id);
  assert(!s.onboardingCompleted, "not complete after start");

  r = await processIncomingMessage(
    msg("Szia, Béla vagyok, most csak bemutatkozom.", id)
  );
  assert(r.branch === "onboarding", "intro stays onboarding");
  assert(!/natural_conversation|overload than laziness/i.test(r.reply), "no natural layer");
  s = getSession(id);
  assert(s.preferredLanguage === "hu", "HU locked on first meaningful message");
  assert(!s.onboardingCompleted, "not auto-completed before gate test");
  assert(r.reply.length > 20, "onboarding reply");

  r = await processIncomingMessage(msg("/energy", id));
  assert(
    r.branch === "onboarding_gate_command" || r.category === "onboarding",
    `energy blocked (branch=${r.branch})`
  );
  assert(
    /aktiválás|beállítás|activation|setup|introduc/i.test(r.reply),
    `gentle redirect: ${r.reply.slice(0, 80)}`
  );

  r = await processIncomingMessage(msg("nagyon stresszes vagyok még mindig", id));
  assert(r.branch === "onboarding", "stress still onboarding not open");
  assert(s.preferredLanguage === "hu", "lang stays HU");

  r = await processIncomingMessage(msg("/guide", id));
  assert(r.branch === "command", "/guide allowed");
  assert(
    r.reply.includes("/morning") || r.reply.includes("/focus") || r.reply.includes("térkép") || r.reply.includes("map"),
    "guide content"
  );

  console.log("Onboarding gate smoke: all passed.");
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
