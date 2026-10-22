import React, { useMemo } from 'react';
import {
  BookOpen, Sliders, Info, Search, LayoutGrid, Table,
  CheckCircle2, Circle, Sparkles, Award, ArrowRight
} from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';
import MathView from '../MathView';

export default function MasterIndexView() {
  const {
    langMode,
    completed,
    toggleComplete,
    searchQuery, setSearchQuery,
    moduleFilter, setModuleFilter,
    indexLayout, setIndexLayout,
    setSelectedId,
    setMainView
  } = useLabStore();

  const filteredTopics = useMemo(() => {
    return TOPICS.filter((t) => {
      const matchesMod = moduleFilter === 'all' || t.module === moduleFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.titleEn.toLowerCase().includes(q) ||
        t.titleBn.toLowerCase().includes(q) ||
        t.num.toLowerCase().includes(q) ||
        t.enSummary.toLowerCase().includes(q);
      return matchesMod && matchesSearch;
    });
  }, [searchQuery, moduleFilter]);

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / TOPICS.length) * 100);

  const openLabForTopic = (id) => {
    setSelectedId(id);
    setMainView('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openExplanationForTopic = (id) => {
    setSelectedId(id);
    setMainView('explanation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 flex-1">
      {/* Hero Curriculum Dashboard Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {langMode === 'bn' ? 'সিলেবাস ও ল্যাব নির্দেশিকা' : 'Curriculum & Lab Directory'}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              {langMode === 'bn' ? 'মাস্টার পাঠ্যসূচি ইনডেক্স (পাঠ ০–২৪)' : 'Master Curriculum Index (Topics 0–24)'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
              {langMode === 'bn'
                ? 'যেকোনো পাঠের সিমুলেটর চালাতে "ল্যাব শুরু করুন" এবং সহজ গল্প ও সূত্রের গভীর অর্থ পড়তে "সহজ ব্যাখ্যা" বাটনে ক্লিক করুন।'
                : 'Click "Interactive Lab" to launch the topic simulator, or "Topic Explanation" to read everyday analogies and formula breakdowns in English & বাংলা.'}
            </p>
          </div>

          {/* Progress & Layout View Toggles */}
          <div className="flex flex-row items-center gap-2 sm:gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 sm:px-4 py-2 text-right">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                {langMode === 'bn' ? 'আয়ত্ত করা টপিক' : 'Mastery Progress'}
              </div>
              <div className="text-xs sm:text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                {completedCount} of {TOPICS.length} ({progressPct}%)
              </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setIndexLayout('cards')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  indexLayout === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIndexLayout('table')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  indexLayout === 'table'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Compact Table View"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Module Filter Pills */}
          <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto pb-1 sm:pb-0 gap-1.5 no-scrollbar">
            {[
              { id: 'all', labelEn: `All (${TOPICS.length})`, labelBn: `সকল পাঠ (${TOPICS.length})` },
              { id: 'physics', labelEn: 'Physics (0–5)', labelBn: 'পদার্থবিজ্ঞান (০–৫)' },
              { id: 'diodes', labelEn: 'Diodes (6–15)', labelBn: 'ডায়োড ও এলইডি (৬–১৫)' },
              { id: 'rectifiers', labelEn: 'Rectifiers (17–20)', labelBn: 'রেক্টিফায়ার (১৭–২০)' },
              { id: 'bjt', labelEn: 'BJT (16, 19b)', labelBn: 'বিজিটি ট্রানজিস্টর (১৬, ১৯b)' },
              { id: 'fet', labelEn: 'FET (20–24)', labelBn: 'জেফেট ও মসফেট (২০–২৪)' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModuleFilter(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  moduleFilter === m.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {langMode === 'bn' ? m.labelBn : m.labelEn}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={langMode === 'bn' ? 'টপিক বা সূত্র দিয়ে খুঁজুন...' : 'Search topic or formula...'}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid View */}
      {indexLayout === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredTopics.map((t) => {
            const isDone = !!completed[t.id];
            const eli5 = ELI5_TOPIC_DATA[t.num] || ELI5_TOPIC_DATA['0'];
            return (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-extrabold border border-indigo-200 dark:border-indigo-800">
                        Topic #{t.num}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                        {t.badge}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleComplete(t.id)}
                      className="text-xs p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title={isDone ? 'Marked Mastered (Click to undo)' : 'Mark as Mastered (Click to complete)'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                    {langMode === 'bn' ? t.titleBn : t.titleEn}
                  </h3>
                  {langMode === 'dual' && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 leading-snug">
                      {t.titleBn}
                    </p>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                      {langMode === 'bn' ? 'মূল গাণিতিক সূত্র:' : 'Core Governing Equation:'}
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-amber-800 dark:text-amber-300 overflow-x-auto py-0.5">
                      <MathView math={t.formula} />
                    </div>
                  </div>

                  {/* Intuitive Explanation Snippet */}
                  <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-2.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-400">
                      <span>💡</span>
                      <span>{langMode === 'bn' ? 'সহজ ব্যাখ্যা ও বাস্তব উপমা:' : 'Intuitive Concept & Explanation:'}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Interactive Lab & Explanation */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => openLabForTopic(t.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{langMode === 'bn' ? 'ল্যাব শুরু করুন' : 'Open Lab'}</span>
                  </button>
                  <button
                    onClick={() => openExplanationForTopic(t.id)}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{langMode === 'bn' ? 'সহজ ব্যাখ্যা' : 'Topic Explanation'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact Table View */}
      {indexLayout === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="p-3.5 text-center">{langMode === 'bn' ? 'অবস্থা' : 'Done'}</th>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">{langMode === 'bn' ? 'টপিক ও সার্কিটের নাম' : 'Topic & Circuit Name'}</th>
                  <th className="p-3.5">{langMode === 'bn' ? 'মূল গাণিতিক সূত্র' : 'Core Formula'}</th>
                  <th className="p-3.5">{langMode === 'bn' ? 'সহজ ব্যাখ্যা ও মূল নীতি' : 'Intuitive Concept & Meaning'}</th>
                  <th className="p-3.5 text-right">{langMode === 'bn' ? 'পদক্ষেপ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTopics.map((t) => {
                  const eli5 = ELI5_TOPIC_DATA[t.num] || ELI5_TOPIC_DATA['0'];
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="p-3 text-center">
                        <button onClick={() => toggleComplete(t.id)}>
                          {completed[t.id] ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.num}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        <div>{langMode === 'bn' ? t.titleBn : t.titleEn}</div>
                        {langMode === 'dual' && <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal">{t.titleBn}</div>}
                      </td>
                      <td className="p-3 text-amber-800 dark:text-amber-300 font-medium text-xs sm:text-sm min-w-[200px]">
                        <MathView math={t.formula} />
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openLabForTopic(t.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs"
                          >
                            {langMode === 'bn' ? 'ল্যাব →' : 'Open Lab →'}
                          </button>
                          <button
                            onClick={() => openExplanationForTopic(t.id)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                          >
                            {langMode === 'bn' ? 'ব্যাখ্যা' : 'Explain'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
