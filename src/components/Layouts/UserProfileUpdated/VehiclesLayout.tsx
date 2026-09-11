'use client';

import CommonBreadCrumb from '@/components/Common/Breadcrumbs/CommonBreadCrumb';
import CommonDrawer from '@/components/Common/CommonDrawer';
import VehicleUpdatedTab from '@/components/Common/CommonTab/VehicleUpdatedTab';
import VehicleEditInfoSkeleton from '@/components/Common/Skeletons/VehicleEditInfoSkeleton';
import { useCarListingContext } from '@/context/CarListingProvider';
import useIPadProQuery from '@/hooks/responsive/useIPadProQuery';
import { useCarListingSteps } from '@/hooks/useCarListing';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { editVehicleTabList } from '@/utils/Lists/userProfileListInfo';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const VehiclesLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId, vehicleId } = useParams<{ userId: string; vehicleId: string }>();
  const { carData, setCarData, listingId, setListingId, setEnableListSteps, setIsHideSpaceForEditVehicle, setIsEditVehicle } = useCarListingContext();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isIPadPro = useIPadProQuery();

  useEffect(() => {
    setCarData({} as CarDataState);
  }, [vehicleId]);

  useEffect(() => {
    setListingId(vehicleId);
    // setListingId('1110');
    setEnableListSteps(true);
    setIsHideSpaceForEditVehicle(true);
    setIsEditVehicle(true);
  }, []);

  const handleVehicleData = (vehicleData: any) => {
    setCarData(vehicleData);
    setEnableListSteps(false);
  };

  const { data, isLoading } = useCarListingSteps(handleVehicleData);

  const vehicleNickName = carData?.carNickName ? carData?.carNickName : listingId;
  const vehiclesUrl = `/dashboard/${userId}/vehicles`;
  const vehicleEditBreadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Vehicles', href: vehiclesUrl },
    { label: `${carData?.car?.model ?? 'Loading...'}` },
  ];
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const isFirstRender = useRef<boolean>(true);
  useEffect(() => {
    if (isSmall && isFirstRender.current) {
      setDrawerOpen(true);
      isFirstRender.current = false;
    }
  }, [isSmall]);
  return (
    <>
      <div className="flex justify-center">
        <div className="w-10/12 mb-4">
          <CommonBreadCrumb items={vehicleEditBreadcrumbItems}></CommonBreadCrumb>
        </div>
      </div>

      {!isSmall && (
        <div className="flex justify-center">
          <div className="flex w-10/12 gap-2">
            <div className={`w-1/5 bg-white rounded-lg shadow-md shadow-secondary lg:sticky`}>
              <VehicleUpdatedTab tabList={editVehicleTabList} orientation="vertical" vehicleNickName={vehicleNickName} isEdit={true} />
            </div>

            <>
              {carData?.car ? (
                <div className="w-4/5 bg-white rounded-lg shadow-md shadow-secondary max-w-5xl p-4">{children}</div>
              ) : data === undefined && !isLoading ? (
                <div className="lg:w-4/5 sm:4/5 mt-4 w-full text-center order-last lg:mb-0 mb-4">
                  <div className="h-96 w-full bg-secondary rounded-lg flex justify-center items-center relative">
                    <p className="absolute top-0 text-lg font-semibold text-primary">No Vehicle Found</p>
                    <Image className="mt-6" style={{ objectFit: 'contain' }} src={'/CarListing/no-draft-2.svg'} alt="no vehicle" fill={true}></Image>
                  </div>
                </div>
              ) : (
                <div className="lg:w-4/5 sm:4/5  w-full text-center order-last lg:mb-0 mb-4">
                  <div className=" w-full  rounded-lg flex justify-center items-center relative">
                    <VehicleEditInfoSkeleton />
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      )}
      {isSmall && (
        <>
          <CommonDrawer
            drawerAnchor="left"
            vehicleNickName={vehicleNickName}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
          >
            <VehicleUpdatedTab
              tabList={editVehicleTabList}
              orientation="vertical"
              vehicleNickName={vehicleNickName}
              isEdit={true}
              isSmall={isSmall}
            />
          </CommonDrawer>
          {/* {children} */}
          {carData?.car ? (
            <div className={`lg:w-4/5 sm:4/5 w-full text-center order-last lg:mb-0 mb-4`}>{children}</div>
          ) : data === undefined && !isLoading ? (
            <div className="lg:w-4/5 sm:4/5 mt-2 w-full text-center order-last lg:mb-0 mb-4">
              <div className="h-96 w-full bg-secondary rounded-lg flex justify-center items-center relative">
                <p className="absolute top-0 text-lg font-semibold text-primary">No Vehicle Found</p>
                <Image className="mt-6" style={{ objectFit: 'contain' }} src={'/CarListing/no-draft-2.svg'} alt="no vehicle" fill={true}></Image>
              </div>
            </div>
          ) : (
            <div className="lg:w-4/5 sm:4/5  w-full text-center order-last lg:mb-0 mb-4">
              <div className=" w-full  rounded-lg flex justify-center items-center relative">
                <VehicleEditInfoSkeleton />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VehiclesLayout;
