/**
 * Build structured mantra entries (id, language, phase, text, tags).
 */

const TAG_RULES = [
  { re: /rest|recovery|pihen|odihn|regener|felépül|let go|engedd|guilt|bűnt|vinov/i, tag: "recovery" },
  { re: /warrior|harcos|edge|train|rep|kemény|fighter/i, tag: "warrior" },
  { re: /energy|energi|fuel|üzemanyag|combustibil|stimul/i, tag: "energy" },
  { re: /focus|fókusz|lane|sáv|band|direction|irány|target|cel/i, tag: "focus" },
  { re: /stabil|ground|horgony|ancor|calm|nyugod|liniște/i, tag: "stabilization" },
  { re: /disciplin|fegyelem|structure|szerkezet|execute|végrehajt/i, tag: "discipline" },
  { re: /release|elenged|letting|zárás|silence|csend|lower|zaj/i, tag: "let_go" }
];

/**
 * @param {string} text
 */
function inferTags(text) {
  const tags = new Set(["discipline"]);
  for (const { re, tag } of TAG_RULES) {
    if (re.test(text)) tags.add(tag);
  }
  return [...tags];
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {'en'|'hu'|'ro'} language
 * @param {string[]} texts
 */
function buildEntries(phase, language, texts) {
  return texts.map((text, i) => ({
    id: `${phase}_${language}_${String(i + 1).padStart(2, "0")}`,
    language,
    phase,
    text: String(text).trim(),
    tags: inferTags(text)
  }));
}

/**
 * @param {'morning'|'midday'|'evening'} phase
 * @param {{ en: string[], hu: string[], ro: string[] }} textsByLang
 */
function buildPhasePool(phase, textsByLang) {
  const entries = [
    ...buildEntries(phase, "en", textsByLang.en || []),
    ...buildEntries(phase, "hu", textsByLang.hu || []),
    ...buildEntries(phase, "ro", textsByLang.ro || [])
  ];
  return {
    entries,
    en: textsByLang.en || [],
    hu: textsByLang.hu || [],
    ro: textsByLang.ro || []
  };
}

module.exports = { buildEntries, buildPhasePool, inferTags };
