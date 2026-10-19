/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Badge, UserProgress } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  characterBadge: string;
  currentLevelBaseXp: number;
  nextLevelXp: number;
  progressPercent: number;
  xpRemaining: number;
  isMaxLevel?: boolean;
}

const PREDEFINED_TITLES: { level: number; title: string; badge: string; minXp: number }[] = [
  { level: 1, title: '지구 탐험 새싹', badge: '🌱', minXp: 0 },
  { level: 2, title: '구름 관찰자', badge: '☁️', minXp: 100 },
  { level: 3, title: '별빛 수집가', badge: '⭐', minXp: 250 },
  { level: 4, title: '행성 연구원', badge: '🪐', minXp: 450 },
  { level: 5, title: '우주 탐험 대장', badge: '🚀', minXp: 700 },
  { level: 6, title: '은하계 항해사', badge: '🌌', minXp: 1000 },
  { level: 7, title: '혜성 사냥꾼', badge: '☄️', minXp: 1350 },
  { level: 8, title: '성운 개척자', badge: '✨', minXp: 1750 },
  { level: 9, title: '초신성 수호자', badge: '🌟', minXp: 2200 },
  { level: 10, title: '우주 시공간 마스터', badge: '👑', minXp: 2700 },
];

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let title = '지구 탐험 새싹';
  let characterBadge = '🌱';
  let currentLevelBaseXp = 0;
  let nextLevelXp = 100;

  for (let i = 0; i < PREDEFINED_TITLES.length; i++) {
    const current = PREDEFINED_TITLES[i];
    const next = PREDEFINED_TITLES[i + 1];

    if (next) {
      if (totalXp >= current.minXp && totalXp < next.minXp) {
        level = current.level;
        title = current.title;
        characterBadge = current.badge;
        currentLevelBaseXp = current.minXp;
        nextLevelXp = next.minXp;
        break;
      }
    } else {
      // Level 10 or above
      if (totalXp >= current.minXp) {
        const extraXp = totalXp - current.minXp;
        const extraLevels = Math.floor(extraXp / 600);
        level = 10 + extraLevels;
        title = extraLevels === 0 ? '우주 시공간 마스터' : `코스모스 지배자 Lv.${level}`;
        characterBadge = '👑';
        currentLevelBaseXp = current.minXp + extraLevels * 600;
        nextLevelXp = currentLevelBaseXp + 600;
      }
    }
  }

  const range = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const earned = Math.max(0, totalXp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.max(0, Math.round((earned / range) * 100)));
  const xpRemaining = Math.max(0, nextLevelXp - totalXp);

  return {
    level,
    title,
    characterBadge,
    currentLevelBaseXp,
    nextLevelXp,
    progressPercent,
    xpRemaining,
  };
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    name: '첫 걸음 탐험가',
    description: '첫 번째 단어 탐험 게임을 완료했어요!',
    icon: '🚀',
    unlockedAt: null,
  },
  {
    id: 'badge-combo-3',
    name: '3연속 척척박사',
    description: '문제를 3개 연속으로 정답을 맞혔어요!',
    icon: '⚡',
    unlockedAt: null,
  },
  {
    id: 'badge-combo-5',
    name: '불꽃 콤보 마스터',
    description: '놀라워요! 5개 연속으로 정답을 맞혔어요!',
    icon: '🔥',
    unlockedAt: null,
  },
  {
    id: 'badge-vocab-10',
    name: '단어 수집가 (10개)',
    description: '지구과학 단어 10개를 학습했어요!',
    icon: '📚',
    unlockedAt: null,
  },
  {
    id: 'badge-vocab-30',
    name: '지구과학 연구원 (30개)',
    description: '지구과학 단어 30개를 마스터했어요!',
    icon: '🔬',
    unlockedAt: null,
  },
  {
    id: 'badge-vocab-50',
    name: '우주 대백과사전 (50개)',
    description: '무려 50개 이상의 단어를 정복했어요!',
    icon: '🪐',
    unlockedAt: null,
  },
  {
    id: 'badge-hard-conqueror',
    name: '도전의 달인 (Hard 완수)',
    description: '어려움 난이도에서 직접 입력 문제를 완벽히 풀었어요!',
    icon: '🎯',
    unlockedAt: null,
  },
  {
    id: 'badge-level-5',
    name: '우주 탐험 대장',
    description: '레벨 5에 도달하여 대장 칭호를 획득했어요!',
    icon: '👑',
    unlockedAt: null,
  },
  {
    id: 'badge-perfect-round',
    name: '만점 천재',
    description: '한 라운드 10문제를 모두 정답으로 맞혔어요!',
    icon: '💯',
    unlockedAt: null,
  },
  {
    id: 'badge-review-master',
    name: '오답 탈출 마스터',
    description: '틀렸던 오답 노트 단어를 다시 도전해 맞혔어요!',
    icon: '🛡️',
    unlockedAt: null,
  },
  {
    id: 'badge-quest-first',
    name: '일일 탐험 퀘스트 달성',
    description: '오늘의 학습 목표 퀘스트를 완료하고 보너스 경험치를 받았어요!',
    icon: '🎁',
    unlockedAt: null,
  },
  {
    id: 'badge-quest-all-clear',
    name: '일일 퀘스트 올클리어',
    description: '오늘 주어진 모든 일일 퀘스트를 완벽하게 완수했어요!',
    icon: '🌟',
    unlockedAt: null,
  },
];

export function checkNewBadges(
  progress: UserProgress,
  roundStats?: {
    score: number;
    total: number;
    maxStreak: number;
    difficulty: string;
    isReviewRound?: boolean;
  }
): string[] {
  const currentBadgeIds = new Set(progress.unlockedBadges);
  const newlyUnlocked: string[] = [];

  const add = (id: string) => {
    if (!currentBadgeIds.has(id)) {
      currentBadgeIds.add(id);
      newlyUnlocked.push(id);
    }
  };

  // Check general achievements
  if (progress.totalAttempts > 0) add('badge-first-step');
  if (progress.totalWordsLearned >= 10) add('badge-vocab-10');
  if (progress.totalWordsLearned >= 30) add('badge-vocab-30');
  if (progress.totalWordsLearned >= 50) add('badge-vocab-50');
  if (progress.level >= 5) add('badge-level-5');
  if ((progress.totalQuestsCompleted || 0) >= 1) add('badge-quest-first');
  if (progress.dailyQuests?.allClearClaimed) add('badge-quest-all-clear');

  // Check round specific achievements
  if (roundStats) {
    if (roundStats.maxStreak >= 3) add('badge-combo-3');
    if (roundStats.maxStreak >= 5) add('badge-combo-5');
    if (roundStats.score === roundStats.total && roundStats.total >= 10) {
      add('badge-perfect-round');
    }
    if (roundStats.difficulty === 'hard' && !roundStats.isReviewRound && roundStats.score >= 7) {
      add('badge-hard-conqueror');
    }
    if (roundStats.isReviewRound && roundStats.score >= 3) {
      add('badge-review-master');
    }
  }

  return newlyUnlocked;
}
