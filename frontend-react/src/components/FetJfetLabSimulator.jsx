import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sliders, Zap, Activity, Cpu, RotateCcw, Info, Layers } from 'lucide-react';

export default function FetJfetLabSimulator({ preset, topic, langMode = 'dual' }) {
  const [tab, setTab] = useState(preset?.tab || 'jfet_sim'); // 'jfet_sim' | 'tree'
  const [vgs, setVgs] = useState(-1.0); // 0V down to -4V (Pinch-off V_P = -4V)
  const [vds, setVds] = useState(6.0); // 0V to 15V
  const idss = 10; // 10 mA
  const vp = -4.0; // -4 V

  const topicNum = topic?.num || (preset?.tab === 'tree' ? '21' : '23');

  useEffect(() => {
    if (topicNum === '20' || topicNum === '21') {
      setTab('tree');
    } else {
      setTab('jfet_sim');
    }
  }, [topicNum]);

  useEffect(() => {
    if (preset?.tab) setTab(preset.tab);
  }, [preset]);

  // Shockley's Equation & Ohmic vs Pinch-Off calculation
  const vdsSat = Math.max(0, Math.abs(vp) - Math.abs(vgs));
  const idSat = vgs <= vp ? 0 : idss * Math.pow(1 - vgs / vp, 2);
  const idCurrent =
    vgs <= vp
      ? 0
      : vds < vdsSat
      ? idSat * (2 * (vds / vdsSat) - Math.pow(vds / vdsSat, 2))
      : idSat;

  const jfetRegion =
    vgs <= vp
      ? (langMode === 'bn' ? 'কাট-অফ অঞ্চল (চ্যানেল সম্পূর্ণ বন্ধ: I_D = ০)' : 'Cutoff Region (Channel Choked: I_D = 0)')
      : vds < vdsSat
      ? (langMode === 'bn' ? 'ওহমিক / রৈখিক অঞ্চল (ভোল্টেজ নিয়ন্ত্রিত রোধ)' : 'Ohmic / Linear Region (Voltage Controlled Resistor)')
      : (langMode === 'bn' ? 'পিঞ্চ-অফ / স্যাচুরেশন অঞ্চল (স্থির কারেন্ট সোর্স)' : 'Pinch-Off / Active Saturation (Constant Current Source)');

  // Wedge depletion width based on |V_GS| and V_DS
  const depTop = Math.min(46, 12 + Math.abs(vgs) * 7.5 + Math.min(vds, 6) * 1.5);
  const depBot = Math.min(46, 10 + Math.abs(vgs) * 8.5);

  // Dedicated topic information with fluent English & Bangla
  const TOPIC_DETAILS = {
    '20': {
      titleEn: 'Topic #20: Field Effect Transistor (FET) Fundamentals Lab',
      titleBn: 'টপিক #২০: ফিল্ড ইফেক্ট ট্রানজিস্টর (FET) এর মূল ভিত্তি ও কর্মপদ্ধতি ল্যাব',
      descEn: 'Examine unipolar majority carrier conduction, voltage-controlled channel, extremely high input impedance (Rin > 10^9 Ω), and low noise.',
      descBn: 'একমুখী সংখ্যাগুরু বাহকের পরিবহন, ভোল্টেজ নিয়ন্ত্রিত চ্যানেল এবং অতি উচ্চ ইনপুট রোধ (Rin > ১০⁹ ওহম) পরীক্ষা করুন।',
      buttons: [
        { id: 'tree', labelEn: 'FET Fundamentals & Taxonomy', labelBn: 'ফেট মূলনীতি ও শ্রেণিবিভাগ' },
        { id: 'jfet_sim', labelEn: 'Interactive Channel Simulator', labelBn: 'ইন্টারেক্টিভ চ্যানেল সিমুলেটর' }
      ]
    },
    '21': {
      titleEn: 'Topic #21: Classification of FET (JFET, D-MOSFET, E-MOSFET) Lab',
      titleBn: 'টপিক #২১: ফেট (FET) এর শ্রেণিবিভাগ (JFET, D-MOSFET, E-MOSFET) ল্যাব',
      descEn: 'Explore the complete FET taxonomy tree: Junction FET vs Insulated Gate MOSFET (Depletion vs Enhancement mode) and N-channel vs P-channel.',
      descBn: 'সম্পূর্ণ ফেট পরিবার বৃক্ষ: জাংশন ফেট বনাম ইনসুলেটেড গেট মসফেট (ডিপ্লেশন বনাম এনহ্যান্সমেন্ট মোড) এবং N-চ্যানেল বনাম P-চ্যানেল।',
      buttons: [
        { id: 'tree', labelEn: 'Complete FET Taxonomy Tree', labelBn: 'পূর্ণাঙ্গ ফেট পরিবার বৃক্ষ' },
        { id: 'jfet_sim', labelEn: 'Compare JFET Operation', labelBn: 'জেফেটের কার্যপ্রণালী তুলনা' }
      ]
    },
    '22': {
      titleEn: 'Topic #22: JFET Definition & Shockley’s Equation Lab',
      titleBn: 'টপিক #২২: জেফেটের সংজ্ঞা ও শকলে সমীকরণ ল্যাব',
      descEn: 'Calculate drain current ID = IDSS(1 - VGS/VP)² and trace the parabolic transfer characteristics curve from pinch-off VP to IDSS.',
      descBn: 'ড্রেন কারেন্ট ID = IDSS(১ - VGS/VP)² গণনা করুন এবং পিঞ্চ-অফ VP থেকে IDSS পর্যন্ত প্যারাবোলিক কার্ভ পরীক্ষা করুন।',
      buttons: [
        { id: 'jfet_sim', labelEn: 'Shockley Curves & Operating Point', labelBn: 'শকলে কার্ভ ও অপারেটিং পয়েন্ট' },
        { id: 'tree', labelEn: 'FET Taxonomy & Symbols', labelBn: 'ফেট শ্রেণিবিভাগ ও প্রতীক' }
      ]
    },
    '23': {
      titleEn: 'Topic #23: JFET Physical Operation & Depletion Pinch-Off Lab',
      titleBn: 'টপিক #২৩: জেফেটের ভৌত কার্যপ্রণালী ও ডিপ্লেশন পিঞ্চ-অফ ল্যাব',
      descEn: 'Vary gate reverse bias VGS (0V down to -4V) and VDS to witness the asymmetric depletion wedge pinch-off at the drain end.',
      descBn: 'গেট রিভার্স বায়াস VGS এবং ড্রেন ভোল্টেজ VDS পরিবর্তন করে ড্রেন প্রান্তে অসম ওয়েজ পিঞ্চ-অফ প্রত্যক্ষ করুন।',
      buttons: [
        { id: 'jfet_sim', labelEn: 'Live Depletion Wedge Simulator', labelBn: 'লাইভ ডিপ্লেশন ওয়েজ সিমুলেটর' },
        { id: 'tree', labelEn: 'Compare JFET vs BJT', labelBn: 'জেফেট বনাম বিজিটি তুলনা' }
      ]
    },
    '24': {
      titleEn: 'Topic #24: JFET vs BJT Comparison & Output Family Curves Lab',
      titleBn: 'টপিক #২৪: জেফেট বনাম বিজিটি তুলনা ও আউটপুট কার্ভ পরিবার ল্যাব',
      descEn: 'Compare JFET (voltage-controlled, unipolar, negative temp coefficient) with BJT (current-controlled, bipolar), and inspect the ID vs VDS curve family.',
      descBn: 'জেফেট (ভোল্টেজ নিয়ন্ত্রিত, ইউনিপোলার) ও বিজিটি (কারেন্ট নিয়ন্ত্রিত, বাইপোলার) এর তুলনা এবং আউটপুট কার্ভ পরিবার পরীক্ষা করুন।',
      buttons: [
        { id: 'jfet_sim', labelEn: 'JFET Output Curves Family', labelBn: 'জেফেট আউটপুট কার্ভ পরিবার' },
        { id: 'tree', labelEn: 'Side-by-Side BJT vs JFET Table', labelBn: 'পাশাপাশি BJT বনাম JFET ছক' }
      ]
    }
  };

  const currentTopic = TOPIC_DETAILS[topicNum] || TOPIC_DETAILS['23'];
  const topicTitle = langMode === 'bn' ? currentTopic.titleBn : langMode === 'en' ? currentTopic.titleEn : `${currentTopic.titleEn} / ${currentTopic.titleBn}`;
  const topicDesc = langMode === 'bn' ? currentTopic.descBn : langMode === 'en' ? currentTopic.descEn : `${currentTopic.descEn} • ${currentTopic.descBn}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 text-slate-800 dark:text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-2 text-base sm:text-lg">
            <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
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
                tab === b.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {langMode === 'bn' ? b.labelBn : langMode === 'en' ? b.labelEn : `${b.labelEn} / ${b.labelBn}`}
            </button>
          ))}
        </div>
      </div>

      {tab === 'jfet_sim' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700 dark:text-slate-300">Gate Bias V_GS (V_P = −4V):</span>
                <span className="font-mono text-rose-500 dark:text-rose-400 font-bold">{vgs.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="0.0"
                step="0.2"
                value={vgs}
                onChange={(e) => setVgs(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>−4.0V (Pinch-Off)</span>
                <span>−2.0V</span>
                <span>0.0V (Max I_DSS)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700 dark:text-slate-300">Drain Voltage V_DS:</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{vds.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={vds}
                onChange={(e) => setVds(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pinch-Off Locus V_DS(sat) = {vdsSat.toFixed(1)} V</div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Drain Current I_D:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{idCurrent.toFixed(2)} mA (I_DSS=10mA)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Gate Current I_G:</span>
                <span className="font-mono text-sky-600 dark:text-sky-300 font-bold">0.00 μA (R_in &gt; 10⁹ Ω)</span>
              </div>
              <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">{jfetRegion}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Topic 24(i) N-Channel JFET Construction with Dynamic Depletion Wedge */}
            <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Topic 24(i): N-Channel JFET Cross-Section & Wedge Depletion Region
              </div>
              <svg viewBox="0 0 380 230" className="w-full h-56">
                {/* Main N-Type Silicon Bar */}
                <rect x="125" y="25" width="110" height="180" rx="6" fill="#0284c744" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="180" y="118" textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">
                  N-Channel
                </text>

                {/* Drain (Top) and Source (Bottom) Ohmic Contacts */}
                <rect x="145" y="12" width="70" height="14" rx="3" fill="#10b981" />
                <text x="180" y="22" textAnchor="middle" fill="#052e16" fontSize="9.5" fontWeight="bold">
                  DRAIN (D) +V_DS={vds}V
                </text>
                <rect x="145" y="204" width="70" height="14" rx="3" fill="#38bdf8" />
                <text x="180" y="214" textAnchor="middle" fill="#082f49" fontSize="9.5" fontWeight="bold">
                  SOURCE (S) GND
                </text>

                {/* Left & Right Depletion Wedges (wider at Top near Drain!) */}
                <polygon
                  points={`125,52 ${125 + depTop},52 ${125 + depBot},178 125,178`}
                  fill="#4c1d95"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                />
                <polygon
                  points={`235,52 ${235 - depTop},52 ${235 - depBot},178 235,178`}
                  fill="#4c1d95"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                />

                {/* Left & Right P+ Gate Diffused Regions */}
                <rect x="115" y="62" width="24" height="105" rx="4" fill="#e11d48" stroke="#fda4af" strokeWidth="1.5" />
                <text x="127" y="118" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">P⁺</text>
                <rect x="221" y="62" width="24" height="105" rx="4" fill="#e11d48" stroke="#fda4af" strokeWidth="1.5" />
                <text x="233" y="118" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">P⁺</text>

                {/* Gate Terminal Wire */}
                <line x1="55" y1="115" x2="115" y2="115" stroke="#f43f5e" strokeWidth="3" />
                <text x="52" y="102" fill="#fda4af" fontSize="10" fontWeight="bold">GATE (G)</text>
                <text x="52" y="132" fill="#fbbf24" fontSize="9.5" fontWeight="bold">V_GS = {vgs}V</text>

                {/* Electron Flow Arrows through Open Channel */}
                {idCurrent > 0 && (
                  <g stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="4,3">
                    <line x1="180" y1="195" x2="180" y2="35" />
                    <text x="310" y="110" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">
                      I_D = {idCurrent.toFixed(2)} mA ↓
                    </text>
                    <text x="310" y="126" textAnchor="middle" fill="#7dd3fc" fontSize="8.5">
                      (Electrons flow S → D)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Right: Topic 24(iii) JFET Output Characteristics Family of Curves */}
            <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex justify-between">
                <span>Topic 24(iii): JFET Output Characteristics (I_D vs. V_DS Family)</span>
                <span className="text-amber-500 dark:text-amber-400 font-mono">I_D = I_DSS(1 − V_GS/V_P)²</span>
              </div>
              <svg viewBox="0 0 360 230" className="w-full h-56">
                {/* Axes */}
                <line x1="40" y1="195" x2="335" y2="195" stroke="#64748b" strokeWidth="2" />
                <line x1="40" y1="195" x2="40" y2="20" stroke="#64748b" strokeWidth="2" />
                <text x="190" y="218" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Drain-to-Source Voltage V_DS (V) →</text>
                <text x="15" y="110" fill="#94a3b8" fontSize="9.5" transform="rotate(-90 15,110)">I_D (mA) →</text>

                {/* Family of Curves for V_GS = 0V, -1V, -2V, -3V, -4V */}
                {[
                  { g: 0, yFlat: 35, xKnee: 115, label: 'V_GS = 0V (I_DSS=10mA)' },
                  { g: -1, yFlat: 96, xKnee: 96, label: 'V_GS = −1V (5.6mA)' },
                  { g: -2, yFlat: 155, xKnee: 78, label: 'V_GS = −2V (2.5mA)' },
                  { g: -3, yFlat: 185, xKnee: 58, label: 'V_GS = −3V (0.6mA)' },
                  { g: -4, yFlat: 195, xKnee: 40, label: 'V_GS = −4V = V_P (Cutoff)' }
                ].map((c) => (
                  <g key={c.g}>
                    <path
                      d={`M 40 195 Q ${(40 + c.xKnee) / 2} ${c.yFlat} ${c.xKnee} ${c.yFlat} L 315 ${c.yFlat}`}
                      fill="none"
                      stroke={Math.abs(vgs - c.g) < 0.3 ? '#38bdf8' : '#475569'}
                      strokeWidth={Math.abs(vgs - c.g) < 0.3 ? '3' : '1.5'}
                    />
                    <text x="318" y={c.yFlat + 3} textAnchor="end" fill="#94a3b8" fontSize="8">
                      {c.label}
                    </text>
                  </g>
                ))}

                {/* Parabolic Pinch-Off Locus Dashed Curve */}
                <path d="M 40 195 Q 75 140 115 35" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
                <text x="72" y="45" fill="#fbbf24" fontSize="8.5" fontWeight="bold">Ohmic</text>
                <text x="195" y="25" fill="#34d399" fontSize="8.5" fontWeight="bold">Pinch-Off / Saturation Region</text>

                {/* Live Operating Point Dot (V_DS, I_D) */}
                {(() => {
                  const dotX = 40 + (vds / 14) * 265;
                  const dotY = 195 - (idCurrent / 10) * 160;
                  return (
                    <g>
                      <circle cx={dotX} cy={dotY} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x={Math.min(280, dotX + 10)} y={Math.max(25, dotY - 8)} fill="#34d399" fontSize="9.5" fontWeight="bold">
                        Q({vds}V, {idCurrent.toFixed(1)}mA)
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>
      )}

      {tab === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Topic 21: FET Classification Tree */}
          <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-sky-600 dark:text-sky-400 mb-2">Topic 21: Classification Hierarchy of FET</div>
            <svg viewBox="0 0 380 205" className="w-full h-48">
              <rect x="130" y="8" width="120" height="28" rx="6" fill="#0284c7" />
              <text x="190" y="26" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="bold">FET (Unipolar)</text>
              <line x1="190" y1="36" x2="95" y2="62" stroke="#64748b" strokeWidth="2" />
              <line x1="190" y1="36" x2="275" y2="62" stroke="#64748b" strokeWidth="2" />

              <rect x="40" y="62" width="110" height="26" rx="5" fill="#4f46e5" />
              <text x="95" y="79" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">1. JFET (PN Gate)</text>
              <rect x="210" y="62" width="130" height="26" rx="5" fill="#7c3aed" />
              <text x="275" y="79" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">2. MOSFET (SiO₂ Gate)</text>

              {/* JFET Children */}
              <line x1="95" y1="88" x2="55" y2="120" stroke="#64748b" strokeWidth="1.5" />
              <line x1="95" y1="88" x2="135" y2="120" stroke="#64748b" strokeWidth="1.5" />
              <rect x="15" y="120" width="75" height="26" rx="4" fill="#1e293b" stroke="#38bdf8" />
              <text x="52" y="137" textAnchor="middle" fill="#7dd3fc" fontSize="8.5" fontWeight="bold">N-Channel JFET</text>
              <rect x="98" y="120" width="75" height="26" rx="4" fill="#1e293b" stroke="#f59e0b" />
              <text x="135" y="137" textAnchor="middle" fill="#fcd34d" fontSize="8.5" fontWeight="bold">P-Channel JFET</text>

              {/* MOSFET Children */}
              <line x1="275" y1="88" x2="230" y2="120" stroke="#64748b" strokeWidth="1.5" />
              <line x1="275" y1="88" x2="325" y2="120" stroke="#64748b" strokeWidth="1.5" />
              <rect x="185" y="120" width="90" height="28" rx="4" fill="#1e293b" stroke="#10b981" />
              <text x="230" y="137" textAnchor="middle" fill="#34d399" fontSize="8.5" fontWeight="bold">D-MOSFET (N/P)</text>
              <rect x="282" y="120" width="90" height="28" rx="4" fill="#1e293b" stroke="#ec4899" />
              <text x="327" y="137" textAnchor="middle" fill="#f472b6" fontSize="8.5" fontWeight="bold">E-MOSFET (N/P)</text>

              <text x="230" y="170" textAnchor="middle" fill="#94a3b8" fontSize="8.5">D-MOSFET: Channel ON at V_GS=0V</text>
              <text x="310" y="188" textAnchor="middle" fill="#94a3b8" fontSize="8.5">E-MOSFET: OFF until V_GS &gt; V_T</text>
            </svg>
          </div>

          {/* Topic 24(ii): BJT vs JFET Differentiation Table */}
          <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-4 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">Topic 24(ii): Differentiation Between BJT and JFET</div>
            <table className="w-full text-left text-[11px] border-collapse min-w-[280px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  <th className="py-1.5 pr-2">Feature</th>
                  <th className="py-1.5 px-2 text-purple-600 dark:text-purple-400">BJT (Bipolar)</th>
                  <th className="py-1.5 pl-2 text-sky-600 dark:text-sky-400">JFET (Unipolar)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700 dark:text-slate-200">1. Charge Carriers</td>
                  <td className="py-1.5 px-2">Bipolar (Both e⁻ AND holes)</td>
                  <td className="py-1.5 pl-2">Unipolar (Only e⁻ OR holes)</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700 dark:text-slate-200">2. Control Variable</td>
                  <td className="py-1.5 px-2">Current-Controlled (I_B → I_C)</td>
                  <td className="py-1.5 pl-2">Voltage-Controlled (V_GS → I_D)</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700 dark:text-slate-200">3. Input Impedance</td>
                  <td className="py-1.5 px-2">Low (1 kΩ – 1 MΩ, Fwd Biased)</td>
                  <td className="py-1.5 pl-2">Very High (&gt;10⁹ Ω, Rev Biased)</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700 dark:text-slate-200">4. Thermal Stability</td>
                  <td className="py-1.5 px-2">Prone to Thermal Runaway</td>
                  <td className="py-1.5 pl-2">No Thermal Runaway (Stable)</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700 dark:text-slate-200">5. Governing Law</td>
                  <td className="py-1.5 px-2">I_C = β · I_B</td>
                  <td className="py-1.5 pl-2">I_D = I_DSS(1 − V_GS/V_P)²</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION: CSE 1ST YEAR EEC INTERACTIVE LEARNING PLATFORM
// ============================================================================
