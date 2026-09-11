'use client';
import { Typography } from '@mui/material';
import { BsCalendar2CheckFill } from 'react-icons/bs';
import CarRequirement from './CarRequirement';
import CarDetailsSectionTitle from '@/components/Common/VehicleDetails/CarDetailsSectionTitle';
import CarAvailabilityCustom from './CarAvailabilityCustom';
import { CarDataAvailability } from '@/types/car-listing/carListingTypes';
import CarDetailsSectionDivider from '@/components/Common/VehicleDetails/CarDetailsSectionDivider';

interface CarAvailabilityProps {
  availability: CarDataAvailability;
}

const CarAvailability = ({ availability }: CarAvailabilityProps) => {
  const { pickupReturnHour, noticeInAdvance, maxTripDuration, minTripDuration } = availability ?? {};

  return (
    <div className="mb-4">
      <CarDetailsSectionTitle sectionTitle="Pickup and Return Hours"></CarDetailsSectionTitle>

      <CarRequirement noticeHoursRequired={noticeInAdvance?.hoursRequired} minTripDuration={minTripDuration} maxTripDuration={maxTripDuration} />

      {pickupReturnHour?.alwaysAvailable ? (
        <>
          <div className="flex w-full justify-start">
            <Typography className="normal-case">
              <span className="md:text-lg text-sm">This vehicle is always available for pickup and return</span>
              <BsCalendar2CheckFill className="ml-2 text-success md:text-lg text-sm" />
            </Typography>
          </div>

          <CarDetailsSectionDivider></CarDetailsSectionDivider>
        </>
      ) : (
        <CarAvailabilityCustom customAvailabilities={pickupReturnHour?.customAvailability ?? []}></CarAvailabilityCustom>
      )}
    </div>
  );
};

export default CarAvailability;
