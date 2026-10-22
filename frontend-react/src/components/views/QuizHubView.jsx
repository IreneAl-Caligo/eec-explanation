import React, { useState } from 'react';
import {
  Award, CheckCircle2, XCircle, RotateCcw, Download,
  Sparkles, HelpCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useLabStore, fireCelebrationConfetti } from '../../store/useLabStore';
import { TOPICS } from '../../data/topicsData';

export default function QuizHubView() {
  const { quizChoices, setQuizChoice, langMode, resetAllProgress, setMainView, setSelectedId } = useLabStore();
  const [studentName, setStudentName] = useState('CSE Undergraduate Student');
  const [filterModule, setFilterModule] = useState('all');
  const [showCertificate, setShowCertificate] = useState(false);

  const filteredTopics = TOPICS.filter((t) => {
    return filterModule === 'all' || t.module === filterModule;
  });

  // Calculate score across all 25 topics
  let correctCount = 0;
  let answeredCount = 0;

  TOPICS.forEach((t) => {
    const picked = quizChoices[t.id];
    if (picked !== undefined) {
      answeredCount++;
      if (picked === t.quiz.ans) {
        correctCount++;
      }
    }
  });

  const total = TOPICS.length;
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isEligibleForCert = scorePct >= 70;

  const handleClaimCertificate = () => {
    if (isEligibleForCert) {
      fireCelebrationConfetti();
      setShowCertificate(true);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {langMode === 'bn' ? 'স্ব-মূল্যায়ন ও সার্টিফিকেট' : 'Self-Assessment & Certification'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {langMode === 'bn' ? 'ইইসি মাস্টার কুইজ হাব (সকল ২৫টি পাঠ)' : 'EEC Master Quiz Hub (All 25 Topics)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {langMode === 'bn'
                ? 'বয়েলস্টেড ১১শ সংস্করণের প্রতিটি পাঠের ওপর আপনার জ্ঞান যাচাই করুন এবং ৭০%+ নম্বর পেয়ে ডিজিটাল সার্টিফিকেট অর্জন করুন।'
                : 'Test your understanding on each Boylestad 11th edition topic and achieve 70%+ to unlock your Certificate.'}
            </p>
          </div>

          {/* Live Scorecard */}
          <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/60 dark:to-emerald-950/60 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-4 text-center min-w-[200px] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              {langMode === 'bn' ? 'মোট অর্জিত স্কোর' : 'Total Score'}
            </span>
            <div className="text-2xl font-mono font-black text-indigo-700 dark:text-indigo-300 mt-0.5">
              {correctCount} / {total}
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {scorePct}% ({answeredCount} {langMode === 'bn' ? 'উত্তর সম্পন্ন' : 'Answered'})
            </div>
            {isEligibleForCert && (
              <button
                onClick={handleClaimCertificate}
                className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{langMode === 'bn' ? 'সার্টিফিকেট দেখুন 🏆' : 'View Certificate 🏆'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
          {[
            { id: 'all', labelEn: 'All Topics', labelBn: 'সকল পাঠ' },
            { id: 'physics', labelEn: 'Physics (0–5)', labelBn: 'পদার্থবিজ্ঞান' },
            { id: 'diodes', labelEn: 'Diodes (6–15)', labelBn: 'ডায়োড' },
            { id: 'rectifiers', labelEn: 'Rectifiers (17–20)', labelBn: 'রেক্টিফায়ার' },
            { id: 'bjt', labelEn: 'BJT (16, 19b)', labelBn: 'বিজেটি' },
            { id: 'fet', labelEn: 'FET (20–24)', labelBn: 'জেফেট ও মসফেট' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setFilterModule(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterModule === m.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {langMode === 'bn' ? m.labelBn : m.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredTopics.map((t) => {
          const picked = quizChoices[t.id];
          const isAnswered = picked !== undefined;
          const isCorrect = isAnswered && picked === t.quiz.ans;

          return (
            <div
              key={t.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xs transition space-y-3 ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold border border-indigo-200 dark:border-indigo-800">
                    Topic #{t.num}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {langMode === 'bn' ? t.titleBn : t.titleEn}
                  </span>
                </div>
                {isAnswered && (
                  <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {isCorrect ? (langMode === 'bn' ? 'সঠিক উত্তর!' : 'Correct!') : (langMode === 'bn' ? 'ভুল উত্তর' : 'Incorrect')}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {t.quiz.q}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {t.quiz.options.map((opt, idx) => {
                  const isPicked = picked === idx;
                  const isRight = idx === t.quiz.ans;

                  return (
                    <button
                      key={idx}
                      onClick={() => setQuizChoice(t.id, idx, isRight)}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition ${
                        picked === undefined
                          ? 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-800'
                          : isRight
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 font-bold'
                          : isPicked
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <span className="font-bold mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick jump to lab link */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => {
                    setSelectedId(t.id);
                    setMainView('explorer');
                  }}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>{langMode === 'bn' ? `টপিক #${t.num} ল্যাব সিমুলেটরে দেখুন` : `Open Topic #${t.num} Lab Simulator`}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 border-4 border-amber-400 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative print:m-0 print:border-none print:shadow-none">
            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-200 pb-4">
              <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-700 shadow-inner">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-900">
                Certificate of Academic Mastery
              </h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                CSE 1st Year Electrical & Semiconductor Physics Laboratory
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-3">
              <p className="text-xs text-slate-500 italic">This is proudly presented to</p>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="text-center text-xl sm:text-2xl font-black text-indigo-700 bg-transparent border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-600 w-full"
                title="Edit Student Name"
              />
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
                For outstanding demonstration of core electronic circuit theory, semiconductor device characteristics, PN-junction physics, and Boylestad 11th Edition derivations with a mastery score of:
              </p>
              <div className="text-3xl font-mono font-black text-emerald-600">
                {scorePct}% ({correctCount}/{total} Topics Mastered)
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Verified Online Simulator</span>
              </div>
              <div className="font-mono text-[11px]">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
