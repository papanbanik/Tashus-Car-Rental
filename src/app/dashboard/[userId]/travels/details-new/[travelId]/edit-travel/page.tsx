'use client';
import TravelDurationInfo from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelDurationInfo';
import EditCurrentTravelM from '@/components/UserProfileUpdated/Travels/TravelPriceUpdated/EditCurrentTravelM';
import EditUpcomingTravelM from '@/components/UserProfileUpdated/Travels/TravelPriceUpdated/EditUpcomingTravelM';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { handleRemoveLastSlashTextFromPath } from '@/utils/Functions/randomCommonFn';
import { isTravelCurrent } from '@/utils/Functions/travelCommonFn';
import IconButton from '@mui/material/IconButton/IconButton';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

const PageGuestTravelEdit = () => {
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const { data } = useTravelDetails();
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (updatedTravelData?.pickupDate) {
      const checkIsTravelCurrent = isTravelCurrent(updatedTravelData?.pickupDate, travelDetails?.isEndedByGuest, travelDetails?.reservationStatus);

      if (checkIsTravelCurrent) {
        setIsCurrent(checkIsTravelCurrent);
        // console.log('current', updatedTravelData, checkIsTravelCurrent);
      }
    }
  }, [updatedTravelData]);

  const handleEditTravelBackButton = () => {
    const removedLastSlashText = handleRemoveLastSlashTextFromPath(pathName);
    router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/${removedLastSlashText}`);
  };

  return (
    <div className="w-full lg:px-72 md:px-12 px-2">
      {/* {process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? (
        <Alert severity="info" className="bg-cyan-100">
          Travel cannot be updated
        </Alert>
      ) : (
        <> */}
      <div className="flex items-center">
        <IconButton onClick={handleEditTravelBackButton} className="text-primary">
          <IoMdArrowRoundBack size={30} />
        </IconButton>
        <p className="text-2xl text-center font-semibold mt-0 mx-auto">Edit Your Travel</p>
      </div>

      <div className="w-full flex justify-between bg-[#E4E3E4] rounded-t-lg lg:px-20 md:px-8 px-2 py-4 md:mt-2">
        <TravelDurationInfo hideText={true}></TravelDurationInfo>
      </div>

      {isCurrent ? <EditCurrentTravelM /> : <EditUpcomingTravelM />}
      {/* </>
      )} */}
    </div>
  );
};

export default PageGuestTravelEdit;
