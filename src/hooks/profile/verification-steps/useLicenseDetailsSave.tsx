'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TDrivingLicenseInfo } from '@/types/user-verification/userVerificationTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useMutation } from '@tanstack/react-query';

const apiUrl = environment?.API_URL || '';

type DriverLicenseSave = {
  userId: string;
  drivingLicenseInfo: TDrivingLicenseInfo;
  gender?: string;
  dateOfBirth?: Date | null;
};

const saveLicenseDetails = async ({ userId, drivingLicenseInfo, gender, dateOfBirth }: DriverLicenseSave) => {
  const response = await axiosClient.put(`${apiUrl}/v2/verification/license-details/${userId}`, {
    drivingLicenseInfo,
    gender,
    dateOfBirth,
  });
  return response;
};

export const useLicenseDetailsSave = () => {
  const { userProfileVerificationInfo, setUserProfileVerificationInfo } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, drivingLicenseInfo, gender, dateOfBirth }: DriverLicenseSave) =>
      saveLicenseDetails({ userId, drivingLicenseInfo, gender, dateOfBirth }),
    onSuccess: (data, variables) => {
      const { drivingLicenseInfo, dateOfBirth, gender } = variables;
      const updatedData = {
        ...userProfileVerificationInfo,
        profileInfo: {
          ...userProfileVerificationInfo?.profileInfo,
          dateOfBirth: dateOfBirth ?? null,
          gender: gender ?? '',
        },
        guestVerification: {
          ...userProfileVerificationInfo?.guestVerification,
          drivingLicenseInfo: {
            ...drivingLicenseInfo,
            status: userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isDLInfoIncorrect
              ? 'resubmitted'
              : 'pending',
          },
        },
      };
      setUserProfileVerificationInfo(updatedData);
      openSnackBar({
        message: data?.data?.message || 'License Details Save Successfully',
        severity: 'success',
        hideDuration: 5000,
      });
    },
    onError: (err: any) => {
      console.log('useDriverLicenseSave mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving photo',
        severity: 'error',
      });
      return err;
    },
  });
};
