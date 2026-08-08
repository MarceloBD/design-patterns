"use client";

import Link from "next/link";
import { useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { getXpToNextLevel } from "@/data/levels";
import { SwordIcon, MapIcon, MenuIcon, CloseIcon, CoinIcon } from "@/components/icons";
import { SoundToggle } from "@/components/SoundToggle";

export function Navigation() {
  const { player, isHydrated } = useGameStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const xpProgress = getXpToNextLevel(player.currentXp);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-[var(--surface-overlay)]/97 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="group flex items-center gap-2">
              <SwordIcon className="text-[var(--accent-teal)] group-hover:text-[var(--accent-teal-light)] transition-colors" size={16} />
              <span className="text-[13px] font-extrabold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-teal-light)] transition-colors">
                PatternQuest
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/skill-tree" className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <MapIcon size={13} className="opacity-60" />
                <span>Skill Tree</span>
              </Link>
              <Link href="/shop" className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <CoinIcon size={13} className="opacity-60" />
                <span>Shop</span>
              </Link>
              <Link href="/realms" className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                Realms
              </Link>
              <SoundToggle />
            </div>

            {isHydrated && player.playerName ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CoinIcon size={12} className="text-[var(--realm-creational)]" />
                  <span className="text-[10px] font-bold font-mono text-[var(--realm-creational)]">
                    {player.coins}
                  </span>
                </div>

                <span className="w-px h-4 bg-[var(--border-default)]" />

                <div className="flex items-center gap-2">
                  <div className="w-28 relative">
                    <div className="xp-bar-dungeon rounded-full h-[6px]">
                      <div className="xp-bar-fill-dungeon rounded-full" style={{ width: `${xpProgress.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">
                    {xpProgress.current}/{xpProgress.required}
                  </span>
                </div>

                <span className="w-px h-4 bg-[var(--border-default)]" />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[var(--text-primary)]">
                    {player.playerName}
                  </span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent-teal)]/15 border border-[var(--accent-teal)]/30 text-[8px] font-bold text-[var(--accent-teal)]">
                    {player.level}
                  </span>
                </div>
              </div>
            ) : (
              <div className="hidden md:block" />
            )}

            <div className="flex md:hidden items-center gap-2">
              <SoundToggle />
              <button
                className="text-[var(--text-muted)] hover:text-[var(--accent-teal-light)] transition-colors p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-teal)]/20 to-transparent" />
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 top-[57px] z-40 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-[var(--surface-overlay)]/98 backdrop-blur-xl border-l border-[var(--border-default)] transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 space-y-2 overflow-y-auto h-full">
            {isHydrated && player.playerName && (
              <div className="mb-6 pb-4 border-b border-[var(--border-default)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-teal)]/15 border border-[var(--accent-teal)]/30 text-[11px] font-bold text-[var(--accent-teal)]">
                    {player.level}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-[var(--text-primary)]">{player.playerName}</p>
                    <p className="text-[9px] font-mono text-[var(--text-faint)]">{player.currentXp} XP</p>
                  </div>
                </div>
                <div className="w-full">
                  <div className="xp-bar-dungeon rounded-full h-[5px]">
                    <div className="xp-bar-fill-dungeon rounded-full" style={{ width: `${xpProgress.progress}%` }} />
                  </div>
                  <span className="text-[8px] font-mono text-[var(--text-faint)] mt-1 block">
                    {xpProgress.current}/{xpProgress.required} to next level
                  </span>
                </div>
              </div>
            )}

            <Link href="/skill-tree" className="flex items-center gap-3 py-3 px-3 rounded-lg text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all" onClick={() => setIsMenuOpen(false)}>
              <MapIcon size={16} className="opacity-60" /> Skill Tree
            </Link>
            <Link href="/shop" className="flex items-center gap-3 py-3 px-3 rounded-lg text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all" onClick={() => setIsMenuOpen(false)}>
              <CoinIcon size={16} className="opacity-60" /> Shop
            </Link>
            <Link href="/realms" className="flex items-center gap-3 py-3 px-3 rounded-lg text-[13px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all" onClick={() => setIsMenuOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Realms
            </Link>

            {isHydrated && player.coins !== undefined && (
              <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
                <div className="flex items-center gap-2 px-3">
                  <CoinIcon size={14} className="text-[var(--realm-creational)]" />
                  <span className="text-[12px] font-bold text-[var(--realm-creational)]">{player.coins}</span>
                  <span className="text-[9px] text-[var(--text-faint)] uppercase">coins</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
