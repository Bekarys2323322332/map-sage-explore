import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapContent from '@/components/MapContent';
import ChatPopup from '@/components/ChatPopup';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CountryData {
  name: string;
  center: [number, number];
  zoom: number;
  locations: Array<{
    id: string;
    name: string;
    position: [number, number];
    description: string;
  }>;
}

const countryData: Record<string, CountryData> = {
  kazakhstan: {
    name: 'Kazakhstan',
    center: [48.0196, 66.9237],
    zoom: 6,
    locations: [
      { id: '1', name: 'Almaty', position: [43.2220, 76.8512], description: 'The largest city of Kazakhstan' },
      { id: '2', name: 'Astana', position: [51.1694, 71.4491], description: 'The capital city' },
      { id: '3', name: 'Charyn Canyon', position: [43.3544, 79.0847], description: 'Stunning natural canyon' },
    ],
  },
  uzbekistan: {
    name: 'Uzbekistan',
    center: [41.3775, 64.5853],
    zoom: 6,
    locations: [
      { id: '4', name: 'Samarkand', position: [39.6270, 66.9750], description: 'Ancient Silk Road city' },
      { id: '5', name: 'Bukhara', position: [39.7747, 64.4286], description: 'Historic trading center' },
    ],
  },
  kyrgyzstan: {
    name: 'Kyrgyzstan',
    center: [41.2044, 74.7661],
    zoom: 7,
    locations: [
      { id: '6', name: 'Issyk-Kul', position: [42.4386, 77.0903], description: 'Second largest alpine lake' },
      { id: '7', name: 'Bishkek', position: [42.8746, 74.5698], description: 'Capital city' },
    ],
  },
  tajikistan: {
    name: 'Tajikistan',
    center: [38.8610, 71.2761],
    zoom: 7,
    locations: [
      { id: '8', name: 'Dushanbe', position: [38.5598, 68.7738], description: 'Capital city' },
    ],
  },
  turkmenistan: {
    name: 'Turkmenistan',
    center: [38.9697, 59.5563],
    zoom: 6,
    locations: [
      { id: '9', name: 'Ashgabat', position: [37.9601, 58.3261], description: 'Capital city with white marble architecture' },
    ],
  },
};

const CountryView = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  const data = country ? countryData[country] : null;

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Country not found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-8 py-6 bg-gradient-to-b from-card/95 to-transparent backdrop-blur-sm">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="lg"
          className="text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{data.name}</h1>
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
      </div>

      {/* Map */}
      <MapContainer
        center={data.center}
        zoom={data.zoom}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <MapContent
          locations={data.locations}
          onLocationClick={(id) => {
            setSelectedLocation(id);
            setChatOpen(true);
          }}
        />
      </MapContainer>

      {/* Chat Popup */}
      {chatOpen && selectedLocation && (
        <ChatPopup
          location={data.locations.find(l => l.id === selectedLocation)!}
          onClose={() => {
            setChatOpen(false);
            setSelectedLocation(null);
          }}
          language={language}
        />
      )}

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] px-8 py-4 bg-gradient-to-t from-card/95 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Central Asia Interactive Museum</p>
            <div className="mt-2 h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryView;
