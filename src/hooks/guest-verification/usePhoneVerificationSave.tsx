'use client';

import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useSearchContext } from '@/context/SearchProvider';
import { useSnackBarContext } from '@/context/SnackBarProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { TPhoneVerification } from '@/types/checkout/guestVerificationTypes';
import axiosClient from '@/utils/configs/axiosInstance';
import { useMutation } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type TPhoneNumberSave = {
  userId: string;
  phoneNumberInfo: TPhoneVerification;
};

const savePhoneNumber = async ({ userId, phoneNumberInfo }: TPhoneNumberSave) => {
  // console.log(userId, phoneNumberInfo);

  const response = await axiosClient.put(`${apiUrl}/verify/phone-update/${userId}`, {
    ...phoneNumberInfo,
  });
  return response;
};

export const usePhoneVerificationSave = () => {
  const { userProfileInfo, setUserProfileInfo } = useUserCredContext();
  const { openSnackBar } = useSnackBarContext();
  const { setCustomMessage } = useSearchContext();
  const { setOTPVerifyAttempt, setTimeInterval, setPhoneVerificationDetails, setUserProfileVerificationInfo, userProfileVerificationInfo } =
    useProfileInfoContext();

  return useMutation({
    mutationFn: ({ userId, phoneNumberInfo }: TPhoneNumberSave) => savePhoneNumber({ userId, phoneNumberInfo }),
    onSuccess: (data, variables) => {
      // console.log(data);
      const { phoneNumberInfo } = variables;
      // console.log(phoneNumberInfo);
      phoneNumberInfo.isVerified = false;
      const updatedUserProfile = {
        ...userProfileInfo,
        verificationInfo: {
          ...userProfileInfo.verificationInfo,
          phone: { ...phoneNumberInfo },
        },
      };
      // console.log('Data Phone Number', data);
      //set attempt times and timer
      // setOTPVerifyAttempt((prev) => {
      //   const newAttempt = prev + 1;
      //   if (newAttempt === 1) setTimeInterval(60); // 1 minute
      //   else if (newAttempt === 2) setTimeInterval(180); // 3 minutes
      //   else if (newAttempt === 3) setTimeInterval(300); // 5 minutes
      //   else setTimeInterval(600); // 10 minutes
      //   return newAttempt;
      // });
      if (data?.data?.data?.length > 0) {
        setOTPVerifyAttempt(data?.data?.data[0]?.otpRequests);
        setPhoneVerificationDetails(data?.data?.data[0]);
      }
      setUserProfileInfo(updatedUserProfile);
      setCustomMessage(data?.data?.message);
      const updatedUserProfileVerification = {
        ...userProfileVerificationInfo,
        profileInfo: {
          ...userProfileVerificationInfo?.profileInfo,
          verificationInfo: {
            ...userProfileVerificationInfo?.profileInfo?.verificationInfo,
            phone: { ...phoneNumberInfo },
          },
        },
      };
      setUserProfileVerificationInfo(updatedUserProfileVerification);
      openSnackBar({
        message: data?.data?.message || 'OTP sent Successfully',
        severity: 'success',
      });
    },
    onError: (err: any) => {
      console.log('usePhoneVerificationSave mutation error', err);
      openSnackBar({
        message: err?.response?.data?.message || 'Error OTP Send',
        severity: 'error',
      });
      return err;
    },
  });
};
