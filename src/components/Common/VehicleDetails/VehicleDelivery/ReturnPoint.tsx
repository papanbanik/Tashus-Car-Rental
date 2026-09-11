import ChargeFee from './CommonUIComponent/ChargeFee';
import LocationInfo from './CommonUIComponent/LocationInfo';
import { VehicleReturnProps } from './VehicleReturn';

const ReturnPoint = ({ deliveryAddress, initialAddress, deliveryCost, deliveryDistance }: VehicleReturnProps) => {
  return (
    <div>
      {!!deliveryAddress && deliveryCost && (
        <>
          {/*Pickup and Delivery Location*/}
          <LocationInfo initialLabel="Delivered Point" initialValue={deliveryAddress} finalLabel="Initial Pickup Point" finalValue={initialAddress} />
          {/* Delivery Fee */}
          <ChargeFee label="Return Fee" value={deliveryCost} tooltipText={`Delivery Distance: ${deliveryDistance}KM`} />
        </>
      )}
    </div>
  );
};

export default ReturnPoint;
