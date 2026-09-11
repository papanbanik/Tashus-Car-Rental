import { ERefundPaymentMethod, PaymentCategory, PaymentMethod, PaymentType } from '@/types/user-profile/transactionsTypes';
import dayjs from 'dayjs';

export const paymentStatus = (paymentCategory: string, role: string) => {
  if (role === 'guest') {
    switch (paymentCategory) {
      case 'cancellationFeeWithRefund':
        return 'Refund Request';
      // case 'hostCancellationFee':
      //   return 'Refund Request';
      default:
        return '';
      // return 'Paid';
    }
  } else {
    return '';
    // switch (paymentCategory) {
    //   case 'paid':
    //     return 'Paid';
    //   case 'guestCancellationFee':
    //     return 'Pending Payment';
    //   case 'rental':
    //     return 'Pending Payment';
    //   default:
    //     return '';
    // }
  }
};

export const categorySimplify = (paymentCategory: PaymentCategory | PaymentType): string => {
  switch (paymentCategory) {
    case PaymentCategory.Rental:
      return 'Rent Fee';
    case PaymentCategory.CancellationFee:
      return 'Cancellation Fee';
    case PaymentCategory.GuestCancellationFee:
      return 'Guest Cancellation Fee';
    case PaymentCategory.HostCancellationFee:
      return 'Host Cancellation Fee';
    case PaymentCategory.CancellationFeeWithRefund:
      return 'Cancellation Fee with Refund';
    case PaymentCategory.RevisedFeeWithRefund:
      return 'Revised Fee with Refund';
    case PaymentCategory.RevisedFee:
      return 'Revised Fee';
    case PaymentCategory.FuelFee:
      return 'Fuel Fee';
    case PaymentCategory.TollFee:
      return 'Toll Fee';
    case PaymentCategory.RefundRequest:
      return 'Request for Refund';
    case PaymentCategory.PaymentRequest:
      return 'Request for Refund';
    case PaymentCategory.Payout:
      return 'Payout';
    case PaymentCategory.Refunded:
      return 'Refunded';
    case PaymentCategory.AdditionalFee:
      return 'Additional Fee';
    case PaymentType.HoldPayment:
      return 'Hold Payment';
    case PaymentCategory.TashusGuestCredit:
      return 'Guest Credit Adjustment';
    case PaymentCategory.VehicleReplacementCredit:
      return 'Vehicle Replacement';
    case PaymentCategory.ChangedVehicle:
      return 'Vehicle Replacement Fee';
    case PaymentCategory.UpgradedCoverage:
      return 'Upgraded Coverage Fee';
    case PaymentCategory.ManualDeposit:
      return 'Manual Deposit';
    case PaymentCategory.HoldRefundAsCredit:
      return 'Hold Refund as Credit';
    default:
      return 'Others';
  }
};

export const paymentMethodSimplify = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case PaymentMethod.OnlyCard:
      return 'Card';
    case PaymentMethod.OnlyCredit:
      return 'Credit';
    case PaymentMethod.OnlyVoucher:
      return 'Voucher';
    case PaymentMethod.OnlyCreditWithHold:
      return 'Credit & Hold';
    case PaymentMethod.OnlyVoucherWithHold:
      return 'Voucher & Hold';
    case PaymentMethod.CardWithCredit:
      return 'Card + Credit';
    case PaymentMethod.CardWithVoucher:
      return 'Card + Voucher';
    case PaymentMethod.NoPayment:
      return 'No Payment';
    case PaymentMethod.IssuedCredit:
      return 'Issued Credit';
    case PaymentMethod.CashPayment:
      return 'Cash';
    case PaymentMethod.BankTransfer:
      return 'Bank Transfer';
    case PaymentMethod.CreditApplied:
      return 'Credit Applied';
    case PaymentMethod.OtherPayment:
      return 'Other';
    case PaymentMethod.ChargeWithSavedCard:
      return 'Charged Via Card';
    case PaymentMethod.ManualStripeCharge:
      return 'Charged Via Stripe';
    case PaymentMethod.HoldDeposit:
      return 'Charged from Hold Deposit';
    default:
      return 'Others';
  }
};

export const refundPaymentMethodSimplify = (paymentMethod: ERefundPaymentMethod) => {
  switch (paymentMethod) {
    case ERefundPaymentMethod.Card:
      return 'Card';
    case ERefundPaymentMethod.Bank:
      return 'Bank';
    case ERefundPaymentMethod.Cash:
      return 'Cash';
    case ERefundPaymentMethod.Other:
      return 'Other';
    default:
      return 'Others';
  }
};

export const dateConverter = (dateString: string) => {
  // const isoDateString: string = "2023-10-13T03:00:53.561Z";
  const dateObject: Date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  };

  // const formattedDate: string = dateObject.toLocaleDateString('en-US', options);
  const formattedDate: string = dateObject.toLocaleDateString('en-AU', options);
  return formattedDate;
};

export const getNextMonthDateRange = () => {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const startDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  const endDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 10);

  // Format the date strings as "MMM DD"
  // const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  // const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  const startFormatted = startDate.toLocaleDateString('en-AU', { month: 'short', day: '2-digit' });
  const endFormatted = endDate.toLocaleDateString('en-AU', { month: 'short', day: '2-digit' });

  // setNextPayoutDate(`${startFormatted.toUpperCase()} - ${endFormatted.toUpperCase()}`);
  return `${startFormatted.toUpperCase()} - ${endFormatted.toUpperCase()}`;
};

export const getLastPayoutDate = (transactions: any[], role: string) => {
  if (role === 'partner' && transactions?.length > 0) {
    const payoutTransactionList = transactions
      ?.filter((tr) => tr?.paymentCategory === 'payout')
      ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const lastPayoutDate = payoutTransactionList?.length > 0 ? dayjs(payoutTransactionList[0]?.createdAt).format('DD MMM, YYYY') : undefined;
    return lastPayoutDate;
  } else return undefined;
};

export const getRefundableRequest = (transactions: any[]) => {
  let count = 0;
  if (transactions?.length > 0) {
    transactions?.forEach((transaction: any) => {
      if (
        transaction?.paymentCategory === PaymentCategory.RevisedFeeWithRefund ||
        transaction?.paymentCategory === PaymentCategory.CancellationFeeWithRefund
      ) {
        count++;
      }
    });
    // console.log('Refund Count', count);
  }
  return count;
};

export const getRefunded = (transactions: any[]) => {
  let count = 0;
  if (transactions?.length > 0) {
    transactions?.forEach((transaction: any) => {
      if (transaction?.paymentCategory === 'refunded') {
        count++;
      }
    });
  }
  return count;
};

export const premiumMinimum = 60;
export const standardMinimum = 30;
export const ultimateMinimum = 90;

export const calculateCoverageAmount = (guestCoverageType: string, coverageAmount: number): number => {
  switch (guestCoverageType) {
    case 'premium':
      return coverageAmount < premiumMinimum ? premiumMinimum : coverageAmount;
    case 'standard':
      return coverageAmount < standardMinimum ? standardMinimum : coverageAmount;
    case 'ultimate':
      return coverageAmount < ultimateMinimum ? ultimateMinimum : coverageAmount;
    default:
      return coverageAmount;
  }
};
