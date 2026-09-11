'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useVehicleList } from '@/hooks/profile/useVehicleList';
import { CommonTabProps } from '@/types/componentTypes';
import { TabListType } from '@/utils/Lists/userProfileListInfo';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { iconArrayForEditTabList } from '../../Layouts/CarListingSteps/ListingStepper';
import './CommonTab.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return <>{value === index && <>{children}</>}</>;
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const VehicleUpdatedTab = ({ tabList, children, orientation, vehicleNickName, isSmall, isEdit }: CommonTabProps) => {
  const [value, setValue] = useState<number>(0);
  const router = useRouter();
  const { data } = useVehicleList();
  const [selectedCarModel, setSelectedCarModel] = useState<string>('');
  const { userCred } = useUserCredContext();
  const { getSubString, listingId, setListingId, userVehicleList } = useCarListingContext();

  // set active tab after refresh
  useEffect(() => {
    const lastPath = getSubString();
    const currentTab = tabList?.find((tab: TabListType) => tab?.routeName === lastPath);
    const currentTabValue = currentTab ? parseInt(currentTab?.id || '') - 1 : 0;
    setValue(currentTabValue);
  }, []);

  const handleDropDownChange = (event: SelectChangeEvent<string>) => {
    const selectedVehicle = event.target.value;

    if (selectedVehicle === 'seeAllVehicles') {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles`);
    } else {
      const selectedCar = userVehicleList.find((car: any) => car?.carNickName === selectedVehicle);

      if (selectedCar) {
        setSelectedCarModel(selectedCar?.carNickName);
        setListingId(selectedCar.listingId);
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles/${selectedCar.listingId}/${tabList[value]?.routeName}`);
      } else {
        setListingId(selectedVehicle);
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles/${selectedVehicle}/${tabList[value]?.routeName}`);
      }
    }
    //const selectedCar = data?.data?.data?.listedCars.find((car: any) => car?.listingId === selectedListingId);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (!orientation) {
      const routeString = newValue === 0 ? '' : `/${tabList[newValue]?.routeName}`;
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}${routeString}`);
    } else {
      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles/${listingId}/${tabList[newValue]?.routeName}`);
    }
  };

  return (
    <div className={`w-full rounded ${orientation ? 'lg:h-[650px] lg:sticky sm:top-28 mt-5 lg:mt-0' : 'flex-col'} justify-center items-center`}>
      <div className={`bg-white ${isSmall ? 'w-11/12 top-2.5' : 'w-full'}`}>
        {isSmall && (
          <span className="text-end text-2xl pe-3.5 cursor-pointer block font-semibold text-primary">
            <AiOutlineArrowLeft />
          </span>
        )}

        <span className="relative z-10 flex justify-center items-center mt-4 ">
          {/* <span className="font-semibold text-lg mb-2 ">{vehicleModel}</span> */}
          <FormControl variant="standard" className="w-full text-center">
            {/* {!vehicleNickName && (
                <InputLabel id="label" className="text-center">
                  Select a Vehicle
                </InputLabel>
              )} */}
            <Select label="Select a Value" value={vehicleNickName !== '' ? vehicleNickName : 'No NickName'} onChange={handleDropDownChange} fullWidth>
              {data?.data?.data?.listedCars.map((car: any, index: any) => (
                <MenuItem key={index} value={car?.carNickName ? car.carNickName : car?.listingId}>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {car?.carNickName ? car?.carNickName : car?.listingId}
                  </Typography>
                </MenuItem>
              ))}
              {data?.data?.data?.listedCars?.length > 0 && (
                <MenuItem value="seeAllVehicles">
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    See All Vehicles
                  </Typography>
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </span>
      </div>
      <div className="absolute z-0 flex justify-center mt-[-35px] ">
        <Tabs
          orientation={orientation || 'horizontal'}
          // value={value}
          value={vehicleNickName ? value : 0}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          // onChange={handleChange}
          onChange={vehicleNickName ? handleChange : undefined}
          // className={` ${isSmall ? 'mt-6' : ''}`}
        >
          {tabList?.map((tab, index) => {
            const labelString = typeof tab.label === 'string' ? tab.label : tab.label;
            return (
              <Tab
                key={tab.id}
                label={
                  <span
                    className={`flex justify-start items-center w-full ${value === index ? 'bg-primary text-white' : ''}`}
                    // onClick={(event) => !vehicleModel && event.preventDefault()}
                    onClick={(event) => {
                      if (!vehicleNickName) {
                        event?.preventDefault();
                      }
                    }}
                    style={vehicleNickName ? {} : { opacity: 0.6, pointerEvents: 'none' }}
                  >
                    <span
                      className={`text-3xl mt-1 me-3 ${value === index && value !== 10 && value !== 5 ? 'vehicleEditIconsList' : ''}`}
                      style={{ stroke: value === index ? '#ffffff' : '' }}
                    >
                      {iconArrayForEditTabList[index] && orientation && React.createElement(iconArrayForEditTabList[index])}
                    </span>
                    <div className="capitalize text-base font-semibold">{labelString}</div>
                  </span>
                }
                {...a11yProps(parseInt(tab.id) - 1)}
                className="pb-0 w-full flex flex-row"
              />
            );
          })}
        </Tabs>
      </div>
      {children}
      {/* {tabList?.map((tab) => (
        <CustomTabPanel value={value} index={parseInt(tab.id) - 1}>
          {tab.component}
        </CustomTabPanel>
      ))} */}
    </div>
  );
};

export default VehicleUpdatedTab;
