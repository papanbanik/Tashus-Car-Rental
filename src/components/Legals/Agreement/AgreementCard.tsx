'use client';

import { AgreementCardProps } from '@/types/legals/agreementTypes';
import { usePathname } from 'next/navigation';
import AdditionalDrivers from './AgreementInfo/AdditionalDrivers';
import GuestDetails from './AgreementInfo/GuestDetails';
import PartnerDetails from './AgreementInfo/PartnerDetails';
import ReservationDetails from './AgreementInfo/ReservationDetails';
import RevisedReservation from './AgreementInfo/RevisedReservation';
import VehicleCoverage from './AgreementInfo/VehicleCoverage';
import VehicleDetails from './AgreementInfo/VehicleDetails';
import VehicleLocations from './AgreementInfo/VehicleLocations';
const AgreementCard = ({ reservationDetails, isRental }: AgreementCardProps) => {
  let count = 0;
  // console.log(isRental);
  // console.log(reservationDetails);
  const isReserveRevised = reservationDetails?.reservation?.revisedReservationResponses?.length > 0;
  // console.log(isReserveRevised);
  const pathName = usePathname();
  return (
    <div>
      <>
        {pathName.includes('owner-agreement') ? (
          //  Partner Info
          <PartnerDetails reservationDetails={reservationDetails} count={(count = count + 1)} />
        ) : (
          //  Guest Info
          <GuestDetails reservationDetails={reservationDetails} count={(count = count + 1)} />
        )}

        {/* Additional Drivers Info */}
        <AdditionalDrivers reservationDetails={reservationDetails} count={(count = count + 1)} />
        {/* Vehicle Details */}
        <VehicleDetails reservationDetails={reservationDetails} count={(count = count + 1)} />
        {/* Reservation Details */}
        <ReservationDetails reservationDetails={reservationDetails} count={(count = count + 1)} isRental={isRental} />
        {/* Revised Reservation */}
        <RevisedReservation
          reservationDetails={reservationDetails}
          count={(count = count + 1)}
          isRental={isRental}
          isReserveRevised={isReserveRevised}
        />
        {/* Vehicle Coverage */}
        <VehicleCoverage reservationDetails={reservationDetails} count={(count = count + 1)} isRental={isRental} />
        {/* Vehicle Location */}
        <VehicleLocations reservationDetails={reservationDetails} count={(count = count + 1)} isRental={isRental} />
      </>
    </div>
  );
};

export default AgreementCard;
