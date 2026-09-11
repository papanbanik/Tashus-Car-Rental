'use client';

import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { ChargeSummaryValue, InvoiceCompanyInfo, InvoiceGuestInfo } from '@/types/reservations/reservationInvoiceTypes';
import { TPaymentCategory, TPaymentMethod } from '@/types/travels/travelEnums';
import { ReservationAdditionalFeeItems, TInvoiceReservationWaiveFees } from '@/types/travels/typeTravels';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import { IoMdDownload } from 'react-icons/io';
import TravelInvoicePDFContent from './TravelInvoicePDFContent';

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), { ssr: false });
const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), { ssr: false });

export interface IPaymentTransactionHistoryItem {
  actualCardPaidAmount?: number;
  cardAmountUsed?: number;
  creditAmountUsed?: number;
  voucherAmountUsed?: number;
  createdAt: string;
  updatedAt: string;
  paymentCategory: TPaymentCategory;
  paymentMethod: TPaymentMethod;
  paymentType?: string;
  totalAmount: number;
  transactionType?: string;
}

export interface InvoicePDFDownloaderProps {
  combinedFeeList: ReservationAdditionalFeeItems[];
  invoiceSubtotal: number;
  invoiceTotalDue: number;
  invoiceTotalPaid: number;
  reservationId: number;
  guestInfo: InvoiceGuestInfo;
  companyInfo: InvoiceCompanyInfo;
  vehicleLicense: string;
  creditAmountUsed: number;
  voucherAmountUsed: number;
  chargeSummaryList: ChargeSummaryValue[] | [];
  invoiceTitle: string;
  combineWaivedAmount?: TInvoiceReservationWaiveFees;
  discountAmount?: number;
  creditedAmount?: number;
  paymentTransactionHistory?: IPaymentTransactionHistoryItem[];
  totalReturnedAmount?: number;
  pickupDate?: Date | string;
  returnDate?: Date | string;
}

const InvoicePDFDownloader = (props: InvoicePDFDownloaderProps) => {
  const pdfDocument = <TravelInvoicePDFContent {...props}></TravelInvoicePDFContent>;

  return (
    <div className="flex flex-col">
      {pdfDocument?.props && (
        <div>
          <Button variant="contained" className="normal-case m-2 text-white">
            <PDFDownloadLink
              style={{ textDecoration: 'none' }}
              document={pdfDocument}
              fileName={`${props?.reservationId || 'Unknown'}_Reservation_Invoice.pdf`}
            >
              {/* @ts-ignore */}
              {(
                { loading }: { loading: boolean } // <-- Explicitly type loading as boolean
              ) =>
                loading ? (
                  <span className="text-white">Loading Invoice...</span>
                ) : (
                  <CommonTextIcon text="Invoice" className="text-white" startIcon={<IoMdDownload className="text-white mr-2" />} />
                )
              }
            </PDFDownloadLink>
          </Button>
        </div>
      )}
      {/* <PDFViewer style={addFeePDFStyles.viewer} showToolbar={false}>
        {pdfDocument}
      </PDFViewer> */}
    </div>
  );
};

export default InvoicePDFDownloader;
