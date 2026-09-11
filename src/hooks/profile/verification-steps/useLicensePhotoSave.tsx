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
  drivingLicensePhoto: TLicensePhoto;
  drivingLicensePhotoBackside: TLicensePhoto;
};

const saveLicensePhotoSave = async ({ userId, drivingLicensePhoto, drivingLicensePhotoBackside }: LicensePhoto) => {
  const response = await axiosClient.put(`${apiUrl}/v2/verification/license-photo/${userId}`, {
    drivingLicensePhoto,
    drivingLicensePhotoBackside,
  });
  return response;
};

export const useLicensePhotoSave = () => {
  const { openSnackBar } = useSnackBarContext();
  const { userProfileVerificationInfo, setUserProfileVerificationInfo } = useProfileInfoContext();
  return useMutation({
    mutationFn: ({ userId, drivingLicensePhoto, drivingLicensePhotoBackside }: LicensePhoto) =>
      saveLicensePhotoSave({ userId, drivingLicensePhoto, drivingLicensePhotoBackside }),
    onSuccess: (data, variables) => {
      const { drivingLicensePhoto, drivingLicensePhotoBackside } = variables;
      openSnackBar({
        message: data?.data?.message || 'License Photos Save Successfully',
        severity: 'success',
        hideDuration: 5000,
      });
      const updatedData = {
        ...userProfileVerificationInfo,
        guestVerification: {
          ...userProfileVerificationInfo?.guestVerification,
          drivingLicensePhoto: {
            ...drivingLicensePhoto,
            status: userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isDLPhotoIncorrect
              ? 'resubmitted'
              : 'pending',
          },
          drivingLicensePhotoBackside: {
            ...drivingLicensePhotoBackside,
            status: userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isDLBackPhotoIncorrect
              ? 'resubmitted'
              : 'pending',
          },
        },
      };
      setUserProfileVerificationInfo(updatedData);
    },
    onError: (err: any) => {
      console.log('useLicensePhoto mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving photo',
        severity: 'error',
      });
      return err;
    },
  });
};
