"use client";

import { useEffect, useState } from "react";
import { PatternContent } from "@/types/pattern";
import { PatternQuiz } from "@/types/quiz";
import { useGameStore } from "@/hooks/useGameStore";
import { useSpeech } from "@/hooks/useSpeech";
import { GlossaryBox } from "@/components/GlossaryBox";
import { CodeBlock } from "@/components/CodeBlock";
import { Quiz } from "@/components/interactive/Quiz";
import { SpeechButton } from "@/components/interactive/SpeechButton";
import { HighlightedText } from "@/components/interactive/HighlightedText";
import { SpeechSpeedConfig } from "@/components/interactive/SpeechSpeedConfig";
import { AlertIcon, LightbulbIcon, CodeIcon, TargetIcon, CheckIcon, SkullIcon } from "@/components/icons";
import { HiddenCoin } from "@/components/interactive/HiddenCoin";
import { PatternComparisonCard } from "@/components/interactive/PatternComparisonCard";
import { getComparisonsForPattern } from "@/data/pattern-comparisons";

interface QuestContentProps {
  content: PatternContent;
  quiz: PatternQuiz;
}

const QUEST_PHASES = [
  { id: "hook", label: "Read Brief" },
  { id: "enemy", label: "Know The Enemy" },
  { id: "problem", label: "Understand Problem" },
  { id: "solution", label: "Learn Solution" },
  { id: "code", label: "Study Code" },
  { id: "challenge", label: "Complete Challenge" },
] as const;

