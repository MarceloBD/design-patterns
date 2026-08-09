import { Navigation } from "@/components/Navigation";
import { PlayerStats } from "@/components/interactive/PlayerStats";
import { RealmCard } from "@/components/interactive/RealmCard";
import { NamePrompt } from "@/components/interactive/NamePrompt";
import { ProgressSync } from "@/components/interactive/ProgressSync";
import { SecretBossReveal } from "@/components/interactive/SecretBossReveal";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <NamePrompt />
      <Navigation />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <header className="text-center py-16 sm:py-20">
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)] block mb-4">
            ~ A Developer&apos;s Grimoire ~
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[0.95] mb-3 font-[var(--font-display)] italic">
            Design Patterns
          </h1>
          <h2 className="text-shimmer text-[16px] font-extrabold tracking-[0.3em] uppercase mb-8">
            Quest
          </h2>
          <p className="text-[14px] leading-[1.9] text-[var(--text-muted)] max-w-lg mx-auto mb-10">
            Master all 22 Gang of Four design patterns through an RPG adventure.
            Earn XP, unlock achievements, and ascend through the ranks.
          </p>
          <Link href="/skill-tree" className="btn-primary inline-block rounded-lg">
            View Skill Tree
          </Link>
        </header>

        <div className="separator-dungeon mb-14" />

        <section className="mb-14" aria-label="Player statistics">
          <PlayerStats />
        </section>

        <div className="separator-dungeon mb-14" />

        <section aria-label="Pattern realms">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-teal)] block mb-5">
            &gt; Choose Your Realm
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RealmCard category="creational" />
            <RealmCard category="structural" />
            <RealmCard category="behavioral" />
          </div>
        </section>

        <div className="separator-dungeon my-14" />

        <SecretBossReveal />

        <section aria-label="Progress sync">
          <ProgressSync />
        </section>
      </main>
      <Footer />
    </>
  );
}
