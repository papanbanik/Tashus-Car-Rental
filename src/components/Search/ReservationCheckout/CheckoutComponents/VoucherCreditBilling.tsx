import PriceDetails from '@/components/Common/VehicleDetails/PriceDetails';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import Divider from '@mui/material/Divider';

interface VoucherCreditBillingProps {
  payable: number;
  rentFee: number;
  showDeductedAmount: boolean;
  deductedAmount: number;
  deductedAmountText: string;
  isVoucherValid?: boolean;
}

const VoucherCreditBilling = ({
  payable,
  isVoucherValid = false,
  rentFee,
  showDeductedAmount,
  deductedAmount,
  deductedAmountText,
}: VoucherCreditBillingProps) => {
  const { carData } = useCarListingContext();
  const { deliveryDetails, guestCoveragePackage, gstData } = useSearchContext();
  return (
    <div>
      <PriceDetails carRates={carData?.rates} hideNextDiscount={true} hideLongAdvanceDiscount={isVoucherValid} />

      <Divider className="col-span-12 my-1 bg-gray-400" />

      <div className="flex justify-between items-center">
        <div>Rent Fee :</div>
        <div className="font-semibold">${rentFee.toFixed(2)}</div>
      </div>

      {guestCoveragePackage?.guestCoverageType !== 'no-coverage' ? (
        <div className="flex justify-between items-center">
          <div>Vehicle Coverage : </div>
          <div className="font-semibold text-success">+${guestCoveragePackage?.coverageAmount?.toFixed(2)}</div>
        </div>
      ) : undefined}

      {gstData?.gstAmount > 0 && ( //gstAmount show change if calculated but not display
        <div className="flex justify-between items-center">
          <div>GST : </div>
          <div className="font-semibold text-success">+${gstData?.gstAmount?.toFixed(2)}</div>
        </div>
      )}

      {deliveryDetails?.isDeliveryEnabled && (
        <>
          <div className="flex justify-between items-center">
            <div>Delivery Fee : </div>
            <div className="font-semibold text-success">+${(deliveryDetails?.totalDeliveryFee ?? 0)?.toFixed(2)}</div>
          </div>
          {deliveryDetails?.isReturnEnabled && (
            <div className="flex justify-between items-center">
              <div>Return Fee : </div>
              <div className="font-semibold text-success">+${(deliveryDetails?.totalReturnFee ?? 0)?.toFixed(2)}</div>
            </div>
          )}
        </>
      )}

      {showDeductedAmount && deductedAmount > 0 && (
        <>
          <div className="flex justify-between items-center">
            <div>{`${deductedAmountText} :`}</div>
            <div className="font-semibold text-error">-${deductedAmount?.toFixed(2)}</div>
          </div>
        </>
      )}

      <div className="flex justify-between items-center mb-6 lg:mb-0">
        <div>Total Payment :</div>
        <div className="font-bold text-success">${payable?.toFixed(2)}</div>{' '}
      </div>
      {/* Ipad */}
      {/* {isIPadPro && !!depositMessage && <p className="text-xs text-justify font-bold text-error">{depositMessage}</p>} */}
      {/* small screen */}
      {/* {!!depositMessage && (
        <div className="block lg:hidden">
          <p className="text-xs text-justify font-bold text-error">{depositMessage}</p>
        </div>
      )} */}
    </div>
  );
};

export default VoucherCreditBilling;
