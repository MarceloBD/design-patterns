"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGameStore } from "@/hooks/useGameStore";
import { useSound } from "@/hooks/useSound";
import { CATEGORY_INFO, getPatternsByCategory } from "@/data/patterns";
import { PatternCategory } from "@/types/pattern";
import { CategoryIcon } from "@/components/CategoryIcon";

interface RealmPath {
  category: PatternCategory;
  title: string;
  technicalName: string;
  subtitle: string;
  lore: string;
  patterns: string[];
  color: string;
  glowColor: string;
  bgImage: string;
  bgStyle: React.CSSProperties;
  bgStyleLight: React.CSSProperties;
}

const REALM_PATHS: RealmPath[] = [
  {
    category: "creational",
    title: "The Forge of Origins",
    technicalName: "Creational Patterns",
    subtitle: "Ember storms, volcanic peaks, molten rain",
    lore: "Beneath volcanic peaks and rivers of molten logic, the Forge once shaped every object in Architectura. Master smiths could summon instances from pure intent — factories that never faltered, builders that constructed palaces in a single breath. Unformed Constructs now haunt these halls — objects instantiated without purpose, tightly coupled to everything they touch.",
    patterns: ["Factory Method", "Abstract Factory", "Builder", "Prototype", "Singleton"],
    color: "var(--realm-creational)",
    glowColor: "rgba(255, 136, 68, 0.5)",
    bgImage: "radial-gradient(ellipse at 70% 30%, rgba(255, 100, 0, 0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 60, 0, 0.08) 0%, transparent 40%)",
    bgStyle: {
      background: "linear-gradient(135deg, #1a0500 0%, #2d0a00 20%, #1a0800 50%, #0d0400 80%, #0a0200 100%)",
    },
    bgStyleLight: {
      background: "linear-gradient(135deg, #2d1000 0%, #3a1500 20%, #2d1200 50%, #1a0a00 80%, #0d0400 100%)",
    },
  },
  {
    category: "structural",
    title: "The Crystal Citadel",
    technicalName: "Structural Patterns",
    subtitle: "Perpetual snowfall, crystal spires, frost winds",
    lore: "Towers of crystallized logic pierce a frozen sky. Every wall is an interface, every bridge a composition of smaller elements. Fractured Composites roam the frozen halls — structures built without adapters, crumbling under the slightest change. The Weaver of Bonds weaves compulsively, creating the tight coupling she once despised.",
    patterns: ["Adapter", "Bridge", "Composite", "Decorator", "Facade", "Flyweight", "Proxy"],
    color: "var(--realm-structural)",
    glowColor: "rgba(68, 170, 255, 0.5)",
    bgImage: "radial-gradient(ellipse at 80% 20%, rgba(68, 170, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 10% 70%, rgba(0, 100, 200, 0.06) 0%, transparent 40%)",
    bgStyle: {
      background: "linear-gradient(135deg, #000a1a 0%, #001530 20%, #000d1f 50%, #000812 80%, #000408 100%)",
    },
    bgStyleLight: {
      background: "linear-gradient(135deg, #001a3a 0%, #002550 20%, #001530 50%, #000d20 80%, #000810 100%)",
    },
  },
  {
    category: "behavioral",
    title: "The Storm Nexus",
    technicalName: "Behavioral Patterns",
    subtitle: "Purple lightning, thunder, arcane rain",
    lore: "Thunder never rests here. Ancient towers channel lightning between objects — messages pass like bolts from observer to subscriber, commands queue in rolling thunder. Rogue Algorithms wander the tempest — behaviors without context, strategies without a chooser. The Conductor broadcasts fury indiscriminately, drowning the world in noise.",
    patterns: ["Chain of Responsibility", "Command", "Iterator", "Mediator", "Memento", "Observer", "State", "Strategy", "Template Method", "Visitor"],
    color: "var(--realm-behavioral)",
    glowColor: "rgba(204, 68, 255, 0.5)",
    bgImage: "radial-gradient(ellipse at 60% 40%, rgba(160, 50, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(100, 0, 200, 0.06) 0%, transparent 40%)",
    bgStyle: {
      background: "linear-gradient(135deg, #0d0019 0%, #1a0033 20%, #0f001f 50%, #080012 80%, #040008 100%)",
    },
    bgStyleLight: {
      background: "linear-gradient(135deg, #1a0030 0%, #2a0050 20%, #1a0035 50%, #100020 80%, #080010 100%)",
    },
  },
];

