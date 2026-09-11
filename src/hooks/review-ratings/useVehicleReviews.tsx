'use client';

import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getVehicleReviews = async (listingId: number | undefined) => {
  const response = await axios.get(`${apiUrl}/reservation/car-reviews/${listingId}`);
  // console.log('Review Response', response);
  return response;
};

export const useVehicleReviews = () => {
  const { setVehicleReviews } = useReviewRatingContext();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const listingID = parseInt(vehicleId);
  return useQuery({
    queryKey: ['vehicle-reviews', { listingID }],
    queryFn: () => getVehicleReviews(listingID),
    enabled: !!listingID,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      //   console.log(data);
      //   console.log(data?.data);
      //   console.log(data?.data?.data);
      if (data?.data?.data.length > 0) {
        setVehicleReviews(data?.data?.data);
      } else {
        setVehicleReviews([]);
      }
    },
    onError: (err) => {
      console.log('useReviewDetails error', err);
      return err;
    },
  });
};
