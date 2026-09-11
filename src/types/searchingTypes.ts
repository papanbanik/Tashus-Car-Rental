import { CarPickupLocationValues } from './car-listing/carListingTypes';
export type CarPickupLocation = Omit<CarPickupLocationValues, 'parkingInstructions'>;

export type CarSearchByLocationDate = {
  location: CarPickupLocation;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
};

export type CarSearchType = {
  location?: CarPickupLocation;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
};

export type SearchParamsType = {
  city: string;
  country: string;
  postcode: string;
  region: string;
  lat: string;
  long: string;
  pickup: string;
  return: string;
  address: string;
};

export type SelectedFiltersType = {
  name?: 'price' | 'carType' | 'transmission' | 'seat';
  options?: any;
};

export type VehiclePickupReturnType = {
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
};
