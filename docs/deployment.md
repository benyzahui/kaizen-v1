# KaiZen deployment (GitHub → Netlify)

Production branch: **`cursor/telegram-webhook-supabase-wisdom`**. Flow: edit in Cursor → commit → push → Netlify auto-build.

## Prerequisites

- Netlify site linked to this repo; production branch set to the branch above.
- Environment variables in Netlify (**Site configuration → Environment variables**), never committed:
  - `TELEGRAM_BOT_TOKEN` (required)
  - `WEBHOOK_SECRET` (recommended; must match Telegram `secret_token` if set)

Local reference: copy `env.example` to `.env` for `netlify dev`.

## Commit

```bash
git status
git add -A
git commit -m "Describe the change in one sentence."
```

## Push

```bash
git push origin cursor/telegram-webhook-supabase-wisdom
```

Netlify runs `npm install`, publishes `public/`, and bundles `netlify/functions`.

## Rollback

1. In Netlify: **Deploys** → select a known-good deploy → **Publish deploy**.
2. Or in Git: revert the bad commit on the production branch, push again.

## Reconnect Telegram webhook

After URL or secret changes, set webhook (replace placeholders):

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<your-site>.netlify.app/.netlify/functions/telegram-webhook&secret_token=<WEBHOOK_SECRET>"
```

If you do not use a secret, omit `secret_token`. If you use it, the same value must be in Netlify as `WEBHOOK_SECRET`.

## Verify production health

1. Browser or curl: `GET https://<your-site>.netlify.app/.netlify/functions/telegram-webhook`  
   Expected body: `KaiZen webhook online.`  
   Same response: `GET https://<your-site>.netlify.app/health` (redirect alias).
2. Send `/status` in Telegram — should return language, mode, session snapshot.
3. Send `/help` — command list should load.

## Debug Netlify logs

1. Netlify UI: **Logs** → **Functions** → select `telegram-webhook`.
2. Or CLI: `netlify logs:function telegram-webhook` (after `netlify link`).
3. Filter by tags: `[deploy]`, `[webhook]`, `[command]`, `[conversation]`, `[recovery]`, `[kaizen]`.

## Local scripts

| Script            | Purpose                                      |
|-------------------|----------------------------------------------|
| `npm run dev`     | `netlify dev` — local function + env         |
| `npm run deploy-check` | Sanity-check repo files before push   |
| `npm run logs`    | Hint for tailing Netlify function logs       |

## Risks (short)

- Sessions are **in-memory**; cold starts clear them until users message again.
- Function **CPU/time limits** apply; long work should stay async or be moved out later.
- Wrong `WEBHOOK_SECRET` → Telegram still delivers but Netlify returns **401** (bot looks “dead”).
