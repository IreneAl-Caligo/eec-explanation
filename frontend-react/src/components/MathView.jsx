import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check, Info, Sparkles } from 'lucide-react';

/**
 * Normalizes input math string for KaTeX compatibility:
 * - Replaces common Unicode symbols with LaTeX equivalents
 * - Normalizes escaped backslashes (e.g., '\\nu' -> '\nu')
 * - Wraps plain text segments when appropriate
 */
export function formatMathForLatex(input) {
  if (!input || typeof input !== 'string') return '';

  let str = input.trim();

  // If already standard LaTeX with double slashes from JSON strings, normalize them
  str = str.replace(/\\\\([a-zA-Z]+)/g, '\\$1');

  // Convert common Unicode math symbols to LaTeX equivalents if not already formatted
  const symbolMap = [
    [/·/g, ' \\cdot '],
    [/≈/g, ' \\approx '],
    [/≠/g, ' \\ne '],
    [/≤/g, ' \\le '],
    [/≥/g, ' \\ge '],
    [/≪/g, ' \\ll '],
    [/≫/g, ' \\gg '],
    [/∝/g, ' \\propto '],
    [/⇒/g, ' \\implies '],
    [/→/g, ' \\to '],
    [/Δ/g, ' \\Delta '],
    [/λ/g, ' \\lambda '],
    [/β/g, ' \\beta '],
    [/α/g, ' \\alpha '],
    [/η/g, ' \\eta '],
    [/π/g, ' \\pi '],
    [/θ/g, ' \\theta '],
    [/μ/g, ' \\mu '],
    [/Ω/g, ' \\,\\Omega '],
    [/Φ_v/g, ' \\Phi_v '],
    [/²/g, '^2'],
    [/³/g, '^3'],
    [/⁻/g, '^-'],
    [/⁺/g, '^+'],
    [/e⁻/g, 'e^-'],
    [/h⁺/g, 'h^+'],
    [/P⁺/g, 'P^+'],
    [/B⁻/g, 'B^-']
  ];

  for (const [pattern, replacement] of symbolMap) {
    str = str.replace(pattern, replacement);
  }

  return str;
}

/**
 * MathView renders LaTeX math safely using KaTeX.
 * Falls back to plain text if rendering fails.
 */
export function MathView({ math, display = false, className = '' }) {
  const renderedHtml = useMemo(() => {
    if (!math) return '';
    const clean = formatMathForLatex(math);
    try {
      return katex.renderToString(clean, {
        displayMode: display,
        throwOnError: false,
        output: 'htmlAndMathml',
        strict: false
      });
    } catch {
      // Graceful fallback to raw string
      return null;
    }
  }, [math, display]);

  if (!renderedHtml) {
    return (
      <span className={`font-mono text-amber-700 dark:text-amber-400 ${className}`}>
        {math}
      </span>
    );
  }

  if (display) {
    return (
      <div
        className={`katex-display-container select-text overflow-x-auto py-1 scrollbar-thin ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return (
    <span
      className={`katex-inline select-text inline-block align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}

/**
 * Interactive Formula Card with Copy action, Verbal readout,
 * and optional breakdown of each symbol.
 */
export function FormulaCard({
  formula,
  title,
  langMode = 'en',
  verbalEn,
  verbalBn,
  variables = [],
  highlightSymbol,
  onSymbolClick,
  badge,
  compact = false
}) {
  const [copied, setCopied] = useState(false);
  const [showVerbal, setShowVerbal] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!formula) return;
    navigator.clipboard.writeText(formula).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-900/50 dark:to-slate-900/30 border-2 border-amber-300 dark:border-amber-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-800/50 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {title || (langMode === 'bn' ? 'মূল গাণিতিক সূত্র (Core Equation):' : 'Core Governing Equation:')}
          </span>
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {(verbalEn || verbalBn) && (
            <button
              onClick={() => setShowVerbal((v) => !v)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                showVerbal
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-slate-700'
              }`}
              title={langMode === 'bn' ? 'মুখে পড়ার উচ্চারণ ও অর্থ' : 'Verbal Readout'}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {langMode === 'bn' ? 'উচ্চারণ ও অর্থ' : 'How to Read'}
              </span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition shadow-xs"
            title="Copy formula text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">{langMode === 'bn' ? 'কপি হয়েছে' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{langMode === 'bn' ? 'কপি' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rendered Math Display */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-xl p-3.5 sm:p-4 border border-amber-200/70 dark:border-amber-800/60 shadow-xs flex items-center justify-center min-h-[56px]">
        <MathView
          math={formula}
          display={true}
          className="text-base sm:text-xl lg:text-2xl font-black text-amber-900 dark:text-amber-200 tracking-wide"
        />
      </div>

      {/* Verbal Readout drawer */}
      {showVerbal && (verbalEn || verbalBn) && (
        <div className="bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/80 rounded-xl p-3 text-xs space-y-1.5 animate-fadeIn">
          <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <span>🗣️</span>
            <span>{langMode === 'bn' ? 'মুখে যেভাবে পড়তে হবে:' : 'How to Read Out Loud:'}</span>
          </div>
          {(langMode === 'en' || langMode === 'dual') && verbalEn && (
            <p className="text-slate-800 dark:text-slate-200 italic font-medium leading-relaxed">
              "{verbalEn}"
            </p>
          )}
          {(langMode === 'bn' || langMode === 'dual') && verbalBn && (
            <p className="text-emerald-900 dark:text-emerald-300 italic font-medium leading-relaxed border-t border-amber-200 dark:border-amber-800/50 pt-1">
              "{verbalBn}"
            </p>
          )}
        </div>
      )}

      {/* Variables Symbol Strip (if provided) */}
      {!compact && variables && variables.length > 0 && (
        <div className="pt-1 space-y-2">
          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {langMode === 'bn' ? 'সূত্রের প্রতিটি প্রতীকের সহজ অর্থ:' : 'Interactive Symbol Guide:'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {variables.map((v, i) => {
              const isSelected = highlightSymbol && highlightSymbol === v.sym;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => onSymbolClick && onSymbolClick(v)}
                  className={`text-left p-2 rounded-lg border transition text-xs ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 shadow-xs ring-1 ring-amber-500'
                      : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600'
                  }`}
                >
                  <div className="font-mono font-bold text-amber-800 dark:text-amber-400 text-xs">
                    <MathView math={v.latex || v.sym} />
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                    {langMode === 'bn' ? v.nameBn : v.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {langMode === 'bn' ? v.descBn : v.descEn}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MathView;
