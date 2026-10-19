/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserProgress,
  VocabWord,
  RoundQuestionResult,
  DayStudyRecord,
  DailyQuest,
  DailyQuestData,
} from '../types';
import { getLevelInfo, checkNewBadges } from './levels';

const STORAGE_KEY = 'earth_explorer_progress_v1';

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateDailyQuests(dateStr: string, customTarget: number = 10): DailyQuestData {
  const quests: DailyQuest[] = [
    {
      id: 'quest-explore',
      title: '우주 탐험 출석하기',
      description: '단어 퀴즈 1라운드를 멋지게 완료해요!',
      target: 1,
      current: 0,
      rewardXp: 20,
      isCompleted: false,
      isClaimed: false,
      icon: '🚀',
    },
    {
      id: 'quest-custom-target',
      title: '오늘의 단어 목표 달성',
      description: `오늘 맞힌 단어 ${customTarget}개를 채워보세요!`,
      target: customTarget,
      current: 0,
      rewardXp: 40,
      isCompleted: false,
      isClaimed: false,
      icon: '🎯',
    },
    {
      id: 'quest-combo',
      title: '불꽃 콤보 장인',
      description: '3연속 이상 정답을 맞혀보세요!',
      target: 1,
      current: 0,
      rewardXp: 25,
      isCompleted: false,
      isClaimed: false,
      icon: '🔥',
    },
    {
      id: 'quest-review',
      title: '꼼꼼한 복습왕',
      description: '오답 노트를 복습하거나 단어 발음을 3회 들어보세요!',
      target: 3,
      current: 0,
      rewardXp: 25,
      isCompleted: false,
      isClaimed: false,
      icon: '👂',
    },
  ];

  return {
    date: dateStr,
    customWordTarget: customTarget,
    quests,
    allClearClaimed: false,
    allClearRewardXp: 50,
  };
}

// Builds the last 7 calendar days, keeping any existing records for those dates
function generateInitial7Days(existing: DayStudyRecord[] = []): DayStudyRecord[] {
  const byDate = new Map(existing.map((r) => [r.date, r]));
  const records: DayStudyRecord[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    records.push(byDate.get(dateStr) ?? {
      date: dateStr,
      wordsCount: 0,
      xpEarned: 0,
    });
  }
  return records;
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  totalWordsLearned: 0,
  totalCorrectAttempts: 0,
  totalAttempts: 0,
  difficultyStats: {
    easy: { correct: 0, total: 0 },
    normal: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  },
  streakDays: 1,
  lastStudyDate: getTodayString(),
  history7Days: generateInitial7Days(),
  wrongWords: {},
  unlockedBadges: [],
  dailyQuests: generateDailyQuests(getTodayString(), 10),
  totalQuestsCompleted: 0,
  soundEnabled: true,
  reducedMotion: false,
};

