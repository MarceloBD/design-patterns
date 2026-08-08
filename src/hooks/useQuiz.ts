"use client";

import { useState, useCallback, useRef } from "react";
import { PatternQuiz, QuizResult } from "@/types/quiz";

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  isSubmitted: boolean;
  result: QuizResult | null;
  startTime: number;
}

export function useQuiz(quiz: PatternQuiz) {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isSubmitted: false,
    result: null,
    startTime: Date.now(),
  });

  const startTimeRef = useRef(Date.now());

  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
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

  const submitQuiz = useCallback((): QuizResult => {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    let correctCount = 0;

    for (const question of quiz.questions) {
      if (state.selectedAnswers[question.id] === question.correctOptionId) {
        correctCount++;
      }
    }

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const result: QuizResult = {
      patternSlug: quiz.patternSlug,
      score: correctCount,
      totalQuestions,
      percentage,
      passed: percentage >= quiz.passingScore,
      timeSpent,
    };

    setState((previous) => ({ ...previous, isSubmitted: true, result }));
    return result;
  }, [quiz, state.selectedAnswers, totalQuestions]);

  const resetQuiz = useCallback(() => {
    startTimeRef.current = Date.now();
    setState({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isSubmitted: false,
      result: null,
      startTime: Date.now(),
    });
  }, []);

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
