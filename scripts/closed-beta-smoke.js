/**
 * Phases 71–77 closed beta preparation smoke.
 */
const { sanitizeBetaCopy } = require("../src/companion/betaCopySanitize");
const { resolveLanguageWithSession } = require("../src/i18n/languageDetect");
const { buildGuideReply } = require("../src/handlers/guide");
const { getResponses } = require("../src/i18n/getResponses");
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { routeCommandMessage } = require("../src/handlers/commands");
const { clearSession, getSession } = require("../src/session/sessionStore");

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const dirty =
    "Overload state detected.\n→ /reset\nYour brain is debugging in production.\nThis is not random AI chat.";
  const clean = sanitizeBetaCopy(dirty);
  assert(!/debugging|→\s*\/|overload state/i.test(clean), "beta sanitize strips tech/cmd");

  const huLocked = resolveLanguageWithSession("hello how are you", {
    preferredLanguage: "hu",
    onboardingCompleted: true
  });
  assert(huLocked === "hu", "HU lock holds on English text");

  const roLocked = resolveLanguageWithSession("I am very tired today", {
    preferredLanguage: "ro",
    onboardingCompleted: true
  });
  assert(roLocked === "ro", "RO lock holds");

  const guide = buildGuideReply("hu");
  assert(guide.length < 450, "guide compact");
  assert(!/📈|🧠|⚔/.test(guide), "guide no emoji sections");

  const cmds = getResponses("en").commandsCompact || "";
  assert(cmds.length < 350, "commands compact");

  const uid = "beta_lang";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu"
  };

  const huOut = await handleOpenConversation(
    { text: "Most jöttem haza.", from: { id: uid }, chat: { id: uid } },
    "hu",
    session
  );
  assert(huOut.reply.length < 400, "HU home reply short");
  assert(!/debug|AI chat|→\s*\//i.test(huOut.reply), "HU reply clean");

  session.preferredLanguage = "en";
  const enOut = await handleOpenConversation(
    { text: "I'm exhausted", from: { id: uid }, chat: { id: uid } },
    "en",
    session
  );
  assert(resolveLanguageWithSession("kimerült vagyok", session) === "en", "pref EN stays on HU text");
  assert(!/debug|production environment/i.test(enOut.reply), "EN reply no dev humor");

  const checkIns = getResponses("hu").companionCheckIns || [];
  assert(checkIns.some((c) => /fókusz|fejed/i.test(c)), "HU human check-in");
  assert(!checkIns.some((c) => /^⚔/.test(c)), "no sword emoji check-ins");

  console.log("✓ closed-beta-smoke passed");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
