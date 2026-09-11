'use client';

import { Rating } from '@/components/Common/Rating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { Avatar, Typography } from '@mui/material';

const HostReviewView = () => {
  const { hostReview } = useReviewRatingContext();
  //   console.log(hostReview);
  const { vehicleDetails } = useProfileInfoContext();
  //   console.log(vehicleDetails);
  return (
    <div>
      <Typography className="font-bold mb-4 text-lg md:text-2xl">Review from Partner</Typography>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8">
        <div className="flex flex-col">
          <Avatar src={vehicleDetails?.guestInfo?.profilePhoto} sx={{ width: 100, height: 100 }} />
          <span className="font-bold my-2 capitalize">{`${vehicleDetails?.guestInfo?.firstName} ${vehicleDetails?.guestInfo?.lastName}`}</span>
        </div>
        <div>
          <div className="flex items-center">
            <Typography className="mr-2 font-bold">Ratings: </Typography>
            <Rating initialRating={hostReview?.guestRating?.averageRating} />
          </div>
          <Typography className="font-bold">Review: </Typography>
          <span>{hostReview?.guestComment?.comment}</span>
        </div>
      </div>
    </div>
  );
};

export default HostReviewView;
