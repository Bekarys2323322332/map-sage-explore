export const useTranslation = (language: string) => {
  const isKazakh = language === "Қазақша";

  const t = (key: string): string => {
    if (isKazakh) {
      return "jyga";
    }

    const translations: Record<string, string> = {
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

    return translations[key] || key;
  };

  return { t, isKazakh };
};
