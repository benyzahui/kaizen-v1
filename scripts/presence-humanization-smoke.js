/**
 * Phases 55–60 presence humanization smoke test.
 */
const { applyHumanCadence } = require("../src/companion/humanCadence");
const { buildMicroEmotionalReply } = require("../src/companion/emotionalMicro");
const { resolveCommandHint } = require("../src/companion/commandPresence");
const { maybeEmotionalContinuity } = require("../src/companion/emotionalContinuity");
const { buildNaturalConversation } = require("../src/conversation/naturalConversation");
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession } = require("../src/session/sessionStore");

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const synthetic =
    "Overload state detected.\nOne task. One focus.\nWhat is the one thing?";
  const cadenced = applyHumanCadence(synthetic, "en", "natural_conversation", "t");
  assert(!/overload state detected|one task/i.test(cadenced), "synthetic lines stripped");
  assert(cadenced.length > 0, "cadence fallback");

  const micro = buildMicroEmotionalReply(
    "kimerült vagyok, túl sok minden",
    "hu",
    { freshPhrasesUsed: [] },
    "u1"
  );
  assert(micro && micro.length < 200, "HU micro emotional short");

  const noCmd = resolveCommandHint(
    "natural_conversation",
    "stresszes vagyok",
    { onboardingCompleted: true },
    "/reset"
  );
  assert(noCmd === null, "natural conversation: no command hint");

  const heavy = resolveCommandHint(
    "session_loop",
    "help",
    {},
    "/focus"
  );
  assert(heavy === "/focus", "heavy category keeps hint");

  const cont = maybeEmotionalContinuity(
    {
      onboardingCompleted: true,
      messages: [{}, {}],
      presenceMemory: {
        overloadActive: true,
        emotionalState: "grounded"
      }
    },
    "hu",
    "ok"
  );
  if (cont) {
    assert(cont.length < 180, "continuity line short");
  }

  const nat = buildNaturalConversation(
    "szégyenlem hogy ilyen lassan megy",
    "emotional_reflection",
    { freshPhrasesUsed: [] },
    "hu",
    "u2"
  );
  assert(nat?.body && nat.body.length < 250, "natural uses micro/humanLines");

  const uid = "hum_presence";
  clearSession(uid);
  const base = {
    ...getSession(uid),
    onboardingCompleted: true,
    lang: "hu",
    preferredLanguage: "hu",
    presenceMemory: {
      emotionalState: "overloaded",
      overloadActive: true,
      lastImportantTopic: "work"
    },
    messages: [{ role: "user" }, { role: "assistant" }]
  };

  const out = await handleOpenConversation(
    { text: "túl sok minden egyszerre, kimerült vagyok", from: { id: uid }, chat: { id: uid } },
    "hu",
    base
  );
  assert(out.reply.length > 10 && out.reply.length < 900, "open reply length");
  assert(!/→\s*\/reset|→\s*\/focus/i.test(out.reply), "no command arrow in emotional open");
  assert(!/overload state detected/i.test(out.reply), "no synthetic EN in HU reply");

  console.log("✓ presence-humanization-smoke passed");
  console.log(`  sample [${out.category}]: ${out.reply.slice(0, 120)}…`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
