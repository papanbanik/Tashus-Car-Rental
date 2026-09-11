'use client';

import { useModalContext } from '@/context/ModalProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TSecondaryIDInfo, useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type SecondaryIDSave = {
  userId: string;
  secondaryIdInfo: TSecondaryIDInfo;
  secondaryIdItemId?: string;
};

const saveSecondaryID = async ({ userId, secondaryIdInfo, secondaryIdItemId }: SecondaryIDSave) => {
  const url = secondaryIdItemId
    ? `${apiUrl}/verify/guest-secondary-id/${userId}/${secondaryIdItemId}`
    : `${apiUrl}/verify/guest-secondary-id/${userId}`;
  const response = await axiosClient.put(url, {
    secondaryIdInfo,
  });
  return response;
};

export const useSecondaryIDSave = () => {
  const { userProfileInfo, setUserProfileInfo, verificationFieldFlags } = useUserCredContext();
  const { closeModal } = useModalContext();
  const { openSnackBar } = useSnackBarContext();

  return useMutation({
    mutationFn: ({ userId, secondaryIdInfo, secondaryIdItemId }: SecondaryIDSave) => saveSecondaryID({ userId, secondaryIdInfo, secondaryIdItemId }),
    onSuccess: (data, variables) => {
      // console.log(data);
      const { secondaryIdInfo } = variables;
      // console.log(secondaryIdInfo);
      // console.log(userProfileInfo);
      const secondaryIdInfoWithStatus = {
        ...secondaryIdInfo,
        status: verificationFieldFlags?.isSecondaryIdIncorrect || verificationFieldFlags?.isSecondaryIdPhotoIncorrect ? 'resubmitted' : 'pending',
        _id: data?.data?.data[0]?.secondaryIdItemId,
        createdAt: data?.data?.data[0]?.createdAt,
      };
      const updatedGuestVerification = { ...userProfileInfo?.guestVerification, secondaryIdInfo: secondaryIdInfoWithStatus };
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
      console.log('useSecondaryIDSave mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error saving photo',
        severity: 'error',
      });
      return err;
    },
  });
};
