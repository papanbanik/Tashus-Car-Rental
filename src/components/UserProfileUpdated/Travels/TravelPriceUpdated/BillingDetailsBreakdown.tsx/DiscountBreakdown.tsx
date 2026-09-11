import { Divider } from '@mui/material';
export interface DiscountBreakdownProps {
  previousDurationPrice: number;
  newDurationPrice: number;
  durationDiff?: number;
}
const DiscountBreakdown = ({ newDurationPrice, previousDurationPrice, durationDiff }: DiscountBreakdownProps) => {
  const showCalculation = newDurationPrice > previousDurationPrice;
  return (
    <div>
      {showCalculation ? (
        <>
          <div className="flex justify-between">
            <span>New Duration Price</span>
            <span>${newDurationPrice}</span>
          </div>
          <div className="flex justify-between text-error">
            <span>Previous Duration Price</span>
            <span>-${previousDurationPrice}</span>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total Duration Price</span>
            <span>${durationDiff}</span>
          </div>
        </>
      ) : (
        ''
        // <span>{`Here, New Duration Price <= Previous Duration Price, So the Duration Price is $${newDurationPrice}`}</span>
      )}
    </div>
  );
};

export default DiscountBreakdown;
