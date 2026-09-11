import { useCarListingContext } from '@/context/CarListingProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TBillingDetails } from '@/types/travels/typeEditTravels';
import { handleTravelEditOld, handleTravelEditPreviousConsider } from '@/utils/Functions/travel-edit/draftTravelUpdateFn';
import { useEffect, useState } from 'react';
import BillingBreakdown from './BillingBreakdown';

const CompareBilling = () => {
  const { updatedTravelData, billingDetails } = useTravelContext();
  const { travelDetails } = useProfileInfoContext();
  const { carData } = useCarListingContext();
  const [previousBreakdown, setPreviousBreakdown] = useState<TBillingDetails>(billingDetails);
  const [previousDiscountConsiderBreakdown, setPreviousDiscountConsiderBreakdown] = useState<TBillingDetails>(billingDetails);
  useEffect(() => {
    const updateBillingDetails = async () => {
      if (!!billingDetails?.newStartDate) {
        const updatedBillingDetails = await handleTravelEditOld(
          billingDetails?.newStartDate,
          billingDetails?.newEndDate,
          updatedTravelData?.pickupDate,
          updatedTravelData?.returnDate,
          carData,
          travelDetails,
          updatedTravelData
        );
        setPreviousBreakdown(updatedBillingDetails);
        const updatedBillingDetailsWithPreviousDiscount = await handleTravelEditPreviousConsider(
          billingDetails?.newStartDate,
          billingDetails?.newEndDate,
          updatedTravelData?.pickupDate,
          updatedTravelData?.returnDate,
          carData,
          travelDetails,
          updatedTravelData
        );
        setPreviousDiscountConsiderBreakdown(updatedBillingDetailsWithPreviousDiscount);
      }
    };
    updateBillingDetails();
  }, [billingDetails?.newStartDate, billingDetails?.newEndDate]);

  return (
    <div className="w-full flex justify-between border border-solid border-accent rounded-lg p-2">
      {/* Updated */}
      <BillingBreakdown
        title="Previous Updated Breakdown"
        billingDetails={previousBreakdown}
        coveragePercentage={travelDetails?.reservationInfo?.insurance?.coveragePercentage ?? 0}
      />
      {/* <Divider orientation="vertical" flexItem className="bg-black mx-2 h-full" /> */}
      {/* <BillingBreakdown
        title="Previous Discount Consider Breakdown"
        billingDetails={previousDiscountConsiderBreakdown}
        coveragePercentage={travelDetails?.reservationInfo?.insurance?.coveragePercentage ?? 0}
      /> */}
    </div>
  );
};

export default CompareBilling;
