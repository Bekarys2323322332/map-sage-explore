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
  };

  const t = (key: string): string => {
    const dict = isKazakh ? translationsKZ : translationsEN;
    return dict[key] || key;
  };

  return { t, isKazakh };
};
