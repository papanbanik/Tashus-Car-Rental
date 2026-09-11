'use client';

import CommonAccStatusAlert from '@/components/Common/CommonAccStatusAlert';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { isGuestRestrict, isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { Tab, Tabs } from '@mui/material';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineLine } from 'react-icons/ai';
import TravelOdometer from './TravelOdometer';
import TravelSectionHeader from './TravelSectionHeader';
import TravelUploadedPhotos from './TravelUploadedPhotos';

interface ReservationProps {
  isTravelUpdatedPage?: boolean;
}

const ReservationPhotos = ({ isTravelUpdatedPage }: ReservationProps) => {
  const router = useRouter();
  const pathName = usePathname();

  const [activeTab, setActiveTab] = useState<'pickup' | 'return'>('pickup');

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: 'pickup' | 'return') => {
    setActiveTab(newValue);
  };

  const { travelDetails, guestAccess, partnerAccess } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const { data } = useTravelDetails();

  const handleUploadPickupPhotos = () => {
    if (pathName?.includes('travels') && updatedTravelData?.isUserGuest) {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/start-travel?view=photos`);
    }

    if (pathName?.includes('reservations') && !updatedTravelData?.isUserGuest) {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=upload-pickup-photos`);
    }
  };

  const handleUploadReturnPhotos = () => {
    if (pathName?.includes('travels') && updatedTravelData?.isUserGuest) {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}/end-travel?view=photos`);
    }

    if (pathName?.includes('reservations') && !updatedTravelData?.isUserGuest) {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=upload-return-photos`);
    }
  };

  // console.log(
  //   updatedTravelData?.travelType === 'upcoming',
  //   travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest && dayjs().diff(dayjs(travelDetails?.tripInformation?.endTime), 'month') >= 1
  // );

  // console.log(dayjs().diff(dayjs(travelDetails?.tripInformation?.endTime), 'month'));

  // const isTravelEnded =
  //   travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest || travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin;

  const isButtonDisabled =
    dayjs().diff(dayjs(updatedTravelData?.returnDate), 'month') >= 1 ||
    (pathName.includes('travels') && isGuestRestrict(guestAccess)) ||
    (pathName.includes('reservations') && isPartnerRestrict(partnerAccess));

  return (
    <div className={`${isTravelUpdatedPage ? 'p-5' : 'grid grid-cols-1 shadow-lg shadow-secondary bg-neutral md:p-8 p-4 rounded-lg'}`}>
      {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
      <TravelSectionHeader title="Photos"></TravelSectionHeader>

      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
        <Tab className="normal-case text-black font-bold" label="Pickup Photos" value="pickup" />
        <AiOutlineLine size={35} className="transform rotate-90 text-primary" />
        <Tab className="normal-case text-black font-bold" label="Return Photos" value="return" />
      </Tabs>

      {activeTab === 'pickup' && (
        <div className="mt-6">
          <TravelUploadedPhotos
            handleFunc={handleUploadPickupPhotos}
            buttonText="Upload Pickup Photos"
            guestPhotos={travelDetails?.tripInformation?.guestInitialConditionPhotos ?? []}
            partnerPhotos={travelDetails?.tripInformation?.partnerInitialConditionPhotos ?? []}
            disableButton={isButtonDisabled}
            helpingText="Pickup photos can be uploaded within a time window extending from 2 hours prior to the scheduled pickup time up to 1 month following the
            completion of the travel."
          ></TravelUploadedPhotos>
        </div>
      )}

      {activeTab === 'return' && (
        <div className="mt-6">
          <TravelUploadedPhotos
            handleFunc={handleUploadReturnPhotos}
            buttonText="Upload Return Photos"
            guestPhotos={travelDetails?.tripInformation?.guestTravelEndPhotos ?? []}
            partnerPhotos={travelDetails?.tripInformation?.partnerTravelEndPhotos ?? []}
            disableButton={isButtonDisabled}
            helpingText="Return photos can be uploaded within a time window extending from travel completion time up to 1 month following the
            completion of the travel."
          ></TravelUploadedPhotos>
        </div>
      )}

      {travelDetails?.isTripStarted && !isTravelUpdatedPage && <TravelOdometer></TravelOdometer>}
    </div>
  );
};

export default ReservationPhotos;
