/**
 * Production-oriented log prefixes for Netlify / Cursor filtering.
 * Architecture: single entry point; grep by tag in Netlify function logs.
 */

function line(tag, msg, data) {
  const payload =
    data !== undefined && data !== null
      ? `${tag} ${msg} ${typeof data === "string" ? data : JSON.stringify(data)}`
      : `${tag} ${msg}`;
  console.log(payload);
}

module.exports = {
  kaizen: (msg, data) => line("[kaizen]", msg, data),
  webhook: (msg, data) => line("[webhook]", msg, data),
  command: (msg, data) => line("[command]", msg, data),
  conversation: (msg, data) => line("[conversation]", msg, data),
  recovery: (msg, data) => line("[recovery]", msg, data),
  deploy: (msg, data) => line("[deploy]", msg, data)
};
