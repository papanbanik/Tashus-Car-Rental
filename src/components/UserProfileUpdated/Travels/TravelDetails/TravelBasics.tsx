'use client';

import { useTravelContext } from '@/context/TravelProvider';
import useMediumForTravelDetails from '@/hooks/responsive/useMediumForTravelDetails';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BiSupport } from 'react-icons/bi';
import TravelDurationInfo from './TravelDurationInfo';

const TravelBasics = () => {
  const { travelId, reservationId: reservationIdParam } = useParams<{ travelId: string; reservationId: string }>();
  const reservationId = travelId || reservationIdParam;
  const isMedium = useMediumForTravelDetails();
  const { updatedTravelData } = useTravelContext();

  return (
    <div
      className={`${
        isMedium ? 'md:grid-cols-2 grid-cols-3 md:gap-8 gap-2' : 'grid-cols-4'
      } grid  bg-white shadow-lg shadow-secondary rounded-lg md:p-4 px-2 w-full justify-between items-center md:my-6 mb-3`}
    >
      <div className="relative md:col-span-1 col-span-2 lg:mr-4 font-thin">
        {/* <span className="flex justify-start w-2/3 my-2 bg-primary text-white p-2 rounded-r-3xl">XYZ's Reservation</span> */}
        <div
          className="z-10 relative bg-primary text-white p-2 w-full text-xs flex flex-col"
          style={{
            // clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)',
            clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
            zIndex: 100,
          }}
        >
          <span className="m-0">Reserved: {formatFullDateTime(updatedTravelData?.reservedAt)}</span>
          {updatedTravelData?.reservedAt !== updatedTravelData?.createdAt && (
            <span className="m-0">Updated: {formatFullDateTime(updatedTravelData?.createdAt)}</span>
          )}

          {/* {updatedTravelData?.isUserGuest ? 'Your Reservation' : `${updatedTravelData?.oppositeUserInfo?.lastName}'s Reservation`} */}
        </div>
      </div>

      {!isMedium && (
        <div className="col-span-2 flex justify-between items-center">
          <TravelDurationInfo></TravelDurationInfo>
        </div>
      )}

      <div className="flex justify-end items-center col-span-1 ">
        <Link
          href={`/support/support-center/${reservationId}?role=${travelId ? 'guest' : 'host'}&from=${travelId ? 'travel' : 'reservation'}`}
          // target="_blank"
        >
          <Button className="search text-white normal-case font-bold text-md" variant="contained" startIcon={<BiSupport />}>
            Support
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TravelBasics;
