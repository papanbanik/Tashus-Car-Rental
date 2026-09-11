import InputCheckbox from '@/components/Common/InputFields/InputCheckbox';
import { useModalContext } from '@/context/ModalProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { TDeliveryDetails } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { useEffect } from 'react';
import { HiOutlineLightBulb } from 'react-icons/hi';
import DeliveryInfoModal from './DeliveryInfoModal';
import VehiclePickupReturn from './VehiclePickupReturn';

const VehicleDelivery = () => {
  const {
    isDeliverToInitialLocation,
    setIsDeliverToInitialLocation,
    setDeliveryDetails,
    setDeliveryCost,
    setDeliveryDistance,
    setIsReturnToInitialLocation,
  } = useSearchContext();
  const { openModal } = useModalContext();

  //Reset on mount
  useEffect(() => {
    setIsReturnToInitialLocation(true);
    setIsDeliverToInitialLocation(false);
    setDeliveryDetails({} as TDeliveryDetails);
    setDeliveryCost(0);
    setDeliveryDistance(0);
  }, []);

  const handleInfoShow = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      content: <DeliveryInfoModal />,
    });
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col">
        <InputCheckbox
          label="Deliver to My Location"
          handleChange={() => setIsDeliverToInitialLocation(!isDeliverToInitialLocation)}
          isChecked={isDeliverToInitialLocation}
          labelClassName="text-sm font-semibold"
        />
        <button
          className="-mt-3 pl-6 cursor-pointer flex justify-end gap-1 items-center underline font-normal normal-case p-0 m-0 border-none text-primary bg-transparent"
          onClick={handleInfoShow}
        >
          <HiOutlineLightBulb />
          Delivery Info
        </button>
      </div>
      {isDeliverToInitialLocation && <VehiclePickupReturn />}
    </div>
  );
};

export default VehicleDelivery;
