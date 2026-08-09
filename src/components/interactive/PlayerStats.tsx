"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { FlameIcon } from "@/components/icons";
import { HeroCustomization } from "@/components/interactive/HeroCustomization";

export function PlayerStats() {
  const { player, isHydrated } = useGameStore();

  if (!isHydrated) {
    return (
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--border-muted)] via-[var(--border-subtle)] to-[var(--border-muted)]">
        <div className="rounded-[15px] bg-[var(--surface-raised)] p-7 animate-pulse">
          <div className="h-36" />
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round((player.completedPatterns.length / 22) * 100);
  const isActive = player.completedPatterns.length > 0;

  return (
    <div
      data-hydrated="true"
      className={
        "rounded-2xl p-[1px] " +
        (isActive
          ? "bg-gradient-to-br from-[var(--accent-teal)] via-[var(--accent-blue)] to-[var(--accent-teal-dark)]"
          : "bg-gradient-to-br from-[var(--border-muted)] via-[var(--border-subtle)] to-[var(--border-muted)]")
      }
    >
      <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--accent-teal)] opacity-[0.03]" />
        <div className="absolute left-1/3 -bottom-16 h-44 w-44 rounded-full bg-[var(--accent-blue)] opacity-[0.02]" />

        <div className="relative">
          <div className="p-7 pb-0">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                Character Sheet
              </span>
              {player.currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-pink)]">
                  <FlameIcon size={11} className="text-[var(--accent-pink)]" />
                  {player.currentStreak} day streak
                </span>
              )}
            </div>

            <h3 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mt-2 mb-1">
              {player.playerName || "Unknown"}
            </h3>
          </div>

          {/* Hero Customization */}
          <div className="px-7 py-4 border-t border-[var(--border-default)]">
            <HeroCustomization />
          </div>

          <div className="border-t border-[var(--border-default)] px-7 py-4 flex items-center">
            <div className="flex-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-[var(--accent-green)]">
                {player.completedPatterns.length}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">patterns</span>
            </div>
            <div className="w-px h-5 bg-[var(--border-default)] mx-4" />
            <div className="flex-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-[var(--accent-blue)]">
                {player.badges.length}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">badges</span>
            </div>
            <div className="w-px h-5 bg-[var(--border-default)] mx-4" />
            <div className="flex-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-[var(--accent-gold,#ffc107)]">
                {player.coins}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">coins</span>
            </div>
            <div className="w-px h-5 bg-[var(--border-default)] mx-4" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-[var(--text-primary)]">
                {progressPercentage}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">% done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
