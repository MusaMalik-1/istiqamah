// =============================================================================
// Istiqamah — Core Application Engine (renderer.js)
// -----------------------------------------------------------------------------
// Clean, single source of truth architecture.
// =============================================================================

// Default Categories & Habits Specification
const DEFAULT_CATEGORIES = [
  {
    id: "prayers",
    name: "Prayers",
    iconSvg: `<svg class="lucide-icon" viewBox="0 0 24 24"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>`,
    tasks: [
      { id: "prayer-fajr", title: "Fajr", required: true, isMainPrayer: true, initial: "F" },
      { id: "prayer-dhuhr", title: "Dhuhr", required: true, isMainPrayer: true, initial: "D" },
      { id: "prayer-asr", title: "Asr", required: true, isMainPrayer: true, initial: "A" },
      { id: "prayer-maghrib", title: "Maghrib", required: true, isMainPrayer: true, initial: "M" },
      { id: "prayer-isha", title: "Isha", required: true, isMainPrayer: true, initial: "I" },
      { id: "prayer-sunnah", title: "Sunnah prayers", required: false, isExtraPrayer: true },
      { id: "prayer-witr", title: "Witr", required: false, isExtraPrayer: true },
      { id: "prayer-tahajjud", title: "Tahajjud", required: false, isExtraPrayer: true },
      { id: "prayer-duha", title: "Duha", required: false, isExtraPrayer: true }
    ]
  },
  {
    id: "quran",
    name: "Quran & Dhikr",
    iconSvg: `<svg class="lucide-icon" viewBox="0 0 24 24"><path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/></svg>`,
    tasks: [
      { id: "quran-read", title: "Read Quran", required: true },
      { id: "dhikr-morning", title: "Morning adhkar", required: true },
      { id: "dhikr-evening", title: "Evening adhkar", required: true },
      { id: "dhikr-after-prayer", title: "Dhikr after prayer", required: true },
      { id: "quran-memorize", title: "Revise or memorize a surah", required: false },
      { id: "dhikr-sleep", title: "Dua before sleeping", required: true }
    ]
  },
  {
    id: "health",
    name: "Health",
    iconSvg: `<svg class="lucide-icon" viewBox="0 0 24 24"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`,
    tasks: [
      { id: "health-water", title: "Drink water", isWater: true, goal: 8, required: true },
      { id: "health-exercise", title: "Walk or exercise", required: true },
      { id: "health-sleep", title: "Sleep on time", required: true },
      { id: "health-eat", title: "Eat healthy", required: false },
      { id: "health-vitamins", title: "Take vitamins or medicine", required: false }
    ]
  },
  {
    id: "study",
    name: "Study & Work",
    iconSvg: `<svg class="lucide-icon" viewBox="0 0 24 24"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
    tasks: [
      { id: "study-revise", title: "Study or revise", required: true },
      { id: "study-learn", title: "Learn something new", required: false },
      { id: "study-skill", title: "Work on a skill", required: false },
      { id: "study-book", title: "Read a book", required: false }
    ]
  },
  {
    id: "home",
    name: "Home",
    iconSvg: `<svg class="lucide-icon" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
    tasks: [
      { id: "home-bed", title: "Make bed", required: true },
      { id: "home-clean", title: "Clean room", required: false },
      { id: "home-family", title: "Call or check on family", required: false },
      { id: "home-sadaqah", title: "Give sadaqah or help someone", required: false },
      { id: "home-screen", title: "Limit phone and social media", required: true }
    ]
  }
];

// Calm, natural, short feedback messages (5 variations per state)
const FEEDBACK_MESSAGES = {
  zeroPercent: [
    { title: "A fresh start today.", sub: "Begin with your first intention." },
    { title: "Welcome to a new day.", sub: "Take it one step at a time." },
    { title: "Ready when you are.", sub: "Pick an easy task to build momentum." },
    { title: "A quiet morning start.", sub: "Small, consistent acts matter most." },
    { title: "Peaceful morning.", sub: "Set your intentions for today." }
  ],
  under40: [
    { title: "Nice start.", sub: "Keep the momentum going." },
    { title: "Steady progress.", sub: "You are moving in the right direction." },
    { title: "Building rhythm.", sub: "One checkmark at a time." },
    { title: "Off to a good pace.", sub: "Take your time with each habit." },
    { title: "Good early headway.", sub: "Keep going at your own pace." }
  ],
  halfway: [
    { title: "Halfway there.", sub: "Solid progress across your day." },
    { title: "Good rhythm today.", sub: "Over half of your tasks are complete." },
    { title: "Steady and focused.", sub: "You are making meaningful headway." },
    { title: "Smooth sailing.", sub: "Keep this calm consistency up." },
    { title: "Well on your way.", sub: "More than halfway through today." }
  ],
  over75: [
    { title: "Almost there.", sub: "Just a few items left to close out." },
    { title: "Finishing strong.", sub: "You have taken great care of today." },
    { title: "Nearly complete.", sub: "Only a handful of habits remain." },
    { title: "In the final stretch.", sub: "Wrap up what remains with ease." },
    { title: "Great dedication today.", sub: "A few tasks left before winding down." }
  ],
  hundredPercent: [
    { title: "All tasks completed.", sub: "Everything for today is fulfilled." },
    { title: "A full day completed.", sub: "Rest well knowing you did your best." },
    { title: "Every habit fulfilled.", sub: "A clean, complete day of consistency." },
    { title: "Day complete.", sub: "Wonderful consistency from start to finish." },
    { title: "All done for today.", sub: "Enjoy your evening with peace of mind." }
  ],
  eveningIncomplete: [
    { title: "Winding down.", sub: "Wrap up what you can before rest." },
    { title: "Peaceful evening.", sub: "Focus on the essentials before sleep." },
    { title: "Quiet close to the day.", sub: "Whatever is done tonight is enough." },
    { title: "Evening reflection.", sub: "Take care of what matters and rest." },
    { title: "Night is setting in.", sub: "Finish your remaining essentials calmly." }
  ],
  allPrayersDone: [
    { title: "All five prayers completed.", sub: "The foundation of your day is fulfilled." },
    { title: "Five prayers guarded.", sub: "May your day be filled with peace." },
    { title: "Five prayers complete.", sub: "Your daily spiritual anchor is secured." },
    { title: "Prayers fulfilled.", sub: "A steadfast pillar for your routine." },
    { title: "Five prayers guarded today.", sub: "Fajr through Isha fulfilled." }
  ],
  streakMilestone: [
    { title: "3-day streak.", sub: "Consistency is settling in." },
    { title: "7-day streak.", sub: "A full week of steady habits." },
    { title: "14-day streak.", sub: "Two weeks of unbroken consistency." },
    { title: "30-day streak.", sub: "A full month of dedication." },
    { title: "Streak milestone.", sub: "Keep this quiet momentum." }
  ],
  streakBroken: [
    { title: "Fresh start today.", sub: "Consistency is about returning. Begin anew." },
    { title: "Back at day one.", sub: "Every day is an opportunity to reset." },
    { title: "Ready to rebuild.", sub: "Small steps today will build your next streak." },
    { title: "New day, clean slate.", sub: "Focus on today's required habits." },
    { title: "Starting fresh.", sub: "One day at a time." }
  ]
};

// Daily Accountability & Reflection (Muhasabah) Questions
const ACCOUNTABILITY_QUESTIONS = [
  {
    id: "q1",
    category: "Intention & Sincerity",
    text: "Did I begin and carry out my actions today with a sincere intention and mindfulness of God, avoiding showing off or seeking praise?",
    options: [
      { score: 2, label: "Sincere & Mindful" },
      { score: 1, label: "Mixed / Distracted" },
      { score: 0, label: "Mindless / Absent" }
    ]
  },
  {
    id: "q2",
    category: "Guarding Speech",
    text: "Did I guard my tongue and speech from backbiting (gheebah), gossip, lying, vulgarity, and idle arguments?",
    options: [
      { score: 2, label: "Clean Speech" },
      { score: 1, label: "Minor Slip-ups" },
      { score: 0, label: "Struggled Today" }
    ]
  },
  {
    id: "q3",
    category: "Time Stewardship",
    text: "Did I protect my time from aimless phone scrolling, procrastination, and unbeneficial digital distraction?",
    options: [
      { score: 2, label: "Focused & Purposeful" },
      { score: 1, label: "Some Wasted Time" },
      { score: 0, label: "Heavy Distraction" }
    ]
  },
  {
    id: "q4",
    category: "Character & Family",
    text: "Was I gentle, patient, and respectful in my interactions with my parents, family, friends, and peers?",
    options: [
      { score: 2, label: "Patient & Kind" },
      { score: 1, label: "A Few Tense Moments" },
      { score: 0, label: "Lost Temper / Irritable" }
    ]
  },
  {
    id: "q5",
    category: "Gratitude & Contentment",
    text: "Did I consciously acknowledge and thank God for my blessings today, avoiding complaining and discontentment?",
    options: [
      { score: 2, label: "Grateful & Content" },
      { score: 1, label: "Somewhat Mindful" },
      { score: 0, label: "Complained Often" }
    ]
  },
  {
    id: "q6",
    category: "Repentance & Istighfar",
    text: "Did I acknowledge my daily faults and mistakes and turn to God in sincere repentance (Istighfar) before closing my day?",
    options: [
      { score: 2, label: "Made Sincere Istighfar" },
      { score: 1, label: "Brief Remembrance" },
      { score: 0, label: "Forgot Today" }
    ]
  }
];

