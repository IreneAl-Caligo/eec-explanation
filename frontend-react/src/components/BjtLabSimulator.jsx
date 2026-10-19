import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Cpu, Activity, Zap, Sliders, RotateCcw, Info } from 'lucide-react';

export default function BjtLabSimulator({ preset, topic, langMode = 'dual' }) {
  const [bjtType, setBjtType] = useState('NPN'); // 'NPN' | 'PNP'
  const [region, setRegion] = useState('Active'); // 'Active' | 'Saturation' | 'Cutoff'
  const [ibUa, setIbUa] = useState(40); // microamps
  const [beta, setBeta] = useState(100);
  const [vcc, setVcc] = useState(12);
  const [rc, setRc] = useState(1.5); // kOhm

  const topicNum = topic?.num || (preset?.tab === 'ce_amplifier' ? '19b' : '16');

  const icSatMa = vcc / rc;
  const icActiveMa = (beta * ibUa) / 1000;
  const icMa = region === 'Cutoff' ? 0 : Math.min(icSatMa, icActiveMa);
  const ieMa = region === 'Cutoff' ? 0 : icMa + ibUa / 1000;
  const vce = Math.max(0.2, vcc - icMa * rc);

  // Dedicated topic information with bilingual support
  const TOPIC_DETAILS = {
    '16': {
      titleEn: 'Topic #16: BJT Transistor Structure & Biasing Modes Lab',
      titleBn: 'টপিক #১৬: বিজেটি ট্রানজিস্টর গঠন ও বায়াসিং মোড ল্যাব',
      descEn: 'Inspect NPN vs PNP sandwich structure, Emitter-Base forward bias (0.7V), Collector-Base reverse bias, and Active/Saturation/Cutoff operational regions.',
      descBn: 'NPN বনাম PNP স্যান্ডউইচ কাঠামো, এমিটর-বেস ফরোয়ার্ড বায়াস (০.৭ ভোল্ট), কালেক্টর-বেস রিভার্স বায়াস এবং অ্যাক্টিভ/স্যাচুরেশন/কাটঅফ কার্যপ্রণালী পর্যবেক্ষণ করুন।'
    },
    '19b': {
      titleEn: 'Topic #19b: Common-Emitter (CE) Transistor Amplifier Lab',
      titleBn: 'টপিক #১৯খ: কমন-এমিটার (CE) ট্রানজিস্টর অ্যামপ্লিফায়ার ল্যাব',
      descEn: 'Analyze DC biasing Q-point, collector load line, 180° phase inversion between base and collector, and AC small-signal amplification.',
      descBn: 'ডিসি বায়াসিং কিউ-পয়েন্ট, কালেক্টর লোড লাইন, বেস ও কালেক্টরের মাঝে ১৮০° ফেজ ইনভার্সন এবং এসি ক্ষুদ্র-সংকেত পরিবর্ধন বিশ্লেষণ করুন।'
    }
  };

  const currentTopic = TOPIC_DETAILS[topicNum] || TOPIC_DETAILS['16'];
  const topicTitle = langMode === 'bn' ? currentTopic.titleBn : langMode === 'en' ? currentTopic.titleEn : `${currentTopic.titleEn} / ${currentTopic.titleBn}`;
  const topicDesc = langMode === 'bn' ? currentTopic.descBn : langMode === 'en' ? currentTopic.descEn : `${currentTopic.descEn} • ${currentTopic.descBn}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-3 sm:p-4 text-slate-800 dark:text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 text-base">
            <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" /> {topicTitle}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            {topicDesc}
          </p>
        </div>
        <div className="flex gap-2">
          {['NPN', 'PNP'].map((t) => (
            <button
              key={t}
              onClick={() => setBjtType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                bjtType === t ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t} {langMode === 'bn' ? 'ট্রানজিস্টর' : 'Transistor'} ({t === 'NPN' ? (langMode === 'bn' ? 'তীর বাইরে' : 'Arrow OUT') : (langMode === 'bn' ? 'তীর ভেতরে' : 'Arrow IN')})
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
        <div>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block mb-1">Operating Mode / Biasing (16.ii):</span>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              if (e.target.value === 'Cutoff') setIbUa(0);
              else if (e.target.value === 'Saturation') setIbUa(90);
              else setIbUa(40);
            }}
            className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs"
          >
            <option value="Active">Active (EB=Fwd, CB=Rev → Amplifier)</option>
            <option value="Saturation">Saturation (EB=Fwd, CB=Fwd → ON Switch)</option>
            <option value="Cutoff">Cutoff (EB=Rev, CB=Rev → OFF Switch)</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Base Current (I_B):</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{ibUa} μA</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={ibUa}
            onChange={(e) => {
              const v = Number(e.target.value);
              setIbUa(v);
              setRegion(v === 0 ? 'Cutoff' : (v * beta) / 1000 >= icSatMa ? 'Saturation' : 'Active');
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Current Gain (β = I_C/I_B):</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{beta}</span>
          </div>
          <input type="range" min="50" max="200" step="10" value={beta} onChange={(e) => setBeta(Number(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
        </div>
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Collector I_C = βI_B:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{icMa.toFixed(2)} mA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Emitter I_E = I_C+I_B:</span>
            <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{ieMa.toFixed(2)} mA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Q-Point V_CE:</span>
            <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">{vce.toFixed(2)} V</span>
          </div>
        </div>
      </div>

      {/* Dual Visual: NPN/PNP Layer & Symbol Diagram + Common-Emitter NPN Amplifier Schematic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Topic 16(i) & 16(ii) Layer Diagram + Symbol */}
        <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Topic 16(i) & (ii): {bjtType} Physical Doping Structure, Symbol & Active Biasing
          </div>
          <svg viewBox="0 0 420 220" className="w-full h-52 select-none font-sans">
            {/* Three Sandwich Blocks: Emitter, Thin Base, Wide Collector */}
            <rect x="30" y="35" width="95" height="75" rx="4" fill={bjtType === 'NPN' ? '#0284c755' : '#d9770655'} stroke="#38bdf8" strokeWidth="2" />
            <text x="77" y="65" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              {bjtType === 'NPN' ? 'N⁺ (Emitter)' : 'P⁺ (Emitter)'}
            </text>
            <text x="77" y="82" textAnchor="middle" fill="#bae6fd" fontSize="8.5">Heavily Doped</text>

            <rect x="125" y="35" width="45" height="75" fill={bjtType === 'NPN' ? '#d9770655' : '#0284c755'} stroke="#f59e0b" strokeWidth="2" />
            <text x="147" y="65" textAnchor="middle" fill="#fcd34d" fontSize="11" fontWeight="bold">
              {bjtType === 'NPN' ? 'P (Base)' : 'N (Base)'}
            </text>
            <text x="147" y="82" textAnchor="middle" fill="#fde68a" fontSize="7.5">Thin & Light</text>

            <rect x="170" y="35" width="120" height="75" rx="4" fill={bjtType === 'NPN' ? '#0284c755' : '#d9770655'} stroke="#10b981" strokeWidth="2" />
            <text x="230" y="65" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
              {bjtType === 'NPN' ? 'N (Collector)' : 'P (Collector)'}
            </text>
            <text x="230" y="82" textAnchor="middle" fill="#a7f3d0" fontSize="8.5">Moderately Doped (Largest)</text>

            {/* Biasing Batteries Below Blocks */}
            <polyline points="75,110 75,175 147,175 147,110" fill="none" stroke="#10b981" strokeWidth="2" />
            <text x="111" y="195" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">
              V_EE (Forward Biased EB)
            </text>
            <polyline points="147,175 230,175 230,110" fill="none" stroke="#f43f5e" strokeWidth="2" />
            <text x="205" y="195" textAnchor="middle" fill="#fb7185" fontSize="9.5" fontWeight="bold">
              V_CC (Reverse Biased CB)
            </text>

            {/* Schematic Symbol on Right (cx=355, cy=105) */}
            <circle cx="355" cy="105" r="38" className="fill-white dark:fill-slate-800" stroke="#a855f7" strokeWidth="2" />
            <line x1="340" y1="82" x2="340" y2="128" stroke="#94a3b8" strokeWidth="3.5" />
            <line x1="305" y1="105" x2="340" y2="105" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="300" y="102" fill="#fbbf24" fontSize="10" fontWeight="bold">B</text>
            <line x1="340" y1="92" x2="375" y2="68" stroke="#10b981" strokeWidth="2.5" />
            <text x="382" y="68" fill="#34d399" fontSize="10" fontWeight="bold">C</text>
            <line x1="340" y1="118" x2="375" y2="142" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="382" y="148" fill="#38bdf8" fontSize="10" fontWeight="bold">E</text>
            {/* Emitter Arrow */}
            {bjtType === 'NPN' ? (
              <polygon points="368,132 376,143 362,141" fill="#38bdf8" />
            ) : (
              <polygon points="344,120 356,122 350,131" fill="#f59e0b" />
            )}
            <text x="355" y="162" textAnchor="middle" fill="#c084fc" fontSize="9.5" fontWeight="bold">
              {bjtType} Symbol
            </text>
          </svg>
        </div>

        {/* Right: Topic 19 Common-Emitter NPN Operation & 180 deg Phase Shift */}
        <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex justify-between">
            <span>Topic 19: Common-Emitter (CE) NPN Operation & 180° Phase Inversion</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">Gain β = {beta}</span>
          </div>
          <svg viewBox="0 0 420 220" className="w-full h-52 select-none font-sans">
            {/* CE NPN Transistor at center */}
            <circle cx="170" cy="115" r="32" className="fill-white dark:fill-slate-800" stroke="#a855f7" strokeWidth="2" />
            <line x1="158" y1="95" x2="158" y2="135" stroke="#94a3b8" strokeWidth="3" />
            {/* Base Input */}
            <line x1="75" y1="115" x2="158" y2="115" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="115" y="106" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontWeight="bold">
              I_B = {ibUa} μA →
            </text>
            {/* Input AC Sine Wave (Small, 0 deg) */}
            <path d="M 20 115 Q 32 95 44 115 T 68 115" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <text x="44" y="140" textAnchor="middle" fill="#fde68a" fontSize="8.5">Small AC v_in</text>

            {/* Collector Output & R_C */}
            <line x1="158" y1="103" x2="190" y2="80" stroke="#10b981" strokeWidth="2.5" />
            <line x1="190" y1="80" x2="190" y2="25" stroke="#10b981" strokeWidth="2.5" />
            <rect x="176" y="32" width="28" height="36" rx="3" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
            <text x="150" y="54" textAnchor="end" fill="#34d399" fontSize="9" fontWeight="bold">
              R_C={rc}kΩ | I_C={icMa.toFixed(1)}mA ↓
            </text>
            <text x="190" y="18" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">+V_CC = {vcc}V</text>

            {/* Grounded Common Emitter */}
            <line x1="158" y1="127" x2="190" y2="150" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="190" y1="150" x2="190" y2="190" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="175" y1="190" x2="205" y2="190" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="180" y1="196" x2="200" y2="196" stroke="#94a3b8" strokeWidth="2" />
            <text x="242" y="180" fill="#38bdf8" fontSize="9.5" fontWeight="bold">Common Emitter (GND)</text>
            <text x="242" y="165" fill="#7dd3fc" fontSize="9">I_E = I_C + I_B = {ieMa.toFixed(2)}mA</text>

            {/* Amplified & 180-deg Inverted Output Waveform on Right */}
            <line x1="190" y1="80" x2="265" y2="80" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />
            <path d="M 275 85 Q 305 145 335 85 T 395 85" fill="none" stroke="#c084fc" strokeWidth="3" />
            <text x="335" y="45" textAnchor="middle" fill="#c084fc" fontSize="9.5" fontWeight="bold">
              Amplified v_out (V_CE = {vce.toFixed(1)}V)
            </text>
            <text x="335" y="152" textAnchor="middle" fill="#f472b6" fontSize="9" fontWeight="bold">
              180° Phase Shift (উল্টো দশা)
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATOR 6: FET, JFET CONSTRUCTION & OUTPUT CHARACTERISTICS (Topics 20–24)
// ============================================================================
