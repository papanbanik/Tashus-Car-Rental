import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useReviewRatingContext } from '@/context/ReviewRatingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { useReviewDetails } from '@/hooks/review-ratings/useReviewDetails';
import { TOppositeUserInfo } from '@/types/travels/typeTravels';
import { isGuestRestrict, isPartnerRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { formatToMonthYear } from '@/utils/Functions/dateTimeCommonFn';
import { Avatar, Button } from '@mui/material';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { IoIosCall } from 'react-icons/io';

export interface IOppositeUserInfo {
  userInfo: TOppositeUserInfo;
}

const OppositeUserInfo = ({ userInfo }: IOppositeUserInfo) => {
  const { userId, travelId, reservationId: reservationIdParam } = useParams<{ userId: string; travelId: string; reservationId: string }>();
  const pathName = usePathname();
  const reservationId = travelId || reservationIdParam;
  // const userId = params['host-profile-id'];
  const { openModal } = useModalContext();
  const { updatedTravelData } = useTravelContext();
  const { data } = useReviewDetails();
  const { additionalDrivers, setAdditionalDrivers } = useSearchContext();
  const { travelDetails, guestAccess, partnerAccess } = useProfileInfoContext();
  const { redirectToReview, guestReview, hostReview, setGuestReview, setHostReview } = useReviewRatingContext();
  const [reviewText, setReviewText] = useState<string>('');
  useEffect(() => {
    if (userId && reservationId) {
      const reviewStatus = updatedTravelData?.isUserGuest ? guestReview?.guestReviewStatus : hostReview?.hostReviewStatus;
      setReviewText(reviewStatus ? 'Edit Review' : 'Add Review');
    }
  }, [userId, reservationId, updatedTravelData, guestReview, hostReview]);
  //Display Additional
  useEffect(() => {
    setAdditionalDrivers([]);
  }, []);

  useEffect(() => {
    // console.log(travelDetails?.additionalDrivers);
    if ((pathName.includes('travels') || pathName.includes('reservations')) && travelDetails?.additionalDrivers?.length > 0) {
      const newDrivers = travelDetails?.additionalDrivers.map(({ requestId, isActive, status, _id, createdAt, updatedAt, ...rest }: any) => ({
        _id,
        isActive,
        requestId,
        status,
        createdAt,
        updatedAt,
        ...rest,
      }));
      const keepLatestOccurrence = (drivers: any) => {
        const latestOccurrenceMap = new Map();
        drivers.forEach((driver: any) => {
          latestOccurrenceMap.set(driver.email, driver);
        });
        return Array.from(latestOccurrenceMap.values());
      };

      const filteredDrivers = keepLatestOccurrence(newDrivers);
      // console.log(filteredDrivers);
      const filteredActiveDrivers = filteredDrivers.filter((driver: any) => driver.isActive === true);

      // console.log(filteredActiveDrivers);
      setAdditionalDrivers(filteredActiveDrivers);
    }
  }, [travelDetails, pathName]);

  return (
    <div>
      <div className="md:flex justify-between items-end mt-8">
        <div className="flex">
          <Avatar src={userInfo?.profilePhoto} sx={{ width: 80, height: 80 }} />
          <div className="flex flex-col ml-2">
            <Link target="_blank" href={`${!!userInfo?.username ? `/user/${userInfo?.username}` : '#'}`} className="no-underline text-primary">
              <span className="font-bold">{`${userInfo?.firstName} ${userInfo?.lastName}`}</span>
            </Link>
            <span>
              {updatedTravelData?.isUserGuest ? (
                <>
                  {userInfo?.hostTotalTrips} {`Travel${userInfo?.hostTotalTrips || 0 > 1 ? 's' : ''} `}
                </>
              ) : (
                <>
                  {userInfo?.guestTotalTrips} {`Travel${userInfo?.guestTotalTrips || 0 > 1 ? 's' : ''} `}
                </>
              )}
              <BsDot /> {formatToMonthYear(userInfo?.joinedDate)}
            </span>
            <span className="flex flex-row font-bold text-md gap-2">
              <IoIosCall size={24} className="text-primary" />
              <span> {userInfo?.phoneNumber || 'Not Provided'}</span>
            </span>
            {/* <span>Typically responds in 12 minutes</span> */}
            {/* <span>
            <Rating initialRating={4.6} />
          </span> */}
          </div>
        </div>

        <div className="md:mt-0 mt-4">
          {/* <span className="flex flex-row font-bold text-lg gap-2">
          <IoIosCall size={30} className="text-primary" />
          <span> {userInfo?.phoneNumber || 'Not Provided'}</span>
        </span> */}

          {updatedTravelData?.travelType === 'past' && (
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
          )}

          {/* <div className=" flex justify-center items-center mt-2">
          <Button fullWidth className="normal-case text-white bg-primary font-bold">
            Message
          </Button>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default OppositeUserInfo;