// Comprehensive Islamic Knowledge & Hikmah Quiz Question Bank
const QUIZ_QUESTIONS = [
  // --- Quran & Tafseer ---
  {
    id: "q_qur_1",
    category: "Quran & Tafseer",
    question: "How many Surahs (chapters) are there in the Holy Quran?",
    options: ["114", "112", "110", "116"],
    correctIndex: 0,
    explanation: "The Holy Quran consists of exactly 114 Surahs, beginning with Surah Al-Fatihah and ending with Surah An-Nas."
  },
  {
    id: "q_qur_2",
    category: "Quran & Tafseer",
    question: "Which Surah did the Prophet ﷺ describe as the 'Heart of the Quran'?",
    options: ["Surah Yasin", "Surah Al-Mulk", "Surah Ar-Rahman", "Surah Al-Baqarah"],
    correctIndex: 0,
    explanation: "Prophet Muhammad ﷺ stated in a renowned Hadith: 'Indeed everything has a heart, and the heart of the Quran is Yasin.'"
  },
  {
    id: "q_qur_3",
    category: "Quran & Tafseer",
    question: "Which Surah in the Holy Quran does not begin with the Basmalah?",
    options: ["Surah At-Tawbah", "Surah Al-Anfal", "Surah Al-Kahf", "Surah Maryam"],
    correctIndex: 0,
    explanation: "Surah At-Tawbah (the 9th Surah) does not begin with Bismillah ir-Rahman ir-Rahim, reflecting its solemn declaration of disavowal."
  },
  {
    id: "q_qur_4",
    category: "Quran & Tafseer",
    question: "Which Prophet is mentioned by name most frequently in the Quran?",
    options: ["Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Isa (AS)", "Prophet Nuh (AS)"],
    correctIndex: 0,
    explanation: "Prophet Musa (Moses) peace be upon him is mentioned by name 136 times across numerous Surahs."
  },
  {
    id: "q_qur_5",
    category: "Quran & Tafseer",
    question: "What is the longest single Ayah (verse) in the Holy Quran?",
    options: ["Ayat ad-Dayn (Debt Verse, 2:282)", "Ayat al-Kursi (2:255)", "Ayat an-Nur (24:35)", "Surah Al-Ikhlas"],
    correctIndex: 0,
    explanation: "Ayat ad-Dayn in Surah Al-Baqarah (verse 282) spans an entire page detailing financial contracts and ethical documentation."
  },
  {
    id: "q_qur_6",
    category: "Quran & Tafseer",
    question: "Which Surah is recommended to recite every night for protection from the trial of the grave?",
    options: ["Surah Al-Mulk", "Surah Al-Waqi'ah", "Surah As-Sajdah", "Surah Al-Jumu'ah"],
    correctIndex: 0,
    explanation: "The Prophet ﷺ said: 'Surah Al-Mulk is an advocate that protects its reciter until he is forgiven and saved from the punishment of the grave.'"
  },
  {
    id: "q_qur_7",
    category: "Quran & Tafseer",
    question: "In which blessed month was the Holy Quran first revealed to mankind?",
    options: ["Ramadan", "Rajab", "Sha'ban", "Dhul Hijjah"],
    correctIndex: 0,
    explanation: "Allah states in Surah Al-Baqarah (2:185): 'The month of Ramadan in which was revealed the Quran, a guidance for the people.'"
  },

  // --- Seerah & Prophets ---
  {
    id: "q_see_1",
    category: "Seerah & Prophets",
    question: "In which cave did Prophet Muhammad ﷺ receive the first revelation from Angel Jibril?",
    options: ["Cave Hira", "Cave Thawr", "Cave Safa", "Cave Uhud"],
    correctIndex: 0,
    explanation: "The first revelation of Surah Al-Alaq ('Iqra') was delivered to the Prophet ﷺ while in deep contemplation in Cave Hira atop Mount Nur."
  },
  {
    id: "q_see_2",
    category: "Seerah & Prophets",
    question: "What was the name of the Prophet's ﷺ grandfather who lovingly cared for him in his early childhood?",
    options: ["Abdul Muttalib", "Abu Talib", "Hashim", "Abbas"],
    correctIndex: 0,
    explanation: "Abdul Muttalib, the noble chieftain of Quraysh, cared for the Prophet ﷺ following the passing of his mother Aminah."
  },
  {
    id: "q_see_3",
    category: "Seerah & Prophets",
    question: "In which year did the Hijrah (migration to Madinah) take place, starting the Hijri calendar?",
    options: ["622 CE", "610 CE", "630 CE", "632 CE"],
    correctIndex: 0,
    explanation: "The Hijrah took place in 622 CE. Later during the caliphate of Umar (RA), it was chosen as year 1 of the Islamic lunar calendar."
  },
  {
    id: "q_see_4",
    category: "Seerah & Prophets",
    question: "Who was the companion who accompanied the Prophet ﷺ during the perilous Hijrah journey inside Cave Thawr?",
    options: ["Abu Bakr As-Siddiq (RA)", "Umar ibn Al-Khattab (RA)", "Ali ibn Abi Talib (RA)", "Uthman ibn Affan (RA)"],
    correctIndex: 0,
    explanation: "Abu Bakr (RA) was the trusted companion in the cave, referred to in the Quran as 'the second of two when they were in the cave' (9:40)."
  },
  {
    id: "q_see_5",
    category: "Seerah & Prophets",
    question: "Which Prophet was swallowed by a giant fish and cried out: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers'?",
    options: ["Prophet Yunus (AS)", "Prophet Ayyub (AS)", "Prophet Dawud (AS)", "Prophet Yahya (AS)"],
    correctIndex: 0,
    explanation: "Prophet Yunus (Jonah) made this profound supplication from the belly of the fish, and Allah answered his prayer and delivered him."
  },
  {
    id: "q_see_6",
    category: "Seerah & Prophets",
    question: "Which early battle is honored in the Quran as 'Yawm al-Furqan' (The Day of the Criterion)?",
    options: ["Battle of Badr", "Battle of Uhud", "Battle of the Trench (Khandaq)", "Battle of Hunayn"],
    correctIndex: 0,
    explanation: "The Battle of Badr (17th of Ramadan, 2 AH) separated truth from falsehood and marked a decisive turning point in Islamic history."
  },

  // --- Pillars & Worship ---
  {
    id: "q_pil_1",
    category: "Pillars & Worship",
    question: "What is the third Pillar of Islam, which purifies personal wealth by assisting the poor and needy?",
    options: ["Zakat", "Sawm", "Hajj", "Salah"],
    correctIndex: 0,
    explanation: "The Five Pillars are: Shahadah, Salah, Zakat, Sawm (fasting Ramadan), and Hajj for whoever has the means."
  },
  {
    id: "q_pil_2",
    category: "Pillars & Worship",
    question: "Which of the five daily prayers are performed in congregation with silent (sirri) recitation by the Imam?",
    options: ["Dhuhr & Asr", "Fajr & Maghrib", "Maghrib & Isha", "Fajr & Isha"],
    correctIndex: 0,
    explanation: "Dhuhr and Asr prayers are recited silently during the daytime, while Fajr, Maghrib, and Isha feature audible (jahri) recitation."
  },
  {
    id: "q_pil_3",
    category: "Pillars & Worship",
    question: "How many rounds (Shawt) of Tawaf around the sacred Ka'bah are completed during Umrah and Hajj?",
    options: ["7 rounds", "5 rounds", "9 rounds", "10 rounds"],
    correctIndex: 0,
    explanation: "Tawaf consists of 7 anti-clockwise circuits starting and finishing at the level of the Black Stone (Al-Hajar Al-Aswad)."
  },
  {
    id: "q_pil_4",
    category: "Pillars & Worship",
    question: "What is the special gate in Paradise reserved exclusively for those who were steadfast in fasting?",
    options: ["Ar-Rayyan", "Al-Firdaws", "Bab as-Salah", "Bab as-Sadaqah"],
    correctIndex: 0,
    explanation: "The Prophet ﷺ said: 'In Paradise there is a gate called Ar-Rayyan through which only those who fasted will enter on the Day of Resurrection.'"
  },
  {
    id: "q_pil_5",
    category: "Pillars & Worship",
    question: "What is the threshold amount of wealth called that must be held for a full lunar year before Zakat is due?",
    options: ["Nisab", "Sadaqah", "Fitrah", "Waqf"],
    correctIndex: 0,
    explanation: "Nisab is the minimum threshold of surplus wealth (traditionally equivalent to 85 grams of gold) that makes Zakat obligatory at 2.5%."
  },

  // --- Character & Daily Sunnah ---
  {
    id: "q_cha_1",
    category: "Character & Sunnah",
    question: "What did the Prophet Muhammad ﷺ explicitly state is 'half of faith' (Shatr al-Iman)?",
    options: ["Purity & Cleanliness (Taharah)", "Generosity", "Night Prayer", "Silence"],
    correctIndex: 0,
    explanation: "The Prophet ﷺ said in Sahih Muslim: 'Cleanliness and purity is half of faith, and Alhamdulillah fills the scale.'"
  },
  {
    id: "q_cha_2",
    category: "Character & Sunnah",
    question: "According to the Prophet ﷺ, what deed will weigh the heaviest on the believer's scale on the Day of Judgment?",
    options: ["Good Character (Husn al-Khuluq)", "Voluntary Fasting", "Speaking Many Words", "Giving Speeches"],
    correctIndex: 0,
    explanation: "The Prophet ﷺ said: 'Nothing is placed on the Scale that is heavier than good character and noble manners.'"
  },
  {
    id: "q_cha_3",
    category: "Character & Sunnah",
    question: "What did the Prophet ﷺ describe as an act of charity (Sadaqah) that costs nothing?",
    options: ["Smiling at your brother", "Walking quickly", "Looking serious", "Avoiding eye contact"],
    correctIndex: 0,
    explanation: "The Prophet ﷺ taught: 'Your smile in the face of your brother is an act of charity (Sadaqah).'"
  },
  {
    id: "q_cha_4",
    category: "Character & Sunnah",
    question: "What is the Sunnah response when someone sneezes and says 'Alhamdulillah'?",
    options: ["Yarhamukallah (May Allah have mercy on you)", "Barakallahu feek", "Jazakallah khair", "Wa iyyakum"],
    correctIndex: 0,
    explanation: "It is an established Sunnah to reply 'Yarhamukallah', to which the sneezer replies: 'Yahdikumullah wa yuslihu balakum'."
  },
  {
    id: "q_cha_5",
    category: "Character & Sunnah",
    question: "Which foot is Sunnah to step forward with when entering the Masjid (mosque)?",
    options: ["Right foot", "Left foot", "Both feet together", "Whichever foot is easiest"],
    correctIndex: 0,
    explanation: "The Sunnah is to enter places of worship with the right foot while saying the Dua for entering the mosque, and exiting with the left foot."
  },

  // --- Sahabah & Islamic History ---
  {
    id: "q_sah_1",
    category: "Sahabah & History",
    question: "Who was given the noble title 'Dhul-Nurayn' (Possessor of the Two Lights)?",
    options: ["Uthman ibn Affan (RA)", "Ali ibn Abi Talib (RA)", "Abu Bakr As-Siddiq (RA)", "Umar ibn Al-Khattab (RA)"],
    correctIndex: 0,
    explanation: "Uthman (RA) was called Dhul-Nurayn because he married two daughters of the Prophet ﷺ: Ruqayyah and, after her passing, Umm Kulthum."
  },
  {
    id: "q_sah_2",
    category: "Sahabah & History",
    question: "Who was appointed by Caliph Abu Bakr (RA) to lead the committee for the official compilation of the written Quran?",
    options: ["Zayd ibn Thabit (RA)", "Abdullah ibn Masud (RA)", "Muadh ibn Jabal (RA)", "Bilal ibn Rabah (RA)"],
    correctIndex: 0,
    explanation: "Zayd ibn Thabit (RA) was the primary scribe of revelation and spearheaded the meticulous compilation of the Mushaf."
  },
  {
    id: "q_sah_3",
    category: "Sahabah & History",
    question: "Who was chosen as the first person in Islamic history to call the Adhan (Mu'adhin)?",
    options: ["Bilal ibn Rabah (RA)", "Salman al-Farsi (RA)", "Abu Dharr al-Ghifari (RA)", "Ammar ibn Yasir (RA)"],
    correctIndex: 0,
    explanation: "Bilal ibn Rabah (RA), known for his steadfast faith through torture in Makkah, had a magnificent voice and was appointed by the Prophet ﷺ."
  },
  {
    id: "q_sah_4",
    category: "Sahabah & History",
    question: "Which female companion was the very first human being to believe in the message of Prophet Muhammad ﷺ?",
    options: ["Khadijah bint Khuwaylid (RA)", "Aisha bint Abi Bakr (RA)", "Fatimah az-Zahra (RA)", "Hafsa bint Umar (RA)"],
    correctIndex: 0,
    explanation: "Khadijah (RA), the beloved first wife of the Prophet ﷺ, immediately embraced his message, affirmed his truthfulness, and comforted him."
  },
  {
    id: "q_sah_5",
    category: "Sahabah & History",
    question: "Who was bestowed the legendary title 'Sayfullah' (The Sword of Allah) by Prophet Muhammad ﷺ?",
    options: ["Khalid ibn Al-Walid (RA)", "Hamza ibn Abdul Muttalib (RA)", "Sa'd ibn Abi Waqqas (RA)", "Zubayr ibn Al-Awwam (RA)"],
    correctIndex: 0,
    explanation: "The brilliant commander Khalid ibn Al-Walid (RA) was named Sayfullah for his extraordinary valor and strategic leadership in defense of Islam."
  }
];

// Application State
const appState = {
  categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
  todayDateKey: getLocalDateString(),
  completedTaskIds: new Set(), // ALWAYS EMPTY on clean fresh start
  waterGlasses: 0,
  history: {},
  streaks: {
    current: 0,
    best: 0
  },
  currentView: "today", // "today" | "history" | "friends" | "quiz" | "accountability" | "settings"
  filterCategoryId: null, // null = all, or category id like "prayers"
  profile: null, // { id, displayName, friendCode }
  friendIds: [], // Array of friend profile UUIDs
  accountability: {}, // { 'YYYY-MM-DD': { date, answers: { q1: 2, ... }, score: 83, note: '...', updatedAt } }
  accountabilityActiveSubTab: "daily",
  accountabilityReportDate: null,
  theme: "purple", // "purple" | "pink" | "green" | "red" | "blue" | "gold"
  lastSeenVersion: "1.2.0",
  quiz: {
    history: {}, // Keyed by 'YYYY-MM-DD': { completed: true, score: 620, correctCount: 4, totalQuestions: 5, speedBonusTotal: 120, completedAt: '...' }
    streak: 0,
    bestScore: 0,
    totalPoints: 0
  }
};

const CURRENT_VERSION = "1.2.3";

