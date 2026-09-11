export type TUserTransaction = {
  userId: string;
  totalPayableAmount: number;
  lastPayoutAmount: number;
  totalCredit: number;
  heldCredit?: number; // Implies credit being held aside until used for the final transaction.
  totalRefundable: number;
  creditAmountUsed: number;
  transactionHistory: TTransactionHistory[];
  partnerTransactionHistory: TPartnerTransactionHistory[];
};

export type TTransactionHistory = {
  // transactionId?: string;
  _id: string;
  reservationId: number;
  transactionType: string;
  paymentMethod?: PaymentMethod; // when transactionType is credit paymentMethod is optional
  totalAmount: number;
  paymentCategory: PaymentCategory;
  feeAmount?: number;
  refundableAmount?: number;
  creditAmountBalance?: number;
  creditAmountUsed?: number; // when payment again using credit
  cardAmountUsed?: number;
  voucherAmountUsed?: number;
  currentCredit?: number;
  currentRefundable?: number;
  remainingDepositAmount?: number;
  supportTicketId?: number;
  paymentDistributeInfos?: object;
  reservationInfo?: {
    hostName: string;
    carName: string;
  };
  refundRequest?: IRefundRequest;
  voucherInfo?: {
    voucherId: string;
    voucherCode: string;
  };
  paymentIntent?: string;
  holdPaymentIntent?: string;
  paymentType?: PaymentType;
  actualCardPaidAmount?: number;
  holdPaymentStatus?: string;
  additionalHoldPaymentInfo?: TransactionHoldPaymentInfo;
};

export type TPartnerTransactionHistory = {
  // payoutId: string;
  _id: string;
  paymentCategory: PaymentCategory;
  feeAmount?: number;
  payableAmount?: number;
  transactionType: string;
  reservationId?: number; // which reservation Fee added
  reservationInfo?: {
    guestName?: string;
    hostName: string;
    carName: string;
  };
  payoutMethod?: string; // when transactionType is credit payoutMethod is optional
  totalAmount: number;
  paymentRequest?: string;
  currentPayable?: number;
};

export type IRefundRequest = {
  requestId: string;
  status: string;
};

// New Collection
export type TTransactionalAccount = {
  // totalPlatformBalance?: number; /// each time inc/dec when travel end/payout to partner/ any cancellation Fee
  // totalPlatformPayout?: number; // each time update when payout to partner/guest[refund]
  // totalPlatformCreditBalance?: number; // each time update when credit add or used
  // totalPlatformFee?: number;
  totalPlatformPayable?: number;
  paymentCategory: PaymentCategory;
  transactionType: string;
  reservationId?: number;
  amount: number;
  platformFee?: number; // each time update when cancellation fee | From host
  serviceFee?: number; // from guest
  creditAmount?: number; // each time update when travel
  payableAmount?: number; // each time update when travel
  gstAmount?: number; // each time update when travel
  coverageAmount?: number; // each time update when travel
  vehicleInsurance?: TVehicleInsurance;
  userId?: string;
  supportAgentId?: string;
};

export type TVehicleInsurance = {
  coverageType: string;
  coveragePercentage: number;
  excessFee: number;
  coverageAmount: number;
};

export type TUserRole = 'guest' | 'partner';

export type TransactionHoldPaymentInfo = {
  reason: string;
  capturedAmount: number;
  releasedAmount: number;
};

export type TransactionsState = TTransactionHistory[] | TPartnerTransactionHistory[];
export type TransactionsStateValue = TTransactionHistory | TPartnerTransactionHistory;

export enum PaymentCategory {
  Rental = 'rentalFee',
  CancellationFee = 'cancellationFee',
  GuestCancellationFee = 'guestCancellationFee', // When cancelled by guest
  HostCancellationFee = 'hostCancellationFee',
  CancellationFeeWithRefund = 'cancellationFeeWithRefund',
  RevisedFeeWithRefund = 'revisedFeeWithRefund',
  RevisedFee = 'revisedFee',
  FuelFee = 'fuelFee',
  TollFee = 'tollFee',
  RefundRequest = 'refundRequest',
  PaymentRequest = 'paymentRequest',
  Payout = 'payout',
  Refunded = 'refunded',
  AdditionalFee = 'additional_fees',
  Other = 'other',
  TashusGuestCredit = 'guestCreditAdjustment',
  VehicleReplacementCredit = 'vehicleReplacementCredit',
  ChangedVehicle = 'changed_vehicle',
  UpgradedCoverage = 'upgraded_coverage',
  ManualDeposit = 'manualDeposit',
  HoldRefundAsCredit = 'holdRefundAsCredit',
}

export enum PaymentMethod {
  OnlyCard = 'onlyCard',
  OnlyCredit = 'onlyCredit',
  OnlyVoucher = 'onlyVoucher',
  OnlyCreditWithHold = 'onlyCreditWithHold',
  OnlyVoucherWithHold = 'onlyVoucherWithHold',
  CardWithCredit = 'cardWithCredit',
  CardWithVoucher = 'cardWithVoucher',
  NoPayment = 'noPayment',

  ChargeWithSavedCard = 'chargeWithSavedCard', // Charge guest using saved card details
  CashPayment = 'cashPayment', // Payment made in cash by guest
  ManualStripeCharge = 'manualStripeCharged', // Payment manually processed via Stripe
  BankTransfer = 'bankTransferred', // Payment made by bank transfer
  CreditApplied = 'creditApplied', // Amount credited, no payment required from guest
  OtherPayment = 'otherPayment', // Other payment method with specified reason
  IssuedCredit = 'issuedCredit', //received credit from tashus
  HoldDeposit = 'holdDeposit',
}
// 'ChargeNow' | 'PaidCash' | 'ChargedStripe' | 'BankTransferred' | 'Credit' | 'Other';

export enum RequestStatus {
  Pending = 'pending',
  Processed = 'processed',
  Rejected = 'rejected',
  Paid = 'paid',
}

export enum PayoutPaymentMethod {
  Card = 'card',
  BankAccount = 'bankAccount',
  Other = 'other',
}

export enum PaymentType {
  HoldPayment = 'hold_payment',
}

export enum ERefundPaymentMethod {
  Pending = 'pending',
  Card = 'card',
  Bank = 'bank',
  Credit = 'credit',
  Cash = 'cash',
  Other = 'other',
}
