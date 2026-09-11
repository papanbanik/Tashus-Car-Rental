'use client';
import TravelDurationInfo from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelDurationInfo';
import EditCurrentTravelM from '@/components/UserProfileUpdated/Travels/TravelPriceUpdated/EditCurrentTravelM';
import EditUpcomingTravelM from '@/components/UserProfileUpdated/Travels/TravelPriceUpdated/EditUpcomingTravelM';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { EReservationStatus } from '@/types/travels/travelEnums';
import { isGuestRestrict, isGuestSuspended } from '@/utils/Functions/accountStatusCommonFn';
import { handleRemoveLastSlashTextFromPath } from '@/utils/Functions/randomCommonFn';
import { isTravelCurrent } from '@/utils/Functions/travelCommonFn';
import { dayjsUtc, utcCurrentTime } from '@/utils/Functions/utcCommonFn';
import { reservationCancelledStatus, reservationPendingStatus } from '@/utils/Lists/travelInfoList';
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton/IconButton';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

const PageGuestTravelEdit = () => {
  const { travelDetails, guestAccess } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const { data } = useTravelDetails();
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();
  const { pickupDate, returnDate, paymentStatus } = updatedTravelData ?? {};
  const { tripInformation, reservationStatus } = travelDetails ?? {};
  const { carKeyReceived = false, tripEndingInfo } = tripInformation ?? {};
  const { isEndedByGuest = false, isEndedByPartner = false, isEndedByAdmin = false } = tripEndingInfo ?? {};
  useEffect(() => {
    if (pickupDate) {
      const checkIsTravelCurrent = isTravelCurrent(pickupDate, isEndedByGuest, reservationStatus);
      if (checkIsTravelCurrent) {
        setIsCurrent(checkIsTravelCurrent);
      }
    }
  }, [updatedTravelData]);

  const handleEditTravelBackButton = () => {
    const removedLastSlashText = handleRemoveLastSlashTextFromPath(pathName);
    router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/${removedLastSlashText}`);
  };
  const isGuestNotAllowed = isGuestRestrict(guestAccess) || isGuestSuspended(guestAccess);
  const isEndDayPassed = carKeyReceived ? false : utcCurrentTime?.formattedTimeDayObj.isAfter(dayjsUtc(returnDate), 'minute');
  const isTravelEnded = isEndedByGuest ?? isEndedByPartner ?? isEndedByAdmin;
  const isPending = reservationPendingStatus.includes(paymentStatus);
  const isTravelCancelled = reservationCancelledStatus?.includes(reservationStatus as EReservationStatus);
  const isUpdateNotAllowed = isPending || isEndDayPassed || isTravelCancelled || isGuestNotAllowed || isTravelEnded;

  const updateButtonTooltip = isGuestNotAllowed
    ? 'This guest is restricted or suspended. Travel updates are not allowed.'
    : isTravelCancelled
    ? 'This travel is cancelled and cannot be updated.'
    : isEndDayPassed
    ? 'The end date has already passed, so updating this travel is not allowed.'
    : isPending
    ? 'This travel is not paid yet. Only paid travels can be updated.'
    : '';

  return (
    <div className="w-full lg:px-72 md:px-12 px-2">
      <div className="flex items-center">
        <IconButton onClick={handleEditTravelBackButton} className="text-primary">
          <IoMdArrowRoundBack size={30} />
        </IconButton>
        <p className="text-2xl text-center font-semibold mt-0 mx-auto">Edit Your Travel</p>
      </div>

      <div className="w-full flex justify-between bg-[#E4E3E4] rounded-t-lg lg:px-20 md:px-8 px-2 py-4 md:mt-2">
        <TravelDurationInfo hideText={true}></TravelDurationInfo>
      </div>

      {isUpdateNotAllowed ? (
        <Alert severity="info">{updateButtonTooltip}</Alert>
      ) : (
        <>{isCurrent ? <EditCurrentTravelM /> : <EditUpcomingTravelM />}</>
      )}
    </div>
  );
};

export default PageGuestTravelEdit;