// Secure Storage Bridge
const storageBridge = (typeof window !== 'undefined' && window.istiqamahAPI) ? window.istiqamahAPI : {
  loadData: async () => {
    try {
      const data = localStorage.getItem('istiqamah-clean-data');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  saveData: async (data) => {
    try {
      localStorage.setItem('istiqamah-clean-data', JSON.stringify(data));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  getDataFilePath: async () => "Local Browser Storage"
};

// Standalone Web & Mobile Fallback for Friends API (Supabase REST)
if (typeof window !== 'undefined' && !window.friendsAPI) {
  const SB_URL = 'https://roeljqvfkycwqtneqncy.supabase.co/rest/v1';
  const SB_KEY = 'sb_publishable_sVJRx2WKyQ4edy0F4WRQNw_BQCJGOlI';
  const sbHeaders = {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json'
  };

  const genCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'IST-';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  window.friendsAPI = {
    registerProfile: async ({ existingProfile, displayName }) => {
      try {
        if (existingProfile && existingProfile.id && existingProfile.friendCode) {
          if (displayName && displayName.trim()) {
            await fetch(`${SB_URL}/profiles?id=eq.${existingProfile.id}`, {
              method: 'PATCH',
              headers: sbHeaders,
              body: JSON.stringify({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
            });
            existingProfile.displayName = displayName.trim();
          }
          return { success: true, profile: existingProfile };
        }
        let code = genCode();
        let name = displayName && displayName.trim() ? displayName.trim() : 'Friend';
        const res = await fetch(`${SB_URL}/profiles`, {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'return=representation' },
          body: JSON.stringify({ friend_code: code, display_name: name })
        });
        const data = await res.json();
        if (Array.isArray(data) && data[0]) {
          return { success: true, profile: { id: data[0].id, friendCode: data[0].friend_code, displayName: data[0].display_name } };
        }
        return { success: false, error: 'Registration failed' };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    syncProgress: async ({ profileId, stats, dateKey }) => {
      if (!profileId) return { success: false, error: 'No profile ID' };
      try {
        const payload = {
          profile_id: profileId,
          date_key: dateKey,
          percentage: stats.percentage || 0,
          total_tasks: stats.totalTasks || 29,
          completed_tasks: stats.totalCompleted || 0,
          prayers_completed: stats.prayersCompleted || 0,
          water_glasses: stats.waterGlasses || 0,
          current_streak: stats.currentStreak || 0,
          quiz_score: stats.quizScore || 0,
          updated_at: new Date().toISOString()
        };
        const res = await fetch(`${SB_URL}/daily_progress`, {
          method: 'POST',
          headers: { ...sbHeaders, 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify(payload)
        });
        return { success: res.ok };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    lookupFriendCode: async ({ myProfileId, friendCode }) => {
      if (!friendCode) return { success: false, error: 'Enter a friend code' };
      try {
        const code = friendCode.trim().toUpperCase();
        const res = await fetch(`${SB_URL}/profiles?friend_code=eq.${code}`, {
          method: 'GET',
          headers: sbHeaders
        });
        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) return { success: false, error: 'Friend not found' };
        const found = list[0];
        if (myProfileId && found.id === myProfileId) return { success: false, error: 'Cannot add yourself' };
        return { success: true, friend: { id: found.id, friendCode: found.friend_code, displayName: found.display_name } };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    fetchFriendsProgress: async ({ friendIds, dateKey }) => {
      if (!Array.isArray(friendIds) || friendIds.length === 0) return { success: true, friends: [] };
      try {
        const idListStr = `(${friendIds.join(',')})`;
        const [profRes, progRes] = await Promise.all([
          fetch(`${SB_URL}/profiles?id=in.${idListStr}`, { headers: sbHeaders }),
          fetch(`${SB_URL}/daily_progress?profile_id=in.${idListStr}&date_key=eq.${dateKey}`, { headers: sbHeaders })
        ]);
        const profiles = await profRes.json();
        const progresses = await progRes.json();
        const progressMap = {};
        if (Array.isArray(progresses)) {
          progresses.forEach(p => { progressMap[p.profile_id] = p; });
        }
        const friends = Array.isArray(profiles) ? profiles.map(pr => ({
          id: pr.id,
          friendCode: pr.friend_code,
          displayName: pr.display_name,
          progress: progressMap[pr.id] || null
        })) : [];
        return { success: true, friends };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
  };
}

function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatFriendlyDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Peaceful night';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// -----------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH: Task completion & Overall Statistics
// -----------------------------------------------------------------------------
function isTaskCompleted(task) {
  if (task.isWater) {
    return appState.waterGlasses >= (task.goal || 8);
  }
  return appState.completedTaskIds.has(task.id);
}

function computeAllStats() {
  let totalTasks = 0;
  let totalCompleted = 0;
  let totalRequired = 0;
  let requiredCompleted = 0;
  let prayersCompleted = 0;
  const categoryStats = {};

  appState.categories.forEach(cat => {
    let catTotal = 0;
    let catDone = 0;

    cat.tasks.forEach(task => {
      totalTasks++;
      catTotal++;

      const done = isTaskCompleted(task);
      if (done) {
        totalCompleted++;
        catDone++;
        if (cat.id === 'prayers' && task.isMainPrayer) {
          prayersCompleted++;
        }
      }

      if (task.required) {
        totalRequired++;
        if (done) {
          requiredCompleted++;
        }
      }
    });

    categoryStats[cat.id] = {
      total: catTotal,
      completed: catDone
    };
  });

  const percentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const allRequiredDone = totalRequired > 0 && requiredCompleted === totalRequired;
  const allTasksDone = totalTasks > 0 && totalCompleted === totalTasks;

  // Calculate Streak
  let historicalStreak = 0;
  let checkDate = new Date();
  checkDate.setDate(checkDate.getDate() - 1);

  while (true) {
    const dateStr = getLocalDateString(checkDate);
    const dayRecord = appState.history[dateStr];
    if (dayRecord && dayRecord.allRequiredDone) {
      historicalStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const currentStreak = allRequiredDone ? (historicalStreak + 1) : historicalStreak;
  const bestStreak = Math.max(appState.streaks.best || 0, currentStreak);
  appState.streaks.current = currentStreak;
  appState.streaks.best = bestStreak;

  return {
    totalTasks,
    totalCompleted,
    totalRequired,
    requiredCompleted,
    prayersCompleted,
    percentage,
    allRequiredDone,
    allTasksDone,
    categoryStats,
    currentStreak,
    bestStreak
  };
}

// -----------------------------------------------------------------------------
// UI Renderers
// -----------------------------------------------------------------------------
let cachedFeedbackSituation = null;
let cachedFeedbackMessage = null;

function renderHeroFeedback(stats) {
  const hour = new Date().getHours();
  let situation = 'zeroPercent';

  // Strictly check conditions
  if (stats.allTasksDone) {
    situation = 'hundredPercent';
  } else if (stats.prayersCompleted === 5 && stats.percentage < 100) {
    situation = 'allPrayersDone';
  } else if (stats.currentStreak >= 3 && [3, 7, 14, 30].includes(stats.currentStreak) && stats.allRequiredDone) {
    situation = 'streakMilestone';
  } else if (hour >= 20 && stats.percentage < 90) {
    situation = 'eveningIncomplete';
  } else if (stats.percentage >= 75) {
    situation = 'over75';
  } else if (stats.percentage >= 40) {
    situation = 'halfway';
  } else if (stats.percentage > 0) {
    situation = 'under40';
  } else {
    situation = 'zeroPercent';
  }

  if (situation !== cachedFeedbackSituation || !cachedFeedbackMessage) {
    const list = FEEDBACK_MESSAGES[situation] || FEEDBACK_MESSAGES.zeroPercent;
    cachedFeedbackMessage = list[Math.floor(Math.random() * list.length)];
    cachedFeedbackSituation = situation;
  }

  const feedbackTitleText = document.getElementById('feedbackTitleText');
  const feedbackSublineText = document.getElementById('feedbackSublineText');
  const heroCard = document.querySelector('.hero-card');

  if (feedbackTitleText && cachedFeedbackMessage) {
    feedbackTitleText.textContent = cachedFeedbackMessage.title;
  }

  if (feedbackSublineText) {
    const remainingReq = stats.totalRequired - stats.requiredCompleted;
    if (stats.allTasksDone) {
      feedbackSublineText.textContent = `${stats.totalCompleted} of ${stats.totalTasks} completed. Every habit done.`;
    } else if (remainingReq === 0) {
      feedbackSublineText.textContent = `${stats.totalCompleted} of ${stats.totalTasks} completed • Required habits complete for today.`;
    } else {
      feedbackSublineText.textContent = `${stats.totalCompleted} of ${stats.totalTasks} completed • ${remainingReq} required habit${remainingReq === 1 ? '' : 's'} remaining.`;
    }
  }

  if (heroCard) {
    if (stats.allTasksDone) {
      heroCard.classList.add('complete-pulse');
    } else {
      heroCard.classList.remove('complete-pulse');
    }
  }
}

function updateAllUI() {
  const stats = computeAllStats();

  // 1. Top Bar Elements
  const greetingHeading = document.getElementById('greetingHeading');
  const todayDateSubline = document.getElementById('todayDateSubline');
  const streakCountText = document.getElementById('streakCountText');
  const bestStreakSubText = document.getElementById('bestStreakSubText');

  if (greetingHeading) greetingHeading.textContent = getTimeBasedGreeting();
  if (todayDateSubline) todayDateSubline.textContent = formatFriendlyDate();
  if (streakCountText) streakCountText.textContent = stats.currentStreak;
  if (bestStreakSubText) bestStreakSubText.textContent = `Best: ${stats.bestStreak} days`;

  // 2. Hero Progress Ring
  const heroRingPercent = document.getElementById('heroRingPercent');
  const heroRingProgress = document.getElementById('heroRingProgress');
  if (heroRingPercent) heroRingPercent.textContent = `${stats.percentage}%`;
  if (heroRingProgress) {
    const circumference = 301.6; // 2 * PI * 48
    const offset = circumference - (stats.percentage / 100) * circumference;
    heroRingProgress.style.strokeDashoffset = offset;
  }

  // 3. Hero Feedback Message
  renderHeroFeedback(stats);

  // 4. Sidebar Categories Counts
  renderSidebarCategories(stats);

  // 5. Signature Prayer Tracker
  renderSignaturePrayers(stats);

  // 6. Category Cards Checklist
  renderCategoryCards();
}

/**
 * Sidebar Categories List
 */
function renderSidebarCategories(stats) {
  const container = document.getElementById('sidebarCategoriesList');
  if (!container) return;
  container.innerHTML = '';

  appState.categories.forEach(cat => {
    const catStat = stats.categoryStats[cat.id] || { completed: 0, total: cat.tasks.length };
    const btn = document.createElement('button');
    btn.className = `category-nav-btn ${appState.filterCategoryId === cat.id ? 'active' : ''}`;
    btn.innerHTML = `
      <div class="cat-nav-left">
        ${cat.iconSvg}
        <span>${cat.name}</span>
      </div>
      <span class="cat-count">${catStat.completed}/${catStat.total}</span>
    `;

    btn.addEventListener('click', () => {
      appState.currentView = 'today';
      switchView('today');
      appState.filterCategoryId = (appState.filterCategoryId === cat.id) ? null : cat.id;
      updateAllUI();
    });

    container.appendChild(btn);
  });
}

/**
 * Signature Prayer Tracker
 */
function renderSignaturePrayers(stats) {
  const prayerCat = appState.categories.find(c => c.id === 'prayers');
  if (!prayerCat) return;

  const scoreLabel = document.getElementById('prayerScoreText');
  if (scoreLabel) {
    scoreLabel.textContent = `${stats.prayersCompleted} of 5 done`;
  }

  // 5 Main Prayer Nodes
  const nodesRow = document.getElementById('prayerNodesRow');
  if (nodesRow) {
    nodesRow.innerHTML = '';
    const mainPrayers = prayerCat.tasks.filter(t => t.isMainPrayer);

    mainPrayers.forEach(task => {
      const isDone = isTaskCompleted(task);
      const unit = document.createElement('div');
      unit.className = `prayer-node-unit ${isDone ? 'completed' : ''}`;
      unit.innerHTML = `
        <div class="prayer-circle-btn" title="Toggle ${task.title}">
          <span class="node-letter">${task.initial}</span>
          <svg class="node-check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span class="prayer-label-name">${task.title}</span>
      `;

      unit.addEventListener('click', () => {
        toggleTask(task.id);
      });

      nodesRow.appendChild(unit);
    });
  }

  // Extra Prayers Secondary Chips
  const extraRow = document.getElementById('extraPrayersRow');
  if (extraRow) {
    extraRow.innerHTML = '';
    const extraPrayers = prayerCat.tasks.filter(t => !t.isMainPrayer);

    extraPrayers.forEach(task => {
      const isDone = isTaskCompleted(task);
      const chip = document.createElement('button');
      chip.className = `extra-prayer-chip ${isDone ? 'completed' : ''}`;
      chip.title = `${task.title} (Right-click to edit)`;
      chip.innerHTML = `
        <span class="chip-mini-dot"></span>
        <span>${escapeHtml(task.title)}</span>
      `;

      chip.addEventListener('click', () => {
        toggleTask(task.id);
      });

      chip.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openEditTaskModal(task.id);
      });

      extraRow.appendChild(chip);
    });
  }
}

/**
 * Category Cards and Checklist
 */
function renderCategoryCards() {
  const container = document.getElementById('categoriesCardsContainer');
  const banner = document.getElementById('activeCategoryBanner');
  const bannerText = document.getElementById('activeCategoryBannerText');
  const prayerCard = document.getElementById('prayerSignatureCard');

  if (!container) return;
  container.innerHTML = '';

  // Handle Category Filter Banner
  if (appState.filterCategoryId) {
    const activeCat = appState.categories.find(c => c.id === appState.filterCategoryId);
    if (banner && activeCat) {
      banner.style.display = 'flex';
      bannerText.textContent = `Showing ${activeCat.name}`;
    }
    // Only show prayer signature card if Prayers is active
    if (prayerCard) {
      prayerCard.style.display = (appState.filterCategoryId === 'prayers') ? 'flex' : 'none';
    }
  } else {
    if (banner) banner.style.display = 'none';
    if (prayerCard) prayerCard.style.display = 'flex';
  }

  const categoriesToShow = appState.filterCategoryId
    ? appState.categories.filter(c => c.id === appState.filterCategoryId && c.id !== 'prayers')
    : appState.categories.filter(c => c.id !== 'prayers');

  categoriesToShow.forEach(cat => {
    // When showing all, the prayer card already houses prayer items nicely,
    // but we can show standard category cards cleanly
    const block = document.createElement('div');
    block.className = 'category-block';

    let catCompleted = 0;
    cat.tasks.forEach(t => {
      if (isTaskCompleted(t)) catCompleted++;
    });

    block.innerHTML = `
      <div class="category-block-header">
        <span class="category-kicker-title">${escapeHtml(cat.name)}</span>
        <div class="category-kicker-right">
          <button class="btn-cat-add-inline" data-cat="${cat.id}" title="Add habit to ${escapeHtml(cat.name)}">+ Add</button>
          <span class="category-kicker-count">${catCompleted}/${cat.tasks.length}</span>
        </div>
      </div>
    `;

    const btnAddInline = block.querySelector('.btn-cat-add-inline');
    if (btnAddInline) {
      btnAddInline.addEventListener('click', () => {
        openAddTaskModal(cat.id);
      });
    }

    const tasksCard = document.createElement('div');
    tasksCard.className = 'tasks-card';

    cat.tasks.forEach(task => {
      if (task.isWater) {
        // Water Tracker Row inside Health
        const waterRow = document.createElement('div');
        waterRow.className = 'water-task-row';

        let segmentsHtml = '';
        for (let i = 1; i <= 8; i++) {
          const filled = i <= appState.waterGlasses ? 'filled' : '';
          segmentsHtml += `<div class="water-segment ${filled}" data-glass="${i}"></div>`;
        }

        waterRow.innerHTML = `
          <div class="water-info-left">
            <svg class="lucide-icon water-icon" viewBox="0 0 24 24"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
            <div class="water-text-wrap">
              <span class="water-title">${escapeHtml(task.title)}</span>
              <span class="water-count-sub" id="waterSubCount">${appState.waterGlasses} of 8 glasses</span>
            </div>
          </div>

          <div class="water-segments-row">
            ${segmentsHtml}
          </div>

          <div class="water-controls-right">
            <button class="btn-water-step" id="btnWaterMinus" ${appState.waterGlasses <= 0 ? 'disabled' : ''}>
              <svg class="lucide-icon" style="width:14px;height:14px" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
            </button>
            <button class="btn-water-step" id="btnWaterPlus">
              <svg class="lucide-icon" style="width:14px;height:14px" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
        `;

        // Direct clicking on any segment sets the water glasses count
        waterRow.querySelectorAll('.water-segment').forEach(seg => {
          seg.addEventListener('click', () => {
            const val = parseInt(seg.getAttribute('data-glass'), 10);
            appState.waterGlasses = (appState.waterGlasses === val) ? val - 1 : val;
            updateAllUI();
            scheduleSave();
          });
        });

        const btnMinus = waterRow.querySelector('#btnWaterMinus');
        const btnPlus = waterRow.querySelector('#btnWaterPlus');

        if (btnMinus) {
          btnMinus.addEventListener('click', () => {
            if (appState.waterGlasses > 0) {
              appState.waterGlasses--;
              updateAllUI();
              scheduleSave();
            }
          });
        }

        if (btnPlus) {
          btnPlus.addEventListener('click', () => {
            appState.waterGlasses++;
            updateAllUI();
            scheduleSave();
          });
        }

        tasksCard.appendChild(waterRow);
      } else {
        // Standard Task Row (~52px tall)
        const isDone = isTaskCompleted(task);
        const row = document.createElement('div');
        row.className = `task-row ${isDone ? 'completed' : ''}`;
        row.id = `task-row-${task.id}`;
        row.setAttribute('draggable', 'true');
        row.setAttribute('data-task-id', task.id);
        row.setAttribute('data-cat-id', cat.id);

        const reqBadge = task.required
          ? `<span class="required-dot" title="Required habit"></span>`
          : `<span class="optional-text">Optional</span>`;

        row.innerHTML = `
          <div class="task-row-left">
            <div class="task-round-check">
              <svg class="check-svg-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="task-title-text">${escapeHtml(task.title)}</span>
          </div>
          <div class="task-row-right">
            <div class="task-actions-group">
              <button class="btn-row-action btn-move-up" title="Move habit up">
                <svg class="lucide-icon action-icon" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"/></svg>
              </button>
              <button class="btn-row-action btn-move-down" title="Move habit down">
                <svg class="lucide-icon action-icon" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <button class="btn-row-action btn-edit-task" title="Edit habit">
                <svg class="lucide-icon action-icon" viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
            </div>
            <button class="req-toggle-btn" title="Click to toggle Required / Optional">
              ${reqBadge}
            </button>
          </div>
        `;

        row.addEventListener('click', (e) => {
          if (e.target.closest('.req-toggle-btn') || e.target.closest('.btn-row-action')) return;
          toggleTask(task.id);
        });

        const reqBtn = row.querySelector('.req-toggle-btn');
        if (reqBtn) {
          reqBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTaskRequired(task.id);
          });
        }

        const btnUp = row.querySelector('.btn-move-up');
        if (btnUp) {
          btnUp.addEventListener('click', (e) => {
            e.stopPropagation();
            moveTask(task.id, -1);
          });
        }

        const btnDown = row.querySelector('.btn-move-down');
        if (btnDown) {
          btnDown.addEventListener('click', (e) => {
            e.stopPropagation();
            moveTask(task.id, 1);
          });
        }

        const btnEdit = row.querySelector('.btn-edit-task');
        if (btnEdit) {
          btnEdit.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditTaskModal(task.id);
          });
        }

        setupRowDragAndDrop(row, task.id, cat.id);

        tasksCard.appendChild(row);
      }
    });

    block.appendChild(tasksCard);
    container.appendChild(block);
  });
}

// -----------------------------------------------------------------------------
// Drag & Drop Reordering
// -----------------------------------------------------------------------------
let draggedTaskId = null;
let draggedCatId = null;

function setupRowDragAndDrop(row, taskId, catId) {
  row.addEventListener('dragstart', (e) => {
    draggedTaskId = taskId;
    draggedCatId = catId;
    row.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    document.querySelectorAll('.task-row').forEach(r => r.classList.remove('drag-over'));
  });

  row.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedTaskId && draggedTaskId !== taskId && draggedCatId === catId) {
      row.classList.add('drag-over');
    }
  });

  row.addEventListener('dragleave', () => {
    row.classList.remove('drag-over');
  });

  row.addEventListener('drop', (e) => {
    e.preventDefault();
    row.classList.remove('drag-over');
    if (!draggedTaskId || draggedTaskId === taskId || draggedCatId !== catId) return;

    const cat = appState.categories.find(c => c.id === catId);
    if (!cat) return;

    const fromIdx = cat.tasks.findIndex(t => t.id === draggedTaskId);
    const toIdx = cat.tasks.findIndex(t => t.id === taskId);

    if (fromIdx !== -1 && toIdx !== -1) {
      if (cat.tasks[fromIdx].isMainPrayer || cat.tasks[toIdx].isMainPrayer) {
        return;
      }
      const [moved] = cat.tasks.splice(fromIdx, 1);
      cat.tasks.splice(toIdx, 0, moved);
      updateAllUI();
      scheduleSave();
    }
  });
}

function moveTask(taskId, direction) {
  for (const cat of appState.categories) {
    const idx = cat.tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      const targetIdx = idx + direction;
      if (targetIdx >= 0 && targetIdx < cat.tasks.length) {
        if (cat.tasks[idx].isMainPrayer || cat.tasks[targetIdx].isMainPrayer) {
          return;
        }
        const [moved] = cat.tasks.splice(idx, 1);
        cat.tasks.splice(targetIdx, 0, moved);
        updateAllUI();
        scheduleSave();
      }
      return;
    }
  }
}

// -----------------------------------------------------------------------------
// Task Modal Management (Add / Edit / Delete)
// -----------------------------------------------------------------------------
function openAddTaskModal(preselectedCategory = 'quran') {
  const overlay = document.getElementById('modalTaskOverlay');
  const modalTitle = document.getElementById('modalTaskTitle');
  const inputId = document.getElementById('inputTaskId');
  const inputTitle = document.getElementById('inputTaskTitle');
  const selectCat = document.getElementById('selectTaskCategory');
  const checkReq = document.getElementById('checkboxTaskRequired');
  const btnDelete = document.getElementById('btnDeleteTask');
  const btnSave = document.getElementById('btnSaveTaskModal');

  if (!overlay) return;

  modalTitle.textContent = 'Add New Habit';
  btnSave.textContent = 'Add Habit';
  inputId.value = '';
  inputTitle.value = '';
  selectCat.value = preselectedCategory || 'quran';
  selectCat.disabled = false;
  checkReq.checked = true;
  btnDelete.style.display = 'none';

  overlay.style.display = 'flex';
  setTimeout(() => inputTitle.focus(), 50);
}

function openEditTaskModal(taskId) {
  let targetCat = null;
  let targetTask = null;

  for (const cat of appState.categories) {
    const t = cat.tasks.find(item => item.id === taskId);
    if (t) {
      targetCat = cat;
      targetTask = t;
      break;
    }
  }

  if (!targetTask) return;

  const overlay = document.getElementById('modalTaskOverlay');
  const modalTitle = document.getElementById('modalTaskTitle');
  const inputId = document.getElementById('inputTaskId');
  const inputTitle = document.getElementById('inputTaskTitle');
  const selectCat = document.getElementById('selectTaskCategory');
  const checkReq = document.getElementById('checkboxTaskRequired');
  const btnDelete = document.getElementById('btnDeleteTask');
  const btnSave = document.getElementById('btnSaveTaskModal');

  if (!overlay) return;

  modalTitle.textContent = 'Edit Habit';
  btnSave.textContent = 'Save Changes';
  inputId.value = targetTask.id;
  inputTitle.value = targetTask.title;
  selectCat.value = targetCat.id;
  checkReq.checked = Boolean(targetTask.required);

  if (targetTask.isMainPrayer || targetTask.isWater) {
    btnDelete.style.display = 'none';
    selectCat.disabled = true;
  } else {
    btnDelete.style.display = 'inline-block';
    selectCat.disabled = false;
  }

  overlay.style.display = 'flex';
  setTimeout(() => inputTitle.focus(), 50);
}

function closeTaskModal() {
  const overlay = document.getElementById('modalTaskOverlay');
  if (overlay) overlay.style.display = 'none';
}

function saveTaskFromModal() {
  const id = document.getElementById('inputTaskId').value;
  const title = document.getElementById('inputTaskTitle').value.trim();
  const categoryId = document.getElementById('selectTaskCategory').value;
  const required = document.getElementById('checkboxTaskRequired').checked;

  if (!title) return;

  if (id) {
    updateTask(id, { title, categoryId, required });
  } else {
    addNewTask({ title, categoryId, required });
  }

  closeTaskModal();
}

function addNewTask({ title, categoryId, required }) {
  const cat = appState.categories.find(c => c.id === categoryId);
  if (!cat) return;

  const newTask = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    required: Boolean(required)
  };

  cat.tasks.push(newTask);
  updateAllUI();
  scheduleSave();
}

function updateTask(taskId, { title, categoryId, required }) {
  let currentCat = null;
  let task = null;
  let taskIdx = -1;

  for (const cat of appState.categories) {
    const idx = cat.tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      currentCat = cat;
      taskIdx = idx;
      task = cat.tasks[idx];
      break;
    }
  }

  if (!task) return;

  task.title = title.trim();
  task.required = Boolean(required);

  if (categoryId && categoryId !== currentCat.id && !task.isMainPrayer && !task.isWater) {
    const newCat = appState.categories.find(c => c.id === categoryId);
    if (newCat) {
      currentCat.tasks.splice(taskIdx, 1);
      newCat.tasks.push(task);
    }
  }

  updateAllUI();
  scheduleSave();
}

function deleteTask(taskId) {
  for (const cat of appState.categories) {
    const idx = cat.tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      const task = cat.tasks[idx];
      if (task.isMainPrayer || task.isWater) {
        return;
      }
      cat.tasks.splice(idx, 1);
      appState.completedTaskIds.delete(taskId);
      updateAllUI();
      scheduleSave();
      return;
    }
  }
}

function toggleTask(taskId) {
  if (appState.completedTaskIds.has(taskId)) {
    appState.completedTaskIds.delete(taskId);
  } else {
    appState.completedTaskIds.add(taskId);
  }

  updateAllUI();
  scheduleSave();
}

function toggleTaskRequired(taskId) {
  appState.categories.forEach(cat => {
    const t = cat.tasks.find(item => item.id === taskId);
    if (t) {
      t.required = !t.required;
    }
  });

  updateAllUI();
  scheduleSave();
}

// -----------------------------------------------------------------------------
// History View Calendar & Day Details Inspector
// -----------------------------------------------------------------------------
function renderHistoryCalendar() {
  const monthLabel = document.getElementById('historyMonthName');
  const grid = document.getElementById('calendarDaysGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const now = new Date();
  if (monthLabel) {
    monthLabel.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now);
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDateStr = getLocalDateString();

  // Blank padding cells
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.style.opacity = '0';
    grid.appendChild(emptyCell);
  }

  const stats = computeAllStats();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = getLocalDateString(dateObj);
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    cell.textContent = day;
    cell.setAttribute('data-date', dateStr);

    if (dateStr === todayDateStr) {
      cell.classList.add('today-cell');
    }

    let completedCount = 0;
    if (dateStr === todayDateStr) {
      completedCount = appState.completedTaskIds.size + (appState.waterGlasses >= 8 ? 1 : 0);
    } else if (appState.history[dateStr]) {
      const rec = appState.history[dateStr];
      completedCount = (rec.completedTaskIds || []).length + ((rec.waterGlasses || 0) >= 8 ? 1 : 0);
    }

    if (completedCount >= stats.totalTasks && stats.totalTasks > 0) {
      cell.classList.add('level-complete');
    } else if (completedCount > 0) {
      cell.classList.add('level-partial');
    }

    cell.addEventListener('click', () => {
      showDayDetails(dateStr, day, completedCount);
    });

    grid.appendChild(cell);
  }

  // Pre-select today's date in inspector
  const todayCompleted = appState.completedTaskIds.size + (appState.waterGlasses >= 8 ? 1 : 0);
  showDayDetails(todayDateStr, now.getDate(), todayCompleted);
}

function showDayDetails(dateStr, day, completedCount) {
  const container = document.getElementById('historyDayDetails');
  if (!container) return;

  // Highlight active calendar day cell
  document.querySelectorAll('.cal-day-cell').forEach(cell => {
    cell.classList.remove('selected-day');
    if (cell.getAttribute('data-date') === dateStr) {
      cell.classList.add('selected-day');
    }
  });

  const isToday = (dateStr === appState.todayDateKey);
  const tasksDoneIds = isToday
    ? Array.from(appState.completedTaskIds)
    : (appState.history[dateStr]?.completedTaskIds || []);

  const waterCount = isToday
    ? appState.waterGlasses
    : (appState.history[dateStr]?.waterGlasses || 0);

  const stats = computeAllStats();
  const totalTasksCount = stats.totalTasks;
  const pct = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const friendlyDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj);

  const completedTaskObjects = [];
  tasksDoneIds.forEach(id => {
    for (const cat of appState.categories) {
      const found = cat.tasks.find(t => t.id === id);
      if (found) {
        completedTaskObjects.push({ title: found.title, catName: cat.name, required: found.required });
        break;
      }
    }
  });

  const isStreakMet = isToday
    ? stats.allRequiredDone
    : Boolean(appState.history[dateStr]?.allRequiredDone);

  let habitsListHtml = '';
  if (completedTaskObjects.length === 0 && waterCount === 0) {
    habitsListHtml = `<div class="day-details-empty">No habits were recorded as completed on this day.</div>`;
  } else {
    habitsListHtml = '<div class="history-habits-grid">';
    if (waterCount > 0) {
      habitsListHtml += `
        <div class="history-habit-item">
          <svg class="history-habit-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Drink water (${waterCount}/8 glasses)</span>
        </div>
      `;
    }
    completedTaskObjects.forEach(item => {
      habitsListHtml += `
        <div class="history-habit-item">
          <svg class="history-habit-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${escapeHtml(item.title)}</span>
        </div>
      `;
    });
    habitsListHtml += '</div>';
  }

  container.innerHTML = `
    <div class="history-detail-header">
      <span class="history-detail-date">${friendlyDate}</span>
      <div class="history-detail-badges">
        <span class="history-detail-badge">${completedCount} of ${totalTasksCount} done (${pct}%)</span>
        <span class="history-detail-badge">Water: ${waterCount}/8</span>
        ${isStreakMet ? '<span class="history-detail-badge success">Streak Met</span>' : ''}
      </div>
    </div>
    ${habitsListHtml}
  `;
}

