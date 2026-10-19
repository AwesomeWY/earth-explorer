/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Difficulty } from '../types';
import { Sparkles, ArrowLeft, Zap, ShieldAlert, Award } from 'lucide-react';

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

export const DifficultySelect: React.FC<DifficultySelectProps> = ({ onSelect, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Top back button & title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-[#EADBCC] text-slate-700 hover:bg-[#FAF4EC] transition-colors cursor-pointer"
          title="뒤로 가기"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            탐험 난이도 선택
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            도전하고 싶은 수준을 골라보세요. 각 라운드는 10문제로 진행됩니다!
          </p>
        </div>
      </div>

      {/* 3 Difficulty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Easy Card */}
        <div className="bg-white border-2 border-[#B8E6D1] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#B8E6D1]/30 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🌱</span>
              <span className="text-xs font-black bg-[#B8E6D1] text-emerald-950 px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-800" />
                <span>+10 XP</span>
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-800 mb-1">
              쉬움 (Easy)
            </h3>
            <p className="text-xs text-emerald-700 font-bold mb-3">
              기초 지구과학 단어
            </p>

            <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>영어 단어와 한글 뜻을 맞히는 4지선다형</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>힌트 사용 가능 (힌트 시 5 XP)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>예시: Earth, Sun, Moon, Star, Ocean...</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelect('easy')}
            className="w-full py-3 px-4 bg-[#B8E6D1] hover:bg-[#A6DEBF] text-emerald-950 font-extrabold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer group-hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>쉬움 시작하기</span>
            <Sparkles className="w-4 h-4 text-emerald-800" />
          </button>
        </div>

        {/* Normal Card */}
        <div className="bg-white border-2 border-[#DCD0F5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#DCD0F5]/30 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🪐</span>
              <span className="text-xs font-black bg-[#DCD0F5] text-purple-950 px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-800" />
                <span>+20 XP</span>
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-800 mb-1">
              보통 (Normal)
            </h3>
            <p className="text-xs text-purple-700 font-bold mb-3">
              중학교 기초 지구과학
            </p>

            <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>영어 단어의 의미를 고르는 4지선다형</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>실제 지구과학 영어 예문 제공</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span>
                <span>예시: Gravity, Orbit, Climate, Volcano...</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelect('normal')}
            className="w-full py-3 px-4 bg-[#DCD0F5] hover:bg-[#CEBEEF] text-purple-950 font-extrabold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer group-hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>보통 시작하기</span>
            <Sparkles className="w-4 h-4 text-purple-800" />
          </button>
        </div>

        {/* Hard Card */}
        <div className="bg-white border-2 border-[#FFC8B8] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC8B8]/30 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🚀</span>
              <span className="text-xs font-black bg-[#FFC8B8] text-rose-950 px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-rose-800" />
                <span>+30 XP</span>
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-800 mb-1">
              어려움 (Hard)
            </h3>
            <p className="text-xs text-rose-700 font-bold mb-3">
              중학교 심화 지구과학
            </p>

            <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>한글 뜻과 설명을 보고 영어 단어 직접 타이핑!</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>대소문자 차이는 오답 처리하지 않음</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>예시: Erosion, Sediment, Tectonic plate...</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelect('hard')}
            className="w-full py-3 px-4 bg-[#FFC8B8] hover:bg-[#F8B5A2] text-rose-950 font-extrabold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer group-hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>어려움 시작하기</span>
            <ShieldAlert className="w-4 h-4 text-rose-800" />
          </button>
        </div>
      </div>
    </div>
  );
};
