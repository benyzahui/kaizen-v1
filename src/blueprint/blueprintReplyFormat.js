/**
 * Dragon Blueprint reply formatter (4-part structure).
 */

const { lines } = require("../personality/kaizenVoice");
const { getBlueprintCopy } = require("./i18n/getBlueprintCopy");

/**
 * @param {object} opts
 */
function formatBlueprintReply(opts) {
  const copy = getBlueprintCopy(opts.lang);
  const labels = copy.labels;
  const actionLines = Array.isArray(opts.actionLines)
    ? opts.actionLines
    : opts.actionLines
      ? [opts.actionLines]
      : [];

  const parts = [
    `${opts.icon || ""} ${opts.title || ""}`.trim(),
    "",
    opts.stateLine || "",
    "",
    opts.explanation || "",
    "",
    `${labels.step}:`,
    ...actionLines.filter(Boolean)
  ];

  if (opts.includeSafety !== false && (opts.safetyOverride || labels.safety)) {
    parts.push("", opts.safetyOverride || labels.safety);
  }

  if (opts.nextCommand) {
    parts.push("", `${labels.next}: ${opts.nextCommand}`);
  }

  return lines(...parts);
}

module.exports = { formatBlueprintReply };