// -----------------------------------------------------------------------------
// Settings & View Switching
// -----------------------------------------------------------------------------
function switchView(viewName) {
  appState.currentView = viewName;

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
  });

  document.querySelectorAll('.page-view').forEach(panel => {
    panel.classList.remove('active');
  });

  const targetPanel = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  if (viewName === 'history') {
    renderHistoryCalendar();
  }

  if (viewName === 'friends') {
    loadFriendsView();
  }

  if (viewName === 'quiz') {
    loadQuizView();
  }

  if (viewName === 'accountability') {
    loadAccountabilityView();
  }

  if (viewName === 'settings') {
    loadSettingsInfo();
  }
}

// -----------------------------------------------------------------------------
// Friends & Cloud Synchronization (Supabase)
// -----------------------------------------------------------------------------
async function syncProgressToCloud() {
  if (typeof window === 'undefined' || !window.friendsAPI) return;
  if (!appState.profile || !appState.profile.id) return;

  try {
    const stats = computeAllStats();
    const todayQuiz = (appState.quiz && appState.quiz.history && appState.quiz.history[appState.todayDateKey]) ? appState.quiz.history[appState.todayDateKey] : null;
    const quizScore = todayQuiz ? (todayQuiz.score || 0) : 0;

    await window.friendsAPI.syncProgress({
      profileId: appState.profile.id,
      stats: {
        percentage: stats.percentage,
        totalTasks: stats.totalTasks,
        totalCompleted: stats.totalCompleted,
        prayersCompleted: stats.prayersCompleted,
        waterGlasses: appState.waterGlasses,
        currentStreak: stats.currentStreak,
        quizScore: quizScore
      },
      dateKey: appState.todayDateKey
    });
  } catch (err) {
    console.warn('Cloud progress sync skipped/error:', err.message);
  }
}

async function loadFriendsView() {
  const nameEl = document.getElementById('userDisplayNameText');
  const codeEl = document.getElementById('userFriendCodeText');

  if (typeof window === 'undefined' || !window.friendsAPI) {
    if (codeEl) codeEl.textContent = 'Desktop Mode';
    return;
  }

  // 1. Initialize or load user profile
  if (!appState.profile || !appState.profile.id) {
    if (codeEl) codeEl.textContent = 'Generating...';
    try {
      const regRes = await window.friendsAPI.registerProfile({
        existingProfile: appState.profile,
        displayName: (appState.profile && appState.profile.displayName) || 'You'
      });
      if (regRes.success) {
        appState.profile = regRes.profile;
        scheduleSave();
        syncProgressToCloud();
      } else {
        if (codeEl) codeEl.textContent = 'Setup Needed';
        console.warn('Could not register profile in Supabase:', regRes.error);
      }
    } catch (e) {
      if (codeEl) codeEl.textContent = 'Setup Needed';
    }
  }

  if (appState.profile) {
    if (nameEl) nameEl.textContent = appState.profile.displayName || 'You';
    if (codeEl) codeEl.textContent = appState.profile.friendCode || '---';
  }

  // 2. Fetch friends list
  await refreshFriendsList();
}

