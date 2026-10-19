/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProgress, ScreenState } from '../types';
import { getLevelInfo } from '../utils/levels';
import { MascotEarth } from './MascotEarth';
import { DailyQuestsCard } from './DailyQuestsCard';
import { Rocket, BookOpen, BarChart3, Star, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

interface MainMenuProps {
  progress: UserProgress;
  onNavigate: (screen: ScreenState) => void;
  onStartExploration: () => void;
  onStartWrongReview: () => void;
  onClaimQuest: (questId: string) => void;
  onClaimAllClear: () => void;
  onUpdateTarget: (newTarget: number) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onNavigate,
  onStartExploration,
  onStartWrongReview,
  onClaimQuest,
  onClaimAllClear,
  onUpdateTarget,
}) => {
  const levelInfo = getLevelInfo(progress.xp);
  const wrongCount = Object.keys(progress.wrongWords).length;
  const overallAccuracy =
    progress.totalAttempts > 0
      ? Math.round((progress.totalCorrectAttempts / progress.totalAttempts) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Hero Welcome Card */}
      <div className="w-full bg-white/80 border-2 border-[#F0E4D4] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-8 mb-8 backdrop-blur-xs relative overflow-hidden">
        {/* Decorative soft pastel bubbles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#B8E6D1]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#DCD0F5]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Earth Character with cute interactive presence */}
        <div className="shrink-0 flex flex-col items-center">
          <MascotEarth size="lg" emotion="happy" />
          <div className="mt-2 text-xs font-bold text-slate-500 bg-[#FFF9F0] px-3 py-1 rounded-full border border-[#EADBCC] flex items-center gap-1.5 shadow-2xs">
            <span>{levelInfo.characterBadge}</span>
            <span>지구 탐험대장 에코</span>
          </div>
        </div>

        {/* Welcome Text & Player Level Deck */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-[#B8E6D1]/60 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>초등 5학년 맞춤 지구과학 영단어</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            오늘도 지구 탐험을 시작해 볼까?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mb-5 leading-relaxed">
            푸른 바다부터 높은 우주까지! 재미있는 퀴즈를 풀며 중학교 수준의 필수 지구과학 단어를 마스터해 보세요.
          </p>

          {/* Level & XP Progress Bar */}
          <div className="bg-[#FFF9F0] border border-[#EADCC8] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{levelInfo.characterBadge}</span>
                <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                  Lv.{levelInfo.level} {levelInfo.title}
                </span>
              </div>
              <div className="text-xs font-extrabold text-amber-900 bg-[#FFE7A0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                <span>{progress.xp} XP</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#E8DDD0] h-3.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#B8E6D1] via-[#FFE7A0] to-[#FFC8B8] h-full rounded-full transition-all duration-500 shadow-2xs"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5 font-medium">
              <span>현재 레벨 달성률 {levelInfo.progressPercent}%</span>
              <span>다음 레벨까지 {levelInfo.xpRemaining} XP 남음</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip (Clean, unboxed metadata and indicators) */}
      <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-4 text-center shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>누적 학습 단어</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums">
            {progress.totalWordsLearned}
            <span className="text-xs text-slate-500 font-medium ml-1">개</span>
          </div>
        </div>

        <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-4 text-center shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>정답률</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums">
            {overallAccuracy}
            <span className="text-xs text-slate-500 font-medium ml-1">%</span>
          </div>
        </div>

        <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-4 text-center shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>연속 탐험</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums">
            {progress.streakDays}
            <span className="text-xs text-slate-500 font-medium ml-1">일째</span>
          </div>
        </div>
      </div>

      {/* Daily Quests & Goals Section */}
      <DailyQuestsCard
        progress={progress}
        onClaimQuest={onClaimQuest}
        onClaimAllClear={onClaimAllClear}
        onUpdateTarget={onUpdateTarget}
        onNavigateToExplore={onStartExploration}
      />

      {/* Primary Action Buttons */}
      <div className="w-full flex flex-col gap-3.5">
        {/* Big Chunky Start Exploration CTA */}
        <button
          onClick={onStartExploration}
          className="w-full group py-5 px-8 bg-gradient-to-r from-[#B8E6D1] to-[#A3E5FF] hover:from-[#A8DEC6] hover:to-[#90DAF8] text-slate-900 border-2 border-emerald-400/40 rounded-3xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
        >
          <div className="w-10 h-10 bg-white/70 rounded-2xl flex items-center justify-center text-emerald-800 group-hover:scale-110 transition-transform">
            <Rocket className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              탐험 시작!
            </div>
            <div className="text-xs sm:text-sm text-slate-700 font-medium">
              난이도를 선택하고 신나는 우주 단어 퀴즈를 풀어봐요
            </div>
          </div>
        </button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            onClick={onStartWrongReview}
            disabled={wrongCount === 0}
            className={`py-4 px-6 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
              wrongCount > 0
                ? 'bg-white hover:bg-[#FAF4EC] border-[#DCD0F5] text-slate-800 shadow-2xs hover:shadow-sm'
                : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-75'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#DCD0F5]/50 rounded-xl flex items-center justify-center text-purple-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm sm:text-base text-slate-800">
                  틀린 단어 다시 도전
                </div>
                <div className="text-xs text-slate-500">
                  {wrongCount > 0 ? `${wrongCount}개의 단어 복습 대기 중` : '틀린 단어가 없어요!'}
                </div>
              </div>
            </div>
            {wrongCount > 0 && (
              <span className="bg-red-400 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-2xs">
                {wrongCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('GROWTH_STATS')}
            className="py-4 px-6 bg-white hover:bg-[#FAF4EC] border-2 border-[#FFE7A0] text-slate-800 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#FFE7A0]/60 rounded-xl flex items-center justify-center text-amber-800">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm sm:text-base text-slate-800">
                  나의 성장 기록
                </div>
                <div className="text-xs text-slate-500">
                  레벨, 획득 배지, 7일 통계 확인하기
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-[#FFE7A0]/70 px-2 py-0.5 rounded-lg">
              {progress.unlockedBadges.length}개 배지
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
