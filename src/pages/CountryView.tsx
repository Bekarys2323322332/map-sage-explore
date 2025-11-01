import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeafletMap from "@/components/LeafletMap";
import ChatPopup from "@/components/ChatPopup";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// 👇 маппинг внутри, без отдельного файла
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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [droppedCoordinates, setDroppedCoordinates] = useState<[number, number] | null>(null);
  const [language, setLanguage] = useState("English");

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
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-8 py-6 bg-gradient-to-b from-card/95 via-card/60 to-transparent backdrop-blur-md border-b border-border/30">
        <Button onClick={() => navigate("/")} variant="outline" size="lg" className="text-base font-semibold shadow-lg">
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
        <h1 className="text-4xl font-bold text-foreground tracking-tight drop-shadow-sm">{data.name}</h1>
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
      </div>

      {/* Map */}
      <LeafletMap
        center={data.center}
        zoom={data.zoom}
        locations={data.locations}
        selectedCountry={data.name}
        resetMarker={!chatOpen && droppedCoordinates === null}
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
          country={countryCode} // 👈 добавлено
        />
      )}
    </div>
  );
};

export default CountryView;
