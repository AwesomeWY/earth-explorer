/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'easy' | 'normal' | 'hard';

export type ScienceCategory =
  | '우주와 태양계'
  | '대기와 날씨'
  | '지권과 암석'
  | '해양과 물의 순환'
  | '지구의 역사와 변화';

export interface VocabWord {
  id: string;
  word: string;
  koreanMeaning: string;
  phonetic: string;
  difficulty: Difficulty;
  category: ScienceCategory;
  hint: string;
  exampleEn: string;
  exampleKo: string;
  explanation: string;
}

export interface WrongWordEntry {
  wordId: string;
  word: string;
  koreanMeaning: string;
  phonetic: string;
  difficulty: Difficulty;
  category: ScienceCategory;
  exampleEn: string;
  exampleKo: string;
  explanation: string;
  mistakeCount: number;
  lastMistakeDate: string; // YYYY-MM-DD
}

export interface DayStudyRecord {
  date: string; // YYYY-MM-DD
  wordsCount: number;
  xpEarned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null; // ISO string or null
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardXp: number;
  isCompleted: boolean;
  isClaimed: boolean;
  icon: string;
}

export interface DailyQuestData {
  date: string; // YYYY-MM-DD
  customWordTarget: number; // e.g. 10, 15, 20, 30
  quests: DailyQuest[];
  allClearClaimed: boolean;
  allClearRewardXp: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  totalWordsLearned: number;
  totalCorrectAttempts: number;
  totalAttempts: number;
  difficultyStats: {
    easy: { correct: number; total: number };
    normal: { correct: number; total: number };
    hard: { correct: number; total: number };
  };
  streakDays: number;
  lastStudyDate: string;
  history7Days: DayStudyRecord[];
  wrongWords: Record<string, WrongWordEntry>; // key is wordId
  unlockedBadges: string[]; // badge ids
  dailyQuests: DailyQuestData;
  totalQuestsCompleted: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export type ScreenState =
  | 'MENU'
  | 'DIFFICULTY_SELECT'
  | 'PLAYING'
  | 'SUMMARY'
  | 'WRONG_NOTEBOOK'
  | 'GROWTH_STATS';

export interface RoundQuestionResult {
  word: VocabWord;
  isCorrect: boolean;
  usedHint: boolean;
  attemptsUsed: number;
  earnedXp: number;
  userAnswer: string;
}
