import { TBillingDetails } from '@/types/travels/typeEditTravels';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

export interface BillingBreakdownProps {
  billingDetails: TBillingDetails;
  coveragePercentage: number;
  title: string;
}
const BillingBreakdown = ({ billingDetails, coveragePercentage, title }: BillingBreakdownProps) => {
  const {
    newDuration,
    newDurationPrice,
    newLongBookingDis,
    newAdvBookingDis,
    penaltyPrice,
    newCoverageAmount,
    newTotalWithoutCoverage,
    totalWithoutPenalty,
    newGstAmount,
    refundableAmount,
    additionalPaymentInfo,
    newTotalPrice,
    inconvenienceToolTip,
  } = billingDetails ?? {};
  return (
    <div className="grid grid-cols-2 lg:w-1/2 lg:mt-0 mt-4 justify-start items-start">
      <p className="m-0 font-semibold whitespace-nowrap">{title}</p>
      <Divider className="col-span-12 my-2" />
      <div className="flex col-span-12 justify-between items-start w-full">
        <p className="m-0">{newDuration}</p>
        <p className="m-0">
          {'$'}
          {newDurationPrice?.toFixed(2)}
        </p>
      </div>
      {newLongBookingDis && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">{newLongBookingDis?.text}</p>
            <p className="m-0 text-error">
              {'-$'}
              {newLongBookingDis?.calculatedAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      {newAdvBookingDis && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">{newAdvBookingDis?.text}</p>
            <p className="m-0 text-error">
              {'-$'}
              {newAdvBookingDis?.calculatedAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      <div className="col-span-12 mt-2 bg-black h-[1px]"></div>
      <div className="flex col-span-12 justify-between items-center w-full">
        <p className="m-0 font-bold">Updated Total</p>
        <p className="m-0 font-bold">
          {'$'}
          {!penaltyPrice ? newTotalWithoutCoverage?.toFixed(2) : totalWithoutPenalty?.toFixed(2)}
        </p>
      </div>
      {(newCoverageAmount ?? 0) > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">
              Coverage Amount
              <span>
                <Tooltip enterTouchDelay={0} title={`${coveragePercentage}% of rental amount`} placement="top">
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-success" />
                  </IconButton>
                </Tooltip>
              </span>
            </p>
            <p className="m-0 text-success">
              {'+$'}
              {newCoverageAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      {(newGstAmount ?? 0) > 0 && ( //gstAmount show change if calculated but not display
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">
              Gst Amount
              <span>
                <Tooltip enterTouchDelay={0} title={`10% GST`} placement="top">
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-success" />
                  </IconButton>
                </Tooltip>
              </span>
            </p>
            <p className="m-0 text-success">
              {'+$'}
              {newGstAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      {(penaltyPrice ?? 0) > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">
              Inconvenience Fee
              <span>
                <Tooltip enterTouchDelay={0} title={inconvenienceToolTip} arrow={true} placement="top">
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-success" />
                  </IconButton>
                </Tooltip>
              </span>
            </p>
            <p className="m-0 text-success">
              {'+$'}
              {penaltyPrice?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      <Divider className="col-span-12 my-2 bg-black" />
      <div className="flex col-span-12 justify-between items-center w-full">
        <p className="m-0 font-bold">Total</p>
        <p className="m-0 font-bold">${newTotalPrice?.toFixed(2)}</p>
      </div>
      {(additionalPaymentInfo?.voucherAmountUsed ?? 0) > 0 && (refundableAmount === undefined || refundableAmount === 0) && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">Voucher Amount</p>
            <p className="m-0 text-error">
              {'-$'}
              {additionalPaymentInfo?.voucherAmountUsed?.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingBreakdown;
