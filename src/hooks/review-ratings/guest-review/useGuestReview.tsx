'use client';

import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type GuestReview = {
  userId: string;
  //   review: any;
  carRating: any;
  hostRating: any;
  carReviewComment: string | undefined;
  userReviewComment: string | undefined;
  reservationId: any;
};

const addGuestReview = async ({ userId, carRating, hostRating, carReviewComment, userReviewComment, reservationId }: GuestReview) => {
  const response = await axiosClient.post(`${apiUrl}/reservation/guest-review/${reservationId}`, {
    userId,
    carRating,
    hostRating,
    carReviewComment,
    userReviewComment,
  });
  return response;
};

export const useGuestReview = () => {
  const { guestReview, setGuestReview } = useReviewRatingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, carRating, hostRating, carReviewComment, userReviewComment, reservationId }: GuestReview) =>
      addGuestReview({ userId, carRating, hostRating, carReviewComment, userReviewComment, reservationId }),
    onSuccess: (data) => {
      // console.log(data);
      const result = data?.data?.data[0] ?? null;
      const guestReviewData = result?.userReview?.guest;
      const carReview = result?.carReview?.guest;
      const guestRate = result?.guestRating;
      const carRate = result?.carRating;
      const hostStatus = result?.hostReviewed;
      const guestStatus = result?.guestReviewed;
      setGuestReview({
        hostRating: guestRate,
        hostComment: guestReviewData,
        carRating: carRate,
        carComment: carReview,
        hostReviewStatus: hostStatus,
        guestReviewStatus: guestStatus,
      });
      openSnackBar({
        message: data?.data?.message || 'Review Saved Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
    },
    onError: (error: any) => {
      console.log('useGuestReview mutation error', error);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error Saving the Review',
        severity: 'error',
      });
      return error;
    },
  });
};
