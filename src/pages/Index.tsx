import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = (countryId: string) => {
    navigate(`/country/${countryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Central Asia Interactive Museum</h1>
          <p className="text-muted-foreground">Select a country to explore its cultural heritage</p>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [65, 45],
            scale: 800,
          }}
          className="w-full h-auto"
          style={{ maxHeight: "70vh" }}
        >
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json">
            {({ geographies }) =>
              geographies
                .filter((geo) => 
                  ["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"].includes(geo.properties.name)
                )
                .map((geo) => {
                  const countryId = geo.properties.name.toLowerCase();
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={hoveredCountry === countryId ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                      stroke="hsl(var(--border))"
                      strokeWidth={0.5}
                      className="cursor-pointer transition-all duration-300 hover:opacity-80"
                      onMouseEnter={() => setHoveredCountry(countryId)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => handleCountryClick(countryId)}
                      style={{
                        outline: "none",
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default Index;
