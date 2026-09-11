'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getGuestLicenseInfo = async (guestId: string) => {
  const response = await axiosClient.get(`${apiUrl}/verify/guest-license-info/${guestId}`);
  return response;
};

export const useGetGuestLicenseInfo = () => {
  const { travelDetails } = useProfileInfoContext();
  const { setVerifyGuestInfoByPartner, verifyGuestInfoByPartner } = useTravelContext();

  return useQuery({
    queryKey: ['get-guest-license-info', { guestId: travelDetails?.guestId }],
    queryFn: () => getGuestLicenseInfo(travelDetails?.guestId),
    enabled: !!travelDetails?.guestId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data?.data);
      const { drivingLicenseInfo, drivingLicenseWithFace } = data?.data?.data[0];
      setVerifyGuestInfoByPartner({ drivingLicenseInfo, drivingLicenseWithFace });
    },
    onError: (err) => {
      console.log('useGetGuestLicenseInfo error', err);
      return err;
    },
  });
};
