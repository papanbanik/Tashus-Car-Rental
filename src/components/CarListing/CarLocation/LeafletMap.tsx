'use client';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import DraggableDialog from '@/components/Common/DraggableDialog';
import { IMapFormattedResult } from '@/types/mapLocations';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { fetchReverseGeocoding, transformGeocodingResult } from './map.common';

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
  setNewSelectedResult: (result: IMapFormattedResult | null) => void;
}

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const CustomMap: React.FC<MapProps> = ({ center, address, setNewSelectedResult }) => {
  const [showDialog, setShowDialog] = useState(false);

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
      ); // Adjust the zoom level as desired
    }
  }, [center]);

  useEffect(() => {
    // console.log(center);

    if (center) setMarkerPosition(center);
  }, [center]);

  const [markerPosition, setMarkerPosition] = useState<number[]>(center || [151.2099, -33.8688]);

  const [newPosition, setNewPosition] = useState<number[]>([151.2099, -33.8688]); // Initialize with an empty array

  const handleMarkerChange = (event: any) => {
    const newCoordinates = event.target.getLatLng();
    if (newCoordinates.lat === 51.505 && newCoordinates.lng === -0.09) return;
    setNewPosition([newCoordinates.lat, newCoordinates.lng]);
    setShowDialog(true);
  };

  const handleSubscribe = () => {
    setShowDialog(false);
    if (newPosition.length === 0) return;
    fetchReverseGeocoding(newPosition[0], newPosition[1]) // lat, lng
      .then((apiResult) => {
        const response: IMapFormattedResult[] = transformGeocodingResult(apiResult);
        // console.log({ response });
        if (response?.length > 0) setNewSelectedResult(response[0]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleCancel = () => {
    if (center) setMarkerPosition([center[0], center[1]]);
    setShowDialog(false);
    // console.log(center, newPosition);
  };

  return (
    <>
      <MapContainer
        center={(center as L.LatLngExpression) || [151.2099, -33.8688]}
        zoom={center ? 15 : 4}
        scrollWheelZoom={true}
        className="h-[50vh] rounded-lg"
      >
        <TileLayer url={url} attribution={attribution} />
        {center && (
          <>
            <Marker
              position={markerPosition as L.LatLngExpression}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerChange,
              }}
            >
              <Popup>
                {/* Marker Position: {markerPosition[0]}, {markerPosition[1]} */}
                {address}
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      <DraggableDialog
        buttonText="Open Dialog"
        dialogTitle="Location Confirmation"
        dialogContent="To ensure accurate representation, please confirm your desired location before updating the map marker."
        subscribeText="Agree"
        draggable={true}
        open={showDialog}
        onCancel={handleCancel}
        onSubscribe={handleSubscribe}
        disableOutsideClick={true}
      />
    </>
  );
};

export default CustomMap;
