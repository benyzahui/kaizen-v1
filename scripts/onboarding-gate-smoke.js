/**
 * Discipline onboarding gate smoke test.
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
  assert(r.reply.includes("KaiZen"), "discipline start");
  assert(/nyelv|language|limbă/i.test(r.reply), "language step");

  let s = getSession(id);
  assert(!s.onboardingCompleted, "not complete after start");

  r = await processIncomingMessage(msg("2", id));
  assert(r.branch === "onboarding", "lang pick stays onboarding");
  assert(/neved|name|numele/i.test(r.reply), "asks name");

  r = await processIncomingMessage(msg("/energy", id));
  assert(
    r.branch === "onboarding_gate_command" || r.category === "onboarding",
    `energy blocked (branch=${r.branch})`
  );

  r = await processIncomingMessage(msg("Béla", id));
  assert(r.branch === "onboarding", "name step");
  assert(/út|path|cale/i.test(r.reply), "asks path");

  r = await processIncomingMessage(msg("1", id));
  assert(r.branch === "onboarding", "path completes");
  s = getSession(id);
  assert(s.onboardingCompleted, "onboarding done");
  assert(s.activeMode === "stabilization", "stabilization mode");

  r = await processIncomingMessage(msg("túl sok zaj", id));
  assert(r.category === "protocol_guidance", "open uses protocol");

  r = await processIncomingMessage(msg("/guide", id));
  assert(r.branch === "command", "/guide command branch");
  assert(/morning|midday|evening/i.test(r.reply), "blocked lists allowed cmds");

  console.log("Onboarding gate smoke: all passed.");
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
