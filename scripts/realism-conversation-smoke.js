/**
 * Phase 70 — 50-message natural conversation realism (no commands).
 */
const { handleOpenConversation } = require("../src/handlers/openConversation");
const { clearSession, getSession, recordInteraction } = require("../src/session/sessionStore");

const MESSAGES = [
  { lang: "hu", text: "Most jöttem haza." },
  { lang: "hu", text: "Hosszú volt." },
  { lang: "hu", text: "Kimerült vagyok." },
  { lang: "hu", text: "Na." },
  { lang: "hu", text: "Túl sok minden egyszerre." },
  { lang: "hu", text: "Jó hogy ezt kimondtam." },
  { lang: "hu", text: "Ma este már nem akarok gondolkodni." },
  { lang: "hu", text: "lol az agyamban 9000 tab van" },
  { lang: "hu", text: "Megyek futni." },
  { lang: "hu", text: "Visszajöttem." },
  { lang: "en", text: "Just got home." },
  { lang: "en", text: "Rough day honestly." },
  { lang: "en", text: "I'm exhausted." },
  { lang: "en", text: "Too much at once." },
  { lang: "en", text: "ok" },
  { lang: "en", text: "thanks" },
  { lang: "en", text: "my brain has too many tabs open lol" },
  { lang: "en", text: "going for a walk" },
  { lang: "en", text: "back" },
  { lang: "en", text: "feeling a bit clearer now" },
  { lang: "ro", text: "Tocmai am ajuns acasă." },
  { lang: "ro", text: "Zi grea." },
  { lang: "ro", text: "Sunt epuizat." },
  { lang: "ro", text: "Prea multe deodată." },
  { lang: "ro", text: "hm" },
  { lang: "hu", text: "Szégyenlem hogy ilyen lassan megy." },
  { lang: "hu", text: "Frusztrált vagyok." },
  { lang: "en", text: "I feel ashamed I move so slow." },
  { lang: "en", text: "Frustrated." },
  { lang: "hu", text: "Vége a napnak." },
  { lang: "en", text: "Done for today." },
  { lang: "hu", text: "Épp most értem haza a boltból." },
  { lang: "en", text: "Well." },
  { lang: "en", text: "Not sure what I need." },
  { lang: "hu", text: "Nem tudom mit csináljak." },
  { lang: "hu", text: "Na szóval." },
  { lang: "en", text: "So yeah." },
  { lang: "ro", text: "Gata cu ziua." },
  { lang: "hu", text: "Kicsit jobb most." },
  { lang: "en", text: "A bit better." },
  { lang: "hu", text: "Nagyon stresszes volt ma." },
  { lang: "en", text: "Very stressed today." },
  { lang: "hu", text: "Szét vagyok csúszva." },
  { lang: "en", text: "Can't focus at all." },
  { lang: "hu", text: "Most jöttem." },
  { lang: "en", text: "Just got back." },
  { lang: "ro", text: "Na?" },
  { lang: "hu", text: "Hallgatlak." },
  { lang: "en", text: "Yeah I'm here." },
  { lang: "hu", text: "Este már csak csend kellene." }
];

function assert(c, m) {
  if (!c) throw new Error(m);
}

function coachScore(reply) {
  const r = String(reply || "");
  let s = 0;
  if (/\b(one lane|one block|protocol|framework|stabiliz|huszonöt|twenty.?five minutes)\b/i.test(r))
    s += 2;
  if (/\n\n/.test(r)) s += 2;
  if ((r.match(/\?/g) || []).length > 1) s += 1;
  if (r.length > 500) s += 2;
  if (/→\s*\//.test(r)) s += 3;
  return s;
}

async function run() {
  const uid = "realism_50";
  clearSession(uid);
  let session = {
    ...getSession(uid),
    onboardingCompleted: true,
    lang: "hu",
    preferredLanguage: "hu"
  };

  const stats = {
    total: 0,
    overCoach: 0,
    commandHints: 0,
    longReplies: 0,
    repeats: new Set(),
    categories: {}
  };

  for (let i = 0; i < MESSAGES.length; i++) {
    const m = MESSAGES[i];
    session.preferredLanguage = m.lang;
    session.lang = m.lang;

    const out = await handleOpenConversation(
      { text: m.text, from: { id: uid }, chat: { id: uid } },
      m.lang,
      session
    );

    stats.total++;
    stats.categories[out.category] = (stats.categories[out.category] || 0) + 1;
    if (coachScore(out.reply) >= 2) stats.overCoach++;
    if (/→\s*\//.test(out.reply)) stats.commandHints++;
    if (out.reply.length > 450) stats.longReplies++;
    stats.repeats.add(out.reply.slice(0, 60));

    recordInteraction(uid, {
      text: m.text,
      reply: out.reply,
      lang: m.lang,
      category: out.category
    });
    session = getSession(uid);
    session.onboardingCompleted = true;
  }

  const home = await handleOpenConversation(
    { text: "Most jöttem haza.", from: { id: uid }, chat: { id: uid } },
    "hu",
    { ...getSession(uid), onboardingCompleted: true, preferredLanguage: "hu" }
  );
  assert(
    /Na|Haza|Milyen|nap|volt|How was|Cum a fost/i.test(home.reply),
    `home flow should converse not coach: ${home.reply.slice(0, 80)}`
  );
  assert(!/→\s*\//.test(home.reply), "home flow no commands");
  assert(home.category === "life_flow", "home is life_flow");

  assert(stats.commandHints <= 2, `command hints in natural talk: ${stats.commandHints}`);
  assert(stats.overCoach <= 18, `over-coaching replies: ${stats.overCoach}/${stats.total}`);
  assert(stats.longReplies <= 8, `too long: ${stats.longReplies}`);
  assert(stats.repeats.size >= 20, `too repetitive: unique openings ${stats.repeats.size}`);

  console.log("✓ realism-conversation-smoke (50 msgs)");
  console.log(`  categories: ${JSON.stringify(stats.categories)}`);
  console.log(`  overCoach: ${stats.overCoach}, long: ${stats.longReplies}, cmds: ${stats.commandHints}`);
  console.log(`  unique reply prefixes: ${stats.repeats.size}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
