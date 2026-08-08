"use client";

import { PatternCategory } from "@/types/pattern";

interface WeatherEffectProps {
  realm: PatternCategory;
}

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

function EmberParticles() {
  const particles = generateParticles(20);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {particles.map((index) => {
        const left = `${(index * 5.3 + 7) % 100}%`;
        const delay = `${(index * 0.7) % 6}s`;
        const duration = `${3 + (index % 5) * 1.2}s`;
        const size = `${2 + (index % 3)}px`;

        return (
          <span
            key={index}
            className="absolute bottom-0 rounded-full opacity-0"
            style={{
              left,
              width: size,
              height: size,
              background: `radial-gradient(circle, #ff8844, #ff4400)`,
              animation: `ember-rise ${duration} linear ${delay} infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function SnowParticles() {
  const particles = generateParticles(25);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {particles.map((index) => {
        const left = `${(index * 4.2 + 3) % 100}%`;
        const delay = `${(index * 0.5) % 8}s`;
        const duration = `${5 + (index % 6) * 1.5}s`;
        const size = `${2 + (index % 4)}px`;

        return (
          <span
            key={index}
            className="absolute top-[-10px] rounded-full"
            style={{
              left,
              width: size,
              height: size,
              background: "#88ccff",
              animation: `snow-fall ${duration} linear ${delay} infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function RainParticles() {
  const particles = generateParticles(30);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {particles.map((index) => {
        const left = `${(index * 3.4 + 2) % 100}%`;
        const delay = `${(index * 0.3) % 4}s`;
        const duration = `${0.8 + (index % 4) * 0.3}s`;

        return (
          <span
            key={index}
            className="absolute top-[-20px]"
            style={{
              left,
              width: "1.5px",
              height: `${10 + (index % 3) * 5}px`,
              background: "linear-gradient(to bottom, transparent, rgba(160, 100, 255, 0.6))",
              borderRadius: "0 0 2px 2px",
              animation: `rain-drop ${duration} linear ${delay} infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export function WeatherEffect({ realm }: WeatherEffectProps) {
  return (
    <>
      {realm === "creational" && <EmberParticles />}
      {realm === "structural" && <SnowParticles />}
      {realm === "behavioral" && <RainParticles />}
    </>
  );
}