function openEditNameModal() {
  const modal = document.getElementById('modalEditNameOverlay');
  const input = document.getElementById('inputEditDisplayName');
  const errorMsg = document.getElementById('msgEditNameError');
  if (!modal || !input) return;

  const current = (appState.profile && appState.profile.displayName && appState.profile.displayName !== 'You')
    ? appState.profile.displayName
    : '';

  input.value = current;
  if (errorMsg) {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  modal.style.display = 'flex';
  setTimeout(() => {
    input.focus();
    input.select();
  }, 60);
}

function closeEditNameModal() {
  const modal = document.getElementById('modalEditNameOverlay');
  if (modal) modal.style.display = 'none';
}

async function handleSaveDisplayName() {
  const input = document.getElementById('inputEditDisplayName');
  const errorMsg = document.getElementById('msgEditNameError');
  const saveBtn = document.getElementById('btnSaveDisplayNameSubmit');
  if (!input) return;

  const newName = input.value.trim();
  if (!newName) {
    if (errorMsg) {
      errorMsg.textContent = 'Please enter a name.';
      errorMsg.style.display = 'block';
    }
    input.focus();
    return;
  }

  if (newName.length > 24) {
    if (errorMsg) {
      errorMsg.textContent = 'Name must be 24 characters or less.';
      errorMsg.style.display = 'block';
    }
    return;
  }

  try {
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    // Update in-memory profile
    if (!appState.profile) {
      appState.profile = { displayName: newName };
    } else {
      appState.profile.displayName = newName;
    }

    // Update local UI
    const nameEl = document.getElementById('userDisplayNameText');
    if (nameEl) nameEl.textContent = newName;

    // Sync to Supabase cloud if available
    if (window.friendsAPI) {
      const res = await window.friendsAPI.registerProfile({
        existingProfile: appState.profile,
        displayName: newName
      });
      if (res && res.success && res.profile) {
        appState.profile = res.profile;
      }
    }

    scheduleSave();
    syncProgressToCloud();
    closeEditNameModal();
  } catch (err) {
    console.error('Error saving display name:', err);
    if (errorMsg) {
      errorMsg.textContent = 'Could not save name. Please try again.';
      errorMsg.style.display = 'block';
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Name';
    }
  }
}

async function refreshFriendsList() {
  const listContainer = document.getElementById('friendsListContainer');
  if (!listContainer) return;

  if (!appState.friendIds || appState.friendIds.length === 0) {
    listContainer.innerHTML = `
      <div class="friends-empty-state">
        <p class="empty-title">No friends added yet.</p>
        <p class="empty-sub">Share your Friend Code with friends so you can keep each other accountable and see each other's progress!</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted); font-size:0.85rem;">Checking friends progress...</div>';

  if (!window.friendsAPI) {
    listContainer.innerHTML = `
      <div class="friends-empty-state">
        <p class="empty-title">Offline Mode</p>
        <p class="empty-sub">Cloud sync is available when running the desktop app.</p>
      </div>
    `;
    return;
  }

  try {
    const res = await window.friendsAPI.fetchFriendsProgress({
      friendIds: appState.friendIds,
      dateKey: appState.todayDateKey
    });

    if (!res.success) {
      listContainer.innerHTML = `
        <div class="friends-empty-state">
          <p class="empty-title" style="color:#f87171;">Waiting for Supabase Tables</p>
          <p class="empty-sub">Please run the SQL setup script in your Supabase project's SQL editor to enable friends syncing.</p>
        </div>
      `;
      return;
    }

    if (res.friends.length === 0) {
      listContainer.innerHTML = `
        <div class="friends-empty-state">
          <p class="empty-title">No friends found</p>
          <p class="empty-sub">Add friends using their unique Friend Code above.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = '';
    res.friends.forEach(f => {
      const initial = (f.displayName || 'F').charAt(0).toUpperCase();
      const row = document.createElement('div');
      row.className = 'friend-row-card';
      row.innerHTML = `
        <div class="friend-info-side">
          <div class="friend-avatar-initial">${escapeHtml(initial)}</div>
          <div class="friend-names-wrap">
            <span class="friend-card-name">${escapeHtml(f.displayName)}</span>
            <span class="friend-card-code">${escapeHtml(f.friendCode)}</span>
          </div>
        </div>

        <div class="friend-stats-side">
          <span class="friend-quiz-pill ${f.quizScore > 0 ? '' : 'pending'}" title="Today's Quiz Score">
            <svg class="lucide-icon" viewBox="0 0 24 24"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
            ${f.quizScore > 0 ? f.quizScore + ' pts' : '-- pts'}
          </span>
          <span class="friend-prayers-pill">${f.prayersCompleted}/5 prayers</span>
          <div class="friend-streak-pill" title="Current habit streak">
            <svg class="lucide-icon flame-icon" viewBox="0 0 24 24"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>
            <span>${f.currentStreak}d</span>
          </div>
          <span class="friend-pct-badge">${f.percentage}%</span>
          <button class="btn-remove-friend" data-id="${f.id}" title="Remove friend">✕</button>
        </div>
      `;

      const btnRemove = row.querySelector('.btn-remove-friend');
      if (btnRemove) {
        btnRemove.addEventListener('click', () => {
          if (confirm(`Remove ${f.displayName} from your friends list?`)) {
            appState.friendIds = appState.friendIds.filter(id => id !== f.id);
            scheduleSave();
            refreshFriendsList();
          }
        });
      }

      listContainer.appendChild(row);
    });
  } catch (err) {
    listContainer.innerHTML = `
      <div class="friends-empty-state">
        <p class="empty-title" style="color:#f87171;">Connection Error</p>
        <p class="empty-sub">${escapeHtml(err.message)}</p>
      </div>
    `;
  }
}

// -----------------------------------------------------------------------------
// Hikmah Quiz Engine (Daily Challenge, Per-Question Timer, Standings)
// -----------------------------------------------------------------------------

let activeQuizSession = {
  mode: 'daily', // 'daily' | 'practice'
  questions: [],
  currentIndex: 0,
  score: 0,
  speedBonusTotal: 0,
  correctCount: 0,
  answersRecord: [],
  timerInterval: null,
  timerSecondsLeft: 15,
  isAnswered: false
};

// Randomize question options so the correct answer is completely distributed across options A, B, C, and D
function prepareShuffledQuizSet(questions) {
  // Balanced distribution of target slots: 0 (A), 1 (B), 2 (C), 3 (D)
  const targetSlots = [0, 1, 2, 3];
  for (let i = targetSlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = targetSlots[i];
    targetSlots[i] = targetSlots[j];
    targetSlots[j] = temp;
  }
  // Add a 5th random slot
  targetSlots.push(Math.floor(Math.random() * 4));

  return questions.map((rawQ, qIdx) => {
    const originalCorrectIndex = typeof rawQ.correctIndex === 'number' ? rawQ.correctIndex : 0;
    const correctAnswerText = rawQ.options[originalCorrectIndex];
    const wrongOptions = rawQ.options.filter((_, idx) => idx !== originalCorrectIndex);

    // Shuffle wrong options
    for (let i = wrongOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = wrongOptions[i];
      wrongOptions[i] = wrongOptions[j];
      wrongOptions[j] = temp;
    }

    // Assign randomized slot
    const targetSlot = targetSlots[qIdx % targetSlots.length];

    const newOptions = [];
    let wrongIdx = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot === targetSlot) {
        newOptions.push(correctAnswerText);
      } else {
        newOptions.push(wrongOptions[wrongIdx++]);
      }
    }

    return {
      ...rawQ,
      options: newOptions,
      correctIndex: targetSlot
    };
  });
}

function getTodayQuizSet() {
  const dateStr = appState.todayDateKey;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const pool = [...QUIZ_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (seed * (i + 1) + 13) % (i + 1);
    const temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }

  const selectedFive = pool.slice(0, 5);
  return prepareShuffledQuizSet(selectedFive);
}

function getRandomQuizSet(count = 5) {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return prepareShuffledQuizSet(selected);
}

function loadQuizView() {
  const todayKey = appState.todayDateKey;
  const quizData = appState.quiz || { history: {}, streak: 0, bestScore: 0, totalPoints: 0 };
  const todayEntry = quizData.history ? quizData.history[todayKey] : null;

  // Header streak badge
  const streakText = document.getElementById('quizStreakText');
  if (streakText) {
    streakText.textContent = `${quizData.streak || 0} Day Quiz Streak`;
  }

  // Daily status pill & score circle
  const statusPill = document.getElementById('quizDailyStatusPill');
  const todayScoreVal = document.getElementById('quizTodayScoreVal');
  const startDailyBtnText = document.getElementById('btnStartDailyQuizText');

  if (todayEntry && todayEntry.completed) {
    if (statusPill) {
      statusPill.textContent = 'Completed Today';
      statusPill.className = 'quiz-status-pill completed';
    }
    if (todayScoreVal) {
      todayScoreVal.textContent = todayEntry.score;
    }
    if (startDailyBtnText) {
      startDailyBtnText.textContent = 'Retake Daily Quiz (Practice)';
    }
  } else {
    if (statusPill) {
      statusPill.textContent = 'Available Today';
      statusPill.className = 'quiz-status-pill';
    }
    if (todayScoreVal) {
      todayScoreVal.textContent = '--';
    }
    if (startDailyBtnText) {
      startDailyBtnText.textContent = 'Start Daily Challenge';
    }
  }

  // Stats Grid
  const bestScoreEl = document.getElementById('quizStatBestScore');
  const accuracyEl = document.getElementById('quizStatAccuracy');
  const accuracySubEl = document.getElementById('quizStatAccuracySub');
  const streakEl = document.getElementById('quizStatStreak');
  const totalPtsEl = document.getElementById('quizStatTotalPts');

  let totalQuestionsAnswered = 0;
  let totalCorrect = 0;
  Object.values(quizData.history || {}).forEach(h => {
    if (h.totalQuestions) totalQuestionsAnswered += h.totalQuestions;
    if (h.correctCount) totalCorrect += h.correctCount;
  });

  const accuracyPct = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 0;

  if (bestScoreEl) bestScoreEl.textContent = quizData.bestScore || 0;
  if (accuracyEl) accuracyEl.textContent = `${accuracyPct}%`;
  if (accuracySubEl) accuracySubEl.textContent = `${totalCorrect} / ${totalQuestionsAnswered} correct`;
  if (streakEl) streakEl.textContent = quizData.streak || 0;
  if (totalPtsEl) totalPtsEl.textContent = (quizData.totalPoints || 0).toLocaleString();

  // Show Lobby
  showQuizSubview('lobby');

  // Refresh friends standings
  renderFriendsQuizStandings();
}

function showQuizSubview(viewName) {
  const lobby = document.getElementById('quizLobbyView');
  const arena = document.getElementById('quizArenaView');
  const results = document.getElementById('quizResultsView');

  if (lobby) lobby.style.display = viewName === 'lobby' ? 'flex' : 'none';
  if (arena) arena.style.display = viewName === 'arena' ? 'flex' : 'none';
  if (results) results.style.display = viewName === 'results' ? 'flex' : 'none';
}

function startQuiz(mode = 'daily') {
  activeQuizSession.mode = mode;
  activeQuizSession.questions = mode === 'daily' ? getTodayQuizSet() : getRandomQuizSet(5);
  activeQuizSession.currentIndex = 0;
  activeQuizSession.score = 0;
  activeQuizSession.speedBonusTotal = 0;
  activeQuizSession.correctCount = 0;
  activeQuizSession.answersRecord = [];
  activeQuizSession.isAnswered = false;

  showQuizSubview('arena');
  renderCurrentQuizQuestion();
}

function renderCurrentQuizQuestion() {
  stopQuestionTimer();
  activeQuizSession.isAnswered = false;

  const q = activeQuizSession.questions[activeQuizSession.currentIndex];
  if (!q) {
    finishQuizSession();
    return;
  }

  const qNumEl = document.getElementById('arenaQNumber');
  const qCatEl = document.getElementById('arenaQCategory');
  const liveScoreEl = document.getElementById('arenaLiveScore');
  const qTextEl = document.getElementById('arenaQuestionText');
  const wisdomCard = document.getElementById('arenaWisdomCard');

  if (qNumEl) qNumEl.textContent = `Question ${activeQuizSession.currentIndex + 1} of ${activeQuizSession.questions.length}`;
  if (qCatEl) qCatEl.textContent = q.category;
  if (liveScoreEl) liveScoreEl.textContent = activeQuizSession.score;
  if (qTextEl) qTextEl.textContent = q.question;
  if (wisdomCard) wisdomCard.style.display = 'none';

  const grid = document.getElementById('arenaOptionsGrid');
  if (grid) {
    grid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'arena-option-btn';
      btn.setAttribute('data-index', idx);
      btn.innerHTML = `
        <span class="opt-letter">${letters[idx]}</span>
        <span class="opt-text">${escapeHtml(optText)}</span>
      `;
      btn.addEventListener('click', () => {
        if (!activeQuizSession.isAnswered) {
          handleQuizAnswer(idx);
        }
      });
      grid.appendChild(btn);
    });
  }

  startQuestionTimer();
}

function startQuestionTimer() {
  activeQuizSession.timerSecondsLeft = 15;
  updateTimerUI(15);

  const startTime = Date.now();
  const totalDuration = 15000;

  activeQuizSession.timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remainingMs = Math.max(0, totalDuration - elapsed);
    const seconds = Math.ceil(remainingMs / 1000);
    activeQuizSession.timerSecondsLeft = seconds;

    updateTimerUI(remainingMs / 1000);

    if (remainingMs <= 0) {
      stopQuestionTimer();
      if (!activeQuizSession.isAnswered) {
        handleQuizAnswer(-1); // Timeout
      }
    }
  }, 100);
}

function updateTimerUI(secondsFloat) {
  const bar = document.getElementById('arenaTimerBar');
  const text = document.getElementById('arenaTimerSeconds');
  const pct = Math.max(0, Math.min(100, (secondsFloat / 15) * 100));

  if (bar) {
    bar.style.width = `${pct}%`;
    bar.className = 'arena-timer-bar';
    if (secondsFloat > 7) {
      bar.classList.add('timer-safe');
    } else if (secondsFloat > 3) {
      bar.classList.add('timer-warn');
    } else {
      bar.classList.add('timer-danger');
    }
  }

  if (text) {
    text.textContent = `${Math.ceil(secondsFloat)}s`;
  }
}

