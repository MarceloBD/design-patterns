import { Navigation } from "@/components/Navigation";
import { SkillTree } from "@/components/interactive/SkillTree";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skill Tree - Design Patterns Quest",
  description: "Interactive skill tree showing all 22 GoF design patterns with connections, prerequisites, and progress tracking.",
};

export default function SkillTreePage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-8 pt-6">
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)] block mb-2">~ Progress Map ~</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] font-[var(--font-display)] italic mb-2">
            Skill Tree
          </h1>
          <p className="text-[13px] leading-[1.7] text-[var(--text-muted)]">
            Your journey through all 22 design patterns. Complete quests to unlock the next.
          </p>
        </header>

        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-green)] shadow-[0_0_5px_rgba(0,232,70,0.5)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Done</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-teal)] shadow-[0_0_5px_rgba(0,212,170,0.5)] animate-glow-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-muted)]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Locked</span>
          </div>
        </div>

        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--border-muted)] via-[var(--border-default)] to-[var(--border-muted)]">
          <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden p-4">
            <SkillTree />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
