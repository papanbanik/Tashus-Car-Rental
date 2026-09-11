'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type AllSearchedCarsType = {
  city?: string;
  country?: string;
  //postcode?: string;
  postalCode?: string;
  region?: string;
  lat?: string;
  long?: string;
  from?: string;
  to?: string;
};

const getNearbySearchedCars = async (params: AllSearchedCarsType) => {
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  const response = await axios.get(`${apiUrl}/search/nearby-cars`, {
    params: filteredParams,
  });
  return response;
};

export const useGetNearbySearchedCars = () => {
  // const sParams = useSearchParams();
  const { setSearchedCarList, setFilteredCarList, setAvailableCarList, selectedFilters, searchParams } = useSearchContext();
  const { city, country, region, lat, long, postcode: postalCode, pickup: from, return: to } = searchParams;
  // const finalParams = sParams?.get('source') === 'searchBar' ? { lat, long, from: pickup, to } : { city, country, from: pickup, to, lat, long };
  const { formattedTimeString } = getPickerTimeStringInUtc(dayjs());
  const finalParams = { city, country, postalCode, region, lat, long, from, to, currentDateTime: formattedTimeString };
  return useQuery({
    queryKey: ['nearby-searched-cars'],
    queryFn: () => getNearbySearchedCars(finalParams),
    enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setSearchedCarList(data?.data?.results);
      if (!selectedFilters.some((item) => item.name === 'carType')) {
        setFilteredCarList(data?.data?.results);
      }
      setAvailableCarList(data?.data?.results);
      return data;
    },
    onError: (err) => {
      console.log('useGetNearbySearchedCars error', err);
      return err;
    },
  });
};
