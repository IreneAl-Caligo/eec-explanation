// ============================================================================
// FULL-PAGE GOOGLE-TRANSLATE STYLE DICTIONARY (ENGLISH & BENGALI)
// Translates the ENTIRE website: Headers, Nav, Tabs, Badges, Sliders, Tables,
// Buttons, Modals, Drawer, Footer, and Status Messages.
// ============================================================================

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    brandTitle: 'EEC Virtual Lab',
    curriculumBadge: 'Boylestad 11th Ed. • 25 Modules',
    subTitle: 'Interactive Semiconductor, Diode, BJT & JFET Virtual Laboratory',
    
    // Navigation Tabs
    tabMasterIndex: 'Master Index',
    tabInteractiveLab: 'Interactive Lab',
    tabExplanation: 'Explanation',
    
    // Language & Theme
    langBtnLabel: 'Language',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeToggleTitle: 'Toggle Theme',
    
    // Master Index Controls
    indexHeaderTitle: 'Boylestad 11th Edition Curriculum Index',
    indexHeaderDesc: 'Explore all 25 core EEC topics with interactive physics simulations, exact exam summaries, and intuitive formula explanations.',
    searchPlaceholder: 'Search 25 topics, equations (e.g., Shockley, Zener, Rectifier, BJT)...',
    filterAll: 'All Modules (25)',
    filterPhysics: 'Semiconductor Physics (0–5)',
    filterDiodes: 'Diodes & LEDs (6–15)',
    filterRectifiers: 'Rectifiers (17–20)',
    filterTransistors: 'BJTs & Amplifiers (16, 19b)',
    filterFets: 'FET & JFETs (20–24)',
    viewCards: 'Card Grid',
    viewTable: 'Compact Table',
    
    // Progress
    topicsMastered: 'Topics Mastered',
    moduleProgress: 'Curriculum Progress',
    
    // Table Columns
    colNum: '#',
    colTopic: 'Topic & Circuit Name',
    colCategory: 'Category',
    colFormula: 'Core Governing Formula',
    colSummary: 'Intuitive Explanation & Concept',
    colStatus: 'Status',
    colActions: 'Actions',
    
    // Buttons & Badges
    btnLaunchLab: 'Launch Interactive Lab',
    btnExplain5yo: '💡 Topic Explanation',
    btnCustomSandbox: '🛠️ Create & Experiment',
    btnInspectFormula: 'Inspect Formula',
    btnMarkComplete: 'Mark Mastered',
    btnCompleted: 'Mastered',
    btnTopicMenu: 'Topic Menu',
    btnPrevTopic: 'Previous Topic',
    btnNextTopic: 'Next Topic',
    btnBackToIndex: 'Back to Master Index',
    btnResetDefaults: 'Reset Defaults',
    
    // In-Lab Top Bar
    labCurriculumHeader: 'Dedicated Interactive Lab Simulator',
    labSelectHelper: 'Experiment with voltage, temperature, doping, components, and live waveforms.',
    clickToInspectTitle: 'Click any component or physics term to inspect its meaning & formula:',
    bilingualInspectorBadge: 'Bilingual Inspector',
    
    // Inline Study Sheet
    inlineSheetTitle: 'Bilingual Study Sheet & Practical Concepts',
    closeInlineSheet: 'Close',
    tabEli5Story: '💡 Intuitive Explanation & Analogy',
    tabExamSummary: '📚 Concise Exam Summary',
    tabFormulaMath: '📐 Formula Breakdown',
    keyTakeawaysTitle: 'Key Exam & Viva Takeaways:',
    quizTitle: 'Concept Quick Check Question:',
    
    // Sandbox & Workbench
    workbenchTitle: 'Full-Control Lab Workbench & Component Swapper',
    workbenchDesc: 'Create, replace, tweak, and experiment with any component, parameter, or formula variable in real time!',
    tabComponentSwapper: '🔄 Swap & Replace Components',
    tabLiveVariables: '🎛️ Tweak Formula Variables',
    tabFaultInjection: '⚡ "What Happens If?" Faults',
    selectMaterialLabel: 'Choose Semiconductor Material:',
    selectDopingLabel: 'Choose Doping Type & Level:',
    selectDiodeModelLabel: 'Choose Diode Type:',
    selectBjtTypeLabel: 'Choose Transistor Type:',
    temperatureControlLabel: 'Lattice Temperature (Kelvin):',
    inputVoltageLabel: 'Input Voltage Source:',
    loadResistorLabel: 'Load Resistor (R_L):',
    seriesResistorLabel: 'Series Protection Resistor (R_S):',
    filterCapacitorLabel: 'Filter Capacitor (C):',
    faultShortCircuit: '💥 Short Circuit Component',
    faultOpenCircuit: '✂️ Open Circuit (Cut Wire)',
    faultThermalRunaway: '🔥 Thermal Overheat (500K)',
    faultReverseBreakdown: '⚡ Reverse Overvoltage Spike',
    faultFreezeZeroK: '🧊 Freeze to 0 Kelvin',
    
    // Drawer
    drawerTitle: 'Curriculum Topic Switcher',
    drawerSearchPlaceholder: 'Search topics, numbers, or keywords...',
    
    // Footer
    footerNote: 'CSE 1st Year EEC Interactive Virtual Lab & Bilingual Simulator • Boylestad 11th Edition • Designed for Deep Conceptual Mastery',
  },
  
  bn: {
    // Brand & Header
    brandTitle: 'ইইসি ভার্চুয়াল ল্যাব',
    curriculumBadge: 'বয়েলস্টেড ১১শ সংস্করণ • ২৫টি মডিউল',
    subTitle: 'ইন্টারেক্টিভ সেমিকন্ডাক্টর, ডায়োড, বিজিটি ও জেফেট ভার্চুয়াল ল্যাবরেটরি',
    
    // Navigation Tabs
    tabMasterIndex: 'মাস্টার ইনডেক্স',
    tabInteractiveLab: 'ইন্টারেক্টিভ ল্যাব',
    tabExplanation: 'ব্যাখ্যা ও সূত্র',
    
    // Language & Theme
    langBtnLabel: 'ভাষা',
    themeLight: 'হালকা (Light)',
    themeDark: 'গাঢ় (Dark)',
    themeToggleTitle: 'থিম পরিবর্তন করুন',
    
    // Master Index Controls
    indexHeaderTitle: 'বয়েলস্টেড ১১শ সংস্করণ পাঠ্যসূচি ইনডেক্স',
    indexHeaderDesc: 'ইন্টারেক্টিভ পদার্থবিজ্ঞান সিমুলেশন, নির্ভুল পরীক্ষার সামারি এবং ৫ বছরের বাচ্চার মতো সহজ গল্পের মাধ্যমে ২৫টি মূল টপিক শিখুন।',
    searchPlaceholder: '২৫টি টপিক বা সূত্রের নাম দিয়ে খুঁজুন (যেমন: শকলে, জেনার, রেক্টিফায়ার, বিজিটি)...',
    filterAll: 'সকল পাঠ (২৫)',
    filterPhysics: 'সেমিকন্ডাক্টর ফিজিক্স (০–৫)',
    filterDiodes: 'ডায়োড ও এলইডি (৬–১৫)',
    filterRectifiers: 'রেক্টিফায়ার ও সার্কিট (১৭–২০)',
    filterTransistors: 'বিজিটি ও অ্যাম্প্লিফায়ার (১৬, ১৯b)',
    filterFets: 'ফেট ও জেফেট (২০–২৪)',
    viewCards: 'কার্ড ভিউ',
    viewTable: 'টেবিল ভিউ',
    
    // Progress
    topicsMastered: 'আয়ত্ত করা টপিক',
    moduleProgress: 'সিলেবাস অগ্রগতি',
    
    // Table Columns
    colNum: '#',
    colTopic: 'টপিক ও সার্কিটের নাম',
    colCategory: 'বিভাগ',
    colFormula: 'মূল গাণিতিক সূত্র',
    colSummary: 'সহজ ব্যাখ্যা ও বাস্তব উপমা',
    colStatus: 'অবস্থা',
    colActions: 'পদক্ষেপ',
    
    // Buttons & Badges
    btnLaunchLab: 'ল্যাব শুরু করুন',
    btnExplain5yo: '💡 সহজ পাঠ ব্যাখ্যা',
    btnCustomSandbox: '🛠️ উপাদান পরিবর্তন ও এক্সপেরিমেন্ট',
    btnInspectFormula: 'সূত্রটি পরীক্ষা করুন',
    btnMarkComplete: 'পড়া শেষ হিসেবে চিহ্নিত করুন',
    btnCompleted: 'সম্পন্ন',
    btnTopicMenu: 'টপিক তালিকা',
    btnPrevTopic: 'পূর্ববর্তী পাঠ',
    btnNextTopic: 'পরবর্তী পাঠ',
    btnBackToIndex: 'মাস্টার ইনডেক্সে ফিরুন',
    btnResetDefaults: 'রিসেট ডিফল্ট',
    
    // In-Lab Top Bar
    labCurriculumHeader: 'নিবেদিত ইন্টারেক্টিভ ল্যাব সিমুলেটর',
    labSelectHelper: 'ভোল্টেজ, তাপমাত্রা, ডোপিং এবং উপাদান পরিবর্তন করে সার্কিটের তরঙ্গ ও আচরণ পরীক্ষা করুন।',
    clickToInspectTitle: 'যেকোনো উপাদান বা পরিভাষার ওপর ক্লিক করে সহজ অর্থ ও সূত্র দেখুন:',
    bilingualInspectorBadge: 'দ্বিভাষিক ইন্সপেক্টর',
    
    // Inline Study Sheet
    inlineSheetTitle: 'দ্বিভাষিক পড়ার শিট ও সহজ ব্যাখ্যা',
    closeInlineSheet: 'বন্ধ করুন',
    tabEli5Story: '💡 সহজ ব্যাখ্যা ও বাস্তব উপমা',
    tabExamSummary: '📚 পরীক্ষার সংক্ষিপ্ত নোট',
    tabFormulaMath: '📐 গাণিতিক সূত্রের বিশ্লেষণ',
    keyTakeawaysTitle: 'পরীক্ষা ও ভাইভার জন্য গুরুত্বপূর্ণ পয়েন্টসমূহ:',
    quizTitle: 'নিজের ধারণা যাচাই করুন (কুইজ প্রশ্ন):',
    
    // Sandbox & Workbench
    workbenchTitle: 'ল্যাব ওয়ার্কবেঞ্চ: সম্পূর্ণ নিয়ন্ত্রণ ও ইচ্ছামতো তৈরি করার স্যান্ডবক্স',
    workbenchDesc: 'যেকোনো উপাদান পরিবর্তন করুন, মান বদলান, যেকোনো সার্কিটে নতুন পার্টস বসান এবং সরাসরি ফল দেখুন!',
    tabComponentSwapper: '🔄 উপাদান বদলানো ও নতুন উপাদান যোগ',
    tabLiveVariables: '🎛️ সূত্রের চলক ও স্লাইডার নিয়ন্ত্রণ',
    tabFaultInjection: '⚡ "এমন করলে কী ঘটবে?" ফ্যান্টাসি টেস্ট',
    selectMaterialLabel: 'সেমিকন্ডাক্টর মৌল নির্বাচন করুন:',
    selectDopingLabel: 'ডোপিংয়ের ধরন ও মাত্রা নির্ধারণ করুন:',
    selectDiodeModelLabel: 'ডায়োড মডেল নির্বাচন করুন:',
    selectBjtTypeLabel: 'ট্রানজিস্টরের ধরন নির্বাচন করুন:',
    temperatureControlLabel: 'কেলাসের তাপমাত্রা (কেলভিন):',
    inputVoltageLabel: 'ইনপুট ভোল্টেজ সোর্স:',
    loadResistorLabel: 'লোড রেজিস্টর (R_L):',
    seriesResistorLabel: 'সিরিজ সুরক্ষা রেজিস্টর (R_S):',
    filterCapacitorLabel: 'ফিল্টার ক্যাপাসিটর (C):',
    faultShortCircuit: '💥 শর্ট সার্কিট (সরাসরি সংযোগ)',
    faultOpenCircuit: '✂️ ওপেন সার্কিট (তার কেটে দেওয়া)',
    faultThermalRunaway: '🔥 অতিরিক্ত তাপ (৫০০ কেলভিন)',
    faultReverseBreakdown: '⚡ রিভার্স ওভারভোল্টেজ শক',
    faultFreezeZeroK: '🧊 পরম শূন্য তাপমাত্রায় নিয়ে যান (0 K)',
    
    // Drawer
    drawerTitle: 'সিলেবাস টপিক পরিবর্তনকারী ড্রয়ার',
    drawerSearchPlaceholder: 'টপিক বা নম্বর দিয়ে অনুসন্ধান করুন...',
    
    // Footer
    footerNote: 'সিএসই ১ম বর্ষ ইইসি ইন্টারেক্টিভ ভার্চুয়াল ল্যাব ও দ্বিভাষিক সিমুলেটর • বয়েলস্টেড ১১শ সংস্করণ • গভীর ধারণা ও শতভাগ আত্মবিশ্বাসের জন্য তৈরি',
  }
};

/**
 * Universal translation helper
 * Returns Bengali text if langMode === 'bn', English text if langMode === 'en',
 * or bilingual label if langMode === 'dual'.
 */
export function t(key, langMode = 'en') {
  const enText = TRANSLATIONS.en[key] || key;
  const bnText = TRANSLATIONS.bn[key] || enText;
  
  if (langMode === 'bn') return bnText;
  if (langMode === 'dual') {
    if (enText === bnText) return enText;
    return `${enText} / ${bnText}`;
  }
  return enText;
}
