import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Play, Square, RotateCcw, AlertTriangle, Sparkles, CheckCircle2,
  Trash2, Plus, Volume2, ShieldAlert, Cpu
} from 'lucide-react';
import {
  playMechanicalClick, playAcHum, playSpark, playBuzzer, playSuccessChime
} from '../../utils/audioEngine';

// Default Component Definitions
const COMPONENT_CATALOG = [
  {
    type: 'battery',
    name: 'DC Power Supply',
    nameBn: 'ডিসি ব্যাটারি সোর্স',
    voltage: 9.0,
    pins: [
      { id: 'pos', label: '+', offset: { x: 30, y: 70 }, color: '#ef4444' },
      { id: 'neg', label: '-', offset: { x: 110, y: 70 }, color: '#0f172a' }
    ],
    width: 140,
    height: 90,
  },
  {
    type: 'resistor',
    name: 'Resistor (Current Limiter)',
    nameBn: 'রোধক (২২০Ω রেজিস্টর)',
    resistance: 220, // Ohms
    pins: [
      { id: 'p1', label: '1', offset: { x: 20, y: 40 }, color: '#d97706' },
      { id: 'p2', label: '2', offset: { x: 120, y: 40 }, color: '#d97706' }
    ],
    width: 140,
    height: 80,
  },
  {
    type: 'led',
    name: 'Indicator LED',
    nameBn: 'এলইডি বাতি (LED)',
    color: '#ef4444',
    maxCurrentMa: 35.0,
    thresholdV: 2.0,
    pins: [
      { id: 'anode', label: 'A(+)', offset: { x: 30, y: 70 }, color: '#22c55e' },
      { id: 'cathode', label: 'K(-)', offset: { x: 90, y: 70 }, color: '#ef4444' }
    ],
    width: 120,
    height: 90,
  },
  {
    type: 'diode',
    name: 'Silicon Diode (1N4007)',
    nameBn: 'সিলিকন ডায়োড (০.৭V)',
    thresholdV: 0.7,
    maxCurrentMa: 1000.0,
    pins: [
      { id: 'anode', label: 'Anode(+)', offset: { x: 25, y: 45 }, color: '#38bdf8' },
      { id: 'cathode', label: 'Cathode(-)', offset: { x: 115, y: 45 }, color: '#94a3b8' }
    ],
    width: 140,
    height: 80,
  },
  {
    type: 'capacitor',
    name: 'Filter Capacitor',
    nameBn: 'ফিল্টার ক্যাপাসিটর (১০০µF)',
    capacitance: 100, // uF
    pins: [
      { id: 'pos', label: '+', offset: { x: 30, y: 65 }, color: '#06b6d4' },
      { id: 'neg', label: '-', offset: { x: 90, y: 65 }, color: '#64748b' }
    ],
    width: 120,
    height: 80,
  }
];

