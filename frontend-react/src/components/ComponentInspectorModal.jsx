import React from 'react';
import { Info, X, Zap, Sliders, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { INSPECTOR_DATABASE } from '../data/inspectorData';

export default function ComponentInspectorModal({ itemKey, onClose, onLaunchLab }) {
  if (!itemKey) return null;

  // Resolve item from database or fallback
  const item = INSPECTOR_DATABASE[itemKey] || {
    name: itemKey.replace(/_/g, ' ').toUpperCase(),
    category: 'Circuit Element',
    symbol: '⚡',
    formula: 'V = I · R',
    definitionEn: 'An electronic circuit or semiconductor component operating under electromagnetic and solid-state physical principles.',
    definitionBn: 'একটি ইলেকট্রনিক সার্কিট বা অর্ধপরিবাহী উপাদান যা পদার্থবিজ্ঞানের নিয়ম মেনে কাজ করে।',
    physicsEn: 'When electrical potential is applied across this element, mobile charge carriers experience electrostatic forces governing current flow and energy transfer.',
    physicsBn: 'ভোল্টেজ প্রয়োগের ফলে চার্জ ক্যারিয়ারগুলোর ওপর বৈদ্যুতিক বল কাজ করে এবং বিদ্যুৎ প্রবাহিত হয়।',
    specs: []
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-lg sm:text-xl shadow-xs shrink-0">
              {item.symbol?.slice(0, 2) || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Boylestad 11th Ed. Ref</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {item.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold transition shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Governing Formula */}
        {item.formula && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Governing Equation:</span>
            <code className="text-xs md:text-sm font-mono font-bold text-amber-700 dark:text-amber-400 break-all">{item.formula}</code>
          </div>
        )}

        {/* Section 1: Definition (English + Bangla) */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Formal Textbook Definition (সংজ্ঞা)
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3.5 sm:p-4 space-y-2">
            <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              <strong className="text-indigo-900 dark:text-indigo-300 font-bold block mb-1">English Definition:</strong>
              {item.definitionEn}
            </p>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-700/60 pt-2">
              <strong className="text-emerald-800 dark:text-emerald-400 font-bold block mb-1">বাংলা সংজ্ঞা:</strong>
              {item.definitionBn}
            </p>
          </div>
        </div>

        {/* Section 2: Proper Scientific Explanation (English + Bangla) */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Proper Physical Explanation (কার্যপ্রণালী ও বিশ্লেষণ)
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3.5 sm:p-4 space-y-2.5">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1">Solid-State & Circuit Physics:</span>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.physicsEn}
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700/60 pt-2">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block mb-1">সহজ বাংলায় ব্যাখ্যা:</span>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.physicsBn}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications Table (if any) */}
        {item.specs && item.specs.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Key Specifications & Ratings:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.specs.map((sp, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{sp.label}:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{sp.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">Tap anywhere outside or press Close</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
          >
            Got it (বুঝেছি) ✓
          </button>
        </div>
      </div>
    </div>
  );
}
