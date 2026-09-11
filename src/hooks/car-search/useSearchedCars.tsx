'use client';

import { useSearchContext } from '@/context/SearchProvider';
import { currentDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { getPickerTimeStringInUtc } from '@/utils/Functions/utcCommonFn';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type AllSearchedCarsType = {
  city: string;
  country: string;
  postcode: string;
  region: string;
  lat?: string;
  long?: string;
  from?: string;
  to?: string;
  currentDateTime?: string;
};

const getAllSearchedCars = async ({ city, region, country, postcode, lat, long, from, to }: AllSearchedCarsType) => {
  // const response = await axios.get(`${apiUrl}/other/car-dummy-data`); //all dummy cars
  const response = await axios.get(`${apiUrl}/search/find-cars`, {
    params: {
      city,
      country,
      postcode,
      region,
      lat,
      long,
      from,
      to,
      currentDateTime,
    },
  });
  // console.log(response);
  return response;
};

export const useSearchedCars = () => {
  const { setSearchedCarList, setFilteredCarList, setAvailableCarList, searchParams } = useSearchContext();
  const { city, country, region, lat, long, postcode, pickup, return: to } = searchParams;
  const { formattedTimeString } = getPickerTimeStringInUtc(dayjs());
  return useQuery({
    queryKey: ['searched-car-lists'],
    queryFn: () => getAllSearchedCars({ city, country, region, postcode, from: pickup, to, currentDateTime: formattedTimeString }),
    // queryFn: () => getAllSearchedCars({ city, country, region, lat: long, long: lat, postcode, from: pickup, to }),
    enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data?.data?.results);

      setSearchedCarList(data?.data?.results);
      setFilteredCarList(data?.data?.results);
      setAvailableCarList(data?.data?.results);

      // For Dummy API
      // console.log(data?.data?.data?.allCarList);
      // setSearchedCarList(data?.data?.data?.allCarList);
      // setFilteredCarList(data?.data?.data?.allCarList);
      //
      return data;
    },
    onError: (err) => {
      console.log('useSearchedCars error', err);
      return err;
    },
  });
};
