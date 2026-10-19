/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { VocabWord, Difficulty, RoundQuestionResult, UserProgress } from '../types';
import { VOCABULARY_LIST } from '../data/words';
import { playSound } from '../utils/sound';
import { speakEnglishWord } from '../utils/speech';
import { getLevelInfo } from '../utils/levels';
import { MascotEarth } from './MascotEarth';
import { CelebrationEffects } from './CelebrationEffects';
import {
  Volume2,
  Lightbulb,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface GameScreenProps {
  difficulty: Difficulty;
  progress: UserProgress;
  onFinishRound: (results: RoundQuestionResult[]) => void;
  onQuit: () => void;
  customWordPool?: VocabWord[]; // For review mode
  isReviewMode?: boolean;
  onListen: () => void;
}

// Unbiased Fisher-Yates shuffle
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  difficulty,
  progress,
  onFinishRound,
  onQuit,
  customWordPool,
  isReviewMode = false,
  onListen,
}) => {
  // 1. Pick 10 random words without repetition
  const questionPool = useMemo(() => {
    let pool: VocabWord[] = [];
    if (customWordPool && customWordPool.length > 0) {
      pool = [...customWordPool];
    } else {
      pool = VOCABULARY_LIST.filter((w) => w.difficulty === difficulty);
    }

    // Shuffle pool
    const shuffled = shuffle(pool);
    // Up to 10 questions
    return shuffled.slice(0, Math.min(10, shuffled.length));
  }, [difficulty, customWordPool]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<RoundQuestionResult[]>([]);
  const [usedHint, setUsedHint] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [firstTryWrong, setFirstTryWrong] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong-once' | 'wrong-final'>('idle');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [comboStreak, setComboStreak] = useState(0);

  // Celebration overlay state
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(0);

  // Current question word
  const currentWord = questionPool[currentIndex] as VocabWord | undefined;
  const levelInfo = getLevelInfo(progress.xp);
  // Review rounds mix difficulties, so each question uses its own word difficulty
  const mode: Difficulty = isReviewMode && currentWord ? currentWord.difficulty : difficulty;

  // Auto pronunciation on question load
  useEffect(() => {
    if (currentWord && mode !== 'hard') {
      const timer = setTimeout(() => {
        speakEnglishWord(currentWord.word);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentWord, mode]);

  // Generate 4 randomized multiple choice options for Easy/Normal modes
  const choices = useMemo(() => {
    if (!currentWord || mode === 'hard') return [];

    const correctAnswer = currentWord.koreanMeaning;

    // Pick 3 distractors from the rest of the vocabulary list with distinct meanings
    const otherMeanings = VOCABULARY_LIST
      .filter((w) => w.koreanMeaning !== correctAnswer)
      .map((w) => w.koreanMeaning);

    // Shuffle and pick 3 unique distractors
    const shuffledOthers = shuffle(Array.from(new Set(otherMeanings))).slice(0, 3);
    const combined = shuffle([correctAnswer, ...shuffledOthers]);
    return combined;
  }, [currentWord, mode]);

  // Hint activation
  const handleUseHint = () => {
    if (usedHint || feedbackState === 'correct' || feedbackState === 'wrong-final') return;
    setUsedHint(true);
    playSound('hint', progress.soundEnabled);
  };

  // Base XP by difficulty
  const baseScore = mode === 'hard' ? 30 : mode === 'normal' ? 20 : 10;
  const calculateXp = (hintWasUsed: boolean) => (hintWasUsed ? Math.round(baseScore / 2) : baseScore);

  // Handle Answer Evaluation
  const evaluateAnswer = useCallback((answerText: string) => {
    if (!currentWord || feedbackState === 'correct' || feedbackState === 'wrong-final') return;

    let isMatch = false;
    if (mode === 'hard') {
      // Direct spelling check: case-insensitive & trimmed
      const cleanInput = answerText.trim().toLowerCase();
      const cleanTarget = currentWord.word.trim().toLowerCase();
      isMatch = cleanInput === cleanTarget;
    } else {
      isMatch = answerText === currentWord.koreanMeaning;
    }

    if (isMatch) {
      // Correct!
      const earned = calculateXp(usedHint);
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      setLastEarnedXp(earned);
      setShowCelebration(true);
      setFeedbackState('correct');

      if (newStreak >= 3) {
        playSound('streak', progress.soundEnabled);
      } else {
        playSound('correct', progress.soundEnabled);
      }

      const qResult: RoundQuestionResult = {
        word: currentWord,
        isCorrect: true,
        usedHint,
        attemptsUsed: attemptsUsed + 1,
        earnedXp: earned,
        userAnswer: answerText,
      };

      setResults((prev) => [...prev, qResult]);

      // Hide celebration overlay after 1.8s
      setTimeout(() => {
        setShowCelebration(false);
      }, 1800);
    } else {
      // Wrong answer
      setComboStreak(0);
      playSound('wrong', progress.soundEnabled);

      if (attemptsUsed === 0) {
        // First chance failed -> offer 2nd chance!
        setAttemptsUsed(1);
        setFirstTryWrong(true);
        setFeedbackState('wrong-once');
        setShakeCard(true);
        setTimeout(() => setShakeCard(false), 500);
      } else {
        // Second chance failed -> Final failure for this question
        setAttemptsUsed(2);
        setFeedbackState('wrong-final');
        setShakeCard(true);
        setTimeout(() => setShakeCard(false), 500);

        const qResult: RoundQuestionResult = {
          word: currentWord,
          isCorrect: false,
          usedHint,
          attemptsUsed: 2,
          earnedXp: 0,
          userAnswer: answerText,
        };

        setResults((prev) => [...prev, qResult]);
      }
    }
  }, [currentWord, feedbackState, mode, usedHint, comboStreak, attemptsUsed, progress.soundEnabled]);

  // Choice button click
  const handleSelectChoice = (choice: string) => {
    if (feedbackState === 'correct' || feedbackState === 'wrong-final') return;
    setSelectedChoice(choice);
    evaluateAnswer(choice);
  };

  // Hard mode input submission
  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;
    evaluateAnswer(typedAnswer);
  };

  // Move to next question or conclude round
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionPool.length) {
      setCurrentIndex((prev) => prev + 1);
      setUsedHint(false);
      setAttemptsUsed(0);
      setFirstTryWrong(false);
      setFeedbackState('idle');
      setSelectedChoice(null);
      setTypedAnswer('');
    } else {
      // All questions done!
      onFinishRound(results);
    }
  };

  const isAnswered = feedbackState === 'correct' || feedbackState === 'wrong-final';
  // In hard mode the pronunciation would give away the spelling, so show it only after answering
  const revealPronunciation = mode !== 'hard' || isAnswered;

  // Keyboard shortcuts: 1-4 pick a choice, Enter moves to the next question
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (isAnswered && e.key === 'Enter') {
        e.preventDefault();
        handleNextQuestion();
        return;
      }
      const idx = Number(e.key) - 1;
      if (!isAnswered && mode !== 'hard' && idx >= 0 && idx < choices.length) {
        handleSelectChoice(choices[idx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!currentWord) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <p className="text-slate-600 mb-4">문제를 불러오는 중입니다...</p>
        <button onClick={onQuit} className="px-4 py-2 bg-stone-200 rounded-xl">
          나가기
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questionPool.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 relative">
      {/* Celebration Canvas & Floating XP modal */}
      <CelebrationEffects
        show={showCelebration}
        xpGained={lastEarnedXp}
        streakCount={comboStreak}
        reducedMotion={progress.reducedMotion}
      />

      {/* Top HUD Bar */}
      <div className="bg-white/90 border border-[#EADBCC] rounded-2xl p-3.5 sm:p-4 mb-5 shadow-2xs backdrop-blur-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Level & XP */}
          <div className="flex items-center gap-2">
            <span className="text-base">{levelInfo.characterBadge}</span>
            <span className="font-extrabold text-slate-800">
              Lv.{levelInfo.level}
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-bold text-amber-700 bg-[#FFE7A0]/70 px-2 py-0.5 rounded-md">
              {progress.xp} XP
            </span>
          </div>

          {/* Difficulty & Combo Streak */}
          <div className="flex items-center gap-2">
            {comboStreak >= 2 && (
              <span className="flex items-center gap-1 font-extrabold text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-full animate-pulse-subtle">
                <Flame className="w-3.5 h-3.5" />
                <span>{comboStreak}연속</span>
              </span>
            )}

            <span
              className={`font-extrabold px-2.5 py-0.5 rounded-full text-xs ${
                mode === 'easy'
                  ? 'bg-[#B8E6D1] text-emerald-950'
                  : mode === 'normal'
                  ? 'bg-[#DCD0F5] text-purple-950'
                  : 'bg-[#FFC8B8] text-rose-950'
              }`}
            >
              {isReviewMode ? '오답 복습' : mode === 'easy' ? '쉬움' : mode === 'normal' ? '보통' : '어려움'}
            </span>

            <button
              onClick={onQuit}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="게임 중단하고 나가기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Counter & Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-600 whitespace-nowrap">
            문제 {currentIndex + 1} / {questionPool.length}
          </div>
          <div className="flex-1 bg-[#EFE7D8] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B8E6D1] to-[#FFE7A0] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs font-semibold text-slate-500 tabular-nums">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div
        className={`bg-white border-2 rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 relative ${
          shakeCard ? 'animate-shake-gentle border-red-300' : 'border-[#F0E4D4]'
        }`}
      >
        {/* Category & Sound Pronounce button */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-[#FFF9F0] border border-[#EAE0D2] px-3 py-1 rounded-full">
              {currentWord.category}
            </span>
            {revealPronunciation && (
              <span className="text-xs text-slate-400 font-medium">
                {currentWord.phonetic}
              </span>
            )}
          </div>

          {revealPronunciation && (
            <button
              onClick={() => {
                speakEnglishWord(currentWord.word);
                onListen();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-[#B8E6D1]/50 hover:bg-[#B8E6D1] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="원어민 발음 듣기"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>발음 듣기</span>
            </button>
          )}
        </div>

        {/* Word Display (or Target Meaning in Hard mode) */}
        {mode !== 'hard' ? (
          <div className="text-center py-4 mb-4">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-wide uppercase font-mono mb-2">
              {currentWord.word}
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-700">
              {currentWord.word}는 무슨 뜻일까?
            </p>

            {mode === 'normal' && (
              <div className="mt-3 inline-block bg-[#F8F5EE] border border-[#E9DEC8] rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-600 italic">
                &ldquo;{currentWord.exampleEn}&rdquo;
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 mb-4">
            <div className="inline-block bg-[#FFF0EB] border border-[#FFD0C2] text-rose-900 font-black text-xs px-3 py-1 rounded-full mb-2">
              직접 영어 단어 입력하기
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              &ldquo;{currentWord.koreanMeaning}&rdquo;
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {currentWord.explanation}
            </p>
          </div>
        )}

        {/* Hint Box or Button */}
        <div className="mb-6">
          {!usedHint ? (
            <button
              onClick={handleUseHint}
              disabled={feedbackState === 'correct' || feedbackState === 'wrong-final'}
              className="mx-auto flex items-center justify-center gap-2 text-xs font-extrabold text-amber-800 bg-[#FFE7A0]/70 hover:bg-[#FFE7A0] px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#E6D18C] shadow-2xs"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>힌트 보기 (사용 시 획득 XP 절반)</span>
            </button>
          ) : (
            <div className="bg-[#FFFCE8] border border-[#EADB90] rounded-2xl p-3.5 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 animate-pop-in">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold text-amber-900">추론 힌트: </strong>
                <span>{currentWord.hint}</span>
                {mode === 'hard' && (
                  <div className="mt-1 font-mono font-bold text-amber-800">
                    단어 길이: {currentWord.word.length}글자 (첫 글자: {currentWord.word[0].toUpperCase()})
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Choices Area (Easy / Normal) */}
        {mode !== 'hard' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {choices.map((choice, idx) => {
              const isSelected = selectedChoice === choice;
              const isCorrectTarget = choice === currentWord.koreanMeaning;

              let btnStyle = 'bg-[#FAF6F0] hover:bg-[#F3EDE2] border-[#E8DDCD] text-slate-800';

              if (feedbackState === 'correct' && isCorrectTarget) {
                btnStyle = 'bg-[#B8E6D1] border-emerald-500 text-emerald-950 font-black shadow-xs';
              } else if (feedbackState === 'wrong-final') {
                if (isCorrectTarget) {
                  btnStyle = 'bg-[#B8E6D1] border-emerald-500 text-emerald-950 font-black';
                } else if (isSelected) {
                  btnStyle = 'bg-red-100 border-red-400 text-red-950 line-through';
                }
              } else if (feedbackState === 'wrong-once' && isSelected) {
                btnStyle = 'bg-red-50 border-red-300 text-red-900';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectChoice(choice)}
                  disabled={feedbackState === 'correct' || feedbackState === 'wrong-final'}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all duration-150 cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/70 border border-slate-300/60 flex items-center justify-center text-xs text-slate-500 font-extrabold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{choice}</span>
                  </div>

                  {feedbackState === 'correct' && isCorrectTarget && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  )}
                  {feedbackState === 'wrong-final' && isSelected && !isCorrectTarget && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : null}
        {mode !== 'hard' && !isAnswered && (
          <p className="-mt-3 mb-6 text-center text-xs text-slate-400">
            ⌨️ 키보드 숫자 1~4로 고르고, Enter로 다음 문제로 넘어갈 수 있어요
          </p>
        )}
        {mode === 'hard' && (
          /* Hard Mode: Typing Input */
          <form onSubmit={handleSubmitInput} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={feedbackState === 'correct' || feedbackState === 'wrong-final'}
                placeholder="영어 단어를 입력하세요 (예: Erosion)"
                className="flex-1 px-5 py-4 text-base sm:text-lg font-mono font-bold rounded-2xl border-2 border-[#EADBCC] focus:border-[#FFC8B8] focus:outline-hidden bg-[#FAF6F0]"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={!typedAnswer.trim() || feedbackState === 'correct' || feedbackState === 'wrong-final'}
                className="py-4 px-6 bg-gradient-to-r from-[#FFC8B8] to-[#FFE7A0] hover:from-[#F7B6A4] hover:to-[#F8DE93] disabled:opacity-50 text-slate-900 font-extrabold rounded-2xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                정답 확인
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 대소문자는 구별하지 않으니 편하게 입력해 주세요!
            </p>
          </form>
        )}

        {/* Mascot Feedback Banner for 1st wrong attempt */}
        {feedbackState === 'wrong-once' && (
          <div className="bg-[#FFF4ED] border border-[#FFD5C0] rounded-2xl p-4 mb-5 flex items-center gap-3 animate-pop-in">
            <MascotEarth size="sm" emotion="encouraging" />
            <div className="text-left">
              <div className="font-extrabold text-sm text-rose-900">
                괜찮아! 다시 생각해 보자!
              </div>
              <div className="text-xs text-rose-700">
                한 번 더 시도할 수 있는 기회가 있어. 힌트도 참고해 봐!
              </div>
            </div>
          </div>
        )}

        {/* Explanation Card when Final Wrong */}
        {feedbackState === 'wrong-final' && (
          <div className="bg-[#F0F8FF] border border-[#CDE4F7] rounded-2xl p-4 mb-5 animate-pop-in">
            <div className="flex items-center gap-2 text-sky-950 font-extrabold text-sm mb-1.5">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>정답 및 과학 상식</span>
            </div>
            <div className="text-sm font-bold text-slate-800 mb-1">
              정답: <strong className="text-emerald-700">{currentWord.word}</strong> = {currentWord.koreanMeaning}
            </div>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              {currentWord.explanation}
            </p>
            <div className="bg-white/80 rounded-xl p-2.5 text-xs text-slate-600">
              <div className="font-semibold text-slate-700">&ldquo;{currentWord.exampleEn}&rdquo;</div>
              <div className="text-slate-500 mt-0.5">{currentWord.exampleKo}</div>
            </div>
          </div>
        )}

        {/* Next Question / Proceed CTA */}
        {(feedbackState === 'correct' || feedbackState === 'wrong-final') && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-[#B8E6D1] to-[#A2E3FA] hover:from-[#A8DEC6] hover:to-[#91D8F3] text-emerald-950 font-extrabold text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>{currentIndex + 1 === questionPool.length ? '탐험 결과 보기' : '다음 문제로'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Encouragement Footer */}
      <div className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>틀린 단어는 자동으로 오답 노트에 쏙 저장되어 나중에 다시 연습할 수 있어요!</span>
      </div>
    </div>
  );
};