function stopQuestionTimer() {
  if (activeQuizSession.timerInterval) {
    clearInterval(activeQuizSession.timerInterval);
    activeQuizSession.timerInterval = null;
  }
}

function handleQuizAnswer(selectedIndex) {
  stopQuestionTimer();
  activeQuizSession.isAnswered = true;

  const q = activeQuizSession.questions[activeQuizSession.currentIndex];
  const isCorrect = (selectedIndex === q.correctIndex);

  const secondsLeft = activeQuizSession.timerSecondsLeft;
  const speedBonus = isCorrect ? Math.round((secondsLeft / 15) * 50) : 0;
  const pointsEarned = isCorrect ? (100 + speedBonus) : 0;

  if (isCorrect) {
    activeQuizSession.score += pointsEarned;
    activeQuizSession.speedBonusTotal += speedBonus;
    activeQuizSession.correctCount += 1;
  }

  const liveScoreEl = document.getElementById('arenaLiveScore');
  if (liveScoreEl) liveScoreEl.textContent = activeQuizSession.score;

  activeQuizSession.answersRecord.push({
    question: q.question,
    category: q.category,
    options: q.options,
    selectedIndex,
    correctIndex: q.correctIndex,
    isCorrect,
    pointsEarned,
    explanation: q.explanation
  });

  const optionBtns = document.querySelectorAll('.arena-option-btn');
  optionBtns.forEach(btn => {
    btn.classList.add('disabled');
    const idx = parseInt(btn.getAttribute('data-index'), 10);
    if (idx === q.correctIndex) {
      btn.classList.add('correct');
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  const wisdomCard = document.getElementById('arenaWisdomCard');
  const outcomeBadge = document.getElementById('wisdomOutcomeBadge');
  const outcomeText = document.getElementById('wisdomOutcomeText');
  const pointsEarnedEl = document.getElementById('wisdomPointsEarned');
  const explanationEl = document.getElementById('wisdomExplanationText');
  const nextBtn = document.getElementById('btnNextQuestion');

  if (wisdomCard) {
    wisdomCard.style.display = 'flex';
    if (isCorrect) {
      outcomeBadge.className = 'wisdom-badge correct';
      outcomeText.textContent = 'Correct!';
      pointsEarnedEl.textContent = `+${pointsEarned} pts (Speed: +${speedBonus})`;
      pointsEarnedEl.style.color = '#4ade80';
    } else if (selectedIndex === -1) {
      outcomeBadge.className = 'wisdom-badge incorrect';
      outcomeText.textContent = "Time's Up!";
      pointsEarnedEl.textContent = '+0 pts';
      pointsEarnedEl.style.color = '#f87171';
    } else {
      outcomeBadge.className = 'wisdom-badge incorrect';
      outcomeText.textContent = 'Incorrect';
      pointsEarnedEl.textContent = '+0 pts';
      pointsEarnedEl.style.color = '#f87171';
    }

    if (explanationEl) explanationEl.textContent = q.explanation;
    if (nextBtn) {
      const isLast = (activeQuizSession.currentIndex === activeQuizSession.questions.length - 1);
      nextBtn.textContent = isLast ? 'View Final Results →' : 'Next Question →';
    }
  }
}

function advanceToNextQuestion() {
  activeQuizSession.currentIndex += 1;
  if (activeQuizSession.currentIndex >= activeQuizSession.questions.length) {
    finishQuizSession();
  } else {
    renderCurrentQuizQuestion();
  }
}

function finishQuizSession() {
  stopQuestionTimer();

  const isDaily = (activeQuizSession.mode === 'daily');
  const todayKey = appState.todayDateKey;

  if (!appState.quiz) {
    appState.quiz = { history: {}, streak: 0, bestScore: 0, totalPoints: 0 };
  }

  if (isDaily) {
    const prevToday = appState.quiz.history ? appState.quiz.history[todayKey] : null;
    const isFirstDailyCompletion = !prevToday || !prevToday.completed;

    if (isFirstDailyCompletion) {
      appState.quiz.streak = (appState.quiz.streak || 0) + 1;
    }

    if (activeQuizSession.score > (appState.quiz.bestScore || 0)) {
      appState.quiz.bestScore = activeQuizSession.score;
    }

    appState.quiz.totalPoints = (appState.quiz.totalPoints || 0) + activeQuizSession.score;

    if (!appState.quiz.history) appState.quiz.history = {};
    appState.quiz.history[todayKey] = {
      completed: true,
      score: activeQuizSession.score,
      correctCount: activeQuizSession.correctCount,
      totalQuestions: activeQuizSession.questions.length,
      speedBonusTotal: activeQuizSession.speedBonusTotal,
      completedAt: new Date().toISOString()
    };

    scheduleSave();
    syncProgressToCloud();
  }

  renderQuizResults();
}

function renderQuizResults() {
  showQuizSubview('results');

  const scoreVal = document.getElementById('resultsScoreVal');
  const accuracyVal = document.getElementById('resultsAccuracyVal');
  const speedBonusVal = document.getElementById('resultsSpeedBonusVal');
  const streakVal = document.getElementById('resultsStreakVal');
  const titleText = document.getElementById('resultsTitleText');
  const subText = document.getElementById('resultsSubText');

  if (scoreVal) scoreVal.textContent = activeQuizSession.score;
  if (accuracyVal) accuracyVal.textContent = `${activeQuizSession.correctCount} / ${activeQuizSession.questions.length}`;
  if (speedBonusVal) speedBonusVal.textContent = `+${activeQuizSession.speedBonusTotal} pts`;
  if (streakVal) streakVal.textContent = `${appState.quiz?.streak || 1} day${appState.quiz?.streak === 1 ? '' : 's'}`;

  if (activeQuizSession.correctCount === activeQuizSession.questions.length) {
    if (titleText) titleText.textContent = "Perfect Score! Masha'Allah";
    if (subText) subText.textContent = 'All 5 questions answered with outstanding accuracy and speed.';
  } else if (activeQuizSession.correctCount >= 3) {
    if (titleText) titleText.textContent = 'Great Effort!';
    if (subText) subText.textContent = 'Solid Islamic knowledge demonstrated today. Keep building your consistency!';
  } else {
    if (titleText) titleText.textContent = 'Good Practice!';
    if (subText) subText.textContent = 'Every question is an opportunity to learn. Review the wisdom below!';
  }

  const reviewContainer = document.getElementById('resultsReviewList');
  if (reviewContainer) {
    reviewContainer.innerHTML = '';
    reviewContainer.style.display = 'none';

    activeQuizSession.answersRecord.forEach((rec, idx) => {
      const item = document.createElement('div');
      item.className = 'review-q-item';

      const userAnsText = rec.selectedIndex >= 0 ? rec.options[rec.selectedIndex] : 'Time expired';
      const correctAnsText = rec.options[rec.correctIndex];

      item.innerHTML = `
        <div class="review-q-header">
          <span class="arena-q-num">Q${idx + 1} • ${escapeHtml(rec.category)}</span>
          <span class="wisdom-badge ${rec.isCorrect ? 'correct' : 'incorrect'}">
            ${rec.isCorrect ? `+${rec.pointsEarned} pts` : '+0 pts'}
          </span>
        </div>
        <div class="review-q-prompt">${escapeHtml(rec.question)}</div>
        <div class="review-q-ans">
          ${rec.isCorrect 
            ? `Your Answer: <span class="correct-highlight">${escapeHtml(userAnsText)}</span>`
            : `Your Answer: <span class="wrong-highlight">${escapeHtml(userAnsText)}</span> • Correct: <span class="correct-highlight">${escapeHtml(correctAnsText)}</span>`
          }
        </div>
        <div class="review-q-wisdom">${escapeHtml(rec.explanation)}</div>
      `;
      reviewContainer.appendChild(item);
    });
  }
}

async function renderFriendsQuizStandings() {
  const container = document.getElementById('quizStandingsList');
  if (!container) return;

  const todayKey = appState.todayDateKey;
  const userScore = (appState.quiz?.history && appState.quiz.history[todayKey]) ? appState.quiz.history[todayKey].score : 0;
  const userCompleted = !!(appState.quiz?.history && appState.quiz.history[todayKey]?.completed);
  const userDisplayName = appState.profile?.displayName || 'You';
  const userCode = appState.profile?.friendCode || 'YOU';

  const standings = [
    {
      id: 'me',
      displayName: userDisplayName,
      friendCode: userCode,
      quizScore: userScore,
      completed: userCompleted,
      isUser: true
    }
  ];

  if (window.friendsAPI && Array.isArray(appState.friendIds) && appState.friendIds.length > 0) {
    try {
      const res = await window.friendsAPI.fetchFriendsProgress({
        friendIds: appState.friendIds,
        dateKey: todayKey
      });

      if (res && res.success && Array.isArray(res.friends)) {
        res.friends.forEach(f => {
          standings.push({
            id: f.id,
            displayName: f.displayName,
            friendCode: f.friendCode,
            quizScore: f.quizScore || 0,
            completed: (f.quizScore || 0) > 0,
            isUser: false
          });
        });
      }
    } catch (e) {
      console.warn('Could not fetch friends standings:', e);
    }
  }

  standings.sort((a, b) => (b.quizScore || 0) - (a.quizScore || 0));

  container.innerHTML = '';
  standings.forEach((st, idx) => {
    const row = document.createElement('div');
    row.className = `standings-row ${st.isUser ? 'is-user' : ''}`;

    const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : '';
    const initial = (st.displayName || 'F').charAt(0).toUpperCase();

    row.innerHTML = `
      <div class="standings-left">
        <div class="standings-rank ${rankClass}">#${idx + 1}</div>
        <div class="standings-avatar">${escapeHtml(initial)}</div>
        <div class="standings-names">
          <span class="standings-name">${escapeHtml(st.displayName)} ${st.isUser ? '(You)' : ''}</span>
          <span class="standings-code">${escapeHtml(st.friendCode)}</span>
        </div>
      </div>
      <div class="standings-right">
        <span class="standings-score-badge ${st.quizScore > 0 ? '' : 'pending'}">
          ${st.quizScore > 0 ? st.quizScore + ' pts' : 'Pending'}
        </span>
      </div>
    `;
    container.appendChild(row);
  });
}

// -----------------------------------------------------------------------------
// Accountability Engine (Muhasabah & Monthly Reports)
// -----------------------------------------------------------------------------

function getTodayAuditEntry() {
  const todayKey = appState.todayDateKey;
  if (!appState.accountability) appState.accountability = {};
  if (!appState.accountability[todayKey]) {
    appState.accountability[todayKey] = {
      date: todayKey,
      answers: {},
      note: '',
      score: 0,
      updatedAt: null
    };
  }
  return appState.accountability[todayKey];
}

function loadAccountabilityView() {
  const badge = document.getElementById('auditTodayDateBadge');
  if (badge) {
    const today = new Date();
    badge.textContent = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Set default report date if not initialized
  if (!appState.accountabilityReportDate) {
    const now = new Date();
    appState.accountabilityReportDate = { year: now.getFullYear(), month: now.getMonth() };
  }

  // Render Daily Audit
  renderAuditQuestions();
  updateAuditHeaderScore();

  // If monthly tab is currently active, refresh monthly report
  if (appState.accountabilityActiveSubTab === 'monthly') {
    renderMonthlyReport(appState.accountabilityReportDate.year, appState.accountabilityReportDate.month);
  }
}

function renderAuditQuestions() {
  const container = document.getElementById('auditQuestionsList');
  if (!container) return;

  const entry = getTodayAuditEntry();
  const noteInput = document.getElementById('inputAuditNote');
  if (noteInput && entry.note !== undefined && document.activeElement !== noteInput) {
    noteInput.value = entry.note || '';
  }

  container.innerHTML = '';

  ACCOUNTABILITY_QUESTIONS.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'audit-question-card';
    const currentVal = entry.answers ? entry.answers[q.id] : undefined;
    if (currentVal !== undefined) {
      card.classList.add('answered');
    }

    const header = document.createElement('div');
    header.className = 'audit-q-header';
    header.innerHTML = `
      <span class="audit-q-num">Q${idx + 1}</span>
      <span class="audit-q-cat">${escapeHtml(q.category)}</span>
    `;

    const text = document.createElement('p');
    text.className = 'audit-q-text';
    text.textContent = q.text;

    const optionsRow = document.createElement('div');
    optionsRow.className = 'audit-options-row';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'audit-option-pill';
      if (currentVal === opt.score) {
        btn.classList.add('active');
      }
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        setQuestionAnswer(q.id, opt.score);
      });
      optionsRow.appendChild(btn);
    });

    card.appendChild(header);
    card.appendChild(text);
    card.appendChild(optionsRow);
    container.appendChild(card);
  });
}

function setQuestionAnswer(qId, score) {
  const entry = getTodayAuditEntry();
  if (!entry.answers) entry.answers = {};
  entry.answers[qId] = score;
  entry.updatedAt = new Date().toISOString();

  updateAuditHeaderScore();
  renderAuditQuestions();
  scheduleSave();
}

