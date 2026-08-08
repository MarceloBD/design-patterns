import Link from "next/link";
import { PatternMetadata, PatternStatus } from "@/types/pattern";
import { LockIcon, CheckIcon } from "@/components/icons";

interface PatternCardProps {
  pattern: PatternMetadata;
  status: PatternStatus;
}

const STATUS_GRADIENT: Record<PatternStatus, string> = {
  locked: "from-[var(--border-subtle)] via-[var(--surface-raised)] to-[var(--border-subtle)]",
  available: "from-[var(--accent-teal)] via-[var(--accent-teal-dark)] to-[var(--accent-blue)]",
  "in-progress": "from-[var(--accent-teal-light)] via-[var(--accent-teal)] to-[var(--accent-teal-dark)]",
  completed: "from-[var(--accent-green)] via-[var(--accent-green-dark)] to-[var(--accent-teal)]",
};

export function PatternCard({ pattern, status }: PatternCardProps) {
  const isAccessible = status !== "locked";

  const card = (
    <div className={
      "rounded-xl p-[1px] transition-all duration-200 bg-gradient-to-br " +
      STATUS_GRADIENT[status] +
      (isAccessible ? " hover:scale-[1.03]" : "") +
      (status === "locked" ? " pattern-card-locked" : "")
    }>
      <div className="rounded-[11px] bg-[var(--surface-raised)] overflow-hidden relative h-full">
        {status === "available" && (
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-teal)] opacity-[0.04]" />
        )}
        {status === "completed" && (
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[var(--accent-green)] opacity-[0.03]" />
        )}

        <div className="relative p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {pattern.difficulty}
            </span>
            {status === "completed" && (
              <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] shadow-[0_0_6px_rgba(0,232,70,0.6)]" />
            )}
            {status === "locked" && (
              <LockIcon size={11} className="text-[var(--text-muted)]" />
            )}
            {status === "available" && (
              <span className="h-2 w-2 rounded-full bg-[var(--accent-teal)] shadow-[0_0_6px_rgba(0,212,170,0.6)] animate-glow-pulse" />
            )}
          </div>

          <h3 className="text-[14px] font-extrabold tracking-tight text-[var(--text-primary)] mb-1.5">
            {pattern.name}
          </h3>
          <p className="text-[11px] leading-[1.6] text-[var(--text-muted)] mb-3 line-clamp-2">
            {pattern.hook}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]">
            <span className="text-[10px] font-mono font-bold text-[var(--accent-green)]">+{pattern.xpReward}xp</span>
            {status === "completed" && (
              <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-[var(--accent-green)]">
                <CheckIcon size={10} /> mastered
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAccessible) {
    return card;
  }

  return <Link href={`/quest/${pattern.slug}`}>{card}</Link>;
}
