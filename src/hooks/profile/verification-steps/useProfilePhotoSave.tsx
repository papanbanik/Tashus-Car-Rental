'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useMutation } from '@tanstack/react-query';

const apiUrl = environment?.API_URL || '';

type ProfilePhotoSave = {
  userId: string;
  profilePhoto: {
    storageProvider: string;
    imageInfo: any;
  };
};

const saveProfilePhoto = async ({ userId, profilePhoto }: ProfilePhotoSave) => {
  const response = await axiosClient.put(`${apiUrl}/v2/verification/profile-photo/${userId}`, {
    profilePhoto,
  });
  return response;
};

export const useProfilePhotoSave = () => {
  const { userProfileInfo, setUserProfileInfo } = useUserCredContext();
  const { profileGeneralInfo, setProfileGeneralInfo, userProfileVerificationInfo, setUserProfileVerificationInfo } = useProfileInfoContext();
  const { setVerificationAlertMessage } = useSearchContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ userId, profilePhoto }: ProfilePhotoSave) => saveProfilePhoto({ userId, profilePhoto }),
    onSuccess: (data) => {
      const updatedUserProfileVerification = {
        ...userProfileVerificationInfo,
        profileInfo: {
          ...userProfileVerificationInfo?.profileInfo,
          picture: data?.data?.responseObject,
        },
      };
      setUserProfileVerificationInfo(updatedUserProfileVerification);
      const updatedPicture = {
        imageInfo: data?.data?.responseObject?.imageInfo ?? {},
        storageProvider: data?.data?.responseObject?.storageProvider ?? '',
        status: data?.data?.responseObject?.status ?? 'pending',
      };
      const updatedUserProfile = { ...userProfileInfo, picture: updatedPicture };
      const updatedProfileGeneral = { ...profileGeneralInfo, picture: updatedPicture };
      setUserProfileInfo(updatedUserProfile);
      setProfileGeneralInfo(updatedProfileGeneral);
      openSnackBar({
        message: data?.data?.message || 'Profile Picture Saved Successfully',
        severity: 'success',
        hideDuration: 3000,
      });
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
