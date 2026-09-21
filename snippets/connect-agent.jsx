// Native-component version of the "Connect your agent" onboarding panel.
//
// Mirrors https://qaw-prototype.vercel.app/connect-agent, but rendered inside
// the docs instead of framed. Two reasons this exists as a component rather
// than an iframe: it inherits the docs light/dark theme, and it drops the
// prototype's own app chrome ("Back to app", "Get a demo") that an iframe
// would drag in.
//
// Conventions borrowed from components/github-code-block.jsx: useState is
// injected globally by Mintlify's JSX runtime, and the component must use
// arrow function syntax — Mintlify's snippet compiler rejects the `function`
// keyword. Styling is a self-contained <style> block keyed off Mintlify's
// `html.dark` class rather than Tailwind utilities, so it does not depend on
// which classes happen to survive the docs CSS build.
//
// The one/two column breakpoint is a container query, not a media query. What
// decides whether this panel has room for two columns is the width of the
// content column it sits in, not the width of the reader's window — on a
// standard-width docs page those differ by the whole sidebar.

export const ConnectAgent = () => {
  const [site, setSite] = useState("");
  const [copied, setCopied] = useState("");
  const [failed, setFailed] = useState("");

  const host = site.trim() || "yoururl.com";
  const prompt = "Create a sign-in test for " + host + " with QA Wolf";
  const mcpUrl = "https://app.qawolf.com/api/mcp";

  const copy = (key, text) => {
    const done = () => {
      setFailed("");
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    };
    const fail = () => {
      setCopied("");
      setFailed(key);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fail);
    } else {
      fail();
    }
  };

  const css = `
    .qaw-ca { container-type:inline-size; --qaw-brand:#3b3cef; --qaw-tint:#eef0ff; --qaw-card:#ffffff;
      --qaw-panel:#fafafa; --qaw-border:#d5d7db; --qaw-text:#111827;
      --qaw-muted:#4b5563; --qaw-chip:#f3f4f6;
      color:var(--qaw-text); margin:0 0 1.5rem; }
    html.dark .qaw-ca { --qaw-brand:#8b8cf7; --qaw-tint:rgba(59,60,239,.16);
      --qaw-card:rgba(255,255,255,.03); --qaw-panel:rgba(255,255,255,.05);
      --qaw-border:rgba(255,255,255,.14); --qaw-text:#f3f4f6;
      --qaw-muted:#9ca3af; --qaw-chip:rgba(255,255,255,.08); }

    .qaw-ca-grid { display:grid; border:1px solid var(--qaw-border);
      border-radius:12px; overflow:hidden; background:var(--qaw-card); }
    @container (min-width:768px) { .qaw-ca-grid { grid-template-columns:1fr 1fr; } }

    .qaw-ca-col { padding:1.75rem; }
    .qaw-ca-col + .qaw-ca-col { border-top:1px solid var(--qaw-border);
      background:var(--qaw-panel); }
    @container (min-width:768px) { .qaw-ca-col + .qaw-ca-col {
      border-top:0; border-left:1px solid var(--qaw-border); } }

    .qaw-ca-h2 { display:flex; align-items:center; gap:.75rem; margin:0;
      font-size:1.125rem; font-weight:600; letter-spacing:-.01em;
      color:var(--qaw-text); }
    .qaw-ca-num { display:flex; align-items:center; justify-content:center;
      height:1.5rem; width:1.5rem; flex:0 0 auto; border-radius:9999px;
      background:var(--qaw-tint); color:var(--qaw-brand);
      font-size:.75rem; font-weight:600; }
    .qaw-ca-sub { margin:.75rem 0 0; font-size:.875rem; line-height:1.5;
      color:var(--qaw-muted); }

    .qaw-ca-list { margin-top:1.5rem; border:1px solid var(--qaw-border);
      border-radius:8px; overflow:hidden; }
    .qaw-ca-row { display:flex; align-items:center; gap:.75rem;
      padding:1rem; text-decoration:none; color:inherit;
      transition:background-color .15s ease; }
    .qaw-ca-row + .qaw-ca-row { border-top:1px solid var(--qaw-border); }
    .qaw-ca-row:hover { background:var(--qaw-chip); }
    .qaw-ca-mark { display:flex; align-items:center; justify-content:center;
      height:2.5rem; width:2.5rem; flex:0 0 auto; border-radius:8px;
      background:var(--qaw-chip); }
    .qaw-ca-name { flex:1 1 auto; min-width:0; font-size:.875rem;
      font-weight:500; }
    .qaw-ca-cta { display:flex; align-items:center; gap:.375rem;
      font-size:.75rem; font-weight:500; color:var(--qaw-brand); }

    .qaw-ca-h3 { margin:1.5rem 0 0; font-size:.875rem; font-weight:600; }
    .qaw-ca-box { margin-top:.75rem; padding:1rem; border-radius:8px;
      border:1px solid var(--qaw-border); background:var(--qaw-panel); }
    .qaw-ca-box--accent { border-color:var(--qaw-brand); background:var(--qaw-tint); }
    .qaw-ca-mono { margin:0 0 1rem; font-family:ui-monospace,SFMono-Regular,
      Menlo,monospace; font-size:.8125rem; line-height:1.5;
      overflow-wrap:anywhere; color:var(--qaw-text); }

    .qaw-ca-label { display:block; margin-bottom:.5rem; font-size:.75rem;
      font-weight:500; color:var(--qaw-muted); }
    .qaw-ca-input { width:100%; box-sizing:border-box; height:2.5rem;
      padding:0 .75rem; border-radius:6px; border:1px solid var(--qaw-border);
      background:var(--qaw-card); color:var(--qaw-text); font-size:.875rem; }
    .qaw-ca-input:focus { outline:none; border-color:var(--qaw-brand);
      box-shadow:0 0 0 1px var(--qaw-brand); }

    .qaw-ca-btn { display:inline-flex; align-items:center;
      justify-content:center; gap:.5rem; border-radius:6px; font-size:.875rem;
      font-weight:500; cursor:pointer; transition:opacity .15s ease; }
    .qaw-ca-btn:hover { opacity:.85; }
    .qaw-ca-btn--ghost { height:2.25rem; padding:0 1rem;
      border:1px solid var(--qaw-border); background:var(--qaw-card);
      color:var(--qaw-text); }
    .qaw-ca-btn--primary { width:100%; height:2.75rem; border:0;
      background:#3b3cef; color:#fff; }
    .qaw-ca-note { margin:.75rem 0 0; font-size:.75rem; color:var(--qaw-muted); }
    .qaw-ca-link { color:var(--qaw-brand); text-decoration:none; font-weight:500; }
    .qaw-ca-link:hover { text-decoration:underline; }
    .qaw-ca-foot { margin:1rem 0 0; font-size:.875rem; line-height:1.5;
      color:var(--qaw-muted); text-align:center; }
  `;

  const copyIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );

  const linkIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );

  const agents = [
    {
      name: "Claude",
      href: "https://claude.ai/directory/qawolf",
      color: "#D97757",
      path: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
    },
    {
      name: "ChatGPT",
      href: "https://chatgpt.com/plugins/plugin_asdk_app_6aa2be82194c81919e05f3e7c5eedeef",
      color: "currentColor",
      path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
    },
  ];

  return (
    <div className="qaw-ca">
      <style>{css}</style>
      <div className="qaw-ca-grid">
        <section className="qaw-ca-col">
          <h2 className="qaw-ca-h2">
            <span className="qaw-ca-num">1</span>
            Add QA Wolf to your agent
          </h2>

          <div className="qaw-ca-list">
            {agents.map((agent) => (
              <a
                key={agent.name}
                className="qaw-ca-row"
                href={agent.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={"Install QA Wolf in " + agent.name + " (opens in a new tab)"}
              >
                <span className="qaw-ca-mark">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                    style={{ color: agent.color }} aria-hidden="true">
                    <path d={agent.path} />
                  </svg>
                </span>
                <span className="qaw-ca-name">{agent.name}</span>
                <span className="qaw-ca-cta">Install {linkIcon}</span>
              </a>
            ))}
          </div>

          <h3 className="qaw-ca-h3">Using another agent?</h3>
          <div className="qaw-ca-box">
            <p className="qaw-ca-mono">Set up QA Wolf MCP at {mcpUrl}</p>
            <button
              type="button"
              className="qaw-ca-btn qaw-ca-btn--ghost"
              aria-label="Copy setup prompt"
              onClick={() => copy("mcp", "Set up QA Wolf MCP at " + mcpUrl)}
            >
              {copyIcon}
              <span aria-live="polite">{copied === "mcp" ? "Copied" : "Copy"}</span>
            </button>
            {failed === "mcp" && (
              <p className="qaw-ca-note">
                Couldn't copy. Select the text above and copy it manually.
              </p>
            )}
            <p className="qaw-ca-note">
              <a
                className="qaw-ca-link"
                href="https://github.com/qawolf/agent-plugins/blob/main/plugins/qawolf/PLATFORMS.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Client-specific setup guide
              </a>
            </p>
          </div>
        </section>

        <section className="qaw-ca-col">
          <h2 className="qaw-ca-h2">
            <span className="qaw-ca-num">2</span>
            Copy this prompt
          </h2>
          <p className="qaw-ca-sub">Paste into your agent's chat.</p>

          <div style={{ marginTop: "1.5rem" }}>
            <label className="qaw-ca-label" htmlFor="qaw-ca-site">
              Your website
            </label>
            <input
              id="qaw-ca-site"
              className="qaw-ca-input"
              placeholder="yoururl.com"
              autoComplete="url"
              inputMode="url"
              spellCheck="false"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />
          </div>

          <div className="qaw-ca-box qaw-ca-box--accent" style={{ marginTop: "1rem" }}>
            <p className="qaw-ca-mono" aria-live="polite">{prompt}</p>
            <button
              type="button"
              className="qaw-ca-btn qaw-ca-btn--primary"
              onClick={() => copy("prompt", prompt)}
            >
              {copyIcon}
              <span aria-live="polite">
                {copied === "prompt" ? "Copied" : "Copy prompt"}
              </span>
            </button>
            {failed === "prompt" && (
              <p className="qaw-ca-note">
                Couldn't copy. Select the prompt above and copy it manually.
              </p>
            )}
          </div>
        </section>
      </div>

      <p className="qaw-ca-foot">
        Not using a coding agent? Use the{" "}
        <a
          className="qaw-ca-link"
          href="https://app.qawolf.com/sign-up?utm_source=help+docs+quick+start+guide"
        >
          QA Wolf platform
        </a>.
      </p>
    </div>
  );
};
