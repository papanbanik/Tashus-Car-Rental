'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getGuestLicenseInfoForPartner = async (reservationId: number) => {
  const response = await axiosClient.get(`${apiUrl}/reservation/travel-license-info/${reservationId}`);
  return response;
};

export const useGetGuestLicenseInfoForPartner = () => {
  const { travelDetails } = useProfileInfoContext();
  const { setVerifyGuestInfoByPartner, verifyGuestInfoByPartner } = useTravelContext();

  return useQuery({
    queryKey: ['get-guest-license-info', { reservationId: Number(travelDetails?.reservationId) }],
    queryFn: () => getGuestLicenseInfoForPartner(Number(travelDetails?.reservationId)),
    enabled: !!travelDetails?.reservationId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // console.log(data);
      // console.log(data?.data?.data);
      const { drivingLicenseInfo, drivingLicenseWithFace, guestLicenseVerificationConfirmation } = data?.data?.data[0];
      setVerifyGuestInfoByPartner({ drivingLicenseInfo, drivingLicenseWithFace, guestLicenseVerificationConfirmation });
    },
    onError: (err) => {
      console.log('useGetGuestLicenseInfoForPartner error', err);
      return err;
    },
  });
};
