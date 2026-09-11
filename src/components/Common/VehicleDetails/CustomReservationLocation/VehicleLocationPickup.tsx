import { FaCar } from 'react-icons/fa6';
import HeadingSemiSmall from '../../Typographies/HeadingSemiSmall';

interface VehicleLocationPickupProps {
  shortAddress: string;
  bottomMargin?: number;
  padding?: number;
}

const VehicleLocationPickup = ({ shortAddress, bottomMargin = 10, padding = 4 }: VehicleLocationPickupProps) => {
  return (
    <div className={`mb-${bottomMargin}`}>
      <HeadingSemiSmall
        title="Pickup at vehicle location"
        description="We will send you the exact location once your reservation is booked"
      ></HeadingSemiSmall>

      <div className={`bg-gray-200 p-${padding} flex justify-center items-center gap-2 rounded-sm`}>
        <span className="flex">
          <FaCar className="text-primary " size={22} />
        </span>
        <span className="text-sm">{shortAddress}</span>
      </div>
    </div>
  );
};

export default VehicleLocationPickup;
