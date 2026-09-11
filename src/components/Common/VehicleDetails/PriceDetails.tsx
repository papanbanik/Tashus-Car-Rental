import { useSearchContext } from '@/context/SearchProvider';
import { CarDataRates, CarDataState } from '@/types/car-listing/carListingTypes';
import DeliveryCharges from './VehicleDelivery/DeliveryCharges';
import { getAdvancedDiscountText, getLongDiscountText } from '@/utils/Functions/commonStyleFn';

interface PriceDetailsProps {
  carRates: CarDataRates;
  hideNextDiscount?: boolean;
  hideLongAdvanceDiscount?: boolean;
}

const PriceDetails = ({ carRates, hideNextDiscount = false, hideLongAdvanceDiscount = false }: PriceDetailsProps) => {
  const { reservationDuration, durationPrice, peakIncPrice, discountedPrice, reservationInfo } = useSearchContext();
  const { longBookingDiscountActive = true, advanceBookingDiscountActive = true } = carRates ?? {};

  let peakIncText = '';

  if (peakIncPrice?.calculatedAmount && peakIncPrice?.calculatedAmount > 0) {
    const increaseText = peakIncPrice?.increaseType === 'amount' ? `$${peakIncPrice?.increaseAmount}` : `${peakIncPrice?.increaseAmount}%`;
    const uniquePeakDays = Array.from(new Set(peakIncPrice?.increaseDays?.map((peakDay: any) => peakDay)));
    peakIncText = `${increaseText} price increases on ${uniquePeakDays.map((day) => day.toUpperCase()).join(', ')}`;
  }

  const longDiscountText = discountedPrice?.longDiscount?.text || getLongDiscountText(reservationInfo?.discounts?.longBookingDiscounts) || null;
  const advanceDiscountText =
    discountedPrice?.advanceDiscount?.text || getAdvancedDiscountText(reservationInfo?.discounts?.advanceBookingDiscounts) || '';
  const longDiscountAmount =
    discountedPrice?.longDiscount?.calculatedAmount ?? reservationInfo?.discounts?.longBookingDiscounts?.calculatedAmount ?? 0;
  const advanceDiscountAmount =
    discountedPrice?.advanceDiscount?.calculatedAmount ?? reservationInfo?.discounts?.advanceBookingDiscounts?.calculatedAmount ?? 0;
  const reservationDurationText = reservationDuration || reservationInfo?.reservationDuration;
  const reservationDurationPrice = durationPrice > 0 ? durationPrice : reservationInfo?.durationPrice;

  const fontSize = !hideNextDiscount && 'text-sm';

  return (
    <>
      {reservationDurationText && (
        <div className="flex justify-between items-center lg:mt-4">
          <p className={`${fontSize} p-0 m-0 text-left md:text-center`}>{reservationDurationText}</p>
          <p className={`${fontSize} p-0 m-0 text-right md:text-center`}>${(reservationDurationPrice ?? 0).toFixed(2)}</p>
        </div>
      )}

      {/* {peakIncPrice?.calculatedAmount && peakIncPrice?.calculatedAmount > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm p-0 m-0 text-left md:text-center">
            Peak Increase Price
            <span>
              <Tooltip enterTouchDelay={0} title={peakIncText} placement="top">
                <IconButton size="small">
                  <AiOutlineQuestionCircle />
                </IconButton>
              </Tooltip>
            </span>
          </p>
          <p className="text-sm p-0 m-0 text-right md:text-center text-success">+${peakIncPrice?.calculatedAmount?.toFixed(2)}</p>
        </div>
      )} */}

      {/* {serviceFee !== 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm p-0 m-0 text-left md:text-center">10% Service Fee</p>
          <p className="text-sm p-0 m-0 text-right md:text-center text-success">+${serviceFee.toFixed(2)}</p>
        </div>
      )} */}

      {longDiscountText && longBookingDiscountActive && !hideLongAdvanceDiscount && (
        <div className="flex justify-between items-center">
          <p className={`${fontSize} p-0 m-0 text-left md:text-center`}>{longDiscountText}</p>
          <p className={`${fontSize} p-0 m-0 text-right md:text-center text-error`}>-${longDiscountAmount?.toFixed(2)}</p>
        </div>
      )}

      {advanceDiscountText && advanceBookingDiscountActive && !hideLongAdvanceDiscount && (
        <div className="flex justify-between items-center">
          <p className={`${fontSize} p-0 m-0 text-left`}>{advanceDiscountText}</p>
          <p className={`${fontSize} p-0 m-0 text-right text-error`}>-${advanceDiscountAmount?.toFixed(2)}</p>
        </div>
      )}

      {discountedPrice?.nextLongDiscount?.text && longBookingDiscountActive && !hideNextDiscount && (
        <div className="flex justify-center items-center lg:mt-6 mt-4">
          <p className={`${fontSize} font-bold text-primary p-0 m-0 text-left md:text-center`}>
            Enjoy {discountedPrice?.nextLongDiscount?.amount}% off for {discountedPrice?.nextLongDiscount?.text} of travel
          </p>
        </div>
      )}

      {process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && !hideNextDiscount && <DeliveryCharges />}
      {/* {vehicleDeliveryInfo?.deliveryFee > 0 && (
        <div className="flex lg:mt-6 mt-4">
          <p className="text-sm p-0 m-0 text-left">+${vehicleDeliveryInfo?.deliveryFee} as vehicle delivery fee</p>
        </div>
      )} */}
    </>
  );
};

export default PriceDetails;
