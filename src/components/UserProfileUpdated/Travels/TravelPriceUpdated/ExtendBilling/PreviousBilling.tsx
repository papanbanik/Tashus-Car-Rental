import CommonTooltip from '@/components/Common/CommonTooltip';
import { EPriceAdjustment } from '@/types/commonTypes';
import { PreviousBillingProps } from '@/types/user-profile/customPriceTypes';
import { getAdvancedDiscountText, getLongDiscountText } from '@/utils/Functions/commonStyleFn';
import { getDurationDayHourMin } from '@/utils/Functions/dateTimeCommonFn';
import { parseFloatWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { getAdvanceDiscountTooltip, getLongDiscountTooltip } from '@/utils/Functions/travel-edit/travelDiscountFn';
import { Divider, IconButton, Tooltip } from '@mui/material';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const PreviousBilling = ({ previousReservationAmount, updatedTravelData, travelDetails, paidAmount }: PreviousBillingProps) => {
  //Destruct UpdatedTravelData
  const { pickupDate, returnDate, discounts, additionalPaymentInfo, basePrice } = updatedTravelData ?? {};
  //Destruct AdditionalPaymentInfo
  const { voucherAmountUsed = 0 } = additionalPaymentInfo ?? {};
  //Destruct BasePrice
  const {
    durationPrice,
    totalPrice,
    penaltyPrice,
    penaltyReason,
    coverageAmount,
    gstAmount,
    priceAdjustment,
    waivedPayableAmount = 0,
  } = basePrice ?? {};
  //Destruct Discounts
  const {
    advanceBookingDiscounts,
    longBookingDiscounts,
    customAdvanceDiscountAmount = 0,
    customLongDiscountAmount = 0,
    discountsInfo,
  } = discounts ?? {};
  const previousTravelDuration = `${getDurationDayHourMin(pickupDate, returnDate)} Rental`;

  const longDiscountText = customLongDiscountAmount > 0 ? 'Special Long Booking Discount' : getLongDiscountText(longBookingDiscounts);
  const advDiscountText = customAdvanceDiscountAmount > 0 ? 'Special Early Booking Discount' : getAdvancedDiscountText(advanceBookingDiscounts);

  // const longBookingDiscountAmount = customLongDiscountAmount > 0 ? customLongDiscountAmount : longBookingDiscounts?.calculatedAmount ?? 0;
  const advanceBookingDiscountAmount = customAdvanceDiscountAmount > 0 ? customAdvanceDiscountAmount : advanceBookingDiscounts?.calculatedAmount ?? 0;
  //Price Adjustment
  const priceAdjustmentReason = priceAdjustment?.reason ?? '';
  const priceAdjustmentAmount = priceAdjustment?.amount ?? 0;
  const priceAdjustmentType = priceAdjustment?.adjustmentType;
  const isAdjustmentIncrease = priceAdjustmentType === EPriceAdjustment.Increase;
  //coverage percentage
  const coveragePercentage = travelDetails?.reservationInfo?.insurance?.coveragePercentage ?? 0;
  const { longAppliedPrice, advAppliedPrice, dayDiff, advancedDays } = discountsInfo ?? {};
  const longDiscountUnit = `${
    (longBookingDiscounts?.duration ?? 0) > 1 ? `${longBookingDiscounts?.durationUnit}` : `${longBookingDiscounts?.durationUnit?.slice(0, -1)}`
  }`;
  const longDiscountToolTip =
    !!longAppliedPrice && !!dayDiff && longAppliedPrice > 0 ? getLongDiscountTooltip(longAppliedPrice, dayDiff, longDiscountUnit) : '';
  const advDiscountUnit = `${
    (advanceBookingDiscounts?.duration ?? 0) > 1
      ? `${advanceBookingDiscounts?.durationUnit}`
      : `${advanceBookingDiscounts?.durationUnit?.slice(0, -1)}`
  }`;
  const advDiscountToolTip =
    !!advAppliedPrice && !!advancedDays && advAppliedPrice > 0 ? getAdvanceDiscountTooltip(advAppliedPrice, advancedDays, advDiscountUnit) : '';

  //Updated Special+ Long
  const customLongAmount = customLongDiscountAmount ?? 0;
  const longBookingDiscountAmount = longBookingDiscounts?.calculatedAmount ?? 0;
  // const longBookingDiscountAmount =
  //   customLongDiscountAmount && longBookingDiscounts?.calculatedAmount && !longBookingDiscounts?.duration
  //     ? customLongDiscountAmount + (longBookingDiscounts?.calculatedAmount ?? 0)
  //     : customLongDiscountAmount > 0
  //     ? customLongDiscountAmount
  //     : longBookingDiscounts?.calculatedAmount ?? 0;

  // const longBookingDiscountText =
  //   customLongDiscountAmount && longBookingDiscounts?.calculatedAmount && !longBookingDiscounts?.duration
  //     ? 'Special+Long Booking Discount'
  //     : (customLongDiscountAmount ?? 0) > 0
  //     ? 'Special Long Discount'
  //     : 'Long Booking Discount';
  return (
    <div className="grid grid-cols-2 lg:w-1/2">
      <p className="m-0 font-semibold">Previous</p>
      <Divider className="col-span-12 my-2" />
      <div className="flex col-span-12 justify-between items-center w-full">
        <p className="m-0">{previousTravelDuration}</p>
        <p className="m-0">
          {'$'}
          {durationPrice?.toFixed(2)}
        </p>
      </div>
      {longBookingDiscountAmount > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            {'Long Reservation Discount'}
            {/* <p className="m-0 text-error">
              {longDiscountText}
              {!!longDiscountToolTip && (
                <CommonTooltip title={longDiscountToolTip}>
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-error" />
                  </IconButton>
                </CommonTooltip>
              )}
            </p> */}
            <p className="m-0 text-error">
              {'-$'}
              {longBookingDiscountAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      {customLongAmount > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            {'Special Long Reservation Discount'}
            <p className="m-0 text-error">
              {'-$'}
              {parseFloatWithPrecision(customLongAmount)}
            </p>
          </div>
        </>
      )}
      {advanceBookingDiscountAmount > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">
              {advDiscountText}{' '}
              {!!advDiscountToolTip && (
                <CommonTooltip title={advDiscountToolTip}>
                  <IconButton size="small">
                    <AiOutlineQuestionCircle className="text-error" />
                  </IconButton>
                </CommonTooltip>
              )}
            </p>

            <p className="m-0 text-error">
              {'-$'}
              {advanceBookingDiscountAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      <div className="col-span-12 mt-2 bg-black h-[1px]"></div>
      <div className="flex col-span-12 justify-between items-center w-full">
        <p className="m-0 font-bold flex justify-center items-center">
          <span>Previous Total</span>
        </p>
        <p className="m-0 font-bold">
          {'$'}
          {previousReservationAmount?.toFixed(2)}
        </p>
      </div>
      {(penaltyPrice ?? 0) > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-success">
              Inconvenience Fee
              {penaltyReason && (
                <span>
                  <Tooltip title={penaltyReason} arrow={true} placement="top">
                    <IconButton size="small">
                      <AiOutlineQuestionCircle className="text-success" />
                    </IconButton>
                  </Tooltip>
                </span>
              )}
            </p>
            <p className="m-0 text-success">
              {'+$'}
              {penaltyPrice?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      {(coverageAmount ?? 0) > 0 && (
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
              {coverageAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      {(gstAmount ?? 0) > 0 && ( //gstAmount show change if calculated but not display
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
              {gstAmount?.toFixed(2)}
            </p>
          </div>
        </>
      )}
      {(voucherAmountUsed > 0 || priceAdjustmentAmount > 0) && parseFloat(totalPrice?.toFixed(2)) > 0 && (
        <>
          <Divider className="col-span-12 my-2 bg-black h-[1px]" />
          <div className="flex col-span-12 justify-between items-center w-full font-bold">
            <p className="m-0 ">Total Fare</p>
            <p className="m-0">{`$${parseFloat(totalPrice?.toFixed(2))}`}</p>
          </div>
        </>
      )}
      {voucherAmountUsed > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className="m-0 text-error">Voucher Amount</p>
            <p className="m-0 text-error">
              {'-$'}
              {voucherAmountUsed?.toFixed(2)}
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
      {waivedPayableAmount > 0 && (
        <>
          <Divider className="col-span-12 my-2" />
          <div className="flex col-span-12 justify-between items-center w-full">
            <p className={`m-0 text-error`}>{'Travel Update Waived'}</p>
            <p className={`m-0 text-error`}>
              {`-$`}
              {parseFloatWithPrecision(waivedPayableAmount)}
            </p>
          </div>
        </>
      )}
      <Divider className="col-span-12 my-2 bg-black h-[1px]" />
      <div className="flex col-span-12 justify-between items-center w-full">
        <p className="m-0 font-bold">Paid</p>
        <p className="m-0 font-bold">${paidAmount?.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PreviousBilling;
