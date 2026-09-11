'use client';

import CommonTabDraft from '@/components/Common/CommonTab/CommonTabDraft';
import CommonTextIcon from '@/components/Common/CommonTextIcon';
import ReservationListSkeletonUpdated from '@/components/Common/Skeletons/ReservationListSkeletonUpdated';
import DynamicCoverView from '@/components/UserProfileUpdated/DynamicCoverView';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { userReservationsTabList } from '@/utils/Lists/userProfileListInfo';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery } from '@mui/material';
import { useParams } from 'next/navigation';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';

const ReservationsLayout = ({ children }: { children: ReactNode }) => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const reservationDetailsID = parseInt(reservationId);
  const { userCred } = useUserCredContext();
  const { tempReservationList, vehicleSelect, setVehicleSelect, reservationSelect, setReservationSelect, sortCriteria, setSortCriteria } =
    useProfileInfoContext();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [reservationInputValue, setReservationInputValue] = useState<string | null>(null);
  const baseUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/reservations`;

  useEffect(() => {
    setVehicleSelect(undefined);
    setSortCriteria('');
    setReservationSelect(null);
  }, []);
  // For Sort by
  const handleSortCriteriaChange = (event: any) => {
    setSortCriteria(event.target.value);
    setVehicleSelect(undefined);
    setReservationSelect(null);
    setReservationInputValue('');
  };
  // For Specific Reservation
  const vehicleReservation = Array.from(new Set(tempReservationList?.map((reservation: any) => reservation?.reservationId) || []));
  const handleReservationInputChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setReservationInputValue(value);
    setSortCriteria('');
    setVehicleSelect(undefined);
    setReservationSelect(null);
  };
  //For  All Vehicles
  const uniqueCarNames = Array.from(new Set(tempReservationList?.map((reservation: any) => reservation?.vehicleModel) || []));
  // console.log(tempReservationList);
  const handleCarSelect = (event: any) => {
    setVehicleSelect(event.target.value);
    setSortCriteria('');
    setReservationSelect(null);
    setReservationInputValue('');
  };

  return (
    <>
      {!reservationDetailsID && (
        <>
          <DynamicCoverView title="My Guests Reservation" />
          <div className="sticky top-16 z-10 bg-white">
            <CommonTabDraft tabList={userReservationsTabList} baseUrl={baseUrl} />
            <div className="col-span-1 flex items-start justify-end">
              {/* <div className="grid grid-cols-1 md:grid-cols-2"> */}
              {!isSmallScreen && (
                <>
                  {/* Sorting Criteria */}
                  <FormControl variant="standard" sx={{ minWidth: 120 }} className="md:mr-2">
                    <InputLabel id="sort-label">Sort By</InputLabel>
                    <Select labelId="sort-label" label="Sort By" value={sortCriteria} onChange={handleSortCriteriaChange}>
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="ascTime">
                        <CommonTextIcon text="Time (Asc)" startIcon={<FaClock className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descTime">
                        <CommonTextIcon text="Time (Desc)" startIcon={<FaClock className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="ascReservationId">
                        <CommonTextIcon text="Res. ID (Asc)" startIcon={<RiSortAsc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descReservationId">
                        <CommonTextIcon text="Res. ID (Desc)" startIcon={<RiSortDesc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {/* All Vehicles */}
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel id="label"> {vehicleSelect ? 'Vehicle' : 'All Vehicles'}</InputLabel>
                    <Select
                      className={`${vehicleSelect ? '' : ''}`}
                      labelId="label"
                      label="All Vehicles"
                      value={vehicleSelect}
                      onChange={handleCarSelect}
                    >
                      <MenuItem value="">All Vehicles</MenuItem>
                      {uniqueCarNames.map((carName: any, index) => (
                        <MenuItem key={index} value={carName}>
                          {carName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
              {/*All Reservation */}
              <FormControl variant="standard" sx={{ minWidth: 120 }} className="md:mx-2">
                {/* <InputLabel id="reservation-label">{reservationSelect !== undefined ? 'Reservation' : 'All Reservation'}</InputLabel> */}
                <Autocomplete
                  value={reservationSelect}
                  inputValue={reservationInputValue || ''}
                  onInputChange={handleReservationInputChange}
                  options={vehicleReservation}
                  getOptionLabel={(option: any) => option.toString()}
                  renderInput={(params) => <TextField {...params} label="Reservation" variant="standard" />}
                  onChange={(event, value) => {
                    setReservationSelect(value as number);
                  }}
                />
              </FormControl>
              {/* </div> */}
            </div>
          </div>
        </>
      )}
      <Suspense fallback={!reservationDetailsID && <ReservationListSkeletonUpdated />}>{children}</Suspense>
    </>
  );
};

export default ReservationsLayout;
