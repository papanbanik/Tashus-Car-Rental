'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useGetNearbySearchedCars } from '@/hooks/car-search/useGetNearbySearchedCars';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { SearchParamsType } from '@/types/searchingTypes';
import { getDefaultEndTime, getDefaultStartTime } from '@/utils/Functions/dateTimeCommonFn';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ActiveOptions from '@/components/Search/Carfiltering/ActiveOptions';

import { useMaxWidth } from '@/components/Layouts/NavBar/MaxWidthProvider';
import {
  buildQueryParams,
  defaultCoordinate,
  filterByCarType,
  filterByPrice,
  filterBySeats,
  filterByTransmissionType,
} from '@/utils/Functions/searchCommonFn';

import CloseIcon from '@mui/icons-material/Close'; // Material-UI icon for closing the map
import FilterMenu from './SearchFilter/FilterMenu';

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { getInitialLocation } from '@/utils/Lists/initialLocations';

import { combineDateTimeUtc, getCombinedPickReturnUtc } from '@/utils/Functions/utcCommonFn';
import { FaMapMarkerAlt } from 'react-icons/fa';
import SearchBarSection from './SearchBarSection';

import { useSnackBarContext } from '@/context/SnackBarProvider';
import { CarSearchType } from '@/types/searchingTypes';

import { fetchReverseGeocoding, transformGeocodingResult } from '@/components/CarListing/CarLocation/map.common';
import { useForm } from 'react-hook-form';
import SearchedCarsUpdated from './SearchCarsUpdated/SearchedCarsUpdated';

const DynamicMap = dynamic(() => import('../SearchedMapView'), {
  ssr: false,
});

