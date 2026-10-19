import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sliders, Zap, Activity, ShieldAlert, RotateCcw, Info } from 'lucide-react';

export default function DiodeZenerSimulator({ preset, topic, langMode = 'dual' }) {
  const [tab, setTab] = useState(preset?.tab || 'pn_bias'); // 'pn_bias' | 'zener_iv' | 'zener_reg'
  const [vd, setVd] = useState(0.8); // -10V to +1.2V for PN bias
  const [semi, setSemi] = useState(preset?.semi || 'Si'); // 'Si' (0.7V) | 'Ge' (0.3V)
  // Zener regulator state (Topic 15)
  const [vin, setVin] = useState(15);
  const [vz, setVz] = useState(6.8);
  const [rs, setRs] = useState(220);
  const [rl, setRl] = useState(470);

  const topicNum = topic?.num || (preset?.tab === 'zener_reg' ? '15' : preset?.tab === 'zener_iv' ? '13' : '14');

  useEffect(() => {
    if (topicNum === '13') {
      setTab('zener_iv');
    } else if (topicNum === '15') {
      setTab('zener_reg');
    } else if (topicNum === '0' || topicNum === '6' || topicNum === '14') {
      setTab('pn_bias');
    }
  }, [topicNum]);

  useEffect(() => {
    if (preset?.tab) setTab(preset.tab);
    if (preset?.semi) setSemi(preset.semi);
  }, [preset]);

  const vk = semi === 'Si' ? 0.7 : 0.3;
  const biasState =
    vd > vk
      ? 'Forward Conducting (ফরোয়ার্ড চালু)'
      : vd > 0
      ? 'Forward Below Knee (ডিপ্লিশন বাধা)'
      : vd === 0
      ? 'Zero Bias / Equilibrium (সাম্যাবস্থা)'
      : 'Reverse Biased (রিভার্স বায়াস — চওড়া ডিপ্লিশন)';

  // Depletion width in px (20px at forward > vk, 54px at 0V, up to 130px at -10V)
  const depWidth = vd >= vk ? 18 : vd > 0 ? 54 - (vd / vk) * 34 : 54 + Math.abs(vd) * 7.5;
  const fwdCurrent = vd > vk ? ((vd - vk) * 45).toFixed(1) : vd < 0 ? '-0.002 (I_S)' : '0.0';

  // Zener Regulator Math (Topic 15)
  const vTh = (vin * rl) / (rs + rl);
  const zenerOn = vTh >= vz;
  const vLoad = zenerOn ? vz : vTh;
  const iSourceMa = ((vin - vLoad) / rs) * 1000;
  const iLoadMa = (vLoad / rl) * 1000;
  const iZenerMa = zenerOn ? Math.max(0, iSourceMa - iLoadMa) : 0;
  const pZenerMw = vLoad * iZenerMa;

  // Dedicated topic information with fluent English & Bangla
  const TOPIC_DETAILS = {
    '0': {
      titleEn: 'Topic #0: Semiconductor Diode & Switching Fundamentals Lab',
      titleBn: 'টপিক #০: সেমিকন্ডাক্টর ডায়োড ও সুইচিং মূলনীতি ল্যাব',
      descEn: 'Inspect unidirectional conduction: Forward bias conduction vs Reverse bias blocking, Knee voltage Vk = 0.7V (Si) vs 0.3V (Ge), and ideal diode switch models.',
      descBn: 'একমুখী বিদ্যুৎ প্রবাহ পরীক্ষা: ফরোয়ার্ড বায়াসে বিদ্যুৎ চলে বনাম রিভার্স বায়াসে বাধা, নি ভোল্টেজ Vk = ০.৭V (Si) ও ০.৩V (Ge) এবং আদর্শ ডায়োড মডেল।',
      buttons: [
        { id: 'pn_bias', labelEn: 'Diode V-I & Bias States', labelBn: 'ডায়োড বায়াস ও V-I কার্ভ' },
        { id: 'zener_iv', labelEn: 'Compare Zener Breakdown', labelBn: 'জেনার ব্রেকডাউন তুলনা' }
      ]
    },
    '6': {
      titleEn: 'Topic #6: Diode Classification (Rectifying, Zener, LED) Lab',
      titleBn: 'টপিক #৬: ডায়োডের শ্রেণিবিভাগ (রেক্টিফায়ার, জেনার, এলইডি) ল্যাব',
      descEn: 'Compare three fundamental diode classes: Rectifier (high current AC-to-DC conversion), Zener (controlled reverse breakdown for regulation), and LED (electroluminescence).',
      descBn: 'ডায়োডের প্রধান তিনটি রূপ: রেক্টিফায়ার (উচ্চ কারেন্ট AC-থেকে-DC), জেনার (ভোল্টেজ নিয়ন্ত্রণের জন্য রিভার্স ব্রেকডাউন) এবং এলইডি (বিদ্যুৎ থেকে আলো)।',
      buttons: [
        { id: 'pn_bias', labelEn: '1. Rectifier PN Junction', labelBn: '১. রেক্টিফায়ার পি-এন জাংশন' },
        { id: 'zener_iv', labelEn: '2. Zener Diode Characteristic', labelBn: '২. জেনার ডায়োড বৈশিষ্ট্য' },
        { id: 'zener_reg', labelEn: '3. Zener Regulator Application', labelBn: '৩. জেনার রেগুলেটর প্রয়োগ' }
      ]
    },
    '13': {
      titleEn: 'Topic #13: Characteristics of Zener Diode & Reverse Breakdown Lab',
      titleBn: 'টপিক #১৩: জেনার ডায়োডের বৈশিষ্ট্য ও রিভার্স ব্রেকডাউন ল্যাব',
      descEn: 'Examine sharp reverse breakdown at Zener knee voltage (V_Z), avalanche multiplication, and dynamic impedance Z_Z in the breakdown region.',
      descBn: 'জেনার নি ভোল্টেজ (V_Z)-এ আকস্মিক রিভার্স ব্রেকডাউন, অ্যাভালাঞ্চ মাল্টিপ্লিকেশন এবং ব্রেকডাউন অঞ্চলে ডায়নামিক ইম্পিডেন্স পরীক্ষা করুন।',
      buttons: [
        { id: 'zener_iv', labelEn: 'Zener Reverse Breakdown Curve', labelBn: 'জেনার রিভার্স ব্রেকডাউন কার্ভ' },
        { id: 'zener_reg', labelEn: 'Test in Shunt Regulator', labelBn: 'শান্ট রেগুলেটরে পরীক্ষা' }
      ]
    },
    '14': {
      titleEn: 'Topic #14: Forward Bias & Reverse Bias (Depletion Layer Physics) Lab',
      titleBn: 'টপিক #১৪: ফরোয়ার্ড বায়াস ও রিভার্স বায়াস (ডিপ্লেশন লেয়ার ফিজিক্স) ল্যাব',
      descEn: 'Vary bias voltage from -10 V to +1.2 V to observe live depletion layer widening/narrowing, internal barrier potential collapse, and carrier diffusion.',
      descBn: 'ভোল্টেজ -১০V থেকে +১.২V পরিবর্তন করে ডিপ্লেশন অঞ্চলের চওড়া ও সরু হওয়া, অভ্যন্তরীণ রোধ প্রাচীরের ভাঙন এবং বাহক পরিবহন প্রত্যক্ষ করুন।',
      buttons: [
        { id: 'pn_bias', labelEn: 'Depletion Layer & Bias Control', labelBn: 'ডিপ্লেশন লেয়ার ও বায়াস নিয়ন্ত্রণ' },
        { id: 'zener_iv', labelEn: 'Reverse Breakdown Boundary', labelBn: 'রিভার্স ব্রেকডাউন সীমানা' }
      ]
    },
    '15': {
      titleEn: 'Topic #15: Zener Diode Shunt Voltage Regulator Circuit Lab',
      titleBn: 'টপিক #১৫: জেনার ডায়োড শান্ট ভোল্টেজ রেগুলেটর সার্কিট ল্যাব',
      descEn: 'Interactive DC line & load regulation bench: tune input voltage Vin (8V–25V) and load resistor RL (100Ω–2kΩ) to verify constant stabilized output Vout = Vz.',
      descBn: 'ইন্টারেক্টিভ DC লাইন ও লোড রেগুলেশন বেঞ্চ: ইনপুট ভোল্টেজ এবং লোড রোধ পরিবর্তন করেও কীভাবে আউটপুট ভোল্টেজ স্থির Vz থাকে তা দেখুন।',
      buttons: [
        { id: 'zener_reg', labelEn: 'Interactive Shunt Regulator', labelBn: 'ইন্টারেক্টিভ শান্ট রেগুলেটর' },
        { id: 'zener_iv', labelEn: 'Inspect Zener Diode Curve', labelBn: 'জেনার ডায়োড কার্ভ দেখুন' }
      ]
    }
  };

  const currentTopic = TOPIC_DETAILS[topicNum] || TOPIC_DETAILS['14'];
  const topicTitle = langMode === 'bn' ? currentTopic.titleBn : langMode === 'en' ? currentTopic.titleEn : `${currentTopic.titleEn} / ${currentTopic.titleBn}`;
  const topicDesc = langMode === 'bn' ? currentTopic.descBn : langMode === 'en' ? currentTopic.descEn : `${currentTopic.descEn} • ${currentTopic.descBn}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 text-slate-800 dark:text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-base sm:text-lg">
            <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
              onClick={() => setTab(b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                tab === b.id ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {langMode === 'bn' ? b.labelBn : langMode === 'en' ? b.labelEn : `${b.labelEn} / ${b.labelBn}`}
            </button>
          ))}
        </div>
      </div>

      {tab === 'pn_bias' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Applied Bias Voltage (V_D):</span>
                <span className={`font-mono font-bold ${vd >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {vd > 0 ? `+${vd.toFixed(1)} V (Forward)` : vd < 0 ? `${vd.toFixed(1)} V (Reverse)` : '0.0 V (No Bias)'}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="1.2"
                step="0.1"
                value={vd}
                onChange={(e) => setVd(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                <button onClick={() => setVd(-6)} className="underline text-rose-500 dark:text-rose-400">Set Reverse (-6V)</button>
                <button onClick={() => setVd(0)} className="underline text-slate-600 dark:text-slate-400">Zero (0V)</button>
                <button onClick={() => setVd(0.9)} className="underline text-emerald-600 dark:text-emerald-400">Set Forward (+0.9V)</button>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block mb-1">Diode Material (Barrier V_K):</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSemi('Si')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition ${semi === 'Si' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                >
                  Silicon (V_K = 0.7 V)
                </button>
                <button
                  onClick={() => setSemi('Ge')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition ${semi === 'Ge' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                >
                  Germanium (V_K = 0.3 V)
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">State:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{biasState}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Depletion Width (W):</span>
                <span className="font-mono text-amber-600 dark:text-amber-300">{depWidth.toFixed(0)} nm (scaled)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Diode Current (I_D):</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">{fwdCurrent} mA</span>
              </div>
            </div>
          </div>

          {/* PN Junction SVG Diagram */}
          <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
            <svg viewBox="0 0 540 230" className="w-full h-56 select-none font-sans">
              {/* P-Region */}
              <rect x="70" y="30" width="200" height="105" rx="6" fill="#d9770633" stroke="#f59e0b" strokeWidth="2" />
              <text x="125" y="50" textAnchor="middle" fill="#fcd34d" fontSize="12" fontWeight="bold">
                P-Type Region (Anode)
              </text>
              <text x="125" y="65" textAnchor="middle" fill="#fde68a" fontSize="9">
                Majority: Holes (○ +q)
              </text>

              {/* N-Region */}
              <rect x="270" y="30" width="200" height="105" rx="6" fill="#0284c733" stroke="#38bdf8" strokeWidth="2" />
              <text x="415" y="50" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="bold">
                N-Type Region (Cathode)
              </text>
              <text x="415" y="65" textAnchor="middle" fill="#bae6fd" fontSize="9">
                Majority: Electrons (● -q)
              </text>

              {/* Dynamic Depletion Layer centered at x = 270 */}
              <rect
                x={270 - depWidth / 2}
                y="30"
                width={depWidth}
                height="105"
                fill="#1e1b4b"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <text x="270" y="22" textAnchor="middle" fill="#d8b4fe" fontSize="10" fontWeight="bold">
                Depletion Layer (ডিপ্লিশন স্তর W = {depWidth.toFixed(0)})
              </text>
              {/* Immobile Ions inside Depletion Region */}
              <text x={270 - depWidth / 4} y="85" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">−</text>
              <text x={270 - depWidth / 4} y="110" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">−</text>
              <text x={270 + depWidth / 4} y="85" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">+</text>
              <text x={270 + depWidth / 4} y="110" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">+</text>

              {/* Holes on P-side and Electrons on N-side */}
              {[95, 130, 165].map((hx, idx) => (
                <circle key={idx} cx={vd > vk ? hx + 55 : vd < 0 ? hx - 12 : hx} cy="95" r="7" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
              ))}
              {[375, 410, 445].map((ex, idx) => (
                <circle key={idx} cx={vd > vk ? ex - 55 : vd < 0 ? ex + 12 : ex} cy="95" r="6" fill="#22d3ee" />
              ))}

              {/* External Battery Circuit at Bottom */}
              <polyline points="70,82 35,82 35,190 235,190" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
              <polyline points="470,82 505,82 505,190 305,190" fill="none" stroke="#94a3b8" strokeWidth="2.5" />

              {/* Battery Plates */}
              <line x1="255" y1="172" x2="255" y2="208" stroke={vd >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={vd >= 0 ? '4' : '2'} />
              <line x1="285" y1="172" x2="285" y2="208" stroke={vd < 0 ? '#10b981' : '#f43f5e'} strokeWidth={vd < 0 ? '4' : '2'} />
              <text x="242" y="170" fill="#10b981" fontSize="12" fontWeight="bold">{vd >= 0 ? '+' : '−'}</text>
              <text x="296" y="170" fill="#f43f5e" fontSize="12" fontWeight="bold">{vd >= 0 ? '−' : '+'}</text>
              <text x="270" y="224" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                External DC Bias V_D = {vd.toFixed(1)} V ({vd > 0 ? 'P to +, N to −' : vd < 0 ? 'P to −, N to +' : '0 V'})
              </text>

              {/* Current Flow Arrow */}
              {vd > vk && (
                <g>
                  <line x1="160" y1="158" x2="380" y2="158" stroke="#10b981" strokeWidth="3" />
                  <polygon points="380,153 392,158 380,163" fill="#10b981" />
                  <text x="270" y="152" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
                    High Forward Majority Current I_D = {fwdCurrent} mA →
                  </text>
                </g>
              )}
              {vd < 0 && (
                <text x="270" y="155" textAnchor="middle" fill="#fb7185" fontSize="10" fontWeight="bold">
                  Majority Current Blocked! (Only tiny minority leakage I_S ≈ 2 nA)
                </text>
              )}
            </svg>
          </div>
        </div>
      )}

      {tab === 'zener_iv' && (
        <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <svg viewBox="0 0 360 260" className="w-full h-64 select-none font-sans">
            {/* Quadrant Axes */}
            <line x1="20" y1="130" x2="340" y2="130" stroke="#64748b" strokeWidth="2" />
            <line x1="200" y1="15" x2="200" y2="245" stroke="#64748b" strokeWidth="2" />
            <text x="305" y="122" fill="#94a3b8" fontSize="9.5">+V_F (Forward)</text>
            <text x="30" y="122" fill="#94a3b8" fontSize="9.5">−V_R (Reverse)</text>
            <text x="206" y="26" fill="#10b981" fontSize="9.5">+I_F (mA)</text>
            <text x="206" y="242" fill="#f43f5e" fontSize="9.5">−I_Z (mA)</text>

            {/* Forward Bias Curve (1st Quadrant) */}
            <path d="M 200 130 L 245 128 Q 265 125 275 25" fill="none" stroke="#10b981" strokeWidth="3" />
            <circle cx="255" cy="122" r="4" fill="#10b981" />
            <text x="295" y="95" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">
              Forward Knee V_K = 0.7 V
            </text>

            {/* Reverse Bias & Sharp Zener Breakdown Curve (3rd Quadrant) */}
            <path d="M 200 130 L 95 135 L 92 240" fill="none" stroke="#f43f5e" strokeWidth="3.5" />
            <circle cx="95" cy="145" r="4.5" fill="#fbbf24" />
            <text x="132" y="152" fill="#fbbf24" fontSize="9" fontWeight="bold">I_ZK (Knee)</text>
            <circle cx="92" cy="225" r="4.5" fill="#f43f5e" />
            <text x="135" y="228" fill="#fda4af" fontSize="9" fontWeight="bold">I_ZM (Max Safe)</text>
            <text x="68" y="115" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">
              −V_Z ({vz}V)
            </text>
            <line x1="94" y1="125" x2="94" y2="135" stroke="#94a3b8" strokeWidth="2" />
          </svg>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">1. Forward Bias Region (1st Quadrant):</div>
              <p>Conducts exactly like an ordinary Silicon PN diode once forward voltage exceeds V_K ≈ 0.7 V.</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-amber-600 dark:text-amber-400 mb-1">2. Reverse Leakage Region (0 to −V_Z):</div>
              <p>Before breakdown, only a tiny microampere reverse saturation current (I_S) flows.</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-rose-600 dark:text-rose-400 mb-1">3. Sharp Zener Breakdown Region (at −V_Z):</div>
              <p>
                At V_R = V_Z, current rises almost vertically between I_ZK and I_ZM while voltage across the Zener stays locked at V_Z — enabling Voltage Regulation!
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'zener_reg' && (
        <div className="space-y-4">
          {/* Interactive Sliders for Topic 15 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Unregulated V_in:</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{vin} V</span>
              </div>
              <input type="range" min="2" max="24" step="0.5" value={vin} onChange={(e) => setVin(Number(e.target.value))} className="w-full accent-cyan-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Zener Rating V_Z:</span>
                <span className="font-mono text-rose-500 dark:text-rose-400 font-bold">{vz} V</span>
              </div>
              <select value={vz} onChange={(e) => setVz(Number(e.target.value))} className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs">
                <option value={5.1}>5.1 V Zener (1N4733A)</option>
                <option value={6.8}>6.8 V Zener (1N4736A)</option>
                <option value={9.1}>9.1 V Zener (1N4739A)</option>
                <option value={12.0}>12.0 V Zener (1N4742A)</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Series Resistor R_S:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{rs} Ω</span>
              </div>
              <input type="range" min="100" max="1000" step="10" value={rs} onChange={(e) => setRs(Number(e.target.value))} className="w-full accent-amber-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Load Resistor R_L:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{rl} Ω</span>
              </div>
              <input type="range" min="100" max="2000" step="10" value={rl} onChange={(e) => setRl(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
          </div>

          {/* Labeled Circuit Diagram of Zener Voltage Regulator (Topic 15 Figure) */}
          <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="lg:col-span-2">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex justify-between">
                <span>Figure: Zener Diode Shunt Voltage Regulator Circuit (Topic 15)</span>
                <span className={zenerOn ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                  {zenerOn ? `REGULATING (V_L Locked at ${vz} V)` : `BELOW BREAKDOWN (V_L = ${vLoad.toFixed(2)} V)`}
                </span>
              </div>
              <svg viewBox="0 0 480 230" className="w-full h-56 select-none font-sans">
                {/* Top and Bottom Rails */}
                <line x1="55" y1="45" x2="135" y2="45" stroke="#38bdf8" strokeWidth="2.5" />
                {/* Series Resistor R_S */}
                <rect x="135" y="33" width="75" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="172" y="49" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">R_S = {rs}Ω</text>
                <text x="172" y="25" textAnchor="middle" fill="#fde68a" fontSize="9">
                  V_RS = {(vin - vLoad).toFixed(1)}V | I_S = {iSourceMa.toFixed(1)}mA →
                </text>

                <line x1="210" y1="45" x2="410" y2="45" stroke="#10b981" strokeWidth="2.5" />
                <line x1="55" y1="190" x2="410" y2="190" stroke="#94a3b8" strokeWidth="2.5" />

                {/* Unregulated DC Input Source V_in on Left */}
                <line x1="55" y1="45" x2="55" y2="95" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="55" y1="135" x2="55" y2="190" stroke="#94a3b8" strokeWidth="2.5" />
                <circle cx="55" cy="115" r="22" className="fill-white dark:fill-slate-800" stroke="#38bdf8" strokeWidth="2" />
                <text x="55" y="112" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">V_in</text>
                <text x="55" y="124" textAnchor="middle" className="fill-slate-800 dark:fill-white" fontSize="9.5" fontWeight="bold">{vin}V</text>

                {/* Shunt Zener Diode Branch at x = 275 (Reverse Biased: Cathode Up, Anode Down) */}
                <line x1="275" y1="45" x2="275" y2="95" stroke="#f43f5e" strokeWidth="2.5" />
                <line x1="275" y1="135" x2="275" y2="190" stroke="#f43f5e" strokeWidth="2.5" />
                {/* Zener Triangle Pointing UP (Cathode at Top = Reverse Biased) */}
                <polygon
                  points="260,130 290,130 275,100"
                  fill={zenerOn ? '#f43f5e' : '#1e293b'}
                  stroke="#f43f5e"
                  strokeWidth="2.2"
                />
                {/* Z-shaped Cathode Bar */}
                <polyline points="256,107 260,100 290,100 294,93" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
                <text x="230" y="115" textAnchor="end" fill="#fda4af" fontSize="9.5" fontWeight="bold">
                  Zener V_Z={vz}V
                </text>
                <text x="230" y="128" textAnchor="end" fill="#fbbf24" fontSize="9">
                  I_Z = {iZenerMa.toFixed(1)} mA ↓
                </text>

                {/* Parallel Load Resistor R_L Branch at x = 385 */}
                <line x1="385" y1="45" x2="385" y2="85" stroke="#10b981" strokeWidth="2.5" />
                <rect x="371" y="85" width="28" height="65" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                <text x="385" y="121" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">R_L</text>
                <line x1="385" y1="150" x2="385" y2="190" stroke="#10b981" strokeWidth="2.5" />
                <text x="435" y="110" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
                  V_L = {vLoad.toFixed(2)}V
                </text>
                <text x="435" y="126" textAnchor="middle" fill="#a7f3d0" fontSize="9">
                  I_L = {iLoadMa.toFixed(1)}mA ↓
                </text>
              </svg>
            </div>

            {/* Live Equations & Telemetry */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                Live Regulator Telemetry (KVL & KCL)
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">1. Thevenin V_Th:</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">{vTh.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">2. Zener Diode Status:</span>
                <span className={`font-bold ${zenerOn ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {zenerOn ? 'ON (Breakdown Lock)' : 'OFF (Open Circuit)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">3. Regulated V_L:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{vLoad.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">4. Source Current I_S:</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">{iSourceMa.toFixed(2)} mA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">5. Load Current I_L:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{iLoadMa.toFixed(2)} mA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">6. Zener Current I_Z:</span>
                <span className="font-mono text-rose-500 dark:text-rose-400">{iZenerMa.toFixed(2)} mA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">7. Zener Power P_Z:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">{pZenerMw.toFixed(1)} mW</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SIMULATOR 4: RECTIFIERS (HWR, FWR, BRIDGE), VDR & CLIPPER/CLAMPER (Topics 17, 18, 20)
// ============================================================================
