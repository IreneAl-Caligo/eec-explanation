// Comprehensive Inspector Database for all components, terminals, and physics terms
// Boylestad 11th Edition aligned with precise English definitions and easy Bangla explanations

export const INSPECTOR_DATABASE = {
  // --- SEMICONDUCTOR COMPONENTS ---
  si_diode: {
    id: 'si_diode',
    name: 'Silicon PN Junction Diode (1N4007)',
    category: 'Semiconductor Rectifier Diode',
    symbol: '▶️| (Anode ➔ Cathode)',
    formula: 'I_D = I_S (e^{V_D / n V_T} - 1),  V_T ≈ 26 mV at 300 K',
    definitionEn: 'A two-terminal semiconductor device formed by joining P-type and N-type silicon crystal, permitting substantial electric current flow in forward bias (Anode positive relative to Cathode) while rigidly blocking current in reverse bias.',
    definitionBn: 'সিলিকন পি-এন জংশন ডায়োড হলো P-টাইপ এবং N-টাইপ সিলিকন যুক্ত করে তৈরি একটি দুই-প্রান্তবিশিষ্ট সেমিকন্ডাক্টর ডিভাইস, যা ফরোয়ার্ড বায়াসে বিদ্যুৎ প্রবাহিত হতে দেয় এবং রিভার্স বায়াসে বিদ্যুৎ প্রবাহে সম্পূর্ণ বাধা সৃষ্টি করে।',
    physicsEn: 'When forward biased beyond the knee voltage (Vk ≈ 0.7 V), the external electric field collapses the internal space-charge depletion barrier, allowing majority carriers (electrons from N-side and holes from P-side) to diffuse heavily across the junction. In reverse bias, the field widens the depletion layer, restricting current to a negligible minority saturation leakage current Is (~10 pA).',
    physicsBn: 'ফরোয়ার্ড বায়াসে ভোল্টেজ Knee ভোল্টেজ (~০.৭ ভোল্ট) অতিক্রম করলে অভ্যন্তরীণ ডিপ্লিশন স্তরের বাধা ভেঙে যায় এবং মেজরিটি ক্যারিয়ারগুলো অবাধে জংশন অতিক্রম করে। রিভার্স বায়াসে ডিপ্লিশন স্তর আরও চওড়া হয়, ফলে শুধুমাত্র অতি ক্ষুদ্র মাইনরিটি লিকেজ কারেন্ট (Is ~ ১০ পিকোঅ্যাম্পিয়ার) প্রবাহিত হয়।',
    specs: [
      { label: 'Knee / Barrier Voltage (Vk)', value: '0.7 V (Silicon at 25°C)' },
      { label: 'Reverse Saturation Current (Is)', value: '~10 pA to 1 nA' },
      { label: 'Temp Coefficient of Vk', value: '-2 mV / °C' },
      { label: 'Peak Inverse Voltage (PIV)', value: 'Up to 1000 V (1N4007)' }
    ]
  },

  ge_diode: {
    id: 'ge_diode',
    name: 'Germanium Diode (1N34A)',
    category: 'Semiconductor Diode',
    symbol: '▶️| (Low Barrier)',
    formula: 'V_K ≈ 0.3 V,  I_S ≈ 1 µA (Higher Thermal Leakage)',
    definitionEn: 'A PN junction diode fabricated from Germanium (Ge), characterized by a lower threshold barrier voltage (approx 0.3 V) and higher reverse saturation leakage current compared to Silicon.',
    definitionBn: 'জার্মেনিয়াম দিয়ে তৈরি পি-এন জংশন ডায়োড, যার প্রধান বৈশিষ্ট্য হলো এর লোয়ার নি-ভোল্টেজ বা বেরিয়ার ভোল্টেজ মাত্র ০.৩ ভোল্ট, তবে সিলিকনের তুলনায় এর রিভার্স লিকেজ কারেন্ট বেশি।',
    physicsEn: 'Germanium has a smaller energy bandgap (Eg ≈ 0.67 eV compared to 1.12 eV for Si). Consequently, covalent bonds break at lower thermal energy, yielding an earlier forward conduction threshold (~0.3 V) at the cost of significantly higher reverse leakage current (Is ~ 1 µA) that doubles approximately every 10°C.',
    physicsBn: 'জার্মেনিয়ামের ব্যান্ডগ্যাপ কম (০.৬৭ ইলেকট্রন-ভোল্ট), তাই এটি খুব অল্প ভোল্টেজেই (০.৩V) চালু হয়ে যায়। এটি রেডিও ডিটেক্টর ও হাই-ফ্রিকোয়েন্সি সিগন্যাল ডিটেকশনে ব্যবহৃত হয়।',
    specs: [
      { label: 'Knee Voltage (Vk)', value: '0.3 V (Germanium)' },
      { label: 'Bandgap Energy (Eg)', value: '0.67 eV' },
      { label: 'Reverse Leakage Current', value: '~1 µA to 10 µA' },
      { label: 'Max Operating Temp', value: '~75°C to 100°C' }
    ]
  },

  schottky: {
    id: 'schottky',
    name: 'Schottky Barrier Diode (BAT85)',
    category: 'Metal-Semiconductor Diode',
    symbol: '⚡| (Metal-Silicon)',
    formula: 'V_K ≈ 0.15 V – 0.25 V,  t_{rr} ≈ 0 ns (Majority Carrier Only)',
    definitionEn: 'A high-speed semiconductor diode formed by joining a metal (such as platinum, tungsten, or gold) directly to an N-type semiconductor, eliminating minority carrier storage delay.',
    definitionBn: 'ধাতু (যেমন প্লাটিনাম বা গোল্ড) এবং N-টাইপ সেমিকন্ডাক্টরের সরাসরি সংযোগে তৈরি অত্যন্ত দ্রুতগতির ডায়োড, যার রিভার্স রিকভারি টাইম প্রায় শূন্য।',
    physicsEn: 'Because electrons diffuse from N-type silicon into the metal without minority carrier injection into the bulk, there is zero minority charge storage. When switched from forward to reverse bias, conduction halts instantaneously (sub-nanosecond switching), with a low forward drop of ~0.2 V.',
    physicsBn: 'এতে কোনো মাইনরিটি ক্যারিয়ার জমা হয় না বলে ফরোয়ার্ড থেকে রিভার্সে অতি দ্রুত সুইচ করতে পারে। হাই-স্পিড কম্পিউটার ক্লক সার্কিট ও এসএমপিএস পাওয়ার সাপ্লাইয়ে ব্যবহৃত হয়।',
    specs: [
      { label: 'Forward Drop (Vf)', value: '0.15 V – 0.3 V' },
      { label: 'Reverse Recovery Time (trr)', value: '< 1 ns (Virtually instantaneous)' },
      { label: 'Junction Type', value: 'Metal-to-Semiconductor' }
    ]
  },

  zener: {
    id: 'zener',
    name: 'Zener Diode (BZX55 / 1N4736A)',
    category: 'Voltage Regulator Diode',
    symbol: 'Z| (Reverse Clamping)',
    formula: 'V_L = V_Z (In Reverse Breakdown, for V_{in} > V_Z)',
    definitionEn: 'A heavily doped Silicon PN junction diode specifically designed and fabricated to operate reliably in its reverse avalanche or zener breakdown region, maintaining an essentially constant voltage across its terminals despite wide fluctuations in supply voltage or load current.',
    definitionBn: 'উচ্চ ডোপিংযুক্ত বিশেষ সিলিকন পি-এন জংশন ডায়োড, যা রিভার্স ব্রেকডাউন অঞ্চলে অক্ষত অবস্থায় বিদ্যুৎ পরিবহন করে এবং এর দুই প্রান্তের ভোল্টেজকে নির্দিষ্ট জেনার ভোল্টেজে (Vz) স্থির বা রেগুলেট রাখে।',
    physicsEn: 'In heavy doping (thin depletion layer < 10 nm), high reverse voltage creates an intense electric field (> 3×10^5 V/cm) that directly tears valence electrons out of covalent bonds via quantum-mechanical tunneling (Zener Breakdown). For Vz > 5.6 V, avalanche multiplication of accelerated carriers dominates. In both cases, dynamic resistance rz drops to near zero, rigidly clamping VL = Vz.',
    physicsBn: 'তীব্র বিপরীত ভোল্টেজের কারণে ডিপ্লিশন অঞ্চলে কোয়ান্টাম টানেলিং বা অ্যাভালাঞ্চ মাল্টিপ্লিকেশন ঘটে, ফলে রোধ প্রায় শূন্য হয়ে যায় এবং অতিরিক্ত কারেন্ট জেনারের মধ্য দিয়ে মাটিতে নেমে গিয়ে লোডের ভোল্টেজকে স্থির রাখে।',
    specs: [
      { label: 'Nominal Zener Voltage (Vz)', value: '6.8 V (Selectable: 3.3V – 24V)' },
      { label: 'Breakdown Mechanism', value: 'Quantum Tunneling (<5V) & Avalanche (>6V)' },
      { label: 'Dynamic Impedance (Zz)', value: '5 Ω – 20 Ω' },
      { label: 'Primary Application', value: 'DC Shunt Voltage Regulation & Clamping' }
    ]
  },

  led: {
    id: 'led',
    name: 'Light Emitting Diode (LED)',
    category: 'Optoelectronic Semiconductor',
    symbol: '💡 (Electroluminescent Diode)',
    formula: 'E_g = h \nu = \frac{hc}{\lambda},   \lambda = \frac{1240}{E_g \text{ (eV)}} \text{ nm}',
    definitionEn: 'A heavily doped direct-bandgap PN junction semiconductor diode that emits visible or infrared light photons via electroluminescence when forward biased by an external electric current.',
    definitionBn: 'সরাসরি ব্যান্ডগ্যাপযুক্ত (Direct Bandgap) অর্ধপরিবাহী দিয়ে তৈরি পি-এন জংশন ডায়োড, যা ফরোয়ার্ড বায়াসে বিদ্যুৎ প্রয়োগ করলে ইলেকট্রন ও হোলের পুনর্মিলনের মাধ্যমে ফোটন বা আলো নির্গমন করে।',
    physicsEn: 'Under forward bias, injected electrons from the N-region recombine with holes from the P-region at the direct bandgap junction. Because momentum k-vectors align directly (k_conduction = k_valence), the energy difference Eg is released as a photon of light rather than phonon lattice heat.',
    physicsBn: 'ফরোয়ার্ড বায়াসে ইলেকট্রন ও হোল জংশনে মিলিত হওয়ার সময় তাদের মধ্যকার শক্তির পার্থক্যটি তাপের বদলে সরাসরি আলো (ফোটন) হিসেবে বাইরে বেরিয়ে আসে।',
    specs: [
      { label: 'Red LED (GaAsP)', value: 'Vf ≈ 1.8 V, λ ≈ 650 nm, Eg ≈ 1.91 eV' },
      { label: 'Green LED (GaP)', value: 'Vf ≈ 2.2 V, λ ≈ 565 nm, Eg ≈ 2.21 eV' },
      { label: 'Blue LED (InGaN)', value: 'Vf ≈ 3.1 V, λ ≈ 470 nm, Eg ≈ 2.64 eV' },
      { label: 'Current Rating', value: '10 mA to 30 mA (Requires Series Resistor Rs)' }
    ]
  },

  resistor: {
    id: 'resistor',
    name: 'Resistor (Ohmic Circuit Component)',
    category: 'Passive Linear Element',
    symbol: '⟿ (Ohmic Resistance)',
    formula: 'V = I \cdot R,   P = I^2 R = \frac{V^2}{R}',
    definitionEn: 'A passive two-terminal electrical component that implements electrical resistance as a circuit element, opposing the flow of electric current and producing a voltage drop proportional to current.',
    definitionBn: 'একটি প্যাসিভ ইলেকট্রিক্যাল কম্পোনেন্ট যা বর্তনীতে বিদ্যুৎ প্রবাহে বাধা সৃষ্টি করে এবং ওহমের সূত্র অনুযায়ী বিভব পার্থক্য বা ভোল্টেজ ড্রপ তৈরি করে।',
    physicsEn: 'Free conducting electrons experience inelastic collisions with the vibrating crystal lattice ions, dissipating electrical kinetic energy into thermal energy (Joule heating). In series with diodes, it limits maximum current to prevent thermal burnout.',
    physicsBn: 'ইলেকট্রন যখন পরিবাহীর মধ্য দিয়ে চলে, তখন এটি পরমাণুর সাথে ধাক্কা খেয়ে শক্তি অপচয় করে তাপ তৈরি করে। ডায়োডের সিরিজে এটি ব্যবহার করে নিরাপদ মাত্রায় কারেন্ট রাখা হয়।',
    specs: [
      { label: 'Series Role (Rs)', value: 'Current limiter protecting semiconductors' },
      { label: 'Load Role (RL)', value: 'Receiving terminal consuming power' }
    ]
  },

  capacitor: {
    id: 'capacitor',
    name: 'Smoothing Filter Capacitor (C)',
    category: 'Passive Reactive Storage',
    symbol: '⏚_|| (Electrostatic Charge Storage)',
    formula: 'V_{ripple} \approx \frac{V_{peak}}{2 f R_L C},   r = \frac{V_{r(rms)}}{V_{dc}}',
    definitionEn: 'A passive two-terminal electrical component consisting of two conducting plates separated by a dielectric insulator, capable of storing electrical charge and smoothing out pulsating DC voltages in power supplies.',
    definitionBn: 'দুটি পরিবাহী পাতের মাঝে ডাই-ইলেকট্রিক অন্তরক দিয়ে তৈরি প্যাসিভ কম্পোনেন্ট, যা আধান সঞ্চয় করে রেক্টিফায়ারের পালসেটিং এসি আউটপুটকে মসৃণ ডিসি (DC) ভোল্টেজে রূপান্তর করে।',
    physicsEn: 'During rectifier peak conduction, the capacitor rapidly charges to Vpeak - Vk. When the AC input drops below the capacitor voltage, diodes turn off, and the capacitor slowly discharges its stored charge through the load resistor with time constant tau = RL * C, dramatically reducing output ripple.',
    physicsBn: 'এসি পিক ভোল্টেজের সময় ক্যাপাসিটর দ্রুত ফুল চার্জ হয়। যখন এসি ভোল্টেজ কমে যায়, ক্যাপাসিটর লোডের মধ্যে ধীরে ধীরে চার্জ ছেড়ে দিয়ে ভোল্টেজকে নিচে নামতে দেয় না।',
    specs: [
      { label: 'Capacitance Value', value: '10 µF to 1000 µF (Electrolytic)' },
      { label: 'Time Constant', value: 'τ = RL · C' },
      { label: 'Ripple Reduction', value: 'Higher C yields smaller ripple factor' }
    ]
  },

  bjt: {
    id: 'bjt',
    name: 'BJT Transistor (Bipolar Junction Transistor - NPN)',
    category: 'Active Amplifying & Switching Device',
    symbol: 'B-C-E (Current-Controlled)',
    formula: 'I_E = I_B + I_C,   I_C = \beta I_B,   V_{CE} = V_{CC} - I_C R_C',
    definitionEn: 'A three-terminal semiconductor device consisting of two back-to-back PN junctions (Emitter-Base and Base-Collector) in an NPN or PNP sandwich configuration, where a small input base current controls a much larger collector current.',
    definitionBn: 'একটি তিন প্রান্তবিশিষ্ট (Emitter, Base, Collector) সেমিকন্ডাক্টর ডিভাইস, যেখানে বেসে সামান্য কারেন্ট (Ib) নিয়ন্ত্রণ করে কালেক্টরে বহুগুণ বেশি কারেন্ট (Ic) নিয়ন্ত্রণ করা যায়।',
    physicsEn: 'In an NPN transistor in forward-active mode, the forward-biased Emitter-Base junction injects electrons heavily into the extremely thin, lightly doped Base layer. Because the Base is so narrow, over 99% of these electrons diffuse across without recombining and are swept into the Collector by the reverse-biased Collector-Base field.',
    physicsBn: 'ফরোয়ার্ড বায়াসড এমিটার থেকে প্রচুর ইলেকট্রন হালকা ডোপকৃত পাতলা বেসে প্রবেশ করে। বেস খুব পাতলা হওয়ায় ৯৯% ইলেকট্রনই কালেক্টরের রিভার্স বায়াসের টানে কালেক্টরে চলে যায়।',
    specs: [
      { label: 'Current Gain (β / hFE)', value: '50 to 300' },
      { label: 'Input Impedance', value: '1 kΩ to 10 kΩ (Relatively low)' },
      { label: 'Phase Shift (CE Mode)', value: '180° inverted output voltage' },
      { label: 'Operating Modes', value: 'Cutoff, Active Linear, Saturation' }
    ]
  },

  jfet: {
    id: 'jfet',
    name: 'JFET (Junction Field Effect Transistor - N-Channel)',
    category: 'Unipolar Voltage-Controlled Device',
    symbol: 'G-D-S (Voltage-Controlled)',
    formula: 'I_D = I_{DSS} \left(1 - \frac{V_{GS}}{V_P}\right)^2   \text{for } V_{DS} \ge |V_P| - |V_{GS}|',
    definitionEn: 'A three-terminal unipolar semiconductor device in which electric current flowing through a continuous conducting channel between Drain and Source is regulated by the electrostatic field of a reverse-biased Gate PN junction.',
    definitionBn: 'একটি তিন প্রান্তবিশিষ্ট (Drain, Source, Gate) ইউনিপোলার ডিভাইস, যেখানে রিভার্স বায়াসড গেট ভোল্টেজ (Vgs) এর মাধ্যমে ড্রেইন ও সোর্সের মধ্যকার চ্যানেলের কারেন্ট নিয়ন্ত্রণ করা হয়।',
    physicsEn: 'Applying a reverse bias VGS widens the depletion regions extending from the P+ gate into the N-channel. This physically narrows the channel cross-section, increasing channel resistance. At pinch-off (VDS >= |VP| - |VGS|), the depletion regions touch, forcing ID to saturate at a constant value governed by Shockley’s equation.',
    physicsBn: 'গেটে নেগেটিভ ভোল্টেজ প্রয়োগ করলে ডিপ্লিশন স্তর চওড়া হয়ে চ্যানেল চেপে ধরে। পিঞ্চ-অফ ভোল্টেজে চ্যানেল সম্পূর্ণ সংকুচিত হয়ে কারেন্ট স্থির (স্যাচুরেশন) হয়ে যায়।',
    specs: [
      { label: 'Input Impedance (Rin)', value: '> 100 MΩ to 10^9 Ω (Extremely High)' },
      { label: 'Carrier Type', value: 'Unipolar (Majority carriers only)' },
      { label: 'Pinch-Off Voltage (Vp)', value: '-4 V (Typical N-channel)' },
      { label: 'Drain Saturation Current (Idss)', value: '8 mA to 15 mA' }
    ]
  },

  dc_source: {
    id: 'dc_source',
    name: 'DC Voltage Power Supply',
    category: 'Electrical Power Source',
    symbol: '🔋 (Unidirectional EMF)',
    formula: 'V(t) = V_{dc} = \text{Constant}',
    definitionEn: 'A direct current electrical energy source that maintains a constant electrostatic potential difference and unidirectional polarity across its terminals.',
    definitionBn: 'একটি নির্দিষ্ট ও অপরিবর্তনশীল ডিসি ভোল্টেজ সরবরাহকারী উৎস, যা বর্তনীতে স্থির পোলারিটিতে একমুখী বিদ্যুৎ প্রবাহ বজায় রাখে।',
    physicsEn: 'Chemical or regulated electronic potential pumps charge carriers from low potential to high potential, establishing an electromotive force (EMF) that drives forward or reverse bias across semiconductor junctions.',
    physicsBn: 'এটি চার্জগুলোকে নিম্ন বিভব থেকে উচ্চ বিভবে পাম্প করে সার্কিটে অবিরাম কারেন্ট প্রবাহ নিশ্চিত করে।',
    specs: [
      { label: 'Voltage Range', value: '-25 V to +30 V' },
      { label: 'Polarity', value: 'Unidirectional Constant' }
    ]
  },

  ac_source: {
    id: 'ac_source',
    name: 'AC Sinusoidal Signal Generator',
    category: 'Alternating Voltage Source',
    symbol: '〰️ (v(t) = Vm sin(ωt))',
    formula: 'v(t) = V_m \sin(2\pi f t),   V_{rms} = \frac{V_m}{\sqrt{2}}',
    definitionEn: 'An alternating current signal generator producing a periodically reversing sinusoidal electromotive force with constant amplitude and frequency.',
    definitionBn: 'একটি পরিবর্তী বিদ্যুৎ (AC) উৎস যা সময়ের সাথে সাথে সাইনোসয়ডাল তরঙ্গাকারে এর মান ও দিক পরিবর্তন করে।',
    physicsEn: 'During the positive half-cycle (0 to π), the upper terminal is positive, forward biasing series diodes. During the negative half-cycle (π to 2π), polarity reverses, reverse biasing diodes and blocking conduction (rectification basis).',
    physicsBn: 'পজিটিভ অর্ধচক্রে ডায়োড ফরোয়ার্ড বায়াসড হয়ে অন থাকে, কিন্তু নেগেটিভ অর্ধচক্রে দিক পরিবর্তন হওয়ায় ডায়োড রিভার্স বায়াসড হয়ে অফ থাকে।',
    specs: [
      { label: 'Peak Voltage (Vm)', value: '1 V to 25 V' },
      { label: 'Frequency (f)', value: '10 Hz to 120 Hz' }
    ]
  },

  knee_voltage: {
    id: 'knee_voltage',
    name: 'Knee / Barrier Voltage (Vk / V0)',
    category: 'Semiconductor Parameter',
    symbol: 'V_K (Threshold Potential)',
    formula: 'V_K \approx 0.7 \text{ V (Si)},   V_K \approx 0.3 \text{ V (Ge)}',
    definitionEn: 'The forward bias voltage threshold at which a semiconductor diode transition from negligible conduction to substantial, exponential conduction current.',
    definitionBn: 'ফরোয়ার্ড বায়াসের সেই ন্যূনতম ভোল্টেজ মান, যা অতিক্রম করার পর ডায়োডের ভেতর দিয়ে উল্লেখযোগ্য হারে তীব্র বিদ্যুৎ প্রবাহ শুরু হয়।',
    physicsEn: 'Corresponds to the potential barrier established by uncompensated ions in the depletion layer. Conduction requires applied forward voltage to virtually cancel this internal barrier potential.',
    physicsBn: 'ডিপ্লিশন স্তরের বাধা অতিক্রম করতে যে ভোল্টেজ লাগে তাই Knee ভোল্টেজ। সিলিকনের জন্য এটি প্রায় ০.৭ ভোল্ট এবং জার্মেনিয়ামের জন্য ০.৩ ভোল্ট।',
    specs: [
      { label: 'Silicon (Si)', value: '0.7 V' },
      { label: 'Germanium (Ge)', value: '0.3 V' },
      { label: 'GaAs LED', value: '1.8 V – 3.2 V' }
    ]
  },

  covalent_bond: {
    id: 'covalent_bond',
    name: 'Covalent Bonding in Semiconductors (Si/Ge)',
    category: 'Solid-State Physics',
    symbol: 'Si:Si (Shared Electron Pairs)',
    formula: '4 \text{ Valence e}^- + 4 \text{ Neighbor Shared e}^- = 8 \text{ Stable Octet}',
    definitionEn: 'The stable chemical linkage formed in tetravalent semiconductor crystals (Silicon, Germanium) where each atom shares one of its four valence electrons with each of four neighboring atoms to complete a stable 8-electron outer shell (octet).',
    definitionBn: 'বিশুদ্ধ সিলিকন বা জার্মেনিয়াম পরমাণুর শেষ কক্ষপথের ৪টি ইলেকট্রন পাশের ৪টি পরমাণুর সাথে ভাগাভাগি বা শেয়ার করে ৮টি ইলেকট্রনের যে স্থিতিশীল অষ্টক বন্ধন তৈরি করে, তাকে সমযোজী বন্ধন বলে।',
    physicsEn: 'At absolute zero (0 K), all valence electrons are locked firmly within covalent bonds, leaving zero free charge carriers in the conduction band, causing the semiconductor to behave as a perfect insulator. At room temperature (300 K), ambient thermal vibrations break a small fraction of these bonds (~1 in 10^10 in Si), generating electron-hole pairs.',
    physicsBn: '০ কেলভিন তাপমাত্রায় সব ইলেকট্রন বন্ধনে আবদ্ধ থাকে বলে কোনো বিদ্যুৎ প্রবাহিত হয় না। তাপমাত্রা বাড়লে তাপীয় শক্তির কারণে কিছু বন্ধন ভেঙে মুক্ত ইলেকট্রন ও হোলের সৃষ্টি হয়।',
    specs: [
      { label: 'Crystal Structure', value: 'Diamond Cubic Lattice' },
      { label: 'Coordination Number', value: '4 nearest neighbors' },
      { label: 'Behavior at 0 K', value: 'Perfect Insulator' }
    ]
  },

  intrinsic_material: {
    id: 'intrinsic_material',
    name: 'Intrinsic Semiconductor Material',
    category: 'Material Physics',
    symbol: 'n = p = n_i',
    formula: 'n \cdot p = n_i^2,   n_i \approx 1.5 \times 10^{10} \text{ cm}^{-3} \text{ (Si at 300 K)}',
    definitionEn: 'An ultra-pure semiconductor crystal containing zero intentional impurity or dopant atoms, in which electrical conduction is governed purely by thermally generated electron-hole pairs.',
    definitionBn: 'যে অর্ধপরিবাহীতে কোনো ভেজাল বা অপদ্রব্য মেশানো থাকে না, তাকে বিশুদ্ধ বা ইন্ট্রিনসিক অর্ধপরিবাহী বলে। এতে মুক্ত ইলেকট্রন সংখ্যা এবং হোলের সংখ্যা সর্বদা সমান থাকে।',
    physicsEn: 'Because every broken covalent bond releases exactly one conduction electron and leaves behind exactly one vacant state (hole), the electron concentration n strictly equals hole concentration p (n = p = ni). The Fermi energy level EF lies almost precisely in the center of the forbidden energy bandgap Eg/2.',
    physicsBn: 'একটি বন্ধন ভাঙলে একটি মুক্ত ইলেকট্রন এবং একটি হোল তৈরি হয়, তাই n = p = ni। এর পরিবাহিতা খুবই কম থাকে।',
    specs: [
      { label: 'Purity Level', value: '> 99.9999999% pure Si' },
      { label: 'Intrinsic Concentration (ni)', value: '1.5 × 10^10 cm^-3 (Si) | 2.5 × 10^13 cm^-3 (Ge)' },
      { label: 'Fermi Level Position', value: 'Exact center of bandgap (Ei)' }
    ]
  },

  n_type: {
    id: 'n_type',
    name: 'N-Type Extrinsic Semiconductor',
    category: 'Doped Semiconductor',
    symbol: 'Donor Impurity (P, As, Sb)',
    formula: 'n \approx N_D \gg p,   p \approx \frac{n_i^2}{N_D}',
    definitionEn: 'An extrinsic semiconductor formed by doping a pure tetravalent crystal with pentavalent impurity atoms (such as Phosphorus, Arsenic, or Antimony), establishing free electrons as the majority charge carriers.',
    definitionBn: 'বিশুদ্ধ সিলিকন বা জার্মেনিয়ামে পঞ্চযোজী অপদ্রব্য (যেমন ফসফরাস, আর্সেনিক) ডোপিং করে যে অর্ধপরিবাহী তৈরি করা হয়, তাকে N-টাইপ অর্ধপরিবাহী বলে। এতে মুক্ত ইলেকট্রন হলো মেজরিটি ক্যারিয়ার।',
    physicsEn: 'Pentavalent atoms have 5 valence electrons. Four form covalent bonds with adjacent Si atoms, while the fifth extra electron is loosely bound with tiny ionization energy (~0.045 eV in Si). At room temperature, all donor atoms are ionized (ND+), freeing millions of electrons into the conduction band.',
    physicsBn: 'ফসফরাসের ৫ম ইলেকট্রনটি বন্ধনে অংশ না নিয়ে সামান্য তাপেই মুক্ত হয়ে যায় এবং বিদ্যুৎ পরিবহনে অংশ নেয়। পরমাণুটি তখন পজিটিভ ডোনার আয়নে পরিণত হয়।',
    specs: [
      { label: 'Majority Carriers', value: 'Free Electrons (Negative charge)' },
      { label: 'Minority Carriers', value: 'Holes (Positive charge)' },
      { label: 'Dopant Atoms', value: 'Group V (Phosphorus, Arsenic)' }
    ]
  },

  p_type: {
    id: 'p_type',
    name: 'P-Type Extrinsic Semiconductor',
    category: 'Doped Semiconductor',
    symbol: 'Acceptor Impurity (B, Ga, In)',
    formula: 'p \approx N_A \gg n,   n \approx \frac{n_i^2}{N_A}',
    definitionEn: 'An extrinsic semiconductor created by doping a pure tetravalent crystal with trivalent impurity atoms (such as Boron, Gallium, or Indium), establishing holes (electron vacancies) as the majority charge carriers.',
    definitionBn: 'বিশুদ্ধ সিলিকনে ত্রিযোজী অপদ্রব্য (যেমন বোরন, গ্যালিয়াম) ডোপিং করে তৈরি অর্ধপরিবাহী, যেখানে ইলেকট্রনের ঘাটতি বা হোল (Hole) হলো মেজরিটি ক্যারিয়ার।',
    physicsEn: 'Trivalent atoms possess only 3 valence electrons, leaving one unfilled covalent bond (a hole) when bonding with four silicon neighbors. An electron from an adjacent bond easily hops into this vacancy, causing the positive hole to migrate freely through the lattice.',
    physicsBn: 'বোরনের ৩টি ইলেকট্রন সিলিকনের সাথে যুক্ত হলেও ৪র্থ স্থানে ইলেকট্রন ঘাটতি বা পজিটিভ হোলের সৃষ্টি হয়। আশেপাশের ইলেকট্রন এই হোলে চলে আসলে হোলটি সহজে স্থান পরিবর্তন করে।',
    specs: [
      { label: 'Majority Carriers', value: 'Holes (Effective positive charge)' },
      { label: 'Minority Carriers', value: 'Free Electrons' },
      { label: 'Dopant Atoms', value: 'Group III (Boron, Gallium)' }
    ]
  },

  depletion_region: {
    id: 'depletion_region',
    name: 'Depletion Layer & Barrier Potential (Space-Charge Region)',
    category: 'Junction Physics',
    symbol: 'W_{dep} (Space-Charge Region)',
    formula: 'V_0 = V_T \ln\left(\frac{N_A N_D}{n_i^2}\right) \approx 0.7 \text{ V (Si)}',
    definitionEn: 'The narrow transition region at a PN metallurgical junction that has been completely depleted of free mobile charge carriers, leaving uncompensated immobile positive donor ions on the N-side and negative acceptor ions on the P-side.',
    definitionBn: 'পি-এন জংশনের দুই পাশে তৈরি হওয়া সেই সরু অঞ্চল যা সব মুক্ত চার্জ ক্যারিয়ার শূন্য এবং যেখানে কেবল নিশ্চল পজিটিভ ও নেগেটিভ আয়ন অবস্থান করে একটি অভ্যন্তরীণ ভোল্টেজ বাধা (Barrier) সৃষ্টি করে।',
    physicsEn: 'Upon joining P and N regions, electrons diffuse from N to P and holes diffuse from P to N, recombining at the boundary. This uncovers charged lattice ions (ND+ and NA-) which create a strong built-in electric field pointing from N to P. In forward bias, external voltage opposes and thins this layer; in reverse bias, external voltage reinforces and widens it.',
    physicsBn: 'ইলেকট্রন ও হোলের ডিফিউশনের পর নিশ্চল আয়নগুলো আটকে থেকে একটি অভ্যন্তরীণ বৈদ্যুতিক ক্ষেত্র তৈরি করে যা আরও ইলেকট্রন যাওয়া আটকে দেয়। ফরোয়ার্ডে এটি সংকুচিত হয়, রিভার্সে প্রসারিত হয়।',
    specs: [
      { label: 'Built-in Barrier (V0)', value: '~0.7 V for Si, ~0.3 V for Ge' },
      { label: 'Forward Bias Effect', value: 'Depletion width collapses (conduction)' },
      { label: 'Reverse Bias Effect', value: 'Depletion width expands (barrier reinforced)' }
    ]
  }
};
