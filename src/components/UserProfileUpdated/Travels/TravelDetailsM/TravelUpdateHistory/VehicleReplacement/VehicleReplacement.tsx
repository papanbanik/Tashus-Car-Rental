import { getDurationDayHourMin } from '@/utils/Functions/dateTimeCommonFn';
import { vehicleReplacementReasonOptions } from '@/utils/Lists/travelInfoList';
import { ReservationHistoryType } from '../allHistoryFn';
import RevisedBillingBreakdown from '../RevisedBillingBreakdown';
import PreviousCarInfo from './PreviousCarInfo';
import ReplacementBasicInfo from './ReplacementBasicInfo';

const VehicleReplacement = ({ replacementInfo }: { replacementInfo: ReservationHistoryType }) => {
  const { replacementVehicleInfo, basePrice, newStartDate, newEndDate, additionalPaymentInfo, discounts } = replacementInfo ?? {};
  const {
    reason,
    previousCarListingId,
    previousPickupLocation,
    paymentStatus,
    paymentMethod,
    payableAmount = 0,
    discountAmount = 0,
    creditedAmount = 0,
    replacementDate,
  } = replacementVehicleInfo ?? {};
  const replacementReason = vehicleReplacementReasonOptions.find((option) => option.value === reason)?.label || 'Unknown Reason';

  return (
    <div>
      <div className="flex flex-col border border-solid border-accent rounded-lg p-2">
        <RevisedBillingBreakdown
          basePrice={basePrice}
          travelDuration={getDurationDayHourMin(newStartDate, newEndDate)}
          additionalPaymentInfo={additionalPaymentInfo}
          discounts={discounts}
          replacementVehicleInfo={replacementVehicleInfo}
        />
        <PreviousCarInfo previousCarListingId={previousCarListingId} previousPickupLocation={previousPickupLocation} />
        <ReplacementBasicInfo
          reason={replacementReason}
          paymentStatus={paymentStatus}
          paymentMethod={paymentMethod}
          payableAmount={payableAmount}
          discountAmount={discountAmount}
          creditedAmount={creditedAmount}
          replacementDate={replacementDate}
        />
      </div>
    </div>
  );
};

export default VehicleReplacement;
