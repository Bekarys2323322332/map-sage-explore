import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = (countryId: string) => {
    navigate(`/country/${countryId}`);
  };

  const countryColors: Record<string, string> = {
    "kazakhstan": "hsl(210, 70%, 60%)",
    "uzbekistan": "hsl(280, 70%, 65%)",
    "kyrgyzstan": "hsl(340, 75%, 65%)",
    "tajikistan": "hsl(150, 65%, 55%)",
    "turkmenistan": "hsl(35, 75%, 60%)",
  };

  const countryPositions: Record<string, { x: number; y: number }> = {
    "kazakhstan": { x: 67, y: 50 },
    "uzbekistan": { x: 63, y: 42 },
    "kyrgyzstan": { x: 75, y: 42 },
    "tajikistan": { x: 71, y: 39 },
    "turkmenistan": { x: 58, y: 39 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Central Asia Interactive Museum</h1>
          <p className="text-muted-foreground">Select a country to explore its cultural heritage</p>
        </div>

        <div className="relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [65, 42],
              scale: 1400,
            }}
            className="w-full h-auto"
            style={{ maxHeight: "75vh" }}
          >
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json">
              {({ geographies }) =>
                geographies
                  .filter((geo) => 
                    ["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"].includes(geo.properties.name)
                  )
                  .map((geo) => {
                    const countryId = geo.properties.name.toLowerCase();
                    const baseColor = countryColors[countryId];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={hoveredCountry === countryId ? `${baseColor.replace(')', ', 0.9)')}` : baseColor}
                        stroke="hsl(var(--background))"
                        strokeWidth={0.8}
                        className="cursor-pointer transition-all duration-500 ease-out"
                        onMouseEnter={() => setHoveredCountry(countryId)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => handleCountryClick(countryId)}
                        style={{
                          outline: "none",
                          filter: hoveredCountry === countryId ? "brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))" : "brightness(1)",
                          transform: hoveredCountry === countryId ? "scale(1.02)" : "scale(1)",
                          transformOrigin: "center",
                        }}
                      />
                    );
                  })
              }
            </Geographies>
            {Object.entries(countryPositions).map(([countryId, pos]) => (
              <text
                key={countryId}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                className="fill-white text-sm font-bold pointer-events-none capitalize transition-all duration-300"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  fontSize: hoveredCountry === countryId ? "16px" : "14px",
                  opacity: hoveredCountry === countryId ? 1 : 0.9,
                }}
              >
                {countryId}
              </text>
            ))}
          </ComposableMap>
        </div>
      </div>
    </div>
  );
};

export default Index;
