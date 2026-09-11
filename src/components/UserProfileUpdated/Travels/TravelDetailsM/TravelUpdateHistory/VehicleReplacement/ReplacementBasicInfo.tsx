import { TDate } from '@/types/commonTypes';
import { EPaymentStatus } from '@/types/travels/travelEnums';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { getPaymentStatusChipColor } from '@/utils/Functions/randomCommonFn';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Chip, Divider } from '@mui/material';

const ReplacementBasicInfo = ({
  reason,
  paymentStatus,
  paymentMethod,
  payableAmount,
  discountAmount,
  creditedAmount,
  replacementDate,
}: {
  reason: string;
  paymentStatus?: string;
  paymentMethod?: string;
  payableAmount: number;
  discountAmount: number;
  creditedAmount: number;
  replacementDate?: TDate;
}) => {
  return (
    <div>
      <Divider className="border border-black my-1" />
      <span className="flex justify-between items-center px-2 bg-primary text-white">
        <span className="text-lg font-bold">Replacement Basic Info</span>
      </span>
      <Divider className="border border-black my-1" />
      <div className="p-2">
        <span>
          Replacement Reason: <b>{reason}</b>
        </span>
        <Divider className="my-2" />
        <div className="flex justify-between items-center">
          {!!paymentStatus && (
            <span className="capitalize">
              Payment Status: <Chip label={paymentStatus} color={getPaymentStatusChipColor(paymentStatus)} size="small" />
            </span>
          )}
          {!!paymentMethod && (
            <span className="capitalize">
              Payment Method: <Chip label={paymentMethod} color="success" size="small" />
            </span>
          )}
        </div>
        <Divider className="my-2" />
        {creditedAmount > 0 && (
          <span className="flex justify-between items-center">
            <span>Credited Amount</span>
            <b>${parseFloatWithPrecision(creditedAmount)}</b>
          </span>
        )}
        {payableAmount > 0 && (
          <span className={`flex justify-between items-center ${paymentStatus === EPaymentStatus.Pending ? 'text-error' : ''} `}>
            <span>{paymentStatus === EPaymentStatus.Pending ? 'Due' : ''} Payable Amount</span>
            <b>${parseFloatWithPrecision(payableAmount)}</b>
          </span>
        )}
        {discountAmount > 0 && (
          <span className="flex justify-between items-center">
            <span>Discount Amount</span>
            <b>${parseFloatWithPrecision(discountAmount)}</b>
          </span>
        )}
        <Divider className="my-2" />
        {!!replacementDate && (
          <span className="flex justify-between items-center">
            <span>Replacement Date</span>
            <b>{formatFullDateTimeUtc(replacementDate)}</b>
          </span>
        )}
      </div>
    </div>
  );
};

export default ReplacementBasicInfo;
