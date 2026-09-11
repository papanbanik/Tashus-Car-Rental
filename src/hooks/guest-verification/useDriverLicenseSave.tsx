'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TDrivingLicenseInfo, useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type DriverLicenseSave = {
  userId: string;
  drivingLicenseInfo: TDrivingLicenseInfo;
  drivingLicenseInfoItemId?: string;
};

const saveDriverLicense = async ({ userId, drivingLicenseInfo, drivingLicenseInfoItemId }: DriverLicenseSave) => {
  // console.log(userId, drivingLicenseInfo);
  const url = drivingLicenseInfoItemId
    ? `${apiUrl}/verify/driving-license/${userId}/${drivingLicenseInfoItemId}`
    : `${apiUrl}/verify/driving-license/${userId}`;
  const response = await axiosClient.put(url, {
    drivingLicenseInfo,
  });
  return response;
};

export const useDriverLicenseSave = () => {
  const { userProfileInfo, setUserProfileInfo, verificationFieldFlags } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, drivingLicenseInfo, drivingLicenseInfoItemId }: DriverLicenseSave) =>
      saveDriverLicense({ userId, drivingLicenseInfo, drivingLicenseInfoItemId }),
    onSuccess: (data, variables) => {
      // console.log(data);
      const { drivingLicenseInfo } = variables;
      // console.log(drivingLicenseInfo);
      // console.log(userProfileInfo);
      const drivingLicenseInfoWithStatus = {
        ...drivingLicenseInfo,
        status: verificationFieldFlags?.isDLInfoIncorrect ? 'resubmitted' : 'pending',
        _id: data?.data?.data[0]?.drivingLicenseInfoItemId,
        createdAt: data?.data?.data[0]?.createdAt,
      };
      const updatedGuestVerification = { ...userProfileInfo?.guestVerification, drivingLicenseInfo: drivingLicenseInfoWithStatus };
      let updatedUserProfile = { ...userProfileInfo, guestVerification: updatedGuestVerification };

      if (drivingLicenseInfo?.dateOfBirth) {
        updatedUserProfile.dateOfBirth = drivingLicenseInfo?.dateOfBirth;
      }
      if (drivingLicenseInfo?.gender) {
        updatedUserProfile.gender = drivingLicenseInfo?.gender;
      }

      // console.log(updatedUserProfile);

      setUserProfileInfo(updatedUserProfile);
      openSnackBar({
        message: data?.data?.message,
        severity: 'success',
        hideDuration: 5000,
      });
      closeModal();
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
