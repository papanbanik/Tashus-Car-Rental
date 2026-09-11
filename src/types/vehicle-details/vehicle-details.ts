import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { ReservationPaymentStatusEnum, TDate, TReservationStatus } from '../commonTypes';
import { IMapFormattedResult } from '../mapLocations';
import { EPaymentMethod, EPaymentStatus, EVehicleReplaceReason } from '../travels/travelEnums';
import { ReservationLocationState, TAdditionalPaymentInfo, TBasePrice, TLocation, TTravelDiscounts } from '../travels/typeTravels';

export type TVehicleReservation = {
  createdAt: Date;
  reservationId: number;
  startDate: Date;
  endDate: Date;
  basePrice: TBasePrice;
  insurance: any;
  reservationStatus: TReservationStatus;
  paymentStatus: ReservationPaymentStatusEnum;
  carListingId: number;
  guestId: string;
  revisedReservations: any;
  tripInformation: {
    tripEndingInfo: {
      isEndedByGuest: boolean;
    };
  };
};

export type VehicleDeliveryInfoState = {
  deliveryLocation: IMapFormattedResult;
  deliveryFee: number;
  drivingDistance: number;
};

export type VehicleDropInfoState = {
  dropOffLocation: ReservationLocationState;
};

export type TRevisedVehicle = {
  startDate: TDate;
  endDate: TDate;
  previousCarListingId: number;
  previousBasePrice: TBasePrice;
  previousPickupLocation: TLocation;
  previousDropOffLocation: TLocation;
  previousDiscounts?: TTravelDiscounts;
  previousPeakIncrease?: TPeakIncreasePrice;
  previousAdditionalPaymentInfo?: TAdditionalPaymentInfo;
  paymentStatus?: EPaymentStatus;
  paymentMethod?: EPaymentMethod;
  description: string;
  payableAmount?: number;
  discountAmount: number;
  creditedAmount: number;
  updatedAt: TDate;
  reason: EVehicleReplaceReason;
  replacementDate?: TDate;
};
