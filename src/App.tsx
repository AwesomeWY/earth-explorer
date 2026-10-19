/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Difficulty,
  ScreenState,
  UserProgress,
  RoundQuestionResult,
  WrongWordEntry,
  VocabWord,
} from './types';
import {
  loadUserProgress,
  saveUserProgress,
  recordRoundCompletion,
  removeWrongWord,
  resetAllProgress,
  claimQuestReward,
  claimAllClearReward,
  updateCustomDailyGoal,
  recordReviewAction,
} from './utils/storage';
import { playSound } from './utils/sound';
import { VOCABULARY_LIST } from './data/words';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { DifficultySelect } from './components/DifficultySelect';
import { GameScreen } from './components/GameScreen';
import { GameSummary } from './components/GameSummary';
import { WrongNotebook } from './components/WrongNotebook';
import { GrowthStats } from './components/GrowthStats';
import { LevelUpModal } from './components/LevelUpModal';
import { Sparkles, Gift } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('MENU');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [activeResults, setActiveResults] = useState<RoundQuestionResult[]>([]);
  const [lastRoundXp, setLastRoundXp] = useState(0);

  // Review mode state
  const [isReviewRound, setIsReviewRound] = useState(false);
  const [reviewWordPool, setReviewWordPool] = useState<VocabWord[]>([]);

  // Level up popup state
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; newXp: number } | null>(null);

  // Floating bonus XP toast for quest claims
  const [questRewardToast, setQuestRewardToast] = useState<{ message: string; xp: number } | null>(null);

  // Sync reducedMotion class with document root
  useEffect(() => {
    if (progress.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [progress.reducedMotion]);

  // Count unclaimed quests for the header badge
  const unclaimedQuestsCount = useMemo(() => {
    if (!progress.dailyQuests) return 0;
    const questsReady = progress.dailyQuests.quests.filter((q) => q.isCompleted && !q.isClaimed).length;
    const allQuestsClaimed = progress.dailyQuests.quests.every((q) => q.isClaimed);
    const allClearReady = allQuestsClaimed && !progress.dailyQuests.allClearClaimed ? 1 : 0;
    return questsReady + allClearReady;
  }, [progress.dailyQuests]);

  // Toggle sound
  const handleToggleSound = () => {
    const updated = { ...progress, soundEnabled: !progress.soundEnabled };
    setProgress(updated);
    saveUserProgress(updated);
    if (!progress.soundEnabled) {
      playSound('click', true);
    }
  };

  // Toggle reduced motion
  const handleToggleReducedMotion = () => {
    const updated = { ...progress, reducedMotion: !progress.reducedMotion };
    setProgress(updated);
    saveUserProgress(updated);
  };

  // Start regular game
  const handleStartExploration = () => {
    setIsReviewRound(false);
    setReviewWordPool([]);
    setCurrentScreen('DIFFICULTY_SELECT');
    playSound('click', progress.soundEnabled);
  };

  // Select difficulty and jump to game
  const handleSelectDifficulty = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    setIsReviewRound(false);
    setReviewWordPool([]);
    setCurrentScreen('PLAYING');
    playSound('click', progress.soundEnabled);
  };

  // Start review game using wrong words
  const handleStartWrongReview = () => {
    const wrongEntries = Object.values(progress.wrongWords);
    if (wrongEntries.length === 0) return;
    startReviewRoundWithEntries(wrongEntries);
  };

  const startReviewRoundWithEntries = (entries: WrongWordEntry[]) => {
    // Record review action for daily quests
    const updatedWithReview = recordReviewAction(progress);
    setProgress(updatedWithReview);

    const words: VocabWord[] = entries.map((e) => ({
      id: e.wordId,
      word: e.word,
      koreanMeaning: e.koreanMeaning,
      phonetic: e.phonetic,
      difficulty: e.difficulty,
      category: e.category,
      // Use the original hint so the answer isn't revealed
      hint:
        VOCABULARY_LIST.find((w) => w.id === e.wordId)?.hint ??
        `'${e.category}' 분야의 단어야. 예문을 떠올려 봐!`,
      exampleEn: e.exampleEn,
      exampleKo: e.exampleKo,
      explanation: e.explanation,
    }));

    setIsReviewRound(true);
    setReviewWordPool(words);
    // Review rounds use each word's own difficulty inside GameScreen
    setSelectedDifficulty('normal');
    setCurrentScreen('PLAYING');
    playSound('click', progress.soundEnabled);
  };

  // Handle round completion
  const handleFinishRound = (results: RoundQuestionResult[]) => {
    const { updated, earnedXp, leveledUp, newLevel } = recordRoundCompletion(
      progress,
      results,
      selectedDifficulty,
      isReviewRound
    );

    setProgress(updated);
    setActiveResults(results);
    setLastRoundXp(earnedXp);
    setCurrentScreen('SUMMARY');

    if (leveledUp) {
      playSound('levelup', progress.soundEnabled);
      setLevelUpData({ newLevel, newXp: updated.xp });
    }
  };

  // Handle Claiming a Daily Quest Reward
  const handleClaimQuest = (questId: string) => {
    const { updated, rewardXp, leveledUp, newLevel } = claimQuestReward(progress, questId);
    setProgress(updated);

    if (rewardXp > 0) {
      playSound('correct', progress.soundEnabled);
      setQuestRewardToast({
        message: '일일 퀘스트 보상 획득!',
        xp: rewardXp,
      });
      setTimeout(() => setQuestRewardToast(null), 2500);

      if (leveledUp) {
        playSound('levelup', progress.soundEnabled);
        setLevelUpData({ newLevel, newXp: updated.xp });
      }
    }
  };

  // Handle Claiming All-Clear Bonus Box
  const handleClaimAllClear = () => {
    const { updated, rewardXp, leveledUp, newLevel } = claimAllClearReward(progress);
    setProgress(updated);

    if (rewardXp > 0) {
      playSound('levelup', progress.soundEnabled);
      setQuestRewardToast({
        message: '🌟 퀘스트 올클리어 대박 보너스!',
        xp: rewardXp,
      });
      setTimeout(() => setQuestRewardToast(null), 3000);

      if (leveledUp) {
        setLevelUpData({ newLevel, newXp: updated.xp });
      }
    }
  };

  // Handle Changing Daily Word Goal
  const handleUpdateTarget = (newTarget: number) => {
    const updated = updateCustomDailyGoal(progress, newTarget);
    setProgress(updated);
    playSound('click', progress.soundEnabled);
  };

  // Remove word from wrong notebook
  const handleRemoveWrongWord = (wordId: string) => {
    const updated = removeWrongWord(progress, wordId);
    setProgress(updated);
    playSound('click', progress.soundEnabled);
  };

  // Manual pronunciation listening counts toward the review quest
  const handleListen = () => {
    setProgress((prev) => recordReviewAction(prev));
  };

  // Reset all progress
  const handleResetData = () => {
    const fresh = resetAllProgress();
    setProgress(fresh);
    setCurrentScreen('MENU');
    playSound('click', progress.soundEnabled);
  };

  const wrongCount = Object.keys(progress.wrongWords).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] text-slate-800 font-sans selection:bg-[#FFE7A0] selection:text-slate-900">
      {/* Top Bar Navigation following Top Bar Contract */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(s) => {
          setCurrentScreen(s);
          playSound('click', progress.soundEnabled);
        }}
        wrongWordCount={wrongCount}
        unclaimedQuestsCount={unclaimedQuestsCount}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
        reducedMotion={progress.reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Floating Quest Reward Toast */}
      {questRewardToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce-cute pointer-events-none">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black px-6 py-3 rounded-full shadow-xl flex items-center gap-2 border-2 border-white text-sm sm:text-base">
            <Gift className="w-5 h-5 text-amber-100" />
            <span>{questRewardToast.message}</span>
            <span className="bg-white text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-black">
              +{questRewardToast.xp} XP
            </span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentScreen === 'MENU' && (
          <MainMenu
            progress={progress}
            onNavigate={(s) => {
              setCurrentScreen(s);
              playSound('click', progress.soundEnabled);
            }}
            onStartExploration={handleStartExploration}
            onStartWrongReview={handleStartWrongReview}
            onClaimQuest={handleClaimQuest}
            onClaimAllClear={handleClaimAllClear}
            onUpdateTarget={handleUpdateTarget}
          />
        )}

        {currentScreen === 'DIFFICULTY_SELECT' && (
          <DifficultySelect
            onSelect={handleSelectDifficulty}
            onBack={() => {
              setCurrentScreen('MENU');
              playSound('click', progress.soundEnabled);
            }}
          />
        )}

        {currentScreen === 'PLAYING' && (
          <GameScreen
            difficulty={selectedDifficulty}
            progress={progress}
            onFinishRound={handleFinishRound}
            onQuit={() => {
              setCurrentScreen('MENU');
              playSound('click', progress.soundEnabled);
            }}
            customWordPool={isReviewRound ? reviewWordPool : undefined}
            isReviewMode={isReviewRound}
            onListen={handleListen}
          />
        )}

        {currentScreen === 'SUMMARY' && (
          <GameSummary
            results={activeResults}
            earnedXp={lastRoundXp}
            difficulty={selectedDifficulty}
            onNavigate={(s) => {
              setCurrentScreen(s);
              playSound('click', progress.soundEnabled);
            }}
            onPlayAgain={() => {
              setCurrentScreen('DIFFICULTY_SELECT');
              playSound('click', progress.soundEnabled);
            }}
            onReviewMistakes={() => {
              const wrongEntries = activeResults
                .filter((r) => !r.isCorrect)
                .map((r) => ({
                  wordId: r.word.id,
                  word: r.word.word,
                  koreanMeaning: r.word.koreanMeaning,
                  phonetic: r.word.phonetic,
                  difficulty: r.word.difficulty,
                  category: r.word.category,
                  exampleEn: r.word.exampleEn,
                  exampleKo: r.word.exampleKo,
                  explanation: r.word.explanation,
                  mistakeCount: 1,
                  lastMistakeDate: new Date().toISOString().slice(0, 10),
                }));
              if (wrongEntries.length > 0) {
                startReviewRoundWithEntries(wrongEntries);
              } else {
                setCurrentScreen('WRONG_NOTEBOOK');
              }
            }}
            onListen={handleListen}
          />
        )}

        {currentScreen === 'WRONG_NOTEBOOK' && (
          <WrongNotebook
            progress={progress}
            onNavigate={(s) => {
              setCurrentScreen(s);
              playSound('click', progress.soundEnabled);
            }}
            onStartReviewGame={(entries) => startReviewRoundWithEntries(entries)}
            onRemoveWord={handleRemoveWrongWord}
            onListen={handleListen}
          />
        )}

        {currentScreen === 'GROWTH_STATS' && (
          <GrowthStats
            progress={progress}
            onNavigate={(s) => {
              setCurrentScreen(s);
              playSound('click', progress.soundEnabled);
            }}
            onResetData={handleResetData}
            onProgressUpdated={(newProg) => setProgress(newProg)}
          />
        )}
      </main>

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          newXp={levelUpData.newXp}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Quiet, Clean Footer */}
      <footer className="border-t border-[#F0E4D4] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-medium">
            우주 단어 탐험대 (Earth Explorer) · 초등 5학년을 위한 지구과학 영어 퀴즈
          </div>
          <div className="text-slate-400">
            데이터는 브라우저 로컬 저장소에 안전하게 보관됩니다
          </div>
        </div>
        <div className="mt-3 font-bold text-slate-600 tracking-wide">
          By Mindstream LAB Awesome JWY
        </div>
      </footer>
    </div>
  );
}
