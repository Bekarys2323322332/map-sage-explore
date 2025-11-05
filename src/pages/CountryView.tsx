import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LeafletMap from "@/components/LeafletMap";
import ChatPopup from "@/components/ChatPopup";
import SettingsDialog from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { COUNTRY_BOUNDARIES } from "@/data/boundaries";
import { useIsMobile } from "@/hooks/use-mobile";

// Point-in-polygon detection using ray casting algorithm
const pointInPolygon = (point: [number, number], polygon: number[][][]): boolean => {
  const [lon, lat] = point;
  let inside = false;

  for (const ring of polygon) {
    let j = ring.length - 1;
    for (let i = 0; i < ring.length; i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      
      const intersect = ((yi > lat) !== (yj > lat))
        && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
      
      j = i;
    }
  }
  return inside;
};

// Derive country from coordinates using actual GeoJSON boundaries
const getCountryFromCoordinates = (lat: number, lon: number): string => {
  console.log('Detecting country for coordinates:', lat, lon);
  
  for (const feature of COUNTRY_BOUNDARIES.features) {
    const countryName = feature.properties?.name;
    if (!countryName) continue;
    
    const geometry = feature.geometry;
    if (geometry.type === "Polygon") {
      if (pointInPolygon([lon, lat], geometry.coordinates)) {
        console.log('Detected:', countryName);
        return countryName;
      }
    } else if (geometry.type === "MultiPolygon") {
      for (const polygon of geometry.coordinates) {
        if (pointInPolygon([lon, lat], polygon)) {
          console.log('Detected:', countryName);
          return countryName;
        }
      }
    }
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
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "English";
  });
  const { t } = useTranslation(language);
  const [mapStyle, setMapStyle] = useState(() => {
    return localStorage.getItem("mapStyle") || "satellite";
  });
  const [showInstructions, setShowInstructions] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (location.state?.language) {
      setLanguage(location.state.language);
    }
    if (location.state?.mapStyle) {
      setMapStyle(location.state.mapStyle);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

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

      {/* Instructions Panel */}
      {showInstructions && (
        <div className="absolute top-20 left-4 z-[1000] max-w-xs bg-card/95 backdrop-blur-md rounded-lg border border-border shadow-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">{t("how_to_use")}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 -mt-1 -mr-1"
              onClick={() => setShowInstructions(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {isMobile ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("instruction_click_map")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("instruction_chat")}</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("instruction_drag")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("instruction_drop")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t("instruction_chat")}</span>
                </li>
              </>
            )}
          </ul>
        </div>
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
