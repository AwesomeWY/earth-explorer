/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScreenState } from '../types';
import { Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  wrongWordCount: number;
  unclaimedQuestsCount?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  wrongWordCount,
  unclaimedQuestsCount = 0,
  soundEnabled,
  onToggleSound,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0]/90 backdrop-blur-md border-b border-[#F0E4D4] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => onNavigate('MENU')}
          className="text-left group flex items-center gap-2 cursor-pointer focus:outline-hidden"
          title="메인 화면으로 이동"
        >
          <span className="text-2xl" role="img" aria-label="Earth">
            🌍
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap group-hover:text-emerald-700 transition-colors">
            우주 단어 탐험대
          </span>
        </button>

        {/* Zone 2: Nav Links (clean, single-line labels) */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-semibold">
          <button
            onClick={() => onNavigate('MENU')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentScreen === 'MENU' || currentScreen === 'DIFFICULTY_SELECT' || currentScreen === 'PLAYING'
                ? 'bg-[#B8E6D1] text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#F3EADF]'
            }`}
          >
            <span>탐험하기</span>
            {unclaimedQuestsCount > 0 && (
              <span className="text-xs bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-full animate-bounce-cute">
                🎁 {unclaimedQuestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('WRONG_NOTEBOOK')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentScreen === 'WRONG_NOTEBOOK'
                ? 'bg-[#DCD0F5] text-purple-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#F3EADF]'
            }`}
          >
            <span>오답노트</span>
            {wrongWordCount > 0 && (
              <span className="text-xs bg-red-400 text-white font-bold px-1.5 py-0.2 rounded-full">
                {wrongWordCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('GROWTH_STATS')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              currentScreen === 'GROWTH_STATS'
                ? 'bg-[#FFE7A0] text-amber-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#F3EADF]'
            }`}
          >
            성장기록
          </button>
        </nav>

        {/* Zone 3: Primary Action / Settings (Sound & Reduced-motion controls) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white border-[#E2D5C4] text-slate-700 hover:bg-[#FAF4EC]'
                : 'bg-stone-200/60 border-stone-300 text-stone-400 hover:bg-stone-200'
            }`}
            title={soundEnabled ? '효과음 켜짐 (클릭하여 끄기)' : '효과음 꺼짐 (클릭하여 켜기)'}
            aria-label="효과음 켜기/끄기"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleReducedMotion}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              reducedMotion
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-[#E2D5C4] text-slate-700 hover:bg-[#FAF4EC]'
            }`}
            title={reducedMotion ? '동작 줄이기 켜짐' : '동작 줄이기 꺼짐 (애니메이션 켜짐)'}
            aria-label="애니메이션 동작 줄이기"
          >
            {reducedMotion ? <Eye className="w-4 h-4 text-amber-700" /> : <Sparkles className="w-4 h-4 text-purple-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
