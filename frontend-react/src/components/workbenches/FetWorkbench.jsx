import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, RefreshCw, Sparkles, Pause, Play, ShieldAlert,
  Cpu, Zap, Sliders, Layers, Scissors, Flame
} from 'lucide-react';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';

export default function FetWorkbench({ topic, langMode = 'dual', isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('swapper'); // 'swapper' | 'variables' | 'faults'
  const [isOpen, setIsOpen] = useState(true);
  const [isSimRunning, setIsSimRunning] = useState(true);

  // FET device state
  const [fetType, setFetType] = useState('n_jfet'); // 'n_jfet' | 'p_jfet' | 'd_mosfet' | 'e_mosfet'
  const [varVgs, setVarVgs] = useState(-1.5); // V
  const [varVds, setVarVds] = useState(8.0); // V
  const [varIdss, setVarIdss] = useState(10); // mA
  const [varVp, setVarVp] = useState(-4.0); // V
  const [activeFault, setActiveFault] = useState(null); // 'gate_rupture' | 'pinchoff_cutoff' | 'drain_breakdown' | null

  // Animation ticker for electron carrier streaming
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

  const eli5 = ELI5_TOPIC_DATA[topic?.num] || ELI5_TOPIC_DATA['21'] || ELI5_TOPIC_DATA['0'];

  // Physics calculation
  const physics = useMemo(() => {
    let effectiveVgs = activeFault === 'pinchoff_cutoff' ? varVp - 0.5 : varVgs;
    let effectiveVds = activeFault === 'drain_breakdown' ? 28 : varVds;

    // Shockley equation: I_D = I_DSS * (1 - V_GS / V_P)^2
    let id = 0;
    let mode = 'PINCH-OFF / SATURATION (Constant Current)';
    let gm = 0;

    if (activeFault === 'gate_rupture') {
      id = 0;
      mode = '💥 ESD GATE RUPTURE (Destroyed)';
    } else if (effectiveVgs <= varVp) {
      id = 0;
      mode = 'CUTOFF (Channel Pinched Off)';
      gm = 0;
    } else {
      const vdsSat = effectiveVgs - varVp;
      if (effectiveVds < vdsSat) {
        // Ohmic / Linear Region
        const vRatio = effectiveVds / vdsSat;
        id = varIdss * Math.pow(1 - effectiveVgs / varVp, 2) * (2 * vRatio - vRatio * vRatio);
        mode = 'OHMIC REGION (Voltage-Controlled Resistor)';
      } else {
        // Saturation Region
        id = varIdss * Math.pow(1 - effectiveVgs / varVp, 2);
        mode = 'PINCH-OFF / SATURATION (Constant Current)';
      }
      gm = ((2 * varIdss) / Math.abs(varVp)) * (1 - effectiveVgs / varVp);
    }

    // Depletion layer thickness ratio (0 to 1)
    const pinchRatio = Math.min(1.0, Math.max(0.0, Math.abs(effectiveVgs) / Math.abs(varVp)));

    return {
      effectiveVgs,
      effectiveVds,
      id: Math.max(0, id),
      gm: Math.max(0, gm).toFixed(2),
      mode,
      pinchRatio
    };
  }, [fetType, varVgs, varVds, varIdss, varVp, activeFault]);

  const resetAll = () => {
    setFetType('n_jfet');
    setVarVgs(-1.5);
    setVarVds(8.0);
    setVarIdss(10);
    setVarVp(-4.0);
    setActiveFault(null);
  };

  // Depletion neck height (channel bottleneck)
  const neckHeight = Math.max(2, 40 * (1 - physics.pinchRatio));

  return (
    <div className={`bg-white dark:bg-slate-900 border ${isEmbedded ? 'border-teal-300 dark:border-teal-800 rounded-2xl' : 'border-2 border-teal-300 dark:border-teal-800 rounded-2xl shadow-lg'} p-3.5 sm:p-5 space-y-4 transition-colors w-full max-w-full overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-100 dark:border-teal-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{langMode === 'bn' ? 'ফিল্ড ইফেক্ট ট্রানজিস্টর (JFET / MOSFET) ও পিঞ্চ-অফ ল্যাব' : 'FET / JFET / MOSFET Field-Effect & Depletion Pinch-Off Lab'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono font-bold">
                🔬 TOPIC #{topic.num} EXPERIMENT
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'গেটের রিভার্স ভোল্টেজ (V_GS) দিয়ে চ্যানেল চিপে ধরা (পিঞ্চ-অফ) এবং শকলি সূত্রের বাস্তব পরীক্ষা।'
                : 'Squeeze the physical conductive channel neck with Gate voltage V_GS (Shockley equation).'}
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
            className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold"
          >
            {isOpen ? 'Minimize ▲' : 'Expand ▼'}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Multi-Meter HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* VGS Gate Voltage */}
        <div className="bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-400 block">
            {langMode === 'bn' ? 'গেটের চাপ (V_GS)' : 'Gate-Source (V_GS)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-teal-900 dark:text-teal-200">
              {physics.effectiveVgs.toFixed(2)}
            </span>
            <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 block">
            Pinch-off V_P = {varVp}V
          </span>
        </div>

        {/* Drain Current ID */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
            {langMode === 'bn' ? 'ড্রেন কারেন্ট (I_D)' : 'Drain Output (I_D)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-emerald-900 dark:text-emerald-200">
              {physics.id.toFixed(2)}
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">mA</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
            Shockley Equation
          </span>
        </div>

        {/* Drain Voltage VDS */}
        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-400 block">
            {langMode === 'bn' ? 'ড্রেন ভোল্টেজ (V_DS)' : 'Drain-Source (V_DS)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-sky-900 dark:text-sky-200">
              {physics.effectiveVds.toFixed(1)}
            </span>
            <span className="font-mono text-sky-700 dark:text-sky-400 font-bold">V</span>
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 block">
            Channel Voltage Pull
          </span>
        </div>

        {/* Transconductance gm */}
        <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-indigo-800 dark:text-indigo-400 block">
            {langMode === 'bn' ? 'ট্রান্সকন্ডাক্ট্যান্স (g_m)' : 'Gain (g_m)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-indigo-900 dark:text-indigo-200">
              {physics.gm}
            </span>
            <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">mS</span>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-mono">
            ΔI_D / ΔV_GS
          </span>
        </div>

        {/* Input Impedance */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">
            {langMode === 'bn' ? 'ইনপুট রোধ (R_in)' : 'Input Impedance'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-amber-900 dark:text-amber-200">
              &gt; 10¹²
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">Ω</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">
            I_G = 0.00 pA (No Current!)
          </span>
        </div>

        {/* Operating State */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block">
            {langMode === 'bn' ? 'অপারেটিং মোড' : 'Operating Region'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-black text-teal-700 dark:text-teal-300 truncate">
              {physics.mode.split(' ')[0]}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
            {physics.mode}
          </span>
        </div>
      </div>

      {/* Dual Panel Experiment: Physical Channel Cross Section + Shockley Transfer Parabola */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel 1: Physical Conductive Channel Cross Section with Depletion Squeeze */}
        <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 px-1">
            <span className="font-bold text-slate-200">
              Physical N-Channel Squeeze & Depletion Pinch-Off
            </span>
            <span className="font-mono text-[10px] text-teal-400">
              Pinch: {(physics.pinchRatio * 100).toFixed(0)}%
            </span>
          </div>

          <div className="relative w-full aspect-[520/200] my-2">
            <svg viewBox="0 0 520 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* N-Channel Silicon Bar (Background) */}
              <rect x="60" y="40" width="400" height="120" rx="4" fill="#0369a1" opacity="0.3" stroke="#0284c7" strokeWidth="2" />
              <text x="80" y="105" fill="#bae6fd" fontSize="12" fontWeight="bold">N-Channel</text>

              {/* Source Contact (Left) */}
              <rect x="50" y="55" width="20" height="90" fill="#64748b" />
              <text x="60" y="105" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">S</text>

              {/* Drain Contact (Right) */}
              <rect x="450" y="55" width="20" height="90" fill="#64748b" />
              <text x="460" y="105" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">D</text>

              {/* Top P+ Gate Region */}
              <rect x="200" y="30" width="120" height="25" fill="#7c3aed" rx="3" />
              <text x="260" y="47" fill="#ede9fe" fontSize="11" fontWeight="bold" textAnchor="middle">Gate P+</text>

              {/* Bottom P+ Gate Region */}
              <rect x="200" y="145" width="120" height="25" fill="#7c3aed" rx="3" />
              <text x="260" y="162" fill="#ede9fe" fontSize="11" fontWeight="bold" textAnchor="middle">Gate P+</text>

              {/* Top Depletion Layer (Expands downward as V_GS goes negative) */}
              <path
                d={`M 200 55 Q 260 ${55 + (40 - neckHeight / 2)} 320 55 Z`}
                fill="#334155"
                opacity="0.9"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Bottom Depletion Layer (Expands upward) */}
              <path
                d={`M 200 145 Q 260 ${145 - (40 - neckHeight / 2)} 320 145 Z`}
                fill="#334155"
                opacity="0.9"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Bottleneck Label */}
              <line x1="260" y1={55 + (40 - neckHeight / 2)} x2="260" y2={145 - (40 - neckHeight / 2)} stroke="#f59e0b" strokeWidth="2" />
              <text x="260" y={105} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                {neckHeight <= 4 ? 'PINCH-OFF (0 mA)' : `Neck: ${neckHeight.toFixed(0)}μm`}
              </text>

              {/* Electron flow through channel neck */}
              {physics.id > 0.05 && (
                <g>
                  {[0, 1, 2, 3].map((i) => (
                    <circle
                      key={i}
                      cx={80 + ((animTime * 45 + i * 90) % 360)}
                      cy={100}
                      r="3.5"
                      fill="#38bdf8"
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>Gate Reverse Voltage V_GS = {physics.effectiveVgs.toFixed(2)} V</span>
            <span className="font-mono text-emerald-400 font-bold">Drain Current I_D = {physics.id.toFixed(2)} mA</span>
          </div>
        </div>

        {/* Panel 2: Shockley Transfer Curve (I_D vs V_GS Parabola) */}
        <div className="bg-[#071610] rounded-2xl p-3 border-2 border-emerald-950 flex flex-col justify-between shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-900/60 px-1">
            <span className="font-mono text-[11px] font-bold text-emerald-400">
              Shockley Transfer Characteristic: I_D = I_DSS · (1 - V_GS / V_P)²
            </span>
            <span className="font-mono text-[10px] text-teal-400 font-bold">
              I_DSS = {varIdss} mA
            </span>
          </div>

          <div className="relative w-full aspect-[520/180] my-auto bg-[#040e0a] rounded-xl border border-emerald-900/80 overflow-hidden shadow-inner">
            <svg viewBox="0 0 500 180" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              {/* Axes */}
              <line x1="60" y1="20" x2="60" y2="150" stroke="#047857" strokeWidth="2" />
              <line x1="60" y1="150" x2="460" y2="150" stroke="#047857" strokeWidth="2" />

              {/* Labels */}
              <text x="30" y="30" fill="#a7f3d0" fontSize="10" fontWeight="bold">I_D (mA)</text>
              <text x="440" y="165" fill="#a7f3d0" fontSize="10" fontWeight="bold">V_GS (V)</text>
              <text x="60" y="165" fill="#6ee7b7" fontSize="9" textAnchor="middle">{varVp}V (V_P)</text>
              <text x="400" y="165" fill="#6ee7b7" fontSize="9" textAnchor="middle">0V</text>
              <text x="50" y="35" fill="#6ee7b7" fontSize="9" textAnchor="end">{varIdss}mA</text>

              {/* Shockley Parabolic Curve */}
              {(() => {
                let dStr = '';
                for (let v = varVp; v <= 0; v += 0.2) {
                  const xSvg = 60 + ((v - varVp) / (-varVp)) * 340;
                  const curId = varIdss * Math.pow(1 - v / varVp, 2);
                  const ySvg = 150 - (curId / varIdss) * 120;
                  if (v === varVp) dStr += `M ${xSvg} ${ySvg}`;
                  else dStr += ` L ${xSvg} ${ySvg}`;
                }
                return <path d={dStr} fill="none" stroke="#10b981" strokeWidth="3" />;
              })()}

              {/* Active Operating Q-Point Dot */}
              {(() => {
                const clampedVgs = Math.max(varVp, Math.min(0, physics.effectiveVgs));
                const qX = 60 + ((clampedVgs - varVp) / (-varVp)) * 340;
                const qY = 150 - (physics.id / varIdss) * 120;
                return (
                  <g>
                    <line x1={qX} y1={qY} x2={qX} y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="60" y1={qY} x2={qX} y2={qY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx={qX} cy={qY} r="6" fill="#f59e0b" />
                    <text x={qX + 8} y={qY - 6} fill="#fbbf24" fontSize="10" fontWeight="bold">
                      Q ({physics.id.toFixed(1)} mA)
                    </text>
                  </g>
                );
              })()}
            </svg>

            <div className="absolute top-2 right-2 text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              {physics.mode}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-400/90 bg-[#04120c] px-2.5 py-1.5 rounded-lg border border-emerald-950 mt-2">
            <span>
              Shockley Curve: Slide V_GS to watch the amber Q-point trace the exact quadratic square-law curve.
            </span>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'swapper', labelEn: '🔄 FET Model & Gate Voltage', labelBn: '🔄 এফইটি মডেল ও গেট ভোল্টেজ' },
              { id: 'variables', labelEn: '🎛️ Shockley Square Law Math', labelBn: '🎛️ শকলি সূত্রের চলক' },
              { id: 'faults', labelEn: '⚡ Extreme Tests & Faults', labelBn: '⚡ পিঞ্চ-অফ ও ফ্যান্টাসি টেস্ট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {langMode === 'bn' ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          {activeTab === 'swapper' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {/* FET Device Family */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  {langMode === 'bn' ? 'ডিভাইস শ্রেণিবিভাগ:' : 'FET Device Classification:'}
                </label>
                <select
                  value={fetType}
                  onChange={(e) => setFetType(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="n_jfet">N-Channel JFET (2N5458 • Unipolar)</option>
                  <option value="p_jfet">P-Channel JFET (2N5460 • Hole Channel)</option>
                  <option value="d_mosfet">Depletion MOSFET (D-MOSFET)</option>
                  <option value="e_mosfet">Enhancement MOSFET (E-MOSFET)</option>
                </select>
              </div>

              {/* Gate Voltage VGS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {langMode === 'bn' ? 'গেট ভোল্টেজ (V_GS):' : 'Gate-Source Voltage (V_GS):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="-4.5"
                    max="0.0"
                    step="0.1"
                    value={varVgs}
                    onChange={(e) => setVarVgs(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs">{varVgs}V</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Slide negative to widen depletion layer and pinch the channel.
                </p>
              </div>

              {/* Drain Voltage VDS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  {langMode === 'bn' ? 'ড্রেন ভোল্টেজ (V_DS):' : 'Drain-Source Voltage (V_DS):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={varVds}
                    onChange={(e) => setVarVds(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">{varVds}V</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
                I_D = I_DSS · (1 - V_GS / V_P)²  =  {varIdss} · (1 - {varVgs} / {varVp})²  =  {physics.id.toFixed(2)} mA
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
              </p>
            </div>
          )}

          {activeTab === 'faults' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'pinchoff_cutoff', title: '✂️ Full Pinch-Off Cutoff', desc: 'V_GS exceeds V_P: depletion layers touch, channel completely pinches off (I_D = 0).' },
                { id: 'gate_rupture', title: '💥 ESD Gate Oxide Rupture', desc: 'Electrostatic discharge punctures insulation: permanent gate breakdown.' },
                { id: null, title: '✅ Nominal Linear / Pinch-off', desc: 'Restore standard Shockley characteristic operation.' }
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
