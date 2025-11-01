import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';

interface LocationMarkerProps {
  position: [number, number];
  name: string;
  onClick: () => void;
}

// Create a custom glowing marker icon
const createGlowingIcon = () => {
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="pulse">
            <stop offset="0%" style="stop-color:hsl(35, 85%, 65%);stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:hsl(35, 75%, 48%);stop-opacity:0.2" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="15" fill="url(#pulse)" filter="url(#glow)">
          <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="20" cy="20" r="6" fill="hsl(35, 75%, 48%)" stroke="white" stroke-width="2"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const LocationMarker = ({ position, name, onClick }: LocationMarkerProps) => {
  return (
    <Marker 
      position={position} 
      icon={createGlowingIcon()}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="text-center font-semibold text-foreground">{name}</div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
