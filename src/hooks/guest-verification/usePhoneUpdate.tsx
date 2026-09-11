'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TPhoneNumberSave = {
  userId?: string;
  email?: string;
  otp: number;
};

const savePhoneNumber = async ({ userId, email, otp }: TPhoneNumberSave) => {
  const response = await axiosClient.put(`${apiUrl}/verify/verify-phone-otp/${userId}`, {
    email,
    otp,
  });
  return response;
};

export const usePhoneUpdate = () => {
  const { userProfileInfo, setUserProfileInfo } = useUserCredContext();
  const { userProfileVerificationInfo, setUserProfileVerificationInfo } = useProfileInfoContext();
  const { openSnackBar } = useSnackBarContext();
  return useMutation({
    mutationFn: ({ userId, email, otp }: TPhoneNumberSave) => savePhoneNumber({ userId, email, otp }),
    onSuccess: (data) => {
      const updatedUserProfile = {
        //should removed later
        ...userProfileInfo,
        verificationInfo: {
          ...userProfileInfo.verificationInfo,
          phone: {
            ...userProfileInfo?.verificationInfo?.phone,
            isVerified: true,
          },
        },
      };
      setUserProfileInfo(updatedUserProfile); //should removed later
      const updatedUserProfileVerification = {
        ...userProfileVerificationInfo,
        profileInfo: {
          ...userProfileVerificationInfo?.profileInfo,
          verificationInfo: {
            ...userProfileVerificationInfo?.profileInfo?.verificationInfo,
            phone: {
              ...userProfileVerificationInfo?.profileInfo?.verificationInfo?.phone,
              isVerified: true,
            },
          },
        },
      };
      setUserProfileVerificationInfo(updatedUserProfileVerification);
      openSnackBar({
        message: data?.data?.message || 'OTP Verified',
        severity: 'success',
        hideDuration: 4000,
      });
    },
    onError: (err: any) => {
      openSnackBar({
        message: err?.response?.data?.message || 'Invalid or Expired OTP',
        severity: 'error',
      });
      return err;
    },
  });
};
