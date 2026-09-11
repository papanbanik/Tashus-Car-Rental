'use client';
import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import Vehicles from '../../../../../../public/icons/VehicleIcons/TrafficJam.svg';

const VehicleIds = ({ groupData, setIsDrawerOpen }: { groupData: any; setIsDrawerOpen: Dispatch<SetStateAction<boolean>> }) => {
  const selectedGroupData = groupData.length > 0 ? groupData.filter((data: any) => data.isSelected) : [];
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <CommonTextIcon className="font-bold" text="Vehicle Selected" startIcon={<Vehicles className="mr-2" />} />
      </div>
      <div className="m-6 flex flex-row">
        {selectedGroupData?.map((data: any, index: number) => (
          <span key={index} className="text-xs">
            {data.vehicleName}
            {index < selectedGroupData?.length - 1 && ','}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Button variant="text" color="primary" className="normal-case underline-offset-auto" onClick={() => setIsDrawerOpen(false)}>
          Edit Selection
        </Button>
      </div>
    </div>
  );
};

export default VehicleIds;
