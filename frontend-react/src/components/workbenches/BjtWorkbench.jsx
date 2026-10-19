import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, RefreshCw, Sparkles, Pause, Play, ShieldAlert,
  Cpu, Zap, Sliders, Layers, Scissors, Flame
} from 'lucide-react';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';

export default function BjtWorkbench({ topic, langMode = 'dual', isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('swapper'); // 'swapper' | 'variables' | 'faults'
  const [isOpen, setIsOpen] = useState(true);
  const [isSimRunning, setIsSimRunning] = useState(true);

  // BJT state
  const [bjtType, setBjtType] = useState('NPN'); // 'NPN' | 'PNP'
  const [varBeta, setVarBeta] = useState(150); // 50 to 350
  const [varIbUa, setVarIbUa] = useState(30); // 0 to 100 uA
  const [vccVal, setVccVal] = useState(12); // 5 to 20 V
  const [rcVal, setRcVal] = useState(1800); // 500 to 5000 ohms
  const [activeFault, setActiveFault] = useState(null); // 'base_open' | 'saturation_clip' | 'thermal_runaway' | null

  // Animation ticker for oscilloscope and carrier flow
  const [animTime, setAnimTime] = useState(0);

  useEffect(() => {
    if (!isSimRunning) return;
    let animId;
    let lastTs = performance.now();
    const loop = (ts) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      setAnimTime((t) => (t + dt * 4.0) % 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isSimRunning]);

  const eli5 = ELI5_TOPIC_DATA[topic?.num] || ELI5_TOPIC_DATA['16'] || ELI5_TOPIC_DATA['0'];

  // Physics calculation
  const physics = useMemo(() => {
    let effectiveBeta = activeFault === 'thermal_runaway' ? varBeta * 2.2 : varBeta;
    let effectiveIb = activeFault === 'base_open' ? 0 : activeFault === 'saturation_clip' ? 120 : varIbUa; // uA

    const ibMa = effectiveIb / 1000;
    const icActive = ibMa * effectiveBeta; // mA
    const icSat = (vccVal - 0.2) / (rcVal / 1000); // mA

    let ic = 0;
    let vce = vccVal;
    let mode = 'CUTOFF (Open Switch)';

    if (effectiveIb <= 0.05) {
      ic = 0;
      vce = vccVal;
      mode = 'CUTOFF (Open Switch)';
    } else if (icActive >= icSat) {
      ic = icSat;
      vce = 0.2;
      mode = 'SATURATION (Closed Switch)';
    } else {
      ic = icActive;
      vce = Math.max(0.2, vccVal - (ic * rcVal / 1000));
      mode = 'ACTIVE REGION (Linear Amplifier)';
    }

    const ieMa = ibMa + ic;
    const gainAv = mode.includes('ACTIVE') ? -(ic * 1000 / 26) * (rcVal / 1000) : 0;

    return {
      effectiveBeta,
      effectiveIb,
      ic,
      vce,
      ieMa,
      gainAv: Math.abs(gainAv).toFixed(0),
      mode,
      isSaturated: mode.includes('SATURATION'),
      isCutoff: mode.includes('CUTOFF')
    };
  }, [bjtType, varBeta, varIbUa, vccVal, rcVal, activeFault]);

  const resetAll = () => {
    setBjtType('NPN');
    setVarBeta(150);
    setVarIbUa(30);
    setVccVal(12);
    setRcVal(1800);
    setActiveFault(null);
  };

  // Oscilloscope traces (Input vs Inverted Output)
  const scopeWidth = 520;
  const scopeHeight = 180;
  const midY = scopeHeight / 2;

  const { pathVin, pathVout } = useMemo(() => {
    let pVin = '';
    let pVout = '';
    const numCycles = 2.5;

    for (let x = 0; x <= scopeWidth; x += 4) {
      const theta = (x / scopeWidth) * (numCycles * 2 * Math.PI) - animTime;
      const sinVal = Math.sin(theta);

      // Vin: small AC input signal (±20mV scaled)
      const yVin = midY - sinVal * 28;
      if (x === 0) pVin += `M ${x} ${yVin}`;
      else pVin += ` L ${x} ${yVin}`;

      // Vout: 180 degree inverted amplified output signal
      let amplifiedSin = -sinVal; // 180 degree phase inversion
      let vOutScale = 55;

      if (physics.isCutoff) {
        amplifiedSin = 0;
      } else if (physics.isSaturated) {
        // Flat top clipped
        amplifiedSin = Math.max(-0.25, Math.min(0.25, amplifiedSin * 2.5));
      }

      const yVout = midY - amplifiedSin * vOutScale;
      if (x === 0) pVout += `M ${x} ${yVout}`;
      else pVout += ` L ${x} ${yVout}`;
    }

    return { pathVin: pVin, pathVout: pVout };
  }, [animTime, physics]);

  return (
    <div className={`bg-white dark:bg-slate-900 border ${isEmbedded ? 'border-purple-300 dark:border-purple-800 rounded-2xl' : 'border-2 border-purple-300 dark:border-purple-800 rounded-2xl shadow-lg'} p-3.5 sm:p-5 space-y-4 transition-colors w-full max-w-full overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-md">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{langMode === 'bn' ? 'বিজেটি ট্রানজিস্টর ও অ্যাম্প্লিফায়ার ল্যাব' : 'BJT Transistor & Common-Emitter Amplifier Workbench'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold">
                🔬 TOPIC #{topic.num} EXPERIMENT
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'বেস কারেন্ট দিয়ে কালেক্টর কারেন্ট নিয়ন্ত্রণ (I_C = β·I_B), অ্যাম্প্লিফিকেশন এবং ১৮০° ফেজ ইনভার্সন।'
                : 'Current amplification (I_C = β·I_B), active/saturation/cutoff states & 180° phase inversion.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimRunning(!isSimRunning)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              isSimRunning ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-emerald-600 text-white'
            }`}
          >
            {isSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSimRunning ? 'Pause' : 'Run'}</span>
          </button>
          <button
            onClick={resetAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{langMode === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold"
          >
            {isOpen ? 'Minimize ▲' : 'Expand ▼'}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Multi-Meter HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Base Current Ib */}
        <div className="bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-400 block">
            {langMode === 'bn' ? 'বেস কারেন্ট (I_B)' : 'Base Input (I_B)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-purple-900 dark:text-purple-200">
              {physics.effectiveIb.toFixed(1)}
            </span>
            <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">μA</span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 block">
            Control Lever Pin
          </span>
        </div>

        {/* Collector Current Ic */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
            {langMode === 'bn' ? 'কালেক্টর কারেন্ট (I_C)' : 'Collector Output (I_C)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-emerald-900 dark:text-emerald-200">
              {physics.ic.toFixed(2)}
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">mA</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
            I_C = β · I_B
          </span>
        </div>

        {/* Current Gain Beta */}
        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-400 block">
            {langMode === 'bn' ? 'কারেন্ট গেইন (β)' : 'Current Gain (β / hFE)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-sky-900 dark:text-sky-200">
              {physics.effectiveBeta.toFixed(0)}
            </span>
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-mono">
            Multiplier Ratio
          </span>
        </div>

        {/* VCE Voltage */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">
            {langMode === 'bn' ? 'ভোল্টেজ (V_CE)' : 'Collector-Emitter (V_CE)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-amber-900 dark:text-amber-200">
              {physics.vce.toFixed(2)}
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">
            V_CC - I_C·R_C
          </span>
        </div>

        {/* Voltage Gain Av */}
        <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 block">
            {langMode === 'bn' ? 'ভোল্টেজ গেইন (A_v)' : 'Voltage Gain (A_v)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-rose-900 dark:text-rose-200">
              {physics.gainAv}×
            </span>
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 block">
            180° Inverted Output
          </span>
        </div>

        {/* Operating Region */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
            {langMode === 'bn' ? 'অপারেটিং মোড' : 'Operating State'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 truncate">
              {physics.mode.split(' ')[0]}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
            {physics.mode}
          </span>
        </div>
      </div>

      {/* Experiment Deck: Schematic + Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Common Emitter Schematic */}
        <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 px-1">
            <span className="font-bold text-slate-200">
              Common-Emitter (CE) NPN Amplifier Circuit
            </span>
            <span className="font-mono text-[10px] text-purple-400">
              {physics.mode}
            </span>
          </div>

          <div className="relative w-full aspect-[520/200] my-2">
            <svg viewBox="0 0 520 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* Supply rail VCC */}
              <line x1="330" y1="20" x2="400" y2="20" stroke="#ef4444" strokeWidth="2.5" />
              <text x="365" y="15" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">+V_CC ({vccVal}V)</text>

              {/* Collector Resistor R_C */}
              <line x1="365" y1="20" x2="365" y2="40" stroke="#38bdf8" strokeWidth="2.5" />
              <path d="M 365 40 L 358 45 L 372 55 L 358 65 L 372 75 L 365 80" stroke="#f59e0b" strokeWidth="3" fill="none" />
              <text x="400" y="65" fill="#fbbf24" fontSize="10" fontWeight="bold">R_C={rcVal}Ω</text>
              <line x1="365" y1="80" x2="365" y2="100" stroke="#38bdf8" strokeWidth="2.5" />

              {/* BJT Transistor Symbol */}
              <g transform="translate(330, 115)">
                {/* Transistor Circle */}
                <circle cx="20" cy="0" r="26" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                {/* Base bar */}
                <line x1="12" y1="-16" x2="12" y2="16" stroke="#f8fafc" strokeWidth="3.5" />
                {/* Base lead */}
                <line x1="-30" y1="0" x2="12" y2="0" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="-15" y="-6" fill="#a7f3d0" fontSize="9" fontWeight="bold">Base (B)</text>

                {/* Collector lead */}
                <line x1="12" y1="-8" x2="35" y2="-18" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="35" y1="-18" x2="35" y2="-35" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="48" y="-20" fill="#7dd3fc" fontSize="9" fontWeight="bold">Collector (C)</text>

                {/* Emitter lead with NPN arrow pointing OUT */}
                <line x1="12" y1="8" x2="35" y2="18" stroke="#38bdf8" strokeWidth="2.5" />
                <polygon points="28,14 36,19 32,10" fill="#38bdf8" />
                <line x1="35" y1="18" x2="35" y2="45" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="48" y="32" fill="#7dd3fc" fontSize="9" fontWeight="bold">Emitter (E)</text>
              </g>

              {/* Ground connection */}
              <line x1="365" y1="160" x2="365" y2="180" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="350" y1="180" x2="380" y2="180" stroke="#94a3b8" strokeWidth="3" />
              <line x1="356" y1="185" x2="374" y2="185" stroke="#94a3b8" strokeWidth="2" />
              <line x1="362" y1="190" x2="368" y2="190" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Input AC source */}
              <g transform="translate(140, 115)">
                <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <path d="M -10 0 Q -5 -8 0 0 Q 5 8 10 0" stroke="#f59e0b" strokeWidth="2" fill="none" />
                <line x1="18" y1="0" x2="160" y2="0" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="0" y="30" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">v_in (AC)</text>
              </g>

              {/* Animated Electrons passing into Collector */}
              {physics.ic > 0.05 && (
                <g>
                  {[0, 1, 2].map((i) => (
                    <circle
                      key={i}
                      cx={365}
                      cy={160 - ((animTime * 35 + i * 25) % 80)}
                      r="3.5"
                      fill="#38bdf8"
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>Base Current I_B = {physics.effectiveIb} μA</span>
            <span className="font-mono text-emerald-400 font-bold">Collector Current I_C = {physics.ic.toFixed(2)} mA</span>
          </div>
        </div>

        {/* Dual-Trace Oscilloscope: 180 Degree Inversion */}
        <div className="bg-[#071610] rounded-2xl p-3 border-2 border-emerald-950 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-900/60 px-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold text-amber-400">CH1: v_in (Base Signal)</span>
              <span className="font-mono text-[11px] font-bold text-emerald-400">CH2: v_out (Inverted {physics.gainAv}×)</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-500 font-bold">180° PHASE SHIFT</span>
          </div>

          <div className="relative w-full aspect-[520/180] my-auto bg-[#040e0a] rounded-xl border border-emerald-900/80 overflow-hidden shadow-inner">
            <svg viewBox={`0 0 ${scopeWidth} ${scopeHeight}`} className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Reticle */}
              {[...Array(11)].map((_, i) => (
                <line key={`v-${i}`} x1={(scopeWidth / 10) * i} y1="0" x2={(scopeWidth / 10) * i} y2={scopeHeight} stroke="#064e3b" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
              ))}
              {[...Array(9)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={(scopeHeight / 8) * i} x2={scopeWidth} y2={(scopeHeight / 8) * i} stroke="#064e3b" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
              ))}
              <line x1="0" y1={midY} x2={scopeWidth} y2={midY} stroke="#047857" strokeWidth="1.5" opacity="0.8" />

              {/* Trace 1: Vin (Amber) */}
              <path d={pathVin} fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8" />

              {/* Trace 2: Vout (Inverted Green) */}
              <path d={pathVout} fill="none" stroke="#10b981" strokeWidth="3" />
            </svg>

            <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              {physics.isSaturated ? '⚠️ Saturation Clipping' : physics.isCutoff ? '⚠️ Cutoff (Zero Output)' : '✅ Linear 180° Inverted Gain'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-400/90 bg-[#04120c] px-2.5 py-1.5 rounded-lg border border-emerald-950 mt-2">
            <span>
              {physics.isSaturated
                ? 'Saturation: V_CE reaches 0.2V floor; output flat-tops.'
                : 'Common-Emitter Inversion: As Base voltage rises, Collector voltage drops!'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'swapper', labelEn: '🔄 BJT Biasing & Transistor Creator', labelBn: '🔄 ট্রানজিস্টর ও বায়াসিং নিয়ন্ত্রণ' },
              { id: 'variables', labelEn: '🎛️ Live Math: I_C = β·I_B', labelBn: '🎛️ সূত্র: I_C = β·I_B' },
              { id: 'faults', labelEn: '⚡ Extreme Tests & Faults', labelBn: '⚡ স্যাচুরেশন ও ফ্যান্টাসি টেস্ট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {langMode === 'bn' ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          {activeTab === 'swapper' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {/* Beta Slider */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-500" />
                  {langMode === 'bn' ? 'কারেন্ট গেইন (β / hFE):' : 'Current Gain (β / hFE):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="50"
                    max="350"
                    step="10"
                    value={varBeta}
                    onChange={(e) => setVarBeta(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold text-xs">{varBeta}</span>
                </div>
              </div>

              {/* Base Current Slider */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  {langMode === 'bn' ? 'বেস ইনপুট কারেন্ট (I_B):' : 'Base Input Bias (I_B):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="2"
                    value={varIbUa}
                    onChange={(e) => setVarIbUa(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-xs">{varIbUa}μA</span>
                </div>
              </div>

              {/* Collector Resistor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  {langMode === 'bn' ? 'কালেক্টর লোড রোধ (R_C):' : 'Collector Load Resistor (R_C):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="100"
                    value={rcVal}
                    onChange={(e) => setRcVal(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">{rcVal}Ω</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                I_C = β · I_B  =  {physics.effectiveBeta} × {physics.effectiveIb} μA  =  {physics.ic.toFixed(2)} mA
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
              </p>
            </div>
          )}

          {activeTab === 'faults' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'base_open', title: '✂️ Disconnect Base (I_B = 0)', desc: 'Cutoff mode: Zero current flows into Collector (I_C = 0, V_CE = V_CC).' },
                { id: 'saturation_clip', title: '💥 Base Overdrive Saturation', desc: 'Excessive base current forces transistor into saturation: V_CE collapses to 0.2V.' },
                { id: null, title: '✅ Nominal Linear Region', desc: 'Restore standard linear Common-Emitter amplification.' }
              ].map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFault(f.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    activeFault === f.id ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 ring-1 ring-rose-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-white block">{f.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">{f.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
