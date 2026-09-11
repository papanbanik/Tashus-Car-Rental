'use client';

import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import CarDetailsPolicies from './CarDetailsPolicies';
import ReservationPrice from '@/components/Common/VehicleDetails/PriceUpdate/ReservationPrice';

interface CarRatingProps {
  onCheckAvailability?: () => void;
}

const CarRating: React.FC<CarRatingProps> = ({ onCheckAvailability }) => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const { guestAccess } = useProfileInfoContext();

  return (
    <div className="md:px-8 flex md:flex-col pt-8 justify-end items-center bg-white shadow-md shadow-secondary rounded-b-lg">
      {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
      {isGuestSuspended(guestAccess) && <CommonAccStatusAlert isGuest={true} isSuspend={true} />}
      <ReservationPrice></ReservationPrice>
      {isMedium && <CarDetailsPolicies></CarDetailsPolicies>}
    </div>
  );
};

export default CarRating;
