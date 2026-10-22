import React, { useMemo, useState } from 'react';
import {
  Menu, Info, CheckCircle2, Circle, ChevronLeft, ChevronRight,
  HelpCircle, BookOpen, Sliders, ExternalLink, Sparkles, Activity,
  Terminal, Zap, Layers, Cpu
} from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';
import { INSPECTOR_DATABASE } from '../../data/inspectorData';
import MathView, { FormulaCard } from '../MathView';
import TopicSpecificLabRenderer from '../TopicSpecificLabRenderer';
import CrystalLattice3D from '../simulators/CrystalLattice3D';
import InteractiveBreadboardBuilder from '../workbench/InteractiveBreadboardBuilder';
import DualChannelOscilloscope from '../workbench/DualChannelOscilloscope';
import SpiceNetlistInspector from '../workbench/SpiceNetlistInspector';
import AudioWalkthroughPlayer from '../workbench/AudioWalkthroughPlayer';
import { playMechanicalClick } from '../../utils/audioEngine';

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

export default function LabWorkstationView() {
  const {
    selectedId, setSelectedId,
    langMode,
    completed, toggleComplete,
    quizChoices, setQuizChoice,
    inspectedKey, setInspectedKey,
    showInlineExplanation, setShowInlineExplanation,
    setIsTopicMenuOpen
  } = useLabStore();

  const activeTopic = useMemo(
    () => TOPICS.find((t) => t.id === selectedId) || TOPICS[0],
    [selectedId]
  );

  const activeIdx = TOPICS.findIndex((t) => t.id === activeTopic.id);
  const eli5 = ELI5_TOPIC_DATA[activeTopic.num] || ELI5_TOPIC_DATA['0'];
  const inspectedItem = inspectedKey ? (INSPECTOR_DATABASE[inspectedKey] || null) : null;

  const isSemiconductorPhysics = ['1', '2', '3', '4', '5'].includes(activeTopic.num);
  const isAcWaveformTopic = ['17', '18', '19', '19b', '20a'].includes(activeTopic.num);

  const [activeTool, setActiveTool] = useState('workbench'); // 'workbench', 'breadboard', 'lattice3d', 'oscilloscope', 'spice'

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

        {/* Dynamic Bilingual Topic Titles */}
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
        {/* LEFT COLUMN: Inspectable components & terms, sequential navigation, and quick quiz */}
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
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70">
                    <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 uppercase block mb-1">Formula:</span>
                    <div className="text-xs md:text-sm font-semibold text-amber-800 dark:text-amber-300 overflow-x-auto">
                      <MathView math={inspectedItem.formula} display={false} />
                    </div>
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
                const picked = quizChoices[activeTopic.id];
                const isPicked = picked === idx;
                const isRight = idx === activeTopic.quiz.ans;
                return (
                  <button
                    key={idx}
                    onClick={() => setQuizChoice(activeTopic.id, idx, isRight)}
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

        {/* RIGHT COLUMN: FORMULA + EXPLANATION + MERGED DEDICATED LAB */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* 1. CORE EQUATION & EXPLANATION */}
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400/90 dark:border-amber-500/70 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors">
            {/* Top Bar: Core Equation as Interactive FormulaCard */}
            <FormulaCard
              formula={activeTopic.formula}
              title={langMode === 'bn' ? 'মূল গাণিতিক সমীকরণ' : 'Core Governing Equation'}
              badge={`Topic #${activeTopic.num}`}
              langMode={langMode}
              verbalEn={eli5.verbalReadEn}
              verbalBn={eli5.verbalReadBn}
              variables={eli5.variables}
            />

            {/* Quick Exam Takeaway banner if available */}
            {(eli5.takeawayEn || eli5.takeawayBn) && (
              <div className="bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-xl p-3 text-xs flex items-center gap-2">
                <span className="text-emerald-700 dark:text-emerald-300 font-extrabold uppercase tracking-wider shrink-0">
                  🎓 {langMode === 'bn' ? 'পরীক্ষার সারসংক্ষেপ:' : 'Exam Takeaway:'}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {langMode === 'bn' ? (eli5.takeawayBn || eli5.takeawayEn) : eli5.takeawayEn}
                </span>
              </div>
            )}

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
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm block">
                      <MathView math={v.latex || v.sym} />
                    </span>
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

          {/* 2. BILINGUAL AUDIO GUIDE & VOICEOVER WALKTHROUGH */}
          <AudioWalkthroughPlayer
            topicNum={activeTopic.num}
            topicTitleEn={activeTopic.titleEn}
            topicTitleBn={activeTopic.titleBn}
            langMode={langMode}
            walkthroughEn={eli5.storyEn}
            walkthroughBn={eli5.storyBn}
          />

          {/* 3. UNIFIED LABORATORY WORKSPACE & INSTRUMENT DECK */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-500" />
              {langMode === 'bn' ? 'ল্যাবরেটরি ইনস্ট্রুমেন্ট ও সিমুলেটর মোড:' : 'Laboratory Instrument & Simulator Tools:'}
            </span>

            {/* Instrument Toolbar Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => { playMechanicalClick(); setActiveTool('workbench'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  activeTool === 'workbench'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{langMode === 'bn' ? 'টপিক ওয়ার্কবেঞ্চ' : 'Experiment Workbench'}</span>
              </button>

              <button
                onClick={() => { playMechanicalClick(); setActiveTool('breadboard'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  activeTool === 'breadboard'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{langMode === 'bn' ? 'ব্রেডবোর্ড ও তার সংযোগ' : 'Breadboard & Wire Builder'}</span>
              </button>

              <button
                onClick={() => { playMechanicalClick(); setActiveTool('lattice3d'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  activeTool === 'lattice3d'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{langMode === 'bn' ? '৩-ডি ল্যাটিস' : '3D Crystal Lattice'}</span>
                {isSemiconductorPhysics && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => { playMechanicalClick(); setActiveTool('oscilloscope'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  activeTool === 'oscilloscope'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{langMode === 'bn' ? 'ডুয়াল অসিলোস্কোপ' : 'Dual Oscilloscope'}</span>
                {isAcWaveformTopic && (
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => { playMechanicalClick(); setActiveTool('spice'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  activeTool === 'spice'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>SPICE Netlist</span>
              </button>
            </div>
          </div>

          {/* 4. ACTIVE LABORATORY TOOL VIEWPORT */}
          <div className="space-y-4">
            {activeTool === 'workbench' && (
              <>
                <TopicSpecificLabRenderer topic={activeTopic} langMode={langMode} />
                {isAcWaveformTopic && (
                  <div className="pt-2">
                    <DualChannelOscilloscope
                      langMode={langMode}
                      defaultMode={activeTopic.num === '18' ? 'full_bridge' : activeTopic.num === '19b' ? 'bjt_ce_amp' : 'half_wave'}
                    />
                  </div>
                )}
              </>
            )}

            {activeTool === 'breadboard' && (
              <InteractiveBreadboardBuilder langMode={langMode} />
            )}

            {activeTool === 'lattice3d' && (
              <CrystalLattice3D
                langMode={langMode}
                initialDoping={activeTopic.num === '4' ? 'p_type' : activeTopic.num === '5' ? 'n_type' : 'pure'}
              />
            )}

            {activeTool === 'oscilloscope' && (
              <DualChannelOscilloscope
                langMode={langMode}
                defaultMode={activeTopic.num === '18' ? 'full_bridge' : activeTopic.num === '19b' ? 'bjt_ce_amp' : 'half_wave'}
              />
            )}

            {activeTool === 'spice' && (
              <SpiceNetlistInspector
                langMode={langMode}
                defaultType={activeTopic.num === '15' ? 'zener_regulator' : activeTopic.num === '19b' ? 'bjt_ce_amp' : 'diode_half_wave'}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
