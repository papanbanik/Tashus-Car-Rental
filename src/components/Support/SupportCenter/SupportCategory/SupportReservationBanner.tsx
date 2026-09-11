'use client';
import TravelDurationInfo from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelDurationInfo';
import { useTravelContext } from '@/context/TravelProvider';
import useMediumForTravelDetails from '@/hooks/responsive/useMediumForTravelDetails';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { useMediaQuery, useTheme } from '@mui/material';

const SupportReservationBanner = () => {
  useTravelDetails();
  const { updatedTravelData } = useTravelContext();
  const isMedium = useMediumForTravelDetails();
  const theme = useTheme();
  const iseLessSmall = useMediaQuery(theme.breakpoints.down(768));
  return (
    <div>
      <span>
        <div
          className={`${
            isMedium ? 'md:grid-cols-2 grid-cols-3 md:gap-8 gap-2' : 'grid-cols-3'
          } grid  bg-white shadow-lg shadow-secondary rounded-lg md:p-4 px-2 w-full justify-between items-center md:my-6 mb-3 mx-auto`}
        >
          <div className="relative  col-span-2 md:col-span-1">
            <span
              className="z-10 relative inline-block font-bold bg-primary text-white p-2 md:w-3/5 w-full"
              style={{
                clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
                zIndex: 100,
              }}
            >
              {updatedTravelData?.isUserGuest ? 'Your Reservation' : `${updatedTravelData?.oppositeUserInfo?.lastName}'s Reservation`}
            </span>
          </div>
          {!iseLessSmall && (
            <div className="col-span-2 flex justify-between items-center">
              <TravelDurationInfo></TravelDurationInfo>
            </div>
          )}
        </div>
      </span>
    </div>
  );
};

export default SupportReservationBanner;
