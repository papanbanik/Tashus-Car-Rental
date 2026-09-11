'use client';

import VehicleStatus from '@/components/CarListing/VehicleStatus/VehicleStatus';
import { useParams } from 'next/navigation';

const EditVehicleStatus = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  return (
    <div className="mt-5 lg:mt-0">
      <VehicleStatus vehicleId={vehicleId} />
    </div>
  );
};

export default EditVehicleStatus;
