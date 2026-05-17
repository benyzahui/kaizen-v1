/**
 * Phases 79–84 WOW experience smoke.
 */
const { pickDynamicOpening } = require("../src/companion/dynamicOpenings");
const { maybePresenceCallback } = require("../src/companion/presenceCallbacks");
const { buildAdaptiveEnergyRead } = require("../src/companion/adaptiveEnergy");
const { maybeMicroWow } = require("../src/companion/microWow");
const { maybeNaturalTransition } = require("../src/companion/naturalTransitions");
const { resolveCommandHint } = require("../src/companion/commandPresence");
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { buildEnergyFromOpenText } = require("../src/handlers/energyHandler");
const { clearSession, getSession } = require("../src/session/sessionStore");

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const ctx = {
    lang: "hu",
    state: { mentorMode: "sharp_focus", emotionalIntensity: 3, energyLevel: 6 },
    session: {
      onboardingCompleted: true,
      messages: [{}, {}],
      lastAt: Date.now() - 6 * 3600000,
      presenceMemory: { emotionalState: "focused", overloadActive: false }
    },
    lastUserText: "szia"
  };

  const open = pickDynamicOpening(ctx, "casual_greeting");
  assert(open && /Reggel|Mélység|blokk/i.test(open), "dynamic opening HU");

  const cb = maybePresenceCallback(
    {
      onboardingCompleted: true,
      messages: [{}, {}, {}],
      presenceMemory: {
        previousEmotionalState: "overloaded",
        emotionalState: "grounded",
        mission: "fókusz"
      },
      userPrimaryPath: "trading"
    },
    "hu",
    "natural_conversation",
    "t"
  );
  if (cb) assert(/káosz|széthúz|kevésbé/i.test(cb), "presence callback");

  const energy = buildAdaptiveEnergyRead(new Date(), "hu", {
    session: { userPrimaryPath: "trading", presenceMemory: { emotionalState: "stable" } },
    state: { energyLevel: 6, emotionalIntensity: 3 },
    userId: "t"
  });
  assert(energy && energy.length < 500, "adaptive energy compact");
  assert(/kattintás|setup|blokk|stabil/i.test(energy), "trader energy personal");

  let wow = null;
  for (let i = 0; i < 30 && !wow; i++) {
    wow = maybeMicroWow(
      { onboardingCompleted: true, messages: [{}, {}], microWowsUsed: [] },
      "hu",
      { emotionalIntensity: 6 },
      "túl sok minden egyszerre",
      "natural_conversation"
    );
  }
  assert(wow && wow.length < 200, "micro wow fires");

  const trans = maybeNaturalTransition(
    {
      onboardingCompleted: true,
      messages: [{}, {}, {}],
      lastCategory: "emotional_reflection"
    },
    "hu",
    "body_energy",
    "alvás"
  );
  if (trans) assert(trans.length < 80, "transition short");

  assert(
    resolveCommandHint("energy_question", "napi energia", {}, "/energy") === null,
    "no energy cmd hint"
  );

  const uid = "wow_user";
  clearSession(uid);
  const base = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    userPrimaryPath: "trading",
    lastAt: Date.now() - 5 * 3600000,
    presenceMemory: {
      emotionalState: "overloaded",
      previousEmotionalState: "overloaded",
      overloadActive: true
    },
    messages: [{ role: "user" }, { role: "assistant" }]
  };

  const out = await handleOpenConversation(
    { text: "nagyon stresszes vagyok", from: { id: uid }, chat: { id: uid } },
    "hu",
    base
  );
  assert(!/→\s*\//.test(out.reply), "no command arrows");
  assert(out.reply.length < 900, "reply bounded");

  const eBody = buildEnergyFromOpenText("mi a mai energia trading", "hu", uid);
  assert(eBody.length < 600, "open energy adaptive");

  console.log("✓ wow-experience-smoke passed");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
