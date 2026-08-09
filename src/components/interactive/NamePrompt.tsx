"use client";

import { useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";

export function NamePrompt() {
  const { player, isHydrated, handleSetName } = useGameStore();
  const [name, setName] = useState("");

  if (!isHydrated || player.playerName) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim()) {
      handleSetName(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Full-bleed background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #0a0015 0%, #1a0033 30%, #0d001a 60%, #050008 100%)" }}
      />

      {/* SVG Terrain */}
      <svg className="absolute bottom-0 left-0 right-0 h-[35vh] opacity-50" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <path d="M0,400 L0,260 Q120,180 240,230 Q400,140 560,200 Q720,100 900,180 Q1050,80 1200,160 Q1320,120 1440,190 L1440,400 Z" fill="#0f0020" />
        <path d="M0,400 L0,310 Q180,270 360,300 Q540,260 720,290 Q900,250 1080,280 Q1260,270 1440,310 L1440,400 Z" fill="#080014" />
        <path d="M0,400 L0,360 Q300,340 600,355 Q900,340 1200,355 Q1350,350 1440,365 L1440,400 Z" fill="#04000a" />
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              backgroundColor: `hsla(${270 + Math.random() * 40}, 80%, ${60 + Math.random() * 30}%, ${0.2 + Math.random() * 0.3})`,
              animation: `float ${5 + Math.random() * 8}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Central glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-purple-600/5 blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 max-w-lg w-full mx-4 text-center">
        {/* Grimoire icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-300">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M12 7v6M9 10h6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Title */}
        <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-purple-400/70 block mb-3">
          ~ The Grimoire Awakens ~
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 font-[var(--font-display)] italic mb-4">
          A Hero Rises
        </h1>

        {/* Lore paragraph */}
        <p className="text-[12px] leading-[2] text-purple-200/50 max-w-md mx-auto mb-8 italic">
          The realm of Architectura lies in ruin. Spaghetti Code devours all that was once structured
          and elegant. An ancient grimoire has chosen you — but first, it must know your name.
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-8 max-w-xs mx-auto" />

        {/* Name input section */}
        <div className="max-w-sm mx-auto">
          <span className="text-[9px] uppercase tracking-[0.25em] text-purple-300/60 block mb-3">
            Inscribe your name upon the grimoire
          </span>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name, hero..."
              className="w-full px-5 py-3.5 rounded-xl bg-black/40 border border-purple-500/20 text-purple-100 placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400/50 focus:shadow-[0_0_20px_rgba(147,51,234,0.1)] transition-all text-[15px] text-center backdrop-blur-sm"
              maxLength={20}
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: name.trim()
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(100, 50, 150, 0.2)",
                color: name.trim() ? "#fff" : "rgba(200, 150, 255, 0.4)",
                boxShadow: name.trim() ? "0 4px 24px rgba(124, 58, 237, 0.3)" : "none",
              }}
            >
              Begin the Quest
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-[9px] text-purple-400/30 mt-8">
          22 sacred patterns await &middot; 3 realms to conquer &middot; 1 destiny to fulfill
        </p>
      </div>
    </div>
  );
}
