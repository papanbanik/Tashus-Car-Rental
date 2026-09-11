'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type ProfilePhotoSave = {
  userId: string;
  storageProvider: string;
  imageInfo: any;
};

const saveProfilePhoto = async ({ userId, imageInfo, storageProvider }: ProfilePhotoSave) => {
  const response = await axiosClient.put(`${apiUrl}/verify/profile-photo/${userId}`, {
    imageInfo,
    storageProvider,
  });
  return response;
};

export const useProfilePhotoSave = () => {
  const { userProfileInfo, setUserProfileInfo, verificationFieldFlags } = useUserCredContext();
  const { profileGeneralInfo, setProfileGeneralInfo } = useProfileInfoContext();
  const { setVerificationAlertMessage } = useSearchContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ userId, imageInfo, storageProvider }: ProfilePhotoSave) => saveProfilePhoto({ userId, imageInfo, storageProvider }),
    onSuccess: (data, variables) => {
      // console.log(data);
      // console.log(variables);
      const { imageInfo, storageProvider } = variables;
      const status = verificationFieldFlags?.isProfileIncorrect ? 'resubmitted' : 'pending';
      // console.log(imageInfo);
      const updatedPicture = {
        imageInfo,
        storageProvider,
        status,
      };
      const updatedUserProfile = { ...userProfileInfo, picture: updatedPicture };
      const updatedProfileGeneral = { ...profileGeneralInfo, picture: updatedPicture };
      setUserProfileInfo(updatedUserProfile);
      setProfileGeneralInfo(updatedProfileGeneral);
      setVerificationAlertMessage({ messageType: 'success', message: data?.data?.message });
      openSnackBar({
        message: data?.data?.message || 'Profile Picture Saved Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
      closeModal();
    },
    onError: (err: any) => {
      console.log('useProfilePhotoSave mutation error', err);
      const errorText = err?.response?.status === 401 ? err?.response?.statusText : err?.response?.data?.messages;
      setVerificationAlertMessage({ messageType: 'error', message: errorText });
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving photo',
        severity: 'error',
        hideDuration: 5000,
      });
      return err;
    },
  });
};
