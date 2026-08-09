"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { isSecretBossUnlocked } from "@/data/secret-boss";
import { SecretBossArena } from "@/components/interactive/SecretBossArena";
import { PatternQuiz } from "@/types/quiz";
import Link from "next/link";

interface SecretBossGateProps {
  quiz: PatternQuiz;
}

export function SecretBossGate({ quiz }: SecretBossGateProps) {
  const { player, isHydrated } = useGameStore();

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const unlocked = isSecretBossUnlocked(player.completedPatterns);

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-400">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3 font-[var(--font-display)] italic">
            Sealed Chamber
          </h1>
          <p className="text-[12px] text-[var(--text-muted)] leading-[1.8] mb-6">
            This challenge is sealed behind ancient wards. Only those who have conquered the
            Final Boss of every realm may enter. Defeat the Architect of Genesis, the Weaver of Bonds,
            and the Conductor of Storms to break the seal.
          </p>
          <div className="space-y-2 mb-8">
            {[
              { slug: "final-boss-creational", label: "Creational Realm Boss", color: "var(--realm-creational)" },
              { slug: "final-boss-structural", label: "Structural Realm Boss", color: "var(--realm-structural)" },
              { slug: "final-boss-behavioral", label: "Behavioral Realm Boss", color: "var(--realm-behavioral)" },
            ].map(({ slug, label, color }) => {
              const completed = player.completedPatterns.includes(slug);
              return (
                <div
                  key={slug}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-subtle)]"
                >
                  {completed ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill={color}>
                      <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5L8 1z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-faint)" strokeWidth="1">
                      <rect x="3" y="6" width="10" height="8" rx="1" />
                      <path d="M5 6V4a3 3 0 0 1 6 0v2" />
                    </svg>
                  )}
                  <span className={`text-[11px] ${completed ? "text-[var(--text-primary)]" : "text-[var(--text-faint)]"}`}>
                    {label}
                  </span>
                  {completed && (
                    <span className="ml-auto text-[8px] uppercase tracking-wider font-bold" style={{ color }}>
                      Defeated
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <Link
            href="/realms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] text-[12px] font-semibold hover:border-purple-500/40 transition-colors"
          >
            Return to Realms
          </Link>
        </div>
      </div>
    );
  }

  return <SecretBossArena quiz={quiz} />;
}
