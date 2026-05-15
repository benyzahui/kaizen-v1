/**
 * Active Companion Mode — step flow + coach routing (V2).
 * No scheduled pushes; state lives in session (ephemeral).
 */

const { updateSession, getSession } = require("../session/sessionStore");
const { lines } = require("../personality/kaizenVoice");
const { classifyMessage } = require("../conversation/classify");
const { detectCoachState } = require("./stateDetector");
const { getTimeSlot } = require("./timeContext");
const { pickProtocol, runProtocol } = require("./protocolRouter");
const { slotPreamble } = require("./coachBrain");
const { getResponses } = require("../i18n/getResponses");

function parseBodyScale(text) {
  const m = String(text).match(/\b(10|[1-9])\b/);
  if (m) return parseInt(m[1], 10);
  return null;
}

function parseMindTag(text) {
  const low = String(text).toLowerCase();
  if (/scatter|szétes|dispers|fragment|racing|chaos\s+mind/i.test(low)) return "scattered";
  if (/calm|nyugodt|composed|stabil|peace|lass[uú]/i.test(low)) return "calm";
  if (/heavy|nehéz|thick|slow\s+mind|dense|súlyos/i.test(low)) return "heavy";
  if (/sharp|focused|éles|clear\s+head|ascuțit|concentrat/i.test(low)) return "sharp";
  return null;
}

function bandLabel(slot, r) {
  if (slot === "morning") return r.compWhereBandMorning;
  if (slot === "midday") return r.compWhereBandMidday;
  if (slot === "evening") return r.compWhereBandEvening;
  return r.compWhereBandLate;
}

function activateMode(userId, lang) {
  const r = getResponses(lang);
  const session = getSession(userId);
  const slot = getTimeSlot(session);
  updateSession(userId, {
    companionActive: true,
    companionPaused: false,
    companionAwaiting: "body_scale",
    companionFlowBody: null,
    companionFlowMind: null,
    companionLastMissionSnippet: null,
    companionLastProtocol: null
  });
  const pre = String(slotPreamble(slot, r) || "").trim();
  return lines(
    r.compModeOn,
    "",
    ...(pre ? [pre, ""] : []),
    r.compFlowWeStart,
    "",
    r.compFlowAskBody
  );
}

function deactivateMode(userId, lang) {
  updateSession(userId, {
    companionActive: false,
    companionPaused: false,
    companionAwaiting: null,
    companionFlowBody: null,
    companionFlowMind: null,
    companionLastProtocol: null
  });
  return getResponses(lang).compModeOff;
}

function pauseMode(userId, lang) {
  const r = getResponses(lang);
  const s = getSession(userId);
  if (!s.companionActive) return r.compNotActivePause;
  updateSession(userId, { companionPaused: true });
  return r.compPausedMsg;
}

function resumeMode(userId, lang) {
  const r = getResponses(lang);
  const s = getSession(userId);
  if (!s.companionActive) return r.compNotActiveResume;
  updateSession(userId, { companionPaused: false });
  return r.compResumeMsg;
}

function buildWhereAmiReply(session, lang) {
  const r = getResponses(lang);
  if (!session.companionActive) return r.compNotActiveWhere;
  const slot = getTimeSlot(session);
  const paused = session.companionPaused ? r.compWherePausedYes : r.compWherePausedNo;
  const awaitPart = session.companionAwaiting
    ? `${r.compWhereAwaiting}: ${session.companionAwaiting}`
    : r.compWhereWaitingInput;
  const body = session.companionFlowBody != null ? String(session.companionFlowBody) : "—";
  const mind = session.companionFlowMind || "—";
  return lines(
    r.compWhereTitle,
    "",
    paused,
    `${r.compWhereTimeBand}: ${bandLabel(slot, r)}`,
    awaitPart,
    `${r.compWhereBody}: ${body} · ${r.compWhereMind}: ${mind}`,
    session.companionLastProtocol
      ? `${r.compWhereLastProtocol}: ${session.companionLastProtocol}`
      : "",
    "",
    r.compWhereHint
  );
}

function oneNextLine(r, cmd) {
  return `${r.compNextPrefix} ${cmd}`.trim();
}

/**
 * @returns {null|{ handled: true, reply: string, category: string, suggestedAction?: string|null }}
 */
function processCompanionOpenText(userId, text, lang, session) {
  if (!session.companionActive) return null;
  const r = getResponses(lang);
  if (session.companionPaused) {
    return {
      handled: true,
      reply: r.compPausedMsg,
      category: "companion_paused",
      suggestedAction: "/resume"
    };
  }

  if (session.companionAwaiting === "body_scale") {
    const n = parseBodyScale(text);
    if (n == null) {
      return {
        handled: true,
        reply: lines(r.compFlowBadBody, "", r.compFlowAskBody),
        category: "companion_flow",
        suggestedAction: null
      };
    }
    updateSession(userId, { companionFlowBody: n, companionAwaiting: "mind_tag" });
    return {
      handled: true,
      reply: lines(r.compFlowAfterBody, "", r.compFlowAskMind),
      category: "companion_flow",
      suggestedAction: null
    };
  }

  if (session.companionAwaiting === "mind_tag") {
    const tag = parseMindTag(text);
    if (!tag) {
      return {
        handled: true,
        reply: lines(r.compFlowBadMind, "", r.compFlowAskMind),
        category: "companion_flow",
        suggestedAction: null
      };
    }
    updateSession(userId, { companionFlowMind: tag, companionAwaiting: "mission_line" });
    return {
      handled: true,
      reply: lines(r.compFlowAfterMind, "", r.compFlowAskMission),
      category: "companion_flow",
      suggestedAction: null
    };
  }

  if (session.companionAwaiting === "mission_line") {
    const t = String(text).trim();
    if (t.length < 2) {
      return {
        handled: true,
        reply: r.compMissionTooShort,
        category: "companion_flow",
        suggestedAction: null
      };
    }
    updateSession(userId, {
      companionAwaiting: null,
      companionLastMissionSnippet: t.slice(0, 200)
    });
    return {
      handled: true,
      reply: lines(r.compFlowMissionClose, "", oneNextLine(r, "/focus")),
      category: "companion_flow",
      suggestedAction: "/focus"
    };
  }

  const slot = getTimeSlot(session);
  const cat = classifyMessage(text);
  const coachState = detectCoachState(text, session, cat);
  const protocolId = pickProtocol(coachState, slot);
  const out = runProtocol(protocolId, { text, lang, coachState, timeSlot: slot }, r);
  updateSession(userId, { companionLastProtocol: protocolId });
  const reply = lines(out.message, "", oneNextLine(r, out.nextCommand));
  return {
    handled: true,
    reply,
    category: "companion_active",
    suggestedAction: out.nextCommand
  };
}

module.exports = {
  activateMode,
  deactivateMode,
  pauseMode,
  resumeMode,
  buildWhereAmiReply,
  processCompanionOpenText,
  parseBodyScale,
  parseMindTag
};
