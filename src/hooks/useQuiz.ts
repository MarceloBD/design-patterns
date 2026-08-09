"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { PatternQuiz, QuizQuestion, QuizResult } from "@/types/quiz";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  isSubmitted: boolean;
  result: QuizResult | null;
  startTime: number;
  shuffledQuestions: QuizQuestion[];
}

function shuffleQuestionOptions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((question) => ({
    ...question,
    options: shuffleArray(question.options),
  }));
}

export function useQuiz(quiz: PatternQuiz) {
  const initialQuestions = useMemo(
    () => shuffleQuestionOptions(shuffleArray(quiz.questions)),
    [quiz.questions]
  );

  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isSubmitted: false,
    result: null,
    startTime: Date.now(),
    shuffledQuestions: initialQuestions,
  });

  const startTimeRef = useRef(Date.now());

  const currentQuestion = state.shuffledQuestions[state.currentQuestionIndex];
  const totalQuestions = state.shuffledQuestions.length;
  const isLastQuestion = state.currentQuestionIndex === totalQuestions - 1;
  const hasAnsweredCurrent = !!state.selectedAnswers[currentQuestion?.id];

  const selectAnswer = useCallback((questionId: string, optionId: string) => {
    setState((previous) => ({
      ...previous,
      selectedAnswers: { ...previous.selectedAnswers, [questionId]: optionId },
    }));
  }, []);

  const goToNext = useCallback(() => {
    setState((previous) => ({
      ...previous,
      currentQuestionIndex: Math.min(previous.currentQuestionIndex + 1, totalQuestions - 1),
    }));
  }, [totalQuestions]);

  const goToPrevious = useCallback(() => {
    setState((previous) => ({
      ...previous,
      currentQuestionIndex: Math.max(previous.currentQuestionIndex - 1, 0),
    }));
  }, []);

  const submitQuiz = useCallback((lastAnswer?: { questionId: string; optionId: string }): QuizResult => {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    let computedResult: QuizResult | null = null;

    setState((previous) => {
      const answers = lastAnswer
        ? { ...previous.selectedAnswers, [lastAnswer.questionId]: lastAnswer.optionId }
        : previous.selectedAnswers;

      let correctCount = 0;
      for (const question of previous.shuffledQuestions) {
        if (answers[question.id] === question.correctOptionId) {
          correctCount++;
        }
      }

      const total = previous.shuffledQuestions.length;
      const percentage = Math.round((correctCount / total) * 100);
      const result: QuizResult = {
        patternSlug: quiz.patternSlug,
        score: correctCount,
        totalQuestions: total,
        percentage,
        passed: percentage >= quiz.passingScore,
        timeSpent,
      };

      computedResult = result;
      return { ...previous, selectedAnswers: answers, isSubmitted: true, result };
    });

    return computedResult!;
  }, [quiz.patternSlug, quiz.passingScore]);

  const resetQuiz = useCallback(() => {
    startTimeRef.current = Date.now();
    setState({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isSubmitted: false,
      result: null,
      startTime: Date.now(),
      shuffledQuestions: shuffleQuestionOptions(shuffleArray(quiz.questions)),
    });
  }, [quiz.questions]);

  return {
    currentQuestion,
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    hasAnsweredCurrent,
    selectedAnswers: state.selectedAnswers,
    isSubmitted: state.isSubmitted,
    result: state.result,
    selectAnswer,
    goToNext,
    goToPrevious,
    submitQuiz,
    resetQuiz,
  };
}