export function syncDailyQuests(progress: UserProgress): UserProgress {
  const today = getTodayString();
  const currentDaily = progress.dailyQuests;

  if (!currentDaily || currentDaily.date !== today) {
    const customTarget = currentDaily?.customWordTarget || 10;
    const freshDaily = generateDailyQuests(today, customTarget);

    const updated: UserProgress = {
      ...progress,
      dailyQuests: freshDaily,
    };
    saveUserProgress(updated);
    return updated;
  }

  return progress;
}

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_USER_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROGRESS;
    const parsed = JSON.parse(raw);

    const merged: UserProgress = {
      ...DEFAULT_USER_PROGRESS,
      ...parsed,
      difficultyStats: {
        ...DEFAULT_USER_PROGRESS.difficultyStats,
        ...(parsed.difficultyStats || {}),
      },
      wrongWords: parsed.wrongWords || {},
      unlockedBadges: parsed.unlockedBadges || [],
      history7Days: generateInitial7Days(parsed.history7Days || []),
      totalQuestsCompleted: parsed.totalQuestsCompleted || 0,
      dailyQuests: parsed.dailyQuests || generateDailyQuests(getTodayString(), 10),
    };

    return syncDailyQuests(merged);
  } catch {
    return DEFAULT_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function updateCustomDailyGoal(
  progress: UserProgress,
  newTarget: number
): UserProgress {
  const synced = syncDailyQuests(progress);
  const daily = { ...synced.dailyQuests };
  daily.customWordTarget = newTarget;

  daily.quests = daily.quests.map((q) => {
    if (q.id === 'quest-custom-target') {
      const isCompleted = q.current >= newTarget;
      return {
        ...q,
        target: newTarget,
        description: `오늘 맞힌 단어 ${newTarget}개를 채워보세요!`,
        isCompleted,
      };
    }
    return q;
  });

  const updated: UserProgress = {
    ...synced,
    dailyQuests: daily,
  };

  saveUserProgress(updated);
  return updated;
}

export function recordReviewAction(progress: UserProgress): UserProgress {
  const synced = syncDailyQuests(progress);
  const daily = { ...synced.dailyQuests };

  daily.quests = daily.quests.map((q) => {
    if (q.id === 'quest-review') {
      const newCurrent = Math.min(q.target, q.current + 1);
      return {
        ...q,
        current: newCurrent,
        isCompleted: newCurrent >= q.target,
      };
    }
    return q;
  });

  const updated: UserProgress = {
    ...synced,
    dailyQuests: daily,
  };

  saveUserProgress(updated);
  return updated;
}

export function claimQuestReward(
  progress: UserProgress,
  questId: string
): {
  updated: UserProgress;
  rewardXp: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: string[];
} {
  const synced = syncDailyQuests(progress);
  const daily = { ...synced.dailyQuests };
  let rewardXp = 0;

  daily.quests = daily.quests.map((q) => {
    if (q.id === questId && q.isCompleted && !q.isClaimed) {
      rewardXp = q.rewardXp;
      return {
        ...q,
        isClaimed: true,
      };
    }
    return q;
  });

  if (rewardXp === 0) {
    const levelInfo = getLevelInfo(synced.xp);
    return {
      updated: synced,
      rewardXp: 0,
      leveledUp: false,
      newLevel: levelInfo.level,
      newBadges: [],
    };
  }

  const oldTotalXp = synced.xp;
  const newTotalXp = oldTotalXp + rewardXp;
  const oldLevelInfo = getLevelInfo(oldTotalXp);
  const newLevelInfo = getLevelInfo(newTotalXp);
  const leveledUp = newLevelInfo.level > oldLevelInfo.level;

  const totalQuestsCompleted = (synced.totalQuestsCompleted || 0) + 1;

  const updated: UserProgress = {
    ...synced,
    xp: newTotalXp,
    level: newLevelInfo.level,
    dailyQuests: daily,
    totalQuestsCompleted,
  };

  const newBadges = checkNewBadges(updated);
  if (newBadges.length > 0) {
    updated.unlockedBadges = [...updated.unlockedBadges, ...newBadges];
  }

  saveUserProgress(updated);

  return {
    updated,
    rewardXp,
    leveledUp,
    newLevel: newLevelInfo.level,
    newBadges,
  };
}

export function claimAllClearReward(progress: UserProgress): {
  updated: UserProgress;
  rewardXp: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: string[];
} {
  const synced = syncDailyQuests(progress);
  const daily = { ...synced.dailyQuests };

  const allQuestsClaimed = daily.quests.every((q) => q.isClaimed);
  if (!allQuestsClaimed || daily.allClearClaimed) {
    const levelInfo = getLevelInfo(synced.xp);
    return {
      updated: synced,
      rewardXp: 0,
      leveledUp: false,
      newLevel: levelInfo.level,
      newBadges: [],
    };
  }

  const rewardXp = daily.allClearRewardXp;
  daily.allClearClaimed = true;

  const oldTotalXp = synced.xp;
  const newTotalXp = oldTotalXp + rewardXp;
  const oldLevelInfo = getLevelInfo(oldTotalXp);
  const newLevelInfo = getLevelInfo(newTotalXp);
  const leveledUp = newLevelInfo.level > oldLevelInfo.level;

  const updated: UserProgress = {
    ...synced,
    xp: newTotalXp,
    level: newLevelInfo.level,
    dailyQuests: daily,
  };

  const newBadges = checkNewBadges(updated);
  if (newBadges.length > 0) {
    updated.unlockedBadges = [...updated.unlockedBadges, ...newBadges];
  }

  saveUserProgress(updated);

  return {
    updated,
    rewardXp,
    leveledUp,
    newLevel: newLevelInfo.level,
    newBadges,
  };
}

export function recordQuestionMistake(progress: UserProgress, word: VocabWord): UserProgress {
  const today = getTodayString();
  const existing = progress.wrongWords[word.id];

  const updatedWrong: UserProgress = {
    ...progress,
    wrongWords: {
      ...progress.wrongWords,
      [word.id]: {
        wordId: word.id,
        word: word.word,
        koreanMeaning: word.koreanMeaning,
        phonetic: word.phonetic,
        difficulty: word.difficulty,
        category: word.category,
        exampleEn: word.exampleEn,
        exampleKo: word.exampleKo,
        explanation: word.explanation,
        mistakeCount: existing ? existing.mistakeCount + 1 : 1,
        lastMistakeDate: today,
      },
    },
  };

  saveUserProgress(updatedWrong);
  return updatedWrong;
}

export function removeWrongWord(progress: UserProgress, wordId: string): UserProgress {
  const newWrongWords = { ...progress.wrongWords };
  delete newWrongWords[wordId];

  const updated = {
    ...progress,
    wrongWords: newWrongWords,
  };

  saveUserProgress(updated);
  return updated;
}

export function recordRoundCompletion(
  prevProgress: UserProgress,
  results: RoundQuestionResult[],
  difficulty: string,
  isReviewRound: boolean = false
): {
  updated: UserProgress;
  earnedXp: number;
  newBadges: string[];
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
} {
  const synced = syncDailyQuests(prevProgress);
  const today = getTodayString();
  const yesterday = getYesterdayString();

  let earnedXp = 0;
  let roundCorrect = 0;
  let maxStreak = 0;
  let currentStreak = 0;

  results.forEach((r) => {
    earnedXp += r.earnedXp;
    if (r.isCorrect) {
      roundCorrect++;
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  });

  const oldTotalXp = synced.xp;
  const newTotalXp = oldTotalXp + earnedXp;

  const oldLevelInfo = getLevelInfo(oldTotalXp);
  const newLevelInfo = getLevelInfo(newTotalXp);
  const leveledUp = newLevelInfo.level > oldLevelInfo.level;

  // Streak calculation
  let newStreakDays = synced.streakDays;
  if (synced.lastStudyDate === yesterday) {
    newStreakDays += 1;
  } else if (synced.lastStudyDate !== today && synced.lastStudyDate) {
    newStreakDays = 1;
  }

  // Update 7-day history (today is always the last entry)
  const history = generateInitial7Days(synced.history7Days || []);
  const todayIndex = history.length - 1;
  history[todayIndex] = {
    ...history[todayIndex],
    wordsCount: history[todayIndex].wordsCount + results.length,
    xpEarned: history[todayIndex].xpEarned + earnedXp,
  };

  // Update difficulty stats per word (review rounds mix difficulties)
  const updatedDifficultyStats = { ...synced.difficultyStats };
  results.forEach((r) => {
    const key = r.word.difficulty;
    const prev = updatedDifficultyStats[key] || { correct: 0, total: 0 };
    updatedDifficultyStats[key] = {
      correct: prev.correct + (r.isCorrect ? 1 : 0),
      total: prev.total + 1,
    };
  });

  // Update wrong words
  const updatedWrongWords = { ...synced.wrongWords };
  results.forEach((r) => {
    if (!r.isCorrect) {
      const existing = updatedWrongWords[r.word.id];
      updatedWrongWords[r.word.id] = {
        wordId: r.word.id,
        word: r.word.word,
        koreanMeaning: r.word.koreanMeaning,
        phonetic: r.word.phonetic,
        difficulty: r.word.difficulty,
        category: r.word.category,
        exampleEn: r.word.exampleEn,
        exampleKo: r.word.exampleKo,
        explanation: r.word.explanation,
        mistakeCount: existing ? existing.mistakeCount + 1 : 1,
        lastMistakeDate: today,
      };
    } else if (isReviewRound && updatedWrongWords[r.word.id]) {
      if (updatedWrongWords[r.word.id].mistakeCount <= 1) {
        delete updatedWrongWords[r.word.id];
      } else {
        updatedWrongWords[r.word.id] = {
          ...updatedWrongWords[r.word.id],
          mistakeCount: updatedWrongWords[r.word.id].mistakeCount - 1,
        };
      }
    }
  });

  // Update Daily Quests Progress!
  const updatedDaily = { ...synced.dailyQuests };
  updatedDaily.quests = updatedDaily.quests.map((q) => {
    let current = q.current;

    if (q.id === 'quest-explore') {
      current = Math.min(q.target, current + 1);
    } else if (q.id === 'quest-custom-target') {
      current = Math.min(q.target, current + roundCorrect);
    } else if (q.id === 'quest-combo' && maxStreak >= 3) {
      current = Math.min(q.target, current + 1);
    } else if (q.id === 'quest-review' && isReviewRound) {
      current = Math.min(q.target, current + results.length);
    }

    const isCompleted = current >= q.target;
    return {
      ...q,
      current,
      isCompleted,
    };
  });

  const updated: UserProgress = {
    ...synced,
    xp: newTotalXp,
    level: newLevelInfo.level,
    totalWordsLearned: synced.totalWordsLearned + results.length,
    totalCorrectAttempts: synced.totalCorrectAttempts + roundCorrect,
    totalAttempts: synced.totalAttempts + results.length,
    difficultyStats: updatedDifficultyStats,
    streakDays: newStreakDays,
    lastStudyDate: today,
    history7Days: history,
    wrongWords: updatedWrongWords,
    dailyQuests: updatedDaily,
  };

  // Check badges
  const newBadges = checkNewBadges(updated, {
    score: roundCorrect,
    total: results.length,
    maxStreak,
    difficulty,
    isReviewRound,
  });

  if (newBadges.length > 0) {
    updated.unlockedBadges = [...updated.unlockedBadges, ...newBadges];
  }

  saveUserProgress(updated);

  return {
    updated,
    earnedXp,
    newBadges,
    leveledUp,
    oldLevel: oldLevelInfo.level,
    newLevel: newLevelInfo.level,
  };
}

export function exportProgressAsJson(progress: UserProgress): string {
  return JSON.stringify(progress, null, 2);
}

export function importProgressFromJson(jsonStr: string): UserProgress | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== 'object' || parsed === null) return null;
    if (typeof parsed.xp !== 'number') return null;

    const restored: UserProgress = {
      ...DEFAULT_USER_PROGRESS,
      ...parsed,
    };
    saveUserProgress(restored);
    return syncDailyQuests(restored);
  } catch {
    return null;
  }
}

export function resetAllProgress(): UserProgress {
  const fresh = {
    ...DEFAULT_USER_PROGRESS,
    history7Days: generateInitial7Days(),
    dailyQuests: generateDailyQuests(getTodayString(), 10),
  };
  saveUserProgress(fresh);
  return fresh;
}
