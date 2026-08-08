"use client";

import { useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { SwordIcon } from "@/components/icons";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--surface-deep)]/95 backdrop-blur-sm">
      <div className="relative max-w-sm w-full mx-4">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--accent-teal)] via-[var(--accent-blue)] to-[var(--accent-teal)] opacity-20 blur-md" />

        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-[var(--accent-teal)] via-[var(--accent-blue)] to-[var(--accent-teal-dark)]">
          <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent-teal)] opacity-[0.04]" />
            <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-[var(--accent-blue)] opacity-[0.03]" />

            <div className="relative p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 level-badge rounded-xl mb-6">
                <SwordIcon className="text-[var(--surface-base)]" size={22} />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mb-1">
                Welcome, Adventurer
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent my-5" />
              <p className="text-[13px] leading-[1.8] text-[var(--text-muted)] mb-6">
                Your quest to master design patterns begins.<br />What shall we call you?
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-lg bg-[var(--surface-base)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-teal)] focus:shadow-[0_0_12px_rgba(0,212,170,0.1)] transition-all text-[14px]"
                  maxLength={20}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="btn-primary w-full rounded-lg"
                >
                  Begin Quest
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
