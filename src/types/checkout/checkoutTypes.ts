import { IDiscountAdditionalData } from '@/components/Search/ReservationCheckout/ReservationCheckout';
import { Dispatch, SetStateAction } from 'react';
import { TDate, TPaymentMethods } from '../commonTypes';
import { TGuestInsurance } from './guestVerificationTypes';

export type TGstData = {
  gstAmount: number;
  payableWithGst?: number;
};

export interface CheckoutActionProps {
  discount: number | any;
  setDiscount: Dispatch<SetStateAction<number | any>>;
  totalAmountAfterDiscount: number | any;
  setTotalAmountAfterDiscount: Dispatch<SetStateAction<number | any>>;
  creditVoucherToggle: boolean | any;
  setCreditVoucherToggle: Dispatch<SetStateAction<boolean | any>>;
  discountAdditionalData: IDiscountAdditionalData;
}
export interface PriceItem {
  date: TDate;
  price: number;
}

export interface VoucherRule {
  field: string;
  id: string;
  operator: string;
  value: string;
  valueSource: string;
}

export interface VoucherDetailsType {
  _id: string;
  createdAt: string;
  description: string;
  discountAmount: number;
  discountType: string;
  expiresAt: string;
  isActive: boolean;
  isExpired: boolean;
  maxDiscountAmount: number;
  maxUsageCount: number;
  maxUsagePerUser: number;
  promotionId: string;
  updatedAt: string;
  voucherCode: string;
  voucherRules: VoucherRule[];
  voucherUsageAmount: number;
  voucherUsageCount: number;
  voucherUsedBy: string[];
}

//Components
export interface CommonCheckoutProps extends CheckoutActionProps {
  applyBtnShow: boolean;
  setApplyBtnShow: Dispatch<SetStateAction<boolean>>;
  discount: number;
  guestCoveragePackage: TGuestInsurance;
  gstData: TGstData;
  payable: number;
  setPaymentMethod: Dispatch<SetStateAction<TPaymentMethods>>;
  depositMessage?: JSX.Element | null;
}

export interface CreditCheckoutProps extends CommonCheckoutProps {
  validCredit: boolean;
  setValidCredit: Dispatch<SetStateAction<boolean>>;
  creditInputString: string;
  setCreditInputString: Dispatch<SetStateAction<string>>;
  // creditInput: number;
  // setCreditInput: Dispatch<SetStateAction<number>>;
}

export interface VoucherCheckoutProps extends CommonCheckoutProps {
  voucherInput: string;
  setVoucherInput: Dispatch<SetStateAction<string>>;
}

export interface CheckoutProps {
  payable: number;
  isAgreed: boolean;
  setIsAgreed: Dispatch<SetStateAction<boolean>>;
  handleCheckout: () => void;
  isLoading: boolean;
  depositMessage?: JSX.Element | null;
  totalAmountError?: boolean;
  confirmButtonDisabled: boolean;
}

export type TAppliedVoucherInfo = {
  isVoucherValid: boolean;
  responseMessage: string;
  discountAmount: number;
  discountType: string;
  totalAfterDiscount: number;
  voucherCode: string;
  voucherId: string;
};

export type TAppliedCreditInfo = {
  isCreditValid: boolean;
  responseMessage: string;
  deductedCreditAmount: number;
  totalAfterCredit: number;
  isDepositCoveredByCredit?: boolean;
};
