import { TCarListInfo } from '@/types/user-profile/vehicleListType';
import VehicleCard from './VehicleCard';
import VehicleCardMobile from './VehicleCardMobile';

interface VehicleDisplayProps {
  groupedData: TCarListInfo[];
  showGrid: boolean;
  editVehicle: (listingId: number) => void;
}

const VehicleDisplay = ({ groupedData, showGrid, editVehicle }: VehicleDisplayProps) => {
  return (
    <div className={`grid grid-cols-1 ${showGrid ? 'lg:grid-cols-2' : 'lg:grid-cols-1 place-items-center'} gap-4 my-8`}>
      {groupedData?.map((carDetails: any, index: number) =>
        showGrid ? (
          <VehicleCardMobile key={index} vehicleDetails={carDetails} editVehicle={editVehicle} />
        ) : (
          <VehicleCard key={index} vehicleDetails={carDetails} editVehicle={editVehicle} />
        )
      )}
    </div>
  );
};

export default VehicleDisplay;
