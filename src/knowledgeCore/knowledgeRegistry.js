/**
 * KaiZen Knowledge Core registry — single source for Dragon Blueprint content.
 */

const { buildKnowledgeRegistry, TARGET_COUNTS } = require("./buildKnowledgeRegistry");
const { KNOWLEDGE_CATEGORIES } = require("./knowledgeSchema");

const REGISTRY = buildKnowledgeRegistry();

const BY_ID = new Map(REGISTRY.map((e) => [e.id, e]));

/**
 * @param {object} [filter]
 */
function getKnowledgeEntries(filter = {}) {
  let pool = REGISTRY;
  if (filter.category) pool = pool.filter((e) => e.category === filter.category);
  if (filter.phase) pool = pool.filter((e) => e.phase === filter.phase);
  if (filter.pillar) pool = pool.filter((e) => e.pillar === filter.pillar);
  if (filter.id) pool = pool.filter((e) => e.id === filter.id);
  return pool;
}

/**
 * @param {string} id
 */
function getKnowledgeById(id) {
  return BY_ID.get(id) || null;
}

function getKnowledgeCoreStats() {
  const counts = {};
  for (const cat of Object.values(KNOWLEDGE_CATEGORIES)) {
    counts[cat] = REGISTRY.filter((e) => e.category === cat).length;
  }
  return {
    total: REGISTRY.length,
    targets: TARGET_COUNTS,
    byCategory: counts,
    uniqueIds: BY_ID.size
  };
}

module.exports = {
  REGISTRY,
  TARGET_COUNTS,
  getKnowledgeEntries,
  getKnowledgeById,
  getKnowledgeCoreStats
};
