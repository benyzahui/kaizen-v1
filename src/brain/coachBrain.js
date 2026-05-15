/**
 * Interactive Coach Brain — public facade.
 *
 * ----------------------------------------------------------------------------
 * CURRENT IMPLEMENTATION IS RULE-BASED (NO LLM):
 * - Intent is keyword + classifier fusion (see intentEngine.js).
 * - Tone/humor is template pools with cooldown — not situational wit.
 * - Cannot infer unstated nuance or hold multi-turn latent goals reliably.
 *
 * PLUGGING IN AN AI BRAIN LATER:
 * - Keep exports stable: composeBrainPriority(userId, text, lang, session, classifyCategory).
 * - Add src/brain/llmAdapter.js that returns { reply, category, suggestedAction }
 *   validated against language lock + banned phrases.
 * - Fall back to composeBrainPriority when API absent or unsafe output.
 * ----------------------------------------------------------------------------
 */

const { composeBrainPriority } = require("./responseComposer");

module.exports = {
  composeBrainPriority
};
