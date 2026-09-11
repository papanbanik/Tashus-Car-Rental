'use client';
import CommonTextIcon from '@/components/Common/CommonTextIcon';
import VehicleListSkeleton from '@/components/Common/Skeletons/VehicleListSkeleton';
import { useCarListingContext } from '@/context/CarListingProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useDraftCarList } from '@/hooks/profile/useDraftCarList';
import { useVehicleList } from '@/hooks/profile/useVehicleList';
import { Autocomplete, Button, ButtonGroup, Chip, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiTrip } from 'react-icons/bi';
import { CgPlayList, CgPlayListCheck, CgPlayListRemove } from 'react-icons/cg';
import { FaList } from 'react-icons/fa';
import { IoGrid } from 'react-icons/io5';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from 'react-icons/tb';
import DynamicCoverView from '../DynamicCoverView';
import VehicleAdd from './Vehicle/VehicleAdd';
import VehicleCard from './Vehicle/VehicleCard';
import VehicleCardMobile from '@/components/UserProfileUpdated/Vehicles/Vehicle/VehicleCardMobile';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 120,
    },
  },
};

const Vehicles = () => {
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
  const [itemsFound, setItemsFound] = useState<number | undefined>(undefined);
  const [noStatusFound, setNoStatusFound] = useState<string | null>(null);
  // console.log(data?.data?.data?.listedCars);
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const draftUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/draft-lists`;
  const vehicleUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/car-listing`;
  //Redirect to details
  const editVehicle = (vehicleId: number) => {
    setListingId(vehicleId.toString());
    router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/vehicles/${vehicleId}/vehicle-info`);
  };
  const dataList = data?.data?.data?.listedCars || [];
  // console.log(dataList);
  // const vehicleListingID = Array.from(new Set(dataList?.map((item: any) => item?.listingId) || []));
  const vehicleListingID = Array.from(
    new Set(
      dataList?.map((item: any) => {
        return `${item?.car?.model} (${item?.listingId})`;
      }) || []
    )
  );

  // console.log(vehicleListingID);

  const uniqueCarNames = Array.from(new Set(dataList?.map((item: any) => item?.car?.model) || []));
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
        setGroupedData(dataList);
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
    if (dataList && dataList.length > 0) {
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
      if (groupedData?.length === 1) {
        setShowGrid(false);
      } else {
        setShowGrid(false);
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
            <div className={`grid grid-cols-1 items-center min-h-[45vh]`}>
              <div className="flex flex-row justify-between ">
                <div className="flex justify-start items-end">
                  {/* Grid and List */}
                  {!isSmallScreen && (
                    <div className="flex items-center justify-end">
                      <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                        <Button onClick={handleToggleLayout} className={`${showGrid ? 'bg-green-100' : 'bg-neutral'}`}>
                          <IoGrid className={`${showGrid ? 'text-success' : 'text-primary'} text-md `} />
                        </Button>
                        <Button onClick={handleToggleLayout} className={`${!showGrid ? 'bg-green-100' : 'bg-neutral'}`}>
                          <FaList className={`${!showGrid ? 'text-success' : 'text-primary'} text-md `} />
                        </Button>
                      </ButtonGroup>
                    </div>
                  )}
                  {itemsFound && (
                    <span className="text-primary font-bold lg:ml-2">{`${itemsFound ?? 0} ${itemsFound > 1 ? 'Vehicles' : 'Vehicle'} Found`}</span>
                  )}
                </div>
                <div className=" flex justify-start md:justify-end">
                  {/* <div className="grid grid-cols-2 lg:grid-cols-4"> */}
                  {/* {!isSmallScreen && (
                  <> */}
                  {/* Sort By */}
                  <FormControl variant="standard" sx={{ minWidth: 120 }} className="md:mr-2">
                    <InputLabel id="sort-label">Sort By</InputLabel>
                    <Select
                      className="text-sm md:text-md"
                      labelId="sort-label"
                      label="Sort By"
                      value={sortCriteria}
                      onChange={handleSortCriteriaChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="ascListingId">
                        <CommonTextIcon text="Listing ID (Asc)" startIcon={<RiSortAsc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descListingId">
                        <CommonTextIcon text="Listing ID (Desc)" startIcon={<RiSortDesc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="ascTrip">
                        <CommonTextIcon text="Trip (Asc)" startIcon={<BiTrip className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descTrip">
                        <CommonTextIcon text="Trip (Desc)" startIcon={<BiTrip className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="ascReview">
                        <CommonTextIcon text="Rating (Asc)" startIcon={<TbSortAscendingNumbers className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descReview">
                        <CommonTextIcon text="Rating (Desc)" startIcon={<TbSortDescendingNumbers className="text-primary text-md mr-2" />} />
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {!isSmallScreen && (
                    <>
                      {/* Listing Status */}
                      <FormControl variant="standard" sx={{ minWidth: 120 }} className="md:ml-2">
                        <InputLabel id="listing-status-label">Status</InputLabel>
                        <Select labelId="listing-status-label" id="listing-status" value={listingStatus} onChange={handleListingStatusChange}>
                          <MenuItem value={''}>All</MenuItem>
                          <MenuItem value="listed">
                            <CommonTextIcon text="Listed" startIcon={<CgPlayListCheck className="text-primary text-md mr-2" />} />
                          </MenuItem>
                          <MenuItem value="pending">
                            <CommonTextIcon text="Pending" startIcon={<CgPlayList className="text-primary text-md mr-2" />} />
                          </MenuItem>
                          <MenuItem value="unlisted">
                            <CommonTextIcon text="Unlisted" startIcon={<CgPlayListRemove className="text-primary text-md mr-2" />} />
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl variant="standard" sx={{ minWidth: 250 }} className="md:ml-2">
                        <Autocomplete
                          value={listingSelect}
                          inputValue={listingInputValue || ''}
                          onInputChange={handleListingInputChange}
                          options={vehicleListingID}
                          getOptionLabel={(option: any) => option.toString()}
                          renderInput={(params) => (
                            <TextField {...params} label={listingInputValue === '' ? 'All Vehicles' : 'Vehicle'} variant="standard" />
                          )}
                          onChange={(event, value) => {
                            setListingSelect(value as string);
                          }}
                        />
                      </FormControl>
                    </>
                  )}
                </div>
              </div>
              {/* For no status found message */}
              <div className="flex items-center justify-end mt-2">
                {noStatusFound && <Chip color="error" size="small" variant="outlined" label={noStatusFound} />}
              </div>
              <div className="flex justify-between md:justify-normal gap-2">
                {draftList?.data?.data?.draftList?.length > 0 && (
                  <div className="md:w-1/6">
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      className="normal-case flex justify-start bg-transparent"
                      onClick={() => router.push(draftUrl)}
                    >
                      {`Show Draft (${draftList?.data?.data?.draftList?.length})`}
                    </Button>
                  </div>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  className="normal-case flex justify-start bg-transparent"
                  onClick={() => router.push(vehicleUrl)}
                >
                  {`List another Vehicle`}
                </Button>
              </div>
              <div className={`grid grid-cols-1 ${showGrid ? 'lg:grid-cols-2' : 'lg:grid-cols-1 place-items-center'} gap-4 my-8`}>
                {groupedData?.map((carDetails: any, index: number) =>
                  showGrid ? (
                    <VehicleCardMobile key={index} vehicleDetails={carDetails} editVehicle={editVehicle} />
                  ) : (
                    <VehicleCard key={index} vehicleDetails={carDetails} editVehicle={editVehicle} />
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          <VehicleAdd draftList={draftList} draftUrl={draftUrl} />
        )}
      </div>
    </>
  );
};

export default Vehicles;
