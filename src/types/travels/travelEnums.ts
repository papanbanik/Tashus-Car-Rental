export enum EPaymentMethod {
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

  IssuedCredit = 'issuedCredit', // credit issued to guest from admin for exceptional scenario
  VehicleReplacementCredit = 'vehicleReplacementCredit', //vehicle replacement
  HoldDeposit = 'holdDeposit', // Charged from hold deposit
}

export enum EPaymentStatus {
  Pending = 'pending',
  PendingCharge = 'pendingCharge', //when admin updates, guest can pay even after 30 mins or admin may charge later
  Paid = 'paid',
  Refundable = 'refundable',
  Refunded = 'refunded',
  RefundedAsCredit = 'refundedAsCredit',
  PartiallyPaid = 'partiallyPaid',
  Expired = 'expired', // Generate in Frontend
}

export enum EReservationStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  AdminCancelled = 'adminCancelled',
  AutoCompleted = 'autoCompleted',
  AdminCompleted = 'adminCompleted',
  Disputed = 'disputed',
  ForcedCompletion = 'forcedCompletion',
  Cancelled = 'cancelled',
  CancelledByHost = 'cancelledByHost',
  CancelledByGuest = 'cancelledByGuest',
}

export enum EPaymentCategory {
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
  VehicleReplacementCredit = 'vehicleReplacementCredit',
  Other = 'other',
  GuestCreditAdjustment = 'guestCreditAdjustment', // for issuing credit from admin for any reason
  AdditionalFee = 'additional_fees',
}

export enum EPaymentType {
  HoldPayment = 'hold_payment',
  InstantPayment = 'instantPayment',
}

export enum ETransactionType {
  Credit = 'credit',
  Debit = 'debit',
  Transfer = 'transfer',
  Refund = 'refund',
}

export enum EPriceAdjustment {
  Increase = 'INCREASE',
  Decrease = 'DECREASE',
}

export enum ETravelUpdateReason {
  RequestByPhone = 'requestByPhone',
  RequestByEmail = 'requestByEmail',
  ReturnedEarly = 'returnedEarly',
  VehicleIssue = 'vehicleIssue',
  Other = 'other',
}

export enum EVehicleReplaceReason {
  CarIssue = 'car_has_issues',
  GuestRequest = 'guest_request',
}

export enum ERevisedVehiclePaymentStatus {
  Paid = 'paid',
  Pending = 'pending',
  NotRequired = 'not_required',
}

export type TPaymentCategory = EPaymentCategory;
export type TPaymentMethod = EPaymentMethod;
