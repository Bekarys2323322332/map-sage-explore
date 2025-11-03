import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LeafletMap from "@/components/LeafletMap";
import ChatPopup from "@/components/ChatPopup";
import SettingsDialog from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Derive country from coordinates with more accurate boundaries
const getCountryFromCoordinates = (lat: number, lon: number): string => {
  console.log('Detecting country for coordinates:', lat, lon);
  
  // Check in order of specificity to avoid overlaps
  // Tajikistan: 36.7-41.1°N, 67.4-75.2°E
  if (lat >= 36.7 && lat <= 41.1 && lon >= 67.4 && lon <= 75.2) {
    console.log('Detected: Tajikistan');
    return "Tajikistan";
  }
  
  // Kyrgyzstan: 39.2-43.2°N, 69.3-80.3°E
  if (lat >= 39.2 && lat <= 43.2 && lon >= 69.3 && lon <= 80.3) {
    console.log('Detected: Kyrgyzstan');
    return "Kyrgyzstan";
  }
  
  // Turkmenistan: 35.1-42.8°N, 52.5-66.7°E
  if (lat >= 35.1 && lat <= 42.8 && lon >= 52.5 && lon <= 66.7) {
    console.log('Detected: Turkmenistan');
    return "Turkmenistan";
  }
  
  // Uzbekistan: 37.2-45.6°N, 56.0-73.2°E
  if (lat >= 37.2 && lat <= 45.6 && lon >= 56.0 && lon <= 73.2) {
    console.log('Detected: Uzbekistan');
    return "Uzbekistan";
  }
  
  // Kazakhstan: 40.6-55.4°N, 46.5-87.3°E (largest, check last)
  if (lat >= 40.6 && lat <= 55.4 && lon >= 46.5 && lon <= 87.3) {
    console.log('Detected: Kazakhstan');
    return "Kazakhstan";
  }
  
  console.log('Detected: Out of Bounds');
  return "Out of Bounds";
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
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [droppedCoordinates, setDroppedCoordinates] = useState<[number, number] | null>(null);
  const [derivedCountry, setDerivedCountry] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const { t } = useTranslation(language);
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Button onClick={() => navigate("/")} variant="ghost" size="sm" className="text-base sm:text-lg font-semibold px-2 sm:px-6 h-10 sm:h-12 gap-1">
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">{t("back")}</span>
            </Button>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight truncate px-2">{t(data.name.toLowerCase())}</h1>
            <div className="flex items-center gap-2 sm:gap-4">
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
          const detectedCountry = getCountryFromCoordinates(coords[0], coords[1]);
          setDerivedCountry(detectedCountry);
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
            setDerivedCountry(null);
          }}
          language={language}
          country={countryNameToCode(derivedCountry || data.name)}
          derivedCountryName={derivedCountry}
        />
      )}

      {/* Draggable Marker Footer */}
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-[1000] flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-card/95 backdrop-blur-md rounded-lg border border-border shadow-lg">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:inline">{t("drop_pin")}</span>
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", "marker");
            e.currentTarget.style.cursor = 'pointer';
          }}
          onDragEnd={(e) => {
            e.currentTarget.style.cursor = 'pointer';
          }}
          className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-2 rounded-full bg-primary/10 hover:bg-primary/20 touch-none"
        >
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default CountryView;
