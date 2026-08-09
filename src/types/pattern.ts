export type PatternCategory = "creational" | "structural" | "behavioral";

export type PatternDifficulty = "beginner" | "intermediate" | "advanced";

export type PatternStatus = "locked" | "available" | "in-progress" | "completed";

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface PatternContent {
  slug: string;
  name: string;
  category: PatternCategory;
  difficulty: PatternDifficulty;
  order: number;
  xpReward: number;
  lore: string;
  hook: string;
  analogy: string;
  antiPattern: string;
  problem: string;
  solution: string;
  glossary: GlossaryTerm[];
  codeExample: string;
  highlightLines?: number[];
  diagramDescription: string;
}

export interface PatternMetadata {
  slug: string;
  name: string;
  category: PatternCategory;
  difficulty: PatternDifficulty;
  order: number;
  xpReward: number;
  hook: string;
  skillEffect: string;
  prerequisites: string[];
  relatedPatterns: string[];
}
