import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Lightbulb } from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';
import { ELI5_TOPIC_DATA } from '../../data/eli5Data';
import { playMechanicalClick, playSuccessChime } from '../../utils/audioEngine';

const KNOWLEDGE_RESPONSES = {
  zener: {
    bn: 'জেনার ডায়োডের রিভার্স ব্রেকডাউন ভোল্টেজ (V_Z) এমনভাবে তৈরি করা হয় যাতে রিভার্স বায়াসে একটি নির্দিষ্ট ভোল্টেজে পৌঁছালে ইলেকট্রনগুলো সমযোজী বন্ধন ভেঙে মুক্ত হয় (জেনার ও অ্যাভালাঞ্চ প্রভাব)। ফলে কারেন্ট নাটকীয়ভাবে বাড়লেও ডায়োডের দুই প্রান্তের ভোল্টেজ V_Z-এ নিখুঁতভাবে স্থির থাকে। এজন্যই এটি ডিসি ভোল্টেজ রেগুলেটর হিসেবে ব্যবহৃত হয়।',
    en: 'A Zener diode is heavily doped to have a sharp reverse breakdown voltage (V_Z). Once reverse voltage reaches V_Z, strong electric fields rupture covalent bonds (Zener & Avalanche breakdown). The diode conducts high reverse current while keeping the terminal voltage clamped firmly at V_Z, acting as a stable voltage regulator.',
  },
  bjt_saturation: {
    bn: 'একটি BJT ট্রানজিস্টর স্যাচুরেশনে (Saturation) তখন যায় যখন এর দুটি জাংশনই (Base-Emitter এবং Base-Collector) ফরোয়ার্ড বায়াসড থাকে। এই অবস্থায় কালেক্টর কারেন্ট I_C তার সর্বোচ্চ সীমায় পৌঁছায় এবং V_CE কমে প্রায় ০.২ ভোল্টে (V_CE(sat) ≈ 0.2V) নেমে আসে। তখন ট্রানজিস্টরটি একটি সম্পূর্ণ অন (ON) সুইচের মতো আচরণ করে।',
    en: 'A BJT enters Saturation when both its Base-Emitter (B-E) and Base-Collector (B-C) junctions are forward-biased. In this state, collector current I_C reaches maximum limit determined by external load, and V_CE drops to its minimum level (V_CE(sat) ≈ 0.2V), behaving like a closed electronic switch.',
  },
  knee_voltage: {
    bn: 'নি ভোল্টেজ (Knee Voltage, V_K) বা বেরিয়ার ভোল্টেজ হলো সেই ন্যূনতম ফরোয়ার্ড ভোল্টেজ যা প্রয়োগ করলে পি-এন জাংশনের ডিপ্লিশন স্তরের বাধা দূর হয় এবং ডায়োডের ভেতর দিয়ে উল্লেখযোগ্য কারেন্ট প্রবাহিত হওয়া শুরু হয়। সিলিকন (Si) ডায়োডের জন্য V_K প্রায় ০.৭V এবং জার্মেনিয়াম (Ge) ডায়োডের জন্য প্রায় ০.৩V।',
    en: 'The Knee Voltage (V_K or Barrier Potential) is the minimum forward-bias voltage required to overcome the internal depletion region barrier, allowing significant current to flow. For Silicon (Si), V_K ≈ 0.7V, and for Germanium (Ge), V_K ≈ 0.3V.',
  },
  bjt_vs_jfet: {
    bn: 'প্রধান পার্থক্য:\n১. BJT হলো বাইপোলার (ইলেকট্রন ও হোল উভয়ই কাজ করে), আর JFET হলো ইউনিপোলার (শুধুমাত্র মেজরিটি ক্যারিয়ার কাজ করে)।\n২. BJT কারেন্ট-নিয়ন্ত্রিত (I_C = β * I_B), আর JFET ভোল্টেজ-নিয়ন্ত্রিত (I_D নির্ভর করে V_GS-এর ওপর)।\n৩. JFET-এর ইনপুট রোধ অত্যন্ত বেশি (>100 MΩ), যা BJT-এর চেয়ে অনেক গুণ বেশি।',
    en: 'Core Differences:\n1. BJT is Bipolar (both electrons and holes), whereas JFET is Unipolar (majority carriers only).\n2. BJT is Current-Controlled (I_C controlled by base current I_B), whereas JFET is Voltage-Controlled (I_D controlled by gate-source voltage V_GS).\n3. JFET has extremely high input impedance (>100 MΩ) compared to BJT.',
  },
  depletion_layer: {
    bn: 'যখন P-টাইপ ও N-টাইপ সেমিকন্ডাক্টর যুক্ত করা হয়, তখন সংযোগস্থলের কাছে N-অঞ্চল থেকে মুক্ত ইলেকট্রনগুলো P-অঞ্চলের হোলের দিকে ডিফিউজ হয়ে প্রশমিত হয়। এর ফলে সংযোগস্থলে কোনো মুক্ত ক্যারিয়ার থাকে না, কেবল স্থির ধনাত্মক ও ঋণাত্মক আয়ন জমা হয়। এই অঞ্চলটিকে ডিপ্লিশন অঞ্চল (Depletion Region) বলে।',
    en: 'When P-type and N-type semiconductors meet, free electrons from the N-side diffuse into the P-side to recombine with holes. This leaves unneutralized donor positive ions and acceptor negative ions locked in the lattice near the boundary, creating a mobile-charge-free zone called the Depletion Region.',
  }
};

