import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { ISearchMapProps } from '@/types/car-search/availabilityValidationTypes';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import SearchPopCard from './SearchPopCard';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

// const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_V1}`;

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const SearchedMapView: React.FC<ISearchMapProps> = ({ filteredCarList }) => {
  const mapRef = useRef<L.Map | null>(null);
  const searchQuery = useSearchParams();
  const defaultCenter: [number, number] = [-33.8688, 151.2099];
  const defaultZoomLevel: number = 8;
  // Get lat and long from search params
  const lat = parseFloat(searchQuery.get('lat') || '');
  const long = parseFloat(searchQuery.get('long') || '');
  // If lat and long are valid, use them; otherwise, use the default center
  const initialCenter: [number, number] = !isNaN(lat) && !isNaN(long) ? [lat, long] : defaultCenter;
  const initialZoomLevel: number = !isNaN(lat) && !isNaN(long) ? 8 : defaultZoomLevel;
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter); // Default center

  const { showCarDetails } = useCarListingContext();
  const { searchParams } = useSearchContext();
  const [zoomLevel, setZoomLevel] = useState<number>(initialZoomLevel); // Default Zoom Level

  useEffect(() => {
    // if (mapRef.current && filteredCarList && filteredCarList.length > 0) {
    if (filteredCarList && filteredCarList.length > 0) {
      // Calculate the center point based on the coordinates of markers
      const coordinates: any = filteredCarList.map((item) => item.pickupAddress.coordinates);
      const latitudes = coordinates.map((coord: any) => coord[1]);
      const longitudes = coordinates.map((coord: any) => coord[0]);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;

      // Calculate zoom level based on latitude and longitude differences
      const latZoom = Math.floor(Math.log2(360 / latDiff));
      const lngZoom = Math.floor(Math.log2(360 / lngDiff));
      const zoom = Math.min(latZoom, lngZoom);

      // Set a maximum zoom level to avoid zooming too far in
      const maxZoom = 13; //modified 16 to 13
      const adjustedZoom = Math.min(zoom, maxZoom);
      setZoomLevel(adjustedZoom);

      const newCenter: [number, number] = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
      setMapCenter(newCenter);
    }
  }, [filteredCarList]);

  useEffect(() => {
    if (mapRef.current && mapCenter && filteredCarList && filteredCarList?.length > 0) {
      // if (mapRef.current && mapCenter) {
      mapRef.current.flyTo(mapCenter, zoomLevel); // Set map center and zoom level
    }
  }, [mapCenter]);

  return (
    <MapContainer center={mapCenter} ref={mapRef} zoom={zoomLevel} scrollWheelZoom={false} className="h-[60vh] rounded-lg">
      <TileLayer
        url={url}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      {/* <TileLayer url={url} attribution={attribution} /> */}
      {filteredCarList &&
        filteredCarList.map((item: any, index) => {
          // const icon = L.divIcon({
          //   className: 'custom-marker-icon',
          //   html: `
          //     <div class="flex items-center justify-center">
          //       <img src="/Hero/Tashus-Earth-car.svg" class="w-8 h-8" alt="Car Icon"/>
          //       <div class="ml-2 text-sm font-semibold">${item.rates.dailyRates.amount} ${item.rates.dailyRates.currency}</div>
          //     </div>
          //   `,
          //   iconSize: [120, 30], // Set the size based on the content and design requirements
          // });

          return (
            <Marker
              key={index}
              position={item.pickupAddress.coordinates.slice().reverse() as L.LatLngExpression}
              // icon={icon}
              icon={L.icon({
                iconUrl: '/Hero/Tashus-Earth-car.svg',
                iconRetinaUrl: '/Hero/Tashus-Earth-car.svg',
                iconSize: [41, 41],
              })}
            >
              <Tooltip direction="top" offset={[0, -8]} permanent>
                <span>${item.rates.dailyRates.amount}</span>
              </Tooltip>
              <Popup>
                <div>
                  <SearchPopCard item={item}></SearchPopCard>
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => showCarDetails(item?.listingId, item, searchParams)}
                      className="cursor-pointer px-4 py-2 bg-#5C8D07 text-white rounded hover:bg-#5C8D17 focus:outline-none focus:ring focus:ring-#5C8D27"
                      style={{ backgroundColor: '#5C8D07' }}
                    >
                      Vehicle Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default SearchedMapView;
