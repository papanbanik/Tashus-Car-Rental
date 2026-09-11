'use client';

import { useRouter } from 'next/navigation';
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
type ReviewRatingProviderProps = {
  children: ReactNode;
};

type GuestReviewRating = {
  hostRating: any;
  hostComment: any;
  carRating: any;
  carComment: any;
  hostReviewStatus: boolean;
  guestReviewStatus: boolean;
};

type HostReviewRating = {
  guestRating: any;
  guestComment: any;
  guestReviewStatus: boolean;
  hostReviewStatus: boolean;
};

type ReviewRatingContextType = {
  hostReview: HostReviewRating;
  setHostReview: Dispatch<SetStateAction<HostReviewRating>>;
  guestReview: GuestReviewRating;
  setGuestReview: Dispatch<SetStateAction<GuestReviewRating>>;
  redirectToReview: (reservationId: string, userId: string) => void;
  hostResponse: any;
  setHostResponse: Dispatch<SetStateAction<any>>;
  vehicleReviews: any[];
  setVehicleReviews: Dispatch<SetStateAction<any[]>>;
};

export const ReviewRating = createContext<ReviewRatingContextType | undefined>(undefined);

export const useReviewRatingContext = (): ReviewRatingContextType => {
  const context = useContext(ReviewRating);
  if (!context) {
    throw new Error('useContext must be used within a ReviewRatingProvider');
  }
  return context;
};

export const ReviewRatingProvider: FC<ReviewRatingProviderProps> = ({ children }) => {
  const router = useRouter();
  const [hostReview, setHostReview] = useState<any>({
    guestRating: undefined,
    guestComment: undefined,
    guestReviewStatus: false,
    hostReviewStatus: false,
  });
  const [guestReview, setGuestReview] = useState<any>({
    hostRating: undefined,
    hostComment: undefined,
    carRating: undefined,
    carComment: undefined,
    hostReviewStatus: false,
    guestReviewStatus: false,
  });
  const [hostResponse, setHostResponse] = useState<any>(undefined);
  const [vehicleReviews, setVehicleReviews] = useState<any[]>([]);
  const redirectToReview = (reservationId: string, userId: string) => {
    if (reservationId && userId) {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/reviews/${reservationId}/${userId}`);
    }
  };

  const contextValue: ReviewRatingContextType = {
    hostReview,
    setHostReview,
    guestReview,
    setGuestReview,
    redirectToReview,
    hostResponse,
    setHostResponse,
    vehicleReviews,
    setVehicleReviews,
  };
  return <ReviewRating.Provider value={contextValue}>{children}</ReviewRating.Provider>;
};
