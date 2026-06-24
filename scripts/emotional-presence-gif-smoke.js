#!/usr/bin/env node
/**
 * Emotional presence + GIF experience smoke test.
 * Run: node scripts/emotional-presence-gif-smoke.js
 */

const fs = require("fs");
const path = require("path");
const { clearSession, updateSession, getSession } = require("../src/session/sessionStore");
const {
  buildWelcomeScreen,
  buildLanguageLockConfirm
} = require("../src/personality/v2/welcomeScreen");
const { buildDailyPathMenu } = require("../src/dailyAutomation/dailyPathMenu");
const {
  tryEmotionalPresenceReply,
  detectEmotionalState
} = require("../src/presence/emotionalPresenceLayer");
const { selectGif, stageGifForContext } = require("../src/media/gifSelector");
const { GIF_REGISTRY } = require("../src/media/gifRegistry");
const { sanitizeEmoji, EMOJI_LIMITS, countEmojis } = require("../src/personality/v2/emojiSystem");
const { buildDailyAutomationMessage } = require("../src/dailyAutomation/dailyAutomationEngine");
const { processDisciplineOnboarding } = require("../src/handlers/disciplineOnboarding");
const { validateLanguageLock } = require("../src/personality/v2/personalityEngine");

const UID = 77001;
let passed = 0;
let failed = 0;
const lines = [];

function ok(label) {
  passed += 1;
  lines.push(`PASS: ${label}`);
  console.log(`  ✓ ${label}`);
}

function fail(label, detail) {
  failed += 1;
  lines.push(`FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function assert(cond, label, detail) {
  if (cond) ok(label);
  else fail(label, detail);
}

console.log("Emotional Presence + GIF Smoke\n");

// Welcome EN/HU/RO
const welcomeEn = buildWelcomeScreen("en", { noLangSelected: true });
assert(welcomeEn.includes("Welcome to KaiZen"), "welcome EN title");
assert(welcomeEn.includes("Choose your language"), "welcome EN language prompt");

const welcomeHu = buildWelcomeScreen("hu");
assert(welcomeHu.includes("Üdvözöllek KaiZenben"), "welcome HU");

const welcomeRo = buildWelcomeScreen("ro");
assert(welcomeRo.includes("Bun venit în KaiZen"), "welcome RO");

// Language lock after choice
clearSession(UID);
updateSession(UID, { onboardingStep: 0, onboardingCompleted: false });
const pick = processDisciplineOnboarding(UID, "2", getSession(UID), "en");
assert(getSession(UID).languageLocked === true, "language locked after pick");
assert(getSession(UID).preferredLanguage === "hu", "preferredLanguage hu");
assert(pick?.reply?.includes("Nyelv rögzítve"), "HU lock confirm");

const lockEn = validateLanguageLock(
  { languageLocked: true, preferredLanguage: "en" },
  "hu"
);
assert(!lockEn.ok && lockEn.lang === "en", "language lock blocks drift");

// Menu all languages
const menuEn = buildDailyPathMenu("en");
assert(menuEn.includes("Daily Path") && menuEn.includes("Energy Check"), "menu EN calm hub");
assert(!menuEn.includes("/midday"), "menu EN no command dump");

const menuHu = buildDailyPathMenu("hu");
assert(menuHu.includes("Napi Út") && menuHu.includes("Energia ellenőrzés"), "menu HU");

const menuRo = buildDailyPathMenu("ro");
assert(menuRo.includes("Calea Zilnică") && menuRo.includes("Verificare energie"), "menu RO");

// Emotional responses
const tiredHu = tryEmotionalPresenceReply("nagyon fáradt vagyok ma", "hu", {}, UID);
assert(tiredHu?.body?.includes("Itt vagyok"), "tired user HU");
assert(tiredHu?.body?.includes("Ez is haladás"), "tired HU hope close");

const failedEn = tryEmotionalPresenceReply("I skipped everything today, I failed", "en", {}, UID);
assert(failedEn?.body?.includes("The return does"), "failed/skipped EN no shame");
assert(!/shame|loser|weak/i.test(failedEn.body), "no shame language EN");

const motivatedRo = tryEmotionalPresenceReply("sunt motivat și gata", "ro", {}, UID);
assert(motivatedRo?.body?.includes("Bine"), "motivated RO");
assert(detectEmotionalState("kimerült vagyok") === "tired", "detect tired HU");

// Emoji limits
const emojiNorm = sanitizeEmoji("🐉🔥⚡🌙☀️🌿", EMOJI_LIMITS.normal);
assert(countEmojis(emojiNorm) <= 3, "normal emoji cap 3");
const blocked = sanitizeEmoji("🤣😂🐉");
assert(!blocked.includes("🤣"), "blocked emoji removed");

// GIF selector
assert(GIF_REGISTRY.length >= 10, "gif registry populated");
const gifNull = selectGif("welcome", UID, {}, { force: true });
assert(gifNull === null, "gif silent null without env");

const staged = stageGifForContext(UID, {}, "celebration", { force: true });
assert(staged === null, "stage gif noop without env");

// Scheduled automation still works
clearSession(UID);
updateSession(UID, {
  onboardingCompleted: true,
  languageLocked: true,
  preferredLanguage: "en",
  lang: "en",
  recentKnowledgeIds: []
});
const morning = buildDailyAutomationMessage("morning", getSession(UID), UID, "2026-05-25");
const midday = buildDailyAutomationMessage("midday", getSession(UID), UID, "2026-05-25");
const evening = buildDailyAutomationMessage("evening", getSession(UID), UID, "2026-05-25");
assert(morning && morning.length > 80, "scheduled morning works");
assert(midday && /energy/i.test(midday), "scheduled midday works");
assert(evening && /Reflection|Recovery/i.test(evening), "scheduled evening works");

const lockConfirmEn = buildLanguageLockConfirm("en");
assert(lockConfirmEn.includes("Language locked: English"), "lock confirm EN");

const report = [
  "# Emotional Presence + GIF Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Smoke Results",
  "",
  `**${passed} passed, ${failed} failed**`,
  "",
  ...lines.map((l) => `- ${l}`),
  "",
  "## GIF Integration Status",
  "",
  "- Registry: `src/media/gifRegistry.js` (11 entries, 5 categories)",
  "- Selector: `src/media/gifSelector.js` (context-aware, silent fallback)",
  "- Webhook: sends `pendingGifUrl` after text via `sendAnimation`",
  "- Triggers: welcome, first language lock, streak 7/14/21, emotional recovery, morning/evening automation (rare)",
  "- Configure via `KAIZEN_GIF_*` env vars — skips silently when unset",
  "",
  "## Language Lock",
  "",
  "- Permanent lock on language pick during onboarding",
  "- Confirm message in EN/HU/RO after selection",
  "- Only `/language` (Settings) can change after lock",
  "",
  "## Sample Outputs",
  "",
  "### Welcome (EN)",
  "```",
  welcomeEn.split("\n").slice(0, 8).join("\n"),
  "...",
  "```",
  "",
  "### Tired (HU)",
  "```",
  (tiredHu?.body || "").split("\n").join("\n"),
  "```",
  "",
  "### Menu (EN)",
  "```",
  menuEn,
  "```"
].join("\n");

const reportPath = path.join(__dirname, "EMOTIONAL_PRESENCE_GIF_REPORT.md");
fs.writeFileSync(reportPath, report, "utf8");
console.log(`\nReport: ${reportPath}`);
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
