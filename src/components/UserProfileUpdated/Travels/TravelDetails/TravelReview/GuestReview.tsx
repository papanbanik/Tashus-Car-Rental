'use client';

import CommonExpandText from '@/components/Common/CommonExpandText';
import { Rating } from '@/components/Common/Rating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { Avatar } from '@mui/material';

const GuestReview = () => {
  const { guestReview } = useReviewRatingContext();
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  // console.log(updatedTravelData);
  return (
    <div className=" relative">
      {guestReview?.guestReviewStatus && (
        <>
          <div className=" absolute left-0 top-1/2 transform -translate-y-1/2">
            <Avatar src={travelDetails?.guestInfo?.profilePhoto} sx={{ width: 60, height: 60 }} />
          </div>
          <div className="flex flex-row items-center bg-white p-4 rounded-lg ml-8">
            <div className="flex flex-col ml-6">
              <div className="flex flex-row items-center">
                <span className="font-bold pr-4">
                  {updatedTravelData?.isUserGuest
                    ? 'Your Review'
                    : `${updatedTravelData?.oppositeUserInfo?.firstName} ${updatedTravelData?.oppositeUserInfo?.lastName}`}
                </span>
                <Rating initialRating={guestReview?.hostRating?.averageRating} />
              </div>
              {guestReview?.hostComment?.comment !== '' && (
                //   <span className="text-accent">No Comment</span>
                // ) : (
                <>
                  <CommonExpandText className="text-justify" maxLines={2} text={guestReview?.hostComment?.comment} />
                </>
              )}
            </div>
          </div>
        </>
      )}
      {/* : (
         <>
           <Alert className="bg-neutral" severity="info">{`You did not provide any review yet`}</Alert>
         </>
       )} */}
    </div>
  );
};

export default GuestReview;
