import { TDiscountedPrice } from '@/context/SearchProvider';
import { TDiscountInfo } from '@/types/travels/typeEditTravels';
import { calculateWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { Alert, Divider } from '@mui/material';
import DiscountBreakdown, { DiscountBreakdownProps } from './DiscountBreakdown';
import LongDiscountBreakdown from './LongDiscountBreakdown';

export type EarlyDiscountBreakdownProps = DiscountBreakdownProps & {
  longBookingDiscount?: TDiscountedPrice;
  advBookingDiscount?: TDiscountedPrice;
  discountInfo?: TDiscountInfo;
  haveLongDiscount: boolean;
};

const EarlyDiscountBreakdown = ({
  longBookingDiscount,
  advBookingDiscount,
  discountInfo,
  previousDurationPrice,
  newDurationPrice,
  haveLongDiscount,
}: EarlyDiscountBreakdownProps) => {
  const { calculatedAmount, text } = advBookingDiscount ?? {};
  const { calculatedAmount: longCalculatedAmount, text: longDiscountText } = longBookingDiscount ?? {};
  const { advAppliedPrice } = discountInfo ?? {};
  const durationDiff = calculateWithPrecision('subtract', [newDurationPrice, previousDurationPrice]);
  const advBookingText =
    durationDiff > 0 ? `${text} applied on Total Duration Price $${durationDiff}` : `${text} applied on New Duration Price $${newDurationPrice}`;
  //With Long
  const appliedPrice = durationDiff > 0 ? durationDiff : newDurationPrice;
  const advBookingTextWithLong = `${text} applied on Price $${advAppliedPrice}`;

  return (
    <div>
      {haveLongDiscount ? (
        <>
          <LongDiscountBreakdown
            longBookingDiscount={longBookingDiscount}
            previousDurationPrice={previousDurationPrice}
            newDurationPrice={newDurationPrice}
          />
          <Divider />
          <div className="flex justify-between">
            <span>Updated Amount</span>
            <span>${appliedPrice}</span>
          </div>
          <div className="flex justify-between text-error">
            <span>{longDiscountText}</span>
            <span>-${longCalculatedAmount}</span>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${advAppliedPrice}</span>
          </div>
          <div className="my-2 italic w-full text-justify">
            <span>
              {advBookingTextWithLong}, resulting in a discount of <b>${calculatedAmount}</b>
            </span>
          </div>
        </>
      ) : (
        <>
          <DiscountBreakdown previousDurationPrice={previousDurationPrice} newDurationPrice={newDurationPrice} durationDiff={durationDiff} />
          <div className="my-2 italic w-full text-justify">
            <Alert severity="info">
              {advBookingText}, resulting in a discount of <b>${calculatedAmount}</b>
            </Alert>
          </div>
        </>
      )}
    </div>
  );
};

export default EarlyDiscountBreakdown;
