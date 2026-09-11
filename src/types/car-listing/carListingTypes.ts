import { TAdditionalDriverInfo } from '../checkout/guestVerificationTypes';
import { TPhoto } from '../commonTypes';
import { CarMaxTripDuration, CarMinTripDuration, CarNoticeInAdvance, CarPickupReturnHour } from './carAvailabilityTypes';
import { CarDataFuelGauge, ServiceLogDocumentInfo, ServiceLogState } from './carDistanceInfoTypes';
import { CarDataSecondaryContactInfo } from './carGuidelineTypes';
import { CarAdditionalInfosState, CarState, FuelInfo, VehicleObligationsState } from './carInfoTypes';
import { AddressState, PickupHistoryState } from './carLocationTypes';
import { CarDataBookingDiscount, CarDataCustomPricing, CarDataPeakIncrease, CarRate } from './carPricingTypes';

export type LicenseValues = {
  licensePlate: {
    number: string;
    state: string;
  };
};

export type CarFeaturesValues = {
  features: string[];
  additionalInfos: {
    carDescription: string;
    guidelines: string;
  };
  additionalFeatures: {
    feature: string;
  }[];
  vehicleObligations: {
    neverWrittenOff: boolean;
    ctpInsurance: boolean;
  };
};

export interface VehicleInfoEditProps {
  isEdit: boolean;
}
export interface VehicleStatusEditProps {
  vehicleId: string;
}

export type TCarInfo = LicenseValues &
  CarFeaturesValues & {
    vin: string;
    make: string;
    model: string;
    year: number;
    expiry: Date | null;
    color: string;
    carType: string;
    seats: number;
    doors: number;
    windows: number;
    fuelType: string;
    fuelInfo?: FuelInfo;
    transmissionType: string;
    carNickName: string;
    isOwnerAgreed?: boolean;
    mileage: {
      distance: number;
      units: string;
    };
    trim: string;
  };

export type CarPickupLocationValues = {
  street: string;
  state: string;
  city: string;
  country: string;
  postalCode: string;
  stateShortCode: string;
  countryShortCode: string;
  coordinates: [number, number];
  parkingInstructions: string;
};

export type CarAvailabilityValues = {
  pickupReturnHour: {
    alwaysAvailable: boolean;
    customAvailability: {
      checked: boolean; //extra for checking day selected. Remove before saving
      dayOfWeek: string | undefined; // Day of the week (e.g., "mon", "tue")
      allDay: boolean; // extra for checking always. Remove before saving
      availability: string; //['always', 'never', 'custom'] //may not needed
      customHours: {
        startTime: Date;
        endTime: Date;
        status: string; //['booked', 'reserved', 'free']
      }[];
    }[];
  };
  noticeInAdvance: {
    alwaysAvailableImmediately: boolean;
    hoursRequired: number; // [1-24]hrs
  };
  minTripDuration: {
    noMinimum: boolean;
    unit: string; //['hours', 'days', 'weeks']
    shortestDuration: number; // 3 hours, 6 hours, 9 hours, 12 hours, 1 day, 2 days, 3 days, 5 days, 1 week
  };
  maxTripDuration: {
    noMaximum: boolean;
    unit: string; //['days', 'weeks']
    longestDuration: number; // 3 days, 5 days, 1 week, 10 days, 2 weeks, 3 weeks, 4 weeks, 5 weeks, 6 weeks.
  };
};

export type CarRatesValues = {
  hourlyRates: {
    currency: string;
    amount: number;
  };
  dailyRates: {
    currency: string;
    amount: number;
  };
  peakIncrease: string[];
  peakIncreaseType: 'amount' | 'percentage' | '';
  peakIncreaseAmount: number | string;
  peakIncreasePercentage: number | string;
  longBookingDiscounts: CarDataBookingDiscount[];
  advanceBookingDiscounts: CarDataBookingDiscount[];
  hasPeakIncrease: boolean;
  hasLongDiscounts: boolean;
  hasAdvanceDiscounts: boolean;
};

export type CarGuidelinesValues = {
  guidelines: {
    pickupInformation: string;
    returnInformation: string;
    wordOfWelcome: string;
    secondaryContact: {
      firstName?: string | undefined;
      lastName?: string | undefined;
      email?: string | undefined;
      phoneNumber?: string | undefined;
    };
    firstPointOfContactIsMe: boolean;
    secondPointOfContactOther: boolean;
  };
};

export type CarCoverPhotosValues = {
  coverPhotoUrl: Blob;
};
//Inspection Photo
export type CarInspectionPhotosValues = {
  inspectionPhotoUrl: Blob;
};
interface ExtendedBlob extends Blob {
  publicId: string;
}

export type CarAdditionalPhotosValues = {
  additionalPhotosUrl: ExtendedBlob[];
};

export type CarInitialPhotosValues = {
  initialPhotosUrl: ExtendedBlob[];
};

export type CarFuelEconomyType = {
  maxFuel: number;
  fuelCost: number;
};