function updateAuditHeaderScore() {
  const entry = getTodayAuditEntry();
  const answeredKeys = Object.keys(entry.answers || {});
  const totalQuestions = ACCOUNTABILITY_QUESTIONS.length;

  let totalEarned = 0;
  answeredKeys.forEach(k => {
    totalEarned += (entry.answers[k] || 0);
  });

  const maxPoints = totalQuestions * 2;
  const pct = answeredKeys.length > 0 ? Math.round((totalEarned / maxPoints) * 100) : 0;
  entry.score = pct;

  const scoreVal = document.getElementById('auditScoreVal');
  const scoreStatus = document.getElementById('auditScoreStatus');
  const scoreSub = document.getElementById('auditScoreSub');
  const circle = document.getElementById('auditScoreCircle');

  if (scoreVal) scoreVal.textContent = answeredKeys.length > 0 ? pct : '--';
  if (scoreStatus) {
    if (answeredKeys.length === 0) {
      scoreStatus.textContent = 'Not completed yet';
    } else if (answeredKeys.length < totalQuestions) {
      scoreStatus.textContent = `${answeredKeys.length} of ${totalQuestions} answered`;
    } else if (pct >= 85) {
      scoreStatus.textContent = 'High Steadiness & Mindfulness';
    } else if (pct >= 60) {
      scoreStatus.textContent = 'Good Reflection';
    } else {
      scoreStatus.textContent = 'Reflect & Realign';
    }
  }

  if (scoreSub) {
    if (answeredKeys.length < totalQuestions) {
      const remaining = totalQuestions - answeredKeys.length;
      scoreSub.textContent = `Answer ${remaining} more question${remaining === 1 ? '' : 's'}`;
    } else {
      scoreSub.textContent = 'Daily audit completed for today';
    }
  }

  if (circle) {
    if (pct >= 75) {
      circle.style.borderColor = 'rgba(139, 92, 246, 0.8)';
    } else if (pct > 0) {
      circle.style.borderColor = 'rgba(139, 92, 246, 0.4)';
    } else {
      circle.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  }
}

function saveTodayAuditManual() {
  const entry = getTodayAuditEntry();
  const noteInput = document.getElementById('inputAuditNote');
  if (noteInput) {
    entry.note = noteInput.value.trim();
  }
  entry.updatedAt = new Date().toISOString();
  scheduleSave();

  const status = document.getElementById('auditSaveStatus');
  if (status) {
    status.style.display = 'inline';
    status.textContent = 'Saved for today!';
    setTimeout(() => {
      status.style.display = 'none';
    }, 2500);
  }
}

function switchAccountabilitySubTab(tabName) {
  appState.accountabilityActiveSubTab = tabName;

  document.querySelectorAll('.sub-tab-pill').forEach(pill => {
    pill.classList.toggle('active', pill.getAttribute('data-tab') === tabName);
  });

  const dailySubview = document.getElementById('subviewDailyAudit');
  const monthlySubview = document.getElementById('subviewMonthlyReport');

  if (tabName === 'daily') {
    if (dailySubview) dailySubview.style.display = 'flex';
    if (monthlySubview) monthlySubview.style.display = 'none';
    loadAccountabilityView();
  } else {
    if (dailySubview) dailySubview.style.display = 'none';
    if (monthlySubview) monthlySubview.style.display = 'flex';
    if (!appState.accountabilityReportDate) {
      const now = new Date();
      appState.accountabilityReportDate = { year: now.getFullYear(), month: now.getMonth() };
    }
    renderMonthlyReport(appState.accountabilityReportDate.year, appState.accountabilityReportDate.month);
  }
}

function renderMonthlyReport(year, month) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const titleEl = document.getElementById('monthlyReportTitle');
  if (titleEl) {
    titleEl.textContent = `${monthNames[month]} ${year}`;
  }

  // Days in selected month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const yyyy = year;
  const mm = String(month + 1).padStart(2, '0');
  const prefix = `${yyyy}-${mm}`;

  const allEntries = appState.accountability || {};
  let auditedDaysCount = 0;
  let totalScoreSum = 0;

  // Category stats: { qId: { earned: 0, max: 0, name } }
  const catStats = {};
  ACCOUNTABILITY_QUESTIONS.forEach(q => {
    catStats[q.id] = { earned: 0, max: 0, name: q.category };
  });

  const notesList = [];

  for (let d = 1; d <= totalDays; d++) {
    const dayStr = String(d).padStart(2, '0');
    const dateKey = `${prefix}-${dayStr}`;
    const entry = allEntries[dateKey];

    if (entry && entry.answers && Object.keys(entry.answers).length > 0) {
      auditedDaysCount++;
      totalScoreSum += (entry.score || 0);

      ACCOUNTABILITY_QUESTIONS.forEach(q => {
        if (entry.answers[q.id] !== undefined) {
          catStats[q.id].earned += entry.answers[q.id];
          catStats[q.id].max += 2;
        }
      });

      if (entry.note && entry.note.trim()) {
        notesList.push({
          dateKey,
          score: entry.score || 0,
          note: entry.note.trim()
        });
      }
    }
  }

  // Update KPIs
  const kpiDays = document.getElementById('kpiDaysAudited');
  const kpiDaysTotal = document.getElementById('kpiDaysTotal');
  const kpiBar = document.getElementById('kpiAuditRateBar');
  const auditRatePct = totalDays > 0 ? Math.round((auditedDaysCount / totalDays) * 100) : 0;

  if (kpiDays) kpiDays.textContent = auditedDaysCount;
  if (kpiDaysTotal) kpiDaysTotal.textContent = `/ ${totalDays} days (${auditRatePct}%)`;
  if (kpiBar) kpiBar.style.width = `${auditRatePct}%`;

  const kpiAvg = document.getElementById('kpiAvgScore');
  const kpiVerdict = document.getElementById('kpiScoreVerdict');
  const avgScore = auditedDaysCount > 0 ? Math.round(totalScoreSum / auditedDaysCount) : 0;

  if (kpiAvg) kpiAvg.textContent = `${avgScore}%`;
  if (kpiVerdict) {
    if (auditedDaysCount === 0) {
      kpiVerdict.textContent = 'No audits recorded';
    } else if (avgScore >= 80) {
      kpiVerdict.textContent = 'High mindfulness & consistency';
    } else if (avgScore >= 60) {
      kpiVerdict.textContent = 'Good regular reflection';
    } else {
      kpiVerdict.textContent = 'Room for steadiness and growth';
    }
  }

  // Compute category breakdown scores
  const catScores = [];
  ACCOUNTABILITY_QUESTIONS.forEach(q => {
    const stat = catStats[q.id];
    const pct = stat.max > 0 ? Math.round((stat.earned / stat.max) * 100) : 0;
    catScores.push({ id: q.id, name: stat.name, pct, hasData: stat.max > 0 });
  });

  const sortedCats = [...catScores].filter(c => c.hasData).sort((a, b) => b.pct - a.pct);

  const topCatEl = document.getElementById('kpiTopCategory');
  const topScoreEl = document.getElementById('kpiTopScore');
  const growthCatEl = document.getElementById('kpiGrowthCategory');
  const growthScoreEl = document.getElementById('kpiGrowthScore');

  if (sortedCats.length > 0) {
    const best = sortedCats[0];
    const lowest = sortedCats[sortedCats.length - 1];

    if (topCatEl) topCatEl.textContent = best.name;
    if (topScoreEl) topScoreEl.textContent = `${best.pct}% consistency`;

    if (growthCatEl) growthCatEl.textContent = lowest.name;
    if (growthScoreEl) growthScoreEl.textContent = `${lowest.pct}% consistency`;
  } else {
    if (topCatEl) topCatEl.textContent = '--';
    if (topScoreEl) topScoreEl.textContent = 'No data';
    if (growthCatEl) growthCatEl.textContent = '--';
    if (growthScoreEl) growthScoreEl.textContent = 'No data';
  }

  // Render Category Breakdown Bars
  const breakdownListEl = document.getElementById('monthlyBreakdownList');
  if (breakdownListEl) {
    breakdownListEl.innerHTML = '';
    catScores.forEach(c => {
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      row.innerHTML = `
        <div class="breakdown-header">
          <span class="breakdown-name">${escapeHtml(c.name)}</span>
          <span class="breakdown-pct">${c.hasData ? c.pct + '%' : 'No data'}</span>
        </div>
        <div class="breakdown-bar-track">
          <div class="breakdown-bar-fill" style="width: ${c.hasData ? c.pct : 0}%;"></div>
        </div>
      `;
      breakdownListEl.appendChild(row);
    });
  }

  // Render Monthly Reflection Journal
  const reflectionsListEl = document.getElementById('monthlyReflectionsList');
  if (reflectionsListEl) {
    reflectionsListEl.innerHTML = '';
    if (notesList.length === 0) {
      reflectionsListEl.innerHTML = `
        <div class="reflections-empty">
          No daily reflection notes logged for this month yet. Use the reflection box in the Daily Audit tab!
        </div>
      `;
    } else {
      // Sort newest date first
      notesList.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
      notesList.forEach(n => {
        const item = document.createElement('div');
        item.className = 'reflection-item';

        const parts = n.dateKey.split('-');
        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        item.innerHTML = `
          <div class="reflection-item-header">
            <span class="reflection-date-badge">${formattedDate}</span>
            <span class="reflection-score-tag">${n.score}% Score</span>
          </div>
          <div class="reflection-text">${escapeHtml(n.note)}</div>
        `;
        reflectionsListEl.appendChild(item);
      });
    }
  }
}

function copyMonthlySummary() {
  const date = appState.accountabilityReportDate || {
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  };
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const totalDays = new Date(date.year, date.month + 1, 0).getDate();
  const mm = String(date.month + 1).padStart(2, '0');
  const prefix = `${date.year}-${mm}`;

  const allEntries = appState.accountability || {};
  let auditedDaysCount = 0;
  let totalScoreSum = 0;
  const catStats = {};
  ACCOUNTABILITY_QUESTIONS.forEach(q => {
    catStats[q.id] = { earned: 0, max: 0, name: q.category };
  });
  const notesList = [];

  for (let d = 1; d <= totalDays; d++) {
    const dayStr = String(d).padStart(2, '0');
    const dateKey = `${prefix}-${dayStr}`;
    const entry = allEntries[dateKey];
    if (entry && entry.answers && Object.keys(entry.answers).length > 0) {
      auditedDaysCount++;
      totalScoreSum += (entry.score || 0);
      ACCOUNTABILITY_QUESTIONS.forEach(q => {
        if (entry.answers[q.id] !== undefined) {
          catStats[q.id].earned += entry.answers[q.id];
          catStats[q.id].max += 2;
        }
      });
      if (entry.note && entry.note.trim()) {
        notesList.push({ dateKey, score: entry.score || 0, note: entry.note.trim() });
      }
    }
  }

  const avg = auditedDaysCount > 0 ? Math.round(totalScoreSum / auditedDaysCount) : 0;
  const rate = Math.round((auditedDaysCount / totalDays) * 100);

  let text = `=================================================\n`;
  text += `ISTIQAMAH — MONTHLY ACCOUNTABILITY REPORT\n`;
  text += `Month: ${monthNames[date.month]} ${date.year}\n`;
  text += `=================================================\n\n`;
  text += `OVERVIEW\n`;
  text += `• Days Audited: ${auditedDaysCount} of ${totalDays} (${rate}%)\n`;
  text += `• Accountability Index: ${avg}%\n\n`;
  text += `CATEGORY BREAKDOWN\n`;
  ACCOUNTABILITY_QUESTIONS.forEach(q => {
    const s = catStats[q.id];
    const pct = s.max > 0 ? Math.round((s.earned / s.max) * 100) : 0;
    text += `• ${s.name}: ${s.max > 0 ? pct + '%' : 'No data'}\n`;
  });

  if (notesList.length > 0) {
    text += `\nDAILY REFLECTIONS & LESSONS (${notesList.length} entries)\n`;
    notesList.forEach(n => {
      text += `[${n.dateKey} - ${n.score}% Score]:\n${n.note}\n\n`;
    });
  }

  navigator.clipboard.writeText(text).then(() => {
    const label = document.getElementById('copyMonthlySummaryText');
    if (label) {
      label.textContent = 'Copied!';
      setTimeout(() => { label.textContent = 'Copy Summary'; }, 2000);
    }
  }).catch(e => console.warn('Clipboard write error:', e));
}

async function loadSettingsInfo() {
  const pathLabel = document.getElementById('settingStoragePath');
  if (pathLabel && storageBridge.getDataFilePath) {
    const p = await storageBridge.getDataFilePath();
    pathLabel.textContent = p;
  }
}

function openResetModal() {
  const overlay = document.getElementById('modalResetOverlay');
  if (overlay) overlay.style.display = 'flex';
}

function closeResetModal() {
  const overlay = document.getElementById('modalResetOverlay');
  if (overlay) overlay.style.display = 'none';
}

