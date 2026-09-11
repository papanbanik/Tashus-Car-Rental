import { Amount } from '@/types/componentTypes';
import { EPaymentStatus } from '@/types/travels/travelEnums';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import PaymentDetailsModal from './PaymentDetailsModal';
const TravelPaymentDetails = ({ reservationInfo, reservationItem, isModal }: any & { isModal?: boolean }) => {
  const [paymentData, setPaymentData] = useState<Amount[]>([]);
  useEffect(() => {
    if (reservationInfo && reservationInfo?.paymentStatus === 'paid') {
      const voucherCode = !!reservationItem
        ? reservationItem?.additionalPaymentInfo?.voucherCode
        : reservationInfo?.additionalPaymentInfo?.voucherCode;
      const voucherAmount = !!reservationItem
        ? reservationItem?.additionalPaymentInfo?.voucherAmountUsed
        : reservationInfo?.additionalPaymentInfo?.voucherAmountUsed;
      const isVoucherCodeUse = !!reservationItem
        ? reservationItem?.additionalPaymentInfo?.voucherAmountUsed && reservationItem?.additionalPaymentInfo?.voucherCode
        : reservationInfo?.additionalPaymentInfo?.voucherAmountUsed && reservationInfo?.additionalPaymentInfo?.voucherCode;
      const useCredit = !!reservationItem
        ? reservationItem?.additionalPaymentInfo?.creditAmountUsed
        : reservationInfo?.additionalPaymentInfo?.creditAmountUsed;
      const useCard = !!reservationItem
        ? reservationItem?.additionalPaymentInfo?.cardAmountUsed
        : reservationInfo?.additionalPaymentInfo?.cardAmountUsed;
      const newPaymentData: Amount[] = [
        isVoucherCodeUse && {
          label: 'Used Voucher Code',
          amount: `${voucherCode ?? ''}`,
        },
        isVoucherCodeUse && {
          label: 'Used Voucher Amount',
          amount: `$${voucherAmount ?? 0}`,
        },
        useCredit && {
          label: 'Used Credit',
          amount: `$${useCredit ?? 0}`,
        },
        useCard && {
          label: 'Used Card',
          amount: `$${useCard ?? 0}`,
        },
      ].filter(Boolean) as any[];
      setPaymentData(newPaymentData);
    }
  }, [reservationInfo]);
  return (
    <>
      {(reservationInfo?.paymentStatus === EPaymentStatus.Paid || reservationInfo?.paymentStatus === EPaymentStatus.PartiallyPaid) &&
        paymentData?.length > 0 && (
          <>
            {!isModal ? (
              <div className="border border-solid border-accent p-4 rounded-lg">
                <div className="flex flex-col">
                  {/* Title*/}
                  <div className="flex justify-between items-center my-2">
                    <span className="text-lg font-bold">Payment Details</span>
                  </div>
                </div>
                <TableContainer component={Paper} className="bg-transparent">
                  <Table>
                    <TableBody>
                      {paymentData?.map((item: Amount, index: number) => (
                        <TableRow key={index} className={`${index % 2 === 0 ? 'bg-[#ececec]' : 'bg-[#fafafa]'}`}>
                          <TableCell>
                            <span>{item.label}</span>
                          </TableCell>
                          <TableCell align="right" className="text-success">
                            {item.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <PaymentDetailsModal paymentData={paymentData} />
            )}
          </>
        )}
    </>
  );
};

export default TravelPaymentDetails;
