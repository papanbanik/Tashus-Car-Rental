'use client';
import CommonTooltip from '@/components/Common/CommonTooltip';
import { CarPickupLocationValues } from '@/types/car-listing/carListingTypes';
import { ReservationLocationState } from '@/types/travels/typeTravels';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { showTime } from '@/utils/Functions/travelCommonFn';
import { IconButton } from '@mui/material';
import dynamic from 'next/dynamic';
import { FaLocationDot } from 'react-icons/fa6';

const CommonMap = dynamic(() => import('@/components/Common/CommonMap'), {
  ssr: false,
});
type GeneralLocationProps = {
  pickupLocation: ReservationLocationState;
  dropOffLocation: ReservationLocationState;
  pickupAddress: CarPickupLocationValues;
  isShowFullAddress?: boolean;
};

const GeneralLocation = ({ pickupLocation, dropOffLocation, pickupAddress, isShowFullAddress = false }: GeneralLocationProps) => {
  return (
    <div id="general-location-details my-2">
      {/* Divider */}
      <div className="w-full h-px bg-secondary my-4" />
      {/* Pickup location */}
      <div className="flex justify-start items-center">
        <span className="font-bold text-sm md:text-md">Pickup: </span>
        <CommonTooltip title={`The precise address would share ${showTime} minutes before Travel Start Time`} arrow={true} placement="bottom">
          <IconButton className="bg-transparent">
            <FaLocationDot size={15} className="text-primary" />
          </IconButton>
        </CommonTooltip>
        <span className="font-bold text-sm md:text-md">
          {isShowFullAddress ? `${pickupLocation?.streetAddress}` : `${pickupLocation?.shortAddress ?? getCarShortLocation(pickupAddress)}`}
        </span>
      </div>
      {/* Drop off location */}
      <div className="flex justify-start items-center mb-2">
        <span className="font-bold text-sm md:text-md">Drop-Off: </span>
        <CommonTooltip title={`The precise address would share ${showTime} minutes before Travel Start Time`} arrow={true} placement="bottom">
          <IconButton className="bg-transparent">
            <FaLocationDot size={15} className="text-primary" />
          </IconButton>
        </CommonTooltip>
        <span className="font-bold text-sm md:text-md">
          {dropOffLocation?.postalCode ? <>{dropOffLocation?.streetAddress}</> : <>Same as pickup</>}
        </span>
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-secondary my-4" />
      {/* Vehicle Location */}
      {isShowFullAddress && <CommonMap center={pickupLocation?.coordinates} address={pickupLocation?.streetAddress} />}
    </div>
  );
};

export default GeneralLocation;
