import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const countryColors: Record<string, string> = {
    kazakhstan: "hsl(210, 70%, 60%)",
    uzbekistan: "hsl(280, 70%, 65%)",
    kyrgyzstan: "hsl(340, 75%, 65%)",
    tajikistan: "hsl(150, 65%, 55%)",
    turkmenistan: "hsl(35, 75%, 60%)",
  };

  const countryPositions: Record<string, { x: number; y: number; animal: string }> = {
    kazakhstan: { x: 68, y: 47, animal: "🦅" },
    uzbekistan: { x: 62, y: 40.5, animal: "🐪" },
    kyrgyzstan: { x: 75, y: 42, animal: "🦌" },
    tajikistan: { x: 71, y: 39, animal: "🐆" },
    turkmenistan: { x: 59, y: 40, animal: "🐴" },
  };

  const handleCountryClick = (countryId: string) => {
    navigate(`/country/${countryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-7 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-9xl w-full space-y-8 animate-fade-in">
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
                          default: {
                            outline: "none",
                            filter:
                              hoveredCountry === countryId
                                ? "brightness(1.15) drop-shadow(0 0 20px rgba(255,255,255,0.4))"
                                : "brightness(1)",
                            transform: hoveredCountry === countryId ? "scale(1.02)" : "scale(1)",
                            transition: "all 0.3s ease",
                          },
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
                    opacity: hoveredCountry === countryId ? 1 : 0,
                    transition: "all 0.3s ease",
                    transform: hoveredCountry === countryId ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {pos.animal} {countryId}
                </text>
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
    </div>
  );
};

export default Index;
