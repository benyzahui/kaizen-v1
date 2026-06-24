#!/usr/bin/env node
/**
 * KaiZen V2 personality smoke — welcome, language lock, emoji, tone, gif hooks.
 */

const { buildWelcomeScreen, buildSettingsLanguageMenu } = require("../src/personality/v2/welcomeScreen");
const {
  applyPersonalityV2Finalize,
  validateLanguageLock,
  isBlockedPersonalityLine,
  CORE_PRINCIPLE
} = require("../src/personality/v2/personalityEngine");
const { sanitizeEmoji, countEmojis, EMOJI_LIMITS } = require("../src/personality/v2/emojiSystem");
const { resolveEnergyTone, energyToneHint, ENERGY_TONE } = require("../src/personality/v2/energyTone");
const { pickDailyPresenceLine, PRESENCE } = require("../src/personality/v2/dailyPresenceV2");
const {
  GIF_CATALOG,
  pickGifForCategory,
  resolveGifUrl
} = require("../src/personality/v2/gifCatalog");
const {
  resolveGifForOutbound,
  maybeStageGif,
  PHASE_TO_GIF_CATEGORY
} = require("../src/personality/v2/gifIntegration");
const { finalizeOutboundReply } = require("../src/i18n/hardLanguageLock");
const { processDisciplineOnboarding, parseLanguageChoice } = require("../src/handlers/disciplineOnboarding");
const { lockLanguageFromFirstMessage } = require("../src/companion/onboardingGate");
const { detectAndLockLanguage } = require("../src/companion/firstContactEngine");
const { updateSession, getSession, clearSession } = require("../src/session/sessionStore");

const USER = 99002;
let passed = 0;
let failed = 0;

function ok(label) {
  passed += 1;
  console.log(`  ✓ ${label}`);
}

function fail(label, detail) {
  failed += 1;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function assert(cond, label, detail) {
  if (cond) ok(label);
  else fail(label, detail);
}

console.log("KaiZen V2 Personality Smoke\n");
console.log(`Core principle: ${CORE_PRINCIPLE}\n`);

// Welcome screen
const welcome = buildWelcomeScreen("en");
assert(welcome.includes("Welcome to KaiZen"), "welcome title EN");
assert(welcome.includes("Dragon Blueprint"), "welcome subtitle");
assert(welcome.includes("Choose your language"), "language prompt EN");
assert(buildSettingsLanguageMenu("hu").includes("Beállítások"), "settings menu HU");

// Language lock
clearSession(USER);
updateSession(USER, { preferredLanguage: "hu", languageLocked: true, onboardingStep: 1 });
const locked = validateLanguageLock(getSession(USER), "en");
assert(!locked.ok && locked.lang === "hu", "validateLanguageLock blocks drift");
const drift = lockLanguageFromFirstMessage(USER, "This is a long english message for testing", getSession(USER));
assert(drift === "hu", "lockLanguageFromFirstMessage respects languageLocked");
const fcLang = detectAndLockLanguage(USER, "Bună ziua sunt Alex din România", getSession(USER));
assert(fcLang === "hu", "detectAndLockLanguage respects languageLocked");

clearSession(USER);
updateSession(USER, { onboardingStep: 0, onboardingCompleted: false });
const pick = processDisciplineOnboarding(USER, "2", getSession(USER), "en");
assert(pick?.reply && getSession(USER).languageLocked === true, "onboarding language pick locks permanently");
assert(getSession(USER).preferredLanguage === "hu", "onboarding sets preferredLanguage");

// Personality guards
assert(isBlockedPersonalityLine("Shame on you for skipping."), "blocks shame");
assert(isBlockedPersonalityLine("As an AI I cannot feel."), "blocks AI assistant tone");
assert(!isBlockedPersonalityLine("One step back on the path."), "allows path line");

const guarded = applyPersonalityV2Finalize(
  "Stay steady.\nShame on you.\n🐉🔥⚡🌙☀️🌿💧",
  "en",
  { energyState: "low" },
  USER,
  { dateKey: "2026-05-25" }
);
assert(!/shame/i.test(guarded), "finalize strips shame");
assert(countEmojis(guarded) <= EMOJI_LIMITS.normal, "emoji cap enforced");

// Energy tones
for (const key of Object.keys(ENERGY_TONE)) {
  const tone = resolveEnergyTone({ energyState: key });
  assert(tone.id === key, `energy tone ${key}`);
}
assert(energyToneHint({ energyState: "exhausted" }, "en").includes("Recovery"), "exhausted hint EN");

// Daily presence
for (const phase of ["morning", "midday", "evening"]) {
  const line = pickDailyPresenceLine("en", phase, USER, "2026-05-25", { energyState: "stable" });
  assert(PRESENCE.en[phase].some((p) => line.includes(p.slice(0, 8)) || p.includes(line.slice(0, 8))), `daily presence ${phase}`);
}

// GIF integration points
assert(GIF_CATALOG.length >= 8, "gif catalog populated");
assert(PHASE_TO_GIF_CATEGORY.morning === "morning_activation", "phase→gif morning");
assert(resolveGifForOutbound({ energyState: "low" }, { phase: "morning" }) === null, "gif null without env");
const staged = maybeStageGif(USER, getSession(USER), { phase: "morning", dateKey: "2026-05-25", forceGif: true });
assert(staged === null, "forceGif noop without env URLs");

// End-to-end finalize
const outbound = finalizeOutboundReply(
  "Good morning.\nOne lane today.",
  "hu",
  { preferredLanguage: "hu", languageLocked: true, energyState: "stable" },
  USER,
  { openingId: "cmd_/morning", dateKey: "2026-05-25" }
);
assert(outbound.length > 0, "finalize outbound HU");
assert(!/\b(as an ai|how can i help)\b/i.test(outbound), "no assistant tone after finalize");

// Emoji sanitize
const cleaned = sanitizeEmoji("🐉🔥💀🎉⚡🌙☀️🌿💧🎯🧘🪞⭐");
assert(!cleaned.includes("💀"), "disallowed emoji removed");
assert(countEmojis(cleaned) <= EMOJI_LIMITS.normal, "sanitize caps count");

// parseLanguageChoice
assert(parseLanguageChoice("1") === "en", "parse lang 1");
assert(parseLanguageChoice("magyar") === "hu", "parse magyar");

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
