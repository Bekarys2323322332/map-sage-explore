import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
       {"type":"Feature",
        properties: {name :"Kazakhstan" , id:"kazkahstan"}
        "geometry":{"type":"Polygon","coordinates":[[[69.6837177,55.360181],[68.23513390000004,54.9690517],[64.738648,54.35392],[61.857450299999975,53.962056699999984],[61.067349,52.347597],[61.449163,50.8063336],[59.814103,50.5361125],[56.6996787,51.074955700000025],[55.660772,50.56018869999998],[52.335364699999964,51.743318699999975],[50.5377167,51.5890327],[48.81395169999997,50.595478100000044],[47.612153700000015,50.46367759999997],[46.90247210000004,49.86385150000003],[46.492161,48.4336187],[48.113718900000016,47.743257],[49.53502289999997,46.188516599999986],[51.25208389999997,47.130114599999985],[53.092637099999976,46.887345899999985],[53.39750780000002,46.300268],[54.94383339999997,45.23409030000003],[53.75335320000004,44.94640779999999],[52.018036900000034,45.410068800000026],[50.77417859999996,44.24106740000002],[52.42391919999997,42.08009650000004],[54.21780990000001,42.37908649999997],[55.499612,41.251587],[56.00179210000002,41.32427980000004],[55.99874260000003,45.000313700000014],[58.587577,45.590118],[60.9904177,44.412594300000016],[62.004055,43.505401],[64.9322634,43.7353744],[66.09669310000001,42.9381375],[65.99871,41.937179],[66.706581,41.141586],[67.96556080000002,41.1500772],[70.634422,42.015434],[71.28020689999995,42.7801265],[73.43291650000003,42.5488984],[74.29378970000002,43.2418678],[75.23129959999999,42.853552],[78.491834,42.900669],[79.967776,42.432224],[80.78131150000002,43.137824099999975],[80.15236740000003,45.052702],[81.8021953,45.35601539999996],[83.05162570000005,47.225277],[85.56083349999996,47.059913700000045],[85.755394,48.3981667],[87.104137,49.151124],[85.21012460000003,49.627085500000035],[83.96433639999998,50.8009987],[80.083038,50.8281677],[77.9065061,53.29141],[76.2013926,54.25979870000004],[74.4865,53.5694],[72.99458090000003,54.098412],[71.296101,54.18494489999996],[70.8043,55.2694],[69.6837177,55.360181]]]}
          },
      {
        type: "Feature",
        properties: { name: "Uzbekistan", id: "uzbekistan" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [55.5, 37], [56, 41.5], [60, 42], [66, 43], [69, 41],
            [69, 38], [68, 37.5], [66, 37], [64, 37.5], [60, 38],
            [57, 37.2], [55.5, 37]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Kyrgyzstan", id: "kyrgyzstan" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [69, 43], [74, 43], [80, 42], [80, 40], [78, 39.5],
            [75, 39], [72, 39.5], [70, 40], [69, 41.5], [69, 43]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Tajikistan", id: "tajikistan" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [67, 37], [68, 38.5], [69, 39], [71, 39], [73, 38.5],
            [75, 39], [75, 37.5], [73, 37], [71, 37], [69, 37],
            [67, 37]
          ]]
        }
      },
      {
        type: "Feature",
        properties: { name: "Turkmenistan", id: "turkmenistan" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [52.5, 35], [53, 39], [55, 40], [58, 40], [61, 39],
            [66, 39], [66, 37], [63, 35.5], [60, 35], [56, 35],
            [52.5, 35]
          ]]
        }
      }
    ]
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(mapRef.current);

    // Add country boundaries
    countriesGeoJSON.features.forEach((feature) => {
      const layer = L.geoJSON(feature as any, {
        style: {
          fillColor: 'transparent',
          fillOpacity: 0.3,
          color: 'hsl(var(--border))',
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
          if (feature.geometry.type === 'Polygon') {
            const coords = feature.geometry.coordinates[0];
            const center = coords.reduce((acc: [number, number], coord: number[]) => {
              return [acc[0] + coord[1] / coords.length, acc[1] + coord[0] / coords.length];
            }, [0, 0]);
            
            L.marker([center[0], center[1]], {
              icon: L.divIcon({
                className: 'country-label',
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
        fillColor: hoveredCountry === id ? 'hsl(var(--primary))' : 'transparent',
        fillOpacity: hoveredCountry === id ? 0.5 : 0.3,
        color: 'hsl(var(--border))',
        weight: hoveredCountry === id ? 3 : 2,
      });
    });
  }, [hoveredCountry]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MainMapView;
