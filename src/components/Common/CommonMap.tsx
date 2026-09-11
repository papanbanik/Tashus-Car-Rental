import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_V1}`;

const attribution =
  'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

interface MapProps {
  center?: [number, number];
  address?: string;
}

interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}

function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const CommonMap = ({ center, address }: MapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([151.2099, -33.8688]); // Default center
  const [zoomLevel, setZoomLevel] = useState<number>(16); // Default Zoom Level

  useEffect(() => {
    if (center && center?.length > 0) {
      setMapCenter([center[1], center[0]]);
    }
  }, [center]);

  return (
    <MapContainer center={mapCenter} zoom={zoomLevel} scrollWheelZoom={true} className="h-[30vh] rounded-lg">
      <ChangeView center={mapCenter} zoom={zoomLevel} />
      <TileLayer url={url} attribution={attribution} />
      {mapCenter && (
        <Marker
          position={mapCenter as L.LatLngExpression}
          icon={L.icon({
            iconUrl: '/Hero/Tashus-Earth-car.svg',
            iconRetinaUrl: '/Hero/Tashus-Earth-car.svg',
            iconSize: [41, 41],
          })}
        >
          <Popup>{address}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default CommonMap;
