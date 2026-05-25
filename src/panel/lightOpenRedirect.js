/**
 * Short open-text → one protocol command (no long coaching).
 */

const { getPanelCopy } = require("./i18n/getPanelCopy");

const RULES = [
  {
    re: /(kimerült|burnout|epuizat|epuiz|collapsed|összeestem|prăbușit|kimerült vagyok)/i,
    folder: "recovery",
    cmd: "/recovery"
  },
  {
    re: /(szétesek|szetesek|szétes|szetes|scatter|overwhelm|túl sok|prea mult|haos|chaos|panik|panica|anxious|anxietate|stress|stressz|sodród|drift)/i,
    folder: "stabilization",
    cmd: "/stabilization"
  },
  {
    re: /(lustaság|lazy|lene|procrastin|halog|amân|nincs kedv|no motivation|fără motiv)/i,
    folder: "discipline",
    cmd: "/discipline"
  },
  {
    re: /(nem tudok aludni|insomnia|nu pot dormi|can't sleep|nyitott kör|open loop|buclă)/i,
    folder: "lettinggo",
    cmd: "/lettinggo"
  },
  {
    re: /(energia|energy level|energie scăzută|low energy|nincs energia)/i,
    folder: "energy",
    cmd: "/energy"
  },
  {
    re: /(edzeni|workout|training|antrenament|mozgás|move my body)/i,
    folder: "training",
    cmd: "/training"
  },
  {
    re: /(trade|trading|pozíció|position|revenge|FOMO)/i,
    folder: "trading",
    cmd: "/trading"
  },
  {
    re: /(légz|breath|respira|meditat|medita)/i,
    folder: "breath",
    cmd: "/breath"
  }
];

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} lang
 * @returns {{ body: string, suggestedCommand: string, category: string }|null}
 */
function tryLightProtocolOpen(text, lang) {
  const locked = lang === "hu" || lang === "ro" ? lang : "en";
  const copy = getPanelCopy(locked);
  const t = String(text || "").trim();
  if (t.length < 3 || t.length > 280) return null;

  for (const rule of RULES) {
    if (!rule.re.test(t)) continue;
    const body = copy.lightRedirect?.[rule.folder];
    if (!body) continue;
    return {
      body,
      suggestedCommand: rule.cmd,
      category: "light_presence"
    };
  }

  return null;
}

module.exports = { RULES, tryLightProtocolOpen };
