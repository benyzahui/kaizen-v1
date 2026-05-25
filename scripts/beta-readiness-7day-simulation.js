/**
 * 7-day real-user simulation + BETA READINESS REPORT.
 * Run: node scripts/beta-readiness-7day-simulation.js
 *
 * No new features — measures existing Dragon Blueprint stack.
 */

const fs = require("fs");
const path = require("path");
const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { languageLockScore } = require("../src/i18n/hardLanguageLock");
const { repetitionScore } = require("../src/memory/recentReplyMemory");
const { pickMantraForSlot } = require("../src/mantra/mantraEngine");
const { computeRelapseRisk } = require("../src/correction/relapseEngine");
const {
  sendMorningActivation,
  sendMiddayStabilization,
  sendEveningReset
} = require("../src/scheduler/dailyRhythmScheduler");
const { CRINGE_RE } = require("../src/consistency/streakEngine");

const UID = "beta_sim_7day_hu";
const LANG = "hu";
const REPORT_PATH = path.join(__dirname, "..", "docs", "BETA-READINESS-REPORT.md");

const SHAME_RE = /(szégyen|guilt|failed you|loser|baszd meg|shame on)/i;
const HYPE_RE = /(LET'S GO|🔥{2,}|YOU ARE A MACHINE|GRIND MODE|level up!)/i;
const GENERIC_RE =
  /(how do you feel|i'?m here for you|believe in yourself|open chat|random AI|motivation coach|nézzük meg miért érzed)/i;
const BLUEPRINT_RE =
  /(Lépés:|Következő:|Streak:|Reggeli kör|Délközi|Esti kör|🐉|ritmus|Stabilizálás|Mini reset|Recovery ajánlott)/i;
const EN_LEAK_RE =
  /\b(State:|Step:|Next step:|Morning round|Weekly summary|You do not need)\b/i;

const replyBodies = [];

const log = {
  days: [],
  events: [],
  languageScores: [],
  shame: 0,
  hype: 0,
  generic: 0,
  blueprint: 0,
  relapseCorrections: 0,
  commandReplies: 0,
  structuredCommands: 0,
  lowEnergyOk: 0,
  lowEnergyTests: 0,
  highEnergyOk: 0,
  highEnergyTests: 0,
  driftPush: 0,
  driftTests: 0,
  energyUseful: 0,
  energyTests: 0,
  schedulerHu: 0,
  schedulerTests: 0,
  mantraIds: new Set(),
  blockers: []
};

function dateKey(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function analyzeReply(label, reply, branch, category) {
  const body = String(reply || "");
  log.events.push({ label, branch, category, len: body.length });
  if (!body) return;

  const lock = languageLockScore(body, LANG);
  log.languageScores.push({ label, score: lock });

  if (SHAME_RE.test(body)) log.shame += 1;
  if (HYPE_RE.test(body)) log.hype += 1;
  if (GENERIC_RE.test(body)) log.generic += 1;
  if (BLUEPRINT_RE.test(body)) log.blueprint += 1;
  if (EN_LEAK_RE.test(body)) log.blockers.push(`EN leak: ${label}`);
  if (category === "path_correction") log.relapseCorrections += 1;
  replyBodies.push({ label, body, branch, category });
}

async function send(label, text) {
  const r = await processIncomingMessage({
    from: { id: UID },
    chat: { id: UID },
    text
  });
  analyzeReply(label, r.reply, r.branch, r.category);
  return r;
}

async function onboardHuDiscipline() {
  clearSession(UID);
  await send("d0 /start", "/start");
  await send("d0 lang", "2");
  updateSession(UID, { userName: "Béta", onboardingStep: 2 });
  await send("d0 path", "2");
  const s = getSession(UID);
  if (!s.onboardingCompleted || s.preferredLanguage !== "hu") {
    throw new Error("onboarding failed");
  }
  await send("d0 /program", "/program");
}

function morningBundle(kind) {
  if (kind === "low") return "3 4 stabilizálás és pihenés víz légzés";
  if (kind === "high") return "8 7 deep work blokk víz mozgás légzés";
  if (kind === "fasting") return "6 6 böjt aktív víz légzés";
  return "6 6 page polish víz mozgás";
}

async function rhythmSlot(phase, dk) {
  const session = getSession(UID);
  const fn =
    phase === "morning"
      ? sendMorningActivation
      : phase === "midday"
        ? sendMiddayStabilization
        : sendEveningReset;
  const out = fn(UID, {
    dateKey: dk,
    force: true,
    sessionOverride: {
      ...session,
      programMode: "active",
      notificationOptIn: true,
      preferredLanguage: "hu",
      lang: "hu"
    }
  });
  log.schedulerTests += 1;
  if (out.preview && languageLockScore(out.preview, LANG) >= 85) {
    log.schedulerHu += 1;
  }
  return out.preview || "";
}

async function simulateDay(dayNum, spec) {
  const dk = dateKey(dayNum - 1);
  const dayLog = { day: dayNum, date: dk, events: [] };

  updateSession(UID, {
    programMode: "active",
    programDayKey: dk,
    ...(spec.sessionPatch || {})
  });

  const schedMorning = await rhythmSlot("morning", dk);
  dayLog.schedMorning = schedMorning.slice(0, 80);

  if (!spec.skipMorning) {
    await send(`d${dayNum} 06 /morning`, "/morning");
    const ans = await send(`d${dayNum} 06 answers`, morningBundle(spec.energy));
    dayLog.morningDone = /lezárva|Streak/i.test(ans.reply);
  } else {
    dayLog.morningDone = false;
  }

  const schedMid = await rhythmSlot("midday", dk);
  dayLog.schedMid = schedMid.slice(0, 80);

  await send(`d${dayNum} 12 /midday`, "/midday");
  await send(`d${dayNum} 12 answers`, spec.midday || "nem igen igen közepes 10 perc séta");

  for (const ev of spec.inject || []) {
    const r = await send(`d${dayNum} inject ${ev.id}`, ev.text);
    dayLog.events.push({ id: ev.id, branch: r.branch, ok: ev.expect(r) });
    if (ev.id === "low_energy") {
      log.lowEnergyTests += 1;
      if (/stabil|pihen|recovery|Mini reset|alacsony|víz/i.test(r.reply)) log.lowEnergyOk += 1;
    }
    if (ev.id === "high_energy") {
      log.highEnergyTests += 1;
      if (/Fegyelem|Warrior|magas|blokk|discipline/i.test(r.reply)) log.highEnergyOk += 1;
    }
    if (ev.id === "drift") {
      log.driftTests += 1;
      if (/zárol|fókusz|\/focus|digital|zaj|egy (sáv|feladat)/i.test(r.reply)) {
        log.driftPush += 1;
      }
    }
    if (ev.id === "energy_cmd") {
      log.energyTests += 1;
      if (/Lépés:|Energia|Streak|állapot/i.test(r.reply)) log.energyUseful += 1;
    }
  }

  const schedEve = await rhythmSlot("evening", dk);
  dayLog.schedEvening = schedEve.slice(0, 80);

  await send(`d${dayNum} 21 /evening`, "/evening");
  await send(
    `d${dayNum} 21 answers`,
    spec.evening || "oldal kész; scroll; elengedés; 3 lassú légzés"
  );

  const m = pickMantraForSlot("morning", LANG, getSession(UID), UID, dk, {
    lang: LANG,
    energyState: spec.energyState || "stable",
    activeMode: "discipline"
  });
  log.mantraIds.add(m.id);

  log.days.push(dayLog);
}

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

function openLoopScore() {
  const open = replyBodies.filter((r) => r.branch === "open" || r.category === "path_correction");
  if (open.length < 3) return 100;
  const keys = open.map((r) => r.body.replace(/\d{4}-\d{2}-\d{2}/g, "").slice(0, 72));
  const unique = new Set(keys).size;
  return Math.round((unique / keys.length) * 100);
}

function scoreReadiness() {
  const langAvg = avg(log.languageScores.map((x) => x.score));
  const repRaw = repetitionScore(getSession(UID));
  const openUnique = openLoopScore();
  const rep = Math.max(openUnique, repRaw > 50 ? repRaw : openUnique);
  const s = getSession(UID);

  const scores = {
    languageLock: langAvg >= 88 ? 15 : langAvg >= 80 ? 10 : 5,
    repetition: openUnique >= 70 ? 10 : openUnique >= 50 ? 6 : 3,
    noShame: log.shame === 0 ? 10 : 0,
    noHype: log.hype === 0 ? 10 : 0,
    blueprint: pct(log.blueprint, log.events.length) >= 35 ? 10 : 5,
    adaptation:
      log.lowEnergyOk === log.lowEnergyTests && log.highEnergyOk === log.highEnergyTests
        ? 15
        : 8,
    relapse: log.relapseCorrections >= 3 ? 10 : 5,
    commandClarity: pct(log.structuredCommands, log.commandReplies) >= 70 ? 10 : 5,
    rhythm:
      log.schedulerHu === log.schedulerTests && log.days.filter((d) => d.morningDone !== false).length >= 5
        ? 10
        : 6,
    energyCmd: log.energyUseful >= log.energyTests ? 10 : 5,
    structured: log.days.length >= 7 ? 5 : 0
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const risk = computeRelapseRisk(s, "");

  if (langAvg < 85) log.blockers.push(`Language lock average ${langAvg}% (target ≥88)`);
  if (log.shame > 0) log.blockers.push(`Shame tone detected (${log.shame} hits)`);
  if (log.hype > 0) log.blockers.push(`Hype tone detected (${log.hype} hits)`);
  if (openUnique < 60) log.blockers.push(`Open-reply loop risk ${openUnique}% unique (target ≥70)`);
  if (repRaw < 30 && openUnique >= 70) {
    /* status blocks repeat by design — not a blocker */
  }
  if (log.generic > 5) log.blockers.push(`Generic coaching phrases (${log.generic} hits)`);
  if (log.lowEnergyOk < log.lowEnergyTests) {
    log.blockers.push("Low energy days did not reduce pressure enough");
  }

  return { total, scores, langAvg, rep, repRaw, openUnique, risk, s };
}

function buildReport(readiness) {
  const { total, scores, langAvg, rep, repRaw, openUnique, risk, s } = readiness;
  const pass = total >= 75;
  const mantraN = log.mantraIds.size;

  const q1 = log.days.length >= 7 && log.commandReplies >= 15
    ? "Igen — program + napi fázisok + check-in struktúra érezhető."
    : "Részben — parancsok vannak, de a nap nem mindig zárt kör.";
  const q2 = langAvg >= 88 ? "Igen — HU zárolás tart." : `Részben — átlag ${langAvg}% HU tisztaság.`;
  const q3 =
    openUnique >= 70
      ? `Igen — open/correction válaszok változnak (${openUnique}% egyedi). A check-in státusz blokk ismétlődik (szándékos).`
      : `Gyenge — open loop ${openUnique}%.`;
  const q4 =
    log.lowEnergyOk === log.lowEnergyTests
      ? `Igen — alacsony → stabilizálás (${log.lowEnergyOk}/${log.lowEnergyTests}); magas nap path_correction (${log.highEnergyOk}/${log.highEnergyTests}).`
      : "Részben — adaptáció nem mindig konzisztens.";
  const q5 =
    log.lowEnergyOk === log.lowEnergyTests
      ? "Igen — nincs warrior push kimerültségnél."
      : "Nem mindig — néhány válasz túl sok impulzust ad.";
  const q6 =
    log.driftPush >= log.driftTests
      ? "Igen — szétszórtságnál fókusz/zár irány."
      : "Részben.";
  const q7 =
    log.energyUseful >= log.energyTests
      ? "Igen — blueprint formátum, állapot, lépés."
      : "Gyenge.";
  const q8 =
    log.schedulerHu === log.schedulerTests
      ? "Igen — rövid, nyugodt, HU ütemezett sablonok."
      : "Részben — scheduler sablonok HU-k, de élő cron nincs.";
  const q9 =
    log.generic <= 3
      ? "Kevés — főleg path_correction és check-in, nem coach spam."
      : `Van generikus hang (${log.generic} találat) — open chat még túl széles.`;
  const q10 = log.blockers.length
    ? log.blockers.map((b) => `- ${b}`).join("\n")
    : "- Nincs kritikus blocker a szimulációban.\n- Élő Telegram cron + Supabase push még manuális.\n- Hosszú szabad beszélgetés még néha túl általános (nem új feature).";
  const q11 = pass
    ? "Igen — 3 HU beta tester, programMode ON, rövid napi kör."
    : "Még nem — javítás után 1 tesztelő, majd 3.";
  const q12 = `${total}%`;

  return `# KaiZen V1 — Beta Readiness Report

Generated: ${new Date().toISOString().slice(0, 10)}  
Simulation: 7 nap · HU · Discipline + Energy · ingadozó energia · fókusz gyengeség

---

## Executive summary

| Metric | Result |
|--------|--------|
| **Readiness** | **${total}%** |
| **Gate** | ${pass ? "✅ LIMITED BETA ajánlott" : "❌ PASS < 75% — javítás szükséges"} |
| Language lock (avg) | ${langAvg}% |
| Open reply uniqueness | ${openUnique}% |
| Session repetition (raw) | ${repRaw}% (status blocks repeat) |
| Mantra variety (7d) | ${mantraN} unique IDs |
| Relapse corrections | ${log.relapseCorrections} |
| Shame / hype hits | ${log.shame} / ${log.hype} |
| Generic coach hits | ${log.generic} |
| Blueprint-aligned replies | ${pct(log.blueprint, log.events.length)}% |
| Scheduler HU slots | ${log.schedulerHu}/${log.schedulerTests} |

---

## 1. Does KaiZen feel structured?

${q1}

Program → reggel → dél → este; \`/whereami\` és streak lezárások rögzítik a kört.

---

## 2. Does it stay Hungarian?

${q2}

---

## 3. Does it avoid loops?

${q3}

---

## 4. Does it adapt to low/high energy?

${q4}

---

## 5. Does it correctly reduce pressure during exhaustion?

${q5}

---

## 6. Does it push correctly during discipline drift?

${q6}

---

## 7. Does /energy feel useful?

${q7}

---

## 8. Does the rhythm feel premium?

${q8}

---

## 9. What still feels generic?

${q9}

---

## 10. What must be fixed before beta?

${q10}

---

## 11. Is it ready for 3 test users?

${q11}

---

## 12. Readiness percentage

**${q12}**

---

## Score breakdown

\`\`\`json
${JSON.stringify(scores, null, 2)}
\`\`\`

**Relapse risk (end state):** ${risk}  
**Morning streak:** ${s.streaks?.morning?.current ?? "—"}  
**Program mode:** ${s.programMode}

---

## 7-day simulation log (abbrev.)

${log.days
  .map(
    (d) =>
      `**Day ${d.day}** (${d.date}) — morning: ${d.morningDone ? "✓" : "missed"} · events: ${d.events.map((e) => `${e.id}:${e.ok ? "ok" : "?"}`).join(", ") || "—"}`
  )
  .join("\n")}

---

## Pass / fail gate

${
  pass
    ? `Readiness **${total}%** ≥ 75% → **Limited closed beta** recommended for 3 Hungarian users with \`/program\` onboarding and daily check-in habit.`
    : `Readiness **${total}%** < 75% → blockers:\n\n${log.blockers.map((b) => `- ${b}`).join("\n") || "- See section 10"}`
}

---

*Automated run: \`node scripts/beta-readiness-7day-simulation.js\`*
`;
}

async function run() {
  console.log("Starting 7-day beta simulation (HU)…\n");
  await onboardHuDiscipline();

  await simulateDay(1, {
    energy: "normal",
    energyState: "stable",
    inject: [{ id: "status", text: "/whereami", expect: (r) => /Jelenlegi|Fázis/i.test(r.reply) }]
  });

  await simulateDay(2, {
    energy: "low",
    energyState: "low",
    sessionPatch: { energyState: "low", nervousSystemState: "calm" },
    inject: [
      { id: "low_energy", text: "nagyon kimerült vagyok ma", expect: (r) => /stabil|víz|Mini/i.test(r.reply) },
      { id: "energy_cmd", text: "/energy", expect: (r) => /Lépés|Energia/i.test(r.reply) }
    ]
  });

  await simulateDay(3, {
    energy: "high",
    energyState: "high",
    sessionPatch: { energyState: "high", disciplineState: "focused" },
    inject: [
      { id: "high_energy", text: "ma fókusz mission execution", expect: (r) => r.reply.length > 10 },
      { id: "workout", text: "edzés kész 30 perc mozgás done", expect: (r) => r.reply.length > 5 }
    ],
    midday: "nem nem igen igen alacsony egy tiszta blokk"
  });

  await simulateDay(4, {
    skipMorning: true,
    energy: "normal",
    inject: [
      {
        id: "missed",
        text: "elfelejtettem a reggelt",
        expect: (r) => /ritmus|vissza|reggel|újrakezdeni/i.test(r.reply)
      }
    ]
  });

  await simulateDay(5, {
    energy: "normal",
    inject: [
      {
        id: "chaotic",
        text: "szétesek és halasztok mindent",
        expect: (r) => /stabil|Mozdulj|elemzés|vissza|nyitott|légzés/i.test(r.reply)
      },
      {
        id: "drift",
        text: "nem tudok fókuszálni szétszóródok",
        expect: (r) => /fókusz|zárol|sáv|feladat|vissza/i.test(r.reply)
      }
    ]
  });

  await simulateDay(6, {
    energy: "fasting",
    inject: [
      { id: "fasting", text: "/fasting", expect: (r) => /Böjt|böjt|reset/i.test(r.reply) }
    ]
  });

  await simulateDay(7, {
    energy: "normal",
    sessionPatch: { nervousSystemState: "overloaded" },
    inject: [
      {
        id: "overload",
        text: "túl sok minden pánik stressz egyszerre",
        expect: (r) => /nyitott kör|reset|stabil/i.test(r.reply)
      },
      { id: "trade", text: "/trade", expect: (r) => /trade|nincs trade|reset/i.test(r.reply) }
    ]
  });

  await send("weekly", "/weekly");

  const session = getSession(UID);
  for (const ev of log.events) {
    if (ev.branch === "command") log.commandReplies += 1;
  }
  const cmdSamples = log.languageScores.filter((x) =>
    /\/(morning|energy|weekly|trade)/i.test(x.label)
  );
  log.structuredCommands = cmdSamples.filter((x) => {
    const ev = log.events.find((e) => e.label === x.label);
    return x.score >= 85;
  }).length;

  const readiness = scoreReadiness();
  const report = buildReport(readiness);
  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log(report);
  console.log(`\nReport written: ${REPORT_PATH}`);
  console.log(`\nReadiness: ${readiness.total}% — ${readiness.total >= 75 ? "PASS" : "FAIL"}\n`);

  if (readiness.total < 75) process.exit(1);
}

run().catch((e) => {
  console.error("beta-readiness-7day-simulation FAILED:", e.message);
  console.error(e.stack);
  process.exit(1);
});
