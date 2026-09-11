'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TSingleTravel, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SingleTravelDataNew from './SingleTravelData';
import { TravelDetailsState } from '@/types/travels/typeTravels';

export interface TravelDataProps {
  travelType: string;
  dataList?: TSingleTravel[];
}

export type TGroupedData = {
  groupName: string;
  groupDataList: TSingleTravel[];
};

const TravelDataNew: React.FC<TravelDataProps> = ({ travelType, dataList }) => {
  // console.log(dataList);

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const pathName = usePathname();
  const router = useRouter();

  const { setTravelDetails, vehicleSelect, reservationSelect, sortCriteria } = useProfileInfoContext();
  const { setUpdatedTravelData } = useTravelContext();

  const [groupedData, setGroupedData] = useState<TGroupedData[]>();

  useEffect(() => {
    setTravelDetails({} as TravelDetailsState);
    setUpdatedTravelData({} as TUpdatedTravelData);
    if (dataList && dataList?.length > 0) {
      const tempDataList =
        vehicleSelect && pathName?.includes('reservations')
          ? dataList?.filter((travelData) => travelData?.vehicleModel === vehicleSelect)
          : [...dataList];
      let tempGroupDataList: any = [];

      tempDataList.forEach((travelData) => {
        const monthYear = dayjs(travelData.pickupDate).format('MMMM YYYY');

        // Check if a group with the same groupName already exists
        const existingGroup = tempGroupDataList.find((group: any) => group.groupName === monthYear);

        if (existingGroup) {
          existingGroup.groupDataList.push(travelData);
        } else {
          // Create a new group
          tempGroupDataList.push({
            groupName: monthYear,
            groupDataList: [travelData],
          });
        }
      });

      // console.log('tempGroupDataList', tempGroupDataList);
      setGroupedData(tempGroupDataList);
    }
  }, [dataList, vehicleSelect]);

  //For ReservationSelect
  useEffect(() => {
    setTravelDetails({} as TravelDetailsState);
    setUpdatedTravelData({} as TUpdatedTravelData);
    if (dataList && dataList?.length > 0) {
      const tempDataList = reservationSelect ? dataList?.filter((travelData) => travelData?.reservationId === reservationSelect) : [...dataList];
      // console.log(tempDataList);
      let tempGroupDataList: any = [];

      tempDataList.forEach((travelData) => {
        const monthYear = dayjs(travelData.pickupDate).format('MMMM YYYY');

        // Check if a group with the same groupName already exists
        const existingGroup = tempGroupDataList.find((group: any) => group.groupName === monthYear);

        if (existingGroup) {
          existingGroup.groupDataList.push(travelData);
        } else {
          // Create a new group
          tempGroupDataList.push({
            groupName: monthYear,
            groupDataList: [travelData],
          });
        }
      });

      // console.log('tempGroupDataList', tempGroupDataList);
      setGroupedData(tempGroupDataList);
    }
  }, [dataList, reservationSelect]);
  //For Sort
  useEffect(() => {
    setTravelDetails({} as TravelDetailsState);
    setUpdatedTravelData({} as TUpdatedTravelData);
    if (dataList && dataList?.length > 0) {
      let sortedDataList = [...dataList];

      if (sortCriteria === 'ascTime') {
        sortedDataList = sortedDataList.sort((a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime());
      } else if (sortCriteria === 'descTime') {
        sortedDataList = sortedDataList.sort((a, b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime());
      } else if (sortCriteria === 'ascReservationId') {
        sortedDataList = sortedDataList.sort((a, b) => a.reservationId - b.reservationId);
      } else if (sortCriteria === 'descReservationId') {
        sortedDataList = sortedDataList.sort((a, b) => b.reservationId - a.reservationId);
      }

      let tempGroupDataList: any = [];

      sortedDataList.forEach((travelData) => {
        const monthYear = dayjs(travelData.pickupDate).format('MMMM YYYY');

        const existingGroup = tempGroupDataList.find((group: any) => group.groupName === monthYear);

        if (existingGroup) {
          existingGroup.groupDataList.push(travelData);
        } else {
          tempGroupDataList.push({
            groupName: monthYear,
            groupDataList: [travelData],
          });
        }
      });
      setGroupedData(tempGroupDataList);
    }
  }, [dataList, sortCriteria]);

  const showDetails = (travelId: number) => {
    const updatedPathname = pathName.slice(0, pathName.lastIndexOf('/'));
    // console.log(updatedPathname);
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}${updatedPathname}/details/${travelId}`);
  };

  // if (dataList?.length === 0) {
  //   return <div className={`${isSmallScreen && ` flex justify-center items-center`}`}>Loading...</div>;
  // }

  // console.log(groupedData);

  return (
    <div>
      {!groupedData || groupedData?.length === 0 ? (
        <span className={`${isSmallScreen && ` flex justify-center items-center`}`}>
          No {travelType} {pathName?.includes('travel') ? 'travel' : 'reservation'} yet.
        </span>
      ) : (
        <>
          {groupedData?.map((group, index) => (
            <div key={index}>
              <div className="text-xl font-bold text-right">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="bg-primary h-[2px] flex-grow" />
                  <div className="ml-2">{group?.groupName}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 my-8">
                {group?.groupDataList.map((travel: TSingleTravel) => (
                  <SingleTravelDataNew key={travel?.reservationId} travel={travel} showDetails={showDetails}></SingleTravelDataNew>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TravelDataNew;
