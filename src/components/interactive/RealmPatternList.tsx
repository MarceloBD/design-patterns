"use client";

import Link from "next/link";
import { useGameStore } from "@/hooks/useGameStore";
import { useSound } from "@/hooks/useSound";
import { PatternMetadata, PatternCategory } from "@/types/pattern";
import { PatternCard } from "@/components/PatternCard";
import { SkullIcon } from "@/components/icons";
import { getFinalBossData } from "@/data/final-boss-quizzes";

interface RealmPatternListProps {
  patterns: PatternMetadata[];
  category: PatternCategory;
}

const REALM_COLORS: Record<PatternCategory, string> = {
  creational: "var(--realm-creational)",
  structural: "var(--realm-structural)",
  behavioral: "var(--realm-behavioral)",
};

export function RealmPatternList({ patterns, category }: RealmPatternListProps) {
  const { getStatus, player, isHydrated } = useGameStore();
  const { play, startMusic } = useSound();

  const allCompleted = isHydrated && patterns.every(
    (pattern) => player.completedPatterns.includes(pattern.slug)
  );
  const bossData = getFinalBossData(category);
  const realmColor = REALM_COLORS[category];

  function handleLessonClick() {
    play("click");
    startMusic(category);
  }

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pattern) => (
          <div
            key={pattern.slug}
            className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl p-5 animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-hydrated="true">
        {patterns.map((pattern) => (
          <div key={pattern.slug} onClick={handleLessonClick}>
            <PatternCard pattern={pattern} status={getStatus(pattern.slug)} />
          </div>
        ))}
      </div>

      {/* Final Boss Card */}
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
        <Link
          href={`/final-boss/${category}`}
          onClick={() => play("click")}
          className={`block rounded-2xl p-[1px] transition-all duration-300 ${
            allCompleted
              ? "bg-gradient-to-r from-[var(--accent-pink)] via-[var(--border-default)] to-[var(--accent-pink)] hover:shadow-[0_0_30px_rgba(255,51,102,0.15)]"
              : "bg-gradient-to-r from-[var(--border-subtle)] via-[var(--border-default)] to-[var(--border-subtle)] opacity-60"
          }`}
        >
          <div className="rounded-[15px] bg-[var(--surface-raised)] p-6 flex items-center gap-5">
            <div
              className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                allCompleted ? "animate-pulse" : ""
              }`}
              style={{
                background: allCompleted
                  ? `linear-gradient(135deg, var(--accent-pink), color-mix(in srgb, ${realmColor} 50%, var(--accent-pink)))`
                  : "var(--surface-overlay)",
              }}
            >
              <SkullIcon
                size={24}
                className={allCompleted ? "text-white" : "text-[var(--text-faint)]"}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-pink)]">
                  Final Boss
                </span>
                {!allCompleted && (
                  <span className="text-[7px] font-medium uppercase tracking-wider text-[var(--text-faint)] px-1.5 py-0.5 rounded bg-[var(--surface-overlay)]">
                    Locked
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight truncate">
                {bossData.title}
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                {allCompleted
                  ? "All patterns mastered. The final challenge awaits."
                  : `Complete all ${patterns.length} quests to unlock the final boss.`}
              </p>
            </div>

            <div className="flex-shrink-0 text-[var(--text-faint)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
