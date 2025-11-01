import { TileLayer } from 'react-leaflet';
import LocationMarker from './LocationMarker';

interface Location {
  id: string;
  name: string;
  position: [number, number];
  description: string;
}

interface MapContentProps {
  locations: Location[];
  onLocationClick: (id: string) => void;
}

const MapContent = ({ locations, onLocationClick }: MapContentProps) => {
  return (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {locations.map((location) => (
        <LocationMarker
          key={location.id}
          position={location.position}
          name={location.name}
          onClick={() => onLocationClick(location.id)}
        />
      ))}
    </>
  );
};

export default MapContent;
