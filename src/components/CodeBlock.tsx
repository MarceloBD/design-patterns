"use client";

import { useState, useMemo, useCallback } from "react";
import { tokenize, TOKEN_COLORS } from "@/lib/syntax-highlighter";

interface CodeBlockProps {
  code: string;
  language?: string;
  highlightLines?: number[];
}

interface CodeRegion {
  startLine: number;
  endLine: number;
  header: string;
  isHighlighted: boolean;
}

function detectRegions(lines: string[], highlightSet: Set<number>): CodeRegion[] {
  const regions: CodeRegion[] = [];
  const blockStack: { startLine: number; header: string; braceCount: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    const isBlockStart =
      /^(export\s+)?(abstract\s+)?(class|interface|function|const\s+\w+\s*=\s*\(|async\s+function)\s/.test(trimmed) ||
      /^\w+\s*\([^)]*\)\s*[:{]/.test(trimmed) ||
      /^(private|protected|public|static|abstract|async)\s+\w+/.test(trimmed);

    if (isBlockStart && trimmed.includes("{")) {
      const braceOpen = (line.match(/{/g) || []).length;
      const braceClose = (line.match(/}/g) || []).length;
      if (braceOpen > braceClose) {
        blockStack.push({ startLine: i + 1, header: trimmed.split("{")[0].trim(), braceCount: braceOpen - braceClose });
      }
    } else if (blockStack.length > 0) {
      const current = blockStack[blockStack.length - 1];
      const braceOpen = (line.match(/{/g) || []).length;
      const braceClose = (line.match(/}/g) || []).length;
      current.braceCount += braceOpen - braceClose;

      if (current.braceCount <= 0) {
        const region: CodeRegion = {
          startLine: current.startLine,
          endLine: i + 1,
          header: current.header,
          isHighlighted: false,
        };

        for (let lineNum = region.startLine; lineNum <= region.endLine; lineNum++) {
          if (highlightSet.has(lineNum)) {
            region.isHighlighted = true;
            break;
          }
        }

        if (region.endLine - region.startLine >= 3) {
          regions.push(region);
        }
        blockStack.pop();
      }
    }
  }

  return regions;
}

export function CodeBlock({ code, language = "typescript", highlightLines }: CodeBlockProps) {
  const lines = code.split("\n");
  const highlightSet = useMemo(() => new Set(highlightLines), [highlightLines]);
  const regions = useMemo(() => detectRegions(lines, highlightSet), [lines, highlightSet]);

  const initialCollapsed = useMemo(() => {
    const collapsed = new Set<number>();
    for (const region of regions) {
      if (!region.isHighlighted && region.endLine - region.startLine >= 5) {
        collapsed.add(region.startLine);
      }
    }
    return collapsed;
  }, [regions]);

  const [collapsedRegions, setCollapsedRegions] = useState<Set<number>>(initialCollapsed);
  const [copied, setCopied] = useState(false);

  const toggleRegion = useCallback((startLine: number) => {
    setCollapsedRegions((previous) => {
      const next = new Set(previous);
      if (next.has(startLine)) {
        next.delete(startLine);
      } else {
        next.add(startLine);
      }
      return next;
    });
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const regionMap = useMemo(() => {
    const map = new Map<number, CodeRegion>();
    for (const region of regions) {
      map.set(region.startLine, region);
    }
    return map;
  }, [regions]);

  const hiddenLines = useMemo(() => {
    const hidden = new Set<number>();
    for (const region of regions) {
      if (collapsedRegions.has(region.startLine)) {
        for (let i = region.startLine + 1; i <= region.endLine; i++) {
          hidden.add(i);
        }
      }
    }
    return hidden;
  }, [regions, collapsedRegions]);

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
          <div className="flex items-center gap-3">
            {regions.length > 0 && (
              <button
                onClick={() => {
                  if (collapsedRegions.size === 0) {
                    setCollapsedRegions(new Set(regions.filter((r) => !r.isHighlighted).map((r) => r.startLine)));
                  } else {
                    setCollapsedRegions(new Set());
                  }
                }}
                className="text-[8px] font-mono text-[var(--text-faint)] hover:text-[var(--accent-teal)] transition-colors"
              >
                {collapsedRegions.size > 0 ? "Expand All" : "Collapse"}
              </button>
            )}
            <button
              onClick={handleCopy}
              className="text-[8px] font-mono text-[var(--text-faint)] hover:text-[var(--accent-teal)] transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <span className="text-[8px] font-mono text-[var(--text-faint)]">
              {lines.length} lines
            </span>
          </div>
        </div>

        <div className="flex">
          <div className="py-4 pl-3 pr-2 select-none border-r border-[var(--border-subtle)] bg-[var(--surface-deep)]">
            {lines.map((_, index) => {
              const lineNumber = index + 1;
              if (hiddenLines.has(lineNumber)) return null;
              const region = regionMap.get(lineNumber);
              const isCollapsed = region && collapsedRegions.has(lineNumber);

              return (
                <div key={index} className="text-[10px] font-mono text-[var(--text-faint)]/50 leading-[2] text-right min-w-[2ch]">
                  {region ? (
                    <button
                      onClick={() => toggleRegion(lineNumber)}
                      className="w-full text-right hover:text-[var(--accent-teal)] transition-colors"
                      title={isCollapsed ? "Expand" : "Collapse"}
                    >
                      {isCollapsed ? "▶" : lineNumber}
                    </button>
                  ) : (
                    lineNumber
                  )}
                </div>
              );
            })}
          </div>
          <pre className="flex-1 overflow-x-auto scrollbar-thin bg-[var(--surface-deep)]">
            <code className="text-[11px] font-[var(--font-mono)] leading-[2] whitespace-pre block">
              {lines.map((line, lineIndex) => {
                const lineNumber = lineIndex + 1;

                if (hiddenLines.has(lineNumber)) return null;

                const isHighlighted = highlightSet.has(lineNumber);
                const tokens = tokenize(line);
                const region = regionMap.get(lineNumber);
                const isCollapsed = region && collapsedRegions.has(lineNumber);

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
                    {isCollapsed && (
                      <button
                        onClick={() => toggleRegion(lineNumber)}
                        className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[9px] font-mono text-[var(--text-faint)] hover:text-[var(--accent-teal)] hover:border-[var(--accent-teal)]/30 transition-all"
                      >
                        <span>···</span>
                        <span className="text-[8px]">{region.endLine - region.startLine} lines</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>

        {highlightLines && highlightLines.length > 0 && (
          <div className="px-4 py-2 bg-[var(--surface-overlay)] border-t border-[var(--border-default)]">
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[var(--accent-teal)]/70">
              Highlighted lines show where the pattern is applied
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
