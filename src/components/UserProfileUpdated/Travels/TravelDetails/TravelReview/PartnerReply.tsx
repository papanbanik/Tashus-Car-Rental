'use client';

import CommonExpandText from '@/components/Common/CommonExpandText';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { Avatar } from '@mui/material';

const PartnerReply = () => {
  const { hostReview, hostResponse } = useReviewRatingContext();
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  // console.log(updatedTravelData);
  // console.log(hostResponse);
  return (
    <div className=" relative">
      {hostReview?.hostReviewStatus && (
        <>
          <div className=" absolute left-0 top-1/2 transform -translate-y-1/2">
            <Avatar src={travelDetails?.partnerInfo?.profilePhoto} sx={{ width: 60, height: 60 }} />
          </div>
          <div className="flex flex-row items-center bg-secondary p-4 rounded-lg ml-8">
            <div className="flex flex-col ml-6">
              <div className="flex flex-row items-center">
                <span className="font-bold pr-4">
                  {!updatedTravelData?.isUserGuest ? 'Your Response' : `${updatedTravelData?.oppositeUserInfo?.lastName}'s Response`}
                </span>
                {/* <Rating initialRating={hostReview?.guestRating?.averageRating} /> */}
              </div>
              {hostResponse?.comment !== '' && hostResponse?.comment !== undefined && (
                <>
                  <CommonExpandText className="text-justify" maxLines={2} text={hostResponse?.comment} />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerReply;
