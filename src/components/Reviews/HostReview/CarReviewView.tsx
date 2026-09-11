'use client';
import { Rating } from '@/components/Common/Rating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { Avatar, Typography } from '@mui/material';

const CarReviewView = () => {
  const { travelDetails } = useProfileInfoContext();
  const { guestReview } = useReviewRatingContext();
  return (
    <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 mt-4 lg:gap-8">
      <div className="flex flex-col  md:max-w-[100px]">
        <Avatar src={travelDetails?.coverPhoto?.secureUrl} sx={{ width: 100, height: 100 }} variant="rounded" />
        <span className="font-bold my-2">{travelDetails?.carInfo?.car?.model}</span>
      </div>
      <div>
        <div className="flex items-center">
          <Typography className="mr-2 font-bold">Ratings: </Typography>
          <Rating initialRating={guestReview?.carRating?.averageRating} />
        </div>
        <Typography className="my-4 font-bold">Review</Typography>
        <span>{guestReview?.carComment?.comment}</span>
      </div>
    </div>
  );
};

export default CarReviewView;
