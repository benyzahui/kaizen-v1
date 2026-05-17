/**
 * Phases 127–128 — real companion relationship scenarios.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { tryRelationalStay } = require("../src/companion/relationshipPresence");
const { SELF_HELP_RE } = require("../src/companion/relationshipPresence");

const SCENARIOS = [
  { text: "Most csak kifáradtam.", expectRelational: true },
  { text: "Túl sok minden fut.", tag: "stress" },
  { text: "Magányos vagyok.", tag: "lonely" },
  { text: "Nagy cél, szétesik.", tag: "ambition" },
  { text: "Nem tudom mi van velem.", tag: "confusion" },
  { text: "Holnap megcsinálom.", tag: "discipline" },
  { text: "Túlgondolom megint.", tag: "overthink" },
  { text: "Ma pihenek.", tag: "recovery" }
];

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function run() {
  const stay = tryRelationalStay(
    "Most csak kifáradtam.",
    "hu",
    { onboardingCompleted: true, messages: [{}, {}] },
    "rel_unit"
  );
  assert(stay && stay.category === "relational_flow", "relational stay");

  const uid = "rel_companion";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    lang: "hu",
    preferredLanguage: "hu"
  };

  const log = [];
  for (let i = 0; i < 40; i++) {
    const row = SCENARIOS[i % SCENARIOS.length];
    const out = await handleOpenConversation(
      { text: row.text, from: { id: uid }, chat: { id: uid } },
      "hu",
      session
    );
    recordInteraction(uid, {
      text: row.text,
      reply: out.reply,
      lang: "hu",
      category: out.category
    });
    log.push({ ...row, category: out.category, reply: out.reply, len: out.reply.length });
    session = getSession(uid);
    session.onboardingCompleted = true;

    assert(!SELF_HELP_RE.test(out.reply), `${row.tag || "rel"}: self-help tone`);
    assert(!/→\s*\//.test(out.reply), `${row.tag || "rel"}: command`);
    assert(!/\d{1,2}:\d{2}/.test(out.reply), `${row.tag || "rel"}: timestamp creep`);
  }

  const relational = log.filter((x) => x.category === "relational_flow").length;
  const comfort = log.filter((x) =>
    /érthető|kifárad|megoldanod|embertelen/i.test(x.reply)
  ).length;
  const continuity = log.filter((x) =>
    /múltkor|tegnap|nyugodtabb|feszültebb|pár napja/i.test(x.reply)
  ).length;

  console.log("✓ companion-relationship-smoke passed");
  console.log(
    JSON.stringify(
      {
        messages: log.length,
        relationalFlow: relational,
        comfortHits: comfort,
        continuityHits: continuity,
        unique: new Set(log.map((x) => x.reply.slice(0, 45))).size
      },
      null,
      2
    )
  );

  assert(relational >= 1, "expected relational_flow");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
