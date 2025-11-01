import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface CountryRegion {
  id: string;
  name: string;
  path: string;
  center: string;
}

const countries: CountryRegion[] = [
  { id: 'kazakhstan', name: 'Kazakhstan', path: '/country/kazakhstan', center: '48% 58%' },
  { id: 'uzbekistan', name: 'Uzbekistan', path: '/country/uzbekistan', center: '35% 62%' },
  { id: 'kyrgyzstan', name: 'Kyrgyzstan', path: '/country/kyrgyzstan', center: '52% 72%' },
  { id: 'tajikistan', name: 'Tajikistan', path: '/country/tajikistan', center: '42% 78%' },
  { id: 'turkmenistan', name: 'Turkmenistan', path: '/country/turkmenistan', center: '25% 70%' },
];

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="relative z-10 pt-8 pb-6 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Central Asia Interactive Museum
        </h1>
        <p className="text-sm text-muted-foreground">
          Select a country to explore
        </p>
      </div>

      {/* Main Map Container */}
      <div className="relative z-10 flex items-center justify-center h-[calc(100vh-180px)]">
        <div className="relative w-full max-w-6xl aspect-[16/10] mx-8">
          {/* SVG Map of Central Asia */}
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full"
          >
            {/* Kazakhstan */}
            <g
              onClick={() => navigate('/country/kazakhstan')}
              onMouseEnter={() => setHoveredCountry('kazakhstan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 400 50 L 700 50 L 700 250 L 550 280 L 400 250 Z"
                fill={hoveredCountry === 'kazakhstan' ? 'hsl(var(--primary))' : 'transparent'}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="transition-colors duration-200"
              />
              <text
                x="550"
                y="150"
                textAnchor="middle"
                className="text-xl font-medium fill-foreground pointer-events-none select-none"
              >
                Kazakhstan
              </text>
            </g>

            {/* Uzbekistan */}
            <g
              onClick={() => navigate('/country/uzbekistan')}
              onMouseEnter={() => setHoveredCountry('uzbekistan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 280 250 L 450 240 L 420 350 L 280 360 Z"
                fill={hoveredCountry === 'uzbekistan' ? 'hsl(var(--secondary))' : 'transparent'}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="transition-colors duration-200"
              />
              <text
                x="350"
                y="300"
                textAnchor="middle"
                className="text-xl font-medium fill-foreground pointer-events-none select-none"
              >
                Uzbekistan
              </text>
            </g>

            {/* Kyrgyzstan */}
            <g
              onClick={() => navigate('/country/kyrgyzstan')}
              onMouseEnter={() => setHoveredCountry('kyrgyzstan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 460 240 L 560 230 L 570 320 L 450 330 Z"
                fill={hoveredCountry === 'kyrgyzstan' ? 'hsl(var(--accent))' : 'transparent'}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="transition-colors duration-200"
              />
              <text
                x="510"
                y="285"
                textAnchor="middle"
                className="text-lg font-medium fill-foreground pointer-events-none select-none"
              >
                Kyrgyzstan
              </text>
            </g>

            {/* Tajikistan */}
            <g
              onClick={() => navigate('/country/tajikistan')}
              onMouseEnter={() => setHoveredCountry('tajikistan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 430 340 L 540 330 L 530 400 L 420 410 Z"
                fill={hoveredCountry === 'tajikistan' ? 'hsl(150, 40%, 45%)' : 'transparent'}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="transition-colors duration-200"
              />
              <text
                x="480"
                y="375"
                textAnchor="middle"
                className="text-lg font-medium fill-foreground pointer-events-none select-none"
              >
                Tajikistan
              </text>
            </g>

            {/* Turkmenistan */}
            <g
              onClick={() => navigate('/country/turkmenistan')}
              onMouseEnter={() => setHoveredCountry('turkmenistan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d="M 100 280 L 280 270 L 280 380 L 100 390 Z"
                fill={hoveredCountry === 'turkmenistan' ? 'hsl(120, 40%, 45%)' : 'transparent'}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="transition-colors duration-200"
              />
              <text
                x="190"
                y="330"
                textAnchor="middle"
                className="text-lg font-medium fill-foreground pointer-events-none select-none"
              >
                Turkmenistan
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6 text-center">
        <p className="text-xs text-muted-foreground">Discover the rich heritage of Central Asia</p>
      </div>
    </div>
  );
};

export default Index;
