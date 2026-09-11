import { useTravelContext } from '@/context/TravelProvider';
import { getNextLongDiscountInfo } from '@/utils/Functions/travel-edit/travelDiscountFn';
import { Alert } from '@mui/material';

const BillingInfo = () => {
  const { updatedTravelData, billingDetails } = useTravelContext();
  const { discounts } = updatedTravelData ?? {};
  const longDiscount = discounts?.customLongDiscountAmount ?? discounts?.longBookingDiscounts?.calculatedAmount ?? 0;
  const advDiscount = discounts?.customAdvanceDiscountAmount ?? discounts?.advanceBookingDiscounts?.calculatedAmount ?? 0;
  const { longDiscountToolTip, nextLongBookingDis } = billingDetails ?? {};
  return (
    <div className="w-full border border-solid border-accent p-2 rounded-lg">
      <div className="flex flex-col gap-2">
        {longDiscountToolTip && <span className="font-bold text-sm">{longDiscountToolTip}</span>}
        {nextLongBookingDis && (
          <Alert severity="info">
            <span className="font-bold text-sm text-primary">{getNextLongDiscountInfo(nextLongBookingDis?.amount, nextLongBookingDis?.text)}</span>
          </Alert>
        )}
      </div>
      {/* {longDiscount > 0 && (
        <div className="text-sm flex col-span-12 justify-between items-start w-full">
          <p className="m-0">Reversed Long Discount :</p>
          <p className="m-0">
            {'$'}
            {longDiscount}
          </p>
        </div>
      )}
      {advDiscount > 0 && (
        <div className="text-sm flex col-span-12 justify-between items-start w-full">
          <p className="m-0"> Reversed Early Discount :</p>
          <p className="m-0">
            {'$'}
            {advDiscount}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default BillingInfo;
