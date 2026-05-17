/**
 * Fresh user immersion smoke (phases 47–54).
 */
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { clearSession, getSession } = require("../src/session/sessionStore");
const { buildGuideReply } = require("../src/handlers/guide");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function msg(text, id = "fresh_immersion") {
  return { text, from: { id, language_code: "hu" }, chat: { id } };
}

async function run() {
  const id = "fresh_immersion";
  clearSession(id);

  let r = await processIncomingMessage(msg("/start", id));
  assert(r.reply.includes("KaiZen aktiválva") || r.reply.includes("activated"), "activation");
  assert(r.reply.includes("motivációs") || r.reply.includes("motivational"), "identity lines");
  assert(r.reply.includes("kilógónak") || r.reply.includes("out of alignment"), "alignment ask");
  assert(!r.reply.includes("/energy"), "no command spam in activation");
  assert(r.reply.split("\n").length < 25, "not a wall");

  let s = getSession(id);
  assert(s.activationMode === true, "activation mode on");

  r = await processIncomingMessage(
    msg("Szia, túl sok minden egyszerre, kimerült vagyok, platformot építek", id)
  );
  assert(r.branch === "onboarding", "stays activation");
  assert(!/natural_conversation/i.test(JSON.stringify(r)), "no open branch");
  assert(s.preferredLanguage === "hu" || getSession(id).preferredLanguage === "hu", "HU lock");
  assert(
    /túlterhelés|overload|fáradtság|kimerül|Hallom|megvan a jel|kilógó/i.test(r.reply),
    `wow / grounded: ${r.reply.slice(0, 100)}`
  );

  const guide = buildGuideReply("hu", getSession(id));
  const sections = (guide.match(/^[⚔🧠📈💪🌘]/gm) || []).length;
  assert(sections <= 5, `guide max 5 sections (${sections})`);
  assert(guide.length < 600, "guide not encyclopedia");

  const personas = [
    ["confused", "nem értem mit csináljak most"],
    ["emotional", "nagyon egyedül érzem magam"],
    ["sarcastic", "oké szóval megint egy bot"],
    ["business", "platform launch és ügyfelek"],
    ["trader", "revenge trade után vagyok"],
    ["lost", "teljesen elvesztem a fókuszt"],
    ["athlete", "edzés után végre rendben vagyok"]
  ];

  for (const [label, text] of personas) {
    const pid = `fresh_${label}`;
    clearSession(pid);
    await processIncomingMessage(msg("/start", pid));
    const out = await processIncomingMessage(msg(text, pid));
    assert(out.branch === "onboarding", `${label} gated`);
    console.log(`✓ persona ${label}`);
  }

  console.log("\nFresh user experience smoke: passed.");
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
