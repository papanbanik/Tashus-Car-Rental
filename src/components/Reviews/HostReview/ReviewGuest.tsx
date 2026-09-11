'use client';

import CommonRating from '@/components/Common/HookFormFields/CommonRating';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { Avatar, TextField, Typography, useMediaQuery } from '@mui/material';

const ReviewGuest = ({ register, control, watch }: HookFormComponentProps) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { vehicleDetails } = useProfileInfoContext();
  // console.log(vehicleDetails);
  const guestReview = watch('userReviewComment');
  return (
    <div>
      <Typography className="font-bold mb-4">Review for the Guest</Typography>
      <div className="grid md:grid-cols-[auto,1fr] grid-cols-1 gap-4 lg:gap-8">
        <div className="flex flex-col">
          <Avatar src={vehicleDetails?.guestInfo?.profilePhoto} sx={{ width: 100, height: 100 }} />
          <span className="font-bold my-2 capitalize">{`${vehicleDetails?.guestInfo?.firstName} ${vehicleDetails?.guestInfo?.lastName}`}</span>
        </div>
        <div>
          <div className="flex items-center">
            <Typography className="mr-2 font-bold">Ratings: </Typography>
            <CommonRating control={control} required={true} registerName="guestRating.averageRating" />
          </div>
          <Typography className="mt-4 font-bold">Write a review</Typography>
          <TextField
            // id="userReviewComment"
            label="Review"
            // variant="outlined"
            fullWidth
            multiline
            rows={4}
            className="my-4"
            {...register('userReviewComment')}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewGuest;
