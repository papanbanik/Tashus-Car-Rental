'use client';
import { useCarListingContext } from '@/context/CarListingProvider';
import { SidebarContentProps } from '@/types/user-profile/customPriceTypes';
import { Autocomplete, Button, TextField } from '@mui/material';
import React, { useState } from 'react';

const SidebarContent = ({ groupData, setIsDrawerOpen, handleSelectAll, isCheckedMap, listingSelect, setListingSelect }: SidebarContentProps) => {
  const { userVehicleList } = useCarListingContext();
  const [listingInputValue, setListingInputValue] = useState<string | null>(null);
  const handleListingInputChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setListingInputValue(value);
  };
  const vehicleListingID = Array.from(
    new Set(
      userVehicleList?.map((item: any) => {
        return `${item?.car?.model} (${item?.listingId})`;
      }) || []
    )
  );
  const isCheckedMapNotEmpty = Object.keys(isCheckedMap).length > 0;
  const selectedGroupData = groupData.length > 0 ? groupData.filter((data: any) => data.isSelected) : [];
  return (
    <div className="h-full w-full bg-white shadow-lg shadow-secondary">
      <span className="font-bold flex items-center justify-center text-lg">
        {userVehicleList?.length || 'No'} {userVehicleList?.length > 0 ? 'vehicles' : 'vehicle'} listing
      </span>
      <Autocomplete
        value={listingSelect}
        inputValue={listingInputValue || ''}
        onInputChange={handleListingInputChange}
        options={vehicleListingID}
        getOptionLabel={(option: any) => option.toString()}
        renderInput={(params) => <TextField {...params} label={'Search vehicle'} size="small" variant="outlined" className="px-2" />}
        onChange={(event, value) => {
          setListingSelect(value as string);
        }}
      />
      <div className="flex justify-between items-end mx-2">
        <Button
          variant="text"
          color="primary"
          className="normal-case text-end text-sm m-0 p-0"
          disabled={selectedGroupData?.length < 1}
          onClick={() => setIsDrawerOpen(true)}
        >
          Update Price
        </Button>
        <Button variant="text" color="primary" className="normal-case text-end text-sm m-0 p-0" onClick={handleSelectAll}>
          {isCheckedMapNotEmpty ? (Object.values(isCheckedMap).every((isChecked) => isChecked) ? 'Deselect' : 'Select') : 'Select'} all
        </Button>
      </div>
    </div>
  );
};

export default SidebarContent;
