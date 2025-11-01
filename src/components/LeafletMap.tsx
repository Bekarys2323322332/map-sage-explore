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
}

const LeafletMap = ({ center, zoom, locations, onLocationClick }: LeafletMapProps) => {
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {}
      ).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default LeafletMap;
