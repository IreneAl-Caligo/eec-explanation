import React, { useState, useEffect } from 'react';
import { Calculator, ShieldAlert, Cpu, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import BoylestadMathSolverView from './BoylestadMathSolverView';
import CircuitTroubleshootingGameView from './CircuitTroubleshootingGameView';
import { useLabStore } from '../../store/useLabStore';
import { playMechanicalClick } from '../../utils/audioEngine';

export default function MathAndDiagnosticsView({ initialTab = 'solver' }) {
  const { langMode } = useLabStore();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL hash if loaded directly
  useEffect(() => {
    if (window.location.hash.includes('troubleshooting')) {
      setActiveTab('diagnostics');
    } else if (window.location.hash.includes('calculator')) {
      setActiveTab('solver');
    }
  }, []);

  const handleTabChange = (tab) => {
    playMechanicalClick();
    setActiveTab(tab);
    if (tab === 'solver') {
      window.history.replaceState(null, '', '#/calculator');
    } else {
      window.history.replaceState(null, '', '#/troubleshooting');
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Top Unified Header with Segmented Navigation Bar */}
      <section className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 sticky top-14 sm:top-15 z-30 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Section Title & Subtitle */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 text-white flex items-center justify-center shadow-sm shrink-0">
              {activeTab === 'solver' ? (
                <Calculator className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {langMode === 'bn' ? 'ম্যাথ সলভার ও ডায়াগনস্টিক স্যুট' : 'Math Solver & Diagnostic Suite'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Boylestad 11th Ed.
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {langMode === 'bn'
                  ? 'গাণিতিক সমীকরণ সমাধান ও বাস্তব ল্যাব ফল্ট শনাক্তকরণ'
                  : 'Step-by-step numerical calculations & virtual multimeter troubleshooting'}
              </p>
            </div>
          </div>

          {/* Segmented Switcher Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-center">
            <button
              onClick={() => handleTabChange('solver')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200 ${
                activeTab === 'solver'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>
                {langMode === 'bn' ? 'বয়েলস্টেড ম্যাথ সলভার' : 'Boylestad Math Solver'}
              </span>
              <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-mono">
                Deck
              </span>
            </button>

            <button
              onClick={() => handleTabChange('diagnostics')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200 ${
                activeTab === 'diagnostics'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
              <span>
                {langMode === 'bn' ? 'ফল্ট ডায়াগনস্টিক ল্যাব' : 'Fault Diagnostics Lab'}
              </span>
              <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-mono">
                Game
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Render Body */}
      <div className="flex-1">
        {activeTab === 'solver' ? (
          <BoylestadMathSolverView />
        ) : (
          <CircuitTroubleshootingGameView />
        )}
      </div>
    </div>
  );
}
