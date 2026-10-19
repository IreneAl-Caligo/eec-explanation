import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Atom, Play, Pause, RotateCcw, Activity, Sun, Zap, Info } from 'lucide-react';

export default function AtomicSimulator({ preset, topic, langMode = 'dual' }) {
  const [mat, setMat] = useState(preset?.mat || 'Si'); // 'Si' | 'Ge' | 'N' | 'P'
  const [temp, setTemp] = useState(preset?.temp || 300); // 0 K to 500 K
  const [voltage, setVoltage] = useState(0); // -5V to +5V
  const [animTime, setAnimTime] = useState(0);

  const topicNum = topic?.num || (preset?.mat === 'P' ? '4' : preset?.mat === 'N' ? '5' : '1');

  useEffect(() => {
    if (preset?.mat) setMat(preset.mat);
    if (preset?.temp !== undefined) setTemp(preset.temp);
  }, [preset]);

  // Sync material with specific topic if relevant
  useEffect(() => {
    if (topicNum === '1') setMat('Si');
    else if (topicNum === '2' && mat !== 'Si' && mat !== 'Ge') setMat('Si');
    else if (topicNum === '4') setMat('P');
    else if (topicNum === '5') setMat('N');
  }, [topicNum]);

  // Thermal jitter animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimTime((t) => (t + 1) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const isDopedN = mat === 'N';
  const isDopedP = mat === 'P';
  const isPureGe = mat === 'Ge';
  const egEv = isPureGe ? 0.67 : 1.12;

  const thermalExcitation = temp === 0 ? 0 : Math.min(6, Math.floor((temp / 500) * 5) + (temp > 250 ? 1 : 0));
  const freeElectronsCount = isDopedN ? 4 + thermalExcitation : thermalExcitation;
  const holesCount = isDopedP ? 4 + thermalExcitation : thermalExcitation;
  const driftOffset = (voltage / 5) * 18;

  // Dedicated topic information with fluent English & Bangla
  const TOPIC_DETAILS = {
    '1': {
      titleEn: 'Topic #1: Pure Silicon (Si) Covalent Bonding Lab',
      titleBn: 'টপিক #১: বিশুদ্ধ সিলিকন (Si) সমযোজী বন্ধন ল্যাব',
      descEn: 'Explore 2D Silicon tetravalent lattice: 4 valence electrons shared with 4 neighbors to form stable covalent octet bonds. At 0 K, all bonds are intact (insulator).',
      descBn: 'দ্বিমাত্রিক সিলিকন চতুর্যোজী কেলাস: ৪টি যোজন ইলেকট্রন পাশের ৪টি পরমাণুর সাথে ভাগাভাগি করে স্থিতিশীল অষ্টক বন্ধন তৈরি করে। ০ কেলভিনে কোনো মুক্ত ইলেকট্রন থাকে না।',
      buttons: [
        { id: 'Si', labelEn: 'Pure Silicon (Si) Lattice', labelBn: 'বিশুদ্ধ সিলিকন (Si) কেলাস' },
        { id: 'Ge', labelEn: 'Compare Pure Germanium (Ge)', labelBn: 'জার্মেনিয়াম (Ge) এর সাথে তুলনা' }
      ]
    },
    '2': {
      titleEn: 'Topic #2: Intrinsic Semiconductor Material (Si vs Ge) Lab',
      titleBn: 'টপিক #২: বিশুদ্ধ ইন্ট্রিনসিক সেমিকন্ডাক্টর (Si বনাম Ge) ল্যাব',
      descEn: 'Observe thermal electron-hole generation in pure intrinsic crystals (n = p = ni). Compare Germanium (Eg = 0.67 eV) vs Silicon (Eg = 1.12 eV) carrier generation.',
      descBn: 'তাপীয় শক্তিতে ইলেকট্রন-হোল জোড়া তৈরি প্রত্যক্ষ করুন (n = p = ni)। জার্মেনিয়াম (০.৬৭ eV) বনাম সিলিকন (১.১২ eV) এর মুক্ত বাহক উৎপাদনের তুলনা করুন।',
      buttons: [
        { id: 'Si', labelEn: 'Pure Silicon (Eg = 1.12 eV)', labelBn: 'সিলিকন (Eg = ১.১২ eV)' },
        { id: 'Ge', labelEn: 'Pure Germanium (Eg = 0.67 eV)', labelBn: 'জার্মেনিয়াম (Eg = ০.৬৭ eV)' }
      ]
    },
    '3': {
      titleEn: 'Topic #3: Extrinsic Semiconductor Material & Doping Principles Lab',
      titleBn: 'টপিক #৩: বহির্জাত (Extrinsic) সেমিকন্ডাক্টর ও ডোপিং নীতি ল্যাব',
      descEn: 'Discover how adding trace impurities (1 per 10⁶ atoms) creates extrinsic semiconductors with 10⁶× higher conductivity, obeying Mass-Action Law: n · p = ni².',
      descBn: '১০ লাখ সিলিকনের মধ্যে মাত্র ১টি অপদ্রব্য পরমাণু মিশিয়ে কীভাবে পরিবাহিতা লাখ গুণ বাড়ানো যায় তা দেখুন (ম্যাস-অ্যাকশন ল: n · p = ni²)।',
      buttons: [
        { id: 'N', labelEn: 'Pentavalent Donor Doping (N-Type: P, As)', labelBn: 'পঞ্চযোজী দাতা ডোপিং (N-টাইপ)' },
        { id: 'P', labelEn: 'Trivalent Acceptor Doping (P-Type: B, Ga)', labelBn: 'ত্রযোজী গ্রহীতা ডোপিং (P-টাইপ)' }
      ]
    },
    '4': {
      titleEn: 'Topic #4: P-Type Semiconductor (Boron Trivalent Acceptor) Lab',
      titleBn: 'টপিক #৪: পি-টাইপ (P-Type) সেমিকন্ডাক্টর (বোরন ত্রযোজী গ্রহীতা) ল্যাব',
      descEn: 'Inspect Group-III Boron (B) doping: 3 valence electrons form 3 bonds, leaving 1 deficit hole. Positively charged holes are majority carriers (p ≈ NA) with immobile B⁻ ions.',
      descBn: 'গ্রুপ-৩ বোরন (B) ডোপিং: ৩টি হাত ৩টি বন্ধন গড়ে, ৪র্থ হাত না থাকায় ১টি ঘাটতি হোল তৈরি হয়। হোল হলো সংখ্যাগুরু বাহক (p ≈ NA)।',
      buttons: [
        { id: 'P', labelEn: 'P-Type (Boron Doped: Majority Holes)', labelBn: 'P-টাইপ (বোরন ডোপড: সংখ্যাগুরু হোল)' },
        { id: 'Si', labelEn: 'Compare Undoped Silicon', labelBn: 'বিশুদ্ধ সিলিকনের সাথে তুলনা' }
      ]
    },
    '5': {
      titleEn: 'Topic #5: N-Type Semiconductor (Phosphorus Pentavalent Donor) Lab',
      titleBn: 'টপিক #৫: এন-টাইপ (N-Type) সেমিকন্ডাক্টর (ফসফরাস পঞ্চযোজী দাতা) ল্যাব',
      descEn: 'Inspect Group-V Phosphorus (P) doping: 5 valence electrons create 4 covalent bonds and donate 1 free conduction electron. Electrons are majority carriers (n ≈ ND) with immobile P⁺ ions.',
      descBn: 'গ্রুপ-৫ ফসফরাস (P) ডোপিং: ৫টি যোজন ইলেকট্রনের ৪টি বন্ধনে অংশ নেয় এবং ৫মটি মুক্ত ইলেকট্রন হিসেবে ছুটে বেড়ায়। ইলেকট্রন সংখ্যাগুরু বাহক (n ≈ ND)।',
      buttons: [
        { id: 'N', labelEn: 'N-Type (Phosphorus Doped: Majority Electrons)', labelBn: 'N-টাইপ (ফসফরাস: সংখ্যাগুরু ইলেকট্রন)' },
        { id: 'Si', labelEn: 'Compare Undoped Silicon', labelBn: 'বিশুদ্ধ সিলিকনের সাথে তুলনা' }
      ]
    }
  };

  const currentTopic = TOPIC_DETAILS[topicNum] || TOPIC_DETAILS['1'];
  const topicTitle = langMode === 'bn' ? currentTopic.titleBn : langMode === 'en' ? currentTopic.titleEn : `${currentTopic.titleEn} / ${currentTopic.titleBn}`;
  const topicDesc = langMode === 'bn' ? currentTopic.descBn : langMode === 'en' ? currentTopic.descEn : `${currentTopic.descEn} • ${currentTopic.descBn}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 text-slate-800 dark:text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2 text-base sm:text-lg">
            <Atom className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
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
              onClick={() => setMat(b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                mat === b.id ? 'bg-cyan-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {langMode === 'bn' ? b.labelBn : langMode === 'en' ? b.labelEn : `${b.labelEn} / ${b.labelBn}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Lattice Temperature (T):</span>
            <span className={`font-mono font-bold ${temp === 0 ? 'text-sky-500 dark:text-sky-300' : temp > 350 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {temp} K {temp === 0 ? '(Absolute Zero - Insulator)' : temp === 300 ? '(Room Temp - 27°C)' : '(Elevated Thermal)'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="25"
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            <button onClick={() => setTemp(0)} className="underline text-sky-500 dark:text-sky-400">0 K (Absolute Zero)</button>
            <button onClick={() => setTemp(300)} className="underline text-emerald-600 dark:text-emerald-400">300 K (Room Temp)</button>
            <button onClick={() => setTemp(450)} className="underline text-rose-500 dark:text-rose-400">450 K (High Thermal)</button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Applied External Electric Field (Bias):</span>
            <span className={`font-mono font-bold ${voltage > 0 ? 'text-emerald-600 dark:text-emerald-400' : voltage < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {voltage > 0 ? `+${voltage} V (Drift Right)` : voltage < 0 ? `${voltage} V (Drift Left)` : '0.0 V (Random Thermal Motion)'}
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            step="1"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            <button onClick={() => setVoltage(-5)} className="underline text-rose-500 dark:text-rose-400">-5V (Left Bias)</button>
            <button onClick={() => setVoltage(0)} className="underline text-slate-600 dark:text-slate-400">0V (No Bias)</button>
            <button onClick={() => setVoltage(5)} className="underline text-emerald-600 dark:text-emerald-400">+5V (Right Bias)</button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center text-xs mb-2 px-2 text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Free Electrons (e⁻): <strong className="text-cyan-600 dark:text-cyan-300 font-mono">{freeElectronsCount}</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-amber-500 dark:border-amber-400 bg-amber-400/20"></span> Holes (h⁺): <strong className="text-amber-600 dark:text-amber-300 font-mono">{holesCount}</strong>
          </span>
          <span className="font-mono text-slate-500 dark:text-slate-400">
            Bandgap E_g = <strong className="text-slate-800 dark:text-white">{egEv} eV</strong>
          </span>
        </div>

        <svg viewBox="0 0 520 280" className="w-full max-w-xl h-auto select-none">
          <defs>
            <radialGradient id="siGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
            <radialGradient id="pGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </radialGradient>
            <radialGradient id="bGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
            </marker>
          </defs>

          <line x1="110" y1="70" x2="410" y2="70" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="6" strokeDasharray="6,4" />
          <line x1="110" y1="140" x2="410" y2="140" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="6" strokeDasharray="6,4" />
          <line x1="110" y1="210" x2="410" y2="210" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="6" strokeDasharray="6,4" />
          <line x1="160" y1="40" x2="160" y2="240" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="6" strokeDasharray="6,4" />
          <line x1="260" y1="40" x2="260" y2="240" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="6" strokeDasharray="6,4" />
          <line x1="360" y1="40" x2="360" y2="240" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="6" strokeDasharray="6,4" />

          {[
            { x: 210, y: 70 }, { x: 310, y: 70 },
            { x: 210, y: 140 }, { x: 310, y: 140 },
            { x: 210, y: 210 }, { x: 310, y: 210 },
            { x: 160, y: 105 }, { x: 160, y: 175 },
            { x: 260, y: 105 }, { x: 260, y: 175 },
            { x: 360, y: 105 }, { x: 360, y: 175 },
          ].map((pt, i) => {
            const jitter = temp > 0 ? Math.sin((animTime + i * 40) * (Math.PI / 180)) * (temp / 200) : 0;
            return (
              <g key={i}>
                <circle cx={pt.x - 5 + jitter} cy={pt.y} r="3" className="fill-slate-400 dark:fill-slate-600" />
                <circle cx={pt.x + 5 - jitter} cy={pt.y} r="3" className="fill-slate-400 dark:fill-slate-600" />
              </g>
            );
          })}

          {[
            { cx: 160, cy: 70, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
            { cx: 260, cy: 70, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
            { cx: 360, cy: 70, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
            { cx: 160, cy: 140, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
            {
              cx: 260,
              cy: 140,
              label: isDopedN ? 'P⁺⁵' : isDopedP ? 'B⁺³' : isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴',
              grad: isDopedN ? 'url(#pGrad)' : isDopedP ? 'url(#bGrad)' : 'url(#siGrad)',
              isSpecial: isDopedN || isDopedP,
            },
            { cx: 360, cy: 140, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
            { cx: 160, cy: 210, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
            { cx: 260, cy: 210, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
            { cx: 360, cy: 210, label: isPureGe ? 'Ge⁺⁴' : 'Si⁺⁴', grad: 'url(#siGrad)' },
          ].map((a, i) => (
            <g key={i}>
              <circle
                cx={a.cx}
                cy={a.cy}
                r={a.isSpecial ? 22 : 18}
                fill={a.grad}
                stroke={a.isSpecial ? '#f8fafc' : '#0369a1'}
                strokeWidth={a.isSpecial ? '2.5' : '1.5'}
                filter={a.isSpecial ? 'url(#glow)' : undefined}
              />
              <text
                x={a.cx}
                y={a.cy + 4}
                textAnchor="middle"
                fontSize={a.isSpecial ? '11' : '10'}
                fontWeight="bold"
                fill="#ffffff"
              >
                {a.label}
              </text>
            </g>
          ))}

          {isDopedN && (
            <g>
              <circle
                cx={260 + 32 * Math.cos((animTime * 2 * Math.PI) / 180) + driftOffset}
                cy={140 + 26 * Math.sin((animTime * 2 * Math.PI) / 180)}
                r="5"
                fill="#22d3ee"
                filter="url(#glow)"
              />
              <text x="260" y="180" textAnchor="middle" fontSize="9" fill="#22d3ee" fontWeight="bold">
                5th Loose Electron (Donor e⁻)
              </text>
            </g>
          )}

          {isDopedP && (
            <g>
              <circle
                cx={290 - driftOffset}
                cy={140}
                r="6"
                fill="#f59e0b"
                fillOpacity="0.25"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="2,2"
              />
              <text x="260" y="180" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">
                Hole Vacancy (Acceptor Site)
              </text>
            </g>
          )}

          {thermalExcitation > 0 &&
            Array.from({ length: thermalExcitation }).map((_, idx) => {
              const angle = (idx * (360 / thermalExcitation) + animTime) * (Math.PI / 180);
              const ex = 260 + (80 + idx * 12) * Math.cos(angle) + driftOffset;
              const ey = 140 + (50 + idx * 8) * Math.sin(angle);
              const hx = 260 - (70 + idx * 10) * Math.cos(angle) - driftOffset;
              const hy = 140 - (45 + idx * 8) * Math.sin(angle);
              return (
                <g key={idx}>
                  <circle cx={ex} cy={ey} r="4" fill="#38bdf8" filter="url(#glow)" />
                  <circle cx={hx} cy={hy} r="4.5" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
                </g>
              );
            })}

          {voltage !== 0 && (
            <g>
              <line
                x1={voltage > 0 ? 120 : 400}
                y1="25"
                x2={voltage > 0 ? 400 : 120}
                y2="25"
                stroke="#38bdf8"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <text x="260" y="20" textAnchor="middle" fontSize="10" fill="#38bdf8" fontWeight="bold">
                Applied Field → Electron Drift ({voltage > 0 ? 'Right (+)' : 'Left (-)'})
              </text>
            </g>
          )}
        </svg>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-500"></span> Si/Ge (+4 Core)
          </div>
          {isDopedN && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span> Phosphorus (+5 Donor)
            </div>
          )}
          {isDopedP && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span> Boron (+3 Acceptor)
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Free Electron (e⁻)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-400/20"></span> Hole (h⁺)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-1 border-t-2 border-dashed border-slate-400 dark:border-slate-600"></span> Shared Covalent Pair
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/80">
        <div className="space-y-1">
          <strong className="text-cyan-600 dark:text-cyan-400 block font-semibold">English Core Engineering Concept:</strong>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {mat === 'Si' && (
              temp === 0
                ? "At absolute zero (0 K), Silicon acts as a flawless insulator because all 4 valence electrons are locked inside four covalent bonds. Zero free carriers exist (n = p = 0)."
                : "Pure Silicon has 4 valence electrons forming 4 covalent bonds. Ambient thermal energy creates Electron-Hole Pairs (EHPs) such that free electrons n equal holes p (n = p = n_i)."
            )}
            {mat === 'Ge' && "Germanium has a smaller bandgap (0.67 eV vs 1.12 eV of Si), resulting in higher intrinsic carrier concentration and higher reverse leakage current at room temperature."}
            {mat === 'N' && "N-Type Silicon: Doping with pentavalent Phosphorus introduces 5 valence electrons. 4 bond with neighbors, leaving 1 loose conduction electron per dopant atom. Majority = Electrons, Minority = Holes."}
            {mat === 'P' && "P-Type Silicon: Doping with trivalent Boron introduces 3 valence electrons, creating an incomplete 4th bond called a Hole. Majority = Positively charged Holes, Minority = Electrons."}
          </p>
        </div>
        <div className="space-y-1 border-t md:border-t-0 md:border-l md:pl-3 border-slate-200 dark:border-slate-700">
          <strong className="text-amber-600 dark:text-amber-400 block font-semibold">সহজ বাংলা ব্যাখ্যা (Exam Friendly):</strong>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {mat === 'Si' && (
              temp === 0
                ? "পরম শূন্য তাপমাত্রায় (0 K) সিলিকনের সব ইলেকট্রন সমযোজী বন্ধনে সম্পূর্ণ আবদ্ধ থাকে, ফলে কোনো মুক্ত ইলেকট্রন থাকে না এবং এটি আদর্শ অপরিবাহী বা ইনসুলেটর হিসেবে আচরণ করে।"
                : "বিশুদ্ধ সিলিকন ক্রিস্টালে প্রতিটি পরমাণু পাশের ৪টি পরমাণুর সাথে সমযোজী বন্ধন গঠন করে। তাপমাত্রা বাড়লে কিছু বন্ধন ভেঙে সমান সংখ্যক মুক্ত ইলেকট্রন ও হোলের জন্ম দেয় (n = p = n_i)।"
            )}
            {mat === 'Ge' && "জার্মেনিয়ামের ব্যান্ডগ্যাপ শক্তি কম (0.67 eV), তাই স্বাভাবিক তাপমাত্রায় সিলিকনের চেয়ে বেশি বন্ধন ভেঙে অধিক বিদ্যুৎ পরিবাহী হয়, তবে লিকেজ কারেন্ট বেশি।" }
            {mat === 'N' && "পঞ্চযোজী ফসফরাস ডোপিং করলে ৪টি ইলেকট্রন বন্ধন তৈরি করে এবং ৫ম ইলেকট্রনটি মুক্ত ইলেকট্রন হিসেবে সহজেই বিদ্যুৎ পরিবহন করে। এখানে ইলেকট্রন হলো মেজরিটি ক্যারিয়ার।" }
            {mat === 'P' && "ত্রিযোজী বোরন ডোপিং করলে ৩টি ইলেকট্রন বন্ধন তৈরি করে কিন্তু ৪র্থ বন্ধনে ১টি ইলেকট্রনের ঘাটতি থাকে যা ধনাত্মক হোল (Hole) তৈরি করে। এখানে হোল হলো মেজরিটি ক্যারিয়ার।" }
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SIMULATOR 2: DIRECT/INDIRECT BANDGAP & LED OPTOELECTRONIC LAB (Topics 7-12)
// ============================================================================
