import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import LeafletMap from "@/components/LeafletMap";
import ChatPopup from "@/components/ChatPopup";
import SettingsDialog from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";

// Derive country from coordinates
const getCountryFromCoordinates = (lat: number, lon: number): string | null => {
  // Bounding boxes for Central Asian countries
  const countryBounds: Record<string, { minLat: number; maxLat: number; minLon: number; maxLon: number }> = {
    kazakhstan: { minLat: 40.5, maxLat: 55.5, minLon: 46, maxLon: 87 },
    uzbekistan: { minLat: 37, maxLat: 45.5, minLon: 55.5, maxLon: 73.5 },
    kyrgyzstan: { minLat: 39, maxLat: 43.5, minLon: 69.5, maxLon: 80.5 },
    tajikistan: { minLat: 36.5, maxLat: 41, minLon: 67, maxLon: 75 },
    turkmenistan: { minLat: 35, maxLat: 42.5, minLon: 52, maxLon: 66.5 },
  };

  for (const [country, bounds] of Object.entries(countryBounds)) {
    if (lat >= bounds.minLat && lat <= bounds.maxLat && lon >= bounds.minLon && lon <= bounds.maxLon) {
      return country;
    }
  }
  return null;
};

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

// Country data with locations and map settings
const countryData: Record<string, {
  name: string;
  center: [number, number];
  zoom: number;
  locations: Array<{
    id: string;
    name: string;
    position: [number, number];
    description: string;
  }>;
}> = {
  kazakhstan: {
    name: "Kazakhstan",
    center: [51.1694, 71.4491],
    zoom: 5,
    locations: [
      {
        id: "almaty",
        name: "Almaty",
        position: [43.2220, 76.8512],
        description: "The largest city and former capital of Kazakhstan",
      },
      {
        id: "astana",
        name: "Astana",
        position: [51.1694, 71.4491],
        description: "The capital city of Kazakhstan",
      },
    ],
  },
  uzbekistan: {
    name: "Uzbekistan",
    center: [41.3775, 64.5853],
    zoom: 6,
    locations: [
      {
        id: "tashkent",
        name: "Tashkent",
        position: [41.3775, 69.3406],
        description: "The capital and largest city of Uzbekistan",
      },
      {
        id: "samarkand",
        name: "Samarkand",
        position: [39.6270, 66.9750],
        description: "Ancient city on the Silk Road",
      },
    ],
  },
  kyrgyzstan: {
    name: "Kyrgyzstan",
    center: [41.2044, 74.7661],
    zoom: 7,
    locations: [
      {
        id: "bishkek",
        name: "Bishkek",
        position: [42.8746, 74.5698],
        description: "The capital and largest city of Kyrgyzstan",
      },
    ],
  },
  tajikistan: {
    name: "Tajikistan",
    center: [38.8610, 71.2761],
    zoom: 7,
    locations: [
      {
        id: "dushanbe",
        name: "Dushanbe",
        position: [38.5598, 68.7738],
        description: "The capital and largest city of Tajikistan",
      },
    ],
  },
  turkmenistan: {
    name: "Turkmenistan",
    center: [38.9697, 59.5563],
    zoom: 6,
    locations: [
      {
        id: "ashgabat",
        name: "Ashgabat",
        position: [37.9601, 58.3261],
        description: "The capital and largest city of Turkmenistan",
      },
    ],
  },
};

const CountryView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coordinates from URL params and derive country
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const country = getCountryFromCoordinates(lat, lon);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [droppedCoordinates, setDroppedCoordinates] = useState<[number, number] | null>(null);
  const [language, setLanguage] = useState("English");
  const [mapStyle, setMapStyle] = useState(() => {
    return localStorage.getItem("mapStyle") || "satellite";
  });

  useEffect(() => {
    if (location.state?.language) {
      setLanguage(location.state.language);
    }
    if (location.state?.mapStyle) {
      setMapStyle(location.state.mapStyle);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem("mapStyle", mapStyle);
  }, [mapStyle]);

  const data = country ? countryData[country] : null;

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Country not found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  const countryCode = countryNameToCode(country); // 👈 сюда генерим код

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Header with integrated back button and settings */}
      <div className="absolute top-0 left-0 right-0 z-[1000] border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button onClick={() => navigate("/")} variant="ghost" size="lg" className="text-lg font-semibold px-6 h-12">
              <ArrowLeft className="h-6 w-6" /> Back
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{data.name}</h1>
            <div className="flex items-center gap-4">
              <SettingsDialog
                language={language}
                onLanguageChange={setLanguage}
                mapStyle={mapStyle}
                onMapStyleChange={setMapStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <LeafletMap
        center={data.center}
        zoom={data.zoom}
        locations={[]}
        selectedCountry={data.name}
        resetMarker={!chatOpen && droppedCoordinates === null}
        mapStyle={mapStyle}
        onLocationClick={(id) => {
          setSelectedLocation(id);
          setDroppedCoordinates(null);
          setChatOpen(true);
        }}
        onCoordinatesDrop={(coords) => {
          setDroppedCoordinates(coords);
          setSelectedLocation(null);
          setChatOpen(true);
        }}
      />

      {/* Chat Popup */}
      {chatOpen && (selectedLocation || droppedCoordinates) && (
        <ChatPopup
          location={selectedLocation ? data.locations.find((loc) => loc.id === selectedLocation)! : null}
          coordinates={droppedCoordinates || undefined}
          onClose={() => {
            setChatOpen(false);
            setSelectedLocation(null);
            setDroppedCoordinates(null);
          }}
          language={language}
          country={countryCode}
        />
      )}

      {/* Draggable Marker Footer */}
      <div className="absolute bottom-8 right-8 z-[1000] flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-md rounded-lg border border-border shadow-lg">
        <span className="text-sm font-medium text-muted-foreground">Drop a pin:</span>
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", "marker");
            e.currentTarget.style.cursor = 'pointer';
          }}
          onDragEnd={(e) => {
            e.currentTarget.style.cursor = 'pointer';
          }}
          className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-2 rounded-full bg-primary/10 hover:bg-primary/20"
        >
          <MapPin className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default CountryView;
