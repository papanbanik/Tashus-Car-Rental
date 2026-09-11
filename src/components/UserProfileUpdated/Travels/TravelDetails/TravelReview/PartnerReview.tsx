'use client';

import CommonExpandText from '@/components/Common/CommonExpandText';
import { Rating } from '@/components/Common/Rating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { Avatar } from '@mui/material';

const PartnerReview = () => {
  const { hostReview } = useReviewRatingContext();
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
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
                  {updatedTravelData?.isUserGuest
                    ? `${updatedTravelData?.oppositeUserInfo?.firstName} ${updatedTravelData?.oppositeUserInfo?.lastName}`
                    : 'Your Review'}
                </span>
                <Rating initialRating={hostReview?.guestRating?.averageRating} />
              </div>
              {hostReview?.guestComment?.comment !== '' && (
                //   <span className="text-accent">No Comment</span>
                // ) : (
                <>
                  <CommonExpandText className="text-justify" maxLines={2} text={hostReview?.guestComment?.comment} />
                </>
              )}
            </div>
          </div>
        </>
      )}
      {/* : (
        <>
          <Alert className="bg-neutral" severity="info">{`Partner did not provide any review yet`}</Alert>
        </>
      )} */}
    </div>
  );
};

export default PartnerReview;
