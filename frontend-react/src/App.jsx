import React, { useState, useEffect, useMemo } from 'react';
import {
  Atom, Zap, Cpu, Activity, Sun, Moon, ShieldAlert, Sliders, BookOpen,
  CheckCircle2, Circle, Search, Globe, Play, Pause, RotateCcw,
  ChevronRight, ChevronLeft, Layers, Sparkles, HelpCircle, Code,
  FileCode, Terminal, Award, ArrowRight, Eye, Info, LayoutGrid, Table,
  Menu, X
} from 'lucide-react';

import { TOPICS } from './data/topicsData';
import { ELI5_TOPIC_DATA } from './data/eli5Data';
import { t } from './data/translations';
import TopicSpecificLabRenderer from './components/TopicSpecificLabRenderer';
import ComponentInspectorModal from './components/ComponentInspectorModal';
import { INSPECTOR_DATABASE } from './data/inspectorData';

const INSPECTABLE_ITEMS = [
  { id: 'si_diode', labelEn: 'Silicon PN Diode (0.7V)', labelBn: 'সিলিকন ডায়োড (০.৭V)' },
  { id: 'ge_diode', labelEn: 'Germanium Diode (0.3V)', labelBn: 'জার্মেনিয়াম ডায়োড (০.৩V)' },
  { id: 'schottky', labelEn: 'Schottky Diode (0.2V)', labelBn: 'শটকি ডায়োড (০.২V)' },
  { id: 'zener', labelEn: 'Zener Diode (Vz Breakdown)', labelBn: 'জেনার ডায়োড (Vz ব্রেকডাউন)' },
  { id: 'led', labelEn: 'Light Emitting Diode (LED)', labelBn: 'এলইডি বাতি (LED আলো)' },
  { id: 'bjt', labelEn: 'BJT Transistor (NPN/PNP)', labelBn: 'বিজেটি ট্রানজিস্টর (NPN/PNP)' },
  { id: 'jfet', labelEn: 'JFET Transistor (N/P Channel)', labelBn: 'জেফেট (JFET চ্যানেল)' },
  { id: 'covalent_bond', labelEn: 'Covalent Bonding (Si Lattice)', labelBn: 'সমযোজী বন্ধন (সিলিকন)' },
  { id: 'intrinsic_material', labelEn: 'Intrinsic Semiconductor (Pure)', labelBn: 'বিশুদ্ধ ইন্ট্রিনসিক ক্রিস্টাল' },
  { id: 'n_type', labelEn: 'N-Type Extrinsic (Phosphorus)', labelBn: 'এন-টাইপ ডোপিং (ফসফরাস)' },
  { id: 'p_type', labelEn: 'P-Type Extrinsic (Boron)', labelBn: 'পি-টাইপ ডোপিং (বোরন)' },
  { id: 'depletion_region', labelEn: 'Depletion Layer & Barrier', labelBn: 'ডিপ্লেশন অঞ্চল ও বেরিয়ার' },
  { id: 'capacitor', labelEn: 'Smoothing Filter Capacitor', labelBn: 'ফিল্টার ক্যাপাসিটর (C)' },
  { id: 'resistor', labelEn: 'Resistor (Current Limiter)', labelBn: 'রোধক / রেজিস্টর (R)' },
  { id: 'knee_voltage', labelEn: 'Knee Voltage (Vk = 0.7V / 0.3V)', labelBn: 'নি ভোল্টেজ (Vk)' },
  { id: 'dc_source', labelEn: 'DC Voltage Power Supply', labelBn: 'ডিসি ভোল্টেজ সোর্স' },
  { id: 'ac_source', labelEn: 'AC Sinusoidal Generator', labelBn: 'এসি সাইন-ওয়েভ জেনারেটর' },
];

