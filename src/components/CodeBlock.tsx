"use client";

import { useState } from "react";
import { tokenize, TOKEN_COLORS } from "@/lib/syntax-highlighter";

interface CodeBlockProps {
  code: string;
  language?: string;
  highlightLines?: number[];
}

export function CodeBlock({ code, language = "typescript", highlightLines }: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split("\n");
  const isLong = lines.length > 25;
  const visibleLines = isLong && !isExpanded ? lines.slice(0, 25) : lines;
  const highlightSet = new Set(highlightLines);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--accent-teal-dark)]/30 via-[var(--border-default)] to-[var(--realm-structural)]/20 opacity-60 blur-[1px] group-hover:opacity-80 transition-opacity" />
      <div className="relative rounded-xl overflow-hidden border border-[var(--border-default)]">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--surface-overlay)] border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-pink)]/50" />
              <div className="w-2 h-2 rounded-full bg-[var(--accent-teal)]/50" />
              <div className="w-2 h-2 rounded-full bg-[var(--accent-green)]/50" />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">
              {language}
            </span>
          </div>
          <span className="text-[8px] font-mono text-[var(--text-faint)]">
            {lines.length} lines
          </span>
        </div>

        <div className="flex">
          <div className="py-4 pl-3 pr-2 select-none border-r border-[var(--border-subtle)] bg-[var(--surface-deep)]">
            {visibleLines.map((_, index) => (
              <div key={index} className="text-[10px] font-mono text-[var(--text-faint)]/50 leading-[2] text-right min-w-[2ch]">
                {index + 1}
              </div>
            ))}
          </div>
          <pre className="flex-1 overflow-x-auto scrollbar-thin bg-[var(--surface-deep)]">
            <code className="text-[11px] font-[var(--font-mono)] leading-[2] whitespace-pre block">
              {visibleLines.map((line, lineIndex) => {
                const lineNumber = lineIndex + 1;
                const isHighlighted = highlightSet.has(lineNumber);
                const tokens = tokenize(line);

                return (
                  <div
                    key={lineIndex}
                    className={`px-4 ${isHighlighted ? "bg-[var(--accent-teal)]/[0.06] border-l-2 border-l-[var(--accent-teal)]/60" : ""}`}
                  >
                    {tokens.length === 0 ? (
                      <span>{"\n"}</span>
                    ) : (
                      tokens.map((token, tokenIndex) => (
                        <span
                          key={tokenIndex}
                          style={{
                            color: TOKEN_COLORS[token.type],
                            fontStyle: token.type === "comment" ? "italic" : undefined,
                          }}
                        >
                          {token.value}
                        </span>
                      ))
                    )}
                  </div>
                );
              })}
              {isLong && !isExpanded && (
                <div className="px-4 text-[var(--text-faint)]">...</div>
              )}
            </code>
          </pre>
        </div>

        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 bg-[var(--surface-overlay)] border-t border-[var(--border-default)] text-[9px] font-semibold uppercase tracking-wider text-[var(--accent-teal)] hover:text-[var(--accent-teal-light)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            {isExpanded ? "Collapse" : `Show all ${lines.length} lines`}
          </button>
        )}
      </div>
    </div>
  );
}
