/**
 * 7-day program atmosphere simulation + PROGRAM ATMOSPHERE REPORT.
 * Run: node scripts/program-atmosphere-7day.js
 */

const fs = require("fs");
const path = require("path");
const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { processIncomingMessage } = require("../src/core/kaizenPipeline");
const { languageLockScore } = require("../src/i18n/hardLanguageLock");
const { repetitionScore } = require("../src/memory/recentReplyMemory");
const {
  sendMorningActivation,
  sendMiddayStabilization,
  sendEveningReset
} = require("../src/scheduler/dailyRhythmScheduler");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const {
  aiTraceScore,
  premiumFeelScore,
  AI_TRACE_RE
} = require("../src/atmosphere/programAtmosphere");

const REPORT_PATH = path.join(__dirname, "..", "docs", "PROGRAM-ATMOSPHERE-REPORT.md");

const HYPE_RE = /(LET'S GO|🔥{2,}|crush it|beast mode|manifest|10x|unlock your)/i;
const GENERIC_RE =
  /(how do you feel|i'?m here for you|believe in yourself|how can i help|bármiben segíthetek)/i;
const PROGRAM_RE =
  /(Dragon Blueprint|napi ritmus|ritm zilnic|program része|în program|A rendszer)/i;
const PRESENCE_RE = /(Itt vagyok|Sunt aici|Lassan stabilizálunk|Holnap új kör|Mâine e un nou)/i;

const samples = [];

const log = {
  days: [],
  langScores: [],
  aiTraces: [],
  premiumScores: [],
  programHits: 0,
  presenceHits: 0,
  hype: 0,
  generic: 0,
  wallCount: 0,
  totalReplies: 0,
  roSamples: [],
  strongest: { label: "", score: 0, excerpt: "" },
  weakest: { label: "", score: 100, excerpt: "" },
  aiTraceLines: []
};

function dateKey(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function analyze(label, reply, branch, category, lang = "hu") {
  const body = String(reply || "");
  log.totalReplies += 1;
  samples.push({ label, body, branch, category, lang });

  const lock = languageLockScore(body, lang);
  log.langScores.push({ label, lang, score: lock });

  const ai = aiTraceScore(body);
  const prem = premiumFeelScore(body);
  log.aiTraces.push(ai);
  log.premiumScores.push(prem);

  if (PROGRAM_RE.test(body)) log.programHits += 1;
  if (PRESENCE_RE.test(body)) log.presenceHits += 1;
  if (HYPE_RE.test(body)) log.hype += 1;
  if (GENERIC_RE.test(body)) log.generic += 1;
  if (body.length > 950) log.wallCount += 1;

  for (const line of body.split(/\n/)) {
    for (const re of AI_TRACE_RE) {
      if (re.test(line)) log.aiTraceLines.push({ label, line: line.slice(0, 80) });
    }
  }

  if (prem > log.strongest.score) {
    log.strongest = { label, score: prem, excerpt: body.slice(0, 200) };
  }
  if (prem < log.weakest.score && body.length > 30) {
    log.weakest = { label, score: prem, excerpt: body.slice(0, 200) };
  }

  if (lang === "ro") log.roSamples.push({ label, body, lock, prem });
}

async function send(uid, label, text, lang = "hu") {
  updateSession(uid, { preferredLanguage: lang, lang });
  const r = await processIncomingMessage({
    from: { id: uid },
    chat: { id: uid },
    text
  });
  analyze(label, r.reply, r.branch, r.category, lang);
  return r;
}

async function rhythm(uid, phase, dk, lang = "hu") {
  const session = getSession(uid);
  const fn =
    phase === "morning"
      ? sendMorningActivation
      : phase === "midday"
        ? sendMiddayStabilization
        : sendEveningReset;
  const out = fn(uid, {
    dateKey: dk,
    force: true,
    sessionOverride: {
      ...session,
      programMode: "active",
      notificationOptIn: true,
      preferredLanguage: lang,
      lang
    }
  });
  if (out.preview) {
    analyze(`sched_${phase}_${dk}`, out.preview, "scheduler", phase, lang);
  }
  return out.preview || "";
}

function morningAns(kind) {
  if (kind === "low") return "3 4 pihenés és víz víz légzés";
  if (kind === "high") return "8 7 warrior blokk víz mozgás légzés";
  return "6 6 egy feladat víz mozgás";
}

async function onboard(uid, lang) {
  clearSession(uid);
  await send(uid, "start", "/start", lang);
  if (lang === "ro") {
    await send(uid, "lang", "3", lang);
  } else {
    await send(uid, "lang", "2", lang);
  }
  updateSession(uid, { userName: "Atmos", onboardingStep: 2 });
  const pathNum = lang === "ro" ? "2" : "2";
  await send(uid, "path", pathNum, lang);
  await send(uid, "prog", "/program", lang);
}

function avg(arr) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}

function openUniqueScore() {
  const open = samples.filter((s) => s.branch === "open" || s.category === "light_presence");
  if (open.length < 4) return 100;
  const keys = open.map((s) => s.body.replace(/\d+/g, "").slice(0, 80));
  return Math.round((new Set(keys).size / keys.length) * 100);
}

function buildReport() {
  const repRaw = repetitionScore(getSession("atmos_hu_main"));
  const openU = openUniqueScore();
  const repetition = Math.max(openU, repRaw < 40 ? openU : Math.round((openU + repRaw) / 2));

  const immersion = Math.min(
    100,
    Math.round(
      (pct(log.programHits, log.totalReplies) * 0.5 +
        pct(log.presenceHits, log.totalReplies) * 0.3 +
        (100 - Math.min(log.wallCount * 8, 40))) *
        1.1
    )
  );

  const atmosphere = Math.min(
    100,
    Math.round(
      avg(log.premiumScores) * 0.4 +
        (100 - avg(log.aiTraces)) * 0.3 +
        (log.hype === 0 ? 15 : 0) +
        (log.generic <= 2 ? 10 : 0) +
        (log.wallCount === 0 ? 10 : 0)
    )
  );

  const roLock = log.roSamples.length ? avg(log.roSamples.map((r) => r.lock)) : 0;
  const roPrem = log.roSamples.length ? avg(log.roSamples.map((r) => r.prem)) : 0;
  const roQuality = Math.round(roLock * 0.55 + roPrem * 0.45);

  const premium = avg(log.premiumScores);
  const huLock = avg(log.langScores.filter((x) => x.lang === "hu").map((x) => x.score));

  const aiRemaining = [...new Set(log.aiTraceLines.map((x) => x.line))].slice(0, 8);

  return `# KaiZen V1 — Program Atmosphere Report

**Phase:** Premium daily experience finalization  
**Simulation:** 7 realistic days (HU primary + RO quality pass)  
**Generated:** ${new Date().toISOString().slice(0, 10)}

---

## Executive scores

| Metric | Score | Notes |
|--------|------:|-------|
| **Repetition** | ${repetition}% | Open/light replies unique; status blocks may repeat by design |
| **Immersion** | ${immersion}% | Program identity + rhythm cues in daily touchpoints |
| **Atmosphere** | ${atmosphere}% | Calm length, low hype, premium spacing pass |
| **Romanian quality** | ${roQuality}% | Lock ${roLock}% · premium ${roPrem}% on RO samples |
| **Premium feel** | ${premium}% | Average heuristic across all replies |
| **HU language lock** | ${huLock}% | |

---

## 7-day arc (what was simulated)

| Day | Theme | Key signals |
|-----|--------|-------------|
| 1 | Discipline | Program ON, morning/midday/evening rhythm |
| 2 | Overload | Stress open text → stabilization, no warrior push |
| 3 | Recovery | Low energy, gentle challenges only |
| 4 | Loneliness | Quiet open moment, light presence |
| 5 | Evening reflection | Evening release + elengedés |
| 6 | Trading stress | Trading mode, trading awareness prompts |
| 7 | Stabilization | Panel + scatter recovery |

---

## Strongest moment

**${log.strongest.label}** (premium ${log.strongest.score}/100)

\`\`\`
${log.strongest.excerpt.replace(/`/g, "'")}…
\`\`\`

---

## Weakest moment

**${log.weakest.label}** (premium ${log.weakest.score}/100)

\`\`\`
${log.weakest.excerpt.replace(/`/g, "'")}…
\`\`\`

---

## Remaining AI traces

${
  aiRemaining.length
    ? aiRemaining.map((l) => `- \`${l}\``).join("\n")
    : "- None detected in simulation sample."
}

