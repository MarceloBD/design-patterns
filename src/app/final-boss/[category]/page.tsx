import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { WeatherEffect } from "@/components/effects/WeatherEffect";
import { AmbientLight } from "@/components/effects/AmbientLight";
import { FinalBossContent } from "@/components/interactive/FinalBossContent";
import { getFinalBossData } from "@/data/final-boss-quizzes";
import { getAllCategories, CATEGORY_INFO } from "@/data/patterns";
import { PatternCategory } from "@/types/pattern";
import type { Metadata } from "next";

interface FinalBossPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: FinalBossPageProps): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_INFO[category as PatternCategory];
  if (!info) return { title: "Not Found" };
  const bossData = getFinalBossData(category as PatternCategory);
  return {
    title: `${bossData.title} - Final Boss - ${info.name}`,
    description: `Final challenge for the ${info.name}. Prove your mastery of all ${category} patterns.`,
  };
}

export default async function FinalBossPage({ params }: FinalBossPageProps) {
  const { category } = await params;
  const validCategories = getAllCategories();

  if (!validCategories.includes(category as PatternCategory)) {
    notFound();
  }

  const typedCategory = category as PatternCategory;
  const bossData = getFinalBossData(typedCategory);

  return (
    <>
      <WeatherEffect realm={typedCategory} />
      <AmbientLight realm={typedCategory} />
      <Navigation />
      <main className="relative z-10 min-h-screen">
        <FinalBossContent
          category={typedCategory}
          title={bossData.title}
          lore={bossData.lore}
          summary={bossData.summary}
          quiz={bossData.quiz}
        />
      </main>
      <Footer />
    </>
  );
}
