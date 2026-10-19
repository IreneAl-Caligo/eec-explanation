import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sliders, Zap, Activity, AlertTriangle, Play, Pause, RotateCcw,
  Sparkles, CheckCircle2, Info, ArrowRight, Sun, Layers, HelpCircle,
  Eye, RefreshCw, Cpu, Gauge, BookOpen
} from 'lucide-react';
import ComponentInspectorModal from './ComponentInspectorModal';

export const COMPONENT_CATALOG = {
  sources: [
    { id: 'dc', name: 'DC Voltage Supply', type: 'source', icon: '🔋', desc: 'Constant DC electromotive force (-25V to +30V)' },
    { id: 'ac', name: 'AC Sine Wave Generator', type: 'source', icon: '〰️', desc: 'Alternating sinusoidal voltage (0–25V pk, 10–120Hz)' },
    { id: 'square', name: 'Square Pulse Generator', type: 'source', icon: '⎍', desc: 'Digital switching square wave (0V / +5V)' },
  ],
  series: [
    { id: 'si_diode', name: 'Silicon Diode (1N4007)', vk: 0.7, mat: 'Si', icon: '▶️|', desc: 'Standard rectifier diode, Knee Vk ≈ 0.7V, high PIV' },
    { id: 'ge_diode', name: 'Germanium Diode (1N34A)', vk: 0.3, mat: 'Ge', icon: '▶️|', desc: 'Low barrier diode, Knee Vk ≈ 0.3V, higher reverse leakage' },
    { id: 'schottky', name: 'Schottky Diode (BAT85)', vk: 0.2, mat: 'Metal-Si', icon: '⚡|', desc: 'Metal-semiconductor junction, Vk ≈ 0.2V, ultra-fast switching' },
    { id: 'zener', name: 'Zener Diode (BZX55)', vk: 0.7, vz: 6.8, icon: 'Z|', desc: 'Regulator diode with controlled reverse breakdown Vz = 6.8V' },
    { id: 'led_red', name: 'Red LED (GaAsP)', vk: 1.8, color: '#ef4444', icon: '💡', desc: 'Light Emitting Diode, Vf ≈ 1.8V, emits 650nm red photons' },
    { id: 'led_green', name: 'Green LED (GaP)', vk: 2.2, color: '#22c55e', icon: '💡', desc: 'Light Emitting Diode, Vf ≈ 2.2V, emits 565nm green photons' },
    { id: 'led_blue', name: 'Blue LED (InGaN)', vk: 3.1, color: '#3b82f6', icon: '💡', desc: 'Light Emitting Diode, Vf ≈ 3.1V, emits 470nm blue photons' },
    { id: 'resistor', name: 'Series Resistor (Rs)', icon: '⟿', desc: 'Pure ohmic linear resistance to limit circuit current' },
    { id: 'wire', name: 'Jumper Wire (Short)', icon: '━', desc: 'Zero ohm direct connection' },
    { id: 'open', name: 'Open Air Gap / Blown Fuse', icon: '╌ ╌', desc: 'Infinite resistance, complete circuit interruption' },
  ],
  shunts: [
    { id: 'none', name: 'None (Direct Path)', icon: '∅', desc: 'No parallel shunt component' },
    { id: 'zener_clamp', name: 'Zener Diode (Reverse Clamp)', vz: 6.8, icon: '⏚_Z', desc: 'Clamps parallel voltage to Vz in reverse breakdown' },
    { id: 'capacitor', name: 'Filter Capacitor (C)', icon: '⏚_||', desc: 'Stores charge on peaks and discharges to smooth DC ripple' },
    { id: 'led_indicator', name: 'Shunt LED Indicator', vk: 2.0, color: '#eab308', icon: '⏚_💡', desc: 'Visual parallel indicator lamp' },
    { id: 'shunt_resistor', name: 'Bleeder Resistor', icon: '⏚_R', desc: 'Parallel discharge path' },
  ],
  loads: [
    { id: 'resistor', name: 'Resistive Load (RL)', icon: 'RL', desc: 'Standard variable load resistance (10Ω – 100kΩ)' },
    { id: 'heavy', name: 'Heavy Load (100Ω)', rl: 100, icon: '⚡⚡', desc: 'Draws high current, tests supply regulation' },
    { id: 'light', name: 'Light Load (10kΩ)', rl: 10000, icon: '⚡', desc: 'Draws small current, near ideal open circuit' },
    { id: 'short', name: 'Short Circuit (0Ω Fault)', rl: 0, icon: '💥', desc: 'Zero resistance fault! Extreme current overload test' },
    { id: 'open_load', name: 'Open Circuit (No Load)', rl: 1e9, icon: '∞Ω', desc: 'Infinite load impedance, tests no-load terminal voltage' },
  ]
};

