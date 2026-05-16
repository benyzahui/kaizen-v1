/**
 * Rule-based reply composition for interactive coach brain.
 *
 * Future LLM: keep composeBrainPriority() signature; internally call OpenAI/etc.
 * and validate language lock + banned phrases before returning.
 */

const { lines } = require("../personality/kaizenVoice");
const { getResponses } = require("../i18n/getResponses");
const { updateSession } = require("../session/sessionStore");
const { detectNaturalIntent } = require("./intentEngine");
const { maybeHumorLead, humorConsumedPatch, humorIdlePatch } = require("./toneEngine");
const { buildEnergyFromOpenText } = require("../handlers/energyHandler");

function applyHumor(session, userId, intent, coreBody, lang) {
  const r = getResponses(lang);
  const lead = maybeHumorLead(session, intent, r);
  const idle = humorIdlePatch(session);
  if (!lead) {
    updateSession(userId, idle);
    return coreBody;
  }
  const pool = r.brainHumorPool || [];
  updateSession(userId, {
    ...idle,
    ...humorConsumedPatch(session, pool.length)
  });
  return lines(lead, "", coreBody);
}

function energyReply(text, lang, userId, prefixLine) {
  const body = buildEnergyFromOpenText(text, lang, userId);
  if (prefixLine) return lines(prefixLine, "", body);
  return body;
}

/**
 * @returns {Promise<null | { reply: string, category: string, suggestedAction?: string|null }>}
 */
async function composeBrainPriority(userId, text, lang, session, classifyCategory) {
  const natural = detectNaturalIntent(text, classifyCategory, session);
  const r = getResponses(lang);

  if (session.awaitingWhyHere && session.onboardingCompleted) {
    updateSession(userId, { awaitingWhyHere: false, ...humorIdlePatch(session) });

    if (natural.intent === "energy_read") {
      const core = energyReply(text, lang, userId, r.brainWhyEnergyAnchor);
      return {
        reply: core,
        category: "energy_question",
        suggestedAction: "/energy"
      };
    }
    if (natural.intent === "user_confusion") {
      const core = lines(r.brainWhyConfused, "", r.brainThreePaths);
      return {
        reply: applyHumor(session, userId, "user_confusion", core, lang),
        category: "user_confusion",
        suggestedAction: "/mode"
      };
    }
    if (natural.intent === "emotional_chaos") {
      const core = lines(r.brainWhyChaos, "", r.chaosSoftReply);
      return {
        reply: core,
        category: "chaos_loop",
        suggestedAction: "/reset"
      };
    }
    if (natural.intent === "trading_gate") {
      const core = lines(r.brainWhyTrading, "", r.tradingGuardrail);
      return {
        reply: applyHumor(session, userId, "trading_gate", core, lang),
        category: "trading_impulse",
        suggestedAction: "/trade"
      };
    }
    if (natural.intent === "body_reset") {
      const core = lines(r.brainWhyBody, "", r.categories.body_energy);
      return {
        reply: applyHumor(session, userId, "body_reset", core, lang),
        category: "body_energy",
        suggestedAction: "/body"
      };
    }
    if (natural.intent === "business_focus") {
      const core = lines(r.brainWhyWork, "", r.categories.work_focus);
      return {
        reply: applyHumor(session, userId, "business_focus", core, lang),
        category: "work_focus",
        suggestedAction: "/focus"
      };
    }
    if (natural.intent === "procrastination_break") {
      const core = lines(r.brainWhyProcrastinate, "", r.compProcrastinate);
      return {
        reply: applyHumor(session, userId, "procrastination_break", core, lang),
        category: "plan_tracking",
        suggestedAction: "/focus"
      };
    }

    const core = lines(r.brainWhyHeard, "", r.brainThreePaths, "", `${r.compNextPrefix} /mode`.trim());
    return {
      reply: applyHumor(session, userId, "casual_companion", core, lang),
      category: "why_here_followup",
      suggestedAction: "/mode"
    };
  }

  if (
    natural.intent === "energy_read" &&
    session.onboardingCompleted &&
    !session.companionActive
  ) {
    updateSession(userId, humorIdlePatch(session));
    const core = energyReply(text, lang, userId, r.brainEnergyPrimaryLead);
    return {
      reply: core,
      category: "energy_question",
      suggestedAction: "/energy"
    };
  }

  if (natural.intent === "user_confusion") {
    const core = lines(r.brainLostShort, "", r.brainThreePaths, "", `${r.compNextPrefix} /mode`.trim());
    updateSession(userId, humorIdlePatch(session));
    return {
      reply: applyHumor(session, userId, "user_confusion", core, lang),
      category: "user_confusion",
      suggestedAction: "/mode"
    };
  }

  if (natural.intent === "command_help_light") {
    updateSession(userId, humorIdlePatch(session));
    return {
      reply: r.brainCommandHelpLite,
      category: "help_intent",
      suggestedAction: null
    };
  }

  return null;
}

module.exports = { composeBrainPriority, applyHumor };
