export const GithubCodeBlock = ({ url, language = "typescript", filename }) => {
  const displayName = filename || url.split("/").pop();
  const [code, setCode] = useState(null);
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.text();
      })
      .then((text) => setCode(text))
      .catch((err) => setError(err.message));
  }, [url]);

  useEffect(() => {
    if (!code) return;

    if (window.hljs) {
      const result = window.hljs.highlight(code, { language, ignoreIllegals: true });
      setHighlighted(result.value);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
    script.onload = () => {
      const result = window.hljs.highlight(code, { language, ignoreIllegals: true });
      setHighlighted(result.value);
    };
    document.head.appendChild(script);
  }, [code, language]);

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "red", fontFamily: "monospace", fontSize: "13px" }}>
        Failed to load {displayName}: {error}
      </div>
    );
  }

  if (!code) {
    return (
      <div style={{ padding: "1rem", color: "#888", fontFamily: "monospace", fontSize: "13px" }}>
        Loading {displayName}...
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", background: "rgba(0,0,0,0.05)", borderBottom: "1px solid rgba(0,0,0,0.1)", fontFamily: "monospace", fontSize: "12px", color: "#666" }}>
        <span>{displayName}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#666", textDecoration: "none", fontSize: "11px" }}>
          View on GitHub ↗
        </a>
      </div>
      <pre style={{ margin: 0, overflowX: "auto" }}>
        {highlighted ? (
          <code
            className={`hljs language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
            style={{ display: "block", padding: "1rem", fontSize: "13px", lineHeight: "1.6" }}
          />
        ) : (
          <code style={{ display: "block", padding: "1rem", fontSize: "13px", lineHeight: "1.6" }}>
            {code}
          </code>
        )}
      </pre>
    </div>
  );
};
