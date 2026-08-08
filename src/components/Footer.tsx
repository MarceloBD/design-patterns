export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-14 py-6 px-4 sm:px-6 lg:px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent mb-6" />
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          &copy; {currentYear} Design Patterns Quest
        </p>
        <p className="text-[10px] text-[var(--text-faint)]">
          Based on &ldquo;Design Patterns: Elements of Reusable Object-Oriented Software&rdquo; (1994)
        </p>
      </div>
    </footer>
  );
}
