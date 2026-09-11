'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useMutation } from '@tanstack/react-query';
const apiUrl = environment?.API_URL || '';
type TLicensePhoto = {
  imageInfo?: any;
  storageProvider?: string;
};
type LicensePhoto = {
  userId: string;
  drivingLicenseWithFace: TLicensePhoto;
};
const saveLicenseSelfie = async ({ userId, drivingLicenseWithFace }: LicensePhoto) => {
  const response = await axiosClient.put(`${apiUrl}/v2/verification/license-photo-selfie/${userId}`, {
    drivingLicenseWithFace,
  });
  return response;
};

export const useLicenseSelfieSave = () => {
  const { userProfileVerificationInfo, setUserProfileVerificationInfo } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, drivingLicenseWithFace }: LicensePhoto) => saveLicenseSelfie({ userId, drivingLicenseWithFace }),
    onSuccess: (data, variables) => {
      const { drivingLicenseWithFace } = variables;
      openSnackBar({
        message: data?.data?.message || 'License Selfie Save Successfully',
        severity: 'success',
        hideDuration: 5000,
      });
      const updatedData = {
        ...userProfileVerificationInfo,
        guestVerification: {
          ...userProfileVerificationInfo?.guestVerification,
          drivingLicenseWithFace: {
            ...drivingLicenseWithFace,
            status: userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isDLSelfieIncorrect
              ? 'resubmitted'
              : 'pending',
          },
        },
      };
      setUserProfileVerificationInfo(updatedData);
    },
    onError: (err: any) => {
      console.log('useLicenseSelfieSave mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving photo',
        severity: 'error',
      });
      return err;
    },
  });
};
