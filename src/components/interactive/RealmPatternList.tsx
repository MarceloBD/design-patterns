"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { useSound } from "@/hooks/useSound";
import { PatternMetadata, PatternCategory } from "@/types/pattern";
import { PatternCard } from "@/components/PatternCard";

interface RealmPatternListProps {
  patterns: PatternMetadata[];
  category: PatternCategory;
}

export function RealmPatternList({ patterns, category }: RealmPatternListProps) {
  const { getStatus, isHydrated } = useGameStore();
  const { play, startMusic } = useSound();

  function handleLessonClick() {
    play("click");
    startMusic(category);
  }

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pattern) => (
          <div
            key={pattern.slug}
            className="bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl p-5 animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-hydrated="true">
      {patterns.map((pattern) => (
        <div key={pattern.slug} onClick={handleLessonClick}>
          <PatternCard pattern={pattern} status={getStatus(pattern.slug)} />
        </div>
      ))}
    </div>
  );
}
