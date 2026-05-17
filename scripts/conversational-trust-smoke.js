/**
 * Phases 93–98 — conversational trust scenarios.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { buildMicroEmotionalReply, maybeMicroReaction } = require("../src/companion/emotionalMicro");
const { shouldSkipAvoidanceMirror } = require("../src/core/seriousnessEngine");
const { getResponses } = require("../src/i18n/getResponses");

const SCENARIOS = [
  { label: "ashamed", text: "Szégyenlem hogy így érzem.", expect: /szégyen|soknak|érthető|kimond/i },
  { label: "exhausted", text: "Kimerült vagyok, nem bírom.", expect: /feszült|tartani|kimerül|kifogyás|nyomod/i },
  { label: "lost", text: "Elvesztem, nem tudom merre.", expect: /|/ },
  { label: "ambitious", text: "Nagy célom van, de szétesik a fókusz.", expect: /fókusz|energia|sáv/i },
  { label: "lonely", text: "Magányosnak érzem magam.", expect: /magány|emberi|kapcsolód/i },
  { label: "after_failure", text: "Ma megint elbukott a nap.", expect: /fáj|kudarc|csúszott/i },
  { label: "good_day", text: "Ma végre jó nap volt.", expect: /|/ },
  { label: "minimal_ok", text: "ok", expect: /|/ }
];

const JUDGMENT_RE =
  /(failed your discipline|you failed|no excuses|Hajrá\.|Five minutes\. Go|Nem táplálom a köröket)/i;
const THERAPY_RE = /(healing journey|inner child|validate your feelings|self-care routine)/i;

function assert(c, m) {
  if (!c) throw new Error(m);
}

async function runScenario(uid, row, lang = "hu") {
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    preferredLanguage: lang,
    lang,
    accountabilityMode: true
  };

  const out = await handleOpenConversation(
    { text: row.text, from: { id: uid }, chat: { id: uid } },
    lang,
    session
  );

  recordInteraction(uid, {
    text: row.text,
    reply: out.reply,
    lang,
    category: out.category
  });

  return out;
}

async function run() {
  const r = getResponses("hu");
  assert(r.emotionalRealism?.exhaustion?.length >= 2, "emotionalRealism HU");
  assert(r.naturalCheckbacks?.overload?.length >= 1, "naturalCheckbacks HU");
  assert(r.microReactions?.length >= 4, "microReactions HU");

  const shame = buildMicroEmotionalReply(
    "Szégyenlem hogy így érzem.",
    "hu",
    { messages: [{}] },
    "trust_unit"
  );
  assert(shame && shame.length < 220, "realism micro reply");

  assert(shouldSkipAvoidanceMirror("ok", "casual_talk"), "skip mirror on ok");
  assert(shouldSkipAvoidanceMirror("Kimerült vagyok.", "casual_talk"), "skip mirror exhausted");

  const results = [];
  for (const row of SCENARIOS) {
    const uid = `trust_${row.label}`;
    const out = await runScenario(uid, row);
    results.push({ ...row, category: out.category, reply: out.reply });

    assert(!JUDGMENT_RE.test(out.reply), `${row.label}: judgment tone`);
    assert(!THERAPY_RE.test(out.reply), `${row.label}: therapy tone`);
    assert(out.category !== "avoidance_mirror" || row.label === "minimal_ok", `${row.label}: harsh mirror`);
    if (row.expect.source !== "|") {
      assert(row.expect.test(out.reply), `${row.label}: expected tone missing`);
    }
  }

  const mirrors = results.filter((x) => x.category === "avoidance_mirror").length;
  assert(mirrors <= 1, `too many avoidance mirrors: ${mirrors}`);

  console.log("✓ conversational-trust-smoke passed");
  console.log(
    JSON.stringify(
      results.map((x) => ({ label: x.label, category: x.category, len: x.reply.length })),
      null,
      2
    )
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
