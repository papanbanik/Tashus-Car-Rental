import CommonTooltip from '@/components/Common/CommonTooltip';
import { Divider, IconButton } from '@mui/material';
import { IoInformationCircleOutline } from 'react-icons/io5';

type PaymentAmountCardProps = {
  withHoldPayment: boolean;
  depositAmount: number;
  paymentAmount: number;
  isOnlyHold?: boolean;
};
const PaymentAmountCard = ({ paymentAmount, depositAmount, withHoldPayment, isOnlyHold = false }: PaymentAmountCardProps) => {
  return (
    <div className="border border-solid border-accent rounded-md p-4 my-2">
      {!isOnlyHold && (
        <span className="flex justify-between font-bold text-sm md:text-md">
          <span>Total Payable</span>
          <span>${paymentAmount}</span>
        </span>
      )}
      {withHoldPayment && (
        <>
          {isOnlyHold ? '' : <Divider className="border-black my-2" />}
          <span className="flex justify-between text-sm md:text-md">
            <span className="flex items-center gap-1">
              On Hold{' '}
              <CommonTooltip title={'The hold amount will be returned after the trip is completed.'} arrow={true} placement="bottom">
                <IconButton className="p-0 m-0">
                  <IoInformationCircleOutline className="text-black text-sm md:text-md" size={15} />
                </IconButton>
              </CommonTooltip>
            </span>
            <span>${depositAmount}</span>
          </span>
        </>
      )}
    </div>
  );
};

export default PaymentAmountCard;
