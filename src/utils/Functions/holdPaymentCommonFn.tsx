import {
  EHoldChargeCategory,
  EHoldPaymentMethod,
  EHoldPaymentStatus,
  THoldPaymentChargeHistory,
} from '@/types/user-profile/holdPaymentTransactionTypes';

const HoldTransactionPaymentMethodLabel: Record<EHoldPaymentMethod, string> = {
  [EHoldPaymentMethod.OnlyCard]: 'Card',
  [EHoldPaymentMethod.CardWithCredit]: 'Card with Credit',
  [EHoldPaymentMethod.CardWithVoucher]: 'Card with Voucher',
  [EHoldPaymentMethod.ChargeWithSavedCard]: 'Saved Card',
  [EHoldPaymentMethod.CashPayment]: 'Cash',
  [EHoldPaymentMethod.ManualStripeCharge]: 'Manual Stripe Charge',
  [EHoldPaymentMethod.BankTransfer]: 'Bank Transfer',
  [EHoldPaymentMethod.CreditApplied]: 'Credit Applied',
  [EHoldPaymentMethod.OtherPayment]: 'Other Payment',
};

export const getHoldTransactionPaymentMethod = (paymentMethod: EHoldPaymentMethod): string => {
  return HoldTransactionPaymentMethodLabel[paymentMethod] ?? '';
};

export const getHoldDepositStatus = (holdPaymentStatus: EHoldPaymentStatus, reason?: string) => {
  switch (holdPaymentStatus) {
    case EHoldPaymentStatus.Captured:
      return 'Captured';
    case EHoldPaymentStatus.PartiallyCaptured:
      return 'Partially Captured';
    case EHoldPaymentStatus.Refunded:
      return 'Refunded';
    case EHoldPaymentStatus.PartiallyRefunded:
      return 'Partially Refunded';
    case EHoldPaymentStatus.Released:
      return reason === 'automatic' ? 'Released Automatically' : 'Released';
    case EHoldPaymentStatus.ManuallyReceived:
      return 'Manually Received';
    case EHoldPaymentStatus.RefundedAsCredit:
      return 'Refunded as Credit';
    case EHoldPaymentStatus.UserCreditApplied:
      return 'User Credit Applied';
    default:
      return '';
  }
};

export const getHoldChargeCategory = (holdChargeCategory: EHoldChargeCategory) => {
  switch (holdChargeCategory) {
    case EHoldChargeCategory.AdditionalFee:
      return 'Charged for Additional Fees';
    case EHoldChargeCategory.RevisedFee:
      return 'Charged for Rent Due';
    default:
      return '';
  }
};

export const getCategorizedChargeList = (charges: THoldPaymentChargeHistory[]): { chargeCategory: EHoldChargeCategory; totalAmount: number }[] => {
  const summaryMap = new Map<EHoldChargeCategory, number>();

  charges.forEach(({ chargeCategory, chargeAmount }) => {
    summaryMap.set(chargeCategory, (summaryMap.get(chargeCategory) || 0) + chargeAmount);
  });

  // console.log(charges);

  return Array.from(summaryMap.entries()).map(([chargeCategory, totalAmount]) => ({
    chargeCategory,
    totalAmount,
  }));
};
