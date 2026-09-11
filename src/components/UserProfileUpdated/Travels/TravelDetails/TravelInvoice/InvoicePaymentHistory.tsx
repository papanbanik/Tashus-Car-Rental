import { EPaymentCategory, EPaymentMethod } from '@/types/travels/travelEnums';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { convertToThousandSeparator } from '@/utils/Functions/randomCommonFn';
import { categorySimplify } from '@/utils/Functions/transactionCommonFn';
import { getPaymentMethod } from '@/utils/Functions/travelCommonFn';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { IPaymentTransactionHistoryItem } from './InvoicePDFDownloader';

interface PaymentHistoryProps {
  paymentTransactionHistory?: IPaymentTransactionHistoryItem[] | [];
  totalReturnedAmount?: number;
}

const InvoicePaymentHistory: React.FC<PaymentHistoryProps> = ({ paymentTransactionHistory = [], totalReturnedAmount }) => {
  const shouldShowTable =
    paymentTransactionHistory &&
    paymentTransactionHistory?.length > 0 &&
    !(
      paymentTransactionHistory?.length === 1 &&
      (paymentTransactionHistory[0]?.paymentMethod === EPaymentMethod.OnlyVoucher ||
        paymentTransactionHistory[0]?.paymentMethod === EPaymentMethod.OnlyVoucherWithHold)
    );

  if (!shouldShowTable) {
    return null;
  }

  const filteredTransactions = paymentTransactionHistory?.filter((transaction) => {
    // If there are multiple transactions, filter out OnlyVoucher transactions
    if (
      paymentTransactionHistory?.length > 1 &&
      (transaction?.paymentMethod === EPaymentMethod.OnlyVoucher ||
        transaction?.paymentMethod === EPaymentMethod.OnlyVoucherWithHold ||
        transaction?.paymentCategory === EPaymentCategory.Refunded)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="my-4">
      <Box className="mt-8">
        <Typography variant="h6" className="md:text-xl text-lg font-bold pl-4">
          Payment History
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="border-b border-gray-800">
                <TableCell className="py-3 px-4 text-left font-semibold text-gray-700 ">SL</TableCell>
                <TableCell className="py-3 px-4 text-left font-semibold text-gray-700 ">Payment Category</TableCell>
                <TableCell className="py-3 px-4 text-left font-semibold text-gray-700 ">Payment Method</TableCell>
                <TableCell className="py-3 px-4 text-left font-semibold text-gray-700 ">Time</TableCell>
                <TableCell className="py-3 px-4 text-right font-semibold text-gray-700 ">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTransactions.map((transaction, index) => (
                <TableRow key={index} className="border-b border-gray-500 hover:bg-gray-50 transition-colors duration-200">
                  <TableCell className="py-3 px-4 ">{index + 1}</TableCell>
                  <TableCell className="py-3 px-4 ">{categorySimplify(transaction.paymentCategory as any) || '-'}</TableCell>
                  <TableCell className="py-3 px-4 ">
                    {transaction.paymentMethod === EPaymentMethod?.CardWithVoucher || transaction.paymentMethod === EPaymentMethod.CardWithCredit
                      ? 'Card'
                      : getPaymentMethod(transaction.paymentMethod as any) || '-'}
                  </TableCell>
                  <TableCell className="py-3 px-4 ">{formatFullDateTime(dayjs(transaction.updatedAt)) || '-'}</TableCell>
                  <TableCell className="py-3 px-4 text-right ">
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
                  </TableCell>
                </TableRow>
              ))}

              {/* Refund Amount Row */}
              {Number(totalReturnedAmount || 0) > 0 && (
                <TableRow className="border-t-2 border-gray-400 mt-4">
                  <TableCell className="py-3 px-4 border-0"></TableCell>
                  <TableCell className="py-3 px-4 font-semibold text-gray-800 " colSpan={3}>
                    Refund Amount
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right font-semibold text-black ">
                    -${convertToThousandSeparator(totalReturnedAmount ?? 0)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default InvoicePaymentHistory;
