import React, { useState } from 'react';
import {
  Bot, Send, Sparkles, BookOpen, Award, CheckCircle2,
  HelpCircle, MessageSquare, Cpu, ArrowRight, Zap, RefreshCw
} from 'lucide-react';
import { useLabStore } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';
import QuizHubView from './QuizHubView';
import { playMechanicalClick, playSuccessChime } from '../../utils/audioEngine';

const CURATED_QUESTIONS = [
  {
    qEn: 'Why is the knee voltage of Silicon 0.7V whereas Germanium is 0.3V?',
    qBn: 'সিলিকনের নি ভোল্টেজ ০.৭V কিন্তু জার্মেনিয়ামের ০.৩V হওয়ার কারণ কী?',
    category: 'Diode Physics',
  },
  {
    qEn: 'Explain how the depletion region is formed in a P-N junction.',
    qBn: 'P-N জংশনে ডিপ্লেশন অঞ্চল কীভাবে গঠিত হয় ব্যাখ্যা করুন।',
    category: 'Semiconductor Basics',
  },
  {
    qEn: 'Why is the base of a BJT made extremely thin and lightly doped?',
    qBn: 'বিজেটি (BJT) ট্রানজিস্টরের বেস কেন অত্যন্ত পাতলা ও হালকা ডোপিং করা হয়?',
    category: 'BJT Transistor',
  },
  {
    qEn: 'What is the physical significance of JFET pinch-off voltage Vp?',
    qBn: 'জেফেট (JFET) পিঞ্চ-অফ ভোল্টেজ Vp এর শারীরিক তাৎপর্য কী?',
    category: 'FET Physics',
  },
  {
    qEn: 'How does a Zener diode regulate voltage in reverse breakdown?',
    qBn: 'রিভার্স ব্রেকডাউনে জেনার ডায়োড কীভাবে ভোল্টেজ স্থির (Regulate) রাখে?',
    category: 'Zener Diode',
  },
];

