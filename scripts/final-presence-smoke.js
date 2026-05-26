/**
 * Final presence smoke — 14-day rhythm, premium calm, support without dependency.
 * Run: node scripts/final-presence-smoke.js
 */

const fs = require("fs");
const path = require("path");
const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { buildDailyPhasePresence } = require("../src/program/dailyProgramPresence");
const { finalizeOutboundReply } = require("../src/i18n/hardLanguageLock");
const { isPremiumContent } = require("../src/content/dailyContentEngine");
const {
  applyLightPresenceFinalize,
  analyzePresenceQuality,
  maybeLightPresenceMoment,
  stripOverEmpathy,
  lightPresencePoolStats,
  THERAPY_RE,
  OVER_EMPATHY_RE
} = require("../src/presence/lightPresenceEngine");
const { LIGHT_PRESENCE_MOMENTS } = require("../src/presence/lightPresenceMoments");
const { premiumFeelScore, aiTraceScore } = require("../src/atmosphere/programAtmosphere");
const { POSSESSIVE_RE, DEPENDENCY_RE } = require("../src/presence/hopePresenceEngine");
const { HUSTLE_RE } = require("../src/lifeBalance/lifeBalanceEngine");
const { languageLockScore } = require("../src/i18n/hardLanguageLock");

const PHASES = ["morning", "midday", "evening"];

function assert(c, m) {
  if (!c) throw new Error(m);
}

function atDayPhase(day, phase) {
  const h = phase === "morning" ? 7 : phase === "midday" ? 13 : 21;
  const utcH = ((h - 1) % 24 + 24) % 24;
  return new Date(Date.UTC(2026, 11, 1 + day, utcH, 0, 0));
}

function baseSession(day, overrides = {}) {
  return {
    onboardingCompleted: true,
    preferredLanguage: "hu",
    lang: "hu",
    companionHourOffset: 60,
    activeMode: day % 6 === 0 ? "recovery" : "discipline",
    energyState: day % 5 === 0 ? "exhausted" : day % 3 === 0 ? "low" : "stable",
    disciplineState: day % 4 === 0 ? "drifting" : "focused",
    nervousSystemState: day % 6 === 0 ? "overloaded" : "calm",
    activePrimaryPath: day % 7 === 0 ? "recovery" : "discipline",
    recentLightPresenceIds: [],
    recentHopePresenceIds: [],
    recentCommunityPresenceIds: [],
    recentLifeBalanceLineIds: [],
    recentMantraIds: [],
    recentMicroProtocolIds: [],
    messages: [],
    lastAt: Date.now(),
    ...overrides
  };
}

function printReport(report) {
  const lines = [
    "",
    "══════════════════════════════════════════════════",
    "  KAIZEN V1 — FINAL PRESENCE REPORT",
    "══════════════════════════════════════════════════",
    "",
    `  Period simulated:     ${report.days} days (${report.phases} phase messages)`,
    `  Overall:              ${report.passed ? "PASS ✓" : "FAIL ✗"}`,
    "",
    "── Variety ──",
    `  Unique daily bodies:  ${report.uniqueDailyBodies} (min ${report.thresholds.minDailyBodies})`,
    `  Unique light moments: ${report.uniqueLightMoments} (pool ${report.poolSize})`,
    `  Light moment rate:    ${(report.lightMomentRate * 100).toFixed(1)}%`,
    "",
    "── Premium atmosphere ──",
    `  Avg premium score:    ${report.avgPremiumScore}/100`,
    `  Avg AI trace score:   ${report.avgAiTraceScore}/100 (lower is cleaner)`,
    `  Max message length:   ${report.maxChars} chars`,
    "",
    "── Emotional pacing ──",
    `  Calm tone rate:       ${(report.calmRate * 100).toFixed(1)}%`,
    `  Support rhythm rate:  ${(report.supportRate * 100).toFixed(1)}%`,
    `  Evening safe rate:    ${(report.eveningSafeRate * 100).toFixed(1)}%`,
    "",
    "── Safety (no cringe / dependency) ──",
    `  Therapy tone hits:    ${report.therapyHits}`,
    `  Over-empathy hits:    ${report.overEmpathyHits}`,
    `  Dependency hits:      ${report.dependencyHits}`,
    `  Hustle/cringe hits:   ${report.hustleHits}`,
    "",
    "── Target feeling ──",
    `  "${report.targetFeeling}"`,
    "",
    "══════════════════════════════════════════════════",
    ""
  ];
  console.log(lines.join("\n"));
}

