'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import StartTravelKey from './StartTravelKey';
import StartTravelPhotos from './StartTravelPhotos';

const StartTravel = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { userId: guestId, travelId: reservationId } = useParams<{ userId: string; travelId: string }>();
  const searchParams = useSearchParams(); //key-received, photos
  const endView = searchParams.get('view');

  const { travelDetails } = useProfileInfoContext();

  const { data } = useTravelDetails();

  const handleTravelView = (redirectType: string) => {
    if (endView === 'key-received') {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/${pathName}?view=photos`);
    }
    if (endView === 'photos') {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/profile/${guestId}/travels/details/${reservationId}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {endView === 'key-received' && (
        <StartTravelKey
          isTravelStarted={travelDetails?.isTripStarted}
          pickupInformation={travelDetails?.carInfo?.guidelines?.pickupInformation}
        ></StartTravelKey>
      )}
      {endView === 'photos' && <StartTravelPhotos></StartTravelPhotos>}
    </div>
  );
};

export default StartTravel;
