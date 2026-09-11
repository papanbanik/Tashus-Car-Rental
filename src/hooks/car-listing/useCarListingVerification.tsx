'use client';

import { useCarListingContext } from '@/context/CarListingProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TLicenseVerifiedData } from '@/types/car-listing/carListingTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const carListingVerification = async (licensePlate: any) => {
  // console.log(licensePlate);
  const response = await axiosClient.get(`${apiUrl}/listing/license-plate`, {
    params: {
      regNo: licensePlate?.number,
      state: licensePlate?.state,
    },
  });
  return response;
};

export const useCarListingVerification = (licensePlate: any) => {
  const { setLicenseVerifiedData, verifyCar, setVerifyCar, setIsCarLicenseVerified, setListingErrorMessage, setListingSuccessMessage } =
    useCarListingContext();
  const { openSnackBar } = useSnackBarContext();
  return useQuery({
    queryKey: ['car-list-verify', licensePlate],
    queryFn: () => carListingVerification(licensePlate),
    enabled: verifyCar,
    onSuccess: (data) => {
      // console.log(data?.data?.data);
      const {
        extended,
        CarMake: { CurrentTextValue: carMake },
        CarModel,
        Colour,
        VechileIdentificationNumber,
        RegistrationYear,
        Expiry,
      } = data?.data?.data;
      const verifiedData: TLicenseVerifiedData = {
        make: carMake,
        model: CarModel?.CurrentTextValue || extended?.model,
        vin: VechileIdentificationNumber || '',
        year: RegistrationYear,
        color: Colour,
        expiry: Expiry ? dayjs(Expiry).toDate() : null,
      };

      // console.log(verifiedData?.expiry, Expiry);
      setLicenseVerifiedData(verifiedData);
      setVerifyCar(false);
      setIsCarLicenseVerified(true);
      openSnackBar({
        message: 'License Verified Successfully',
        severity: 'success',
        hideDuration: 5000,
      });

      // set this to {} after saving into db
      // console.log(
      //   carMake,
      //   ', ',
      //   model,
      //   ', ',
      //   series,
      //   ', ',
      //   transmissionType,
      //   ', ',
      //   variant,
      //   ', ',
      //   RegistrationYear,
      //   ', ',
      //   VechileIdentificationNumber,
      //   ', ',
      //   Colour
      // );
    },
    onError: (err: any) => {
      console.log(err);
      setVerifyCar(false);
      openSnackBar({
        message: err?.response?.data?.message || 'Error Verifying Data',
        severity: 'error',
      });
    },
  });
};
