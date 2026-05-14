/**
 * Local sanity check before push: required env names exist in env.example.
 * Does not validate secret values.
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envExample = path.join(root, "env.example");
const netlifyToml = path.join(root, "netlify.toml");
const webhook = path.join(root, "netlify", "functions", "telegram-webhook.js");

let code = 0;
function fail(msg) {
  console.error("[deploy-check]", msg);
  code = 1;
}

if (!fs.existsSync(netlifyToml)) fail("Missing netlify.toml");
if (!fs.existsSync(webhook)) fail("Missing netlify/functions/telegram-webhook.js");
if (!fs.existsSync(envExample)) fail("Missing env.example");

const ex = fs.readFileSync(envExample, "utf8");
const required = ["TELEGRAM_BOT_TOKEN"];
for (const key of required) {
  if (!new RegExp(`^${key}=`, "m").test(ex)) {
    fail(`env.example missing ${key}`);
  }
}

if (code === 0) {
  console.log("[deploy-check] OK — netlify.toml, webhook, env.example present.");
}
process.exit(code);
