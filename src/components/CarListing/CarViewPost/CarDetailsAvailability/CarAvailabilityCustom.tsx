import PickupReturnTableColumn from '../PickupReturnTableColumn';
import PickupReturnTableRow from '../PickupReturnTableRow';
import { CarCustomAvailability } from '@/types/car-listing/carAvailabilityTypes';

interface CarAvailabilityCustomProps {
  customAvailabilities: CarCustomAvailability[];
}

const CarAvailabilityCustom = ({ customAvailabilities }: CarAvailabilityCustomProps) => {
  return (
    <div>
      {/* Custom hours for less than large screen */}
      <div className="lg:hidden block">
        <PickupReturnTableColumn customAvailabilities={customAvailabilities}></PickupReturnTableColumn>
      </div>

      {/* Custom hours for larger screen */}
      <div className="lg:block hidden">
        <PickupReturnTableRow customAvailabilities={customAvailabilities}></PickupReturnTableRow>
      </div>
    </div>
  );
};

export default CarAvailabilityCustom;
