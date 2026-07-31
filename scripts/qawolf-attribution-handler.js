/*
  Must be present (in some form) before qawolf-signup-handler.js runs its
  submit handler, since that script calls window.qawAttribution.getAttribution()
  with no null-check. In practice this isn't a real ordering risk: this file
  sets window.qawAttribution synchronously within milliseconds of page load,
  long before a user could type an email and click submit.

  No head/early-load requirement despite earlier assumption: document.referrer
  is fixed by the browser at navigation time regardless of when JS reads it,
  and setIfAbsent() means first-touch data only gets captured once per
  session anyway. Mintlify's standard "runs after the page becomes
  interactive" timing is sufficient.

  Nothing sensitive in here — no keys, no internal endpoints — confirmed
  safe to commit as plain source in the public docs repo.
*/

(function () {
  const attributionUrlParams = ['fbclid', 'gclid', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term'];
  const attributionCookies = ['li_fat_id'];

  const LANDING_PAGE_KEY = 'qaw_attr_landing_page';
  const REFERRER_KEY = 'qaw_attr_referrer';
  function sessionKey(name) {
    return 'qaw_attr_' + name;
  }

  function setIfAbsent(key, value) {
    if (!value) return;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, value);
    } catch {
      // sessionStorage unavailable
    }
  }

  function readSession(key) {
    try {
      return sessionStorage.getItem(key) || undefined;
    } catch {
      return undefined;
    }
  }

  function getQueryParam(name) {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get(name) || undefined;
    } catch {
      return undefined;
    }
  }

  function getCookie(name) {
    if (typeof document === 'undefined') return undefined;
    try {
      const rows = document.cookie.split('; ');
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].indexOf(name + '=') === 0) {
          const value = rows[i].slice(name.length + 1);
          return value ? decodeURIComponent(value) : undefined;
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  function initializeAttribution() {
    if (typeof window === 'undefined') return;
    setIfAbsent(LANDING_PAGE_KEY, window.location.href);
    setIfAbsent(REFERRER_KEY, document.referrer);
    attributionUrlParams.forEach(function (name) {
      setIfAbsent(sessionKey(name), getQueryParam(name));
    });
    attributionCookies.forEach(function (name) {
      setIfAbsent(sessionKey(name), getCookie(name));
    });
  }

  function getStoredAttribution() {
    if (typeof window === 'undefined') return {};
    const params = {
      landing_page: readSession(LANDING_PAGE_KEY),
      referrer: readSession(REFERRER_KEY),
    };
    attributionUrlParams.forEach(function (name) {
      params[name] = readSession(sessionKey(name));
    });
    attributionCookies.forEach(function (name) {
      const live = getCookie(name);
      params[name] = live != null ? live : readSession(sessionKey(name));
    });
    const output = {};
    Object.keys(params).forEach(function (key) {
      if (params[key]) output[key] = params[key];
    });
    return output;
  }

  function getPosthogAttribution() {
    if (typeof window === 'undefined') return {};
    var posthog = window.posthog;
    if (!posthog || typeof posthog.get_property !== 'function' || typeof posthog.getSessionProperty !== 'function') return {};

    try {
      const clientSessionProps = posthog.get_property('$client_session_props');
      const cspProps = (clientSessionProps ? clientSessionProps.props : {}) || {};
      const merged = {};
      attributionUrlParams.concat(attributionCookies).forEach(function (key) {
        merged[key] = posthog.getSessionProperty(key);
      });
      merged.landing_page = cspProps.u;
      merged.referrer = cspProps.r;
      const output = {};
      Object.keys(merged).forEach(function (key) {
        if (merged[key]) output[key] = merged[key];
      });
      return output;
    } catch {
      return {};
    }
  }

  function getAttribution() {
    const stored = getStoredAttribution();
    const posthog = getPosthogAttribution();

    const output = {};
    Object.keys(stored).forEach(function (k) {
      output[k] = stored[k];
    });
    Object.keys(posthog).forEach(function (k) {
      output[k] = posthog[k];
    });
    if (typeof window !== 'undefined' && window.location && window.location.href) {
      output.submitted_from_url = window.location.href;
    }
    return output;
  }

  initializeAttribution();
  window.qawAttribution = { getAttribution };
})();