export default function InteractiveBreadboardBuilder({ langMode = 'dual' }) {
  // Breadboard canvas state
  const [placedComponents, setPlacedComponents] = useState([
    {
      instanceId: 'comp_bat_1',
      type: 'battery',
      x: 60,
      y: 70,
      voltage: 9.0,
      name: '9V DC Supply',
    },
    {
      instanceId: 'comp_res_1',
      type: 'resistor',
      x: 300,
      y: 75,
      resistance: 220,
      name: '220Ω Resistor',
    },
    {
      instanceId: 'comp_led_1',
      type: 'led',
      x: 540,
      y: 70,
      color: '#ef4444',
      name: 'Red LED',
    }
  ]);

  // Wires connecting pins: { wireId, fromComp, fromPin, toComp, toPin, color }
  const [wires, setWires] = useState([
    {
      wireId: 'w1',
      fromComp: 'comp_bat_1',
      fromPin: 'pos',
      toComp: 'comp_res_1',
      toPin: 'p1',
      color: '#ef4444' // Red
    },
    {
      wireId: 'w2',
      fromComp: 'comp_res_1',
      fromPin: 'p2',
      toComp: 'comp_led_1',
      toPin: 'anode',
      color: '#3b82f6' // Blue
    },
    {
      wireId: 'w3',
      fromComp: 'comp_led_1',
      fromPin: 'cathode',
      toComp: 'comp_bat_1',
      toPin: 'neg',
      color: '#0f172a' // Black
    }
  ]);

  // Wire creation state
  const [pendingWireStart, setPendingWireStart] = useState(null); // { compId, pinId, x, y }
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeWireColor, setActiveWireColor] = useState('#ef4444');

  // Simulation execution state
  const [isPowered, setIsPowered] = useState(false);
  const [circuitStatus, setCircuitStatus] = useState('idle'); // 'idle', 'running_ok', 'short_circuit', 'burned_out', 'open_circuit'
  const [simMetrics, setSimMetrics] = useState({ currentMa: 0, vDrop: 0, powerMw: 0 });
  const [smokeParticles, setSmokeParticles] = useState([]);
  const [sparkFlashes, setSparkFlashes] = useState([]);

  const boardRef = useRef(null);

  // Dragging placed component on board
  const [draggingCompId, setDraggingCompId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 1. Solve Circuit whenever state / wires / power changes
  useEffect(() => {
    if (!isPowered) {
      setCircuitStatus('idle');
      setSimMetrics({ currentMa: 0, vDrop: 0, powerMw: 0 });
      setSmokeParticles([]);
      setSparkFlashes([]);
      return;
    }

    // Trace circuit connectivity
    const battery = placedComponents.find((c) => c.type === 'battery');
    if (!battery) {
      setCircuitStatus('open_circuit');
      return;
    }

    // Check if Battery (+) is connected to anything
    const wireFromPos = wires.find(
      (w) => (w.fromComp === battery.instanceId && w.fromPin === 'pos') ||
             (w.toComp === battery.instanceId && w.toPin === 'pos')
    );
    const wireFromNeg = wires.find(
      (w) => (w.fromComp === battery.instanceId && w.fromPin === 'neg') ||
             (w.toComp === battery.instanceId && w.toPin === 'neg')
    );

    if (!wireFromPos || !wireFromNeg) {
      setCircuitStatus('open_circuit');
      setSimMetrics({ currentMa: 0, vDrop: 0, powerMw: 0 });
      return;
    }

    // Direct short circuit: Battery (+) directly connected to (-)
    const isDirectShort = wires.some(
      (w) =>
        (w.fromComp === battery.instanceId && w.fromPin === 'pos' && w.toComp === battery.instanceId && w.toPin === 'neg') ||
        (w.fromComp === battery.instanceId && w.fromPin === 'neg' && w.toComp === battery.instanceId && w.toPin === 'pos')
    );

    if (isDirectShort) {
      triggerShortCircuit();
      return;
    }

    // Check components in loop
    const resistor = placedComponents.find((c) => c.type === 'resistor');
    const led = placedComponents.find((c) => c.type === 'led');
    const diode = placedComponents.find((c) => c.type === 'diode');

    // Case: LED directly connected across battery WITHOUT resistor (Overheat / Burnout!)
    if (led && !resistor) {
      const ledDirectlyOnBattery = wires.some(
        (w) => (w.fromComp === battery.instanceId && w.toComp === led.instanceId) ||
               (w.fromComp === led.instanceId && w.toComp === battery.instanceId)
      );

      if (ledDirectlyOnBattery) {
        triggerBurnout(led);
        return;
      }
    }

    // Check Polarity on LED
    if (led) {
      // Find what is connected to LED anode and cathode
      const wireToAnode = wires.find((w) => (w.fromComp === led.instanceId && w.fromPin === 'anode') || (w.toComp === led.instanceId && w.toPin === 'anode'));
      const wireToCathode = wires.find((w) => (w.fromComp === led.instanceId && w.fromPin === 'cathode') || (w.toComp === led.instanceId && w.toPin === 'cathode'));

      // Check reverse polarity (Cathode connected towards Battery +)
      const isReverse = (wireToCathode && (wireToCathode.fromComp === battery.instanceId && wireToCathode.fromPin === 'pos')) ||
                        (wireToCathode && (wireToCathode.toComp === battery.instanceId && wireToCathode.toPin === 'pos'));

      if (isReverse) {
        setCircuitStatus('reverse_bias');
        setSimMetrics({ currentMa: 0.001, vDrop: battery.voltage, powerMw: 0 });
        playBuzzer();
        return;
      }
    }

    // Normal safe conduction loop
    const rTotal = (resistor ? resistor.resistance : 10) + 5; // ohms
    const vThreshold = (led ? 2.0 : 0) + (diode ? 0.7 : 0);
    const effectiveV = Math.max(0, battery.voltage - vThreshold);
    const iCurrentMa = (effectiveV / rTotal) * 1000.0;

    if (iCurrentMa > 50.0 && led) {
      // Too high current for standard LED
      triggerBurnout(led);
    } else {
      setCircuitStatus('running_ok');
      setSimMetrics({
        currentMa: Math.round(iCurrentMa * 10) / 10,
        vDrop: Math.round(vThreshold * 100) / 100,
        powerMw: Math.round(effectiveV * iCurrentMa),
      });
      playAcHum(0.3);
    }
  }, [isPowered, wires, placedComponents]);

  // Trigger Short Circuit Spark & Sound
  const triggerShortCircuit = () => {
    setCircuitStatus('short_circuit');
    playSpark();
    playBuzzer();
    setSimMetrics({ currentMa: 15000, vDrop: 0, powerMw: 135000 });

    // Spawn spark flashes
    const sparks = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: 100 + (Math.random() - 0.5) * 50,
      y: 110 + (Math.random() - 0.5) * 50,
      size: 15 + Math.random() * 25,
    }));
    setSparkFlashes(sparks);
  };

  // Trigger Component Burnout & Smoke
  const triggerBurnout = (comp) => {
    setCircuitStatus('burned_out');
    playSpark();
    playBuzzer();
    setSimMetrics({ currentMa: 450, vDrop: 9.0, powerMw: 4050 });

    // Spawn rising smoke particles
    const smokes = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: comp.x + 60 + (Math.random() - 0.5) * 30,
      y: comp.y + 30,
      driftX: (Math.random() - 0.5) * 20,
      delay: i * 0.15,
    }));
    setSmokeParticles(smokes);
  };

  // Start connecting a wire from a pin
  const handlePinMouseDown = (e, compId, pinId, pinOffset) => {
    e.stopPropagation();
    playMechanicalClick();
    const comp = placedComponents.find((c) => c.instanceId === compId);
    if (!comp) return;

    if (!pendingWireStart) {
      // Start wire
      setPendingWireStart({
        compId,
        pinId,
        x: comp.x + pinOffset.x,
        y: comp.y + pinOffset.y,
      });
    } else {
      // Complete wire
      if (pendingWireStart.compId === compId && pendingWireStart.pinId === pinId) {
        setPendingWireStart(null); // Clicked same pin, cancel
        return;
      }

      const newWire = {
        wireId: `wire_${Date.now()}`,
        fromComp: pendingWireStart.compId,
        fromPin: pendingWireStart.pinId,
        toComp: compId,
        toPin: pinId,
        color: activeWireColor,
      };

      setWires((prev) => [...prev, newWire]);
      setPendingWireStart(null);
      playSuccessChime();
    }
  };

  // Canvas Mouse Move for wire preview and component drag
  const handleMouseMove = (e) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggingCompId) {
      setPlacedComponents((prev) =>
        prev.map((c) => {
          if (c.instanceId === draggingCompId) {
            return {
              ...c,
              x: Math.max(10, Math.min(rect.width - 150, x - dragOffset.x)),
              y: Math.max(10, Math.min(rect.height - 110, y - dragOffset.y)),
            };
          }
          return c;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
  };

  // Add Component to Breadboard
  const addComponentToBoard = (type) => {
    playMechanicalClick();
    const template = COMPONENT_CATALOG.find((c) => c.type === type);
    if (!template) return;

    const newComp = {
      instanceId: `comp_${type}_${Date.now()}`,
      type,
      x: 100 + Math.random() * 100,
      y: 150 + Math.random() * 80,
      name: template.name,
      ...(type === 'battery' ? { voltage: 9.0 } : {}),
      ...(type === 'resistor' ? { resistance: 220 } : {}),
      ...(type === 'led' ? { color: '#ef4444' } : {}),
      ...(type === 'diode' ? { thresholdV: 0.7 } : {}),
    };

    setPlacedComponents((prev) => [...prev, newComp]);
  };

  // Remove Component
  const removeComponent = (instanceId) => {
    playMechanicalClick();
    setPlacedComponents((prev) => prev.filter((c) => c.instanceId !== instanceId));
    setWires((prev) => prev.filter((w) => w.fromComp !== instanceId && w.toComp !== instanceId));
  };

  // Preset Circuits
  const loadPreset = (presetName) => {
    playMechanicalClick();
    setIsPowered(false);
    if (presetName === 'led_safe') {
      setPlacedComponents([
        { instanceId: 'comp_bat_1', type: 'battery', x: 60, y: 70, voltage: 9.0, name: '9V Supply' },
        { instanceId: 'comp_res_1', type: 'resistor', x: 300, y: 75, resistance: 220, name: '220Ω Resistor' },
        { instanceId: 'comp_led_1', type: 'led', x: 540, y: 70, color: '#ef4444', name: 'Red LED' }
      ]);
      setWires([
        { wireId: 'w1', fromComp: 'comp_bat_1', fromPin: 'pos', toComp: 'comp_res_1', toPin: 'p1', color: '#ef4444' },
        { wireId: 'w2', fromComp: 'comp_res_1', fromPin: 'p2', toComp: 'comp_led_1', toPin: 'anode', color: '#3b82f6' },
        { wireId: 'w3', fromComp: 'comp_led_1', fromPin: 'cathode', toComp: 'comp_bat_1', toPin: 'neg', color: '#0f172a' }
      ]);
    } else if (presetName === 'led_burnout') {
      // Direct connection WITHOUT resistor
      setPlacedComponents([
        { instanceId: 'comp_bat_1', type: 'battery', x: 80, y: 70, voltage: 9.0, name: '9V Battery' },
        { instanceId: 'comp_led_1', type: 'led', x: 420, y: 70, color: '#ef4444', name: 'Red LED (No Resistor)' }
      ]);
      setWires([
        { wireId: 'w1', fromComp: 'comp_bat_1', fromPin: 'pos', toComp: 'comp_led_1', toPin: 'anode', color: '#ef4444' },
        { wireId: 'w2', fromComp: 'comp_led_1', fromPin: 'cathode', toComp: 'comp_bat_1', toPin: 'neg', color: '#0f172a' }
      ]);
    } else if (presetName === 'blank') {
      setPlacedComponents([]);
      setWires([]);
    }
  };

  // Helper to get pin absolute coordinates
  const getPinPos = (compId, pinId) => {
    const comp = placedComponents.find((c) => c.instanceId === compId);
    if (!comp) return { x: 0, y: 0 };
    const catalogItem = COMPONENT_CATALOG.find((c) => c.type === comp.type);
    if (!catalogItem) return { x: comp.x, y: comp.y };
    const pin = catalogItem.pins.find((p) => p.id === pinId);
    if (!pin) return { x: comp.x, y: comp.y };
    return { x: comp.x + pin.offset.x, y: comp.y + pin.offset.y };
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 transition-colors">
      {/* Top Banner: Wire Builder Title & Power Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {langMode === 'bn' ? 'ইন্টারেক্টিভ ড্র্যাগ-অ্যান্ড-ড্রপ ব্রেডবোর্ড ও ওয়্যার বিল্ডার' : 'Interactive Breadboard & Wire Connection Bench'}
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Tinkercad Physics
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'পিন-টু-পিন তার যুক্ত করুন। ভুল পোলারিটি বা অতিরিক্ত কারেন্টে কম্পোনেন্ট ওভারহিট ও স্পার্ক পর্যবেক্ষণ করুন।'
                : 'Connect components pin-to-pin. Observe sparks and smoke animations on reverse breakdown or short circuit.'}
            </p>
          </div>
        </div>

        {/* Master Power Switch & Metrics Display */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playMechanicalClick();
              setIsPowered(!isPowered);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-md transition transform active:scale-95 ${
              isPowered
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPowered ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPowered ? (langMode === 'bn' ? 'পাওয়ার বন্ধ (OFF)' : 'Power OFF') : (langMode === 'bn' ? 'পাওয়ার চালু (RUN)' : 'Power ON')}</span>
          </button>

          {/* Quick Presets */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => loadPreset('led_safe')}
              className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300 transition"
              title="Normal LED Circuit with 220Ω Resistor"
            >
              Safe LED (220Ω)
            </button>
            <button
              onClick={() => loadPreset('led_burnout')}
              className="px-2.5 py-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 font-semibold text-rose-600 dark:text-rose-400 transition"
              title="Direct LED connection without resistor to test burnout"
            >
              Burnout Test
            </button>
            <button
              onClick={() => loadPreset('blank')}
              className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Component Palette Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 shrink-0">
            {langMode === 'bn' ? 'উপাদান যুক্ত করুন:' : 'Add Part:'}
          </span>
          {COMPONENT_CATALOG.map((cat) => (
            <button
              key={cat.type}
              onClick={() => addComponentToBoard(cat.type)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs flex items-center gap-1.5 transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-500" />
              <span>{langMode === 'bn' ? cat.nameBn : cat.name}</span>
            </button>
          ))}
        </div>

        {/* Wire Color Picker */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {langMode === 'bn' ? 'তারের রঙ:' : 'Wire:'}
          </span>
          {[
            { color: '#ef4444', label: 'Red (+)' },
            { color: '#0f172a', label: 'Black (-)' },
            { color: '#3b82f6', label: 'Blue' },
            { color: '#22c55e', label: 'Green' },
            { color: '#eab308', label: 'Yellow' }
          ].map((c) => (
            <button
              key={c.color}
              onClick={() => {
                playMechanicalClick();
                setActiveWireColor(c.color);
              }}
              style={{ backgroundColor: c.color }}
              className={`w-6 h-6 rounded-full border-2 transition ${
                activeWireColor === c.color ? 'ring-2 ring-indigo-500 scale-110' : 'border-white dark:border-slate-800'
              }`}
              title={c.label}
            />
          ))}
          {wires.length > 0 && (
            <button
              onClick={() => {
                playMechanicalClick();
                setWires([]);
              }}
              className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900 transition flex items-center gap-1"
              title="Delete All Wires"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Status Alert Banner */}
      {isPowered && (
        <div className="animate-in fade-in duration-200">
          {circuitStatus === 'running_ok' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {langMode === 'bn'
                    ? 'সার্কিট সঠিকভাবে সক্রিয়! এলইডিতে নিরাপদ ফরওয়ার্ড কারেন্ট প্রবাহিত হচ্ছে।'
                    : 'Circuit operational! Safe forward current through LED with series current limiter.'}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                <span>I = {simMetrics.currentMa} mA</span>
                <span>V_drop = {simMetrics.vDrop} V</span>
                <span>P = {simMetrics.powerMw} mW</span>
              </div>
            </div>
          )}

          {circuitStatus === 'burned_out' && (
            <div className="bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-500 rounded-2xl p-3 flex items-center justify-between text-xs sm:text-sm animate-pulse">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-black">
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <span className="block text-sm">
                    {langMode === 'bn'
                      ? '⚠️ উপাদান পুড়ে গেছে (Component Burnout)! অতিরিক্ত কারেন্ট।'
                      : '⚠️ COMPONENT BURNOUT: LED Destroyed by Excess Forward Current!'}
                  </span>
                  <span className="text-xs font-normal text-rose-700 dark:text-rose-300">
                    {langMode === 'bn'
                      ? 'কোনো কারেন্ট-লিমিটিং রেজিস্টর (২২০Ω) না থাকায় সরাসরি ৯V ঢুকে ডায়োড জংশন পুড়ে গেছে।'
                      : 'No series resistor present! LED current exceeded 450mA, vaporizing the semiconductor bond.'}
                  </span>
                </div>
              </div>
              <div className="font-mono font-black text-rose-700 dark:text-rose-300 text-sm">
                I &gt; 450 mA (OVERCURRENT)
              </div>
            </div>
          )}

          {circuitStatus === 'short_circuit' && (
            <div className="bg-amber-50 dark:bg-amber-950/70 border-2 border-amber-500 rounded-2xl p-3 flex items-center justify-between text-xs sm:text-sm animate-pulse">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <span className="block text-sm">
                    {langMode === 'bn' ? '⚡ সরাসরি শর্ট সার্কিট (Direct Short Circuit)!' : '⚡ DIRECT SHORT CIRCUIT!'}
                  </span>
                  <span className="text-xs font-normal text-amber-700 dark:text-amber-300">
                    {langMode === 'bn'
                      ? 'ব্যাটারির ধনাত্মক ও ঋণাত্মক প্রান্ত সরাসরি যুক্ত হয়ে গেছে। তীব্র স্পার্ক ও ব্যাটারি বিস্ফোরণের ঝুঁকি।'
                      : 'Battery positive terminal shorted directly to ground. Extreme spark discharge!'}
                  </span>
                </div>
              </div>
              <div className="font-mono font-black text-amber-700 dark:text-amber-300">
                I &gt; 15,000 mA
              </div>
            </div>
          )}

          {circuitStatus === 'reverse_bias' && (
            <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 rounded-2xl p-3 text-xs sm:text-sm text-purple-900 dark:text-purple-200 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0" />
              <span>
                {langMode === 'bn'
                  ? 'উল্টো পোলারিটি (Reverse Polarity): এলইডির ক্যাথোড (+) প্রান্তে এবং অ্যানোড (-) প্রান্তে যুক্ত থাকায় কোনো আলো জ্বলবে না।'
                  : 'Reverse Polarity: LED is reverse-biased (Cathode connected to +). Zero conduction.'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Breadboard Grid Canvas */}
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[520px] rounded-3xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl overflow-hidden select-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(148, 163, 184, 0.25) 1.5px, transparent 1.5px),
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 120px 120px, 120px 120px',
        }}
      >
        {/* SVG Wire Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Completed Wires */}
          {wires.map((wire) => {
            const p1 = getPinPos(wire.fromComp, wire.fromPin);
            const p2 = getPinPos(wire.toComp, wire.toPin);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2 + Math.abs(p1.x - p2.x) * 0.15;
            const pathData = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

            return (
              <g key={wire.wireId}>
                {/* Outer Shadow / Wire Insulation */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={wire.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  filter={isPowered && circuitStatus === 'running_ok' ? 'url(#wire-glow)' : 'none'}
                />
                {/* Inner Highlight Core */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Animated Current Particle Flow when Circuit is Operating */}
                {isPowered && circuitStatus === 'running_ok' && (
                  <circle r="4" fill="#fef08a">
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={pathData} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Live Wire Creation Rubberband */}
          {pendingWireStart && (
            <path
              d={`M ${pendingWireStart.x} ${pendingWireStart.y} Q ${(pendingWireStart.x + mousePos.x) / 2} ${(pendingWireStart.y + mousePos.y) / 2 + 20} ${mousePos.x} ${mousePos.y}`}
              fill="none"
              stroke={activeWireColor}
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Dynamic Spark Flashes on Short Circuit */}
        {sparkFlashes.map((spark) => (
          <div
            key={spark.id}
            style={{ left: spark.x, top: spark.y, width: spark.size, height: spark.size }}
            className="absolute rounded-full bg-yellow-300 blur-xs shadow-2xl animate-ping z-30 pointer-events-none"
          />
        ))}

        {/* Dynamic Smoke Particles on Burnout */}
        {smokeParticles.map((smoke) => (
          <div
            key={smoke.id}
            style={{ left: smoke.x, top: smoke.y }}
            className="absolute w-8 h-8 rounded-full bg-slate-400/60 blur-md shadow-lg animate-bounce z-30 pointer-events-none"
          />
        ))}

        {/* Render Placed Components */}
        {placedComponents.map((comp) => {
          const catalogItem = COMPONENT_CATALOG.find((c) => c.type === comp.type);
          if (!catalogItem) return null;

          return (
            <div
              key={comp.instanceId}
              onMouseDown={(e) => {
                // Don't drag if clicking a pin
                if (e.target.dataset.pin) return;
                setDraggingCompId(comp.instanceId);
                setDragOffset({ x: mousePos.x - comp.x, y: mousePos.y - comp.y });
              }}
              style={{
                left: comp.x,
                top: comp.y,
                width: catalogItem.width,
                height: catalogItem.height,
              }}
              className="absolute z-20 cursor-move group"
            >
              {/* Component Body Box */}
              <div className="w-full h-full rounded-2xl bg-slate-800 border-2 border-slate-600/80 shadow-2xl p-2.5 flex flex-col justify-between relative transition group-hover:border-indigo-400">
                {/* Delete Component Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComponent(comp.instanceId);
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md z-30"
                  title="Remove Component"
                >
                  ✕
                </button>

                {/* Component Visual Icon / Graphic */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="truncate">{comp.name}</span>
                  {comp.type === 'battery' && <span className="font-mono text-amber-400">9V</span>}
                  {comp.type === 'resistor' && <span className="font-mono text-amber-400">220Ω</span>}
                </div>

                {/* Specific Component Centers (LED Glow, Diode Stripe) */}
                <div className="flex items-center justify-center flex-1">
                  {comp.type === 'battery' && (
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-300">
                      <span>🔋 DC 9V</span>
                    </div>
                  )}

                  {comp.type === 'resistor' && (
                    <div className="w-16 h-5 rounded-md bg-amber-800/80 border border-amber-600 flex items-center justify-around px-1 shadow-sm">
                      <div className="w-1 h-full bg-red-600"></div>
                      <div className="w-1 h-full bg-red-600"></div>
                      <div className="w-1 h-full bg-amber-500"></div>
                      <div className="w-1 h-full bg-yellow-400"></div>
                    </div>
                  )}

                  {comp.type === 'led' && (
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          isPowered && circuitStatus === 'running_ok'
                            ? 'bg-rose-500 border-rose-300 shadow-[0_0_35px_#f43f5e] scale-110 animate-pulse'
                            : circuitStatus === 'burned_out'
                            ? 'bg-slate-900 border-slate-700 opacity-60'
                            : 'bg-rose-950/80 border-rose-800'
                        }`}
                      />
                      {circuitStatus === 'burned_out' && (
                        <span className="absolute -top-3 text-[10px] font-black text-rose-500 uppercase">
                          VAPORIZED
                        </span>
                      )}
                    </div>
                  )}

                  {comp.type === 'diode' && (
                    <div className="w-16 h-6 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-between px-2 text-xs font-bold font-mono">
                      <span className="text-sky-400">A</span>
                      <div className="w-1.5 h-full bg-slate-400"></div>
                      <span className="text-slate-400">K</span>
                    </div>
                  )}
                </div>

                {/* Pins and Terminal Sockets */}
                {catalogItem.pins.map((pin) => (
                  <div
                    key={pin.id}
                    data-pin="true"
                    onMouseDown={(e) => handlePinMouseDown(e, comp.instanceId, pin.id, pin.offset)}
                    style={{
                      left: pin.offset.x - 10,
                      top: pin.offset.y - 10,
                      borderColor: pin.color,
                    }}
                    className="absolute w-5 h-5 rounded-full bg-slate-900 border-2 hover:scale-125 transition flex items-center justify-center cursor-crosshair z-30 shadow-md group/pin"
                    title={`Click to connect wire from ${pin.label}`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pin.color }} />
                    <span className="absolute -bottom-4 text-[9px] font-mono font-bold text-slate-300 bg-slate-900/90 px-1 rounded pointer-events-none">
                      {pin.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Canvas Instructions HUD */}
        <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 max-w-xs space-y-1 shadow-lg pointer-events-none">
          <span className="font-bold text-white block">💡 {langMode === 'bn' ? 'সংযোগ নির্দেশিকা:' : 'Quick Wiring Tips:'}</span>
          <p>• {langMode === 'bn' ? 'যেকোনো উপাদানের পিনে ক্লিক করে অন্য পিনে ক্লিক করলে তার যুক্ত হবে।' : 'Click any terminal pin, then click another pin to draw wire.'}</p>
          <p>• {langMode === 'bn' ? 'কম্পোনেন্ট মাউস দিয়ে টেনে ইচ্ছামতো বসানো যাবে।' : 'Drag components anywhere on the breadboard.'}</p>
          <p>• {langMode === 'bn' ? 'রেজিস্টর ছাড়া ৯V ব্যাটারিতে এলইডি দিলে ডায়োড পুড়ে ধোঁয়া বের হবে।' : 'Connecting LED directly across 9V will blow the diode with smoke!'}</p>
        </div>
      </div>
    </div>
  );
}
