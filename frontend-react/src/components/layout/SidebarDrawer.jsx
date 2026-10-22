import React from 'react';
import { Menu, X, Search, CheckCircle2, Circle } from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';

export default function SidebarDrawer() {
  const {
    isTopicMenuOpen, setIsTopicMenuOpen,
    searchQuery, setSearchQuery,
    moduleFilter, setModuleFilter,
    selectedId, setSelectedId,
    completed, toggleComplete,
    langMode, setMainView
  } = useLabStore();

  if (!isTopicMenuOpen) return null;

  const filtered = TOPICS.filter((t) => {
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

  const handleSelectTopic = (id) => {
    setSelectedId(id);
    setMainView('explorer');
    setIsTopicMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-start animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md h-full shadow-2xl p-4 sm:p-5 flex flex-col space-y-4 border-r border-slate-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              {langMode === 'bn' ? 'সিলেবাস পাঠ্যসূচি ড্রয়ার' : 'Curriculum Topic Switcher'}
            </h3>
          </div>
          <button
            onClick={() => setIsTopicMenuOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={langMode === 'bn' ? 'পাঠের নাম বা নম্বর দিয়ে খুঁজুন...' : 'Search topic by name or number...'}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', labelEn: 'All', labelBn: 'সকল' },
            { id: 'physics', labelEn: 'Physics', labelBn: 'পদার্থবিজ্ঞান' },
            { id: 'diodes', labelEn: 'Diodes', labelBn: 'ডায়োড' },
            { id: 'rectifiers', labelEn: 'Rectifiers', labelBn: 'রেক্টিফায়ার' },
            { id: 'bjt', labelEn: 'BJT', labelBn: 'বিজিটি' },
            { id: 'fet', labelEn: 'FET', labelBn: 'জেফেট' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setModuleFilter(m.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                moduleFilter === m.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {langMode === 'bn' ? m.labelBn : m.labelEn}
            </button>
          ))}
        </div>

        {/* Scrollable Topics List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.map((t) => {
            const isSelected = t.id === selectedId;
            const isDone = !!completed[t.id];
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTopic(t.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 text-indigo-950 dark:text-indigo-100 shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(t.id);
                  }}
                  className="mt-0.5 cursor-pointer"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300">
                      Topic #{t.num}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{t.badge}</span>
                  </div>
                  <div className="font-bold text-xs mt-1 text-slate-900 dark:text-white leading-snug">
                    {langMode === 'bn' ? t.titleBn : t.titleEn}
                  </div>
                  {langMode === 'dual' && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate">{t.titleBn}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
