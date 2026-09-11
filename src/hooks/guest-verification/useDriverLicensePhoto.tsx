'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
type LicenseBackPhoto = {
  imageInfo?: any;
  storageProvider?: string;
};
type LicensePhoto = {
  userId: string;
  storageProvider: string;
  imageInfo: any;
  drivingLicensePhotoBackside?: LicenseBackPhoto;
  drivingLicensePhotoItemId?: string;
};

const saveDriverLicensePhoto = async ({
  userId,
  imageInfo,
  storageProvider,
  drivingLicensePhotoBackside,
  drivingLicensePhotoItemId,
}: LicensePhoto) => {
  // console.log(userId, imageInfo);
  const url = drivingLicensePhotoItemId
    ? `${apiUrl}/verify/driving-license-photo/${userId}/${drivingLicensePhotoItemId}`
    : `${apiUrl}/verify/driving-license-photo/${userId}`;
  // const response = await axiosClient.put(`${apiUrl}/verify/driving-license-photo/${userId}`, {
  const response = await axiosClient.put(url, {
    imageInfo,
    storageProvider,
    drivingLicensePhotoBackside,
  });
  return response;
};

export const useDriverLicensePhoto = () => {
  const { userProfileInfo, setUserProfileInfo, verificationFieldFlags } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, imageInfo, storageProvider, drivingLicensePhotoBackside, drivingLicensePhotoItemId }: LicensePhoto) =>
      saveDriverLicensePhoto({ userId, imageInfo, storageProvider, drivingLicensePhotoBackside, drivingLicensePhotoItemId }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(data?.data);
      // console.log(data?.data?.data[0]);
      // console.log(variables);
      const { imageInfo, drivingLicensePhotoBackside } = variables;
      // console.log(userProfileInfo);
      // console.log(imageInfo);
      // console.log(drivingLicensePhotoBackside);
      const updatedLicensePhoto = {
        valid: true,
        imageInfo,
        status: verificationFieldFlags?.isDLPhotoIncorrect ? 'resubmitted' : 'pending',
        _id: data?.data?.data[0]?.drivingLicensePhotoItemId,
        createdAt: data?.data?.data[0]?.createdAt,
      };
      const updatedBackLicensePhoto = {
        imageInfo: drivingLicensePhotoBackside?.imageInfo || {},
        status: verificationFieldFlags?.isDLBackPhotoIncorrect ? 'resubmitted' : 'pending',
      };
      // console.log(updatedLicensePhoto);
      const updatedGuestVerification = {
        ...userProfileInfo?.guestVerification,
        drivingLicensePhoto: updatedLicensePhoto,
        drivingLicensePhotoBackside: updatedBackLicensePhoto,
      };
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
      console.log('useLicensePhoto mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving photo',
        severity: 'error',
      });
      return err;
    },
  });
};
