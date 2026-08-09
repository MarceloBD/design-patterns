"use client";

import { PatternComparison } from "@/data/pattern-comparisons";
import Link from "next/link";

interface PatternComparisonCardProps {
  comparison: PatternComparison;
  currentSlug: string;
}

export function PatternComparisonCard({ comparison, currentSlug }: PatternComparisonCardProps) {
  const isPatternA = comparison.patternA === currentSlug;
  const otherSlug = isPatternA ? comparison.patternB : comparison.patternA;
  const otherName = isPatternA
    ? comparison.patternB.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : comparison.patternA.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="rounded-xl p-[1px] bg-gradient-to-br from-[var(--accent-blue)]/30 via-[var(--border-subtle)] to-[var(--accent-purple)]/20">
      <div className="rounded-[11px] bg-[var(--surface-raised)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[var(--accent-blue)]" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-blue)]">
                Similar Pattern
              </span>
            </div>
            <Link
              href={`/quest/${otherSlug}`}
              className="text-[9px] font-semibold text-[var(--text-faint)] hover:text-[var(--accent-blue)] transition-colors"
            >
              Go to {otherName} →
            </Link>
          </div>
          <h4 className="text-[13px] font-bold text-[var(--text-primary)] mt-2">{comparison.title}</h4>
          <p className="text-[11px] leading-[1.8] text-[var(--text-muted)] mt-1">{comparison.confusion}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="px-4 py-2.5 text-left text-[9px] uppercase tracking-[0.15em] text-[var(--text-faint)] font-semibold w-[25%]">
                  Aspect
                </th>
                <th className="px-4 py-2.5 text-left text-[9px] uppercase tracking-[0.15em] font-semibold w-[37.5%]" style={{ color: "var(--accent-teal)" }}>
                  {comparison.patternA.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </th>
                <th className="px-4 py-2.5 text-left text-[9px] uppercase tracking-[0.15em] font-semibold w-[37.5%]" style={{ color: "var(--accent-purple)" }}>
                  {comparison.patternB.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.differences.map((diff, index) => (
                <tr key={index} className="border-b border-[var(--border-subtle)]/50">
                  <td className="px-4 py-2.5 font-semibold text-[var(--text-muted)]">{diff.aspect}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)] leading-[1.6]">{diff.patternAAnswer}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)] leading-[1.6]">{diff.patternBAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-1 block" style={{ color: "var(--accent-teal)" }}>
              Use {comparison.patternA.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} when...
            </span>
            <p className="text-[10px] leading-[1.7] text-[var(--text-muted)]">{comparison.whenToUse.patternA}</p>
          </div>
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-1 block" style={{ color: "var(--accent-purple)" }}>
              Use {comparison.patternB.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} when...
            </span>
            <p className="text-[10px] leading-[1.7] text-[var(--text-muted)]">{comparison.whenToUse.patternB}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
