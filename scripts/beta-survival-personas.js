/**
 * Phase 190 — multi-persona beta survival simulation.
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");
const { clearPatternState } = require("../src/conversation/patternMemory");

const PERSONAS = [
  {
    id: "entrepreneur",
    msgs: [
      "Túl sok meeting, szétesik a nap.",
      "trade előtt vagyok",
      "Holnap megcsinálom a blokkot",
      "Na"
    ]
  },
  {
    id: "lonely",
    msgs: ["Magányos este.", "Senki nincs itt.", "ok", "Kösz hogy válaszolsz"]
  },
  {
    id: "athlete",
    msgs: ["Edzés után jobb.", "De még üres.", "Megcsináltam a setet", "Pihenek"]
  },
  {
    id: "trader",
    msgs: ["Pre-market ideges.", "Vissza. Nem léptem be.", "Túl sok inger", "ok"]
  },
  {
    id: "emotional",
    msgs: ["Nem bírom.", "Félek.", "Szégyenlem.", "Kicsit jobb"]
  },
  {
    id: "skeptic",
    msgs: ["Ez csak egy bot ugye?", "Mindegy.", "lol", "Na jó"]
  },
  {
    id: "sarcastic",
    msgs: ["Nagyszerű nap megint.", "lol 9000 tab", "Biztos vagy?", "ok"]
  },
  {
    id: "quiet",
    msgs: ["Na.", "ok", "Hm.", "Szia"]
  }
];

const BAD_RE =
  /\b(overload state|you should try|let me suggest|as an AI|chatbot|no excuses|te vagy gyenge)\b/i;

async function run() {
  const results = [];

  for (const persona of PERSONAS) {
    const uid = `persona_${persona.id}`;
    clearSession(uid);
    clearPatternState(uid);
    let session = {
      ...getSession(uid),
      onboardingCompleted: true,
      preferredLanguage: "hu",
      lang: "hu"
    };

    const replies = [];
    for (const text of persona.msgs) {
      const out = await handleOpenConversation(
        { text, from: { id: uid }, chat: { id: uid } },
        "hu",
        session
      );
      if (BAD_RE.test(out.reply)) {
        throw new Error(`${persona.id}: bad line — ${out.reply.slice(0, 60)}`);
      }
      recordInteraction(uid, {
        text,
        reply: out.reply,
        lang: "hu",
        category: out.category
      });
      replies.push({ text, category: out.category, len: out.reply.length, reply: out.reply });
      session = getSession(uid);
      session.onboardingCompleted = true;
    }

    results.push({
      persona: persona.id,
      avgLen: Math.round(replies.reduce((s, r) => s + r.len, 0) / replies.length),
      categories: replies.map((r) => r.category)
    });
  }

  console.log("✓ beta-survival-personas passed");
  console.log(JSON.stringify({ personas: results }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
