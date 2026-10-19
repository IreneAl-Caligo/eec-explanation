import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sun, Zap, Activity, Sparkles, Info, Eye } from 'lucide-react';

export default function BandgapLedSimulator({ preset, topic, langMode = 'dual' }) {
  const [tab, setTab] = useState(preset?.bgMode ? 'bandgap' : preset?.tab || 'led_lab'); // 'bandgap' | 'construction' | 'led_lab'
  const [bgType, setBgType] = useState(preset?.bgMode || 'direct'); // 'direct' | 'indirect'
  const [ledColor, setLedColor] = useState('red'); // 'ir' | 'red' | 'yellow' | 'green' | 'blue' | 'uv'
  const [vFwd, setVFwd] = useState(2.2); // Forward bias voltage
  const [animPhoton, setAnimPhoton] = useState(0);

  const topicNum = topic?.num || (preset?.bgMode === 'indirect' ? '8' : preset?.tab === 'construction' ? '11' : '7');

  useEffect(() => {
    if (topicNum === '7') {
      setTab('bandgap');
      setBgType('direct');
    } else if (topicNum === '8') {
      setTab('bandgap');
      setBgType('indirect');
    } else if (topicNum === '11') {
      setTab('construction');
    } else if (topicNum === '9' || topicNum === '10' || topicNum === '12') {
      setTab('led_lab');
    }
  }, [topicNum]);

  useEffect(() => {
    if (preset?.bgMode) {
      setTab('bandgap');
      setBgType(preset.bgMode);
    }
    if (preset?.tab) {
      setTab(preset.tab);
    }
  }, [preset]);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimPhoton((p) => (p + 1) % 100);
    }, 40);
    return () => clearInterval(t);
  }, []);

  const LED_DATABASE = {
    ir: { name: 'GaAs (Infrared)', eg: 1.35, lambda: 940, vf: 1.2, hex: '#94a3b8', glow: 'rgba(148,163,184,0.3)', desc: 'Remote controls, optocouplers' },
    red: { name: 'GaAsP (Red)', eg: 1.91, lambda: 650, vf: 1.8, hex: '#ef4444', glow: 'rgba(239,68,68,0.7)', desc: 'Standard indicator, high efficiency' },
    yellow: { name: 'GaAsP:N (Yellow)', eg: 2.10, lambda: 590, vf: 2.0, hex: '#eab308', glow: 'rgba(234,179,8,0.7)', desc: 'Automotive and warning indicators' },
    green: { name: 'GaP (Green)', eg: 2.21, lambda: 565, vf: 2.2, hex: '#22c55e', glow: 'rgba(34,197,94,0.7)', desc: 'Traffic signals, status displays' },
    blue: { name: 'InGaN (Blue)', eg: 2.64, lambda: 470, vf: 3.1, hex: '#3b82f6', glow: 'rgba(59,130,246,0.8)', desc: 'White LED base phosphor, backlights' },
    uv: { name: 'GaN (UV / Violet)', eg: 3.06, lambda: 405, vf: 3.4, hex: '#a855f7', glow: 'rgba(168,85,247,0.8)', desc: 'Sterilization, curing, blacklights' },
  };

  const activeLed = LED_DATABASE[ledColor];
  const isTurnedOn = vFwd >= activeLed.vf;
  const currentMa = isTurnedOn ? Math.min(35, ((vFwd - activeLed.vf) / 60) * 1000) : 0;
  const photonIntensity = isTurnedOn ? Math.min(1.0, currentMa / 20) : 0;

  // Dedicated topic information with fluent English & Bangla
  const TOPIC_DETAILS = {
    '7': {
      titleEn: 'Topic #7: Direct Bandgap Semiconductor (GaAs, GaN) Lab',
      titleBn: 'টপিক #৭: ডিরেক্ট ব্যান্ডগ্যাপ সেমিকন্ডাক্টর (GaAs, GaN) ল্যাব',
      descEn: 'Conduction band minimum aligns vertically with valence band maximum in k-space (Δk = 0). Transition emits energy directly as a visible or infrared photon with high quantum efficiency.',
      descBn: 'পরিবহন ব্যান্ডের সর্বনিম্ন ও যোজন ব্যান্ডের সর্বোচ্চ বিন্দু সরাসরি একই সরলরেখায় থাকে (Δk = ০)। ফলে শক্তি সরাসরি আলোর ফোটন হিসেবে নির্গত হয়।',
      viewLabel: 'E-k Direct Diagram',
      modes: [
        { id: 'direct', labelEn: 'Direct Bandgap (GaAs, GaN)', labelBn: 'ডিরেক্ট ব্যান্ডগ্যাপ (GaAs, GaN)' },
        { id: 'indirect', labelEn: 'Compare Indirect (Si, Ge)', labelBn: 'ইনডিরেক্ট তুলনা (Si, Ge)' }
      ]
    },
    '8': {
      titleEn: 'Topic #8: Indirect Bandgap Semiconductor (Si, Ge) Lab',
      titleBn: 'টপিক #৮: ইনডিরেক্ট ব্যান্ডগ্যাপ সেমিকন্ডাক্টর (Si, Ge) ল্যাব',
      descEn: 'Conduction band minimum is offset in k-space (Δk ≠ 0). Transition requires crystal lattice vibration (phonon) momentum assistance, dissipating energy as heat instead of light.',
      descBn: 'পরিবহন ও যোজন ব্যান্ডের শীর্ষবিন্দু একই রেখায় থাকে না (Δk ≠ ০)। ফোটনের বদলে কেলাসের কাঁপুনি (ফোনন) বা তাপ হিসেবে ৯৯% শক্তি অপচয় হয়।',
      viewLabel: 'E-k Indirect Diagram',
      modes: [
        { id: 'indirect', labelEn: 'Indirect Bandgap (Si, Ge)', labelBn: 'ইনডিরেক্ট ব্যান্ডগ্যাপ (Si, Ge)' },
        { id: 'direct', labelEn: 'Compare Direct (GaAs, GaN)', labelBn: 'ডিরেক্ট তুলনা (GaAs, GaN)' }
      ]
    },
    '9': {
      titleEn: 'Topic #9: Definition & Fundamentals of LED Lab',
      titleBn: 'টপিক #৯: এলইডি (LED) এর সংজ্ঞা ও মূলনীতি ল্যাব',
      descEn: 'An LED is a heavily doped direct bandgap PN-junction that emits light through forward-bias injection electroluminescence when forward voltage exceeds knee threshold (V_F).',
      descBn: 'এলইডি হলো একটি উচ্চ ডোপিংযুক্ত ডিরেক্ট ব্যান্ডগ্যাপ পি-এন জাংশন ডায়োড যা ফরোয়ার্ড বায়াসে আলো ছড়ায় (ইলেক্ট্রোলুমিনেসেন্স)।',
      viewLabel: 'LED Electroluminescence',
      modes: []
    },
    '10': {
      titleEn: 'Topic #10: LED Characteristics & Color Wavelength (λ = 1240 / Eg) Lab',
      titleBn: 'টপিক #১০: এলইডি বৈশিষ্ট্য ও আলোর তরঙ্গদৈর্ঘ্য (λ = ১২৪০ / Eg) ল্যাব',
      descEn: 'Select from 6 semiconductor compounds (IR, Red, Yellow, Green, Blue, UV) to inspect bandgap Eg, turn-on knee voltage Vf, and emitted wavelength λ = hc / Eg.',
      descBn: '৬টি সেমিকন্ডাক্টর যৌগ (IR, লাল, হলুদ, সবুজ, নীল, UV) বেছে নিয়ে ব্যান্ডগ্যাপ Eg এবং আলোর তরঙ্গদৈর্ঘ্যের সম্পর্ক দেখুন।',
      viewLabel: 'V-I Characteristics & Spectrum',
      modes: []
    },
    '11': {
      titleEn: 'Topic #11: Physical Construction of LED (Anvil, Post, Wire & Lens) Lab',
      titleBn: 'টপিক #১১: এলইডি বাতির অভ্যন্তরীণ গঠন (অ্যানভিল, পোস্ট, তার ও লেন্স) ল্যাব',
      descEn: 'Explore the 3D cutaway anatomy of a standard 5mm T-1¾ LED: Anvil Cup (Cathode -), Post (Anode +), Gold Wire Bond, Semiconductor Die, Flat Edge, and Epoxy Dome.',
      descBn: 'একটি ৫ মিমি এলইডি এর ভেতরের প্রতিটি অংশ পর্যবেক্ষণ করুন: অ্যানভিল বাটি (ক্যাথোড -), পোস্ট (অ্যানোড +), সোনার তার, সেমিকন্ডাক্টর দানা ও ইপক্সি গম্বুজ।',
      viewLabel: 'LED Physical Anatomy',
      modes: []
    },
    '12': {
      titleEn: 'Topic #12: Working Principle of LED (Radiative Recombination) Lab',
      titleBn: 'টপিক #১২: এলইডি এর কার্যপ্রণালী (বিকিরণ পুনর্মিলন) ল্যাব',
      descEn: 'Under forward bias (V_D > V_K), electrons inject into P-region and recombine with holes, releasing photon energy ΔE = Eg = hν in real time as animated light rays.',
      descBn: 'ফরোয়ার্ড বায়াসে ইলেকট্রন P-অঞ্চলে গিয়ে হোলের সাথে যুক্ত হয় এবং বাড়তি শক্তি সরাসরি আলোর ঝলকানি (ফোটন) হিসেবে ছুড়ে দেয়।',
      viewLabel: 'Recombination & Emission',
      modes: []
    }
  };

  const currentTopic = TOPIC_DETAILS[topicNum] || TOPIC_DETAILS['12'];
  const topicTitle = langMode === 'bn' ? currentTopic.titleBn : langMode === 'en' ? currentTopic.titleEn : `${currentTopic.titleEn} / ${currentTopic.titleBn}`;
  const topicDesc = langMode === 'bn' ? currentTopic.descBn : langMode === 'en' ? currentTopic.descEn : `${currentTopic.descEn} • ${currentTopic.descBn}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 text-slate-800 dark:text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 text-base sm:text-lg">
            <Sun className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{topicTitle}</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl mt-0.5">
            {topicDesc}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentTopic.modes.length > 0 ? (
            currentTopic.modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setBgType(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                  bgType === m.id ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {langMode === 'bn' ? m.labelBn : langMode === 'en' ? m.labelEn : `${m.labelEn} / ${m.labelBn}`}
              </button>
            ))
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setTab('led_lab')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                  tab === 'led_lab' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {langMode === 'bn' ? 'কার্যপ্রণালী ল্যাব' : 'LED Working Bench'}
              </button>
              <button
                onClick={() => setTab('construction')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                  tab === 'construction' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {langMode === 'bn' ? 'অভ্যন্তরীণ গঠন' : 'LED Construction'}
              </button>
              <button
                onClick={() => setTab('bandgap')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                  tab === 'bandgap' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {langMode === 'bn' ? 'E-k ব্যান্ডগ্যাপ' : 'E-k Bandgap Physics'}
              </button>
            </div>
          )}
        </div>
      </div>

      {tab === 'bandgap' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Select Semiconductor Bandgap Type:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setBgType('direct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  bgType === 'direct' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Direct Bandgap (e.g. GaAs, GaN, InP)
              </button>
              <button
                onClick={() => setBgType('indirect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  bgType === 'indirect' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Indirect Bandgap (e.g. Si, Ge)
              </button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col items-center">
            <svg viewBox="0 0 540 260" className="w-full max-w-xl h-auto select-none font-mono">
              <defs>
                <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,6 L3,0 L6,6 Z" fill="#94a3b8" />
                </marker>
              </defs>

              <line x1="270" y1="230" x2="270" y2="25" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowUp)" />
              <line x1="50" y1="130" x2="490" y2="130" stroke="#475569" strokeWidth="1.5" />
              <text x="278" y="32" fill="#94a3b8" fontSize="11" fontWeight="bold">Energy (E)</text>
              <text x="495" y="134" fill="#94a3b8" fontSize="11" fontWeight="bold">Crystal Momentum (k)</text>
              <text x="270" y="145" textAnchor="middle" fill="#64748b" fontSize="10">k = 0</text>

              <path d="M 120 220 Q 270 140 420 220" fill="none" stroke="#f59e0b" strokeWidth="3" />
              <text x="430" y="220" fill="#f59e0b" fontSize="11" fontWeight="bold">Valence Band (E_V)</text>

              {bgType === 'direct' ? (
                <>
                  <path d="M 120 40 Q 270 100 420 40" fill="none" stroke="#38bdf8" strokeWidth="3" />
                  <text x="430" y="55" fill="#38bdf8" fontSize="11" fontWeight="bold">Conduction Band (E_C)</text>

                  <line x1="270" y1="100" x2="270" y2="140" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="3,3" />
                  <path
                    d={`M 270 120 Q 295 ${110 + 8 * Math.sin(animPhoton * 0.2)} 320 120 T 360 120`}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                  />
                  <polygon points="360,116 370,120 360,124" fill="#fbbf24" />
                  <text x="375" y="124" fill="#fbbf24" fontSize="11" fontWeight="bold">
                    Radiative Photon (hν = E_g)
                  </text>
                  <text x="270" y="85" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">
                    Δk = 0 (Direct Drop)
                  </text>
                </>
              ) : (
                <>
                  <path d="M 230 40 Q 370 100 500 50" fill="none" stroke="#818cf8" strokeWidth="3" />
                  <text x="380" y="60" fill="#818cf8" fontSize="11" fontWeight="bold">Shifted C.B. (E_C)</text>

                  <line x1="370" y1="100" x2="270" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,3" />
                  <text x="350" y="135" fill="#f43f5e" fontSize="10" fontWeight="bold">
                    Δk ≠ 0 (Phonon / Heat Loss)
                  </text>
                  <text x="270" y="85" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    Cannot conserve momentum with photon alone!
                  </text>
                </>
              )}

              <line x1="240" y1="100" x2="240" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="235" y1="100" x2="245" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="235" y1="140" x2="245" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="230" y="124" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="bold">
                Bandgap (E_g)
              </text>
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">Direct Bandgap (Topic 7):</strong>
                <p className="text-slate-600 dark:text-slate-300">
                  Minimum of conduction band and maximum of valence band align at the exact same crystal momentum (<code className="text-emerald-600 dark:text-emerald-300">k = 0</code>). Electrons drop directly into holes without changing momentum, releasing energy predominantly as light photons (GaAs, GaN). Essential for LEDs & Lasers!
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Indirect Bandgap (Topic 8):</strong>
                <p className="text-slate-600 dark:text-slate-300">
                  Conduction band minimum and valence band maximum occur at different momentum values (<code className="text-indigo-600 dark:text-indigo-300">k_c ≠ k_v</code>). Carrier recombination requires simultaneous interaction with a crystal lattice vibration (phonon). Excess energy dissipates as heat, making Silicon & Germanium unsuited for LEDs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'construction' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col items-center">
            <svg viewBox="0 0 540 320" className="w-full max-w-xl h-auto select-none font-sans">
              <defs>
                <linearGradient id="epoxyDome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="leadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              <path
                d="M 180 200 L 180 120 A 90 90 0 0 1 360 120 L 360 200 Z"
                fill="url(#epoxyDome)"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text x="270" y="55" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                Transparent Epoxy Dome Lens
              </text>

              <line x1="360" y1="180" x2="360" y2="200" stroke="#f43f5e" strokeWidth="4" />
              <text x="375" y="195" fill="#f43f5e" fontSize="9" fontWeight="bold">Flat Edge (Cathode -)</text>

              <path d="M 290 200 L 290 145 L 315 130 L 265 130 L 290 145 Z" fill="#cbd5e1" stroke="#475569" />
              <rect x="282" y="200" width="16" height="110" fill="url(#leadGrad)" rx="2" />
              <text x="290" y="305" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                Cathode (-) Short Lead
              </text>

              <rect x="232" y="140" width="14" height="60" fill="#cbd5e1" stroke="#475569" />
              <rect x="232" y="200" width="14" height="120" fill="url(#leadGrad)" rx="2" />
              <text x="239" y="315" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                Anode (+) Long Lead
              </text>

              <rect x="282" y="132" width="16" height="8" fill="#e11d48" stroke="#ffffff" strokeWidth="1" />
              <text x="290" y="125" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">
                Semiconductor Die
              </text>

              <path d="M 240 140 Q 260 110 286 132" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="250" y="105" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                Gold Wire Bond
              </text>

              <line x1="315" y1="135" x2="380" y2="135" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
              <text x="385" y="138" fill="#e2e8f0" fontSize="9">Reflective Anvil Cup</text>

              <line x1="282" y1="134" x2="160" y2="134" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
              <text x="155" y="137" textAnchor="end" fill="#e2e8f0" fontSize="9">Ultra-thin Top P-Layer</text>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mt-3 text-xs">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold block mb-1">1. Thin P-Type Layer</span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">Top layer is fabricated extremely thin so emitted photons escape directly without being reabsorbed.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl">
                <span className="text-amber-600 dark:text-amber-400 font-bold block mb-1">2. Reflective Metal Cup</span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">Shaped cavity on the cathode anvil directs downward-emitted photons upward into the optical path.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl">
                <span className="text-rose-600 dark:text-rose-400 font-bold block mb-1">3. Epoxy Dome Lens</span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">Hemispherical epoxy focuses the radiation pattern and matches refractive index to prevent internal reflection.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'led_lab' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Select LED Semiconductor & Wavelength:</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(LED_DATABASE).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setLedColor(key)}
                  style={{
                    borderColor: ledColor === key ? item.hex : 'transparent',
                    backgroundColor: ledColor === key ? item.hex : undefined,
                    color: ledColor === key ? (key === 'yellow' ? '#000000' : '#ffffff') : undefined
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold border transition shadow-xs ${
                    ledColor === key
                      ? ''
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Forward Voltage Bias (V_F):</span>
              <span className={`font-mono font-bold ${isTurnedOn ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {vFwd.toFixed(2)} V {isTurnedOn ? `(Conducting — I_F = ${currentMa.toFixed(1)} mA)` : `(OFF — Below Knee ${activeLed.vf} V)`}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.05"
              value={vFwd}
              onChange={(e) => setVFwd(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <button onClick={() => setVFwd(0.5)} className="underline text-slate-500 dark:text-slate-400">0.5 V (Below Turn-on)</button>
              <button onClick={() => setVFwd(activeLed.vf)} className="underline text-amber-600 dark:text-amber-400">Knee Voltage ({activeLed.vf} V)</button>
              <button onClick={() => setVFwd(activeLed.vf + 0.8)} className="underline text-emerald-600 dark:text-emerald-400">Full Conduction (+{ (activeLed.vf + 0.8).toFixed(1) } V)</button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col items-center relative overflow-hidden">
            {isTurnedOn && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${activeLed.glow} 0%, transparent 70%)`,
                  opacity: photonIntensity,
                }}
              />
            )}

            <svg viewBox="0 0 520 220" className="w-full max-w-xl h-auto select-none font-sans relative z-10">
              <rect x="120" y="80" width="130" height="70" fill="#dc2626" fillOpacity="0.7" rx="3" />
              <text x="185" y="120" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                P-Type (Anode +)
              </text>
              <text x="185" y="136" textAnchor="middle" fill="#fecaca" fontSize="9">
                Majority Holes (h⁺)
              </text>

              <rect x="270" y="80" width="130" height="70" fill="#2563eb" fillOpacity="0.7" rx="3" />
              <text x="335" y="120" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                N-Type (Cathode -)
              </text>
              <text x="335" y="136" textAnchor="middle" fill="#bfdbfe" fontSize="9">
                Majority Electrons (e⁻)
              </text>

              <rect
                x="250"
                y="75"
                width="20"
                height="80"
                fill="#facc15"
                fillOpacity={isTurnedOn ? 0.35 : 0.15}
                stroke="#facc15"
                strokeDasharray="2,2"
              />
              <text x="260" y="65" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">
                Active Recombination Zone
              </text>

              {isTurnedOn ? (
                <>
                  <circle cx={256} cy={100} r="4" fill="#38bdf8" />
                  <circle cx={264} cy={100} r="4.5" fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" />
                  {[0, 1, 2, 3].map((idx) => {
                    const waveY = 85 + idx * 16;
                    const offset = (animPhoton * 3 + idx * 25) % 80;
                    return (
                      <g key={idx} transform={`translate(0, ${-offset * 0.5})`} opacity={1 - offset / 80}>
                        <path
                          d={`M 260 ${waveY} Q 250 ${waveY - 10} 240 ${waveY} T 220 ${waveY}`}
                          fill="none"
                          stroke={activeLed.hex}
                          strokeWidth="2.5"
                        />
                        <polygon points="215,85 210,88 215,91" fill={activeLed.hex} />
                      </g>
                    );
                  })}
                  <text x="260" y="30" textAnchor="middle" fill={activeLed.hex} fontSize="12" fontWeight="bold">
                    ✨ Emitting Monochromatic Light (λ = {activeLed.lambda} nm)
                  </text>
                </>
              ) : (
                <text x="260" y="30" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  🔒 V_F &lt; V_Knee: Barrier Potential Blocks Current (No Light)
                </text>
              )}
            </svg>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-center">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Bandgap (E_g):</span>
                <span className="font-mono font-bold text-amber-500 dark:text-amber-300">{activeLed.eg} eV</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Wavelength (λ):</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">{activeLed.lambda} nm</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Knee Voltage (V_K):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300">{activeLed.vf} V</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Diode Current (I_F):</span>
                <span className="font-mono font-bold text-rose-500 dark:text-rose-300">{currentMa.toFixed(1)} mA</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SIMULATOR 3: PN JUNCTION BIASING, ZENER I-V & VOLTAGE REGULATOR (Topics 0, 6, 13, 14, 15)
// ============================================================================
