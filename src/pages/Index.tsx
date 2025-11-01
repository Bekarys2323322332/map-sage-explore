import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");

  const translations = {
    English: {
      title: "Central Asia Interactive Museum",
      description: "Select a country to explore its cultural heritage",
      countries: {
        kazakhstan: "Kazakhstan",
        uzbekistan: "Uzbekistan",
        kyrgyzstan: "Kyrgyzstan",
        tajikistan: "Tajikistan",
        turkmenistan: "Turkmenistan",
      },
    },
    Русский: {
      title: "Интерактивный музей Центральной Азии",
      description: "Выберите страну для изучения её культурного наследия",
      countries: {
        kazakhstan: "Казахстан",
        uzbekistan: "Узбекистан",
        kyrgyzstan: "Кыргызстан",
        tajikistan: "Таджикистан",
        turkmenistan: "Туркменистан",
      },
    },
    Қазақша: {
      title: "Орталық Азия интерактивті мұражайы",
      description: "Мәдени мұрасын зерттеу үшін елді таңдаңыз",
      countries: {
        kazakhstan: "Қазақстан",
        uzbekistan: "Өзбекстан",
        kyrgyzstan: "Қырғызстан",
        tajikistan: "Тәжікстан",
        turkmenistan: "Түрікменстан",
      },
    },
  };

  const t = translations[language as keyof typeof translations];

  const handleCountryClick = (countryId: string) => {
    navigate(`/country/${countryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-6xl w-full space-y-8">
        <div className="flex justify-end mb-4">
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto"
          style={{ maxHeight: "70vh" }}
        >
          {/* Kazakhstan */}
          <path
            d="M 150 100 L 600 80 L 650 150 L 620 250 L 550 280 L 400 260 L 300 200 L 200 180 Z"
            fill={hoveredCountry === "kazakhstan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("kazakhstan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("kazakhstan")}
          />
          <text x="400" y="180" textAnchor="middle" className="fill-foreground text-xl font-semibold pointer-events-none">
            {t.countries.kazakhstan}
          </text>

          {/* Uzbekistan */}
          <path
            d="M 250 300 L 400 280 L 480 320 L 470 400 L 380 420 L 280 380 Z"
            fill={hoveredCountry === "uzbekistan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("uzbekistan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("uzbekistan")}
          />
          <text x="370" y="350" textAnchor="middle" className="fill-foreground text-xl font-semibold pointer-events-none">
            {t.countries.uzbekistan}
          </text>

          {/* Kyrgyzstan */}
          <path
            d="M 480 280 L 580 260 L 620 300 L 600 360 L 520 380 L 480 320 Z"
            fill={hoveredCountry === "kyrgyzstan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("kyrgyzstan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("kyrgyzstan")}
          />
          <text x="540" y="320" textAnchor="middle" className="fill-foreground text-xl font-semibold pointer-events-none">
            {t.countries.kyrgyzstan}
          </text>

          {/* Tajikistan */}
          <path
            d="M 480 380 L 560 400 L 580 450 L 520 480 L 450 460 L 440 420 Z"
            fill={hoveredCountry === "tajikistan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("tajikistan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("tajikistan")}
          />
          <text x="510" y="440" textAnchor="middle" className="fill-foreground text-xl font-semibold pointer-events-none">
            {t.countries.tajikistan}
          </text>

          {/* Turkmenistan */}
          <path
            d="M 150 400 L 280 380 L 320 450 L 300 520 L 180 500 Z"
            fill={hoveredCountry === "turkmenistan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--foreground))"
            strokeWidth="3"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("turkmenistan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("turkmenistan")}
          />
          <text x="250" y="450" textAnchor="middle" className="fill-foreground text-xl font-semibold pointer-events-none">
            {t.countries.turkmenistan}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Index;
