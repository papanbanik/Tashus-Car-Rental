'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { getCarShortLocation } from '@/utils/Functions/carListingCommonFn';
import { isAfterPickupTime, isBeforePickupTime, shouldShowAddress, showTime } from '@/utils/Functions/travelCommonFn';
import { dayjsUtc, utcCurrentTime } from '@/utils/Functions/utcCommonFn';
import dynamic from 'next/dynamic';
import TravelSectionHeader from '../TravelSectionHeader';
import DeliveryReturn from './DeliveryReturn';
import GeneralLocation from './GeneralLocation';
const CommonMap = dynamic(() => import('@/components/Common/CommonMap'), {
  ssr: false,
});

interface TravelBillingProps {
  isTravelUpdatedPage?: boolean;
}

const TravelLocation = ({ isTravelUpdatedPage }: TravelBillingProps) => {
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData, reservationDeliveryDetails } = useTravelContext();
  const { pickupDate, returnDate } = updatedTravelData || {};
  const isEndDayPassed = utcCurrentTime?.formattedTimeDayObj.isAfter(dayjsUtc(returnDate), 'minute');
  const { isTripStarted = false, reservationInfo, isEndedByPartner = false, isEndedByGuest = false, pickupAddress } = travelDetails || {};
  const { isDeliveryEnabled = false, isReturnEnabled = false, pickupLocation, dropOffLocation } = reservationInfo || {};
  const { deliveryRequest } = reservationDeliveryDetails;
  const { deliveryLocation, pickupLocation: deliveryPickupLocation } = deliveryRequest ?? {};
  const helping_text =
    !isBeforePickupTime(travelDetails) && !isTripStarted && !isAfterPickupTime(travelDetails)
      ? `A detailed address will be shared ${showTime} minutes prior to the start of travel`
      : '';
  const isShowFullAddress = !isEndedByPartner && shouldShowAddress(pickupDate) && !isEndDayPassed;
  return (
    <div id="location-details" className={`${isTravelUpdatedPage ? 'p-5' : ''}`}>
      <TravelSectionHeader title="Pickup & Drop-off Location" />
      {!isDeliveryEnabled && <span className="helping_text">{helping_text}</span>}
      {isDeliveryEnabled ? (
        <DeliveryReturn
          vehicleLocation={pickupLocation}
          isReturnEnabled={isReturnEnabled}
          deliveryLocation={deliveryLocation}
          pickupLocation={deliveryPickupLocation}
          isShowFullAddress={isShowFullAddress}
          shortAddress={pickupLocation?.shortAddress ?? getCarShortLocation(pickupAddress)}
          helping_text={helping_text}
        />
      ) : (
        <GeneralLocation
          pickupLocation={pickupLocation}
          dropOffLocation={dropOffLocation}
          pickupAddress={pickupAddress}
          isShowFullAddress={isShowFullAddress}
        />
      )}
    </div>
  );
};

export default TravelLocation;
