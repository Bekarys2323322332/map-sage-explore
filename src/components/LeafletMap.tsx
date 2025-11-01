import { useEffect, useRef } from 'react';
import L, { Map as LeafletMapInstance } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  onLocationClick: (id: string) => void;
  onCoordinatesDrop?: (coords: [number, number]) => void;
}

const LeafletMap = ({ center, zoom, locations, onLocationClick, onCoordinatesDrop }: LeafletMapProps) => {
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const draggableMarkerRef = useRef<L.Marker | null>(null);
  const boundariesLayerRef = useRef<L.GeoJSON | null>(null);

  // Central Asia country boundaries (simplified GeoJSON)
  const centralAsiaBoundaries = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: { name: "Kazakhstan" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [[
            [46.5, 55.5], [51.0, 56.0], [55.5, 55.5], [60.0, 54.5], [69.0, 55.5],
            [73.0, 54.0], [75.5, 53.0], [80.0, 51.0], [83.0, 49.0], [84.5, 47.5],
            [87.0, 45.5], [87.5, 44.0], [86.0, 43.0], [84.0, 42.5], [81.0, 41.5],
            [78.0, 41.0], [75.0, 40.5], [72.5, 40.5], [70.0, 41.5], [68.5, 42.5],
            [67.0, 43.0], [64.0, 43.5], [60.0, 43.0], [58.0, 45.0], [56.0, 47.0],
            [55.0, 48.5], [54.0, 50.0], [53.0, 51.5], [52.0, 52.5], [51.0, 53.5],
            [49.0, 54.0], [47.5, 54.5], [46.5, 55.5]
          ]]
        }
      },
      {
        type: "Feature" as const,
        properties: { name: "Uzbekistan" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [[
            [55.5, 41.5], [57.0, 42.5], [58.5, 43.0], [61.0, 43.5],
            [64.0, 43.5], [67.0, 43.0], [68.5, 42.5], [69.5, 41.5],
            [71.0, 41.0], [72.5, 40.5], [73.0, 39.5], [73.5, 38.0],
            [73.0, 37.0], [71.0, 36.5], [69.5, 37.0], [68.0, 37.5],
            [67.0, 38.5], [66.0, 39.0], [64.5, 39.5], [63.0, 40.0],
            [61.0, 40.5], [59.5, 40.5], [58.0, 40.5], [56.5, 41.0],
            [55.5, 41.5]
          ]]
        }
      },
      {
        type: "Feature" as const,
        properties: { name: "Kyrgyzstan" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [[
            [69.5, 41.5], [70.5, 42.5], [72.0, 43.0], [74.0, 43.0],
            [75.5, 42.5], [78.0, 42.0], [80.0, 42.0], [80.5, 41.5],
            [80.0, 40.5], [78.5, 40.0], [77.0, 39.5], [75.0, 39.5],
            [73.5, 40.0], [72.0, 40.5], [71.0, 41.0], [69.5, 41.5]
          ]]
        }
      },
      {
        type: "Feature" as const,
        properties: { name: "Tajikistan" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [[
            [67.5, 39.0], [69.0, 40.0], [70.5, 40.5], [72.0, 40.0],
            [73.0, 39.5], [75.0, 39.5], [75.5, 38.5], [75.0, 37.5],
            [74.0, 37.0], [72.5, 37.0], [71.0, 37.5], [70.0, 38.0],
            [69.0, 38.5], [67.5, 39.0]
          ]]
        }
      },
      {
        type: "Feature" as const,
        properties: { name: "Turkmenistan" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [[
            [52.5, 42.0], [54.0, 42.5], [55.5, 42.0], [56.5, 41.5],
            [58.0, 41.0], [59.5, 40.5], [61.0, 40.5], [63.0, 40.0],
            [65.0, 39.0], [66.0, 38.5], [66.0, 37.5], [65.5, 36.5],
            [64.0, 36.0], [62.0, 35.5], [60.0, 36.0], [58.5, 37.0],
            [56.5, 38.0], [55.0, 39.0], [53.5, 40.0], [52.5, 41.0],
            [52.5, 42.0]
          ]]
        }
      }
    ]
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
        minZoom: 3,
        maxZoom: 18,
      });

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {}
      ).addTo(mapRef.current);

      // Add country boundaries layer
      boundariesLayerRef.current = L.geoJSON(centralAsiaBoundaries, {
        style: {
          color: '#FFD700',
          weight: 2,
          opacity: 0.8,
          fill: false,
        }
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Create Street View-style draggable marker
      const customIcon = L.divIcon({
        className: 'custom-draggable-marker',
        html: `<div style="display: flex; flex-direction: column; align-items: center; cursor: move;">
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

      const bounds = mapRef.current.getBounds();
      const bottomRight = bounds.getSouthEast();
      const initialPosition: [number, number] = [
        bottomRight.lat + (bounds.getNorth() - bottomRight.lat) * 0.15,
        bottomRight.lng - (bounds.getEast() - bounds.getWest()) * 0.05,
      ];

      draggableMarkerRef.current = L.marker(initialPosition, {
        icon: customIcon,
        draggable: true,
      }).addTo(mapRef.current);

      draggableMarkerRef.current.on('dragend', () => {
        if (draggableMarkerRef.current && onCoordinatesDrop) {
          const pos = draggableMarkerRef.current.getLatLng();
          onCoordinatesDrop([pos.lat, pos.lng]);
        }
      });
    } else {
      mapRef.current.setView(center, zoom);
    }

    return () => {
      // Don't remove the map here to preserve across rerenders; cleanup on unmount handled below
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    locations.forEach((loc) => {
      const marker = L.circleMarker(loc.position, {
        radius: 8,
        color: 'hsl(var(--primary))',
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 0.7,
        weight: 2,
      });

      marker.on('click', () => onLocationClick(loc.id));
      marker.bindTooltip(loc.name, { permanent: false, direction: 'top', offset: L.point(0, -8) });
      marker.addTo(markersLayerRef.current!);
    });
  }, [locations, onLocationClick]);

  useEffect(() => {
    return () => {
      if (draggableMarkerRef.current) {
        draggableMarkerRef.current.remove();
        draggableMarkerRef.current = null;
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
