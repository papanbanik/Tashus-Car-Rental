import InputCheckbox from '@/components/Common/InputFields/InputCheckbox';
import { useSearchContext } from '@/context/SearchProvider';
import { HiOutlineLightBulb } from 'react-icons/hi';
import ReturnPoint from './ReturnPoint';
export interface VehicleReturnProps {
  deliveryAddress: string;
  initialAddress: string;
  deliveryCost: number;
  deliveryDistance?: number;
}
const VehicleReturn = ({ deliveryAddress, initialAddress, deliveryCost }: VehicleReturnProps) => {
  const { isReturnToInitialLocation, setIsReturnToInitialLocation, deliveryDistance } = useSearchContext();
  return (
    <div className="flex flex-col gap-2 mt-4">
      <InputCheckbox
        label={
          <span className="flex flex-col">
            Free Return to Pickup Point{' '}
            <span className="flex gap-1 helping_text font-normal">
              <HiOutlineLightBulb size={20} />
              {`Choose to drop off the vehicle at its original location for no additional fee`}
            </span>
          </span>
        }
        handleChange={() => setIsReturnToInitialLocation(!isReturnToInitialLocation)}
        isChecked={isReturnToInitialLocation}
        labelClassName="text-sm font-semibold"
      />
      {!isReturnToInitialLocation && (
        <ReturnPoint
          deliveryAddress={deliveryAddress}
          initialAddress={initialAddress}
          deliveryCost={deliveryCost}
          deliveryDistance={deliveryDistance}
        />
      )}
    </div>
  );
};

export default VehicleReturn;