function run() {
  const poolStats = lightPresencePoolStats();
  assert(poolStats.moments >= 24, `light pool ${poolStats.moments}`);

  for (const m of LIGHT_PRESENCE_MOMENTS) {
    assert(m.text.length <= 80, `${m.id} too long`);
    assert(!THERAPY_RE.test(m.text), `${m.id} therapy`);
  }

  const uid = `final_presence_${Date.now()}`;
  clearSession(uid);

  const dailyBodies = new Set();
  const lightMoments = new Set();
  const qualities = [];
  let therapyHits = 0;
  let overEmpathyHits = 0;
  let dependencyHits = 0;
  let hustleHits = 0;
  let calmCount = 0;
  let supportCount = 0;
  let eveningSafe = 0;
  let eveningTotal = 0;
  let maxChars = 0;
  let lightMomentPicks = 0;
  let phaseCount = 0;

  for (let day = 0; day < 14; day++) {
    const dk = `2026-12-${String(day + 1).padStart(2, "0")}`;
    updateSession(uid, baseSession(day));
    let session = getSession(uid);

    for (const phase of PHASES) {
      const now = atDayPhase(day, phase);
      phaseCount += 1;

      session = getSession(uid);
      let body = buildDailyPhasePresence(phase, "hu", session, uid, dk, now);
      body = finalizeOutboundReply(body, "hu", getSession(uid), uid, {
        dateKey: dk,
        phase,
        now,
        inboundText: ""
      });

      maxChars = Math.max(maxChars, body.length);
      dailyBodies.add(body.split("\n").slice(0, 4).join("|"));

      const q = analyzePresenceQuality(body);
      qualities.push({
        ...q,
        premiumScore: premiumFeelScore(body),
        aiTrace: aiTraceScore(body)
      });

      therapyHits += q.therapyHits;
      dependencyHits += q.dependencyHits;
      hustleHits += q.hustleHits;
      if (q.calm) calmCount += 1;
      if (q.supportHits > 0) supportCount += 1;

      if (phase === "evening") {
        eveningTotal += 1;
        const eveningHustle = /hustle|grind|crush|beast|10x|push harder|no excuses/i.test(body);
        const eveningCalm =
          /pihen|elég|elenged|lezár|regener|🌘|nem kell|lassan|esti|este|lépés|ritmus|🌊|🫀|egy dolg|nem új rend|Dragon Blueprint/i.test(
            body
          );
        if (eveningCalm && !eveningHustle) eveningSafe += 1;
      }

      for (const line of body.split(/\n/)) {
        if (OVER_EMPATHY_RE.test(line)) overEmpathyHits += 1;
        if (DEPENDENCY_RE.test(line) || POSSESSIVE_RE.test(line)) dependencyHits += 1;
        if (HUSTLE_RE.test(line)) hustleHits += 1;
      }

      assert(body.length < 1050, `spam d${day} ${phase} (${body.length})`);
      assert(isPremiumContent(body.split("\n")[0] || body), `premium d${day} ${phase}`);

      const lp = maybeLightPresenceMoment("hu", getSession(uid), uid, `${dk}|${phase}`, phase, 0.85);
      if (lp) {
        lightMoments.add(lp);
        lightMomentPicks += 1;
      }
    }
  }

  const stripped = stripOverEmpathy(
    "Értem hogyan érzed.\nItt vagyok.\nEgy lépés elég."
  );
  assert(!/érzelm|therapy/i.test(stripped), "strip over-empathy");
  assert(/Itt vagyok|Egy lépés/i.test(stripped), "keep calm lines");

  const avgPremium =
    qualities.reduce((a, q) => a + q.premiumScore, 0) / Math.max(1, qualities.length);
  const avgAi =
    qualities.reduce((a, q) => a + q.aiTrace, 0) / Math.max(1, qualities.length);

  const report = {
    days: 14,
    phases: phaseCount,
    passed: true,
    uniqueDailyBodies: dailyBodies.size,
    uniqueLightMoments: lightMoments.size,
    lightMomentRate: lightMomentPicks / phaseCount,
    poolSize: poolStats.moments,
    avgPremiumScore: Math.round(avgPremium),
    avgAiTraceScore: Math.round(avgAi),
    maxChars,
    calmRate: calmCount / phaseCount,
    supportRate: supportCount / phaseCount,
    eveningSafeRate: eveningTotal ? eveningSafe / eveningTotal : 1,
    therapyHits,
    overEmpathyHits,
    dependencyHits,
    hustleHits,
    targetFeeling: "The system helps me return to rhythm.",
    thresholds: {
      minDailyBodies: 10,
      minPremium: 55,
      maxAiTrace: 35,
      maxChars: 1050
    }
  };

  try {
    assert(report.uniqueDailyBodies >= report.thresholds.minDailyBodies, "daily variety");
    assert(report.avgPremiumScore >= report.thresholds.minPremium, "premium score");
    assert(report.avgAiTraceScore <= report.thresholds.maxAiTrace, "AI trace");
    assert(report.maxChars <= report.thresholds.maxChars, "length");
    assert(report.therapyHits === 0, "therapy hits");
    assert(report.overEmpathyHits === 0, "over-empathy");
    assert(report.dependencyHits === 0, "dependency");
    assert(report.eveningSafeRate >= 0.7, "evening safe");
    assert(report.calmRate >= 0.5, "calm rate");
    assert(report.uniqueLightMoments >= 4, "light moment variety");
  } catch (e) {
    report.passed = false;
    report.failReason = e.message;
  }

  printReport(report);

  const reportPath = path.join(__dirname, "FINAL-PRESENCE-REPORT.txt");
  fs.writeFileSync(
    reportPath,
    [
      "KAIZEN V1 — FINAL PRESENCE REPORT",
      `Generated: ${new Date().toISOString()}`,
      JSON.stringify(report, null, 2)
    ].join("\n\n"),
    "utf8"
  );
  console.log(`Report written: ${reportPath}`);

  if (!report.passed) {
    console.error("final-presence-smoke: FAIL", report.failReason);
    process.exit(1);
  }
  console.log("final-presence-smoke: OK");
}

run();
