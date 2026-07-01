/**
 * Kulcsszó → GIF tükör — ironikus, hadnagy hang, 24/7 visszatükrözés.
 * Nem símogat: a user állapotát visszatükrözi (tükör), nem terápia.
 */

const KEYWORD_RULES = [
  {
    id: "lazy_excuse",
    patterns: [
      /\b(lusta|később|majd|holnap|nem most|prokrastin|lazy|later|not now|mâine|poate mâine|kihagyom)\b/i
    ],
    context: "mirror_irony",
    tags: ["mirror", "lazy_irony", "discipline"],
    chance: 0.72,
    mirror: {
      hu: "🪞 Tükör: a kanapé nem hadvezér.",
      en: "🪞 Mirror: the couch isn't your CO.",
      ro: "🪞 Oglindă: canapeaua nu e comandantul."
    }
  },
  {
    id: "phone_scroll",
    patterns: [
      /(telefon\w*|phone|scroll\w*|scrolling|tiktok|instagram|reels|képernyő\w*|screen|feed|social|tik tok)/i
    ],
    context: "mirror_irony",
    tags: ["mirror", "phone_irony", "discipline"],
    chance: 0.68,
    mirror: {
      hu: "🪞 Tükör: a figyelmed elment — visszahozod egy blokkal.",
      en: "🪞 Mirror: your attention left — bring it back with one block.",
      ro: "🪞 Oglindă: atenția a plecat — o aduci înapoi cu un bloc."
    }
  },
  {
    id: "tired_low",
    patterns: [
      /\b(fáradt|kimerült|kimerult|exhausted|tired|drained|epuizat|nincs erőm|no energy)\b/i
    ],
    context: "recovery",
    tags: ["recovery", "mirror", "gentle_irony"],
    chance: 0.55,
    mirror: {
      hu: "🪞 Tükör: fáradt vagy — oké. De nulla lépés nem opció.",
      en: "🪞 Mirror: you're tired — fine. Zero steps isn't an option.",
      ro: "🪞 Oglindă: ești obosit — ok. Zero pași nu e opțiune."
    }
  },
  {
    id: "failed_skip",
    patterns: [
      /\b(kihagytam|elrontottam|failed|skipped|missed|guilty|rusit|bukás|bukas|didn't do)\b/i
    ],
    context: "mirror_comeback",
    tags: ["mirror", "comeback", "recovery"],
    chance: 0.7,
    mirror: {
      hu: "🪞 Tükör: a kihagyás tény. A visszatérés döntés.",
      en: "🪞 Mirror: the skip is fact. The return is a choice.",
      ro: "🪞 Oglindă: omisiunea e fapt. Revenirea e alegere."
    }
  },
  {
    id: "motivated_ready",
    patterns: [
      /\b(kész vagyok|kesz vagyok|motivált|motivalt|ready|let's go|indulhat|pumped|erős|eros|gata)\b/i
    ],
    context: "discipline",
    tags: ["warrior_training", "fire_discipline", "mirror"],
    chance: 0.62,
    mirror: {
      hu: "🪞 Tükör: energia megvan — ne pazarold szét.",
      en: "🪞 Mirror: energy's here — don't waste it.",
      ro: "🪞 Oglindă: ai energie — nu o risipești."
    }
  },
  {
    id: "overwhelm_chaos",
    patterns: [
      /\b(túl sok|tul sok|overwhelm|szétes|szetes|chaos|stressz|panik|anxious|nyomas)\b/i
    ],
    context: "recovery",
    tags: ["breathing", "nature_calm", "mirror"],
    chance: 0.58,
    mirror: {
      hu: "🪞 Tükör: túl sok nyitott kör. Egyet zársz.",
      en: "🪞 Mirror: too many open loops. Close one.",
      ro: "🪞 Oglindă: prea multe bucle deschise. Închide una."
    }
  },
  {
    id: "discipline_focus",
    patterns: [
      /\b(fegyelem|discipline|fókusz|fokusz|focus|koncentr|training|edzés|edzes|workout|mission)\b/i
    ],
    context: "discipline",
    tags: ["samurai_focus", "training", "mirror"],
    chance: 0.5,
    mirror: {
      hu: "🪞 Tükör: beszélsz róla — most csinálod?",
      en: "🪞 Mirror: you talk it — doing it now?",
      ro: "🪞 Oglindă: vorbești — o faci acum?"
    }
  },
  {
    id: "laugh_humor",
    patterns: [
      /\b(nevet|laugh|haha|vicces|funny|poftă|pofta|glum)\b/i
    ],
    context: "mirror_irony",
    tags: ["mirror", "irony_humor", "celebration"],
    chance: 0.45,
    mirror: {
      hu: "🪞 Tükör: nevetni jó. Utána egy blokk.",
      en: "🪞 Mirror: laugh's good. Then one block.",
      ro: "🪞 Oglindă: râsul e bun. Apoi un bloc."
    }
  },
  {
    id: "pain_hard",
    patterns: [
      /\b(fáj|faj|pain|hurt|nehéz|nehez|hard day|kemény nap|suffer)\b/i
    ],
    context: "mirror_comeback",
    tags: ["mirror", "warrior_training", "recovery"],
    chance: 0.52,
    mirror: {
      hu: "🪞 Tükör: fáj — rendben. A fegyelem nem kényelmes.",
      en: "🪞 Mirror: it hurts — fine. Discipline isn't comfortable.",
      ro: "🪞 Oglindă: doare — ok. Disciplina nu e confortabilă."
    }
  },
  {
    id: "streak_win",
    patterns: [
      /\b(streak|sorozat|nyert|won|done|kész|kesz|finished|lezárt|lezart|victory|győzt)\b/i
    ],
    context: "celebration",
    tags: ["victory", "dragon", "mirror"],
    chance: 0.75,
    mirror: {
      hu: "🪞 Tükör: ez számít. Holnap újra.",
      en: "🪞 Mirror: that counts. Again tomorrow.",
      ro: "🪞 Oglindă: contează. Din nou mâine."
    }
  }
];

/**
 * @param {string} text
 * @param {'en'|'hu'|'ro'} [lang]
 */
function matchGifKeywords(text, lang = "en") {
  const t = String(text || "").trim();
  if (t.length < 3) return null;

  let best = null;
  for (const rule of KEYWORD_RULES) {
    let hits = 0;
    for (const re of rule.patterns) {
      if (re.test(t)) hits += 1;
    }
    if (!hits) continue;
    const score = hits + (t.length > 20 ? 1 : 0);
    if (!best || score > best.score) {
      const locked = lang === "hu" || lang === "ro" ? lang : "en";
      best = {
        id: rule.id,
        context: rule.context,
        tags: rule.tags,
        chance: rule.chance,
        score,
        mirrorLine: rule.mirror[locked] || rule.mirror.en
      };
    }
  }
  return best;
}

module.exports = { KEYWORD_RULES, matchGifKeywords };
