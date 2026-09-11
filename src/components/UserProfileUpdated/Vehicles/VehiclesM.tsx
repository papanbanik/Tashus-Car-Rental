'use client';
import VehicleListSkeleton from '@/components/Common/Skeletons/VehicleListSkeleton';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useDraftCarList } from '@/hooks/profile/useDraftCarList';
import { useVehicleList } from '@/hooks/profile/useVehicleList';
import { Chip, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DynamicCoverView from '../DynamicCoverView';
import VehicleActions from './Vehicle/VehicleActions';
import VehicleAdd from './Vehicle/VehicleAdd';
import VehicleDisplay from './Vehicle/VehicleDisplay';
import VehicleSortFilter from './Vehicle/VehicleSortFilter';

const VehiclesM = () => {
  const router = useRouter();
  const { data, isLoading } = useVehicleList();
  const { userCred } = useUserCredContext();
  const { setListingId } = useCarListingContext();
  const { data: draftList } = useDraftCarList();
  const [sortCriteria, setSortCriteria] = useState('');
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const [listingStatus, setListingStatus] = useState<string | null>(null);
  const [vehicleSelect, setVehicleSelect] = useState<string | null>(null);
  const [listingSelect, setListingSelect] = useState<string | null>(null);
  const [listingInputValue, setListingInputValue] = useState<string | null>(null);
  const [itemsFound, setItemsFound] = useState<number>(0);
  const [noStatusFound, setNoStatusFound] = useState<string | null>(null);
  // console.log(data?.data?.data?.listedCars);
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  //Redirect to details
  const draftUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/draft-lists`;
  const editVehicle = (vehicleId: number) => {
    setListingId(vehicleId.toString());
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles/${vehicleId}/vehicle-info`);
  };
  const dataList = data?.data?.data?.listedCars || [];

  const vehicleListingID: string[] = Array.from(
    new Set(
      dataList?.map((item: any) => {
        return `${item?.car?.model} (${item?.listingId})`;
      }) || []
    )
  );

  //For Sort by Asc Desc
  useEffect(() => {
    if (dataList && dataList.length > 0) {
      let sortedDataList = [...dataList];

      if (sortCriteria === 'ascListingId') {
        sortedDataList.sort((a, b) => a.listingId - b.listingId);
      } else if (sortCriteria === 'descListingId') {
        sortedDataList.sort((a, b) => b.listingId - a.listingId);
      } else if (sortCriteria === 'ascTrip') {
        sortedDataList.sort((a, b) => a.totalTrips - b.totalTrips);
      } else if (sortCriteria === 'descTrip') {
        sortedDataList.sort((a, b) => b.totalTrips - a.totalTrips);
      } else if (sortCriteria === 'ascReview') {
        // sortedDataList.sort((a, b) => a.totalRatings - b.totalRatings);
        sortedDataList.sort(
          (a, b) => Math.ceil((a.totalRatings / a.ratingsReceivedFrom) * 10) / 10 - Math.ceil((b.totalRatings / b.ratingsReceivedFrom) * 10) / 10
        );
      } else if (sortCriteria === 'descReview') {
        // sortedDataList.sort((a, b) => b.totalRatings - a.totalRatings);
        sortedDataList.sort(
          (a, b) => Math.ceil((b.totalRatings / b.ratingsReceivedFrom) * 10) / 10 - Math.ceil((a.totalRatings / a.ratingsReceivedFrom) * 10) / 10
        );
      }

      setGroupedData(sortedDataList);
    }
  }, [dataList, sortCriteria]);
  const handleSortCriteriaChange = (event: any) => {
    setSortCriteria(event.target.value);
    setListingStatus('');
    setVehicleSelect(null);
    setListingSelect(null);
    setListingInputValue('');
  };
  //For Sort by Listing Status
  useEffect(() => {
    if (dataList && dataList.length > 0) {
      const filteredDataList = listingStatus ? dataList.filter((item: any) => item.listingStatus === listingStatus) : dataList;
      // console.log(dataList);
      if (filteredDataList.length > 0) {
        setNoStatusFound('');
        setGroupedData(filteredDataList);
      } else {
        setNoStatusFound(`No ${listingStatus} vehicle found`);
        setGroupedData([]);
      }
      // console.log(groupedData);
    }
  }, [data, listingStatus]);

  const handleListingStatusChange = (event: any) => {
    setListingStatus(event.target.value);
    setVehicleSelect(null);
    setListingSelect(null);
    setListingInputValue('');
    setSortCriteria('');
  };
  //For Sort by Specific Listing ID
  useEffect(() => {
    if (dataList && dataList.length > 0) {
      const filteredDataList = listingSelect
        ? dataList.filter((item: any) => `${item?.car?.model} (${item?.listingId})` === listingSelect)
        : [...dataList];
      setGroupedData(filteredDataList);
    }
  }, [dataList, listingSelect]);

  const handleListingInputChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setListingInputValue(value);
    setListingStatus('');
    setVehicleSelect(null);
    setSortCriteria('');
  };

  useEffect(() => {
    if (dataList && dataList?.length > 0) {
      const filteredDataList = vehicleSelect ? dataList?.filter((item: any) => item?.car?.model === vehicleSelect) : [...dataList];
      setGroupedData(filteredDataList);
    }
  }, [data, vehicleSelect]);

  //Items found
  const handleToggleLayout = () => {
    setShowGrid(!showGrid);
  };

  useEffect(() => {
    if (groupedData?.length > 0) {
      setItemsFound(groupedData?.length);
      if (groupedData?.length < 3) {
        setShowGrid(true);
      } else {
        setShowGrid(showGrid);
      }
    }
  }, [groupedData]);
  return (
    <>
      <DynamicCoverView title="My Listed Vehicles " />
      <div className="p-4">
        {isLoading ? (
          <VehicleListSkeleton />
        ) : data?.data?.data?.listedCars?.length > 0 ? (
          <>
            <div className={`grid grid-cols-1 gap-2 min-h-[45vh]`}>
              <div className="flex flex-col gap-2">
                <VehicleSortFilter
                  sortCriteria={sortCriteria}
                  listingStatus={listingStatus}
                  isSmallScreen={isSmallScreen}
                  showGrid={showGrid}
                  handleToggleLayout={handleToggleLayout}
                  itemsFound={itemsFound}
                  handleSortCriteriaChange={handleSortCriteriaChange}
                  handleListingStatusChange={handleListingStatusChange}
                  listingSelect={listingSelect}
                  listingInputValue={listingInputValue}
                  vehicleListingID={vehicleListingID}
                  handleListingInputChange={handleListingInputChange}
                  setListingSelect={setListingSelect}
                />
                <VehicleActions draftCount={draftList?.data?.data?.draftList?.length ?? 0} draftUrl={draftUrl} />
              </div>
              {!!noStatusFound ? (
                <Chip color="error" size="small" variant="outlined" label={noStatusFound} />
              ) : (
                <VehicleDisplay groupedData={groupedData} showGrid={showGrid} editVehicle={editVehicle} />
              )}
            </div>
          </>
        ) : (
          <VehicleAdd draftList={draftList} draftUrl={draftUrl} />
        )}
      </div>
    </>
  );
};

export default VehiclesM;
