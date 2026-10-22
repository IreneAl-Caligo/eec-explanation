import React, { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import SidebarDrawer from './components/layout/SidebarDrawer';
import MasterIndexView from './components/views/MasterIndexView';
import LabWorkstationView from './components/views/LabWorkstationView';
import BoylestadMathSolverView from './components/views/BoylestadMathSolverView';
import CircuitTroubleshootingGameView from './components/views/CircuitTroubleshootingGameView';
import MathAndDiagnosticsView from './components/views/MathAndDiagnosticsView';
import TopicExplanationView from './components/views/TopicExplanationView';
import AiTutorWorkspaceView from './components/views/AiTutorWorkspaceView';
import AiCircuitTutor from './components/tutor/AiCircuitTutor';
import AiTutorFloatingSphere from './components/tutor/AiTutorFloatingSphere';
import ComponentInspectorModal from './components/ComponentInspectorModal';
import { useLabStore } from './store/useLabStore';
import { parseHash, syncHashWithState } from './utils/router';

export default function App() {
  const {
    mainView, setMainView,
    selectedId, setSelectedId,
    theme,
    langMode,
    inspectedKey, setInspectedKey
  } = useLabStore();

  // 1. Synchronize Dark / Light Theme Class on <html> & <body>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // 2. Client-Side Routing: Listen to URL Hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const { view, topicId } = parseHash(window.location.hash);
      if (view && view !== mainView) {
        setMainView(view);
      }
      if (topicId && topicId !== selectedId) {
        setSelectedId(topicId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3. Keep URL Hash synchronized when state changes internally
  useEffect(() => {
    syncHashWithState(mainView, selectedId);
  }, [mainView, selectedId]);

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      } font-sans flex flex-col selection:bg-indigo-600 selection:text-white transition-colors duration-200`}
    >
      {/* Navigation Header */}
      <Navbar />

      {/* Slide-over Curriculum Topic Switcher Drawer */}
      <SidebarDrawer />

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col">
        {mainView === 'index_table' && <MasterIndexView />}

        {(mainView === 'explorer' || mainView === 'sandbox') && <LabWorkstationView />}

        {(mainView === 'calculator' || mainView === 'troubleshooting') && (
          <MathAndDiagnosticsView initialTab={mainView === 'troubleshooting' ? 'diagnostics' : 'solver'} />
        )}

        {mainView === 'explanation' && <TopicExplanationView />}

        {(mainView === 'tutor' || mainView === 'quizzes') && <AiTutorWorkspaceView />}
      </main>

      {/* Right-Side Floating Glowing Sphere Trigger for AI Tutor */}
      <AiTutorFloatingSphere />

      {/* Slide-over Right Sidebar Drawer for AI Tutor & Multilingual Chat */}
      <AiCircuitTutor />

      {/* Global Component & Physics Explanation Inspector Modal */}
      <ComponentInspectorModal
        itemKey={inspectedKey}
        onClose={() => setInspectedKey(null)}
      />

      {/* Standard Academic Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            {langMode === 'bn'
              ? 'সিএসই ১ম বর্ষ ইইসি ভার্চুয়াল ল্যাব ও দ্বিভাষিক সিমুলেটর'
              : 'CSE 1st Year Electrical & Electronic Circuits (EEC) Virtual Lab & Bilingual Simulator'}
          </span>
          <span>
            {langMode === 'bn'
              ? 'বয়েলস্টেড ১১শ সংস্করণ পাঠ্যসূচি • ১০০% ক্লায়েন্ট-সাইড ফিজিক্স • রিঅ্যাক্ট ১৮ + ভাইট'
              : 'Boylestad 11th Edition Curriculum • 100% Client-Side Physics • React 18 + Vite'}
          </span>
        </div>
      </footer>
    </div>
  );
}
