/*
  Verbatim handler from the design team, unmodified. 

  Uses the default platformUrl ('https://app.qawolf.com') since
  document.currentScript.dataset won't be set when Mintlify includes this
  as an external file rather than an inline tag with data-platform-url — the
  fallback in the code already covers this, no changes needed here.

 Requires:
  1. CORS on app.qawolf.com's /api/trpc/* allows the docs origin.
  2. window.qawAttribution is loaded (or safely stubbed) on the docs domain.
  Until then every submission fails with the same generic "Failed to
  connect to the server" message, which looks identical regardless of which
  of the two is actually missing.
*/

function getPosthogIds() {
  const posthog = window?.posthog;
  if (!posthog) return {};
  const posthogDistinctId = posthog.get_distinct_id();
  const posthogSessionId = posthog.get_session_id();
  return {
    posthogDistinctId,
    posthogSessionId,
  };
}

const platformUrl = document.currentScript?.dataset.platformUrl || 'https://app.qawolf.com';
const requestTimeoutMs = 5000;
const genericError = 'Something went wrong. Please try again.';
const invalidEmail = 'Please enter a valid email address.';

const boundForms = new WeakSet();

function renderFatalBanner(message) {
  const banner = document.createElement('div');
  banner.textContent = `Signup handler broken: ${message}`;
  banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;' + 'background:#b00020;color:#fff;padding:12px 16px;' + 'font:14px/1.4 system-ui,sans-serif;text-align:center;';
  document.body.appendChild(banner);
}

async function postTrpc(procedure, payload, signal) {
  const response = await fetch(`${platformUrl}/api/trpc/${procedure}`, {
    body: JSON.stringify({ json: payload }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    signal,
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => undefined);
    return {
      type: 'http-error',
      status: response.status,
      body: errorBody,
      message: errorBody?.error?.json?.message,
    };
  }
  const body = await response.json();
  const result = body?.result?.data?.json;
  if (!result || !result.outcome) {
    return { type: 'bad-shape', body };
  }
  return { type: 'ok', result };
}

function navigate(url) {
  window.location.href = url;
}

// Navigates if maybeUrl is a valid same-origin URL; returns an error message otherwise.
function navigateToSafeUrl(maybeUrl) {
  if (typeof maybeUrl !== 'string' || !maybeUrl) return genericError;
  let target;
  try {
    target = new URL(maybeUrl, platformUrl);
  } catch (error) {
    return genericError;
  }
  if (target.origin !== new URL(platformUrl).origin) return genericError;
  navigate(target.href);
  return undefined;
}

function handleSignUpOutcome(result) {
  switch (result.outcome) {
    case "code-sent":
    case "sso-required":
      return navigateToSafeUrl(result.redirectUrl);
    case 'proceed-to-signin':
      return navigateToSafeUrl(result.signInUrl);
    case 'temporarily-disabled':
      navigate('/book-a-demo');
      return undefined;
    case 'invalid-email':
      switch (result.reason) {
        case 'malformed':
          return invalidEmail;
        case 'public-domain':
          return 'Please use your work email address.';
        case 'blocked':
          return 'Please use a different email address to sign up.';
      }
    default:
      return genericError;
  }
}

function handleBookADemoOutcome(result) {
  switch (result.outcome) {
    case 'ok':
      return navigateToSafeUrl(result.redirectTo);
    case 'invalid-email':
      return invalidEmail;
    default:
      return genericError;
  }
}

function buildPayload(email) {
  return {
    email,
    attribution: window.qawAttribution.getAttribution(),
    ...getPosthogIds(),
  };
}

const FORM_KINDS = [
  {
    formSelector: '[data-signup-form]',
    emailSelector: '[data-signup-email]',
    feedbackSelector: '[data-signup-feedback]',
    procedure: 'auth.submitSignUpEmail',
    handleOutcome: handleSignUpOutcome,
    submitLabel: 'Get started',
  },
  {
    formSelector: '[data-book-a-demo-form]',
    emailSelector: '[data-book-a-demo-email]',
    feedbackSelector: '[data-book-a-demo-feedback]',
    procedure: 'acquisition.submitBookADemoForm',
    handleOutcome: handleBookADemoOutcome,
    submitLabel: 'Book a demo',
  },
];

function setupForm(form, kind) {
  if (boundForms.has(form)) return;
  boundForms.add(form);

  const emailInput = form.querySelector(kind.emailSelector);
  if (!emailInput) {
    renderFatalBanner(`missing ${kind.emailSelector} inside ${kind.formSelector}`);
    return;
  }

  const feedbackEl = form.querySelector(kind.feedbackSelector);
  if (!feedbackEl) {
    renderFatalBanner(`missing ${kind.feedbackSelector} inside ${kind.formSelector}`);
    return;
  }

  const submitButton = form.querySelector('button[type=submit], input[type=submit]');
  if (!submitButton) {
    renderFatalBanner(`missing submit button inside ${kind.formSelector}`);
    return;
  }

  form.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (submitButton.disabled) return;
      feedbackEl.textContent = '';
      feedbackEl.style.display = 'none';
      submitButton.disabled = true;
      submitButton.classList.add('is-loading');
      submitButton.value = 'Redirecting...';

      const resetButton = () => {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
        submitButton.value = kind.submitLabel;
      };
      const fail = (message) => {
        feedbackEl.textContent = message;
        feedbackEl.style.display = 'block';
        resetButton();
      };

      const email = (emailInput.value || '').trim();

      try {
        const outcome = await postTrpc(kind.procedure, buildPayload(email), AbortSignal.timeout(requestTimeoutMs));
        if (outcome.type === 'http-error' || outcome.type === 'bad-shape') {
          fail(genericError);
          return;
        }
        const errorMessage = kind.handleOutcome(outcome.result, email);
        if (errorMessage) fail(errorMessage);
      } catch (error) {
        if (error?.name === 'TimeoutError') {
          fail('Request timed out. Please try again.');
        } else if (error?.name === 'AbortError') {
          // Expected on page unload / navigation. Ignore silently.
        } else {
          fail('Failed to connect to the server. Please try again.');
        }
      }
    },
    true,
  );

  window.addEventListener('pageshow', () => {
    submitButton.disabled = false;
    submitButton.classList.remove('is-loading');
    submitButton.value = kind.submitLabel;
  });
}

function initFormHandlers() {
  FORM_KINDS.forEach((kind) => {
    document.querySelectorAll(kind.formSelector).forEach((form) => setupForm(form, kind));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFormHandlers);
} else {
  initFormHandlers();
}

// Handle forms (re)created later via Finsweet Attributes Inject.
// Harmless no-op on Mintlify — Finsweet only exists on the Webflow marketing
// site, so this array just sits unused here. Left in since it's verbatim.
window.FinsweetAttributes ||= [];
window.FinsweetAttributes.push([
  'inject',
  async (instances) => {
    await Promise.all(instances.map((i) => i.loadingPromise));
    initFormHandlers();
  },
]);