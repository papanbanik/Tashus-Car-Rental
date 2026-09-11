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

const TravelsLayout = ({ children }: { children: ReactNode }) => {
  const { travelId } = useParams<{ travelId: string }>();
  const travelDetailsID = travelId ? parseInt(travelId) : null; // Handle undefined travelId
  const { userCred } = useUserCredContext();
  const { setVehicleSelect, reservationSelect, setReservationSelect, sortCriteria, setSortCriteria, tempTravelList } = useProfileInfoContext();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [travelInputValue, setTravelInputValue] = useState<string | null>(null);
  const baseUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/travels`;

  useEffect(() => {
    setVehicleSelect('');
    setSortCriteria('');
    setReservationSelect(null);
  }, []);

  // For Sort by
  const handleSortCriteriaChange = (event: any) => {
    setSortCriteria(event.target.value);
    setReservationSelect(null);
    setTravelInputValue('');
  };

  // For Specific Reservation
  const vehicleReservation = Array.from(new Set(tempTravelList?.map((travel: any) => travel?.reservationId) || []));
  const handleReservationInputChange = (event: React.ChangeEvent<{}>, value: string | null) => {
    setTravelInputValue(value);
    setSortCriteria('');
  };

  return (
    <>
      {(!travelDetailsID || isNaN(travelDetailsID)) && (
        <>
          <DynamicCoverView title="My Travels" />
          <div className="sticky z-10">
            {isSmallScreen ? (
              // Mobile Layout
              <div className="grid grid-cols-1 p-4 pb-2">
                <div className="col-span-1 w-full">
                  <CommonTabDraft tabList={userReservationsTabList} baseUrl={baseUrl} />
                </div>
                <div className="col-span-1 flex items-center justify-between mt-2 w-full gap-4">
                  <FormControl variant="standard" sx={{ minWidth: '50%' }} className="glassmorphism-input rounded-md">
                    <InputLabel id="sort-label" className="text-gray-700 font-medium">
                      Sort By
                    </InputLabel>
                    <Select labelId="sort-label" label="Sort By" value={sortCriteria} onChange={handleSortCriteriaChange} className="text-gray-800">
                      <MenuItem value="">
                        <span className="text-gray-600 font-medium">None</span>
                      </MenuItem>
                      <MenuItem value="ascTime">
                        <CommonTextIcon text="Time (Asc)" startIcon={<FaClock className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descTime">
                        <CommonTextIcon text="Time (Desc)" startIcon={<FaClock className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="ascReservationId">
                        <CommonTextIcon text="Reservation ID (Asc)" startIcon={<RiSortAsc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descReservationId">
                        <CommonTextIcon text="Reservation ID (Desc)" startIcon={<RiSortDesc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: '50%' }} className="glassmorphism-input rounded-md">
                    <Autocomplete
                      value={reservationSelect}
                      inputValue={travelInputValue || ''}
                      onInputChange={handleReservationInputChange}
                      options={vehicleReservation}
                      getOptionLabel={(option: any) => option.toString()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Reservation"
                          variant="standard"
                          InputLabelProps={{ className: 'text-gray-700 font-medium' }}
                          className="text-gray-800"
                        />
                      )}
                      onChange={(event, value) => {
                        setReservationSelect(value as number);
                      }}
                    />
                  </FormControl>
                </div>
              </div>
            ) : (
              // Large Screen Layout
              <div className="flex justify-between items-center px-4 py-2 glassmorphism rounded-lg bg-white">
                {/* Tabs Section */}
                <div className="flex items-center">
                  <CommonTabDraft tabList={userReservationsTabList} baseUrl={baseUrl} />
                </div>
                {/* Filters Section */}
                <div className="flex items-center space-x-4 -mt-2">
                  <FormControl variant="standard" sx={{ minWidth: 120 }} className="glassmorphism-input rounded-md">
                    <InputLabel id="sort-label" className="text-gray-700 font-medium">
                      Sort By
                    </InputLabel>
                    <Select labelId="sort-label" label="Sort By" value={sortCriteria} onChange={handleSortCriteriaChange} className="text-gray-800">
                      <MenuItem value="">
                        <span className="text-gray-600 font-medium">None</span>
                      </MenuItem>
                      <MenuItem value="ascTime">
                        <CommonTextIcon text="Time (Asc)" startIcon={<FaClock className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descTime">
                        <CommonTextIcon text="Time (Desc)" startIcon={<FaClock className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="ascReservationId">
                        <CommonTextIcon text="Reservation ID (Asc)" startIcon={<RiSortAsc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                      <MenuItem value="descReservationId">
                        <CommonTextIcon text="Reservation ID (Desc)" startIcon={<RiSortDesc className="text-primary text-md mr-2" />} />
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120 }} className="glassmorphism-input rounded-md">
                    <Autocomplete
                      value={reservationSelect}
                      inputValue={travelInputValue || ''}
                      onInputChange={handleReservationInputChange}
                      options={vehicleReservation}
                      getOptionLabel={(option: any) => option.toString()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Reservation"
                          variant="standard"
                          InputLabelProps={{ className: 'text-gray-700 font-medium' }}
                          className="text-gray-800"
                        />
                      )}
                      onChange={(event, value) => {
                        setReservationSelect(value as number);
                      }}
                    />
                  </FormControl>
                </div>
              </div>
            )}
          </div>
          {/* Adjust margin below the sticky section for mobile */}
          <div className={isSmallScreen ? 'mt-0' : 'mt-4'}>
            <Suspense fallback={!travelDetailsID && <ReservationListSkeletonUpdated />}>{children}</Suspense>
          </div>
        </>
      )}
      {travelDetailsID && !isNaN(travelDetailsID) && <Suspense fallback={<ReservationListSkeletonUpdated />}>{children}</Suspense>}

      {/* Inline Styles */}
      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glassmorphism-input {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(6px);
          padding: 4px 8px;
          transition: all 0.3s ease;
        }
        .glassmorphism-input:hover {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default TravelsLayout;
