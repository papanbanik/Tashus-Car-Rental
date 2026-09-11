'use client';

import CommonSnackBar from '@/components/Common/CommonSnackBar';
import ReservationDetailsSkeleton from '@/components/Common/Skeletons/ReservationDetailsSkeleton';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import useMediumForTravelDetails from '@/hooks/responsive/useMediumForTravelDetails';
import { Skeleton, Stack, useMediaQuery } from '@mui/material';
import ReservationBilling from '../../Reservations/ReservationDetails/ReservationBilling';
import TravelBasics from './TravelBasics';
import TravelBilling from './TravelBilling';
import TravelCondition from './TravelCondition';
import TravelDurationInfo from './TravelDurationInfo';
import TravelInfo from './TravelInfo';
import TravelLocation from './TravelLocation/TravelLocation';
import TravelReview from './TravelReview/TravelReview';

const TravelDetails = () => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMedium = useMediumForTravelDetails();

  const { verificationAlertMessage } = useSearchContext();
  const { updatedTravelData } = useTravelContext();
  return (
    <>
      {updatedTravelData?.reservationId ? (
        <div>
          <div id="section0" className={`${isSmallScreen && `md:p-4 my-6 flex flex-col justify-center items-center`}`}>
            <TravelBasics />
            <TravelInfo />

            {isMedium && (
              <div className="w-full flex md:flex-row flex-col gap-4 md:justify-between justify-start mt-4">
                <TravelDurationInfo></TravelDurationInfo>
              </div>
            )}
          </div>

          <div className={`lg:my-12 my-4 grid ${isMedium ? 'grid-cols-1' : 'grid-cols-5 gap-8'} md:p-4`}>
            <div id="section2" className={`${isMedium ? 'col-span-1' : 'col-span-2'}`}>
              <TravelCondition />
            </div>
            <div id="section1" className={`${isMedium ? 'col-span-1 mt-3' : 'col-span-3'}`}>
              <TravelLocation />
            </div>
          </div>

          {/* <div id="section3">
          <TravelPhotos />
        </div> */}

          <div className="my-12 grid md:grid-cols-2 grid-cols-1">
            <div id="section4" className={`col-span-1 lg:pr-12`}>
              {updatedTravelData?.isUserGuest ? <TravelBilling /> : <ReservationBilling />}
            </div>
            <div id="section5" className={`col-span-1  mt-4 md:mt-0`}>
              {/* <TravelMessage /> */}
              <TravelReview />
            </div>
          </div>
        </div>
      ) : (
        <>
          {isSmallScreen ? (
            <>
              <Stack direction="column" spacing={2}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="rounded" width="100%" height={100} />
                <Skeleton variant="text" width="100%" height={20} />
              </Stack>
            </>
          ) : (
            <ReservationDetailsSkeleton />
          )}
        </>
      )}
      <CommonSnackBar
        open={!!verificationAlertMessage?.message}
        message={verificationAlertMessage?.message || ''}
        severity={verificationAlertMessage?.messageType}
      ></CommonSnackBar>
    </>
  );
};

export default TravelDetails;
