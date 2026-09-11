import CommonTooltip from '@/components/Common/CommonTooltip';
import { EPriceAdjustment } from '@/types/commonTypes';
import { UpdatedBillingProps } from '@/types/user-profile/customPriceTypes';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import BillingInfo from './BillingInfo';

const UpdatedBilling = ({ billingDetails, coveragePercentage }: UpdatedBillingProps) => {
  const {
    newDuration,
    newDurationPrice,
    newLongBookingDis,
    newAdvBookingDis,
    penaltyPrice,
    newTotalWithoutCoverage,
    newCoverageAmount,
    totalWithoutPenalty,
    newGstAmount,
    newTotalPrice,
    inconvenienceToolTip,
    additionalPaymentInfo,
    refundableAmount,
    advanceDiscountToolTip,
    longDiscountToolTip,
    waivedPayableAmount = 0,
    priceAdjustment,
    previousLongBookingDiscount = 0,
    previousPenaltyPrice = 0,
  } = billingDetails ?? {};
  console.log('New Long Booking Discount', newLongBookingDis);
  //Price Adjustment
  const priceAdjustmentReason = priceAdjustment?.reason ?? '';
  const priceAdjustmentAmount = priceAdjustment?.amount ?? 0;
  const priceAdjustmentType = priceAdjustment?.adjustmentType;
  const isAdjustmentIncrease = priceAdjustmentType === EPriceAdjustment.Increase;
  return (
    <div className="grid grid-cols-2 lg:w-1/2 lg:mt-0 mt-4 justify-start items-start">
      <p className="m-0 font-semibold">Updated</p>
      <Divider className="col-span-12 my-2" />
      <div className="flex col-span-12 justify-between items-start w-full">
        <p className="m-0">{newDuration}</p>
        <p className="m-0">
          {'$'}
          {newDurationPrice?.toFixed(2)}
        </p>
      </div>
      {/* {newPeakIncPrice && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">
              Peak Increase Price
              <span>
                <Tooltip enterTouchDelay={0} title={peakIncToolTip} placement="top">
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-success" />
                  </IconButton>
                </Tooltip>
              </span>
            </p>
            <p className="m-0 text-success">
              {'+$'}
              {newPeakIncPrice?.calculatedAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )} */}
      {/* {newServiceFee && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">{'10% Service Fee'}</p>
            <p className="m-0 text-success">
              {'+$'}
              {newServiceFee?.toFixed(2)}
            </p>
          </div>
        </>
      )} */}
      {previousLongBookingDiscount > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">Previous Long Discount</p>
            <p className="m-0 text-error">
              {'-$'} {parseFloatWithPrecision(previousLongBookingDiscount)}
            </p>
          </div>
        </>
      )}
      {newLongBookingDis && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-start w-full">{<BillingInfo />}</div>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">
              {newLongBookingDis?.text}
              {!!longDiscountToolTip && (
                <CommonTooltip title={longDiscountToolTip}>
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-error" />
                  </IconButton>
                </CommonTooltip>
              )}
            </p>
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
            <p className="m-0 text-error">
              {newAdvBookingDis?.text}
              {!!advanceDiscountToolTip && (
                <CommonTooltip title={advanceDiscountToolTip}>
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-error" />
                  </IconButton>
                </CommonTooltip>
              )}
            </p>
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
      {/* {(additionalPaymentInfo?.voucherAmountUsed ?? 0) > 0 && (
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
      )} */}
      {/* {(oldDepositAmount ?? 0) > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">Deposit Amount</p>
            <p className="m-0 text-success">
              {'+$'}
              {oldDepositAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )} */}
      {(previousPenaltyPrice ?? 0) > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">Previous Inconvenience Fee</p>
            <p className="m-0 text-success">
              {'+$'}
              {parseFloatWithPrecision(previousPenaltyPrice)}
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
      {priceAdjustmentAmount > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className={`m-0 ${isAdjustmentIncrease ? 'text-success' : 'text-error'}`}>{priceAdjustmentReason}</p>
            <p className={`m-0 ${isAdjustmentIncrease ? 'text-success' : 'text-error'}`}>
              {`${isAdjustmentIncrease ? '+' : '-'}$`}
              {priceAdjustmentAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      <Divider className="col-span-12 my-2 bg-black" />
      <div className="flex col-span-12 justify-between items-center w-full">
        <p className="m-0 font-bold">Total</p>
        <p className="m-0 font-bold">${newTotalPrice?.toFixed(2)}</p>
      </div>
      {/* {(additionalPaymentInfo?.voucherAmountUsed ?? 0) > 0 && (
        <div className="flex col-span-12 justify-end items-center w-full">
          <span className="text-xs font-bold">{`*Used $${parseFloat(
            (additionalPaymentInfo?.voucherAmountUsed ?? 0).toFixed(2)
          )} voucher amount`}</span>
        </div>
      )} */}
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
      {waivedPayableAmount > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">Travel Update Waived</p>
            <p className="m-0 text-error">
              {'-$'}
              {parseFloatWithPrecision(waivedPayableAmount)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdatedBilling;
