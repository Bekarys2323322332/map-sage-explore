import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Sparkles, Globe, MapPin, MousePointer2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { useTouchHover } from "@/hooks/useTouchHover";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "English";
  });
  const { t } = useTranslation(language);
  const [mapStyle, setMapStyle] = useState(() => {
    return localStorage.getItem("mapStyle") || "satellite";
  });
  const { handleClick, isHovered, isTouch } = useTouchHover("map");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("mapStyle", mapStyle);
  }, [mapStyle]);

  const countryColors: Record<string, string> = {
    kazakhstan: "hsl(210, 70%, 60%)",
    uzbekistan: "hsl(280, 70%, 65%)",
    kyrgyzstan: "hsl(340, 75%, 65%)",
    tajikistan: "hsl(150, 65%, 55%)",
    turkmenistan: "hsl(35, 75%, 60%)",
  };

  const countryPositions: Record<string, { x: number; y: number; animal: string }> = {
    kazakhstan: { x: 68, y: 47, animal: "🇰🇿" },
    uzbekistan: { x: 62, y: 40.5, animal: "🇺🇿" },
    kyrgyzstan: { x: 75, y: 42, animal: "🇰🇬" },
    tajikistan: { x: 71, y: 39, animal: "🇹🇯" },
    turkmenistan: { x: 59, y: 40, animal: "🇹🇲" },
  };

  const handleCountryClick = (countryId: string) => {
    navigate(`/country/${countryId}`, { state: { language, mapStyle } });
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} mapStyle={mapStyle} onMapStyleChange={setMapStyle} />

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-7 pt-24 overflow-hidden">
        {/* Animated background with gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-muted/40 animate-gradient bg-[length:400%_400%]" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-5 sm:left-10 w-32 h-32 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Main content */}
        <div className="relative z-10 max-w-7xl w-full space-y-8 sm:space-y-12 animate-fade-in">
          {/* Hero section */}
          <div className="text-center space-y-4 sm:space-y-6 px-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-scale-in">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-primary">{t("explore_silk_road")}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-tight px-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {t("central_asia_museum")}
              </span>
            </h2>

            <div className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg md:text-xl text-muted-foreground px-2">
              <p className="text-center">{t("select_country")}</p>
            </div>

            {/* Helper text */}
            <div className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-lg animate-fade-in mt-4">
              <MousePointer2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-sm sm:text-base font-medium text-foreground">{t("click_country")}</span>
            </div>
          </div>

          {/* Map container with enhanced styling */}
          <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-card/80 backdrop-blur-md border-2 border-border/50 hover:border-primary/30 transition-all duration-500">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [65, 46],
                  scale: 1100,
                }}
                className="w-full h-auto transition-all duration-300"
                style={{ maxHeight: "70vh" }}
              >
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json">
                  {({ geographies }) =>
                    geographies
                      .filter((geo) =>
                        ["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"].includes(
                          geo.properties.name,
                        ),
                      )
                      .map((geo) => {
                        const countryId = geo.properties.name.toLowerCase();
                        const baseColor = countryColors[countryId];
                        const isCountryHovered = hoveredCountry === countryId || isHovered(countryId);

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isCountryHovered ? baseColor : "hsl(var(--muted))"}
                            stroke={isCountryHovered ? baseColor : "hsl(var(--border))"}
                            strokeWidth={isCountryHovered ? 1.5 : 0.8}
                            className="cursor-pointer transition-all duration-300"
                            onMouseEnter={() => !isTouch && setHoveredCountry(countryId)}
                            onMouseLeave={() => !isTouch && setHoveredCountry(null)}
                            onClick={(e) => {
                              if (isTouch) {
                                handleClick(e, countryId, () => handleCountryClick(countryId));
                              } else {
                                handleCountryClick(countryId);
                              }
                            }}
                            style={{
                              default: {
                                outline: "none",
                                filter: isCountryHovered
                                  ? "brightness(1.3) drop-shadow(0 0 30px rgba(255,215,0,0.7))"
                                  : "brightness(1)",
                                transform: isCountryHovered ? "scale(1.03)" : "scale(1)",
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                              },
                              hover: { outline: "none" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                  }
                </Geographies>

                {Object.entries(countryPositions).map(([countryId, pos]) => {
                  const isCountryHovered = hoveredCountry === countryId || isHovered(countryId);
                  return (
                    <Marker key={countryId} coordinates={[pos.x, pos.y + 1]}>
                      <g className="pointer-events-none">
                        {/* Shadow for text */}
                        <text
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          className="font-bold capitalize"
                          style={{
                            fontSize: "32px",
                            opacity: isCountryHovered ? 0.3 : 0,
                            transition: "all 0.4s ease",
                            transform: isCountryHovered ? "scale(1.15)" : "scale(1)",
                            fill: "#000",
                            filter: "blur(4px)",
                          }}
                        >
                          {pos.animal} {countryId}
                        </text>

                        {/* Main text */}
                        <text
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          className="font-bold capitalize"
                          style={{
                            fontSize: "28px",
                            opacity: isCountryHovered ? 1 : 0,
                            transition: "all 0.4s ease",
                            transform: isCountryHovered ? "scale(1.15)" : "scale(1)",
                            fill: "hsl(var(--foreground))",
                            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                          }}
                        >
                          {pos.animal} {countryId}
                        </text>
                      </g>
                    </Marker>
                  );
                })}
              </ComposableMap>
            </div>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default Index;