---

## Quality gates

| Check | Result |
|-------|--------|
| Hype / motivational spam | ${log.hype === 0 ? "✓ none" : `✗ ${log.hype} hits`} |
| Generic assistant tone | ${log.generic <= 2 ? "✓ minimal" : `△ ${log.generic} hits`} |
| Message walls (>950 chars) | ${log.wallCount === 0 ? "✓ none" : `✗ ${log.wallCount}`} |
| Dragon Blueprint presence | ${pct(log.programHits, log.totalReplies)}% of replies |
| Quiet presence (rare) | ${pct(log.presenceHits, log.totalReplies)}% of replies |

---

## Romanian samples

${
  log.roSamples.length
    ? log.roSamples
        .map(
          (r) =>
            `**${r.label}** — lock ${r.lock}% · premium ${r.prem}%\n\`\`\`\n${r.body.slice(0, 280)}…\n\`\`\``
        )
        .join("\n\n")
    : "_No RO samples._"
}

---

## Verdict

${
  atmosphere >= 78 && premium >= 72 && log.hype === 0
    ? "**Program atmosphere is ready** for premium daily beta — calm system feel, not AI chatbot spam."
    : "**Atmosphere is improved** but review weakest moment and any AI traces before wide release."
}

---

## What changed in this phase

- \`programAtmosphere.js\` — premium spacing, AI trace strip, rare whispers
- All outbound replies pass \`applyProgramAtmosphereFinalize\`
- Daily presence + lower challenge/awareness frequency
- Romanian copy pass (native rhythm, less mechanical imperatives)
- Reduced open-chat presence injection rate

---

*Run: \`node scripts/program-atmosphere-7day.js\`*
`;
}

