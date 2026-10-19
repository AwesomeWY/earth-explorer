/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoundQuestionResult, ScreenState } from '../types';
import { MascotEarth } from './MascotEarth';
import { Trophy, Star, RotateCcw, Home, BookOpen, Volume2, Lightbulb, Check, X } from 'lucide-react';
import { speakEnglishWord } from '../utils/speech';

interface GameSummaryProps {
  results: RoundQuestionResult[];
  earnedXp: number;
  difficulty: string;
  onNavigate: (screen: ScreenState) => void;
  onPlayAgain: () => void;
  onReviewMistakes: () => void;
  onListen: () => void;
}

export const GameSummary: React.FC<GameSummaryProps> = ({
  results,
  earnedXp,
  difficulty,
  onNavigate,
  onPlayAgain,
  onReviewMistakes,
  onListen,
}) => {
  const totalCount = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const wrongCount = totalCount - correctCount;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const hintCount = results.filter((r) => r.usedHint).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Celebration Header Card */}
      <div className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-6 sm:p-8 shadow-sm text-center mb-6 relative overflow-hidden">
        <div className="flex flex-col items-center">
          <MascotEarth size="md" emotion={accuracy >= 80 ? 'cheering' : 'happy'} isDancing />

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3 mb-1">
            {accuracy >= 80
              ? '우주 탐험 완수! 대단해요!'
              : accuracy >= 50
              ? '멋진 도전이었어요!'
              : '수고했어요! 복습하면 더 잘할 수 있어요!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mb-6">
            이번 탐험에서 <strong>{totalCount}개</strong>의 지구과학 영어 단어를 학습했어요.
          </p>

          {/* KPI Strip */}
          <div className="w-full grid grid-cols-3 gap-3 mb-2">
            <div className="bg-[#FFF9F0] border border-[#EADCC8] rounded-2xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>획득 경험치</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-900">
                +{earnedXp} <span className="text-xs font-bold text-amber-700">XP</span>
              </div>
            </div>

            <div className="bg-[#FFF9F0] border border-[#EADCC8] rounded-2xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>정답률</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-800">
                {accuracy}%
              </div>
            </div>

            <div className="bg-[#FFF9F0] border border-[#EADCC8] rounded-2xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                <span>복습할 단어</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-700">
                {wrongCount}개
              </div>
            </div>
          </div>

          {hintCount > 0 && (
            <div className="mt-2 text-xs text-amber-800 bg-[#FFFCE8] border border-[#EADAA0] rounded-xl px-3 py-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>힌트를 사용한 문제 {hintCount}개는 한 번 더 복습하면 완전히 내 것이 돼요!</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <button
          onClick={onPlayAgain}
          className="py-3.5 px-4 bg-[#B8E6D1] hover:bg-[#A8DEBF] text-emerald-950 font-extrabold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>한 번 더 도전!</span>
        </button>

        {wrongCount > 0 ? (
          <button
            onClick={onReviewMistakes}
            className="py-3.5 px-4 bg-[#DCD0F5] hover:bg-[#CEBEEF] text-purple-950 font-extrabold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>오답 단어 즉시 복습 ({wrongCount}개)</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('GROWTH_STATS')}
            className="py-3.5 px-4 bg-[#FFE7A0] hover:bg-[#F8DC8D] text-amber-950 font-extrabold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>성장 기록 확인</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('MENU')}
          className="py-3.5 px-4 bg-white hover:bg-[#FAF4EC] border border-[#EADBCC] text-slate-700 font-extrabold text-sm rounded-2xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>메인 화면으로</span>
        </button>
      </div>

      {/* Word-by-Word Review Breakdown */}
      <div className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center justify-between">
          <span>이번 라운드 단어 결과</span>
          <span className="text-xs text-slate-500 font-normal">
            단어를 클릭하여 발음을 다시 들어보세요
          </span>
        </h3>

        <div className="space-y-3">
          {results.map((r, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                r.isCorrect
                  ? 'bg-[#F9FCFA] border-emerald-200'
                  : 'bg-[#FFF9F9] border-red-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    r.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {r.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        speakEnglishWord(r.word.word);
                        onListen();
                      }}
                      className="font-extrabold text-slate-800 hover:text-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span>{r.word.word}</span>
                      <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                    </button>
                    <span className="text-xs text-slate-400 font-mono">
                      {r.word.phonetic}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {r.word.koreanMeaning} · <span className="text-slate-400">{r.word.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                {r.usedHint && (
                  <span className="bg-[#FFE7A0]/70 text-amber-900 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-amber-700" />
                    힌트 사용
                  </span>
                )}
                <span
                  className={`font-extrabold px-2 py-0.5 rounded-md ${
                    r.isCorrect
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  +{r.earnedXp} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
