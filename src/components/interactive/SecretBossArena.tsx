"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PatternQuiz } from "@/types/quiz";
import { useQuiz } from "@/hooks/useQuiz";
import { useGameStore } from "@/hooks/useGameStore";
import { useSound } from "@/hooks/useSound";
import { SECRET_BOSS_TITLE, SECRET_BOSS_SUBTITLE, SECRET_BOSS_LORE } from "@/data/secret-boss";

const SECONDS_PER_QUESTION = 40;
const BASE_HEARTS = 3;
const ANSWER_FEEDBACK_DELAY = 1200;

type FeedbackState = "idle" | "correct" | "wrong";
type BossPhase = "intro" | "battle" | "victory" | "defeat";
type WeatherIntensity = "calm" | "storm" | "rage" | "apocalypse";

interface SecretBossArenaProps {
  quiz: PatternQuiz;
}

export function SecretBossArena({ quiz }: SecretBossArenaProps) {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    selectedAnswers,
    selectAnswer,
    goToNext,
    submitQuiz,
    resetQuiz,
  } = useQuiz(quiz);

  const { handleQuizComplete } = useGameStore();
  const { play, startMusic, stopMusic } = useSound();

  const [phase, setPhase] = useState<BossPhase>("intro");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [hearts, setHearts] = useState(BASE_HEARTS);
  const [timeRemaining, setTimeRemaining] = useState(totalQuestions * SECONDS_PER_QUESTION);
  const [bossHp, setBossHp] = useState(totalQuestions);
  const [bossAnimation, setBossAnimation] = useState<"idle" | "hit" | "attack" | "charge">("idle");
  const [screenShake, setScreenShake] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [showBossDialogue, setShowBossDialogue] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const weatherIntensity: WeatherIntensity =
    bossHp > totalQuestions * 0.75 ? "calm" :
    bossHp > totalQuestions * 0.5 ? "storm" :
    bossHp > totalQuestions * 0.25 ? "rage" : "apocalypse";

  const bossDialogues = {
    intro: "You dare challenge the Pattern God? Show me your mastery...",
    hit: ["Impressive...", "You know your patterns.", "The realms taught you well.", "Hmph. Lucky."],
    attack: ["WEAK!", "Is that all?!", "Your knowledge fails!", "Pathetic attempt!"],
    lowHp: "Impossible... no mortal has pushed me this far!",
    victory: "You... have truly mastered all patterns. The title of Pattern God is yours.",
    defeat: "As expected. Return when you are truly ready.",
  };

  useEffect(() => {
    if (phase !== "battle") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((previous) => {
        if (previous <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleDefeat();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    return () => { stopMusic(); };
  }, [stopMusic]);

  const triggerLightning = useCallback(() => {
    setLightningFlash(true);
    setTimeout(() => setLightningFlash(false), 150);
    setTimeout(() => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 80);
    }, 200);
  }, []);

  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  }, []);

  const handleStart = () => {
    setPhase("battle");
    startMusic("boss");
    setShowBossDialogue(bossDialogues.intro);
    setTimeout(() => setShowBossDialogue(""), 3000);
  };

  const handleDefeat = () => {
    stopMusic();
    play("gameover");
    setPhase("defeat");
    setBossAnimation("charge");
    setShowBossDialogue(bossDialogues.defeat);
  };

  const handleAnswerClick = useCallback((questionId: string, optionId: string) => {
    if (feedback !== "idle") return;
    selectAnswer(questionId, optionId);

    const isCorrect = optionId === currentQuestion.correctOptionId;

    if (isCorrect) {
      setFeedback("correct");
      play("hit");
      setBossHp((previous) => Math.max(0, previous - 1));
      setBossAnimation("hit");
      setCorrectCount((previous) => previous + 1);
      triggerLightning();

      const hitDialogue = bossDialogues.hit[Math.floor(Math.random() * bossDialogues.hit.length)];
      setShowBossDialogue(hitDialogue);

      setTimeout(() => {
        setFeedback("idle");
        setBossAnimation("idle");
        setEliminatedOptions(new Set());
        setShowBossDialogue("");

        if (bossHp <= 1) {
          const quizResult = submitQuiz();
          handleQuizComplete(quizResult);
          stopMusic();
          play("levelup");
          setPhase("victory");
          setShowBossDialogue(bossDialogues.victory);
        } else if (!isLastQuestion) {
          goToNext();
        } else {
          const quizResult = submitQuiz();
          handleQuizComplete(quizResult);
          stopMusic();
          play("levelup");
          setPhase("victory");
          setShowBossDialogue(bossDialogues.victory);
        }
      }, ANSWER_FEEDBACK_DELAY);
    } else {
      setFeedback("wrong");
      play("hurt");
      setBossAnimation("attack");
      triggerScreenShake();

      const attackDialogue = bossDialogues.attack[Math.floor(Math.random() * bossDialogues.attack.length)];
      setShowBossDialogue(attackDialogue);

      setHearts((previous) => {
        const newHearts = previous - 1;
        if (newHearts <= 0) {
          setTimeout(() => {
            setFeedback("idle");
            handleDefeat();
          }, ANSWER_FEEDBACK_DELAY);
        } else {
          setTimeout(() => {
            setFeedback("idle");
            setBossAnimation("idle");
            setEliminatedOptions(new Set());
            setShowBossDialogue("");
            if (!isLastQuestion) {
              goToNext();
            } else {
              const quizResult = submitQuiz();
              quizResult.passed = false;
              handleQuizComplete(quizResult);
              handleDefeat();
            }
          }, ANSWER_FEEDBACK_DELAY);
        }
        return newHearts;
      });
    }
  }, [feedback, currentQuestion, isLastQuestion, bossHp, selectAnswer, goToNext, submitQuiz, handleQuizComplete, play, stopMusic, triggerLightning, triggerScreenShake]);

  const handleRetry = () => {
    resetQuiz();
    setPhase("intro");
    setFeedback("idle");
    setHearts(BASE_HEARTS);
    setTimeRemaining(totalQuestions * SECONDS_PER_QUESTION);
    setBossHp(totalQuestions);
    setBossAnimation("idle");
    setEliminatedOptions(new Set());
    setCorrectCount(0);
    setShowBossDialogue("");
    setScreenShake(false);
    setLightningFlash(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${screenShake ? "animate-[screen-shake_0.5s_ease-out]" : ""}`}>
      {/* Dynamic Background */}
      <SecretBossBackground weatherIntensity={weatherIntensity} />

      {/* Lightning Flash Overlay */}
      {lightningFlash && (
        <div className="fixed inset-0 bg-white/30 z-50 pointer-events-none" />
      )}

      {/* Weather Particles */}
      <SecretBossWeather intensity={weatherIntensity} />

      {/* Floating Monsters */}
      <SecretBossMonsters phase={phase} weatherIntensity={weatherIntensity} />

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 pt-20 pb-16">
        {phase === "intro" && (
          <IntroPhase onStart={handleStart} />
        )}

        {phase === "battle" && (
          <BattlePhase
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            selectedAnswers={selectedAnswers}
            feedback={feedback}
            hearts={hearts}
            maxHearts={BASE_HEARTS}
            timeRemaining={timeRemaining}
            totalTime={totalQuestions * SECONDS_PER_QUESTION}
            bossHp={bossHp}
            bossAnimation={bossAnimation}
            weatherIntensity={weatherIntensity}
            showBossDialogue={showBossDialogue}
            correctCount={correctCount}
            eliminatedOptions={eliminatedOptions}
            onAnswerClick={handleAnswerClick}
            formatTime={formatTime}
          />
        )}

        {phase === "victory" && (
          <VictoryPhase
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            dialogue={showBossDialogue}
          />
        )}

        {phase === "defeat" && (
          <DefeatPhase
            dialogue={showBossDialogue}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}

/* ===== SUB-COMPONENTS ===== */

function SecretBossBackground({ weatherIntensity }: { weatherIntensity: WeatherIntensity }) {
  const bgGradient = {
    calm: "radial-gradient(ellipse at 50% 100%, #1a0a2e 0%, #0d0221 30%, #000 70%)",
    storm: "radial-gradient(ellipse at 50% 100%, #1f0a3d 0%, #0f0328 30%, #050010 70%)",
    rage: "radial-gradient(ellipse at 50% 100%, #2d0a0a 0%, #1a0505 30%, #0a0000 70%)",
    apocalypse: "radial-gradient(ellipse at 50% 100%, #3d0a1a 0%, #200510 30%, #0a0005 70%)",
  }[weatherIntensity];

  return (
    <div className="fixed inset-0 z-0 transition-all duration-3000" style={{ background: bgGradient }}>
      {/* Terrain - Mountains */}
      <svg className="absolute bottom-0 left-0 right-0 h-[40vh] opacity-60" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <path d="M0,400 L0,280 Q100,200 200,250 Q350,180 450,220 Q550,120 720,200 Q850,100 1000,180 Q1100,130 1200,200 Q1300,160 1440,220 L1440,400 Z" fill="#0a0015" />
        <path d="M0,400 L0,320 Q150,260 300,300 Q450,250 600,290 Q750,230 900,280 Q1050,240 1200,280 Q1350,260 1440,300 L1440,400 Z" fill="#050010" />
        <path d="M0,400 L0,350 Q200,320 400,340 Q600,310 800,330 Q1000,320 1200,340 Q1350,330 1440,350 L1440,400 Z" fill="#020008" />
      </svg>

      {/* Floating runes */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="absolute text-purple-500/10 text-4xl font-mono"
            style={{
              left: `${10 + index * 12}%`,
              top: `${20 + (index % 3) * 25}%`,
              animation: `float ${6 + index * 0.7}s ease-in-out infinite alternate`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            {["◆", "◇", "⬡", "△", "☆", "⟁", "⬢", "◈"][index]}
          </div>
        ))}
      </div>

      {/* Ground glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 transition-colors duration-3000"
        style={{
          background: weatherIntensity === "apocalypse"
            ? "linear-gradient(to top, rgba(200,0,50,0.15), transparent)"
            : weatherIntensity === "rage"
            ? "linear-gradient(to top, rgba(150,0,100,0.1), transparent)"
            : "linear-gradient(to top, rgba(100,0,200,0.05), transparent)",
        }}
      />
    </div>
  );
}

function SecretBossWeather({ intensity }: { intensity: WeatherIntensity }) {
  const particleCount = { calm: 20, storm: 50, rage: 80, apocalypse: 120 }[intensity];

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {Array.from({ length: particleCount }).map((_, index) => {
        const isEmber = intensity === "rage" || intensity === "apocalypse";
        const size = Math.random() * 3 + 1;
        return (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 10}%`,
              backgroundColor: isEmber
                ? `hsl(${Math.random() * 30 + 10}, 100%, ${50 + Math.random() * 30}%)`
                : `rgba(200, 180, 255, ${0.3 + Math.random() * 0.4})`,
              animation: isEmber
                ? `ember-fall ${3 + Math.random() * 4}s linear infinite`
                : `rain-fall ${1 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function SecretBossMonsters({ phase, weatherIntensity }: { phase: BossPhase; weatherIntensity: WeatherIntensity }) {
  if (phase !== "battle") return null;

  const monsterCount = { calm: 2, storm: 4, rage: 6, apocalypse: 8 }[weatherIntensity];

  return (
    <div className="fixed inset-0 z-15 pointer-events-none overflow-hidden">
      {Array.from({ length: monsterCount }).map((_, index) => (
        <div
          key={index}
          className="absolute opacity-40"
          style={{
            left: `${Math.random() * 90}%`,
            bottom: `${5 + Math.random() * 20}%`,
            animation: `monster-drift ${8 + Math.random() * 6}s ease-in-out infinite alternate`,
            animationDelay: `${index * 1.5}s`,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 5 5 5 9c0 3 1 5 3 6l-1 4h10l-1-4c2-1 3-3 3-6 0-4-3-7-7-7z" fill={weatherIntensity === "apocalypse" ? "#ff3366" : "#9933ff"} opacity="0.6" />
            <circle cx="9" cy="8" r="1.5" fill="#fff" />
            <circle cx="15" cy="8" r="1.5" fill="#fff" />
            <path d="M9 12h6" stroke="#fff" strokeWidth="0.5" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function IntroPhase({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center pt-16 animate-[fade-in_1s_ease-out]">
      {/* Boss Title */}
      <div className="mb-8">
        <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[var(--accent-pink)]/80 block mb-3">
          ??? Secret Boss ???
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-[var(--font-display)] italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-2">
          {SECRET_BOSS_TITLE}
        </h1>
        <p className="text-lg text-purple-300/80 italic font-light">{SECRET_BOSS_SUBTITLE}</p>
      </div>

      {/* Boss Sprite */}
      <div className="relative inline-block mb-8">
        <div className="w-48 h-48 relative">
          <BossSprite animation="idle" size={192} />
        </div>
        <div className="absolute -inset-8 bg-gradient-radial from-purple-500/20 to-transparent rounded-full animate-pulse" />
      </div>

      {/* Lore */}
      <div className="max-w-2xl mx-auto mb-10">
        <p className="text-[13px] leading-[2] text-purple-200/70 italic">
          {SECRET_BOSS_LORE}
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 mb-10 text-[10px] uppercase tracking-wider">
        <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <span className="text-purple-300">15 Questions</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
          <span className="text-pink-300">80% to Pass</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <span className="text-red-300">3 Hearts</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="relative inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 group"
        style={{
          background: "linear-gradient(135deg, #9333ea, #ec4899, #ef4444)",
          color: "#fff",
          boxShadow: "0 0 40px rgba(147, 51, 234, 0.3), 0 0 80px rgba(236, 72, 153, 0.15)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2L13 8H18L14 12L16 18L10 14L4 18L6 12L2 8H7L10 2Z" />
        </svg>
        <span>Begin the Final Challenge</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-white/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}

interface BattlePhaseProps {
  currentQuestion: { id: string; question: string; options: { id: string; text: string }[]; correctOptionId: string };
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswers: Record<string, string>;
  feedback: FeedbackState;
  hearts: number;
  maxHearts: number;
  timeRemaining: number;
  totalTime: number;
  bossHp: number;
  bossAnimation: "idle" | "hit" | "attack" | "charge";
  weatherIntensity: WeatherIntensity;
  showBossDialogue: string;
  correctCount: number;
  eliminatedOptions: Set<string>;
  onAnswerClick: (questionId: string, optionId: string) => void;
  formatTime: (seconds: number) => string;
}

function BattlePhase({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswers,
  feedback,
  hearts,
  maxHearts,
  timeRemaining,
  totalTime,
  bossHp,
  bossAnimation,
  showBossDialogue,
  correctCount,
  eliminatedOptions,
  onAnswerClick,
  formatTime,
}: BattlePhaseProps) {
  const timerPercentage = (timeRemaining / totalTime) * 100;
  const bossHpPercentage = (bossHp / totalQuestions) * 100;

  return (
    <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
      {/* Boss Area */}
      <div className="relative text-center mb-4">
        {/* Boss HP Bar */}
        <div className="max-w-md mx-auto mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-300">{SECRET_BOSS_TITLE}</span>
            <span className="text-[9px] font-mono text-purple-300/70">{bossHp}/{totalQuestions}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/50 border border-purple-500/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${bossHpPercentage}%`,
                background: bossHpPercentage > 50
                  ? "linear-gradient(90deg, #9333ea, #a855f7)"
                  : bossHpPercentage > 25
                  ? "linear-gradient(90deg, #ec4899, #f472b6)"
                  : "linear-gradient(90deg, #ef4444, #f87171)",
                boxShadow: bossAnimation === "hit" ? "0 0 15px rgba(255,255,255,0.5)" : undefined,
              }}
            />
          </div>
        </div>

        {/* Boss Sprite */}
        <div className={`relative inline-block transition-transform duration-300 ${
          bossAnimation === "hit" ? "translate-x-4 scale-95" :
          bossAnimation === "attack" ? "-translate-x-6 scale-110" :
          bossAnimation === "charge" ? "scale-125" : ""
        }`}>
          <BossSprite animation={bossAnimation} size={140} />
        </div>

        {/* Boss Dialogue */}
        {showBossDialogue && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/80 border border-purple-500/40 max-w-xs animate-[fade-in_0.3s_ease-out]">
            <p className="text-[11px] text-purple-200 italic text-center">&ldquo;{showBossDialogue}&rdquo;</p>
          </div>
        )}
      </div>

      {/* HUD Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-black/40 border border-purple-500/20 backdrop-blur-sm">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-black/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${timerPercentage}%`,
                backgroundColor: timeRemaining <= 30 ? "#ef4444" : "#a855f7",
              }}
            />
          </div>
          <span className={`text-[10px] font-mono font-bold ${timeRemaining <= 30 ? "text-red-400 animate-pulse" : "text-purple-300"}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Question Progress */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-purple-300/70 uppercase tracking-wider">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>
          <span className="text-[9px] text-green-400 font-mono">
            {correctCount} hit{correctCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1">
          {Array.from({ length: maxHearts }).map((_, index) => (
            <svg key={index} width="18" height="18" viewBox="0 0 20 20" className={`transition-all duration-300 ${index < hearts ? "scale-100" : "scale-75 opacity-20"}`}>
              <path
                d="M10 17.5l-1.4-1.3C4 12.2 1 9.5 1 6.3 1 3.8 3 2 5.5 2c1.5 0 3 .8 4.5 2.2C11.5 2.8 13 2 14.5 2 17 2 19 3.8 19 6.3c0 3.2-3 5.9-7.6 9.9L10 17.5z"
                fill={index < hearts ? "#ec4899" : "#333"}
              />
            </svg>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className={`rounded-2xl p-[1px] transition-all duration-300 ${
        feedback === "correct"
          ? "bg-gradient-to-br from-green-500 via-purple-500/50 to-green-500"
          : feedback === "wrong"
          ? "bg-gradient-to-br from-red-500 via-purple-500/50 to-red-500"
          : "bg-gradient-to-br from-purple-500/40 via-pink-500/20 to-purple-500/40"
      }`}>
        <div className="rounded-[15px] bg-[#0a0015]/95 backdrop-blur-md p-6 border border-purple-500/10">
          {/* Feedback overlay */}
          {feedback === "correct" && (
            <div className="absolute inset-0 rounded-[15px] bg-green-500/5 animate-[quiz-hit_0.5s_ease-out] pointer-events-none" />
          )}
          {feedback === "wrong" && (
            <div className="absolute inset-0 rounded-[15px] bg-red-500/10 animate-[quiz-hurt_0.5s_ease-out] pointer-events-none" />
          )}

          {/* Question */}
          <h4 className="text-[14px] font-bold text-purple-100 mb-6 leading-[1.7]">
            {currentQuestion.question}
          </h4>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isEliminated = eliminatedOptions.has(option.id);
              const showCorrect = feedback !== "idle" && option.id === currentQuestion.correctOptionId;
              const isSelected = feedback !== "idle" && option.id !== currentQuestion.correctOptionId && Object.values(selectedAnswers).includes(option.id);

              if (isEliminated) {
                return (
                  <div key={option.id} className="p-3.5 rounded-lg border border-purple-500/10 bg-black/30 opacity-30">
                    <span className="text-[12px] text-purple-300/50 line-through">{option.text}</span>
                  </div>
                );
              }

              return (
                <button
                  key={option.id}
                  onClick={() => onAnswerClick(currentQuestion.id, option.id)}
                  disabled={feedback !== "idle"}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 ${
                    showCorrect
                      ? "border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                      : isSelected
                      ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-500/5 bg-black/20"
                  }`}
                >
                  <span className="text-[12px] leading-[1.7] text-purple-200/90">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 mt-5">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentQuestionIndex
                    ? "bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]"
                    : index < currentQuestionIndex
                    ? "bg-green-500/70"
                    : "bg-purple-900/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VictoryPhase({ correctCount, totalQuestions, dialogue }: { correctCount: number; totalQuestions: number; dialogue: string }) {
  return (
    <div className="text-center pt-12 animate-[fade-in_1.5s_ease-out]">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 mb-6 animate-[spin-slow_8s_linear_infinite]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 mb-3 font-[var(--font-display)] italic">
          Pattern God Defeated!
        </h2>
        <p className="text-purple-200/80 italic text-sm mb-6">&ldquo;{dialogue}&rdquo;</p>
        <div className="flex justify-center gap-4 text-[11px]">
          <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300">
            {correctCount}/{totalQuestions} correct
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
            +500 XP
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            Title: Pattern God
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-6 rounded-2xl bg-black/30 border border-purple-500/20 mb-8">
        <p className="text-[13px] text-purple-200/70 leading-[1.8]">
          You have defeated the ultimate challenge. All 22 design patterns have been truly mastered.
          You now bear the title of <strong className="text-amber-300">Pattern God</strong> — the highest honor
          a developer can achieve in this realm.
        </p>
      </div>

      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:scale-105 transition-transform"
      >
        Return to the Overworld
      </a>
    </div>
  );
}

function DefeatPhase({ dialogue, onRetry }: { dialogue: string; onRetry: () => void }) {
  return (
    <div className="text-center pt-16 animate-[fade-in_1s_ease-out]">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <path d="M12 2C8 2 5 5 5 9c0 3 1 5 3 6l-1 4h10l-1-4c2-1 3-3 3-6 0-4-3-7-7-7z" />
            <circle cx="9" cy="9" r="1" fill="#ef4444" />
            <circle cx="15" cy="9" r="1" fill="#ef4444" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-red-400 mb-3 font-[var(--font-display)] italic">
          Defeated...
        </h2>
        <p className="text-red-200/60 italic text-sm mb-8">&ldquo;{dialogue}&rdquo;</p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:scale-105 transition-transform"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 0 0-7 7h2a5 5 0 0 1 9.2-2.7L10 7h5V2l-1.8 1.8A7 7 0 0 0 8 1z" />
        </svg>
        Rise Again
      </button>
    </div>
  );
}

/* ===== BOSS SPRITE ===== */

function BossSprite({ animation, size }: { animation: "idle" | "hit" | "attack" | "charge"; size: number }) {
  const glowColor = {
    idle: "rgba(147, 51, 234, 0.3)",
    hit: "rgba(255, 255, 255, 0.5)",
    attack: "rgba(239, 68, 68, 0.5)",
    charge: "rgba(236, 72, 153, 0.4)",
  }[animation];

  const bodyColor = {
    idle: "#7c3aed",
    hit: "#a78bfa",
    attack: "#dc2626",
    charge: "#ec4899",
  }[animation];

  return (
    <div
      className={`relative transition-all duration-300 ${
        animation === "idle" ? "animate-[boss-float_3s_ease-in-out_infinite]" :
        animation === "hit" ? "animate-[boss-hit_0.6s_ease-out]" :
        animation === "attack" ? "animate-[boss-attack_0.6s_ease-out]" :
        "animate-[boss-charge_1s_ease-in-out_infinite]"
      }`}
      style={{ width: size, height: size }}
    >
      {/* Glow aura */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-all duration-300"
        style={{ backgroundColor: glowColor }}
      />

      {/* Boss SVG */}
      <svg viewBox="0 0 120 120" width={size} height={size} className="relative z-10">
        {/* Body */}
        <ellipse cx="60" cy="65" rx="35" ry="40" fill={bodyColor} className="transition-all duration-300" />

        {/* Inner pattern */}
        <ellipse cx="60" cy="65" rx="25" ry="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M45,55 Q60,45 75,55 Q60,65 45,55" fill="rgba(255,255,255,0.05)" />

        {/* Crown/horns */}
        <path d="M35,35 L40,20 L45,32" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <path d="M55,28 L60,12 L65,28" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
        <path d="M75,35 L80,20 L85,32" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />

        {/* Eyes */}
        <g className={animation === "hit" ? "opacity-50" : ""}>
          <ellipse cx="48" cy="58" rx="6" ry="7" fill="#0f0f0f" />
          <ellipse cx="72" cy="58" rx="6" ry="7" fill="#0f0f0f" />
          <circle cx="48" cy="57" r="3" fill={animation === "attack" ? "#ef4444" : "#a855f7"} className="transition-all duration-200" />
          <circle cx="72" cy="57" r="3" fill={animation === "attack" ? "#ef4444" : "#a855f7"} className="transition-all duration-200" />
          <circle cx="49" cy="55" r="1" fill="white" opacity="0.8" />
          <circle cx="73" cy="55" r="1" fill="white" opacity="0.8" />
        </g>

        {/* Mouth */}
        {animation === "attack" ? (
          <path d="M45,78 Q60,90 75,78 L70,82 Q60,92 50,82 Z" fill="#1f1f1f" stroke="#ef4444" strokeWidth="0.5" />
        ) : animation === "hit" ? (
          <path d="M50,80 Q60,75 70,80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        ) : (
          <path d="M48,78 Q60,84 72,78" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        )}

        {/* Arms/tendrils */}
        <path
          d={animation === "attack" ? "M25,60 Q15,50 10,55 Q5,60 15,65" : "M25,65 Q18,70 20,75 Q22,80 25,75"}
          fill="none" stroke={bodyColor} strokeWidth="4" strokeLinecap="round"
          className="transition-all duration-300"
        />
        <path
          d={animation === "attack" ? "M95,60 Q105,50 110,55 Q115,60 105,65" : "M95,65 Q102,70 100,75 Q98,80 95,75"}
          fill="none" stroke={bodyColor} strokeWidth="4" strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Energy orbs */}
        {animation === "charge" && (
          <>
            <circle cx="30" cy="45" r="4" fill="#ec4899" opacity="0.6" className="animate-pulse" />
            <circle cx="90" cy="45" r="4" fill="#ec4899" opacity="0.6" className="animate-pulse" />
            <circle cx="60" cy="100" r="3" fill="#ec4899" opacity="0.4" className="animate-pulse" />
          </>
        )}
      </svg>
    </div>
  );
}
