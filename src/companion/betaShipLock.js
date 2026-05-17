/**
 * Beta ship quality lock — repetition purge, human language, emotional safety (phases 169–173).
 */

const { pickSeeded } = require("../personality/tone");
const { getResponses } = require("../i18n/getResponses");
const { normalizeChunk, firstLine } = require("../conversation/structureMemory");

const TECH_REPLACEMENTS = {
  hu: [
    {
      re: /\boverload state detected\b/gi,
      alt: "Ez most már inkább túl sok terhelés egyszerre."
    },
    {
      re: /\bcognitive fragmentation\b/gi,
      alt: "Szét van húzva a figyelmed."
    },
    {
      re: /\bemotional overload detected\b/gi,
      alt: "Ez most már inkább túl sok terhelés egyszerre."
    },
    {
      re: /\bloop detected\b/gi,
      alt: "Ugyanazt forgod újra — ez most sok."
    },
    {
      re: /\bstate detected\b/gi,
      alt: "Ez most nehéznek hangzik."
    }
  ],
  en: [
    {
      re: /\boverload state detected\b/gi,
      alt: "This is too much load at once."
    },
    {
      re: /\bcognitive fragmentation\b/gi,
      alt: "Your attention is pulled apart."
    },
    {
      re: /\bemotional overload detected\b/gi,
      alt: "This sounds like too much at once."
    },
    {
      re: /\bloop detected\b/gi,
      alt: "You are circling the same thing — that costs energy."
    }
  ],
  ro: [
    {
      re: /\boverload state detected\b/gi,
      alt: "Asta e prea multă încărcare deodată."
    },
    {
      re: /\bcognitive fragmentation\b/gi,
      alt: "Atenția ta e trasă în mai multe părți."
    },
    {
      re: /\bloop detected\b/gi,
      alt: "Întorci aceeași problemă — asta obosește."
    }
  ]
};

const CLINICAL_RE =
  /\b(idegrendszeri fáradás|nervous system|protocol stack|optimization layer|cognitive load management)\b/i;

const SHAME_PRESSURE_RE =
  /\b(you failed|failed your discipline|no excuses|prove yourself|te vagy gyenge|kudarcot vallottál|lipsă de disciplină|you are stalling because it costs ego)\b/i;

const HARSH_ACCOUNT_RE =
  /\b(megint elmaradt|you skipped again|why didn't you|miért nem csináltad|trebuia să)\b/i;

const STABILIZE_SPAM_RE = /\b(stabilizáló|stabilizing action|stabilize first)\b/i;

const REPEAT_OPENER_WINDOW = 6;

/**
 * @param {string} body
 * @param {'en'|'hu'|'ro'} lang
 */
function humanizeTechLanguage(body, lang) {
  let b = String(body || "");
  const rules = TECH_REPLACEMENTS[lang] || TECH_REPLACEMENTS.en;

  for (const { re, alt } of rules) {
    b = b.replace(re, alt);
  }

  if (CLINICAL_RE.test(b)) {
    const r = getResponses(lang);
    const pool = r.groundedVoiceAlts || r.naturalEmotionalSupport || [];
    if (pool.length) {
      const alt = pickSeeded(pool, `clinical_${lang}`);
      b = b
        .split(/\n/)
        .map((line) => (CLINICAL_RE.test(line) ? alt : line))
        .join("\n");
    }
  }

  return b.trim();
}

/**
 * @param {string} body
 * @param {object} session
 * @param {'en'|'hu'|'ro'} lang
 * @param {string} seed
 */
function purgeRepetitivePhrases(body, session, lang, seed = "") {
  let b = String(body || "");
  const r = getResponses(lang);
  const recent = session?.recentPhraseHits || [];
  const stabilHeavy = recent.filter((p) => /stabiliz/i.test(p)).length >= 2;

  if (stabilHeavy && STABILIZE_SPAM_RE.test(b)) {
    const alts = r.groundedVoiceAlts || r.structureRewrites || [];
    if (alts.length) {
      b = b.replace(STABILIZE_SPAM_RE, pickSeeded(alts, `${seed}_stab`));
    }
  }

  const openings = session?.recentAssistantOpenings || [];
  const openKey = normalizeChunk(firstLine(b));
  if (openKey && openings.slice(-REPEAT_OPENER_WINDOW).filter((o) => o === openKey).length >= 2) {
    const alts = r.variationOpenings || r.humanRhythmLines || r.listeningAck || [];
    if (alts.length) {
      const lead = pickSeeded(alts, `${seed}_repopen`);
      const rest = b.split(/\n/).slice(1).join("\n").trim();
      b = rest ? `${lead}\n${rest}` : lead;
    }
  }

  const overloadExplain = /\b(túl sok nyitott kör|too many open loops)\b/i;
  if (overloadExplain.test(b) && recent.some((p) => /nyitott|open loop/i.test(p))) {
    const alts = r.quietConfidence || r.naturalEmotionalSupport || [];
    if (alts.length) {
      b = b.replace(overloadExplain, pickSeeded(alts, `${seed}_ov`));
    }
  }

  return b.trim();
}

/**
 * @param {string} body
 */
function applyEmotionalSafety(body) {
  return String(body || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter((line) => {
      if (!line) return false;
      if (SHAME_PRESSURE_RE.test(line)) return false;
      if (HARSH_ACCOUNT_RE.test(line)) return false;
      return true;
    })
    .join("\n")
    .trim();
}

/**
 * @param {string} body
 * @param {object} ctx
 * @param {string} category
 */
function finalizeBetaShipLock(body, ctx, category) {
  if (category === "onboarding") return body;

  let b = humanizeTechLanguage(body, ctx.lang);
  b = applyEmotionalSafety(b);
  b = purgeRepetitivePhrases(
    b,
    ctx.session || {},
    ctx.lang,
    `ship_${category}_${ctx.userId}`
  );

  return b.trim();
}

module.exports = {
  finalizeBetaShipLock,
  humanizeTechLanguage,
  purgeRepetitivePhrases,
  applyEmotionalSafety,
  SHAME_PRESSURE_RE
};
