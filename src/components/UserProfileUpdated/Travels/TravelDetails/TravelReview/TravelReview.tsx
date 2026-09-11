'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useReviewDetails } from '@/hooks/review-ratings/useReviewDetails';
import { isReviewEditExpired, isReviewExpired } from '@/utils/Functions/reviewRatingCommonFn';
import { Alert, Button } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import CarReview from './CarReview';
import GuestReview from './GuestReview';
import PartnerReply from './PartnerReply';
import PartnerReview from './PartnerReview';
import { useEffect, useState } from 'react';
import { isGuestRestrict, isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import dayjs from 'dayjs';

interface TravelReviewProps {
  isTravelUpdatedPage?: boolean;
}

const TravelReview = ({ isTravelUpdatedPage }: TravelReviewProps) => {
  useReviewDetails();
  const pathName = usePathname();
  const { travelDetails, guestAccess, partnerAccess } = useProfileInfoContext();
  const { userId, travelId, reservationId: reservationIdParam } = useParams<{ userId: string; travelId: string; reservationId: string }>();
  const reservationId = travelId || reservationIdParam;
  const { hostResponse, guestReview, hostReview, redirectToReview } = useReviewRatingContext();
  const { updatedTravelData } = useTravelContext();
  const [reviewText, setReviewText] = useState<string>('');
  const router = useRouter();
  // const params = useParams();
  // // console.log(params);
  // const hostID = params['host-profile-id'];
  // const reservationID = params['reservation-id'];
  const { userId: hostID, reservationId: reservationID } = useParams<{ userId: string; reservationId: string }>();
  // const handleRedirect = () => {
  //   router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/reviews/${reservationID}/${hostID}`);
  // };
  const handleRedirect = () => {
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/reviews/${reservationID}/${hostID}?editState=true`);
  };

  useEffect(() => {
    if (userId && reservationId) {
      const reviewStatus = updatedTravelData?.isUserGuest ? guestReview?.guestReviewStatus : hostReview?.hostReviewStatus;
      setReviewText(reviewStatus ? 'Edit Review' : 'Add Review');
    }
  }, [userId, reservationId, updatedTravelData, guestReview, hostReview]);

  // const daysDiffEndToCurrent2 = dayjs().diff(dayjs(travelDetails?.tripInformation?.endTime), 'day');
  const end = dayjs(travelDetails?.tripInformation?.endTime);
  const daysDiffEndToCurrent = end.isValid() ? dayjs().diff(end, 'day') : null;

  const isTravelEnded =
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByGuest ??
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByPartner ??
    travelDetails?.tripInformation?.tripEndingInfo?.isEndedByAdmin;

  return (
    <div className={isTravelUpdatedPage ? 'p-5' : ''}>
      <div className="flex justify-between items-baseline">
        <div className="md:text-2xl text-lg font-bold mb-6">
          Review Summary
          {!isTravelEnded ? (
            <span className="helping_text flex font-normal"> Reviews are accepted only once the trip has ended</span>
          ) : !isTravelEnded && daysDiffEndToCurrent !== null && daysDiffEndToCurrent > 15 ? (
            <span className="helping_text flex font-normal">Review time has expired. You can no longer submit new reviews</span>
          ) : (
            ''
          )}
        </div>

        {travelDetails?.partnerInfo && isTravelEnded && daysDiffEndToCurrent !== null && daysDiffEndToCurrent <= 15 && (
          <div className="md:mt-0 mt-4">
            {/* {updatedTravelData?.travelType === 'past' && ( */}
            <div className=" flex justify-center items-center mt-2">
              <Button
                onClick={() => redirectToReview(reservationId, userId)}
                disabled={
                  (pathName.includes('travels') && isGuestRestrict(guestAccess)) ||
                  (pathName.includes('reservation') && isPartnerRestrict(partnerAccess))
                }
                fullWidth
                className="normal-case text-white bg-primary font-bold md:w-32"
              >
                {reviewText}
              </Button>
            </div>
            {/* )} */}
          </div>
        )}
      </div>

      {(guestReview?.guestReviewStatus && guestReview?.hostReviewStatus) || isReviewExpired(travelDetails?.tripInformation?.endTime) ? (
        <>
          {/* Summary */}
          {(guestReview?.guestReviewStatus || guestReview?.hostReviewStatus) && (
            <>
              {/* <span className="md:text-2xl text-lg font-bold mb-6">Review Summary </span> */}
              <div className="my-6">
                <GuestReview />
              </div>
              <div className="mb-6">
                <PartnerReview />
              </div>
            </>
          )}
          {/* Vehicle */}
          {guestReview?.guestReviewStatus && (
            <>
              <span className="md:text-2xl text-lg font-bold my-6">Vehicle Review </span>
              <div className="my-6">
                <CarReview />
              </div>
              {hostResponse?.comment !== '' && hostResponse?.comment !== undefined ? (
                <div className="md:pl-[100px] pl-4">
                  <PartnerReply />
                </div>
              ) : (
                <>
                  {!updatedTravelData?.isUserGuest && (
                    <>
                      {guestReview?.carComment?.comment !== '' &&
                        (!isReviewExpired(travelDetails?.tripInformation?.endTime) || !isReviewEditExpired(hostResponse?.carComment?.createdAt)) && (
                          <div className="flex justify-end items-end">
                            <Button onClick={handleRedirect} className="bg-primary text-white normal-case font-bold">
                              Reply
                            </Button>
                          </div>
                        )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Alert className="bg-neutral" severity="info">{` ${
            isReviewExpired(travelDetails?.tripInformation?.endTime) ? 'No Reviews' : 'No Reviews Yet'
          }`}</Alert>
        </>
      )}
    </div>
  );
};

export default TravelReview;
