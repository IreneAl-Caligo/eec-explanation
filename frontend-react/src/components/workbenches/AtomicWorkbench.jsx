import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, RefreshCw, Sparkles, Pause, Play, ShieldAlert,
  Layers, Thermometer, Atom, Zap, Snowflake, Flame, Cpu
} from 'lucide-react';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';

export default function AtomicWorkbench({ topic, langMode = 'dual', isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('swapper'); // 'swapper' | 'variables' | 'faults'
  const [isOpen, setIsOpen] = useState(true);
  const [isSimRunning, setIsSimRunning] = useState(true);

  // Crystal state
  const defaultMat = topic?.num === '1' || topic?.num === '2' ? 'Si' : (topic?.num === '4' ? 'P_type' : topic?.num === '5' ? 'N_type' : 'Si');
  const [baseMat, setBaseMat] = useState('Si'); // 'Si' | 'Ge' | 'C'
  const [dopingType, setDopingType] = useState(topic?.num === '4' ? 'B' : topic?.num === '5' ? 'P' : 'none'); // 'none' | 'P' (N-type) | 'B' (P-type)
  const [dopingConcExp, setDopingConcExp] = useState(16); // 10^16 cm^-3
  const [tempK, setTempK] = useState(300); // 0 to 600 K
  const [activeFault, setActiveFault] = useState(null); // 'zero_k' | 'thermal_runaway' | 'heavy_doping' | null

  // Animation ticker for electron vibrations
  const [animTime, setAnimTime] = useState(0);

  useEffect(() => {
    if (!isSimRunning) return;
    let animId;
    let lastTs = performance.now();
    const loop = (ts) => {
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      setAnimTime((t) => (t + dt * 3.0) % 1000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isSimRunning]);

  const eli5 = ELI5_TOPIC_DATA[topic?.num] || ELI5_TOPIC_DATA['1'] || ELI5_TOPIC_DATA['0'];

  // Physics calculation
  const physics = useMemo(() => {
    const eg = baseMat === 'Ge' ? 0.67 : baseMat === 'C' ? 5.5 : 1.12; // eV
    const effectiveT = activeFault === 'zero_k' ? 0 : activeFault === 'thermal_runaway' ? 600 : tempK;

    // Intrinsic concentration ni = B * T^(1.5) * exp(-Eg / (2kT))
    let ni = 0;
    if (effectiveT > 10 && baseMat !== 'C') {
      const k = 8.617e-5; // eV/K
      const expTerm = Math.exp(-eg / (2 * k * effectiveT));
      const bCoeff = baseMat === 'Ge' ? 1.66e15 : 5.23e15;
      ni = Math.min(1e19, bCoeff * Math.pow(effectiveT, 1.5) * expTerm);
    }

    const dopingDensity = Math.pow(10, activeFault === 'heavy_doping' ? 19 : dopingConcExp);

    let n = ni;
    let p = ni;
    let carrierType = 'Intrinsic (n = p)';

    if (effectiveT === 0 || baseMat === 'C') {
      n = 0;
      p = 0;
      carrierType = 'Insulator (Zero Carriers)';
    } else if (dopingType === 'P') {
      // N-type donor
      n = Math.max(dopingDensity, ni);
      p = ni > 0 ? (ni * ni) / n : 0;
      carrierType = 'N-Type (Majority Electrons)';
    } else if (dopingType === 'B') {
      // P-type acceptor
      p = Math.max(dopingDensity, ni);
      n = ni > 0 ? (ni * ni) / p : 0;
      carrierType = 'P-Type (Majority Holes)';
    }

    // Conductivity sigma = q * (n * mu_n + p * mu_p)
    const muN = baseMat === 'Ge' ? 3900 : 1400; // cm^2/(V·s)
    const muP = baseMat === 'Ge' ? 1900 : 450;
    const q = 1.6e-19;
    const sigma = q * (n * muN + p * muP);

    return {
      eg,
      effectiveT,
      ni,
      n,
      p,
      carrierType,
      sigma,
      dopingDensity
    };
  }, [baseMat, dopingType, dopingConcExp, tempK, activeFault]);

  const resetAll = () => {
    setBaseMat('Si');
    setDopingType('none');
    setDopingConcExp(16);
    setTempK(300);
    setActiveFault(null);
  };

  // Lattice atoms (3x3 grid)
  const latticeAtoms = useMemo(() => {
    const atoms = [];
    const rows = 3;
    const cols = 3;
    const startX = 140;
    const startY = 50;
    const spacingX = 170;
    const spacingY = 70;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isCenter = r === 1 && c === 1;
        let symbol = baseMat;
        let charge = '+4';
        let color = '#0284c7';

        if (isCenter && dopingType === 'P') {
          symbol = 'P';
          charge = '+5';
          color = '#10b981'; // Green for donor
        } else if (isCenter && dopingType === 'B') {
          symbol = 'B';
          charge = '+3';
          color = '#f59e0b'; // Amber for acceptor
        } else if (baseMat === 'Ge') {
          color = '#6366f1';
        } else if (baseMat === 'C') {
          color = '#94a3b8';
        }

        atoms.push({
          id: `${r}-${c}`,
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          r,
          c,
          isCenter,
          symbol,
          charge,
          color
        });
      }
    }
    return atoms;
  }, [baseMat, dopingType]);

  return (
    <div className={`bg-white dark:bg-slate-900 border ${isEmbedded ? 'border-sky-300 dark:border-sky-800 rounded-2xl' : 'border-2 border-sky-300 dark:border-sky-800 rounded-2xl shadow-lg'} p-3.5 sm:p-5 space-y-4 transition-colors w-full max-w-full overflow-hidden`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 dark:border-sky-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-md">
            <Atom className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{langMode === 'bn' ? 'ক্রিস্টাল ল্যাটিস, সমযোজী বন্ধন ও ডোপিং ওয়ার্কবেঞ্চ' : 'Crystal Lattice, Covalent Bonding & Doping Synthesizer'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono font-bold">
                🔬 ATOMIC PHYSICS (TOPICS 1–5)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'সিলিকন/জার্মেনিয়াম ক্রিস্টালে ইলেকট্রন শেয়ারিং, তাপমাত্রা বৃদ্ধি ও ফসফরাস/বোরন ডোপিংয়ের প্রভাব দেখুন।'
                : 'Interactive 2D lattice: covalent electron pairs, thermal bond breaking & P-type/N-type doping.'}
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
            className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold"
          >
            {isOpen ? 'Minimize ▲' : 'Expand ▼'}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Multi-Meter HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Lattice Material */}
        <div className="bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-sky-800 dark:text-sky-400 block">
            {langMode === 'bn' ? 'মৌল ও যোজ্যতা' : 'Base Crystal'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-sky-900 dark:text-sky-200">
              {baseMat === 'Si' ? 'Silicon (Si)' : baseMat === 'Ge' ? 'Germanium (Ge)' : 'Diamond (C)'}
            </span>
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-mono">
            E_g = {physics.eg} eV
          </span>
        </div>

        {/* Temperature */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">
            {langMode === 'bn' ? 'তাপমাত্রা (T)' : 'Lattice Temp (T)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-amber-900 dark:text-amber-200">
              {physics.effectiveT}
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">K</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">
            {physics.effectiveT === 0 ? 'Absolute Zero (0 K)' : physics.effectiveT >= 400 ? '🔥 High Thermal Energy' : 'Room Temp (300 K)'}
          </span>
        </div>

        {/* Doping Mode */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
            {langMode === 'bn' ? 'ডোপিং প্রোফাইল' : 'Doping Profile'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 truncate">
              {dopingType === 'P' ? 'Phosphorus (N-Type)' : dopingType === 'B' ? 'Boron (P-Type)' : 'Pure Intrinsic'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
            {dopingType !== 'none' ? `10^${dopingConcExp} cm⁻³` : 'Zero Impurity'}
          </span>
        </div>

        {/* Electron Density n */}
        <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-indigo-800 dark:text-indigo-400 block">
            {langMode === 'bn' ? 'মুক্ত ইলেকট্রন (n)' : 'Electrons (n)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-mono font-black text-indigo-900 dark:text-indigo-200">
              {physics.n.toExponential(2)}
            </span>
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-mono">cm⁻³</span>
        </div>

        {/* Hole Density p */}
        <div className="bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-400 block">
            {langMode === 'bn' ? 'মুক্ত হোল (p)' : 'Holes (p)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-mono font-black text-purple-900 dark:text-purple-200">
              {physics.p.toExponential(2)}
            </span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-mono">cm⁻³</span>
        </div>

        {/* Conductivity */}
        <div className="bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 rounded-xl p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-teal-400 block">
            {langMode === 'bn' ? 'পরিবাহিতা (σ)' : 'Conductivity (σ)'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-mono font-black text-teal-900 dark:text-teal-200">
              {physics.sigma.toExponential(2)}
            </span>
          </div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-mono">Ω⁻¹·cm⁻¹</span>
        </div>
      </div>

      {/* Interactive 2D Crystal Lattice Canvas */}
      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
          <span className="flex items-center gap-2 font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span>2D Covalent Bonding Crystal Lattice (Shared Electron Pairs)</span>
          </span>
          <span className="font-mono text-[11px] text-sky-400">
            {physics.carrierType}
          </span>
        </div>

        <div className="relative w-full aspect-[620/230] my-2">
          <svg viewBox="0 0 620 230" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="atomGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal covalent bonds */}
            {[0, 1, 2].map((r) => (
              <g key={`h-bond-${r}`}>
                <line x1="140" y1={50 + r * 70} x2="310" y2={50 + r * 70} stroke="#334155" strokeWidth="4" />
                <line x1="310" y1={50 + r * 70} x2="480" y2={50 + r * 70} stroke="#334155" strokeWidth="4" />
                {/* Electron pairs */}
                <circle cx={220} cy={46 + r * 70} r="3" fill="#38bdf8" />
                <circle cx={230} cy={54 + r * 70} r="3" fill="#38bdf8" />
                <circle cx={390} cy={46 + r * 70} r="3" fill="#38bdf8" />
                <circle cx={400} cy={54 + r * 70} r="3" fill="#38bdf8" />
              </g>
            ))}

            {/* Vertical covalent bonds */}
            {[0, 1, 2].map((c) => (
              <g key={`v-bond-${c}`}>
                <line x1={140 + c * 170} y1="50" x2={140 + c * 170} y2="120" stroke="#334155" strokeWidth="4" />
                <line x1={140 + c * 170} y1="120" x2={140 + c * 170} y2="190" stroke="#334155" strokeWidth="4" />
                {/* Electron pairs */}
                <circle cx={136 + c * 170} cy={80} r="3" fill="#38bdf8" />
                <circle cx={144 + c * 170} cy={90} r="3" fill="#38bdf8" />
                <circle cx={136 + c * 170} cy={150} r="3" fill="#38bdf8" />
                <circle cx={144 + c * 170} cy={160} r="3" fill="#38bdf8" />
              </g>
            ))}

            {/* Atoms */}
            {latticeAtoms.map((atom) => (
              <g key={atom.id} transform={`translate(${atom.x}, ${atom.y})`}>
                <circle cx="0" cy="0" r="22" fill="#0f172a" stroke={atom.color} strokeWidth="2.5" />
                <text x="0" y="4" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {atom.symbol}
                </text>
                <text x="12" y="-12" fill={atom.color} fontSize="9" fontWeight="bold" fontFamily="monospace">
                  {atom.charge}
                </text>
              </g>
            ))}

            {/* If Phosphorus (N-Type): 5th free electron loosely bound or conducting */}
            {dopingType === 'P' && (
              <g transform="translate(310, 120)">
                <circle
                  cx={35 + Math.sin(animTime * 3) * 6}
                  cy={-25 + Math.cos(animTime * 3) * 6}
                  r="5"
                  fill="#10b981"
                  filter="url(#atomGlow)"
                />
                <text x="45" y="-30" fill="#a7f3d0" fontSize="9" fontWeight="bold">
                  5th Extra e⁻ (Easily Freed)
                </text>
              </g>
            )}

            {/* If Boron (P-Type): Missing 4th electron creates a HOLE */}
            {dopingType === 'B' && (
              <g transform="translate(310, 120)">
                <circle cx="35" cy="0" r="6" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="2 2" />
                <text x="45" y="4" fill="#fde68a" fontSize="9" fontWeight="bold">
                  Hole Vacancy (+q)
                </text>
              </g>
            )}

            {/* Thermal Electron-Hole Pairs if T > 300K */}
            {physics.effectiveT >= 350 && (
              <g transform="translate(180, 80)">
                <circle cx={Math.sin(animTime * 2) * 20} cy={Math.cos(animTime * 2) * 15} r="4" fill="#38bdf8" filter="url(#atomGlow)" />
                <circle cx="-15" cy="35" r="5" fill="none" stroke="#a855f7" strokeWidth="2" />
                <text x="-40" y="55" fill="#c084fc" fontSize="9">Thermal e⁻/h⁺ Pair</text>
              </g>
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>Blue dots = Shared valence electrons in covalent octet bonds</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            Octet Rule: 4 core valence + 4 shared neighbors = 8 stable electrons
          </span>
        </div>
      </div>

      {/* Control Tabs */}
      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'swapper', labelEn: '🔄 Crystal & Doping Creator', labelBn: '🔄 ক্রিস্টাল মৌল ও ডোপিং নিয়ন্ত্রণ' },
              { id: 'variables', labelEn: '🎛️ Mass-Action Law (n·p = ni²)', labelBn: '🎛️ ভরক্রিয়া সূত্র (n·p = ni²)' },
              { id: 'faults', labelEn: '⚡ Extreme Physics & Thermal States', labelBn: '⚡ চরম তাপমাত্রা ও ফ্যান্টাসি টেস্ট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {langMode === 'bn' ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          {activeTab === 'swapper' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {/* Base Crystal Material */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-500" />
                  {langMode === 'bn' ? 'মূল ক্রিস্টাল মৌল:' : 'Base Semiconductor Lattice:'}
                </label>
                <select
                  value={baseMat}
                  onChange={(e) => setBaseMat(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="Si">Silicon (Si, Z=14) • Eg = 1.12 eV</option>
                  <option value="Ge">Germanium (Ge, Z=32) • Eg = 0.67 eV</option>
                  <option value="C">Diamond Carbon (C, Z=6) • Eg = 5.5 eV (Insulator)</option>
                </select>
              </div>

              {/* Doping Impurity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  {langMode === 'bn' ? 'ডোপিং অপদ্রব্য (Impurity):' : 'Doping Impurity Element:'}
                </label>
                <select
                  value={dopingType}
                  onChange={(e) => setDopingType(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="none">Pure Intrinsic (No Doping • n = p = ni)</option>
                  <option value="P">Phosphorus (P, Pentavalent Donor • N-Type)</option>
                  <option value="B">Boron (B, Trivalent Acceptor • P-Type)</option>
                </select>
                {dopingType !== 'none' && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">Conc:</span>
                    <input
                      type="range"
                      min="14"
                      max="18"
                      step="1"
                      value={dopingConcExp}
                      onChange={(e) => setDopingConcExp(Number(e.target.value))}
                      className="w-24 accent-emerald-500"
                    />
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">10^{dopingConcExp}</span>
                  </div>
                )}
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  {langMode === 'bn' ? 'ল্যাটিস তাপমাত্রা (Kelvin):' : 'Lattice Temperature (T):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="600"
                    step="25"
                    value={tempK}
                    onChange={(e) => setTempK(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs">{tempK}K</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {tempK === 0 ? '0K: Absolute zero, perfect insulator.' : tempK === 300 ? '300K: Standard room temperature.' : 'High temp: Thermal electron-hole generation.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'variables' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                n · p = n_i² (Mass-Action Law)  •  n_i ≈ {physics.ni.toExponential(2)} cm⁻³
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {langMode === 'bn' ? eli5.storyBn : eli5.storyEn}
              </p>
            </div>
          )}

          {activeTab === 'faults' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { id: 'zero_k', title: '🧊 Freeze to 0 Kelvin', desc: 'All valence electrons locked in covalent bonds: 0 carriers, absolute insulator.' },
                { id: 'thermal_runaway', title: '🔥 600 K Thermal Avalanche', desc: 'Thermal carrier generation floods lattice: intrinsic behavior overwhelms doping!' },
                { id: null, title: '✅ Nominal Equilibrium', desc: 'Restore standard room temperature equilibrium (300 K).' }
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
