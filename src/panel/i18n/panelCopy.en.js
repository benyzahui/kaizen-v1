/** Manual protocol library — EN */

const folders = {
  discipline: {
    title: "⚔ Discipline",
    purpose: "Return energy into structure.",
    beginner: "One task, 25 minutes, no phone.",
    intermediate: "90 min deep work block.",
    advanced: "Silent execution window.",
    today: "Choose one task and finish it."
  },
  stabilization: {
    title: "🫀 Stabilization",
    purpose: "Lower nervous system load before pressure.",
    beginner: "Water. Slow exhale ×5. Stand up once.",
    intermediate: "10 min walk. No inputs.",
    advanced: "20 min nervous-system downshift, then one lane.",
    today: "One anchor: breath or walk — then stop."
  },
  training: {
    title: "🔥 Training",
    purpose: "Body carries focus — movement without drama.",
    beginner: "15 min walk or mobility.",
    intermediate: "Strength block — clear start and end.",
    advanced: "Full session — no phone between sets.",
    today: "Move once. Log it. Done."
  },
  lettinggo: {
    title: "🌘 Letting Go",
    purpose: "Release loops — not solve everything tonight.",
    beginner: "Write one open loop on paper. Close the list.",
    intermediate: "Screen off 30 min before sleep.",
    advanced: "Evening closure ritual — no new tasks.",
    today: "Close one loop. Leave the rest."
  },
  recovery: {
    title: "🌊 Recovery",
    purpose: "Rebuild capacity — not push through collapse.",
    beginner: "Hydrate. Eat. Rest 20 min.",
    intermediate: "Light movement + early sleep window.",
    advanced: "Full recovery day — no warrior mode.",
    today: "Protect sleep. Minimum victory only."
  },
  energy: {
    title: "🌙 Energy",
    purpose: "Symbolic field awareness — clarity over noise.",
    beginner: "Name your energy: low / steady / high.",
    intermediate: "One channel open. Close the rest.",
    advanced: "Energy audit — inputs, sleep, focus leaks.",
    today: "Read the field. One adjustment."
  },
  trading: {
    title: "📈 Trading",
    purpose: "Psychology before entries — rules over impulse.",
    beginner: "No trade until plan is written.",
    intermediate: "Risk cap set. One session max.",
    advanced: "Full pre-market protocol — no revenge trades.",
    today: "Rules first. Screen second."
  },
  fasting: {
    title: "💧 Hydration / Fasting",
    purpose: "Reset without punishment — nervous system first.",
    beginner: "Water + electrolytes. No extreme fast.",
    intermediate: "Structured eating window.",
    advanced: "Planned reset day — supervised if needed.",
    today: "Hydrate. Eat clean once. Stop there."
  },
  breath: {
    title: "🧘 Breath / Meditation",
    purpose: "Direct regulation — short, repeatable.",
    beginner: "4 slow exhales. Shoulders down.",
    intermediate: "5 min breath — timer on.",
    advanced: "15 min sit — same spot daily.",
    today: "Three minutes. Then continue."
  }
};

module.exports = {
  panelTitle: "KaiZen — Protocol panel",
  panelIntro: "Choose one folder for today:",
  panelFooter: "Rhythm: /morning /midday /evening · Status: /status",
  labels: {
    purpose: "Purpose",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    today: "Today"
  },
  tooManyLanes: "Too many lanes.\nChoose one protocol for today.",
  folders,
  lightPresence: [
    "Good. I'm here.\nNo need to overcomplicate.",
    "One protocol is enough for today.",
    "Don't hunt a new system today.\nHold the rhythm.",
    "Slow. Steady."
  ],
  lightRedirect: {
    stabilization: "This is stabilization.\nStart: /stabilization",
    discipline: "Structure first.\nOpen: /discipline",
    recovery: "Recovery mode.\nOpen: /recovery",
    lettinggo: "Letting go tonight.\nOpen: /lettinggo",
    energy: "Energy field.\nOpen: /energy",
    training: "Move the body.\nOpen: /training"
  },
  folderCommands: [
    { cmd: "/discipline", label: "⚔ Discipline" },
    { cmd: "/stabilization", label: "🫀 Stabilization" },
    { cmd: "/training", label: "🔥 Training" },
    { cmd: "/lettinggo", label: "🌘 Letting Go" },
    { cmd: "/recovery", label: "🌊 Recovery" },
    { cmd: "/energy", label: "🌙 Energy" },
    { cmd: "/trading", label: "📈 Trading" },
    { cmd: "/fasting", label: "💧 Hydration / Fasting" },
    { cmd: "/breath", label: "🧘 Breath / Meditation" }
  ]
};
