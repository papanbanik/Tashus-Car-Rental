import { EPaymentStatus } from '@/types/travels/travelEnums';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { getPaymentStatusChipColor } from '@/utils/Functions/randomCommonFn';
import { Chip, Divider } from '@mui/material';

const UpgradeBasicInfo = ({ paymentStatus, paymentMethod, dueAmount }: { paymentStatus?: string; paymentMethod?: string; dueAmount: number }) => {
  return (
    <div>
      <Divider className="border border-black my-1" />
      <span className="flex justify-between items-center px-2 bg-primary text-white">
        <span className="text-lg font-bold">Upgrade Basic Info</span>
      </span>
      <Divider className="border border-black my-1" />
      <div className="p-2">
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
        {dueAmount > 0 && (
          <span className={`flex justify-between items-center ${paymentStatus === EPaymentStatus.Pending ? 'text-error' : ''} `}>
            <span>{paymentStatus === EPaymentStatus.Pending ? 'Due' : ''} Payable Amount</span>
            <b>${parseFloatWithPrecision(dueAmount)}</b>
          </span>
        )}
      </div>
    </div>
  );
};

export default UpgradeBasicInfo;