export default function App() {
  const [selectedId, setSelectedId] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [langMode, setLangMode] = useState('dual'); // 'dual' | 'en' | 'bn'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('eec_theme') || 'light';
  });
  // Home page is Master Index as requested
  const [mainView, setMainView] = useState('index_table'); // 'index_table' (Master Index) | 'explorer' (Interactive Lab) | 'explanation'
  const [indexLayout, setIndexLayout] = useState('cards'); // 'cards' | 'table'
  const [completed, setCompleted] = useState({ '0': true, '1': true });
  const [quizChoice, setQuizChoice] = useState({});
  const [inspectedKey, setInspectedKey] = useState(null);
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);
  const [showInlineExplanation, setShowInlineExplanation] = useState(false);

  // Synchronize dark class with document element and body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('eec_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('eec_theme', 'light');
    }
  }, [theme]);

  // Cycle language mode: dual -> en -> bn -> dual
  const cycleLangMode = () => {
    if (langMode === 'dual') setLangMode('en');
    else if (langMode === 'en') setLangMode('bn');
    else setLangMode('dual');
  };

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

  const activeTopic = useMemo(
    () => TOPICS.find((t) => t.id === selectedId) || TOPICS[0],
    [selectedId]
  );

  const activeIdx = TOPICS.findIndex((t) => t.id === activeTopic.id);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / TOPICS.length) * 100);

  const toggleComplete = (id) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const countWords = (str) => (str ? str.trim().split(/\s+/).length : 0);

  // Quick navigation helpers
  const openLabForTopic = (id) => {
    setSelectedId(id);
    setMainView('explorer');
    setShowInlineExplanation(false);
    setIsTopicMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openExplanationForTopic = (id) => {
    setSelectedId(id);
    setMainView('explanation');
    setIsTopicMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans flex flex-col selection:bg-indigo-600 selection:text-white transition-colors duration-200`}>
      {/* =========================================================================
          TOP NAVIGATION HEADER (Light/Dark Mode, Unified Tabs, Merged Language Toggle, Mobile Responsive)
      ========================================================================= */}
      <header className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 sticky top-0 z-40 backdrop-blur shadow-xs transition-colors">
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Main Title */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
            onClick={() => setMainView('index_table')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-500 flex items-center justify-center shadow-sm text-white group-hover:scale-105 transition">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                  {langMode === 'bn' ? 'ইইসি ভার্চুয়াল ল্যাব' : 'EEC Virtual Lab'}
                </h1>
                <span className="hidden md:inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {langMode === 'bn' ? 'বয়েলস্টেড ১১শ সংস্করণ • ২৫টি মডিউল' : 'Boylestad 11th Ed. • 25 Modules'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {langMode === 'bn' ? 'ইন্টারেক্টিভ সেমিকন্ডাক্টর ও সার্কিট সিমুলেশন' : 'Interactive Semiconductor Simulation'}
              </p>
            </div>
          </div>

          {/* Right Controls: Tabs + Language + Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {[
                {
                  id: 'index_table',
                  label: langMode === 'bn' ? 'ইনডেক্স' : 'Index',
                  fullLabel: langMode === 'bn' ? 'মাস্টার ইনডেক্স' : 'Master Index',
                  icon: BookOpen
                },
                {
                  id: 'explorer',
                  label: langMode === 'bn' ? 'ল্যাব' : 'Lab',
                  fullLabel: langMode === 'bn' ? 'ইন্টারেক্টিভ ল্যাব' : 'Interactive Lab',
                  icon: Sliders
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = mainView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMainView(tab.id)}
                    className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.fullLabel}</span>
                    <span className="sm:hidden">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Mode Selector Button */}
            <button
              onClick={cycleLangMode}
              className="px-2 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shadow-xs transition"
              title="Click to toggle language mode (Dual EN+BN ➔ English ➔ বাংলা)"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="hidden md:inline text-xs">
                {langMode === 'dual' ? 'EN + বাংলা' : langMode === 'en' ? 'English' : 'বাংলা'}
              </span>
              <span className="text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-indigo-700 dark:text-indigo-300">
                {langMode.toUpperCase()}
              </span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px]">{langMode === 'bn' ? 'হালকা' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline text-[11px]">{langMode === 'bn' ? 'গাঢ়' : 'Dark'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          VIEW 1: MASTER INDEX (HOME PAGE)
      ========================================================================= */}
      {mainView === 'index_table' && (
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
                    ? 'যেকোনো পাঠের সিমুলেটর চালাতে "ল্যাব শুরু করুন" এবং ৫ বছরের শিশুর মতো সহজ গল্প ও সূত্রের অর্থ পড়তে "৫ বছরের শিশুর মতো ব্যাখ্যা" বাটনে ক্লিক করুন।'
                    : 'Click "Interactive Lab" to launch the topic simulator, or "5-Yr-Old Explanation" to read everyday analogies and formula breakdowns in English & বাংলা.'}
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
                      indexLayout === 'cards' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Grid Cards View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIndexLayout('table')}
                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                      indexLayout === 'table' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
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
                          className="text-xs"
                          title={isDone ? 'Marked Mastered' : 'Mark as Mastered'}
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
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                          {langMode === 'bn' ? 'মূল গাণিতিক সূত্র:' : 'Core Governing Equation:'}
                        </div>
                        <code className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 break-all">
                          {t.formula}
                        </code>
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
                        <span>{langMode === 'bn' ? 'ল্যাব শুরু করুন' : 'Interactive Lab'}</span>
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
                          <td className="p-3 font-mono text-amber-700 dark:text-amber-400 font-semibold">{t.formula}</td>
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
      )}

      {/* =========================================================================
          VIEW 2: UNIFIED INTERACTIVE LAB (FULL SCREEN, 2-COLUMN EXPERIMENT WORKSTATION)
      ========================================================================= */}
      {mainView === 'explorer' && (() => {
        const inspectedItem = inspectedKey ? (INSPECTOR_DATABASE[inspectedKey] || null) : null;
        return (
          <div className="w-full max-w-[99vw] mx-auto px-3 sm:px-6 lg:px-8 py-4 flex-1 space-y-5">
            {/* Top Bar with Sandwich Menu & Active Topic Identity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Sandwich Menu Button & Active Topic Badges */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsTopicMenuOpen(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs transition"
                    title="Open Topic Switcher Menu"
                  >
                    <Menu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="hidden sm:inline">☰ Topic Menu (All 25 Topics)</span>
                    <span className="sm:hidden">Menu</span>
                  </button>

                  <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-mono font-black">
                    #{activeTopic.num}
                  </span>
                  <span className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700">
                    {activeTopic.badge}
                  </span>
                </div>

                {/* Action Buttons: Explanation & Mastery */}
                <div className="flex items-center gap-2">
                  {/* Explanation Toggle Button */}
                  <button
                    onClick={() => setShowInlineExplanation(!showInlineExplanation)}
                    className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition shadow-xs ${
                      showInlineExplanation
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                    }`}
                    title="Toggle Extended Exam Notes"
                  >
                    <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="hidden sm:inline">
                      {showInlineExplanation
                        ? (langMode === 'bn' ? 'সংক্ষিপ্ত নোট লুকান' : 'Hide Extended Notes')
                        : (langMode === 'bn' ? `টপিক #${activeTopic.num} পূর্ণ নোট শিট` : `Topic #${activeTopic.num} Full Study Notes`)}
                    </span>
                    <span className="sm:hidden">
                      {showInlineExplanation ? 'Hide' : 'Notes'}
                    </span>
                  </button>

                  {/* Mark as Mastered button */}
                  <button
                    onClick={() => toggleComplete(activeTopic.id)}
                    className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                      completed[activeTopic.id]
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{completed[activeTopic.id] ? 'Mastered ✓' : 'Mark Mastered'}</span>
                    <span className="sm:hidden">{completed[activeTopic.id] ? 'Done' : 'Mark'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Bilingual Topic Titles (Enlarged Fonts!) */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {langMode === 'bn' ? activeTopic.titleBn : activeTopic.titleEn}
                </h2>
                {langMode === 'dual' && (
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {activeTopic.titleBn}
                  </h3>
                )}
                {langMode === 'en' && (
                  <h3 className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Boylestad 11th Edition Core Electronic Devices & Circuits Curriculum
                  </h3>
                )}
              </div>
            </div>

            {/* 2-COLUMN MAIN WORKSPACE */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* =========================================================================
                  LEFT COLUMN: "Click any component or term to view its Name, Definition & Proper Explanation"
              ========================================================================= */}
              <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">
                {/* Inspectable Components & Terms Vertical List */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-colors">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {langMode === 'bn' ? 'উপাদান ও পরিভাষা ডিরেক্টরি' : 'Component & Physics Terms'}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1 leading-snug">
                      {langMode === 'bn'
                        ? 'যেকোনো উপাদান বা পরিভাষার ওপর ক্লিক করে নাম, সংজ্ঞা ও সঠিক ব্যাখ্যা দেখুন:'
                        : 'Click any component or term to view its Name, Definition & Proper Explanation:'}
                    </h4>
                  </div>

                  {/* Vertical List */}
                  <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                    {INSPECTABLE_ITEMS.map((item) => {
                      const isSelected = inspectedKey === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setInspectedKey(item.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-between border ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{langMode === 'bn' ? item.labelBn : item.labelEn}</span>
                          <Info className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Component Explanation Box in Left Sidebar */}
                {inspectedItem && (
                  <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-4 shadow-sm space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-800 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        {langMode === 'bn' ? 'নির্বাচিত উপাদানের সঠিক তথ্য' : 'Inspected Definition & Physics'}
                      </span>
                      <button
                        onClick={() => setInspectedKey(null)}
                        className="w-5 h-5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-500 flex items-center justify-center text-xs font-bold"
                        title="Close Inspector"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{inspectedItem.symbol?.slice(0, 2) || '⚡'}</span>
                        <div>
                          <h5 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                            {inspectedItem.name}
                          </h5>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{inspectedItem.category}</span>
                        </div>
                      </div>

                      {inspectedItem.formula && (
                        <div className="mt-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/70">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Formula:</span>
                          <code className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 break-all">
                            {inspectedItem.formula}
                          </code>
                        </div>
                      )}

                      <div className="mt-2.5 space-y-1">
                        <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase block">
                          {langMode === 'bn' ? 'সংজ্ঞা (Definition):' : 'Definition:'}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {langMode === 'bn' ? inspectedItem.definitionBn : inspectedItem.definitionEn}
                        </p>
                        {langMode === 'dual' && (
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                            {inspectedItem.definitionBn}
                          </p>
                        )}
                      </div>

                      <div className="mt-2.5 space-y-1">
                        <span className="text-[11px] font-bold text-purple-900 dark:text-purple-300 uppercase block">
                          {langMode === 'bn' ? 'সঠিক পদার্থবিজ্ঞান ও ব্যাখ্যা (Proper Explanation):' : 'Proper Physics & Explanation:'}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {langMode === 'bn' ? inspectedItem.physicsBn : inspectedItem.physicsEn}
                        </p>
                      </div>

                      <button
                        onClick={() => {}}
                        className="mt-3 w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
                      >
                        {langMode === 'bn' ? 'সম্পূর্ণ স্পেসিফিকেশন দেখুন' : 'View Complete Specs'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Sequential Navigation in Left Sidebar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 transition-colors">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    <span>Curriculum Sequence</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{activeIdx + 1} / {TOPICS.length}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={activeIdx <= 0}
                      onClick={() => activeIdx > 0 && setSelectedId(TOPICS[activeIdx - 1].id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
                    >
                      <ChevronLeft className="w-4 h-4" /> {langMode === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                    </button>
                    <button
                      disabled={activeIdx >= TOPICS.length - 1}
                      onClick={() => activeIdx < TOPICS.length - 1 && setSelectedId(TOPICS[activeIdx + 1].id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      {langMode === 'bn' ? 'পরবর্তী' : 'Next'} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Concept Check Quiz in Left Sidebar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 transition-colors">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Quick Quiz (#{activeTopic.num})
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {activeTopic.quiz.q}
                  </p>
                  <div className="space-y-1.5">
                    {activeTopic.quiz.options.map((opt, idx) => {
                      const picked = quizChoice[activeTopic.id];
                      const isPicked = picked === idx;
                      const isRight = idx === activeTopic.quiz.ans;
                      return (
                        <button
                          key={idx}
                          onClick={() => setQuizChoice((prev) => ({ ...prev, [activeTopic.id]: idx }))}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition ${
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
              </aside>

              {/* =========================================================================
                  RIGHT COLUMN: FORMULA OVER EXPERIMENT ZONE + EXPLANATION + MERGED LAB
              ========================================================================= */}
              <main className="flex-1 min-w-0 space-y-4">
                {/* 1. CORE EQUATION & EXPLANATION (Directly unified: Explanation placed just below the Core Equation!) */}
                {(() => {
                  const eli5 = ELI5_TOPIC_DATA[activeTopic.num] || ELI5_TOPIC_DATA['0'];
                  return (
                    <div className="bg-white dark:bg-slate-900 border-2 border-amber-400/90 dark:border-amber-500/70 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors">
                      {/* Top Bar: Core Equation */}
                      <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-400/60 dark:border-amber-500/40 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                            {langMode === 'bn' ? 'মূল সমীকরণ (Core Equation):' : 'Core Equation:'}
                          </span>
                        </div>
                        <code className="text-base sm:text-xl lg:text-2xl font-mono font-black text-amber-800 dark:text-amber-300 tracking-wide">
                          {activeTopic.formula}
                        </code>
                      </div>

                      {/* Directly Below Core Equation: Explanation */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">💡</span>
                            <h4 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white">
                              {langMode === 'bn' ? 'সহজ ব্যাখ্যা (Explanation):' : 'Explanation:'}
                            </h4>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            Topic #{activeTopic.num}
                          </span>
                        </div>

                        {/* Explanation Text */}
                        <div className="space-y-3">
                          <p className="text-sm sm:text-base lg:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium whitespace-pre-line">
                            {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
                          </p>
                          {langMode === 'dual' && (
                            <p className="text-sm sm:text-base lg:text-lg text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800 pt-3 whitespace-pre-line">
                              {eli5.storyBn}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Variable Meanings Breakdown */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 space-y-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {langMode === 'bn' ? 'সূত্রের প্রতিটি চিহ্নের সহজ ও বাস্তব অর্থ:' : 'Meaning of Each Symbol in the Formula:'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                          {eli5.variables.map((v, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm block">{v.sym}</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs mt-0.5">
                                {langMode === 'bn' ? v.nameBn : v.nameEn}
                              </span>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                {langMode === 'bn' ? v.descBn : v.descEn}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Extended Technical Study Notes when toggled */}
                      {showInlineExplanation && (
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
                          <div className={`grid grid-cols-1 ${langMode === 'dual' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                            {(langMode === 'dual' || langMode === 'en') && (
                              <div className="bg-slate-50 dark:bg-slate-800/50 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                                  English Concise Exam Notes
                                </span>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                                  {activeTopic.enSummary}
                                </p>
                              </div>
                            )}
                            {(langMode === 'dual' || langMode === 'bn') && (
                              <div className="bg-slate-50 dark:bg-slate-800/50 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                                  সহজ বাংলায় সম্পূর্ণ নোট
                                </span>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                                  {activeTopic.bnSummary}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Key Takeaways */}
                          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                              {langMode === 'bn' ? 'পরীক্ষা ও ভাইভার জন্য গুরুত্বপূর্ণ পয়েন্টসমূহ:' : 'Key Exam & Viva Takeaways:'}
                            </span>
                            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                              {activeTopic.keyPoints.map((pt, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. DEDICATED EXPERIMENT ZONE (Merged Unified Lab: Visual Canvas + Integrated Parameter Deck) */}
                <div className="space-y-4">
                  <TopicSpecificLabRenderer topic={activeTopic} langMode={langMode} />
                </div>
              </main>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          VIEW 3: DEDICATED FULL EXPLANATION VIEW (If opened from Master Index)
      ========================================================================= */}
      {mainView === 'explanation' && (
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
                {langMode === 'bn' ? `টপিক #${activeTopic.num} ব্যাখ্যা` : `Topic #${activeTopic.num} Explanation`}
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

            {/* Formula Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {langMode === 'bn' ? 'মূল গাণিতিক সূত্র:' : 'Governing Mathematical Law:'}
              </span>
              <div className="text-sm md:text-base font-mono font-bold text-amber-700 dark:text-amber-400">{activeTopic.formula}</div>
            </div>

            {/* Intuitive Concept & Working Principle Card */}
            {(() => {
              const eli5 = ELI5_TOPIC_DATA[activeTopic.num] || ELI5_TOPIC_DATA['0'];
              return (
                <div className="space-y-4">
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
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">{v.sym}</span>
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
              );
            })()}

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
                  const picked = quizChoice[activeTopic.id];
                  const isPicked = picked === idx;
                  const isRight = idx === activeTopic.quiz.ans;
                  return (
                    <button
                      key={idx}
                      onClick={() => setQuizChoice((prev) => ({ ...prev, [activeTopic.id]: idx }))}
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
      )}

      {/* =========================================================================
          SLIDE-OVER SANDWICH TOPIC SWITCHER DRAWER
      ========================================================================= */}
      {isTopicMenuOpen && (
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
              {filteredTopics.map((t) => {
                const isSelected = t.id === activeTopic.id;
                const isDone = !!completed[t.id];
                return (
                  <button
                    key={t.id}
                    onClick={() => openLabForTopic(t.id)}
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
      )}

      {/* Global Component & Physics Explanation Inspector Modal */}
      <ComponentInspectorModal
        itemKey={inspectedKey}
        onClose={() => setInspectedKey(null)}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>{langMode === 'bn' ? 'সিএসই ১ম বর্ষ ইইসি ভার্চুয়াল ল্যাব ও সিমুলেটর' : 'CSE 1st Year Electrical & Electronic Circuits (EEC) Virtual Lab'}</span>
          <span>{langMode === 'bn' ? 'বয়েলস্টেড ১১শ সংস্করণ পাঠ্যসূচি • রিঅ্যাক্ট ১৮ + ভাইট + টেলউইন্ড সিএসএস' : 'Boylestad 11th Edition Syllabus • React 18 + Vite + Tailwind CSS'}</span>
        </div>
      </footer>
    </div>
  );
}