export default function CircuitSandboxLab({ onSelectTopic }) {
  // Circuit Element Slots
  const [sourceType, setSourceType] = useState('dc'); // 'dc' | 'ac' | 'square'
  const [seriesElem, setSeriesElem] = useState('si_diode'); // key from COMPONENT_CATALOG.series
  const [shuntElem, setShuntElem] = useState('none'); // key from COMPONENT_CATALOG.shunts
  const [loadElem, setLoadElem] = useState('resistor'); // key from COMPONENT_CATALOG.loads

  // Parameter Controls
  const [vinDc, setVinDc] = useState(12.0); // -25V to +30V
  const [vinAcPeak, setVinAcPeak] = useState(15.0); // 1V to 25V
  const [freqHz, setFreqHz] = useState(50); // 10Hz to 120Hz
  const [rsVal, setRsVal] = useState(220); // 10Ω to 5000Ω
  const [rlVal, setRlVal] = useState(1000); // 10Ω to 50000Ω
  const [capValUf, setCapValUf] = useState(100); // 0 to 1000 uF
  const [zenerVz, setZenerVz] = useState(6.8); // 2.4V to 24V
  const [tempK, setTempK] = useState(300); // 0K to 500K
  const [isPlaying, setIsPlaying] = useState(true);
  const [inspectedKey, setInspectedKey] = useState(null);

  // Active Element Picker Modal / Popover
  const [pickerSlot, setPickerSlot] = useState(null); // 'source' | 'series' | 'shunt' | 'load' | null

  // Real-time animation tick
  const [simTime, setSimTime] = useState(0);
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimTime((t) => (t + 1) % 1000);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Selected element definitions
  const activeSeries = COMPONENT_CATALOG.series.find((c) => c.id === seriesElem) || COMPONENT_CATALOG.series[0];
  const activeShunt = COMPONENT_CATALOG.shunts.find((c) => c.id === shuntElem) || COMPONENT_CATALOG.shunts[0];
  const activeLoad = COMPONENT_CATALOG.loads.find((c) => c.id === loadElem) || COMPONENT_CATALOG.loads[0];

  // Effective Load resistance
  const effRl = activeLoad.rl !== undefined ? activeLoad.rl : rlVal;

  // Temperature adjustments: Vt = kT/q (approx 26mV at 300K)
  const vtMv = (tempK / 300) * 25.85;
  // Knee voltage temp coefficient: -2 mV per °C above 25°C (298K)
  const tempDeltaC = (tempK - 298.15);
  const vkShift = (tempDeltaC * 0.002);
  const effVk = Math.max(0.05, (activeSeries.vk || 0.7) - vkShift);

  // Instantaneous Input Voltage at simTime
  const instVin = useMemo(() => {
    if (sourceType === 'dc') return vinDc;
    const omega = 2 * Math.PI * (freqHz / 10);
    const tSec = (simTime * 0.04);
    if (sourceType === 'ac') {
      return vinAcPeak * Math.sin(omega * tSec);
    }
    // square wave
    return Math.sin(omega * tSec) >= 0 ? vinAcPeak : 0;
  }, [sourceType, vinDc, vinAcPeak, freqHz, simTime]);

  // Comprehensive Solver for Instantaneous Circuit State
  const circuitState = useMemo(() => {
    const vin = instVin;
    let vLoad = 0;
    let iCircuitMa = 0;
    let statusText = '';
    let statusBn = '';
    let isForward = false;
    let isZenerBreakdown = false;
    let isOverload = false;
    let diagPhysics = '';
    let diagBn = '';

    // Check Short Circuit Fault
    if (effRl === 0) {
      isOverload = true;
      iCircuitMa = (vin / rsVal) * 1000;
      vLoad = 0;
      statusText = '⚠️ CRITICAL: Short Circuit Fault!';
      statusBn = '⚠️ মারাত্মক ত্রুটি: লোড শর্ট-সার্কিট (Short Circuit)!';
      diagPhysics = 'Zero load resistance causes infinite load demand. All input voltage drops across Rs, resulting in massive current spike and thermal burnout risk!';
      diagBn = 'লোডের রোধ ০ ওহম হওয়ায় অতিরিক্ত বিদ্যুৎ প্রবাহিত হচ্ছে। রেজিস্টর Rs পুড়ে যাওয়ার ঝুঁকি তৈরি হয়েছে!';
      return { vin, vLoad, iCircuitMa, isForward, isZenerBreakdown, isOverload, statusText, statusBn, diagPhysics, diagBn };
    }

    // Check Open Circuit Series
    if (activeSeries.id === 'open') {
      vLoad = 0;
      iCircuitMa = 0;
      statusText = 'Circuit Broken (Open Air Gap / Blown Fuse)';
      statusBn = 'সার্কিট বিচ্ছিন্ন (ওপেন সার্কিট / ফিউজ কেটে গেছে)';
      diagPhysics = 'The series path contains an air gap (infinite resistance). No electric current can flow, and output voltage is strictly 0.0 V.';
      diagBn = 'সিরিজে বাতাস বা ওপেন সার্কিট থাকায় কোনো কারেন্ট প্রবাহিত হতে পারছে না এবং আউটপুট ভোল্টেজ ০.০ ভোল্ট।';
      return { vin, vLoad, iCircuitMa, isForward, isZenerBreakdown, isOverload, statusText, statusBn, diagPhysics, diagBn };
    }

    // 1. Standard Pure Resistor Series
    if (activeSeries.id === 'resistor' || activeSeries.id === 'wire') {
      const seriesR = activeSeries.id === 'wire' ? 0 : rsVal;
      const totalR = seriesR + effRl;
      vLoad = (vin * effRl) / totalR;
      iCircuitMa = (vin / totalR) * 1000;
      statusText = 'Linear Ohmic Conduction (Ohm\'s Law)';
      statusBn = 'ওহমিক পরিবহন (ওহমের সূত্রানুযায়ী)';
      diagPhysics = `Current obeys Ohm's Law strictly (I = Vin / (Rs + RL)). Voltage divides linearly across resistors.`;
      diagBn = `ভোল্টেজ ও রোধের আনুপাতিক হারে কারেন্ট প্রবাহিত হচ্ছে (I = Vin / R)। কোনো সেমিকন্ডাক্টর বাধা নেই।`;
    } 
    // 2. Semiconductor Diodes & LEDs (Si, Ge, Schottky, LED, Zener)
    else {
      // Is it a diode forward biased?
      if (vin > effVk) {
        isForward = true;
        const netV = vin - effVk;
        const totalR = rsVal + effRl;
        vLoad = (netV * effRl) / totalR;
        iCircuitMa = (netV / totalR) * 1000;
        statusText = `Forward Conduction Active (Vk = ${effVk.toFixed(2)}V)`;
        statusBn = `ফরোয়ার্ড বায়াসে বিদ্যুৎ পরিবাহী (Knee ভোল্টেজ = ${effVk.toFixed(2)}V)`;
        diagPhysics = `Input voltage exceeds barrier potential Vk (${effVk.toFixed(2)}V). Depletion region has collapsed, permitting heavy majority carrier diffusion current!`;
        diagBn = `ইনপুট ভোল্টেজ ব্যারিয়ার পটেনশিয়াল (${effVk.toFixed(2)}V) অতিক্রম করায় ডিপ্লিশন স্তর ভেঙে গিয়ে অবাধে বিদ্যুৎ প্রবাহিত হচ্ছে।`;
      } 
      // Reverse Biased or Below Knee
      else if (vin >= 0) {
        vLoad = 0;
        iCircuitMa = 0;
        statusText = `Forward Sub-Threshold (Below Knee Vk = ${effVk.toFixed(2)}V)`;
        statusBn = `Knee ভোল্টেজের নিচে (বিদ্যুৎ প্রবাহ বন্ধ)`;
        diagPhysics = `Vin (${vin.toFixed(2)}V) is insufficient to overcome the internal junction potential barrier (${effVk.toFixed(2)}V). Conduction current is essentially zero.`;
        diagBn = `ইনপুট ভোল্টেজ ডায়োডের অভ্যন্তরীণ বাধা অতিক্রম করতে পারছে না, তাই কোনো বিদ্যুৎ প্রবাহিত হচ্ছে না।`;
      } 
      // Reverse Biased (vin < 0)
      else {
        // Check Zener breakdown if series is zener
        const revV = Math.abs(vin);
        const vzTarget = activeSeries.vz || zenerVz;
        if (activeSeries.id === 'zener' && revV >= vzTarget) {
          isZenerBreakdown = true;
          const netV = revV - vzTarget;
          const totalR = rsVal + effRl;
          vLoad = -(netV * effRl) / totalR;
          iCircuitMa = -(netV / totalR) * 1000;
          statusText = `Zener Avalanche Breakdown (Vz = -${vzTarget.toFixed(1)}V)`;
          statusBn = `জেনার ব্রেকডাউন (রিভার্স স্যাচুরেশন অতিক্রম)`;
          diagPhysics = `High reverse electric field strips valence electrons via quantum tunneling and avalanche multiplication. Diode conducts heavily in reverse!`;
          diagBn = `তীব্র রিভার্স ভোল্টেজের কারণে জেনার ব্রেকডাউন ঘটেছে এবং রিভার্স দিকে প্রচুর বিদ্যুৎ প্রবাহিত হচ্ছে।`;
        } else {
          // Normal reverse bias blocking
          vLoad = 0;
          const isNano = tempK > 350 ? -0.05 : -0.00001; // thermal leakage
          iCircuitMa = isNano;
          statusText = 'Reverse Biased — Current Blocked';
          statusBn = 'রিভার্স বায়াস — ডিপ্লিশন স্তর চওড়া (কারেন্ট ব্লক)';
          diagPhysics = `Reverse polarity widens the PN depletion region. External electric field reinforces barrier potential. Only minute minority leakage current (Is) flows.`;
          diagBn = `রিভার্স বায়াসের কারণে ডিপ্লিশন অঞ্চল চওড়া হয়ে গেছে, ফলে বিপরীত দিকে কোনো মূল বিদ্যুৎ প্রবাহিত হতে পারছে না।`;
        }
      }
    }

    // 3. Shunt Component Influence (e.g. Zener Clamp or Filter Capacitor)
    if (activeShunt.id === 'zener_clamp') {
      const clampV = activeShunt.vz || zenerVz;
      if (vLoad > clampV) {
        vLoad = clampV;
        statusText += ` → Clamped by Parallel Zener at ${clampV.toFixed(1)}V!`;
        statusBn += ` → সমান্তরাল জেনার ডায়োড ভোল্টেজকে ${clampV.toFixed(1)}V-এ আটকে রেখেছে!`;
        diagPhysics += ` The parallel Zener entered reverse breakdown, clamping load voltage VL rigidly to ${clampV.toFixed(1)}V and shunting excess current to ground.`;
        diagBn += ` প্যারালাল জেনার ডায়োড অন হয়ে লোড ভোল্টেজকে নির্দিষ্ট মানে স্থির রেখেছে।`;
      }
    } else if (activeShunt.id === 'capacitor' && sourceType !== 'dc') {
      // Capacitor filter smoothing math
      // V_ripple ≈ V_peak / (2 * f * R_L * C)
      const cFarad = Math.max(1, capValUf) * 1e-6;
      const rippleV = Math.min(vinAcPeak, vinAcPeak / (2 * freqHz * effRl * cFarad));
      const smoothedVdc = Math.max(0, vinAcPeak - effVk - rippleV / 2);
      vLoad = smoothedVdc;
      statusText = `Capacitive Filter Smoothing (Ripple ≈ ${(rippleV).toFixed(2)}V)`;
      statusBn = `ক্যাপাসিটর ফিল্টারিং (স্মুথ ডিসি তৈরি হচ্ছে)`;
      diagPhysics = `Filter capacitor (${capValUf}µF) charges to peak voltage on positive half-cycles and discharges slowly into RL (tau = RL*C), smoothing AC pulsations into steady DC!`;
      diagBn = `ফিল্টার ক্যাপাসিটর চার্জ ধরে রেখে আউটপুটের রিপল কমিয়ে মসৃণ ডিসি (DC) ভোল্টেজে রূপান্তর করছে।`;
    }

    return {
      vin,
      vLoad,
      iCircuitMa,
      isForward,
      isZenerBreakdown,
      isOverload,
      statusText,
      statusBn,
      diagPhysics,
      diagBn
    };
  }, [instVin, activeSeries, activeShunt, activeLoad, rsVal, effRl, effVk, zenerVz, tempK, sourceType, vinAcPeak, freqHz, capValUf]);

  // Waveform history for Oscilloscope (simulated real-time trace)
  const [waveHistory, setWaveHistory] = useState([]);
  useEffect(() => {
    setWaveHistory((prev) => {
      const next = [...prev, { vin: circuitState.vin, vout: circuitState.vLoad, i: circuitState.iCircuitMa }];
      if (next.length > 50) next.shift();
      return next;
    });
  }, [circuitState]);

  // Quick Preset Handlers
  const applyPreset = (presetKey) => {
    if (presetKey === 'si_vs_ge') {
      setSourceType('dc');
      setVinDc(0.5);
      setSeriesElem('si_diode');
      setShuntElem('none');
      setLoadElem('resistor');
      setRsVal(220);
      setRlVal(1000);
    } else if (presetKey === 'zener_reg') {
      setSourceType('dc');
      setVinDc(15.0);
      setSeriesElem('resistor');
      setShuntElem('zener_clamp');
      setZenerVz(6.8);
      setLoadElem('resistor');
      setRsVal(220);
      setRlVal(470);
    } else if (presetKey === 'rectifier_filter') {
      setSourceType('ac');
      setVinAcPeak(16.0);
      setFreqHz(50);
      setSeriesElem('si_diode');
      setShuntElem('capacitor');
      setCapValUf(220);
      setLoadElem('resistor');
      setRlVal(1000);
    } else if (presetKey === 'led_color') {
      setSourceType('dc');
      setVinDc(3.3);
      setSeriesElem('led_green');
      setShuntElem('none');
      setLoadElem('resistor');
      setRsVal(150);
      setRlVal(10);
    } else if (presetKey === 'overload') {
      setSourceType('dc');
      setVinDc(10.0);
      setSeriesElem('resistor');
      setLoadElem('short');
      setRsVal(100);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6 space-y-6 text-slate-800">
      {/* Top Banner / Sandbox Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Sliders className="w-5 h-5" />
            </span>
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900">
              Universal Modular Circuit & Semiconductor Sandbox
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Component Swapping & Experimenter
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Replace any element, control input voltages, swap materials (Si / Ge / Schottky / Zener / LED), and watch the physics react in real-time.
          </p>
        </div>

        {/* Preset Experiments */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Experiments:
          </span>
          {[
            { id: 'si_vs_ge', label: 'Diode Knee (Si vs Ge)' },
            { id: 'zener_reg', label: 'Zener Regulator (6.8V)' },
            { id: 'rectifier_filter', label: 'AC Rectifier + Capacitor' },
            { id: 'led_color', label: 'LED Emission (Green)' },
            { id: 'overload', label: 'Short-Circuit Fault Test' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Component & Physics Inspector Quick Bar (Click any element to see Name, Definition & Explanation) */}
      <div className="bg-slate-50 border border-indigo-100 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Click any component below to inspect its Name, Definition & Physical Explanation:
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Boylestad 11th Ed. Aligned</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'si_diode', label: 'Silicon Diode (0.7V)' },
            { id: 'ge_diode', label: 'Germanium Diode (0.3V)' },
            { id: 'schottky', label: 'Schottky Diode' },
            { id: 'zener', label: 'Zener Diode (Vz)' },
            { id: 'led', label: 'LED (Electroluminescence)' },
            { id: 'capacitor', label: 'Smoothing Filter Capacitor' },
            { id: 'resistor', label: 'Series & Load Resistors (Rs, RL)' },
            { id: 'dc_source', label: 'DC Voltage Supply' },
            { id: 'ac_source', label: 'AC Sinusoidal Generator' },
            { id: 'depletion_region', label: 'Depletion Layer & Barrier Potential' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setInspectedKey(item.id)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 text-xs font-medium transition shadow-2xs flex items-center gap-1.5 group"
            >
              <span>{item.label}</span>
              <Info className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Breadboard / Circuit Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visual Circuit Schematic (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-4 circuit-grid overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" /> Interactive Breadboard Schematic
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">Click any symbol to swap element</span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
              </div>
            </div>

            {/* SVG Schematic Diagram */}
            <svg viewBox="0 0 700 320" className="w-full h-auto bg-white rounded-xl border border-slate-200 shadow-xs">
              {/* Background Reference Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                </pattern>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Main Conducting Loop Copper Traces */}
              {/* Top Rail: Source -> Series -> Shunt -> Load */}
              <line x1="80" y1="120" x2="200" y2="120" stroke="#0ea5e9" strokeWidth="3" />
              <line x1="280" y1="120" x2="420" y2="120" stroke="#0ea5e9" strokeWidth="3" />
              <line x1="420" y1="120" x2="560" y2="120" stroke="#10b981" strokeWidth="3" />

              {/* Shunt Branch (Vertical) */}
              <line x1="420" y1="120" x2="420" y2="240" stroke="#64748b" strokeWidth="3" strokeDasharray={shuntElem === 'none' ? '4 4' : 'none'} />

              {/* Load Branch (Vertical) */}
              <line x1="560" y1="120" x2="560" y2="240" stroke="#10b981" strokeWidth="3" />

              {/* Bottom Ground Rail */}
              <line x1="80" y1="240" x2="560" y2="240" stroke="#475569" strokeWidth="3" />
              {/* Ground Symbol at (80, 240) */}
              <line x1="80" y1="240" x2="80" y2="260" stroke="#475569" strokeWidth="3" />
              <line x1="68" y1="260" x2="92" y2="260" stroke="#475569" strokeWidth="3" />
              <line x1="72" y1="266" x2="88" y2="266" stroke="#475569" strokeWidth="2" />
              <line x1="76" y1="272" x2="84" y2="272" stroke="#475569" strokeWidth="1.5" />

              {/* Animated Current Particles (Dots flowing if circuit conducts) */}
              {Math.abs(circuitState.iCircuitMa) > 0.001 && isPlaying && (
                <>
                  <circle cx={80 + ((simTime * 4) % 120)} cy="120" r="3.5" fill="#38bdf8" />
                  <circle cx={280 + ((simTime * 4) % 140)} cy="120" r="3.5" fill="#38bdf8" />
                  <circle cx={420 + ((simTime * 4) % 140)} cy="120" r="3.5" fill="#10b981" />
                  <circle cx="560" cy={120 + ((simTime * 3) % 120)} r="3.5" fill="#10b981" />
                  <circle cx={560 - ((simTime * 4) % 480)} cy="240" r="3.5" fill="#475569" />
                </>
              )}

              {/* ================= SLOT 1: POWER SOURCE (X: 80, Y: 180) ================= */}
              <g
                className="cursor-pointer group"
                onClick={() => setPickerSlot('source')}
              >
                <circle cx="80" cy="180" r="30" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2.5" />
                {sourceType === 'dc' ? (
                  <>
                    <text x="80" y="174" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0284c7">+</text>
                    <text x="80" y="194" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0284c7">-</text>
                  </>
                ) : sourceType === 'ac' ? (
                  <path d="M 68 180 Q 74 168 80 180 T 92 180" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                ) : (
                  <path d="M 68 186 L 68 174 L 80 174 L 80 186 L 92 186" fill="none" stroke="#0284c7" strokeWidth="2" />
                )}
                <rect x="35" y="215" width="90" height="20" rx="4" fill="#e0f2fe" stroke="#7dd3fc" />
                <text x="80" y="229" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
                  {sourceType.toUpperCase()}: {circuitState.vin.toFixed(1)}V
                </text>
              </g>

              {/* ================= SLOT 2: SERIES COMPONENT (X: 240, Y: 120) ================= */}
              <g
                className="cursor-pointer group"
                onClick={() => setPickerSlot('series')}
              >
                <rect x="200" y="95" width="80" height="50" rx="8" fill="#f8fafc" stroke="#6366f1" strokeWidth="2" strokeDasharray="3 3" className="group-hover:stroke-indigo-600" />
                
                {/* Diode / Zener / LED Representation */}
                {(activeSeries.id.includes('diode') || activeSeries.id.includes('led') || activeSeries.id === 'zener' || activeSeries.id === 'schottky') && (
                  <g transform="translate(225, 105)">
                    {/* Triangle */}
                    <polygon points="5,5 5,25 25,15" fill={circuitState.isForward ? '#6366f1' : '#94a3b8'} stroke="#4f46e5" strokeWidth="1.5" />
                    {/* Cathode Line */}
                    <line x1="25" y1="5" x2="25" y2="25" stroke="#4f46e5" strokeWidth="2.5" />
                    {/* Zener bent fins */}
                    {activeSeries.id === 'zener' && (
                      <>
                        <line x1="25" y1="5" x2="20" y2="2" stroke="#4f46e5" strokeWidth="2" />
                        <line x1="25" y1="25" x2="30" y2="28" stroke="#4f46e5" strokeWidth="2" />
                      </>
                    )}
                    {/* LED photon arrows */}
                    {activeSeries.id.includes('led') && circuitState.isForward && (
                      <g stroke={activeSeries.color || '#ef4444'} strokeWidth="1.5" filter="url(#glow)">
                        <line x1="18" y1="4" x2="26" y2="-4" />
                        <line x1="24" y1="4" x2="32" y2="-4" />
                        <polygon points="26,-4 22,-3 25,0" fill={activeSeries.color || '#ef4444'} />
                        <polygon points="32,-4 28,-3 31,0" fill={activeSeries.color || '#ef4444'} />
                      </g>
                    )}
                  </g>
                )}

                {/* Resistor symbol */}
                {activeSeries.id === 'resistor' && (
                  <path d="M 215 120 L 222 110 L 230 130 L 238 110 L 246 130 L 254 110 L 262 120" fill="none" stroke="#6366f1" strokeWidth="2.5" />
                )}

                {/* Wire symbol */}
                {activeSeries.id === 'wire' && (
                  <line x1="200" y1="120" x2="280" y2="120" stroke="#6366f1" strokeWidth="4" />
                )}

                {/* Open / blown fuse */}
                {activeSeries.id === 'open' && (
                  <>
                    <circle cx="225" cy="120" r="3" fill="#ef4444" />
                    <circle cx="255" cy="120" r="3" fill="#ef4444" />
                    <text x="240" y="112" textAnchor="middle" fontSize="12" fill="#ef4444" fontWeight="bold">✕</text>
                  </>
                )}

                <rect x="200" y="148" width="80" height="18" rx="4" fill="#eef2ff" stroke="#c7d2fe" />
                <text x="240" y="161" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#4338ca">
                  {activeSeries.name.split(' ')[0]} ({activeSeries.vk ? `${effVk.toFixed(2)}V` : `${rsVal}Ω`})
                </text>
              </g>

              {/* ================= SLOT 3: SHUNT COMPONENT (X: 420, Y: 180) ================= */}
              <g
                className="cursor-pointer group"
                onClick={() => setPickerSlot('shunt')}
              >
                <circle cx="420" cy="180" r="24" fill="#f8fafc" stroke="#8b5cf6" strokeWidth="2" strokeDasharray={shuntElem === 'none' ? '3 3' : 'none'} className="group-hover:stroke-purple-600" />
                {shuntElem === 'none' ? (
                  <text x="420" y="185" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="bold">Open</text>
                ) : shuntElem === 'capacitor' ? (
                  <g>
                    <line x1="410" y1="174" x2="430" y2="174" stroke="#8b5cf6" strokeWidth="3" />
                    <line x1="410" y1="184" x2="430" y2="184" stroke="#8b5cf6" strokeWidth="3" />
                  </g>
                ) : shuntElem === 'zener_clamp' ? (
                  <g transform="translate(410, 168)">
                    <polygon points="5,20 15,20 10,5" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="1.5" />
                    <line x1="5" y1="5" x2="15" y2="5" stroke="#7c3aed" strokeWidth="2" />
                    <line x1="5" y1="5" x2="2" y2="2" stroke="#7c3aed" strokeWidth="1.5" />
                    <line x1="15" y1="5" x2="18" y2="8" stroke="#7c3aed" strokeWidth="1.5" />
                  </g>
                ) : (
                  <text x="420" y="184" textAnchor="middle" fontSize="12" fill="#8b5cf6">⚡</text>
                )}
                <rect x="375" y="208" width="90" height="18" rx="4" fill="#f5f3ff" stroke="#ddd6fe" />
                <text x="420" y="221" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#6d28d9">
                  {shuntElem === 'none' ? 'No Shunt' : shuntElem === 'capacitor' ? `Cap: ${capValUf}µF` : `Zener: ${zenerVz}V`}
                </text>
              </g>

              {/* ================= SLOT 4: LOAD COMPONENT (X: 560, Y: 180) ================= */}
              <g
                className="cursor-pointer group"
                onClick={() => setPickerSlot('load')}
              >
                <rect x="540" y="150" width="40" height="60" rx="6" fill="#f8fafc" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-emerald-600" />
                {activeLoad.id === 'short' ? (
                  <line x1="560" y1="150" x2="560" y2="210" stroke="#ef4444" strokeWidth="4" />
                ) : activeLoad.id === 'open_load' ? (
                  <text x="560" y="185" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#94a3b8">∞</text>
                ) : (
                  <path d="M 560 155 L 553 162 L 567 172 L 553 182 L 567 192 L 560 200" fill="none" stroke="#10b981" strokeWidth="2" />
                )}
                <rect x="525" y="215" width="70" height="18" rx="4" fill="#ecfdf5" stroke="#a7f3d0" />
                <text x="560" y="228" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#047857">
                  {activeLoad.id === 'short' ? 'SHORT (0Ω)' : activeLoad.id === 'open_load' ? 'OPEN' : `RL: ${effRl}Ω`}
                </text>
              </g>

              {/* Voltage Probe Flags */}
              <g transform="translate(610, 110)">
                <rect width="75" height="42" rx="6" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
                <text x="37" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a7f3d0">V_OUT</text>
                <text x="37" y="34" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#ffffff" fontWeight="bold">
                  {circuitState.vLoad.toFixed(2)} V
                </text>
              </g>
            </svg>
          </div>

          {/* Real-time Dynamic Diagnostic Banner: "What Happens?" */}
          <div className="bg-slate-50 border border-indigo-100 rounded-xl p-3.5 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" /> Real-time Physics Diagnostics (কী ঘটছে?)
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                circuitState.isOverload ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                circuitState.isForward ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                circuitState.isZenerBreakdown ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                'bg-slate-200 text-slate-700'
              }`}>
                {circuitState.statusText}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 font-semibold">Scientific Observation:</strong> {circuitState.diagPhysics}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-1">
              <strong className="text-slate-800 font-semibold">সহজ বাংলায়:</strong> {circuitState.diagBn}
            </p>
          </div>
        </div>

        {/* Right: Component Parameter Sliders & Live Digital Meter (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Digital Multimeter Readout Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Input Voltage (Vin)</div>
              <div className="text-lg font-mono font-bold text-sky-600">{circuitState.vin.toFixed(2)} V</div>
              <div className="text-[10px] text-slate-400">Peak: {sourceType === 'dc' ? '-' : `${vinAcPeak}V`}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Load Voltage (Vout)</div>
              <div className="text-lg font-mono font-bold text-emerald-600">{circuitState.vLoad.toFixed(2)} V</div>
              <div className="text-[10px] text-slate-400">Target RL: {effRl} Ω</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Circuit Current (I)</div>
              <div className="text-lg font-mono font-bold text-amber-600">{circuitState.iCircuitMa.toFixed(2)} mA</div>
              <div className="text-[10px] text-slate-400">Limit Rs: {rsVal} Ω</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center shadow-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Load Power (P_L)</div>
              <div className="text-lg font-mono font-bold text-indigo-600">
                {(circuitState.vLoad * circuitState.iCircuitMa).toFixed(1)} mW
              </div>
              <div className="text-[10px] text-slate-400">Thermal: {tempK} K</div>
            </div>
          </div>

          {/* Live Parameter Sliders */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Interactive Parameter Controls</span>
              <button
                onClick={() => {
                  setVinDc(12);
                  setVinAcPeak(15);
                  setRsVal(220);
                  setRlVal(1000);
                  setCapValUf(100);
                  setTempK(300);
                }}
                className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Defaults
              </button>
            </div>

            {/* Source Voltage Control */}
            {sourceType === 'dc' ? (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">DC Voltage (Vin):</span>
                  <span className="font-mono font-bold text-sky-600">{vinDc.toFixed(1)} V</span>
                </div>
                <input
                  type="range"
                  min="-25.0"
                  max="30.0"
                  step="0.5"
                  value={vinDc}
                  onChange={(e) => setVinDc(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>-25V (Reverse)</span>
                  <span>0V</span>
                  <span>+0.7V (Si Knee)</span>
                  <span>+30V (Heavy Fwd)</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">AC Peak Amplitude (Vpk):</span>
                  <span className="font-mono font-bold text-sky-600">{vinAcPeak} V ({freqHz} Hz)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={vinAcPeak}
                  onChange={(e) => setVinAcPeak(parseInt(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            )}

            {/* Series Resistance Rs Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Series Resistor (Rs):</span>
                <span className="font-mono font-bold text-indigo-600">{rsVal} Ω</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={rsVal}
                onChange={(e) => setRsVal(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Load Resistance RL Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Load Resistor (RL):</span>
                <span className="font-mono font-bold text-emerald-600">{rlVal} Ω</span>
              </div>
              <input
                type="range"
                min="20"
                max="10000"
                step="20"
                value={rlVal}
                onChange={(e) => setRlVal(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Temperature Slider (Kelvin) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Temperature (T):</span>
                <span className="font-mono font-bold text-amber-600">
                  {tempK} K ({tempK - 273}°C) • Vt = {vtMv.toFixed(1)} mV
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="25"
                value={tempK}
                onChange={(e) => setTempK(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Capacitor Value if Shunt is capacitor */}
            {shuntElem === 'capacitor' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Filter Capacitance (C):</span>
                  <span className="font-mono font-bold text-purple-600">{capValUf} µF</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={capValUf}
                  onChange={(e) => setCapValUf(parseInt(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Mini Real-Time Waveform Monitor / Oscilloscope */}
          <div className="bg-slate-900 text-white rounded-xl p-3 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Dual-Beam Oscilloscope
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-sky-400 font-bold">• Vin (Ch1)</span>
                <span className="text-emerald-400 font-bold">• Vout (Ch2)</span>
              </div>
            </div>

            <svg viewBox="0 0 300 80" className="w-full h-20 bg-slate-950 rounded-lg border border-slate-800">
              <line x1="0" y1="40" x2="300" y2="40" stroke="#334155" strokeDasharray="3 3" />
              {/* Vin Trace (Cyan/Sky) */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                points={waveHistory.map((p, idx) => `${(idx / 50) * 300},${40 - (p.vin / 25) * 35}`).join(' ')}
              />
              {/* Vout Trace (Emerald) */}
              <polyline
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                points={waveHistory.map((p, idx) => `${(idx / 50) * 300},${40 - (p.vout / 25) * 35}`).join(' ')}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ELEMENT REPLACEMENT MODAL / POPOVER */}
      {pickerSlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Replace Element in {pickerSlot.toUpperCase()} Position
                </h4>
                <p className="text-xs text-slate-500">Choose a new component to instantly simulate the change in circuit behavior.</p>
              </div>
              <button
                onClick={() => setPickerSlot(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Source Slot Options */}
            {pickerSlot === 'source' && (
              <div className="space-y-2">
                {COMPONENT_CATALOG.sources.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSourceType(s.id);
                      setPickerSlot(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                      sourceType === s.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Series Slot Options */}
            {pickerSlot === 'series' && (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {COMPONENT_CATALOG.series.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSeriesElem(c.id);
                      setPickerSlot(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                      seriesElem === c.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl font-mono">{c.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Shunt Slot Options */}
            {pickerSlot === 'shunt' && (
              <div className="space-y-2">
                {COMPONENT_CATALOG.shunts.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setShuntElem(s.id);
                      setPickerSlot(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                      shuntElem === s.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl font-mono">{s.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Load Slot Options */}
            {pickerSlot === 'load' && (
              <div className="space-y-2">
                {COMPONENT_CATALOG.loads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLoadElem(l.id);
                      setPickerSlot(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                      loadElem === l.id
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl font-mono">{l.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{l.name}</div>
                      <div className="text-[11px] text-slate-500">{l.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Component & Physics Explanation Inspector Modal */}
      <ComponentInspectorModal
        itemKey={inspectedKey}
        onClose={() => setInspectedKey(null)}
      />
    </div>
  );
}
