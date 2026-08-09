"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { PATTERN_METADATA } from "@/data/patterns";
import Link from "next/link";
import { ReactNode } from "react";

interface QuestGateProps {
  patternSlug: string;
  category: string;
  children: ReactNode;
}

export function QuestGate({ patternSlug, category, children }: QuestGateProps) {
  const { player, isHydrated, getStatus } = useGameStore();

  if (!isHydrated) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-pulse">
        <div className="h-8 w-48 mx-auto bg-[var(--surface-overlay)] rounded mb-4" />
        <div className="h-4 w-64 mx-auto bg-[var(--surface-overlay)] rounded" />
      </div>
    );
  }

  const status = getStatus(patternSlug);

  if (status === "locked") {
    const patternMeta = PATTERN_METADATA.find((p) => p.slug === patternSlug);
    const prerequisites = patternMeta?.prerequisites ?? [];
    const unmetPrereqs = prerequisites.filter(
      (prereq) => !player.completedPatterns.includes(prereq)
    );

    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--accent-pink)]/30 via-[var(--border-default)] to-[var(--accent-pink)]/30">
          <div className="rounded-[15px] bg-[var(--surface-raised)] p-10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-5 text-[var(--accent-pink)]">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3 font-[var(--font-display)] italic">
              Quest Locked
            </h2>
            <p className="text-[12px] text-[var(--text-muted)] mb-6 leading-relaxed">
              You must complete previous quests before accessing this challenge.
            </p>

            {unmetPrereqs.length > 0 && (
              <div className="mb-6">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)] block mb-2">
                  Required Quests
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {unmetPrereqs.map((prereq) => {
                    const prereqMeta = PATTERN_METADATA.find((p) => p.slug === prereq);
                    return (
                      <span
                        key={prereq}
                        className="text-[10px] px-2 py-1 rounded border border-[var(--accent-pink)]/30 text-[var(--accent-pink)] bg-[var(--accent-pink)]/5"
                      >
                        {prereqMeta?.name ?? prereq}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <Link
              href={`/realm/${category}`}
              className="btn-primary inline-block rounded-lg text-[12px] px-6 py-2.5"
            >
              Return to Realm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
