'use client';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[];
  address?: string;
}

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const CarMap: React.FC<MapProps> = ({ center, address }) => {
  const mapRef = useRef<L.Map | null>(null);
  useEffect(() => {
    if (mapRef.current && center) {
      const map = mapRef.current;
      map.setView(
        {
          lng: center[1],
          lat: center[0],
        },
        5
      );
    }

    return () => {
      // Cleanup the map when the component is unmounted
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [center]);

  useEffect(() => {
    // console.log(center);

    if (center) setMarkerPosition(center);
  }, [center]);

  const [markerPosition, setMarkerPosition] = useState<number[]>(center || [151.2099, -33.8688]);

  return (
    <>
      <MapContainer
        center={(center as L.LatLngExpression) || [151.2099, -33.8688]}
        zoom={center ? 15 : 4}
        scrollWheelZoom={true}
        className="h-[30vh] rounded-lg" //Prev 50vh
      >
        <TileLayer url={url} attribution={attribution} />
        {center && (
          <>
            <Marker position={markerPosition as L.LatLngExpression} draggable={false}>
              <Popup>{address}</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </>
  );
};

export default CarMap;
