import { EPaymentCategory, EPaymentMethod } from '@/types/travels/travelEnums';
import { TInvoiceReservationWaiveFeeItem } from '@/types/travels/typeTravels';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { convertToThousandSeparator } from '@/utils/Functions/randomCommonFn';
import { categorySimplify } from '@/utils/Functions/transactionCommonFn';
import { getPaymentMethod } from '@/utils/Functions/travelCommonFn';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { InvoicePDFDownloaderProps } from './InvoicePDFDownloader';
import InvoicePDFHeader from './InvoicePDFHeader';
import InvoicePDFRow from './InvoicePDFRow';

const primaryColor = '#800080';

// Create addFeePDFStyles for PDF rendering
export const addFeePDFStyles = StyleSheet.create({
  table: { width: '100%', marginVertical: 10 },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderRow: { backgroundColor: '#dee2e6' },
  tableCellHeader: { marginVertical: 5, fontSize: 10, fontWeight: 'bold', padding: 3 },
  tableCell: { marginVertical: 5, fontSize: 10, padding: 3 },
  processingFeeTableCell: { fontSize: 9, paddingBottom: 3, paddingRight: 4 },
  subtotalCellAmount: { marginVertical: 5, fontSize: 10 },
  subtotalCellItem: { marginVertical: 5, fontSize: 10, padding: 3, fontWeight: 'bold', width: '50%', textAlign: 'right' },
  tableItem: { width: '50%' },
  tableAmount: { width: '46%', textAlign: 'right' },
  tableSerial: { width: '4%' },
  collapsibleRow: { paddingLeft: 20, width: '100%' },
  collapsibleRowList: { paddingLeft: 0, width: '100%' },
  iconButton: { fontSize: 10, padding: 3 },
  bottomBorder: { borderBottomWidth: 1, borderBottomColor: '#000', borderStyle: 'solid' },
  infoTitle: { fontSize: '12px', marginBottom: '5px' },
  infoText: { fontSize: '12px', color: 'grey' },
  viewer: {
    width: '100%',
    height: '100%',
  },
  page: {
    padding: '20px 40px',
    paddingBottom: '60px',
  },
  footer: {
    bottom: '20px',
    right: '40px',
    paddingLeft: '40px',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '10px',
  },

  // New styles for payment history table
  paymentHistoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 3,
    textAlign: 'left',
  },
  paymentHistoryTable: {
    width: '100%',
    marginVertical: 10,
  },
  paymentHistoryRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    borderStyle: 'solid',
    paddingVertical: 5,
  },
  paymentHistoryCell: {
    fontSize: 10,
    padding: 3,
  },
  paymentHistorySerial: { width: '8%' },
  paymentHistoryCategory: { width: '30%' },
  paymentHistoryMethod: { width: '25%' },
  paymentHistoryTime: { width: '25%' },
  paymentHistoryAmount: { width: '12%', textAlign: 'right', color: 'green' },
});

