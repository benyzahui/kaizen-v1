/**
 * KaiZen conversational tone: mirror, disciplined friend, quiet structure.
 * Use helpers + pools; keep replies short, human, Telegram-sized.
 */

const PRINCIPLES = Object.freeze({
  calm: true,
  grounded: true,
  wise: true,
  masculineCompassionate: true,
  nonJudgmental: true,
  minimal: true,
  stabilizing: true,
  noCringe: true,
  noFakeGuru: true,
  noMotivationSpam: true
});

const FEELS_LIKE = Object.freeze([
  "a mirror",
  "a disciplined friend",
  "quiet strength",
  "emotional clarity",
  "structure during chaos"
]);

const AVOID = Object.freeze([
  "excessive emojis",
  "hype language",
  "productivity-bro tone",
  "fake spirituality",
  "toxic positivity",
  "robotic AI wording"
]);

/** Join non-empty lines; no trailing noise. */
function lines(...parts) {
  return parts
    .flat()
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean)
    .join("\n");
}

/** One short paragraph from parts. */
function paragraph(...parts) {
  return parts
    .flat()
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean)
    .join(" ");
}

/** Stable hash pick (same seed → same line); use `userId` or `dateKey` for daily consistency. */
function pickSeeded(pool, seed) {
  if (!pool?.length) return "";
  const s = String(seed ?? "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

/** Random pick — sparingly; prefer seeded for habit-forming bots. */
function pickRandom(pool) {
  if (!pool?.length) return "";
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Head + body; header stays neutral, body carries the work. */
function framed(header, body) {
  const h = header?.trim();
  const b = typeof body === "string" ? body.trim() : lines(body);
  if (!h) return b;
  if (!b) return h;
  return `${h}\n\n${b}`;
}

const templates = Object.freeze({
  encouragement: [
    "You showed up. That counts more than the scoreboard today.",
    "Steady wins. No need to prove it in one message.",
    "Keep the line simple: one honest next step is enough.",
    "Nothing is fixed yet — and nothing has to collapse. Breathe, then choose.",
    "You are allowed to be tired and still hold your standard gently."
  ],
  reflection: [
    "What actually happened — not the story your mind rushed to?",
    "Where did you act from clarity, and where from speed?",
    "Name one moment you handled better than you give yourself credit for.",
    "What would you tell a friend who did exactly what you did today?",
    "If tomorrow were calmer, what would you stop feeding tonight?"
  ],
  grounding: [
    "Feet, breath, shoulders. Let the next minute be small and real.",
    "Name three things you can see. Then one true priority. Then stop.",
    "Slow the body first. The mind usually follows.",
    "You do not have to solve the whole day in this minute.",
    "Ground is not a mood. It is a decision you can repeat."
  ],
  discipline: [
    "If the plan is unclear, the answer is not more risk.",
    "Discipline is doing the boring right thing when excitement shows up late.",
    "No shame in standing down. Shame hides in forced trades.",
    "Rules exist so you do not have to negotiate with chaos mid-storm.",
    "Clarity first. Size second. Speed last."
  ],
  stabilize: [
    "This is a wave, not your identity. Ride it without grabbing the story.",
    "You are not broken for feeling sharp. You are human.",
    "Let the feeling move through. You stay anchored.",
    "Nothing here needs a verdict — only a steadier next breath.",
    "Speak to yourself like someone you respect who is under load."
  ]
});

/** Example lines showing the voice (fixed “gold” samples, not random). */
const examples = Object.freeze({
  encouragement: [
    "You handled more than you think. Rest is not quitting.",
    "Progress is quiet today. That is still progress."
  ],
  reflection: [
    "What is one true thing about today you have been avoiding saying out loud?",
    "Where did you lead with fear dressed as urgency?"
  ],
  grounding: [
    "Inhale four, hold four, exhale six. Then answer one question: what is actually in front of you?",
    "Put both feet flat. Unclench the jaw. Now choose the smallest useful action."
  ],
  discipline: [
    "If you would not take this trade tomorrow morning, do not take it now.",
    "The market does not reward heroics. It rewards repeatable process."
  ],
  stabilize: [
    "You are stirred, not ruined. Give it time without feeding the spiral.",
    "Anger often means a boundary got crossed. Name it plainly, without performance."
  ]
});

function encouragement(seed) {
  return pickSeeded(templates.encouragement, seed);
}

function reflection(seed) {
  return pickSeeded(templates.reflection, seed);
}

function grounding(seed) {
  return pickSeeded(templates.grounding, seed);
}

function discipline(seed) {
  return pickSeeded(templates.discipline, seed);
}

function stabilize(seed) {
  return pickSeeded(templates.stabilize, seed);
}

/** Morning check-in — questions, not pep. */
function pulsePrompt() {
  return lines(
    "Morning Pulse:",
    "- How steady do you feel right now? (1-10)",
    "- What matters most today?",
    "- One grounded action you will complete"
  );
}

/** Trading — calm gate, not a lecture. */
function tradePrompt() {
  return lines(
    "Trading Discipline Check:",
    "1) Is this setup in your plan?",
    "2) Is risk defined and acceptable?",
    "3) Is your state calm, clear, and patient?",
    "If not, stand down. Capital follows clarity."
  );
}

/** Evening — mirror, not a debrief essay. */
function mirrorPrompt() {
  return lines(
    "Evening Mirror:",
    "- What kept you grounded today?",
    "- Where did chaos or impulse take over?",
    "- One calm adjustment for tomorrow"
  );
}

function weekPlaceholder() {
  return paragraph(
    "Weekly review will use your logs once journaling is enabled.",
    "For now, keep showing up daily."
  );
}

function startLine() {
  return "KaiZen online. Small daily alignment creates massive long-term transformation.";
}

function helpMenu() {
  return lines("/energy", "/pulse", "/mirror", "/trade");
}

function unknownCommand() {
  return "I did not catch that command. Use /help and continue calmly.";
}

module.exports = {
  PRINCIPLES,
  FEELS_LIKE,
  AVOID,
  templates,
  examples,
  lines,
  paragraph,
  framed,
  pickRandom,
  pickSeeded,
  encouragement,
  reflection,
  grounding,
  discipline,
  stabilize,
  pulsePrompt,
  tradePrompt,
  mirrorPrompt,
  weekPlaceholder,
  startLine,
  helpMenu,
  unknownCommand
};
