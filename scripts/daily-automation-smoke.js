#!/usr/bin/env node
/**
 * Dragon Blueprint daily automation smoke — 7 scenarios + 7-day journey sim.
 * Run: node scripts/daily-automation-smoke.js
 */

const { clearSession, getSession, updateSession } = require("../src/session/sessionStore");
const { buildDailyAutomationMessage, simulateDailyAutomationDay } = require("../src/dailyAutomation/dailyAutomationEngine");
const { buildDailyPathMenu } = require("../src/dailyAutomation/dailyPathMenu");
const { dragonTierName, evaluateDragonProgression } = require("../src/dailyAutomation/dragonProgression");
const { tryConsumeMiddayEnergyReply, parseMiddayEnergyChoice } = require("../src/dailyAutomation/middayEnergyFlow");
const { getKnowledgeCoreStats } = require("../src/knowledgeCore/knowledgeRegistry");

function assert(c, m) {
  if (!c) throw new Error(m);
}

function baseSession(overrides = {}) {
  return {
    onboardingCompleted: true,
    languageLocked: true,
    preferredLanguage: "en",
    lang: "en",
    notificationOptIn: true,
    programMode: "active",
    dragonLevel: 1,
    dailyStreak: 0,
    recentKnowledgeIds: [],
    ...overrides
  };
}

const UID = 88001;

console.log("Dragon Blueprint Daily Automation Smoke\n");

const stats = getKnowledgeCoreStats();
assert(stats.total >= 500, `knowledge pool size (${stats.total})`);

clearSession(UID);
updateSession(UID, baseSession());

const morning = buildDailyAutomationMessage("morning", getSession(UID), UID, "2026-05-25");
assert(morning && /Good morning|morning/i.test(morning), "morning activation");
assert(/Focus:|reminder/i.test(morning), "morning has focus + reminder");
assert(/Challenge:/i.test(morning), "morning has challenge");

clearSession(UID);
updateSession(UID, baseSession({ preferredLanguage: "hu", lang: "hu" }));
const morningHu = buildDailyAutomationMessage("morning", getSession(UID), UID, "2026-05-25");
assert(morningHu && /reggelt|Fókusz|Kihívás/i.test(morningHu), "morning HU");

clearSession(UID);
updateSession(UID, baseSession());
const midday = buildDailyAutomationMessage("midday", getSession(UID), UID, "2026-05-25");
assert(midday && /energy/i.test(midday), "midday energy prompt");
assert(getSession(UID).middayEnergyPending, "midday arms energy pending");

const proto = tryConsumeMiddayEnergyReply(UID, "1", "en", getSession(UID));
assert(proto && /Protocol/i.test(proto), "low energy protocol reply");
assert(!getSession(UID).middayEnergyPending, "energy pending cleared");

assert(parseMiddayEnergyChoice("stable") === "stable", "parse stable");
assert(parseMiddayEnergyChoice("3") === "high", "parse high");

clearSession(UID);
updateSession(UID, baseSession());
const evening = buildDailyAutomationMessage("evening", getSession(UID), UID, "2026-05-25");
assert(evening && /Reflection|Evening|reset/i.test(evening), "evening reset");
assert(/Recovery/i.test(evening), "evening recovery");

clearSession(UID);
updateSession(UID, baseSession({ dragonLevel: 1 }));
assert(dragonTierName(getSession(UID), "en") === "Green Dragon", "green dragon beginner");

clearSession(UID);
updateSession(UID, baseSession({ dragonLevel: 4, dailyStreak: 10 }));
assert(dragonTierName(getSession(UID), "en") === "Iron Dragon", "iron dragon intermediate");

clearSession(UID);
updateSession(UID, baseSession({ dragonLevel: 6 }));
assert(dragonTierName(getSession(UID), "en") === "Golden Dragon", "golden dragon advanced");

const menu = buildDailyPathMenu("en", baseSession());
assert(menu.includes("Daily Path"), "menu title");
assert(menu.includes("/challenge"), "menu challenge");
assert(menu.includes("/breath"), "menu breathwork");

console.log("\n7-day journey simulation:\n");
const journey = [];
for (let day = 1; day <= 7; day++) {
  clearSession(UID);
  updateSession(UID, baseSession({ dailyStreak: day - 1, dragonLevel: day <= 3 ? 1 : 4 }));
  const dk = `2026-05-${String(day + 18).padStart(2, "0")}`;
  const m = buildDailyAutomationMessage("morning", getSession(UID), UID, dk);
  const md = buildDailyAutomationMessage("midday", getSession(UID), UID, dk);
  tryConsumeMiddayEnergyReply(UID, day % 3 === 0 ? "3" : day % 2 === 0 ? "2" : "1", "en", {
    ...getSession(UID),
    middayEnergyPending: true,
    middayEnergyDateKey: dk,
    middayEnergyLang: "en"
  });
  const e = buildDailyAutomationMessage("evening", getSession(UID), UID, dk);
  const prog = evaluateDragonProgression(getSession(UID));
  journey.push({
    day,
    tier: dragonTierName(getSession(UID), "en"),
    morningLen: m?.length || 0,
    eveningLen: e?.length || 0,
    promote: prog.promote
  });
  console.log(
    `  Day ${day} | ${journey[day - 1].tier} | morning ${journey[day - 1].morningLen}ch | evening ${journey[day - 1].eveningLen}ch`
  );
}

assert(journey.every((j) => j.morningLen > 40), "7-day morning messages built");
assert(journey.every((j) => j.eveningLen > 40), "7-day evening messages built");

const sim = simulateDailyAutomationDay(UID, { force: true });
assert(sim.morning.preview, "simulate day morning");
assert(sim.midday.preview, "simulate day midday");
assert(sim.evening.preview, "simulate day evening");

console.log("\nPASS — daily automation smoke complete.\n");
