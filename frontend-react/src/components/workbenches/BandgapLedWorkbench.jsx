import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, RefreshCw, Sparkles, Pause, Play, ShieldAlert,
  Sun, Zap, Layers, Cpu, Flame, Snowflake, ArrowDown
} from 'lucide-react';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';

export default function BandgapLedWorkbench({ topic, langMode = 'dual', isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('swapper'); // 'swapper' | 'variables' | 'faults'
  const [isOpen, setIsOpen] = useState(true);
  const [isSimRunning, setIsSimRunning] = useState(true);

  // Optoelectronic states
  const defaultMat = topic?.num === '8' ? 'Si' : 'InGaN_Blue';
  const [material, setMaterial] = useState(defaultMat);
  const [driveCurrentMa, setDriveCurrentMa] = useState(20); // 0 to 50 mA
  const [seriesR, setSeriesR] = useState(330); // ohms
  const [supplyV, setSupplyV] = useState(5.0); // V
  const [activeFault, setActiveFault] = useState(null); // 'overcurrent' | 'liquid_n2' | 'reverse_bias' | null

  // Animation ticker for photon radiation waves
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

  const eli5 = ELI5_TOPIC_DATA[topic?.num] || ELI5_TOPIC_DATA['7'] || ELI5_TOPIC_DATA['0'];

  // Physics calculation
  const physics = useMemo(() => {
    let egBase = 2.70;
    let isDirect = true;
    let colorName = 'Royal Blue';
    let hexColor = '#3b82f6';

    if (material === 'GaAs_IR') {
      egBase = 1.42;
      isDirect = true;
      colorName = 'Infrared (873 nm)';
      hexColor = '#991b1b';
    } else if (material === 'AlGaAs_Red') {
      egBase = 1.88;
      isDirect = true;
      colorName = 'Bright Red (660 nm)';
      hexColor = '#ef4444';
    } else if (material === 'AlGaInP_Amber') {
      egBase = 2.10;
      isDirect = true;
      colorName = 'Amber / Yellow (590 nm)';
      hexColor = '#f59e0b';
    } else if (material === 'InGaN_Green') {
      egBase = 2.34;
      isDirect = true;
      colorName = 'Emerald Green (530 nm)';
      hexColor = '#10b981';
    } else if (material === 'InGaN_Blue') {
      egBase = 2.70;
      isDirect = true;
      colorName = 'Royal Blue (460 nm)';
      hexColor = '#3b82f6';
    } else if (material === 'GaN_UV') {
      egBase = 3.40;
      isDirect = true;
      colorName = 'Ultraviolet (365 nm)';
      hexColor = '#8b5cf6';
    } else if (material === 'Si') {
      egBase = 1.12;
      isDirect = false;
      colorName = 'No Light (Indirect Heat Phonons)';
      hexColor = '#64748b';
    } else if (material === 'Ge') {
      egBase = 0.67;
      isDirect = false;
      colorName = 'No Light (Indirect Heat Phonons)';
      hexColor = '#475569';
    }

    // Liquid N2 cooling increases bandgap by ~0.15 eV
    let eg = activeFault === 'liquid_n2' ? egBase + 0.20 : egBase;
    const lambdaNm = (1240 / eg).toFixed(0);
    const vfKnee = (eg * 0.95).toFixed(2); // forward knee roughly proportional to bandgap

    // Effective Current
    let current = driveCurrentMa;
    let isEmitting = isDirect && current > 1.0;

    if (activeFault === 'overcurrent') {
      current = 0;
      isEmitting = false;
    } else if (activeFault === 'reverse_bias') {
      current = 0;
      isEmitting = false;
    }

    const efficiency = isDirect ? 95 : 0.05;
    const luxOutput = isEmitting ? (current * (isDirect ? 18 : 0)).toFixed(0) : 0;

    return {
      eg,
      isDirect,
      colorName,
      hexColor,
      lambdaNm,
      vfKnee,
      current,
      isEmitting,
      efficiency,
      luxOutput
    };
  }, [material, driveCurrentMa, activeFault]);

  const resetAll = () => {
    setMaterial(defaultMat);
    setDriveCurrentMa(20);
    setSeriesR(330);
    setSupplyV(5.0);
    setActiveFault(null);
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border ${isEmbedded ? 'border-amber-300 dark:border-amber-800 rounded-2xl' : 'border-2 border-amber-300 dark:border-amber-800 rounded-2xl shadow-lg'} p-3.5 sm:p-5 space-y-4 transition-colors w-full max-w-full overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 dark:border-amber-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Sun className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{langMode === 'bn' ? 'অপটোইলেকট্রনিক ব্যান্ডগ্যাপ ও এলইডি স্পেকট্রাম ওয়ার্কবেঞ্চ' : 'Optoelectronic Bandgap & LED Spectrum Synthesizer'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono font-bold">
                🔬 TOPIC #{topic.num} EXPERIMENT
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'ডাইরেক্ট vs ইনডাইরেক্ট ব্যান্ডগ্যাপ ট্রানজিশন, ফোটন নির্গমন এবং λ = ১২৪০/Eg সূত্রের বাস্তব পরীক্ষা।'
                : 'Direct vs Indirect bandgap transitions, radiative recombination & photon emission (λ = 1240 / Eg).'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimRunning(!isSimRunning)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              isSimRunning
                ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
            className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold"
          >
            {isOpen ? 'Minimize ▲' : 'Expand ▼'}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Multi-Meter HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Bandgap Energy Eg */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">
            {langMode === 'bn' ? 'ব্যান্ডগ্যাপ শক্তি (E_g)' : 'Bandgap Energy (E_g)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-amber-900 dark:text-amber-200">
              {physics.eg.toFixed(2)}
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">eV</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">
            {physics.isDirect ? 'Direct Gap (Radiative)' : 'Indirect (Phonon Heat)'}
          </span>
        </div>

        {/* Wavelength lambda */}
        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-400 block">
            {langMode === 'bn' ? 'তরঙ্গদৈর্ঘ্য (λ)' : 'Wavelength (λ)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-sky-900 dark:text-sky-200">
              {physics.isDirect ? `${physics.lambdaNm} nm` : 'None (Heat)'}
            </span>
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 block truncate">
            λ = 1240 / E_g
          </span>
        </div>

        {/* Forward Knee Drop VF */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
            {langMode === 'bn' ? 'ফরওয়ার্ড ড্রপ (V_F)' : 'Forward Drop (V_F)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-emerald-900 dark:text-emerald-200">
              {physics.vfKnee}
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
            V_F ≈ E_g / q
          </span>
        </div>

        {/* Drive Current */}
        <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-indigo-800 dark:text-indigo-400 block">
            {langMode === 'bn' ? 'ড্রাইভ কারেন্ট (I_F)' : 'Drive Current (I_F)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-indigo-900 dark:text-indigo-200">
              {physics.current}
            </span>
            <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">mA</span>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block">
            {activeFault === 'overcurrent' ? '💥 FUSED OPEN' : 'Safe Operating Area'}
          </span>
        </div>

        {/* Luminous Flux */}
        <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 block">
            {langMode === 'bn' ? 'আলোক তীব্রতা' : 'Luminous Flux'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-rose-900 dark:text-rose-200">
              {physics.luxOutput}
            </span>
            <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">mcd</span>
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 block">
            {physics.isEmitting ? 'Glowing Bright' : 'Zero Emission'}
          </span>
        </div>

        {/* Emission Color */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
            {langMode === 'bn' ? 'নিঃসৃত বর্ণ' : 'Emission Spectrum'}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: physics.hexColor }}></span>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {physics.colorName}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
            {physics.isDirect ? 'Direct E-k' : 'Indirect E-k'}
          </span>
        </div>
      </div>

      {/* Dual Panel Experiment Canvas: Energy Band Transition + LED Emission Dome */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel 1: Energy Band Transition (E-k) */}
        <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 px-1">
            <span className="font-bold text-slate-200">
              Energy Band Recombination (E_C → E_V)
            </span>
            <span className="font-mono text-[10px] text-amber-400">
              E_g = {physics.eg.toFixed(2)} eV
            </span>
          </div>

          <div className="relative w-full aspect-[520/200] my-2">
            <svg viewBox="0 0 520 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="ledGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Conduction Band (Top) */}
              <rect x="40" y="25" width="440" height="30" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="50" y="45" fill="#7dd3fc" fontSize="11" fontWeight="bold">Conduction Band (E_C)</text>

              {/* Valence Band (Bottom) */}
              <rect x="40" y="145" width="440" height="30" rx="6" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
              <text x="50" y="165" fill="#d8b4fe" fontSize="11" fontWeight="bold">Valence Band (E_V)</text>

              {/* Bandgap spacing E_g */}
              <line x1="120" y1="55" x2="120" y2="145" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <text x="130" y="105" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                Bandgap E_g = {physics.eg.toFixed(2)} eV
              </text>

              {/* Direct Recombination Vertical Drop */}
              {physics.isDirect ? (
                <g transform="translate(320, 55)">
                  {/* Vertical falling electron */}
                  <line x1="0" y1="0" x2="0" y2="85" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
                  <circle cx="0" cy={((animTime * 35) % 85)} r="5" fill="#38bdf8" filter="url(#ledGlow)" />
                  {/* Hole in valence band */}
                  <circle cx="0" cy="90" r="5" fill="none" stroke="#a855f7" strokeWidth="2" />

                  {/* Radiated Photon Wave */}
                  <path d="M 0 45 Q 15 35 30 45 T 60 45 T 90 45" stroke={physics.hexColor} strokeWidth="3" fill="none" filter="url(#ledGlow)" />
                  <text x="95" y="49" fill={physics.hexColor} fontSize="11" fontWeight="bold">
                    hv = {physics.lambdaNm} nm
                  </text>
                </g>
              ) : (
                /* Indirect Recombination with Phonon Heat */
                <g transform="translate(280, 55)">
                  {/* Diagonal path */}
                  <line x1="0" y1="0" x2="60" y2="85" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Phonon squiggly line */}
                  <path d="M 30 42 Q 40 35 50 42 T 70 42" stroke="#ea580c" strokeWidth="2" fill="none" />
                  <text x="80" y="46" fill="#f97316" fontSize="10" fontWeight="bold">Phonon (Heat Wave)</text>
                  <text x="80" y="60" fill="#94a3b8" fontSize="9">No Light Emission</text>
                </g>
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>
              {physics.isDirect
                ? '✅ Direct Bandgap: Direct vertical transition emits pure photon light!'
                : '⚠️ Indirect Bandgap: Momentum mismatch dissipates energy as lattice heat.'}
            </span>
          </div>
        </div>

        {/* Panel 2: LED Physical Emission Chamber */}
        <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 px-1">
            <span className="font-bold text-slate-200">
              Physical LED Die & Epoxy Optical Chamber
            </span>
            <span className="font-mono text-[10px]" style={{ color: physics.hexColor }}>
              {physics.colorName}
            </span>
          </div>

          <div className="relative w-full aspect-[520/200] my-2 flex items-center justify-center">
            <svg viewBox="0 0 400 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* Epoxy Dome Lens */}
              <path
                d="M 160 170 L 160 90 A 40 40 0 0 1 240 90 L 240 170 Z"
                fill={physics.isEmitting ? physics.hexColor : '#1e293b'}
                opacity={physics.isEmitting ? 0.35 : 0.8}
                stroke={physics.hexColor}
                strokeWidth="2"
              />

              {/* Anode & Cathode Posts */}
              <line x1="180" y1="170" x2="180" y2="120" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="220" y1="170" x2="220" y2="120" stroke="#cbd5e1" strokeWidth="4" />

              {/* Reflective Anvil Cup */}
              <path d="M 170 120 L 190 120 L 180 130 Z" fill="#94a3b8" />
              {/* Semiconductor Die */}
              <rect x="176" y="116" width="8" height="6" fill="#f59e0b" />

              {/* Glowing Radiation Rays if Emitting */}
              {physics.isEmitting && (
                <g transform="translate(200, 85)">
                  {[0, 30, 60, 90, 120, 150, 180].map((deg) => (
                    <line
                      key={deg}
                      x1="0"
                      y1="0"
                      x2={Math.cos((deg * Math.PI) / 180) * (45 + Math.sin(animTime * 5) * 8)}
                      y2={-Math.sin((deg * Math.PI) / 180) * (45 + Math.sin(animTime * 5) * 8)}
                      stroke={physics.hexColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      filter="url(#ledGlow)"
                    />
                  ))}
                </g>
              )}

              {/* Lead labels */}
              <text x="180" y="190" fill="#94a3b8" fontSize="9" textAnchor="middle">Anode (+)</text>
              <text x="220" y="190" fill="#94a3b8" fontSize="9" textAnchor="middle">Cathode (-)</text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>Current: {physics.current} mA</span>
            <span className="font-bold" style={{ color: physics.hexColor }}>
              {physics.isEmitting ? `Emission: ${physics.lambdaNm} nm (${physics.luxOutput} mcd)` : 'Dark (No Photons)'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'swapper', labelEn: '🔄 Semiconductor Material & Color', labelBn: '🔄 মৌল ও বর্ণ পরিবর্তন' },
              { id: 'variables', labelEn: '🎛️ Live Math: λ = 1240 / Eg', labelBn: '🎛️ সমীকরণ: λ = ১২৪০ / Eg' },
              { id: 'faults', labelEn: '⚡ Extreme Tests & Faults', labelBn: '⚡ অতিরিক্ত কারেন্ট ও ফ্যান্টাসি টেস্ট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {langMode === 'bn' ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          {activeTab === 'swapper' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {/* Material Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  {langMode === 'bn' ? 'সেমিকন্ডাক্টর মৌল ও ব্যান্ডগ্যাপ:' : 'Semiconductor Material & Bandgap:'}
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="InGaN_Blue">InGaN (Eg = 2.70 eV • Royal Blue 460nm)</option>
                  <option value="InGaN_Green">InGaN (Eg = 2.34 eV • Pure Green 530nm)</option>
                  <option value="AlGaInP_Amber">AlGaInP (Eg = 2.10 eV • Amber 590nm)</option>
                  <option value="AlGaAs_Red">AlGaAs (Eg = 1.88 eV • Super Red 660nm)</option>
                  <option value="GaAs_IR">GaAs (Eg = 1.42 eV • Infrared 873nm)</option>
                  <option value="GaN_UV">GaN (Eg = 3.40 eV • Ultraviolet 365nm)</option>
                  <option value="Si">Silicon (Eg = 1.12 eV • Indirect, Phonon Heat)</option>
                  <option value="Ge">Germanium (Eg = 0.67 eV • Indirect, Phonon Heat)</option>
                </select>
              </div>

              {/* Drive Current Slider */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  {langMode === 'bn' ? 'ফরওয়ার্ড কারেন্ট (I_F):' : 'Forward Drive Current (I_F):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={driveCurrentMa}
                    onChange={(e) => setDriveCurrentMa(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-xs">{driveCurrentMa}mA</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Higher current injects more carriers, brightening photon emission.
                </p>
              </div>

              {/* Supply Voltage */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  {langMode === 'bn' ? 'সিরিজ রোধক R_S:' : 'Series Protection Resistor:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={seriesR}
                    onChange={(e) => setSeriesR(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">{seriesR}Ω</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                λ = 1240 / E_g  =  1240 / {physics.eg.toFixed(2)}  ≈  {physics.lambdaNm} nm
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
              </p>
            </div>
          )}

          {activeTab === 'faults' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'overcurrent', title: '💥 Overcurrent Burnout (>40mA)', desc: 'Excessive current melts the gold wire bond: circuit opens permanently.' },
                { id: 'liquid_n2', title: '🧊 Liquid Nitrogen Cooling (77K)', desc: 'Cryogenic cold widens bandgap (+0.2eV), blue-shifting the emitted color!' },
                { id: null, title: '✅ Nominal Operation', desc: 'Restore standard factory operating conditions.' }
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
