import { ReservationLocationState } from '../travels/typeTravels';

export type AddressState = {
  city: string;
  state: string;
  stateShortCode: string;
  country: string;
  countryShortCode: string;
  street: string;
  postalCode?: string;
  coordinates: [number, number];
  _id?: string;
};

export type PickupHistoryState = ReservationLocationState & {
  selectedReservationId?: number; //reservation number for which users selected the drop off location
  updatedAt?: string;
};
