import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import ReservationListSkeletonUpdated from '@/components/Common/Skeletons/ReservationListSkeletonUpdated';
import { TSingleTravel, TUpdatedTravelData } from '@/types/travels/typeEditTravels';
import { TravelDetailsState } from '@/types/travels/typeTravels';
import { groupAndSortData } from '@/utils/Functions/travel-list/travelListFn';
import { IconButton, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

import SingleTravelDataM from './SingleTravelDataM';

export interface TravelDataProps {
  travelType: string;
  dataList?: TSingleTravel[];
  isLoading?: boolean;
}

export type TGroupedData = {
  groupName: string;
  groupDataList: TSingleTravel[];
};

const TravelDataM = ({ travelType, dataList, isLoading = false }: TravelDataProps) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const pathName = usePathname();
  const isPast = pathName.includes('past');
  const isUpcoming = pathName.includes('upcoming');
  const { setTravelDetails, vehicleSelect, reservationSelect, sortCriteria } = useProfileInfoContext();
  const { setUpdatedTravelData } = useTravelContext();

  const [groupedData, setGroupedData] = useState<TGroupedData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]); // Store multiple expanded group indices

  useEffect(() => {
    setExpandedGroups([]);
  }, [pathName]);
  // For Vehicle Select
  useEffect(() => {
    setTravelDetails({} as TravelDetailsState);
    setUpdatedTravelData({} as TUpdatedTravelData);
    if (dataList && dataList?.length > 0) {
      let tempDataList = [...dataList];

      if (vehicleSelect && pathName?.includes('reservations')) {
        tempDataList = tempDataList?.filter((travelData) => travelData?.vehicleModel === vehicleSelect);
      }
      if (reservationSelect) {
        tempDataList = tempDataList.filter((travelData) => travelData?.reservationId === reservationSelect);
      }
      const filteredData = groupAndSortData(tempDataList, undefined, isPast, isUpcoming);
      setGroupedData(filteredData);
    }
  }, [dataList, vehicleSelect, reservationSelect, sortCriteria, isPast, isUpcoming]);

  // For Reservation Select
  // Set the expanded group to the current month only if it's not manually collapsed
  useEffect(() => {
    if (groupedData && groupedData?.length > 0) {
      if (isPast) {
        if (!expandedGroups.includes(0)) {
          setExpandedGroups((prev) => [...prev, 0]);
        }
      } else {
        const currentMonth = dayjs().format('MMMM YYYY');
        const currentMonthIndex = groupedData.findIndex((group) => group.groupName === currentMonth);
        // Only expand the current month if it's not already manually collapsed
        const indexToExpand = currentMonthIndex !== -1 ? currentMonthIndex : 0;
        if (!expandedGroups.includes(indexToExpand)) {
          setExpandedGroups((prev) => [...prev, indexToExpand]);
        }
      }
    }
  }, [groupedData]);

  // Toggle group expansion on click
  const handleToggleGroup = (index: number) => {
    setExpandedGroups((prevExpandedGroups) => {
      if (prevExpandedGroups.includes(index)) {
        return prevExpandedGroups.filter((groupIndex) => groupIndex !== index); // Collapse
      } else {
        return [...prevExpandedGroups, index]; // Expand
      }
    });
  };

  return (
    <div>
      {isLoading ? (
        <ReservationListSkeletonUpdated />
      ) : groupedData?.length > 0 ? (
        <>
          {groupedData?.map((group, index) => (
            <div key={index}>
              <div
                className="text-md font-medium text-right cursor-pointer hover:text-primary hover:font-bold"
                onClick={() => handleToggleGroup(index)}
              >
                <div className="flex items-center">
                  <div className="bg-slate-300 h-[1px] flex-grow" />
                  <div className="ml-2">
                    {group?.groupName} <span className="text-sm">({group?.groupDataList?.length})</span>
                  </div>
                  <IconButton>
                    {expandedGroups.includes(index) ? (
                      <IoChevronUp className="text-black text-sm" />
                    ) : (
                      <IoChevronDown className="text-black text-sm" />
                    )}
                  </IconButton>
                </div>
              </div>
              <div className={`grid grid-cols-1 gap-4 my-8 ${expandedGroups.includes(index) ? '' : 'hidden'}`}>
                {group?.groupDataList.map((travel: TSingleTravel) => (
                  <SingleTravelDataM key={travel?.reservationId} travel={travel} />
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <span className={`${isSmallScreen && ` flex justify-center items-center`}`}>
          No {travelType} {pathName?.includes('travel') ? 'travel' : 'reservation'} yet.
        </span>
      )}
    </div>
  );
};

export default TravelDataM;
