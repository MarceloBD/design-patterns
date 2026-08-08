import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { RealmPathSelector } from "@/components/interactive/RealmPathSelector";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose Your Realm - Design Patterns Quest",
  description: "Select your path through the three realms of design patterns: Creational, Structural, and Behavioral.",
};

export default function RealmsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 relative z-10 overflow-x-hidden">
        <header className="text-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[var(--text-faint)] block mb-3">
            ~ The Crossroads ~
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-[var(--font-display)] italic mb-4">
            Choose Your Path
          </h1>
          <p className="text-[13px] leading-[1.8] text-[var(--text-muted)] max-w-md mx-auto">
            Three paths stretch before you, each leading to a different realm of knowledge.
            Where will your journey begin?
          </p>
        </header>

        <RealmPathSelector />
      </main>
      <Footer />
    </>
  );
}
