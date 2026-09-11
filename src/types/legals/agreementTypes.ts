import { TDate } from '../commonTypes';
import { TAdditionalPaymentInfo, TBasePrice, TRevisedReservation } from '../travels/typeTravels';

type TLicenseInfo = {
  licenseName: string;
  licenseNumber: string;
  country: string;
  state: string;
  expiryDate: TDate;
  valid: boolean;
  status: string;
};
type TGuestInfo = {
  guestName: string;
  guestContactNumber: string;
  guestLicenseInfo?: TLicenseInfo;
};

type TPartnerInfo = {
  partnerName: string;
  partnerContactNumber: string;
};

type TInsurance = {
  coveragePercentage: number;
  excessFee: number;
  guestCoverageType: string;
};

type TVehicleInsurance = {
  _id: string;
  coveragePercentage: number;
  coverageType: string;
  excessFee: number;
  createdAt: TDate;
};

type TFuelGaugeInfo = {
  vehicleKilometersRange: number;
  imageUrl: string;
  fuelGaugeId: string;
};

type TFuelEconomyInfo = {
  maxFuel: number;
  fuelCost: number;
  fuelEconomyId: string;
};

type TVehicleInfo = {
  make: string;
  model: string;
  year: string;
  registrationPlateNumber: string;
  color: string;
  fuelGaugeInfo: TFuelGaugeInfo;
  fuelEconomyInfo: TFuelEconomyInfo;
};

type TRentalAgreement = {
  agreementId: string;
  contentId: string;
  partnerName: string;
  partnerContactNumber: string;
  guestName: string;
  guestContactNumber: string;
  hasAdditionalDriver: boolean;
  vehicle: TVehicleInfo;
};

type TPhoneInfo = {
  number: string;
  isVerified: boolean;
};

type TAdditionalDriver = {
  _id: string;
  fullName: string;
  email: string;
  phone: TPhoneInfo;
  isActive: boolean;
  status: string;
  requestId: string;
  createdAt: TDate;
  updatedAt: TDate;
};

type TAddress = {
  streetAddress: string;
  shortAddress: string;
};

type TTripInformation = {
  isTripStarted?: boolean;
  isEndedByGuest?: boolean;
  isEndedByPartner?: boolean;
  isEndedByAdmin?: boolean;
};

type TReservation = {
  startTime: string;
  endTime: string;
  rentalPeriod: number;
  totalPrice: number;
  maxDistance: number;
  dailyDistanceKm: number;
  additionalFee: number;
  securityDeposit: number;
  pickupAddress: TAddress;
  returnAddress: TAddress;
  tripInformation: TTripInformation;
  revisedReservationResponses: TRevisedReservation[];
};

type TRentalReservation = {
  guestId: string;
  hostId: string;
  partner: TPartnerInfo;
  guest: TGuestInfo;
  vehicle: TVehicleInfo;
  depositAmount: number;
  reservation: TReservation;
  basePrice: TBasePrice;
  insurance: TInsurance;
  additionalPaymentInfo: TAdditionalPaymentInfo;
  additionalDrivers: TAdditionalDriver[];
  vehicleInsurance: TVehicleInsurance;
  rentalAgreement: TRentalAgreement;
  agreement: string;
};

export interface AgreementInfoProps {
  reservationDetails: TRentalReservation;
  isRental?: boolean;
  count: number;
  isReserveRevised?: boolean;
}

export interface AgreementCardProps {
  reservationDetails: TRentalReservation;
  isRental: boolean;
}
