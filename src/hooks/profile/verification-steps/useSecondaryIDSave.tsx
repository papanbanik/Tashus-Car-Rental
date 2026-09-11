'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { TSecondaryIDInfo } from '@/types/user-verification/userVerificationTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import environment from '@/utils/configs/environment';
import { useMutation } from '@tanstack/react-query';

const apiUrl = environment?.API_URL || '';

type SecondaryIDSave = {
  userId: string;
  secondaryIdInfo: TSecondaryIDInfo;
};

const saveSecondaryID = async ({ userId, secondaryIdInfo }: SecondaryIDSave) => {
  const response = await axiosClient.put(`${apiUrl}/v2/verification/secondary-id/${userId}`, {
    secondaryIdInfo,
  });
  return response;
};

export const useSecondaryIDSave = () => {
  const { userProfileVerificationInfo, setUserProfileVerificationInfo } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ userId, secondaryIdInfo }: SecondaryIDSave) => saveSecondaryID({ userId, secondaryIdInfo }),
    onSuccess: (data, variables) => {
      const { secondaryIdInfo } = variables;
      const updatedData = {
        ...userProfileVerificationInfo,
        guestVerification: {
          ...userProfileVerificationInfo?.guestVerification,
          secondaryIdInfo: {
            ...secondaryIdInfo,
            status:
              userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isSecondaryIdIncorrect ||
              userProfileVerificationInfo?.guestVerification?.requestVerificationInfo?.verificationInfoFlags?.isSecondaryIdPhotoIncorrect
                ? 'resubmitted'
                : 'pending',
          },
        },
      };
      setUserProfileVerificationInfo(updatedData);
      openSnackBar({
        message: data?.data?.message || 'Secondary Details Saved Successfully',
        severity: 'success',
        hideDuration: 5000,
      });
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
