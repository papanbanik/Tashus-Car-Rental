import { TPeakIncreasePrice } from '@/context/SearchProvider';
import { TDate } from '@/types/commonTypes';
import { EPaymentMethod, EPaymentStatus, EVehicleReplaceReason } from '@/types/travels/travelEnums';
import {
  CancellationInfo,
  ReservationGuestInsurance,
  RevisedCoverageType,
  TAdditionalPaymentInfo,
  TBasePrice,
  TLocation,
  TRevisedReservation,
  TTravelDiscounts,
} from '@/types/travels/typeTravels';
import { TRevisedVehicle } from '@/types/vehicle-details/vehicle-details';
import dayjs from 'dayjs';

export type TReplacementVehicleInfo = {
  previousCarListingId: number;
  previousPickupLocation: TLocation;
  previousDropOffLocation: TLocation;
  paymentStatus?: EPaymentStatus;
  paymentMethod?: EPaymentMethod;
  description: string;
  payableAmount?: number;
  discountAmount?: number;
  creditedAmount?: number;
  reason: EVehicleReplaceReason;
  replacementDate?: TDate;
};
export type TUpgradedCoverageInfo = {
  dueAmount: number;
  paymentStatus?: EPaymentStatus;
  paymentMethod?: EPaymentMethod;
  previousInsurance: ReservationGuestInsurance;
  reason: string;
};
export type ReservationHistoryType = {
  newStartDate: TDate;
  newEndDate: TDate;
  peakIncrease?: TPeakIncreasePrice;
  basePrice: TBasePrice;
  depositAmount: number;
  cancellationInfo?: CancellationInfo;
  paymentMethod: string;
  paymentStatus: string;
  additionalPaymentInfo: TAdditionalPaymentInfo;
  updatedAt: TDate;
  discounts?: TTravelDiscounts;
  replacementVehicleInfo?: TReplacementVehicleInfo;
  upgradedCoverageInfo?: TUpgradedCoverageInfo;
  isRevisedTravel?: boolean;
  isReplaceVehicle?: boolean;
  isUpgradedCoverage?: boolean;
  serialNo?: string;
};

const transformRevisedVehicle = (vehicle: TRevisedVehicle, baseData: ReservationHistoryType): ReservationHistoryType => {
  return {
    ...baseData,
    newStartDate: vehicle?.startDate,
    newEndDate: vehicle?.endDate,
    basePrice: vehicle?.previousBasePrice,
    updatedAt: vehicle?.updatedAt,
    discounts: vehicle?.previousDiscounts,
    peakIncrease: vehicle?.previousPeakIncrease,
    additionalPaymentInfo: vehicle?.previousAdditionalPaymentInfo ?? {},
    isReplaceVehicle: true,
    replacementVehicleInfo: {
      previousCarListingId: vehicle?.previousCarListingId,
      previousPickupLocation: vehicle?.previousPickupLocation,
      previousDropOffLocation: vehicle?.previousDropOffLocation,
      paymentStatus: vehicle?.paymentStatus,
      paymentMethod: vehicle?.paymentMethod,
      description: vehicle?.description,
      payableAmount: vehicle?.payableAmount,
      discountAmount: vehicle?.discountAmount,
      creditedAmount: vehicle?.creditedAmount,
      reason: vehicle?.reason,
      replacementDate: vehicle?.replacementDate,
    },
  };
};

const transformRevisedCoverage = (coverage: RevisedCoverageType, baseData: ReservationHistoryType): ReservationHistoryType => {
  return {
    ...baseData,
    newStartDate: coverage?.startDate,
    newEndDate: coverage?.endDate,
    basePrice: coverage?.previousBasePrice,
    updatedAt: coverage?.updatedAt,
    isUpgradedCoverage: true,
    upgradedCoverageInfo: {
      dueAmount: coverage?.dueAmount,
      paymentStatus: coverage?.paymentStatus,
      paymentMethod: coverage?.paymentMethod,
      previousInsurance: coverage?.previousInsurance,
      reason: coverage?.reason,
    },
  };
};

// Main function that constructs the combined array
export const getReservationHistory = (
  revisedReservations: TRevisedReservation[],
  revisedVehicles: TRevisedVehicle[],
  revisedCoverages: RevisedCoverageType[],
  reservationBaseData: ReservationHistoryType
): ReservationHistoryType[] => {
  const combinedArray: ReservationHistoryType[] = [];
  // Step 1: Push initial reservation data (it gets "1" as serialNo)
  combinedArray.push({ ...reservationBaseData });
  // Step 2: Add revised reservations
  revisedReservations.forEach((item) => {
    combinedArray.push({
      ...reservationBaseData,
      ...item,
      additionalPaymentInfo: item?.additionalPaymentInfo ?? {},
      isRevisedTravel: true,
      discounts: item?.discounts ?? {},
    });
  });
  // Step 3: Add revised vehicles using transformation function
  revisedVehicles.forEach((vehicle) => {
    combinedArray.push(transformRevisedVehicle(vehicle, reservationBaseData));
  });
  // Step 4: Add revised coverages using transformation function
  revisedCoverages.forEach((coverage) => {
    combinedArray.push(transformRevisedCoverage(coverage, reservationBaseData));
  });
  // Step 5: Sort by `updatedAt` in descending order (most recent first)
  combinedArray.sort((a, b) => dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf());
  // Step 6: Assign serial numbers dynamically
  return combinedArray.map((item, index, list) => ({
    ...item,
    serialNo: index === 0 ? '1' : calculateSerialNumber(item, list.slice(0, index)),
  }));
};

const calculateSerialNumber = (item: ReservationHistoryType, previousItems: ReservationHistoryType[]) => {
  const revisedTravelCount = previousItems.filter((i) => i.isRevisedTravel).length + (item.isRevisedTravel ? 1 : 0);
  const revisedVehicleCount = previousItems.filter((i) => i.isReplaceVehicle).length + (item.isReplaceVehicle ? 1 : 0);
  const upgradedCoverageCount = previousItems.filter((i) => i.isUpgradedCoverage).length + (item.isUpgradedCoverage ? 1 : 0);
  if (item.isRevisedTravel) {
    return `#R${String(revisedTravelCount).padStart(2, '0')}`;
  } else if (item.isReplaceVehicle) {
    return `#V${String(revisedVehicleCount).padStart(2, '0')}`;
  } else if (item.isUpgradedCoverage) {
    return `#C${String(upgradedCoverageCount).padStart(2, '0')}`;
  } else {
    return String(previousItems.length + 1);
  }
};