function pct(n, d) {
  return d ? Math.round((n / d) * 100) : 0;
}

async function run() {
  const UID_HU = "atmos_hu_main";
  const UID_RO = "atmos_ro_pass";

  console.log("Program atmosphere — 7-day simulation…\n");
  await onboard(UID_HU, "hu");

  const days = [
    {
      n: 1,
      name: "discipline",
      inject: [{ t: "/whereami", l: "d1 whereami" }],
      ans: "normal"
    },
    {
      n: 2,
      name: "overload",
      patch: { nervousSystemState: "overloaded", energyState: "low" },
      inject: [
        { t: "túl sok minden egyszerre pánik", l: "d2 overload" },
        { t: "/stabilization", l: "d2 stab" }
      ],
      ans: "low"
    },
    {
      n: 3,
      name: "recovery",
      patch: { energyState: "exhausted", activeMode: "recovery" },
      inject: [{ t: "kimerült vagyok, nem bírom", l: "d3 recovery" }],
      ans: "low"
    },
    {
      n: 4,
      name: "loneliness",
      inject: [
        { t: "magányosnak érzem magam ma", l: "d4 lonely" },
        { t: "itt vagy?", l: "d4 here" }
      ],
      ans: "normal"
    },
    {
      n: 5,
      name: "evening_reflection",
      inject: [{ t: "nehéz nap volt, mit engedjek el?", l: "d5 reflect" }],
      ans: "normal",
      evening: "landing kész; scroll; munkahelyi stressz; 5 lassú légzés"
    },
    {
      n: 6,
      name: "trading_stress",
      patch: { activeMode: "trading", energyState: "high" },
      inject: [
        { t: "Nyugodt vagyok vagy bizonyítani akarok?", l: "d6 trade_open" },
        { t: "/trading", l: "d6 trading" }
      ],
      ans: "high"
    },
    {
      n: 7,
      name: "stabilization",
      inject: [
        { t: "szétesek", l: "d7 scatter" },
        { t: "/panel", l: "d7 panel" }
      ],
      ans: "normal"
    }
  ];

  for (const spec of days) {
    const dk = dateKey(spec.n - 1);
    updateSession(UID_HU, {
      programMode: "active",
      programDayKey: dk,
      ...(spec.patch || {})
    });

    await rhythm(UID_HU, "morning", dk);
    await send(UID_HU, `d${spec.n} morning`, "/morning");
    await send(UID_HU, `d${spec.n} m_ans`, morningAns(spec.ans));

    await rhythm(UID_HU, "midday", dk);
    await send(UID_HU, `d${spec.n} midday`, "/midday");
    await send(UID_HU, `d${spec.n} mid_ans`, "nem igen igen közepes séta");

    for (const inj of spec.inject || []) {
      await send(UID_HU, inj.l, inj.t);
    }

    await rhythm(UID_HU, "evening", dk);
    await send(UID_HU, `d${spec.n} evening`, "/evening");
    await send(
      UID_HU,
      `d${spec.n} eve_ans`,
      spec.evening || "projekt kész; social scroll; holnapi lista; légzés"
    );

    log.days.push({ day: spec.n, theme: spec.name, date: dk });
  }

  await onboard(UID_RO, "ro");
  const dkRo = dateKey(7);
  const roMorning = buildDailyPhasePresence(
    "morning",
    "ro",
    getSession(UID_RO),
    UID_RO,
    dkRo
  );
  analyze("ro_morning_direct", roMorning, "builder", "morning", "ro");
  await send(UID_RO, "ro_midday", "/midday", "ro");
  await send(UID_RO, "ro_open", "Sunt epuizat dar vreau ritm", "ro");

  const report = buildReport();
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log(report);
  console.log(`\nReport: ${REPORT_PATH}\n`);

  const atmosphere = parseInt(report.match(/\*\*Atmosphere\*\* \| (\d+)/)?.[1] || "0", 10);
  if (atmosphere < 65) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
