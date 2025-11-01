import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';

interface LocationMarkerProps {
  position: [number, number];
  name: string;
  onClick: () => void;
}

// Create an enhanced glowing marker icon with better visibility
const createGlowingIcon = () => {
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="pulse">
            <stop offset="0%" style="stop-color:hsl(35, 90%, 70%);stop-opacity:0.9" />
            <stop offset="50%" style="stop-color:hsl(35, 85%, 55%);stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:hsl(35, 75%, 48%);stop-opacity:0.1" />
          </radialGradient>
          <radialGradient id="core">
            <stop offset="0%" style="stop-color:hsl(35, 95%, 75%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(35, 85%, 55%);stop-opacity:1" />
          </radialGradient>
        </defs>
        <!-- Outer pulse ring -->
        <circle cx="25" cy="25" r="20" fill="url(#pulse)" filter="url(#glow)">
          <animate attributeName="r" values="15;22;15" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>
        <!-- Middle ring -->
        <circle cx="25" cy="25" r="12" fill="none" stroke="hsl(35, 90%, 65%)" stroke-width="2" opacity="0.8">
          <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite"/>
        </circle>
        <!-- Core marker -->
        <circle cx="25" cy="25" r="8" fill="url(#core)" stroke="white" stroke-width="2.5" filter="url(#glow)"/>
        <!-- Center dot -->
        <circle cx="25" cy="25" r="3" fill="white" opacity="0.9">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `),
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
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
      <Popup className="custom-popup">
        <div className="text-center">
          <div className="font-bold text-lg text-foreground mb-1">{name}</div>
          <div className="text-xs text-muted-foreground">Click to learn more</div>
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
