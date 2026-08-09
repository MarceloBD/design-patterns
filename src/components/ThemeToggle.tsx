"use client";

import { useState, useEffect, useCallback } from "react";

const THEME_STORAGE_KEY = "theme-preference";

type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme();
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }, [theme]);

  if (!mounted) {
    return <div className="w-8 h-4" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center w-8 h-4 rounded-full border border-[var(--border-default)] transition-colors"
      style={{ background: theme === "dark" ? "var(--surface-deep)" : "var(--accent-teal)" }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span
        className="absolute w-3 h-3 rounded-full transition-transform flex items-center justify-center"
        style={{
          background: theme === "dark" ? "var(--text-faint)" : "#ffffff",
          transform: theme === "dark" ? "translateX(1px)" : "translateX(17px)",
        }}
      >
        {theme === "dark" ? (
          <svg width="7" height="7" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--surface-base)]">
            <path d="M6 0a6 6 0 006 6 6 6 0 00-6 6 6 6 0 00-6-6 6 6 0 006-6z" />
          </svg>
        ) : (
          <svg width="7" height="7" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--accent-teal)]">
            <circle cx="8" cy="8" r="4" />
            <path d="M8 0v2m0 12v2m8-8h-2M2 8H0m13.6-5.6L12.2 3.8M3.8 12.2l-1.4 1.4m11.2 0l-1.4-1.4M3.8 3.8L2.4 2.4" strokeWidth="1.5" stroke="currentColor" fill="none" />
          </svg>
        )}
      </span>
    </button>
  );
}
