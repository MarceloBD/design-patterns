"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PatternCategory } from "@/types/pattern";
import { TrophyIcon, SparklesIcon } from "@/components/icons";
import { useGameStore } from "@/hooks/useGameStore";
import { isSecretBossUnlocked } from "@/data/secret-boss";

interface VictoryScreenProps {
  category: PatternCategory;
  score: number;
  totalQuestions: number;
  percentage: number;
  xpEarned: number;
  badgesEarned: string[];
  leveledUp: boolean;
  timeSpent: number;
  nextPatternSlug: string | null;
}

const DEFEATED_BOSS: Record<PatternCategory, { svg: React.ReactNode; name: string }> = {
  creational: {
    name: "Forge Golem",
    svg: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="24" y="16" width="32" height="28" rx="4" fill="#ff4400" opacity="0.4" />
        <rect x="28" y="20" width="8" height="8" rx="2" fill="#ffaa00" opacity="0.3" />
        <rect x="44" y="20" width="8" height="8" rx="2" fill="#ffaa00" opacity="0.3" />
        <rect x="34" y="32" width="12" height="4" rx="1" fill="#cc2200" opacity="0.3" />
        <rect x="20" y="44" width="40" height="24" rx="4" fill="#ff6600" opacity="0.3" />
        <line x1="20" y1="20" x2="60" y2="60" stroke="#ff4400" strokeWidth="3" opacity="0.6" />
        <line x1="60" y1="20" x2="20" y2="60" stroke="#ff4400" strokeWidth="3" opacity="0.6" />
      </svg>
    ),
  },
  structural: {
    name: "Crystal Sentinel",
    svg: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,8 52,24 48,24 56,44 44,44 48,40 40,20 32,40 36,44 24,44 32,24 28,24" fill="#44aaff" opacity="0.3" />
        <rect x="30" y="44" width="20" height="20" rx="2" fill="#2266cc" opacity="0.3" />
        <circle cx="36" cy="52" r="3" fill="#88ddff" opacity="0.3" />
        <circle cx="44" cy="52" r="3" fill="#88ddff" opacity="0.3" />
        <line x1="20" y1="20" x2="60" y2="60" stroke="#44aaff" strokeWidth="3" opacity="0.6" />
        <line x1="60" y1="20" x2="20" y2="60" stroke="#44aaff" strokeWidth="3" opacity="0.6" />
      </svg>
    ),
  },
  behavioral: {
    name: "Storm Wraith",
    svg: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="32" rx="20" ry="16" fill="#8800cc" opacity="0.3" />
        <circle cx="34" cy="30" r="4" fill="#ff44ff" opacity="0.3" />
        <circle cx="46" cy="30" r="4" fill="#ff44ff" opacity="0.3" />
        <path d="M20 48 Q30 44 40 50 Q50 44 60 48 Q50 56 40 52 Q30 56 20 48" fill="#6600aa" opacity="0.3" />
        <line x1="20" y1="20" x2="60" y2="60" stroke="#cc44ff" strokeWidth="3" opacity="0.6" />
        <line x1="60" y1="20" x2="20" y2="60" stroke="#cc44ff" strokeWidth="3" opacity="0.6" />
      </svg>
    ),
  },
};

