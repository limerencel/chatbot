import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";

// This component manages its OWN "copied" state
export const CodeBlock = ({
  node,
  inline,
  className,
  children,
  ...props
}: any) => {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const match = /language-(\w+)/.exec(className || "");
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  // 1. Handle Inline Code (e.g., `const x = 1`)
  if (inline || !match) {
    return (
      <code
        className="bg-muted text-primary px-1 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  // 2. Handle Block Code
  return (
    <div className="rounded-md overflow-hidden my-2">
      <div
        className="bg-muted text-muted-foreground text-xs px-4 py-1 flex justify-between items-center"
      >
        <span>{match[1]}</span>
        <button
          className="cursor-pointer text-xs transition-colors hover:text-foreground"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        style={resolvedTheme === "dark" ? dracula : prism}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: "1.5rem",
        }}
        {...props}
      >
        {codeContent}
      </SyntaxHighlighter>
    </div>
  );
};
