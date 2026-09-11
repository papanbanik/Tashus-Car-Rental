'use client';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReservationDetails } from '@/hooks/reservation/useReservationDetails';
import { useReservationList } from '@/hooks/reservation/useReservationList';
// import { useReviewDetails } from '@/hooks/review-ratings/useReviewDetails';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { useTravelList } from '@/hooks/travel/useTravelList';
import { Skeleton, useMediaQuery } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GuestReview from './GuestReview/GuestReview';
import HostReview from './HostReview/HostReview';

const Review = () => {
  // useReviewDetails();
  useTravelList();
  useTravelDetails();
  useReservationList();
  useReservationDetails();
  // const params = useParams();
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  // console.log(params);
  const { userId, reservationId } = useParams<{ userId: string; reservationId: string }>();
  // const userId = params['user-id'];
  // const reservationId = params['reservation-id'];
  const { travelDetails } = useProfileInfoContext();
  // console.log(travelDetails);

  const [view, setView] = useState('');

  useEffect(() => {
    // const isGuest = travelList?.some((item: any) => item?.reservationId === parseInt(params['reservation-id']));
    // const isHost = reservationList?.some((item: any) => item?.reservationId === parseInt(params['reservation-id']));
    const isGuest = userId === travelDetails?.guestId;
    const isHost = userId === travelDetails?.partnerId;
    let updatedView = '';
    if (isHost) {
      updatedView = 'host';
    } else if (isGuest) {
      updatedView = 'guest';
    }
    if (isGuest || isHost) {
      const url = `/reviews/${reservationId}/${userId}?view=${updatedView}`;
      router.push(url);
    }
    setView(updatedView);
  }, [travelDetails, router, userId, reservationId]);

  return (
    <div className="container mx-auto lg:p-10 md:p-6 p-2">
      {/* <GuestReview /> */}
      {view === 'guest' ? (
        <GuestReview />
      ) : view === 'host' ? (
        <HostReview />
      ) : (
        <>
          <Skeleton className="mt-24" />
          <Skeleton animation="wave" />
        </>
      )}
    </div>
  );
};

export default Review;
