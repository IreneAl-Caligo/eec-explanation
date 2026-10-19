import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, RefreshCw, Sparkles, Pause, Play, ShieldAlert,
  Sliders, Cpu, AlertTriangle, Zap, Scissors, Flame, Snowflake, Layers
} from 'lucide-react';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';

export default function RectifierWorkbench({ topic, langMode = 'dual', isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('swapper'); // 'swapper' | 'variables' | 'faults'
  const [isOpen, setIsOpen] = useState(true);
  const [isSimRunning, setIsSimRunning] = useState(true);

  // Rectifier specific controls
  // 'half' (Topic 17) | 'full_ct' (Topic 18) | 'bridge' (Topic 19/20a)
  const defaultMode = topic?.num === '18' ? 'full_ct' : (topic?.num === '19' || topic?.num === '20a') ? 'bridge' : 'half';
  const [rectMode, setRectMode] = useState(defaultMode);
  const [diodeModel, setDiodeModel] = useState('Si'); // 'Si' (0.7V) | 'Ge' (0.3V) | 'Schottky' (0.2V) | 'Ideal' (0.0V)
  const [varVinPeak, setVarVinPeak] = useState(12); // V peak AC
  const [hasCapacitor, setHasCapacitor] = useState(false);
  const [capValue, setCapValue] = useState(100); // uF (10 - 2200)
  const [loadRVal, setLoadRVal] = useState(1000); // ohms
  const [hasSeriesR, setHasSeriesR] = useState(true);
  const [seriesRVal, setSeriesRVal] = useState(220); // ohms
  const [activeFault, setActiveFault] = useState(null); // 'one_diode_open' | 'cap_short' | 'fuse_blow' | null

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

  const eli5 = ELI5_TOPIC_DATA[topic?.num] || ELI5_TOPIC_DATA['17'] || ELI5_TOPIC_DATA['0'];

  // Physics calculation
  const physics = useMemo(() => {
    let dropPerDiode = diodeModel === 'Ge' ? 0.3 : diodeModel === 'Schottky' ? 0.2 : diodeModel === 'Ideal' ? 0.0 : 0.7;
    let numDrops = rectMode === 'bridge' ? 2 : 1; // Bridge drops 2*V_D; Half/Center-Tap drops 1*V_D
    let totalDrop = dropPerDiode * numDrops;

    const rSeries = hasSeriesR ? seriesRVal : 0;
    const dividerRatio = loadRVal / (rSeries + loadRVal);

    let peakOut = Math.max(0, (varVinPeak - totalDrop) * dividerRatio);

    // Fault overrides
    if (activeFault === 'fuse_blow') {
      peakOut = 0;
    }

    const isFullWave = rectMode === 'full_ct' || rectMode === 'bridge';
    const effectiveFreq = isFullWave ? 120 : 60; // Ripple frequency: 60Hz half-wave vs 120Hz full-wave

    let rippleV = 0;
    let vDc = 0;
    let rippleFactor = 0;
    let efficiency = isFullWave ? 81.2 : 40.6;
    let piv = rectMode === 'full_ct' ? 2 * varVinPeak : varVinPeak;

    if (activeFault === 'cap_short') {
      // Capacitor shorted - zero load voltage, high fuse stress
      peakOut = 0;
      vDc = 0;
      rippleV = 0;
      rippleFactor = 999;
    } else if (hasCapacitor) {
      // Vr = Vpeak / (f * R_L * C)
      const cFarads = capValue * 1e-6;
      const rawRipple = peakOut / (effectiveFreq * loadRVal * cFarads);
      rippleV = Math.min(peakOut, rawRipple);
      vDc = Math.max(0, peakOut - rippleV / 2);
      rippleFactor = vDc > 0 ? ((rippleV / (2 * Math.sqrt(3) * vDc)) * 100) : 0;
    } else {
      // Unfiltered pulses
      vDc = isFullWave ? (0.636 * peakOut) : (0.318 * peakOut);
      rippleV = peakOut;
      rippleFactor = isFullWave ? 48.2 : 121.2;
    }

    const loadCurrentMa = vDc > 0 ? (vDc / loadRVal) * 1000 : 0;

    return {
      dropPerDiode,
      totalDrop,
      peakOut,
      rippleV,
      vDc,
      rippleFactor,
      efficiency,
      piv,
      loadCurrentMa,
      isFullWave,
      effectiveFreq
    };
  }, [rectMode, diodeModel, varVinPeak, hasCapacitor, capValue, loadRVal, hasSeriesR, seriesRVal, activeFault]);

  const resetAll = () => {
    setRectMode(defaultMode);
    setDiodeModel('Si');
    setVarVinPeak(12);
    setHasCapacitor(false);
    setCapValue(100);
    setLoadRVal(1000);
    setHasSeriesR(true);
    setSeriesRVal(220);
    setActiveFault(null);
  };

  // Oscilloscope waveform calculation
  const scopeWidth = 520;
  const scopeHeight = 180;
  const midY = scopeHeight / 2;
  const numCycles = 2.5;

  const { pathVin, pathVout } = useMemo(() => {
    let pVin = '';
    let pVout = '';
    const scaleY = (scopeHeight * 0.4) / Math.max(12, varVinPeak);

    for (let x = 0; x <= scopeWidth; x += 4) {
      const theta = (x / scopeWidth) * (numCycles * 2 * Math.PI) - animTime;
      const sinVal = Math.sin(theta);
      const vInInstant = varVinPeak * sinVal;
      const yVin = midY - vInInstant * scaleY;

      if (x === 0) pVin += `M ${x} ${yVin}`;
      else pVin += ` L ${x} ${yVin}`;

      // Calculate Vout
      let vOutInstant = 0;
      if (activeFault === 'fuse_blow' || activeFault === 'cap_short') {
        vOutInstant = 0;
      } else if (hasCapacitor) {
        // Sawtooth exponential discharge
        const periodFactor = physics.isFullWave ? 2 : 1;
        const cyclePhase = ((theta * periodFactor / (2 * Math.PI)) % 1 + 1) % 1;
        const decay = Math.exp(-cyclePhase * 3.8 * (100 / Math.max(10, capValue)));
        vOutInstant = Math.max(0, physics.peakOut * (1 - (physics.rippleV / (physics.peakOut || 1)) * (1 - decay)));
      } else {
        // Unfiltered rectified wave
        if (physics.isFullWave) {
          vOutInstant = Math.max(0, Math.abs(vInInstant) - physics.totalDrop) * (loadRVal / (seriesRVal + loadRVal));
        } else {
          vOutInstant = Math.max(0, vInInstant - physics.totalDrop) * (loadRVal / (seriesRVal + loadRVal));
        }
      }

      const yVout = midY - vOutInstant * scaleY;
      if (x === 0) pVout += `M ${x} ${yVout}`;
      else pVout += ` L ${x} ${yVout}`;
    }

    return { pathVin: pVin, pathVout: pVout };
  }, [animTime, varVinPeak, physics, hasCapacitor, capValue, loadRVal, seriesRVal, activeFault]);

  // Current animation positions along circuit loop
  const electronDots = useMemo(() => {
    if (physics.loadCurrentMa <= 0.05) return [];
    const count = 7;
    const speed = animTime * 45;
    const totalLength = 1600;
    const dots = [];

    for (let i = 0; i < count; i++) {
      const dist = (speed + (i * totalLength) / count) % totalLength;
      let x = 80;
      let y = 50;

      if (dist < 580) {
        x = 80 + dist;
        y = 50;
      } else if (dist < 740) {
        x = 660;
        y = 50 + (dist - 580);
      } else if (dist < 1320) {
        x = 660 - (dist - 740);
        y = 210;
      } else {
        x = 80;
        y = 210 - (dist - 1320);
      }

      dots.push({ x, y, id: i });
    }
    return dots;
  }, [animTime, physics.loadCurrentMa]);

  return (
    <div className={`bg-white dark:bg-slate-900 border ${isEmbedded ? 'border-indigo-300 dark:border-indigo-800 rounded-2xl' : 'border-2 border-indigo-300 dark:border-indigo-800 rounded-2xl shadow-lg'} p-3.5 sm:p-5 space-y-4 transition-colors w-full max-w-full overflow-hidden`}>
      {/* Workbench Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{langMode === 'bn' ? 'রেক্টিফায়ার ও স্মুথিং ফিল্টার ওয়ার্কবেঞ্চ' : 'AC-to-DC Rectifier, Bridge & Smoothing Filter Workbench'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                🔬 TOPIC #{topic.num} EXPERIMENT
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'হাফ-ওয়েভ, সেন্টার-ট্যাপড এবং ৪-ডায়োড ব্রিজ রেক্টিফায়ার তৈরি করুন ও ফিল্টার ক্যাপাসিটরে রিপল দূর করুন।'
                : 'Build Half-Wave, Center-Tapped or Bridge Rectifiers with real-time capacitor smoothing & ripple reduction.'}
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
            <span className="hidden sm:inline">{isSimRunning ? (langMode === 'bn' ? 'পজ' : 'Pause') : (langMode === 'bn' ? 'চালু' : 'Run')}</span>
          </button>
          <button
            onClick={resetAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{langMode === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition"
          >
            {isOpen ? (langMode === 'bn' ? 'লুকান ▲' : 'Minimize Controls ▲') : (langMode === 'bn' ? 'খুলুন ▼' : 'Expand Controls ▼')}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Multi-Meter HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Vin Peak */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">
            {langMode === 'bn' ? 'ইনপুট পিক (V_in)' : 'Input AC Peak'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-lg font-mono font-black text-amber-900 dark:text-amber-200">
              {varVinPeak.toFixed(1)}
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-mono">60 Hz AC</span>
        </div>

        {/* Vdc Output */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
            {langMode === 'bn' ? 'গড় ডিসি (V_dc)' : 'Filtered Output (V_dc)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-lg font-mono font-black text-emerald-900 dark:text-emerald-200">
              {physics.vDc.toFixed(2)}
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block truncate">
            {hasCapacitor ? `C = ${capValue}μF Filter` : 'Unfiltered Pulses'}
          </span>
        </div>

        {/* Ripple Voltage */}
        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-400 block">
            {langMode === 'bn' ? 'রিপল ভোল্টেজ (V_r)' : 'Ripple P-P (V_r)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-lg font-mono font-black text-sky-900 dark:text-sky-200">
              {physics.rippleV >= 1 ? `${physics.rippleV.toFixed(2)} V` : `${(physics.rippleV * 1000).toFixed(0)} mV`}
            </span>
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-mono">
            r = {physics.rippleFactor > 100 ? '>100%' : `${physics.rippleFactor.toFixed(1)}%`}
          </span>
        </div>

        {/* Efficiency */}
        <div className="bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-400 block">
            {langMode === 'bn' ? 'সর্বোচ্চ দক্ষতা (η)' : 'Max Efficiency (η)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-lg font-mono font-black text-purple-900 dark:text-purple-200">
              {physics.efficiency.toFixed(1)}%
            </span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 block">
            {physics.isFullWave ? 'Full-Wave (81.2%)' : 'Half-Wave (40.6%)'}
          </span>
        </div>

        {/* Peak Inverse Voltage (PIV) */}
        <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 block">
            {langMode === 'bn' ? 'PIV রেটিং' : 'Peak Inverse Volt'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base sm:text-lg font-mono font-black text-rose-900 dark:text-rose-200">
              {physics.piv.toFixed(1)}
            </span>
            <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 block">
            {rectMode === 'full_ct' ? '2 · V_m (Center Tap)' : '1 · V_m'}
          </span>
        </div>

        {/* Load Current */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
            {langMode === 'bn' ? 'লোড কারেন্ট (I_L)' : 'Load Current (I_L)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm sm:text-base font-mono font-black text-indigo-600 dark:text-indigo-400">
              {physics.loadCurrentMa.toFixed(2)} mA
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
            R_L = {loadRVal} Ω
          </span>
        </div>
      </div>

      {/* Experiment Deck: Schematic + Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Circuit Schematic */}
        <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-200 tracking-wide uppercase text-[11px]">
                {rectMode === 'bridge' ? '4-Diode Bridge Matrix Schematic' : rectMode === 'full_ct' ? 'Center-Tapped Full-Wave Schematic' : 'Half-Wave Rectifier Schematic'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-indigo-400">
              {hasCapacitor ? `RC Filter (${capValue} μF)` : 'Unfiltered Pulsing'}
            </span>
          </div>

          <div className="relative w-full aspect-[740/250] my-auto">
            <svg viewBox="0 0 740 250" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glowRec" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Source (80, 130) */}
              <g transform="translate(80, 130)">
                <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
                <path d="M -15 0 Q -7 -14 0 0 Q 7 14 15 0" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                <line x1="0" y1="-26" x2="0" y2="-80" stroke="#38bdf8" strokeWidth="3" />
                <line x1="0" y1="26" x2="0" y2="80" stroke="#38bdf8" strokeWidth="3" />
                <text x="0" y="40" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ~ {varVinPeak}V AC
                </text>
              </g>

              {/* Top wire to series resistor */}
              <path d="M 80 50 L 140 50" stroke="#38bdf8" strokeWidth="3" fill="none" />

              {/* Series Resistor: (140, 50) to (220, 50) */}
              {hasSeriesR ? (
                <g>
                  <path d="M 140 50 L 150 40 L 160 60 L 170 40 L 180 60 L 190 40 L 200 60 L 210 50 L 220 50" stroke="#a855f7" strokeWidth="3.5" fill="none" />
                  <text x="180" y="32" fill="#d8b4fe" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    R_S={seriesRVal}Ω
                  </text>
                </g>
              ) : (
                <line x1="140" y1="50" x2="220" y2="50" stroke="#f59e0b" strokeWidth="4" />
              )}

              {/* RECTIFIER STAGE (220, 50) to (420, 50) */}
              {rectMode === 'half' && (
                <g transform="translate(260, 50)">
                  <path d="M -40 0 L 10 0" stroke="#38bdf8" strokeWidth="3" />
                  <polygon points="10,-16 10,16 50,0" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="50" y1="-16" x2="50" y2="16" stroke="#e0f2fe" strokeWidth="3" />
                  <line x1="50" y1="0" x2="160" y2="0" stroke="#38bdf8" strokeWidth="3" />
                  <text x="30" y="-22" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                    1N4007 ({diodeModel} Diode)
                  </text>
                  <text x="30" y="30" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    V_drop: {physics.totalDrop.toFixed(2)}V
                  </text>
                </g>
              )}

              {rectMode === 'bridge' && (
                <g transform="translate(290, 80)">
                  {/* Bridge Diamond outline */}
                  <polygon points="40,-40 80,0 40,40 0,0" fill="#1e293b" stroke="#6366f1" strokeWidth="2" opacity="0.8" />
                  {/* 4 Diodes */}
                  {/* D1 Top Right */}
                  <polygon points="20,-20 40,-35 40,-5" fill="#38bdf8" />
                  {/* D2 Bottom Right */}
                  <polygon points="60,-5 60,35 40,20" fill="#38bdf8" />
                  {/* D3 Top Left */}
                  <polygon points="20,-5 20,35 40,20" fill="#10b981" />
                  {/* D4 Bottom Left */}
                  <polygon points="60,-20 40,-35 40,-5" fill="#10b981" />
                  <text x="40" y="-48" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                    4-Diode Bridge Diamond (2·V_D Drop)
                  </text>
                  {/* Connect wires */}
                  <path d="M -70 -30 L 0 0" stroke="#38bdf8" strokeWidth="3" />
                  <path d="M 80 0 L 130 -30" stroke="#38bdf8" strokeWidth="3" />
                  <path d="M 40 40 L 40 130 L 130 130" stroke="#38bdf8" strokeWidth="3" />
                </g>
              )}

              {rectMode === 'full_ct' && (
                <g transform="translate(260, 50)">
                  {/* Upper diode */}
                  <polygon points="10,-14 10,14 50,0" fill="#38bdf8" />
                  <line x1="50" y1="-14" x2="50" y2="14" stroke="#e0f2fe" strokeWidth="3" />
                  <line x1="-40" y1="0" x2="10" y2="0" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="50" y1="0" x2="160" y2="0" stroke="#38bdf8" strokeWidth="3" />
                  <text x="30" y="-20" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
                    D1 (Positive Half)
                  </text>
                  {/* Center Tap return */}
                  <line x1="0" y1="80" x2="160" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="80" y="72" fill="#fbbf24" fontSize="9" textAnchor="middle">Center-Tap Ground</text>
                </g>
              )}

              {/* Wire to Capacitor (500, 50) */}
              <circle cx="500" cy="50" r="4" fill="#38bdf8" />
              <path d="M 500 50 L 500 80" stroke="#38bdf8" strokeWidth="3" fill="none" />

              {/* Capacitor Branch with Knife Switch */}
              {hasCapacitor ? (
                <g>
                  <line x1="500" y1="80" x2="500" y2="105" stroke="#10b981" strokeWidth="3.5" />
                  <circle cx="500" cy="80" r="3.5" fill="#10b981" />
                  <circle cx="500" cy="105" r="3.5" fill="#10b981" />
                  <line x1="500" y1="105" x2="500" y2="120" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="480" y1="120" x2="520" y2="120" stroke="#10b981" strokeWidth="4" />
                  <line x1="480" y1="130" x2="520" y2="130" stroke="#10b981" strokeWidth="4" />
                  <line x1="500" y1="130" x2="500" y2="210" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="500" cy="210" r="4" fill="#38bdf8" />
                  <text x="500" y="152" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    C={capValue}μF
                  </text>
                  <text x="500" y="166" fill="#6ee7b7" fontSize="9" textAnchor="middle">
                    Smoothing Filter
                  </text>
                </g>
              ) : (
                <g>
                  <circle cx="500" cy="80" r="3.5" fill="#94a3b8" />
                  <line x1="500" y1="80" x2="480" y2="95" stroke="#f43f5e" strokeWidth="3" />
                  <circle cx="500" cy="105" r="3.5" fill="#94a3b8" />
                  <text x="500" y="152" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Filter OPEN
                  </text>
                </g>
              )}

              {/* Wire to Load (660, 50) */}
              <path d="M 500 50 L 660 50" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <circle cx="660" cy="50" r="4" fill="#38bdf8" />

              {/* Load Resistor R_L at (660, 90) */}
              <path d="M 660 50 L 660 90" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <path d="M 660 90 L 650 97 L 670 107 L 650 117 L 670 127 L 650 137 L 670 147 L 660 155" stroke="#f59e0b" strokeWidth="3.5" fill="none" />
              <path d="M 660 155 L 660 210" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <circle cx="660" cy="210" r="4" fill="#38bdf8" />
              <text x="695" y="125" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                R_L=1kΩ
              </text>

              {/* Return wire to source */}
              <path d="M 660 210 L 80 210" stroke="#38bdf8" strokeWidth="3" fill="none" />

              {/* Electron flow dots */}
              {electronDots.map((dot) => (
                <circle key={dot.id} cx={dot.x} cy={dot.y} r="4" fill="#38bdf8" filter="url(#glowRec)" />
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 mt-2">
            <span>{langMode === 'bn' ? 'নীল কণা: চলমান ইলেকট্রন কারেন্ট' : 'Cyan Orbs: Electron Current Flow'}</span>
            <span className="font-mono text-emerald-400 font-bold">I_L = {physics.loadCurrentMa.toFixed(2)} mA</span>
          </div>
        </div>

        {/* Dual-Trace Oscilloscope */}
        <div className="bg-[#071610] rounded-2xl p-3 border-2 border-emerald-950 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-900/60 px-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-400">
                <span className="w-2.5 h-1.5 rounded bg-amber-400 inline-block"></span>
                <span>CH1: V_in ({varVinPeak}Vp)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-400">
                <span className="w-2.5 h-1.5 rounded bg-emerald-400 inline-block"></span>
                <span>CH2: V_out ({physics.peakOut.toFixed(1)}Vp)</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-emerald-500 font-bold">
              TIME: 5ms/div • VOLTS: 5V/div
            </span>
          </div>

          <div className="relative w-full aspect-[520/180] my-auto bg-[#040e0a] rounded-xl border border-emerald-900/80 overflow-hidden shadow-inner">
            <svg viewBox={`0 0 ${scopeWidth} ${scopeHeight}`} className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Grid */}
              {[...Array(11)].map((_, i) => (
                <line key={`v-${i}`} x1={(scopeWidth / 10) * i} y1="0" x2={(scopeWidth / 10) * i} y2={scopeHeight} stroke="#064e3b" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
              ))}
              {[...Array(9)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={(scopeHeight / 8) * i} x2={scopeWidth} y2={(scopeHeight / 8) * i} stroke="#064e3b" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
              ))}
              <line x1="0" y1={midY} x2={scopeWidth} y2={midY} stroke="#047857" strokeWidth="1.5" opacity="0.8" />
              <line x1={scopeWidth / 2} y1="0" x2={scopeWidth / 2} y2={scopeHeight} stroke="#047857" strokeWidth="1.5" opacity="0.8" />

              {/* Trace 1: Vin (Amber) */}
              <path d={pathVin} fill="none" stroke="#f59e0b" strokeWidth="2.2" opacity="0.75" />

              {/* Trace 2: Vout (Neon Green) */}
              <path d={pathVout} fill="none" stroke="#10b981" strokeWidth="3.2" filter="url(#glowRec)" />
            </svg>

            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 text-[9px] font-mono pointer-events-none">
              <span className="bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                V_dc = {physics.vDc.toFixed(2)}V
              </span>
              <span className="bg-sky-950/80 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                {hasCapacitor ? `V_ripple = ${physics.rippleV >= 1 ? `${physics.rippleV.toFixed(2)}V` : `${(physics.rippleV * 1000).toFixed(0)}mV`}` : 'Unfiltered 100% Ripple'}
              </span>
            </div>

            <div className="absolute top-2 right-2 text-[9px] font-mono pointer-events-none text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
              {hasCapacitor ? (capValue >= 400 ? '✅ High-Fidelity Smooth DC' : '〰️ Sawtooth Ripple DC') : '⚠️ Raw Pulsing DC'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-400/90 bg-[#04120c] px-2.5 py-1.5 rounded-lg border border-emerald-950 mt-2">
            <span>
              {hasCapacitor
                ? (langMode === 'bn' ? `ক্যাপাসিটর ফিল্টার সক্রিয়: রিপল রোধ করে মসৃণ ডিসি পাওয়া যাচ্ছে!` : `Capacitor Filter Active: Exponential RC discharge flattens output ripple!`)
                : (langMode === 'bn' ? `কাঁচা পালস: শুধুমাত্র পজিটিভ অর্ধ-চক্র অতিক্রম করছে।` : `Raw Pulses: Add capacitor (C) to smooth into steady DC.`)}
            </span>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'swapper', labelEn: '🔄 Topology & Component Creator', labelBn: '🔄 রেক্টিফায়ার মডেল ও কম্পোনেন্ট' },
              { id: 'variables', labelEn: '🎛️ Live Math & Variable Physics', labelBn: '🎛️ সূত্রের চলক ও বাস্তব মান পরিবর্তন' },
              { id: 'faults', labelEn: '⚡ "What Happens If?" Extreme Faults', labelBn: '⚡ "এমন করলে কী ঘটবে?" ফ্যান্টাসি টেস্ট' },
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
              {/* Topology Swapper */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  {langMode === 'bn' ? 'সার্কিট টপোলজি নির্বাচন করুন:' : 'Rectifier Circuit Topology:'}
                </label>
                <select
                  value={rectMode}
                  onChange={(e) => setRectMode(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="half">Half-Wave Rectifier (1 Diode, Vdc = 0.318 Vm)</option>
                  <option value="full_ct">Full-Wave Center-Tapped (2 Diodes, Vdc = 0.636 Vm)</option>
                  <option value="bridge">4-Diode Bridge Rectifier (4 Diodes, PIV = Vm)</option>
                </select>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Diode Model:</span>
                  <select
                    value={diodeModel}
                    onChange={(e) => setDiodeModel(e.target.value)}
                    className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1"
                  >
                    <option value="Si">Silicon (0.7V drop)</option>
                    <option value="Ge">Germanium (0.3V drop)</option>
                    <option value="Schottky">Schottky (0.2V drop)</option>
                    <option value="Ideal">Ideal (0.0V drop)</option>
                  </select>
                </div>
              </div>

              {/* Input Voltage Slider */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {langMode === 'bn' ? 'ইনপুট ভোল্টেজ পিক (V_in):' : 'Input Voltage Peak (V_in):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={varVinPeak}
                    onChange={(e) => setVarVinPeak(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs">{varVinPeak}V</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {langMode === 'bn' ? 'ট্রান্সফরমার থেকে আসা অল্টারনেটিং কারেন্ট (AC) সংকেত।' : '60Hz AC signal entering the rectifier stage.'}
                </p>
              </div>

              {/* Add Capacitor / Resistors */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-500" />
                  {langMode === 'bn' ? 'ফিল্টার ও প্রোটেকশন উপাদান:' : 'Filter & Protection Components:'}
                </label>
                <div className="space-y-1.5 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={hasCapacitor}
                        onChange={(e) => setHasCapacitor(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>{langMode === 'bn' ? 'স্মুথিং ফিল্টার ক্যাপাসিটর (C)' : 'Add Smoothing Capacitor (C)'}</span>
                    </label>
                    {hasCapacitor && (
                      <div className="pl-6 pt-1 flex items-center gap-2">
                        <input
                          type="range"
                          min="10"
                          max="1000"
                          step="50"
                          value={capValue}
                          onChange={(e) => setCapValue(Number(e.target.value))}
                          className="w-28 accent-indigo-500"
                        />
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{capValue} μF</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                {rectMode === 'half' ? 'V_dc = 0.318 · (V_m - V_D)  •  r = 121%' : 'V_dc = 0.636 · (V_m - 2·V_D)  •  r = 48.2%'}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
              </p>
            </div>
          )}

          {activeTab === 'faults' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'fuse_blow', title: '💥 Blown Transformer Fuse', desc: 'Transformer opens: zero power enters circuit (V_out = 0V).' },
                { id: 'cap_short', title: '✂️ Shorted Filter Capacitor', desc: 'Capacitor plates short to ground: massive fuse surge.' },
                { id: null, title: '✅ Normal Healthy Circuit', desc: 'Factory nominal operating parameters restored.' }
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
