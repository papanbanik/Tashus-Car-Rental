'use client';

import CommonRating from '@/components/Common/HookFormFields/CommonRating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Avatar, TextField, Typography, useMediaQuery } from '@mui/material';
// const ReviewCar = () => {
const ReviewCar = ({ register, control, watch }: HookFormComponentProps) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { travelDetails } = useProfileInfoContext();
  // console.log(travelDetails);
  const carReview = watch('carReviewComment');
  // console.log(watch('carRating.averageRating'));
  return (
    <div>
      <Typography className="font-bold mb-8">Review for the Car</Typography>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8">
        <div className="flex flex-col md:max-w-[100px]">
          <Avatar src={travelDetails?.coverPhoto?.secureUrl} sx={{ width: 100, height: 100 }} variant="rounded" />
          <span className="font-bold my-2">{travelDetails?.carInfo?.car?.model}</span>
        </div>
        <div>
          <div className="flex items-center">
            <Typography className="mr-2 font-bold">Ratings: </Typography>
            <CommonRating control={control} required={true} registerName="carRating.averageRating" />
          </div>
          <Typography className="my-4 font-bold">Write a review</Typography>
          <TextField label="Review" fullWidth multiline rows={4} {...register('carReviewComment')} />
        </div>
      </div>
    </div>
  );
};

export default ReviewCar;
