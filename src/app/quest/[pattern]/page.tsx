import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { QuestContent } from "@/components/interactive/QuestContent";
import { QuestGate } from "@/components/interactive/QuestGate";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Footer } from "@/components/Footer";
import { WeatherEffect } from "@/components/effects/WeatherEffect";
import { AmbientLight } from "@/components/effects/AmbientLight";
import { getPatternBySlug, PATTERN_METADATA, CATEGORY_INFO } from "@/data/patterns";
import { getPatternContent } from "@/content/patterns";
import { getQuizForPattern } from "@/data/quizzes";
import { ArrowLeftIcon } from "@/components/icons";
import type { Metadata } from "next";

interface QuestPageProps {
  params: Promise<{ pattern: string }>;
}

export async function generateStaticParams() {
  return PATTERN_METADATA.map((p) => ({ pattern: p.slug }));
}

export async function generateMetadata({ params }: QuestPageProps): Promise<Metadata> {
  const { pattern } = await params;
  const meta = getPatternBySlug(pattern);
  if (!meta) return { title: "Not Found" };
  return { title: `${meta.name} - Design Patterns Quest`, description: meta.hook };
}

export default async function QuestPage({ params }: QuestPageProps) {
  const { pattern } = await params;
  const meta = getPatternBySlug(pattern);

  if (!meta) {
    notFound();
  }

  const content = getPatternContent(pattern);
  const quiz = getQuizForPattern(pattern);

  if (!content || !quiz) {
    notFound();
  }

  const categoryInfo = CATEGORY_INFO[meta.category];

  return (
    <>
      <WeatherEffect realm={meta.category} />
      <AmbientLight realm={meta.category} />
      <Navigation />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <nav className="mb-6 pt-4" aria-label="Breadcrumb">
          <Link
            href={`/realm/${meta.category}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--accent-teal)] transition-colors"
          >
            <ArrowLeftIcon size={10} /> {categoryInfo.name}
          </Link>
        </nav>

        {/* Quest Header - styled as quest accepted banner */}
        <header className="mb-12">
          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-[var(--accent-teal)]/50 via-[var(--border-default)] to-[var(--accent-blue)]/50">
            <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,170,0.03),transparent_60%)]" />
              <div className="relative px-7 py-8 text-center">
                <span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--accent-teal)] mb-4">
                  <CategoryIcon iconId={categoryInfo.iconId} size={12} className="text-[var(--accent-teal)]" />
                  {categoryInfo.name} &middot; Quest {meta.order} of {PATTERN_METADATA.filter(p => p.category === meta.category).length}
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] font-[var(--font-display)] italic">
                  {meta.name}
                </h1>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="text-[10px] font-mono font-bold text-[var(--accent-green)]">+{meta.xpReward}xp</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border-muted)]" />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{meta.difficulty}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border-muted)]" />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">6 phases</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <QuestGate patternSlug={meta.slug} category={meta.category}>
          <QuestContent content={content} quiz={quiz} />
        </QuestGate>
      </main>
      <Footer />
    </>
  );
}
