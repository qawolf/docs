/*
  Shared helper for reading PostHog's own persisted state directly, since
  window.posthog isn't exposed as a global on docs.qawolf.com. Used by both
  qawolf-signup-handler.js and qawolf-attribution-handler.js — pulled out
  here instead of duplicating it in both, since Mintlify loads every root
  .js file as its own <script> tag on the same page, so all three files
  already share one global scope. Load order relative to the other two
  files doesn't matter: nothing here runs until a user actually submits the
  form, well after every script on the page has finished loading.

  Background: docs.json's "integrations.posthog" config is correctly
  pointed at the right PostHog project (confirmed live — autocapture works
  fine), but Mintlify's built-in integration initializes the PostHog client
  internally without ever assigning it to window.posthog. PostHog still
  persists its state the normal way though — to a predictable localStorage
  key (falling back to a same-named cookie) derived from the project's API
  key — so we read that directly instead of going through the SDK instance.

  The API key itself isn't hardcoded: it's read from the DOM at call time,
  off the <script src="https://ph.mintlify.com/array/<apiKey>/config.js">
  tag Mintlify's own integration already injects on every page. That avoids
  keeping a second copy of docs.json's key in sync by hand. Falls back to
  the key as of this writing only if that script tag isn't found.
*/

const knownPosthogApiKeyFallback = 'phc_qEW3U4XMuhdJa6Rf2QZvbyKcixM5mYyq5BYNopuSxBFw';

function getPosthogApiKey() {
  for (const script of document.scripts) {
    const match = script.src && script.src.match(/ph\.mintlify\.com\/array\/(phc_[A-Za-z0-9]+)\//);
    if (match) return match[1];
  }
  return knownPosthogApiKeyFallback;
}

function readPosthogPersistedProperties() {
  const posthogStorageKey = 'ph_' + getPosthogApiKey() + '_posthog';
  try {
    const raw = localStorage.getItem(posthogStorageKey);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage unavailable, or value wasn't valid JSON
  }
  try {
    const rows = document.cookie.split('; ');
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].indexOf(posthogStorageKey + '=') === 0) {
        const value = rows[i].slice(posthogStorageKey.length + 1);
        return value ? JSON.parse(decodeURIComponent(value)) : undefined;
      }
    }
  } catch {
    // cookie unavailable, or value wasn't valid JSON
  }
  return undefined;
}
