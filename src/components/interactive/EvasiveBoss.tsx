"use client";

import { useRef, useCallback, useState, useEffect } from "react";

interface EvasiveBossProps {
  sprite: React.ReactNode;
  idleAnimation: string;
  areaRadius?: number;
  evasionSpeed?: number;
}

export function EvasiveBoss({ sprite, idleAnimation, areaRadius = 60, evasionSpeed = 0.15 }: EvasiveBossProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isReturningRef = useRef(false);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    const distanceToMouse = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

    const evasionRange = areaRadius * 2.5;

    if (distanceToMouse < evasionRange) {
      isReturningRef.current = false;
      const angle = Math.atan2(mouseY, mouseX);
      const pushStrength = Math.max(0, 1 - distanceToMouse / evasionRange);

      const targetX = -Math.cos(angle) * areaRadius * pushStrength;
      const targetY = -Math.sin(angle) * areaRadius * pushStrength;

      const clampedDistance = Math.sqrt(targetX * targetX + targetY * targetY);
      if (clampedDistance > areaRadius) {
        const scale = areaRadius / clampedDistance;
        targetRef.current = { x: targetX * scale, y: targetY * scale };
      } else {
        targetRef.current = { x: targetX, y: targetY };
      }
    } else {
      isReturningRef.current = true;
      targetRef.current = { x: 0, y: 0 };
    }
  }, [areaRadius]);

  const animate = useCallback(() => {
    const speed = isReturningRef.current ? evasionSpeed * 0.5 : evasionSpeed;
    const { x: currentX, y: currentY } = positionRef.current;
    const { x: targetX, y: targetY } = targetRef.current;

    const newX = currentX + (targetX - currentX) * speed;
    const newY = currentY + (targetY - currentY) * speed;

    positionRef.current = { x: newX, y: newY };
    setOffset({ x: newX, y: newY });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [evasionSpeed]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [animate, handleMouseMove]);

  return (
    <div ref={containerRef} className="relative mx-auto mb-4 w-20 h-20">
      <div
        className="w-20 h-20 transition-none"
        style={{
          animation: idleAnimation,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {sprite}
      </div>
    </div>
  );
}
