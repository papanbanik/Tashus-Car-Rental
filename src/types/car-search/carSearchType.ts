'listingId hostId availability totalTrips ratingsReceivedFrom totalRatings location.pickupAddress car.make car.model car.transmissionType car.seats car.carType car.fuelType rates.hourlyRates rates.dailyRates photos.coverPhoto';

import { CarDataAvailability } from '../car-listing/carListingTypes';
import { AddressState } from '../car-listing/carLocationTypes';
import { CarRate } from '../car-listing/carPricingTypes';
import { TPhoto } from '../commonTypes';

export type TSearchedCar = {
  _id: string;
  listingId: number;
  hostId: string;
  availability: CarDataAvailability;
  totalTrips: number;
  ratingsReceivedFrom: number;
  totalRatings: number;
  location: {
    pickupAddress: AddressState;
  };
  car: {
    make: string;
    model: string;
    transmissionType: string;
    seats: number;
    carType: string;
    fuelType: string;
  };
  rates: {
    hourlyRates: CarRate;
    dailyRates: CarRate;
  };
  photos: {
    coverPhoto: TPhoto;
  };
  isNoticeHourRequired?: boolean;
};

export type TSearchPriceMode = 'Day' | 'Hour';
