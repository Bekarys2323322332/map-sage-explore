import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = (countryId: string) => {
    navigate(`/country/${countryId}`);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-8 pb-6 text-center bg-gradient-to-b from-background/95 to-transparent backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-foreground mb-2">Central Asia Interactive Museum</h1>
        <p className="text-sm text-muted-foreground">Select a country to explore</p>
      </div>

      {/* Main Map Container */}
      <div className="absolute inset-0 pt-32 pb-16">
        onCountryClick={handleCountryClick}
        hoveredCountry={hoveredCountry}
        setHoveredCountry={setHoveredCountry}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 text-center bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">Discover the rich heritage of Central Asia</p>
      </div>
    </div>
  );
};

export default Index;