function setupEventListeners() {
  // Navigation tabs
  document.getElementById('navToday')?.addEventListener('click', () => {
    appState.filterCategoryId = null;
    switchView('today');
    updateAllUI();
  });
  document.getElementById('navHistory')?.addEventListener('click', () => switchView('history'));
  document.getElementById('navFriends')?.addEventListener('click', () => switchView('friends'));
  document.getElementById('navQuiz')?.addEventListener('click', () => switchView('quiz'));
  document.getElementById('navAccountability')?.addEventListener('click', () => switchView('accountability'));
  document.getElementById('navSettings')?.addEventListener('click', () => switchView('settings'));

  // Quiz listeners
  document.getElementById('btnStartDailyQuiz')?.addEventListener('click', () => startQuiz('daily'));
  document.getElementById('btnStartPracticeQuiz')?.addEventListener('click', () => startQuiz('practice'));
  document.getElementById('btnQuitQuiz')?.addEventListener('click', () => {
    stopQuestionTimer();
    loadQuizView();
  });
  document.getElementById('btnNextQuestion')?.addEventListener('click', advanceToNextQuestion);
  document.getElementById('btnToggleReview')?.addEventListener('click', () => {
    const list = document.getElementById('resultsReviewList');
    const btn = document.getElementById('btnToggleReview');
    if (list) {
      const isHidden = list.style.display === 'none';
      list.style.display = isHidden ? 'flex' : 'none';
      if (btn) btn.textContent = isHidden ? 'Hide Review' : 'Review Answers';
    }
  });
  document.getElementById('btnResultsBackToLobby')?.addEventListener('click', loadQuizView);
  document.getElementById('btnRefreshQuizStandings')?.addEventListener('click', renderFriendsQuizStandings);

  // Keyboard controls for quiz arena (1, 2, 3, 4, Enter, Space)
  window.addEventListener('keydown', (e) => {
    if (appState.currentView !== 'quiz') return;
    const arena = document.getElementById('quizArenaView');
    if (!arena || arena.style.display === 'none') return;

    if (!activeQuizSession.isAnswered) {
      if (e.key === '1' || e.key.toLowerCase() === 'a') handleQuizAnswer(0);
      else if (e.key === '2' || e.key.toLowerCase() === 'b') handleQuizAnswer(1);
      else if (e.key === '3' || e.key.toLowerCase() === 'c') handleQuizAnswer(2);
      else if (e.key === '4' || e.key.toLowerCase() === 'd') handleQuizAnswer(3);
    } else {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advanceToNextQuestion();
      }
    }
  });

  // Accountability: Sub tabs
  document.getElementById('tabDailyAudit')?.addEventListener('click', () => switchAccountabilitySubTab('daily'));
  document.getElementById('tabMonthlyReport')?.addEventListener('click', () => switchAccountabilitySubTab('monthly'));

  // Accountability: Save Audit
  document.getElementById('btnSaveAudit')?.addEventListener('click', saveTodayAuditManual);

  // Accountability: Note auto-save on input
  let noteDebounce = null;
  document.getElementById('inputAuditNote')?.addEventListener('input', (e) => {
    clearTimeout(noteDebounce);
    noteDebounce = setTimeout(() => {
      const entry = getTodayAuditEntry();
      entry.note = e.target.value.trim();
      entry.updatedAt = new Date().toISOString();
      scheduleSave();
    }, 400);
  });

  // Accountability: Month selector buttons
  document.getElementById('btnPrevMonthReport')?.addEventListener('click', () => {
    if (!appState.accountabilityReportDate) {
      const now = new Date();
      appState.accountabilityReportDate = { year: now.getFullYear(), month: now.getMonth() };
    }
    let { year, month } = appState.accountabilityReportDate;
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    appState.accountabilityReportDate = { year, month };
    renderMonthlyReport(year, month);
  });

  document.getElementById('btnNextMonthReport')?.addEventListener('click', () => {
    if (!appState.accountabilityReportDate) {
      const now = new Date();
      appState.accountabilityReportDate = { year: now.getFullYear(), month: now.getMonth() };
    }
    let { year, month } = appState.accountabilityReportDate;
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    appState.accountabilityReportDate = { year, month };
    renderMonthlyReport(year, month);
  });

  // Accountability: Copy Summary
  document.getElementById('btnCopyMonthlySummary')?.addEventListener('click', copyMonthlySummary);

  // Friends: Copy Friend Code
  document.getElementById('btnCopyFriendCode')?.addEventListener('click', async () => {
    const code = appState.profile?.friendCode;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      const textSpan = document.getElementById('btnCopyFriendCodeText');
      if (textSpan) {
        textSpan.textContent = 'Copied!';
        setTimeout(() => { textSpan.textContent = 'Copy'; }, 2000);
      }
    } catch (e) {
      console.warn('Could not copy:', e);
    }
  });

  // Friends: Edit Name Modal Listeners
  document.getElementById('btnEditDisplayName')?.addEventListener('click', openEditNameModal);
  document.getElementById('userDisplayNameText')?.addEventListener('click', openEditNameModal);
  document.getElementById('btnCloseEditNameModal')?.addEventListener('click', closeEditNameModal);
  document.getElementById('btnCancelEditNameModal')?.addEventListener('click', closeEditNameModal);
  document.getElementById('formEditName')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSaveDisplayName();
  });
  document.getElementById('modalEditNameOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalEditNameOverlay') closeEditNameModal();
  });

  // Friends: Add Friend by Code
  document.getElementById('btnAddFriendSubmit')?.addEventListener('click', async () => {
    const input = document.getElementById('inputFriendCode');
    const msg = document.getElementById('msgFriendStatus');
    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
      msg.textContent = 'Please enter a friend code.';
      msg.className = 'friend-status-msg error';
      msg.style.display = 'block';
      return;
    }

    if (!window.friendsAPI) {
      msg.textContent = 'Friends sync requires the desktop app.';
      msg.className = 'friend-status-msg error';
      msg.style.display = 'block';
      return;
    }

    msg.textContent = 'Looking up friend...';
    msg.className = 'friend-status-msg';
    msg.style.display = 'block';

    const res = await window.friendsAPI.lookupFriendCode({
      myProfileId: appState.profile?.id,
      friendCode: code
    });

    if (!res.success) {
      msg.textContent = res.error || 'Friend code not found.';
      msg.className = 'friend-status-msg error';
      msg.style.display = 'block';
      return;
    }

    if (appState.friendIds.includes(res.friend.id)) {
      msg.textContent = `${res.friend.displayName} is already on your friends list.`;
      msg.className = 'friend-status-msg';
      msg.style.display = 'block';
      input.value = '';
      return;
    }

    appState.friendIds.push(res.friend.id);
    scheduleSave();
    input.value = '';
    msg.textContent = `Added ${res.friend.displayName} to your friends!`;
    msg.className = 'friend-status-msg success';
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
    refreshFriendsList();
  });

  // Friends: Refresh button
  document.getElementById('btnRefreshFriends')?.addEventListener('click', () => {
    refreshFriendsList();
  });

  // Clear category filter button
  document.getElementById('btnClearCategoryFilter')?.addEventListener('click', () => {
    appState.filterCategoryId = null;
    updateAllUI();
  });
  document.getElementById('btnShowAllCategories')?.addEventListener('click', () => {
    appState.filterCategoryId = null;
    switchView('today');
    updateAllUI();
  });

  // Add Habit Buttons
  document.getElementById('btnOpenAddHabit')?.addEventListener('click', () => {
    openAddTaskModal(appState.filterCategoryId || 'quran');
  });
  document.getElementById('btnSidebarAddHabit')?.addEventListener('click', () => {
    openAddTaskModal(appState.filterCategoryId || 'quran');
  });

  // Task Modal handlers
  document.getElementById('btnCloseTaskModal')?.addEventListener('click', closeTaskModal);
  document.getElementById('btnCancelTaskModal')?.addEventListener('click', closeTaskModal);
  document.getElementById('modalTaskOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalTaskOverlay') closeTaskModal();
  });

  document.getElementById('formTaskModal')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveTaskFromModal();
  });
  document.getElementById('btnSaveTaskModal')?.addEventListener('click', (e) => {
    e.preventDefault();
    saveTaskFromModal();
  });

  document.getElementById('btnDeleteTask')?.addEventListener('click', () => {
    const id = document.getElementById('inputTaskId').value;
    if (id) {
      deleteTask(id);
      closeTaskModal();
    }
  });

  // Reset Modal handlers
  document.getElementById('btnResetToDefaults')?.addEventListener('click', () => {
    openResetModal();
  });
  document.getElementById('btnCloseResetModal')?.addEventListener('click', closeResetModal);
  document.getElementById('btnCancelResetModal')?.addEventListener('click', closeResetModal);
  document.getElementById('modalResetOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalResetOverlay') closeResetModal();
  });
  document.getElementById('btnConfirmResetModal')?.addEventListener('click', () => {
    appState.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    appState.completedTaskIds.clear();
    appState.waterGlasses = 0;
    appState.history = {};
    appState.streaks = { current: 0, best: 0 };
    updateAllUI();
    scheduleSave();
    closeResetModal();
  });

  // Settings: Clear Today
  document.getElementById('btnClearTodayChecklist')?.addEventListener('click', () => {
    if (confirm("Uncheck all tasks for today? Your past history will be kept.")) {
      appState.completedTaskIds.clear();
      appState.waterGlasses = 0;
      updateAllUI();
      scheduleSave();
    }
  });

  // Accent Theme Picker Listeners
  document.querySelectorAll('.theme-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tid = btn.getAttribute('data-theme-id');
      if (tid) applyTheme(tid, true);
    });
  });

  // What's New Modal Listeners
  document.getElementById('btnOpenWhatsNew')?.addEventListener('click', () => {
    showWhatsNewModal();
  });
  document.getElementById('btnCloseWhatsNewModal')?.addEventListener('click', () => {
    closeWhatsNewModal();
  });
  document.getElementById('btnDismissWhatsNew')?.addEventListener('click', () => {
    closeWhatsNewModal();
  });
  document.getElementById('modalWhatsNewOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalWhatsNewOverlay') {
      closeWhatsNewModal();
    }
  });

  // Setup In-App Auto-Updater Banner
  setupUpdaterUI();
}

function setupUpdaterUI() {
  if (typeof window === 'undefined' || !window.updaterAPI) return;

  const banner = document.getElementById('updateBanner');
  const title = document.getElementById('updateBannerTitle');
  const desc = document.getElementById('updateBannerDesc');
  const restartBtn = document.getElementById('btnUpdateRestart');
  const dismissBtn = document.getElementById('btnDismissUpdate');

  dismissBtn?.addEventListener('click', () => {
    if (banner) banner.style.display = 'none';
  });

  restartBtn?.addEventListener('click', () => {
    window.updaterAPI.installUpdate();
  });

  window.updaterAPI.onUpdateAvailable((info) => {
    if (banner) banner.style.display = 'flex';
    if (title) title.textContent = `Update v${info.version || ''} Available`;
    if (desc) desc.textContent = 'Downloading update in the background...';
    if (restartBtn) restartBtn.style.display = 'none';
  });

  window.updaterAPI.onDownloadProgress((progress) => {
    if (desc && progress) {
      desc.textContent = `Downloading update: ${Math.round(progress.percent || 0)}%...`;
    }
  });

  window.updaterAPI.onUpdateDownloaded((info) => {
    if (banner) banner.style.display = 'flex';
    if (title) title.textContent = `Update v${info.version || ''} Ready!`;
    if (desc) desc.textContent = 'Restart now to apply new features seamlessly.';
    if (restartBtn) restartBtn.style.display = 'inline-flex';
  });

  window.updaterAPI.onUpdateError?.((err) => {
    if (banner && desc) {
      desc.textContent = 'Retrying update check in the background...';
    }
  });
}

// -----------------------------------------------------------------------------
// Midnight Day Reset
// -----------------------------------------------------------------------------
function checkForDayReset() {
  const currentLocalDay = getLocalDateString();

  if (currentLocalDay !== appState.todayDateKey) {
    console.log(`[Midnight Reset] Moving to ${currentLocalDay}`);

    const stats = computeAllStats();
    appState.history[appState.todayDateKey] = {
      completedTaskIds: Array.from(appState.completedTaskIds),
      waterGlasses: appState.waterGlasses,
      allRequiredDone: stats.allRequiredDone
    };

    appState.todayDateKey = currentLocalDay;
    appState.completedTaskIds.clear();
    appState.waterGlasses = 0;

    updateAllUI();
    if (appState.currentView === 'accountability') {
      loadAccountabilityView();
    }
    if (appState.currentView === 'quiz') {
      loadQuizView();
    }
    scheduleSave();
  }
}

// -----------------------------------------------------------------------------
// Persistence
// -----------------------------------------------------------------------------
let saveDebounce = null;

function scheduleSave() {
  clearTimeout(saveDebounce);
  saveDebounce = setTimeout(async () => {
    try {
      const stats = computeAllStats();
      const payload = {
        lastDate: appState.todayDateKey,
        categories: appState.categories,
        streaks: appState.streaks,
        profile: appState.profile,
        friendIds: appState.friendIds,
        theme: appState.theme || 'purple',
        lastSeenVersion: appState.lastSeenVersion || CURRENT_VERSION,
        accountability: appState.accountability || {},
        quiz: appState.quiz || { history: {}, streak: 0, bestScore: 0, totalPoints: 0 },
        history: {
          ...appState.history,
          [appState.todayDateKey]: {
            completedTaskIds: Array.from(appState.completedTaskIds),
            waterGlasses: appState.waterGlasses,
            allRequiredDone: stats.allRequiredDone
          }
        }
      };
      await storageBridge.saveData(payload);
      syncProgressToCloud();
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }, 250);
}

async function loadSavedState() {
  try {
    const saved = await storageBridge.loadData();
    if (!saved) {
      console.log('Clean fresh start: all tasks unchecked.');
      appState.completedTaskIds = new Set();
      appState.waterGlasses = 0;
      appState.accountability = {};
      appState.quiz = { history: {}, streak: 0, bestScore: 0, totalPoints: 0 };
      return;
    }

    if (Array.isArray(saved.categories) && saved.categories.length > 0) {
      // Re-hydrate categories ensuring canonical icons and IDs are preserved
      saved.categories.forEach(savedCat => {
        const defaultCat = DEFAULT_CATEGORIES.find(c => c.id === savedCat.id || c.name === savedCat.name);
        if (defaultCat) {
          savedCat.iconSvg = defaultCat.iconSvg;
          savedCat.id = defaultCat.id;
        }
      });
      appState.categories = saved.categories;
    }

    if (saved.history && typeof saved.history === 'object') {
      appState.history = saved.history;
    }

    if (saved.streaks && typeof saved.streaks === 'object') {
      appState.streaks = saved.streaks;
    }

    if (saved.profile && typeof saved.profile === 'object') {
      appState.profile = saved.profile;
    }

    if (Array.isArray(saved.friendIds)) {
      appState.friendIds = saved.friendIds;
    }

    if (typeof saved.theme === 'string') {
      appState.theme = saved.theme;
    }

    if (typeof saved.lastSeenVersion === 'string') {
      appState.lastSeenVersion = saved.lastSeenVersion;
    }

    if (saved.accountability && typeof saved.accountability === 'object') {
      appState.accountability = saved.accountability;
    } else {
      appState.accountability = {};
    }

    if (saved.quiz && typeof saved.quiz === 'object') {
      appState.quiz = {
        history: saved.quiz.history || {},
        streak: saved.quiz.streak || 0,
        bestScore: saved.quiz.bestScore || 0,
        totalPoints: saved.quiz.totalPoints || 0
      };
    } else {
      appState.quiz = { history: {}, streak: 0, bestScore: 0, totalPoints: 0 };
    }

    const currentToday = getLocalDateString();
    appState.todayDateKey = currentToday;

    if (appState.history[currentToday]) {
      const todayRec = appState.history[currentToday];
      if (Array.isArray(todayRec.completedTaskIds)) {
        appState.completedTaskIds = new Set(todayRec.completedTaskIds);
      }
      if (typeof todayRec.waterGlasses === 'number') {
        appState.waterGlasses = todayRec.waterGlasses;
      }
    } else {
      // First time today: strictly empty!
      appState.completedTaskIds = new Set();
      appState.waterGlasses = 0;
    }
  } catch (err) {
    console.warn('Could not read existing state:', err);
    appState.completedTaskIds = new Set();
    appState.waterGlasses = 0;
  }
}

// -----------------------------------------------------------------------------
// Themes & Release Updates Modal
// -----------------------------------------------------------------------------
function applyTheme(themeId, shouldSave = true) {
  const validThemes = ['purple', 'pink', 'green', 'red', 'blue', 'gold'];
  const theme = validThemes.includes(themeId) ? themeId : 'purple';
  appState.theme = theme;

  if (theme === 'purple') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  document.querySelectorAll('.theme-choice-btn').forEach(btn => {
    if (btn.getAttribute('data-theme-id') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (shouldSave) {
    scheduleSave();
  }
}

function checkWhatsNew() {
  if (!appState.lastSeenVersion || appState.lastSeenVersion !== CURRENT_VERSION) {
    showWhatsNewModal();
  }
}

function showWhatsNewModal() {
  const modal = document.getElementById('modalWhatsNewOverlay');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeWhatsNewModal() {
  const modal = document.getElementById('modalWhatsNewOverlay');
  if (modal) {
    modal.style.display = 'none';
  }
  appState.lastSeenVersion = CURRENT_VERSION;
  scheduleSave();
}

// -----------------------------------------------------------------------------
// App Initialization
// -----------------------------------------------------------------------------
async function initApp() {
  await loadSavedState();
  applyTheme(appState.theme || 'purple', false);
  setupEventListeners();
  updateAllUI();
  switchView('today');
  checkWhatsNew();

  // Check midnight reset every 15s
  setInterval(() => {
    checkForDayReset();
  }, 15000);
}

document.addEventListener('DOMContentLoaded', initApp);
