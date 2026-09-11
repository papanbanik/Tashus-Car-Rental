'use client';

import CommonRating from '@/components/Common/HookFormFields/CommonRating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Avatar, TextField, Typography, useMediaQuery } from '@mui/material';

// const ReviewHost = () => {
const ReviewHost = ({ register, control, watch }: HookFormComponentProps) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { travelDetails } = useProfileInfoContext();
  // console.log(travelDetails);
  const hostReview = watch('userReviewComment');
  return (
    <div>
      <Typography className="font-bold mb-8">Review for the Partner</Typography>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8">
        <div className="flex flex-col md:max-w-[100px]">
          <Avatar src={travelDetails?.partnerInfo?.profilePhoto} sx={{ width: 100, height: 100 }} />
          <span className="font-bold my-2 capitalize">{`${travelDetails?.partnerInfo?.firstName} ${travelDetails?.partnerInfo?.lastName}`}</span>
        </div>
        <div>
          <div className="flex items-center">
            <Typography className="mr-2 font-bold">Ratings: </Typography>
            <CommonRating control={control} required={true} registerName="hostRating.averageRating" />
          </div>
          <Typography className="my-4 font-bold">Write a review</Typography>
          <TextField
            // id="userReviewComment"
            label="Review"
            fullWidth
            multiline
            rows={4}
            {...register('userReviewComment')}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewHost;
