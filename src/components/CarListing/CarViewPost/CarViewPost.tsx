'use client';

import VehicleDetails from '@/components/Common/VehicleDetails/VehicleDetails';
import { useCarListingContext } from '@/context/CarListingProvider';
import { HostDetailsType, useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useSaveCarViewPost } from '@/hooks/car-listing/useCarViewPost';
import { useProfileInfo } from '@/hooks/profile/useProfileInfo';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const CarViewPost = () => {
  const { listingId, getUpdatedSteps, updateCurrentStep } = useCarListingContext();
  const { setHostInfo } = useSearchContext();
  const { profileHookEnableKeys, setProfileHookEnableKeys } = useUserCredContext();
  const { data } = useProfileInfo();
  const { userCred } = useUserCredContext();
  const { mutateAsync: saveCarViewPost, isLoading, isSuccess } = useSaveCarViewPost();
  const carAvailabilityRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  // Function to scroll to the CarAvailability section
  const scrollToCarAvailability = () => {
    if (carAvailabilityRef.current) {
      carAvailabilityRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // useEffect(() => {
  //   updateCurrentStep();
  //   setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
  // }, []);
  useEffect(() => {
    if (userCred?.loggedIn && userCred?.userId) {
      updateCurrentStep();
      setProfileHookEnableKeys({ ...profileHookEnableKeys, enableUseProfileInfo: true });
    }
  }, [userCred?.userId]);

  useEffect(() => {
    if (data?.data?.data?.profileInfo) {
      const { firstName, lastName, picture, createdAt, hostTotalTrips, hostRatingCount, hostRatingTotal, username } = data?.data?.data?.profileInfo;
      // console.log(data?.data?.data?.profileInfo);
      const tempInfo: HostDetailsType = {
        firstName,
        lastName,
        joiningDate: new Date(createdAt),
        picture: {
          imageInfo: picture?.imageInfo,
        },
        hostTotalTrips,
        hostRatingCount,
        hostRatingTotal,
        username,
      };
      setHostInfo(tempInfo);
    }
  }, [data]);

  const handleButtonClick = async () => {
    if (typeof window !== 'undefined') {
      try {
        const tempSteps = await getUpdatedSteps(9);
        await saveCarViewPost({
          listingId: listingId,
          listingSteps: tempSteps,
        });
        router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/help/thankYouPage`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="px-4">
      <VehicleDetails isViewPost={true}></VehicleDetails>

      <div className="flex justify-center mt-8">
        <Button disabled={isLoading} type="submit" variant="contained" color="primary" onClick={handleButtonClick}>
          {isLoading ? 'Posting' : 'Post'}
        </Button>
      </div>
    </div>
  );
};

export default CarViewPost;
