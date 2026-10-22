import React, { useState } from 'react';
import {
  ShieldAlert, HelpCircle, CheckCircle2, RotateCcw, Award,
  Sparkles, Zap, ArrowRight, Eye, RefreshCw, Cpu
} from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { playMechanicalClick, playSuccessChime, playBuzzer } from '../../utils/audioEngine';

const SCENARIOS = [
  {
    id: 'sc1',
    titleEn: 'Trouble Scenario 1: DC Power Supply Output is Dead (0.0 V)',
    titleBn: 'ফল্ট দৃশ্যপট ১: ডিসি পাওয়ার সাপ্লাইয়ের আউটপুট ভোল্টেজ সম্পূর্ণ শূন্য (০.০ V)',
    descriptionEn: 'A 12V AC Half-Wave Rectifier circuit is turned ON. The input AC transformer is active, but the output across load resistor RL reads 0.0V. Use your digital multimeter to identify the defective component.',
    descriptionBn: '১২V এসি হাফ-ওয়েভ রেকটিফায়ার সার্কিটটি অন করা হয়েছে। ট্রান্সফরমার ঠিক আছে কিন্তু লোড রেজিস্টরের দুই প্রান্তে ভোল্টেজ ০.০V দেখাচ্ছে। মাল্টিমিটার প্রব দিয়ে মেপে নষ্ট উপাদানটি বের করুন।',
    nodes: ['Transformer Secondary (12V AC)', 'Diode Anode', 'Diode Cathode', 'Load Resistor Vout', 'Ground (0V)'],
    // Test point readings: fromNode - toNode
    readings: {
      'Transformer Secondary (12V AC)-Ground (0V)': { dc: '0.0 V', ac: '12.0 V', r: '1.2 Ω' },
      'Diode Anode-Ground (0V)': { dc: '0.0 V', ac: '12.0 V', r: '1.2 Ω' },
      'Diode Cathode-Ground (0V)': { dc: '0.0 V', ac: '0.0 V', r: '1000 Ω' },
      'Load Resistor Vout-Ground (0V)': { dc: '0.0 V', ac: '0.0 V', r: '1000 Ω' },
      'Diode Anode-Diode Cathode': { dc: '0.0 V', ac: '12.0 V', r: 'O.L (Open Loop)' },
    },
    optionsEn: [
      'Diode D1 is Internally OPEN (Infinite Resistance)',
      'Diode D1 is SHORTED (Zero Resistance)',
      'Load Resistor RL is Shorted to Ground',
      'AC Transformer is Disconnected'
    ],
    optionsBn: [
      'ডায়োড D1 ইন্টার্নালি ওপেন হয়ে গেছে (অসীম রোধ)',
      'ডায়োড D1 শর্ট হয়ে গেছে (শূন্য রোধ)',
      'লোড রেজিস্টর RL গ্রাউন্ডে শর্ট হয়ে গেছে',
      'এসি ট্রান্সফরমার বিচ্ছিন্ন রয়েছে'
    ],
    correctIdx: 0,
    explanationEn: 'Because V(Anode) has 12V AC while V(Cathode) has 0V, the entire 12V drop appears across the diode. Resistance test across the diode shows O.L (infinite resistance). Diode D1 has burned open!',
    explanationBn: 'অ্যানোডে ১২V এসি রয়েছে কিন্তু ক্যাথোডে ০V। ডায়োডের দুই প্রান্তে রেজিস্ট্যান্স মাপলে O.L (অসীম রোধ) দেখায়। অতএব ডায়োড D1 ইন্টার্নালি ওপেন হয়ে গেছে!'
  },
  {
    id: 'sc2',
    titleEn: 'Trouble Scenario 2: Zener Regulator Output Stuck at 0.0 V',
    titleBn: 'ফল্ট দৃশ্যপট ২: জেনার রেগুলেটর আউটপুট সবসময় ০.০ V হয়ে আছে',
    descriptionEn: 'A 15V DC source feeds a 220Ω series resistor Rs connected to a 10V Zener diode DZ and 470Ω load. The output voltage Vout is 0.0V, and resistor Rs is getting extremely hot! Find the fault.',
    descriptionBn: '১৫V ডিসি সোর্স থেকে ২২০Ω রেজিস্টর দিয়ে ১০V জেনার ডায়োড ও লোডে সংযোগ দেওয়া হয়েছে। আউটপুট ০.০V দেখাচ্ছে এবং রেজিস্টর Rs অতিরিক্ত গরম হয়ে যাচ্ছে! সমস্যাটি খুঁজুন।',
    nodes: ['Vin (15V DC)', 'Node Vz/Vout', 'Ground (0V)'],
    readings: {
      'Vin (15V DC)-Ground (0V)': { dc: '15.0 V', ac: '0.0 V', r: 'Low' },
      'Node Vz/Vout-Ground (0V)': { dc: '0.0 V', ac: '0.0 V', r: '0.2 Ω (Short)' },
      'Vin (15V DC)-Node Vz/Vout': { dc: '15.0 V', ac: '0.0 V', r: '220 Ω' },
    },
    optionsEn: [
      'Zener Diode DZ is Shorted to Ground',
      'Series Resistor Rs is Open',
      'Input Power Supply is Dead',
      'Load Resistor RL is Open'
    ],
    optionsBn: [
      'জেনার ডায়োড DZ গ্রাউন্ডের সাথে শর্ট হয়ে গেছে',
      'সিরিজ রেজিস্টর Rs ওপেন হয়ে গেছে',
      'ইনপুট পাওয়ার সাপ্লাই নষ্ট',
      'লোড রেজিস্টর RL ওপেন হয়ে গেছে'
    ],
    correctIdx: 0,
    explanationEn: 'The resistance across Node Vz to Ground is 0.2Ω (a dead short). The entire 15V drops across Rs, causing 68mA excess current and extreme heat. The Zener diode has failed shorted!',
    explanationBn: 'Node Vz থেকে গ্রাউন্ডের রোধ মাত্র ০.২Ω (সরাসরি শর্ট)। সমস্ত ১৫V ভোল্টেজ Rs-এর দুই প্রান্তে ড্রপ হওয়ায় অতিরিক্ত কারেন্টে তা গরম হচ্ছে। জেনার ডায়োডটি শর্ট হয়ে গেছে!'
  },
  {
    id: 'sc3',
    titleEn: 'Trouble Scenario 3: BJT Amplifier Has Extremely Low AC Gain',
    titleBn: 'ফল্ট দৃশ্যপট ৩: বিজেটি অ্যাম্প্লিফায়ারের এসি গেইন অস্বাভাবিকভাবে কমে গেছে',
    descriptionEn: 'A Common-Emitter BJT amplifier expected to have a voltage gain Av = 80 is only producing Av = 1.8. DC biasing voltages (Vb=1.8V, Vc=8.5V, Ve=1.1V) are completely normal! What is the cause?',
    descriptionBn: 'একটি কমন-ইমিটার বিজেটি অ্যাম্প্লিফায়ারের গেইন ৮০ হওয়ার কথা ছিল, কিন্তু বাস্তবে গেইন আসছে মাত্র ১.৮! ডিসি বায়াসিং ভোল্টেজ সম্পূর্ণ ঠিক আছে। এর কারণ কী?',
    nodes: ['Input (Vin)', 'BJT Base', 'BJT Collector (Vout)', 'BJT Emitter', 'Ground (0V)'],
    readings: {
      'BJT Emitter-Ground (0V)': { dc: '1.1 V', ac: '120 mV AC (AC signal present!)', r: '1000 Ω' },
      'BJT Collector (Vout)-Ground (0V)': { dc: '8.5 V', ac: '216 mV AC', r: 'High' },
    },
    optionsEn: [
      'Emitter Bypass Capacitor CE is OPEN',
      'Transistor Q1 is Burned Out',
      'Collector Resistor RC is Shorted',
      'DC Power Supply VCC is Reversed'
    ],
    optionsBn: [
      'ইমিটার বাইপাস ক্যাপাসিটর CE ওপেন (বিচ্ছিন্ন) হয়ে গেছে',
      'ট্রানজিস্টর Q1 সম্পূর্ণ নষ্ট হয়ে গেছে',
      'কালেক্টর রেজিস্টর RC শর্ট হয়ে গেছে',
      'ডিসি পাওয়ার সাপ্লাই VCC উল্টো যুক্ত'
    ],
    correctIdx: 0,
    explanationEn: 'Notice that AC voltage is present on the Emitter! With CE working, the emitter should be an AC ground (0V AC). Because CE is open, the full unbypassed RE causes massive negative feedback, reducing gain to Av ≈ -RC/RE = -2.2k/1k = -2.2!',
    explanationBn: 'ইমিটারে এসি ভোল্টেজ বিদ্যমান! ক্যাপাসিটর CE ঠিক থাকলে ইমিটার এসি গ্রাউন্ড হতো। CE ওপেন থাকায় RE রেজিস্টরটি নেগেটিভ ফিডব্যাক দিচ্ছে, ফলে গেইন কমে Av ≈ -RC/RE = -২.২ হয়ে গেছে!'
  }
];

