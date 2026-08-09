"use client";

import Link from "next/link";
import { useGameStore } from "@/hooks/useGameStore";
import { isSecretBossUnlocked } from "@/data/secret-boss";

export function SecretBossReveal() {
  const { player, isHydrated } = useGameStore();

  if (!isHydrated) return null;

  const unlocked = isSecretBossUnlocked(player.completedPatterns);
  const alreadyDefeated = player.completedPatterns.includes("secret-boss-pattern-god");

  if (!unlocked) return null;

  return (
    <section aria-label="Secret boss" className="mb-14 animate-[fade-in_2s_ease-out]">
      <Link
        href="/secret-boss"
        className="block relative overflow-hidden rounded-2xl p-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 hover:shadow-[0_0_60px_rgba(147,51,234,0.3)] transition-all duration-500 group"
      >
        <div className="rounded-[14px] bg-[#0a0015] p-6 sm:p-8 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
          <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="absolute w-1 h-1 rounded-full bg-purple-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.3}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-6">
            {/* Boss icon */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 shadow-[0_0_30px_rgba(147,51,234,0.4)] group-hover:scale-110 transition-transform duration-500">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-purple-300">
                  ??? Secret Challenge Unlocked ???
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 font-[var(--font-display)] italic truncate">
                {alreadyDefeated ? "The Pattern God (Defeated)" : "The Pattern God"}
              </h3>
              <p className="text-[10px] text-purple-300/60 mt-1">
                {alreadyDefeated
                  ? "You have claimed the ultimate title. Challenge again to prove your eternal mastery."
                  : "All realm bosses defeated. A final presence stirs beyond the veil..."}
              </p>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-purple-400 group-hover:translate-x-1 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
