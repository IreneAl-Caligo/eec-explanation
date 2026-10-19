import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Activity, Zap, RotateCcw, Sliders, ShieldAlert, Info } from 'lucide-react';

export default function RectifierLabSimulator({ preset, topic, langMode = 'dual' }) {
  const [mode, setMode] = useState(preset?.type ? (preset.type === 'half' ? 'hwr' : preset.type === 'full_ct' ? 'fwr_ct' : 'bridge') : preset?.mode || 'hwr'); // 'hwr' | 'fwr_ct' | 'bridge' | 'vdr' | 'clipper'
  const [vm, setVm] = useState(12); // Peak AC voltage V_m
  const [halfCycle, setHalfCycle] = useState('pos'); // 'pos' (0->pi) | 'neg' (pi->2pi)
  // Voltage Divider Rule state (Topic 17.ii)
  const [eSrc, setESrc] = useState(20);
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(6);
  // Clipper / Clamper state (Topic 20.ii)
  const [waveMode, setWaveMode] = useState('pos_clip'); // 'pos_clip' | 'neg_clip' | 'pos_clamp' | 'neg_clamp'
  const [vClip, setVClip] = useState(5);

  const topicNum = topic?.num || (preset?.type === 'full_ct' ? '18' : preset?.type === 'bridge' ? '19' : '17');

  useEffect(() => {
    if (topicNum === '17') {
      setMode('hwr');
    } else if (topicNum === '18') {
      setMode('fwr_ct');
    } else if (topicNum === '19' || topicNum === '20a') {
      setMode('bridge');
    }
  }, [topicNum]);

  useEffect(() => {
    if (preset?.mode) setMode(preset.mode);
    if (preset?.type) {
      if (preset.type === 'half') setMode('hwr');
      else if (preset.type === 'full_ct') setMode('fwr_ct');
      else if (preset.type === 'bridge') setMode('bridge');
    }
  }, [preset]);

  const vdcHwr = (0.318 * (vm - 0.7)).toFixed(2);
  const vdcFwr = (0.636 * (vm - 0.7)).toFixed(2);
  const vdcBridge = (0.636 * (vm - 1.4)).toFixed(2);

  // VDR calculations
  const v1 = ((eSrc * r1) / (r1 + r2)).toFixed(2);
  const v2 = ((eSrc * r2) / (r1 + r2)).toFixed(2);

  // Dedicated topic information with fluent English & Bangla
  const TOPIC_DETAILS = {
    '17': {
      titleEn: 'Topic #17: Half-Wave Rectifier Circuit & Waveforms Lab',
      titleBn: 'টপিক #১৭: হাফ-ওয়েভ রেক্টিফায়ার সার্কিট ও ওয়েভফর্ম ল্যাব',
      descEn: 'Simulate Positive & Negative AC half-cycles, calculate Vdc = 0.318(Vm - 0.7V), ripple frequency fout = fin, and Peak Inverse Voltage (PIV = Vm).',
      descBn: 'AC সিগন্যালের ধনাত্মক ও ঋণাত্মক অর্ধ-চক্র পর্যবেক্ষণ, গড় ডিসি ভোল্টেজ Vdc = ০.৩১৮(Vm - ০.৭V) এবং PIV = Vm হিসাব করুন।',
      buttons: [
        { id: 'hwr', labelEn: 'Half-Wave Rectifier', labelBn: 'হাফ-ওয়েভ রেক্টিফায়ার' },
        { id: 'vdr', labelEn: 'Voltage Divider Rule (VDR)', labelBn: 'ভোল্টেজ ডিভাইডার রুল (VDR)' }
      ]
    },
    '18': {
      titleEn: 'Topic #18: Full-Wave Center-Tapped Rectifier Circuit Lab',
      titleBn: 'টপিক #১৮: ফুল-ওয়েভ সেন্টার-ট্যাপড রেক্টিফায়ার সার্কিট ল্যাব',
      descEn: 'Inspect 2-diode center-tapped transformer operation: D1 conducts on positive half-cycle, D2 conducts on negative half-cycle. Vdc = 0.636(Vm - 0.7V), efficiency η = 81.2%, and ripple frequency 2fin.',
      descBn: '২-ডায়োড সেন্টার-ট্যাপড রূপান্তর: D1 ও D2 পালাক্রমে কাজ করে পুরো তরঙ্গকে ডিসিতে পরিণত করে (Vdc = ০.৬৩৬(Vm - ০.৭V), দক্ষতা ৮১.২%)।',
      buttons: [
        { id: 'fwr_ct', labelEn: 'Center-Tapped Full-Wave', labelBn: 'সেন্টার-ট্যাপড ফুল-ওয়েভ' },
        { id: 'hwr', labelEn: 'Compare Half-Wave', labelBn: 'হাফ-ওয়েভের সাথে তুলনা' }
      ]
    },
    '19': {
      titleEn: 'Topic #19: 4-Diode Bridge Rectifier Circuit Lab',
      titleBn: 'টপিক #১৯: ৪-ডায়োড ব্রিজ রেক্টিফায়ার সার্কিট ল্যাব',
      descEn: 'Trace diagonal conducting pairs (D1-D2 on positive half, D3-D4 on negative half) across full AC cycle with Vdc = 0.636(Vm - 1.4V), PIV = Vm, and no expensive center tap required.',
      descBn: 'কর্ণ বরাবর ডায়োড জোড়া (পজিটিভে D1-D2, নেগেটিভে D3-D4) কীভাবে পুরো তরঙ্গকে ডিসিতে রূপান্তর করে তা দেখুন (Vdc = ০.৬৩৬(Vm - ১.৪V))।',
      buttons: [
        { id: 'bridge', labelEn: '4-Diode Bridge Rectifier', labelBn: '৪-ডায়োড ব্রিজ রেক্টিফায়ার' },
        { id: 'clipper', labelEn: 'Clipper & Clamper Waves', labelBn: 'ক্লিপার ও ক্ল্যাম্পার তরঙ্গ' }
      ]
    },
    '20a': {
      titleEn: 'Topic #20a: 4-Diode Bridge Rectifier Circuit Lab',
      titleBn: 'টপিক #২০a: ৪-ডায়োড ব্রিজ রেক্টিফায়ার সার্কিট ল্যাব',
      descEn: 'Trace diagonal conducting pairs (D1-D2 on positive half, D3-D4 on negative half) across full AC cycle with Vdc = 0.636(Vm - 1.4V), PIV = Vm, and no expensive center tap required.',
      descBn: 'কর্ণ বরাবর ডায়োড জোড়া দিয়ে তৈরি ব্রিজ রেক্টিফায়ার ও তরঙ্গ বিশ্লেষণ।',
      buttons: [
        { id: 'bridge', labelEn: '4-Diode Bridge Rectifier', labelBn: '৪-ডায়োড ব্রিজ রেক্টিফায়ার' },
        { id: 'clipper', labelEn: 'Clipper & Clamper Waves', labelBn: 'ক্লিপার ও ক্ল্যাম্পার তরঙ্গ' }
      ]
    }
  };

  const currentTopic = TOPIC_DETAILS[topicNum] || TOPIC_DETAILS['17'];
  const topicTitle = langMode === 'bn' ? currentTopic.titleBn : langMode === 'en' ? currentTopic.titleEn : `${currentTopic.titleEn} / ${currentTopic.titleBn}`;
  const topicDesc = langMode === 'bn' ? currentTopic.descBn : langMode === 'en' ? currentTopic.descEn : `${currentTopic.descEn} • ${currentTopic.descBn}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 text-slate-800 dark:text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2 text-base sm:text-lg">
            <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>{topicTitle}</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl mt-0.5">
            {topicDesc}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentTopic.buttons.map((b) => (
            <button
              key={b.id}
              onClick={() => setMode(b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                mode === b.id ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {langMode === 'bn' ? b.labelBn : langMode === 'en' ? b.labelEn : `${b.labelEn} / ${b.labelBn}`}
            </button>
          ))}
        </div>
      </div>

      {(mode === 'hwr' || mode === 'fwr_ct' || mode === 'bridge') && (
        <div className="space-y-4">
          {/* Controls for Peak Voltage & Half-Cycle Polarity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">AC Peak Input (V_m):</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{vm} V peak</span>
              </div>
              <input type="range" min="5" max="24" step="1" value={vm} onChange={(e) => setVm(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>

            <div>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block mb-1">Inspect Active AC Half-Cycle (Topic 17.iv):</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setHalfCycle('pos')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition ${
                    halfCycle === 'pos' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  + Positive Half (0 → π)
                </button>
                <button
                  onClick={() => setHalfCycle('neg')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition ${
                    halfCycle === 'neg' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  − Negative Half (π → 2π)
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Average DC (V_dc):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {mode === 'hwr' ? `${vdcHwr} V (0.318 V_m)` : mode === 'fwr_ct' ? `${vdcFwr} V (0.636 V_m)` : `${vdcBridge} V (0.636 V_m)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Max Efficiency (η) & Ripple:</span>
                <span className="font-mono text-amber-600 dark:text-amber-300">
                  {mode === 'hwr' ? 'η = 40.6% | r = 1.21' : 'η = 81.2% | r = 0.482'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Conducting Diodes:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-300">
                  {mode === 'hwr'
                    ? halfCycle === 'pos'
                      ? 'D1 ON (Forward Short)'
                      : 'D1 OFF (Reverse Open)'
                    : mode === 'fwr_ct'
                    ? halfCycle === 'pos'
                      ? 'D1 ON, D2 OFF'
                      : 'D2 ON, D1 OFF'
                    : halfCycle === 'pos'
                    ? 'D1 & D2 ON (D3, D4 OFF)'
                    : 'D3 & D4 ON (D1, D2 OFF)'}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Panel: Interactive Circuit Diagram + Oscilloscope Waveform */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Circuit Diagram */}
            <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                {mode === 'hwr' && `Half-Wave Rectifier Circuit — ${halfCycle === 'pos' ? 'Positive Half-Cycle (0→π)' : 'Negative Half-Cycle (π→2π)'}`}
                {mode === 'fwr_ct' && `Center-Tapped Full-Wave Rectifier — ${halfCycle === 'pos' ? 'D1 Conducting' : 'D2 Conducting'}`}
                {mode === 'bridge' && `4-Diode Bridge Rectifier — ${halfCycle === 'pos' ? 'D1 & D2 Conducting' : 'D3 & D4 Conducting'}`}
              </div>

              {mode === 'hwr' && (
                <svg viewBox="0 0 420 210" className="w-full h-52 select-none font-sans">
                  {/* AC Source on Left */}
                  <circle cx="65" cy="105" r="26" className="fill-white dark:fill-slate-800" stroke="#38bdf8" strokeWidth="2.2" />
                  <path d="M 50 105 Q 57 90 65 105 T 80 105" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <text x="65" y="68" textAnchor="middle" fill={halfCycle === 'pos' ? '#10b981' : '#f43f5e'} fontSize="14" fontWeight="bold">
                    {halfCycle === 'pos' ? '+ (Top)' : '− (Top)'}
                  </text>
                  <text x="65" y="152" textAnchor="middle" fill={halfCycle === 'pos' ? '#f43f5e' : '#10b981'} fontSize="14" fontWeight="bold">
                    {halfCycle === 'pos' ? '− (Bot)' : '+ (Bot)'}
                  </text>

                  {/* Top Wire to Diode D1 */}
                  <line x1="65" y1="79" x2="65" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
                  <line x1="65" y1="40" x2="175" y2="40" stroke="#94a3b8" strokeWidth="2.5" />

                  {/* Diode D1 (Forward Closed vs Reverse Open) */}
                  {halfCycle === 'pos' ? (
                    <g>
                      <polygon points="175,26 175,54 210,40" fill="#10b981" stroke="#10b981" strokeWidth="2" />
                      <line x1="210" y1="25" x2="210" y2="55" stroke="#10b981" strokeWidth="3" />
                      <text x="192" y="18" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">
                        D1 Forward Biased (ON / Closed Switch)
                      </text>
                    </g>
                  ) : (
                    <g>
                      <circle cx="175" cy="40" r="4" fill="#f43f5e" />
                      <line x1="175" y1="40" x2="205" y2="20" stroke="#f43f5e" strokeWidth="3" />
                      <circle cx="210" cy="40" r="4" fill="#f43f5e" />
                      <text x="192" y="15" textAnchor="middle" fill="#fb7185" fontSize="9.5" fontWeight="bold">
                        D1 Reverse Biased (OFF / Open Switch)
                      </text>
                    </g>
                  )}

                  {/* Top Wire to Load R_L */}
                  <line x1="210" y1="40" x2="335" y2="40" stroke="#94a3b8" strokeWidth="2.5" />
                  <line x1="335" y1="40" x2="335" y2="75" stroke="#94a3b8" strokeWidth="2.5" />
                  <rect x="320" y="75" width="30" height="60" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                  <text x="335" y="109" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">R_L</text>
                  <line x1="335" y1="135" x2="335" y2="175" stroke="#94a3b8" strokeWidth="2.5" />
                  <line x1="65" y1="131" x2="65" y2="175" stroke="#94a3b8" strokeWidth="2.5" />
                  <line x1="65" y1="175" x2="335" y2="175" stroke="#94a3b8" strokeWidth="2.5" />

                  {/* Output Status */}
                  <text x="200" y="110" textAnchor="middle" fill={halfCycle === 'pos' ? '#34d399' : '#fb7185'} fontSize="11" fontWeight="bold">
                    {halfCycle === 'pos' ? `Current I_L Flows Down R_L → V_out = +${(vm - 0.7).toFixed(1)}V` : 'Zero Current Flows (I_L = 0) → V_out = 0 V'}
                  </text>
                </svg>
              )}

              {mode === 'fwr_ct' && (
                <svg viewBox="0 0 420 210" className="w-full h-52 select-none font-sans">
                  {/* Center-Tapped Transformer Secondary */}
                  <line x1="70" y1="35" x2="70" y2="175" stroke="#38bdf8" strokeWidth="4" />
                  <text x="40" y="45" fill={halfCycle === 'pos' ? '#10b981' : '#f43f5e'} fontSize="12" fontWeight="bold">
                    {halfCycle === 'pos' ? '+' : '−'}
                  </text>
                  <text x="40" y="175" fill={halfCycle === 'pos' ? '#f43f5e' : '#10b981'} fontSize="12" fontWeight="bold">
                    {halfCycle === 'pos' ? '−' : '+'}
                  </text>
                  {/* Top Diode D1 */}
                  <line x1="70" y1="35" x2="170" y2="35" stroke="#94a3b8" strokeWidth="2" />
                  <polygon points="170,23 170,47 198,35" fill={halfCycle === 'pos' ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" />
                  <text x="184" y="18" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">
                    D1 ({halfCycle === 'pos' ? 'ON' : 'OFF'})
                  </text>
                  <line x1="198" y1="35" x2="340" y2="35" stroke="#94a3b8" strokeWidth="2" />

                  {/* Bottom Diode D2 */}
                  <line x1="70" y1="175" x2="170" y2="175" stroke="#94a3b8" strokeWidth="2" />
                  <polygon points="170,163 170,187 198,175" fill={halfCycle === 'neg' ? '#f59e0b' : '#1e293b'} stroke="#f59e0b" strokeWidth="2" />
                  <text x="184" y="200" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontWeight="bold">
                    D2 ({halfCycle === 'neg' ? 'ON' : 'OFF'})
                  </text>
                  <line x1="198" y1="175" x2="340" y2="175" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="340" y1="35" x2="340" y2="175" stroke="#10b981" strokeWidth="2.5" />

                  {/* Center Tap Ground to Load R_L */}
                  <line x1="70" y1="105" x2="210" y2="105" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" />
                  <rect x="210" y="92" width="75" height="26" rx="4" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
                  <text x="247" y="109" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">Load R_L</text>
                  <line x1="285" y1="105" x2="340" y2="105" stroke="#10b981" strokeWidth="2.5" />
                  <text x="247" y="82" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
                    ← Same Direction Current I_L in BOTH Half-Cycles!
                  </text>
                </svg>
              )}

              {mode === 'bridge' && (
                <svg viewBox="0 0 420 210" className="w-full h-52 select-none font-sans">
                  {/* Diamond Bridge at Center (cx=175, cy=105) */}
                  <polygon points="175,30 245,105 175,180 105,105" fill="none" stroke="#475569" strokeWidth="2" />
                  {/* Highlight Active Diode Pair */}
                  {halfCycle === 'pos' ? (
                    <g>
                      <line x1="175" y1="30" x2="245" y2="105" stroke="#10b981" strokeWidth="4" />
                      <line x1="105" y1="105" x2="175" y2="180" stroke="#10b981" strokeWidth="4" />
                    </g>
                  ) : (
                    <g>
                      <line x1="175" y1="180" x2="245" y2="105" stroke="#f59e0b" strokeWidth="4" />
                      <line x1="105" y1="105" x2="175" y2="30" stroke="#f59e0b" strokeWidth="4" />
                    </g>
                  )}
                  <text x="225" y="60" fill="#10b981" fontSize="10" fontWeight="bold">D1 ({halfCycle === 'pos' ? 'ON' : 'OFF'})</text>
                  <text x="115" y="158" fill="#10b981" fontSize="10" fontWeight="bold">D2 ({halfCycle === 'pos' ? 'ON' : 'OFF'})</text>
                  <text x="225" y="158" fill="#f59e0b" fontSize="10" fontWeight="bold">D3 ({halfCycle === 'neg' ? 'ON' : 'OFF'})</text>
                  <text x="115" y="60" fill="#f59e0b" fontSize="10" fontWeight="bold">D4 ({halfCycle === 'neg' ? 'ON' : 'OFF'})</text>

                  {/* Load R_L on Right connected between Right (+ node 245,105) and Left (- node 105,105) */}
                  <line x1="245" y1="105" x2="345" y2="105" stroke="#10b981" strokeWidth="2.5" />
                  <rect x="330" y="105" width="30" height="60" rx="4" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
                  <text x="345" y="139" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">R_L</text>
                  <polyline points="345,165 345,195 105,195 105,105" fill="none" stroke="#94a3b8" strokeWidth="2" />
                  <text x="382" y="138" fill="#34d399" fontSize="9.5" fontWeight="bold">I_L ↓ (+DC)</text>
                </svg>
              )}
            </div>

            {/* Dual-Channel Oscilloscope (Input AC vs Output Pulsating DC) */}
            <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex justify-between">
                <span>Oscilloscope: Input AC vs. Rectified Output Waveform</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">V_dc = {mode === 'hwr' ? vdcHwr : mode === 'fwr_ct' ? vdcFwr : vdcBridge} V</span>
              </div>
              <svg viewBox="0 0 360 210" className="w-full h-52 select-none font-sans">
                {/* Grid lines */}
                <line x1="30" y1="60" x2="340" y2="60" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30" y1="155" x2="340" y2="155" stroke="#475569" strokeWidth="1.5" />

                {/* Top Trace: Pure Input AC Sine Wave */}
                <path d="M 30 60 Q 70 10 110 60 T 190 60 T 270 60 T 350 60" fill="none" stroke="#38bdf8" strokeWidth="2.2" />
                <text x="38" y="22" fill="#38bdf8" fontSize="9.5" fontWeight="bold">Input AC: v_in = {vm} sin(ωt) V</text>

                {/* Bottom Trace: Rectified Output */}
                {mode === 'hwr' ? (
                  <path
                    d="M 30 155 Q 70 105 110 155 L 190 155 Q 230 105 270 155 L 350 155"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                ) : (
                  <path
                    d="M 30 155 Q 70 105 110 155 Q 150 105 190 155 Q 230 105 270 155 Q 310 105 350 155"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                )}
                {/* Average V_dc dashed line */}
                <line
                  x1="30"
                  y1={mode === 'hwr' ? 140 : 124}
                  x2="345"
                  y2={mode === 'hwr' ? 140 : 124}
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  strokeDasharray="5,3"
                />
                <text x="38" y="185" fill="#10b981" fontSize="9.5" fontWeight="bold">
                  Output Pulsating DC  |  Dashed Line = Average V_dc ({mode === 'hwr' ? '0.318 V_m' : '0.636 V_m'})
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {mode === 'vdr' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Topic 17.i AC vs DC & Topic 17.ii Voltage Divider Rule */}
          <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Topic 17(ii): Interactive Voltage Divider Rule (V_x = E · R_x / (R_1 + R_2))
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Source E: {eSrc}V</span>
                <input type="range" min="5" max="50" value={eSrc} onChange={(e) => setESrc(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">R₁: {r1} kΩ</span>
                <input type="range" min="1" max="20" value={r1} onChange={(e) => setR1(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">R₂: {r2} kΩ</span>
                <input type="range" min="1" max="20" value={r2} onChange={(e) => setR2(Number(e.target.value))} className="w-full accent-emerald-500" />
              </div>
            </div>
            <svg viewBox="0 0 340 165" className="w-full h-40 select-none font-sans">
              <polyline points="55,25 250,25 250,145 55,145 55,25" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
              <circle cx="55" cy="85" r="20" className="fill-white dark:fill-slate-800" stroke="#38bdf8" strokeWidth="2" />
              <text x="55" y="89" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">E={eSrc}V</text>
              <rect x="234" y="38" width="32" height="40" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="250" y="62" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontWeight="bold">R₁={r1}k</text>
              <text x="298" y="62" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">V₁ = {v1}V</text>
              <rect x="234" y="92" width="32" height="40" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <text x="250" y="116" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">R₂={r2}k</text>
              <text x="298" y="116" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">V₂ = {v2}V</text>
            </svg>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              Topic 17(i): Behavior of AC Voltage vs. DC Voltage
            </div>
            <svg viewBox="0 0 340 175" className="w-full h-44 select-none font-sans">
              <line x1="25" y1="90" x2="320" y2="90" stroke="#64748b" strokeWidth="1.5" />
              <line x1="25" y1="20" x2="25" y2="160" stroke="#64748b" strokeWidth="1.5" />
              {/* Constant DC Line */}
              <line x1="25" y1="45" x2="315" y2="45" stroke="#10b981" strokeWidth="3" />
              <text x="170" y="36" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
                DC Voltage: Constant Polarity & Magnitude (+V_dc)
              </text>
              {/* Alternating AC Sine Wave */}
              <path d="M 25 90 Q 60 20 95 90 T 165 90 T 235 90 T 305 90" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="170" y="155" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">
                AC Voltage: Periodically Reverses (+ to −) v(t) = V_m sin(ωt)
              </text>
            </svg>
          </div>
        </div>
      )}

      {mode === 'clipper' && (
        <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'pos_clip', label: 'Positive Clipper (Slices Top)' },
                { id: 'neg_clip', label: 'Negative Clipper (Slices Bottom)' },
                { id: 'pos_clamp', label: 'Positive Clamper (Shifts Up +DC)' },
                { id: 'neg_clamp', label: 'Negative Clamper (Shifts Down −DC)' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setWaveMode(b.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    waveMode === b.id ? 'bg-purple-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Clip/Clamp Level: {vClip}V</span>
              <input type="range" min="2" max="9" value={vClip} onChange={(e) => setVClip(Number(e.target.value))} className="w-28 accent-purple-500" />
            </div>
          </div>

          <svg viewBox="0 0 460 190" className="w-full h-48 select-none font-sans">
            <line x1="30" y1="95" x2="430" y2="95" stroke="#475569" strokeWidth="1.5" strokeDasharray="4,2" />
            {/* Input Reference Wave (Dashed Gray) */}
            <path d="M 40 95 Q 90 20 140 95 T 240 95 T 340 95 T 440 95" fill="none" stroke="#64748b" strokeWidth="1.8" strokeDasharray="3,3" />
            {waveMode === 'pos_clip' && (
              <path d="M 40 95 L 65 55 L 115 55 L 140 95 Q 190 170 240 95 L 265 55 L 315 55 L 340 95 Q 390 170 440 95" fill="none" stroke="#a855f7" strokeWidth="3" />
            )}
            {waveMode === 'neg_clip' && (
              <path d="M 40 95 Q 90 20 140 95 L 165 135 L 215 135 L 240 95 Q 290 20 340 95 L 365 135 L 415 135 L 440 95" fill="none" stroke="#ec4899" strokeWidth="3" />
            )}
            {waveMode === 'pos_clamp' && (
              <path d="M 40 55 Q 90 -5 140 55 T 240 55 T 340 55 T 440 55" fill="none" stroke="#10b981" strokeWidth="3" />
            )}
            {waveMode === 'neg_clamp' && (
              <path d="M 40 135 Q 90 80 140 135 T 240 135 T 340 135 T 440 135" fill="none" stroke="#f59e0b" strokeWidth="3" />
            )}
            <text x="235" y="182" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              {waveMode.includes('clip')
                ? `Clipper Output: Slices waveform peaks beyond ${vClip}V without shifting remaining wave`
                : `Clamper Output: Capacitor C shifts entire waveform vertically while preserving Peak-to-Peak (2V_m)`}
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SIMULATOR 5: BJT (NPN & PNP) BIASING & COMMON-EMITTER LAB (Topics 16, 19)
// ============================================================================
