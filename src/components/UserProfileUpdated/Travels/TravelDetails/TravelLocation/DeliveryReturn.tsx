import { TDeliveryLocation } from '@/types/reservations/reservationDeliveryTypes';
import { ReservationLocationState } from '@/types/travels/typeTravels';
import dynamic from 'next/dynamic';
import { FaLocationDot } from 'react-icons/fa6';
import TravelDeliveryInfo from '../../Delivery/TravelDeliveryInfo';
type DeliveryReturnProps = {
  vehicleLocation: ReservationLocationState;
  isReturnEnabled: boolean;
  deliveryLocation?: TDeliveryLocation;
  pickupLocation?: TDeliveryLocation;
  isShowFullAddress?: boolean;
  shortAddress?: string;
  helping_text?: string;
};
const CommonMap = dynamic(() => import('@/components/Common/CommonMap'), {
  ssr: false,
});
const DeliveryReturn = ({
  vehicleLocation,
  isReturnEnabled = false,
  deliveryLocation,
  pickupLocation,
  isShowFullAddress,
  shortAddress,
  helping_text,
}: DeliveryReturnProps) => {
  const pickupCoords: [number, number] | undefined =
    pickupLocation?.latitude !== undefined && pickupLocation?.longitude !== undefined
      ? [pickupLocation.longitude, pickupLocation.latitude]
      : undefined;
  const deliveryCoords: [number, number] | undefined =
    deliveryLocation?.latitude !== undefined && deliveryLocation?.longitude !== undefined
      ? [deliveryLocation.longitude, deliveryLocation.latitude]
      : undefined;
  return (
    <div id="delivery-location-details my-2">
      {/* Divider */}
      <div className="w-full h-px bg-secondary my-4" />
      <TravelDeliveryInfo />
      {/* Divider */}
      <div className="w-full h-px bg-secondary my-4" />
      {/* Pickup location */}
      <div className="flex justify-start items-center gap-1">
        <span className="font-bold text-sm md:text-md">Pickup: </span>
        <FaLocationDot size={15} className="text-primary" />
        <span className="font-semibold text-sm md:text-md">{deliveryLocation?.address}</span>
      </div>
      {/* Drop off location */}
      <div className="flex justify-start items-center  gap-1">
        <span className="font-bold text-sm md:text-md">Drop-Off: </span>
        <FaLocationDot size={15} className="text-primary" />
        <span className="font-semibold text-sm md:text-md">
          {isReturnEnabled ? 'Same as pickup' : isShowFullAddress ? `${pickupLocation?.address}` : `${shortAddress}`}
        </span>
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-secondary my-4" />
      {/* Maps */}
      {isReturnEnabled ? (
        <>
          <span className="font-bold text-sm md:text-md">Pickup & Drop-Off Map:</span>
          <CommonMap center={deliveryCoords} address={pickupLocation?.address} />
        </>
      ) : (
        <div className={`w-full flex ${!isShowFullAddress ? 'items-start' : 'items-center'} gap-1`}>
          <div className="w-1/2">
            <span className="font-bold text-sm md:text-md">Pickup Map:</span>
            <CommonMap center={deliveryCoords} address={pickupLocation?.address} />
          </div>
          {isShowFullAddress ? (
            <div className="w-1/2">
              <span className="font-bold text-sm md:text-md">Drop-Off Map:</span>
              <CommonMap center={pickupCoords} address={vehicleLocation?.streetAddress} />
            </div>
          ) : (
            <div className="min-h-48 w-1/2 flex flex-col">
              <span className="font-bold text-sm md:text-md">Drop-Off Map:</span>
              <span className="helping_text">{!!helping_text ? helping_text : 'Drop-off location details are currently unavailable.'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryReturn;
