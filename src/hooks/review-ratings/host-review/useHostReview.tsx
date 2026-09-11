'use client';

import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type HostReview = {
  userId: string;
  //   review: any;
  guestRating: any;
  carReviewComment: string | undefined;
  userReviewComment: string | undefined;
  reservationId: any;
};

const addHostReview = async ({ userId, guestRating, carReviewComment, userReviewComment, reservationId }: HostReview) => {
  const response = await axiosClient.post(`${apiUrl}/reservation/host-review/${reservationId}`, {
    userId,
    guestRating,
    carReviewComment,
    userReviewComment,
  });
  return response;
};

export const useHostReview = () => {
  const { hostReview, setHostReview, setHostResponse } = useReviewRatingContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, guestRating, carReviewComment, userReviewComment, reservationId }: HostReview) =>
      addHostReview({ userId, guestRating, carReviewComment, userReviewComment, reservationId }),
    onSuccess: (data) => {
      // console.log(data);
      const result = data?.data?.data[0] ?? null;
      const hostReviewData = result?.userReview?.host;
      const hostRate = result?.hostRating;
      const guestStatus = result?.guestReviewed;
      const hostStatus = result?.hostReviewed;
      const carReply = result?.carReview?.host;
      setHostReview({
        guestRating: hostRate,
        guestComment: hostReviewData,
        guestReviewStatus: guestStatus,
        hostReviewStatus: hostStatus,
      });
      setHostResponse(carReply);
      openSnackBar({
        message: data?.data?.message || 'Review Saved Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
    },
    onError: (error: any) => {
      console.log('useHostReview mutation error', error);
      openSnackBar({
        message: error?.response?.data?.message || error?.message || 'Error Saving the Review',
        severity: 'error',
      });
      return error;
    },
  });
};
