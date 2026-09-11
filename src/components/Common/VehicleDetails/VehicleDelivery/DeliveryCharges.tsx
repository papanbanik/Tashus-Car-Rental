import { useSearchContext } from '@/context/SearchProvider';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { Divider } from '@mui/material';
import { useEffect } from 'react';

const DeliveryCharges = () => {
  const { isReturnToInitialLocation, deliveryDetails, setDeliveryDetails, isDeliverToInitialLocation } = useSearchContext();
  const { totalDeliveryFee = 0, totalReturnFee = 0 } = deliveryDetails ?? {};
  useEffect(() => {
    if (!isDeliverToInitialLocation) setDeliveryDetails({} as TDeliveryDetails);
  }, [isDeliverToInitialLocation]);
  return (
    <>
      {totalDeliveryFee > 0 && (
        <div className="flex flex-col text-sm gap-1">
          <Divider className="my-2" />
          <span>+${totalDeliveryFee} (to bring the vehicle to your location)</span>
          {!isReturnToInitialLocation && <span>+${totalReturnFee} (to bring the vehicle from your location)</span>}
        </div>
      )}
    </>
  );
};

export default DeliveryCharges;
