import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, VolumeX, Sparkles, Mic } from 'lucide-react';
import { playMechanicalClick, playSuccessChime } from '../../utils/audioEngine';

/**
 * Bilingual Audio Walkthrough & Voiceover Player
 * Speaks clear circuit and physics explanations in Bengali and English
 * Features:
 * - Web SpeechSynthesis API with automatic voice matching
 * - Real-time sentence subtitle synchronization & text highlighting
 * - Play / Pause / Replay / Speed controls
 */
export default function AudioWalkthroughPlayer({
  topicNum = '0',
  topicTitleEn = 'Semiconductor Diode Operation',
  topicTitleBn = 'সেমিকন্ডাক্টর ডায়োডের কার্যপ্রণালী',
  langMode = 'dual',
  walkthroughEn = 'When the positive half-cycle of alternating voltage is applied, the silicon diode becomes forward-biased because the anode potential exceeds 0.7 volts. Electrons overcome the depletion barrier, and full conduction current flows to the load resistor.',
  walkthroughBn = 'যখন এসি ভোল্টেজের পজিটিভ হাফ-সাইকেল প্রবেশ করে, তখন অ্যানোডের ভোল্টেজ ০.৭ ভোল্ট অতিক্রম করায় ডায়োডটি ফরওয়ার্ড বায়াসড হয়। ইলেকট্রনগুলো ডিপ্লেশন ব্যারিয়ার অতিক্রম করে এবং লোড রেজিস্টরে সম্পূর্ণ বিদ্যুৎ প্রবাহিত হয়।',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLang, setActiveLang] = useState(langMode === 'bn' ? 'bn' : 'en');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [highlightWordIndex, setHighlightWordIndex] = useState(-1);

  const utteranceRef = useRef(null);

  // Sync active language when external langMode changes
  useEffect(() => {
    if (langMode === 'bn') setActiveLang('bn');
    else if (langMode === 'en') setActiveLang('en');
  }, [langMode]);

  // Clean up speech when unmounting or changing topic
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [topicNum]);

  const activeText = activeLang === 'bn' ? walkthroughBn : walkthroughEn;
  const words = activeText.split(' ');

  const handlePlay = () => {
    playMechanicalClick();

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(activeText);
    utteranceRef.current = utterance;
    utterance.rate = speechRate;

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (activeLang === 'bn') {
      const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
      if (bnVoice) utterance.voice = bnVoice;
      utterance.lang = 'bn-BD';
    } else {
      const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.default));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    }

    // Highlight text boundary
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex;
        const textBefore = activeText.slice(0, charIndex);
        const wordIdx = textBefore.trim().split(/\s+/).length;
        setHighlightWordIndex(wordIdx);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightWordIndex(-1);
      playSuccessChime();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightWordIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    playMechanicalClick();
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    playMechanicalClick();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setHighlightWordIndex(-1);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-lg space-y-3 text-slate-100">
      {/* Top Header & Voiceover Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-900/60 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-xs">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-2">
              <span>{activeLang === 'bn' ? 'দ্বিভাষিক অডিও গাইড ও ভয়েস এক্সপ্লেনেশন' : 'Bilingual Audio Guide & Voice Walkthrough'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Topic #{topicNum}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {activeLang === 'bn' ? topicTitleBn : topicTitleEn}
            </p>
          </div>
        </div>

        {/* Audio Language & Play Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                handleStop();
                setActiveLang('bn');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                activeLang === 'bn' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => {
                handleStop();
                setActiveLang('en');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                activeLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Play / Pause Button */}
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition hover:scale-102"
              title="Play Voiceover Explanation"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? (activeLang === 'bn' ? 'পুনরায় শুরু' : 'Resume') : (activeLang === 'bn' ? 'শুনুন' : 'Listen')}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              title="Pause Voiceover"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>{activeLang === 'bn' ? 'থামান' : 'Pause'}</span>
            </button>
          )}

          {/* Stop / Replay */}
          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
              title="Stop & Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Synchronized Subtitle Display */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs sm:text-sm leading-relaxed text-slate-300">
        <p className="font-medium">
          {words.map((word, idx) => {
            const isHighlighted = idx === highlightWordIndex;
            return (
              <span
                key={idx}
                className={`transition-all duration-150 inline-block mr-1 ${
                  isHighlighted
                    ? 'text-yellow-300 font-extrabold scale-105 bg-yellow-950/60 px-1 rounded shadow-xs'
                    : 'text-slate-300'
                }`}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
