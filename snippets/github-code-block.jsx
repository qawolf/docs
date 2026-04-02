import { useState, useEffect } from "react";

const loadHighlighter = async () => {
  const [{ Light: SyntaxHighlighter }, { default: ts }, { githubGist }] = await Promise.all([
    import("https://esm.sh/react-syntax-highlighter"),
    import("https://esm.sh/react-syntax-highlighter/dist/esm/languages/hljs/typescript"),
    import("https://esm.sh/react-syntax-highlighter/dist/esm/styles/hljs/github-gist"),
  ]);
  SyntaxHighlighter.registerLanguage("typescript", ts);
  return { SyntaxHighlighter, githubGist };
};

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
  const [style, setStyle] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.text();
      })
      .then(setCode)
      .catch((err) => setError(err.message));

    loadHighlighter()
      .then(({ SyntaxHighlighter, githubGist }) => {
        setHighlighter(() => SyntaxHighlighter);
        setStyle(githubGist);
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
        style={style}
        customStyle={{ margin: 0, borderRadius: 0 }}
        className="text-sm leading-relaxed"
        showLineNumbers
      >
        {code}
      </Highlighter>
    </div>
  );
};
