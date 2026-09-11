'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getEachVehicleBlocks = async (hostId: string | undefined, listingId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/block-dates/${hostId}/${listingId}`);
  // console.log('Travel Response', response);
  return response;
};

export const useEachVehicleBlocks = () => {
  // const params = useParams();
  // //   console.log(params);
  // const hostId = params['host-profile-id'];
  // const listingId = params['vehicle-id'];
  const { userId: hostId, vehicleId: listingId } = useParams<{ userId: string; vehicleId: string }>();
  const { eachCalenderDetails, setEachCalenderDetails } = useProfileInfoContext();
  if (!Array.isArray(eachCalenderDetails)) {
    setEachCalenderDetails([]);
  }
  return useQuery({
    queryKey: ['vehicle-block-details', { hostId, listingId }],
    queryFn: () => getEachVehicleBlocks(hostId, listingId),
    enabled: !!hostId,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data);
      // console.log(data?.data?.data?.blockedDates);
      const blockedDates = data?.data?.data?.blockedDates;
      // console.log(blockedDates);
      setEachCalenderDetails(blockedDates);
      // console.log(eachCalenderDetails);
    },
    onError: (err) => {
      console.log('useEachVehicleBlocks error', err);
      return err;
    },
  });
};
