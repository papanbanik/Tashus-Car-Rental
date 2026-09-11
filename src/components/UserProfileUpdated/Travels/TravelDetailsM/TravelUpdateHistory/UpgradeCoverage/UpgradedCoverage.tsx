import { getDurationDayHourMin } from '@/utils/Functions/dateTimeCommonFn';
import { ReservationHistoryType } from '../allHistoryFn';
import RevisedBillingBreakdown from '../RevisedBillingBreakdown';
import PreviousCoverageInfo from './PreviousCoverageInfo';
import UpgradeBasicInfo from './UpgradeBasicInfo';

const UpgradedCoverage = ({ upgradedInfo }: { upgradedInfo: ReservationHistoryType }) => {
  const { upgradedCoverageInfo, basePrice, newStartDate, newEndDate, additionalPaymentInfo, discounts } = upgradedInfo ?? {};
  const { previousInsurance, dueAmount = 0, paymentStatus, paymentMethod } = upgradedCoverageInfo ?? {};

  return (
    <div>
      <div className="flex flex-col border border-solid border-accent rounded-lg p-2">
        <RevisedBillingBreakdown
          basePrice={basePrice}
          travelDuration={getDurationDayHourMin(newStartDate, newEndDate)}
          additionalPaymentInfo={additionalPaymentInfo}
          discounts={discounts}
          upgradedCoverageInfo={upgradedCoverageInfo}
        />
        <PreviousCoverageInfo previousInsurance={previousInsurance} />
        <UpgradeBasicInfo paymentStatus={paymentStatus} paymentMethod={paymentMethod} dueAmount={dueAmount} />
      </div>
    </div>
  );
};

export default UpgradedCoverage;
