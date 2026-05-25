/**
 * Protocol engine transition smoke test.
 */
const { getSession, updateSession } = require("../src/session/sessionStore");
const { processDisciplineOnboarding, parsePathChoice } = require("../src/handlers/disciplineOnboarding");
const { buildProtocolState } = require("../src/core/protocolStateEngine");
const { buildProtocolOpenReply, capProtocolBody, MAX_OPEN_LINES } = require("../src/core/protocolEngine");
const { isAllowedProtocolCommand } = require("../src/handlers/protocolCommands");
const { extractCommand, routeCommandMessage } = require("../src/handlers/commands");
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { finalizeCompanionReply, prepareCompanionContext } = require("../src/companion/companionCore");
const { getResponses } = require("../src/i18n/getResponses");

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const uid = `smoke_proto_${Date.now()}`;

  assert(parsePathChoice("2")?.id === "discipline", "path 2 = discipline");
  assert(isAllowedProtocolCommand("/morning"), "morning allowed");
  assert(!isAllowedProtocolCommand("/guide"), "guide blocked");
  assert(!isAllowedProtocolCommand("/mirror"), "mirror blocked");

  updateSession(uid, {
    onboardingActive: true,
    onboardingCompleted: false,
    onboardingStep: 0
  });
  let s = getSession(uid);
  let ob = processDisciplineOnboarding(uid, "2", s, "en");
  assert(ob?.reply && /name|neved|numele/i.test(ob.reply), "lang → name");
  s = getSession(uid);
  ob = processDisciplineOnboarding(uid, "Alex", s, "en");
  assert(ob?.reply && /path|stabil/i.test(ob.reply), "name → path");
  s = getSession(uid);
  ob = processDisciplineOnboarding(uid, "1", getSession(uid), "en");
  assert(ob?.reply, "path complete reply");
  s = getSession(uid);
  assert(s.onboardingCompleted, "path completes onboarding");
  assert(s.activeMode === "stabilization", "activeMode stabilization");
  assert(s.userName === "Alex", "userName saved");

  const st = buildProtocolState(s, "kimerült vagyok", "protocol_guidance");
  assert(st.energyState === "exhausted" || st.energyState === "low", "low energy state");

  const open = buildProtocolOpenReply(uid, "random thought", s, "en");
  assert(open && open.split(/\n/).length <= MAX_OPEN_LINES, "protocol reply short");
  assert(!/how do you feel/i.test(open), "no therapy loop");

  const blocked = await routeCommandMessage(
    { from: { id: uid }, chat: { id: uid }, text: "/guide" },
    s
  );
  assert(/morning|midday|evening/i.test(blocked), "blocked command lists allowed");

  const morning = await routeCommandMessage(
    { from: { id: uid }, chat: { id: uid }, text: "/morning" },
    s
  );
  assert(morning && morning.length > 10, "morning works");

  const fasting = await routeCommandMessage(
    { from: { id: uid }, chat: { id: uid }, text: "/fasting" },
    s
  );
  assert(fasting && /protocol|fast|böjt|post/i.test(fasting), "fasting ritual");

  const conv = await handleOpenConversation(
    { from: { id: uid }, chat: { id: uid }, text: "too much noise today" },
    "en",
    getSession(uid)
  );
  assert(conv.category === "protocol_guidance", "open → protocol");
  assert(conv.reply.split(/\n/).length <= MAX_OPEN_LINES + 1, "open reply capped");

  const ctx = prepareCompanionContext(uid, "test", s, "en", "protocol_guidance");
  const fin = finalizeCompanionReply(ctx, "protocol_guidance", open, getResponses("en"), {
    suggestedCommand: "/reset"
  });
  assert(capProtocolBody(fin).split(/\n/).length <= MAX_OPEN_LINES + 1, "finalize minimal");

  const rHu = getResponses("hu");
  assert(rHu.protocolGuidance?.general?.length > 0, "HU protocol copy");

  console.log("✓ protocol-engine-smoke passed");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
