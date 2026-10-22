export const TOPICS = [
  {
    id: '0',
    num: '0',
    module: 'diodes',
    simType: 'diode_bias',
    titleEn: 'Semiconductor Diodes & Classifications',
    titleBn: 'সেমিকন্ডাক্টর ডায়োড এবং এর শ্রেণিবিভাগ',
    badge: 'Overview',
    formula: 'I_D = I_S \\left( e^{\\frac{V_D}{n V_T}} - 1 \\right), \\quad V_T \\approx 26\\text{ mV at } 300\\text{ K}',
    enSummary: 'A semiconductor diode is a two-terminal non-linear electronic device formed by joining P-type and N-type semiconductors (a PN junction). It conducts current primarily in one direction (Anode to Cathode) when forward-biased and blocks current when reverse-biased. Depending on doping profile, semiconductor material (Si, Ge, GaAs, GaN), and physical geometry, diodes are classified into Rectifying Diodes (AC-to-DC conversion), Zener Diodes (reverse-breakdown voltage regulation), Light Emitting Diodes (LEDs, optoelectronic emission), Photodiodes, Schottky Diodes, and Varactor Diodes.',
    bnSummary: 'সেমিকন্ডাক্টর ডায়োড হলো P-টাইপ এবং N-টাইপ অর্ধপরিবাহী যুক্ত করে তৈরি একটি দুই-প্রান্তবিশিষ্ট (Anode ও Cathode) ইলেকট্রনিক ডিভাইস। এটি ফরোয়ার্ড বায়াসে একদিকে বিদ্যুৎ প্রবাহিত হতে দেয় এবং রিভার্স বায়াসে বিদ্যুৎ প্রবাহে বাধা দেয়। ডোপিংয়ের মাত্রা এবং গঠনের ওপর ভিত্তি করে ডায়োডকে প্রধানত রেক্টিফায়ার ডায়োড (AC থেকে DC রূপান্তর), জেনার ডায়োড (ভোল্টেজ রেগুলেটর), এবং লাইট এমিটিং ডায়োড বা LED (আলোক নিঃসরণকারী ডায়োড)-এ ভাগ করা হয়।',
    keyPoints: [
      'Unidirectional valve: Low resistance in Forward Bias, high resistance in Reverse Bias.',
      'Knee / Barrier Voltage (V_K): ~0.7 V for Silicon (Si), ~0.3 V for Germanium (Ge), ~1.2V–2.8V for GaAs/GaN LEDs.',
      'Main Classes: Rectifying Diode (power conversion), Zener Diode (breakdown stabilization), LED (electroluminescence).'
    ],
    quiz: {
      q: 'What is the typical forward knee voltage (V_K) of a Silicon PN-junction diode at room temperature?',
      options: ['0.3 V', '0.7 V', '1.8 V', '5.1 V'],
      ans: 1
    }
  },
  {
    id: '1',
    num: '1',
    module: 'physics',
    simType: 'atomic',
    simPreset: { mat: 'Si', temp: 300 },
    titleEn: 'Covalent Bonding in Semiconductors',
    titleBn: 'অর্ধপরিবাহীতে সমযোজী বন্ধন (Covalent Bonding)',
    badge: 'Crystal Physics',
    formula: '4\\text{ Valence } e^- + 4\\text{ Neighbor Shared } e^- = 8\\text{ Stable Octet}',
    enSummary: 'Covalent bonding is the chemical linkage formed when neighboring atoms share pairs of valence electrons to achieve a stable 8-electron outer shell (octet rule). Pure Silicon (Si, Z=14) and Germanium (Ge, Z=32) are tetravalent atoms possessing 4 valence electrons. In a crystalline lattice, each Silicon atom shares one valence electron with each of its four nearest neighbors, forming four strong covalent bonds. At absolute zero (0 K), all valence electrons are tightly locked in these bonds, making the crystal behave as an insulator.',
    bnSummary: 'পরমাণুর সর্ববহিঃস্থ কক্ষপথে ৮টি ইলেকট্রনের স্থিতিশীলতা (অষ্টক পূর্ণ) অর্জনের জন্য পাশের পরমাণুগুলোর সাথে ইলেকট্রন জোড় ভাগাভাগি বা শেয়ার করার মাধ্যমে যে বন্ধন গঠিত হয়, তাকে সমযোজী বন্ধন (Covalent Bond) বলে। বিশুদ্ধ সিলিকন (Si) বা জার্মেনিয়াম (Ge) পরমাণুর শেষ কক্ষপথে ৪টি যোজ্যতা ইলেকট্রন থাকে। এরা নিকটবর্তী ৪টি পরমাণুর সাথে ১টি করে ইলেকট্রন শেয়ার করে মোট ৮টি ইলেকট্রনের শক্তিশালী সমযোজী বন্ধন গঠন করে। পরম শূন্য তাপমাত্রায় (0 K) সব ইলেকট্রন বন্ধনে আবদ্ধ থাকে বলে কোনো মুক্ত ইলেকট্রন থাকে না।',
    keyPoints: [
      'Tetravalent atoms (Si, Ge) have 4 valence electrons in their outermost shell.',
      'Each atom shares 1 electron with 4 adjacent atoms in a tetrahedral crystal lattice.',
      'At T = 0 K, all bonds are intact (insulator); at T = 300 K, thermal energy breaks some bonds, creating electron-hole pairs.'
    ],
    quiz: {
      q: 'How many nearest-neighbor covalent bonds does a single Silicon atom form in a pure crystal lattice?',
      options: ['2 bonds', '3 bonds', '4 bonds', '5 bonds'],
      ans: 2
    }
  },
  {
    id: '2',
    num: '2',
    module: 'physics',
    simType: 'atomic',
    simPreset: { mat: 'Si', temp: 350 },
    titleEn: 'Intrinsic Semiconductor Material',
    titleBn: 'বিশুদ্ধ বা ইন্ট্রিনসিক (Intrinsic) অর্ধপরিবাহী',
    badge: 'Pure Crystal',
    formula: 'n = p = n_i, \\quad n \\cdot p = n_i^2',
    enSummary: 'An intrinsic material is a chemically pure semiconductor crystal (such as 99.9999999% pure Silicon or Germanium) that has been refined to contain zero intentional impurity atoms. At room temperature (300 K), ambient thermal energy breaks a small fraction of covalent bonds, freeing conduction electrons and leaving behind an equal number of positively charged vacancies called holes. Therefore, in an intrinsic semiconductor, the free electron concentration (n) always equals the hole concentration (p), written as n = p = n_i (intrinsic carrier concentration).',
    bnSummary: 'যে অর্ধপরিবাহীতে কোনো ধরনের অপদ্রব্য বা ভেজাল (Impurity) মেশানো থাকে না, সেই সম্পূর্ণ বিশুদ্ধ অর্ধপরিবাহীকে ইন্ট্রিনসিক (Intrinsic) বা বিশুদ্ধ অর্ধপরিবাহী বলে (যেমন: বিশুদ্ধ সিলিকন ও জার্মেনিয়াম)। কক্ষ তাপমাত্রায় (300 K) তাপীয় শক্তির কারণে কিছু সমযোজী বন্ধন ভেঙে যায় এবং সমান সংখ্যক মুক্ত ইলেকট্রন (Free Electron) ও হোল (Hole) সৃষ্টি হয়। তাই বিশুদ্ধ অর্ধপরিবাহীতে মুক্ত ইলেকট্রন সংখ্যা (n) এবং হোলের সংখ্যা (p) সর্বদা সমান থাকে (n = p = n_i)।',
    keyPoints: [
      'Zero doping: Contains only one type of tetravalent atom (pure Si or pure Ge).',
      'Thermal Electron-Hole Pair (EHP) generation ensures n = p = n_i at all temperatures.',
      'Fermi energy level (E_F) lies exactly in the middle of the forbidden energy bandgap (E_g).'
    ],
    quiz: {
      q: 'In an intrinsic semiconductor at room temperature, what is the relationship between free electrons (n) and holes (p)?',
      options: ['n > p', 'p > n', 'n = p = n_i', 'n = 0'],
      ans: 2
    }
  },
  {
    id: '3',
    num: '3',
    module: 'physics',
    simType: 'atomic',
    simPreset: { mat: 'N', temp: 300 },
    titleEn: 'Extrinsic Semiconductor Material',
    titleBn: 'বহির্জাত বা এক্সট্রিনসিক (Extrinsic) অর্ধপরিবাহী',
    badge: 'Doped Crystal',
    formula: 'n \\cdot p = n_i^2 \\quad \\text{(Mass-Action Law)}',
    enSummary: 'An extrinsic semiconductor is a semiconductor material that has been intentionally subjected to a controlled fabrication process called doping—adding a tiny, precise amount of trivalent or pentavalent impurity atoms (typically 1 impurity atom per 10⁶ to 10⁸ host atoms) into an intrinsic crystal. Doping dramatically increases electrical conductivity by thousands of times at room temperature and creates two distinct classes of extrinsic material: N-type (electron-rich) and P-type (hole-rich).',
    bnSummary: 'বিশুদ্ধ অর্ধপরিবাহীর তড়িৎ পরিবাহিতা বহুগুণ বৃদ্ধি করার জন্য এর সাথে সুনিয়ন্ত্রিত উপায়ে সামান্য পরিমাণে ত্রিযোজী (Trivalent) বা পঞ্চযোজী (Pentavalent) অপদ্রব্য পরমাণু মেশানোর প্রক্রিয়াকে ডোপিং (Doping) বলে, এবং এভাবে তৈরি অর্ধপরিবাহীকে এক্সট্রিনসিক (Extrinsic) বা অপদ্রব্যযুক্ত অর্ধপরিবাহী বলে। অপদ্রব্যের ধরনের ওপর ভিত্তি করে এটি দুই প্রকার: P-টাইপ এবং N-টাইপ অর্ধপরিবাহী।',
    keyPoints: [
      'Created via Doping: Adding pentavalent (Group V) or trivalent (Group III) impurities.',
      'Obeys the Mass-Action Law: n · p = n_i² even after heavy doping.',
      'Divided into N-Type (Donor-doped) and P-Type (Acceptor-doped) semiconductors.'
    ],
    quiz: {
      q: 'What is the process of adding controlled impurity atoms to a pure semiconductor called?',
      options: ['Rectification', 'Doping', 'Annealing', 'Passivation'],
      ans: 1
    }
  },
  {
    id: '4',
    num: '4',
    module: 'physics',
    simType: 'atomic',
    simPreset: { mat: 'P', temp: 300 },
    titleEn: 'P-Type Semiconductor (Exact 70-Word Exam Statement)',
    titleBn: 'P-টাইপ অর্ধপরিবাহী (বিবৃতি ও সহজ বাংলা ব্যাখ্যা)',
    badge: '70 Words Exact',
    wordTarget: 70,
    formula: 'p \\approx N_A \\gg n, \\quad n \\approx \\frac{n_i^2}{N_A}',
    enSummary: 'A P-type semiconductor is an extrinsic crystal formed by doping a pure intrinsic semiconductor like silicon or germanium with trivalent impurity atoms such as boron, gallium, or indium. Each trivalent acceptor atom has three valence electrons, forming three covalent bonds with neighboring silicon atoms while leaving one incomplete bond called a hole. Consequently, positively charged holes become the majority charge carriers, and thermally generated free electrons remain the minority carriers.',
    bnSummary: 'বিশুদ্ধ সিলিকন বা জার্মেনিয়ামের সাথে ত্রিযোজী (Trivalent - যাদের শেষ কক্ষপথে ৩টি ইলেকট্রন আছে, যেমন: বোরন B, গ্যালিয়াম Ga, ইন্ডিয়াম In) মৌল ডোপিং করলে যে অর্ধপরিবাহী তৈরি হয়, তাকে P-টাইপ (Positive-type) অর্ধপরিবাহী বলে। ত্রিযোজী পরমাণুর ৩টি ইলেকট্রন চারপাশের ৪টি সিলিকনের মধ্যে ৩টির সাথে সমযোজী বন্ধন গঠন করে, কিন্তু ৪র্থ বন্ধনে ১টি ইলেকট্রনের ঘাটতি বা ফাঁকা স্থান থেকে যায়, যাকে ধনাত্মক হোল (Hole) বলে। এতে হোল হলো মেজরিটি ক্যারিয়ার (সংখ্যাগুরু বাহক) এবং মুক্ত ইলেকট্রন হলো মাইনরিটি ক্যারিয়ার।',
    keyPoints: [
      'Dopant: Trivalent Group-III Acceptor atoms (Boron, Gallium, Indium) with 3 valence electrons.',
      'Majority Carriers: Positively charged Holes (p ≈ N_A); Minority Carriers: Free Electrons (n).',
      'Acceptor ions become immobile negative charges (B⁻) after capturing a valence electron.'
    ],
    quiz: {
      q: 'Which of the following impurity elements is used to create a P-Type semiconductor?',
      options: ['Phosphorus (P)', 'Arsenic (As)', 'Boron (B)', 'Antimony (Sb)'],
      ans: 2
    }
  },
  {
    id: '5',
    num: '5',
    module: 'physics',
    simType: 'atomic',
    simPreset: { mat: 'N', temp: 300 },
    titleEn: 'N-Type Semiconductor (Exact 70-Word Exam Statement)',
    titleBn: 'N-টাইপ অর্ধপরিবাহী (বিবৃতি ও সহজ বাংলা ব্যাখ্যা)',
    badge: '70 Words Exact',
    wordTarget: 70,
    formula: 'n \\approx N_D \\gg p, \\quad p \\approx \\frac{n_i^2}{N_D}',
    enSummary: 'An N-type semiconductor is an extrinsic crystal created by doping a pure intrinsic semiconductor like silicon or germanium with pentavalent impurity atoms such as phosphorus, arsenic, or antimony. Four of the five valence electrons from each donor atom form covalent bonds with four adjacent silicon atoms, leaving the fifth electron loosely bound and free to conduct. Therefore, negatively charged free electrons serve as majority carriers, while holes are minority carriers.',
    bnSummary: 'বিশুদ্ধ সিলিকন বা জার্মেনিয়ামের সাথে পঞ্চযোজী (Pentavalent - যাদের শেষ কক্ষপথে ৫টি ইলেকট্রন আছে, যেমন: ফসফরাস P, আর্সেনিক As, অ্যান্টিমনি Sb) মৌল ডোপিং করলে যে অর্ধপরিবাহী তৈরি হয়, তাকে N-টাইপ (Negative-type) অর্ধপরিবাহী বলে। পঞ্চযোজী পরমাণুর ৫টি ইলেকট্রনের মধ্যে ৪টি পাশের ৪টি সিলিকন পরমাণুর সাথে সমযোজী বন্ধন গঠন করে এবং ৫ম ইলেকট্রনটি বন্ধনে অংশ না নিয়ে মুক্ত ইলেকট্রন হিসেবে কেলাসে ঘুরে বেড়ায়। এতে মুক্ত ইলেকট্রন মেজরিটি ক্যারিয়ার এবং হোল মাইনরিটি ক্যারিয়ার।',
    keyPoints: [
      'Dopant: Pentavalent Group-V Donor atoms (Phosphorus, Arsenic, Antimony) with 5 valence electrons.',
      'Majority Carriers: Free Electrons (n ≈ N_D); Minority Carriers: Holes (p).',
      'Donor atoms become immobile positive ions (P⁺) after donating their 5th electron to the conduction band.'
    ],
    quiz: {
      q: 'In an N-Type semiconductor, what are the majority and minority charge carriers respectively?',
      options: ['Holes and Electrons', 'Electrons and Holes', 'Protons and Neutrons', 'Positive Ions and Holes'],
      ans: 1
    }
  },
  {
    id: '6',
    num: '6',
    module: 'diodes',
    simType: 'diode_bias',
    titleEn: 'Definition of Diode & Classification: (i) Rectifying, (ii) Zener, (iii) LED',
    titleBn: 'ডায়োডের সংজ্ঞা ও শ্রেণিবিভাগ: (i) রেক্টিফায়ার, (ii) জেনার, (iii) LED',
    badge: '3 Core Diodes',
    formula: 'R_F \\ll R_R \\quad (\\text{Rectifying } \\mid \\text{ Zener } \\mid \\text{ LED})',
    enSummary: 'A semiconductor diode is a two-terminal PN-junction device that permits substantial current flow in forward bias while blocking current in reverse bias. Its three primary classifications in EEC are: (i) Rectifying Diode: A standard silicon PN diode (such as the 1N4007) with a high Peak Inverse Voltage (PIV) rating, designed to convert bidirectional AC into unidirectional pulsating DC in power supplies. (ii) Zener Diode: A heavily doped silicon PN diode engineered to operate safely and continuously in the reverse-breakdown region, maintaining a nearly constant voltage (V_Z) across its terminals for voltage regulation. (iii) Light Emitting Diode (LED): A forward-biased direct-bandgap compound semiconductor diode (GaAs, GaAsP, InGaN) that converts electrical energy directly into visible or infrared light photons during electron-hole recombination.',
    bnSummary: 'ডায়োড হলো P-N জাংশন বিশিষ্ট এমন একটি দুই-প্রান্তের ইলেকট্রনিক কৌশল যা ফরোয়ার্ড বায়াসে তড়িৎ প্রবাহিত করে এবং রিভার্স বায়াসে তড়িৎ প্রবাহ রোধ করে। এর ৩টি প্রধান শ্রেণিবিভাগ হলো: (i) রেক্টিফায়ার ডায়োড (Rectifying Diode): এটি সাধারণ সিলিকন ডায়োড (যেমন 1N4007), যা দিকপরিবর্তী AC প্রবাহকে একমুখী DC প্রবাহে রূপান্তর করতে পাওয়ার সাপ্লাইয়ে ব্যবহৃত হয়। (ii) জেনার ডায়োড (Zener Diode): এটি বিশেষভাবে উচ্চমাত্রায় ডোপকৃত ডায়োড যা রিভার্স ব্রেকডাউন অঞ্চলে নষ্ট না হয়ে কাজ করতে পারে এবং স্থির ভোল্টেজ (Voltage Regulator) বজায় রাখতে ব্যবহৃত হয়। (iii) LED (Light Emitting Diode): এটি গ্যালিয়াম আর্সেনাইড (GaAs) বা গ্যালিয়াম ফসফাইড (GaP) নির্মিত ডায়োড যা ফরোয়ার্ড বায়াসে ইলেকট্রন ও হোলের পুনর্মিলনের ফলে বৈদ্যুতিক শক্তিকে দৃশ্যমান আলোতে রূপান্তরিত করে।',
    keyPoints: [
      '(i) Rectifying Diode: Operates in forward conduction / reverse blocking; converts AC to DC (e.g., 1N4001–1N4007).',
      '(ii) Zener Diode: Heavily doped; operates in reverse Zener/Avalanche breakdown (V_Z = 1.8V to 200V) as a voltage reference.',
      '(iii) LED: Direct-bandgap compound semiconductor; operates in forward bias (1.8V–3.3V) to emit monochromatic light.'
    ],
    quiz: {
      q: 'Which diode is specifically engineered to operate continuously in its reverse-breakdown region?',
      options: ['Rectifying Diode', 'Zener Diode', 'Light Emitting Diode (LED)', 'Schottky Diode'],
      ans: 1
    }
  },
  {
    id: '7',
    num: '7',
    module: 'diodes',
    simType: 'bandgap_led',
    simPreset: { bgMode: 'direct' },
    titleEn: 'Direct Bandgap Semiconductor',
    titleBn: 'ডাইরেক্ট ব্যান্ডগ্যাপ (Direct Bandgap) অর্ধপরিবাহী',
    badge: 'Optoelectronics',
    formula: '\\mathbf{k}_{\\min}(\\text{Conduction}) = \\mathbf{k}_{\\max}(\\text{Valence}) \\implies E_g = h\\nu = \\frac{hc}{\\lambda}',
    enSummary: 'In a Direct Bandgap Semiconductor (such as Gallium Arsenide GaAs, Indium Phosphide InP, and Gallium Nitride GaN), the minimum energy state of the conduction band (E_C) and the maximum energy state of the valence band (E_V) occur at the exact same crystal momentum vector (k = 0) in the Brillouin zone. Because crystal momentum is already conserved, an electron in the conduction band can fall directly into an empty hole in the valence band without needing a lattice vibration (phonon), releasing 100% of the bandgap energy directly as a light photon (hν = E_g). This makes direct-bandgap materials ideal for LEDs and laser diodes.',
    bnSummary: 'ডাইরেক্ট ব্যান্ডগ্যাপ অর্ধপরিবাহীতে (যেমন: GaAs, GaN, InGaN) কন্ডাকশন ব্যান্ডের সর্বনিম্ন শক্তিস্তর এবং ভ্যালেন্স ব্যান্ডের সর্বোচ্চ শক্তিস্তর একই ভরবেগ বা মোমেন্টাম মানে (same crystal momentum, k) অবস্থান করে। ফলে কন্ডাকশন ব্যান্ডের মুক্ত ইলেকট্রন কোনো ভরবেগ পরিবর্তন ছাড়াই সরাসরি ভ্যালেন্স ব্যান্ডের হোলের সাথে মিলিত হতে পারে এবং পুরো শক্তিটুকু আলোক কণা বা ফোটন (Photon, E = hν) হিসেবে নির্গত করে। এজন্য LED ও লেজার ডায়োড তৈরিতে ডাইরেক্ট ব্যান্ডগ্যাপ সেমিকন্ডাক্টর ব্যবহৃত হয়।',
    keyPoints: [
      'Conduction band minimum and valence band maximum align vertically at the same crystal momentum (k).',
      'Radiative recombination dominates: Energy is emitted directly as photons (light) with high quantum efficiency.',
      'Examples: GaAs (E_g = 1.42 eV), GaAsP, InP, GaN — primary materials for LEDs and semiconductor lasers.'
    ],
    quiz: {
      q: 'Why are direct bandgap semiconductors like GaAs used to manufacture LEDs instead of pure Silicon?',
      options: [
        'Silicon melts at room temperature',
        'Electrons and holes recombine at the same momentum k, emitting photons directly without phonon heat loss',
        'GaAs has zero forward voltage drop',
        'Direct bandgap materials only conduct in reverse bias'
      ],
      ans: 1
    }
  },
  {
    id: '8',
    num: '8',
    module: 'diodes',
    simType: 'bandgap_led',
    simPreset: { bgMode: 'indirect' },
    titleEn: 'Indirect Bandgap Semiconductor',
    titleBn: 'ইনডাইরেক্ট ব্যান্ডগ্যাপ (Indirect Bandgap) অর্ধপরিবাহী',
    badge: 'Phonon / Heat',
    formula: '\\mathbf{k}_{\\min}(\\text{Conduction}) \\neq \\mathbf{k}_{\\max}(\\text{Valence}) \\implies E_g \\to \\text{Phonon (Heat)}',
    enSummary: 'In an Indirect Bandgap Semiconductor (such as Silicon Si and Germanium Ge), the minimum energy of the conduction band and the maximum energy of the valence band occur at different values of crystal momentum (k). For a conduction electron to recombine with a valence hole, it must simultaneously change both its energy and its momentum by transferring momentum to the crystal lattice as a mechanical vibration called a phonon (heat). Consequently, recombination releases thermal energy rather than light photons, making Si and Ge unsuitable for standard LEDs but excellent for transistors, diodes, and IC logic.',
    bnSummary: 'ইনডাইরেক্ট ব্যান্ডগ্যাপ অর্ধপরিবাহীতে (যেমন: সিলিকন Si ও জার্মেনিয়াম Ge) কন্ডাকশন ব্যান্ডের সর্বনিম্ন শক্তিস্তর এবং ভ্যালেন্স ব্যান্ডের সর্বোচ্চ শক্তিস্তর ভিন্ন ভিন্ন ভরবেগ (different momentum, k) অবস্থানে থাকে। তাই ইলেকট্রন ও হোলের পুনর্মিলনের সময় ভরবেগ সংরক্ষণের জন্য কেলাস জালিকায় কম্পন বা ফোনন (Phonon) তৈরি হয় এবং অতিরিক্ত শক্তি আলোর বদলে তাপ (Heat) হিসেবে নির্গত হয়। এজন্য সিলিকন বা জার্মেনিয়াম দিয়ে সাধারণ LED তৈরি করা যায় না।',
    keyPoints: [
      'Conduction band minimum is offset in momentum space (k) from the valence band maximum.',
      'Recombination requires a three-body interaction (electron + hole + lattice phonon), releasing heat instead of light.',
      'Examples: Silicon (Si, E_g = 1.12 eV) and Germanium (Ge, E_g = 0.67 eV).'
    ],
    quiz: {
      q: 'In an indirect bandgap semiconductor like Silicon, how is most of the energy released during electron-hole recombination?',
      options: ['Visible blue light', 'X-ray radiation', 'Lattice vibrations (phonons / heat)', 'Gamma rays'],
      ans: 2
    }
  },
  {
    id: '9',
    num: '9',
    module: 'diodes',
    simType: 'bandgap_led',
    titleEn: 'Definition of LED (Light Emitting Diode)',
    titleBn: 'LED (লাইট এমিটিং ডায়োড)-এর সংজ্ঞা',
    badge: 'Definition',
    formula: '\\lambda\\text{ (nm)} = \\frac{1240}{E_g\\text{ (eV)}}',
    enSummary: 'A Light Emitting Diode (LED) is a specialized optoelectronic PN-junction semiconductor diode fabricated from direct-bandgap compound materials (such as GaAs, GaP, GaAsP, or InGaN) that emits monochromatic visible or infrared light through spontaneous electroluminescence when forward-biased.',
    bnSummary: 'LED বা Light Emitting Diode হলো ডাইরেক্ট ব্যান্ডগ্যাপ যৌগ অর্ধপরিবাহী (যেমন GaAs, GaP, GaAsP) দ্বারা তৈরি এক বিশেষ ধরনের P-N জাংশন ডায়োড, যাকে ফরোয়ার্ড বায়াস প্রদান করলে ইলেকট্রন ও হোলের পুনর্মিলনের (Electroluminescence) মাধ্যমে দৃশ্যমান বা অবলোহিত (Infrared) আলো নির্গত হয়।',
    keyPoints: [
      'Converts electrical energy directly into optical energy (photons) under forward bias.',
      'Wavelength/color depends strictly on the semiconductor bandgap: λ ≈ 1240 / E_g(eV) nm.',
      'Circuit symbol features a standard PN diode triangle with two outward-pointing arrows representing emitted light.'
    ],
    quiz: {
      q: 'What physical phenomenon enables an LED to emit light when forward-biased?',
      options: ['Thermionic emission', 'Electroluminescence (radiative recombination)', 'Photoelectric effect', 'Zener tunneling'],
      ans: 1
    }
  },
  {
    id: '10',
    num: '10',
    module: 'diodes',
    simType: 'bandgap_led',
    titleEn: 'Characteristics of LED',
    titleBn: 'LED-এর বৈশিষ্ট্যসমূহ (Characteristics of LED)',
    badge: 'V-I & Optical',
    formula: 'V_F \\approx 1.8\\text{ V to } 3.3\\text{ V}, \\quad \\Phi_v \\propto I_F',
    enSummary: 'The electrical and optical characteristics of an LED govern its circuit design: (1) Higher Forward Knee Voltage: Unlike Silicon diodes (0.7 V), LEDs require a forward turn-on voltage between 1.2 V (IR) and 3.3 V (Blue/UV) proportional to their bandgap energy E_g. (2) Radiant Output vs. Forward Current: Light intensity (luminous flux) is directly proportional to forward current (I_F, typically 10–30 mA). (3) Spectral Purity: Emits narrow-bandwidth monochromatic light determined by semiconductor alloy composition. (4) Low Reverse Breakdown Voltage: LEDs have a fragile reverse breakdown rating (typically PIV ≈ 5 V), so they must be protected against high reverse voltages.',
    bnSummary: 'LED-এর প্রধান বৈশিষ্ট্যগুলো হলো: (১) ফরোয়ার্ড থ্রেশহোল্ড ভোল্টেজ: সাধারণ সিলিকন ডায়োডের (0.7V) তুলনায় LED-র ফরোয়ার্ড ভোল্টেজ বেশি হয় (রঙ ভেদে ১.৮ ভোল্ট থেকে ৩.৩ ভোল্ট পর্যন্ত)। (২) আলোর তীব্রতা ও প্রবাহের সম্পর্ক: ফরোয়ার্ড কারেন্ট (I_F, সাধারণত 10–20 mA) বাড়ালে নির্গত আলোর উজ্জ্বলতা সমানুপাতিক হারে বৃদ্ধি পায়। (৩) আলোর রঙ: ব্যবহৃত অর্ধপরিবাহীর ব্যান্ডগ্যাপ শক্তির (E_g) ওপর আলোর তরঙ্গদৈর্ঘ্য ও রঙ নির্ভর করে (যেমন GaAsP = লাল, GaP = সবুজ, InGaN = নীল)। (৪) কম রিভার্স ব্রেকডাউন ভোল্টেজ: মাত্র 5V রিভার্স ভোল্টেজেই LED নষ্ট হয়ে যেতে পারে।',
    keyPoints: [
      'Forward voltage drop scales with photon energy: Red (~1.8V) < Yellow (~2.0V) < Green (~2.2V) < Blue (~3.0V).',
      'Luminous intensity is linearly proportional to forward current I_F over the normal operating range.',
      'Requires an external series resistor R_S = (V_S - V_F) / I_F to limit current and prevent thermal burnout.'
    ],
    quiz: {
      q: 'What is the typical maximum safe reverse breakdown voltage (PIV) of a standard indicator LED?',
      options: ['Around 5 V', 'Around 100 V', 'Around 400 V', 'Around 1000 V'],
      ans: 0
    }
  },
  {
    id: '11',
    num: '11',
    module: 'diodes',
    simType: 'bandgap_led',
    titleEn: 'Construction of LED',
    titleBn: 'LED-এর গঠন প্রণালী (Construction of LED)',
    badge: 'Device Structure',
    formula: '\\text{Epoxy Dome} + \\text{Thin P-Window} + \\text{PN Die} + \\text{Anvil Cup}',
    enSummary: 'An LED is constructed by growing an N-type epitaxial semiconductor layer followed by a very thin, window-like P-type layer on a conductive substrate. The P-layer is made extremely thin so that photons generated at the PN junction can escape to the surface without being reabsorbed. A metallic ring or comb-shaped anode contact is deposited on top of the P-layer to spread current while leaving the surface uncovered for light emission. The semiconductor die is mounted inside a cup-shaped reflective metal cathode cavity (anvil) that reflects downward photons upward, connected via a fine gold wire bond to the anode lead, and encapsulated in a hemispherical epoxy resin dome lens that focuses the light and reduces total internal reflection.',
    bnSummary: 'একটি শক্ত সাবস্ট্রেটের ওপর প্রথমে N-টাইপ অর্ধপরিবাহী স্তর এবং তার ওপর অত্যন্ত পাতলা P-টাইপ অর্ধপরিবাহী স্তর স্থাপন করে LED তৈরি করা হয়। P-স্তরটি পাতলা রাখা হয় যাতে জাংশন থেকে উৎপন্ন আলো শোষিত না হয়ে সহজেই বাইরে বেরিয়ে আসতে পারে। আলোক প্রতিফলনের জন্য পুরো চিপটিকে একটি বাটি-আকৃতির প্রতিফলক ক্যাথোড কাপের (Reflective Cathode Cup) ওপর বসানো হয় এবং সূক্ষ্ম সোনার তার দিয়ে অ্যানোড সংযোগ দেওয়া হয়। সবশেষে চিপটিকে একটি স্বচ্ছ গম্বুজাকৃতির ইপোক্সি লেন্স (Epoxy Dome Lens) দিয়ে ঢেকে দেওয়া হয়, যা আলোকে একমুখী করে ও অভ্যন্তরীণ পূর্ণ প্রতিফলন কমায়।',
    keyPoints: [
      'Ultra-thin top P-type layer minimizes photon reabsorption before light exits the crystal.',
      'Reflective metal cathode cup (anvil) directs downward-emitted photons upward through the top surface.',
      'Hemispherical epoxy lens protects the die and matches refractive index so light escapes efficiently.'
    ],
    quiz: {
      q: 'Why is the top P-type semiconductor layer in an LED made extremely thin?',
      options: [
        'To increase reverse breakdown voltage to 1000 V',
        'To allow photons generated at the PN junction to escape without being reabsorbed',
        'To block all electrons from reaching the junction',
        'To convert photons into heat'
      ],
      ans: 1
    }
  },
  {
    id: '12',
    num: '12',
    module: 'diodes',
    simType: 'bandgap_led',
    titleEn: 'Working Principle of LED (Exact 80-Word Exam Statement)',
    titleBn: 'LED-এর কার্যপ্রণালী (Working Principle - সহজ বাংলা ও ৮০ শব্দ)',
    badge: '80 Words Exact',
    wordTarget: 80,
    formula: 'e^- (\\text{Conduction}) + h^+ (\\text{Valence}) \\longrightarrow \\text{Photon } \\left(E = h\\nu = \\frac{hc}{\\lambda}\\right)',
    enSummary: 'A Light Emitting Diode operates on the principle of electroluminescence in a forward-biased direct-bandgap PN junction. When positive source voltage is applied to the P-type anode and negative voltage to the N-type cathode, majority electrons and holes overcome the barrier potential and inject across the narrow depletion region. As free electrons from the higher-energy conduction band recombine directly with holes in the lower-energy valence band, they release excess energy as visible or infrared photons whose wavelength depends on bandgap energy.',
    bnSummary: 'LED ইলেকট্রোলুমিনেসেন্স (Electroluminescence) বা তড়িৎ-আলোক নিঃসরণ নীতিতে কাজ করে। যখন LED-র P-প্রান্তে ধনাত্মক এবং N-প্রান্তে ঋণাত্মক ভোল্টেজ দিয়ে ফরোয়ার্ড বায়াস করা হয়, তখন ডিপ্লিশন স্তর সংকুচিত হয়। ফলে N-অঞ্চলের মুক্ত ইলেকট্রন এবং P-অঞ্চলের হোল জাংশন অতিক্রম করে পরস্পরের সাথে মিলিত (Recombination) হয়। ইলেকট্রন উচ্চ শক্তিস্তর (Conduction Band) থেকে নিম্ন শক্তিস্তরের (Valence Band) হোলে পতিত হওয়ার সময় দুই স্তরের শক্তির পার্থক্য (E_g = hν) আলোক ফোটন বা দৃশ্যমান আলো হিসেবে বাইরে নির্গত হয়।',
    keyPoints: [
      'Forward bias injects electrons from N-side and holes from P-side into the active junction zone.',
      'Radiative recombination releases energy ΔE = E_C - E_V = hν as electromagnetic radiation (light).',
      'Exact 80-word exam statement verified for CSE 1st Year EEC written exams.'
    ],
    quiz: {
      q: 'In an LED, the energy of each emitted photon (hν) is approximately equal to:',
      options: ['The series resistor resistance R_S', 'The semiconductor bandgap energy E_g', 'The reverse leakage current I_S', 'Zero'],
      ans: 1
    }
  },
  {
    id: '13',
    num: '13',
    module: 'diodes',
    simType: 'diode_bias',
    simPreset: { tab: 'zener_iv' },
    titleEn: 'Characteristics of Zener Diode',
    titleBn: 'জেনার ডায়োডের বৈশিষ্ট্যসমূহ (Characteristics of Zener Diode)',
    badge: 'V-I Curve',
    formula: 'V_Z = \\text{Constant for } I_{ZK} \\le I_Z \\le I_{ZM}',
    enSummary: 'A Zener diode is a heavily doped PN-junction silicon diode engineered to operate reliably in the reverse-breakdown region. Its V-I characteristics exhibit two distinct regimes: (1) Forward Bias Characteristic: Identical to an ordinary silicon rectifying diode, turning on smoothly at V_K ≈ 0.7 V. (2) Reverse Bias & Zener Breakdown Characteristic: Initially, only a tiny microampere reverse saturation current (I_S) flows as reverse voltage increases. Once reverse voltage reaches the sharply defined Zener Breakdown Voltage (V_Z, typically 1.8 V to 200 V), strong electric fields across the narrow depletion layer trigger Zener quantum tunneling (for V_Z < 5V) or Avalanche impact ionization (for V_Z > 5V). Current increases almost vertically from the knee current (I_ZK) up to the maximum safe current (I_ZM) while terminal voltage remains locked at V_Z.',
    bnSummary: 'জেনার ডায়োড একটি উচ্চমাত্রায় ডোপকৃত P-N জাংশন ডায়োড যা রিভার্স ব্রেকডাউন অঞ্চলে কাজ করার জন্য তৈরি। এর V-I বৈশিষ্ট্যগুলো হলো: (১) ফরোয়ার্ড বায়াস বৈশিষ্ট্য: এটি সাধারণ সিলিকন ডায়োডের মতোই 0.7V অতিক্রম করলে তড়িৎ প্রবাহিত করে। (২) রিভার্স বায়াস ও শার্প ব্রেকডাউন বৈশিষ্ট্য: রিভার্স ভোল্টেজ বাড়ালে প্রথমে অতি সামান্য লিকেজ কারেন্ট বহে। কিন্তু ভোল্টেজ একটি নির্দিষ্ট মানে (জেনার ভোল্টেজ, V_Z) পৌঁছালে প্রবাহ হঠাৎ খাড়াভাবে বৃদ্ধি পায়। এই অবস্থায় কারেন্ট সর্বনিম্ন I_ZK থেকে সর্বোচ্চ I_ZM পর্যন্ত পরিবর্তিত হলেও ডায়োডের দুই প্রান্তের ভোল্টেজ (V_Z) সম্পূর্ণ স্থির থাকে।',
    keyPoints: [
      'Behaves like a normal silicon diode (0.7 V drop) in Forward Bias.',
      'Exhibits an ultra-sharp, non-destructive voltage knee at V = -V_Z in Reverse Bias.',
      'Maintains nearly constant terminal voltage V_Z between I_ZK (knee current) and I_ZM (max power current P_ZM / V_Z).'
    ],
    quiz: {
      q: 'How does a Zener diode behave when forward-biased?',
      options: [
        'It acts as an open circuit forever',
        'It conducts like a standard Silicon diode with ~0.7 V drop',
        'It regulates at V_Z = 12 V',
        'It emits coherent laser light'
      ],
      ans: 1
    }
  },
  {
    id: '14',
    num: '14',
    module: 'diodes',
    simType: 'diode_bias',
    simPreset: { tab: 'pn_bias' },
    titleEn: 'Forward Bias & Reverse Bias (Exact 110-Word Exam Statement)',
    titleBn: 'ফরোয়ার্ড বায়াস এবং রিভার্স বায়াস (সহজ বাংলা ও ১১০ শব্দ)',
    badge: '110 Words Exact',
    wordTarget: 110,
    formula: '\\text{Fwd: } V_D > V_K \\ (R_F \\downarrow) \\ \\Big| \\ \\text{Rev: } V_D < 0 \\ (R_R \\uparrow, W_{\\text{dep}} \\uparrow)',
    enSummary: 'Biasing means applying an external DC voltage across a PN junction diode to control current flow. In forward bias, the positive battery terminal connects to the P-type material and the negative terminal connects to the N-type material. This external voltage opposes the built-in barrier potential, narrows the depletion layer, and allows a large majority-carrier current to flow once voltage exceeds the knee threshold. Conversely, in reverse bias, the positive terminal connects to the N-type side and the negative terminal connects to the P-type side. Carriers are pulled away from the junction, widening the depletion layer and blocking majority current so only a tiny minority leakage current flows until breakdown occurs.',
    bnSummary: 'ডায়োডের মধ্য দিয়ে তড়িৎ প্রবাহ নিয়ন্ত্রণের জন্য বাহ্যিক DC ভোল্টেজ প্রয়োগ করাকে বায়াসিং বলে। ফরোয়ার্ড বায়াস (Forward Bias): ব্যাটারির ধনাত্মক (+) প্রান্ত ডায়োডের P-প্রান্তে এবং ঋণাত্মক (-) প্রান্ত N-প্রান্তে যুক্ত করলে তাকে ফরোয়ার্ড বায়াস বলে। এতে ডিপ্লিশন স্তর সংকুচিত হয় এবং ০.৭ ভোল্ট (Si) অতিক্রম করলেই প্রচুর মেজরিটি কারেন্ট প্রবাহিত হয়। রিভার্স বায়াস (Reverse Bias): ব্যাটারির ধনাত্মক (+) প্রান্ত N-প্রান্তে এবং ঋণাত্মক (-) প্রান্ত P-প্রান্তে যুক্ত করলে তাকে রিভার্স বায়াস বলে। এতে আধান বাহকগুলো জাংশন থেকে দূরে সরে যায়, ডিপ্লিশন স্তর চওড়া হয় এবং মেজরিটি কারেন্ট বন্ধ হয়ে কেবল নগণ্য মাইনরিটি লিকেজ কারেন্ট বহে।',
    keyPoints: [
      'Forward Bias (P to +, N to -): Depletion region narrows; low resistance; milliamps of majority current flow.',
      'Reverse Bias (P to -, N to +): Depletion region widens; huge resistance; only micro/nanoamps of leakage current I_S flow.',
      'Exact 110-word exam statement verified for CSE 1st Year EEC written exams.'
    ],
    quiz: {
      q: 'What happens to the depletion region width when a PN junction diode is Reverse Biased?',
      options: ['It disappears completely', 'It widens and increases barrier resistance', 'It narrows to zero', 'It turns into a metal'],
      ans: 1
    }
  },
  {
    id: '15',
    num: '15',
    module: 'diodes',
    simType: 'diode_bias',
    simPreset: { tab: 'zener_reg' },
    titleEn: 'Voltage Regulator Circuit Using Zener Diode (With Figure)',
    titleBn: 'জেনার ডায়োডের সাহায্যে ভোল্টেজ রেগুলেটর সার্কিট (চিত্রসহ ব্যাখ্যা)',
    badge: 'Regulator Lab',
    formula: 'V_L = V_Z \\quad (\\text{when } V_{Th} \\ge V_Z), \\quad I_S = \\frac{V_{in} - V_Z}{R_S} = I_Z + I_L',
    enSummary: 'A Zener Shunt Voltage Regulator maintains a constant DC output voltage across a load resistor (R_L) despite fluctuations in the unregulated DC input voltage (V_in) or variations in load current (I_L). As shown in the circuit figure, a series current-limiting resistor (R_S) connects the unregulated input V_in to a reverse-biased Zener diode placed in parallel (shunt) with the load R_L. First, check the Thevenin load voltage without the Zener: V_Th = V_in · R_L / (R_S + R_L). When V_Th ≥ V_Z, the Zener diode enters reverse breakdown and locks the load voltage strictly at V_L = V_Z. The series resistor R_S absorbs any excess voltage (V_RS = V_in - V_Z), and source current splits according to Kirchhoff’s Current Law: I_S = I_Z + I_L. If V_in rises, I_S rises and the extra current diverts safely through I_Z while V_L stays constant at V_Z.',
    bnSummary: 'ইনপুট ভোল্টেজ (V_in) বা লোড রোধ (R_L) পরিবর্তিত হলেও যে সার্কিট লোডের দুই প্রান্তে সর্বদা স্থির DC আউটপুট ভোল্টেজ (V_L) বজায় রাখে, তাকে ভোল্টেজ রেগুলেটর সার্কিট বলে। চিত্রে একটি সিরিজ রোধ (R_S)-এর পর জেনার ডায়োডকে রিভার্স বায়াসে লোড রোধ (R_L)-এর সাথে সমান্তরালে (Parallel/Shunt) যুক্ত করা হয়েছে। যখন ইনপুট ভোল্টেজ জেনার ব্রেকডাউন ভোল্টেজের (V_Z) চেয়ে বেশি হয় (V_Th ≥ V_Z), তখন জেনার ডায়োড চালু হয়ে লোডের ভোল্টেজকে V_L = V_Z মানে স্থির করে ফেলে। ইনপুট ভোল্টেজ বাড়লে অতিরিক্ত ভোল্টেজ R_S রোধে ড্রপ হয় (V_in - V_Z) এবং অতিরিক্ত কারেন্ট জেনার ডায়োডের ভেতর দিয়ে (I_Z = I_S - I_L) প্রবাহিত হয়, ফলে লোড ভোল্টেজ অপরিবর্তিত থাকে।',
    keyPoints: [
      'Zener diode is connected in Reverse Bias in parallel (shunt) with the load resistor R_L.',
      'Series resistor R_S drops excess voltage (V_in - V_Z) and protects the Zener from exceeding I_ZM.',
      'KCL at the output node: I_S = I_Z + I_L, where I_L = V_Z / R_L remains constant as long as I_ZK ≤ I_Z ≤ I_ZM.'
    ],
    quiz: {
      q: 'In a Zener voltage regulator, how is the Zener diode connected relative to the load resistor R_L?',
      options: [
        'In series and forward-biased',
        'In parallel (shunt) and reverse-biased',
        'In parallel and forward-biased',
        'Across the AC transformer primary'
      ],
      ans: 1
    }
  },
  {
    id: '16',
    num: '16',
    module: 'bjt',
    simType: 'bjt_lab',
    titleEn: 'Transistor (BJT): (i) NPN & PNP Definitions & Figures, (ii) Biasing Rules',
    titleBn: 'ট্রানজিস্টর (BJT): (i) NPN ও PNP-এর সংজ্ঞা ও চিত্র, (ii) বায়াসিং নিয়মাবলি',
    badge: 'BJT Fundamentals',
    formula: 'I_E = I_C + I_B, \\quad I_C = \\beta I_B, \\quad \\alpha = \\frac{\\beta}{\\beta + 1}',
    enSummary: 'A Bipolar Junction Transistor (BJT) is a three-terminal, current-controlled semiconductor device consisting of two PN junctions formed by sandwiching either a thin P-type or N-type layer between two layers of opposite polarity. Its three terminals are the Emitter (E, heavily doped to inject carriers), Base (B, very thin and lightly doped to pass carriers), and Collector (C, moderately doped and physically largest to collect carriers and dissipate heat). (i) NPN & PNP Definitions: In an NPN Transistor, a thin P-type base is sandwiched between two N-type layers (majority carriers: electrons; schematic emitter arrow points OUT: "Not Pointing iN"). In a PNP Transistor, a thin N-type base is sandwiched between two P-type layers (majority carriers: holes; emitter arrow points IN). (ii) Biasing of NPN & PNP: For linear amplification (Active Region), the Emitter-Base (E-B) junction is always Forward Biased and the Collector-Base (C-B) junction is always Reverse Biased. Both junctions Forward = Saturation (ON switch); both Reverse = Cutoff (OFF switch).',
    bnSummary: 'বাইপোলার জাংশন ট্রানজিস্টর (BJT) হলো তিনটি প্রান্ত (Emitter, Base, Collector) এবং দুটি P-N জাংশন বিশিষ্ট একটি কারেন্ট-নিয়ন্ত্রিত অর্ধপরিবাহী ডিভাইস, যা দুর্বল সিগন্যালকে বিবর্ধিত (Amplify) করতে এবং ইলেকট্রনিক সুইচ হিসেবে ব্যবহৃত হয়। (i) NPN ও PNP সংজ্ঞা: দুটি N-টাইপ অঞ্চলের মাঝখানে একটি অত্যন্ত পাতলা P-টাইপ অঞ্চল স্থাপন করলে NPN ট্রানজিস্টর গঠিত হয় (প্রতীকে এমিটারের তীর চিহ্ন বাইরের দিকে থাকে)। আর দুটি P-টাইপ অঞ্চলের মাঝখানে একটি পাতলা N-টাইপ অঞ্চল স্থাপন করলে PNP ট্রানজিস্টর গঠিত হয় (তীর চিহ্ন ভেতরের দিকে থাকে)। (ii) বায়াসিং (Biasing): অ্যামপ্লিফায়ার হিসেবে (Active Region-এ) কাজ করার জন্য যেকোনো ট্রানজিস্টরের Emitter-Base (EB) জাংশনকে সর্বদা ফরোয়ার্ড বায়াস এবং Collector-Base (CB) জাংশনকে সর্বদা রিভার্স বায়াস করতে হয়।',
    keyPoints: [
      'Doping & Width Rule: Emitter = Heavily Doped (medium width); Base = Lightly Doped (ultra-thin); Collector = Moderately Doped (widest area).',
      'Active Mode Biasing: Emitter-Base (EB) Junction = Forward Bias; Collector-Base (CB) Junction = Reverse Bias.',
      'NPN Biasing Voltages: V_C > V_B > V_E (with V_BE ≈ +0.7 V); PNP Biasing Voltages: V_E > V_B > V_C (with V_EB ≈ +0.7 V).'
    ],
    quiz: {
      q: 'To operate a BJT (either NPN or PNP) as a linear amplifier in the Active Region, how must its two junctions be biased?',
      options: [
        'Both EB and CB junctions Forward Biased',
        'Emitter-Base Forward Biased and Collector-Base Reverse Biased',
        'Emitter-Base Reverse Biased and Collector-Base Forward Biased',
        'Both EB and CB junctions Reverse Biased'
      ],
      ans: 1
    }
  },
  {
    id: '17',
    num: '17',
    module: 'rectifiers',
    simType: 'rectifier_lab',
    simPreset: { mode: 'hwr' },
    titleEn: 'Half-Wave Rectifier: (i) AC vs DC, (ii) Voltage Divider, (iii) HWR Circuit, (iv) +/- Half-Cycles',
    titleBn: 'হাফ-ওয়েভ রেক্টিফায়ার: (i) AC ও DC আচরণ, (ii) ভোল্টেজ ডিভাইডার, (iii) সার্কিট, (iv) ধনাত্মক ও ঋণাত্মক অর্ধচক্র',
    badge: '4-in-1 Topic 17',
    formula: 'V_{dc} = \\frac{V_m}{\\pi} \\approx 0.318\\, V_m, \\quad V_x = E \\cdot \\frac{R_x}{R_{\\text{total}}}',
    enSummary: '(i) Behavior of AC & DC Voltage: Alternating Current (AC) voltage periodically reverses its polarity and magnitude over time following a sine wave v(t) = V_m sin(ωt), averaging zero over a full cycle. Direct Current (DC) voltage maintains a constant, unidirectional polarity over time. (ii) Voltage Divider Rule (VDR): In a series resistive circuit connected across source voltage E, the voltage dropped across any individual resistor R_x equals the total voltage multiplied by that resistance divided by the total series resistance: V_x = E · R_x / (R_1 + R_2 + ... + R_n). (iii) Half-Wave Rectifier Circuit: Uses a single PN diode in series with an AC source and load resistor R_L to convert bidirectional AC into unidirectional pulsating DC with average value V_dc = 0.318(V_m - V_K). (iv) Positive & Negative Half-Cycle Diagrams: During the Positive Half-Cycle (0 to π), the diode is Forward Biased (acts as a closed switch), passing current through R_L. During the Negative Half-Cycle (π to 2π), the diode is Reverse Biased (acts as an open switch), blocking current so V_out = 0 V.',
    bnSummary: '(i) AC ও DC ভোল্টেজের আচরণ: সময়ের সাথে সাথে যে ভোল্টেজের মান ও দিক উভয়ই পর্যায়ক্রমে পরিবর্তিত হয় তাকে AC ভোল্টেজ বলে (v = V_m sin ωt), আর যে ভোল্টেজের দিক সর্বদা অপরিবর্তিত থাকে তাকে DC ভোল্টেজ বলে। (ii) ভোল্টেজ ডিভাইডার রুল (VDR): শ্রেণি (Series) সমবায়ে যুক্ত একাধিক রোধের কোনো একটি রোধের দুই প্রান্তের ভোল্টেজ ড্রপ (V_x) হবে মোট প্রযুক্ত ভোল্টেজ (E) ও ওই রোধের (R_x) গুণফলকে মোট শ্রেণি রোধ (R_1 + R_2) দিয়ে ভাগ করার সমান: V_x = E × R_x / (R_1 + R_2)। (iii) হাফ-ওয়েভ রেক্টিফায়ার: এতে মাত্র ১টি ডায়োড ব্যবহার করে পূর্ণ AC সাইকেলের কেবল অর্ধেক অংশকে একমুখী পালসেটিং DC-তে রূপান্তরিত করা হয় (গড় V_dc = 0.318 V_m)। (iv) ধনাত্মক ও ঋণাত্মক অর্ধচক্র: ধনাত্মক অর্ধচক্রে (0–π) ডায়োড ফরোয়ার্ড বায়াস পেয়ে শর্ট সার্কিটের মতো কারেন্ট পরিবহন করে; ঋণাত্মক অর্ধচক্রে (π–2π) ডায়োড রিভার্স বায়াস পেয়ে ওপেন সার্কিট হয়ে যায়, ফলে আউটপুট ভোল্টেজ শূন্য (0V) হয়।',
    keyPoints: [
      '(i) AC reverses polarity f times per second (50/60 Hz); DC flows strictly in one direction.',
      '(ii) Voltage Divider Formula: V_1 = E · R_1 / (R_1 + R_2) and V_2 = E · R_2 / (R_1 + R_2).',
      '(iii & iv) HWR conducts only in the Positive Half-Cycle (0→π); blocks in Negative Half-Cycle (π→2π); V_dc = 0.318 V_m, Efficiency η = 40.6%, PIV = V_m.'
    ],
    quiz: {
      q: 'What is the average DC output voltage (V_dc) of an ideal Half-Wave Rectifier with peak input voltage V_m?',
      options: ['V_dc = 0.636 V_m', 'V_dc = 0.318 V_m', 'V_dc = 0.707 V_m', 'V_dc = V_m'],
      ans: 1
    }
  },
  {
    id: '18',
    num: '18',
    module: 'rectifiers',
    simType: 'rectifier_lab',
    simPreset: { mode: 'fwr_ct' },
    titleEn: 'Full-Wave Rectifier (Center-Tapped & General Operation)',
    titleBn: 'ফুল-ওয়েভ রেক্টিফায়ার (Full-Wave Rectifier)-এর কার্যপ্রণালী',
    badge: 'V_dc = 0.636 V_m',
    formula: 'V_{dc} = \\frac{2 V_m}{\\pi} \\approx 0.636\\, V_m, \\quad f_{out} = 2 f_{in}, \\quad \\eta = 81.2\\%',
    enSummary: 'A Full-Wave Rectifier converts both the positive and negative half-cycles of an alternating AC input waveform into unidirectional pulsating DC across the load resistor R_L, doubling the DC output voltage and rectification efficiency compared to a half-wave rectifier. In a Center-Tapped Full-Wave Rectifier, a center-tapped transformer feeds two diodes (D1 and D2) whose cathodes tie together at the load R_L returning to the grounded center tap (CT). During the positive half-cycle (0 to π), the top secondary terminal is positive, making D1 forward-biased (conducting) and D2 reverse-biased (OFF). During the negative half-cycle (π to 2π), the bottom secondary terminal becomes positive, making D2 forward-biased (conducting) and D1 OFF. In both half-cycles, current flows through R_L in the exact same direction, yielding V_dc = 0.636 V_m.',
    bnSummary: 'যে রেক্টিফায়ার সার্কিট ইনপুট AC সিগন্যালের ধনাত্মক এবং ঋণাত্মক উভয় অর্ধচক্রকেই একমুখী পালসেটিং DC ভোল্টেজে রূপান্তরিত করে, তাকে ফুল-ওয়েভ রেক্টিফায়ার বলে। সেন্টার-ট্যাপড (Center-Tapped) ফুল-ওয়েভ রেক্টিফায়ারে একটি সেন্টার-ট্যাপ ট্রান্সফরমার এবং দুটি ডায়োড (D1 ও D2) ব্যবহৃত হয়। ধনাত্মক অর্ধচক্রে D1 ফরোয়ার্ড বায়াস পেয়ে চালু থাকে ও D2 বন্ধ থাকে; আবার ঋণাত্মক অর্ধচক্রে D2 ফরোয়ার্ড বায়াস পেয়ে চালু হয় ও D1 বন্ধ থাকে। উভয় অর্ধচক্রেই লোড রোধের (R_L) মধ্য দিয়ে একই দিকে কারেন্ট প্রবাহিত হয়। এর গড় DC ভোল্টেজ V_dc = 0.636 V_m এবং দক্ষতা ৮১.২%।',
    keyPoints: [
      'Utilizes both positive and negative half-cycles of the input AC wave.',
      'Average DC voltage doubles: V_dc = 2 V_m / π = 0.636 V_m (or 0.636(V_m - V_K) for Center-Tapped).',
      'Output ripple frequency is twice the input AC frequency (f_out = 2 f_in = 100 Hz for 50 Hz AC); max efficiency η = 81.2%.'
    ],
    quiz: {
      q: 'Compared to a Half-Wave Rectifier, how does the average DC output voltage of an ideal Full-Wave Rectifier change for the same peak secondary voltage V_m?',
      options: ['It stays at 0.318 V_m', 'It doubles to 0.636 V_m', 'It drops to zero', 'It becomes AC'],
      ans: 1
    }
  },
  {
    id: '20a',
    num: '19/20',
    module: 'rectifiers',
    simType: 'rectifier_lab',
    simPreset: { mode: 'bridge' },
    titleEn: '(i) Bridge Rectifier & (ii) Clipper and Clamper Circuits',
    titleBn: '(i) ব্রিজ রেক্টিফায়ার এবং (ii) ক্লিপার ও ক্ল্যাম্পার সার্কিট',
    badge: 'Bridge + Wave Shapers',
    formula: 'V_{dc} = 0.636\\,(V_m - 2V_K) \\ \\Big| \\ \\text{Clipper: Limits } V \\ \\Big| \\ \\text{Clamper: Shifts DC}',
    enSummary: '(i) Bridge Full-Wave Rectifier: Uses four diodes (D1, D2, D3, D4) arranged in a closed bridge configuration across a standard two-wire transformer secondary—eliminating the bulky center-tapped transformer. During the Positive Half-Cycle (0 to π), diodes D1 and D2 are forward-biased in series with R_L while D3 and D4 are reverse-biased. During the Negative Half-Cycle (π to 2π), diodes D3 and D4 are forward-biased while D1 and D2 are OFF. Both pairs route current in the same direction through R_L, yielding V_dc = 0.636(V_m - 2V_K) and PIV = V_m. (ii) Clipper & Clamper Definitions: A Clipper (Limiter) is a diode wave-shaping network (diode + resistor + optional DC reference) that removes or "clips" a portion of an input AC signal above or below a specified voltage level without distorting the remaining waveform. A Clamper (DC Restorer) is a network containing a diode, a capacitor, and a resistor that shifts ("clamps") an entire AC waveform vertically to a different DC voltage level without changing its peak-to-peak amplitude (2V_m).',
    bnSummary: '(i) ব্রিজ রেক্টিফায়ার (Bridge Rectifier): এতে সেন্টার-ট্যাপ ট্রান্সফরমার ছাড়াই ৪টি ডায়োডকে (D1, D2, D3, D4) ব্রিজের আকারে যুক্ত করে ফুল-ওয়েভ রেক্টিফিকেশন করা হয়। ধনাত্মক অর্ধচক্রে D1 ও D2 একসাথে ফরোয়ার্ড বায়াস পেয়ে কারেন্ট পরিবহন করে (D3, D4 বন্ধ থাকে)। ঋণাত্মক অর্ধচক্রে D3 ও D4 ফরোয়ার্ড বায়াস পেয়ে একই দিকে লোডে (R_L) কারেন্ট পাঠায় (D1, D2 বন্ধ থাকে)। এর আউটপুট V_dc = 0.636(V_m - 2V_K)। (ii) ক্লিপার ও ক্ল্যাম্পার সার্কিট: ক্লিপার (Clipper Circuit) হলো এমন একটি ডায়োড ও রোধের সার্কিট যা ইনপুট AC ওয়েভফর্মের নির্দিষ্ট ভোল্টেজ সীমার ওপরে বা নিচের অংশ কেটে বাদ দেয় (Clip করে)। আর ক্ল্যাম্পার (Clamper Circuit) হলো ডায়োড, ক্যাপাসিটর ও রোধের তৈরি এমন একটি সার্কিট যা ইনপুট AC সিগন্যালের আকৃতি বা পিক-টু-পিক মান (2V_m) পরিবর্তন না করে সম্পূর্ণ ওয়েভফর্মটিকে একটি নির্দিষ্ট DC লেভেলে ওপরে বা নিচে স্থানান্তর (Shift) করে।',
    keyPoints: [
      '(i) Bridge Rectifier: 4 diodes, no center tap needed; D1+D2 conduct in + half-cycle, D3+D4 conduct in - half-cycle; V_dc = 0.636(V_m - 1.4V).',
      '(ii) Clipper Circuit (Diode + R): Slices off positive or negative peaks of an AC signal (used for overvoltage protection & wave shaping).',
      '(ii) Clamper Circuit (Diode + C + R): Adds a DC offset to shift the entire waveform up (Positive Clamper) or down (Negative Clamper).'
    ],
    quiz: {
      q: 'Which reactive energy-storage component is essential in a Clamper circuit to shift the DC level of a waveform, but absent in a Clipper circuit?',
      options: ['A Transformer', 'A Capacitor (C)', 'A Zener Diode', 'An LED'],
      ans: 1
    }
  },
  {
    id: '19b',
    num: '19 (BJT)',
    module: 'bjt',
    simType: 'bjt_lab',
    simPreset: { tab: 'ce_op' },
    titleEn: 'Operation of Common-Emitter (CE) NPN Transistor',
    titleBn: 'কমন-এমিটার (Common-Emitter) NPN ট্রানজিস্টরের কার্যপ্রণালী',
    badge: 'CE Amplifier',
    formula: 'I_E = I_C + I_B, \\quad I_C = \\beta I_B, \\quad V_{CE} = V_{CC} - I_C R_C, \\quad \\Delta\\theta = 180^\\circ',
    enSummary: 'In a Common-Emitter (CE) NPN transistor configuration, the Emitter terminal is grounded and shared (common) between the input Base-Emitter loop and the output Collector-Emitter loop. To operate in the active region, the Base-Emitter junction is forward-biased by V_BB (exceeding 0.7 V) and the Collector-Emitter loop is reverse-biased by a higher supply V_CC through load resistor R_C. Operation step-by-step: (1) Carrier Injection: The heavily doped N-type Emitter injects a massive flood of free electrons across the forward-biased EB junction into the P-type Base. (2) Thin Base Passage: Because the P-type Base is extremely thin and lightly doped, less than 1–2% of electrons recombine with holes to form the tiny Base current (I_B). (3) Collector Sweep & Gain: Over 98–99% of injected electrons diffuse into the reverse-biased CB depletion field and are swept into the Collector by +V_CC, forming a large Collector current I_C = β · I_B. A tiny AC change in I_B produces a huge amplified voltage swing across R_C with a 180° phase inversion.',
    bnSummary: 'কমন-এমিটার (Common-Emitter) NPN সংযোগে এমিটার (Emitter) প্রান্তটি ইনপুট (Base) এবং আউটপুট (Collector) উভয় সার্কিটের জন্য সাধারণ (Common/Grounded) থাকে। এতে Base-Emitter জাংশনে ফরোয়ার্ড বায়াস (V_BB > 0.7V) এবং Collector-Base জাংশনে রিভার্স বায়াস (V_CC) প্রয়োগ করা হয়। কার্যপ্রণালী: (১) ফরোয়ার্ড বায়াসের কারণে উচ্চ ডোপকৃত N-টাইপ এমিটার থেকে প্রচুর মুক্ত ইলেকট্রন বেজ অঞ্চলে প্রবেশ করে (I_E)। (২) P-টাইপ বেজ অত্যন্ত পাতলা ও হালকা ডোপকৃত হওয়ায় মাত্র ১%–২% ইলেকট্রন হোলের সাথে মিলিত হয়ে ক্ষুদ্র বেজ কারেন্ট (I_B) গঠন করে। (৩) বাকি ৯৮%–৯৯% ইলেকট্রন কালেক্টরের ধনাত্মক বিভবের (+V_CC) আকর্ষণে কালেক্টরে চলে যায় এবং শক্তিশালী কালেক্টর কারেন্ট (I_C = β·I_B) তৈরি করে। ফলে ইনপুটে সামান্য বেজ কারেন্ট পরিবর্তন করে আউটপুটে ১৮০° দশাপার্থক্যসহ বিশাল বিবর্ধিত ভোল্টেজ পাওয়া যায়।',
    keyPoints: [
      'Emitter is common to both input (Base-Emitter) and output (Collector-Emitter) loops.',
      'Provides high current gain (β = I_C / I_B ≈ 50–300), high voltage gain (A_v = -R_C / r_e), and highest power gain of all BJT modes.',
      'Produces a 180° phase shift between input AC base voltage and output AC collector voltage.'
    ],
    quiz: {
      q: 'What is the phase relationship between the AC input signal and the amplified AC output voltage in a Common-Emitter NPN amplifier?',
      options: ['0° (In phase)', '90° phase shift', '180° phase inversion (out of phase)', '360° phase shift'],
      ans: 2
    }
  },
  {
    id: '20',
    num: '20',
    module: 'fet',
    simType: 'fet_lab',
    simPreset: { tab: 'tree' },
    titleEn: 'Field Effect Transistor (FET) — Concept & Properties',
    titleBn: 'ফিল্ড ইফেক্ট ট্রানজিস্টর (FET)-এর ধারণা ও বৈশিষ্ট্য',
    badge: 'Voltage Controlled',
    formula: 'I_G \\approx 0\\text{ A}, \\quad R_{in} \\ge 10^9\\,\\Omega, \\quad g_m = \\frac{\\Delta I_D}{\\Delta V_{GS}}',
    enSummary: 'A Field Effect Transistor (FET) is a three-terminal, unipolar, voltage-controlled semiconductor device in which current conduction through a conductive channel between the Source (S) and Drain (D) terminals is controlled by an electric field established by the voltage applied to the Gate (G) terminal (V_GS). It is called "unipolar" because current conduction relies solely on one type of majority carrier—either electrons (in an N-channel FET) or holes (in a P-channel FET)—unlike a BJT, which uses both electrons and holes. Because the Gate is electrically isolated from the channel (either by a reverse-biased PN junction in a JFET or a silicon-dioxide SiO₂ insulating layer in a MOSFET), gate current is virtually zero (I_G ≈ 0 A), giving FETs an extremely high input impedance (10⁹ to 10¹⁴ Ω), low power consumption, and low thermal noise.',
    bnSummary: 'ফিল্ড ইফেক্ট ট্রানজিস্টর (FET) হলো তিনটি প্রান্ত (Source, Drain, Gate) বিশিষ্ট একটি ইউনিপোলার (Unipolar) এবং ভোল্টেজ-নিয়ন্ত্রিত (Voltage-Controlled) অর্ধপরিবাহী ডিভাইস। এতে গেট (Gate) প্রান্তে প্রযুক্ত ভোল্টেজের (V_GS) মাধ্যমে সৃষ্ট বৈদ্যুতিক ক্ষেত্র (Electric Field) দ্বারা সোর্স (Source) থেকে ড্রেইন (Drain)-এ প্রবাহিত চ্যানেল কারেন্ট (I_D) নিয়ন্ত্রণ করা হয়। কেবল এক ধরনের আধান বাহক (N-চ্যানেলে ইলেকট্রন অথবা P-চ্যানেলে হোল) তড়িৎ পরিবহনে অংশ নেয় বলে একে ইউনিপোলার ট্রানজিস্টর বলা হয়। গেটে কোনো কারেন্ট প্রবাহিত হয় না বললেই চলে (I_G ≈ 0), তাই এর ইনপুট রোধ (Input Impedance) অত্যন্ত বেশি।',
    keyPoints: [
      'Three terminals: Source (S — carriers enter), Drain (D — carriers leave), Gate (G — modulates channel conductivity).',
      'Unipolar device: Conduction depends only on majority carriers (electrons in N-channel, holes in P-channel).',
      'Voltage-controlled with ultra-high input impedance (R_in > 100 MΩ) and zero thermal runaway.'
    ],
    quiz: {
      q: 'Why is a Field Effect Transistor (FET) called a "unipolar" device?',
      options: [
        'It has only one terminal',
        'Current conduction involves only one type of majority carrier (either electrons OR holes)',
        'It can only operate at 1 Volt',
        'It only works with AC voltage'
      ],
      ans: 1
    }
  },
  {
    id: '21',
    num: '21',
    module: 'fet',
    simType: 'fet_lab',
    simPreset: { tab: 'tree' },
    titleEn: 'Classification of FET (JFET & MOSFET Taxonomy)',
    titleBn: 'FET-এর শ্রেণিবিভাগ (Classification Tree of FET)',
    badge: 'FET Taxonomy',
    formula: '\\text{FET} \\longrightarrow \\text{JFET (N/P)} \\quad \\& \\quad \\text{MOSFET (D-MOSFET, E-MOSFET)}',
    enSummary: 'Field Effect Transistors (FETs) are classified into two main families based on how the Gate is isolated from the conducting channel: (1) Junction Field Effect Transistor (JFET): The Gate is formed by a reverse-biased PN junction directly on the channel bar. JFETs are subdivided into N-Channel JFET and P-Channel JFET. (2) Metal-Oxide-Semiconductor FET (MOSFET) or Insulated-Gate FET (IGFET): The metal/polysilicon Gate is insulated from the semiconductor channel by a microscopic layer of Silicon Dioxide (SiO₂) glass. MOSFETs are further classified into two operational modes: (a) Depletion-Mode MOSFET (D-MOSFET) (N-channel and P-channel), which has a physically implanted channel at V_GS = 0 V and can operate in both depletion and enhancement modes; and (b) Enhancement-Mode MOSFET (E-MOSFET) (N-channel and P-channel), which has no physical channel at V_GS = 0 V (normally OFF) and requires V_GS to exceed a threshold voltage (V_T) to induce a conducting channel.',
    bnSummary: 'গেট (Gate) এবং চ্যানেলের গঠনের ওপর ভিত্তি করে FET-কে প্রধানত দুই ভাগে ভাগ করা হয়: (১) JFET (Junction Field Effect Transistor): এতে গেট ও চ্যানেলের মধ্যে একটি রিভার্স বায়াসড P-N জাংশন থাকে। এটি দুই প্রকার: N-Channel JFET এবং P-Channel JFET। (২) MOSFET (Metal-Oxide-Semiconductor FET): এতে গেট এবং চ্যানেলের মাঝখানে সিলিকন ডাই-অক্সাইডের (SiO₂) একটি অন্তরক (Insulating) স্তর থাকে। MOSFET আবার দুই প্রকার: (ক) Depletion-type MOSFET (D-MOSFET) (N-channel ও P-channel) এবং (খ) Enhancement-type MOSFET (E-MOSFET) (N-channel ও P-channel)।',
    keyPoints: [
      'Family 1 — JFET (PN-junction isolated gate): N-Channel JFET and P-Channel JFET (always Depletion-mode devices).',
      'Family 2A — Depletion MOSFET (D-MOSFET): Normally ON at V_GS = 0 V; subdivided into N-Channel and P-Channel.',
      'Family 2B — Enhancement MOSFET (E-MOSFET): Normally OFF at V_GS = 0 V (turns ON when |V_GS| > |V_T|); subdivided into N-Channel and P-Channel.'
    ],
    quiz: {
      q: 'Which type of FET is normally OFF at V_GS = 0 V and requires V_GS to exceed a threshold voltage V_T to create a channel?',
      options: ['N-Channel JFET', 'Depletion-Mode MOSFET (D-MOSFET)', 'Enhancement-Mode MOSFET (E-MOSFET)', 'PNP Transistor'],
      ans: 2
    }
  },
  {
    id: '22',
    num: '22',
    module: 'fet',
    simType: 'fet_lab',
    simPreset: { tab: 'tree' },
    titleEn: 'Definition of JFET & MOSFET',
    titleBn: 'JFET এবং MOSFET-এর সংজ্ঞা ও মূল সমীকরণ',
    badge: 'Shockley vs Square-Law',
    formula: '\\text{JFET: } I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2 \\ \\Big| \\ \\text{E-MOSFET: } I_D = k(V_{GS} - V_T)^2',
    enSummary: 'Definition of JFET (Junction Field Effect Transistor): A JFET is a three-terminal unipolar transistor in which the cross-sectional width of a conducting N-type or P-type semiconductor channel is modulated by varying the reverse-bias voltage across a PN-junction Gate (V_GS), obeying Shockley’s equation I_D = I_DSS(1 - V_GS / V_P)². Definition of MOSFET (Metal-Oxide-Semiconductor Field Effect Transistor): A MOSFET is a four-terminal (Source, Drain, Gate, Body/Substrate) unipolar transistor in which the Gate electrode is electrically insulated from the semiconductor channel by a thin Silicon Dioxide (SiO₂) dielectric layer. Capacitive electric field action across the oxide controls channel charge density, yielding ultra-high input resistance (~10¹⁴ Ω) and making MOSFETs the fundamental building block of modern CMOS microprocessors and memory.',
    bnSummary: 'JFET-এর সংজ্ঞা: যে ফিল্ড ইফেক্ট ট্রানজিস্টরে একটি অর্ধপরিবাহী চ্যানেলের দুই পাশে বিপরীত ধর্মী অর্ধপরিবাহী যুক্ত করে P-N জাংশন গেট তৈরি করা হয় এবং গেটে রিভার্স বায়াস ভোল্টেজ (V_GS) পরিবর্তন করে ডিপ্লিশন অঞ্চলের প্রস্থ বাড়িয়ে-কমিয়ে ড্রেইন কারেন্ট (I_D) নিয়ন্ত্রণ করা হয়, তাকে JFET বলে। এর সমীকরণ: I_D = I_DSS(1 - V_GS/V_P)²। MOSFET-এর সংজ্ঞা: যে ফিল্ড ইফেক্ট ট্রানজিস্টরে ধাতব গেট প্রান্তটি অর্ধপরিবাহী চ্যানেল থেকে একটি পাতলা সিলিকন ডাই-অক্সাইড (SiO₂) অন্তরক স্তর দ্বারা পৃথক থাকে এবং ক্যাপাসিটিভ বৈদ্যুতিক ক্ষেত্রের প্রভাবে চ্যানেলের পরিবাহিতা নিয়ন্ত্রিত হয়, তাকে MOSFET বলে।',
    keyPoints: [
      'JFET: Gate is a direct PN junction; always operated with reverse-biased Gate-Source junction; obeys I_D = I_DSS(1 - V_GS/V_P)².',
      'MOSFET: Gate is insulated by SiO₂ oxide layer; zero gate current even for positive or negative V_GS; E-MOSFET obeys I_D = k(V_GS - V_T)².',
      'Input resistance of MOSFET (~10¹²–10¹⁴ Ω) is even higher than JFET (~10⁹ Ω).'
    ],
    quiz: {
      q: 'What insulating material separates the Gate terminal from the channel in a standard silicon MOSFET?',
      options: ['Copper Sulfate', 'Silicon Dioxide (SiO₂)', 'Liquid Mercury', 'Gallium Arsenide'],
      ans: 1
    }
  },
  {
    id: '23',
    num: '23',
    module: 'fet',
    simType: 'fet_lab',
    simPreset: { tab: 'jfet_sim' },
    titleEn: 'Junction Field Effect Transistor (JFET) — Working Principle',
    titleBn: 'জাংশন ফিল্ড ইফেক্ট ট্রানজিস্টর (JFET)-এর কার্যপ্রণালী',
    badge: 'Depletion Wedge',
    formula: 'I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2, \\quad I_G = 0\\text{ A}',
    enSummary: 'A Junction Field Effect Transistor (JFET) acts as a voltage-controlled resistor/current source. In an N-Channel JFET, a positive voltage V_DD is applied to the Drain (D) relative to the Source (S), causing electrons to flow from Source to Drain through the N-type channel. The P-type Gate (G) is reverse-biased by negative voltage V_GS ≤ 0 V. (1) When V_GS = 0 V, the depletion region is minimal and maximum saturation current I_DSS flows once V_DS reaches the pinch-off level |V_P|. (2) As V_GS is made more negative (e.g., -1 V, -2 V), the reverse-biased PN-junction depletion regions expand inward into the channel like a wedge, narrowing the conducting path, increasing channel resistance, and reducing I_D. (3) When V_GS reaches the Pinch-Off Voltage (V_P, e.g., -4 V), the two depletion regions meet and completely close the channel, cutting off drain current to I_D = 0 mA.',
    bnSummary: 'JFET মূলত একটি ভোল্টেজ-নিয়ন্ত্রিত রোধ বা কারেন্ট সোর্স হিসেবে কাজ করে। N-Channel JFET-এ ড্রেইনে (D) সোর্সের (S) সাপেক্ষে ধনাত্মক ভোল্টেজ (V_DS) প্রয়োগ করলে সোর্স থেকে ড্রেইনের দিকে ইলেকট্রন প্রবাহিত হয় (ফলে ড্রেইন কারেন্ট I_D প্রবাহিত হয়)। (১) যখন V_GS = 0V থাকে, তখন চ্যানেল সম্পূর্ণ খোলা থাকে এবং সর্বোচ্চ কারেন্ট (I_DSS) প্রবাহিত হয়। (২) যখন গেটে ঋণাত্মক ভোল্টেজ (V_GS < 0V) বাড়ানো হয়, তখন রিভার্স বায়াসের কারণে ডিপ্লিশন অঞ্চল চ্যানেলের ভেতরে প্রসারিত হয়ে চ্যানেলকে সংকুচিত করে এবং I_D কমে যায়। (৩) V_GS বাড়তে বাড়তে পিঞ্চ-অফ ভোল্টেজে (V_P, যেমন -4V) পৌঁছালে দুই পাশের ডিপ্লিশন স্তর পরস্পরকে স্পর্শ করে চ্যানেল পুরোপুরি বন্ধ করে দেয় এবং I_D = 0 হয়ে যায়।',
    keyPoints: [
      'Maximum Drain Current (I_DSS) occurs when V_GS = 0 V and V_DS ≥ |V_P|.',
      'Depletion region has a wedge shape (wider near the Drain end because reverse bias V_GD > V_GS).',
      'Cutoff occurs when V_GS ≤ V_P (e.g., -4 V), reducing I_D to 0 mA.'
    ],
    quiz: {
      q: 'Under what Gate-to-Source voltage condition does an N-Channel JFET conduct its maximum drain current I_DSS?',
      options: ['V_GS = V_P (-4 V)', 'V_GS = 0 V (with V_DS ≥ |V_P|)', 'V_GS = -10 V', 'V_DS = 0 V'],
      ans: 1
    }
  },
  {
    id: '24',
    num: '24',
    module: 'fet',
    simType: 'fet_lab',
    simPreset: { tab: 'jfet_sim' },
    titleEn: 'JFET Deep Dive: (i) N-Channel Construction, (ii) BJT vs JFET, (iii) Output Characteristics',
    titleBn: '(i) N-Channel JFET-এর গঠন, (ii) BJT ও JFET-এর পার্থক্য, (iii) JFET আউটপুট বৈশিষ্ট্য রেখা',
    badge: '3-in-1 Topic 24',
    formula: '\\text{Ohmic: } V_{DS} < |V_P| - |V_{GS}| \\ \\Big| \\ \\text{Saturation: } I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2',
    enSummary: '(i) Construction of N-Channel JFET: The major part of the structure is a continuous bar of N-type silicon forming the conducting channel, with ohmic contacts at the top end called the Drain (D) and the bottom end called the Source (S). On two opposite sides of the middle of this N-type bar, heavily doped P-type regions (P⁺) are diffused and connected internally together to form the Gate (G) terminal, creating two PN junctions facing each other across the channel. (ii) Differentiation between BJT & JFET: BJT is a bipolar (both electrons & holes), current-controlled device (I_C = β I_B) with low input impedance (1 kΩ–1 MΩ), higher thermal noise, and susceptibility to thermal runaway. JFET is a unipolar (only majority carriers), voltage-controlled device (I_D controlled by V_GS) with very high input impedance (>10⁹ Ω), low noise, and negative temperature coefficient (no thermal runaway). (iii) JFET Output Characteristics with External Bias: Plotting I_D versus V_DS for various external gate biases (V_GS = 0V, -1V, -2V, -3V, -4V) reveals four regions: (a) Ohmic/Linear Region (small V_DS: channel acts as a voltage-controlled resistor), (b) Pinch-Off / Active Saturation Region (V_DS ≥ |V_P| - |V_GS|: I_D becomes flat and constant according to Shockley’s equation), (c) Cutoff Region (V_GS ≤ V_P: I_D = 0), and (d) Breakdown Region (excessive V_DS causes avalanche breakdown).',
    bnSummary: '(i) N-Channel JFET-এর গঠন: একটি N-টাইপ সিলিকন দণ্ডের (Bar) দুই প্রান্তে ওহমিক সংযোগ দিয়ে ওপরের প্রান্তকে ড্রেইন (Drain - D) এবং নিচের প্রান্তকে সোর্স (Source - S) করা হয়। দণ্ডটির মাঝখানের দুই বিপরীত পাশে উচ্চ ডোপকৃত দুটি P-টাইপ অঞ্চল স্থাপন করে তাদের একত্রে যুক্ত করে গেট (Gate - G) প্রান্ত বের করা হয়। (ii) BJT ও JFET-এর পার্থক্য: BJT হলো বাইপোলার ও কারেন্ট-নিয়ন্ত্রিত ডিভাইস যার ইনপুট রোধ কম; অন্যদিকে JFET হলো ইউনিপোলার ও ভোল্টেজ-নিয়ন্ত্রিত ডিভাইস যার ইনপুট রোধ অত্যন্ত বেশি (~10⁹ Ω) এবং নয়েজ কম। (iii) বাহ্যিক বায়াসসহ JFET-এর আউটপুট বৈশিষ্ট্য রেখা (Output Characteristics): বিভিন্ন স্থির V_GS ভোল্টেজের (যেমন 0V, -1V, -2V, -4V) জন্য V_DS-এর সাপেক্ষে I_D-এর লেখচিত্র আঁকলে তিনটি প্রধান অঞ্চল পাওয়া যায়: (ক) ওহমিক অঞ্চল (Ohmic Region - যেখানে V_DS বাড়ালে I_D রৈখিকভাবে বাড়ে), (খ) পিঞ্চ-অফ বা স্যাচুরেশন অঞ্চল (Active Region - যেখানে V_DS বাড়ালেও I_D স্থির থাকে), এবং (গ) কাট-অফ অঞ্চল (Cutoff - যখন V_GS = V_P হওয়ায় I_D = 0 হয়)।',
    keyPoints: [
      '(i) N-Channel Bar with Source & Drain at ends + two P-type diffused Gate regions on opposite sides.',
      '(ii) BJT = Bipolar, Current-controlled (I_B), Low R_in | JFET = Unipolar, Voltage-controlled (V_GS), Very High R_in (>100 MΩ).',
      '(iii) Output curve family shows Locus of Pinch-Off (V_DS = |V_P| - |V_GS|) separating Ohmic region from Constant-Current Saturation region.'
    ],
    quiz: {
      q: 'In the JFET Output Characteristic curve (I_D vs V_DS), what is the region called where V_DS is small and the JFET behaves like a voltage-controlled resistor?',
      options: ['Breakdown Region', 'Ohmic (Linear) Region', 'Cutoff Region', 'Avalanche Region'],
      ans: 1
    }
  }
];
