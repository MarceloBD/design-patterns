"use client";

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  percentage,
  label,
  showPercentage = true,
  size = "md",
}: ProgressBarProps) {
  const heights = {
    sm: "h-[10px]",
    md: "h-[14px]",
    lg: "h-[18px]",
  };

  const segmentCount = size === "sm" ? 8 : 10;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">{label}</span>}
          {showPercentage && (
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full xp-bar-dungeon rounded-sm relative ${heights[size]}`}>
        <div
          className="xp-bar-fill-dungeon"
          style={{ width: `${percentage}%` }}
        />
        <div className="xp-segments absolute inset-0 flex">
          {Array.from({ length: segmentCount }).map((_, index) => (
            <div key={index} className="xp-segment" />
          ))}
        </div>
      </div>
    </div>
  );
}
