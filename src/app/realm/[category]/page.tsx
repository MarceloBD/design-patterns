import { notFound } from "next/navigation";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { RealmPatternList } from "@/components/interactive/RealmPatternList";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Footer } from "@/components/Footer";
import { WeatherEffect } from "@/components/effects/WeatherEffect";
import { AmbientLight } from "@/components/effects/AmbientLight";
import { RealmMusic } from "@/components/effects/RealmMusic";
import { getPatternsByCategory, CATEGORY_INFO, getAllCategories } from "@/data/patterns";
import { PatternCategory } from "@/types/pattern";
import type { Metadata } from "next";

interface RealmPageProps {
  params: Promise<{ category: string }>;
}

const REALM_THEME: Record<string, { gradient: string; bgStyle: React.CSSProperties; accentColor: string; glowColor: string; lore: string }> = {
  creational: {
    gradient: "from-[var(--realm-creational)] via-[var(--border-default)] to-[var(--realm-creational-dark)]",
    bgStyle: { background: "linear-gradient(180deg, #1a0500 0%, #0d0400 40%, var(--surface-base) 100%)" },
    accentColor: "var(--realm-creational)",
    glowColor: "rgba(255, 136, 68, 0.08)",
    lore: "Deep beneath volcanic peaks, ancient forges burn eternal.",
  },
  structural: {
    gradient: "from-[var(--realm-structural)] via-[var(--border-default)] to-[var(--realm-structural-dark)]",
    bgStyle: { background: "linear-gradient(180deg, #000a1a 0%, #000812 40%, var(--surface-base) 100%)" },
    accentColor: "var(--realm-structural)",
    glowColor: "rgba(68, 170, 255, 0.08)",
    lore: "Impossibly tall spires of crystallized logic pierce the frozen sky.",
  },
  behavioral: {
    gradient: "from-[var(--realm-behavioral)] via-[var(--border-default)] to-[var(--realm-behavioral-dark)]",
    bgStyle: { background: "linear-gradient(180deg, #0d0019 0%, #080012 40%, var(--surface-base) 100%)" },
    accentColor: "var(--realm-behavioral)",
    glowColor: "rgba(204, 68, 255, 0.08)",
    lore: "Thunder never rests in this tempest realm.",
  },
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: RealmPageProps): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_INFO[category as PatternCategory];
  if (!info) return { title: "Not Found" };
  return { title: `${info.name} - Design Patterns Quest`, description: info.description };
}

export default async function RealmPage({ params }: RealmPageProps) {
  const { category } = await params;
  const validCategories = getAllCategories();

  if (!validCategories.includes(category as PatternCategory)) {
    notFound();
  }

  const typedCategory = category as PatternCategory;
  const info = CATEGORY_INFO[typedCategory];
  const patterns = getPatternsByCategory(typedCategory);
  const theme = REALM_THEME[typedCategory];

  return (
    <>
      <WeatherEffect realm={typedCategory} />
      <AmbientLight realm={typedCategory} />
      <RealmMusic realm={typedCategory} />
      <Navigation />
      <main className="relative z-10">
        {/* Themed hero header with background */}
        <div className="relative overflow-hidden" style={theme.bgStyle}>
          {/* Background landscape image */}
          <Image
            src={`/realms/${typedCategory}.svg`}
            alt=""
            fill
            className="object-cover opacity-50"
            priority
          />

          {/* Ambient radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.glowColor}, transparent 60%)` }} />

          <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span style={{ color: theme.accentColor }}>
                <CategoryIcon iconId={info.iconId} size={28} />
              </span>
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.25em] px-2 py-0.5 rounded border"
                style={{ color: theme.accentColor, borderColor: `color-mix(in srgb, ${theme.accentColor} 30%, transparent)`, background: `color-mix(in srgb, ${theme.accentColor} 5%, transparent)` }}
              >
                {patterns.length} quests
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[var(--font-display)] italic mb-3"
              style={{ color: theme.accentColor }}
            >
              {info.name}
            </h1>

            <p className="text-[13px] leading-[1.8] text-[var(--text-muted)] max-w-lg mb-2">
              {info.description}
            </p>
            <p className="text-[11px] italic text-[var(--text-faint)]">{theme.lore}</p>

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-teal)] mt-4 block">
              &gt; Complete in order to unlock
            </span>
          </div>

          {/* Bottom fade to page bg */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--surface-base)] to-transparent" />
        </div>

        {/* Pattern list */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-12 pt-4">
          <section aria-label="Pattern list">
            <RealmPatternList patterns={patterns} category={typedCategory} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
