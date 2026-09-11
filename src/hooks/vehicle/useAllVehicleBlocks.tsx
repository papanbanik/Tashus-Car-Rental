'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllVehicleBlocks = async (hostId: string | undefined) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/block-dates/${hostId}`);
  // console.log('Travel Response', response);
  return response;
};

export const useAllVehicleBlocks = () => {
  // const params = useParams();
  // //   console.log(params);
  // const hostId = params['host-profile-id'];
  const { userId: hostId } = useParams<{ userId: string }>();
  const { setAllCalenderDetails } = useProfileInfoContext();
  return useQuery({
    queryKey: ['vehicle-block-details', { hostId }],
    queryFn: () => getAllVehicleBlocks(hostId),
    enabled: !!hostId,
    // enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data?.data?.data);
      setAllCalenderDetails(data?.data?.data);
    },
    onError: (err) => {
      console.log('useAllVehicleBlocks error', err);
      return err;
    },
  });
};