export default function CircuitTroubleshootingGameView() {
  const { langMode } = useLabStore();
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [redProbeNode, setRedProbeNode] = useState('');
  const [blackProbeNode, setBlackProbeNode] = useState('Ground (0V)');
  const [dmmMode, setDmmMode] = useState('DCV'); // 'DCV', 'ACV', 'OHM'
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[activeScenarioIdx];

  // Set default red probe on change
  React.useEffect(() => {
    setRedProbeNode(scenario.nodes[0]);
    setBlackProbeNode(scenario.nodes[scenario.nodes.length - 1]);
    setSelectedHypothesis(null);
    setIsAnswerSubmitted(false);
  }, [activeScenarioIdx]);

  // Read Multimeter Value
  const probeKey1 = `${redProbeNode}-${blackProbeNode}`;
  const probeKey2 = `${blackProbeNode}-${redProbeNode}`;
  const readingData = scenario.readings[probeKey1] || scenario.readings[probeKey2] || { dc: '0.0 V', ac: '0.0 V', r: '0.0 Ω' };

  let dmmDisplay = '0.00 V';
  if (redProbeNode === blackProbeNode) {
    dmmDisplay = dmmMode === 'OHM' ? '0.00 Ω' : '0.00 V';
  } else if (dmmMode === 'DCV') {
    dmmDisplay = readingData.dc;
  } else if (dmmMode === 'ACV') {
    dmmDisplay = readingData.ac;
  } else if (dmmMode === 'OHM') {
    dmmDisplay = readingData.r;
  }

  const handleSubmitDiagnosis = () => {
    playMechanicalClick();
    if (selectedHypothesis === null) return;
    setIsAnswerSubmitted(true);
    if (selectedHypothesis === scenario.correctIdx) {
      setScore((s) => s + 100);
      playSuccessChime();
    } else {
      playBuzzer();
    }
  };

  const handleNextScenario = () => {
    playMechanicalClick();
    if (activeScenarioIdx < SCENARIOS.length - 1) {
      setActiveScenarioIdx((i) => i + 1);
    }
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {langMode === 'bn' ? 'ভার্চুয়াল ফল্ট-ডায়াগনস্টিক ও ট্রাবলশুটিং চ্যালেঞ্জ' : 'Circuit Troubleshooting & Fault Diagnostics Lab'}
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Interactive DMM Simulation
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'ডিজিটাল মাল্টিমিটারের লাল ও কালো প্রব দিয়ে মেপে সার্কিটের নষ্ট বা ভুল কম্পোনেন্ট শনাক্ত করুন'
                : 'Probe test nodes with the virtual DMM to deduce open diodes, shorts, and defective components'}
            </p>
          </div>
        </div>

        {/* Diagnostic Score Card */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {langMode === 'bn' ? 'স্কোর:' : 'Diagnostic Score:'}
            </span>
            <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
              {score} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Diagnostics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 5 COLUMNS: Virtual Digital Multimeter (DMM) Bench Instrument */}
        <div className="lg:col-span-5 bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Digital Multimeter (Model DMM-8000)
            </span>
            <span className="text-[10px] font-mono text-slate-500">True RMS 600V CAT III</span>
          </div>

          {/* DMM 7-Segment LCD Display */}
          <div className="p-4 rounded-2xl bg-[#031509] border-2 border-emerald-900/60 shadow-inner flex flex-col items-end justify-center font-mono">
            <div className="text-[10px] text-emerald-500/70 uppercase tracking-widest flex items-center gap-2">
              <span>{dmmMode} MODE</span>
              <span className="animate-pulse">● MEASURING</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-wider my-2">
              {dmmDisplay}
            </div>
            <div className="text-[10px] text-emerald-600">
              Red Probe: [{redProbeNode}] ➔ Black Probe: [{blackProbeNode}]
            </div>
          </div>

          {/* Multimeter Rotary Mode Dial */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'DCV', label: 'DC Volts (V=)' },
              { id: 'ACV', label: 'AC Volts (V~)' },
              { id: 'OHM', label: 'Ohms (Ω Continuity)' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => { playMechanicalClick(); setDmmMode(m.id); }}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                  dmmMode === m.id
                    ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Red Probe Selection (+) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm"></span>
              Red Probe (+) Test Point:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {scenario.nodes.map((node) => (
                <button
                  key={node}
                  onClick={() => { playMechanicalClick(); setRedProbeNode(node); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    redProbeNode === node
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {node}
                </button>
              ))}
            </div>
          </div>

          {/* Black Probe Selection (-) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-600 inline-block shadow-sm"></span>
              Black Probe (-) Test Point (Reference):
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {scenario.nodes.map((node) => (
                <button
                  key={node}
                  onClick={() => { playMechanicalClick(); setBlackProbeNode(node); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    blackProbeNode === node
                      ? 'bg-slate-800 border-slate-400 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {node}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 7 COLUMNS: Malfunction Scenario & Hypothesis Submission */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-mono font-black">
              Case {activeScenarioIdx + 1} of {SCENARIOS.length}
            </span>
            <span className="text-xs text-slate-500">Boylestad Troubleshooting Guide</span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
              {langMode === 'bn' ? scenario.titleBn : scenario.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {langMode === 'bn' ? scenario.descriptionBn : scenario.descriptionEn}
            </p>
          </div>

          {/* Diagnostic Hypothesis Selection */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 block">
              {langMode === 'bn'
                ? 'মাল্টিমিটারের রিডিং বিশ্লেষণ করে আপনার ডায়াগনোসিস নির্বাচন করুন:'
                : 'Select Your Diagnostic Conclusion Based on DMM Readings:'}
            </span>

            <div className="space-y-2">
              {(langMode === 'bn' ? scenario.optionsBn : scenario.optionsEn).map((opt, idx) => {
                const isSelected = selectedHypothesis === idx;
                let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                if (isSelected) {
                  btnStyle = 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold';
                }

                if (isAnswerSubmitted) {
                  if (idx === scenario.correctIdx) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelected && idx !== scenario.correctIdx) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-800 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => { playMechanicalClick(); setSelectedHypothesis(idx); }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition text-xs sm:text-sm flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                    {isAnswerSubmitted && idx === scenario.correctIdx && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit and Next Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedHypothesis === null}
                onClick={handleSubmitDiagnosis}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
              >
                <span>{langMode === 'bn' ? 'ডায়াগনোসিস জমা দিন' : 'Submit Diagnosis'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNextScenario}
                  disabled={activeScenarioIdx >= SCENARIOS.length - 1}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
                >
                  <span>{langMode === 'bn' ? 'পরবর্তী কেস →' : 'Next Case →'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Engineer Post-Mortem Explanation */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-2xl border-2 space-y-2 animate-in fade-in duration-200 ${
              selectedHypothesis === scenario.correctIdx
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400 text-rose-900 dark:text-rose-200'
            }`}>
              <span className="text-xs font-black uppercase block">
                {selectedHypothesis === scenario.correctIdx
                  ? (langMode === 'bn' ? '🎉 নির্ভুল ডায়াগনোসিস! (+১০০ পয়েন্ট)' : '🎉 Accurate Diagnosis! (+100 Points)')
                  : (langMode === 'bn' ? '⚠️ ভুল অনুমান!' : '⚠️ Incorrect Diagnosis!')}
              </span>
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                {langMode === 'bn' ? scenario.explanationBn : scenario.explanationEn}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
