'use client';

import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getReviewDetails = async (reservationId: number | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/review-rating/${reservationId}`);
  // console.log('Review Response', response);
  return response;
};

export const useReviewDetails = () => {
  const { setGuestReview, setHostReview, setHostResponse } = useReviewRatingContext();
  // console.log(guestReview);
  const { travelId, reservationId: reservationIdParam } = useParams<{ travelId: string; reservationId: string }>();
  const reservationID = parseInt(travelId) || parseInt(reservationIdParam);
  return useQuery({
    queryKey: ['review-details', { reservationID }],
    queryFn: () => getReviewDetails(reservationID),
    enabled: !!reservationID,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data);
      // console.log(data?.data?.data);
      if (data?.data?.data.length > 0) {
        const result = data?.data?.data[0] ?? null;
        //For set Guest
        const guestReview = result?.userReview?.guest;
        const carReview = result?.carReview?.guest;
        const guestRate = result?.guestRating;
        const carRate = result?.carRating;
        const hostStatus = result?.hostReviewed;
        //For Set Host
        const hostReview = result?.userReview?.host;
        const hostRate = result?.hostRating;
        const guestStatus = result?.guestReviewed;
        //For Host Response
        const carReply = result?.carReview?.host;
        //console.log(guestReview, carReview, carRate, guestRate, hostStatus);
        setGuestReview({
          hostRating: guestRate,
          hostComment: guestReview,
          carRating: carRate,
          carComment: carReview,
          hostReviewStatus: hostStatus,
          guestReviewStatus: guestStatus,
        });
        setHostReview({
          guestRating: hostRate,
          guestComment: hostReview,
          guestReviewStatus: guestStatus,
          hostReviewStatus: hostStatus,
        });
        setHostResponse(carReply);
      } else {
        setGuestReview({
          hostRating: 0,
          hostComment: '',
          carRating: 0,
          carComment: '',
          hostReviewStatus: false,
          guestReviewStatus: false,
        });
        setHostReview({
          guestRating: 0,
          guestComment: '',
          guestReviewStatus: false,
          hostReviewStatus: false,
        });
        setHostResponse('');
      }
    },
    onError: (err) => {
      console.log('useReviewDetails error', err);
      return err;
    },
  });
};
