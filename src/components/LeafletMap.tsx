import { useEffect, useRef } from "react";
import L, { Map as LeafletMapInstance } from "leaflet";
import "leaflet/dist/leaflet.css";
import { COUNTRY_BOUNDARIES } from "@/data/boundaries";

// Regional boundaries for Kazakhstan oblasts (simplified)
const REGIONAL_BOUNDARIES = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Almaty Region", country: "Kazakhstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [76.5, 42.5],
            [78.5, 42.5],
            [80.5, 43.5],
            [81.5, 45.0],
            [80.0, 46.0],
            [77.5, 46.0],
            [76.0, 44.5],
            [76.5, 42.5],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Astana Region", country: "Kazakhstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [68.0, 50.0],
            [72.0, 50.0],
            [72.0, 52.5],
            [68.0, 52.5],
            [68.0, 50.0],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "East Kazakhstan Region", country: "Kazakhstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [78.0, 46.0],
            [82.0, 46.0],
            [85.5, 47.5],
            [85.5, 50.0],
            [82.0, 50.0],
            [78.0, 48.5],
            [78.0, 46.0],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "West Kazakhstan Region", country: "Kazakhstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [48.0, 48.0],
            [53.0, 48.0],
            [53.0, 51.5],
            [48.0, 51.5],
            [48.0, 48.0],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "North Kazakhstan Region", country: "Kazakhstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [63.0, 52.5],
            [69.0, 52.5],
            [69.5, 55.0],
            [63.5, 55.0],
            [63.0, 52.5],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "South Kazakhstan Region", country: "Kazakhstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [66.0, 41.0],
            [70.0, 41.0],
            [70.0, 44.0],
            [66.0, 44.0],
            [66.0, 41.0],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Karaganda Region", country: "Kazakhstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [70.0, 46.5],
            [75.0, 46.5],
            [75.0, 50.0],
            [70.0, 50.0],
            [70.0, 46.5],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Samarkand Region", country: "Uzbekistan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [65.5, 38.5],
            [68.0, 38.5],
            [68.0, 40.5],
            [65.5, 40.5],
            [65.5, 38.5],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Bukhara Region", country: "Uzbekistan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [62.0, 38.5],
            [65.5, 38.5],
            [65.5, 41.0],
            [62.0, 41.0],
            [62.0, 38.5],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Issyk-Kul Region", country: "Kyrgyzstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [76.0, 41.5],
            [79.0, 41.5],
            [79.0, 43.0],
            [76.0, 43.0],
            [76.0, 41.5],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Chuy Region", country: "Kyrgyzstan" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [73.5, 42.0],
            [76.0, 42.0],
            [76.0, 43.5],
            [73.5, 43.5],
            [73.5, 42.0],
          ],
        ],
      },
    },
  ],
};

// Country boundaries are now imported from external GeoJSON files

interface Location {
  id: string;
  name: string;
  position: [number, number];
  description: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  locations: Location[];
  selectedCountry?: string;
  onLocationClick: (id: string) => void;
  onCoordinatesDrop?: (coords: [number, number]) => void;
  resetMarker?: boolean;
  mapStyle?: string;
}

