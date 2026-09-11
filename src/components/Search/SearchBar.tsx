'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { CarSearchType } from '@/types/searchingTypes';
import { isGuestRestrict } from '@/utils/Functions/accountStatusCommonFn';
import { combineDateTime, getDefaultEndTime, getDefaultStartTime, getRoundUpStartTime } from '@/utils/Functions/dateTimeCommonFn';
import { getCombinedPickReturnUtc } from '@/utils/Functions/utcCommonFn';
import { Button, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';
import { FaSearchLocation } from 'react-icons/fa';
import { buildQueryParams, defaultCoordinate, searchedAvailabilityValidation } from '../../utils/Functions/searchCommonFn';
import { fetchReverseGeocoding, transformGeocodingResult } from '../CarListing/CarLocation/map.common';
import CommonAccStatusAlert from '../Common/CommonAccStatusAlert';
import CommonForm from '../Common/CommonForm';
import CustomSearchDateTimePickerTz from '../Common/DateTimePickers/CustomSearchDateTimePickerTz';
import Location from '../LandingPage/Hero/Location';

const defaultValues: CarSearchType = {
  location: {
    street: '',
    state: '',
    city: '',
    country: '',
    postalCode: '',
    coordinates: [0, 0],
    stateShortCode: '',
    countryShortCode: '',
  },
  startDate: new Date(),
  endDate: new Date(),
  startTime: getDefaultStartTime().toDate(),
  endTime: getDefaultEndTime().toDate(),
};

const SearchBar = () => {
  const { register, handleSubmit, control, formState, watch, setValue, reset, getValues, setError, clearErrors, trigger } = useForm<CarSearchType>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { guestAccess } = useProfileInfoContext();
  const router = useRouter();
  const [allowFilter, setAllowFilter] = useState<boolean>(false); //to solve invalid date range error in search page
  const { searchParams, setSearchParams, setSelectedFilters, searchedCarList, setAvailableCarList, setFilteredCarList, setSearchedCarList } =
    useSearchContext();
  const { openSnackBar } = useSnackBarContext();

  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    setError,
    clearErrors,
    trigger,
  };

  useEffect(() => {
    setValue('location.city', searchParams?.city || '');
    setValue('location.countryShortCode', searchParams?.country || '');
    setValue('location.stateShortCode', searchParams?.region || '');
    setValue('location.postalCode', searchParams?.postcode || '');
    setValue('location.coordinates', [parseFloat(searchParams?.long) || 0, parseFloat(searchParams?.lat) || 0]);
    setValue('startDate', new Date(searchParams?.pickup));
    setValue('endDate', new Date(searchParams?.return));
    setValue('startTime', new Date(searchParams?.pickup));
    setValue('endTime', new Date(searchParams?.return));
    setAllowFilter(true); //to solve invalid date range error in search page
  }, [searchParams]);

  // Filter cars based on their availability
  useEffect(() => {
    //checking dates to avoid invalid date error
    if (searchedCarList?.length > 0 && allowFilter && watch('startDate') && watch('startTime') && watch('endDate') && watch('endTime')) {
      // console.log(searchedCarList);

      const tempSearchedList = [...searchedCarList];
      // console.log('start', watch('startDate'), watch('startTime'));
      // console.log('end', watch('endDate'), watch('endTime'));
      const pickupTime = combineDateTime(watch('startDate'), watch('startTime'), 'bar pick');
      const returnTime = combineDateTime(watch('endDate'), watch('endTime'), 'bar ret');

      const tempAvailableCarList = tempSearchedList?.map(async (car: any) => {
        const isAvailable = await searchedAvailabilityValidation(car, pickupTime, returnTime);
        if (isAvailable) {
          return car;
        }
      });

      // Checking web and app search result matching
      Promise.all(tempAvailableCarList).then((result) => {
        const updatedResult = result?.filter((car) => car !== undefined);
        setAvailableCarList(updatedResult);
        setFilteredCarList(updatedResult);
        // const appList = [
        //   1144, 1112, 1118, 1113, 1125, 1001, 1129, 1138, 1133, 1134, 18, 23, 19, 20, 14, 16, 17, 21, 41, 58, 43, 2, 40, 39, 61, 36, 37, 55, 54, 62,
        //   34, 38, 60, 57, 42, 59, 63, 6, 11, 9, 8, 4, 5, 3, 10, 12, 33, 49, 52, 44, 30, 28, 27, 51, 47, 45, 48, 29, 1130,
        // ];
        // const beforeList = tempSearchedList?.map((result: any) => result.listingId);
        // const afterList = updatedResult?.map((result: any) => result.listingId);
        // console.log(beforeList);
        // console.log(beforeList?.length, afterList?.length);
        // const resultList = beforeList?.filter((item) => !afterList.includes(item));
        // console.log(resultList);
      });
      setAllowFilter(false); //so that whenever filter doesn't occur without clicking on search icon
    }
  }, [searchedCarList, watch('startDate'), watch('startTime'), watch('endDate'), watch('endTime'), allowFilter]);

  const onSearchVehicle: SubmitHandler<CarSearchType> = async (data) => {
    const { location, startDate, endDate, startTime, endTime } = data;
    // console.log({ startDate, startTime, endDate, endTime });
    // pickers are already in UTC value, so normal combine
    const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(startDate, startTime, endDate, endTime, 'search-bar');

    const pickupTime = combinedPickup?.combinedDateTimeString;
    const returnTime = combinedReturn?.combinedDateTimeString;
    const minimumPickupTime = dayjs(getRoundUpStartTime(15)).second(0).millisecond(0); // set min pickup time
    const isPickupPast = dayjs(pickupTime).isBefore(minimumPickupTime, 'minute');

    if (isPickupPast) {
      openSnackBar({
        message: 'Ensure pickup time is set 15 minutes after the current time.',
        severity: 'error',
      });
    } else {
      setSelectedFilters([]);
      setSearchedCarList([]);
      // setAvailableCarList([]);
      const queryParams = buildQueryParams({
        lat: location?.coordinates[1]?.toString(),
        long: location?.coordinates[0]?.toString(),
        pickup: pickupTime,
        return: returnTime,
        postcode: location?.postalCode,
        city: location?.city,
        region: location?.stateShortCode,
        country: location?.countryShortCode,
        address: location?.street || searchParams?.address,
      });
      router.push(`/search?${queryParams}&source=searchBar`);
      //Commented the handover portion
      // router.push(
      //   `/search?lat=${location?.coordinates[1]}&long=${location?.coordinates[0]}&pickup=${pickupTime}&return=${returnTime}&address=${
      //     location?.street || searchParams?.address
      //   }&source=searchBar`
      // );
      // Commented the previous search with all values
      // router.push(
      //   `/search?country=${location?.countryShortCode}&region=${location?.stateShortCode}&postcode=${location?.postalCode}&city=${
      //     location?.city
      //   }&lat=${location?.coordinates[0]}&long=${location?.coordinates[1]}&pickup=${pickupTime}&return=${returnTime}&address=${
      //     location?.street || searchParams?.address
      //   }`
      // );
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // const latitude = -33.8688; //checking using aus lat
          // const longitude = 151.2093; //checking using aus long
          // console.log(latitude, longitude);
          const { combinedPickup, combinedReturn } = getCombinedPickReturnUtc(
            watch('startDate'),
            watch('startTime'),
            watch('endDate'),
            watch('endTime'),
            'search-bar'
          );
          const pickupTime = combinedPickup?.combinedDateTimeString;
          const returnTime = combinedReturn?.combinedDateTimeString;
          try {
            const apiResult = await fetchReverseGeocoding(latitude, longitude);
            // console.log('API Result', apiResult);
            const response = transformGeocodingResult(apiResult);
            // console.log('Response', response);
            if (response?.length === 0) {
              openSnackBar({
                message: 'The platform is only accessible in Australia.',
                severity: 'info',
                hideDuration: 3000,
              });
            } else {
              const location = response[0];
              //console.log('Current Location', location);
              const queryParams = buildQueryParams({
                lat: location?.coordinates?.[1].toString() || defaultCoordinate[1].toString(),
                long: location?.coordinates?.[0]?.toString() || defaultCoordinate[0].toString(),
                pickup: pickupTime,
                return: returnTime,
                postcode: location?.postcode?.text,
                city: location?.place?.text,
                region: location?.region?.short_code,
                country: location?.country?.short_code,
                address: location?.complete_address || searchParams?.address,
              });
              router.push(`/search?${queryParams}&source=currentAddress`);
              // console.log('Location', location);
              // router.push(
              //   `/search?lat=${location?.coordinates?.[1] || defaultCoordinates[1]}&long=${
              //     location?.coordinates?.[0] || defaultCoordinates[0]
              //   }&pickup=${pickupTime || searchParams?.pickup}&return=${returnTime || searchParams?.return}&address=${
              //     location?.address || searchParams?.address
              //   }&source=searchBar`
              // );
            }
          } catch (error) {
            console.error('Current Position Fetch Error:', error);
          }
        },
        // (error: any) => {
        //   console.log(error);
        //   console.error('Error getting user location:', error);
        // }
        (error: GeolocationPositionError) => {
          if (error.code === 1) {
            openSnackBar({
              message: 'Location access is required for this platform. Please enable location services in your browser settings.',
              severity: 'info',
              hideDuration: 3000,
            });
          } else {
            console.error('Error getting user location:', error);
            openSnackBar({
              message: 'Unable to retrieve location. Please try again later.',
              severity: 'error',
              hideDuration: 3000,
            });
          }
        }
      );
    } else {
      console.error('Geolocation is not supported or code is running on the server.');
    }
  };

  return (
    <CommonForm handleFunction={handleSubmit(onSearchVehicle)}>
      {isGuestRestrict(guestAccess) && <CommonAccStatusAlert isGuest={true} isRestrict={true} />}
      <div className="grid grid-cols-12 justify-start items-start mt-6 ">
        <div className="lg:col-span-5 col-span-12 mr-0 lg:mr-2">
          <Location {...commonProps}></Location>
        </div>

        <div className="lg:col-span-7 col-span-12 md:flex md:justify-between justify-center items-center gap-6">
          {/* <DateTimeSection {...commonProps}></DateTimeSection> */}
          {/* <CustomSearchDateTimePicker {...commonProps}></CustomSearchDateTimePicker> */}
          <CustomSearchDateTimePickerTz {...commonProps} showUtc={true}></CustomSearchDateTimePickerTz>
          <div className="flex md:justify-end justify-center items-center">
            <IconButton
              type="submit"
              className={`${
                !isGuestRestrict(guestAccess) ? 'search' : 'bg-accent'
              } font-bold rounded-md p-2  w-full lg:w-20 h-10 lg:h-14 my-2 md:my-0`}
              disabled={isGuestRestrict(guestAccess)}
            >
              <div className="flex flex-row  items-center justify-center">
                <BsSearch className="text-white  lg:w-20 w-10 text-lg md:text-3xl" />
                <Typography className="text-white p-0 m-0 text-base lg:hidden">Search</Typography>
              </div>
            </IconButton>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center lg:items-start lg:justify-start">
        <Button
          variant="outlined"
          size="small"
          onClick={getCurrentLocation}
          className="normal-case w-full lg:w-[250px] h-10  lg:h-8 "
          startIcon={<FaSearchLocation />}
        >
          Search with current location
        </Button>
      </div>
    </CommonForm>
  );
};

export default SearchBar;
