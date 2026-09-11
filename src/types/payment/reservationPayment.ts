import { TDate } from '../commonTypes';
import { EPaymentMethod, EReservationStatus } from '../travels/travelEnums';
import { TBasePrice } from '../travels/typeTravels';
//Types for API
export interface IPayment {
  reservationId?: number;
  guestId: string;
  amount?: number;
  payment_method: string;
  currency: string;
  carListingId: number;
  recentRevisedReservationId?: string;
  excessFee: number;
}

export interface IPaymentBody {
  paymentData: IPayment;
  price?: number;
  holdPrice: number;
  email?: string;
}

//Types for Context
type TBankInfoDetails = {
  bsb?: string;
  accountNumber?: string;
};

type TBankInfo = {
  guestBankInfo?: TBankInfoDetails;
  receiverBankInfo?: TBankInfoDetails;
};

type TManualPaymentDetails = {
  previousPaymentMethod?: EPaymentMethod;
  paymentMethod: EPaymentMethod;
  paidAmount: number;
  notes?: string;
  bankInfo?: TBankInfo;
};
type TManualPaymentDetailsWithDue = TManualPaymentDetails & {
  dueAmount: number;
  receivedAt: TDate;
};
interface IAdditionalPaymentInfo {
  cardAmountUsed: number;
  manualPaymentList?: TManualPaymentDetailsWithDue[];
}

interface RevisedReservation {
  basePrice: TBasePrice;
  additionalPaymentInfo?: IAdditionalPaymentInfo;
  createdAt: TDate;
  newStartDate: TDate;
  newEndDate: TDate;
  paymentStatus?: string;
  paymentMethod?: string;
  _id: string;
}

export interface ReservationDetails {
  additionalPaymentInfo?: IAdditionalPaymentInfo;
  createdAt: TDate;
  depositAmount: number;
  startDate: string;
  endDate: string;
  guestId: string;
  paymentStatus: string;
  carListingId: number;
  reservationId: number;
  revisedReservations?: RevisedReservation[];
  paymentMethod: string;
  reservationStatus?: EReservationStatus;
  isHoldSuccess?: boolean;
  holdDueAmount?: number;
}

export interface IPaymentDetails {
  carListingId: number;
  reservationId: number;
  paymentAmount?: number;
  pickupDate: TDate;
  returnDate: TDate;
  reservedAt: TDate;
  depositAmount: number;
  isRevised: boolean;
  revisedReservationId?: string; // Optional if no revision exists
  paymentStatus: string; // Assuming this could be "paid", "pending", etc.
  guestId: string;
  isPaymentTimeExpired: boolean;
  paymentMethod: string;
  reservationStatus?: EReservationStatus;
  isHoldSuccess?: boolean;
  holdDueAmount?: number;
}