const LeafletMap = ({
  center,
  zoom,
  locations,
  selectedCountry,
  onLocationClick,
  onCoordinatesDrop,
  resetMarker = false,
  mapStyle = "satellite",
}: LeafletMapProps) => {
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const boundariesLayerRef = useRef<L.GeoJSON | null>(null);
  const droppedMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Map style tile layer URLs
  const getTileLayerUrl = (style: string) => {
    switch (style) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "topographical":
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      case "political":
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  // Update tile layer when mapStyle changes
  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      tileLayerRef.current.setUrl(getTileLayerUrl(mapStyle));
    }
  }, [mapStyle]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
        minZoom: 5,
        maxZoom: 16,
        maxBounds: [
          [30, 40],  // Southwest corner (lat, lng)
          [65, 95]   // Northeast corner (lat, lng)
        ],
        maxBoundsViscosity: 0.8,
      });

      // Create tile layer and store reference
      tileLayerRef.current = L.tileLayer(getTileLayerUrl(mapStyle), {}).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Add country boundaries with dynamic styling
      boundariesLayerRef.current = L.geoJSON(COUNTRY_BOUNDARIES as any, {
        style: (feature) => {
          const isSelected = feature?.properties?.name === selectedCountry;
          return {
            color: isSelected ? "#FFD700" : "#403f3f",
            weight: isSelected ? 3 : 1.5,
            opacity: isSelected ? 1 : 0.4,
            fill: isSelected,
            fillColor: isSelected ? "#FFD700" : "transparent",
            fillOpacity: isSelected ? 0.1 : 0,
          };
        },
      }).addTo(mapRef.current);

      // Function to create and add marker
      const createMarker = (coords: [number, number]) => {
        // Remove existing dropped marker
        if (droppedMarkerRef.current) {
          droppedMarkerRef.current.remove();
        }

        // Create marker icon
        const markerIcon = L.divIcon({
          className: "dropped-marker",
          html: `<div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: #FDD835; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; position: relative;">
              <div style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 8px;"></div>
              <div style="width: 16px; height: 8px; background: white; border-radius: 0 0 8px 8px; position: absolute; bottom: 6px;"></div>
            </div>
            <div style="width: 2px; height: 16px; background: #FDD835; margin-top: -2px;"></div>
            <div style="width: 8px; height: 8px; background: #FDD835; border-radius: 50%;"></div>
          </div>`,
          iconSize: [32, 56],
          iconAnchor: [16, 56],
        });

        // Add new marker
        droppedMarkerRef.current = L.marker(coords, {
          icon: markerIcon,
        }).addTo(mapRef.current!);

        // Notify parent
        if (onCoordinatesDrop) {
          onCoordinatesDrop(coords);
        }
      };

      // Add click handler to drop marker on map
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
        createMarker(coords);
      });

      // Add drag and drop handlers to container
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const markerData = e.dataTransfer!.getData('text/plain');
        if (markerData === 'marker' && mapRef.current) {
          // Get the coordinates from the drop position
          const containerRect = containerRef.current!.getBoundingClientRect();
          const point = L.point(
            e.clientX - containerRect.left,
            e.clientY - containerRect.top
          );
          const latlng = mapRef.current.containerPointToLatLng(point);
          const coords: [number, number] = [latlng.lat, latlng.lng];
          createMarker(coords);
        }
      };

      containerRef.current!.addEventListener('dragover', handleDragOver);
      containerRef.current!.addEventListener('drop', handleDrop);

      // Store cleanup functions
      const cleanupDragListeners = () => {
        containerRef.current?.removeEventListener('dragover', handleDragOver);
        containerRef.current?.removeEventListener('drop', handleDrop);
      };

      return () => {
        cleanupDragListeners();
      };
    } else {
      mapRef.current.setView(center, zoom);
    }

    // Update boundaries when selectedCountry changes
    if (boundariesLayerRef.current) {
      boundariesLayerRef.current.eachLayer((layer: any) => {
        const feature = layer.feature;
        const isSelected = feature?.properties?.name === selectedCountry;
        layer.setStyle({
          color: isSelected ? "#FFD700" : "#403f3f",
          weight: isSelected ? 3 : 1.5,
          opacity: isSelected ? 1 : 0.4,
          fill: isSelected,
          fillColor: isSelected ? "#FFD700" : "888888",
          fillOpacity: isSelected ? 0.1 : 0,
        });
      });
    }


    return () => {
      // Don't remove the map here to preserve across rerenders; cleanup on unmount handled below
    };
  }, [center, zoom, selectedCountry]);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const marker = L.circleMarker(loc.position, {
        radius: 8,
        color: "hsl(var(--primary))",
        fillColor: "hsl(var(--primary))",
        fillOpacity: 0.7,
        weight: 2,
      });

      marker.on("click", () => onLocationClick(loc.id));
      marker.bindTooltip(loc.name, { permanent: false, direction: "top", offset: L.point(0, -8) });
      marker.addTo(markersLayerRef.current!);
    });
  }, [locations, onLocationClick]);

  // Remove dropped marker when resetMarker becomes true
  useEffect(() => {
    if (resetMarker && droppedMarkerRef.current) {
      droppedMarkerRef.current.remove();
      droppedMarkerRef.current = null;
    }
  }, [resetMarker]);

  useEffect(() => {
    return () => {
      if (droppedMarkerRef.current) {
        droppedMarkerRef.current.remove();
        droppedMarkerRef.current = null;
      }
      if (boundariesLayerRef.current) {
        boundariesLayerRef.current.remove();
        boundariesLayerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default LeafletMap;
