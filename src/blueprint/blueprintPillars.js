/**
 * Dragon Blueprint — pillar definitions (structure; copy in i18n).
 */

const PILLARS = {
  energy_awareness: {
    id: "energy_awareness",
    commands: ["/energy"],
    related: ["/morning", "/status"]
  },
  hydration: {
    id: "hydration",
    commands: [],
    related: ["/energy", "/morning"]
  },
  food_awareness: {
    id: "food_awareness",
    commands: [],
    related: ["/midday", "/energy"]
  },
  fasting_reset: {
    id: "fasting_reset",
    commands: ["/fasting"],
    related: ["/reset", "/evening"]
  },
  movement_training: {
    id: "movement_training",
    commands: ["/training"],
    related: ["/morning", "/energy"]
  },
  breathwork: {
    id: "breathwork",
    commands: [],
    related: ["/reset", "/energy"]
  },
  meditation_silence: {
    id: "meditation_silence",
    commands: [],
    related: ["/evening", "/reset"]
  },
  discipline_focus: {
    id: "discipline_focus",
    commands: ["/focus"],
    related: ["/midday", "/morning"]
  },
  digital_detox: {
    id: "digital_detox",
    commands: ["/focus"],
    related: ["/evening", "/midday"]
  },
  evening_recovery: {
    id: "evening_recovery",
    commands: ["/evening"],
    related: ["/reset"]
  },
  trading_psychology: {
    id: "trading_psychology",
    commands: ["/trade"],
    related: ["/reset", "/status"]
  },
  nervous_stabilization: {
    id: "nervous_stabilization",
    commands: ["/reset"],
    related: ["/energy", "/evening"]
  },
  morning_activation: {
    id: "morning_activation",
    commands: ["/morning"],
    related: ["/energy", "/training"]
  },
  midday_stabilization: {
    id: "midday_stabilization",
    commands: ["/midday"],
    related: ["/focus", "/energy"]
  },
  daily_state: {
    id: "daily_state",
    commands: ["/status"],
    related: ["/energy", "/guide"]
  }
};

/**
 * @param {string} pillarId
 */
function getPillar(pillarId) {
  return PILLARS[pillarId] || null;
}

function listPillarIds() {
  return Object.keys(PILLARS);
}

module.exports = { PILLARS, getPillar, listPillarIds };