export default function AiCircuitTutor() {
  const { isAiTutorOpen, setIsAiTutorOpen, selectedId, langMode } = useLabStore();

  // Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      textEn: 'Hello! I am your Multilingual EEC AI Circuit Professor. Ask me any question in ANY language about semiconductor physics, circuit math, Boylestad formulas, or viva prep!',
      textBn: 'স্বাগতম! আমি আপনার বহুভাষিক ইইসি এআই শিক্ষক। সেমিকন্ডাক্টর, সার্কিট কিংবা পরীক্ষার যেকোনো প্রশ্ন যেকোনো ভাষায় আমাকে করতে পারেন!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAiTutorOpen) return null;

  const currentTopic = TOPICS.find((t) => t.id === selectedId) || TOPICS[0];
  const eli5 = ELI5_TOPIC_DATA[currentTopic.num] || ELI5_TOPIC_DATA['0'];

  const quickPrompts = [
    {
      labelEn: `Explain Topic #${currentTopic.num} simply`,
      labelBn: `টপিক #${currentTopic.num} সহজ ভাষায় বুঝান`,
      key: 'topic_explain'
    },
    {
      labelEn: 'Why does Zener Diode regulate voltage?',
      labelBn: 'জেনার ডায়োড কেন ভোল্টেজ স্থির রাখে?',
      key: 'zener'
    },
    {
      labelEn: 'When does a BJT enter saturation?',
      labelBn: 'কখন BJT ট্রানজিস্টর স্যাচুরেশনে যায়?',
      key: 'bjt_saturation'
    },
    {
      labelEn: 'What is Knee / Barrier Voltage (0.7V vs 0.3V)?',
      labelBn: 'নি ভোল্টেজ বা বেরিয়ার ভোল্টেজ কী (০.৭V বনাম ০.৩V)?',
      key: 'knee_voltage'
    },
    {
      labelEn: 'Difference between BJT and JFET?',
      labelBn: 'BJT এবং JFET-এর মধ্যে মূল পার্থক্য কী?',
      key: 'bjt_vs_jfet'
    }
  ];

  const handleSend = (textToSend = inputText, promptKey = null) => {
    const text = (textToSend || '').trim();
    if (!text && !promptKey) return;

    playMechanicalClick();
    const userMsg = {
      sender: 'user',
      textEn: text,
      textBn: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botEn = '';
      let botBn = '';

      if (promptKey === 'topic_explain' || text.toLowerCase().includes('topic') || text.includes('টপিক')) {
        botEn = `For Topic #${currentTopic.num} (${currentTopic.titleEn}):\nGoverning Law: ${currentTopic.formula}\nCore concept: ${eli5.storyEn}\n\nExam Tip: ${eli5.takeawayEn || currentTopic.keyPoints[0]}`;
        botBn = `টপিক #${currentTopic.num} (${currentTopic.titleBn})-এর সহজ ব্যাখ্যা:\nমূল সূত্র: ${currentTopic.formula}\nমূল ধারণা: ${eli5.storyBn}\n\nপরীক্ষার টিপ: ${eli5.takeawayBn || currentTopic.keyPoints[0]}`;
      } else if (promptKey && KNOWLEDGE_RESPONSES[promptKey]) {
        botEn = KNOWLEDGE_RESPONSES[promptKey].en;
        botBn = KNOWLEDGE_RESPONSES[promptKey].bn;
      } else {
        const q = text.toLowerCase();
        if (q.includes('zener') || q.includes('জেনার')) {
          botEn = KNOWLEDGE_RESPONSES.zener.en;
          botBn = KNOWLEDGE_RESPONSES.zener.bn;
        } else if (q.includes('saturation') || q.includes('স্যাচুরেশন')) {
          botEn = KNOWLEDGE_RESPONSES.bjt_saturation.en;
          botBn = KNOWLEDGE_RESPONSES.bjt_saturation.bn;
        } else if (q.includes('knee') || q.includes('barrier') || q.includes('নি')) {
          botEn = KNOWLEDGE_RESPONSES.knee_voltage.en;
          botBn = KNOWLEDGE_RESPONSES.knee_voltage.bn;
        } else if (q.includes('jfet') || q.includes('বিজেটি') || q.includes('পার্থক্য')) {
          botEn = KNOWLEDGE_RESPONSES.bjt_vs_jfet.en;
          botBn = KNOWLEDGE_RESPONSES.bjt_vs_jfet.bn;
        } else if (q.includes('depletion') || q.includes('ডিপ্লিশন') || q.includes('ডিপ্লেশন')) {
          botEn = KNOWLEDGE_RESPONSES.depletion_layer.en;
          botBn = KNOWLEDGE_RESPONSES.depletion_layer.bn;
        } else {
          botEn = `Regarding your inquiry on "${text}":\n\nUnder Boylestad 11th Edition semiconductor principles, electron and hole transport is governed by drift and diffusion across energy barriers. Silicon requires ~0.7V forward knee bias, while Germanium requires ~0.3V.\n\nTip: You can ask this in any language (Bengali, English, Hindi, etc.) or explore the Boylestad Math Solver in the top navigation!`;
          botBn = `আপনার প্রশ্ন "${text}" প্রসঙ্গে:\n\nবয়েলস্টেডের ১১শ সংস্করণের নীতিমালা অনুযায়ী, সেমিকন্ডাক্টরের চার্জ ক্যারিয়ার পরিবহন ড্রাফট ও ডিফিউশনের মাধ্যমে ঘটে। সিলিকন জংশনে প্রায় ০.৭V এবং জার্মেনিয়ামে প্রায় ০.৩V নি ভোল্টেজ প্রয়োজন হয়।\n\nআপনি যেকোনো ভাষায় প্রশ্ন করতে পারেন কিংবা উপরের ম্যাথ সলভার ডেকে এর গাণিতিক সমাধান দেখতে পারেন!`;
        }
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', textEn: botEn, textBn: botBn }
      ]);
      setIsTyping(false);
      playSuccessChime();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Slide-over Right Sidebar Drawer - Fully Mobile Responsive */}
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md md:max-w-lg lg:max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                {langMode === 'bn' ? 'ইইসি এআই শিক্ষক' : 'EEC AI Circuit Tutor'}
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {langMode === 'bn' ? 'বহুভাষিক এআই শিক্ষক • প্রশ্ন করুন যেকোনো ভাষায়' : 'Multilingual AI • Ask in any language'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playMechanicalClick();
              setIsAiTutorOpen(false);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition border border-slate-200 dark:border-slate-700"
            title="Close Drawer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* AI CHAT VIEW */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Quick Prompts Carousel */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              {langMode === 'bn' ? 'প্রস্তাবিত:' : 'Prompts:'}
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(langMode === 'bn' ? p.labelBn : p.labelEn, p.key)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 text-xs font-medium whitespace-nowrap shadow-2xs hover:scale-102 transition"
              >
                {langMode === 'bn' ? p.labelBn : p.labelEn}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={idx} className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isBot
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs font-medium'
                        : 'bg-indigo-600 text-white rounded-tr-xs shadow-sm font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">
                      {langMode === 'bn' ? m.textBn : langMode === 'en' ? m.textEn : (m.textBn || m.textEn)}
                    </p>
                    {isBot && langMode === 'dual' && m.textEn && m.textBn && m.textEn !== m.textBn && (
                      <p className="whitespace-pre-line pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 font-medium">
                        {m.textEn}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 italic">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>{langMode === 'bn' ? 'শিক্ষক ভাবছেন...' : 'Tutor is thinking...'}</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={langMode === 'bn' ? 'যেকোনো ভাষায় যেকোনো প্রশ্ন লিখুন...' : 'Ask anything in any language...'}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white transition shadow-sm"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