export type CarDistanceValues = {
  distance: {
    unlimitedTravel: boolean;
    maximumDailyDistance?: number | undefined;
    additionalFeePerKilometer?: number | undefined;
  };
  serviceLog?: {
    serviceDate: Date | null;
    odometer: number;
    documentInfo?: ServiceLogDocumentInfo;
    nextServiceDate: Date | null;
    nextServiceDueOdometer: number;
  };
  fuelGauge?: {
    vehicleKilometersRange?: number;
    attachmentOfFuelGauge?: {
      imageInfo: {
        public_id: string;
        secure_url: string;
        format: string;
      };
      storageProvider?: string;
    };
  };
  fuelEconomy?: {
    maxFuel: number;
    fuelCost: number;
  };
  serviceLogAdd: boolean;
  fuelInfoAdd: boolean;
  picture?: Blob;
  fuelPicture?: Blob;
};

// export type PrivacyPolicy = {
//   carMarketValue: number;
//   isAgreedCoverage: boolean;
//   isPartnerAgreed: boolean;
// };

export type PrivacyPolicy = {
  insurance: {
    coverageType: string;
    coveragePercentage: number;
    excessFee: number;
    carMarketValue: number;
  };
  isAgreedCoverage: boolean;
};

export type TLicenseVerifiedData = {
  make: string;
  model: string;
  vin: string;
  year: string;
  color: string;
  expiry: Date | null;
};

export type TKeyHandover = {
  label: string;
  value: string;
  _id?: string;
  createdAt?: Date;
};

export type CarDataState = {
  _id: string;
  hostId: string;
  listingStatus: CarListingStatusValues;
  car: CarState;
  carNickName: string;
  features: string[];
  additionalFeatures: string[];
  additionalInfos: CarAdditionalInfosState;
  vehicleObligations: VehicleObligationsState;
  location: CarLocationState;
  availability: CarDataAvailability;
  rates: CarDataRates;
  guidelines: CarDataGuidelines;
  photos: CarDataPhotos;
  distance: CarDataDistance;
  ownerAgreement: CarDataOwnerAgreement;
  carServiceStatus: string;
  createdAt: string;
  updatedAt: string;
  listingId: number;
  __v: number;
  totalTrips: number;
  ratingsReceivedFrom: number;
  totalRatings: number;
  automatedSupportTicket: CarDataAutomatedSupportTicket[];
  // for protected car data
  carMarketValue?: number;
  insurancePolicies: CarDataInsuranceInfo[];
  carServiceLog?: CarDataServiceLog;
  additionalDrivers?: TAdditionalDriverInfo[];
  keyHandovers?: TKeyHandover[];
};

export type CarListingStatusValues =
  | 'draft'
  | 'pending'
  | 'listed'
  | 'unlisted'
  | 'update'
  | 'unlistedByTashus'
  | 'demo'
  | 'listedByOwner'
  | 'user-deleted'
  | 'user-deactivated';

export type CarLocationState = {
  pickupAddress: AddressState;
  parkingInstructions: string;
  pickupHistory?: PickupHistoryState[];
  updatedAt?: string;
};

export type CarDataAvailability = {
  pickupReturnHour: CarPickupReturnHour;
  noticeInAdvance: CarNoticeInAdvance;
  minTripDuration: CarMinTripDuration;
  maxTripDuration: CarMaxTripDuration;
  updatedAt?: string;
};

export type CarDataRates = {
  hourlyRates: CarRate;
  dailyRates: CarRate;
  peakIncrease: CarDataPeakIncrease[];
  longBookingDiscounts: CarDataBookingDiscount[];
  advanceBookingDiscounts: CarDataBookingDiscount[];
  longBookingDiscountActive?: boolean;
  advanceBookingDiscountActive?: boolean;
  customPricing: CarDataCustomPricing[];
  updatedAt?: string;
};

export type CarDataGuidelines = {
  pickupInformation: string;
  returnInformation: string;
  wordOfWelcome: string;
  firstPointOfContactIsMe: boolean;
  updatedAt?: string;
  secondaryContact?: CarDataSecondaryContactInfo;
  secondPointOfContactOther?: boolean;
};

export type CarDataPhotos = {
  coverPhoto: TPhoto;
  initialConditionPhotos: TPhoto[];
  additionalPhotos: TPhoto[];
  updatedAt: string;
  vehicleInspectionPhotos: TPhoto[];
};

export type CarDataFuelEconomy = {
  maxFuel: number;
  fuelCost: number;
};

export type CarDataDistance = {
  unlimitedTravel: boolean;
  maximumDailyDistance: number;
  additionalFeePerKilometer: number;
  updatedAt?: string;
  fuelGauges: CarDataFuelGauge[];
  fuelEconomy?: CarDataFuelEconomy;
};

export type CarDataOwnerAgreement = {
  agreementId: string;
  contentId: string;
};

export type CarDataAutomatedSupportTicket = {
  supportTicketId: number;
  issueType: string;
  subject: string;
  description: string;
  status: string;
  issueBy: string;
  category: string;
  comments: any[];
  attachments: any[];
  assignedAgents: any[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CarDataInsuranceInfo = {
  coverageType: string;
  coveragePercentage: number;
  excessFee: number;
  _id?: string;
  createdAt?: string;
};

export type CarDataServiceLog = {
  _id?: string;
  carId?: string;
  serviceLogs: ServiceLogState[];
  showServiceLog?: boolean;
};

export type CarFuelDataInfo = {
  fuelType: string;
  unitPrice: number;
  unitName: string;
};
export type CarFuelValues = {
  fuelData: CarFuelDataInfo[];
};
