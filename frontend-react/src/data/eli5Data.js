// ============================================================================
// 5-YEAR-OLD (ELI5) EXPLANATIONS & EVERYDAY ANALOGIES FOR ALL 25 TOPICS
// Fun, super-simple, intuitive stories in fluent English & Bengali
// ============================================================================

export const ELI5_TOPIC_DATA = {
  '0': {
    storyEn: 'A diode is like a fun one-way playground slide! You can only slide DOWN from top to bottom (Anode to Cathode). If you try to climb backwards up the slide, a big rubber door slams shut and blocks you! But to slide down, you have to give the little front gate a gentle push of 0.7 volts with your shoes before it swings open!',
    storyBn: 'ডায়োড হলো খেলার পার্কের একটি একমুখী পিছলে পড়ার স্লিপার! তুমি শুধু ওপর থেকে নিচে পিছলে নামতে পারবে (অ্যানোড থেকে ক্যাথোড)। যদি নিচ থেকে উল্টো দিকে উঠতে চাও, একটা বড় রবারের দরজা খটাস করে বন্ধ হয়ে তোমাকে আটকে দেবে! আর নিচে পিছলানোর জন্য তোমাকে পায়ের জুতো দিয়ে দরজায় ০.৭ ভোল্টের একটু আলতো ধাক্কা দিতে হবে, ব্যস দরজাটা খুলে যাবে!',
    formulaDescEn: 'Shockley Diode Equation explains how many electron runners jump across the gate when you push it with voltage.',
    formulaDescBn: 'শকলে ডায়োড সমীকরণ বলে দেয় তুমি কত জোরে ভোল্টেজের ধাক্কা দিলে কতগুলো ইলেকট্রন দৌড়বিদ গেট পার হয়ে ছুটে যাবে।',
    variables: [
      { sym: 'I_D', nameEn: 'Electric Current', nameBn: 'বিদ্যুৎ প্রবাহ', descEn: 'Number of little electron runners streaming through per second.', descBn: 'প্রতি সেকেন্ডে কতগুলো পুঁচকে ইলেকট্রন দৌড়ে পার হচ্ছে।' },
      { sym: 'V_D', nameEn: 'Voltage Push', nameBn: 'ভোল্টেজের ধাক্কা', descEn: 'How hard you push the gate with your battery.', descBn: 'তোমার ব্যাটারি দিয়ে তুমি গেটে কত জোরে ধাক্কা দিচ্ছো।' },
      { sym: 'V_K', nameEn: 'Knee Push (~0.7V)', nameBn: 'দরজার প্রতিরোধ (~০.৭V)', descEn: 'The tiny spring you have to push past before the door opens.', descBn: 'দরজা খোলার জন্য যে সামান্য শক্ত স্প্রিংটাকে দাবাতে হয়।' },
      { sym: 'I_S', nameEn: 'Tiny Leaking Drops', nameBn: 'চুইয়ে পড়া সামান্য ফোঁটা', descEn: 'A few naughty droplets that sneak backwards under the closed door.', descBn: 'বন্ধ দরজার ফাঁক দিয়ে উল্টো দিকে চুইয়ে পড়া সামান্য দু-একটা ফোঁটা।' }
    ]
  },
  '1': {
    storyEn: 'Imagine all the little Silicon atoms are children in a preschool playground! Each Silicon child has 4 hands. To stay completely safe and happy, every child holds hands with 4 best friends around them in a big circle. When all 8 hands are locked together, they feel cozy and peaceful like a locked puzzle, so nobody can run away!',
    storyBn: 'মনে করো সব সিলিকন পরমাণু হলো কিন্ডারগার্টেন স্কুলের ছোট ছোট শিশু! প্রতিটা শিশুর ৪টি করে হাত আছে। তারা শান্ত ও সুরক্ষিত থাকতে পাশের ৪ জন প্রিয় বন্ধুর হাত শক্ত করে ধরে গোল হয়ে দাঁড়িয়ে থাকে। যখন সবার ৮টি হাত এভাবে শক্ত করে জোড়া লেগে যায়, তখন কেউ আর একা একা দুষ্টুমি করে দৌড়ে পালাতে পারে না!',
    formulaDescEn: '4 Valence e⁻ + 4 Neighbor e⁻ = 8 Stable Octet. Octet means having 8 happy handshakes!',
    formulaDescBn: '৪টি নিজের হাত + ৪ জন বন্ধুর হাত = ৮টি হাতের শক্তিশালী বন্ধন। ৮ হাত মেলালে বাচ্চারা সবচেয়ে খুশি ও শান্ত থাকে!',
    variables: [
      { sym: 'Si (Z=14)', nameEn: 'Silicon Atom', nameBn: 'সিলিকন বন্ধু', descEn: 'A 4-handed friendly builder block.', descBn: '৪ হাতওয়ালা বন্ধুবৎসল একটি খুদে বন্ধু।' },
      { sym: 'Octet (8)', nameEn: 'Stable 8-Handshake', nameBn: '৮ হাতের বন্ধন', descEn: 'The magical number of hands to make atoms happy.', descBn: 'সবচেয়ে আরামদায়ক এবং শক্ত বন্ধন যেখানে কেউ নড়ে না।' },
      { sym: '0 Kelvin', nameEn: 'Super Freeze', nameBn: 'পরম ঠান্ডা', descEn: 'Everyone is frozen like statues holding hands.', descBn: 'সবাই একদম বরফের মতো জমে স্থির হয়ে থাকে, কেউ নড়তে পারে না।' }
    ]
  },
  '2': {
    storyEn: 'Pure Intrinsic Silicon is like a completely clean, shiny crystal mirror with zero dirt. When the sun shines and the room gets warm (300K), some children get too energetic and let go of their handshakes! The child who starts running freely is a "Free Electron", and the empty spot they left behind is a "Hole". For every runner born, exactly one empty chair is created!',
    storyBn: 'বিশুদ্ধ ইন্ট্রিনসিক সিলিকন হলো ধুলোবালি ছাড়া একদম চকচকে কাচের ঘরের মতো! যখন রোদ ওঠে আর ঘরটা গরম হয়, তখন কিছু বাচ্চা বেশি আনন্দ পেয়ে বন্ধুর হাত ছেড়ে দৌড়াতে শুরু করে! যে বাচ্চাটা দৌড়াচ্ছে সে হলো "মুক্ত ইলেকট্রন", আর সে যে ফাঁকা জায়গাটা রেখে গেল, সেটা হলো "হোল"। যতজন দৌড়াবে, ঠিক ততটাই খালি চেয়ার তৈরি হবে!',
    formulaDescEn: 'n = p = n_i means free runners (n) ALWAYS equal empty spots (p) in pure crystals!',
    formulaDescBn: 'n = p = n_i মানে বিশুদ্ধ সিলিকনে যতগুলো দৌড়বিদ থাকবে, ঠিক ততগুলোই খালি বসার জায়গা থাকবে!',
    variables: [
      { sym: 'n', nameEn: 'Free Runners (Electrons)', nameBn: 'ছুটে চলা দৌড়বিদ (ইলেকট্রন)', descEn: 'Free electrons carrying negative charges.', descBn: 'মুক্তভাবে ছুটে চলা নেগেটিভ চার্জের বাচ্চারা।' },
      { sym: 'p', nameEn: 'Empty Seats (Holes)', nameBn: 'খালি চেয়ার (হোল)', descEn: 'Vacant spots waiting for another child to sit.', descBn: 'ফাঁকা জায়গা যেখানে পাশের কেউ এসে বসতে পারে।' },
      { sym: 'n_i', nameEn: 'Pure Carrier Count', nameBn: 'স্বাভাবিক দৌড়বিদের সংখ্যা', descEn: 'How many pairs wake up purely from room warmth.', descBn: 'ঘরের স্বাভাবিক গরমে যত জোড়া বন্ধু আলাদা হয়।' }
    ]
  },
  '3': {
    storyEn: 'Extrinsic Semiconductor is like baking a chocolate cake and sprinkling tiny sprinkles of magic sugar on top! Pure silicon is too quiet and lazy. By adding just ONE special pinch of sugar atoms (Doping), we make the material thousands of times more energetic and ready to power up your video games and smartphones!',
    storyBn: 'এক্সট্রিনসিক সেমিকন্ডাক্টর হলো একটা সাধারণ কেকে এক চিমটি জাদুকরী মিষ্টি ছড়িয়ে দেওয়া! খাঁটি সিলিকন খুব শান্ত আর অলস। কিন্তু তার মধ্যে সামান্য একটু বিশেষ অপদ্রব্য মিশিয়ে দিলেই (ডোপিং) সে লাখ গুণ বেশি চটপটে হয়ে ওঠে এবং আমাদের মোবাইল ও কম্পিউটার চালাতে পারে!',
    formulaDescEn: 'n · p = n_i² (Mass-Action Law): Even if you invite millions of runners, the product of runners and empty spots stays balanced by nature!',
    formulaDescBn: 'n · p = n_i² (ম্যাস-অ্যাকশন ল): তুমি যত কোটি নতুন দৌড়বিদই আনো না কেন, তাদের দুজনের গুণফল সবসময় প্রকৃতির নিয়মে স্থির থাকে!',
    variables: [
      { sym: 'Doping', nameEn: 'Magic Ingredient', nameBn: 'ডোপিং বা ভেজাল মেশানো', descEn: 'Adding 1 helper atom for every million host atoms.', descBn: '১০ লাখ সিলিকনের মধ্যে মাত্র ১টি বিশেষ বন্ধু মেশানো।' },
      { sym: 'N_D', nameEn: 'Donor helpers', nameBn: 'দাতা বন্ধু', descEn: 'Atoms that donate extra electron candies.', descBn: 'যে বন্ধুরা বাড়তি চকলেট ইলেকট্রন উপহার দেয়।' },
      { sym: 'N_A', nameEn: 'Acceptor helpers', nameBn: 'গ্রহীতা বন্ধু', descEn: 'Atoms that bring empty seats for friends to sit.', descBn: 'যে বন্ধুরা খালি চেয়ার নিয়ে আসে।' }
    ]
  },
  '4': {
    storyEn: 'P-Type Silicon is made by inviting Boron atoms into the party! Boron only has 3 hands instead of 4. So when Boron holds hands with 3 neighbor kids, it has NO hand for the 4th friend! This leaves an empty chair called a "Hole". When other kids see an empty chair, they jump over to sit in it, making the empty chair appear to walk backwards! That is why we call it P-Type (Positive)!',
    storyBn: 'P-টাইপ তৈরি হয় সিলিকন পার্টিতে বোরন বন্ধুদের দাওয়াত দিয়ে! বোরনের ৪টি হাত নেই, আছে মাত্র ৩টি হাত। তাই ৩ বন্ধুর হাত ধরার পর ৪র্থ জায়গায় কোনো হাত থাকে না—সেখানে তৈরি হয় একটি ফাঁকা চেয়ার বা "হোল"! পেছনের বাচ্চাটি যখন ফাঁকা চেয়ারে এসে বসে, তখন মনে হয় যেন ফাঁকা চেয়ারটাই পেছনের দিকে হেঁটে যাচ্ছে! এজন্য একে পজিটিভ বা P-টাইপ বলে!',
    formulaDescEn: 'p ≈ N_A: The number of walking empty chairs (holes) is almost exactly equal to the number of 3-handed Boron friends you put in!',
    formulaDescBn: 'p ≈ N_A: তুমি যতগুলো ৩ হাতওয়ালা বোরন বন্ধু বসাবে, ঠিক ততগুলোই নতুন খালি চেয়ার (হোল) তৈরি হবে!',
    variables: [
      { sym: 'Boron (B)', nameEn: '3-Handed Friend', nameBn: '৩ হাতওয়ালা বন্ধু (বোরন)', descEn: 'Acceptor atom missing one valence electron.', descBn: 'যার একটি হাত কম থাকায় একটি হোল তৈরি হয়।' },
      { sym: 'Holes (p)', nameEn: 'Walking Empty Chairs', nameBn: 'হাঁটতে থাকা খালি চেয়ার (হোল)', descEn: 'Majority charge carriers in P-Type.', descBn: 'P-টাইপের প্রধান সংখ্যাগুরু বাহক।' },
      { sym: 'Majority', nameEn: 'The Big Crowd', nameBn: 'সংখ্যাগুরু দল', descEn: 'Holes outnumber free electrons by millions to one!', descBn: 'এখানে হোলের সংখ্যা মুক্ত ইলেকট্রনের চেয়ে বহুগুণ বেশি!' }
    ]
  },
  '5': {
    storyEn: 'N-Type Silicon is made by inviting Phosphorus atoms to the party! Phosphorus has 5 hands! It holds hands with 4 silicon neighbors using 4 hands, but its 5th hand has NO ONE to hold! That 5th electron has nothing to do, so it breaks loose and runs around like a hyperactive puppy! Because it brings millions of negative electron puppies, we call it N-Type (Negative)!',
    storyBn: 'N-টাইপ তৈরি হয় পার্টিতে ফসফরাস বন্ধুদের নিয়ে এলে! ফসফরাসের ৫টি হাত আছে! সে ৪ হাত দিয়ে পাশের ৪ জন সিলিকন বন্ধুর হাত ধরে ফেলে, কিন্তু তার ৫ম হাতটি ফাঁকা পড়ে থাকে! সেই ৫ম ইলেকট্রনটির কোনো কাজ না থাকায় সে সারা ক্লাসরুমে চঞ্চল বিড়ালের বাচ্চার মতো দৌড়াদৌড়ি করে! নেগেটিভ ইলেকট্রনে ভরে যায় বলে একে N-টাইপ বলে!',
    formulaDescEn: 'n ≈ N_D: The number of zooming free electrons is almost exactly equal to the number of 5-handed Phosphorus friends you invited!',
    formulaDescBn: 'n ≈ N_D: যতগুলো ৫ হাতওয়ালা ফসফরাস বন্ধু আসবে, ঠিক ততগুলোই মুক্ত ইলেকট্রন স্বাধীনভাবে দৌড়াবে!',
    variables: [
      { sym: 'Phosphorus (P)', nameEn: '5-Handed Friend', nameBn: '৫ হাতওয়ালা বন্ধু (ফসফরাস)', descEn: 'Donor atom donating 1 free electron.', descBn: 'যে বন্ধু ১টি বাড়তি ইলেকট্রন উপহার দেয়।' },
      { sym: 'Electrons (n)', nameEn: 'Zooming Puppies', nameBn: 'ছুটে চলা ইলেকট্রন', descEn: 'Majority charge carriers in N-Type.', descBn: 'N-টাইপের প্রধান সংখ্যাগুরু বাহক।' },
      { sym: 'Donor Ion (P⁺)', nameEn: 'Happy Giver', nameBn: 'পজিটিভ আয়ন', descEn: 'The atom locked in the crystal lattice after giving its candy.', descBn: 'ইলেকট্রন দিয়ে শান্ত হয়ে দাঁড়িয়ে থাকা পরমাণু।' }
    ]
  },
  '6': {
    storyEn: 'A diode family has three famous superhero siblings: 1) Rectifier Diode who turns swinging ocean waves into steady straight marching soldiers, 2) Zener Diode who protects castles from giant lightning bolts, and 3) LED Diode who glows like a magical colorful fairy light!',
    storyBn: 'ডায়োড পরিবারের তিনজন বিখ্যাত সুপারহিরো ভাইবোন আছে: ১) সাধারণ রেক্টিফায়ার ডায়োড—যে সাগরের দোল খাওয়া ঢেউকে সোজা একমুখী সৈন্যে পরিণত করে, ২) জেনার ডায়োড—যে বিদ্যুৎ চমকালে সার্কিটকে রক্ষা করে, এবং ৩) এলইডি ডায়োড—যে রঙিন পরীর মতো আলো ছড়ায়!',
    formulaDescEn: 'Classification: Rectifying, Zener, Light Emitting.',
    formulaDescBn: 'শ্রেণিবিভাগ: রেক্টিফায়ার, জেনার এবং লাইট এমিটিং ডায়োড (LED)।',
    variables: [
      { sym: 'Rectifier', nameEn: 'Traffic Cop', nameBn: 'ট্রাফিক পুলিশ ডায়োড', descEn: 'Lets electricity march in only one direction.', descBn: 'বিদ্যুৎকে শুধু একদিকে যেতে দেয়।' },
      { sym: 'Zener', nameEn: 'Safety Cushion', nameBn: 'সুরক্ষা কুশন জেনার', descEn: 'Regulates voltage so it never spikes too high.', descBn: 'ভোল্টেজ বেশি বাড়লে আটকে দিয়ে সার্কিট বাঁচায়।' },
      { sym: 'LED', nameEn: 'Glow Star', nameBn: 'জাদুকরী বাতি এলইডি', descEn: 'Converts electricity into rainbow photons.', descBn: 'বিদ্যুৎ থেকে রঙিন আলো তৈরি করে।' }
    ]
  },
  '7': {
    storyEn: 'Direct Bandgap is like jumping straight down from a diving board into a pool! The diver lands with a giant SPLASH of bright, colorful light! The electron jumps from the top floor straight down to the bottom floor without hitting any walls, instantly shooting out a sparkling photon of light (like in GaAs and GaN LEDs)!',
    storyBn: 'ডিরেক্ট ব্যান্ডগ্যাপ হলো সুইমিং পুলের উঁচু বোর্ড থেকে সোজা পানিতে ঝাঁপ দেওয়ার মতো! ডাইভ দিলে যেমন চারদিকে পানি ছিটকে সুন্দর শব্দ হয়, তেমনই ইলেকট্রন ওপরের খাট থেকে নিচে সোজা লাফ দিয়ে সুন্দর রঙিন আলো তৈরি করে ছিটকে দেয় (যেমন: GaAs ও GaN এলইডি)!',
    formulaDescEn: 'Direct Alignment: Momentum k_conduction = k_valence means 100% of jumps turn directly into pure photon light!',
    formulaDescBn: 'সোজা লাফ: ওপরের ও নিচের তলার অবস্থান সোজা থাকায় ইলেকট্রনের পুরো শক্তিটাই সরাসরি আলো হয়ে বেরিয়ে আসে!',
    variables: [
      { sym: 'E_g', nameEn: 'Jump Height', nameBn: 'লাফের উচ্চতা (ব্যান্ডগ্যাপ)', descEn: 'Energy difference between top and bottom floors.', descBn: 'ওপরের তলা ও নিচের তলার মধ্যে শক্তির ব্যবধান।' },
      { sym: 'Photon (hν)', nameEn: 'Light Sparkle', nameBn: 'আলোর কণা (ফোটন)', descEn: 'The packet of light created from the clean jump.', descBn: 'লাফ দেওয়ার পর যে রঙিন আলোর ফুলকি বের হয়।' },
      { sym: 'GaAs', nameEn: 'Gallium Arsenide', nameBn: 'গ্যালিয়াম আর্সেনাইড', descEn: 'A magical crystal that makes red and infrared light.', descBn: 'চমৎকার একটি ক্রিস্টাল যা সরাসরি লাল আলো ছড়ায়।' }
    ]
  },
  '8': {
    storyEn: 'Indirect Bandgap is like trying to jump off a slide, but someone placed a big rubber pillar in the middle! To land safely, the poor electron has to bounce sideways, bump its knee against the pillar, and make a loud THUMP! Instead of making pretty light, that thump turns into heat (phonons) that just warms up your computer chip!',
    storyBn: 'ইনডিরেক্ট ব্যান্ডগ্যাপ হলো এমন এক লাফ, যার মাঝখানে কেউ একটা শক্ত দেয়াল তুলে রেখেছে! বেচারা ইলেকট্রন নিচে নামার সময় দেয়ালে ধাক্কা খেয়ে হোঁচট খায়! ফলে সুন্দর আলোর বদলে শুধুই ধপাস শব্দ আর গরম তাপ (ফোনন) তৈরি হয়! একারণে সিলিকন বা জার্মেনিয়াম দিয়ে বাতি জ্বালানো যায় না, শুধু গরম হয়!',
    formulaDescEn: 'Momentum Mismatch: Δk ≠ 0 means the electron needs a lattice vibration (heat phonon) to land, wasting 99% of energy as heat.',
    formulaDescBn: 'অবস্থানের অমিল: ইলেকট্রনকে নিচে নামতে হলে আরেকজনের ধাক্কা খেয়ে নামতে হয়, ফলে ৯৯% শক্তিই আলো না হয়ে উত্তাপ হয়ে নষ্ট হয়।',
    variables: [
      { sym: 'Silicon (Si)', nameEn: 'Indirect Master', nameBn: 'সিলিকন', descEn: 'Great for computer brains, bad for making light.', descBn: 'কম্পিউটার প্রসেসরের জন্য সেরা, কিন্তু বাতি হিসেবে কাজ করে না।' },
      { sym: 'Phonon', nameEn: 'Heat Vibration', nameBn: 'উত্তাপের কম্পন (ফোনন)', descEn: 'Lattice heat wave that steals the electron energy.', descBn: 'কেলাসের কাঁপুনি যা আলোর বদলে গরম তৈরি করে।' }
    ]
  },
  '9': {
    storyEn: 'LED stands for Light Emitting Diode! Think of it as a magical flashlight bug! You feed it electricity candies from a battery, and its tummy glows like a bright ruby red, emerald green, or sapphire blue star! It does not get burning hot like an old grandma lightbulb—it stays cool and happy!',
    storyBn: 'LED মানে হলো লাইট এমিটিং ডায়োড বা আলো দেওয়া ডায়োড! একে মনে করো এক জোনাকি পোকা! তুমি ব্যাটারি দিয়ে তাকে একটু খাবার দিলেই তার পেট থেকে সুন্দর লাল, সবুজ বা নীল তারা জ্বলে ওঠে! পুরনো দিনের টাংস্টেন বাল্বের মতো এটা বেশি গরম হয় না, একদম ঠান্ডা থাকে!',
    formulaDescEn: 'Electroluminescence: Electricity in ➔ Beautiful cold light out!',
    formulaDescBn: 'ইলেক্ট্রোলুমিনেসেন্স: ব্যাটারির বিদ্যুৎ শক্তি সরাসরি ঠান্ডা রঙিন আলোতে রূপান্তর!',
    variables: [
      { sym: 'Anode (+)', nameEn: 'Long Leg', nameBn: 'লম্বা পা (অ্যানোড +)', descEn: 'Connect to the positive tummy of your battery.', descBn: 'ব্যাটারির পজিটিভ প্রান্তের সাথে যুক্ত করতে হয়।' },
      { sym: 'Cathode (-)', nameEn: 'Short Leg', nameBn: 'ছোট পা (ক্যাথোড -)', descEn: 'Connect to the ground or negative side.', descBn: 'ব্যাটারির নেগেটিভ প্রান্তের সাথে যুক্ত করতে হয়।' }
    ]
  },
  '10': {
    storyEn: 'Why do LEDs have different colors? It is all about the height of the slide! A small gentle slide makes cozy Red light. A taller slide makes Green light. A giant super-tall slide makes icy Blue or Purple light! The taller the jump ($E_g$), the shorter the light wave ($\lambda$) and the more energetic the color!',
    storyBn: 'এলইডি বাতি কেন লাল, সবুজ বা নীল রঙের হয়? এটা নির্ভর করে স্লাইডটা কতটা উঁচু তার ওপর! ছোট নিচু স্লাইড থেকে লাফ দিলে বের হয় মিষ্টি লাল আলো। মাঝারি স্লাইড থেকে লাফ দিলে বের হয় সবুজ আলো। আর অনেক উঁচু আকাশছোঁয়া স্লাইড থেকে লাফ দিলে বের হয় নীল ও বেগুনি আলো! স্লাইড যত উঁচু ($E_g$), আলোর রঙ তত নীল!',
    formulaDescEn: 'λ = 1240 / E_g (in nanometers). Jump energy decides the rainbow color!',
    formulaDescBn: 'λ = ১২৪০ / E_g (ন্যানোমিটার)। লাফের শক্তিই ঠিক করে দেয় রংধনুর কোন রঙটি জ্বলবে!',
    variables: [
      { sym: 'λ (Lambda)', nameEn: 'Color Wavelength', nameBn: 'আলোর তরঙ্গদৈর্ঘ্য (রঙ)', descEn: 'Red is long ~650nm, Blue is short ~450nm.', descBn: 'লাল আলোর দৈর্ঘ্য বেশি (~৬৫০nm), নীল আলোর দৈর্ঘ্য কম (~৪৫০nm)।' },
      { sym: 'E_g (eV)', nameEn: 'Bandgap Height', nameBn: 'ব্যান্ডগ্যাপ উচ্চতা', descEn: '1.8 eV gives Red, 2.2 eV gives Green, 3.2 eV gives Blue.', descBn: '১.৮ eV দিলে লাল, ২.২ দিলে সবুজ, আর ৩.২ দিলে নীল আলো হয়।' }
    ]
  },
  '11': {
    storyEn: 'Inside an LED plastic bubble: There is a tiny shiny cup called an "anvil" that reflects light forward like a spoon reflecting sunlight! A paper-thin gold wire connects the power, and a clear epoxy dome acts like magnifying glasses to focus the light into your eyes safely!',
    storyBn: 'এলইডি প্লাস্টিকের পেটের ভেতর কী থাকে? ভেতরে ছোট্ট একটা চকচকে চামচের মতো বাটি থাকে, যা পেছনের সব আলোকে সামনের দিকে আয়নার মতো ফেলে দেয়! একটা সোনার সরু সুতো দিয়ে বিদ্যুৎ দেওয়া হয়, আর বাইরের স্বচ্ছ টুপিটা আতশ কাচের মতো আলোকে সোজা ছুড়ে দেয়!',
    formulaDescEn: 'Anvil Cup + Gold Wire + Semiconductor Die + Clear Epoxy Lens.',
    formulaDescBn: 'চামচ বাটি + সোনার তার + সেমিকন্ডাক্টর দানা + স্বচ্ছ লেন্স ক্যাপসুল।',
    variables: [
      { sym: 'Epoxy Dome', nameEn: 'Plastic Helmet', nameBn: 'প্লাস্টিক ক্যাপসুল', descEn: 'Protects the tiny chip from dropping on the floor.', descBn: 'ভিতরের পুঁচকে চিপটিকে ভেঙে যাওয়া থেকে বাঁচায়।' },
      { sym: 'Anvil Cup', nameEn: 'Reflector Spoon', nameBn: 'প্রতিফলক চামচ বাটি', descEn: 'Directs all light beams forward.', descBn: 'সব আলোকে সামনের দিকে ছড়িয়ে দেয়।' }
    ]
  },
  '12': {
    storyEn: 'How an LED works: Imagine lots of electron kids with backpacks full of energy jumping across the playground into empty seats (holes). When an electron sits in a hole, they hug each other! That warm hug releases a magical sparkle of photon light that flies through the air!',
    storyBn: 'এলইডি কীভাবে কাজ করে: মনে করো একদল বাচ্চা পিঠে ভরপুর শক্তির ব্যাগ নিয়ে দৌড়ে এসে খালি চেয়ারে (হোলে) ধপাস করে বসে পড়ে! বসার সাথে সাথেই তারা একে অপরকে জড়িয়ে ধরে আর সেই আনন্দের ধাক্কায় এক ঝলক জাদুকরী আলোর ফুলকি বাতাসে উড়ে যায়!',
    formulaDescEn: 'Radiative Recombination: Electron + Hole ➔ Photon of Light (hν)!',
    formulaDescBn: 'পুনর্মিলন: ইলেকট্রন আর হোল এক হয়ে গেলেই আলোর ফুলকি জন্ম নেয়!',
    variables: [
      { sym: 'Recombination', nameEn: 'Friend Hug', nameBn: 'পুনর্মিলন বা কোলাকুলি', descEn: 'Electron fills a hole and gives off its extra energy.', descBn: 'ইলেকট্রন ফাঁকা হোলে বসে গিয়ে বাড়তি শক্তি আলো হিসেবে ছেড়ে দেয়।' }
    ]
  },
  '13': {
    storyEn: 'A Zener Diode is a magic wall that knows martial arts! Forward, it lets everyone pass easily. Backwards, it holds up a giant shield and blocks all water! But if the water pressure pushes harder than its secret number (say 5.1 Volts), the Zener lets the extra water flow backwards safely without breaking!',
    storyBn: 'জেনার ডায়োড হলো কুংফু জানা এক জাদুকরী দেয়াল! সোজা দিকে সে সবাইকে যেতে দেয়। উল্টো দিকে সে শক্ত ঢাল দিয়ে সব পানি আটকে রাখে! কিন্তু পানি যদি তার জাদুকরী সংখ্যার চেয়ে বেশি জোরে ধাক্কা দেয় (যেমন: ৫.১ ভোল্ট), তখন সে নিরাপদে বাড়তি পানি পেছনের দরজা দিয়ে বের করে দেয় যাতে কেউ ডুবে না যায়!',
    formulaDescEn: 'V_Z = constant: Once you reach breakdown, the voltage across the Zener stays locked at V_Z no matter how wild the input gets!',
    formulaDescBn: 'V_Z = স্থির মান: পেছনের দরজা একবার খুললে জেনারের দুই প্রান্তের ভোল্টেজ ঠিক V_Z মানে একদম পাথর হয়ে স্থির থাকে!',
    variables: [
      { sym: 'V_Z', nameEn: 'Zener Voltage', nameBn: 'জেনার ব্রেকডাউন ভোল্টেজ', descEn: 'The exact safety voltage number (e.g. 5.1V, 9.1V).', descBn: 'নির্ধারিত সুরক্ষা ভোল্টেজ (যেমন ৫.১ বা ৯.১ ভোল্ট)।' },
      { sym: 'I_Z', nameEn: 'Zener Current', nameBn: 'জেনার কারেন্ট', descEn: 'The water streaming backwards through the safety hatch.', descBn: 'পেছনের দরজা দিয়ে বয়ে যাওয়া বাড়তি বিদ্যুৎ।' }
    ]
  },
  '14': {
    storyEn: 'Forward Bias is like pressing the green "GO" pedal in a toy car: the gate shrinks to nothing and you zoom across! Reverse Bias is pressing the red "STOP" brake: the barrier grows thicker and wider like a giant castle moat full of hungry crocodiles so no one can cross!',
    storyBn: 'ফরোয়ার্ড বায়াস হলো খেলনা গাড়ির সবুজ এক্সিলারেটরে চাপ দেওয়া—সামনের ব্যারিকেড একদম মুছে যায় আর তুমি সাঁ সাঁ করে ছুটে চলো! আর রিভার্স বায়াস হলো লাল ব্রেক চেপে ধরা—মাঝখানের দেয়ালটা অনেক চওড়া হয়ে এক বিশাল কুমিরভরা খালের মতো হয়ে যায়, ফলে কেউ পার হতে পারে না!',
    formulaDescEn: 'Depletion Layer: Forward narrows the barrier (W ↓); Reverse widens the barrier (W ↑).',
    formulaDescBn: 'ডিপ্লেশন অঞ্চল: ফরোয়ার্ডে দেয়াল সরু হয়ে ভেঙে যায়, রিভার্সে দেয়াল অনেক চওড়া ও দুর্ভেদ্য হয়ে যায়।',
    variables: [
      { sym: 'Forward Bias', nameEn: 'Green Go Pedal (+ to P)', nameBn: 'ফরোয়ার্ড বায়াস (P তে +)', descEn: 'Shrinks barrier to 0V and conducts big current.', descBn: 'দেয়াল মুছে দিয়ে প্রচুর বিদ্যুৎ প্রবাহিত করে।' },
      { sym: 'Reverse Bias', nameEn: 'Red Stop Brake (- to P)', nameBn: 'রিভার্স বায়াস (P তে -)', descEn: 'Widens barrier and stops all current.', descBn: 'দেয়াল চওড়া করে সব বিদ্যুৎ আটকে দেয়।' }
    ]
  },
  '15': {
    storyEn: 'A Zener Voltage Regulator is like an overflow pipe in a bathtub! If you turn the tap on full blast, the water level never rises too high because the overflow pipe immediately drains the extra water. Your delicate electronics (load) get a perfectly smooth, calm 5 Volts every single second!',
    storyBn: 'জেনার ভোল্টেজ রেগুলেটর হলো বাথটাবের উপচে পড়া পানির পাইপের মতো! তুমি কল যত জোরেই ছাড়ো না কেন, বাড়তি পানি পাইপ দিয়ে গড়িয়ে পড়ে যায় বলে টাবের পানির স্তর কখনো উপচে পড়ে না। তোমার সংবেদনশীল খেলনাগুলো সবসময় শান্ত ও নিরাপদ ৫ ভোল্ট বিদ্যুৎ পায়!',
    formulaDescEn: 'V_L = V_Z (constant output voltage) across the load resistor.',
    formulaDescBn: 'V_L = V_Z (লোড রেজিস্টরে সবসময় স্থির ভোল্টেজ বজায় থাকে)।',
    variables: [
      { sym: 'V_in', nameEn: 'Wild Input', nameBn: 'অস্থির ইনপুট ভোল্টেজ', descEn: 'Jumping bumpy voltage from your power supply.', descBn: 'উঁচু-নিচু ওঠানামা করা কাঁচা ভোল্টেজ।' },
      { sym: 'V_out', nameEn: 'Smooth Output', nameBn: 'শান্ত স্থির আউটপুট', descEn: 'Rock-solid smooth voltage locked to V_Z.', descBn: 'জেনারের কল্যাণে একদম স্থির হয়ে যাওয়া নিরাপদ ভোল্টেজ।' }
    ]
  },
  '16': {
    storyEn: 'A BJT Transistor is like a giant water dam with a tiny little control valve! With your little pinky finger, you twist the tiny Base valve ($I_B$). That tiny twist swings open a massive iron gate, unleashing a roaring waterfall from the Collector to the Emitter ($I_C = \beta \cdot I_B$)! You are 100 times stronger than before!',
    storyBn: 'একটি BJT ট্রানজিস্টর হলো এক বিশাল পানির বাঁধ, যার সামনে একটা পুঁচকে কন্ট্রোল নব লাগানো! তুমি তোমার কনিষ্ঠা আঙুল দিয়ে ছোট্ট বেইজ নবটিকে একটু মোচড় দেবে ($I_B$), আর সাথে সাথে বাঁধের বিশাল লোহার ফটক খুলে গিয়ে ওপর থেকে এক মহা পানির ঝরনা নিচে নামবে ($I_C = \beta \cdot I_B$)! তোমার ছোট্ট শক্তি ১০০ গুণ বড় হয়ে গেল!',
    formulaDescEn: 'I_C = β · I_B: Collector current is the Base current multiplied by superpower β (usually 100 to 300)!',
    formulaDescBn: 'I_C = β · I_B: কালেক্টর কারেন্ট হলো বেইজ কারেন্টের চেয়ে সুপারপাওয়ার β গুণ (১০০ থেকে ৩০০ গুণ) বড়!',
    variables: [
      { sym: 'I_B', nameEn: 'Tiny Finger Push', nameBn: 'ছোট বেইজ কারেন্ট (I_B)', descEn: 'A few microamperes you inject into the middle Base.', descBn: 'মাঝখানের বেইজে দেওয়া সামান্য মাইক্রো-অ্যাম্পিয়ার বিদ্যুৎ।' },
      { sym: 'I_C', nameEn: 'Roaring Waterfall', nameBn: 'বিশাল কালেক্টর কারেন্ট (I_C)', descEn: 'Big milliamperes flowing from Collector to Emitter.', descBn: 'ওপর থেকে নিচে ছুটে চলা শতগুণ বড় মিলি-অ্যাম্পিয়ার বিদ্যুৎ।' },
      { sym: 'β (Beta)', nameEn: 'Superpower Multiplier', nameBn: 'শক্তি বৃদ্ধির গুণক (β)', descEn: 'How many times the transistor magnifies your signal.', descBn: 'ট্রানজিস্টর তোমার সংকেতকে কত গুণ বড় করে তুলবে।' }
    ]
  },
  '17': {
    storyEn: 'A Half-Wave Rectifier is like an elevator that only goes UP, never down! AC electricity is a swinging pendulum that swings forward, then backward. The diode lets the forward swing march through, but cuts the backward swing completely flat! Half of the wave gets through, turning alternating wave into bumpy DC!',
    storyBn: 'হাফ-ওয়েভ রেক্টিফায়ার হলো এমন এক লিফট যা কেবল ওপরের দিকে ওঠে, কখনো নিচে নামে না! AC বিদ্যুৎ হলো ঘড়ির দোলকের মতো—একবার সামনে যায়, আবার পেছনে আসে। ডায়োডটি সামনের দোলকে যেতে দেয়, কিন্তু পেছনের দোলকে এক কোপে কেটে সমান করে দেয়! ফলে অর্ধেক ঢেউ পার হয়ে তৈরি হয় একমুখী ডিসি বিদ্যুৎ!',
    formulaDescEn: 'V_dc = 0.318 · V_m: The average flat voltage is about one-third of the peak wave height.',
    formulaDescBn: 'V_dc = ০.৩১৮ · V_m: ঢেউয়ের সর্বোচ্চ চূড়ার প্রায় তিন ভাগের এক ভাগ ডিসি ভোল্টেজ পাওয়া যায়।',
    variables: [
      { sym: 'V_m', nameEn: 'Peak Wave Height', nameBn: 'ঢেউয়ের সর্বোচ্চ চূড়া (V_m)', descEn: 'The tallest tip of the AC sine wave.', descBn: 'AC ঢেউয়ের সবচেয়ে উঁচু চূড়ার মান।' },
      { sym: 'V_dc', nameEn: 'Average DC Floor', nameBn: 'গড় ডিসি ভোল্টেজ', descEn: 'The steady battery power you can use.', descBn: 'একটানা ব্যবহারের উপযোগী শান্ত ডিসি শক্তি।' }
    ]
  },
  '18': {
    storyEn: 'A Center-Tapped Full-Wave Rectifier has two friendly helper diodes taking turns! When the AC wave swings positive, Diode 1 pushes the toy car forward. When the wave swings negative, Diode 2 pushes the toy car forward too! No swings are wasted—the car gets pushed forward TWICE as often with 81% efficiency!',
    storyBn: 'সেন্টার-ট্যাপড ফুল-ওয়েভ রেক্টিফায়ারে দুজন বন্ধু ডায়োড পালাক্রমে কাজ করে! ঢেউ যখন সামনের দিকে যায়, ১ম ডায়োড খেলনা গাড়িটাকে ধাক্কা দেয়। আর ঢেউ যখন উল্টো দিকে যায়, তখন ২য় ডায়োড গাড়িটাকে একই দিকে ধাক্কা দেয়! কোনো ঢেউ নষ্ট হয় না—গাড়িটি দ্বিগুণ গতিতে একটানা সামনে ছুটে চলে!',
    formulaDescEn: 'V_dc = 0.636 · V_m: Double the average DC voltage of a half-wave rectifier!',
    formulaDescBn: 'V_dc = ০.৬৩৬ · V_m: হাফ-ওয়েভের চেয়ে দ্বিগুণ ডিসি শক্তি পাওয়া যায় এবং কোনো ঢেউ বাদ পড়ে না!',
    variables: [
      { sym: 'D1 & D2', nameEn: 'Tag-Team Diodes', nameBn: 'পালাক্রমের দুই বন্ধু ডায়োড', descEn: 'One conducts on top half, the other on bottom half.', descBn: 'একজন ধনাত্মক অর্ধে কাজ করে, আরেকজন ঋণাত্মক অর্ধে।' },
      { sym: 'η = 81.2%', nameEn: 'Super High Efficiency', nameBn: 'উচ্চ কার্যক্ষমতা (৮১.২%)', descEn: 'Converts almost all AC energy into DC.', descBn: 'প্রায় সবটুকু ঢেউকেই সোজা একমুখী শক্তিতে রূপান্তর করে।' }
    ]
  },
  '19': {
    storyEn: 'A Bridge Rectifier is a team of 4 diodes arranged in a magic diamond diamond maze! No matter which way the electricity wind blows (positive or negative), the diamond maze always routes the electricity runners out through the same front door into your battery!',
    storyBn: 'ব্রিজ রেক্টিফায়ার হলো ৪টি ডায়োড দিয়ে তৈরি একটি হীরক আকারের গোলকধাঁধা! বিদ্যুতের হাওয়া যেদিক থেকেই আসুক না কেন, এই জাদুকরী গোলকধাঁধা বিদ্যুৎকে ঘুরিয়ে ফিরিয়ে সবসময় সোজা সদর দরজা দিয়ে বের করে ব্যাটারিতে পাঠায়!',
    formulaDescEn: 'V_dc = 0.636 · (V_m - 1.4V): 4-diode bridge gives full-wave power with low-cost standard transformers.',
    formulaDescBn: 'V_dc = ০.৬৩৬ · (V_m - ১.৪V): ৪টি ডায়োডের ব্রিজ দিয়ে সস্তায় এবং নিখুঁতভাবে পুরো ঢেউকে ডিসিতে রূপান্তর করা যায়।',
    variables: [
      { sym: 'D1-D2 & D3-D4', nameEn: 'Diagonal Pairs', nameBn: 'জোড়ায় জোড়ায় বন্ধু ডায়োড', descEn: 'Two conduct on positive half, two on negative half.', descBn: 'দুইজন পজিটিভ অর্ধে কাজ করে, বাকি দুইজন নেগেটিভ অর্ধে।' }
    ]
  },
  '19b': {
    storyEn: 'A Common-Emitter Amplifier is like a microphone at a rock concert! You whisper a tiny gentle song into the Base, and the transistor blows it up into a gigantic boom out the speaker! But it also flips the wave upside down like an upside-down somersault (180° phase inversion)!',
    storyBn: 'কমন-এমিটার অ্যাম্প্লিফায়ার হলো রক কনসার্টের বিশাল মাইকের মতো! তুমি বেইজে খুব নরম সুরে ফিসফিস করে গান গাইবে, আর ট্রানজিস্টর স্পিকার দিয়ে সেই গানটিকে মেঘের মতো গর্জন করে বাজাবে! তবে এটা গানটির ঢেউকে উল্টো ডিগবাজি খাইয়ে দেয় (১৮০ ডিগ্রি উল্টে যায়)!',
    formulaDescEn: 'A_v = -R_C / r_e: Negative sign means upside-down flip; big R_C gives giant volume gain!',
    formulaDescBn: 'A_v = -R_C / r_e: মাইনাস চিহ্ন মানে উল্টো ডিগবাজি, আর বড় R_C মানে অনেক গুণ জোরে আওয়াজ!',
    variables: [
      { sym: 'A_v', nameEn: 'Volume Magnifier', nameBn: 'ভোল্টেজ গেইন (A_v)', descEn: 'How many times louder the signal becomes.', descBn: 'তোমার ছোট্ট ফিসফিসানি কত গুণ বড় হলো।' },
      { sym: '180° Inversion', nameEn: 'Upside-Down Flip', nameBn: '১৮০° উল্টে যাওয়া', descEn: 'When input goes up, output goes down.', descBn: 'ইনপুট ওপরে উঠলে আউটপুট নিচে নেমে ডিগবাজি খায়।' }
    ]
  },
  '20': {
    storyEn: 'FET stands for Field Effect Transistor! Unlike BJT which drinks current like a thirsty camel, FET has an invisible forcefield! It uses voltage like a magic magnetic wand to control current without drawing ANY electricity into its control gate!',
    storyBn: 'FET মানে ফিল্ড ইফেক্ট ট্রানজিস্টর! BJT যেমন পানির মতো কারেন্ট খায়, FET কিন্তু মোটেও কারেন্ট খায় না! সে একটা অদৃশ্য জাদুকরী বলয় তৈরি করে। দূর থেকে শুধু ভোল্টেজের জাদুদণ্ড ঘুরিয়ে সে পুরো বিদ্যুৎ প্রবাহকে নিয়ন্ত্রণ করে!',
    formulaDescEn: 'Unipolar Device: Only ONE type of charge carrier (majority electrons or holes) does all the walking.',
    formulaDescBn: 'ইউনিপোলার ডিভাইস: এখানে কেবল এক দলের বাহকরাই (শুধু ইলেকট্রন বা শুধু হোল) একা দৌড়াদৌড়ি করে।',
    variables: [
      { sym: 'R_in > 10⁹ Ω', nameEn: 'Giant Wall Resistance', nameBn: 'বিশাল ইনপুট রোধ (>১০⁹ Ω)', descEn: 'Zero current enters the gate.', descBn: 'গেটের ভেতর দিয়ে কোনো বিদ্যুৎ নষ্ট হয়ে ঢোকে না।' }
    ]
  },
  '21': {
    storyEn: 'The FET family tree has two main branches: JFET (which uses a PN-junction gate) and MOSFET (which puts a super-thin glass insulator under the gate so zero current can EVER touch it)! Both come in N-channel and P-channel flavors!',
    storyBn: 'FET পরিবারের দুটি বড় শাখা আছে: একটি হলো JFET (যার গেটে পি-এন জাংশন থাকে) এবং আরেকটি হলো MOSFET (যার গেটের নিচে কাচের মতো সিলিকন ডাই-অক্সাইডের পাতলা চাদর থাকে যাতে একটুও বিদ্যুৎ স্পর্শ করতে না পারে)!',
    formulaDescEn: 'FET Classification: JFET (N/P) and MOSFET (Depletion mode and Enhancement mode).',
    formulaDescBn: 'শ্রেণিবিভাগ: JFET (N ও P চ্যানেল) এবং MOSFET (ডিপ্লেশন ও এনহ্যান্সমেন্ট মোড)।',
    variables: [
      { sym: 'JFET', nameEn: 'Junction Gate', nameBn: 'জেফেট (JFET)', descEn: 'Reverse-biased PN gate pinches the channel.', descBn: 'রিভার্স বায়াস দিয়ে চ্যানেলকে চেপে ধরে।' },
      { sym: 'MOSFET', nameEn: 'Insulated Gate', nameBn: 'মসফেট (MOSFET)', descEn: 'Glass insulator gate gives trillion-ohm impedance.', descBn: 'অন্তরক গেট দিয়ে নিখুঁত নিয়ন্ত্রণ দেয়।' }
    ]
  },
  '22': {
    storyEn: 'Shockley’s Equation for JFET describes the magical curved slide! When the gate is relaxed (0V), maximum current ($I_{DSS}$) roars through. As you push the gate down with negative voltage ($V_{GS}$), the current drops down like a curved parabola until it completely pinches shut at $V_P$!',
    storyBn: 'জেফেটের জন্য শকলে সমীকরণ হলো এক চমৎকার বাঁকানো পিছলান! গেট যখন শান্ত থাকে (০ ভোল্ট), তখন সবচেয়ে বেশি কারেন্ট ($I_{DSS}$) ছুটে যায়। তুমি গেটে যত বেশি মাইনাস ভোল্টেজ ($V_{GS}$) দেবে, পানির ধারা ততই কমতে কমতে একসময় $V_P$ তে এসে একদম বন্ধ হয়ে যাবে!',
    formulaDescEn: 'I_D = I_{DSS} · (1 - V_{GS} / V_P)²: Parabolic curve from maximum current I_DSS down to zero cutoff at V_P.',
    formulaDescBn: 'I_D = I_{DSS} · (১ - V_{GS} / V_P)²: প্যারাবোলিক বাঁকা নিয়মে সর্বোচ্চ কারেন্ট থেকে নেমে এসে শূন্য হয়ে যায়।',
    variables: [
      { sym: 'I_{DSS}', nameEn: 'Max Roaring Current', nameBn: 'সর্বোচ্চ সম্পৃক্ত কারেন্ট (I_DSS)', descEn: 'Drain current when Gate is grounded (V_GS = 0V).', descBn: 'গেট খোলা থাকলে সর্বোচ্চ যে কারেন্ট প্রবাহিত হতে পারে।' },
      { sym: 'V_P', nameEn: 'Pinch-Off Squeeze', nameBn: 'পিঞ্চ-অফ ভোল্টেজ (V_P)', descEn: 'The gate voltage that completely chokes the channel to 0.', descBn: 'যে ভোল্টেজে চ্যানেলের মুখ পুরোপুরি চেপে বন্ধ হয়ে যায়।' }
    ]
  },
  '23': {
    storyEn: 'JFET Physical Pinch-Off: Imagine stepping on a soft garden hose with your sneaker! Near the faucet it is wide open, but near the nozzle it pinches tighter into a wedge shape! When your sneaker presses down all the way, the two rubber walls touch and the stream locks at a steady, unchanging flow!',
    storyBn: 'জেফেটের পিঞ্চ-অফ প্রক্রিয়া: মনে করো বাগানের নরম রাবারের পাইপের ওপর তুমি স্নিকার্স জুতো দিয়ে পাড়া দিচ্ছো! ওপরের দিকে পাইপের মুখ চ্যাপ্টা হয়ে সরু হয়ে যায়। যখন দুই পাশের দেয়াল পরস্পরের সাথে প্রায় লেগে যায়, তখন পানির প্রবাহ আর বাড়তে পারে না—একদম স্থির হয়ে যায়!',
    formulaDescEn: 'Wedge-shaped depletion region touches at the Drain end when V_DS ≥ |V_P| - |V_GS|.',
    formulaDescBn: 'ড্রেন প্রান্তে দুই পাশের ডিপ্লেশন লেয়ার একে অপরকে ছুঁয়ে ফেলে কারেন্টকে স্থির করে দেয়।',
    variables: [
      { sym: 'Wedge Depletion', nameEn: 'Squeezing Cushion', nameBn: 'ওয়েজ আকারের দেয়াল', descEn: 'Wider near Drain because Drain has the highest reverse voltage.', descBn: 'ড্রেনের কাছে বেশি চওড়া হয়ে চ্যানেল বন্ধ করতে চায়।' }
    ]
  },
  '24': {
    storyEn: 'BJT vs JFET Battle: BJT is a muscle car that burns lots of base fuel ($I_B$) to go fast, but gets super hot! JFET is a futuristic magnetic hovercraft that glides effortlessly with zero gate fuel and never overheats! Both are amazing champions of electronics!',
    storyBn: 'BJT বনাম JFET যুদ্ধ: BJT হলো এক পুরনো দিনের রেসিং কার যা প্রচুর বেইজ জ্বালানি ($I_B$) পুড়িয়ে দৌড়ায় এবং খুব গরম হয়ে যায়! আর JFET হলো ভবিষ্যতের এক জাদুকরী হোভারক্রাফট—যা একটুও জ্বালানি না খেয়ে শুধু আলতো বাতাসে ভেসে বেড়ায় এবং কখনো বেশি গরম হয় না!',
    formulaDescEn: 'BJT: Current-controlled I_C = β·I_B; JFET: Voltage-controlled I_D = I_DSS(1 - V_GS/V_P)², R_in > 10⁹ Ω.',
    formulaDescBn: 'BJT কারেন্ট দিয়ে চলে (I_C = β·I_B), আর JFET ভোল্টেজ দিয়ে চলে (R_in > ১০⁹ Ω)।',
    variables: [
      { sym: 'Current vs Voltage', nameEn: 'Fuel Type', nameBn: 'নিয়ন্ত্রণের মাধ্যম', descEn: 'BJT eats current; JFET feels voltage.', descBn: 'BJT কারেন্ট দিয়ে নিয়ন্ত্রিত হয়, আর JFET ভোল্টেজ দিয়ে।' }
    ]
  }
};
