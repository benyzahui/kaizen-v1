function getCorrectionCopy(lang) {
  const key = String(lang || "en").toLowerCase();
  return (
    { en: require("./correctionCopy.en"), hu: require("./correctionCopy.hu"), ro: require("./correctionCopy.ro") }[
      key
    ] || require("./correctionCopy.en")
  );
}

module.exports = { getCorrectionCopy };
