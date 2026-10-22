import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sliders, HelpCircle, BookOpen } from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';
import MathView, { FormulaCard } from '../MathView';

export default function TopicExplanationView() {
  const {
    selectedId, setSelectedId,
    langMode,
    quizChoices, setQuizChoice,
    setMainView
  } = useLabStore();

  const activeTopic = useMemo(
    () => TOPICS.find((t) => t.id === selectedId) || TOPICS[0],
    [selectedId]
  );

  const activeIdx = TOPICS.findIndex((t) => t.id === activeTopic.id);
  const eli5 = ELI5_TOPIC_DATA[activeTopic.num] || ELI5_TOPIC_DATA['0'];
  const countWords = (str) => (str ? str.trim().split(/\s+/).length : 0);

  const openLabForTopic = (id) => {
    setSelectedId(id);
    setMainView('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-6 flex-1">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => setMainView('index_table')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
        >
          <ChevronLeft className="w-4 h-4" /> {langMode === 'bn' ? 'মাস্টার ইনডেক্সে ফিরুন' : 'Back to Master Index'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {langMode === 'bn' ? `টপিক #${activeTopic.num} পূর্ণ ব্যাখ্যা` : `Topic #${activeTopic.num} Full Notes`}
          </span>
          <button
            onClick={() => openLabForTopic(activeTopic.id)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Sliders className="w-4 h-4" /> {langMode === 'bn' ? `পাঠ #${activeTopic.num} ল্যাব শুরু করুন →` : `Open #${activeTopic.num} Lab Simulator →`}
          </button>
        </div>
      </div>

      {/* Main Explanation Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              {activeTopic.badge}
            </span>
            {activeTopic.wordTarget && (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                {langMode === 'bn' ? `পরীক্ষার জন্য নির্ধারিত ${activeTopic.wordTarget} শব্দের বিবৃতি` : `Exact ${activeTopic.wordTarget} Words Exam Statement`}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">
            {langMode === 'bn' ? activeTopic.titleBn : activeTopic.titleEn}
          </h2>
          {langMode === 'dual' && (
            <h3 className="text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{activeTopic.titleBn}</h3>
          )}
        </div>

        {/* Governing Mathematical Law & Interactive Concept */}
        <div className="space-y-4">
          <FormulaCard
            formula={activeTopic.formula}
            title={langMode === 'bn' ? 'মূল গাণিতিক সূত্র' : 'Governing Mathematical Law'}
            badge={`Topic #${activeTopic.num}`}
            langMode={langMode}
            verbalEn={eli5.verbalReadEn}
            verbalBn={eli5.verbalReadBn}
            compact={true}
          />

          {/* Intuitive Concept & Working Principle Card */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <h4 className="font-black text-base md:text-lg text-amber-950 dark:text-amber-200">
                {langMode === 'bn' ? 'সহজ বাস্তব উপমা ও কাজের মূল নীতি:' : 'Intuitive Concept & Everyday Analogy:'}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
              {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
            </p>
            {langMode === 'dual' && (
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium border-t border-amber-200 dark:border-amber-800/60 pt-2.5 whitespace-pre-line">
                {eli5.storyBn}
              </p>
            )}
          </div>

          {/* Everyday Variable Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {langMode === 'bn' ? 'সূত্রের প্রতিটি চিহ্নের বাস্তব অর্থ:' : 'Everyday Practical Meaning of Each Symbol:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {eli5.variables.map((v, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                    <MathView math={v.latex || v.sym} />
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                    {langMode === 'bn' ? v.nameBn : v.nameEn}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {langMode === 'bn' ? v.descBn : v.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bilingual Technical Exam Notes Grid */}
        <div className={`grid grid-cols-1 ${langMode === 'dual' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-5`}>
          {(langMode === 'dual' || langMode === 'en') && (
            <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  {langMode === 'bn' ? 'ইংরেজি পরীক্ষার সারাংশ (সংক্ষিপ্ত)' : 'English Explanation (Rich & Exam-Concise)'}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {countWords(activeTopic.enSummary)} words
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                {activeTopic.enSummary}
              </p>
            </div>
          )}

          {(langMode === 'dual' || langMode === 'bn') && (
            <div className="bg-slate-50/70 dark:bg-slate-800/50 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  সহজ বাংলায় ব্যাখ্যা (Easy Bangla Explanation)
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">সহজ বিশ্লেষণ</span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                {activeTopic.bnSummary}
              </p>
            </div>
          )}
        </div>

        {/* Key Takeaways & Exam Points */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
            {langMode === 'bn' ? 'পরীক্ষা ও ভাইভার জন্য গুরুত্বপূর্ণ পয়েন্টসমূহ:' : 'Key Exam & Viva Takeaways:'}
          </h4>
          <ul className="space-y-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300">
            {activeTopic.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concept Check Quiz */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> {langMode === 'bn' ? 'নিজের ধারণা যাচাই করুন (কুইজ প্রশ্ন):' : 'Self-Assessment Question:'}
          </div>
          <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">{activeTopic.quiz.q}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeTopic.quiz.options.map((opt, idx) => {
              const picked = quizChoices[activeTopic.id];
              const isPicked = picked === idx;
              const isRight = idx === activeTopic.quiz.ans;
              return (
                <button
                  key={idx}
                  onClick={() => setQuizChoice(activeTopic.id, idx, isRight)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border transition ${
                    picked === undefined
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-800'
                      : isRight
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 font-bold'
                      : isPicked
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            disabled={activeIdx <= 0}
            onClick={() => activeIdx > 0 && setSelectedId(TOPICS[activeIdx - 1].id)}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
          >
            <ChevronLeft className="w-4 h-4" /> {langMode === 'bn' ? 'পূর্ববর্তী পাঠ' : 'Previous Topic'} ({activeIdx > 0 ? TOPICS[activeIdx - 1].num : ''})
          </button>

          <button
            onClick={() => openLabForTopic(activeTopic.id)}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Sliders className="w-4 h-4" /> {langMode === 'bn' ? `পাঠ #${activeTopic.num} সিমুলেটর ল্যাব শুরু করুন` : `Launch Topic #${activeTopic.num} Lab Simulator`}
          </button>

          <button
            disabled={activeIdx >= TOPICS.length - 1}
            onClick={() => activeIdx < TOPICS.length - 1 && setSelectedId(TOPICS[activeIdx + 1].id)}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
          >
            {langMode === 'bn' ? 'পরবর্তী পাঠ' : 'Next Topic'} ({activeIdx < TOPICS.length - 1 ? TOPICS[activeIdx + 1].num : ''}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
