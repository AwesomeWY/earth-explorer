/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getLevelInfo } from '../utils/levels';
import { Sparkles, Trophy } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  newXp: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, newXp, onClose }) => {
  const info = getLevelInfo(newXp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-pop-in">
      <div className="bg-[#FFF9F0] border-4 border-[#FFE7A0] rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative corner stars */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#FFE7A0]/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#DCD0F5]/40 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#FFE7A0] to-[#FFC8B8] rounded-full flex items-center justify-center text-4xl shadow-md mb-3 animate-bounce-cute">
            <span>{info.characterBadge}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-xs uppercase tracking-widest bg-[#FFE7A0] px-3.5 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LEVEL UP!</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
            레벨 {info.level} 달성!
          </h3>

          <p className="text-lg font-bold text-emerald-700 mb-4">
            칭호: &ldquo;{info.title}&rdquo;
          </p>

          <div className="w-full bg-white border border-[#E8DCB8] rounded-2xl p-4 mb-6 shadow-xs text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1.5">
              <span>현재 누적 경험치: <strong className="text-slate-800">{newXp} XP</strong></span>
              <span>다음 레벨까지: <strong className="text-amber-700">{info.xpRemaining} XP</strong></span>
            </div>
            <div className="w-full bg-[#EFE7D8] h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#B8E6D1] to-[#FFE7A0] h-full rounded-full transition-all duration-700"
                style={{ width: `${info.progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#B8E6D1] to-[#A2E3FA] hover:from-[#A8DEC6] hover:to-[#91D8F3] text-emerald-950 font-extrabold text-base rounded-2xl shadow-md transition-all cursor-pointer transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5 text-emerald-800" />
            <span>신나게 계속 탐험하기!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
