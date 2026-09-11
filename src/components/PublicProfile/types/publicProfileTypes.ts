import { TDate } from '../../../types/commonTypes';

type TProfileSummary = {
  partner: string;
  guest: string;
};

type TProfilePic = {
  imageInfo: {
    secure_url?: string;
  };
  status?: string;
};

type TImageInfo = {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  originalWidth: number;
  originalHeight: number;
};

type TPhoto = {
  imageInfo: TImageInfo;
  storageProvider: string;
};

type TContactDetails = {
  residentialAddressInfoId: string;
  residentialAddress: string;
  proofOfAddressPhoto: TPhoto;
  status: string;
  adminNotes: string;
  adminVerifiedId: string;
  adminVerifiedAt: TDate;
  postalAddress: string;
  email: string;
};

type TRating = {
  averageRating: number;
  experience?: number;
  cleanlinessMaintenance?: number;
  communication?: number;
  punctuality?: number;
  attitude?: number;
  createdAt?: TDate;
  updatedAt?: TDate;
};

type TReviewComment = {
  comment: string;
  createdAt?: TDate;
  updatedAt?: TDate;
};

type TReview = {
  guest?: TReviewComment;
  host?: TReviewComment;
};
//guest or host info
type TReviewerInfo = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  picture: TProfilePic;
};

export type TReviewRating = {
  reservationId: number;
  carListingId: number;
  hostId: string;
  guestId: string;
  guestReviewed: boolean;
  hostReviewed: boolean;
  carRating: TRating;
  guestRating?: TRating; // when guest give for host
  hostRating?: TRating;
  carReview?: TReview; // guest | hostReply
  userReview?: TReview;
  tripEndedTime?: TDate;
  guestInfo?: TReviewerInfo;
  hostInfo?: TReviewerInfo;
  createdAt?: TDate;
  updatedAt?: TDate;
};

//Car Info
type CarLicensePlate = {
  state: string;
};

type TCar = {
  licensePlate: CarLicensePlate;
  make: string;
  model: string;
  carType: string; // Sedan, SUV
};

//Rates
type TRate = {
  currency: string;
  amount: number;
};

type TRates = {
  hourlyRates: TRate;
  dailyRates: TRate;
};

//Vehicle Photo
type TListingPhotos = {
  coverPhoto: TPhoto;
};

//Location
type TLocation = {
  city: string;
  country: string;
  postalCode: string;
};
type TPickupLocation = {
  pickupAddress: TLocation;
};

type TVehicleList = {
  listingStatus: string;
  listingId: number;
  car: TCar;
  carNickName: string;
  totalTrips: number;
  totalRatings: number;
  ratingsReceivedFrom: number;
  rates: TRates;
  photos: TListingPhotos;
  location: TPickupLocation;
};

export type TUserPublicProfile = {
  fullName: string;
  username: string;
  profileSummary: TProfileSummary;
  picture: TProfilePic;
  isEmailVerified: TContactDetails;
  isApprovedToDrive: boolean;
  isPhoneVerified: boolean;
  joinedAt?: TDate;
  guestRatingCount: number;
  guestRatingTotal: number;
  hostRatingCount: number;
  guestTotalTrips: number;
  hostTotalTrips: number;
  hostRatingTotal: number;
  vehicleListCount: number;
  vehicleList: TVehicleList[];
  reviewsFromHost: TReviewRating[];
  reviewsFromGuest: TReviewRating[];
};

//Components Props Type
export type TBasicPublicProfileInfo = {
  firstName: string;
  lastName: string;
  pictureUrl?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  guestTrips?: number;
  hostReservation?: number;
  joinedAt?: TDate;
};

export type TBasicVehicleInfo = {
  listingId: number;
  carName: string;
  carType: string;
  carNickName: string;
  totalTrips: number;
  totalRatings: number;
  ratingsReceivedFrom: number;
  hourlyRates: number;
  dailyRates: number;
  photos: string;
  location: string;
};

//!Remove later
export type TBasicReviewRating = {
  guestImage?: string;
  guestName?: string;
  hostImage?: string;
  hostName?: string;
  rating?: number;
  reviewTime?: TDate;
  review?: string;
  carListingId?: number;
};

export type TGuestReviewRating = {
  guestImage?: string;
  guestName?: string;
  rating?: number;
  review?: string;
  reviewTime?: TDate;
  carListingId?: number;
};

export type THostReviewRating = {
  hostImage?: string;
  hostName?: string;
  rating?: number;
  review?: string;
  reviewTime?: TDate;
  carListingId?: number;
};

export type OptimizedUserPublicProfileResponse = {
  basicProfileInfo: TBasicPublicProfileInfo;
  userVehicleList: TBasicVehicleInfo[];
  hostReviews: TBasicReviewRating[];
  guestReviews: TBasicReviewRating[];
};