const SearchUpdated = () => {
  const { register, handleSubmit, control, formState, watch, setValue, reset, getValues, setError, clearErrors, trigger } = useForm<CarSearchType>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  useHealthCheck();
  const { data: dataList, refetch, isLoading, isFetching } = useGetNearbySearchedCars(); // Call API conditionally
  const pathName = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'));
  const [showMap, setShowMap] = useState<boolean>(!isMedium);
  const {
    searchParams,
    setSearchParams,
    setSearchValue,
    selectedSearchedLocation,
    setSelectedSearchedLocation,
    searchValue,
    searchedCarList,
    availableCarList,
    filteredCarList,
    selectedFilters,
    setFilteredCarList,
    setSelectedFilters,
    setAvailableCarList,
    setSearchedCarList,
  } = useSearchContext();

  const { setCarData } = useCarListingContext();

  useEffect(() => {
    setShowMap(!isMedium);
  }, [isMedium]);

  useEffect(() => {
    const vehicleType = params.get('vehicleType');
    setSelectedFilters(vehicleType ? [{ name: 'carType', options: [vehicleType] }] : []);
    setAvailableCarList([]);
    setFilteredCarList([]);
    setSearchedCarList([]);
    setCarData({} as CarDataState);
  }, []);

  useEffect(() => {
    const handleBack = (event: PopStateEvent) => {
      event.preventDefault(); // Prevent default back behavior
      router.push('/'); // Always go to home page
    };
    window.addEventListener('popstate', handleBack);
    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, [router]);

  useEffect(() => {
    const { place: iniCity, countryShortCode: iniCountry, stateShortCode: iniRegion, complete_address } = getInitialLocation()[0];
    const updatedSearchParams: SearchParamsType = {
      city: params.get('city') ?? iniCity ?? '',
      country: params.get('country') ?? iniCountry ?? '',
      postcode: params.get('postcode') || '',
      region: params.get('region') ?? iniRegion ?? '',
      lat: params.get('lat') ?? defaultCoordinate[1]?.toString() ?? '',
      long: params.get('long') ?? defaultCoordinate[0]?.toString() ?? '',
      pickup: params.get('pickup') || '',
      return: params.get('return') || '',
      address: params.get('address') ?? complete_address ?? '',
    };
    const { city, country, region, postcode, lat, long, address } = updatedSearchParams;
    const decodedAddress = decodeURIComponent(address);

    if (!params.has('pickup') && !params.has('return')) {
      const startDate = dayjs().toDate();
      const endDate = dayjs(startDate).add(3, 'day').toDate();
      const startTime = getDefaultStartTime()?.toDate();
      const endTime = getDefaultEndTime()?.toDate();

      const { combinedDateTimeString: pickupTime } = combineDateTimeUtc(startDate, startTime, 'search pick');
      const { combinedDateTimeString: returnTime } = combineDateTimeUtc(endDate, endTime, 'search ret');

      router.push(
        `${pathName}?country=${country}&region=${region}&postcode=${postcode}&city=${city}&lat=${lat}&long=${long}&pickup=${pickupTime}&return=${returnTime}&address=${decodedAddress}`
      );
      // const { city, region, country, pickupDate, pickTime, returnDate, retTime } = formatQueryParams(data, pickupTime, returnTime);
    }

    setSearchValue(decodedAddress);
    setSelectedSearchedLocation({
      id: undefined,
      country: country,
      region: region || '',
      place: '',
      city: city || '',
      address: '',
      postcode: postcode || '',
      complete_address: decodedAddress,
    });
    setSearchParams(updatedSearchParams);
  }, [params]);

  useEffect(() => {
    if (
      ((searchParams?.lat && searchParams?.long) ||
        (searchParams?.city && searchParams?.country) ||
        searchParams?.region ||
        searchParams?.postcode) &&
      searchParams?.pickup &&
      searchParams?.return
    ) {
      refetch();
    }
  }, [searchParams]);

  useEffect(() => {
    setMaxWidth('1600px');
  }, []);

  useEffect(() => {
    const isCarTypeApplied: any = selectedFilters.find((item) => item.name === 'carType');
    const isPriceApplied: any = selectedFilters.find((item) => item.name === 'price');
    const isTransmissionApplied: any = selectedFilters.find((item) => item.name === 'transmission');
    const isSeatApplied: any = selectedFilters.find((item) => item.name === 'seat');
    let tempFilteredList = [...availableCarList];

    if (selectedFilters?.length === 0) {
      setFilteredCarList(availableCarList);
      return;
    }

    if (isCarTypeApplied) {
      tempFilteredList = tempFilteredList.filter((car: any) => filterByCarType(car, isCarTypeApplied?.options));
    }

    if (isPriceApplied) {
      tempFilteredList = tempFilteredList.filter((car: any) =>
        filterByPrice(car, isPriceApplied?.options?.dayPriceRange, isPriceApplied?.options?.hourPriceRange)
      );
    }

    if (isTransmissionApplied) {
      tempFilteredList = tempFilteredList.filter((car: any) => filterByTransmissionType(car, isTransmissionApplied?.options));
    }

    if (isSeatApplied) {
      tempFilteredList = tempFilteredList.filter((car: any) => filterBySeats(car, isSeatApplied?.options));
    }

    setFilteredCarList(tempFilteredList);
  }, [selectedFilters, availableCarList, dataList]);

  const selectedData = filteredCarList?.map((item: any) => ({
    pickupAddress: item.location.pickupAddress,
    car: item.car,
    rates: item.rates,
    photos: {
      coverPhotoUrl: item.photos.coverPhoto.imageInfo.secure_url,
    },
    listingId: item?.listingId,
  }));

  const { setMaxWidth } = useMaxWidth();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMapView = () => {
    setIsExpanded(!isExpanded);
  };

  const [priceMode, setPriceMode] = useState<'Day' | 'Hour'>('Day');

  useEffect(() => {
    if (isMedium && showMap) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isMedium, showMap]);

  const { openSnackBar } = useSnackBarContext();
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
    <div className="min-h-screen ">
      <SearchBarSection getCurrentLocation={getCurrentLocation} />

      <div
        className="hidden lg:block w-full rounded-2xl transition-all duration-500 ease-in-out max-w-[1250px] mx-auto shadow-secondary overflow-hidden"
        style={{ height: isExpanded ? '60vh' : '90px' }}
      >
        <div className="relative w-full">
          {!isLoading && !isFetching ? (
            <div
              className={`w-full transition-all duration-300 ${isExpanded ? 'h-[60vh]' : 'h-[200px]'}`}
              style={{
                transform: isExpanded ? 'none' : 'translateY(-50%)', // Center the map when collapsed
              }}
            >
              <DynamicMap filteredCarList={selectedData} />
            </div>
          ) : (
            // Ensure Skeleton takes the full height of the map container
            <Skeleton variant="rounded" className={`w-full ${isExpanded ? 'h-[500px]' : 'h-[200px]'}`} />
          )}

          <button
            onClick={toggleMapView}
            className="absolute top-7 right-4 bg-primary text-white py-2 px-4 rounded-lg border-none shadow-lg hover:bg-primary focus:outline-none transition duration-300"
          >
            {isExpanded ? 'Close Map View' : 'Open Map View'}
          </button>
        </div>
      </div>

      {/* <div className="w-full h-52 my-6 max-h-24">
        <DynamicMap filteredCarList={selectedData} />
      </div> */}

      <div className="w-full lg:hidden items-center px-4 py-0 m-0 pb-2 ">
        <div className="w-full flex justify-between items-center px-0 py-0 m-0 leading-none">
          <p className="font-semibold m-0 p-0 leading-none">
            {' '}
            Total {filteredCarList.length} {filteredCarList.length === 1 ? 'Vehicle' : `Vehicles`} found
          </p>

          <div className="flex items-center gap-2 cursor-pointer leading-none" onClick={() => setIsFilterMenuOpen(true)}>
            <FilterAltIcon />
            <span className="text-sm m-0 p-0 leading-none">Open Filter</span>
          </div>
        </div>
      </div>

      {isFilterMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center m-0 p-0"
          onClick={() => setIsFilterMenuOpen(false)} // Close the filter menu on outside click
        >
          <div
            className="relative w-full md:w-[400px] p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing the menu when clicking inside
          >
            <FilterMenu availableCarList={availableCarList} priceMode={priceMode} setPriceMode={setPriceMode} />

            <div
              onClick={() => setIsFilterMenuOpen(false)}
              className="absolute bottom-[-8] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-red-700"
            >
              <CloseIcon />
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden ">
        {showMap && (
          <div className="w-full h-[60vh] mx-auto rounded-[16px] shadow-secondary overflow-hidden">
            {!isLoading && !isFetching ? (
              <div className="w-full h-full rounded-[16px]">
                <DynamicMap filteredCarList={selectedData} />
              </div>
            ) : (
              <Skeleton variant="rounded" className="h-full" />
            )}
          </div>
        )}
      </div>

      <div className="container lg:mx-auto pb-6 w-full flex flex-row gap-4 lg:mt-4 mt-0">
        <div className="lg:w-[32%] hidden lg:block">
          {selectedData ? (
            <FilterMenu availableCarList={availableCarList} priceMode={priceMode} setPriceMode={setPriceMode} />
          ) : (
            <Skeleton variant="rounded" className="h-full rounded-2xl" />
          )}
        </div>

        <div className="lg:w-[78%] w-[100%] ">
          <div className=" ml-2  lg:ml-0 mb-2 lg:mb-4 -mt-3 md:-mt-0">
            <ActiveOptions></ActiveOptions>
          </div>
          <div className="lg:flex justify-between items-center w-full mb-4 hidden ">
            <p className="font-semibold m-0 p-0 leading-none text-gray-600">
              Total {filteredCarList.length} {filteredCarList.length === 1 ? 'Vehicle' : `Vehicles`} found
            </p>
            <p className="text-primary cursor-pointer m-0 p-0 flex items-center" onClick={getCurrentLocation}>
              <FaMapMarkerAlt
                className="mr-1"
                style={{ fontSize: '1rem', height: '1rem', width: '1rem' }} // Adjust size to match text
              />
              Search with current location
            </p>
          </div>
          <SearchedCarsUpdated
            priceMode={priceMode}
            showMap={showMap}
            searchedCarList={filteredCarList}
            isLoading={isLoading || isFetching}
          ></SearchedCarsUpdated>
        </div>
        {/* <div className="w-full lg:hidden block">
          <VehicleCardMobile />
        </div> */}
      </div>

      {isMedium && !isFilterMenuOpen && (
        <div
          onClick={() => setShowMap(!showMap)}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#5C8D07]"
        >
          {showMap ? <CloseIcon fontSize="large" /> : <FaMapMarkerAlt className="text-3xl" />}
        </div>
      )}
    </div>
  );
};

export default SearchUpdated;
