import { useEffect, useRef } from 'react';
import L, { Map as LeafletMapInstance } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Central Asia country boundaries (simplified GeoJSON)
const COUNTRY_BOUNDARIES = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { name: 'Kazakhstan' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[87.3, 49.1], [86.0, 47.5], [85.0, 47.0], [84.0, 46.5], [82.5, 45.5], [80.0, 45.5], [78.0, 45.0], [76.0, 44.5], [74.0, 43.5], [73.0, 43.0], [71.0, 42.5], [70.0, 42.0], [69.0, 41.5], [68.0, 41.0], [66.5, 41.0], [66.0, 41.5], [65.0, 42.0], [63.0, 42.5], [61.0, 43.0], [59.0, 43.5], [57.0, 44.0], [55.0, 44.5], [53.0, 45.0], [52.0, 45.5], [51.0, 46.0], [50.5, 46.5], [50.0, 47.0], [49.5, 47.5], [49.0, 48.0], [49.0, 48.5], [49.5, 49.0], [50.5, 49.5], [51.5, 50.0], [53.0, 50.5], [54.5, 51.0], [56.0, 51.0], [58.0, 51.0], [60.0, 51.0], [62.0, 51.0], [64.0, 50.5], [66.0, 50.0], [68.0, 50.0], [70.0, 50.0], [72.0, 50.5], [74.0, 51.0], [76.0, 51.0], [78.0, 51.0], [80.0, 50.5], [82.0, 50.0], [84.0, 49.5], [85.5, 49.3], [87.3, 49.1]]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { name: 'Uzbekistan' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[66.5, 41.0], [68.0, 41.0], [69.0, 41.5], [70.0, 42.0], [71.0, 42.5], [73.0, 43.0], [73.5, 42.5], [73.0, 42.0], [72.5, 41.5], [72.0, 41.0], [71.5, 40.5], [71.0, 40.0], [70.5, 39.5], [70.0, 39.0], [69.5, 38.5], [69.0, 38.0], [68.5, 37.5], [68.0, 37.0], [67.5, 37.0], [67.0, 37.5], [66.5, 38.0], [66.0, 38.5], [65.5, 39.0], [65.0, 39.5], [64.5, 40.0], [65.0, 40.5], [65.5, 41.0], [66.5, 41.0]]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { name: 'Kyrgyzstan' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[69.0, 41.5], [70.0, 42.0], [71.0, 42.5], [73.0, 43.0], [74.0, 43.5], [76.0, 43.0], [78.0, 42.5], [80.0, 42.0], [80.0, 41.5], [79.5, 41.0], [79.0, 40.5], [78.5, 40.0], [78.0, 39.5], [77.0, 39.5], [76.0, 39.5], [75.0, 39.5], [74.0, 39.5], [73.0, 40.0], [72.0, 40.5], [71.0, 41.0], [70.0, 41.0], [69.0, 41.5]]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { name: 'Tajikistan' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[67.5, 37.0], [68.0, 37.0], [68.5, 37.5], [69.0, 38.0], [69.5, 38.5], [70.0, 39.0], [70.5, 39.5], [71.0, 40.0], [72.0, 40.5], [73.0, 40.0], [74.0, 39.5], [75.0, 39.5], [75.0, 39.0], [74.5, 38.5], [74.0, 38.0], [73.5, 37.5], [73.0, 37.0], [72.0, 37.0], [71.0, 37.0], [70.0, 37.0], [69.0, 37.0], [68.0, 36.5], [67.5, 37.0]]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { name: 'Turkmenistan' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[52.5, 42.0], [54.0, 42.0], [55.5, 42.0], [57.0, 41.5], [58.5, 41.0], [60.0, 40.5], [61.5, 40.0], [63.0, 39.5], [64.5, 39.0], [66.0, 38.5], [66.5, 38.0], [67.0, 37.5], [67.5, 37.0], [68.0, 36.5], [67.5, 36.0], [66.5, 36.0], [65.5, 36.0], [64.0, 36.5], [62.5, 37.0], [61.0, 37.5], [59.5, 38.0], [58.0, 38.5], [56.5, 39.0], [55.0, 39.5], [53.5, 40.0], [52.5, 40.5], [52.0, 41.0], [52.0, 41.5], [52.5, 42.0]]]
      }
    }
  ]
};

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

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      // Add country boundaries
      boundariesLayerRef.current = L.geoJSON(COUNTRY_BOUNDARIES as any, {
        style: {
          color: '#FFD700',
          weight: 2,
          opacity: 0.8,
          fill: false,
        }
      }).addTo(mapRef.current);

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
