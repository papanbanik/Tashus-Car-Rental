import { TReservationHoldTransaction } from '@/types/user-profile/holdPaymentTransactionTypes';
import { getCategorizedChargeList, getHoldDepositStatus, getHoldTransactionPaymentMethod } from '@/utils/Functions/holdPaymentCommonFn';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ReactNode, useMemo } from 'react';
import { HoldAmountBreakdown } from './HoldAmountBreakdown';

type TDepositDetails = {
  key?: string;
  label?: ReactNode;
  value?: ReactNode;
  isRed?: boolean;
};

interface TravelHoldDepositInfoProps {
  depositAmount?: number;
  reservationHoldTransaction?: TReservationHoldTransaction;
}

const TravelHoldDepositInfo = ({ reservationHoldTransaction, depositAmount }: TravelHoldDepositInfoProps) => {
  const {
    paymentMethod,
    holdPaymentStatus,
    holdPaymentChargeHistory = [],
    holdRefundHistory = [],
    additionalHoldPaymentInfo,
    actualCardPaidAmount,
    remainingDepositAmount,
    splitHoldPaymentHistory = [],
  } = reservationHoldTransaction ?? {};

  const holdDepositStatus = holdPaymentStatus ? getHoldDepositStatus(holdPaymentStatus) : '';
  const holdDepositPaymentMethod = paymentMethod ? getHoldTransactionPaymentMethod(paymentMethod) : '';
  const holdDepositAmount = depositAmount ?? actualCardPaidAmount;
  // Calculate refunded and credited amounts
  const { totalRefundedAmount, totalCreditedAmount } = useMemo(() => {
    if (!holdRefundHistory?.length) {
      return { totalRefundedAmount: 0, totalCreditedAmount: 0 };
    }

    return holdRefundHistory.reduce(
      (acc, item) => {
        const amount = item?.refundedAmount || 0;
        if (item?.refundType === 'credit') {
          acc.totalCreditedAmount += amount;
        } else {
          acc.totalRefundedAmount += amount;
        }
        return acc;
      },
      { totalRefundedAmount: 0, totalCreditedAmount: 0 }
    );
  }, [holdRefundHistory]);

  const categorizedChargeList = getCategorizedChargeList(holdPaymentChargeHistory) ?? [];

  const depositDetails: TDepositDetails[] = [
    { label: 'Deposit Method', value: holdDepositPaymentMethod },
    { label: 'Deposit Status', value: holdDepositStatus },
    {
      label: 'Deposit Amount',
      value: (
        <div className="flex flex-col items-end w-full max-w-[250px] ml-auto">
          <HoldAmountBreakdown record={reservationHoldTransaction ?? {}} />
        </div>
      ),
    },
  ].filter((item) => item.value); // Remove empty values

  return (
    <div className="my-4">
      <span className="md:text-xl text-lg font-bold pl-4">Hold Deposit Details</span>
      <Table>
        <TableBody>
          {depositDetails.map(({ key, label, value, isRed }, index) => (
            <TableRow key={key || index}>
              <TableCell sx={{ verticalAlign: 'top' }}>{label}</TableCell>
              <TableCell align="right" className={isRed ? 'text-error' : ''}>
                {value}
              </TableCell>
            </TableRow>
          ))}

          {/* {additionalHoldPaymentInfo?.reason && (
            <TableRow>
              <TableCell className="flex items-center">
                <span>Hold Reason</span>
                <Tooltip enterTouchDelay={0} title={additionalHoldPaymentInfo.reason} arrow placement="top">
                  <IconButton size="small">
                    <AiOutlineInfoCircle />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell align="right">-</TableCell>
            </TableRow>
          )} */}
        </TableBody>
      </Table>
    </div>
  );
};

export default TravelHoldDepositInfo;
