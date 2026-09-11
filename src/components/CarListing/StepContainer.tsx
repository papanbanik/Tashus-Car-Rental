import React from 'react';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useMediaQuery, useTheme } from '@mui/material';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';

const StepContainer = ({ children }: { children: React.ReactNode }) => {
  const { isHideSpaceForEditVehicle } = useCarListingContext();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isIPadPro = useIPadProQuery();

  return (
    <div
      className={`${isIPadPro ? 'px-12 py-10' : 'lg:px-24 lg:py-20'} flex-row md:px-12 md:py-8 bg-white px-6  py-4 rounded-xl shadow-lg ${
        !isHideSpaceForEditVehicle || isSmall ? 'lg:mx-8 mx-2 ' : ''
      } `}
    >
      {children}
    </div>
  );
};

export default StepContainer;
