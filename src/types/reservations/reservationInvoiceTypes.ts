import { IPaymentTransactionHistoryItem } from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelInvoice/InvoicePDFDownloader';
import { EPriceAdjustment } from '../commonTypes';
import { AdditionalCharges, TRevisedCoverage, TRevisedVehicle } from '../travels/typeTravels';
import { TAddressInfo } from '../user-verification/userVerificationTypes';

type CombineAllFeeItemsResponse = {
  itemType?: EPriceAdjustment;
  itemName: string;
  cost?: number;
  additionalCharges?: AdditionalCharges[];
};

export type ChargeSummaryValue = {
  methodName: string;
  amount: number;
};

export type ReservationInvoiceInfoData = {
  combinedFeeList: CombineAllFeeItemsResponse[];
  invoiceSubtotal: number;
  invoiceTotalDue: number;
  invoiceTotalPaid: number;
  additionalFeeSubtotal: number;
  additionalFeeDue: number;
  additionalFeePaidAmount: number;
  rentPaidAmount: number;
  rentDueAmount: number;
  reservationId: number;
  guestInfo: InvoiceGuestInfo;
  companyInfo: InvoiceCompanyInfo;
  vehicleLicense: string;
  creditAmountUsed: number;
  voucherAmountUsed: number;
  chargeSummaryList: ChargeSummaryValue[] | [];
  paymentTransactionHistory: IPaymentTransactionHistoryItem[] | [];
  totalReturnedAmount?: number;
  invoiceTitle: string;

  totalDeliveryFee?: number;
  totalReturnFee?: number;
  deliveryFeeDiscount?: number;
  returnFeeDiscount?: number;

  replacementVehicleInfo?: TRevisedVehicle;
  upgradedCoverageInfo?: TRevisedCoverage;
};

export type InvoiceGuestInfo = {
  guestName: string;
  guestPhoneNumber: string;
  email: string;
  residentialAddressInfo: TAddressInfo;
};

export type InvoiceCompanyInfo = {
  companyName: string;
  companyAddress: string;
};
