import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MainMapViewProps {
  onCountryClick: (country: string) => void;
  hoveredCountry: string | null;
  setHoveredCountry: (country: string | null) => void;
}

const MainMapView = ({ onCountryClick, hoveredCountry, setHoveredCountry }: MainMapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const countryLayersRef = useRef<Map<string, L.GeoJSON>>(new Map());

  // Simplified GeoJSON for Central Asian countries
  const countriesGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Kazakhstan", id: "kazakhstan" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [46.5, 55],
              [55, 56],
              [60, 55],
              [69, 55],
              [75, 53],
              [80, 50],
              [87, 49],
              [87, 45],
              [85, 42],
              [82, 43],
              [75, 42],
              [69, 41],
              [66, 43],
              [60, 43],
              [55, 45],
              [51, 45],
              [48, 47],
              [46.5, 50],
              [46.5, 55],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Uzbekistan", id: "uzbekistan" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [55.5, 37],
              [56, 41.5],
              [60, 42],
              [66, 43],
              [69, 41],
              [69, 38],
              [68, 37.5],
              [66, 37],
              [64, 37.5],
              [60, 38],
              [57, 37.2],
              [55.5, 37],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Kyrgyzstan", id: "kyrgyzstan" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [69, 43],
              [74, 43],
              [80, 42],
              [80, 40],
              [78, 39.5],
              [75, 39],
              [72, 39.5],
              [70, 40],
              [69, 41.5],
              [69, 43],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Tajikistan", id: "tajikistan" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [67, 37],
              [68, 38.5],
              [69, 39],
              [71, 39],
              [73, 38.5],
              [75, 39],
              [75, 37.5],
              [73, 37],
              [71, 37],
              [69, 37],
              [67, 37],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Turkmenistan", id: "turkmenistan" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [52.5, 35],
              [53, 39],
              [55, 40],
              [58, 40],
              [61, 39],
              [66, 39],
              [66, 37],
              [63, 35.5],
              [60, 35],
              [56, 35],
              [52.5, 35],
            ],
          ],
        },
      },
    ],
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Central Asia
    mapRef.current = L.map(containerRef.current, {
      center: [45, 66],
      zoom: 5,
      minZoom: 4,
      maxZoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    // Add base tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
    }).addTo(mapRef.current);

    // Add country boundaries
    countriesGeoJSON.features.forEach((feature) => {
      const layer = L.geoJSON(feature as any, {
        style: {
          fillColor: "transparent",
          fillOpacity: 0.3,
          color: "hsl(var(--border))",
          weight: 2,
        },
        onEachFeature: (feature, layer) => {
          const countryId = feature.properties.id;

          layer.on({
            mouseover: () => setHoveredCountry(countryId),
            mouseout: () => setHoveredCountry(null),
            click: () => onCountryClick(countryId),
          });

          // Add country label
          if (feature.geometry.type === "Polygon") {
            const coords = feature.geometry.coordinates[0];
            const center = coords.reduce(
              (acc: [number, number], coord: number[]) => {
                return [acc[0] + coord[1] / coords.length, acc[1] + coord[0] / coords.length];
              },
              [0, 0],
            );

            L.marker([center[0], center[1]], {
              icon: L.divIcon({
                className: "country-label",
                html: `<div style="font-size: 14px; font-weight: 600; color: hsl(var(--foreground)); text-shadow: 1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8); pointer-events: none; white-space: nowrap;">${feature.properties.name}</div>`,
                iconSize: [100, 20],
              }),
            }).addTo(mapRef.current!);
          }
        },
      }).addTo(mapRef.current!);

      countryLayersRef.current.set(feature.properties.id, layer);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update styles based on hover state
  useEffect(() => {
    countryLayersRef.current.forEach((layer, id) => {
      layer.setStyle({
        fillColor: hoveredCountry === id ? "hsl(var(--primary))" : "transparent",
        fillOpacity: hoveredCountry === id ? 0.5 : 0.3,
        color: "hsl(var(--border))",
        weight: hoveredCountry === id ? 3 : 2,
      });
    });
  }, [hoveredCountry]);

  return <div ref={containerRef} className="w-full h-full map-container" />;
};

export default MainMapView;
