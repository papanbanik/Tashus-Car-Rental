import PickupReturnTableColumn from '@/components/CarListing/CarViewPost/PickupReturnTableColumn';
import CommonDrawer from '@/components/Common/CommonDrawer';
import { CarCustomAvailability } from '@/types/car-listing/carAvailabilityTypes';
import { useState } from 'react';

interface IVehicleAvailability {
  customAvailabilities: CarCustomAvailability[];
  alwaysAvailable: boolean;
}

const VehicleAvailability = ({ customAvailabilities, alwaysAvailable }: IVehicleAvailability) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  return (
    <div>
      <CommonDrawer
        drawerWidth={300}
        drawerButton={<span className="font-bold">{'View Pickup and Return Hours'}</span>}
        drawerAnchor="left"
        buttonClasses="my-4"
        buttonVariant="outlined"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <PickupReturnTableColumn customAvailabilities={customAvailabilities}></PickupReturnTableColumn>
      </CommonDrawer>
    </div>
  );
};

export default VehicleAvailability;
