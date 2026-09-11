import { CarPickupLocationValues, TCarInfo } from '../car-listing/carListingTypes';
import { TPhoto } from '../commonTypes';

type TLocation = {
  pickupAddress: CarPickupLocationValues;
};
type TCarCoverPhoto = {
  coverPhoto: TPhoto;
};

type TRate = {
  currency: string;
  amount: number;
};

type TCarRate = {
  dailyRates: TRate;
  hourlyRates: TRate;
};

export type TCarListInfo = {
  car: TCarInfo;
  carNickName: string;
  hostId: string;
  id: string;
  listingId: number;
  listingStatus: string;
  location: TLocation;
  photos: TCarCoverPhoto;
  rates: TCarRate;
  ratingsReceivedFrom: number;
  totalRatings: number;
  totalTrips: number;
  _id: string;
};