export function QuestContent({ content, quiz }: QuestContentProps) {
  const { handleReadPattern, player, isHydrated } = useGameStore();
  const { speak, isSpeaking, isPaused, currentWordIndex, activeSection, speed, setSpeed } = useSpeech();
  const [visiblePhases, setVisiblePhases] = useState<Set<string>>(new Set(["hook"]));
  const [showObjectives, setShowObjectives] = useState(false);

  useEffect(() => {
    if (isHydrated && !player.readPatterns.includes(content.slug)) {
      handleReadPattern(content.slug);
    }
  }, [isHydrated, content.slug, player.readPatterns, handleReadPattern]);

  useEffect(() => {
    const handleScroll = () => {
      setShowObjectives(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    function checkSections() {
      const sections = document.querySelectorAll("[data-phase]");
      sections.forEach((section) => {
        const phaseId = section.getAttribute("data-phase");
        if (!phaseId) return;
        const rect = section.getBoundingClientRect();
        const sectionBottom = rect.bottom;
        const viewportHeight = window.innerHeight;
        if (sectionBottom < viewportHeight * 0.4) {
          setVisiblePhases((previous) => {
            if (previous.has(phaseId)) return previous;
            return new Set([...previous, phaseId]);
          });
        }
      });
    }

    window.addEventListener("scroll", checkSections, { passive: true });
    checkSections();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", checkSections);
    };
  }, []);

  const isCompleted = player.completedPatterns.includes(content.slug);

  return (
    <article className="max-w-3xl mx-auto relative" data-hydrated="true">
      {/* Quest Objectives Tracker - sticky sidebar on desktop, hidden until content is in view */}
      <div className={`hidden lg:block fixed left-[calc(50%-560px)] top-32 w-40 z-20 transition-opacity duration-500 ${showObjectives ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="rounded-xl p-[1px] bg-gradient-to-b from-[var(--border-muted)] to-[var(--border-subtle)]">
          <div className="rounded-[11px] bg-[var(--surface-raised)] p-3">
            <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)] block mb-3">
              Objectives
            </span>
            <div className="space-y-2">
              {QUEST_PHASES.map((phase) => {
                const isVisible = visiblePhases.has(phase.id);
                const isDone = phase.id === "challenge" ? isCompleted : isVisible;
                return (
                  <div key={phase.id} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm flex items-center justify-center border transition-all ${
                      isDone
                        ? "bg-[var(--accent-green)]/20 border-[var(--accent-green)]/50"
                        : "border-[var(--border-default)]"
                    }`}>
                      {isDone && <CheckIcon size={7} className="text-[var(--accent-green)]" />}
                    </span>
                    <span className={`text-[9px] transition-colors ${
                      isDone ? "text-[var(--text-primary)]" : "text-[var(--text-faint)]"
                    }`}>
                      {phase.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Speech speed configuration */}
      <div className="mb-6 flex justify-end">
        <SpeechSpeedConfig speed={speed} onSpeedChange={setSpeed} />
      </div>

      {/* Phase 1: Quest Hook - styled as a received message/scroll */}
      <section className="mb-12" data-phase="hook">
        <PhaseMarker number={1} label="Quest Brief" color="var(--accent-teal)" />
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--accent-teal)] via-[var(--border-default)] to-[var(--accent-blue)]">
          <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent-teal)] opacity-[0.03]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(122,138,255,0.02),transparent_50%)]" />
            <div className="relative p-7">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[20px] font-extrabold italic tracking-tight text-[var(--text-primary)] leading-[1.6] font-[var(--font-display)]">
                  &ldquo;<HighlightedText text={content.hook} currentWordIndex={currentWordIndex} isActive={activeSection === "hook"} />&rdquo;
                </p>
                <SpeechButton onClick={() => speak(content.hook, "hook")} isActive={isSpeaking && activeSection === "hook"} isPaused={isPaused && activeSection === "hook"} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 ml-1 pl-4 border-l-2 border-[var(--accent-pink)]/25 py-1 relative">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--accent-pink)]/80 mb-1.5 block">
                Think of it like...
              </span>
              <p className="text-[13px] leading-[1.9] text-[var(--text-muted)] italic">
                <HighlightedText text={content.analogy} currentWordIndex={currentWordIndex} isActive={activeSection === "analogy"} />
              </p>
            </div>
            <SpeechButton onClick={() => speak(content.analogy, "analogy")} isActive={isSpeaking && activeSection === "analogy"} isPaused={isPaused && activeSection === "analogy"} />
          </div>
          <HiddenCoin coinId={`${content.slug}-hook`} position="right" />
        </div>
      </section>

      {/* Phase 2: The Enemy - anti-pattern that this pattern defeats */}
      {content.antiPattern && (
        <section className="mb-12" data-phase="enemy">
          <PhaseMarker number={2} label="The Enemy" color="var(--realm-creational)" />
          <div className="rounded-xl p-[1px] bg-gradient-to-br from-[var(--realm-creational)]/40 via-[var(--border-subtle)] to-[var(--accent-pink)]/30">
            <div className="rounded-[11px] bg-[var(--surface-raised)] overflow-hidden relative">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--realm-creational)] opacity-[0.03]" />
              <div className="relative p-6">
                <div className="flex items-center gap-2 mb-4">
                  <SkullIcon className="text-[var(--realm-creational)]" size={14} />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--realm-creational)]">
                    The naive approach you must defeat
                  </span>
                </div>
                <CodeBlock code={content.antiPattern} language="typescript" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Phase 3: The Problem - danger zone feel */}
      <section className="mb-12" data-phase="problem">
        <PhaseMarker number={3} label="The Problem" color="var(--accent-pink)" />
        <div className="rounded-xl p-[1px] bg-gradient-to-br from-[var(--accent-pink)]/40 via-[var(--border-subtle)] to-[var(--accent-pink)]/20">
          <div className="rounded-[11px] bg-[var(--surface-raised)] overflow-hidden relative">
            <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[var(--accent-pink)] opacity-[0.025]" />
            <div className="relative p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <AlertIcon className="text-[var(--accent-pink)]" size={14} />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-pink)]">
                    Without this pattern...
                  </span>
                </div>
                <SpeechButton onClick={() => speak(content.problem, "problem")} isActive={isSpeaking && activeSection === "problem"} isPaused={isPaused && activeSection === "problem"} />
              </div>
              <p className="text-[14px] leading-[2.1] text-[var(--text-muted)] whitespace-pre-line">
                <HighlightedText text={content.problem} currentWordIndex={currentWordIndex} isActive={activeSection === "problem"} />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 4: The Solution - discovery feel */}
      <section className="mb-12" data-phase="solution">
        <PhaseMarker number={4} label="The Solution" color="var(--accent-teal)" />
        <div className="rounded-xl p-[1px] bg-gradient-to-br from-[var(--accent-teal)]/30 via-[var(--border-subtle)] to-[var(--accent-blue)]/20">
          <div className="rounded-[11px] bg-[var(--surface-raised)] overflow-hidden relative">
            <div className="absolute -right-14 -bottom-14 h-40 w-40 rounded-full bg-[var(--accent-teal)] opacity-[0.025]" />
            <div className="relative p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <LightbulbIcon className="text-[var(--accent-teal)]" size={14} />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-teal)]">
                    The pattern reveals...
                  </span>
                </div>
                <SpeechButton onClick={() => speak(content.solution, "solution")} isActive={isSpeaking && activeSection === "solution"} isPaused={isPaused && activeSection === "solution"} />
              </div>
              <p className="text-[14px] leading-[2.1] text-[var(--text-muted)] whitespace-pre-line">
                <HighlightedText text={content.solution} currentWordIndex={currentWordIndex} isActive={activeSection === "solution"} />
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 relative">
          <GlossaryBox terms={content.glossary} />
          <HiddenCoin coinId={`${content.slug}-solution`} position="left" />
        </div>
      </section>

      {/* Similar Patterns Comparison */}
      {getComparisonsForPattern(content.slug).length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[var(--accent-blue)]" strokeWidth="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-blue)]">
              Know Your Allies
            </span>
          </div>
          <div className="space-y-4">
            {getComparisonsForPattern(content.slug).map((comparison) => (
              <PatternComparisonCard
                key={`${comparison.patternA}-${comparison.patternB}`}
                comparison={comparison}
                currentSlug={content.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* Phase 5: Implementation - spell scroll */}
      <section className="mb-12" data-phase="code">
        <PhaseMarker number={5} label="Spell Scroll" color="var(--realm-structural)" />
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <CodeIcon className="text-[var(--realm-structural)]" size={14} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--realm-structural)]">
              Incantation
            </span>
          </div>
          <p className="text-[12px] leading-[1.9] text-[var(--text-muted)] ml-[22px]">{content.diagramDescription}</p>
        </div>
        <CodeBlock code={content.codeExample} highlightLines={content.highlightLines} />
      </section>

      {/* Phase 6: Challenge - boss encounter */}
      <section className="mb-8" data-phase="challenge">
        <PhaseMarker number={6} label="Boss Challenge" color="var(--accent-green)" isFinal />
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <TargetIcon className="text-[var(--accent-green)]" size={14} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-green)]">
              Prove your mastery
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5 ml-[22px]">
            Answer correctly to complete this quest and earn XP.
          </p>
        </div>
        <Quiz quiz={quiz} category={content.category} />
      </section>
    </article>
  );
}

function PhaseMarker({ number, label, color, isFinal = false }: { number: number; label: string; color: string; isFinal?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border"
        style={{
          borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
          color,
          background: `color-mix(in srgb, ${color} 8%, transparent)`,
        }}
      >
        {number}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.1em]"
          style={{ color }}
        >
          {label}
        </span>
        {isFinal && (
          <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/25 text-[var(--accent-green)]">
            Final
          </span>
        )}
      </div>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, color-mix(in srgb, ${color} 25%, transparent), transparent)` }} />
    </div>
  );
}
