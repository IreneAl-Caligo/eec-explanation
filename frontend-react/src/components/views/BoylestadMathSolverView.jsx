import React, { useState } from 'react';
import {
  Calculator, CheckCircle2, ChevronRight, BookOpen, RotateCcw,
  Sparkles, Zap, Activity, Cpu, HelpCircle, ArrowRight
} from 'lucide-react';
import MathView from '../MathView';
import { useLabStore } from '../../store/useLabStore';
import { playMechanicalClick } from '../../utils/audioEngine';

export default function BoylestadMathSolverView() {
  const { langMode } = useLabStore();
  const [activeSolver, setActiveSolver] = useState('zener'); // 'zener', 'bjt_divider', 'rectifier_filter'

  // ==========================================
  // 1. ZENER REGULATOR SOLVER STATE
  // ==========================================
  const [zenerParams, setZenerParams] = useState({
    vin: 16.0,
    rs: 220.0,
    rl: 470.0,
    vz: 10.0,
    pzMax: 500.0, // mW
  });

  const vThZener = (zenerParams.vin * zenerParams.rl) / (zenerParams.rs + zenerParams.rl);
  const isZenerOn = vThZener >= zenerParams.vz;
  const vlZener = isZenerOn ? zenerParams.vz : vThZener;
  const isZenerMa = ((zenerParams.vin - vlZener) / zenerParams.rs) * 1000.0;
  const ilZenerMa = (vlZener / zenerParams.rl) * 1000.0;
  const izZenerMa = isZenerOn ? Math.max(0, isZenerMa - ilZenerMa) : 0.0;
  const pzZenerMw = vlZener * izZenerMa;
  const isZenerSafe = pzZenerMw <= zenerParams.pzMax;

  // ==========================================
  // 2. BJT VOLTAGE DIVIDER BIAS STATE
  // ==========================================
  const [bjtParams, setBjtParams] = useState({
    vcc: 15.0,
    r1: 39000.0,
    r2: 8200.0,
    rc: 2200.0,
    re: 1000.0,
    beta: 120.0,
    vbe: 0.7,
  });

  const vThBjt = (bjtParams.vcc * bjtParams.r2) / (bjtParams.r1 + bjtParams.r2);
  const rThBjt = (bjtParams.r1 * bjtParams.r2) / (bjtParams.r1 + bjtParams.r2);
  const ibBjtMa = ((vThBjt - bjtParams.vbe) / (rThBjt + (bjtParams.beta + 1) * bjtParams.re)) * 1000.0;
  const icBjtMa = (bjtParams.beta * ibBjtMa);
  const icSatBjtMa = (bjtParams.vcc / (bjtParams.rc + bjtParams.re)) * 1000.0;
  const vceBjt = bjtParams.vcc - ((icBjtMa / 1000.0) * (bjtParams.rc + bjtParams.re));

  let bjtRegion = 'Active';
  if (ibBjtMa <= 0) bjtRegion = 'Cutoff (Zero Current)';
  else if (vceBjt <= 0.25 || icBjtMa >= icSatBjtMa) bjtRegion = 'Saturation (Maximum Current)';

  // ==========================================
  // 3. RECTIFIER RIPPLE & EFFICIENCY STATE
  // ==========================================
  const [rectParams, setRectParams] = useState({
    type: 'bridge',
    vm: 15.0,
    freq: 50.0,
    capUf: 470.0,
    rlOhm: 500.0,
  });

  const isFull = rectParams.type !== 'half';
  const effectiveFreq = isFull ? rectParams.freq * 2 : rectParams.freq;
  const vPeakDrop = rectParams.type === 'bridge' ? 1.4 : 0.7;
  const vPeakDc = Math.max(0, rectParams.vm - vPeakDrop);
  const cFarad = rectParams.capUf * 1e-6;

  const vrPeakToPeak = vPeakDc / (effectiveFreq * cFarad * rectParams.rlOhm);
  const vdcFiltered = Math.max(0, vPeakDc - (vrPeakToPeak / 2));
  const rippleFactorPct = (1 / (4 * Math.sqrt(3) * effectiveFreq * cFarad * rectParams.rlOhm)) * 100;
  const maxEfficiency = isFull ? 81.2 : 40.6;

  return (
    <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {langMode === 'bn' ? 'বয়েলস্টেড স্টেপ-বাই-স্টেপ ম্যাথ সলভার ডেক' : 'Boylestad Step-by-Step Circuit Math Solver'}
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Exam Precision
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'বয়েলস্টেডের পাঠ্যবইয়ের গাণিতিক উদাহরণ ও ফাইনাল পরীক্ষার প্রশ্নের সম্পূর্ণ সমাধান'
                : 'Exact textbook formula derivations, Thevenin equivalent steps, and safety checks'}
            </p>
          </div>
        </div>

        {/* Solver Selector Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { playMechanicalClick(); setActiveSolver('zener'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSolver === 'zener'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{langMode === 'bn' ? 'জেনার রেগুলেটর' : 'Zener Regulator'}</span>
          </button>

          <button
            onClick={() => { playMechanicalClick(); setActiveSolver('bjt_divider'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSolver === 'bjt_divider'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{langMode === 'bn' ? 'বিজেটি ভোল্টেজ ডিভাইডার' : 'BJT Voltage Divider'}</span>
          </button>

          <button
            onClick={() => { playMechanicalClick(); setActiveSolver('rectifier_filter'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSolver === 'rectifier_filter'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{langMode === 'bn' ? 'রেক্টিফায়ার ও ফিল্টার' : 'Rectifier & Filter'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ZENER REGULATOR SOLVER VIEW */}
      {/* ======================================================== */}
      {activeSolver === 'zener' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                {langMode === 'bn' ? 'ইনপুট মানসমূহ (Circuit Inputs)' : 'Circuit Inputs'}
              </span>
              <button
                onClick={() => setZenerParams({ vin: 16.0, rs: 220.0, rl: 470.0, vz: 10.0, pzMax: 500.0 })}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Reset Default
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Input DC Voltage (Vin):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{zenerParams.vin} V</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="0.5"
                  value={zenerParams.vin}
                  onChange={(e) => setZenerParams({ ...zenerParams, vin: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Series Resistor (Rs):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{zenerParams.rs} Ω</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={zenerParams.rs}
                  onChange={(e) => setZenerParams({ ...zenerParams, rs: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Load Resistor (RL):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{zenerParams.rl} Ω</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="20"
                  value={zenerParams.rl}
                  onChange={(e) => setZenerParams({ ...zenerParams, rl: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Zener Voltage Rating (Vz):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{zenerParams.vz} V</span>
                </label>
                <input
                  type="range"
                  min="3.3"
                  max="24"
                  step="0.1"
                  value={zenerParams.vz}
                  onChange={(e) => setZenerParams({ ...zenerParams, vz: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Max Zener Power (Pz,max):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">{zenerParams.pzMax} mW</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={zenerParams.pzMax}
                  onChange={(e) => setZenerParams({ ...zenerParams, pzMax: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Derivations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
                Step 1: Open-Circuit Thevenin Voltage (Vth)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {langMode === 'bn'
                  ? 'প্রথমে জেনার ডায়োডটি খুলে লোড রেজিস্টরের দুই প্রান্তের ওপেন-সার্কিট ভোল্টেজ নির্ণয় করি:'
                  : 'Remove the Zener diode and calculate the open-circuit Thevenin voltage across the load:'}
              </p>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
                <MathView math="V_{Th} = V_{in} \cdot \frac{R_L}{R_s + R_L}" />
                <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                  <MathView math={`V_{Th} = ${zenerParams.vin} \\times \\frac{${zenerParams.rl}}{${zenerParams.rs} + ${zenerParams.rl}} = ${vThZener.toFixed(2)}\\text{ V}`} />
                </div>
              </div>
            </div>

            <div className={`border-2 rounded-3xl p-5 shadow-sm space-y-3 ${
              isZenerOn
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400/80 dark:border-emerald-700'
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400/80 dark:border-rose-700'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  Step 2: Zener Conduction State (Vth vs Vz)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  isZenerOn ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {isZenerOn ? 'ZENER ON (REGULATING)' : 'ZENER OFF (NO BREAKDOWN)'}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                {isZenerOn ? (
                  langMode === 'bn' ? (
                    `যেহেতু ওপেন-সার্কিট ভোল্টেজ Vth (${vThZener.toFixed(2)}V) >= Vz (${zenerParams.vz}V), তাই জেনার ডায়োডটি রিভার্স ব্রেকডাউনে প্রবেশ করে সক্রিয় রয়েছে! লোড ভোল্টেজ স্থির থাকবে: VL = Vz = ${zenerParams.vz} V।`
                  ) : (
                    `Since Vth (${vThZener.toFixed(2)}V) >= Vz (${zenerParams.vz}V), the Zener diode enters reverse breakdown and turns ON. The load voltage is rigidly regulated: VL = Vz = ${zenerParams.vz} V.`
                  )
                ) : (
                  langMode === 'bn' ? (
                    `যেহেতু Vth (${vThZener.toFixed(2)}V) < Vz (${zenerParams.vz}V), তাই জেনার ব্রেকডাউনে পৌঁছাতে পারেনি (OFF)। ডায়োডের ভেতর দিয়ে কোনো কারেন্ট যাবে না (Iz = 0) এবং লোড ভোল্টেজ হবে: VL = Vth = ${vThZener.toFixed(2)} V।`
                  ) : (
                    `Since Vth (${vThZener.toFixed(2)}V) < Vz (${zenerParams.vz}V), the diode cannot break down (OFF). Zero Zener current flows (Iz = 0), and load voltage equals: VL = Vth = ${vThZener.toFixed(2)} V.`
                  )
                )}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
                Step 3: Branch Currents & Zener Power Dissipation
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Source Current (Is):</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{isZenerMa.toFixed(2)} mA</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Load Current (IL):</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{ilZenerMa.toFixed(2)} mA</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Zener Current (Iz):</span>
                  <span className="text-base font-bold text-amber-600 dark:text-amber-400">{izZenerMa.toFixed(2)} mA</span>
                </div>
                <div className={`p-3 rounded-2xl border ${
                  isZenerSafe
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300'
                }`}>
                  <span className="text-[10px] uppercase block font-sans font-bold">Zener Power (Pz):</span>
                  <span className="text-base font-bold">{pzZenerMw.toFixed(1)} mW</span>
                  <span className="text-[10px] block mt-0.5">{isZenerSafe ? '✓ Safe' : '⚠️ Exceeded!'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. BJT VOLTAGE DIVIDER BIAS VIEW */}
      {/* ======================================================== */}
      {activeSolver === 'bjt_divider' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
              BJT Circuit Parameters
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Supply Voltage (Vcc):</span>
                  <span className="font-mono text-indigo-600">{bjtParams.vcc} V</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={bjtParams.vcc}
                  onChange={(e) => setBjtParams({ ...bjtParams, vcc: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Divider R1:</span>
                  <span className="font-mono text-indigo-600">{(bjtParams.r1 / 1000).toFixed(1)} kΩ</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="1000"
                  value={bjtParams.r1}
                  onChange={(e) => setBjtParams({ ...bjtParams, r1: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Divider R2:</span>
                  <span className="font-mono text-indigo-600">{(bjtParams.r2 / 1000).toFixed(1)} kΩ</span>
                </label>
                <input
                  type="range"
                  min="2000"
                  max="30000"
                  step="500"
                  value={bjtParams.r2}
                  onChange={(e) => setBjtParams({ ...bjtParams, r2: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Collector Rc:</span>
                  <span className="font-mono text-indigo-600">{(bjtParams.rc / 1000).toFixed(1)} kΩ</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={bjtParams.rc}
                  onChange={(e) => setBjtParams({ ...bjtParams, rc: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Emitter Re:</span>
                  <span className="font-mono text-indigo-600">{(bjtParams.re / 1000).toFixed(1)} kΩ</span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={bjtParams.re}
                  onChange={(e) => setBjtParams({ ...bjtParams, re: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>DC Beta:</span>
                  <span className="font-mono text-indigo-600">{bjtParams.beta}</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="5"
                  value={bjtParams.beta}
                  onChange={(e) => setBjtParams({ ...bjtParams, beta: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
                Step 1: Exact Thevenin Equivalent of Base Divider
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Thevenin Voltage (Vth):</span>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-1">
                    <MathView math={`V_{Th} = V_{CC} \\frac{R_2}{R_1 + R_2} = ${vThBjt.toFixed(2)}\\text{ V}`} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Thevenin Resistance (Rth):</span>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-1">
                    <MathView math={`R_{Th} = R_1 \\parallel R_2 = ${(rThBjt / 1000).toFixed(2)}\\text{ k}\\Omega`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
                Step 2: Base Current (Ib) and Collector Current (Ic)
              </span>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
                <MathView math="I_B = \frac{V_{Th} - V_{BE}}{R_{Th} + (\beta + 1)R_E}" />
                <div className="text-indigo-600 dark:text-indigo-400 font-bold pt-1">
                  <MathView math={`I_B = ${(ibBjtMa * 1000).toFixed(2)}\\text{ }\\mu\\text{A}, \\quad I_C = \\beta I_B = ${icBjtMa.toFixed(2)}\\text{ mA}`} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  Step 3: Operating Q-Point (Vceq, Icq) & Region
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white">
                  {bjtRegion}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Q-Point Vceq:</span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{vceBjt.toFixed(2)} V</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Q-Point Icq:</span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{icBjtMa.toFixed(2)} mA</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Saturation Ic,sat:</span>
                  <span className="text-base font-bold text-slate-700 dark:text-slate-300">{icSatBjtMa.toFixed(2)} mA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. RECTIFIER RIPPLE & EFFICIENCY VIEW */}
      {/* ======================================================== */}
      {activeSolver === 'rectifier_filter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
              Rectifier & Filter Inputs
            </span>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Rectifier Circuit Type:
                </label>
                <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
                  {[
                    { id: 'half', label: 'Half-Wave' },
                    { id: 'full_ct', label: 'Center-Tap' },
                    { id: 'bridge', label: 'Bridge' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setRectParams({ ...rectParams, type: t.id })}
                      className={`py-1.5 rounded-xl border transition ${
                        rectParams.type === t.id
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Peak AC Voltage (Vm):</span>
                  <span className="font-mono text-cyan-600">{rectParams.vm} V</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={rectParams.vm}
                  onChange={(e) => setRectParams({ ...rectParams, vm: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Filter Capacitor (C):</span>
                  <span className="font-mono text-cyan-600">{rectParams.capUf} µF</span>
                </label>
                <input
                  type="range"
                  min="47"
                  max="2200"
                  step="50"
                  value={rectParams.capUf}
                  onChange={(e) => setRectParams({ ...rectParams, capUf: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Load Resistor (RL):</span>
                  <span className="font-mono text-cyan-600">{rectParams.rlOhm} Ω</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={rectParams.rlOhm}
                  onChange={(e) => setRectParams({ ...rectParams, rlOhm: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
                Step 1: Filtered DC Voltage & Ripple (Vr)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Filtered DC Voltage:</span>
                  <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm mt-1">
                    <MathView math={`V_{dc} \\approx V_m - \\frac{V_r(p-p)}{2} = ${vdcFiltered.toFixed(2)}\\text{ V}`} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Peak-to-Peak Ripple:</span>
                  <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm mt-1">
                    <MathView math={`V_r(p-p) = \\frac{V_{dc}}{2 f C R_L} = ${vrPeakToPeak.toFixed(2)}\\text{ V}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400 block border-b border-slate-100 dark:border-slate-800 pb-2">
                Step 2: Ripple Factor & Max Efficiency
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Ripple Factor (γ):</span>
                  <div className="font-bold text-amber-600 dark:text-amber-400 text-base mt-1">
                    <MathView math={`\\gamma = ${rippleFactorPct.toFixed(2)}\\%`} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block">Max Theoretical Efficiency:</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-base mt-1">
                    <MathView math={`\\eta_{max} = ${maxEfficiency}\\%`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
