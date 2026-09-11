import { separateFullName } from '@/utils/Functions/randomCommonFn';
import dayjs from 'dayjs';
import {
  OptimizedUserPublicProfileResponse,
  TBasicPublicProfileInfo,
  TBasicVehicleInfo,
  TGuestReviewRating,
  TReviewRating,
  TUserPublicProfile,
} from '../../types/publicProfileTypes';

const generateHostReviews = (reviews: TReviewRating[]): TGuestReviewRating[] => {
  const sortedReviews = reviews.sort((a, b) => {
    const aTime = a.guestRating?.createdAt;
    const bTime = b.guestRating?.createdAt;
    const aDate = aTime ? new Date(dayjs(aTime).toDate()) : new Date(0);
    const bDate = bTime ? new Date(dayjs(bTime).toDate()) : new Date(0);
    return bDate.getTime() - aDate.getTime();
  });
  return sortedReviews.map((review) => {
    const guestName = `${review?.guestInfo?.firstName} ${review?.guestInfo?.lastName}`;
    const guestImage = review?.guestInfo?.picture?.imageInfo?.secure_url ?? '';
    const rating = review?.guestRating?.averageRating;
    const reviewTime = review?.guestRating?.createdAt;
    const reviewComment = review?.userReview?.guest?.comment;
    return {
      guestImage,
      guestName,
      rating,
      review: reviewComment,
      reviewTime,
      carListingId: review?.carListingId,
    };
  });
};

const generateGuestReviews = (reviews: TReviewRating[]): TGuestReviewRating[] => {
  const sortedReviews = reviews.sort((a, b) => {
    const aTime = a.hostRating?.createdAt;
    const bTime = b.hostRating?.createdAt;
    const aDate = aTime ? new Date(dayjs(aTime).toDate()) : new Date(0);
    const bDate = bTime ? new Date(dayjs(bTime).toDate()) : new Date(0);
    return bDate.getTime() - aDate.getTime();
  });
  return sortedReviews.map((review) => {
    const hostName = `${review?.hostInfo?.firstName} ${review?.hostInfo?.lastName}`;
    const hostImage = review?.hostInfo?.picture?.imageInfo?.secure_url ?? '';
    const rating = review?.hostRating?.averageRating;
    const reviewTime = review?.hostRating?.createdAt;
    const reviewComment = review?.userReview?.host?.comment;
    return {
      hostImage,
      hostName,
      rating,
      review: reviewComment,
      reviewTime,
      carListingId: review?.carListingId,
    };
  });
};

export const generateOptimizedUserPublicProfile = (userProfile: TUserPublicProfile): OptimizedUserPublicProfileResponse => {
  const {
    fullName,
    picture,
    isEmailVerified: emailVerified,
    isPhoneVerified,
    guestTotalTrips = 0,
    hostTotalTrips = 0,
    joinedAt,
    vehicleList = [],
    reviewsFromGuest = [],
    reviewsFromHost = [],
  } = userProfile ?? {};
  const { firstName = '', lastName = '' } = separateFullName(fullName);
  const isEmailVerified = typeof emailVerified === 'boolean' ? emailVerified : false;

  const basicProfileInfo: TBasicPublicProfileInfo = {
    firstName,
    lastName,
    pictureUrl: picture?.imageInfo?.secure_url ?? '',
    isEmailVerified,
    isPhoneVerified,
    guestTrips: guestTotalTrips,
    hostReservation: hostTotalTrips,
    joinedAt,
  };

  // Map vehicleList to TBasicVehicleInfo
  const userVehicleList: TBasicVehicleInfo[] = vehicleList?.map((vehicle) => ({
    listingId: vehicle?.listingId,
    carName: `${vehicle?.car?.make ?? ''} ${vehicle?.car?.model ?? ''}`,
    carType: vehicle?.car?.carType ?? '',
    carNickName: vehicle?.carNickName ?? '',
    totalTrips: vehicle?.totalTrips ?? 0,
    totalRatings: vehicle?.totalRatings ?? 0,
    ratingsReceivedFrom: vehicle?.ratingsReceivedFrom ?? 0,
    hourlyRates: vehicle?.rates?.hourlyRates?.amount ?? 0,
    dailyRates: vehicle?.rates?.dailyRates?.amount ?? 0,
    photos: vehicle?.photos?.coverPhoto?.imageInfo?.secure_url ?? '',
    location: `${vehicle?.location?.pickupAddress?.city ?? ''} ${vehicle?.location?.pickupAddress?.postalCode ?? ''}, ${
      vehicle?.location?.pickupAddress?.country ?? ''
    }`,
  }));
  // Generate optimized reviews (sorted by latest first)
  const hostReviews = generateGuestReviews(reviewsFromGuest);
  const guestReviews = generateHostReviews(reviewsFromHost);
  // Return the optimized response
  return {
    basicProfileInfo,
    userVehicleList,
    hostReviews,
    guestReviews,
  };
};
