"use client";

import { PatternQuiz } from "@/types/quiz";
import { PatternCategory } from "@/types/pattern";
import { useQuiz } from "@/hooks/useQuiz";
import { useGameStore } from "@/hooks/useGameStore";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { TrophyIcon, SparklesIcon } from "@/components/icons";
import { DeathScreen } from "@/components/interactive/DeathScreen";
import { VictoryScreen } from "@/components/interactive/VictoryScreen";
import { SHOP_ITEMS } from "@/data/shop-items";
import { getNextPattern } from "@/data/patterns";
import { useSound } from "@/hooks/useSound";
import { getBossForCategory } from "@/data/boss-sprites";
import { EvasiveBoss } from "@/components/interactive/EvasiveBoss";

const SECONDS_PER_QUESTION = 30;
const FREEZE_DURATION = 15;
const BASE_HEARTS = 2;
const ANSWER_FEEDBACK_DELAY = 800;

interface QuizProps {
  quiz: PatternQuiz;
  category?: PatternCategory;
}

type FeedbackState = "idle" | "correct" | "wrong";

export function Quiz({ quiz, category = "behavioral" }: QuizProps) {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    selectedAnswers,
    isSubmitted,
    result,
    selectAnswer,
    goToNext,
    submitQuiz,
    resetQuiz,
  } = useQuiz(quiz);

  const { handleQuizComplete, player, isHydrated } = useGameStore();
  const { play, startMusic, stopMusic } = useSound();
  const [rewards, setRewards] = useState<{ xpEarned: number; badgesEarned: string[]; leveledUp: boolean } | null>(null);
  const [showDeathScreen, setShowDeathScreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [hearts, setHearts] = useState(BASE_HEARTS);
  const [maxHearts, setMaxHearts] = useState(BASE_HEARTS);

  const totalTime = totalQuestions * SECONDS_PER_QUESTION;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isFrozen, setIsFrozen] = useState(false);
  const [usedActiveItems, setUsedActiveItems] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showTimerWarning, setShowTimerWarning] = useState(false);
  const [bossHp, setBossHp] = useState(totalQuestions);
  const [bossHit, setBossHit] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<string>>(new Set());

  const ownedItems = (player.inventory ?? [])
    .map((id) => SHOP_ITEMS.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  const activeItems = ownedItems.filter((item) => item.usageType === "active");
  const passiveItems = ownedItems.filter((item) => item.usageType === "passive");

  const hasShowProgress = passiveItems.some((item) => item.effect === "hint-show-progress");

  useEffect(() => {
    const extraHearts = ownedItems.filter((item) => item.effect === "extra-heart").length;
    const total = BASE_HEARTS + extraHearts;
    setMaxHearts(total);
    setHearts(total);
  }, [ownedItems.length]);

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [stopMusic]);

  useEffect(() => {
    if (!hasStarted || isSubmitted || showDeathScreen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (!isFrozen) {
        setTimeRemaining((previous) => {
          if (previous <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          if (previous <= 10) setShowTimerWarning(true);
          return previous - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isSubmitted, showDeathScreen, isFrozen]);

  useEffect(() => {
    if (timeRemaining === 0 && !isSubmitted && hasStarted) {
      handleFinalSubmit();
    }
  }, [timeRemaining, isSubmitted, hasStarted]);

  const handleFinalSubmit = (forceFail = false) => {
    const quizResult = submitQuiz();
    if (forceFail) {
      quizResult.passed = false;
    }
    const earned = handleQuizComplete(quizResult);
    setRewards(earned);
    stopMusic();
    if (!quizResult.passed) {
      play("gameover");
      setShowDeathScreen(true);
    } else {
      play("levelup");
    }
  };

  const handleAnswerClick = useCallback((questionId: string, optionId: string) => {
    if (feedback !== "idle") return;

    selectAnswer(questionId, optionId);

    const isCorrect = optionId === currentQuestion.correctOptionId;

    if (isCorrect) {
      setFeedback("correct");
      play("hit");
      setBossHp((previous) => Math.max(0, previous - 1));
      setBossHit(true);
      setTimeout(() => setBossHit(false), 400);

      setTimeout(() => {
        setFeedback("idle");
        setEliminatedOptions(new Set());
        if (isLastQuestion) {
          handleFinalSubmit();
        } else {
          goToNext();
        }
      }, ANSWER_FEEDBACK_DELAY);
    } else {
      setFeedback("wrong");
      play("hurt");
      setHearts((previous) => {
        const newHearts = previous - 1;
        if (newHearts <= 0) {
          setTimeout(() => {
            setFeedback("idle");
            setEliminatedOptions(new Set());
            handleFinalSubmit(true);
          }, ANSWER_FEEDBACK_DELAY);
        } else {
          setTimeout(() => {
            setFeedback("idle");
            setEliminatedOptions(new Set());
            if (isLastQuestion) {
              handleFinalSubmit();
            } else {
              goToNext();
            }
          }, ANSWER_FEEDBACK_DELAY);
        }
        return newHearts;
      });
    }
  }, [feedback, currentQuestion, isLastQuestion, selectAnswer, goToNext]);

  const handleRetry = () => {
    resetQuiz();
    setRewards(null);
    setShowDeathScreen(false);
    setHasStarted(false);
    setTimeRemaining(totalTime);
    setIsFrozen(false);
    setUsedActiveItems(new Set());
    setEliminatedOptions(new Set());
    setShowTimerWarning(false);
    setHearts(maxHearts);
    setFeedback("idle");
    setBossHp(totalQuestions);
    setBossHit(false);
  };

  const handleStart = () => {
    setHasStarted(true);
    startMusic("boss");
  };

  const useActiveItem = useCallback((itemId: string, effect: string) => {
    if (usedActiveItems.has(itemId)) return;
    setUsedActiveItems((previous) => new Set([...previous, itemId]));

    switch (effect) {
      case "timer-freeze":
        setIsFrozen(true);
        setTimeout(() => setIsFrozen(false), FREEZE_DURATION * 1000);
        break;
      case "hint-eliminate-one": {
        const incorrectOptions = currentQuestion.options.filter(
          (option) => option.id !== currentQuestion.correctOptionId
        );
        if (incorrectOptions.length > 0) {
          const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
          setEliminatedOptions((previous) => new Set([...previous, randomIncorrect.id]));
        }
        play("coin");
        break;
      }
    }
  }, [usedActiveItems, currentQuestion, play]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const timerPercentage = (timeRemaining / totalTime) * 100;
  const timerColor = timeRemaining <= 10 ? "var(--accent-pink)" : isFrozen ? "var(--accent-blue)" : "var(--accent-teal)";

  if (showDeathScreen && !result?.passed) {
    return <DeathScreen category={category} onRetry={handleRetry} />;
  }

  if (isSubmitted && result) {
    if (result.passed) {
      return (
        <VictoryScreen
          category={category}
          score={result.score}
          totalQuestions={result.totalQuestions}
          percentage={result.percentage}
          xpEarned={rewards?.xpEarned ?? 0}
          badgesEarned={rewards?.badgesEarned ?? []}
          leveledUp={rewards?.leveledUp ?? false}
          timeSpent={result.timeSpent}
          nextPatternSlug={getNextPattern(quiz.patternSlug)?.slug ?? null}
        />
      );
    }

    return (
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--accent-pink)] via-[var(--border-subtle)] to-[var(--accent-pink)]">
        <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,51,102,0.03),transparent_60%)]" />
          <div className="relative p-7 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 level-badge rounded-xl mb-5">
              <SparklesIcon className="text-[var(--surface-base)]" size={22} />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">
              Not Quite...
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] mb-5">
              Score: {result.score}/{result.totalQuestions} ({result.percentage}%).
              Need {quiz.passingScore}% to pass.
            </p>
            <button onClick={handleRetry} className="btn-primary rounded-lg">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bossData = getBossForCategory(category);

  /* Start screen */
  if (!hasStarted) {
    return (
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--accent-pink)]/40 via-[var(--border-default)] to-[var(--accent-pink)]/40">
        <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,51,102,0.04),transparent_60%)]" />
          <div className="relative p-8 text-center">
            <div className="mb-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-pink)]">
                Boss Challenge
              </span>
            </div>

            {/* Boss Sprite - evades mouse */}
            <EvasiveBoss sprite={bossData.sprite} idleAnimation={bossData.idleAnimation} />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: bossData.color }}>
              {bossData.name}
            </p>

            <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] mb-3 font-[var(--font-display)] italic">
              Prepare for Battle
            </h3>
            <p className="text-[12px] text-[var(--text-muted)] mb-2">
              {totalQuestions} questions &middot; {formatTime(totalTime)} time limit
            </p>
            <p className="text-[11px] text-[var(--text-faint)] mb-6">
              Each wrong answer costs one heart. Lose them all and you fall.
            </p>

            {/* Inventory preview */}
            {isHydrated && ownedItems.length > 0 && (
              <div className="mb-6">
                <span className="text-[8px] uppercase tracking-wider text-[var(--text-faint)] block mb-2">Your Items</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {ownedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--surface-overlay)] border border-[var(--border-subtle)]">
                      <Image src={item.sprite} alt={item.name} width={14} height={14} className="pixelated" />
                      <span className="text-[8px] text-[var(--text-muted)]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              className="btn-primary rounded-lg text-[13px] px-8 py-3"
            >
              Begin Battle
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(([questionId, optionId]) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    return question && question.correctOptionId === optionId;
  }).length;
  const feedbackBorder = feedback === "correct"
    ? "border-[var(--accent-green)] shadow-[0_0_20px_rgba(0,232,70,0.15)]"
    : feedback === "wrong"
    ? "border-[var(--accent-pink)] shadow-[0_0_20px_rgba(255,51,102,0.15)]"
    : "border-transparent";

  return (
    <div className={`rounded-2xl p-[1px] bg-gradient-to-br from-[var(--border-muted)] via-[var(--border-default)] to-[var(--border-muted)] transition-all duration-300`}>
      <div className={`rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative border-2 transition-all duration-300 ${feedbackBorder}`}>
        {/* Hit/Hurt overlay */}
        {feedback === "correct" && (
          <div className="absolute inset-0 bg-[var(--accent-green)]/5 animate-[quiz-hit_0.4s_ease-out] pointer-events-none z-10" />
        )}
        {feedback === "wrong" && (
          <div className="absolute inset-0 bg-[var(--accent-pink)]/10 animate-[quiz-hurt_0.4s_ease-out] pointer-events-none z-10" />
        )}

        <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-[var(--accent-teal)] opacity-[0.02]" />
        <div className="relative p-6">
          {/* Timer + Hearts bar */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-mono font-bold ${showTimerWarning ? "text-[var(--accent-pink)] animate-pulse" : isFrozen ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)]"}`}>
                  {isFrozen ? "FROZEN " : ""}{formatTime(timeRemaining)}
                </span>
                {hasShowProgress && (
                  <span className="text-[9px] font-mono text-[var(--accent-green)]">
                    {correctCount} correct &middot; {currentQuestionIndex + 1}/{totalQuestions}
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-overlay)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${timerPercentage}%`,
                    backgroundColor: timerColor,
                    boxShadow: showTimerWarning ? `0 0 8px ${timerColor}` : undefined,
                  }}
                />
              </div>
            </div>

            {/* Hearts */}
            <div className="flex items-center gap-1">
              {Array.from({ length: maxHearts }).map((_, index) => (
                <svg
                  key={index}
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  className={`transition-all duration-300 ${index < hearts ? "" : "opacity-20 grayscale"}`}
                  style={index >= hearts ? { filter: "grayscale(1)" } : undefined}
                >
                  <path
                    d="M10 17.5l-1.4-1.3C4 12.2 1 9.5 1 6.3 1 3.8 3 2 5.5 2c1.5 0 3 .8 4.5 2.2C11.5 2.8 13 2 14.5 2 17 2 19 3.8 19 6.3c0 3.2-3 5.9-7.6 9.9L10 17.5z"
                    fill={index < hearts ? "var(--accent-pink)" : "#333"}
                  />
                </svg>
              ))}
            </div>
          </div>

          {/* Boss HP bar with sprite */}
          {hasShowProgress && (
            <div className="mb-4 pt-2">
              <div className="flex items-center gap-3">
                {/* Boss sprite in battle */}
                <div
                  className="w-10 h-10 flex-shrink-0"
                  style={{ animation: bossHit ? bossData.hitAnimation : bossData.idleAnimation }}
                >
                  {bossData.sprite}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: bossData.color }}>
                      {bossData.name}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-faint)]">
                      {bossHp}/{totalQuestions}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-overlay)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${bossHit ? "animate-[quiz-hurt_0.3s_ease-out]" : ""}`}
                      style={{
                        width: `${(bossHp / totalQuestions) * 100}%`,
                        backgroundColor: bossHp > totalQuestions * 0.5 ? bossData.color : bossHp > totalQuestions * 0.25 ? "var(--realm-creational)" : "var(--accent-green)",
                        boxShadow: bossHit ? `0 0 12px ${bossData.color}` : undefined,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Question header */}
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalQuestions }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentQuestionIndex
                      ? "bg-[var(--accent-teal)] shadow-[0_0_5px_rgba(0,212,170,0.6)]"
                      : index < currentQuestionIndex
                      ? "bg-[var(--accent-green)]"
                      : "bg-[var(--border-default)]"
                  }`}
                />
              ))}
            </div>
          </div>

          <h4 className="text-[15px] font-extrabold tracking-tight text-[var(--text-primary)] mb-5 leading-[1.5]">
            {currentQuestion.question}
          </h4>

          <div className="space-y-2.5 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              const showCorrect = feedback !== "idle" && option.id === currentQuestion.correctOptionId;
              const showWrong = feedback === "wrong" && isSelected && option.id !== currentQuestion.correctOptionId;
              const isEliminated = eliminatedOptions.has(option.id);

              if (isEliminated) {
                return (
                  <div
                    key={option.id}
                    className="w-full text-left p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-overlay)]/50 opacity-40"
                  >
                    <span className="text-[12px] leading-[1.6] text-[var(--text-faint)] line-through">{option.text}</span>
                    <span className="ml-2 text-[8px] uppercase text-[var(--accent-pink)] font-semibold">eliminated</span>
                  </div>
                );
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerClick(currentQuestion.id, option.id)}
                  disabled={feedback !== "idle"}
                  className={
                    "w-full text-left p-3.5 rounded-lg border transition-all duration-200 " +
                    (showCorrect
                      ? "border-[var(--accent-green)] bg-[var(--accent-green)]/10 shadow-[0_0_12px_rgba(0,232,70,0.1)]"
                      : showWrong
                      ? "border-[var(--accent-pink)] bg-[var(--accent-pink)]/10 shadow-[0_0_12px_rgba(255,51,102,0.1)]"
                      : isSelected
                      ? "border-[var(--accent-teal)] bg-[var(--accent-teal)]/5"
                      : "border-[var(--border-default)] hover:border-[var(--accent-teal)]/40 hover:bg-[var(--surface-elevated)]")
                  }
                >
                  <span className="text-[12px] leading-[1.6] text-[var(--text-muted)]">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Inventory panel */}
          {isHydrated && ownedItems.length > 0 && (
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)] block mb-2">
                Inventory
              </span>
              <div className="flex flex-wrap gap-2">
                {passiveItems.map((item) => (
                  <div
                    key={item.id}
                    className="group/item relative flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--accent-teal)]/5 border border-[var(--accent-teal)]/20"
                  >
                    <Image src={item.sprite} alt={item.name} width={16} height={16} className="pixelated" />
                    <span className="text-[8px] text-[var(--accent-teal)] font-semibold">{item.name}</span>
                    <span className="text-[7px] text-[var(--text-faint)] uppercase">passive</span>
                    <div className="absolute bottom-full left-0 mb-1 w-44 p-2 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-muted)] shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all z-20 pointer-events-none">
                      <p className="text-[9px] font-semibold text-[var(--accent-teal)] mb-0.5">{item.name}</p>
                      <p className="text-[8px] text-[var(--text-muted)] leading-[1.5]">{item.description}</p>
                    </div>
                  </div>
                ))}

                {activeItems.map((item) => {
                  const isUsed = usedActiveItems.has(item.id);
                  return (
                    <div key={item.id} className="group/item relative">
                      <button
                        onClick={() => useActiveItem(item.id, item.effect)}
                        disabled={isUsed}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                          isUsed
                            ? "bg-[var(--surface-overlay)] border border-[var(--border-subtle)] opacity-40"
                            : "bg-[var(--accent-pink)]/5 border border-[var(--accent-pink)]/30 hover:bg-[var(--accent-pink)]/10"
                        }`}
                      >
                        <Image src={item.sprite} alt={item.name} width={16} height={16} className="pixelated" />
                        <span className={`text-[8px] font-semibold ${isUsed ? "text-[var(--text-faint)]" : "text-[var(--accent-pink)]"}`}>
                          {item.name}
                        </span>
                        <span className="text-[7px] text-[var(--text-faint)] uppercase">
                          {isUsed ? "used" : "use"}
                        </span>
                      </button>
                      <div className="absolute bottom-full left-0 mb-1 w-44 p-2 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-muted)] shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all z-20 pointer-events-none">
                        <p className="text-[9px] font-semibold text-[var(--accent-pink)] mb-0.5">{item.name}</p>
                        <p className="text-[8px] text-[var(--text-muted)] leading-[1.5]">{item.description}</p>
                        {isUsed && <p className="text-[7px] text-[var(--text-faint)] mt-0.5 italic">Already used this battle</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
