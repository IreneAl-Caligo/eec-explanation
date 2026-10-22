import React, { useState, useEffect } from 'react';
import { Terminal, Play, CheckCircle2, Cloud, HardDrive, RefreshCw, Copy, Check } from 'lucide-react';
import { generateSpiceNetlist, runSpiceSimulation } from '../../utils/spiceEngine';
import { playMechanicalClick, playSuccessChime } from '../../utils/audioEngine';

export default function SpiceNetlistInspector({ langMode = 'dual', defaultType = 'diode_half_wave' }) {
  const [circuitType, setCircuitType] = useState(defaultType);
  const [netlist, setNetlist] = useState('');
  const [simResults, setSimResults] = useState(null);
  const [isSolving, setIsSolving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNetlist(generateSpiceNetlist(circuitType));
    setSimResults(null);
  }, [circuitType]);

  const handleRunSimulation = async () => {
    playMechanicalClick();
    setIsSolving(true);
    const res = await runSpiceSimulation(circuitType);
    setSimResults(res);
    setIsSolving(false);
    playSuccessChime();
  };

  const handleCopyNetlist = () => {
    playMechanicalClick();
    navigator.clipboard.writeText(netlist);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 text-white">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg tracking-tight flex items-center gap-2">
              {langMode === 'bn' ? 'এসপিসাইস (SPICE) নেট-লিস্ট ও সিমুলেশন ইঞ্জিন' : 'SPICE Netlist & Simulation Solver Engine'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                Berkeley SPICE 3f5 / ngspice
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {langMode === 'bn'
                ? 'ক্লাউড পাইথন ngspice ব্যাকএন্ড অথবা ব্রাউজার-সাইড নিউটন-র‌্যাফসন সলভারের মাধ্যমে বিশ্লেষণ'
                : 'Executed via Python FastAPI backend or high-precision local numerical solver'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyNetlist}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Netlist'}</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSolving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black flex items-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50"
          >
            {isSolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{langMode === 'bn' ? 'সিমুলেশন চালান' : 'Run SPICE Solver'}</span>
          </button>
        </div>
      </div>

      {/* Circuit Netlist Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <span className="text-slate-400 uppercase text-[11px] shrink-0">Circuit:</span>
        {[
          { id: 'diode_half_wave', label: 'Diode Rectifier (D1N4007)' },
          { id: 'zener_regulator', label: 'Zener Regulator (D1N750 6.8V)' },
          { id: 'bjt_ce_amp', label: 'BJT CE Amplifier (Q2N2222)' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              playMechanicalClick();
              setCircuitType(c.id);
            }}
            className={`px-3 py-1.5 rounded-xl border transition shrink-0 ${
              circuitType === c.id
                ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Code Viewer & Results Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Raw SPICE Netlist (.cir) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>SPICE Input Netlist (.cir):</span>
            <span className="text-[10px] text-slate-500 font-mono">Nodes: 0 (GND), 1, 2...</span>
          </span>
          <pre className="p-4 rounded-2xl bg-[#030712] border border-slate-800 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner h-[220px]">
            {netlist}
          </pre>
        </div>

        {/* Right: Simulation Output Matrix */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>Numerical Solver Output:</span>
            {simResults && (
              <span className="text-[10px] font-mono flex items-center gap-1 text-emerald-400">
                {simResults.source === 'cloud_python_backend' ? (
                  <>
                    <Cloud className="w-3 h-3 text-sky-400" /> Python ngspice API
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3 h-3 text-indigo-400" /> Local Newton-Raphson Engine
                  </>
                )}
              </span>
            )}
          </span>

          <div className="p-4 rounded-2xl bg-[#030712] border border-slate-800 text-xs font-mono h-[220px] overflow-y-auto space-y-2 shadow-inner">
            {!simResults ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Terminal className="w-8 h-8 text-slate-700" />
                <p>Click "Run SPICE Solver" to calculate node voltages and currents</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-slate-300">
                <div className="text-indigo-400 font-bold border-b border-slate-800 pb-1">
                  == SPICE DC / TRANSIENT CONVERGENCE COMPLETED ==
                </div>
                {Object.entries(simResults.data).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-0.5 border-b border-slate-900">
                    <span className="text-slate-400 font-mono">{key}:</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
