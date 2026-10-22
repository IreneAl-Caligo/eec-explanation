import React, { useState } from 'react';
import {
  Cpu, BookOpen, Globe, Sun, Moon, Volume2, VolumeX,
  RotateCcw, Bot, CheckCircle2, Menu, X, Calculator, ShieldAlert
} from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';

export default function Navbar() {
  const {
    mainView, setMainView,
    langMode, cycleLangMode,
    theme, toggleTheme,
    soundEnabled, toggleSound,
    completed, resetAllProgress,
    setIsAiTutorOpen,
  } = useLabStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalTopics = TOPICS.length;
  const progressPct = Math.round((completedCount / totalTopics) * 100);

  const handleReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
  };

  const navTabs = [
    {
      id: 'index_table',
      labelEn: 'Index',
      labelBn: 'ইনডেক্স',
      fullLabelEn: 'Curriculum Index',
      fullLabelBn: 'মাস্টার ইনডেক্স',
      icon: BookOpen,
    },
    {
      id: 'explorer',
      labelEn: 'Virtual Lab',
      labelBn: 'ভার্চুয়াল ল্যাব',
      fullLabelEn: 'Virtual Laboratory',
      fullLabelBn: 'ভার্চুয়াল ল্যাবরেটরি',
      icon: Cpu,
    },
    {
      id: 'calculator',
      labelEn: 'Math Solver',
      labelBn: 'ম্যাথ সলভার',
      fullLabelEn: 'Math Solver & Diagnostics',
      fullLabelBn: 'ম্যাথ সলভার ও ডায়াগনস্টিক',
      icon: Calculator,
    },
  ];

  return (
    <>
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

          {/* Center Tabs: Desktop Navigation */}
          <nav className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = mainView === tab.id || (tab.id === 'calculator' && mainView === 'troubleshooting');
              return (
                <button
                  key={tab.id}
                  onClick={() => setMainView(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{langMode === 'bn' ? tab.fullLabelBn : tab.fullLabelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* AI Tutor Drawer Button */}
            <button
              onClick={() => setIsAiTutorOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition hover:scale-102"
              title="Open AI Circuit Tutor (যেকোনো ভাষায় প্রশ্ন করুন)"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{langMode === 'bn' ? 'এআই শিক্ষক' : 'AI Tutor'}</span>
            </button>

            {/* Quick Progress Indicator */}
            <div
              className="hidden xl:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs"
              title={langMode === 'bn' ? 'আপনার বর্তমান অগ্রগতি (অটো সেভ)' : 'Your Real-Time Progress (Auto-Saved)'}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {completedCount}/{totalTopics} ({progressPct}%)
              </span>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs transition"
              title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Feedback (Web Audio)'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs transition"
              title={langMode === 'bn' ? 'প্রোগ্রেস শূন্যে রিসেট করুন' : 'Reset Progress to 0%'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

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
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 pb-1">
            <div className="flex items-center justify-between px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">{langMode === 'bn' ? 'অগ্রগতি:' : 'Progress:'}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{completedCount}/{totalTopics} ({progressPct}%)</span>
            </div>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = mainView === tab.id || (tab.id === 'calculator' && mainView === 'troubleshooting');
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMainView(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{langMode === 'bn' ? tab.fullLabelBn : tab.fullLabelEn}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Confirmation Modal for Resetting Progress */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  {langMode === 'bn' ? 'প্রোগ্রেস রিসেট নিশ্চিতকরণ' : 'Reset Progress to 0%?'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {langMode === 'bn' ? 'সব সম্পন্ন করা টপিক ও কুইজ শূন্য হবে' : 'All mastered topics and quizzes will start from 0'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {langMode === 'bn'
                ? 'আপনি কি নিশ্চিত যে আপনার সমস্ত আয়ত্ত করা টপিক ও কুইজ উত্তর মুছে দিয়ে একদম নতুন করে ০% থেকে শুরু করতে চান?'
                : 'Are you sure you want to reset your saved progress? All completed topics and quiz answers will be reset to zero.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {langMode === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
              >
                {langMode === 'bn' ? 'হ্যাঁ, রিসেট করুন' : 'Yes, Reset to 0'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
