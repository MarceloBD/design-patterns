export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface PatternQuiz {
  patternSlug: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit: number;
}

export interface QuizResult {
  patternSlug: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
}

export interface DiagramPiece {
  id: string;
  label: string;
  type: "class" | "interface" | "arrow" | "label";
}

export interface DiagramSlot {
  id: string;
  correctPieceId: string;
  position: { x: number; y: number };
}
