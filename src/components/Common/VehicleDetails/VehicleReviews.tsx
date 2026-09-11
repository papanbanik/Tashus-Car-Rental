'use client';

import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useVehicleReviews } from '@/hooks/review-ratings/useVehicleReviews';
import { isReviewExpired } from '@/utils/Functions/reviewRatingCommonFn';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import GuestReviews from './VehicleReviews/GuestReviews';
import PartnerResponses from './VehicleReviews/PartnerResponses';
import CarDetailsSectionTitle from './CarDetailsSectionTitle';

const VehicleReviews = () => {
  useVehicleReviews();
  const { vehicleReviews } = useReviewRatingContext();
  const { userCred } = useUserCredContext();
  const userID = userCred?.userId;
  const { hostInfo } = useSearchContext();
  const isSmallDevice = useMediaQuery('(max-width:600px)');

  const filteredReviews = vehicleReviews.filter((review) => (review?.guestReviewed && review?.hostReviewed) || isReviewExpired(review?.createdAt));

  return (
    <div>
      <CarDetailsSectionTitle sectionTitle="Vehicle Reviews"></CarDetailsSectionTitle>

      {filteredReviews.length > 0 ? (
        <>
          {filteredReviews.map((review, index) => (
            <div key={index}>
              {/* Guest Info */}
              <div id="guest-review" className="my-4 z-10">
                <GuestReviews
                  guestImage={review?.guestInfo?.picture?.imageInfo?.secure_url}
                  guestName={`${review?.guestId === userID ? 'Your review' : `${review?.guestInfo?.firstName} ${review?.guestInfo?.lastName}`}`}
                  rating={review?.carRating?.averageRating}
                  reviewTime={`${
                    isSmallDevice
                      ? `${dayjs(review?.carRating?.createdAt).format('DD MMM, YY')}`
                      : `${dayjs(review?.carRating?.createdAt).format('DD MMMM, YYYY')}`
                  }`}
                  review={review?.carReview?.guest?.comment}
                />
              </div>
              {/* Host Reply */}
              {review?.carReview?.host?.comment !== '' && review?.carReview?.host?.comment !== undefined && (
                <div id="host-response" className="l_connector my-4 z-0 md:pl-20 pl-12">
                  {/* <div id="host-response" className="l_connector md:pl-[100px] pl-6 my-4"> */}
                  <PartnerResponses
                    partnerImage={hostInfo?.picture?.imageInfo?.secure_url}
                    partnerName={`${review?.hostId === userID ? 'Your response' : `${hostInfo?.firstName} ${hostInfo?.lastName}`}`}
                    reply={review?.carReview?.host?.comment}
                  />
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <span className="text-accent">No vehicle reviews yet</span>
      )}
    </div>
  );
};

export default VehicleReviews;
