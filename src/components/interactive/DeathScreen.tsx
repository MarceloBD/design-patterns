"use client";

import { useEffect, useState } from "react";
import { PatternCategory } from "@/types/pattern";

interface DeathScreenProps {
  category: PatternCategory;
  onRetry: () => void;
}

const BOSS_SPRITES: Record<PatternCategory, { svg: React.ReactNode; name: string }> = {
  creational: {
    name: "Forge Golem",
    svg: (
      <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="24" y="16" width="32" height="28" rx="4" fill="#ff4400" opacity="0.8" />
        <rect x="28" y="20" width="8" height="8" rx="2" fill="#ffaa00" />
        <rect x="44" y="20" width="8" height="8" rx="2" fill="#ffaa00" />
        <rect x="34" y="32" width="12" height="4" rx="1" fill="#cc2200" />
        <rect x="20" y="44" width="40" height="24" rx="4" fill="#ff6600" opacity="0.7" />
        <rect x="16" y="48" width="8" height="16" rx="2" fill="#ff4400" opacity="0.6" />
        <rect x="56" y="48" width="8" height="16" rx="2" fill="#ff4400" opacity="0.6" />
        <rect x="28" y="68" width="10" height="10" rx="2" fill="#cc4400" opacity="0.6" />
        <rect x="42" y="68" width="10" height="10" rx="2" fill="#cc4400" opacity="0.6" />
      </svg>
    ),
  },
  structural: {
    name: "Crystal Sentinel",
    svg: (
      <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,8 52,24 48,24 56,44 44,44 48,40 40,20 32,40 36,44 24,44 32,24 28,24" fill="#44aaff" opacity="0.8" />
        <rect x="30" y="44" width="20" height="20" rx="2" fill="#2266cc" opacity="0.7" />
        <circle cx="36" cy="52" r="3" fill="#88ddff" />
        <circle cx="44" cy="52" r="3" fill="#88ddff" />
        <rect x="36" y="58" width="8" height="2" rx="1" fill="#44aaff" />
        <rect x="26" y="48" width="6" height="12" rx="2" fill="#2266cc" opacity="0.5" />
        <rect x="48" y="48" width="6" height="12" rx="2" fill="#2266cc" opacity="0.5" />
        <rect x="32" y="64" width="7" height="10" rx="2" fill="#1a4488" opacity="0.6" />
        <rect x="41" y="64" width="7" height="10" rx="2" fill="#1a4488" opacity="0.6" />
      </svg>
    ),
  },
  behavioral: {
    name: "Storm Wraith",
    svg: (
      <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="32" rx="20" ry="16" fill="#8800cc" opacity="0.7" />
        <circle cx="34" cy="30" r="4" fill="#ff44ff" opacity="0.8" />
        <circle cx="46" cy="30" r="4" fill="#ff44ff" opacity="0.8" />
        <path d="M34 38 Q40 44 46 38" stroke="#cc44ff" strokeWidth="2" fill="none" />
        <path d="M20 48 Q30 44 40 50 Q50 44 60 48 Q50 56 40 52 Q30 56 20 48" fill="#6600aa" opacity="0.5" />
        <path d="M24 52 L28 60 L20 58 Z" fill="#8800cc" opacity="0.4" />
        <path d="M56 52 L52 60 L60 58 Z" fill="#8800cc" opacity="0.4" />
        <path d="M36 52 L40 72 L44 52" fill="#6600aa" opacity="0.3" />
        <circle cx="40" cy="28" r="22" fill="none" stroke="#cc44ff" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
      </svg>
    ),
  },
};

export function DeathScreen({ category, onRetry }: DeathScreenProps) {
  const [phase, setPhase] = useState<"shake" | "overlay" | "text" | "monster" | "retry">("shake");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("overlay"), 400),
      setTimeout(() => setPhase("text"), 1000),
      setTimeout(() => setPhase("monster"), 1800),
      setTimeout(() => setPhase("retry"), 2600),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const boss = BOSS_SPRITES[category];
  const phaseIndex = ["shake", "overlay", "text", "monster", "retry"].indexOf(phase);

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[360px] flex flex-col items-center justify-center"
      style={{
        animation: phase === "shake" ? "screen-shake 0.4s ease" : undefined,
      }}
    >
      {/* Dark background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#1a0010]/95 to-black/90 rounded-2xl"
        style={{
          animation: phaseIndex >= 1 ? "death-overlay-fade 0.8s ease-out forwards" : undefined,
          opacity: phaseIndex >= 1 ? undefined : 0,
        }}
      />

      {/* Red vignette edge */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(255, 51, 102, 0.15) 100%)",
        opacity: phaseIndex >= 1 ? 1 : 0,
        transition: "opacity 0.5s",
      }} />

      {/* Monster sprite */}
      {phaseIndex >= 3 && (
        <div className="relative z-10 mb-4 animate-[death-overlay-fade_0.4s_ease-out_forwards]">
          {boss.svg}
          <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-center text-[var(--text-faint)] mt-1">
            {boss.name}
          </p>
        </div>
      )}

      {/* DEFEATED text */}
      {phaseIndex >= 2 && (
        <h2
          className="relative z-10 text-3xl sm:text-4xl font-extrabold tracking-[0.15em] text-[var(--accent-pink)]"
          style={{
            animation: "death-text-appear 1.2s ease-out forwards",
            textShadow: "0 0 0.6em rgba(255, 51, 102, 0.6), 0 0 1.5em rgba(255, 51, 102, 0.2)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          DEFEATED
        </h2>
      )}

      {/* Subtitle */}
      {phaseIndex >= 3 && (
        <p className="relative z-10 text-[11px] text-[var(--text-faint)] mt-2 animate-[death-overlay-fade_0.5s_ease-out_forwards]">
          The pattern remains unsealed...
        </p>
      )}

      {/* Retry button */}
      {phaseIndex >= 4 && (
        <button
          onClick={onRetry}
          className="relative z-10 mt-6 px-6 py-2.5 rounded-lg bg-[var(--accent-pink)]/15 border border-[var(--accent-pink)]/40 text-[var(--accent-pink)] text-[12px] font-semibold uppercase tracking-wider hover:bg-[var(--accent-pink)]/25 transition-all"
          style={{ animation: "retry-pulse 2s ease-in-out infinite" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
