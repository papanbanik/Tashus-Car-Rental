import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { HookFormComponentProps } from '@/types/componentTypes';
import { TextField, Typography } from '@mui/material';

const HostReply = ({ register, control, watch }: HookFormComponentProps) => {
  const { guestReview } = useReviewRatingContext();
  return (
    <div>
      {guestReview?.carComment?.comment !== undefined && guestReview?.carComment?.comment !== '' && (
        <>
          <Typography className="mt-4 font-bold">Reply for Vehicle Review</Typography>
          <TextField label="Reply" fullWidth multiline rows={4} className="my-4" {...register('carReviewComment')} />
        </>
      )}
    </div>
  );
};

export default HostReply;
