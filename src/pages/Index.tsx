import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import ChatPopup from "@/components/ChatPopup";

const Index = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | undefined>(undefined);

  // Цвета стран
  const countryColors: Record<string, string> = {
    kazakhstan: "hsl(210, 70%, 60%)",
    uzbekistan: "hsl(280, 70%, 65%)",
    kyrgyzstan: "hsl(340, 75%, 65%)",
    tajikistan: "hsl(150, 65%, 55%)",
    turkmenistan: "hsl(35, 75%, 60%)",
  };

  // Примерные координаты центров
  const countryPositions: Record<string, { x: number; y: number }> = {
    kazakhstan: { x: 68, y: 47 },
    uzbekistan: { x: 62, y: 40.5 },
    kyrgyzstan: { x: 75, y: 42 },
    tajikistan: { x: 71, y: 39 },
    turkmenistan: { x: 59, y: 40 },
  };

  // 👇 встроенный маппер без отдельного файла
  const countryNameToCode = (name: string): string => {
    const n = name.toLowerCase();
    switch (n) {
      case "kazakhstan":
        return "kz";
      case "uzbekistan":
        return "uz";
      case "kyrgyzstan":
        return "kg";
      case "tajikistan":
        return "tj";
      case "turkmenistan":
        return "tm";
      default:
        return "kz";
    }
  };

  const handleCountryClick = (countryId: string) => {
    setSelectedCountry(countryId); // 'kazakhstan'
    const pos = countryPositions[countryId];
    if (pos) {
      setSelectedCoords([pos.y, pos.x]); // [lat, lon]
    } else {
      setSelectedCoords([43.25, 76.9]);
    }
    setShowChat(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-7 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-9xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground tracking-tight">Central Asia Interactive Museum</h1>
          <p className="text-lg text-muted-foreground">Select a country to explore its cultural heritage</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card/50 backdrop-blur-sm border border-border/50">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [65, 46],
              scale: 1100,
            }}
            className="w-full h-auto"
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
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={hoveredCountry === countryId ? baseColor : "hsl(var(--muted))"}
                        stroke="hsl(var(--border))"
                        strokeWidth={0.8}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredCountry(countryId)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => handleCountryClick(countryId)}
                        style={{
                          default: { outline: "none", transition: "all 0.3s ease" },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
              }
            </Geographies>

            {Object.entries(countryPositions).map(([countryId, pos]) => (
              <Marker key={countryId} coordinates={[pos.x, pos.y + 1]}>
                <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="fill-foreground font-bold pointer-events-none capitalize"
                  style={{
                    fontSize: "28px",
                    paintOrder: "stroke",
                    stroke: "hsl(var(--background))",
                    strokeWidth: "4px",
                    opacity: hoveredCountry === countryId ? 1 : 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  {countryId}
                </text>
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>

      {showChat && selectedCountry && selectedCoords && (
        <ChatPopup
          location={null}
          coordinates={selectedCoords}
          onClose={() => setShowChat(false)}
          language="en"
          country={countryNameToCode(selectedCountry)} // 👈 вот сюда передаём
        />
      )}
    </div>
  );
};

export default Index;