// High-Precision Knowledge Base grounding answers in Boylestad 11th Ed.
const KNOWLEDGE_BASE = {
  knee: {
    en: `According to Boylestad (Chapter 1), the barrier potential (knee voltage $V_k$) is determined by the semiconductor bandgap energy ($E_g$) and intrinsic carrier density ($n_i$).\n\n1. Silicon has an energy bandgap of $E_g = 1.1\\text{ eV}$ at 300K, requiring $0.7\\text{ V}$ of forward external bias to counteract the internal electric field created by uncovered donor and acceptor ions in the depletion region.\n2. Germanium has a significantly narrower bandgap of $E_g = 0.67\\text{ eV}$, yielding a much larger intrinsic carrier concentration. Consequently, its contact potential is only about $0.3\\text{ V}$.\n\nFormula: $V_0 = V_T \\ln\\left(\\frac{N_A N_D}{n_i^2}\\right)$. Since $n_{i,\\text{Ge}} \\gg n_{i,\\text{Si}}$, the logarithmic quotient makes $V_{0,\\text{Ge}} < V_{0,\\text{Si}}$.`,
    bn: `বয়েলস্টেড ১১শ সংস্করণের প্রথম অধ্যায় অনুযায়ী, নি ভোল্টেজ ($V_k$) মূলত সেমিকন্ডাক্টরের ব্যান্ডগ্যাপ এনার্জি ($E_g$) এবং ইন্ট্রিনসিক ক্যারিয়ার ঘনত্বের ($n_i$) ওপর নির্ভর করে:\n\n১. সিলিকনের ব্যান্ডগ্যাপ $E_g = ১.১\\text{ eV}$। ডিপ্লেশন স্তরের ধনাত্মক ও ঋণাত্মক আয়নগুলোর তৈরি অভ্যন্তরীণ বিভব বাধা অতিক্রম করতে বাহ্যিক প্রায় ০.৭ ভোল্ট ফরওয়ার্ড বায়াস প্রয়োজন হয়।\n২. জার্মেনিয়ামের ব্যান্ডগ্যাপ তুলনামূলক ছোট ($E_g = ০.৬৭\\text{ eV}$)। এতে ফ্রি ক্যারিয়ার ঘনত্ব বেশি থাকায় এর ব্যারিয়ার ভোল্টেজ মাত্র ০.৩ ভোল্ট হয়।`
  },
  depletion: {
    en: `Formation of the Depletion Region in a P-N Junction (Boylestad Section 1.5):\n\n1. Diffusion: When P-type (high hole concentration) and N-type (high electron concentration) materials join, majority electrons from the N-side diffuse across the junction into the P-side, recombining with holes.\n2. Uncovered Ions: As electrons leave the N-region, they leave behind fixed, positively charged donor ions ($P^+$). As holes are filled in the P-region, fixed negatively charged acceptor ions ($B^-$) are exposed.\n3. Electric Field & Depletion: A region devoid of free mobile charge carriers is formed—termed the 'Depletion Region'. The uncovered positive and negative ions create a strong internal electric field ($\vec{E}$) directed from N to P that halts further majority carrier diffusion, establishing equilibrium.`,
    bn: `P-N জংশনে ডিপ্লেশন অঞ্চলের উৎপত্তি (বয়েলস্টেড সেকশন ১.৫):\n\n১. ডিফিউশন (Diffusion): P-অঞ্চল (অধিক হোল) ও N-অঞ্চল (অধিক ইলেকট্রন) যুক্ত হলে ঘনত্বের পার্থক্যের কারণে N-অঞ্চল থেকে ফ্রি ইলেকট্রন P-অঞ্চলে প্রবেশ করে হোলের সাথে মিলিত হয়।\n২. অনাবৃত আয়ন (Uncovered Ions): ইলেকট্রন চলে যাওয়ায় N-অঞ্চলে ধনাত্মক দাতা আয়ন এবং P-অঞ্চলে ঋণাত্মক গ্রহীতা আয়ন অনাবৃত হয়ে স্থির হয়ে যায়।\n৩. ডিপ্লেশন লেয়ার গঠন: সংযোগস্থলে কোনো মুক্ত ক্যারিয়ার থাকে না। অনাবৃত আয়নগুলোর কারণে N থেকে P-এর দিকে একটি অভ্যন্তরীণ তড়িৎক্ষেত্র তৈরি হয় যা পরবর্তী ইলেকট্রন প্রবাহ আটকে দেয়। এই অঞ্চলকে ডিপ্লেশন রিজিয়ন বলে।`
  },
  bjt_base: {
    en: `In a Bipolar Junction Transistor (BJT), the Base is engineered to be extremely thin (~sub-micron) and very lightly doped for two critical reasons:\n\n1. Maximize Emitter Injection Efficiency: We want almost all electrons injected from the heavily doped Emitter to reach the Collector without recombining in the Base.\n2. Minimize Recombination ($I_B$): Since the base has very few holes (lightly doped) and a very short transit distance, less than 1% to 2% of electrons recombine ($I_B \\approx 0.01 I_E$). The remaining 98-99% are swept across the reverse-biased Collector-Base junction into the Collector ($I_C = \\beta I_B$).`,
    bn: `বিজেটি (BJT) ট্রানজিস্টরের বেস অত্যন্ত পাতলা এবং হালকা ডোপিং করার কারণ:\n\n১. রিকম্বিনেশন কমানো: ইমিটার থেকে নির্গত ইলেকট্রনগুলোর ৯৮% থেকে ৯৯% যেন বেস অতিক্রম করে সরাসরি কালেক্টরে পৌঁছাতে পারে।\n২. বেস কারেন্ট ($I_B$) ন্যূনতম রাখা: বেস পাতলা ও হালকা ডোপিং হওয়ায় খুব অল্প সংখ্যক ইলেকট্রন হোলের সাথে মিলিত হয়ে বেস কারেন্ট তৈরি করে। ফলে উচ্চ অ্যাম্প্লিফিকেশন গেইন ($\\beta = I_C/I_B$) পাওয়া সম্ভব হয়।`
  },
  jfet: {
    en: `JFET Physical Operation & Pinch-Off Voltage ($V_P$):\n\n1. As reverse gate-to-source voltage ($|V_{GS}|$) increases, the reverse-biased P-N junctions widen their depletion regions into the N-channel.\n2. At $V_{GS} = V_P$ (e.g., $-4\\text{ V}$), the two depletion layers touch each other at the drain end, pinching off the channel.\n3. Beyond pinch-off, drain current does not drop to zero! Instead, it saturates at a constant maximum value ($I_{DSS}$) governed by Shockley's equation: $I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2$.`,
    bn: `জেফেটের পিঞ্চ-অফ ভোল্টেজ ($V_P$):\n\n১. রিভার্স গেট ভোল্টেজ ($V_{GS}$) বৃদ্ধি পেলে ডিপ্লেশন অঞ্চল চ্যানেলের ভেতরে প্রসারিত হয়ে পথ সংকীর্ণ করে।\n২. যখন $V_{GS} = V_P$ হয়, তখন ডিপ্লেশন স্তর দুটি চ্যানেলকে প্রায় সম্পূর্ণ চেপে ধরে (Pinch-off)।\n৩. পিঞ্চ-অফের পর ড্রেন কারেন্ট শূন্য হয় না, বরং এটি একটি ধ্রুব সর্বোচ্চ মানে ($I_{DSS}$) স্যাচুরেটেড হয়ে থাকে।`
  },
  zener: {
    en: `Zener Diode Voltage Regulation in Reverse Breakdown:\n\n1. A Zener diode is heavily doped, resulting in an extremely narrow depletion layer.\n2. When reverse voltage reaches the breakdown threshold ($V_Z$), high electric field intensity ($\approx 3\\times 10^5\\text{ V/cm}$) ruptures covalent bonds, causing quantum Zener tunneling or avalanche multiplication.\n3. In this breakdown region, large variations in current ($I_Z$) produce negligible changes in voltage across the diode ($V_Z \\approx \\text{constant}$). This enables near-perfect shunt voltage regulation across variable loads.`,
    bn: `জেনার ডায়োডের ভোল্টেজ রেগুলেশন:\n\n১. জেনার ডায়োড অত্যন্ত উচ্চ মাত্রায় ডোপিং করা হয়, ফলে এর ডিপ্লেশন স্তর খুব পাতলা থাকে।\n২. রিভার্স ভোল্টেজ $V_Z$ সীমায় পৌঁছালে শক্তিশালী তড়িৎক্ষেত্রে সমযোজী বন্ধন ভেঙে প্রচুর ক্যারিয়ার মুক্ত হয় (কোয়ান্টাম টানেলিং)।\n৩. এই ব্রেকডাউন অঞ্চলে কারেন্ট অনেক বাড়লেও ডায়োডের দুই প্রান্তের ভোল্টেজ ($V_Z$) সম্পূর্ণ স্থির থাকে, যা নিখুঁত ভোল্টেজ রেগুলেটর হিসেবে কাজ করে।`
  }
};

