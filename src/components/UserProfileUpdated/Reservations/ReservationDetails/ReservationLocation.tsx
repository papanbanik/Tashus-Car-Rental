'use client';

import StepHeader from '@/components/CarListing/StepHeader';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import dynamic from 'next/dynamic';
import { FaLocationDot } from 'react-icons/fa6';
const CarMap = dynamic(() => import('@/components/CarListing/CarViewPost/CarMap'), {
  ssr: false,
});

const ReservationLocation = () => {
  const { travelDetails } = useProfileInfoContext();

  return (
    <div>
      <StepHeader title="Pickup & Drop-off Location" />

      {/* Pickup location */}
      <div className="flex justify-start items-center mb-2">
        <span className="font-bold text-lg">Pickup: </span>
        <FaLocationDot size={24} className="text-primary" />
        <span className="font-bold text-lg">{travelDetails?.reservationInfo?.pickupLocation?.streetAddress ?? ''}</span>
      </div>

      {/* Drop off location */}
      <div className="flex justify-start items-center mb-2">
        <span className="font-bold text-lg">Drop-Off: </span>
        <FaLocationDot size={24} className="text-primary" />
        <span className="font-bold text-lg">
          {travelDetails?.reservationInfo?.dropOffLocation?.postalCode ? (
            <>{travelDetails?.reservationInfo?.dropOffLocation?.streetAddress}</>
          ) : (
            <>Same as pickup</>
          )}
        </span>
      </div>

      {/* {travelDetails?.reservationInfo?.pickupAddress && (
        <>
          <CarMap
            center={[travelDetails?.reservationInfo?.pickupAddress?.coordinates[1], travelDetails?.reservationInfo?.pickupAddress?.coordinates[0]]}
            address={travelDetails?.reservationInfo?.pickupAddress?.streetAddress}
          />
        </>
      )} */}
    </div>
  );
};

export default ReservationLocation;
