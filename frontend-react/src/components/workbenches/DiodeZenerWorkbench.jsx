import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, RefreshCw, Sparkles, Pause, Play, ShieldAlert,
  Zap, Cpu, Sliders, Layers, AlertTriangle, Radio
} from 'lucide-react';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';

export default function DiodeZenerWorkbench({ topic, langMode = 'dual', isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('swapper'); // 'swapper' | 'variables' | 'faults'
  const [isOpen, setIsOpen] = useState(true);
  const [isSimRunning, setIsSimRunning] = useState(true);

  // Diode / Zener state
  const isZenerTopic = topic?.num === '13' || topic?.num === '15';
  const [diodeModel, setDiodeModel] = useState(isZenerTopic ? 'zener_5v1' : 'si_1n4007');
  const [vinDc, setVinDc] = useState(14.0); // 4 to 28 V
  const [hasAcNoise, setHasAcNoise] = useState(true); // AC line fluctuation
  const [rsVal, setRsVal] = useState(330); // ohms
  const [rlVal, setRlVal] = useState(1000); // ohms
  const [activeFault, setActiveFault] = useState(null); // 'undervoltage_dropout' | 'zener_burnout' | 'load_open' | null

  // Animation ticker
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

  const eli5 = ELI5_TOPIC_DATA[topic?.num] || ELI5_TOPIC_DATA['15'] || ELI5_TOPIC_DATA['0'];

  // Physics calculation
  const physics = useMemo(() => {
    let vz = 5.1;
    let isZener = true;
    let forwardDrop = 0.7;

    if (diodeModel === 'zener_5v1') {
      vz = 5.1;
    } else if (diodeModel === 'zener_9v1') {
      vz = 9.1;
    } else if (diodeModel === 'zener_12v') {
      vz = 12.0;
    } else if (diodeModel === 'si_1n4007') {
      vz = 999; // Standard rectifier - no reverse breakdown regulation
      isZener = false;
    } else if (diodeModel === 'ge_1n34') {
      vz = 999;
      isZener = false;
      forwardDrop = 0.3;
    }

    const effectiveVin = activeFault === 'undervoltage_dropout' ? Math.min(vz - 1.5, 3.5) : vinDc;
    const effectiveRl = activeFault === 'load_open' ? 1e7 : rlVal;

    // Voltage divider with no zener
    const vNoZener = effectiveVin * (effectiveRl / (rsVal + effectiveRl));

    let vOut = 0;
    let izMa = 0;
    let ilMa = 0;
    let isMa = 0;
    let status = 'REGULATING (Output Locked)';

    if (activeFault === 'zener_burnout') {
      vOut = 0;
      status = '💥 ZENER SHORTED TO GROUND (V_out = 0V)';
    } else if (isZener && vNoZener >= vz) {
      // Zener in breakdown regulation: V_out locked at V_Z
      vOut = vz;
      ilMa = (vOut / effectiveRl) * 1000;
      isMa = ((effectiveVin - vOut) / rsVal) * 1000;
      izMa = Math.max(0, isMa - ilMa);
      status = '✅ REGULATING STABLE (V_L = V_Z)';
    } else {
      // Below breakdown: Zener is off, acts as open circuit
      vOut = vNoZener;
      ilMa = (vOut / effectiveRl) * 1000;
      isMa = ilMa;
      izMa = 0;
      status = isZener ? '⚠️ UNREGULATED DROPOUT (V_in < V_Z)' : 'Standard Diode (Reverse Blocking)';
    }

    const pzMw = izMa * vOut;

    return {
      vz,
      isZener,
      forwardDrop,
      effectiveVin,
      vOut,
      izMa,
      ilMa,
      isMa,
      pzMw,
      status
    };
  }, [diodeModel, vinDc, rsVal, rlVal, activeFault]);

  const resetAll = () => {
    setDiodeModel(isZenerTopic ? 'zener_5v1' : 'si_1n4007');
    setVinDc(14.0);
    setHasAcNoise(true);
    setRsVal(330);
    setRlVal(1000);
    setActiveFault(null);
  };

  // Oscilloscope waveform calculation
  const scopeWidth = 520;
  const scopeHeight = 180;
  const midY = scopeHeight / 2;

  const { pathVin, pathVout } = useMemo(() => {
    let pVin = '';
    let pVout = '';
    const numCycles = 2.5;

    for (let x = 0; x <= scopeWidth; x += 4) {
      const theta = (x / scopeWidth) * (numCycles * 2 * Math.PI) - animTime;
      const noise = hasAcNoise ? Math.sin(theta * 3) * 1.8 : 0;
      const instantVin = physics.effectiveVin + noise;

      // Scale: 20V maps to scope height
      const yVin = 150 - (instantVin / 25) * 130;
      if (x === 0) pVin += `M ${x} ${yVin}`;
      else pVin += ` L ${x} ${yVin}`;

      // Vout waveform: rock solid flat when regulating, or follows noise when in dropout
      let instantVout = physics.vOut;
      if (physics.status.includes('DROPOUT')) {
        instantVout = instantVin * (rlVal / (rsVal + rlVal));
      }

      const yVout = 150 - (instantVout / 25) * 130;
      if (x === 0) pVout += `M ${x} ${yVout}`;
      else pVout += ` L ${x} ${yVout}`;
    }

    return { pathVin: pVin, pathVout: pVout };
  }, [animTime, physics, hasAcNoise, rlVal, rsVal]);

  return (
    <div className={`bg-white dark:bg-slate-900 border ${isEmbedded ? 'border-indigo-300 dark:border-indigo-800 rounded-2xl' : 'border-2 border-indigo-300 dark:border-indigo-800 rounded-2xl shadow-lg'} p-3.5 sm:p-5 space-y-4 transition-colors w-full max-w-full overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{langMode === 'bn' ? 'ডায়োড ও জেনার ভোল্টেজ রেগুলেটর ল্যাব' : 'Diode & Zener Shunt Voltage Regulator Lab'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
                🔬 TOPIC #{topic.num} EXPERIMENT
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'জেনার ডায়োড ব্রেকডাউন ভোল্টেজ (V_Z) ব্যবহার করে অস্থির ইনপুট থেকে সম্পূর্ণ স্থির আউটপুট পাওয়ার পরীক্ষা।'
                : 'Zener reverse breakdown stabilization: locks output voltage despite noisy unregulated input.'}
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
            className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
          >
            {isOpen ? 'Minimize ▲' : 'Expand ▼'}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Multi-Meter HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Vin */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">
            {langMode === 'bn' ? 'অস্থির ইনপুট (V_in)' : 'Unregulated Input'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-amber-900 dark:text-amber-200">
              {physics.effectiveVin.toFixed(1)}
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">
            {hasAcNoise ? '〰️ Noisy Fluctuating Rail' : 'Clean DC'}
          </span>
        </div>

        {/* Vout Stabilized */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
            {langMode === 'bn' ? 'স্থির আউটপুট (V_out)' : 'Stabilized Output (V_L)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-emerald-900 dark:text-emerald-200">
              {physics.vOut.toFixed(2)}
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
            Target V_Z = {physics.vz}V
          </span>
        </div>

        {/* Zener Current IZ */}
        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-400 block">
            {langMode === 'bn' ? 'জেনার কারেন্ট (I_Z)' : 'Zener Shunt (I_Z)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-sky-900 dark:text-sky-200">
              {physics.izMa.toFixed(1)}
            </span>
            <span className="font-mono text-sky-700 dark:text-sky-400 font-bold">mA</span>
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 block">
            P_Z = {physics.pzMw.toFixed(0)} mW
          </span>
        </div>

        {/* Load Current IL */}
        <div className="bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-400 block">
            {langMode === 'bn' ? 'লোড কারেন্ট (I_L)' : 'Load Current (I_L)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-purple-900 dark:text-purple-200">
              {physics.ilMa.toFixed(1)}
            </span>
            <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">mA</span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-mono">
            R_L = {rlVal} Ω
          </span>
        </div>

        {/* Series Current IS */}
        <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 block">
            {langMode === 'bn' ? 'মোট কারেন্ট (I_S)' : 'Total Series (I_S)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-rose-900 dark:text-rose-200">
              {physics.isMa.toFixed(1)}
            </span>
            <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">mA</span>
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-mono">
            I_S = I_Z + I_L
          </span>
        </div>

        {/* Regulation State */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
            {langMode === 'bn' ? 'রেগুলেশন অবস্থা' : 'Regulation Mode'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 truncate">
              {physics.status.split(' ')[0]}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
            {physics.status}
          </span>
        </div>
      </div>

      {/* Experiment Deck: Schematic + Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Zener Shunt Regulator Schematic */}
        <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 px-1">
            <span className="font-bold text-slate-200">
              Zener Shunt Voltage Regulator Circuit
            </span>
            <span className="font-mono text-[10px] text-emerald-400">
              {physics.status}
            </span>
          </div>

          <div className="relative w-full aspect-[520/200] my-2">
            <svg viewBox="0 0 520 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* DC Input Source (60, 110) */}
              <g transform="translate(60, 110)">
                <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
                <text x="0" y="4" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">{physics.effectiveVin.toFixed(0)}V</text>
                <line x1="0" y1="-22" x2="0" y2="-60" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="0" y1="22" x2="0" y2="60" stroke="#38bdf8" strokeWidth="2.5" />
              </g>

              {/* Wire to series resistor RS */}
              <line x1="60" y1="50" x2="140" y2="50" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Resistor RS */}
              <path d="M 140 50 L 148 42 L 156 58 L 164 42 L 172 58 L 180 50" stroke="#a855f7" strokeWidth="3" fill="none" />
              <text x="160" y="32" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle">R_S={rsVal}Ω</text>
              <line x1="180" y1="50" x2="280" y2="50" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Node at (280, 50) */}
              <circle cx="280" cy="50" r="4" fill="#38bdf8" />
              <text x="280" y="40" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">I_S={physics.isMa.toFixed(0)}mA</text>

              {/* Reverse Zener Diode branch at x=280 */}
              <line x1="280" y1="50" x2="280" y2="80" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Zener Symbol (Cathode points UP towards positive rail!) */}
              <g transform="translate(280, 105)">
                <polygon points="-14,14 14,14 0,-14" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
                {/* Zener Cathode bent wings */}
                <line x1="-16" y1="-14" x2="16" y2="-14" stroke="#e0f2fe" strokeWidth="3" />
                <line x1="-16" y1="-14" x2="-16" y2="-8" stroke="#e0f2fe" strokeWidth="3" />
                <line x1="16" y1="-14" x2="16" y2="-20" stroke="#e0f2fe" strokeWidth="3" />
                <text x="25" y="0" fill="#a7f3d0" fontSize="10" fontWeight="bold">V_Z={physics.vz}V</text>
                <text x="25" y="14" fill="#6ee7b7" fontSize="9">I_Z={physics.izMa.toFixed(1)}mA</text>
              </g>
              <line x1="280" y1="125" x2="280" y2="170" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="280" cy="170" r="4" fill="#38bdf8" />

              {/* Wire to Load RL at x=420 */}
              <line x1="280" y1="50" x2="420" y2="50" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="420" cy="50" r="4" fill="#38bdf8" />
              <line x1="420" y1="50" x2="420" y2="80" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Load Resistor RL */}
              <path d="M 420 80 L 412 88 L 428 98 L 412 108 L 428 118 L 420 126" stroke="#f59e0b" strokeWidth="3" fill="none" />
              <text x="445" y="105" fill="#fbbf24" fontSize="10" fontWeight="bold">R_L={rlVal}Ω</text>
              <text x="445" y="120" fill="#94a3b8" fontSize="9">V_L={physics.vOut.toFixed(1)}V</text>
              <line x1="420" y1="126" x2="420" y2="170" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="420" cy="170" r="4" fill="#38bdf8" />

              {/* Bottom return wire */}
              <line x1="420" y1="170" x2="60" y2="170" stroke="#38bdf8" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>Input: {physics.effectiveVin.toFixed(1)}V</span>
            <span className="font-mono text-emerald-400 font-bold">Stabilized Load Output: {physics.vOut.toFixed(2)} V</span>
          </div>
        </div>

        {/* Oscilloscope: Noise Rejection Display */}
        <div className="bg-[#071610] rounded-2xl p-3 border-2 border-emerald-950 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-900/60 px-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold text-amber-400">CH1: V_in (Noisy Input Rail)</span>
              <span className="font-mono text-[11px] font-bold text-emerald-400">CH2: V_out (Stabilized DC)</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-500 font-bold">LINE REGULATION</span>
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

              {/* Trace 1: Vin Noisy Rail (Amber) */}
              <path d={pathVin} fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.75" />

              {/* Trace 2: Vout Stabilized Line (Neon Green) */}
              <path d={pathVout} fill="none" stroke="#10b981" strokeWidth="3.2" />
            </svg>

            <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              V_out = {physics.vOut.toFixed(2)} V (Zero Ripple)
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-400/90 bg-[#04120c] px-2.5 py-1.5 rounded-lg border border-emerald-950 mt-2">
            <span>
              Line Regulation: Input fluctuates with ±1.8V ripple, but Zener holds output constant at {physics.vz}V!
            </span>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'swapper', labelEn: '🔄 Zener Voltage & Line Voltage', labelBn: '🔄 জেনার মডেল ও ইনপুট ভোল্টেজ' },
              { id: 'variables', labelEn: '🎛️ Live Math: V_out = V_Z', labelBn: '🎛️ রেগুলেশন সমীকরণ' },
              { id: 'faults', labelEn: '⚡ Dropout & Fault Scenarios', labelBn: '⚡ ড্রপআউট ও ফ্যান্টাসি টেস্ট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {langMode === 'bn' ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          {activeTab === 'swapper' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {/* Diode / Zener Model */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  {langMode === 'bn' ? 'ডায়োড / জেনার মডেল:' : 'Diode / Zener Model:'}
                </label>
                <select
                  value={diodeModel}
                  onChange={(e) => setDiodeModel(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="zener_5v1">1N4733 (5.1V Zener Diode)</option>
                  <option value="zener_9v1">1N4739 (9.1V Zener Diode)</option>
                  <option value="zener_12v">1N4742 (12.0V Zener Diode)</option>
                  <option value="si_1n4007">1N4007 Silicon Rectifier (No Breakdown Reg)</option>
                  <option value="ge_1n34">1N34 Germanium Diode (0.3V Forward)</option>
                </select>
              </div>

              {/* Input Voltage Slider */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {langMode === 'bn' ? 'অস্থির ইনপুট ভোল্টেজ (V_in):' : 'Unregulated Input (V_in):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="4"
                    max="26"
                    step="0.5"
                    value={vinDc}
                    onChange={(e) => setVinDc(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs">{vinDc}V</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={hasAcNoise}
                    onChange={(e) => setHasAcNoise(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Inject ±1.8V AC Line Noise Ripple</span>
                </label>
              </div>

              {/* Load Resistor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  {langMode === 'bn' ? 'লোড রোধক (R_L):' : 'Load Resistor (R_L):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="200"
                    max="4000"
                    step="100"
                    value={rlVal}
                    onChange={(e) => setRlVal(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">{rlVal}Ω</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                V_out = V_Z ({physics.vz}V)  •  I_S = I_Z + I_L  •  P_Z = {physics.pzMw.toFixed(0)} mW
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
              </p>
            </div>
          )}

          {activeTab === 'faults' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'undervoltage_dropout', title: '⚠️ Undervoltage Dropout', desc: 'V_in drops below V_Z: Zener turns off, output falls out of regulation.' },
                { id: 'zener_burnout', title: '💥 Zener Power Overload', desc: 'Excessive current burns out the Zener: diode shorts, V_out drops to 0V.' },
                { id: null, title: '✅ Regulating Nominal', desc: 'Restore standard stabilized Zener shunt voltage regulation.' }
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
