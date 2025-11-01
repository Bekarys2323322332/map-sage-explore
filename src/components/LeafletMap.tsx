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
        minZoom: 3,
        maxZoom: 18,
      });

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {}
      ).addTo(mapRef.current);

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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default LeafletMap;
