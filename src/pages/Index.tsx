import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
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
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--gradient-ambient)]">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-card/80 backdrop-blur-sm rounded-full shadow-[var(--shadow-card)] mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-[var(--gradient-hero)] bg-clip-text text-transparent">
            Central Asia Interactive Museum
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Touch any country to explore its history, culture, and landmarks through AI-guided storytelling
        </p>
      </div>

      {/* Main Map Container */}
      <div className="relative z-10 flex items-center justify-center h-[calc(100vh-250px)]">
        <div className="relative w-full max-w-5xl aspect-[16/10] mx-8">
          {/* SVG Map of Central Asia */}
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))' }}
          >
            {/* Kazakhstan */}
            <g
              onClick={() => navigate('/country/kazakhstan')}
              onMouseEnter={() => setHoveredCountry('kazakhstan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 400 50 L 700 50 L 700 250 L 550 280 L 400 250 Z"
                fill={hoveredCountry === 'kazakhstan' ? 'hsl(35, 75%, 58%)' : 'hsl(35, 75%, 48%)'}
                stroke="hsl(40, 30%, 98%)"
                strokeWidth="3"
                className="transition-all duration-300"
                style={{
                  filter: hoveredCountry === 'kazakhstan' ? 'url(#glow)' : 'none',
                }}
              />
              <text
                x="550"
                y="150"
                textAnchor="middle"
                className="text-2xl font-bold fill-primary-foreground pointer-events-none"
              >
                Kazakhstan
              </text>
            </g>

            {/* Uzbekistan */}
            <g
              onClick={() => navigate('/country/uzbekistan')}
              onMouseEnter={() => setHoveredCountry('uzbekistan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 280 250 L 450 240 L 420 350 L 280 360 Z"
                fill={hoveredCountry === 'uzbekistan' ? 'hsl(180, 55%, 45%)' : 'hsl(180, 45%, 35%)'}
                stroke="hsl(40, 30%, 98%)"
                strokeWidth="3"
                className="transition-all duration-300"
                style={{
                  filter: hoveredCountry === 'uzbekistan' ? 'url(#glow)' : 'none',
                }}
              />
              <text
                x="350"
                y="300"
                textAnchor="middle"
                className="text-2xl font-bold fill-secondary-foreground pointer-events-none"
              >
                Uzbekistan
              </text>
            </g>

            {/* Kyrgyzstan */}
            <g
              onClick={() => navigate('/country/kyrgyzstan')}
              onMouseEnter={() => setHoveredCountry('kyrgyzstan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 460 240 L 560 230 L 570 320 L 450 330 Z"
                fill={hoveredCountry === 'kyrgyzstan' ? 'hsl(15, 75%, 68%)' : 'hsl(15, 65%, 58%)'}
                stroke="hsl(40, 30%, 98%)"
                strokeWidth="3"
                className="transition-all duration-300"
                style={{
                  filter: hoveredCountry === 'kyrgyzstan' ? 'url(#glow)' : 'none',
                }}
              />
              <text
                x="510"
                y="285"
                textAnchor="middle"
                className="text-xl font-bold fill-accent-foreground pointer-events-none"
              >
                Kyrgyzstan
              </text>
            </g>

            {/* Tajikistan */}
            <g
              onClick={() => navigate('/country/tajikistan')}
              onMouseEnter={() => setHoveredCountry('tajikistan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 430 340 L 540 330 L 530 400 L 420 410 Z"
                fill={hoveredCountry === 'tajikistan' ? 'hsl(150, 50%, 50%)' : 'hsl(150, 40%, 40%)'}
                stroke="hsl(40, 30%, 98%)"
                strokeWidth="3"
                className="transition-all duration-300"
                style={{
                  filter: hoveredCountry === 'tajikistan' ? 'url(#glow)' : 'none',
                }}
              />
              <text
                x="480"
                y="375"
                textAnchor="middle"
                className="text-xl font-bold fill-white pointer-events-none"
              >
                Tajikistan
              </text>
            </g>

            {/* Turkmenistan */}
            <g
              onClick={() => navigate('/country/turkmenistan')}
              onMouseEnter={() => setHoveredCountry('turkmenistan')}
              onMouseLeave={() => setHoveredCountry(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <path
                d="M 100 280 L 280 270 L 280 380 L 100 390 Z"
                fill={hoveredCountry === 'turkmenistan' ? 'hsl(120, 50%, 50%)' : 'hsl(120, 40%, 40%)'}
                stroke="hsl(40, 30%, 98%)"
                strokeWidth="3"
                className="transition-all duration-300"
                style={{
                  filter: hoveredCountry === 'turkmenistan' ? 'url(#glow)' : 'none',
                }}
              />
              <text
                x="190"
                y="330"
                textAnchor="middle"
                className="text-xl font-bold fill-white pointer-events-none"
              >
                Turkmenistan
              </text>
            </g>

            {/* SVG Filters */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <div className="inline-flex flex-col items-center gap-2 px-8 py-4 bg-card/80 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-card)]">
          <p className="text-sm text-muted-foreground">Discover the rich heritage of Central Asia</p>
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Index;
