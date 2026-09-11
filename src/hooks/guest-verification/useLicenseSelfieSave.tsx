'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type LicenseSelfieSave = {
  userId: string;
  storageProvider: string;
  imageInfo: any;
  drivingLicenseFaceItemId?: string;
};

const saveLicenseSelfie = async ({ userId, imageInfo, storageProvider, drivingLicenseFaceItemId }: LicenseSelfieSave) => {
  // console.log(userId, imageInfo);
  const url = drivingLicenseFaceItemId
    ? `${apiUrl}/verify/driving-license-face/${userId}/${drivingLicenseFaceItemId}`
    : `${apiUrl}/verify/driving-license-face/${userId}`;
  const response = await axiosClient.put(url, {
    drivingLicenseWithFace: {
      valid: true,
      imageInfo,
      storageProvider,
    },
  });
  return response;
};

export const useLicenseSelfieSave = () => {
  const { userProfileInfo, setUserProfileInfo, verificationFieldFlags } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, imageInfo, storageProvider, drivingLicenseFaceItemId }: LicenseSelfieSave) =>
      saveLicenseSelfie({ userId, imageInfo, storageProvider, drivingLicenseFaceItemId }),
    onSuccess: (data, variables) => {
      // console.log(data);

      const { imageInfo } = variables;
      console.log(imageInfo);
      const updatedLicenseSelfie = {
        valid: true,
        imageInfo,
        status: verificationFieldFlags?.isDLSelfieIncorrect ? 'resubmitted' : 'pending',
        _id: data?.data?.data[0]?.drivingLicenseFaceItemId,
        createdAt: data?.data?.data[0]?.createdAt,
      };
      const updatedGuestVerification = { ...userProfileInfo?.guestVerification, drivingLicenseWithFace: updatedLicenseSelfie };
      const updatedUserProfile = { ...userProfileInfo, guestVerification: updatedGuestVerification };

      setUserProfileInfo(updatedUserProfile);
      openSnackBar({
        message: data?.data?.message,
        severity: 'success',
        hideDuration: 5000,
      });
      closeModal();
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