export function VictoryScreen({ category, score, totalQuestions, percentage, xpEarned, badgesEarned, leveledUp, timeSpent, nextPatternSlug }: VictoryScreenProps) {
  const [phase, setPhase] = useState<"flash" | "boss" | "text" | "rewards" | "complete">("flash");
  const { player, isHydrated } = useGameStore();
  const secretBossJustUnlocked = isHydrated && isSecretBossUnlocked(player.completedPatterns);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("boss"), 500),
      setTimeout(() => setPhase("text"), 1200),
      setTimeout(() => setPhase("rewards"), 2000),
      setTimeout(() => setPhase("complete"), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const boss = DEFEATED_BOSS[category];
  const phaseIndex = ["flash", "boss", "text", "rewards", "complete"].indexOf(phase);
  const accentColor = category === "creational" ? "var(--realm-creational)" : category === "structural" ? "var(--realm-structural)" : "var(--realm-behavioral)";

  return (
    <div className="relative rounded-2xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#001a0d]/90 to-black/80 rounded-2xl"
        style={{
          animation: phaseIndex >= 0 ? "death-overlay-fade 0.6s ease-out forwards" : undefined,
        }}
      />

      {/* Green victory vignette */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 232, 70, 0.1) 100%)",
        opacity: phaseIndex >= 1 ? 1 : 0,
        transition: "opacity 0.8s",
      }} />

      {/* Particle sparkles */}
      {phaseIndex >= 2 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 5) * 15}%`,
                width: "3px",
                height: "3px",
                background: "var(--accent-green)",
                animation: `ember-rise ${2 + i * 0.3}s linear ${i * 0.2}s infinite`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Defeated boss sprite */}
      {phaseIndex >= 1 && (
        <div className="relative z-10 mb-2 animate-[death-overlay-fade_0.5s_ease-out_forwards]" style={{ opacity: 0.7 }}>
          {boss.svg}
          <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-center text-[var(--text-faint)] mt-1 line-through">
            {boss.name}
          </p>
        </div>
      )}

      {/* VICTORY text */}
      {phaseIndex >= 2 && (
        <h2
          className="relative z-10 text-3xl sm:text-4xl font-extrabold tracking-[0.15em] text-[var(--accent-green)]"
          style={{
            animation: "death-text-appear 1s ease-out forwards",
            textShadow: "0 0 0.6em rgba(0, 232, 70, 0.5), 0 0 1.5em rgba(0, 232, 70, 0.2)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          VICTORY
        </h2>
      )}

      {/* Subtitle */}
      {phaseIndex >= 2 && (
        <p className="relative z-10 text-[11px] text-[var(--text-muted)] mt-2 animate-[death-overlay-fade_0.5s_ease-out_forwards]">
          The pattern has been sealed into your grimoire
        </p>
      )}

      {/* Score */}
      {phaseIndex >= 3 && (
        <div className="relative z-10 mt-5 text-center animate-[death-overlay-fade_0.4s_ease-out_forwards]">
          <div className="flex items-center justify-center gap-3 mb-3">
            <TrophyIcon className="text-[var(--accent-green)]" size={18} />
            <span className="text-[14px] font-extrabold text-[var(--text-primary)]">
              {score}/{totalQuestions}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">({percentage}%)</span>
          </div>

          {xpEarned > 0 && (
            <p className="text-[13px] font-mono font-bold text-[var(--accent-green)] mb-1">+{xpEarned} XP</p>
          )}

          {leveledUp && (
            <p className="text-shimmer text-[12px] font-bold mb-1">
              <SparklesIcon size={11} className="inline mr-1" /> Level Up!
            </p>
          )}

          {badgesEarned.length > 0 && (
            <p className="text-[10px] font-semibold" style={{ color: accentColor }}>
              Badge: {badgesEarned.join(", ")}
            </p>
          )}

          <p className="text-[9px] text-[var(--text-faint)] mt-3">Completed in {timeSpent}s</p>

          {nextPatternSlug && (
            <Link
              href={`/quest/${nextPatternSlug}`}
              className="inline-block mt-5 px-6 py-2.5 rounded-lg bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)] text-[12px] font-semibold uppercase tracking-wider hover:bg-[var(--accent-green)]/25 transition-all"
            >
              Next Challenge &rarr;
            </Link>
          )}

          {secretBossJustUnlocked && !nextPatternSlug && (
            <div className="mt-6 pt-4 border-t border-purple-500/20 animate-[fade-in_2s_ease-out]">
              <p className="text-[10px] text-purple-300/80 italic mb-3">
                A dark presence stirs... Something ancient has awakened.
              </p>
              <Link
                href="/secret-boss"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/40 text-purple-300 text-[11px] font-semibold uppercase tracking-wider hover:from-purple-600/30 hover:to-pink-600/30 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2L13 8H18L14 12L16 18L10 14L4 18L6 12L2 8H7L10 2Z" />
                </svg>
                Enter the Unknown
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
