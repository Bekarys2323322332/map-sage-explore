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

      // Create draggable marker with custom icon
      const customIcon = L.divIcon({
        className: 'custom-draggable-marker',
        html: '<div style="background: hsl(var(--primary)); width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); margin-top: 6px; text-align: center; font-size: 16px;">📍</div></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const bounds = mapRef.current.getBounds();
      const bottomLeft = bounds.getSouthWest();
      const initialPosition: [number, number] = [
        bottomLeft.lat + (bounds.getNorth() - bottomLeft.lat) * 0.15,
        bottomLeft.lng + (bounds.getEast() - bottomLeft.lng) * 0.1,
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default LeafletMap;
