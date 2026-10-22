// ============================================================================
// Intuitive Physical Explanations, Math Breakdown & Real-World Analogies (Topics 1-24)
// Boylestad 11th Edition Aligned with Standard LaTeX Math & Bilingual Readouts
// ============================================================================

export const ELI5_TOPIC_DATA = {
  '0': {
    storyEn: 'A diode is like a fun one-way playground slide! You can only slide DOWN from top to bottom (Anode to Cathode). If you try to climb backwards up the slide, a big rubber door slams shut and blocks you! But to slide down, you have to give the little front gate a gentle push of 0.7 volts with your shoes before it swings open!',
    storyBn: 'ডায়োড হলো খেলার পার্কের একটি একমুখী পিছলে পড়ার স্লিপার! তুমি শুধু ওপর থেকে নিচে পিছলে নামতে পারবে (অ্যানোড থেকে ক্যাথোড)। যদি নিচ থেকে উল্টো দিকে উঠতে চাও, একটা বড় রবারের দরজা খটাস করে বন্ধ হয়ে তোমাকে আটকে দেবে! আর নিচে পিছলানোর জন্য তোমাকে পায়ের জুতো দিয়ে দরজায় ০.৭ ভোল্টের একটু আলতো ধাক্কা দিতে হবে, ব্যস দরজাটা খুলে যাবে!',
    mathFormula: 'I_D = I_S \\left( e^{\\frac{V_D}{n V_T}} - 1 \\right), \\quad V_T \\approx 26\\text{ mV at } 300\\text{ K}',
    formulaDescEn: 'Shockley Diode Equation explains how forward current explodes exponentially once gate voltage overcomes the 0.7V threshold.',
    formulaDescBn: 'শকলে ডায়োড সমীকরণ বলে দেয় ভোল্টেজের ধাক্কা ০.৭ ভোল্ট পার হলেই বিদ্যুৎ প্রবাহ কীভাবে তীব্র গতিতে লাফিয়ে বাড়ে।',
    verbalReadEn: 'Diode Current = Reverse Saturation Current × [e^(Forward Voltage / (n × Thermal Voltage)) - 1]',
    verbalReadBn: 'ডায়োড প্রবাহ = স্যাচুরেশন লিকেজ কারেন্ট × [e^(ডায়োড ভোল্টেজ / থার্মাল ভোল্টেজ) - ১]',
    takeawayEn: 'Exponential surge: Current jumps by ~10x for every 60 mV increase above the knee voltage!',
    takeawayBn: 'প্রতি ৬০ মিলিভোল্ট ভোল্টেজ বাড়ালেই কারেন্ট প্রায় ১০ গুণ লাফিয়ে বৃদ্ধি পায়!',
    variables: [
      { sym: 'I_D', latex: 'I_D', unit: 'mA / A', nameEn: 'Electric Current', nameBn: 'বিদ্যুৎ প্রবাহ', descEn: 'Number of electron runners streaming through per second.', descBn: 'প্রতি সেকেন্ডে কতগুলো পুঁচকে ইলেকট্রন দৌড়ে পার হচ্ছে।' },
      { sym: 'V_D', latex: 'V_D', unit: 'V', nameEn: 'Applied Voltage', nameBn: 'প্রযুক্ত ভোল্টেজ', descEn: 'How hard you push the gate with your battery.', descBn: 'তোমার ব্যাটারি দিয়ে তুমি গেটে কত জোরে ধাক্কা দিচ্ছো।' },
      { sym: 'V_K', latex: 'V_K \\approx 0.7\\text{V}', unit: '0.7 V (Si)', nameEn: 'Knee Barrier', nameBn: 'দরজার প্রতিরোধ (~০.৭V)', descEn: 'The tiny spring you must overcome before the door swings open.', descBn: 'দরজা খোলার জন্য যে সামান্য শক্ত স্প্রিংটাকে দাবাতে হয়।' },
      { sym: 'I_S', latex: 'I_S', unit: '10 pA - 1 nA', nameEn: 'Reverse Leakage', nameBn: 'চুইয়ে পড়া সামান্য ফোঁটা', descEn: 'A few naughty droplets sneaking backwards under the closed door.', descBn: 'বন্ধ দরজার ফাঁক দিয়ে উল্টো দিকে চুইয়ে পড়া সামান্য দু-একটা ফোঁটা।' }
    ]
  },
  '1': {
    storyEn: 'Imagine all the little Silicon atoms are children in a preschool playground! Each Silicon child has 4 hands. To stay completely safe and happy, every child holds hands with 4 best friends around them in a big circle. When all 8 hands are locked together, they feel cozy and peaceful like a locked puzzle, so nobody can run away!',
    storyBn: 'মনে করো সব সিলিকন পরমাণু হলো কিন্ডারগার্টেন স্কুলের ছোট ছোট শিশু! প্রতিটা শিশুর ৪টি করে হাত আছে। তারা শান্ত ও সুরক্ষিত থাকতে পাশের ৪ জন প্রিয় বন্ধুর হাত শক্ত করে ধরে গোল হয়ে দাঁড়িয়ে থাকে। যখন সবার ৮টি হাত এভাবে শক্ত করে জোড়া লেগে যায়, তখন কেউ আর একা একা দুষ্টুমি করে দৌড়ে পালাতে পারে না!',
    mathFormula: '4\\text{ Valence } e^- + 4\\text{ Neighbor Shared } e^- = 8\\text{ Stable Octet}',
    formulaDescEn: '4 Valence e⁻ + 4 Neighbor e⁻ = 8 Stable Octet. Octet means having 8 happy handshakes!',
    formulaDescBn: '৪টি নিজের হাত + ৪ জন বন্ধুর হাত = ৮টি হাতের শক্তিশালী বন্ধন। ৮ হাত মেলালে বাচ্চারা সবচেয়ে খুশি ও শান্ত থাকে!',
    verbalReadEn: '4 Valence Electrons + 4 Shared Neighbor Electrons = 8 Stable Locked Octet',
    verbalReadBn: '৪টি যোজ্যতা ইলেকট্রন + ৪টি অংশীদারী ইলেকট্রন = ৮ ইলেকট্রনের স্থিতিশীল অষ্টক',
    takeawayEn: 'At absolute zero (0 K), all electrons are tightly locked in covalent bonds, making pure silicon a complete insulator.',
    takeawayBn: 'পরম শূন্য তাপমাত্রায় (0 K) সব ইলেকট্রন বন্ধনে আবদ্ধ থাকে, তাই বিশুদ্ধ সিলিকন সম্পূর্ণ অপরিবাহী।',
    variables: [
      { sym: 'Si (Z=14)', latex: '\\text{Si }(Z=14)', unit: 'Group IV', nameEn: 'Silicon Atom', nameBn: 'সিলিকন পরমাণু', descEn: 'A 4-handed friendly tetravalent builder block.', descBn: '৪ হাতওয়ালা বন্ধুবৎসল একটি খুদে বন্ধু পরমাণু।' },
      { sym: 'Octet (8)', latex: '8\\text{ e}^-', unit: 'Stable Octet', nameEn: 'Stable 8-Handshake', nameBn: '৮ হাতের বন্ধন', descEn: 'The magical number of shared valence electrons making atoms happy.', descBn: 'সবচেয়ে আরামদায়ক এবং শক্ত বন্ধন যেখানে কেউ নড়ে না।' },
      { sym: '0 Kelvin', latex: 'T = 0\\text{ K}', unit: '-273.15 °C', nameEn: 'Super Freeze', nameBn: 'পরম শূন্য তাপমাত্রা', descEn: 'Zero thermal vibrations: everyone is frozen like statues holding hands.', descBn: 'সবাই একদম বরফের মতো জমে স্থির হয়ে থাকে, কেউ নড়তে পারে না।' }
    ]
  },
  '2': {
    storyEn: 'Pure Intrinsic Silicon is like a completely clean, shiny crystal mirror with zero dirt. When the sun shines and the room gets warm (300K), some children get too energetic and let go of their handshakes! The child who starts running freely is a "Free Electron", and the empty spot they left behind is a "Hole". For every runner born, exactly one empty chair is created!',
    storyBn: 'বিশুদ্ধ ইন্ট্রিনসিক সিলিকন হলো ধুলোবালি ছাড়া একদম চকচকে কাচের ঘরের মতো! যখন রোদ ওঠে আর ঘরটা গরম হয়, তখন কিছু বাচ্চা বেশি আনন্দ পেয়ে বন্ধুর হাত ছেড়ে দৌড়াতে শুরু করে! যে বাচ্চাটা দৌড়াচ্ছে সে হলো "মুক্ত ইলেকট্রন", আর সে যে ফাঁকা জায়গাটা রেখে গেল, সেটা হলো "হোল"। যতজন দৌড়াবে, ঠিক ততটাই খালি চেয়ার তৈরি হবে!',
    mathFormula: 'n = p = n_i, \\quad n \\cdot p = n_i^2',
    formulaDescEn: 'n = p = n_i means free runners (n) ALWAYS equal empty spots (p) in pure crystals!',
    formulaDescBn: 'n = p = n_i মানে বিশুদ্ধ সিলিকনে যতগুলো দৌড়বিদ থাকবে, ঠিক ততগুলোই খালি বসার জায়গা থাকবে!',
    verbalReadEn: 'Free Electron Density (n) = Hole Density (p) = Intrinsic Carrier Concentration (n_i)',
    verbalReadBn: 'মুক্ত ইলেকট্রন ঘনত্ব (n) = হোল ঘনত্ব (p) = ইন্ট্রিনসিক ঘনত্ব (n_i)',
    takeawayEn: 'Thermal energy breaks bonds in 1:1 pairs, keeping electron and hole concentrations strictly equal.',
    takeawayBn: 'তাপীয় শক্তির কারণে সমান সংখ্যক মুক্ত ইলেকট্রন ও হোলের জন্ম হয়, তাই n = p = n_i।',
    variables: [
      { sym: 'n', latex: 'n', unit: 'cm⁻³', nameEn: 'Free Electrons', nameBn: 'ছুটে চলা ইলেকট্রন (n)', descEn: 'Free conduction electrons carrying negative charge.', descBn: 'মুক্তভাবে ছুটে চলা নেগেটিভ চার্জের বাহক।' },
      { sym: 'p', latex: 'p', unit: 'cm⁻³', nameEn: 'Empty Holes', nameBn: 'খালি চেয়ার বা হোল (p)', descEn: 'Positive valence vacancies waiting for neighbor electrons.', descBn: 'ফাঁকা জায়গা যেখানে পাশের কেউ এসে বসতে পারে।' },
      { sym: 'n_i', latex: 'n_i', unit: '1.5×10¹⁰ cm⁻³', nameEn: 'Intrinsic Carrier Density', nameBn: 'স্বাভাবিক বাহকের ঘনত্ব', descEn: 'How many pairs wake up purely from ambient room warmth.', descBn: 'ঘরের স্বাভাবিক গরমে যত জোড়া মুক্ত বাহক তৈরি হয়।' }
    ]
  },
  '3': {
    storyEn: 'Extrinsic Semiconductor is like baking a chocolate cake and sprinkling tiny sprinkles of magic sugar on top! Pure silicon is too quiet and lazy. By adding just ONE special pinch of sugar atoms (Doping), we make the material thousands of times more energetic and ready to power up your video games and smartphones!',
    storyBn: 'এক্সট্রিনসিক সেমিকন্ডাক্টর হলো একটা সাধারণ কেকে এক চিমটি জাদুকরী মিষ্টি ছড়িয়ে দেওয়া! খাঁটি সিলিকন খুব শান্ত আর অলস। কিন্তু তার মধ্যে সামান্য একটু বিশেষ অপদ্রব্য মিশিয়ে দিলেই (ডোপিং) সে লাখ গুণ বেশি চটপটে হয়ে ওঠে এবং আমাদের মোবাইল ও কম্পিউটার চালাতে পারে!',
    mathFormula: 'n \\cdot p = n_i^2 \\quad \\text{(Mass-Action Law)}',
    formulaDescEn: 'n · p = n_i² (Mass-Action Law): Even if you invite millions of runners, the product of runners and empty spots stays balanced by nature!',
    formulaDescBn: 'n · p = n_i² (ম্যাস-অ্যাকশন ল): তুমি যত কোটি নতুন দৌড়বিদই আনো না কেন, তাদের দুজনের গুণফল সবসময় প্রকৃতির নিয়মে স্থির থাকে!',
    verbalReadEn: 'Carrier Product (n × p) = Constant (n_i squared) under Thermal Equilibrium',
    verbalReadBn: 'ইলেকট্রন ও হোলের গুণফল (n × p) সর্বদা স্থির (n_i²) থাকে',
    takeawayEn: 'Adding one carrier type by doping proportionally reduces the other type to keep the n·p product constant.',
    takeawayBn: 'ডোপিং করে একদল বাহক বাড়ালে অন্য দলের বাহক কমে গিয়ে গুণফল স্থির থাকে।',
    variables: [
      { sym: 'Doping', latex: '\\text{Doping}', unit: '1 : 10⁶ to 10⁸', nameEn: 'Controlled Doping', nameBn: 'ডোপিং বা ভেজাল মেশানো', descEn: 'Adding 1 helper atom for every million host atoms.', descBn: '১০ লাখ সিলিকনের মধ্যে মাত্র ১টি বিশেষ বন্ধু মেশানো।' },
      { sym: 'N_D', latex: 'N_D', unit: 'cm⁻³', nameEn: 'Donor Density', nameBn: 'দাতা পরমাণু ঘনত্ব', descEn: 'Pentavalent atoms donating free electrons.', descBn: 'যে বন্ধুরা বাড়তি চকলেট ইলেকট্রন উপহার দেয়।' },
      { sym: 'N_A', latex: 'N_A', unit: 'cm⁻³', nameEn: 'Acceptor Density', nameBn: 'গ্রহীতা পরমাণু ঘনত্ব', descEn: 'Trivalent atoms creating holes for electrons to fill.', descBn: 'যে বন্ধুরা খালি চেয়ার নিয়ে আসে।' }
    ]
  },
  '4': {
    storyEn: 'P-Type Silicon is made by inviting Boron atoms into the party! Boron only has 3 hands instead of 4. So when Boron holds hands with 3 neighbor kids, it has NO hand for the 4th friend! This leaves an empty chair called a "Hole". When other kids see an empty chair, they jump over to sit in it, making the empty chair appear to walk backwards! That is why we call it P-Type (Positive)!',
    storyBn: 'P-টাইপ তৈরি হয় সিলিকন পার্টিতে বোরন বন্ধুদের দাওয়াত দিয়ে! বোরনের ৪টি হাত নেই, আছে মাত্র ৩টি হাত। তাই ৩ বন্ধুর হাত ধরার পর ৪র্থ জায়গায় কোনো হাত থাকে না—সেখানে তৈরি হয় একটি ফাঁকা চেয়ার বা "হোল"! পেছনের বাচ্চাটি যখন ফাঁকা চেয়ারে এসে বসে, তখন মনে হয় যেন ফাঁকা চেয়ারটাই পেছনের দিকে হেঁটে যাচ্ছে! এজন্য একে পজিটিভ বা P-টাইপ বলে!',
    mathFormula: 'p \\approx N_A \\gg n, \\quad n \\approx \\frac{n_i^2}{N_A}',
    formulaDescEn: 'p ≈ N_A: The number of walking empty chairs (holes) is almost exactly equal to the number of 3-handed Boron friends you put in!',
    formulaDescBn: 'p ≈ N_A: তুমি যতগুলো ৩ হাতওয়ালা বোরন বন্ধু বসাবে, ঠিক ততগুলোই নতুন খালি চেয়ার (হোল) তৈরি হবে!',
    verbalReadEn: 'Hole Concentration ≈ Acceptor Doping (N_A), outnumbering electrons by millions to one',
    verbalReadBn: 'হোল ঘনত্ব ≈ গ্রহীতা ডোপিং (N_A), যা ইলেকট্রনের চেয়ে লাখ লাখ গুণ বেশি',
    takeawayEn: 'Majority carriers are positively charged holes; minority carriers are thermally generated electrons.',
    takeawayBn: 'P-টাইপে পজিটিভ হোল হলো সংখ্যাগুরু বাহক এবং মুক্ত ইলেকট্রন হলো সংখ্যালঘু বাহক।',
    variables: [
      { sym: 'Boron (B)', latex: '\\text{Boron (B)}', unit: 'Group III', nameEn: 'Trivalent Acceptor', nameBn: '৩ হাতওয়ালা বন্ধু (বোরন)', descEn: 'Acceptor atom with 3 valence electrons.', descBn: 'যার একটি হাত কম থাকায় একটি হোল তৈরি হয়।' },
      { sym: 'Holes (p)', latex: 'p \\approx N_A', unit: 'cm⁻³', nameEn: 'Majority Holes', nameBn: 'হাঁটতে থাকা খালি চেয়ার (হোল)', descEn: 'Majority charge carriers in P-Type material.', descBn: 'P-টাইপের প্রধান সংখ্যাগুরু বাহক।' },
      { sym: 'Minority (n)', latex: 'n \\ll p', unit: 'cm⁻³', nameEn: 'Minority Electrons', nameBn: 'সংখ্যালঘু ইলেকট্রন', descEn: 'A tiny handful of thermally generated electrons.', descBn: 'ঘরের স্বাভাবিক গরমে তৈরি সামান্য কয়েকটি ইলেকট্রন।' }
    ]
  },
  '5': {
    storyEn: 'N-Type Silicon is made by inviting Phosphorus atoms to the party! Phosphorus has 5 hands! It holds hands with 4 silicon neighbors using 4 hands, but its 5th hand has NO ONE to hold! That 5th electron has nothing to do, so it breaks loose and runs around like a hyperactive puppy! Because it brings millions of negative electron puppies, we call it N-Type (Negative)!',
    storyBn: 'N-টাইপ তৈরি হয় পার্টিতে ফসফরাস বন্ধুদের নিয়ে এলে! ফসফরাসের ৫টি হাত আছে! সে ৪ হাত দিয়ে পাশের ৪ জন সিলিকন বন্ধুর হাত ধরে ফেলে, কিন্তু তার ৫ম হাতটি ফাঁকা পড়ে থাকে! সেই ৫ম ইলেকট্রনটির কোনো কাজ না থাকায় সে সারা ক্লাসরুমে চঞ্চল বিড়ালের বাচ্চার মতো দৌড়াদৌড়ি করে! নেগেটিভ ইলেকট্রনে ভরে যায় বলে একে N-টাইপ বলে!',
    mathFormula: 'n \\approx N_D \\gg p, \\quad p \\approx \\frac{n_i^2}{N_D}',
    formulaDescEn: 'n ≈ N_D: The number of zooming free electrons is almost exactly equal to the number of 5-handed Phosphorus friends you invited!',
    formulaDescBn: 'n ≈ N_D: যতগুলো ৫ হাতওয়ালা ফসফরাস বন্ধু আসবে, ঠিক ততগুলোই মুক্ত ইলেকট্রন স্বাধীনভাবে দৌড়াবে!',
    verbalReadEn: 'Electron Concentration ≈ Donor Doping (N_D), outnumbering holes by millions to one',
    verbalReadBn: 'মুক্ত ইলেকট্রন ঘনত্ব ≈ দাতা ডোপিং (N_D), যা হোলের চেয়ে লাখ লাখ গুণ বেশি',
    takeawayEn: 'Majority carriers are negatively charged electrons; minority carriers are thermally generated holes.',
    takeawayBn: 'N-টাইপে নেগেটিভ মুক্ত ইলেকট্রন হলো সংখ্যাগুরু বাহক এবং পজিটিভ হোল হলো সংখ্যালঘু।',
    variables: [
      { sym: 'Phosphorus (P)', latex: '\\text{Phosphorus (P)}', unit: 'Group V', nameEn: 'Pentavalent Donor', nameBn: '৫ হাতওয়ালা বন্ধু (ফসফরাস)', descEn: 'Donor atom donating 1 free electron.', descBn: 'যে বন্ধু ১টি বাড়তি ইলেকট্রন উপহার দেয়।' },
      { sym: 'Electrons (n)', latex: 'n \\approx N_D', unit: 'cm⁻³', nameEn: 'Majority Electrons', nameBn: 'ছুটে চলা ইলেকট্রন', descEn: 'Majority charge carriers in N-Type material.', descBn: 'N-টাইপের প্রধান সংখ্যাগুরু বাহক।' },
      { sym: 'Donor Ion (P⁺)', latex: 'P^+', unit: 'Fixed Ion', nameEn: 'Immobile Donor Ion', nameBn: 'পজিটিভ আয়ন', descEn: 'Atom locked firmly in lattice after releasing its 5th electron.', descBn: 'ইলেকট্রন দিয়ে ক্রিস্টালে শান্ত হয়ে দাঁড়িয়ে থাকা পরমাণু।' }
    ]
  },
  '6': {
    storyEn: 'A diode family has three famous superhero siblings: 1) Rectifier Diode who turns swinging ocean waves into steady straight marching soldiers, 2) Zener Diode who protects castles from giant lightning bolts, and 3) LED Diode who glows like a magical colorful fairy light!',
    storyBn: 'ডায়োড পরিবারের তিনজন বিখ্যাত সুপারহিরো ভাইবোন আছে: ১) সাধারণ রেক্টিফায়ার ডায়োড—যে সাগরের দোল খাওয়া ঢেউকে সোজা একমুখী সৈন্যে পরিণত করে, ২) জেনার ডায়োড—যে বিদ্যুৎ চমকালে সার্কিটকে রক্ষা করে, এবং ৩) এলইডি ডায়োড—যে রঙিন পরীর মতো আলো ছড়ায়!',
    mathFormula: 'R_F \\ll R_R \\quad (\\text{Rectifying } \\mid \\text{ Zener } \\mid \\text{ LED})',
    formulaDescEn: 'Classification: Rectifying, Zener, Light Emitting.',
    formulaDescBn: 'শ্রেণিবিভাগ: রেক্টিফায়ার, জেনার এবং লাইট এমিটিং ডায়োড (LED)।',
    verbalReadEn: 'Forward Resistance R_F is Much Smaller Than Reverse Resistance R_R',
    verbalReadBn: 'ফরোয়ার্ড রোধ (R_F) রিভার্স রোধের (R_R) চেয়ে লক্ষ গুণ কম',
    takeawayEn: 'Diodes guide current in one direction, regulate voltage in breakdown, or emit bright photons.',
    takeawayBn: 'ডায়োড বিদ্যুৎকে একদিকে যেতে দেয়, ভোল্টেজ স্থির রাখে কিংবা রঙিন আলো ছড়ায়।',
    variables: [
      { sym: 'Rectifier', latex: '\\text{Rectifier}', unit: 'AC ➔ DC', nameEn: 'Traffic Cop Diode', nameBn: 'ট্রাফিক পুলিশ ডায়োড', descEn: 'Lets electricity march in only one direction.', descBn: 'বিদ্যুৎকে শুধু একদিকে যেতে দেয়।' },
      { sym: 'Zener', latex: '\\text{Zener}', unit: 'V_Z Clamp', nameEn: 'Safety Cushion Diode', nameBn: 'সুরক্ষা কুশন জেনার', descEn: 'Regulates voltage so it never spikes dangerously high.', descBn: 'ভোল্টেজ বেশি বাড়লে আটকে দিয়ে সার্কিট বাঁচায়।' },
      { sym: 'LED', latex: '\\text{LED}', unit: 'Optoelectronic', nameEn: 'Glow Star Diode', nameBn: 'জাদুকরী বাতি এলইডি', descEn: 'Converts electrical energy directly into light photons.', descBn: 'বিদ্যুৎ থেকে রঙিন আলো তৈরি করে।' }
    ]
  },
  '7': {
    storyEn: 'Direct Bandgap is like jumping straight down from a diving board into a pool! The diver lands with a giant SPLASH of bright, colorful light! The electron jumps from the top floor straight down to the bottom floor without hitting any walls, instantly shooting out a sparkling photon of light (like in GaAs and GaN LEDs)!',
    storyBn: 'ডিরেক্ট ব্যান্ডগ্যাপ হলো সুইমিং পুলের উঁচু বোর্ড থেকে সোজা পানিতে ঝাঁপ দেওয়ার মতো! ডাইভ দিলে যেমন চারদিকে পানি ছিটকে সুন্দর শব্দ হয়, তেমনই ইলেকট্রন ওপরের খাট থেকে নিচে সোজা লাফ দিয়ে সুন্দর রঙিন আলো তৈরি করে ছিটকে দেয় (যেমন: GaAs ও GaN এলইডি)!',
    mathFormula: '\\mathbf{k}_{\\min}(\\text{Conduction}) = \\mathbf{k}_{\\max}(\\text{Valence}) \\implies E_g = h\\nu = \\frac{hc}{\\lambda}',
    formulaDescEn: 'Direct Alignment: Momentum k_conduction = k_valence means 100% of jumps turn directly into pure photon light!',
    formulaDescBn: 'সোজা লাফ: ওপরের ও নিচের তলার অবস্থান সোজা থাকায় ইলেকট্রনের পুরো শক্তিটাই সরাসরি আলো হয়ে বেরিয়ে আসে!',
    verbalReadEn: 'Aligned Momentum Vectors (k_min = k_max) mean 100% of Energy is Emitted as Photons (E = hν)',
    verbalReadBn: 'উভয় শক্তিস্তরের ভরবেগ এক থাকায় ইলেকট্রন ও হোলের মিলন সরাসরি আলোর ফুলকিতে পরিণত হয়',
    takeawayEn: 'Direct momentum alignment produces high-efficiency optical emission with zero phonon heat loss.',
    takeawayBn: 'ভরবেগ সংরক্ষিত থাকায় কোনো তাপ নষ্ট না হয়ে সম্পূর্ণ শক্তি আলো হিসেবে বের হয়।',
    variables: [
      { sym: 'E_g', latex: 'E_g', unit: 'eV', nameEn: 'Bandgap Energy', nameBn: 'লাফের উচ্চতা (ব্যান্ডগ্যাপ)', descEn: 'Energy difference between conduction and valence bands.', descBn: 'ওপরের তলা ও নিচের তলার মধ্যে শক্তির ব্যবধান।' },
      { sym: 'Photon (hν)', latex: 'h\\nu = \\frac{hc}{\\lambda}', unit: 'Optical Packet', nameEn: 'Light Sparkle', nameBn: 'আলোর কণা (ফোটন)', descEn: 'The packet of light created from the clean vertical jump.', descBn: 'লাফ দেওয়ার পর যে রঙিন আলোর ফুলকি বের হয়।' },
      { sym: 'GaAs', latex: '\\text{GaAs}', unit: 'Direct Compound', nameEn: 'Gallium Arsenide', nameBn: 'গ্যালিয়াম আর্সেনাইড', descEn: 'A magical crystal that makes red and infrared LEDs.', descBn: 'চমৎকার একটি ক্রিস্টাল যা সরাসরি লাল আলো ছড়ায়।' }
    ]
  },
  '8': {
    storyEn: 'Indirect Bandgap is like trying to jump off a slide, but someone placed a big rubber pillar in the middle! To land safely, the poor electron has to bounce sideways, bump its knee against the pillar, and make a loud THUMP! Instead of making pretty light, that thump turns into heat (phonons) that just warms up your computer chip!',
    storyBn: 'ইনডিরেক্ট ব্যান্ডগ্যাপ হলো এমন এক লাফ, যার মাঝখানে কেউ একটা শক্ত দেয়াল তুলে রেখেছে! বেচারা ইলেকট্রন নিচে নামার সময় দেয়ালে ধাক্কা খেয়ে হোঁচট খায়! ফলে সুন্দর আলোর বদলে শুধুই ধপাস শব্দ আর গরম তাপ (ফোনন) তৈরি হয়! একারণে সিলিকন বা জার্মেনিয়াম দিয়ে বাতি জ্বালানো যায় না, শুধু গরম হয়!',
    mathFormula: '\\mathbf{k}_{\\min}(\\text{Conduction}) \\neq \\mathbf{k}_{\\max}(\\text{Valence}) \\implies E_g \\to \\text{Phonon (Heat)}',
    formulaDescEn: 'Momentum Mismatch: Δk ≠ 0 means the electron needs a lattice vibration (heat phonon) to land, wasting 99% of energy as heat.',
    formulaDescBn: 'অবস্থানের অমিল: ইলেকট্রনকে নিচে নামতে হলে আরেকজনের ধাক্কা খেয়ে নামতে হয়, ফলে ৯৯% শক্তিই আলো না হয়ে উত্তাপ হয়ে নষ্ট হয়।',
    verbalReadEn: 'Momentum Mismatch (k_min ≠ k_max) requires a Phonon Lattice Vibration, Wasting 99% of Energy as Heat',
    verbalReadBn: 'ভরবেগের অমিলের কারণে ফোনন কম্পন তৈরি হয়ে ৯৯% শক্তি তাপে নষ্ট হয়',
    takeawayEn: 'Silicon and Germanium emit lattice vibration phonons (heat) instead of light, making them poor for LEDs.',
    takeawayBn: 'সিলিকন ও জার্মেনিয়াম আলোর বদলে তাপ নির্গমন করে, তাই এগুলো দিয়ে বাতি তৈরি করা যায় না।',
    variables: [
      { sym: 'Silicon (Si)', latex: '\\text{Si }(E_g = 1.12\\text{ eV})', unit: 'Indirect Material', nameEn: 'Indirect Master', nameBn: 'সিলিকন', descEn: 'Great for computer brains, bad for making light.', descBn: 'কম্পিউটার প্রসেসরের জন্য সেরা, কিন্তু বাতি হিসেবে কাজ করে না।' },
      { sym: 'Phonon', latex: '\\text{Phonon}', unit: 'Lattice Vibration', nameEn: 'Heat Vibration', nameBn: 'উত্তাপের কম্পন (ফোনন)', descEn: 'Lattice heat wave that steals the electron energy.', descBn: 'কেলাসের কাঁপুনি যা আলোর বদলে গরম তৈরি করে।' }
    ]
  },
  '9': {
    storyEn: 'LED stands for Light Emitting Diode! Think of it as a magical flashlight bug! You feed it electricity candies from a battery, and its tummy glows like a bright ruby red, emerald green, or sapphire blue star! It does not get burning hot like an old grandma lightbulb—it stays cool and happy!',
    storyBn: 'LED মানে হলো লাইট এমিটিং ডায়োড বা আলো দেওয়া ডায়োড! একে মনে করো এক জোনাকি পোকা! তুমি ব্যাটারি দিয়ে তাকে একটু খাবার দিলেই তার পেট থেকে সুন্দর লাল, সবুজ বা নীল তারা জ্বলে ওঠে! পুরনো দিনের টাংস্টেন বাল্বের মতো এটা বেশি গরম হয় না, একদম ঠান্ডা থাকে!',
    mathFormula: '\\lambda\\text{ (nm)} = \\frac{1240}{E_g\\text{ (eV)}}',
    formulaDescEn: 'Electroluminescence: Electricity in ➔ Beautiful cold light out!',
    formulaDescBn: 'ইলেক্ট্রোলুমিনেসেন্স: ব্যাটারির বিদ্যুৎ শক্তি সরাসরি ঠান্ডা রঙিন আলোতে রূপান্তর!',
    verbalReadEn: 'Emitted Wavelength in nm = 1240 / Bandgap Energy in eV',
    verbalReadBn: 'আলোর তরঙ্গদৈর্ঘ্য (ন্যানোমিটার) = ১২৪০ / ব্যান্ডগ্যাপ শক্তি (ইলেকট্রন-ভোল্ট)',
    takeawayEn: 'Photon wavelength is strictly inversely proportional to the semiconductor bandgap energy.',
    takeawayBn: 'ব্যান্ডগ্যাপ শক্তি যত বেশি হবে, আলোর তরঙ্গদৈর্ঘ্য তত ছোট হয়ে নীলের দিকে যাবে।',
    variables: [
      { sym: 'λ (Lambda)', latex: '\\lambda', unit: 'nm', nameEn: 'Light Wavelength', nameBn: 'আলোর তরঙ্গদৈর্ঘ্য', descEn: 'Determines the color: 650nm is red, 470nm is blue.', descBn: 'আলোর রঙ নির্ধারণ করে: ৬৫০nm লাল, ৪৭০nm নীল।' },
      { sym: 'E_g (eV)', latex: 'E_g', unit: 'eV', nameEn: 'Bandgap Energy', nameBn: 'ব্যান্ডগ্যাপ শক্তি', descEn: 'The energy cliff electrons drop across.', descBn: 'ইলেকট্রন যে শক্তির খাদ পেরিয়ে নিচে পড়ে।' }
    ]
  },
  '10': {
    storyEn: 'Why do LEDs have different colors? It is all about the height of the slide! A small gentle slide makes cozy Red light. A taller slide makes Green light. A giant super-tall slide makes icy Blue or Purple light! The taller the jump ($E_g$), the shorter the light wave ($\lambda$) and the more energetic the color!',
    storyBn: 'এলইডি বাতি কেন লাল, সবুজ বা নীল রঙের হয়? এটা নির্ভর করে স্লাইডটা কতটা উঁচু তার ওপর! ছোট নিচু স্লাইড থেকে লাফ দিলে বের হয় মিষ্টি লাল আলো। মাঝারি স্লাইড থেকে লাফ দিলে বের হয় সবুজ আলো। আর অনেক উঁচু আকাশছোঁয়া স্লাইড থেকে লাফ দিলে বের হয় নীল ও বেগুনি আলো! স্লাইড যত উঁচু ($E_g$), আলোর রঙ তত নীল!',
    mathFormula: 'V_F \\approx 1.8\\text{ V to } 3.3\\text{ V}, \\quad \\Phi_v \\propto I_F',
    formulaDescEn: 'λ = 1240 / E_g (in nanometers). Jump energy decides the rainbow color!',
    formulaDescBn: 'λ = ১২৪০ / E_g (ন্যানোমিটার)। লাফের শক্তিই ঠিক করে দেয় রংধনুর কোন রঙটি জ্বলবে!',
    verbalReadEn: 'Forward Knee Voltage ranges from 1.8V to 3.3V; Optical Brightness is proportional to Forward Current',
    verbalReadBn: 'ফরোয়ার্ড ভোল্টেজ রঙভেদে ১.৮V থেকে ৩.৩V; উজ্জ্বলতা ফরোয়ার্ড কারেন্টের সমানুপাতিক',
    takeawayEn: 'Luminous output grows linearly with current; requires an external series resistor to prevent thermal runaway.',
    takeawayBn: 'কারেন্ট বাড়ালে উজ্জ্বলতা সোজা বাড়ে; ডায়োডকে পোড়া থেকে বাঁচাতে সিরিজ রোধ ব্যবহার জরুরি।',
    variables: [
      { sym: 'V_F', latex: 'V_F', unit: '1.8 - 3.3 V', nameEn: 'Forward Turn-On Voltage', nameBn: 'ফরোয়ার্ড ভোল্টেজ', descEn: 'Red needs ~1.8V, Blue/White needs ~3.3V.', descBn: 'লাল আলোর জন্য ১.৮V এবং নীল আলোর জন্য ৩.৩V লাগে।' },
      { sym: 'I_F', latex: 'I_F', unit: '10 - 20 mA', nameEn: 'Forward Current', nameBn: 'ফরোয়ার্ড কারেন্ট', descEn: 'Current flowing through the LED die.', descBn: 'এলইডির ভেতর দিয়ে বয়ে যাওয়া নিরাপদ কারেন্ট।' },
      { sym: 'Φ_v', latex: '\\Phi_v', unit: 'Lumen (lm)', nameEn: 'Luminous Flux', nameBn: 'আলোর উজ্জ্বলতা', descEn: 'How brightly the human eye sees the emitted light.', descBn: 'মানুষের চোখে আলোর তীব্রতা ও ঔজ্জ্বল্য।' }
    ]
  },
  '11': {
    storyEn: 'Inside an LED plastic bubble: There is a tiny shiny cup called an "anvil" that reflects light forward like a spoon reflecting sunlight! A paper-thin gold wire connects the power, and a clear epoxy dome acts like magnifying glasses to focus the light into your eyes safely!',
    storyBn: 'এলইডি প্লাস্টিকের পেটের ভেতর কী থাকে? ভেতরে ছোট্ট একটা চকচকে চামচের মতো বাটি থাকে, যা পেছনের সব আলোকে সামনের দিকে আয়নার মতো ফেলে দেয়! একটা সোনার সরু সুতো দিয়ে বিদ্যুৎ দেওয়া হয়, আর বাইরের স্বচ্ছ টুপিটা আতশ কাচের মতো আলোকে সোজা ছুড়ে দেয়!',
    mathFormula: '\\text{Epoxy Dome} + \\text{Thin P-Window} + \\text{PN Die} + \\text{Anvil Cup}',
    formulaDescEn: 'Anvil Cup + Gold Wire + Semiconductor Die + Clear Epoxy Lens.',
    formulaDescBn: 'চামচ বাটি + সোনার তার + সেমিকন্ডাক্টর দানা + স্বচ্ছ লেন্স ক্যাপসুল।',
    verbalReadEn: 'Clear Dome Lens + Ultra-Thin P-Window + Active PN Die + Reflective Anvil Cathode Cup',
    verbalReadBn: 'স্বচ্ছ লেন্স ক্যাপসুল + পাতলা P-স্তর + সেমিকন্ডাক্টর দানা + প্রতিফলক কাপ',
    takeawayEn: 'The top P-layer is made paper-thin so photons escape without reabsorption, while the anvil cup directs light forward.',
    takeawayBn: 'P-স্তরটি অত্যন্ত পাতলা রাখা হয় যাতে আলো শোষিত না হয়ে প্রতিফলক কাপের সাহায্যে বাইরে বেরিয়ে আসে।',
    variables: [
      { sym: 'Epoxy Dome', latex: '\\text{Dome}', unit: 'Lens Capsule', nameEn: 'Plastic Lens Helmet', nameBn: 'প্লাস্টিক ক্যাপসুল লেন্স', descEn: 'Protects the tiny chip and focuses the emitted light beams.', descBn: 'ভিতরের পুঁচকে চিপটিকে রক্ষা করে এবং আলোকে সোজা ছুড়ে দেয়।' },
      { sym: 'Anvil Cup', latex: '\\text{Anvil Cup}', unit: 'Cathode Lead', nameEn: 'Reflector Spoon', nameBn: 'প্রতিফলক চামচ বাটি', descEn: 'Directs all backwards-emitted light beams forward.', descBn: 'পেছনের সব আলোকে সামনের দিকে ছড়িয়ে দেয়।' }
    ]
  },
  '12': {
    storyEn: 'How an LED works: Imagine lots of electron kids with backpacks full of energy jumping across the playground into empty seats (holes). When an electron sits in a hole, they hug each other! That warm hug releases a magical sparkle of photon light that flies through the air!',
    storyBn: 'এলইডি কীভাবে কাজ করে: মনে করো একদল বাচ্চা পিঠে ভরপুর শক্তির ব্যাগ নিয়ে দৌড়ে এসে খালি চেয়ারে (হোলে) ধপাস করে বসে পড়ে! বসার সাথে সাথেই তারা একে অপরকে জড়িয়ে ধরে আর সেই আনন্দের ধাক্কায় এক ঝলক জাদুকরী আলোর ফুলকি বাতাসে উড়ে যায়!',
    mathFormula: 'e^- (\\text{Conduction}) + h^+ (\\text{Valence}) \\longrightarrow \\text{Photon } \\left(E = h\\nu = \\frac{hc}{\\lambda}\\right)',
    formulaDescEn: 'Radiative Recombination: Electron + Hole ➔ Photon of Light (hν)!',
    formulaDescBn: 'পুনর্মিলন: ইলেকট্রন আর হোল এক হয়ে গেলেই আলোর ফুলকি জন্ম নেয়!',
    verbalReadEn: 'Conduction Electron + Valence Hole Recombine Directly to Emit a Light Photon (E = hν)',
    verbalReadBn: 'উচ্চ শক্তির ইলেকট্রন ও নিম্ন শক্তির হোল মিলিত হয়ে সরাসরি আলোর ফোটন বিকিরণ করে',
    takeawayEn: 'Forward bias injects carriers across the narrow depletion layer where radiative recombination releases light.',
    takeawayBn: 'ফরোয়ার্ড বায়াসে ক্যারিয়ারগুলো জংশন অতিক্রম করে মিলিত হয়ে সরাসরি দৃশ্যমান আলো বিকিরণ করে।',
    variables: [
      { sym: 'Recombination', latex: 'e^- + h^+', unit: 'Reaction', nameEn: 'Carrier Recombination', nameBn: 'পুনর্মিলন বা কোলাকুলি', descEn: 'Electron fills a valence hole and releases excess bandgap energy.', descBn: 'ইলেকট্রন ফাঁকা হোলে বসে গিয়ে বাড়তি শক্তি আলো হিসেবে ছেড়ে দেয়।' },
      { sym: 'Photon (hν)', latex: 'h\\nu', unit: 'hf', nameEn: 'Light Quantum', nameBn: 'আলোর ফোটন', descEn: 'Discrete packet of emitted electromagnetic radiation.', descBn: 'লাফ দেওয়ার পর যে আলোক কণা নির্গত হয়।' }
    ]
  },
  '13': {
    storyEn: 'A Zener Diode is a magic wall that knows martial arts! Forward, it lets everyone pass easily. Backwards, it holds up a giant shield and blocks all water! But if the water pressure pushes harder than its secret number (say 5.1 Volts), the Zener lets the extra water flow backwards safely without breaking!',
    storyBn: 'জেনার ডায়োড হলো কুংফু জানা এক জাদুকরী দেয়াল! সোজা দিকে সে সবাইকে যেতে দেয়। উল্টো দিকে সে শক্ত ঢাল দিয়ে সব পানি আটকে রাখে! কিন্তু পানি যদি তার জাদুকরী সংখ্যার চেয়ে বেশি জোরে ধাক্কা দেয় (যেমন: ৫.১ ভোল্ট), তখন সে নিরাপদে বাড়তি পানি পেছনের দরজা দিয়ে বের করে দেয় যাতে কেউ ডুবে না যায়!',
    mathFormula: 'V_Z = \\text{Constant for } I_{ZK} \\le I_Z \\le I_{ZM}',
    formulaDescEn: 'V_Z = constant: Once you reach breakdown, the voltage across the Zener stays locked at V_Z no matter how wild the input gets!',
    formulaDescBn: 'V_Z = স্থির মান: পেছনের দরজা একবার খুললে জেনারের দুই প্রান্তের ভোল্টেজ ঠিক V_Z মানে একদম পাথর হয়ে স্থির থাকে!',
    verbalReadEn: 'Zener Voltage V_Z remains Constant for Reverse Current between Knee (I_ZK) and Maximum (I_ZM)',
    verbalReadBn: 'রিভার্স কারেন্ট I_ZK থেকে I_ZM এর মধ্যে পরিবর্তিত হলেও জেনার ভোল্টেজ সম্পূর্ণ স্থির থাকে',
    takeawayEn: 'Heavily doped junction enables quantum tunneling/avalanche breakdown that clamps voltage rock-solid.',
    takeawayBn: 'উচ্চ ডোপিংয়ের কারণে কোয়ান্টাম টানেলিং বা অ্যাভালাঞ্চ ব্রেকডাউনে ভোল্টেজ একদম স্থির থাকে।',
    variables: [
      { sym: 'V_Z', latex: 'V_Z', unit: '5.1 V / 6.8 V', nameEn: 'Zener Voltage', nameBn: 'জেনার ব্রেকডাউন ভোল্টেজ', descEn: 'The exact clamping safety voltage number.', descBn: 'নির্ধারিত সুরক্ষা ভোল্টেজ (যেমন ৫.১ বা ৯.১ ভোল্ট)।' },
      { sym: 'I_Z', latex: 'I_Z', unit: 'mA', nameEn: 'Zener Current', nameBn: 'জেনার কারেন্ট', descEn: 'The water streaming backwards through the safety hatch.', descBn: 'পেছনের দরজা দিয়ে বয়ে যাওয়া বাড়তি বিদ্যুৎ।' },
      { sym: 'I_ZK', latex: 'I_{ZK}', unit: '~1 mA', nameEn: 'Knee Current', nameBn: 'ন্যূনতম জেনার কারেন্ট', descEn: 'Minimum reverse current required to enter regulation.', descBn: 'ভোল্টেজ স্থির রাখার জন্য প্রয়োজনীয় সর্বনিম্ন কারেন্ট।' }
    ]
  },
  '14': {
    storyEn: 'Forward Bias is like pressing the green "GO" pedal in a toy car: the gate shrinks to nothing and you zoom across! Reverse Bias is pressing the red "STOP" brake: the barrier grows thicker and wider like a giant castle moat full of hungry crocodiles so no one can cross!',
    storyBn: 'ফরোয়ার্ড বায়াস হলো খেলনা গাড়ির সবুজ এক্সিলারেটরে চাপ দেওয়া—সামনের ব্যারিকেড একদম মুছে যায় আর তুমি সাঁ সাঁ করে ছুটে চলো! আর রিভার্স বায়াস হলো লাল ব্রেক চেপে ধরা—মাঝখানের দেয়ালটা অনেক চওড়া হয়ে এক বিশাল কুমিরভরা খালের মতো হয়ে যায়, ফলে কেউ পার হতে পারে না!',
    mathFormula: '\\text{Fwd: } V_D > V_K \\ (R_F \\downarrow) \\ \\Big| \\ \\text{Rev: } V_D < 0 \\ (R_R \\uparrow, W_{\\text{dep}} \\uparrow)',
    formulaDescEn: 'Depletion Layer: Forward narrows the barrier (W ↓); Reverse widens the barrier (W ↑).',
    formulaDescBn: 'ডিপ্লেশন অঞ্চল: ফরোয়ার্ডে দেয়াল সরু হয়ে ভেঙে যায়, রিভার্সে দেয়াল অনেক চওড়া ও দুর্ভেদ্য হয়ে যায়।',
    verbalReadEn: 'Forward: V_D exceeds Knee Voltage, Barrier Collapses | Reverse: V_D is Negative, Barrier Widens',
    verbalReadBn: 'ফরোয়ার্ড: ভোল্টেজ থ্রেশহোল্ড অতিক্রম করে দেয়াল মুছে যায় | রিভার্স: দেয়াল চওড়া হয়ে বিদ্যুৎ আটকে দেয়',
    takeawayEn: 'External voltage cancels the built-in barrier in forward bias and reinforces it in reverse bias.',
    takeawayBn: 'ফরোয়ার্ড বায়াসে অভ্যন্তরীণ বাধা ভেঙে যায় এবং রিভার্স বায়াসে বাধা আরও দুর্ভেদ্য হয়ে ওঠে।',
    variables: [
      { sym: 'Forward Bias', latex: '\\text{Fwd: } V_D > V_K', unit: '+ to P, - to N', nameEn: 'Forward Conduction', nameBn: 'ফরোয়ার্ড বায়াস', descEn: 'Shrinks barrier to 0V and conducts big milliamp current.', descBn: 'দেয়াল মুছে দিয়ে প্রচুর বিদ্যুৎ প্রবাহিত করে।' },
      { sym: 'Reverse Bias', latex: '\\text{Rev: } V_D < 0', unit: '- to P, + to N', nameEn: 'Reverse Blocking', nameBn: 'রিভার্স বায়াস', descEn: 'Widens barrier and blocks majority carriers.', descBn: 'দেয়াল চওড়া করে মেজরিটি বিদ্যুৎ আটকে দেয়।' }
    ]
  },
  '15': {
    storyEn: 'A Zener Voltage Regulator is like an overflow pipe in a bathtub! If you turn the tap on full blast, the water level never rises too high because the overflow pipe immediately drains the extra water. Your delicate electronics (load) get a perfectly smooth, calm 5 Volts every single second!',
    storyBn: 'জেনার ভোল্টেজ রেগুলেটর হলো বাথটাবের উপচে পড়া পানির পাইপের মতো! তুমি কল যত জোরেই ছাড়ো না কেন, বাড়তি পানি পাইপ দিয়ে গড়িয়ে পড়ে যায় বলে টাবের পানির স্তর কখনো উপচে পড়ে না। তোমার সংবেদনশীল খেলনাগুলো সবসময় শান্ত ও নিরাপদ ৫ ভোল্ট বিদ্যুৎ পায়!',
    mathFormula: 'V_L = V_Z \\quad (\\text{when } V_{Th} \\ge V_Z), \\quad I_S = \\frac{V_{in} - V_Z}{R_S} = I_Z + I_L',
    formulaDescEn: 'V_L = V_Z (constant output voltage) across the load resistor.',
    formulaDescBn: 'V_L = V_Z (লোড রেজিস্টরে সবসময় স্থির ভোল্টেজ বজায় থাকে)।',
    verbalReadEn: 'Load Voltage V_L = V_Z; Series Current splits into Zener Current plus Load Current',
    verbalReadBn: 'লোড ভোল্টেজ V_L = V_Z; সিরিজ কারেন্ট জেনার কারেন্ট ও লোড কারেন্টে বিভক্ত হয়',
    takeawayEn: 'Series resistor absorbs excess input voltage variations while the parallel Zener diode locks output voltage.',
    takeawayBn: 'সিরিজ রোধ বাড়তি ভোল্টেজ নিজের ওপর ড্রপ করে আর জেনার ডায়োড লোডে নিখুঁত স্থির ভোল্টেজ বজায় রাখে।',
    variables: [
      { sym: 'V_in', latex: 'V_{in}', unit: 'V', nameEn: 'Unregulated Input', nameBn: 'অস্থির ইনপুট ভোল্টেজ', descEn: 'Jumping fluctuating voltage from your raw power supply.', descBn: 'উঁচু-নিচু ওঠানামা করা কাঁচা ভোল্টেজ।' },
      { sym: 'V_L', latex: 'V_L = V_Z', unit: 'Constant V', nameEn: 'Regulated Output', nameBn: 'শান্ত স্থির আউটপুট', descEn: 'Rock-solid smooth voltage locked strictly to V_Z.', descBn: 'জেনারের কল্যাণে একদম স্থির হয়ে যাওয়া নিরাপদ ভোল্টেজ।' },
      { sym: 'R_S', latex: 'R_S', unit: 'Ω', nameEn: 'Series Dropping Resistor', nameBn: 'সিরিজ ড্রপিং রোধ', descEn: 'Absorbs voltage difference (V_in - V_Z) to protect the diode.', descBn: 'অতিরিক্ত ভোল্টেজ খেয়ে ফেলে জেনারকে অতিরিক্ত তাপে পোড়া থেকে বাঁচায়।' }
    ]
  },
  '16': {
    storyEn: 'A BJT Transistor is like a giant water dam with a tiny little control valve! With your little pinky finger, you twist the tiny Base valve ($I_B$). That tiny twist swings open a massive iron gate, unleashing a roaring waterfall from the Collector to the Emitter ($I_C = \\beta \\cdot I_B$)! You are 100 times stronger than before!',
    storyBn: 'একটি BJT ট্রানজিস্টর হলো এক বিশাল পানির বাঁধ, যার সামনে একটা পুঁচকে কন্ট্রোল নব লাগানো! তুমি তোমার কনিষ্ঠা আঙুল দিয়ে ছোট্ট বেইজ নবটিকে একটু মোচড় দেবে ($I_B$), আর সাথে সাথে বাঁধের বিশাল লোহার ফটক খুলে গিয়ে ওপর থেকে এক মহা পানির ঝরনা নিচে নামবে ($I_C = \\beta \\cdot I_B$)! তোমার ছোট্ট শক্তি ১০০ গুণ বড় হয়ে গেল!',
    mathFormula: 'I_E = I_C + I_B, \\quad I_C = \\beta I_B, \\quad \\alpha = \\frac{\\beta}{\\beta + 1}',
    formulaDescEn: 'I_C = β · I_B: Collector current is the Base current multiplied by superpower β (usually 100 to 300)!',
    formulaDescBn: 'I_C = β · I_B: কালেক্টর কারেন্ট হলো বেইজ কারেন্টের চেয়ে সুপারপাওয়ার β গুণ (১০০ থেকে ৩০০ গুণ) বড়!',
    verbalReadEn: 'Emitter Current = Collector + Base Current; Collector Current = Beta times Base Current',
    verbalReadBn: 'এমিটার কারেন্ট = কালেক্টর + বেইজ কারেন্ট; কালেক্টর কারেন্ট = বিটা × বেইজ কারেন্ট',
    takeawayEn: 'Current-controlled amplifier: A microampere Base injection sweeps 99% of carriers into the Collector.',
    takeawayBn: 'ক্ষুদ্র বেস কারেন্ট (µA) নিয়ন্ত্রণ করে বহুগুণ বড় কালেক্টর কারেন্ট (mA) বিবর্ধিত করা যায়।',
    variables: [
      { sym: 'I_B', latex: 'I_B', unit: 'µA', nameEn: 'Base Control Current', nameBn: 'ছোট বেইজ কারেন্ট (I_B)', descEn: 'A few microamperes injected into the thin Base layer.', descBn: 'মাঝখানের বেইজে দেওয়া সামান্য মাইক্রো-অ্যাম্পিয়ার বিদ্যুৎ।' },
      { sym: 'I_C', latex: 'I_C', unit: 'mA', nameEn: 'Collector Output Current', nameBn: 'বিশাল কালেক্টর কারেন্ট (I_C)', descEn: 'Big milliamperes flowing from Collector to Emitter.', descBn: 'ওপর থেকে নিচে ছুটে চলা শতগুণ বড় মিলি-অ্যাম্পিয়ার বিদ্যুৎ।' },
      { sym: 'β (Beta)', latex: '\\beta', unit: 'Gain (50 - 300)', nameEn: 'Current Gain Factor', nameBn: 'শক্তি বৃদ্ধির গুণক (β)', descEn: 'How many times the transistor magnifies your signal.', descBn: 'ট্রানজিস্টর তোমার সংকেতকে কত গুণ বড় করে তুলবে।' }
    ]
  },
  '17': {
    storyEn: 'A Half-Wave Rectifier is like an elevator that only goes UP, never down! AC electricity is a swinging pendulum that swings forward, then backward. The diode lets the forward swing march through, but cuts the backward swing completely flat! Half of the wave gets through, turning alternating wave into bumpy DC!',
    storyBn: 'হাফ-ওয়েভ রেক্টিফায়ার হলো এমন এক লিফট যা কেবল ওপরের দিকে ওঠে, কখনো নিচে নামে না! AC বিদ্যুৎ হলো ঘড়ির দোলকের মতো—একবার সামনে যায়, আবার পেছনে আসে। ডায়োডটি সামনের দোলকে যেতে দেয়, কিন্তু পেছনের দোলকে এক কোপে কেটে সমান করে দেয়! ফলে অর্ধেক ঢেউ পার হয়ে তৈরি হয় একমুখী ডিসি বিদ্যুৎ!',
    mathFormula: 'V_{dc} = \\frac{V_m}{\\pi} \\approx 0.318\\, V_m, \\quad V_x = E \\cdot \\frac{R_x}{R_{\\text{total}}}',
    formulaDescEn: 'V_dc = 0.318 · V_m: The average flat voltage is about one-third of the peak wave height.',
    formulaDescBn: 'V_dc = ০.৩১৮ · V_m: ঢেউয়ের সর্বোচ্চ চূড়ার প্রায় তিন ভাগের এক ভাগ ডিসি ভোল্টেজ পাওয়া যায়।',
    verbalReadEn: 'Average DC Voltage = V_m / Pi (approx 0.318 V_m); Series Voltage divides by resistance ratio',
    verbalReadBn: 'গড় ডিসি ভোল্টেজ = V_m / π (প্রায় ০.৩১৮ V_m); ভোল্টেজ ডিভাইডারে রোধের অনুপাতে ভোল্টেজ ড্রপ হয়',
    takeawayEn: 'Single diode conducts during the positive half-cycle and blocks during the negative half-cycle with 40.6% max efficiency.',
    takeawayBn: 'একটিমাত্র ডায়োড পজিটিভ অর্ধচক্রে বিদ্যুৎ পরিবহন করে এবং নেগেটিভে সম্পূর্ণ বন্ধ থাকে।',
    variables: [
      { sym: 'V_m', latex: 'V_m', unit: 'V', nameEn: 'Peak Wave Voltage', nameBn: 'ঢেউয়ের সর্বোচ্চ চূড়া (V_m)', descEn: 'The tallest tip of the input AC sine wave.', descBn: 'AC ঢেউয়ের সবচেয়ে উঁচু চূড়ার মান।' },
      { sym: 'V_dc', latex: 'V_{dc}', unit: '0.318 V_m', nameEn: 'Average DC Floor', nameBn: 'গড় ডিসি ভোল্টেজ', descEn: 'The steady usable DC level extracted from the wave.', descBn: 'একটানা ব্যবহারের উপযোগী শান্ত ডিসি শক্তি।' },
      { sym: 'η', latex: '\\eta = 40.6\\%', unit: '%', nameEn: 'Maximum Efficiency', nameBn: 'সর্বোচ্চ কার্যক্ষমতা', descEn: 'Theoretical upper limit for half-wave conversion.', descBn: 'হাফ-ওয়েভের তাত্ত্বিক সর্বোচ্চ রূপান্তর ক্ষমতা।' }
    ]
  },
  '18': {
    storyEn: 'A Center-Tapped Full-Wave Rectifier has two friendly helper diodes taking turns! When the AC wave swings positive, Diode 1 pushes the toy car forward. When the wave swings negative, Diode 2 pushes the toy car forward too! No swings are wasted—the car gets pushed forward TWICE as often with 81% efficiency!',
    storyBn: 'সেন্টার-ট্যাপড ফুল-ওয়েভ রেক্টিফায়ারে দুজন বন্ধু ডায়োড পালাক্রমে কাজ করে! ঢেউ যখন সামনের দিকে যায়, ১ম ডায়োড খেলনা গাড়িটাকে ধাক্কা দেয়। আর ঢেউ যখন উল্টো দিকে যায়, তখন ২য় ডায়োড গাড়িটাকে একই দিকে ধাক্কা দেয়! কোনো ঢেউ নষ্ট হয় না—গাড়িটি দ্বিগুণ গতিতে একটানা সামনে ছুটে চলে!',
    mathFormula: 'V_{dc} = \\frac{2 V_m}{\\pi} \\approx 0.636\\, V_m, \\quad f_{out} = 2 f_{in}, \\quad \\eta = 81.2\\%',
    formulaDescEn: 'V_dc = 0.636 · V_m: Double the average DC voltage of a half-wave rectifier!',
    formulaDescBn: 'V_dc = ০.৬৩৬ · V_m: হাফ-ওয়েভের চেয়ে দ্বিগুণ ডিসি শক্তি পাওয়া যায় এবং কোনো ঢেউ বাদ পড়ে না!',
    verbalReadEn: 'Full-Wave DC Voltage = 2 V_m / Pi (approx 0.636 V_m); Ripple Frequency = 2 × Input Frequency',
    verbalReadBn: 'ফুল-ওয়েভ গড় ডিসি = ২ V_m / π (প্রায় ০.৬৩৬ V_m); রিপল কম্পাঙ্ক ইনপুটের দ্বিগুণ হয়',
    takeawayEn: 'Two diodes alternately conduct each half-cycle, doubling average DC voltage to 0.636 V_m with 81.2% efficiency.',
    takeawayBn: 'উভয় অর্ধচক্রকেই একমুখী করায় ডিসি ভোল্টেজ দ্বিগুণ হয় এবং কার্যক্ষমতা বেড়ে ৮১.২% হয়।',
    variables: [
      { sym: 'D1 & D2', latex: 'D_1 \\& D_2', unit: 'Alternating Pair', nameEn: 'Tag-Team Diodes', nameBn: 'পালাক্রমের দুই বন্ধু ডায়োড', descEn: 'D1 conducts on positive half, D2 conducts on negative half.', descBn: 'একজন ধনাত্মক অর্ধে কাজ করে, আরেকজন ঋণাত্মক অর্ধে।' },
      { sym: 'V_dc', latex: 'V_{dc}', unit: '0.636 V_m', nameEn: 'Full-Wave DC Output', nameBn: 'দ্বিগুণ ডিসি ভোল্টেজ', descEn: 'Twice the average DC voltage of a half-wave circuit.', descBn: 'হাফ-ওয়েভের চেয়ে দ্বিগুণ ডিসি ভোল্টেজ।' },
      { sym: 'η = 81.2%', latex: '\\eta = 81.2\\%', unit: '%', nameEn: 'High Efficiency', nameBn: 'উচ্চ কার্যক্ষমতা (৮১.২%)', descEn: 'Converts both halves of the AC wave into unidirectional DC.', descBn: 'উভয় ঢেউকেই কাজে লাগিয়ে সর্বোচ্চ কার্যক্ষমতা দেয়।' }
    ]
  },
  '19': {
    storyEn: 'A Bridge Rectifier is a team of 4 diodes arranged in a magic diamond maze! No matter which way the electricity wind blows (positive or negative), the diamond maze always routes the electricity runners out through the same front door into your battery!',
    storyBn: 'ব্রিজ রেক্টিফায়ার হলো ৪টি ডায়োড দিয়ে তৈরি একটি হীরক আকারের গোলকধাঁধা! বিদ্যুতের হাওয়া যেদিক থেকেই আসুক না কেন, এই জাদুকরী গোলকধাঁধা বিদ্যুৎকে ঘুরিয়ে ফিরিয়ে সবসময় সোজা সদর দরজা দিয়ে বের করে ব্যাটারিতে পাঠায়!',
    mathFormula: 'V_{dc} = 0.636\\,(V_m - 2V_K) \\ \\Big| \\ \\text{Clipper: Limits } V \\ \\Big| \\ \\text{Clamper: Shifts DC}',
    formulaDescEn: 'V_dc = 0.636 · (V_m - 1.4V): 4-diode bridge gives full-wave power with low-cost standard transformers.',
    formulaDescBn: 'V_dc = ০.৬৩৬ · (V_m - ১.৪V): ৪টি ডায়োডের ব্রিজ দিয়ে সস্তায় এবং নিখুঁতভাবে পুরো ঢেউকে ডিসিতে রূপান্তর করা যায়।',
    verbalReadEn: 'Bridge DC Output = 0.636(V_m - 2V_K); Clipper cuts waveform peaks; Clamper adds a DC offset',
    verbalReadBn: 'ব্রিজ আউটপুট = ০.৬৩৬(V_m - ২V_K); ক্লিপার ঢেউয়ের অংশ কাটে; ক্ল্যাম্পার ডিসি লেভেল পরিবর্তন করে',
    takeawayEn: 'Bridge configuration provides full-wave rectification using 4 diodes without requiring a center-tapped transformer.',
    takeawayBn: 'সেন্টার-ট্যাপ ট্রান্সফরমার ছাড়াই ৪টি ডায়োড ব্রিজের মাধ্যমে পূর্ণ ফুল-ওয়েভ ডিসি রূপান্তর দেয়।',
    variables: [
      { sym: 'D1-D2 & D3-D4', latex: 'D_{1,2} \\& D_{3,4}', unit: 'Diagonal Pairs', nameEn: 'Diagonal Diode Pairs', nameBn: 'জোড়ায় জোড়ায় বন্ধু ডায়োড', descEn: 'Two conduct on positive half, other two on negative half.', descBn: 'দুইজন পজিটিভ অর্ধে কাজ করে, বাকি দুইজন নেগেটিভ অর্ধে।' },
      { sym: '2V_K', latex: '2V_K \\approx 1.4\\text{V}', unit: 'V', nameEn: 'Two Diode Drop', nameBn: 'দুই ডায়োডের ড্রপ', descEn: 'Current passes through two series diodes in each half-cycle.', descBn: 'প্রতি অর্ধে দুটি ডায়োড দিয়ে যেতে হয় বলে ১.৪ ভোল্ট ড্রপ হয়।' }
    ]
  },
  '19b': {
    storyEn: 'A Common-Emitter Amplifier is like a microphone at a rock concert! You whisper a tiny gentle song into the Base, and the transistor blows it up into a gigantic boom out the speaker! But it also flips the wave upside down like an upside-down somersault (180° phase inversion)!',
    storyBn: 'কমন-এমিটার অ্যাম্প্লিফায়ার হলো রক কনসার্টের বিশাল মাইকের মতো! তুমি বেইজে খুব নরম সুরে ফিসফিস করে গান গাইবে, আর ট্রানজিস্টর স্পিকার দিয়ে সেই গানটিকে মেঘের মতো গর্জন করে বাজাবে! তবে এটা গানটির ঢেউকে উল্টো ডিগবাজি খাইয়ে দেয় (১৮০ ডিগ্রি উল্টে যায়)!',
    mathFormula: 'I_E = I_C + I_B, \\quad I_C = \\beta I_B, \\quad V_{CE} = V_{CC} - I_C R_C, \\quad \\Delta\\theta = 180^\\circ',
    formulaDescEn: 'A_v = -R_C / r_e: Negative sign means upside-down flip; big R_C gives giant volume gain!',
    formulaDescBn: 'A_v = -R_C / r_e: মাইনাস চিহ্ন মানে উল্টো ডিগবাজি, আর বড় R_C মানে অনেক গুণ জোরে আওয়াজ!',
    verbalReadEn: 'Collector-Emitter Voltage V_CE = V_CC - I_C*R_C; Output Phase is Inverted by 180 Degrees',
    verbalReadBn: 'কালেক্টর ভোল্টেজ = V_CC - I_C*R_C; আউটপুট সিগন্যালে ১৮০° উল্টো দশাপার্থক্য তৈরি হয়',
    takeawayEn: 'Common-Emitter delivers the highest combined voltage, current, and power amplification with an inverted output.',
    takeawayBn: 'কমন-এমিটার মোডে সর্বোচ্চ পাওয়ার গেইন পাওয়া যায় এবং আউটপুট সিগন্যাল ১৮০° উল্টে যায়।',
    variables: [
      { sym: 'A_v', latex: 'A_v = -\\frac{R_C}{r_e}', unit: 'Gain (e.g. -150)', nameEn: 'Voltage Gain', nameBn: 'ভোল্টেজ গেইন (A_v)', descEn: 'How many times louder the signal becomes.', descBn: 'তোমার ছোট্ট ফিসফিসানি কত গুণ বড় হলো।' },
      { sym: '180° Inversion', latex: '\\Delta\\theta = 180^\\circ', unit: 'Phase Shift', nameEn: 'Phase Inversion', nameBn: '১৮০° উল্টে যাওয়া', descEn: 'When input goes up, output collector voltage pulls down.', descBn: 'ইনপুট ওপরে উঠলে আউটপুট নিচে নেমে উল্টো ডিগবাজি খায়।' }
    ]
  },
  '20': {
    storyEn: 'FET stands for Field Effect Transistor! Unlike BJT which drinks current like a thirsty camel, FET has an invisible forcefield! It uses voltage like a magic magnetic wand to control current without drawing ANY electricity into its control gate!',
    storyBn: 'FET মানে ফিল্ড ইফেক্ট ট্রানজিস্টর! BJT যেমন পানির মতো কারেন্ট খায়, FET কিন্তু মোটেও কারেন্ট খায় না! সে একটা অদৃশ্য জাদুকরী বলয় তৈরি করে। দূর থেকে শুধু ভোল্টেজের জাদুদণ্ড ঘুরিয়ে সে পুরো বিদ্যুৎ প্রবাহকে নিয়ন্ত্রণ করে!',
    mathFormula: 'I_G \\approx 0\\text{ A}, \\quad R_{in} \\ge 10^9\\,\\Omega, \\quad g_m = \\frac{\\Delta I_D}{\\Delta V_{GS}}',
    formulaDescEn: 'Unipolar Device: Only ONE type of charge carrier (majority electrons or holes) does all the walking.',
    formulaDescBn: 'ইউনিপোলার ডিভাইস: এখানে কেবল এক দলের বাহকরাই (শুধু ইলেকট্রন বা শুধু হোল) একা দৌড়াদৌড়ি করে।',
    verbalReadEn: 'Gate Current is Virtually Zero, Input Resistance exceeds 10^9 Ohms, Transconductance g_m sets Voltage Control',
    verbalReadBn: 'গেট কারেন্ট প্রায় শূন্য, ইনপুট রোধ ১০⁹ ওহম ছাড়িয়ে যায়, ট্রান্সকন্ডাক্ট্যান্স g_m কারেন্ট নিয়ন্ত্রণ করে',
    takeawayEn: 'FET is an ultra-high-impedance voltage-controlled unipolar device with zero gate power consumption.',
    takeawayBn: 'FET হলো একটি ভোল্টেজ-নিয়ন্ত্রিত ইউনিপোলার ডিভাইস যার ইনপুট রোধ অত্যন্ত বেশি।',
    variables: [
      { sym: 'I_G ≈ 0 A', latex: 'I_G \\approx 0\\text{ A}', unit: 'Zero Current', nameEn: 'Zero Gate Current', nameBn: 'গেট কারেন্ট শূন্য', descEn: 'No current enters the gate terminal.', descBn: 'গেটের ভেতর দিয়ে কোনো বিদ্যুৎ নষ্ট হয়ে ঢোকে না।' },
      { sym: 'R_in > 10⁹ Ω', latex: 'R_{in} \\ge 10^9\\,\\Omega', unit: 'Gigaohms', nameEn: 'Giant Input Resistance', nameBn: 'বিশাল ইনপুট রোধ (>১০⁹ Ω)', descEn: 'Extremely high input impedance preventing loading effects.', descBn: 'বিশাল রোধ থাকায় আগের সার্কিট থেকে কোনো পাওয়ার টানে না।' },
      { sym: 'g_m', latex: 'g_m', unit: 'mS', nameEn: 'Transconductance', nameBn: 'ট্রান্সকন্ডাক্ট্যান্স', descEn: 'Ratio of change in drain current to change in gate voltage.', descBn: 'গেট ভোল্টেজ পরিবর্তনে ড্রেইন কারেন্ট কতটুকু বাড়ে।' }
    ]
  },
  '21': {
    storyEn: 'The FET family tree has two main branches: JFET (which uses a PN-junction gate) and MOSFET (which puts a super-thin glass insulator under the gate so zero current can EVER touch it)! Both come in N-channel and P-channel flavors!',
    storyBn: 'FET পরিবারের দুটি বড় শাখা আছে: একটি হলো JFET (যার গেটে পি-এন জাংশন থাকে) এবং আরেকটি হলো MOSFET (যার গেটের নিচে কাচের মতো সিলিকন ডাই-অক্সাইডের পাতলা চাদর থাকে যাতে একটুও বিদ্যুৎ স্পর্শ করতে না পারে)!',
    mathFormula: '\\text{FET} \\longrightarrow \\text{JFET (N/P)} \\quad \\& \\quad \\text{MOSFET (D-MOSFET, E-MOSFET)}',
    formulaDescEn: 'FET Classification: JFET (N/P) and MOSFET (Depletion mode and Enhancement mode).',
    formulaDescBn: 'শ্রেণিবিভাগ: JFET (N ও P চ্যানেল) এবং MOSFET (ডিপ্লেশন ও এনহ্যান্সমেন্ট মোড)।',
    verbalReadEn: 'FET Family Splits into JFET (PN junction) and MOSFET (Oxide Insulated Gate)',
    verbalReadBn: 'FET পরিবার দুই ভাগে বিভক্ত: JFET (পি-এন জাংশন) এবং MOSFET (অন্তরক গেট)',
    takeawayEn: 'JFET uses reverse-biased PN gates; MOSFET uses an insulated SiO₂ dielectric layer for trillion-ohm impedance.',
    takeawayBn: 'JFET রিভার্স বায়াসড জাংশন দিয়ে এবং MOSFET কাচের মতো সিলিকন ডাই-অক্সাইড অন্তরক দিয়ে চলে।',
    variables: [
      { sym: 'JFET', latex: '\\text{JFET}', unit: 'PN Gate', nameEn: 'Junction Gate FET', nameBn: 'জেফেট (JFET)', descEn: 'Reverse-biased PN gate pinches the channel.', descBn: 'রিভার্স বায়াস দিয়ে চ্যানেলকে চেপে ধরে।' },
      { sym: 'MOSFET', latex: '\\text{MOSFET}', unit: 'SiO₂ Insulated', nameEn: 'Insulated Gate FET', nameBn: 'মসফেট (MOSFET)', descEn: 'Glass insulator gate gives trillion-ohm impedance.', descBn: 'অন্তরক গেট দিয়ে নিখুঁত নিয়ন্ত্রণ দেয়।' }
    ]
  },
  '22': {
    storyEn: 'Shockley’s Equation for JFET describes the magical curved slide! When the gate is relaxed (0V), maximum current ($I_{DSS}$) roars through. As you push the gate down with negative voltage ($V_{GS}$), the current drops down like a curved parabola until it completely pinches shut at $V_P$!',
    storyBn: 'জেফেটের জন্য শকলে সমীকরণ হলো এক চমৎকার বাঁকানো পিছলান! গেট যখন শান্ত থাকে (০ ভোল্ট), তখন সবচেয়ে বেশি কারেন্ট ($I_{DSS}$) ছুটে যায়। তুমি গেটে যত বেশি মাইনাস ভোল্টেজ ($V_{GS}$) দেবে, পানির ধারা ততই কমতে কমতে একসময় $V_P$ তে এসে একদম বন্ধ হয়ে যাবে!',
    mathFormula: '\\text{JFET: } I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2 \\ \\Big| \\ \\text{E-MOSFET: } I_D = k(V_{GS} - V_T)^2',
    formulaDescEn: 'I_D = I_{DSS} · (1 - V_{GS} / V_P)²: Parabolic curve from maximum current I_DSS down to zero cutoff at V_P.',
    formulaDescBn: 'I_D = I_{DSS} · (১ - V_{GS} / V_P)²: প্যারাবোলিক বাঁকা নিয়মে সর্বোচ্চ কারেন্ট থেকে নেমে এসে শূন্য হয়ে যায়।',
    verbalReadEn: 'JFET Drain Current = I_DSS × (1 - V_GS / V_P) squared; E-MOSFET: k × (V_GS - V_T) squared',
    verbalReadBn: 'JFET ড্রেইন কারেন্ট = I_DSS × (১ - V_GS / V_P)²; E-MOSFET: k × (V_GS - V_T)²',
    takeawayEn: 'JFET follows Shockley’s square-law depletion curve; E-MOSFET only turns ON above threshold voltage V_T.',
    takeawayBn: 'JFET শকলে স্কয়ার-ল মেনে সংকুচিত হয়; আর E-MOSFET থ্রেশহোল্ড ভোল্টেজ V_T পার হলেই কেবল চালু হয়।',
    variables: [
      { sym: 'I_{DSS}', latex: 'I_{DSS}', unit: 'mA', nameEn: 'Max Saturation Current', nameBn: 'সর্বোচ্চ সম্পৃক্ত কারেন্ট', descEn: 'Drain current when Gate is grounded (V_GS = 0V).', descBn: 'গেট খোলা থাকলে সর্বোচ্চ যে কারেন্ট প্রবাহিত হতে পারে।' },
      { sym: 'V_P', latex: 'V_P', unit: '-4 V (N-Ch)', nameEn: 'Pinch-Off Squeeze', nameBn: 'পিঞ্চ-অফ ভোল্টেজ', descEn: 'The gate voltage that completely chokes the channel to 0 mA.', descBn: 'যে ভোল্টেজে চ্যানেলের মুখ পুরোপুরি চেপে বন্ধ হয়ে যায়।' },
      { sym: 'V_GS', latex: 'V_{GS}', unit: 'V (Negative)', nameEn: 'Gate-to-Source Voltage', nameBn: 'গেট-সোর্স ভোল্টেজ', descEn: 'Reverse bias voltage controlling channel width.', descBn: 'চ্যানেলের মুখ বন্ধ করার জন্য প্রযুক্ত ঋণাত্মক ভোল্টেজ।' }
    ]
  },
  '23': {
    storyEn: 'JFET Physical Pinch-Off: Imagine stepping on a soft garden hose with your sneaker! Near the faucet it is wide open, but near the nozzle it pinches tighter into a wedge shape! When your sneaker presses down all the way, the two rubber walls touch and the stream locks at a steady, unchanging flow!',
    storyBn: 'জেফেটের পিঞ্চ-অফ প্রক্রিয়া: মনে করো বাগানের নরম রাবারের পাইপের ওপর তুমি স্নিকার্স জুতো দিয়ে পাড়া দিচ্ছো! ওপরের দিকে পাইপের মুখ চ্যাপ্টা হয়ে সরু হয়ে যায়। যখন দুই পাশের দেয়াল পরস্পরের সাথে প্রায় লেগে যায়, তখন পানির প্রবাহ আর বাড়তে পারে না—একদম স্থির হয়ে যায়!',
    mathFormula: 'I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2, \\quad I_G = 0\\text{ A}',
    formulaDescEn: 'Wedge-shaped depletion region touches at the Drain end when V_DS ≥ |V_P| - |V_{GS}|.',
    formulaDescBn: 'ড্রেন প্রান্তে দুই পাশের ডিপ্লেশন লেয়ার একে অপরকে ছুঁয়ে ফেলে কারেন্টকে স্থির করে দেয়।',
    verbalReadEn: 'Drain Current locks at Constant Saturation Value when Drain Voltage exceeds Pinch-Off',
    verbalReadBn: 'ড্রেইন ভোল্টেজ পিঞ্চ-অফ সীমা অতিক্রম করলে ড্রেইন কারেন্ট সম্পৃক্ত স্থির মানে পৌঁছে যায়',
    takeawayEn: 'Depletion width is widest near the Drain end because reverse bias is greatest there (V_GD = V_GS - V_DS).',
    takeawayBn: 'ড্রেনের কাছে রিভার্স ভোল্টেজ বেশি থাকায় সেখানে ডিপ্লেশন লেয়ার আগে স্পর্শ করে স্যাচুরেশন আনে।',
    variables: [
      { sym: 'Wedge Depletion', latex: 'W_{\\text{dep}}', unit: 'Shape', nameEn: 'Wedge-Shaped Barrier', nameBn: 'ওয়েজ আকারের দেয়াল', descEn: 'Wider near Drain because Drain has the highest reverse voltage.', descBn: 'ড্রেনের কাছে বেশি চওড়া হয়ে চ্যানেল বন্ধ করতে চায়।' },
      { sym: 'Pinch-Off Locus', latex: 'V_{DS} = |V_P| - |V_{GS}|', unit: 'Boundary', nameEn: 'Saturation Boundary', nameBn: 'স্যাচুরেশন সীমারেখা', descEn: 'The voltage point where constant-current mode begins.', descBn: 'যে ভোল্টেজে স্থির কারেন্ট প্রবাহ শুরু হয়।' }
    ]
  },
  '24': {
    storyEn: 'BJT vs JFET Battle: BJT is a muscle car that burns lots of base fuel ($I_B$) to go fast, but gets super hot! JFET is a futuristic magnetic hovercraft that glides effortlessly with zero gate fuel and never overheats! Both are amazing champions of electronics!',
    storyBn: 'BJT বনাম JFET যুদ্ধ: BJT হলো এক পুরনো দিনের রেসিং কার যা প্রচুর বেইজ জ্বালানি ($I_B$) পুড়িয়ে দৌড়ায় এবং খুব গরম হয়ে যায়! আর JFET হলো ভবিষ্যতের এক জাদুকরী হোভারক্রাফট—যা একটুও জ্বালানি না খেয়ে শুধু আলতো বাতাসে ভেসে বেড়ায় এবং কখনো বেশি গরম হয় না!',
    mathFormula: '\\text{Ohmic: } V_{DS} < |V_P| - |V_{GS}| \\ \\Big| \\ \\text{Saturation: } I_D = I_{DSS}\\left(1 - \\frac{V_{GS}}{V_P}\\right)^2',
    formulaDescEn: 'BJT: Current-controlled I_C = β·I_B; JFET: Voltage-controlled I_D = I_DSS(1 - V_GS/V_P)², R_in > 10⁹ Ω.',
    formulaDescBn: 'BJT কারেন্ট দিয়ে চলে (I_C = β·I_B), আর JFET ভোল্টেজ দিয়ে চলে (R_in > ১০⁹ Ω)।',
    verbalReadEn: 'Ohmic Region: Linear Voltage-Controlled Resistor | Saturation Region: Constant Current Source',
    verbalReadBn: 'ওহমিক অঞ্চল: রৈখিক রোধের মতো আচরণ | স্যাচুরেশন অঞ্চল: স্থির কারেন্ট উৎস',
    takeawayEn: 'Below pinch-off, JFET acts as a voltage-variable resistor; above pinch-off, it acts as a constant current source.',
    takeawayBn: 'পিঞ্চ-অফের নিচে জেফেট পরিবর্তনশীল রোধের মতো চলে এবং ওপরে স্থির কারেন্ট হিসেবে কাজ করে।',
    variables: [
      { sym: 'Ohmic Region', latex: 'V_{DS} < |V_P| - |V_{GS}|', unit: 'Linear Region', nameEn: 'Voltage-Variable Resistor', nameBn: 'ওহমিক রোধ অঞ্চল', descEn: 'Channel resistance changes with gate voltage.', descBn: 'ভোল্টেজ বাড়ালে রৈখিকভাবে কারেন্ট বাড়ে।' },
      { sym: 'Saturation Region', latex: 'V_{DS} \\ge |V_P| - |V_{GS}|', unit: 'Active Region', nameEn: 'Constant Current Source', nameBn: 'স্থির কারেন্ট অঞ্চল', descEn: 'Current is flat and constant despite rising V_DS.', descBn: 'ড্রেইন ভোল্টেজ বাড়ালেও কারেন্ট সম্পূর্ণ স্থির থাকে।' }
    ]
  }
};

// Aliases for topic IDs and combined numbers
ELI5_TOPIC_DATA['19/20'] = ELI5_TOPIC_DATA['19'];
ELI5_TOPIC_DATA['20a'] = ELI5_TOPIC_DATA['19'];
ELI5_TOPIC_DATA['19 (BJT)'] = ELI5_TOPIC_DATA['19b'];
