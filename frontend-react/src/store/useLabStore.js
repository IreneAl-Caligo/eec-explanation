import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

// Helper to trigger celebration confetti
export const fireCelebrationConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
    });
  } catch {
    // Ignore in case canvas is not available
  }
};

// Safe localStorage helper
const getStoredJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStoredJSON = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage quota errors
  }
};

export const useLabStore = create((set, get) => ({
  // Core Progress State - starts completely empty for a fresh user (0 completed!)
  // Persisted in localStorage so progress is NEVER lost on refresh or revisit!
  completed: getStoredJSON('eec_lab_completed_topics', {}),
  quizChoices: getStoredJSON('eec_lab_quiz_choices', {}),

  // UI & View Configuration
  selectedId: localStorage.getItem('eec_selected_topic') || '0',
  mainView: localStorage.getItem('eec_main_view') || 'index_table', // 'index_table' | 'explorer' | 'sandbox' | 'explanation' | 'quizzes'
  indexLayout: localStorage.getItem('eec_index_layout') || 'cards', // 'cards' | 'table'
  langMode: localStorage.getItem('eec_lang_mode') || 'dual', // 'dual' | 'en' | 'bn'
  theme: localStorage.getItem('eec_theme') || 'light', // 'light' | 'dark'
  soundEnabled: getStoredJSON('eec_sound_enabled', true),

  // Filters & Ephemeral Drawer States
  moduleFilter: 'all',
  searchQuery: '',
  inspectedKey: null,
  isTopicMenuOpen: false,
  isAiTutorOpen: false,
  showInlineExplanation: false,

  // Actions
  toggleComplete: (id) => {
    const current = get().completed;
    const willBeCompleted = !current[id];
    const updated = { ...current, [id]: willBeCompleted };
    setStoredJSON('eec_lab_completed_topics', updated);
    set({ completed: updated });

    if (willBeCompleted) {
      fireCelebrationConfetti();
      if (get().soundEnabled) {
        audioEngine.playSuccessChime();
      }
    } else {
      if (get().soundEnabled) {
        audioEngine.playClick();
      }
    }
  },

  resetAllProgress: () => {
    setStoredJSON('eec_lab_completed_topics', {});
    setStoredJSON('eec_lab_quiz_choices', {});
    set({ completed: {}, quizChoices: {} });
    if (get().soundEnabled) {
      audioEngine.playClick();
    }
  },

  setQuizChoice: (topicId, choiceIdx, isCorrect) => {
    const choices = { ...get().quizChoices, [topicId]: choiceIdx };
    setStoredJSON('eec_lab_quiz_choices', choices);
    set({ quizChoices: choices });

    if (get().soundEnabled) {
      if (isCorrect) {
        audioEngine.playSuccessChime();
      } else {
        audioEngine.playBuzzer();
      }
    }
  },

  setSelectedId: (id) => {
    localStorage.setItem('eec_selected_topic', id);
    set({ selectedId: id });
  },

  setMainView: (view) => {
    localStorage.setItem('eec_main_view', view);
    set({ mainView: view });
    if (get().soundEnabled) {
      audioEngine.playClick();
    }
  },

  setIndexLayout: (layout) => {
    localStorage.setItem('eec_index_layout', layout);
    set({ indexLayout: layout });
  },

  setLangMode: (mode) => {
    localStorage.setItem('eec_lang_mode', mode);
    set({ langMode: mode });
  },

  cycleLangMode: () => {
    const current = get().langMode;
    const next = current === 'dual' ? 'en' : current === 'en' ? 'bn' : 'dual';
    localStorage.setItem('eec_lang_mode', next);
    set({ langMode: next });
    if (get().soundEnabled) {
      audioEngine.playClick();
    }
  },

  setTheme: (theme) => {
    localStorage.setItem('eec_theme', theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('eec_theme', next);
    set({ theme: next });
    if (get().soundEnabled) {
      audioEngine.playClick();
    }
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    setStoredJSON('eec_sound_enabled', next);
    audioEngine.setMuted(!next);
    set({ soundEnabled: next });
    if (next) {
      audioEngine.playClick();
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setModuleFilter: (filter) => set({ moduleFilter: filter }),
  setInspectedKey: (key) => set({ inspectedKey: key }),
  setIsTopicMenuOpen: (isOpen) => set({ isTopicMenuOpen: isOpen }),
  setIsAiTutorOpen: (isOpen) => set({ isAiTutorOpen: isOpen }),
  setShowInlineExplanation: (show) => set({ showInlineExplanation: show }),
}));
