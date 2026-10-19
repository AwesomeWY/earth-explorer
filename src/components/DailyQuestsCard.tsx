/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DailyQuest, UserProgress } from '../types';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  Gift,
  Target,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DailyQuestsCardProps {
  progress: UserProgress;
  onClaimQuest: (questId: string) => void;
  onClaimAllClear: () => void;
  onUpdateTarget: (newTarget: number) => void;
  onNavigateToExplore: () => void;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  progress,
  onClaimQuest,
  onClaimAllClear,
  onUpdateTarget,
  onNavigateToExplore,
}) => {
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const daily = progress.dailyQuests;

  if (!daily) return null;

  const quests = daily.quests;
  const completedCount = quests.filter((q) => q.isCompleted).length;
  const claimedCount = quests.filter((q) => q.isClaimed).length;
  const totalCount = quests.length;
  const allQuestsClaimed = quests.every((q) => q.isClaimed);

  // Format today's date in Korean friendly style
  const dateObj = new Date();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[dateObj.getDay()];
  const dateString = `${month}월 ${date}일 (${dayName}요일)`;

  const targetOptions = [
    { count: 10, label: '10개 (가벼운 탐험)', tag: '기본' },
    { count: 15, label: '15개 (추천 목표)', tag: '추천' },
    { count: 20, label: '20개 (열정 탐험가)', tag: '도전' },
    { count: 30, label: '30개 (우주 마스터)', tag: '열정' },
  ];

  return (
    <div className="w-full bg-white/90 border-2 border-[#FFE7A0] rounded-3xl p-5 sm:p-7 shadow-sm mb-8 backdrop-blur-xs relative overflow-hidden">
      {/* Background soft pastel ambient glows */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#FFE7A0]/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#B8E6D1]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar: Title & Date & Target Setting Toggle */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4E9D8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌟</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              오늘의 학습 목표 & 일일 퀘스트
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {dateString} · 매일 자정에 새로운 퀘스트가 열려요!
          </p>
        </div>

        {/* Goal selector button */}
        <button
          onClick={() => setShowGoalPicker(!showGoalPicker)}
          className="flex items-center gap-2 self-start sm:self-auto py-2 px-3.5 bg-[#FAF6F0] hover:bg-[#F3EDE2] border border-[#EADBCC] rounded-2xl text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
          title="오늘의 단어 목표 변경"
        >
          <Target className="w-3.5 h-3.5 text-amber-600" />
          <span>오늘의 목표: <strong className="text-amber-800 font-extrabold">{daily.customWordTarget}개</strong></span>
          <SlidersHorizontal className="w-3 h-3 text-slate-400 ml-0.5" />
          {showGoalPicker ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Target Selector Dropdown / Panel */}
      {showGoalPicker && (
        <div className="relative z-10 my-4 p-4 bg-[#FFFDF5] border border-[#FFE7A0] rounded-2xl animate-pop-in shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-xs font-extrabold text-amber-900">
              오늘 맞히고 싶은 단어 목표를 선택해 보세요:
            </div>
            <span className="text-2xs text-slate-400">언제든 변경 가능</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {targetOptions.map((opt) => (
              <button
                key={opt.count}
                onClick={() => {
                  onUpdateTarget(opt.count);
                  setShowGoalPicker(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer border ${
                  daily.customWordTarget === opt.count
                    ? 'bg-[#FFE7A0] border-amber-400 text-amber-950 font-black shadow-xs'
                    : 'bg-white border-[#EADBCC] text-slate-700 hover:bg-[#FBF7EE]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-0.5">
                  <span className="text-sm font-black">{opt.count}개</span>
                  <span className="text-2xs font-extrabold text-amber-800 bg-white/70 px-1.5 py-0.2 rounded-md">
                    {opt.tag}
                  </span>
                </div>
                <span className="text-2xs text-slate-500 font-medium truncate">
                  {opt.label.split(' ')[1]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overall Progress Metric Bar */}
      <div className="relative z-10 pt-4 pb-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>퀘스트 달성 현황</span>
          </span>
          <span className="tabular-nums">
            <strong className="text-emerald-700">{claimedCount}</strong> / {totalCount} 완료
          </span>
        </div>
        <div className="w-full bg-[#EFE7D8] h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-[#B8E6D1] to-[#FFE7A0] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.round((claimedCount / totalCount) * 100)}%` }}
          />
        </div>
      </div>

      {/* Quest Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
        {quests.map((quest) => {
          const percent = Math.min(100, Math.round((quest.current / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                quest.isClaimed
                  ? 'bg-[#F9FCFA] border-emerald-200'
                  : quest.isCompleted
                  ? 'bg-[#FFFDF5] border-amber-300 shadow-xs ring-2 ring-amber-200/60'
                  : 'bg-white border-[#EADBCC]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF6F0] border border-[#EADBCC] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    {quest.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                      {quest.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-amber-900 bg-[#FFE7A0]/70 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    +{quest.rewardXp} XP
                  </span>
                </div>
              </div>

              {/* Progress Bar & Action */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-2xs font-bold text-slate-500 mb-1">
                    <span>진행도</span>
                    <span className="tabular-nums">
                      {quest.current} / {quest.target}
                    </span>
                  </div>
                  <div className="w-full bg-[#EFE7D8] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        quest.isCompleted ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="shrink-0">
                  {quest.isClaimed ? (
                    <div className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>완료됨</span>
                    </div>
                  ) : quest.isCompleted ? (
                    <button
                      onClick={() => onClaimQuest(quest.id)}
                      className="py-1.5 px-3 bg-gradient-to-r from-[#FFE7A0] to-[#FFC8B8] hover:from-[#FADF91] hover:to-[#F8B7A4] text-slate-900 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer transform hover:scale-103 active:scale-98 flex items-center gap-1 animate-pulse-subtle"
                    >
                      <Gift className="w-3.5 h-3.5 text-amber-800" />
                      <span>보상 받기!</span>
                    </button>
                  ) : (
                    <button
                      onClick={onNavigateToExplore}
                      className="text-xs text-slate-400 hover:text-slate-700 py-1.5 px-2 rounded-lg font-medium cursor-pointer"
                    >
                      탐험하기 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All-Clear Bonus Box Area */}
      <div className="relative z-10 mt-4 pt-3 border-t border-[#F4E9D8]">
        {daily.allClearClaimed ? (
          <div className="bg-[#F0FAF5] border border-emerald-200 rounded-2xl p-3.5 text-center flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-emerald-900">
            <span>🎉 오늘의 모든 일일 퀘스트를 올클리어했어요! 내일도 함께 탐험해요!</span>
          </div>
        ) : allQuestsClaimed ? (
          <div className="bg-gradient-to-r from-[#FFF4DB] via-[#FFE7A0] to-[#FFD5C8] border-2 border-amber-400 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-pop-in">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0 animate-bounce-cute">
                🎁
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900">
                  모든 퀘스트 완료! 별빛 선물 상자가 도착했어요!
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  일일 퀘스트를 모두 완수한 대장님을 위한 특별 보너스입니다.
                </p>
              </div>
            </div>

            <button
              onClick={onClaimAllClear}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer transform hover:scale-105 active:scale-98 whitespace-nowrap flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>올클리어 보너스 (+{daily.allClearRewardXp} XP) 받기</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span className="flex items-center gap-1.5">
              <span>🎁</span>
              <span>모든 퀘스트를 완료하면 <strong>올클리어 보너스 +{daily.allClearRewardXp} XP</strong>를 추가로 받을 수 있어요!</span>
            </span>
            <span className="text-slate-400">
              남은 퀘스트: {totalCount - claimedCount}개
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
