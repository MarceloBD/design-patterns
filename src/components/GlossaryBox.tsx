import { GlossaryTerm } from "@/types/pattern";
import { BookIcon } from "@/components/icons";

interface GlossaryBoxProps {
  terms: GlossaryTerm[];
}

export function GlossaryBox({ terms }: GlossaryBoxProps) {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--accent-blue)] via-[var(--border-muted)] to-[var(--accent-blue-light)]">
      <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[var(--accent-blue)] opacity-[0.03]" />

        <div className="relative p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <BookIcon className="text-[var(--accent-blue)]" size={15} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-blue)]">
              Lore &mdash; Key Terms
            </span>
          </div>
          <dl className="space-y-3">
            {terms.map(({ term, definition }) => (
              <div key={term} className="pl-3.5 border-l-2 border-[var(--accent-blue)]/30">
                <dt className="text-[13px] font-bold text-[var(--text-primary)]">{term}</dt>
                <dd className="text-[12px] leading-[1.7] text-[var(--text-muted)] mt-0.5">{definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
