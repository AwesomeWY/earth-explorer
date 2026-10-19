/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UserProgress, ScreenState } from '../types';
import { getLevelInfo, ALL_BADGES } from '../utils/levels';
import { exportProgressAsJson, importProgressFromJson } from '../utils/storage';
import {
  Trophy,
  Star,
  Award,
  ArrowLeft,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface GrowthStatsProps {
  progress: UserProgress;
  onNavigate: (screen: ScreenState) => void;
  onResetData: () => void;
  onProgressUpdated: (newProgress: UserProgress) => void;
}

export const GrowthStats: React.FC<GrowthStatsProps> = ({
  progress,
  onNavigate,
  onResetData,
  onProgressUpdated,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const levelInfo = getLevelInfo(progress.xp);

  const overallAccuracy =
    progress.totalAttempts > 0
      ? Math.round((progress.totalCorrectAttempts / progress.totalAttempts) * 100)
      : 0;

  const easyAccuracy =
    progress.difficultyStats.easy.total > 0
      ? Math.round(
          (progress.difficultyStats.easy.correct / progress.difficultyStats.easy.total) * 100
        )
      : 0;

  const normalAccuracy =
    progress.difficultyStats.normal.total > 0
      ? Math.round(
          (progress.difficultyStats.normal.correct / progress.difficultyStats.normal.total) * 100
        )
      : 0;

  const hardAccuracy =
    progress.difficultyStats.hard.total > 0
      ? Math.round(
          (progress.difficultyStats.hard.correct / progress.difficultyStats.hard.total) * 100
        )
      : 0;

  // Maximum word count in the 7 days for relative scaling in chart
  const maxDayWords = Math.max(
    10,
    ...progress.history7Days.map((d) => d.wordsCount || 0)
  );

  // Handle Export
  const handleExport = () => {
    const jsonStr = exportProgressAsJson(progress);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earth_explorer_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importProgressFromJson(content);
      if (imported) {
        onProgressUpdated(imported);
        setImportMessage('성공적으로 학습 기록을 불러왔어요! ✨');
        setTimeout(() => setImportMessage(null), 3000);
      } else {
        setImportMessage('올바른 백업 파일 형식이 아닙니다. 확인 후 다시 시도해 주세요.');
        setTimeout(() => setImportMessage(null), 3500);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onNavigate('MENU')}
          className="p-2 rounded-xl bg-white border border-[#EADBCC] text-slate-700 hover:bg-[#FAF4EC] transition-colors cursor-pointer"
          title="메인 화면으로"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            나의 성장 기록
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            지금까지 성실하게 탐험한 멋진 기록들을 확인해 보세요!
          </p>
        </div>
      </div>

      {importMessage && (
        <div className="mb-6 p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-pop-in">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{importMessage}</span>
        </div>
      )}

      {/* Main Stats Card */}
      <div className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E4D4]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFE7A0] to-[#FFC8B8] flex items-center justify-center text-3xl shadow-xs">
              {levelInfo.characterBadge}
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                현재 등급 & 칭호
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Lv.{levelInfo.level} {levelInfo.title}
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-500 font-bold">누적 획득 경험치</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 tabular-nums">
              {progress.xp} <span className="text-xs font-bold text-amber-700">XP</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="pt-5 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-2">
            <span>레벨 진행도</span>
            <span>다음 레벨까지 {levelInfo.xpRemaining} XP 필요 ({levelInfo.progressPercent}%)</span>
          </div>
          <div className="w-full bg-[#EFE7D8] h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#B8E6D1] via-[#FFE7A0] to-[#FFC8B8] h-full rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Overall KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-[#FAF6F0] rounded-2xl p-4 text-center border border-[#EADBCC]">
            <div className="text-xs text-slate-500 font-bold mb-1">총 학습 횟수</div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 tabular-nums">
              {progress.totalWordsLearned}
            </div>
          </div>

          <div className="bg-[#FAF6F0] rounded-2xl p-4 text-center border border-[#EADBCC]">
            <div className="text-xs text-slate-500 font-bold mb-1">전체 정답률</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800 tabular-nums">
              {overallAccuracy}%
            </div>
          </div>

          <div className="bg-[#FAF6F0] rounded-2xl p-4 text-center border border-[#EADBCC]">
            <div className="text-xs text-slate-500 font-bold mb-1">연속 출석</div>
            <div className="text-xl sm:text-2xl font-black text-orange-600 tabular-nums">
              {progress.streakDays}일
            </div>
          </div>

          <div className="bg-[#FAF6F0] rounded-2xl p-4 text-center border border-[#EADBCC]">
            <div className="text-xs text-slate-500 font-bold mb-1">퀘스트 완료</div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 tabular-nums">
              {progress.totalQuestsCompleted || 0}회
            </div>
          </div>

          <div className="bg-[#FAF6F0] rounded-2xl p-4 text-center border border-[#EADBCC] col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-500 font-bold mb-1">해금한 배지</div>
            <div className="text-xl sm:text-2xl font-black text-purple-800 tabular-nums">
              {progress.unlockedBadges.length} / {ALL_BADGES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty-specific Accuracy Rates */}
      <div className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">
          난이도별 정답률
        </h3>

        <div className="space-y-4">
          {/* Easy */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-extrabold">🌱 쉬움</span>
                <span className="text-xs text-slate-400">
                  ({progress.difficultyStats.easy.correct}/{progress.difficultyStats.easy.total} 문제)
                </span>
              </span>
              <span className="tabular-nums font-black text-emerald-700">{easyAccuracy}%</span>
            </div>
            <div className="w-full bg-[#EFE7D8] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#B8E6D1] h-full rounded-full transition-all duration-500"
                style={{ width: `${easyAccuracy}%` }}
              />
            </div>
          </div>

          {/* Normal */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="text-purple-600 font-extrabold">🪐 보통</span>
                <span className="text-xs text-slate-400">
                  ({progress.difficultyStats.normal.correct}/{progress.difficultyStats.normal.total} 문제)
                </span>
              </span>
              <span className="tabular-nums font-black text-purple-700">{normalAccuracy}%</span>
            </div>
            <div className="w-full bg-[#EFE7D8] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#DCD0F5] h-full rounded-full transition-all duration-500"
                style={{ width: `${normalAccuracy}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="text-rose-600 font-extrabold">🚀 어려움 (직접 입력)</span>
                <span className="text-xs text-slate-400">
                  ({progress.difficultyStats.hard.correct}/{progress.difficultyStats.hard.total} 문제)
                </span>
              </span>
              <span className="tabular-nums font-black text-rose-700">{hardAccuracy}%</span>
            </div>
            <div className="w-full bg-[#EFE7D8] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#FFC8B8] h-full rounded-full transition-all duration-500"
                style={{ width: `${hardAccuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Activity Chart */}
      <div className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span>최근 7일 학습 기록</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          매일 꾸준히 학습한 단어 수와 획득 경험치예요
        </p>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-4 border-b border-[#EADBCC] pb-3">
          {progress.history7Days.map((d, idx) => {
            const count = d.wordsCount || 0;
            const barHeight = Math.max(8, Math.min(100, Math.round((count / maxDayWords) * 100)));
            // short day label (MM/DD)
            const parts = d.date.split('-');
            const label = parts.length === 3 ? `${parts[1]}/${parts[2]}` : d.date;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                {/* Count tooltip on hover */}
                <div className="text-2xs font-extrabold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {count}개
                </div>

                <div
                  className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ${
                    count > 0
                      ? 'bg-gradient-to-t from-[#B8E6D1] to-[#FFE7A0] shadow-xs'
                      : 'bg-stone-100'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />

                <div className="text-2xs text-slate-500 font-bold mt-2 whitespace-nowrap">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-6 sm:p-8 shadow-sm mb-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>획득한 배지 모음</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          다양한 탐험 미션을 달성하여 배지를 모두 모아보세요!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {ALL_BADGES.map((b) => {
            const isUnlocked = progress.unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-[#FFFDF5] border-[#FFE7A0] shadow-2xs'
                    : 'bg-[#FAF6F0] border-[#EAE0D2] opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-[#FFE7A0]/70' : 'bg-stone-200 grayscale'
                  }`}
                >
                  {b.icon}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <span>{b.name}</span>
                    {isUnlocked && (
                      <span className="text-2xs font-extrabold text-amber-700 bg-[#FFE7A0] px-1.5 py-0.2 rounded-full">
                        획득
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management: Export / Import / Reset */}
      <div className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 mb-2">
          데이터 관리 및 백업
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          학습 기록은 기기의 브라우저에 안전하게 저장됩니다. 다른 기기로 옮기거나 보관하려면 백업 파일을 내보내세요.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="py-2.5 px-4 bg-[#FAF6F0] hover:bg-[#F3EDE2] border border-[#EADBCC] text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>기록 내보내기 (JSON)</span>
          </button>

          <label className="py-2.5 px-4 bg-[#FAF6F0] hover:bg-[#F3EDE2] border border-[#EADBCC] text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>기록 가져오기</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-600" />
            <span>데이터 초기화</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-red-200 rounded-3xl max-w-sm w-full p-6 text-center shadow-xl animate-pop-in">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-black text-slate-900 mb-2">
              정말로 모든 기록을 초기화할까요?
            </h4>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              지금까지 획득한 경험치, 레벨, 뱃지, 오답 노트의 모든 기록이 영구히 지워집니다.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetData();
                }}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                네, 초기화합니다
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
