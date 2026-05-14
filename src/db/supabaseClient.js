/**
 * Supabase admin client (service role). Stateless functions: create per use or memoize.
 * Missing env → null + one-shot console warning (see getSupabaseAdmin).
 */

const { createClient } = require("@supabase/supabase-js");

let warnedMissing = false;
let cached = null;
let cachedKey = "";

/**
 * @returns {import('@supabase/supabase-js').SupabaseClient|null}
 */
function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    if (!warnedMissing) {
      console.warn("Supabase memory unavailable — using temporary memory only.");
      warnedMissing = true;
    }
    return null;
  }
  const keySig = `${url}::${key.slice(0, 6)}`;
  if (cached && cachedKey === keySig) return cached;
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  cachedKey = keySig;
  return cached;
}

module.exports = { getSupabaseAdmin };
