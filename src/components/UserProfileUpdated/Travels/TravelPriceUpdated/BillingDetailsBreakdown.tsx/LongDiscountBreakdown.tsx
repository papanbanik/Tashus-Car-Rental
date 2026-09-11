import { TDiscountedPrice } from '@/context/SearchProvider';
import { calculateWithPrecision } from '@/utils/Functions/lodashHelperFn';
import { Alert } from '@mui/material';
import DiscountBreakdown, { DiscountBreakdownProps } from './DiscountBreakdown';

export type LongDiscountBreakdownProps = DiscountBreakdownProps & {
  longBookingDiscount?: TDiscountedPrice;
};
const LongDiscountBreakdown = ({ longBookingDiscount, previousDurationPrice, newDurationPrice }: LongDiscountBreakdownProps) => {
  const { calculatedAmount, text } = longBookingDiscount ?? {};
  const durationDiff = calculateWithPrecision('subtract', [newDurationPrice, previousDurationPrice]);
  const longBookingText =
    durationDiff > 0 ? `${text} applied on Total Duration Price $${durationDiff}` : `${text} applied on New Duration Price $${newDurationPrice}`;

  return (
    <div>
      <DiscountBreakdown previousDurationPrice={previousDurationPrice} newDurationPrice={newDurationPrice} durationDiff={durationDiff} />
      <div className="my-2 italic w-full text-justify">
        <Alert severity="info">
          {longBookingText}, resulting in a discount of <b>${calculatedAmount}</b>
        </Alert>
      </div>
    </div>
  );
};

export default LongDiscountBreakdown;
