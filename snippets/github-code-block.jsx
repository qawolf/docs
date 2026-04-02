// Note: useState and useEffect are injected globally by Mintlify's JSX runtime.
// react-syntax-highlighter is loaded via an injected <script type="module"> tag
// because Mintlify's MDX compiler does not support dynamic import() calls.

const loadSyntaxHighlighter = () =>
  new Promise((resolve, reject) => {
    if (window.__SyntaxHighlighter) return resolve(window.__SyntaxHighlighter);
    const s = document.createElement("script");
    s.type = "module";
    s.textContent = [
      'import { Light as SHL } from "https://esm.sh/react-syntax-highlighter";',
      'import ts from "https://esm.sh/react-syntax-highlighter/dist/esm/languages/hljs/typescript";',
      'import { githubGist } from "https://esm.sh/react-syntax-highlighter/dist/esm/styles/hljs/github-gist";',
      'SHL.registerLanguage("typescript", ts);',
      'window.__SyntaxHighlighter = { SHL, githubGist };',
      'window.dispatchEvent(new Event("syntaxHighlighterReady"));',
    ].join("\n");
    window.addEventListener("syntaxHighlighterReady", () => resolve(window.__SyntaxHighlighter), { once: true });
    s.onerror = reject;
    document.head.appendChild(s);
  });

export const GithubCodeBlock = ({
  url,
  language = "typescript",
  filename,
  badgeUrl,
}) => {
  const displayName = filename || url.split("/").pop();
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);
  const [Highlighter, setHighlighter] = useState(null);
  const [hlStyle, setHlStyle] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch: " + res.status);
        return res.text();
      })
      .then(setCode)
      .catch((err) => setError(err.message));

    loadSyntaxHighlighter()
      .then(({ SHL, githubGist }) => {
        setHighlighter(() => SHL);
        setHlStyle(githubGist);
      })
      .catch((err) => setError(err.message));
  }, [url]);

  if (error) {
    return (
      <p className="font-mono text-sm text-red-500 p-4">
        Failed to load {displayName}: {error}
      </p>
    );
  }

  if (!code || !Highlighter) {
    return (
      <p className="font-mono text-sm text-zinc-400 p-4">
        Loading {displayName}...
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{displayName}</span>
          {badgeUrl && (
            <img src={badgeUrl} alt="CI status" className="h-4" />
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 no-underline"
        >
          View on GitHub ↗
        </a>
      </div>
      <Highlighter
        language={language}
        style={hlStyle}
        customStyle={{ margin: 0, borderRadius: 0 }}
        className="text-sm leading-relaxed"
        showLineNumbers
      >
        {code}
      </Highlighter>
    </div>
  );
};
