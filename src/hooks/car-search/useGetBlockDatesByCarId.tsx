'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { TCarBlockDate } from '@/types/car-search/availabilityValidationTypes';
import { isEndOfDayUtc, isStartOfDayUtc } from '@/utils/Functions/utcCommonFn';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getBlockDatesByCarId = async (carListingId: number) => {
  // console.log(carListingId);
  const response = await axios.get(`${apiUrl}/reservation/block-dates-by-car/${carListingId}`);
  return response;
};

export const useGetBlockDatesByCarId = () => {
  // const params = useParams();
  // const carListingId = parseInt(params['vehicle-id']);
  const { vehicleId: carListingId } = useParams<{ vehicleId: string }>();
  const { listingId } = useCarListingContext();
  const { setSingleCarBlockDates, singleCarBlockDates } = useSearchContext();

  return useQuery({
    queryKey: ['single-car-all-block-dates', { carListingId }],
    queryFn: () => getBlockDatesByCarId(parseInt(carListingId) || parseInt(listingId)),
    enabled: !!carListingId || !!listingId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data?.data?.data);
      const blockDates: TCarBlockDate[] = data?.data?.data;
      let allDayList: TCarBlockDate[] = [];
      let customList: TCarBlockDate[] = [];
      if (blockDates?.length > 0) {
        blockDates?.map((blockDate: TCarBlockDate) => {
          // console.log(blockDate?.start, blockDate?.end, isStartOfDay(blockDate?.start), isEndOfDay(blockDate?.end));
          if (isStartOfDayUtc(blockDate?.start) && isEndOfDayUtc(blockDate?.end)) {
            allDayList.push(blockDate);
          } else {
            customList.push(blockDate);
          }
        });
      }

      // console.log(data?.data);
      setSingleCarBlockDates({ allDayList, customList });
      return data?.data?.data;
    },
    onError: (err) => {
      console.log('useGetBlockDatesByCarId error', err);
      return err;
    },
  });
};
