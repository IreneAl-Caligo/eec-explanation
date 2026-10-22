import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, Sliders, Volume2, Play, Square, Eye, RotateCcw,
  Zap, Settings, HelpCircle, ArrowRightLeft
} from 'lucide-react';
import { playMechanicalClick, playAcHum } from '../../utils/audioEngine';

export default function DualChannelOscilloscope({
  langMode = 'dual',
  defaultMode = 'half_wave',
  presetFrequency = 50, // 50 Hz
  presetVm = 10.0, // 10V peak
}) {
  const canvasRef = useRef(null);

  // Bench Instrument Settings
  const [circuitType, setCircuitType] = useState(defaultMode); // 'half_wave', 'full_bridge', 'bjt_ce_amp', 'clipper_positive'
  const [timeDivMs, setTimeDivMs] = useState(2.0); // 0.5ms, 1ms, 2ms, 5ms, 10ms
  const [ch1VoltsDiv, setCh1VoltsDiv] = useState(2.0); // 0.5, 1, 2, 5
  const [ch2VoltsDiv, setCh2VoltsDiv] = useState(2.0);
  const [frequencyHz, setFrequencyHz] = useState(presetFrequency);
  const [peakVoltageVm, setPeakVoltageVm] = useState(presetVm);
  const [triggerSlope, setTriggerSlope] = useState('positive'); // 'positive' or 'negative'
  const [displayMode, setDisplayMode] = useState('dual'); // 'dual', 'ch1', 'ch2', 'xy'
  const [isLiveRunning, setIsLiveRunning] = useState(true);

  // Time index for animation
  const animTimeRef = useRef(0);
  const animFrameRef = useRef(null);

  // Audio hum toggle
  const [isSoundActive, setIsSoundActive] = useState(false);

  // Continuous Oscilloscope Canvas Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Dark Phosphor CRT Display Background
      ctx.fillStyle = '#050c14';
      ctx.fillRect(0, 0, width, height);

      // 2. Graticule Grid (10 divisions horizontal, 8 divisions vertical)
      const numDivsX = 10;
      const numDivsY = 8;
      const stepX = width / numDivsX;
      const stepY = height / numDivsY;

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'; // faint cyan grid lines

      for (let x = 0; x <= width; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Minor tick marks
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        for (let y = 0; y <= height; y += stepY / 5) {
          ctx.beginPath();
          ctx.moveTo(x - 2, y);
          ctx.lineTo(x + 2, y);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      }

      for (let y = 0; y <= height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Minor tick marks on center axis
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        for (let x = 0; x <= width; x += stepX / 5) {
          ctx.beginPath();
          ctx.moveTo(x, y - 2);
          ctx.lineTo(x, y + 2);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      }

      // Center crosshair axes
      const centerY = height / 2;
      const centerX = width / 2;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // 3. Compute Time & Waveform Data across the 10 divisions
      const totalTimeMs = numDivsX * timeDivMs;
      const omega = 2 * Math.PI * frequencyHz;
      const timeOffset = isLiveRunning ? animTimeRef.current : 0;

      // CH1: Input Sine Wave (Yellow Trace)
      if (displayMode === 'dual' || displayMode === 'ch1') {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#facc15'; // Phosphor Yellow
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;

        for (let i = 0; i < width; i++) {
          const tMs = (i / width) * totalTimeMs;
          const tSec = (tMs / 1000) + timeOffset;
          const vin = peakVoltageVm * Math.sin(omega * tSec);

          // Convert Voltage to Screen Y Coordinate based on CH1 Volts/Div
          // centerY corresponds to 0V
          const pxPerVolt = stepY / ch1VoltsDiv;
          const y = centerY - (vin * pxPerVolt);

          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // CH2: Output Waveform (Cyan Trace)
      if (displayMode === 'dual' || displayMode === 'ch2') {
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#06b6d4'; // Phosphor Cyan
        ctx.shadowColor = '#0891b2';
        ctx.shadowBlur = 8;

        for (let i = 0; i < width; i++) {
          const tMs = (i / width) * totalTimeMs;
          const tSec = (tMs / 1000) + timeOffset;
          const vin = peakVoltageVm * Math.sin(omega * tSec);

          let vout = 0;
          if (circuitType === 'half_wave') {
            // Half-wave silicon rectifier: conducts when vin > 0.7V
            vout = Math.max(0, vin - 0.7);
          } else if (circuitType === 'full_bridge') {
            // Full-wave bridge rectifier: 2 diode drops (1.4V)
            vout = Math.max(0, Math.abs(vin) - 1.4);
          } else if (circuitType === 'bjt_ce_amp') {
            // Common-Emitter Inverting Amplifier: 180° Phase Shift + Gain
            const gain = 1.8;
            vout = -gain * vin; // 180° inverted
          } else if (circuitType === 'clipper_positive') {
            // Positive Diode Clipper biased at 3.0V
            const vBias = 3.0;
            vout = Math.min(vin, vBias + 0.7);
          }

          const pxPerVolt = stepY / ch2VoltsDiv;
          const y = centerY - (vout * pxPerVolt);

          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (isLiveRunning) {
        animTimeRef.current += 0.0008;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [circuitType, timeDivMs, ch1VoltsDiv, ch2VoltsDiv, frequencyHz, peakVoltageVm, isLiveRunning, displayMode]);

  // Derived Waveform Analytics
  const vrms = Math.round((peakVoltageVm / Math.SQRT2) * 100) / 100;
  const vdcExpected =
    circuitType === 'half_wave'
      ? Math.round((0.318 * Math.max(0, peakVoltageVm - 0.7)) * 100) / 100
      : circuitType === 'full_bridge'
      ? Math.round((0.636 * Math.max(0, peakVoltageVm - 1.4)) * 100) / 100
      : 0;

  return (
    <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 text-white">
      {/* Top Header: Oscilloscope Identity & Mode Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg tracking-tight flex items-center gap-2">
              {langMode === 'bn' ? 'ডুয়াল-চ্যানেল ভার্চুয়াল অসিলোস্কোপ প্রো' : 'Dual-Channel Benchtop Digital Oscilloscope'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                100 MHz Real-Time DSO
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {langMode === 'bn'
                ? 'চ্যানেল ১ (হলুদ): ইনপুট সিগন্যাল • চ্যানেল ২ (সায়ান): সার্কিট আউটপুট ওয়েভফর্ম'
                : 'CH1 (Yellow): Input Waveform • CH2 (Cyan): Circuit Output & Rectification Waveform'}
            </p>
          </div>
        </div>

        {/* Live Freeze & Sound Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playMechanicalClick();
              setIsLiveRunning(!isLiveRunning);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isLiveRunning
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'bg-rose-600/30 border-rose-500 text-rose-300'
            }`}
          >
            {isLiveRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isLiveRunning ? 'RUNNING' : 'HOLD / STOP'}</span>
          </button>

          <button
            onClick={() => {
              playMechanicalClick();
              playAcHum(0.6);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs transition"
            title="Listen to 50Hz AC Tone"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Phosphor CRT Screen & Reticle */}
      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border-2 border-cyan-900/60 bg-[#050c14] shadow-inner flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={360}
          className="w-full h-full block"
        />

        {/* On-Screen HUD Telemetry */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono space-y-1 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span>CH1: {ch1VoltsDiv} V/Div • Vin(pk) = {peakVoltageVm} V</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>CH2: {ch2VoltsDiv} V/Div • Type: {circuitType}</span>
          </div>
          <div className="text-slate-400 pt-1 border-t border-slate-800">
            <span>TB: {timeDivMs} ms/Div • Freq: {frequencyHz} Hz</span>
          </div>
        </div>

        {/* Real-time Electrical Measurements HUD */}
        <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono space-y-1 shadow-lg pointer-events-none">
          <div className="text-yellow-400 font-bold">
            <span>Vpp(In) = {peakVoltageVm * 2} V • Vrms = {vrms} V</span>
          </div>
          <div className="text-cyan-400 font-bold">
            <span>Vdc(Out) = {vdcExpected} V</span>
            {circuitType === 'bjt_ce_amp' && <span className="ml-2 text-purple-400">Phase = 180° Inverted</span>}
          </div>
        </div>
      </div>

      {/* Rotary Knobs & Bench Controls Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        {/* 1. Circuit Waveform Mode */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
            {langMode === 'bn' ? 'সার্কিট রেসপন্স মোড:' : 'Circuit Response Mode:'}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'half_wave', label: 'Half-Wave' },
              { id: 'full_bridge', label: 'Full Bridge' },
              { id: 'bjt_ce_amp', label: 'BJT 180° Invert' },
              { id: 'clipper_positive', label: 'Clipper 3V' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  playMechanicalClick();
                  setCircuitType(m.id);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                  circuitType === m.id
                    ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Timebase Time/Div Knob */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
            Time/Div (Horizontal):
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[0.5, 1.0, 2.0, 5.0].map((t) => (
              <button
                key={t}
                onClick={() => {
                  playMechanicalClick();
                  setTimeDivMs(t);
                }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                  timeDivMs === t
                    ? 'bg-indigo-600/40 border-indigo-400 text-indigo-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {t}ms
              </button>
            ))}
          </div>
        </div>

        {/* 3. CH1 Volts/Div (Input) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-yellow-400 tracking-wider block">
            CH1 Volts/Div:
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[0.5, 1.0, 2.0, 5.0].map((v) => (
              <button
                key={v}
                onClick={() => {
                  playMechanicalClick();
                  setCh1VoltsDiv(v);
                }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                  ch1VoltsDiv === v
                    ? 'bg-yellow-600/40 border-yellow-400 text-yellow-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
        </div>

        {/* 4. CH2 Volts/Div (Output) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-cyan-400 tracking-wider block">
            CH2 Volts/Div:
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[0.5, 1.0, 2.0, 5.0].map((v) => (
              <button
                key={v}
                onClick={() => {
                  playMechanicalClick();
                  setCh2VoltsDiv(v);
                }}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                  ch2VoltsDiv === v
                    ? 'bg-cyan-600/40 border-cyan-400 text-cyan-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
