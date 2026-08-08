"use client";

import Link from "next/link";
import { PatternCategory } from "@/types/pattern";
import { useGameStore } from "@/hooks/useGameStore";
import { CATEGORY_INFO } from "@/data/patterns";
import { ProgressBar } from "./ProgressBar";
import { CategoryIcon } from "@/components/CategoryIcon";

interface RealmCardProps {
  category: PatternCategory;
}

const REALM_GRADIENT: Record<PatternCategory, string> = {
  creational: "from-[var(--realm-creational)] via-[var(--realm-creational-dark)] to-[var(--realm-creational)]",
  structural: "from-[var(--realm-structural)] via-[var(--realm-structural-dark)] to-[var(--realm-structural)]",
  behavioral: "from-[var(--realm-behavioral)] via-[var(--realm-behavioral-dark)] to-[var(--realm-behavioral)]",
};

const REALM_ORB: Record<PatternCategory, string> = {
  creational: "bg-[var(--realm-creational)]",
  structural: "bg-[var(--realm-structural)]",
  behavioral: "bg-[var(--realm-behavioral)]",
};

export function RealmCard({ category }: RealmCardProps) {
  const { getProgress, isHydrated } = useGameStore();
  const info = CATEGORY_INFO[category];
  const progress = getProgress(category);
  const hasProgress = isHydrated && progress.completed > 0;

  return (
    <Link href={`/realm/${category}`} className="group block">
      <div className={
        "rounded-2xl p-[1px] transition-all duration-300 bg-gradient-to-br " +
        (hasProgress
          ? REALM_GRADIENT[category]
          : "from-[var(--border-muted)] via-[var(--border-subtle)] to-[var(--border-muted)] group-hover:from-[var(--border-default)] group-hover:via-[var(--border-muted)] group-hover:to-[var(--border-default)]")
      }>
        <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
          <div className={`absolute -right-14 -top-14 h-44 w-44 rounded-full ${REALM_ORB[category]} opacity-[0.035]`} />
          <div className={`absolute -left-8 bottom-0 h-28 w-28 rounded-full ${REALM_ORB[category]} opacity-[0.02]`} />

          <div className="relative p-5 group-hover:translate-y-[-1px] transition-transform duration-200">
            <div className="flex items-start justify-between mb-3">
              <CategoryIcon iconId={info.iconId} size={20} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                {progress.total} quests
              </span>
            </div>

            <h3 className="text-[17px] font-extrabold tracking-tight text-[var(--text-primary)] mb-1.5">
              {info.name}
            </h3>
            <p className="text-[12px] leading-[1.7] text-[var(--text-muted)] mb-4">
              {info.description}
            </p>

            {isHydrated && (
              <ProgressBar
                percentage={progress.percentage}
                label={`${progress.completed}/${progress.total}`}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
