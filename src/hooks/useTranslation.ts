export const useTranslation = (language: string) => {
  const isKazakh = language === "Қазақша";

  const translationsEN: Record<string, string> = {
    // Home page
    explore_silk_road: "Explore the Silk Road",
    central_asia_museum: "Central Asia Interactive Museum",
    select_country: "Select a country to explore its cultural heritage",
    click_country: "Click a country to explore",

    // Header
    about: "About",
    resources: "Resources",
    home: "Home",

    // Footer
    tengrimap: "TengriMap",
    explore_heritage: "Explore the rich cultural heritage of Central Asia through interactive storytelling",
    explore: "Explore",
    connect: "Connect",
    rights_reserved: "© 2025 TengriMap. All rights reserved.",
    made_with: "Made with",
    for_central_asia: "for Central Asia",

    // Country View
    back: "Back",
    drop_pin: "Drop a pin:",

    // Settings
    settings: "Settings",
    customize: "Customize your TengriMap experience",
    dark_mode: "Dark Mode",
    map_style: "Map Style",
    language: "Language",
    satellite: "Satellite",
    political: "Political",
    topographical: "Topographical",

    // Countries
    kazakhstan: "Kazakhstan",
    uzbekistan: "Uzbekistan",
    kyrgyzstan: "Kyrgyzstan",
    tajikistan: "Tajikistan",
    turkmenistan: "Turkmenistan",

    // About page
    about_nomadland: "About Nomadland",
    about_description: "Discover the rich cultural heritage of Central Asia like never before. TengriMap brings the history, traditions, and stories of Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, and Turkmenistan to life through an interactive and immersive platform.",
    our_mission: "Our Mission",
    mission_description: "Celebrate and preserve the diverse cultures, history, and traditions of Central Asia, sharing the unique narratives that have shaped this region.",
    interactive_experience: "Interactive Experience",
    interactive_description: "Navigate each country with our interactive map to uncover historical sites, cultural landmarks, and traditions that define Central Asia.",
    cultural_connection: "Cultural Connection",
    cultural_description: "Engage with the stories, people, and heritage along the Silk Road, understanding how these nations have influenced global culture and history.",
    educational_insight: "Educational Insight",
    educational_description: "Learn from ancient civilizations to modern practices with our AI-powered resources and comprehensive guides, making cultural knowledge accessible to everyone.",
  };

  const translationsKZ: Record<string, string> = {
    // Home page
    explore_silk_road: "Жібек жолын зерттеңіз",
    central_asia_museum: "Орталық Азияның интерактивті мұражайы",
    select_country: "Мәдени мұрасын зерттеу үшін елді таңдаңыз",
    click_country: "Зерттеу үшін Қалаған елді таңдаңыз",

    // Header
    about: "Біз туралы",
    resources: "Ресурстар",
    home: "Басты бет",

    // Footer
    tengrimap: "TengriMap",
    explore_heritage: "Интерактивті форматта Орталық Азияның бай мәдени мұрасын зерттеңіз",
    explore: "Зерттеу",
    connect: "Байланыс",
    rights_reserved: "© 2025 TengriMap. Барлық құқықтар қорғалған.",
    made_with: "Махаббатпен жасалған",
    for_central_asia: "Орталық Азия үшін",

    // Country View
    back: "Артқа",
    drop_pin: "Белгі қою:",

    // Settings
    settings: "Баптаулар",
    customize: "TengriMap тәжірибеңізді баптаңыз",
    dark_mode: "Қараңғы режим",
    map_style: "Карта стилі",
    language: "Тіл",
    satellite: "Спутниктік",
    political: "Саяси",
    topographical: "Топографиялық",

    // Countries
    kazakhstan: "Қазақстан",
    uzbekistan: "Өзбекстан",
    kyrgyzstan: "Қырғызстан",
    tajikistan: "Тәжікстан",
    turkmenistan: "Түрікменстан",

    // About page (Kazakh)
    about_nomadland: "Көшпенділер елі туралы",
    about_description: "Орталық Азияның бай мәдени мұрасын бұрын-соңды болмаған тәсілмен ашыңыз. NomadMap Қазақстан, Өзбекстан, Қырғызстан, Тәжікстан және Түрікменстанның тарихын, дәстүрлерін және оқиғаларын интерактивті әрі көрнекі түрде көрсетеді.",
    our_mission: "Біздің миссиямыз",
    mission_description: "NomadMap Орталық Азияның бес мемлекетінің — Қазақстан, Өзбекстан, Қырғызстан, Тәжікстан және Түрікменстанның мәдени мұрасын, тарихын және дәстүрлерін көрсетуге арналған.",
    interactive_experience: "Интерактивті тәжірибе",
    interactive_description: "Әр елді интерактивті карта арқылы зерттеп, тарихи орындарды, мәдени ескерткіштерді және осы қызықты аймақты қалыптастырған бай дәстүрлерді ашыңыз.",
    cultural_connection: "Мәдени байланыс",
    cultural_description: "Жібек жолының әңгімелерімен, адамдарымен және мұрасымен байланысыңыз, осы елдердің жаһандық мәдениет пен тарихқа қалай үлес қосқанын түсініңіз.",
    educational_insight: "Білім беру ресурсы",
    educational_description: "Әр елдің бірегей ерекшеліктері туралы біліңіз: ежелгі өркениеттерден қазіргі мәдени тәжірибелерге дейін, біздің AI-платформалы чатботымыз және толық ақпарат арқылы.",

  };    


  const t = (key: string): string => {
    const dict = isKazakh ? translationsKZ : translationsEN;
    return dict[key] || key;
  };

  return { t, isKazakh };
};
