"use client";

import { useState } from "react";
import { PatternQuiz } from "@/types/quiz";
import { PatternCategory } from "@/types/pattern";
import { Quiz } from "@/components/interactive/Quiz";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_INFO } from "@/data/patterns";
import { SkullIcon, CheckIcon } from "@/components/icons";

interface FinalBossContentProps {
  category: PatternCategory;
  title: string;
  lore: string;
  summary: string[];
  quiz: PatternQuiz;
}

const REALM_COLORS: Record<PatternCategory, string> = {
  creational: "var(--realm-creational)",
  structural: "var(--realm-structural)",
  behavioral: "var(--realm-behavioral)",
};

export function FinalBossContent({ category, title, lore, summary, quiz }: FinalBossContentProps) {
  const [phase, setPhase] = useState<"review" | "battle">("review");
  const realmColor = REALM_COLORS[category];
  const info = CATEGORY_INFO[category];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Boss Title */}
      <div className="text-center mb-10">
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.3em] inline-block mb-3"
          style={{ color: realmColor }}
        >
          Final Boss &middot; {info.name}
        </span>
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[var(--font-display)] italic mb-4"
          style={{ color: realmColor }}
        >
          {title}
        </h1>
        <div className="flex justify-center mb-4">
          <SkullIcon className="text-[var(--accent-pink)]" size={36} />
        </div>
        <p className="text-[12px] leading-[1.8] text-[var(--text-muted)] max-w-2xl mx-auto italic">
          {lore}
        </p>
      </div>

      {phase === "review" && (
        <div className="space-y-6">
          {/* Summary Review Card */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--border-muted)] via-[var(--border-default)] to-[var(--border-muted)]">
            <div className="rounded-[15px] bg-[var(--surface-raised)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span style={{ color: realmColor }}>
                  <CategoryIcon iconId={info.iconId} size={20} />
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  Realm Review — All Patterns
                </h2>
              </div>

              <p className="text-[11px] text-[var(--text-faint)] mb-6 uppercase tracking-wider">
                Read carefully. The final boss tests your understanding of ALL patterns in this realm.
              </p>

              <div className="space-y-4">
                {summary.map((point, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-subtle)]"
                  >
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${realmColor} 15%, transparent)`,
                        color: realmColor,
                      }}
                    >
                      {index + 1}
                    </span>
                    <p className="text-[12px] leading-[1.8] text-[var(--text-secondary)]">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {/* Warning box */}
              <div className="mt-6 p-4 rounded-lg border border-[var(--accent-pink)]/20 bg-[var(--accent-pink)]/5">
                <div className="flex items-start gap-2">
                  <SkullIcon className="text-[var(--accent-pink)] flex-shrink-0 mt-0.5" size={14} />
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--accent-pink)] mb-1">
                      Final Boss Warning
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] leading-[1.6]">
                      This challenge covers ALL patterns in the realm with harder, cross-pattern questions.
                      You need 70% to pass. Questions test pattern selection, comparison, and combination skills.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mastery checklist */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-[9px] uppercase tracking-wider text-[var(--text-faint)] block mb-3">
                  You should be able to:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Choose the right pattern for a scenario",
                    "Distinguish similar patterns from each other",
                    "Identify pattern mechanisms (inheritance vs composition)",
                    "Combine patterns to solve complex problems",
                    "Recognize real-world applications",
                    "Understand trade-offs and limitations",
                  ].map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <CheckIcon className="text-[var(--accent-green)] flex-shrink-0" size={12} />
                      <span className="text-[10px] text-[var(--text-muted)]">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Start Battle Button */}
          <div className="text-center">
            <button
              onClick={() => setPhase("battle")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${realmColor}, color-mix(in srgb, ${realmColor} 70%, #000))`,
                color: "#fff",
                boxShadow: `0 4px 24px color-mix(in srgb, ${realmColor} 30%, transparent)`,
              }}
            >
              <SkullIcon size={18} />
              <span>Challenge the Final Boss</span>
            </button>
            <p className="text-[10px] text-[var(--text-faint)] mt-3">
              10 questions &middot; 5 minutes &middot; 70% to pass
            </p>
          </div>
        </div>
      )}

      {phase === "battle" && (
        <Quiz quiz={quiz} category={category} />
      )}
    </div>
  );
}