const TravelInvoicePDFContent = ({
  reservationId,
  combinedFeeList,
  invoiceSubtotal,
  invoiceTotalDue,
  invoiceTotalPaid,
  guestInfo,
  companyInfo,
  vehicleLicense,
  creditAmountUsed,
  voucherAmountUsed,
  chargeSummaryList,
  invoiceTitle,
  combineWaivedAmount,
  discountAmount = 0,
  creditedAmount = 0,
  paymentTransactionHistory,
  totalReturnedAmount,
  pickupDate,
  returnDate,
}: InvoicePDFDownloaderProps) => {
  return (
    <Document>
      <Page size="A4" style={addFeePDFStyles.page}>
        <View
          fixed
          render={({ pageNumber }) => (
            <InvoicePDFHeader
              reservationId={reservationId}
              pageNumber={pageNumber}
              vehicleLicense={vehicleLicense}
              guestInfo={guestInfo}
              companyInfo={companyInfo}
              invoiceTitle={invoiceTitle}
              pickupDate={pickupDate}
              returnDate={returnDate}
            ></InvoicePDFHeader>
          )}
        />
        <View style={addFeePDFStyles.table}>
          {/* Table Header */}
          <View style={[addFeePDFStyles.tableRow, addFeePDFStyles.tableHeaderRow]}>
            <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.tableSerial]}>SL</Text>
            <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.tableItem]}>Item</Text>
            <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.tableAmount]}>Amount</Text>
          </View>

          {/* Table Body */}
          {combinedFeeList?.map((feeItem, index) => (
            <InvoicePDFRow key={index} feeItem={feeItem} serial={index + 1} reservationId={reservationId} />
          ))}

          {/* Table Body-waive fees */}
          {combineWaivedAmount?.waiveFees &&
            combineWaivedAmount?.waiveFees?.length > 0 &&
            combineWaivedAmount?.waiveFees?.map((feeItem: TInvoiceReservationWaiveFeeItem, index) => (
              <InvoicePDFRow key={index} waiveFeeItem={feeItem} serial={(combinedFeeList?.length ?? 0) + (index + 1)} isWaiveFee={true} />
            ))}

          {/* Subtotal Row */}
          <View style={addFeePDFStyles.tableRow}>
            <Text style={addFeePDFStyles.tableCell}></Text>
            <Text style={addFeePDFStyles.subtotalCellItem}>Subtotal</Text>
            <Text style={[addFeePDFStyles.subtotalCellAmount, addFeePDFStyles.tableAmount, { width: '50%', color: primaryColor }]}>
              ${convertToThousandSeparator(invoiceSubtotal)}
            </Text>
            <Text style={addFeePDFStyles.tableCell}></Text>
          </View>

          {/* Voucher Discount Row */}
          {voucherAmountUsed > 0 && (
            <View style={addFeePDFStyles.tableRow}>
              <Text style={addFeePDFStyles.tableCell}></Text>
              <Text style={addFeePDFStyles.subtotalCellItem}>Voucher Discount</Text>
              <Text style={[addFeePDFStyles.subtotalCellAmount, addFeePDFStyles.tableAmount, { width: '50%' }]}>
                -${convertToThousandSeparator(voucherAmountUsed)}
              </Text>
              <Text style={addFeePDFStyles.tableCell}></Text>
            </View>
          )}

          {/* Vehicle Replacement Discount */}
          {discountAmount > 0 && (
            <View style={addFeePDFStyles.tableRow}>
              <Text style={addFeePDFStyles.tableCell}></Text>
              <Text style={addFeePDFStyles.subtotalCellItem}>Discount Amount (Vehicle Replacement)</Text>
              <Text style={[addFeePDFStyles.subtotalCellAmount, addFeePDFStyles.tableAmount, { width: '50%' }]}>
                ${convertToThousandSeparator(discountAmount)}
              </Text>
              <Text style={addFeePDFStyles.tableCell}></Text>
            </View>
          )}
          {creditedAmount > 0 && (
            <View style={addFeePDFStyles.tableRow}>
              <Text style={addFeePDFStyles.tableCell}></Text>
              <Text style={addFeePDFStyles.subtotalCellItem}>Credited Amount (Vehicle Replacement)</Text>
              <Text style={[addFeePDFStyles.subtotalCellAmount, addFeePDFStyles.tableAmount, { width: '50%' }]}>
                ${convertToThousandSeparator(creditedAmount)}
              </Text>
              <Text style={addFeePDFStyles.tableCell}></Text>
            </View>
          )}

          {/* Used credit */}
          {/* {creditAmountUsed > 0 && (
            <View style={addFeePDFStyles.tableRow}>
              <Text style={addFeePDFStyles.tableCell}></Text>
              <Text style={addFeePDFStyles.subtotalCellItem}>Used Credit </Text>
              <Text style={[addFeePDFStyles.subtotalCellAmount, addFeePDFStyles.tableAmount, { width: '50%' }]}>
                -${convertToThousandSeparator(creditAmountUsed)}
              </Text>
              <Text style={addFeePDFStyles.tableCell}></Text>
            </View>
          )} */}

          {/* Paid Row */}
          <View style={addFeePDFStyles.tableRow}>
            <Text style={addFeePDFStyles.tableCell}></Text>
            <Text style={addFeePDFStyles.subtotalCellItem}>Paid</Text>
            <View
              style={[addFeePDFStyles.subtotalCellAmount, addFeePDFStyles.tableAmount, { width: '50%', display: 'flex', flexDirection: 'column' }]}
            >
              <Text style={{ color: '#008000' }}>${convertToThousandSeparator(invoiceTotalPaid)}</Text>
              {/* {creditAmountUsed > 0 && <Text style={{ fontSize: '8px' }}>*Used ${creditAmountUsed} credit</Text>}
              {chargeSummaryList?.length > 0 && (
                <>
                  <Text style={{ fontSize: '9px', fontWeight: 'bold' }}>{`Additional Fees Charging Summary: `}</Text>
                  {chargeSummaryList?.map((chargeInfo, index) => (
                    <Text key={index} style={{ fontSize: '8px' }}>{`$${chargeInfo?.amount} ${chargeInfo?.methodName}`}</Text>
                  ))}
                </>
              )} */}
            </View>
            <Text style={addFeePDFStyles.tableCell}></Text>
          </View>

          {/* Total due Row */}
          <View style={addFeePDFStyles.tableRow}>
            <Text style={addFeePDFStyles.tableCell}></Text>
            <Text style={addFeePDFStyles.subtotalCellItem}>Due</Text>
            <Text style={[addFeePDFStyles.subtotalCellAmount, addFeePDFStyles.tableAmount, { width: '50%', color: 'red' }]}>
              ${convertToThousandSeparator(invoiceTotalDue)}
            </Text>
            <Text style={addFeePDFStyles.tableCell}></Text>
          </View>
        </View>

        {/* Payment History Table */}
        {paymentTransactionHistory &&
          paymentTransactionHistory.length > 0 &&
          !(
            paymentTransactionHistory.length === 1 &&
            (paymentTransactionHistory[0]?.paymentMethod === EPaymentMethod.OnlyVoucher ||
              paymentTransactionHistory[0]?.paymentMethod === EPaymentMethod.OnlyVoucherWithHold)
          ) && (
            <View>
              <Text style={addFeePDFStyles.paymentHistoryTitle}>Payment History</Text>
              <View style={addFeePDFStyles.paymentHistoryTable}>
                {/* Payment History Header */}
                <View style={[addFeePDFStyles.paymentHistoryRow, addFeePDFStyles.bottomBorder]}>
                  <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.paymentHistorySerial]}>SL</Text>
                  <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.paymentHistoryCategory]}>Payment Category</Text>
                  <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.paymentHistoryMethod]}>Payment Method</Text>
                  <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.paymentHistoryTime]}>Time</Text>
                  <Text style={[addFeePDFStyles.tableCellHeader, addFeePDFStyles.paymentHistoryAmount]}>Amount</Text>
                </View>

                {/* Payment History Rows */}
                {paymentTransactionHistory
                  ?.filter((transaction) => {
                    // If there are multiple transactions, filter out OnlyVoucher transactions
                    if (
                      paymentTransactionHistory.length > 1 &&
                      (transaction?.paymentMethod === EPaymentMethod.OnlyVoucher ||
                        transaction?.paymentMethod === EPaymentMethod.OnlyCreditWithHold ||
                        transaction?.paymentCategory === EPaymentCategory.Refunded)
                    ) {
                      return false;
                    }
                    return true;
                  })
                  ?.map((transaction, index) => (
                    <View key={index} style={addFeePDFStyles.paymentHistoryRow}>
                      <Text style={[addFeePDFStyles.paymentHistoryCell, addFeePDFStyles.paymentHistorySerial]}>{index + 1}.</Text>
                      <Text style={[addFeePDFStyles.paymentHistoryCell, addFeePDFStyles.paymentHistoryCategory]}>
                        {categorySimplify(transaction.paymentCategory as any) || '-'}
                      </Text>
                      <Text style={[addFeePDFStyles.paymentHistoryCell, addFeePDFStyles.paymentHistoryMethod]}>
                        {transaction.paymentMethod === EPaymentMethod?.CardWithVoucher || transaction.paymentMethod === EPaymentMethod.CardWithCredit
                          ? 'Card'
                          : getPaymentMethod(transaction.paymentMethod as any) || '-'}
                      </Text>
                      <Text style={[addFeePDFStyles.paymentHistoryCell, addFeePDFStyles.paymentHistoryTime]}>
                        {formatFullDateTime(dayjs(transaction.updatedAt)) || '-'}
                      </Text>
                      <Text style={[addFeePDFStyles.paymentHistoryCell, addFeePDFStyles.paymentHistoryAmount]}>
                        $
                        {convertToThousandSeparator(
                          transaction?.paymentCategory === EPaymentCategory.AdditionalFee ||
                            transaction?.paymentCategory === EPaymentCategory.RevisedFee ||
                            transaction?.paymentMethod === EPaymentMethod.CashPayment ||
                            transaction?.paymentMethod === EPaymentMethod.ManualStripeCharge ||
                            transaction?.paymentMethod === EPaymentMethod.CreditApplied ||
                            transaction?.paymentMethod === EPaymentMethod.OtherPayment ||
                            transaction?.paymentMethod === EPaymentMethod.BankTransfer ||
                            transaction?.paymentMethod === EPaymentMethod.OnlyVoucher
                            ? transaction.totalAmount ?? 0
                            : transaction.actualCardPaidAmount
                            ? transaction.actualCardPaidAmount
                            : transaction.creditAmountUsed ?? 0
                        )}
                      </Text>
                    </View>
                  ))}

                {/* Refund Amount Row */}
                {totalReturnedAmount && totalReturnedAmount > 0 && (
                  <View
                    style={[addFeePDFStyles.paymentHistoryRow, { borderTopWidth: 1, borderTopColor: '#e0e0e0', borderStyle: 'solid', marginTop: 20 }]}
                  >
                    <Text style={[addFeePDFStyles.paymentHistoryCell, addFeePDFStyles.paymentHistorySerial]}></Text>
                    <Text style={[addFeePDFStyles.paymentHistoryCell, { fontSize: 10, fontWeight: 'bold', width: '50%' }]}>Refund Amount</Text>
                    <Text
                      style={[
                        addFeePDFStyles.paymentHistoryCell,
                        addFeePDFStyles.paymentHistoryAmount,
                        { color: 'black', fontWeight: 'bold', textAlign: 'right', width: '50%' },
                      ]}
                    >
                      -${convertToThousandSeparator(totalReturnedAmount)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        {/* Footer */}
        <View fixed style={addFeePDFStyles.footer}>
          <Text style={{ paddingLeft: '40px' }}>{formatFullDateTime(dayjs())}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page No. ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default TravelInvoicePDFContent;
