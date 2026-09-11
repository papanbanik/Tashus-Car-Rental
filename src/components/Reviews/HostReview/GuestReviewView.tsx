'use client';
import { Rating } from '@/components/Common/Rating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { Avatar, Typography } from '@mui/material';
import CarReviewView from './CarReviewView';

const GuestReviewView = () => {
  const { travelDetails } = useProfileInfoContext();
  const { guestReview } = useReviewRatingContext();
  // console.log(guestReview);
  return (
    <div>
      <Typography className="font-bold mb-4 text-lg md:text-2xl">Review from Guest</Typography>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8">
        <div className="flex flex-col  md:max-w-[100px]">
          <Avatar
            src={travelDetails?.partnerInfo?.profilePhoto}
            sx={{ width: 100, height: 100 }}
            //   height: isSmallScreen ? 50 : 100,
            // }}
          />
          <span className="font-bold my-2 capitalize">{`${travelDetails?.partnerInfo?.firstName} ${travelDetails?.partnerInfo?.lastName}`}</span>
        </div>
        <div>
          <div className="flex items-center">
            <Typography className="mr-2 font-bold">Ratings: </Typography>
            <Rating initialRating={guestReview?.hostRating?.averageRating} />
          </div>
          <Typography className="my-4 font-bold">Review</Typography>
          <span>{guestReview?.hostComment?.comment}</span>
        </div>
      </div>
      {/* Car */}
      {/* <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4 md:w-1/2">
        <div className="flex flex-col">
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
      </div> */}
      <CarReviewView />
    </div>
  );
};

export default GuestReviewView;
