"use client";

interface HighlightedTextProps {
  text: string;
  currentWordIndex: number;
  isActive: boolean;
}

export function HighlightedText({ text, currentWordIndex, isActive }: HighlightedTextProps) {
  if (!isActive || currentWordIndex < 0) {
    return <>{text}</>;
  }

  const words = text.split(/(\s+)/);
  let wordCounter = 0;

  return (
    <>
      {words.map((segment, index) => {
        if (/^\s+$/.test(segment)) {
          return <span key={index}>{segment}</span>;
        }

        const isHighlighted = wordCounter === currentWordIndex;
        wordCounter++;

        return (
          <span
            key={index}
            className={isHighlighted ? "bg-[var(--accent-teal)]/20 text-[var(--text-primary)] rounded px-0.5 transition-colors" : ""}
          >
            {segment}
          </span>
        );
      })}
    </>
  );
}
