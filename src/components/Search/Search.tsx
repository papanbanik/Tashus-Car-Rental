'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useGetNearbySearchedCars } from '@/hooks/car-search/useGetNearbySearchedCars';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { CarDataState } from '@/types/car-listing/carListingTypes';
import { SearchParamsType } from '@/types/searchingTypes';
import { combineDateTime, getDefaultEndTime, getDefaultStartTime } from '@/utils/Functions/dateTimeCommonFn';
import { FormControlLabel, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { filterByCarType, filterByPrice, filterBySeats, filterByTransmissionType } from '../../utils/Functions/searchCommonFn';
import { LargeIOSSwitch } from '../Common/HookFormFields/IosSwitch';
import { useMaxWidth } from '../Layouts/NavBar/MaxWidthProvider';
import ActiveOptions from './Carfiltering/ActiveOptions';
import FilterBar from './Carfiltering/FilterBar';
import SearchBar from './SearchBar';
import SearchedCars from './SearchedCars';

const DynamicMap = dynamic(() => import('./SearchedMapView'), {
  ssr: false,
});

const Search = () => {
  useHealthCheck();
  // const { data: dataList, refetch, isLoading, isFetching } = useSearchedCars(); // Call API conditionally
  const { data: dataList, refetch, isLoading, isFetching } = useGetNearbySearchedCars(); // Call API conditionally
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
    if (!searchValue) {
      // console.log(getInitialLocation()[0]);
      // const { complete_address, country, region, place, postcode, id, address, coordinates, city } = getInitialLocation()[0];
      // setSearchValue(complete_address || '');
      // setSelectedSearchedLocation({
      //   id: id,
      //   country: country,
      //   region: region,
      //   place: place,
      //   city: city,
      //   address: address,
      //   postcode: postcode,
      //   complete_address: complete_address,
      // });
    }
    setSelectedFilters([]);
    setAvailableCarList([]);
    setFilteredCarList([]);
    setSearchedCarList([]);
    setCarData({} as CarDataState);
  }, []);
  // Set search params in context
  useEffect(() => {
    // console.log('URL Search Params:');
    // params.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    // console.log('Context Search Params:');
    // Object.entries(searchParams).forEach(([key, value]) => {
    //   console.log(`${key}: ${value}`);
    // });
    const updatedSearchParams: SearchParamsType = {
      city: params.get('city') || '',
      country: params.get('country') || '',
      postcode: params.get('postcode') || '',
      region: params.get('region') || '',
      lat: params.get('lat') || '',
      long: params.get('long') || '',
      pickup: params.get('pickup') || '',
      return: params.get('return') || '',
      address: params.get('address') || '',
    };
    //Commented the handover portion
    // const updatedSearchParams: SearchParamsType = { ...searchParams };
    // console.log(params);
    // // @ts-ignore
    // for (const [key, value] of params.entries()) {
    //   if (updatedSearchParams.hasOwnProperty(key)) {
    //     updatedSearchParams[key as keyof SearchParamsType] = value;
    //   }
    // }

    const { city, country, region, postcode, lat, long, address } = updatedSearchParams;
    const decodedAddress = decodeURIComponent(address);

    // if time is not in params, add it
    if (!params.has('pickup') && !params.has('return')) {
      // console.log('time');
      const startDate = dayjs().add(1, 'day').toDate();
      const endDate = dayjs().add(3, 'day').toDate();
      const startTime = getDefaultStartTime()?.toDate();
      const endTime = getDefaultEndTime()?.toDate();

      const pickupTime = combineDateTime(startDate, startTime, 'search pick');
      const returnTime = combineDateTime(endDate, endTime, 'search ret');

      const carType = params.get('carType');
      const source = params.get('source');

      const extraParams = [carType ? `carType=${encodeURIComponent(carType)}` : '', source ? `source=${encodeURIComponent(source)}` : '']
        .filter(Boolean)
        .join('&');

      router.push(
        `/search?country=${country}&region=${region}&postcode=${postcode}&city=${city}&lat=${lat}&long=${long}&pickup=${pickupTime}&return=${returnTime}&address=${decodedAddress}${
          extraParams ? `&${extraParams}` : ''
        }`
      );
    }

    // set search text off search bar whenever page reloads
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
    // console.log(updatedSearchParams);
    setSearchParams(updatedSearchParams);
  }, [params]);

  useEffect(() => {
    const carTypeFromUrl = params.get('carType');
    if (carTypeFromUrl) {
      setSelectedFilters((prev) => {
        const withoutCarType = prev.filter((item) => item.name !== 'carType');
        return [...withoutCarType, { name: 'carType', options: [carTypeFromUrl] }];
      });
    }
  }, []);

  // Call search API when search params changes
  useEffect(() => {
    if (
      // (searchParams?.country || searchParams?.region || searchParams?.city || searchParams?.address) &&
      ((searchParams?.lat && searchParams?.long) ||
        (searchParams?.city && searchParams?.country) ||
        searchParams?.region ||
        searchParams?.postcode) &&
      searchParams?.pickup &&
      searchParams?.return
    ) {
      refetch();
    }

    // if (params?.get('source') === 'footer') {
    //   const country = searchParams?.country === 'au' ? `, Australia` : '';
    //   const tempRegion = stateList?.find((state: any) => searchParams?.region?.includes(state?.value))?.label;
    //   const region = tempRegion ? `, ${tempRegion}` : '';
    //   const comAddress = searchParams?.city + region + country;
    //   getManualSearchResult(comAddress);

    // }
  }, [searchParams]);

  useEffect(() => {
    setMaxWidth('1600px');
  }, []);

  useEffect(() => {
    // console.log(selectedFilters);
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
      // console.log(tempFilteredList);
    }

    if (isPriceApplied) {
      tempFilteredList = tempFilteredList.filter((car: any) =>
        filterByPrice(car, isPriceApplied?.options?.dayPriceRange, isPriceApplied?.options?.hourPriceRange)
      );
      // console.log(tempFilteredList);
    }

    if (isTransmissionApplied) {
      tempFilteredList = tempFilteredList.filter((car: any) => filterByTransmissionType(car, isTransmissionApplied?.options));
      // console.log(tempFilteredList);
    }

    if (isSeatApplied) {
      tempFilteredList = tempFilteredList.filter((car: any) => filterBySeats(car, isSeatApplied?.options));
      // console.log(tempFilteredList);
    }

    setFilteredCarList(tempFilteredList);
  }, [selectedFilters, availableCarList]);

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

  // Example of updating the maximum width
  console.log('available', availableCarList);
  console.log('filter', filteredCarList);
  console.log('selected', selectedFilters);

  return (
    <div className="md:px-20 lg:px-24 px-2 mb-24 relative">
      <SearchBar></SearchBar>
      <FilterBar showMap={showMap} setShowMap={setShowMap}></FilterBar>
      <ActiveOptions></ActiveOptions>

      {!isLoading && !isFetching && (
        <div className="w-full flex justify-between items-center">
          <p className="font-semibold">
            {filteredCarList?.length} {`Vehicle${filteredCarList?.length > 1 ? 's' : ''} Found`}
          </p>
          <FormControlLabel
            control={<LargeIOSSwitch sx={{ m: 1 }} checked={showMap} onChange={() => setShowMap(!showMap)} color="success" />}
            defaultChecked={!isMedium}
            label={`${showMap ? 'Hide Map' : 'Show Map'}`}
            labelPlacement="start"
          />
        </div>
      )}
      <div className={`w-full lg:flex lg:gap-4`}>
        <div hidden={!showMap} className={`lg:w-1/2 w-full text-center order-last lg:sticky lg:top-24 h-[60vh] lg:mb-0 mb-4`}>
          {!isLoading && !isFetching ? <DynamicMap filteredCarList={selectedData} /> : <Skeleton variant="rounded" className="h-[60vh]" />}
        </div>
        <div className={`${showMap ? 'lg:w-1/2 w-full ' : 'w-full'}`}>
          <SearchedCars showMap={showMap} searchedCarList={filteredCarList} isLoading={isLoading || isFetching}></SearchedCars>
        </div>
      </div>
    </div>
  );
};

export default Search;
