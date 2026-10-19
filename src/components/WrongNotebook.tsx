/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { UserProgress, WrongWordEntry, ScreenState } from '../types';
import { speakEnglishWord } from '../utils/speech';
import {
  BookOpen,
  Volume2,
  CheckCircle,
  Play,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface WrongNotebookProps {
  progress: UserProgress;
  onNavigate: (screen: ScreenState) => void;
  onStartReviewGame: (words: WrongWordEntry[]) => void;
  onRemoveWord: (wordId: string) => void;
  onListen: () => void;
}

export const WrongNotebook: React.FC<WrongNotebookProps> = ({
  progress,
  onNavigate,
  onStartReviewGame,
  onRemoveWord,
  onListen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'normal' | 'hard'>('all');

  const wrongList = useMemo(() => {
    return Object.values(progress.wrongWords);
  }, [progress.wrongWords]);

  const filteredList = useMemo(() => {
    return wrongList.filter((item) => {
      const matchDiff = difficultyFilter === 'all' || item.difficulty === difficultyFilter;
      const matchQuery =
        !searchQuery.trim() ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.koreanMeaning.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiff && matchQuery;
    });
  }, [wrongList, difficultyFilter, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('MENU')}
            className="p-2 rounded-xl bg-white border border-[#EADBCC] text-slate-700 hover:bg-[#FAF4EC] transition-colors cursor-pointer"
            title="메인 화면으로"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>오답 노트</span>
              <span className="text-xs font-black bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">
                {wrongList.length}개 보관 중
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              틀렸던 단어를 꼼꼼하게 복습하고 완벽하게 내 것으로 만들어 보세요!
            </p>
          </div>
        </div>

        {wrongList.length > 0 && (
          <button
            onClick={() => onStartReviewGame(filteredList.length > 0 ? filteredList : wrongList)}
            className="py-3 px-5 bg-gradient-to-r from-[#DCD0F5] to-[#B8E6D1] hover:from-[#CEBEEF] hover:to-[#A7DEC0] text-purple-950 font-extrabold text-sm rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 group self-start sm:self-auto"
          >
            <Play className="w-4 h-4 fill-purple-900 text-purple-900 group-hover:scale-110 transition-transform" />
            <span>오답 단어로 퀴즈 풀기 ({filteredList.length}개)</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-4 mb-6 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="단어 또는 뜻으로 검색..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-[#FAF6F0] border border-[#EAE0D2] focus:outline-hidden focus:border-purple-300"
          />
        </div>

        <div className="flex items-center gap-1 self-stretch sm:self-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
          {(['all', 'easy', 'normal', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                difficultyFilter === diff
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-[#FAF6F0] text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff === 'all' ? '전체' : diff === 'easy' ? '쉬움' : diff === 'normal' ? '보통' : '어려움'}
            </button>
          ))}
        </div>
      </div>

      {/* List of Wrong Words */}
      {wrongList.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#EADBCC] rounded-3xl p-10 text-center">
          <div className="w-16 h-16 bg-[#B8E6D1]/40 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🎉
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-1">
            현재 오답 노트가 비어있어요!
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            모든 문제를 잘 풀었거나 이미 모든 단어를 마스터하셨어요. 대단해요!
          </p>
          <button
            onClick={() => onNavigate('DIFFICULTY_SELECT')}
            className="py-3 px-6 bg-[#B8E6D1] hover:bg-[#A8DEC0] text-emerald-950 font-extrabold text-sm rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            새로운 탐험 시작하기
          </button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-8 text-center text-slate-500 text-sm">
          검색 조건에 맞는 오답 단어가 없어요.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => (
            <div
              key={item.wordId}
              className="bg-white border-2 border-[#F0E4D4] rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      speakEnglishWord(item.word);
                      onListen();
                    }}
                    className="w-10 h-10 rounded-2xl bg-[#DCD0F5]/50 hover:bg-[#DCD0F5] text-purple-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5"
                    title="발음 듣기"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {item.word}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono font-medium">
                        {item.phonetic}
                      </span>
                      <span
                        className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${
                          item.difficulty === 'easy'
                            ? 'bg-[#B8E6D1] text-emerald-950'
                            : item.difficulty === 'normal'
                            ? 'bg-[#DCD0F5] text-purple-950'
                            : 'bg-[#FFC8B8] text-rose-950'
                        }`}
                      >
                        {item.difficulty === 'easy' ? '쉬움' : item.difficulty === 'normal' ? '보통' : '어려움'}
                      </span>
                    </div>

                    <div className="text-base font-extrabold text-slate-800 mt-1">
                      {item.koreanMeaning}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                  <span className="bg-red-50 text-red-700 border border-red-200 font-extrabold px-2.5 py-1 rounded-xl">
                    틀린 횟수: {item.mistakeCount}회
                  </span>
                  <button
                    onClick={() => onRemoveWord(item.wordId)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="마스터 완료 (오답 노트에서 제거)"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Example sentences */}
              <div className="bg-[#FAF6F0] rounded-2xl p-3.5 text-xs sm:text-sm text-slate-700 mb-3 space-y-1 border border-[#EADBCC]">
                <div className="font-semibold text-slate-800">
                  &ldquo;{item.exampleEn}&rdquo;
                </div>
                <div className="text-slate-500">
                  {item.exampleKo}
                </div>
              </div>

              {/* Science explanation */}
              <div className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{item.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