function RealmWeather({ category }: { category: PatternCategory }) {
  if (category === "creational") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full opacity-0"
            style={{
              left: `${i * 7}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: "radial-gradient(circle, #ff8844, #ff4400)",
              animation: `ember-rise ${3 + i * 0.6}s linear ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>
    );
  }
  if (category === "structural") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 rounded-full"
            style={{
              left: `${i * 5 + 1}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: "#88ccff",
              opacity: 0.4,
              animation: `snow-fall ${5 + i * 0.7}s linear ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${i * 5.5 + 1}%`,
            width: "1.5px",
            height: `${10 + (i % 4) * 4}px`,
            background: "linear-gradient(to bottom, transparent, rgba(160, 100, 255, 0.5))",
            borderRadius: "0 0 2px 2px",
            animation: `rain-drop ${0.7 + (i % 3) * 0.2}s linear ${i * 0.2}s infinite`,
            opacity: 0.4,
          }}
        />
      ))}
      <div className="absolute inset-0" style={{ animation: "lightning-flash 8s ease-in-out infinite" }} />
    </div>
  );
}

function useTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

export function RealmPathSelector() {
  const { getProgress, isHydrated } = useGameStore();
  const { play, startMusic, stopMusic } = useSound();
  const theme = useTheme();

  return (
    <div className="space-y-0">
      {REALM_PATHS.map((realm) => {
        const progress = isHydrated ? getProgress(realm.category) : { completed: 0, total: 0 };
        const info = CATEGORY_INFO[realm.category];
        const patternCount = getPatternsByCategory(realm.category).length;
        const progressPercent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

        return (
          <Link
            key={realm.category}
            href={`/realm/${realm.category}`}
            className="group block relative"
            onClick={() => play("click")}
            onMouseEnter={() => startMusic(realm.category)}
            onMouseLeave={() => stopMusic()}
          >
            {/* Full width wallpaper section */}
            <div
              className="relative w-full min-h-[360px] sm:min-h-[420px] overflow-hidden border-b border-[var(--border-subtle)] transition-all duration-700 group-hover:min-h-[440px] sm:group-hover:min-h-[480px]"
              style={theme === "light" ? realm.bgStyleLight : realm.bgStyle}
            >
              {/* Background landscape image */}
              <Image
                src={`/realms/${realm.category}.svg`}
                alt=""
                fill
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000 group-hover:scale-105 transition-transform"
                priority
              />

              {/* Overlay radial glow layer */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: realm.bgImage }} />

              {/* Weather particles */}
              <RealmWeather category={realm.category} />

              {/* Ambient glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{ background: `radial-gradient(ellipse at 50% 80%, ${realm.glowColor}, transparent 60%)` }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-4xl">
                {/* Category icon */}
                <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                  <span style={{ color: realm.color }}>
                    <CategoryIcon iconId={info.iconId} size={32} />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] px-2 py-0.5 rounded border" style={{ color: realm.color, borderColor: `color-mix(in srgb, ${realm.color} 30%, transparent)`, background: `color-mix(in srgb, ${realm.color} 5%, transparent)` }}>
                    {realm.technicalName}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-[var(--font-display)] italic mb-2 transition-transform duration-500 group-hover:translate-x-2"
                  style={{ color: realm.color }}
                >
                  {realm.title}
                </h2>

                <p className="text-[12px] sm:text-[13px] uppercase tracking-[0.2em] text-white/40 mb-4">
                  {realm.subtitle}
                </p>

                {/* Lore */}
                <p className="text-[13px] sm:text-[14px] leading-[1.8] text-white/50 max-w-lg mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  {realm.lore}
                </p>

                {/* Pattern list */}
                <div className="flex flex-wrap gap-1.5 mb-5 opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                  {realm.patterns.map((pattern) => (
                    <span
                      key={pattern}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                      style={{ color: realm.color, borderColor: `color-mix(in srgb, ${realm.color} 20%, transparent)`, background: `color-mix(in srgb, ${realm.color} 3%, transparent)` }}
                    >
                      {pattern}
                    </span>
                  ))}
                </div>

                {/* Stats bar */}
                <div className="flex items-center gap-6 flex-wrap">
                  <span className="text-[11px] font-mono font-bold" style={{ color: realm.color }}>
                    {patternCount} Quests
                  </span>

                  {isHydrated && (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor: realm.color,
                            boxShadow: progressPercent > 0 ? `0 0 6px ${realm.glowColor}` : undefined,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: realm.color }}>{progressPercent}%</span>
                    </div>
                  )}

                  {/* Enter CTA */}
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300 ml-auto"
                    style={{ color: realm.color }}
                  >
                    Enter Realm &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