export default function AiTutorWorkspaceView() {
  const { langMode } = useLabStore();
  const [activeSubTab, setActiveSubTab] = useState('tutor'); // 'tutor' or 'quizzes'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      contentEn: 'Hello! I am your EEC AI Circuit Professor. Ask me any question regarding semiconductor physics, diodes, rectifiers, BJTs, JFETs, or formulas from Boylestad 11th Edition!',
      contentBn: 'স্বাগতম! আমি আপনার ইইসি এআই শিক্ষক। সেমিকন্ডাক্টর ফিজিক্স, ডায়োড, বিজেটি, জেফেট বা বয়েলস্টেড পাঠ্যসূচির যেকোনো প্রশ্ন আমাকে জিজ্ঞেস করতে পারেন!',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleAskQuestion = (qText) => {
    playMechanicalClick();
    const userMsg = {
      role: 'user',
      contentEn: qText,
      contentBn: qText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // AI Semantic Matching Engine
    setTimeout(() => {
      const lower = qText.toLowerCase();
      let match = KNOWLEDGE_BASE.knee;

      if (lower.includes('knee') || lower.includes('germanium') || lower.includes('০.৭') || lower.includes('০.৩') || lower.includes('bandgap')) {
        match = KNOWLEDGE_BASE.knee;
      } else if (lower.includes('depletion') || lower.includes('barrier') || lower.includes('ডিপ্লেশন') || lower.includes('জংশন')) {
        match = KNOWLEDGE_BASE.depletion;
      } else if (lower.includes('bjt') || lower.includes('base') || lower.includes('বেস') || lower.includes('emitter') || lower.includes('ট্রানজিস্টর')) {
        match = KNOWLEDGE_BASE.bjt_base;
      } else if (lower.includes('jfet') || lower.includes('pinch') || lower.includes('পিঞ্চ') || lower.includes('fet')) {
        match = KNOWLEDGE_BASE.jfet;
      } else if (lower.includes('zener') || lower.includes('জেনার') || lower.includes('regulate') || lower.includes('breakdown')) {
        match = KNOWLEDGE_BASE.zener;
      } else {
        match = {
          en: `Regarding your query "${qText}":\n\nAccording to Boylestad 11th Edition, semiconductor devices operate by controlling the carrier drift and diffusion across energy barriers. In forward bias, the barrier is reduced, allowing exponential current flow ($I_D = I_S(e^{V_D/n V_T} - 1)$). In reverse bias, the depletion layer expands, isolating the circuit until breakdown.\n\nYou can also explore the 3D Lattice and Virtual Oscilloscope in the Laboratory to see this in real time!`,
          bn: `আপনার প্রশ্ন "${qText}" প্রসঙ্গে:\n\nবয়েলস্টেড ১১শ সংস্করণ অনুযায়ী, সেমিকন্ডাক্টর ডিভাইসগুলো ড্রাফট ও ডিফিউশন কারেন্টের নিয়ন্ত্রণের মাধ্যমে কাজ করে। ফরওয়ার্ড বায়াসে ডিপ্লেশন বেরিয়ার হ্রাস পেয়ে বিদ্যুৎ প্রবাহিত হয় ($I_D = I_S(e^{V_D/n V_T} - 1)$) এবং রিভার্স বায়াসে এটি সম্প্রসারিত হয়ে বিদ্যুৎপ্রবাহ রোধ করে।\n\nআপনি ল্যাবরেটরির ৩-ডি ল্যাটিস এবং অসিলোস্কোপে এটি সরাসরি পর্যবেক্ষণ করতে পারেন!`
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          contentEn: match.en,
          contentBn: match.bn,
        }
      ]);
      setIsTyping(false);
      playSuccessChime();
    }, 600);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleAskQuestion(text);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 space-y-6">
      {/* Top Navigation Mode Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {langMode === 'bn' ? 'ইইসি এআই শিক্ষক ও মেন্টর স্টুডিও' : 'EEC AI Tutor & Interactive Mentor Studio'}
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Boylestad 11th Ed. Physics
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {langMode === 'bn'
                ? 'সেমিকন্ডাক্টর ও ইলেকট্রনিক সার্কিটের যেকোনো গাণিতিক ও বাস্তব প্রশ্ন জিজ্ঞাসা করুন'
                : 'Ask semiconductor physics and circuit questions with instant Boylestad textbook references'}
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher: AI Tutor vs Quizzes & Certificate Hub */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              playMechanicalClick();
              setActiveSubTab('tutor');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              activeSubTab === 'tutor'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{langMode === 'bn' ? 'এআই শিক্ষক (AI Tutor)' : 'AI Tutor Chat'}</span>
          </button>
          <button
            onClick={() => {
              playMechanicalClick();
              setActiveSubTab('quizzes');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              activeSubTab === 'quizzes'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{langMode === 'bn' ? 'কুইজ ও সার্টিফিকেট হাব' : 'Quiz Hub & Certificate'}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: AI TUTOR INTERACTIVE CHAT STUDIO */}
      {activeSubTab === 'tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT 1 COLUMN: Curated Topic Question Prompts */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-colors">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {langMode === 'bn' ? 'প্রস্তাবিত জরুরি প্রশ্নসমূহ:' : 'Recommended Exam Questions:'}
              </span>

              <div className="space-y-2">
                {CURATED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskQuestion(langMode === 'bn' ? item.qBn : item.qEn)}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-800 text-xs transition space-y-1 group"
                  >
                    <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block">
                      {item.category}
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-300">
                      {langMode === 'bn' ? item.qBn : item.qEn}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 3 COLUMNS: Main Dialogue Console */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col h-[650px] transition-colors">
            {/* Dialogue Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                      }`}
                    >
                      {isUser ? <MessageSquare className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none font-medium'
                      }`}
                    >
                      {langMode === 'bn' ? msg.contentBn : msg.contentEn}
                      {langMode === 'dual' && !isUser && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 text-emerald-700 dark:text-emerald-400">
                          {msg.contentBn}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center animate-pulse">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-500" />
                    <span>Analyzing circuit equations & Boylestad references...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleFormSubmit} className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  langMode === 'bn'
                    ? 'আপনার প্রশ্ন এখানে লিখুন (যেমন: ডিপ্লেশন অঞ্চল কীভাবে গঠিত হয়?)...'
                    : 'Ask any question (e.g. Why is Si knee voltage 0.7V while Ge is 0.3V?)...'
                }
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition"
              >
                <span>{langMode === 'bn' ? 'পাঠান' : 'Send'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: INTEGRATED QUIZ HUB & CERTIFICATE */}
      {activeSubTab === 'quizzes' && (
        <div className="space-y-4">
          <QuizHubView />
        </div>
      )}
    </div>
  );
}
