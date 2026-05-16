/**
 * Phases 26–33 human flow smoke test.
 */
const { applyHumanVoiceGuard } = require("../src/companion/humanVoiceGuard");
const { tryThreadReturnReply, extractThreadActivity } = require("../src/companion/threadContinuityEngine");
const { resolveContextualEnergyLens, depletedEnergyOverlay } = require("../src/companion/contextualEnergy");
const { buildEnergyRead } = require("../src/companion/energyEngine");
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { recordInteraction, clearSession, getSession } = require("../src/session/sessionStore");
const { analyzeUserState } = require("../src/core/responseEngine");

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const guarded = applyHumanVoiceGuard(
    "The move is already obvious.\nTruth has arrived.",
    "en",
    "t"
  );
  assert(!/obvious|Truth has arrived/i.test(guarded), "AI poetic stripped");

  const act = extractThreadActivity("futni megyek");
  assert(act?.type === "run", "run activity");

  const thread = tryThreadReturnReply(
    { lastThreadActivity: { type: "run", at: Date.now() - 60000 } },
    "visszajöttem",
    "hu"
  );
  assert(thread?.body && /fej|zajos|könnyebb|Futás/i.test(thread.body), "HU thread return");

  const tired = analyzeUserState("kimerült vagyok", { messages: [] }, "body_energy");
  assert(resolveContextualEnergyLens({}, tired, "general") === "body", "tired → body lens");
  const depleted = depletedEnergyOverlay("hu");
  assert(depleted.includes("stabilizálj"), "depleted HU overlay");

  const personas = [
    { id: "p1", lang: "en", text: "platform chaos, everything breaking", label: "entrepreneur" },
    { id: "p2", lang: "en", text: "I feel alone tonight", label: "lonely" },
    { id: "p3", lang: "en", text: "finished training, feeling good", label: "athlete" },
    { id: "p4", lang: "en", text: "revenge trade urge after loss", label: "trader" },
    { id: "p5", lang: "en", text: "what is the point of all this discipline", label: "meaning" },
    { id: "p6", lang: "en", text: "lol my brain has 9000 tabs", label: "sarcastic" },
    { id: "p7", lang: "hu", text: "nagyon stresszes vagyok, szét esem", label: "HU emotional" },
    { id: "p8", lang: "ro", text: "sunt epuizat, prea multe proiecte", label: "RO practical" },
    { id: "p9", lang: "en", text: "need to close one client deal today", label: "business" },
    { id: "p10", lang: "en", text: "ok", label: "minimal" }
  ];

  for (const p of personas) {
    clearSession(p.id);
    const base = {
      ...getSession(p.id),
      onboardingCompleted: true,
      lang: p.lang,
      preferredLanguage: p.lang
    };
    const out = await handleOpenConversation(
      { text: p.text, from: { id: p.id }, chat: { id: p.id } },
      p.lang,
      base
    );
    assert(out.reply.length > 5 && out.reply.length < 1400, `${p.label} length`);
    assert(!/Truth has arrived|Intensity without container/i.test(out.reply), `${p.label} no AI poetry`);
    recordInteraction(p.id, {
      text: p.text,
      reply: out.reply,
      lang: p.lang,
      category: out.category
    });
    console.log(`✓ ${p.label} [${out.category}]`);
  }

  const tid = "thread_user";
  clearSession(tid);
  let s = {
    ...getSession(tid),
    onboardingCompleted: true,
    lang: "hu",
    preferredLanguage: "hu"
  };
  const outRun = await handleOpenConversation(
    { text: "futni megyek", from: { id: tid }, chat: { id: tid } },
    "hu",
    s
  );
  recordInteraction(tid, {
    text: "futni megyek",
    reply: outRun.reply,
    lang: "hu",
    category: outRun.category
  });
  s = getSession(tid);
  assert(s.lastThreadActivity?.type === "run", "session stores run thread");
  const back = await handleOpenConversation(
    { text: "visszajöttem", from: { id: tid }, chat: { id: tid } },
    "hu",
    s
  );
  assert(back.category === "thread_continuity", "thread continuity category");
  assert(/fej|zajos|könnyebb|Na/i.test(back.reply), "thread reply contextual");

  console.log("\nHuman flow smoke: all passed.");
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
