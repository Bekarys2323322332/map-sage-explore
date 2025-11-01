import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

        <svg
          viewBox="46 35 41 20"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto"
          style={{ maxHeight: "70vh" }}
        >
          {/* Kazakhstan */}
          <path
            d="M 69.68,55.36 L 68.24,54.97 L 64.74,54.35 L 61.86,53.96 L 61.07,52.35 L 61.45,50.81 L 59.81,50.54 L 56.70,51.07 L 55.66,50.56 L 52.34,51.74 L 50.54,51.59 L 48.81,50.60 L 47.61,50.46 L 46.90,49.86 L 46.49,48.43 L 48.11,47.74 L 49.54,46.19 L 51.25,47.13 L 53.09,46.89 L 53.40,46.30 L 54.94,45.23 L 53.75,44.95 L 52.02,45.41 L 50.77,44.24 L 52.42,42.08 L 54.22,42.38 L 55.50,41.25 L 56.00,41.32 L 56.00,45.00 L 58.59,45.59 L 60.99,44.41 L 62.00,43.51 L 64.93,43.74 L 66.10,42.94 L 66.00,41.94 L 66.71,41.14 L 67.97,41.15 L 70.63,42.02 L 71.28,42.78 L 73.43,42.55 L 74.29,43.24 L 75.23,42.85 L 78.49,42.90 L 79.97,42.43 L 80.78,43.14 L 80.15,45.05 L 81.80,45.36 L 83.05,47.23 L 85.56,47.06 L 85.76,48.40 L 87.10,49.15 L 85.21,49.63 L 83.96,50.80 L 80.08,50.83 L 77.91,53.29 L 76.20,54.26 L 74.49,53.57 L 73.00,54.10 L 71.30,54.18 L 70.80,55.27 Z"
            fill={hoveredCountry === "kazakhstan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--border))"
            strokeWidth="0.15"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("kazakhstan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("kazakhstan")}
          />
          <text x="65" y="47" textAnchor="middle" className="fill-foreground text-[1.5px] font-semibold pointer-events-none">
            Kazakhstan
          </text>

          {/* Uzbekistan */}
          <path
            d="M 58.29,44.68 L 58.22,44.86 L 58.59,45.59 L 56.00,45.00 L 56.00,43.75 L 56.00,41.32 L 57.04,41.26 L 56.97,41.80 L 57.16,42.21 L 57.34,42.36 L 57.60,42.25 L 57.93,42.25 L 58.04,42.50 L 58.30,42.46 L 58.28,42.69 L 58.64,42.74 L 59.01,42.53 L 59.16,42.53 L 59.43,42.29 L 59.92,42.28 L 60.17,41.84 L 60.09,41.41 L 60.48,41.22 L 61.00,41.24 L 61.24,41.15 L 61.61,41.26 L 61.97,41.02 L 62.11,40.60 L 62.35,40.44 L 62.49,39.95 L 63.42,39.45 L 63.71,39.22 L 64.18,38.96 L 64.35,38.98 L 64.82,38.68 L 65.56,38.29 L 66.25,38.15 L 66.40,38.03 L 66.68,37.96 L 66.55,37.79 L 66.59,37.37 L 67.04,37.38 L 67.27,37.18 L 67.52,37.27 L 67.79,37.19 L 67.83,37.54 L 68.40,38.20 L 68.16,38.37 L 68.07,38.53 L 68.20,38.94 L 68.09,39.02 L 67.70,39.00 L 67.68,39.15 L 67.40,39.23 L 67.46,39.57 L 67.79,39.66 L 67.94,39.60 L 68.51,39.53 L 68.63,39.85 L 68.87,39.86 L 69.04,40.23 L 69.31,40.20 L 69.27,40.49 L 69.36,40.77 L 69.67,40.63 L 70.07,40.76 L 70.55,40.98 L 70.79,40.73 L 70.49,40.51 L 70.63,40.18 L 71.20,40.35 L 71.73,40.16 L 72.16,40.48 L 72.41,40.40 L 72.48,40.55 L 72.69,40.60 L 72.99,40.76 L 72.59,40.87 L 72.45,41.03 L 72.24,41.00 L 71.89,41.17 L 71.93,41.29 L 71.74,41.45 L 71.37,41.16 L 70.96,41.17 L 70.67,41.47 L 70.49,41.40 L 70.21,41.61 L 70.50,41.72 L 70.66,41.91 L 70.85,41.94 L 71.27,42.20 L 71.03,42.29 L 70.80,42.21 L 70.63,42.02 L 70.48,42.11 L 69.96,41.73 L 69.62,41.66 L 68.58,40.93 L 68.61,40.58 L 68.22,40.69 L 67.97,41.15 L 67.73,41.18 L 67.36,41.13 L 66.71,41.14 L 66.53,41.88 L 66.00,41.94 L 66.00,42.36 L 66.10,42.57 L 66.10,42.94 L 65.84,42.86 L 65.56,43.29 L 65.18,43.50 L 64.93,43.74 L 64.53,43.57 L 63.35,43.65 L 62.00,43.51 L 61.14,44.23 L 60.99,44.41 L 59.99,45.00 L 59.58,44.88 L 59.56,45.13 L 58.75,45.51 L 58.64,45.29 L 58.69,45.14 L 58.59,44.93 L 58.59,44.57 L 58.26,44.42 Z"
            fill={hoveredCountry === "uzbekistan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--border))"
            strokeWidth="0.15"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("uzbekistan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("uzbekistan")}
          />
          <text x="65" y="42" textAnchor="middle" className="fill-foreground text-[1.5px] font-semibold pointer-events-none">
            Uzbekistan
          </text>

          {/* Kyrgyzstan */}
          <path
            d="M 69.26,39.81 L 69.33,39.72 L 69.34,39.55 L 69.45,39.53 L 69.63,39.59 L 69.83,39.56 L 70.21,39.58 L 70.31,39.53 L 70.52,39.62 L 70.65,39.58 L 70.77,39.40 L 71.07,39.41 L 71.09,39.50 L 71.26,39.55 L 71.55,39.59 L 71.56,39.45 L 71.79,39.44 L 71.75,39.32 L 71.92,39.28 L 72.04,39.37 L 72.26,39.18 L 72.34,39.33 L 72.49,39.38 L 72.70,39.40 L 72.96,39.35 L 73.16,39.35 L 73.35,39.39 L 73.51,39.47 L 73.87,39.48 L 73.95,39.60 L 73.85,39.84 L 73.98,40.05 L 74.26,40.13 L 74.34,40.09 L 74.59,40.28 L 74.86,40.39 L 74.84,40.52 L 75.09,40.43 L 75.24,40.46 L 75.59,40.66 L 75.65,40.51 L 75.72,40.47 L 75.66,40.35 L 75.72,40.29 L 75.92,40.33 L 75.97,40.38 L 76.33,40.34 L 76.54,40.46 L 76.65,40.62 L 76.75,40.95 L 77.00,41.07 L 77.28,41.00 L 77.77,41.01 L 77.81,41.13 L 78.13,41.25 L 78.19,41.39 L 78.38,41.39 L 78.65,41.47 L 79.32,41.81 L 79.64,41.89 L 79.77,41.89 L 79.85,42.02 L 80.20,42.04 L 80.13,42.17 L 80.13,42.30 L 79.97,42.43 L 79.67,42.48 L 79.50,42.46 L 79.17,42.76 L 78.93,42.77 L 78.54,42.87 L 77.97,42.85 L 77.78,42.91 L 77.55,42.94 L 77.35,42.90 L 77.15,42.97 L 76.85,42.98 L 76.71,42.90 L 76.52,42.92 L 76.34,42.86 L 76.19,42.93 L 76.03,42.91 L 75.82,42.94 L 75.72,42.80 L 75.48,42.84 L 75.23,42.85 L 74.83,43.00 L 74.75,42.99 L 74.58,43.13 L 74.31,43.22 L 73.84,43.13 L 73.56,43.03 L 73.43,42.55 L 73.49,42.42 L 73.31,42.46 L 73.31,42.52 L 73.12,42.55 L 72.91,42.53 L 72.74,42.64 L 72.50,42.69 L 72.28,42.76 L 72.12,42.74 L 71.86,42.83 L 71.64,42.77 L 71.53,42.80 L 71.28,42.78 L 71.18,42.61 L 71.00,42.59 L 70.96,42.40 L 70.87,42.32 L 70.99,42.25 L 71.13,42.28 L 71.27,42.20 L 71.03,42.07 L 70.88,42.05 L 70.85,41.94 L 70.66,41.91 L 70.50,41.72 L 70.21,41.61 L 70.49,41.40 L 70.67,41.47 L 70.78,41.39 L 70.84,41.25 L 70.96,41.17 L 71.13,41.14 L 71.23,41.19 L 71.44,41.13 L 71.46,41.30 L 71.55,41.29 L 71.74,41.45 L 71.93,41.29 L 71.89,41.17 L 72.07,41.12 L 72.21,41.03 L 72.45,41.03 L 72.59,40.87 L 72.83,40.86 L 72.99,40.76 L 72.80,40.68 L 72.62,40.52 L 72.43,40.60 L 72.41,40.40 L 72.16,40.48 L 71.97,40.32 L 71.73,40.16 L 71.50,40.28 L 71.27,40.34 L 71.13,40.34 L 70.98,40.22 L 70.67,40.10 L 70.66,39.99 L 70.18,40.14 L 70.00,40.23 L 69.52,40.08 L 69.30,39.92 Z"
            fill={hoveredCountry === "kyrgyzstan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--border))"
            strokeWidth="0.15"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("kyrgyzstan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("kyrgyzstan")}
          />
          <text x="74" y="41" textAnchor="middle" className="fill-foreground text-[1.5px] font-semibold pointer-events-none">
            Kyrgyzstan
          </text>

          {/* Tajikistan */}
          <path
            d="M 70.45,41.04 L 70.37,40.90 L 70.07,40.76 L 69.67,40.63 L 69.39,40.79 L 69.31,40.20 L 69.04,40.23 L 68.93,39.93 L 68.63,39.85 L 68.62,39.64 L 68.51,39.53 L 67.94,39.60 L 67.79,39.66 L 67.40,39.53 L 67.49,39.38 L 67.40,39.23 L 67.68,39.15 L 67.70,39.00 L 68.11,39.01 L 68.20,38.94 L 68.07,38.53 L 68.16,38.37 L 68.40,38.20 L 68.28,37.91 L 68.12,37.89 L 67.88,37.64 L 67.79,37.42 L 67.78,37.10 L 68.06,36.93 L 68.30,37.11 L 68.62,37.20 L 68.67,37.28 L 68.97,37.32 L 69.26,37.09 L 69.40,37.17 L 69.37,37.38 L 69.51,37.58 L 69.94,37.61 L 70.11,37.52 L 70.29,37.68 L 70.19,37.85 L 70.49,38.12 L 70.61,38.35 L 70.77,38.46 L 71.16,38.39 L 71.37,38.26 L 71.26,37.92 L 71.52,37.95 L 71.60,37.81 L 71.49,37.54 L 71.43,37.06 L 71.56,36.76 L 71.84,36.68 L 72.33,36.98 L 72.66,37.02 L 72.82,37.23 L 73.09,37.32 L 73.31,37.46 L 73.78,37.44 L 73.84,37.23 L 74.48,37.41 L 74.80,37.36 L 74.89,37.26 L 75.15,37.41 L 74.93,37.57 L 74.97,37.75 L 74.92,38.02 L 74.82,38.09 L 74.65,38.45 L 74.19,38.64 L 74.04,38.54 L 73.80,38.61 L 73.70,38.88 L 73.81,39.04 L 73.61,39.25 L 73.51,39.47 L 73.35,39.39 L 72.96,39.35 L 72.70,39.40 L 72.34,39.33 L 72.26,39.18 L 72.04,39.37 L 71.56,39.45 L 71.55,39.59 L 71.09,39.50 L 71.07,39.41 L 70.77,39.40 L 70.52,39.62 L 70.21,39.58 L 69.63,39.59 L 69.34,39.55 L 69.30,39.92 L 69.58,40.10 L 70.00,40.23 L 70.18,40.14 L 70.66,39.99 L 70.56,40.35 L 70.38,40.39 L 70.79,40.73 Z"
            fill={hoveredCountry === "tajikistan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--border))"
            strokeWidth="0.15"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("tajikistan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("tajikistan")}
          />
          <text x="71" y="38.5" textAnchor="middle" className="fill-foreground text-[1.5px] font-semibold pointer-events-none">
            Tajikistan
          </text>

          {/* Turkmenistan */}
          <path
            d="M 58.80,42.61 L 58.29,42.64 L 57.74,42.14 L 56.98,41.86 L 56.87,41.29 L 55.43,41.30 L 54.71,42.05 L 54.22,42.27 L 52.92,42.07 L 52.57,41.63 L 52.93,40.96 L 52.71,40.05 L 53.39,39.97 L 53.06,39.45 L 53.91,38.96 L 53.86,37.40 L 54.77,37.51 L 55.47,38.13 L 57.26,38.29 L 57.40,37.98 L 58.44,37.66 L 58.92,37.69 L 60.34,36.64 L 61.17,36.57 L 61.22,35.62 L 62.11,35.34 L 62.33,35.08 L 63.08,35.38 L 63.35,35.81 L 64.53,36.27 L 64.85,37.18 L 65.56,37.26 L 65.79,37.57 L 66.45,37.34 L 66.66,38.03 L 65.50,38.35 L 64.19,39.00 L 62.60,39.94 L 61.82,41.20 L 60.16,41.38 L 60.02,42.20 Z"
            fill={hoveredCountry === "turkmenistan" ? "hsl(var(--primary))" : "hsl(var(--muted))"}
            stroke="hsl(var(--border))"
            strokeWidth="0.15"
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            onMouseEnter={() => setHoveredCountry("turkmenistan")}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => handleCountryClick("turkmenistan")}
          />
          <text x="58" y="39" textAnchor="middle" className="fill-foreground text-[1.5px] font-semibold pointer-events-none">
            Turkmenistan
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Index;
