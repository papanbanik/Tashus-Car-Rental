import { EPaymentMethod, ETransactionType } from '../travels/travelEnums';
import { PaymentCategory } from './transactionsTypes';

export enum EHoldPaymentStatus {
  Captured = 'captured',
  PartiallyCaptured = 'partiallyCaptured',
  Released = 'released',
  ManuallyReceived = 'manuallyReceived',
  Pending = 'pending',
  Refunded = 'refunded',
  PartiallyRefunded = 'partiallyRefunded',
  RefundedAsCredit = 'refundedAsCredit',
  UserCreditApplied = 'userCreditApplied',
  Split = 'split',
}

export enum EHoldPaymentMethod {
  OnlyCard = EPaymentMethod.OnlyCard,
  CardWithCredit = EPaymentMethod.CardWithCredit,
  CardWithVoucher = EPaymentMethod.CardWithVoucher,
  ChargeWithSavedCard = EPaymentMethod.ChargeWithSavedCard,
  CashPayment = EPaymentMethod.CashPayment,
  ManualStripeCharge = EPaymentMethod.ManualStripeCharge,
  BankTransfer = EPaymentMethod.BankTransfer,
  CreditApplied = EPaymentMethod.CreditApplied,
  OtherPayment = EPaymentMethod.OtherPayment,
}
export enum EHoldPaymentCategory {
  Rental = PaymentCategory.Rental,
}

// Add more categories if hold is used for other charges
export enum EHoldChargeCategory {
  AdditionalFee = 'additional_fee',
  RevisedFee = 'revised_fee',
}

type ReservationHostCarInfo = {
  hostName?: string;
  carName?: string;
};

type TAdditionalHoldPaymentInfo = {
  reason?: string;
  capturedAmount?: number;
  releasedAmount?: number;
};

export type THoldRefundHistory = {
  refundedAmount: number;
  updatedAt?: string;
  refundType?: string;
  splitId?: string;
};

export type THoldPaymentChargeHistory = {
  chargeCategory: EHoldChargeCategory;
  chargeAmount: number;
  chargeId: string;
  splitId?: string;
};

type TSplitHoldPaymentHistory = {
  holdPaymentIntent?: string;
  amount: number;
  dueAmount?: number;
  holdPaymentStatus?: EHoldPaymentStatus;
  holdPaymentMethod?: EHoldPaymentMethod;
  remainingDepositAmount?: number;
  additionalHoldPaymentInfo?: TAdditionalHoldPaymentInfo;
  _id?: string;
};

export type THoldPaymentTransaction = {
  reservationId: number;
  paymentCategory: EHoldPaymentCategory;
  transactionType: ETransactionType;
  paymentMethod: EHoldPaymentMethod;
  remainingDepositAmount?: number;
  reservationInfo?: ReservationHostCarInfo;
  holdPaymentIntent: string;
  paymentType: string;
  actualCardPaidAmount: number;
  holdPaymentStatus: EHoldPaymentStatus;
  holdRefundHistory?: THoldRefundHistory[];
  additionalHoldPaymentInfo?: TAdditionalHoldPaymentInfo;
  holdPaymentChargeHistory?: THoldPaymentChargeHistory[];
  createdAt: string;
  updatedAt: string;
  splitHoldPaymentHistory?: TSplitHoldPaymentHistory[];
  transferHistory?: any[];
};

export type TReservationHoldTransaction = Pick<
  THoldPaymentTransaction,
  | 'paymentMethod'
  | 'actualCardPaidAmount'
  | 'holdPaymentStatus'
  | 'createdAt'
  | 'updatedAt'
  | 'holdRefundHistory'
  | 'holdPaymentChargeHistory'
  | 'remainingDepositAmount'
  | 'additionalHoldPaymentInfo'
  | 'splitHoldPaymentHistory'
  | 'transferHistory'
>;
